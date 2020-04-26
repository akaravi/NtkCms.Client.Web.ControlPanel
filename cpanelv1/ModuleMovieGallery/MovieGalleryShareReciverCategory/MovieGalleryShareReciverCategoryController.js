app.controller("movieGalleryShareReciverCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var movieGalleryShareReciverCategory = this;
    //For Grid Options
    movieGalleryShareReciverCategory.gridOptions = {};
    movieGalleryShareReciverCategory.selectedItem = {};
    movieGalleryShareReciverCategory.attachedFiles = [];
    movieGalleryShareReciverCategory.attachedFile = "";

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    var todayDate = moment().format();

    movieGalleryShareReciverCategory.ToDate = {
        defaultDate: todayDate
    }
    movieGalleryShareReciverCategory.FromDate = {
        defaultDate: todayDate
    }
    movieGalleryShareReciverCategory.testDate = moment().format();
    if (itemRecordStatus != undefined) movieGalleryShareReciverCategory.itemRecordStatus = itemRecordStatus;
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    movieGalleryShareReciverCategory.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "movieGalleryShareReciverCategoryController") {
            localStorage.setItem('AddRequest', '');
            movieGalleryShareReciverCategory.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }

    movieGalleryShareReciverCategory.LinkShareReciverCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareReciverCategoryId',
        url: 'MovieGalleryCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        showAddDialog: false,
        scope: movieGalleryShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' }
            ]
        }
    }

    //movieGallery Grid Options
    movieGalleryShareReciverCategory.LinkShareServerCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareServerCategoryId',
        url: 'MovieGalleryShareServerCategory',
        Action:'GetAllOtherSite',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        showAddDialog: false,
        scope: movieGalleryShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' }
            ]
        }
    }
    movieGalleryShareReciverCategory.gridOptions = {
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
    movieGalleryShareReciverCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show movieGallery Loading Indicator
    movieGalleryShareReciverCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    movieGalleryShareReciverCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    movieGalleryShareReciverCategory.treeConfig.currentNode = {};
    movieGalleryShareReciverCategory.treeBusyIndicator = false;

    movieGalleryShareReciverCategory.addRequested = false;

    movieGalleryShareReciverCategory.showGridComment = false;
    movieGalleryShareReciverCategory.movieGalleryTitle = "";

    //init Function
    movieGalleryShareReciverCategory.init = function () {
        movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = movieGalleryShareReciverCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"MovieGalleryShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            movieGalleryShareReciverCategory.treeConfig.Items = response.ListItems;
            movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        movieGalleryShareReciverCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"movieGalleryShareReciverCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            movieGalleryShareReciverCategory.ListItems = response.ListItems;
            movieGalleryShareReciverCategory.gridOptions.fillData(movieGalleryShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            movieGalleryShareReciverCategory.contentBusyIndicator.isActive = false;
            movieGalleryShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            movieGalleryShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            movieGalleryShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            movieGalleryShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            movieGalleryShareReciverCategory.contentBusyIndicator.isActive = false;
            });
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        movieGalleryShareReciverCategory.checkRequestAddNewItemFromOtherControl(null);

    };

    // Open Add Category Modal 
    movieGalleryShareReciverCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        movieGalleryShareReciverCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            movieGalleryShareReciverCategory.selectedItem = response.Item;
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
                movieGalleryShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(movieGalleryShareReciverCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleMovieGallery/MovieGalleryShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    movieGalleryShareReciverCategory.addRequested = false;
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
    movieGalleryShareReciverCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        movieGalleryShareReciverCategory.addRequested = false;
        movieGalleryShareReciverCategory.modalTitle = 'ویرایش';
        if (!movieGalleryShareReciverCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        movieGalleryShareReciverCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryShareMainAdminSetting/GetOne', movieGalleryShareReciverCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            movieGalleryShareReciverCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            movieGalleryShareReciverCategory.selectedItem = response.Item;
            //Set dataForTheTree
            movieGalleryShareReciverCategory.selectedNode = [];
            movieGalleryShareReciverCategory.expandedNodes = [];
            movieGalleryShareReciverCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                movieGalleryShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(movieGalleryShareReciverCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (movieGalleryShareReciverCategory.selectedItem.LinkMainImageId > 0)
                        movieGalleryShareReciverCategory.onSelection({ Id: movieGalleryShareReciverCategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleMovieGallery/MovieGalleryShareMainAdminSetting/edit.html',
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
    movieGalleryShareReciverCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;
        movieGalleryShareReciverCategory.addRequested = true;
        movieGalleryShareReciverCategory.selectedItem.LinkParentId = null;
        if (movieGalleryShareReciverCategory.treeConfig.currentNode != null)
            movieGalleryShareReciverCategory.selectedItem.LinkParentId = movieGalleryShareReciverCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryShareMainAdminSetting/add', movieGalleryShareReciverCategory.selectedItem, 'POST').success(function (response) {
            movieGalleryShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                movieGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                movieGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                movieGalleryShareReciverCategory.gridOptions.reGetAll();
                movieGalleryShareReciverCategory.closeModal();
            }
            movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            movieGalleryShareReciverCategory.addRequested = false;
            movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    movieGalleryShareReciverCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;
        movieGalleryShareReciverCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryShareMainAdminSetting/edit', movieGalleryShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            //movieGalleryShareReciverCategory.showbusy = false;
            movieGalleryShareReciverCategory.treeConfig.showbusy = false;
            movieGalleryShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                movieGalleryShareReciverCategory.treeConfig.currentNode.Title = response.Item.Title;
                movieGalleryShareReciverCategory.closeModal();
            }
            movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            movieGalleryShareReciverCategory.addRequested = false;
            movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    movieGalleryShareReciverCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = movieGalleryShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    movieGalleryShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(movieGalleryShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryShareMainAdminSetting/delete', movieGalleryShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //movieGalleryShareReciverCategory.replaceCategoryItem(movieGalleryShareReciverCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            movieGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            movieGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            movieGalleryShareReciverCategory.gridOptions.fillData();
                            movieGalleryShareReciverCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    movieGalleryShareReciverCategory.treeConfig.onNodeSelect = function () {
        var node = movieGalleryShareReciverCategory.treeConfig.currentNode;
        movieGalleryShareReciverCategory.showGridComment = false;
        movieGalleryShareReciverCategory.selectContent(node);

    };
    //Show Content with Category Id
    movieGalleryShareReciverCategory.selectContent = function (node) {
        movieGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
        movieGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            movieGalleryShareReciverCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            movieGalleryShareReciverCategory.contentBusyIndicator.isActive = true;
            movieGalleryShareReciverCategory.attachedFiles = null;
            movieGalleryShareReciverCategory.attachedFiles = [];
            var s = {
                PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            movieGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"movieGalleryShareReciverCategory/getall", movieGalleryShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            movieGalleryShareReciverCategory.contentBusyIndicator.isActive = false;
            movieGalleryShareReciverCategory.ListItems = response.ListItems;
            movieGalleryShareReciverCategory.gridOptions.fillData(movieGalleryShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            movieGalleryShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            movieGalleryShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            movieGalleryShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            movieGalleryShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    movieGalleryShareReciverCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = movieGalleryShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        movieGalleryShareReciverCategory.addRequested = false;
        movieGalleryShareReciverCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryShareReciverCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            movieGalleryShareReciverCategory.selectedItem = response.Item;
            movieGalleryShareReciverCategory.selectedItem.LinkShareServerCategoryId = node.Id;
            movieGalleryShareReciverCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModulemovieGallery/movieGalleryShareReciverCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    movieGalleryShareReciverCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        movieGalleryShareReciverCategory.addRequested = false;
        movieGalleryShareReciverCategory.modalTitle = 'ویرایش';
        if (!movieGalleryShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryShareReciverCategory/GetOne', movieGalleryShareReciverCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            movieGalleryShareReciverCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModulemovieGallery/movieGalleryShareReciverCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    movieGalleryShareReciverCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;
        movieGalleryShareReciverCategory.addRequested = true;

        if (movieGalleryShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || movieGalleryShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryShareReciverCategory/add', movieGalleryShareReciverCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                movieGalleryShareReciverCategory.checkRequestAddNewItemFromOtherControl(response.Item.Id);

                movieGalleryShareReciverCategory.ListItems.unshift(response.Item);
                movieGalleryShareReciverCategory.gridOptions.fillData(movieGalleryShareReciverCategory.ListItems);
                movieGalleryShareReciverCategory.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            movieGalleryShareReciverCategory.addRequested = false;
            movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    movieGalleryShareReciverCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;
        movieGalleryShareReciverCategory.addRequested = true;

        if (movieGalleryShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || movieGalleryShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryShareReciverCategory/edit', movieGalleryShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
            movieGalleryShareReciverCategory.addRequested = false;
            movieGalleryShareReciverCategory.treeConfig.showbusy = false;
            movieGalleryShareReciverCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                movieGalleryShareReciverCategory.replaceItem(movieGalleryShareReciverCategory.selectedItem.Id, response.Item);
                movieGalleryShareReciverCategory.gridOptions.fillData(movieGalleryShareReciverCategory.ListItems);
                movieGalleryShareReciverCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            movieGalleryShareReciverCategory.addRequested = false;
            movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a movieGallery Content 
    movieGalleryShareReciverCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!movieGalleryShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        movieGalleryShareReciverCategory.treeConfig.showbusy = true;
        movieGalleryShareReciverCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;
                console.log(movieGalleryShareReciverCategory.gridOptions.selectedRow.item);
                movieGalleryShareReciverCategory.showbusy = true;
                movieGalleryShareReciverCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"movieGalleryShareReciverCategory/GetOne", movieGalleryShareReciverCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    movieGalleryShareReciverCategory.showbusy = false;
                    movieGalleryShareReciverCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    movieGalleryShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(movieGalleryShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"movieGalleryShareReciverCategory/delete", movieGalleryShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
                        movieGalleryShareReciverCategory.treeConfig.showbusy = false;
                        movieGalleryShareReciverCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            movieGalleryShareReciverCategory.replaceItem(movieGalleryShareReciverCategory.selectedItemForDelete.Id);
                            movieGalleryShareReciverCategory.gridOptions.fillData(movieGalleryShareReciverCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        movieGalleryShareReciverCategory.treeConfig.showbusy = false;
                        movieGalleryShareReciverCategory.showIsBusy = false;
                        movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    movieGalleryShareReciverCategory.treeConfig.showbusy = false;
                    movieGalleryShareReciverCategory.showIsBusy = false;
                    movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }





    ////Replace Item OnDelete/OnEdit Grid Options
    movieGalleryShareReciverCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(movieGalleryShareReciverCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = movieGalleryShareReciverCategory.ListItems.indexOf(item);
                movieGalleryShareReciverCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            movieGalleryShareReciverCategory.ListItems.unshift(newItem);
    }


    movieGalleryShareReciverCategory.searchData = function () {
        movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"movieGalleryShareReciverCategory/getall", movieGalleryShareReciverCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            movieGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
            movieGalleryShareReciverCategory.ListItems = response.ListItems;
            movieGalleryShareReciverCategory.gridOptions.fillData(movieGalleryShareReciverCategory.ListItems);
            movieGalleryShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            movieGalleryShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            movieGalleryShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
            movieGalleryShareReciverCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            movieGalleryShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    movieGalleryShareReciverCategory.addRequested = false;
    movieGalleryShareReciverCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    movieGalleryShareReciverCategory.showIsBusy = false;



    //For reInit Categories
    movieGalleryShareReciverCategory.gridOptions.reGetAll = function () {
        if (movieGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) movieGalleryShareReciverCategory.searchData();
        else movieGalleryShareReciverCategory.init();
    };

    movieGalleryShareReciverCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, movieGalleryShareReciverCategory.treeConfig.currentNode);
    }

    movieGalleryShareReciverCategory.loadFileAndFolder = function (item) {
        movieGalleryShareReciverCategory.treeConfig.currentNode = item;
        console.log(item);
        movieGalleryShareReciverCategory.treeConfig.onNodeSelect(item);
    }

    movieGalleryShareReciverCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            movieGalleryShareReciverCategory.focus = true;
        });
    };
    movieGalleryShareReciverCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            movieGalleryShareReciverCategory.focus1 = true;
        });
    };

    movieGalleryShareReciverCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }


    // End of Upload Modal-----------------------------------------
    movieGalleryShareReciverCategory.columnCheckbox = false;
    movieGalleryShareReciverCategory.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = movieGalleryShareReciverCategory.gridOptions.columns;
        if (movieGalleryShareReciverCategory.gridOptions.columnCheckbox) {
            for (var i = 0; i < movieGalleryShareReciverCategory.gridOptions.columns.length; i++) {
                //movieGalleryShareReciverCategory.gridOptions.columns[i].visible = $("#" + movieGalleryShareReciverCategory.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + movieGalleryShareReciverCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                movieGalleryShareReciverCategory.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < movieGalleryShareReciverCategory.gridOptions.columns.length; i++) {
                var element = $("#" + movieGalleryShareReciverCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + movieGalleryShareReciverCategory.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < movieGalleryShareReciverCategory.gridOptions.columns.length; i++) {
            console.log(movieGalleryShareReciverCategory.gridOptions.columns[i].name.concat(".visible: "), movieGalleryShareReciverCategory.gridOptions.columns[i].visible);
        }
        movieGalleryShareReciverCategory.gridOptions.columnCheckbox = !movieGalleryShareReciverCategory.gridOptions.columnCheckbox;
    }
    //Export Report 
    movieGalleryShareReciverCategory.exportFile = function () {
        movieGalleryShareReciverCategory.addRequested = true;
        movieGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.ExportFile = movieGalleryShareReciverCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryShareReciverCategory/exportfile', movieGalleryShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            movieGalleryShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                movieGalleryShareReciverCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //movieGalleryShareReciverCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    movieGalleryShareReciverCategory.toggleExportForm = function () {
        movieGalleryShareReciverCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        movieGalleryShareReciverCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        movieGalleryShareReciverCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        movieGalleryShareReciverCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        movieGalleryShareReciverCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleMovieGallery/movieGalleryShareReciverCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    movieGalleryShareReciverCategory.rowCountChanged = function () {
        if (!angular.isDefined(movieGalleryShareReciverCategory.ExportFileClass.RowCount) || movieGalleryShareReciverCategory.ExportFileClass.RowCount > 5000)
            movieGalleryShareReciverCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    movieGalleryShareReciverCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"movieGalleryShareReciverCategory/count", movieGalleryShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            movieGalleryShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            movieGalleryShareReciverCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            movieGalleryShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    movieGalleryShareReciverCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            movieGalleryShareReciverCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    movieGalleryShareReciverCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (movieGalleryShareReciverCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    movieGalleryShareReciverCategory.onNodeToggle = function (node, expanded) {
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

    movieGalleryShareReciverCategory.onSelection = function (node, selected) {
        if (!selected) {
            movieGalleryShareReciverCategory.selectedItem.LinkMainImageId = null;
            movieGalleryShareReciverCategory.selectedItem.previewImageSrc = null;
            return;
        }
        movieGalleryShareReciverCategory.selectedItem.LinkMainImageId = node.Id;
        movieGalleryShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            movieGalleryShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
