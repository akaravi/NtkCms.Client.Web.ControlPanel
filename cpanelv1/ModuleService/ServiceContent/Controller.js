app.controller("serviceContentController", [
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
    var serviceContent = this;
    //شناسه اینام این ماژول در ارتباطات
    //service_WrapperserviceContent
    ModuleRelationShipModuleNameMain = 10;
    serviceContent.RouteUploadFileContent = cmsServerConfig.configRouteUploadFileContent;
    var edititem = false;
    //For Grid Options
    serviceContent.gridOptions = {};
    serviceContent.selectedItem = {};
    serviceContent.selectedItemRelationship = {};
    serviceContent.attachedFiles = [];

    serviceContent.filePickerMainImage = {
      isActive: true,
      backElement: "filePickerMainImage",
      filename: null,
      fileId: null,
      multiSelect: false
    };
    serviceContent.filePickerFilePodcast = {
      isActive: true,
      backElement: 'filePickerFilePodcast',
      filename: null,
      fileId: null,
      extension: 'mp3',
      multiSelect: false,
    }

    serviceContent.filePickerFileMovie = {
      isActive: true,
      backElement: 'filePickerFileMovie',
      filename: null,
      fileId: null,
      extension: 'mp4,avi',
      multiSelect: false,
    }
    serviceContent.filePickerFiles = {
      isActive: true,
      backElement: "filePickerFiles",
      multiSelect: false,
      fileId: null,
      filename: null
    };
    serviceContent.locationChanged = function (lat, lang) {
      //console.log("ok " + lat + " " + lang);
    }
    serviceContent.selectedContentId = {
      Id: $stateParams.ContentId,
      TitleTag: $stateParams.TitleTag
    };
    serviceContent.GeolocationConfig = {
      latitude: 'Geolocationlatitude',
      longitude: 'Geolocationlongitude',
      onlocationChanged: serviceContent.locationChanged,
      useCurrentLocation: true,
      center: {
        lat: 32.658066,
        lng: 51.6693815
      },
      zoom: 4,
      scope: serviceContent,
      useCurrentLocationZoom: 12,
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) {
      serviceContent.itemRecordStatus = itemRecordStatus;
    }
    var date = moment().format();
    serviceContent.selectedItem.ExpireDate = date;
    // serviceContent.datePickerConfig = {
    //   defaultDate: date
    // };

    // serviceContent.FromDate = {
    //   defaultDate: date
    // };
    // serviceContent.ExpireDate = {
    //   defaultDate: date
    // };
    //#help/ سلکتور دسته بندی در ویرایش محتوا
    serviceContent.LinkCategoryIdSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkCategoryId",
      url: "serviceCategory",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: serviceContent,
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
    serviceContent.SimilarsSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "Iddddd",
      url: "serviceContent",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: serviceContent,
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
    serviceContent.LinkModuleContentIdOtherSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkModuleContentIdOther",
      url: "serviceContent",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: serviceContent,
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


    serviceContent.selectedItemModuleRelationShip = [];
    serviceContent.ModuleRelationShip = [];


    serviceContent.moveSelectedRelationOnAdd = function () {
      if (!serviceContent.LinkModuleContentIdOtherSelector.selectedItem.Id || !serviceContent.selectedItemModuleRelationShip.ModuleNameOther) {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_RelationShip'));
        return;
      }
      if (!serviceContent.selectedItemModuleRelationShip.Title || serviceContent.selectedItemModuleRelationShip.Title.length == 0)
        serviceContent.selectedItemModuleRelationShip.Title = serviceContent.LinkModuleContentIdOtherSelector.filterText;
      for (var i = 0; i < serviceContent.ModuleRelationShip.length; i++) {
        if (serviceContent.ModuleRelationShip[i].Id == serviceContent.LinkModuleContentIdOtherSelector.selectedItem.Id) {
          rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
          return;
        }
      }
      serviceContent.ModuleRelationShip.push({
        Title: serviceContent.selectedItemModuleRelationShip.Title,
        ModuleNameOther: serviceContent.selectedItemModuleRelationShip.ModuleNameOther.Value,
        LinkModuleContentIdOther: serviceContent.LinkModuleContentIdOtherSelector.selectedItem.Id,
        ModuleNameMain: ModuleRelationShipModuleNameMain,
        LinkModuleContentIdMain: serviceContent.gridOptions.selectedRow.item.Id
      });
      serviceContent.selectedItemModuleRelationShip = [];
      serviceContent.LinkModuleContentIdOtherSelector.LinkModuleContentIdOther = 0;
    };
    serviceContent.moveSelectedRelationOnEdit = function () {
      if (!serviceContent.LinkModuleContentIdOtherSelector.selectedItem.Id || !serviceContent.selectedItemRelationship.ModuleNameOther) {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_RelationShip'));
        return;
      }
      if (!serviceContent.selectedItemRelationship.Title || serviceContent.selectedItemRelationship.Title.length == 0)
        serviceContent.selectedItemRelationship.Title = serviceContent.LinkModuleContentIdOtherSelector.filterText;

      for (var i = 0; i < serviceContent.ModuleRelationShip.length; i++) {
        if (serviceContent.ModuleRelationShip[i].Id == serviceContent.LinkModuleContentIdOtherSelector.selectedItem.Id &&
          serviceContent.ModuleRelationShip[i].LinkModuleContentIdOther == serviceContent.selectedItemRelationship.ModuleNameOther.Value) {
          rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
          return;
        }
      }

      serviceContent.ModuleRelationShip.push({
        Title: serviceContent.selectedItemRelationship.Title,
        ModuleNameOther: serviceContent.selectedItemRelationship.ModuleNameOther.Value,
        LinkModuleContentIdOther: serviceContent.LinkModuleContentIdOtherSelector.selectedItem.Id,
        ModuleNameMain: ModuleRelationShipModuleNameMain,
        LinkModuleContentIdMain: serviceContent.gridOptions.selectedRow.item.Id
      });
      serviceContent.selectedItemRelationship = [];
      serviceContent.LinkModuleContentIdOtherSelector.LinkModuleContentIdOther = 0;
    };

    serviceContent.removeFromCollectionRelationShip = function (deleteItem) {
      for (var i = 0; i < serviceContent.ModuleRelationShip.length; i++) {
        if (serviceContent.ModuleRelationShip[i].LinkModuleContentIdOther == deleteItem.LinkModuleContentIdOther &&
          serviceContent.ModuleRelationShip[i].ModuleNameOther == deleteItem.ModuleNameOther
        ) {
          serviceContent.ModuleRelationShip.splice(i, 1);
          return;
        }
      }
    };
    serviceContent.removeFromCollectionOtherInfo = function (deleteItem) {
      for (var i = 0; i < serviceContent.OtherInfos.length; i++) {
        if (serviceContent.OtherInfos[i].Id == deleteItem.Id) {
          serviceContent.OtherInfos.splice(i, 1);
          return;
        }
      }
    };
    serviceContent.removeFromCollectionSimilars = function (deleteItem) {
      for (var i = 0; i < serviceContent.Similars.length; i++) {
        if (serviceContent.Similars[i].Id == deleteItem.Id) {
          serviceContent.Similars.splice(i, 1);
          return;
        }
      }
    };
    serviceContent.editFromCollectionOtherInfo = function (editItem) {
      serviceContent.todoModeTitle = $filter('translatentk')('edit_now');
      serviceContent.editMode = true;
      serviceContent.selectedItemOtherInfos = angular.copy(editItem);
      $scope.currentItemIndex = serviceContent.OtherInfos.indexOf(editItem);
    };

    //#help otherInfo

    serviceContent.editOtherInfo = function (y) {
      if (y == null || y == undefined || y.Title == "" || y.Title == undefined || y.HtmlBody == "" || y.HtmlBody == undefined) {
        rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
        return;
      }
      edititem = true;
      serviceContent.selectedItemOtherInfos.Title = y.Title;
      serviceContent.selectedItemOtherInfos.HtmlBody = y.HtmlBody;
      serviceContent.selectedItemOtherInfos.Source = y.Source;
      serviceContent.removeFromOtherInfo(serviceContent.OtherInfos, y.Title, y.HtmlBody, y.Source);
    };
    serviceContent.changSelectedRelationModuleAdd = function () {
      serviceContent.LinkModuleContentIdOtherSelector.url = serviceContent.selectedItemModuleRelationShip.ModuleNameOther.Key.split(/Wrapper(.+)/)[1];
      serviceContent.LinkModuleContentIdOtherSelector.selectedItem = {};
      serviceContent.selectedItem.LinkModuleContentIdOther = {};
    }
    serviceContent.changSelectedRelationModuleEdit = function () {
      serviceContent.LinkModuleContentIdOtherSelector.url = serviceContent.selectedItemRelationship.ModuleNameOther.Key.split(/Wrapper(.+)/)[1];
      serviceContent.LinkModuleContentIdOtherSelector.selectedItem = {};
      serviceContent.selectedItem.LinkModuleContentIdOther = {};
    }
    serviceContent.UrlContent = "";
    //service Grid Options
    serviceContent.gridOptions = {
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
          template: '<li ng-if="!x.IsActivated" class="dropdown" dropdown="" style="display: initial;"><a aria-expanded="false" aria-haspopup="true" class="dropdown-toggle count-info" href="" dropdown-toggle=""><i class="fa fa-cog" ></i></a><ul class="dropdown-menu animated fadeInLeft m-t-xs" style="right: -142px;"><li><a ng-click="serviceContent.addMenu()" style="color:black">AddMenu</a></li><li><a ng-click="serviceContent.showComment(x.Id)" style="color:black">CommentList</a></li></ul></li>'
        }

      ],
      data: {},
      multiSelect: false,
      advancedSearchData: {
        engine: {}
      }
    };
    //Comment Grid Options
    serviceContent.gridContentOptions = {
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
            '<Button ng-if="(x.RecordStatus!=1)" ng-click="serviceContent.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتایید می کنم</Button>' +
            '<Button ng-if="(x.RecordStatus==1)" ng-click="serviceContent.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspغیرفعال می کنم</Button>' +
            '<Button ng-click="serviceContent.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>'
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
    serviceContent.gridOptions.advancedSearchData.engine.Filters = null;
    serviceContent.gridOptions.advancedSearchData.engine.Filters = [];

    //For Show Category Loading Indicator
    serviceContent.categoryBusyIndicator = {
      isActive: true,
      message: "در حال بارگذاری دسته ها ..."
    };
    //For Show service Loading Indicator
    serviceContent.contentBusyIndicator = {
      isActive: false,
      message: "در حال بارگذاری ..."
    };
    //Tree Config
    serviceContent.treeConfig = {
      displayMember: "Title",
      displayId: "Id",
      displayChild: "Children"
    };

    //open addMenu modal
    serviceContent.addMenu = function () {

      $modal.open({
        templateUrl: "cpanelv1/Moduleservice/serviceContent/modalMenu.html",
        scope: $scope
      });
    };

    serviceContent.treeConfig.currentNode = {};
    serviceContent.treeBusyIndicator = false;

    serviceContent.addRequested = false;

    serviceContent.showGridComment = false;
    serviceContent.serviceTitle = "";

    //init Function
    serviceContent.init = function () {
      serviceContent.categoryBusyIndicator.isActive = true;

      var engine = {};
      try {
        engine = serviceContent.gridOptions.advancedSearchData.engine;
      } catch (error) {
        //console.log(error);
      }
      ajax.call(cmsServerConfig.configApiServerPath + "ModulesRelationshipContent/GetEnum", {}, 'POST').success(function (response) {
        rashaErManage.checkAction(response);
        serviceContent.EnumModuleRelationshipName = response.ListItems;
        if (serviceContent.EnumModuleRelationshipName && serviceContent.EnumModuleRelationshipName.length) {
          var retFind = findWithAttr(serviceContent.EnumModuleRelationshipName, "Key", "Service_WrapperServiceContent");
          if (retFind >= 0)
            ModuleRelationShipModuleNameMain = serviceContent.EnumModuleRelationshipName[retFind].Value;
        }
      }).error(function (data, errCode, c, d) {
        rashaErManage.checkAction(data, errCode);
      });
      serviceContent.categoryBusyIndicator.isActive = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "serviceCategory/getall", {
          RowPerPage: 1000
        }, "POST")
        .success(function (response) {
          rashaErManage.checkAction(response);
          serviceContent.treeConfig.Items = response.ListItems;
          serviceContent.categoryBusyIndicator.isActive = false;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
      filterModel = {
        PropertyName: "ContentTags",
        PropertyAnyName: "LinkTagId",
        SearchType: 0,
        IntValue1: serviceContent.selectedContentId.Id
      };
      if (serviceContent.selectedContentId.Id > 0)
        serviceContent.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
      serviceContent.contentBusyIndicator.isActive = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "serviceContent/getall", serviceContent.gridOptions.advancedSearchData.engine, "POST")
        .success(function (response) {
          rashaErManage.checkAction(response);
          serviceContent.ListItems = response.ListItems;
          serviceContent.gridOptions.fillData(
            serviceContent.ListItems,
            response.resultAccess
          ); // Sending Access as an argument
          serviceContent.contentBusyIndicator.isActive = false;
          serviceContent.gridOptions.currentPageNumber =
            response.CurrentPageNumber;
          serviceContent.gridOptions.totalRowCount = response.TotalRowCount;
          serviceContent.gridOptions.rowPerPage = response.RowPerPage;
          serviceContent.gridOptions.maxSize = 5;
        })
        .error(function (data, errCode, c, d) {
          serviceContent.contentBusyIndicator.isActive = false;
          serviceContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
          serviceContent.contentBusyIndicator.isActive = false;
        });

      ajax.call(cmsServerConfig.configApiServerPath + "serviceContentTag/GetViewModel", "", "GET").success(function (response) { //Get a ViewModel for serviceContentTag
          serviceContent.ModuleContentTag = response.Item;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);;
        });
    };
    serviceContent.EnumModuleName = function (enumId) {
      if (!serviceContent.EnumModuleRelationshipName || serviceContent.EnumModuleRelationshipName.length == 0)
        return enumId;
      var retFind = findWithAttr(serviceContent.EnumModuleRelationshipName, "Value", enumId);
      if (retFind < 0)
        return enumId;
      return serviceContent.EnumModuleRelationshipName[retFind].Description;
    }
    // For Show Comments
    serviceContent.showComment = function (LinkContentId) {
      //serviceContent.contentBusyIndicator = true;
      engine = {};
      var filterValue = {
        PropertyName: "LinkContentId",
        IntValue1: parseInt(LinkContentId),
        SearchType: 0
      }
      serviceContent.busyIndicatorForDropDownProcess = true;
      engine.Filters = null;
      engine.Filters = [];
      engine.Filters.push(filterValue);
      ajax.call(cmsServerConfig.configApiServerPath + "servicecomment/getall", engine, 'POST').success(function (response) {
        rashaErManage.checkAction(response);
        serviceContent.ListCommentItems = response.ListItems;
        serviceContent.gridContentOptions.fillData(serviceContent.ListCommentItems, response.resultAccess); // Sending Access as an argument
        serviceContent.showGridComment = true;
        serviceContent.gridContentOptions.currentPageNumber = response.CurrentPageNumber;
        serviceContent.gridContentOptions.totalRowCount = response.TotalRowCount;
        serviceContent.gridContentOptions.rowPerPage = response.RowPerPage;
        serviceContent.gridContentOptions.maxSize = 5;
        $('html, body').animate({
          scrollTop: $("#ListComment").offset().top
        }, 850);
      }).error(function (data, errCode, c, d) {
        serviceContent.gridContentOptions.fillData();
        rashaErManage.checkAction(data, errCode);
        serviceContent.contentBusyIndicator.isActive = false;
      });
    };


    serviceContent.gridContentOptions.onRowSelected = function () {};

    // Open Add Category Modal
    serviceContent.addNewCategoryModel = function () {
      if (buttonIsPressed) {
        return;
      }
      serviceContent.addRequested = false;
      buttonIsPressed = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "serviceCategory/GetViewModel", "", "GET")
        .success(function (response) {
          buttonIsPressed = false;
          rashaErManage.checkAction(response);
          serviceContent.selectedItem = response.Item;
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
              serviceContent.dataForTheTree = response1.ListItems;
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
                    serviceContent.dataForTheTree,
                    response2.ListItems
                  );
                  $modal.open({
                    templateUrl: "cpanelv1/Moduleservice/serviceCategory/add.html",
                    scope: $scope
                  });
                  serviceContent.addRequested = false;
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
    serviceContent.EditCategoryModel = function () {
      if (buttonIsPressed) {
        return;
      }
      serviceContent.addRequested = false;
      //serviceContent.modalTitle = ($filter('translatentk')('Edit_Category'));
      if (!serviceContent.treeConfig.currentNode) {
        rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
        return;
      }

      serviceContent.contentBusyIndicator.isActive = true;
      buttonIsPressed = true;
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "serviceCategory/GetOne",
          serviceContent.treeConfig.currentNode.Id,
          "GET"
        )
        .success(function (response) {
          buttonIsPressed = false;
          serviceContent.contentBusyIndicator.isActive = false;
          rashaErManage.checkAction(response);
          serviceContent.selectedItem = response.Item;
          //Set dataForTheTree
          serviceContent.selectedNode = [];
          serviceContent.expandedNodes = [];
          serviceContent.selectedItem = response.Item;
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
              serviceContent.dataForTheTree = response1.ListItems;
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
                    serviceContent.dataForTheTree,
                    response2.ListItems
                  );
                  //Set selected files to treeControl
                  if (serviceContent.selectedItem.LinkMainImageId > 0)
                    serviceContent.onSelection({
                        Id: serviceContent.selectedItem.LinkMainImageId
                      },
                      true
                    );
                  $modal.open({
                    templateUrl: "cpanelv1/Moduleservice/serviceCategory/edit.html",
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
    serviceContent.Showstatistics = function () {
      if (!serviceContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
        return;
      }
      ajax.call(cmsServerConfig.configApiServerPath + 'serviceContent/GetOne', serviceContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
        rashaErManage.checkAction(response1);
        serviceContent.selectedItem = response1.Item;
        $modal.open({
          templateUrl: "cpanelv1/Moduleservice/serviceContent/statistics.html",
          scope: $scope
        });
      }).error(function (data, errCode, c, d) {
        rashaErManage.checkAction(data, errCode);
      });
    }

    // Add New Category
    serviceContent.addNewCategory = function (frm) {
      if (frm.$invalid) return;
      serviceContent.categoryBusyIndicator.isActive = true;
      serviceContent.addRequested = true;
      serviceContent.selectedItem.LinkParentId = null;
      if (serviceContent.treeConfig.currentNode != null)
        serviceContent.selectedItem.LinkParentId =
        serviceContent.treeConfig.currentNode.Id;
      ajax
        .call(cmsServerConfig.configApiServerPath + "serviceCategory/add", serviceContent.selectedItem, "POST")
        .success(function (response) {
          serviceContent.addRequested = false;
          rashaErManage.checkAction(response);

          if (response.IsSuccess) {
            serviceContent.gridOptions.advancedSearchData.engine.Filters = null;
            serviceContent.gridOptions.advancedSearchData.engine.Filters = [];
            serviceContent.gridOptions.reGetAll();
            serviceContent.closeModal();
          }
          serviceContent.categoryBusyIndicator.isActive = false;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          serviceContent.addRequested = false;
          serviceContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Edit Category REST Api
    serviceContent.EditCategory = function (frm) {
      if (frm.$invalid) return;
      serviceContent.categoryBusyIndicator.isActive = true;
      serviceContent.addRequested = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "serviceCategory/edit", serviceContent.selectedItem, "PUT")
        .success(function (response) {
          //serviceContent.showbusy = false;
          serviceContent.treeConfig.showbusy = false;
          serviceContent.addRequested = false;
          rashaErManage.checkAction(response);
          if (response.IsSuccess) {
            serviceContent.treeConfig.currentNode.Title = response.Item.Title;
            serviceContent.closeModal();
          }
          serviceContent.categoryBusyIndicator.isActive = false;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          serviceContent.addRequested = false;
          serviceContent.categoryBusyIndicator.isActive = false;
        });
    };

    // Delete a Category
    serviceContent.deleteCategory = function () {
      if (buttonIsPressed) {
        return;
      }
      var node = serviceContent.treeConfig.currentNode;
      if (node.Id == 0 || !node.Id) {
        rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
        return;
      }
      rashaErManage.showYesNo(
        ($filter('translatentk')('warning')),
        ($filter('translatentk')('do_you_want_to_delete_this_attribute')),
        function (isConfirmed) {
          if (isConfirmed) {
            serviceContent.categoryBusyIndicator.isActive = true;
            buttonIsPressed = true;
            ajax
              .call(cmsServerConfig.configApiServerPath + "serviceCategory/GetOne", node.Id, "GET")
              .success(function (response) {
                buttonIsPressed = false;
                rashaErManage.checkAction(response);
                serviceContent.selectedItemForDelete = response.Item;
                ajax
                  .call(
                    cmsServerConfig.configApiServerPath + "serviceCategory/delete",
                    serviceContent.selectedItemForDelete,
                    "POST"
                  )
                  .success(function (res) {
                    serviceContent.categoryBusyIndicator.isActive = false;
                    if (res.IsSuccess) {
                      serviceContent.gridOptions.advancedSearchData.engine.Filters = null;
                      serviceContent.gridOptions.advancedSearchData.engine.Filters = [];
                      serviceContent.gridOptions.fillData();
                      serviceContent.gridOptions.reGetAll();
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
                    serviceContent.categoryBusyIndicator.isActive = false;
                  });
              })
              .error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                serviceContent.categoryBusyIndicator.isActive = false;
              });
          }
        }
      );
    };

    //Tree On Node Select Options
    serviceContent.treeConfig.onNodeSelect = function () {
      var node = serviceContent.treeConfig.currentNode;
      serviceContent.showGridComment = false;
      serviceContent.selectContent(node);
    };
    //Show Content with Category Id
    serviceContent.selectContent = function (node) {
      serviceContent.gridOptions.advancedSearchData.engine.Filters = null;
      serviceContent.gridOptions.advancedSearchData.engine.Filters = [];
      if (node != null && node != undefined) {
        serviceContent.contentBusyIndicator.message =
          "در حال بارگذاری مقاله های  دسته " + node.Title;
        serviceContent.contentBusyIndicator.isActive = true;
        //serviceContent.gridOptions.advancedSearchData = {};
        serviceContent.attachedFiles = [];
        var s = {
          PropertyName: "LinkCategoryId",
          IntValue1: node.Id,
          SearchType: 0
        };
        serviceContent.gridOptions.advancedSearchData.engine.Filters.push(s);
      }
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "serviceContent/getall",
          serviceContent.gridOptions.advancedSearchData.engine,
          "POST"
        )
        .success(function (response) {
          rashaErManage.checkAction(response);
          serviceContent.contentBusyIndicator.isActive = false;
          serviceContent.ListItems = response.ListItems;
          serviceContent.gridOptions.fillData(
            serviceContent.ListItems,
            response.resultAccess
          ); // Sending Access as an argument
          serviceContent.gridOptions.currentPageNumber =
            response.CurrentPageNumber;
          serviceContent.gridOptions.totalRowCount = response.TotalRowCount;
          serviceContent.gridOptions.rowPerPage = response.RowPerPage;
        })
        .error(function (data, errCode, c, d) {
          serviceContent.contentBusyIndicator.isActive = false;
          serviceContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Modal
    serviceContent.addNewContentModel = function () {
      serviceContent.selectedItemModuleRelationShip = [];
      serviceContent.ModuleRelationShip = [];
      if (buttonIsPressed) {
        return;
      }
      var node = serviceContent.treeConfig.currentNode;
      if (node.Id == 0 || !node.Id) {
        rashaErManage.showMessage($filter('translatentk')('to_add_a_service_please_select_the_category'));
        buttonIsPressed = false;
        return;
      }
      serviceContent.selectedItemOtherInfos = {};
      serviceContent.attachedFiles = [];
      serviceContent.Similars = [];
      serviceContent.SimilarsDb = [];
      serviceContent.OtherInfos = [];
      serviceContent.OtherInfosDb = [];
      serviceContent.ModuleRelationShip = [];
      serviceContent.ModuleRelationShipDb = [];

      serviceContent.filePickerMainImage.filename = "";
      serviceContent.filePickerMainImage.fileId = null;
      serviceContent.filePickerFilePodcast.filename = "";
      serviceContent.filePickerFilePodcast.fileId = null;
      serviceContent.filePickerFileMovie.filename = "";
      serviceContent.filePickerFileMovie.fileId = null;
      serviceContent.filePickerFiles.filename = "";
      serviceContent.filePickerFiles.fileId = null;
      serviceContent.tags = []; //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
      serviceContent.kwords = []; //tagsInput خالی کردن آرایه کلمات کلیدی برای محتوای جدید
      serviceContent.addRequested = false;
      //serviceContent.modalTitle = ($filter('translatentk')('Add_Content'));
      buttonIsPressed = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "serviceContent/GetViewModel", "", "GET")
        .success(function (response) {
          buttonIsPressed = false;
          rashaErManage.checkAction(response);

          serviceContent.selectedItem = response.Item;
          serviceContent.OtherInfos = [];

          serviceContent.selectedItem.LinkCategoryId = node.Id;
          serviceContent.selectedItem.LinkFileIds = null;

          $modal.open({
            templateUrl: "cpanelv1/Moduleservice/serviceContent/add.html",
            scope: $scope
          });
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };


    serviceContent.SimilarsSelectedItem = {};
    serviceContent.moveSelected = function (from, to, calculatePrice) {
      if (from == "Content") {
        if (
          serviceContent.selectedItem.Id != undefined &&
          serviceContent.selectedItem.Id != null
        ) {
          if (serviceContent.Similars == undefined)
            serviceContent.Similars = [];

          for (var i = 0; i < serviceContent.Similars.length; i++) {
            if (serviceContent.Similars[i].Id == serviceContent.SimilarsSelector.selectedItem.Id) {
              rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
              return;
            }
          }
          serviceContent.Similars.push(serviceContent.SimilarsSelector.selectedItem);
        }
      }
    };

    serviceContent.moveSelectedOtherInfo = function (from, to, y) {
      if (serviceContent.OtherInfos == undefined)
        serviceContent.OtherInfos = [];
      for (var i = 0; i < serviceContent.OtherInfos.length; i++) {

        if (serviceContent.OtherInfos[i].Title == serviceContent.selectedItemOtherInfos.Title && serviceContent.OtherInfos[i].HtmlBody == serviceContent.selectedItemOtherInfos.HtmlBody && serviceContent.OtherInfos[i].Source == serviceContent.selectedItemOtherInfos.Source) {
          rashaErManage.showMessage($filter('translatentk')('Information_Is_Duplicate'));
          return;
        }
      }
      if (serviceContent.selectedItemOtherInfos.Title == "" && serviceContent.selectedItemOtherInfos.Source == "" && serviceContent.selectedItemOtherInfos.HtmlBody == "") {
        rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
      } else if (serviceContent.selectedItemOtherInfos.TypeId == "" || !Number.isInteger(serviceContent.selectedItemOtherInfos.TypeId)) {
        rashaErManage.showMessage($filter('translatentk')('در فیلد نوع مقدار عددی وارد کنید'));
      } else {

        serviceContent.OtherInfos.push({
          Title: serviceContent.selectedItemOtherInfos.Title,
          HtmlBody: serviceContent.selectedItemOtherInfos.HtmlBody,
          Source: serviceContent.selectedItemOtherInfos.Source
        });
        serviceContent.selectedItemOtherInfos.Title = "";
        serviceContent.selectedItemOtherInfos.Source = "";
        serviceContent.selectedItemOtherInfos.HtmlBody = "";
      }
      if (edititem) {
        edititem = false;
      }

    };
    //#help otherInfo
    serviceContent.selectedItemOtherInfos = {};
    serviceContent.todoModeTitle = $filter('translatentk')('ADD_NOW');
    serviceContent.saveOtherInfos = function () {

      if (serviceContent.editMode) {
        if (serviceContent.selectedItemOtherInfos.Title == "" ||
          serviceContent.selectedItemOtherInfos.Title == undefined ||
          serviceContent.selectedItemOtherInfos.HtmlBody == "" ||
          serviceContent.selectedItemOtherInfos.HtmlBody == undefined) {
          rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
          return;
        }
        serviceContent.selectedItemOtherInfos.Edited = true;
        $scope.currentItem = serviceContent.selectedItemOtherInfos;
        serviceContent.OtherInfos[$scope.currentItemIndex] = serviceContent.selectedItemOtherInfos;
        serviceContent.editMode = false;


      } else { //add New
        if (serviceContent.selectedItemOtherInfos.Title == "" ||
          serviceContent.selectedItemOtherInfos.Title == undefined ||
          serviceContent.selectedItemOtherInfos.HtmlBody == "" ||
          serviceContent.selectedItemOtherInfos.HtmlBody == undefined) {
          rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
          return;
        }
        serviceContent.selectedItemOtherInfos.LinkContentId = serviceContent.gridOptions.selectedRow.item.Id;
        serviceContent.OtherInfos.push(serviceContent.selectedItemOtherInfos);
        serviceContent.selectedItemOtherInfos = {};
        // ajax.call(cmsServerConfig.configApiServerPath + 'serviceContentOtherInfo/add', serviceContent.selectedItemOtherInfos, 'POST').success(function (response) {
        //   rashaErManage.checkAction(response);
        //   if (response.IsSuccess) {
        //     serviceContent.selectedItemOtherInfos = response.Item;
        //     mainLIst.push(serviceContent.selectedItemOtherInfos);
        //     serviceContent.selectedItemOtherInfos = {};
        //   }
        // }).error(function (data, errCode, c, d) {
        //   rashaErManage.checkAction(data, errCode);
        // });

      }
      serviceContent.selectedItemOtherInfos = {};
      serviceContent.todoModeTitle = $filter('translatentk')('add_now');
    };




    //#help
    // Open Edit Content Modal
    serviceContent.openEditModel = function () {
      serviceContent.attachedFiles = [];
      serviceContent.Similars = [];
      serviceContent.SimilarsDb = [];
      serviceContent.OtherInfos = [];
      serviceContent.ModuleRelationShip = [];
      serviceContent.selectedItemModuleRelationShip = [];
      serviceContent.ModuleRelationShipDb = [];
      serviceContent.tags = []; //Clear out previous tags
      serviceContent.selectedItemRelationship = [];
      if (buttonIsPressed) {
        return;
      }

      serviceContent.showComment(serviceContent.gridOptions.selectedRow.item.Id)
      serviceContent.addRequested = false;
      //serviceContent.modalTitle = ($filter('translatentk')('Edit_Content'));
      if (!serviceContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
        return;
      }
      if (serviceContent.gridOptions.selectedRow.item.LinkSiteId != $rootScope.tokenInfo.Item.SiteId && !$rootScope.tokenInfo.Item.UserAccessAdminAllowToAllData) {
        rashaErManage.showMessage($filter('translatentk')('This_service_Is_Shared'));
        return;
      }
      serviceContent.selectedItemOtherInfos = {};
      buttonIsPressed = true;
      ajax.call(cmsServerConfig.configApiServerPath + "serviceContent/GetOne", serviceContent.gridOptions.selectedRow.item.Id, "GET")
        .success(function (response1) {
          buttonIsPressed = false;
          rashaErManage.checkAction(response1);
          serviceContent.selectedItem = response1.Item;


          // serviceContent.FromDate.defaultDate = serviceContent.selectedItem.FromDate;
          // serviceContent.ExpireDate.defaultDate = serviceContent.selectedItem.ExpireDate;
          serviceContent.filePickerMainImage.filename = null;
          serviceContent.filePickerMainImage.fileId = null;
          serviceContent.filePickerFilePodcast.filename = null;
          serviceContent.filePickerFilePodcast.fileId = null;
          serviceContent.filePickerFileMovie.filename = null;
          serviceContent.filePickerFileMovie.fileId = null;
          //serviceContentOtherInfo
          var engineOtherInfo = {};
          var filterValue = {
            PropertyName: "LinkContentId",
            IntValue1: serviceContent.gridOptions.selectedRow.item.Id,
            SearchType: 0
          }
          engineOtherInfo.Filters = null;
          engineOtherInfo.Filters = [];
          engineOtherInfo.Filters.push(filterValue);
          ajax.call(cmsServerConfig.configApiServerPath + "serviceContentOtherInfo/GetAll", engineOtherInfo, "POST")
            .success(function (responseOtherInfos) {
              serviceContent.OtherInfosDb = responseOtherInfos.ListItems;
              serviceContent.OtherInfos = angular.extend(serviceContent.OtherInfos, responseOtherInfos.ListItems);
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });

          ajax.call(cmsServerConfig.configApiServerPath + "serviceContentTag/GetAll", engineOtherInfo, "POST")
            .success(function (responsetag) {
              serviceContent.selectedItem.ContentTags = responsetag.ListItems;

              //Load tagsInput
              if (serviceContent.selectedItem.ContentTags == null)
                serviceContent.selectedItem.ContentTags = [];
              $.each(serviceContent.selectedItem.ContentTags, function (index, item) {
                if (item.virtual_ModuleTag != null)
                  serviceContent.tags.push({
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
          ajax.call(cmsServerConfig.configApiServerPath + "serviceContent/GetAllWithSimilarsId/" + serviceContent.gridOptions.selectedRow.item.Id, engineSimilars, "POST")
            .success(function (responseSimilars) {
              serviceContent.SimilarsDb = responseSimilars.ListItems;
              serviceContent.Similars = angular.extend(serviceContent.Similars, responseSimilars.ListItems);
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          var RelationshipModel = {
            Id: serviceContent.gridOptions.selectedRow.item.Id,
            enumValue: ModuleRelationShipModuleNameMain
          };
          ajax.call(cmsServerConfig.configApiServerPath + 'ModulesRelationshipContent/GetAllByContentId', RelationshipModel, 'POST')
            .success(function (responseModuleRelationShip) {
              serviceContent.ModuleRelationShipDb = responseModuleRelationShip.ListItems;
              serviceContent.ModuleRelationShip = angular.extend(serviceContent.ModuleRelationShip, responseModuleRelationShip.ListItems);
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          //serviceContentOtherInfo
          if (response1.Item.LinkMainImageId != null) {
            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", response1.Item.LinkMainImageId, "GET")
              .success(function (response2) {
                buttonIsPressed = false;
                serviceContent.filePickerMainImage.filename =
                  response2.Item.FileName;
                serviceContent.filePickerMainImage.fileId = response2.Item.Id;
              })
              .error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
              });
          }
          if (response1.Item.LinkFilePodcastId != null) {
            ajax.call(cmsServerConfig.configApiServerPath + 'FileContent/GetOne', response1.Item.LinkFilePodcastId, 'GET').success(function (response2) {
              serviceContent.filePickerFilePodcast.filename = response2.Item.FileName;
              serviceContent.filePickerFilePodcast.fileId = response2.Item.Id
            }).error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          }
          if (response1.Item.LinkFileMovieId != null) {
            ajax.call(cmsServerConfig.configApiServerPath + 'FileContent/GetOne', response1.Item.LinkFileMovieId, 'GET').success(function (response2) {
              serviceContent.filePickerFileMovie.filename = response2.Item.FileName;
              serviceContent.filePickerFileMovie.fileId = response2.Item.Id
            }).error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          }

          //link to other module
          serviceContent.parseFileIds(response1.Item.LinkFileIds);
          serviceContent.filePickerFiles.filename = null;
          serviceContent.filePickerFiles.fileId = null;

          //Load Keywords tagsInput
          serviceContent.kwords = []; //Clear out previous tags
          var arraykwords = [];
          if (
            serviceContent.selectedItem.Keyword != null &&
            serviceContent.selectedItem.Keyword != ""
          )
            arraykwords = serviceContent.selectedItem.Keyword.split(",");
          $.each(arraykwords, function (index, item) {
            if (item != null) serviceContent.kwords.push({
              text: item
            }); //Add current content's tag to tags array with id and title
          });
          $modal.open({
            templateUrl: "cpanelv1/Moduleservice/serviceContent/edit.html",
            scope: $scope
          });
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };



    // Add New Content
    serviceContent.addNewContent = function (frm) {
      if (frm.$invalid) return;
      serviceContent.categoryBusyIndicator.isActive = true;
      serviceContent.addRequested = true;

      //Save attached file ids into serviceContent.selectedItem.LinkFileIds
      serviceContent.selectedItem.LinkFileIds = "";
      serviceContent.stringfyLinkFileIds();
      //Save Keywords
      $.each(serviceContent.kwords, function (index, item) {
        if (index == 0) serviceContent.selectedItem.Keyword = item.text;
        else serviceContent.selectedItem.Keyword += "," + item.text;
      });
      if (
        serviceContent.selectedItem.LinkCategoryId == null ||
        serviceContent.selectedItem.LinkCategoryId == 0
      ) {
        rashaErManage.showMessage($filter('translatentk')('to_add_a_service_please_select_the_category'));
        return;
      }
      var apiSelectedItem = serviceContent.selectedItem;

      ajax.call(cmsServerConfig.configApiServerPath + "serviceContent/add", apiSelectedItem, "POST").success(function (response) {
          rashaErManage.checkAction(response);
          serviceContent.categoryBusyIndicator.isActive = false;
          if (response.IsSuccess) {
            serviceContent.selectedItem.LinkSourceId = serviceContent.selectedItem.Id;

            serviceContent.ListItems.unshift(response.Item);
            serviceContent.gridOptions.fillData(serviceContent.ListItems);
            serviceContent.closeModal();
            //Save inputTags

            $.each(serviceContent.tags, function (index, item) {
              if (item.id > 0) {
                item.LinkTagId = item.id;
                item.LinkContentId = response.Item.Id;
              }
            });
            ajax.call(cmsServerConfig.configApiServerPath + "serviceContentTag/addbatch", serviceContent.tags, "POST").success(function (response) {
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
          serviceContent.addRequested = false;
          serviceContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Edit Content
    serviceContent.editContent = function (frm) {
      if (frm.$invalid) return;
      serviceContent.categoryBusyIndicator.isActive = true;
      serviceContent.addRequested = true;
      //Save attached file ids into serviceContent.selectedItem.LinkFileIds
      serviceContent.selectedItem.LinkFileIds = "";
      serviceContent.stringfyLinkFileIds();
      //Save Keywords
      $.each(serviceContent.kwords, function (index, item) {
        if (index == 0) serviceContent.selectedItem.Keyword = item.text;
        else serviceContent.selectedItem.Keyword += "," + item.text;
      });




      //Save inputTags
      $.each(serviceContent.tags, function (index, item) {
        if (item.id > 0) {
          item.LinkTagId = item.id;
          item.LinkContentId = serviceContent.selectedItem.Id;
        }
      });
      serviceContent.ContentTagsRemoved = differenceInFirstArray(serviceContent.selectedItem.ContentTags, serviceContent.tags, 'LinkTagId');
      serviceContent.ContentTagsAdded = differenceInFirstArray(serviceContent.tags, serviceContent.selectedItem.ContentTags, 'LinkTagId');
      //remove
      if (serviceContent.ContentTagsRemoved && serviceContent.ContentTagsRemoved.length > 0) {
        ajax.call(cmsServerConfig.configApiServerPath + "serviceContentTag/DeleteList", serviceContent.ContentTagsRemoved, "Delete").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //Add
      if (serviceContent.ContentTagsAdded && serviceContent.ContentTagsAdded.length > 0) {
        ajax.call(cmsServerConfig.configApiServerPath + "serviceContentTag/addbatch", serviceContent.ContentTagsAdded, "POST").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      ///Save inputTags
      ///Save OtherInfos
      serviceContent.ContentOtherInfosRemoved = differenceInFirstArray(serviceContent.OtherInfosDb, serviceContent.OtherInfos, 'Id');
      serviceContent.ContentOtherInfosAdded = differenceInFirstArray(serviceContent.OtherInfos, serviceContent.OtherInfosDb, 'Id');
      serviceContent.ContentOtherInfosEdit = [];
      $.each(serviceContent.OtherInfos, function (index, item) {
        if (item.Edited && item.Id && item.Id > 0)
          serviceContent.ContentOtherInfosEdit.push(item);
      });

      //remove
      if (serviceContent.ContentOtherInfosRemoved && serviceContent.ContentOtherInfosRemoved.length > 0) {
        var OtherInfosRemovedModel = [];
        $.each(serviceContent.ContentOtherInfosRemoved, function (index, item) {
          OtherInfosRemovedModel.push(item);
        });
        ajax.call(cmsServerConfig.configApiServerPath + "serviceContentOtherInfo/DeleteList", OtherInfosRemovedModel, "Delete").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //Add
      if (serviceContent.ContentOtherInfosAdded && serviceContent.ContentOtherInfosAdded.length > 0) {
        var OtherInfosAddModel = [];
        $.each(serviceContent.ContentOtherInfosAdded, function (index, item) {
          OtherInfosAddModel.push(item);
        });
        ajax.call(cmsServerConfig.configApiServerPath + "serviceContentOtherInfo/addbatch", OtherInfosAddModel, "POST").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //edit
      if (serviceContent.ContentOtherInfosEdit && serviceContent.ContentOtherInfosEdit.length > 0) {
        ajax.call(cmsServerConfig.configApiServerPath + "serviceContentOtherInfo/editbatch", serviceContent.ContentOtherInfosEdit, "PUT").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //edit
      ///Save OtherInfos
      ///Save Similars
      serviceContent.ContentSimilarsRemoved = differenceInFirstArray(serviceContent.SimilarsDb, serviceContent.Similars, 'Id');
      serviceContent.ContentSimilarsAdded = differenceInFirstArray(serviceContent.Similars, serviceContent.SimilarsDb, 'Id');
      //remove
      if (serviceContent.ContentSimilarsRemoved && serviceContent.ContentSimilarsRemoved.length > 0) {
        var SimilarsRemovedModel = [];
        $.each(serviceContent.ContentSimilarsRemoved, function (index, item) {
          SimilarsRemovedModel.push({
            LinkSourceId: serviceContent.selectedItem.Id,
            LinkDestinationId: item.Id
          });
        });
        ajax.call(cmsServerConfig.configApiServerPath + "serviceContentSimilar/DeleteList", SimilarsRemovedModel, "Delete").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //Add
      if (serviceContent.ContentSimilarsAdded && serviceContent.ContentSimilarsAdded.length > 0) {
        var SimilarsAddModel = [];
        $.each(serviceContent.ContentSimilarsAdded, function (index, item) {
          SimilarsAddModel.push({
            LinkSourceId: serviceContent.selectedItem.Id,
            LinkDestinationId: item.Id
          });
        });
        ajax.call(cmsServerConfig.configApiServerPath + "serviceContentSimilar/addbatch", SimilarsAddModel, "POST").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      ///Save Similars

      ///Save ModulesRelationship
      serviceContent.ContentModuleRelationShipRemoved = differenceInFirstArray(serviceContent.ModuleRelationShipDb, serviceContent.ModuleRelationShip, '');
      serviceContent.ContentModuleRelationShipAdded = differenceInFirstArray(serviceContent.ModuleRelationShip, serviceContent.ModuleRelationShipDb, '');
      //remove
      if (serviceContent.ContentModuleRelationShipRemoved && serviceContent.ContentModuleRelationShipRemoved.length > 0) {

        ajax.call(cmsServerConfig.configApiServerPath + "ModulesRelationshipContent/DeleteList", serviceContent.ContentModuleRelationShipRemoved, "Delete").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //Add
      if (serviceContent.ContentModuleRelationShipAdded && serviceContent.ContentModuleRelationShipAdded.length > 0) {

        ajax.call(cmsServerConfig.configApiServerPath + "ModulesRelationshipContent/addbatch", serviceContent.ContentModuleRelationShipAdded, "POST").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      ///Save ModulesRelationship
      if (
        serviceContent.selectedItem.LinkCategoryId == null ||
        serviceContent.selectedItem.LinkCategoryId == 0
      ) {
        rashaErManage.showMessage($filter('translatentk')('to_add_a_service_please_select_the_category'));
        return;
      }
      var apiSelectedItem = {};
      apiSelectedItem = angular.extend(apiSelectedItem, serviceContent.selectedItem);
      apiSelectedItem.OtherInfos = [];
      ajax
        .call(cmsServerConfig.configApiServerPath + "serviceContent/edit", apiSelectedItem, "PUT")
        .success(function (response) {
          serviceContent.categoryBusyIndicator.isActive = false;
          serviceContent.addRequested = false;
          serviceContent.treeConfig.showbusy = false;
          serviceContent.showIsBusy = false;
          rashaErManage.checkAction(response);
          if (response.IsSuccess) {
            serviceContent.replaceItem(serviceContent.selectedItem.Id, response.Item);
            serviceContent.gridOptions.fillData(serviceContent.ListItems);
            serviceContent.closeModal();
          }
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          serviceContent.addRequested = false;
          serviceContent.categoryBusyIndicator.isActive = false;
        });


    };








    // Delete a service Content
    serviceContent.deleteContent = function () {
      if (buttonIsPressed) {
        return;
      }
      if (!serviceContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
        //rashaErManage.showMessage($filter('translatentk')('Tag'));
        return;
      }
      serviceContent.treeConfig.showbusy = true;
      serviceContent.showIsBusy = true;
      rashaErManage.showYesNo(
        ($filter('translatentk')('warning')),
        ($filter('translatentk')('do_you_want_to_delete_this_attribute')),
        function (isConfirmed) {
          if (isConfirmed) {
            serviceContent.categoryBusyIndicator.isActive = true;
            serviceContent.showbusy = true;
            serviceContent.showIsBusy = true;
            buttonIsPressed = true;
            ajax
              .call(
                cmsServerConfig.configApiServerPath + "serviceContent/GetOne",
                serviceContent.gridOptions.selectedRow.item.Id,
                "GET"
              )
              .success(function (response) {
                buttonIsPressed = false;
                serviceContent.showbusy = false;
                serviceContent.showIsBusy = false;
                rashaErManage.checkAction(response);
                serviceContent.selectedItemForDelete = response.Item;
                ajax
                  .call(
                    cmsServerConfig.configApiServerPath + "serviceContent/delete",
                    serviceContent.selectedItemForDelete,
                    "POST"
                  )
                  .success(function (res) {
                    serviceContent.categoryBusyIndicator.isActive = false;
                    serviceContent.treeConfig.showbusy = false;
                    serviceContent.showIsBusy = false;
                    rashaErManage.checkAction(res);
                    if (res.IsSuccess) {
                      serviceContent.replaceItem(
                        serviceContent.selectedItemForDelete.Id
                      );
                      serviceContent.gridOptions.fillData(serviceContent.ListItems);
                    }
                  })
                  .error(function (data2, errCode2, c2, d2) {
                    rashaErManage.checkAction(data2);
                    serviceContent.treeConfig.showbusy = false;
                    serviceContent.showIsBusy = false;
                    serviceContent.categoryBusyIndicator.isActive = false;
                  });
              })
              .error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                serviceContent.treeConfig.showbusy = false;
                serviceContent.showIsBusy = false;
                serviceContent.categoryBusyIndicator.isActive = false;
              });
          }
        }
      );
    };

    //Confirm/UnConfirm service Content
    serviceContent.confirmUnConfirmserviceContent = function () {
      if (!serviceContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
        return;
      }
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "serviceContent/GetOne",
          serviceContent.gridOptions.selectedRow.item.Id,
          "GET"
        )
        .success(function (response) {
          rashaErManage.checkAction(response);
          serviceContent.selectedItem = response.Item;
          serviceContent.selectedItem.IsAccepted = response.Item.IsAccepted == true ?
            false :
            true;
          ajax
            .call(cmsServerConfig.configApiServerPath + "serviceContent/edit", serviceContent.selectedItem, "PUT")
            .success(function (response2) {
              rashaErManage.checkAction(response2);
              if (response2.IsSuccess) {
                var index = serviceContent.ListItems.indexOf(
                  serviceContent.gridOptions.selectedRow.item
                );
                if (index !== -1) {
                  serviceContent.ListItems[index] = response2.Item;
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
    serviceContent.enableArchive = function () {
      if (!serviceContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
        return;
      }

      ajax
        .call(
          cmsServerConfig.configApiServerPath + "serviceContent/GetOne",
          serviceContent.gridOptions.selectedRow.item.Id,
          "GET"
        )
        .success(function (response) {
          rashaErManage.checkAction(response);
          serviceContent.selectedItem = response.Item;
          serviceContent.selectedItem.IsArchive = response.Item.IsArchive == true ?
            false :
            true;
          ajax
            .call(cmsServerConfig.configApiServerPath + "serviceContent/edit", serviceContent.selectedItem, "PUT")
            .success(function (response2) {
              serviceContent.categoryBusyIndicator.isActive = true;
              rashaErManage.checkAction(response2);
              if (response2.IsSuccess) {
                var index = serviceContent.ListItems.indexOf(
                  serviceContent.gridOptions.selectedRow.item
                );
                if (index !== -1) {
                  serviceContent.ListItems[index] = response2.Item;
                }
                serviceContent.categoryBusyIndicator.isActive = false;
              }
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
              serviceContent.categoryBusyIndicator.isActive = false;
            });
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          serviceContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Replace Item OnDelete/OnEdit Grid Options
    serviceContent.replaceItem = function (oldId, newItem) {
      angular.forEach(serviceContent.ListItems, function (item, key) {
        if (item.Id == oldId) {
          var index = serviceContent.ListItems.indexOf(item);
          serviceContent.ListItems.splice(index, 1);
        }
      });
      if (newItem) serviceContent.ListItems.unshift(newItem);
    };

    serviceContent.summernoteOptions = {
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

    //serviceContent.summernoteText = '<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />';

    serviceContent.searchData = function () {
      serviceContent.categoryBusyIndicator.isActive = true;
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "serviceContent/getall",
          serviceContent.gridOptions.advancedSearchData.engine,
          "POST"
        )
        .success(function (response) {
          rashaErManage.checkAction(response);
          serviceContent.categoryBusyIndicator.isActive = false;
          serviceContent.ListItems = response.ListItems;
          serviceContent.gridOptions.fillData(serviceContent.ListItems);
          serviceContent.gridOptions.currentPageNumber =
            response.CurrentPageNumber;
          serviceContent.gridOptions.totalRowCount = response.TotalRowCount;
          serviceContent.gridOptions.rowPerPage = response.RowPerPage;
          serviceContent.allowedSearch = response.AllowedSearchField;
        })
        .error(function (data, errCode, c, d) {
          serviceContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
        });
    };

    //Close Model Stack
    serviceContent.addRequested = false;
    serviceContent.closeModal = function () {
      $modalStack.dismissAll();
    };

    serviceContent.showIsBusy = false;

    //Aprove a comment
    serviceContent.confirmComment = function (item) {
      if (item.Id && item.Id > 0) {
        item.RecordStatus = 1;
        var itemCopy = angular.copy(item);
        itemCopy.rowOption = null;
        ajax.call(cmsServerConfig.configApiServerPath + 'serviceComment/edit', itemCopy, 'PUT').success(function (response) {
          rashaErManage.checkAction(response);
          if(response.IsSuccess)
          serviceContent.showComment(serviceContent.gridOptions.selectedRow.item.Id)
        }).error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
      }
    };

    //Decline a comment
    serviceContent.doNotConfirmComment = function (item) {
      if (item.Id && item.Id > 0) {
        item.RecordStatus = 5;//DeniedConfirmed
        var itemCopy = angular.copy(item);
        itemCopy.rowOption = null;
        ajax.call(cmsServerConfig.configApiServerPath + 'serviceComment/edit', itemCopy, 'PUT').success(function (response) {
          if(response.IsSuccess)
          serviceContent.showComment(serviceContent.gridOptions.selectedRow.item.Id)
          rashaErManage.checkAction(response);
        }).error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
      }
    };
    //Remove a comment
    serviceContent.deleteComment = function (item) {
      if (!item) {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
        return;
      }
      serviceContent.treeConfig.showbusy = true;
      serviceContent.showIsBusy = true;
      rashaErManage.showYesNo(
        ($filter('translatentk')('warning')),
        "آیا می خواهید این نظر را حذف کنید",
        function (isConfirmed) {
          if (isConfirmed) {

            serviceContent.treeConfig.showbusy = true;
            serviceContent.showbusy = true;
            serviceContent.showIsBusy = true;

            var itemCopy = angular.copy(item);
            itemCopy.rowOption = null;
            ajax.call(cmsServerConfig.configApiServerPath + "serviceComment/delete", itemCopy, "POST")
              .success(function (res) {
                serviceContent.treeConfig.showbusy = false;
                serviceContent.showbusy = false;
                serviceContent.showIsBusy = false;
                rashaErManage.checkAction(res);
                if (res.IsSuccess) {
                  serviceContent.showComment(serviceContent.gridOptions.selectedRow.item.Id)
                  
                }
              })
              .error(function (data2, errCode2, c2, d2) {
                rashaErManage.checkAction(data2);
                serviceContent.treeConfig.showbusy = false;
                serviceContent.showbusy = false;
                serviceContent.showIsBusy = false;
              });

          }
        }
      );
    };

    //For reInit Categories
    serviceContent.gridOptions.reGetAll = function () {
      if (serviceContent.gridOptions.advancedSearchData.engine.Filters.length > 0)
        serviceContent.searchData();
      else serviceContent.init();
    };

    serviceContent.isCurrentNodeEmpty = function () {
      return !angular.equals({}, serviceContent.treeConfig.currentNode);
    };

    serviceContent.loadFileAndFolder = function (item) {
      serviceContent.treeConfig.currentNode = item;
      serviceContent.treeConfig.onNodeSelect(item);
    };

    serviceContent.openDate = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $timeout(function () {
        serviceContent.focus = true;
      });
    };
    serviceContent.openDate1 = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $timeout(function () {
        serviceContent.focus1 = true;
      });
    };

    serviceContent.columnCheckbox = false;
    serviceContent.openGridConfigModal = function () {
      $("#gridView-btn").toggleClass("active");
      var prechangeColumns = serviceContent.gridOptions.columns;
      if (serviceContent.gridOptions.columnCheckbox) {
        for (var i = 0; i < serviceContent.gridOptions.columns.length; i++) {
          //serviceContent.gridOptions.columns[i].visible = $("#" + serviceContent.gridOptions.columns[i].Id + "Checkbox").is(":checked");
          var element = $(
            "#" +
            serviceContent.gridOptions.columns[i].name.replace(".", "") +
            "Checkbox"
          );
          var temp = element[0].checked;
          serviceContent.gridOptions.columns[i].visible = temp;
        }
      } else {
        for (var i = 0; i < serviceContent.gridOptions.columns.length; i++) {
          var element = $(
            "#" +
            serviceContent.gridOptions.columns[i].name.replace(".", "") +
            "Checkbox"
          );
          $(
              "#" + serviceContent.gridOptions.columns[i].name + "Checkbox"
            ).checked =
            prechangeColumns[i].visible;
        }
      }
      for (var i = 0; i < serviceContent.gridOptions.columns.length; i++) {

      }
      serviceContent.gridOptions.columnCheckbox = !serviceContent.gridOptions
        .columnCheckbox;
    };

    serviceContent.deleteAttachedFile = function (index) {
      serviceContent.attachedFiles.splice(index, 1);
    };

    serviceContent.addAttachedFile = function (id) {
      var fname = $("#file" + id).text();
      if (
        id != null &&
        id != undefined &&
        !serviceContent.alreadyExist(id, serviceContent.attachedFiles) &&
        fname != null &&
        fname != ""
      ) {
        var fId = id;
        var file = {
          id: fId,
          name: fname
        };
        serviceContent.attachedFiles.push(file);
        if (document.getElementsByName("file" + id).length > 1)
          document.getElementsByName("file" + id)[1].textContent = "";
        else document.getElementsByName("file" + id)[0].textContent = "";
      }
    };

    serviceContent.alreadyExist = function (id, array) {
      for (var i = 0; i < array.length; i++) {
        if (id == array[i].fileId) {
          rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
          return true;
        }
      }
      return false;
    };

    serviceContent.filePickerMainImage.removeSelectedfile = function (config) {
      serviceContent.filePickerMainImage.fileId = null;
      serviceContent.filePickerMainImage.filename = null;
      serviceContent.selectedItem.LinkMainImageId = null;
    };
    serviceContent.filePickerFilePodcast.removeSelectedfile = function (config) {
      serviceContent.filePickerFilePodcast.fileId = null;
      serviceContent.filePickerFilePodcast.filename = null;
      serviceContent.selectedItem.LinkFilePodcastId = null;

    }
    serviceContent.filePickerFileMovie.removeSelectedfile = function (config) {
      serviceContent.filePickerFileMovie.fileId = null;
      serviceContent.filePickerFileMovie.filename = null;
      serviceContent.selectedItem.LinkFileMovieId = null;

    }
    serviceContent.filePickerFiles.removeSelectedfile = function (config) {
      serviceContent.filePickerFiles.fileId = null;
      serviceContent.filePickerFiles.filename = null;
    };

    serviceContent.showUpload = function () {
      $("#fastUpload").fadeToggle();
    };

    // ----------- FilePicker Codes --------------------------------
    serviceContent.addAttachedFile = function (id) {
      var fname = $("#file" + id).text();
      if (fname == "") {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
        return;
      }
      if (
        id != null &&
        id != undefined &&
        !serviceContent.alreadyExist(id, serviceContent.attachedFiles)
      ) {
        var fId = id;
        var file = {
          fileId: fId,
          filename: fname,
          previewImageSrc: cmsServerConfig.configPathFileByIdAndName + fId + "/" + fname
        };
        serviceContent.attachedFiles.push(file);
        serviceContent.clearfilePickers();
      }
    };

    serviceContent.alreadyExist = function (fieldId, array) {
      for (var i = 0; i < array.length; i++) {
        if (fieldId == array[i].fileId) {
          rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
          serviceContent.clearfilePickers();
          return true;
        }
      }
      return false;
    };

    serviceContent.deleteAttachedfieldName = function (index) {
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "serviceContent/delete",
          serviceContent.contractsList[index],
          "POST"
        )
        .success(function (res) {
          rashaErManage.checkAction(res);
          if (res.IsSuccess) {
            serviceContent.contractsList.splice(index, 1);
            rashaErManage.showMessage($filter('translatentk')('Removed_Successfully'));
          }
        })
        .error(function (data2, errCode2, c2, d2) {
          rashaErManage.checkAction(data2);
        });
    };

    serviceContent.parseFileIds = function (stringOfIds) {
      if (stringOfIds == null || !stringOfIds.trim()) return;
      var fileIds = stringOfIds.split(",");
      if (fileIds.length != undefined) {
        $.each(fileIds, function (index, item) {
          if (item == parseInt(item, 10)) {
            // Check if item is an integer
            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", parseInt(item), "GET").success(function (response) {
                if (response.IsSuccess) {
                  serviceContent.attachedFiles.push({
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

    serviceContent.clearfilePickers = function () {
      serviceContent.filePickerFiles.fileId = null;
      serviceContent.filePickerFiles.filename = null;
    };

    serviceContent.stringfyLinkFileIds = function () {
      $.each(serviceContent.attachedFiles, function (i, item) {
        if (serviceContent.selectedItem.LinkFileIds == "")
          serviceContent.selectedItem.LinkFileIds = item.fileId;
        else serviceContent.selectedItem.LinkFileIds += "," + item.fileId;
      });
    };
    //--------- End FilePickers Codes -------------------------

    //---------------Upload Modal-------------------------------
    serviceContent.openUploadModal = function () {
      $modal.open({
        templateUrl: "cpanelv1/Moduleservice/serviceContent/upload_modal.html",
        size: "lg",
        scope: $scope
      });

      serviceContent.FileList = [];
      //get list of file from category id
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", null, "POST")
        .success(function (response) {
          serviceContent.FileList = response.ListItems;
        })
        .error(function (data) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    //---------------Upload Modal Podcast-------------------------------
    serviceContent.openUploadModalPodcast = function () {
      $modal.open({
        templateUrl: 'cpanelv1/Moduleservice/serviceContent/upload_modalPodcast.html',
        size: 'lg',
        scope: $scope
      });

      serviceContent.FileList = [];
      //get list of file from category id
      ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
        serviceContent.FileList = response.ListItems;
      }).error(function (data) {
        rashaErManage.checkAction(data, errCode);
      });

    }
    //---------------Upload Modal Movie-------------------------------
    serviceContent.openUploadModalMovie = function () {
      $modal.open({
        templateUrl: 'cpanelv1/Moduleservice/serviceContent/upload_modalMovie.html',
        size: 'lg',
        scope: $scope
      });

      serviceContent.FileList = [];
      //get list of file from category id
      ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
        serviceContent.FileList = response.ListItems;
      }).error(function (data) {
        rashaErManage.checkAction(data, errCode);
      });

    }

    serviceContent.calcuteProgress = function (progress) {
      wdth = Math.floor(progress * 100);
      return wdth;
    };

    serviceContent.whatcolor = function (progress) {
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

    serviceContent.canShow = function (pr) {
      if (pr == 1) {
        return true;
      }
      return false;
    };
    // File Manager actions
    serviceContent.replaceFile = function (name) {
      serviceContent.itemClicked(null, serviceContent.fileIdToDelete, "file");
      serviceContent.fileTypes = 1;
      serviceContent.fileIdToDelete = serviceContent.selectedIndex;

      // Delete the file
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", serviceContent.fileIdToDelete, "GET")
        .success(function (response1) {
          rashaErManage.checkAction(response1);
          if (response1.IsSuccess == true) {

            ajax
              .call(cmsServerConfig.configApiServerPath + "FileContent/delete", response1.Item, "POST")
              .success(function (response2) {
                serviceContent.remove(
                  serviceContent.FileList,
                  serviceContent.fileIdToDelete
                );
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess == true) {
                  // Save New file
                  ajax
                    .call(cmsServerConfig.configApiServerPath + "FileContent/GetViewModel", "", "GET")
                    .success(function (response3) {
                      rashaErManage.checkAction(response3);

                      if (response3.IsSuccess == true) {
                        serviceContent.FileItem = response3.Item;
                        serviceContent.FileItem.FileName = name;
                        serviceContent.FileItem.Extension = name.split(".").pop();
                        serviceContent.FileItem.FileSrc = name;
                        serviceContent.FileItem.LinkCategoryId =
                          serviceContent.thisCategory;
                        serviceContent.saveNewFile();
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
    serviceContent.saveNewFile = function () {
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/add", serviceContent.FileItem, "POST")
        .success(function (response) {
          if (response.IsSuccess) {
            serviceContent.FileItem = response.Item;
            serviceContent.showSuccessIcon();
            return 1;
          } else {
            return 0;
          }
        })
        .error(function (data) {
          serviceContent.showErrorIcon();
          return -1;
        });
    };

    serviceContent.showSuccessIcon = function () {};

    serviceContent.showErrorIcon = function () {};
    //file is exist
    serviceContent.fileIsExist = function (fileName) {
      for (var i = 0; i < serviceContent.FileList.length; i++) {
        if (serviceContent.FileList[i].FileName == fileName) {
          serviceContent.fileIdToDelete = serviceContent.FileList[i].Id;
          return true;
        }
      }
      return false;
    };

    serviceContent.getFileItem = function (id) {
      for (var i = 0; i < serviceContent.FileList.length; i++) {
        if (serviceContent.FileList[i].Id == id) {
          return serviceContent.FileList[i];
        }
      }
    };

    //select file or folder
    serviceContent.itemClicked = function ($event, index, type) {
      if (type == "file" || type == 1) {
        serviceContent.fileTypes = 1;
        serviceContent.selectedFileId = serviceContent.getFileItem(index).Id;
        serviceContent.selectedFileName = serviceContent.getFileItem(index).FileName;
      } else {
        serviceContent.fileTypes = 2;
        serviceContent.selectedCategoryId = serviceContent.getCategoryName(index).Id;
        serviceContent.selectedCategoryTitle = serviceContent.getCategoryName(
          index
        ).Title;
      }
      serviceContent.selectedIndex = index;
    };

    serviceContent.toggleCategoryButtons = function () {
      $("#categoryButtons").fadeToggle();
    };
    //upload file Podcast
    serviceContent.uploadFilePodcast = function (index, uploadFile) {
      if ($("#save-icon" + index).hasClass("fa-save")) {
        if (serviceContent.fileIsExist(uploadFile.name)) { // File already exists
          if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
            //------------ serviceContent.replaceFile(uploadFile.name);
            serviceContent.itemClicked(null, serviceContent.fileIdToDelete, "file");
            serviceContent.fileTypes = 1;
            serviceContent.fileIdToDelete = serviceContent.selectedIndex;
            // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                serviceContent.fileIdToDelete,
                "GET"
              )
              .success(function (response1) {
                if (response1.IsSuccess == true) {
                  rashaErManage.checkAction(response1);
                  ajax.call(cmsServerConfig.configApiServerPath + "FileContent/replace", response1.Item, "POST")
                    .success(function (response2) {
                      rashaErManage.checkAction(response2);

                      if (response2.IsSuccess == true) {
                        serviceContent.FileItem = response2.Item;
                        serviceContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        serviceContent.filePickerFilePodcast.filename =
                          serviceContent.FileItem.FileName;
                        serviceContent.filePickerFilePodcast.fileId =
                          response2.Item.Id;
                        serviceContent.selectedItem.LinkFilePodcastId =
                          serviceContent.filePickerFilePodcast.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function (data) {
                      serviceContent.showErrorIcon();
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
            serviceContent.FileItem = response.Item;
            serviceContent.FileItem.FileName = uploadFile.name;
            serviceContent.FileItem.uploadName = uploadFile.uploadName;
            serviceContent.FileItem.Extension = uploadFile.name.split('.').pop();
            serviceContent.FileItem.FileSrc = uploadFile.name;
            serviceContent.FileItem.LinkCategoryId = null; //Save the new file in the root
            // ------- serviceContent.saveNewFile()  ----------------------
            var result = 0;
            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/add", serviceContent.FileItem, 'POST').success(function (response) {
              if (response.IsSuccess) {
                serviceContent.FileItem = response.Item;
                serviceContent.showSuccessIcon();
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-check");
                serviceContent.filePickerFilePodcast.filename = serviceContent.FileItem.FileName;
                serviceContent.filePickerFilePodcast.fileId = response.Item.Id;
                serviceContent.selectedItem.LinkFilePodcastId = serviceContent.filePickerFilePodcast.fileId

              } else {
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-remove");
              }
            }).error(function (data) {
              serviceContent.showErrorIcon();
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
    serviceContent.uploadFileMovie = function (index, uploadFile) {
      if ($("#save-icon" + index).hasClass("fa-save")) {
        if (serviceContent.fileIsExist(uploadFile.name)) { // File already exists
          if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
            //------------ serviceContent.replaceFile(uploadFile.name);
            serviceContent.itemClicked(null, serviceContent.fileIdToDelete, "file");
            serviceContent.fileTypes = 1;
            serviceContent.fileIdToDelete = serviceContent.selectedIndex;
            // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                serviceContent.fileIdToDelete,
                "GET"
              )
              .success(function (response1) {
                if (response1.IsSuccess == true) {
                  rashaErManage.checkAction(response1);
                  ajax.call(cmsServerConfig.configApiServerPath + "FileContent/replace", response1.Item, "POST")
                    .success(function (response2) {
                      rashaErManage.checkAction(response2);

                      if (response2.IsSuccess == true) {
                        serviceContent.FileItem = response2.Item;
                        serviceContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        serviceContent.filePickerFileMovie.filename =
                          serviceContent.FileItem.FileName;
                        serviceContent.filePickerFileMovie.fileId =
                          response2.Item.Id;
                        serviceContent.selectedItem.LinkFileMovieId =
                          serviceContent.filePickerFileMovie.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function (data) {
                      serviceContent.showErrorIcon();
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
            serviceContent.FileItem = response.Item;
            serviceContent.FileItem.FileName = uploadFile.name;
            serviceContent.FileItem.uploadName = uploadFile.uploadName;
            serviceContent.FileItem.Extension = uploadFile.name.split('.').pop();
            serviceContent.FileItem.FileSrc = uploadFile.name;
            serviceContent.FileItem.LinkCategoryId = null; //Save the new file in the root
            // ------- serviceContent.saveNewFile()  ----------------------
            var result = 0;
            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/add", serviceContent.FileItem, 'POST').success(function (response) {
              if (response.IsSuccess) {
                serviceContent.FileItem = response.Item;
                serviceContent.showSuccessIcon();
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-check");
                serviceContent.filePickerFileMovie.filename = serviceContent.FileItem.FileName;
                serviceContent.filePickerFileMovie.fileId = response.Item.Id;
                serviceContent.selectedItem.LinkFileMovieId = serviceContent.filePickerFileMovie.fileId

              } else {
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-remove");
              }
            }).error(function (data) {
              serviceContent.showErrorIcon();
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
    serviceContent.uploadFile = function (index, uploadFile) {
      if ($("#save-icon" + index).hasClass("fa-save")) {
        if (serviceContent.fileIsExist(uploadFile.name)) {
          // File already exists
          if (
            confirm(
              'File "' +
              uploadFile.name +
              '" already exists! Do you want to replace the new file?'
            )
          ) {
            //------------ serviceContent.replaceFile(uploadFile.name);
            serviceContent.itemClicked(null, serviceContent.fileIdToDelete, "file");
            serviceContent.fileTypes = 1;
            serviceContent.fileIdToDelete = serviceContent.selectedIndex;
            // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                serviceContent.fileIdToDelete,
                "GET"
              )
              .success(function (response1) {
                rashaErManage.checkAction(response1);
                if (response1.IsSuccess == true) {
                  ajax.call(cmsServerConfig.configApiServerPath + "FileContent/replace", response1.Item, "POST")
                    .success(function (response2) {
                      if (response2.IsSuccess == true) {
                        serviceContent.FileItem = response2.Item;
                        serviceContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        serviceContent.filePickerMainImage.filename =
                          serviceContent.FileItem.FileName;
                        serviceContent.filePickerMainImage.fileId =
                          response2.Item.Id;
                        serviceContent.selectedItem.LinkMainImageId =
                          serviceContent.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function (data) {
                      serviceContent.showErrorIcon();
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
              serviceContent.FileItem = response.Item;
              serviceContent.FileItem.FileName = uploadFile.name;
              serviceContent.FileItem.uploadName = uploadFile.uploadName;
              serviceContent.FileItem.Extension = uploadFile.name.split(".").pop();
              serviceContent.FileItem.FileSrc = uploadFile.name;
              serviceContent.FileItem.LinkCategoryId = null; //Save the new file in the root
              // ------- serviceContent.saveNewFile()  ----------------------
              var result = 0;
              ajax
                .call(cmsServerConfig.configApiServerPath + "FileContent/add", serviceContent.FileItem, "POST")
                .success(function (response) {
                  if (response.IsSuccess) {
                    serviceContent.FileItem = response.Item;
                    serviceContent.showSuccessIcon();
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-check");
                    serviceContent.filePickerMainImage.filename =
                      serviceContent.FileItem.FileName;
                    serviceContent.filePickerMainImage.fileId = response.Item.Id;
                    serviceContent.selectedItem.LinkMainImageId =
                      serviceContent.filePickerMainImage.fileId;
                  } else {
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-remove");
                  }
                })
                .error(function (data) {
                  serviceContent.showErrorIcon();
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
    serviceContent.exportFile = function () {
      serviceContent.addRequested = true;
      serviceContent.gridOptions.advancedSearchData.engine.ExportFile =
        serviceContent.ExportFileClass;
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "serviceContent/exportfile",
          serviceContent.gridOptions.advancedSearchData.engine,
          "POST"
        )
        .success(function (response) {
          serviceContent.addRequested = false;
          rashaErManage.checkAction(response);
          if (response.IsSuccess) {
            serviceContent.exportDownloadLink =
              window.location.origin + response.LinkFile;
            $window.open(response.LinkFile, "_blank");
            //serviceContent.closeModal();
          }
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    //Open Export Report Modal
    serviceContent.toggleExportForm = function () {
      serviceContent.SortType = [{
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
      serviceContent.EnumExportFileType = [{
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
      serviceContent.EnumExportReceiveMethod = [{
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
      serviceContent.ExportFileClass = {
        FileType: 1,
        RecieveMethod: 0,
        RowCount: 100
      };
      serviceContent.exportDownloadLink = null;
      $modal.open({
        templateUrl: "cpanelv1/Moduleservice/serviceContent/report.html",
        scope: $scope
      });
    };
    //Row Count Export Input Change
    serviceContent.rowCountChanged = function () {
      if (
        !angular.isDefined(serviceContent.ExportFileClass.RowCount) ||
        serviceContent.ExportFileClass.RowCount > 5000
      )
        serviceContent.ExportFileClass.RowCount = 5000;
    };
    //Get TotalRowCount
    serviceContent.getCount = function () {
      ajax.call(cmsServerConfig.configApiServerPath + "serviceContent/count", serviceContent.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
          serviceContent.addRequested = false;
          rashaErManage.checkAction(response);
          serviceContent.ListItemsTotalRowCount = ": " + response.TotalRowCount;
        })
        .error(function (data, errCode, c, d) {
          serviceContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
        });
    };

    serviceContent.showCategoryImage = function (mainImageId) {
      if (mainImageId == 0 || mainImageId == null) return;
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/PreviewImage", {
          id: mainImageId,
          name: ""
        }, "POST")
        .success(function (response) {
          serviceContent.selectedItem.MainImageSrc = response;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };

    //TreeControl
    serviceContent.treeOptions = {
      nodeChildren: "Children",
      multiSelection: false,
      isLeaf: function (node) {
        if (node.FileName == undefined || node.Filename == "") return false;
        return true;
      },
      isSelectable: function (node) {
        if (serviceContent.treeOptions.dirSelectable)
          if (angular.isDefined(node.FileName)) return false;
        return true;
      },
      dirSelectable: false
    };

    serviceContent.onNodeToggle = function (node, expanded) {
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


    serviceContent.onSelection = function (node, selected) {
      if (!selected) {
        serviceContent.selectedItem.LinkMainImageId = null;
        serviceContent.selectedItem.previewImageSrc = null;
        return;
      }
      serviceContent.selectedItem.LinkMainImageId = node.Id;
      serviceContent.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages + "loader.gif";
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", node.Id, "GET")
        .success(function (response) {
          serviceContent.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    //End of TreeControl
  }
]);