app.controller("newsShareReciverCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$rootScope', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $rootScope, $filter) {
    var newsShareReciverCategory = this;
    //For Grid Options
    newsShareReciverCategory.gridOptions = {};
    newsShareReciverCategory.selectedItem = {};
    newsShareReciverCategory.attachedFiles = [];
    newsShareReciverCategory.attachedFile = "";
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    newsShareReciverCategory.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "newsShareReciverCategoryController") {
            localStorage.setItem('AddRequest', '');
            newsShareReciverCategory.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    var todayDate = moment().format();

    newsShareReciverCategory.ToDate = {
        defaultDate: todayDate
    }
    newsShareReciverCategory.FromDate = {
        defaultDate: todayDate
    }
    newsShareReciverCategory.testDate = moment().format();
    if (itemRecordStatus != undefined) newsShareReciverCategory.itemRecordStatus = itemRecordStatus;


    newsShareReciverCategory.LinkShareReciverCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareReciverCategoryId',
        url: 'NewsCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: newsShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    //news Grid Options
    newsShareReciverCategory.LinkShareServerCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareServerCategoryId',
        url: 'NewsShareServerCategory',
        Action:'GetAllOtherSite',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: newsShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer'},
                { name: 'ModuleCoreSite.Title', displayName: 'عنوان سایت', sortable: true, type: 'string'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    newsShareReciverCategory.gridOptions = {
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
    newsShareReciverCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show news Loading Indicator
    newsShareReciverCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    newsShareReciverCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    newsShareReciverCategory.treeConfig.currentNode = {};
    newsShareReciverCategory.treeBusyIndicator = false;

    newsShareReciverCategory.addRequested = false;

    newsShareReciverCategory.showGridComment = false;
    newsShareReciverCategory.newsTitle = "";

    //init Function
    newsShareReciverCategory.init = function () {
        newsShareReciverCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = newsShareReciverCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        newsShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"NewsShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            newsShareReciverCategory.treeConfig.Items = response.ListItems;
            newsShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        newsShareReciverCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"newsShareReciverCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            newsShareReciverCategory.ListItems = response.ListItems;
            newsShareReciverCategory.gridOptions.fillData(newsShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            newsShareReciverCategory.contentBusyIndicator.isActive = false;
            newsShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            newsShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            newsShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            newsShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            newsShareReciverCategory.contentBusyIndicator.isActive = false;
            });
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        newsShareReciverCategory.checkRequestAddNewItemFromOtherControl(null);

    };

    // Open Add Category Modal 
    newsShareReciverCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        newsShareReciverCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'NewsShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            newsShareReciverCategory.selectedItem = response.Item;
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
                newsShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(newsShareReciverCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleNews/NewsShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    newsShareReciverCategory.addRequested = false;
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
    newsShareReciverCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        newsShareReciverCategory.addRequested = false;
        newsShareReciverCategory.modalTitle = 'ویرایش';
        if (!newsShareReciverCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        newsShareReciverCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'NewsShareMainAdminSetting/GetOne', newsShareReciverCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            newsShareReciverCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            newsShareReciverCategory.selectedItem = response.Item;
            //Set dataForTheTree
            newsShareReciverCategory.selectedNode = [];
            newsShareReciverCategory.expandedNodes = [];
            newsShareReciverCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                newsShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(newsShareReciverCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (newsShareReciverCategory.selectedItem.LinkMainImageId > 0)
                        newsShareReciverCategory.onSelection({ Id: newsShareReciverCategory.selectedItem.LinkMainImageId }, true);
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
    newsShareReciverCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        newsShareReciverCategory.categoryBusyIndicator.isActive = true;
        newsShareReciverCategory.addRequested = true;
        newsShareReciverCategory.selectedItem.LinkParentId = null;
        if (newsShareReciverCategory.treeConfig.currentNode != null)
            newsShareReciverCategory.selectedItem.LinkParentId = newsShareReciverCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'NewsShareMainAdminSetting/add', newsShareReciverCategory.selectedItem, 'POST').success(function (response) {
            newsShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                newsShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                newsShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                newsShareReciverCategory.gridOptions.reGetAll();
                newsShareReciverCategory.closeModal();
            }
            newsShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsShareReciverCategory.addRequested = false;
            newsShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    newsShareReciverCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        newsShareReciverCategory.categoryBusyIndicator.isActive = true;
        newsShareReciverCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'NewsShareMainAdminSetting/edit', newsShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            //newsShareReciverCategory.showbusy = false;
            newsShareReciverCategory.treeConfig.showbusy = false;
            newsShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                newsShareReciverCategory.treeConfig.currentNode.Title = response.Item.Title;
                newsShareReciverCategory.closeModal();
            }
            newsShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsShareReciverCategory.addRequested = false;
            newsShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    newsShareReciverCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = newsShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                newsShareReciverCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'NewsShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    newsShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(newsShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'NewsShareMainAdminSetting/delete', newsShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        newsShareReciverCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //newsShareReciverCategory.replaceCategoryItem(newsShareReciverCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            newsShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            newsShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            newsShareReciverCategory.gridOptions.fillData();
                            newsShareReciverCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        newsShareReciverCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    newsShareReciverCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    newsShareReciverCategory.treeConfig.onNodeSelect = function () {
        var node = newsShareReciverCategory.treeConfig.currentNode;
        newsShareReciverCategory.showGridComment = false;
        newsShareReciverCategory.selectContent(node);

    };
    //Show Content with Category Id
    newsShareReciverCategory.selectContent = function (node) {
        newsShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
        newsShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            newsShareReciverCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            newsShareReciverCategory.contentBusyIndicator.isActive = true;
            newsShareReciverCategory.attachedFiles = null;
            newsShareReciverCategory.attachedFiles = [];
            var s = {
                PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            newsShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"newsShareReciverCategory/getall", newsShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            newsShareReciverCategory.contentBusyIndicator.isActive = false;
            newsShareReciverCategory.ListItems = response.ListItems;
            newsShareReciverCategory.gridOptions.fillData(newsShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            newsShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            newsShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            newsShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            newsShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    newsShareReciverCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = newsShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        newsShareReciverCategory.addRequested = false;
        newsShareReciverCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'newsShareReciverCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            newsShareReciverCategory.selectedItem = response.Item;
            newsShareReciverCategory.selectedItem.LinkShareServerCategoryId = node.Id;
            newsShareReciverCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/Modulenews/newsShareReciverCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    newsShareReciverCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        newsShareReciverCategory.addRequested = false;
        newsShareReciverCategory.modalTitle = 'ویرایش';
        if (!newsShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'newsShareReciverCategory/GetOne', newsShareReciverCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            newsShareReciverCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulenews/newsShareReciverCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    newsShareReciverCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        newsShareReciverCategory.categoryBusyIndicator.isActive = true;
        newsShareReciverCategory.addRequested = true;

        if (newsShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || newsShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'newsShareReciverCategory/add', newsShareReciverCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            newsShareReciverCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                newsShareReciverCategory.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                newsShareReciverCategory.ListItems.unshift(response.Item);
                newsShareReciverCategory.gridOptions.fillData(newsShareReciverCategory.ListItems);
                newsShareReciverCategory.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsShareReciverCategory.addRequested = false;
            newsShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    newsShareReciverCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        newsShareReciverCategory.categoryBusyIndicator.isActive = true;
        newsShareReciverCategory.addRequested = true;

        if (newsShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || newsShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'newsShareReciverCategory/edit', newsShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            newsShareReciverCategory.categoryBusyIndicator.isActive = false;
            newsShareReciverCategory.addRequested = false;
            newsShareReciverCategory.treeConfig.showbusy = false;
            newsShareReciverCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                newsShareReciverCategory.replaceItem(newsShareReciverCategory.selectedItem.Id, response.Item);
                newsShareReciverCategory.gridOptions.fillData(newsShareReciverCategory.ListItems);
                newsShareReciverCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsShareReciverCategory.addRequested = false;
            newsShareReciverCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a news Content 
    newsShareReciverCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!newsShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        newsShareReciverCategory.treeConfig.showbusy = true;
        newsShareReciverCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                newsShareReciverCategory.categoryBusyIndicator.isActive = true;
                console.log(newsShareReciverCategory.gridOptions.selectedRow.item);
                newsShareReciverCategory.showbusy = true;
                newsShareReciverCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"newsShareReciverCategory/GetOne", newsShareReciverCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    newsShareReciverCategory.showbusy = false;
                    newsShareReciverCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    newsShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(newsShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"newsShareReciverCategory/delete", newsShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        newsShareReciverCategory.categoryBusyIndicator.isActive = false;
                        newsShareReciverCategory.treeConfig.showbusy = false;
                        newsShareReciverCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            newsShareReciverCategory.replaceItem(newsShareReciverCategory.selectedItemForDelete.Id);
                            newsShareReciverCategory.gridOptions.fillData(newsShareReciverCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        newsShareReciverCategory.treeConfig.showbusy = false;
                        newsShareReciverCategory.showIsBusy = false;
                        newsShareReciverCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    newsShareReciverCategory.treeConfig.showbusy = false;
                    newsShareReciverCategory.showIsBusy = false;
                    newsShareReciverCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }





    ////Replace Item OnDelete/OnEdit Grid Options
    newsShareReciverCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(newsShareReciverCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = newsShareReciverCategory.ListItems.indexOf(item);
                newsShareReciverCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            newsShareReciverCategory.ListItems.unshift(newItem);
    }


    newsShareReciverCategory.searchData = function () {
        newsShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"newsShareReciverCategory/getall", newsShareReciverCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            newsShareReciverCategory.categoryBusyIndicator.isActive = false;
            newsShareReciverCategory.ListItems = response.ListItems;
            newsShareReciverCategory.gridOptions.fillData(newsShareReciverCategory.ListItems);
            newsShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            newsShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            newsShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
            newsShareReciverCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            newsShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    newsShareReciverCategory.addRequested = false;
    newsShareReciverCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    newsShareReciverCategory.showIsBusy = false;



    //For reInit Categories
    newsShareReciverCategory.gridOptions.reGetAll = function () {
        if (newsShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) newsShareReciverCategory.searchData();
        else newsShareReciverCategory.init();
    };

    newsShareReciverCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, newsShareReciverCategory.treeConfig.currentNode);
    }

    newsShareReciverCategory.loadFileAndFolder = function (item) {
        newsShareReciverCategory.treeConfig.currentNode = item;
        console.log(item);
        newsShareReciverCategory.treeConfig.onNodeSelect(item);
    }

    newsShareReciverCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            newsShareReciverCategory.focus = true;
        });
    };
    newsShareReciverCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            newsShareReciverCategory.focus1 = true;
        });
    };

    newsShareReciverCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }


    // End of Upload Modal-----------------------------------------
    newsShareReciverCategory.columnCheckbox = false;
    newsShareReciverCategory.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (newsShareReciverCategory.gridOptions.columnCheckbox) {
            for (var i = 0; i < newsShareReciverCategory.gridOptions.columns.length; i++) {
                //newsShareReciverCategory.gridOptions.columns[i].visible = $("#" + newsShareReciverCategory.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + newsShareReciverCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                newsShareReciverCategory.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = newsShareReciverCategory.gridOptions.columns;
            for (var i = 0; i < newsShareReciverCategory.gridOptions.columns.length; i++) {
                newsShareReciverCategory.gridOptions.columns[i].visible = true;
                var element = $("#" + newsShareReciverCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + newsShareReciverCategory.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < newsShareReciverCategory.gridOptions.columns.length; i++) {
            console.log(newsShareReciverCategory.gridOptions.columns[i].name.concat(".visible: "), newsShareReciverCategory.gridOptions.columns[i].visible);
        }
        newsShareReciverCategory.gridOptions.columnCheckbox = !newsShareReciverCategory.gridOptions.columnCheckbox;
    }
    //Export Report 
    newsShareReciverCategory.exportFile = function () {
        newsShareReciverCategory.addRequested = true;
        newsShareReciverCategory.gridOptions.advancedSearchData.engine.ExportFile = newsShareReciverCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'newsShareReciverCategory/exportfile', newsShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            newsShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                newsShareReciverCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //newsShareReciverCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    newsShareReciverCategory.toggleExportForm = function () {
        newsShareReciverCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        newsShareReciverCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        newsShareReciverCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        newsShareReciverCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        newsShareReciverCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleNews/newsShareReciverCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    newsShareReciverCategory.rowCountChanged = function () {
        if (!angular.isDefined(newsShareReciverCategory.ExportFileClass.RowCount) || newsShareReciverCategory.ExportFileClass.RowCount > 5000)
            newsShareReciverCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    newsShareReciverCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"newsShareReciverCategory/count", newsShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            newsShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            newsShareReciverCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            newsShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    newsShareReciverCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            newsShareReciverCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    newsShareReciverCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (newsShareReciverCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    newsShareReciverCategory.onNodeToggle = function (node, expanded) {
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

    newsShareReciverCategory.onSelection = function (node, selected) {
        if (!selected) {
            newsShareReciverCategory.selectedItem.LinkMainImageId = null;
            newsShareReciverCategory.selectedItem.previewImageSrc = null;
            return;
        }
        newsShareReciverCategory.selectedItem.LinkMainImageId = node.Id;
        newsShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            newsShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
