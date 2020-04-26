app.controller("fileShareReciverCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$rootScope', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $rootScope, $filter) {
    var fileShareReciverCategory = this;
    //For Grid Options
    fileShareReciverCategory.gridOptions = {};
    fileShareReciverCategory.selectedItem = {};
    fileShareReciverCategory.attachedFiles = [];
    fileShareReciverCategory.attachedFile = "";
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    fileShareReciverCategory.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "fileShareReciverCategoryController") {
            localStorage.setItem('AddRequest', '');
            fileShareReciverCategory.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    var todayDate = moment().format();

    fileShareReciverCategory.ToDate = {
        defaultDate: todayDate
    }
    fileShareReciverCategory.FromDate = {
        defaultDate: todayDate
    }
    fileShareReciverCategory.testDate = moment().format();
    if (itemRecordStatus != undefined) fileShareReciverCategory.itemRecordStatus = itemRecordStatus;


    fileShareReciverCategory.LinkShareReciverCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareReciverCategoryId',
        url: 'CmsFileCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: fileShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    //file Grid Options
    fileShareReciverCategory.LinkShareServerCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareServerCategoryId',
        url: 'CmsFileShareServerCategory',
        Action:'GetAllOtherSite',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        scope: fileShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer'},
                { name: 'ModuleCore.Title', displayName: 'عنوان سایت', sortable: true, type: 'string'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    fileShareReciverCategory.gridOptions = {
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
    fileShareReciverCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show file Loading Indicator
    fileShareReciverCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    fileShareReciverCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    fileShareReciverCategory.treeConfig.currentNode = {};
    fileShareReciverCategory.treeBusyIndicator = false;

    fileShareReciverCategory.addRequested = false;

    fileShareReciverCategory.showGridComment = false;
    fileShareReciverCategory.fileTitle = "";

    //init Function
    fileShareReciverCategory.init = function () {
        fileShareReciverCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = fileShareReciverCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        fileShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"FileShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            fileShareReciverCategory.treeConfig.Items = response.ListItems;
            fileShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        fileShareReciverCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"FileShareReciverCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            fileShareReciverCategory.ListItems = response.ListItems;
            fileShareReciverCategory.gridOptions.fillData(fileShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            fileShareReciverCategory.contentBusyIndicator.isActive = false;
            fileShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            fileShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            fileShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            fileShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            fileShareReciverCategory.contentBusyIndicator.isActive = false;
            });
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        fileShareReciverCategory.checkRequestAddNewItemFromOtherControl(null);

    };

    // Open Add Category Modal 
    fileShareReciverCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        fileShareReciverCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'FileShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            fileShareReciverCategory.selectedItem = response.Item;
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
                fileShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(fileShareReciverCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleFile/FileShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    fileShareReciverCategory.addRequested = false;
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
    fileShareReciverCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        fileShareReciverCategory.addRequested = false;
        fileShareReciverCategory.modalTitle = 'ویرایش';
        if (!fileShareReciverCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        fileShareReciverCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'FileShareMainAdminSetting/GetOne', fileShareReciverCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            fileShareReciverCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            fileShareReciverCategory.selectedItem = response.Item;
            //Set dataForTheTree
            fileShareReciverCategory.selectedNode = [];
            fileShareReciverCategory.expandedNodes = [];
            fileShareReciverCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                fileShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(fileShareReciverCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (fileShareReciverCategory.selectedItem.LinkMainImageId > 0)
                        fileShareReciverCategory.onSelection({ Id: fileShareReciverCategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleFile/FileShareMainAdminSetting/edit.html',
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
    fileShareReciverCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        fileShareReciverCategory.categoryBusyIndicator.isActive = true;
        fileShareReciverCategory.addRequested = true;
        fileShareReciverCategory.selectedItem.LinkParentId = null;
        if (fileShareReciverCategory.treeConfig.currentNode != null)
            fileShareReciverCategory.selectedItem.LinkParentId = fileShareReciverCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'FileShareMainAdminSetting/add', fileShareReciverCategory.selectedItem, 'POST').success(function (response) {
            fileShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                fileShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                fileShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                fileShareReciverCategory.gridOptions.reGetAll();
                fileShareReciverCategory.closeModal();
            }
            fileShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            fileShareReciverCategory.addRequested = false;
            fileShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    fileShareReciverCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        fileShareReciverCategory.categoryBusyIndicator.isActive = true;
        fileShareReciverCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'FileShareMainAdminSetting/edit', fileShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            //fileShareReciverCategory.showbusy = false;
            fileShareReciverCategory.treeConfig.showbusy = false;
            fileShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                fileShareReciverCategory.treeConfig.currentNode.Title = response.Item.Title;
                fileShareReciverCategory.closeModal();
            }
            fileShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            fileShareReciverCategory.addRequested = false;
            fileShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    fileShareReciverCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = fileShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                fileShareReciverCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'FileShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    fileShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(fileShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'FileShareMainAdminSetting/delete', fileShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        fileShareReciverCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //fileShareReciverCategory.replaceCategoryItem(fileShareReciverCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            fileShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            fileShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            fileShareReciverCategory.gridOptions.fillData();
                            fileShareReciverCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        fileShareReciverCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    fileShareReciverCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    fileShareReciverCategory.treeConfig.onNodeSelect = function () {
        var node = fileShareReciverCategory.treeConfig.currentNode;
        fileShareReciverCategory.showGridComment = false;
        fileShareReciverCategory.selectContent(node);

    };
    //Show Content with Category Id
    fileShareReciverCategory.selectContent = function (node) {
        fileShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
        fileShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            fileShareReciverCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            fileShareReciverCategory.contentBusyIndicator.isActive = true;
            fileShareReciverCategory.attachedFiles = null;
            fileShareReciverCategory.attachedFiles = [];
            var s = {
                PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            fileShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"FileShareReciverCategory/getall", fileShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            fileShareReciverCategory.contentBusyIndicator.isActive = false;
            fileShareReciverCategory.ListItems = response.ListItems;
            fileShareReciverCategory.gridOptions.fillData(fileShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            fileShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            fileShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            fileShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            fileShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    fileShareReciverCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = fileShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        fileShareReciverCategory.addRequested = false;
        fileShareReciverCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'FileShareReciverCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            fileShareReciverCategory.selectedItem = response.Item;
            fileShareReciverCategory.selectedItem.LinkShareServerCategoryId = node.Id;
            fileShareReciverCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/Modulefile/fileShareReciverCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    fileShareReciverCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        fileShareReciverCategory.addRequested = false;
        fileShareReciverCategory.modalTitle = 'ویرایش';
        if (!fileShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'FileShareReciverCategory/GetOne', fileShareReciverCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            fileShareReciverCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulefile/fileShareReciverCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    fileShareReciverCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        fileShareReciverCategory.categoryBusyIndicator.isActive = true;
        fileShareReciverCategory.addRequested = true;

        if (fileShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || fileShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'FileShareReciverCategory/add', fileShareReciverCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            fileShareReciverCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                fileShareReciverCategory.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                fileShareReciverCategory.ListItems.unshift(response.Item);
                fileShareReciverCategory.gridOptions.fillData(fileShareReciverCategory.ListItems);
                fileShareReciverCategory.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            fileShareReciverCategory.addRequested = false;
            fileShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    fileShareReciverCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        fileShareReciverCategory.categoryBusyIndicator.isActive = true;
        fileShareReciverCategory.addRequested = true;

        if (fileShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || fileShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'FileShareReciverCategory/edit', fileShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            fileShareReciverCategory.categoryBusyIndicator.isActive = false;
            fileShareReciverCategory.addRequested = false;
            fileShareReciverCategory.treeConfig.showbusy = false;
            fileShareReciverCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                fileShareReciverCategory.replaceItem(fileShareReciverCategory.selectedItem.Id, response.Item);
                fileShareReciverCategory.gridOptions.fillData(fileShareReciverCategory.ListItems);
                fileShareReciverCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            fileShareReciverCategory.addRequested = false;
            fileShareReciverCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a file Content 
    fileShareReciverCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!fileShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        fileShareReciverCategory.treeConfig.showbusy = true;
        fileShareReciverCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                fileShareReciverCategory.categoryBusyIndicator.isActive = true;
                console.log(fileShareReciverCategory.gridOptions.selectedRow.item);
                fileShareReciverCategory.showbusy = true;
                fileShareReciverCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"FileShareReciverCategory/GetOne", fileShareReciverCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    fileShareReciverCategory.showbusy = false;
                    fileShareReciverCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    fileShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(fileShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"FileShareReciverCategory/delete", fileShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        fileShareReciverCategory.categoryBusyIndicator.isActive = false;
                        fileShareReciverCategory.treeConfig.showbusy = false;
                        fileShareReciverCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            fileShareReciverCategory.replaceItem(fileShareReciverCategory.selectedItemForDelete.Id);
                            fileShareReciverCategory.gridOptions.fillData(fileShareReciverCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        fileShareReciverCategory.treeConfig.showbusy = false;
                        fileShareReciverCategory.showIsBusy = false;
                        fileShareReciverCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    fileShareReciverCategory.treeConfig.showbusy = false;
                    fileShareReciverCategory.showIsBusy = false;
                    fileShareReciverCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }





    ////Replace Item OnDelete/OnEdit Grid Options
    fileShareReciverCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(fileShareReciverCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = fileShareReciverCategory.ListItems.indexOf(item);
                fileShareReciverCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            fileShareReciverCategory.ListItems.unshift(newItem);
    }


    fileShareReciverCategory.searchData = function () {
        fileShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"FileShareReciverCategory/getall", fileShareReciverCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            fileShareReciverCategory.categoryBusyIndicator.isActive = false;
            fileShareReciverCategory.ListItems = response.ListItems;
            fileShareReciverCategory.gridOptions.fillData(fileShareReciverCategory.ListItems);
            fileShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            fileShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            fileShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
            fileShareReciverCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            fileShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    fileShareReciverCategory.addRequested = false;
    fileShareReciverCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    fileShareReciverCategory.showIsBusy = false;



    //For reInit Categories
    fileShareReciverCategory.gridOptions.reGetAll = function () {
        if (fileShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) fileShareReciverCategory.searchData();
        else fileShareReciverCategory.init();
    };

    fileShareReciverCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, fileShareReciverCategory.treeConfig.currentNode);
    }

    fileShareReciverCategory.loadFileAndFolder = function (item) {
        fileShareReciverCategory.treeConfig.currentNode = item;
        console.log(item);
        fileShareReciverCategory.treeConfig.onNodeSelect(item);
    }

    fileShareReciverCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            fileShareReciverCategory.focus = true;
        });
    };
    fileShareReciverCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            fileShareReciverCategory.focus1 = true;
        });
    };

    fileShareReciverCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }


    // End of Upload Modal-----------------------------------------
    fileShareReciverCategory.columnCheckbox = false;
    fileShareReciverCategory.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (fileShareReciverCategory.gridOptions.columnCheckbox) {
            for (var i = 0; i < fileShareReciverCategory.gridOptions.columns.length; i++) {
                //fileShareReciverCategory.gridOptions.columns[i].visible = $("#" + fileShareReciverCategory.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + fileShareReciverCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                fileShareReciverCategory.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = fileShareReciverCategory.gridOptions.columns;
            for (var i = 0; i < fileShareReciverCategory.gridOptions.columns.length; i++) {
                fileShareReciverCategory.gridOptions.columns[i].visible = true;
                var element = $("#" + fileShareReciverCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + fileShareReciverCategory.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < fileShareReciverCategory.gridOptions.columns.length; i++) {
            console.log(fileShareReciverCategory.gridOptions.columns[i].name.concat(".visible: "), fileShareReciverCategory.gridOptions.columns[i].visible);
        }
        fileShareReciverCategory.gridOptions.columnCheckbox = !fileShareReciverCategory.gridOptions.columnCheckbox;
    }
    //Export Report 
    fileShareReciverCategory.exportFile = function () {
        fileShareReciverCategory.addRequested = true;
        fileShareReciverCategory.gridOptions.advancedSearchData.engine.ExportFile = fileShareReciverCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'FileShareReciverCategory/exportfile', fileShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            fileShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                fileShareReciverCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //fileShareReciverCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    fileShareReciverCategory.toggleExportForm = function () {
        fileShareReciverCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        fileShareReciverCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        fileShareReciverCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        fileShareReciverCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        fileShareReciverCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleFile/fileShareReciverCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    fileShareReciverCategory.rowCountChanged = function () {
        if (!angular.isDefined(fileShareReciverCategory.ExportFileClass.RowCount) || fileShareReciverCategory.ExportFileClass.RowCount > 5000)
            fileShareReciverCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    fileShareReciverCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileShareReciverCategory/count", fileShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            fileShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            fileShareReciverCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            fileShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    fileShareReciverCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            fileShareReciverCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    fileShareReciverCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (fileShareReciverCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    fileShareReciverCategory.onNodeToggle = function (node, expanded) {
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

    fileShareReciverCategory.onSelection = function (node, selected) {
        if (!selected) {
            fileShareReciverCategory.selectedItem.LinkMainImageId = null;
            fileShareReciverCategory.selectedItem.previewImageSrc = null;
            return;
        }
        fileShareReciverCategory.selectedItem.LinkMainImageId = node.Id;
        fileShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            fileShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
