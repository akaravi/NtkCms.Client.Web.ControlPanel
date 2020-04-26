app.controller("reservationTagCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $state, $filter) {
    var reservationTag = this;
    var edititem=false;
    //For Grid Options
    reservationTag.gridOptions = {};
    reservationTag.selectedItem = {};
    reservationTag.attachedFiles = [];
    reservationTag.attachedFile = "";
    var todayDate = moment().format();
    reservationTag.DateBirth = {
        defaultDate: todayDate,
        viewTimePicker: true
    }
    reservationTag.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }

    reservationTag.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    reservationTag.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    reservationTag.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:reservationTag.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:reservationTag,
        useCurrentLocationZoom:12,
    }
    if (itemRecordStatus != undefined) reservationTag.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    reservationTag.selectedItem.ToDate = date;
    reservationTag.datePickerConfig = {
        defaultDate: date
    };
    reservationTag.startDate = {
        defaultDate: date
    }
    reservationTag.endDate = {
        defaultDate: date
    }
    reservationTag.count = 0;

//#help/ سلکتور دسته بندی در ویرایش محتوا
 reservationTag.LinkCategoryTagIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryTagId',
        url: 'reservationCategoryTag',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: reservationTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' }
            ]
        }
    }

    //reservation Grid Options
    reservationTag.gridOptions = {
        columns: [
            { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: "ActionKey", displayName: "لیست مطالب", displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="reservationTag.OpenContentTag(x.Id,x.Title)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }

    //Comment Grid Options
    reservationTag.gridContentOptions = {
        columns: [
           { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
           { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
           { name: 'Writer', displayName: 'نویسنده', sortable: true, type: 'string' },
           { name: 'Comment', displayName: 'کامنت', sortable: true, type: 'string' },
           { name: 'ActionButtons', displayName: 'کلید عملیاتی', template: '<Button ng-if="!x.IsActivated" ng-click="reservationTag.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button><Button ng-if="x.IsActivated" ng-click="reservationTag.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button><Button ng-click="reservationTag.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>' },
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
    reservationTag.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show reservation Loading Indicator
    reservationTag.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    reservationTag.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    reservationTag.OpenContentTag = function (LinkTagContentId,TitleTag) {
                $state.go("index.reservationcontent", {
            ContentId: LinkTagContentId,
            TitleTag:TitleTag
        });
    }
    reservationTag.treeConfig.currentNode = {};
    reservationTag.treeBusyIndicator = false;
    reservationTag.addRequested = false;
    reservationTag.showGridComment = false;
    reservationTag.reservationTitle = "";

    //init Function
    reservationTag.init = function () {
        reservationTag.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"reservationCategorytag/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            reservationTag.treeConfig.Items = response.ListItems;
            reservationTag.treeConfig.Items = response.ListItems;
            reservationTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"reservationtag/getall", reservationTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            reservationTag.ListItems = response.ListItems;
            reservationTag.gridOptions.fillData(reservationTag.ListItems, response.resultAccess); // Sending Access as an argument
            reservationTag.contentBusyIndicator.isActive = false;
            reservationTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            reservationTag.gridOptions.totalRowCount = response.TotalRowCount;
            reservationTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            reservationTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            reservationTag.contentBusyIndicator.isActive = false;
        });

    };



    reservationTag.gridContentOptions.onRowSelected = function () { }

    // Open Add Category Modal 
    reservationTag.addNewCategoryModel = function () {
        reservationTag.addRequested = false;
        ajax.call(cmsServerConfig.configApiServerPath+'reservationCategorytag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            reservationTag.selectedItem = response.Item;
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
                reservationTag.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(reservationTag.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/Modulereservation/reservationCategorytag/add.html',
                        scope: $scope
                    });
                    reservationTag.addRequested = false;
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
    reservationTag.openEditCategoryModel = function () {
        if (buttonIsPressed) return;
        reservationTag.addRequested = false;
        reservationTag.modalTitle = 'ویرایش';
        if (!reservationTag.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        reservationTag.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'reservationCategorytag/GetOne', reservationTag.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            reservationTag.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            reservationTag.selectedItem = response.Item;
            //Set dataForTheTree
            reservationTag.selectedNode = [];
            reservationTag.expandedNodes = [];
            reservationTag.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                reservationTag.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryTagId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(reservationTag.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (reservationTag.selectedItem.LinkMainImageId > 0)
                        reservationTag.onSelection({ Id: reservationTag.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/Modulereservation/reservationCategorytag/edit.html',
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
    reservationTag.addNewCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        reservationTag.categoryBusyIndicator.isActive = true;
        reservationTag.addRequested = true;
        reservationTag.selectedItem.LinkParentId = null;
        if (reservationTag.treeConfig.currentNode != null)
            reservationTag.selectedItem.LinkParentId = reservationTag.treeConfig.currentNode.Id;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'reservationCategorytag/add', reservationTag.selectedItem, 'POST').success(function (response) {
            buttonIsPressed = false;
            reservationTag.addRequested = false;
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                reservationTag.gridOptions.advancedSearchData.engine.Filters = null;
                reservationTag.gridOptions.advancedSearchData.engine.Filters = [];
                reservationTag.gridOptions.reGetAll();
                reservationTag.closeModal();
            }
            reservationTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            reservationTag.addRequested = false;
            reservationTag.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category
    reservationTag.editCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        reservationTag.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'reservationCategorytag/edit', reservationTag.selectedItem, 'PUT').success(function (response) {
            reservationTag.addRequested = true;
            //reservationTag.showbusy = false;
            reservationTag.treeConfig.showbusy = false;
            reservationTag.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                reservationTag.addRequested = false;
                reservationTag.treeConfig.currentNode.Title = response.Item.Title;
                reservationTag.closeModal();
            }
            reservationTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            reservationTag.addRequested = false;
            reservationTag.categoryBusyIndicator.isActive = false;
        });
    }

    // Delete a Category
    reservationTag.deleteCategory = function () {
        if (buttonIsPressed) return;
        var node = reservationTag.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                reservationTag.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'reservationCategorytag/GetOne', node.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    reservationTag.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'reservationCategorytag/delete', reservationTag.selectedItemForDelete, 'POST').success(function (res) {
                        reservationTag.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            reservationTag.gridOptions.advancedSearchData.engine.Filters = null;
                            reservationTag.gridOptions.advancedSearchData.engine.Filters = [];
                            reservationTag.gridOptions.fillData();
                            reservationTag.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        reservationTag.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    reservationTag.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    reservationTag.treeConfig.onNodeSelect = function () {
        var node = reservationTag.treeConfig.currentNode;
        reservationTag.showGridComment = false;
        reservationTag.CategoryTagId = node.Id;
        reservationTag.selectContent(node);
    };

    //Show Content with Category Id
    reservationTag.selectContent = function (node) {
        reservationTag.gridOptions.advancedSearchData.engine.Filters = null;
        reservationTag.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            reservationTag.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            reservationTag.contentBusyIndicator.isActive = true;

            reservationTag.attachedFiles = null;
            reservationTag.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryTagId",
                IntValue1: node.Id,
                SearchType: 0
            }
            reservationTag.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"reservationtag/getall", reservationTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            reservationTag.contentBusyIndicator.isActive = false;
            reservationTag.ListItems = response.ListItems;
            reservationTag.gridOptions.fillData(reservationTag.ListItems, response.resultAccess); // Sending Access as an argument
            reservationTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            reservationTag.gridOptions.totalRowCount = response.TotalRowCount;
            reservationTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            reservationTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Open Add New Content Model
    reservationTag.openAddModel = function () {

        reservationTag.addRequested = false;
        reservationTag.modalTitle = 'اضافه کردن محتوای جدید';
        ajax.call(cmsServerConfig.configApiServerPath+'reservationtag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            reservationTag.selectedItem = response.Item;
            reservationTag.selectedItem.LinkCategoryTagId = reservationTag.CategoryTagId;
            //reservationTag.clearPreviousData();
            $modal.open({
                templateUrl: 'cpanelv1/Modulereservation/reservationtag/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    reservationTag.openEditModel = function () {
        if (buttonIsPressed) return;
        reservationTag.addRequested = false;
        reservationTag.modalTitle = 'ویرایش';
        if (!reservationTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'reservationtag/GetOne', reservationTag.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            reservationTag.selectedItem = response1.Item;

            $modal.open({
                templateUrl: 'cpanelv1/Modulereservation/reservationtag/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    reservationTag.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        reservationTag.categoryBusyIndicator.isActive = true;
        reservationTag.addRequested = true;


        ajax.call(cmsServerConfig.configApiServerPath+'reservationtag/add', reservationTag.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            reservationTag.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                reservationTag.ListItems.unshift(response.Item);
                reservationTag.gridOptions.fillData(reservationTag.ListItems);
                reservationTag.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            reservationTag.addRequested = false;
            reservationTag.categoryBusyIndicator.isActive = false;
        });
    }

    //Edit Content
    reservationTag.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        reservationTag.categoryBusyIndicator.isActive = true;
        reservationTag.addRequested = true;


        ajax.call(cmsServerConfig.configApiServerPath+'reservationtag/edit', reservationTag.selectedItem, 'PUT').success(function (response) {
            reservationTag.categoryBusyIndicator.isActive = false;
            reservationTag.addRequested = false;
            reservationTag.treeConfig.showbusy = false;
            reservationTag.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                reservationTag.replaceItem(reservationTag.selectedItem.Id, response.Item);
                reservationTag.gridOptions.fillData(reservationTag.ListItems);
                reservationTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            reservationTag.addRequested = false;
            reservationTag.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a reservation Content 
    reservationTag.deleteContent = function () {
        if (!reservationTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        reservationTag.treeConfig.showbusy = true;
        reservationTag.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                reservationTag.categoryBusyIndicator.isActive = true;
                console.log(reservationTag.gridOptions.selectedRow.item);
                reservationTag.showbusy = true;
                reservationTag.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+"reservationtag/GetOne", reservationTag.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    reservationTag.showbusy = false;
                    reservationTag.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    reservationTag.selectedItemForDelete = response.Item;
                    console.log(reservationTag.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"reservationtag/delete", reservationTag.selectedItemForDelete, 'POST').success(function (res) {
                        reservationTag.categoryBusyIndicator.isActive = false;
                        reservationTag.treeConfig.showbusy = false;
                        reservationTag.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            reservationTag.replaceItem(reservationTag.selectedItemForDelete.Id);
                            reservationTag.gridOptions.fillData(reservationTag.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        reservationTag.treeConfig.showbusy = false;
                        reservationTag.showIsBusy = false;
                        reservationTag.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    reservationTag.treeConfig.showbusy = false;
                    reservationTag.showIsBusy = false;
                    reservationTag.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }


    //Replace Item OnDelete/OnEdit Grid Options
    reservationTag.replaceItem = function (oldId, newItem) {
        angular.forEach(reservationTag.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = reservationTag.ListItems.indexOf(item);
                reservationTag.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            reservationTag.ListItems.unshift(newItem);
    }

    reservationTag.searchData = function () {
        reservationTag.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"reservationtsg/getall", reservationTag.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            reservationTag.contentBusyIndicator.isActive = false;
            reservationTag.ListItems = response.ListItems;
            reservationTag.gridOptions.fillData(reservationTag.ListItems);
            reservationTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            reservationTag.gridOptions.totalRowCount = response.TotalRowCount;
            reservationTag.gridOptions.rowPerPage = response.RowPerPage;
            reservationTag.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            reservationTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    reservationTag.addRequested = false;
    reservationTag.closeModal = function () {
        $modalStack.dismissAll();
    };

    reservationTag.showIsBusy = false;



    //For reInit Categories
    reservationTag.gridOptions.reGetAll = function () {
        reservationTag.init();
    };

    reservationTag.isCurrentNodeEmpty = function () {
        return !angular.equals({}, reservationTag.treeConfig.currentNode);
    }

    reservationTag.loadFileAndFolder = function (item) {
        reservationTag.treeConfig.currentNode = item;
        console.log(item);
        reservationTag.treeConfig.onNodeSelect(item);
    }

    reservationTag.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    reservationTag.columnCheckbox = false;
    reservationTag.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = reservationTag.gridOptions.columns;
        if (reservationTag.gridOptions.columnCheckbox) {
            for (var i = 0; i < reservationTag.gridOptions.columns.length; i++) {
                var element = $("#" + reservationTag.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                reservationTag.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < reservationTag.gridOptions.columns.length; i++) {
                var element = $("#" + reservationTag.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + reservationTag.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < reservationTag.gridOptions.columns.length; i++) {
            console.log(reservationTag.gridOptions.columns[i].name.concat(".visible: "), reservationTag.gridOptions.columns[i].visible);
        }
        reservationTag.gridOptions.columnCheckbox = !reservationTag.gridOptions.columnCheckbox;
    }

    reservationTag.deleteAttachedFile = function (index) {
        reservationTag.attachedFiles.splice(index, 1);
    }

    reservationTag.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !reservationTag.alreadyExist(id, reservationTag.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = {
                id: fId, name: fname
            };
            reservationTag.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    reservationTag.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    reservationTag.filePickerMainImage.removeSelectedfile = function (config) {
        reservationTag.filePickerMainImage.fileId = null;
        reservationTag.filePickerMainImage.filename = null;
        reservationTag.selectedItem.LinkMainImageId = null;

    }

    reservationTag.filePickerFiles.removeSelectedfile = function (config) {
        reservationTag.filePickerFiles.fileId = null;
        reservationTag.filePickerFiles.filename = null;
        reservationTag.selectedItem.LinkFileIds = null;
    }


    reservationTag.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }

    // ----------- FilePicker Codes --------------------------------
    reservationTag.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !reservationTag.alreadyExist(id, reservationTag.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            reservationTag.attachedFiles.push(file);
            reservationTag.clearfilePickers();
        }
    }

    reservationTag.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                reservationTag.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    reservationTag.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;   //String is empty or whitespace then return
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            reservationTag.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    reservationTag.clearfilePickers = function () {
        reservationTag.filePickerFiles.fileId = null;
        reservationTag.filePickerFiles.filename = null;
    }

    reservationTag.stringfyLinkFileIds = function () {
        $.each(reservationTag.attachedFiles, function (i, item) {
            if (reservationTag.selectedItem.LinkFileIds == "")
                reservationTag.selectedItem.LinkFileIds = item.fileId;
            else
                reservationTag.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    reservationTag.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/Modulereservation/reservationContent/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        reservationTag.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            reservationTag.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    reservationTag.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    reservationTag.whatcolor = function (progress) {
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

    reservationTag.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    reservationTag.replaceFile = function (name) {
        reservationTag.itemClicked(null, reservationTag.fileIdToDelete, "file");
        reservationTag.fileTypes = 1;
        reservationTag.fileIdToDelete = reservationTag.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", reservationTag.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    reservationTag.remove(reservationTag.FileList, reservationTag.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                reservationTag.FileItem = response3.Item;
                                reservationTag.FileItem.FileName = name;
                                reservationTag.FileItem.Extension = name.split('.').pop();
                                reservationTag.FileItem.FileSrc = name;
                                reservationTag.FileItem.LinkCategoryId = reservationTag.thisCategory;
                                reservationTag.saveNewFile();
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
    reservationTag.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", reservationTag.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                reservationTag.FileItem = response.Item;
                reservationTag.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            reservationTag.showErrorIcon();
            return -1;
        });
    }

    reservationTag.showSuccessIcon = function () {
    }

    reservationTag.showErrorIcon = function () {

    }
    //file is exist
    reservationTag.fileIsExist = function (fileName) {
        for (var i = 0; i < reservationTag.FileList.length; i++) {
            if (reservationTag.FileList[i].FileName == fileName) {
                reservationTag.fileIdToDelete = reservationTag.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    reservationTag.getFileItem = function (id) {
        for (var i = 0; i < reservationTag.FileList.length; i++) {
            if (reservationTag.FileList[i].Id == id) {
                return reservationTag.FileList[i];
            }
        }
    }

    //select file or folder
    reservationTag.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            reservationTag.fileTypes = 1;
            reservationTag.selectedFileId = reservationTag.getFileItem(index).Id;
            reservationTag.selectedFileName = reservationTag.getFileItem(index).FileName;
        }
        else {
            reservationTag.fileTypes = 2;
            reservationTag.selectedCategoryId = reservationTag.getCategoryName(index).Id;
            reservationTag.selectedCategoryTitle = reservationTag.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        reservationTag.selectedIndex = index;

    };

    //upload file
    reservationTag.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (reservationTag.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ reservationTag.replaceFile(uploadFile.name);
                    reservationTag.itemClicked(null, reservationTag.fileIdToDelete, "file");
                    reservationTag.fileTypes = 1;
                    reservationTag.fileIdToDelete = reservationTag.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                reservationTag.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        reservationTag.FileItem = response2.Item;
                        reservationTag.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        reservationTag.filePickerMainImage.filename =
                          reservationTag.FileItem.FileName;
                        reservationTag.filePickerMainImage.fileId =
                          response2.Item.Id;
                        reservationTag.selectedItem.LinkMainImageId =
                          reservationTag.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      reservationTag.showErrorIcon();
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
                    reservationTag.FileItem = response.Item;
                    reservationTag.FileItem.FileName = uploadFile.name;
                    reservationTag.FileItem.uploadName = uploadFile.uploadName;
                    reservationTag.FileItem.Extension = uploadFile.name.split('.').pop();
                    reservationTag.FileItem.FileSrc = uploadFile.name;
                    reservationTag.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- reservationTag.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", reservationTag.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            reservationTag.FileItem = response.Item;
                            reservationTag.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            reservationTag.filePickerMainImage.filename = reservationTag.FileItem.FileName;
                            reservationTag.filePickerMainImage.fileId = response.Item.Id;
                            reservationTag.selectedItem.LinkMainImageId = reservationTag.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        reservationTag.showErrorIcon();
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
    reservationTag.exportFile = function () {
        reservationTag.gridOptions.advancedSearchData.engine.ExportFile = reservationTag.ExportFileClass;
        reservationTag.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'reservationtag/exportfile', reservationTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            reservationTag.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                reservationTag.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //reservationTag.closeModal();
            }
            reservationTag.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    reservationTag.toggleExportForm = function () {
        reservationTag.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        reservationTag.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        reservationTag.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        reservationTag.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        reservationTag.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/Modulereservation/reservationtag/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    reservationTag.rowCountChanged = function () {
        if (!angular.isDefined(reservationTag.ExportFileClass.RowCount) || reservationTag.ExportFileClass.RowCount > 5000)
            reservationTag.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    reservationTag.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"reservationtag/count", reservationTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            reservationTag.addRequested = false;
            rashaErManage.checkAction(response);
            reservationTag.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            reservationTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    //TreeControl
    reservationTag.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (reservationTag.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    reservationTag.onNodeToggle = function (node, expanded) {
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

    reservationTag.onSelection = function (node, selected) {
        if (!selected) {
            reservationTag.selectedItem.LinkMainImageId = null;
            reservationTag.selectedItem.previewImageSrc = null;
            return;
        }
        reservationTag.selectedItem.LinkMainImageId = node.Id;
        reservationTag.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            reservationTag.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);