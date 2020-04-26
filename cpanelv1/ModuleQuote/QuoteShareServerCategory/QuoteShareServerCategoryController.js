app.controller("quoteShareServerCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var quoteShareServerCategory = this;
    //For Grid Options
    quoteShareServerCategory.gridOptions = {};
    quoteShareServerCategory.selectedItem = {};
    quoteShareServerCategory.attachedFiles = [];
    quoteShareServerCategory.attachedFile = "";

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) quoteShareServerCategory.itemRecordStatus = itemRecordStatus;

    
    quoteShareServerCategory.LinkShareMainAdminSettingIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkServerCategoryId',
        url: 'QuoteCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        scope: quoteShareServerCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' }
            ]
        }
    }

    //quote Grid Options
                      
    quoteShareServerCategory.gridOptions = {
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
    quoteShareServerCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show quote Loading Indicator
    quoteShareServerCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    quoteShareServerCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    quoteShareServerCategory.treeConfig.currentNode = {};
    quoteShareServerCategory.treeBusyIndicator = false;

    quoteShareServerCategory.addRequested = false;

    quoteShareServerCategory.showGridComment = false;
    quoteShareServerCategory.quoteTitle = "";

    //init Function
    quoteShareServerCategory.init = function () {
        quoteShareServerCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = quoteShareServerCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        quoteShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"QuoteShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            quoteShareServerCategory.treeConfig.Items = response.ListItems;
            quoteShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        quoteShareServerCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"quoteShareServerCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            quoteShareServerCategory.ListItems = response.ListItems;
            quoteShareServerCategory.gridOptions.fillData(quoteShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            quoteShareServerCategory.contentBusyIndicator.isActive = false;
            quoteShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            quoteShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            quoteShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            quoteShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            quoteShareServerCategory.contentBusyIndicator.isActive = false;
        });
  
    };

    // Open Add Category Modal 
    quoteShareServerCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        quoteShareServerCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'QuoteShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            quoteShareServerCategory.selectedItem = response.Item;
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
                quoteShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(quoteShareServerCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleQuote/QuoteShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    quoteShareServerCategory.addRequested = false;
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
    quoteShareServerCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        quoteShareServerCategory.addRequested = false;
        quoteShareServerCategory.modalTitle = 'ویرایش';
        if (!quoteShareServerCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        quoteShareServerCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'QuoteShareMainAdminSetting/GetOne', quoteShareServerCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            quoteShareServerCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            quoteShareServerCategory.selectedItem = response.Item;
            //Set dataForTheTree
            quoteShareServerCategory.selectedNode = [];
            quoteShareServerCategory.expandedNodes = [];
            quoteShareServerCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                quoteShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(quoteShareServerCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (quoteShareServerCategory.selectedItem.LinkMainImageId > 0)
                        quoteShareServerCategory.onSelection({ Id: quoteShareServerCategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleQuote/QuoteShareMainAdminSetting/edit.html',
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
    quoteShareServerCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        quoteShareServerCategory.categoryBusyIndicator.isActive = true;
        quoteShareServerCategory.addRequested = true;
        quoteShareServerCategory.selectedItem.LinkParentId = null;
        if (quoteShareServerCategory.treeConfig.currentNode != null)
            quoteShareServerCategory.selectedItem.LinkParentId = quoteShareServerCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'QuoteShareMainAdminSetting/add', quoteShareServerCategory.selectedItem, 'POST').success(function (response) {
            quoteShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                quoteShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                quoteShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                quoteShareServerCategory.gridOptions.reGetAll();
                quoteShareServerCategory.closeModal();
            }
            quoteShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            quoteShareServerCategory.addRequested = false;
            quoteShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    quoteShareServerCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        quoteShareServerCategory.categoryBusyIndicator.isActive = true;
        quoteShareServerCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'QuoteShareMainAdminSetting/edit', quoteShareServerCategory.selectedItem, 'PUT').success(function (response) {
            //quoteShareServerCategory.showbusy = false;
            quoteShareServerCategory.treeConfig.showbusy = false;
            quoteShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                quoteShareServerCategory.treeConfig.currentNode.Title = response.Item.Title;
                quoteShareServerCategory.closeModal();
            }
            quoteShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            quoteShareServerCategory.addRequested = false;
            quoteShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    quoteShareServerCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = quoteShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                quoteShareServerCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'QuoteShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    quoteShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(quoteShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'QuoteShareMainAdminSetting/delete', quoteShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        quoteShareServerCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //quoteShareServerCategory.replaceCategoryItem(quoteShareServerCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            quoteShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            quoteShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            quoteShareServerCategory.gridOptions.fillData();
                            quoteShareServerCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        quoteShareServerCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    quoteShareServerCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    quoteShareServerCategory.treeConfig.onNodeSelect = function () {
        var node = quoteShareServerCategory.treeConfig.currentNode;
        quoteShareServerCategory.showGridComment = false;
        quoteShareServerCategory.selectContent(node);

    };
    //Show Content with Category Id
    quoteShareServerCategory.selectContent = function (node) {
        quoteShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
        quoteShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            quoteShareServerCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            quoteShareServerCategory.contentBusyIndicator.isActive = true;
            quoteShareServerCategory.attachedFiles = null;
            quoteShareServerCategory.attachedFiles = [];
            var s = {
                PropertyName: "LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            quoteShareServerCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"quoteShareServerCategory/getall", quoteShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            quoteShareServerCategory.contentBusyIndicator.isActive = false;
            quoteShareServerCategory.ListItems = response.ListItems;
            quoteShareServerCategory.gridOptions.fillData(quoteShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            quoteShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            quoteShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            quoteShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            quoteShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    quoteShareServerCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = quoteShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        quoteShareServerCategory.addRequested = false;
        quoteShareServerCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'quoteShareServerCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            quoteShareServerCategory.selectedItem = response.Item;
            quoteShareServerCategory.selectedItem.LinkShareMainAdminSettingId = node.Id;
            quoteShareServerCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/Modulequote/quoteShareServerCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    quoteShareServerCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        quoteShareServerCategory.addRequested = false;
        quoteShareServerCategory.modalTitle = 'ویرایش';
        if (!quoteShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'quoteShareServerCategory/GetOne', quoteShareServerCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            quoteShareServerCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulequote/quoteShareServerCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    quoteShareServerCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        quoteShareServerCategory.categoryBusyIndicator.isActive = true;
        quoteShareServerCategory.addRequested = true;

        if (quoteShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || quoteShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'quoteShareServerCategory/add', quoteShareServerCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            quoteShareServerCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                quoteShareServerCategory.ListItems.unshift(response.Item);
                quoteShareServerCategory.gridOptions.fillData(quoteShareServerCategory.ListItems);
                quoteShareServerCategory.closeModal();
            
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            quoteShareServerCategory.addRequested = false;
            quoteShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    quoteShareServerCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        quoteShareServerCategory.categoryBusyIndicator.isActive = true;
        quoteShareServerCategory.addRequested = true;
    
        if (quoteShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || quoteShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'quoteShareServerCategory/edit', quoteShareServerCategory.selectedItem, 'PUT').success(function (response) {
            quoteShareServerCategory.categoryBusyIndicator.isActive = false;
            quoteShareServerCategory.addRequested = false;
            quoteShareServerCategory.treeConfig.showbusy = false;
            quoteShareServerCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                quoteShareServerCategory.replaceItem(quoteShareServerCategory.selectedItem.Id, response.Item);
                quoteShareServerCategory.gridOptions.fillData(quoteShareServerCategory.ListItems);
                quoteShareServerCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            quoteShareServerCategory.addRequested = false;
            quoteShareServerCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a quote Content 
    quoteShareServerCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!quoteShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        quoteShareServerCategory.treeConfig.showbusy = true;
        quoteShareServerCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                quoteShareServerCategory.categoryBusyIndicator.isActive = true;
                console.log(quoteShareServerCategory.gridOptions.selectedRow.item);
                quoteShareServerCategory.showbusy = true;
                quoteShareServerCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"quoteShareServerCategory/GetOne", quoteShareServerCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    quoteShareServerCategory.showbusy = false;
                    quoteShareServerCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    quoteShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(quoteShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"quoteShareServerCategory/delete", quoteShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        quoteShareServerCategory.categoryBusyIndicator.isActive = false;
                        quoteShareServerCategory.treeConfig.showbusy = false;
                        quoteShareServerCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            quoteShareServerCategory.replaceItem(quoteShareServerCategory.selectedItemForDelete.Id);
                            quoteShareServerCategory.gridOptions.fillData(quoteShareServerCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        quoteShareServerCategory.treeConfig.showbusy = false;
                        quoteShareServerCategory.showIsBusy = false;
                        quoteShareServerCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    quoteShareServerCategory.treeConfig.showbusy = false;
                    quoteShareServerCategory.showIsBusy = false;
                    quoteShareServerCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }

    

   

    ////Replace Item OnDelete/OnEdit Grid Options
    quoteShareServerCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(quoteShareServerCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = quoteShareServerCategory.ListItems.indexOf(item);
                quoteShareServerCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            quoteShareServerCategory.ListItems.unshift(newItem);
    }

   
    quoteShareServerCategory.searchData = function () {
        quoteShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"quoteShareServerCategory/getall", quoteShareServerCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            quoteShareServerCategory.categoryBusyIndicator.isActive = false;
            quoteShareServerCategory.ListItems = response.ListItems;
            quoteShareServerCategory.gridOptions.fillData(quoteShareServerCategory.ListItems);
            quoteShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            quoteShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            quoteShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
            quoteShareServerCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            quoteShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    quoteShareServerCategory.addRequested = false;
    quoteShareServerCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    quoteShareServerCategory.showIsBusy = false;

   

    //For reInit Categories
    quoteShareServerCategory.gridOptions.reGetAll = function () {
        if (quoteShareServerCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) quoteShareServerCategory.searchData();
        else quoteShareServerCategory.init();
    };

    quoteShareServerCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, quoteShareServerCategory.treeConfig.currentNode);
    }

    quoteShareServerCategory.loadFileAndFolder = function (item) {
        quoteShareServerCategory.treeConfig.currentNode = item;
        console.log(item);
        quoteShareServerCategory.treeConfig.onNodeSelect(item);
    }

    quoteShareServerCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            quoteShareServerCategory.focus = true;
        });
    };
    quoteShareServerCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            quoteShareServerCategory.focus1 = true;
        });
    };

     quoteShareServerCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

  
   // End of Upload Modal-----------------------------------------
     quoteShareServerCategory.columnCheckbox = false;
     quoteShareServerCategory.openGridConfigModal = function () {
         $("#gridView-btn").toggleClass("active");
         var prechangeColumns = quoteShareServerCategory.gridOptions.columns;
         if (quoteShareServerCategory.gridOptions.columnCheckbox) {
             for (var i = 0; i < quoteShareServerCategory.gridOptions.columns.length; i++) {
                 //quoteShareServerCategory.gridOptions.columns[i].visible = $("#" + quoteShareServerCategory.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                 var element = $("#" + quoteShareServerCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                 var temp = element[0].checked;
                 quoteShareServerCategory.gridOptions.columns[i].visible = temp;
             }
         }
         else {

             for (var i = 0; i < quoteShareServerCategory.gridOptions.columns.length; i++) {
                 var element = $("#" + quoteShareServerCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                 $("#" + quoteShareServerCategory.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
             }
         }
         for (var i = 0; i < quoteShareServerCategory.gridOptions.columns.length; i++) {
             console.log(quoteShareServerCategory.gridOptions.columns[i].name.concat(".visible: "), quoteShareServerCategory.gridOptions.columns[i].visible);
         }
         quoteShareServerCategory.gridOptions.columnCheckbox = !quoteShareServerCategory.gridOptions.columnCheckbox;
     }
    //Export Report 
    quoteShareServerCategory.exportFile = function () {
        quoteShareServerCategory.addRequested = true;
        quoteShareServerCategory.gridOptions.advancedSearchData.engine.ExportFile = quoteShareServerCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'quoteShareServerCategory/exportfile', quoteShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            quoteShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                quoteShareServerCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //quoteShareServerCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    quoteShareServerCategory.toggleExportForm = function () {
        quoteShareServerCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        quoteShareServerCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        quoteShareServerCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        quoteShareServerCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        quoteShareServerCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleQuote/quoteShareServerCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    quoteShareServerCategory.rowCountChanged = function () {
        if (!angular.isDefined(quoteShareServerCategory.ExportFileClass.RowCount) || quoteShareServerCategory.ExportFileClass.RowCount > 5000)
            quoteShareServerCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    quoteShareServerCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"quoteShareServerCategory/count", quoteShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            quoteShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            quoteShareServerCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            quoteShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    quoteShareServerCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            quoteShareServerCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    quoteShareServerCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (quoteShareServerCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    quoteShareServerCategory.onNodeToggle = function (node, expanded) {
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

    quoteShareServerCategory.onSelection = function (node, selected) {
        if (!selected) {
            quoteShareServerCategory.selectedItem.LinkMainImageId = null;
            quoteShareServerCategory.selectedItem.previewImageSrc = null;
            return;
        }
        quoteShareServerCategory.selectedItem.LinkMainImageId = node.Id;
        quoteShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            quoteShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
