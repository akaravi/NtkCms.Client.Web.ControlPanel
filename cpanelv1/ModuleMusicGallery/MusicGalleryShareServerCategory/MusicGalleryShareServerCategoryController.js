app.controller("musicGalleryShareServerCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var musicGalleryShareServerCategory = this;
    //For Grid Options
    musicGalleryShareServerCategory.gridOptions = {};
    musicGalleryShareServerCategory.selectedItem = {};
    musicGalleryShareServerCategory.attachedFiles = [];
    musicGalleryShareServerCategory.attachedFile = "";

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) musicGalleryShareServerCategory.itemRecordStatus = itemRecordStatus;

    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    musicGalleryShareServerCategory.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "musicGalleryShareServerCategoryController") {
            localStorage.setItem('AddRequest', '');
            musicGalleryShareServerCategory.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    
    musicGalleryShareServerCategory.LinkShareMainAdminSettingIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkServerCategoryId',
        url: 'MusicGalleryCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        showAddDialog: false,
        scope: musicGalleryShareServerCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    //musicGallery Grid Options
                      
    musicGalleryShareServerCategory.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'virtual_ServerCategory.Title', displayName: 'عنوان دسته', sortable: true, type: 'string', visible: 'true' },
            { name: 'LinkServerCategoryId', displayName: 'کد سیستمی دسته', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }
    //For Show Category Loading Indicator
    musicGalleryShareServerCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show musicGallery Loading Indicator
    musicGalleryShareServerCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    musicGalleryShareServerCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    musicGalleryShareServerCategory.treeConfig.currentNode = {};
    musicGalleryShareServerCategory.treeBusyIndicator = false;

    musicGalleryShareServerCategory.addRequested = false;

    musicGalleryShareServerCategory.showGridComment = false;
    musicGalleryShareServerCategory.musicGalleryTitle = "";

    //init Function
    musicGalleryShareServerCategory.init = function () {
        musicGalleryShareServerCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = musicGalleryShareServerCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        musicGalleryShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"MusicGalleryShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            musicGalleryShareServerCategory.treeConfig.Items = response.ListItems;
            musicGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        musicGalleryShareServerCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"musicGalleryShareServerCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            musicGalleryShareServerCategory.ListItems = response.ListItems;
            musicGalleryShareServerCategory.gridOptions.fillData(musicGalleryShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            musicGalleryShareServerCategory.contentBusyIndicator.isActive = false;
            musicGalleryShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            musicGalleryShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            musicGalleryShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            musicGalleryShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            musicGalleryShareServerCategory.contentBusyIndicator.isActive = false;
        });
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        musicGalleryShareServerCategory.checkRequestAddNewItemFromOtherControl(null);
    };

    // Open Add Category Modal 
    musicGalleryShareServerCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        musicGalleryShareServerCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            musicGalleryShareServerCategory.selectedItem = response.Item;
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
                musicGalleryShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(musicGalleryShareServerCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleMusicGallery/MusicGalleryShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    musicGalleryShareServerCategory.addRequested = false;
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
    musicGalleryShareServerCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        musicGalleryShareServerCategory.addRequested = false;
        musicGalleryShareServerCategory.modalTitle = 'ویرایش';
        if (!musicGalleryShareServerCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        musicGalleryShareServerCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryShareMainAdminSetting/GetOne', musicGalleryShareServerCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            musicGalleryShareServerCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            musicGalleryShareServerCategory.selectedItem = response.Item;
            //Set dataForTheTree
            musicGalleryShareServerCategory.selectedNode = [];
            musicGalleryShareServerCategory.expandedNodes = [];
            musicGalleryShareServerCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                musicGalleryShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(musicGalleryShareServerCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (musicGalleryShareServerCategory.selectedItem.LinkMainImageId > 0)
                        musicGalleryShareServerCategory.onSelection({ Id: musicGalleryShareServerCategory.selectedItem.LinkMainImageId }, true);
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
    musicGalleryShareServerCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        musicGalleryShareServerCategory.categoryBusyIndicator.isActive = true;
        musicGalleryShareServerCategory.addRequested = true;
        musicGalleryShareServerCategory.selectedItem.LinkParentId = null;
        if (musicGalleryShareServerCategory.treeConfig.currentNode != null)
            musicGalleryShareServerCategory.selectedItem.LinkParentId = musicGalleryShareServerCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryShareMainAdminSetting/add', musicGalleryShareServerCategory.selectedItem, 'POST').success(function (response) {
            musicGalleryShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                musicGalleryShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                musicGalleryShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                musicGalleryShareServerCategory.gridOptions.reGetAll();
                musicGalleryShareServerCategory.closeModal();
            }
            musicGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            musicGalleryShareServerCategory.addRequested = false;
            musicGalleryShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    musicGalleryShareServerCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        musicGalleryShareServerCategory.categoryBusyIndicator.isActive = true;
        musicGalleryShareServerCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryShareMainAdminSetting/edit', musicGalleryShareServerCategory.selectedItem, 'PUT').success(function (response) {
            //musicGalleryShareServerCategory.showbusy = false;
            musicGalleryShareServerCategory.treeConfig.showbusy = false;
            musicGalleryShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                musicGalleryShareServerCategory.treeConfig.currentNode.Title = response.Item.Title;
                musicGalleryShareServerCategory.closeModal();
            }
            musicGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            musicGalleryShareServerCategory.addRequested = false;
            musicGalleryShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    musicGalleryShareServerCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = musicGalleryShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                musicGalleryShareServerCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    musicGalleryShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(musicGalleryShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryShareMainAdminSetting/delete', musicGalleryShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        musicGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //musicGalleryShareServerCategory.replaceCategoryItem(musicGalleryShareServerCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            musicGalleryShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            musicGalleryShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            musicGalleryShareServerCategory.gridOptions.fillData();
                            musicGalleryShareServerCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        musicGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    musicGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    musicGalleryShareServerCategory.treeConfig.onNodeSelect = function () {
        var node = musicGalleryShareServerCategory.treeConfig.currentNode;
        musicGalleryShareServerCategory.showGridComment = false;
        musicGalleryShareServerCategory.selectContent(node);

    };
    //Show Content with Category Id
    musicGalleryShareServerCategory.selectContent = function (node) {
        musicGalleryShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
        musicGalleryShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            musicGalleryShareServerCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            musicGalleryShareServerCategory.contentBusyIndicator.isActive = true;
            musicGalleryShareServerCategory.attachedFiles = null;
            musicGalleryShareServerCategory.attachedFiles = [];
            var s = {
                PropertyName: "LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            musicGalleryShareServerCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"musicGalleryShareServerCategory/getall", musicGalleryShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            musicGalleryShareServerCategory.contentBusyIndicator.isActive = false;
            musicGalleryShareServerCategory.ListItems = response.ListItems;
            musicGalleryShareServerCategory.gridOptions.fillData(musicGalleryShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            musicGalleryShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            musicGalleryShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            musicGalleryShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            musicGalleryShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    musicGalleryShareServerCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = musicGalleryShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        musicGalleryShareServerCategory.addRequested = false;
        musicGalleryShareServerCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'musicGalleryShareServerCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            musicGalleryShareServerCategory.selectedItem = response.Item;
            musicGalleryShareServerCategory.selectedItem.LinkShareMainAdminSettingId = node.Id;
            musicGalleryShareServerCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModulemusicGallery/musicGalleryShareServerCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    musicGalleryShareServerCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        musicGalleryShareServerCategory.addRequested = false;
        musicGalleryShareServerCategory.modalTitle = 'ویرایش';
        if (!musicGalleryShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'musicGalleryShareServerCategory/GetOne', musicGalleryShareServerCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            musicGalleryShareServerCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModulemusicGallery/musicGalleryShareServerCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    musicGalleryShareServerCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        musicGalleryShareServerCategory.categoryBusyIndicator.isActive = true;
        musicGalleryShareServerCategory.addRequested = true;

        if (musicGalleryShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || musicGalleryShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'musicGalleryShareServerCategory/add', musicGalleryShareServerCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            musicGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                musicGalleryShareServerCategory.checkRequestAddNewItemFromOtherControl(response.Item.Id);

                musicGalleryShareServerCategory.ListItems.unshift(response.Item);
                musicGalleryShareServerCategory.gridOptions.fillData(musicGalleryShareServerCategory.ListItems);
                musicGalleryShareServerCategory.closeModal();
            
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            musicGalleryShareServerCategory.addRequested = false;
            musicGalleryShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    musicGalleryShareServerCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        musicGalleryShareServerCategory.categoryBusyIndicator.isActive = true;
        musicGalleryShareServerCategory.addRequested = true;
    
        if (musicGalleryShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || musicGalleryShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'musicGalleryShareServerCategory/edit', musicGalleryShareServerCategory.selectedItem, 'PUT').success(function (response) {
            musicGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
            musicGalleryShareServerCategory.addRequested = false;
            musicGalleryShareServerCategory.treeConfig.showbusy = false;
            musicGalleryShareServerCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                musicGalleryShareServerCategory.replaceItem(musicGalleryShareServerCategory.selectedItem.Id, response.Item);
                musicGalleryShareServerCategory.gridOptions.fillData(musicGalleryShareServerCategory.ListItems);
                musicGalleryShareServerCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            musicGalleryShareServerCategory.addRequested = false;
            musicGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a musicGallery Content 
    musicGalleryShareServerCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!musicGalleryShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        musicGalleryShareServerCategory.treeConfig.showbusy = true;
        musicGalleryShareServerCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                musicGalleryShareServerCategory.categoryBusyIndicator.isActive = true;
                console.log(musicGalleryShareServerCategory.gridOptions.selectedRow.item);
                musicGalleryShareServerCategory.showbusy = true;
                musicGalleryShareServerCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"musicGalleryShareServerCategory/GetOne", musicGalleryShareServerCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    musicGalleryShareServerCategory.showbusy = false;
                    musicGalleryShareServerCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    musicGalleryShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(musicGalleryShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"musicGalleryShareServerCategory/delete", musicGalleryShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        musicGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
                        musicGalleryShareServerCategory.treeConfig.showbusy = false;
                        musicGalleryShareServerCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            musicGalleryShareServerCategory.replaceItem(musicGalleryShareServerCategory.selectedItemForDelete.Id);
                            musicGalleryShareServerCategory.gridOptions.fillData(musicGalleryShareServerCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        musicGalleryShareServerCategory.treeConfig.showbusy = false;
                        musicGalleryShareServerCategory.showIsBusy = false;
                        musicGalleryShareServerCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    musicGalleryShareServerCategory.treeConfig.showbusy = false;
                    musicGalleryShareServerCategory.showIsBusy = false;
                    musicGalleryShareServerCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }

    

   

    ////Replace Item OnDelete/OnEdit Grid Options
    musicGalleryShareServerCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(musicGalleryShareServerCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = musicGalleryShareServerCategory.ListItems.indexOf(item);
                musicGalleryShareServerCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            musicGalleryShareServerCategory.ListItems.unshift(newItem);
    }

   
    musicGalleryShareServerCategory.searchData = function () {
        musicGalleryShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"musicGalleryShareServerCategory/getall", musicGalleryShareServerCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            musicGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
            musicGalleryShareServerCategory.ListItems = response.ListItems;
            musicGalleryShareServerCategory.gridOptions.fillData(musicGalleryShareServerCategory.ListItems);
            musicGalleryShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            musicGalleryShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            musicGalleryShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
            musicGalleryShareServerCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            musicGalleryShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    musicGalleryShareServerCategory.addRequested = false;
    musicGalleryShareServerCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    musicGalleryShareServerCategory.showIsBusy = false;

   

    //For reInit Categories
    musicGalleryShareServerCategory.gridOptions.reGetAll = function () {
        if (musicGalleryShareServerCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) musicGalleryShareServerCategory.searchData();
        else musicGalleryShareServerCategory.init();
    };

    musicGalleryShareServerCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, musicGalleryShareServerCategory.treeConfig.currentNode);
    }

    musicGalleryShareServerCategory.loadFileAndFolder = function (item) {
        musicGalleryShareServerCategory.treeConfig.currentNode = item;
        console.log(item);
        musicGalleryShareServerCategory.treeConfig.onNodeSelect(item);
    }

    musicGalleryShareServerCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            musicGalleryShareServerCategory.focus = true;
        });
    };
    musicGalleryShareServerCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            musicGalleryShareServerCategory.focus1 = true;
        });
    };

     musicGalleryShareServerCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

  
   // End of Upload Modal-----------------------------------------
     musicGalleryShareServerCategory.columnCheckbox = false;
     musicGalleryShareServerCategory.openGridConfigModal = function () {
         $("#gridView-btn").toggleClass("active");
         var prechangeColumns = musicGalleryShareServerCategory.gridOptions.columns;
         if (musicGalleryShareServerCategory.gridOptions.columnCheckbox) {
             for (var i = 0; i < musicGalleryShareServerCategory.gridOptions.columns.length; i++) {
                 //musicGalleryShareServerCategory.gridOptions.columns[i].visible = $("#" + musicGalleryShareServerCategory.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                 var element = $("#" + musicGalleryShareServerCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                 var temp = element[0].checked;
                 musicGalleryShareServerCategory.gridOptions.columns[i].visible = temp;
             }
         }
         else {

             for (var i = 0; i < musicGalleryShareServerCategory.gridOptions.columns.length; i++) {
                 var element = $("#" + musicGalleryShareServerCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                 $("#" + musicGalleryShareServerCategory.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
             }
         }
         for (var i = 0; i < musicGalleryShareServerCategory.gridOptions.columns.length; i++) {
             console.log(musicGalleryShareServerCategory.gridOptions.columns[i].name.concat(".visible: "), musicGalleryShareServerCategory.gridOptions.columns[i].visible);
         }
         musicGalleryShareServerCategory.gridOptions.columnCheckbox = !musicGalleryShareServerCategory.gridOptions.columnCheckbox;
     }
    //Export Report 
    musicGalleryShareServerCategory.exportFile = function () {
        musicGalleryShareServerCategory.addRequested = true;
        musicGalleryShareServerCategory.gridOptions.advancedSearchData.engine.ExportFile = musicGalleryShareServerCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'musicGalleryShareServerCategory/exportfile', musicGalleryShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            musicGalleryShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                musicGalleryShareServerCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //musicGalleryShareServerCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    musicGalleryShareServerCategory.toggleExportForm = function () {
        musicGalleryShareServerCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        musicGalleryShareServerCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        musicGalleryShareServerCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        musicGalleryShareServerCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        musicGalleryShareServerCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleMusicGallery/musicGalleryShareServerCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    musicGalleryShareServerCategory.rowCountChanged = function () {
        if (!angular.isDefined(musicGalleryShareServerCategory.ExportFileClass.RowCount) || musicGalleryShareServerCategory.ExportFileClass.RowCount > 5000)
            musicGalleryShareServerCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    musicGalleryShareServerCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"musicGalleryShareServerCategory/count", musicGalleryShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            musicGalleryShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            musicGalleryShareServerCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            musicGalleryShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    musicGalleryShareServerCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            musicGalleryShareServerCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    musicGalleryShareServerCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (musicGalleryShareServerCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    musicGalleryShareServerCategory.onNodeToggle = function (node, expanded) {
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

    musicGalleryShareServerCategory.onSelection = function (node, selected) {
        if (!selected) {
            musicGalleryShareServerCategory.selectedItem.LinkMainImageId = null;
            musicGalleryShareServerCategory.selectedItem.previewImageSrc = null;
            return;
        }
        musicGalleryShareServerCategory.selectedItem.LinkMainImageId = node.Id;
        musicGalleryShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            musicGalleryShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
