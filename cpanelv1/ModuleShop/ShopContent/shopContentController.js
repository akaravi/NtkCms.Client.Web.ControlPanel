app.controller("shopContentController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$stateParams', '$filter', "$rootScope", function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $stateParams, $filter, $rootScope) {
    var shopContent = this;
    shopContent.RouteUploadFileContent = cmsServerConfig.configRouteUploadFileContent;
    var edititem = false;
    shopContent.selectedContentId = { Id: $stateParams.ContentId, TitleTag: $stateParams.TitleTag };
    shopContent.IsSerial = false;
    //For Grid Options
    shopContent.gridOptions = {};
    shopContent.selectedItem = {};
    shopContent.attachedFiles = [];
    
    shopContent.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    shopContent.filePickerFilePodcast = {
        isActive: true,
        backElement: 'filePickerFilePodcast',
        filename: null,
        fileId: null,
        extension: 'mp3',
        multiSelect: false,
    }
    shopContent.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    shopContent.locationChanged = function (lat, lang) {
        console.log("ok " + lat + " " + lang);
    }

    shopContent.GeolocationConfig = {
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged: shopContent.locationChanged,
        useCurrentLocation: true,
        center: { lat: 32.658066, lng: 51.6693815 },
        zoom: 4,
        scope: shopContent,
        useCurrentLocationZoom: 12,
    }
    if (itemRecordStatus != undefined) shopContent.itemRecordStatus = itemRecordStatus;

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    var date = moment().format();
    shopContent.selectedItem.ToDate = date;
    shopContent.datePickerConfig = {
        defaultDate: date
    };
    shopContent.startDate = {
        defaultDate: date
    }
    shopContent.endDate = {
        defaultDate: date
    }
    shopContent.count = 0;
    shopContent.summernoteOptions = {
        height: 300,
        focus: true,
        airMode: false,
        toolbar: [
            ["edit", ["undo", "redo"]],
            ["headline", ["style"]],
            [
                "style",
                [
                    "bold",
                    "italic",
                    "underline",
                    "superscript",
                    "subscript",
                    "strikethrough",
                    "clear"
                ]
            ],
            ["fontface", ["fontname"]],
            ["textsize", ["fontsize"]],
            ["fontclr", ["color"]],
            ["alignment", ["ul", "ol", "paragraph", "lineheight"]],
            ["height", ["height"]],
            ["table", ["table"]],
            ['insert',['ltr','rtl']],
            ["insert", ["link", "picture", "video", "hr"]],
            ["view", ["fullscreen", "codeview"]],
            ["help", ["help"]]
        ]
    };
    //#help/ سلکتور similar
    shopContent.LinkDestinationIdSelector = {
        displayMember: "Title",
        id: "Id",
        fId: "LinkDestinationId",
        url: "ShopContent",
        sortColumn: "Id",
        sortType: 1,
        filterText: "Title",
        showAddDialog: false,
        rowPerPage: 200,
        scope: shopContent,
        columnOptions: {
            columns: [
                {
                    name: "Id",
                    displayName: "کد سیستمی",
                    sortable: true,
                    type: "integer"
                },
                {
                    name: "Title",
                    displayName: "عنوان",
                    sortable: true,
                    type: "string"
                }
            ]
        }
    };
    //#help/ سلکتور دسته بندی در ویرایش محتوا
    shopContent.LinkCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryId',
        url: 'shopCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: shopContent,
        columnOptions: {
            columns: [{
                name: 'Id',
                displayName: 'کد سیستمی',
                sortable: true,
                type: 'integer'
            },
            {
                name: 'Title',
                displayName: 'عنوان',
                sortable: true,
                type: 'string'
            },
            {
                name: 'Description',
                displayName: 'توضیحات',
                sortable: true,
                type: 'string'
            }
            ]
        }
    }

    shopContent.ItemListIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'ItemListId',
        url: 'ShopProductItem',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',

        rowPerPage: 200,
        scope: shopContent,
        columnOptions: {
            columns: [{
                name: 'Title',
                displayName: 'عنوان',
                sortable: true,
                type: 'string'
            }]
        }
    }
    shopContent.CombineListIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'CombineListId',
        url: 'ShopProductCombine',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',

        rowPerPage: 200,
        scope: shopContent,
        columnOptions: {
            columns: [{
                name: 'Title',
                displayName: 'عنوان',
                sortable: true,
                type: 'string'
            }]
        }
    }
    shopContent.ServiceListIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'ServiceListId',
        url: 'ShopProductService',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',

        rowPerPage: 200,
        scope: shopContent,
        columnOptions: {
            columns: [{
                name: 'Title',
                displayName: 'عنوان',
                sortable: true,
                type: 'string'
            }]
        }
    }
    shopContent.ProcessListIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'ProcessListId',
        url: 'ShopProductProcess',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',

        rowPerPage: 200,
        scope: shopContent,
        columnOptions: {
            columns: [{
                name: 'Title',
                displayName: 'عنوان',
                sortable: true,
                type: 'string'
            }]
        }
    }

    //Shop Grid Options
    shopContent.gridOptions = {
        columns: [
            {
                name: "LinkMainImageId",
                displayName: "عکس",
                sortable: true,
                visible: true,
                isThumbnailByFild: true,
                imageWidth: "80",
                imageHeight: "80"
            },
            {
                name: 'Id',
                displayName: 'کد سیستمی',
                sortable: true,
                type: 'integer',
                visible: 'true'
            },
            {
                name: 'LinkSiteId',
                displayName: 'کد سیستمی سایت',
                sortable: true,
                type: 'integer',
                visible: true
            },

            {
                name: 'CreatedBy',
                displayName: 'سازنده',
                sortable: true,
                type: 'integer',
                visible: true
            },
            {
                name: 'Title',
                displayName: 'عنوان',
                sortable: true,
                type: 'string',
                visible: 'true'
            },
            {
                name: 'Price',
                displayName: 'قیمت',
                sortable: true,
                type: 'integer',
                visible: 'true'
            },

            {
                name: 'Description',
                displayName: 'توضیحات',
                sortable: true,
                type: 'string',
                visible: 'true'
            }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "Id",
                SortType: 0,
                NeedToRunFakePagination: false,
                TotalRowData: 2000,
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: []
            }
        }

    }

    shopContent.collectionGridOption = {
        columns: [{ name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "Id",
                SortType: 0,
                NeedToRunFakePagination: false,
                TotalRowData: 2000,
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }

    //For Show Category Loading Indicator
    shopContent.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show Shop Loading Indicator
    shopContent.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    shopContent.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    shopContent.addMenu = function () {
        $modal.open({
            templateUrl: "cpanelv1/ModuleShop/shopContent/modalMenu.html",
            scope: $scope
        });
    }

    shopContent.treeConfig.currentNode = {};

    shopContent.treeBusyIndicator = false;

    shopContent.addRequested = false;

    //init Function
    shopContent.init = function () {
        shopContent.categoryBusyIndicator.isActive = true;
        var engine = {};
        try {
            engine = shopContent.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        //shopContent.gridOptions.advancedSearchData.engine.RowPerPage=1000;
        ajax.call(cmsServerConfig.configApiServerPath+"shopcategory/getall", {
            RowPerPage: 1000
        }, 'POST').success(function (response) {
            shopContent.treeConfig.Items = response.ListItems;
            shopContent.treeConfig.Items = response.ListItems;
            shopContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        filterModel = { PropertyName: "ContentTags", PropertyAnyName: "LinkTagId", SearchType: 0, IntValue1: shopContent.selectedContentId.Id };
        if (shopContent.selectedContentId.Id > 0)
            shopContent.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
        ajax.call(cmsServerConfig.configApiServerPath+"shopcontent/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopContent.ListItems = response.ListItems;
            shopContent.gridOptions.fillData(shopContent.ListItems, response.resultAccess); // Sending Access as an argument
            shopContent.contentBusyIndicator.isActive = false;
            shopContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopContent.gridOptions.totalRowCount = response.TotalRowCount;
            shopContent.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            shopContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            shopContent.contentBusyIndicator.isActive = false;
        });
        ajax.call(cmsServerConfig.configApiServerPath+"shopTag/GetViewModel", "", 'GET').success(function (response) {    //Get a ViewModel for shopTag
            shopContent.ModuleTag = response.Item;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"shopContentTag/GetViewModel", "", 'GET').success(function (response) { //Get a ViewModel for shopContentTag
            shopContent.ModuleContentTag = response.Item;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        //  ajax.call(cmsServerConfig.configApiServerPath+"shopproductitem/getall", {}, 'POST').success(function(response) {
        //      shopContent.itemListItems = response.ListItems;
        //  }).error(function(data, errCode, c, d) {
        //      console.log(data);
        //  });
        //  ajax.call(cmsServerConfig.configApiServerPath+"shopproductservice/getall", {}, 'POST').success(function(response) {
        //      shopContent.serviceListItems = response.ListItems;
        //  }).error(function(data, errCode, c, d) {
        //      console.log(data);
        //  });
        //  ajax.call(cmsServerConfig.configApiServerPath+"shopproductprocess/getall", {}, 'POST').success(function(response) {
        //      shopContent.processListItems = response.ListItems;
        //  }).error(function(data, errCode, c, d) {
        //      console.log(data);
        //  });
        //  ajax.call(cmsServerConfig.configApiServerPath+"shopproductcombine/getall", {}, 'POST').success(function(response) {
        //      shopContent.combineListItems = response.ListItems;
        //  }).error(function(data, errCode, c, d) {
        //      console.log(data);
        //  });
    };
    shopContent.SaveSerial = function () {

    };
    shopContent.gridOptions.onRowSelected = function () {
        var item = shopContent.gridOptions.selectedRow.item;
    }

    // Open Add Category Modal 
    shopContent.openAddCategoryModal = function () {
        if (buttonIsPressed) {
            return
        };
        shopContent.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            shopContent.selectedItem = response.Item;
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
                shopContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = {
                    Filters: [{
                        PropertyName: "LinkCategoryId",
                        SearchType: 0,
                        IntValue1: null,
                        IntValueForceNullSearch: true
                    }]
                };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(shopContent.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleShop/ShopCategory/add.html',
                        scope: $scope
                    });
                    shopContent.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //-----
            //$modal.open({
            //    templateUrl: 'cpanelv1/ModuleShop/ShopCategory/add.html',
            //    scope: $scope
            //});
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Category Modal
    shopContent.openEditCategoryModal = function () {
        if (buttonIsPressed) {
            return
        };
        shopContent.addRequested = false;
        shopContent.modalTitle = 'ویرایش';
        if (!shopContent.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }
        shopContent.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopCategory/GetOne', shopContent.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            shopContent.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            shopContent.selectedItem = response.Item;
            //Set dataForTheTree
            shopContent.selectedNode = [];
            shopContent.expandedNodes = [];
            shopContent.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                shopContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = {
                    Filters: [{
                        PropertyName: "LinkCategoryId",
                        SearchType: 0,
                        IntValue1: null,
                        IntValueForceNullSearch: true
                    }]
                };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(shopContent.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (shopContent.selectedItem.LinkMainImageId > 0)
                        shopContent.onSelection({
                            Id: shopContent.selectedItem.LinkMainImageId
                        }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleShop/ShopCategory/edit.html',
                        scope: $scope
                    });
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //---
            //$modal.open({
            //    templateUrl: 'cpanelv1/ModuleShop/ShopCategory/edit.html',
            //    scope: $scope
            //});
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Category
    shopContent.addNewCategory = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopContent.categoryBusyIndicator.isActive = true;
        shopContent.addRequested = true;
        shopContent.selectedItem.LinkParentId = null;
        if (shopContent.treeConfig.currentNode != null)
            shopContent.selectedItem.LinkParentId = shopContent.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'shopCategory/add', shopContent.selectedItem, 'POST').success(function (response) {
            shopContent.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopContent.gridOptions.advancedSearchData.engine.Filters = null;
                shopContent.gridOptions.advancedSearchData.engine.Filters = [];
                shopContent.gridOptions.reGetAll();
                shopContent.closeModal();
            }
            shopContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopContent.addRequested = false;
            shopContent.categoryBusyIndicator.isActive = false;
        });
    }

    //Edit Categorys
    shopContent.editCategory = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopContent.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopCategory/edit', shopContent.selectedItem, 'PUT').success(function (response) {
            shopContent.addRequested = true;
            //shopContent.showbusy = false;
            shopContent.treeConfig.showbusy = false;
            shopContent.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopContent.addRequested = false;
                shopContent.treeConfig.currentNode.Title = response.Item.Title;
                shopContent.closeModal();
            }
            shopContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopContent.addRequested = false;
            shopContent.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    shopContent.deleteCategory = function () {
        if (buttonIsPressed) {
            return
        };
        var node = shopContent.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                shopContent.categoryBusyIndicator.isActive = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'shopCategory/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    shopContent.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'shopCategory/delete', shopContent.selectedItemForDelete, 'POST').success(function (res) {
                        if (res.IsSuccess) {
                            shopContent.gridOptions.advancedSearchData.engine.Filters = null;
                            shopContent.gridOptions.advancedSearchData.engine.Filters = [];
                            shopContent.gridOptions.fillData();
                            shopContent.categoryBusyIndicator.isActive = false;
                            shopContent.gridOptions.reGetAll();
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        shopContent.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    shopContent.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    shopContent.treeConfig.onNodeSelect = function () {
        var node = shopContent.treeConfig.currentNode;
        shopContent.selectContent(node);

    };
    //Show Content with Category Id
    shopContent.selectContent = function (node) {
        shopContent.gridOptions.advancedSearchData.engine.Filters = null;
        shopContent.gridOptions.advancedSearchData.engine.Filters = [];
        if (node != null && node != undefined) {
            shopContent.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            shopContent.contentBusyIndicator.isActive = true;
            var s = {
                PropertyName: "LinkCategoryId",
                IntValue1: node.Id,
                SearchType: 0
            }
            shopContent.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"shopContent/getall", shopContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopContent.contentBusyIndicator.isActive = false;
            shopContent.ListItems = response.ListItems;
            shopContent.gridOptions.fillData(shopContent.ListItems, response.resultAccess); // Sending Access as an argument
            shopContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopContent.gridOptions.totalRowCount = response.TotalRowCount;
            shopContent.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            shopContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    //open statistics
    shopContent.Showstatistics = function () {
        if (!shopContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'shopContent/GetOne', shopContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            shopContent.selectedItem = response1.Item;
            $modal.open({
                templateUrl: "cpanelv1/ModuleShop/ShopContent/statistics.html",
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add New Content Model
    shopContent.openAddModal = function () {
        if (buttonIsPressed) {
            return
        };
        var node = shopContent.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Goods_Please_Select_The_Category'));
            return;
        }
        shopContent.addRequested = false;
        shopContent.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;

        ajax.call(cmsServerConfig.configApiServerPath+'shopContent/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            shopContent.attachedFiles = [];
            shopContent.attachedFile = "";
            shopContent.filePickerMainImage.filename = "";
            shopContent.filePickerMainImage.fileId = null;
            shopContent.filePickerFilePodcast.filename = "";
            shopContent.filePickerFilePodcast.fileId = null;
            shopContent.filePickerFiles.filename = "";
            shopContent.filePickerFiles.fileId = null;
            shopContent.tags = [];   //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
            shopContent.selectedItem = response.Item;
            shopContent.collectionListItems = [];
            shopContent.selectedItem.ProductProductItems = [];
            shopContent.selectedItem.ProductProductCombines = [];
            shopContent.selectedItem.ProductProductServices = [];
            shopContent.selectedItem.ProductProductProcesses = [];
            shopContent.selectedItem.OtherInfos = [];
            shopContent.selectedItem.Similars = [];
            shopContent.selectedItem.LinkCategoryId = node.Id;
            shopContent.clearPreviousData();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/ShopContent/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    shopContent.clearPreviousData = function () {
        shopContent.selectedItem.ProductProductCombines = [];
        shopContent.selectedItem.ProductProductItems = [];
        shopContent.selectedItem.ProductProductProcesses = [];
        shopContent.selectedItem.ProductProductServices = [];
        shopContent.selectedItem.Similars = [];
        $("#to").empty();
    }
    // Open Edit Content Modal
    shopContent.openEditModel = function () {
        shopContent.modalTitle = 'ویرایش';
        if (!shopContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        shopContent.attachedFiles = [];
        shopContent.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopContent/GetOne', shopContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            shopContent.addRequested = false;
            rashaErManage.checkAction(response);
            shopContent.clearPreviousData();
            shopContent.selectedItem = response.Item;
            shopContent.filePickerMainImage.filename = null;
            shopContent.filePickerMainImage.fileId = null;
            shopContent.filePickerFilePodcast.filename = null;
            shopContent.filePickerFilePodcast.fileId = null;
            if (response.Item.LinkMainImageId != null) {
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', response.Item.LinkMainImageId, 'GET').success(function (response2) {
                    buttonIsPressed = false;
                    shopContent.filePickerMainImage.filename = response2.Item.FileName;
                    shopContent.filePickerMainImage.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            if (response.Item.LinkFilePodcastId != null) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', response.Item.LinkFilePodcastId, 'GET').success(function (response2) {
                    shopContent.filePickerFilePodcast.filename = response2.Item.FileName;
                    shopContent.filePickerFilePodcast.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            shopContent.parseFileIds(response.Item.LinkFileIds);
            shopContent.filePickerFiles.filename = null;
            shopContent.filePickerFiles.fileId = null;
            //Load tagsInput
            shopContent.tags = [];  //Clear out previous tags
            if (shopContent.selectedItem.ContentTags == null)
                shopContent.selectedItem.ContentTags = [];
            $.each(shopContent.selectedItem.ContentTags, function (index, item) {
                if (item.ModuleTag != null)
                    shopContent.tags.push({ id: item.ModuleTag.Id, text: item.ModuleTag.Title });  //Add current content's tag to tags array with id and title
            });
            shopContent.collectionListItems = [];
            shopContent.setCollection("Item", response.Item.ProductProductItems);
            shopContent.setCollection("Combine", response.Item.ProductProductCombines);
            shopContent.setCollection("Service", response.Item.ProductProductServices);
            shopContent.setCollection("Process", response.Item.ProductProductProcesses);
            var instance = $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/shopContent/edit.html',
                scope: $scope
            })
            instance.opened.then(function () {
                // shopContent.collectionGridOption.fillData(shopContent.collectionListItems, null);
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    shopContent.saveCollection = function () {
        shopContent.selectedItem.ProductProductItems = [];
        shopContent.selectedItem.ProductProductCombines = [];
        shopContent.selectedItem.ProductProductServices = [];
        shopContent.selectedItem.ProductProductProcesses = [];
        for (var i = 0; i < shopContent.collectionListItems.length; i++) {
            var data = shopContent.collectionListItems[i];
            var source = data.Source;
            if (source == 'Item') {
                shopContent.selectedItem.ProductProductItems.push({ LinkProductItemId: data.LinkItemId, LinkProductId: shopContent.selectedItem.Id });
            }
            if (source == 'Combine') {
                shopContent.selectedItem.ProductProductCombines.push({ LinkProductCombineId: data.LinkCombineId, LinkProductId: shopContent.selectedItem.Id });
            }
            if (source == 'Service') {
                shopContent.selectedItem.ProductProductServices.push({ LinkProductServiceId: data.LinkServiceId, LinkProductId: shopContent.selectedItem.Id });
            }
            if (source == 'Process') {
                shopContent.selectedItem.ProductProductProcesses.push({ LinkProductProcessId: data.LinkProcessId, LinkProductId: shopContent.selectedItem.Id });
            }

        }
        ajax.call(cmsServerConfig.configApiServerPath+'shopContent/SaveDetail', shopContent.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });


    }


    shopContent.removeFromCollection = function (x) {
        shopContent.collectionListItems.splice(x, 1);
    }

    shopContent.setCollection = function (source, arr) {
        if (shopContent.collectionListItems == undefined)
            shopContent.collectionListItems = [];
        for (var i = 0; i < arr.length; i++) {
            var data = {
                Id: 0,
                LinkProductId: 0,
                Title: '',
                LinkItemId: 0,
                LinkCombineId: 0,
                LinkServiceId: 0,
                LinkProcessId: 0,
            };

            data.Source = source;
            if (arr[i].Id != undefined)
                data.Id = arr[i].Id;
            if (source == 'Item') {
                data.Price = arr[i].ProductItem.Price;
                data.Title = arr[i].ProductItem.Title;
                data.LinkItemId = arr[i].LinkProductItemId;
            }
            if (source == 'Combine') {
                data.Price = arr[i].ProductCombine.Price;
                data.Title = arr[i].ProductCombine.Title;
                data.LinkItemId = arr[i].LinkProductCombineId;
            }
            if (source == 'Service') {
                data.Price = arr[i].ProductService.Price;
                data.Title = arr[i].ProductService.Title;
                data.LinkItemId = arr[i].LinkProductServiceId;
            }
            if (source == 'Process') {
                data.Price = arr[i].ProductProcess.Price;
                data.Title = arr[i].ProductProcess.Title;
                data.LinkItemId = arr[i].LinkProductProcessId;
            }
            shopContent.collectionListItems.push(data);
        }
    }



    // Add New Content
    shopContent.addNewContent = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopContent.categoryBusyIndicator.isActive = true;
        shopContent.addRequested = true;
        var apiSelectedItem = shopContent.selectedItem;
        if (apiSelectedItem.Similars)
            $.each(apiSelectedItem.Similars, function (index, item) {
                item.Destination = [];
            });
        ajax.call(cmsServerConfig.configApiServerPath+'shopContent/add', apiSelectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopContent.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                shopContent.ListItems.unshift(response.Item);
                shopContent.selectedItem.Id = response.Item.Id;
                shopContent.saveCollection();
                shopContent.gridOptions.fillData(shopContent.ListItems);
                shopContent.closeModal();
                //Save inputTags
                shopContent.selectedItem.ContentTags = [];
                $.each(shopContent.tags, function (index, item) {
                    if (item.id > 0) {
                        var newObject = $.extend({}, shopContent.ModuleContentTag);
                        newObject.LinkTagId = item.id;
                        newObject.LinkContentId = response.Item.Id;
                        shopContent.selectedItem.ContentTags.push(newObject);
                    }
                });
                ajax.call(cmsServerConfig.configApiServerPath+'shopContentTag/addbatch', shopContent.selectedItem.ContentTags, 'POST').success(function (response) {
                    console.log(response);
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopContent.addRequested = false;
            shopContent.categoryBusyIndicator.isActive = false;
        });
    }

    //Edit Content
    shopContent.editContent = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopContent.categoryBusyIndicator.isActive = true;
        shopContent.addRequested = true;
        //Save inputTags
        shopContent.selectedItem.ContentTags = [];
        $.each(shopContent.tags, function (index, item) {
            if (item.id > 0) {
                var newObject = $.extend({}, shopContent.ModuleContentTag);
                newObject.LinkTagId = item.id;
                newObject.LinkContentId = shopContent.selectedItem.Id;
                shopContent.selectedItem.ContentTags.push(newObject);
            }
        });
        var apiSelectedItem = shopContent.selectedItem;
        if (apiSelectedItem.Similars)
            $.each(apiSelectedItem.Similars, function (index, item) {
                item.Destination = [];
            });
        shopContent.saveCollection();
        ajax.call(cmsServerConfig.configApiServerPath+'shopContent/edit', apiSelectedItem, 'PUT').success(function (response) {
            shopContent.categoryBusyIndicator.isActive = false;
            shopContent.addRequested = false;
            shopContent.treeConfig.showbusy = false;
            shopContent.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopContent.replaceItem(shopContent.selectedItem.Id, response.Item);

                shopContent.gridOptions.fillData(shopContent.ListItems);
                shopContent.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopContent.addRequested = false;
            shopContent.categoryBusyIndicator.isActive = false;
        });
    }

    // Delete a Shop Content 
    shopContent.deleteContent = function () {
        if (buttonIsPressed) return;
        if (!shopContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        shopContent.treeConfig.showbusy = true;
        shopContent.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                shopContent.categoryBusyIndicator.isActive = true;
                shopContent.showbusy = true;
                shopContent.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"shopContent/GetOne", shopContent.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    shopContent.showbusy = false;
                    shopContent.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    shopContent.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+"shopContent/delete", shopContent.selectedItemForDelete, 'POST').success(function (res) {
                        shopContent.categoryBusyIndicator.isActive = false;
                        shopContent.treeConfig.showbusy = false;
                        shopContent.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            shopContent.replaceItem(shopContent.selectedItemForDelete.Id);
                            shopContent.gridOptions.fillData(shopContent.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        shopContent.treeConfig.showbusy = false;
                        shopContent.showIsBusy = false;
                        shopContent.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    shopContent.treeConfig.showbusy = false;
                    shopContent.showIsBusy = false;
                    shopContent.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }

    //#help similar & otherinfo

    shopContent.moveSelectedSimilar = function (from, to, calculatePrice) {
        if (from == "Content") {
            //var title = shopContent.ItemListIdSelector.selectedItem.Title;
            // var optionSelectedPrice = shopContent.ItemListIdSelector.selectedItem.Price;
            if (
                shopContent.selectedItem.LinkDestinationId != undefined &&
                shopContent.selectedItem.LinkDestinationId != null
            ) {
                if (shopContent.selectedItem.Similars == undefined)
                    shopContent.selectedItem.Similars = [];
                for (var i = 0; i < shopContent.selectedItem.Similars.length; i++) {
                    if (
                        shopContent.selectedItem.Similars[i].LinkDestinationId ==
                        shopContent.selectedItem.LinkDestinationId
                    ) {
                        rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
                        return;
                    }
                }
                // if (shopContent.selectedItem.Title == null || shopContent.selectedItem.Title.length < 0)
                //     shopContent.selectedItem.Title = title;
                shopContent.selectedItem.Similars.push({
                    //Id: 0,
                    //Source: from,
                    LinkDestinationId: shopContent.selectedItem.LinkDestinationId,
                    Destination: shopContent.LinkDestinationIdSelector.selectedItem
                });
            }
        }
    };
    shopContent.moveSelectedOtherInfo = function (from, to, y) {


        if (shopContent.selectedItem.OtherInfos == undefined)
            shopContent.selectedItem.OtherInfos = [];
        for (var i = 0; i < shopContent.selectedItem.OtherInfos.length; i++) {

            if (shopContent.selectedItem.OtherInfos[i].Title == shopContent.selectedItemOtherInfos.Title && shopContent.selectedItem.OtherInfos[i].HtmlBody == shopContent.selectedItemOtherInfos.HtmlBody && shopContent.selectedItem.OtherInfos[i].Source == shopContent.selectedItemOtherInfos.Source) {
                rashaErManage.showMessage($filter('translatentk')('Information_Is_Duplicate'));
                return;
            }

        }
        if (shopContent.selectedItemOtherInfos.Title == "" && shopContent.selectedItemOtherInfos.Source == "" && shopContent.selectedItemOtherInfos.HtmlBody == "") {
            rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
        }
        else {

            shopContent.selectedItem.OtherInfos.push({
                Title: shopContent.selectedItemOtherInfos.Title,
                HtmlBody: shopContent.selectedItemOtherInfos.HtmlBody,
                Source: shopContent.selectedItemOtherInfos.Source
            });
            shopContent.selectedItemOtherInfos.Title = "";
            shopContent.selectedItemOtherInfos.Source = "";
            shopContent.selectedItemOtherInfos.HtmlBody = "";
        }
        if (edititem) {
            edititem = false;
        }

    };

    shopContent.removeFromCollectionSimilar = function (listsimilar, iddestination) {
        for (var i = 0; i < shopContent.selectedItem.Similars.length; i++) {
            if (listsimilar[i].LinkDestinationId == iddestination) {
                shopContent.selectedItem.Similars.splice(i, 1);
                return;
            }

        }

    };
    shopContent.removeFromOtherInfo = function (listOtherInfo, title, body, source) {
        for (var i = 0; i < shopContent.selectedItem.OtherInfos.length; i++) {
            if (listOtherInfo[i].Title == title && listOtherInfo[i].HtmlBody == body && listOtherInfo[i].Source == source) {
                shopContent.selectedItem.OtherInfos.splice(i, 1);
                return;
            }
        }
    };
    shopContent.editOtherInfo = function (y) {
        edititem = true;
        shopContent.selectedItemOtherInfos.Title = y.Title;
        shopContent.selectedItemOtherInfos.HtmlBody = y.HtmlBody;
        shopContent.selectedItemOtherInfos.Source = y.Source;
        shopContent.removeFromOtherInfo(shopContent.selectedItem.OtherInfos, y.Title, y.HtmlBody, y.Source);
    };


    //#help
    //Replace Item OnDelete/OnEdit Grid Options
    shopContent.replaceItem = function (oldId, newItem) {
        angular.forEach(shopContent.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = shopContent.ListItems.indexOf(item);
                shopContent.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            shopContent.ListItems.unshift(newItem);
    }

    //Close Model Stack
    shopContent.addRequested = false;
    shopContent.closeModal = function () {
        $modalStack.dismissAll();
    };

    shopContent.showIsBusy = false;

    //For reInit Categories
    shopContent.gridOptions.reGetAll = function () {
        shopContent.init();
    };

    shopContent.isCurrentNodeEmpty = function () {
        return !angular.equals({}, shopContent.treeConfig.currentNode);
    }

    shopContent.loadFileAndFolder = function (item) {
        shopContent.treeConfig.currentNode = item;
        shopContent.treeConfig.onNodeSelect(item);
    }
    shopContent.addRequested = true;

    shopContent.columnCheckbox = false;

    shopContent.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = shopContent.gridOptions.columns;
        if (shopContent.gridOptions.columnCheckbox) {
            for (var i = 0; i < shopContent.gridOptions.columns.length; i++) {
                //shopContent.gridOptions.columns[i].visible = $("#" + shopContent.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + shopContent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                shopContent.gridOptions.columns[i].visible = temp;
            }
        } else {

            for (var i = 0; i < shopContent.gridOptions.columns.length; i++) {
                var element = $("#" + shopContent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + shopContent.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < shopContent.gridOptions.columns.length; i++) {
            console.log(shopContent.gridOptions.columns[i].name.concat(".visible: "), shopContent.gridOptions.columns[i].visible);
        }
        shopContent.gridOptions.columnCheckbox = !shopContent.gridOptions.columnCheckbox;
    }

    shopContent.deleteAttachedFile = function (index) {
        shopContent.attachedFiles.splice(index, 1);
    }

    shopContent.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }


    shopContent.calculatePrice = function () {
        var price = 0;
        for (var i = 0; i < shopContent.collectionListItems.length; i++)
            if (shopContent.collectionListItems[i].Price != undefined)
                price += shopContent.collectionListItems[i].Price;
        shopContent.selectedItem.Price = price;
    }

    shopContent.moveSelected = function (from, to, calculatePrice) {
        if (from == 'Item') {

            var title = shopContent.ItemListIdSelector.selectedItem.Title;
            var optionSelectedPrice = shopContent.ItemListIdSelector.selectedItem.Price;
            if (shopContent.selectedItem.ItemListId != undefined && shopContent.selectedItem.ItemListId != null) {
                if (shopContent.collectionListItems == undefined)
                    shopContent.collectionListItems = [];
                for (var i = 0; i < shopContent.collectionListItems.length; i++) {
                    if (shopContent.collectionListItems[i].LinkItemId == shopContent.selectedItem.ItemListId && shopContent.collectionListItems[i].Source == from) {
                        rashaErManage.showMessage($filter('translatentk')('Goods_Are_Repetitive'));
                        return;
                    }

                }
                if (shopContent.selectedItem.Title == null || shopContent.selectedItem.Title.length < 0)
                    shopContent.selectedItem.Title = title;
                shopContent.collectionListItems.push({
                    Id: 0,
                    Source: from,
                    LinkItemId: shopContent.selectedItem.ItemListId,
                    Title: shopContent.ItemListIdSelector.selectedItem.Title,
                    Price: shopContent.ItemListIdSelector.selectedItem.Price,
                });
            }
        }
        if (from == 'Combine') {
            var title = shopContent.CombineListIdSelector.selectedItem.Title;
            var optionSelectedPrice = shopContent.CombineListIdSelector.selectedItem.Price;
            if (shopContent.selectedItem.CombineListId != undefined && shopContent.selectedItem.CombineListId != null) {
                if (shopContent.collectionListItems == undefined)
                    shopContent.collectionListItems = [];
                for (var i = 0; i < shopContent.collectionListItems.length; i++) {
                    if (shopContent.collectionListItems[i].LinkCombineId == shopContent.selectedItem.CombineListId && shopContent.collectionListItems[i].Source == from) {
                        rashaErManage.showMessage($filter('translatentk')('Goods_Are_Repetitive'));
                        return;
                    }

                }
                if (shopContent.selectedItem.Title == null || shopContent.selectedItem.Title.length < 0)
                    shopContent.selectedItem.Title = title;
                shopContent.collectionListItems.push({
                    Id: 0,
                    Source: from,
                    LinkCombineId: shopContent.selectedItem.CombineListId,
                    Title: shopContent.CombineListIdSelector.selectedItem.Title,
                    Price: shopContent.CombineListIdSelector.selectedItem.Price,
                });
            }
        }

        if (from == 'Service') {
            var title = shopContent.ServiceListIdSelector.selectedItem.Title;
            var optionSelectedPrice = shopContent.ServiceListIdSelector.selectedItem.Price;
            if (shopContent.selectedItem.ServiceListId != undefined && shopContent.selectedItem.ServiceListId != null) {
                if (shopContent.collectionListItems == undefined)
                    shopContent.collectionListItems = [];
                for (var i = 0; i < shopContent.collectionListItems.length; i++) {
                    if (shopContent.collectionListItems[i].LinkServiceId == shopContent.selectedItem.ServiceListId && shopContent.collectionListItems[i].Source == from) {
                        rashaErManage.showMessage($filter('translatentk')('Goods_Are_Repetitive'));
                        return;
                    }

                }
                if (shopContent.selectedItem.Title == null || shopContent.selectedItem.Title.length < 0)
                    shopContent.selectedItem.Title = title;
                shopContent.collectionListItems.push({
                    Id: 0,
                    Source: from,
                    LinkServiceId: shopContent.selectedItem.ServiceListId,
                    Title: shopContent.ServiceListIdSelector.selectedItem.Title,
                    Price: shopContent.ServiceListIdSelector.selectedItem.Price,
                });
            }
        }
        if (from == 'Process') {
            var title = shopContent.ProcessListIdSelector.selectedItem.Title;
            var optionSelectedPrice = shopContent.ProcessListIdSelector.selectedItem.Price;
            if (shopContent.selectedItem.ProcessListId != undefined && shopContent.selectedItem.ProcessListId != null) {
                if (shopContent.collectionListItems == undefined)
                    shopContent.collectionListItems = [];
                for (var i = 0; i < shopContent.collectionListItems.length; i++) {
                    if (shopContent.collectionListItems[i].LinkProcessId == shopContent.selectedItem.ProcessListId && shopContent.collectionListItems[i].Source == from) {
                        rashaErManage.showMessage($filter('translatentk')('Goods_Are_Repetitive'));
                        return;
                    }

                }
                if (shopContent.selectedItem.Title == null || shopContent.selectedItem.Title.length < 0)
                    shopContent.selectedItem.Title = title;
                shopContent.collectionListItems.push({
                    Id: 0,
                    Source: from,
                    LinkProcessId: shopContent.selectedItem.ProcessListId,
                    Title: shopContent.ProcessListIdSelector.selectedItem.Title,
                    Price: shopContent.ProcessListIdSelector.selectedItem.Price,
                });
            }
        }
        if (calculatePrice)
            shopContent.calculatePrice();


    }

    shopContent.filePickerFilePodcast.removeSelectedfile = function (config) {
        shopContent.filePickerFilePodcast.fileId = null;
        shopContent.filePickerFilePodcast.filename = null;
        shopContent.selectedItem.LinkFilePodcastId = null;

    }

    //TreeControl
    shopContent.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (shopContent.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    shopContent.onNodeToggle = function (node, expanded) {
        if (expanded) {
            node.Children = [];
            var filterModel = {
                Filters: []
            };
            var originalName = node.Title;
            node.messageText = " در حال بارگذاری...";
            filterModel.Filters.push({
                PropertyName: "LinkParentId",
                SearchType: 0,
                IntValue1: node.Id
            });
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

    shopContent.onSelection = function (node, selected) {
        if (!selected) {
            shopContent.selectedItem.LinkMainImageId = null;
            shopContent.selectedItem.previewImageSrc = null;
            return;
        }
        shopContent.selectedItem.LinkMainImageId = node.Id;
        shopContent.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            shopContent.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
    shopContent.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !shopContent.alreadyExist(id, shopContent.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = {
                id: fId,
                name: fname
            };
            shopContent.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }
    shopContent.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }
    // ----------- FilePicker Codes --------------------------------
    shopContent.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !shopContent.alreadyExist(id, shopContent.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId,
                filename: fname
            };
            shopContent.attachedFiles.push(file);
            shopContent.clearfilePickers();
        }
    }

    shopContent.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                shopContent.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    shopContent.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) { // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            shopContent.attachedFiles.push({
                                fileId: response.Item.Id,
                                filename: response.Item.FileName
                            });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    shopContent.clearfilePickers = function () {
        shopContent.filePickerFiles.fileId = null;
        shopContent.filePickerFiles.filename = null;
    }

    shopContent.stringfyLinkFileIds = function () {
        $.each(shopContent.attachedFiles, function (i, item) {
            if (shopContent.selectedItem.LinkFileIds == "")
                shopContent.selectedItem.LinkFileIds = item.fileId;
            else
                shopContent.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------
    //---------------Upload Modal-------------------------------
    shopContent.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/Moduleshop/shopContent/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        shopContent.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            shopContent.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }
    //---------------Upload Modal Podcast-------------------------------
    shopContent.openUploadModalPodcast = function () {
        $modal.open({
            templateUrl: 'cpanelv1/Moduleshop/shopContent/upload_modalPodcast.html',
            size: 'lg',
            scope: $scope
        });

        shopContent.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            shopContent.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }
    shopContent.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    shopContent.whatcolor = function (progress) {
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

    shopContent.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    shopContent.replaceFile = function (name) {
        shopContent.itemClicked(null, shopContent.fileIdToDelete, "file");
        shopContent.fileTypes = 1;
        shopContent.fileIdToDelete = shopContent.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", shopContent.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    shopContent.remove(shopContent.FileList, shopContent.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                shopContent.FileItem = response3.Item;
                                shopContent.FileItem.FileName = name;
                                shopContent.FileItem.Extension = name.split('.').pop();
                                shopContent.FileItem.FileSrc = name;
                                shopContent.FileItem.LinkCategoryId = shopContent.thisCategory;
                                shopContent.saveNewFile();
                            } else {
                                console.log("getting the model was not successfully returned!");
                            }
                        }).error(function (data) {
                            console.log(data);
                        });
                    } else {
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
    shopContent.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", shopContent.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                shopContent.FileItem = response.Item;
                shopContent.showSuccessIcon();
                return 1;
            } else {
                return 0;

            }
        }).error(function (data) {
            shopContent.showErrorIcon();
            return -1;
        });
    }

    shopContent.showSuccessIcon = function () { }

    shopContent.showErrorIcon = function () {

    }
    //file is exist
    shopContent.fileIsExist = function (fileName) {
        for (var i = 0; i < shopContent.FileList.length; i++) {
            if (shopContent.FileList[i].FileName == fileName) {
                shopContent.fileIdToDelete = shopContent.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    shopContent.getFileItem = function (id) {
        for (var i = 0; i < shopContent.FileList.length; i++) {
            if (shopContent.FileList[i].Id == id) {
                return shopContent.FileList[i];
            }
        }
    }

    //select file or folder
    shopContent.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            shopContent.fileTypes = 1;
            shopContent.selectedFileId = shopContent.getFileItem(index).Id;
            shopContent.selectedFileName = shopContent.getFileItem(index).FileName;
        } else {
            shopContent.fileTypes = 2;
            shopContent.selectedCategoryId = shopContent.getCategoryName(index).Id;
            shopContent.selectedCategoryTitle = shopContent.getCategoryName(index).Title;
        }
        shopContent.selectedIndex = index;
    };

    shopContent.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }
    //upload file Podcast
    shopContent.uploadFilePodcast = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (shopContent.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ shopContent.replaceFile(uploadFile.name);
                    shopContent.itemClicked(null, shopContent.fileIdToDelete, "file");
                    shopContent.fileTypes = 1;
                    shopContent.fileIdToDelete = shopContent.selectedIndex;
                    // replace the file
                    ajax
                        .call(
                        cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                        shopContent.fileIdToDelete,
                        "GET"
                        )
                        .success(function (response1) {
                            if (response1.IsSuccess == true) {
                                console.log(response1.Item);
                                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                                    .success(function (response2) {
                                        if (response2.IsSuccess == true) {
                                            shopContent.FileItem = response2.Item;
                                            shopContent.showSuccessIcon();
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-check");
                                            shopContent.filePickerFilePodcast.filename =
                                                shopContent.FileItem.FileName;
                                            shopContent.filePickerFilePodcast.fileId =
                                                response2.Item.Id;
                                            shopContent.selectedItem.LinkFilePodcastId =
                                                shopContent.filePickerFilePodcast.fileId;
                                        } else {
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-remove");
                                        }
                                    })
                                    .error(function (data) {
                                        shopContent.showErrorIcon();
                                        $("#save-icon" + index).removeClass("fa-save");
                                        $("#save-button" + index).removeClass("flashing-button");
                                        $("#save-icon" + index).addClass("fa-remove");
                                    });
                                //-----------------------------------
                            }
                        })
                        .error(function (data) {
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
                    shopContent.FileItem = response.Item;
                    shopContent.FileItem.FileName = uploadFile.name;
                    shopContent.FileItem.uploadName = uploadFile.uploadName;
                    shopContent.FileItem.Extension = uploadFile.name.split('.').pop();
                    shopContent.FileItem.FileSrc = uploadFile.name;
                    shopContent.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- shopContent.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", shopContent.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            shopContent.FileItem = response.Item;
                            shopContent.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            shopContent.filePickerFilePodcast.filename = shopContent.FileItem.FileName;
                            shopContent.filePickerFilePodcast.fileId = response.Item.Id;
                            shopContent.selectedItem.LinkFilePodcastId = shopContent.filePickerFilePodcast.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        shopContent.showErrorIcon();
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
    //upload file
    shopContent.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (shopContent.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ shopContent.replaceFile(uploadFile.name);
                    shopContent.itemClicked(null, shopContent.fileIdToDelete, "file");
                    shopContent.fileTypes = 1;
                    shopContent.fileIdToDelete = shopContent.selectedIndex;
                    // replace the file
                    ajax
                        .call(
                        cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                        shopContent.fileIdToDelete,
                        "GET"
                        )
                        .success(function (response1) {
                            if (response1.IsSuccess == true) {
                                console.log(response1.Item);
                                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                                    .success(function (response2) {
                                        if (response2.IsSuccess == true) {
                                            shopContent.FileItem = response2.Item;
                                            shopContent.showSuccessIcon();
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-check");
                                            shopContent.filePickerMainImage.filename =
                                                shopContent.FileItem.FileName;
                                            shopContent.filePickerMainImage.fileId =
                                                response2.Item.Id;
                                            shopContent.selectedItem.LinkMainImageId =
                                                shopContent.filePickerMainImage.fileId;
                                        } else {
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-remove");
                                        }
                                    })
                                    .error(function (data) {
                                        shopContent.showErrorIcon();
                                        $("#save-icon" + index).removeClass("fa-save");
                                        $("#save-button" + index).removeClass("flashing-button");
                                        $("#save-icon" + index).addClass("fa-remove");
                                    });
                                //-----------------------------------
                            }
                        })
                        .error(function (data) {
                            console.log(data);
                        });
                    //--------------------------------
                } else {
                    return;
                }
            } else { // File does not exists
                // Save New file
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response) {
                    shopContent.FileItem = response.Item;
                    shopContent.FileItem.FileName = uploadFile.name;
                    shopContent.FileItem.uploadName = uploadFile.uploadName;
                    shopContent.FileItem.Extension = uploadFile.name.split('.').pop();
                    shopContent.FileItem.FileSrc = uploadFile.name;
                    shopContent.FileItem.LinkCategoryId = null; //Save the new file in the root
                    // ------- shopContent.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", shopContent.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            shopContent.FileItem = response.Item;
                            shopContent.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            shopContent.filePickerMainImage.filename = shopContent.FileItem.FileName;
                            shopContent.filePickerMainImage.fileId = response.Item.Id;
                            shopContent.selectedItem.LinkMainImageId = shopContent.filePickerMainImage.fileId

                        } else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        shopContent.showErrorIcon();
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
    shopContent.exportFile = function () {
        shopContent.addRequested = true;
        shopContent.gridOptions.advancedSearchData.engine.ExportFile = shopContent.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'shopContent/exportfile', shopContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopContent.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //shopContent.closeModal();
            }
            shopContent.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    shopContent.toggleExportForm = function () {
        shopContent.SortType = [{
            key: 'نزولی',
            value: 0
        },
        {
            key: 'صعودی',
            value: 1
        },
        {
            key: 'تصادفی',
            value: 3
        }
        ];
        shopContent.EnumExportFileType = [{
            key: 'Excel',
            value: 1
        },
        {
            key: 'PDF',
            value: 2
        },
        {
            key: 'Text',
            value: 3
        }
        ];
        shopContent.EnumExportReceiveMethod = [{
            key: 'دانلود',
            value: 0
        },
        {
            key: 'ایمیل',
            value: 1
        },
        {
            key: 'فایل منیجر',
            value: 3
        }
        ];
        shopContent.ExportFileClass = {
            FileType: 1,
            RecieveMethod: 0,
            RowCount: 100
        };
        shopContent.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleShop/shopContent/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    shopContent.rowCountChanged = function () {
        if (!angular.isDefined(shopContent.ExportFileClass.RowCount) || shopContent.ExportFileClass.RowCount > 5000)
            shopContent.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    shopContent.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"shopContent/count", shopContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopContent.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            shopContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);