app.controller("mscGalleryTagCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window','$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window,$state, $filter) {
    var mscGalleryTag = this;
    var edititem=false;
    //For Grid Options
    mscGalleryTag.gridOptions = {};
    mscGalleryTag.selectedItem = {};
    mscGalleryTag.attachedFiles = [];
    mscGalleryTag.attachedFile = "";
    var todayDate = moment().format();
    mscGalleryTag.DateBirth = {
        defaultDate: todayDate,
        viewTimePicker: true
    }
    mscGalleryTag.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }

    mscGalleryTag.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    mscGalleryTag.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    mscGalleryTag.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:mscGalleryTag.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:mscGalleryTag,
        useCurrentLocationZoom:12,
    }
    if (itemRecordStatus != undefined) mscGalleryTag.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    mscGalleryTag.selectedItem.ToDate = date;
    mscGalleryTag.datePickerConfig = {
        defaultDate: date
    };
    mscGalleryTag.startDate = {
        defaultDate: date
    }
    mscGalleryTag.endDate = {
        defaultDate: date
    }
    mscGalleryTag.count = 0;

//#help/ سلکتور دسته بندی در ویرایش محتوا
 mscGalleryTag.LinkCategoryTagIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryTagId',
        url: 'mscGalleryCategoryTag',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: mscGalleryTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' }
            ]
        }
    }

    //mscGallery Grid Options
    mscGalleryTag.gridOptions = {
        columns: [
            { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: "ActionKey", displayName: "لیست مطالب", displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="mscGalleryTag.OpenContentTag(x.Id,x.Title)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }

    //Comment Grid Options
    mscGalleryTag.gridContentOptions = {
        columns: [
           { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
           { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
           { name: 'Writer', displayName: 'نویسنده', sortable: true, type: 'string' },
           { name: 'Comment', displayName: 'کامنت', sortable: true, type: 'string' },
           { name: 'ActionButtons', displayName: 'کلید عملیاتی', template: '<Button ng-if="!x.IsActivated" ng-click="mscGalleryTag.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button><Button ng-if="x.IsActivated" ng-click="mscGalleryTag.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button><Button ng-click="mscGalleryTag.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>' },
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
    mscGalleryTag.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show mscGallery Loading Indicator
    mscGalleryTag.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    mscGalleryTag.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    mscGalleryTag.OpenContentTag = function (LinkTagContentId,TitleTag) {
                $state.go("index.mscGallerycontent", {
            ContentId: LinkTagContentId,
            TitleTag:TitleTag
        });
    }
    mscGalleryTag.treeConfig.currentNode = {};
    mscGalleryTag.treeBusyIndicator = false;
    mscGalleryTag.addRequested = false;
    mscGalleryTag.showGridComment = false;
    mscGalleryTag.mscGalleryTitle = "";

    //init Function
    mscGalleryTag.init = function () {
        mscGalleryTag.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"mscGalleryCategorytag/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            mscGalleryTag.treeConfig.Items = response.ListItems;
            mscGalleryTag.treeConfig.Items = response.ListItems;
            mscGalleryTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"mscGallerytag/getall", mscGalleryTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            mscGalleryTag.ListItems = response.ListItems;
            mscGalleryTag.gridOptions.fillData(mscGalleryTag.ListItems, response.resultAccess); // Sending Access as an argument
            mscGalleryTag.contentBusyIndicator.isActive = false;
            mscGalleryTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            mscGalleryTag.gridOptions.totalRowCount = response.TotalRowCount;
            mscGalleryTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            mscGalleryTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            mscGalleryTag.contentBusyIndicator.isActive = false;
        });

    };



    mscGalleryTag.gridContentOptions.onRowSelected = function () { }

    // Open Add Category Modal 
    mscGalleryTag.addNewCategoryModel = function () {
        mscGalleryTag.addRequested = false;
        ajax.call(cmsServerConfig.configApiServerPath+'mscGalleryCategorytag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            mscGalleryTag.selectedItem = response.Item;
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
                mscGalleryTag.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(mscGalleryTag.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModulemscGallery/mscGalleryCategorytag/add.html',
                        scope: $scope
                    });
                    mscGalleryTag.addRequested = false;
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
    mscGalleryTag.openEditCategoryModel = function () {
        if (buttonIsPressed) return;
        mscGalleryTag.addRequested = false;
        mscGalleryTag.modalTitle = 'ویرایش';
        if (!mscGalleryTag.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        mscGalleryTag.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'mscGalleryCategorytag/GetOne', mscGalleryTag.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            mscGalleryTag.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            mscGalleryTag.selectedItem = response.Item;
            //Set dataForTheTree
            mscGalleryTag.selectedNode = [];
            mscGalleryTag.expandedNodes = [];
            mscGalleryTag.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                mscGalleryTag.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryTagId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(mscGalleryTag.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (mscGalleryTag.selectedItem.LinkMainImageId > 0)
                        mscGalleryTag.onSelection({ Id: mscGalleryTag.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModulemscGallery/mscGalleryCategorytag/edit.html',
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
    mscGalleryTag.addNewCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        mscGalleryTag.categoryBusyIndicator.isActive = true;
        mscGalleryTag.addRequested = true;
        mscGalleryTag.selectedItem.LinkParentId = null;
        if (mscGalleryTag.treeConfig.currentNode != null)
            mscGalleryTag.selectedItem.LinkParentId = mscGalleryTag.treeConfig.currentNode.Id;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'mscGalleryCategorytag/add', mscGalleryTag.selectedItem, 'POST').success(function (response) {
            buttonIsPressed = false;
            mscGalleryTag.addRequested = false;
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                mscGalleryTag.gridOptions.advancedSearchData.engine.Filters = null;
                mscGalleryTag.gridOptions.advancedSearchData.engine.Filters = [];
                mscGalleryTag.gridOptions.reGetAll();
                mscGalleryTag.closeModal();
            }
            mscGalleryTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mscGalleryTag.addRequested = false;
            mscGalleryTag.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category
    mscGalleryTag.editCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        mscGalleryTag.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'mscGalleryCategorytag/edit', mscGalleryTag.selectedItem, 'PUT').success(function (response) {
            mscGalleryTag.addRequested = true;
            //mscGalleryTag.showbusy = false;
            mscGalleryTag.treeConfig.showbusy = false;
            mscGalleryTag.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                mscGalleryTag.addRequested = false;
                mscGalleryTag.treeConfig.currentNode.Title = response.Item.Title;
                mscGalleryTag.closeModal();
            }
            mscGalleryTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mscGalleryTag.addRequested = false;
            mscGalleryTag.categoryBusyIndicator.isActive = false;
        });
    }

    // Delete a Category
    mscGalleryTag.deleteCategory = function () {
        if (buttonIsPressed) return;
        var node = mscGalleryTag.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                mscGalleryTag.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'mscGalleryCategorytag/GetOne', node.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    mscGalleryTag.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'mscGalleryCategorytag/delete', mscGalleryTag.selectedItemForDelete, 'POST').success(function (res) {
                        mscGalleryTag.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            mscGalleryTag.gridOptions.advancedSearchData.engine.Filters = null;
                            mscGalleryTag.gridOptions.advancedSearchData.engine.Filters = [];
                            mscGalleryTag.gridOptions.fillData();
                            mscGalleryTag.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        mscGalleryTag.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    mscGalleryTag.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    mscGalleryTag.treeConfig.onNodeSelect = function () {
        var node = mscGalleryTag.treeConfig.currentNode;
        mscGalleryTag.showGridComment = false;
        mscGalleryTag.CategoryTagId = node.Id;
        mscGalleryTag.selectContent(node);
    };

    //Show Content with Category Id
    mscGalleryTag.selectContent = function (node) {
        mscGalleryTag.gridOptions.advancedSearchData.engine.Filters = null;
        mscGalleryTag.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            mscGalleryTag.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            mscGalleryTag.contentBusyIndicator.isActive = true;

            mscGalleryTag.attachedFiles = null;
            mscGalleryTag.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryTagId",
                IntValue1: node.Id,
                SearchType: 0
            }
            mscGalleryTag.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"mscGallerytag/getall", mscGalleryTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            mscGalleryTag.contentBusyIndicator.isActive = false;
            mscGalleryTag.ListItems = response.ListItems;
            mscGalleryTag.gridOptions.fillData(mscGalleryTag.ListItems, response.resultAccess); // Sending Access as an argument
            mscGalleryTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            mscGalleryTag.gridOptions.totalRowCount = response.TotalRowCount;
            mscGalleryTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            mscGalleryTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Open Add New Content Model
    mscGalleryTag.openAddModel = function () {

        mscGalleryTag.addRequested = false;
        mscGalleryTag.modalTitle = 'اضافه کردن محتوای جدید';
        ajax.call(cmsServerConfig.configApiServerPath+'mscGallerytag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            mscGalleryTag.selectedItem = response.Item;
            mscGalleryTag.selectedItem.LinkCategoryTagId = mscGalleryTag.CategoryTagId;
            //mscGalleryTag.clearPreviousData();
            $modal.open({
                templateUrl: 'cpanelv1/ModulemscGallery/mscGallerytag/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    mscGalleryTag.openEditModel = function () {
        if (buttonIsPressed) return;
        mscGalleryTag.addRequested = false;
        mscGalleryTag.modalTitle = 'ویرایش';
        if (!mscGalleryTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'mscGallerytag/GetOne', mscGalleryTag.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            mscGalleryTag.selectedItem = response1.Item;

            $modal.open({
                templateUrl: 'cpanelv1/ModulemscGallery/mscGallerytag/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    mscGalleryTag.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        mscGalleryTag.categoryBusyIndicator.isActive = true;
        mscGalleryTag.addRequested = true;


        ajax.call(cmsServerConfig.configApiServerPath+'mscGallerytag/add', mscGalleryTag.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            mscGalleryTag.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                mscGalleryTag.ListItems.unshift(response.Item);
                mscGalleryTag.gridOptions.fillData(mscGalleryTag.ListItems);
                mscGalleryTag.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mscGalleryTag.addRequested = false;
            mscGalleryTag.categoryBusyIndicator.isActive = false;
        });
    }

    //Edit Content
    mscGalleryTag.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        mscGalleryTag.categoryBusyIndicator.isActive = true;
        mscGalleryTag.addRequested = true;


        ajax.call(cmsServerConfig.configApiServerPath+'mscGallerytag/edit', mscGalleryTag.selectedItem, 'PUT').success(function (response) {
            mscGalleryTag.categoryBusyIndicator.isActive = false;
            mscGalleryTag.addRequested = false;
            mscGalleryTag.treeConfig.showbusy = false;
            mscGalleryTag.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                mscGalleryTag.replaceItem(mscGalleryTag.selectedItem.Id, response.Item);
                mscGalleryTag.gridOptions.fillData(mscGalleryTag.ListItems);
                mscGalleryTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mscGalleryTag.addRequested = false;
            mscGalleryTag.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a mscGallery Content 
    mscGalleryTag.deleteContent = function () {
        if (!mscGalleryTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        mscGalleryTag.treeConfig.showbusy = true;
        mscGalleryTag.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                mscGalleryTag.categoryBusyIndicator.isActive = true;
                console.log(mscGalleryTag.gridOptions.selectedRow.item);
                mscGalleryTag.showbusy = true;
                mscGalleryTag.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+"mscGallerytag/GetOne", mscGalleryTag.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    mscGalleryTag.showbusy = false;
                    mscGalleryTag.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    mscGalleryTag.selectedItemForDelete = response.Item;
                    console.log(mscGalleryTag.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"mscGallerytag/delete", mscGalleryTag.selectedItemForDelete, 'POST').success(function (res) {
                        mscGalleryTag.categoryBusyIndicator.isActive = false;
                        mscGalleryTag.treeConfig.showbusy = false;
                        mscGalleryTag.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            mscGalleryTag.replaceItem(mscGalleryTag.selectedItemForDelete.Id);
                            mscGalleryTag.gridOptions.fillData(mscGalleryTag.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        mscGalleryTag.treeConfig.showbusy = false;
                        mscGalleryTag.showIsBusy = false;
                        mscGalleryTag.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    mscGalleryTag.treeConfig.showbusy = false;
                    mscGalleryTag.showIsBusy = false;
                    mscGalleryTag.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }


    //Replace Item OnDelete/OnEdit Grid Options
    mscGalleryTag.replaceItem = function (oldId, newItem) {
        angular.forEach(mscGalleryTag.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = mscGalleryTag.ListItems.indexOf(item);
                mscGalleryTag.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            mscGalleryTag.ListItems.unshift(newItem);
    }

    mscGalleryTag.searchData = function () {
        mscGalleryTag.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"mscGallerytsg/getall", mscGalleryTag.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            mscGalleryTag.contentBusyIndicator.isActive = false;
            mscGalleryTag.ListItems = response.ListItems;
            mscGalleryTag.gridOptions.fillData(mscGalleryTag.ListItems);
            mscGalleryTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            mscGalleryTag.gridOptions.totalRowCount = response.TotalRowCount;
            mscGalleryTag.gridOptions.rowPerPage = response.RowPerPage;
            mscGalleryTag.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            mscGalleryTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    mscGalleryTag.addRequested = false;
    mscGalleryTag.closeModal = function () {
        $modalStack.dismissAll();
    };

    mscGalleryTag.showIsBusy = false;



    //For reInit Categories
    mscGalleryTag.gridOptions.reGetAll = function () {
        mscGalleryTag.init();
    };

    mscGalleryTag.isCurrentNodeEmpty = function () {
        return !angular.equals({}, mscGalleryTag.treeConfig.currentNode);
    }

    mscGalleryTag.loadFileAndFolder = function (item) {
        mscGalleryTag.treeConfig.currentNode = item;
        console.log(item);
        mscGalleryTag.treeConfig.onNodeSelect(item);
    }

    mscGalleryTag.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    mscGalleryTag.columnCheckbox = false;
    mscGalleryTag.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = mscGalleryTag.gridOptions.columns;
        if (mscGalleryTag.gridOptions.columnCheckbox) {
            for (var i = 0; i < mscGalleryTag.gridOptions.columns.length; i++) {
                var element = $("#" + mscGalleryTag.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                mscGalleryTag.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < mscGalleryTag.gridOptions.columns.length; i++) {
                var element = $("#" + mscGalleryTag.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + mscGalleryTag.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < mscGalleryTag.gridOptions.columns.length; i++) {
            console.log(mscGalleryTag.gridOptions.columns[i].name.concat(".visible: "), mscGalleryTag.gridOptions.columns[i].visible);
        }
        mscGalleryTag.gridOptions.columnCheckbox = !mscGalleryTag.gridOptions.columnCheckbox;
    }

    mscGalleryTag.deleteAttachedFile = function (index) {
        mscGalleryTag.attachedFiles.splice(index, 1);
    }

    mscGalleryTag.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !mscGalleryTag.alreadyExist(id, mscGalleryTag.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = {
                id: fId, name: fname
            };
            mscGalleryTag.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    mscGalleryTag.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    mscGalleryTag.filePickerMainImage.removeSelectedfile = function (config) {
        mscGalleryTag.filePickerMainImage.fileId = null;
        mscGalleryTag.filePickerMainImage.filename = null;
        mscGalleryTag.selectedItem.LinkMainImageId = null;

    }

    mscGalleryTag.filePickerFiles.removeSelectedfile = function (config) {
        mscGalleryTag.filePickerFiles.fileId = null;
        mscGalleryTag.filePickerFiles.filename = null;
        mscGalleryTag.selectedItem.LinkFileIds = null;
    }


    mscGalleryTag.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }

    // ----------- FilePicker Codes --------------------------------
    mscGalleryTag.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !mscGalleryTag.alreadyExist(id, mscGalleryTag.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            mscGalleryTag.attachedFiles.push(file);
            mscGalleryTag.clearfilePickers();
        }
    }

    mscGalleryTag.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                mscGalleryTag.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    mscGalleryTag.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;   //String is empty or whitespace then return
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            mscGalleryTag.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    mscGalleryTag.clearfilePickers = function () {
        mscGalleryTag.filePickerFiles.fileId = null;
        mscGalleryTag.filePickerFiles.filename = null;
    }

    mscGalleryTag.stringfyLinkFileIds = function () {
        $.each(mscGalleryTag.attachedFiles, function (i, item) {
            if (mscGalleryTag.selectedItem.LinkFileIds == "")
                mscGalleryTag.selectedItem.LinkFileIds = item.fileId;
            else
                mscGalleryTag.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    mscGalleryTag.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModulemscGallery/mscGalleryContent/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        mscGalleryTag.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            mscGalleryTag.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    mscGalleryTag.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    mscGalleryTag.whatcolor = function (progress) {
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

    mscGalleryTag.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    mscGalleryTag.replaceFile = function (name) {
        mscGalleryTag.itemClicked(null, mscGalleryTag.fileIdToDelete, "file");
        mscGalleryTag.fileTypes = 1;
        mscGalleryTag.fileIdToDelete = mscGalleryTag.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", mscGalleryTag.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    mscGalleryTag.remove(mscGalleryTag.FileList, mscGalleryTag.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                mscGalleryTag.FileItem = response3.Item;
                                mscGalleryTag.FileItem.FileName = name;
                                mscGalleryTag.FileItem.Extension = name.split('.').pop();
                                mscGalleryTag.FileItem.FileSrc = name;
                                mscGalleryTag.FileItem.LinkCategoryId = mscGalleryTag.thisCategory;
                                mscGalleryTag.saveNewFile();
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
    mscGalleryTag.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", mscGalleryTag.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                mscGalleryTag.FileItem = response.Item;
                mscGalleryTag.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            mscGalleryTag.showErrorIcon();
            return -1;
        });
    }

    mscGalleryTag.showSuccessIcon = function () {
    }

    mscGalleryTag.showErrorIcon = function () {

    }
    //file is exist
    mscGalleryTag.fileIsExist = function (fileName) {
        for (var i = 0; i < mscGalleryTag.FileList.length; i++) {
            if (mscGalleryTag.FileList[i].FileName == fileName) {
                mscGalleryTag.fileIdToDelete = mscGalleryTag.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    mscGalleryTag.getFileItem = function (id) {
        for (var i = 0; i < mscGalleryTag.FileList.length; i++) {
            if (mscGalleryTag.FileList[i].Id == id) {
                return mscGalleryTag.FileList[i];
            }
        }
    }

    //select file or folder
    mscGalleryTag.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            mscGalleryTag.fileTypes = 1;
            mscGalleryTag.selectedFileId = mscGalleryTag.getFileItem(index).Id;
            mscGalleryTag.selectedFileName = mscGalleryTag.getFileItem(index).FileName;
        }
        else {
            mscGalleryTag.fileTypes = 2;
            mscGalleryTag.selectedCategoryId = mscGalleryTag.getCategoryName(index).Id;
            mscGalleryTag.selectedCategoryTitle = mscGalleryTag.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        mscGalleryTag.selectedIndex = index;

    };

    //upload file
    mscGalleryTag.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (mscGalleryTag.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ mscGalleryTag.replaceFile(uploadFile.name);
                    mscGalleryTag.itemClicked(null, mscGalleryTag.fileIdToDelete, "file");
                    mscGalleryTag.fileTypes = 1;
                    mscGalleryTag.fileIdToDelete = mscGalleryTag.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                mscGalleryTag.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        mscGalleryTag.FileItem = response2.Item;
                        mscGalleryTag.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        mscGalleryTag.filePickerMainImage.filename =
                          mscGalleryTag.FileItem.FileName;
                        mscGalleryTag.filePickerMainImage.fileId =
                          response2.Item.Id;
                        mscGalleryTag.selectedItem.LinkMainImageId =
                          mscGalleryTag.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      mscGalleryTag.showErrorIcon();
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
                    mscGalleryTag.FileItem = response.Item;
                    mscGalleryTag.FileItem.FileName = uploadFile.name;
                    mscGalleryTag.FileItem.uploadName = uploadFile.uploadName;
                    mscGalleryTag.FileItem.Extension = uploadFile.name.split('.').pop();
                    mscGalleryTag.FileItem.FileSrc = uploadFile.name;
                    mscGalleryTag.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- mscGalleryTag.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", mscGalleryTag.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            mscGalleryTag.FileItem = response.Item;
                            mscGalleryTag.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            mscGalleryTag.filePickerMainImage.filename = mscGalleryTag.FileItem.FileName;
                            mscGalleryTag.filePickerMainImage.fileId = response.Item.Id;
                            mscGalleryTag.selectedItem.LinkMainImageId = mscGalleryTag.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        mscGalleryTag.showErrorIcon();
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
    mscGalleryTag.exportFile = function () {
        mscGalleryTag.gridOptions.advancedSearchData.engine.ExportFile = mscGalleryTag.ExportFileClass;
        mscGalleryTag.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'mscGallerytag/exportfile', mscGalleryTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            mscGalleryTag.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                mscGalleryTag.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //mscGalleryTag.closeModal();
            }
            mscGalleryTag.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    mscGalleryTag.toggleExportForm = function () {
        mscGalleryTag.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        mscGalleryTag.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        mscGalleryTag.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        mscGalleryTag.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        mscGalleryTag.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModulemscGallery/mscGallerytag/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    mscGalleryTag.rowCountChanged = function () {
        if (!angular.isDefined(mscGalleryTag.ExportFileClass.RowCount) || mscGalleryTag.ExportFileClass.RowCount > 5000)
            mscGalleryTag.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    mscGalleryTag.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"mscGallerytag/count", mscGalleryTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            mscGalleryTag.addRequested = false;
            rashaErManage.checkAction(response);
            mscGalleryTag.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            mscGalleryTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    //TreeControl
    mscGalleryTag.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (mscGalleryTag.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    mscGalleryTag.onNodeToggle = function (node, expanded) {
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

    mscGalleryTag.onSelection = function (node, selected) {
        if (!selected) {
            mscGalleryTag.selectedItem.LinkMainImageId = null;
            mscGalleryTag.selectedItem.previewImageSrc = null;
            return;
        }
        mscGalleryTag.selectedItem.LinkMainImageId = node.Id;
        mscGalleryTag.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            mscGalleryTag.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);