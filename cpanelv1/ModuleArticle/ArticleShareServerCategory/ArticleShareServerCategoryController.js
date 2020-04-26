app.controller("articleShareServerCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var articleShareServerCategory = this;
    //For Grid Options
    articleShareServerCategory.gridOptions = {};
    articleShareServerCategory.selectedItem = {};
    articleShareServerCategory.attachedFiles = [];
    articleShareServerCategory.attachedFile = "";
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    articleShareServerCategory.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "articleShareServerCategoryController") {
            localStorage.setItem('AddRequest', '');
            articleShareServerCategory.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) articleShareServerCategory.itemRecordStatus = itemRecordStatus;

    
    articleShareServerCategory.LinkShareMainAdminSettingIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkServerCategoryId',
        url: 'ArticleCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        showAddDialog:false,
        scope: articleShareServerCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    //article Grid Options
                      
    articleShareServerCategory.gridOptions = {
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
    articleShareServerCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show article Loading Indicator
    articleShareServerCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    articleShareServerCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    articleShareServerCategory.treeConfig.currentNode = {};
    articleShareServerCategory.treeBusyIndicator = false;

    articleShareServerCategory.addRequested = false;

    articleShareServerCategory.showGridComment = false;
    articleShareServerCategory.articleTitle = "";

    //init Function
    articleShareServerCategory.init = function () {
        articleShareServerCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = articleShareServerCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        articleShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ArticleShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            articleShareServerCategory.treeConfig.Items = response.ListItems;
            articleShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        articleShareServerCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"articleShareServerCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            articleShareServerCategory.ListItems = response.ListItems;
            articleShareServerCategory.gridOptions.fillData(articleShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            articleShareServerCategory.contentBusyIndicator.isActive = false;
            articleShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            articleShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            articleShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            articleShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            articleShareServerCategory.contentBusyIndicator.isActive = false;
            });
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        articleShareServerCategory.checkRequestAddNewItemFromOtherControl(null);
  
    };

    // Open Add Category Modal 
    articleShareServerCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        articleShareServerCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ArticleShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            articleShareServerCategory.selectedItem = response.Item;
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
                articleShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(articleShareServerCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleArticle/ArticleShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    articleShareServerCategory.addRequested = false;
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
    articleShareServerCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        articleShareServerCategory.addRequested = false;
        articleShareServerCategory.modalTitle = 'ویرایش';
        if (!articleShareServerCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        articleShareServerCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ArticleShareMainAdminSetting/GetOne', articleShareServerCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            articleShareServerCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            articleShareServerCategory.selectedItem = response.Item;
            //Set dataForTheTree
            articleShareServerCategory.selectedNode = [];
            articleShareServerCategory.expandedNodes = [];
            articleShareServerCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                articleShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(articleShareServerCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (articleShareServerCategory.selectedItem.LinkMainImageId > 0)
                        articleShareServerCategory.onSelection({ Id: articleShareServerCategory.selectedItem.LinkMainImageId }, true);
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
    articleShareServerCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        articleShareServerCategory.categoryBusyIndicator.isActive = true;
        articleShareServerCategory.addRequested = true;
        articleShareServerCategory.selectedItem.LinkParentId = null;
        if (articleShareServerCategory.treeConfig.currentNode != null)
            articleShareServerCategory.selectedItem.LinkParentId = articleShareServerCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'ArticleShareMainAdminSetting/add', articleShareServerCategory.selectedItem, 'POST').success(function (response) {
            articleShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                articleShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                articleShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                articleShareServerCategory.gridOptions.reGetAll();
                articleShareServerCategory.closeModal();
            }
            articleShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleShareServerCategory.addRequested = false;
            articleShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    articleShareServerCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        articleShareServerCategory.categoryBusyIndicator.isActive = true;
        articleShareServerCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ArticleShareMainAdminSetting/edit', articleShareServerCategory.selectedItem, 'PUT').success(function (response) {
            //articleShareServerCategory.showbusy = false;
            articleShareServerCategory.treeConfig.showbusy = false;
            articleShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                articleShareServerCategory.treeConfig.currentNode.Title = response.Item.Title;
                articleShareServerCategory.closeModal();
            }
            articleShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleShareServerCategory.addRequested = false;
            articleShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    articleShareServerCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = articleShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                articleShareServerCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'ArticleShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    articleShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(articleShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ArticleShareMainAdminSetting/delete', articleShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        articleShareServerCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //articleShareServerCategory.replaceCategoryItem(articleShareServerCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            articleShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            articleShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            articleShareServerCategory.gridOptions.fillData();
                            articleShareServerCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        articleShareServerCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    articleShareServerCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    articleShareServerCategory.treeConfig.onNodeSelect = function () {
        var node = articleShareServerCategory.treeConfig.currentNode;
        articleShareServerCategory.showGridComment = false;
        articleShareServerCategory.selectContent(node);

    };
    //Show Content with Category Id
    articleShareServerCategory.selectContent = function (node) {
        articleShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
        articleShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            articleShareServerCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            articleShareServerCategory.contentBusyIndicator.isActive = true;
            articleShareServerCategory.attachedFiles = null;
            articleShareServerCategory.attachedFiles = [];
            var s = {
                PropertyName: "LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            articleShareServerCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"articleShareServerCategory/getall", articleShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            articleShareServerCategory.contentBusyIndicator.isActive = false;
            articleShareServerCategory.ListItems = response.ListItems;
            articleShareServerCategory.gridOptions.fillData(articleShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            articleShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            articleShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            articleShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            articleShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    articleShareServerCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = articleShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_The_Article_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        articleShareServerCategory.addRequested = false;
        articleShareServerCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'articleShareServerCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            articleShareServerCategory.selectedItem = response.Item;
            articleShareServerCategory.selectedItem.LinkShareMainAdminSettingId = node.Id;
            articleShareServerCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/Modulearticle/articleShareServerCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    articleShareServerCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        articleShareServerCategory.addRequested = false;
        articleShareServerCategory.modalTitle = 'ویرایش';
        if (!articleShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'articleShareServerCategory/GetOne', articleShareServerCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            articleShareServerCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulearticle/articleShareServerCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    articleShareServerCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        articleShareServerCategory.categoryBusyIndicator.isActive = true;
        articleShareServerCategory.addRequested = true;

        if (articleShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || articleShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_The_Article_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'articleShareServerCategory/add', articleShareServerCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            articleShareServerCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                articleShareServerCategory.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                articleShareServerCategory.ListItems.unshift(response.Item);
                articleShareServerCategory.gridOptions.fillData(articleShareServerCategory.ListItems);
                articleShareServerCategory.closeModal();
            
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleShareServerCategory.addRequested = false;
            articleShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    articleShareServerCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        articleShareServerCategory.categoryBusyIndicator.isActive = true;
        articleShareServerCategory.addRequested = true;
    
        if (articleShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || articleShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_The_Article_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'articleShareServerCategory/edit', articleShareServerCategory.selectedItem, 'PUT').success(function (response) {
            articleShareServerCategory.categoryBusyIndicator.isActive = false;
            articleShareServerCategory.addRequested = false;
            articleShareServerCategory.treeConfig.showbusy = false;
            articleShareServerCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                articleShareServerCategory.replaceItem(articleShareServerCategory.selectedItem.Id, response.Item);
                articleShareServerCategory.gridOptions.fillData(articleShareServerCategory.ListItems);
                articleShareServerCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleShareServerCategory.addRequested = false;
            articleShareServerCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a article Content 
    articleShareServerCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!articleShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        articleShareServerCategory.treeConfig.showbusy = true;
        articleShareServerCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                articleShareServerCategory.categoryBusyIndicator.isActive = true;
                console.log(articleShareServerCategory.gridOptions.selectedRow.item);
                articleShareServerCategory.showbusy = true;
                articleShareServerCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"articleShareServerCategory/GetOne", articleShareServerCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    articleShareServerCategory.showbusy = false;
                    articleShareServerCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    articleShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(articleShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"articleShareServerCategory/delete", articleShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        articleShareServerCategory.categoryBusyIndicator.isActive = false;
                        articleShareServerCategory.treeConfig.showbusy = false;
                        articleShareServerCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            articleShareServerCategory.replaceItem(articleShareServerCategory.selectedItemForDelete.Id);
                            articleShareServerCategory.gridOptions.fillData(articleShareServerCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        articleShareServerCategory.treeConfig.showbusy = false;
                        articleShareServerCategory.showIsBusy = false;
                        articleShareServerCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    articleShareServerCategory.treeConfig.showbusy = false;
                    articleShareServerCategory.showIsBusy = false;
                    articleShareServerCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }

    

   

    ////Replace Item OnDelete/OnEdit Grid Options
    articleShareServerCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(articleShareServerCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = articleShareServerCategory.ListItems.indexOf(item);
                articleShareServerCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            articleShareServerCategory.ListItems.unshift(newItem);
    }

   
    articleShareServerCategory.searchData = function () {
        articleShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"articleShareServerCategory/getall", articleShareServerCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            articleShareServerCategory.categoryBusyIndicator.isActive = false;
            articleShareServerCategory.ListItems = response.ListItems;
            articleShareServerCategory.gridOptions.fillData(articleShareServerCategory.ListItems);
            articleShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            articleShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            articleShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
            articleShareServerCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            articleShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    articleShareServerCategory.addRequested = false;
    articleShareServerCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    articleShareServerCategory.showIsBusy = false;

   

    //For reInit Categories
    articleShareServerCategory.gridOptions.reGetAll = function () {
        if (articleShareServerCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) articleShareServerCategory.searchData();
        else articleShareServerCategory.init();
    };

    articleShareServerCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, articleShareServerCategory.treeConfig.currentNode);
    }

    articleShareServerCategory.loadFileAndFolder = function (item) {
        articleShareServerCategory.treeConfig.currentNode = item;
        console.log(item);
        articleShareServerCategory.treeConfig.onNodeSelect(item);
    }

    articleShareServerCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            articleShareServerCategory.focus = true;
        });
    };
    articleShareServerCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            articleShareServerCategory.focus1 = true;
        });
    };

     articleShareServerCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

  
   // End of Upload Modal-----------------------------------------
     articleShareServerCategory.columnCheckbox = false;
     articleShareServerCategory.openGridConfigModal = function () {
         $("#gridView-btn").toggleClass("active");
         if (articleShareServerCategory.gridOptions.columnCheckbox) {
             for (var i = 0; i < articleShareServerCategory.gridOptions.columns.length; i++) {
                 //articleShareServerCategory.gridOptions.columns[i].visible = $("#" + articleShareServerCategory.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                 var element = $("#" + articleShareServerCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                 //var temp = element[0].checked;
                 articleShareServerCategory.gridOptions.columns[i].visible = element[0].checked;
             }
         }
         else {
             var prechangeColumns = articleShareServerCategory.gridOptions.columns;
             for (var i = 0; i < articleShareServerCategory.gridOptions.columns.length; i++) {
                 articleShareServerCategory.gridOptions.columns[i].visible = true;
                 var element = $("#" + articleShareServerCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                 $("#" + articleShareServerCategory.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
             }
         }
         for (var i = 0; i < articleShareServerCategory.gridOptions.columns.length; i++) {
             console.log(articleShareServerCategory.gridOptions.columns[i].name.concat(".visible: "), articleShareServerCategory.gridOptions.columns[i].visible);
         }
         articleShareServerCategory.gridOptions.columnCheckbox = !articleShareServerCategory.gridOptions.columnCheckbox;
     }
    //Export Report 
    articleShareServerCategory.exportFile = function () {
        articleShareServerCategory.addRequested = true;
        articleShareServerCategory.gridOptions.advancedSearchData.engine.ExportFile = articleShareServerCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'articleShareServerCategory/exportfile', articleShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            articleShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                articleShareServerCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //articleShareServerCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    articleShareServerCategory.toggleExportForm = function () {
        articleShareServerCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        articleShareServerCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        articleShareServerCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        articleShareServerCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        articleShareServerCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleArticle/articleShareServerCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    articleShareServerCategory.rowCountChanged = function () {
        if (!angular.isDefined(articleShareServerCategory.ExportFileClass.RowCount) || articleShareServerCategory.ExportFileClass.RowCount > 5000)
            articleShareServerCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    articleShareServerCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"articleShareServerCategory/count", articleShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            articleShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            articleShareServerCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            articleShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    articleShareServerCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            articleShareServerCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    articleShareServerCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (articleShareServerCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    articleShareServerCategory.onNodeToggle = function (node, expanded) {
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

    articleShareServerCategory.onSelection = function (node, selected) {
        if (!selected) {
            articleShareServerCategory.selectedItem.LinkMainImageId = null;
            articleShareServerCategory.selectedItem.previewImageSrc = null;
            return;
        }
        articleShareServerCategory.selectedItem.LinkMainImageId = node.Id;
        articleShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            articleShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
