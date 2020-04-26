app.controller("biographyShareReciverCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var biographyShareReciverCategory = this;
    //For Grid Options
    biographyShareReciverCategory.gridOptions = {};
    biographyShareReciverCategory.selectedItem = {};
    biographyShareReciverCategory.attachedFiles = [];
    biographyShareReciverCategory.attachedFile = "";
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    biographyShareReciverCategory.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "biographyShareReciverCategoryController") {
            localStorage.setItem('AddRequest', '');
            biographyShareReciverCategory.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    var todayDate = moment().format();

    biographyShareReciverCategory.ToDate = {
        defaultDate: todayDate
    }
    biographyShareReciverCategory.FromDate = {
        defaultDate: todayDate
    }
    biographyShareReciverCategory.testDate = moment().format();
    if (itemRecordStatus != undefined) biographyShareReciverCategory.itemRecordStatus = itemRecordStatus;


    biographyShareReciverCategory.LinkShareReciverCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareReciverCategoryId',
        url: 'BiographyCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: biographyShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    //biography Grid Options
    biographyShareReciverCategory.LinkShareServerCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareServerCategoryId',
        url: 'biographyShareReciverCategory',
        Action:'GetAllOtherSite',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        scope: biographyShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    biographyShareReciverCategory.gridOptions = {
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
    biographyShareReciverCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show biography Loading Indicator
    biographyShareReciverCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    biographyShareReciverCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    biographyShareReciverCategory.treeConfig.currentNode = {};
    biographyShareReciverCategory.treeBusyIndicator = false;

    biographyShareReciverCategory.addRequested = false;

    biographyShareReciverCategory.showGridComment = false;
    biographyShareReciverCategory.biographyTitle = "";

    //init Function
    biographyShareReciverCategory.init = function () {
        biographyShareReciverCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = biographyShareReciverCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        biographyShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"BiographyShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            biographyShareReciverCategory.treeConfig.Items = response.ListItems;
            biographyShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        biographyShareReciverCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"biographyShareReciverCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            biographyShareReciverCategory.ListItems = response.ListItems;
            biographyShareReciverCategory.gridOptions.fillData(biographyShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            biographyShareReciverCategory.contentBusyIndicator.isActive = false;
            biographyShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            biographyShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            biographyShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            biographyShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            biographyShareReciverCategory.contentBusyIndicator.isActive = false;
            });
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        biographyShareReciverCategory.checkRequestAddNewItemFromOtherControl(null);

    };

    // Open Add Category Modal 
    biographyShareReciverCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        biographyShareReciverCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'BiographyShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            biographyShareReciverCategory.selectedItem = response.Item;
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
                biographyShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(biographyShareReciverCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleBiography/BiographyShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    biographyShareReciverCategory.addRequested = false;
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
    biographyShareReciverCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        biographyShareReciverCategory.addRequested = false;
        biographyShareReciverCategory.modalTitle = 'ویرایش';
        if (!biographyShareReciverCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        biographyShareReciverCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'BiographyShareMainAdminSetting/GetOne', biographyShareReciverCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            biographyShareReciverCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            biographyShareReciverCategory.selectedItem = response.Item;
            //Set dataForTheTree
            biographyShareReciverCategory.selectedNode = [];
            biographyShareReciverCategory.expandedNodes = [];
            biographyShareReciverCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                biographyShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(biographyShareReciverCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (biographyShareReciverCategory.selectedItem.LinkMainImageId > 0)
                        biographyShareReciverCategory.onSelection({ Id: biographyShareReciverCategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleBiography/BiographyShareMainAdminSetting/edit.html',
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
    biographyShareReciverCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        biographyShareReciverCategory.categoryBusyIndicator.isActive = true;
        biographyShareReciverCategory.addRequested = true;
        biographyShareReciverCategory.selectedItem.LinkParentId = null;
        if (biographyShareReciverCategory.treeConfig.currentNode != null)
            biographyShareReciverCategory.selectedItem.LinkParentId = biographyShareReciverCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'BiographyShareMainAdminSetting/add', biographyShareReciverCategory.selectedItem, 'POST').success(function (response) {
            biographyShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                biographyShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                biographyShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                biographyShareReciverCategory.gridOptions.reGetAll();
                biographyShareReciverCategory.closeModal();
            }
            biographyShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyShareReciverCategory.addRequested = false;
            biographyShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    biographyShareReciverCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        biographyShareReciverCategory.categoryBusyIndicator.isActive = true;
        biographyShareReciverCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'BiographyShareMainAdminSetting/edit', biographyShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            //biographyShareReciverCategory.showbusy = false;
            biographyShareReciverCategory.treeConfig.showbusy = false;
            biographyShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                biographyShareReciverCategory.treeConfig.currentNode.Title = response.Item.Title;
                biographyShareReciverCategory.closeModal();
            }
            biographyShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyShareReciverCategory.addRequested = false;
            biographyShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    biographyShareReciverCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = biographyShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                biographyShareReciverCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'BiographyShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    biographyShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(biographyShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'BiographyShareMainAdminSetting/delete', biographyShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        biographyShareReciverCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //biographyShareReciverCategory.replaceCategoryItem(biographyShareReciverCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            biographyShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            biographyShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            biographyShareReciverCategory.gridOptions.fillData();
                            biographyShareReciverCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        biographyShareReciverCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    biographyShareReciverCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    biographyShareReciverCategory.treeConfig.onNodeSelect = function () {
        var node = biographyShareReciverCategory.treeConfig.currentNode;
        biographyShareReciverCategory.showGridComment = false;
        biographyShareReciverCategory.selectContent(node);

    };
    //Show Content with Category Id
    biographyShareReciverCategory.selectContent = function (node) {

        biographyShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
        biographyShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            biographyShareReciverCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            biographyShareReciverCategory.contentBusyIndicator.isActive = true;

            biographyShareReciverCategory.attachedFiles = null;
            biographyShareReciverCategory.attachedFiles = [];
            var s = {
                PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            biographyShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"biographyShareReciverCategory/getall", biographyShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            biographyShareReciverCategory.contentBusyIndicator.isActive = false;
            biographyShareReciverCategory.ListItems = response.ListItems;
            biographyShareReciverCategory.gridOptions.fillData(biographyShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            biographyShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            biographyShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            biographyShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            biographyShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    biographyShareReciverCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = biographyShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Biography_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        biographyShareReciverCategory.addRequested = false;
        biographyShareReciverCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'biographyShareReciverCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            biographyShareReciverCategory.selectedItem = response.Item;
            biographyShareReciverCategory.selectedItem.LinkShareServerCategoryId = node.Id;
            biographyShareReciverCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/Modulebiography/biographyShareReciverCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    biographyShareReciverCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        biographyShareReciverCategory.addRequested = false;
        biographyShareReciverCategory.modalTitle = 'ویرایش';
        if (!biographyShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'biographyShareReciverCategory/GetOne', biographyShareReciverCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            biographyShareReciverCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulebiography/biographyShareReciverCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    biographyShareReciverCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        biographyShareReciverCategory.categoryBusyIndicator.isActive = true;
        biographyShareReciverCategory.addRequested = true;

        if (biographyShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || biographyShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Biography_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'biographyShareReciverCategory/add', biographyShareReciverCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            biographyShareReciverCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                biographyShareReciverCategory.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                biographyShareReciverCategory.ListItems.unshift(response.Item);
                biographyShareReciverCategory.gridOptions.fillData(biographyShareReciverCategory.ListItems);
                biographyShareReciverCategory.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyShareReciverCategory.addRequested = false;
            biographyShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    biographyShareReciverCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        biographyShareReciverCategory.categoryBusyIndicator.isActive = true;
        biographyShareReciverCategory.addRequested = true;

        if (biographyShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || biographyShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Biography_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'biographyShareReciverCategory/edit', biographyShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            biographyShareReciverCategory.categoryBusyIndicator.isActive = false;
            biographyShareReciverCategory.addRequested = false;
            biographyShareReciverCategory.treeConfig.showbusy = false;
            biographyShareReciverCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                biographyShareReciverCategory.replaceItem(biographyShareReciverCategory.selectedItem.Id, response.Item);
                biographyShareReciverCategory.gridOptions.fillData(biographyShareReciverCategory.ListItems);
                biographyShareReciverCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyShareReciverCategory.addRequested = false;
            biographyShareReciverCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a biography Content 
    biographyShareReciverCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!biographyShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        biographyShareReciverCategory.treeConfig.showbusy = true;
        biographyShareReciverCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                biographyShareReciverCategory.categoryBusyIndicator.isActive = true;
                console.log(biographyShareReciverCategory.gridOptions.selectedRow.item);
                biographyShareReciverCategory.showbusy = true;
                biographyShareReciverCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"biographyShareReciverCategory/GetOne", biographyShareReciverCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    biographyShareReciverCategory.showbusy = false;
                    biographyShareReciverCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    biographyShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(biographyShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"biographyShareReciverCategory/delete", biographyShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        biographyShareReciverCategory.categoryBusyIndicator.isActive = false;
                        biographyShareReciverCategory.treeConfig.showbusy = false;
                        biographyShareReciverCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            biographyShareReciverCategory.replaceItem(biographyShareReciverCategory.selectedItemForDelete.Id);
                            biographyShareReciverCategory.gridOptions.fillData(biographyShareReciverCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        biographyShareReciverCategory.treeConfig.showbusy = false;
                        biographyShareReciverCategory.showIsBusy = false;
                        biographyShareReciverCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    biographyShareReciverCategory.treeConfig.showbusy = false;
                    biographyShareReciverCategory.showIsBusy = false;
                    biographyShareReciverCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }





    ////Replace Item OnDelete/OnEdit Grid Options
    biographyShareReciverCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(biographyShareReciverCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = biographyShareReciverCategory.ListItems.indexOf(item);
                biographyShareReciverCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            biographyShareReciverCategory.ListItems.unshift(newItem);
    }


    biographyShareReciverCategory.searchData = function () {
        biographyShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"biographyShareReciverCategory/getall", biographyShareReciverCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            biographyShareReciverCategory.categoryBusyIndicator.isActive = false;
            biographyShareReciverCategory.ListItems = response.ListItems;
            biographyShareReciverCategory.gridOptions.fillData(biographyShareReciverCategory.ListItems);
            biographyShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            biographyShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            biographyShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
            biographyShareReciverCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            biographyShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    biographyShareReciverCategory.addRequested = false;
    biographyShareReciverCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    biographyShareReciverCategory.showIsBusy = false;



    //For reInit Categories
    biographyShareReciverCategory.gridOptions.reGetAll = function () {
        if (biographyShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) biographyShareReciverCategory.searchData();
        else biographyShareReciverCategory.init();
    };

    biographyShareReciverCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, biographyShareReciverCategory.treeConfig.currentNode);
    }

    biographyShareReciverCategory.loadFileAndFolder = function (item) {
        biographyShareReciverCategory.treeConfig.currentNode = item;
        console.log(item);
        biographyShareReciverCategory.treeConfig.onNodeSelect(item);
    }

    biographyShareReciverCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            biographyShareReciverCategory.focus = true;
        });
    };
    biographyShareReciverCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            biographyShareReciverCategory.focus1 = true;
        });
    };

    biographyShareReciverCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }


    // End of Upload Modal-----------------------------------------
    biographyShareReciverCategory.columnCheckbox = false;
    biographyShareReciverCategory.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (biographyShareReciverCategory.gridOptions.columnCheckbox) {
            for (var i = 0; i < biographyShareReciverCategory.gridOptions.columns.length; i++) {
                //biographyShareReciverCategory.gridOptions.columns[i].visible = $("#" + biographyShareReciverCategory.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + biographyShareReciverCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                biographyShareReciverCategory.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = biographyShareReciverCategory.gridOptions.columns;
            for (var i = 0; i < biographyShareReciverCategory.gridOptions.columns.length; i++) {
                biographyShareReciverCategory.gridOptions.columns[i].visible = true;
                var element = $("#" + biographyShareReciverCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + biographyShareReciverCategory.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < biographyShareReciverCategory.gridOptions.columns.length; i++) {
            console.log(biographyShareReciverCategory.gridOptions.columns[i].name.concat(".visible: "), biographyShareReciverCategory.gridOptions.columns[i].visible);
        }
        biographyShareReciverCategory.gridOptions.columnCheckbox = !biographyShareReciverCategory.gridOptions.columnCheckbox;
    }
    //Export Report 
    biographyShareReciverCategory.exportFile = function () {
        biographyShareReciverCategory.addRequested = true;
        biographyShareReciverCategory.gridOptions.advancedSearchData.engine.ExportFile = biographyShareReciverCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'biographyShareReciverCategory/exportfile', biographyShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            biographyShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                biographyShareReciverCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //biographyShareReciverCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    biographyShareReciverCategory.toggleExportForm = function () {
        biographyShareReciverCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        biographyShareReciverCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        biographyShareReciverCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        biographyShareReciverCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        biographyShareReciverCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleBiography/biographyShareReciverCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    biographyShareReciverCategory.rowCountChanged = function () {
        if (!angular.isDefined(biographyShareReciverCategory.ExportFileClass.RowCount) || biographyShareReciverCategory.ExportFileClass.RowCount > 5000)
            biographyShareReciverCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    biographyShareReciverCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"biographyShareReciverCategory/count", biographyShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            biographyShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            biographyShareReciverCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            biographyShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    biographyShareReciverCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            biographyShareReciverCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    biographyShareReciverCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (biographyShareReciverCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    biographyShareReciverCategory.onNodeToggle = function (node, expanded) {
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

    biographyShareReciverCategory.onSelection = function (node, selected) {
        if (!selected) {
            biographyShareReciverCategory.selectedItem.LinkMainImageId = null;
            biographyShareReciverCategory.selectedItem.previewImageSrc = null;
            return;
        }
        biographyShareReciverCategory.selectedItem.LinkMainImageId = node.Id;
        biographyShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            biographyShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
