app.controller("biographyTagCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window','$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window,$state, $filter) {
    var biographyTag = this;
    var edititem=false;
    //For Grid Options
    biographyTag.gridOptions = {};
    biographyTag.selectedItem = {};
    biographyTag.attachedFiles = [];
    biographyTag.attachedFile = "";
    var todayDate = moment().format();
    biographyTag.DateBirth = {
        defaultDate: todayDate,
        viewTimePicker: true
    }
    biographyTag.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }

    biographyTag.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    biographyTag.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    biographyTag.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:biographyTag.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:biographyTag,
        useCurrentLocationZoom:12,
    }
    if (itemRecordStatus != undefined) biographyTag.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    biographyTag.selectedItem.ToDate = date;
    biographyTag.datePickerConfig = {
        defaultDate: date
    };
    biographyTag.startDate = {
        defaultDate: date
    }
    biographyTag.endDate = {
        defaultDate: date
    }
    biographyTag.count = 0;

//#help/ سلکتور دسته بندی در ویرایش محتوا
 biographyTag.LinkCategoryTagIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryTagId',
        url: 'biographyCategoryTag',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: biographyTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' }
            ]
        }
    }

    //biography Grid Options
    biographyTag.gridOptions = {
        columns: [
            { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: "ActionKey", displayName: "لیست مطالب", displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="biographyTag.OpenContentTag(x.Id,x.Title)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }

    //Comment Grid Options
    biographyTag.gridContentOptions = {
        columns: [
           { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
           { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
           { name: 'Writer', displayName: 'نویسنده', sortable: true, type: 'string' },
           { name: 'Comment', displayName: 'کامنت', sortable: true, type: 'string' },
           { name: 'ActionButtons', displayName: 'کلید عملیاتی', template: '<Button ng-if="!x.IsActivated" ng-click="biographyTag.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button><Button ng-if="x.IsActivated" ng-click="biographyTag.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button><Button ng-click="biographyTag.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>' },
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
    biographyTag.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show biography Loading Indicator
    biographyTag.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    biographyTag.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    biographyTag.OpenContentTag = function (LinkTagContentId,TitleTag) {
                $state.go("index.biographycontent", {
            ContentId: LinkTagContentId,
            TitleTag:TitleTag
        });
    }
    biographyTag.treeConfig.currentNode = {};
    biographyTag.treeBusyIndicator = false;
    biographyTag.addRequested = false;
    biographyTag.showGridComment = false;
    biographyTag.biographyTitle = "";

    //init Function
    biographyTag.init = function () {
        biographyTag.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"biographyCategorytag/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            biographyTag.treeConfig.Items = response.ListItems;
            biographyTag.treeConfig.Items = response.ListItems;
            biographyTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"biographytag/getall", biographyTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            biographyTag.ListItems = response.ListItems;
            biographyTag.gridOptions.fillData(biographyTag.ListItems, response.resultAccess); // Sending Access as an argument
            biographyTag.contentBusyIndicator.isActive = false;
            biographyTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            biographyTag.gridOptions.totalRowCount = response.TotalRowCount;
            biographyTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            biographyTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            biographyTag.contentBusyIndicator.isActive = false;
        });

    };



    biographyTag.gridContentOptions.onRowSelected = function () { }

    // Open Add Category Modal 
    biographyTag.addNewCategoryModel = function () {
        biographyTag.addRequested = false;
        ajax.call(cmsServerConfig.configApiServerPath+'biographyCategorytag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            biographyTag.selectedItem = response.Item;
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
                biographyTag.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(biographyTag.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/Modulebiography/biographyCategorytag/add.html',
                        scope: $scope
                    });
                    biographyTag.addRequested = false;
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
    biographyTag.openEditCategoryModel = function () {
        if (buttonIsPressed) return;
        biographyTag.addRequested = false;
        biographyTag.modalTitle = 'ویرایش';
        if (!biographyTag.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        biographyTag.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'biographyCategorytag/GetOne', biographyTag.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            biographyTag.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            biographyTag.selectedItem = response.Item;
            //Set dataForTheTree
            biographyTag.selectedNode = [];
            biographyTag.expandedNodes = [];
            biographyTag.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                biographyTag.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryTagId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(biographyTag.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (biographyTag.selectedItem.LinkMainImageId > 0)
                        biographyTag.onSelection({ Id: biographyTag.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/Modulebiography/biographyCategorytag/edit.html',
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
    biographyTag.addNewCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        biographyTag.categoryBusyIndicator.isActive = true;
        biographyTag.addRequested = true;
        biographyTag.selectedItem.LinkParentId = null;
        if (biographyTag.treeConfig.currentNode != null)
            biographyTag.selectedItem.LinkParentId = biographyTag.treeConfig.currentNode.Id;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'biographyCategorytag/add', biographyTag.selectedItem, 'POST').success(function (response) {
            buttonIsPressed = false;
            biographyTag.addRequested = false;
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                biographyTag.gridOptions.advancedSearchData.engine.Filters = null;
                biographyTag.gridOptions.advancedSearchData.engine.Filters = [];
                biographyTag.gridOptions.reGetAll();
                biographyTag.closeModal();
            }
            biographyTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyTag.addRequested = false;
            biographyTag.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category
    biographyTag.editCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        biographyTag.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'biographyCategorytag/edit', biographyTag.selectedItem, 'PUT').success(function (response) {
            biographyTag.addRequested = true;
            //biographyTag.showbusy = false;
            biographyTag.treeConfig.showbusy = false;
            biographyTag.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                biographyTag.addRequested = false;
                biographyTag.treeConfig.currentNode.Title = response.Item.Title;
                biographyTag.closeModal();
            }
            biographyTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyTag.addRequested = false;
            biographyTag.categoryBusyIndicator.isActive = false;
        });
    }

    // Delete a Category
    biographyTag.deleteCategory = function () {
        if (buttonIsPressed) return;
        var node = biographyTag.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                biographyTag.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'biographyCategorytag/GetOne', node.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    biographyTag.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'biographyCategorytag/delete', biographyTag.selectedItemForDelete, 'POST').success(function (res) {
                        biographyTag.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            biographyTag.gridOptions.advancedSearchData.engine.Filters = null;
                            biographyTag.gridOptions.advancedSearchData.engine.Filters = [];
                            biographyTag.gridOptions.fillData();
                            biographyTag.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        biographyTag.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    biographyTag.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    biographyTag.treeConfig.onNodeSelect = function () {
        var node = biographyTag.treeConfig.currentNode;
        biographyTag.showGridComment = false;
        biographyTag.selectContent(node);
    };

    //Show Content with Category Id
    biographyTag.selectContent = function (node) {
        biographyTag.gridOptions.advancedSearchData.engine.Filters = null;
        biographyTag.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            biographyTag.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            biographyTag.contentBusyIndicator.isActive = true;

            biographyTag.attachedFiles = null;
            biographyTag.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryTagId",
                IntValue1: node.Id,
                SearchType: 0
            }
            biographyTag.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"biographytag/getall", biographyTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            biographyTag.contentBusyIndicator.isActive = false;
            biographyTag.ListItems = response.ListItems;
            biographyTag.gridOptions.fillData(biographyTag.ListItems, response.resultAccess); // Sending Access as an argument
            biographyTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            biographyTag.gridOptions.totalRowCount = response.TotalRowCount;
            biographyTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            biographyTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Open Add New Content Model
    biographyTag.openAddModel = function () {

        biographyTag.addRequested = false;
        biographyTag.modalTitle = 'اضافه کردن محتوای جدید';
        ajax.call(cmsServerConfig.configApiServerPath+'biographytag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            biographyTag.selectedItem = response.Item;

            biographyTag.clearPreviousData();
            $modal.open({
                templateUrl: 'cpanelv1/Modulebiography/biographytag/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    biographyTag.openEditModel = function () {
        if (buttonIsPressed) return;
        biographyTag.addRequested = false;
        biographyTag.modalTitle = 'ویرایش';
        if (!biographyTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'biographytag/GetOne', biographyTag.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            biographyTag.selectedItem = response1.Item;

            $modal.open({
                templateUrl: 'cpanelv1/Modulebiography/biographytag/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    biographyTag.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        biographyTag.categoryBusyIndicator.isActive = true;
        biographyTag.addRequested = true;


        ajax.call(cmsServerConfig.configApiServerPath+'biographytag/add', biographyTag.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            biographyTag.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                biographyTag.ListItems.unshift(response.Item);
                biographyTag.gridOptions.fillData(biographyTag.ListItems);
                biographyTag.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyTag.addRequested = false;
            biographyTag.categoryBusyIndicator.isActive = false;
        });
    }

    //Edit Content
    biographyTag.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        biographyTag.categoryBusyIndicator.isActive = true;
        biographyTag.addRequested = true;


        ajax.call(cmsServerConfig.configApiServerPath+'biographytag/edit', biographyTag.selectedItem, 'PUT').success(function (response) {
            biographyTag.categoryBusyIndicator.isActive = false;
            biographyTag.addRequested = false;
            biographyTag.treeConfig.showbusy = false;
            biographyTag.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                biographyTag.replaceItem(biographyTag.selectedItem.Id, response.Item);
                biographyTag.gridOptions.fillData(biographyTag.ListItems);
                biographyTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyTag.addRequested = false;
            biographyTag.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a biography Content 
    biographyTag.deleteContent = function () {
        if (!biographyTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        biographyTag.treeConfig.showbusy = true;
        biographyTag.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                biographyTag.categoryBusyIndicator.isActive = true;
                console.log(biographyTag.gridOptions.selectedRow.item);
                biographyTag.showbusy = true;
                biographyTag.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+"biographytag/GetOne", biographyTag.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    biographyTag.showbusy = false;
                    biographyTag.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    biographyTag.selectedItemForDelete = response.Item;
                    console.log(biographyTag.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"biographytag/delete", biographyTag.selectedItemForDelete, 'POST').success(function (res) {
                        biographyTag.categoryBusyIndicator.isActive = false;
                        biographyTag.treeConfig.showbusy = false;
                        biographyTag.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            biographyTag.replaceItem(biographyTag.selectedItemForDelete.Id);
                            biographyTag.gridOptions.fillData(biographyTag.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        biographyTag.treeConfig.showbusy = false;
                        biographyTag.showIsBusy = false;
                        biographyTag.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    biographyTag.treeConfig.showbusy = false;
                    biographyTag.showIsBusy = false;
                    biographyTag.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }


    //Replace Item OnDelete/OnEdit Grid Options
    biographyTag.replaceItem = function (oldId, newItem) {
        angular.forEach(biographyTag.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = biographyTag.ListItems.indexOf(item);
                biographyTag.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            biographyTag.ListItems.unshift(newItem);
    }

    biographyTag.searchData = function () {
        biographyTag.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"biographytsg/getall", biographyTag.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            biographyTag.contentBusyIndicator.isActive = false;
            biographyTag.ListItems = response.ListItems;
            biographyTag.gridOptions.fillData(biographyTag.ListItems);
            biographyTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            biographyTag.gridOptions.totalRowCount = response.TotalRowCount;
            biographyTag.gridOptions.rowPerPage = response.RowPerPage;
            biographyTag.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            biographyTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    biographyTag.addRequested = false;
    biographyTag.closeModal = function () {
        $modalStack.dismissAll();
    };

    biographyTag.showIsBusy = false;



    //For reInit Categories
    biographyTag.gridOptions.reGetAll = function () {
        biographyTag.init();
    };

    biographyTag.isCurrentNodeEmpty = function () {
        return !angular.equals({}, biographyTag.treeConfig.currentNode);
    }

    biographyTag.loadFileAndFolder = function (item) {
        biographyTag.treeConfig.currentNode = item;
        console.log(item);
        biographyTag.treeConfig.onNodeSelect(item);
    }

    biographyTag.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    biographyTag.columnCheckbox = false;
    biographyTag.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = biographyTag.gridOptions.columns;
        if (biographyTag.gridOptions.columnCheckbox) {
            for (var i = 0; i < biographyTag.gridOptions.columns.length; i++) {
                var element = $("#" + biographyTag.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                biographyTag.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < biographyTag.gridOptions.columns.length; i++) {
                var element = $("#" + biographyTag.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + biographyTag.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < biographyTag.gridOptions.columns.length; i++) {
            console.log(biographyTag.gridOptions.columns[i].name.concat(".visible: "), biographyTag.gridOptions.columns[i].visible);
        }
        biographyTag.gridOptions.columnCheckbox = !biographyTag.gridOptions.columnCheckbox;
    }

    biographyTag.deleteAttachedFile = function (index) {
        biographyTag.attachedFiles.splice(index, 1);
    }

    biographyTag.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !biographyTag.alreadyExist(id, biographyTag.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = {
                id: fId, name: fname
            };
            biographyTag.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    biographyTag.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    biographyTag.filePickerMainImage.removeSelectedfile = function (config) {
        biographyTag.filePickerMainImage.fileId = null;
        biographyTag.filePickerMainImage.filename = null;
        biographyTag.selectedItem.LinkMainImageId = null;

    }

    biographyTag.filePickerFiles.removeSelectedfile = function (config) {
        biographyTag.filePickerFiles.fileId = null;
        biographyTag.filePickerFiles.filename = null;
        biographyTag.selectedItem.LinkFileIds = null;
    }


    biographyTag.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }

    // ----------- FilePicker Codes --------------------------------
    biographyTag.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !biographyTag.alreadyExist(id, biographyTag.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            biographyTag.attachedFiles.push(file);
            biographyTag.clearfilePickers();
        }
    }

    biographyTag.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                biographyTag.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    biographyTag.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;   //String is empty or whitespace then return
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            biographyTag.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    biographyTag.clearfilePickers = function () {
        biographyTag.filePickerFiles.fileId = null;
        biographyTag.filePickerFiles.filename = null;
    }

    biographyTag.stringfyLinkFileIds = function () {
        $.each(biographyTag.attachedFiles, function (i, item) {
            if (biographyTag.selectedItem.LinkFileIds == "")
                biographyTag.selectedItem.LinkFileIds = item.fileId;
            else
                biographyTag.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    biographyTag.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleBiography/biographyContent/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        biographyTag.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            biographyTag.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    biographyTag.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    biographyTag.whatcolor = function (progress) {
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

    biographyTag.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    biographyTag.replaceFile = function (name) {
        biographyTag.itemClicked(null, biographyTag.fileIdToDelete, "file");
        biographyTag.fileTypes = 1;
        biographyTag.fileIdToDelete = biographyTag.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", biographyTag.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    biographyTag.remove(biographyTag.FileList, biographyTag.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                biographyTag.FileItem = response3.Item;
                                biographyTag.FileItem.FileName = name;
                                biographyTag.FileItem.Extension = name.split('.').pop();
                                biographyTag.FileItem.FileSrc = name;
                                biographyTag.FileItem.LinkCategoryId = biographyTag.thisCategory;
                                biographyTag.saveNewFile();
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
    biographyTag.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", biographyTag.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                biographyTag.FileItem = response.Item;
                biographyTag.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            biographyTag.showErrorIcon();
            return -1;
        });
    }

    biographyTag.showSuccessIcon = function () {
    }

    biographyTag.showErrorIcon = function () {

    }
    //file is exist
    biographyTag.fileIsExist = function (fileName) {
        for (var i = 0; i < biographyTag.FileList.length; i++) {
            if (biographyTag.FileList[i].FileName == fileName) {
                biographyTag.fileIdToDelete = biographyTag.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    biographyTag.getFileItem = function (id) {
        for (var i = 0; i < biographyTag.FileList.length; i++) {
            if (biographyTag.FileList[i].Id == id) {
                return biographyTag.FileList[i];
            }
        }
    }

    //select file or folder
    biographyTag.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            biographyTag.fileTypes = 1;
            biographyTag.selectedFileId = biographyTag.getFileItem(index).Id;
            biographyTag.selectedFileName = biographyTag.getFileItem(index).FileName;
        }
        else {
            biographyTag.fileTypes = 2;
            biographyTag.selectedCategoryId = biographyTag.getCategoryName(index).Id;
            biographyTag.selectedCategoryTitle = biographyTag.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        biographyTag.selectedIndex = index;

    };

    //upload file
    biographyTag.uploadFile = function (index, name) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (biographyTag.fileIsExist(name)) { // File already exists
                if (confirm('File "' + name + '" already exists! Do you want to replace the new file?')) {
                    //------------ biographyTag.replaceFile(name);
                    biographyTag.itemClicked(null, biographyTag.fileIdToDelete, "file");
                    biographyTag.fileTypes = 1;
                    biographyTag.fileIdToDelete = biographyTag.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                biographyTag.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        biographyTag.FileItem = response2.Item;
                        biographyTag.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        biographyTag.filePickerMainImage.filename =
                          biographyTag.FileItem.FileName;
                        biographyTag.filePickerMainImage.fileId =
                          response2.Item.Id;
                        biographyTag.selectedItem.LinkMainImageId =
                          biographyTag.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      biographyTag.showErrorIcon();
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
                    biographyTag.FileItem = response.Item;
                    biographyTag.FileItem.FileName = name;
                    biographyTag.FileItem.Extension = name.split('.').pop();
                    biographyTag.FileItem.FileSrc = name;
                    biographyTag.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- biographyTag.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", biographyTag.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            biographyTag.FileItem = response.Item;
                            biographyTag.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            biographyTag.filePickerMainImage.filename = biographyTag.FileItem.FileName;
                            biographyTag.filePickerMainImage.fileId = response.Item.Id;
                            biographyTag.selectedItem.LinkMainImageId = biographyTag.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        biographyTag.showErrorIcon();
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
    biographyTag.exportFile = function () {
        biographyTag.gridOptions.advancedSearchData.engine.ExportFile = biographyTag.ExportFileClass;
        biographyTag.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'Biographytag/exportfile', biographyTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            biographyTag.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                biographyTag.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //biographyTag.closeModal();
            }
            biographyTag.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    biographyTag.toggleExportForm = function () {
        biographyTag.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        biographyTag.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        biographyTag.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        biographyTag.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        biographyTag.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleBiography/Biographytag/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    biographyTag.rowCountChanged = function () {
        if (!angular.isDefined(biographyTag.ExportFileClass.RowCount) || biographyTag.ExportFileClass.RowCount > 5000)
            biographyTag.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    biographyTag.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"Biographytag/count", biographyTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            biographyTag.addRequested = false;
            rashaErManage.checkAction(response);
            biographyTag.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            biographyTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    //TreeControl
    biographyTag.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (biographyTag.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    biographyTag.onNodeToggle = function (node, expanded) {
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

    biographyTag.onSelection = function (node, selected) {
        if (!selected) {
            biographyTag.selectedItem.LinkMainImageId = null;
            biographyTag.selectedItem.previewImageSrc = null;
            return;
        }
        biographyTag.selectedItem.LinkMainImageId = node.Id;
        biographyTag.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            biographyTag.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);