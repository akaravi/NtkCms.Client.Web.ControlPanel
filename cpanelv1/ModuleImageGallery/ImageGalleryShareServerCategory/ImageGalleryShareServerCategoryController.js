app.controller("imageGalleryShareServerCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var imageGalleryShareServerCategory = this;
    //For Grid Options
    imageGalleryShareServerCategory.gridOptions = {};
    imageGalleryShareServerCategory.selectedItem = {};
    imageGalleryShareServerCategory.attachedFiles = [];
    imageGalleryShareServerCategory.attachedFile = "";

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) imageGalleryShareServerCategory.itemRecordStatus = itemRecordStatus;

    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    imageGalleryShareServerCategory.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "imageGalleryShareServerCategoryController") {
            localStorage.setItem('AddRequest', '');
            imageGalleryShareServerCategory.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    imageGalleryShareServerCategory.LinkShareMainAdminSettingIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkServerCategoryId',
        url: 'ImageGalleryCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        showAddDialog: false,
        scope: imageGalleryShareServerCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    //imageGallery Grid Options
                      
    imageGalleryShareServerCategory.gridOptions = {
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
    imageGalleryShareServerCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show imageGallery Loading Indicator
    imageGalleryShareServerCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    imageGalleryShareServerCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    imageGalleryShareServerCategory.treeConfig.currentNode = {};
    imageGalleryShareServerCategory.treeBusyIndicator = false;

    imageGalleryShareServerCategory.addRequested = false;

    imageGalleryShareServerCategory.showGridComment = false;
    imageGalleryShareServerCategory.imageGalleryTitle = "";

    //init Function
    imageGalleryShareServerCategory.init = function () {
        imageGalleryShareServerCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = imageGalleryShareServerCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        imageGalleryShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ImageGalleryShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            imageGalleryShareServerCategory.treeConfig.Items = response.ListItems;
            imageGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        imageGalleryShareServerCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"imageGalleryShareServerCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            imageGalleryShareServerCategory.ListItems = response.ListItems;
            imageGalleryShareServerCategory.gridOptions.fillData(imageGalleryShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            imageGalleryShareServerCategory.contentBusyIndicator.isActive = false;
            imageGalleryShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            imageGalleryShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            imageGalleryShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            imageGalleryShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            imageGalleryShareServerCategory.contentBusyIndicator.isActive = false;
        });
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        imageGalleryShareServerCategory.checkRequestAddNewItemFromOtherControl(null);
    };

    // Open Add Category Modal 
    imageGalleryShareServerCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        imageGalleryShareServerCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            imageGalleryShareServerCategory.selectedItem = response.Item;
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
                imageGalleryShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(imageGalleryShareServerCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleImageGallery/ImageGalleryShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    imageGalleryShareServerCategory.addRequested = false;
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
    imageGalleryShareServerCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        imageGalleryShareServerCategory.addRequested = false;
        imageGalleryShareServerCategory.modalTitle = 'ویرایش';
        if (!imageGalleryShareServerCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        imageGalleryShareServerCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryShareMainAdminSetting/GetOne', imageGalleryShareServerCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            imageGalleryShareServerCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            imageGalleryShareServerCategory.selectedItem = response.Item;
            //Set dataForTheTree
            imageGalleryShareServerCategory.selectedNode = [];
            imageGalleryShareServerCategory.expandedNodes = [];
            imageGalleryShareServerCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                imageGalleryShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(imageGalleryShareServerCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (imageGalleryShareServerCategory.selectedItem.LinkMainImageId > 0)
                        imageGalleryShareServerCategory.onSelection({ Id: imageGalleryShareServerCategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleImageGallery/ImageGalleryShareMainAdminSetting/edit.html',
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
    imageGalleryShareServerCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        imageGalleryShareServerCategory.categoryBusyIndicator.isActive = true;
        imageGalleryShareServerCategory.addRequested = true;
        imageGalleryShareServerCategory.selectedItem.LinkParentId = null;
        if (imageGalleryShareServerCategory.treeConfig.currentNode != null)
            imageGalleryShareServerCategory.selectedItem.LinkParentId = imageGalleryShareServerCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryShareMainAdminSetting/add', imageGalleryShareServerCategory.selectedItem, 'POST').success(function (response) {
            imageGalleryShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                imageGalleryShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                imageGalleryShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                imageGalleryShareServerCategory.gridOptions.reGetAll();
                imageGalleryShareServerCategory.closeModal();
            }
            imageGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            imageGalleryShareServerCategory.addRequested = false;
            imageGalleryShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    imageGalleryShareServerCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        imageGalleryShareServerCategory.categoryBusyIndicator.isActive = true;
        imageGalleryShareServerCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryShareMainAdminSetting/edit', imageGalleryShareServerCategory.selectedItem, 'PUT').success(function (response) {
            //imageGalleryShareServerCategory.showbusy = false;
            imageGalleryShareServerCategory.treeConfig.showbusy = false;
            imageGalleryShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                imageGalleryShareServerCategory.treeConfig.currentNode.Title = response.Item.Title;
                imageGalleryShareServerCategory.closeModal();
            }
            imageGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            imageGalleryShareServerCategory.addRequested = false;
            imageGalleryShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    imageGalleryShareServerCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = imageGalleryShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                imageGalleryShareServerCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    imageGalleryShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(imageGalleryShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryShareMainAdminSetting/delete', imageGalleryShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        imageGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //imageGalleryShareServerCategory.replaceCategoryItem(imageGalleryShareServerCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            imageGalleryShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            imageGalleryShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            imageGalleryShareServerCategory.gridOptions.fillData();
                            imageGalleryShareServerCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        imageGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    imageGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    imageGalleryShareServerCategory.treeConfig.onNodeSelect = function () {
        var node = imageGalleryShareServerCategory.treeConfig.currentNode;
        imageGalleryShareServerCategory.showGridComment = false;
        imageGalleryShareServerCategory.selectContent(node);

    };
    //Show Content with Category Id
    imageGalleryShareServerCategory.selectContent = function (node) {
        imageGalleryShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
        imageGalleryShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            imageGalleryShareServerCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            imageGalleryShareServerCategory.contentBusyIndicator.isActive = true;
            imageGalleryShareServerCategory.attachedFiles = null;
            imageGalleryShareServerCategory.attachedFiles = [];
            var s = {
                PropertyName: "LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            imageGalleryShareServerCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"imageGalleryShareServerCategory/getall", imageGalleryShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            imageGalleryShareServerCategory.contentBusyIndicator.isActive = false;
            imageGalleryShareServerCategory.ListItems = response.ListItems;
            imageGalleryShareServerCategory.gridOptions.fillData(imageGalleryShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            imageGalleryShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            imageGalleryShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            imageGalleryShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            imageGalleryShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    imageGalleryShareServerCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = imageGalleryShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        imageGalleryShareServerCategory.addRequested = false;
        imageGalleryShareServerCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'imageGalleryShareServerCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            imageGalleryShareServerCategory.selectedItem = response.Item;
            imageGalleryShareServerCategory.selectedItem.LinkShareMainAdminSettingId = node.Id;
            imageGalleryShareServerCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleimageGallery/imageGalleryShareServerCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    imageGalleryShareServerCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        imageGalleryShareServerCategory.addRequested = false;
        imageGalleryShareServerCategory.modalTitle = 'ویرایش';
        if (!imageGalleryShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'imageGalleryShareServerCategory/GetOne', imageGalleryShareServerCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            imageGalleryShareServerCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleimageGallery/imageGalleryShareServerCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    imageGalleryShareServerCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        imageGalleryShareServerCategory.categoryBusyIndicator.isActive = true;
        imageGalleryShareServerCategory.addRequested = true;

        if (imageGalleryShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || imageGalleryShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'imageGalleryShareServerCategory/add', imageGalleryShareServerCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            imageGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                imageGalleryShareServerCategory.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                imageGalleryShareServerCategory.ListItems.unshift(response.Item);
                imageGalleryShareServerCategory.gridOptions.fillData(imageGalleryShareServerCategory.ListItems);
                imageGalleryShareServerCategory.closeModal();
            
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            imageGalleryShareServerCategory.addRequested = false;
            imageGalleryShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    imageGalleryShareServerCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        imageGalleryShareServerCategory.categoryBusyIndicator.isActive = true;
        imageGalleryShareServerCategory.addRequested = true;
    
        if (imageGalleryShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || imageGalleryShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'imageGalleryShareServerCategory/edit', imageGalleryShareServerCategory.selectedItem, 'PUT').success(function (response) {
            imageGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
            imageGalleryShareServerCategory.addRequested = false;
            imageGalleryShareServerCategory.treeConfig.showbusy = false;
            imageGalleryShareServerCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                imageGalleryShareServerCategory.replaceItem(imageGalleryShareServerCategory.selectedItem.Id, response.Item);
                imageGalleryShareServerCategory.gridOptions.fillData(imageGalleryShareServerCategory.ListItems);
                imageGalleryShareServerCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            imageGalleryShareServerCategory.addRequested = false;
            imageGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a imageGallery Content 
    imageGalleryShareServerCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!imageGalleryShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        imageGalleryShareServerCategory.treeConfig.showbusy = true;
        imageGalleryShareServerCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                imageGalleryShareServerCategory.categoryBusyIndicator.isActive = true;
                console.log(imageGalleryShareServerCategory.gridOptions.selectedRow.item);
                imageGalleryShareServerCategory.showbusy = true;
                imageGalleryShareServerCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"imageGalleryShareServerCategory/GetOne", imageGalleryShareServerCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    imageGalleryShareServerCategory.showbusy = false;
                    imageGalleryShareServerCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    imageGalleryShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(imageGalleryShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"imageGalleryShareServerCategory/delete", imageGalleryShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        imageGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
                        imageGalleryShareServerCategory.treeConfig.showbusy = false;
                        imageGalleryShareServerCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            imageGalleryShareServerCategory.replaceItem(imageGalleryShareServerCategory.selectedItemForDelete.Id);
                            imageGalleryShareServerCategory.gridOptions.fillData(imageGalleryShareServerCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        imageGalleryShareServerCategory.treeConfig.showbusy = false;
                        imageGalleryShareServerCategory.showIsBusy = false;
                        imageGalleryShareServerCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    imageGalleryShareServerCategory.treeConfig.showbusy = false;
                    imageGalleryShareServerCategory.showIsBusy = false;
                    imageGalleryShareServerCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }

    

   

    ////Replace Item OnDelete/OnEdit Grid Options
    imageGalleryShareServerCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(imageGalleryShareServerCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = imageGalleryShareServerCategory.ListItems.indexOf(item);
                imageGalleryShareServerCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            imageGalleryShareServerCategory.ListItems.unshift(newItem);
    }

   
    imageGalleryShareServerCategory.searchData = function () {
        imageGalleryShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"imageGalleryShareServerCategory/getall", imageGalleryShareServerCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            imageGalleryShareServerCategory.categoryBusyIndicator.isActive = false;
            imageGalleryShareServerCategory.ListItems = response.ListItems;
            imageGalleryShareServerCategory.gridOptions.fillData(imageGalleryShareServerCategory.ListItems);
            imageGalleryShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            imageGalleryShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            imageGalleryShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
            imageGalleryShareServerCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            imageGalleryShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    imageGalleryShareServerCategory.addRequested = false;
    imageGalleryShareServerCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    imageGalleryShareServerCategory.showIsBusy = false;

   

    //For reInit Categories
    imageGalleryShareServerCategory.gridOptions.reGetAll = function () {
        if (imageGalleryShareServerCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) imageGalleryShareServerCategory.searchData();
        else imageGalleryShareServerCategory.init();
    };

    imageGalleryShareServerCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, imageGalleryShareServerCategory.treeConfig.currentNode);
    }

    imageGalleryShareServerCategory.loadFileAndFolder = function (item) {
        imageGalleryShareServerCategory.treeConfig.currentNode = item;
        console.log(item);
        imageGalleryShareServerCategory.treeConfig.onNodeSelect(item);
    }

    imageGalleryShareServerCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            imageGalleryShareServerCategory.focus = true;
        });
    };
    imageGalleryShareServerCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            imageGalleryShareServerCategory.focus1 = true;
        });
    };

     imageGalleryShareServerCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

  
   // End of Upload Modal-----------------------------------------
     imageGalleryShareServerCategory.columnCheckbox = false;
     imageGalleryShareServerCategory.openGridConfigModal = function () {
         $("#gridView-btn").toggleClass("active");
         var prechangeColumns = imageGalleryShareServerCategory.gridOptions.columns;
         if (imageGalleryShareServerCategory.gridOptions.columnCheckbox) {
             for (var i = 0; i < imageGalleryShareServerCategory.gridOptions.columns.length; i++) {
                 //imageGalleryShareServerCategory.gridOptions.columns[i].visible = $("#" + imageGalleryShareServerCategory.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                 var element = $("#" + imageGalleryShareServerCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                 var temp = element[0].checked;
                 imageGalleryShareServerCategory.gridOptions.columns[i].visible = temp;
             }
         }
         else {

             for (var i = 0; i < imageGalleryShareServerCategory.gridOptions.columns.length; i++) {
                 var element = $("#" + imageGalleryShareServerCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                 $("#" + imageGalleryShareServerCategory.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
             }
         }
         for (var i = 0; i < imageGalleryShareServerCategory.gridOptions.columns.length; i++) {
             console.log(imageGalleryShareServerCategory.gridOptions.columns[i].name.concat(".visible: "), imageGalleryShareServerCategory.gridOptions.columns[i].visible);
         }
         imageGalleryShareServerCategory.gridOptions.columnCheckbox = !imageGalleryShareServerCategory.gridOptions.columnCheckbox;
     }
    //Export Report 
    imageGalleryShareServerCategory.exportFile = function () {
        imageGalleryShareServerCategory.addRequested = true;
        imageGalleryShareServerCategory.gridOptions.advancedSearchData.engine.ExportFile = imageGalleryShareServerCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'imageGalleryShareServerCategory/exportfile', imageGalleryShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            imageGalleryShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                imageGalleryShareServerCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //imageGalleryShareServerCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    imageGalleryShareServerCategory.toggleExportForm = function () {
        imageGalleryShareServerCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        imageGalleryShareServerCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        imageGalleryShareServerCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        imageGalleryShareServerCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        imageGalleryShareServerCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleImageGallery/imageGalleryShareServerCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    imageGalleryShareServerCategory.rowCountChanged = function () {
        if (!angular.isDefined(imageGalleryShareServerCategory.ExportFileClass.RowCount) || imageGalleryShareServerCategory.ExportFileClass.RowCount > 5000)
            imageGalleryShareServerCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    imageGalleryShareServerCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"imageGalleryShareServerCategory/count", imageGalleryShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            imageGalleryShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            imageGalleryShareServerCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            imageGalleryShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    imageGalleryShareServerCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            imageGalleryShareServerCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    imageGalleryShareServerCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (imageGalleryShareServerCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    imageGalleryShareServerCategory.onNodeToggle = function (node, expanded) {
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

    imageGalleryShareServerCategory.onSelection = function (node, selected) {
        if (!selected) {
            imageGalleryShareServerCategory.selectedItem.LinkMainImageId = null;
            imageGalleryShareServerCategory.selectedItem.previewImageSrc = null;
            return;
        }
        imageGalleryShareServerCategory.selectedItem.LinkMainImageId = node.Id;
        imageGalleryShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            imageGalleryShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
