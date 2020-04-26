app.controller("productShareReciverCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var productShareReciverCategory = this;
    //For Grid Options
    productShareReciverCategory.gridOptions = {};
    productShareReciverCategory.selectedItem = {};
    productShareReciverCategory.attachedFiles = [];
    productShareReciverCategory.attachedFile = "";

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    var todayDate = moment().format();

    productShareReciverCategory.ToDate = {
        defaultDate: todayDate
    }
    productShareReciverCategory.FromDate = {
        defaultDate: todayDate
    }
    productShareReciverCategory.testDate = moment().format();
    if (itemRecordStatus != undefined) productShareReciverCategory.itemRecordStatus = itemRecordStatus;
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    productShareReciverCategory.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "productShareReciverCategoryController") {
            localStorage.setItem('AddRequest', '');
            productShareReciverCategory.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }

    productShareReciverCategory.LinkShareReciverCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareReciverCategoryId',
        url: 'ProductCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        showAddDialog: false,
        scope: productShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    //product Grid Options
    productShareReciverCategory.LinkShareServerCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareServerCategoryId',
        url: 'ProductShareServerCategory',
        Action:'GetAllOtherSite',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        showAddDialog: false,
        scope: productShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    productShareReciverCategory.gridOptions = {
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
    productShareReciverCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show product Loading Indicator
    productShareReciverCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    productShareReciverCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    productShareReciverCategory.treeConfig.currentNode = {};
    productShareReciverCategory.treeBusyIndicator = false;

    productShareReciverCategory.addRequested = false;

    productShareReciverCategory.showGridComment = false;
    productShareReciverCategory.productTitle = "";

    //init Function
    productShareReciverCategory.init = function () {
        productShareReciverCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = productShareReciverCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        productShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ProductShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            productShareReciverCategory.treeConfig.Items = response.ListItems;
            productShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        productShareReciverCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"productShareReciverCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            productShareReciverCategory.ListItems = response.ListItems;
            productShareReciverCategory.gridOptions.fillData(productShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            productShareReciverCategory.contentBusyIndicator.isActive = false;
            productShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            productShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            productShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            productShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            productShareReciverCategory.contentBusyIndicator.isActive = false;
        });

        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        productShareReciverCategory.checkRequestAddNewItemFromOtherControl(null);
    };

    // Open Add Category Modal 
    productShareReciverCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        productShareReciverCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ProductShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            productShareReciverCategory.selectedItem = response.Item;
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
                productShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(productShareReciverCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleProduct/ProductShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    productShareReciverCategory.addRequested = false;
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
    productShareReciverCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        productShareReciverCategory.addRequested = false;
        productShareReciverCategory.modalTitle = 'ویرایش';
        if (!productShareReciverCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        productShareReciverCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ProductShareMainAdminSetting/GetOne', productShareReciverCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            productShareReciverCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            productShareReciverCategory.selectedItem = response.Item;
            //Set dataForTheTree
            productShareReciverCategory.selectedNode = [];
            productShareReciverCategory.expandedNodes = [];
            productShareReciverCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                productShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(productShareReciverCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (productShareReciverCategory.selectedItem.LinkMainImageId > 0)
                        productShareReciverCategory.onSelection({ Id: productShareReciverCategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleProduct/ProductShareMainAdminSetting/edit.html',
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
    productShareReciverCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        productShareReciverCategory.categoryBusyIndicator.isActive = true;
        productShareReciverCategory.addRequested = true;
        productShareReciverCategory.selectedItem.LinkParentId = null;
        if (productShareReciverCategory.treeConfig.currentNode != null)
            productShareReciverCategory.selectedItem.LinkParentId = productShareReciverCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'ProductShareMainAdminSetting/add', productShareReciverCategory.selectedItem, 'POST').success(function (response) {
            productShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                productShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                productShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                productShareReciverCategory.gridOptions.reGetAll();
                productShareReciverCategory.closeModal();
            }
            productShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            productShareReciverCategory.addRequested = false;
            productShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    productShareReciverCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        productShareReciverCategory.categoryBusyIndicator.isActive = true;
        productShareReciverCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ProductShareMainAdminSetting/edit', productShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            //productShareReciverCategory.showbusy = false;
            productShareReciverCategory.treeConfig.showbusy = false;
            productShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                productShareReciverCategory.treeConfig.currentNode.Title = response.Item.Title;
                productShareReciverCategory.closeModal();
            }
            productShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            productShareReciverCategory.addRequested = false;
            productShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    productShareReciverCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = productShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                productShareReciverCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'ProductShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    productShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(productShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ProductShareMainAdminSetting/delete', productShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        productShareReciverCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //productShareReciverCategory.replaceCategoryItem(productShareReciverCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            productShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            productShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            productShareReciverCategory.gridOptions.fillData();
                            productShareReciverCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        productShareReciverCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    productShareReciverCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    productShareReciverCategory.treeConfig.onNodeSelect = function () {
        var node = productShareReciverCategory.treeConfig.currentNode;
        productShareReciverCategory.showGridComment = false;
        productShareReciverCategory.selectContent(node);

    };
    //Show Content with Category Id
    productShareReciverCategory.selectContent = function (node) {
        productShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
        productShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            productShareReciverCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            productShareReciverCategory.contentBusyIndicator.isActive = true;
            productShareReciverCategory.attachedFiles = null;
            productShareReciverCategory.attachedFiles = [];
            var s = {
                PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            productShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"productShareReciverCategory/getall", productShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            productShareReciverCategory.contentBusyIndicator.isActive = false;
            productShareReciverCategory.ListItems = response.ListItems;
            productShareReciverCategory.gridOptions.fillData(productShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            productShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            productShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            productShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            productShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    productShareReciverCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = productShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        productShareReciverCategory.addRequested = false;
        productShareReciverCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'productShareReciverCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            productShareReciverCategory.selectedItem = response.Item;
            productShareReciverCategory.selectedItem.LinkShareServerCategoryId = node.Id;
            productShareReciverCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleproduct/productShareReciverCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    productShareReciverCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        productShareReciverCategory.addRequested = false;
        productShareReciverCategory.modalTitle = 'ویرایش';
        if (!productShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'productShareReciverCategory/GetOne', productShareReciverCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            productShareReciverCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleproduct/productShareReciverCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    productShareReciverCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        productShareReciverCategory.categoryBusyIndicator.isActive = true;
        productShareReciverCategory.addRequested = true;

        if (productShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || productShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'productShareReciverCategory/add', productShareReciverCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            productShareReciverCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                productShareReciverCategory.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                productShareReciverCategory.ListItems.unshift(response.Item);
                productShareReciverCategory.gridOptions.fillData(productShareReciverCategory.ListItems);
                productShareReciverCategory.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            productShareReciverCategory.addRequested = false;
            productShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    productShareReciverCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        productShareReciverCategory.categoryBusyIndicator.isActive = true;
        productShareReciverCategory.addRequested = true;

        if (productShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || productShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'productShareReciverCategory/edit', productShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            productShareReciverCategory.categoryBusyIndicator.isActive = false;
            productShareReciverCategory.addRequested = false;
            productShareReciverCategory.treeConfig.showbusy = false;
            productShareReciverCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                productShareReciverCategory.replaceItem(productShareReciverCategory.selectedItem.Id, response.Item);
                productShareReciverCategory.gridOptions.fillData(productShareReciverCategory.ListItems);
                productShareReciverCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            productShareReciverCategory.addRequested = false;
            productShareReciverCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a product Content 
    productShareReciverCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!productShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        productShareReciverCategory.treeConfig.showbusy = true;
        productShareReciverCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                productShareReciverCategory.categoryBusyIndicator.isActive = true;
                console.log(productShareReciverCategory.gridOptions.selectedRow.item);
                productShareReciverCategory.showbusy = true;
                productShareReciverCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"productShareReciverCategory/GetOne", productShareReciverCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    productShareReciverCategory.showbusy = false;
                    productShareReciverCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    productShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(productShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"productShareReciverCategory/delete", productShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        productShareReciverCategory.categoryBusyIndicator.isActive = false;
                        productShareReciverCategory.treeConfig.showbusy = false;
                        productShareReciverCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            productShareReciverCategory.replaceItem(productShareReciverCategory.selectedItemForDelete.Id);
                            productShareReciverCategory.gridOptions.fillData(productShareReciverCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        productShareReciverCategory.treeConfig.showbusy = false;
                        productShareReciverCategory.showIsBusy = false;
                        productShareReciverCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    productShareReciverCategory.treeConfig.showbusy = false;
                    productShareReciverCategory.showIsBusy = false;
                    productShareReciverCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }





    ////Replace Item OnDelete/OnEdit Grid Options
    productShareReciverCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(productShareReciverCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = productShareReciverCategory.ListItems.indexOf(item);
                productShareReciverCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            productShareReciverCategory.ListItems.unshift(newItem);
    }


    productShareReciverCategory.searchData = function () {
        productShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"productShareReciverCategory/getall", productShareReciverCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            productShareReciverCategory.categoryBusyIndicator.isActive = false;
            productShareReciverCategory.ListItems = response.ListItems;
            productShareReciverCategory.gridOptions.fillData(productShareReciverCategory.ListItems);
            productShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            productShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            productShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
            productShareReciverCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            productShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    productShareReciverCategory.addRequested = false;
    productShareReciverCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    productShareReciverCategory.showIsBusy = false;



    //For reInit Categories
    productShareReciverCategory.gridOptions.reGetAll = function () {
        if (productShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) productShareReciverCategory.searchData();
        else productShareReciverCategory.init();
    };

    productShareReciverCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, productShareReciverCategory.treeConfig.currentNode);
    }

    productShareReciverCategory.loadFileAndFolder = function (item) {
        productShareReciverCategory.treeConfig.currentNode = item;
        console.log(item);
        productShareReciverCategory.treeConfig.onNodeSelect(item);
    }

    productShareReciverCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            productShareReciverCategory.focus = true;
        });
    };
    productShareReciverCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            productShareReciverCategory.focus1 = true;
        });
    };

    productShareReciverCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }


    // End of Upload Modal-----------------------------------------
    productShareReciverCategory.columnCheckbox = false;
    productShareReciverCategory.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (productShareReciverCategory.gridOptions.columnCheckbox) {
            for (var i = 0; i < productShareReciverCategory.gridOptions.columns.length; i++) {
                //productShareReciverCategory.gridOptions.columns[i].visible = $("#" + productShareReciverCategory.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + productShareReciverCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                productShareReciverCategory.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = productShareReciverCategory.gridOptions.columns;
            for (var i = 0; i < productShareReciverCategory.gridOptions.columns.length; i++) {
                productShareReciverCategory.gridOptions.columns[i].visible = true;
                var element = $("#" + productShareReciverCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + productShareReciverCategory.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < productShareReciverCategory.gridOptions.columns.length; i++) {
            console.log(productShareReciverCategory.gridOptions.columns[i].name.concat(".visible: "), productShareReciverCategory.gridOptions.columns[i].visible);
        }
        productShareReciverCategory.gridOptions.columnCheckbox = !productShareReciverCategory.gridOptions.columnCheckbox;
    }
    //Export Report 
    productShareReciverCategory.exportFile = function () {
        productShareReciverCategory.addRequested = true;
        productShareReciverCategory.gridOptions.advancedSearchData.engine.ExportFile = productShareReciverCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'productShareReciverCategory/exportfile', productShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            productShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                productShareReciverCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //productShareReciverCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    productShareReciverCategory.toggleExportForm = function () {
        productShareReciverCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        productShareReciverCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        productShareReciverCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        productShareReciverCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        productShareReciverCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleProduct/productShareReciverCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    productShareReciverCategory.rowCountChanged = function () {
        if (!angular.isDefined(productShareReciverCategory.ExportFileClass.RowCount) || productShareReciverCategory.ExportFileClass.RowCount > 5000)
            productShareReciverCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    productShareReciverCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"productShareReciverCategory/count", productShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            productShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            productShareReciverCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            productShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    productShareReciverCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            productShareReciverCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    productShareReciverCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (productShareReciverCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    productShareReciverCategory.onNodeToggle = function (node, expanded) {
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

    productShareReciverCategory.onSelection = function (node, selected) {
        if (!selected) {
            productShareReciverCategory.selectedItem.LinkMainImageId = null;
            productShareReciverCategory.selectedItem.previewImageSrc = null;
            return;
        }
        productShareReciverCategory.selectedItem.LinkMainImageId = node.Id;
        productShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            productShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
