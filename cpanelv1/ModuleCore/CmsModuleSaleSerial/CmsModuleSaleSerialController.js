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
        //    locationMember:'Geolocation',
        //    locationMemberString:'GeolocationString',
        //    onlocationChanged:cmsModuleSaleSerial.locationChanged,
        //    useCurrentLocation:true,
        //    center:{lat: 33.437039, lng: 53.073182},
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
                rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
                return;
            }
            ajax
                .call(mainPathApi + "CmsModuleSaleSerial/CheckUseSerialForSite", cmsModuleSaleSerial.checkItem, "POST")
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
                ($filter('translate')('Warning')),
                "آیا می خواهید این سریال را ثبت کنید",
                function (isConfirmed) {
                    if (isConfirmed) {
                        ajax.call(mainPathApi+"CmsModuleSaleSerial/RegisterUseSerialForSite", cmsModuleSaleSerial.checkItem, "POST")
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
                .call(mainPathApi + "CmsModuleSaleHeader/getall", { RowPerPage: 1000 }, "POST")
                .success(function (response) {
                    cmsModuleSaleSerial.treeConfig.Items = response.ListItems;
                    cmsModuleSaleSerial.categoryBusyIndicator.isActive = false;
                })
                .error(function (data, errCode, c, d) {
                    console.log(data);
                });

            ajax
                .call(
                    mainPathApi+"cmsModuleSaleSerial/getall",
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
            /*ajax
              .call(mainPathApi + "ArticleTag/getviewmodel", "0", "GET")
              .success(function(response) {
                //Get a ViewModel for BiographyTag
                cmsModuleSaleSerial.ModuleTag = response.Item;
              })
              .error(function(data, errCode, c, d) {
                console.log(data);
              });
            ajax
              .call(mainPathApi + "cmsModuleSaleSerialTag/getviewmodel", "0", "GET")
              .success(function(response) {
                //Get a ViewModel for BiographyContentTag
                cmsModuleSaleSerial.ModuleContentTag = response.Item;
              })
              .error(function(data, errCode, c, d) {
                console.log(data);
              });*/
        };
        //#help دریافت پارامترهای مربوطه
        // cmsModuleSaleSerial.getparameter = function(Idparam) {
        //   var filterModelparam = { Filters: [] };
        //   filterModelparam.Filters.push({
        //     PropertyName: "LinkModuleCategoryId",
        //     SearchType: 0,
        //     IntValue1: Idparam
        //   });
        //   ajax
        //     .call(mainPathApi + "cmsModuleSaleSerialParameter/getall", filterModelparam, "POST")
        //     .success(function(response1) {
        //       cmsModuleSaleSerial.ListItemsparam = response1.ListItems;
        //     })
        //     .error(function(data, errCode, c, d) {
        //       rashaErManage.checkAction(data, errCode);
        //     });
        // };
        //#help اضافه کردن پارامترهای مربوطه
        //cmsModuleSaleSerial.getparameter = function(Idparam) {
        //  var filterModelparam = { Filters: [] };
        //  filterModelparam.Filters.push({
        //    PropertyName: "LinkModuleCategoryId",
        //    SearchType: 0,
        //    IntValue1: Idparam
        //  });
        //  ajax
        //    .call(
        //      mainPathApi+"cmsModuleSaleSerialAndParameterValue/add",
        //      filterModelparam,
        //      "POST"
        //    )
        //    .success(function(response1) {
        //      cmsModuleSaleSerial.ListItemsparam = response1.ListItems;
        //    })
        //    .error(function(data, errCode, c, d) {
        //      rashaErManage.checkAction(data, errCode);
        //    });
        //};

        // For Show Comments
        //cmsModuleSaleSerial.showComment = function() {
        //  if (cmsModuleSaleSerial.gridOptions.selectedRow.item) {
        //    //var id = cmsModuleSaleSerial.gridOptions.selectedRow.item.Id;
        //
        //    var Filter_value = {
        //      PropertyName: "LinkContentId",
        //      IntValue1: cmsModuleSaleSerial.gridOptions.selectedRow.item.Id,
        //      SearchType: 0
        //    };
        //    cmsModuleSaleSerial.gridContentOptions.advancedSearchData.engine.Filters = null;
        //    cmsModuleSaleSerial.gridContentOptions.advancedSearchData.engine.Filters = [];
        //    cmsModuleSaleSerial.gridContentOptions.advancedSearchData.engine.Filters.push(
        //      Filter_value
        //    );
        //
        //    ajax
        //      .call(
        //        mainPathApi+"ArticleComment/getall",
        //        cmsModuleSaleSerial.gridContentOptions.advancedSearchData.engine,
        //        "POST"
        //      )
        //      .success(function(response) {
        //        cmsModuleSaleSerial.listComments = response.ListItems;
        //        //cmsModuleSaleSerial.gridOptions.resultAccess = response.resultAccess; // دسترسی ها نمایش
        //        cmsModuleSaleSerial.gridContentOptions.fillData(
        //          cmsModuleSaleSerial.listComments,
        //          response.resultAccess
        //        );
        //        cmsModuleSaleSerial.gridContentOptions.currentPageNumber =
        //          response.CurrentPageNumber;
        //        cmsModuleSaleSerial.gridContentOptions.totalRowCount =
        //          response.TotalRowCount;
        //        cmsModuleSaleSerial.allowedSearch = response.AllowedSearchField;
        //        rashaErManage.checkAction(response);
        //        cmsModuleSaleSerial.gridContentOptions.rowPerPage = response.RowPerPage;
        //        cmsModuleSaleSerial.gridOptions.maxSize = 5;
        //        cmsModuleSaleSerial.showGridComment = true;
        //        cmsModuleSaleSerial.Title =
        //          cmsModuleSaleSerial.gridOptions.selectedRow.item.Title;
        //      });
        //  }
        //};

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
                .call(mainPathApi + "CmsModuleSaleHeader/getviewmodel", "0", "GET")
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
                            mainPathApi+"CmsFileCategory/getAll",
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
                                    mainPathApi+"CmsFileContent/GetFilesFromCategory",
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
                rashaErManage.showMessage($filter('translate')('Please_Select_A_Category_To_Edit'));
                return;
            }

            cmsModuleSaleSerial.contentBusyIndicator.isActive = true;
            buttonIsPressed = true;
            ajax
                .call(
                    mainPathApi+"CmsModuleSaleHeader/getviewmodel",
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
                            mainPathApi+"CmsFileCategory/getAll",
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
                                    mainPathApi+"CmsFileContent/GetFilesFromCategory",
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
                rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
                return;
            }
            cmsModuleSaleSerial.categoryBusyIndicator.isActive = true;
            cmsModuleSaleSerial.addRequested = true;
            cmsModuleSaleSerial.selectedItem.LinkParentId = null;
            if (cmsModuleSaleSerial.treeConfig.currentNode != null)
                cmsModuleSaleSerial.selectedItem.LinkParentId =
                    cmsModuleSaleSerial.treeConfig.currentNode.Id;
            ajax
                .call(mainPathApi + "CmsModuleSaleHeader/add", cmsModuleSaleSerial.selectedItem, "POST")
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
                rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
                return;
            }
            cmsModuleSaleSerial.addRequested = true;
            cmsModuleSaleSerial.categoryBusyIndicator.isActive = true;
            ajax
                .call(mainPathApi + "CmsModuleSaleHeader/edit", cmsModuleSaleSerial.selectedItem, "PUT")
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
                rashaErManage.showMessage($filter('translate')('Please_Select_A_Category_To_Remove'));
                return;
            }
            rashaErManage.showYesNo(
                ($filter('translate')('Warning')),
                ($filter('translate')('do_you_want_to_delete_this_attribute')),
                function (isConfirmed) {
                    if (isConfirmed) {
                        cmsModuleSaleSerial.categoryBusyIndicator.isActive = true;
                        // console.log(node.gridOptions.selectedRow.item);
                        buttonIsPressed = true;
                        ajax
                            .call(mainPathApi + "CmsModuleSaleHeader/getviewmodel", node.Id, "GET")
                            .success(function (response) {
                                buttonIsPressed = false;
                                rashaErManage.checkAction(response);
                                cmsModuleSaleSerial.selectedItemForDelete = response.Item;
                                console.log(cmsModuleSaleSerial.selectedItemForDelete);
                                ajax
                                    .call(
                                        mainPathApi+"CmsModuleSaleHeader/delete",
                                        cmsModuleSaleSerial.selectedItemForDelete,
                                        "DELETE"
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
                                                    ($filter('translate')('Unable_To_Delete_The_Category_Contains_Content'))
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
                    mainPathApi+"cmsModuleSaleSerial/getall",
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
                    ($filter('translate')('To_Add_Content_Please_Select_The_Category'))
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
                .call(mainPathApi + "cmsModuleSaleSerial/getviewmodel", "0", "GET")
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
                rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
                return;
            }
            buttonIsPressed = true;
            ajax
                .call(
                    mainPathApi+"cmsModuleSaleSerial/getviewmodel",
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
                    // cmsModuleSaleSerial.filePickerMainImage.filename = null;
                    //cmsModuleSaleSerial.filePickerMainImage.fileId = null;
                    //if (response1.Item.LinkMainImageId != null) {
                    //    buttonIsPressed = true;
                    //    ajax.call(mainPathApi+'CmsFileContent/getviewmodel', response1.Item.LinkMainImageId, 'GET').success(function (response2) {
                    //        buttonIsPressed = false;
                    //        cmsModuleSaleSerial.filePickerMainImage.filename = response2.Item.FileName;
                    //        cmsModuleSaleSerial.filePickerMainImage.fileId = response2.Item.Id
                    //    }).error(function (data, errCode, c, d) {
                    //        rashaErManage.checkAction(data, errCode);
                    //    });
                    //}
                    //cmsModuleSaleSerial.parseFileIds(response1.Item.LinkFileIds);
                    //cmsModuleSaleSerial.filePickerFiles.filename = null;
                    //cmsModuleSaleSerial.filePickerFiles.fileId = null;
                    //Load tagsInput
                    //cmsModuleSaleSerial.tags = [];  //Clear out previous tags
                    //if (cmsModuleSaleSerial.selectedItem.ContentTags == null)
                    //    cmsModuleSaleSerial.selectedItem.ContentTags = [];
                    //$.each(cmsModuleSaleSerial.selectedItem.ContentTags, function (index, item) {
                    //    if (item.ModuleTag != null)
                    //        cmsModuleSaleSerial.tags.push({ id: item.ModuleTag.Id, text: item.ModuleTag.Title });  //Add current content's tag to tags array with id and title
                    //});
                    //Load Keywords tagsInput
                    //cmsModuleSaleSerial.kwords = [];  //Clear out previous tags
                    //var arraykwords = [];
                    //if (cmsModuleSaleSerial.selectedItem.Keyword != null && cmsModuleSaleSerial.selectedItem.Keyword != "")
                    //    arraykwords = cmsModuleSaleSerial.selectedItem.Keyword.split(',');
                    //$.each(arraykwords, function (index, item) {
                    //    if (item != null)
                    //        cmsModuleSaleSerial.kwords.push({ text: item });  //Add current content's tag to tags array with id and title
                    //});
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
                rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
                return;
            }
            //cmsModuleSaleSerial.categoryBusyIndicator.isActive = true;
            //cmsModuleSaleSerial.addRequested = true;
            ////Save attached file ids into cmsModuleSaleSerial.selectedItem.LinkFileIds
            //cmsModuleSaleSerial.selectedItem.LinkFileIds = "";
            //cmsModuleSaleSerial.stringfyLinkFileIds();
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
                    ($filter('translate')('To_Add_Content_Please_Select_The_Category'))
                );
                return;
            }
            //var apiSelectedItem =jQuery.extend(true, {}, cmsModuleSaleSerial.selectedItem );
            //if (apiSelectedItem.Similars)
            //  $.each(apiSelectedItem.Similars, function(index, item) {
            //    item.Destination = [];
            //  });
            ajax
                .call(mainPathApi + "cmsModuleSaleSerial/add", cmsModuleSaleSerial.selectedItem, "POST")
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
                        ajax
                            .call(
                                mainPathApi+"cmsModuleSaleSerialTag/addbatch",
                                cmsModuleSaleSerial.selectedItem.ContentTags,
                                "POST"
                            )
                            .success(function (response) {
                                console.log(response);
                            })
                            .error(function (data, errCode, c, d) {
                                rashaErManage.checkAction(data, errCode);
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
                rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
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
                    ($filter('translate')('To_Add_Content_Please_Select_The_Category'))
                );
                return;
            }
            if (
                cmsModuleSaleSerial.selectedItem.LinkModuleSaleHeaderId == null ||
                cmsModuleSaleSerial.selectedItem.LinkModuleSaleHeaderId == 0
            ) {
                rashaErManage.showMessage(
                    ($filter('translate')('To_Add_Content_Please_Select_The_Category'))
                );
                return;
            }
            //var apiSelectedItem = jQuery.extend(true, {},cmsModuleSaleSerial.selectedItem);
            //if (apiSelectedItem.Similars)
            //  $.each(apiSelectedItem.Similars, function(index, item) {
            //    item.Destination = [];
            //  });
            ajax
                .call(mainPathApi + "cmsModuleSaleSerial/edit", cmsModuleSaleSerial.selectedItem, "PUT")
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
        //              rashaErManage.showMessage($filter('translate')('Content_Is_Duplicate'));
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
        //                  rashaErManage.showMessage($filter('translate')('Information_Is_Duplicate'));
        //                  return;
        //                }
        //
        //              }
        //             if (cmsModuleSaleSerial.selectedItemOtherInfos.Title == "" && cmsModuleSaleSerial.selectedItemOtherInfos.Source =="" && cmsModuleSaleSerial.selectedItemOtherInfos.HtmlBody =="")
        //                {
        //                    rashaErManage.showMessage($filter('translate')('Fields_Values_Are_Empty_Please_Enter_Values'));
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
                rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
                return;
            }
            cmsModuleSaleSerial.treeConfig.showbusy = true;
            cmsModuleSaleSerial.showIsBusy = true;
            rashaErManage.showYesNo(
                ($filter('translate')('Warning')),
                ($filter('translate')('do_you_want_to_delete_this_attribute')),
                function (isConfirmed) {
                    if (isConfirmed) {
                        cmsModuleSaleSerial.categoryBusyIndicator.isActive = true;
                        console.log(cmsModuleSaleSerial.gridOptions.selectedRow.item);
                        cmsModuleSaleSerial.showbusy = true;
                        cmsModuleSaleSerial.showIsBusy = true;
                        buttonIsPressed = true;
                        ajax
                            .call(
                                mainPathApi+"cmsModuleSaleSerial/getviewmodel",
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
                                        mainPathApi+"cmsModuleSaleSerial/delete",
                                        cmsModuleSaleSerial.selectedItemForDelete,
                                        "DELETE"
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
                rashaErManage.showMessage($filter('translate')('Please_Select_A_Content'));
                return;
            }
            ajax
                .call(
                    mainPathApi+"cmsModuleSaleSerial/getviewmodel",
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
                        .call(mainPathApi + "cmsModuleSaleSerial/edit", cmsModuleSaleSerial.selectedItem, "PUT")
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
                rashaErManage.showMessage($filter('translate')('Please_Select_A_Content'));
                return;
            }
            ajax
                .call(
                    mainPathApi+"cmsModuleSaleSerial/getviewmodel",
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
                        .call(mainPathApi + "cmsModuleSaleSerial/edit", cmsModuleSaleSerial.selectedItem, "PUT")
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
                    mainPathApi+"cmsModuleSaleSerial/getall",
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
        //            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
        //            return;
        //        }
        //        cmsModuleSaleSerial.treeConfig.showbusy = true;
        //        cmsModuleSaleSerial.showIsBusy = true;
        //        rashaErManage.showYesNo(($filter('translate')('Warning')), "آیا می خواهید این نظر را حذف کنید", function (isConfirmed) {
        //            if (isConfirmed) {
        //                console.log("Item to be deleted: ", cmsModuleSaleSerial.gridOptions.selectedRow.item);
        //                cmsModuleSaleSerial.showbusy = true;
        //                cmsModuleSaleSerial.showIsBusy = true;
        //                ajax.call(mainPathApi+'cmsModuleSaleSerial/getviewmodel', cmsModuleSaleSerial.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
        //                    cmsModuleSaleSerial.showbusy = false;
        //                    cmsModuleSaleSerial.showIsBusy = false;
        //                    rashaErManage.checkAction(response);
        //                    cmsModuleSaleSerial.selectedItemForDelete = response.Item;
        //                    console.log(cmsModuleSaleSerial.selectedItemForDelete);
        //                    ajax.call(mainPathApi+'cmsModuleSaleSerial/delete', cmsModuleSaleSerial.selectedItemForDelete, 'DELETE').success(function (res) {
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

        //cmsModuleSaleSerial.deleteAttachedFile = function (index) {
        //    cmsModuleSaleSerial.attachedFiles.splice(index, 1);
        //}

        //    cmsModuleSaleSerial.addAttachedFile = function (id) {
        //        var fname = $("#file" + id).text();
        //        if (id != null && id != undefined && !cmsModuleSaleSerial.alreadyExist(id, cmsModuleSaleSerial.attachedFiles) && fname != null && fname != "") {
        //            var fId = id;
        //            var file = { id: fId, name: fname };
        //            cmsModuleSaleSerial.attachedFiles.push(file);
        //            if (document.getElementsByName("file" + id).length > 1)
        //                document.getElementsByName("file" + id)[1].textContent = "";
        //            else
        //                document.getElementsByName("file" + id)[0].textContent = "";
        //        }
        //    }
        //
        //    cmsModuleSaleSerial.alreadyExist = function (id, array) {
        //        for (var i = 0; i < array.length; i++) {
        //            if (id == array[i].fileId) {
        //                rashaErManage.showMessage($filter('translate')('This_File_Has_Already_Been_Attachment'));
        //                return true;
        //            }
        //        }
        //        return false;
        //    }
        //
        //    cmsModuleSaleSerial.filePickerMainImage.removeSelectedfile = function (config) {
        //        cmsModuleSaleSerial.filePickerMainImage.fileId = null;
        //        cmsModuleSaleSerial.filePickerMainImage.filename = null;
        //        cmsModuleSaleSerial.selectedItem.LinkMainImageId = null;
        //
        //    }
        //
        //    cmsModuleSaleSerial.filePickerFiles.removeSelectedfile = function (config) {
        //        cmsModuleSaleSerial.filePickerFiles.fileId = null;
        //        cmsModuleSaleSerial.filePickerFiles.filename = null;
        //    }
        //
        //
        //
        //
        //    cmsModuleSaleSerial.showUpload = function () { $("#fastUpload").fadeToggle(); }
        //
        //    // ----------- FilePicker Codes --------------------------------
        //    cmsModuleSaleSerial.addAttachedFile = function (id) {
        //        var fname = $("#file" + id).text();
        //        if (fname == "") {
        //            rashaErManage.showMessage($filter('translate')('Please_Select_A_File_To_Add'));
        //            return;
        //        }
        //        if (id != null && id != undefined && !cmsModuleSaleSerial.alreadyExist(id, cmsModuleSaleSerial.attachedFiles)) {
        //            var fId = id;
        //            var file = { fileId: fId, filename: fname };
        //            cmsModuleSaleSerial.attachedFiles.push(file);
        //            cmsModuleSaleSerial.clearfilePickers();
        //        }
        //    }
        //
        //    cmsModuleSaleSerial.alreadyExist = function (fieldId, array) {
        //        for (var i = 0; i < array.length; i++) {
        //            if (fieldId == array[i].fileId) {
        //                rashaErManage.showMessage($filter('translate')('This_Item_Has_Already_Been_Added'));
        //                cmsModuleSaleSerial.clearfilePickers();
        //                return true;
        //            }
        //        }
        //        return false;
        //    }
        //
        //    cmsModuleSaleSerial.parseFileIds = function (stringOfIds) {
        //        if (stringOfIds == null || !stringOfIds.trim()) return;
        //        var fileIds = stringOfIds.split(",");
        //        if (fileIds.length != undefined) {
        //            $.each(fileIds, function (index, item) {
        //                if (item == parseInt(item, 10)) {  // Check if item is an integer
        //                    ajax.call(mainPathApi+'CmsFileContent/getviewmodel', parseInt(item), 'GET').success(function (response) {
        //                        if (response.IsSuccess) {
        //                            cmsModuleSaleSerial.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
        //                        }
        //                    }).error(function (data, errCode, c, d) {
        //                        rashaErManage.checkAction(data, errCode);
        //                    });
        //                }
        //            });
        //        }
        //    }
        //
        //    cmsModuleSaleSerial.clearfilePickers = function () {
        //        cmsModuleSaleSerial.filePickerFiles.fileId = null;
        //        cmsModuleSaleSerial.filePickerFiles.filename = null;
        //    }
        //
        //    cmsModuleSaleSerial.stringfyLinkFileIds = function () {
        //        $.each(cmsModuleSaleSerial.attachedFiles, function (i, item) {
        //            if (cmsModuleSaleSerial.selectedItem.LinkFileIds == "")
        //                cmsModuleSaleSerial.selectedItem.LinkFileIds = item.fileId;
        //            else
        //                cmsModuleSaleSerial.selectedItem.LinkFileIds += ',' + item.fileId;
        //        });
        //    }
        //    //--------- End FilePickers Codes -------------------------
        //
        //
        //    //---------------Upload Modal-------------------------------
        //    cmsModuleSaleSerial.openUploadModal = function () {
        //        $modal.open({
        //            templateUrl: 'cpanelv1/ModuleCore/cmsModuleSaleSerial/upload_modal.html',
        //            size: 'lg',
        //            scope: $scope
        //        });
        //
        //        cmsModuleSaleSerial.FileList = [];
        //        //get list of file from category id
        //        ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", null, 'POST').success(function (response) {
        //            cmsModuleSaleSerial.FileList = response.ListItems;
        //        }).error(function (data) {
        //            console.log(data);
        //        });
        //
        //    }
        //
        //    cmsModuleSaleSerial.calcuteProgress = function (progress) {
        //        wdth = Math.floor(progress * 100);
        //        return wdth;
        //    }
        //
        //    cmsModuleSaleSerial.whatcolor = function (progress) {
        //        wdth = Math.floor(progress * 100);
        //        if (wdth >= 0 && wdth < 30) {
        //            return 'danger';
        //        } else if (wdth >= 30 && wdth < 50) {
        //            return 'warning';
        //        } else if (wdth >= 50 && wdth < 85) {
        //            return 'info';
        //        } else {
        //            return 'success';
        //        }
        //    }
        //
        //    cmsModuleSaleSerial.canShow = function (pr) {
        //        if (pr == 1) {
        //            return true;
        //        }
        //        return false;
        //    }
        //    // File Manager actions
        //    cmsModuleSaleSerial.replaceFile = function (name) {
        //        cmsModuleSaleSerial.itemClicked(null, cmsModuleSaleSerial.fileIdToDelete, "file");
        //        cmsModuleSaleSerial.fileTypes = 1;
        //        cmsModuleSaleSerial.fileIdToDelete = cmsModuleSaleSerial.selectedIndex;
        //
        //        // Delete the file
        //        ajax.call(mainPathApi+"CmsFileContent/getviewmodel", cmsModuleSaleSerial.fileIdToDelete, 'GET').success(function (response1) {
        //            if (response1.IsSuccess == true) {
        //                console.log(response1.Item);
        //                ajax.call(mainPathApi+'CmsFileContent/delete', response1.Item, 'DELETE').success(function (response2) {
        //                    cmsModuleSaleSerial.remove(cmsModuleSaleSerial.FileList, cmsModuleSaleSerial.fileIdToDelete);
        //                    if (response2.IsSuccess == true) {
        //                        // Save New file
        //                        ajax.call(mainPathApi+"CmsFileContent/getviewmodel", "0", 'GET').success(function (response3) {
        //                            if (response3.IsSuccess == true) {
        //                                cmsModuleSaleSerial.FileItem = response3.Item;
        //                                cmsModuleSaleSerial.FileItem.FileName = name;
        //                                cmsModuleSaleSerial.FileItem.Extension = name.split('.').pop();
        //                                cmsModuleSaleSerial.FileItem.FileSrc = name;
        //                                cmsModuleSaleSerial.FileItem.LinkCategoryId = cmsModuleSaleSerial.thisCategory;
        //                                cmsModuleSaleSerial.saveNewFile();
        //                            }
        //                            else {
        //                                console.log("getting the model was not successfully returned!");
        //                            }
        //                        }).error(function (data) {
        //                            console.log(data);
        //                        });
        //                    }
        //                    else {
        //                        console.log("Request to api/CmsFileContent/delete was not successfully returned!");
        //                    }
        //                }).error(function (data, errCode, c, d) {
        //                    console.log(data);
        //                });
        //            }
        //        }).error(function (data) {
        //            console.log(data);
        //        });
        //    }
        //    //save new file
        //    cmsModuleSaleSerial.saveNewFile = function () {
        //        ajax.call(mainPathApi+"CmsFileContent/add", cmsModuleSaleSerial.FileItem, 'POST').success(function (response) {
        //            if (response.IsSuccess) {
        //                cmsModuleSaleSerial.FileItem = response.Item;
        //                cmsModuleSaleSerial.showSuccessIcon();
        //                return 1;
        //            }
        //            else {
        //                return 0;
        //
        //            }
        //        }).error(function (data) {
        //            cmsModuleSaleSerial.showErrorIcon();
        //            return -1;
        //        });
        //    }
        //
        //    cmsModuleSaleSerial.showSuccessIcon = function () {
        //        $().toggle
        //    }
        //
        //    cmsModuleSaleSerial.showErrorIcon = function () {
        //
        //    }
        //    //file is exist
        //    cmsModuleSaleSerial.fileIsExist = function (fileName) {
        //        for (var i = 0; i < cmsModuleSaleSerial.FileList.length; i++) {
        //            if (cmsModuleSaleSerial.FileList[i].FileName == fileName) {
        //                cmsModuleSaleSerial.fileIdToDelete = cmsModuleSaleSerial.FileList[i].Id;
        //                return true;
        //
        //            }
        //        }
        //        return false;
        //    }
        //
        //    cmsModuleSaleSerial.getFileItem = function (id) {
        //        for (var i = 0; i < cmsModuleSaleSerial.FileList.length; i++) {
        //            if (cmsModuleSaleSerial.FileList[i].Id == id) {
        //                return cmsModuleSaleSerial.FileList[i];
        //            }
        //        }
        //    }
        //
        //    //select file or folder
        //    cmsModuleSaleSerial.itemClicked = function ($event, index, type) {
        //        if (type == 'file' || type == 1) {
        //            cmsModuleSaleSerial.fileTypes = 1;
        //            cmsModuleSaleSerial.selectedFileId = cmsModuleSaleSerial.getFileItem(index).Id;
        //            cmsModuleSaleSerial.selectedFileName = cmsModuleSaleSerial.getFileItem(index).FileName;
        //        }
        //        else {
        //            cmsModuleSaleSerial.fileTypes = 2;
        //            cmsModuleSaleSerial.selectedCategoryId = cmsModuleSaleSerial.getCategoryName(index).Id;
        //            cmsModuleSaleSerial.selectedCategoryTitle = cmsModuleSaleSerial.getCategoryName(index).Title;
        //        }
        //        //if (event.ctrlKey) {
        //        //    alert("ctrl pressed");
        //        //}
        //
        //        cmsModuleSaleSerial.selectedIndex = index;
        //
        //    };
        //
        cmsModuleSaleSerial.toggleCategoryButtons = function () {
            $("#categoryButtons").fadeToggle();
        }
        //
        //    //upload file
        //    cmsModuleSaleSerial.uploadFile = function (index, name) {
        //        if ($("#save-icon" + index).hasClass("fa-save")) {
        //            if (cmsModuleSaleSerial.fileIsExist(name)) { // File already exists
        //                if (confirm('File "' + name + '" already exists! Do you want to replace the new file?')) {
        //                    //------------ cmsModuleSaleSerial.replaceFile(name);
        //                    cmsModuleSaleSerial.itemClicked(null, cmsModuleSaleSerial.fileIdToDelete, "file");
        //                    cmsModuleSaleSerial.fileTypes = 1;
        //                    cmsModuleSaleSerial.fileIdToDelete = cmsModuleSaleSerial.selectedIndex;
        //                    // Delete the file
        //                    ajax.call(mainPathApi+"CmsFileContent/getviewmodel", cmsModuleSaleSerial.fileIdToDelete, 'GET').success(function (response1) {
        //                        if (response1.IsSuccess == true) {
        //                            console.log(response1.Item);
        //                            ajax.call(mainPathApi+'CmsFileContent/delete', response1.Item, 'DELETE').success(function (response2) {
        //                                cmsModuleSaleSerial.remove(cmsModuleSaleSerial.FileList, cmsModuleSaleSerial.fileIdToDelete);
        //                                if (response2.IsSuccess == true) {
        //                                    // Save New file
        //                                    ajax.call(mainPathApi+"CmsFileContent/getviewmodel", "0", 'GET').success(function (response3) {
        //                                        if (response3.IsSuccess == true) {
        //                                            cmsModuleSaleSerial.FileItem = response3.Item;
        //                                            cmsModuleSaleSerial.FileItem.FileName = name;
        //                                            cmsModuleSaleSerial.FileItem.Extension = name.split('.').pop();
        //                                            cmsModuleSaleSerial.FileItem.FileSrc = name;
        //                                            cmsModuleSaleSerial.FileItem.LinkCategoryId = cmsModuleSaleSerial.thisCategory;
        //                                            // ------- cmsModuleSaleSerial.saveNewFile()  ----------------------
        //                                            var result = 0;
        //                                            ajax.call(mainPathApi+"CmsFileContent/add", cmsModuleSaleSerial.FileItem, 'POST').success(function (response) {
        //                                                if (response.IsSuccess) {
        //                                                    cmsModuleSaleSerial.FileItem = response.Item;
        //                                                    cmsModuleSaleSerial.showSuccessIcon();
        //                                                    $("#save-icon" + index).removeClass("fa-save");
        //                                                    $("#save-button" + index).removeClass("flashing-button");
        //                                                    $("#save-icon" + index).addClass("fa-check");
        //                                                    cmsModuleSaleSerial.filePickerMainImage.filename = cmsModuleSaleSerial.FileItem.FileName;
        //                                                    cmsModuleSaleSerial.filePickerMainImage.fileId = response.Item.Id;
        //                                                    cmsModuleSaleSerial.selectedItem.LinkMainImageId = cmsModuleSaleSerial.filePickerMainImage.fileId
        //
        //                                                }
        //                                                else {
        //                                                    $("#save-icon" + index).removeClass("fa-save");
        //                                                    $("#save-button" + index).removeClass("flashing-button");
        //                                                    $("#save-icon" + index).addClass("fa-remove");
        //
        //                                                }
        //                                            }).error(function (data) {
        //                                                cmsModuleSaleSerial.showErrorIcon();
        //                                                $("#save-icon" + index).removeClass("fa-save");
        //                                                $("#save-button" + index).removeClass("flashing-button");
        //                                                $("#save-icon" + index).addClass("fa-remove");
        //                                            });
        //                                            //-----------------------------------
        //                                        }
        //                                        else {
        //                                            console.log("getting the model was not successfully returned!");
        //                                        }
        //                                    }).error(function (data) {
        //                                        console.log(data);
        //                                    });
        //                                }
        //                                else {
        //                                    console.log("Request to api/CmsFileContent/delete was not successfully returned!");
        //                                }
        //                            }).error(function (data, errCode, c, d) {
        //                                console.log(data);
        //                            });
        //                        }
        //                    }).error(function (data) {
        //                        console.log(data);
        //                    });
        //                    //--------------------------------
        //                } else {
        //                    return;
        //                }
        //            }
        //            else { // File does not exists
        //                // Save New file
        //                ajax.call(mainPathApi+"CmsFileContent/getviewmodel", "0", 'GET').success(function (response) {
        //                    cmsModuleSaleSerial.FileItem = response.Item;
        //                    cmsModuleSaleSerial.FileItem.FileName = name;
        //                    cmsModuleSaleSerial.FileItem.Extension = name.split('.').pop();
        //                    cmsModuleSaleSerial.FileItem.FileSrc = name;
        //                    cmsModuleSaleSerial.FileItem.LinkCategoryId = null;  //Save the new file in the root
        //                    // ------- cmsModuleSaleSerial.saveNewFile()  ----------------------
        //                    var result = 0;
        //                    ajax.call(mainPathApi+"CmsFileContent/add", cmsModuleSaleSerial.FileItem, 'POST').success(function (response) {
        //                        if (response.IsSuccess) {
        //                            cmsModuleSaleSerial.FileItem = response.Item;
        //                            cmsModuleSaleSerial.showSuccessIcon();
        //                            $("#save-icon" + index).removeClass("fa-save");
        //                            $("#save-button" + index).removeClass("flashing-button");
        //                            $("#save-icon" + index).addClass("fa-check");
        //                            cmsModuleSaleSerial.filePickerMainImage.filename = cmsModuleSaleSerial.FileItem.FileName;
        //                            cmsModuleSaleSerial.filePickerMainImage.fileId = response.Item.Id;
        //                            cmsModuleSaleSerial.selectedItem.LinkMainImageId = cmsModuleSaleSerial.filePickerMainImage.fileId
        //
        //                        }
        //                        else {
        //                            $("#save-icon" + index).removeClass("fa-save");
        //                            $("#save-button" + index).removeClass("flashing-button");
        //                            $("#save-icon" + index).addClass("fa-remove");
        //                        }
        //                    }).error(function (data) {
        //                        cmsModuleSaleSerial.showErrorIcon();
        //                        $("#save-icon" + index).removeClass("fa-save");
        //                        $("#save-button" + index).removeClass("flashing-button");
        //                        $("#save-icon" + index).addClass("fa-remove");
        //                    });
        //                    //-----------------------------------
        //                }).error(function (data) {
        //                    console.log(data);
        //                    $("#save-icon" + index).removeClass("fa-save");
        //                    $("#save-button" + index).removeClass("flashing-button");
        //                    $("#save-icon" + index).addClass("fa-remove");
        //                });
        //            }
        //        }
        //    }
        //End of Upload Modal-----------------------------------------

        //Export Report
        cmsModuleSaleSerial.exportFile = function () {
            cmsModuleSaleSerial.gridOptions.advancedSearchData.engine.ExportFile =
                cmsModuleSaleSerial.ExportFileClass;
            cmsModuleSaleSerial.addRequested = true;
            ajax
                .call(
                    mainPathApi+"cmsModuleSaleSerial/exportfile",
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
                .call(mainPathApi + "cmsModuleSaleSerial/count", cmsModuleSaleSerial.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
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
                .call(mainPathApi + "CmsFileContent/PreviewImage", { id: mainImageId, name: "" }, "POST")
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
                    .call(mainPathApi + "CmsFileCategory/GetAll", filterModel, "POST")
                    .success(function (response1) {
                        angular.forEach(response1.ListItems, function (value, key) {
                            node.Children.push(value);
                        });
                        ajax
                            .call(mainPathApi + "CmsFileContent/GetFilesFromCategory", node.Id, "POST")
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
            cmsModuleSaleSerial.selectedItem.previewImageSrc = "CmsFiles/img/loader.gif";
            ajax
                .call(mainPathApi + "CmsFileContent/getviewmodel", node.Id, "GET")
                .success(function (response) {
                    cmsModuleSaleSerial.selectedItem.previewImageSrc =
                        "/files/" + response.Item.Id + "/" + response.Item.FileName;
                })
                .error(function (data, errCode, c, d) {
                    console.log(data);
                });
        };
        //End of TreeControl
    }
]);
