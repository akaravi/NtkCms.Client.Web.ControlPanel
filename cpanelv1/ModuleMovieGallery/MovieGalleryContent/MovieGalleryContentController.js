app.controller("movieGalleryCtrl", ["$scope", '$state', "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', '$timeout', '$window', '$stateParams', '$filter', function ($scope,$state, $http, ajax, rashaErManage, $modal, $modalStack, $timeout, $window, $stateParams, $filter) {

    var mvGallery = this;
    mvGallery.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }
    mvGallery.selectedContentId = { Id: $stateParams.ContentId ,TitleTag:$stateParams.TitleTag };
    mvGallery.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:mvGallery.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:mvGallery,
        useCurrentLocationZoom:12,
    }
    if (itemRecordStatus != undefined) mvGallery.itemRecordStatus = itemRecordStatus;
    //Tree Config
    mvGallery.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    }
    // Initilize In Init();
    mvGallery.treeConfig.currentNode = {};

    mvGallery.treeBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری آلبوم ها ..."
    }
    mvGallery.busyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    var date = moment().format();
    //mvGallery.selectedItem.ToDate = date;
    mvGallery.datePickerConfig = {
        defaultDate: date
    };
    mvGallery.startDate = {
        defaultDate: date
    }
    mvGallery.endDate = {
        defaultDate: date
    }
    mvGallery.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    //#tagsInput -----
    //mvGallery.onTagAdded = function (tag) {
    //    if (!angular.isDefined(tag.id)) {    //Check if this a new or a existing tag (existing tags comprise with an id)
    //        var tagObject = jQuery.extend({}, mvGallery.ModuleTag);   //#Clone a Javascript Object
    //        tagObject.Title = tag.text;
    //        ajax.call('/api/movieGalleryTag/add', tagObject, 'POST').success(function (response) {
    //            rashaErManage.checkAction(response);
    //            if (response.IsSuccess) {
    //                mvGallery.tags[mvGallery.tags.length - 1] = { id: response.Item.Id, text: response.Item.Title };  //Replace the newly added tag (last in the array) with a new object including its Id
    //            }
    //        }).error(function (data, errCode, c, d) {
    //            rashaErManage.checkAction(data, errCode);
    //        });
    //    }
    //}
    mvGallery.init = function () {
        mvGallery.treeBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"movieGalleryCategory/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            mvGallery.treeConfig.Items = response.ListItems;
            mvGallery.treeBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        filterModel = { PropertyName: "ContentTags",PropertyAnyName:"LinkTagId", SearchType: 0, IntValue1: mvGallery.selectedContentId.Id };
        if (mvGallery.selectedContentId.Id >0)
            mvGallery.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
        mvGallery.addRequested = true;
        mvGallery.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"movieGalleryContent/getall", mvGallery.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            mvGallery.addRequested = false;
            mvGallery.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            mvGallery.ListItems = response.ListItems;
            mvGallery.gridOptions.currentPageNumber = response.CurrentPageNumber;
            mvGallery.gridOptions.totalRowCount = response.TotalRowCount;
            mvGallery.gridOptions.rowPerPage = response.RowPerPage;
            mvGallery.gridOptions.maxSize = 10;
            mvGallery.fetchImageURLs(mvGallery.ListItems);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    mvGallery.fetchImageURLs = function (listItems) {
        angular.forEach(listItems, function (value, key) {
            
            var output = "";
            if (value.Src != null)
                output = [value.Src.slice(0, value.Src.lastIndexOf(".")), "ThumbnailImage", value.Src.slice(value.Src.lastIndexOf("."))].join('');
            value.SrcThumbnail = output;
        });
    }

    mvGallery.openUpload = function () {
        mvGallery.modalTitle = "آپلود فایل";
        ajax.call(cmsServerConfig.configApiServerPath+'movieGallery/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            mvGallery.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModulemovieGallery/cmsmovieGallery/upload.html',
                scope: $scope,
                size: 'lg'
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    mvGallery.interface = {};
    mvGallery.interface.uploadCount = 0;
    mvGallery.interface.success = false;
    mvGallery.interface.error = false;

    $scope.$on('$dropletReady', function whenDropletReady() {
        mvGallery.interface.allowedExtensions(['png', 'jpg', 'bmp', 'gif', 'svg', 'torrent']);
        mvGallery.interface.setRequestUrl('/cmsmovieGallery/upload');
        var userglobaltoken = $rootScope.tokenInfo.token;
        var data = {};
        data.userToken = userglobaltoken;
        data.LinkmovieGalleryCategoryId = mvGallery.treeConfig.currentNode.Id;
        mvGallery.interface.setPostData(data);
        mvGallery.interface.defineHTTPSuccess([/2.{2}/]);
        mvGallery.interface.useArray(false);
        console.log(mvGallery.interface);

    });

    $scope.$on('$dropletSuccess', function onDropletSuccess(event, response, files) {
        mvGallery.interface.uploadCount = files.length;
        mvGallery.interface.success = true;
        console.log(response, files);
        $timeout(function timeout() {
            mvGallery.interface.success = false;
        }, 5000);
    });

    $scope.$on('$dropletError', function onDropletError(event, response) {
        mvGallery.interface.error = true;
        console.log(response);
        $timeout(function timeout() {
            mvGallery.interface.error = false;
        }, 5000);
    });
//#help/ سلکتور similar
    mvGallery.LinkDestinationIdSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkDestinationId",
      url: "movieGalleryContent",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: mvGallery,
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
mvGallery.LinkCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryId',
        url: 'movieGalleryCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: mvGallery,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' }
            ]
        }
    }
    //Blog Grid Options
    mvGallery.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'Description', displayName: 'عنوان توضیحات', sortable: true, type: 'string', visible: 'true' },
            { name: 'FromDate', displayName: 'تاریخ آغاز', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'ToDate', displayName: 'تاریخ پایان', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: "ActionKey", displayName: 'افزودن به منو', displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="mvGallery.addMenu()"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "Id",
                SortType: 0,
                NeedToRunFakePagination: false,
                TotalRowData: 2000,
                RowPerPage: 10,
                ContentFullSearch: null,
                Filters: [],
                Count: false
            }
        }
    }
    mvGallery.gridOptions.advancedSearchData.engine.Filters = null;
    mvGallery.gridOptions.advancedSearchData.engine.Filters = [];

    mvGallery.isCurrentNodeEmpty = function () {
        return !angular.equals({}, mvGallery.treeConfig.currentNode);
    }

    mvGallery.loadFileAndFolder = function (item) {
        mvGallery.treeConfig.currentNode = item;
        console.log(item);
        mvGallery.treeConfig.onNodeSelect(item);
    }

    mvGallery.openNewFolder = function () {
        mvGallery.modalTitle = "ایجاد شاخه جدید";
        ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryCategory/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            mvGallery.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModulemovieGallery/cmsmovieGallery/folder.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    mvGallery.getGalleriesByCategory = function (id) {
        ajax.call(cmsServerConfig.configApiServerPath+'movieGallery/GetOne', id, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            mvGallery.selectedItems = response.Items;
            $modal.open({
                templateUrl: 'cpanelv1/ModulemovieGallery/cmsmovieGallery/folder.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    mvGallery.uploadFile = function () {
        //mvGallery.processQueue();
        mvGallery.treeConfig.processDropzone();
    };

    mvGallery.reset = function () {
        //mvGallery.resetDropzone();
        mvGallery.treeConfig.resetDropzone();
    };

    //open statistics
    mvGallery.Showstatistics = function () {
        if (!mvGallery.selectedRow.item.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'movieGallerycontent/GetOne', mvGallery.selectedRow.item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            mvGallery.selectedItem = response1.Item;
            $modal.open({
                templateUrl: "cpanelv1/ModulemovieGallery/movieGalleryContent/statistics.html",
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    mvGallery.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        mvGallery.addRequested = true;
        mvGallery.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'movieGallerycontent/add', mvGallery.selectedItem, 'POST').success(function (response) {
            mvGallery.addRequested = false;
            mvGallery.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //mvGallery.ListItems.unshift(response.Item);
                //mvGallery.gridOptions.fillData(mvGallery.ListItems);
                mvGallery.fetchImageURLs([response.Item]);
                mvGallery.ListItems.push(response.Item);
                mvGallery.closeModal();
                //Save inputTags
                mvGallery.selectedItem.ContentTags = [];
                $.each(mvGallery.tags, function (index, item) {
                    if (item.id > 0) {
                        var newObject = $.extend({}, mvGallery.ModuleContentTag);
                        newObject.LinkTagId = item.id;
                        newObject.LinkContentId = response.Item.Id;
                        mvGallery.selectedItem.ContentTags.push(newObject);
                    }
                });
                ajax.call(cmsServerConfig.configApiServerPath+'movieGallerycontentTag/addbatch', mvGallery.selectedItem.ContentTags, 'POST').success(function (response) {
                    console.log(response);
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mvGallery.addRequested = false;
            mvGallery.treeBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    mvGallery.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        mvGallery.treeBusyIndicator.isActive = true;
        mvGallery.addRequested = true;

               //Save Keywords
        
        //Save inputTags
        mvGallery.selectedItem.ContentTags = [];
        $.each(mvGallery.tags, function (index, item) {
            if (item.id > 0) {
                var newObject = $.extend({}, mvGallery.ModuleContentTag);
                newObject.LinkTagId = item.id;
                newObject.LinkContentId = mvGallery.selectedItem.Id;
                mvGallery.selectedItem.ContentTags.push(newObject);
            }
        });
        mvGallery.addRequested = true;
        mvGallery.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'movieGallerycontent/edit', mvGallery.selectedItem, 'PUT').success(function (response) {
            mvGallery.addRequested = false;
            mvGallery.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //mvGallery.replaceItem(mvGallery.selectedItem.Id, response.Item);
                //mvGallery.gridOptions.fillData(mvGallery.ListItems);
                mvGallery.gridOptions.reGetAll();
                mvGallery.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mvGallery.addRequested = false;
            mvGallery.treeBusyIndicator.isActive = false;
        });
    }

    //Replace Item OnDelete/OnEdit Grid Options
    mvGallery.replaceItem = function (oldId, newItem) {
        angular.forEach(mvGallery.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = mvGallery.ListItems.indexOf(item);
                mvGallery.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            mvGallery.ListItems.unshift(newItem);
    }

    var buttonIsPressed = false;
    // Open Add Category Modal 
    mvGallery.openAddCategoryModal = function () {
        if (mvGallery.addRequested) { return };
        mvGallery.addRequested = true;
        mvGallery.treeBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryCategory/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            mvGallery.addRequested = false;
            mvGallery.treeBusyIndicator.isActive = false;
            mvGallery.selectedItem = response.Item;
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
                mvGallery.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(mvGallery.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModulemovieGallery/movieGalleryCategory/add.html',
                        scope: $scope
                    });
                    mvGallery.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //-----
            //$modal.open({
            //    templateUrl: 'cpanelv1/ModulemovieGallery/movieGalleryCategory/add.html',
            //    scope: $scope
            //});

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Open Edit Category Modal
    mvGallery.openEditCategoryModal = function () {
        if (mvGallery.addRequested)
            return;
        mvGallery.modalTitle = 'ویرایش';
        if (!mvGallery.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            mvGallery.addRequested = false;
            return;
        }
        mvGallery.addRequested = true;
        mvGallery.treeBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryCategory/GetOne', mvGallery.treeConfig.currentNode.Id, 'GET').success(function (response) {
            mvGallery.addRequested = false;
            mvGallery.treeBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            mvGallery.selectedItem = response.Item;
            //Set dataForTheTree
            mvGallery.selectedNode = [];
            mvGallery.expandedNodes = [];
            mvGallery.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                mvGallery.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(mvGallery.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (mvGallery.selectedItem.LinkMainImageId > 0)
                        mvGallery.onSelection({ Id: mvGallery.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModulemovieGallery/movieGalleryCategory/edit.html',
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
            //    templateUrl: 'cpanelv1/ModulemovieGallery/movieGalleryCategory/edit.html',
            //    scope: $scope
            //});
        }).error(function (data, errCode, c, d) {
            mvGallery.addRequested = false;
            mvGallery.treeBusyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Category
    mvGallery.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        mvGallery.addRequested = true;
        mvGallery.treeBusyIndicator.isActive = true;
        mvGallery.selectedItem.LinkCategorytId = null;
        if (mvGallery.treeConfig.currentNode != null)
            mvGallery.selectedItem.LinkParentId = mvGallery.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryCategory/add', mvGallery.selectedItem, 'POST').success(function (response) {
            mvGallery.treeBusyIndicator.isActive = false;
            mvGallery.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                mvGallery.gridOptions.advancedSearchData.engine.Filters = [];
                mvGallery.gridOptions.reGetAll();
                mvGallery.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mvGallery.addRequested = false;
            mvGallery.treeBusyIndicator.isActive = false;
        });
    }

    //Edit Category REST Api
    mvGallery.editCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        mvGallery.addRequested = true;
        mvGallery.treeBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryCategory/edit', mvGallery.selectedItem, 'PUT').success(function (response) {
            mvGallery.addRequested = false;
            mvGallery.treeBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                mvGallery.treeConfig.currentNode.Title = response.Item.Title;
                mvGallery.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mvGallery.addRequested = false;
            mvGallery.treeBusyIndicator.isActive = false;
        });
    }

    // Delete a Category
    mvGallery.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = mvGallery.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                mvGallery.treeBusyIndicator.isActive = true;
                mvGallery.addRequested = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryCategory/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    mvGallery.selectedItemForDelete = response.Item;
                    console.log(mvGallery.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryCategory/delete', mvGallery.selectedItemForDelete, 'POST').success(function (res) {
                        mvGallery.treeBusyIndicator.isActive = false;
                        mvGallery.addRequested = true;
                        if (res.IsSuccess) {
                            //mvGallery.replaceCategoryItem(mvGallery.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully!");
                            mvGallery.gridOptions.advancedSearchData.engine.Filters = null;
                            mvGallery.gridOptions.advancedSearchData.engine.Filters = [];
                            //mvGallery.gridOptions.fillData();
                            mvGallery.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        mvGallery.treeBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    mvGallery.treeBusyIndicator.isActive = false;
                });
            }
        });
    }

    mvGallery.openEditModal = function () {
        if (!mvGallery.selectedRow.item.Id) {
            rashaErManage.showMessage("لطفاً برای ویرایش یک آیتم انتخاب کنید");
            return;
        }
        if (mvGallery.getSelectedItems().length > 1) {
            rashaErManage.showMessage("لطفاً برای ویرایش فقط یک آیتم انتخاب کنید");
            return;
        }
        mvGallery.modalTitle = 'ویرایش';
        ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryContent/GetOne', mvGallery.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            mvGallery.selectedItem = response.Item;
            mvGallery.startDate.defaultDate = mvGallery.selectedItem.FromDate;
            mvGallery.endDate.defaultDate = mvGallery.selectedItem.ToDate;
            $modal.open({
                templateUrl: 'cpanelv1/ModulemovieGallery/movieGalleryContent/edit.html',
                scope: $scope
            });
            //Load tagsInput
            mvGallery.tags = [];  //Clear out previous tags
            if (mvGallery.selectedItem.ContentTags == null)
                mvGallery.selectedItem.ContentTags = [];
            $.each(mvGallery.selectedItem.ContentTags, function (index, item) {
                if (item.ModuleTag != null)
                    mvGallery.tags.push({ id: item.ModuleTag.Id, text: item.ModuleTag.Title });  //Add current content's tag to tags array with id and title
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    mvGallery.deleteContent = function () {
        if (buttonIsPressed) { return }
        mvGallery.selectedItemsForDelete = [];
        //$('input:checkbox.selector').each(function () {
        //    if (this.checked) {
        //        mvGallery.selectedItemsForDelete.push({ Id: parseInt($(this).val()) });
        //    }
        //});
        mvGallery.selectedItemsForDelete = mvGallery.getSelectedItems();
        if (mvGallery.selectedItemsForDelete.length < 1) {
            if (!mvGallery.selectedRow.item.Id) {
                rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
                return;
            }
            mvGallery.selectedItemsForDelete.push(mvGallery.selectedRow.item);
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                mvGallery.addRequested = true;
                mvGallery.busyIndicator = true;
                var deleteFilterModel = { Filters: [] };
                angular.forEach(mvGallery.selectedItemsForDelete, function (value, key) {
                    var filterDataModel = { PropertyName: "Id", SearchType: 0, IntValue1: value.Id, ClauseType: 1 };
                    deleteFilterModel.Filters.push(filterDataModel);
                });
                //ajax.call(cmsServerConfig.configApiServerPath+"movieGallerycontent/getall", mvGallery.selectedRow.item.Id, "POST").success(function (response) {
                //    rashaErManage.checkAction(response);
                //    mvGallery.selectedItemsForDelete = response.ListItems;
                ajax.call(cmsServerConfig.configApiServerPath+"movieGallerycontent/DeleteFilterModel", deleteFilterModel, 'POST').success(function (res) {
                    rashaErManage.checkAction(res);
                    if (res.IsSuccess) {
                        //mvGallery.replaceItem(mvGallery.selectedItemForDelete.Id);
                        mvGallery.gridOptions.reGetAll();
                    }
                    mvGallery.addRequested = false;
                    mvGallery.busyIndicator = false;
                }).error(function (data2, errCode2, c2, d2) {
                    rashaErManage.checkAction(data2);
                    mvGallery.addRequested = false;
                    mvGallery.busyIndicator = false;
                });
                //}).error(function (data, errCode, c, d) {
                //    rashaErManage.checkAction(data, errCode);
                //});
            }
        });
    }

    mvGallery.closeModal = function () {
        $modalStack.dismissAll();
    }
    mvGallery.closeModalAndGetall = function () {
        $modalStack.dismissAll();
        mvGallery.gridOptions.reGetAll();
    }

    mvGallery.treeConfig.onNodeSelect = function (item) {
        var node = mvGallery.treeConfig.currentNode;
        mvGallery.selectContent(node);

    }
    //Show Content with Category Id
    mvGallery.selectContent = function (node) {
    mvGallery.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            
            mvGallery.attachedFiles = null;
            mvGallery.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryId",
                IntValue1: node.Id,
                SearchType: 0
            }
            mvGallery.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        mvGallery.addRequested = true;
        mvGallery.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"movieGalleryContent/getall", mvGallery.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            mvGallery.addRequested = false;
            mvGallery.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            mvGallery.ListItems = response.ListItems;
            mvGallery.fetchImageURLs(mvGallery.ListItems);
            //mvGallery.gridOptions.fillData(mvGallery.ListItems, response.resultAccess); // Sending Access as an argument
            mvGallery.gridOptions.currentPageNumber = response.CurrentPageNumber;
            mvGallery.gridOptions.totalRowCount = response.TotalRowCount;
            mvGallery.gridOptions.rowPerPage = response.RowPerPage;
            mvGallery.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            //mvGallery.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Open Add New Content Model
    mvGallery.openAddModal = function () {
        if (mvGallery.addRequested) { return };
        var node = mvGallery.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_Please_Select_The_Relevant_Album'));
            mvGallery.addRequested = false;
            return;
        }
        mvGallery.tags = [];   //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
        mvGallery.addRequested = true;
        mvGallery.treeBusyIndicator.isActive = true;
        mvGallery.filePickerMainImage.filename = "";
        mvGallery.filePickerMainImage.fileId = null;
        mvGallery.modalTitle = 'اضافه کردن محتوای جدید';
        ajax.call(cmsServerConfig.configApiServerPath+'movieGallerycontent/GetViewModel', "", 'GET').success(function (response) {
            mvGallery.addRequested = false;
            mvGallery.treeBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            mvGallery.selectedItem = response.Item;
            mvGallery.selectedItem.OtherInfos = [];
            mvGallery.selectedItem.Similars = [];
            mvGallery.clearPreviousData();
            mvGallery.selectedItem.LinkCategoryId = node.Id;
            $modal.open({
                templateUrl: 'cpanelv1/ModulemovieGallery/movieGalleryContent/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add From Folder Modal 
    mvGallery.openAddFromFolderModal = function (dirSelectable) {
        var node = mvGallery.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_Please_Select_The_Relevant_Album'));
            mvGallery.addRequested = false;
            return;
        }
        mvGallery.dataForTheTree = [];
        mvGallery.selectedNodes = [];
        mvGallery.treeOptions.dirSelectable = dirSelectable;
        mvGallery.treeOptions.multiSelection = !dirSelectable;
        mvGallery.showAddRequestBtn = true;

        var filterModelParentRootFolders = {
            Filters: [{
                PropertyName: "LinkParentId",
                IntValue1: null,
                SearchType: 0,
                IntValueForceNullSearch: true
            }]
        };
        mvGallery.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
            mvGallery.dataForTheTree = response1.ListItems;
            var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
            ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                //mvGallery.dataForTheTree.concat(response2.ListItems);
                Array.prototype.push.apply(mvGallery.dataForTheTree, response2.ListItems);
                $modal.open({
                    templateUrl: 'cpanelv1/ModulemovieGallery/movieGalleryContent/addFolder.html',
                    scope: $scope
                });
                mvGallery.addRequested = false;
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryContent/GetViewModel', '', 'GET').success(function (response) {
            mvGallery.selectedItem = response.Item;
            mvGallery.selectedItem.FolderId = null;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    mvGallery.gridOptions.pageChanged = function (page) {
        mvGallery.gridOptions.advancedSearchData.engine.CurrentPageNumber = mvGallery.gridOptions.currentPageNumber;
        mvGallery.gridOptions.reGetAll();
    }
    //Reinitiate State
    mvGallery.gridOptions.reGetAll = function () {
        mvGallery.init();
    };

    //Get TotalRowCount
    mvGallery.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"movieGallerycontent/count", mvGallery.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            mvGallery.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            mvGallery.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    mvGallery.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    mvGallery.getSelectedItems = function () {
        var selectedItems = [];
        $('input:checkbox.selector').each(function () {
            if (this.checked) {
                selectedItems.push({ Id: parseInt($(this).val()) });
            }
        });
        return selectedItems;
    }

    mvGallery.fileTypes = [
        { extension: 'JPG', background: '#99FF66' },
        { extension: 'PNG', background: '#99FF66' },
        { extension: 'GIF', background: '#99FF66' },
        { extension: 'MP3', background: '#CC99FF' },
        { extension: 'OGG', background: '#CC99FF' },
        { extension: 'WAV', background: '#CC99FF' },
        { extension: '3GP', background: '#FFCC66' },
        { extension: 'FLV', background: '#FFCC66' },
        { extension: 'DOC', background: '#FFFF66' },
        { extension: 'PDF', background: '#FFFF66' },
        { extension: 'PTT', background: '#FFFF66' },
        { extension: 'ZIP', background: '#FFDD66' },
        { extension: 'RAR', background: '#FFDD66' }
    ];

    mvGallery.selectedRow = { item: {} };

    mvGallery.onRowSelected = function (item) {
        console.log("row selected");
        mvGallery.selectedRow.item = item;
        //$("#row" + item.Id).addClass('boxselected').siblings().removeClass('boxselected');
        //$("#footer" + item.Id).addClass('boxselected');
        $('.ibox-footer').each(function () {
            var id = $(this).attr('id');
            id = id.substring(6);
            if (!$("#selector" + id).is(':checked'))
                $(this).removeClass('boxselected');
        });
        $('.body-content').each(function () {
            var id = $(this).attr('id');
            id = id.substring(3);
            if (!$("#selector" + id).is(':checked'))
                $(this).removeClass('boxselected');
        });
        if (!mvGallery.checkboxChanged) {
            $("#row" + item.Id).addClass('boxselected').siblings().removeClass('boxselected');
            $("#footer" + item.Id).addClass('boxselected').siblings().removeClass('boxselected');
        }
        mvGallery.checkboxChanged = false;
    }

    mvGallery.checkedChanged = function (item) {
        mvGallery.checkboxChanged = true
        if (!$("#selector" + item.Id).is(':checked')) {
            console.log("is not checked");
            $("#row" + item.Id).removeClass('boxselected');
            $("#footer" + item.Id).removeClass('boxselected');
            //$("#selector" + item.Id).prop('checked', false);
        }
        else {
            //$("#selector" + item.Id).prop('checked', true);
            console.log("is checked");
            $("#row" + item.Id).addClass('boxselected');
            $("#footer" + item.Id).addClass('boxselected');
        }
    }

    mvGallery.openLightBox = function () {
        overlayLink = $(this).attr("href");
        window.startOverlay(overlayLink);
        return false;
    }

    mvGallery.closeLightbox = function () {
        console.log("test");
        $(".container, .overlay").animate({ "opacity": "0" }, 200, linear, function () {
            $(".container, .overlay").remove();
        });
    }

    function startOverlay(overlayLink) {
        $("body").append('<div class="overlay" id="lightbox_overlay" ng-click="mvGallery.closeLightbox()"></div><div class="container"></div>').css({ "overflow-y": "hidden" });
        $(".overlay").animate({ "opacity": "0.6" }, 200, "linear");
        $(".container").html('<img ng-click="mvGallery.closeLightbox()" id="overlay_img" src="' + overlayLink + '" alt="Hello!" />');
        $(".container img").load(function () {
            var imgWidth = $(".container img").width();
            var imgHeight = $(".container img").height();
            $(".container")
            .css({
                "top": "50%",
                "left": "50%",
                "width": imgWidth,
                "height": imgHeight,
                "margin-top": -(imgHeight / 2), // the middle position
                "margin-left": -(imgWidth / 2)
            }).animate({ "opacity": "1" }, 200, "linear");
        });
    }
//#help similar & otherinfo
    mvGallery.clearPreviousData = function() {
      mvGallery.selectedItem.Similars = [];
      $("#to").empty();
    };
    

    mvGallery.moveSelected = function(from, to, calculatePrice) {
      if (from == "Content") {
        //var title = mvGallery.ItemListIdSelector.selectedItem.Title;
        // var optionSelectedPrice = mvGallery.ItemListIdSelector.selectedItem.Price;
        if (
          mvGallery.selectedItem.LinkDestinationId != undefined &&
          mvGallery.selectedItem.LinkDestinationId != null
        ) {
          if (mvGallery.selectedItem.Similars == undefined)
            mvGallery.selectedItem.Similars = [];
          for (var i = 0; i < mvGallery.selectedItem.Similars.length; i++) {
            if (
              mvGallery.selectedItem.Similars[i].LinkDestinationId ==
              mvGallery.selectedItem.LinkDestinationId
            ) {
                rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
              return;
            }
          }
          // if (mvGallery.selectedItem.Title == null || mvGallery.selectedItem.Title.length < 0)
          //     mvGallery.selectedItem.Title = title;
          mvGallery.selectedItem.Similars.push({
            //Id: 0,
            //Source: from,
            LinkDestinationId: mvGallery.selectedItem.LinkDestinationId,
            Destination: mvGallery.LinkDestinationIdSelector.selectedItem
          });
        }
      }
    };
     mvGallery.moveSelectedOtherInfo = function(from, to,y) {

            
             if (mvGallery.selectedItem.OtherInfos == undefined)
                mvGallery.selectedItem.OtherInfos = [];
              for (var i = 0; i < mvGallery.selectedItem.OtherInfos.length; i++) {
              
                if (mvGallery.selectedItem.OtherInfos[i].Title == mvGallery.selectedItemOtherInfos.Title && mvGallery.selectedItem.OtherInfos[i].HtmlBody ==mvGallery.selectedItemOtherInfos.HtmlBody && mvGallery.selectedItem.OtherInfos[i].Source ==mvGallery.selectedItemOtherInfos.Source) 
                {
                  rashaErManage.showMessage($filter('translatentk')('Information_Is_Duplicate'));
                  return;
                }
             
              }
             if (mvGallery.selectedItemOtherInfos.Title == "" && mvGallery.selectedItemOtherInfos.Source =="" && mvGallery.selectedItemOtherInfos.HtmlBody =="")
                {
                    rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
                }
             else
               {
            
             mvGallery.selectedItem.OtherInfos.push({
                Title:mvGallery.selectedItemOtherInfos.Title,
                HtmlBody:mvGallery.selectedItemOtherInfos.HtmlBody,
                Source:mvGallery.selectedItemOtherInfos.Source
              });
              mvGallery.selectedItemOtherInfos.Title="";
              mvGallery.selectedItemOtherInfos.Source="";
              mvGallery.selectedItemOtherInfos.HtmlBody="";
             }
             if(edititem)
               { 
                   edititem=false; 
               }
              
        };

    mvGallery.removeFromCollection = function(listsimilar,iddestination) {
      for (var i = 0; i < mvGallery.selectedItem.Similars.length; i++) 
       {       
            if(listsimilar[i].LinkDestinationId==iddestination)
            {
                mvGallery.selectedItem.Similars.splice(i, 1);
                return;
            }
          
      }
      
    };
   mvGallery.removeFromOtherInfo = function(listOtherInfo,title,body,source) {
    for (var i = 0; i < mvGallery.selectedItem.OtherInfos.length; i++) 
       {       
            if(listOtherInfo[i].Title==title && listOtherInfo[i].HtmlBody==body && listOtherInfo[i].Source==source)
            {
              mvGallery.selectedItem.OtherInfos.splice(i, 1);
              return;
            }
       }
    };
   mvGallery.editOtherInfo = function(y) {
      edititem=true;
      mvGallery.selectedItemOtherInfos.Title=y.Title;
      mvGallery.selectedItemOtherInfos.HtmlBody=y.HtmlBody;
      mvGallery.selectedItemOtherInfos.Source=y.Source;
      mvGallery.removeFromOtherInfo(mvGallery.selectedItem.OtherInfos,y.Title,y.HtmlBody,y.Source);
    };


    //#help
    //TreeControl 
    mvGallery.treeOptions = {
        nodeChildren: "Children",
        multiSelection: true,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (mvGallery.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: true
    }

    mvGallery.onNodeToggle = function (node, expanded) {
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

    mvGallery.onSelection = function (node, selected) {
    }

    mvGallery.addFromFolder = function () {
        if (mvGallery.selectedNode == undefined && mvGallery.treeOptions.dirSelectable) {
            rashaErManage.showMessage("هیج فولدری انتخاب نشده است");
            return;
        }
        if (mvGallery.treeOptions.dirSelectable && mvGallery.selectedNode.Title == undefined) {
            rashaErManage.showMessage("هیج فولدری انتخاب نشده است");
            return;
        }
        if (mvGallery.selectedNodes.length < 1 && !mvGallery.treeOptions.dirSelectable) {
            rashaErManage.showMessage("هیج فایلی انتخاب نشده است");
            return;
        }
        var selectedFolder = mvGallery.selectedNode;

        mvGallery.contentsToAdd = [];
        $("#treecontrol").fadeOut("slow");
        $("#addRequests").fadeIn("slow");
        mvGallery.addRequested = true;
        if (mvGallery.treeOptions.dirSelectable) {
            ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", selectedFolder.Id, 'POST').success(function (response) {
                angular.forEach(response.ListItems, function (value, key) {
                    var newObject = jQuery.extend({}, mvGallery.selectedItem);   //#Clone a Javascript Object
                    newObject.LinkFileId = value.Id;
                    newObject.Title = value.FileName;
                    newObject.LinkCategoryId = mvGallery.treeConfig.currentNode.Id;
                    mvGallery.contentsToAdd.push(newObject);
                });
                angular.forEach(mvGallery.contentsToAdd, function (value, key) {
                    ajax.call(cmsServerConfig.configApiServerPath+"movieGallerycontent/add", value, 'POST').success(function (response) {
                        value.addIsSuccess = response.IsSuccess;
                        value.addErrorMessage = response.ErrorMessage;
                    }).error(function (data, errCode, c, d) {
                        console.log(data);
                    });
                });
                mvGallery.addRequested = false;
                mvGallery.showAddRequestBtn = false;
                $state.reload();
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
        }
        else {
            angular.forEach(mvGallery.selectedNodes, function (value, key) {
                var newObject = jQuery.extend({}, mvGallery.selectedItem);   //#Clone a Javascript Object
                newObject.LinkFileId = value.Id;
                newObject.Title = value.FileName;
                newObject.LinkCategoryId = mvGallery.treeConfig.currentNode.Id;
                mvGallery.contentsToAdd.push(newObject);
            });
            angular.forEach(mvGallery.contentsToAdd, function (value, key) {
                ajax.call(cmsServerConfig.configApiServerPath+"movieGallerycontent/add", value, 'POST').success(function (response) {
                    value.addIsSuccess = response.IsSuccess;
                    value.addErrorMessage = response.ErrorMessage;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            });
            mvGallery.addRequested = false;
            mvGallery.showAddRequestBtn = false;
            $state.reload();
        }
    }
    //TreeControl


    //TreeControl
    mvGallery.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (mvGallery.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    mvGallery.onNodeToggle = function (node, expanded) {
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

    mvGallery.onSelection = function (node, selected) {
        if (!selected) {
            mvGallery.selectedItem.LinkMainImageId = null;
            mvGallery.selectedItem.previewImageSrc = null;
            return;
        }
        mvGallery.selectedItem.LinkMainImageId = node.Id;
        mvGallery.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            mvGallery.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl

    //Export Report 
    mvGallery.exportFile = function () {
        mvGallery.gridOptions.advancedSearchData.engine.ExportFile = mvGallery.ExportFileClass;
        mvGallery.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'movieGallerycontent/exportfile', mvGallery.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            mvGallery.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                mvGallery.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //mvGallery.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    mvGallery.toggleExportForm = function () {
        mvGallery.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        mvGallery.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        mvGallery.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        mvGallery.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        mvGallery.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModulemovieGallery/movieGalleryContent/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    mvGallery.rowCountChanged = function () {
        if (!angular.isDefined(mvGallery.ExportFileClass.RowCount) || mvGallery.ExportFileClass.RowCount > 5000)
            mvGallery.ExportFileClass.RowCount = 5000;
    }
}]);