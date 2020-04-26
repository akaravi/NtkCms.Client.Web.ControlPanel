app.controller("chartContentCtrl",
 ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window','$stateParams', '$filter',
  function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window,$stateParams, $filter) {
    var chartContent = this;
    chartContent.RouteUploadFileContent = cmsServerConfig.configRouteUploadFileContent;
  var edititem = false;
    //For Grid Options
    chartContent.gridOptions = {};
    chartContent.selectedItem = {};
    chartContent.attachedFiles = [];
    chartContent.attachedFile = "";
    chartContent.selectedContentId = { Id: $stateParams.ContentId ,TitleTag:$stateParams.TitleTag };
    chartContent.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }


    

    chartContent.filePickerFilePodcast = {
        isActive: true,
        backElement: 'filePickerFilePodcast',
        filename: null,
        fileId: null,
        extension:'mp3',
        multiSelect: false,
    }
    chartContent.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    chartContent.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:chartContent.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:chartContent,
        useCurrentLocationZoom:12,
    }

    chartContent.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) chartContent.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    chartContent.selectedItem.ToDate = date;
    // chartContent.datePickerConfig = {
    //     defaultDate: date
    // };
    // chartContent.FromDate = {
    //     defaultDate: date
    // }
    // chartContent.ExpireDate = {
    //     defaultDate: date
    // }
    chartContent.count = 0;

