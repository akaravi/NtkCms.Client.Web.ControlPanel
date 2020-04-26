app.controller("chartTagCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window','$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window,$state, $filter) {
    var chartTag = this;
    var edititem=false;
    //For Grid Options
    chartTag.gridOptions = {};
    chartTag.selectedItem = {};
    chartTag.attachedFiles = [];
    chartTag.attachedFile = "";
    var todayDate = moment().format();
    chartTag.DateBirth = {
        defaultDate: todayDate,
        viewTimePicker: true
    }
    chartTag.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }

    chartTag.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    chartTag.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    chartTag.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:chartTag.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:chartTag,
        useCurrentLocationZoom:12,
    }
    if (itemRecordStatus != undefined) chartTag.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    chartTag.selectedItem.ToDate = date;
    chartTag.datePickerConfig = {
        defaultDate: date
    };
    chartTag.startDate = {
        defaultDate: date
    }
    chartTag.endDate = {
        defaultDate: date
    }
    chartTag.count = 0;

//#help/ سلکتور دسته بندی در ویرایش محتوا
 chartTag.LinkCategoryTagIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryTagId',
        url: 'chartCategoryTag',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: chartTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' }
            ]
        }
    }

    //chart Grid Options
    chartTag.gridOptions = {
        columns: [
            { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: "ActionKey", displayName: "لیست مطالب", displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="chartTag.OpenContentTag(x.Id,x.Title)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }

    //Comment Grid Options
    chartTag.gridContentOptions = {
        columns: [
           { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
           { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
           { name: 'Writer', displayName: 'نویسنده', sortable: true, type: 'string' },
           { name: 'Comment', displayName: 'کامنت', sortable: true, type: 'string' },
           { name: 'ActionButtons', displayName: 'کلید عملیاتی', template: '<Button ng-if="!x.IsActivated" ng-click="chartTag.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button><Button ng-if="x.IsActivated" ng-click="chartTag.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button><Button ng-click="chartTag.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>' },
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
    chartTag.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show chart Loading Indicator
    chartTag.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    chartTag.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    chartTag.OpenContentTag = function (LinkTagContentId,TitleTag) {
                $state.go("index.chartcontent", {
            ContentId: LinkTagContentId,
            TitleTag:TitleTag
        });
    }
    chartTag.treeConfig.currentNode = {};
    chartTag.treeBusyIndicator = false;
    chartTag.addRequested = false;
    chartTag.showGridComment = false;
    chartTag.chartTitle = "";

    //init Function
    chartTag.init = function () {
        chartTag.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"chartCategorytag/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            chartTag.treeConfig.Items = response.ListItems;
            chartTag.treeConfig.Items = response.ListItems;
            chartTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"charttag/getall", chartTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            chartTag.ListItems = response.ListItems;
            chartTag.gridOptions.fillData(chartTag.ListItems, response.resultAccess); // Sending Access as an argument
            chartTag.contentBusyIndicator.isActive = false;
            chartTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            chartTag.gridOptions.totalRowCount = response.TotalRowCount;
            chartTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            chartTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            chartTag.contentBusyIndicator.isActive = false;
        });

    };



    chartTag.gridContentOptions.onRowSelected = function () { }

    // Open Add Category Modal 
    chartTag.addNewCategoryModel = function () {
        chartTag.addRequested = false;
        ajax.call(cmsServerConfig.configApiServerPath+'chartCategorytag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            chartTag.selectedItem = response.Item;
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
                chartTag.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(chartTag.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/Modulechart/chartCategorytag/add.html',
                        scope: $scope
                    });
                    chartTag.addRequested = false;
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
    chartTag.openEditCategoryModel = function () {
        if (buttonIsPressed) return;
        chartTag.addRequested = false;
        chartTag.modalTitle = 'ویرایش';
        if (!chartTag.treeConfig.currentNode || chartTag.treeConfig.currentNode.Id <= 0 || chartTag.treeConfig.currentNode.Id == undefined) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        chartTag.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'chartCategorytag/GetOne', chartTag.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            chartTag.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            chartTag.selectedItem = response.Item;
            //Set dataForTheTree
            chartTag.selectedNode = [];
            chartTag.expandedNodes = [];
            chartTag.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                chartTag.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryTagId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(chartTag.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (chartTag.selectedItem.LinkMainImageId > 0)
                        chartTag.onSelection({ Id: chartTag.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/Modulechart/chartCategorytag/edit.html',
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
    chartTag.addNewCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        chartTag.categoryBusyIndicator.isActive = true;
        chartTag.addRequested = true;
        chartTag.selectedItem.LinkParentId = null;
        if (chartTag.treeConfig.currentNode != null)
            chartTag.selectedItem.LinkParentId = chartTag.treeConfig.currentNode.Id;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'chartCategorytag/add', chartTag.selectedItem, 'POST').success(function (response) {
            buttonIsPressed = false;
            chartTag.addRequested = false;
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                chartTag.gridOptions.advancedSearchData.engine.Filters = null;
                chartTag.gridOptions.advancedSearchData.engine.Filters = [];
                chartTag.gridOptions.reGetAll();
                chartTag.closeModal();
            }
            chartTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            chartTag.addRequested = false;
            chartTag.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category
    chartTag.editCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        chartTag.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'chartCategorytag/edit', chartTag.selectedItem, 'PUT').success(function (response) {
            chartTag.addRequested = true;
            //chartTag.showbusy = false;
            chartTag.treeConfig.showbusy = false;
            chartTag.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                chartTag.addRequested = false;
                chartTag.treeConfig.currentNode.Title = response.Item.Title;
                chartTag.closeModal();
            }
            chartTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            chartTag.addRequested = false;
            chartTag.categoryBusyIndicator.isActive = false;
        });
    }

    // Delete a Category
    chartTag.deleteCategory = function () {
        if (buttonIsPressed) return;
        var node = chartTag.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                chartTag.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'chartCategorytag/GetOne', node.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    chartTag.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'chartCategorytag/delete', chartTag.selectedItemForDelete, 'POST').success(function (res) {
                        chartTag.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            chartTag.gridOptions.advancedSearchData.engine.Filters = null;
                            chartTag.gridOptions.advancedSearchData.engine.Filters = [];
                            chartTag.gridOptions.fillData();
                            chartTag.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        chartTag.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    chartTag.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }
    
    //Tree On Node Select Options
    chartTag.treeConfig.onNodeSelect = function () {
        var node = chartTag.treeConfig.currentNode;
        chartTag.showGridComment = false;
        chartTag.CategoryTagId = node.Id;
        chartTag.selectContent(node);
    };

    //Show Content with Category Id
    chartTag.selectContent = function (node) {
        chartTag.gridOptions.advancedSearchData.engine.Filters = null;
        chartTag.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            chartTag.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            chartTag.contentBusyIndicator.isActive = true;

            chartTag.attachedFiles = null;
            chartTag.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryTagId",
                IntValue1: node.Id,
                SearchType: 0
            }
            chartTag.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"charttag/getall", chartTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            chartTag.contentBusyIndicator.isActive = false;
            chartTag.ListItems = response.ListItems;
            chartTag.gridOptions.fillData(chartTag.ListItems, response.resultAccess); // Sending Access as an argument
            chartTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            chartTag.gridOptions.totalRowCount = response.TotalRowCount;
            chartTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            chartTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Open Add New Content Model
    chartTag.openAddModel = function () {

        chartTag.addRequested = false;
        chartTag.modalTitle = 'اضافه کردن محتوای جدید';
        ajax.call(cmsServerConfig.configApiServerPath+'charttag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            chartTag.selectedItem = response.Item;
            chartTag.selectedItem.LinkCategoryTagId = chartTag.CategoryTagId;

            //chartTag.clearPreviousData();
            $modal.open({
                templateUrl: 'cpanelv1/Modulechart/charttag/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    chartTag.openEditModel = function () {
        if (buttonIsPressed) return;
        chartTag.addRequested = false;
        chartTag.modalTitle = 'ویرایش';
        if (!chartTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'charttag/GetOne', chartTag.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            chartTag.selectedItem = response1.Item;

            $modal.open({
                templateUrl: 'cpanelv1/Modulechart/charttag/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    chartTag.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        chartTag.categoryBusyIndicator.isActive = true;
        chartTag.addRequested = true;


        ajax.call(cmsServerConfig.configApiServerPath+'charttag/add', chartTag.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            chartTag.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                chartTag.ListItems.unshift(response.Item);
                chartTag.gridOptions.fillData(chartTag.ListItems);
                chartTag.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            chartTag.addRequested = false;
            chartTag.categoryBusyIndicator.isActive = false;
        });
    }

    //Edit Content
    chartTag.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        chartTag.categoryBusyIndicator.isActive = true;
        chartTag.addRequested = true;


        ajax.call(cmsServerConfig.configApiServerPath+'charttag/edit', chartTag.selectedItem, 'PUT').success(function (response) {
            chartTag.categoryBusyIndicator.isActive = false;
            chartTag.addRequested = false;
            chartTag.treeConfig.showbusy = false;
            chartTag.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                chartTag.replaceItem(chartTag.selectedItem.Id, response.Item);
                chartTag.gridOptions.fillData(chartTag.ListItems);
                chartTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            chartTag.addRequested = false;
            chartTag.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a chart Content 
    chartTag.deleteContent = function () {
        if (!chartTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        chartTag.treeConfig.showbusy = true;
        chartTag.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                chartTag.categoryBusyIndicator.isActive = true;
                console.log(chartTag.gridOptions.selectedRow.item);
                chartTag.showbusy = true;
                chartTag.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+"charttag/GetOne", chartTag.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    chartTag.showbusy = false;
                    chartTag.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    chartTag.selectedItemForDelete = response.Item;
                    console.log(chartTag.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"charttag/delete", chartTag.selectedItemForDelete, 'POST').success(function (res) {
                        chartTag.categoryBusyIndicator.isActive = false;
                        chartTag.treeConfig.showbusy = false;
                        chartTag.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            chartTag.replaceItem(chartTag.selectedItemForDelete.Id);
                            chartTag.gridOptions.fillData(chartTag.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        chartTag.treeConfig.showbusy = false;
                        chartTag.showIsBusy = false;
                        chartTag.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    chartTag.treeConfig.showbusy = false;
                    chartTag.showIsBusy = false;
                    chartTag.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }


    //Replace Item OnDelete/OnEdit Grid Options
    chartTag.replaceItem = function (oldId, newItem) {
        angular.forEach(chartTag.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = chartTag.ListItems.indexOf(item);
                chartTag.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            chartTag.ListItems.unshift(newItem);
    }

    chartTag.searchData = function () {
        chartTag.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"charttsg/getall", chartTag.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            chartTag.contentBusyIndicator.isActive = false;
            chartTag.ListItems = response.ListItems;
            chartTag.gridOptions.fillData(chartTag.ListItems);
            chartTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            chartTag.gridOptions.totalRowCount = response.TotalRowCount;
            chartTag.gridOptions.rowPerPage = response.RowPerPage;
            chartTag.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            chartTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    chartTag.addRequested = false;
    chartTag.closeModal = function () {
        $modalStack.dismissAll();
    };

    chartTag.showIsBusy = false;



    //For reInit Categories
    chartTag.gridOptions.reGetAll = function () {
        chartTag.init();
    };

    chartTag.isCurrentNodeEmpty = function () {
        return !angular.equals({}, chartTag.treeConfig.currentNode);
    }

    chartTag.loadFileAndFolder = function (item) {
        chartTag.treeConfig.currentNode = item;
        console.log(item);
        chartTag.treeConfig.onNodeSelect(item);
    }

    chartTag.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    chartTag.columnCheckbox = false;
    chartTag.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = chartTag.gridOptions.columns;
        if (chartTag.gridOptions.columnCheckbox) {
            for (var i = 0; i < chartTag.gridOptions.columns.length; i++) {
                var element = $("#" + chartTag.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                chartTag.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < chartTag.gridOptions.columns.length; i++) {
                var element = $("#" + chartTag.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + chartTag.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < chartTag.gridOptions.columns.length; i++) {
            console.log(chartTag.gridOptions.columns[i].name.concat(".visible: "), chartTag.gridOptions.columns[i].visible);
        }
        chartTag.gridOptions.columnCheckbox = !chartTag.gridOptions.columnCheckbox;
    }

    chartTag.deleteAttachedFile = function (index) {
        chartTag.attachedFiles.splice(index, 1);
    }

    chartTag.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !chartTag.alreadyExist(id, chartTag.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = {
                id: fId, name: fname
            };
            chartTag.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    chartTag.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    chartTag.filePickerMainImage.removeSelectedfile = function (config) {
        chartTag.filePickerMainImage.fileId = null;
        chartTag.filePickerMainImage.filename = null;
        chartTag.selectedItem.LinkMainImageId = null;

    }

    chartTag.filePickerFiles.removeSelectedfile = function (config) {
        chartTag.filePickerFiles.fileId = null;
        chartTag.filePickerFiles.filename = null;
        chartTag.selectedItem.LinkFileIds = null;
    }


    chartTag.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }

    // ----------- FilePicker Codes --------------------------------
    chartTag.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !chartTag.alreadyExist(id, chartTag.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            chartTag.attachedFiles.push(file);
            chartTag.clearfilePickers();
        }
    }

    chartTag.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                chartTag.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    chartTag.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;   //String is empty or whitespace then return
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            chartTag.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    chartTag.clearfilePickers = function () {
        chartTag.filePickerFiles.fileId = null;
        chartTag.filePickerFiles.filename = null;
    }

    chartTag.stringfyLinkFileIds = function () {
        $.each(chartTag.attachedFiles, function (i, item) {
            if (chartTag.selectedItem.LinkFileIds == "")
                chartTag.selectedItem.LinkFileIds = item.fileId;
            else
                chartTag.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    chartTag.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/Modulechart/chartContent/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        chartTag.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            chartTag.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    chartTag.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    chartTag.whatcolor = function (progress) {
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

    chartTag.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    chartTag.replaceFile = function (name) {
        chartTag.itemClicked(null, chartTag.fileIdToDelete, "file");
        chartTag.fileTypes = 1;
        chartTag.fileIdToDelete = chartTag.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", chartTag.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    chartTag.remove(chartTag.FileList, chartTag.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                chartTag.FileItem = response3.Item;
                                chartTag.FileItem.FileName = name;
                                chartTag.FileItem.Extension = name.split('.').pop();
                                chartTag.FileItem.FileSrc = name;
                                chartTag.FileItem.LinkCategoryId = chartTag.thisCategory;
                                chartTag.saveNewFile();
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
    chartTag.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", chartTag.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                chartTag.FileItem = response.Item;
                chartTag.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            chartTag.showErrorIcon();
            return -1;
        });
    }

    chartTag.showSuccessIcon = function () {
    }

    chartTag.showErrorIcon = function () {

    }
    //file is exist
    chartTag.fileIsExist = function (fileName) {
        for (var i = 0; i < chartTag.FileList.length; i++) {
            if (chartTag.FileList[i].FileName == fileName) {
                chartTag.fileIdToDelete = chartTag.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    chartTag.getFileItem = function (id) {
        for (var i = 0; i < chartTag.FileList.length; i++) {
            if (chartTag.FileList[i].Id == id) {
                return chartTag.FileList[i];
            }
        }
    }

    //select file or folder
    chartTag.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            chartTag.fileTypes = 1;
            chartTag.selectedFileId = chartTag.getFileItem(index).Id;
            chartTag.selectedFileName = chartTag.getFileItem(index).FileName;
        }
        else {
            chartTag.fileTypes = 2;
            chartTag.selectedCategoryId = chartTag.getCategoryName(index).Id;
            chartTag.selectedCategoryTitle = chartTag.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        chartTag.selectedIndex = index;

    };

    //upload file
    chartTag.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (chartTag.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ chartTag.replaceFile(uploadFile.name);
                    chartTag.itemClicked(null, chartTag.fileIdToDelete, "file");
                    chartTag.fileTypes = 1;
                    chartTag.fileIdToDelete = chartTag.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                chartTag.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        chartTag.FileItem = response2.Item;
                        chartTag.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        chartTag.filePickerMainImage.filename =
                          chartTag.FileItem.FileName;
                        chartTag.filePickerMainImage.fileId =
                          response2.Item.Id;
                        chartTag.selectedItem.LinkMainImageId =
                          chartTag.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      chartTag.showErrorIcon();
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
                    chartTag.FileItem = response.Item;
                    chartTag.FileItem.FileName = uploadFile.name;
                    chartTag.FileItem.uploadName = uploadFile.uploadName;
                    chartTag.FileItem.Extension = uploadFile.name.split('.').pop();
                    chartTag.FileItem.FileSrc = uploadFile.name;
                    chartTag.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- chartTag.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", chartTag.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            chartTag.FileItem = response.Item;
                            chartTag.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            chartTag.filePickerMainImage.filename = chartTag.FileItem.FileName;
                            chartTag.filePickerMainImage.fileId = response.Item.Id;
                            chartTag.selectedItem.LinkMainImageId = chartTag.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        chartTag.showErrorIcon();
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
    chartTag.exportFile = function () {
        chartTag.gridOptions.advancedSearchData.engine.ExportFile = chartTag.ExportFileClass;
        chartTag.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'charttag/exportfile', chartTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            chartTag.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                chartTag.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //chartTag.closeModal();
            }
            chartTag.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    chartTag.toggleExportForm = function () {
        chartTag.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        chartTag.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        chartTag.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        chartTag.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        chartTag.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/Modulechart/charttag/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    chartTag.rowCountChanged = function () {
        if (!angular.isDefined(chartTag.ExportFileClass.RowCount) || chartTag.ExportFileClass.RowCount > 5000)
            chartTag.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    chartTag.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"charttag/count", chartTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            chartTag.addRequested = false;
            rashaErManage.checkAction(response);
            chartTag.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            chartTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    //TreeControl
    chartTag.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (chartTag.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    chartTag.onNodeToggle = function (node, expanded) {
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

    chartTag.onSelection = function (node, selected) {
        if (!selected) {
            chartTag.selectedItem.LinkMainImageId = null;
            chartTag.selectedItem.previewImageSrc = null;
            return;
        }
        chartTag.selectedItem.LinkMainImageId = node.Id;
        chartTag.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            chartTag.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);