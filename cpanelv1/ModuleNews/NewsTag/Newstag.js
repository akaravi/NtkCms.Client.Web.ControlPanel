app.controller("newsTagCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window','$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window,$state, $filter) {
    var newsTag = this;
    var edititem=false;
    //For Grid Options
    newsTag.gridOptions = {};
    newsTag.selectedItem = {};
    newsTag.attachedFiles = [];
    newsTag.attachedFile = "";
    var todayDate = moment().format();
    newsTag.DateBirth = {
        defaultDate: todayDate,
        viewTimePicker: true
    }
    newsTag.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }

    newsTag.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    newsTag.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    newsTag.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:newsTag.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:newsTag,
        useCurrentLocationZoom:12,
    }
    if (itemRecordStatus != undefined) newsTag.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    newsTag.selectedItem.ToDate = date;
    newsTag.datePickerConfig = {
        defaultDate: date
    };
    newsTag.startDate = {
        defaultDate: date
    }
    newsTag.endDate = {
        defaultDate: date
    }
    newsTag.count = 0;

//#help/ سلکتور دسته بندی در ویرایش محتوا
 newsTag.LinkCategoryTagIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryTagId',
        url: 'newsCategoryTag',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: newsTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' }
            ]
        }
    }

    //news Grid Options
    newsTag.gridOptions = {
        columns: [
            { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: "ActionKey", displayName: "لیست مطالب", displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="newsTag.OpenContentTag(x.Id,x.Title)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }

    //Comment Grid Options
    newsTag.gridContentOptions = {
        columns: [
           { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
           { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
           { name: 'Writer', displayName: 'نویسنده', sortable: true, type: 'string' },
           { name: 'Comment', displayName: 'کامنت', sortable: true, type: 'string' },
           { name: 'ActionButtons', displayName: 'کلید عملیاتی', template: '<Button ng-if="!x.IsActivated" ng-click="newsTag.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button><Button ng-if="x.IsActivated" ng-click="newsTag.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button><Button ng-click="newsTag.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>' },
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
    newsTag.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show news Loading Indicator
    newsTag.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    newsTag.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    newsTag.OpenContentTag = function (LinkTagContentId,TitleTag) {
                $state.go("index.newscontent", {
            ContentId: LinkTagContentId,
            TitleTag:TitleTag
        });
    }
    newsTag.treeConfig.currentNode = {};
    newsTag.treeBusyIndicator = false;
    newsTag.addRequested = false;
    newsTag.showGridComment = false;
    newsTag.newsTitle = "";

    //init Function
    newsTag.init = function () {
        newsTag.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"newsCategorytag/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            newsTag.treeConfig.Items = response.ListItems;
            newsTag.treeConfig.Items = response.ListItems;
            newsTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"newstag/getall", newsTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            newsTag.ListItems = response.ListItems;
            newsTag.gridOptions.fillData(newsTag.ListItems, response.resultAccess); // Sending Access as an argument
            newsTag.contentBusyIndicator.isActive = false;
            newsTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            newsTag.gridOptions.totalRowCount = response.TotalRowCount;
            newsTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            newsTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            newsTag.contentBusyIndicator.isActive = false;
        });

    };



    newsTag.gridContentOptions.onRowSelected = function () { }

    // Open Add Category Modal 
    newsTag.addNewCategoryModel = function () {
        newsTag.addRequested = false;
        ajax.call(cmsServerConfig.configApiServerPath+'newsCategorytag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            newsTag.selectedItem = response.Item;
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
                newsTag.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(newsTag.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/Modulenews/newsCategorytag/add.html',
                        scope: $scope
                    });
                    newsTag.addRequested = false;
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
    newsTag.openEditCategoryModel = function () {
        if (buttonIsPressed) return;
        newsTag.addRequested = false;
        newsTag.modalTitle = 'ویرایش';
        if (!newsTag.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        newsTag.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'newsCategorytag/GetOne', newsTag.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            newsTag.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            newsTag.selectedItem = response.Item;
            //Set dataForTheTree
            newsTag.selectedNode = [];
            newsTag.expandedNodes = [];
            newsTag.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                newsTag.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryTagId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(newsTag.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (newsTag.selectedItem.LinkMainImageId > 0)
                        newsTag.onSelection({ Id: newsTag.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/Modulenews/newsCategorytag/edit.html',
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
    newsTag.addNewCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        newsTag.categoryBusyIndicator.isActive = true;
        newsTag.addRequested = true;
        newsTag.selectedItem.LinkParentId = null;
        if (newsTag.treeConfig.currentNode != null)
            newsTag.selectedItem.LinkParentId = newsTag.treeConfig.currentNode.Id;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'newsCategorytag/add', newsTag.selectedItem, 'POST').success(function (response) {
            buttonIsPressed = false;
            newsTag.addRequested = false;
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                newsTag.gridOptions.advancedSearchData.engine.Filters = null;
                newsTag.gridOptions.advancedSearchData.engine.Filters = [];
                newsTag.gridOptions.reGetAll();
                newsTag.closeModal();
            }
            newsTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsTag.addRequested = false;
            newsTag.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category
    newsTag.editCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        newsTag.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'newsCategorytag/edit', newsTag.selectedItem, 'PUT').success(function (response) {
            newsTag.addRequested = true;
            //newsTag.showbusy = false;
            newsTag.treeConfig.showbusy = false;
            newsTag.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                newsTag.addRequested = false;
                newsTag.treeConfig.currentNode.Title = response.Item.Title;
                newsTag.closeModal();
            }
            newsTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsTag.addRequested = false;
            newsTag.categoryBusyIndicator.isActive = false;
        });
    }

    // Delete a Category
    newsTag.deleteCategory = function () {
        if (buttonIsPressed) return;
        var node = newsTag.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                newsTag.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'newsCategorytag/GetOne', node.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    newsTag.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'newsCategorytag/delete', newsTag.selectedItemForDelete, 'POST').success(function (res) {
                        newsTag.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            newsTag.gridOptions.advancedSearchData.engine.Filters = null;
                            newsTag.gridOptions.advancedSearchData.engine.Filters = [];
                            newsTag.gridOptions.fillData();
                            newsTag.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        newsTag.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    newsTag.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    newsTag.treeConfig.onNodeSelect = function () {
        var node = newsTag.treeConfig.currentNode;
        newsTag.showGridComment = false;
        newsTag.CategoryTagId = node.Id;
        newsTag.selectContent(node);
    };

    //Show Content with Category Id
    newsTag.selectContent = function (node) {
        newsTag.gridOptions.advancedSearchData.engine.Filters = null;
        newsTag.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            newsTag.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            newsTag.contentBusyIndicator.isActive = true;

            newsTag.attachedFiles = null;
            newsTag.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryTagId",
                IntValue1: node.Id,
                SearchType: 0
            }
            newsTag.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"newstag/getall", newsTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            newsTag.contentBusyIndicator.isActive = false;
            newsTag.ListItems = response.ListItems;
            newsTag.gridOptions.fillData(newsTag.ListItems, response.resultAccess); // Sending Access as an argument
            newsTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            newsTag.gridOptions.totalRowCount = response.TotalRowCount;
            newsTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            newsTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Open Add New Content Model
    newsTag.openAddModel = function () {

        newsTag.addRequested = false;
        newsTag.modalTitle = 'اضافه کردن محتوای جدید';
        ajax.call(cmsServerConfig.configApiServerPath+'newstag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            newsTag.selectedItem = response.Item;
            newsTag.selectedItem.LinkCategoryTagId = newsTag.CategoryTagId;
            //newsTag.clearPreviousData();
            $modal.open({
                templateUrl: 'cpanelv1/Modulenews/newstag/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    newsTag.openEditModel = function () {
        if (buttonIsPressed) return;
        newsTag.addRequested = false;
        newsTag.modalTitle = 'ویرایش';
        if (!newsTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'newstag/GetOne', newsTag.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            newsTag.selectedItem = response1.Item;

            $modal.open({
                templateUrl: 'cpanelv1/Modulenews/newstag/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    newsTag.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        newsTag.categoryBusyIndicator.isActive = true;
        newsTag.addRequested = true;


        ajax.call(cmsServerConfig.configApiServerPath+'newstag/add', newsTag.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            newsTag.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                newsTag.ListItems.unshift(response.Item);
                newsTag.gridOptions.fillData(newsTag.ListItems);
                newsTag.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsTag.addRequested = false;
            newsTag.categoryBusyIndicator.isActive = false;
        });
    }

    //Edit Content
    newsTag.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        newsTag.categoryBusyIndicator.isActive = true;
        newsTag.addRequested = true;


        ajax.call(cmsServerConfig.configApiServerPath+'newstag/edit', newsTag.selectedItem, 'PUT').success(function (response) {
            newsTag.categoryBusyIndicator.isActive = false;
            newsTag.addRequested = false;
            newsTag.treeConfig.showbusy = false;
            newsTag.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                newsTag.replaceItem(newsTag.selectedItem.Id, response.Item);
                newsTag.gridOptions.fillData(newsTag.ListItems);
                newsTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsTag.addRequested = false;
            newsTag.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a news Content 
    newsTag.deleteContent = function () {
        if (!newsTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        newsTag.treeConfig.showbusy = true;
        newsTag.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                newsTag.categoryBusyIndicator.isActive = true;
                console.log(newsTag.gridOptions.selectedRow.item);
                newsTag.showbusy = true;
                newsTag.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+"newstag/GetOne", newsTag.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    newsTag.showbusy = false;
                    newsTag.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    newsTag.selectedItemForDelete = response.Item;
                    console.log(newsTag.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"newstag/delete", newsTag.selectedItemForDelete, 'POST').success(function (res) {
                        newsTag.categoryBusyIndicator.isActive = false;
                        newsTag.treeConfig.showbusy = false;
                        newsTag.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            newsTag.replaceItem(newsTag.selectedItemForDelete.Id);
                            newsTag.gridOptions.fillData(newsTag.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        newsTag.treeConfig.showbusy = false;
                        newsTag.showIsBusy = false;
                        newsTag.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    newsTag.treeConfig.showbusy = false;
                    newsTag.showIsBusy = false;
                    newsTag.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }


    //Replace Item OnDelete/OnEdit Grid Options
    newsTag.replaceItem = function (oldId, newItem) {
        angular.forEach(newsTag.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = newsTag.ListItems.indexOf(item);
                newsTag.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            newsTag.ListItems.unshift(newItem);
    }

    newsTag.searchData = function () {
        newsTag.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"newstsg/getall", newsTag.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            newsTag.contentBusyIndicator.isActive = false;
            newsTag.ListItems = response.ListItems;
            newsTag.gridOptions.fillData(newsTag.ListItems);
            newsTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            newsTag.gridOptions.totalRowCount = response.TotalRowCount;
            newsTag.gridOptions.rowPerPage = response.RowPerPage;
            newsTag.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            newsTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    newsTag.addRequested = false;
    newsTag.closeModal = function () {
        $modalStack.dismissAll();
    };

    newsTag.showIsBusy = false;



    //For reInit Categories
    newsTag.gridOptions.reGetAll = function () {
        newsTag.init();
    };

    newsTag.isCurrentNodeEmpty = function () {
        return !angular.equals({}, newsTag.treeConfig.currentNode);
    }

    newsTag.loadFileAndFolder = function (item) {
        newsTag.treeConfig.currentNode = item;
        console.log(item);
        newsTag.treeConfig.onNodeSelect(item);
    }

    newsTag.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    newsTag.columnCheckbox = false;
    newsTag.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = newsTag.gridOptions.columns;
        if (newsTag.gridOptions.columnCheckbox) {
            for (var i = 0; i < newsTag.gridOptions.columns.length; i++) {
                var element = $("#" + newsTag.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                newsTag.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < newsTag.gridOptions.columns.length; i++) {
                var element = $("#" + newsTag.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + newsTag.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < newsTag.gridOptions.columns.length; i++) {
            console.log(newsTag.gridOptions.columns[i].name.concat(".visible: "), newsTag.gridOptions.columns[i].visible);
        }
        newsTag.gridOptions.columnCheckbox = !newsTag.gridOptions.columnCheckbox;
    }

    newsTag.deleteAttachedFile = function (index) {
        newsTag.attachedFiles.splice(index, 1);
    }

    newsTag.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !newsTag.alreadyExist(id, newsTag.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = {
                id: fId, name: fname
            };
            newsTag.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    newsTag.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    newsTag.filePickerMainImage.removeSelectedfile = function (config) {
        newsTag.filePickerMainImage.fileId = null;
        newsTag.filePickerMainImage.filename = null;
        newsTag.selectedItem.LinkMainImageId = null;

    }

    newsTag.filePickerFiles.removeSelectedfile = function (config) {
        newsTag.filePickerFiles.fileId = null;
        newsTag.filePickerFiles.filename = null;
        newsTag.selectedItem.LinkFileIds = null;
    }


    newsTag.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }

    // ----------- FilePicker Codes --------------------------------
    newsTag.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !newsTag.alreadyExist(id, newsTag.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            newsTag.attachedFiles.push(file);
            newsTag.clearfilePickers();
        }
    }

    newsTag.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                newsTag.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    newsTag.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;   //String is empty or whitespace then return
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            newsTag.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    newsTag.clearfilePickers = function () {
        newsTag.filePickerFiles.fileId = null;
        newsTag.filePickerFiles.filename = null;
    }

    newsTag.stringfyLinkFileIds = function () {
        $.each(newsTag.attachedFiles, function (i, item) {
            if (newsTag.selectedItem.LinkFileIds == "")
                newsTag.selectedItem.LinkFileIds = item.fileId;
            else
                newsTag.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    newsTag.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/Modulenews/newsContent/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        newsTag.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            newsTag.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    newsTag.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    newsTag.whatcolor = function (progress) {
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

    newsTag.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    newsTag.replaceFile = function (name) {
        newsTag.itemClicked(null, newsTag.fileIdToDelete, "file");
        newsTag.fileTypes = 1;
        newsTag.fileIdToDelete = newsTag.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", newsTag.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    newsTag.remove(newsTag.FileList, newsTag.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                newsTag.FileItem = response3.Item;
                                newsTag.FileItem.FileName = name;
                                newsTag.FileItem.Extension = name.split('.').pop();
                                newsTag.FileItem.FileSrc = name;
                                newsTag.FileItem.LinkCategoryId = newsTag.thisCategory;
                                newsTag.saveNewFile();
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
    newsTag.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", newsTag.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                newsTag.FileItem = response.Item;
                newsTag.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            newsTag.showErrorIcon();
            return -1;
        });
    }

    newsTag.showSuccessIcon = function () {
    }

    newsTag.showErrorIcon = function () {

    }
    //file is exist
    newsTag.fileIsExist = function (fileName) {
        for (var i = 0; i < newsTag.FileList.length; i++) {
            if (newsTag.FileList[i].FileName == fileName) {
                newsTag.fileIdToDelete = newsTag.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    newsTag.getFileItem = function (id) {
        for (var i = 0; i < newsTag.FileList.length; i++) {
            if (newsTag.FileList[i].Id == id) {
                return newsTag.FileList[i];
            }
        }
    }

    //select file or folder
    newsTag.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            newsTag.fileTypes = 1;
            newsTag.selectedFileId = newsTag.getFileItem(index).Id;
            newsTag.selectedFileName = newsTag.getFileItem(index).FileName;
        }
        else {
            newsTag.fileTypes = 2;
            newsTag.selectedCategoryId = newsTag.getCategoryName(index).Id;
            newsTag.selectedCategoryTitle = newsTag.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        newsTag.selectedIndex = index;

    };

    //upload file
    newsTag.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (newsTag.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ newsTag.replaceFile(uploadFile.name);
                    newsTag.itemClicked(null, newsTag.fileIdToDelete, "file");
                    newsTag.fileTypes = 1;
                    newsTag.fileIdToDelete = newsTag.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                newsTag.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        newsTag.FileItem = response2.Item;
                        newsTag.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        newsTag.filePickerMainImage.filename =
                          newsTag.FileItem.FileName;
                        newsTag.filePickerMainImage.fileId =
                          response2.Item.Id;
                        newsTag.selectedItem.LinkMainImageId =
                          newsTag.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      newsTag.showErrorIcon();
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
                    newsTag.FileItem = response.Item;
                    newsTag.FileItem.FileName = uploadFile.name;
                    newsTag.FileItem.uploadName = uploadFile.uploadName;
                    newsTag.FileItem.Extension = uploadFile.name.split('.').pop();
                    newsTag.FileItem.FileSrc = uploadFile.name;
                    newsTag.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- newsTag.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", newsTag.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            newsTag.FileItem = response.Item;
                            newsTag.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            newsTag.filePickerMainImage.filename = newsTag.FileItem.FileName;
                            newsTag.filePickerMainImage.fileId = response.Item.Id;
                            newsTag.selectedItem.LinkMainImageId = newsTag.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        newsTag.showErrorIcon();
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
    newsTag.exportFile = function () {
        newsTag.gridOptions.advancedSearchData.engine.ExportFile = newsTag.ExportFileClass;
        newsTag.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'newstag/exportfile', newsTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            newsTag.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                newsTag.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //newsTag.closeModal();
            }
            newsTag.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    newsTag.toggleExportForm = function () {
        newsTag.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        newsTag.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        newsTag.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        newsTag.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        newsTag.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/Modulenews/newstag/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    newsTag.rowCountChanged = function () {
        if (!angular.isDefined(newsTag.ExportFileClass.RowCount) || newsTag.ExportFileClass.RowCount > 5000)
            newsTag.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    newsTag.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"newstag/count", newsTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            newsTag.addRequested = false;
            rashaErManage.checkAction(response);
            newsTag.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            newsTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    //TreeControl
    newsTag.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (newsTag.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    newsTag.onNodeToggle = function (node, expanded) {
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

    newsTag.onSelection = function (node, selected) {
        if (!selected) {
            newsTag.selectedItem.LinkMainImageId = null;
            newsTag.selectedItem.previewImageSrc = null;
            return;
        }
        newsTag.selectedItem.LinkMainImageId = node.Id;
        newsTag.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            newsTag.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);