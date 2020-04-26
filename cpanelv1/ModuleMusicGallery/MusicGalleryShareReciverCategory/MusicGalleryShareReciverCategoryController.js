app.controller("musicGalleryShareReciverCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var musicGalleryShareReciverCategory = this;
    //For Grid Options
    musicGalleryShareReciverCategory.gridOptions = {};
    musicGalleryShareReciverCategory.selectedItem = {};
    musicGalleryShareReciverCategory.attachedFiles = [];
    musicGalleryShareReciverCategory.attachedFile = "";

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    var todayDate = moment().format();

    musicGalleryShareReciverCategory.ToDate = {
        defaultDate: todayDate
    }
    musicGalleryShareReciverCategory.FromDate = {
        defaultDate: todayDate
    }
    musicGalleryShareReciverCategory.testDate = moment().format();
    if (itemRecordStatus != undefined) musicGalleryShareReciverCategory.itemRecordStatus = itemRecordStatus;

    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    musicGalleryShareReciverCategory.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "musicGalleryShareReciverCategoryController") {
            localStorage.setItem('AddRequest', '');
            musicGalleryShareReciverCategory.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }

    musicGalleryShareReciverCategory.LinkShareReciverCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareReciverCategoryId',
        url: 'MusicGalleryCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        showAddDialog: false,
        scope: musicGalleryShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    //musicGallery Grid Options
    musicGalleryShareReciverCategory.LinkShareServerCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareServerCategoryId',
        url: 'MusicGalleryShareServerCategory',
        Action:'GetAllOtherSite',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        showAddDialog: false,
        scope: musicGalleryShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    musicGalleryShareReciverCategory.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'virtual_ShareServerCategory.Title', displayName: ' عنوان اشتراک', sortable: true, type: 'string' },
            { name: 'virtual_ShareReciverCategory.Title', displayName: ' عنوان اشتراک گیری', sortable: true, type: 'string' },
            { name: 'LinkShareReciverCategoryId', displayName: 'کد سیستمی اشتراک گیری', sortable: true, type: 'integer', visible: true },
            { name: 'LinkShareServerCategoryId', displayName: 'کد سیستمی اشتراک', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'FromDate', displayName: 'از تاریخ', sortable: true, type: 'date', visible: 'true' },
            { name: 'ToDate', displayName: 'تا تاریخ', sortable: true, type: 'date', visible: 'true' },

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }
    //For Show Category Loading Indicator
    musicGalleryShareReciverCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show musicGallery Loading Indicator
    musicGalleryShareReciverCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    musicGalleryShareReciverCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    musicGalleryShareReciverCategory.treeConfig.currentNode = {};
    musicGalleryShareReciverCategory.treeBusyIndicator = false;

    musicGalleryShareReciverCategory.addRequested = false;

    musicGalleryShareReciverCategory.showGridComment = false;
    musicGalleryShareReciverCategory.musicGalleryTitle = "";

    //init Function
    musicGalleryShareReciverCategory.init = function () {
        musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = musicGalleryShareReciverCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"MusicGalleryShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            musicGalleryShareReciverCategory.treeConfig.Items = response.ListItems;
            musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        musicGalleryShareReciverCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"musicGalleryShareReciverCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            musicGalleryShareReciverCategory.ListItems = response.ListItems;
            musicGalleryShareReciverCategory.gridOptions.fillData(musicGalleryShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            musicGalleryShareReciverCategory.contentBusyIndicator.isActive = false;
            musicGalleryShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            musicGalleryShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            musicGalleryShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            musicGalleryShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            musicGalleryShareReciverCategory.contentBusyIndicator.isActive = false;
        });
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        musicGalleryShareReciverCategory.checkRequestAddNewItemFromOtherControl(null);
    };

    // Open Add Category Modal 
    musicGalleryShareReciverCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        musicGalleryShareReciverCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            musicGalleryShareReciverCategory.selectedItem = response.Item;
            //Set dataForTheTree
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                musicGalleryShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(musicGalleryShareReciverCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleMusicGallery/MusicGalleryShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    musicGalleryShareReciverCategory.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //-----
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Open Edit Category Modal
    musicGalleryShareReciverCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        musicGalleryShareReciverCategory.addRequested = false;
        musicGalleryShareReciverCategory.modalTitle = 'ویرایش';
        if (!musicGalleryShareReciverCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        musicGalleryShareReciverCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryShareMainAdminSetting/GetOne', musicGalleryShareReciverCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            musicGalleryShareReciverCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            musicGalleryShareReciverCategory.selectedItem = response.Item;
            //Set dataForTheTree
            musicGalleryShareReciverCategory.selectedNode = [];
            musicGalleryShareReciverCategory.expandedNodes = [];
            musicGalleryShareReciverCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                musicGalleryShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(musicGalleryShareReciverCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (musicGalleryShareReciverCategory.selectedItem.LinkMainImageId > 0)
                        musicGalleryShareReciverCategory.onSelection({ Id: musicGalleryShareReciverCategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleMusicGallery/MusicGalleryShareMainAdminSetting/edit.html',
                        scope: $scope
                    });
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //---
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Category
    musicGalleryShareReciverCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;
        musicGalleryShareReciverCategory.addRequested = true;
        musicGalleryShareReciverCategory.selectedItem.LinkParentId = null;
        if (musicGalleryShareReciverCategory.treeConfig.currentNode != null)
            musicGalleryShareReciverCategory.selectedItem.LinkParentId = musicGalleryShareReciverCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryShareMainAdminSetting/add', musicGalleryShareReciverCategory.selectedItem, 'POST').success(function (response) {
            musicGalleryShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                musicGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                musicGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                musicGalleryShareReciverCategory.gridOptions.reGetAll();
                musicGalleryShareReciverCategory.closeModal();
            }
            musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            musicGalleryShareReciverCategory.addRequested = false;
            musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    musicGalleryShareReciverCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;
        musicGalleryShareReciverCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryShareMainAdminSetting/edit', musicGalleryShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            //musicGalleryShareReciverCategory.showbusy = false;
            musicGalleryShareReciverCategory.treeConfig.showbusy = false;
            musicGalleryShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                musicGalleryShareReciverCategory.treeConfig.currentNode.Title = response.Item.Title;
                musicGalleryShareReciverCategory.closeModal();
            }
            musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            musicGalleryShareReciverCategory.addRequested = false;
            musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    musicGalleryShareReciverCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = musicGalleryShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    musicGalleryShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(musicGalleryShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryShareMainAdminSetting/delete', musicGalleryShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //musicGalleryShareReciverCategory.replaceCategoryItem(musicGalleryShareReciverCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            musicGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            musicGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            musicGalleryShareReciverCategory.gridOptions.fillData();
                            musicGalleryShareReciverCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    musicGalleryShareReciverCategory.treeConfig.onNodeSelect = function () {
        var node = musicGalleryShareReciverCategory.treeConfig.currentNode;
        musicGalleryShareReciverCategory.showGridComment = false;
        musicGalleryShareReciverCategory.selectContent(node);

    };
    //Show Content with Category Id
    musicGalleryShareReciverCategory.selectContent = function (node) {
        musicGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
        musicGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            musicGalleryShareReciverCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            musicGalleryShareReciverCategory.contentBusyIndicator.isActive = true;
            musicGalleryShareReciverCategory.attachedFiles = null;
            musicGalleryShareReciverCategory.attachedFiles = [];
            var s = {
                PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            musicGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"musicGalleryShareReciverCategory/getall", musicGalleryShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            musicGalleryShareReciverCategory.contentBusyIndicator.isActive = false;
            musicGalleryShareReciverCategory.ListItems = response.ListItems;
            musicGalleryShareReciverCategory.gridOptions.fillData(musicGalleryShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            musicGalleryShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            musicGalleryShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            musicGalleryShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            musicGalleryShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    musicGalleryShareReciverCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = musicGalleryShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        musicGalleryShareReciverCategory.addRequested = false;
        musicGalleryShareReciverCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'musicGalleryShareReciverCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            musicGalleryShareReciverCategory.selectedItem = response.Item;
            musicGalleryShareReciverCategory.selectedItem.LinkShareServerCategoryId = node.Id;
            musicGalleryShareReciverCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModulemusicGallery/musicGalleryShareReciverCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    musicGalleryShareReciverCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        musicGalleryShareReciverCategory.addRequested = false;
        musicGalleryShareReciverCategory.modalTitle = 'ویرایش';
        if (!musicGalleryShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'musicGalleryShareReciverCategory/GetOne', musicGalleryShareReciverCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            musicGalleryShareReciverCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModulemusicGallery/musicGalleryShareReciverCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    musicGalleryShareReciverCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;
        musicGalleryShareReciverCategory.addRequested = true;

        if (musicGalleryShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || musicGalleryShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'musicGalleryShareReciverCategory/add', musicGalleryShareReciverCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                musicGalleryShareReciverCategory.checkRequestAddNewItemFromOtherControl(response.Item.Id);

                musicGalleryShareReciverCategory.ListItems.unshift(response.Item);
                musicGalleryShareReciverCategory.gridOptions.fillData(musicGalleryShareReciverCategory.ListItems);
                musicGalleryShareReciverCategory.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            musicGalleryShareReciverCategory.addRequested = false;
            musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    musicGalleryShareReciverCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;
        musicGalleryShareReciverCategory.addRequested = true;

        if (musicGalleryShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || musicGalleryShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'musicGalleryShareReciverCategory/edit', musicGalleryShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
            musicGalleryShareReciverCategory.addRequested = false;
            musicGalleryShareReciverCategory.treeConfig.showbusy = false;
            musicGalleryShareReciverCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                musicGalleryShareReciverCategory.replaceItem(musicGalleryShareReciverCategory.selectedItem.Id, response.Item);
                musicGalleryShareReciverCategory.gridOptions.fillData(musicGalleryShareReciverCategory.ListItems);
                musicGalleryShareReciverCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            musicGalleryShareReciverCategory.addRequested = false;
            musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a musicGallery Content 
    musicGalleryShareReciverCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!musicGalleryShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        musicGalleryShareReciverCategory.treeConfig.showbusy = true;
        musicGalleryShareReciverCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;
                console.log(musicGalleryShareReciverCategory.gridOptions.selectedRow.item);
                musicGalleryShareReciverCategory.showbusy = true;
                musicGalleryShareReciverCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"musicGalleryShareReciverCategory/GetOne", musicGalleryShareReciverCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    musicGalleryShareReciverCategory.showbusy = false;
                    musicGalleryShareReciverCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    musicGalleryShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(musicGalleryShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"musicGalleryShareReciverCategory/delete", musicGalleryShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
                        musicGalleryShareReciverCategory.treeConfig.showbusy = false;
                        musicGalleryShareReciverCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            musicGalleryShareReciverCategory.replaceItem(musicGalleryShareReciverCategory.selectedItemForDelete.Id);
                            musicGalleryShareReciverCategory.gridOptions.fillData(musicGalleryShareReciverCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        musicGalleryShareReciverCategory.treeConfig.showbusy = false;
                        musicGalleryShareReciverCategory.showIsBusy = false;
                        musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    musicGalleryShareReciverCategory.treeConfig.showbusy = false;
                    musicGalleryShareReciverCategory.showIsBusy = false;
                    musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }





    ////Replace Item OnDelete/OnEdit Grid Options
    musicGalleryShareReciverCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(musicGalleryShareReciverCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = musicGalleryShareReciverCategory.ListItems.indexOf(item);
                musicGalleryShareReciverCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            musicGalleryShareReciverCategory.ListItems.unshift(newItem);
    }


    musicGalleryShareReciverCategory.searchData = function () {
        musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"musicGalleryShareReciverCategory/getall", musicGalleryShareReciverCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            musicGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
            musicGalleryShareReciverCategory.ListItems = response.ListItems;
            musicGalleryShareReciverCategory.gridOptions.fillData(musicGalleryShareReciverCategory.ListItems);
            musicGalleryShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            musicGalleryShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            musicGalleryShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
            musicGalleryShareReciverCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            musicGalleryShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    musicGalleryShareReciverCategory.addRequested = false;
    musicGalleryShareReciverCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    musicGalleryShareReciverCategory.showIsBusy = false;



    //For reInit Categories
    musicGalleryShareReciverCategory.gridOptions.reGetAll = function () {
        if (musicGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) musicGalleryShareReciverCategory.searchData();
        else musicGalleryShareReciverCategory.init();
    };

    musicGalleryShareReciverCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, musicGalleryShareReciverCategory.treeConfig.currentNode);
    }

    musicGalleryShareReciverCategory.loadFileAndFolder = function (item) {
        musicGalleryShareReciverCategory.treeConfig.currentNode = item;
        console.log(item);
        musicGalleryShareReciverCategory.treeConfig.onNodeSelect(item);
    }

    musicGalleryShareReciverCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            musicGalleryShareReciverCategory.focus = true;
        });
    };
    musicGalleryShareReciverCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            musicGalleryShareReciverCategory.focus1 = true;
        });
    };

    musicGalleryShareReciverCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }


    // End of Upload Modal-----------------------------------------
    musicGalleryShareReciverCategory.columnCheckbox = false;
    musicGalleryShareReciverCategory.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = musicGalleryShareReciverCategory.gridOptions.columns;
        if (musicGalleryShareReciverCategory.gridOptions.columnCheckbox) {
            for (var i = 0; i < musicGalleryShareReciverCategory.gridOptions.columns.length; i++) {
                //musicGalleryShareReciverCategory.gridOptions.columns[i].visible = $("#" + musicGalleryShareReciverCategory.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + musicGalleryShareReciverCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                musicGalleryShareReciverCategory.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < musicGalleryShareReciverCategory.gridOptions.columns.length; i++) {
                var element = $("#" + musicGalleryShareReciverCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + musicGalleryShareReciverCategory.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < musicGalleryShareReciverCategory.gridOptions.columns.length; i++) {
            console.log(musicGalleryShareReciverCategory.gridOptions.columns[i].name.concat(".visible: "), musicGalleryShareReciverCategory.gridOptions.columns[i].visible);
        }
        musicGalleryShareReciverCategory.gridOptions.columnCheckbox = !musicGalleryShareReciverCategory.gridOptions.columnCheckbox;
    }
    //Export Report 
    musicGalleryShareReciverCategory.exportFile = function () {
        musicGalleryShareReciverCategory.addRequested = true;
        musicGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.ExportFile = musicGalleryShareReciverCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'musicGalleryShareReciverCategory/exportfile', musicGalleryShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            musicGalleryShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                musicGalleryShareReciverCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //musicGalleryShareReciverCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    musicGalleryShareReciverCategory.toggleExportForm = function () {
        musicGalleryShareReciverCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        musicGalleryShareReciverCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        musicGalleryShareReciverCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        musicGalleryShareReciverCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        musicGalleryShareReciverCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleMusicGallery/musicGalleryShareReciverCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    musicGalleryShareReciverCategory.rowCountChanged = function () {
        if (!angular.isDefined(musicGalleryShareReciverCategory.ExportFileClass.RowCount) || musicGalleryShareReciverCategory.ExportFileClass.RowCount > 5000)
            musicGalleryShareReciverCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    musicGalleryShareReciverCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"musicGalleryShareReciverCategory/count", musicGalleryShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            musicGalleryShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            musicGalleryShareReciverCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            musicGalleryShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    musicGalleryShareReciverCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            musicGalleryShareReciverCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    musicGalleryShareReciverCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (musicGalleryShareReciverCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    musicGalleryShareReciverCategory.onNodeToggle = function (node, expanded) {
        if (expanded) {
            node.Children = [];
            var filterModel = { Filters: [] };
            var originalName = node.Title;
            node.messageText = " در حال بارگذاری...";
            filterModel.Filters.push({ PropertyName: "LinkParentId", SearchType: 0, IntValue1: node.Id });
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/GetAll", filterModel, 'POST').success(function (response1) {
                angular.forEach(response1.ListItems, function (value, key) {
                    node.Children.push(value);
                });
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", node.Id, 'POST').success(function (response2) {
                    angular.forEach(response2.ListItems, function (value, key) {
                        node.Children.push(value);
                    });
                    node.messageText = "";
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
        }
    }

    musicGalleryShareReciverCategory.onSelection = function (node, selected) {
        if (!selected) {
            musicGalleryShareReciverCategory.selectedItem.LinkMainImageId = null;
            musicGalleryShareReciverCategory.selectedItem.previewImageSrc = null;
            return;
        }
        musicGalleryShareReciverCategory.selectedItem.LinkMainImageId = node.Id;
        musicGalleryShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            musicGalleryShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
