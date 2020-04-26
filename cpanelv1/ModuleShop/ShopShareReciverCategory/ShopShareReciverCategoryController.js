app.controller("shopShareReciverCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var shopShareReciverCategory = this;
    //For Grid Options
    shopShareReciverCategory.gridOptions = {};
    shopShareReciverCategory.selectedItem = {};
    shopShareReciverCategory.attachedFiles = [];
    shopShareReciverCategory.attachedFile = "";

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    var todayDate = moment().format();

    shopShareReciverCategory.ToDate = {
        defaultDate: todayDate
    }
    shopShareReciverCategory.FromDate = {
        defaultDate: todayDate
    }
    shopShareReciverCategory.testDate = moment().format();
    if (itemRecordStatus != undefined) shopShareReciverCategory.itemRecordStatus = itemRecordStatus;


    shopShareReciverCategory.LinkShareReciverCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareReciverCategoryId',
        url: 'ShopCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        scope: shopShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    //shop Grid Options
    shopShareReciverCategory.LinkShareServerCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareServerCategoryId',
        url: 'ShopShareServerCategory',
        Action:'GetAllOtherSite',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        scope: shopShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    shopShareReciverCategory.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'ShareServerCategory.LinkShareMainAdminSettingId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
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
    shopShareReciverCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show shop Loading Indicator
    shopShareReciverCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    shopShareReciverCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    shopShareReciverCategory.treeConfig.currentNode = {};
    shopShareReciverCategory.treeBusyIndicator = false;

    shopShareReciverCategory.addRequested = false;

    shopShareReciverCategory.showGridComment = false;
    shopShareReciverCategory.shopTitle = "";

    //init Function
    shopShareReciverCategory.init = function () {
        shopShareReciverCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = shopShareReciverCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        shopShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ShopShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            shopShareReciverCategory.treeConfig.Items = response.ListItems;
            shopShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        shopShareReciverCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"shopShareReciverCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopShareReciverCategory.ListItems = response.ListItems;
            shopShareReciverCategory.gridOptions.fillData(shopShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            shopShareReciverCategory.contentBusyIndicator.isActive = false;
            shopShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            shopShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            shopShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            shopShareReciverCategory.contentBusyIndicator.isActive = false;
        });

    };

    // Open Add Category Modal 
    shopShareReciverCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        shopShareReciverCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            shopShareReciverCategory.selectedItem = response.Item;
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
                shopShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(shopShareReciverCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleShop/ShopShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    shopShareReciverCategory.addRequested = false;
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
    shopShareReciverCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        shopShareReciverCategory.addRequested = false;
        shopShareReciverCategory.modalTitle = 'ویرایش';
        if (!shopShareReciverCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        shopShareReciverCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopShareMainAdminSetting/GetOne', shopShareReciverCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            shopShareReciverCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            shopShareReciverCategory.selectedItem = response.Item;
            //Set dataForTheTree
            shopShareReciverCategory.selectedNode = [];
            shopShareReciverCategory.expandedNodes = [];
            shopShareReciverCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                shopShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(shopShareReciverCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (shopShareReciverCategory.selectedItem.LinkMainImageId > 0)
                        shopShareReciverCategory.onSelection({ Id: shopShareReciverCategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleShop/ShopShareMainAdminSetting/edit.html',
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
    shopShareReciverCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopShareReciverCategory.categoryBusyIndicator.isActive = true;
        shopShareReciverCategory.addRequested = true;
        shopShareReciverCategory.selectedItem.LinkParentId = null;
        if (shopShareReciverCategory.treeConfig.currentNode != null)
            shopShareReciverCategory.selectedItem.LinkParentId = shopShareReciverCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopShareMainAdminSetting/add', shopShareReciverCategory.selectedItem, 'POST').success(function (response) {
            shopShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                shopShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                shopShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                shopShareReciverCategory.gridOptions.reGetAll();
                shopShareReciverCategory.closeModal();
            }
            shopShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopShareReciverCategory.addRequested = false;
            shopShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    shopShareReciverCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopShareReciverCategory.categoryBusyIndicator.isActive = true;
        shopShareReciverCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopShareMainAdminSetting/edit', shopShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            //shopShareReciverCategory.showbusy = false;
            shopShareReciverCategory.treeConfig.showbusy = false;
            shopShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopShareReciverCategory.treeConfig.currentNode.Title = response.Item.Title;
                shopShareReciverCategory.closeModal();
            }
            shopShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopShareReciverCategory.addRequested = false;
            shopShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    shopShareReciverCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = shopShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                shopShareReciverCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'ShopShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    shopShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(shopShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ShopShareMainAdminSetting/delete', shopShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        shopShareReciverCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //shopShareReciverCategory.replaceCategoryItem(shopShareReciverCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            shopShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            shopShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            shopShareReciverCategory.gridOptions.fillData();
                            shopShareReciverCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        shopShareReciverCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    shopShareReciverCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    shopShareReciverCategory.treeConfig.onNodeSelect = function () {
        var node = shopShareReciverCategory.treeConfig.currentNode;
        shopShareReciverCategory.showGridComment = false;
        shopShareReciverCategory.selectContent(node);

    };
    //Show Content with Category Id
    shopShareReciverCategory.selectContent = function (node) {
        shopShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
        shopShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            shopShareReciverCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            shopShareReciverCategory.contentBusyIndicator.isActive = true;
            shopShareReciverCategory.attachedFiles = null;
            shopShareReciverCategory.attachedFiles = [];
            var s = {
                PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            shopShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"shopShareReciverCategory/getall", shopShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopShareReciverCategory.contentBusyIndicator.isActive = false;
            shopShareReciverCategory.ListItems = response.ListItems;
            shopShareReciverCategory.gridOptions.fillData(shopShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            shopShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            shopShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            shopShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    shopShareReciverCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = shopShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        shopShareReciverCategory.addRequested = false;
        shopShareReciverCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopShareReciverCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            shopShareReciverCategory.selectedItem = response.Item;
            shopShareReciverCategory.selectedItem.LinkShareServerCategoryId = node.Id;
            shopShareReciverCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleshop/shopShareReciverCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    shopShareReciverCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        shopShareReciverCategory.addRequested = false;
        shopShareReciverCategory.modalTitle = 'ویرایش';
        if (!shopShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopShareReciverCategory/GetOne', shopShareReciverCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            shopShareReciverCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleshop/shopShareReciverCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    shopShareReciverCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopShareReciverCategory.categoryBusyIndicator.isActive = true;
        shopShareReciverCategory.addRequested = true;

        if (shopShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || shopShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'shopShareReciverCategory/add', shopShareReciverCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopShareReciverCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                shopShareReciverCategory.ListItems.unshift(response.Item);
                shopShareReciverCategory.gridOptions.fillData(shopShareReciverCategory.ListItems);
                shopShareReciverCategory.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopShareReciverCategory.addRequested = false;
            shopShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    shopShareReciverCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopShareReciverCategory.categoryBusyIndicator.isActive = true;
        shopShareReciverCategory.addRequested = true;

        if (shopShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || shopShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'shopShareReciverCategory/edit', shopShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            shopShareReciverCategory.categoryBusyIndicator.isActive = false;
            shopShareReciverCategory.addRequested = false;
            shopShareReciverCategory.treeConfig.showbusy = false;
            shopShareReciverCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopShareReciverCategory.replaceItem(shopShareReciverCategory.selectedItem.Id, response.Item);
                shopShareReciverCategory.gridOptions.fillData(shopShareReciverCategory.ListItems);
                shopShareReciverCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopShareReciverCategory.addRequested = false;
            shopShareReciverCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a shop Content 
    shopShareReciverCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!shopShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        shopShareReciverCategory.treeConfig.showbusy = true;
        shopShareReciverCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                shopShareReciverCategory.categoryBusyIndicator.isActive = true;
                console.log(shopShareReciverCategory.gridOptions.selectedRow.item);
                shopShareReciverCategory.showbusy = true;
                shopShareReciverCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"shopShareReciverCategory/GetOne", shopShareReciverCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    shopShareReciverCategory.showbusy = false;
                    shopShareReciverCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    shopShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(shopShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"shopShareReciverCategory/delete", shopShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        shopShareReciverCategory.categoryBusyIndicator.isActive = false;
                        shopShareReciverCategory.treeConfig.showbusy = false;
                        shopShareReciverCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            shopShareReciverCategory.replaceItem(shopShareReciverCategory.selectedItemForDelete.Id);
                            shopShareReciverCategory.gridOptions.fillData(shopShareReciverCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        shopShareReciverCategory.treeConfig.showbusy = false;
                        shopShareReciverCategory.showIsBusy = false;
                        shopShareReciverCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    shopShareReciverCategory.treeConfig.showbusy = false;
                    shopShareReciverCategory.showIsBusy = false;
                    shopShareReciverCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }





    ////Replace Item OnDelete/OnEdit Grid Options
    shopShareReciverCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(shopShareReciverCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = shopShareReciverCategory.ListItems.indexOf(item);
                shopShareReciverCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            shopShareReciverCategory.ListItems.unshift(newItem);
    }


    shopShareReciverCategory.searchData = function () {
        shopShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"shopShareReciverCategory/getall", shopShareReciverCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            shopShareReciverCategory.categoryBusyIndicator.isActive = false;
            shopShareReciverCategory.ListItems = response.ListItems;
            shopShareReciverCategory.gridOptions.fillData(shopShareReciverCategory.ListItems);
            shopShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            shopShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
            shopShareReciverCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            shopShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    shopShareReciverCategory.addRequested = false;
    shopShareReciverCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    shopShareReciverCategory.showIsBusy = false;



    //For reInit Categories
    shopShareReciverCategory.gridOptions.reGetAll = function () {
        if (shopShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) shopShareReciverCategory.searchData();
        else shopShareReciverCategory.init();
    };

    shopShareReciverCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, shopShareReciverCategory.treeConfig.currentNode);
    }

    shopShareReciverCategory.loadFileAndFolder = function (item) {
        shopShareReciverCategory.treeConfig.currentNode = item;
        console.log(item);
        shopShareReciverCategory.treeConfig.onNodeSelect(item);
    }

    shopShareReciverCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            shopShareReciverCategory.focus = true;
        });
    };
    shopShareReciverCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            shopShareReciverCategory.focus1 = true;
        });
    };

    shopShareReciverCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }


    // End of Upload Modal-----------------------------------------

    //Export Report 
    shopShareReciverCategory.exportFile = function () {
        shopShareReciverCategory.addRequested = true;
        shopShareReciverCategory.gridOptions.advancedSearchData.engine.ExportFile = shopShareReciverCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'shopShareReciverCategory/exportfile', shopShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            shopShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopShareReciverCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //shopShareReciverCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    shopShareReciverCategory.toggleExportForm = function () {
        shopShareReciverCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        shopShareReciverCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        shopShareReciverCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        shopShareReciverCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        shopShareReciverCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleShop/shopShareReciverCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    shopShareReciverCategory.rowCountChanged = function () {
        if (!angular.isDefined(shopShareReciverCategory.ExportFileClass.RowCount) || shopShareReciverCategory.ExportFileClass.RowCount > 5000)
            shopShareReciverCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    shopShareReciverCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"shopShareReciverCategory/count", shopShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            shopShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            shopShareReciverCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            shopShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    shopShareReciverCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            shopShareReciverCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    shopShareReciverCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (shopShareReciverCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    shopShareReciverCategory.onNodeToggle = function (node, expanded) {
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

    shopShareReciverCategory.onSelection = function (node, selected) {
        if (!selected) {
            shopShareReciverCategory.selectedItem.LinkMainImageId = null;
            shopShareReciverCategory.selectedItem.previewImageSrc = null;
            return;
        }
        shopShareReciverCategory.selectedItem.LinkMainImageId = node.Id;
        shopShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            shopShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