//#help/ سلکتور similar
    chartContent.LinkDestinationIdSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkDestinationId",
      url: "ChartContent",
      sortColumn: "Id",
      sortType: 0,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: chartContent,
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
 chartContent.LinkCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryId',
        url: 'chartCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: chartContent,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' }
            ]
        }
    }
    chartContent.LinkLocationIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkLocationId',
        url: 'CmsLocation',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'LinkLocationId',
        rowPerPage: 200,
        action: 'GetAllCities',
        scope: chartContent,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },

                { name: 'virtual_Parent.Title', displayName: 'Title', sortable: true, type: 'string', visible: true },

                { name: 'Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
            ]
        }
    }
    //Chart Grid Options
    chartContent.gridOptions = {
        columns: [
            { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Description', displayName: 'عنوان توضیحات', sortable: true, type: 'string', visible: 'true' },
            { name: "ActionKey", displayName: 'افزودن به منو', displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="chartContent.addMenu()"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }
    //Comment Grid Options
    chartContent.gridContentOptions = {
        columns: [
           { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
           { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
           { name: 'Writer', displayName: 'نویسنده', sortable: true, type: 'string' },
           { name: 'Comment', displayName: 'کامنت', sortable: true, type: 'string' },
           { name: 'ActionButtons', displayName: 'کلید عملیاتی', template: '<Button ng-if="!x.IsActivated" ng-click="chartContent.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button>' + '<Button ng-if="x.IsActivated" ng-click="chartContent.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button>' + '<Button ng-click="chartContent.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>' },
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
                Filters: [],
                Count: false
            }
        }
    }
    //Event Grid Options
    chartContent.gridContentEventOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkChartContentId', displayName: 'کد سیستمی چارت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
            { name: 'Description', displayName: 'Description', sortable: true, type: 'string', visible: true },
            { name: 'StartDateTime', displayName: 'StartDateTime', sortable: true, sortable: true, type: 'date', visible: true },
            { name: 'EndDateTime', displayName: 'EndDateTime', sortable: true, sortable: true, type: 'date', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'ActionButtons', displayName: 'کلید عملیاتی', template: '<Button ng-if="!x.IsActivated" ng-click="chartContent.confirmEvent(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button>' + '<Button ng-if="x.IsActivated" ng-click="chartContent.doNotConfirmEvent(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button>' + '<Button ng-click="chartContent.deleteEvent(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>' },
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
                Filters: [],
                Count: false
            }
        }
    }
    chartContent.gridOptions.advancedSearchData.engine.Filters = null;
    chartContent.gridOptions.advancedSearchData.engine.Filters = [];
    //#tagsInput -----
    //chartContent.onTagAdded = function (tag) {
    //    if (!angular.isDefined(tag.id)) {    //Check if this a new or a existing tag (existing tags comprise with an id)
    //        var tagObject = jQuery.extend({}, chartContent.ModuleTag);   //#Clone a Javascript Object
    //        tagObject.Title = tag.text;
    //        ajax.call('/api/chartTag/add', tagObject, 'POST').success(function (response) {
    //            rashaErManage.checkAction(response);
    //            if (response.IsSuccess) {
    //                chartContent.tags[chartContent.tags.length - 1] = { id: response.Item.Id, text: response.Item.Title };  //Replace the newly added tag (last in the array) with a new object including its Id
    //            }
    //        }).error(function (data, errCode, c, d) {
    //            rashaErManage.checkAction(data, errCode);
    //        });
    //    }
    //}
    chartContent.onTagRemoved = function (tag) { }
    //For Show Category Loading Indicator
    chartContent.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show Chart Loading Indicator
    chartContent.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    chartContent.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    }

    //open addMenu modal
    chartContent.addMenu = function () {
        $modal.open({
            templateUrl: "cpanelv1/ModuleChart/ChartContent/modalMenu.html",
            scope: $scope
        });
    }

    chartContent.treeConfig.currentNode = {};
    chartContent.treeBusyIndicator = false;

    chartContent.addRequested = false;

    chartContent.showGridComment = false;
    chartContent.showGridEvent = false;
    chartContent.chartTitle = "";

    //init Function
    chartContent.init = function () {
        chartContent.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ChartCategory/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            chartContent.categoryBusyIndicator.isActive = false;
            chartContent.treeConfig.Items = response.ListItems;
        }).error(function (data, errCode, c, d) {
            chartContent.categoryBusyIndicator.isActive = false;
        });
        filterModel = { PropertyName: "ContentTags",PropertyAnyName:"LinkTagId", SearchType: 0, IntValue1: chartContent.selectedContentId.Id };
        if (chartContent.selectedContentId.Id >0)
            chartContent.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
        chartContent.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"chartContent/getall", chartContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            chartContent.ListItems = response.ListItems;
            console.log(response.ListItems);
            chartContent.gridOptions.fillData(chartContent.ListItems, response.resultAccess); // Sending Access as an argument
            chartContent.contentBusyIndicator.isActive = false;
            chartContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            chartContent.gridOptions.totalRowCount = response.TotalRowCount;
            chartContent.gridOptions.rowPerPage = response.RowPerPage; chartContent.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            chartContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            chartContent.contentBusyIndicator.isActive = false;
        });
        ajax.call(cmsServerConfig.configApiServerPath+"chartTag/GetViewModel", "", 'GET').success(function (response) {    //Get a ViewModel for BiographyTag
            chartContent.ModuleTag = response.Item;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"chartContentTag/GetViewModel", "", 'GET').success(function (response) { //Get a ViewModel for chartContentTag
            chartContent.ModuleContentTag = response.Item;
        }).error(function (data, errCode, c, d) {
            console.log(data);
            });
        ajax.call(cmsServerConfig.configApiServerPath+"CoreLocation/GetAllProvinces", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            chartContent.provinceCmsLocatinoListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            chartContent.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    };

    // For Show Comments
    chartContent.showComment = function () {
        if (chartContent.gridOptions.selectedRow.item) {
            //var id = chartContent.gridOptions.selectedRow.item.Id;
            var Filter_value1 = {
                PropertyName: "LinkContentId",
                IntValue1: chartContent.gridOptions.selectedRow.item.Id,
                SearchType: 0
            }
            var engine = chartContent.gridContentOptions.advancedSearchData.engine;
            chartContent.gridContentOptions.advancedSearchData.engine.Filters = null;
            chartContent.gridContentOptions.advancedSearchData.engine.Filters = [];
            chartContent.gridContentOptions.advancedSearchData.engine.Filters.push(Filter_value1);


            ajax.call(cmsServerConfig.configApiServerPath+'chartComment/getall', engine, 'POST').success(function (response) {
                chartContent.listComments = response.ListItems;
                //chartContent.gridOptions.resultAccess = response.resultAccess; // دسترسی ها نمایش
                chartContent.gridContentOptions.fillData(chartContent.listComments, response.resultAccess);
                chartContent.gridContentOptions.currentPageNumber = response.CurrentPageNumber;
                chartContent.gridContentOptions.totalRowCount = response.TotalRowCount;
                chartContent.allowedSearch = response.AllowedSearchField;
                rashaErManage.checkAction(response);
                chartContent.gridContentOptions.rowPerPage = response.RowPerPage;
                chartContent.gridOptions.maxSize = 5;
                chartContent.showGridComment = true;
                chartContent.Title = chartContent.gridOptions.selectedRow.item.Title;
            });
        }
    }

    chartContent.gridOptions.onRowSelected = function () {
        var item = chartContent.gridOptions.selectedRow.item;
        chartContent.showComment(item);
    }

    chartContent.gridContentOptions.onRowSelected = function () { }
    // For Show Events
    chartContent.showEvent = function () {
        if (chartContent.gridOptions.selectedRow.item) {
            //var id = chartContent.gridOptions.selectedRow.item.Id;
            var Filter_value = {
                PropertyName: "LinkchartContentId",
                IntValue1: chartContent.gridOptions.selectedRow.item.Id,
                SearchType: 0
            }
            var engine2 = chartContent.gridContentOptions.advancedSearchData.engine;
            engine2.Filters = null;
            engine2.Filters = [];
            engine2.Filters.push(Filter_value);


            ajax.call(cmsServerConfig.configApiServerPath+'chartcontentevent/getall', engine2, 'POST').success(function (response) {
                chartContent.listEvents = response.ListItems;
                //chartContent.gridOptions.resultAccess = response.resultAccess; // دسترسی ها نمایش
                chartContent.gridContentEventOptions.fillData(chartContent.listEvents, response.resultAccess);
                chartContent.gridContentEventOptions.currentPageNumber = response.CurrentPageNumber;
                chartContent.gridContentEventOptions.totalRowCount = response.TotalRowCount;
                chartContent.allowedSearch = response.AllowedSearchField;
                rashaErManage.checkAction(response);
                chartContent.gridContentEventOptions.rowPerPage = response.RowPerPage;
                chartContent.gridOptions.maxSize = 5;
                chartContent.showGridEvent = true;
                chartContent.Title = chartContent.gridOptions.selectedRow.item.Title;
            });
        }
    }

    chartContent.gridOptions.onRowSelected = function () {
        var item = chartContent.gridOptions.selectedRow.item;
        chartContent.showEvent(item);
    }

    chartContent.gridContentEventOptions.onRowSelected = function () { }
    // Open Add Category Modal 
    chartContent.addNewCategoryModel = function () {
        chartContent.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ChartCategory/GetViewModel', "", 'GET').success(function (response) {
            chartContent.addRequested = false;
            rashaErManage.checkAction(response);
            chartContent.selectedItem = response.Item;
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
                chartContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(chartContent.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleChart/ChartCategory/add.html',
                        scope: $scope
                    });
                    chartContent.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //-----
            //$modal.open({
            //    templateUrl: 'cpanelv1/ModuleChart/ChartCategory/add.html',
            //    scope: $scope
            //});

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Open Edit Category Modal
    chartContent.editCategoryModel = function () {
        chartContent.modalTitle = 'ویرایش';
        if (!chartContent.treeConfig.currentNode || chartContent.treeConfig.currentNode.Id <= 0 || chartContent.treeConfig.currentNode.Id == undefined) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }
        chartContent.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ChartCategory/GetOne', chartContent.treeConfig.currentNode.Id, 'GET').success(function (response) {
            chartContent.addRequested = false;
            rashaErManage.checkAction(response);
            chartContent.selectedItem = response.Item;
            
            //Set dataForTheTree
            chartContent.selectedNode = [];
            chartContent.expandedNodes = [];
            chartContent.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                chartContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(chartContent.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (chartContent.selectedItem.LinkMainImageId > 0)
                        chartContent.onSelection({ Id: chartContent.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleChart/ChartCategory/edit.html',
                        scope: $scope
                    });
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //---
            //$modal.open({
            //    templateUrl: 'cpanelv1/ModuleChart/ChartCategory/edit.html',
            //    scope: $scope
            //});
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Category
    chartContent.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        chartContent.contentBusyIndicator.isActive = true;
        chartContent.addRequested = true;
        chartContent.selectedItem.LinkParentId = null;
        if (chartContent.treeConfig.currentNode != null)
            chartContent.selectedItem.LinkParentId = chartContent.treeConfig.currentNode.Id;
        chartContent.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'chartcategory/add', chartContent.selectedItem, 'POST').success(function (response) {
            chartContent.addRequested = false;
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                chartContent.gridOptions.advancedSearchData.engine.Filters = null;
                chartContent.gridOptions.advancedSearchData.engine.Filters = [];
                chartContent.gridOptions.reGetAll();
                chartContent.closeModal();
            }
            chartContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            chartContent.addRequested = false;
            chartContent.contentBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    chartContent.editCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        chartContent.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ChartCategory/edit', chartContent.selectedItem, 'PUT').success(function (response) {
            chartContent.addRequested = true;
            //chartContent.showbusy = false;
            chartContent.treeConfig.showbusy = false;
            chartContent.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                chartContent.addRequested = false;
                chartContent.treeConfig.currentNode.Title = response.Item.Title;
                chartContent.closeModal();
            }
            chartContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            chartContent.addRequested = false;
            chartContent.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    chartContent.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = chartContent.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                chartContent.contentBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'chartcategory/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    chartContent.selectedItemForDelete = response.Item;
                    console.log(chartContent.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'chartcategory/delete', chartContent.selectedItemForDelete, 'POST').success(function (res) {
                        chartContent.contentBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //chartContent.replaceCategoryItem(chartContent.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            chartContent.gridOptions.advancedSearchData.engine.Filters = null;
                            chartContent.gridOptions.advancedSearchData.engine.Filters = [];
                            chartContent.gridOptions.fillData();
                            chartContent.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        chartContent.contentBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    chartContent.contentBusyIndicator.isActive = false;
                });
            }
        });
    }

   
    //#help//

    //Tree On Node Select Options
    chartContent.treeConfig.onNodeSelect = function () {
        var node = chartContent.treeConfig.currentNode;
        chartContent.showGridComment = false;
        chartContent.showGridEvent = false;
        chartContent.selectContent(node);
    }
    //Show Content with Category Id
    chartContent.selectContent = function (node) {
        chartContent.gridOptions.advancedSearchData.engine.Filters = null;
        chartContent.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            chartContent.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            chartContent.contentBusyIndicator.isActive = true;
            //chartContent.gridOptions.advancedSearchData = {};
            
            chartContent.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryId",
                IntValue1: node.Id,
                SearchType: 0
            }
            chartContent.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"chartcontent/getall", chartContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            chartContent.contentBusyIndicator.isActive = false;
            chartContent.ListItems = response.ListItems;
            chartContent.gridOptions.fillData(chartContent.ListItems, response.resultAccess); // Sending Access as an argument
            chartContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            chartContent.gridOptions.totalRowCount = response.TotalRowCount;
            chartContent.gridOptions.rowPerPage = response.RowPerPage;
            chartContent.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            chartContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    //open statistics
    chartContent.Showstatistics = function () {
        if (!chartContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'chartcontent/GetOne', chartContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            chartContent.selectedItem = response1.Item;
            $modal.open({
                templateUrl: "cpanelv1/ModuleChart/ChartContent/statistics.html",
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add New Content Model
    chartContent.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = chartContent.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Chart_Please_Select_The_Category'));
            return;
        }
        chartContent.attachedFiles = [];
        chartContent.attachedFile = "";
        chartContent.filePickerMainImage.filename = "";
        chartContent.filePickerMainImage.fileId = null;
        chartContent.filePickerFilePodcast.filename = "";
        chartContent.filePickerFilePodcast.fileId = null;
        chartContent.filePickerFiles.filename = "";
        chartContent.filePickerFiles.fileId = null;
        chartContent.tags = [];   //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
        chartContent.kwords = [];   //tagsInput خالی کردن آرایه کلمات کلیدی برای محتوای جدید
        chartContent.addRequested = false;
        chartContent.modalTitle = 'اضافه کردن محتوای جدید';
        addNewContentModel = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'chartcontent/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            addNewContentModel = false;
            console.log(response);
            rashaErManage.checkAction(response);
            chartContent.selectedItem = response.Item;
            chartContent.selectedItem.OtherInfos = [];
            chartContent.selectedItem.Similars = [];
            chartContent.selectedItem.LinkCategoryId = node.Id;
            chartContent.selectedItem.LinkFileIds = null;
            chartContent.clearPreviousData();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleChart/ChartContent/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    chartContent.openEditModel = function () {
        if (buttonIsPressed) { return };
        chartContent.attachedFiles = [];
        chartContent.addRequested = false;
        chartContent.modalTitle = 'ویرایش';
        if (!chartContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'chartContent/GetOne', chartContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            chartContent.selectedItem = response1.Item;
            //#help// Set Province City Location
            //chartContent.onProvinceChange(chartContent.selectedItem.LinkProvinceId);
            //chartContent.onCitiesChange(chartContent.selectedItem.LinkLocationId);
            //#help//
            // chartContent.startDate.defaultDate = chartContent.selectedItem.FromDate;
            // chartContent.endDate.defaultDate = chartContent.selectedItem.ToDate;
            chartContent.filePickerMainImage.filename = null;
            chartContent.filePickerMainImage.fileId = null;
            chartContent.filePickerFilePodcast.filename = null;
            chartContent.filePickerFilePodcast.fileId = null;
            if (response1.Item.LinkMainImageId != null) {
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', response1.Item.LinkMainImageId, 'GET').success(function (response2) {
                    buttonIsPressed = false;
                    chartContent.filePickerMainImage.filename = response2.Item.FileName;
                    chartContent.filePickerMainImage.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            if (response1.Item.LinkFilePodcastId != null) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', response1.Item.LinkFilePodcastId, 'GET').success(function (response2) {
                    chartContent.filePickerFilePodcast.filename = response2.Item.FileName;
                    chartContent.filePickerFilePodcast.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            chartContent.parseFileIds(response1.Item.LinkFileIds);
            chartContent.filePickerFiles.filename = null;
            chartContent.filePickerFiles.fileId = null;
            //Load tagsInput
            chartContent.tags = [];  //Clear out previous tags
            if (chartContent.selectedItem.ContentTags == null)
                chartContent.selectedItem.ContentTags = [];
            $.each(chartContent.selectedItem.ContentTags, function (index, item) {
                if (item.ModuleTag != null)
                    chartContent.tags.push({ id: item.ModuleTag.Id, text: item.ModuleTag.Title });  //Add current content's tag to tags array with id and title
            });
            //Load Keywords tagsInput
            chartContent.kwords = [];  //Clear out previous tags
            var arraykwords = [];
            if (chartContent.selectedItem.Keyword != null && chartContent.selectedItem.Keyword != "")
                arraykwords = chartContent.selectedItem.Keyword.split(',');
            $.each(arraykwords, function (index, item) {
                if (item != null)
                    chartContent.kwords.push({ text: item });  //Add current content's tag to tags array with id and title
            });
            $modal.open({
                templateUrl: 'cpanelv1/ModuleChart/chartContent/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    chartContent.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        chartContent.contentBusyIndicator.isActive = true;
        chartContent.addRequested = true;
        //Save attached file ids into chartContent.selectedItem.LinkFileIds
        chartContent.selectedItem.LinkFileIds = "";
        chartContent.stringfyLinkFileIds();
        //Save Keywords
        $.each(chartContent.kwords, function (index, item) {
            if (index == 0)
                chartContent.selectedItem.Keyword = item.text;
            else
                chartContent.selectedItem.Keyword += ',' + item.text;
        });
        if (chartContent.selectedItem.LinkCategoryId == null || chartContent.selectedItem.LinkCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Chart_Please_Select_The_Category'));
            return;
        }
        var apiSelectedItem = chartContent.selectedItem;
        if (apiSelectedItem.Similars)
            $.each(apiSelectedItem.Similars, function (index, item) {
                item.Destination = [];
            });

        ajax.call(cmsServerConfig.configApiServerPath+'chartContent/add', apiSelectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            chartContent.contentBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                chartContent.ListItems.unshift(response.Item);
                chartContent.gridOptions.fillData(chartContent.ListItems);
                chartContent.closeModal();
                //Save inputTags
                chartContent.selectedItem.ContentTags = [];
                $.each(chartContent.tags, function (index, item) {
                    if (item.id > 0) {
                        var newObject = $.extend({}, chartContent.ModuleContentTag);
                        newObject.LinkTagId = item.id;
                        newObject.LinkContentId = response.Item.Id;
                        chartContent.selectedItem.ContentTags.push(newObject);
                    }
                });
                ajax.call(cmsServerConfig.configApiServerPath+'chartContentTag/addbatch', chartContent.selectedItem.ContentTags, 'POST').success(function (response) {
                    console.log(response);
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            chartContent.addRequested = false;
            chartContent.contentBusyIndicator.isActive = false;
        });
    }

    //Edit Content
    chartContent.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        chartContent.contentBusyIndicator.isActive = true;
        chartContent.addRequested = true;

        //Save attached file ids into chartContent.selectedItem.LinkFileIds
        chartContent.selectedItem.LinkFileIds = "";
        chartContent.stringfyLinkFileIds();
        //Save inputTags
        chartContent.selectedItem.ContentTags = [];
        $.each(chartContent.tags, function (index, item) {
            if (item.id > 0) {
                var newObject = $.extend({}, chartContent.ModuleContentTag);
                newObject.LinkTagId = item.id;
                newObject.LinkContentId = chartContent.selectedItem.Id;
                chartContent.selectedItem.ContentTags.push(newObject);
            }
        });
        //Save Keywords
        $.each(chartContent.kwords, function (index, item) {
            if (index == 0)
                chartContent.selectedItem.Keyword = item.text;
            else
                chartContent.selectedItem.Keyword += ',' + item.text;
        });
        if (chartContent.selectedItem.LinkCategoryId == null || chartContent.selectedItem.LinkCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Chart_Please_Select_The_Category'));
            return;
        }
        if (chartContent.selectedItem.LinkCategoryId == null || chartContent.selectedItem.LinkCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Chart_Please_Select_The_Category'));
            return;
        }
        var apiSelectedItem = chartContent.selectedItem;
        if (apiSelectedItem.Similars)
            $.each(apiSelectedItem.Similars, function (index, item) {
                item.Destination = [];
            });

        ajax.call(cmsServerConfig.configApiServerPath+'chartContent/edit', apiSelectedItem, 'PUT').success(function (response) {
            chartContent.contentBusyIndicator.isActive = false;
            chartContent.addRequested = false;
            chartContent.treeConfig.showbusy = false;
            chartContent.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                chartContent.replaceItem(chartContent.selectedItem.Id, response.Item);
                chartContent.gridOptions.fillData(chartContent.ListItems);
                chartContent.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            chartContent.addRequested = false;
            chartContent.contentBusyIndicator.isActive = false;
        });
    }
    // Delete a Chart Content 
    chartContent.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!chartContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        chartContent.treeConfig.showbusy = true;
        chartContent.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                chartContent.contentBusyIndicator.isActive = true;
                console.log(chartContent.gridOptions.selectedRow.item);
                chartContent.showbusy = true;
                chartContent.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"chartContent/GetOne", chartContent.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    chartContent.showbusy = false;
                    chartContent.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    chartContent.selectedItemForDelete = response.Item;
                    console.log(chartContent.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"chartContent/delete", chartContent.selectedItemForDelete, 'POST').success(function (res) {
                        chartContent.contentBusyIndicator.isActive = false;
                        chartContent.treeConfig.showbusy = false;
                        chartContent.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            chartContent.replaceItem(chartContent.selectedItemForDelete.Id);
                            chartContent.gridOptions.fillData(chartContent.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        chartContent.treeConfig.showbusy = false;
                        chartContent.showIsBusy = false;
                        chartContent.contentBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    chartContent.treeConfig.showbusy = false;
                    chartContent.showIsBusy = false;
                    chartContent.contentBusyIndicator.isActive = false;

                });
            }
        });
    }
  //#help similar & otherinfo
    chartContent.clearPreviousData = function() {
      chartContent.selectedItem.Similars = [];
      $("#to").empty();
    };
    

    chartContent.moveSelected = function(from, to, calculatePrice) {
      if (from == "Content") {
        //var title = chartContent.ItemListIdSelector.selectedItem.Title;
        // var optionSelectedPrice = chartContent.ItemListIdSelector.selectedItem.Price;
        if (
          chartContent.selectedItem.LinkDestinationId != undefined &&
          chartContent.selectedItem.LinkDestinationId != null
        ) {
          if (chartContent.selectedItem.Similars == undefined)
            chartContent.selectedItem.Similars = [];
          for (var i = 0; i < chartContent.selectedItem.Similars.length; i++) {
            if (
              chartContent.selectedItem.Similars[i].LinkDestinationId ==
              chartContent.selectedItem.LinkDestinationId
            ) {
              rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
              return;
            }
          }
          // if (chartContent.selectedItem.Title == null || chartContent.selectedItem.Title.length < 0)
          //     chartContent.selectedItem.Title = title;
          chartContent.selectedItem.Similars.push({
            //Id: 0,
            //Source: from,
            LinkDestinationId: chartContent.selectedItem.LinkDestinationId,
            Destination: chartContent.LinkDestinationIdSelector.selectedItem
          });
        }
      }
    };
     chartContent.moveSelectedOtherInfo = function(from, to,y) {

            
             if (chartContent.selectedItem.OtherInfos == undefined)
                chartContent.selectedItem.OtherInfos = [];
              for (var i = 0; i < chartContent.selectedItem.OtherInfos.length; i++) {
              
                if (chartContent.selectedItem.OtherInfos[i].Title == chartContent.selectedItemOtherInfos.Title && chartContent.selectedItem.OtherInfos[i].HtmlBody ==chartContent.selectedItemOtherInfos.HtmlBody && chartContent.selectedItem.OtherInfos[i].Source ==chartContent.selectedItemOtherInfos.Source) 
                {
                  rashaErManage.showMessage($filter('translatentk')('Information_Is_Duplicate'));
                  return;
                }
             
              }
             if (chartContent.selectedItemOtherInfos.Title == "" && chartContent.selectedItemOtherInfos.Source =="" && chartContent.selectedItemOtherInfos.HtmlBody =="")
                {
                    rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
                }
             else
               {
            
             chartContent.selectedItem.OtherInfos.push({
                Title:chartContent.selectedItemOtherInfos.Title,
                HtmlBody:chartContent.selectedItemOtherInfos.HtmlBody,
                Source:chartContent.selectedItemOtherInfos.Source
              });
              chartContent.selectedItemOtherInfos.Title="";
              chartContent.selectedItemOtherInfos.Source="";
              chartContent.selectedItemOtherInfos.HtmlBody="";
             }
             if(edititem)
               { 
                   edititem=false; 
               }
              
        };

    chartContent.removeFromCollection = function(listsimilar,iddestination) {
      for (var i = 0; i < chartContent.selectedItem.Similars.length; i++) 
       {       
            if(listsimilar[i].LinkDestinationId==iddestination)
            {
                chartContent.selectedItem.Similars.splice(i, 1);
                return;
            }
          
      }
      
    };
   chartContent.removeFromOtherInfo = function(listOtherInfo,title,body,source) {
    for (var i = 0; i < chartContent.selectedItem.OtherInfos.length; i++) 
       {       
            if(listOtherInfo[i].Title==title && listOtherInfo[i].HtmlBody==body && listOtherInfo[i].Source==source)
            {
              chartContent.selectedItem.OtherInfos.splice(i, 1);
              return;
            }
       }
    };
   chartContent.editOtherInfo = function(y) {
      edititem=true;
      chartContent.selectedItemOtherInfos.Title=y.Title;
      chartContent.selectedItemOtherInfos.HtmlBody=y.HtmlBody;
      chartContent.selectedItemOtherInfos.Source=y.Source;
      chartContent.removeFromOtherInfo(chartContent.selectedItem.OtherInfos,y.Title,y.HtmlBody,y.Source);
    };


    //#help
    //Confirm/UnConfirm Chart Content
    chartContent.confirmUnConfirmchartContent = function () {
        if (!chartContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'chartContent/GetOne', chartContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            chartContent.selectedItem = response.Item;
            chartContent.selectedItem.IsAccepted = (response.Item.IsAccepted == true) ? false : true;
            ajax.call(cmsServerConfig.configApiServerPath+'chartContent/edit', chartContent.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = chartContent.ListItems.indexOf(chartContent.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        chartContent.ListItems[index] = response2.Item;
                    }
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    //Add To Archive New Content
    chartContent.enableArchive = function () {
        if (!chartContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'chartContent/GetOne', chartContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            chartContent.selectedItem = response.Item;
            chartContent.selectedItem.IsArchive = (response.Item.IsArchive == true) ? false : true;
            ajax.call(cmsServerConfig.configApiServerPath+'chartContent/edit', chartContent.selectedItem, 'PUT').success(function (response2) {
                chartContent.contentBusyIndicator.isActive = true;
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = chartContent.ListItems.indexOf(chartContent.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        chartContent.ListItems[index] = response2.Item;
                    }
                    chartContent.contentBusyIndicator.isActive = false;
                }

            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                chartContent.contentBusyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            chartContent.contentBusyIndicator.isActive = false;
        });
    };

    //Replace Item OnDelete/OnEdit Grid Options
    chartContent.replaceItem = function (oldId, newItem) {
        angular.forEach(chartContent.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = chartContent.ListItems.indexOf(item);
                chartContent.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            chartContent.ListItems.unshift(newItem);
    }

    chartContent.summernoteText = '<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />';
    chartContent.searchData = function () {
        chartContent.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"chartContent/getall", chartContent.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            chartContent.contentBusyIndicator.isActive = false;
            chartContent.ListItems = response.ListItems;
            chartContent.gridOptions.fillData(chartContent.ListItems);
            chartContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            chartContent.gridOptions.totalRowCount = response.TotalRowCount;
            chartContent.gridOptions.rowPerPage = response.RowPerPage;
            chartContent.gridOptions.maxSize = 5;
            chartContent.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            chartContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    chartContent.addRequested = false;
    chartContent.closeModal = function () {
        $modalStack.dismissAll();
    };

    chartContent.showIsBusy = false;

    //Aprove a comment
    chartContent.confirmComment = function (item) {
        console.log("This comment will be confirmed:", item);
    }

    //Decline a comment
    chartContent.doNotConfirmComment = function (item) {
        console.log("This comment will not be confirmed:", item);

    }
    //Remove a comment
    chartContent.deleteComment = function (item) {
        if (!chartContent.gridContentOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        chartContent.treeConfig.showbusy = true;
        chartContent.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), "آیا می خواهید این نظر را حذف کنید", function (isConfirmed) {
            if (isConfirmed) {
                console.log("Item to be deleted: ", chartContent.gridOptions.selectedRow.item);
                chartContent.showbusy = true;
                chartContent.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+'chartContent/GetOne', chartContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    chartContent.showbusy = false;
                    chartContent.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    chartContent.selectedItemForDelete = response.Item;
                    console.log(chartContent.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'chartContent/delete', chartContent.selectedItemForDelete, 'POST').success(function (res) {
                        chartContent.treeConfig.showbusy = false;
                        chartContent.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            chartContent.replaceItem(chartContent.selectedItemForDelete.Id);
                            chartContent.gridOptions.fillData(chartContent.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        chartContent.treeConfig.showbusy = false;
                        chartContent.showIsBusy = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    chartContent.treeConfig.showbusy = false;
                    chartContent.showIsBusy = false;
                });
            }
        });
    }
    //Aprove a Event
    chartContent.confirmEvent = function (item) {
        console.log("This Event will be confirmed:", item);
    }

    //Decline a Event
    chartContent.doNotConfirmEvent = function (item) {
        console.log("This Event will not be confirmed:", item);

    }
    //Remove a Event
    chartContent.deleteEvent = function (item) {
        if (!chartContent.gridContentOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        chartContent.treeConfig.showbusy = true;
        chartContent.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), "آیا می خواهید این نظر را حذف کنید", function (isConfirmed) {
            if (isConfirmed) {
                console.log("Item to be deleted: ", chartContent.gridOptions.selectedRow.item);
                chartContent.showbusy = true;
                chartContent.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+'chartContent/GetOne', chartContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    chartContent.showbusy = false;
                    chartContent.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    chartContent.selectedItemForDelete = response.Item;
                    console.log(chartContent.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'chartContent/delete', chartContent.selectedItemForDelete, 'POST').success(function (res) {
                        chartContent.treeConfig.showbusy = false;
                        chartContent.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            chartContent.replaceItem(chartContent.selectedItemForDelete.Id);
                            chartContent.gridOptions.fillData(chartContent.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        chartContent.treeConfig.showbusy = false;
                        chartContent.showIsBusy = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    chartContent.treeConfig.showbusy = false;
                    chartContent.showIsBusy = false;
                });
            }
        });
    }
    //For reInit Categories
    chartContent.gridOptions.reGetAll = function () {
        if (chartContent.gridOptions.advancedSearchData.engine.Filters.length > 0) chartContent.searchData();
        else chartContent.init();
    };



    chartContent.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            chartContent.focusExpireLockAccount = true;
        });
    };

    chartContent.isCurrentNodeEmpty = function () {
        return !angular.equals({}, chartContent.treeConfig.currentNode);
    }

    chartContent.loadFileAndFolder = function (item) {
        chartContent.treeConfig.currentNode = item;
        console.log(item);
        chartContent.treeConfig.onNodeSelect(item);
    }

    chartContent.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            chartContent.focus = true;
        });
    };
    chartContent.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            chartContent.focus1 = true;
        });
    };

    chartContent.columnCheckbox = false;
    chartContent.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = chartContent.gridOptions.columns;
        if (chartContent.gridOptions.columnCheckbox) {
            for (var i = 0; i < chartContent.gridOptions.columns.length; i++) {
                //chartContent.gridOptions.columns[i].visible = $("#" + chartContent.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + chartContent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                chartContent.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < chartContent.gridOptions.columns.length; i++) {
                var element = $("#" + chartContent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + chartContent.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < chartContent.gridOptions.columns.length; i++) {
            console.log(chartContent.gridOptions.columns[i].name.concat(".visible: "), chartContent.gridOptions.columns[i].visible);
        }
        chartContent.gridOptions.columnCheckbox = !chartContent.gridOptions.columnCheckbox;
    }

    chartContent.deleteAttachedFile = function (index) {
        chartContent.attachedFiles.splice(index, 1);
    }

    chartContent.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !chartContent.alreadyExist(id, chartContent.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = { id: fId, name: fname };
            chartContent.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    chartContent.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    chartContent.filePickerMainImage.removeSelectedfile = function (config) {
        chartContent.filePickerMainImage.fileId = null;
        chartContent.filePickerMainImage.filename = null;
        chartContent.selectedItem.LinkMainImageId = null;

    }
    chartContent.filePickerFilePodcast.removeSelectedfile = function (config) {
        chartContent.filePickerFilePodcast.fileId = null;
        chartContent.filePickerFilePodcast.filename = null;
        chartContent.selectedItem.LinkFilePodcastId = null;

    }
    chartContent.filePickerFiles.removeSelectedfile = function (config) {
        chartContent.filePickerFiles.fileId = null;
        chartContent.filePickerFiles.filename = null;
    }




    chartContent.showUpload = function () { $("#fastUpload").fadeToggle(); }

    // ----------- FilePicker Codes --------------------------------
    chartContent.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !chartContent.alreadyExist(id, chartContent.attachedFiles)) {
            var fId = id;
            var file = { fileId: fId, filename: fname };
            chartContent.attachedFiles.push(file);
            chartContent.clearfilePickers();
        }
    }

    chartContent.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                chartContent.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    chartContent.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            chartContent.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    chartContent.clearfilePickers = function () {
        chartContent.filePickerFiles.fileId = null;
        chartContent.filePickerFiles.filename = null;
    }

    chartContent.stringfyLinkFileIds = function () {
        $.each(chartContent.attachedFiles, function (i, item) {
            if (chartContent.selectedItem.LinkFileIds == "")
                chartContent.selectedItem.LinkFileIds = item.fileId;
            else
                chartContent.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    chartContent.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleChart/ChartContent/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        chartContent.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            chartContent.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }
//---------------Upload Modal Podcast-------------------------------
     chartContent.openUploadModalPodcast = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleChart/chartContent/upload_modalPodcast.html',
            size: 'lg',
            scope: $scope
        });

        chartContent.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            chartContent.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }
    chartContent.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    chartContent.whatcolor = function (progress) {
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

    chartContent.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    chartContent.replaceFile = function (name) {
        chartContent.itemClicked(null, chartContent.fileIdToDelete, "file");
        chartContent.fileTypes = 1;
        chartContent.fileIdToDelete = chartContent.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", chartContent.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    chartContent.remove(chartContent.FileList, chartContent.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                chartContent.FileItem = response3.Item;
                                chartContent.FileItem.FileName = name;
                                chartContent.FileItem.Extension = name.split('.').pop();
                                chartContent.FileItem.FileSrc = name;
                                chartContent.FileItem.LinkCategoryId = chartContent.thisCategory;
                                chartContent.saveNewFile();
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
    chartContent.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", chartContent.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                chartContent.FileItem = response.Item;
                chartContent.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            chartContent.showErrorIcon();
            return -1;
        });
    }

    chartContent.showSuccessIcon = function () {
        $().toggle
    }

    chartContent.showErrorIcon = function () {

    }
    //file is exist
    chartContent.fileIsExist = function (fileName) {
        for (var i = 0; i < chartContent.FileList.length; i++) {
            if (chartContent.FileList[i].FileName == fileName) {
                chartContent.fileIdToDelete = chartContent.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    chartContent.getFileItem = function (id) {
        for (var i = 0; i < chartContent.FileList.length; i++) {
            if (chartContent.FileList[i].Id == id) {
                return chartContent.FileList[i];
            }
        }
    }

    //select file or folder
    chartContent.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            chartContent.fileTypes = 1;
            chartContent.selectedFileId = chartContent.getFileItem(index).Id;
            chartContent.selectedFileName = chartContent.getFileItem(index).FileName;
        }
        else {
            chartContent.fileTypes = 2;
            chartContent.selectedCategoryId = chartContent.getCategoryName(index).Id;
            chartContent.selectedCategoryTitle = chartContent.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        chartContent.selectedIndex = index;

    };

    chartContent.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }
//upload file Podcast
    chartContent.uploadFilePodcast = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (chartContent.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ chartContent.replaceFile(uploadFile.name);
                    chartContent.itemClicked(null, chartContent.fileIdToDelete, "file");
                    chartContent.fileTypes = 1;
                    chartContent.fileIdToDelete = chartContent.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                chartContent.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        chartContent.FileItem = response2.Item;
                        chartContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        chartContent.filePickerFilePodcast.filename =
                          chartContent.FileItem.FileName;
                        chartContent.filePickerFilePodcast.fileId =
                          response2.Item.Id;
                        chartContent.selectedItem.LinkFilePodcastId =
                          chartContent.filePickerFilePodcast.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      chartContent.showErrorIcon();
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
                    chartContent.FileItem = response.Item;
                    chartContent.FileItem.FileName = uploadFile.name;
                    chartContent.FileItem.uploadName = uploadFile.uploadName;
                    chartContent.FileItem.Extension = uploadFile.name.split('.').pop();
                    chartContent.FileItem.FileSrc = uploadFile.name;
                    chartContent.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- chartContent.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", chartContent.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            chartContent.FileItem = response.Item;
                            chartContent.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            chartContent.filePickerFilePodcast.filename = chartContent.FileItem.FileName;
                            chartContent.filePickerFilePodcast.fileId = response.Item.Id;
                            chartContent.selectedItem.LinkFilePodcastId = chartContent.filePickerFilePodcast.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        chartContent.showErrorIcon();
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
    chartContent.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (chartContent.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ chartContent.replaceFile(uploadFile.name);
                    chartContent.itemClicked(null, chartContent.fileIdToDelete, "file");
                    chartContent.fileTypes = 1;
                    chartContent.fileIdToDelete = chartContent.selectedIndex;
 // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                chartContent.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        chartContent.FileItem = response2.Item;
                        chartContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        chartContent.filePickerMainImage.filename =
                          chartContent.FileItem.FileName;
                        chartContent.filePickerMainImage.fileId =
                          response2.Item.Id;
                        chartContent.selectedItem.LinkMainImageId =
                          chartContent.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      chartContent.showErrorIcon();
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
                    chartContent.FileItem = response.Item;
                    chartContent.FileItem.FileName = uploadFile.name;
                    chartContent.FileItem.uploadName = uploadFile.uploadName;
                    chartContent.FileItem.Extension = uploadFile.name.split('.').pop();
                    chartContent.FileItem.FileSrc = uploadFile.name;
                    chartContent.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- chartContent.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", chartContent.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            chartContent.FileItem = response.Item;
                            chartContent.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            chartContent.filePickerMainImage.filename = chartContent.FileItem.FileName;
                            chartContent.filePickerMainImage.fileId = response.Item.Id;
                            chartContent.selectedItem.LinkMainImageId = chartContent.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        chartContent.showErrorIcon();
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
    chartContent.exportFile = function () {
        chartContent.gridOptions.advancedSearchData.engine.ExportFile = chartContent.ExportFileClass;
        chartContent.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ChartContent/exportfile', chartContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            chartContent.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                chartContent.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //chartContent.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    chartContent.toggleExportForm = function () {
        chartContent.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        chartContent.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        chartContent.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        chartContent.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        chartContent.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleChart/ChartContent/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    chartContent.rowCountChanged = function () {
        if (!angular.isDefined(chartContent.ExportFileClass.RowCount) || chartContent.ExportFileClass.RowCount > 5000)
            chartContent.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    chartContent.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ChartContent/count", chartContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            chartContent.addRequested = false;
            rashaErManage.checkAction(response);
            chartContent.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            chartContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    //TreeControl
    chartContent.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (chartContent.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    chartContent.onNodeToggle = function (node, expanded) {
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

    chartContent.onSelection = function (node, selected) {
        if (!selected) {
            chartContent.selectedItem.LinkMainImageId = null;
            chartContent.selectedItem.previewImageSrc = null;
            return;
        }
        chartContent.selectedItem.LinkMainImageId = node.Id;
        chartContent.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            chartContent.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);