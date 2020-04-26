app.controller("chartShareServerCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var chartShareServerCategory = this;
    //For Grid Options
    chartShareServerCategory.gridOptions = {};
    chartShareServerCategory.selectedItem = {};
    chartShareServerCategory.attachedFiles = [];
    chartShareServerCategory.attachedFile = "";

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) chartShareServerCategory.itemRecordStatus = itemRecordStatus;
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    chartShareServerCategory.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "chartShareServerCategoryController") {
            localStorage.setItem('AddRequest', '');
            chartShareServerCategory.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    
    chartShareServerCategory.LinkShareMainAdminSettingIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkServerCategoryId',
        url: 'ChartCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        showAddDialog: false,
        scope: chartShareServerCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' }
            ]
        }
    }

    //chart Grid Options
                      
    chartShareServerCategory.gridOptions = {
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
    chartShareServerCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show chart Loading Indicator
    chartShareServerCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    chartShareServerCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    chartShareServerCategory.treeConfig.currentNode = {};
    chartShareServerCategory.treeBusyIndicator = false;

    chartShareServerCategory.addRequested = false;

    chartShareServerCategory.showGridComment = false;
    chartShareServerCategory.chartTitle = "";

    //init Function
    chartShareServerCategory.init = function () {
        chartShareServerCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = chartShareServerCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        chartShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ChartShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            chartShareServerCategory.treeConfig.Items = response.ListItems;
            chartShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        chartShareServerCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"chartShareServerCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            chartShareServerCategory.ListItems = response.ListItems;
            chartShareServerCategory.gridOptions.fillData(chartShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            chartShareServerCategory.contentBusyIndicator.isActive = false;
            chartShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            chartShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            chartShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            chartShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            chartShareServerCategory.contentBusyIndicator.isActive = false;
        });
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        chartShareServerCategory.checkRequestAddNewItemFromOtherControl(null);
    };

    // Open Add Category Modal 
    chartShareServerCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        chartShareServerCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ChartShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            chartShareServerCategory.selectedItem = response.Item;
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
                chartShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(chartShareServerCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleChart/ChartShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    chartShareServerCategory.addRequested = false;
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
    chartShareServerCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        chartShareServerCategory.addRequested = false;
        chartShareServerCategory.modalTitle = 'ویرایش';
        if (!chartShareServerCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        chartShareServerCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ChartShareMainAdminSetting/GetOne', chartShareServerCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            chartShareServerCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            chartShareServerCategory.selectedItem = response.Item;
            //Set dataForTheTree
            chartShareServerCategory.selectedNode = [];
            chartShareServerCategory.expandedNodes = [];
            chartShareServerCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                chartShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(chartShareServerCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (chartShareServerCategory.selectedItem.LinkMainImageId > 0)
                        chartShareServerCategory.onSelection({ Id: chartShareServerCategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleChart/ChartShareMainAdminSetting/edit.html',
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
    chartShareServerCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        chartShareServerCategory.categoryBusyIndicator.isActive = true;
        chartShareServerCategory.addRequested = true;
        chartShareServerCategory.selectedItem.LinkParentId = null;
        if (chartShareServerCategory.treeConfig.currentNode != null)
            chartShareServerCategory.selectedItem.LinkParentId = chartShareServerCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'ChartShareMainAdminSetting/add', chartShareServerCategory.selectedItem, 'POST').success(function (response) {
            chartShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                chartShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                chartShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                chartShareServerCategory.gridOptions.reGetAll();
                chartShareServerCategory.closeModal();
            }
            chartShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            chartShareServerCategory.addRequested = false;
            chartShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    chartShareServerCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        chartShareServerCategory.categoryBusyIndicator.isActive = true;
        chartShareServerCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ChartShareMainAdminSetting/edit', chartShareServerCategory.selectedItem, 'PUT').success(function (response) {
            //chartShareServerCategory.showbusy = false;
            chartShareServerCategory.treeConfig.showbusy = false;
            chartShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                chartShareServerCategory.treeConfig.currentNode.Title = response.Item.Title;
                chartShareServerCategory.closeModal();
            }
            chartShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            chartShareServerCategory.addRequested = false;
            chartShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    chartShareServerCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = chartShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                chartShareServerCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'ChartShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    chartShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(chartShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ChartShareMainAdminSetting/delete', chartShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        chartShareServerCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //chartShareServerCategory.replaceCategoryItem(chartShareServerCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            chartShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            chartShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            chartShareServerCategory.gridOptions.fillData();
                            chartShareServerCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        chartShareServerCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    chartShareServerCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    chartShareServerCategory.treeConfig.onNodeSelect = function () {
        var node = chartShareServerCategory.treeConfig.currentNode;
        chartShareServerCategory.showGridComment = false;
        chartShareServerCategory.selectContent(node);

    };
    //Show Content with Category Id
    chartShareServerCategory.selectContent = function (node) {
        chartShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
        chartShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            chartShareServerCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            chartShareServerCategory.contentBusyIndicator.isActive = true;
            chartShareServerCategory.attachedFiles = null;
            chartShareServerCategory.attachedFiles = [];
            var s = {
                PropertyName: "LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            chartShareServerCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"chartShareServerCategory/getall", chartShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            chartShareServerCategory.contentBusyIndicator.isActive = false;
            chartShareServerCategory.ListItems = response.ListItems;
            chartShareServerCategory.gridOptions.fillData(chartShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            chartShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            chartShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            chartShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            chartShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    chartShareServerCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = chartShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        chartShareServerCategory.addRequested = false;
        chartShareServerCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'chartShareServerCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            chartShareServerCategory.selectedItem = response.Item;
            chartShareServerCategory.selectedItem.LinkShareMainAdminSettingId = node.Id;
            chartShareServerCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/Modulechart/chartShareServerCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    chartShareServerCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        chartShareServerCategory.addRequested = false;
        chartShareServerCategory.modalTitle = 'ویرایش';
        if (!chartShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'chartShareServerCategory/GetOne', chartShareServerCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            chartShareServerCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulechart/chartShareServerCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    chartShareServerCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        chartShareServerCategory.categoryBusyIndicator.isActive = true;
        chartShareServerCategory.addRequested = true;

        if (chartShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || chartShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'chartShareServerCategory/add', chartShareServerCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            chartShareServerCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                chartShareServerCategory.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                chartShareServerCategory.ListItems.unshift(response.Item);
                chartShareServerCategory.gridOptions.fillData(chartShareServerCategory.ListItems);
                chartShareServerCategory.closeModal();
            
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            chartShareServerCategory.addRequested = false;
            chartShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    chartShareServerCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        chartShareServerCategory.categoryBusyIndicator.isActive = true;
        chartShareServerCategory.addRequested = true;
    
        if (chartShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || chartShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'chartShareServerCategory/edit', chartShareServerCategory.selectedItem, 'PUT').success(function (response) {
            chartShareServerCategory.categoryBusyIndicator.isActive = false;
            chartShareServerCategory.addRequested = false;
            chartShareServerCategory.treeConfig.showbusy = false;
            chartShareServerCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                chartShareServerCategory.replaceItem(chartShareServerCategory.selectedItem.Id, response.Item);
                chartShareServerCategory.gridOptions.fillData(chartShareServerCategory.ListItems);
                chartShareServerCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            chartShareServerCategory.addRequested = false;
            chartShareServerCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a chart Content 
    chartShareServerCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!chartShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        chartShareServerCategory.treeConfig.showbusy = true;
        chartShareServerCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                chartShareServerCategory.categoryBusyIndicator.isActive = true;
                console.log(chartShareServerCategory.gridOptions.selectedRow.item);
                chartShareServerCategory.showbusy = true;
                chartShareServerCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"chartShareServerCategory/GetOne", chartShareServerCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    chartShareServerCategory.showbusy = false;
                    chartShareServerCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    chartShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(chartShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"chartShareServerCategory/delete", chartShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        chartShareServerCategory.categoryBusyIndicator.isActive = false;
                        chartShareServerCategory.treeConfig.showbusy = false;
                        chartShareServerCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            chartShareServerCategory.replaceItem(chartShareServerCategory.selectedItemForDelete.Id);
                            chartShareServerCategory.gridOptions.fillData(chartShareServerCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        chartShareServerCategory.treeConfig.showbusy = false;
                        chartShareServerCategory.showIsBusy = false;
                        chartShareServerCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    chartShareServerCategory.treeConfig.showbusy = false;
                    chartShareServerCategory.showIsBusy = false;
                    chartShareServerCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }

    

   

    ////Replace Item OnDelete/OnEdit Grid Options
    chartShareServerCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(chartShareServerCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = chartShareServerCategory.ListItems.indexOf(item);
                chartShareServerCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            chartShareServerCategory.ListItems.unshift(newItem);
    }

   
    chartShareServerCategory.searchData = function () {
        chartShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"chartShareServerCategory/getall", chartShareServerCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            chartShareServerCategory.categoryBusyIndicator.isActive = false;
            chartShareServerCategory.ListItems = response.ListItems;
            chartShareServerCategory.gridOptions.fillData(chartShareServerCategory.ListItems);
            chartShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            chartShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            chartShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
            chartShareServerCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            chartShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    chartShareServerCategory.addRequested = false;
    chartShareServerCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    chartShareServerCategory.showIsBusy = false;

   

    //For reInit Categories
    chartShareServerCategory.gridOptions.reGetAll = function () {
        if (chartShareServerCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) chartShareServerCategory.searchData();
        else chartShareServerCategory.init();
    };

    chartShareServerCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, chartShareServerCategory.treeConfig.currentNode);
    }

    chartShareServerCategory.loadFileAndFolder = function (item) {
        chartShareServerCategory.treeConfig.currentNode = item;
        console.log(item);
        chartShareServerCategory.treeConfig.onNodeSelect(item);
    }

    chartShareServerCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            chartShareServerCategory.focus = true;
        });
    };
    chartShareServerCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            chartShareServerCategory.focus1 = true;
        });
    };

     chartShareServerCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

  
   // End of Upload Modal-----------------------------------------
     chartShareServerCategory.columnCheckbox = false;
     chartShareServerCategory.openGridConfigModal = function () {
         $("#gridView-btn").toggleClass("active");
         var prechangeColumns = chartShareServerCategory.gridOptions.columns;
         if (chartShareServerCategory.gridOptions.columnCheckbox) {
             for (var i = 0; i < chartShareServerCategory.gridOptions.columns.length; i++) {
                 //chartShareServerCategory.gridOptions.columns[i].visible = $("#" + chartShareServerCategory.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                 var element = $("#" + chartShareServerCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                 var temp = element[0].checked;
                 chartShareServerCategory.gridOptions.columns[i].visible = temp;
             }
         }
         else {

             for (var i = 0; i < chartShareServerCategory.gridOptions.columns.length; i++) {
                 var element = $("#" + chartShareServerCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                 $("#" + chartShareServerCategory.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
             }
         }
         for (var i = 0; i < chartShareServerCategory.gridOptions.columns.length; i++) {
             console.log(chartShareServerCategory.gridOptions.columns[i].name.concat(".visible: "), chartShareServerCategory.gridOptions.columns[i].visible);
         }
         chartShareServerCategory.gridOptions.columnCheckbox = !chartShareServerCategory.gridOptions.columnCheckbox;
     }
    //Export Report 
    chartShareServerCategory.exportFile = function () {
        chartShareServerCategory.addRequested = true;
        chartShareServerCategory.gridOptions.advancedSearchData.engine.ExportFile = chartShareServerCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'chartShareServerCategory/exportfile', chartShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            chartShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                chartShareServerCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //chartShareServerCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    chartShareServerCategory.toggleExportForm = function () {
        chartShareServerCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        chartShareServerCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        chartShareServerCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        chartShareServerCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        chartShareServerCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleChart/chartShareServerCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    chartShareServerCategory.rowCountChanged = function () {
        if (!angular.isDefined(chartShareServerCategory.ExportFileClass.RowCount) || chartShareServerCategory.ExportFileClass.RowCount > 5000)
            chartShareServerCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    chartShareServerCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"chartShareServerCategory/count", chartShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            chartShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            chartShareServerCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            chartShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    chartShareServerCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            chartShareServerCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    chartShareServerCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (chartShareServerCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    chartShareServerCategory.onNodeToggle = function (node, expanded) {
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

    chartShareServerCategory.onSelection = function (node, selected) {
        if (!selected) {
            chartShareServerCategory.selectedItem.LinkMainImageId = null;
            chartShareServerCategory.selectedItem.previewImageSrc = null;
            return;
        }
        chartShareServerCategory.selectedItem.LinkMainImageId = node.Id;
        chartShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            chartShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
