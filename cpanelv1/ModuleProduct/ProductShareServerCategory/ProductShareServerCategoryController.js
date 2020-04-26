app.controller("productShareServerCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var productShareServerCategory = this;
    //For Grid Options
    productShareServerCategory.gridOptions = {};
    productShareServerCategory.selectedItem = {};
    productShareServerCategory.attachedFiles = [];
    productShareServerCategory.attachedFile = "";

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) productShareServerCategory.itemRecordStatus = itemRecordStatus;

    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    productShareServerCategory.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "productShareServerCategoryController") {
            localStorage.setItem('AddRequest', '');
            productShareServerCategory.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    productShareServerCategory.LinkShareMainAdminSettingIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkServerCategoryId',
        url: 'ProductCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: productShareServerCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    //product Grid Options
                      
    productShareServerCategory.gridOptions = {
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
    productShareServerCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show product Loading Indicator
    productShareServerCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    productShareServerCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    productShareServerCategory.treeConfig.currentNode = {};
    productShareServerCategory.treeBusyIndicator = false;

    productShareServerCategory.addRequested = false;

    productShareServerCategory.showGridComment = false;
    productShareServerCategory.productTitle = "";

    //init Function
    productShareServerCategory.init = function () {
        productShareServerCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = productShareServerCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        productShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ProductShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            productShareServerCategory.treeConfig.Items = response.ListItems;
            productShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        productShareServerCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"productShareServerCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            productShareServerCategory.ListItems = response.ListItems;
            productShareServerCategory.gridOptions.fillData(productShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            productShareServerCategory.contentBusyIndicator.isActive = false;
            productShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            productShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            productShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            productShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            productShareServerCategory.contentBusyIndicator.isActive = false;
        });
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        productShareServerCategory.checkRequestAddNewItemFromOtherControl(null);
    };

    // Open Add Category Modal 
    productShareServerCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        productShareServerCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ProductShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            productShareServerCategory.selectedItem = response.Item;
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
                productShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(productShareServerCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleProduct/ProductShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    productShareServerCategory.addRequested = false;
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
    productShareServerCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        productShareServerCategory.addRequested = false;
        productShareServerCategory.modalTitle = 'ویرایش';
        if (!productShareServerCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        productShareServerCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ProductShareMainAdminSetting/GetOne', productShareServerCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            productShareServerCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            productShareServerCategory.selectedItem = response.Item;
            //Set dataForTheTree
            productShareServerCategory.selectedNode = [];
            productShareServerCategory.expandedNodes = [];
            productShareServerCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                productShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(productShareServerCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (productShareServerCategory.selectedItem.LinkMainImageId > 0)
                        productShareServerCategory.onSelection({ Id: productShareServerCategory.selectedItem.LinkMainImageId }, true);
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
    productShareServerCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        productShareServerCategory.categoryBusyIndicator.isActive = true;
        productShareServerCategory.addRequested = true;
        productShareServerCategory.selectedItem.LinkParentId = null;
        if (productShareServerCategory.treeConfig.currentNode != null)
            productShareServerCategory.selectedItem.LinkParentId = productShareServerCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'ProductShareMainAdminSetting/add', productShareServerCategory.selectedItem, 'POST').success(function (response) {
            productShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                productShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                productShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                productShareServerCategory.gridOptions.reGetAll();
                productShareServerCategory.closeModal();
            }
            productShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            productShareServerCategory.addRequested = false;
            productShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    productShareServerCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        productShareServerCategory.categoryBusyIndicator.isActive = true;
        productShareServerCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ProductShareMainAdminSetting/edit', productShareServerCategory.selectedItem, 'PUT').success(function (response) {
            //productShareServerCategory.showbusy = false;
            productShareServerCategory.treeConfig.showbusy = false;
            productShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                productShareServerCategory.treeConfig.currentNode.Title = response.Item.Title;
                productShareServerCategory.closeModal();
            }
            productShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            productShareServerCategory.addRequested = false;
            productShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    productShareServerCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = productShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                productShareServerCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'ProductShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    productShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(productShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ProductShareMainAdminSetting/delete', productShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        productShareServerCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //productShareServerCategory.replaceCategoryItem(productShareServerCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            productShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            productShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            productShareServerCategory.gridOptions.fillData();
                            productShareServerCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        productShareServerCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    productShareServerCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    productShareServerCategory.treeConfig.onNodeSelect = function () {
        var node = productShareServerCategory.treeConfig.currentNode;
        productShareServerCategory.showGridComment = false;
        productShareServerCategory.selectContent(node);

    };
    //Show Content with Category Id
    productShareServerCategory.selectContent = function (node) {
        productShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
        productShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            productShareServerCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            productShareServerCategory.contentBusyIndicator.isActive = true;
            productShareServerCategory.attachedFiles = null;
            productShareServerCategory.attachedFiles = [];
            var s = {
                PropertyName: "LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            productShareServerCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"productShareServerCategory/getall", productShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            productShareServerCategory.contentBusyIndicator.isActive = false;
            productShareServerCategory.ListItems = response.ListItems;
            productShareServerCategory.gridOptions.fillData(productShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            productShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            productShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            productShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            productShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    productShareServerCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = productShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        productShareServerCategory.addRequested = false;
        productShareServerCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'productShareServerCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            productShareServerCategory.selectedItem = response.Item;
            productShareServerCategory.selectedItem.LinkShareMainAdminSettingId = node.Id;
            productShareServerCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleproduct/productShareServerCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    productShareServerCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        productShareServerCategory.addRequested = false;
        productShareServerCategory.modalTitle = 'ویرایش';
        if (!productShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'productShareServerCategory/GetOne', productShareServerCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            productShareServerCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleproduct/productShareServerCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    productShareServerCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        productShareServerCategory.categoryBusyIndicator.isActive = true;
        productShareServerCategory.addRequested = true;

        if (productShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || productShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'productShareServerCategory/add', productShareServerCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            productShareServerCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                productShareServerCategory.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                productShareServerCategory.ListItems.unshift(response.Item);
                productShareServerCategory.gridOptions.fillData(productShareServerCategory.ListItems);
                productShareServerCategory.closeModal();
            
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            productShareServerCategory.addRequested = false;
            productShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    productShareServerCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        productShareServerCategory.categoryBusyIndicator.isActive = true;
        productShareServerCategory.addRequested = true;
    
        if (productShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || productShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'productShareServerCategory/edit', productShareServerCategory.selectedItem, 'PUT').success(function (response) {
            productShareServerCategory.categoryBusyIndicator.isActive = false;
            productShareServerCategory.addRequested = false;
            productShareServerCategory.treeConfig.showbusy = false;
            productShareServerCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                productShareServerCategory.replaceItem(productShareServerCategory.selectedItem.Id, response.Item);
                productShareServerCategory.gridOptions.fillData(productShareServerCategory.ListItems);
                productShareServerCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            productShareServerCategory.addRequested = false;
            productShareServerCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a product Content 
    productShareServerCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!productShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        productShareServerCategory.treeConfig.showbusy = true;
        productShareServerCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                productShareServerCategory.categoryBusyIndicator.isActive = true;
                console.log(productShareServerCategory.gridOptions.selectedRow.item);
                productShareServerCategory.showbusy = true;
                productShareServerCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"productShareServerCategory/GetOne", productShareServerCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    productShareServerCategory.showbusy = false;
                    productShareServerCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    productShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(productShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"productShareServerCategory/delete", productShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        productShareServerCategory.categoryBusyIndicator.isActive = false;
                        productShareServerCategory.treeConfig.showbusy = false;
                        productShareServerCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            productShareServerCategory.replaceItem(productShareServerCategory.selectedItemForDelete.Id);
                            productShareServerCategory.gridOptions.fillData(productShareServerCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        productShareServerCategory.treeConfig.showbusy = false;
                        productShareServerCategory.showIsBusy = false;
                        productShareServerCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    productShareServerCategory.treeConfig.showbusy = false;
                    productShareServerCategory.showIsBusy = false;
                    productShareServerCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }

    

   

    ////Replace Item OnDelete/OnEdit Grid Options
    productShareServerCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(productShareServerCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = productShareServerCategory.ListItems.indexOf(item);
                productShareServerCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            productShareServerCategory.ListItems.unshift(newItem);
    }

   
    productShareServerCategory.searchData = function () {
        productShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"productShareServerCategory/getall", productShareServerCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            productShareServerCategory.categoryBusyIndicator.isActive = false;
            productShareServerCategory.ListItems = response.ListItems;
            productShareServerCategory.gridOptions.fillData(productShareServerCategory.ListItems);
            productShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            productShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            productShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
            productShareServerCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            productShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    productShareServerCategory.addRequested = false;
    productShareServerCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    productShareServerCategory.showIsBusy = false;

   

    //For reInit Categories
    productShareServerCategory.gridOptions.reGetAll = function () {
        if (productShareServerCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) productShareServerCategory.searchData();
        else productShareServerCategory.init();
    };

    productShareServerCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, productShareServerCategory.treeConfig.currentNode);
    }

    productShareServerCategory.loadFileAndFolder = function (item) {
        productShareServerCategory.treeConfig.currentNode = item;
        console.log(item);
        productShareServerCategory.treeConfig.onNodeSelect(item);
    }

    productShareServerCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            productShareServerCategory.focus = true;
        });
    };
    productShareServerCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            productShareServerCategory.focus1 = true;
        });
    };

     productShareServerCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

  
   // End of Upload Modal-----------------------------------------
     productShareServerCategory.columnCheckbox = false;
     productShareServerCategory.openGridConfigModal = function () {
         $("#gridView-btn").toggleClass("active");
         if (productShareServerCategory.gridOptions.columnCheckbox) {
             for (var i = 0; i < productShareServerCategory.gridOptions.columns.length; i++) {
                 //productShareServerCategory.gridOptions.columns[i].visible = $("#" + productShareServerCategory.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                 var element = $("#" + productShareServerCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                 //var temp = element[0].checked;
                 productShareServerCategory.gridOptions.columns[i].visible = element[0].checked;
             }
         }
         else {
             var prechangeColumns = productShareServerCategory.gridOptions.columns;
             for (var i = 0; i < productShareServerCategory.gridOptions.columns.length; i++) {
                 productShareServerCategory.gridOptions.columns[i].visible = true;
                 var element = $("#" + productShareServerCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                 $("#" + productShareServerCategory.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
             }
         }
         for (var i = 0; i < productShareServerCategory.gridOptions.columns.length; i++) {
             console.log(productShareServerCategory.gridOptions.columns[i].name.concat(".visible: "), productShareServerCategory.gridOptions.columns[i].visible);
         }
         productShareServerCategory.gridOptions.columnCheckbox = !productShareServerCategory.gridOptions.columnCheckbox;
     }
    //Export Report 
    productShareServerCategory.exportFile = function () {
        productShareServerCategory.addRequested = true;
        productShareServerCategory.gridOptions.advancedSearchData.engine.ExportFile = productShareServerCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'productShareServerCategory/exportfile', productShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            productShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                productShareServerCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //productShareServerCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    productShareServerCategory.toggleExportForm = function () {
        productShareServerCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        productShareServerCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        productShareServerCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        productShareServerCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        productShareServerCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleProduct/productShareServerCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    productShareServerCategory.rowCountChanged = function () {
        if (!angular.isDefined(productShareServerCategory.ExportFileClass.RowCount) || productShareServerCategory.ExportFileClass.RowCount > 5000)
            productShareServerCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    productShareServerCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"productShareServerCategory/count", productShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            productShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            productShareServerCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            productShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    productShareServerCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            productShareServerCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    productShareServerCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (productShareServerCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    productShareServerCategory.onNodeToggle = function (node, expanded) {
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

    productShareServerCategory.onSelection = function (node, selected) {
        if (!selected) {
            productShareServerCategory.selectedItem.LinkMainImageId = null;
            productShareServerCategory.selectedItem.previewImageSrc = null;
            return;
        }
        productShareServerCategory.selectedItem.LinkMainImageId = node.Id;
        productShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            productShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
