app.controller("newsContentController", [
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
    var newsContent = this;
    //شناسه اینام این ماژول در ارتباطات
    //News_WrapperNewsContent
    ModuleRelationShipModuleNameMain = 10;
    newsContent.RouteUploadFileContent = cmsServerConfig.configRouteUploadFileContent;
    var edititem = false;
    //For Grid Options
    newsContent.gridOptions = {};
    newsContent.selectedItem = {};
    newsContent.selectedItemRelationship = {};
    newsContent.attachedFiles = [];

    newsContent.filePickerMainImage = {
      isActive: true,
      backElement: "filePickerMainImage",
      filename: null,
      fileId: null,
      multiSelect: false
    };
    newsContent.filePickerFilePodcast = {
      isActive: true,
      backElement: 'filePickerFilePodcast',
      filename: null,
      fileId: null,
      extension: 'mp3',
      multiSelect: false,
    }

    newsContent.filePickerFileMovie = {
      isActive: true,
      backElement: 'filePickerFileMovie',
      filename: null,
      fileId: null,
      extension: 'mp4,avi',
      multiSelect: false,
    }
    newsContent.filePickerFiles = {
      isActive: true,
      backElement: "filePickerFiles",
      multiSelect: false,
      fileId: null,
      filename: null
    };
    newsContent.locationChanged = function (lat, lang) {
      //console.log("ok " + lat + " " + lang);
    }
    newsContent.selectedContentId = {
      Id: $stateParams.ContentId,
      TitleTag: $stateParams.TitleTag
    };
    newsContent.GeolocationConfig = {
      latitude: 'Geolocationlatitude',
      longitude: 'Geolocationlongitude',
      onlocationChanged: newsContent.locationChanged,
      useCurrentLocation: true,
      center: {
        lat: 32.658066,
        lng: 51.6693815
      },
      zoom: 4,
      scope: newsContent,
      useCurrentLocationZoom: 12,
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) {
      newsContent.itemRecordStatus = itemRecordStatus;
    }
    var date = moment().format();
    newsContent.selectedItem.ExpireDate = date;
    // newsContent.datePickerConfig = {
    //   defaultDate: date
    // };

    // newsContent.FromDate = {
    //   defaultDate: date
    // };
    // newsContent.ExpireDate = {
    //   defaultDate: date
    // };
    //#help/ سلکتور دسته بندی در ویرایش محتوا
    newsContent.LinkCategoryIdSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkCategoryId",
      url: "NewsCategory",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: newsContent,
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
    newsContent.SimilarsSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "Iddddd",
      url: "NewsContent",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: newsContent,
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
    newsContent.LinkModuleContentIdOtherSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkModuleContentIdOther",
      url: "newsContent",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: newsContent,
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


    newsContent.selectedItemModuleRelationShip = [];
    newsContent.ModuleRelationShip = [];


    newsContent.moveSelectedRelationOnAdd = function () {
      if (!newsContent.LinkModuleContentIdOtherSelector.selectedItem.Id || !newsContent.selectedItemModuleRelationShip.ModuleNameOther) {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_RelationShip'));
        return;
      }
      if (!newsContent.selectedItemModuleRelationShip.Title || newsContent.selectedItemModuleRelationShip.Title.length == 0)
        newsContent.selectedItemModuleRelationShip.Title = newsContent.LinkModuleContentIdOtherSelector.filterText;
      for (var i = 0; i < newsContent.ModuleRelationShip.length; i++) {
        if (newsContent.ModuleRelationShip[i].Id == newsContent.LinkModuleContentIdOtherSelector.selectedItem.Id) {
          rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
          return;
        }
      }
      newsContent.ModuleRelationShip.push({
        Title: newsContent.selectedItemModuleRelationShip.Title,
        ModuleNameOther: newsContent.selectedItemModuleRelationShip.ModuleNameOther.Value,
        LinkModuleContentIdOther: newsContent.LinkModuleContentIdOtherSelector.selectedItem.Id,
        ModuleNameMain: ModuleRelationShipModuleNameMain,
        LinkModuleContentIdMain: newsContent.gridOptions.selectedRow.item.Id
      });
      newsContent.selectedItemModuleRelationShip = [];
      newsContent.LinkModuleContentIdOtherSelector.LinkModuleContentIdOther = 0;
    };
    newsContent.moveSelectedRelationOnEdit = function () {
      if (!newsContent.LinkModuleContentIdOtherSelector.selectedItem.Id || !newsContent.selectedItemRelationship.ModuleNameOther) {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_RelationShip'));
        return;
      }
      if (!newsContent.selectedItemRelationship.Title || newsContent.selectedItemRelationship.Title.length == 0)
        newsContent.selectedItemRelationship.Title = newsContent.LinkModuleContentIdOtherSelector.filterText;

      for (var i = 0; i < newsContent.ModuleRelationShip.length; i++) {
        if (newsContent.ModuleRelationShip[i].Id == newsContent.LinkModuleContentIdOtherSelector.selectedItem.Id &&
          newsContent.ModuleRelationShip[i].LinkModuleContentIdOther == newsContent.selectedItemRelationship.ModuleNameOther.Value) {
          rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
          return;
        }
      }

      newsContent.ModuleRelationShip.push({
        Title: newsContent.selectedItemRelationship.Title,
        ModuleNameOther: newsContent.selectedItemRelationship.ModuleNameOther.Value,
        LinkModuleContentIdOther: newsContent.LinkModuleContentIdOtherSelector.selectedItem.Id,
        ModuleNameMain: ModuleRelationShipModuleNameMain,
        LinkModuleContentIdMain: newsContent.gridOptions.selectedRow.item.Id
      });
      newsContent.selectedItemRelationship = [];
      newsContent.LinkModuleContentIdOtherSelector.LinkModuleContentIdOther = 0;
    };

    newsContent.removeFromCollectionRelationShip = function (deleteItem) {
      for (var i = 0; i < newsContent.ModuleRelationShip.length; i++) {
        if (newsContent.ModuleRelationShip[i].LinkModuleContentIdOther == deleteItem.LinkModuleContentIdOther &&
          newsContent.ModuleRelationShip[i].ModuleNameOther == deleteItem.ModuleNameOther
        ) {
          newsContent.ModuleRelationShip.splice(i, 1);
          return;
        }
      }
    };
    newsContent.removeFromCollectionOtherInfo = function (deleteItem) {
      for (var i = 0; i < newsContent.OtherInfos.length; i++) {
        if (newsContent.OtherInfos[i].Id == deleteItem.Id) {
          newsContent.OtherInfos.splice(i, 1);
          return;
        }
      }
    };
    newsContent.removeFromCollectionSimilars = function (deleteItem) {
      for (var i = 0; i < newsContent.Similars.length; i++) {
        if (newsContent.Similars[i].Id == deleteItem.Id) {
          newsContent.Similars.splice(i, 1);
          return;
        }
      }
    };
    newsContent.editFromCollectionOtherInfo = function (editItem) {
      newsContent.todoModeTitle = $filter('translatentk')('edit_now');
      newsContent.editMode = true;
      newsContent.selectedItemOtherInfos = angular.copy(editItem);
      $scope.currentItemIndex = newsContent.OtherInfos.indexOf(editItem);
    };

    //#help otherInfo

    newsContent.editOtherInfo = function (y) {
      if (y == null || y == undefined || y.Title == "" || y.Title == undefined || y.HtmlBody == "" || y.HtmlBody == undefined) {
        rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
        return;
      }
      edititem = true;
      newsContent.selectedItemOtherInfos.Title = y.Title;
      newsContent.selectedItemOtherInfos.HtmlBody = y.HtmlBody;
      newsContent.selectedItemOtherInfos.Source = y.Source;
      newsContent.removeFromOtherInfo(newsContent.OtherInfos, y.Title, y.HtmlBody, y.Source);
    };
    newsContent.changSelectedRelationModuleAdd = function () {
      newsContent.LinkModuleContentIdOtherSelector.url = newsContent.selectedItemModuleRelationShip.ModuleNameOther.Key.split(/Wrapper(.+)/)[1];
      newsContent.LinkModuleContentIdOtherSelector.selectedItem = {};
      newsContent.selectedItem.LinkModuleContentIdOther = {};
    }
    newsContent.changSelectedRelationModuleEdit = function () {
      newsContent.LinkModuleContentIdOtherSelector.url = newsContent.selectedItemRelationship.ModuleNameOther.Key.split(/Wrapper(.+)/)[1];
      newsContent.LinkModuleContentIdOtherSelector.selectedItem = {};
      newsContent.selectedItem.LinkModuleContentIdOther = {};
    }
    newsContent.UrlContent = "";
    //news Grid Options
    newsContent.gridOptions = {
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
          template: '<li ng-if="!x.IsActivated" class="dropdown" dropdown="" style="display: initial;"><a aria-expanded="false" aria-haspopup="true" class="dropdown-toggle count-info" href="" dropdown-toggle=""><i class="fa fa-cog" ></i></a><ul class="dropdown-menu animated fadeInLeft m-t-xs" style="right: -142px;"><li><a ng-click="newsContent.addMenu()" style="color:black">AddMenu</a></li><li><a ng-click="newsContent.showComment(x.Id)" style="color:black">CommentList</a></li></ul></li>'
        }

      ],
      data: {},
      multiSelect: false,
      advancedSearchData: {
        engine: {}
      }
    };
    //Comment Grid Options
    newsContent.gridContentOptions = {
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
            '<Button ng-if="(x.RecordStatus!=1)" ng-click="newsContent.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتایید می کنم</Button>' +
            '<Button ng-if="(x.RecordStatus==1)" ng-click="newsContent.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspغیرفعال می کنم</Button>' +
            '<Button ng-click="newsContent.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>'
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
    newsContent.gridOptions.advancedSearchData.engine.Filters = null;
    newsContent.gridOptions.advancedSearchData.engine.Filters = [];

    //For Show Category Loading Indicator
    newsContent.categoryBusyIndicator = {
      isActive: true,
      message: "در حال بارگذاری دسته ها ..."
    };
    //For Show news Loading Indicator
    newsContent.contentBusyIndicator = {
      isActive: false,
      message: "در حال بارگذاری ..."
    };
    //Tree Config
    newsContent.treeConfig = {
      displayMember: "Title",
      displayId: "Id",
      displayChild: "Children"
    };

    //open addMenu modal
    newsContent.addMenu = function () {

      $modal.open({
        templateUrl: "cpanelv1/Modulenews/newsContent/modalMenu.html",
        scope: $scope
      });
    };

    newsContent.treeConfig.currentNode = {};
    newsContent.treeBusyIndicator = false;

    newsContent.addRequested = false;

    newsContent.showGridComment = false;
    newsContent.newsTitle = "";

    //init Function
    newsContent.init = function () {
      newsContent.categoryBusyIndicator.isActive = true;

      var engine = {};
      try {
        engine = newsContent.gridOptions.advancedSearchData.engine;
      } catch (error) {
        //console.log(error);
      }
      ajax.call(cmsServerConfig.configApiServerPath + "ModulesRelationshipContent/GetEnum", {}, 'POST').success(function (response) {
        rashaErManage.checkAction(response);
        newsContent.EnumModuleRelationshipName = response.ListItems;
        if (newsContent.EnumModuleRelationshipName && newsContent.EnumModuleRelationshipName.length) {
          var retFind = findWithAttr(newsContent.EnumModuleRelationshipName, "Key", "News_WrapperNewsContent");
          if (retFind >= 0)
            ModuleRelationShipModuleNameMain = newsContent.EnumModuleRelationshipName[retFind].Value;
        }
      }).error(function (data, errCode, c, d) {
        rashaErManage.checkAction(data, errCode);
      });
      newsContent.categoryBusyIndicator.isActive = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "newsCategory/getall", {
          RowPerPage: 1000
        }, "POST")
        .success(function (response) {
          rashaErManage.checkAction(response);
          newsContent.treeConfig.Items = response.ListItems;
          newsContent.categoryBusyIndicator.isActive = false;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
      filterModel = {
        PropertyName: "ContentTags",
        PropertyAnyName: "LinkTagId",
        SearchType: 0,
        IntValue1: newsContent.selectedContentId.Id
      };
      if (newsContent.selectedContentId.Id > 0)
        newsContent.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
      newsContent.contentBusyIndicator.isActive = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "newsContent/getall", newsContent.gridOptions.advancedSearchData.engine, "POST")
        .success(function (response) {
          rashaErManage.checkAction(response);
          newsContent.ListItems = response.ListItems;
          newsContent.gridOptions.fillData(
            newsContent.ListItems,
            response.resultAccess
          ); // Sending Access as an argument
          newsContent.contentBusyIndicator.isActive = false;
          newsContent.gridOptions.currentPageNumber =
            response.CurrentPageNumber;
          newsContent.gridOptions.totalRowCount = response.TotalRowCount;
          newsContent.gridOptions.rowPerPage = response.RowPerPage;
          newsContent.gridOptions.maxSize = 5;
        })
        .error(function (data, errCode, c, d) {
          newsContent.contentBusyIndicator.isActive = false;
          newsContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
          newsContent.contentBusyIndicator.isActive = false;
        });

      ajax.call(cmsServerConfig.configApiServerPath + "newsContentTag/GetViewModel", "", "GET").success(function (response) { //Get a ViewModel for newsContentTag
          newsContent.ModuleContentTag = response.Item;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);;
        });
    };
    newsContent.EnumModuleName = function (enumId) {
      if (!newsContent.EnumModuleRelationshipName || newsContent.EnumModuleRelationshipName.length == 0)
        return enumId;
      var retFind = findWithAttr(newsContent.EnumModuleRelationshipName, "Value", enumId);
      if (retFind < 0)
        return enumId;
      return newsContent.EnumModuleRelationshipName[retFind].Description;
    }
    // For Show Comments
    newsContent.showComment = function (LinkContentId) {
      //newsContent.contentBusyIndicator = true;
      engine = {};
      var filterValue = {
        PropertyName: "LinkContentId",
        IntValue1: parseInt(LinkContentId),
        SearchType: 0
      }
      newsContent.busyIndicatorForDropDownProcess = true;
      engine.Filters = null;
      engine.Filters = [];
      engine.Filters.push(filterValue);
      ajax.call(cmsServerConfig.configApiServerPath + "newscomment/getall", engine, 'POST').success(function (response) {
        rashaErManage.checkAction(response);
        newsContent.ListCommentItems = response.ListItems;
        newsContent.gridContentOptions.fillData(newsContent.ListCommentItems, response.resultAccess); // Sending Access as an argument
        newsContent.showGridComment = true;
        newsContent.gridContentOptions.currentPageNumber = response.CurrentPageNumber;
        newsContent.gridContentOptions.totalRowCount = response.TotalRowCount;
        newsContent.gridContentOptions.rowPerPage = response.RowPerPage;
        newsContent.gridContentOptions.maxSize = 5;
        $('html, body').animate({
          scrollTop: $("#ListComment").offset().top
        }, 850);
      }).error(function (data, errCode, c, d) {
        newsContent.gridContentOptions.fillData();
        rashaErManage.checkAction(data, errCode);
        newsContent.contentBusyIndicator.isActive = false;
      });
    };


    newsContent.gridContentOptions.onRowSelected = function () {};

    // Open Add Category Modal
    newsContent.addNewCategoryModel = function () {
      if (buttonIsPressed) {
        return;
      }
      newsContent.addRequested = false;
      buttonIsPressed = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "newsCategory/GetViewModel", "", "GET")
        .success(function (response) {
          buttonIsPressed = false;
          rashaErManage.checkAction(response);
          newsContent.selectedItem = response.Item;
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
              newsContent.dataForTheTree = response1.ListItems;
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
                    newsContent.dataForTheTree,
                    response2.ListItems
                  );
                  $modal.open({
                    templateUrl: "cpanelv1/ModuleNews/NewsCategory/add.html",
                    scope: $scope
                  });
                  newsContent.addRequested = false;
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
    newsContent.EditCategoryModel = function () {
      if (buttonIsPressed) {
        return;
      }
      newsContent.addRequested = false;
      //newsContent.modalTitle = ($filter('translatentk')('Edit_Category'));
      if (!newsContent.treeConfig.currentNode) {
        rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
        return;
      }

      newsContent.contentBusyIndicator.isActive = true;
      buttonIsPressed = true;
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "newsCategory/GetOne",
          newsContent.treeConfig.currentNode.Id,
          "GET"
        )
        .success(function (response) {
          buttonIsPressed = false;
          newsContent.contentBusyIndicator.isActive = false;
          rashaErManage.checkAction(response);
          newsContent.selectedItem = response.Item;
          //Set dataForTheTree
          newsContent.selectedNode = [];
          newsContent.expandedNodes = [];
          newsContent.selectedItem = response.Item;
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
              newsContent.dataForTheTree = response1.ListItems;
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
                    newsContent.dataForTheTree,
                    response2.ListItems
                  );
                  //Set selected files to treeControl
                  if (newsContent.selectedItem.LinkMainImageId > 0)
                    newsContent.onSelection({
                        Id: newsContent.selectedItem.LinkMainImageId
                      },
                      true
                    );
                  $modal.open({
                    templateUrl: "cpanelv1/ModuleNews/NewsCategory/edit.html",
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
    newsContent.Showstatistics = function () {
      if (!newsContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
        return;
      }
      ajax.call(cmsServerConfig.configApiServerPath + 'newsContent/GetOne', newsContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
        rashaErManage.checkAction(response1);
        newsContent.selectedItem = response1.Item;
        $modal.open({
          templateUrl: "cpanelv1/Modulenews/newsContent/statistics.html",
          scope: $scope
        });
      }).error(function (data, errCode, c, d) {
        rashaErManage.checkAction(data, errCode);
      });
    }

    // Add New Category
    newsContent.addNewCategory = function (frm) {
      if (frm.$invalid) return;
      newsContent.categoryBusyIndicator.isActive = true;
      newsContent.addRequested = true;
      newsContent.selectedItem.LinkParentId = null;
      if (newsContent.treeConfig.currentNode != null)
        newsContent.selectedItem.LinkParentId =
        newsContent.treeConfig.currentNode.Id;
      ajax
        .call(cmsServerConfig.configApiServerPath + "newsCategory/add", newsContent.selectedItem, "POST")
        .success(function (response) {
          newsContent.addRequested = false;
          rashaErManage.checkAction(response);

          if (response.IsSuccess) {
            newsContent.gridOptions.advancedSearchData.engine.Filters = null;
            newsContent.gridOptions.advancedSearchData.engine.Filters = [];
            newsContent.gridOptions.reGetAll();
            newsContent.closeModal();
          }
          newsContent.categoryBusyIndicator.isActive = false;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          newsContent.addRequested = false;
          newsContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Edit Category REST Api
    newsContent.EditCategory = function (frm) {
      if (frm.$invalid) return;
      newsContent.categoryBusyIndicator.isActive = true;
      newsContent.addRequested = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "newsCategory/edit", newsContent.selectedItem, "PUT")
        .success(function (response) {
          //newsContent.showbusy = false;
          newsContent.treeConfig.showbusy = false;
          newsContent.addRequested = false;
          rashaErManage.checkAction(response);
          if (response.IsSuccess) {
            newsContent.treeConfig.currentNode.Title = response.Item.Title;
            newsContent.closeModal();
          }
          newsContent.categoryBusyIndicator.isActive = false;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          newsContent.addRequested = false;
          newsContent.categoryBusyIndicator.isActive = false;
        });
    };

    // Delete a Category
    newsContent.deleteCategory = function () {
      if (buttonIsPressed) {
        return;
      }
      var node = newsContent.treeConfig.currentNode;
      if (node.Id == 0 || !node.Id) {
        rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
        return;
      }
      rashaErManage.showYesNo(
        ($filter('translatentk')('warning')),
        ($filter('translatentk')('do_you_want_to_delete_this_attribute')),
        function (isConfirmed) {
          if (isConfirmed) {
            newsContent.categoryBusyIndicator.isActive = true;
            buttonIsPressed = true;
            ajax
              .call(cmsServerConfig.configApiServerPath + "newsCategory/GetOne", node.Id, "GET")
              .success(function (response) {
                buttonIsPressed = false;
                rashaErManage.checkAction(response);
                newsContent.selectedItemForDelete = response.Item;
                ajax
                  .call(
                    cmsServerConfig.configApiServerPath + "newsCategory/delete",
                    newsContent.selectedItemForDelete,
                    "POST"
                  )
                  .success(function (res) {
                    newsContent.categoryBusyIndicator.isActive = false;
                    if (res.IsSuccess) {
                      newsContent.gridOptions.advancedSearchData.engine.Filters = null;
                      newsContent.gridOptions.advancedSearchData.engine.Filters = [];
                      newsContent.gridOptions.fillData();
                      newsContent.gridOptions.reGetAll();
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
                    newsContent.categoryBusyIndicator.isActive = false;
                  });
              })
              .error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                newsContent.categoryBusyIndicator.isActive = false;
              });
          }
        }
      );
    };

    //Tree On Node Select Options
    newsContent.treeConfig.onNodeSelect = function () {
      var node = newsContent.treeConfig.currentNode;
      newsContent.showGridComment = false;
      newsContent.selectContent(node);
    };
    //Show Content with Category Id
    newsContent.selectContent = function (node) {
      newsContent.gridOptions.advancedSearchData.engine.Filters = null;
      newsContent.gridOptions.advancedSearchData.engine.Filters = [];
      if (node != null && node != undefined) {
        newsContent.contentBusyIndicator.message =
          "در حال بارگذاری مقاله های  دسته " + node.Title;
        newsContent.contentBusyIndicator.isActive = true;
        //newsContent.gridOptions.advancedSearchData = {};
        newsContent.attachedFiles = [];
        var s = {
          PropertyName: "LinkCategoryId",
          IntValue1: node.Id,
          SearchType: 0
        };
        newsContent.gridOptions.advancedSearchData.engine.Filters.push(s);
      }
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "newsContent/getall",
          newsContent.gridOptions.advancedSearchData.engine,
          "POST"
        )
        .success(function (response) {
          rashaErManage.checkAction(response);
          newsContent.contentBusyIndicator.isActive = false;
          newsContent.ListItems = response.ListItems;
          newsContent.gridOptions.fillData(
            newsContent.ListItems,
            response.resultAccess
          ); // Sending Access as an argument
          newsContent.gridOptions.currentPageNumber =
            response.CurrentPageNumber;
          newsContent.gridOptions.totalRowCount = response.TotalRowCount;
          newsContent.gridOptions.rowPerPage = response.RowPerPage;
        })
        .error(function (data, errCode, c, d) {
          newsContent.contentBusyIndicator.isActive = false;
          newsContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Modal
    newsContent.addNewContentModel = function () {
      newsContent.selectedItemModuleRelationShip = [];
      newsContent.ModuleRelationShip = [];
      if (buttonIsPressed) {
        return;
      }
      var node = newsContent.treeConfig.currentNode;
      if (node.Id == 0 || !node.Id) {
        rashaErManage.showMessage($filter('translatentk')('to_add_a_news_please_select_the_category'));
        buttonIsPressed = false;
        return;
      }
      newsContent.selectedItemOtherInfos = {};
      newsContent.attachedFiles = [];
      newsContent.Similars = [];
      newsContent.SimilarsDb = [];
      newsContent.OtherInfos = [];
      newsContent.OtherInfosDb = [];
      newsContent.ModuleRelationShip = [];
      newsContent.ModuleRelationShipDb = [];

      newsContent.filePickerMainImage.filename = "";
      newsContent.filePickerMainImage.fileId = null;
      newsContent.filePickerFilePodcast.filename = "";
      newsContent.filePickerFilePodcast.fileId = null;
      newsContent.filePickerFileMovie.filename = "";
      newsContent.filePickerFileMovie.fileId = null;
      newsContent.filePickerFiles.filename = "";
      newsContent.filePickerFiles.fileId = null;
      newsContent.tags = []; //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
      newsContent.kwords = []; //tagsInput خالی کردن آرایه کلمات کلیدی برای محتوای جدید
      newsContent.addRequested = false;
      //newsContent.modalTitle = ($filter('translatentk')('Add_Content'));
      buttonIsPressed = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "newsContent/GetViewModel", "", "GET")
        .success(function (response) {
          buttonIsPressed = false;
          rashaErManage.checkAction(response);

          newsContent.selectedItem = response.Item;
          newsContent.OtherInfos = [];

          newsContent.selectedItem.LinkCategoryId = node.Id;
          newsContent.selectedItem.LinkFileIds = null;

          $modal.open({
            templateUrl: "cpanelv1/Modulenews/newsContent/add.html",
            scope: $scope
          });
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };


    newsContent.SimilarsSelectedItem = {};
    newsContent.moveSelected = function (from, to, calculatePrice) {
      if (from == "Content") {
        if (
          newsContent.selectedItem.Id != undefined &&
          newsContent.selectedItem.Id != null
        ) {
          if (newsContent.Similars == undefined)
            newsContent.Similars = [];

          for (var i = 0; i < newsContent.Similars.length; i++) {
            if (newsContent.Similars[i].Id == newsContent.SimilarsSelector.selectedItem.Id) {
              rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
              return;
            }
          }
          newsContent.Similars.push(newsContent.SimilarsSelector.selectedItem);
        }
      }
    };

    newsContent.moveSelectedOtherInfo = function (from, to, y) {
      if (newsContent.OtherInfos == undefined)
        newsContent.OtherInfos = [];
      for (var i = 0; i < newsContent.OtherInfos.length; i++) {

        if (newsContent.OtherInfos[i].Title == newsContent.selectedItemOtherInfos.Title && newsContent.OtherInfos[i].HtmlBody == newsContent.selectedItemOtherInfos.HtmlBody && newsContent.OtherInfos[i].Source == newsContent.selectedItemOtherInfos.Source) {
          rashaErManage.showMessage($filter('translatentk')('Information_Is_Duplicate'));
          return;
        }
      }
      if (newsContent.selectedItemOtherInfos.Title == "" && newsContent.selectedItemOtherInfos.Source == "" && newsContent.selectedItemOtherInfos.HtmlBody == "") {
        rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
      } else if (newsContent.selectedItemOtherInfos.TypeId == "" || !Number.isInteger(newsContent.selectedItemOtherInfos.TypeId)) {
        rashaErManage.showMessage($filter('translatentk')('در فیلد نوع مقدار عددی وارد کنید'));
      } else {

        newsContent.OtherInfos.push({
          Title: newsContent.selectedItemOtherInfos.Title,
          HtmlBody: newsContent.selectedItemOtherInfos.HtmlBody,
          Source: newsContent.selectedItemOtherInfos.Source
        });
        newsContent.selectedItemOtherInfos.Title = "";
        newsContent.selectedItemOtherInfos.Source = "";
        newsContent.selectedItemOtherInfos.HtmlBody = "";
      }
      if (edititem) {
        edititem = false;
      }

    };
    //#help otherInfo
    newsContent.selectedItemOtherInfos = {};
    newsContent.todoModeTitle = $filter('translatentk')('ADD_NOW');
    newsContent.saveOtherInfos = function () {

      if (newsContent.editMode) {
        if (newsContent.selectedItemOtherInfos.Title == "" ||
          newsContent.selectedItemOtherInfos.Title == undefined ||
          newsContent.selectedItemOtherInfos.HtmlBody == "" ||
          newsContent.selectedItemOtherInfos.HtmlBody == undefined) {
          rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
          return;
        }
        newsContent.selectedItemOtherInfos.Edited = true;
        $scope.currentItem = newsContent.selectedItemOtherInfos;
        newsContent.OtherInfos[$scope.currentItemIndex] = newsContent.selectedItemOtherInfos;
        newsContent.editMode = false;


      } else { //add New
        if (newsContent.selectedItemOtherInfos.Title == "" ||
          newsContent.selectedItemOtherInfos.Title == undefined ||
          newsContent.selectedItemOtherInfos.HtmlBody == "" ||
          newsContent.selectedItemOtherInfos.HtmlBody == undefined) {
          rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
          return;
        }
        newsContent.selectedItemOtherInfos.LinkContentId = newsContent.gridOptions.selectedRow.item.Id;
        newsContent.OtherInfos.push(newsContent.selectedItemOtherInfos);
        newsContent.selectedItemOtherInfos = {};
        // ajax.call(cmsServerConfig.configApiServerPath + 'newsContentOtherInfo/add', newsContent.selectedItemOtherInfos, 'POST').success(function (response) {
        //   rashaErManage.checkAction(response);
        //   if (response.IsSuccess) {
        //     newsContent.selectedItemOtherInfos = response.Item;
        //     mainLIst.push(newsContent.selectedItemOtherInfos);
        //     newsContent.selectedItemOtherInfos = {};
        //   }
        // }).error(function (data, errCode, c, d) {
        //   rashaErManage.checkAction(data, errCode);
        // });

      }
      newsContent.selectedItemOtherInfos = {};
      newsContent.todoModeTitle = $filter('translatentk')('add_now');
    };




    //#help
    // Open Edit Content Modal
    newsContent.openEditModel = function () {
      newsContent.attachedFiles = [];
      newsContent.Similars = [];
      newsContent.SimilarsDb = [];
      newsContent.OtherInfos = [];
      newsContent.ModuleRelationShip = [];
      newsContent.selectedItemModuleRelationShip = [];
      newsContent.ModuleRelationShipDb = [];
      newsContent.tags = []; //Clear out previous tags
      newsContent.selectedItemRelationship = [];
      if (buttonIsPressed) {
        return;
      }

      newsContent.showComment(newsContent.gridOptions.selectedRow.item.Id)
      newsContent.addRequested = false;
      //newsContent.modalTitle = ($filter('translatentk')('Edit_Content'));
      if (!newsContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
        return;
      }
      if (newsContent.gridOptions.selectedRow.item.LinkSiteId != $rootScope.tokenInfo.Item.SiteId && !$rootScope.tokenInfo.Item.UserAccessAdminAllowToAllData) {
        rashaErManage.showMessage($filter('translatentk')('This_News_Is_Shared'));
        return;
      }
      newsContent.selectedItemOtherInfos = {};
      buttonIsPressed = true;
      ajax.call(cmsServerConfig.configApiServerPath + "newsContent/GetOne", newsContent.gridOptions.selectedRow.item.Id, "GET")
        .success(function (response1) {
          buttonIsPressed = false;
          rashaErManage.checkAction(response1);
          newsContent.selectedItem = response1.Item;


          //newsContent.FromDate.defaultDate = newsContent.selectedItem.FromDate;
          //newsContent.ExpireDate.defaultDate = newsContent.selectedItem.ExpireDate;
          newsContent.filePickerMainImage.filename = null;
          newsContent.filePickerMainImage.fileId = null;
          newsContent.filePickerFilePodcast.filename = null;
          newsContent.filePickerFilePodcast.fileId = null;
          newsContent.filePickerFileMovie.filename = null;
          newsContent.filePickerFileMovie.fileId = null;
          //NewsContentOtherInfo
          var engineOtherInfo = {};
          var filterValue = {
            PropertyName: "LinkContentId",
            IntValue1: newsContent.gridOptions.selectedRow.item.Id,
            SearchType: 0
          }
          engineOtherInfo.Filters = null;
          engineOtherInfo.Filters = [];
          engineOtherInfo.Filters.push(filterValue);
          ajax.call(cmsServerConfig.configApiServerPath + "NewsContentOtherInfo/GetAll", engineOtherInfo, "POST")
            .success(function (responseOtherInfos) {
              newsContent.OtherInfosDb = responseOtherInfos.ListItems;
              newsContent.OtherInfos = angular.extend(newsContent.OtherInfos, responseOtherInfos.ListItems);
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });

          ajax.call(cmsServerConfig.configApiServerPath + "NewsContentTag/GetAll", engineOtherInfo, "POST")
            .success(function (responsetag) {
              newsContent.selectedItem.ContentTags = responsetag.ListItems;

              //Load tagsInput
              if (newsContent.selectedItem.ContentTags == null)
                newsContent.selectedItem.ContentTags = [];
              $.each(newsContent.selectedItem.ContentTags, function (index, item) {
                if (item.virtual_ModuleTag != null)
                  newsContent.tags.push({
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
          ajax.call(cmsServerConfig.configApiServerPath + "NewsContent/GetAllWithSimilarsId/" + newsContent.gridOptions.selectedRow.item.Id, engineSimilars, "POST")
            .success(function (responseSimilars) {
              newsContent.SimilarsDb = responseSimilars.ListItems;
              newsContent.Similars = angular.extend(newsContent.Similars, responseSimilars.ListItems);
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          var RelationshipModel = {
            Id: newsContent.gridOptions.selectedRow.item.Id,
            enumValue: ModuleRelationShipModuleNameMain
          };
          ajax.call(cmsServerConfig.configApiServerPath + 'ModulesRelationshipContent/GetAllByContentId', RelationshipModel, 'POST')
            .success(function (responseModuleRelationShip) {
              newsContent.ModuleRelationShipDb = responseModuleRelationShip.ListItems;
              newsContent.ModuleRelationShip = angular.extend(newsContent.ModuleRelationShip, responseModuleRelationShip.ListItems);
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          //NewsContentOtherInfo
          if (response1.Item.LinkMainImageId != null) {
            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", response1.Item.LinkMainImageId, "GET")
              .success(function (response2) {
                buttonIsPressed = false;
                newsContent.filePickerMainImage.filename =
                  response2.Item.FileName;
                newsContent.filePickerMainImage.fileId = response2.Item.Id;
              })
              .error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
              });
          }
          if (response1.Item.LinkFilePodcastId != null) {
            ajax.call(cmsServerConfig.configApiServerPath + 'FileContent/GetOne', response1.Item.LinkFilePodcastId, 'GET').success(function (response2) {
              newsContent.filePickerFilePodcast.filename = response2.Item.FileName;
              newsContent.filePickerFilePodcast.fileId = response2.Item.Id
            }).error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          }
          if (response1.Item.LinkFileMovieId != null) {
            ajax.call(cmsServerConfig.configApiServerPath + 'FileContent/GetOne', response1.Item.LinkFileMovieId, 'GET').success(function (response2) {
              newsContent.filePickerFileMovie.filename = response2.Item.FileName;
              newsContent.filePickerFileMovie.fileId = response2.Item.Id
            }).error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          }

          //link to other module
          newsContent.parseFileIds(response1.Item.LinkFileIds);
          newsContent.filePickerFiles.filename = null;
          newsContent.filePickerFiles.fileId = null;

          //Load Keywords tagsInput
          newsContent.kwords = []; //Clear out previous tags
          var arraykwords = [];
          if (
            newsContent.selectedItem.Keyword != null &&
            newsContent.selectedItem.Keyword != ""
          )
            arraykwords = newsContent.selectedItem.Keyword.split(",");
          $.each(arraykwords, function (index, item) {
            if (item != null) newsContent.kwords.push({
              text: item
            }); //Add current content's tag to tags array with id and title
          });
          $modal.open({
            templateUrl: "cpanelv1/Modulenews/newsContent/edit.html",
            scope: $scope
          });
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };



    // Add New Content
    newsContent.addNewContent = function (frm) {
      if (frm.$invalid) return;
      newsContent.categoryBusyIndicator.isActive = true;
      newsContent.addRequested = true;

      //Save attached file ids into newsContent.selectedItem.LinkFileIds
      newsContent.selectedItem.LinkFileIds = "";
      newsContent.stringfyLinkFileIds();
      //Save Keywords
      $.each(newsContent.kwords, function (index, item) {
        if (index == 0) newsContent.selectedItem.Keyword = item.text;
        else newsContent.selectedItem.Keyword += "," + item.text;
      });
      if (
        newsContent.selectedItem.LinkCategoryId == null ||
        newsContent.selectedItem.LinkCategoryId == 0
      ) {
        rashaErManage.showMessage($filter('translatentk')('to_add_a_news_please_select_the_category'));
        return;
      }
      var apiSelectedItem = newsContent.selectedItem;

      ajax.call(cmsServerConfig.configApiServerPath + "newsContent/add", apiSelectedItem, "POST").success(function (response) {
          rashaErManage.checkAction(response);
          newsContent.categoryBusyIndicator.isActive = false;
          if (response.IsSuccess) {
            newsContent.selectedItem.LinkSourceId = newsContent.selectedItem.Id;

            newsContent.ListItems.unshift(response.Item);
            newsContent.gridOptions.fillData(newsContent.ListItems);
            newsContent.closeModal();
            //Save inputTags

            $.each(newsContent.tags, function (index, item) {
              if (item.id > 0) {
                item.LinkTagId = item.id;
                item.LinkContentId = response.Item.Id;
              }
            });
            ajax.call(cmsServerConfig.configApiServerPath + "newsContentTag/addbatch", newsContent.tags, "POST").success(function (response) {
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
          newsContent.addRequested = false;
          newsContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Edit Content
    newsContent.editContent = function (frm) {
      if (frm.$invalid) return;
      newsContent.categoryBusyIndicator.isActive = true;
      newsContent.addRequested = true;
      //Save attached file ids into newsContent.selectedItem.LinkFileIds
      newsContent.selectedItem.LinkFileIds = "";
      newsContent.stringfyLinkFileIds();
      //Save Keywords
      $.each(newsContent.kwords, function (index, item) {
        if (index == 0) newsContent.selectedItem.Keyword = item.text;
        else newsContent.selectedItem.Keyword += "," + item.text;
      });




      //Save inputTags
      $.each(newsContent.tags, function (index, item) {
        if (item.id > 0) {
          item.LinkTagId = item.id;
          item.LinkContentId = newsContent.selectedItem.Id;
        }
      });
      newsContent.ContentTagsRemoved = differenceInFirstArray(newsContent.selectedItem.ContentTags, newsContent.tags, 'LinkTagId');
      newsContent.ContentTagsAdded = differenceInFirstArray(newsContent.tags, newsContent.selectedItem.ContentTags, 'LinkTagId');
      //remove
      if (newsContent.ContentTagsRemoved && newsContent.ContentTagsRemoved.length > 0) {
        ajax.call(cmsServerConfig.configApiServerPath + "newsContentTag/DeleteList", newsContent.ContentTagsRemoved, "Delete").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //Add
      if (newsContent.ContentTagsAdded && newsContent.ContentTagsAdded.length > 0) {
        ajax.call(cmsServerConfig.configApiServerPath + "newsContentTag/addbatch", newsContent.ContentTagsAdded, "POST").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      ///Save inputTags
      ///Save OtherInfos
      newsContent.ContentOtherInfosRemoved = differenceInFirstArray(newsContent.OtherInfosDb, newsContent.OtherInfos, 'Id');
      newsContent.ContentOtherInfosAdded = differenceInFirstArray(newsContent.OtherInfos, newsContent.OtherInfosDb, 'Id');
      newsContent.ContentOtherInfosEdit = [];
      $.each(newsContent.OtherInfos, function (index, item) {
        if (item.Edited && item.Id && item.Id > 0)
          newsContent.ContentOtherInfosEdit.push(item);
      });

      //remove
      if (newsContent.ContentOtherInfosRemoved && newsContent.ContentOtherInfosRemoved.length > 0) {
        var OtherInfosRemovedModel = [];
        $.each(newsContent.ContentOtherInfosRemoved, function (index, item) {
          OtherInfosRemovedModel.push(item);
        });
        ajax.call(cmsServerConfig.configApiServerPath + "newsContentOtherInfo/DeleteList", OtherInfosRemovedModel, "Delete").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //Add
      if (newsContent.ContentOtherInfosAdded && newsContent.ContentOtherInfosAdded.length > 0) {
        var OtherInfosAddModel = [];
        $.each(newsContent.ContentOtherInfosAdded, function (index, item) {
          OtherInfosAddModel.push(item);
        });
        ajax.call(cmsServerConfig.configApiServerPath + "newsContentOtherInfo/addbatch", OtherInfosAddModel, "POST").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //edit
      if (newsContent.ContentOtherInfosEdit && newsContent.ContentOtherInfosEdit.length > 0) {
        ajax.call(cmsServerConfig.configApiServerPath + "newsContentOtherInfo/editbatch", newsContent.ContentOtherInfosEdit, "PUT").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //edit
      ///Save OtherInfos
      ///Save Similars
      newsContent.ContentSimilarsRemoved = differenceInFirstArray(newsContent.SimilarsDb, newsContent.Similars, 'Id');
      newsContent.ContentSimilarsAdded = differenceInFirstArray(newsContent.Similars, newsContent.SimilarsDb, 'Id');
      //remove
      if (newsContent.ContentSimilarsRemoved && newsContent.ContentSimilarsRemoved.length > 0) {
        var SimilarsRemovedModel = [];
        $.each(newsContent.ContentSimilarsRemoved, function (index, item) {
          SimilarsRemovedModel.push({
            LinkSourceId: newsContent.selectedItem.Id,
            LinkDestinationId: item.Id
          });
        });
        ajax.call(cmsServerConfig.configApiServerPath + "newsContentSimilar/DeleteList", SimilarsRemovedModel, "Delete").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //Add
      if (newsContent.ContentSimilarsAdded && newsContent.ContentSimilarsAdded.length > 0) {
        var SimilarsAddModel = [];
        $.each(newsContent.ContentSimilarsAdded, function (index, item) {
          SimilarsAddModel.push({
            LinkSourceId: newsContent.selectedItem.Id,
            LinkDestinationId: item.Id
          });
        });
        ajax.call(cmsServerConfig.configApiServerPath + "newsContentSimilar/addbatch", SimilarsAddModel, "POST").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      ///Save Similars

      ///Save ModulesRelationship
      newsContent.ContentModuleRelationShipRemoved = differenceInFirstArray(newsContent.ModuleRelationShipDb, newsContent.ModuleRelationShip, '');
      newsContent.ContentModuleRelationShipAdded = differenceInFirstArray(newsContent.ModuleRelationShip, newsContent.ModuleRelationShipDb, '');
      //remove
      if (newsContent.ContentModuleRelationShipRemoved && newsContent.ContentModuleRelationShipRemoved.length > 0) {

        ajax.call(cmsServerConfig.configApiServerPath + "ModulesRelationshipContent/DeleteList", newsContent.ContentModuleRelationShipRemoved, "Delete").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //Add
      if (newsContent.ContentModuleRelationShipAdded && newsContent.ContentModuleRelationShipAdded.length > 0) {

        ajax.call(cmsServerConfig.configApiServerPath + "ModulesRelationshipContent/addbatch", newsContent.ContentModuleRelationShipAdded, "POST").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      ///Save ModulesRelationship
      if (
        newsContent.selectedItem.LinkCategoryId == null ||
        newsContent.selectedItem.LinkCategoryId == 0
      ) {
        rashaErManage.showMessage($filter('translatentk')('to_add_a_news_please_select_the_category'));
        return;
      }
      var apiSelectedItem = {};
      apiSelectedItem = angular.extend(apiSelectedItem, newsContent.selectedItem);
      apiSelectedItem.OtherInfos = [];
      ajax
        .call(cmsServerConfig.configApiServerPath + "newsContent/edit", apiSelectedItem, "PUT")
        .success(function (response) {
          newsContent.categoryBusyIndicator.isActive = false;
          newsContent.addRequested = false;
          newsContent.treeConfig.showbusy = false;
          newsContent.showIsBusy = false;
          rashaErManage.checkAction(response);
          if (response.IsSuccess) {
            newsContent.replaceItem(newsContent.selectedItem.Id, response.Item);
            newsContent.gridOptions.fillData(newsContent.ListItems);
            newsContent.closeModal();
          }
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          newsContent.addRequested = false;
          newsContent.categoryBusyIndicator.isActive = false;
        });


    };








    // Delete a news Content
    newsContent.deleteContent = function () {
      if (buttonIsPressed) {
        return;
      }
      if (!newsContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
        //rashaErManage.showMessage($filter('translatentk')('Tag'));
        return;
      }
      newsContent.treeConfig.showbusy = true;
      newsContent.showIsBusy = true;
      rashaErManage.showYesNo(
        ($filter('translatentk')('warning')),
        ($filter('translatentk')('do_you_want_to_delete_this_attribute')),
        function (isConfirmed) {
          if (isConfirmed) {
            newsContent.categoryBusyIndicator.isActive = true;
            newsContent.showbusy = true;
            newsContent.showIsBusy = true;
            buttonIsPressed = true;
            ajax
              .call(
                cmsServerConfig.configApiServerPath + "newsContent/GetOne",
                newsContent.gridOptions.selectedRow.item.Id,
                "GET"
              )
              .success(function (response) {
                buttonIsPressed = false;
                newsContent.showbusy = false;
                newsContent.showIsBusy = false;
                rashaErManage.checkAction(response);
                newsContent.selectedItemForDelete = response.Item;
                ajax
                  .call(
                    cmsServerConfig.configApiServerPath + "newsContent/delete",
                    newsContent.selectedItemForDelete,
                    "POST"
                  )
                  .success(function (res) {
                    newsContent.categoryBusyIndicator.isActive = false;
                    newsContent.treeConfig.showbusy = false;
                    newsContent.showIsBusy = false;
                    rashaErManage.checkAction(res);
                    if (res.IsSuccess) {
                      newsContent.replaceItem(
                        newsContent.selectedItemForDelete.Id
                      );
                      newsContent.gridOptions.fillData(newsContent.ListItems);
                    }
                  })
                  .error(function (data2, errCode2, c2, d2) {
                    rashaErManage.checkAction(data2);
                    newsContent.treeConfig.showbusy = false;
                    newsContent.showIsBusy = false;
                    newsContent.categoryBusyIndicator.isActive = false;
                  });
              })
              .error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                newsContent.treeConfig.showbusy = false;
                newsContent.showIsBusy = false;
                newsContent.categoryBusyIndicator.isActive = false;
              });
          }
        }
      );
    };

    //Confirm/UnConfirm news Content
    newsContent.confirmUnConfirmnewsContent = function () {
      if (!newsContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
        return;
      }
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "newsContent/GetOne",
          newsContent.gridOptions.selectedRow.item.Id,
          "GET"
        )
        .success(function (response) {
          rashaErManage.checkAction(response);
          newsContent.selectedItem = response.Item;
          newsContent.selectedItem.IsAccepted = response.Item.IsAccepted == true ?
            false :
            true;
          ajax
            .call(cmsServerConfig.configApiServerPath + "newsContent/edit", newsContent.selectedItem, "PUT")
            .success(function (response2) {
              rashaErManage.checkAction(response2);
              if (response2.IsSuccess) {
                var index = newsContent.ListItems.indexOf(
                  newsContent.gridOptions.selectedRow.item
                );
                if (index !== -1) {
                  newsContent.ListItems[index] = response2.Item;
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
    newsContent.enableArchive = function () {
      if (!newsContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
        return;
      }

      ajax
        .call(
          cmsServerConfig.configApiServerPath + "newsContent/GetOne",
          newsContent.gridOptions.selectedRow.item.Id,
          "GET"
        )
        .success(function (response) {
          rashaErManage.checkAction(response);
          newsContent.selectedItem = response.Item;
          newsContent.selectedItem.IsArchive = response.Item.IsArchive == true ?
            false :
            true;
          ajax
            .call(cmsServerConfig.configApiServerPath + "newsContent/edit", newsContent.selectedItem, "PUT")
            .success(function (response2) {
              newsContent.categoryBusyIndicator.isActive = true;
              rashaErManage.checkAction(response2);
              if (response2.IsSuccess) {
                var index = newsContent.ListItems.indexOf(
                  newsContent.gridOptions.selectedRow.item
                );
                if (index !== -1) {
                  newsContent.ListItems[index] = response2.Item;
                }
                newsContent.categoryBusyIndicator.isActive = false;
              }
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
              newsContent.categoryBusyIndicator.isActive = false;
            });
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          newsContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Replace Item OnDelete/OnEdit Grid Options
    newsContent.replaceItem = function (oldId, newItem) {
      angular.forEach(newsContent.ListItems, function (item, key) {
        if (item.Id == oldId) {
          var index = newsContent.ListItems.indexOf(item);
          newsContent.ListItems.splice(index, 1);
        }
      });
      if (newItem) newsContent.ListItems.unshift(newItem);
    };

    newsContent.summernoteOptions = {
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

    //newsContent.summernoteText = '<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />';

    newsContent.searchData = function () {
      newsContent.categoryBusyIndicator.isActive = true;
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "newsContent/getall",
          newsContent.gridOptions.advancedSearchData.engine,
          "POST"
        )
        .success(function (response) {
          rashaErManage.checkAction(response);
          newsContent.categoryBusyIndicator.isActive = false;
          newsContent.ListItems = response.ListItems;
          newsContent.gridOptions.fillData(newsContent.ListItems);
          newsContent.gridOptions.currentPageNumber =
            response.CurrentPageNumber;
          newsContent.gridOptions.totalRowCount = response.TotalRowCount;
          newsContent.gridOptions.rowPerPage = response.RowPerPage;
          newsContent.allowedSearch = response.AllowedSearchField;
        })
        .error(function (data, errCode, c, d) {
          newsContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
        });
    };

    //Close Model Stack
    newsContent.addRequested = false;
    newsContent.closeModal = function () {
      $modalStack.dismissAll();
    };

    newsContent.showIsBusy = false;

    //Aprove a comment
    newsContent.confirmComment = function (item) {
      if (item.Id && item.Id > 0) {
        item.RecordStatus = 1;
        var itemCopy = angular.copy(item);
        itemCopy.rowOption = null;
        ajax.call(cmsServerConfig.configApiServerPath + 'NewsComment/edit', itemCopy, 'PUT').success(function (response) {
          rashaErManage.checkAction(response);
          if(response.IsSuccess)
          newsContent.showComment(newsContent.gridOptions.selectedRow.item.Id)
        }).error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
      }
    };

    //Decline a comment
    newsContent.doNotConfirmComment = function (item) {
      if (item.Id && item.Id > 0) {
        item.RecordStatus = 5;//DeniedConfirmed
        var itemCopy = angular.copy(item);
        itemCopy.rowOption = null;
        ajax.call(cmsServerConfig.configApiServerPath + 'NewsComment/edit', itemCopy, 'PUT').success(function (response) {
          if(response.IsSuccess)
          newsContent.showComment(newsContent.gridOptions.selectedRow.item.Id)
          rashaErManage.checkAction(response);
        }).error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
      }
    };
    //Remove a comment
    newsContent.deleteComment = function (item) {
      if (!item) {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
        return;
      }
      newsContent.treeConfig.showbusy = true;
      newsContent.showIsBusy = true;
      rashaErManage.showYesNo(
        ($filter('translatentk')('warning')),
        "آیا می خواهید این نظر را حذف کنید",
        function (isConfirmed) {
          if (isConfirmed) {

            newsContent.treeConfig.showbusy = true;
            newsContent.showbusy = true;
            newsContent.showIsBusy = true;

            var itemCopy = angular.copy(item);
            itemCopy.rowOption = null;
            ajax.call(cmsServerConfig.configApiServerPath + "newsComment/delete", itemCopy, "POST")
              .success(function (res) {
                newsContent.treeConfig.showbusy = false;
                newsContent.showbusy = false;
                newsContent.showIsBusy = false;
                rashaErManage.checkAction(res);
                if (res.IsSuccess) {
                  newsContent.showComment(newsContent.gridOptions.selectedRow.item.Id)
                  
                }
              })
              .error(function (data2, errCode2, c2, d2) {
                rashaErManage.checkAction(data2);
                newsContent.treeConfig.showbusy = false;
                newsContent.showbusy = false;
                newsContent.showIsBusy = false;
              });

          }
        }
      );
    };

    //For reInit Categories
    newsContent.gridOptions.reGetAll = function () {
      if (newsContent.gridOptions.advancedSearchData.engine.Filters.length > 0)
        newsContent.searchData();
      else newsContent.init();
    };

    newsContent.isCurrentNodeEmpty = function () {
      return !angular.equals({}, newsContent.treeConfig.currentNode);
    };

    newsContent.loadFileAndFolder = function (item) {
      newsContent.treeConfig.currentNode = item;
      newsContent.treeConfig.onNodeSelect(item);
    };

    newsContent.openDate = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $timeout(function () {
        newsContent.focus = true;
      });
    };
    newsContent.openDate1 = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $timeout(function () {
        newsContent.focus1 = true;
      });
    };

    newsContent.columnCheckbox = false;
    newsContent.openGridConfigModal = function () {
      $("#gridView-btn").toggleClass("active");
      var prechangeColumns = newsContent.gridOptions.columns;
      if (newsContent.gridOptions.columnCheckbox) {
        for (var i = 0; i < newsContent.gridOptions.columns.length; i++) {
          //newsContent.gridOptions.columns[i].visible = $("#" + newsContent.gridOptions.columns[i].Id + "Checkbox").is(":checked");
          var element = $(
            "#" +
            newsContent.gridOptions.columns[i].name.replace(".", "") +
            "Checkbox"
          );
          var temp = element[0].checked;
          newsContent.gridOptions.columns[i].visible = temp;
        }
      } else {
        for (var i = 0; i < newsContent.gridOptions.columns.length; i++) {
          var element = $(
            "#" +
            newsContent.gridOptions.columns[i].name.replace(".", "") +
            "Checkbox"
          );
          $(
              "#" + newsContent.gridOptions.columns[i].name + "Checkbox"
            ).checked =
            prechangeColumns[i].visible;
        }
      }
      for (var i = 0; i < newsContent.gridOptions.columns.length; i++) {

      }
      newsContent.gridOptions.columnCheckbox = !newsContent.gridOptions
        .columnCheckbox;
    };

    newsContent.deleteAttachedFile = function (index) {
      newsContent.attachedFiles.splice(index, 1);
    };

    newsContent.addAttachedFile = function (id) {
      var fname = $("#file" + id).text();
      if (
        id != null &&
        id != undefined &&
        !newsContent.alreadyExist(id, newsContent.attachedFiles) &&
        fname != null &&
        fname != ""
      ) {
        var fId = id;
        var file = {
          id: fId,
          name: fname
        };
        newsContent.attachedFiles.push(file);
        if (document.getElementsByName("file" + id).length > 1)
          document.getElementsByName("file" + id)[1].textContent = "";
        else document.getElementsByName("file" + id)[0].textContent = "";
      }
    };

    newsContent.alreadyExist = function (id, array) {
      for (var i = 0; i < array.length; i++) {
        if (id == array[i].fileId) {
          rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
          return true;
        }
      }
      return false;
    };

    newsContent.filePickerMainImage.removeSelectedfile = function (config) {
      newsContent.filePickerMainImage.fileId = null;
      newsContent.filePickerMainImage.filename = null;
      newsContent.selectedItem.LinkMainImageId = null;
    };
    newsContent.filePickerFilePodcast.removeSelectedfile = function (config) {
      newsContent.filePickerFilePodcast.fileId = null;
      newsContent.filePickerFilePodcast.filename = null;
      newsContent.selectedItem.LinkFilePodcastId = null;

    }
    newsContent.filePickerFileMovie.removeSelectedfile = function (config) {
      newsContent.filePickerFileMovie.fileId = null;
      newsContent.filePickerFileMovie.filename = null;
      newsContent.selectedItem.LinkFileMovieId = null;

    }
    newsContent.filePickerFiles.removeSelectedfile = function (config) {
      newsContent.filePickerFiles.fileId = null;
      newsContent.filePickerFiles.filename = null;
    };

    newsContent.showUpload = function () {
      $("#fastUpload").fadeToggle();
    };

    // ----------- FilePicker Codes --------------------------------
    newsContent.addAttachedFile = function (id) {
      var fname = $("#file" + id).text();
      if (fname == "") {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
        return;
      }
      if (
        id != null &&
        id != undefined &&
        !newsContent.alreadyExist(id, newsContent.attachedFiles)
      ) {
        var fId = id;
        var file = {
          fileId: fId,
          filename: fname,
          previewImageSrc: cmsServerConfig.configPathFileByIdAndName + fId + "/" + fname
        };
        newsContent.attachedFiles.push(file);
        newsContent.clearfilePickers();
      }
    };

    newsContent.alreadyExist = function (fieldId, array) {
      for (var i = 0; i < array.length; i++) {
        if (fieldId == array[i].fileId) {
          rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
          newsContent.clearfilePickers();
          return true;
        }
      }
      return false;
    };

    newsContent.deleteAttachedfieldName = function (index) {
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "newsContent/delete",
          newsContent.contractsList[index],
          "POST"
        )
        .success(function (res) {
          rashaErManage.checkAction(res);
          if (res.IsSuccess) {
            newsContent.contractsList.splice(index, 1);
            rashaErManage.showMessage($filter('translatentk')('Removed_Successfully'));
          }
        })
        .error(function (data2, errCode2, c2, d2) {
          rashaErManage.checkAction(data2);
        });
    };

    newsContent.parseFileIds = function (stringOfIds) {
      if (stringOfIds == null || !stringOfIds.trim()) return;
      var fileIds = stringOfIds.split(",");
      if (fileIds.length != undefined) {
        $.each(fileIds, function (index, item) {
          if (item == parseInt(item, 10)) {
            // Check if item is an integer
            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", parseInt(item), "GET").success(function (response) {
                if (response.IsSuccess) {
                  newsContent.attachedFiles.push({
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

    newsContent.clearfilePickers = function () {
      newsContent.filePickerFiles.fileId = null;
      newsContent.filePickerFiles.filename = null;
    };

    newsContent.stringfyLinkFileIds = function () {
      $.each(newsContent.attachedFiles, function (i, item) {
        if (newsContent.selectedItem.LinkFileIds == "")
          newsContent.selectedItem.LinkFileIds = item.fileId;
        else newsContent.selectedItem.LinkFileIds += "," + item.fileId;
      });
    };
    //--------- End FilePickers Codes -------------------------

    //---------------Upload Modal-------------------------------
    newsContent.openUploadModal = function () {
      $modal.open({
        templateUrl: "cpanelv1/Modulenews/newsContent/upload_modal.html",
        size: "lg",
        scope: $scope
      });

      newsContent.FileList = [];
      //get list of file from category id
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", {}, "POST")
        .success(function (response) {
          newsContent.FileList = response.ListItems;
        })
        .error(function (data) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    //---------------Upload Modal Podcast-------------------------------
    newsContent.openUploadModalPodcast = function () {
      $modal.open({
        templateUrl: 'cpanelv1/Modulenews/newsContent/upload_modalPodcast.html',
        size: 'lg',
        scope: $scope
      });

      newsContent.FileList = [];
      //get list of file from category id
      ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
        newsContent.FileList = response.ListItems;
      }).error(function (data) {
        rashaErManage.checkAction(data, errCode);
      });

    }
    //---------------Upload Modal Movie-------------------------------
    newsContent.openUploadModalMovie = function () {
      $modal.open({
        templateUrl: 'cpanelv1/Modulenews/newsContent/upload_modalMovie.html',
        size: 'lg',
        scope: $scope
      });

      newsContent.FileList = [];
      //get list of file from category id
      ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
        newsContent.FileList = response.ListItems;
      }).error(function (data) {
        rashaErManage.checkAction(data, errCode);
      });

    }

    newsContent.calcuteProgress = function (progress) {
      wdth = Math.floor(progress * 100);
      return wdth;
    };

    newsContent.whatcolor = function (progress) {
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

    newsContent.canShow = function (pr) {
      if (pr == 1) {
        return true;
      }
      return false;
    };
    // File Manager actions
    newsContent.replaceFile = function (name) {
      newsContent.itemClicked(null, newsContent.fileIdToDelete, "file");
      newsContent.fileTypes = 1;
      newsContent.fileIdToDelete = newsContent.selectedIndex;

      // Delete the file
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", newsContent.fileIdToDelete, "GET")
        .success(function (response1) {
          rashaErManage.checkAction(response1);
          if (response1.IsSuccess == true) {

            ajax
              .call(cmsServerConfig.configApiServerPath + "FileContent/delete", response1.Item, "POST")
              .success(function (response2) {
                newsContent.remove(
                  newsContent.FileList,
                  newsContent.fileIdToDelete
                );
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess == true) {
                  // Save New file
                  ajax
                    .call(cmsServerConfig.configApiServerPath + "FileContent/GetViewModel", "", "GET")
                    .success(function (response3) {
                      rashaErManage.checkAction(response3);

                      if (response3.IsSuccess == true) {
                        newsContent.FileItem = response3.Item;
                        newsContent.FileItem.FileName = name;
                        newsContent.FileItem.Extension = name.split(".").pop();
                        newsContent.FileItem.FileSrc = name;
                        newsContent.FileItem.LinkCategoryId =
                          newsContent.thisCategory;
                        newsContent.saveNewFile();
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
    newsContent.saveNewFile = function () {
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/add", newsContent.FileItem, "POST")
        .success(function (response) {
          if (response.IsSuccess) {
            newsContent.FileItem = response.Item;
            newsContent.showSuccessIcon();
            return 1;
          } else {
            return 0;
          }
        })
        .error(function (data) {
          newsContent.showErrorIcon();
          return -1;
        });
    };

    newsContent.showSuccessIcon = function () {};

    newsContent.showErrorIcon = function () {};
    //file is exist
    newsContent.fileIsExist = function (fileName) {
      for (var i = 0; i < newsContent.FileList.length; i++) {
        if (newsContent.FileList[i].FileName == fileName) {
          newsContent.fileIdToDelete = newsContent.FileList[i].Id;
          return true;
        }
      }
      return false;
    };

    newsContent.getFileItem = function (id) {
      for (var i = 0; i < newsContent.FileList.length; i++) {
        if (newsContent.FileList[i].Id == id) {
          return newsContent.FileList[i];
        }
      }
    };

    //select file or folder
    newsContent.itemClicked = function ($event, index, type) {
      if (type == "file" || type == 1) {
        newsContent.fileTypes = 1;
        newsContent.selectedFileId = newsContent.getFileItem(index).Id;
        newsContent.selectedFileName = newsContent.getFileItem(index).FileName;
      } else {
        newsContent.fileTypes = 2;
        newsContent.selectedCategoryId = newsContent.getCategoryName(index).Id;
        newsContent.selectedCategoryTitle = newsContent.getCategoryName(
          index
        ).Title;
      }
      newsContent.selectedIndex = index;
    };

    newsContent.toggleCategoryButtons = function () {
      $("#categoryButtons").fadeToggle();
    };
    //upload file Podcast
    newsContent.uploadFilePodcast = function (index, uploadFile) {
      if ($("#save-icon" + index).hasClass("fa-save")) {
        if (newsContent.fileIsExist(uploadFile.name)) { // File already exists
          if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
            //------------ newsContent.replaceFile(uploadFile.name);
            newsContent.itemClicked(null, newsContent.fileIdToDelete, "file");
            newsContent.fileTypes = 1;
            newsContent.fileIdToDelete = newsContent.selectedIndex;
            // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                newsContent.fileIdToDelete,
                "GET"
              )
              .success(function (response1) {
                if (response1.IsSuccess == true) {
                  rashaErManage.checkAction(response1);
                  ajax.call(cmsServerConfig.configApiServerPath + "FileContent/replace", response1.Item, "POST")
                    .success(function (response2) {
                      rashaErManage.checkAction(response2);

                      if (response2.IsSuccess == true) {
                        newsContent.FileItem = response2.Item;
                        newsContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        newsContent.filePickerFilePodcast.filename =
                          newsContent.FileItem.FileName;
                        newsContent.filePickerFilePodcast.fileId =
                          response2.Item.Id;
                        newsContent.selectedItem.LinkFilePodcastId =
                          newsContent.filePickerFilePodcast.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function (data) {
                      newsContent.showErrorIcon();
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
            newsContent.FileItem = response.Item;
            newsContent.FileItem.FileName = uploadFile.name;
            newsContent.FileItem.uploadName = uploadFile.uploadName;
            newsContent.FileItem.Extension = uploadFile.name.split('.').pop();
            newsContent.FileItem.FileSrc = uploadFile.name;
            newsContent.FileItem.LinkCategoryId = null; //Save the new file in the root
            // ------- newsContent.saveNewFile()  ----------------------
            var result = 0;
            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/add", newsContent.FileItem, 'POST').success(function (response) {
              if (response.IsSuccess) {
                newsContent.FileItem = response.Item;
                newsContent.showSuccessIcon();
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-check");
                newsContent.filePickerFilePodcast.filename = newsContent.FileItem.FileName;
                newsContent.filePickerFilePodcast.fileId = response.Item.Id;
                newsContent.selectedItem.LinkFilePodcastId = newsContent.filePickerFilePodcast.fileId

              } else {
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-remove");
              }
            }).error(function (data) {
              newsContent.showErrorIcon();
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
    newsContent.uploadFileMovie = function (index, uploadFile) {
      if ($("#save-icon" + index).hasClass("fa-save")) {
        if (newsContent.fileIsExist(uploadFile.name)) { // File already exists
          if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
            //------------ newsContent.replaceFile(uploadFile.name);
            newsContent.itemClicked(null, newsContent.fileIdToDelete, "file");
            newsContent.fileTypes = 1;
            newsContent.fileIdToDelete = newsContent.selectedIndex;
            // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                newsContent.fileIdToDelete,
                "GET"
              )
              .success(function (response1) {
                if (response1.IsSuccess == true) {
                  rashaErManage.checkAction(response1);
                  ajax.call(cmsServerConfig.configApiServerPath + "FileContent/replace", response1.Item, "POST")
                    .success(function (response2) {
                      rashaErManage.checkAction(response2);

                      if (response2.IsSuccess == true) {
                        newsContent.FileItem = response2.Item;
                        newsContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        newsContent.filePickerFileMovie.filename =
                          newsContent.FileItem.FileName;
                        newsContent.filePickerFileMovie.fileId =
                          response2.Item.Id;
                        newsContent.selectedItem.LinkFileMovieId =
                          newsContent.filePickerFileMovie.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function (data) {
                      newsContent.showErrorIcon();
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
            newsContent.FileItem = response.Item;
            newsContent.FileItem.FileName = uploadFile.name;
            newsContent.FileItem.uploadName = uploadFile.uploadName;
            newsContent.FileItem.Extension = uploadFile.name.split('.').pop();
            newsContent.FileItem.FileSrc = uploadFile.name;
            newsContent.FileItem.LinkCategoryId = null; //Save the new file in the root
            // ------- newsContent.saveNewFile()  ----------------------
            var result = 0;
            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/add", newsContent.FileItem, 'POST').success(function (response) {
              if (response.IsSuccess) {
                newsContent.FileItem = response.Item;
                newsContent.showSuccessIcon();
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-check");
                newsContent.filePickerFileMovie.filename = newsContent.FileItem.FileName;
                newsContent.filePickerFileMovie.fileId = response.Item.Id;
                newsContent.selectedItem.LinkFileMovieId = newsContent.filePickerFileMovie.fileId

              } else {
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-remove");
              }
            }).error(function (data) {
              newsContent.showErrorIcon();
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
    newsContent.uploadFile = function (index, uploadFile) {
      if ($("#save-icon" + index).hasClass("fa-save")) {
        if (newsContent.fileIsExist(uploadFile.name)) {
          // File already exists
          if (
            confirm(
              'File "' +
              uploadFile.name +
              '" already exists! Do you want to replace the new file?'
            )
          ) {
            //------------ newsContent.replaceFile(uploadFile.name);
            newsContent.itemClicked(null, newsContent.fileIdToDelete, "file");
            newsContent.fileTypes = 1;
            newsContent.fileIdToDelete = newsContent.selectedIndex;
            // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                newsContent.fileIdToDelete,
                "GET"
              )
              .success(function (response1) {
                rashaErManage.checkAction(response1);
                if (response1.IsSuccess == true) {
                  ajax.call(cmsServerConfig.configApiServerPath + "FileContent/replace", response1.Item, "POST")
                    .success(function (response2) {
                      if (response2.IsSuccess == true) {
                        newsContent.FileItem = response2.Item;
                        newsContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        newsContent.filePickerMainImage.filename =
                          newsContent.FileItem.FileName;
                        newsContent.filePickerMainImage.fileId =
                          response2.Item.Id;
                        newsContent.selectedItem.LinkMainImageId =
                          newsContent.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function (data) {
                      newsContent.showErrorIcon();
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
              newsContent.FileItem = response.Item;
              newsContent.FileItem.FileName = uploadFile.name;
              newsContent.FileItem.uploadName = uploadFile.uploadName;
              newsContent.FileItem.Extension = uploadFile.name.split(".").pop();
              newsContent.FileItem.FileSrc = uploadFile.name;
              newsContent.FileItem.LinkCategoryId = null; //Save the new file in the root
              // ------- newsContent.saveNewFile()  ----------------------
              var result = 0;
              ajax
                .call(cmsServerConfig.configApiServerPath + "FileContent/add", newsContent.FileItem, "POST")
                .success(function (response) {
                  if (response.IsSuccess) {
                    newsContent.FileItem = response.Item;
                    newsContent.showSuccessIcon();
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-check");
                    newsContent.filePickerMainImage.filename =
                      newsContent.FileItem.FileName;
                    newsContent.filePickerMainImage.fileId = response.Item.Id;
                    newsContent.selectedItem.LinkMainImageId =
                      newsContent.filePickerMainImage.fileId;
                  } else {
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-remove");
                  }
                })
                .error(function (data) {
                  newsContent.showErrorIcon();
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
    newsContent.exportFile = function () {
      newsContent.addRequested = true;
      newsContent.gridOptions.advancedSearchData.engine.ExportFile =
        newsContent.ExportFileClass;
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "newsContent/exportfile",
          newsContent.gridOptions.advancedSearchData.engine,
          "POST"
        )
        .success(function (response) {
          newsContent.addRequested = false;
          rashaErManage.checkAction(response);
          if (response.IsSuccess) {
            newsContent.exportDownloadLink =
              window.location.origin + response.LinkFile;
            $window.open(response.LinkFile, "_blank");
            //newsContent.closeModal();
          }
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    //Open Export Report Modal
    newsContent.toggleExportForm = function () {
      newsContent.SortType = [{
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
      newsContent.EnumExportFileType = [{
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
      newsContent.EnumExportReceiveMethod = [{
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
      newsContent.ExportFileClass = {
        FileType: 1,
        RecieveMethod: 0,
        RowCount: 100
      };
      newsContent.exportDownloadLink = null;
      $modal.open({
        templateUrl: "cpanelv1/ModuleNews/NewsContent/report.html",
        scope: $scope
      });
    };
    //Row Count Export Input Change
    newsContent.rowCountChanged = function () {
      if (
        !angular.isDefined(newsContent.ExportFileClass.RowCount) ||
        newsContent.ExportFileClass.RowCount > 5000
      )
        newsContent.ExportFileClass.RowCount = 5000;
    };
    //Get TotalRowCount
    newsContent.getCount = function () {
      ajax.call(cmsServerConfig.configApiServerPath + "newsContent/count", newsContent.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
          newsContent.addRequested = false;
          rashaErManage.checkAction(response);
          newsContent.ListItemsTotalRowCount = ": " + response.TotalRowCount;
        })
        .error(function (data, errCode, c, d) {
          newsContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
        });
    };

    newsContent.showCategoryImage = function (mainImageId) {
      if (mainImageId == 0 || mainImageId == null) return;
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/PreviewImage", {
          id: mainImageId,
          name: ""
        }, "POST")
        .success(function (response) {
          newsContent.selectedItem.MainImageSrc = response;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };

    //TreeControl
    newsContent.treeOptions = {
      nodeChildren: "Children",
      multiSelection: false,
      isLeaf: function (node) {
        if (node.FileName == undefined || node.Filename == "") return false;
        return true;
      },
      isSelectable: function (node) {
        if (newsContent.treeOptions.dirSelectable)
          if (angular.isDefined(node.FileName)) return false;
        return true;
      },
      dirSelectable: false
    };

    newsContent.onNodeToggle = function (node, expanded) {
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


    newsContent.onSelection = function (node, selected) {
      if (!selected) {
        newsContent.selectedItem.LinkMainImageId = null;
        newsContent.selectedItem.previewImageSrc = null;
        return;
      }
      newsContent.selectedItem.LinkMainImageId = node.Id;
      newsContent.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages + "loader.gif";
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", node.Id, "GET")
        .success(function (response) {
          newsContent.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    //End of TreeControl
  }
]);