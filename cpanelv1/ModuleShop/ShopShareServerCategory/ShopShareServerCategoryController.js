app.controller("shopShareServerCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var shopShareServerCategory = this;
    //For Grid Options
    shopShareServerCategory.gridOptions = {};
    shopShareServerCategory.selectedItem = {};
    shopShareServerCategory.attachedFiles = [];
    shopShareServerCategory.attachedFile = "";

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) shopShareServerCategory.itemRecordStatus = itemRecordStatus;

    
    shopShareServerCategory.LinkShareMainAdminSettingIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkServerCategoryId',
        url: 'ShopCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        scope: shopShareServerCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    //shop Grid Options
                      
    shopShareServerCategory.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSharedCategoryId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }
    //For Show Category Loading Indicator
    shopShareServerCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show shop Loading Indicator
    shopShareServerCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    shopShareServerCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    shopShareServerCategory.treeConfig.currentNode = {};
    shopShareServerCategory.treeBusyIndicator = false;

    shopShareServerCategory.addRequested = false;

    shopShareServerCategory.showGridComment = false;
    shopShareServerCategory.shopTitle = "";

    //init Function
    shopShareServerCategory.init = function () {
        shopShareServerCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = shopShareServerCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        shopShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ShopShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            shopShareServerCategory.treeConfig.Items = response.ListItems;
            shopShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        shopShareServerCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"shopShareServerCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopShareServerCategory.ListItems = response.ListItems;
            shopShareServerCategory.gridOptions.fillData(shopShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            shopShareServerCategory.contentBusyIndicator.isActive = false;
            shopShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            shopShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            shopShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            shopShareServerCategory.contentBusyIndicator.isActive = false;
        });
  
    };

    // Open Add Category Modal 
    shopShareServerCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        shopShareServerCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            shopShareServerCategory.selectedItem = response.Item;
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
                shopShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(shopShareServerCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleShop/ShopShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    shopShareServerCategory.addRequested = false;
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
    shopShareServerCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        shopShareServerCategory.addRequested = false;
        shopShareServerCategory.modalTitle = 'ویرایش';
        if (!shopShareServerCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        shopShareServerCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopShareMainAdminSetting/GetOne', shopShareServerCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            shopShareServerCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            shopShareServerCategory.selectedItem = response.Item;
            //Set dataForTheTree
            shopShareServerCategory.selectedNode = [];
            shopShareServerCategory.expandedNodes = [];
            shopShareServerCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                shopShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(shopShareServerCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (shopShareServerCategory.selectedItem.LinkMainImageId > 0)
                        shopShareServerCategory.onSelection({ Id: shopShareServerCategory.selectedItem.LinkMainImageId }, true);
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
    shopShareServerCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopShareServerCategory.categoryBusyIndicator.isActive = true;
        shopShareServerCategory.addRequested = true;
        shopShareServerCategory.selectedItem.LinkParentId = null;
        if (shopShareServerCategory.treeConfig.currentNode != null)
            shopShareServerCategory.selectedItem.LinkParentId = shopShareServerCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopShareMainAdminSetting/add', shopShareServerCategory.selectedItem, 'POST').success(function (response) {
            shopShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                shopShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                shopShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                shopShareServerCategory.gridOptions.reGetAll();
                shopShareServerCategory.closeModal();
            }
            shopShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopShareServerCategory.addRequested = false;
            shopShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    shopShareServerCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopShareServerCategory.categoryBusyIndicator.isActive = true;
        shopShareServerCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopShareMainAdminSetting/edit', shopShareServerCategory.selectedItem, 'PUT').success(function (response) {
            //shopShareServerCategory.showbusy = false;
            shopShareServerCategory.treeConfig.showbusy = false;
            shopShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopShareServerCategory.treeConfig.currentNode.Title = response.Item.Title;
                shopShareServerCategory.closeModal();
            }
            shopShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopShareServerCategory.addRequested = false;
            shopShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    shopShareServerCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = shopShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                shopShareServerCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'ShopShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    shopShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(shopShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ShopShareMainAdminSetting/delete', shopShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        shopShareServerCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //shopShareServerCategory.replaceCategoryItem(shopShareServerCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            shopShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            shopShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            shopShareServerCategory.gridOptions.fillData();
                            shopShareServerCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        shopShareServerCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    shopShareServerCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    shopShareServerCategory.treeConfig.onNodeSelect = function () {
        var node = shopShareServerCategory.treeConfig.currentNode;
        shopShareServerCategory.showGridComment = false;
        shopShareServerCategory.selectContent(node);

    };
    //Show Content with Category Id
    shopShareServerCategory.selectContent = function (node) {
        shopShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
        shopShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            shopShareServerCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            shopShareServerCategory.contentBusyIndicator.isActive = true;
            shopShareServerCategory.attachedFiles = null;
            shopShareServerCategory.attachedFiles = [];
            var s = {
                PropertyName: "LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            shopShareServerCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"shopShareServerCategory/getall", shopShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopShareServerCategory.contentBusyIndicator.isActive = false;
            shopShareServerCategory.ListItems = response.ListItems;
            shopShareServerCategory.gridOptions.fillData(shopShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            shopShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            shopShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            shopShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    shopShareServerCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = shopShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        shopShareServerCategory.addRequested = false;
        shopShareServerCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopShareServerCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            shopShareServerCategory.selectedItem = response.Item;
            shopShareServerCategory.selectedItem.LinkShareMainAdminSettingId = node.Id;
            shopShareServerCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleshop/shopShareServerCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    shopShareServerCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        shopShareServerCategory.addRequested = false;
        shopShareServerCategory.modalTitle = 'ویرایش';
        if (!shopShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopShareServerCategory/GetOne', shopShareServerCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            shopShareServerCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleshop/shopShareServerCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    shopShareServerCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopShareServerCategory.categoryBusyIndicator.isActive = true;
        shopShareServerCategory.addRequested = true;

        if (shopShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || shopShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'shopShareServerCategory/add', shopShareServerCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopShareServerCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                shopShareServerCategory.ListItems.unshift(response.Item);
                shopShareServerCategory.gridOptions.fillData(shopShareServerCategory.ListItems);
                shopShareServerCategory.closeModal();
            
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopShareServerCategory.addRequested = false;
            shopShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    shopShareServerCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopShareServerCategory.categoryBusyIndicator.isActive = true;
        shopShareServerCategory.addRequested = true;
    
        if (shopShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || shopShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'shopShareServerCategory/edit', shopShareServerCategory.selectedItem, 'PUT').success(function (response) {
            shopShareServerCategory.categoryBusyIndicator.isActive = false;
            shopShareServerCategory.addRequested = false;
            shopShareServerCategory.treeConfig.showbusy = false;
            shopShareServerCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopShareServerCategory.replaceItem(shopShareServerCategory.selectedItem.Id, response.Item);
                shopShareServerCategory.gridOptions.fillData(shopShareServerCategory.ListItems);
                shopShareServerCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopShareServerCategory.addRequested = false;
            shopShareServerCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a shop Content 
    shopShareServerCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!shopShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        shopShareServerCategory.treeConfig.showbusy = true;
        shopShareServerCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                shopShareServerCategory.categoryBusyIndicator.isActive = true;
                console.log(shopShareServerCategory.gridOptions.selectedRow.item);
                shopShareServerCategory.showbusy = true;
                shopShareServerCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"shopShareServerCategory/GetOne", shopShareServerCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    shopShareServerCategory.showbusy = false;
                    shopShareServerCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    shopShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(shopShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"shopShareServerCategory/delete", shopShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        shopShareServerCategory.categoryBusyIndicator.isActive = false;
                        shopShareServerCategory.treeConfig.showbusy = false;
                        shopShareServerCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            shopShareServerCategory.replaceItem(shopShareServerCategory.selectedItemForDelete.Id);
                            shopShareServerCategory.gridOptions.fillData(shopShareServerCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        shopShareServerCategory.treeConfig.showbusy = false;
                        shopShareServerCategory.showIsBusy = false;
                        shopShareServerCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    shopShareServerCategory.treeConfig.showbusy = false;
                    shopShareServerCategory.showIsBusy = false;
                    shopShareServerCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }

    

   

    ////Replace Item OnDelete/OnEdit Grid Options
    shopShareServerCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(shopShareServerCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = shopShareServerCategory.ListItems.indexOf(item);
                shopShareServerCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            shopShareServerCategory.ListItems.unshift(newItem);
    }

   
    shopShareServerCategory.searchData = function () {
        shopShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"shopShareServerCategory/getall", shopShareServerCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            shopShareServerCategory.categoryBusyIndicator.isActive = false;
            shopShareServerCategory.ListItems = response.ListItems;
            shopShareServerCategory.gridOptions.fillData(shopShareServerCategory.ListItems);
            shopShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            shopShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
            shopShareServerCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            shopShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    shopShareServerCategory.addRequested = false;
    shopShareServerCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    shopShareServerCategory.showIsBusy = false;

   

    //For reInit Categories
    shopShareServerCategory.gridOptions.reGetAll = function () {
        if (shopShareServerCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) shopShareServerCategory.searchData();
        else shopShareServerCategory.init();
    };

    shopShareServerCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, shopShareServerCategory.treeConfig.currentNode);
    }

    shopShareServerCategory.loadFileAndFolder = function (item) {
        shopShareServerCategory.treeConfig.currentNode = item;
        console.log(item);
        shopShareServerCategory.treeConfig.onNodeSelect(item);
    }

    shopShareServerCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            shopShareServerCategory.focus = true;
        });
    };
    shopShareServerCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            shopShareServerCategory.focus1 = true;
        });
    };

     shopShareServerCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

  
   // End of Upload Modal-----------------------------------------

    //Export Report 
    shopShareServerCategory.exportFile = function () {
        shopShareServerCategory.addRequested = true;
        shopShareServerCategory.gridOptions.advancedSearchData.engine.ExportFile = shopShareServerCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'shopShareServerCategory/exportfile', shopShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            shopShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopShareServerCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //shopShareServerCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    shopShareServerCategory.toggleExportForm = function () {
        shopShareServerCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        shopShareServerCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        shopShareServerCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        shopShareServerCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        shopShareServerCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleShop/shopShareServerCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    shopShareServerCategory.rowCountChanged = function () {
        if (!angular.isDefined(shopShareServerCategory.ExportFileClass.RowCount) || shopShareServerCategory.ExportFileClass.RowCount > 5000)
            shopShareServerCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    shopShareServerCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"shopShareServerCategory/count", shopShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            shopShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            shopShareServerCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            shopShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    shopShareServerCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            shopShareServerCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    shopShareServerCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (shopShareServerCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    shopShareServerCategory.onNodeToggle = function (node, expanded) {
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

    shopShareServerCategory.onSelection = function (node, selected) {
        if (!selected) {
            shopShareServerCategory.selectedItem.LinkMainImageId = null;
            shopShareServerCategory.selectedItem.previewImageSrc = null;
            return;
        }
        shopShareServerCategory.selectedItem.LinkMainImageId = node.Id;
        shopShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            shopShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
