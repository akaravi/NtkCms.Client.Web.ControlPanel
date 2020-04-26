app.controller("blogShareReciverCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var blogShareReciverCategory = this;
    //For Grid Options
    blogShareReciverCategory.gridOptions = {};
    blogShareReciverCategory.selectedItem = {};
    blogShareReciverCategory.attachedFiles = [];
    blogShareReciverCategory.attachedFile = "";

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    var todayDate = moment().format();

    blogShareReciverCategory.ToDate = {
        defaultDate: todayDate
    }
    blogShareReciverCategory.FromDate = {
        defaultDate: todayDate
    }
    blogShareReciverCategory.testDate = moment().format();
    if (itemRecordStatus != undefined) blogShareReciverCategory.itemRecordStatus = itemRecordStatus;
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    blogShareReciverCategory.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "blogShareReciverCategoryController") {
            localStorage.setItem('AddRequest', '');
            blogShareReciverCategory.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }

    blogShareReciverCategory.LinkShareReciverCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareReciverCategoryId',
        url: 'BlogCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: blogShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    //blog Grid Options
    blogShareReciverCategory.LinkShareServerCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareServerCategoryId',
        url: 'BlogShareServerCategory',
        Action:'GetAllOtherSite',
        sortColumn: 'Id',
        sortType: 0,
        showAddDialog: false,
        filterText: 'Title',
        rowPerPage: 200,
        scope: blogShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    blogShareReciverCategory.gridOptions = {
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
    blogShareReciverCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show blog Loading Indicator
    blogShareReciverCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    blogShareReciverCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    blogShareReciverCategory.treeConfig.currentNode = {};
    blogShareReciverCategory.treeBusyIndicator = false;

    blogShareReciverCategory.addRequested = false;

    blogShareReciverCategory.showGridComment = false;
    blogShareReciverCategory.blogTitle = "";

    //init Function
    blogShareReciverCategory.init = function () {
        blogShareReciverCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = blogShareReciverCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        blogShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"BlogShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            blogShareReciverCategory.treeConfig.Items = response.ListItems;
            blogShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        blogShareReciverCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"blogShareReciverCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            blogShareReciverCategory.ListItems = response.ListItems;
            blogShareReciverCategory.gridOptions.fillData(blogShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            blogShareReciverCategory.contentBusyIndicator.isActive = false;
            blogShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            blogShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            blogShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            blogShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            blogShareReciverCategory.contentBusyIndicator.isActive = false;
        });
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        blogShareReciverCategory.checkRequestAddNewItemFromOtherControl(null);
    };

    // Open Add Category Modal 
    blogShareReciverCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        blogShareReciverCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'BlogShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            blogShareReciverCategory.selectedItem = response.Item;
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
                blogShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(blogShareReciverCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleBlog/BlogShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    blogShareReciverCategory.addRequested = false;
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
    blogShareReciverCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        blogShareReciverCategory.addRequested = false;
        blogShareReciverCategory.modalTitle = 'ویرایش';
        if (!blogShareReciverCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        blogShareReciverCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'BlogShareMainAdminSetting/GetOne', blogShareReciverCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            blogShareReciverCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            blogShareReciverCategory.selectedItem = response.Item;
            //Set dataForTheTree
            blogShareReciverCategory.selectedNode = [];
            blogShareReciverCategory.expandedNodes = [];
            blogShareReciverCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                blogShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(blogShareReciverCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (blogShareReciverCategory.selectedItem.LinkMainImageId > 0)
                        blogShareReciverCategory.onSelection({ Id: blogShareReciverCategory.selectedItem.LinkMainImageId }, true);
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
    blogShareReciverCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        blogShareReciverCategory.categoryBusyIndicator.isActive = true;
        blogShareReciverCategory.addRequested = true;
        blogShareReciverCategory.selectedItem.LinkParentId = null;
        if (blogShareReciverCategory.treeConfig.currentNode != null)
            blogShareReciverCategory.selectedItem.LinkParentId = blogShareReciverCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'BlogShareMainAdminSetting/add', blogShareReciverCategory.selectedItem, 'POST').success(function (response) {
            blogShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                blogShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                blogShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                blogShareReciverCategory.gridOptions.reGetAll();
                blogShareReciverCategory.closeModal();
            }
            blogShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogShareReciverCategory.addRequested = false;
            blogShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    blogShareReciverCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        blogShareReciverCategory.categoryBusyIndicator.isActive = true;
        blogShareReciverCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'BlogShareMainAdminSetting/edit', blogShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            //blogShareReciverCategory.showbusy = false;
            blogShareReciverCategory.treeConfig.showbusy = false;
            blogShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                blogShareReciverCategory.treeConfig.currentNode.Title = response.Item.Title;
                blogShareReciverCategory.closeModal();
            }
            blogShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogShareReciverCategory.addRequested = false;
            blogShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    blogShareReciverCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = blogShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                blogShareReciverCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'BlogShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    blogShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(blogShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'BlogShareMainAdminSetting/delete', blogShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        blogShareReciverCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //blogShareReciverCategory.replaceCategoryItem(blogShareReciverCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            blogShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            blogShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            blogShareReciverCategory.gridOptions.fillData();
                            blogShareReciverCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        blogShareReciverCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    blogShareReciverCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    blogShareReciverCategory.treeConfig.onNodeSelect = function () {
        var node = blogShareReciverCategory.treeConfig.currentNode;
        blogShareReciverCategory.showGridComment = false;
        blogShareReciverCategory.selectContent(node);

    };
    //Show Content with Category Id
    blogShareReciverCategory.selectContent = function (node) {
        blogShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
        blogShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            blogShareReciverCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            blogShareReciverCategory.contentBusyIndicator.isActive = true;
            blogShareReciverCategory.attachedFiles = null;
            blogShareReciverCategory.attachedFiles = [];
            var s = {
                PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            blogShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"blogShareReciverCategory/getall", blogShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            blogShareReciverCategory.contentBusyIndicator.isActive = false;
            blogShareReciverCategory.ListItems = response.ListItems;
            blogShareReciverCategory.gridOptions.fillData(blogShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            blogShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            blogShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            blogShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            blogShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    blogShareReciverCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = blogShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        blogShareReciverCategory.addRequested = false;
        blogShareReciverCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'blogShareReciverCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            blogShareReciverCategory.selectedItem = response.Item;
            blogShareReciverCategory.selectedItem.LinkShareServerCategoryId = node.Id;
            blogShareReciverCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleblog/blogShareReciverCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    blogShareReciverCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        blogShareReciverCategory.addRequested = false;
        blogShareReciverCategory.modalTitle = 'ویرایش';
        if (!blogShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'blogShareReciverCategory/GetOne', blogShareReciverCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            blogShareReciverCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleblog/blogShareReciverCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    blogShareReciverCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        blogShareReciverCategory.categoryBusyIndicator.isActive = true;
        blogShareReciverCategory.addRequested = true;

        if (blogShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || blogShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'blogShareReciverCategory/add', blogShareReciverCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            blogShareReciverCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                blogShareReciverCategory.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                blogShareReciverCategory.ListItems.unshift(response.Item);
                blogShareReciverCategory.gridOptions.fillData(blogShareReciverCategory.ListItems);
                blogShareReciverCategory.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogShareReciverCategory.addRequested = false;
            blogShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    blogShareReciverCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        blogShareReciverCategory.categoryBusyIndicator.isActive = true;
        blogShareReciverCategory.addRequested = true;

        if (blogShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || blogShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'blogShareReciverCategory/edit', blogShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            blogShareReciverCategory.categoryBusyIndicator.isActive = false;
            blogShareReciverCategory.addRequested = false;
            blogShareReciverCategory.treeConfig.showbusy = false;
            blogShareReciverCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                blogShareReciverCategory.replaceItem(blogShareReciverCategory.selectedItem.Id, response.Item);
                blogShareReciverCategory.gridOptions.fillData(blogShareReciverCategory.ListItems);
                blogShareReciverCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogShareReciverCategory.addRequested = false;
            blogShareReciverCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a blog Content 
    blogShareReciverCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!blogShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        blogShareReciverCategory.treeConfig.showbusy = true;
        blogShareReciverCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                blogShareReciverCategory.categoryBusyIndicator.isActive = true;
                console.log(blogShareReciverCategory.gridOptions.selectedRow.item);
                blogShareReciverCategory.showbusy = true;
                blogShareReciverCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"blogShareReciverCategory/GetOne", blogShareReciverCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    blogShareReciverCategory.showbusy = false;
                    blogShareReciverCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    blogShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(blogShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"blogShareReciverCategory/delete", blogShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        blogShareReciverCategory.categoryBusyIndicator.isActive = false;
                        blogShareReciverCategory.treeConfig.showbusy = false;
                        blogShareReciverCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            blogShareReciverCategory.replaceItem(blogShareReciverCategory.selectedItemForDelete.Id);
                            blogShareReciverCategory.gridOptions.fillData(blogShareReciverCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        blogShareReciverCategory.treeConfig.showbusy = false;
                        blogShareReciverCategory.showIsBusy = false;
                        blogShareReciverCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    blogShareReciverCategory.treeConfig.showbusy = false;
                    blogShareReciverCategory.showIsBusy = false;
                    blogShareReciverCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }





    ////Replace Item OnDelete/OnEdit Grid Options
    blogShareReciverCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(blogShareReciverCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = blogShareReciverCategory.ListItems.indexOf(item);
                blogShareReciverCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            blogShareReciverCategory.ListItems.unshift(newItem);
    }


    blogShareReciverCategory.searchData = function () {
        blogShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"blogShareReciverCategory/getall", blogShareReciverCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            blogShareReciverCategory.categoryBusyIndicator.isActive = false;
            blogShareReciverCategory.ListItems = response.ListItems;
            blogShareReciverCategory.gridOptions.fillData(blogShareReciverCategory.ListItems);
            blogShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            blogShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            blogShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
            blogShareReciverCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            blogShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    blogShareReciverCategory.addRequested = false;
    blogShareReciverCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    blogShareReciverCategory.showIsBusy = false;



    //For reInit Categories
    blogShareReciverCategory.gridOptions.reGetAll = function () {
        if (blogShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) blogShareReciverCategory.searchData();
        else blogShareReciverCategory.init();
    };

    blogShareReciverCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, blogShareReciverCategory.treeConfig.currentNode);
    }

    blogShareReciverCategory.loadFileAndFolder = function (item) {
        blogShareReciverCategory.treeConfig.currentNode = item;
        console.log(item);
        blogShareReciverCategory.treeConfig.onNodeSelect(item);
    }

    blogShareReciverCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            blogShareReciverCategory.focus = true;
        });
    };
    blogShareReciverCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            blogShareReciverCategory.focus1 = true;
        });
    };

    blogShareReciverCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }


    // End of Upload Modal-----------------------------------------

    //Export Report 
    blogShareReciverCategory.exportFile = function () {
        blogShareReciverCategory.addRequested = true;
        blogShareReciverCategory.gridOptions.advancedSearchData.engine.ExportFile = blogShareReciverCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'blogShareReciverCategory/exportfile', blogShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            blogShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                blogShareReciverCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //blogShareReciverCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    blogShareReciverCategory.toggleExportForm = function () {
        blogShareReciverCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        blogShareReciverCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        blogShareReciverCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        blogShareReciverCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        blogShareReciverCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleBlog/blogShareReciverCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    blogShareReciverCategory.rowCountChanged = function () {
        if (!angular.isDefined(blogShareReciverCategory.ExportFileClass.RowCount) || blogShareReciverCategory.ExportFileClass.RowCount > 5000)
            blogShareReciverCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    blogShareReciverCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"blogShareReciverCategory/count", blogShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            blogShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            blogShareReciverCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            blogShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    blogShareReciverCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            blogShareReciverCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    blogShareReciverCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (blogShareReciverCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    blogShareReciverCategory.onNodeToggle = function (node, expanded) {
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

    blogShareReciverCategory.onSelection = function (node, selected) {
        if (!selected) {
            blogShareReciverCategory.selectedItem.LinkMainImageId = null;
            blogShareReciverCategory.selectedItem.previewImageSrc = null;
            return;
        }
        blogShareReciverCategory.selectedItem.LinkMainImageId = node.Id;
        blogShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            blogShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
