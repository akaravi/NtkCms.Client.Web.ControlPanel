app.controller("serviceTagCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window','$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window,$state, $filter) {
    var serviceTag = this;
    var edititem=false;
    //For Grid Options
    serviceTag.gridOptions = {};
    serviceTag.selectedItem = {};
    serviceTag.attachedFiles = [];
    serviceTag.attachedFile = "";
    var todayDate = moment().format();
    serviceTag.DateBirth = {
        defaultDate: todayDate,
        viewTimePicker: true
    }
    serviceTag.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }

    serviceTag.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    serviceTag.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    serviceTag.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:serviceTag.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:serviceTag,
        useCurrentLocationZoom:12,
    }
    if (itemRecordStatus != undefined) serviceTag.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    serviceTag.selectedItem.ToDate = date;
    serviceTag.datePickerConfig = {
        defaultDate: date
    };
    serviceTag.startDate = {
        defaultDate: date
    }
    serviceTag.endDate = {
        defaultDate: date
    }
    serviceTag.count = 0;

//#help/ سلکتور دسته بندی در ویرایش محتوا
 serviceTag.LinkCategoryTagIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryTagId',
        url: 'serviceCategoryTag',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: serviceTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' }
            ]
        }
    }

    //service Grid Options
    serviceTag.gridOptions = {
        columns: [
            { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: "ActionKey", displayName: "لیست مطالب", displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="serviceTag.OpenContentTag(x.Id,x.Title)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }

    //Comment Grid Options
    serviceTag.gridContentOptions = {
        columns: [
           { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
           { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
           { name: 'Writer', displayName: 'نویسنده', sortable: true, type: 'string' },
           { name: 'Comment', displayName: 'کامنت', sortable: true, type: 'string' },
           { name: 'ActionButtons', displayName: 'کلید عملیاتی', template: '<Button ng-if="!x.IsActivated" ng-click="serviceTag.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button><Button ng-if="x.IsActivated" ng-click="serviceTag.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button><Button ng-click="serviceTag.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>' },
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
    serviceTag.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show service Loading Indicator
    serviceTag.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    serviceTag.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    serviceTag.OpenContentTag = function (LinkTagContentId,TitleTag) {
                $state.go("index.servicecontent", {
            ContentId: LinkTagContentId,
            TitleTag:TitleTag
        });
    }
    serviceTag.treeConfig.currentNode = {};
    serviceTag.treeBusyIndicator = false;
    serviceTag.addRequested = false;
    serviceTag.showGridComment = false;
    serviceTag.serviceTitle = "";

    //init Function
    serviceTag.init = function () {
        serviceTag.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"serviceCategorytag/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            serviceTag.treeConfig.Items = response.ListItems;
            serviceTag.treeConfig.Items = response.ListItems;
            serviceTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"servicetag/getall", serviceTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            serviceTag.ListItems = response.ListItems;
            serviceTag.gridOptions.fillData(serviceTag.ListItems, response.resultAccess); // Sending Access as an argument
            serviceTag.contentBusyIndicator.isActive = false;
            serviceTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            serviceTag.gridOptions.totalRowCount = response.TotalRowCount;
            serviceTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            serviceTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            serviceTag.contentBusyIndicator.isActive = false;
        });

    };



    serviceTag.gridContentOptions.onRowSelected = function () { }

    // Open Add Category Modal 
    serviceTag.addNewCategoryModel = function () {
        serviceTag.addRequested = false;
        ajax.call(cmsServerConfig.configApiServerPath+'serviceCategorytag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            serviceTag.selectedItem = response.Item;
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
                serviceTag.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(serviceTag.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/Moduleservice/serviceCategorytag/add.html',
                        scope: $scope
                    });
                    serviceTag.addRequested = false;
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
    serviceTag.openEditCategoryModel = function () {
        if (buttonIsPressed) return;
        serviceTag.addRequested = false;
        serviceTag.modalTitle = 'ویرایش';
        if (!serviceTag.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        serviceTag.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'serviceCategorytag/GetOne', serviceTag.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            serviceTag.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            serviceTag.selectedItem = response.Item;
            //Set dataForTheTree
            serviceTag.selectedNode = [];
            serviceTag.expandedNodes = [];
            serviceTag.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                serviceTag.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryTagId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(serviceTag.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (serviceTag.selectedItem.LinkMainImageId > 0)
                        serviceTag.onSelection({ Id: serviceTag.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/Moduleservice/serviceCategorytag/edit.html',
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
    serviceTag.addNewCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        serviceTag.categoryBusyIndicator.isActive = true;
        serviceTag.addRequested = true;
        serviceTag.selectedItem.LinkParentId = null;
        if (serviceTag.treeConfig.currentNode != null)
            serviceTag.selectedItem.LinkParentId = serviceTag.treeConfig.currentNode.Id;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'serviceCategorytag/add', serviceTag.selectedItem, 'POST').success(function (response) {
            buttonIsPressed = false;
            serviceTag.addRequested = false;
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                serviceTag.gridOptions.advancedSearchData.engine.Filters = null;
                serviceTag.gridOptions.advancedSearchData.engine.Filters = [];
                serviceTag.gridOptions.reGetAll();
                serviceTag.closeModal();
            }
            serviceTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            serviceTag.addRequested = false;
            serviceTag.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category
    serviceTag.editCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        serviceTag.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'serviceCategorytag/edit', serviceTag.selectedItem, 'PUT').success(function (response) {
            serviceTag.addRequested = true;
            //serviceTag.showbusy = false;
            serviceTag.treeConfig.showbusy = false;
            serviceTag.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                serviceTag.addRequested = false;
                serviceTag.treeConfig.currentNode.Title = response.Item.Title;
                serviceTag.closeModal();
            }
            serviceTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            serviceTag.addRequested = false;
            serviceTag.categoryBusyIndicator.isActive = false;
        });
    }

    // Delete a Category
    serviceTag.deleteCategory = function () {
        if (buttonIsPressed) return;
        var node = serviceTag.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                serviceTag.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'serviceCategorytag/GetOne', node.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    serviceTag.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'serviceCategorytag/delete', serviceTag.selectedItemForDelete, 'POST').success(function (res) {
                        serviceTag.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            serviceTag.gridOptions.advancedSearchData.engine.Filters = null;
                            serviceTag.gridOptions.advancedSearchData.engine.Filters = [];
                            serviceTag.gridOptions.fillData();
                            serviceTag.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        serviceTag.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    serviceTag.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    serviceTag.treeConfig.onNodeSelect = function () {
        var node = serviceTag.treeConfig.currentNode;
        serviceTag.showGridComment = false;
        serviceTag.CategoryTagId = node.Id;
        serviceTag.selectContent(node);
    };

    //Show Content with Category Id
    serviceTag.selectContent = function (node) {
        serviceTag.gridOptions.advancedSearchData.engine.Filters = null;
        serviceTag.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            serviceTag.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            serviceTag.contentBusyIndicator.isActive = true;

            serviceTag.attachedFiles = null;
            serviceTag.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryTagId",
                IntValue1: node.Id,
                SearchType: 0
            }
            serviceTag.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"servicetag/getall", serviceTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            serviceTag.contentBusyIndicator.isActive = false;
            serviceTag.ListItems = response.ListItems;
            serviceTag.gridOptions.fillData(serviceTag.ListItems, response.resultAccess); // Sending Access as an argument
            serviceTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            serviceTag.gridOptions.totalRowCount = response.TotalRowCount;
            serviceTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            serviceTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Open Add New Content Model
    serviceTag.openAddModel = function () {

        serviceTag.addRequested = false;
        serviceTag.modalTitle = 'اضافه کردن محتوای جدید';
        ajax.call(cmsServerConfig.configApiServerPath+'servicetag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            serviceTag.selectedItem = response.Item;
            serviceTag.selectedItem.LinkCategoryTagId = serviceTag.CategoryTagId;
            //serviceTag.clearPreviousData();
            $modal.open({
                templateUrl: 'cpanelv1/Moduleservice/servicetag/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    serviceTag.openEditModel = function () {
        if (buttonIsPressed) return;
        serviceTag.addRequested = false;
        serviceTag.modalTitle = 'ویرایش';
        if (!serviceTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'servicetag/GetOne', serviceTag.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            serviceTag.selectedItem = response1.Item;

            $modal.open({
                templateUrl: 'cpanelv1/Moduleservice/servicetag/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    serviceTag.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        serviceTag.categoryBusyIndicator.isActive = true;
        serviceTag.addRequested = true;


        ajax.call(cmsServerConfig.configApiServerPath+'servicetag/add', serviceTag.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            serviceTag.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                serviceTag.ListItems.unshift(response.Item);
                serviceTag.gridOptions.fillData(serviceTag.ListItems);
                serviceTag.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            serviceTag.addRequested = false;
            serviceTag.categoryBusyIndicator.isActive = false;
        });
    }

    //Edit Content
    serviceTag.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        serviceTag.categoryBusyIndicator.isActive = true;
        serviceTag.addRequested = true;


        ajax.call(cmsServerConfig.configApiServerPath+'servicetag/edit', serviceTag.selectedItem, 'PUT').success(function (response) {
            serviceTag.categoryBusyIndicator.isActive = false;
            serviceTag.addRequested = false;
            serviceTag.treeConfig.showbusy = false;
            serviceTag.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                serviceTag.replaceItem(serviceTag.selectedItem.Id, response.Item);
                serviceTag.gridOptions.fillData(serviceTag.ListItems);
                serviceTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            serviceTag.addRequested = false;
            serviceTag.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a service Content 
    serviceTag.deleteContent = function () {
        if (!serviceTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        serviceTag.treeConfig.showbusy = true;
        serviceTag.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                serviceTag.categoryBusyIndicator.isActive = true;
                console.log(serviceTag.gridOptions.selectedRow.item);
                serviceTag.showbusy = true;
                serviceTag.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+"servicetag/GetOne", serviceTag.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    serviceTag.showbusy = false;
                    serviceTag.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    serviceTag.selectedItemForDelete = response.Item;
                    console.log(serviceTag.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"servicetag/delete", serviceTag.selectedItemForDelete, 'POST').success(function (res) {
                        serviceTag.categoryBusyIndicator.isActive = false;
                        serviceTag.treeConfig.showbusy = false;
                        serviceTag.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            serviceTag.replaceItem(serviceTag.selectedItemForDelete.Id);
                            serviceTag.gridOptions.fillData(serviceTag.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        serviceTag.treeConfig.showbusy = false;
                        serviceTag.showIsBusy = false;
                        serviceTag.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    serviceTag.treeConfig.showbusy = false;
                    serviceTag.showIsBusy = false;
                    serviceTag.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }


    //Replace Item OnDelete/OnEdit Grid Options
    serviceTag.replaceItem = function (oldId, newItem) {
        angular.forEach(serviceTag.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = serviceTag.ListItems.indexOf(item);
                serviceTag.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            serviceTag.ListItems.unshift(newItem);
    }

    serviceTag.searchData = function () {
        serviceTag.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"servicetsg/getall", serviceTag.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            serviceTag.contentBusyIndicator.isActive = false;
            serviceTag.ListItems = response.ListItems;
            serviceTag.gridOptions.fillData(serviceTag.ListItems);
            serviceTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            serviceTag.gridOptions.totalRowCount = response.TotalRowCount;
            serviceTag.gridOptions.rowPerPage = response.RowPerPage;
            serviceTag.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            serviceTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    serviceTag.addRequested = false;
    serviceTag.closeModal = function () {
        $modalStack.dismissAll();
    };

    serviceTag.showIsBusy = false;



    //For reInit Categories
    serviceTag.gridOptions.reGetAll = function () {
        serviceTag.init();
    };

    serviceTag.isCurrentNodeEmpty = function () {
        return !angular.equals({}, serviceTag.treeConfig.currentNode);
    }

    serviceTag.loadFileAndFolder = function (item) {
        serviceTag.treeConfig.currentNode = item;
        console.log(item);
        serviceTag.treeConfig.onNodeSelect(item);
    }

    serviceTag.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    serviceTag.columnCheckbox = false;
    serviceTag.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = serviceTag.gridOptions.columns;
        if (serviceTag.gridOptions.columnCheckbox) {
            for (var i = 0; i < serviceTag.gridOptions.columns.length; i++) {
                var element = $("#" + serviceTag.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                serviceTag.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < serviceTag.gridOptions.columns.length; i++) {
                var element = $("#" + serviceTag.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + serviceTag.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < serviceTag.gridOptions.columns.length; i++) {
            console.log(serviceTag.gridOptions.columns[i].name.concat(".visible: "), serviceTag.gridOptions.columns[i].visible);
        }
        serviceTag.gridOptions.columnCheckbox = !serviceTag.gridOptions.columnCheckbox;
    }

    serviceTag.deleteAttachedFile = function (index) {
        serviceTag.attachedFiles.splice(index, 1);
    }

    serviceTag.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !serviceTag.alreadyExist(id, serviceTag.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = {
                id: fId, name: fname
            };
            serviceTag.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    serviceTag.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    serviceTag.filePickerMainImage.removeSelectedfile = function (config) {
        serviceTag.filePickerMainImage.fileId = null;
        serviceTag.filePickerMainImage.filename = null;
        serviceTag.selectedItem.LinkMainImageId = null;

    }

    serviceTag.filePickerFiles.removeSelectedfile = function (config) {
        serviceTag.filePickerFiles.fileId = null;
        serviceTag.filePickerFiles.filename = null;
        serviceTag.selectedItem.LinkFileIds = null;
    }


    serviceTag.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }

    // ----------- FilePicker Codes --------------------------------
    serviceTag.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !serviceTag.alreadyExist(id, serviceTag.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            serviceTag.attachedFiles.push(file);
            serviceTag.clearfilePickers();
        }
    }

    serviceTag.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                serviceTag.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    serviceTag.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;   //String is empty or whitespace then return
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            serviceTag.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    serviceTag.clearfilePickers = function () {
        serviceTag.filePickerFiles.fileId = null;
        serviceTag.filePickerFiles.filename = null;
    }

    serviceTag.stringfyLinkFileIds = function () {
        $.each(serviceTag.attachedFiles, function (i, item) {
            if (serviceTag.selectedItem.LinkFileIds == "")
                serviceTag.selectedItem.LinkFileIds = item.fileId;
            else
                serviceTag.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    serviceTag.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/Moduleservice/serviceContent/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        serviceTag.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            serviceTag.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    serviceTag.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    serviceTag.whatcolor = function (progress) {
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

    serviceTag.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    serviceTag.replaceFile = function (name) {
        serviceTag.itemClicked(null, serviceTag.fileIdToDelete, "file");
        serviceTag.fileTypes = 1;
        serviceTag.fileIdToDelete = serviceTag.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", serviceTag.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    serviceTag.remove(serviceTag.FileList, serviceTag.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                serviceTag.FileItem = response3.Item;
                                serviceTag.FileItem.FileName = name;
                                serviceTag.FileItem.Extension = name.split('.').pop();
                                serviceTag.FileItem.FileSrc = name;
                                serviceTag.FileItem.LinkCategoryId = serviceTag.thisCategory;
                                serviceTag.saveNewFile();
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
    serviceTag.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", serviceTag.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                serviceTag.FileItem = response.Item;
                serviceTag.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            serviceTag.showErrorIcon();
            return -1;
        });
    }

    serviceTag.showSuccessIcon = function () {
    }

    serviceTag.showErrorIcon = function () {

    }
    //file is exist
    serviceTag.fileIsExist = function (fileName) {
        for (var i = 0; i < serviceTag.FileList.length; i++) {
            if (serviceTag.FileList[i].FileName == fileName) {
                serviceTag.fileIdToDelete = serviceTag.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    serviceTag.getFileItem = function (id) {
        for (var i = 0; i < serviceTag.FileList.length; i++) {
            if (serviceTag.FileList[i].Id == id) {
                return serviceTag.FileList[i];
            }
        }
    }

    //select file or folder
    serviceTag.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            serviceTag.fileTypes = 1;
            serviceTag.selectedFileId = serviceTag.getFileItem(index).Id;
            serviceTag.selectedFileName = serviceTag.getFileItem(index).FileName;
        }
        else {
            serviceTag.fileTypes = 2;
            serviceTag.selectedCategoryId = serviceTag.getCategoryName(index).Id;
            serviceTag.selectedCategoryTitle = serviceTag.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        serviceTag.selectedIndex = index;

    };

    //upload file
    serviceTag.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (serviceTag.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ serviceTag.replaceFile(uploadFile.name);
                    serviceTag.itemClicked(null, serviceTag.fileIdToDelete, "file");
                    serviceTag.fileTypes = 1;
                    serviceTag.fileIdToDelete = serviceTag.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                serviceTag.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        serviceTag.FileItem = response2.Item;
                        serviceTag.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        serviceTag.filePickerMainImage.filename =
                          serviceTag.FileItem.FileName;
                        serviceTag.filePickerMainImage.fileId =
                          response2.Item.Id;
                        serviceTag.selectedItem.LinkMainImageId =
                          serviceTag.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      serviceTag.showErrorIcon();
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
                    serviceTag.FileItem = response.Item;
                    serviceTag.FileItem.FileName = uploadFile.name;
                    serviceTag.FileItem.uploadName = uploadFile.uploadName;
                    serviceTag.FileItem.Extension = uploadFile.name.split('.').pop();
                    serviceTag.FileItem.FileSrc = uploadFile.name;
                    serviceTag.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- serviceTag.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", serviceTag.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            serviceTag.FileItem = response.Item;
                            serviceTag.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            serviceTag.filePickerMainImage.filename = serviceTag.FileItem.FileName;
                            serviceTag.filePickerMainImage.fileId = response.Item.Id;
                            serviceTag.selectedItem.LinkMainImageId = serviceTag.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        serviceTag.showErrorIcon();
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
    serviceTag.exportFile = function () {
        serviceTag.gridOptions.advancedSearchData.engine.ExportFile = serviceTag.ExportFileClass;
        serviceTag.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'servicetag/exportfile', serviceTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            serviceTag.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                serviceTag.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //serviceTag.closeModal();
            }
            serviceTag.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    serviceTag.toggleExportForm = function () {
        serviceTag.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        serviceTag.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        serviceTag.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        serviceTag.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        serviceTag.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/Moduleservice/servicetag/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    serviceTag.rowCountChanged = function () {
        if (!angular.isDefined(serviceTag.ExportFileClass.RowCount) || serviceTag.ExportFileClass.RowCount > 5000)
            serviceTag.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    serviceTag.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"servicetag/count", serviceTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            serviceTag.addRequested = false;
            rashaErManage.checkAction(response);
            serviceTag.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            serviceTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    //TreeControl
    serviceTag.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (serviceTag.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    serviceTag.onNodeToggle = function (node, expanded) {
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

    serviceTag.onSelection = function (node, selected) {
        if (!selected) {
            serviceTag.selectedItem.LinkMainImageId = null;
            serviceTag.selectedItem.previewImageSrc = null;
            return;
        }
        serviceTag.selectedItem.LinkMainImageId = node.Id;
        serviceTag.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            serviceTag.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);