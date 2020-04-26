app.controller("newsShareServerCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$rootScope', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $rootScope, $filter) {
    var newsShareServerCategory = this;
    //For Grid Options
    newsShareServerCategory.gridOptions = {};
    newsShareServerCategory.selectedItem = {};
    newsShareServerCategory.attachedFiles = [];
    newsShareServerCategory.attachedFile = "";
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    newsShareServerCategory.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "newsShareServerCategoryController") {
            localStorage.setItem('AddRequest', '');
            newsShareServerCategory.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) newsShareServerCategory.itemRecordStatus = itemRecordStatus;

    
    newsShareServerCategory.LinkShareMainAdminSettingIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkServerCategoryId',
        url: 'NewsCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: newsShareServerCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    //news Grid Options
                      
    newsShareServerCategory.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'ModuleCoreSite.Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
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
    newsShareServerCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show news Loading Indicator
    newsShareServerCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    newsShareServerCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    newsShareServerCategory.treeConfig.currentNode = {};
    newsShareServerCategory.treeBusyIndicator = false;

    newsShareServerCategory.addRequested = false;

    newsShareServerCategory.showGridComment = false;
    newsShareServerCategory.newsTitle = "";

    //init Function
    newsShareServerCategory.init = function () {
        newsShareServerCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = newsShareServerCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        newsShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"NewsShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            newsShareServerCategory.treeConfig.Items = response.ListItems;
            newsShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        newsShareServerCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"newsShareServerCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            newsShareServerCategory.ListItems = response.ListItems;
            newsShareServerCategory.gridOptions.fillData(newsShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            newsShareServerCategory.contentBusyIndicator.isActive = false;
            newsShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            newsShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            newsShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            newsShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            newsShareServerCategory.contentBusyIndicator.isActive = false;
            });
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        newsShareServerCategory.checkRequestAddNewItemFromOtherControl(null);
  
    };

    // Open Add Category Modal 
    newsShareServerCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        newsShareServerCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'NewsShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            newsShareServerCategory.selectedItem = response.Item;
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
                newsShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(newsShareServerCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleNews/NewsShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    newsShareServerCategory.addRequested = false;
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
    newsShareServerCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        newsShareServerCategory.addRequested = false;
        newsShareServerCategory.modalTitle = 'ویرایش';
        if (!newsShareServerCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        newsShareServerCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'NewsShareMainAdminSetting/GetOne', newsShareServerCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            newsShareServerCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            newsShareServerCategory.selectedItem = response.Item;
            //Set dataForTheTree
            newsShareServerCategory.selectedNode = [];
            newsShareServerCategory.expandedNodes = [];
            newsShareServerCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                newsShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(newsShareServerCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (newsShareServerCategory.selectedItem.LinkMainImageId > 0)
                        newsShareServerCategory.onSelection({ Id: newsShareServerCategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleNews/NewsShareMainAdminSetting/edit.html',
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
    newsShareServerCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        newsShareServerCategory.categoryBusyIndicator.isActive = true;
        newsShareServerCategory.addRequested = true;
        newsShareServerCategory.selectedItem.LinkParentId = null;
        if (newsShareServerCategory.treeConfig.currentNode != null)
            newsShareServerCategory.selectedItem.LinkParentId = newsShareServerCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'NewsShareMainAdminSetting/add', newsShareServerCategory.selectedItem, 'POST').success(function (response) {
            newsShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                newsShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                newsShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                newsShareServerCategory.gridOptions.reGetAll();
                newsShareServerCategory.closeModal();
            }
            newsShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsShareServerCategory.addRequested = false;
            newsShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    newsShareServerCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        newsShareServerCategory.categoryBusyIndicator.isActive = true;
        newsShareServerCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'NewsShareMainAdminSetting/edit', newsShareServerCategory.selectedItem, 'PUT').success(function (response) {
            //newsShareServerCategory.showbusy = false;
            newsShareServerCategory.treeConfig.showbusy = false;
            newsShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                newsShareServerCategory.treeConfig.currentNode.Title = response.Item.Title;
                newsShareServerCategory.closeModal();
            }
            newsShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsShareServerCategory.addRequested = false;
            newsShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    newsShareServerCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = newsShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                newsShareServerCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'NewsShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    newsShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(newsShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'NewsShareMainAdminSetting/delete', newsShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        newsShareServerCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //newsShareServerCategory.replaceCategoryItem(newsShareServerCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            newsShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            newsShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            newsShareServerCategory.gridOptions.fillData();
                            newsShareServerCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        newsShareServerCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    newsShareServerCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    newsShareServerCategory.treeConfig.onNodeSelect = function () {
        var node = newsShareServerCategory.treeConfig.currentNode;
        newsShareServerCategory.showGridComment = false;
        newsShareServerCategory.selectContent(node);

    };
    //Show Content with Category Id
    newsShareServerCategory.selectContent = function (node) {
        newsShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
        newsShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            newsShareServerCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            newsShareServerCategory.contentBusyIndicator.isActive = true;
            newsShareServerCategory.attachedFiles = null;
            newsShareServerCategory.attachedFiles = [];
            var s = {
                PropertyName: "LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            newsShareServerCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"newsShareServerCategory/getall", newsShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            newsShareServerCategory.contentBusyIndicator.isActive = false;
            newsShareServerCategory.ListItems = response.ListItems;
            newsShareServerCategory.gridOptions.fillData(newsShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            newsShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            newsShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            newsShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            newsShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    newsShareServerCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = newsShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        newsShareServerCategory.addRequested = false;
        newsShareServerCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'newsShareServerCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            newsShareServerCategory.selectedItem = response.Item;
            newsShareServerCategory.selectedItem.LinkShareMainAdminSettingId = node.Id;
            newsShareServerCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/Modulenews/newsShareServerCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    newsShareServerCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        newsShareServerCategory.addRequested = false;
        newsShareServerCategory.modalTitle = 'ویرایش';
        if (!newsShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'newsShareServerCategory/GetOne', newsShareServerCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            newsShareServerCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulenews/newsShareServerCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    newsShareServerCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        newsShareServerCategory.categoryBusyIndicator.isActive = true;
        newsShareServerCategory.addRequested = true;

        if (newsShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || newsShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'newsShareServerCategory/add', newsShareServerCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            newsShareServerCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                newsShareServerCategory.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                newsShareServerCategory.ListItems.unshift(response.Item);
                newsShareServerCategory.gridOptions.fillData(newsShareServerCategory.ListItems);
                newsShareServerCategory.closeModal();
            
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsShareServerCategory.addRequested = false;
            newsShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    newsShareServerCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        newsShareServerCategory.categoryBusyIndicator.isActive = true;
        newsShareServerCategory.addRequested = true;
    
        if (newsShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || newsShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'newsShareServerCategory/edit', newsShareServerCategory.selectedItem, 'PUT').success(function (response) {
            newsShareServerCategory.categoryBusyIndicator.isActive = false;
            newsShareServerCategory.addRequested = false;
            newsShareServerCategory.treeConfig.showbusy = false;
            newsShareServerCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                newsShareServerCategory.replaceItem(newsShareServerCategory.selectedItem.Id, response.Item);
                newsShareServerCategory.gridOptions.fillData(newsShareServerCategory.ListItems);
                newsShareServerCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsShareServerCategory.addRequested = false;
            newsShareServerCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a news Content 
    newsShareServerCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!newsShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        newsShareServerCategory.treeConfig.showbusy = true;
        newsShareServerCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                newsShareServerCategory.categoryBusyIndicator.isActive = true;
                console.log(newsShareServerCategory.gridOptions.selectedRow.item);
                newsShareServerCategory.showbusy = true;
                newsShareServerCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"newsShareServerCategory/GetOne", newsShareServerCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    newsShareServerCategory.showbusy = false;
                    newsShareServerCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    newsShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(newsShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"newsShareServerCategory/delete", newsShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        newsShareServerCategory.categoryBusyIndicator.isActive = false;
                        newsShareServerCategory.treeConfig.showbusy = false;
                        newsShareServerCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            newsShareServerCategory.replaceItem(newsShareServerCategory.selectedItemForDelete.Id);
                            newsShareServerCategory.gridOptions.fillData(newsShareServerCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        newsShareServerCategory.treeConfig.showbusy = false;
                        newsShareServerCategory.showIsBusy = false;
                        newsShareServerCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    newsShareServerCategory.treeConfig.showbusy = false;
                    newsShareServerCategory.showIsBusy = false;
                    newsShareServerCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }

    

   

    ////Replace Item OnDelete/OnEdit Grid Options
    newsShareServerCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(newsShareServerCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = newsShareServerCategory.ListItems.indexOf(item);
                newsShareServerCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            newsShareServerCategory.ListItems.unshift(newItem);
    }

   
    newsShareServerCategory.searchData = function () {
        newsShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"newsShareServerCategory/getall", newsShareServerCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            newsShareServerCategory.categoryBusyIndicator.isActive = false;
            newsShareServerCategory.ListItems = response.ListItems;
            newsShareServerCategory.gridOptions.fillData(newsShareServerCategory.ListItems);
            newsShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            newsShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            newsShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
            newsShareServerCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            newsShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    newsShareServerCategory.addRequested = false;
    newsShareServerCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    newsShareServerCategory.showIsBusy = false;

   

    //For reInit Categories
    newsShareServerCategory.gridOptions.reGetAll = function () {
        if (newsShareServerCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) newsShareServerCategory.searchData();
        else newsShareServerCategory.init();
    };

    newsShareServerCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, newsShareServerCategory.treeConfig.currentNode);
    }

    newsShareServerCategory.loadFileAndFolder = function (item) {
        newsShareServerCategory.treeConfig.currentNode = item;
        console.log(item);
        newsShareServerCategory.treeConfig.onNodeSelect(item);
    }

    newsShareServerCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            newsShareServerCategory.focus = true;
        });
    };
    newsShareServerCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            newsShareServerCategory.focus1 = true;
        });
    };

     newsShareServerCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

  
   // End of Upload Modal-----------------------------------------
     newsShareServerCategory.columnCheckbox = false;
     newsShareServerCategory.openGridConfigModal = function () {
         $("#gridView-btn").toggleClass("active");
         if (newsShareServerCategory.gridOptions.columnCheckbox) {
             for (var i = 0; i < newsShareServerCategory.gridOptions.columns.length; i++) {
                 //newsShareServerCategory.gridOptions.columns[i].visible = $("#" + newsShareServerCategory.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                 var element = $("#" + newsShareServerCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                 //var temp = element[0].checked;
                 newsShareServerCategory.gridOptions.columns[i].visible = element[0].checked;
             }
         }
         else {
             var prechangeColumns = newsShareServerCategory.gridOptions.columns;
             for (var i = 0; i < newsShareServerCategory.gridOptions.columns.length; i++) {
                 newsShareServerCategory.gridOptions.columns[i].visible = true;
                 var element = $("#" + newsShareServerCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                 $("#" + newsShareServerCategory.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
             }
         }
         for (var i = 0; i < newsShareServerCategory.gridOptions.columns.length; i++) {
             console.log(newsShareServerCategory.gridOptions.columns[i].name.concat(".visible: "), newsShareServerCategory.gridOptions.columns[i].visible);
         }
         newsShareServerCategory.gridOptions.columnCheckbox = !newsShareServerCategory.gridOptions.columnCheckbox;
     }
    //Export Report 
    newsShareServerCategory.exportFile = function () {
        newsShareServerCategory.addRequested = true;
        newsShareServerCategory.gridOptions.advancedSearchData.engine.ExportFile = newsShareServerCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'newsShareServerCategory/exportfile', newsShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            newsShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                newsShareServerCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //newsShareServerCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    newsShareServerCategory.toggleExportForm = function () {
        newsShareServerCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        newsShareServerCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        newsShareServerCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        newsShareServerCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        newsShareServerCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleNews/newsShareServerCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    newsShareServerCategory.rowCountChanged = function () {
        if (!angular.isDefined(newsShareServerCategory.ExportFileClass.RowCount) || newsShareServerCategory.ExportFileClass.RowCount > 5000)
            newsShareServerCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    newsShareServerCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"newsShareServerCategory/count", newsShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            newsShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            newsShareServerCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            newsShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    newsShareServerCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            newsShareServerCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    newsShareServerCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (newsShareServerCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    newsShareServerCategory.onNodeToggle = function (node, expanded) {
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

    newsShareServerCategory.onSelection = function (node, selected) {
        if (!selected) {
            newsShareServerCategory.selectedItem.LinkMainImageId = null;
            newsShareServerCategory.selectedItem.previewImageSrc = null;
            return;
        }
        newsShareServerCategory.selectedItem.LinkMainImageId = node.Id;
        newsShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            newsShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
