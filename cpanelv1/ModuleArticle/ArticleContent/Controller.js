app.controller("articleContentController", [
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
    var articleContent = this;
    //شناسه اینام این ماژول در ارتباطات
    //Article_WrapperArticleContent
    ModuleRelationShipModuleNameMain = 10;
    articleContent.RouteUploadFileContent = cmsServerConfig.configRouteUploadFileContent;
    var edititem = false;
    //For Grid Options
    articleContent.gridOptions = {};
    articleContent.selectedItem = {};
    articleContent.selectedItemRelationship = {};
    articleContent.attachedFiles = [];

    articleContent.filePickerMainImage = {
      isActive: true,
      backElement: "filePickerMainImage",
      filename: null,
      fileId: null,
      multiSelect: false
    };
    articleContent.filePickerFilePodcast = {
      isActive: true,
      backElement: 'filePickerFilePodcast',
      filename: null,
      fileId: null,
      extension: 'mp3',
      multiSelect: false,
    }

    articleContent.filePickerFileMovie = {
      isActive: true,
      backElement: 'filePickerFileMovie',
      filename: null,
      fileId: null,
      extension: 'mp4,avi',
      multiSelect: false,
    }
    articleContent.filePickerFiles = {
      isActive: true,
      backElement: "filePickerFiles",
      multiSelect: false,
      fileId: null,
      filename: null
    };
    articleContent.locationChanged = function (lat, lang) {
      //console.log("ok " + lat + " " + lang);
    }
    articleContent.selectedContentId = {
      Id: $stateParams.ContentId,
      TitleTag: $stateParams.TitleTag
    };
    articleContent.GeolocationConfig = {
      latitude: 'Geolocationlatitude',
      longitude: 'Geolocationlongitude',
      onlocationChanged: articleContent.locationChanged,
      useCurrentLocation: true,
      center: {
        lat: 32.658066,
        lng: 51.6693815
      },
      zoom: 4,
      scope: articleContent,
      useCurrentLocationZoom: 12,
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) {
      articleContent.itemRecordStatus = itemRecordStatus;
    }
    var date = moment().format();
    articleContent.selectedItem.ExpireDate = date;
    // articleContent.datePickerConfig = {
    //   defaultDate: date
    // };

    // articleContent.FromDate = {
    //   defaultDate: date
    // };
    // articleContent.ExpireDate = {
    //   defaultDate: date
    // };
    //#help/ سلکتور دسته بندی در ویرایش محتوا
    articleContent.LinkCategoryIdSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkCategoryId",
      url: "ArticleCategory",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: articleContent,
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
    articleContent.SimilarsSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "Iddddd",
      url: "ArticleContent",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: articleContent,
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
    articleContent.LinkModuleContentIdOtherSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkModuleContentIdOther",
      url: "articleContent",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: articleContent,
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


    articleContent.selectedItemModuleRelationShip = [];
    articleContent.ModuleRelationShip = [];


    articleContent.moveSelectedRelationOnAdd = function () {
      if (!articleContent.LinkModuleContentIdOtherSelector.selectedItem.Id || !articleContent.selectedItemModuleRelationShip.ModuleNameOther) {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_RelationShip'));
        return;
      }
      if (!articleContent.selectedItemModuleRelationShip.Title || articleContent.selectedItemModuleRelationShip.Title.length == 0)
        articleContent.selectedItemModuleRelationShip.Title = articleContent.LinkModuleContentIdOtherSelector.filterText;
      for (var i = 0; i < articleContent.ModuleRelationShip.length; i++) {
        if (articleContent.ModuleRelationShip[i].Id == articleContent.LinkModuleContentIdOtherSelector.selectedItem.Id) {
          rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
          return;
        }
      }
      articleContent.ModuleRelationShip.push({
        Title: articleContent.selectedItemModuleRelationShip.Title,
        ModuleNameOther: articleContent.selectedItemModuleRelationShip.ModuleNameOther.Value,
        LinkModuleContentIdOther: articleContent.LinkModuleContentIdOtherSelector.selectedItem.Id,
        ModuleNameMain: ModuleRelationShipModuleNameMain,
        LinkModuleContentIdMain: articleContent.gridOptions.selectedRow.item.Id
      });
      articleContent.selectedItemModuleRelationShip = [];
      articleContent.LinkModuleContentIdOtherSelector.LinkModuleContentIdOther = 0;
    };
    articleContent.moveSelectedRelationOnEdit = function () {
      if (!articleContent.LinkModuleContentIdOtherSelector.selectedItem.Id || !articleContent.selectedItemRelationship.ModuleNameOther) {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_RelationShip'));
        return;
      }
      if (!articleContent.selectedItemRelationship.Title || articleContent.selectedItemRelationship.Title.length == 0)
        articleContent.selectedItemRelationship.Title = articleContent.LinkModuleContentIdOtherSelector.filterText;

      for (var i = 0; i < articleContent.ModuleRelationShip.length; i++) {
        if (articleContent.ModuleRelationShip[i].Id == articleContent.LinkModuleContentIdOtherSelector.selectedItem.Id &&
          articleContent.ModuleRelationShip[i].LinkModuleContentIdOther == articleContent.selectedItemRelationship.ModuleNameOther.Value) {
          rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
          return;
        }
      }

      articleContent.ModuleRelationShip.push({
        Title: articleContent.selectedItemRelationship.Title,
        ModuleNameOther: articleContent.selectedItemRelationship.ModuleNameOther.Value,
        LinkModuleContentIdOther: articleContent.LinkModuleContentIdOtherSelector.selectedItem.Id,
        ModuleNameMain: ModuleRelationShipModuleNameMain,
        LinkModuleContentIdMain: articleContent.gridOptions.selectedRow.item.Id
      });
      articleContent.selectedItemRelationship = [];
      articleContent.LinkModuleContentIdOtherSelector.LinkModuleContentIdOther = 0;
    };

    articleContent.removeFromCollectionRelationShip = function (deleteItem) {
      for (var i = 0; i < articleContent.ModuleRelationShip.length; i++) {
        if (articleContent.ModuleRelationShip[i].LinkModuleContentIdOther == deleteItem.LinkModuleContentIdOther &&
          articleContent.ModuleRelationShip[i].ModuleNameOther == deleteItem.ModuleNameOther
        ) {
          articleContent.ModuleRelationShip.splice(i, 1);
          return;
        }
      }
    };
    articleContent.removeFromCollectionOtherInfo = function (deleteItem) {
      for (var i = 0; i < articleContent.OtherInfos.length; i++) {
        if (articleContent.OtherInfos[i].Id == deleteItem.Id) {
          articleContent.OtherInfos.splice(i, 1);
          return;
        }
      }
    };
    articleContent.removeFromCollectionSimilars = function (deleteItem) {
      for (var i = 0; i < articleContent.Similars.length; i++) {
        if (articleContent.Similars[i].Id == deleteItem.Id) {
          articleContent.Similars.splice(i, 1);
          return;
        }
      }
    };
    articleContent.editFromCollectionOtherInfo = function (editItem) {
      articleContent.todoModeTitle = $filter('translatentk')('edit_now');
      articleContent.editMode = true;
      articleContent.selectedItemOtherInfos = angular.copy(editItem);
      $scope.currentItemIndex = articleContent.OtherInfos.indexOf(editItem);
    };

    //#help otherInfo

    articleContent.editOtherInfo = function (y) {
      if (y == null || y == undefined || y.Title == "" || y.Title == undefined || y.HtmlBody == "" || y.HtmlBody == undefined) {
        rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
        return;
      }
      edititem = true;
      articleContent.selectedItemOtherInfos.Title = y.Title;
      articleContent.selectedItemOtherInfos.HtmlBody = y.HtmlBody;
      articleContent.selectedItemOtherInfos.Source = y.Source;
      articleContent.removeFromOtherInfo(articleContent.OtherInfos, y.Title, y.HtmlBody, y.Source);
    };
    articleContent.changSelectedRelationModuleAdd = function () {
      articleContent.LinkModuleContentIdOtherSelector.url = articleContent.selectedItemModuleRelationShip.ModuleNameOther.Key.split(/Wrapper(.+)/)[1];
      articleContent.LinkModuleContentIdOtherSelector.selectedItem = {};
      articleContent.selectedItem.LinkModuleContentIdOther = {};
    }
    articleContent.changSelectedRelationModuleEdit = function () {
      articleContent.LinkModuleContentIdOtherSelector.url = articleContent.selectedItemRelationship.ModuleNameOther.Key.split(/Wrapper(.+)/)[1];
      articleContent.LinkModuleContentIdOtherSelector.selectedItem = {};
      articleContent.selectedItem.LinkModuleContentIdOther = {};
    }
    articleContent.UrlContent = "";
    //article Grid Options
    articleContent.gridOptions = {
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
          template: '<li ng-if="!x.IsActivated" class="dropdown" dropdown="" style="display: initial;"><a aria-expanded="false" aria-haspopup="true" class="dropdown-toggle count-info" href="" dropdown-toggle=""><i class="fa fa-cog" ></i></a><ul class="dropdown-menu animated fadeInLeft m-t-xs" style="right: -142px;"><li><a ng-click="articleContent.addMenu()" style="color:black">AddMenu</a></li><li><a ng-click="articleContent.showComment(x.Id)" style="color:black">CommentList</a></li></ul></li>'
        }

      ],
      data: {},
      multiSelect: false,
      advancedSearchData: {
        engine: {}
      }
    };
    //Comment Grid Options
    articleContent.gridContentOptions = {
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
            '<Button ng-if="(x.RecordStatus!=1)" ng-click="articleContent.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتایید می کنم</Button>' +
            '<Button ng-if="(x.RecordStatus==1)" ng-click="articleContent.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspغیرفعال می کنم</Button>' +
            '<Button ng-click="articleContent.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>'
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
    articleContent.gridOptions.advancedSearchData.engine.Filters = null;
    articleContent.gridOptions.advancedSearchData.engine.Filters = [];

    //For Show Category Loading Indicator
    articleContent.categoryBusyIndicator = {
      isActive: true,
      message: "در حال بارگذاری دسته ها ..."
    };
    //For Show article Loading Indicator
    articleContent.contentBusyIndicator = {
      isActive: false,
      message: "در حال بارگذاری ..."
    };
    //Tree Config
    articleContent.treeConfig = {
      displayMember: "Title",
      displayId: "Id",
      displayChild: "Children"
    };

    //open addMenu modal
    articleContent.addMenu = function () {

      $modal.open({
        templateUrl: "cpanelv1/Modulearticle/articleContent/modalMenu.html",
        scope: $scope
      });
    };

    articleContent.treeConfig.currentNode = {};
    articleContent.treeBusyIndicator = false;

    articleContent.addRequested = false;

    articleContent.showGridComment = false;
    articleContent.articleTitle = "";

    //init Function
    articleContent.init = function () {
      articleContent.categoryBusyIndicator.isActive = true;

      var engine = {};
      try {
        engine = articleContent.gridOptions.advancedSearchData.engine;
      } catch (error) {
        //console.log(error);
      }
      ajax.call(cmsServerConfig.configApiServerPath + "ModulesRelationshipContent/GetEnum", {}, 'POST').success(function (response) {
        rashaErManage.checkAction(response);
        articleContent.EnumModuleRelationshipName = response.ListItems;
        if (articleContent.EnumModuleRelationshipName && articleContent.EnumModuleRelationshipName.length) {
          var retFind = findWithAttr(articleContent.EnumModuleRelationshipName, "Key", "Article_WrapperArticleContent");
          if (retFind >= 0)
            ModuleRelationShipModuleNameMain = articleContent.EnumModuleRelationshipName[retFind].Value;
        }
      }).error(function (data, errCode, c, d) {
        rashaErManage.checkAction(data, errCode);
      });
      articleContent.categoryBusyIndicator.isActive = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "articleCategory/getall", {
          RowPerPage: 1000
        }, "POST")
        .success(function (response) {
          rashaErManage.checkAction(response);
          articleContent.treeConfig.Items = response.ListItems;
          articleContent.categoryBusyIndicator.isActive = false;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
      filterModel = {
        PropertyName: "ContentTags",
        PropertyAnyName: "LinkTagId",
        SearchType: 0,
        IntValue1: articleContent.selectedContentId.Id
      };
      if (articleContent.selectedContentId.Id > 0)
        articleContent.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
      articleContent.contentBusyIndicator.isActive = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "articleContent/getall", articleContent.gridOptions.advancedSearchData.engine, "POST")
        .success(function (response) {
          rashaErManage.checkAction(response);
          articleContent.ListItems = response.ListItems;
          articleContent.gridOptions.fillData(
            articleContent.ListItems,
            response.resultAccess
          ); // Sending Access as an argument
          articleContent.contentBusyIndicator.isActive = false;
          articleContent.gridOptions.currentPageNumber =
            response.CurrentPageNumber;
          articleContent.gridOptions.totalRowCount = response.TotalRowCount;
          articleContent.gridOptions.rowPerPage = response.RowPerPage;
          articleContent.gridOptions.maxSize = 5;
        })
        .error(function (data, errCode, c, d) {
          articleContent.contentBusyIndicator.isActive = false;
          articleContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
          articleContent.contentBusyIndicator.isActive = false;
        });

      ajax.call(cmsServerConfig.configApiServerPath + "articleContentTag/GetViewModel", "", "GET").success(function (response) { //Get a ViewModel for articleContentTag
          articleContent.ModuleContentTag = response.Item;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);;
        });
    };
    articleContent.EnumModuleName = function (enumId) {
      if (!articleContent.EnumModuleRelationshipName || articleContent.EnumModuleRelationshipName.length == 0)
        return enumId;
      var retFind = findWithAttr(articleContent.EnumModuleRelationshipName, "Value", enumId);
      if (retFind < 0)
        return enumId;
      return articleContent.EnumModuleRelationshipName[retFind].Description;
    }
    // For Show Comments
    articleContent.showComment = function (LinkContentId) {
      //articleContent.contentBusyIndicator = true;
      engine = {};
      var filterValue = {
        PropertyName: "LinkContentId",
        IntValue1: parseInt(LinkContentId),
        SearchType: 0
      }
      articleContent.busyIndicatorForDropDownProcess = true;
      engine.Filters = null;
      engine.Filters = [];
      engine.Filters.push(filterValue);
      ajax.call(cmsServerConfig.configApiServerPath + "articlecomment/getall", engine, 'POST').success(function (response) {
        rashaErManage.checkAction(response);
        articleContent.ListCommentItems = response.ListItems;
        articleContent.gridContentOptions.fillData(articleContent.ListCommentItems, response.resultAccess); // Sending Access as an argument
        articleContent.showGridComment = true;
        articleContent.gridContentOptions.currentPageNumber = response.CurrentPageNumber;
        articleContent.gridContentOptions.totalRowCount = response.TotalRowCount;
        articleContent.gridContentOptions.rowPerPage = response.RowPerPage;
        articleContent.gridContentOptions.maxSize = 5;
        $('html, body').animate({
          scrollTop: $("#ListComment").offset().top
        }, 850);
      }).error(function (data, errCode, c, d) {
        articleContent.gridContentOptions.fillData();
        rashaErManage.checkAction(data, errCode);
        articleContent.contentBusyIndicator.isActive = false;
      });
    };


    articleContent.gridContentOptions.onRowSelected = function () {};

    // Open Add Category Modal
    articleContent.addNewCategoryModel = function () {
      if (buttonIsPressed) {
        return;
      }
      articleContent.addRequested = false;
      buttonIsPressed = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "articleCategory/GetViewModel", "", "GET")
        .success(function (response) {
          buttonIsPressed = false;
          rashaErManage.checkAction(response);
          articleContent.selectedItem = response.Item;
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
              articleContent.dataForTheTree = response1.ListItems;
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
                    articleContent.dataForTheTree,
                    response2.ListItems
                  );
                  $modal.open({
                    templateUrl: "cpanelv1/ModuleArticle/ArticleCategory/add.html",
                    scope: $scope
                  });
                  articleContent.addRequested = false;
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
    articleContent.EditCategoryModel = function () {
      if (buttonIsPressed) {
        return;
      }
      articleContent.addRequested = false;
      //articleContent.modalTitle = ($filter('translatentk')('Edit_Category'));
      if (!articleContent.treeConfig.currentNode) {
        rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
        return;
      }

      articleContent.contentBusyIndicator.isActive = true;
      buttonIsPressed = true;
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "articleCategory/GetOne",
          articleContent.treeConfig.currentNode.Id,
          "GET"
        )
        .success(function (response) {
          buttonIsPressed = false;
          articleContent.contentBusyIndicator.isActive = false;
          rashaErManage.checkAction(response);
          articleContent.selectedItem = response.Item;
          //Set dataForTheTree
          articleContent.selectedNode = [];
          articleContent.expandedNodes = [];
          articleContent.selectedItem = response.Item;
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
              articleContent.dataForTheTree = response1.ListItems;
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
                    articleContent.dataForTheTree,
                    response2.ListItems
                  );
                  //Set selected files to treeControl
                  if (articleContent.selectedItem.LinkMainImageId > 0)
                    articleContent.onSelection({
                        Id: articleContent.selectedItem.LinkMainImageId
                      },
                      true
                    );
                  $modal.open({
                    templateUrl: "cpanelv1/ModuleArticle/ArticleCategory/edit.html",
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
    articleContent.Showstatistics = function () {
      if (!articleContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
        return;
      }
      ajax.call(cmsServerConfig.configApiServerPath + 'articleContent/GetOne', articleContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
        rashaErManage.checkAction(response1);
        articleContent.selectedItem = response1.Item;
        $modal.open({
          templateUrl: "cpanelv1/Modulearticle/articleContent/statistics.html",
          scope: $scope
        });
      }).error(function (data, errCode, c, d) {
        rashaErManage.checkAction(data, errCode);
      });
    }

    // Add New Category
    articleContent.addNewCategory = function (frm) {
      if (frm.$invalid) return;
      articleContent.categoryBusyIndicator.isActive = true;
      articleContent.addRequested = true;
      articleContent.selectedItem.LinkParentId = null;
      if (articleContent.treeConfig.currentNode != null)
        articleContent.selectedItem.LinkParentId =
        articleContent.treeConfig.currentNode.Id;
      ajax
        .call(cmsServerConfig.configApiServerPath + "articleCategory/add", articleContent.selectedItem, "POST")
        .success(function (response) {
          articleContent.addRequested = false;
          rashaErManage.checkAction(response);

          if (response.IsSuccess) {
            articleContent.gridOptions.advancedSearchData.engine.Filters = null;
            articleContent.gridOptions.advancedSearchData.engine.Filters = [];
            articleContent.gridOptions.reGetAll();
            articleContent.closeModal();
          }
          articleContent.categoryBusyIndicator.isActive = false;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          articleContent.addRequested = false;
          articleContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Edit Category REST Api
    articleContent.EditCategory = function (frm) {
      if (frm.$invalid) return;
      articleContent.categoryBusyIndicator.isActive = true;
      articleContent.addRequested = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "articleCategory/edit", articleContent.selectedItem, "PUT")
        .success(function (response) {
          //articleContent.showbusy = false;
          articleContent.treeConfig.showbusy = false;
          articleContent.addRequested = false;
          rashaErManage.checkAction(response);
          if (response.IsSuccess) {
            articleContent.treeConfig.currentNode.Title = response.Item.Title;
            articleContent.closeModal();
          }
          articleContent.categoryBusyIndicator.isActive = false;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          articleContent.addRequested = false;
          articleContent.categoryBusyIndicator.isActive = false;
        });
    };

    // Delete a Category
    articleContent.deleteCategory = function () {
      if (buttonIsPressed) {
        return;
      }
      var node = articleContent.treeConfig.currentNode;
      if (node.Id == 0 || !node.Id) {
        rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
        return;
      }
      rashaErManage.showYesNo(
        ($filter('translatentk')('warning')),
        ($filter('translatentk')('do_you_want_to_delete_this_attribute')),
        function (isConfirmed) {
          if (isConfirmed) {
            articleContent.categoryBusyIndicator.isActive = true;
            buttonIsPressed = true;
            ajax
              .call(cmsServerConfig.configApiServerPath + "articleCategory/GetOne", node.Id, "GET")
              .success(function (response) {
                buttonIsPressed = false;
                rashaErManage.checkAction(response);
                articleContent.selectedItemForDelete = response.Item;
                ajax
                  .call(
                    cmsServerConfig.configApiServerPath + "articleCategory/delete",
                    articleContent.selectedItemForDelete,
                    "POST"
                  )
                  .success(function (res) {
                    articleContent.categoryBusyIndicator.isActive = false;
                    if (res.IsSuccess) {
                      articleContent.gridOptions.advancedSearchData.engine.Filters = null;
                      articleContent.gridOptions.advancedSearchData.engine.Filters = [];
                      articleContent.gridOptions.fillData();
                      articleContent.gridOptions.reGetAll();
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
                    articleContent.categoryBusyIndicator.isActive = false;
                  });
              })
              .error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                articleContent.categoryBusyIndicator.isActive = false;
              });
          }
        }
      );
    };

    //Tree On Node Select Options
    articleContent.treeConfig.onNodeSelect = function () {
      var node = articleContent.treeConfig.currentNode;
      articleContent.showGridComment = false;
      articleContent.selectContent(node);
    };
    //Show Content with Category Id
    articleContent.selectContent = function (node) {
      articleContent.gridOptions.advancedSearchData.engine.Filters = null;
      articleContent.gridOptions.advancedSearchData.engine.Filters = [];
      if (node != null && node != undefined) {
        articleContent.contentBusyIndicator.message =
          "در حال بارگذاری مقاله های  دسته " + node.Title;
        articleContent.contentBusyIndicator.isActive = true;
        //articleContent.gridOptions.advancedSearchData = {};
        articleContent.attachedFiles = [];
        var s = {
          PropertyName: "LinkCategoryId",
          IntValue1: node.Id,
          SearchType: 0
        };
        articleContent.gridOptions.advancedSearchData.engine.Filters.push(s);
      }
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "articleContent/getall",
          articleContent.gridOptions.advancedSearchData.engine,
          "POST"
        )
        .success(function (response) {
          rashaErManage.checkAction(response);
          articleContent.contentBusyIndicator.isActive = false;
          articleContent.ListItems = response.ListItems;
          articleContent.gridOptions.fillData(
            articleContent.ListItems,
            response.resultAccess
          ); // Sending Access as an argument
          articleContent.gridOptions.currentPageNumber =
            response.CurrentPageNumber;
          articleContent.gridOptions.totalRowCount = response.TotalRowCount;
          articleContent.gridOptions.rowPerPage = response.RowPerPage;
        })
        .error(function (data, errCode, c, d) {
          articleContent.contentBusyIndicator.isActive = false;
          articleContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Modal
    articleContent.addNewContentModel = function () {
      articleContent.selectedItemModuleRelationShip = [];
      articleContent.ModuleRelationShip = [];
      if (buttonIsPressed) {
        return;
      }
      var node = articleContent.treeConfig.currentNode;
      if (node.Id == 0 || !node.Id) {
        rashaErManage.showMessage($filter('translatentk')('to_add_a_article_please_select_the_category'));
        buttonIsPressed = false;
        return;
      }
      articleContent.selectedItemOtherInfos = {};
      articleContent.attachedFiles = [];
      articleContent.Similars = [];
      articleContent.SimilarsDb = [];
      articleContent.OtherInfos = [];
      articleContent.OtherInfosDb = [];
      articleContent.ModuleRelationShip = [];
      articleContent.ModuleRelationShipDb = [];

      articleContent.filePickerMainImage.filename = "";
      articleContent.filePickerMainImage.fileId = null;
      articleContent.filePickerFilePodcast.filename = "";
      articleContent.filePickerFilePodcast.fileId = null;
      articleContent.filePickerFileMovie.filename = "";
      articleContent.filePickerFileMovie.fileId = null;
      articleContent.filePickerFiles.filename = "";
      articleContent.filePickerFiles.fileId = null;
      articleContent.tags = []; //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
      articleContent.kwords = []; //tagsInput خالی کردن آرایه کلمات کلیدی برای محتوای جدید
      articleContent.addRequested = false;
      //articleContent.modalTitle = ($filter('translatentk')('Add_Content'));
      buttonIsPressed = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "articleContent/GetViewModel", "", "GET")
        .success(function (response) {
          buttonIsPressed = false;
          rashaErManage.checkAction(response);

          articleContent.selectedItem = response.Item;
          articleContent.OtherInfos = [];

          articleContent.selectedItem.LinkCategoryId = node.Id;
          articleContent.selectedItem.LinkFileIds = null;

          $modal.open({
            templateUrl: "cpanelv1/Modulearticle/articleContent/add.html",
            scope: $scope
          });
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };


    articleContent.SimilarsSelectedItem = {};
    articleContent.moveSelected = function (from, to, calculatePrice) {
      if (from == "Content") {
        if (
          articleContent.selectedItem.Id != undefined &&
          articleContent.selectedItem.Id != null
        ) {
          if (articleContent.Similars == undefined)
            articleContent.Similars = [];

          for (var i = 0; i < articleContent.Similars.length; i++) {
            if (articleContent.Similars[i].Id == articleContent.SimilarsSelector.selectedItem.Id) {
              rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
              return;
            }
          }
          articleContent.Similars.push(articleContent.SimilarsSelector.selectedItem);
        }
      }
    };

    articleContent.moveSelectedOtherInfo = function (from, to, y) {
      if (articleContent.OtherInfos == undefined)
        articleContent.OtherInfos = [];
      for (var i = 0; i < articleContent.OtherInfos.length; i++) {

        if (articleContent.OtherInfos[i].Title == articleContent.selectedItemOtherInfos.Title && articleContent.OtherInfos[i].HtmlBody == articleContent.selectedItemOtherInfos.HtmlBody && articleContent.OtherInfos[i].Source == articleContent.selectedItemOtherInfos.Source) {
          rashaErManage.showMessage($filter('translatentk')('Information_Is_Duplicate'));
          return;
        }
      }
      if (articleContent.selectedItemOtherInfos.Title == "" && articleContent.selectedItemOtherInfos.Source == "" && articleContent.selectedItemOtherInfos.HtmlBody == "") {
        rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
      } else if (articleContent.selectedItemOtherInfos.TypeId == "" || !Number.isInteger(articleContent.selectedItemOtherInfos.TypeId)) {
        rashaErManage.showMessage($filter('translatentk')('در فیلد نوع مقدار عددی وارد کنید'));
      } else {

        articleContent.OtherInfos.push({
          Title: articleContent.selectedItemOtherInfos.Title,
          HtmlBody: articleContent.selectedItemOtherInfos.HtmlBody,
          Source: articleContent.selectedItemOtherInfos.Source
        });
        articleContent.selectedItemOtherInfos.Title = "";
        articleContent.selectedItemOtherInfos.Source = "";
        articleContent.selectedItemOtherInfos.HtmlBody = "";
      }
      if (edititem) {
        edititem = false;
      }

    };
    //#help otherInfo
    articleContent.selectedItemOtherInfos = {};
    articleContent.todoModeTitle = $filter('translatentk')('ADD_NOW');
    articleContent.saveOtherInfos = function () {

      if (articleContent.editMode) {
        if (articleContent.selectedItemOtherInfos.Title == "" ||
          articleContent.selectedItemOtherInfos.Title == undefined ||
          articleContent.selectedItemOtherInfos.HtmlBody == "" ||
          articleContent.selectedItemOtherInfos.HtmlBody == undefined) {
          rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
          return;
        }
        articleContent.selectedItemOtherInfos.Edited = true;
        $scope.currentItem = articleContent.selectedItemOtherInfos;
        articleContent.OtherInfos[$scope.currentItemIndex] = articleContent.selectedItemOtherInfos;
        articleContent.editMode = false;


      } else { //add New
        if (articleContent.selectedItemOtherInfos.Title == "" ||
          articleContent.selectedItemOtherInfos.Title == undefined ||
          articleContent.selectedItemOtherInfos.HtmlBody == "" ||
          articleContent.selectedItemOtherInfos.HtmlBody == undefined) {
          rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
          return;
        }
        articleContent.selectedItemOtherInfos.LinkContentId = articleContent.gridOptions.selectedRow.item.Id;
        articleContent.OtherInfos.push(articleContent.selectedItemOtherInfos);
        articleContent.selectedItemOtherInfos = {};
        // ajax.call(cmsServerConfig.configApiServerPath + 'articleContentOtherInfo/add', articleContent.selectedItemOtherInfos, 'POST').success(function (response) {
        //   rashaErManage.checkAction(response);
        //   if (response.IsSuccess) {
        //     articleContent.selectedItemOtherInfos = response.Item;
        //     mainLIst.push(articleContent.selectedItemOtherInfos);
        //     articleContent.selectedItemOtherInfos = {};
        //   }
        // }).error(function (data, errCode, c, d) {
        //   rashaErManage.checkAction(data, errCode);
        // });

      }
      articleContent.selectedItemOtherInfos = {};
      articleContent.todoModeTitle = $filter('translatentk')('add_now');
    };




    //#help
    // Open Edit Content Modal
    articleContent.openEditModel = function () {
      articleContent.attachedFiles = [];
      articleContent.Similars = [];
      articleContent.SimilarsDb = [];
      articleContent.OtherInfos = [];
      articleContent.ModuleRelationShip = [];
      articleContent.selectedItemModuleRelationShip = [];
      articleContent.ModuleRelationShipDb = [];
      articleContent.tags = []; //Clear out previous tags
      articleContent.selectedItemRelationship = [];
      if (buttonIsPressed) {
        return;
      }

      articleContent.showComment(articleContent.gridOptions.selectedRow.item.Id)
      articleContent.addRequested = false;
      //articleContent.modalTitle = ($filter('translatentk')('Edit_Content'));
      if (!articleContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
        return;
      }
      if (articleContent.gridOptions.selectedRow.item.LinkSiteId != $rootScope.tokenInfo.Item.SiteId && !$rootScope.tokenInfo.Item.UserAccessAdminAllowToAllData) {
        rashaErManage.showMessage($filter('translatentk')('This_Article_Is_Shared'));
        return;
      }
      articleContent.selectedItemOtherInfos = {};
      buttonIsPressed = true;
      ajax.call(cmsServerConfig.configApiServerPath + "articleContent/GetOne", articleContent.gridOptions.selectedRow.item.Id, "GET")
        .success(function (response1) {
          buttonIsPressed = false;
          rashaErManage.checkAction(response1);
          articleContent.selectedItem = response1.Item;


          // articleContent.FromDate.defaultDate = articleContent.selectedItem.FromDate;
          // articleContent.ExpireDate.defaultDate = articleContent.selectedItem.ExpireDate;
          articleContent.filePickerMainImage.filename = null;
          articleContent.filePickerMainImage.fileId = null;
          articleContent.filePickerFilePodcast.filename = null;
          articleContent.filePickerFilePodcast.fileId = null;
          articleContent.filePickerFileMovie.filename = null;
          articleContent.filePickerFileMovie.fileId = null;
          //ArticleContentOtherInfo
          var engineOtherInfo = {};
          var filterValue = {
            PropertyName: "LinkContentId",
            IntValue1: articleContent.gridOptions.selectedRow.item.Id,
            SearchType: 0
          }
          engineOtherInfo.Filters = null;
          engineOtherInfo.Filters = [];
          engineOtherInfo.Filters.push(filterValue);
          ajax.call(cmsServerConfig.configApiServerPath + "ArticleContentOtherInfo/GetAll", engineOtherInfo, "POST")
            .success(function (responseOtherInfos) {
              articleContent.OtherInfosDb = responseOtherInfos.ListItems;
              articleContent.OtherInfos = angular.extend(articleContent.OtherInfos, responseOtherInfos.ListItems);
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });

          ajax.call(cmsServerConfig.configApiServerPath + "ArticleContentTag/GetAll", engineOtherInfo, "POST")
            .success(function (responsetag) {
              articleContent.selectedItem.ContentTags = responsetag.ListItems;

              //Load tagsInput
              if (articleContent.selectedItem.ContentTags == null)
                articleContent.selectedItem.ContentTags = [];
              $.each(articleContent.selectedItem.ContentTags, function (index, item) {
                if (item.virtual_ModuleTag != null)
                  articleContent.tags.push({
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
          ajax.call(cmsServerConfig.configApiServerPath + "ArticleContent/GetAllWithSimilarsId/" + articleContent.gridOptions.selectedRow.item.Id, engineSimilars, "POST")
            .success(function (responseSimilars) {
              articleContent.SimilarsDb = responseSimilars.ListItems;
              articleContent.Similars = angular.extend(articleContent.Similars, responseSimilars.ListItems);
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          var RelationshipModel = {
            Id: articleContent.gridOptions.selectedRow.item.Id,
            enumValue: ModuleRelationShipModuleNameMain
          };
          ajax.call(cmsServerConfig.configApiServerPath + 'ModulesRelationshipContent/GetAllByContentId', RelationshipModel, 'POST')
            .success(function (responseModuleRelationShip) {
              articleContent.ModuleRelationShipDb = responseModuleRelationShip.ListItems;
              articleContent.ModuleRelationShip = angular.extend(articleContent.ModuleRelationShip, responseModuleRelationShip.ListItems);
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          //ArticleContentOtherInfo
          if (response1.Item.LinkMainImageId != null) {
            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", response1.Item.LinkMainImageId, "GET")
              .success(function (response2) {
                buttonIsPressed = false;
                articleContent.filePickerMainImage.filename =
                  response2.Item.FileName;
                articleContent.filePickerMainImage.fileId = response2.Item.Id;
              })
              .error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
              });
          }
          if (response1.Item.LinkFilePodcastId != null) {
            ajax.call(cmsServerConfig.configApiServerPath + 'FileContent/GetOne', response1.Item.LinkFilePodcastId, 'GET').success(function (response2) {
              articleContent.filePickerFilePodcast.filename = response2.Item.FileName;
              articleContent.filePickerFilePodcast.fileId = response2.Item.Id
            }).error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          }
          if (response1.Item.LinkFileMovieId != null) {
            ajax.call(cmsServerConfig.configApiServerPath + 'FileContent/GetOne', response1.Item.LinkFileMovieId, 'GET').success(function (response2) {
              articleContent.filePickerFileMovie.filename = response2.Item.FileName;
              articleContent.filePickerFileMovie.fileId = response2.Item.Id
            }).error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          }

          //link to other module
          articleContent.parseFileIds(response1.Item.LinkFileIds);
          articleContent.filePickerFiles.filename = null;
          articleContent.filePickerFiles.fileId = null;

          //Load Keywords tagsInput
          articleContent.kwords = []; //Clear out previous tags
          var arraykwords = [];
          if (
            articleContent.selectedItem.Keyword != null &&
            articleContent.selectedItem.Keyword != ""
          )
            arraykwords = articleContent.selectedItem.Keyword.split(",");
          $.each(arraykwords, function (index, item) {
            if (item != null) articleContent.kwords.push({
              text: item
            }); //Add current content's tag to tags array with id and title
          });
          $modal.open({
            templateUrl: "cpanelv1/Modulearticle/articleContent/edit.html",
            scope: $scope
          });
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };



    // Add New Content
    articleContent.addNewContent = function (frm) {
      if (frm.$invalid) return;
      articleContent.categoryBusyIndicator.isActive = true;
      articleContent.addRequested = true;

      //Save attached file ids into articleContent.selectedItem.LinkFileIds
      articleContent.selectedItem.LinkFileIds = "";
      articleContent.stringfyLinkFileIds();
      //Save Keywords
      $.each(articleContent.kwords, function (index, item) {
        if (index == 0) articleContent.selectedItem.Keyword = item.text;
        else articleContent.selectedItem.Keyword += "," + item.text;
      });
      if (
        articleContent.selectedItem.LinkCategoryId == null ||
        articleContent.selectedItem.LinkCategoryId == 0
      ) {
        rashaErManage.showMessage($filter('translatentk')('to_add_a_article_please_select_the_category'));
        return;
      }
      var apiSelectedItem = articleContent.selectedItem;

      ajax.call(cmsServerConfig.configApiServerPath + "articleContent/add", apiSelectedItem, "POST").success(function (response) {
          rashaErManage.checkAction(response);
          articleContent.categoryBusyIndicator.isActive = false;
          if (response.IsSuccess) {
            articleContent.selectedItem.LinkSourceId = articleContent.selectedItem.Id;

            articleContent.ListItems.unshift(response.Item);
            articleContent.gridOptions.fillData(articleContent.ListItems);
            articleContent.closeModal();
            //Save inputTags

            $.each(articleContent.tags, function (index, item) {
              if (item.id > 0) {
                item.LinkTagId = item.id;
                item.LinkContentId = response.Item.Id;
              }
            });
            ajax.call(cmsServerConfig.configApiServerPath + "articleContentTag/addbatch", articleContent.tags, "POST").success(function (response) {
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
          articleContent.addRequested = false;
          articleContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Edit Content
    articleContent.editContent = function (frm) {
      if (frm.$invalid) return;
      articleContent.categoryBusyIndicator.isActive = true;
      articleContent.addRequested = true;
      //Save attached file ids into articleContent.selectedItem.LinkFileIds
      articleContent.selectedItem.LinkFileIds = "";
      articleContent.stringfyLinkFileIds();
      //Save Keywords
      $.each(articleContent.kwords, function (index, item) {
        if (index == 0) articleContent.selectedItem.Keyword = item.text;
        else articleContent.selectedItem.Keyword += "," + item.text;
      });




      //Save inputTags
      $.each(articleContent.tags, function (index, item) {
        if (item.id > 0) {
          item.LinkTagId = item.id;
          item.LinkContentId = articleContent.selectedItem.Id;
        }
      });
      articleContent.ContentTagsRemoved = differenceInFirstArray(articleContent.selectedItem.ContentTags, articleContent.tags, 'LinkTagId');
      articleContent.ContentTagsAdded = differenceInFirstArray(articleContent.tags, articleContent.selectedItem.ContentTags, 'LinkTagId');
      //remove
      if (articleContent.ContentTagsRemoved && articleContent.ContentTagsRemoved.length > 0) {
        ajax.call(cmsServerConfig.configApiServerPath + "articleContentTag/DeleteList", articleContent.ContentTagsRemoved, "Delete").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //Add
      if (articleContent.ContentTagsAdded && articleContent.ContentTagsAdded.length > 0) {
        ajax.call(cmsServerConfig.configApiServerPath + "articleContentTag/addbatch", articleContent.ContentTagsAdded, "POST").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      ///Save inputTags
      ///Save OtherInfos
      articleContent.ContentOtherInfosRemoved = differenceInFirstArray(articleContent.OtherInfosDb, articleContent.OtherInfos, 'Id');
      articleContent.ContentOtherInfosAdded = differenceInFirstArray(articleContent.OtherInfos, articleContent.OtherInfosDb, 'Id');
      articleContent.ContentOtherInfosEdit = [];
      $.each(articleContent.OtherInfos, function (index, item) {
        if (item.Edited && item.Id && item.Id > 0)
          articleContent.ContentOtherInfosEdit.push(item);
      });

      //remove
      if (articleContent.ContentOtherInfosRemoved && articleContent.ContentOtherInfosRemoved.length > 0) {
        var OtherInfosRemovedModel = [];
        $.each(articleContent.ContentOtherInfosRemoved, function (index, item) {
          OtherInfosRemovedModel.push(item);
        });
        ajax.call(cmsServerConfig.configApiServerPath + "articleContentOtherInfo/DeleteList", OtherInfosRemovedModel, "Delete").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //Add
      if (articleContent.ContentOtherInfosAdded && articleContent.ContentOtherInfosAdded.length > 0) {
        var OtherInfosAddModel = [];
        $.each(articleContent.ContentOtherInfosAdded, function (index, item) {
          OtherInfosAddModel.push(item);
        });
        ajax.call(cmsServerConfig.configApiServerPath + "articleContentOtherInfo/addbatch", OtherInfosAddModel, "POST").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //edit
      if (articleContent.ContentOtherInfosEdit && articleContent.ContentOtherInfosEdit.length > 0) {
        ajax.call(cmsServerConfig.configApiServerPath + "articleContentOtherInfo/editbatch", articleContent.ContentOtherInfosEdit, "PUT").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //edit
      ///Save OtherInfos
      ///Save Similars
      articleContent.ContentSimilarsRemoved = differenceInFirstArray(articleContent.SimilarsDb, articleContent.Similars, 'Id');
      articleContent.ContentSimilarsAdded = differenceInFirstArray(articleContent.Similars, articleContent.SimilarsDb, 'Id');
      //remove
      if (articleContent.ContentSimilarsRemoved && articleContent.ContentSimilarsRemoved.length > 0) {
        var SimilarsRemovedModel = [];
        $.each(articleContent.ContentSimilarsRemoved, function (index, item) {
          SimilarsRemovedModel.push({
            LinkSourceId: articleContent.selectedItem.Id,
            LinkDestinationId: item.Id
          });
        });
        ajax.call(cmsServerConfig.configApiServerPath + "articleContentSimilar/DeleteList", SimilarsRemovedModel, "Delete").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //Add
      if (articleContent.ContentSimilarsAdded && articleContent.ContentSimilarsAdded.length > 0) {
        var SimilarsAddModel = [];
        $.each(articleContent.ContentSimilarsAdded, function (index, item) {
          SimilarsAddModel.push({
            LinkSourceId: articleContent.selectedItem.Id,
            LinkDestinationId: item.Id
          });
        });
        ajax.call(cmsServerConfig.configApiServerPath + "articleContentSimilar/addbatch", SimilarsAddModel, "POST").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      ///Save Similars

      ///Save ModulesRelationship
      articleContent.ContentModuleRelationShipRemoved = differenceInFirstArray(articleContent.ModuleRelationShipDb, articleContent.ModuleRelationShip, '');
      articleContent.ContentModuleRelationShipAdded = differenceInFirstArray(articleContent.ModuleRelationShip, articleContent.ModuleRelationShipDb, '');
      //remove
      if (articleContent.ContentModuleRelationShipRemoved && articleContent.ContentModuleRelationShipRemoved.length > 0) {

        ajax.call(cmsServerConfig.configApiServerPath + "ModulesRelationshipContent/DeleteList", articleContent.ContentModuleRelationShipRemoved, "Delete").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //Add
      if (articleContent.ContentModuleRelationShipAdded && articleContent.ContentModuleRelationShipAdded.length > 0) {

        ajax.call(cmsServerConfig.configApiServerPath + "ModulesRelationshipContent/addbatch", articleContent.ContentModuleRelationShipAdded, "POST").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      ///Save ModulesRelationship
      if (
        articleContent.selectedItem.LinkCategoryId == null ||
        articleContent.selectedItem.LinkCategoryId == 0
      ) {
        rashaErManage.showMessage($filter('translatentk')('to_add_a_article_please_select_the_category'));
        return;
      }
      var apiSelectedItem = {};
      apiSelectedItem = angular.extend(apiSelectedItem, articleContent.selectedItem);
      apiSelectedItem.OtherInfos = [];
      ajax
        .call(cmsServerConfig.configApiServerPath + "articleContent/edit", apiSelectedItem, "PUT")
        .success(function (response) {
          articleContent.categoryBusyIndicator.isActive = false;
          articleContent.addRequested = false;
          articleContent.treeConfig.showbusy = false;
          articleContent.showIsBusy = false;
          rashaErManage.checkAction(response);
          if (response.IsSuccess) {
            articleContent.replaceItem(articleContent.selectedItem.Id, response.Item);
            articleContent.gridOptions.fillData(articleContent.ListItems);
            articleContent.closeModal();
          }
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          articleContent.addRequested = false;
          articleContent.categoryBusyIndicator.isActive = false;
        });


    };








    // Delete a article Content
    articleContent.deleteContent = function () {
      if (buttonIsPressed) {
        return;
      }
      if (!articleContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
        //rashaErManage.showMessage($filter('translatentk')('Tag'));
        return;
      }
      articleContent.treeConfig.showbusy = true;
      articleContent.showIsBusy = true;
      rashaErManage.showYesNo(
        ($filter('translatentk')('warning')),
        ($filter('translatentk')('do_you_want_to_delete_this_attribute')),
        function (isConfirmed) {
          if (isConfirmed) {
            articleContent.categoryBusyIndicator.isActive = true;
            articleContent.showbusy = true;
            articleContent.showIsBusy = true;
            buttonIsPressed = true;
            ajax
              .call(
                cmsServerConfig.configApiServerPath + "articleContent/GetOne",
                articleContent.gridOptions.selectedRow.item.Id,
                "GET"
              )
              .success(function (response) {
                buttonIsPressed = false;
                articleContent.showbusy = false;
                articleContent.showIsBusy = false;
                rashaErManage.checkAction(response);
                articleContent.selectedItemForDelete = response.Item;
                ajax
                  .call(
                    cmsServerConfig.configApiServerPath + "articleContent/delete",
                    articleContent.selectedItemForDelete,
                    "POST"
                  )
                  .success(function (res) {
                    articleContent.categoryBusyIndicator.isActive = false;
                    articleContent.treeConfig.showbusy = false;
                    articleContent.showIsBusy = false;
                    rashaErManage.checkAction(res);
                    if (res.IsSuccess) {
                      articleContent.replaceItem(
                        articleContent.selectedItemForDelete.Id
                      );
                      articleContent.gridOptions.fillData(articleContent.ListItems);
                    }
                  })
                  .error(function (data2, errCode2, c2, d2) {
                    rashaErManage.checkAction(data2);
                    articleContent.treeConfig.showbusy = false;
                    articleContent.showIsBusy = false;
                    articleContent.categoryBusyIndicator.isActive = false;
                  });
              })
              .error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                articleContent.treeConfig.showbusy = false;
                articleContent.showIsBusy = false;
                articleContent.categoryBusyIndicator.isActive = false;
              });
          }
        }
      );
    };

    //Confirm/UnConfirm article Content
    articleContent.confirmUnConfirmarticleContent = function () {
      if (!articleContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
        return;
      }
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "articleContent/GetOne",
          articleContent.gridOptions.selectedRow.item.Id,
          "GET"
        )
        .success(function (response) {
          rashaErManage.checkAction(response);
          articleContent.selectedItem = response.Item;
          articleContent.selectedItem.IsAccepted = response.Item.IsAccepted == true ?
            false :
            true;
          ajax
            .call(cmsServerConfig.configApiServerPath + "articleContent/edit", articleContent.selectedItem, "PUT")
            .success(function (response2) {
              rashaErManage.checkAction(response2);
              if (response2.IsSuccess) {
                var index = articleContent.ListItems.indexOf(
                  articleContent.gridOptions.selectedRow.item
                );
                if (index !== -1) {
                  articleContent.ListItems[index] = response2.Item;
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
    articleContent.enableArchive = function () {
      if (!articleContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
        return;
      }

      ajax
        .call(
          cmsServerConfig.configApiServerPath + "articleContent/GetOne",
          articleContent.gridOptions.selectedRow.item.Id,
          "GET"
        )
        .success(function (response) {
          rashaErManage.checkAction(response);
          articleContent.selectedItem = response.Item;
          articleContent.selectedItem.IsArchive = response.Item.IsArchive == true ?
            false :
            true;
          ajax
            .call(cmsServerConfig.configApiServerPath + "articleContent/edit", articleContent.selectedItem, "PUT")
            .success(function (response2) {
              articleContent.categoryBusyIndicator.isActive = true;
              rashaErManage.checkAction(response2);
              if (response2.IsSuccess) {
                var index = articleContent.ListItems.indexOf(
                  articleContent.gridOptions.selectedRow.item
                );
                if (index !== -1) {
                  articleContent.ListItems[index] = response2.Item;
                }
                articleContent.categoryBusyIndicator.isActive = false;
              }
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
              articleContent.categoryBusyIndicator.isActive = false;
            });
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          articleContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Replace Item OnDelete/OnEdit Grid Options
    articleContent.replaceItem = function (oldId, newItem) {
      angular.forEach(articleContent.ListItems, function (item, key) {
        if (item.Id == oldId) {
          var index = articleContent.ListItems.indexOf(item);
          articleContent.ListItems.splice(index, 1);
        }
      });
      if (newItem) articleContent.ListItems.unshift(newItem);
    };

    articleContent.summernoteOptions = {
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

    //articleContent.summernoteText = '<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />';

    articleContent.searchData = function () {
      articleContent.categoryBusyIndicator.isActive = true;
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "articleContent/getall",
          articleContent.gridOptions.advancedSearchData.engine,
          "POST"
        )
        .success(function (response) {
          rashaErManage.checkAction(response);
          articleContent.categoryBusyIndicator.isActive = false;
          articleContent.ListItems = response.ListItems;
          articleContent.gridOptions.fillData(articleContent.ListItems);
          articleContent.gridOptions.currentPageNumber =
            response.CurrentPageNumber;
          articleContent.gridOptions.totalRowCount = response.TotalRowCount;
          articleContent.gridOptions.rowPerPage = response.RowPerPage;
          articleContent.allowedSearch = response.AllowedSearchField;
        })
        .error(function (data, errCode, c, d) {
          articleContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
        });
    };

    //Close Model Stack
    articleContent.addRequested = false;
    articleContent.closeModal = function () {
      $modalStack.dismissAll();
    };

    articleContent.showIsBusy = false;

    //Aprove a comment
    articleContent.confirmComment = function (item) {
      if (item.Id && item.Id > 0) {
        item.RecordStatus = 1;
        var itemCopy = angular.copy(item);
        itemCopy.rowOption = null;
        ajax.call(cmsServerConfig.configApiServerPath + 'ArticleComment/edit', itemCopy, 'PUT').success(function (response) {
          rashaErManage.checkAction(response);
          if(response.IsSuccess)
          articleContent.showComment(articleContent.gridOptions.selectedRow.item.Id)
        }).error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
      }
    };

    //Decline a comment
    articleContent.doNotConfirmComment = function (item) {
      if (item.Id && item.Id > 0) {
        item.RecordStatus = 5;//DeniedConfirmed
        var itemCopy = angular.copy(item);
        itemCopy.rowOption = null;
        ajax.call(cmsServerConfig.configApiServerPath + 'ArticleComment/edit', itemCopy, 'PUT').success(function (response) {
          if(response.IsSuccess)
          articleContent.showComment(articleContent.gridOptions.selectedRow.item.Id)
          rashaErManage.checkAction(response);
        }).error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
      }
    };
    //Remove a comment
    articleContent.deleteComment = function (item) {
      if (!item) {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
        return;
      }
      articleContent.treeConfig.showbusy = true;
      articleContent.showIsBusy = true;
      rashaErManage.showYesNo(
        ($filter('translatentk')('warning')),
        "آیا می خواهید این نظر را حذف کنید",
        function (isConfirmed) {
          if (isConfirmed) {

            articleContent.treeConfig.showbusy = true;
            articleContent.showbusy = true;
            articleContent.showIsBusy = true;

            var itemCopy = angular.copy(item);
            itemCopy.rowOption = null;
            ajax.call(cmsServerConfig.configApiServerPath + "articleComment/delete", itemCopy, "POST")
              .success(function (res) {
                articleContent.treeConfig.showbusy = false;
                articleContent.showbusy = false;
                articleContent.showIsBusy = false;
                rashaErManage.checkAction(res);
                if (res.IsSuccess) {
                  articleContent.showComment(articleContent.gridOptions.selectedRow.item.Id)
                  
                }
              })
              .error(function (data2, errCode2, c2, d2) {
                rashaErManage.checkAction(data2);
                articleContent.treeConfig.showbusy = false;
                articleContent.showbusy = false;
                articleContent.showIsBusy = false;
              });

          }
        }
      );
    };

    //For reInit Categories
    articleContent.gridOptions.reGetAll = function () {
      if (articleContent.gridOptions.advancedSearchData.engine.Filters.length > 0)
        articleContent.searchData();
      else articleContent.init();
    };

    articleContent.isCurrentNodeEmpty = function () {
      return !angular.equals({}, articleContent.treeConfig.currentNode);
    };

    articleContent.loadFileAndFolder = function (item) {
      articleContent.treeConfig.currentNode = item;
      articleContent.treeConfig.onNodeSelect(item);
    };

    articleContent.openDate = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $timeout(function () {
        articleContent.focus = true;
      });
    };
    articleContent.openDate1 = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $timeout(function () {
        articleContent.focus1 = true;
      });
    };

    articleContent.columnCheckbox = false;
    articleContent.openGridConfigModal = function () {
      $("#gridView-btn").toggleClass("active");
      var prechangeColumns = articleContent.gridOptions.columns;
      if (articleContent.gridOptions.columnCheckbox) {
        for (var i = 0; i < articleContent.gridOptions.columns.length; i++) {
          //articleContent.gridOptions.columns[i].visible = $("#" + articleContent.gridOptions.columns[i].Id + "Checkbox").is(":checked");
          var element = $(
            "#" +
            articleContent.gridOptions.columns[i].name.replace(".", "") +
            "Checkbox"
          );
          var temp = element[0].checked;
          articleContent.gridOptions.columns[i].visible = temp;
        }
      } else {
        for (var i = 0; i < articleContent.gridOptions.columns.length; i++) {
          var element = $(
            "#" +
            articleContent.gridOptions.columns[i].name.replace(".", "") +
            "Checkbox"
          );
          $(
              "#" + articleContent.gridOptions.columns[i].name + "Checkbox"
            ).checked =
            prechangeColumns[i].visible;
        }
      }
      for (var i = 0; i < articleContent.gridOptions.columns.length; i++) {

      }
      articleContent.gridOptions.columnCheckbox = !articleContent.gridOptions
        .columnCheckbox;
    };

    articleContent.deleteAttachedFile = function (index) {
      articleContent.attachedFiles.splice(index, 1);
    };

    articleContent.addAttachedFile = function (id) {
      var fname = $("#file" + id).text();
      if (
        id != null &&
        id != undefined &&
        !articleContent.alreadyExist(id, articleContent.attachedFiles) &&
        fname != null &&
        fname != ""
      ) {
        var fId = id;
        var file = {
          id: fId,
          name: fname
        };
        articleContent.attachedFiles.push(file);
        if (document.getElementsByName("file" + id).length > 1)
          document.getElementsByName("file" + id)[1].textContent = "";
        else document.getElementsByName("file" + id)[0].textContent = "";
      }
    };

    articleContent.alreadyExist = function (id, array) {
      for (var i = 0; i < array.length; i++) {
        if (id == array[i].fileId) {
          rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
          return true;
        }
      }
      return false;
    };

    articleContent.filePickerMainImage.removeSelectedfile = function (config) {
      articleContent.filePickerMainImage.fileId = null;
      articleContent.filePickerMainImage.filename = null;
      articleContent.selectedItem.LinkMainImageId = null;
    };
    articleContent.filePickerFilePodcast.removeSelectedfile = function (config) {
      articleContent.filePickerFilePodcast.fileId = null;
      articleContent.filePickerFilePodcast.filename = null;
      articleContent.selectedItem.LinkFilePodcastId = null;

    }
    articleContent.filePickerFileMovie.removeSelectedfile = function (config) {
      articleContent.filePickerFileMovie.fileId = null;
      articleContent.filePickerFileMovie.filename = null;
      articleContent.selectedItem.LinkFileMovieId = null;

    }
    articleContent.filePickerFiles.removeSelectedfile = function (config) {
      articleContent.filePickerFiles.fileId = null;
      articleContent.filePickerFiles.filename = null;
    };

    articleContent.showUpload = function () {
      $("#fastUpload").fadeToggle();
    };

    // ----------- FilePicker Codes --------------------------------
    articleContent.addAttachedFile = function (id) {
      var fname = $("#file" + id).text();
      if (fname == "") {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
        return;
      }
      if (
        id != null &&
        id != undefined &&
        !articleContent.alreadyExist(id, articleContent.attachedFiles)
      ) {
        var fId = id;
        var file = {
          fileId: fId,
          filename: fname,
          previewImageSrc: cmsServerConfig.configPathFileByIdAndName + fId + "/" + fname
        };
        articleContent.attachedFiles.push(file);
        articleContent.clearfilePickers();
      }
    };

    articleContent.alreadyExist = function (fieldId, array) {
      for (var i = 0; i < array.length; i++) {
        if (fieldId == array[i].fileId) {
          rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
          articleContent.clearfilePickers();
          return true;
        }
      }
      return false;
    };

    articleContent.deleteAttachedfieldName = function (index) {
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "articleContent/delete",
          articleContent.contractsList[index],
          "POST"
        )
        .success(function (res) {
          rashaErManage.checkAction(res);
          if (res.IsSuccess) {
            articleContent.contractsList.splice(index, 1);
            rashaErManage.showMessage($filter('translatentk')('Removed_Successfully'));
          }
        })
        .error(function (data2, errCode2, c2, d2) {
          rashaErManage.checkAction(data2);
        });
    };

    articleContent.parseFileIds = function (stringOfIds) {
      if (stringOfIds == null || !stringOfIds.trim()) return;
      var fileIds = stringOfIds.split(",");
      if (fileIds.length != undefined) {
        $.each(fileIds, function (index, item) {
          if (item == parseInt(item, 10)) {
            // Check if item is an integer
            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", parseInt(item), "GET").success(function (response) {
                if (response.IsSuccess) {
                  articleContent.attachedFiles.push({
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

    articleContent.clearfilePickers = function () {
      articleContent.filePickerFiles.fileId = null;
      articleContent.filePickerFiles.filename = null;
    };

    articleContent.stringfyLinkFileIds = function () {
      $.each(articleContent.attachedFiles, function (i, item) {
        if (articleContent.selectedItem.LinkFileIds == "")
          articleContent.selectedItem.LinkFileIds = item.fileId;
        else articleContent.selectedItem.LinkFileIds += "," + item.fileId;
      });
    };
    //--------- End FilePickers Codes -------------------------

    //---------------Upload Modal-------------------------------
    articleContent.openUploadModal = function () {
      $modal.open({
        templateUrl: "cpanelv1/Modulearticle/articleContent/upload_modal.html",
        size: "lg",
        scope: $scope
      });

      articleContent.FileList = [];
      //get list of file from category id
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", null, "POST")
        .success(function (response) {
          articleContent.FileList = response.ListItems;
        })
        .error(function (data) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    //---------------Upload Modal Podcast-------------------------------
    articleContent.openUploadModalPodcast = function () {
      $modal.open({
        templateUrl: 'cpanelv1/Modulearticle/articleContent/upload_modalPodcast.html',
        size: 'lg',
        scope: $scope
      });

      articleContent.FileList = [];
      //get list of file from category id
      ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
        articleContent.FileList = response.ListItems;
      }).error(function (data) {
        rashaErManage.checkAction(data, errCode);
      });

    }
    //---------------Upload Modal Movie-------------------------------
    articleContent.openUploadModalMovie = function () {
      $modal.open({
        templateUrl: 'cpanelv1/Modulearticle/articleContent/upload_modalMovie.html',
        size: 'lg',
        scope: $scope
      });

      articleContent.FileList = [];
      //get list of file from category id
      ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
        articleContent.FileList = response.ListItems;
      }).error(function (data) {
        rashaErManage.checkAction(data, errCode);
      });

    }

    articleContent.calcuteProgress = function (progress) {
      wdth = Math.floor(progress * 100);
      return wdth;
    };

    articleContent.whatcolor = function (progress) {
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

    articleContent.canShow = function (pr) {
      if (pr == 1) {
        return true;
      }
      return false;
    };
    // File Manager actions
    articleContent.replaceFile = function (name) {
      articleContent.itemClicked(null, articleContent.fileIdToDelete, "file");
      articleContent.fileTypes = 1;
      articleContent.fileIdToDelete = articleContent.selectedIndex;

      // Delete the file
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", articleContent.fileIdToDelete, "GET")
        .success(function (response1) {
          rashaErManage.checkAction(response1);
          if (response1.IsSuccess == true) {

            ajax
              .call(cmsServerConfig.configApiServerPath + "FileContent/delete", response1.Item, "POST")
              .success(function (response2) {
                articleContent.remove(
                  articleContent.FileList,
                  articleContent.fileIdToDelete
                );
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess == true) {
                  // Save New file
                  ajax
                    .call(cmsServerConfig.configApiServerPath + "FileContent/GetViewModel", "", "GET")
                    .success(function (response3) {
                      rashaErManage.checkAction(response3);

                      if (response3.IsSuccess == true) {
                        articleContent.FileItem = response3.Item;
                        articleContent.FileItem.FileName = name;
                        articleContent.FileItem.Extension = name.split(".").pop();
                        articleContent.FileItem.FileSrc = name;
                        articleContent.FileItem.LinkCategoryId =
                          articleContent.thisCategory;
                        articleContent.saveNewFile();
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
    articleContent.saveNewFile = function () {
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/add", articleContent.FileItem, "POST")
        .success(function (response) {
          if (response.IsSuccess) {
            articleContent.FileItem = response.Item;
            articleContent.showSuccessIcon();
            return 1;
          } else {
            return 0;
          }
        })
        .error(function (data) {
          articleContent.showErrorIcon();
          return -1;
        });
    };

    articleContent.showSuccessIcon = function () {};

    articleContent.showErrorIcon = function () {};
    //file is exist
    articleContent.fileIsExist = function (fileName) {
      for (var i = 0; i < articleContent.FileList.length; i++) {
        if (articleContent.FileList[i].FileName == fileName) {
          articleContent.fileIdToDelete = articleContent.FileList[i].Id;
          return true;
        }
      }
      return false;
    };

    articleContent.getFileItem = function (id) {
      for (var i = 0; i < articleContent.FileList.length; i++) {
        if (articleContent.FileList[i].Id == id) {
          return articleContent.FileList[i];
        }
      }
    };

    //select file or folder
    articleContent.itemClicked = function ($event, index, type) {
      if (type == "file" || type == 1) {
        articleContent.fileTypes = 1;
        articleContent.selectedFileId = articleContent.getFileItem(index).Id;
        articleContent.selectedFileName = articleContent.getFileItem(index).FileName;
      } else {
        articleContent.fileTypes = 2;
        articleContent.selectedCategoryId = articleContent.getCategoryName(index).Id;
        articleContent.selectedCategoryTitle = articleContent.getCategoryName(
          index
        ).Title;
      }
      articleContent.selectedIndex = index;
    };

    articleContent.toggleCategoryButtons = function () {
      $("#categoryButtons").fadeToggle();
    };
    //upload file Podcast
    articleContent.uploadFilePodcast = function (index, uploadFile) {
      if ($("#save-icon" + index).hasClass("fa-save")) {
        if (articleContent.fileIsExist(uploadFile.name)) { // File already exists
          if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
            //------------ articleContent.replaceFile(uploadFile.name);
            articleContent.itemClicked(null, articleContent.fileIdToDelete, "file");
            articleContent.fileTypes = 1;
            articleContent.fileIdToDelete = articleContent.selectedIndex;
            // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                articleContent.fileIdToDelete,
                "GET"
              )
              .success(function (response1) {
                if (response1.IsSuccess == true) {
                  rashaErManage.checkAction(response1);
                  ajax.call(cmsServerConfig.configApiServerPath + "FileContent/replace", response1.Item, "POST")
                    .success(function (response2) {
                      rashaErManage.checkAction(response2);

                      if (response2.IsSuccess == true) {
                        articleContent.FileItem = response2.Item;
                        articleContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        articleContent.filePickerFilePodcast.filename =
                          articleContent.FileItem.FileName;
                        articleContent.filePickerFilePodcast.fileId =
                          response2.Item.Id;
                        articleContent.selectedItem.LinkFilePodcastId =
                          articleContent.filePickerFilePodcast.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function (data) {
                      articleContent.showErrorIcon();
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
            articleContent.FileItem = response.Item;
            articleContent.FileItem.FileName = uploadFile.name;
            articleContent.FileItem.uploadName = uploadFile.uploadName;
            articleContent.FileItem.Extension = uploadFile.name.split('.').pop();
            articleContent.FileItem.FileSrc = uploadFile.name;
            articleContent.FileItem.LinkCategoryId = null; //Save the new file in the root
            // ------- articleContent.saveNewFile()  ----------------------
            var result = 0;
            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/add", articleContent.FileItem, 'POST').success(function (response) {
              if (response.IsSuccess) {
                articleContent.FileItem = response.Item;
                articleContent.showSuccessIcon();
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-check");
                articleContent.filePickerFilePodcast.filename = articleContent.FileItem.FileName;
                articleContent.filePickerFilePodcast.fileId = response.Item.Id;
                articleContent.selectedItem.LinkFilePodcastId = articleContent.filePickerFilePodcast.fileId

              } else {
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-remove");
              }
            }).error(function (data) {
              articleContent.showErrorIcon();
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
    articleContent.uploadFileMovie = function (index, uploadFile) {
      if ($("#save-icon" + index).hasClass("fa-save")) {
        if (articleContent.fileIsExist(uploadFile.name)) { // File already exists
          if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
            //------------ articleContent.replaceFile(uploadFile.name);
            articleContent.itemClicked(null, articleContent.fileIdToDelete, "file");
            articleContent.fileTypes = 1;
            articleContent.fileIdToDelete = articleContent.selectedIndex;
            // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                articleContent.fileIdToDelete,
                "GET"
              )
              .success(function (response1) {
                if (response1.IsSuccess == true) {
                  rashaErManage.checkAction(response1);
                  ajax.call(cmsServerConfig.configApiServerPath + "FileContent/replace", response1.Item, "POST")
                    .success(function (response2) {
                      rashaErManage.checkAction(response2);

                      if (response2.IsSuccess == true) {
                        articleContent.FileItem = response2.Item;
                        articleContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        articleContent.filePickerFileMovie.filename =
                          articleContent.FileItem.FileName;
                        articleContent.filePickerFileMovie.fileId =
                          response2.Item.Id;
                        articleContent.selectedItem.LinkFileMovieId =
                          articleContent.filePickerFileMovie.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function (data) {
                      articleContent.showErrorIcon();
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
            articleContent.FileItem = response.Item;
            articleContent.FileItem.FileName = uploadFile.name;
            articleContent.FileItem.uploadName = uploadFile.uploadName;
            articleContent.FileItem.Extension = uploadFile.name.split('.').pop();
            articleContent.FileItem.FileSrc = uploadFile.name;
            articleContent.FileItem.LinkCategoryId = null; //Save the new file in the root
            // ------- articleContent.saveNewFile()  ----------------------
            var result = 0;
            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/add", articleContent.FileItem, 'POST').success(function (response) {
              if (response.IsSuccess) {
                articleContent.FileItem = response.Item;
                articleContent.showSuccessIcon();
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-check");
                articleContent.filePickerFileMovie.filename = articleContent.FileItem.FileName;
                articleContent.filePickerFileMovie.fileId = response.Item.Id;
                articleContent.selectedItem.LinkFileMovieId = articleContent.filePickerFileMovie.fileId

              } else {
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-remove");
              }
            }).error(function (data) {
              articleContent.showErrorIcon();
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
    articleContent.uploadFile = function (index, uploadFile) {
      if ($("#save-icon" + index).hasClass("fa-save")) {
        if (articleContent.fileIsExist(uploadFile.name)) {
          // File already exists
          if (
            confirm(
              'File "' +
              uploadFile.name +
              '" already exists! Do you want to replace the new file?'
            )
          ) {
            //------------ articleContent.replaceFile(uploadFile.name);
            articleContent.itemClicked(null, articleContent.fileIdToDelete, "file");
            articleContent.fileTypes = 1;
            articleContent.fileIdToDelete = articleContent.selectedIndex;
            // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                articleContent.fileIdToDelete,
                "GET"
              )
              .success(function (response1) {
                rashaErManage.checkAction(response1);
                if (response1.IsSuccess == true) {
                  ajax.call(cmsServerConfig.configApiServerPath + "FileContent/replace", response1.Item, "POST")
                    .success(function (response2) {
                      if (response2.IsSuccess == true) {
                        articleContent.FileItem = response2.Item;
                        articleContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        articleContent.filePickerMainImage.filename =
                          articleContent.FileItem.FileName;
                        articleContent.filePickerMainImage.fileId =
                          response2.Item.Id;
                        articleContent.selectedItem.LinkMainImageId =
                          articleContent.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function (data) {
                      articleContent.showErrorIcon();
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
              articleContent.FileItem = response.Item;
              articleContent.FileItem.FileName = uploadFile.name;
              articleContent.FileItem.uploadName = uploadFile.uploadName;
              articleContent.FileItem.Extension = uploadFile.name.split(".").pop();
              articleContent.FileItem.FileSrc = uploadFile.name;
              articleContent.FileItem.LinkCategoryId = null; //Save the new file in the root
              // ------- articleContent.saveNewFile()  ----------------------
              var result = 0;
              ajax
                .call(cmsServerConfig.configApiServerPath + "FileContent/add", articleContent.FileItem, "POST")
                .success(function (response) {
                  if (response.IsSuccess) {
                    articleContent.FileItem = response.Item;
                    articleContent.showSuccessIcon();
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-check");
                    articleContent.filePickerMainImage.filename =
                      articleContent.FileItem.FileName;
                    articleContent.filePickerMainImage.fileId = response.Item.Id;
                    articleContent.selectedItem.LinkMainImageId =
                      articleContent.filePickerMainImage.fileId;
                  } else {
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-remove");
                  }
                })
                .error(function (data) {
                  articleContent.showErrorIcon();
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
    articleContent.exportFile = function () {
      articleContent.addRequested = true;
      articleContent.gridOptions.advancedSearchData.engine.ExportFile =
        articleContent.ExportFileClass;
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "articleContent/exportfile",
          articleContent.gridOptions.advancedSearchData.engine,
          "POST"
        )
        .success(function (response) {
          articleContent.addRequested = false;
          rashaErManage.checkAction(response);
          if (response.IsSuccess) {
            articleContent.exportDownloadLink =
              window.location.origin + response.LinkFile;
            $window.open(response.LinkFile, "_blank");
            //articleContent.closeModal();
          }
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    //Open Export Report Modal
    articleContent.toggleExportForm = function () {
      articleContent.SortType = [{
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
      articleContent.EnumExportFileType = [{
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
      articleContent.EnumExportReceiveMethod = [{
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
      articleContent.ExportFileClass = {
        FileType: 1,
        RecieveMethod: 0,
        RowCount: 100
      };
      articleContent.exportDownloadLink = null;
      $modal.open({
        templateUrl: "cpanelv1/ModuleArticle/ArticleContent/report.html",
        scope: $scope
      });
    };
    //Row Count Export Input Change
    articleContent.rowCountChanged = function () {
      if (
        !angular.isDefined(articleContent.ExportFileClass.RowCount) ||
        articleContent.ExportFileClass.RowCount > 5000
      )
        articleContent.ExportFileClass.RowCount = 5000;
    };
    //Get TotalRowCount
    articleContent.getCount = function () {
      ajax.call(cmsServerConfig.configApiServerPath + "articleContent/count", articleContent.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
          articleContent.addRequested = false;
          rashaErManage.checkAction(response);
          articleContent.ListItemsTotalRowCount = ": " + response.TotalRowCount;
        })
        .error(function (data, errCode, c, d) {
          articleContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
        });
    };

    articleContent.showCategoryImage = function (mainImageId) {
      if (mainImageId == 0 || mainImageId == null) return;
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/PreviewImage", {
          id: mainImageId,
          name: ""
        }, "POST")
        .success(function (response) {
          articleContent.selectedItem.MainImageSrc = response;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };

    //TreeControl
    articleContent.treeOptions = {
      nodeChildren: "Children",
      multiSelection: false,
      isLeaf: function (node) {
        if (node.FileName == undefined || node.Filename == "") return false;
        return true;
      },
      isSelectable: function (node) {
        if (articleContent.treeOptions.dirSelectable)
          if (angular.isDefined(node.FileName)) return false;
        return true;
      },
      dirSelectable: false
    };

    articleContent.onNodeToggle = function (node, expanded) {
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


    articleContent.onSelection = function (node, selected) {
      if (!selected) {
        articleContent.selectedItem.LinkMainImageId = null;
        articleContent.selectedItem.previewImageSrc = null;
        return;
      }
      articleContent.selectedItem.LinkMainImageId = node.Id;
      articleContent.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages + "loader.gif";
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", node.Id, "GET")
        .success(function (response) {
          articleContent.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    //End of TreeControl
  }
]);