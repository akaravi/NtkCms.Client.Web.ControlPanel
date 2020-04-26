app.controller("imgGalleryTagCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window','$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window,$state, $filter) {
    var imgGalleryTag = this;
    var edititem=false;
    //For Grid Options
    imgGalleryTag.gridOptions = {};
    imgGalleryTag.selectedItem = {};
    imgGalleryTag.attachedFiles = [];
    imgGalleryTag.attachedFile = "";
    var todayDate = moment().format();
    imgGalleryTag.DateBirth = {
        defaultDate: todayDate,
        viewTimePicker: true
    }
    imgGalleryTag.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }

    imgGalleryTag.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    imgGalleryTag.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    imgGalleryTag.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:imgGalleryTag.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:imgGalleryTag,
        useCurrentLocationZoom:12,
    }
    if (itemRecordStatus != undefined) imgGalleryTag.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    imgGalleryTag.selectedItem.ToDate = date;
    imgGalleryTag.datePickerConfig = {
        defaultDate: date
    };
    imgGalleryTag.startDate = {
        defaultDate: date
    }
    imgGalleryTag.endDate = {
        defaultDate: date
    }
    imgGalleryTag.count = 0;

//#help/ سلکتور دسته بندی در ویرایش محتوا
 imgGalleryTag.LinkCategoryTagIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryTagId',
        url: 'imgGalleryCategoryTag',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: imgGalleryTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' }
            ]
        }
    }

    //imgGallery Grid Options
    imgGalleryTag.gridOptions = {
        columns: [
            { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: "ActionKey", displayName: "لیست مطالب", displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="imgGalleryTag.OpenContentTag(x.Id,x.Title)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }

    //Comment Grid Options
    imgGalleryTag.gridContentOptions = {
        columns: [
           { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
           { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
           { name: 'Writer', displayName: 'نویسنده', sortable: true, type: 'string' },
           { name: 'Comment', displayName: 'کامنت', sortable: true, type: 'string' },
           { name: 'ActionButtons', displayName: 'کلید عملیاتی', template: '<Button ng-if="!x.IsActivated" ng-click="imgGalleryTag.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button><Button ng-if="x.IsActivated" ng-click="imgGalleryTag.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button><Button ng-click="imgGalleryTag.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>' },
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
    imgGalleryTag.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show imgGallery Loading Indicator
    imgGalleryTag.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    imgGalleryTag.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    imgGalleryTag.OpenContentTag = function (LinkTagContentId,TitleTag) {
                $state.go("index.imgGallerycontent", {
            ContentId: LinkTagContentId,
            TitleTag:TitleTag
        });
    }
    imgGalleryTag.treeConfig.currentNode = {};
    imgGalleryTag.treeBusyIndicator = false;
    imgGalleryTag.addRequested = false;
    imgGalleryTag.showGridComment = false;
    imgGalleryTag.imgGalleryTitle = "";

    //init Function
    imgGalleryTag.init = function () {
        imgGalleryTag.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"imgGalleryCategorytag/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            imgGalleryTag.treeConfig.Items = response.ListItems;
            imgGalleryTag.treeConfig.Items = response.ListItems;
            imgGalleryTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"imgGallerytag/getall", imgGalleryTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            imgGalleryTag.ListItems = response.ListItems;
            imgGalleryTag.gridOptions.fillData(imgGalleryTag.ListItems, response.resultAccess); // Sending Access as an argument
            imgGalleryTag.contentBusyIndicator.isActive = false;
            imgGalleryTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            imgGalleryTag.gridOptions.totalRowCount = response.TotalRowCount;
            imgGalleryTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            imgGalleryTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            imgGalleryTag.contentBusyIndicator.isActive = false;
        });

    };



    imgGalleryTag.gridContentOptions.onRowSelected = function () { }

    // Open Add Category Modal 
    imgGalleryTag.addNewCategoryModel = function () {
        imgGalleryTag.addRequested = false;
        ajax.call(cmsServerConfig.configApiServerPath+'imgGalleryCategorytag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            imgGalleryTag.selectedItem = response.Item;
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
                imgGalleryTag.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(imgGalleryTag.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleimgGallery/imgGalleryCategorytag/add.html',
                        scope: $scope
                    });
                    imgGalleryTag.addRequested = false;
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
    imgGalleryTag.openEditCategoryModel = function () {
        if (buttonIsPressed) return;
        imgGalleryTag.addRequested = false;
        imgGalleryTag.modalTitle = 'ویرایش';
        if (!imgGalleryTag.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        imgGalleryTag.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'imgGalleryCategorytag/GetOne', imgGalleryTag.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            imgGalleryTag.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            imgGalleryTag.selectedItem = response.Item;
            //Set dataForTheTree
            imgGalleryTag.selectedNode = [];
            imgGalleryTag.expandedNodes = [];
            imgGalleryTag.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                imgGalleryTag.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryTagId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(imgGalleryTag.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (imgGalleryTag.selectedItem.LinkMainImageId > 0)
                        imgGalleryTag.onSelection({ Id: imgGalleryTag.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleimgGallery/imgGalleryCategorytag/edit.html',
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
    imgGalleryTag.addNewCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        imgGalleryTag.categoryBusyIndicator.isActive = true;
        imgGalleryTag.addRequested = true;
        imgGalleryTag.selectedItem.LinkParentId = null;
        if (imgGalleryTag.treeConfig.currentNode != null)
            imgGalleryTag.selectedItem.LinkParentId = imgGalleryTag.treeConfig.currentNode.Id;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'imgGalleryCategorytag/add', imgGalleryTag.selectedItem, 'POST').success(function (response) {
            buttonIsPressed = false;
            imgGalleryTag.addRequested = false;
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                imgGalleryTag.gridOptions.advancedSearchData.engine.Filters = null;
                imgGalleryTag.gridOptions.advancedSearchData.engine.Filters = [];
                imgGalleryTag.gridOptions.reGetAll();
                imgGalleryTag.closeModal();
            }
            imgGalleryTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            imgGalleryTag.addRequested = false;
            imgGalleryTag.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category
    imgGalleryTag.editCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        imgGalleryTag.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'imgGalleryCategorytag/edit', imgGalleryTag.selectedItem, 'PUT').success(function (response) {
            imgGalleryTag.addRequested = true;
            //imgGalleryTag.showbusy = false;
            imgGalleryTag.treeConfig.showbusy = false;
            imgGalleryTag.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                imgGalleryTag.addRequested = false;
                imgGalleryTag.treeConfig.currentNode.Title = response.Item.Title;
                imgGalleryTag.closeModal();
            }
            imgGalleryTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            imgGalleryTag.addRequested = false;
            imgGalleryTag.categoryBusyIndicator.isActive = false;
        });
    }

    // Delete a Category
    imgGalleryTag.deleteCategory = function () {
        if (buttonIsPressed) return;
        var node = imgGalleryTag.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                imgGalleryTag.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'imgGalleryCategorytag/GetOne', node.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    imgGalleryTag.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'imgGalleryCategorytag/delete', imgGalleryTag.selectedItemForDelete, 'POST').success(function (res) {
                        imgGalleryTag.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            imgGalleryTag.gridOptions.advancedSearchData.engine.Filters = null;
                            imgGalleryTag.gridOptions.advancedSearchData.engine.Filters = [];
                            imgGalleryTag.gridOptions.fillData();
                            imgGalleryTag.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        imgGalleryTag.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    imgGalleryTag.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    imgGalleryTag.treeConfig.onNodeSelect = function () {
        var node = imgGalleryTag.treeConfig.currentNode;
        imgGalleryTag.showGridComment = false;
        imgGalleryTag.CategoryTagId = node.Id;
        imgGalleryTag.selectContent(node);
    };

    //Show Content with Category Id
    imgGalleryTag.selectContent = function (node) {
        imgGalleryTag.gridOptions.advancedSearchData.engine.Filters = null;
        imgGalleryTag.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            imgGalleryTag.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            imgGalleryTag.contentBusyIndicator.isActive = true;

            imgGalleryTag.attachedFiles = null;
            imgGalleryTag.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryTagId",
                IntValue1: node.Id,
                SearchType: 0
            }
            imgGalleryTag.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"imgGallerytag/getall", imgGalleryTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            imgGalleryTag.contentBusyIndicator.isActive = false;
            imgGalleryTag.ListItems = response.ListItems;
            imgGalleryTag.gridOptions.fillData(imgGalleryTag.ListItems, response.resultAccess); // Sending Access as an argument
            imgGalleryTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            imgGalleryTag.gridOptions.totalRowCount = response.TotalRowCount;
            imgGalleryTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            imgGalleryTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Open Add New Content Model
    imgGalleryTag.openAddModel = function () {

        imgGalleryTag.addRequested = false;
        imgGalleryTag.modalTitle = 'اضافه کردن محتوای جدید';
        ajax.call(cmsServerConfig.configApiServerPath+'imgGallerytag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            imgGalleryTag.selectedItem = response.Item;
            imgGalleryTag.selectedItem.LinkCategoryTagId = imgGalleryTag.CategoryTagId;
            //imgGalleryTag.clearPreviousData();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleimgGallery/imgGallerytag/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    imgGalleryTag.openEditModel = function () {
        if (buttonIsPressed) return;
        imgGalleryTag.addRequested = false;
        imgGalleryTag.modalTitle = 'ویرایش';
        if (!imgGalleryTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'imgGallerytag/GetOne', imgGalleryTag.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            imgGalleryTag.selectedItem = response1.Item;

            $modal.open({
                templateUrl: 'cpanelv1/ModuleimgGallery/imgGallerytag/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    imgGalleryTag.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        imgGalleryTag.categoryBusyIndicator.isActive = true;
        imgGalleryTag.addRequested = true;


        ajax.call(cmsServerConfig.configApiServerPath+'imgGallerytag/add', imgGalleryTag.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            imgGalleryTag.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                imgGalleryTag.ListItems.unshift(response.Item);
                imgGalleryTag.gridOptions.fillData(imgGalleryTag.ListItems);
                imgGalleryTag.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            imgGalleryTag.addRequested = false;
            imgGalleryTag.categoryBusyIndicator.isActive = false;
        });
    }

    //Edit Content
    imgGalleryTag.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        imgGalleryTag.categoryBusyIndicator.isActive = true;
        imgGalleryTag.addRequested = true;


        ajax.call(cmsServerConfig.configApiServerPath+'imgGallerytag/edit', imgGalleryTag.selectedItem, 'PUT').success(function (response) {
            imgGalleryTag.categoryBusyIndicator.isActive = false;
            imgGalleryTag.addRequested = false;
            imgGalleryTag.treeConfig.showbusy = false;
            imgGalleryTag.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                imgGalleryTag.replaceItem(imgGalleryTag.selectedItem.Id, response.Item);
                imgGalleryTag.gridOptions.fillData(imgGalleryTag.ListItems);
                imgGalleryTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            imgGalleryTag.addRequested = false;
            imgGalleryTag.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a imgGallery Content 
    imgGalleryTag.deleteContent = function () {
        if (!imgGalleryTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        imgGalleryTag.treeConfig.showbusy = true;
        imgGalleryTag.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                imgGalleryTag.categoryBusyIndicator.isActive = true;
                console.log(imgGalleryTag.gridOptions.selectedRow.item);
                imgGalleryTag.showbusy = true;
                imgGalleryTag.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+"imgGallerytag/GetOne", imgGalleryTag.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    imgGalleryTag.showbusy = false;
                    imgGalleryTag.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    imgGalleryTag.selectedItemForDelete = response.Item;
                    console.log(imgGalleryTag.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"imgGallerytag/delete", imgGalleryTag.selectedItemForDelete, 'POST').success(function (res) {
                        imgGalleryTag.categoryBusyIndicator.isActive = false;
                        imgGalleryTag.treeConfig.showbusy = false;
                        imgGalleryTag.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            imgGalleryTag.replaceItem(imgGalleryTag.selectedItemForDelete.Id);
                            imgGalleryTag.gridOptions.fillData(imgGalleryTag.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        imgGalleryTag.treeConfig.showbusy = false;
                        imgGalleryTag.showIsBusy = false;
                        imgGalleryTag.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    imgGalleryTag.treeConfig.showbusy = false;
                    imgGalleryTag.showIsBusy = false;
                    imgGalleryTag.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }


    //Replace Item OnDelete/OnEdit Grid Options
    imgGalleryTag.replaceItem = function (oldId, newItem) {
        angular.forEach(imgGalleryTag.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = imgGalleryTag.ListItems.indexOf(item);
                imgGalleryTag.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            imgGalleryTag.ListItems.unshift(newItem);
    }

    imgGalleryTag.searchData = function () {
        imgGalleryTag.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"imgGallerytsg/getall", imgGalleryTag.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            imgGalleryTag.contentBusyIndicator.isActive = false;
            imgGalleryTag.ListItems = response.ListItems;
            imgGalleryTag.gridOptions.fillData(imgGalleryTag.ListItems);
            imgGalleryTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            imgGalleryTag.gridOptions.totalRowCount = response.TotalRowCount;
            imgGalleryTag.gridOptions.rowPerPage = response.RowPerPage;
            imgGalleryTag.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            imgGalleryTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    imgGalleryTag.addRequested = false;
    imgGalleryTag.closeModal = function () {
        $modalStack.dismissAll();
    };

    imgGalleryTag.showIsBusy = false;



    //For reInit Categories
    imgGalleryTag.gridOptions.reGetAll = function () {
        imgGalleryTag.init();
    };

    imgGalleryTag.isCurrentNodeEmpty = function () {
        return !angular.equals({}, imgGalleryTag.treeConfig.currentNode);
    }

    imgGalleryTag.loadFileAndFolder = function (item) {
        imgGalleryTag.treeConfig.currentNode = item;
        console.log(item);
        imgGalleryTag.treeConfig.onNodeSelect(item);
    }

    imgGalleryTag.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    imgGalleryTag.columnCheckbox = false;
    imgGalleryTag.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = imgGalleryTag.gridOptions.columns;
        if (imgGalleryTag.gridOptions.columnCheckbox) {
            for (var i = 0; i < imgGalleryTag.gridOptions.columns.length; i++) {
                var element = $("#" + imgGalleryTag.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                imgGalleryTag.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < imgGalleryTag.gridOptions.columns.length; i++) {
                var element = $("#" + imgGalleryTag.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + imgGalleryTag.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < imgGalleryTag.gridOptions.columns.length; i++) {
            console.log(imgGalleryTag.gridOptions.columns[i].name.concat(".visible: "), imgGalleryTag.gridOptions.columns[i].visible);
        }
        imgGalleryTag.gridOptions.columnCheckbox = !imgGalleryTag.gridOptions.columnCheckbox;
    }

    imgGalleryTag.deleteAttachedFile = function (index) {
        imgGalleryTag.attachedFiles.splice(index, 1);
    }

    imgGalleryTag.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !imgGalleryTag.alreadyExist(id, imgGalleryTag.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = {
                id: fId, name: fname
            };
            imgGalleryTag.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    imgGalleryTag.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    imgGalleryTag.filePickerMainImage.removeSelectedfile = function (config) {
        imgGalleryTag.filePickerMainImage.fileId = null;
        imgGalleryTag.filePickerMainImage.filename = null;
        imgGalleryTag.selectedItem.LinkMainImageId = null;

    }

    imgGalleryTag.filePickerFiles.removeSelectedfile = function (config) {
        imgGalleryTag.filePickerFiles.fileId = null;
        imgGalleryTag.filePickerFiles.filename = null;
        imgGalleryTag.selectedItem.LinkFileIds = null;
    }


    imgGalleryTag.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }

    // ----------- FilePicker Codes --------------------------------
    imgGalleryTag.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !imgGalleryTag.alreadyExist(id, imgGalleryTag.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            imgGalleryTag.attachedFiles.push(file);
            imgGalleryTag.clearfilePickers();
        }
    }

    imgGalleryTag.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                imgGalleryTag.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    imgGalleryTag.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;   //String is empty or whitespace then return
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            imgGalleryTag.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    imgGalleryTag.clearfilePickers = function () {
        imgGalleryTag.filePickerFiles.fileId = null;
        imgGalleryTag.filePickerFiles.filename = null;
    }

    imgGalleryTag.stringfyLinkFileIds = function () {
        $.each(imgGalleryTag.attachedFiles, function (i, item) {
            if (imgGalleryTag.selectedItem.LinkFileIds == "")
                imgGalleryTag.selectedItem.LinkFileIds = item.fileId;
            else
                imgGalleryTag.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    imgGalleryTag.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleimgGallery/imgGalleryContent/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        imgGalleryTag.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            imgGalleryTag.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    imgGalleryTag.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    imgGalleryTag.whatcolor = function (progress) {
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

    imgGalleryTag.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    imgGalleryTag.replaceFile = function (name) {
        imgGalleryTag.itemClicked(null, imgGalleryTag.fileIdToDelete, "file");
        imgGalleryTag.fileTypes = 1;
        imgGalleryTag.fileIdToDelete = imgGalleryTag.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", imgGalleryTag.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    imgGalleryTag.remove(imgGalleryTag.FileList, imgGalleryTag.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                imgGalleryTag.FileItem = response3.Item;
                                imgGalleryTag.FileItem.FileName = name;
                                imgGalleryTag.FileItem.Extension = name.split('.').pop();
                                imgGalleryTag.FileItem.FileSrc = name;
                                imgGalleryTag.FileItem.LinkCategoryId = imgGalleryTag.thisCategory;
                                imgGalleryTag.saveNewFile();
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
    imgGalleryTag.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", imgGalleryTag.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                imgGalleryTag.FileItem = response.Item;
                imgGalleryTag.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            imgGalleryTag.showErrorIcon();
            return -1;
        });
    }

    imgGalleryTag.showSuccessIcon = function () {
    }

    imgGalleryTag.showErrorIcon = function () {

    }
    //file is exist
    imgGalleryTag.fileIsExist = function (fileName) {
        for (var i = 0; i < imgGalleryTag.FileList.length; i++) {
            if (imgGalleryTag.FileList[i].FileName == fileName) {
                imgGalleryTag.fileIdToDelete = imgGalleryTag.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    imgGalleryTag.getFileItem = function (id) {
        for (var i = 0; i < imgGalleryTag.FileList.length; i++) {
            if (imgGalleryTag.FileList[i].Id == id) {
                return imgGalleryTag.FileList[i];
            }
        }
    }

    //select file or folder
    imgGalleryTag.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            imgGalleryTag.fileTypes = 1;
            imgGalleryTag.selectedFileId = imgGalleryTag.getFileItem(index).Id;
            imgGalleryTag.selectedFileName = imgGalleryTag.getFileItem(index).FileName;
        }
        else {
            imgGalleryTag.fileTypes = 2;
            imgGalleryTag.selectedCategoryId = imgGalleryTag.getCategoryName(index).Id;
            imgGalleryTag.selectedCategoryTitle = imgGalleryTag.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        imgGalleryTag.selectedIndex = index;

    };

    //upload file
    imgGalleryTag.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (imgGalleryTag.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ imgGalleryTag.replaceFile(uploadFile.name);
                    imgGalleryTag.itemClicked(null, imgGalleryTag.fileIdToDelete, "file");
                    imgGalleryTag.fileTypes = 1;
                    imgGalleryTag.fileIdToDelete = imgGalleryTag.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                imgGalleryTag.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        imgGalleryTag.FileItem = response2.Item;
                        imgGalleryTag.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        imgGalleryTag.filePickerMainImage.filename =
                          imgGalleryTag.FileItem.FileName;
                        imgGalleryTag.filePickerMainImage.fileId =
                          response2.Item.Id;
                        imgGalleryTag.selectedItem.LinkMainImageId =
                          imgGalleryTag.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      imgGalleryTag.showErrorIcon();
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
                    imgGalleryTag.FileItem = response.Item;
                    imgGalleryTag.FileItem.FileName = uploadFile.name;
                    imgGalleryTag.FileItem.uploadName = uploadFile.uploadName;
                    imgGalleryTag.FileItem.Extension = uploadFile.name.split('.').pop();
                    imgGalleryTag.FileItem.FileSrc = uploadFile.name;
                    imgGalleryTag.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- imgGalleryTag.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", imgGalleryTag.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            imgGalleryTag.FileItem = response.Item;
                            imgGalleryTag.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            imgGalleryTag.filePickerMainImage.filename = imgGalleryTag.FileItem.FileName;
                            imgGalleryTag.filePickerMainImage.fileId = response.Item.Id;
                            imgGalleryTag.selectedItem.LinkMainImageId = imgGalleryTag.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        imgGalleryTag.showErrorIcon();
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
    imgGalleryTag.exportFile = function () {
        imgGalleryTag.gridOptions.advancedSearchData.engine.ExportFile = imgGalleryTag.ExportFileClass;
        imgGalleryTag.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'imgGallerytag/exportfile', imgGalleryTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            imgGalleryTag.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                imgGalleryTag.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //imgGalleryTag.closeModal();
            }
            imgGalleryTag.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    imgGalleryTag.toggleExportForm = function () {
        imgGalleryTag.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        imgGalleryTag.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        imgGalleryTag.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        imgGalleryTag.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        imgGalleryTag.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleimgGallery/imgGallerytag/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    imgGalleryTag.rowCountChanged = function () {
        if (!angular.isDefined(imgGalleryTag.ExportFileClass.RowCount) || imgGalleryTag.ExportFileClass.RowCount > 5000)
            imgGalleryTag.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    imgGalleryTag.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"imgGallerytag/count", imgGalleryTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            imgGalleryTag.addRequested = false;
            rashaErManage.checkAction(response);
            imgGalleryTag.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            imgGalleryTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    //TreeControl
    imgGalleryTag.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (imgGalleryTag.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    imgGalleryTag.onNodeToggle = function (node, expanded) {
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

    imgGalleryTag.onSelection = function (node, selected) {
        if (!selected) {
            imgGalleryTag.selectedItem.LinkMainImageId = null;
            imgGalleryTag.selectedItem.previewImageSrc = null;
            return;
        }
        imgGalleryTag.selectedItem.LinkMainImageId = node.Id;
        imgGalleryTag.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            imgGalleryTag.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);