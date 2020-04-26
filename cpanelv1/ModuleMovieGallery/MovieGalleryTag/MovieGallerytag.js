app.controller("mvGalleryTagCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window','$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window,$state, $filter) {
    var mvGalleryTag = this;
    var edititem=false;
    //For Grid Options
    mvGalleryTag.gridOptions = {};
    mvGalleryTag.selectedItem = {};
    mvGalleryTag.attachedFiles = [];
    mvGalleryTag.attachedFile = "";
    var todayDate = moment().format();
    mvGalleryTag.DateBirth = {
        defaultDate: todayDate,
        viewTimePicker: true
    }
    mvGalleryTag.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }

    mvGalleryTag.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    mvGalleryTag.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    mvGalleryTag.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:mvGalleryTag.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:mvGalleryTag,
        useCurrentLocationZoom:12,
    }
    if (itemRecordStatus != undefined) mvGalleryTag.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    mvGalleryTag.selectedItem.ToDate = date;
    mvGalleryTag.datePickerConfig = {
        defaultDate: date
    };
    mvGalleryTag.startDate = {
        defaultDate: date
    }
    mvGalleryTag.endDate = {
        defaultDate: date
    }
    mvGalleryTag.count = 0;

//#help/ سلکتور دسته بندی در ویرایش محتوا
 mvGalleryTag.LinkCategoryTagIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryTagId',
        url: 'mvGalleryCategoryTag',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: mvGalleryTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' }
            ]
        }
    }

    //movieGallery Grid Options
    mvGalleryTag.gridOptions = {
        columns: [
            { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: "ActionKey", displayName: "لیست مطالب", displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="mvGalleryTag.OpenContentTag(x.Id,x.Title)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }

    //Comment Grid Options
    mvGalleryTag.gridContentOptions = {
        columns: [
           { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
           { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
           { name: 'Writer', displayName: 'نویسنده', sortable: true, type: 'string' },
           { name: 'Comment', displayName: 'کامنت', sortable: true, type: 'string' },
           { name: 'ActionButtons', displayName: 'کلید عملیاتی', template: '<Button ng-if="!x.IsActivated" ng-click="mvGalleryTag.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button><Button ng-if="x.IsActivated" ng-click="mvGalleryTag.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button><Button ng-click="mvGalleryTag.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>' },
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
    mvGalleryTag.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show mvGallery Loading Indicator
    mvGalleryTag.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    mvGalleryTag.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    mvGalleryTag.OpenContentTag = function (LinkTagContentId,TitleTag) {
                $state.go("index.mvgallerycontent", {
            ContentId: LinkTagContentId,
            TitleTag:TitleTag
        });
    }
    mvGalleryTag.treeConfig.currentNode = {};
    mvGalleryTag.treeBusyIndicator = false;
    mvGalleryTag.addRequested = false;
    mvGalleryTag.showGridComment = false;
    mvGalleryTag.mvGalleryTitle = "";

    //init Function
    mvGalleryTag.init = function () {
        mvGalleryTag.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"movieGalleryCategorytag/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            mvGalleryTag.treeConfig.Items = response.ListItems;
            mvGalleryTag.treeConfig.Items = response.ListItems;
            mvGalleryTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"movieGallerytag/getall", mvGalleryTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            mvGalleryTag.ListItems = response.ListItems;
            mvGalleryTag.gridOptions.fillData(mvGalleryTag.ListItems, response.resultAccess); // Sending Access as an argument
            mvGalleryTag.contentBusyIndicator.isActive = false;
            mvGalleryTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            mvGalleryTag.gridOptions.totalRowCount = response.TotalRowCount;
            mvGalleryTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            mvGalleryTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            mvGalleryTag.contentBusyIndicator.isActive = false;
        });

    };



    mvGalleryTag.gridContentOptions.onRowSelected = function () { }

    // Open Add Category Modal 
    mvGalleryTag.addNewCategoryModel = function () {
        mvGalleryTag.addRequested = false;
        ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryCategorytag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            mvGalleryTag.selectedItem = response.Item;
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
                mvGalleryTag.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(mvGalleryTag.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModulemovieGallery/movieGalleryCategorytag/add.html',
                        scope: $scope
                    });
                    mvGalleryTag.addRequested = false;
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
    mvGalleryTag.openEditCategoryModel = function () {
        if (buttonIsPressed) return;
        mvGalleryTag.addRequested = false;
        mvGalleryTag.modalTitle = 'ویرایش';
        if (!mvGalleryTag.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        mvGalleryTag.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryCategorytag/GetOne', mvGalleryTag.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            mvGalleryTag.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            mvGalleryTag.selectedItem = response.Item;
            //Set dataForTheTree
            mvGalleryTag.selectedNode = [];
            mvGalleryTag.expandedNodes = [];
            mvGalleryTag.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                mvGalleryTag.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryTagId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(mvGalleryTag.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (mvGalleryTag.selectedItem.LinkMainImageId > 0)
                        mvGalleryTag.onSelection({ Id: mvGalleryTag.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModulemovieGallery/movieGalleryCategorytag/edit.html',
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
    mvGalleryTag.addNewCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        mvGalleryTag.categoryBusyIndicator.isActive = true;
        mvGalleryTag.addRequested = true;
        mvGalleryTag.selectedItem.LinkParentId = null;
        if (mvGalleryTag.treeConfig.currentNode != null)
            mvGalleryTag.selectedItem.LinkParentId = mvGalleryTag.treeConfig.currentNode.Id;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryCategorytag/add', mvGalleryTag.selectedItem, 'POST').success(function (response) {
            buttonIsPressed = false;
            mvGalleryTag.addRequested = false;
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                mvGalleryTag.gridOptions.advancedSearchData.engine.Filters = null;
                mvGalleryTag.gridOptions.advancedSearchData.engine.Filters = [];
                mvGalleryTag.gridOptions.reGetAll();
                mvGalleryTag.closeModal();
            }
            mvGalleryTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mvGalleryTag.addRequested = false;
            mvGalleryTag.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category
    mvGalleryTag.editCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        mvGalleryTag.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryCategorytag/edit', mvGalleryTag.selectedItem, 'PUT').success(function (response) {
            mvGalleryTag.addRequested = true;
            //movieGalleryTag.showbusy = false;
            mvGalleryTag.treeConfig.showbusy = false;
            mvGalleryTag.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                mvGalleryTag.addRequested = false;
                mvGalleryTag.treeConfig.currentNode.Title = response.Item.Title;
                mvGalleryTag.closeModal();
            }
            mvGalleryTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mvGalleryTag.addRequested = false;
            mvGalleryTag.categoryBusyIndicator.isActive = false;
        });
    }

    // Delete a Category
    mvGalleryTag.deleteCategory = function () {
        if (buttonIsPressed) return;
        var node = mvGalleryTag.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                mvGalleryTag.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryCategorytag/GetOne', node.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    mvGalleryTag.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'movieGalleryCategorytag/delete', mvGalleryTag.selectedItemForDelete, 'POST').success(function (res) {
                        mvGalleryTag.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            mvGalleryTag.gridOptions.advancedSearchData.engine.Filters = null;
                            mvGalleryTag.gridOptions.advancedSearchData.engine.Filters = [];
                            mvGalleryTag.gridOptions.fillData();
                            mvGalleryTag.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        mvGalleryTag.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    mvGalleryTag.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    mvGalleryTag.treeConfig.onNodeSelect = function () {
        var node = mvGalleryTag.treeConfig.currentNode;
        mvGalleryTag.showGridComment = false;
        mvGalleryTag.CategoryTagId = node.Id;
        mvGalleryTag.selectContent(node);
    };

    //Show Content with Category Id
    mvGalleryTag.selectContent = function (node) {
        mvGalleryTag.gridOptions.advancedSearchData.engine.Filters = null;
        mvGalleryTag.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            mvGalleryTag.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            mvGalleryTag.contentBusyIndicator.isActive = true;

            mvGalleryTag.attachedFiles = null;
            mvGalleryTag.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryTagId",
                IntValue1: node.Id,
                SearchType: 0
            }
            mvGalleryTag.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"movieGallerytag/getall", mvGalleryTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            mvGalleryTag.contentBusyIndicator.isActive = false;
            mvGalleryTag.ListItems = response.ListItems;
            mvGalleryTag.gridOptions.fillData(mvGalleryTag.ListItems, response.resultAccess); // Sending Access as an argument
            mvGalleryTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            mvGalleryTag.gridOptions.totalRowCount = response.TotalRowCount;
            mvGalleryTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            mvGalleryTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Open Add New Content Model
    mvGalleryTag.openAddModel = function () {

        mvGalleryTag.addRequested = false;
        mvGalleryTag.modalTitle = 'اضافه کردن محتوای جدید';
        ajax.call(cmsServerConfig.configApiServerPath+'movieGallerytag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            mvGalleryTag.selectedItem = response.Item;
            mvGalleryTag.selectedItem.LinkCategoryTagId = mvGalleryTag.CategoryTagId;
            //mvGalleryTag.clearPreviousData();
            $modal.open({
                templateUrl: 'cpanelv1/ModulemovieGallery/movieGallerytag/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    mvGalleryTag.openEditModel = function () {
        if (buttonIsPressed) return;
        mvGalleryTag.addRequested = false;
        mvGalleryTag.modalTitle = 'ویرایش';
        if (!mvGalleryTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'movieGallerytag/GetOne', mvGalleryTag.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            mvGalleryTag.selectedItem = response1.Item;

            $modal.open({
                templateUrl: 'cpanelv1/ModulemovieGallery/movieGallerytag/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    mvGalleryTag.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        mvGalleryTag.categoryBusyIndicator.isActive = true;
        mvGalleryTag.addRequested = true;


        ajax.call(cmsServerConfig.configApiServerPath+'movieGallerytag/add', mvGalleryTag.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            mvGalleryTag.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                mvGalleryTag.ListItems.unshift(response.Item);
                mvGalleryTag.gridOptions.fillData(mvGalleryTag.ListItems);
                mvGalleryTag.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mvGalleryTag.addRequested = false;
            mvGalleryTag.categoryBusyIndicator.isActive = false;
        });
    }

    //Edit Content
    mvGalleryTag.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        mvGalleryTag.categoryBusyIndicator.isActive = true;
        mvGalleryTag.addRequested = true;


        ajax.call(cmsServerConfig.configApiServerPath+'movieGallerytag/edit', mvGalleryTag.selectedItem, 'PUT').success(function (response) {
            mvGalleryTag.categoryBusyIndicator.isActive = false;
            mvGalleryTag.addRequested = false;
            mvGalleryTag.treeConfig.showbusy = false;
            mvGalleryTag.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                mvGalleryTag.replaceItem(mvGalleryTag.selectedItem.Id, response.Item);
                mvGalleryTag.gridOptions.fillData(mvGalleryTag.ListItems);
                mvGalleryTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mvGalleryTag.addRequested = false;
            mvGalleryTag.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a mvGallery Content 
    mvGalleryTag.deleteContent = function () {
        if (!mvGalleryTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        mvGalleryTag.treeConfig.showbusy = true;
        mvGalleryTag.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                mvGalleryTag.categoryBusyIndicator.isActive = true;
                console.log(mvGalleryTag.gridOptions.selectedRow.item);
                mvGalleryTag.showbusy = true;
                mvGalleryTag.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+"movieGallerytag/GetOne", mvGalleryTag.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    mvGalleryTag.showbusy = false;
                    mvGalleryTag.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    mvGalleryTag.selectedItemForDelete = response.Item;
                    console.log(mvGalleryTag.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"movieGallerytag/delete", mvGalleryTag.selectedItemForDelete, 'POST').success(function (res) {
                        mvGalleryTag.categoryBusyIndicator.isActive = false;
                        mvGalleryTag.treeConfig.showbusy = false;
                        mvGalleryTag.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            mvGalleryTag.replaceItem(mvGalleryTag.selectedItemForDelete.Id);
                            mvGalleryTag.gridOptions.fillData(mvGalleryTag.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        mvGalleryTag.treeConfig.showbusy = false;
                        mvGalleryTag.showIsBusy = false;
                        mvGalleryTag.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    mvGalleryTag.treeConfig.showbusy = false;
                    mvGalleryTag.showIsBusy = false;
                    mvGalleryTag.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }


    //Replace Item OnDelete/OnEdit Grid Options
    mvGalleryTag.replaceItem = function (oldId, newItem) {
        angular.forEach(mvGalleryTag.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = mvGalleryTag.ListItems.indexOf(item);
                mvGalleryTag.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            mvGalleryTag.ListItems.unshift(newItem);
    }

    mvGalleryTag.searchData = function () {
        mvGalleryTag.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"movieGallerytsg/getall", mvGalleryTag.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            mvGalleryTag.contentBusyIndicator.isActive = false;
            mvGalleryTag.ListItems = response.ListItems;
            mvGalleryTag.gridOptions.fillData(mvGalleryTag.ListItems);
            mvGalleryTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            mvGalleryTag.gridOptions.totalRowCount = response.TotalRowCount;
            mvGalleryTag.gridOptions.rowPerPage = response.RowPerPage;
            mvGalleryTag.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            mvGalleryTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    mvGalleryTag.addRequested = false;
    mvGalleryTag.closeModal = function () {
        $modalStack.dismissAll();
    };

    mvGalleryTag.showIsBusy = false;



    //For reInit Categories
    mvGalleryTag.gridOptions.reGetAll = function () {
        mvGalleryTag.init();
    };

    mvGalleryTag.isCurrentNodeEmpty = function () {
        return !angular.equals({}, mvGalleryTag.treeConfig.currentNode);
    }

    mvGalleryTag.loadFileAndFolder = function (item) {
        mvGalleryTag.treeConfig.currentNode = item;
        console.log(item);
        mvGalleryTag.treeConfig.onNodeSelect(item);
    }

    mvGalleryTag.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    mvGalleryTag.columnCheckbox = false;
    mvGalleryTag.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = mvGalleryTag.gridOptions.columns;
        if (mvGalleryTag.gridOptions.columnCheckbox) {
            for (var i = 0; i < mvGalleryTag.gridOptions.columns.length; i++) {
                var element = $("#" + mvGalleryTag.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                mvGalleryTag.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < mvGalleryTag.gridOptions.columns.length; i++) {
                var element = $("#" + mvGalleryTag.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + mvGalleryTag.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < mvGalleryTag.gridOptions.columns.length; i++) {
            console.log(mvGalleryTag.gridOptions.columns[i].name.concat(".visible: "), mvGalleryTag.gridOptions.columns[i].visible);
        }
        mvGalleryTag.gridOptions.columnCheckbox = !mvGalleryTag.gridOptions.columnCheckbox;
    }

    mvGalleryTag.deleteAttachedFile = function (index) {
        mvGalleryTag.attachedFiles.splice(index, 1);
    }

    mvGalleryTag.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !mvGalleryTag.alreadyExist(id, mvGalleryTag.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = {
                id: fId, name: fname
            };
            mvGalleryTag.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    mvGalleryTag.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    mvGalleryTag.filePickerMainImage.removeSelectedfile = function (config) {
        mvGalleryTag.filePickerMainImage.fileId = null;
        mvGalleryTag.filePickerMainImage.filename = null;
        mvGalleryTag.selectedItem.LinkMainImageId = null;

    }

    mvGalleryTag.filePickerFiles.removeSelectedfile = function (config) {
        mvGalleryTag.filePickerFiles.fileId = null;
        mvGalleryTag.filePickerFiles.filename = null;
        mvGalleryTag.selectedItem.LinkFileIds = null;
    }


    mvGalleryTag.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }

    // ----------- FilePicker Codes --------------------------------
    mvGalleryTag.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !mvGalleryTag.alreadyExist(id, mvGalleryTag.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            mvGalleryTag.attachedFiles.push(file);
            mvGalleryTag.clearfilePickers();
        }
    }

    mvGalleryTag.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                mvGalleryTag.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    mvGalleryTag.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;   //String is empty or whitespace then return
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            mvGalleryTag.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    mvGalleryTag.clearfilePickers = function () {
        mvGalleryTag.filePickerFiles.fileId = null;
        mvGalleryTag.filePickerFiles.filename = null;
    }

    mvGalleryTag.stringfyLinkFileIds = function () {
        $.each(mvGalleryTag.attachedFiles, function (i, item) {
            if (mvGalleryTag.selectedItem.LinkFileIds == "")
                mvGalleryTag.selectedItem.LinkFileIds = item.fileId;
            else
                mvGalleryTag.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    mvGalleryTag.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModulemovieGallery/movieGalleryContent/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        mvGalleryTag.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            mvGalleryTag.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    mvGalleryTag.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    mvGalleryTag.whatcolor = function (progress) {
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

    mvGalleryTag.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    mvGalleryTag.replaceFile = function (name) {
        mvGalleryTag.itemClicked(null, mvGalleryTag.fileIdToDelete, "file");
        mvGalleryTag.fileTypes = 1;
        mvGalleryTag.fileIdToDelete = mvGalleryTag.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", mvGalleryTag.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    mvGalleryTag.remove(mvGalleryTag.FileList, mvGalleryTag.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                mvGalleryTag.FileItem = response3.Item;
                                mvGalleryTag.FileItem.FileName = name;
                                mvGalleryTag.FileItem.Extension = name.split('.').pop();
                                mvGalleryTag.FileItem.FileSrc = name;
                                mvGalleryTag.FileItem.LinkCategoryId = mvGalleryTag.thisCategory;
                                mvGalleryTag.saveNewFile();
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
    mvGalleryTag.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", mvGalleryTag.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                mvGalleryTag.FileItem = response.Item;
                mvGalleryTag.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            mvGalleryTag.showErrorIcon();
            return -1;
        });
    }

    mvGalleryTag.showSuccessIcon = function () {
    }

    mvGalleryTag.showErrorIcon = function () {

    }
    //file is exist
    mvGalleryTag.fileIsExist = function (fileName) {
        for (var i = 0; i < mvGalleryTag.FileList.length; i++) {
            if (mvGalleryTag.FileList[i].FileName == fileName) {
                mvGalleryTag.fileIdToDelete = mvGalleryTag.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    mvGalleryTag.getFileItem = function (id) {
        for (var i = 0; i < mvGalleryTag.FileList.length; i++) {
            if (mvGalleryTag.FileList[i].Id == id) {
                return mvGalleryTag.FileList[i];
            }
        }
    }

    //select file or folder
    mvGalleryTag.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            mvGalleryTag.fileTypes = 1;
            mvGalleryTag.selectedFileId = mvGalleryTag.getFileItem(index).Id;
            mvGalleryTag.selectedFileName = mvGalleryTag.getFileItem(index).FileName;
        }
        else {
            mvGalleryTag.fileTypes = 2;
            mvGalleryTag.selectedCategoryId = mvGalleryTag.getCategoryName(index).Id;
            mvGalleryTag.selectedCategoryTitle = mvGalleryTag.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        mvGalleryTag.selectedIndex = index;

    };

    //upload file
    mvGalleryTag.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (mvGalleryTag.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ mvGalleryTag.replaceFile(uploadFile.name);
                    mvGalleryTag.itemClicked(null, mvGalleryTag.fileIdToDelete, "file");
                    mvGalleryTag.fileTypes = 1;
                    mvGalleryTag.fileIdToDelete = mvGalleryTag.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                mvGalleryTag.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        mvGalleryTag.FileItem = response2.Item;
                        mvGalleryTag.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        mvGalleryTag.filePickerMainImage.filename =
                          mvGalleryTag.FileItem.FileName;
                        mvGalleryTag.filePickerMainImage.fileId =
                          response2.Item.Id;
                        mvGalleryTag.selectedItem.LinkMainImageId =
                          mvGalleryTag.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      mvGalleryTag.showErrorIcon();
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
                    mvGalleryTag.FileItem = response.Item;
                    mvGalleryTag.FileItem.FileName = uploadFile.name;
                    mvGalleryTag.FileItem.uploadName = uploadFile.uploadName;
                    mvGalleryTag.FileItem.Extension = uploadFile.name.split('.').pop();
                    mvGalleryTag.FileItem.FileSrc = uploadFile.name;
                    mvGalleryTag.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- mvGalleryTag.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", mvGalleryTag.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            mvGalleryTag.FileItem = response.Item;
                            mvGalleryTag.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            mvGalleryTag.filePickerMainImage.filename = mvGalleryTag.FileItem.FileName;
                            mvGalleryTag.filePickerMainImage.fileId = response.Item.Id;
                            mvGalleryTag.selectedItem.LinkMainImageId = mvGalleryTag.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        mvGalleryTag.showErrorIcon();
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
    mvGalleryTag.exportFile = function () {
        mvGalleryTag.gridOptions.advancedSearchData.engine.ExportFile = mvGalleryTag.ExportFileClass;
        mvGalleryTag.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'movieGallerytag/exportfile', mvGalleryTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            mvGalleryTag.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                mvGalleryTag.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //movieGalleryTag.closeModal();
            }
            mvGalleryTag.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    mvGalleryTag.toggleExportForm = function () {
        mvGalleryTag.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        mvGalleryTag.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        mvGalleryTag.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        mvGalleryTag.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        mvGalleryTag.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModulemovieGallery/movieGallerytag/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    mvGalleryTag.rowCountChanged = function () {
        if (!angular.isDefined(mvGalleryTag.ExportFileClass.RowCount) || mvGalleryTag.ExportFileClass.RowCount > 5000)
            mvGalleryTag.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    mvGalleryTag.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"movieGallerytag/count", mvGalleryTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            mvGalleryTag.addRequested = false;
            rashaErManage.checkAction(response);
            mvGalleryTag.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            mvGalleryTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    //TreeControl
    mvGalleryTag.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (mvGalleryTag.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    mvGalleryTag.onNodeToggle = function (node, expanded) {
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

    mvGalleryTag.onSelection = function (node, selected) {
        if (!selected) {
            mvGalleryTag.selectedItem.LinkMainImageId = null;
            mvGalleryTag.selectedItem.previewImageSrc = null;
            return;
        }
        mvGalleryTag.selectedItem.LinkMainImageId = node.Id;
        mvGalleryTag.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            mvGalleryTag.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);