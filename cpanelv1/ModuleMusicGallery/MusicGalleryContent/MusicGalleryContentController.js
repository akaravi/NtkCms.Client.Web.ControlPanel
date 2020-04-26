app.controller("musicGalleryCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', '$timeout', '$window','$stateParams', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, $timeout, $window,$stateParams, $filter) {

    var mscGallery = this;

    if (itemRecordStatus != undefined) mscGallery.itemRecordStatus = itemRecordStatus;
    //Tree Config
    mscGallery.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    }
    // Initilize In Init();
    mscGallery.treeConfig.currentNode = {};
    mscGallery.selectedContentId = { Id: $stateParams.ContentId ,TitleTag:$stateParams.TitleTag };
    mscGallery.treeBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری آلبوم ها ..."
    }
    mscGallery.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    mscGallery.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    mscGallery.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:mscGallery.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:mscGallery,
        useCurrentLocationZoom:12,
    }
   var date = moment().format();
    //mscGallery.selectedItem.ToDate = date;
    mscGallery.datePickerConfig = {
        defaultDate: date
    };
    mscGallery.startDate = {
        defaultDate: date
    }
    mscGallery.endDate = {
        defaultDate: date
    }
    mscGallery.filePicker = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
        extension: "mp3,wma"
    }
    //#tagsInput -----
    //mscGallery.onTagAdded = function (tag) {
    //    if (!angular.isDefined(tag.id)) {    //Check if this a new or a existing tag (existing tags comprise with an id)
    //        var tagObject = jQuery.extend({}, mscGallery.ModuleTag);   //#Clone a Javascript Object
    //        tagObject.Title = tag.text;
    //        ajax.call('/api/MusicGalleryTag/add', tagObject, 'POST').success(function (response) {
    //            rashaErManage.checkAction(response);
    //            if (response.IsSuccess) {
    //                mscGallery.tags[mscGallery.tags.length - 1] = { id: response.Item.Id, text: response.Item.Title };  //Replace the newly added tag (last in the array) with a new object including its Id
    //            }
    //        }).error(function (data, errCode, c, d) {
    //            rashaErManage.checkAction(data, errCode);
    //        });
    //    }
    //}

    mscGallery.init = function () {
        mscGallery.treeBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"MusicGalleryCategory/getall", {}, 'POST').success(function (response) {
            mscGallery.treeConfig.Items = response.ListItems;
            mscGallery.treeBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        filterModel = { PropertyName: "ContentTags",PropertyAnyName:"LinkTagId", SearchType: 0, IntValue1: mscGallery.selectedContentId.Id };
        if (mscGallery.selectedContentId.Id >0)
            mscGallery.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
        ajax.call(cmsServerConfig.configApiServerPath+"MusicGalleryContent/getall", mscGallery.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            mscGallery.ListItems = response.ListItems;
            mscGallery.fetchImageURLs(mscGallery.ListItems);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    mscGallery.fetchImageURLs = function (listItems) {
        //fetch MainImage Srcs
        var modelList = [];
        angular.forEach(listItems, function (value, key) {
            modelList.push({ id: value.LinkMainImageId, name: null });
        });
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewThumbnailImages", modelList, "POST").success(function (response2) {
            rashaErManage.checkAction(response2);
            angular.forEach(listItems, function (value1, key1) {
                var keepGoing = true;
                angular.forEach(response2.ListItems, function (value2, key2) {
                    if (keepGoing)
                        if (value1.LinkMainImageId == value2.id) {
                            value1.MainImageSrc = $window.location.origin + value2.name;
                            keepGoing = false;
                        }
                });
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    mscGallery.openUpload = function () {
        mscGallery.modalTitle = "آپلود فایل";
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGallery/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            mscGallery.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMusicGallery/cmsMusicGallery/upload.html',
                scope: $scope,
                size: 'lg'
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
//#help/ سلکتور similar
    mscGallery.LinkDestinationIdSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkDestinationId",
      url: "MusicGalleryContent",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: mscGallery,
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
mscGallery.LinkCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryId',
        url: 'MusicGalleryCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: mscGallery,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' }
            ]
        }
    }
    //Blog Grid Options
    mscGallery.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'Description', displayName: 'عنوان توضیحات', sortable: true, type: 'string', visible: 'true' },
            { name: 'FromDate', displayName: 'تاریخ آغاز', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'ToDate', displayName: 'تاریخ پایان', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: "ActionKey", displayName: 'افزودن به منو', displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="mscGallery.addMenu()"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
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
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: [],
                Count: false
            }
        }
    }
    mscGallery.gridOptions.advancedSearchData.engine.Filters = null;
    mscGallery.gridOptions.advancedSearchData.engine.Filters = [];

    mscGallery.isCurrentNodeEmpty = function () {
        return !angular.equals({}, mscGallery.treeConfig.currentNode);
    }

    mscGallery.loadFileAndFolder = function (item) {
        mscGallery.treeConfig.currentNode = item;
        console.log(item);
        mscGallery.treeConfig.onNodeSelect(item);
    }

    mscGallery.openNewFolder = function () {
        mscGallery.modalTitle = "ایجاد شاخه جدید";
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryCategory/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            mscGallery.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMusicGallery/cmsMusicGallery/folder.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    mscGallery.getGalleriesByCategory = function (id) {
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGallery/GetOne', id, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            mscGallery.selectedItems = response.Items;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMusicGallery/cmsMusicGallery/folder.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    mscGallery.uploadFile = function () {
        //mscGallery.processQueue();
        mscGallery.treeConfig.processDropzone();
    };

    mscGallery.reset = function () {
        //mscGallery.resetDropzone();
        mscGallery.treeConfig.resetDropzone();
    };

    //open statistics
    mscGallery.Showstatistics = function () {
        if (!mscGallery.selectedRow.item.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGallerycontent/GetOne', mscGallery.selectedRow.item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            mscGallery.selectedItem = response1.Item;
            $modal.open({
                templateUrl: "cpanelv1/ModuleMusicGallery/MusicGalleryContent/statistics.html",
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    mscGallery.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        mscGallery.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGallerycontent/add', mscGallery.selectedItem, 'POST').success(function (response) {
            mscGallery.addRequested = false;
            rashaErManage.checkAction(response);
            mscGallery.treeBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                //mscGallery.ListItems.unshift(response.Item);
                //mscGallery.gridOptions.fillData(mscGallery.ListItems);
                mscGallery.ListItems.push(response.Item);
                mscGallery.closeModal();
                //Save inputTags
                mscGallery.selectedItem.ContentTags = [];
                $.each(mscGallery.tags, function (index, item) {
                    if (item.id > 0) {
                        var newObject = $.extend({}, mscGallery.ModuleContentTag);
                        newObject.LinkTagId = item.id;
                        newObject.LinkContentId = response.Item.Id;
                        mscGallery.selectedItem.ContentTags.push(newObject);
                    }
                });
                ajax.call(cmsServerConfig.configApiServerPath+'MusicGallerycontentTag/addbatch', mscGallery.selectedItem.ContentTags, 'POST').success(function (response) {
                    console.log(response);
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mscGallery.addRequested = false;
            mscGallery.treeBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    mscGallery.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        mscGallery.treeBusyIndicator.isActive = true;
        mscGallery.addRequested = true;

        //Save inputTags
        mscGallery.selectedItem.ContentTags = [];
        $.each(mscGallery.tags, function (index, item) {
            if (item.id > 0) {
                var newObject = $.extend({}, mscGallery.ModuleContentTag);
                newObject.LinkTagId = item.id;
                newObject.LinkContentId = mscGallery.selectedItem.Id;
                mscGallery.selectedItem.ContentTags.push(newObject);
            }
        });
        //Save inputTags
        mscGallery.selectedItem.ContentTags = [];
        $.each(mscGallery.tags, function (index, item) {
            var newObject = $.extend({}, mscGallery.ModuleContentTag);
            newObject.LinkTagId = item.id;
            newObject.LinkContentId = mscGallery.selectedItem.Id;
            mscGallery.selectedItem.ContentTags.push(newObject);
        });
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGallerycontent/edit', mscGallery.selectedItem, 'PUT').success(function (response) {
            mscGallery.treeBusyIndicator.isActive = false;
            mscGallery.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                mscGallery.replaceItem(mscGallery.selectedItem.Id, response.Item);
                //mscGallery.gridOptions.fillData(mscGallery.ListItems);
                mscGallery.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mscGallery.addRequested = false;
            mscGallery.treeBusyIndicator.isActive = false;
        });
    }

    //Replace Item OnDelete/OnEdit Grid Options
    mscGallery.replaceItem = function (oldId, newItem) {
        angular.forEach(mscGallery.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = mscGallery.ListItems.indexOf(item);
                mscGallery.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            mscGallery.ListItems.unshift(newItem);
    }

    var buttonIsPressed = false;
    // Open Add Category Modal 
    mscGallery.openAddCategoryModal = function () {
        if (mscGallery.addRequested) { return };
        mscGallery.addRequested = true;
        mscGallery.treeBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryCategory/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            mscGallery.addRequested = false;
            mscGallery.treeBusyIndicator.isActive = false;
            mscGallery.selectedItem = response.Item;
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
                mscGallery.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(mscGallery.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleMusicGallery/MusicGalleryCategory/add.html',
                        scope: $scope
                    });
                    mscGallery.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //-----
            //$modal.open({
            //    templateUrl: 'cpanelv1/ModuleMusicGallery/MusicGalleryCategory/add.html',
            //    scope: $scope
            //});

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Category Modal
    mscGallery.openEditCategoryModal = function () {
        if (buttonIsPressed) { return };
        mscGallery.addRequested = false;
        mscGallery.modalTitle = 'ویرایش';
        if (!mscGallery.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Category_To_Edit'));
            return;
        }
        mscGallery.treeBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryCategory/GetOne', mscGallery.treeConfig.currentNode.Id, 'GET').success(function (response) {
            mscGallery.addRequested = false;
            mscGallery.treeBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            mscGallery.selectedItem = response.Item;
            //Set dataForTheTree
            mscGallery.selectedNode = [];
            mscGallery.expandedNodes = [];
            mscGallery.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                mscGallery.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(mscGallery.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (mscGallery.selectedItem.LinkMainImageId > 0)
                        mscGallery.onSelection({ Id: mscGallery.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleMusicGallery/MusicGalleryCategory/edit.html',
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
            //    templateUrl: 'cpanelv1/ModuleMusicGallery/MusicGalleryCategory/edit.html',
            //    scope: $scope
            //});
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Category
    mscGallery.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        mscGallery.addRequested = true;
        mscGallery.selectedItem.LinkCategorytId = null;
        if (mscGallery.treeConfig.currentNode != null)
            mscGallery.selectedItem.LinkParentId = mscGallery.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryCategory/add', mscGallery.selectedItem, 'POST').success(function (response) {
            mscGallery.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                mscGallery.gridOptions.advancedSearchData.engine.Filters = [];
                mscGallery.gridOptions.reGetAll();
                mscGallery.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mscGallery.addRequested = false;
            mscGallery.treeBusyIndicator.isActive = false;
        });
    }

    // Add New Category
    mscGallery.addFromFolder = function (frm) {
        var node = mscGallery.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_Please_Select_The_Relevant_Album'));
            mscGallery.addRequested = false;
            return;
        }
        mscGallery.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetFilesFromCategory', mscGallery.selectedItem.FolderId, 'POST').success(function (response) {
            mscGallery.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                if (response.ListItems.length > 0) {
                    mscGallery.filesFromFolder = response.ListItems;
                    //setInterval(function () {
                    angular.forEach(mscGallery.filesFromFolder, function (value, key) {
                        mscGallery.selectedItem.LinkFileId = value.Id;
                        mscGallery.selectedItem.Title = value.FileName;
                        mscGallery.selectedItem.LinkCategoryId = node.Id;
                        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryContent/add', mscGallery.selectedItem, 'POST').success(function (response) {
                            rashaErManage.checkAction(response);
                            value.addIsSuccess = null;
                            if (response.IsSuccess) {
                                value.addIsSuccess = true;
                            }
                            else {
                                value.addIsSuccess = false;
                            }
                        }).error(function (data, errCode, c, d) {
                            rashaErManage.checkAction(data, errCode);
                            mscGallery.addRequested = false;
                            mscGallery.treeBusyIndicator.isActive = false;
                        });
                    });
                    //}, 1000);
                } else {
                    mscGallery.errorMessage = "کد سیستمی پوشه اشتباه است یا پوشه خالی است";
                    console.log(mscGallery.errorMessage);
                }
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mscGallery.addRequested = false;
            mscGallery.treeBusyIndicator.isActive = false;
        });
    }

    //Edit Category REST Api
    mscGallery.editCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        mscGallery.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryCategory/edit', mscGallery.selectedItem, 'PUT').success(function (response) {
            mscGallery.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                mscGallery.treeConfig.currentNode.Title = response.Item.Title;
                mscGallery.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mscGallery.addRequested = false;
        });
    }

    // Delete a Category
    mscGallery.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = mscGallery.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                mscGallery.treeBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryCategory/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    mscGallery.selectedItemForDelete = response.Item;
                    console.log(mscGallery.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryCategory/delete', mscGallery.selectedItemForDelete, 'POST').success(function (res) {
                        mscGallery.treeBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //mscGallery.replaceCategoryItem(mscGallery.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully!");
                            mscGallery.gridOptions.advancedSearchData.engine.Filters = null;
                            mscGallery.gridOptions.advancedSearchData.engine.Filters = [];
                            //mscGallery.gridOptions.fillData();
                            mscGallery.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        mscGallery.treeBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    mscGallery.treeBusyIndicator.isActive = false;
                });
            }
        });
    }

    // Open Add From Folder Modal 
    mscGallery.openAddFromFolderModal = function () {
        if (mscGallery.addRequested) { return };
        mscGallery.addRequested = true;
        mscGallery.dataForTheTree = [];
        var filterModelParentRootFolders = {
            Filters: [{
                PropertyName: "LinkParentId",
                IntValue1: null,
                SearchType: 0,
                IntValueForceNullSearch: true
            }]
        };

        ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/GetAll", filterModelParentRootFolders, 'POST').success(function (response1) {
            mscGallery.dataForTheTree = response1.ListItems;
            var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
            ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) {
                //mscGallery.dataForTheTree.concat(response2.ListItems);
                Array.prototype.push.apply(mscGallery.dataForTheTree, response2.ListItems);
                $modal.open({
                    templateUrl: 'cpanelv1/ModuleMusicGallery/MusicGalleryContent/addFolder.html',
                    scope: $scope
                });
                mscGallery.addRequested = false;
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryContent/GetViewModel', '', 'GET').success(function (response) {
            mscGallery.selectedItem = response.Item;
            mscGallery.selectedItem.FolderId = null;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    mscGallery.openEditModal = function () {
        if (!mscGallery.selectedRow.item.Id) {
            rashaErManage.showMessage("لطفاً برای ویرایش یک آیتم انتخاب کنید");
            return;
        }
        if (mscGallery.getSelectedItems().length > 1) {
            rashaErManage.showMessage("لطفاً برای ویرایش فقط یک آیتم انتخاب کنید");
            return;
        }
        mscGallery.modalTitle = 'ویرایش';
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryContent/GetOne', mscGallery.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            mscGallery.selectedItem = response.Item;
            mscGallery.startDate.defaultDate = mscGallery.selectedItem.FromDate;
            mscGallery.endDate.defaultDate = mscGallery.selectedItem.ToDate;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMusicGallery/MusicGalleryContent/edit.html',
                scope: $scope
            });
            //Load tagsInput
            mscGallery.tags = [];  //Clear out previous tags
            if (mscGallery.selectedItem.ContentTags == null)
                mscGallery.selectedItem.ContentTags = [];
            if (mscGallery.selectedItem.ContentTags != null)
                $.each(mscGallery.selectedItem.ContentTags, function (index, item) {
                    if (item.ModuleTag != null)
                        mscGallery.tags.push({ id: item.ModuleTag.Id, text: item.ModuleTag.Title });  //Add current content's tag to tags array with id and title
                });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    mscGallery.deleteContent = function () {
        if (buttonIsPressed) { return }
        mscGallery.selectedItemsForDelete = [];
        mscGallery.selectedItemsForDelete = mscGallery.getSelectedItems();
        if (mscGallery.selectedItemsForDelete.length < 1) {
            if (!mscGallery.selectedRow.item.Id) {
                rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
                return;
            }
            mscGallery.selectedItemsForDelete.push(mscGallery.selectedRow.item);
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                var deleteFilterModel = { Filters: [] };
                angular.forEach(mscGallery.selectedItemsForDelete, function (value, key) {
                    var filterDataModel = { PropertyName: "Id", SearchType: 0, IntValue1: value.Id, ClauseType: 1 };
                    deleteFilterModel.Filters.push(filterDataModel);
                });
                ajax.call(cmsServerConfig.configApiServerPath+"musicgallerycontent/DeleteFilterModel", deleteFilterModel, 'POST').success(function (res) {
                    rashaErManage.checkAction(res);
                    if (res.IsSuccess) {
                        mscGallery.gridOptions.reGetAll();
                    }
                }).error(function (data2, errCode2, c2, d2) {
                    rashaErManage.checkAction(data2);
                });
            }
        });
    }

    mscGallery.closeModal = function () {
        $modalStack.dismissAll();
    }

    mscGallery.treeConfig.onNodeSelect = function (item) {
        var node = mscGallery.treeConfig.currentNode;
        mscGallery.selectedItem.LinkCategoryId = node.Id;
        mscGallery.selectContent(node);
    }
    //Show Content with Category Id
    mscGallery.selectContent = function (node) {
        mscGallery.gridOptions.advancedSearchData.engine.Filters = [];
        mscGallery.attachedFiles = null;
        mscGallery.attachedFiles = [];
        var s = {
            PropertyName: "LinkCategoryId",
            IntValue1: node.Id,
            SearchType: 0
        }
        mscGallery.gridOptions.advancedSearchData.engine.Filters.push(s);
        mscGallery.treeBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"MusicGalleryContent/getall", mscGallery.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            mscGallery.treeBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            mscGallery.ListItems = response.ListItems;
            //mscGallery.gridOptions.fillData(mscGallery.ListItems, response.resultAccess); // Sending Access as an argument
            mscGallery.fetchImageURLs(mscGallery.ListItems);
            mscGallery.gridOptions.currentPageNumber = response.CurrentPageNumber;
            mscGallery.gridOptions.totalRowCount = response.TotalRowCount;
            mscGallery.gridOptions.rowPerPage = response.RowPerPage;
            mscGallery.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            //mscGallery.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Open Add New Content Model
    mscGallery.openAddModal = function () {
        if (mscGallery.addRequested) { return };
        var node = mscGallery.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_Please_Select_The_Relevant_Album'));
            mscGallery.addRequested = false;
            return;
        }
        mscGallery.tags = [];   //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
        mscGallery.addRequested = true;
        mscGallery.treeBusyIndicator.isActive = true;
        mscGallery.filePicker.filename = "";
        mscGallery.filePicker.fileId = null;
        mscGallery.modalTitle = 'اضافه کردن محتوای جدید';
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGallerycontent/GetViewModel', "", 'GET').success(function (response) {
            mscGallery.addRequested = false;
            mscGallery.treeBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            mscGallery.selectedItem = response.Item;
            mscGallery.selectedItem.OtherInfos = [];
            mscGallery.selectedItem.Similars = [];
            mscGallery.clearPreviousData();
            mscGallery.selectedItem.LinkCategoryId = node.Id;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMusicGallery/MusicGalleryContent/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    mscGallery.gridOptions.pageChanged = function (page) {
        mscGallery.gridOptions.advancedSearchData.engine.CurrentPageNumber = mscGallery.gridOptions.currentPageNumber;
        mscGallery.gridOptions.reGetAll();
    }
    //Reinitiate State
    mscGallery.gridOptions.reGetAll = function () {
        mscGallery.init();
    };

    mscGallery.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    mscGallery.getSelectedItems = function () {
        var selectedItems = [];
        $('input:checkbox.selector').each(function () {
            if (this.checked) {
                selectedItems.push({ Id: parseInt($(this).val()) });
            }
        });
        return selectedItems;
    }

    mscGallery.fileTypes = [
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

    mscGallery.selectedRow = { item: {} };

    mscGallery.onRowSelected = function (item) {
        mscGallery.selectedRow.item = item;
        $("#row" + item.Id).addClass('boxselected').siblings().removeClass('boxselected');
        if ($("#selector" + item.Id).is(':checked'))
            $("#selector" + item.Id).prop('checked', false);
        else
            $("#selector" + item.Id).prop('checked', true);
    }

    mscGallery.openLightBox = function () {
        overlayLink = $(this).attr("href");
        window.startOverlay(overlayLink);
        return false;
    }

    mscGallery.closeLightbox = function () {
        console.log("test");
        $(".container, .overlay").animate({ "opacity": "0" }, 200, linear, function () {
            $(".container, .overlay").remove();
        });
    }

    function startOverlay(overlayLink) {
        $("body").append('<div class="overlay" id="lightbox_overlay" ng-click="mscGallery.closeLightbox()"></div><div class="container"></div>').css({ "overflow-y": "hidden" });
        $(".overlay").animate({ "opacity": "0.6" }, 200, "linear");
        $(".container").html('<img ng-click="mscGallery.closeLightbox()" id="overlay_img" src="' + overlayLink + '" alt="Hello!" />');
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

    mscGallery.treeOptions = {
        nodeChildren: "Children",
        multiSelection: true,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        dirSelectable: true
        //injectClasses: {
        //    "ul": "c-ul",
        //    "li": "c-li",
        //    "liSelected": "c-liSelected",
        //    "iExpanded": "c-iExpanded",
        //    "iCollapsed": "c-iCollapsed",
        //    "iLeaf": "c-iLeaf",
        //    "label": "c-label",
        //    "labelSelected": "c-labelSelected"
        //}
    }

    mscGallery.onNodeToggle = function (node, expanded) {
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
    mscGallery.columnCheckbox = false;
    mscGallery.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (mscGallery.gridOptions.columnCheckbox) {
            for (var i = 0; i < mscGallery.gridOptions.columns.length; i++) {
                //mscGallery.gridOptions.columns[i].visible = $("#" + mscGallery.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + mscGallery.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                mscGallery.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = mscGallery.gridOptions.columns;
            for (var i = 0; i < mscGallery.gridOptions.columns.length; i++) {
                mscGallery.gridOptions.columns[i].visible = true;
                var element = $("#" + mscGallery.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + mscGallery.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < mscGallery.gridOptions.columns.length; i++) {
            console.log(mscGallery.gridOptions.columns[i].name.concat(".visible: "), mscGallery.gridOptions.columns[i].visible);
        }
        mscGallery.gridOptions.columnCheckbox = !mscGallery.gridOptions.columnCheckbox;
    }
    //Export Report 
    mscGallery.exportFile = function () {
        mscGallery.addRequested = true;
        mscGallery.gridOptions.advancedSearchData.engine.ExportFile = mscGallery.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryContent/exportfile', mscGallery.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            mscGallery.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                mscGallery.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //mscGallery.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    mscGallery.toggleExportForm = function () {
        mscGallery.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        mscGallery.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        mscGallery.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        mscGallery.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        mscGallery.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleMusicGallery/MusicGalleryContent/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    mscGallery.rowCountChanged = function () {
        if (!angular.isDefined(mscGallery.ExportFileClass.RowCount) || mscGallery.ExportFileClass.RowCount > 5000)
            mscGallery.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    mscGallery.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"MusicGalleryContent/count", mscGallery.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            mscGallery.addRequested = false;
            rashaErManage.checkAction(response);
            mscGallery.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            mscGallery.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
//#help similar & otherinfo
    mscGallery.clearPreviousData = function() {
      mscGallery.selectedItem.Similars = [];
      $("#to").empty();
    };
    

    mscGallery.moveSelected = function(from, to, calculatePrice) {
      if (from == "Content") {
        //var title = mscGallery.ItemListIdSelector.selectedItem.Title;
        // var optionSelectedPrice = mscGallery.ItemListIdSelector.selectedItem.Price;
        if (
          mscGallery.selectedItem.LinkDestinationId != undefined &&
          mscGallery.selectedItem.LinkDestinationId != null
        ) {
          if (mscGallery.selectedItem.Similars == undefined)
            mscGallery.selectedItem.Similars = [];
          for (var i = 0; i < mscGallery.selectedItem.Similars.length; i++) {
            if (
              mscGallery.selectedItem.Similars[i].LinkDestinationId ==
              mscGallery.selectedItem.LinkDestinationId
            ) {
              rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
              return;
            }
          }
          // if (mscGallery.selectedItem.Title == null || mscGallery.selectedItem.Title.length < 0)
          //     mscGallery.selectedItem.Title = title;
          mscGallery.selectedItem.Similars.push({
            //Id: 0,
            //Source: from,
            LinkDestinationId: mscGallery.selectedItem.LinkDestinationId,
            Destination: mscGallery.LinkDestinationIdSelector.selectedItem
          });
        }
      }
    };
     mscGallery.moveSelectedOtherInfo = function(from, to,y) {

            
             if (mscGallery.selectedItem.OtherInfos == undefined)
                mscGallery.selectedItem.OtherInfos = [];
              for (var i = 0; i < mscGallery.selectedItem.OtherInfos.length; i++) {
              
                if (mscGallery.selectedItem.OtherInfos[i].Title == mscGallery.selectedItemOtherInfos.Title && mscGallery.selectedItem.OtherInfos[i].HtmlBody ==mscGallery.selectedItemOtherInfos.HtmlBody && mscGallery.selectedItem.OtherInfos[i].Source ==mscGallery.selectedItemOtherInfos.Source) 
                {
                  rashaErManage.showMessage($filter('translatentk')('Information_Is_Duplicate'));
                  return;
                }
             
              }
             if (mscGallery.selectedItemOtherInfos.Title == "" && mscGallery.selectedItemOtherInfos.Source =="" && mscGallery.selectedItemOtherInfos.HtmlBody =="")
                {
                    rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
                }
             else
               {
            
             mscGallery.selectedItem.OtherInfos.push({
                Title:mscGallery.selectedItemOtherInfos.Title,
                HtmlBody:mscGallery.selectedItemOtherInfos.HtmlBody,
                Source:mscGallery.selectedItemOtherInfos.Source
              });
              mscGallery.selectedItemOtherInfos.Title="";
              mscGallery.selectedItemOtherInfos.Source="";
              mscGallery.selectedItemOtherInfos.HtmlBody="";
             }
             if(edititem)
               { 
                   edititem=false; 
               }
              
        };

    mscGallery.removeFromCollection = function(listsimilar,iddestination) {
      for (var i = 0; i < mscGallery.selectedItem.Similars.length; i++) 
       {       
            if(listsimilar[i].LinkDestinationId==iddestination)
            {
                mscGallery.selectedItem.Similars.splice(i, 1);
                return;
            }
          
      }
      
    };
   mscGallery.removeFromOtherInfo = function(listOtherInfo,title,body,source) {
    for (var i = 0; i < mscGallery.selectedItem.OtherInfos.length; i++) 
       {       
            if(listOtherInfo[i].Title==title && listOtherInfo[i].HtmlBody==body && listOtherInfo[i].Source==source)
            {
              mscGallery.selectedItem.OtherInfos.splice(i, 1);
              return;
            }
       }
    };
   mscGallery.editOtherInfo = function(y) {
      edititem=true;
      mscGallery.selectedItemOtherInfos.Title=y.Title;
      mscGallery.selectedItemOtherInfos.HtmlBody=y.HtmlBody;
      mscGallery.selectedItemOtherInfos.Source=y.Source;
      mscGallery.removeFromOtherInfo(mscGallery.selectedItem.OtherInfos,y.Title,y.HtmlBody,y.Source);
    };


    //#help
    //TreeControl
    mscGallery.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (mscGallery.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    mscGallery.onNodeToggle = function (node, expanded) {
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

    mscGallery.onSelection = function (node, selected) {
        if (!selected) {
            mscGallery.selectedItem.LinkMainImageId = null;
            mscGallery.selectedItem.previewImageSrc = null;
            return;
        }
        mscGallery.selectedItem.LinkMainImageId = node.Id;
        mscGallery.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            mscGallery.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);