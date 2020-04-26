app.controller("blogShareServerCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var blogShareServerCategory = this;
    //For Grid Options
    blogShareServerCategory.gridOptions = {};
    blogShareServerCategory.selectedItem = {};
    blogShareServerCategory.attachedFiles = [];
    blogShareServerCategory.attachedFile = "";

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) blogShareServerCategory.itemRecordStatus = itemRecordStatus;
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    blogShareServerCategory.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "blogShareServerCategoryController") {
            localStorage.setItem('AddRequest', '');
            blogShareServerCategory.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    
    blogShareServerCategory.LinkShareMainAdminSettingIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkServerCategoryId',
        url: 'BlogCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        showAddDialog: false,
        scope: blogShareServerCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    //blog Grid Options
                      
    blogShareServerCategory.gridOptions = {
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
    blogShareServerCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show blog Loading Indicator
    blogShareServerCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    blogShareServerCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    blogShareServerCategory.treeConfig.currentNode = {};
    blogShareServerCategory.treeBusyIndicator = false;

    blogShareServerCategory.addRequested = false;

    blogShareServerCategory.showGridComment = false;
    blogShareServerCategory.blogTitle = "";

    //init Function
    blogShareServerCategory.init = function () {
        blogShareServerCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = blogShareServerCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        blogShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"BlogShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            blogShareServerCategory.treeConfig.Items = response.ListItems;
            blogShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        blogShareServerCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"blogShareServerCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            blogShareServerCategory.ListItems = response.ListItems;
            blogShareServerCategory.gridOptions.fillData(blogShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            blogShareServerCategory.contentBusyIndicator.isActive = false;
            blogShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            blogShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            blogShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            blogShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            blogShareServerCategory.contentBusyIndicator.isActive = false;
            });
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        blogShareServerCategory.checkRequestAddNewItemFromOtherControl(null);
  
    };

    // Open Add Category Modal 
    blogShareServerCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        blogShareServerCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'BlogShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            blogShareServerCategory.selectedItem = response.Item;
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
                blogShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(blogShareServerCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleBlog/BlogShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    blogShareServerCategory.addRequested = false;
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
    blogShareServerCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        blogShareServerCategory.addRequested = false;
        blogShareServerCategory.modalTitle = 'ویرایش';
        if (!blogShareServerCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        blogShareServerCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'BlogShareMainAdminSetting/GetOne', blogShareServerCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            blogShareServerCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            blogShareServerCategory.selectedItem = response.Item;
            //Set dataForTheTree
            blogShareServerCategory.selectedNode = [];
            blogShareServerCategory.expandedNodes = [];
            blogShareServerCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                blogShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(blogShareServerCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (blogShareServerCategory.selectedItem.LinkMainImageId > 0)
                        blogShareServerCategory.onSelection({ Id: blogShareServerCategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleBlog/BlogShareMainAdminSetting/edit.html',
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
    blogShareServerCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        blogShareServerCategory.categoryBusyIndicator.isActive = true;
        blogShareServerCategory.addRequested = true;
        blogShareServerCategory.selectedItem.LinkParentId = null;
        if (blogShareServerCategory.treeConfig.currentNode != null)
            blogShareServerCategory.selectedItem.LinkParentId = blogShareServerCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'BlogShareMainAdminSetting/add', blogShareServerCategory.selectedItem, 'POST').success(function (response) {
            blogShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                blogShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                blogShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                blogShareServerCategory.gridOptions.reGetAll();
                blogShareServerCategory.closeModal();
            }
            blogShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogShareServerCategory.addRequested = false;
            blogShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    blogShareServerCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        blogShareServerCategory.categoryBusyIndicator.isActive = true;
        blogShareServerCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'BlogShareMainAdminSetting/edit', blogShareServerCategory.selectedItem, 'PUT').success(function (response) {
            //blogShareServerCategory.showbusy = false;
            blogShareServerCategory.treeConfig.showbusy = false;
            blogShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                blogShareServerCategory.treeConfig.currentNode.Title = response.Item.Title;
                blogShareServerCategory.closeModal();
            }
            blogShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogShareServerCategory.addRequested = false;
            blogShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    blogShareServerCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = blogShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                blogShareServerCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'BlogShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    blogShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(blogShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'BlogShareMainAdminSetting/delete', blogShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        blogShareServerCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //blogShareServerCategory.replaceCategoryItem(blogShareServerCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            blogShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            blogShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            blogShareServerCategory.gridOptions.fillData();
                            blogShareServerCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        blogShareServerCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    blogShareServerCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    blogShareServerCategory.treeConfig.onNodeSelect = function () {
        var node = blogShareServerCategory.treeConfig.currentNode;
        blogShareServerCategory.showGridComment = false;
        blogShareServerCategory.selectContent(node);

    };
    //Show Content with Category Id
    blogShareServerCategory.selectContent = function (node) {
        blogShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
        blogShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            blogShareServerCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            blogShareServerCategory.contentBusyIndicator.isActive = true;
            blogShareServerCategory.attachedFiles = null;
            blogShareServerCategory.attachedFiles = [];
            var s = {
                PropertyName: "LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            blogShareServerCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"blogShareServerCategory/getall", blogShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            blogShareServerCategory.contentBusyIndicator.isActive = false;
            blogShareServerCategory.ListItems = response.ListItems;
            blogShareServerCategory.gridOptions.fillData(blogShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            blogShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            blogShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            blogShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            blogShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    blogShareServerCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = blogShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        blogShareServerCategory.addRequested = false;
        blogShareServerCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'blogShareServerCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            blogShareServerCategory.selectedItem = response.Item;
            blogShareServerCategory.selectedItem.LinkShareMainAdminSettingId = node.Id;
            blogShareServerCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleblog/blogShareServerCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    blogShareServerCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        blogShareServerCategory.addRequested = false;
        blogShareServerCategory.modalTitle = 'ویرایش';
        if (!blogShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'blogShareServerCategory/GetOne', blogShareServerCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            blogShareServerCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleblog/blogShareServerCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    blogShareServerCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        blogShareServerCategory.categoryBusyIndicator.isActive = true;
        blogShareServerCategory.addRequested = true;

        if (blogShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || blogShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'blogShareServerCategory/add', blogShareServerCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            blogShareServerCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                blogShareServerCategory.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                blogShareServerCategory.ListItems.unshift(response.Item);
                blogShareServerCategory.gridOptions.fillData(blogShareServerCategory.ListItems);
                blogShareServerCategory.closeModal();
            
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogShareServerCategory.addRequested = false;
            blogShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    blogShareServerCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        blogShareServerCategory.categoryBusyIndicator.isActive = true;
        blogShareServerCategory.addRequested = true;
    
        if (blogShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || blogShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'blogShareServerCategory/edit', blogShareServerCategory.selectedItem, 'PUT').success(function (response) {
            blogShareServerCategory.categoryBusyIndicator.isActive = false;
            blogShareServerCategory.addRequested = false;
            blogShareServerCategory.treeConfig.showbusy = false;
            blogShareServerCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                blogShareServerCategory.replaceItem(blogShareServerCategory.selectedItem.Id, response.Item);
                blogShareServerCategory.gridOptions.fillData(blogShareServerCategory.ListItems);
                blogShareServerCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogShareServerCategory.addRequested = false;
            blogShareServerCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a blog Content 
    blogShareServerCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!blogShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        blogShareServerCategory.treeConfig.showbusy = true;
        blogShareServerCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                blogShareServerCategory.categoryBusyIndicator.isActive = true;
                console.log(blogShareServerCategory.gridOptions.selectedRow.item);
                blogShareServerCategory.showbusy = true;
                blogShareServerCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"blogShareServerCategory/GetOne", blogShareServerCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    blogShareServerCategory.showbusy = false;
                    blogShareServerCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    blogShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(blogShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"blogShareServerCategory/delete", blogShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        blogShareServerCategory.categoryBusyIndicator.isActive = false;
                        blogShareServerCategory.treeConfig.showbusy = false;
                        blogShareServerCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            blogShareServerCategory.replaceItem(blogShareServerCategory.selectedItemForDelete.Id);
                            blogShareServerCategory.gridOptions.fillData(blogShareServerCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        blogShareServerCategory.treeConfig.showbusy = false;
                        blogShareServerCategory.showIsBusy = false;
                        blogShareServerCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    blogShareServerCategory.treeConfig.showbusy = false;
                    blogShareServerCategory.showIsBusy = false;
                    blogShareServerCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }

    

   

    ////Replace Item OnDelete/OnEdit Grid Options
    blogShareServerCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(blogShareServerCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = blogShareServerCategory.ListItems.indexOf(item);
                blogShareServerCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            blogShareServerCategory.ListItems.unshift(newItem);
    }

   
    blogShareServerCategory.searchData = function () {
        blogShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"blogShareServerCategory/getall", blogShareServerCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            blogShareServerCategory.categoryBusyIndicator.isActive = false;
            blogShareServerCategory.ListItems = response.ListItems;
            blogShareServerCategory.gridOptions.fillData(blogShareServerCategory.ListItems);
            blogShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            blogShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            blogShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
            blogShareServerCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            blogShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    blogShareServerCategory.addRequested = false;
    blogShareServerCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    blogShareServerCategory.showIsBusy = false;

   

    //For reInit Categories
    blogShareServerCategory.gridOptions.reGetAll = function () {
        if (blogShareServerCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) blogShareServerCategory.searchData();
        else blogShareServerCategory.init();
    };

    blogShareServerCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, blogShareServerCategory.treeConfig.currentNode);
    }

    blogShareServerCategory.loadFileAndFolder = function (item) {
        blogShareServerCategory.treeConfig.currentNode = item;
        console.log(item);
        blogShareServerCategory.treeConfig.onNodeSelect(item);
    }

    blogShareServerCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            blogShareServerCategory.focus = true;
        });
    };
    blogShareServerCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            blogShareServerCategory.focus1 = true;
        });
    };

     blogShareServerCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

  
   // End of Upload Modal-----------------------------------------

    //Export Report 
    blogShareServerCategory.exportFile = function () {
        blogShareServerCategory.addRequested = true;
        blogShareServerCategory.gridOptions.advancedSearchData.engine.ExportFile = blogShareServerCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'blogShareServerCategory/exportfile', blogShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            blogShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                blogShareServerCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //blogShareServerCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    blogShareServerCategory.toggleExportForm = function () {
        blogShareServerCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        blogShareServerCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        blogShareServerCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        blogShareServerCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        blogShareServerCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleBlog/blogShareServerCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    blogShareServerCategory.rowCountChanged = function () {
        if (!angular.isDefined(blogShareServerCategory.ExportFileClass.RowCount) || blogShareServerCategory.ExportFileClass.RowCount > 5000)
            blogShareServerCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    blogShareServerCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"blogShareServerCategory/count", blogShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            blogShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            blogShareServerCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            blogShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    blogShareServerCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            blogShareServerCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    blogShareServerCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (blogShareServerCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    blogShareServerCategory.onNodeToggle = function (node, expanded) {
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

    blogShareServerCategory.onSelection = function (node, selected) {
        if (!selected) {
            blogShareServerCategory.selectedItem.LinkMainImageId = null;
            blogShareServerCategory.selectedItem.previewImageSrc = null;
            return;
        }
        blogShareServerCategory.selectedItem.LinkMainImageId = node.Id;
        blogShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            blogShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
