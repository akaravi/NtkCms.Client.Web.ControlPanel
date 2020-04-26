app.controller("shopTagCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window','$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window,$state, $filter) {
    var shopTag = this;
    var edititem=false;
    //For Grid Options
    shopTag.gridOptions = {};
    shopTag.selectedItem = {};
    shopTag.attachedFiles = [];
    shopTag.attachedFile = "";
    var todayDate = moment().format();
    shopTag.DateBirth = {
        defaultDate: todayDate,
        viewTimePicker: true
    }
    shopTag.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }

    shopTag.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    shopTag.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    shopTag.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:shopTag.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:shopTag,
        useCurrentLocationZoom:12,
    }
    if (itemRecordStatus != undefined) shopTag.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    shopTag.selectedItem.ToDate = date;
    shopTag.datePickerConfig = {
        defaultDate: date
    };
    shopTag.startDate = {
        defaultDate: date
    }
    shopTag.endDate = {
        defaultDate: date
    }
    shopTag.count = 0;

//#help/ سلکتور دسته بندی در ویرایش محتوا
 shopTag.LinkCategoryTagIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryTagId',
        url: 'shopCategoryTag',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: shopTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' }
            ]
        }
    }

    //shop Grid Options
    shopTag.gridOptions = {
        columns: [
            { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: "ActionKey", displayName: "لیست مطالب", displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="shopTag.OpenContentTag(x.Id,x.Title)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }

    //Comment Grid Options
    shopTag.gridContentOptions = {
        columns: [
           { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
           { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
           { name: 'Writer', displayName: 'نویسنده', sortable: true, type: 'string' },
           { name: 'Comment', displayName: 'کامنت', sortable: true, type: 'string' },
           { name: 'ActionButtons', displayName: 'کلید عملیاتی', template: '<Button ng-if="!x.IsActivated" ng-click="shopTag.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button><Button ng-if="x.IsActivated" ng-click="shopTag.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button><Button ng-click="shopTag.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>' },
        ],
        data: {},
        multiSelect: false,
        showUserSearchPanel: false,
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "Id",
                SortType: 1,
                NeedToRunFakePagination: false,
                TotalRowData: 2000,
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }



    //For Show Category Loading Indicator
    shopTag.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show shop Loading Indicator
    shopTag.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    shopTag.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    shopTag.OpenContentTag = function (LinkTagContentId,TitleTag) {
                $state.go("index.shopcontent", {
            ContentId: LinkTagContentId,
            TitleTag:TitleTag
        });
    }
    shopTag.treeConfig.currentNode = {};
    shopTag.treeBusyIndicator = false;
    shopTag.addRequested = false;
    shopTag.showGridComment = false;
    shopTag.shopTitle = "";

    //init Function
    shopTag.init = function () {
        shopTag.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"shopCategorytag/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            shopTag.treeConfig.Items = response.ListItems;
            shopTag.treeConfig.Items = response.ListItems;
            shopTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"shoptag/getall", shopTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopTag.ListItems = response.ListItems;
            shopTag.gridOptions.fillData(shopTag.ListItems, response.resultAccess); // Sending Access as an argument
            shopTag.contentBusyIndicator.isActive = false;
            shopTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopTag.gridOptions.totalRowCount = response.TotalRowCount;
            shopTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            shopTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            shopTag.contentBusyIndicator.isActive = false;
        });

    };



    shopTag.gridContentOptions.onRowSelected = function () { }

    // Open Add Category Modal 
    shopTag.addNewCategoryModel = function () {
        shopTag.addRequested = false;
        ajax.call(cmsServerConfig.configApiServerPath+'shopCategorytag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            shopTag.selectedItem = response.Item;
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
                shopTag.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(shopTag.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/Moduleshop/shopCategorytag/add.html',
                        scope: $scope
                    });
                    shopTag.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    buttonIsPressed = false;
    // Open Edit Category Modal
    shopTag.openEditCategoryModel = function () {
        if (buttonIsPressed) return;
        shopTag.addRequested = false;
        shopTag.modalTitle = 'ویرایش';
        if (!shopTag.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        shopTag.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopCategorytag/GetOne', shopTag.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            shopTag.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            shopTag.selectedItem = response.Item;
            //Set dataForTheTree
            shopTag.selectedNode = [];
            shopTag.expandedNodes = [];
            shopTag.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                shopTag.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryTagId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(shopTag.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (shopTag.selectedItem.LinkMainImageId > 0)
                        shopTag.onSelection({ Id: shopTag.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/Moduleshop/shopCategorytag/edit.html',
                        scope: $scope
                    });
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Category
    shopTag.addNewCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopTag.categoryBusyIndicator.isActive = true;
        shopTag.addRequested = true;
        shopTag.selectedItem.LinkParentId = null;
        if (shopTag.treeConfig.currentNode != null)
            shopTag.selectedItem.LinkParentId = shopTag.treeConfig.currentNode.Id;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopCategorytag/add', shopTag.selectedItem, 'POST').success(function (response) {
            buttonIsPressed = false;
            shopTag.addRequested = false;
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                shopTag.gridOptions.advancedSearchData.engine.Filters = null;
                shopTag.gridOptions.advancedSearchData.engine.Filters = [];
                shopTag.gridOptions.reGetAll();
                shopTag.closeModal();
            }
            shopTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopTag.addRequested = false;
            shopTag.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category
    shopTag.editCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopTag.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopCategorytag/edit', shopTag.selectedItem, 'PUT').success(function (response) {
            shopTag.addRequested = true;
            //shopTag.showbusy = false;
            shopTag.treeConfig.showbusy = false;
            shopTag.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopTag.addRequested = false;
                shopTag.treeConfig.currentNode.Title = response.Item.Title;
                shopTag.closeModal();
            }
            shopTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopTag.addRequested = false;
            shopTag.categoryBusyIndicator.isActive = false;
        });
    }

    // Delete a Category
    shopTag.deleteCategory = function () {
        if (buttonIsPressed) return;
        var node = shopTag.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                shopTag.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'shopCategorytag/GetOne', node.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    shopTag.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'shopCategorytag/delete', shopTag.selectedItemForDelete, 'POST').success(function (res) {
                        shopTag.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            shopTag.gridOptions.advancedSearchData.engine.Filters = null;
                            shopTag.gridOptions.advancedSearchData.engine.Filters = [];
                            shopTag.gridOptions.fillData();
                            shopTag.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        shopTag.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    shopTag.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    shopTag.treeConfig.onNodeSelect = function () {
        var node = shopTag.treeConfig.currentNode;
        shopTag.showGridComment = false;
        shopTag.CategoryTagId = node.Id;
        shopTag.selectContent(node);
    };

    //Show Content with Category Id
    shopTag.selectContent = function (node) {
        shopTag.gridOptions.advancedSearchData.engine.Filters = null;
        shopTag.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            shopTag.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            shopTag.contentBusyIndicator.isActive = true;

            shopTag.attachedFiles = null;
            shopTag.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryTagId",
                IntValue1: node.Id,
                SearchType: 0
            }
            shopTag.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"shoptag/getall", shopTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopTag.contentBusyIndicator.isActive = false;
            shopTag.ListItems = response.ListItems;
            shopTag.gridOptions.fillData(shopTag.ListItems, response.resultAccess); // Sending Access as an argument
            shopTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopTag.gridOptions.totalRowCount = response.TotalRowCount;
            shopTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            shopTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Open Add New Content Model
    shopTag.openAddModel = function () {

        shopTag.addRequested = false;
        shopTag.modalTitle = 'اضافه کردن محتوای جدید';
        ajax.call(cmsServerConfig.configApiServerPath+'shoptag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            shopTag.selectedItem = response.Item;
            shopTag.selectedItem.LinkCategoryTagId = shopTag.CategoryTagId;
            //shopTag.clearPreviousData();
            $modal.open({
                templateUrl: 'cpanelv1/Moduleshop/shoptag/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    shopTag.openEditModel = function () {
        if (buttonIsPressed) return;
        shopTag.addRequested = false;
        shopTag.modalTitle = 'ویرایش';
        if (!shopTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shoptag/GetOne', shopTag.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            shopTag.selectedItem = response1.Item;

            $modal.open({
                templateUrl: 'cpanelv1/Moduleshop/shoptag/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    shopTag.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopTag.categoryBusyIndicator.isActive = true;
        shopTag.addRequested = true;


        ajax.call(cmsServerConfig.configApiServerPath+'shoptag/add', shopTag.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopTag.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                shopTag.ListItems.unshift(response.Item);
                shopTag.gridOptions.fillData(shopTag.ListItems);
                shopTag.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopTag.addRequested = false;
            shopTag.categoryBusyIndicator.isActive = false;
        });
    }

    //Edit Content
    shopTag.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopTag.categoryBusyIndicator.isActive = true;
        shopTag.addRequested = true;


        ajax.call(cmsServerConfig.configApiServerPath+'shoptag/edit', shopTag.selectedItem, 'PUT').success(function (response) {
            shopTag.categoryBusyIndicator.isActive = false;
            shopTag.addRequested = false;
            shopTag.treeConfig.showbusy = false;
            shopTag.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopTag.replaceItem(shopTag.selectedItem.Id, response.Item);
                shopTag.gridOptions.fillData(shopTag.ListItems);
                shopTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopTag.addRequested = false;
            shopTag.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a shop Content 
    shopTag.deleteContent = function () {
        if (!shopTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        shopTag.treeConfig.showbusy = true;
        shopTag.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                shopTag.categoryBusyIndicator.isActive = true;
                console.log(shopTag.gridOptions.selectedRow.item);
                shopTag.showbusy = true;
                shopTag.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+"shoptag/GetOne", shopTag.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    shopTag.showbusy = false;
                    shopTag.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    shopTag.selectedItemForDelete = response.Item;
                    console.log(shopTag.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"shoptag/delete", shopTag.selectedItemForDelete, 'POST').success(function (res) {
                        shopTag.categoryBusyIndicator.isActive = false;
                        shopTag.treeConfig.showbusy = false;
                        shopTag.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            shopTag.replaceItem(shopTag.selectedItemForDelete.Id);
                            shopTag.gridOptions.fillData(shopTag.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        shopTag.treeConfig.showbusy = false;
                        shopTag.showIsBusy = false;
                        shopTag.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    shopTag.treeConfig.showbusy = false;
                    shopTag.showIsBusy = false;
                    shopTag.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }


    //Replace Item OnDelete/OnEdit Grid Options
    shopTag.replaceItem = function (oldId, newItem) {
        angular.forEach(shopTag.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = shopTag.ListItems.indexOf(item);
                shopTag.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            shopTag.ListItems.unshift(newItem);
    }

    shopTag.searchData = function () {
        shopTag.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"shoptsg/getall", shopTag.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            shopTag.contentBusyIndicator.isActive = false;
            shopTag.ListItems = response.ListItems;
            shopTag.gridOptions.fillData(shopTag.ListItems);
            shopTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopTag.gridOptions.totalRowCount = response.TotalRowCount;
            shopTag.gridOptions.rowPerPage = response.RowPerPage;
            shopTag.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            shopTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    shopTag.addRequested = false;
    shopTag.closeModal = function () {
        $modalStack.dismissAll();
    };

    shopTag.showIsBusy = false;



    //For reInit Categories
    shopTag.gridOptions.reGetAll = function () {
        shopTag.init();
    };

    shopTag.isCurrentNodeEmpty = function () {
        return !angular.equals({}, shopTag.treeConfig.currentNode);
    }

    shopTag.loadFileAndFolder = function (item) {
        shopTag.treeConfig.currentNode = item;
        console.log(item);
        shopTag.treeConfig.onNodeSelect(item);
    }

    shopTag.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    shopTag.columnCheckbox = false;
    shopTag.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = shopTag.gridOptions.columns;
        if (shopTag.gridOptions.columnCheckbox) {
            for (var i = 0; i < shopTag.gridOptions.columns.length; i++) {
                var element = $("#" + shopTag.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                shopTag.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < shopTag.gridOptions.columns.length; i++) {
                var element = $("#" + shopTag.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + shopTag.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < shopTag.gridOptions.columns.length; i++) {
            console.log(shopTag.gridOptions.columns[i].name.concat(".visible: "), shopTag.gridOptions.columns[i].visible);
        }
        shopTag.gridOptions.columnCheckbox = !shopTag.gridOptions.columnCheckbox;
    }

    shopTag.deleteAttachedFile = function (index) {
        shopTag.attachedFiles.splice(index, 1);
    }

    shopTag.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !shopTag.alreadyExist(id, shopTag.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = {
                id: fId, name: fname
            };
            shopTag.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    shopTag.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    shopTag.filePickerMainImage.removeSelectedfile = function (config) {
        shopTag.filePickerMainImage.fileId = null;
        shopTag.filePickerMainImage.filename = null;
        shopTag.selectedItem.LinkMainImageId = null;

    }

    shopTag.filePickerFiles.removeSelectedfile = function (config) {
        shopTag.filePickerFiles.fileId = null;
        shopTag.filePickerFiles.filename = null;
        shopTag.selectedItem.LinkFileIds = null;
    }


    shopTag.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }

    // ----------- FilePicker Codes --------------------------------
    shopTag.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !shopTag.alreadyExist(id, shopTag.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            shopTag.attachedFiles.push(file);
            shopTag.clearfilePickers();
        }
    }

    shopTag.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                shopTag.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    shopTag.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;   //String is empty or whitespace then return
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            shopTag.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    shopTag.clearfilePickers = function () {
        shopTag.filePickerFiles.fileId = null;
        shopTag.filePickerFiles.filename = null;
    }

    shopTag.stringfyLinkFileIds = function () {
        $.each(shopTag.attachedFiles, function (i, item) {
            if (shopTag.selectedItem.LinkFileIds == "")
                shopTag.selectedItem.LinkFileIds = item.fileId;
            else
                shopTag.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    shopTag.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/Moduleshop/shopContent/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        shopTag.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            shopTag.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    shopTag.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    shopTag.whatcolor = function (progress) {
        wdth = Math.floor(progress * 100);
        if (wdth >= 0 && wdth < 30) {
            return 'danger';
        } else if (wdth >= 30 && wdth < 50) {
            return 'warning';
        } else if (wdth >= 50 && wdth < 85) {
            return 'info';
        } else {
            return 'success';
        }
    }

    shopTag.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    shopTag.replaceFile = function (name) {
        shopTag.itemClicked(null, shopTag.fileIdToDelete, "file");
        shopTag.fileTypes = 1;
        shopTag.fileIdToDelete = shopTag.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", shopTag.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    shopTag.remove(shopTag.FileList, shopTag.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                shopTag.FileItem = response3.Item;
                                shopTag.FileItem.FileName = name;
                                shopTag.FileItem.Extension = name.split('.').pop();
                                shopTag.FileItem.FileSrc = name;
                                shopTag.FileItem.LinkCategoryId = shopTag.thisCategory;
                                shopTag.saveNewFile();
                            }
                            else {
                                console.log("getting the model was not successfully returned!");
                            }
                        }).error(function (data) {
                            console.log(data);
                        });
                    }
                    else {
                        console.log("Request to api/CmsFileContent/delete was not successfully returned!");
                    }
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }
        }).error(function (data) {
            console.log(data);
        });
    }
    //save new file
    shopTag.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", shopTag.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                shopTag.FileItem = response.Item;
                shopTag.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            shopTag.showErrorIcon();
            return -1;
        });
    }

    shopTag.showSuccessIcon = function () {
    }

    shopTag.showErrorIcon = function () {

    }
    //file is exist
    shopTag.fileIsExist = function (fileName) {
        for (var i = 0; i < shopTag.FileList.length; i++) {
            if (shopTag.FileList[i].FileName == fileName) {
                shopTag.fileIdToDelete = shopTag.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    shopTag.getFileItem = function (id) {
        for (var i = 0; i < shopTag.FileList.length; i++) {
            if (shopTag.FileList[i].Id == id) {
                return shopTag.FileList[i];
            }
        }
    }

    //select file or folder
    shopTag.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            shopTag.fileTypes = 1;
            shopTag.selectedFileId = shopTag.getFileItem(index).Id;
            shopTag.selectedFileName = shopTag.getFileItem(index).FileName;
        }
        else {
            shopTag.fileTypes = 2;
            shopTag.selectedCategoryId = shopTag.getCategoryName(index).Id;
            shopTag.selectedCategoryTitle = shopTag.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        shopTag.selectedIndex = index;

    };

    //upload file
    shopTag.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (shopTag.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ shopTag.replaceFile(uploadFile.name);
                    shopTag.itemClicked(null, shopTag.fileIdToDelete, "file");
                    shopTag.fileTypes = 1;
                    shopTag.fileIdToDelete = shopTag.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                shopTag.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        shopTag.FileItem = response2.Item;
                        shopTag.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        shopTag.filePickerMainImage.filename =
                          shopTag.FileItem.FileName;
                        shopTag.filePickerMainImage.fileId =
                          response2.Item.Id;
                        shopTag.selectedItem.LinkMainImageId =
                          shopTag.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      shopTag.showErrorIcon();
                      $("#save-icon" + index).removeClass("fa-save");
                      $("#save-button" + index).removeClass("flashing-button");
                      $("#save-icon" + index).addClass("fa-remove");
                    });
                  //-----------------------------------
                }
              })
              .error(function(data) {
                console.log(data);
              });
                    //--------------------------------
                } else {
                    return;
                }
            }
            else { // File does not exists
                // Save New file
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response) {
                    shopTag.FileItem = response.Item;
                    shopTag.FileItem.FileName = uploadFile.name;
                    shopTag.FileItem.uploadName = uploadFile.uploadName;
                    shopTag.FileItem.Extension = uploadFile.name.split('.').pop();
                    shopTag.FileItem.FileSrc = uploadFile.name;
                    shopTag.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- shopTag.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", shopTag.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            shopTag.FileItem = response.Item;
                            shopTag.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            shopTag.filePickerMainImage.filename = shopTag.FileItem.FileName;
                            shopTag.filePickerMainImage.fileId = response.Item.Id;
                            shopTag.selectedItem.LinkMainImageId = shopTag.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        shopTag.showErrorIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass("flashing-button");
                        $("#save-icon" + index).addClass("fa-remove");
                    });
                    //-----------------------------------
                }).error(function (data) {
                    console.log(data);
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-remove");
                });
            }
        }
    }
    //End of Upload Modal-----------------------------------------

    //Export Report 
    shopTag.exportFile = function () {
        shopTag.gridOptions.advancedSearchData.engine.ExportFile = shopTag.ExportFileClass;
        shopTag.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shoptag/exportfile', shopTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            shopTag.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopTag.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //shopTag.closeModal();
            }
            shopTag.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    shopTag.toggleExportForm = function () {
        shopTag.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        shopTag.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        shopTag.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        shopTag.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        shopTag.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/Moduleshop/shoptag/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    shopTag.rowCountChanged = function () {
        if (!angular.isDefined(shopTag.ExportFileClass.RowCount) || shopTag.ExportFileClass.RowCount > 5000)
            shopTag.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    shopTag.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"shoptag/count", shopTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            shopTag.addRequested = false;
            rashaErManage.checkAction(response);
            shopTag.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            shopTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    //TreeControl
    shopTag.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (shopTag.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    shopTag.onNodeToggle = function (node, expanded) {
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

    shopTag.onSelection = function (node, selected) {
        if (!selected) {
            shopTag.selectedItem.LinkMainImageId = null;
            shopTag.selectedItem.previewImageSrc = null;
            return;
        }
        shopTag.selectedItem.LinkMainImageId = node.Id;
        shopTag.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            shopTag.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);