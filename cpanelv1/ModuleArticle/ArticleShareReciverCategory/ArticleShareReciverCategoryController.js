app.controller("articleShareReciverCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var articleShareReciverCategory = this;
    //For Grid Options
    articleShareReciverCategory.gridOptions = {};
    articleShareReciverCategory.selectedItem = {};
    articleShareReciverCategory.attachedFiles = [];
    articleShareReciverCategory.attachedFile = "";
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    articleShareReciverCategory.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "articleShareReciverCategoryController") {
            localStorage.setItem('AddRequest', '');
            articleShareReciverCategory.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    var todayDate = moment().format();

    articleShareReciverCategory.ToDate = {
        defaultDate: todayDate
    }
    articleShareReciverCategory.FromDate = {
        defaultDate: todayDate
    }
    articleShareReciverCategory.testDate = moment().format();
    if (itemRecordStatus != undefined) articleShareReciverCategory.itemRecordStatus = itemRecordStatus;


    articleShareReciverCategory.LinkShareReciverCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareReciverCategoryId',
        url: 'ArticleCategory',
        sortColumn: 'Id',
        sortType: 0,
        showAddDialog: false,
        filterText: 'Title',
        rowPerPage: 200,
        scope: articleShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    //article Grid Options
    articleShareReciverCategory.LinkShareServerCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareServerCategoryId',
        url: 'ArticleShareServerCategory',
        Action:'GetAllOtherSite',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: articleShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    articleShareReciverCategory.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'virtual_ShareServerCategory.Title', displayName: ' عنوان اشتراک', sortable: true, type: 'string'},
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
    articleShareReciverCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show article Loading Indicator
    articleShareReciverCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    articleShareReciverCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    articleShareReciverCategory.treeConfig.currentNode = {};
    articleShareReciverCategory.treeBusyIndicator = false;

    articleShareReciverCategory.addRequested = false;

    articleShareReciverCategory.showGridComment = false;
    articleShareReciverCategory.articleTitle = "";

    //init Function
    articleShareReciverCategory.init = function () {
        articleShareReciverCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = articleShareReciverCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        articleShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ArticleShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            articleShareReciverCategory.treeConfig.Items = response.ListItems;
            articleShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        articleShareReciverCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"articleShareReciverCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            articleShareReciverCategory.ListItems = response.ListItems;
            articleShareReciverCategory.gridOptions.fillData(articleShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            articleShareReciverCategory.contentBusyIndicator.isActive = false;
            articleShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            articleShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            articleShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            articleShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            articleShareReciverCategory.contentBusyIndicator.isActive = false;
        });
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        articleShareReciverCategory.checkRequestAddNewItemFromOtherControl(null);
    };

    // Open Add Category Modal 
    articleShareReciverCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        articleShareReciverCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ArticleShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            articleShareReciverCategory.selectedItem = response.Item;
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
                articleShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(articleShareReciverCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleArticle/ArticleShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    articleShareReciverCategory.addRequested = false;
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
    articleShareReciverCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        articleShareReciverCategory.addRequested = false;
        articleShareReciverCategory.modalTitle = 'ویرایش';
        if (!articleShareReciverCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        articleShareReciverCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ArticleShareMainAdminSetting/GetOne', articleShareReciverCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            articleShareReciverCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            articleShareReciverCategory.selectedItem = response.Item;
            //Set dataForTheTree
            articleShareReciverCategory.selectedNode = [];
            articleShareReciverCategory.expandedNodes = [];
            articleShareReciverCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                articleShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(articleShareReciverCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (articleShareReciverCategory.selectedItem.LinkMainImageId > 0)
                        articleShareReciverCategory.onSelection({ Id: articleShareReciverCategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleArticle/ArticleShareMainAdminSetting/edit.html',
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
    articleShareReciverCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        articleShareReciverCategory.categoryBusyIndicator.isActive = true;
        articleShareReciverCategory.addRequested = true;
        articleShareReciverCategory.selectedItem.LinkParentId = null;
        if (articleShareReciverCategory.treeConfig.currentNode != null)
            articleShareReciverCategory.selectedItem.LinkParentId = articleShareReciverCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'ArticleShareMainAdminSetting/add', articleShareReciverCategory.selectedItem, 'POST').success(function (response) {
            articleShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                articleShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                articleShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                articleShareReciverCategory.gridOptions.reGetAll();
                articleShareReciverCategory.closeModal();
            }
            articleShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleShareReciverCategory.addRequested = false;
            articleShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    articleShareReciverCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        articleShareReciverCategory.categoryBusyIndicator.isActive = true;
        articleShareReciverCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ArticleShareMainAdminSetting/edit', articleShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            //articleShareReciverCategory.showbusy = false;
            articleShareReciverCategory.treeConfig.showbusy = false;
            articleShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                articleShareReciverCategory.treeConfig.currentNode.Title = response.Item.Title;
                articleShareReciverCategory.closeModal();
            }
            articleShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleShareReciverCategory.addRequested = false;
            articleShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    articleShareReciverCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = articleShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                articleShareReciverCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'ArticleShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    articleShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(articleShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ArticleShareMainAdminSetting/delete', articleShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        articleShareReciverCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //articleShareReciverCategory.replaceCategoryItem(articleShareReciverCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            articleShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            articleShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            articleShareReciverCategory.gridOptions.fillData();
                            articleShareReciverCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        articleShareReciverCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    articleShareReciverCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    articleShareReciverCategory.treeConfig.onNodeSelect = function () {
        var node = articleShareReciverCategory.treeConfig.currentNode;
        articleShareReciverCategory.showGridComment = false;
        articleShareReciverCategory.selectContent(node);

    };
    //Show Content with Category Id
    articleShareReciverCategory.selectContent = function (node) {
        articleShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
        articleShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            articleShareReciverCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            articleShareReciverCategory.contentBusyIndicator.isActive = true;
            articleShareReciverCategory.attachedFiles = null;
            articleShareReciverCategory.attachedFiles = [];
            var s = {
                PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            articleShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"articleShareReciverCategory/getall", articleShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            articleShareReciverCategory.contentBusyIndicator.isActive = false;
            articleShareReciverCategory.ListItems = response.ListItems;
            articleShareReciverCategory.gridOptions.fillData(articleShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            articleShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            articleShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            articleShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            articleShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    articleShareReciverCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = articleShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_The_Article_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        articleShareReciverCategory.addRequested = false;
        articleShareReciverCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'articleShareReciverCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            articleShareReciverCategory.selectedItem = response.Item;
            articleShareReciverCategory.selectedItem.LinkShareServerCategoryId = node.Id;
            articleShareReciverCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/Modulearticle/articleShareReciverCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    articleShareReciverCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        articleShareReciverCategory.addRequested = false;
        articleShareReciverCategory.modalTitle = 'ویرایش';
        if (!articleShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'articleShareReciverCategory/GetOne', articleShareReciverCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            articleShareReciverCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulearticle/articleShareReciverCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    articleShareReciverCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        articleShareReciverCategory.categoryBusyIndicator.isActive = true;
        articleShareReciverCategory.addRequested = true;

        if (articleShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || articleShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_The_Article_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'articleShareReciverCategory/add', articleShareReciverCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            articleShareReciverCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                articleShareReciverCategory.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                articleShareReciverCategory.ListItems.unshift(response.Item);
                articleShareReciverCategory.gridOptions.fillData(articleShareReciverCategory.ListItems);
                articleShareReciverCategory.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleShareReciverCategory.addRequested = false;
            articleShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    articleShareReciverCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        articleShareReciverCategory.categoryBusyIndicator.isActive = true;
        articleShareReciverCategory.addRequested = true;

        if (articleShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || articleShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_The_Article_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'articleShareReciverCategory/edit', articleShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            articleShareReciverCategory.categoryBusyIndicator.isActive = false;
            articleShareReciverCategory.addRequested = false;
            articleShareReciverCategory.treeConfig.showbusy = false;
            articleShareReciverCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                articleShareReciverCategory.replaceItem(articleShareReciverCategory.selectedItem.Id, response.Item);
                articleShareReciverCategory.gridOptions.fillData(articleShareReciverCategory.ListItems);
                articleShareReciverCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleShareReciverCategory.addRequested = false;
            articleShareReciverCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a article Content 
    articleShareReciverCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!articleShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        articleShareReciverCategory.treeConfig.showbusy = true;
        articleShareReciverCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                articleShareReciverCategory.categoryBusyIndicator.isActive = true;
                console.log(articleShareReciverCategory.gridOptions.selectedRow.item);
                articleShareReciverCategory.showbusy = true;
                articleShareReciverCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"articleShareReciverCategory/GetOne", articleShareReciverCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    articleShareReciverCategory.showbusy = false;
                    articleShareReciverCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    articleShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(articleShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"articleShareReciverCategory/delete", articleShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        articleShareReciverCategory.categoryBusyIndicator.isActive = false;
                        articleShareReciverCategory.treeConfig.showbusy = false;
                        articleShareReciverCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            articleShareReciverCategory.replaceItem(articleShareReciverCategory.selectedItemForDelete.Id);
                            articleShareReciverCategory.gridOptions.fillData(articleShareReciverCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        articleShareReciverCategory.treeConfig.showbusy = false;
                        articleShareReciverCategory.showIsBusy = false;
                        articleShareReciverCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    articleShareReciverCategory.treeConfig.showbusy = false;
                    articleShareReciverCategory.showIsBusy = false;
                    articleShareReciverCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }





    ////Replace Item OnDelete/OnEdit Grid Options
    articleShareReciverCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(articleShareReciverCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = articleShareReciverCategory.ListItems.indexOf(item);
                articleShareReciverCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            articleShareReciverCategory.ListItems.unshift(newItem);
    }


    articleShareReciverCategory.searchData = function () {
        articleShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"articleShareReciverCategory/getall", articleShareReciverCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            articleShareReciverCategory.categoryBusyIndicator.isActive = false;
            articleShareReciverCategory.ListItems = response.ListItems;
            articleShareReciverCategory.gridOptions.fillData(articleShareReciverCategory.ListItems);
            articleShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            articleShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            articleShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
            articleShareReciverCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            articleShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    articleShareReciverCategory.addRequested = false;
    articleShareReciverCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    articleShareReciverCategory.showIsBusy = false;



    //For reInit Categories
    articleShareReciverCategory.gridOptions.reGetAll = function () {
        if (articleShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) articleShareReciverCategory.searchData();
        else articleShareReciverCategory.init();
    };

    articleShareReciverCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, articleShareReciverCategory.treeConfig.currentNode);
    }

    articleShareReciverCategory.loadFileAndFolder = function (item) {
        articleShareReciverCategory.treeConfig.currentNode = item;
        console.log(item);
        articleShareReciverCategory.treeConfig.onNodeSelect(item);
    }

    articleShareReciverCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            articleShareReciverCategory.focus = true;
        });
    };
    articleShareReciverCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            articleShareReciverCategory.focus1 = true;
        });
    };

    articleShareReciverCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }


    // End of Upload Modal-----------------------------------------
    articleShareReciverCategory.columnCheckbox = false;
    articleShareReciverCategory.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (articleShareReciverCategory.gridOptions.columnCheckbox) {
            for (var i = 0; i < articleShareReciverCategory.gridOptions.columns.length; i++) {
                //articleShareReciverCategory.gridOptions.columns[i].visible = $("#" + articleShareReciverCategory.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + articleShareReciverCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                articleShareReciverCategory.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = articleShareReciverCategory.gridOptions.columns;
            for (var i = 0; i < articleShareReciverCategory.gridOptions.columns.length; i++) {
                articleShareReciverCategory.gridOptions.columns[i].visible = true;
                var element = $("#" + articleShareReciverCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + articleShareReciverCategory.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < articleShareReciverCategory.gridOptions.columns.length; i++) {
            console.log(articleShareReciverCategory.gridOptions.columns[i].name.concat(".visible: "), articleShareReciverCategory.gridOptions.columns[i].visible);
        }
        articleShareReciverCategory.gridOptions.columnCheckbox = !articleShareReciverCategory.gridOptions.columnCheckbox;
    }
    //Export Report 
    articleShareReciverCategory.exportFile = function () {
        articleShareReciverCategory.addRequested = true;
        articleShareReciverCategory.gridOptions.advancedSearchData.engine.ExportFile = articleShareReciverCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'articleShareReciverCategory/exportfile', articleShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            articleShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                articleShareReciverCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //articleShareReciverCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    articleShareReciverCategory.toggleExportForm = function () {
        articleShareReciverCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        articleShareReciverCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        articleShareReciverCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        articleShareReciverCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        articleShareReciverCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleNews/articleShareReciverCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    articleShareReciverCategory.rowCountChanged = function () {
        if (!angular.isDefined(articleShareReciverCategory.ExportFileClass.RowCount) || articleShareReciverCategory.ExportFileClass.RowCount > 5000)
            articleShareReciverCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    articleShareReciverCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"articleShareReciverCategory/count", articleShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            articleShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            articleShareReciverCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            articleShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    articleShareReciverCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            articleShareReciverCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    articleShareReciverCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (articleShareReciverCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    articleShareReciverCategory.onNodeToggle = function (node, expanded) {
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

    articleShareReciverCategory.onSelection = function (node, selected) {
        if (!selected) {
            articleShareReciverCategory.selectedItem.LinkMainImageId = null;
            articleShareReciverCategory.selectedItem.previewImageSrc = null;
            return;
        }
        articleShareReciverCategory.selectedItem.LinkMainImageId = node.Id;
        articleShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            articleShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
