app.controller("chartShareReciverCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var chartShareReciverCategory = this;
    //For Grid Options
    chartShareReciverCategory.gridOptions = {};
    chartShareReciverCategory.selectedItem = {};
    chartShareReciverCategory.attachedFiles = [];
    chartShareReciverCategory.attachedFile = "";

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    var todayDate = moment().format();

    chartShareReciverCategory.ToDate = {
        defaultDate: todayDate
    }
    chartShareReciverCategory.FromDate = {
        defaultDate: todayDate
    }
    chartShareReciverCategory.testDate = moment().format();
    if (itemRecordStatus != undefined) chartShareReciverCategory.itemRecordStatus = itemRecordStatus;
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    chartShareReciverCategory.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "chartShareReciverCategoryController") {
            localStorage.setItem('AddRequest', '');
            chartShareReciverCategory.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }

    chartShareReciverCategory.LinkShareReciverCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareReciverCategoryId',
        url: 'ChartCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        showAddDialog: false,
        scope: chartShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    //chart Grid Options
    chartShareReciverCategory.LinkShareServerCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareServerCategoryId',
        url: 'ChartShareServerCategory',
        Action:'GetAllOtherSite',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        showAddDialog: false,
        scope: chartShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    chartShareReciverCategory.gridOptions = {
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
    chartShareReciverCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show chart Loading Indicator
    chartShareReciverCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    chartShareReciverCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    chartShareReciverCategory.treeConfig.currentNode = {};
    chartShareReciverCategory.treeBusyIndicator = false;

    chartShareReciverCategory.addRequested = false;

    chartShareReciverCategory.showGridComment = false;
    chartShareReciverCategory.chartTitle = "";

    //init Function
    chartShareReciverCategory.init = function () {
        chartShareReciverCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = chartShareReciverCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        chartShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ChartShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            chartShareReciverCategory.treeConfig.Items = response.ListItems;
            chartShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        chartShareReciverCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"chartShareReciverCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            chartShareReciverCategory.ListItems = response.ListItems;
            chartShareReciverCategory.gridOptions.fillData(chartShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            chartShareReciverCategory.contentBusyIndicator.isActive = false;
            chartShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            chartShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            chartShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            chartShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            chartShareReciverCategory.contentBusyIndicator.isActive = false;
        });
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        chartShareReciverCategory.checkRequestAddNewItemFromOtherControl(null);
    };

    // Open Add Category Modal 
    chartShareReciverCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        chartShareReciverCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ChartShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            chartShareReciverCategory.selectedItem = response.Item;
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
                chartShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(chartShareReciverCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleChart/ChartShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    chartShareReciverCategory.addRequested = false;
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
    chartShareReciverCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        chartShareReciverCategory.addRequested = false;
        chartShareReciverCategory.modalTitle = 'ویرایش';
        if (!chartShareReciverCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        chartShareReciverCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ChartShareMainAdminSetting/GetOne', chartShareReciverCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            chartShareReciverCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            chartShareReciverCategory.selectedItem = response.Item;
            //Set dataForTheTree
            chartShareReciverCategory.selectedNode = [];
            chartShareReciverCategory.expandedNodes = [];
            chartShareReciverCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                chartShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(chartShareReciverCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (chartShareReciverCategory.selectedItem.LinkMainImageId > 0)
                        chartShareReciverCategory.onSelection({ Id: chartShareReciverCategory.selectedItem.LinkMainImageId }, true);
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
    chartShareReciverCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        chartShareReciverCategory.categoryBusyIndicator.isActive = true;
        chartShareReciverCategory.addRequested = true;
        chartShareReciverCategory.selectedItem.LinkParentId = null;
        if (chartShareReciverCategory.treeConfig.currentNode != null)
            chartShareReciverCategory.selectedItem.LinkParentId = chartShareReciverCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'ChartShareMainAdminSetting/add', chartShareReciverCategory.selectedItem, 'POST').success(function (response) {
            chartShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                chartShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                chartShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                chartShareReciverCategory.gridOptions.reGetAll();
                chartShareReciverCategory.closeModal();
            }
            chartShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            chartShareReciverCategory.addRequested = false;
            chartShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    chartShareReciverCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        chartShareReciverCategory.categoryBusyIndicator.isActive = true;
        chartShareReciverCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ChartShareMainAdminSetting/edit', chartShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            //chartShareReciverCategory.showbusy = false;
            chartShareReciverCategory.treeConfig.showbusy = false;
            chartShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                chartShareReciverCategory.treeConfig.currentNode.Title = response.Item.Title;
                chartShareReciverCategory.closeModal();
            }
            chartShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            chartShareReciverCategory.addRequested = false;
            chartShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    chartShareReciverCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = chartShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                chartShareReciverCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'ChartShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    chartShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(chartShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ChartShareMainAdminSetting/delete', chartShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        chartShareReciverCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //chartShareReciverCategory.replaceCategoryItem(chartShareReciverCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            chartShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            chartShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            chartShareReciverCategory.gridOptions.fillData();
                            chartShareReciverCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        chartShareReciverCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    chartShareReciverCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    chartShareReciverCategory.treeConfig.onNodeSelect = function () {
        var node = chartShareReciverCategory.treeConfig.currentNode;
        chartShareReciverCategory.showGridComment = false;
        chartShareReciverCategory.selectContent(node);

    };
    //Show Content with Category Id
    chartShareReciverCategory.selectContent = function (node) {
        chartShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
        chartShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            chartShareReciverCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            chartShareReciverCategory.contentBusyIndicator.isActive = true;
            chartShareReciverCategory.attachedFiles = null;
            chartShareReciverCategory.attachedFiles = [];
            var s = {
                PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            chartShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"chartShareReciverCategory/getall", chartShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            chartShareReciverCategory.contentBusyIndicator.isActive = false;
            chartShareReciverCategory.ListItems = response.ListItems;
            chartShareReciverCategory.gridOptions.fillData(chartShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            chartShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            chartShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            chartShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            chartShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    chartShareReciverCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = chartShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        chartShareReciverCategory.addRequested = false;
        chartShareReciverCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'chartShareReciverCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            chartShareReciverCategory.selectedItem = response.Item;
            chartShareReciverCategory.selectedItem.LinkShareServerCategoryId = node.Id;
            chartShareReciverCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/Modulechart/chartShareReciverCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    chartShareReciverCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        chartShareReciverCategory.addRequested = false;
        chartShareReciverCategory.modalTitle = 'ویرایش';
        if (!chartShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'chartShareReciverCategory/GetOne', chartShareReciverCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            chartShareReciverCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulechart/chartShareReciverCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    chartShareReciverCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        chartShareReciverCategory.categoryBusyIndicator.isActive = true;
        chartShareReciverCategory.addRequested = true;

        if (chartShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || chartShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'chartShareReciverCategory/add', chartShareReciverCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            chartShareReciverCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                chartShareReciverCategory.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                chartShareReciverCategory.ListItems.unshift(response.Item);
                chartShareReciverCategory.gridOptions.fillData(chartShareReciverCategory.ListItems);
                chartShareReciverCategory.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            chartShareReciverCategory.addRequested = false;
            chartShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    chartShareReciverCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        chartShareReciverCategory.categoryBusyIndicator.isActive = true;
        chartShareReciverCategory.addRequested = true;

        if (chartShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || chartShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'chartShareReciverCategory/edit', chartShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            chartShareReciverCategory.categoryBusyIndicator.isActive = false;
            chartShareReciverCategory.addRequested = false;
            chartShareReciverCategory.treeConfig.showbusy = false;
            chartShareReciverCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                chartShareReciverCategory.replaceItem(chartShareReciverCategory.selectedItem.Id, response.Item);
                chartShareReciverCategory.gridOptions.fillData(chartShareReciverCategory.ListItems);
                chartShareReciverCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            chartShareReciverCategory.addRequested = false;
            chartShareReciverCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a chart Content 
    chartShareReciverCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!chartShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        chartShareReciverCategory.treeConfig.showbusy = true;
        chartShareReciverCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                chartShareReciverCategory.categoryBusyIndicator.isActive = true;
                console.log(chartShareReciverCategory.gridOptions.selectedRow.item);
                chartShareReciverCategory.showbusy = true;
                chartShareReciverCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"chartShareReciverCategory/GetOne", chartShareReciverCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    chartShareReciverCategory.showbusy = false;
                    chartShareReciverCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    chartShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(chartShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"chartShareReciverCategory/delete", chartShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        chartShareReciverCategory.categoryBusyIndicator.isActive = false;
                        chartShareReciverCategory.treeConfig.showbusy = false;
                        chartShareReciverCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            chartShareReciverCategory.replaceItem(chartShareReciverCategory.selectedItemForDelete.Id);
                            chartShareReciverCategory.gridOptions.fillData(chartShareReciverCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        chartShareReciverCategory.treeConfig.showbusy = false;
                        chartShareReciverCategory.showIsBusy = false;
                        chartShareReciverCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    chartShareReciverCategory.treeConfig.showbusy = false;
                    chartShareReciverCategory.showIsBusy = false;
                    chartShareReciverCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }





    ////Replace Item OnDelete/OnEdit Grid Options
    chartShareReciverCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(chartShareReciverCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = chartShareReciverCategory.ListItems.indexOf(item);
                chartShareReciverCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            chartShareReciverCategory.ListItems.unshift(newItem);
    }


    chartShareReciverCategory.searchData = function () {
        chartShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"chartShareReciverCategory/getall", chartShareReciverCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            chartShareReciverCategory.categoryBusyIndicator.isActive = false;
            chartShareReciverCategory.ListItems = response.ListItems;
            chartShareReciverCategory.gridOptions.fillData(chartShareReciverCategory.ListItems);
            chartShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            chartShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            chartShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
            chartShareReciverCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            chartShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    chartShareReciverCategory.addRequested = false;
    chartShareReciverCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    chartShareReciverCategory.showIsBusy = false;



    //For reInit Categories
    chartShareReciverCategory.gridOptions.reGetAll = function () {
        if (chartShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) chartShareReciverCategory.searchData();
        else chartShareReciverCategory.init();
    };

    chartShareReciverCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, chartShareReciverCategory.treeConfig.currentNode);
    }

    chartShareReciverCategory.loadFileAndFolder = function (item) {
        chartShareReciverCategory.treeConfig.currentNode = item;
        console.log(item);
        chartShareReciverCategory.treeConfig.onNodeSelect(item);
    }

    chartShareReciverCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            chartShareReciverCategory.focus = true;
        });
    };
    chartShareReciverCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            chartShareReciverCategory.focus1 = true;
        });
    };

    chartShareReciverCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }


    // End of Upload Modal-----------------------------------------

    chartShareReciverCategory.columnCheckbox = false;
    chartShareReciverCategory.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = chartShareReciverCategory.gridOptions.columns;
        if (chartShareReciverCategory.gridOptions.columnCheckbox) {
            for (var i = 0; i < chartShareReciverCategory.gridOptions.columns.length; i++) {
                //chartShareReciverCategory.gridOptions.columns[i].visible = $("#" + chartShareReciverCategory.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + chartShareReciverCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                chartShareReciverCategory.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < chartShareReciverCategory.gridOptions.columns.length; i++) {
                var element = $("#" + chartShareReciverCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + chartShareReciverCategory.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < chartShareReciverCategory.gridOptions.columns.length; i++) {
            console.log(chartShareReciverCategory.gridOptions.columns[i].name.concat(".visible: "), chartShareReciverCategory.gridOptions.columns[i].visible);
        }
        chartShareReciverCategory.gridOptions.columnCheckbox = !chartShareReciverCategory.gridOptions.columnCheckbox;
    }
    //Export Report 
    chartShareReciverCategory.exportFile = function () {
        chartShareReciverCategory.addRequested = true;
        chartShareReciverCategory.gridOptions.advancedSearchData.engine.ExportFile = chartShareReciverCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'chartShareReciverCategory/exportfile', chartShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            chartShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                chartShareReciverCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //chartShareReciverCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    chartShareReciverCategory.toggleExportForm = function () {
        chartShareReciverCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        chartShareReciverCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        chartShareReciverCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        chartShareReciverCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        chartShareReciverCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleChart/chartShareReciverCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    chartShareReciverCategory.rowCountChanged = function () {
        if (!angular.isDefined(chartShareReciverCategory.ExportFileClass.RowCount) || chartShareReciverCategory.ExportFileClass.RowCount > 5000)
            chartShareReciverCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    chartShareReciverCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"chartShareReciverCategory/count", chartShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            chartShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            chartShareReciverCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            chartShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    chartShareReciverCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            chartShareReciverCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    chartShareReciverCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (chartShareReciverCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    chartShareReciverCategory.onNodeToggle = function (node, expanded) {
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

    chartShareReciverCategory.onSelection = function (node, selected) {
        if (!selected) {
            chartShareReciverCategory.selectedItem.LinkMainImageId = null;
            chartShareReciverCategory.selectedItem.previewImageSrc = null;
            return;
        }
        chartShareReciverCategory.selectedItem.LinkMainImageId = node.Id;
        chartShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            chartShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
