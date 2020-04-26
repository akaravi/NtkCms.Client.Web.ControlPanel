app.controller("blogContentController", [
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
    var blogContent = this;
    //شناسه اینام این ماژول در ارتباطات
    //Blog_WrapperBlogContent
    ModuleRelationShipModuleNameMain = 10;
    blogContent.RouteUploadFileContent = cmsServerConfig.configRouteUploadFileContent;
    var edititem = false;
    //For Grid Options
    blogContent.gridOptions = {};
    blogContent.selectedItem = {};
    blogContent.selectedItemRelationship = {};
    blogContent.attachedFiles = [];

    blogContent.filePickerMainImage = {
      isActive: true,
      backElement: "filePickerMainImage",
      filename: null,
      fileId: null,
      multiSelect: false
    };
    blogContent.filePickerFilePodcast = {
      isActive: true,
      backElement: 'filePickerFilePodcast',
      filename: null,
      fileId: null,
      extension: 'mp3',
      multiSelect: false,
    }

    blogContent.filePickerFileMovie = {
      isActive: true,
      backElement: 'filePickerFileMovie',
      filename: null,
      fileId: null,
      extension: 'mp4,avi',
      multiSelect: false,
    }
    blogContent.filePickerFiles = {
      isActive: true,
      backElement: "filePickerFiles",
      multiSelect: false,
      fileId: null,
      filename: null
    };
    blogContent.locationChanged = function (lat, lang) {
      //console.log("ok " + lat + " " + lang);
    }
    blogContent.selectedContentId = {
      Id: $stateParams.ContentId,
      TitleTag: $stateParams.TitleTag
    };
    blogContent.GeolocationConfig = {
      latitude: 'Geolocationlatitude',
      longitude: 'Geolocationlongitude',
      onlocationChanged: blogContent.locationChanged,
      useCurrentLocation: true,
      center: {
        lat: 32.658066,
        lng: 51.6693815
      },
      zoom: 4,
      scope: blogContent,
      useCurrentLocationZoom: 12,
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) {
      blogContent.itemRecordStatus = itemRecordStatus;
    }
    var date = moment().format();
    blogContent.selectedItem.ExpireDate = date;
  
    //#help/ سلکتور دسته بندی در ویرایش محتوا
    blogContent.LinkCategoryIdSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkCategoryId",
      url: "BlogCategory",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: blogContent,
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
    blogContent.SimilarsSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "Iddddd",
      url: "BlogContent",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: blogContent,
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
    blogContent.LinkModuleContentIdOtherSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkModuleContentIdOther",
      url: "blogContent",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: blogContent,
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


    blogContent.selectedItemModuleRelationShip = [];
    blogContent.ModuleRelationShip = [];


    blogContent.moveSelectedRelationOnAdd = function () {
      if (!blogContent.LinkModuleContentIdOtherSelector.selectedItem.Id || !blogContent.selectedItemModuleRelationShip.ModuleNameOther) {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_RelationShip'));
        return;
      }
      if (!blogContent.selectedItemModuleRelationShip.Title || blogContent.selectedItemModuleRelationShip.Title.length == 0)
        blogContent.selectedItemModuleRelationShip.Title = blogContent.LinkModuleContentIdOtherSelector.filterText;
      for (var i = 0; i < blogContent.ModuleRelationShip.length; i++) {
        if (blogContent.ModuleRelationShip[i].Id == blogContent.LinkModuleContentIdOtherSelector.selectedItem.Id) {
          rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
          return;
        }
      }
      blogContent.ModuleRelationShip.push({
        Title: blogContent.selectedItemModuleRelationShip.Title,
        ModuleNameOther: blogContent.selectedItemModuleRelationShip.ModuleNameOther.Value,
        LinkModuleContentIdOther: blogContent.LinkModuleContentIdOtherSelector.selectedItem.Id,
        ModuleNameMain: ModuleRelationShipModuleNameMain,
        LinkModuleContentIdMain: blogContent.gridOptions.selectedRow.item.Id
      });
      blogContent.selectedItemModuleRelationShip = [];
      blogContent.LinkModuleContentIdOtherSelector.LinkModuleContentIdOther = 0;
    };
    blogContent.moveSelectedRelationOnEdit = function () {
      if (!blogContent.LinkModuleContentIdOtherSelector.selectedItem.Id || !blogContent.selectedItemRelationship.ModuleNameOther) {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_RelationShip'));
        return;
      }
      if (!blogContent.selectedItemRelationship.Title || blogContent.selectedItemRelationship.Title.length == 0)
        blogContent.selectedItemRelationship.Title = blogContent.LinkModuleContentIdOtherSelector.filterText;

      for (var i = 0; i < blogContent.ModuleRelationShip.length; i++) {
        if (blogContent.ModuleRelationShip[i].Id == blogContent.LinkModuleContentIdOtherSelector.selectedItem.Id &&
          blogContent.ModuleRelationShip[i].LinkModuleContentIdOther == blogContent.selectedItemRelationship.ModuleNameOther.Value) {
          rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
          return;
        }
      }

      blogContent.ModuleRelationShip.push({
        Title: blogContent.selectedItemRelationship.Title,
        ModuleNameOther: blogContent.selectedItemRelationship.ModuleNameOther.Value,
        LinkModuleContentIdOther: blogContent.LinkModuleContentIdOtherSelector.selectedItem.Id,
        ModuleNameMain: ModuleRelationShipModuleNameMain,
        LinkModuleContentIdMain: blogContent.gridOptions.selectedRow.item.Id
      });
      blogContent.selectedItemRelationship = [];
      blogContent.LinkModuleContentIdOtherSelector.LinkModuleContentIdOther = 0;
    };

    blogContent.removeFromCollectionRelationShip = function (deleteItem) {
      for (var i = 0; i < blogContent.ModuleRelationShip.length; i++) {
        if (blogContent.ModuleRelationShip[i].LinkModuleContentIdOther == deleteItem.LinkModuleContentIdOther &&
          blogContent.ModuleRelationShip[i].ModuleNameOther == deleteItem.ModuleNameOther
        ) {
          blogContent.ModuleRelationShip.splice(i, 1);
          return;
        }
      }
    };
    blogContent.removeFromCollectionOtherInfo = function (deleteItem) {
      for (var i = 0; i < blogContent.OtherInfos.length; i++) {
        if (blogContent.OtherInfos[i].Id == deleteItem.Id) {
          blogContent.OtherInfos.splice(i, 1);
          return;
        }
      }
    };
    blogContent.removeFromCollectionSimilars = function (deleteItem) {
      for (var i = 0; i < blogContent.Similars.length; i++) {
        if (blogContent.Similars[i].Id == deleteItem.Id) {
          blogContent.Similars.splice(i, 1);
          return;
        }
      }
    };
    blogContent.editFromCollectionOtherInfo = function (editItem) {
      blogContent.todoModeTitle = $filter('translatentk')('edit_now');
      blogContent.editMode = true;
      blogContent.selectedItemOtherInfos = angular.copy(editItem);
      $scope.currentItemIndex = blogContent.OtherInfos.indexOf(editItem);
    };

    //#help otherInfo

    blogContent.editOtherInfo = function (y) {
      if (y == null || y == undefined || y.Title == "" || y.Title == undefined || y.HtmlBody == "" || y.HtmlBody == undefined) {
        rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
        return;
      }
      edititem = true;
      blogContent.selectedItemOtherInfos.Title = y.Title;
      blogContent.selectedItemOtherInfos.HtmlBody = y.HtmlBody;
      blogContent.selectedItemOtherInfos.Source = y.Source;
      blogContent.removeFromOtherInfo(blogContent.OtherInfos, y.Title, y.HtmlBody, y.Source);
    };
    blogContent.changSelectedRelationModuleAdd = function () {
      blogContent.LinkModuleContentIdOtherSelector.url = blogContent.selectedItemModuleRelationShip.ModuleNameOther.Key.split(/Wrapper(.+)/)[1];
      blogContent.LinkModuleContentIdOtherSelector.selectedItem = {};
      blogContent.selectedItem.LinkModuleContentIdOther = {};
    }
    blogContent.changSelectedRelationModuleEdit = function () {
      blogContent.LinkModuleContentIdOtherSelector.url = blogContent.selectedItemRelationship.ModuleNameOther.Key.split(/Wrapper(.+)/)[1];
      blogContent.LinkModuleContentIdOtherSelector.selectedItem = {};
      blogContent.selectedItem.LinkModuleContentIdOther = {};
    }
    blogContent.UrlContent = "";
    //blog Grid Options
    blogContent.gridOptions = {
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
          template: '<li ng-if="!x.IsActivated" class="dropdown" dropdown="" style="display: initial;"><a aria-expanded="false" aria-haspopup="true" class="dropdown-toggle count-info" href="" dropdown-toggle=""><i class="fa fa-cog" ></i></a><ul class="dropdown-menu animated fadeInLeft m-t-xs" style="right: -142px;"><li><a ng-click="blogContent.addMenu()" style="color:black">AddMenu</a></li><li><a ng-click="blogContent.showComment(x.Id)" style="color:black">CommentList</a></li></ul></li>'
        }

      ],
      data: {},
      multiSelect: false,
      advancedSearchData: {
        engine: {}
      }
    };
    //Comment Grid Options
    blogContent.gridContentOptions = {
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
            '<Button ng-if="(x.RecordStatus!=1)" ng-click="blogContent.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتایید می کنم</Button>' +
            '<Button ng-if="(x.RecordStatus==1)" ng-click="blogContent.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspغیرفعال می کنم</Button>' +
            '<Button ng-click="blogContent.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>'
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
    blogContent.gridOptions.advancedSearchData.engine.Filters = null;
    blogContent.gridOptions.advancedSearchData.engine.Filters = [];

    //For Show Category Loading Indicator
    blogContent.categoryBusyIndicator = {
      isActive: true,
      message: "در حال بارگذاری دسته ها ..."
    };
    //For Show blog Loading Indicator
    blogContent.contentBusyIndicator = {
      isActive: false,
      message: "در حال بارگذاری ..."
    };
    //Tree Config
    blogContent.treeConfig = {
      displayMember: "Title",
      displayId: "Id",
      displayChild: "Children"
    };

    //open addMenu modal
    blogContent.addMenu = function () {

      $modal.open({
        templateUrl: "cpanelv1/Moduleblog/blogContent/modalMenu.html",
        scope: $scope
      });
    };

    blogContent.treeConfig.currentNode = {};
    blogContent.treeBusyIndicator = false;

    blogContent.addRequested = false;

    blogContent.showGridComment = false;
    blogContent.blogTitle = "";

    //init Function
    blogContent.init = function () {
      blogContent.categoryBusyIndicator.isActive = true;

      var engine = {};
      try {
        engine = blogContent.gridOptions.advancedSearchData.engine;
      } catch (error) {
        //console.log(error);
      }
      ajax.call(cmsServerConfig.configApiServerPath + "ModulesRelationshipContent/GetEnum", {}, 'POST').success(function (response) {
        rashaErManage.checkAction(response);
        blogContent.EnumModuleRelationshipName = response.ListItems;
        if (blogContent.EnumModuleRelationshipName && blogContent.EnumModuleRelationshipName.length) {
          var retFind = findWithAttr(blogContent.EnumModuleRelationshipName, "Key", "Blog_WrapperBlogContent");
          if (retFind >= 0)
            ModuleRelationShipModuleNameMain = blogContent.EnumModuleRelationshipName[retFind].Value;
        }
      }).error(function (data, errCode, c, d) {
        rashaErManage.checkAction(data, errCode);
      });
      blogContent.categoryBusyIndicator.isActive = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "blogCategory/getall", {
          RowPerPage: 1000
        }, "POST")
        .success(function (response) {
          rashaErManage.checkAction(response);
          blogContent.treeConfig.Items = response.ListItems;
          blogContent.categoryBusyIndicator.isActive = false;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
      filterModel = {
        PropertyName: "ContentTags",
        PropertyAnyName: "LinkTagId",
        SearchType: 0,
        IntValue1: blogContent.selectedContentId.Id
      };
      if (blogContent.selectedContentId.Id > 0)
        blogContent.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
      blogContent.contentBusyIndicator.isActive = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "blogContent/getall", blogContent.gridOptions.advancedSearchData.engine, "POST")
        .success(function (response) {
          rashaErManage.checkAction(response);
          blogContent.ListItems = response.ListItems;
          blogContent.gridOptions.fillData(
            blogContent.ListItems,
            response.resultAccess
          ); // Sending Access as an argument
          blogContent.contentBusyIndicator.isActive = false;
          blogContent.gridOptions.currentPageNumber =
            response.CurrentPageNumber;
          blogContent.gridOptions.totalRowCount = response.TotalRowCount;
          blogContent.gridOptions.rowPerPage = response.RowPerPage;
          blogContent.gridOptions.maxSize = 5;
        })
        .error(function (data, errCode, c, d) {
          blogContent.contentBusyIndicator.isActive = false;
          blogContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
          blogContent.contentBusyIndicator.isActive = false;
        });

      ajax.call(cmsServerConfig.configApiServerPath + "blogContentTag/GetViewModel", "", "GET").success(function (response) { //Get a ViewModel for blogContentTag
          blogContent.ModuleContentTag = response.Item;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);;
        });
    };
    blogContent.EnumModuleName = function (enumId) {
      if (!blogContent.EnumModuleRelationshipName || blogContent.EnumModuleRelationshipName.length == 0)
        return enumId;
      var retFind = findWithAttr(blogContent.EnumModuleRelationshipName, "Value", enumId);
      if (retFind < 0)
        return enumId;
      return blogContent.EnumModuleRelationshipName[retFind].Description;
    }
    // For Show Comments
    blogContent.showComment = function (LinkContentId) {
      //blogContent.contentBusyIndicator = true;
      engine = {};
      var filterValue = {
        PropertyName: "LinkContentId",
        IntValue1: parseInt(LinkContentId),
        SearchType: 0
      }
      blogContent.busyIndicatorForDropDownProcess = true;
      engine.Filters = null;
      engine.Filters = [];
      engine.Filters.push(filterValue);
      ajax.call(cmsServerConfig.configApiServerPath + "blogcomment/getall", engine, 'POST').success(function (response) {
        rashaErManage.checkAction(response);
        blogContent.ListCommentItems = response.ListItems;
        blogContent.gridContentOptions.fillData(blogContent.ListCommentItems, response.resultAccess); // Sending Access as an argument
        blogContent.showGridComment = true;
        blogContent.gridContentOptions.currentPageNumber = response.CurrentPageNumber;
        blogContent.gridContentOptions.totalRowCount = response.TotalRowCount;
        blogContent.gridContentOptions.rowPerPage = response.RowPerPage;
        blogContent.gridContentOptions.maxSize = 5;
        $('html, body').animate({
          scrollTop: $("#ListComment").offset().top
        }, 850);
      }).error(function (data, errCode, c, d) {
        blogContent.gridContentOptions.fillData();
        rashaErManage.checkAction(data, errCode);
        blogContent.contentBusyIndicator.isActive = false;
      });
    };


    blogContent.gridContentOptions.onRowSelected = function () {};

    // Open Add Category Modal
    blogContent.addNewCategoryModel = function () {
      if (buttonIsPressed) {
        return;
      }
      blogContent.addRequested = false;
      buttonIsPressed = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "blogCategory/GetViewModel", "", "GET")
        .success(function (response) {
          buttonIsPressed = false;
          rashaErManage.checkAction(response);
          blogContent.selectedItem = response.Item;
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
              blogContent.dataForTheTree = response1.ListItems;
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
                    blogContent.dataForTheTree,
                    response2.ListItems
                  );
                  $modal.open({
                    templateUrl: "cpanelv1/ModuleBlog/BlogCategory/add.html",
                    scope: $scope
                  });
                  blogContent.addRequested = false;
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
    blogContent.EditCategoryModel = function () {
      if (buttonIsPressed) {
        return;
      }
      blogContent.addRequested = false;
      //blogContent.modalTitle = ($filter('translatentk')('Edit_Category'));
      if (!blogContent.treeConfig.currentNode) {
        rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
        return;
      }

      blogContent.contentBusyIndicator.isActive = true;
      buttonIsPressed = true;
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "blogCategory/GetOne",
          blogContent.treeConfig.currentNode.Id,
          "GET"
        )
        .success(function (response) {
          buttonIsPressed = false;
          blogContent.contentBusyIndicator.isActive = false;
          rashaErManage.checkAction(response);
          blogContent.selectedItem = response.Item;
          //Set dataForTheTree
          blogContent.selectedNode = [];
          blogContent.expandedNodes = [];
          blogContent.selectedItem = response.Item;
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
              blogContent.dataForTheTree = response1.ListItems;
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
                    blogContent.dataForTheTree,
                    response2.ListItems
                  );
                  //Set selected files to treeControl
                  if (blogContent.selectedItem.LinkMainImageId > 0)
                    blogContent.onSelection({
                        Id: blogContent.selectedItem.LinkMainImageId
                      },
                      true
                    );
                  $modal.open({
                    templateUrl: "cpanelv1/ModuleBlog/BlogCategory/edit.html",
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
    blogContent.Showstatistics = function () {
      if (!blogContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
        return;
      }
      ajax.call(cmsServerConfig.configApiServerPath + 'blogContent/GetOne', blogContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
        rashaErManage.checkAction(response1);
        blogContent.selectedItem = response1.Item;
        $modal.open({
          templateUrl: "cpanelv1/Moduleblog/blogContent/statistics.html",
          scope: $scope
        });
      }).error(function (data, errCode, c, d) {
        rashaErManage.checkAction(data, errCode);
      });
    }

    // Add New Category
    blogContent.addNewCategory = function (frm) {
      if (frm.$invalid) return;
      blogContent.categoryBusyIndicator.isActive = true;
      blogContent.addRequested = true;
      blogContent.selectedItem.LinkParentId = null;
      if (blogContent.treeConfig.currentNode != null)
        blogContent.selectedItem.LinkParentId =
        blogContent.treeConfig.currentNode.Id;
      ajax
        .call(cmsServerConfig.configApiServerPath + "blogCategory/add", blogContent.selectedItem, "POST")
        .success(function (response) {
          blogContent.addRequested = false;
          rashaErManage.checkAction(response);

          if (response.IsSuccess) {
            blogContent.gridOptions.advancedSearchData.engine.Filters = null;
            blogContent.gridOptions.advancedSearchData.engine.Filters = [];
            blogContent.gridOptions.reGetAll();
            blogContent.closeModal();
          }
          blogContent.categoryBusyIndicator.isActive = false;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          blogContent.addRequested = false;
          blogContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Edit Category REST Api
    blogContent.EditCategory = function (frm) {
      if (frm.$invalid) return;
      blogContent.categoryBusyIndicator.isActive = true;
      blogContent.addRequested = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "blogCategory/edit", blogContent.selectedItem, "PUT")
        .success(function (response) {
          //blogContent.showbusy = false;
          blogContent.treeConfig.showbusy = false;
          blogContent.addRequested = false;
          rashaErManage.checkAction(response);
          if (response.IsSuccess) {
            blogContent.treeConfig.currentNode.Title = response.Item.Title;
            blogContent.closeModal();
          }
          blogContent.categoryBusyIndicator.isActive = false;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          blogContent.addRequested = false;
          blogContent.categoryBusyIndicator.isActive = false;
        });
    };

    // Delete a Category
    blogContent.deleteCategory = function () {
      if (buttonIsPressed) {
        return;
      }
      var node = blogContent.treeConfig.currentNode;
      if (node.Id == 0 || !node.Id) {
        rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
        return;
      }
      rashaErManage.showYesNo(
        ($filter('translatentk')('warning')),
        ($filter('translatentk')('do_you_want_to_delete_this_attribute')),
        function (isConfirmed) {
          if (isConfirmed) {
            blogContent.categoryBusyIndicator.isActive = true;
            buttonIsPressed = true;
            ajax
              .call(cmsServerConfig.configApiServerPath + "blogCategory/GetOne", node.Id, "GET")
              .success(function (response) {
                buttonIsPressed = false;
                rashaErManage.checkAction(response);
                blogContent.selectedItemForDelete = response.Item;
                ajax
                  .call(
                    cmsServerConfig.configApiServerPath + "blogCategory/delete",
                    blogContent.selectedItemForDelete,
                    "POST"
                  )
                  .success(function (res) {
                    blogContent.categoryBusyIndicator.isActive = false;
                    if (res.IsSuccess) {
                      blogContent.gridOptions.advancedSearchData.engine.Filters = null;
                      blogContent.gridOptions.advancedSearchData.engine.Filters = [];
                      blogContent.gridOptions.fillData();
                      blogContent.gridOptions.reGetAll();
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
                    blogContent.categoryBusyIndicator.isActive = false;
                  });
              })
              .error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                blogContent.categoryBusyIndicator.isActive = false;
              });
          }
        }
      );
    };

    //Tree On Node Select Options
    blogContent.treeConfig.onNodeSelect = function () {
      var node = blogContent.treeConfig.currentNode;
      blogContent.showGridComment = false;
      blogContent.selectContent(node);
    };
    //Show Content with Category Id
    blogContent.selectContent = function (node) {
      blogContent.gridOptions.advancedSearchData.engine.Filters = null;
      blogContent.gridOptions.advancedSearchData.engine.Filters = [];
      if (node != null && node != undefined) {
        blogContent.contentBusyIndicator.message =
          "در حال بارگذاری مقاله های  دسته " + node.Title;
        blogContent.contentBusyIndicator.isActive = true;
        //blogContent.gridOptions.advancedSearchData = {};
        blogContent.attachedFiles = [];
        var s = {
          PropertyName: "LinkCategoryId",
          IntValue1: node.Id,
          SearchType: 0
        };
        blogContent.gridOptions.advancedSearchData.engine.Filters.push(s);
      }
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "blogContent/getall",
          blogContent.gridOptions.advancedSearchData.engine,
          "POST"
        )
        .success(function (response) {
          rashaErManage.checkAction(response);
          blogContent.contentBusyIndicator.isActive = false;
          blogContent.ListItems = response.ListItems;
          blogContent.gridOptions.fillData(
            blogContent.ListItems,
            response.resultAccess
          ); // Sending Access as an argument
          blogContent.gridOptions.currentPageNumber =
            response.CurrentPageNumber;
          blogContent.gridOptions.totalRowCount = response.TotalRowCount;
          blogContent.gridOptions.rowPerPage = response.RowPerPage;
        })
        .error(function (data, errCode, c, d) {
          blogContent.contentBusyIndicator.isActive = false;
          blogContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Modal
    blogContent.addNewContentModel = function () {
      blogContent.selectedItemModuleRelationShip = [];
      blogContent.ModuleRelationShip = [];
      if (buttonIsPressed) {
        return;
      }
      var node = blogContent.treeConfig.currentNode;
      if (node.Id == 0 || !node.Id) {
        rashaErManage.showMessage($filter('translatentk')('to_add_a_blog_please_select_the_category'));
        buttonIsPressed = false;
        return;
      }
      blogContent.selectedItemOtherInfos = {};
      blogContent.attachedFiles = [];
      blogContent.Similars = [];
      blogContent.SimilarsDb = [];
      blogContent.OtherInfos = [];
      blogContent.OtherInfosDb = [];
      blogContent.ModuleRelationShip = [];
      blogContent.ModuleRelationShipDb = [];

      blogContent.filePickerMainImage.filename = "";
      blogContent.filePickerMainImage.fileId = null;
      blogContent.filePickerFilePodcast.filename = "";
      blogContent.filePickerFilePodcast.fileId = null;
      blogContent.filePickerFileMovie.filename = "";
      blogContent.filePickerFileMovie.fileId = null;
      blogContent.filePickerFiles.filename = "";
      blogContent.filePickerFiles.fileId = null;
      blogContent.tags = []; //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
      blogContent.kwords = []; //tagsInput خالی کردن آرایه کلمات کلیدی برای محتوای جدید
      blogContent.addRequested = false;
      //blogContent.modalTitle = ($filter('translatentk')('Add_Content'));
      buttonIsPressed = true;
      ajax
        .call(cmsServerConfig.configApiServerPath + "blogContent/GetViewModel", "", "GET")
        .success(function (response) {
          buttonIsPressed = false;
          rashaErManage.checkAction(response);

          blogContent.selectedItem = response.Item;
          blogContent.OtherInfos = [];

          blogContent.selectedItem.LinkCategoryId = node.Id;
          blogContent.selectedItem.LinkFileIds = null;

          $modal.open({
            templateUrl: "cpanelv1/Moduleblog/blogContent/add.html",
            scope: $scope
          });
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };


    blogContent.SimilarsSelectedItem = {};
    blogContent.moveSelected = function (from, to, calculatePrice) {
      if (from == "Content") {
        if (
          blogContent.selectedItem.Id != undefined &&
          blogContent.selectedItem.Id != null
        ) {
          if (blogContent.Similars == undefined)
            blogContent.Similars = [];

          for (var i = 0; i < blogContent.Similars.length; i++) {
            if (blogContent.Similars[i].Id == blogContent.SimilarsSelector.selectedItem.Id) {
              rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
              return;
            }
          }
          blogContent.Similars.push(blogContent.SimilarsSelector.selectedItem);
        }
      }
    };

    blogContent.moveSelectedOtherInfo = function (from, to, y) {
      if (blogContent.OtherInfos == undefined)
        blogContent.OtherInfos = [];
      for (var i = 0; i < blogContent.OtherInfos.length; i++) {

        if (blogContent.OtherInfos[i].Title == blogContent.selectedItemOtherInfos.Title && blogContent.OtherInfos[i].HtmlBody == blogContent.selectedItemOtherInfos.HtmlBody && blogContent.OtherInfos[i].Source == blogContent.selectedItemOtherInfos.Source) {
          rashaErManage.showMessage($filter('translatentk')('Information_Is_Duplicate'));
          return;
        }
      }
      if (blogContent.selectedItemOtherInfos.Title == "" && blogContent.selectedItemOtherInfos.Source == "" && blogContent.selectedItemOtherInfos.HtmlBody == "") {
        rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
      } else if (blogContent.selectedItemOtherInfos.TypeId == "" || !Number.isInteger(blogContent.selectedItemOtherInfos.TypeId)) {
        rashaErManage.showMessage($filter('translatentk')('در فیلد نوع مقدار عددی وارد کنید'));
      } else {

        blogContent.OtherInfos.push({
          Title: blogContent.selectedItemOtherInfos.Title,
          HtmlBody: blogContent.selectedItemOtherInfos.HtmlBody,
          Source: blogContent.selectedItemOtherInfos.Source
        });
        blogContent.selectedItemOtherInfos.Title = "";
        blogContent.selectedItemOtherInfos.Source = "";
        blogContent.selectedItemOtherInfos.HtmlBody = "";
      }
      if (edititem) {
        edititem = false;
      }

    };
    //#help otherInfo
    blogContent.selectedItemOtherInfos = {};
    blogContent.todoModeTitle = $filter('translatentk')('ADD_NOW');
    blogContent.saveOtherInfos = function () {

      if (blogContent.editMode) {
        if (blogContent.selectedItemOtherInfos.Title == "" ||
          blogContent.selectedItemOtherInfos.Title == undefined ||
          blogContent.selectedItemOtherInfos.HtmlBody == "" ||
          blogContent.selectedItemOtherInfos.HtmlBody == undefined) {
          rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
          return;
        }
        blogContent.selectedItemOtherInfos.Edited = true;
        $scope.currentItem = blogContent.selectedItemOtherInfos;
        blogContent.OtherInfos[$scope.currentItemIndex] = blogContent.selectedItemOtherInfos;
        blogContent.editMode = false;


      } else { //add New
        if (blogContent.selectedItemOtherInfos.Title == "" ||
          blogContent.selectedItemOtherInfos.Title == undefined ||
          blogContent.selectedItemOtherInfos.HtmlBody == "" ||
          blogContent.selectedItemOtherInfos.HtmlBody == undefined) {
          rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
          return;
        }
        blogContent.selectedItemOtherInfos.LinkContentId = blogContent.gridOptions.selectedRow.item.Id;
        blogContent.OtherInfos.push(blogContent.selectedItemOtherInfos);
        blogContent.selectedItemOtherInfos = {};
        // ajax.call(cmsServerConfig.configApiServerPath + 'blogContentOtherInfo/add', blogContent.selectedItemOtherInfos, 'POST').success(function (response) {
        //   rashaErManage.checkAction(response);
        //   if (response.IsSuccess) {
        //     blogContent.selectedItemOtherInfos = response.Item;
        //     mainLIst.push(blogContent.selectedItemOtherInfos);
        //     blogContent.selectedItemOtherInfos = {};
        //   }
        // }).error(function (data, errCode, c, d) {
        //   rashaErManage.checkAction(data, errCode);
        // });

      }
      blogContent.selectedItemOtherInfos = {};
      blogContent.todoModeTitle = $filter('translatentk')('add_now');
    };




    //#help
    // Open Edit Content Modal
    blogContent.openEditModel = function () {
      blogContent.attachedFiles = [];
      blogContent.Similars = [];
      blogContent.SimilarsDb = [];
      blogContent.OtherInfos = [];
      blogContent.ModuleRelationShip = [];
      blogContent.selectedItemModuleRelationShip = [];
      blogContent.ModuleRelationShipDb = [];
      blogContent.tags = []; //Clear out previous tags
      blogContent.selectedItemRelationship = [];
      if (buttonIsPressed) {
        return;
      }

      blogContent.showComment(blogContent.gridOptions.selectedRow.item.Id)
      blogContent.addRequested = false;
      //blogContent.modalTitle = ($filter('translatentk')('Edit_Content'));
      if (!blogContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
        return;
      }
      if (blogContent.gridOptions.selectedRow.item.LinkSiteId != $rootScope.tokenInfo.Item.SiteId && !$rootScope.tokenInfo.Item.UserAccessAdminAllowToAllData) {
        rashaErManage.showMessage($filter('translatentk')('This_Blog_Is_Shared'));
        return;
      }
      blogContent.selectedItemOtherInfos = {};
      buttonIsPressed = true;
      ajax.call(cmsServerConfig.configApiServerPath + "blogContent/GetOne", blogContent.gridOptions.selectedRow.item.Id, "GET")
        .success(function (response1) {
          buttonIsPressed = false;
          rashaErManage.checkAction(response1);
          blogContent.selectedItem = response1.Item;


          blogContent.filePickerMainImage.filename = null;
          blogContent.filePickerMainImage.fileId = null;
          blogContent.filePickerFilePodcast.filename = null;
          blogContent.filePickerFilePodcast.fileId = null;
          blogContent.filePickerFileMovie.filename = null;
          blogContent.filePickerFileMovie.fileId = null;
          //BlogContentOtherInfo
          var engineOtherInfo = {};
          var filterValue = {
            PropertyName: "LinkContentId",
            IntValue1: blogContent.gridOptions.selectedRow.item.Id,
            SearchType: 0
          }
          engineOtherInfo.Filters = null;
          engineOtherInfo.Filters = [];
          engineOtherInfo.Filters.push(filterValue);
          ajax.call(cmsServerConfig.configApiServerPath + "BlogContentOtherInfo/GetAll", engineOtherInfo, "POST")
            .success(function (responseOtherInfos) {
              blogContent.OtherInfosDb = responseOtherInfos.ListItems;
              blogContent.OtherInfos = angular.extend(blogContent.OtherInfos, responseOtherInfos.ListItems);
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });

          ajax.call(cmsServerConfig.configApiServerPath + "BlogContentTag/GetAll", engineOtherInfo, "POST")
            .success(function (responsetag) {
              blogContent.selectedItem.ContentTags = responsetag.ListItems;

              //Load tagsInput
              if (blogContent.selectedItem.ContentTags == null)
                blogContent.selectedItem.ContentTags = [];
              $.each(blogContent.selectedItem.ContentTags, function (index, item) {
                if (item.virtual_ModuleTag != null)
                  blogContent.tags.push({
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
          ajax.call(cmsServerConfig.configApiServerPath + "BlogContent/GetAllWithSimilarsId/" + blogContent.gridOptions.selectedRow.item.Id, engineSimilars, "POST")
            .success(function (responseSimilars) {
              blogContent.SimilarsDb = responseSimilars.ListItems;
              blogContent.Similars = angular.extend(blogContent.Similars, responseSimilars.ListItems);
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          var RelationshipModel = {
            Id: blogContent.gridOptions.selectedRow.item.Id,
            enumValue: ModuleRelationShipModuleNameMain
          };
          ajax.call(cmsServerConfig.configApiServerPath + 'ModulesRelationshipContent/GetAllByContentId', RelationshipModel, 'POST')
            .success(function (responseModuleRelationShip) {
              blogContent.ModuleRelationShipDb = responseModuleRelationShip.ListItems;
              blogContent.ModuleRelationShip = angular.extend(blogContent.ModuleRelationShip, responseModuleRelationShip.ListItems);
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          //BlogContentOtherInfo
          if (response1.Item.LinkMainImageId != null) {
            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", response1.Item.LinkMainImageId, "GET")
              .success(function (response2) {
                buttonIsPressed = false;
                blogContent.filePickerMainImage.filename =
                  response2.Item.FileName;
                blogContent.filePickerMainImage.fileId = response2.Item.Id;
              })
              .error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
              });
          }
          if (response1.Item.LinkFilePodcastId != null) {
            ajax.call(cmsServerConfig.configApiServerPath + 'FileContent/GetOne', response1.Item.LinkFilePodcastId, 'GET').success(function (response2) {
              blogContent.filePickerFilePodcast.filename = response2.Item.FileName;
              blogContent.filePickerFilePodcast.fileId = response2.Item.Id
            }).error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          }
          if (response1.Item.LinkFileMovieId != null) {
            ajax.call(cmsServerConfig.configApiServerPath + 'FileContent/GetOne', response1.Item.LinkFileMovieId, 'GET').success(function (response2) {
              blogContent.filePickerFileMovie.filename = response2.Item.FileName;
              blogContent.filePickerFileMovie.fileId = response2.Item.Id
            }).error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
          }

          //link to other module
          blogContent.parseFileIds(response1.Item.LinkFileIds);
          blogContent.filePickerFiles.filename = null;
          blogContent.filePickerFiles.fileId = null;

          //Load Keywords tagsInput
          blogContent.kwords = []; //Clear out previous tags
          var arraykwords = [];
          if (
            blogContent.selectedItem.Keyword != null &&
            blogContent.selectedItem.Keyword != ""
          )
            arraykwords = blogContent.selectedItem.Keyword.split(",");
          $.each(arraykwords, function (index, item) {
            if (item != null) blogContent.kwords.push({
              text: item
            }); //Add current content's tag to tags array with id and title
          });
          $modal.open({
            templateUrl: "cpanelv1/Moduleblog/blogContent/edit.html",
            scope: $scope
          });
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };



    // Add New Content
    blogContent.addNewContent = function (frm) {
      if (frm.$invalid) return;
      blogContent.categoryBusyIndicator.isActive = true;
      blogContent.addRequested = true;

      //Save attached file ids into blogContent.selectedItem.LinkFileIds
      blogContent.selectedItem.LinkFileIds = "";
      blogContent.stringfyLinkFileIds();
      //Save Keywords
      $.each(blogContent.kwords, function (index, item) {
        if (index == 0) blogContent.selectedItem.Keyword = item.text;
        else blogContent.selectedItem.Keyword += "," + item.text;
      });
      if (
        blogContent.selectedItem.LinkCategoryId == null ||
        blogContent.selectedItem.LinkCategoryId == 0
      ) {
        rashaErManage.showMessage($filter('translatentk')('to_add_a_blog_please_select_the_category'));
        return;
      }
      var apiSelectedItem = blogContent.selectedItem;

      ajax.call(cmsServerConfig.configApiServerPath + "blogContent/add", apiSelectedItem, "POST").success(function (response) {
          rashaErManage.checkAction(response);
          blogContent.categoryBusyIndicator.isActive = false;
          if (response.IsSuccess) {
            blogContent.selectedItem.LinkSourceId = blogContent.selectedItem.Id;

            blogContent.ListItems.unshift(response.Item);
            blogContent.gridOptions.fillData(blogContent.ListItems);
            blogContent.closeModal();
            //Save inputTags

            $.each(blogContent.tags, function (index, item) {
              if (item.id > 0) {
                item.LinkTagId = item.id;
                item.LinkContentId = response.Item.Id;
              }
            });
            ajax.call(cmsServerConfig.configApiServerPath + "blogContentTag/addbatch", blogContent.tags, "POST").success(function (response) {
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
          blogContent.addRequested = false;
          blogContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Edit Content
    blogContent.editContent = function (frm) {
      if (frm.$invalid) return;
      blogContent.categoryBusyIndicator.isActive = true;
      blogContent.addRequested = true;
      //Save attached file ids into blogContent.selectedItem.LinkFileIds
      blogContent.selectedItem.LinkFileIds = "";
      blogContent.stringfyLinkFileIds();
      //Save Keywords
      $.each(blogContent.kwords, function (index, item) {
        if (index == 0) blogContent.selectedItem.Keyword = item.text;
        else blogContent.selectedItem.Keyword += "," + item.text;
      });




      //Save inputTags
      $.each(blogContent.tags, function (index, item) {
        if (item.id > 0) {
          item.LinkTagId = item.id;
          item.LinkContentId = blogContent.selectedItem.Id;
        }
      });
      blogContent.ContentTagsRemoved = differenceInFirstArray(blogContent.selectedItem.ContentTags, blogContent.tags, 'LinkTagId');
      blogContent.ContentTagsAdded = differenceInFirstArray(blogContent.tags, blogContent.selectedItem.ContentTags, 'LinkTagId');
      //remove
      if (blogContent.ContentTagsRemoved && blogContent.ContentTagsRemoved.length > 0) {
        ajax.call(cmsServerConfig.configApiServerPath + "blogContentTag/DeleteList", blogContent.ContentTagsRemoved, "Delete").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //Add
      if (blogContent.ContentTagsAdded && blogContent.ContentTagsAdded.length > 0) {
        ajax.call(cmsServerConfig.configApiServerPath + "blogContentTag/addbatch", blogContent.ContentTagsAdded, "POST").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      ///Save inputTags
      ///Save OtherInfos
      blogContent.ContentOtherInfosRemoved = differenceInFirstArray(blogContent.OtherInfosDb, blogContent.OtherInfos, 'Id');
      blogContent.ContentOtherInfosAdded = differenceInFirstArray(blogContent.OtherInfos, blogContent.OtherInfosDb, 'Id');
      blogContent.ContentOtherInfosEdit = [];
      $.each(blogContent.OtherInfos, function (index, item) {
        if (item.Edited && item.Id && item.Id > 0)
          blogContent.ContentOtherInfosEdit.push(item);
      });

      //remove
      if (blogContent.ContentOtherInfosRemoved && blogContent.ContentOtherInfosRemoved.length > 0) {
        var OtherInfosRemovedModel = [];
        $.each(blogContent.ContentOtherInfosRemoved, function (index, item) {
          OtherInfosRemovedModel.push(item);
        });
        ajax.call(cmsServerConfig.configApiServerPath + "blogContentOtherInfo/DeleteList", OtherInfosRemovedModel, "Delete").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //Add
      if (blogContent.ContentOtherInfosAdded && blogContent.ContentOtherInfosAdded.length > 0) {
        var OtherInfosAddModel = [];
        $.each(blogContent.ContentOtherInfosAdded, function (index, item) {
          OtherInfosAddModel.push(item);
        });
        ajax.call(cmsServerConfig.configApiServerPath + "blogContentOtherInfo/addbatch", OtherInfosAddModel, "POST").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //edit
      if (blogContent.ContentOtherInfosEdit && blogContent.ContentOtherInfosEdit.length > 0) {
        ajax.call(cmsServerConfig.configApiServerPath + "blogContentOtherInfo/editbatch", blogContent.ContentOtherInfosEdit, "PUT").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //edit
      ///Save OtherInfos
      ///Save Similars
      blogContent.ContentSimilarsRemoved = differenceInFirstArray(blogContent.SimilarsDb, blogContent.Similars, 'Id');
      blogContent.ContentSimilarsAdded = differenceInFirstArray(blogContent.Similars, blogContent.SimilarsDb, 'Id');
      //remove
      if (blogContent.ContentSimilarsRemoved && blogContent.ContentSimilarsRemoved.length > 0) {
        var SimilarsRemovedModel = [];
        $.each(blogContent.ContentSimilarsRemoved, function (index, item) {
          SimilarsRemovedModel.push({
            LinkSourceId: blogContent.selectedItem.Id,
            LinkDestinationId: item.Id
          });
        });
        ajax.call(cmsServerConfig.configApiServerPath + "blogContentSimilar/DeleteList", SimilarsRemovedModel, "Delete").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //Add
      if (blogContent.ContentSimilarsAdded && blogContent.ContentSimilarsAdded.length > 0) {
        var SimilarsAddModel = [];
        $.each(blogContent.ContentSimilarsAdded, function (index, item) {
          SimilarsAddModel.push({
            LinkSourceId: blogContent.selectedItem.Id,
            LinkDestinationId: item.Id
          });
        });
        ajax.call(cmsServerConfig.configApiServerPath + "blogContentSimilar/addbatch", SimilarsAddModel, "POST").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      ///Save Similars

      ///Save ModulesRelationship
      blogContent.ContentModuleRelationShipRemoved = differenceInFirstArray(blogContent.ModuleRelationShipDb, blogContent.ModuleRelationShip, '');
      blogContent.ContentModuleRelationShipAdded = differenceInFirstArray(blogContent.ModuleRelationShip, blogContent.ModuleRelationShipDb, '');
      //remove
      if (blogContent.ContentModuleRelationShipRemoved && blogContent.ContentModuleRelationShipRemoved.length > 0) {

        ajax.call(cmsServerConfig.configApiServerPath + "ModulesRelationshipContent/DeleteList", blogContent.ContentModuleRelationShipRemoved, "Delete").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      //Add
      if (blogContent.ContentModuleRelationShipAdded && blogContent.ContentModuleRelationShipAdded.length > 0) {

        ajax.call(cmsServerConfig.configApiServerPath + "ModulesRelationshipContent/addbatch", blogContent.ContentModuleRelationShipAdded, "POST").success(function (response) {
            rashaErManage.checkAction(response);
          })
          .error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
          });
      }
      ///Save ModulesRelationship
      if (
        blogContent.selectedItem.LinkCategoryId == null ||
        blogContent.selectedItem.LinkCategoryId == 0
      ) {
        rashaErManage.showMessage($filter('translatentk')('to_add_a_blog_please_select_the_category'));
        return;
      }
      var apiSelectedItem = {};
      apiSelectedItem = angular.extend(apiSelectedItem, blogContent.selectedItem);
      apiSelectedItem.OtherInfos = [];
      ajax
        .call(cmsServerConfig.configApiServerPath + "blogContent/edit", apiSelectedItem, "PUT")
        .success(function (response) {
          blogContent.categoryBusyIndicator.isActive = false;
          blogContent.addRequested = false;
          blogContent.treeConfig.showbusy = false;
          blogContent.showIsBusy = false;
          rashaErManage.checkAction(response);
          if (response.IsSuccess) {
            blogContent.replaceItem(blogContent.selectedItem.Id, response.Item);
            blogContent.gridOptions.fillData(blogContent.ListItems);
            blogContent.closeModal();
          }
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          blogContent.addRequested = false;
          blogContent.categoryBusyIndicator.isActive = false;
        });


    };








    // Delete a blog Content
    blogContent.deleteContent = function () {
      if (buttonIsPressed) {
        return;
      }
      if (!blogContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
        //rashaErManage.showMessage($filter('translatentk')('Tag'));
        return;
      }
      blogContent.treeConfig.showbusy = true;
      blogContent.showIsBusy = true;
      rashaErManage.showYesNo(
        ($filter('translatentk')('warning')),
        ($filter('translatentk')('do_you_want_to_delete_this_attribute')),
        function (isConfirmed) {
          if (isConfirmed) {
            blogContent.categoryBusyIndicator.isActive = true;
            blogContent.showbusy = true;
            blogContent.showIsBusy = true;
            buttonIsPressed = true;
            ajax
              .call(
                cmsServerConfig.configApiServerPath + "blogContent/GetOne",
                blogContent.gridOptions.selectedRow.item.Id,
                "GET"
              )
              .success(function (response) {
                buttonIsPressed = false;
                blogContent.showbusy = false;
                blogContent.showIsBusy = false;
                rashaErManage.checkAction(response);
                blogContent.selectedItemForDelete = response.Item;
                ajax
                  .call(
                    cmsServerConfig.configApiServerPath + "blogContent/delete",
                    blogContent.selectedItemForDelete,
                    "POST"
                  )
                  .success(function (res) {
                    blogContent.categoryBusyIndicator.isActive = false;
                    blogContent.treeConfig.showbusy = false;
                    blogContent.showIsBusy = false;
                    rashaErManage.checkAction(res);
                    if (res.IsSuccess) {
                      blogContent.replaceItem(
                        blogContent.selectedItemForDelete.Id
                      );
                      blogContent.gridOptions.fillData(blogContent.ListItems);
                    }
                  })
                  .error(function (data2, errCode2, c2, d2) {
                    rashaErManage.checkAction(data2);
                    blogContent.treeConfig.showbusy = false;
                    blogContent.showIsBusy = false;
                    blogContent.categoryBusyIndicator.isActive = false;
                  });
              })
              .error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                blogContent.treeConfig.showbusy = false;
                blogContent.showIsBusy = false;
                blogContent.categoryBusyIndicator.isActive = false;
              });
          }
        }
      );
    };

    //Confirm/UnConfirm blog Content
    blogContent.confirmUnConfirmblogContent = function () {
      if (!blogContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
        return;
      }
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "blogContent/GetOne",
          blogContent.gridOptions.selectedRow.item.Id,
          "GET"
        )
        .success(function (response) {
          rashaErManage.checkAction(response);
          blogContent.selectedItem = response.Item;
          blogContent.selectedItem.IsAccepted = response.Item.IsAccepted == true ?
            false :
            true;
          ajax
            .call(cmsServerConfig.configApiServerPath + "blogContent/edit", blogContent.selectedItem, "PUT")
            .success(function (response2) {
              rashaErManage.checkAction(response2);
              if (response2.IsSuccess) {
                var index = blogContent.ListItems.indexOf(
                  blogContent.gridOptions.selectedRow.item
                );
                if (index !== -1) {
                  blogContent.ListItems[index] = response2.Item;
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
    blogContent.enableArchive = function () {
      if (!blogContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
        return;
      }

      ajax
        .call(
          cmsServerConfig.configApiServerPath + "blogContent/GetOne",
          blogContent.gridOptions.selectedRow.item.Id,
          "GET"
        )
        .success(function (response) {
          rashaErManage.checkAction(response);
          blogContent.selectedItem = response.Item;
          blogContent.selectedItem.IsArchive = response.Item.IsArchive == true ?
            false :
            true;
          ajax
            .call(cmsServerConfig.configApiServerPath + "blogContent/edit", blogContent.selectedItem, "PUT")
            .success(function (response2) {
              blogContent.categoryBusyIndicator.isActive = true;
              rashaErManage.checkAction(response2);
              if (response2.IsSuccess) {
                var index = blogContent.ListItems.indexOf(
                  blogContent.gridOptions.selectedRow.item
                );
                if (index !== -1) {
                  blogContent.ListItems[index] = response2.Item;
                }
                blogContent.categoryBusyIndicator.isActive = false;
              }
            })
            .error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
              blogContent.categoryBusyIndicator.isActive = false;
            });
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          blogContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Replace Item OnDelete/OnEdit Grid Options
    blogContent.replaceItem = function (oldId, newItem) {
      angular.forEach(blogContent.ListItems, function (item, key) {
        if (item.Id == oldId) {
          var index = blogContent.ListItems.indexOf(item);
          blogContent.ListItems.splice(index, 1);
        }
      });
      if (newItem) blogContent.ListItems.unshift(newItem);
    };

    blogContent.summernoteOptions = {
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

    //blogContent.summernoteText = '<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />';

    blogContent.searchData = function () {
      blogContent.categoryBusyIndicator.isActive = true;
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "blogContent/getall",
          blogContent.gridOptions.advancedSearchData.engine,
          "POST"
        )
        .success(function (response) {
          rashaErManage.checkAction(response);
          blogContent.categoryBusyIndicator.isActive = false;
          blogContent.ListItems = response.ListItems;
          blogContent.gridOptions.fillData(blogContent.ListItems);
          blogContent.gridOptions.currentPageNumber =
            response.CurrentPageNumber;
          blogContent.gridOptions.totalRowCount = response.TotalRowCount;
          blogContent.gridOptions.rowPerPage = response.RowPerPage;
          blogContent.allowedSearch = response.AllowedSearchField;
        })
        .error(function (data, errCode, c, d) {
          blogContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
        });
    };

    //Close Model Stack
    blogContent.addRequested = false;
    blogContent.closeModal = function () {
      $modalStack.dismissAll();
    };

    blogContent.showIsBusy = false;

    //Aprove a comment
    blogContent.confirmComment = function (item) {
      if (item.Id && item.Id > 0) {
        item.RecordStatus = 1;
        var itemCopy = angular.copy(item);
        itemCopy.rowOption = null;
        ajax.call(cmsServerConfig.configApiServerPath + 'BlogComment/edit', itemCopy, 'PUT').success(function (response) {
          rashaErManage.checkAction(response);
          if(response.IsSuccess)
          blogContent.showComment(blogContent.gridOptions.selectedRow.item.Id)
        }).error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
      }
    };

    //Decline a comment
    blogContent.doNotConfirmComment = function (item) {
      if (item.Id && item.Id > 0) {
        item.RecordStatus = 5;//DeniedConfirmed
        var itemCopy = angular.copy(item);
        itemCopy.rowOption = null;
        ajax.call(cmsServerConfig.configApiServerPath + 'BlogComment/edit', itemCopy, 'PUT').success(function (response) {
          if(response.IsSuccess)
          blogContent.showComment(blogContent.gridOptions.selectedRow.item.Id)
          rashaErManage.checkAction(response);
        }).error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
      }
    };
    //Remove a comment
    blogContent.deleteComment = function (item) {
      if (!item) {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
        return;
      }
      blogContent.treeConfig.showbusy = true;
      blogContent.showIsBusy = true;
      rashaErManage.showYesNo(
        ($filter('translatentk')('warning')),
        "آیا می خواهید این نظر را حذف کنید",
        function (isConfirmed) {
          if (isConfirmed) {

            blogContent.treeConfig.showbusy = true;
            blogContent.showbusy = true;
            blogContent.showIsBusy = true;

            var itemCopy = angular.copy(item);
            itemCopy.rowOption = null;
            ajax.call(cmsServerConfig.configApiServerPath + "blogComment/delete", itemCopy, "POST")
              .success(function (res) {
                blogContent.treeConfig.showbusy = false;
                blogContent.showbusy = false;
                blogContent.showIsBusy = false;
                rashaErManage.checkAction(res);
                if (res.IsSuccess) {
                  blogContent.showComment(blogContent.gridOptions.selectedRow.item.Id)
                  
                }
              })
              .error(function (data2, errCode2, c2, d2) {
                rashaErManage.checkAction(data2);
                blogContent.treeConfig.showbusy = false;
                blogContent.showbusy = false;
                blogContent.showIsBusy = false;
              });

          }
        }
      );
    };

    //For reInit Categories
    blogContent.gridOptions.reGetAll = function () {
      if (blogContent.gridOptions.advancedSearchData.engine.Filters.length > 0)
        blogContent.searchData();
      else blogContent.init();
    };

    blogContent.isCurrentNodeEmpty = function () {
      return !angular.equals({}, blogContent.treeConfig.currentNode);
    };

    blogContent.loadFileAndFolder = function (item) {
      blogContent.treeConfig.currentNode = item;
      blogContent.treeConfig.onNodeSelect(item);
    };

    blogContent.openDate = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $timeout(function () {
        blogContent.focus = true;
      });
    };
    blogContent.openDate1 = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $timeout(function () {
        blogContent.focus1 = true;
      });
    };

    blogContent.columnCheckbox = false;
    blogContent.openGridConfigModal = function () {
      $("#gridView-btn").toggleClass("active");
      var prechangeColumns = blogContent.gridOptions.columns;
      if (blogContent.gridOptions.columnCheckbox) {
        for (var i = 0; i < blogContent.gridOptions.columns.length; i++) {
          //blogContent.gridOptions.columns[i].visible = $("#" + blogContent.gridOptions.columns[i].Id + "Checkbox").is(":checked");
          var element = $(
            "#" +
            blogContent.gridOptions.columns[i].name.replace(".", "") +
            "Checkbox"
          );
          var temp = element[0].checked;
          blogContent.gridOptions.columns[i].visible = temp;
        }
      } else {
        for (var i = 0; i < blogContent.gridOptions.columns.length; i++) {
          var element = $(
            "#" +
            blogContent.gridOptions.columns[i].name.replace(".", "") +
            "Checkbox"
          );
          $(
              "#" + blogContent.gridOptions.columns[i].name + "Checkbox"
            ).checked =
            prechangeColumns[i].visible;
        }
      }
      for (var i = 0; i < blogContent.gridOptions.columns.length; i++) {

      }
      blogContent.gridOptions.columnCheckbox = !blogContent.gridOptions
        .columnCheckbox;
    };

    blogContent.deleteAttachedFile = function (index) {
      blogContent.attachedFiles.splice(index, 1);
    };

    blogContent.addAttachedFile = function (id) {
      var fname = $("#file" + id).text();
      if (
        id != null &&
        id != undefined &&
        !blogContent.alreadyExist(id, blogContent.attachedFiles) &&
        fname != null &&
        fname != ""
      ) {
        var fId = id;
        var file = {
          id: fId,
          name: fname
        };
        blogContent.attachedFiles.push(file);
        if (document.getElementsByName("file" + id).length > 1)
          document.getElementsByName("file" + id)[1].textContent = "";
        else document.getElementsByName("file" + id)[0].textContent = "";
      }
    };

    blogContent.alreadyExist = function (id, array) {
      for (var i = 0; i < array.length; i++) {
        if (id == array[i].fileId) {
          rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
          return true;
        }
      }
      return false;
    };

    blogContent.filePickerMainImage.removeSelectedfile = function (config) {
      blogContent.filePickerMainImage.fileId = null;
      blogContent.filePickerMainImage.filename = null;
      blogContent.selectedItem.LinkMainImageId = null;
    };
    blogContent.filePickerFilePodcast.removeSelectedfile = function (config) {
      blogContent.filePickerFilePodcast.fileId = null;
      blogContent.filePickerFilePodcast.filename = null;
      blogContent.selectedItem.LinkFilePodcastId = null;

    }
    blogContent.filePickerFileMovie.removeSelectedfile = function (config) {
      blogContent.filePickerFileMovie.fileId = null;
      blogContent.filePickerFileMovie.filename = null;
      blogContent.selectedItem.LinkFileMovieId = null;

    }
    blogContent.filePickerFiles.removeSelectedfile = function (config) {
      blogContent.filePickerFiles.fileId = null;
      blogContent.filePickerFiles.filename = null;
    };

    blogContent.showUpload = function () {
      $("#fastUpload").fadeToggle();
    };

    // ----------- FilePicker Codes --------------------------------
    blogContent.addAttachedFile = function (id) {
      var fname = $("#file" + id).text();
      if (fname == "") {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
        return;
      }
      if (
        id != null &&
        id != undefined &&
        !blogContent.alreadyExist(id, blogContent.attachedFiles)
      ) {
        var fId = id;
        var file = {
          fileId: fId,
          filename: fname,
          previewImageSrc: cmsServerConfig.configPathFileByIdAndName + fId + "/" + fname
        };
        blogContent.attachedFiles.push(file);
        blogContent.clearfilePickers();
      }
    };

    blogContent.alreadyExist = function (fieldId, array) {
      for (var i = 0; i < array.length; i++) {
        if (fieldId == array[i].fileId) {
          rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
          blogContent.clearfilePickers();
          return true;
        }
      }
      return false;
    };

    blogContent.deleteAttachedfieldName = function (index) {
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "blogContent/delete",
          blogContent.contractsList[index],
          "POST"
        )
        .success(function (res) {
          rashaErManage.checkAction(res);
          if (res.IsSuccess) {
            blogContent.contractsList.splice(index, 1);
            rashaErManage.showMessage($filter('translatentk')('Removed_Successfully'));
          }
        })
        .error(function (data2, errCode2, c2, d2) {
          rashaErManage.checkAction(data2);
        });
    };

    blogContent.parseFileIds = function (stringOfIds) {
      if (stringOfIds == null || !stringOfIds.trim()) return;
      var fileIds = stringOfIds.split(",");
      if (fileIds.length != undefined) {
        $.each(fileIds, function (index, item) {
          if (item == parseInt(item, 10)) {
            // Check if item is an integer
            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", parseInt(item), "GET").success(function (response) {
                if (response.IsSuccess) {
                  blogContent.attachedFiles.push({
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

    blogContent.clearfilePickers = function () {
      blogContent.filePickerFiles.fileId = null;
      blogContent.filePickerFiles.filename = null;
    };

    blogContent.stringfyLinkFileIds = function () {
      $.each(blogContent.attachedFiles, function (i, item) {
        if (blogContent.selectedItem.LinkFileIds == "")
          blogContent.selectedItem.LinkFileIds = item.fileId;
        else blogContent.selectedItem.LinkFileIds += "," + item.fileId;
      });
    };
    //--------- End FilePickers Codes -------------------------

    //---------------Upload Modal-------------------------------
    blogContent.openUploadModal = function () {
      $modal.open({
        templateUrl: "cpanelv1/Moduleblog/blogContent/upload_modal.html",
        size: "lg",
        scope: $scope
      });

      blogContent.FileList = [];
      //get list of file from category id
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", {}, "POST")
        .success(function (response) {
          blogContent.FileList = response.ListItems;
        })
        .error(function (data) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    //---------------Upload Modal Podcast-------------------------------
    blogContent.openUploadModalPodcast = function () {
      $modal.open({
        templateUrl: 'cpanelv1/Moduleblog/blogContent/upload_modalPodcast.html',
        size: 'lg',
        scope: $scope
      });

      blogContent.FileList = [];
      //get list of file from category id
      ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
        blogContent.FileList = response.ListItems;
      }).error(function (data) {
        rashaErManage.checkAction(data, errCode);
      });

    }
    //---------------Upload Modal Movie-------------------------------
    blogContent.openUploadModalMovie = function () {
      $modal.open({
        templateUrl: 'cpanelv1/Moduleblog/blogContent/upload_modalMovie.html',
        size: 'lg',
        scope: $scope
      });

      blogContent.FileList = [];
      //get list of file from category id
      ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
        blogContent.FileList = response.ListItems;
      }).error(function (data) {
        rashaErManage.checkAction(data, errCode);
      });

    }

    blogContent.calcuteProgress = function (progress) {
      wdth = Math.floor(progress * 100);
      return wdth;
    };

    blogContent.whatcolor = function (progress) {
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

    blogContent.canShow = function (pr) {
      if (pr == 1) {
        return true;
      }
      return false;
    };
    // File Manager actions
    blogContent.replaceFile = function (name) {
      blogContent.itemClicked(null, blogContent.fileIdToDelete, "file");
      blogContent.fileTypes = 1;
      blogContent.fileIdToDelete = blogContent.selectedIndex;

      // Delete the file
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", blogContent.fileIdToDelete, "GET")
        .success(function (response1) {
          rashaErManage.checkAction(response1);
          if (response1.IsSuccess == true) {

            ajax
              .call(cmsServerConfig.configApiServerPath + "FileContent/delete", response1.Item, "POST")
              .success(function (response2) {
                blogContent.remove(
                  blogContent.FileList,
                  blogContent.fileIdToDelete
                );
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess == true) {
                  // Save New file
                  ajax
                    .call(cmsServerConfig.configApiServerPath + "FileContent/GetViewModel", "", "GET")
                    .success(function (response3) {
                      rashaErManage.checkAction(response3);

                      if (response3.IsSuccess == true) {
                        blogContent.FileItem = response3.Item;
                        blogContent.FileItem.FileName = name;
                        blogContent.FileItem.Extension = name.split(".").pop();
                        blogContent.FileItem.FileSrc = name;
                        blogContent.FileItem.LinkCategoryId =
                          blogContent.thisCategory;
                        blogContent.saveNewFile();
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
    blogContent.saveNewFile = function () {
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/add", blogContent.FileItem, "POST")
        .success(function (response) {
          if (response.IsSuccess) {
            blogContent.FileItem = response.Item;
            blogContent.showSuccessIcon();
            return 1;
          } else {
            return 0;
          }
        })
        .error(function (data) {
          blogContent.showErrorIcon();
          return -1;
        });
    };

    blogContent.showSuccessIcon = function () {};

    blogContent.showErrorIcon = function () {};
    //file is exist
    blogContent.fileIsExist = function (fileName) {
      for (var i = 0; i < blogContent.FileList.length; i++) {
        if (blogContent.FileList[i].FileName == fileName) {
          blogContent.fileIdToDelete = blogContent.FileList[i].Id;
          return true;
        }
      }
      return false;
    };

    blogContent.getFileItem = function (id) {
      for (var i = 0; i < blogContent.FileList.length; i++) {
        if (blogContent.FileList[i].Id == id) {
          return blogContent.FileList[i];
        }
      }
    };

    //select file or folder
    blogContent.itemClicked = function ($event, index, type) {
      if (type == "file" || type == 1) {
        blogContent.fileTypes = 1;
        blogContent.selectedFileId = blogContent.getFileItem(index).Id;
        blogContent.selectedFileName = blogContent.getFileItem(index).FileName;
      } else {
        blogContent.fileTypes = 2;
        blogContent.selectedCategoryId = blogContent.getCategoryName(index).Id;
        blogContent.selectedCategoryTitle = blogContent.getCategoryName(
          index
        ).Title;
      }
      blogContent.selectedIndex = index;
    };

    blogContent.toggleCategoryButtons = function () {
      $("#categoryButtons").fadeToggle();
    };
    //upload file Podcast
    blogContent.uploadFilePodcast = function (index, uploadFile) {
      if ($("#save-icon" + index).hasClass("fa-save")) {
        if (blogContent.fileIsExist(uploadFile.name)) { // File already exists
          if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
            //------------ blogContent.replaceFile(uploadFile.name);
            blogContent.itemClicked(null, blogContent.fileIdToDelete, "file");
            blogContent.fileTypes = 1;
            blogContent.fileIdToDelete = blogContent.selectedIndex;
            // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                blogContent.fileIdToDelete,
                "GET"
              )
              .success(function (response1) {
                if (response1.IsSuccess == true) {
                  rashaErManage.checkAction(response1);
                  ajax.call(cmsServerConfig.configApiServerPath + "FileContent/replace", response1.Item, "POST")
                    .success(function (response2) {
                      rashaErManage.checkAction(response2);

                      if (response2.IsSuccess == true) {
                        blogContent.FileItem = response2.Item;
                        blogContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        blogContent.filePickerFilePodcast.filename =
                          blogContent.FileItem.FileName;
                        blogContent.filePickerFilePodcast.fileId =
                          response2.Item.Id;
                        blogContent.selectedItem.LinkFilePodcastId =
                          blogContent.filePickerFilePodcast.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function (data) {
                      blogContent.showErrorIcon();
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
            blogContent.FileItem = response.Item;
            blogContent.FileItem.FileName = uploadFile.name;
            blogContent.FileItem.uploadName = uploadFile.uploadName;
            blogContent.FileItem.Extension = uploadFile.name.split('.').pop();
            blogContent.FileItem.FileSrc = uploadFile.name;
            blogContent.FileItem.LinkCategoryId = null; //Save the new file in the root
            // ------- blogContent.saveNewFile()  ----------------------
            var result = 0;
            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/add", blogContent.FileItem, 'POST').success(function (response) {
              if (response.IsSuccess) {
                blogContent.FileItem = response.Item;
                blogContent.showSuccessIcon();
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-check");
                blogContent.filePickerFilePodcast.filename = blogContent.FileItem.FileName;
                blogContent.filePickerFilePodcast.fileId = response.Item.Id;
                blogContent.selectedItem.LinkFilePodcastId = blogContent.filePickerFilePodcast.fileId

              } else {
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-remove");
              }
            }).error(function (data) {
              blogContent.showErrorIcon();
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
    blogContent.uploadFileMovie = function (index, uploadFile) {
      if ($("#save-icon" + index).hasClass("fa-save")) {
        if (blogContent.fileIsExist(uploadFile.name)) { // File already exists
          if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
            //------------ blogContent.replaceFile(uploadFile.name);
            blogContent.itemClicked(null, blogContent.fileIdToDelete, "file");
            blogContent.fileTypes = 1;
            blogContent.fileIdToDelete = blogContent.selectedIndex;
            // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                blogContent.fileIdToDelete,
                "GET"
              )
              .success(function (response1) {
                if (response1.IsSuccess == true) {
                  rashaErManage.checkAction(response1);
                  ajax.call(cmsServerConfig.configApiServerPath + "FileContent/replace", response1.Item, "POST")
                    .success(function (response2) {
                      rashaErManage.checkAction(response2);

                      if (response2.IsSuccess == true) {
                        blogContent.FileItem = response2.Item;
                        blogContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        blogContent.filePickerFileMovie.filename =
                          blogContent.FileItem.FileName;
                        blogContent.filePickerFileMovie.fileId =
                          response2.Item.Id;
                        blogContent.selectedItem.LinkFileMovieId =
                          blogContent.filePickerFileMovie.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function (data) {
                      blogContent.showErrorIcon();
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
            blogContent.FileItem = response.Item;
            blogContent.FileItem.FileName = uploadFile.name;
            blogContent.FileItem.uploadName = uploadFile.uploadName;
            blogContent.FileItem.Extension = uploadFile.name.split('.').pop();
            blogContent.FileItem.FileSrc = uploadFile.name;
            blogContent.FileItem.LinkCategoryId = null; //Save the new file in the root
            // ------- blogContent.saveNewFile()  ----------------------
            var result = 0;
            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/add", blogContent.FileItem, 'POST').success(function (response) {
              if (response.IsSuccess) {
                blogContent.FileItem = response.Item;
                blogContent.showSuccessIcon();
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-check");
                blogContent.filePickerFileMovie.filename = blogContent.FileItem.FileName;
                blogContent.filePickerFileMovie.fileId = response.Item.Id;
                blogContent.selectedItem.LinkFileMovieId = blogContent.filePickerFileMovie.fileId

              } else {
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-remove");
              }
            }).error(function (data) {
              blogContent.showErrorIcon();
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
    blogContent.uploadFile = function (index, uploadFile) {
      if ($("#save-icon" + index).hasClass("fa-save")) {
        if (blogContent.fileIsExist(uploadFile.name)) {
          // File already exists
          if (
            confirm(
              'File "' +
              uploadFile.name +
              '" already exists! Do you want to replace the new file?'
            )
          ) {
            //------------ blogContent.replaceFile(uploadFile.name);
            blogContent.itemClicked(null, blogContent.fileIdToDelete, "file");
            blogContent.fileTypes = 1;
            blogContent.fileIdToDelete = blogContent.selectedIndex;
            // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                blogContent.fileIdToDelete,
                "GET"
              )
              .success(function (response1) {
                rashaErManage.checkAction(response1);
                if (response1.IsSuccess == true) {
                  ajax.call(cmsServerConfig.configApiServerPath + "FileContent/replace", response1.Item, "POST")
                    .success(function (response2) {
                      if (response2.IsSuccess == true) {
                        blogContent.FileItem = response2.Item;
                        blogContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        blogContent.filePickerMainImage.filename =
                          blogContent.FileItem.FileName;
                        blogContent.filePickerMainImage.fileId =
                          response2.Item.Id;
                        blogContent.selectedItem.LinkMainImageId =
                          blogContent.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function (data) {
                      blogContent.showErrorIcon();
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
              blogContent.FileItem = response.Item;
              blogContent.FileItem.FileName = uploadFile.name;
              blogContent.FileItem.uploadName = uploadFile.uploadName;
              blogContent.FileItem.Extension = uploadFile.name.split(".").pop();
              blogContent.FileItem.FileSrc = uploadFile.name;
              blogContent.FileItem.LinkCategoryId = null; //Save the new file in the root
              // ------- blogContent.saveNewFile()  ----------------------
              var result = 0;
              ajax
                .call(cmsServerConfig.configApiServerPath + "FileContent/add", blogContent.FileItem, "POST")
                .success(function (response) {
                  if (response.IsSuccess) {
                    blogContent.FileItem = response.Item;
                    blogContent.showSuccessIcon();
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-check");
                    blogContent.filePickerMainImage.filename =
                      blogContent.FileItem.FileName;
                    blogContent.filePickerMainImage.fileId = response.Item.Id;
                    blogContent.selectedItem.LinkMainImageId =
                      blogContent.filePickerMainImage.fileId;
                  } else {
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-remove");
                  }
                })
                .error(function (data) {
                  blogContent.showErrorIcon();
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
    blogContent.exportFile = function () {
      blogContent.addRequested = true;
      blogContent.gridOptions.advancedSearchData.engine.ExportFile =
        blogContent.ExportFileClass;
      ajax
        .call(
          cmsServerConfig.configApiServerPath + "blogContent/exportfile",
          blogContent.gridOptions.advancedSearchData.engine,
          "POST"
        )
        .success(function (response) {
          blogContent.addRequested = false;
          rashaErManage.checkAction(response);
          if (response.IsSuccess) {
            blogContent.exportDownloadLink =
              window.location.origin + response.LinkFile;
            $window.open(response.LinkFile, "_blank");
            //blogContent.closeModal();
          }
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    //Open Export Report Modal
    blogContent.toggleExportForm = function () {
      blogContent.SortType = [{
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
      blogContent.EnumExportFileType = [{
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
      blogContent.EnumExportReceiveMethod = [{
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
      blogContent.ExportFileClass = {
        FileType: 1,
        RecieveMethod: 0,
        RowCount: 100
      };
      blogContent.exportDownloadLink = null;
      $modal.open({
        templateUrl: "cpanelv1/ModuleBlog/BlogContent/report.html",
        scope: $scope
      });
    };
    //Row Count Export Input Change
    blogContent.rowCountChanged = function () {
      if (
        !angular.isDefined(blogContent.ExportFileClass.RowCount) ||
        blogContent.ExportFileClass.RowCount > 5000
      )
        blogContent.ExportFileClass.RowCount = 5000;
    };
    //Get TotalRowCount
    blogContent.getCount = function () {
      ajax.call(cmsServerConfig.configApiServerPath + "blogContent/count", blogContent.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
          blogContent.addRequested = false;
          rashaErManage.checkAction(response);
          blogContent.ListItemsTotalRowCount = ": " + response.TotalRowCount;
        })
        .error(function (data, errCode, c, d) {
          blogContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
        });
    };

    blogContent.showCategoryImage = function (mainImageId) {
      if (mainImageId == 0 || mainImageId == null) return;
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/PreviewImage", {
          id: mainImageId,
          name: ""
        }, "POST")
        .success(function (response) {
          blogContent.selectedItem.MainImageSrc = response;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };

    //TreeControl
    blogContent.treeOptions = {
      nodeChildren: "Children",
      multiSelection: false,
      isLeaf: function (node) {
        if (node.FileName == undefined || node.Filename == "") return false;
        return true;
      },
      isSelectable: function (node) {
        if (blogContent.treeOptions.dirSelectable)
          if (angular.isDefined(node.FileName)) return false;
        return true;
      },
      dirSelectable: false
    };

    blogContent.onNodeToggle = function (node, expanded) {
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


    blogContent.onSelection = function (node, selected) {
      if (!selected) {
        blogContent.selectedItem.LinkMainImageId = null;
        blogContent.selectedItem.previewImageSrc = null;
        return;
      }
      blogContent.selectedItem.LinkMainImageId = node.Id;
      blogContent.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages + "loader.gif";
      ajax
        .call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", node.Id, "GET")
        .success(function (response) {
          blogContent.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        })
        .error(function (data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    //End of TreeControl
  }
]);