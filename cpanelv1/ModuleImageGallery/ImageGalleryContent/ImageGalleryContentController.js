app.controller("imageGalleryCtrl", ["$scope", "$state", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', '$timeout', '$window', '$stateParams', '$filter', function ($scope, $state,$http, ajax, rashaErManage, $modal, $modalStack, $timeout, $window, $stateParams, $filter) {

    var imgGallery = this;
    imgGallery.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }
    imgGallery.selectedContentId = { Id: $stateParams.ContentId ,TitleTag:$stateParams.TitleTag };
    imgGallery.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:imgGallery.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:imgGallery,
        useCurrentLocationZoom:12,
    }
    if (itemRecordStatus != undefined) imgGallery.itemRecordStatus = itemRecordStatus;
    //Tree Config
    imgGallery.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    }
    // Initilize In Init();
    imgGallery.treeConfig.currentNode = {};

    imgGallery.treeBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری آلبوم ها ..."
    }
    imgGallery.busyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    var date = moment().format();
    //imgGallery.selectedItem.ToDate = date;
    imgGallery.datePickerConfig = {
        defaultDate: date
    };
    imgGallery.startDate = {
        defaultDate: date
    }
    imgGallery.endDate = {
        defaultDate: date
    }
    imgGallery.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    //#tagsInput -----
    //imgGallery.onTagAdded = function (tag) {
    //    if (!angular.isDefined(tag.id)) {    //Check if this a new or a existing tag (existing tags comprise with an id)
    //        var tagObject = jQuery.extend({}, imgGallery.ModuleTag);   //#Clone a Javascript Object
    //        tagObject.Title = tag.text;
    //        ajax.call('/api/imagegalleryTag/add', tagObject, 'POST').success(function (response) {
    //            rashaErManage.checkAction(response);
    //            if (response.IsSuccess) {
    //                imgGallery.tags[imgGallery.tags.length - 1] = { id: response.Item.Id, text: response.Item.Title };  //Replace the newly added tag (last in the array) with a new object including its Id
    //            }
    //        }).error(function (data, errCode, c, d) {
    //            rashaErManage.checkAction(data, errCode);
    //        });
    //    }
    //}
    imgGallery.init = function () {
        imgGallery.treeBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ImageGalleryCategory/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            imgGallery.treeConfig.Items = response.ListItems;
            imgGallery.treeBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        filterModel = { PropertyName: "ContentTags",PropertyAnyName:"LinkTagId", SearchType: 0, IntValue1: imgGallery.selectedContentId.Id };
        if (imgGallery.selectedContentId.Id >0)
            imgGallery.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
        imgGallery.addRequested = true;
        imgGallery.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ImageGalleryContent/getall", imgGallery.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            imgGallery.addRequested = false;
            imgGallery.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            imgGallery.ListItems = response.ListItems;
            imgGallery.gridOptions.currentPageNumber = response.CurrentPageNumber;
            imgGallery.gridOptions.totalRowCount = response.TotalRowCount;
            imgGallery.gridOptions.rowPerPage = response.RowPerPage;
            imgGallery.gridOptions.maxSize = 10;
            imgGallery.fetchImageURLs(imgGallery.ListItems);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    imgGallery.fetchImageURLs = function (listItems) {
        angular.forEach(listItems, function (value, key) {
            
            var output = "";
            if (value.Src != null)
                output = [value.Src.slice(0, value.Src.lastIndexOf(".")), "ThumbnailImage", value.Src.slice(value.Src.lastIndexOf("."))].join('');
            value.SrcThumbnail = output;
        });
    }

    imgGallery.openUpload = function () {
        imgGallery.modalTitle = "آپلود فایل";
        ajax.call(cmsServerConfig.configApiServerPath+'ImageGallery/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            imgGallery.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleImageGallery/cmsImageGallery/upload.html',
                scope: $scope,
                size: 'lg'
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    imgGallery.interface = {};
    imgGallery.interface.uploadCount = 0;
    imgGallery.interface.success = false;
    imgGallery.interface.error = false;

    $scope.$on('$dropletReady', function whenDropletReady() {
        imgGallery.interface.allowedExtensions(['png', 'jpg', 'bmp', 'gif', 'svg', 'torrent']);
        imgGallery.interface.setRequestUrl('/cmsImageGallery/upload');
        var userglobaltoken = $rootScope.tokenInfo.token;
        var data = {};
        data.userToken = userglobaltoken;
        data.LinkImageGalleryCategoryId = imgGallery.treeConfig.currentNode.Id;
        imgGallery.interface.setPostData(data);
        imgGallery.interface.defineHTTPSuccess([/2.{2}/]);
        imgGallery.interface.useArray(false);
        console.log(imgGallery.interface);

    });

    $scope.$on('$dropletSuccess', function onDropletSuccess(event, response, files) {
        imgGallery.interface.uploadCount = files.length;
        imgGallery.interface.success = true;
        console.log(response, files);
        $timeout(function timeout() {
            imgGallery.interface.success = false;
        }, 5000);
    });

    $scope.$on('$dropletError', function onDropletError(event, response) {
        imgGallery.interface.error = true;
        console.log(response);
        $timeout(function timeout() {
            imgGallery.interface.error = false;
        }, 5000);
    });
//#help/ سلکتور similar
    imgGallery.LinkDestinationIdSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkDestinationId",
      url: "ImageGalleryContent",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: imgGallery,
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
imgGallery.LinkCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryId',
        url: 'ImageGalleryCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: imgGallery,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' }
            ]
        }
    }
    //Blog Grid Options
    imgGallery.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'Description', displayName: 'عنوان توضیحات', sortable: true, type: 'string', visible: 'true' },
            { name: 'FromDate', displayName: 'تاریخ آغاز', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'ToDate', displayName: 'تاریخ پایان', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: "ActionKey", displayName: 'افزودن به منو', displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="imgGallery.addMenu()"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
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
    imgGallery.gridOptions.advancedSearchData.engine.Filters = null;
    imgGallery.gridOptions.advancedSearchData.engine.Filters = [];

    imgGallery.isCurrentNodeEmpty = function () {
        return !angular.equals({}, imgGallery.treeConfig.currentNode);
    }

    imgGallery.loadFileAndFolder = function (item) {
        imgGallery.treeConfig.currentNode = item;
        console.log(item);
        imgGallery.treeConfig.onNodeSelect(item);
    }

    imgGallery.openNewFolder = function () {
        imgGallery.modalTitle = "ایجاد شاخه جدید";
        ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryCategory/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            imgGallery.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleImageGallery/cmsImageGallery/folder.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    imgGallery.getGalleriesByCategory = function (id) {
        ajax.call(cmsServerConfig.configApiServerPath+'ImageGallery/GetOne', id, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            imgGallery.selectedItems = response.Items;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleImageGallery/cmsImageGallery/folder.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    imgGallery.uploadFile = function () {
        //imgGallery.processQueue();
        imgGallery.treeConfig.processDropzone();
    };

    imgGallery.reset = function () {
        //imgGallery.resetDropzone();
        imgGallery.treeConfig.resetDropzone();
    };

    //open statistics
    imgGallery.Showstatistics = function () {
        if (!imgGallery.selectedRow.item.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryContent/GetOne', imgGallery.selectedRow.item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            imgGallery.selectedItem = response1.Item;
            $modal.open({
                templateUrl: "cpanelv1/ModuleImageGallery/ImageGalleryContent/statistics.html",
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    imgGallery.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        imgGallery.addRequested = true;
        imgGallery.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'imagegallerycontent/add', imgGallery.selectedItem, 'POST').success(function (response) {
            imgGallery.addRequested = false;
            imgGallery.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //imgGallery.ListItems.unshift(response.Item);
                //imgGallery.gridOptions.fillData(imgGallery.ListItems);
                imgGallery.fetchImageURLs([response.Item]);
                imgGallery.ListItems.push(response.Item);
                imgGallery.closeModal();
                //Save inputTags
                imgGallery.selectedItem.ContentTags = [];
                $.each(imgGallery.tags, function (index, item) {
                    if (item.id > 0) {
                        var newObject = $.extend({}, imgGallery.ModuleContentTag);
                        newObject.LinkTagId = item.id;
                        newObject.LinkContentId = response.Item.Id;
                        imgGallery.selectedItem.ContentTags.push(newObject);
                    }
                });
                ajax.call(cmsServerConfig.configApiServerPath+'imagegallerycontentTag/addbatch', imgGallery.selectedItem.ContentTags, 'POST').success(function (response) {
                    console.log(response);
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            imgGallery.addRequested = false;
            imgGallery.treeBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    imgGallery.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        imgGallery.treeBusyIndicator.isActive = true;
        imgGallery.addRequested = true;

               //Save Keywords
        
        //Save inputTags
        imgGallery.selectedItem.ContentTags = [];
        $.each(imgGallery.tags, function (index, item) {
            if (item.id > 0) {
                var newObject = $.extend({}, imgGallery.ModuleContentTag);
                newObject.LinkTagId = item.id;
                newObject.LinkContentId = imgGallery.selectedItem.Id;
                imgGallery.selectedItem.ContentTags.push(newObject);
            }
        });
        imgGallery.addRequested = true;
        imgGallery.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'imagegallerycontent/edit', imgGallery.selectedItem, 'PUT').success(function (response) {
            imgGallery.addRequested = false;
            imgGallery.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //imgGallery.replaceItem(imgGallery.selectedItem.Id, response.Item);
                //imgGallery.gridOptions.fillData(imgGallery.ListItems);
                imgGallery.gridOptions.reGetAll();
                imgGallery.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            imgGallery.addRequested = false;
            imgGallery.treeBusyIndicator.isActive = false;
        });
    }

    //Replace Item OnDelete/OnEdit Grid Options
    imgGallery.replaceItem = function (oldId, newItem) {
        angular.forEach(imgGallery.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = imgGallery.ListItems.indexOf(item);
                imgGallery.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            imgGallery.ListItems.unshift(newItem);
    }

    var buttonIsPressed = false;
    // Open Add Category Modal 
    imgGallery.openAddCategoryModal = function () {
        if (imgGallery.addRequested) { return };
        imgGallery.addRequested = true;
        imgGallery.treeBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryCategory/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            imgGallery.addRequested = false;
            imgGallery.treeBusyIndicator.isActive = false;
            imgGallery.selectedItem = response.Item;
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
                imgGallery.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(imgGallery.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleImageGallery/ImageGalleryCategory/add.html',
                        scope: $scope
                    });
                    imgGallery.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //-----
            //$modal.open({
            //    templateUrl: 'cpanelv1/ModuleImageGallery/ImageGalleryCategory/add.html',
            //    scope: $scope
            //});

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Open Edit Category Modal
    imgGallery.openEditCategoryModal = function () {
        if (imgGallery.addRequested)
            return;
        imgGallery.modalTitle = 'ویرایش';
        if (!imgGallery.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            imgGallery.addRequested = false;
            return;
        }
        imgGallery.addRequested = true;
        imgGallery.treeBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryCategory/GetOne', imgGallery.treeConfig.currentNode.Id, 'GET').success(function (response) {
            imgGallery.addRequested = false;
            imgGallery.treeBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            imgGallery.selectedItem = response.Item;
            //Set dataForTheTree
            imgGallery.selectedNode = [];
            imgGallery.expandedNodes = [];
            imgGallery.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                imgGallery.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(imgGallery.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (imgGallery.selectedItem.LinkMainImageId > 0)
                        imgGallery.onSelection({ Id: imgGallery.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleImageGallery/ImageGalleryCategory/edit.html',
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
            //    templateUrl: 'cpanelv1/ModuleImageGallery/ImageGalleryCategory/edit.html',
            //    scope: $scope
            //});
        }).error(function (data, errCode, c, d) {
            imgGallery.addRequested = false;
            imgGallery.treeBusyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Category
    imgGallery.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        imgGallery.addRequested = true;
        imgGallery.treeBusyIndicator.isActive = true;
        imgGallery.selectedItem.LinkCategorytId = null;
        if (imgGallery.treeConfig.currentNode != null)
            imgGallery.selectedItem.LinkParentId = imgGallery.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryCategory/add', imgGallery.selectedItem, 'POST').success(function (response) {
            imgGallery.treeBusyIndicator.isActive = false;
            imgGallery.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                imgGallery.gridOptions.advancedSearchData.engine.Filters = [];
                imgGallery.gridOptions.reGetAll();
                imgGallery.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            imgGallery.addRequested = false;
            imgGallery.treeBusyIndicator.isActive = false;
        });
    }

    //Edit Category REST Api
    imgGallery.editCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        imgGallery.addRequested = true;
        imgGallery.treeBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryCategory/edit', imgGallery.selectedItem, 'PUT').success(function (response) {
            imgGallery.addRequested = false;
            imgGallery.treeBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                imgGallery.treeConfig.currentNode.Title = response.Item.Title;
                imgGallery.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            imgGallery.addRequested = false;
            imgGallery.treeBusyIndicator.isActive = false;
        });
    }

    // Delete a Category
    imgGallery.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = imgGallery.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                imgGallery.treeBusyIndicator.isActive = true;
                imgGallery.addRequested = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryCategory/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    imgGallery.selectedItemForDelete = response.Item;
                    console.log(imgGallery.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryCategory/delete', imgGallery.selectedItemForDelete, 'POST').success(function (res) {
                        imgGallery.treeBusyIndicator.isActive = false;
                        imgGallery.addRequested = true;
                        if (res.IsSuccess) {
                            //imgGallery.replaceCategoryItem(imgGallery.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully!");
                            imgGallery.gridOptions.advancedSearchData.engine.Filters = null;
                            imgGallery.gridOptions.advancedSearchData.engine.Filters = [];
                            //imgGallery.gridOptions.fillData();
                            imgGallery.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        imgGallery.treeBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    imgGallery.treeBusyIndicator.isActive = false;
                });
            }
        });
    }

    imgGallery.openEditModal = function () {
        if (!imgGallery.selectedRow.item.Id) {
            rashaErManage.showMessage("لطفاً برای ویرایش یک آیتم انتخاب کنید");
            return;
        }
        if (imgGallery.getSelectedItems().length > 1) {
            rashaErManage.showMessage("لطفاً برای ویرایش فقط یک آیتم انتخاب کنید");
            return;
        }
        imgGallery.modalTitle = 'ویرایش';
        ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryContent/GetOne', imgGallery.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            imgGallery.selectedItem = response.Item;
            imgGallery.startDate.defaultDate = imgGallery.selectedItem.FromDate;
            imgGallery.endDate.defaultDate = imgGallery.selectedItem.ToDate;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleImageGallery/ImageGalleryContent/edit.html',
                scope: $scope
            });
            //Load tagsInput
            imgGallery.tags = [];  //Clear out previous tags
            if (imgGallery.selectedItem.ContentTags == null)
                imgGallery.selectedItem.ContentTags = [];
            $.each(imgGallery.selectedItem.ContentTags, function (index, item) {
                if (item.ModuleTag != null)
                    imgGallery.tags.push({ id: item.ModuleTag.Id, text: item.ModuleTag.Title });  //Add current content's tag to tags array with id and title
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    imgGallery.deleteContent = function () {
        if (buttonIsPressed) { return }
        imgGallery.selectedItemsForDelete = [];
        //$('input:checkbox.selector').each(function () {
        //    if (this.checked) {
        //        imgGallery.selectedItemsForDelete.push({ Id: parseInt($(this).val()) });
        //    }
        //});
        imgGallery.selectedItemsForDelete = imgGallery.getSelectedItems();
        if (imgGallery.selectedItemsForDelete.length < 1) {
            if (!imgGallery.selectedRow.item.Id) {
                rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
                return;
            }
            imgGallery.selectedItemsForDelete.push(imgGallery.selectedRow.item);
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                imgGallery.addRequested = true;
                imgGallery.busyIndicator = true;
                var deleteFilterModel = { Filters: [] };
                angular.forEach(imgGallery.selectedItemsForDelete, function (value, key) {
                    var filterDataModel = { PropertyName: "Id", SearchType: 0, IntValue1: value.Id, ClauseType: 1 };
                    deleteFilterModel.Filters.push(filterDataModel);
                });
                //ajax.call(cmsServerConfig.configApiServerPath+"imagegallerycontent/getall", imgGallery.selectedRow.item.Id, "POST").success(function (response) {
                //    rashaErManage.checkAction(response);
                //    imgGallery.selectedItemsForDelete = response.ListItems;
                ajax.call(cmsServerConfig.configApiServerPath+"imagegallerycontent/DeleteFilterModel", deleteFilterModel, 'POST').success(function (res) {
                    rashaErManage.checkAction(res);
                    if (res.IsSuccess) {
                        //imgGallery.replaceItem(imgGallery.selectedItemForDelete.Id);
                        imgGallery.gridOptions.reGetAll();
                    }
                    imgGallery.addRequested = false;
                    imgGallery.busyIndicator = false;
                }).error(function (data2, errCode2, c2, d2) {
                    rashaErManage.checkAction(data2);
                    imgGallery.addRequested = false;
                    imgGallery.busyIndicator = false;
                });
                //}).error(function (data, errCode, c, d) {
                //    rashaErManage.checkAction(data, errCode);
                //});
            }
        });
    }

    imgGallery.closeModal = function () {
        $modalStack.dismissAll();
    }
    imgGallery.closeModalAndGetall = function () {
        $modalStack.dismissAll();
        imgGallery.gridOptions.reGetAll();
    }

    imgGallery.treeConfig.onNodeSelect = function (item) {
        var node = imgGallery.treeConfig.currentNode;
        imgGallery.selectContent(node);

    }
    //Show Content with Category Id
    imgGallery.selectContent = function (node) {
    imgGallery.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            
            imgGallery.attachedFiles = null;
            imgGallery.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryId",
                IntValue1: node.Id,
                SearchType: 0
            }
            imgGallery.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        imgGallery.addRequested = true;
        imgGallery.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ImageGalleryContent/getall", imgGallery.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            imgGallery.addRequested = false;
            imgGallery.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            imgGallery.ListItems = response.ListItems;
            imgGallery.fetchImageURLs(imgGallery.ListItems);
            //imgGallery.gridOptions.fillData(imgGallery.ListItems, response.resultAccess); // Sending Access as an argument
            imgGallery.gridOptions.currentPageNumber = response.CurrentPageNumber;
            imgGallery.gridOptions.totalRowCount = response.TotalRowCount;
            imgGallery.gridOptions.rowPerPage = response.RowPerPage;
            imgGallery.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            //imgGallery.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Open Add New Content Model
    imgGallery.openAddModal = function () {
        if (imgGallery.addRequested) { return };
        var node = imgGallery.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_Please_Select_The_Relevant_Album'));
            imgGallery.addRequested = false;
            return;
        }
        imgGallery.tags = [];   //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
        imgGallery.addRequested = true;
        imgGallery.treeBusyIndicator.isActive = true;
        imgGallery.filePickerMainImage.filename = "";
        imgGallery.filePickerMainImage.fileId = null;
        imgGallery.modalTitle = 'اضافه کردن محتوای جدید';
        ajax.call(cmsServerConfig.configApiServerPath+'imagegallerycontent/GetViewModel', "", 'GET').success(function (response) {
            imgGallery.addRequested = false;
            imgGallery.treeBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            imgGallery.selectedItem = response.Item;
            imgGallery.selectedItem.OtherInfos = [];
            imgGallery.selectedItem.Similars = [];
            imgGallery.clearPreviousData();
            imgGallery.selectedItem.LinkCategoryId = node.Id;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleImageGallery/ImageGalleryContent/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add From Folder Modal 
    imgGallery.openAddFromFolderModal = function (dirSelectable) {
        var node = imgGallery.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_Please_Select_The_Relevant_Album'));
            imgGallery.addRequested = false;
            return;
        }
        imgGallery.dataForTheTree = [];
        imgGallery.selectedNodes = [];
        imgGallery.treeOptions.dirSelectable = dirSelectable;
        imgGallery.treeOptions.multiSelection = !dirSelectable;
        imgGallery.showAddRequestBtn = true;

        var filterModelParentRootFolders = {
            Filters: [{
                PropertyName: "LinkParentId",
                IntValue1: null,
                SearchType: 0,
                IntValueForceNullSearch: true
            }]
        };
        imgGallery.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
            imgGallery.dataForTheTree = response1.ListItems;
            var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
            ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                //imgGallery.dataForTheTree.concat(response2.ListItems);
                Array.prototype.push.apply(imgGallery.dataForTheTree, response2.ListItems);
                $modal.open({
                    templateUrl: 'cpanelv1/ModuleImageGallery/ImageGalleryContent/addFolder.html',
                    scope: $scope
                });
                imgGallery.addRequested = false;
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryContent/GetViewModel', '', 'GET').success(function (response) {
            imgGallery.selectedItem = response.Item;
            imgGallery.selectedItem.FolderId = null;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    imgGallery.gridOptions.pageChanged = function (page) {
        imgGallery.gridOptions.advancedSearchData.engine.CurrentPageNumber = imgGallery.gridOptions.currentPageNumber;
        imgGallery.gridOptions.reGetAll();
    }
    //Reinitiate State
    imgGallery.gridOptions.reGetAll = function () {
        imgGallery.init();
    };

    //Get TotalRowCount
    imgGallery.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"imagegallerycontent/count", imgGallery.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            imgGallery.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            imgGallery.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    imgGallery.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    imgGallery.getSelectedItems = function () {
        var selectedItems = [];
        $('input:checkbox.selector').each(function () {
            if (this.checked) {
                selectedItems.push({ Id: parseInt($(this).val()) });
            }
        });
        return selectedItems;
    }

    imgGallery.fileTypes = [
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

    imgGallery.selectedRow = { item: {} };

    imgGallery.onRowSelected = function (item) {
        console.log("row selected");
        imgGallery.selectedRow.item = item;
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
        if (!imgGallery.checkboxChanged) {
            $("#row" + item.Id).addClass('boxselected').siblings().removeClass('boxselected');
            $("#footer" + item.Id).addClass('boxselected').siblings().removeClass('boxselected');
        }
        imgGallery.checkboxChanged = false;
    }

    imgGallery.checkedChanged = function (item) {
        imgGallery.checkboxChanged = true
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

    imgGallery.openLightBox = function () {
        overlayLink = $(this).attr("href");
        window.startOverlay(overlayLink);
        return false;
    }

    imgGallery.closeLightbox = function () {
        console.log("test");
        $(".container, .overlay").animate({ "opacity": "0" }, 200, linear, function () {
            $(".container, .overlay").remove();
        });
    }

    function startOverlay(overlayLink) {
        $("body").append('<div class="overlay" id="lightbox_overlay" ng-click="imgGallery.closeLightbox()"></div><div class="container"></div>').css({ "overflow-y": "hidden" });
        $(".overlay").animate({ "opacity": "0.6" }, 200, "linear");
        $(".container").html('<img ng-click="imgGallery.closeLightbox()" id="overlay_img" src="' + overlayLink + '" alt="Hello!" />');
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
    imgGallery.clearPreviousData = function() {
      imgGallery.selectedItem.Similars = [];
      $("#to").empty();
    };
    

    imgGallery.moveSelected = function(from, to, calculatePrice) {
      if (from == "Content") {
        //var title = imgGallery.ItemListIdSelector.selectedItem.Title;
        // var optionSelectedPrice = imgGallery.ItemListIdSelector.selectedItem.Price;
        if (
          imgGallery.selectedItem.LinkDestinationId != undefined &&
          imgGallery.selectedItem.LinkDestinationId != null
        ) {
          if (imgGallery.selectedItem.Similars == undefined)
            imgGallery.selectedItem.Similars = [];
          for (var i = 0; i < imgGallery.selectedItem.Similars.length; i++) {
            if (
              imgGallery.selectedItem.Similars[i].LinkDestinationId ==
              imgGallery.selectedItem.LinkDestinationId
            ) {
                rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
              return;
            }
          }
          // if (imgGallery.selectedItem.Title == null || imgGallery.selectedItem.Title.length < 0)
          //     imgGallery.selectedItem.Title = title;
          imgGallery.selectedItem.Similars.push({
            //Id: 0,
            //Source: from,
            LinkDestinationId: imgGallery.selectedItem.LinkDestinationId,
            Destination: imgGallery.LinkDestinationIdSelector.selectedItem
          });
        }
      }
    };
     imgGallery.moveSelectedOtherInfo = function(from, to,y) {

            
             if (imgGallery.selectedItem.OtherInfos == undefined)
                imgGallery.selectedItem.OtherInfos = [];
              for (var i = 0; i < imgGallery.selectedItem.OtherInfos.length; i++) {
              
                if (imgGallery.selectedItem.OtherInfos[i].Title == imgGallery.selectedItemOtherInfos.Title && imgGallery.selectedItem.OtherInfos[i].HtmlBody ==imgGallery.selectedItemOtherInfos.HtmlBody && imgGallery.selectedItem.OtherInfos[i].Source ==imgGallery.selectedItemOtherInfos.Source) 
                {
                  rashaErManage.showMessage($filter('translatentk')('Information_Is_Duplicate'));
                  return;
                }
             
              }
             if (imgGallery.selectedItemOtherInfos.Title == "" && imgGallery.selectedItemOtherInfos.Source =="" && imgGallery.selectedItemOtherInfos.HtmlBody =="")
                {
                    rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
                }
             else
               {
            
             imgGallery.selectedItem.OtherInfos.push({
                Title:imgGallery.selectedItemOtherInfos.Title,
                HtmlBody:imgGallery.selectedItemOtherInfos.HtmlBody,
                Source:imgGallery.selectedItemOtherInfos.Source
              });
              imgGallery.selectedItemOtherInfos.Title="";
              imgGallery.selectedItemOtherInfos.Source="";
              imgGallery.selectedItemOtherInfos.HtmlBody="";
             }
             if(edititem)
               { 
                   edititem=false; 
               }
              
        };

    imgGallery.removeFromCollection = function(listsimilar,iddestination) {
      for (var i = 0; i < imgGallery.selectedItem.Similars.length; i++) 
       {       
            if(listsimilar[i].LinkDestinationId==iddestination)
            {
                imgGallery.selectedItem.Similars.splice(i, 1);
                return;
            }
          
      }
      
    };
   imgGallery.removeFromOtherInfo = function(listOtherInfo,title,body,source) {
    for (var i = 0; i < imgGallery.selectedItem.OtherInfos.length; i++) 
       {       
            if(listOtherInfo[i].Title==title && listOtherInfo[i].HtmlBody==body && listOtherInfo[i].Source==source)
            {
              imgGallery.selectedItem.OtherInfos.splice(i, 1);
              return;
            }
       }
    };
   imgGallery.editOtherInfo = function(y) {
      edititem=true;
      imgGallery.selectedItemOtherInfos.Title=y.Title;
      imgGallery.selectedItemOtherInfos.HtmlBody=y.HtmlBody;
      imgGallery.selectedItemOtherInfos.Source=y.Source;
      imgGallery.removeFromOtherInfo(imgGallery.selectedItem.OtherInfos,y.Title,y.HtmlBody,y.Source);
    };


    //#help
    //TreeControl 
    imgGallery.treeOptions = {
        nodeChildren: "Children",
        multiSelection: true,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (imgGallery.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: true
    }

    imgGallery.onNodeToggle = function (node, expanded) {
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

    imgGallery.onSelection = function (node, selected) {
    }

    imgGallery.addFromFolder = function () {
        if (imgGallery.selectedNode == undefined && imgGallery.treeOptions.dirSelectable) {
            rashaErManage.showMessage("هیج فولدری انتخاب نشده است");
            return;
        }
        if (imgGallery.treeOptions.dirSelectable && imgGallery.selectedNode.Title == undefined) {
            rashaErManage.showMessage("هیج فولدری انتخاب نشده است");
            return;
        }
        if (imgGallery.selectedNodes.length < 1 && !imgGallery.treeOptions.dirSelectable) {
            rashaErManage.showMessage("هیج فایلی انتخاب نشده است");
            return;
        }
        var selectedFolder = imgGallery.selectedNode;

        imgGallery.contentsToAdd = [];
        $("#treecontrol").fadeOut("slow");
        $("#addRequests").fadeIn("slow");
        imgGallery.addRequested = true;
        if (imgGallery.treeOptions.dirSelectable) {
            ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", selectedFolder.Id, 'POST').success(function (response) {
                angular.forEach(response.ListItems, function (value, key) {
                    var newObject = jQuery.extend({}, imgGallery.selectedItem);   //#Clone a Javascript Object
                    newObject.LinkFileId = value.Id;
                    newObject.Title = value.FileName;
                    newObject.LinkCategoryId = imgGallery.treeConfig.currentNode.Id;
                    imgGallery.contentsToAdd.push(newObject);
                });
                angular.forEach(imgGallery.contentsToAdd, function (value, key) {
                    ajax.call(cmsServerConfig.configApiServerPath+"imagegallerycontent/add", value, 'POST').success(function (response) {
                        value.addIsSuccess = response.IsSuccess;
                        value.addErrorMessage = response.ErrorMessage;
                    }).error(function (data, errCode, c, d) {
                        console.log(data);
                    });
                });
                imgGallery.addRequested = false;
                imgGallery.showAddRequestBtn = false;
                imgGallery.closeModal();
                $state.reload();
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
        }
        else {
            angular.forEach(imgGallery.selectedNodes, function (value, key) {
                var newObject = jQuery.extend({}, imgGallery.selectedItem);   //#Clone a Javascript Object
                newObject.LinkFileId = value.Id;
                newObject.Title = value.FileName;
                newObject.LinkCategoryId = imgGallery.treeConfig.currentNode.Id;
                imgGallery.contentsToAdd.push(newObject);
            });
            angular.forEach(imgGallery.contentsToAdd, function (value, key) {
                ajax.call(cmsServerConfig.configApiServerPath+"imagegallerycontent/add", value, 'POST').success(function (response) {
                    value.addIsSuccess = response.IsSuccess;
                    value.addErrorMessage = response.ErrorMessage;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            });
            imgGallery.closeModal();
            $state.reload();
            imgGallery.addRequested = false;
            imgGallery.showAddRequestBtn = false;
        }
    }
    //TreeControl


    //TreeControl
    imgGallery.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (imgGallery.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    imgGallery.onNodeToggle = function (node, expanded) {
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

    imgGallery.onSelection = function (node, selected) {
        if (!selected) {
            imgGallery.selectedItem.LinkMainImageId = null;
            imgGallery.selectedItem.previewImageSrc = null;
            return;
        }
        imgGallery.selectedItem.LinkMainImageId = node.Id;
        imgGallery.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            imgGallery.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl

    //Export Report 
    imgGallery.exportFile = function () {
        imgGallery.gridOptions.advancedSearchData.engine.ExportFile = imgGallery.ExportFileClass;
        imgGallery.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'imagegallerycontent/exportfile', imgGallery.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            imgGallery.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                imgGallery.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //imgGallery.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    imgGallery.toggleExportForm = function () {
        imgGallery.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        imgGallery.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        imgGallery.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        imgGallery.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        imgGallery.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleImageGallery/ImageGalleryContent/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    imgGallery.rowCountChanged = function () {
        if (!angular.isDefined(imgGallery.ExportFileClass.RowCount) || imgGallery.ExportFileClass.RowCount > 5000)
            imgGallery.ExportFileClass.RowCount = 5000;
    }
}]);