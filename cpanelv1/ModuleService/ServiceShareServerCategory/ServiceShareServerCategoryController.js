app.controller("serviceShareServerCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var serviceShareServerCategory = this;
    //For Grid Options
    serviceShareServerCategory.gridOptions = {};
    serviceShareServerCategory.selectedItem = {};
    serviceShareServerCategory.attachedFiles = [];
    serviceShareServerCategory.attachedFile = "";

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) serviceShareServerCategory.itemRecordStatus = itemRecordStatus;

    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    serviceShareServerCategory.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "serviceShareServerCategoryController") {
            localStorage.setItem('AddRequest', '');
            serviceShareServerCategory.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    serviceShareServerCategory.LinkShareMainAdminSettingIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkServerCategoryId',
        url: 'ServiceCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        showAddDialog: false,
        scope: serviceShareServerCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    //service Grid Options

    serviceShareServerCategory.gridOptions = {
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
    serviceShareServerCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show service Loading Indicator
    serviceShareServerCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    serviceShareServerCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    serviceShareServerCategory.treeConfig.currentNode = {};
    serviceShareServerCategory.treeBusyIndicator = false;

    serviceShareServerCategory.addRequested = false;

    serviceShareServerCategory.showGridComment = false;
    serviceShareServerCategory.serviceTitle = "";

    //init Function
    serviceShareServerCategory.init = function () {
        serviceShareServerCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = serviceShareServerCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        serviceShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ServiceShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            serviceShareServerCategory.treeConfig.Items = response.ListItems;
            serviceShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        serviceShareServerCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"serviceShareServerCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            serviceShareServerCategory.ListItems = response.ListItems;
            serviceShareServerCategory.gridOptions.fillData(serviceShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            serviceShareServerCategory.contentBusyIndicator.isActive = false;
            serviceShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            serviceShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            serviceShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            serviceShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            serviceShareServerCategory.contentBusyIndicator.isActive = false;
        });
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        serviceShareServerCategory.checkRequestAddNewItemFromOtherControl(null);

    };

    // Open Add Category Modal 
    serviceShareServerCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        serviceShareServerCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ServiceShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            serviceShareServerCategory.selectedItem = response.Item;
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
                serviceShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(serviceShareServerCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleService/ServiceShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    serviceShareServerCategory.addRequested = false;
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
    serviceShareServerCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        serviceShareServerCategory.addRequested = false;
        serviceShareServerCategory.modalTitle = 'ویرایش';
        if (!serviceShareServerCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        serviceShareServerCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ServiceShareMainAdminSetting/GetOne', serviceShareServerCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            serviceShareServerCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            serviceShareServerCategory.selectedItem = response.Item;
            //Set dataForTheTree
            serviceShareServerCategory.selectedNode = [];
            serviceShareServerCategory.expandedNodes = [];
            serviceShareServerCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                serviceShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(serviceShareServerCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (serviceShareServerCategory.selectedItem.LinkMainImageId > 0)
                        serviceShareServerCategory.onSelection({ Id: serviceShareServerCategory.selectedItem.LinkMainImageId }, true);
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
    serviceShareServerCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        serviceShareServerCategory.categoryBusyIndicator.isActive = true;
        serviceShareServerCategory.addRequested = true;
        serviceShareServerCategory.selectedItem.LinkParentId = null;
        if (serviceShareServerCategory.treeConfig.currentNode != null)
            serviceShareServerCategory.selectedItem.LinkParentId = serviceShareServerCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'ServiceShareMainAdminSetting/add', serviceShareServerCategory.selectedItem, 'POST').success(function (response) {
            serviceShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                serviceShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                serviceShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                serviceShareServerCategory.gridOptions.reGetAll();
                serviceShareServerCategory.closeModal();
            }
            serviceShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            serviceShareServerCategory.addRequested = false;
            serviceShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    serviceShareServerCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        serviceShareServerCategory.categoryBusyIndicator.isActive = true;
        serviceShareServerCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ServiceShareMainAdminSetting/edit', serviceShareServerCategory.selectedItem, 'PUT').success(function (response) {
            //serviceShareServerCategory.showbusy = false;
            serviceShareServerCategory.treeConfig.showbusy = false;
            serviceShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                serviceShareServerCategory.treeConfig.currentNode.Title = response.Item.Title;
                serviceShareServerCategory.closeModal();
            }
            serviceShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            serviceShareServerCategory.addRequested = false;
            serviceShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    serviceShareServerCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = serviceShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                serviceShareServerCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'ServiceShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    serviceShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(serviceShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ServiceShareMainAdminSetting/delete', serviceShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        serviceShareServerCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //serviceShareServerCategory.replaceCategoryItem(serviceShareServerCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            serviceShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            serviceShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            serviceShareServerCategory.gridOptions.fillData();
                            serviceShareServerCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        serviceShareServerCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    serviceShareServerCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    serviceShareServerCategory.treeConfig.onNodeSelect = function () {
        var node = serviceShareServerCategory.treeConfig.currentNode;
        serviceShareServerCategory.showGridComment = false;
        serviceShareServerCategory.selectContent(node);

    };
    //Show Content with Category Id
    serviceShareServerCategory.selectContent = function (node) {
        serviceShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
        serviceShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            serviceShareServerCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            serviceShareServerCategory.contentBusyIndicator.isActive = true;
            serviceShareServerCategory.attachedFiles = null;
            serviceShareServerCategory.attachedFiles = [];
            var s = {
                PropertyName: "LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            serviceShareServerCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"serviceShareServerCategory/getall", serviceShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            serviceShareServerCategory.contentBusyIndicator.isActive = false;
            serviceShareServerCategory.ListItems = response.ListItems;
            serviceShareServerCategory.gridOptions.fillData(serviceShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            serviceShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            serviceShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            serviceShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            serviceShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    serviceShareServerCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = serviceShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        serviceShareServerCategory.addRequested = false;
        serviceShareServerCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'serviceShareServerCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            serviceShareServerCategory.selectedItem = response.Item;
            serviceShareServerCategory.selectedItem.LinkShareMainAdminSettingId = node.Id;
            serviceShareServerCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleservice/serviceShareServerCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    serviceShareServerCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        serviceShareServerCategory.addRequested = false;
        serviceShareServerCategory.modalTitle = 'ویرایش';
        if (!serviceShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'serviceShareServerCategory/GetOne', serviceShareServerCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            serviceShareServerCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleservice/serviceShareServerCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    serviceShareServerCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        serviceShareServerCategory.categoryBusyIndicator.isActive = true;
        serviceShareServerCategory.addRequested = true;

        if (serviceShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || serviceShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'serviceShareServerCategory/add', serviceShareServerCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            serviceShareServerCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                serviceShareServerCategory.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                serviceShareServerCategory.ListItems.unshift(response.Item);
                serviceShareServerCategory.gridOptions.fillData(serviceShareServerCategory.ListItems);
                serviceShareServerCategory.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            serviceShareServerCategory.addRequested = false;
            serviceShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    serviceShareServerCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        serviceShareServerCategory.categoryBusyIndicator.isActive = true;
        serviceShareServerCategory.addRequested = true;

        if (serviceShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || serviceShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'serviceShareServerCategory/edit', serviceShareServerCategory.selectedItem, 'PUT').success(function (response) {
            serviceShareServerCategory.categoryBusyIndicator.isActive = false;
            serviceShareServerCategory.addRequested = false;
            serviceShareServerCategory.treeConfig.showbusy = false;
            serviceShareServerCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                serviceShareServerCategory.replaceItem(serviceShareServerCategory.selectedItem.Id, response.Item);
                serviceShareServerCategory.gridOptions.fillData(serviceShareServerCategory.ListItems);
                serviceShareServerCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            serviceShareServerCategory.addRequested = false;
            serviceShareServerCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a service Content 
    serviceShareServerCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!serviceShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        serviceShareServerCategory.treeConfig.showbusy = true;
        serviceShareServerCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                serviceShareServerCategory.categoryBusyIndicator.isActive = true;
                console.log(serviceShareServerCategory.gridOptions.selectedRow.item);
                serviceShareServerCategory.showbusy = true;
                serviceShareServerCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"serviceShareServerCategory/GetOne", serviceShareServerCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    serviceShareServerCategory.showbusy = false;
                    serviceShareServerCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    serviceShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(serviceShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"serviceShareServerCategory/delete", serviceShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        serviceShareServerCategory.categoryBusyIndicator.isActive = false;
                        serviceShareServerCategory.treeConfig.showbusy = false;
                        serviceShareServerCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            serviceShareServerCategory.replaceItem(serviceShareServerCategory.selectedItemForDelete.Id);
                            serviceShareServerCategory.gridOptions.fillData(serviceShareServerCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        serviceShareServerCategory.treeConfig.showbusy = false;
                        serviceShareServerCategory.showIsBusy = false;
                        serviceShareServerCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    serviceShareServerCategory.treeConfig.showbusy = false;
                    serviceShareServerCategory.showIsBusy = false;
                    serviceShareServerCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }





    ////Replace Item OnDelete/OnEdit Grid Options
    serviceShareServerCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(serviceShareServerCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = serviceShareServerCategory.ListItems.indexOf(item);
                serviceShareServerCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            serviceShareServerCategory.ListItems.unshift(newItem);
    }


    serviceShareServerCategory.searchData = function () {
        serviceShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"serviceShareServerCategory/getall", serviceShareServerCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            serviceShareServerCategory.categoryBusyIndicator.isActive = false;
            serviceShareServerCategory.ListItems = response.ListItems;
            serviceShareServerCategory.gridOptions.fillData(serviceShareServerCategory.ListItems);
            serviceShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            serviceShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            serviceShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
            serviceShareServerCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            serviceShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    serviceShareServerCategory.addRequested = false;
    serviceShareServerCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    serviceShareServerCategory.showIsBusy = false;



    //For reInit Categories
    serviceShareServerCategory.gridOptions.reGetAll = function () {
        if (serviceShareServerCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) serviceShareServerCategory.searchData();
        else serviceShareServerCategory.init();
    };

    serviceShareServerCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, serviceShareServerCategory.treeConfig.currentNode);
    }

    serviceShareServerCategory.loadFileAndFolder = function (item) {
        serviceShareServerCategory.treeConfig.currentNode = item;
        console.log(item);
        serviceShareServerCategory.treeConfig.onNodeSelect(item);
    }

    serviceShareServerCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            serviceShareServerCategory.focus = true;
        });
    };
    serviceShareServerCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            serviceShareServerCategory.focus1 = true;
        });
    };

    serviceShareServerCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }


    // End of Upload Modal-----------------------------------------
    serviceShareServerCategory.columnCheckbox = false;
    serviceShareServerCategory.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (serviceShareServerCategory.gridOptions.columnCheckbox) {
            for (var i = 0; i < serviceShareServerCategory.gridOptions.columns.length; i++) {
                //serviceShareServerCategory.gridOptions.columns[i].visible = $("#" + serviceShareServerCategory.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + serviceShareServerCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                serviceShareServerCategory.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = serviceShareServerCategory.gridOptions.columns;
            for (var i = 0; i < serviceShareServerCategory.gridOptions.columns.length; i++) {
                serviceShareServerCategory.gridOptions.columns[i].visible = true;
                var element = $("#" + serviceShareServerCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + serviceShareServerCategory.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < serviceShareServerCategory.gridOptions.columns.length; i++) {
            console.log(serviceShareServerCategory.gridOptions.columns[i].name.concat(".visible: "), serviceShareServerCategory.gridOptions.columns[i].visible);
        }
        serviceShareServerCategory.gridOptions.columnCheckbox = !serviceShareServerCategory.gridOptions.columnCheckbox;
    }
    //Export Report 
    serviceShareServerCategory.exportFile = function () {
        serviceShareServerCategory.addRequested = true;
        serviceShareServerCategory.gridOptions.advancedSearchData.engine.ExportFile = serviceShareServerCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'serviceShareServerCategory/exportfile', serviceShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            serviceShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                serviceShareServerCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //serviceShareServerCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    serviceShareServerCategory.toggleExportForm = function () {
        serviceShareServerCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        serviceShareServerCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        serviceShareServerCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        serviceShareServerCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        serviceShareServerCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleService/serviceShareServerCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    serviceShareServerCategory.rowCountChanged = function () {
        if (!angular.isDefined(serviceShareServerCategory.ExportFileClass.RowCount) || serviceShareServerCategory.ExportFileClass.RowCount > 5000)
            serviceShareServerCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    serviceShareServerCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"serviceShareServerCategory/count", serviceShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            serviceShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            serviceShareServerCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            serviceShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    serviceShareServerCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            serviceShareServerCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    serviceShareServerCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (serviceShareServerCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    serviceShareServerCategory.onNodeToggle = function (node, expanded) {
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

    serviceShareServerCategory.onSelection = function (node, selected) {
        if (!selected) {
            serviceShareServerCategory.selectedItem.LinkMainImageId = null;
            serviceShareServerCategory.selectedItem.previewImageSrc = null;
            return;
        }
        serviceShareServerCategory.selectedItem.LinkMainImageId = node.Id;
        serviceShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            serviceShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
