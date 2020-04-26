app.controller("serviceShareReciverCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var serviceShareReciverCategory = this;
    //For Grid Options
    serviceShareReciverCategory.gridOptions = {};
    serviceShareReciverCategory.selectedItem = {};
    serviceShareReciverCategory.attachedFiles = [];
    serviceShareReciverCategory.attachedFile = "";

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    var todayDate = moment().format();

    serviceShareReciverCategory.ToDate = {
        defaultDate: todayDate
    }
    serviceShareReciverCategory.FromDate = {
        defaultDate: todayDate
    }
    serviceShareReciverCategory.testDate = moment().format();
    if (itemRecordStatus != undefined) serviceShareReciverCategory.itemRecordStatus = itemRecordStatus;

    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    serviceShareReciverCategory.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "serviceShareReciverCategoryController") {
            localStorage.setItem('AddRequest', '');
            serviceShareReciverCategory.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    serviceShareReciverCategory.LinkShareReciverCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareReciverCategoryId',
        url: 'ServiceCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: serviceShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    //service Grid Options
    serviceShareReciverCategory.LinkShareServerCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareServerCategoryId',
        url: 'ServiceShareServerCategory',
        Action:'GetAllOtherSite',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        showAddDialog: false,
        scope: serviceShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    serviceShareReciverCategory.gridOptions = {
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
    serviceShareReciverCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show service Loading Indicator
    serviceShareReciverCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    serviceShareReciverCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    serviceShareReciverCategory.treeConfig.currentNode = {};
    serviceShareReciverCategory.treeBusyIndicator = false;

    serviceShareReciverCategory.addRequested = false;

    serviceShareReciverCategory.showGridComment = false;
    serviceShareReciverCategory.serviceTitle = "";

    //init Function
    serviceShareReciverCategory.init = function () {
        serviceShareReciverCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = serviceShareReciverCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        serviceShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ServiceShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            serviceShareReciverCategory.treeConfig.Items = response.ListItems;
            serviceShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        serviceShareReciverCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"serviceShareReciverCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            serviceShareReciverCategory.ListItems = response.ListItems;
            serviceShareReciverCategory.gridOptions.fillData(serviceShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            serviceShareReciverCategory.contentBusyIndicator.isActive = false;
            serviceShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            serviceShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            serviceShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            serviceShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            serviceShareReciverCategory.contentBusyIndicator.isActive = false;
        });
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        serviceShareReciverCategory.checkRequestAddNewItemFromOtherControl(null);
    };

    // Open Add Category Modal 
    serviceShareReciverCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        serviceShareReciverCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ServiceShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            serviceShareReciverCategory.selectedItem = response.Item;
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
                serviceShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(serviceShareReciverCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleService/ServiceShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    serviceShareReciverCategory.addRequested = false;
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
    serviceShareReciverCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        serviceShareReciverCategory.addRequested = false;
        serviceShareReciverCategory.modalTitle = 'ویرایش';
        if (!serviceShareReciverCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        serviceShareReciverCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ServiceShareMainAdminSetting/GetOne', serviceShareReciverCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            serviceShareReciverCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            serviceShareReciverCategory.selectedItem = response.Item;
            //Set dataForTheTree
            serviceShareReciverCategory.selectedNode = [];
            serviceShareReciverCategory.expandedNodes = [];
            serviceShareReciverCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                serviceShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(serviceShareReciverCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (serviceShareReciverCategory.selectedItem.LinkMainImageId > 0)
                        serviceShareReciverCategory.onSelection({ Id: serviceShareReciverCategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleService/ServiceShareMainAdminSetting/edit.html',
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
    serviceShareReciverCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        serviceShareReciverCategory.categoryBusyIndicator.isActive = true;
        serviceShareReciverCategory.addRequested = true;
        serviceShareReciverCategory.selectedItem.LinkParentId = null;
        if (serviceShareReciverCategory.treeConfig.currentNode != null)
            serviceShareReciverCategory.selectedItem.LinkParentId = serviceShareReciverCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'ServiceShareMainAdminSetting/add', serviceShareReciverCategory.selectedItem, 'POST').success(function (response) {
            serviceShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                serviceShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                serviceShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                serviceShareReciverCategory.gridOptions.reGetAll();
                serviceShareReciverCategory.closeModal();
            }
            serviceShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            serviceShareReciverCategory.addRequested = false;
            serviceShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    serviceShareReciverCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        serviceShareReciverCategory.categoryBusyIndicator.isActive = true;
        serviceShareReciverCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ServiceShareMainAdminSetting/edit', serviceShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            //serviceShareReciverCategory.showbusy = false;
            serviceShareReciverCategory.treeConfig.showbusy = false;
            serviceShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                serviceShareReciverCategory.treeConfig.currentNode.Title = response.Item.Title;
                serviceShareReciverCategory.closeModal();
            }
            serviceShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            serviceShareReciverCategory.addRequested = false;
            serviceShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    serviceShareReciverCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = serviceShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                serviceShareReciverCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'ServiceShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    serviceShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(serviceShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ServiceShareMainAdminSetting/delete', serviceShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        serviceShareReciverCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //serviceShareReciverCategory.replaceCategoryItem(serviceShareReciverCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            serviceShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            serviceShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            serviceShareReciverCategory.gridOptions.fillData();
                            serviceShareReciverCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        serviceShareReciverCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    serviceShareReciverCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    serviceShareReciverCategory.treeConfig.onNodeSelect = function () {
        var node = serviceShareReciverCategory.treeConfig.currentNode;
        serviceShareReciverCategory.showGridComment = false;
        serviceShareReciverCategory.selectContent(node);

    };
    //Show Content with Category Id
    serviceShareReciverCategory.selectContent = function (node) {
        serviceShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
        serviceShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            serviceShareReciverCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            serviceShareReciverCategory.contentBusyIndicator.isActive = true;
            serviceShareReciverCategory.attachedFiles = null;
            serviceShareReciverCategory.attachedFiles = [];
            var s = {
                PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            serviceShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"serviceShareReciverCategory/getall", serviceShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            serviceShareReciverCategory.contentBusyIndicator.isActive = false;
            serviceShareReciverCategory.ListItems = response.ListItems;
            serviceShareReciverCategory.gridOptions.fillData(serviceShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            serviceShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            serviceShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            serviceShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            serviceShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    serviceShareReciverCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = serviceShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        serviceShareReciverCategory.addRequested = false;
        serviceShareReciverCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'serviceShareReciverCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            serviceShareReciverCategory.selectedItem = response.Item;
            serviceShareReciverCategory.selectedItem.LinkShareServerCategoryId = node.Id;
            serviceShareReciverCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleservice/serviceShareReciverCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    serviceShareReciverCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        serviceShareReciverCategory.addRequested = false;
        serviceShareReciverCategory.modalTitle = 'ویرایش';
        if (!serviceShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'serviceShareReciverCategory/GetOne', serviceShareReciverCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            serviceShareReciverCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleservice/serviceShareReciverCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    serviceShareReciverCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        serviceShareReciverCategory.categoryBusyIndicator.isActive = true;
        serviceShareReciverCategory.addRequested = true;

        if (serviceShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || serviceShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'serviceShareReciverCategory/add', serviceShareReciverCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            serviceShareReciverCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                serviceShareReciverCategory.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                serviceShareReciverCategory.ListItems.unshift(response.Item);
                serviceShareReciverCategory.gridOptions.fillData(serviceShareReciverCategory.ListItems);
                serviceShareReciverCategory.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            serviceShareReciverCategory.addRequested = false;
            serviceShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    serviceShareReciverCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        serviceShareReciverCategory.categoryBusyIndicator.isActive = true;
        serviceShareReciverCategory.addRequested = true;

        if (serviceShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || serviceShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'serviceShareReciverCategory/edit', serviceShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            serviceShareReciverCategory.categoryBusyIndicator.isActive = false;
            serviceShareReciverCategory.addRequested = false;
            serviceShareReciverCategory.treeConfig.showbusy = false;
            serviceShareReciverCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                serviceShareReciverCategory.replaceItem(serviceShareReciverCategory.selectedItem.Id, response.Item);
                serviceShareReciverCategory.gridOptions.fillData(serviceShareReciverCategory.ListItems);
                serviceShareReciverCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            serviceShareReciverCategory.addRequested = false;
            serviceShareReciverCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a service Content 
    serviceShareReciverCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!serviceShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        serviceShareReciverCategory.treeConfig.showbusy = true;
        serviceShareReciverCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                serviceShareReciverCategory.categoryBusyIndicator.isActive = true;
                console.log(serviceShareReciverCategory.gridOptions.selectedRow.item);
                serviceShareReciverCategory.showbusy = true;
                serviceShareReciverCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"serviceShareReciverCategory/GetOne", serviceShareReciverCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    serviceShareReciverCategory.showbusy = false;
                    serviceShareReciverCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    serviceShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(serviceShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"serviceShareReciverCategory/delete", serviceShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        serviceShareReciverCategory.categoryBusyIndicator.isActive = false;
                        serviceShareReciverCategory.treeConfig.showbusy = false;
                        serviceShareReciverCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            serviceShareReciverCategory.replaceItem(serviceShareReciverCategory.selectedItemForDelete.Id);
                            serviceShareReciverCategory.gridOptions.fillData(serviceShareReciverCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        serviceShareReciverCategory.treeConfig.showbusy = false;
                        serviceShareReciverCategory.showIsBusy = false;
                        serviceShareReciverCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    serviceShareReciverCategory.treeConfig.showbusy = false;
                    serviceShareReciverCategory.showIsBusy = false;
                    serviceShareReciverCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }





    ////Replace Item OnDelete/OnEdit Grid Options
    serviceShareReciverCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(serviceShareReciverCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = serviceShareReciverCategory.ListItems.indexOf(item);
                serviceShareReciverCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            serviceShareReciverCategory.ListItems.unshift(newItem);
    }


    serviceShareReciverCategory.searchData = function () {
        serviceShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"serviceShareReciverCategory/getall", serviceShareReciverCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            serviceShareReciverCategory.categoryBusyIndicator.isActive = false;
            serviceShareReciverCategory.ListItems = response.ListItems;
            serviceShareReciverCategory.gridOptions.fillData(serviceShareReciverCategory.ListItems);
            serviceShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            serviceShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            serviceShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
            serviceShareReciverCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            serviceShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    serviceShareReciverCategory.addRequested = false;
    serviceShareReciverCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    serviceShareReciverCategory.showIsBusy = false;



    //For reInit Categories
    serviceShareReciverCategory.gridOptions.reGetAll = function () {
        if (serviceShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) serviceShareReciverCategory.searchData();
        else serviceShareReciverCategory.init();
    };

    serviceShareReciverCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, serviceShareReciverCategory.treeConfig.currentNode);
    }

    serviceShareReciverCategory.loadFileAndFolder = function (item) {
        serviceShareReciverCategory.treeConfig.currentNode = item;
        console.log(item);
        serviceShareReciverCategory.treeConfig.onNodeSelect(item);
    }

    serviceShareReciverCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            serviceShareReciverCategory.focus = true;
        });
    };
    serviceShareReciverCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            serviceShareReciverCategory.focus1 = true;
        });
    };

    serviceShareReciverCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }


    // End of Upload Modal-----------------------------------------
    serviceShareReciverCategory.columnCheckbox = false;
    serviceShareReciverCategory.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (serviceShareReciverCategory.gridOptions.columnCheckbox) {
            for (var i = 0; i < serviceShareReciverCategory.gridOptions.columns.length; i++) {
                //serviceShareReciverCategory.gridOptions.columns[i].visible = $("#" + serviceShareReciverCategory.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + serviceShareReciverCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                serviceShareReciverCategory.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = serviceShareReciverCategory.gridOptions.columns;
            for (var i = 0; i < serviceShareReciverCategory.gridOptions.columns.length; i++) {
                serviceShareReciverCategory.gridOptions.columns[i].visible = true;
                var element = $("#" + serviceShareReciverCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + serviceShareReciverCategory.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < serviceShareReciverCategory.gridOptions.columns.length; i++) {
            console.log(serviceShareReciverCategory.gridOptions.columns[i].name.concat(".visible: "), serviceShareReciverCategory.gridOptions.columns[i].visible);
        }
        serviceShareReciverCategory.gridOptions.columnCheckbox = !serviceShareReciverCategory.gridOptions.columnCheckbox;
    }
    //Export Report 
    serviceShareReciverCategory.exportFile = function () {
        serviceShareReciverCategory.addRequested = true;
        serviceShareReciverCategory.gridOptions.advancedSearchData.engine.ExportFile = serviceShareReciverCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'serviceShareReciverCategory/exportfile', serviceShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            serviceShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                serviceShareReciverCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //serviceShareReciverCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    serviceShareReciverCategory.toggleExportForm = function () {
        serviceShareReciverCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        serviceShareReciverCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        serviceShareReciverCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        serviceShareReciverCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        serviceShareReciverCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleService/serviceShareReciverCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    serviceShareReciverCategory.rowCountChanged = function () {
        if (!angular.isDefined(serviceShareReciverCategory.ExportFileClass.RowCount) || serviceShareReciverCategory.ExportFileClass.RowCount > 5000)
            serviceShareReciverCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    serviceShareReciverCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"serviceShareReciverCategory/count", serviceShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            serviceShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            serviceShareReciverCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            serviceShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    serviceShareReciverCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            serviceShareReciverCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    serviceShareReciverCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (serviceShareReciverCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    serviceShareReciverCategory.onNodeToggle = function (node, expanded) {
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

    serviceShareReciverCategory.onSelection = function (node, selected) {
        if (!selected) {
            serviceShareReciverCategory.selectedItem.LinkMainImageId = null;
            serviceShareReciverCategory.selectedItem.previewImageSrc = null;
            return;
        }
        serviceShareReciverCategory.selectedItem.LinkMainImageId = node.Id;
        serviceShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            serviceShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
