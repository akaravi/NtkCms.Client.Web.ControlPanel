app.controller("cmsModuleSaleSerialController", [
    "$scope",
    "$http",
    "ajax",
    "rashaErManage",
    "$modal",
    "$modalStack",
    "SweetAlert",
    "$timeout",
    "$window",
    "$filter",
    function (
        $scope,
        $http,
        ajax,
        rashaErManage,
        $modal,
        $modalStack,
        sweetAlert,
        $timeout,
        $window,
        $filter
    ) {
        var cmsModuleSaleSerial = this;
        //For Grid Options
        cmsModuleSaleSerial.gridOptions = {};
        cmsModuleSaleSerial.selectedItem = {};
        //cmsModuleSaleSerial.attachedFiles = [];
        //cmsModuleSaleSerial.attachedFile = "";

        //cmsModuleSaleSerial.filePickerMainImage = {
        //  isActive: true,
        //  backElement: "filePickerMainImage",
        //  filename: null,
        //  fileId: null,
        //  multiSelect: false
        //};
        //cmsModuleSaleSerial.filePickerFiles = {
        //  isActive: true,
        //  backElement: "filePickerFiles",
        //  multiSelect: false,
        //  fileId: null,
        //  filename: null
        //};
        //cmsModuleSaleSerial.locationChanged=function(lat,lang)
        //{
        //    console.log("ok "+lat+" "+lang);
        //}
        //
        //cmsModuleSaleSerial.GeolocationConfig={
        //        latitude: 'Geolocationlatitude',
       // longitude: 'Geolocationlongitude',
        //    onlocationChanged:cmsModuleSaleSerial.locationChanged,
        //    useCurrentLocation:true,
        //    center:{lat: 32.658066, lng: 51.6693815},
        //    zoom:4,
        //    scope:cmsModuleSaleSerial,
        //    useCurrentLocationZoom:12,
        //}
        var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

        if (itemRecordStatus != undefined)
            cmsModuleSaleSerial.itemRecordStatus = itemRecordStatus;

        var date = moment().format();
        cmsModuleSaleSerial.selectedItem.MaxExpireToUse = date;
        cmsModuleSaleSerial.selectedItem.ToDate = date;
        cmsModuleSaleSerial.datePickerConfig = {
            defaultDate: date
        };
        cmsModuleSaleSerial.startDate = {
            defaultDate: date
        };
        cmsModuleSaleSerial.endDate = {
            defaultDate: date
        };
        cmsModuleSaleSerial.MaxExpireToUse = {
            defaultDate: date
        };
        cmsModuleSaleSerial.count = 0;
        ////#help/ سلکتور similar
        //    cmsModuleSaleSerial.LinkDestinationIdSelector = {
        //      displayMember: "Title",
        //      id: "Id",
        //      fId: "LinkDestinationId",
        //      url: "cmsModuleSaleSerial",
        //      sortColumn: "Id",
        //      sortType: 1,
        //      filterText: "Title",
        //      showAddDialog: false,
        //      rowPerPage: 200,
        //      scope: cmsModuleSaleSerial,
        //      columnOptions: {
        //        columns: [
        //          {
        //            name: "Id",
        //            displayName: "کد سیستمی",
        //            sortable: true,
        //            type: "integer"
        //          },
        //          {
        //            name: "Title",
        //            displayName: "عنوان",
        //            sortable: true,
        //            type: "string"
        //          }
        //        ]
        //      }
        //    };

        //#help/ سلکتور دسته بندی در هدر
        cmsModuleSaleSerial.LinkModuleSaleHeaderGroupIdSelector = {
            displayMember: "Title",
            id: "Id",
            fId: "LinkModuleSaleHeaderGroupId",
            url: "CmsModuleSaleHeaderGroup",
            sortColumn: "Id",
            sortType: 0,
            filterText: "Title",
            showAddDialog: false,
            rowPerPage: 200,
            scope: cmsModuleSaleSerial,
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
                    },
                    {
                        name: "Description",
                        displayName: "توضیحات",
                        sortable: true,
                        type: "string"
                    }
                ]
            }
        };
        //#help/ سلکتور ماژول در محتوا
        cmsModuleSaleSerial.LinkSiteIdDepositSelector = {
            displayMember: "Title",
            id: "Id",
            fId: "LinkSiteIdDeposit",
            url: "CmsSite",
            sortColumn: "Id",
            sortType: 0,
            filterText: "Title",
            showAddDialog: false,
            rowPerPage: 200,
            scope: cmsModuleSaleSerial,
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
                    },
                    {
                        name: "Description",
                        displayName: "توضیحات",
                        sortable: true,
                        type: "string"
                    }
                ]
            }
        };
        //#help/ سلکتور سایت خریدار
        cmsModuleSaleSerial.LinkSiteIdBuyerSelector = {
            displayMember: "Title",
            id: "Id",
            fId: "LinkSiteIdBuyer",
            url: "CmsSite",
            sortColumn: "Id",
            sortType: 0,
            filterText: "Title",
            showAddDialog: false,
            rowPerPage: 200,
            scope: cmsModuleSaleSerial,
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
                    },
                    {
                        name: "Description",
                        displayName: "توضیحات",
                        sortable: true,
                        type: "string"
                    }
                ]
            }
        };
        // Grid Options
        cmsModuleSaleSerial.gridOptions = {
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
                    name: "Id",
                    displayName: "کد سیستمی",
                    sortable: true,
                    type: "integer",
                    visible: "true"
                },
                {
                    name: "LinkSiteId",
                    displayName: "کد سیستمی سایت",
                    sortable: true,
                    type: "integer",
                    visible: true
                },
                {
                    name: "CreatedDate",
                    displayName: "ساخت",
                    sortable: true,
                    isDate: true,
                    type: "date",
                    visible: "true"
                },
                {
                    name: "UpdatedDate",
                    displayName: "ویرایش",
                    sortable: true,
                    isDate: true,
                    type: "date",
                    visible: "true"
                },
                {
                    name: "Description",
                    displayName: " توضیحات",
                    sortable: true,
                    type: "string",
                    visible: "true"
                },
                {
                    name: "MaxExpireToUse",
                    displayName: "تاریخ پایان",
                    sortable: true,
                    isDate: true,
                    type: "date",
                    visible: "true"
                }
            ],
            data: {},
            multiSelect: false,
            advancedSearchData: {
                engine: {}
            }
        };
        ////Comment Grid Options
        //cmsModuleSaleSerial.gridContentOptions = {
        //  columns: [
        //    {
        //      name: "Id",
        //      displayName: "کد سیستمی",
        //      sortable: true,
        //      type: "integer"
        //    },
        //    {
        //      name: "LinkSiteId",
        //      displayName: "کد سیستمی سایت",
        //      sortable: true,
        //      type: "integer",
        //      visible: true
        //    },
        //    {
        //      name: "Writer",
        //      displayName: "نویسنده",
        //      sortable: true,
        //      type: "string"
        //    },
        //    {
        //      name: "Comment",
        //      displayName: "کامنت",
        //      sortable: true,
        //      type: "string"
        //    },
        //    {
        //      name: "ActionButtons",
        //      displayName: "کلید عملیاتی",
        //      template:
        //        '<Button ng-if="!x.IsActivated" ng-click="cmsModuleSaleSerial.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button>' +
        //          '<Button ng-if="x.IsActivated" ng-click="cmsModuleSaleSerial.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button>' +
        //          '<Button ng-click="cmsModuleSaleSerial.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>'
        //    }
        //  ],
        //  data: {},
        //  multiSelect: false,
        //  showUserSearchPanel: false,
        //  advancedSearchData: {
        //    engine: {
        //      CurrentPageNumber: 1,
        //      SortColumn: "Id",
        //      SortType: 1,
        //      NeedToRunFakePagination: false,
        //      TotalRowData: 2000,
        //      RowPerPage: 20,
        //      ContentFullSearch: null,
        //      Filters: [],
        //      Count: false
        //    }
        //  }
        //};

        //cmsModuleSaleSerial.summernoteOptions = {
        //  height: 300,
        //  focus: true,
        //  airMode: false,
        //  toolbar: [
        //    ["edit", ["undo", "redo"]],
        //    ["headline", ["style"]],
        //    [
        //      "style",
        //      [
        //        "bold",
        //        "italic",
        //        "underline",
        //        "superscript",
        //        "subscript",
        //        "strikethrough",
        //        "clear"
        //      ]
        //    ],
        //    ["fontface", ["fontname"]],
        //    ["textsize", ["fontsize"]],
        //    ["fontclr", ["color"]],
        //    ["alignment", ["ul", "ol", "paragraph", "lineheight"]],
        //    ["height", ["height"]],
        //    ["table", ["table"]],
        //['insert',['ltr','rtl']],
        //    ["insert", ["link", "picture", "video", "hr"]],
        //    ["view", ["fullscreen", "codeview"]],
        //    ["help", ["help"]]
        //  ]
        //};
        //#tagsInput -----
        //cmsModuleSaleSerial.onTagAdded = function(tag) {
        //  if (!angular.isDefined(tag.id)) {
        //    //Check if this a new or a existing tag (existing tags comprise with an id)
        //    var tagObject = jQuery.extend({}, cmsModuleSaleSerial.ModuleTag); //#Clone a Javascript Object
        //    tagObject.Title = tag.text;
        //    ajax
        //      .call("/api/ArticleTag/add", tagObject, "POST")
        //      .success(function(response) {
        //        rashaErManage.checkAction(response);
        //        if (response.IsSuccess) {
        //          cmsModuleSaleSerial.tags[cmsModuleSaleSerial.tags.length - 1] = {
        //            id: response.Item.Id,
        //            text: response.Item.Title
        //          }; //Replace the newly added tag (last in the array) with a new object including its Id
        //        }
        //      })
        //      .error(function(data, errCode, c, d) {
        //        rashaErManage.checkAction(data, errCode);
        //      });
        //  }
        //};
        //cmsModuleSaleSerial.onTagRemoved = function(tag) {};
        //For Show Category Loading Indicator
        cmsModuleSaleSerial.categoryBusyIndicator = {
            isActive: true,
            message: "در حال بارگذاری دسته ها ..."
        };
        //For Show Article Loading Indicator
        cmsModuleSaleSerial.contentBusyIndicator = {
            isActive: false,
            message: "در حال بارگذاری ..."
        };
        //Tree Config
        cmsModuleSaleSerial.treeConfig = {
            displayMember: "Id",
            displayId: "Id",
            displayChild: "Children",
            displayLinkParentId: "LinkParentId"
        };

        //open addMenu modal
        cmsModuleSaleSerial.addMenu = function () {

            $modal.open({
                templateUrl: "cpanelv1/ModuleCore/cmsModuleSaleSerial/modalMenu.html",
                scope: $scope
            });
        };
        cmsModuleSaleSerial.openmodalUse = function () {
            cmsModuleSaleSerial.addRequested = true;
            $modal.open({
                templateUrl: "cpanelv1/ModuleCore/cmsModuleSaleSerial/Chekmodal.html",
                scope: $scope
            });
        };
        cmsModuleSaleSerial.addmodalUse = function (frm) {
            if (frm.$invalid) {
                rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
                return;
            }
            ajax
                .call(cmsServerConfig.configApiServerPath + "CoreModuleSaleSerial/CheckUseSerialForSite", cmsModuleSaleSerial.checkItem, "POST")
                .success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsModuleSaleSerial.categoryBusyIndicator.isActive = false;
                    console.log(response.ListItems);
                    if (response.IsSuccess) {
                        cmsModuleSaleSerial.addRequested = false;
                        cmsModuleSaleSerial.gridOptionsdetail.fillData(
                            response.ListItems,
                            response.resultAccess
                        );
                    }
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    cmsModuleSaleSerial.addRequested = false;
                    cmsModuleSaleSerial.categoryBusyIndicator.isActive = false;
                });

        };

        cmsModuleSaleSerial.registerSerial = function () {
            rashaErManage.showYesNo(
                ($filter('translatentk')('warning')),
                "آیا می خواهید این سریال را ثبت کنید",
                function (isConfirmed) {
                    if (isConfirmed) {
                        ajax.call(cmsServerConfig.configApiServerPath+"CoreModuleSaleSerial/RegisterUseSerialForSite", cmsModuleSaleSerial.checkItem, "POST")
                            .success(function (response1) {
                                rashaErManage.checkAction(response1);
                                cmsModuleSaleSerial.categoryBusyIndicator.isActive = false;
                                if (response1.IsSuccess) {
                                    rashaErManage.showMessage("ثبت با موفقیت انجام شد  ");

                                    cmsModuleSaleSerial.closeModal();
                                }
                            })
                            .error(function (data, errCode, c, d) {
                                rashaErManage.checkAction(data, errCode);
                                cmsModuleSaleSerial.addRequested = false;
                                cmsModuleSaleSerial.categoryBusyIndicator.isActive = false;
                            });
                    }
                });
        }

        cmsModuleSaleSerial.gridOptionsdetail = {
            columns: [
                { name: 'virtual_Module.Title', displayName: 'عنوان ماژول', sortable: true, type: 'string', visible: true },
                { name: 'SalePrice', displayName: 'قیمت', sortable: true, type: "integer" },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: "string" },
                { name: 'ErrorMessage', displayName: 'پیغام خطا', sortable: true, type: "string", style: 'color:red' },
                { name: 'FromDate', displayName: 'تاریخ آغاز', sortable: true, isDate: true, type: 'date', visible: 'true' },
                { name: 'ToDate', displayName: 'تاریخ پایان', sortable: true, isDate: true, type: 'date', visible: 'true' }
            ],
            data: {},
            multiSelect: false,
            advancedSearchData: {
                engine: {}
            }
        }
        cmsModuleSaleSerial.treeConfig.currentNode = {};
        cmsModuleSaleSerial.treeBusyIndicator = false;

        cmsModuleSaleSerial.addRequested = false;

        cmsModuleSaleSerial.showGridComment = false;
        //cmsModuleSaleSerial.articleTitle = "";

        //init Function
        cmsModuleSaleSerial.init = function () {
            ajax
                .call(cmsServerConfig.configApiServerPath + "CoreModuleSaleHeader/getall", { RowPerPage: 1000 }, "POST")
                .success(function (response) {
                    cmsModuleSaleSerial.treeConfig.Items = response.ListItems;
                    cmsModuleSaleSerial.categoryBusyIndicator.isActive = false;
                })
                .error(function (data, errCode, c, d) {
                    console.log(data);
                });

            ajax
                .call(
                    cmsServerConfig.configApiServerPath+"CoreModuleSaleSerial/getall",
                    cmsModuleSaleSerial.gridOptions.advancedSearchData.engine,
                    "POST"
                )
                .success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsModuleSaleSerial.ListItems = response.ListItems;
                    cmsModuleSaleSerial.gridOptions.fillData(
                        cmsModuleSaleSerial.ListItems,
                        response.resultAccess
                    ); // Sending Access as an argument
                    cmsModuleSaleSerial.contentBusyIndicator.isActive = false;
                    cmsModuleSaleSerial.gridOptions.currentPageNumber =
                        response.CurrentPageNumber;
                    cmsModuleSaleSerial.gridOptions.totalRowCount = response.TotalRowCount;
                    cmsModuleSaleSerial.gridOptions.rowPerPage = response.RowPerPage;
                    cmsModuleSaleSerial.gridOptions.maxSize = 5;
                })
                .error(function (data, errCode, c, d) {
                    cmsModuleSaleSerial.gridOptions.fillData();
                    rashaErManage.checkAction(data, errCode);
                    cmsModuleSaleSerial.contentBusyIndicator.isActive = false;
                });
  
        };
      

        cmsModuleSaleSerial.gridOptions.onRowSelected = function () {
            var item = cmsModuleSaleSerial.gridOptions.selectedRow.item;
            cmsModuleSaleSerial.showComment(item);
        };

        //cmsModuleSaleSerial.gridContentOptions.onRowSelected = function() {};

        // Open Add Category Modal
        cmsModuleSaleSerial.addNewCategoryModel = function () {
            if (buttonIsPressed) {
                return;
            }
            cmsModuleSaleSerial.addRequested = false;
            buttonIsPressed = true;
            ajax
                .call(cmsServerConfig.configApiServerPath + "CoreModuleSaleHeader/GetViewModel", "", "GET")
                .success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    cmsModuleSaleSerial.selectedItem = response.Item;
                    //Set dataForTheTree
                    var filterModelParentRootFolders = {
                        Filters: [
                            {
                                PropertyName: "LinkParentId",
                                IntValue1: null,
                                SearchType: 0,
                                IntValueForceNullSearch: true
                            }
                        ]
                    };
                    ajax
                        .call(
                            cmsServerConfig.configApiServerPath+"FileCategory/getAll",
                            filterModelParentRootFolders,
                            "POST"
                        )
                        .success(function (response1) {
                            //Get root directories
                            cmsModuleSaleSerial.dataForTheTree = response1.ListItems;
                            var filterModelRootFiles = {
                                Filters: [
                                    {
                                        PropertyName: "LinkCategoryId",
                                        SearchType: 0,
                                        IntValue1: null,
                                        IntValueForceNullSearch: true
                                    }
                                ]
                            };
                            ajax
                                .call(
                                    cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory",
                                    filterModelRootFiles,
                                    "POST"
                                )
                                .success(function (response2) {
                                    //Get files in root
                                    Array.prototype.push.apply(
                                        cmsModuleSaleSerial.dataForTheTree,
                                        response2.ListItems
                                    );
                                    $modal.open({
                                        templateUrl:
                                            "cpanelv1/ModuleCore/CmsModuleSaleHeader/add.html",
                                        scope: $scope
                                    });
                                    cmsModuleSaleSerial.addRequested = false;
                                })
                                .error(function (data, errCode, c, d) {
                                    console.log(data);
                                });
                        })
                        .error(function (data, errCode, c, d) {
                            console.log(data);
                        });
                    //-----
                    //$modal.open({
                    //    templateUrl: 'cpanelv1/ModuleCore/CmsModuleSaleHeader/add.html',
                    //    scope: $scope
                    //});
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
        };
        // Open Edit Category Modal
        cmsModuleSaleSerial.editCategoryModel = function () {
            if (buttonIsPressed) {
                return;
            }
            cmsModuleSaleSerial.addRequested = false;
            cmsModuleSaleSerial.modalTitle = "ویرایش";
            if (!cmsModuleSaleSerial.treeConfig.currentNode) {
                rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
                return;
            }

            cmsModuleSaleSerial.contentBusyIndicator.isActive = true;
            buttonIsPressed = true;
            ajax
                .call(
                    cmsServerConfig.configApiServerPath+"CoreModuleSaleHeader/GetOne",
                    cmsModuleSaleSerial.treeConfig.currentNode.Id,
                    "GET"
                )
                .success(function (response) {
                    buttonIsPressed = false;
                    cmsModuleSaleSerial.contentBusyIndicator.isActive = false;
                    rashaErManage.checkAction(response);
                    cmsModuleSaleSerial.selectedItem = response.Item;
                    //Set dataForTheTree
                    cmsModuleSaleSerial.selectedNode = [];
                    cmsModuleSaleSerial.expandedNodes = [];
                    cmsModuleSaleSerial.selectedItem = response.Item;
                    var filterModelParentRootFolders = {
                        Filters: [
                            {
                                PropertyName: "LinkParentId",
                                IntValue1: null,
                                SearchType: 0,
                                IntValueForceNullSearch: true
                            }
                        ]
                    };
                    ajax
                        .call(
                            cmsServerConfig.configApiServerPath+"FileCategory/getAll",
                            filterModelParentRootFolders,
                            "POST"
                        )
                        .success(function (response1) {
                            //Get root directories
                            cmsModuleSaleSerial.dataForTheTree = response1.ListItems;
                            var filterModelRootFiles = {
                                Filters: [
                                    {
                                        PropertyName: "LinkCategoryId",
                                        SearchType: 0,
                                        IntValue1: null,
                                        IntValueForceNullSearch: true
                                    }
                                ]
                            };
                            ajax
                                .call(
                                    cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory",
                                    filterModelRootFiles,
                                    "POST"
                                )
                                .success(function (response2) {
                                    //Get files in root
                                    Array.prototype.push.apply(
                                        cmsModuleSaleSerial.dataForTheTree,
                                        response2.ListItems
                                    );
                                    //Set selected files to treeControl
                                    if (cmsModuleSaleSerial.selectedItem.LinkMainImageId > 0)
                                        cmsModuleSaleSerial.onSelection(
                                            { Id: cmsModuleSaleSerial.selectedItem.LinkMainImageId },
                                            true
                                        );
                                    $modal.open({
                                        templateUrl:
                                            "cpanelv1/ModuleCore/CmsModuleSaleHeader/edit.html",
                                        scope: $scope
                                    });
                                })
                                .error(function (data, errCode, c, d) {
                                    console.log(data);
                                });
                        })
                        .error(function (data, errCode, c, d) {
                            console.log(data);
                        });
                    //---
                    //$modal.open({
                    //    templateUrl: 'cpanelv1/ModuleCore/CmsModuleSaleHeader/edit.html',
                    //    scope: $scope
                    //});
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
        };

        // Add New Category
        cmsModuleSaleSerial.addNewCategory = function (frm) {
            if (frm.$invalid) {
                rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
                return;
            }
            cmsModuleSaleSerial.categoryBusyIndicator.isActive = true;
            cmsModuleSaleSerial.addRequested = true;
            cmsModuleSaleSerial.selectedItem.LinkParentId = null;
            if (cmsModuleSaleSerial.treeConfig.currentNode != null)
                cmsModuleSaleSerial.selectedItem.LinkParentId =
                    cmsModuleSaleSerial.treeConfig.currentNode.Id;
            ajax
                .call(cmsServerConfig.configApiServerPath + "CoreModuleSaleHeader/add", cmsModuleSaleSerial.selectedItem, "POST")
                .success(function (response) {
                    cmsModuleSaleSerial.addRequested = false;
                    rashaErManage.checkAction(response);
                    console.log(response);
                    if (response.IsSuccess) {
                        cmsModuleSaleSerial.gridOptions.advancedSearchData.engine.Filters = null;
                        cmsModuleSaleSerial.gridOptions.advancedSearchData.engine.Filters = [];
                        cmsModuleSaleSerial.gridOptions.reGetAll();
                        cmsModuleSaleSerial.closeModal();
                    }
                    cmsModuleSaleSerial.categoryBusyIndicator.isActive = false;
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    cmsModuleSaleSerial.addRequested = false;
                    cmsModuleSaleSerial.categoryBusyIndicator.isActive = false;
                });
        };

        //Edit Category REST Api
        cmsModuleSaleSerial.editCategory = function (frm) {
            if (frm.$invalid) {
                rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
                return;
            }
            cmsModuleSaleSerial.addRequested = true;
            cmsModuleSaleSerial.categoryBusyIndicator.isActive = true;
            ajax
                .call(cmsServerConfig.configApiServerPath + "CoreModuleSaleHeader/edit", cmsModuleSaleSerial.selectedItem, "PUT")
                .success(function (response) {
                    cmsModuleSaleSerial.addRequested = true;
                    //cmsModuleSaleSerial.showbusy = false;
                    cmsModuleSaleSerial.treeConfig.showbusy = false;
                    cmsModuleSaleSerial.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    if (response.IsSuccess) {
                        cmsModuleSaleSerial.addRequested = false;
                        cmsModuleSaleSerial.treeConfig.currentNode.Title = response.Item.Title;
                        cmsModuleSaleSerial.closeModal();
                    }
                    cmsModuleSaleSerial.categoryBusyIndicator.isActive = false;
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    cmsModuleSaleSerial.addRequested = false;
                    cmsModuleSaleSerial.categoryBusyIndicator.isActive = false;
                });
        };

        // Delete a Category
        cmsModuleSaleSerial.deleteCategory = function () {
            if (buttonIsPressed) {
                return;
            }
            var node = cmsModuleSaleSerial.treeConfig.currentNode;
            if (node.Id == 0 || !node.Id) {
                rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
                return;
            }
            rashaErManage.showYesNo(
                ($filter('translatentk')('warning')),
                ($filter('translatentk')('do_you_want_to_delete_this_attribute')),
                function (isConfirmed) {
                    if (isConfirmed) {
                        cmsModuleSaleSerial.categoryBusyIndicator.isActive = true;
                        // console.log(node.gridOptions.selectedRow.item);
                        buttonIsPressed = true;
                        ajax
                            .call(cmsServerConfig.configApiServerPath + "CoreModuleSaleHeader/GetOne", node.Id, "GET")
                            .success(function (response) {
                                buttonIsPressed = false;
                                rashaErManage.checkAction(response);
                                cmsModuleSaleSerial.selectedItemForDelete = response.Item;
                                console.log(cmsModuleSaleSerial.selectedItemForDelete);
                                ajax
                                    .call(
                                        cmsServerConfig.configApiServerPath+"CoreModuleSaleHeader/delete",
                                        cmsModuleSaleSerial.selectedItemForDelete,
                                        "POST"
                                    )
                                    .success(function (res) {
                                        cmsModuleSaleSerial.categoryBusyIndicator.isActive = false;
                                        if (res.IsSuccess) {
                                            cmsModuleSaleSerial.replaceCategoryItem(cmsModuleSaleSerial.treeConfig.Items, node.Id);
                                            console.log("Deleted Successfully !");
                                            cmsModuleSaleSerial.gridOptions.advancedSearchData.engine.Filters = null;
                                            cmsModuleSaleSerial.gridOptions.advancedSearchData.engine.Filters = [];
                                            cmsModuleSaleSerial.gridOptions.fillData();
                                            cmsModuleSaleSerial.gridOptions.reGetAll();
                                        } else {
                                            //Error occurred
                                            if (res.ErrorType == 15)
                                                rashaErManage.showMessage(
                                                    ($filter('translatentk')('unable_to_delete_the_category_contains_content'))
                                                );
                                        }
                                    })
                                    .error(function (data2, errCode2, c2, d2) {
                                        rashaErManage.checkAction(data2);
                                        cmsModuleSaleSerial.categoryBusyIndicator.isActive = false;
                                    });
                            })
                            .error(function (data, errCode, c, d) {
                                rashaErManage.checkAction(data, errCode);
                                cmsModuleSaleSerial.categoryBusyIndicator.isActive = false;
                            });
                    }
                }
            );
        };

        //Tree On Node Select Options
        cmsModuleSaleSerial.treeConfig.onNodeSelect = function () {
            var node = cmsModuleSaleSerial.treeConfig.currentNode;
            cmsModuleSaleSerial.showGridComment = false;
            //cmsModuleSaleSerial.selectedItem.LinkCategoryId = node.Id;
            cmsModuleSaleSerial.selectContent(node);
        };
        //Show Content with Category Id
        cmsModuleSaleSerial.selectContent = function (node) {
            cmsModuleSaleSerial.gridOptions.advancedSearchData.engine.Filters = null;
            cmsModuleSaleSerial.gridOptions.advancedSearchData.engine.Filters = [];
            if (node != null && node != undefined) {
                cmsModuleSaleSerial.contentBusyIndicator.message =
                    "در حال بارگذاری مقاله های  دسته " + node.Title;
                cmsModuleSaleSerial.contentBusyIndicator.isActive = true;
                //cmsModuleSaleSerial.gridOptions.advancedSearchData = {};


                //cmsModuleSaleSerial.attachedFiles = null;
                //cmsModuleSaleSerial.attachedFiles = [];
                var s = {
                    PropertyName: "LinkCategoryId",
                    IntValue1: node.Id,
                    SearchType: 0
                };
                cmsModuleSaleSerial.gridOptions.advancedSearchData.engine.Filters.push(s);
            }
            ajax
                .call(
                    cmsServerConfig.configApiServerPath+"CoreModuleSaleSerial/getall",
                    cmsModuleSaleSerial.gridOptions.advancedSearchData.engine,
                    "POST"
                )
                .success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsModuleSaleSerial.contentBusyIndicator.isActive = false;
                    cmsModuleSaleSerial.ListItems = response.ListItems;
                    cmsModuleSaleSerial.gridOptions.fillData(
                        cmsModuleSaleSerial.ListItems,
                        response.resultAccess
                    ); // Sending Access as an argument
                    cmsModuleSaleSerial.gridOptions.currentPageNumber =
                        response.CurrentPageNumber;
                    cmsModuleSaleSerial.gridOptions.totalRowCount = response.TotalRowCount;
                    cmsModuleSaleSerial.gridOptions.rowPerPage = response.RowPerPage;
                    cmsModuleSaleSerial.gridOptions.maxSize = 5;
                })
                .error(function (data, errCode, c, d) {
                    cmsModuleSaleSerial.gridOptions.fillData();
                    rashaErManage.checkAction(data, errCode);
                });
        };
        // Open Add New Content Model
        cmsModuleSaleSerial.addNewContentModel = function () {
            if (buttonIsPressed) {
                return;
            }
            var node = cmsModuleSaleSerial.treeConfig.currentNode;
            if (node.Id == 0 || !node.Id) {
                rashaErManage.showMessage(
                    ($filter('translatentk')('To_Add_Content_Please_Select_The_Category'))
                );
                return;
            }
            //cmsModuleSaleSerial.attachedFiles = [];
            //cmsModuleSaleSerial.attachedFile = "";
            //cmsModuleSaleSerial.filePickerMainImage.filename = "";
            //cmsModuleSaleSerial.filePickerMainImage.fileId = null;
            //cmsModuleSaleSerial.filePickerFiles.filename = "";
            //cmsModuleSaleSerial.filePickerFiles.fileId = null;
            //cmsModuleSaleSerial.tags = [];   //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
            //cmsModuleSaleSerial.kwords = [];   //tagsInput خالی کردن آرایه کلمات کلیدی برای محتوای جدید
            cmsModuleSaleSerial.addRequested = false;
            cmsModuleSaleSerial.modalTitle = "اضافه کردن محتوای جدید";
            addNewContentModel = true;
            buttonIsPressed = true;
            ajax
                .call(cmsServerConfig.configApiServerPath + "CoreModuleSaleSerial/GetViewModel", "", "GET")
                .success(function (response) {
                    buttonIsPressed = false;
                    addNewContentModel = false;
                    console.log(response);
                    rashaErManage.checkAction(response);
                    cmsModuleSaleSerial.selectedItem = response.Item;
                    //cmsModuleSaleSerial.selectedItem.OtherInfos = [];
                    //cmsModuleSaleSerial.selectedItem.Similars = [];
                    cmsModuleSaleSerial.selectedItem.LinkModuleSaleHeaderId = node.Id;
                    //cmsModuleSaleSerial.selectedItem.LinkFileIds = null;
                    //cmsModuleSaleSerial.clearPreviousData();

                    //#help دریافت پارامترهای مربوطه
                    //cmsModuleSaleSerial.getparameter(cmsModuleSaleSerial.selectedItem.LinkModuleSaleHeader);

                    $modal.open({
                        templateUrl: "cpanelv1/ModuleCore/cmsModuleSaleSerial/add.html",
                        scope: $scope
                    });
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
        };

        // Open Edit Content Modal
        cmsModuleSaleSerial.openEditModel = function () {
            if (buttonIsPressed) {
                return;
            }
            cmsModuleSaleSerial.addRequested = false;
            cmsModuleSaleSerial.modalTitle = "ویرایش";
            if (!cmsModuleSaleSerial.gridOptions.selectedRow.item) {
                rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
                return;
            }
            buttonIsPressed = true;
            ajax
                .call(
                    cmsServerConfig.configApiServerPath+"CoreModuleSaleSerial/GetOne",
                    cmsModuleSaleSerial.gridOptions.selectedRow.item.Id,
                    "GET"
                )
                .success(function (response1) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response1);
                    cmsModuleSaleSerial.selectedItem = response1.Item;
                    cmsModuleSaleSerial.MaxExpireToUse.defaultDate =
                        cmsModuleSaleSerial.selectedItem.MaxExpireToUse;
                    cmsModuleSaleSerial.startDate.defaultDate =
                        cmsModuleSaleSerial.selectedItem.FromDate;
                    cmsModuleSaleSerial.endDate.defaultDate =
                        cmsModuleSaleSerial.selectedItem.ToDate;
                    
                    $modal.open({
                        templateUrl: "cpanelv1/ModuleCore/cmsModuleSaleSerial/edit.html",
                        scope: $scope
                    });
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
        };
        // Add New Content
        cmsModuleSaleSerial.addNewContent = function (frm) {
            if (frm.$invalid) {
                rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
                return;
            }
          
            if (
                cmsModuleSaleSerial.selectedItem.LinkModuleSaleHeaderId == null ||
                cmsModuleSaleSerial.selectedItem.LinkModuleSaleHeaderId == 0
            ) {
                rashaErManage.showMessage(
                    ($filter('translatentk')('To_Add_Content_Please_Select_The_Category'))
                );
                return;
            }
           
            ajax
                .call(cmsServerConfig.configApiServerPath + "CoreModuleSaleSerial/add", cmsModuleSaleSerial.selectedItem, "POST")
                .success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsModuleSaleSerial.categoryBusyIndicator.isActive = false;
                    if (response.IsSuccess) {
                        cmsModuleSaleSerial.ListItems.unshift(response.Item);
                        cmsModuleSaleSerial.gridOptions.fillData(cmsModuleSaleSerial.ListItems);
                        cmsModuleSaleSerial.closeModal();
                        //Save inputTags
                        cmsModuleSaleSerial.selectedItem.ContentTags = [];
                        $.each(cmsModuleSaleSerial.tags, function (index, item) {
                            var newObject = $.extend({}, cmsModuleSaleSerial.ModuleContentTag);
                            newObject.LinkTagId = item.id;
                            newObject.LinkContentId = response.Item.Id;
                            cmsModuleSaleSerial.selectedItem.ContentTags.push(newObject);
                        });
                    
                    }
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    cmsModuleSaleSerial.addRequested = false;
                    cmsModuleSaleSerial.categoryBusyIndicator.isActive = false;
                });
        };

        //Edit Content
        cmsModuleSaleSerial.editContent = function (frm) {
            if (frm.$invalid) {
                rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
                return;
            }
            cmsModuleSaleSerial.categoryBusyIndicator.isActive = true;
            cmsModuleSaleSerial.addRequested = true;

            //Save attached file ids into cmsModuleSaleSerial.selectedItem.LinkFileIds
            //cmsModuleSaleSerial.selectedItem.LinkFileIds = "";
            //cmsModuleSaleSerial.stringfyLinkFileIds();
            //Save inputTags
            //cmsModuleSaleSerial.selectedItem.ContentTags = [];
            //$.each(cmsModuleSaleSerial.tags, function (index, item) {
            //    var newObject = $.extend({}, cmsModuleSaleSerial.ModuleContentTag);
            //    newObject.LinkTagId = item.id;
            //    newObject.LinkContentId = cmsModuleSaleSerial.selectedItem.Id;
            //    cmsModuleSaleSerial.selectedItem.ContentTags.push(newObject);
            //});
            //Save Keywords
            //$.each(cmsModuleSaleSerial.kwords, function (index, item) {
            //    if (index == 0)
            //        cmsModuleSaleSerial.selectedItem.Keyword = item.text;
            //    else
            //        cmsModuleSaleSerial.selectedItem.Keyword += ',' + item.text;
            //});
            if (
                cmsModuleSaleSerial.selectedItem.LinkModuleSaleHeaderId == null ||
                cmsModuleSaleSerial.selectedItem.LinkModuleSaleHeaderId == 0
            ) {
                rashaErManage.showMessage(
                    ($filter('translatentk')('To_Add_Content_Please_Select_The_Category'))
                );
                return;
            }
            if (
                cmsModuleSaleSerial.selectedItem.LinkModuleSaleHeaderId == null ||
                cmsModuleSaleSerial.selectedItem.LinkModuleSaleHeaderId == 0
            ) {
                rashaErManage.showMessage(
                    ($filter('translatentk')('To_Add_Content_Please_Select_The_Category'))
                );
                return;
            }
            //var apiSelectedItem = jQuery.extend(true, {},cmsModuleSaleSerial.selectedItem);
            //if (apiSelectedItem.Similars)
            //  $.each(apiSelectedItem.Similars, function(index, item) {
            //    item.Destination = [];
            //  });
            ajax
                .call(cmsServerConfig.configApiServerPath + "CoreModuleSaleSerial/edit", cmsModuleSaleSerial.selectedItem, "PUT")
                .success(function (response) {
                    cmsModuleSaleSerial.categoryBusyIndicator.isActive = false;
                    cmsModuleSaleSerial.addRequested = false;
                    cmsModuleSaleSerial.treeConfig.showbusy = false;
                    cmsModuleSaleSerial.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    if (response.IsSuccess) {
                        cmsModuleSaleSerial.replaceItem(
                            cmsModuleSaleSerial.selectedItem.Id,
                            response.Item
                        );
                        cmsModuleSaleSerial.gridOptions.fillData(cmsModuleSaleSerial.ListItems);
                        cmsModuleSaleSerial.closeModal();
                    }
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    cmsModuleSaleSerial.addRequested = false;
                    cmsModuleSaleSerial.categoryBusyIndicator.isActive = false;
                });
        };
        //#help similar & otherinfo
        //    cmsModuleSaleSerial.clearPreviousData = function() {
        //      cmsModuleSaleSerial.selectedItem.Similars = [];
        //      $("#to").empty();
        //    };
        //
        //
        //    cmsModuleSaleSerial.moveSelected = function(from, to, calculatePrice) {
        //      if (from == "Content") {
        //        //var title = cmsModuleSaleSerial.ItemListIdSelector.selectedItem.Title;
        //        // var optionSelectedPrice = cmsModuleSaleSerial.ItemListIdSelector.selectedItem.Price;
        //        if (
        //          cmsModuleSaleSerial.selectedItem.LinkDestinationId != undefined &&
        //          cmsModuleSaleSerial.selectedItem.LinkDestinationId != null
        //        ) {
        //          if (cmsModuleSaleSerial.selectedItem.Similars == undefined)
        //            cmsModuleSaleSerial.selectedItem.Similars = [];
        //          for (var i = 0; i < cmsModuleSaleSerial.selectedItem.Similars.length; i++) {
        //            if (
        //              cmsModuleSaleSerial.selectedItem.Similars[i].LinkDestinationId ==
        //              cmsModuleSaleSerial.selectedItem.LinkDestinationId
        //            ) {
        //              rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
        //              return;
        //            }
        //          }
        //          // if (cmsModuleSaleSerial.selectedItem.Title == null || cmsModuleSaleSerial.selectedItem.Title.length < 0)
        //          //     cmsModuleSaleSerial.selectedItem.Title = title;
        //          cmsModuleSaleSerial.selectedItem.Similars.push({
        //            //Id: 0,
        //            //Source: from,
        //            LinkDestinationId: cmsModuleSaleSerial.selectedItem.LinkDestinationId,
        //            Destination: cmsModuleSaleSerial.LinkDestinationIdSelector.selectedItem
        //          });
        //        }
        //      }
        //    };
        //     cmsModuleSaleSerial.moveSelectedOtherInfo = function(from, to,y) {
        //
        //
        //             if (cmsModuleSaleSerial.selectedItem.OtherInfos == undefined)
        //                cmsModuleSaleSerial.selectedItem.OtherInfos = [];
        //              for (var i = 0; i < cmsModuleSaleSerial.selectedItem.OtherInfos.length; i++) {
        //
        //                if (cmsModuleSaleSerial.selectedItem.OtherInfos[i].Title == cmsModuleSaleSerial.selectedItemOtherInfos.Title && cmsModuleSaleSerial.selectedItem.OtherInfos[i].HtmlBody ==cmsModuleSaleSerial.selectedItemOtherInfos.HtmlBody && cmsModuleSaleSerial.selectedItem.OtherInfos[i].Source ==cmsModuleSaleSerial.selectedItemOtherInfos.Source)
        //                {
        //                  rashaErManage.showMessage($filter('translatentk')('Information_Is_Duplicate'));
        //                  return;
        //                }
        //
        //              }
        //             if (cmsModuleSaleSerial.selectedItemOtherInfos.Title == "" && cmsModuleSaleSerial.selectedItemOtherInfos.Source =="" && cmsModuleSaleSerial.selectedItemOtherInfos.HtmlBody =="")
        //                {
        //                    rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
        //                }
        //             else
        //               {
        //
        //             cmsModuleSaleSerial.selectedItem.OtherInfos.push({
        //                Title:cmsModuleSaleSerial.selectedItemOtherInfos.Title,
        //                HtmlBody:cmsModuleSaleSerial.selectedItemOtherInfos.HtmlBody,
        //                Source:cmsModuleSaleSerial.selectedItemOtherInfos.Source
        //              });
        //              cmsModuleSaleSerial.selectedItemOtherInfos.Title="";
        //              cmsModuleSaleSerial.selectedItemOtherInfos.Source="";
        //              cmsModuleSaleSerial.selectedItemOtherInfos.HtmlBody="";
        //             }
        //             if(edititem)
        //               {
        //                   edititem=false;
        //               }
        //
        //        };
        //
        //    cmsModuleSaleSerial.removeFromCollection = function(listsimilar,iddestination) {
        //      for (var i = 0; i < cmsModuleSaleSerial.selectedItem.Similars.length; i++)
        //       {
        //            if(listsimilar[i].LinkDestinationId==iddestination)
        //            {
        //                cmsModuleSaleSerial.selectedItem.Similars.splice(i, 1);
        //                return;
        //            }
        //
        //      }
        //
        //    };
        //   cmsModuleSaleSerial.removeFromOtherInfo = function(listOtherInfo,title,body,source) {
        //    for (var i = 0; i < cmsModuleSaleSerial.selectedItem.OtherInfos.length; i++)
        //       {
        //            if(listOtherInfo[i].Title==title && listOtherInfo[i].HtmlBody==body && listOtherInfo[i].Source==source)
        //            {
        //              cmsModuleSaleSerial.selectedItem.OtherInfos.splice(i, 1);
        //              return;
        //            }
        //       }
        //    };
        //   cmsModuleSaleSerial.editOtherInfo = function(y) {
        //      edititem=true;
        //      cmsModuleSaleSerial.selectedItemOtherInfos.Title=y.Title;
        //      cmsModuleSaleSerial.selectedItemOtherInfos.HtmlBody=y.HtmlBody;
        //      cmsModuleSaleSerial.selectedItemOtherInfos.Source=y.Source;
        //      cmsModuleSaleSerial.removeFromOtherInfo(cmsModuleSaleSerial.selectedItem.OtherInfos,y.Title,y.HtmlBody,y.Source);
        //    };

        //#help
        // Delete a  Content
        cmsModuleSaleSerial.deleteContent = function () {
            if (buttonIsPressed) {
                return;
            }
            if (!cmsModuleSaleSerial.gridOptions.selectedRow.item) {
                rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
                return;
            }
            cmsModuleSaleSerial.treeConfig.showbusy = true;
            cmsModuleSaleSerial.showIsBusy = true;
            rashaErManage.showYesNo(
                ($filter('translatentk')('warning')),
                ($filter('translatentk')('do_you_want_to_delete_this_attribute')),
                function (isConfirmed) {
                    if (isConfirmed) {
                        cmsModuleSaleSerial.categoryBusyIndicator.isActive = true;
                        console.log(cmsModuleSaleSerial.gridOptions.selectedRow.item);
                        cmsModuleSaleSerial.showbusy = true;
                        cmsModuleSaleSerial.showIsBusy = true;
                        buttonIsPressed = true;
                        ajax
                            .call(
                                cmsServerConfig.configApiServerPath+"CoreModuleSaleSerial/GetOne",
                                cmsModuleSaleSerial.gridOptions.selectedRow.item.Id,
                                "GET"
                            )
                            .success(function (response) {
                                buttonIsPressed = false;
                                cmsModuleSaleSerial.showbusy = false;
                                cmsModuleSaleSerial.showIsBusy = false;
                                rashaErManage.checkAction(response);
                                cmsModuleSaleSerial.selectedItemForDelete = response.Item;
                                console.log(cmsModuleSaleSerial.selectedItemForDelete);
                                ajax
                                    .call(
                                        cmsServerConfig.configApiServerPath+"CoreModuleSaleSerial/delete",
                                        cmsModuleSaleSerial.selectedItemForDelete,
                                        "POST"
                                    )
                                    .success(function (res) {
                                        cmsModuleSaleSerial.categoryBusyIndicator.isActive = false;
                                        cmsModuleSaleSerial.treeConfig.showbusy = false;
                                        cmsModuleSaleSerial.showIsBusy = false;
                                        rashaErManage.checkAction(res);
                                        if (res.IsSuccess) {
                                            cmsModuleSaleSerial.replaceItem(
                                                cmsModuleSaleSerial.selectedItemForDelete.Id
                                            );
                                            cmsModuleSaleSerial.gridOptions.fillData(
                                                cmsModuleSaleSerial.ListItems
                                            );
                                        }
                                    })
                                    .error(function (data2, errCode2, c2, d2) {
                                        rashaErManage.checkAction(data2);
                                        cmsModuleSaleSerial.treeConfig.showbusy = false;
                                        cmsModuleSaleSerial.showIsBusy = false;
                                        cmsModuleSaleSerial.categoryBusyIndicator.isActive = false;
                                    });
                            })
                            .error(function (data, errCode, c, d) {
                                rashaErManage.checkAction(data, errCode);
                                cmsModuleSaleSerial.treeConfig.showbusy = false;
                                cmsModuleSaleSerial.showIsBusy = false;
                                cmsModuleSaleSerial.categoryBusyIndicator.isActive = false;
                            });
                    }
                }
            );
        };

        //Confirm/UnConfirm  Content
        cmsModuleSaleSerial.confirmUnConfirmcmsModuleSaleSerial = function () {
            if (!cmsModuleSaleSerial.gridOptions.selectedRow.item) {
                rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Content'));
                return;
            }
            ajax
                .call(
                    cmsServerConfig.configApiServerPath+"CoreModuleSaleSerial/GetOne",
                    cmsModuleSaleSerial.gridOptions.selectedRow.item.Id,
                    "GET"
                )
                .success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsModuleSaleSerial.selectedItem = response.Item;
                    cmsModuleSaleSerial.selectedItem.IsAccepted = response.Item.IsAccepted ==
                        true
                        ? false
                        : true;
                    ajax
                        .call(cmsServerConfig.configApiServerPath + "CoreModuleSaleSerial/edit", cmsModuleSaleSerial.selectedItem, "PUT")
                        .success(function (response2) {
                            rashaErManage.checkAction(response2);
                            if (response2.IsSuccess) {
                                var index = cmsModuleSaleSerial.ListItems.indexOf(
                                    cmsModuleSaleSerial.gridOptions.selectedRow.item
                                );
                                if (index !== -1) {
                                    cmsModuleSaleSerial.ListItems[index] = response2.Item;
                                }
                            }
                        })
                        .error(function (data, errCode, c, d) {
                            rashaErManage.checkAction(data, errCode);
                        });
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
        };

        //Add To Archive New Content
        cmsModuleSaleSerial.enableArchive = function () {
            if (!cmsModuleSaleSerial.gridOptions.selectedRow.item) {
                rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Content'));
                return;
            }
            ajax
                .call(
                    cmsServerConfig.configApiServerPath+"CoreModuleSaleSerial/GetOne",
                    cmsModuleSaleSerial.gridOptions.selectedRow.item.Id,
                    "GET"
                )
                .success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsModuleSaleSerial.selectedItem = response.Item;
                    cmsModuleSaleSerial.selectedItem.IsArchive = response.Item.IsArchive ==
                        true
                        ? false
                        : true;
                    ajax
                        .call(cmsServerConfig.configApiServerPath + "CoreModuleSaleSerial/edit", cmsModuleSaleSerial.selectedItem, "PUT")
                        .success(function (response2) {
                            cmsModuleSaleSerial.categoryBusyIndicator.isActive = true;
                            rashaErManage.checkAction(response2);
                            if (response2.IsSuccess) {
                                var index = cmsModuleSaleSerial.ListItems.indexOf(
                                    cmsModuleSaleSerial.gridOptions.selectedRow.item
                                );
                                if (index !== -1) {
                                    cmsModuleSaleSerial.ListItems[index] = response2.Item;
                                }
                                cmsModuleSaleSerial.categoryBusyIndicator.isActive = false;
                            }
                        })
                        .error(function (data, errCode, c, d) {
                            rashaErManage.checkAction(data, errCode);
                            cmsModuleSaleSerial.categoryBusyIndicator.isActive = false;
                        });
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    cmsModuleSaleSerial.categoryBusyIndicator.isActive = false;
                });
        };

        //Replace Item OnDelete/OnEdit Grid Options
        cmsModuleSaleSerial.replaceItem = function (oldId, newItem) {
            angular.forEach(cmsModuleSaleSerial.ListItems, function (item, key) {
                if (item.Id == oldId) {
                    var index = cmsModuleSaleSerial.ListItems.indexOf(item);
                    cmsModuleSaleSerial.ListItems.splice(index, 1);
                }
            });
            if (newItem) cmsModuleSaleSerial.ListItems.unshift(newItem);
        };

        cmsModuleSaleSerial.summernoteText =
            "<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />";
        cmsModuleSaleSerial.searchData = function () {
            cmsModuleSaleSerial.categoryBusyIndicator.isActive = true;
            ajax
                .call(
                    cmsServerConfig.configApiServerPath+"CoreModuleSaleSerial/getall",
                    cmsModuleSaleSerial.gridOptions.advancedSearchData.engine,
                    "POST"
                )
                .success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsModuleSaleSerial.categoryBusyIndicator.isActive = false;
                    cmsModuleSaleSerial.ListItems = response.ListItems;
                    cmsModuleSaleSerial.gridOptions.fillData(cmsModuleSaleSerial.ListItems);
                    cmsModuleSaleSerial.gridOptions.currentPageNumber =
                        response.CurrentPageNumber;
                    cmsModuleSaleSerial.gridOptions.totalRowCount = response.TotalRowCount;
                    cmsModuleSaleSerial.gridOptions.rowPerPage = response.RowPerPage;
                    cmsModuleSaleSerial.gridOptions.maxSize = 5;
                    cmsModuleSaleSerial.allowedSearch = response.AllowedSearchField;
                })
                .error(function (data, errCode, c, d) {
                    cmsModuleSaleSerial.gridOptions.fillData();
                    rashaErManage.checkAction(data, errCode);
                });
        };

        //Close Model Stack
        cmsModuleSaleSerial.addRequested = false;
        cmsModuleSaleSerial.closeModal = function () {
            $modalStack.dismissAll();
        };

        cmsModuleSaleSerial.showIsBusy = false;

        //Aprove a comment
        //    cmsModuleSaleSerial.confirmComment = function (item) {
        //        console.log("This comment will be confirmed:", item);
        //    }
        //
        //    //Decline a comment
        //    cmsModuleSaleSerial.doNotConfirmComment = function (item) {
        //        console.log("This comment will not be confirmed:", item);
        //
        //    }
        //    //Remove a comment
        //    cmsModuleSaleSerial.deleteComment = function (item) {
        //        if (!cmsModuleSaleSerial.gridContentOptions.selectedRow.item) {
        //            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
        //            return;
        //        }
        //        cmsModuleSaleSerial.treeConfig.showbusy = true;
        //        cmsModuleSaleSerial.showIsBusy = true;
        //        rashaErManage.showYesNo(($filter('translatentk')('warning')), "آیا می خواهید این نظر را حذف کنید", function (isConfirmed) {
        //            if (isConfirmed) {
        //                console.log("Item to be deleted: ", cmsModuleSaleSerial.gridOptions.selectedRow.item);
        //                cmsModuleSaleSerial.showbusy = true;
        //                cmsModuleSaleSerial.showIsBusy = true;
        //                ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSaleSerial/GetOne', cmsModuleSaleSerial.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
        //                    cmsModuleSaleSerial.showbusy = false;
        //                    cmsModuleSaleSerial.showIsBusy = false;
        //                    rashaErManage.checkAction(response);
        //                    cmsModuleSaleSerial.selectedItemForDelete = response.Item;
        //                    console.log(cmsModuleSaleSerial.selectedItemForDelete);
        //                    ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSaleSerial/delete', cmsModuleSaleSerial.selectedItemForDelete, 'POST').success(function (res) {
        //                        cmsModuleSaleSerial.treeConfig.showbusy = false;
        //                        cmsModuleSaleSerial.showIsBusy = false;
        //                        rashaErManage.checkAction(res);
        //                        if (res.IsSuccess) {
        //                            cmsModuleSaleSerial.replaceItem(cmsModuleSaleSerial.selectedItemForDelete.Id);
        //                            cmsModuleSaleSerial.gridOptions.fillData(cmsModuleSaleSerial.ListItems);
        //                        }
        //
        //                    }).error(function (data2, errCode2, c2, d2) {
        //                        rashaErManage.checkAction(data2);
        //                        cmsModuleSaleSerial.treeConfig.showbusy = false;
        //                        cmsModuleSaleSerial.showIsBusy = false;
        //                    });
        //                }).error(function (data, errCode, c, d) {
        //                    rashaErManage.checkAction(data, errCode);
        //                    cmsModuleSaleSerial.treeConfig.showbusy = false;
        //                    cmsModuleSaleSerial.showIsBusy = false;
        //                });
        //            }
        //        });
        //    }

        //For reInit Categories
        cmsModuleSaleSerial.gridOptions.reGetAll = function () {
            if (
                cmsModuleSaleSerial.gridOptions.advancedSearchData.engine.Filters.length > 0
            )
                cmsModuleSaleSerial.searchData();
            else cmsModuleSaleSerial.init();
        };

        cmsModuleSaleSerial.openDateExpireLockAccount = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $timeout(function () {
                cmsModuleSaleSerial.focusExpireLockAccount = true;
            });
        };

        cmsModuleSaleSerial.isCurrentNodeEmpty = function () {
            return !angular.equals({}, cmsModuleSaleSerial.treeConfig.currentNode);
        };

        cmsModuleSaleSerial.loadFileAndFolder = function (item) {
            cmsModuleSaleSerial.treeConfig.currentNode = item;
            console.log(item);
            cmsModuleSaleSerial.treeConfig.onNodeSelect(item);
        };

        cmsModuleSaleSerial.openDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $timeout(function () {
                cmsModuleSaleSerial.focus = true;
            });
        };
        cmsModuleSaleSerial.openDate1 = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $timeout(function () {
                cmsModuleSaleSerial.focus1 = true;
            });
        };

        cmsModuleSaleSerial.columnCheckbox = false;
        cmsModuleSaleSerial.openGridConfigModal = function () {
            $("#gridView-btn").toggleClass("active");
            var prechangeColumns = cmsModuleSaleSerial.gridOptions.columns;
            if (cmsModuleSaleSerial.gridOptions.columnCheckbox) {
                for (var i = 0; i < cmsModuleSaleSerial.gridOptions.columns.length; i++) {
                    //cmsModuleSaleSerial.gridOptions.columns[i].visible = $("#" + cmsModuleSaleSerial.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                    var element = $(
                        "#" +
                        cmsModuleSaleSerial.gridOptions.columns[i].name.replace(".", "") +
                        "Checkbox"
                    );
                    var temp = element[0].checked;
                    cmsModuleSaleSerial.gridOptions.columns[i].visible = temp;
                }
            } else {
                for (var i = 0; i < cmsModuleSaleSerial.gridOptions.columns.length; i++) {
                    var element = $(
                        "#" +
                        cmsModuleSaleSerial.gridOptions.columns[i].name.replace(".", "") +
                        "Checkbox"
                    );
                    $(
                        "#" + cmsModuleSaleSerial.gridOptions.columns[i].name + "Checkbox"
                    ).checked =
                        prechangeColumns[i].visible;
                }
            }
            for (var i = 0; i < cmsModuleSaleSerial.gridOptions.columns.length; i++) {
                console.log(
                    cmsModuleSaleSerial.gridOptions.columns[i].name.concat(".visible: "),
                    cmsModuleSaleSerial.gridOptions.columns[i].visible
                );
            }
            cmsModuleSaleSerial.gridOptions.columnCheckbox = !cmsModuleSaleSerial.gridOptions
                .columnCheckbox;
        };

       
        cmsModuleSaleSerial.toggleCategoryButtons = function () {
            $("#categoryButtons").fadeToggle();
        }
      
        //End of Upload Modal-----------------------------------------

        //Export Report
        cmsModuleSaleSerial.exportFile = function () {
            cmsModuleSaleSerial.gridOptions.advancedSearchData.engine.ExportFile =
                cmsModuleSaleSerial.ExportFileClass;
            cmsModuleSaleSerial.addRequested = true;
            ajax
                .call(
                    cmsServerConfig.configApiServerPath+"CoreModuleSaleSerial/exportfile",
                    cmsModuleSaleSerial.gridOptions.advancedSearchData.engine,
                    "POST"
                )
                .success(function (response) {
                    cmsModuleSaleSerial.addRequested = false;
                    rashaErManage.checkAction(response);
                    if (response.IsSuccess) {
                        cmsModuleSaleSerial.exportDownloadLink =
                            window.location.origin + response.LinkFile;
                        $window.open(response.LinkFile, "_blank");
                        //cmsModuleSaleSerial.closeModal();
                    }
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
        };
        //Open Export Report Modal
        cmsModuleSaleSerial.toggleExportForm = function () {
            cmsModuleSaleSerial.SortType = [
                { key: "نزولی", value: 0 },
                { key: "صعودی", value: 1 },
                { key: "تصادفی", value: 3 }
            ];
            cmsModuleSaleSerial.EnumExportFileType = [
                { key: "Excel", value: 1 },
                { key: "PDF", value: 2 },
                { key: "Text", value: 3 }
            ];
            cmsModuleSaleSerial.EnumExportReceiveMethod = [
                { key: "دانلود", value: 0 },
                { key: "ایمیل", value: 1 },
                { key: "فایل منیجر", value: 3 }
            ];
            cmsModuleSaleSerial.ExportFileClass = {
                FileType: 1,
                RecieveMethod: 0,
                RowCount: 100
            };
            cmsModuleSaleSerial.exportDownloadLink = null;
            $modal.open({
                templateUrl: "cpanelv1/ModuleCore/cmsModuleSaleSerial/report.html",
                scope: $scope
            });
        };
        //Row Count Export Input Change
        cmsModuleSaleSerial.rowCountChanged = function () {
            if (
                !angular.isDefined(cmsModuleSaleSerial.ExportFileClass.RowCount) ||
                cmsModuleSaleSerial.ExportFileClass.RowCount > 5000
            )
                cmsModuleSaleSerial.ExportFileClass.RowCount = 5000;
        };
        //Get TotalRowCount
        cmsModuleSaleSerial.getCount = function () {
            ajax
                .call(cmsServerConfig.configApiServerPath + "CoreModuleSaleSerial/count", cmsModuleSaleSerial.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
                    cmsModuleSaleSerial.addRequested = false;
                    rashaErManage.checkAction(response);
                    cmsModuleSaleSerial.ListItemsTotalRowCount = ": " + response.TotalRowCount;
                })
                .error(function (data, errCode, c, d) {
                    cmsModuleSaleSerial.gridOptions.fillData();
                    rashaErManage.checkAction(data, errCode);
                });
        };

        cmsModuleSaleSerial.showCategoryImage = function (mainImageId) {
            if (mainImageId == 0 || mainImageId == null) return;
            ajax
                .call(cmsServerConfig.configApiServerPath + "FileContent/PreviewImage", { id: mainImageId, name: "" }, "POST")
                .success(function (response) {
                    cmsModuleSaleSerial.selectedItem.MainImageSrc = response;
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
        };
        //TreeControl
        cmsModuleSaleSerial.treeOptions = {
            nodeChildren: "Children",
            multiSelection: false,
            isLeaf: function (node) {
                if (node.FileName == undefined || node.Filename == "") return false;
                return true;
            },
            isSelectable: function (node) {
                if (cmsModuleSaleSerial.treeOptions.dirSelectable)
                    if (angular.isDefined(node.FileName)) return false;
                return true;
            },
            dirSelectable: false
        };

        cmsModuleSaleSerial.onNodeToggle = function (node, expanded) {
            if (expanded) {
                node.Children = [];
                var filterModel = { Filters: [] };
                var originalName = node.Title;
                node.messageText = " در حال بارگذاری...";
                filterModel.Filters.push({
                    PropertyName: "LinkParentId",
                    SearchType: 0,
                    IntValue1: node.Id
                });
                ajax
                    .call(cmsServerConfig.configApiServerPath + "FileCategory/GetAll", filterModel, "POST")
                    .success(function (response1) {
                        angular.forEach(response1.ListItems, function (value, key) {
                            node.Children.push(value);
                        });
                        ajax
                            .call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", node.Id, "POST")
                            .success(function (response2) {
                                angular.forEach(response2.ListItems, function (value, key) {
                                    node.Children.push(value);
                                });
                                node.messageText = "";
                            })
                            .error(function (data, errCode, c, d) {
                                console.log(data);
                            });
                    })
                    .error(function (data, errCode, c, d) {
                        console.log(data);
                    });
            }
        };

        cmsModuleSaleSerial.onSelection = function (node, selected) {
            if (!selected) {
                cmsModuleSaleSerial.selectedItem.LinkMainImageId = null;
                cmsModuleSaleSerial.selectedItem.previewImageSrc = null;
                return;
            }
            cmsModuleSaleSerial.selectedItem.LinkMainImageId = node.Id;
            cmsModuleSaleSerial.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
            ajax
                .call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", node.Id, "GET")
                .success(function (response) {
                    cmsModuleSaleSerial.selectedItem.previewImageSrc =
                        cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
                })
                .error(function (data, errCode, c, d) {
                    console.log(data);
                });
        };
        //End of TreeControl
    }
]);
