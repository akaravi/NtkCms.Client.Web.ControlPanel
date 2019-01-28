app.controller("articleContentCtrl", [
  "$scope",
  "$http",
  "ajax",
  "rashaErManage",
  "$modal",
  "$modalStack",
  "SweetAlert",
  "$timeout",
  "$window",
    "$stateParams",
  "$filter",
  function(
    $scope,
    $http,
    ajax,
    rashaErManage,
    $modal,
    $modalStack,
    sweetAlert,
    $timeout,
    $window,
    $stateParams,
    $filter
  ) {
    var articleContent = this;
    var edititem=false;
    //For Grid Options
    articleContent.gridOptions = {};
    articleContent.selectedItem = {};
    articleContent.attachedFiles = [];
    articleContent.attachedFile = "";
    articleContent.selectedContentId = { Id: $stateParams.ContentId ,TitleTag:$stateParams.TitleTag };
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
        extension:'mp3',
        multiSelect: false,
    }
    articleContent.filePickerFiles = {
      isActive: true,
      backElement: "filePickerFiles",
      multiSelect: false,
      fileId: null,
      filename: null
    };
    articleContent.locationChanged = function(lat, lang) {
      console.log("ok " + lat + " " + lang);
    };

    articleContent.GeolocationConfig = {
      locationMember: "Geolocation",
      locationMemberString: "GeolocationString",
      onlocationChanged: articleContent.locationChanged,
      useCurrentLocation: true,
      center: { lat: 33.437039, lng: 53.073182 },
      zoom: 4,
      scope: articleContent,
      useCurrentLocationZoom: 12
    };
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined)
      articleContent.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    articleContent.selectedItem.ToDate = date;
    articleContent.datePickerConfig = {
      defaultDate: date
    };
    articleContent.startDate = {
      defaultDate: date
    };
    articleContent.endDate = {
      defaultDate: date
    };
    articleContent.count = 0;
    //#help/ سلکتور similar
    articleContent.LinkDestinationIdSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkDestinationId",
      url: "ArticleContent",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: articleContent,
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
    articleContent.LinkCategoryIdSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkCategoryId",
      url: "articleCategory",
      sortColumn: "Id",
      sortType: 0,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: articleContent,
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
    //Article Grid Options
    articleContent.gridOptions = {
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
          name: "Title",
          displayName: "عنوان",
          sortable: true,
          type: "string",
          visible: "true"
        },
        {
          name: "Description",
          displayName: "عنوان توضیحات",
          sortable: true,
          type: "string",
          visible: "true"
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
          name: "ToDate",
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
        },
        {
          name: "ActionKey",
          displayName: "افزودن به منو",
          displayForce: true,
          template:
            '<Button ng-if="!x.IsActivated" ng-click="articleContent.addMenu()"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>'
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
      columns: [
        {
          name: "Id",
          displayName: "کد سیستمی",
          sortable: true,
          type: "integer"
        },
        {
          name: "LinkSiteId",
          displayName: "کد سیستمی سایت",
          sortable: true,
          type: "integer",
          visible: true
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
            '<Button ng-if="!x.IsActivated" ng-click="articleContent.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button>' +
              '<Button ng-if="x.IsActivated" ng-click="articleContent.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button>' +
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
          SortType: 1,
          NeedToRunFakePagination: false,
          TotalRowData: 2000,
          RowPerPage: 20,
          ContentFullSearch: null,
          Filters: [],
          Count: false
        }
      }
    };
    articleContent.gridOptions.advancedSearchData.engine.Filters = null;
    articleContent.gridOptions.advancedSearchData.engine.Filters = [];
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
        ["insert", ["link", "picture", "video", "hr"]],
        ["view", ["fullscreen", "codeview"]],
        ["help", ["help"]]
      ]
    };
    //#tagsInput -----
    //articleContent.onTagAdded = function(tag) {
    //  if (!angular.isDefined(tag.id)) {
    //    //Check if this a new or a existing tag (existing tags comprise with an id)
    //    var tagObject = jQuery.extend({}, articleContent.ModuleTag); //#Clone a Javascript Object
    //    tagObject.Title = tag.text;
    //    ajax
    //      .call("/api/ArticleTag/add", tagObject, "POST")
    //      .success(function(response) {
    //        rashaErManage.checkAction(response);
    //        if (response.IsSuccess) {
    //          articleContent.tags[articleContent.tags.length - 1] = {
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
    articleContent.onTagRemoved = function(tag) {};
    //For Show Category Loading Indicator
    articleContent.categoryBusyIndicator = {
      isActive: true,
      message: "در حال بارگذاری دسته ها ..."
    };
    //For Show Article Loading Indicator
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
    articleContent.addMenu = function() {
      $modal.open({
        templateUrl: "cpanelv1/ModuleArticle/ArticleContent/modalMenu.html",
        scope: $scope
      });
    };

    articleContent.treeConfig.currentNode = {};
    articleContent.treeBusyIndicator = false;

    articleContent.addRequested = false;

    articleContent.showGridComment = false;
    articleContent.articleTitle = "";

    //init Function
    articleContent.init = function() {

      ajax
        .call(mainPathApi + "ArticleCategory/getall", { RowPerPage: 1000 }, "POST")
        .success(function(response) {
          articleContent.treeConfig.Items = response.ListItems;
          articleContent.categoryBusyIndicator.isActive = false;
        })
        .error(function(data, errCode, c, d) {
          console.log(data);
        });
 filterModel = { PropertyName: "ContentTags",PropertyAnyName:"LinkTagId", SearchType: 0, IntValue1: articleContent.selectedContentId.Id };
        if (articleContent.selectedContentId.Id >0)
            articleContent.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
      ajax
        .call(
          mainPathApi+"articleContent/getall",
          articleContent.gridOptions.advancedSearchData.engine,
          "POST"
        )
        .success(function(response) {
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
        .error(function(data, errCode, c, d) {
          articleContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
          articleContent.contentBusyIndicator.isActive = false;
        });
      ajax
        .call(mainPathApi + "ArticleTag/getviewmodel", "0", "GET")
        .success(function(response) {
          //Get a ViewModel for BiographyTag
          articleContent.ModuleTag = response.Item;
        })
        .error(function(data, errCode, c, d) {
          console.log(data);
        });
      ajax
        .call(mainPathApi + "articleContentTag/getviewmodel", "0", "GET")
        .success(function(response) {
          //Get a ViewModel for articleContentTag
          articleContent.ModuleContentTag = response.Item;
        })
        .error(function(data, errCode, c, d) {
          console.log(data);
        });
    };
    //#help دریافت پارامترهای مربوطه
    articleContent.getparameter = function(Idparam) {
      var filterModelparam = { Filters: [] };
      filterModelparam.Filters.push({
        PropertyName: "LinkModuleCategoryId",
        SearchType: 0,
        IntValue1: Idparam
      });
      ajax
        .call(mainPathApi + "ArticleContentParameter/getall", filterModelparam, "POST")
        .success(function(response1) {
          articleContent.ListItemsparam = response1.ListItems;
        })
        .error(function(data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    //#help اضافه کردن پارامترهای مربوطه
    articleContent.getparameter = function(Idparam) {
      var filterModelparam = { Filters: [] };
      filterModelparam.Filters.push({
        PropertyName: "LinkModuleCategoryId",
        SearchType: 0,
        IntValue1: Idparam
      });
      ajax
        .call(
          mainPathApi+"articleContentAndParameterValue/add",
          filterModelparam,
          "POST"
        )
        .success(function(response1) {
          articleContent.ListItemsparam = response1.ListItems;
        })
        .error(function(data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };

    // For Show Comments
    articleContent.showComment = function() {
      if (articleContent.gridOptions.selectedRow.item) {
        //var id = articleContent.gridOptions.selectedRow.item.Id;

        var Filter_value = {
          PropertyName: "LinkContentId",
          IntValue1: articleContent.gridOptions.selectedRow.item.Id,
          SearchType: 0
        };
        articleContent.gridContentOptions.advancedSearchData.engine.Filters = null;
        articleContent.gridContentOptions.advancedSearchData.engine.Filters = [];
        articleContent.gridContentOptions.advancedSearchData.engine.Filters.push(
          Filter_value
        );

        ajax
          .call(
            mainPathApi+"ArticleComment/getall",
            articleContent.gridContentOptions.advancedSearchData.engine,
            "POST"
          )
          .success(function(response) {
            articleContent.listComments = response.ListItems;
            //articleContent.gridOptions.resultAccess = response.resultAccess; // دسترسی ها نمایش
            articleContent.gridContentOptions.fillData(
              articleContent.listComments,
              response.resultAccess
            );
            articleContent.gridContentOptions.currentPageNumber =
              response.CurrentPageNumber;
            articleContent.gridContentOptions.totalRowCount =
              response.TotalRowCount;
            articleContent.allowedSearch = response.AllowedSearchField;
            rashaErManage.checkAction(response);
            articleContent.gridContentOptions.rowPerPage = response.RowPerPage;
            articleContent.gridOptions.maxSize = 5;
            articleContent.showGridComment = true;
            articleContent.Title =
              articleContent.gridOptions.selectedRow.item.Title;
          });
      }
    };

    articleContent.gridOptions.onRowSelected = function() {
      var item = articleContent.gridOptions.selectedRow.item;
      articleContent.showComment(item);
    };

    articleContent.gridContentOptions.onRowSelected = function() {};

      //open statistics
      articleContent.Showstatistics = function () {
          if (!articleContent.gridOptions.selectedRow.item) {
              rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
              return;
          }
          ajax.call(mainPathApi+'articleContent/getviewmodel', articleContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
              rashaErManage.checkAction(response1);
              articleContent.selectedItem = response1.Item;
              $modal.open({
                  templateUrl: "cpanelv1/ModuleArticle/articleContent/statistics.html",
                  scope: $scope
              });
          }).error(function (data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
          });
      }


    // Open Add Category Modal
    articleContent.addNewCategoryModel = function() {
      if (buttonIsPressed) {
        return;
      }
      articleContent.addRequested = false;
      buttonIsPressed = true;
      ajax
        .call(mainPathApi + "ArticleCategory/getviewmodel", "0", "GET")
        .success(function(response) {
          buttonIsPressed = false;
          rashaErManage.checkAction(response);
          articleContent.selectedItem = response.Item;
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
            .success(function(response1) {
              //Get root directories
              articleContent.dataForTheTree = response1.ListItems;
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
                .success(function(response2) {
                  //Get files in root
                  Array.prototype.push.apply(
                    articleContent.dataForTheTree,
                    response2.ListItems
                  );
                  $modal.open({
                    templateUrl:
                      "cpanelv1/ModuleArticle/ArticleCategory/add.html",
                    scope: $scope
                  });
                  articleContent.addRequested = false;
                })
                .error(function(data, errCode, c, d) {
                  console.log(data);
                });
            })
            .error(function(data, errCode, c, d) {
              console.log(data);
            });
          //-----
          //$modal.open({
          //    templateUrl: 'cpanelv1/ModuleArticle/ArticleCategory/add.html',
          //    scope: $scope
          //});
        })
        .error(function(data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Edit Category Modal
    articleContent.editCategoryModel = function() {
      if (buttonIsPressed) {
        return;
      }
      articleContent.addRequested = false;
      articleContent.modalTitle = "ویرایش";
      if (!articleContent.treeConfig.currentNode) {
        rashaErManage.showMessage($filter('translate')('Please_Select_A_Category_To_Edit'));
        return;
      }

      articleContent.contentBusyIndicator.isActive = true;
      buttonIsPressed = true;
      ajax
        .call(
          mainPathApi+"ArticleCategory/getviewmodel",
          articleContent.treeConfig.currentNode.Id,
          "GET"
        )
        .success(function(response) {
          buttonIsPressed = false;
          articleContent.contentBusyIndicator.isActive = false;
          rashaErManage.checkAction(response);
          articleContent.selectedItem = response.Item;
          //Set dataForTheTree
          articleContent.selectedNode = [];
          articleContent.expandedNodes = [];
          articleContent.selectedItem = response.Item;
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
            .success(function(response1) {
              //Get root directories
              articleContent.dataForTheTree = response1.ListItems;
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
                .success(function(response2) {
                  //Get files in root
                  Array.prototype.push.apply(
                    articleContent.dataForTheTree,
                    response2.ListItems
                  );
                  //Set selected files to treeControl
                  if (articleContent.selectedItem.LinkMainImageId > 0)
                    articleContent.onSelection(
                      { Id: articleContent.selectedItem.LinkMainImageId },
                      true
                    );
                  $modal.open({
                    templateUrl:
                      "cpanelv1/ModuleArticle/ArticleCategory/edit.html",
                    scope: $scope
                  });
                })
                .error(function(data, errCode, c, d) {
                  console.log(data);
                });
            })
            .error(function(data, errCode, c, d) {
              console.log(data);
            });
          //---
          //$modal.open({
          //    templateUrl: 'cpanelv1/ModuleArticle/ArticleCategory/edit.html',
          //    scope: $scope
          //});
        })
        .error(function(data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };

    // Add New Category
    articleContent.addNewCategory = function(frm) {
      if (frm.$invalid) {
        rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
        return;
      }
      articleContent.categoryBusyIndicator.isActive = true;
      articleContent.addRequested = true;
      articleContent.selectedItem.LinkParentId = null;
      if (articleContent.treeConfig.currentNode != null)
        articleContent.selectedItem.LinkParentId =
          articleContent.treeConfig.currentNode.Id;
      ajax
        .call(mainPathApi + "ArticleCategory/add", articleContent.selectedItem, "POST")
        .success(function(response) {
          articleContent.addRequested = false;
          rashaErManage.checkAction(response);
          console.log(response);
          if (response.IsSuccess) {
            articleContent.gridOptions.advancedSearchData.engine.Filters = null;
            articleContent.gridOptions.advancedSearchData.engine.Filters = [];
            articleContent.gridOptions.reGetAll();
            articleContent.closeModal();
          }
          articleContent.categoryBusyIndicator.isActive = false;
        })
        .error(function(data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          articleContent.addRequested = false;
          articleContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Edit Category REST Api
    articleContent.editCategory = function(frm) {
      if (frm.$invalid) {
        rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
        return;
      }
      articleContent.addRequested = true;
      articleContent.categoryBusyIndicator.isActive = true;
      ajax
        .call(mainPathApi + "ArticleCategory/edit", articleContent.selectedItem, "PUT")
        .success(function(response) {
          articleContent.addRequested = true;
          //articleContent.showbusy = false;
          articleContent.treeConfig.showbusy = false;
          articleContent.showIsBusy = false;
          rashaErManage.checkAction(response);
          if (response.IsSuccess) {
            articleContent.addRequested = false;
            articleContent.treeConfig.currentNode.Title = response.Item.Title;
            articleContent.closeModal();
          }
          articleContent.categoryBusyIndicator.isActive = false;
        })
        .error(function(data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          articleContent.addRequested = false;
          articleContent.categoryBusyIndicator.isActive = false;
        });
    };

    // Delete a Category
    articleContent.deleteCategory = function() {
      if (buttonIsPressed) {
        return;
      }
      var node = articleContent.treeConfig.currentNode;
      if (node.Id == 0 || !node.Id) {
        rashaErManage.showMessage($filter('translate')('Please_Select_A_Category_To_Remove'));
        return;
      }
      rashaErManage.showYesNo(
        ($filter('translate')('Warning')),
        ($filter('translate')('do_you_want_to_delete_this_attribute')),
        function(isConfirmed) {
          if (isConfirmed) {
            articleContent.categoryBusyIndicator.isActive = true;
            // console.log(node.gridOptions.selectedRow.item);
            buttonIsPressed = true;
            ajax
              .call(mainPathApi + "ArticleCategory/getviewmodel", node.Id, "GET")
              .success(function(response) {
                buttonIsPressed = false;
                rashaErManage.checkAction(response);
                articleContent.selectedItemForDelete = response.Item;
                console.log(articleContent.selectedItemForDelete);
                ajax
                  .call(
                    mainPathApi+"ArticleCategory/delete",
                    articleContent.selectedItemForDelete,
                    "DELETE"
                  )
                  .success(function(res) {
                    articleContent.categoryBusyIndicator.isActive = false;
                    if (res.IsSuccess) {
                      //articleContent.replaceCategoryItem(articleContent.treeConfig.Items, node.Id);
                      console.log("Deleted Successfully !");
                      articleContent.gridOptions.advancedSearchData.engine.Filters = null;
                      articleContent.gridOptions.advancedSearchData.engine.Filters = [];
                      articleContent.gridOptions.fillData();
                      articleContent.gridOptions.reGetAll();
                    } else {
                      //Error occurred
                      if (res.ErrorType == 15)
                        rashaErManage.showMessage(
                          ($filter('translate')('Unable_To_Delete_The_Category_Contains_Content'))
                        );
                    }
                  })
                  .error(function(data2, errCode2, c2, d2) {
                    rashaErManage.checkAction(data2);
                    articleContent.categoryBusyIndicator.isActive = false;
                  });
              })
              .error(function(data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                articleContent.categoryBusyIndicator.isActive = false;
              });
          }
        }
      );
    };

    //Tree On Node Select Options
    articleContent.treeConfig.onNodeSelect = function() {
      var node = articleContent.treeConfig.currentNode;
      articleContent.showGridComment = false;
      articleContent.selectContent(node);
    };
    //Show Content with Category Id
    articleContent.selectContent = function(node) {
      articleContent.gridOptions.advancedSearchData.engine.Filters = null;
      articleContent.gridOptions.advancedSearchData.engine.Filters = [];
    if(node !=null && node != undefined)
    {
      articleContent.contentBusyIndicator.message =
        "در حال بارگذاری مقاله های  دسته " + node.Title;
      articleContent.contentBusyIndicator.isActive = true;
      //articleContent.gridOptions.advancedSearchData = {};


      articleContent.attachedFiles = null;
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
          mainPathApi+"articleContent/getall",
          articleContent.gridOptions.advancedSearchData.engine,
          "POST"
        )
        .success(function(response) {
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
          articleContent.gridOptions.maxSize = 5;
        })
        .error(function(data, errCode, c, d) {
          articleContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    articleContent.addNewContentModel = function() {
      if (buttonIsPressed) {
        return;
      }
      var node = articleContent.treeConfig.currentNode;
      if (node.Id == 0 || !node.Id) {
          rashaErManage.showMessage($filter('translate')('To_Add_The_Article_Please_Select_The_Category'));
        return;
      }
      articleContent.attachedFiles = [];
      articleContent.attachedFile = "";
      articleContent.filePickerMainImage.filename = "";
      articleContent.filePickerMainImage.fileId = null;
      articleContent.filePickerFilePodcast.filename = "";
      articleContent.filePickerFilePodcast.fileId = null;
      articleContent.filePickerFiles.filename = "";
      articleContent.filePickerFiles.fileId = null;
      articleContent.tags = []; //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
      articleContent.kwords = []; //tagsInput خالی کردن آرایه کلمات کلیدی برای محتوای جدید
      articleContent.addRequested = false;
      articleContent.modalTitle = "اضافه کردن محتوای جدید";
      addNewContentModel = true;
      buttonIsPressed = true;
      ajax
        .call(mainPathApi + "articleContent/getviewmodel", "0", "GET")
        .success(function(response) {
          buttonIsPressed = false;
          addNewContentModel = false;
          console.log(response);
          rashaErManage.checkAction(response);
          articleContent.selectedItem = response.Item;
          articleContent.selectedItem.OtherInfos = [];
          articleContent.selectedItem.Similars = [];
          articleContent.selectedItem.LinkCategoryId = node.Id;
          articleContent.selectedItem.LinkFileIds = null;
          articleContent.clearPreviousData();

          //#help دریافت پارامترهای مربوطه
          articleContent.getparameter(
            articleContent.selectedItem.LinkCategoryId
          );

          $modal.open({
            templateUrl: "cpanelv1/ModuleArticle/articleContent/add.html",
            scope: $scope
          });
        })
        .error(function(data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };

    // Open Edit Content Modal
    articleContent.openEditModel = function() {
      if (buttonIsPressed) {
        return;
      }
      articleContent.addRequested = false;
      articleContent.modalTitle = "ویرایش";
      if (!articleContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
        return;
      }
      buttonIsPressed = true;
      ajax
        .call(
          mainPathApi+"articleContent/getviewmodel",
          articleContent.gridOptions.selectedRow.item.Id,
          "GET"
        )
        .success(function(response1) {
          buttonIsPressed = false;
          rashaErManage.checkAction(response1);
          articleContent.selectedItem = response1.Item;
          articleContent.startDate.defaultDate =
            articleContent.selectedItem.FromDate;
          articleContent.endDate.defaultDate =
            articleContent.selectedItem.ToDate;
          articleContent.filePickerMainImage.filename = null;
          articleContent.filePickerMainImage.fileId = null;
          articleContent.filePickerFilePodcast.filename = null;
          articleContent.filePickerFilePodcast.fileId = null;
          if (response1.Item.LinkMainImageId != null) {
            buttonIsPressed = true;
            ajax
              .call(
                mainPathApi+"CmsFileContent/getviewmodel",
                response1.Item.LinkMainImageId,
                "GET"
              )
              .success(function(response2) {
                buttonIsPressed = false;
                articleContent.filePickerMainImage.filename =
                  response2.Item.FileName;
                articleContent.filePickerMainImage.fileId = response2.Item.Id;
              })
              .error(function(data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
              });
          }
        if (response1.Item.LinkFilePodcastId != null) {
                ajax.call(mainPathApi+'CmsFileContent/getviewmodel', response1.Item.LinkFilePodcastId, 'GET').success(function (response2) {
                    articleContent.filePickerFilePodcast.filename = response2.Item.FileName;
                    articleContent.filePickerFilePodcast.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
          articleContent.parseFileIds(response1.Item.LinkFileIds);
          articleContent.filePickerFiles.filename = null;
          articleContent.filePickerFiles.fileId = null;
          //Load tagsInput
          articleContent.tags = []; //Clear out previous tags
          if (articleContent.selectedItem.ContentTags == null)
            articleContent.selectedItem.ContentTags = [];
          $.each(articleContent.selectedItem.ContentTags, function(
            index,
            item
          ) {
            if (item.ModuleTag != null)
              articleContent.tags.push({
                id: item.ModuleTag.Id,
                text: item.ModuleTag.Title
              }); //Add current content's tag to tags array with id and title
          });
          //Load Keywords tagsInput
          articleContent.kwords = []; //Clear out previous tags
          var arraykwords = [];
          if (
            articleContent.selectedItem.Keyword != null &&
            articleContent.selectedItem.Keyword != ""
          )
            arraykwords = articleContent.selectedItem.Keyword.split(",");
          $.each(arraykwords, function(index, item) {
            if (item != null) articleContent.kwords.push({ text: item }); //Add current content's tag to tags array with id and title
          });
          $modal.open({
            templateUrl: "cpanelv1/ModuleArticle/articleContent/edit.html",
            scope: $scope
          });
        })
        .error(function(data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    // Add New Content
    articleContent.addNewContent = function(frm) {
      if (frm.$invalid) {
        rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
        return;
      }
      articleContent.categoryBusyIndicator.isActive = true;
      articleContent.addRequested = true;
      //Save attached file ids into articleContent.selectedItem.LinkFileIds
      articleContent.selectedItem.LinkFileIds = "";
      articleContent.stringfyLinkFileIds();
      //Save Keywords
      $.each(articleContent.kwords, function(index, item) {
        if (index == 0) articleContent.selectedItem.Keyword = item.text;
        else articleContent.selectedItem.Keyword += "," + item.text;
      });
      if (
        articleContent.selectedItem.LinkCategoryId == null ||
        articleContent.selectedItem.LinkCategoryId == 0
      ) {
          rashaErManage.showMessage($filter('translate')('To_Add_The_Article_Please_Select_The_Category'));
        return;
      }
      var apiSelectedItem = articleContent.selectedItem;
      if (apiSelectedItem.Similars)
          $.each(apiSelectedItem.Similars, function (index, item) {
              item.Destination = [];
          });
      ajax
        .call(mainPathApi + "articleContent/add", apiSelectedItem, "POST")
        .success(function(response) {
          rashaErManage.checkAction(response);
          articleContent.categoryBusyIndicator.isActive = false;
          if (response.IsSuccess) {
            articleContent.ListItems.unshift(response.Item);
            articleContent.gridOptions.fillData(articleContent.ListItems);
            articleContent.closeModal();
            //Save inputTags
            articleContent.selectedItem.ContentTags = [];
              $.each(articleContent.tags, function (index, item) {
                  if (item.id > 0) {
                      var newObject = $.extend({}, articleContent.ModuleContentTag);
                      newObject.LinkTagId = item.id;
                      newObject.LinkContentId = response.Item.Id;
                      articleContent.selectedItem.ContentTags.push(newObject);
                  }
            });
            ajax
              .call(
                mainPathApi+"articleContentTag/addbatch",
                articleContent.selectedItem.ContentTags,
                "POST"
              )
              .success(function(response) {
                console.log(response);
              })
              .error(function(data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
              });
          }
        })
        .error(function(data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          articleContent.addRequested = false;
          articleContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Edit Content
    articleContent.editContent = function(frm) {
      if (frm.$invalid) {
        rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
        return;
      }
      articleContent.categoryBusyIndicator.isActive = true;
      articleContent.addRequested = true;

      //Save attached file ids into articleContent.selectedItem.LinkFileIds
      articleContent.selectedItem.LinkFileIds = "";
      articleContent.stringfyLinkFileIds();
      //Save inputTags
      articleContent.selectedItem.ContentTags = [];
        $.each(articleContent.tags, function (index, item) {
            if (item.id > 0) {
                var newObject = $.extend({}, articleContent.ModuleContentTag);
                newObject.LinkTagId = item.id;
                newObject.LinkContentId = articleContent.selectedItem.Id;
                articleContent.selectedItem.ContentTags.push(newObject);
            }
      });
      //Save Keywords
      $.each(articleContent.kwords, function(index, item) {
        if (index == 0) articleContent.selectedItem.Keyword = item.text;
        else articleContent.selectedItem.Keyword += "," + item.text;
      });
      if (
        articleContent.selectedItem.LinkCategoryId == null ||
        articleContent.selectedItem.LinkCategoryId == 0
      ) {
          rashaErManage.showMessage($filter('translate')('To_Add_The_Article_Please_Select_The_Category'));
        return;
      }
      if (
        articleContent.selectedItem.LinkCategoryId == null ||
        articleContent.selectedItem.LinkCategoryId == 0
      ) {
          rashaErManage.showMessage($filter('translate')('To_Add_The_Article_Please_Select_The_Category'));
        return;
      }
      var apiSelectedItem = articleContent.selectedItem;
      if (apiSelectedItem.Similars)
        $.each(apiSelectedItem.Similars, function(index, item) {
          item.Destination = [];
        });
      ajax
        .call(mainPathApi + "articleContent/edit", apiSelectedItem, "PUT")
        .success(function(response) {
          articleContent.categoryBusyIndicator.isActive = false;
          articleContent.addRequested = false;
          articleContent.treeConfig.showbusy = false;
          articleContent.showIsBusy = false;
          rashaErManage.checkAction(response);
          if (response.IsSuccess) {
            articleContent.replaceItem(
              articleContent.selectedItem.Id,
              response.Item
            );
            articleContent.gridOptions.fillData(articleContent.ListItems);
            articleContent.closeModal();
          }
        })
        .error(function(data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          articleContent.addRequested = false;
          articleContent.categoryBusyIndicator.isActive = false;
        });
    };
    //#help similar & otherinfo
    articleContent.clearPreviousData = function() {
      articleContent.selectedItem.Similars = [];
      $("#to").empty();
    };

    articleContent.moveSelected = function(from, to, calculatePrice) {
      if (from == "Content") {
        //var title = articleContent.ItemListIdSelector.selectedItem.Title;
        // var optionSelectedPrice = articleContent.ItemListIdSelector.selectedItem.Price;
        if (
          articleContent.selectedItem.LinkDestinationId != undefined &&
          articleContent.selectedItem.LinkDestinationId != null
        ) {
          if (articleContent.selectedItem.Similars == undefined)
            articleContent.selectedItem.Similars = [];
          for (
            var i = 0;
            i < articleContent.selectedItem.Similars.length;
            i++
          ) {
            if (
              articleContent.selectedItem.Similars[i].LinkDestinationId ==
              articleContent.selectedItem.LinkDestinationId
            ) {
              rashaErManage.showMessage($filter('translate')('Content_Is_Duplicate'));
              return;
            }
          }
          // if (articleContent.selectedItem.Title == null || articleContent.selectedItem.Title.length < 0)
          //     articleContent.selectedItem.Title = title;
          articleContent.selectedItem.Similars.push({
            //Id: 0,
            //Source: from,
            LinkDestinationId: articleContent.selectedItem.LinkDestinationId,
            Destination: articleContent.LinkDestinationIdSelector.selectedItem
          });
        }
      }
    };
    articleContent.moveSelectedOtherInfo = function(from, to, y) {
      if (articleContent.selectedItem.OtherInfos == undefined)
        articleContent.selectedItem.OtherInfos = [];
      for (var i = 0; i < articleContent.selectedItem.OtherInfos.length; i++) {
        if (
          articleContent.selectedItem.OtherInfos[i].Title ==
            articleContent.selectedItemOtherInfos.Title &&
          articleContent.selectedItem.OtherInfos[i].HtmlBody ==
            articleContent.selectedItemOtherInfos.HtmlBody &&
          articleContent.selectedItem.OtherInfos[i].Source ==
            articleContent.selectedItemOtherInfos.Source
        ) {
            rashaErManage.showMessage($filter('translate')('Information_Is_Duplicate'));
          return;
        }
      }
      if (
        articleContent.selectedItemOtherInfos.Title == "" &&
        articleContent.selectedItemOtherInfos.Source == "" &&
        articleContent.selectedItemOtherInfos.HtmlBody == ""
      ) {
        rashaErManage.showMessage(
            $filter('translate')('Fields_Values_Are_Empty_Please_Enter_Values')
        );
      } else {
        articleContent.selectedItem.OtherInfos.push({
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

    articleContent.removeFromCollection = function(listsimilar, iddestination) {
      for (var i = 0; i < articleContent.selectedItem.Similars.length; i++) {
        if (listsimilar[i].LinkDestinationId == iddestination) {
          articleContent.selectedItem.Similars.splice(i, 1);
          return;
        }
      }
    };
    articleContent.removeFromOtherInfo = function(
      listOtherInfo,
      title,
      body,
      source
    ) {
      for (var i = 0; i < articleContent.selectedItem.OtherInfos.length; i++) {
        if (
          listOtherInfo[i].Title == title &&
          listOtherInfo[i].HtmlBody == body &&
          listOtherInfo[i].Source == source
        ) {
          articleContent.selectedItem.OtherInfos.splice(i, 1);
          return;
        }
      }
    };
    articleContent.editOtherInfo = function(y) {
      edititem = true;
      articleContent.selectedItemOtherInfos.Title = y.Title;
      articleContent.selectedItemOtherInfos.HtmlBody = y.HtmlBody;
      articleContent.selectedItemOtherInfos.Source = y.Source;
      articleContent.removeFromOtherInfo(
        articleContent.selectedItem.OtherInfos,
        y.Title,
        y.HtmlBody,
        y.Source
      );
    };

    //#help
    // Delete a Article Content
    articleContent.deleteContent = function() {
      if (buttonIsPressed) {
        return;
      }
      if (!articleContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
        return;
      }
      articleContent.treeConfig.showbusy = true;
      articleContent.showIsBusy = true;
      rashaErManage.showYesNo(
        ($filter('translate')('Warning')),
        ($filter('translate')('do_you_want_to_delete_this_attribute')),
        function(isConfirmed) {
          if (isConfirmed) {
            articleContent.categoryBusyIndicator.isActive = true;
            console.log(articleContent.gridOptions.selectedRow.item);
            articleContent.showbusy = true;
            articleContent.showIsBusy = true;
            buttonIsPressed = true;
            ajax
              .call(
                mainPathApi+"articleContent/getviewmodel",
                articleContent.gridOptions.selectedRow.item.Id,
                "GET"
              )
              .success(function(response) {
                buttonIsPressed = false;
                articleContent.showbusy = false;
                articleContent.showIsBusy = false;
                rashaErManage.checkAction(response);
                articleContent.selectedItemForDelete = response.Item;
                console.log(articleContent.selectedItemForDelete);
                ajax
                  .call(
                    mainPathApi+"articleContent/delete",
                    articleContent.selectedItemForDelete,
                    "DELETE"
                  )
                  .success(function(res) {
                    articleContent.categoryBusyIndicator.isActive = false;
                    articleContent.treeConfig.showbusy = false;
                    articleContent.showIsBusy = false;
                    rashaErManage.checkAction(res);
                    if (res.IsSuccess) {
                      articleContent.replaceItem(
                        articleContent.selectedItemForDelete.Id
                      );
                      articleContent.gridOptions.fillData(
                        articleContent.ListItems
                      );
                    }
                  })
                  .error(function(data2, errCode2, c2, d2) {
                    rashaErManage.checkAction(data2);
                    articleContent.treeConfig.showbusy = false;
                    articleContent.showIsBusy = false;
                    articleContent.categoryBusyIndicator.isActive = false;
                  });
              })
              .error(function(data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                articleContent.treeConfig.showbusy = false;
                articleContent.showIsBusy = false;
                articleContent.categoryBusyIndicator.isActive = false;
              });
          }
        }
      );
    };

    //Confirm/UnConfirm Article Content
    articleContent.confirmUnConfirmarticleContent = function() {
      if (!articleContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
        return;
      }
      ajax
        .call(
          mainPathApi+"articleContent/getviewmodel",
          articleContent.gridOptions.selectedRow.item.Id,
          "GET"
        )
        .success(function(response) {
          rashaErManage.checkAction(response);
          articleContent.selectedItem = response.Item;
          articleContent.selectedItem.IsAccepted = response.Item.IsAccepted ==
            true
            ? false
            : true;
          ajax
            .call(mainPathApi + "articleContent/edit", articleContent.selectedItem, "PUT")
            .success(function(response2) {
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
            .error(function(data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
            });
        })
        .error(function(data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };

    //Add To Archive New Content
    articleContent.enableArchive = function() {
      if (!articleContent.gridOptions.selectedRow.item) {
        rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
        return;
      }
      ajax
        .call(
          mainPathApi+"articleContent/getviewmodel",
          articleContent.gridOptions.selectedRow.item.Id,
          "GET"
        )
        .success(function(response) {
          rashaErManage.checkAction(response);
          articleContent.selectedItem = response.Item;
          articleContent.selectedItem.IsArchive = response.Item.IsArchive ==
            true
            ? false
            : true;
          ajax
            .call(mainPathApi + "articleContent/edit", articleContent.selectedItem, "PUT")
            .success(function(response2) {
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
            .error(function(data, errCode, c, d) {
              rashaErManage.checkAction(data, errCode);
              articleContent.categoryBusyIndicator.isActive = false;
            });
        })
        .error(function(data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
          articleContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Replace Item OnDelete/OnEdit Grid Options
    articleContent.replaceItem = function(oldId, newItem) {
      angular.forEach(articleContent.ListItems, function(item, key) {
        if (item.Id == oldId) {
          var index = articleContent.ListItems.indexOf(item);
          articleContent.ListItems.splice(index, 1);
        }
      });
      if (newItem) articleContent.ListItems.unshift(newItem);
    };

    articleContent.summernoteText =
      "<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />";
    articleContent.searchData = function() {
      articleContent.categoryBusyIndicator.isActive = true;
      ajax
        .call(
          mainPathApi+"articleContent/getall",
          articleContent.gridOptions.advancedSearchData.engine,
          "POST"
        )
        .success(function(response) {
          rashaErManage.checkAction(response);
          articleContent.categoryBusyIndicator.isActive = false;
          articleContent.ListItems = response.ListItems;
          articleContent.gridOptions.fillData(articleContent.ListItems);
          articleContent.gridOptions.currentPageNumber =
            response.CurrentPageNumber;
          articleContent.gridOptions.totalRowCount = response.TotalRowCount;
          articleContent.gridOptions.rowPerPage = response.RowPerPage;
          articleContent.gridOptions.maxSize = 5;
          articleContent.allowedSearch = response.AllowedSearchField;
        })
        .error(function(data, errCode, c, d) {
          articleContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
        });
    };

    //Close Model Stack
    articleContent.addRequested = false;
    articleContent.closeModal = function() {
      $modalStack.dismissAll();
    };

    articleContent.showIsBusy = false;

    //Aprove a comment
    articleContent.confirmComment = function(item) {
      console.log("This comment will be confirmed:", item);
    };

    //Decline a comment
    articleContent.doNotConfirmComment = function(item) {
      console.log("This comment will not be confirmed:", item);
    };
    //Remove a comment
    articleContent.deleteComment = function(item) {
      if (!articleContent.gridContentOptions.selectedRow.item) {
        rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
        return;
      }
      articleContent.treeConfig.showbusy = true;
      articleContent.showIsBusy = true;
      rashaErManage.showYesNo(
        ($filter('translate')('Warning')),
        "آیا می خواهید این نظر را حذف کنید",
        function(isConfirmed) {
          if (isConfirmed) {
            console.log(
              "Item to be deleted: ",
              articleContent.gridOptions.selectedRow.item
            );
            articleContent.showbusy = true;
            articleContent.showIsBusy = true;
            ajax
              .call(
                mainPathApi+"articleContent/getviewmodel",
                articleContent.gridOptions.selectedRow.item.Id,
                "GET"
              )
              .success(function(response) {
                articleContent.showbusy = false;
                articleContent.showIsBusy = false;
                rashaErManage.checkAction(response);
                articleContent.selectedItemForDelete = response.Item;
                console.log(articleContent.selectedItemForDelete);
                ajax
                  .call(
                    mainPathApi+"articleContent/delete",
                    articleContent.selectedItemForDelete,
                    "DELETE"
                  )
                  .success(function(res) {
                    articleContent.treeConfig.showbusy = false;
                    articleContent.showIsBusy = false;
                    rashaErManage.checkAction(res);
                    if (res.IsSuccess) {
                      articleContent.replaceItem(
                        articleContent.selectedItemForDelete.Id
                      );
                      articleContent.gridOptions.fillData(
                        articleContent.ListItems
                      );
                    }
                  })
                  .error(function(data2, errCode2, c2, d2) {
                    rashaErManage.checkAction(data2);
                    articleContent.treeConfig.showbusy = false;
                    articleContent.showIsBusy = false;
                  });
              })
              .error(function(data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                articleContent.treeConfig.showbusy = false;
                articleContent.showIsBusy = false;
              });
          }
        }
      );
    };

    //For reInit Categories
    articleContent.gridOptions.reGetAll = function() {
      if (
        articleContent.gridOptions.advancedSearchData.engine.Filters.length > 0
      )
        articleContent.searchData();
      else articleContent.init();
    };

    articleContent.openDateExpireLockAccount = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $timeout(function() {
        articleContent.focusExpireLockAccount = true;
      });
    };

    articleContent.isCurrentNodeEmpty = function() {
      return !angular.equals({}, articleContent.treeConfig.currentNode);
    };

    articleContent.loadFileAndFolder = function(item) {
      articleContent.treeConfig.currentNode = item;
      console.log(item);
      articleContent.treeConfig.onNodeSelect(item);
    };

    articleContent.openDate = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $timeout(function() {
        articleContent.focus = true;
      });
    };
    articleContent.openDate1 = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $timeout(function() {
        articleContent.focus1 = true;
      });
    };

    articleContent.columnCheckbox = false;
    articleContent.openGridConfigModal = function() {
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
        console.log(
          articleContent.gridOptions.columns[i].name.concat(".visible: "),
          articleContent.gridOptions.columns[i].visible
        );
      }
      articleContent.gridOptions.columnCheckbox = !articleContent.gridOptions
        .columnCheckbox;
    };

    articleContent.deleteAttachedFile = function(index) {
      articleContent.attachedFiles.splice(index, 1);
    };

    articleContent.addAttachedFile = function(id) {
      var fname = $("#file" + id).text();
      if (
        id != null &&
        id != undefined &&
        !articleContent.alreadyExist(id, articleContent.attachedFiles) &&
        fname != null &&
        fname != ""
      ) {
        var fId = id;
        var file = { id: fId, name: fname };
        articleContent.attachedFiles.push(file);
        if (document.getElementsByName("file" + id).length > 1)
          document.getElementsByName("file" + id)[1].textContent = "";
        else document.getElementsByName("file" + id)[0].textContent = "";
      }
    };

    articleContent.alreadyExist = function(id, array) {
      for (var i = 0; i < array.length; i++) {
        if (id == array[i].fileId) {
          rashaErManage.showMessage($filter('translate')('This_File_Has_Already_Been_Attachment'));
          return true;
        }
      }
      return false;
    };

    articleContent.filePickerMainImage.removeSelectedfile = function(config) {
      articleContent.filePickerMainImage.fileId = null;
      articleContent.filePickerMainImage.filename = null;
      articleContent.selectedItem.LinkMainImageId = null;
    };
    articleContent.filePickerFilePodcast.removeSelectedfile = function (config) {
        articleContent.filePickerFilePodcast.fileId = null;
        articleContent.filePickerFilePodcast.filename = null;
        articleContent.selectedItem.LinkFilePodcastId = null;
    }
    articleContent.filePickerFiles.removeSelectedfile = function(config) {
      articleContent.filePickerFiles.fileId = null;
      articleContent.filePickerFiles.filename = null;
    };

    articleContent.showUpload = function() {
      $("#fastUpload").fadeToggle();
    };

    // ----------- FilePicker Codes --------------------------------
    articleContent.addAttachedFile = function(id) {
      var fname = $("#file" + id).text();
      if (fname == "") {
          rashaErManage.showMessage($filter('translate')('Please_Select_A_File_To_Add'));
        return;
      }
      if (
        id != null &&
        id != undefined &&
        !articleContent.alreadyExist(id, articleContent.attachedFiles)
      ) {
        var fId = id;
        var file = { fileId: fId, filename: fname };
        articleContent.attachedFiles.push(file);
        articleContent.clearfilePickers();
      }
    };

    articleContent.alreadyExist = function(fieldId, array) {
      for (var i = 0; i < array.length; i++) {
        if (fieldId == array[i].fileId) {
          rashaErManage.showMessage($filter('translate')('This_Item_Has_Already_Been_Added'));
          articleContent.clearfilePickers();
          return true;
        }
      }
      return false;
    };

    articleContent.parseFileIds = function(stringOfIds) {
      if (stringOfIds == null || !stringOfIds.trim()) return;
      var fileIds = stringOfIds.split(",");
      if (fileIds.length != undefined) {
        $.each(fileIds, function(index, item) {
          if (item == parseInt(item, 10)) {
            // Check if item is an integer
            ajax
              .call(mainPathApi + "CmsFileContent/getviewmodel", parseInt(item), "GET")
              .success(function(response) {
                if (response.IsSuccess) {
                  articleContent.attachedFiles.push({
                    fileId: response.Item.Id,
                    filename: response.Item.FileName
                  });
                }
              })
              .error(function(data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
              });
          }
        });
      }
    };

    articleContent.clearfilePickers = function() {
      articleContent.filePickerFiles.fileId = null;
      articleContent.filePickerFiles.filename = null;
    };

    articleContent.stringfyLinkFileIds = function() {
      $.each(articleContent.attachedFiles, function(i, item) {
        if (articleContent.selectedItem.LinkFileIds == "")
          articleContent.selectedItem.LinkFileIds = item.fileId;
        else articleContent.selectedItem.LinkFileIds += "," + item.fileId;
      });
    };
    //--------- End FilePickers Codes -------------------------

    //---------------Upload Modal-------------------------------
    articleContent.openUploadModal = function() {
      $modal.open({
        templateUrl: "cpanelv1/ModuleArticle/ArticleContent/upload_modal.html",
        size: "lg",
        scope: $scope
      });

      articleContent.FileList = [];
      //get list of file from category id
      ajax
        .call(mainPathApi + "CmsFileContent/GetFilesFromCategory", null, "POST")
        .success(function(response) {
          articleContent.FileList = response.ListItems;
        })
        .error(function(data) {
          console.log(data);
        });
    };
//---------------Upload Modal Podcast-------------------------------
     articleContent.openUploadModalPodcast = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleArticle/articleContent/upload_modalPodcast.html',
            size: 'lg',
            scope: $scope
        });

        articleContent.FileList = [];
        //get list of file from category id
        ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", null, 'POST').success(function (response) {
            articleContent.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }
    articleContent.calcuteProgress = function(progress) {
      wdth = Math.floor(progress * 100);
      return wdth;
    };

    articleContent.whatcolor = function(progress) {
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

    articleContent.canShow = function(pr) {
      if (pr == 1) {
        return true;
      }
      return false;
    };
    // File Manager actions
    articleContent.replaceFile = function(name) {
      articleContent.itemClicked(null, articleContent.fileIdToDelete, "file");
      articleContent.fileTypes = 1;
      articleContent.fileIdToDelete = articleContent.selectedIndex;

      // Delete the file
      ajax
        .call(mainPathApi + "CmsFileContent/getviewmodel", articleContent.fileIdToDelete, "GET")
        .success(function(response1) {
          if (response1.IsSuccess == true) {
            console.log(response1.Item);
            ajax
              .call(mainPathApi + "CmsFileContent/delete", response1.Item, "DELETE")
              .success(function(response2) {
                articleContent.remove(
                  articleContent.FileList,
                  articleContent.fileIdToDelete
                );
                if (response2.IsSuccess == true) {
                  // Save New file
                  ajax
                    .call(mainPathApi + "CmsFileContent/getviewmodel", "0", "GET")
                    .success(function(response3) {
                      if (response3.IsSuccess == true) {
                        articleContent.FileItem = response3.Item;
                        articleContent.FileItem.FileName = name;
                        articleContent.FileItem.Extension = name
                          .split(".")
                          .pop();
                        articleContent.FileItem.FileSrc = name;
                        articleContent.FileItem.LinkCategoryId =
                          articleContent.thisCategory;
                        articleContent.saveNewFile();
                      } else {
                        console.log(
                          "getting the model was not successfully returned!"
                        );
                      }
                    })
                    .error(function(data) {
                      console.log(data);
                    });
                } else {
                  console.log(
                    "Request to api/CmsFileContent/delete was not successfully returned!"
                  );
                }
              })
              .error(function(data, errCode, c, d) {
                console.log(data);
              });
          }
        })
        .error(function(data) {
          console.log(data);
        });
    };
    //save new file
    articleContent.saveNewFile = function() {
      ajax
        .call(mainPathApi + "CmsFileContent/add", articleContent.FileItem, "POST")
        .success(function(response) {
          if (response.IsSuccess) {
            articleContent.FileItem = response.Item;
            articleContent.showSuccessIcon();
            return 1;
          } else {
            return 0;
          }
        })
        .error(function(data) {
          articleContent.showErrorIcon();
          return -1;
        });
    };

    articleContent.showSuccessIcon = function() {
      $().toggle;
    };

    articleContent.showErrorIcon = function() {};
    //file is exist
    articleContent.fileIsExist = function(fileName) {
      for (var i = 0; i < articleContent.FileList.length; i++) {
        if (articleContent.FileList[i].FileName == fileName) {
          articleContent.fileIdToDelete = articleContent.FileList[i].Id;
          return true;
        }
      }
      return false;
    };

    articleContent.getFileItem = function(id) {
      for (var i = 0; i < articleContent.FileList.length; i++) {
        if (articleContent.FileList[i].Id == id) {
          return articleContent.FileList[i];
        }
      }
    };

    //select file or folder
    articleContent.itemClicked = function($event, index, type) {
      if (type == "file" || type == 1) {
        articleContent.fileTypes = 1;
        articleContent.selectedFileId = articleContent.getFileItem(index).Id;
        articleContent.selectedFileName = articleContent.getFileItem(
          index
        ).FileName;
      } else {
        articleContent.fileTypes = 2;
        articleContent.selectedCategoryId = articleContent.getCategoryName(
          index
        ).Id;
        articleContent.selectedCategoryTitle = articleContent.getCategoryName(
          index
        ).Title;
      }
      //if (event.ctrlKey) {
      //    alert("ctrl pressed");
      //}

      articleContent.selectedIndex = index;
    };

    articleContent.toggleCategoryButtons = function() {
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
                mainPathApi+"CmsFileContent/getviewmodel",
                articleContent.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(mainPathApi+"CmsFileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
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
                    .error(function(data) {
                      articleContent.showErrorIcon();
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
                ajax.call(mainPathApi+"CmsFileContent/getviewmodel", "0", 'GET').success(function (response) {
                    articleContent.FileItem = response.Item;
                    articleContent.FileItem.FileName = uploadFile.name;
                    articleContent.FileItem.uploadName = uploadFile.uploadName;
                    articleContent.FileItem.Extension = uploadFile.name.split('.').pop();
                    articleContent.FileItem.FileSrc = uploadFile.name;
                    articleContent.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- articleContent.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(mainPathApi+"CmsFileContent/add", articleContent.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            articleContent.FileItem = response.Item;
                            articleContent.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            articleContent.filePickerFilePodcast.filename = articleContent.FileItem.FileName;
                            articleContent.filePickerFilePodcast.fileId = response.Item.Id;
                            articleContent.selectedItem.LinkFilePodcastId = articleContent.filePickerFilePodcast.fileId

                        }
                        else {
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
            articleContent.itemClicked(
              null,
              articleContent.fileIdToDelete,
              "file"
            );
            articleContent.fileTypes = 1;
            articleContent.fileIdToDelete = articleContent.selectedIndex;
            // replace the file
            ajax
              .call(
                mainPathApi+"CmsFileContent/getviewmodel",
                articleContent.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(mainPathApi+"CmsFileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
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
                    .error(function(data) {
                      articleContent.showErrorIcon();
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
        } else {
          // File does not exists
          // Save New file
          ajax
            .call(mainPathApi + "CmsFileContent/getviewmodel", "0", "GET")
            .success(function(response) {
              articleContent.FileItem = response.Item;
                articleContent.FileItem.FileName = uploadFile.name;
                articleContent.FileItem.uploadName = uploadFile.uploadName;
                articleContent.FileItem.Extension = uploadFile.name.split(".").pop();
                articleContent.FileItem.FileSrc = uploadFile.name;
              articleContent.FileItem.LinkCategoryId = null; //Save the new file in the root
              // ------- articleContent.saveNewFile()  ----------------------
              var result = 0;
              ajax
                .call(mainPathApi + "CmsFileContent/add", articleContent.FileItem, "POST")
                .success(function(response) {
                  if (response.IsSuccess) {
                    articleContent.FileItem = response.Item;
                    articleContent.showSuccessIcon();
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-check");
                    articleContent.filePickerMainImage.filename =
                      articleContent.FileItem.FileName;
                    articleContent.filePickerMainImage.fileId =
                      response.Item.Id;
                    articleContent.selectedItem.LinkMainImageId =
                      articleContent.filePickerMainImage.fileId;
                  } else {
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-remove");
                  }
                })
                .error(function(data) {
                  articleContent.showErrorIcon();
                  $("#save-icon" + index).removeClass("fa-save");
                  $("#save-button" + index).removeClass("flashing-button");
                  $("#save-icon" + index).addClass("fa-remove");
                });
              //-----------------------------------
            })
            .error(function(data) {
              console.log(data);
              $("#save-icon" + index).removeClass("fa-save");
              $("#save-button" + index).removeClass("flashing-button");
              $("#save-icon" + index).addClass("fa-remove");
            });
        }
      }
    };
    //End of Upload Modal-----------------------------------------

    //Export Report
    articleContent.exportFile = function() {
      articleContent.gridOptions.advancedSearchData.engine.ExportFile =
        articleContent.ExportFileClass;
      articleContent.addRequested = true;
      ajax
        .call(
          mainPathApi+"ArticleContent/exportfile",
          articleContent.gridOptions.advancedSearchData.engine,
          "POST"
        )
        .success(function(response) {
          articleContent.addRequested = false;
          rashaErManage.checkAction(response);
          if (response.IsSuccess) {
            articleContent.exportDownloadLink =
              window.location.origin + response.LinkFile;
            $window.open(response.LinkFile, "_blank");
            //articleContent.closeModal();
          }
        })
        .error(function(data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    //Open Export Report Modal
    articleContent.toggleExportForm = function() {
      articleContent.SortType = [
        { key: "نزولی", value: 0 },
        { key: "صعودی", value: 1 },
        { key: "تصادفی", value: 3 }
      ];
      articleContent.EnumExportFileType = [
        { key: "Excel", value: 1 },
        { key: "PDF", value: 2 },
        { key: "Text", value: 3 }
      ];
      articleContent.EnumExportReceiveMethod = [
        { key: "دانلود", value: 0 },
        { key: "ایمیل", value: 1 },
        { key: "فایل منیجر", value: 3 }
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
    articleContent.rowCountChanged = function() {
      if (
        !angular.isDefined(articleContent.ExportFileClass.RowCount) ||
        articleContent.ExportFileClass.RowCount > 5000
      )
        articleContent.ExportFileClass.RowCount = 5000;
    };
    //Get TotalRowCount
    articleContent.getCount = function() {
      ajax
        .call(
          mainPathApi+"ArticleContent/count",
          articleContent.gridOptions.advancedSearchData.engine,
          "POST"
        )
        .success(function(response) {
          articleContent.addRequested = false;
          rashaErManage.checkAction(response);
          articleContent.ListItemsTotalRowCount = ": " + response.TotalRowCount;
        })
        .error(function(data, errCode, c, d) {
          articleContent.gridOptions.fillData();
          rashaErManage.checkAction(data, errCode);
        });
    };

    articleContent.showCategoryImage = function(mainImageId) {
      if (mainImageId == 0 || mainImageId == null) return;
      ajax
        .call(mainPathApi + "CmsFileContent/PreviewImage", { id: mainImageId, name: "" }, "POST")
        .success(function(response) {
          articleContent.selectedItem.MainImageSrc = response;
        })
        .error(function(data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    };
    //TreeControl
    articleContent.treeOptions = {
      nodeChildren: "Children",
      multiSelection: false,
      isLeaf: function(node) {
        if (node.FileName == undefined || node.Filename == "") return false;
        return true;
      },
      isSelectable: function(node) {
        if (articleContent.treeOptions.dirSelectable)
          if (angular.isDefined(node.FileName)) return false;
        return true;
      },
      dirSelectable: false
    };

    articleContent.onNodeToggle = function(node, expanded) {
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
          .success(function(response1) {
            angular.forEach(response1.ListItems, function(value, key) {
              node.Children.push(value);
            });
            ajax
              .call(mainPathApi + "CmsFileContent/GetFilesFromCategory", node.Id, "POST")
              .success(function(response2) {
                angular.forEach(response2.ListItems, function(value, key) {
                  node.Children.push(value);
                });
                node.messageText = "";
              })
              .error(function(data, errCode, c, d) {
                console.log(data);
              });
          })
          .error(function(data, errCode, c, d) {
            console.log(data);
          });
      }
    };

    articleContent.onSelection = function(node, selected) {
      if (!selected) {
        articleContent.selectedItem.LinkMainImageId = null;
        articleContent.selectedItem.previewImageSrc = null;
        return;
      }
      articleContent.selectedItem.LinkMainImageId = node.Id;
      articleContent.selectedItem.previewImageSrc = "CmsFiles/img/loader.gif";
      ajax
        .call(mainPathApi + "CmsFileContent/getviewmodel", node.Id, "GET")
        .success(function(response) {
          articleContent.selectedItem.previewImageSrc =
            "/files/" + response.Item.Id + "/" + response.Item.FileName;
        })
        .error(function(data, errCode, c, d) {
          console.log(data);
        });
    };
    //End of TreeControl
  }
]);
