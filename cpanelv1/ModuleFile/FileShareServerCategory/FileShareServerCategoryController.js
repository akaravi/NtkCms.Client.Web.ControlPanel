app.controller("fileShareServerCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$rootScope', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $rootScope, $filter) {
    var fileShareServerCategory = this;
    //For Grid Options
    fileShareServerCategory.gridOptions = {};
    fileShareServerCategory.selectedItem = {};
    fileShareServerCategory.attachedFiles = [];
    fileShareServerCategory.attachedFile = "";
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    fileShareServerCategory.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "fileShareServerCategoryController") {
            localStorage.setItem('AddRequest', '');
            fileShareServerCategory.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) fileShareServerCategory.itemRecordStatus = itemRecordStatus;

    
    fileShareServerCategory.LinkShareMainAdminSettingIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkServerCategoryId',
        url: 'CmsFileCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: fileShareServerCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    //file Grid Options
                      
    fileShareServerCategory.gridOptions = {
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
    fileShareServerCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show file Loading Indicator
    fileShareServerCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    fileShareServerCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    fileShareServerCategory.treeConfig.currentNode = {};
    fileShareServerCategory.treeBusyIndicator = false;

    fileShareServerCategory.addRequested = false;

    fileShareServerCategory.showGridComment = false;
    fileShareServerCategory.fileTitle = "";

    //init Function
    fileShareServerCategory.init = function () {
        fileShareServerCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = fileShareServerCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        fileShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"FileShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            fileShareServerCategory.treeConfig.Items = response.ListItems;
            fileShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        fileShareServerCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"FileShareServerCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            fileShareServerCategory.ListItems = response.ListItems;
            fileShareServerCategory.gridOptions.fillData(fileShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            fileShareServerCategory.contentBusyIndicator.isActive = false;
            fileShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            fileShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            fileShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            fileShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            fileShareServerCategory.contentBusyIndicator.isActive = false;
            });
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        fileShareServerCategory.checkRequestAddNewItemFromOtherControl(null);
  
    };

    // Open Add Category Modal 
    fileShareServerCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        fileShareServerCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'FileShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            fileShareServerCategory.selectedItem = response.Item;
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
                fileShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(fileShareServerCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleFile/FileShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    fileShareServerCategory.addRequested = false;
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
    fileShareServerCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        fileShareServerCategory.addRequested = false;
        fileShareServerCategory.modalTitle = 'ویرایش';
        if (!fileShareServerCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        fileShareServerCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'FileShareMainAdminSetting/GetOne', fileShareServerCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            fileShareServerCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            fileShareServerCategory.selectedItem = response.Item;
            //Set dataForTheTree
            fileShareServerCategory.selectedNode = [];
            fileShareServerCategory.expandedNodes = [];
            fileShareServerCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                fileShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(fileShareServerCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (fileShareServerCategory.selectedItem.LinkMainImageId > 0)
                        fileShareServerCategory.onSelection({ Id: fileShareServerCategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleFile/FileShareMainAdminSetting/edit.html',
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
    fileShareServerCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        fileShareServerCategory.categoryBusyIndicator.isActive = true;
        fileShareServerCategory.addRequested = true;
        fileShareServerCategory.selectedItem.LinkParentId = null;
        if (fileShareServerCategory.treeConfig.currentNode != null)
            fileShareServerCategory.selectedItem.LinkParentId = fileShareServerCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'FileShareMainAdminSetting/add', fileShareServerCategory.selectedItem, 'POST').success(function (response) {
            fileShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                fileShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                fileShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                fileShareServerCategory.gridOptions.reGetAll();
                fileShareServerCategory.closeModal();
            }
            fileShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            fileShareServerCategory.addRequested = false;
            fileShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    fileShareServerCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        fileShareServerCategory.categoryBusyIndicator.isActive = true;
        fileShareServerCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'FileShareMainAdminSetting/edit', fileShareServerCategory.selectedItem, 'PUT').success(function (response) {
            //fileShareServerCategory.showbusy = false;
            fileShareServerCategory.treeConfig.showbusy = false;
            fileShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                fileShareServerCategory.treeConfig.currentNode.Title = response.Item.Title;
                fileShareServerCategory.closeModal();
            }
            fileShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            fileShareServerCategory.addRequested = false;
            fileShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    fileShareServerCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = fileShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                fileShareServerCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'FileShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    fileShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(fileShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'FileShareMainAdminSetting/delete', fileShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        fileShareServerCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //fileShareServerCategory.replaceCategoryItem(fileShareServerCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            fileShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            fileShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            fileShareServerCategory.gridOptions.fillData();
                            fileShareServerCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        fileShareServerCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    fileShareServerCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    fileShareServerCategory.treeConfig.onNodeSelect = function () {
        var node = fileShareServerCategory.treeConfig.currentNode;
        fileShareServerCategory.showGridComment = false;
        fileShareServerCategory.selectContent(node);

    };
    //Show Content with Category Id
    fileShareServerCategory.selectContent = function (node) {
        fileShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
        fileShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            fileShareServerCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            fileShareServerCategory.contentBusyIndicator.isActive = true;
            fileShareServerCategory.attachedFiles = null;
            fileShareServerCategory.attachedFiles = [];
            var s = {
                PropertyName: "LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            fileShareServerCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"FileShareServerCategory/getall", fileShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            fileShareServerCategory.contentBusyIndicator.isActive = false;
            fileShareServerCategory.ListItems = response.ListItems;
            fileShareServerCategory.gridOptions.fillData(fileShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            fileShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            fileShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            fileShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            fileShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    fileShareServerCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = fileShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        fileShareServerCategory.addRequested = false;
        fileShareServerCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'FileShareServerCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            fileShareServerCategory.selectedItem = response.Item;
            fileShareServerCategory.selectedItem.LinkShareMainAdminSettingId = node.Id;
            fileShareServerCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/Modulefile/fileShareServerCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    fileShareServerCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        fileShareServerCategory.addRequested = false;
        fileShareServerCategory.modalTitle = 'ویرایش';
        if (!fileShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'FileShareServerCategory/GetOne', fileShareServerCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            fileShareServerCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulefile/fileShareServerCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    fileShareServerCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        fileShareServerCategory.categoryBusyIndicator.isActive = true;
        fileShareServerCategory.addRequested = true;

        if (fileShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || fileShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'FileShareServerCategory/add', fileShareServerCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            fileShareServerCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                fileShareServerCategory.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                fileShareServerCategory.ListItems.unshift(response.Item);
                fileShareServerCategory.gridOptions.fillData(fileShareServerCategory.ListItems);
                fileShareServerCategory.closeModal();
            
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            fileShareServerCategory.addRequested = false;
            fileShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    fileShareServerCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        fileShareServerCategory.categoryBusyIndicator.isActive = true;
        fileShareServerCategory.addRequested = true;
    
        if (fileShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || fileShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'FileShareServerCategory/edit', fileShareServerCategory.selectedItem, 'PUT').success(function (response) {
            fileShareServerCategory.categoryBusyIndicator.isActive = false;
            fileShareServerCategory.addRequested = false;
            fileShareServerCategory.treeConfig.showbusy = false;
            fileShareServerCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                fileShareServerCategory.replaceItem(fileShareServerCategory.selectedItem.Id, response.Item);
                fileShareServerCategory.gridOptions.fillData(fileShareServerCategory.ListItems);
                fileShareServerCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            fileShareServerCategory.addRequested = false;
            fileShareServerCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a file Content 
    fileShareServerCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!fileShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        fileShareServerCategory.treeConfig.showbusy = true;
        fileShareServerCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                fileShareServerCategory.categoryBusyIndicator.isActive = true;
                console.log(fileShareServerCategory.gridOptions.selectedRow.item);
                fileShareServerCategory.showbusy = true;
                fileShareServerCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"FileShareServerCategory/GetOne", fileShareServerCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    fileShareServerCategory.showbusy = false;
                    fileShareServerCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    fileShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(fileShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"FileShareServerCategory/delete", fileShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        fileShareServerCategory.categoryBusyIndicator.isActive = false;
                        fileShareServerCategory.treeConfig.showbusy = false;
                        fileShareServerCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            fileShareServerCategory.replaceItem(fileShareServerCategory.selectedItemForDelete.Id);
                            fileShareServerCategory.gridOptions.fillData(fileShareServerCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        fileShareServerCategory.treeConfig.showbusy = false;
                        fileShareServerCategory.showIsBusy = false;
                        fileShareServerCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    fileShareServerCategory.treeConfig.showbusy = false;
                    fileShareServerCategory.showIsBusy = false;
                    fileShareServerCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }

    

   

    ////Replace Item OnDelete/OnEdit Grid Options
    fileShareServerCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(fileShareServerCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = fileShareServerCategory.ListItems.indexOf(item);
                fileShareServerCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            fileShareServerCategory.ListItems.unshift(newItem);
    }

   
    fileShareServerCategory.searchData = function () {
        fileShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"FileShareServerCategory/getall", fileShareServerCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            fileShareServerCategory.categoryBusyIndicator.isActive = false;
            fileShareServerCategory.ListItems = response.ListItems;
            fileShareServerCategory.gridOptions.fillData(fileShareServerCategory.ListItems);
            fileShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            fileShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            fileShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
            fileShareServerCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            fileShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    fileShareServerCategory.addRequested = false;
    fileShareServerCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    fileShareServerCategory.showIsBusy = false;

   

    //For reInit Categories
    fileShareServerCategory.gridOptions.reGetAll = function () {
        if (fileShareServerCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) fileShareServerCategory.searchData();
        else fileShareServerCategory.init();
    };

    fileShareServerCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, fileShareServerCategory.treeConfig.currentNode);
    }

    fileShareServerCategory.loadFileAndFolder = function (item) {
        fileShareServerCategory.treeConfig.currentNode = item;
        console.log(item);
        fileShareServerCategory.treeConfig.onNodeSelect(item);
    }

    fileShareServerCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            fileShareServerCategory.focus = true;
        });
    };
    fileShareServerCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            fileShareServerCategory.focus1 = true;
        });
    };

     fileShareServerCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

  
   // End of Upload Modal-----------------------------------------
     fileShareServerCategory.columnCheckbox = false;
     fileShareServerCategory.openGridConfigModal = function () {
         $("#gridView-btn").toggleClass("active");
         if (fileShareServerCategory.gridOptions.columnCheckbox) {
             for (var i = 0; i < fileShareServerCategory.gridOptions.columns.length; i++) {
                 //fileShareServerCategory.gridOptions.columns[i].visible = $("#" + fileShareServerCategory.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                 var element = $("#" + fileShareServerCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                 //var temp = element[0].checked;
                 fileShareServerCategory.gridOptions.columns[i].visible = element[0].checked;
             }
         }
         else {
             var prechangeColumns = fileShareServerCategory.gridOptions.columns;
             for (var i = 0; i < fileShareServerCategory.gridOptions.columns.length; i++) {
                 fileShareServerCategory.gridOptions.columns[i].visible = true;
                 var element = $("#" + fileShareServerCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                 $("#" + fileShareServerCategory.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
             }
         }
         for (var i = 0; i < fileShareServerCategory.gridOptions.columns.length; i++) {
             console.log(fileShareServerCategory.gridOptions.columns[i].name.concat(".visible: "), fileShareServerCategory.gridOptions.columns[i].visible);
         }
         fileShareServerCategory.gridOptions.columnCheckbox = !fileShareServerCategory.gridOptions.columnCheckbox;
     }
    //Export Report 
    fileShareServerCategory.exportFile = function () {
        fileShareServerCategory.addRequested = true;
        fileShareServerCategory.gridOptions.advancedSearchData.engine.ExportFile = fileShareServerCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'FileShareServerCategory/exportfile', fileShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            fileShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                fileShareServerCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //fileShareServerCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    fileShareServerCategory.toggleExportForm = function () {
        fileShareServerCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        fileShareServerCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        fileShareServerCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        fileShareServerCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        fileShareServerCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleFile/fileShareServerCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    fileShareServerCategory.rowCountChanged = function () {
        if (!angular.isDefined(fileShareServerCategory.ExportFileClass.RowCount) || fileShareServerCategory.ExportFileClass.RowCount > 5000)
            fileShareServerCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    fileShareServerCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileShareServerCategory/count", fileShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            fileShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            fileShareServerCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            fileShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    fileShareServerCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            fileShareServerCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    fileShareServerCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (fileShareServerCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    fileShareServerCategory.onNodeToggle = function (node, expanded) {
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

    fileShareServerCategory.onSelection = function (node, selected) {
        if (!selected) {
            fileShareServerCategory.selectedItem.LinkMainImageId = null;
            fileShareServerCategory.selectedItem.previewImageSrc = null;
            return;
        }
        fileShareServerCategory.selectedItem.LinkMainImageId = node.Id;
        fileShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            fileShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
