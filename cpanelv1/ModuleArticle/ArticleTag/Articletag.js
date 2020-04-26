app.controller("articleTagCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window','$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window,$state, $filter) {
    var articleTag = this;
    var edititem=false;
    //For Grid Options
    articleTag.gridOptions = {};
    articleTag.selectedItem = {};
    articleTag.attachedFiles = [];
    articleTag.attachedFile = "";
    var todayDate = moment().format();
    articleTag.DateBirth = {
        defaultDate: todayDate,
        viewTimePicker: true
    }
    articleTag.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }

    articleTag.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    articleTag.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    articleTag.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:articleTag.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:articleTag,
        useCurrentLocationZoom:12,
    }
    if (itemRecordStatus != undefined) articleTag.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    articleTag.selectedItem.ToDate = date;
    articleTag.datePickerConfig = {
        defaultDate: date
    };
    articleTag.startDate = {
        defaultDate: date
    }
    articleTag.endDate = {
        defaultDate: date
    }
    articleTag.count = 0;

//#help/ سلکتور دسته بندی در ویرایش محتوا
 articleTag.LinkCategoryTagIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryTagId',
        url: 'articleCategoryTag',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: articleTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' }
            ]
        }
    }

    //article Grid Options
    articleTag.gridOptions = {
        columns: [
            { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: "ActionKey", displayName: "لیست مطالب", displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="articleTag.OpenContentTag(x.Id,x.Title)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }

    //Comment Grid Options
    articleTag.gridContentOptions = {
        columns: [
           { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
           { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
           { name: 'Writer', displayName: 'نویسنده', sortable: true, type: 'string' },
           { name: 'Comment', displayName: 'کامنت', sortable: true, type: 'string' },
           { name: 'ActionButtons', displayName: 'کلید عملیاتی', template: '<Button ng-if="!x.IsActivated" ng-click="articleTag.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button><Button ng-if="x.IsActivated" ng-click="articleTag.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button><Button ng-click="articleTag.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>' },
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
                Filters: []
            }
        }
    }


    //For Show Category Loading Indicator
    articleTag.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show article Loading Indicator
    articleTag.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    articleTag.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    articleTag.OpenContentTag = function (LinkTagContentId,TitleTag) {
                $state.go("index.articlecontent", {
            ContentId: LinkTagContentId,
            TitleTag:TitleTag
        });
    }
    articleTag.treeConfig.currentNode = {};
    articleTag.treeBusyIndicator = false;
    articleTag.addRequested = false;
    articleTag.showGridComment = false;
    articleTag.articleTitle = "";

    //init Function
    articleTag.init = function () {
        articleTag.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"articleCategorytag/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            articleTag.treeConfig.Items = response.ListItems;
            articleTag.treeConfig.Items = response.ListItems;
            articleTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"articletag/getall", articleTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            articleTag.ListItems = response.ListItems;
            articleTag.gridOptions.fillData(articleTag.ListItems, response.resultAccess); // Sending Access as an argument
            articleTag.contentBusyIndicator.isActive = false;
            articleTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            articleTag.gridOptions.totalRowCount = response.TotalRowCount;
            articleTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            articleTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            articleTag.contentBusyIndicator.isActive = false;
        });

    };


    articleTag.gridContentOptions.onRowSelected = function () { }

    // Open Add Category Modal 
    articleTag.addNewCategoryModel = function () {
        articleTag.addRequested = false;
        ajax.call(cmsServerConfig.configApiServerPath+'articleCategorytag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            articleTag.selectedItem = response.Item;
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
                articleTag.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(articleTag.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/Modulearticle/articleCategorytag/add.html',
                        scope: $scope
                    });
                    articleTag.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    buttonIsPressed = false;
    // Open Edit Category Modal
    articleTag.openEditCategoryModel = function () {
        if (buttonIsPressed) return;
        articleTag.addRequested = false;
        articleTag.modalTitle = 'ویرایش';
        if (!articleTag.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        articleTag.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'articleCategorytag/GetOne', articleTag.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            articleTag.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            articleTag.selectedItem = response.Item;
            //Set dataForTheTree
            articleTag.selectedNode = [];
            articleTag.expandedNodes = [];
            articleTag.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                articleTag.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryTagId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(articleTag.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (articleTag.selectedItem.LinkMainImageId > 0)
                        articleTag.onSelection({ Id: articleTag.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/Modulearticle/articleCategorytag/edit.html',
                        scope: $scope
                    });
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Category
    articleTag.addNewCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        articleTag.categoryBusyIndicator.isActive = true;
        articleTag.addRequested = true;
        articleTag.selectedItem.LinkParentId = null;
        if (articleTag.treeConfig.currentNode != null)
            articleTag.selectedItem.LinkParentId = articleTag.treeConfig.currentNode.Id;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'articleCategorytag/add', articleTag.selectedItem, 'POST').success(function (response) {
            buttonIsPressed = false;
            articleTag.addRequested = false;
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                articleTag.gridOptions.advancedSearchData.engine.Filters = null;
                articleTag.gridOptions.advancedSearchData.engine.Filters = [];
                articleTag.gridOptions.reGetAll();
                articleTag.closeModal();
            }
            articleTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleTag.addRequested = false;
            articleTag.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category
    articleTag.editCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        articleTag.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'articleCategorytag/edit', articleTag.selectedItem, 'PUT').success(function (response) {
            articleTag.addRequested = true;
            //articleTag.showbusy = false;
            articleTag.treeConfig.showbusy = false;
            articleTag.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                articleTag.addRequested = false;
                articleTag.treeConfig.currentNode.Title = response.Item.Title;
                articleTag.closeModal();
            }
            articleTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleTag.addRequested = false;
            articleTag.categoryBusyIndicator.isActive = false;
        });
    }

    // Delete a Category
    articleTag.deleteCategory = function () {
        if (buttonIsPressed) return;
        var node = articleTag.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                articleTag.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'articleCategorytag/GetOne', node.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    articleTag.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'articleCategorytag/delete', articleTag.selectedItemForDelete, 'POST').success(function (res) {
                        articleTag.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            articleTag.gridOptions.advancedSearchData.engine.Filters = null;
                            articleTag.gridOptions.advancedSearchData.engine.Filters = [];
                            articleTag.gridOptions.fillData();
                            articleTag.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        articleTag.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    articleTag.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    articleTag.treeConfig.onNodeSelect = function () {
        var node = articleTag.treeConfig.currentNode;
        articleTag.showGridComment = false;
        articleTag.CategoryTagId = node.Id;
        articleTag.selectContent(node);
    };

    //Show Content with Category Id
    articleTag.selectContent = function (node) {
        articleTag.gridOptions.advancedSearchData.engine.Filters = null;
        articleTag.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            articleTag.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            articleTag.contentBusyIndicator.isActive = true;

            articleTag.attachedFiles = null;
            articleTag.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryTagId",
                IntValue1: node.Id,
                SearchType: 0
            }
            articleTag.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"articletag/getall", articleTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            articleTag.contentBusyIndicator.isActive = false;
            articleTag.ListItems = response.ListItems;
            articleTag.gridOptions.fillData(articleTag.ListItems, response.resultAccess); // Sending Access as an argument
            articleTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            articleTag.gridOptions.totalRowCount = response.TotalRowCount;
            articleTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            articleTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Open Add New Content Model
    articleTag.openAddModel = function () {
        articleTag.addRequested = false;
        articleTag.modalTitle = 'اضافه کردن محتوای جدید';
        ajax.call(cmsServerConfig.configApiServerPath+'articletag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            articleTag.selectedItem = response.Item;
            articleTag.selectedItem.LinkCategoryTagId = articleTag.CategoryTagId;
            //articleTag.clearPreviousData();
            $modal.open({
                templateUrl: 'cpanelv1/Modulearticle/articletag/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    articleTag.openEditModel = function () {
        if (buttonIsPressed) return;
        articleTag.addRequested = false;
        articleTag.modalTitle = 'ویرایش';
        if (!articleTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'articletag/GetOne', articleTag.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            articleTag.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulearticle/articletag/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    articleTag.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        articleTag.categoryBusyIndicator.isActive = true;
        articleTag.addRequested = true;


        ajax.call(cmsServerConfig.configApiServerPath+'articletag/add', articleTag.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            articleTag.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                articleTag.ListItems.unshift(response.Item);
                articleTag.gridOptions.fillData(articleTag.ListItems);
                articleTag.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleTag.addRequested = false;
            articleTag.categoryBusyIndicator.isActive = false;
        });
    }

    //Edit Content
    articleTag.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        articleTag.categoryBusyIndicator.isActive = true;
        articleTag.addRequested = true;


        ajax.call(cmsServerConfig.configApiServerPath+'articletag/edit', articleTag.selectedItem, 'PUT').success(function (response) {
            articleTag.categoryBusyIndicator.isActive = false;
            articleTag.addRequested = false;
            articleTag.treeConfig.showbusy = false;
            articleTag.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                articleTag.replaceItem(articleTag.selectedItem.Id, response.Item);
                articleTag.gridOptions.fillData(articleTag.ListItems);
                articleTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleTag.addRequested = false;
            articleTag.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a article Content 
    articleTag.deleteContent = function () {
        if (!articleTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        articleTag.treeConfig.showbusy = true;
        articleTag.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                articleTag.categoryBusyIndicator.isActive = true;
                console.log(articleTag.gridOptions.selectedRow.item);
                articleTag.showbusy = true;
                articleTag.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+"articletag/GetOne", articleTag.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    articleTag.showbusy = false;
                    articleTag.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    articleTag.selectedItemForDelete = response.Item;
                    console.log(articleTag.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"articletag/delete", articleTag.selectedItemForDelete, 'POST').success(function (res) {
                        articleTag.categoryBusyIndicator.isActive = false;
                        articleTag.treeConfig.showbusy = false;
                        articleTag.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            articleTag.replaceItem(articleTag.selectedItemForDelete.Id);
                            articleTag.gridOptions.fillData(articleTag.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        articleTag.treeConfig.showbusy = false;
                        articleTag.showIsBusy = false;
                        articleTag.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    articleTag.treeConfig.showbusy = false;
                    articleTag.showIsBusy = false;
                    articleTag.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }
  //#help similar & otherinfo
    articleTag.clearPreviousData = function() {
      articleTag.selectedItem.Similars = [];
      $("#to").empty();
    };
    

    articleTag.moveSelected = function(from, to, calculatePrice) {
      if (from == "Content") {
        if (
          articleTag.selectedItem.LinkDestinationId != undefined &&
          articleTag.selectedItem.LinkDestinationId != null
        ) {
          if (articleTag.selectedItem.Similars == undefined)
            articleTag.selectedItem.Similars = [];
          for (var i = 0; i < articleTag.selectedItem.Similars.length; i++) {
            if (
              articleTag.selectedItem.Similars[i].LinkDestinationId ==
              articleTag.selectedItem.LinkDestinationId
            ) {
              rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
              return;
            }
          }
          articleTag.selectedItem.Similars.push({
            LinkDestinationId: articleTag.selectedItem.LinkDestinationId,
            Destination: articleTag.LinkDestinationIdSelector.selectedItem
          });
        }
      }
    };
     articleTag.moveSelectedOtherInfo = function(from, to,y) {

            
             if (articleTag.selectedItem.OtherInfos == undefined)
                articleTag.selectedItem.OtherInfos = [];
              for (var i = 0; i < articleTag.selectedItem.OtherInfos.length; i++) {
              
                if (articleTag.selectedItem.OtherInfos[i].Title == articleTag.selectedItemOtherInfos.Title && articleTag.selectedItem.OtherInfos[i].HtmlBody ==articleTag.selectedItemOtherInfos.HtmlBody && articleTag.selectedItem.OtherInfos[i].Source ==articleTag.selectedItemOtherInfos.Source) 
                {
                  rashaErManage.showMessage($filter('translatentk')('Information_Is_Duplicate'));
                  return;
                }
             
              }
             if (articleTag.selectedItemOtherInfos.Title == "" && articleTag.selectedItemOtherInfos.Source =="" && articleTag.selectedItemOtherInfos.HtmlBody =="")
                {
                    rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
                }
             else
               {
            
             articleTag.selectedItem.OtherInfos.push({
                Title:articleTag.selectedItemOtherInfos.Title,
                HtmlBody:articleTag.selectedItemOtherInfos.HtmlBody,
                Source:articleTag.selectedItemOtherInfos.Source
              });
              articleTag.selectedItemOtherInfos.Title="";
              articleTag.selectedItemOtherInfos.Source="";
              articleTag.selectedItemOtherInfos.HtmlBody="";
             }
             if(edititem)
               { 
                   edititem=false; 
               }
              
        };

    articleTag.removeFromCollection = function(listsimilar,iddestination) {
      for (var i = 0; i < articleTag.selectedItem.Similars.length; i++) 
       {       
            if(listsimilar[i].LinkDestinationId==iddestination)
            {
                articleTag.selectedItem.Similars.splice(i, 1);
                return;
            }
          
      }
      
    };
   articleTag.removeFromOtherInfo = function(listOtherInfo,title,body,source) {
    for (var i = 0; i < articleTag.selectedItem.OtherInfos.length; i++) 
       {       
            if(listOtherInfo[i].Title==title && listOtherInfo[i].HtmlBody==body && listOtherInfo[i].Source==source)
            {
              articleTag.selectedItem.OtherInfos.splice(i, 1);
              return;
            }
       }
    };
   articleTag.editOtherInfo = function(y) {
      edititem=true;
      articleTag.selectedItemOtherInfos.Title=y.Title;
      articleTag.selectedItemOtherInfos.HtmlBody=y.HtmlBody;
      articleTag.selectedItemOtherInfos.Source=y.Source;
      articleTag.removeFromOtherInfo(articleTag.selectedItem.OtherInfos,y.Title,y.HtmlBody,y.Source);
    };


 

    //Replace Item OnDelete/OnEdit Grid Options
    articleTag.replaceItem = function (oldId, newItem) {
        angular.forEach(articleTag.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = articleTag.ListItems.indexOf(item);
                articleTag.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            articleTag.ListItems.unshift(newItem);
    }

  
    articleTag.searchData = function () {
        articleTag.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"articletsg/getall", articleTag.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            articleTag.contentBusyIndicator.isActive = false;
            articleTag.ListItems = response.ListItems;
            articleTag.gridOptions.fillData(articleTag.ListItems);
            articleTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            articleTag.gridOptions.totalRowCount = response.TotalRowCount;
            articleTag.gridOptions.rowPerPage = response.RowPerPage;
            articleTag.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            articleTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    articleTag.addRequested = false;
    articleTag.closeModal = function () {
        $modalStack.dismissAll();
    };

    articleTag.showIsBusy = false;

  

    //For reInit Categories
    articleTag.gridOptions.reGetAll = function () {
        articleTag.init();
    };

    articleTag.isCurrentNodeEmpty = function () {
        return !angular.equals({}, articleTag.treeConfig.currentNode);
    }

    articleTag.loadFileAndFolder = function (item) {
        articleTag.treeConfig.currentNode = item;
        console.log(item);
        articleTag.treeConfig.onNodeSelect(item);
    }

    articleTag.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    articleTag.columnCheckbox = false;
    articleTag.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = articleTag.gridOptions.columns;
        if (articleTag.gridOptions.columnCheckbox) {
            for (var i = 0; i < articleTag.gridOptions.columns.length; i++) {
                //articleTag.gridOptions.columns[i].visible = $("#" + articleTag.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + articleTag.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                articleTag.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < articleTag.gridOptions.columns.length; i++) {
                var element = $("#" + articleTag.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + articleTag.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < articleTag.gridOptions.columns.length; i++) {
            console.log(articleTag.gridOptions.columns[i].name.concat(".visible: "), articleTag.gridOptions.columns[i].visible);
        }
        articleTag.gridOptions.columnCheckbox = !articleTag.gridOptions.columnCheckbox;
    }

    articleTag.deleteAttachedFile = function (index) {
        articleTag.attachedFiles.splice(index, 1);
    }

    articleTag.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !articleTag.alreadyExist(id, articleTag.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = {
                id: fId, name: fname
            };
            articleTag.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    articleTag.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    articleTag.filePickerMainImage.removeSelectedfile = function (config) {
        articleTag.filePickerMainImage.fileId = null;
        articleTag.filePickerMainImage.filename = null;
        articleTag.selectedItem.LinkMainImageId = null;

    }

    articleTag.filePickerFiles.removeSelectedfile = function (config) {
        articleTag.filePickerFiles.fileId = null;
        articleTag.filePickerFiles.filename = null;
        articleTag.selectedItem.LinkFileIds = null;
    }


    articleTag.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }

    // ----------- FilePicker Codes --------------------------------
    articleTag.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !articleTag.alreadyExist(id, articleTag.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            articleTag.attachedFiles.push(file);
            articleTag.clearfilePickers();
        }
    }

    articleTag.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                articleTag.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    articleTag.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;   //String is empty or whitespace then return
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            articleTag.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    articleTag.clearfilePickers = function () {
        articleTag.filePickerFiles.fileId = null;
        articleTag.filePickerFiles.filename = null;
    }

    articleTag.stringfyLinkFileIds = function () {
        $.each(articleTag.attachedFiles, function (i, item) {
            if (articleTag.selectedItem.LinkFileIds == "")
                articleTag.selectedItem.LinkFileIds = item.fileId;
            else
                articleTag.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    articleTag.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/Modulearticle/articleContent/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        articleTag.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            articleTag.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    articleTag.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    articleTag.whatcolor = function (progress) {
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

    articleTag.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    articleTag.replaceFile = function (name) {
        articleTag.itemClicked(null, articleTag.fileIdToDelete, "file");
        articleTag.fileTypes = 1;
        articleTag.fileIdToDelete = articleTag.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", articleTag.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    articleTag.remove(articleTag.FileList, articleTag.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                articleTag.FileItem = response3.Item;
                                articleTag.FileItem.FileName = name;
                                articleTag.FileItem.Extension = name.split('.').pop();
                                articleTag.FileItem.FileSrc = name;
                                articleTag.FileItem.LinkCategoryId = articleTag.thisCategory;
                                articleTag.saveNewFile();
                            }
                            else {
                                console.log("getting the model was not successfully returned!");
                            }
                        }).error(function (data) {
                            console.log(data);
                        });
                    }
                    else {
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
    articleTag.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", articleTag.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                articleTag.FileItem = response.Item;
                articleTag.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            articleTag.showErrorIcon();
            return -1;
        });
    }

    articleTag.showSuccessIcon = function () {
    }

    articleTag.showErrorIcon = function () {

    }
    //file is exist
    articleTag.fileIsExist = function (fileName) {
        for (var i = 0; i < articleTag.FileList.length; i++) {
            if (articleTag.FileList[i].FileName == fileName) {
                articleTag.fileIdToDelete = articleTag.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    articleTag.getFileItem = function (id) {
        for (var i = 0; i < articleTag.FileList.length; i++) {
            if (articleTag.FileList[i].Id == id) {
                return articleTag.FileList[i];
            }
        }
    }

    //select file or folder
    articleTag.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            articleTag.fileTypes = 1;
            articleTag.selectedFileId = articleTag.getFileItem(index).Id;
            articleTag.selectedFileName = articleTag.getFileItem(index).FileName;
        }
        else {
            articleTag.fileTypes = 2;
            articleTag.selectedCategoryId = articleTag.getCategoryName(index).Id;
            articleTag.selectedCategoryTitle = articleTag.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        articleTag.selectedIndex = index;

    };

    //upload file
    articleTag.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (articleTag.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ articleTag.replaceFile(uploadFile.name);
                    articleTag.itemClicked(null, articleTag.fileIdToDelete, "file");
                    articleTag.fileTypes = 1;
                    articleTag.fileIdToDelete = articleTag.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                articleTag.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        articleTag.FileItem = response2.Item;
                        articleTag.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        articleTag.filePickerMainImage.filename =
                          articleTag.FileItem.FileName;
                        articleTag.filePickerMainImage.fileId =
                          response2.Item.Id;
                        articleTag.selectedItem.LinkMainImageId =
                          articleTag.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      articleTag.showErrorIcon();
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
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response) {
                    articleTag.FileItem = response.Item;
                    articleTag.FileItem.FileName = uploadFile.name;
                    articleTag.FileItem.uploadName = uploadFile.uploadName;
                    articleTag.FileItem.Extension = uploadFile.name.split('.').pop();
                    articleTag.FileItem.FileSrc = uploadFile.name;
                    articleTag.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- articleTag.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", articleTag.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            articleTag.FileItem = response.Item;
                            articleTag.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            articleTag.filePickerMainImage.filename = articleTag.FileItem.FileName;
                            articleTag.filePickerMainImage.fileId = response.Item.Id;
                            articleTag.selectedItem.LinkMainImageId = articleTag.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        articleTag.showErrorIcon();
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
    articleTag.exportFile = function () {
        articleTag.gridOptions.advancedSearchData.engine.ExportFile = articleTag.ExportFileClass;
        articleTag.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'articletag/exportfile', articleTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            articleTag.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                articleTag.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //articleTag.closeModal();
            }
            articleTag.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    articleTag.toggleExportForm = function () {
        articleTag.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        articleTag.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        articleTag.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        articleTag.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        articleTag.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/Modulearticle/articletag/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    articleTag.rowCountChanged = function () {
        if (!angular.isDefined(articleTag.ExportFileClass.RowCount) || articleTag.ExportFileClass.RowCount > 5000)
            articleTag.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    articleTag.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"articletag/count", articleTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            articleTag.addRequested = false;
            rashaErManage.checkAction(response);
            articleTag.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            articleTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    //TreeControl
    articleTag.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (articleTag.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    articleTag.onNodeToggle = function (node, expanded) {
        if (expanded) {
            node.Children = [];
            var filterModel = { Filters: [] };
            var originalName = node.Title;
            node.messageText = " در حال بارگذاری...";
            filterModel.Filters.push({ PropertyName: "LinkParentId", SearchType: 0, IntValue1: node.Id });
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

    articleTag.onSelection = function (node, selected) {
        if (!selected) {
            articleTag.selectedItem.LinkMainImageId = null;
            articleTag.selectedItem.previewImageSrc = null;
            return;
        }
        articleTag.selectedItem.LinkMainImageId = node.Id;
        articleTag.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            articleTag.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);