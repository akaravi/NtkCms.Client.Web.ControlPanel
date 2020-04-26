app.controller("productContentController", [
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
  "$stateParams",
  "$rootScope",
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
    $filter,
    $stateParams,
    $rootScope
  ) {
    var productContent = this;
    //شناسه اینام این ماژول در ارتباطات
    //Product_WrapperProductContent
    ModuleRelationShipModuleNameMain = 10;
    productContent.RouteUploadFileContent = cmsServerConfig.configRouteUploadFileContent;
    var edititem = false;
    //For Grid Options
    productContent.gridOptions = {};
    productContent.selectedItem = {};
    productContent.selectedItemRelationship = {};
    productContent.attachedFiles = [];

    productContent.filePickerMainImage = {
      isActive: true,
      backElement: "filePickerMainImage",
      filename: null,
      fileId: null,
      multiSelect: false
    };
    productContent.filePickerFilePodcast = {
      isActive: true,
      backElement: 'filePickerFilePodcast',
      filename: null,
      fileId: null,
      extension: 'mp3',
      multiSelect: false,
    }

    productContent.filePickerFileMovie = {
      isActive: true,
      backElement: 'filePickerFileMovie',
      filename: null,
      fileId: null,
      extension: 'mp4,avi',
      multiSelect: false,
    }
    productContent.filePickerFiles = {
      isActive: true,
      backElement: "filePickerFiles",
      multiSelect: false,
      fileId: null,
      filename: null
    };
    productContent.locationChanged = function (lat, lang) {
      //console.log("ok " + lat + " " + lang);
    }
    productContent.selectedContentId = {
      Id: $stateParams.ContentId,
      TitleTag: $stateParams.TitleTag
    };
    productContent.GeolocationConfig = {
      latitude: 'Geolocationlatitude',
      longitude: 'Geolocationlongitude',
      onlocationChanged: productContent.locationChanged,
      useCurrentLocation: true,
      center: {
        lat: 32.658066,
        lng: 51.6693815
      },
      zoom: 4,
      scope: productContent,
      useCurrentLocationZoom: 12,
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) {
      productContent.itemRecordStatus = itemRecordStatus;
    }
    var date = moment().format();
    productContent.selectedItem.ExpireDate = date;
    // productContent.datePickerConfig = {
    //   defaultDate: date
    // };

    // productContent.FromDate = {
    //   defaultDate: date
    // };
    // productContent.ExpireDate = {
    //   defaultDate: date
    // };
    //#help/ سلکتور دسته بندی در ویرایش محتوا
    productContent.LinkCategoryIdSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkCategoryId",
      url: "ProductCategory",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: productContent,
      columnOptions: {
        columns: [{
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
            name: 'Description',
            displayName: 'توضیحات',
            sortable: true,
            type: 'string'
          }
        ]
      }
    };
    //#help/ سلکتور similar
    productContent.SimilarsSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "Iddddd",
      url: "ProductContent",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: productContent,
      columnOptions: {
        columns: [{
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
    //#help/ سلکتور relationship
    productContent.LinkModuleContentIdOtherSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkModuleContentIdOther",
      url: "productContent",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: productContent,
      columnOptions: {
        columns: [{
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


    productContent.selectedItemModuleRelationShip = [];
    productContent.ModuleRelationShip = [];


    productContent.moveSelectedRelationOnAdd = function () {
      if (!productContent.LinkModuleContentIdOtherSelector.selectedItem.Id || !productContent.selectedItemModuleRelationShip.ModuleNameOther) {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_RelationShip'));
        return;
      }
      if (!productContent.selectedItemModuleRelationShip.Title || productContent.selectedItemModuleRelationShip.Title.length == 0)
        productContent.selectedItemModuleRelationShip.Title = productContent.LinkModuleContentIdOtherSelector.filterText;
      for (var i = 0; i < productContent.ModuleRelationShip.length; i++) {
        if (productContent.ModuleRelationShip[i].Id == productContent.LinkModuleContentIdOtherSelector.selectedItem.Id) {
          rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
          return;
        }
      }
      productContent.ModuleRelationShip.push({
        Title: productContent.selectedItemModuleRelationShip.Title,
        ModuleNameOther: productContent.selectedItemModuleRelationShip.ModuleNameOther.Value,
        LinkModuleContentIdOther: productContent.LinkModuleContentIdOtherSelector.selectedItem.Id,
        ModuleNameMain: ModuleRelationShipModuleNameMain,
        LinkModuleContentIdMain: productContent.gridOptions.selectedRow.item.Id
      });
      productContent.selectedItemModuleRelationShip = [];
      productContent.LinkModuleContentIdOtherSelector.LinkModuleContentIdOther = 0;
    };
    productContent.moveSelectedRelationOnEdit = function () {
      if (!productContent.LinkModuleContentIdOtherSelector.selectedItem.Id || !productContent.selectedItemRelationship.ModuleNameOther) {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_RelationShip'));
        return;
      }
      if (!productContent.selectedItemRelationship.Title || productContent.selectedItemRelationship.Title.length == 0)
        productContent.selectedItemRelationship.Title = productContent.LinkModuleContentIdOtherSelector.filterText;

      for (var i = 0; i < productContent.ModuleRelationShip.length; i++) {
        if (productContent.ModuleRelationShip[i].Id == productContent.LinkModuleContentIdOtherSelector.selectedItem.Id &&
          productContent.ModuleRelationShip[i].LinkModuleContentIdOther == productContent.selectedItemRelationship.ModuleNameOther.Value) {
          rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
          return;
        }
      }

      productContent.ModuleRelationShip.push({
        Title: productContent.selectedItemRelationship.Title,
        ModuleNameOther: productContent.selectedItemRelationship.ModuleNameOther.Value,
        LinkModuleContentIdOther: productContent.LinkModuleContentIdOtherSelector.selectedItem.Id,
        ModuleNameMain: ModuleRelationShipModuleNameMain,
        LinkModuleContentIdMain: productContent.gridOptions.selectedRow.item.Id
      });
      productContent.selectedItemRelationship = [];
      productContent.LinkModuleContentIdOtherSelector.LinkModuleContentIdOther = 0;
    };

    productContent.removeFromCollectionRelationShip = function (deleteItem) {
      for (var i = 0; i < productContent.ModuleRelationShip.length; i++) {
        if (productContent.ModuleRelationShip[i].LinkModuleContentIdOther == deleteItem.LinkModuleContentIdOther &&
          productContent.ModuleRelationShip[i].ModuleNameOther == deleteItem.ModuleNameOther
        ) {
          productContent.ModuleRelationShip.splice(i, 1);
          return;
        }
      }
    };
    productContent.removeFromCollectionOtherInfo = function (deleteItem) {
      for (var i = 0; i < productContent.OtherInfos.length; i++) {
        if (productContent.OtherInfos[i].Id == deleteItem.Id) {
          productContent.OtherInfos.splice(i, 1);
          return;
        }
      }
    };
    productContent.removeFromCollectionSimilars = function (deleteItem) {
      for (var i = 0; i < productContent.Similars.length; i++) {
        if (productContent.Similars[i].Id == deleteItem.Id) {
          productContent.Similars.splice(i, 1);
          return;
        }
      }
    };
    productContent.editFromCollectionOtherInfo = function (editItem) {
      productContent.todoModeTitle = $filter('translatentk')('edit_now');
      productContent.editMode = true;
      productContent.selectedItemOtherInfos = angular.copy(editItem);
      $scope.currentItemIndex = productContent.OtherInfos.indexOf(editItem);
    };

    //#help otherInfo

    productContent.editOtherInfo = function (y) {
      if (y == null || y == undefined || y.Title == "" || y.Title == undefined || y.HtmlBody == "" || y.HtmlBody == undefined) {
        rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
        return;
      }
      edititem = true;
      productContent.selectedItemOtherInfos.Title = y.Title;
      productContent.selectedItemOtherInfos.HtmlBody = y.HtmlBody;
      productContent.selectedItemOtherInfos.Source = y.Source;
      productContent.removeFromOtherInfo(productContent.OtherInfos, y.Title, y.HtmlBody, y.Source);
    };
    productContent.changSelectedRelationModuleAdd = function () {
      productContent.LinkModuleContentIdOtherSelector.url = productContent.selectedItemModuleRelationShip.ModuleNameOther.Key.split(/Wrapper(.+)/)[1];
      productContent.LinkModuleContentIdOtherSelector.selectedItem = {};
      productContent.selectedItem.LinkModuleContentIdOther = {};
    }
    productContent.changSelectedRelationModuleEdit = function () {
      productContent.LinkModuleContentIdOtherSelector.url = productContent.selectedItemRelationship.ModuleNameOther.Key.split(/Wrapper(.+)/)[1];
      productContent.LinkModuleContentIdOtherSelector.selectedItem = {};
      productContent.selectedItem.LinkModuleContentIdOther = {};
    }
    productContent.UrlContent = "";
    //product Grid Options
    productContent.gridOptions = {
      columns: [{
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
          name: "Title",
          displayName: "عنوان",
          sortable: true,
          type: "string",
          visible: "true"
        },
        {
          name: "Description",
          displayName: "توضیحات",
          sortable: true,
          type: "string",
          visible: "true",
          excerpt:true,
          excerptLength:50
        },
        {
          name: "FromDate",
          displayName: "تاریخ آغاز",
          sortable: true,
          isDate: true,
          type: "date",
          visible: "true"
        },
        {
          name: "ExpireDate",
          displayName: "تاریخ پایان",
          sortable: true,
          isDate: true,
          type: "date",
          visible: "true"
        },
        {
          name: "ViewCount",
          displayName: "تعداد بازدید",
          sortable: true,
          visible: true
        }, {
          name: "ActionKey",
          displayName: 'عملیات',
          displayForce: true,
          template: '<li ng-if="!x.IsActivated" class="dropdown" dropdown="" style="display: initial;"><a aria-expanded="false" aria-haspopup="true" class="dropdown-toggle count-info" href="" dropdown-toggle=""><i class="fa fa-cog" ></i></a><ul class="dropdown-menu animated fadeInLeft m-t-xs" style="right: -142px;"><li><a ng-click="productContent.addMenu()" style="color:black">AddMenu</a></li><li><a ng-click="productContent.showComment(x.Id)" style="color:black">CommentList</a></li></ul></li>'
        }

      ],
      data: {},
      multiSelect: false,
      advancedSearchData: {
        engine: {}
      }
    };
    //Comment Grid Options
    productContent.gridContentOptions = {
      columns: [{
          name: "Id",
          displayName: "کد سیستمی",
          sortable: true,
          type: "integer"
        },
        {
          name: "Writer",
          displayName: "نویسنده",
          sortable: true,
          type: "string"
        },
        {
          name: "Comment",
          displayName: "کامنت",
          sortable: true,
          type: "string"
        },
        {
          name: "ActionButtons",
          displayName: "کلید عملیاتی",
          template: 
            '<Button ng-if="(x.RecordStatus!=1)" ng-click="productContent.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتایید می کنم</Button>' +
            '<Button ng-if="(x.RecordStatus==1)" ng-click="productContent.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspغیرفعال می کنم</Button>' +
            '<Button ng-click="productContent.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>'
        }
      ],
      data: {},
      multiSelect: false,
      showUserSearchPanel: false,
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
    };
    productContent.gridOptions.advancedSearchData.engine.Filters = null;
    productContent.gridOptions.advancedSearchData.engine.Filters = [];

    //For Show Category Loading Indicator
    productContent.categoryBusyIndicator = {
      isActive: true,
      message: "در حال بارگذاری دسته ها ..."
    };
    //For Show product Loading Indicator
    productContent.contentBusyIndicator = {
      isActive: false,
      message: "در حال بارگذاری ..."
    };
    //Tree Config
    productContent.treeConfig = {
      displayMember: "Title",
      displayId: "Id",
      displayChild: "Children"
    };

    //open addMenu modal
    productContent.addMenu = function () {

      $modal.open({
        templateUrl: "cpanelv1/Moduleproduct/productContent/modalMenu.html",
        scope: $scope
      });
    };

    productContent.treeConfig.currentNode = {};
    productContent.treeBusyIndicator = false;

    productContent.addRequested = false;

    productContent.showGridComment = false;
    productContent.productTitle = "";

    //init Function
    productContent.init = function () {
      productContent.categoryBusyIndicator.isActive = true;

      var engine = {};
      try {
        engine = productContent.gridOptions.advancedSearchData.engine;
      } catch (error) {
        //console.log(error);
      }
      ajax.call(cmsServerConfig.configApiServerPath + "ModulesRelationshipContent/GetEnum", {}, 'POST').success(function (response) {
        rashaErManage.checkAction(response);
        productContent.EnumModuleRelationshipName = response.ListItems;
        if (productContent.EnumModuleRelationshipName && productContent.EnumModuleRelationshipName.length) {
          var retFind = findWithAttr(productContent.EnumModuleRelationshipName, "Key", "Product_WrapperProductContent");
          if (retFind >= 0)
            ModuleRelationShipModuleNameMain = productContent.EnumModuleRelationshipName[retFind].Value;
        }
      }).error(function (data, errCode, c, d) {
        rashaErManage.checkAction(data, errCode);
      });
      productContent.categoryBusyIndicator.isActive = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "productCategory/getall", {
          RowPerPage: 1000
        }, "POST")
        .success(function (response) {
          rashaErManage.checkAction(response);
          productContent.treeConfig.Items = response.ListItems;
          productContent.categoryBusyIndicator.isActive = false;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
      filterModel = {
        PropertyName: "ContentTags",
        PropertyAnyName: "LinkTagId",
        SearchType: 0,
        IntValue1: productContent.selectedContentId.Id
      };
      if (productContent.selectedContentId.Id > 0)
        productContent.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
      productContent.contentBusyIndicator.isActive = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "productContent/getall", productContent.gridOptions.advancedSearchData.engine, "POST")
        .success(function (response) {
          rashaErManage.checkAction(response);
          productContent.ListItems = response.ListItems;
          productContent.gridOptions.fillData(
            productContent.ListItems,
            response.resultAccess
          ); // Sending Access as an argument
          productContent.contentBusyIndicator.isActive = false;
          productContent.gridOptions.currentPageNumber =
            response.CurrentPageNumber;
          productContent.gridOptions.totalRowCount = response.TotalRowCount;
          productContent.gridOptions.rowPerPage = response.RowPerPage;
          productContent.gridOptions.maxSize = 5;
        })
        .error(function (data, errCode, c, d) {
          productContent.contentBusyIndicator.isActive = false;
          productContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
          productContent.contentBusyIndicator.isActive = false;
        });

      ajax.call(cmsServerConfig.configApiServerPath + "productContentTag/GetViewModel", "", "GET").success(function (response) { //Get a ViewModel for productContentTag
          productContent.ModuleContentTag = response.Item;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);;
        });
    };
    productContent.EnumModuleName = function (enumId) {
      if (!productContent.EnumModuleRelationshipName || productContent.EnumModuleRelationshipName.length == 0)
        return enumId;
      var retFind = findWithAttr(productContent.EnumModuleRelationshipName, "Value", enumId);
      if (retFind < 0)
        return enumId;
      return productContent.EnumModuleRelationshipName[retFind].Description;
    }
    // For Show Comments
    productContent.showComment = function (LinkContentId) {
      //productContent.contentBusyIndicator = true;
      engine = {};
      var filterValue = {
        PropertyName: "LinkContentId",
        IntValue1: parseInt(LinkContentId),
        SearchType: 0
      }
      productContent.busyIndicatorForDropDownProcess = true;
      engine.Filters = null;
      engine.Filters = [];
      engine.Filters.push(filterValue);
      ajax.call(cmsServerConfig.configApiServerPath + "productcomment/getall", engine, 'POST').success(function (response) {
        rashaErManage.checkAction(response);
        productContent.ListCommentItems = response.ListItems;
        productContent.gridContentOptions.fillData(productContent.ListCommentItems, response.resultAccess); // Sending Access as an argument
        productContent.showGridComment = true;
        productContent.gridContentOptions.currentPageNumber = response.CurrentPageNumber;
        productContent.gridContentOptions.totalRowCount = response.TotalRowCount;
        productContent.gridContentOptions.rowPerPage = response.RowPerPage;
        productContent.gridContentOptions.maxSize = 5;
        $('html, body').animate({
          scrollTop: $("#ListComment").offset().top
        }, 850);
      }).error(function (data, errCode, c, d) {
        productContent.gridContentOptions.fillData();
        rashaErManage.checkAction(data, errCode);
        productContent.contentBusyIndicator.isActive = false;
      });
    };


    productContent.gridContentOptions.onRowSelected = function () {};

    // Open Add Category Modal
    productContent.addNewCategoryModel = function () {
      if (buttonIsPressed) {
        return;
      }
      productContent.addRequested = false;
      buttonIsPressed = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "productCategory/GetViewModel", "", "GET")
        .success(function (response) {
          buttonIsPressed = false;
          rashaErManage.checkAction(response);
          productContent.selectedItem = response.Item;
          //Set dataForTheTree
          var filterModelParentRootFolders = {
            Filters: [{
              PropertyName: "LinkParentId",
              IntValue1: null,
              SearchType: 0,
              IntValueForceNullSearch: true
            }]
          };
          ajax
            .call(
              cmsServerConfig.configApiServerPath + "FileCategory/getAll",
              filterModelParentRootFolders,
              "POST"
            )
            .success(function (response1) {
              //Get root directories
              productContent.dataForTheTree = response1.ListItems;
              var filterModelRootFiles = {
                Filters: [{
                  PropertyName: "LinkCategoryId",
                  SearchType: 0,
                  IntValue1: null,
                  IntValueForceNullSearch: true
                }]
              };
              ajax
                .call(
                  cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory",
                  filterModelRootFiles,
                  "POST"
                )
                .success(function (response2) {
                  //Get files in root
                  Array.prototype.push.apply(
                    productContent.dataForTheTree,
                    response2.ListItems
                  );
                  $modal.open({
                    templateUrl: "cpanelv1/ModuleProduct/ProductCategory/add.html",
                    scope: $scope
                  });
                  productContent.addRequested = false;
                })
                .error(function (data, errCode, c, d) {
                  rashaErManage.checkAction(data, errCode);
                });
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          //-----
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Edit Category Modal
    productContent.EditCategoryModel = function () {
      if (buttonIsPressed) {
        return;
      }
      productContent.addRequested = false;
      //productContent.modalTitle = ($filter('translatentk')('Edit_Category'));
      if (!productContent.treeConfig.currentNode) {
        rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
        return;
      }

      productContent.contentBusyIndicator.isActive = true;
      buttonIsPressed = true;
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "productCategory/GetOne",
          productContent.treeConfig.currentNode.Id,
          "GET"
        )
        .success(function (response) {
          buttonIsPressed = false;
          productContent.contentBusyIndicator.isActive = false;
          rashaErManage.checkAction(response);
          productContent.selectedItem = response.Item;
          //Set dataForTheTree
          productContent.selectedNode = [];
          productContent.expandedNodes = [];
          productContent.selectedItem = response.Item;
          var filterModelParentRootFolders = {
            Filters: [{
              PropertyName: "LinkParentId",
              IntValue1: null,
              SearchType: 0,
              IntValueForceNullSearch: true
            }]
          };
          ajax
            .call(
              cmsServerConfig.configApiServerPath + "FileCategory/getAll",
              filterModelParentRootFolders,
              "POST"
            )
            .success(function (response1) {
              //Get root directories
              productContent.dataForTheTree = response1.ListItems;
              var filterModelRootFiles = {
                Filters: [{
                  PropertyName: "LinkCategoryId",
                  SearchType: 0,
                  IntValue1: null,
                  IntValueForceNullSearch: true
                }]
              };
              ajax
                .call(
                  cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory",
                  filterModelRootFiles,
                  "POST"
                )
                .success(function (response2) {
                  //Get files in root
                  Array.prototype.push.apply(
                    productContent.dataForTheTree,
                    response2.ListItems
                  );
                  //Set selected files to treeControl
                  if (productContent.selectedItem.LinkMainImageId > 0)
                    productContent.onSelection({
                        Id: productContent.selectedItem.LinkMainImageId
                      },
                      true
                    );
                  $modal.open({
                    templateUrl: "cpanelv1/ModuleProduct/ProductCategory/edit.html",
                    scope: $scope
                  });
                })
                .error(function (data, errCode, c, d) {
                  rashaErManage.checkAction(data, errCode);
                });
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          //---
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };

    //open statistics
    productContent.Showstatistics = function () {
      if (!productContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
        return;
      }
      ajax.call(cmsServerConfig.configApiServerPath + 'productContent/GetOne', productContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
        rashaErManage.checkAction(response1);
        productContent.selectedItem = response1.Item;
        $modal.open({
          templateUrl: "cpanelv1/Moduleproduct/productContent/statistics.html",
          scope: $scope
        });
      }).error(function (data, errCode, c, d) {
        rashaErManage.checkAction(data, errCode);
      });
    }

    // Add New Category
    productContent.addNewCategory = function (frm) {
      if (frm.$invalid) return;
      productContent.categoryBusyIndicator.isActive = true;
      productContent.addRequested = true;
      productContent.selectedItem.LinkParentId = null;
      if (productContent.treeConfig.currentNode != null)
        productContent.selectedItem.LinkParentId =
        productContent.treeConfig.currentNode.Id;
      ajax
        .call(cmsServerConfig.configApiServerPath + "productCategory/add", productContent.selectedItem, "POST")
        .success(function (response) {
          productContent.addRequested = false;
          rashaErManage.checkAction(response);

          if (response.IsSuccess) {
            productContent.gridOptions.advancedSearchData.engine.Filters = null;
            productContent.gridOptions.advancedSearchData.engine.Filters = [];
            productContent.gridOptions.reGetAll();
            productContent.closeModal();
          }
          productContent.categoryBusyIndicator.isActive = false;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          productContent.addRequested = false;
          productContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Edit Category REST Api
    productContent.EditCategory = function (frm) {
      if (frm.$invalid) return;
      productContent.categoryBusyIndicator.isActive = true;
      productContent.addRequested = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "productCategory/edit", productContent.selectedItem, "PUT")
        .success(function (response) {
          //productContent.showbusy = false;
          productContent.treeConfig.showbusy = false;
          productContent.addRequested = false;
          rashaErManage.checkAction(response);
          if (response.IsSuccess) {
            productContent.treeConfig.currentNode.Title = response.Item.Title;
            productContent.closeModal();
          }
          productContent.categoryBusyIndicator.isActive = false;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          productContent.addRequested = false;
          productContent.categoryBusyIndicator.isActive = false;
        });
    };

    // Delete a Category
    productContent.deleteCategory = function () {
      if (buttonIsPressed) {
        return;
      }
      var node = productContent.treeConfig.currentNode;
      if (node.Id == 0 || !node.Id) {
        rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
        return;
      }
      rashaErManage.showYesNo(
        ($filter('translatentk')('warning')),
        ($filter('translatentk')('do_you_want_to_delete_this_attribute')),
        function (isConfirmed) {
          if (isConfirmed) {
            productContent.categoryBusyIndicator.isActive = true;
            buttonIsPressed = true;
            ajax
              .call(cmsServerConfig.configApiServerPath + "productCategory/GetOne", node.Id, "GET")
              .success(function (response) {
                buttonIsPressed = false;
                rashaErManage.checkAction(response);
                productContent.selectedItemForDelete = response.Item;
                ajax
                  .call(
                    cmsServerConfig.configApiServerPath + "productCategory/delete",
                    productContent.selectedItemForDelete,
                    "POST"
                  )
                  .success(function (res) {
                    productContent.categoryBusyIndicator.isActive = false;
                    if (res.IsSuccess) {
                      productContent.gridOptions.advancedSearchData.engine.Filters = null;
                      productContent.gridOptions.advancedSearchData.engine.Filters = [];
                      productContent.gridOptions.fillData();
                      productContent.gridOptions.reGetAll();
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
                    productContent.categoryBusyIndicator.isActive = false;
                  });
              })
              .error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                productContent.categoryBusyIndicator.isActive = false;
              });
          }
        }
      );
    };

    //Tree On Node Select Options
    productContent.treeConfig.onNodeSelect = function () {
      var node = productContent.treeConfig.currentNode;
      productContent.showGridComment = false;
      productContent.selectContent(node);
    };
    //Show Content with Category Id
    productContent.selectContent = function (node) {
      productContent.gridOptions.advancedSearchData.engine.Filters = null;
      productContent.gridOptions.advancedSearchData.engine.Filters = [];
      if (node != null && node != undefined) {
        productContent.contentBusyIndicator.message =
          "در حال بارگذاری مقاله های  دسته " + node.Title;
        productContent.contentBusyIndicator.isActive = true;
        //productContent.gridOptions.advancedSearchData = {};
        productContent.attachedFiles = [];
        var s = {
          PropertyName: "LinkCategoryId",
          IntValue1: node.Id,
          SearchType: 0
        };
        productContent.gridOptions.advancedSearchData.engine.Filters.push(s);
      }
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "productContent/getall",
          productContent.gridOptions.advancedSearchData.engine,
          "POST"
        )
        .success(function (response) {
          rashaErManage.checkAction(response);
          productContent.contentBusyIndicator.isActive = false;
          productContent.ListItems = response.ListItems;
          productContent.gridOptions.fillData(
            productContent.ListItems,
            response.resultAccess
          ); // Sending Access as an argument
          productContent.gridOptions.currentPageNumber =
            response.CurrentPageNumber;
          productContent.gridOptions.totalRowCount = response.TotalRowCount;
          productContent.gridOptions.rowPerPage = response.RowPerPage;
        })
        .error(function (data, errCode, c, d) {
          productContent.contentBusyIndicator.isActive = false;
          productContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Modal
    productContent.addNewContentModel = function () {
      productContent.selectedItemModuleRelationShip = [];
      productContent.ModuleRelationShip = [];
      if (buttonIsPressed) {
        return;
      }
      var node = productContent.treeConfig.currentNode;
      if (node.Id == 0 || !node.Id) {
        rashaErManage.showMessage($filter('translatentk')('to_add_a_product_please_select_the_category'));
        buttonIsPressed = false;
        return;
      }
      productContent.selectedItemOtherInfos = {};
      productContent.attachedFiles = [];
      productContent.Similars = [];
      productContent.SimilarsDb = [];
      productContent.OtherInfos = [];
      productContent.OtherInfosDb = [];
      productContent.ModuleRelationShip = [];
      productContent.ModuleRelationShipDb = [];

      productContent.filePickerMainImage.filename = "";
      productContent.filePickerMainImage.fileId = null;
      productContent.filePickerFilePodcast.filename = "";
      productContent.filePickerFilePodcast.fileId = null;
      productContent.filePickerFileMovie.filename = "";
      productContent.filePickerFileMovie.fileId = null;
      productContent.filePickerFiles.filename = "";
      productContent.filePickerFiles.fileId = null;
      productContent.tags = []; //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
      productContent.kwords = []; //tagsInput خالی کردن آرایه کلمات کلیدی برای محتوای جدید
      productContent.addRequested = false;
      //productContent.modalTitle = ($filter('translatentk')('Add_Content'));
      buttonIsPressed = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "productContent/GetViewModel", "", "GET")
        .success(function (response) {
          buttonIsPressed = false;
          rashaErManage.checkAction(response);

          productContent.selectedItem = response.Item;
          productContent.OtherInfos = [];

          productContent.selectedItem.LinkCategoryId = node.Id;
          productContent.selectedItem.LinkFileIds = null;

          $modal.open({
            templateUrl: "cpanelv1/Moduleproduct/productContent/add.html",
            scope: $scope
          });
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };


    productContent.SimilarsSelectedItem = {};
    productContent.moveSelected = function (from, to, calculatePrice) {
      if (from == "Content") {
        if (
          productContent.selectedItem.Id != undefined &&
          productContent.selectedItem.Id != null
        ) {
          if (productContent.Similars == undefined)
            productContent.Similars = [];

          for (var i = 0; i < productContent.Similars.length; i++) {
            if (productContent.Similars[i].Id == productContent.SimilarsSelector.selectedItem.Id) {
              rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
              return;
            }
          }
          productContent.Similars.push(productContent.SimilarsSelector.selectedItem);
        }
      }
    };

    productContent.moveSelectedOtherInfo = function (from, to, y) {
      if (productContent.OtherInfos == undefined)
        productContent.OtherInfos = [];
      for (var i = 0; i < productContent.OtherInfos.length; i++) {

        if (productContent.OtherInfos[i].Title == productContent.selectedItemOtherInfos.Title && productContent.OtherInfos[i].HtmlBody == productContent.selectedItemOtherInfos.HtmlBody && productContent.OtherInfos[i].Source == productContent.selectedItemOtherInfos.Source) {
          rashaErManage.showMessage($filter('translatentk')('Information_Is_Duplicate'));
          return;
        }
      }
      if (productContent.selectedItemOtherInfos.Title == "" && productContent.selectedItemOtherInfos.Source == "" && productContent.selectedItemOtherInfos.HtmlBody == "") {
        rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
      } else if (productContent.selectedItemOtherInfos.TypeId == "" || !Number.isInteger(productContent.selectedItemOtherInfos.TypeId)) {
        rashaErManage.showMessage($filter('translatentk')('در فیلد نوع مقدار عددی وارد کنید'));
      } else {

        productContent.OtherInfos.push({
          Title: productContent.selectedItemOtherInfos.Title,
          HtmlBody: productContent.selectedItemOtherInfos.HtmlBody,
          Source: productContent.selectedItemOtherInfos.Source
        });
        productContent.selectedItemOtherInfos.Title = "";
        productContent.selectedItemOtherInfos.Source = "";
        productContent.selectedItemOtherInfos.HtmlBody = "";
      }
      if (edititem) {
        edititem = false;
      }

    };
    //#help otherInfo
    productContent.selectedItemOtherInfos = {};
    productContent.todoModeTitle = $filter('translatentk')('ADD_NOW');
    productContent.saveOtherInfos = function () {

      if (productContent.editMode) {
        if (productContent.selectedItemOtherInfos.Title == "" ||
          productContent.selectedItemOtherInfos.Title == undefined ||
          productContent.selectedItemOtherInfos.HtmlBody == "" ||
          productContent.selectedItemOtherInfos.HtmlBody == undefined) {
          rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
          return;
        }
        productContent.selectedItemOtherInfos.Edited = true;
        $scope.currentItem = productContent.selectedItemOtherInfos;
        productContent.OtherInfos[$scope.currentItemIndex] = productContent.selectedItemOtherInfos;
        productContent.editMode = false;


      } else { //add New
        if (productContent.selectedItemOtherInfos.Title == "" ||
          productContent.selectedItemOtherInfos.Title == undefined ||
          productContent.selectedItemOtherInfos.HtmlBody == "" ||
          productContent.selectedItemOtherInfos.HtmlBody == undefined) {
          rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
          return;
        }
        productContent.selectedItemOtherInfos.LinkContentId = productContent.gridOptions.selectedRow.item.Id;
        productContent.OtherInfos.push(productContent.selectedItemOtherInfos);
        productContent.selectedItemOtherInfos = {};
        // ajax.call(cmsServerConfig.configApiServerPath + 'productContentOtherInfo/add', productContent.selectedItemOtherInfos, 'POST').success(function (response) {
        //   rashaErManage.checkAction(response);
        //   if (response.IsSuccess) {
        //     productContent.selectedItemOtherInfos = response.Item;
        //     mainLIst.push(productContent.selectedItemOtherInfos);
        //     productContent.selectedItemOtherInfos = {};
        //   }
        // }).error(function (data, errCode, c, d) {
        //   rashaErManage.checkAction(data, errCode);
        // });

      }
      productContent.selectedItemOtherInfos = {};
      productContent.todoModeTitle = $filter('translatentk')('add_now');
    };




    //#help
    // Open Edit Content Modal
    productContent.openEditModel = function () {
      productContent.attachedFiles = [];
      productContent.Similars = [];
      productContent.SimilarsDb = [];
      productContent.OtherInfos = [];
      productContent.ModuleRelationShip = [];
      productContent.selectedItemModuleRelationShip = [];
      productContent.ModuleRelationShipDb = [];
      productContent.tags = []; //Clear out previous tags
      productContent.selectedItemRelationship = [];
      if (buttonIsPressed) {
        return;
      }

      productContent.showComment(productContent.gridOptions.selectedRow.item.Id)
      productContent.addRequested = false;
      //productContent.modalTitle = ($filter('translatentk')('Edit_Content'));
      if (!productContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
        return;
      }
      if (productContent.gridOptions.selectedRow.item.LinkSiteId != $rootScope.tokenInfo.Item.SiteId && !$rootScope.tokenInfo.Item.UserAccessAdminAllowToAllData) {
        rashaErManage.showMessage($filter('translatentk')('This_Product_Is_Shared'));
        return;
      }
      productContent.selectedItemOtherInfos = {};
      buttonIsPressed = true;
      ajax.call(cmsServerConfig.configApiServerPath + "productContent/GetOne", productContent.gridOptions.selectedRow.item.Id, "GET")
        .success(function (response1) {
          buttonIsPressed = false;
          rashaErManage.checkAction(response1);
          productContent.selectedItem = response1.Item;


          // productContent.FromDate.defaultDate = productContent.selectedItem.FromDate;
          // productContent.ExpireDate.defaultDate = productContent.selectedItem.ExpireDate;
          productContent.filePickerMainImage.filename = null;
          productContent.filePickerMainImage.fileId = null;
          productContent.filePickerFilePodcast.filename = null;
          productContent.filePickerFilePodcast.fileId = null;
          productContent.filePickerFileMovie.filename = null;
          productContent.filePickerFileMovie.fileId = null;
          //ProductContentOtherInfo
          var engineOtherInfo = {};
          var filterValue = {
            PropertyName: "LinkContentId",
            IntValue1: productContent.gridOptions.selectedRow.item.Id,
            SearchType: 0
          }
          engineOtherInfo.Filters = null;
          engineOtherInfo.Filters = [];
          engineOtherInfo.Filters.push(filterValue);
          ajax.call(cmsServerConfig.configApiServerPath + "ProductContentOtherInfo/GetAll", engineOtherInfo, "POST")
            .success(function (responseOtherInfos) {
              productContent.OtherInfosDb = responseOtherInfos.ListItems;
              productContent.OtherInfos = angular.extend(productContent.OtherInfos, responseOtherInfos.ListItems);
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });

          ajax.call(cmsServerConfig.configApiServerPath + "ProductContentTag/GetAll", engineOtherInfo, "POST")
            .success(function (responsetag) {
              productContent.selectedItem.ContentTags = responsetag.ListItems;

              //Load tagsInput
              if (productContent.selectedItem.ContentTags == null)
                productContent.selectedItem.ContentTags = [];
              $.each(productContent.selectedItem.ContentTags, function (index, item) {
                if (item.virtual_ModuleTag != null)
                  productContent.tags.push({
                    id: item.virtual_ModuleTag.Id,
                    text: item.virtual_ModuleTag.Title
                  }); //Add current content's tag to tags array with id and title
              });
              ///Load tagsInput
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          var engineSimilars = {};
          ajax.call(cmsServerConfig.configApiServerPath + "ProductContent/GetAllWithSimilarsId/" + productContent.gridOptions.selectedRow.item.Id, engineSimilars, "POST")
            .success(function (responseSimilars) {
              productContent.SimilarsDb = responseSimilars.ListItems;
              productContent.Similars = angular.extend(productContent.Similars, responseSimilars.ListItems);
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          var RelationshipModel = {
            Id: productContent.gridOptions.selectedRow.item.Id,
            enumValue: ModuleRelationShipModuleNameMain
          };
          ajax.call(cmsServerConfig.configApiServerPath + 'ModulesRelationshipContent/GetAllByContentId', RelationshipModel, 'POST')
            .success(function (responseModuleRelationShip) {
              productContent.ModuleRelationShipDb = responseModuleRelationShip.ListItems;
              productContent.ModuleRelationShip = angular.extend(productContent.ModuleRelationShip, responseModuleRelationShip.ListItems);
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          //ProductContentOtherInfo
          if (response1.Item.LinkMainImageId != null) {
            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", response1.Item.LinkMainImageId, "GET")
              .success(function (response2) {
                buttonIsPressed = false;
                productContent.filePickerMainImage.filename =
                  response2.Item.FileName;
                productContent.filePickerMainImage.fileId = response2.Item.Id;
              })
              .error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
              });
          }
          if (response1.Item.LinkFilePodcastId != null) {
            ajax.call(cmsServerConfig.configApiServerPath + 'FileContent/GetOne', response1.Item.LinkFilePodcastId, 'GET').success(function (response2) {
              productContent.filePickerFilePodcast.filename = response2.Item.FileName;
              productContent.filePickerFilePodcast.fileId = response2.Item.Id
            }).error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          }
          if (response1.Item.LinkFileMovieId != null) {
            ajax.call(cmsServerConfig.configApiServerPath + 'FileContent/GetOne', response1.Item.LinkFileMovieId, 'GET').success(function (response2) {
              productContent.filePickerFileMovie.filename = response2.Item.FileName;
              productContent.filePickerFileMovie.fileId = response2.Item.Id
            }).error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          }

          //link to other module
          productContent.parseFileIds(response1.Item.LinkFileIds);
          productContent.filePickerFiles.filename = null;
          productContent.filePickerFiles.fileId = null;

          //Load Keywords tagsInput
          productContent.kwords = []; //Clear out previous tags
          var arraykwords = [];
          if (
            productContent.selectedItem.Keyword != null &&
            productContent.selectedItem.Keyword != ""
          )
            arraykwords = productContent.selectedItem.Keyword.split(",");
          $.each(arraykwords, function (index, item) {
            if (item != null) productContent.kwords.push({
              text: item
            }); //Add current content's tag to tags array with id and title
          });
          $modal.open({
            templateUrl: "cpanelv1/Moduleproduct/productContent/edit.html",
            scope: $scope
          });
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };



    // Add New Content
    productContent.addNewContent = function (frm) {
      if (frm.$invalid) return;
      productContent.categoryBusyIndicator.isActive = true;
      productContent.addRequested = true;

      //Save attached file ids into productContent.selectedItem.LinkFileIds
      productContent.selectedItem.LinkFileIds = "";
      productContent.stringfyLinkFileIds();
      //Save Keywords
      $.each(productContent.kwords, function (index, item) {
        if (index == 0) productContent.selectedItem.Keyword = item.text;
        else productContent.selectedItem.Keyword += "," + item.text;
      });
      if (
        productContent.selectedItem.LinkCategoryId == null ||
        productContent.selectedItem.LinkCategoryId == 0
      ) {
        rashaErManage.showMessage($filter('translatentk')('to_add_a_product_please_select_the_category'));
        return;
      }
      var apiSelectedItem = productContent.selectedItem;

      ajax.call(cmsServerConfig.configApiServerPath + "productContent/add", apiSelectedItem, "POST").success(function (response) {
          rashaErManage.checkAction(response);
          productContent.categoryBusyIndicator.isActive = false;
          if (response.IsSuccess) {
            productContent.selectedItem.LinkSourceId = productContent.selectedItem.Id;

            productContent.ListItems.unshift(response.Item);
            productContent.gridOptions.fillData(productContent.ListItems);
            productContent.closeModal();
            //Save inputTags

            $.each(productContent.tags, function (index, item) {
              if (item.id > 0) {
                item.LinkTagId = item.id;
                item.LinkContentId = response.Item.Id;
              }
            });
            ajax.call(cmsServerConfig.configApiServerPath + "productContentTag/addbatch", productContent.tags, "POST").success(function (response) {
                rashaErManage.checkAction(response);
              })
              .error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
              });
            ///Save inputTags
          }
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          productContent.addRequested = false;
          productContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Edit Content
    productContent.editContent = function (frm) {
      if (frm.$invalid) return;
      productContent.categoryBusyIndicator.isActive = true;
      productContent.addRequested = true;
      //Save attached file ids into productContent.selectedItem.LinkFileIds
      productContent.selectedItem.LinkFileIds = "";
      productContent.stringfyLinkFileIds();
      //Save Keywords
      $.each(productContent.kwords, function (index, item) {
        if (index == 0) productContent.selectedItem.Keyword = item.text;
        else productContent.selectedItem.Keyword += "," + item.text;
      });




      //Save inputTags
      $.each(productContent.tags, function (index, item) {
        if (item.id > 0) {
          item.LinkTagId = item.id;
          item.LinkContentId = productContent.selectedItem.Id;
        }
      });
      productContent.ContentTagsRemoved = differenceInFirstArray(productContent.selectedItem.ContentTags, productContent.tags, 'LinkTagId');
      productContent.ContentTagsAdded = differenceInFirstArray(productContent.tags, productContent.selectedItem.ContentTags, 'LinkTagId');
      //remove
      if (productContent.ContentTagsRemoved && productContent.ContentTagsRemoved.length > 0) {
        ajax.call(cmsServerConfig.configApiServerPath + "productContentTag/DeleteList", productContent.ContentTagsRemoved, "Delete").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //Add
      if (productContent.ContentTagsAdded && productContent.ContentTagsAdded.length > 0) {
        ajax.call(cmsServerConfig.configApiServerPath + "productContentTag/addbatch", productContent.ContentTagsAdded, "POST").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      ///Save inputTags
      ///Save OtherInfos
      productContent.ContentOtherInfosRemoved = differenceInFirstArray(productContent.OtherInfosDb, productContent.OtherInfos, 'Id');
      productContent.ContentOtherInfosAdded = differenceInFirstArray(productContent.OtherInfos, productContent.OtherInfosDb, 'Id');
      productContent.ContentOtherInfosEdit = [];
      $.each(productContent.OtherInfos, function (index, item) {
        if (item.Edited && item.Id && item.Id > 0)
          productContent.ContentOtherInfosEdit.push(item);
      });

      //remove
      if (productContent.ContentOtherInfosRemoved && productContent.ContentOtherInfosRemoved.length > 0) {
        var OtherInfosRemovedModel = [];
        $.each(productContent.ContentOtherInfosRemoved, function (index, item) {
          OtherInfosRemovedModel.push(item);
        });
        ajax.call(cmsServerConfig.configApiServerPath + "productContentOtherInfo/DeleteList", OtherInfosRemovedModel, "Delete").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //Add
      if (productContent.ContentOtherInfosAdded && productContent.ContentOtherInfosAdded.length > 0) {
        var OtherInfosAddModel = [];
        $.each(productContent.ContentOtherInfosAdded, function (index, item) {
          OtherInfosAddModel.push(item);
        });
        ajax.call(cmsServerConfig.configApiServerPath + "productContentOtherInfo/addbatch", OtherInfosAddModel, "POST").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //edit
      if (productContent.ContentOtherInfosEdit && productContent.ContentOtherInfosEdit.length > 0) {
        ajax.call(cmsServerConfig.configApiServerPath + "productContentOtherInfo/editbatch", productContent.ContentOtherInfosEdit, "PUT").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //edit
      ///Save OtherInfos
      ///Save Similars
      productContent.ContentSimilarsRemoved = differenceInFirstArray(productContent.SimilarsDb, productContent.Similars, 'Id');
      productContent.ContentSimilarsAdded = differenceInFirstArray(productContent.Similars, productContent.SimilarsDb, 'Id');
      //remove
      if (productContent.ContentSimilarsRemoved && productContent.ContentSimilarsRemoved.length > 0) {
        var SimilarsRemovedModel = [];
        $.each(productContent.ContentSimilarsRemoved, function (index, item) {
          SimilarsRemovedModel.push({
            LinkSourceId: productContent.selectedItem.Id,
            LinkDestinationId: item.Id
          });
        });
        ajax.call(cmsServerConfig.configApiServerPath + "productContentSimilar/DeleteList", SimilarsRemovedModel, "Delete").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //Add
      if (productContent.ContentSimilarsAdded && productContent.ContentSimilarsAdded.length > 0) {
        var SimilarsAddModel = [];
        $.each(productContent.ContentSimilarsAdded, function (index, item) {
          SimilarsAddModel.push({
            LinkSourceId: productContent.selectedItem.Id,
            LinkDestinationId: item.Id
          });
        });
        ajax.call(cmsServerConfig.configApiServerPath + "productContentSimilar/addbatch", SimilarsAddModel, "POST").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      ///Save Similars

      ///Save ModulesRelationship
      productContent.ContentModuleRelationShipRemoved = differenceInFirstArray(productContent.ModuleRelationShipDb, productContent.ModuleRelationShip, '');
      productContent.ContentModuleRelationShipAdded = differenceInFirstArray(productContent.ModuleRelationShip, productContent.ModuleRelationShipDb, '');
      //remove
      if (productContent.ContentModuleRelationShipRemoved && productContent.ContentModuleRelationShipRemoved.length > 0) {

        ajax.call(cmsServerConfig.configApiServerPath + "ModulesRelationshipContent/DeleteList", productContent.ContentModuleRelationShipRemoved, "Delete").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //Add
      if (productContent.ContentModuleRelationShipAdded && productContent.ContentModuleRelationShipAdded.length > 0) {

        ajax.call(cmsServerConfig.configApiServerPath + "ModulesRelationshipContent/addbatch", productContent.ContentModuleRelationShipAdded, "POST").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      ///Save ModulesRelationship
      if (
        productContent.selectedItem.LinkCategoryId == null ||
        productContent.selectedItem.LinkCategoryId == 0
      ) {
        rashaErManage.showMessage($filter('translatentk')('to_add_a_product_please_select_the_category'));
        return;
      }
      var apiSelectedItem = {};
      apiSelectedItem = angular.extend(apiSelectedItem, productContent.selectedItem);
      apiSelectedItem.OtherInfos = [];
      ajax
        .call(cmsServerConfig.configApiServerPath + "productContent/edit", apiSelectedItem, "PUT")
        .success(function (response) {
          productContent.categoryBusyIndicator.isActive = false;
          productContent.addRequested = false;
          productContent.treeConfig.showbusy = false;
          productContent.showIsBusy = false;
          rashaErManage.checkAction(response);
          if (response.IsSuccess) {
            productContent.replaceItem(productContent.selectedItem.Id, response.Item);
            productContent.gridOptions.fillData(productContent.ListItems);
            productContent.closeModal();
          }
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          productContent.addRequested = false;
          productContent.categoryBusyIndicator.isActive = false;
        });


    };








    // Delete a product Content
    productContent.deleteContent = function () {
      if (buttonIsPressed) {
        return;
      }
      if (!productContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
        //rashaErManage.showMessage($filter('translatentk')('Tag'));
        return;
      }
      productContent.treeConfig.showbusy = true;
      productContent.showIsBusy = true;
      rashaErManage.showYesNo(
        ($filter('translatentk')('warning')),
        ($filter('translatentk')('do_you_want_to_delete_this_attribute')),
        function (isConfirmed) {
          if (isConfirmed) {
            productContent.categoryBusyIndicator.isActive = true;
            productContent.showbusy = true;
            productContent.showIsBusy = true;
            buttonIsPressed = true;
            ajax
              .call(
                cmsServerConfig.configApiServerPath + "productContent/GetOne",
                productContent.gridOptions.selectedRow.item.Id,
                "GET"
              )
              .success(function (response) {
                buttonIsPressed = false;
                productContent.showbusy = false;
                productContent.showIsBusy = false;
                rashaErManage.checkAction(response);
                productContent.selectedItemForDelete = response.Item;
                ajax
                  .call(
                    cmsServerConfig.configApiServerPath + "productContent/delete",
                    productContent.selectedItemForDelete,
                    "POST"
                  )
                  .success(function (res) {
                    productContent.categoryBusyIndicator.isActive = false;
                    productContent.treeConfig.showbusy = false;
                    productContent.showIsBusy = false;
                    rashaErManage.checkAction(res);
                    if (res.IsSuccess) {
                      productContent.replaceItem(
                        productContent.selectedItemForDelete.Id
                      );
                      productContent.gridOptions.fillData(productContent.ListItems);
                    }
                  })
                  .error(function (data2, errCode2, c2, d2) {
                    rashaErManage.checkAction(data2);
                    productContent.treeConfig.showbusy = false;
                    productContent.showIsBusy = false;
                    productContent.categoryBusyIndicator.isActive = false;
                  });
              })
              .error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                productContent.treeConfig.showbusy = false;
                productContent.showIsBusy = false;
                productContent.categoryBusyIndicator.isActive = false;
              });
          }
        }
      );
    };

    //Confirm/UnConfirm product Content
    productContent.confirmUnConfirmproductContent = function () {
      if (!productContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
        return;
      }
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "productContent/GetOne",
          productContent.gridOptions.selectedRow.item.Id,
          "GET"
        )
        .success(function (response) {
          rashaErManage.checkAction(response);
          productContent.selectedItem = response.Item;
          productContent.selectedItem.IsAccepted = response.Item.IsAccepted == true ?
            false :
            true;
          ajax
            .call(cmsServerConfig.configApiServerPath + "productContent/edit", productContent.selectedItem, "PUT")
            .success(function (response2) {
              rashaErManage.checkAction(response2);
              if (response2.IsSuccess) {
                var index = productContent.ListItems.indexOf(
                  productContent.gridOptions.selectedRow.item
                );
                if (index !== -1) {
                  productContent.ListItems[index] = response2.Item;
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
    productContent.enableArchive = function () {
      if (!productContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
        return;
      }

      ajax
        .call(
          cmsServerConfig.configApiServerPath + "productContent/GetOne",
          productContent.gridOptions.selectedRow.item.Id,
          "GET"
        )
        .success(function (response) {
          rashaErManage.checkAction(response);
          productContent.selectedItem = response.Item;
          productContent.selectedItem.IsArchive = response.Item.IsArchive == true ?
            false :
            true;
          ajax
            .call(cmsServerConfig.configApiServerPath + "productContent/edit", productContent.selectedItem, "PUT")
            .success(function (response2) {
              productContent.categoryBusyIndicator.isActive = true;
              rashaErManage.checkAction(response2);
              if (response2.IsSuccess) {
                var index = productContent.ListItems.indexOf(
                  productContent.gridOptions.selectedRow.item
                );
                if (index !== -1) {
                  productContent.ListItems[index] = response2.Item;
                }
                productContent.categoryBusyIndicator.isActive = false;
              }
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
              productContent.categoryBusyIndicator.isActive = false;
            });
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          productContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Replace Item OnDelete/OnEdit Grid Options
    productContent.replaceItem = function (oldId, newItem) {
      angular.forEach(productContent.ListItems, function (item, key) {
        if (item.Id == oldId) {
          var index = productContent.ListItems.indexOf(item);
          productContent.ListItems.splice(index, 1);
        }
      });
      if (newItem) productContent.ListItems.unshift(newItem);
    };

    productContent.summernoteOptions = {
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

    //productContent.summernoteText = '<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />';

    productContent.searchData = function () {
      productContent.categoryBusyIndicator.isActive = true;
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "productContent/getall",
          productContent.gridOptions.advancedSearchData.engine,
          "POST"
        )
        .success(function (response) {
          rashaErManage.checkAction(response);
          productContent.categoryBusyIndicator.isActive = false;
          productContent.ListItems = response.ListItems;
          productContent.gridOptions.fillData(productContent.ListItems);
          productContent.gridOptions.currentPageNumber =
            response.CurrentPageNumber;
          productContent.gridOptions.totalRowCount = response.TotalRowCount;
          productContent.gridOptions.rowPerPage = response.RowPerPage;
          productContent.allowedSearch = response.AllowedSearchField;
        })
        .error(function (data, errCode, c, d) {
          productContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
        });
    };

    //Close Model Stack
    productContent.addRequested = false;
    productContent.closeModal = function () {
      $modalStack.dismissAll();
    };

    productContent.showIsBusy = false;

    //Aprove a comment
    productContent.confirmComment = function (item) {
      if (item.Id && item.Id > 0) {
        item.RecordStatus = 1;
        var itemCopy = angular.copy(item);
        itemCopy.rowOption = null;
        ajax.call(cmsServerConfig.configApiServerPath + 'ProductComment/edit', itemCopy, 'PUT').success(function (response) {
          rashaErManage.checkAction(response);
          if(response.IsSuccess)
          productContent.showComment(productContent.gridOptions.selectedRow.item.Id)
        }).error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
      }
    };

    //Decline a comment
    productContent.doNotConfirmComment = function (item) {
      if (item.Id && item.Id > 0) {
        item.RecordStatus = 5;//DeniedConfirmed
        var itemCopy = angular.copy(item);
        itemCopy.rowOption = null;
        ajax.call(cmsServerConfig.configApiServerPath + 'ProductComment/edit', itemCopy, 'PUT').success(function (response) {
          if(response.IsSuccess)
          productContent.showComment(productContent.gridOptions.selectedRow.item.Id)
          rashaErManage.checkAction(response);
        }).error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
      }
    };
    //Remove a comment
    productContent.deleteComment = function (item) {
      if (!item) {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
        return;
      }
      productContent.treeConfig.showbusy = true;
      productContent.showIsBusy = true;
      rashaErManage.showYesNo(
        ($filter('translatentk')('warning')),
        "آیا می خواهید این نظر را حذف کنید",
        function (isConfirmed) {
          if (isConfirmed) {

            productContent.treeConfig.showbusy = true;
            productContent.showbusy = true;
            productContent.showIsBusy = true;

            var itemCopy = angular.copy(item);
            itemCopy.rowOption = null;
            ajax.call(cmsServerConfig.configApiServerPath + "productComment/delete", itemCopy, "POST")
              .success(function (res) {
                productContent.treeConfig.showbusy = false;
                productContent.showbusy = false;
                productContent.showIsBusy = false;
                rashaErManage.checkAction(res);
                if (res.IsSuccess) {
                  productContent.showComment(productContent.gridOptions.selectedRow.item.Id)
                  
                }
              })
              .error(function (data2, errCode2, c2, d2) {
                rashaErManage.checkAction(data2);
                productContent.treeConfig.showbusy = false;
                productContent.showbusy = false;
                productContent.showIsBusy = false;
              });

          }
        }
      );
    };

    //For reInit Categories
    productContent.gridOptions.reGetAll = function () {
      if (productContent.gridOptions.advancedSearchData.engine.Filters.length > 0)
        productContent.searchData();
      else productContent.init();
    };

    productContent.isCurrentNodeEmpty = function () {
      return !angular.equals({}, productContent.treeConfig.currentNode);
    };

    productContent.loadFileAndFolder = function (item) {
      productContent.treeConfig.currentNode = item;
      productContent.treeConfig.onNodeSelect(item);
    };

    productContent.openDate = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $timeout(function () {
        productContent.focus = true;
      });
    };
    productContent.openDate1 = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $timeout(function () {
        productContent.focus1 = true;
      });
    };

    productContent.columnCheckbox = false;
    productContent.openGridConfigModal = function () {
      $("#gridView-btn").toggleClass("active");
      var prechangeColumns = productContent.gridOptions.columns;
      if (productContent.gridOptions.columnCheckbox) {
        for (var i = 0; i < productContent.gridOptions.columns.length; i++) {
          //productContent.gridOptions.columns[i].visible = $("#" + productContent.gridOptions.columns[i].Id + "Checkbox").is(":checked");
          var element = $(
            "#" +
            productContent.gridOptions.columns[i].name.replace(".", "") +
            "Checkbox"
          );
          var temp = element[0].checked;
          productContent.gridOptions.columns[i].visible = temp;
        }
      } else {
        for (var i = 0; i < productContent.gridOptions.columns.length; i++) {
          var element = $(
            "#" +
            productContent.gridOptions.columns[i].name.replace(".", "") +
            "Checkbox"
          );
          $(
              "#" + productContent.gridOptions.columns[i].name + "Checkbox"
            ).checked =
            prechangeColumns[i].visible;
        }
      }
      for (var i = 0; i < productContent.gridOptions.columns.length; i++) {

      }
      productContent.gridOptions.columnCheckbox = !productContent.gridOptions
        .columnCheckbox;
    };

    productContent.deleteAttachedFile = function (index) {
      productContent.attachedFiles.splice(index, 1);
    };

    productContent.addAttachedFile = function (id) {
      var fname = $("#file" + id).text();
      if (
        id != null &&
        id != undefined &&
        !productContent.alreadyExist(id, productContent.attachedFiles) &&
        fname != null &&
        fname != ""
      ) {
        var fId = id;
        var file = {
          id: fId,
          name: fname
        };
        productContent.attachedFiles.push(file);
        if (document.getElementsByName("file" + id).length > 1)
          document.getElementsByName("file" + id)[1].textContent = "";
        else document.getElementsByName("file" + id)[0].textContent = "";
      }
    };

    productContent.alreadyExist = function (id, array) {
      for (var i = 0; i < array.length; i++) {
        if (id == array[i].fileId) {
          rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
          return true;
        }
      }
      return false;
    };

    productContent.filePickerMainImage.removeSelectedfile = function (config) {
      productContent.filePickerMainImage.fileId = null;
      productContent.filePickerMainImage.filename = null;
      productContent.selectedItem.LinkMainImageId = null;
    };
    productContent.filePickerFilePodcast.removeSelectedfile = function (config) {
      productContent.filePickerFilePodcast.fileId = null;
      productContent.filePickerFilePodcast.filename = null;
      productContent.selectedItem.LinkFilePodcastId = null;

    }
    productContent.filePickerFileMovie.removeSelectedfile = function (config) {
      productContent.filePickerFileMovie.fileId = null;
      productContent.filePickerFileMovie.filename = null;
      productContent.selectedItem.LinkFileMovieId = null;

    }
    productContent.filePickerFiles.removeSelectedfile = function (config) {
      productContent.filePickerFiles.fileId = null;
      productContent.filePickerFiles.filename = null;
    };

    productContent.showUpload = function () {
      $("#fastUpload").fadeToggle();
    };

    // ----------- FilePicker Codes --------------------------------
    productContent.addAttachedFile = function (id) {
      var fname = $("#file" + id).text();
      if (fname == "") {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
        return;
      }
      if (
        id != null &&
        id != undefined &&
        !productContent.alreadyExist(id, productContent.attachedFiles)
      ) {
        var fId = id;
        var file = {
          fileId: fId,
          filename: fname,
          previewImageSrc: cmsServerConfig.configPathFileByIdAndName + fId + "/" + fname
        };
        productContent.attachedFiles.push(file);
        productContent.clearfilePickers();
      }
    };

    productContent.alreadyExist = function (fieldId, array) {
      for (var i = 0; i < array.length; i++) {
        if (fieldId == array[i].fileId) {
          rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
          productContent.clearfilePickers();
          return true;
        }
      }
      return false;
    };

    productContent.deleteAttachedfieldName = function (index) {
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "productContent/delete",
          productContent.contractsList[index],
          "POST"
        )
        .success(function (res) {
          rashaErManage.checkAction(res);
          if (res.IsSuccess) {
            productContent.contractsList.splice(index, 1);
            rashaErManage.showMessage($filter('translatentk')('Removed_Successfully'));
          }
        })
        .error(function (data2, errCode2, c2, d2) {
          rashaErManage.checkAction(data2);
        });
    };

    productContent.parseFileIds = function (stringOfIds) {
      if (stringOfIds == null || !stringOfIds.trim()) return;
      var fileIds = stringOfIds.split(",");
      if (fileIds.length != undefined) {
        $.each(fileIds, function (index, item) {
          if (item == parseInt(item, 10)) {
            // Check if item is an integer
            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", parseInt(item), "GET").success(function (response) {
                if (response.IsSuccess) {
                  productContent.attachedFiles.push({
                    fileId: response.Item.Id,
                    filename: response.Item.FileName,
                    previewImageSrc: cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName
                  });
                }
              })
              .error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
              });
          }
        });
      }
    };

    productContent.clearfilePickers = function () {
      productContent.filePickerFiles.fileId = null;
      productContent.filePickerFiles.filename = null;
    };

    productContent.stringfyLinkFileIds = function () {
      $.each(productContent.attachedFiles, function (i, item) {
        if (productContent.selectedItem.LinkFileIds == "")
          productContent.selectedItem.LinkFileIds = item.fileId;
        else productContent.selectedItem.LinkFileIds += "," + item.fileId;
      });
    };
    //--------- End FilePickers Codes -------------------------

    //---------------Upload Modal-------------------------------
    productContent.openUploadModal = function () {
      $modal.open({
        templateUrl: "cpanelv1/Moduleproduct/productContent/upload_modal.html",
        size: "lg",
        scope: $scope
      });

      productContent.FileList = [];
      //get list of file from category id
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", null, "POST")
        .success(function (response) {
          productContent.FileList = response.ListItems;
        })
        .error(function (data) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    //---------------Upload Modal Podcast-------------------------------
    productContent.openUploadModalPodcast = function () {
      $modal.open({
        templateUrl: 'cpanelv1/Moduleproduct/productContent/upload_modalPodcast.html',
        size: 'lg',
        scope: $scope
      });

      productContent.FileList = [];
      //get list of file from category id
      ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
        productContent.FileList = response.ListItems;
      }).error(function (data) {
        rashaErManage.checkAction(data, errCode);
      });

    }
    //---------------Upload Modal Movie-------------------------------
    productContent.openUploadModalMovie = function () {
      $modal.open({
        templateUrl: 'cpanelv1/Moduleproduct/productContent/upload_modalMovie.html',
        size: 'lg',
        scope: $scope
      });

      productContent.FileList = [];
      //get list of file from category id
      ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
        productContent.FileList = response.ListItems;
      }).error(function (data) {
        rashaErManage.checkAction(data, errCode);
      });

    }

    productContent.calcuteProgress = function (progress) {
      wdth = Math.floor(progress * 100);
      return wdth;
    };

    productContent.whatcolor = function (progress) {
      wdth = Math.floor(progress * 100);
      if (wdth >= 0 && wdth < 30) {
        return "danger";
      } else if (wdth >= 30 && wdth < 50) {
        return "warning";
      } else if (wdth >= 50 && wdth < 85) {
        return "info";
      } else {
        return "success";
      }
    };

    productContent.canShow = function (pr) {
      if (pr == 1) {
        return true;
      }
      return false;
    };
    // File Manager actions
    productContent.replaceFile = function (name) {
      productContent.itemClicked(null, productContent.fileIdToDelete, "file");
      productContent.fileTypes = 1;
      productContent.fileIdToDelete = productContent.selectedIndex;

      // Delete the file
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", productContent.fileIdToDelete, "GET")
        .success(function (response1) {
          rashaErManage.checkAction(response1);
          if (response1.IsSuccess == true) {

            ajax
              .call(cmsServerConfig.configApiServerPath + "FileContent/delete", response1.Item, "POST")
              .success(function (response2) {
                productContent.remove(
                  productContent.FileList,
                  productContent.fileIdToDelete
                );
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess == true) {
                  // Save New file
                  ajax
                    .call(cmsServerConfig.configApiServerPath + "FileContent/GetViewModel", "", "GET")
                    .success(function (response3) {
                      rashaErManage.checkAction(response3);

                      if (response3.IsSuccess == true) {
                        productContent.FileItem = response3.Item;
                        productContent.FileItem.FileName = name;
                        productContent.FileItem.Extension = name.split(".").pop();
                        productContent.FileItem.FileSrc = name;
                        productContent.FileItem.LinkCategoryId =
                          productContent.thisCategory;
                        productContent.saveNewFile();
                      } else {

                      }
                    })
                    .error(function (data) {
                      rashaErManage.checkAction(data, errCode);
                    });
                } else {

                }
              })
              .error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
              });
          }
        })
        .error(function (data) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    //save new file
    productContent.saveNewFile = function () {
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/add", productContent.FileItem, "POST")
        .success(function (response) {
          if (response.IsSuccess) {
            productContent.FileItem = response.Item;
            productContent.showSuccessIcon();
            return 1;
          } else {
            return 0;
          }
        })
        .error(function (data) {
          productContent.showErrorIcon();
          return -1;
        });
    };

    productContent.showSuccessIcon = function () {};

    productContent.showErrorIcon = function () {};
    //file is exist
    productContent.fileIsExist = function (fileName) {
      for (var i = 0; i < productContent.FileList.length; i++) {
        if (productContent.FileList[i].FileName == fileName) {
          productContent.fileIdToDelete = productContent.FileList[i].Id;
          return true;
        }
      }
      return false;
    };

    productContent.getFileItem = function (id) {
      for (var i = 0; i < productContent.FileList.length; i++) {
        if (productContent.FileList[i].Id == id) {
          return productContent.FileList[i];
        }
      }
    };

    //select file or folder
    productContent.itemClicked = function ($event, index, type) {
      if (type == "file" || type == 1) {
        productContent.fileTypes = 1;
        productContent.selectedFileId = productContent.getFileItem(index).Id;
        productContent.selectedFileName = productContent.getFileItem(index).FileName;
      } else {
        productContent.fileTypes = 2;
        productContent.selectedCategoryId = productContent.getCategoryName(index).Id;
        productContent.selectedCategoryTitle = productContent.getCategoryName(
          index
        ).Title;
      }
      productContent.selectedIndex = index;
    };

    productContent.toggleCategoryButtons = function () {
      $("#categoryButtons").fadeToggle();
    };
    //upload file Podcast
    productContent.uploadFilePodcast = function (index, uploadFile) {
      if ($("#save-icon" + index).hasClass("fa-save")) {
        if (productContent.fileIsExist(uploadFile.name)) { // File already exists
          if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
            //------------ productContent.replaceFile(uploadFile.name);
            productContent.itemClicked(null, productContent.fileIdToDelete, "file");
            productContent.fileTypes = 1;
            productContent.fileIdToDelete = productContent.selectedIndex;
            // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                productContent.fileIdToDelete,
                "GET"
              )
              .success(function (response1) {
                if (response1.IsSuccess == true) {
                  rashaErManage.checkAction(response1);
                  ajax.call(cmsServerConfig.configApiServerPath + "FileContent/replace", response1.Item, "POST")
                    .success(function (response2) {
                      rashaErManage.checkAction(response2);

                      if (response2.IsSuccess == true) {
                        productContent.FileItem = response2.Item;
                        productContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        productContent.filePickerFilePodcast.filename =
                          productContent.FileItem.FileName;
                        productContent.filePickerFilePodcast.fileId =
                          response2.Item.Id;
                        productContent.selectedItem.LinkFilePodcastId =
                          productContent.filePickerFilePodcast.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function (data) {
                      productContent.showErrorIcon();
                      $("#save-icon" + index).removeClass("fa-save");
                      $("#save-button" + index).removeClass("flashing-button");
                      $("#save-icon" + index).addClass("fa-remove");
                    });
                  //-----------------------------------
                }
              })
              .error(function (data) {
                rashaErManage.checkAction(data, errCode);
              });
            //--------------------------------
          } else {
            return;
          }
        } else { // File does not exists
          // Save New file
          ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetViewModel", "", 'GET').success(function (response) {
            productContent.FileItem = response.Item;
            productContent.FileItem.FileName = uploadFile.name;
            productContent.FileItem.uploadName = uploadFile.uploadName;
            productContent.FileItem.Extension = uploadFile.name.split('.').pop();
            productContent.FileItem.FileSrc = uploadFile.name;
            productContent.FileItem.LinkCategoryId = null; //Save the new file in the root
            // ------- productContent.saveNewFile()  ----------------------
            var result = 0;
            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/add", productContent.FileItem, 'POST').success(function (response) {
              if (response.IsSuccess) {
                productContent.FileItem = response.Item;
                productContent.showSuccessIcon();
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-check");
                productContent.filePickerFilePodcast.filename = productContent.FileItem.FileName;
                productContent.filePickerFilePodcast.fileId = response.Item.Id;
                productContent.selectedItem.LinkFilePodcastId = productContent.filePickerFilePodcast.fileId

              } else {
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-remove");
              }
            }).error(function (data) {
              productContent.showErrorIcon();
              $("#save-icon" + index).removeClass("fa-save");
              $("#save-button" + index).removeClass("flashing-button");
              $("#save-icon" + index).addClass("fa-remove");
            });
            //-----------------------------------
          }).error(function (data) {
            rashaErManage.checkAction(data, errCode);
            $("#save-icon" + index).removeClass("fa-save");
            $("#save-button" + index).removeClass("flashing-button");
            $("#save-icon" + index).addClass("fa-remove");
          });
        }
      }
    }
    //upload file Movie
    productContent.uploadFileMovie = function (index, uploadFile) {
      if ($("#save-icon" + index).hasClass("fa-save")) {
        if (productContent.fileIsExist(uploadFile.name)) { // File already exists
          if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
            //------------ productContent.replaceFile(uploadFile.name);
            productContent.itemClicked(null, productContent.fileIdToDelete, "file");
            productContent.fileTypes = 1;
            productContent.fileIdToDelete = productContent.selectedIndex;
            // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                productContent.fileIdToDelete,
                "GET"
              )
              .success(function (response1) {
                if (response1.IsSuccess == true) {
                  rashaErManage.checkAction(response1);
                  ajax.call(cmsServerConfig.configApiServerPath + "FileContent/replace", response1.Item, "POST")
                    .success(function (response2) {
                      rashaErManage.checkAction(response2);

                      if (response2.IsSuccess == true) {
                        productContent.FileItem = response2.Item;
                        productContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        productContent.filePickerFileMovie.filename =
                          productContent.FileItem.FileName;
                        productContent.filePickerFileMovie.fileId =
                          response2.Item.Id;
                        productContent.selectedItem.LinkFileMovieId =
                          productContent.filePickerFileMovie.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function (data) {
                      productContent.showErrorIcon();
                      $("#save-icon" + index).removeClass("fa-save");
                      $("#save-button" + index).removeClass("flashing-button");
                      $("#save-icon" + index).addClass("fa-remove");
                    });
                  //-----------------------------------
                }
              })
              .error(function (data) {
                rashaErManage.checkAction(data, errCode);
              });
            //--------------------------------
          } else {
            return;
          }
        } else { // File does not exists
          // Save New file
          ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetViewModel", "", 'GET').success(function (response) {
            productContent.FileItem = response.Item;
            productContent.FileItem.FileName = uploadFile.name;
            productContent.FileItem.uploadName = uploadFile.uploadName;
            productContent.FileItem.Extension = uploadFile.name.split('.').pop();
            productContent.FileItem.FileSrc = uploadFile.name;
            productContent.FileItem.LinkCategoryId = null; //Save the new file in the root
            // ------- productContent.saveNewFile()  ----------------------
            var result = 0;
            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/add", productContent.FileItem, 'POST').success(function (response) {
              if (response.IsSuccess) {
                productContent.FileItem = response.Item;
                productContent.showSuccessIcon();
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-check");
                productContent.filePickerFileMovie.filename = productContent.FileItem.FileName;
                productContent.filePickerFileMovie.fileId = response.Item.Id;
                productContent.selectedItem.LinkFileMovieId = productContent.filePickerFileMovie.fileId

              } else {
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-remove");
              }
            }).error(function (data) {
              productContent.showErrorIcon();
              $("#save-icon" + index).removeClass("fa-save");
              $("#save-button" + index).removeClass("flashing-button");
              $("#save-icon" + index).addClass("fa-remove");
            });
            //-----------------------------------
          }).error(function (data) {
            rashaErManage.checkAction(data, errCode);
            $("#save-icon" + index).removeClass("fa-save");
            $("#save-button" + index).removeClass("flashing-button");
            $("#save-icon" + index).addClass("fa-remove");
          });
        }
      }
    }
    //End of Upload Modal-----------------------------------------
    //upload file
    productContent.uploadFile = function (index, uploadFile) {
      if ($("#save-icon" + index).hasClass("fa-save")) {
        if (productContent.fileIsExist(uploadFile.name)) {
          // File already exists
          if (
            confirm(
              'File "' +
              uploadFile.name +
              '" already exists! Do you want to replace the new file?'
            )
          ) {
            //------------ productContent.replaceFile(uploadFile.name);
            productContent.itemClicked(null, productContent.fileIdToDelete, "file");
            productContent.fileTypes = 1;
            productContent.fileIdToDelete = productContent.selectedIndex;
            // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                productContent.fileIdToDelete,
                "GET"
              )
              .success(function (response1) {
                rashaErManage.checkAction(response1);
                if (response1.IsSuccess == true) {
                  ajax.call(cmsServerConfig.configApiServerPath + "FileContent/replace", response1.Item, "POST")
                    .success(function (response2) {
                      if (response2.IsSuccess == true) {
                        productContent.FileItem = response2.Item;
                        productContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        productContent.filePickerMainImage.filename =
                          productContent.FileItem.FileName;
                        productContent.filePickerMainImage.fileId =
                          response2.Item.Id;
                        productContent.selectedItem.LinkMainImageId =
                          productContent.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function (data) {
                      productContent.showErrorIcon();
                      $("#save-icon" + index).removeClass("fa-save");
                      $("#save-button" + index).removeClass("flashing-button");
                      $("#save-icon" + index).addClass("fa-remove");
                    });
                  //-----------------------------------
                }
              })
              .error(function (data) {
                rashaErManage.checkAction(data, errCode);
              });
            //--------------------------------
          } else {
            return;
          }
        } else {
          // File does not exists
          // Save New file
          ajax
            .call(cmsServerConfig.configApiServerPath + "FileContent/GetViewModel", "", "GET")
            .success(function (response) {
              productContent.FileItem = response.Item;
              productContent.FileItem.FileName = uploadFile.name;
              productContent.FileItem.uploadName = uploadFile.uploadName;
              productContent.FileItem.Extension = uploadFile.name.split(".").pop();
              productContent.FileItem.FileSrc = uploadFile.name;
              productContent.FileItem.LinkCategoryId = null; //Save the new file in the root
              // ------- productContent.saveNewFile()  ----------------------
              var result = 0;
              ajax
                .call(cmsServerConfig.configApiServerPath + "FileContent/add", productContent.FileItem, "POST")
                .success(function (response) {
                  if (response.IsSuccess) {
                    productContent.FileItem = response.Item;
                    productContent.showSuccessIcon();
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-check");
                    productContent.filePickerMainImage.filename =
                      productContent.FileItem.FileName;
                    productContent.filePickerMainImage.fileId = response.Item.Id;
                    productContent.selectedItem.LinkMainImageId =
                      productContent.filePickerMainImage.fileId;
                  } else {
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-remove");
                  }
                })
                .error(function (data) {
                  productContent.showErrorIcon();
                  $("#save-icon" + index).removeClass("fa-save");
                  $("#save-button" + index).removeClass("flashing-button");
                  $("#save-icon" + index).addClass("fa-remove");
                });
              //-----------------------------------
            })
            .error(function (data) {
              rashaErManage.checkAction(data, errCode);
              $("#save-icon" + index).removeClass("fa-save");
              $("#save-button" + index).removeClass("flashing-button");
              $("#save-icon" + index).addClass("fa-remove");
            });
        }
      }
    };
    //End of Upload Modal-----------------------------------------

    //Export Report
    productContent.exportFile = function () {
      productContent.addRequested = true;
      productContent.gridOptions.advancedSearchData.engine.ExportFile =
        productContent.ExportFileClass;
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "productContent/exportfile",
          productContent.gridOptions.advancedSearchData.engine,
          "POST"
        )
        .success(function (response) {
          productContent.addRequested = false;
          rashaErManage.checkAction(response);
          if (response.IsSuccess) {
            productContent.exportDownloadLink =
              window.location.origin + response.LinkFile;
            $window.open(response.LinkFile, "_blank");
            //productContent.closeModal();
          }
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    //Open Export Report Modal
    productContent.toggleExportForm = function () {
      productContent.SortType = [{
          key: "نزولی",
          value: 0
        },
        {
          key: "صعودی",
          value: 1
        },
        {
          key: "تصادفی",
          value: 3
        }
      ];
      productContent.EnumExportFileType = [{
          key: "Excel",
          value: 1
        },
        {
          key: "PDF",
          value: 2
        },
        {
          key: "Text",
          value: 3
        }
      ];
      productContent.EnumExportReceiveMethod = [{
          key: "دانلود",
          value: 0
        },
        {
          key: "ایمیل",
          value: 1
        },
        {
          key: "فایل منیجر",
          value: 3
        }
      ];
      productContent.ExportFileClass = {
        FileType: 1,
        RecieveMethod: 0,
        RowCount: 100
      };
      productContent.exportDownloadLink = null;
      $modal.open({
        templateUrl: "cpanelv1/ModuleProduct/ProductContent/report.html",
        scope: $scope
      });
    };
    //Row Count Export Input Change
    productContent.rowCountChanged = function () {
      if (
        !angular.isDefined(productContent.ExportFileClass.RowCount) ||
        productContent.ExportFileClass.RowCount > 5000
      )
        productContent.ExportFileClass.RowCount = 5000;
    };
    //Get TotalRowCount
    productContent.getCount = function () {
      ajax.call(cmsServerConfig.configApiServerPath + "productContent/count", productContent.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
          productContent.addRequested = false;
          rashaErManage.checkAction(response);
          productContent.ListItemsTotalRowCount = ": " + response.TotalRowCount;
        })
        .error(function (data, errCode, c, d) {
          productContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
        });
    };

    productContent.showCategoryImage = function (mainImageId) {
      if (mainImageId == 0 || mainImageId == null) return;
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/PreviewImage", {
          id: mainImageId,
          name: ""
        }, "POST")
        .success(function (response) {
          productContent.selectedItem.MainImageSrc = response;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };

    //TreeControl
    productContent.treeOptions = {
      nodeChildren: "Children",
      multiSelection: false,
      isLeaf: function (node) {
        if (node.FileName == undefined || node.Filename == "") return false;
        return true;
      },
      isSelectable: function (node) {
        if (productContent.treeOptions.dirSelectable)
          if (angular.isDefined(node.FileName)) return false;
        return true;
      },
      dirSelectable: false
    };

    productContent.onNodeToggle = function (node, expanded) {
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
                rashaErManage.checkAction(data, errCode);
              });
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
    };


    productContent.onSelection = function (node, selected) {
      if (!selected) {
        productContent.selectedItem.LinkMainImageId = null;
        productContent.selectedItem.previewImageSrc = null;
        return;
      }
      productContent.selectedItem.LinkMainImageId = node.Id;
      productContent.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages + "loader.gif";
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", node.Id, "GET")
        .success(function (response) {
          productContent.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    //End of TreeControl
  }
]);