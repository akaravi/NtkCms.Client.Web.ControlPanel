app.controller("biographyContentController", [
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
    var biographyContent = this;
    //شناسه اینام این ماژول در ارتباطات
    //Biography_WrapperBiographyContent
    ModuleRelationShipModuleNameMain = 10;
    biographyContent.RouteUploadFileContent = cmsServerConfig.configRouteUploadFileContent;
    var edititem = false;
    //For Grid Options
    biographyContent.gridOptions = {};
    biographyContent.selectedItem = {};
    biographyContent.selectedItemRelationship = {};
    biographyContent.attachedFiles = [];

    biographyContent.filePickerMainImage = {
      isActive: true,
      backElement: "filePickerMainImage",
      filename: null,
      fileId: null,
      multiSelect: false
    };
    biographyContent.filePickerFilePodcast = {
      isActive: true,
      backElement: 'filePickerFilePodcast',
      filename: null,
      fileId: null,
      extension: 'mp3',
      multiSelect: false,
    }

    biographyContent.filePickerFileMovie = {
      isActive: true,
      backElement: 'filePickerFileMovie',
      filename: null,
      fileId: null,
      extension: 'mp4,avi',
      multiSelect: false,
    }
    biographyContent.filePickerFiles = {
      isActive: true,
      backElement: "filePickerFiles",
      multiSelect: false,
      fileId: null,
      filename: null
    };
    biographyContent.locationChanged = function (lat, lang) {
      //console.log("ok " + lat + " " + lang);
    }
    biographyContent.selectedContentId = {
      Id: $stateParams.ContentId,
      TitleTag: $stateParams.TitleTag
    };
    biographyContent.GeolocationConfig = {
      latitude: 'Geolocationlatitude',
      longitude: 'Geolocationlongitude',
      onlocationChanged: biographyContent.locationChanged,
      useCurrentLocation: true,
      center: {
        lat: 32.658066,
        lng: 51.6693815
      },
      zoom: 4,
      scope: biographyContent,
      useCurrentLocationZoom: 12,
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) {
      biographyContent.itemRecordStatus = itemRecordStatus;
    }
    var date = moment().format();
    biographyContent.selectedItem.ExpireDate = date;
    // biographyContent.datePickerConfig = {
    //   defaultDate: date
    // };

    // biographyContent.FromDate = {
    //   defaultDate: date
    // };
    // biographyContent.ExpireDate = {
    //   defaultDate: date
    // };
  //   biographyContent.DatePeriodStart = {
  //     defaultDate: date
  // };
  // biographyContent.DatePeriodEnd = {
  //     defaultDate: date
  // }
    //#help/ سلکتور دسته بندی در ویرایش محتوا
    biographyContent.LinkCategoryIdSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkCategoryId",
      url: "BiographyCategory",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: biographyContent,
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
    biographyContent.SimilarsSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "Iddddd",
      url: "BiographyContent",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: biographyContent,
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
    biographyContent.LinkModuleContentIdOtherSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkModuleContentIdOther",
      url: "biographyContent",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: biographyContent,
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


    biographyContent.selectedItemModuleRelationShip = [];
    biographyContent.ModuleRelationShip = [];


    biographyContent.moveSelectedRelationOnAdd = function () {
      if (!biographyContent.LinkModuleContentIdOtherSelector.selectedItem.Id || !biographyContent.selectedItemModuleRelationShip.ModuleNameOther) {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_RelationShip'));
        return;
      }
      if (!biographyContent.selectedItemModuleRelationShip.Title || biographyContent.selectedItemModuleRelationShip.Title.length == 0)
        biographyContent.selectedItemModuleRelationShip.Title = biographyContent.LinkModuleContentIdOtherSelector.filterText;
      for (var i = 0; i < biographyContent.ModuleRelationShip.length; i++) {
        if (biographyContent.ModuleRelationShip[i].Id == biographyContent.LinkModuleContentIdOtherSelector.selectedItem.Id) {
          rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
          return;
        }
      }
      biographyContent.ModuleRelationShip.push({
        Title: biographyContent.selectedItemModuleRelationShip.Title,
        ModuleNameOther: biographyContent.selectedItemModuleRelationShip.ModuleNameOther.Value,
        LinkModuleContentIdOther: biographyContent.LinkModuleContentIdOtherSelector.selectedItem.Id,
        ModuleNameMain: ModuleRelationShipModuleNameMain,
        LinkModuleContentIdMain: biographyContent.gridOptions.selectedRow.item.Id
      });
      biographyContent.selectedItemModuleRelationShip = [];
      biographyContent.LinkModuleContentIdOtherSelector.LinkModuleContentIdOther = 0;
    };
    biographyContent.moveSelectedRelationOnEdit = function () {
      if (!biographyContent.LinkModuleContentIdOtherSelector.selectedItem.Id || !biographyContent.selectedItemRelationship.ModuleNameOther) {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_RelationShip'));
        return;
      }
      if (!biographyContent.selectedItemRelationship.Title || biographyContent.selectedItemRelationship.Title.length == 0)
        biographyContent.selectedItemRelationship.Title = biographyContent.LinkModuleContentIdOtherSelector.filterText;

      for (var i = 0; i < biographyContent.ModuleRelationShip.length; i++) {
        if (biographyContent.ModuleRelationShip[i].Id == biographyContent.LinkModuleContentIdOtherSelector.selectedItem.Id &&
          biographyContent.ModuleRelationShip[i].LinkModuleContentIdOther == biographyContent.selectedItemRelationship.ModuleNameOther.Value) {
          rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
          return;
        }
      }

      biographyContent.ModuleRelationShip.push({
        Title: biographyContent.selectedItemRelationship.Title,
        ModuleNameOther: biographyContent.selectedItemRelationship.ModuleNameOther.Value,
        LinkModuleContentIdOther: biographyContent.LinkModuleContentIdOtherSelector.selectedItem.Id,
        ModuleNameMain: ModuleRelationShipModuleNameMain,
        LinkModuleContentIdMain: biographyContent.gridOptions.selectedRow.item.Id
      });
      biographyContent.selectedItemRelationship = [];
      biographyContent.LinkModuleContentIdOtherSelector.LinkModuleContentIdOther = 0;
    };

    biographyContent.removeFromCollectionRelationShip = function (deleteItem) {
      for (var i = 0; i < biographyContent.ModuleRelationShip.length; i++) {
        if (biographyContent.ModuleRelationShip[i].LinkModuleContentIdOther == deleteItem.LinkModuleContentIdOther &&
          biographyContent.ModuleRelationShip[i].ModuleNameOther == deleteItem.ModuleNameOther
        ) {
          biographyContent.ModuleRelationShip.splice(i, 1);
          return;
        }
      }
    };
    biographyContent.removeFromCollectionOtherInfo = function (deleteItem) {
      for (var i = 0; i < biographyContent.OtherInfos.length; i++) {
        if (biographyContent.OtherInfos[i].Id == deleteItem.Id) {
          biographyContent.OtherInfos.splice(i, 1);
          return;
        }
      }
    };
    biographyContent.removeFromCollectionSimilars = function (deleteItem) {
      for (var i = 0; i < biographyContent.Similars.length; i++) {
        if (biographyContent.Similars[i].Id == deleteItem.Id) {
          biographyContent.Similars.splice(i, 1);
          return;
        }
      }
    };
    biographyContent.editFromCollectionOtherInfo = function (editItem) {
      biographyContent.todoModeTitle = $filter('translatentk')('edit_now');
      biographyContent.editMode = true;
      biographyContent.selectedItemOtherInfos = angular.copy(editItem);
      $scope.currentItemIndex = biographyContent.OtherInfos.indexOf(editItem);
    };

    //#help otherInfo

    biographyContent.editOtherInfo = function (y) {
      if (y == null || y == undefined || y.Title == "" || y.Title == undefined || y.HtmlBody == "" || y.HtmlBody == undefined) {
        rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
        return;
      }
      edititem = true;
      biographyContent.selectedItemOtherInfos.Title = y.Title;
      biographyContent.selectedItemOtherInfos.HtmlBody = y.HtmlBody;
      biographyContent.selectedItemOtherInfos.Source = y.Source;
      biographyContent.removeFromOtherInfo(biographyContent.OtherInfos, y.Title, y.HtmlBody, y.Source);
    };
    biographyContent.changSelectedRelationModuleAdd = function () {
      biographyContent.LinkModuleContentIdOtherSelector.url = biographyContent.selectedItemModuleRelationShip.ModuleNameOther.Key.split(/Wrapper(.+)/)[1];
      biographyContent.LinkModuleContentIdOtherSelector.selectedItem = {};
      biographyContent.selectedItem.LinkModuleContentIdOther = {};
    }
    biographyContent.changSelectedRelationModuleEdit = function () {
      biographyContent.LinkModuleContentIdOtherSelector.url = biographyContent.selectedItemRelationship.ModuleNameOther.Key.split(/Wrapper(.+)/)[1];
      biographyContent.LinkModuleContentIdOtherSelector.selectedItem = {};
      biographyContent.selectedItem.LinkModuleContentIdOther = {};
    }
    biographyContent.UrlContent = "";
    //biography Grid Options
    biographyContent.gridOptions = {
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
          template: '<li ng-if="!x.IsActivated" class="dropdown" dropdown="" style="display: initial;"><a aria-expanded="false" aria-haspopup="true" class="dropdown-toggle count-info" href="" dropdown-toggle=""><i class="fa fa-cog" ></i></a><ul class="dropdown-menu animated fadeInLeft m-t-xs" style="right: -142px;"><li><a ng-click="biographyContent.addMenu()" style="color:black">AddMenu</a></li><li><a ng-click="biographyContent.showComment(x.Id)" style="color:black">CommentList</a></li></ul></li>'
        }

      ],
      data: {},
      multiSelect: false,
      advancedSearchData: {
        engine: {}
      }
    };
    //Comment Grid Options
    biographyContent.gridContentOptions = {
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
            '<Button ng-if="(x.RecordStatus!=1)" ng-click="biographyContent.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتایید می کنم</Button>' +
            '<Button ng-if="(x.RecordStatus==1)" ng-click="biographyContent.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspغیرفعال می کنم</Button>' +
            '<Button ng-click="biographyContent.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>'
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
    biographyContent.gridOptions.advancedSearchData.engine.Filters = null;
    biographyContent.gridOptions.advancedSearchData.engine.Filters = [];

    //For Show Category Loading Indicator
    biographyContent.categoryBusyIndicator = {
      isActive: true,
      message: "در حال بارگذاری دسته ها ..."
    };
    //For Show biography Loading Indicator
    biographyContent.contentBusyIndicator = {
      isActive: false,
      message: "در حال بارگذاری ..."
    };
    //Tree Config
    biographyContent.treeConfig = {
      displayMember: "Title",
      displayId: "Id",
      displayChild: "Children"
    };

    //open addMenu modal
    biographyContent.addMenu = function () {

      $modal.open({
        templateUrl: "cpanelv1/Modulebiography/biographyContent/modalMenu.html",
        scope: $scope
      });
    };

    biographyContent.treeConfig.currentNode = {};
    biographyContent.treeBusyIndicator = false;

    biographyContent.addRequested = false;

    biographyContent.showGridComment = false;
    biographyContent.biographyTitle = "";

    //init Function
    biographyContent.init = function () {
      biographyContent.categoryBusyIndicator.isActive = true;

      var engine = {};
      try {
        engine = biographyContent.gridOptions.advancedSearchData.engine;
      } catch (error) {
        //console.log(error);
      }
      ajax.call(cmsServerConfig.configApiServerPath + "ModulesRelationshipContent/GetEnum", {}, 'POST').success(function (response) {
        rashaErManage.checkAction(response);
        biographyContent.EnumModuleRelationshipName = response.ListItems;
        if (biographyContent.EnumModuleRelationshipName && biographyContent.EnumModuleRelationshipName.length) {
          var retFind = findWithAttr(biographyContent.EnumModuleRelationshipName, "Key", "Biography_WrapperBiographyContent");
          if (retFind >= 0)
            ModuleRelationShipModuleNameMain = biographyContent.EnumModuleRelationshipName[retFind].Value;
        }
      }).error(function (data, errCode, c, d) {
        rashaErManage.checkAction(data, errCode);
      });
      biographyContent.categoryBusyIndicator.isActive = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "biographyCategory/getall", {
          RowPerPage: 1000
        }, "POST")
        .success(function (response) {
          rashaErManage.checkAction(response);
          biographyContent.treeConfig.Items = response.ListItems;
          biographyContent.categoryBusyIndicator.isActive = false;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
      filterModel = {
        PropertyName: "ContentTags",
        PropertyAnyName: "LinkTagId",
        SearchType: 0,
        IntValue1: biographyContent.selectedContentId.Id
      };
      if (biographyContent.selectedContentId.Id > 0)
        biographyContent.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
      biographyContent.contentBusyIndicator.isActive = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "biographyContent/getall", biographyContent.gridOptions.advancedSearchData.engine, "POST")
        .success(function (response) {
          rashaErManage.checkAction(response);
          biographyContent.ListItems = response.ListItems;
          biographyContent.gridOptions.fillData(
            biographyContent.ListItems,
            response.resultAccess
          ); // Sending Access as an argument
          biographyContent.contentBusyIndicator.isActive = false;
          biographyContent.gridOptions.currentPageNumber =
            response.CurrentPageNumber;
          biographyContent.gridOptions.totalRowCount = response.TotalRowCount;
          biographyContent.gridOptions.rowPerPage = response.RowPerPage;
          biographyContent.gridOptions.maxSize = 5;
        })
        .error(function (data, errCode, c, d) {
          biographyContent.contentBusyIndicator.isActive = false;
          biographyContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
          biographyContent.contentBusyIndicator.isActive = false;
        });

      ajax.call(cmsServerConfig.configApiServerPath + "biographyContentTag/GetViewModel", "", "GET").success(function (response) { //Get a ViewModel for biographyContentTag
          biographyContent.ModuleContentTag = response.Item;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);;
        });
    };
    biographyContent.EnumModuleName = function (enumId) {
      if (!biographyContent.EnumModuleRelationshipName || biographyContent.EnumModuleRelationshipName.length == 0)
        return enumId;
      var retFind = findWithAttr(biographyContent.EnumModuleRelationshipName, "Value", enumId);
      if (retFind < 0)
        return enumId;
      return biographyContent.EnumModuleRelationshipName[retFind].Description;
    }
    // For Show Comments
    biographyContent.showComment = function (LinkContentId) {
      //biographyContent.contentBusyIndicator = true;
      engine = {};
      var filterValue = {
        PropertyName: "LinkContentId",
        IntValue1: parseInt(LinkContentId),
        SearchType: 0
      }
      biographyContent.busyIndicatorForDropDownProcess = true;
      engine.Filters = null;
      engine.Filters = [];
      engine.Filters.push(filterValue);
      ajax.call(cmsServerConfig.configApiServerPath + "biographycomment/getall", engine, 'POST').success(function (response) {
        rashaErManage.checkAction(response);
        biographyContent.ListCommentItems = response.ListItems;
        biographyContent.gridContentOptions.fillData(biographyContent.ListCommentItems, response.resultAccess); // Sending Access as an argument
        biographyContent.showGridComment = true;
        biographyContent.gridContentOptions.currentPageNumber = response.CurrentPageNumber;
        biographyContent.gridContentOptions.totalRowCount = response.TotalRowCount;
        biographyContent.gridContentOptions.rowPerPage = response.RowPerPage;
        biographyContent.gridContentOptions.maxSize = 5;
        $('html, body').animate({scrollTop: $('#ListComment').offset().top }, 'slow');
      
      }).error(function (data, errCode, c, d) {
        biographyContent.gridContentOptions.fillData();
        rashaErManage.checkAction(data, errCode);
        biographyContent.contentBusyIndicator.isActive = false;
      });
    };


    biographyContent.gridContentOptions.onRowSelected = function () {};

    // Open Add Category Modal
    biographyContent.addNewCategoryModel = function () {
      if (buttonIsPressed) {
        return;
      }
      biographyContent.addRequested = false;
      buttonIsPressed = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "biographyCategory/GetViewModel", "", "GET")
        .success(function (response) {
          buttonIsPressed = false;
          rashaErManage.checkAction(response);
          biographyContent.selectedItem = response.Item;
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
              biographyContent.dataForTheTree = response1.ListItems;
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
                    biographyContent.dataForTheTree,
                    response2.ListItems
                  );
                  $modal.open({
                    templateUrl: "cpanelv1/ModuleBiography/BiographyCategory/add.html",
                    scope: $scope
                  });
                  biographyContent.addRequested = false;
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
    biographyContent.EditCategoryModel = function () {
      if (buttonIsPressed) {
        return;
      }
      biographyContent.addRequested = false;
      //biographyContent.modalTitle = ($filter('translatentk')('Edit_Category'));
      if (!biographyContent.treeConfig.currentNode) {
        rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
        return;
      }

      biographyContent.contentBusyIndicator.isActive = true;
      buttonIsPressed = true;
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "biographyCategory/GetOne",
          biographyContent.treeConfig.currentNode.Id,
          "GET"
        )
        .success(function (response) {
          buttonIsPressed = false;
          biographyContent.contentBusyIndicator.isActive = false;
          rashaErManage.checkAction(response);
          biographyContent.selectedItem = response.Item;
          //Set dataForTheTree
          biographyContent.selectedNode = [];
          biographyContent.expandedNodes = [];
          biographyContent.selectedItem = response.Item;
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
              biographyContent.dataForTheTree = response1.ListItems;
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
                    biographyContent.dataForTheTree,
                    response2.ListItems
                  );
                  //Set selected files to treeControl
                  if (biographyContent.selectedItem.LinkMainImageId > 0)
                    biographyContent.onSelection({
                        Id: biographyContent.selectedItem.LinkMainImageId
                      },
                      true
                    );
                  $modal.open({
                    templateUrl: "cpanelv1/ModuleBiography/BiographyCategory/edit.html",
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
    biographyContent.Showstatistics = function () {
      if (!biographyContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
        return;
      }
      ajax.call(cmsServerConfig.configApiServerPath + 'biographyContent/GetOne', biographyContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
        rashaErManage.checkAction(response1);
        biographyContent.selectedItem = response1.Item;
        $modal.open({
          templateUrl: "cpanelv1/Modulebiography/biographyContent/statistics.html",
          scope: $scope
        });
      }).error(function (data, errCode, c, d) {
        rashaErManage.checkAction(data, errCode);
      });
    }

    // Add New Category
    biographyContent.addNewCategory = function (frm) {
      if (frm.$invalid) return;
      biographyContent.categoryBusyIndicator.isActive = true;
      biographyContent.addRequested = true;
      biographyContent.selectedItem.LinkParentId = null;
      if (biographyContent.treeConfig.currentNode != null)
        biographyContent.selectedItem.LinkParentId =
        biographyContent.treeConfig.currentNode.Id;
      ajax
        .call(cmsServerConfig.configApiServerPath + "biographyCategory/add", biographyContent.selectedItem, "POST")
        .success(function (response) {
          biographyContent.addRequested = false;
          rashaErManage.checkAction(response);

          if (response.IsSuccess) {
            biographyContent.gridOptions.advancedSearchData.engine.Filters = null;
            biographyContent.gridOptions.advancedSearchData.engine.Filters = [];
            biographyContent.gridOptions.reGetAll();
            biographyContent.closeModal();
          }
          biographyContent.categoryBusyIndicator.isActive = false;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          biographyContent.addRequested = false;
          biographyContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Edit Category REST Api
    biographyContent.EditCategory = function (frm) {
      if (frm.$invalid) return;
      biographyContent.categoryBusyIndicator.isActive = true;
      biographyContent.addRequested = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "biographyCategory/edit", biographyContent.selectedItem, "PUT")
        .success(function (response) {
          //biographyContent.showbusy = false;
          biographyContent.treeConfig.showbusy = false;
          biographyContent.addRequested = false;
          rashaErManage.checkAction(response);
          if (response.IsSuccess) {
            biographyContent.treeConfig.currentNode.Title = response.Item.Title;
            biographyContent.closeModal();
          }
          biographyContent.categoryBusyIndicator.isActive = false;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          biographyContent.addRequested = false;
          biographyContent.categoryBusyIndicator.isActive = false;
        });
    };

    // Delete a Category
    biographyContent.deleteCategory = function () {
      if (buttonIsPressed) {
        return;
      }
      var node = biographyContent.treeConfig.currentNode;
      if (node.Id == 0 || !node.Id) {
        rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
        return;
      }
      rashaErManage.showYesNo(
        ($filter('translatentk')('warning')),
        ($filter('translatentk')('do_you_want_to_delete_this_attribute')),
        function (isConfirmed) {
          if (isConfirmed) {
            biographyContent.categoryBusyIndicator.isActive = true;
            buttonIsPressed = true;
            ajax
              .call(cmsServerConfig.configApiServerPath + "biographyCategory/GetOne", node.Id, "GET")
              .success(function (response) {
                buttonIsPressed = false;
                rashaErManage.checkAction(response);
                biographyContent.selectedItemForDelete = response.Item;
                ajax
                  .call(
                    cmsServerConfig.configApiServerPath + "biographyCategory/delete",
                    biographyContent.selectedItemForDelete,
                    "POST"
                  )
                  .success(function (res) {
                    biographyContent.categoryBusyIndicator.isActive = false;
                    if (res.IsSuccess) {
                      biographyContent.gridOptions.advancedSearchData.engine.Filters = null;
                      biographyContent.gridOptions.advancedSearchData.engine.Filters = [];
                      biographyContent.gridOptions.fillData();
                      biographyContent.gridOptions.reGetAll();
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
                    biographyContent.categoryBusyIndicator.isActive = false;
                  });
              })
              .error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                biographyContent.categoryBusyIndicator.isActive = false;
              });
          }
        }
      );
    };

    //Tree On Node Select Options
    biographyContent.treeConfig.onNodeSelect = function () {
      var node = biographyContent.treeConfig.currentNode;
      biographyContent.showGridComment = false;
      biographyContent.selectContent(node);
    };
    //Show Content with Category Id
    biographyContent.selectContent = function (node) {
      biographyContent.gridOptions.advancedSearchData.engine.Filters = null;
      biographyContent.gridOptions.advancedSearchData.engine.Filters = [];
      if (node != null && node != undefined) {
        biographyContent.contentBusyIndicator.message =
          "در حال بارگذاری مقاله های  دسته " + node.Title;
        biographyContent.contentBusyIndicator.isActive = true;
        //biographyContent.gridOptions.advancedSearchData = {};
        biographyContent.attachedFiles = [];
        var s = {
          PropertyName: "LinkCategoryId",
          IntValue1: node.Id,
          SearchType: 0
        };
        biographyContent.gridOptions.advancedSearchData.engine.Filters.push(s);
      }
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "biographyContent/getall",
          biographyContent.gridOptions.advancedSearchData.engine,
          "POST"
        )
        .success(function (response) {
          rashaErManage.checkAction(response);
          biographyContent.contentBusyIndicator.isActive = false;
          biographyContent.ListItems = response.ListItems;
          biographyContent.gridOptions.fillData(
            biographyContent.ListItems,
            response.resultAccess
          ); // Sending Access as an argument
          biographyContent.gridOptions.currentPageNumber =
            response.CurrentPageNumber;
          biographyContent.gridOptions.totalRowCount = response.TotalRowCount;
          biographyContent.gridOptions.rowPerPage = response.RowPerPage;
        })
        .error(function (data, errCode, c, d) {
          biographyContent.contentBusyIndicator.isActive = false;
          biographyContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Modal
    biographyContent.openAddModel = function () {
      biographyContent.selectedItemModuleRelationShip = [];
      biographyContent.ModuleRelationShip = [];
      if (buttonIsPressed) {
        return;
      }
      var node = biographyContent.treeConfig.currentNode;
      if (node.Id == 0 || !node.Id) {
        rashaErManage.showMessage($filter('translatentk')('to_add_a_biography_please_select_the_category'));
        buttonIsPressed = false;
        return;
      }
      biographyContent.selectedItemOtherInfos = {};
      biographyContent.attachedFiles = [];
      biographyContent.Similars = [];
      biographyContent.SimilarsDb = [];
      biographyContent.OtherInfos = [];
      biographyContent.OtherInfosDb = [];
      biographyContent.ModuleRelationShip = [];
      biographyContent.ModuleRelationShipDb = [];

      biographyContent.filePickerMainImage.filename = "";
      biographyContent.filePickerMainImage.fileId = null;
      biographyContent.filePickerFilePodcast.filename = "";
      biographyContent.filePickerFilePodcast.fileId = null;
      biographyContent.filePickerFileMovie.filename = "";
      biographyContent.filePickerFileMovie.fileId = null;
      biographyContent.filePickerFiles.filename = "";
      biographyContent.filePickerFiles.fileId = null;
      biographyContent.tags = []; //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
      biographyContent.kwords = []; //tagsInput خالی کردن آرایه کلمات کلیدی برای محتوای جدید
      biographyContent.addRequested = false;
      //biographyContent.modalTitle = ($filter('translatentk')('Add_Content'));
      buttonIsPressed = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "biographyContent/GetViewModel", "", "GET")
        .success(function (response) {
          buttonIsPressed = false;
          rashaErManage.checkAction(response);

          biographyContent.selectedItem = response.Item;
          biographyContent.OtherInfos = [];

          biographyContent.selectedItem.LinkCategoryId = node.Id;
          biographyContent.selectedItem.LinkFileIds = null;

          $modal.open({
            templateUrl: "cpanelv1/Modulebiography/biographyContent/add.html",
            scope: $scope
          });
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };


    biographyContent.SimilarsSelectedItem = {};
    biographyContent.moveSelected = function (from, to, calculatePrice) {
      if (from == "Content") {
        if (
          biographyContent.selectedItem.Id != undefined &&
          biographyContent.selectedItem.Id != null
        ) {
          if (biographyContent.Similars == undefined)
            biographyContent.Similars = [];

          for (var i = 0; i < biographyContent.Similars.length; i++) {
            if (biographyContent.Similars[i].Id == biographyContent.SimilarsSelector.selectedItem.Id) {
              rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
              return;
            }
          }
          biographyContent.Similars.push(biographyContent.SimilarsSelector.selectedItem);
        }
      }
    };

    biographyContent.moveSelectedOtherInfo = function (from, to, y) {
      if (biographyContent.OtherInfos == undefined)
        biographyContent.OtherInfos = [];
      for (var i = 0; i < biographyContent.OtherInfos.length; i++) {

        if (biographyContent.OtherInfos[i].Title == biographyContent.selectedItemOtherInfos.Title && biographyContent.OtherInfos[i].HtmlBody == biographyContent.selectedItemOtherInfos.HtmlBody && biographyContent.OtherInfos[i].Source == biographyContent.selectedItemOtherInfos.Source) {
          rashaErManage.showMessage($filter('translatentk')('Information_Is_Duplicate'));
          return;
        }
      }
      if (biographyContent.selectedItemOtherInfos.Title == "" && biographyContent.selectedItemOtherInfos.Source == "" && biographyContent.selectedItemOtherInfos.HtmlBody == "") {
        rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
      } else if (biographyContent.selectedItemOtherInfos.TypeId == "" || !Number.isInteger(biographyContent.selectedItemOtherInfos.TypeId)) {
        rashaErManage.showMessage($filter('translatentk')('در فیلد نوع مقدار عددی وارد کنید'));
      } else {

        biographyContent.OtherInfos.push({
          Title: biographyContent.selectedItemOtherInfos.Title,
          HtmlBody: biographyContent.selectedItemOtherInfos.HtmlBody,
          Source: biographyContent.selectedItemOtherInfos.Source
        });
        biographyContent.selectedItemOtherInfos.Title = "";
        biographyContent.selectedItemOtherInfos.Source = "";
        biographyContent.selectedItemOtherInfos.HtmlBody = "";
      }
      if (edititem) {
        edititem = false;
      }

    };
    //#help otherInfo
    biographyContent.selectedItemOtherInfos = {};
    biographyContent.todoModeTitle = $filter('translatentk')('ADD_NOW');
    biographyContent.saveOtherInfos = function () {

      if (biographyContent.editMode) {
        if (biographyContent.selectedItemOtherInfos.Title == "" ||
          biographyContent.selectedItemOtherInfos.Title == undefined ||
          biographyContent.selectedItemOtherInfos.HtmlBody == "" ||
          biographyContent.selectedItemOtherInfos.HtmlBody == undefined) {
          rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
          return;
        }
        biographyContent.selectedItemOtherInfos.Edited = true;
        $scope.currentItem = biographyContent.selectedItemOtherInfos;
        biographyContent.OtherInfos[$scope.currentItemIndex] = biographyContent.selectedItemOtherInfos;
        biographyContent.editMode = false;


      } else { //add New
        if (biographyContent.selectedItemOtherInfos.Title == "" ||
          biographyContent.selectedItemOtherInfos.Title == undefined ||
          biographyContent.selectedItemOtherInfos.HtmlBody == "" ||
          biographyContent.selectedItemOtherInfos.HtmlBody == undefined) {
          rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
          return;
        }
        biographyContent.selectedItemOtherInfos.LinkContentId = biographyContent.gridOptions.selectedRow.item.Id;
        biographyContent.OtherInfos.push(biographyContent.selectedItemOtherInfos);
        biographyContent.selectedItemOtherInfos = {};
        // ajax.call(cmsServerConfig.configApiServerPath + 'biographyContentOtherInfo/add', biographyContent.selectedItemOtherInfos, 'POST').success(function (response) {
        //   rashaErManage.checkAction(response);
        //   if (response.IsSuccess) {
        //     biographyContent.selectedItemOtherInfos = response.Item;
        //     mainLIst.push(biographyContent.selectedItemOtherInfos);
        //     biographyContent.selectedItemOtherInfos = {};
        //   }
        // }).error(function (data, errCode, c, d) {
        //   rashaErManage.checkAction(data, errCode);
        // });

      }
      biographyContent.selectedItemOtherInfos = {};
      biographyContent.todoModeTitle = $filter('translatentk')('add_now');
    };




    //#help
    // Open Edit Content Modal
    biographyContent.openEditModel = function () {
      biographyContent.attachedFiles = [];
      biographyContent.Similars = [];
      biographyContent.SimilarsDb = [];
      biographyContent.OtherInfos = [];
      biographyContent.ModuleRelationShip = [];
      biographyContent.selectedItemModuleRelationShip = [];
      biographyContent.ModuleRelationShipDb = [];
      biographyContent.tags = []; //Clear out previous tags
      biographyContent.selectedItemRelationship = [];
      if (buttonIsPressed) {
        return;
      }

      biographyContent.showComment(biographyContent.gridOptions.selectedRow.item.Id)
      biographyContent.addRequested = false;
      //biographyContent.modalTitle = ($filter('translatentk')('Edit_Content'));
      if (!biographyContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
        return;
      }
      if (biographyContent.gridOptions.selectedRow.item.LinkSiteId != $rootScope.tokenInfo.Item.SiteId && !$rootScope.tokenInfo.Item.UserAccessAdminAllowToAllData) {
        rashaErManage.showMessage($filter('translatentk')('This_Biography_Is_Shared'));
        return;
      }
      biographyContent.selectedItemOtherInfos = {};
      buttonIsPressed = true;
      ajax.call(cmsServerConfig.configApiServerPath + "biographyContent/GetOne", biographyContent.gridOptions.selectedRow.item.Id, "GET")
        .success(function (response1) {
          buttonIsPressed = false;
          rashaErManage.checkAction(response1);
          biographyContent.selectedItem = response1.Item;


          // biographyContent.FromDate.defaultDate = biographyContent.selectedItem.FromDate;
          // biographyContent.ExpireDate.defaultDate = biographyContent.selectedItem.ExpireDate;

          biographyContent.selectedItem.DatePeriodStart = response1.Item.DatePeriodStart;
          // biographyContent.DatePeriodStart.defaultDate = biographyContent.selectedItem.DatePeriodStart;

          biographyContent.selectedItem.DatePeriodEnd = response1.Item.DatePeriodEnd;
          // biographyContent.DatePeriodEnd.defaultDate = biographyContent.selectedItem.DatePeriodEnd;

          biographyContent.filePickerMainImage.filename = null;
          biographyContent.filePickerMainImage.fileId = null;
          biographyContent.filePickerFilePodcast.filename = null;
          biographyContent.filePickerFilePodcast.fileId = null;
          biographyContent.filePickerFileMovie.filename = null;
          biographyContent.filePickerFileMovie.fileId = null;
          //BiographyContentOtherInfo
          var engineOtherInfo = {};
          var filterValue = {
            PropertyName: "LinkContentId",
            IntValue1: biographyContent.gridOptions.selectedRow.item.Id,
            SearchType: 0
          }
          engineOtherInfo.Filters = null;
          engineOtherInfo.Filters = [];
          engineOtherInfo.Filters.push(filterValue);
          ajax.call(cmsServerConfig.configApiServerPath + "BiographyContentOtherInfo/GetAll", engineOtherInfo, "POST")
            .success(function (responseOtherInfos) {
              biographyContent.OtherInfosDb = responseOtherInfos.ListItems;
              biographyContent.OtherInfos = angular.extend(biographyContent.OtherInfos, responseOtherInfos.ListItems);
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });

          ajax.call(cmsServerConfig.configApiServerPath + "BiographyContentTag/GetAll", engineOtherInfo, "POST")
            .success(function (responsetag) {
              biographyContent.selectedItem.ContentTags = responsetag.ListItems;

              //Load tagsInput
              if (biographyContent.selectedItem.ContentTags == null)
                biographyContent.selectedItem.ContentTags = [];
              $.each(biographyContent.selectedItem.ContentTags, function (index, item) {
                if (item.virtual_ModuleTag != null)
                  biographyContent.tags.push({
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
          ajax.call(cmsServerConfig.configApiServerPath + "BiographyContent/GetAllWithSimilarsId/" + biographyContent.gridOptions.selectedRow.item.Id, engineSimilars, "POST")
            .success(function (responseSimilars) {
              biographyContent.SimilarsDb = responseSimilars.ListItems;
              biographyContent.Similars = angular.extend(biographyContent.Similars, responseSimilars.ListItems);
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          var RelationshipModel = {
            Id: biographyContent.gridOptions.selectedRow.item.Id,
            enumValue: ModuleRelationShipModuleNameMain
          };
          ajax.call(cmsServerConfig.configApiServerPath + 'ModulesRelationshipContent/GetAllByContentId', RelationshipModel, 'POST')
            .success(function (responseModuleRelationShip) {
              biographyContent.ModuleRelationShipDb = responseModuleRelationShip.ListItems;
              biographyContent.ModuleRelationShip = angular.extend(biographyContent.ModuleRelationShip, responseModuleRelationShip.ListItems);
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          //BiographyContentOtherInfo
          if (response1.Item.LinkMainImageId != null) {
            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", response1.Item.LinkMainImageId, "GET")
              .success(function (response2) {
                buttonIsPressed = false;
                biographyContent.filePickerMainImage.filename =
                  response2.Item.FileName;
                biographyContent.filePickerMainImage.fileId = response2.Item.Id;
              })
              .error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
              });
          }
          if (response1.Item.LinkFilePodcastId != null) {
            ajax.call(cmsServerConfig.configApiServerPath + 'FileContent/GetOne', response1.Item.LinkFilePodcastId, 'GET').success(function (response2) {
              biographyContent.filePickerFilePodcast.filename = response2.Item.FileName;
              biographyContent.filePickerFilePodcast.fileId = response2.Item.Id
            }).error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          }
          if (response1.Item.LinkFileMovieId != null) {
            ajax.call(cmsServerConfig.configApiServerPath + 'FileContent/GetOne', response1.Item.LinkFileMovieId, 'GET').success(function (response2) {
              biographyContent.filePickerFileMovie.filename = response2.Item.FileName;
              biographyContent.filePickerFileMovie.fileId = response2.Item.Id
            }).error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          }

          //link to other module
          biographyContent.parseFileIds(response1.Item.LinkFileIds);
          biographyContent.filePickerFiles.filename = null;
          biographyContent.filePickerFiles.fileId = null;

          //Load Keywords tagsInput
          biographyContent.kwords = []; //Clear out previous tags
          var arraykwords = [];
          if (
            biographyContent.selectedItem.Keyword != null &&
            biographyContent.selectedItem.Keyword != ""
          )
            arraykwords = biographyContent.selectedItem.Keyword.split(",");
          $.each(arraykwords, function (index, item) {
            if (item != null) biographyContent.kwords.push({
              text: item
            }); //Add current content's tag to tags array with id and title
          });
          $modal.open({
            templateUrl: "cpanelv1/Modulebiography/biographyContent/edit.html",
            scope: $scope
          });
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };



    // Add New Content
    biographyContent.addNewContent = function (frm) {
      if (frm.$invalid) return;
      biographyContent.categoryBusyIndicator.isActive = true;
      biographyContent.addRequested = true;

      //Save attached file ids into biographyContent.selectedItem.LinkFileIds
      biographyContent.selectedItem.LinkFileIds = "";
      biographyContent.stringfyLinkFileIds();
      //Save Keywords
      $.each(biographyContent.kwords, function (index, item) {
        if (index == 0) biographyContent.selectedItem.Keyword = item.text;
        else biographyContent.selectedItem.Keyword += "," + item.text;
      });
      if (
        biographyContent.selectedItem.LinkCategoryId == null ||
        biographyContent.selectedItem.LinkCategoryId == 0
      ) {
        rashaErManage.showMessage($filter('translatentk')('to_add_a_biography_please_select_the_category'));
        return;
      }
      var apiSelectedItem = biographyContent.selectedItem;

      ajax.call(cmsServerConfig.configApiServerPath + "biographyContent/add", apiSelectedItem, "POST").success(function (response) {
          rashaErManage.checkAction(response);
          biographyContent.categoryBusyIndicator.isActive = false;
          if (response.IsSuccess) {
            biographyContent.selectedItem.LinkSourceId = biographyContent.selectedItem.Id;

            biographyContent.ListItems.unshift(response.Item);
            biographyContent.gridOptions.fillData(biographyContent.ListItems);
            biographyContent.closeModal();
            //Save inputTags

            $.each(biographyContent.tags, function (index, item) {
              if (item.id > 0) {
                item.LinkTagId = item.id;
                item.LinkContentId = response.Item.Id;
              }
            });
            ajax.call(cmsServerConfig.configApiServerPath + "biographyContentTag/addbatch", biographyContent.tags, "POST").success(function (response) {
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
          biographyContent.addRequested = false;
          biographyContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Edit Content
    biographyContent.editContent = function (frm) {
      if (frm.$invalid) return;
      biographyContent.categoryBusyIndicator.isActive = true;
      biographyContent.addRequested = true;
      //Save attached file ids into biographyContent.selectedItem.LinkFileIds
      biographyContent.selectedItem.LinkFileIds = "";
      biographyContent.stringfyLinkFileIds();
      //Save Keywords
      $.each(biographyContent.kwords, function (index, item) {
        if (index == 0) biographyContent.selectedItem.Keyword = item.text;
        else biographyContent.selectedItem.Keyword += "," + item.text;
      });




      //Save inputTags
      $.each(biographyContent.tags, function (index, item) {
        if (item.id > 0) {
          item.LinkTagId = item.id;
          item.LinkContentId = biographyContent.selectedItem.Id;
        }
      });
      biographyContent.ContentTagsRemoved = differenceInFirstArray(biographyContent.selectedItem.ContentTags, biographyContent.tags, 'LinkTagId');
      biographyContent.ContentTagsAdded = differenceInFirstArray(biographyContent.tags, biographyContent.selectedItem.ContentTags, 'LinkTagId');
      //remove
      if (biographyContent.ContentTagsRemoved && biographyContent.ContentTagsRemoved.length > 0) {
        ajax.call(cmsServerConfig.configApiServerPath + "biographyContentTag/DeleteList", biographyContent.ContentTagsRemoved, "Delete").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //Add
      if (biographyContent.ContentTagsAdded && biographyContent.ContentTagsAdded.length > 0) {
        ajax.call(cmsServerConfig.configApiServerPath + "biographyContentTag/addbatch", biographyContent.ContentTagsAdded, "POST").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      ///Save inputTags
      ///Save OtherInfos
      biographyContent.ContentOtherInfosRemoved = differenceInFirstArray(biographyContent.OtherInfosDb, biographyContent.OtherInfos, 'Id');
      biographyContent.ContentOtherInfosAdded = differenceInFirstArray(biographyContent.OtherInfos, biographyContent.OtherInfosDb, 'Id');
      biographyContent.ContentOtherInfosEdit = [];
      $.each(biographyContent.OtherInfos, function (index, item) {
        if (item.Edited && item.Id && item.Id > 0)
          biographyContent.ContentOtherInfosEdit.push(item);
      });

      //remove
      if (biographyContent.ContentOtherInfosRemoved && biographyContent.ContentOtherInfosRemoved.length > 0) {
        var OtherInfosRemovedModel = [];
        $.each(biographyContent.ContentOtherInfosRemoved, function (index, item) {
          OtherInfosRemovedModel.push(item);
        });
        ajax.call(cmsServerConfig.configApiServerPath + "biographyContentOtherInfo/DeleteList", OtherInfosRemovedModel, "Delete").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //Add
      if (biographyContent.ContentOtherInfosAdded && biographyContent.ContentOtherInfosAdded.length > 0) {
        var OtherInfosAddModel = [];
        $.each(biographyContent.ContentOtherInfosAdded, function (index, item) {
          OtherInfosAddModel.push(item);
        });
        ajax.call(cmsServerConfig.configApiServerPath + "biographyContentOtherInfo/addbatch", OtherInfosAddModel, "POST").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //edit
      if (biographyContent.ContentOtherInfosEdit && biographyContent.ContentOtherInfosEdit.length > 0) {
        ajax.call(cmsServerConfig.configApiServerPath + "biographyContentOtherInfo/editbatch", biographyContent.ContentOtherInfosEdit, "PUT").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //edit
      ///Save OtherInfos
      ///Save Similars
      biographyContent.ContentSimilarsRemoved = differenceInFirstArray(biographyContent.SimilarsDb, biographyContent.Similars, 'Id');
      biographyContent.ContentSimilarsAdded = differenceInFirstArray(biographyContent.Similars, biographyContent.SimilarsDb, 'Id');
      //remove
      if (biographyContent.ContentSimilarsRemoved && biographyContent.ContentSimilarsRemoved.length > 0) {
        var SimilarsRemovedModel = [];
        $.each(biographyContent.ContentSimilarsRemoved, function (index, item) {
          SimilarsRemovedModel.push({
            LinkSourceId: biographyContent.selectedItem.Id,
            LinkDestinationId: item.Id
          });
        });
        ajax.call(cmsServerConfig.configApiServerPath + "biographyContentSimilar/DeleteList", SimilarsRemovedModel, "Delete").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //Add
      if (biographyContent.ContentSimilarsAdded && biographyContent.ContentSimilarsAdded.length > 0) {
        var SimilarsAddModel = [];
        $.each(biographyContent.ContentSimilarsAdded, function (index, item) {
          SimilarsAddModel.push({
            LinkSourceId: biographyContent.selectedItem.Id,
            LinkDestinationId: item.Id
          });
        });
        ajax.call(cmsServerConfig.configApiServerPath + "biographyContentSimilar/addbatch", SimilarsAddModel, "POST").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      ///Save Similars

      ///Save ModulesRelationship
      biographyContent.ContentModuleRelationShipRemoved = differenceInFirstArray(biographyContent.ModuleRelationShipDb, biographyContent.ModuleRelationShip, '');
      biographyContent.ContentModuleRelationShipAdded = differenceInFirstArray(biographyContent.ModuleRelationShip, biographyContent.ModuleRelationShipDb, '');
      //remove
      if (biographyContent.ContentModuleRelationShipRemoved && biographyContent.ContentModuleRelationShipRemoved.length > 0) {

        ajax.call(cmsServerConfig.configApiServerPath + "ModulesRelationshipContent/DeleteList", biographyContent.ContentModuleRelationShipRemoved, "Delete").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //Add
      if (biographyContent.ContentModuleRelationShipAdded && biographyContent.ContentModuleRelationShipAdded.length > 0) {

        ajax.call(cmsServerConfig.configApiServerPath + "ModulesRelationshipContent/addbatch", biographyContent.ContentModuleRelationShipAdded, "POST").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      ///Save ModulesRelationship
      if (
        biographyContent.selectedItem.LinkCategoryId == null ||
        biographyContent.selectedItem.LinkCategoryId == 0
      ) {
        rashaErManage.showMessage($filter('translatentk')('to_add_a_biography_please_select_the_category'));
        return;
      }
      var apiSelectedItem = {};
      apiSelectedItem = angular.extend(apiSelectedItem, biographyContent.selectedItem);
      apiSelectedItem.OtherInfos = [];
      ajax
        .call(cmsServerConfig.configApiServerPath + "biographyContent/edit", apiSelectedItem, "PUT")
        .success(function (response) {
          biographyContent.categoryBusyIndicator.isActive = false;
          biographyContent.addRequested = false;
          biographyContent.treeConfig.showbusy = false;
          biographyContent.showIsBusy = false;
          rashaErManage.checkAction(response);
          if (response.IsSuccess) {
            biographyContent.replaceItem(biographyContent.selectedItem.Id, response.Item);
            biographyContent.gridOptions.fillData(biographyContent.ListItems);
            biographyContent.closeModal();
          }
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          biographyContent.addRequested = false;
          biographyContent.categoryBusyIndicator.isActive = false;
        });


    };








    // Delete a biography Content
    biographyContent.deleteContent = function () {
      if (buttonIsPressed) {
        return;
      }
      if (!biographyContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
        //rashaErManage.showMessage($filter('translatentk')('Tag'));
        return;
      }
      biographyContent.treeConfig.showbusy = true;
      biographyContent.showIsBusy = true;
      rashaErManage.showYesNo(
        ($filter('translatentk')('warning')),
        ($filter('translatentk')('do_you_want_to_delete_this_attribute')),
        function (isConfirmed) {
          if (isConfirmed) {
            biographyContent.categoryBusyIndicator.isActive = true;
            biographyContent.showbusy = true;
            biographyContent.showIsBusy = true;
            buttonIsPressed = true;
            ajax
              .call(
                cmsServerConfig.configApiServerPath + "biographyContent/GetOne",
                biographyContent.gridOptions.selectedRow.item.Id,
                "GET"
              )
              .success(function (response) {
                buttonIsPressed = false;
                biographyContent.showbusy = false;
                biographyContent.showIsBusy = false;
                rashaErManage.checkAction(response);
                biographyContent.selectedItemForDelete = response.Item;
                ajax
                  .call(
                    cmsServerConfig.configApiServerPath + "biographyContent/delete",
                    biographyContent.selectedItemForDelete,
                    "POST"
                  )
                  .success(function (res) {
                    biographyContent.categoryBusyIndicator.isActive = false;
                    biographyContent.treeConfig.showbusy = false;
                    biographyContent.showIsBusy = false;
                    rashaErManage.checkAction(res);
                    if (res.IsSuccess) {
                      biographyContent.replaceItem(
                        biographyContent.selectedItemForDelete.Id
                      );
                      biographyContent.gridOptions.fillData(biographyContent.ListItems);
                    }
                  })
                  .error(function (data2, errCode2, c2, d2) {
                    rashaErManage.checkAction(data2);
                    biographyContent.treeConfig.showbusy = false;
                    biographyContent.showIsBusy = false;
                    biographyContent.categoryBusyIndicator.isActive = false;
                  });
              })
              .error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                biographyContent.treeConfig.showbusy = false;
                biographyContent.showIsBusy = false;
                biographyContent.categoryBusyIndicator.isActive = false;
              });
          }
        }
      );
    };

    //Confirm/UnConfirm biography Content
    biographyContent.confirmUnConfirmbiographyContent = function () {
      if (!biographyContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
        return;
      }
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "biographyContent/GetOne",
          biographyContent.gridOptions.selectedRow.item.Id,
          "GET"
        )
        .success(function (response) {
          rashaErManage.checkAction(response);
          biographyContent.selectedItem = response.Item;
          biographyContent.selectedItem.IsAccepted = response.Item.IsAccepted == true ?
            false :
            true;
          ajax
            .call(cmsServerConfig.configApiServerPath + "biographyContent/edit", biographyContent.selectedItem, "PUT")
            .success(function (response2) {
              rashaErManage.checkAction(response2);
              if (response2.IsSuccess) {
                var index = biographyContent.ListItems.indexOf(
                  biographyContent.gridOptions.selectedRow.item
                );
                if (index !== -1) {
                  biographyContent.ListItems[index] = response2.Item;
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
    biographyContent.enableArchive = function () {
      if (!biographyContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
        return;
      }

      ajax
        .call(
          cmsServerConfig.configApiServerPath + "biographyContent/GetOne",
          biographyContent.gridOptions.selectedRow.item.Id,
          "GET"
        )
        .success(function (response) {
          rashaErManage.checkAction(response);
          biographyContent.selectedItem = response.Item;
          biographyContent.selectedItem.IsArchive = response.Item.IsArchive == true ?
            false :
            true;
          ajax
            .call(cmsServerConfig.configApiServerPath + "biographyContent/edit", biographyContent.selectedItem, "PUT")
            .success(function (response2) {
              biographyContent.categoryBusyIndicator.isActive = true;
              rashaErManage.checkAction(response2);
              if (response2.IsSuccess) {
                var index = biographyContent.ListItems.indexOf(
                  biographyContent.gridOptions.selectedRow.item
                );
                if (index !== -1) {
                  biographyContent.ListItems[index] = response2.Item;
                }
                biographyContent.categoryBusyIndicator.isActive = false;
              }
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
              biographyContent.categoryBusyIndicator.isActive = false;
            });
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          biographyContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Replace Item OnDelete/OnEdit Grid Options
    biographyContent.replaceItem = function (oldId, newItem) {
      angular.forEach(biographyContent.ListItems, function (item, key) {
        if (item.Id == oldId) {
          var index = biographyContent.ListItems.indexOf(item);
          biographyContent.ListItems.splice(index, 1);
        }
      });
      if (newItem) biographyContent.ListItems.unshift(newItem);
    };

    biographyContent.summernoteOptions = {
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

    //biographyContent.summernoteText = '<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />';

    biographyContent.searchData = function () {
      biographyContent.categoryBusyIndicator.isActive = true;
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "biographyContent/getall",
          biographyContent.gridOptions.advancedSearchData.engine,
          "POST"
        )
        .success(function (response) {
          rashaErManage.checkAction(response);
          biographyContent.categoryBusyIndicator.isActive = false;
          biographyContent.ListItems = response.ListItems;
          biographyContent.gridOptions.fillData(biographyContent.ListItems);
          biographyContent.gridOptions.currentPageNumber =
            response.CurrentPageNumber;
          biographyContent.gridOptions.totalRowCount = response.TotalRowCount;
          biographyContent.gridOptions.rowPerPage = response.RowPerPage;
          biographyContent.allowedSearch = response.AllowedSearchField;
        })
        .error(function (data, errCode, c, d) {
          biographyContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
        });
    };

    //Close Model Stack
    biographyContent.addRequested = false;
    biographyContent.closeModal = function () {
      $modalStack.dismissAll();
    };

    biographyContent.showIsBusy = false;

    //Aprove a comment
    biographyContent.confirmComment = function (item) {
      if (item.Id && item.Id > 0) {
        item.RecordStatus = 1;
        var itemCopy = angular.copy(item);
        itemCopy.rowOption = null;
        ajax.call(cmsServerConfig.configApiServerPath + 'BiographyComment/edit', itemCopy, 'PUT').success(function (response) {
          rashaErManage.checkAction(response);
          if(response.IsSuccess)
          biographyContent.showComment(biographyContent.gridOptions.selectedRow.item.Id)
        }).error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
      }
    };

    //Decline a comment
    biographyContent.doNotConfirmComment = function (item) {
      if (item.Id && item.Id > 0) {
        item.RecordStatus = 5;//DeniedConfirmed
        var itemCopy = angular.copy(item);
        itemCopy.rowOption = null;
        ajax.call(cmsServerConfig.configApiServerPath + 'BiographyComment/edit', itemCopy, 'PUT').success(function (response) {
          if(response.IsSuccess)
          biographyContent.showComment(biographyContent.gridOptions.selectedRow.item.Id)
          rashaErManage.checkAction(response);
        }).error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
      }
    };
    //Remove a comment
    biographyContent.deleteComment = function (item) {
      if (!item) {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
        return;
      }
      biographyContent.treeConfig.showbusy = true;
      biographyContent.showIsBusy = true;
      rashaErManage.showYesNo(
        ($filter('translatentk')('warning')),
        "آیا می خواهید این نظر را حذف کنید",
        function (isConfirmed) {
          if (isConfirmed) {

            biographyContent.treeConfig.showbusy = true;
            biographyContent.showbusy = true;
            biographyContent.showIsBusy = true;

            var itemCopy = angular.copy(item);
            itemCopy.rowOption = null;
            ajax.call(cmsServerConfig.configApiServerPath + "biographyComment/delete", itemCopy, "POST")
              .success(function (res) {
                biographyContent.treeConfig.showbusy = false;
                biographyContent.showbusy = false;
                biographyContent.showIsBusy = false;
                rashaErManage.checkAction(res);
                if (res.IsSuccess) {
                  biographyContent.showComment(biographyContent.gridOptions.selectedRow.item.Id)
                  
                }
              })
              .error(function (data2, errCode2, c2, d2) {
                rashaErManage.checkAction(data2);
                biographyContent.treeConfig.showbusy = false;
                biographyContent.showbusy = false;
                biographyContent.showIsBusy = false;
              });

          }
        }
      );
    };

    //For reInit Categories
    biographyContent.gridOptions.reGetAll = function () {
      if (biographyContent.gridOptions.advancedSearchData.engine.Filters.length > 0)
        biographyContent.searchData();
      else biographyContent.init();
    };

    biographyContent.isCurrentNodeEmpty = function () {
      return !angular.equals({}, biographyContent.treeConfig.currentNode);
    };

    biographyContent.loadFileAndFolder = function (item) {
      biographyContent.treeConfig.currentNode = item;
      biographyContent.treeConfig.onNodeSelect(item);
    };

    biographyContent.openDate = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $timeout(function () {
        biographyContent.focus = true;
      });
    };
    biographyContent.openDate1 = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $timeout(function () {
        biographyContent.focus1 = true;
      });
    };

    biographyContent.columnCheckbox = false;
    biographyContent.openGridConfigModal = function () {
      $("#gridView-btn").toggleClass("active");
      var prechangeColumns = biographyContent.gridOptions.columns;
      if (biographyContent.gridOptions.columnCheckbox) {
        for (var i = 0; i < biographyContent.gridOptions.columns.length; i++) {
          //biographyContent.gridOptions.columns[i].visible = $("#" + biographyContent.gridOptions.columns[i].Id + "Checkbox").is(":checked");
          var element = $(
            "#" +
            biographyContent.gridOptions.columns[i].name.replace(".", "") +
            "Checkbox"
          );
          var temp = element[0].checked;
          biographyContent.gridOptions.columns[i].visible = temp;
        }
      } else {
        for (var i = 0; i < biographyContent.gridOptions.columns.length; i++) {
          var element = $(
            "#" +
            biographyContent.gridOptions.columns[i].name.replace(".", "") +
            "Checkbox"
          );
          $(
              "#" + biographyContent.gridOptions.columns[i].name + "Checkbox"
            ).checked =
            prechangeColumns[i].visible;
        }
      }
      for (var i = 0; i < biographyContent.gridOptions.columns.length; i++) {

      }
      biographyContent.gridOptions.columnCheckbox = !biographyContent.gridOptions
        .columnCheckbox;
    };

    biographyContent.deleteAttachedFile = function (index) {
      biographyContent.attachedFiles.splice(index, 1);
    };

    biographyContent.addAttachedFile = function (id) {
      var fname = $("#file" + id).text();
      if (
        id != null &&
        id != undefined &&
        !biographyContent.alreadyExist(id, biographyContent.attachedFiles) &&
        fname != null &&
        fname != ""
      ) {
        var fId = id;
        var file = {
          id: fId,
          name: fname
        };
        biographyContent.attachedFiles.push(file);
        if (document.getElementsByName("file" + id).length > 1)
          document.getElementsByName("file" + id)[1].textContent = "";
        else document.getElementsByName("file" + id)[0].textContent = "";
      }
    };

    biographyContent.alreadyExist = function (id, array) {
      for (var i = 0; i < array.length; i++) {
        if (id == array[i].fileId) {
          rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
          return true;
        }
      }
      return false;
    };

    biographyContent.filePickerMainImage.removeSelectedfile = function (config) {
      biographyContent.filePickerMainImage.fileId = null;
      biographyContent.filePickerMainImage.filename = null;
      biographyContent.selectedItem.LinkMainImageId = null;
    };
    biographyContent.filePickerFilePodcast.removeSelectedfile = function (config) {
      biographyContent.filePickerFilePodcast.fileId = null;
      biographyContent.filePickerFilePodcast.filename = null;
      biographyContent.selectedItem.LinkFilePodcastId = null;

    }
    biographyContent.filePickerFileMovie.removeSelectedfile = function (config) {
      biographyContent.filePickerFileMovie.fileId = null;
      biographyContent.filePickerFileMovie.filename = null;
      biographyContent.selectedItem.LinkFileMovieId = null;

    }
    biographyContent.filePickerFiles.removeSelectedfile = function (config) {
      biographyContent.filePickerFiles.fileId = null;
      biographyContent.filePickerFiles.filename = null;
    };

    biographyContent.showUpload = function () {
      $("#fastUpload").fadeToggle();
    };

    // ----------- FilePicker Codes --------------------------------
    biographyContent.addAttachedFile = function (id) {
      var fname = $("#file" + id).text();
      if (fname == "") {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
        return;
      }
      if (
        id != null &&
        id != undefined &&
        !biographyContent.alreadyExist(id, biographyContent.attachedFiles)
      ) {
        var fId = id;
        var file = {
          fileId: fId,
          filename: fname,
          previewImageSrc: cmsServerConfig.configPathFileByIdAndName + fId + "/" + fname
        };
        biographyContent.attachedFiles.push(file);
        biographyContent.clearfilePickers();
      }
    };

    biographyContent.alreadyExist = function (fieldId, array) {
      for (var i = 0; i < array.length; i++) {
        if (fieldId == array[i].fileId) {
          rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
          biographyContent.clearfilePickers();
          return true;
        }
      }
      return false;
    };

    biographyContent.deleteAttachedfieldName = function (index) {
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "biographyContent/delete",
          biographyContent.contractsList[index],
          "POST"
        )
        .success(function (res) {
          rashaErManage.checkAction(res);
          if (res.IsSuccess) {
            biographyContent.contractsList.splice(index, 1);
            rashaErManage.showMessage($filter('translatentk')('Removed_Successfully'));
          }
        })
        .error(function (data2, errCode2, c2, d2) {
          rashaErManage.checkAction(data2);
        });
    };

    biographyContent.parseFileIds = function (stringOfIds) {
      if (stringOfIds == null || !stringOfIds.trim()) return;
      var fileIds = stringOfIds.split(",");
      if (fileIds.length != undefined) {
        $.each(fileIds, function (index, item) {
          if (item == parseInt(item, 10)) {
            // Check if item is an integer
            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", parseInt(item), "GET").success(function (response) {
                if (response.IsSuccess) {
                  biographyContent.attachedFiles.push({
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

    biographyContent.clearfilePickers = function () {
      biographyContent.filePickerFiles.fileId = null;
      biographyContent.filePickerFiles.filename = null;
    };

    biographyContent.stringfyLinkFileIds = function () {
      $.each(biographyContent.attachedFiles, function (i, item) {
        if (biographyContent.selectedItem.LinkFileIds == "")
          biographyContent.selectedItem.LinkFileIds = item.fileId;
        else biographyContent.selectedItem.LinkFileIds += "," + item.fileId;
      });
    };
    //--------- End FilePickers Codes -------------------------

    //---------------Upload Modal-------------------------------
    biographyContent.openUploadModal = function () {
      $modal.open({
        templateUrl: "cpanelv1/Modulebiography/biographyContent/upload_modal.html",
        size: "lg",
        scope: $scope
      });

      biographyContent.FileList = [];
      //get list of file from category id
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", null, "POST")
        .success(function (response) {
          biographyContent.FileList = response.ListItems;
        })
        .error(function (data) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    //---------------Upload Modal Podcast-------------------------------
    biographyContent.openUploadModalPodcast = function () {
      $modal.open({
        templateUrl: 'cpanelv1/Modulebiography/biographyContent/upload_modalPodcast.html',
        size: 'lg',
        scope: $scope
      });

      biographyContent.FileList = [];
      //get list of file from category id
      ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
        biographyContent.FileList = response.ListItems;
      }).error(function (data) {
        rashaErManage.checkAction(data, errCode);
      });

    }
    //---------------Upload Modal Movie-------------------------------
    biographyContent.openUploadModalMovie = function () {
      $modal.open({
        templateUrl: 'cpanelv1/Modulebiography/biographyContent/upload_modalMovie.html',
        size: 'lg',
        scope: $scope
      });

      biographyContent.FileList = [];
      //get list of file from category id
      ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
        biographyContent.FileList = response.ListItems;
      }).error(function (data) {
        rashaErManage.checkAction(data, errCode);
      });

    }

    biographyContent.calcuteProgress = function (progress) {
      wdth = Math.floor(progress * 100);
      return wdth;
    };

    biographyContent.whatcolor = function (progress) {
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

    biographyContent.canShow = function (pr) {
      if (pr == 1) {
        return true;
      }
      return false;
    };
    // File Manager actions
    biographyContent.replaceFile = function (name) {
      biographyContent.itemClicked(null, biographyContent.fileIdToDelete, "file");
      biographyContent.fileTypes = 1;
      biographyContent.fileIdToDelete = biographyContent.selectedIndex;

      // Delete the file
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", biographyContent.fileIdToDelete, "GET")
        .success(function (response1) {
          rashaErManage.checkAction(response1);
          if (response1.IsSuccess == true) {

            ajax
              .call(cmsServerConfig.configApiServerPath + "FileContent/delete", response1.Item, "POST")
              .success(function (response2) {
                biographyContent.remove(
                  biographyContent.FileList,
                  biographyContent.fileIdToDelete
                );
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess == true) {
                  // Save New file
                  ajax
                    .call(cmsServerConfig.configApiServerPath + "FileContent/GetViewModel", "", "GET")
                    .success(function (response3) {
                      rashaErManage.checkAction(response3);

                      if (response3.IsSuccess == true) {
                        biographyContent.FileItem = response3.Item;
                        biographyContent.FileItem.FileName = name;
                        biographyContent.FileItem.Extension = name.split(".").pop();
                        biographyContent.FileItem.FileSrc = name;
                        biographyContent.FileItem.LinkCategoryId =
                          biographyContent.thisCategory;
                        biographyContent.saveNewFile();
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
    biographyContent.saveNewFile = function () {
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/add", biographyContent.FileItem, "POST")
        .success(function (response) {
          if (response.IsSuccess) {
            biographyContent.FileItem = response.Item;
            biographyContent.showSuccessIcon();
            return 1;
          } else {
            return 0;
          }
        })
        .error(function (data) {
          biographyContent.showErrorIcon();
          return -1;
        });
    };

    biographyContent.showSuccessIcon = function () {};

    biographyContent.showErrorIcon = function () {};
    //file is exist
    biographyContent.fileIsExist = function (fileName) {
      for (var i = 0; i < biographyContent.FileList.length; i++) {
        if (biographyContent.FileList[i].FileName == fileName) {
          biographyContent.fileIdToDelete = biographyContent.FileList[i].Id;
          return true;
        }
      }
      return false;
    };

    biographyContent.getFileItem = function (id) {
      for (var i = 0; i < biographyContent.FileList.length; i++) {
        if (biographyContent.FileList[i].Id == id) {
          return biographyContent.FileList[i];
        }
      }
    };

    //select file or folder
    biographyContent.itemClicked = function ($event, index, type) {
      if (type == "file" || type == 1) {
        biographyContent.fileTypes = 1;
        biographyContent.selectedFileId = biographyContent.getFileItem(index).Id;
        biographyContent.selectedFileName = biographyContent.getFileItem(index).FileName;
      } else {
        biographyContent.fileTypes = 2;
        biographyContent.selectedCategoryId = biographyContent.getCategoryName(index).Id;
        biographyContent.selectedCategoryTitle = biographyContent.getCategoryName(
          index
        ).Title;
      }
      biographyContent.selectedIndex = index;
    };

    biographyContent.toggleCategoryButtons = function () {
      $("#categoryButtons").fadeToggle();
    };
    //upload file Podcast
    biographyContent.uploadFilePodcast = function (index, uploadFile) {
      if ($("#save-icon" + index).hasClass("fa-save")) {
        if (biographyContent.fileIsExist(uploadFile.name)) { // File already exists
          if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
            //------------ biographyContent.replaceFile(uploadFile.name);
            biographyContent.itemClicked(null, biographyContent.fileIdToDelete, "file");
            biographyContent.fileTypes = 1;
            biographyContent.fileIdToDelete = biographyContent.selectedIndex;
            // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                biographyContent.fileIdToDelete,
                "GET"
              )
              .success(function (response1) {
                if (response1.IsSuccess == true) {
                  rashaErManage.checkAction(response1);
                  ajax.call(cmsServerConfig.configApiServerPath + "FileContent/replace", response1.Item, "POST")
                    .success(function (response2) {
                      rashaErManage.checkAction(response2);

                      if (response2.IsSuccess == true) {
                        biographyContent.FileItem = response2.Item;
                        biographyContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        biographyContent.filePickerFilePodcast.filename =
                          biographyContent.FileItem.FileName;
                        biographyContent.filePickerFilePodcast.fileId =
                          response2.Item.Id;
                        biographyContent.selectedItem.LinkFilePodcastId =
                          biographyContent.filePickerFilePodcast.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function (data) {
                      biographyContent.showErrorIcon();
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
            biographyContent.FileItem = response.Item;
            biographyContent.FileItem.FileName = uploadFile.name;
            biographyContent.FileItem.uploadName = uploadFile.uploadName;
            biographyContent.FileItem.Extension = uploadFile.name.split('.').pop();
            biographyContent.FileItem.FileSrc = uploadFile.name;
            biographyContent.FileItem.LinkCategoryId = null; //Save the new file in the root
            // ------- biographyContent.saveNewFile()  ----------------------
            var result = 0;
            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/add", biographyContent.FileItem, 'POST').success(function (response) {
              if (response.IsSuccess) {
                biographyContent.FileItem = response.Item;
                biographyContent.showSuccessIcon();
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-check");
                biographyContent.filePickerFilePodcast.filename = biographyContent.FileItem.FileName;
                biographyContent.filePickerFilePodcast.fileId = response.Item.Id;
                biographyContent.selectedItem.LinkFilePodcastId = biographyContent.filePickerFilePodcast.fileId

              } else {
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-remove");
              }
            }).error(function (data) {
              biographyContent.showErrorIcon();
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
    biographyContent.uploadFileMovie = function (index, uploadFile) {
      if ($("#save-icon" + index).hasClass("fa-save")) {
        if (biographyContent.fileIsExist(uploadFile.name)) { // File already exists
          if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
            //------------ biographyContent.replaceFile(uploadFile.name);
            biographyContent.itemClicked(null, biographyContent.fileIdToDelete, "file");
            biographyContent.fileTypes = 1;
            biographyContent.fileIdToDelete = biographyContent.selectedIndex;
            // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                biographyContent.fileIdToDelete,
                "GET"
              )
              .success(function (response1) {
                if (response1.IsSuccess == true) {
                  rashaErManage.checkAction(response1);
                  ajax.call(cmsServerConfig.configApiServerPath + "FileContent/replace", response1.Item, "POST")
                    .success(function (response2) {
                      rashaErManage.checkAction(response2);

                      if (response2.IsSuccess == true) {
                        biographyContent.FileItem = response2.Item;
                        biographyContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        biographyContent.filePickerFileMovie.filename =
                          biographyContent.FileItem.FileName;
                        biographyContent.filePickerFileMovie.fileId =
                          response2.Item.Id;
                        biographyContent.selectedItem.LinkFileMovieId =
                          biographyContent.filePickerFileMovie.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function (data) {
                      biographyContent.showErrorIcon();
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
            biographyContent.FileItem = response.Item;
            biographyContent.FileItem.FileName = uploadFile.name;
            biographyContent.FileItem.uploadName = uploadFile.uploadName;
            biographyContent.FileItem.Extension = uploadFile.name.split('.').pop();
            biographyContent.FileItem.FileSrc = uploadFile.name;
            biographyContent.FileItem.LinkCategoryId = null; //Save the new file in the root
            // ------- biographyContent.saveNewFile()  ----------------------
            var result = 0;
            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/add", biographyContent.FileItem, 'POST').success(function (response) {
              if (response.IsSuccess) {
                biographyContent.FileItem = response.Item;
                biographyContent.showSuccessIcon();
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-check");
                biographyContent.filePickerFileMovie.filename = biographyContent.FileItem.FileName;
                biographyContent.filePickerFileMovie.fileId = response.Item.Id;
                biographyContent.selectedItem.LinkFileMovieId = biographyContent.filePickerFileMovie.fileId

              } else {
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-remove");
              }
            }).error(function (data) {
              biographyContent.showErrorIcon();
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
    biographyContent.uploadFile = function (index, uploadFile) {
      if ($("#save-icon" + index).hasClass("fa-save")) {
        if (biographyContent.fileIsExist(uploadFile.name)) {
          // File already exists
          if (
            confirm(
              'File "' +
              uploadFile.name +
              '" already exists! Do you want to replace the new file?'
            )
          ) {
            //------------ biographyContent.replaceFile(uploadFile.name);
            biographyContent.itemClicked(null, biographyContent.fileIdToDelete, "file");
            biographyContent.fileTypes = 1;
            biographyContent.fileIdToDelete = biographyContent.selectedIndex;
            // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                biographyContent.fileIdToDelete,
                "GET"
              )
              .success(function (response1) {
                rashaErManage.checkAction(response1);
                if (response1.IsSuccess == true) {
                  ajax.call(cmsServerConfig.configApiServerPath + "FileContent/replace", response1.Item, "POST")
                    .success(function (response2) {
                      if (response2.IsSuccess == true) {
                        biographyContent.FileItem = response2.Item;
                        biographyContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        biographyContent.filePickerMainImage.filename =
                          biographyContent.FileItem.FileName;
                        biographyContent.filePickerMainImage.fileId =
                          response2.Item.Id;
                        biographyContent.selectedItem.LinkMainImageId =
                          biographyContent.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function (data) {
                      biographyContent.showErrorIcon();
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
              biographyContent.FileItem = response.Item;
              biographyContent.FileItem.FileName = uploadFile.name;
              biographyContent.FileItem.uploadName = uploadFile.uploadName;
              biographyContent.FileItem.Extension = uploadFile.name.split(".").pop();
              biographyContent.FileItem.FileSrc = uploadFile.name;
              biographyContent.FileItem.LinkCategoryId = null; //Save the new file in the root
              // ------- biographyContent.saveNewFile()  ----------------------
              var result = 0;
              ajax
                .call(cmsServerConfig.configApiServerPath + "FileContent/add", biographyContent.FileItem, "POST")
                .success(function (response) {
                  if (response.IsSuccess) {
                    biographyContent.FileItem = response.Item;
                    biographyContent.showSuccessIcon();
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-check");
                    biographyContent.filePickerMainImage.filename =
                      biographyContent.FileItem.FileName;
                    biographyContent.filePickerMainImage.fileId = response.Item.Id;
                    biographyContent.selectedItem.LinkMainImageId =
                      biographyContent.filePickerMainImage.fileId;
                  } else {
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-remove");
                  }
                })
                .error(function (data) {
                  biographyContent.showErrorIcon();
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
    biographyContent.exportFile = function () {
      biographyContent.addRequested = true;
      biographyContent.gridOptions.advancedSearchData.engine.ExportFile =
        biographyContent.ExportFileClass;
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "biographyContent/exportfile",
          biographyContent.gridOptions.advancedSearchData.engine,
          "POST"
        )
        .success(function (response) {
          biographyContent.addRequested = false;
          rashaErManage.checkAction(response);
          if (response.IsSuccess) {
            biographyContent.exportDownloadLink =
              window.location.origin + response.LinkFile;
            $window.open(response.LinkFile, "_blank");
            //biographyContent.closeModal();
          }
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    //Open Export Report Modal
    biographyContent.toggleExportForm = function () {
      biographyContent.SortType = [{
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
      biographyContent.EnumExportFileType = [{
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
      biographyContent.EnumExportReceiveMethod = [{
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
      biographyContent.ExportFileClass = {
        FileType: 1,
        RecieveMethod: 0,
        RowCount: 100
      };
      biographyContent.exportDownloadLink = null;
      $modal.open({
        templateUrl: "cpanelv1/ModuleBiography/BiographyContent/report.html",
        scope: $scope
      });
    };
    //Row Count Export Input Change
    biographyContent.rowCountChanged = function () {
      if (
        !angular.isDefined(biographyContent.ExportFileClass.RowCount) ||
        biographyContent.ExportFileClass.RowCount > 5000
      )
        biographyContent.ExportFileClass.RowCount = 5000;
    };
    //Get TotalRowCount
    biographyContent.getCount = function () {
      ajax.call(cmsServerConfig.configApiServerPath + "biographyContent/count", biographyContent.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
          biographyContent.addRequested = false;
          rashaErManage.checkAction(response);
          biographyContent.ListItemsTotalRowCount = ": " + response.TotalRowCount;
        })
        .error(function (data, errCode, c, d) {
          biographyContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
        });
    };

    biographyContent.showCategoryImage = function (mainImageId) {
      if (mainImageId == 0 || mainImageId == null) return;
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/PreviewImage", {
          id: mainImageId,
          name: ""
        }, "POST")
        .success(function (response) {
          biographyContent.selectedItem.MainImageSrc = response;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };

    //TreeControl
    biographyContent.treeOptions = {
      nodeChildren: "Children",
      multiSelection: false,
      isLeaf: function (node) {
        if (node.FileName == undefined || node.Filename == "") return false;
        return true;
      },
      isSelectable: function (node) {
        if (biographyContent.treeOptions.dirSelectable)
          if (angular.isDefined(node.FileName)) return false;
        return true;
      },
      dirSelectable: false
    };

    biographyContent.onNodeToggle = function (node, expanded) {
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


    biographyContent.onSelection = function (node, selected) {
      if (!selected) {
        biographyContent.selectedItem.LinkMainImageId = null;
        biographyContent.selectedItem.previewImageSrc = null;
        return;
      }
      biographyContent.selectedItem.LinkMainImageId = node.Id;
      biographyContent.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages + "loader.gif";
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", node.Id, "GET")
        .success(function (response) {
          biographyContent.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    //End of TreeControl
  }
]);