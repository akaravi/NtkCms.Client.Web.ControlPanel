app.controller("productTagCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window','$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window,$state, $filter) {
    var productTag = this;
    var edititem=false;
    //For Grid Options
    productTag.gridOptions = {};
    productTag.selectedItem = {};
    productTag.attachedFiles = [];
    productTag.attachedFile = "";
    var todayDate = moment().format();
    productTag.DateBirth = {
        defaultDate: todayDate,
        viewTimePicker: true
    }
    productTag.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }

    productTag.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    productTag.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    productTag.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:productTag.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:productTag,
        useCurrentLocationZoom:12,
    }
    if (itemRecordStatus != undefined) productTag.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    productTag.selectedItem.ToDate = date;
    productTag.datePickerConfig = {
        defaultDate: date
    };
    productTag.startDate = {
        defaultDate: date
    }
    productTag.endDate = {
        defaultDate: date
    }
    productTag.count = 0;

//#help/ سلکتور دسته بندی در ویرایش محتوا
 productTag.LinkCategoryTagIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryTagId',
        url: 'productCategoryTag',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: productTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' }
            ]
        }
    }

    //product Grid Options
    productTag.gridOptions = {
        columns: [
            { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: "ActionKey", displayName: "لیست مطالب", displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="productTag.OpenContentTag(x.Id,x.Title)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }

    //Comment Grid Options
    productTag.gridContentOptions = {
        columns: [
           { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
           { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
           { name: 'Writer', displayName: 'نویسنده', sortable: true, type: 'string' },
           { name: 'Comment', displayName: 'کامنت', sortable: true, type: 'string' },
           { name: 'ActionButtons', displayName: 'کلید عملیاتی', template: '<Button ng-if="!x.IsActivated" ng-click="productTag.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button><Button ng-if="x.IsActivated" ng-click="productTag.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button><Button ng-click="productTag.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>' },
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
    productTag.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show product Loading Indicator
    productTag.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    productTag.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    productTag.OpenContentTag = function (LinkTagContentId,TitleTag) {
                $state.go("index.productcontent", {
            ContentId: LinkTagContentId,
            TitleTag:TitleTag
        });
    }
    productTag.treeConfig.currentNode = {};
    productTag.treeBusyIndicator = false;
    productTag.addRequested = false;
    productTag.showGridComment = false;
    productTag.productTitle = "";

    //init Function
    productTag.init = function () {
        productTag.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"productCategorytag/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            productTag.treeConfig.Items = response.ListItems;
            productTag.treeConfig.Items = response.ListItems;
            productTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"producttag/getall", productTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            productTag.ListItems = response.ListItems;
            productTag.gridOptions.fillData(productTag.ListItems, response.resultAccess); // Sending Access as an argument
            productTag.contentBusyIndicator.isActive = false;
            productTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            productTag.gridOptions.totalRowCount = response.TotalRowCount;
            productTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            productTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            productTag.contentBusyIndicator.isActive = false;
        });

    };



    productTag.gridContentOptions.onRowSelected = function () { }

    // Open Add Category Modal 
    productTag.addNewCategoryModel = function () {
        productTag.addRequested = false;
        ajax.call(cmsServerConfig.configApiServerPath+'productCategorytag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            productTag.selectedItem = response.Item;
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
                productTag.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(productTag.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/Moduleproduct/productCategorytag/add.html',
                        scope: $scope
                    });
                    productTag.addRequested = false;
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
    productTag.openEditCategoryModel = function () {
        if (buttonIsPressed) return;
        productTag.addRequested = false;
        productTag.modalTitle = 'ویرایش';
        if (!productTag.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        productTag.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'productCategorytag/GetOne', productTag.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            productTag.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            productTag.selectedItem = response.Item;
            //Set dataForTheTree
            productTag.selectedNode = [];
            productTag.expandedNodes = [];
            productTag.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                productTag.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryTagId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(productTag.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (productTag.selectedItem.LinkMainImageId > 0)
                        productTag.onSelection({ Id: productTag.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/Moduleproduct/productCategorytag/edit.html',
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
    productTag.addNewCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        productTag.categoryBusyIndicator.isActive = true;
        productTag.addRequested = true;
        productTag.selectedItem.LinkParentId = null;
        if (productTag.treeConfig.currentNode != null)
            productTag.selectedItem.LinkParentId = productTag.treeConfig.currentNode.Id;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'productCategorytag/add', productTag.selectedItem, 'POST').success(function (response) {
            buttonIsPressed = false;
            productTag.addRequested = false;
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                productTag.gridOptions.advancedSearchData.engine.Filters = null;
                productTag.gridOptions.advancedSearchData.engine.Filters = [];
                productTag.gridOptions.reGetAll();
                productTag.closeModal();
            }
            productTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            productTag.addRequested = false;
            productTag.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category
    productTag.editCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        productTag.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'productCategorytag/edit', productTag.selectedItem, 'PUT').success(function (response) {
            productTag.addRequested = true;
            //productTag.showbusy = false;
            productTag.treeConfig.showbusy = false;
            productTag.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                productTag.addRequested = false;
                productTag.treeConfig.currentNode.Title = response.Item.Title;
                productTag.closeModal();
            }
            productTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            productTag.addRequested = false;
            productTag.categoryBusyIndicator.isActive = false;
        });
    }

    // Delete a Category
    productTag.deleteCategory = function () {
        if (buttonIsPressed) return;
        var node = productTag.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                productTag.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'productCategorytag/GetOne', node.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    productTag.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'productCategorytag/delete', productTag.selectedItemForDelete, 'POST').success(function (res) {
                        productTag.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            productTag.gridOptions.advancedSearchData.engine.Filters = null;
                            productTag.gridOptions.advancedSearchData.engine.Filters = [];
                            productTag.gridOptions.fillData();
                            productTag.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        productTag.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    productTag.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    productTag.treeConfig.onNodeSelect = function () {
        var node = productTag.treeConfig.currentNode;
        productTag.showGridComment = false;
        productTag.CategoryTagId = node.Id;
        productTag.selectContent(node);
    };

    //Show Content with Category Id
    productTag.selectContent = function (node) {
        productTag.gridOptions.advancedSearchData.engine.Filters = null;
        productTag.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            productTag.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            productTag.contentBusyIndicator.isActive = true;

            productTag.attachedFiles = null;
            productTag.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryTagId",
                IntValue1: node.Id,
                SearchType: 0
            }
            productTag.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"producttag/getall", productTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            productTag.contentBusyIndicator.isActive = false;
            productTag.ListItems = response.ListItems;
            productTag.gridOptions.fillData(productTag.ListItems, response.resultAccess); // Sending Access as an argument
            productTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            productTag.gridOptions.totalRowCount = response.TotalRowCount;
            productTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            productTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Open Add New Content Model
    productTag.openAddModel = function () {

        productTag.addRequested = false;
        productTag.modalTitle = 'اضافه کردن محتوای جدید';
        ajax.call(cmsServerConfig.configApiServerPath+'producttag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            productTag.selectedItem = response.Item;
            productTag.selectedItem.LinkCategoryTagId = productTag.CategoryTagId;
            //productTag.clearPreviousData();
            $modal.open({
                templateUrl: 'cpanelv1/Moduleproduct/producttag/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    productTag.openEditModel = function () {
        if (buttonIsPressed) return;
        productTag.addRequested = false;
        productTag.modalTitle = 'ویرایش';
        if (!productTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'producttag/GetOne', productTag.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            productTag.selectedItem = response1.Item;

            $modal.open({
                templateUrl: 'cpanelv1/Moduleproduct/producttag/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    productTag.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        productTag.categoryBusyIndicator.isActive = true;
        productTag.addRequested = true;


        ajax.call(cmsServerConfig.configApiServerPath+'producttag/add', productTag.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            productTag.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                productTag.ListItems.unshift(response.Item);
                productTag.gridOptions.fillData(productTag.ListItems);
                productTag.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            productTag.addRequested = false;
            productTag.categoryBusyIndicator.isActive = false;
        });
    }

    //Edit Content
    productTag.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        productTag.categoryBusyIndicator.isActive = true;
        productTag.addRequested = true;


        ajax.call(cmsServerConfig.configApiServerPath+'producttag/edit', productTag.selectedItem, 'PUT').success(function (response) {
            productTag.categoryBusyIndicator.isActive = false;
            productTag.addRequested = false;
            productTag.treeConfig.showbusy = false;
            productTag.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                productTag.replaceItem(productTag.selectedItem.Id, response.Item);
                productTag.gridOptions.fillData(productTag.ListItems);
                productTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            productTag.addRequested = false;
            productTag.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a product Content 
    productTag.deleteContent = function () {
        if (!productTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        productTag.treeConfig.showbusy = true;
        productTag.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                productTag.categoryBusyIndicator.isActive = true;
                console.log(productTag.gridOptions.selectedRow.item);
                productTag.showbusy = true;
                productTag.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+"producttag/GetOne", productTag.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    productTag.showbusy = false;
                    productTag.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    productTag.selectedItemForDelete = response.Item;
                    console.log(productTag.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"producttag/delete", productTag.selectedItemForDelete, 'POST').success(function (res) {
                        productTag.categoryBusyIndicator.isActive = false;
                        productTag.treeConfig.showbusy = false;
                        productTag.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            productTag.replaceItem(productTag.selectedItemForDelete.Id);
                            productTag.gridOptions.fillData(productTag.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        productTag.treeConfig.showbusy = false;
                        productTag.showIsBusy = false;
                        productTag.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    productTag.treeConfig.showbusy = false;
                    productTag.showIsBusy = false;
                    productTag.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }


    //Replace Item OnDelete/OnEdit Grid Options
    productTag.replaceItem = function (oldId, newItem) {
        angular.forEach(productTag.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = productTag.ListItems.indexOf(item);
                productTag.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            productTag.ListItems.unshift(newItem);
    }

    productTag.searchData = function () {
        productTag.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"producttsg/getall", productTag.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            productTag.contentBusyIndicator.isActive = false;
            productTag.ListItems = response.ListItems;
            productTag.gridOptions.fillData(productTag.ListItems);
            productTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            productTag.gridOptions.totalRowCount = response.TotalRowCount;
            productTag.gridOptions.rowPerPage = response.RowPerPage;
            productTag.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            productTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    productTag.addRequested = false;
    productTag.closeModal = function () {
        $modalStack.dismissAll();
    };

    productTag.showIsBusy = false;



    //For reInit Categories
    productTag.gridOptions.reGetAll = function () {
        productTag.init();
    };

    productTag.isCurrentNodeEmpty = function () {
        return !angular.equals({}, productTag.treeConfig.currentNode);
    }

    productTag.loadFileAndFolder = function (item) {
        productTag.treeConfig.currentNode = item;
        console.log(item);
        productTag.treeConfig.onNodeSelect(item);
    }

    productTag.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    productTag.columnCheckbox = false;
    productTag.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = productTag.gridOptions.columns;
        if (productTag.gridOptions.columnCheckbox) {
            for (var i = 0; i < productTag.gridOptions.columns.length; i++) {
                var element = $("#" + productTag.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                productTag.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < productTag.gridOptions.columns.length; i++) {
                var element = $("#" + productTag.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + productTag.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < productTag.gridOptions.columns.length; i++) {
            console.log(productTag.gridOptions.columns[i].name.concat(".visible: "), productTag.gridOptions.columns[i].visible);
        }
        productTag.gridOptions.columnCheckbox = !productTag.gridOptions.columnCheckbox;
    }

    productTag.deleteAttachedFile = function (index) {
        productTag.attachedFiles.splice(index, 1);
    }

    productTag.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !productTag.alreadyExist(id, productTag.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = {
                id: fId, name: fname
            };
            productTag.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    productTag.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    productTag.filePickerMainImage.removeSelectedfile = function (config) {
        productTag.filePickerMainImage.fileId = null;
        productTag.filePickerMainImage.filename = null;
        productTag.selectedItem.LinkMainImageId = null;

    }

    productTag.filePickerFiles.removeSelectedfile = function (config) {
        productTag.filePickerFiles.fileId = null;
        productTag.filePickerFiles.filename = null;
        productTag.selectedItem.LinkFileIds = null;
    }


    productTag.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }

    // ----------- FilePicker Codes --------------------------------
    productTag.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !productTag.alreadyExist(id, productTag.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            productTag.attachedFiles.push(file);
            productTag.clearfilePickers();
        }
    }

    productTag.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                productTag.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    productTag.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;   //String is empty or whitespace then return
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            productTag.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    productTag.clearfilePickers = function () {
        productTag.filePickerFiles.fileId = null;
        productTag.filePickerFiles.filename = null;
    }

    productTag.stringfyLinkFileIds = function () {
        $.each(productTag.attachedFiles, function (i, item) {
            if (productTag.selectedItem.LinkFileIds == "")
                productTag.selectedItem.LinkFileIds = item.fileId;
            else
                productTag.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    productTag.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/Moduleproduct/productContent/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        productTag.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            productTag.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    productTag.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    productTag.whatcolor = function (progress) {
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

    productTag.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    productTag.replaceFile = function (name) {
        productTag.itemClicked(null, productTag.fileIdToDelete, "file");
        productTag.fileTypes = 1;
        productTag.fileIdToDelete = productTag.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", productTag.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    productTag.remove(productTag.FileList, productTag.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                productTag.FileItem = response3.Item;
                                productTag.FileItem.FileName = name;
                                productTag.FileItem.Extension = name.split('.').pop();
                                productTag.FileItem.FileSrc = name;
                                productTag.FileItem.LinkCategoryId = productTag.thisCategory;
                                productTag.saveNewFile();
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
    productTag.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", productTag.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                productTag.FileItem = response.Item;
                productTag.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            productTag.showErrorIcon();
            return -1;
        });
    }

    productTag.showSuccessIcon = function () {
    }

    productTag.showErrorIcon = function () {

    }
    //file is exist
    productTag.fileIsExist = function (fileName) {
        for (var i = 0; i < productTag.FileList.length; i++) {
            if (productTag.FileList[i].FileName == fileName) {
                productTag.fileIdToDelete = productTag.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    productTag.getFileItem = function (id) {
        for (var i = 0; i < productTag.FileList.length; i++) {
            if (productTag.FileList[i].Id == id) {
                return productTag.FileList[i];
            }
        }
    }

    //select file or folder
    productTag.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            productTag.fileTypes = 1;
            productTag.selectedFileId = productTag.getFileItem(index).Id;
            productTag.selectedFileName = productTag.getFileItem(index).FileName;
        }
        else {
            productTag.fileTypes = 2;
            productTag.selectedCategoryId = productTag.getCategoryName(index).Id;
            productTag.selectedCategoryTitle = productTag.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        productTag.selectedIndex = index;

    };

    //upload file
    productTag.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (productTag.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ productTag.replaceFile(uploadFile.name);
                    productTag.itemClicked(null, productTag.fileIdToDelete, "file");
                    productTag.fileTypes = 1;
                    productTag.fileIdToDelete = productTag.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                productTag.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        productTag.FileItem = response2.Item;
                        productTag.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        productTag.filePickerMainImage.filename =
                          productTag.FileItem.FileName;
                        productTag.filePickerMainImage.fileId =
                          response2.Item.Id;
                        productTag.selectedItem.LinkMainImageId =
                          productTag.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      productTag.showErrorIcon();
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
                    productTag.FileItem = response.Item;
                    productTag.FileItem.FileName = uploadFile.name;
                    productTag.FileItem.uploadName = uploadFile.uploadName;
                    productTag.FileItem.Extension = uploadFile.name.split('.').pop();
                    productTag.FileItem.FileSrc = uploadFile.name;
                    productTag.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- productTag.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", productTag.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            productTag.FileItem = response.Item;
                            productTag.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            productTag.filePickerMainImage.filename = productTag.FileItem.FileName;
                            productTag.filePickerMainImage.fileId = response.Item.Id;
                            productTag.selectedItem.LinkMainImageId = productTag.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        productTag.showErrorIcon();
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
    productTag.exportFile = function () {
        productTag.gridOptions.advancedSearchData.engine.ExportFile = productTag.ExportFileClass;
        productTag.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'producttag/exportfile', productTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            productTag.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                productTag.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //productTag.closeModal();
            }
            productTag.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    productTag.toggleExportForm = function () {
        productTag.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        productTag.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        productTag.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        productTag.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        productTag.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/Moduleproduct/producttag/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    productTag.rowCountChanged = function () {
        if (!angular.isDefined(productTag.ExportFileClass.RowCount) || productTag.ExportFileClass.RowCount > 5000)
            productTag.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    productTag.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"producttag/count", productTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            productTag.addRequested = false;
            rashaErManage.checkAction(response);
            productTag.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            productTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    //TreeControl
    productTag.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (productTag.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    productTag.onNodeToggle = function (node, expanded) {
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

    productTag.onSelection = function (node, selected) {
        if (!selected) {
            productTag.selectedItem.LinkMainImageId = null;
            productTag.selectedItem.previewImageSrc = null;
            return;
        }
        productTag.selectedItem.LinkMainImageId = node.Id;
        productTag.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            productTag.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);