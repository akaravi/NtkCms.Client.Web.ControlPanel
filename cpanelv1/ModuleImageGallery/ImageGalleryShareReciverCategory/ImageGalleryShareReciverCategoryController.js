app.controller("imageGalleryShareReciverCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var imageGalleryShareReciverCategory = this;
    //For Grid Options
    imageGalleryShareReciverCategory.gridOptions = {};
    imageGalleryShareReciverCategory.selectedItem = {};
    imageGalleryShareReciverCategory.attachedFiles = [];
    imageGalleryShareReciverCategory.attachedFile = "";

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    var todayDate = moment().format();

    imageGalleryShareReciverCategory.ToDate = {
        defaultDate: todayDate
    }
    imageGalleryShareReciverCategory.FromDate = {
        defaultDate: todayDate
    }
    imageGalleryShareReciverCategory.testDate = moment().format();
    if (itemRecordStatus != undefined) imageGalleryShareReciverCategory.itemRecordStatus = itemRecordStatus;

    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    imageGalleryShareReciverCategory.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "imageGalleryShareReciverCategoryController") {
            localStorage.setItem('AddRequest', '');
            imageGalleryShareReciverCategory.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }

    imageGalleryShareReciverCategory.LinkShareReciverCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareReciverCategoryId',
        url: 'ImageGalleryCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        showAddDialog: false,
        scope: imageGalleryShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    //imageGallery Grid Options
    imageGalleryShareReciverCategory.LinkShareServerCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareServerCategoryId',
        url: 'ImageGalleryShareServerCategory',
        Action:'GetAllOtherSite',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        showAddDialog: false,
        scope: imageGalleryShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    imageGalleryShareReciverCategory.gridOptions = {
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
    imageGalleryShareReciverCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show imageGallery Loading Indicator
    imageGalleryShareReciverCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    imageGalleryShareReciverCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    imageGalleryShareReciverCategory.treeConfig.currentNode = {};
    imageGalleryShareReciverCategory.treeBusyIndicator = false;

    imageGalleryShareReciverCategory.addRequested = false;

    imageGalleryShareReciverCategory.showGridComment = false;
    imageGalleryShareReciverCategory.imageGalleryTitle = "";

    //init Function
    imageGalleryShareReciverCategory.init = function () {
        imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = imageGalleryShareReciverCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ImageGalleryShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            imageGalleryShareReciverCategory.treeConfig.Items = response.ListItems;
            imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        imageGalleryShareReciverCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"imageGalleryShareReciverCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            imageGalleryShareReciverCategory.ListItems = response.ListItems;
            imageGalleryShareReciverCategory.gridOptions.fillData(imageGalleryShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            imageGalleryShareReciverCategory.contentBusyIndicator.isActive = false;
            imageGalleryShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            imageGalleryShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            imageGalleryShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            imageGalleryShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            imageGalleryShareReciverCategory.contentBusyIndicator.isActive = false;
        });
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        imageGalleryShareReciverCategory.checkRequestAddNewItemFromOtherControl(null);

    };

    // Open Add Category Modal 
    imageGalleryShareReciverCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        imageGalleryShareReciverCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            imageGalleryShareReciverCategory.selectedItem = response.Item;
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
                imageGalleryShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(imageGalleryShareReciverCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleImageGallery/ImageGalleryShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    imageGalleryShareReciverCategory.addRequested = false;
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
    imageGalleryShareReciverCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        imageGalleryShareReciverCategory.addRequested = false;
        imageGalleryShareReciverCategory.modalTitle = 'ویرایش';
        if (!imageGalleryShareReciverCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        imageGalleryShareReciverCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryShareMainAdminSetting/GetOne', imageGalleryShareReciverCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            imageGalleryShareReciverCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            imageGalleryShareReciverCategory.selectedItem = response.Item;
            //Set dataForTheTree
            imageGalleryShareReciverCategory.selectedNode = [];
            imageGalleryShareReciverCategory.expandedNodes = [];
            imageGalleryShareReciverCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                imageGalleryShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(imageGalleryShareReciverCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (imageGalleryShareReciverCategory.selectedItem.LinkMainImageId > 0)
                        imageGalleryShareReciverCategory.onSelection({ Id: imageGalleryShareReciverCategory.selectedItem.LinkMainImageId }, true);
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
    imageGalleryShareReciverCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;
        imageGalleryShareReciverCategory.addRequested = true;
        imageGalleryShareReciverCategory.selectedItem.LinkParentId = null;
        if (imageGalleryShareReciverCategory.treeConfig.currentNode != null)
            imageGalleryShareReciverCategory.selectedItem.LinkParentId = imageGalleryShareReciverCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryShareMainAdminSetting/add', imageGalleryShareReciverCategory.selectedItem, 'POST').success(function (response) {
            imageGalleryShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                imageGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                imageGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                imageGalleryShareReciverCategory.gridOptions.reGetAll();
                imageGalleryShareReciverCategory.closeModal();
            }
            imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            imageGalleryShareReciverCategory.addRequested = false;
            imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    imageGalleryShareReciverCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;
        imageGalleryShareReciverCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryShareMainAdminSetting/edit', imageGalleryShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            //imageGalleryShareReciverCategory.showbusy = false;
            imageGalleryShareReciverCategory.treeConfig.showbusy = false;
            imageGalleryShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                imageGalleryShareReciverCategory.treeConfig.currentNode.Title = response.Item.Title;
                imageGalleryShareReciverCategory.closeModal();
            }
            imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            imageGalleryShareReciverCategory.addRequested = false;
            imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    imageGalleryShareReciverCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = imageGalleryShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    imageGalleryShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(imageGalleryShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryShareMainAdminSetting/delete', imageGalleryShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //imageGalleryShareReciverCategory.replaceCategoryItem(imageGalleryShareReciverCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            imageGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            imageGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            imageGalleryShareReciverCategory.gridOptions.fillData();
                            imageGalleryShareReciverCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    imageGalleryShareReciverCategory.treeConfig.onNodeSelect = function () {
        var node = imageGalleryShareReciverCategory.treeConfig.currentNode;
        imageGalleryShareReciverCategory.showGridComment = false;
        imageGalleryShareReciverCategory.selectContent(node);

    };
    //Show Content with Category Id
    imageGalleryShareReciverCategory.selectContent = function (node) {
        imageGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
        imageGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            imageGalleryShareReciverCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            imageGalleryShareReciverCategory.contentBusyIndicator.isActive = true;
            imageGalleryShareReciverCategory.attachedFiles = null;
            imageGalleryShareReciverCategory.attachedFiles = [];
            var s = {
                PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            imageGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"imageGalleryShareReciverCategory/getall", imageGalleryShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            imageGalleryShareReciverCategory.contentBusyIndicator.isActive = false;
            imageGalleryShareReciverCategory.ListItems = response.ListItems;
            imageGalleryShareReciverCategory.gridOptions.fillData(imageGalleryShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            imageGalleryShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            imageGalleryShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            imageGalleryShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            imageGalleryShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    imageGalleryShareReciverCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = imageGalleryShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        imageGalleryShareReciverCategory.addRequested = false;
        imageGalleryShareReciverCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'imageGalleryShareReciverCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            imageGalleryShareReciverCategory.selectedItem = response.Item;
            imageGalleryShareReciverCategory.selectedItem.LinkShareServerCategoryId = node.Id;
            imageGalleryShareReciverCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleimageGallery/imageGalleryShareReciverCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    imageGalleryShareReciverCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        imageGalleryShareReciverCategory.addRequested = false;
        imageGalleryShareReciverCategory.modalTitle = 'ویرایش';
        if (!imageGalleryShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'imageGalleryShareReciverCategory/GetOne', imageGalleryShareReciverCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            imageGalleryShareReciverCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleimageGallery/imageGalleryShareReciverCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    imageGalleryShareReciverCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;
        imageGalleryShareReciverCategory.addRequested = true;

        if (imageGalleryShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || imageGalleryShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'imageGalleryShareReciverCategory/add', imageGalleryShareReciverCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                imageGalleryShareReciverCategory.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                imageGalleryShareReciverCategory.ListItems.unshift(response.Item);
                imageGalleryShareReciverCategory.gridOptions.fillData(imageGalleryShareReciverCategory.ListItems);
                imageGalleryShareReciverCategory.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            imageGalleryShareReciverCategory.addRequested = false;
            imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    imageGalleryShareReciverCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;
        imageGalleryShareReciverCategory.addRequested = true;

        if (imageGalleryShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || imageGalleryShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'imageGalleryShareReciverCategory/edit', imageGalleryShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
            imageGalleryShareReciverCategory.addRequested = false;
            imageGalleryShareReciverCategory.treeConfig.showbusy = false;
            imageGalleryShareReciverCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                imageGalleryShareReciverCategory.replaceItem(imageGalleryShareReciverCategory.selectedItem.Id, response.Item);
                imageGalleryShareReciverCategory.gridOptions.fillData(imageGalleryShareReciverCategory.ListItems);
                imageGalleryShareReciverCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            imageGalleryShareReciverCategory.addRequested = false;
            imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a imageGallery Content 
    imageGalleryShareReciverCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!imageGalleryShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        imageGalleryShareReciverCategory.treeConfig.showbusy = true;
        imageGalleryShareReciverCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;
                console.log(imageGalleryShareReciverCategory.gridOptions.selectedRow.item);
                imageGalleryShareReciverCategory.showbusy = true;
                imageGalleryShareReciverCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"imageGalleryShareReciverCategory/GetOne", imageGalleryShareReciverCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    imageGalleryShareReciverCategory.showbusy = false;
                    imageGalleryShareReciverCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    imageGalleryShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(imageGalleryShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"imageGalleryShareReciverCategory/delete", imageGalleryShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
                        imageGalleryShareReciverCategory.treeConfig.showbusy = false;
                        imageGalleryShareReciverCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            imageGalleryShareReciverCategory.replaceItem(imageGalleryShareReciverCategory.selectedItemForDelete.Id);
                            imageGalleryShareReciverCategory.gridOptions.fillData(imageGalleryShareReciverCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        imageGalleryShareReciverCategory.treeConfig.showbusy = false;
                        imageGalleryShareReciverCategory.showIsBusy = false;
                        imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    imageGalleryShareReciverCategory.treeConfig.showbusy = false;
                    imageGalleryShareReciverCategory.showIsBusy = false;
                    imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }





    ////Replace Item OnDelete/OnEdit Grid Options
    imageGalleryShareReciverCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(imageGalleryShareReciverCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = imageGalleryShareReciverCategory.ListItems.indexOf(item);
                imageGalleryShareReciverCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            imageGalleryShareReciverCategory.ListItems.unshift(newItem);
    }


    imageGalleryShareReciverCategory.searchData = function () {
        imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"imageGalleryShareReciverCategory/getall", imageGalleryShareReciverCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            imageGalleryShareReciverCategory.categoryBusyIndicator.isActive = false;
            imageGalleryShareReciverCategory.ListItems = response.ListItems;
            imageGalleryShareReciverCategory.gridOptions.fillData(imageGalleryShareReciverCategory.ListItems);
            imageGalleryShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            imageGalleryShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            imageGalleryShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
            imageGalleryShareReciverCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            imageGalleryShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    imageGalleryShareReciverCategory.addRequested = false;
    imageGalleryShareReciverCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    imageGalleryShareReciverCategory.showIsBusy = false;



    //For reInit Categories
    imageGalleryShareReciverCategory.gridOptions.reGetAll = function () {
        if (imageGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) imageGalleryShareReciverCategory.searchData();
        else imageGalleryShareReciverCategory.init();
    };

    imageGalleryShareReciverCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, imageGalleryShareReciverCategory.treeConfig.currentNode);
    }

    imageGalleryShareReciverCategory.loadFileAndFolder = function (item) {
        imageGalleryShareReciverCategory.treeConfig.currentNode = item;
        console.log(item);
        imageGalleryShareReciverCategory.treeConfig.onNodeSelect(item);
    }

    imageGalleryShareReciverCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            imageGalleryShareReciverCategory.focus = true;
        });
    };
    imageGalleryShareReciverCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            imageGalleryShareReciverCategory.focus1 = true;
        });
    };

    imageGalleryShareReciverCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }


    // End of Upload Modal-----------------------------------------
    imageGalleryShareReciverCategory.columnCheckbox = false;
    imageGalleryShareReciverCategory.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = imageGalleryShareReciverCategory.gridOptions.columns;
        if (imageGalleryShareReciverCategory.gridOptions.columnCheckbox) {
            for (var i = 0; i < imageGalleryShareReciverCategory.gridOptions.columns.length; i++) {
                //imageGalleryShareReciverCategory.gridOptions.columns[i].visible = $("#" + imageGalleryShareReciverCategory.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + imageGalleryShareReciverCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                imageGalleryShareReciverCategory.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < imageGalleryShareReciverCategory.gridOptions.columns.length; i++) {
                var element = $("#" + imageGalleryShareReciverCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + imageGalleryShareReciverCategory.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < imageGalleryShareReciverCategory.gridOptions.columns.length; i++) {
            console.log(imageGalleryShareReciverCategory.gridOptions.columns[i].name.concat(".visible: "), imageGalleryShareReciverCategory.gridOptions.columns[i].visible);
        }
        imageGalleryShareReciverCategory.gridOptions.columnCheckbox = !imageGalleryShareReciverCategory.gridOptions.columnCheckbox;
    }
    //Export Report 
    imageGalleryShareReciverCategory.exportFile = function () {
        imageGalleryShareReciverCategory.addRequested = true;
        imageGalleryShareReciverCategory.gridOptions.advancedSearchData.engine.ExportFile = imageGalleryShareReciverCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'imageGalleryShareReciverCategory/exportfile', imageGalleryShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            imageGalleryShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                imageGalleryShareReciverCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //imageGalleryShareReciverCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    imageGalleryShareReciverCategory.toggleExportForm = function () {
        imageGalleryShareReciverCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        imageGalleryShareReciverCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        imageGalleryShareReciverCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        imageGalleryShareReciverCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        imageGalleryShareReciverCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleImageGallery/imageGalleryShareReciverCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    imageGalleryShareReciverCategory.rowCountChanged = function () {
        if (!angular.isDefined(imageGalleryShareReciverCategory.ExportFileClass.RowCount) || imageGalleryShareReciverCategory.ExportFileClass.RowCount > 5000)
            imageGalleryShareReciverCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    imageGalleryShareReciverCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"imageGalleryShareReciverCategory/count", imageGalleryShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            imageGalleryShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            imageGalleryShareReciverCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            imageGalleryShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    imageGalleryShareReciverCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            imageGalleryShareReciverCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    imageGalleryShareReciverCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (imageGalleryShareReciverCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    imageGalleryShareReciverCategory.onNodeToggle = function (node, expanded) {
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

    imageGalleryShareReciverCategory.onSelection = function (node, selected) {
        if (!selected) {
            imageGalleryShareReciverCategory.selectedItem.LinkMainImageId = null;
            imageGalleryShareReciverCategory.selectedItem.previewImageSrc = null;
            return;
        }
        imageGalleryShareReciverCategory.selectedItem.LinkMainImageId = node.Id;
        imageGalleryShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            imageGalleryShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
