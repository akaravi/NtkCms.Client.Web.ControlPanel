app.controller("movieGalleryShareServerCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var movieGalleryShareServerCategory = this;
    //For Grid Options
    movieGalleryShareServerCategory.gridOptions = {};
    movieGalleryShareServerCategory.selectedItem = {};
    movieGalleryShareServerCategory.attachedFiles = [];
    movieGalleryShareServerCategory.attachedFile = "";

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) movieGalleryShareServerCategory.itemRecordStatus = itemRecordStatus;
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    movieGalleryShareServerCategory.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "movieGalleryShareServerCategoryController") {
            localStorage.setItem('AddRequest', '');
            movieGalleryShareServerCategory.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    
    movieGalleryShareServerCategory.LinkShareMainAdminSettingIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkServerCategoryId',
        url: 'MovieGalleryCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        showAddDialog: false,
        scope: movieGalleryShareServerCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' }
            ]
        }
    }

    //movieGallery Grid Options
                      
    movieGalleryShareServerCategory.gridOptions = {
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
    movieGalleryShareServerCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show movieGallery Loading Indicator
    movieGalleryShareServerCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    movieGalleryShareServerCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    movieGalleryShareServerCategory.treeConfig.currentNode = {};
    movieGalleryShareServerCategory.treeBusyIndicator = false;

    movieGalleryShareServerCategory.addRequested = false;

    movieGalleryShareServerCategory.showGridComment = false;
    movieGalleryShareServerCategory.movieGalleryTitle = "";

    //init Function
    movieGalleryShareServerCategory.init = function () {
        movieGalleryShareServerCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = movieGalleryShareServerCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        movieGalleryShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"MovieGalleryShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            movieGalleryShareServerCategory.treeConfig.Items = response.ListItems;
            movieGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        movieGalleryShareServerCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"movieGalleryShareServerCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            movieGalleryShareServerCategory.ListItems = response.ListItems;
            movieGalleryShareServerCategory.gridOptions.fillData(movieGalleryShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            movieGalleryShareServerCategory.contentBusyIndicator.isActive = false;
            movieGalleryShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            movieGalleryShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            movieGalleryShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            movieGalleryShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            movieGalleryShareServerCategory.contentBusyIndicator.isActive = false;
        });
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        movieGalleryShareServerCategory.checkRequestAddNewItemFromOtherControl(null);

    };

    // Open Add Category Modal 
    movieGalleryShareServerCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        movieGalleryShareServerCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            movieGalleryShareServerCategory.selectedItem = response.Item;
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
                movieGalleryShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(movieGalleryShareServerCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleMovieGallery/MovieGalleryShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    movieGalleryShareServerCategory.addRequested = false;
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
    movieGalleryShareServerCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        movieGalleryShareServerCategory.addRequested = false;
        movieGalleryShareServerCategory.modalTitle = 'ویرایش';
        if (!movieGalleryShareServerCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        movieGalleryShareServerCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryShareMainAdminSetting/GetOne', movieGalleryShareServerCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            movieGalleryShareServerCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            movieGalleryShareServerCategory.selectedItem = response.Item;
            //Set dataForTheTree
            movieGalleryShareServerCategory.selectedNode = [];
            movieGalleryShareServerCategory.expandedNodes = [];
            movieGalleryShareServerCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                movieGalleryShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(movieGalleryShareServerCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (movieGalleryShareServerCategory.selectedItem.LinkMainImageId > 0)
                        movieGalleryShareServerCategory.onSelection({ Id: movieGalleryShareServerCategory.selectedItem.LinkMainImageId }, true);
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
    movieGalleryShareServerCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        movieGalleryShareServerCategory.categoryBusyIndicator.isActive = true;
        movieGalleryShareServerCategory.addRequested = true;
        movieGalleryShareServerCategory.selectedItem.LinkParentId = null;
        if (movieGalleryShareServerCategory.treeConfig.currentNode != null)
            movieGalleryShareServerCategory.selectedItem.LinkParentId = movieGalleryShareServerCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryShareMainAdminSetting/add', movieGalleryShareServerCategory.selectedItem, 'POST').success(function (response) {
            movieGalleryShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                movieGalleryShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                movieGalleryShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                movieGalleryShareServerCategory.gridOptions.reGetAll();
                movieGalleryShareServerCategory.closeModal();
            }
            movieGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            movieGalleryShareServerCategory.addRequested = false;
            movieGalleryShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    movieGalleryShareServerCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        movieGalleryShareServerCategory.categoryBusyIndicator.isActive = true;
        movieGalleryShareServerCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryShareMainAdminSetting/edit', movieGalleryShareServerCategory.selectedItem, 'PUT').success(function (response) {
            //movieGalleryShareServerCategory.showbusy = false;
            movieGalleryShareServerCategory.treeConfig.showbusy = false;
            movieGalleryShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                movieGalleryShareServerCategory.treeConfig.currentNode.Title = response.Item.Title;
                movieGalleryShareServerCategory.closeModal();
            }
            movieGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            movieGalleryShareServerCategory.addRequested = false;
            movieGalleryShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    movieGalleryShareServerCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = movieGalleryShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                movieGalleryShareServerCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    movieGalleryShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(movieGalleryShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryShareMainAdminSetting/delete', movieGalleryShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        movieGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //movieGalleryShareServerCategory.replaceCategoryItem(movieGalleryShareServerCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            movieGalleryShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            movieGalleryShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            movieGalleryShareServerCategory.gridOptions.fillData();
                            movieGalleryShareServerCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        movieGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    movieGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    movieGalleryShareServerCategory.treeConfig.onNodeSelect = function () {
        var node = movieGalleryShareServerCategory.treeConfig.currentNode;
        movieGalleryShareServerCategory.showGridComment = false;
        movieGalleryShareServerCategory.selectContent(node);

    };
    //Show Content with Category Id
    movieGalleryShareServerCategory.selectContent = function (node) {
        movieGalleryShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
        movieGalleryShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            movieGalleryShareServerCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            movieGalleryShareServerCategory.contentBusyIndicator.isActive = true;
            movieGalleryShareServerCategory.attachedFiles = null;
            movieGalleryShareServerCategory.attachedFiles = [];
            var s = {
                PropertyName: "LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            movieGalleryShareServerCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"movieGalleryShareServerCategory/getall", movieGalleryShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            movieGalleryShareServerCategory.contentBusyIndicator.isActive = false;
            movieGalleryShareServerCategory.ListItems = response.ListItems;
            movieGalleryShareServerCategory.gridOptions.fillData(movieGalleryShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            movieGalleryShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            movieGalleryShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            movieGalleryShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            movieGalleryShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    movieGalleryShareServerCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = movieGalleryShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        movieGalleryShareServerCategory.addRequested = false;
        movieGalleryShareServerCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryShareServerCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            movieGalleryShareServerCategory.selectedItem = response.Item;
            movieGalleryShareServerCategory.selectedItem.LinkShareMainAdminSettingId = node.Id;
            movieGalleryShareServerCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModulemovieGallery/movieGalleryShareServerCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    movieGalleryShareServerCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        movieGalleryShareServerCategory.addRequested = false;
        movieGalleryShareServerCategory.modalTitle = 'ویرایش';
        if (!movieGalleryShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryShareServerCategory/GetOne', movieGalleryShareServerCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            movieGalleryShareServerCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModulemovieGallery/movieGalleryShareServerCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    movieGalleryShareServerCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        movieGalleryShareServerCategory.categoryBusyIndicator.isActive = true;
        movieGalleryShareServerCategory.addRequested = true;

        if (movieGalleryShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || movieGalleryShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryShareServerCategory/add', movieGalleryShareServerCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            movieGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                movieGalleryShareServerCategory.checkRequestAddNewItemFromOtherControl(response.Item.Id);

                movieGalleryShareServerCategory.ListItems.unshift(response.Item);
                movieGalleryShareServerCategory.gridOptions.fillData(movieGalleryShareServerCategory.ListItems);
                movieGalleryShareServerCategory.closeModal();
            
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            movieGalleryShareServerCategory.addRequested = false;
            movieGalleryShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    movieGalleryShareServerCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        movieGalleryShareServerCategory.categoryBusyIndicator.isActive = true;
        movieGalleryShareServerCategory.addRequested = true;
    
        if (movieGalleryShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || movieGalleryShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryShareServerCategory/edit', movieGalleryShareServerCategory.selectedItem, 'PUT').success(function (response) {
            movieGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
            movieGalleryShareServerCategory.addRequested = false;
            movieGalleryShareServerCategory.treeConfig.showbusy = false;
            movieGalleryShareServerCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                movieGalleryShareServerCategory.replaceItem(movieGalleryShareServerCategory.selectedItem.Id, response.Item);
                movieGalleryShareServerCategory.gridOptions.fillData(movieGalleryShareServerCategory.ListItems);
                movieGalleryShareServerCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            movieGalleryShareServerCategory.addRequested = false;
            movieGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a movieGallery Content 
    movieGalleryShareServerCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!movieGalleryShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        movieGalleryShareServerCategory.treeConfig.showbusy = true;
        movieGalleryShareServerCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                movieGalleryShareServerCategory.categoryBusyIndicator.isActive = true;
                console.log(movieGalleryShareServerCategory.gridOptions.selectedRow.item);
                movieGalleryShareServerCategory.showbusy = true;
                movieGalleryShareServerCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"movieGalleryShareServerCategory/GetOne", movieGalleryShareServerCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    movieGalleryShareServerCategory.showbusy = false;
                    movieGalleryShareServerCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    movieGalleryShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(movieGalleryShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"movieGalleryShareServerCategory/delete", movieGalleryShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        movieGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
                        movieGalleryShareServerCategory.treeConfig.showbusy = false;
                        movieGalleryShareServerCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            movieGalleryShareServerCategory.replaceItem(movieGalleryShareServerCategory.selectedItemForDelete.Id);
                            movieGalleryShareServerCategory.gridOptions.fillData(movieGalleryShareServerCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        movieGalleryShareServerCategory.treeConfig.showbusy = false;
                        movieGalleryShareServerCategory.showIsBusy = false;
                        movieGalleryShareServerCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    movieGalleryShareServerCategory.treeConfig.showbusy = false;
                    movieGalleryShareServerCategory.showIsBusy = false;
                    movieGalleryShareServerCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }

    

   

    ////Replace Item OnDelete/OnEdit Grid Options
    movieGalleryShareServerCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(movieGalleryShareServerCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = movieGalleryShareServerCategory.ListItems.indexOf(item);
                movieGalleryShareServerCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            movieGalleryShareServerCategory.ListItems.unshift(newItem);
    }

   
    movieGalleryShareServerCategory.searchData = function () {
        movieGalleryShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"movieGalleryShareServerCategory/getall", movieGalleryShareServerCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            movieGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
            movieGalleryShareServerCategory.ListItems = response.ListItems;
            movieGalleryShareServerCategory.gridOptions.fillData(movieGalleryShareServerCategory.ListItems);
            movieGalleryShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            movieGalleryShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            movieGalleryShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
            movieGalleryShareServerCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            movieGalleryShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    movieGalleryShareServerCategory.addRequested = false;
    movieGalleryShareServerCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    movieGalleryShareServerCategory.showIsBusy = false;

   

    //For reInit Categories
    movieGalleryShareServerCategory.gridOptions.reGetAll = function () {
        if (movieGalleryShareServerCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) movieGalleryShareServerCategory.searchData();
        else movieGalleryShareServerCategory.init();
    };

    movieGalleryShareServerCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, movieGalleryShareServerCategory.treeConfig.currentNode);
    }

    movieGalleryShareServerCategory.loadFileAndFolder = function (item) {
        movieGalleryShareServerCategory.treeConfig.currentNode = item;
        console.log(item);
        movieGalleryShareServerCategory.treeConfig.onNodeSelect(item);
    }

    movieGalleryShareServerCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            movieGalleryShareServerCategory.focus = true;
        });
    };
    movieGalleryShareServerCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            movieGalleryShareServerCategory.focus1 = true;
        });
    };

     movieGalleryShareServerCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

  
   // End of Upload Modal-----------------------------------------
     movieGalleryShareServerCategory.columnCheckbox = false;
     movieGalleryShareServerCategory.openGridConfigModal = function () {
         $("#gridView-btn").toggleClass("active");
         var prechangeColumns = movieGalleryShareServerCategory.gridOptions.columns;
         if (movieGalleryShareServerCategory.gridOptions.columnCheckbox) {
             for (var i = 0; i < movieGalleryShareServerCategory.gridOptions.columns.length; i++) {
                 //movieGalleryShareServerCategory.gridOptions.columns[i].visible = $("#" + movieGalleryShareServerCategory.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                 var element = $("#" + movieGalleryShareServerCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                 var temp = element[0].checked;
                 movieGalleryShareServerCategory.gridOptions.columns[i].visible = temp;
             }
         }
         else {

             for (var i = 0; i < movieGalleryShareServerCategory.gridOptions.columns.length; i++) {
                 var element = $("#" + movieGalleryShareServerCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                 $("#" + movieGalleryShareServerCategory.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
             }
         }
         for (var i = 0; i < movieGalleryShareServerCategory.gridOptions.columns.length; i++) {
             console.log(movieGalleryShareServerCategory.gridOptions.columns[i].name.concat(".visible: "), movieGalleryShareServerCategory.gridOptions.columns[i].visible);
         }
         movieGalleryShareServerCategory.gridOptions.columnCheckbox = !movieGalleryShareServerCategory.gridOptions.columnCheckbox;
     }
    //Export Report 
    movieGalleryShareServerCategory.exportFile = function () {
        movieGalleryShareServerCategory.addRequested = true;
        movieGalleryShareServerCategory.gridOptions.advancedSearchData.engine.ExportFile = movieGalleryShareServerCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryShareServerCategory/exportfile', movieGalleryShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            movieGalleryShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                movieGalleryShareServerCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //movieGalleryShareServerCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    movieGalleryShareServerCategory.toggleExportForm = function () {
        movieGalleryShareServerCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        movieGalleryShareServerCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        movieGalleryShareServerCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        movieGalleryShareServerCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        movieGalleryShareServerCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleMovieGallery/movieGalleryShareServerCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    movieGalleryShareServerCategory.rowCountChanged = function () {
        if (!angular.isDefined(movieGalleryShareServerCategory.ExportFileClass.RowCount) || movieGalleryShareServerCategory.ExportFileClass.RowCount > 5000)
            movieGalleryShareServerCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    movieGalleryShareServerCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"movieGalleryShareServerCategory/count", movieGalleryShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            movieGalleryShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            movieGalleryShareServerCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            movieGalleryShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    movieGalleryShareServerCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            movieGalleryShareServerCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    movieGalleryShareServerCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (movieGalleryShareServerCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    movieGalleryShareServerCategory.onNodeToggle = function (node, expanded) {
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

    movieGalleryShareServerCategory.onSelection = function (node, selected) {
        if (!selected) {
            movieGalleryShareServerCategory.selectedItem.LinkMainImageId = null;
            movieGalleryShareServerCategory.selectedItem.previewImageSrc = null;
            return;
        }
        movieGalleryShareServerCategory.selectedItem.LinkMainImageId = node.Id;
        movieGalleryShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            movieGalleryShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
