app.controller("biographyContentCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$state', '$stateParams', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $state, $stateParams, $filter) {
    var biographyContent = this;
    var edititem = false;
    //For Grid Options
    biographyContent.selectedContentId = { Id: $stateParams.ContentId, TitleTag: $stateParams.TitleTag };

    biographyContent.gridOptions = {};
    biographyContent.selectedItem = {};
    biographyContent.attachedFiles = [];
    biographyContent.attachedFile = "";
    var todayDate = moment().format();
    biographyContent.DateBirth = {
        defaultDate: todayDate,
        viewTimePicker: true
    }
    biographyContent.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    biographyContent.filePickerFilePodcast = {
        isActive: true,
        backElement: 'filePickerFilePodcast',
        filename: null,
        fileId: null,
        extension: 'mp3',
        multiSelect: false,
    }
    biographyContent.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    biographyContent.locationChanged = function (lat, lang) {
        console.log("ok " + lat + " " + lang);
    }

    biographyContent.GeolocationConfig = {
        locationMember: 'Geolocation',
        locationMemberString: 'GeolocationString',
        onlocationChanged: biographyContent.locationChanged,
        useCurrentLocation: true,
        center: { lat: 33.437039, lng: 53.073182 },
        zoom: 4,
        scope: biographyContent,
        useCurrentLocationZoom: 12,
    }
    if (itemRecordStatus != undefined) biographyContent.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    biographyContent.selectedItem.ToDate = date;
    biographyContent.dateBirth = {
        defaultDate: date
    };
    biographyContent.startDate = {
        defaultDate: date
    }
    biographyContent.endDate = {
        defaultDate: date
    }
    biographyContent.count = 0;

    //#help/ سلکتور similar
    biographyContent.LinkDestinationIdSelector = {
        displayMember: "Title",
        id: "Id",
        fId: "LinkDestinationId",
        url: "BiographyContent",
        sortColumn: "Id",
        sortType: 1,
        filterText: "Title",
        showAddDialog: false,
        rowPerPage: 200,
        scope: biographyContent,
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
    biographyContent.LinkCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryId',
        url: 'biographyCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: biographyContent,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' }
            ]
        }
    }

    //biography Grid Options
    biographyContent.gridOptions = {
        columns: [
            { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: 'true' },
            { name: 'FromDate', displayName: 'تاریخ آغاز', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'ToDate', displayName: 'تاریخ پایان', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'ViewCount', displayName: 'تعداد بازدید', sortable: true, visible: true },
            { name: "ActionKey", displayName: "عملیات", displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="biographyContent.addMenu()"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }

    //Comment Grid Options
    biographyContent.gridContentOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Writer', displayName: 'نویسنده', sortable: true, type: 'string' },
            { name: 'Comment', displayName: 'کامنت', sortable: true, type: 'string' },
            { name: 'ActionButtons', displayName: 'کلید عملیاتی', template: '<Button ng-if="!x.IsActivated" ng-click="biographyContent.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button><Button ng-if="x.IsActivated" ng-click="biographyContent.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button><Button ng-click="biographyContent.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>' },
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

    biographyContent.gridOptions.advancedSearchData.engine.Filters = null;
    biographyContent.gridOptions.advancedSearchData.engine.Filters = [];

    //#tagsInput -----
    //biographyContent.onTagAdded = function (tag) {
    //    if (!angular.isDefined(tag.id)) {    //Check if this a new or a existing tag (existing tags comprise with an id)
    //        var tagObject = jQuery.extend({}, biographyContent.ModuleTag);   //#Clone a Javascript Object
    //        tagObject.Title = tag.text;
    //        ajax.call('/api/biographyTag/add', tagObject, 'POST').success(function (response) {
    //            rashaErManage.checkAction(response);
    //            if (response.IsSuccess) {
    //                biographyContent.tags[biographyContent.tags.length - 1] = { id: response.Item.Id, text: response.Item.Title };  //Replace the newly added tag (last in the array) with a new object including its Id
    //            }
    //        }).error(function (data, errCode, c, d) {
    //            rashaErManage.checkAction(data, errCode);
    //        });
    //    }
    //}
    biographyContent.onTagRemoved = function (tag) { }
    //End of #tagsInput

    //For Show Category Loading Indicator
    biographyContent.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show biography Loading Indicator
    biographyContent.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    biographyContent.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    biographyContent.addMenu = function () {
        $modal.open({
            templateUrl: "cpanelv1/Modulebiography/biographyContent/modalMenu.html",
            scope: $scope
        });
    }
    biographyContent.treeConfig.currentNode = {};
    biographyContent.treeBusyIndicator = false;
    biographyContent.addRequested = false;
    biographyContent.showGridComment = false;
    biographyContent.biographyTitle = "";

    //init Function
    biographyContent.init = function () {
        biographyContent.categoryBusyIndicator.isActive = true;
        ajax.call(mainPathApi+"biographyCategory/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            biographyContent.treeConfig.Items = response.ListItems;
            biographyContent.treeConfig.Items = response.ListItems;
            biographyContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        filterModel = { PropertyName: "ContentTags", PropertyAnyName: "LinkTagId", SearchType: 0, IntValue1: biographyContent.selectedContentId.Id };
        if (biographyContent.selectedContentId.Id > 0)
            biographyContent.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
        ajax.call(mainPathApi+"biographyContent/getall", biographyContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            biographyContent.ListItems = response.ListItems;
            biographyContent.gridOptions.fillData(biographyContent.ListItems, response.resultAccess); // Sending Access as an argument
            biographyContent.contentBusyIndicator.isActive = false;
            biographyContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            biographyContent.gridOptions.totalRowCount = response.TotalRowCount;
            biographyContent.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            biographyContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            biographyContent.contentBusyIndicator.isActive = false;
        });
        ajax.call(mainPathApi+"biographyTag/getviewmodel", "0", 'GET').success(function (response) {    //Get a ViewModel for BiographyTag
            biographyContent.ModuleTag = response.Item;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(mainPathApi+"biographyContentTag/getviewmodel", "0", 'GET').success(function (response) { //Get a ViewModel for BiographyContentTag
            biographyContent.ModuleContentTag = response.Item;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    };

    // For Show Comments
    biographyContent.showComment = function () {
        if (biographyContent.gridOptions.selectedRow.item) {
            //var id = biographyContent.gridOptions.selectedRow.item.Id;
            var Filter_value = {
                PropertyName: "LinkContentId",
                IntValue1: biographyContent.gridOptions.selectedRow.item.Id,
                SearchType: 0
            }
            biographyContent.gridContentOptions.advancedSearchData.engine.Filters = null;
            biographyContent.gridContentOptions.advancedSearchData.engine.Filters = [];
            biographyContent.gridContentOptions.advancedSearchData.engine.Filters.push(Filter_value);
            ajax.call(mainPathApi+'biographyComment/getall', biographyContent.gridContentOptions.advancedSearchData.engine, 'POST').success(function (response) {
                biographyContent.listComments = response.ListItems;
                //biographyContent.gridOptions.resultAccess = response.resultAccess; // دسترسی ها نمایش
                biographyContent.gridContentOptions.fillData(biographyContent.listComments, response.resultAccess);
                biographyContent.gridContentOptions.currentPageNumber = response.CurrentPageNumber;
                biographyContent.gridContentOptions.totalRowCount = response.TotalRowCount;
                biographyContent.allowedSearch = response.AllowedSearchField;
                rashaErManage.checkAction(response);
                biographyContent.gridContentOptions.RowPerPage = response.RowPerPage;
                biographyContent.showGridComment = true;
                biographyContent.Title = biographyContent.gridOptions.selectedRow.item.Title;
            });
        }
    }

    biographyContent.gridOptions.onRowSelected = function () {
        var item = biographyContent.gridOptions.selectedRow.item;
        biographyContent.showComment(item);
    }

    biographyContent.gridContentOptions.onRowSelected = function () { }

    // Open Add Category Modal 
    biographyContent.addNewCategoryModel = function () {
        biographyContent.addRequested = false;
        ajax.call(mainPathApi+'biographyCategory/getviewmodel', "0", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            biographyContent.selectedItem = response.Item;
            //Set dataForTheTree
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(mainPathApi+"CmsFileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                biographyContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(biographyContent.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/Modulebiography/biographyCategory/add.html',
                        scope: $scope
                    });
                    biographyContent.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //-----
            //$modal.open({
            //    templateUrl: 'cpanelv1/Modulebiography/biographyCategory/add.html',
            //    scope: $scope
            //});
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    buttonIsPressed = false;
    // Open Edit Category Modal
    biographyContent.openEditCategoryModel = function () {
        if (buttonIsPressed) return;
        biographyContent.addRequested = false;
        biographyContent.modalTitle = 'ویرایش';
        if (!biographyContent.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Category_To_Edit'));
            return;
        }

        biographyContent.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(mainPathApi+'biographyCategory/getviewmodel', biographyContent.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            biographyContent.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            biographyContent.selectedItem = response.Item;
            //Set dataForTheTree
            biographyContent.selectedNode = [];
            biographyContent.expandedNodes = [];
            biographyContent.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(mainPathApi+"CmsFileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                biographyContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(biographyContent.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (biographyContent.selectedItem.LinkMainImageId > 0)
                        biographyContent.onSelection({ Id: biographyContent.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/Modulebiography/biographyCategory/edit.html',
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
            //    templateUrl: 'cpanelv1/Modulebiography/biographyCategory/edit.html',
            //    scope: $scope
            //});
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Category
    biographyContent.addNewCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed) {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        biographyContent.categoryBusyIndicator.isActive = true;
        biographyContent.addRequested = true;
        biographyContent.selectedItem.LinkParentId = null;
        if (biographyContent.treeConfig.currentNode != null)
            biographyContent.selectedItem.LinkParentId = biographyContent.treeConfig.currentNode.Id;
        buttonIsPressed = true;
        ajax.call(mainPathApi+'biographyCategory/add', biographyContent.selectedItem, 'POST').success(function (response) {
            buttonIsPressed = false;
            biographyContent.addRequested = false;
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                biographyContent.gridOptions.advancedSearchData.engine.Filters = null;
                biographyContent.gridOptions.advancedSearchData.engine.Filters = [];
                biographyContent.gridOptions.reGetAll();
                biographyContent.closeModal();
            }
            biographyContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyContent.addRequested = false;
            biographyContent.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category
    biographyContent.editCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed) {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        biographyContent.categoryBusyIndicator.isActive = true;
        ajax.call(mainPathApi+'biographyCategory/edit', biographyContent.selectedItem, 'PUT').success(function (response) {
            biographyContent.addRequested = true;
            //biographyContent.showbusy = false;
            biographyContent.treeConfig.showbusy = false;
            biographyContent.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                biographyContent.addRequested = false;
                biographyContent.treeConfig.currentNode.Title = response.Item.Title;
                biographyContent.closeModal();
            }
            biographyContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyContent.addRequested = false;
            biographyContent.categoryBusyIndicator.isActive = false;
        });
    }

    // Delete a Category
    biographyContent.deleteCategory = function () {
        if (buttonIsPressed) return;
        var node = biographyContent.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Category_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                biographyContent.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                ajax.call(mainPathApi+'biographyCategory/getviewmodel', node.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    biographyContent.selectedItemForDelete = response.Item;
                    ajax.call(mainPathApi+'biographyCategory/delete', biographyContent.selectedItemForDelete, 'DELETE').success(function (res) {
                        biographyContent.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            biographyContent.gridOptions.advancedSearchData.engine.Filters = null;
                            biographyContent.gridOptions.advancedSearchData.engine.Filters = [];
                            biographyContent.gridOptions.fillData();
                            biographyContent.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translate')('Unable_To_Delete_The_Category_Contains_Content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        biographyContent.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    biographyContent.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    biographyContent.treeConfig.onNodeSelect = function () {
        var node = biographyContent.treeConfig.currentNode;
        biographyContent.showGridComment = false;
        biographyContent.selectContent(node);
    };

    //Show Content with Category Id
    biographyContent.selectContent = function (node) {
        biographyContent.gridOptions.advancedSearchData.engine.Filters = null;
        biographyContent.gridOptions.advancedSearchData.engine.Filters = [];
        if (node != null && node != undefined) {
            biographyContent.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            biographyContent.contentBusyIndicator.isActive = true;

            biographyContent.attachedFiles = null;
            biographyContent.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryId",
                IntValue1: node.Id,
                SearchType: 0
            }
            biographyContent.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(mainPathApi+"biographyContent/getall", biographyContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            biographyContent.contentBusyIndicator.isActive = false;
            biographyContent.ListItems = response.ListItems;
            biographyContent.gridOptions.fillData(biographyContent.ListItems, response.resultAccess); // Sending Access as an argument
            biographyContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            biographyContent.gridOptions.totalRowCount = response.TotalRowCount;
            biographyContent.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            biographyContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    //open statistics
    biographyContent.Showstatistics = function () {
        if (!biographyContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        ajax.call(mainPathApi+'biographyContent/getviewmodel', biographyContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            biographyContent.selectedItem = response1.Item;
            $modal.open({
                templateUrl: "cpanelv1/Modulebiography/biographyContent/statistics.html",
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add New Content Model
    biographyContent.openAddModel = function () {
        var node = biographyContent.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translate')('To_Add_A_Biography_Please_Select_The_Category'));
            return;
        }
        biographyContent.selectedItemOtherInfos = {};

        biographyContent.attachedFiles = [];
        biographyContent.attachedFile = "";
        biographyContent.filePickerMainImage.filename = "";
        biographyContent.filePickerMainImage.fileId = null;
        biographyContent.filePickerFilePodcast.filename = "";
        biographyContent.filePickerFilePodcast.fileId = null;
        biographyContent.filePickerFiles.filename = "";
        biographyContent.filePickerFiles.fileId = null;
        biographyContent.tags = [];   //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
        biographyContent.kwords = [];   //tagsInput خالی کردن آرایه کلمات کلیدی برای محتوای جدید
        biographyContent.addRequested = false;
        biographyContent.modalTitle = 'اضافه کردن محتوای جدید';
        ajax.call(mainPathApi+'biographyContent/getviewmodel', "0", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            biographyContent.selectedItem = response.Item;
            biographyContent.selectedItem.OtherInfos = [];
            biographyContent.selectedItem.Similars = [];
            biographyContent.selectedItem.LinkCategoryId = node.Id;
            biographyContent.selectedItem.LinkFileIds = null;
            biographyContent.clearPreviousData();
            $modal.open({
                templateUrl: 'cpanelv1/Modulebiography/biographyContent/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    biographyContent.openEditModel = function () {
        if (buttonIsPressed) return;
        biographyContent.addRequested = false;
        biographyContent.selectedItemOtherInfos = {};

        biographyContent.modalTitle = 'ویرایش';
        if (!biographyContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(mainPathApi+'biographyContent/getviewmodel', biographyContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            biographyContent.selectedItem = response1.Item;
            biographyContent.startDate.defaultDate = biographyContent.selectedItem.FromDate;
            biographyContent.endDate.defaultDate = biographyContent.selectedItem.ToDate;
            biographyContent.selectedItem.DateBirth = response1.Item.DateBirth;
            biographyContent.DateBirth.defaultDate = biographyContent.selectedItem.DateBirth;
            biographyContent.filePickerMainImage.filename = null;
            biographyContent.filePickerMainImage.fileId = null;
            biographyContent.filePickerFilePodcast.filename = null;
            biographyContent.filePickerFilePodcast.fileId = null;
            if (response1.Item.LinkMainImageId != null) {
                ajax.call(mainPathApi+'CmsFileContent/getviewmodel', response1.Item.LinkMainImageId, 'GET').success(function (response2) {
                    biographyContent.filePickerMainImage.filename = response2.Item.FileName;
                    biographyContent.filePickerMainImage.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            if (response1.Item.LinkFilePodcastId != null) {
                ajax.call(mainPathApi+'CmsFileContent/getviewmodel', response1.Item.LinkFilePodcastId, 'GET').success(function (response2) {
                    biographyContent.filePickerFilePodcast.filename = response2.Item.FileName;
                    biographyContent.filePickerFilePodcast.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            biographyContent.parseFileIds(response1.Item.LinkFileIds);
            biographyContent.filePickerFiles.filename = null;
            biographyContent.filePickerFiles.fileId = null;
            //Load tagsInput
            biographyContent.tags = [];  //Clear out previous tags
            if (biographyContent.selectedItem.ContentTags == null)
                biographyContent.selectedItem.ContentTags = [];
            $.each(biographyContent.selectedItem.ContentTags, function (index, item) {
                if (item.ModuleTag != null)
                    biographyContent.tags.push({ id: item.ModuleTag.Id, text: item.ModuleTag.Title });  //Add current content's tag to tags array with id and title
            });
            //Load Keywords tagsInput
            biographyContent.kwords = [];  //Clear out previous tags
            var arraykwords = [];
            if (biographyContent.selectedItem.Keyword != null && biographyContent.selectedItem.Keyword != "")
                arraykwords = biographyContent.selectedItem.Keyword.split(',');
            $.each(arraykwords, function (index, item) {
                if (item != null)
                    biographyContent.kwords.push({ text: item });  //Add current content's tag to tags array with id and title
            });
            $modal.open({
                templateUrl: 'cpanelv1/Modulebiography/biographyContent/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    biographyContent.addNewContent = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        biographyContent.categoryBusyIndicator.isActive = true;
        biographyContent.addRequested = true;

        //Save attached file ids into biographyContent.selectedItem.LinkFileIds
        biographyContent.selectedItem.LinkFileIds = "";
        biographyContent.stringfyLinkFileIds();
        //Save Keywords
        $.each(biographyContent.kwords, function (index, item) {
            if (index == 0)
                biographyContent.selectedItem.Keyword = item.text;
            else
                biographyContent.selectedItem.Keyword += ',' + item.text;
        });
        if (biographyContent.selectedItem.LinkCategoryId == null || biographyContent.selectedItem.LinkCategoryId == 0) {
            rashaErManage.showMessage($filter('translate')('To_Add_A_Biography_Please_Select_The_Category'));
            return;
        }
        var apiSelectedItem = biographyContent.selectedItem;
        if (apiSelectedItem.Similars)
            $.each(apiSelectedItem.Similars, function (index, item) {
                item.Destination = [];
            });
        ajax.call(mainPathApi+'biographyContent/add', apiSelectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            biographyContent.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                biographyContent.ListItems.unshift(response.Item);
                biographyContent.gridOptions.fillData(biographyContent.ListItems);
                biographyContent.closeModal();
                //Save inputTags
                biographyContent.selectedItem.ContentTags = [];
                $.each(biographyContent.tags, function (index, item) {
                    if (item.id > 0) {
                        var newObject = $.extend({}, biographyContent.ModuleContentTag);
                        newObject.LinkTagId = item.id;
                        newObject.LinkContentId = response.Item.Id;
                        biographyContent.selectedItem.ContentTags.push(newObject);
                    }
                });
                ajax.call(mainPathApi+'biographyContentTag/addbatch', biographyContent.selectedItem.ContentTags, 'POST').success(function (response) {
                    console.log(response);
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyContent.addRequested = false;
            biographyContent.categoryBusyIndicator.isActive = false;
        });
    }

    //Edit Content
    biographyContent.editContent = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        biographyContent.categoryBusyIndicator.isActive = true;
        biographyContent.addRequested = true;

        //Save attached file ids into biographyContent.selectedItem.LinkFileIds
        biographyContent.selectedItem.LinkFileIds = "";
        biographyContent.stringfyLinkFileIds();
        //Save inputTags
        biographyContent.selectedItem.ContentTags = [];
        $.each(biographyContent.tags, function (index, item) {
            if (item.id > 0) {
                var newObject = $.extend({}, biographyContent.ModuleContentTag);
                newObject.LinkTagId = item.id;
                newObject.LinkContentId = biographyContent.selectedItem.Id;
                biographyContent.selectedItem.ContentTags.push(newObject);
            }
        });
        //Save Keywords
        $.each(biographyContent.kwords, function (index, item) {
            if (index == 0)
                biographyContent.selectedItem.Keyword = item.text;
            else
                biographyContent.selectedItem.Keyword += ',' + item.text;
        });
        if (biographyContent.selectedItem.LinkCategoryId == null || biographyContent.selectedItem.LinkCategoryId == 0) {
            rashaErManage.showMessage($filter('translate')('To_Add_A_Biography_Please_Select_The_Category'));
            return;
        }
        var apiSelectedItem = biographyContent.selectedItem;
        if (apiSelectedItem.Similars)
            $.each(apiSelectedItem.Similars, function (index, item) {
                item.Destination = [];
            });

        ajax.call(mainPathApi+'biographyContent/edit', apiSelectedItem, 'PUT').success(function (response) {
            biographyContent.categoryBusyIndicator.isActive = false;
            biographyContent.addRequested = false;
            biographyContent.treeConfig.showbusy = false;
            biographyContent.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                biographyContent.replaceItem(biographyContent.selectedItem.Id, response.Item);
                biographyContent.gridOptions.fillData(biographyContent.ListItems);
                biographyContent.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyContent.addRequested = false;
            biographyContent.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a biography Content 
    biographyContent.deleteContent = function () {
        if (!biographyContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        biographyContent.treeConfig.showbusy = true;
        biographyContent.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                biographyContent.categoryBusyIndicator.isActive = true;
                console.log(biographyContent.gridOptions.selectedRow.item);
                biographyContent.showbusy = true;
                biographyContent.showIsBusy = true;
                ajax.call(mainPathApi+"biographyContent/getviewmodel", biographyContent.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    biographyContent.showbusy = false;
                    biographyContent.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    biographyContent.selectedItemForDelete = response.Item;
                    console.log(biographyContent.selectedItemForDelete);
                    ajax.call(mainPathApi+"biographyContent/delete", biographyContent.selectedItemForDelete, "DELETE").success(function (res) {
                        biographyContent.categoryBusyIndicator.isActive = false;
                        biographyContent.treeConfig.showbusy = false;
                        biographyContent.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            biographyContent.replaceItem(biographyContent.selectedItemForDelete.Id);
                            biographyContent.gridOptions.fillData(biographyContent.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        biographyContent.treeConfig.showbusy = false;
                        biographyContent.showIsBusy = false;
                        biographyContent.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    biographyContent.treeConfig.showbusy = false;
                    biographyContent.showIsBusy = false;
                    biographyContent.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }
    //#help similar & otherinfo
    biographyContent.clearPreviousData = function () {
        biographyContent.selectedItem.Similars = [];
        $("#to").empty();
    };


    biographyContent.moveSelected = function (from, to, calculatePrice) {
        if (from == "Content") {
            //var title = biographyContent.ItemListIdSelector.selectedItem.Title;
            // var optionSelectedPrice = biographyContent.ItemListIdSelector.selectedItem.Price;
            if (
                biographyContent.selectedItem.LinkDestinationId != undefined &&
                biographyContent.selectedItem.LinkDestinationId != null
            ) {
                if (biographyContent.selectedItem.Similars == undefined)
                    biographyContent.selectedItem.Similars = [];
                for (var i = 0; i < biographyContent.selectedItem.Similars.length; i++) {
                    if (
                        biographyContent.selectedItem.Similars[i].LinkDestinationId ==
                        biographyContent.selectedItem.LinkDestinationId
                    ) {
                        rashaErManage.showMessage($filter('translate')('Content_Is_Duplicate'));
                        return;
                    }
                }
                // if (biographyContent.selectedItem.Title == null || biographyContent.selectedItem.Title.length < 0)
                //     biographyContent.selectedItem.Title = title;
                biographyContent.selectedItem.Similars.push({
                    //Id: 0,
                    //Source: from,
                    LinkDestinationId: biographyContent.selectedItem.LinkDestinationId,
                    Destination: biographyContent.LinkDestinationIdSelector.selectedItem
                });
            }
        }
    };

    //#help otherInfo
    biographyContent.selectedItemOtherInfos = {};
    biographyContent.todoModeTitle = $filter('translate')('ADD_NOW');
    biographyContent.saveTodo = function (mainLIst) {
        if (!mainLIst)
            mainLIst = [];
        if (biographyContent.editMode) {
            $scope.currentItem = biographyContent.selectedItemOtherInfos;
            mainLIst[$scope.currentItemIndex] = biographyContent.selectedItemOtherInfos;
            biographyContent.editMode = false;

            //#help edit
            if (biographyContent.selectedItemOtherInfos.Id && biographyContent.selectedItemOtherInfos.Id > 0)
                ajax.call(mainPathApi+'biographyContentOtherInfo/edit', biographyContent.selectedItemOtherInfos, 'PUT').success(function (response) {
                    rashaErManage.checkAction(response);
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            //#help edit
        } else if (biographyContent.removeMode) {
            $scope.currentItem = biographyContent.selectedItemOtherInfos;
            mainLIst.splice($scope.currentItemIndex, 1);
            biographyContent.removeMode = false;
        } else {
            mainLIst.push(biographyContent.selectedItemOtherInfos);
        }
        biographyContent.selectedItemOtherInfos = "";
        biographyContent.todoModeTitle = $filter('translate')('ADD_NOW');
    };
    biographyContent.editTodo = function (mainLIst, todo) {
        if (!mainLIst)
            mainLIst = [];
        biographyContent.todoModeTitle = $filter('translate')('EDIT_NOW');
        biographyContent.editMode = true;
        biographyContent.selectedItemOtherInfos = angular.copy(todo);
        $scope.currentItemIndex = mainLIst.indexOf(todo);
    };
    biographyContent.removeTodo = function (mainLIst, todo) {
        if (!mainLIst)
            mainLIst = [];
        biographyContent.todoModeTitle = $filter('translate')('REMOVE_NOW');
        biographyContent.removeMode = true;
        biographyContent.selectedItemOtherInfos = angular.copy(todo);
        $scope.currentItemIndex = mainLIst.indexOf(todo);
    };
    //#help otherInfo




    biographyContent.removeFromCollection = function (listsimilar, iddestination) {
        for (var i = 0; i < biographyContent.selectedItem.Similars.length; i++) {
            if (listsimilar[i].LinkDestinationId == iddestination) {
                biographyContent.selectedItem.Similars.splice(i, 1);
                return;
            }

        }

    };



    //#help
    //Confirm/UnConfirm biography Content
    biographyContent.confirmUnConfirmbiographyContent = function () {
        if (!biographyContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }
        ajax.call(mainPathApi+'biographyContent/getviewmodel', biographyContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            biographyContent.selectedItem = response.Item;
            biographyContent.selectedItem.IsAccepted = (response.Item.IsAccepted == true) ? false : true;
            ajax.call(mainPathApi+'biographyContent/edit', biographyContent.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = biographyContent.ListItems.indexOf(biographyContent.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        biographyContent.ListItems[index] = response2.Item;
                    }
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    //Add To Archive New Content
    biographyContent.enableArchive = function () {
        if (!biographyContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }
        ajax.call(mainPathApi+'biographyContent/getviewmodel', biographyContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            biographyContent.selectedItem = response.Item;
            biographyContent.selectedItem.IsArchive = (response.Item.IsArchive == true) ? false : true;
            ajax.call(mainPathApi+'biographyContent/edit', biographyContent.selectedItem, 'PUT').success(function (response2) {
                biographyContent.categoryBusyIndicator.isActive = true;
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = biographyContent.ListItems.indexOf(biographyContent.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        biographyContent.ListItems[index] = response2.Item;
                    }
                    console.log("Arshived Succsseffully");
                    biographyContent.categoryBusyIndicator.isActive = false;
                }

            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                biographyContent.categoryBusyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Replace Item OnDelete/OnEdit Grid Options
    biographyContent.replaceItem = function (oldId, newItem) {
        angular.forEach(biographyContent.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = biographyContent.ListItems.indexOf(item);
                biographyContent.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            biographyContent.ListItems.unshift(newItem);
    }

    biographyContent.summernoteOptions = {
        height: 300,
        focus: true,
        airMode: false,
        toolbar: [
            ['edit', ['undo', 'redo']],
            ['headline', ['style']],
            ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
            ['fontface', ['fontname']],
            ['textsize', ['fontsize']],
            ['fontclr', ['color']],
            ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
            ['height', ['height']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'video', 'hr']],
            ['view', ['fullscreen', 'codeview']],
            ['help', ['help']]
        ]
    };

    biographyContent.summernoteText = '<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />';
    biographyContent.searchData = function () {
        biographyContent.contentBusyIndicator.isActive = true;
        ajax.call(mainPathApi+"biographyContent/getall", biographyContent.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            biographyContent.contentBusyIndicator.isActive = false;
            biographyContent.ListItems = response.ListItems;
            biographyContent.gridOptions.fillData(biographyContent.ListItems);
            biographyContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            biographyContent.gridOptions.totalRowCount = response.TotalRowCount;
            biographyContent.gridOptions.rowPerPage = response.RowPerPage;
            biographyContent.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            biographyContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    biographyContent.addRequested = false;
    biographyContent.closeModal = function () {
        $modalStack.dismissAll();
    };

    biographyContent.showIsBusy = false;

    //Aprove a comment
    biographyContent.confirmComment = function (item) {
        console.log("This comment will be confirmed:", item);
    }

    //Decline a comment
    biographyContent.doNotConfirmComment = function (item) {
        console.log("This comment will not be confirmed:", item);

    }
    //Remove a comment
    biographyContent.deleteComment = function (item) {
        if (!biographyContent.gridContentOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        biographyContent.treeConfig.showbusy = true;
        biographyContent.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translate')('Warning')), "آیا می خواهید این نظر را حذف کنید", function (isConfirmed) {
            if (isConfirmed) {
                console.log("Item to be deleted: ", biographyContent.gridOptions.selectedRow.item);
                biographyContent.showbusy = true;
                biographyContent.showIsBusy = true;
                ajax.call(mainPathApi+'biographyContent/getviewmodel', biographyContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    biographyContent.showbusy = false;
                    biographyContent.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    biographyContent.selectedItemForDelete = response.Item;
                    console.log(biographyContent.selectedItemForDelete);
                    ajax.call(mainPathApi+'biographyContent/delete', biographyContent.selectedItemForDelete, 'DELETE').success(function (res) {
                        biographyContent.treeConfig.showbusy = false;
                        biographyContent.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            biographyContent.replaceItem(biographyContent.selectedItemForDelete.Id);
                            biographyContent.gridOptions.fillData(biographyContent.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        biographyContent.treeConfig.showbusy = false;
                        biographyContent.showIsBusy = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    biographyContent.treeConfig.showbusy = false;
                    biographyContent.showIsBusy = false;
                });
            }
        });
    }

    //For reInit Categories
    biographyContent.gridOptions.reGetAll = function () {
        biographyContent.init();
    };

    biographyContent.isCurrentNodeEmpty = function () {
        return !angular.equals({}, biographyContent.treeConfig.currentNode);
    }

    biographyContent.loadFileAndFolder = function (item) {
        biographyContent.treeConfig.currentNode = item;
        console.log(item);
        biographyContent.treeConfig.onNodeSelect(item);
    }

    biographyContent.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    biographyContent.columnCheckbox = false;
    biographyContent.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = biographyContent.gridOptions.columns;
        if (biographyContent.gridOptions.columnCheckbox) {
            for (var i = 0; i < biographyContent.gridOptions.columns.length; i++) {
                //biographyContent.gridOptions.columns[i].visible = $("#" + biographyContent.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + biographyContent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                biographyContent.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < biographyContent.gridOptions.columns.length; i++) {
                var element = $("#" + biographyContent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + biographyContent.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < biographyContent.gridOptions.columns.length; i++) {
            console.log(biographyContent.gridOptions.columns[i].name.concat(".visible: "), biographyContent.gridOptions.columns[i].visible);
        }
        biographyContent.gridOptions.columnCheckbox = !biographyContent.gridOptions.columnCheckbox;
    }

    biographyContent.deleteAttachedFile = function (index) {
        biographyContent.attachedFiles.splice(index, 1);
    }

    biographyContent.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !biographyContent.alreadyExist(id, biographyContent.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = {
                id: fId, name: fname
            };
            biographyContent.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    biographyContent.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translate')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    biographyContent.filePickerMainImage.removeSelectedfile = function (config) {
        biographyContent.filePickerMainImage.fileId = null;
        biographyContent.filePickerMainImage.filename = null;
        biographyContent.selectedItem.LinkMainImageId = null;

    }
    biographyContent.filePickerFilePodcast.removeSelectedfile = function (config) {
        biographyContent.filePickerFilePodcast.fileId = null;
        biographyContent.filePickerFilePodcast.filename = null;
        biographyContent.selectedItem.LinkFilePodcastId = null;

    }

    biographyContent.filePickerFiles.removeSelectedfile = function (config) {
        biographyContent.filePickerFiles.fileId = null;
        biographyContent.filePickerFiles.filename = null;
        biographyContent.selectedItem.LinkFileIds = null;
    }


    biographyContent.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }

    // ----------- FilePicker Codes --------------------------------
    biographyContent.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !biographyContent.alreadyExist(id, biographyContent.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            biographyContent.attachedFiles.push(file);
            biographyContent.clearfilePickers();
        }
    }

    biographyContent.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translate')('This_Item_Has_Already_Been_Added'));
                biographyContent.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    biographyContent.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;   //String is empty or whitespace then return
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(mainPathApi+'CmsFileContent/getviewmodel', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            biographyContent.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    biographyContent.clearfilePickers = function () {
        biographyContent.filePickerFiles.fileId = null;
        biographyContent.filePickerFiles.filename = null;
    }

    biographyContent.stringfyLinkFileIds = function () {
        $.each(biographyContent.attachedFiles, function (i, item) {
            if (biographyContent.selectedItem.LinkFileIds == "")
                biographyContent.selectedItem.LinkFileIds = item.fileId;
            else
                biographyContent.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    biographyContent.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleBiography/biographyContent/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        biographyContent.FileList = [];
        //get list of file from category id
        ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", null, 'POST').success(function (response) {
            biographyContent.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }
    //---------------Upload Modal Podcast-------------------------------
    biographyContent.openUploadModalPodcast = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleBiography/biographyContent/upload_modalPodcast.html',
            size: 'lg',
            scope: $scope
        });

        biographyContent.FileList = [];
        //get list of file from category id
        ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", null, 'POST').success(function (response) {
            biographyContent.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    biographyContent.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    biographyContent.whatcolor = function (progress) {
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

    biographyContent.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    biographyContent.replaceFile = function (name) {
        biographyContent.itemClicked(null, biographyContent.fileIdToDelete, "file");
        biographyContent.fileTypes = 1;
        biographyContent.fileIdToDelete = biographyContent.selectedIndex;

        // Delete the file
        ajax.call(mainPathApi+"CmsFileContent/getviewmodel", biographyContent.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(mainPathApi+'CmsFileContent/delete', response1.Item, 'DELETE').success(function (response2) {
                    biographyContent.remove(biographyContent.FileList, biographyContent.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(mainPathApi+"CmsFileContent/getviewmodel", "0", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                biographyContent.FileItem = response3.Item;
                                biographyContent.FileItem.FileName = name;
                                biographyContent.FileItem.Extension = name.split('.').pop();
                                biographyContent.FileItem.FileSrc = name;
                                biographyContent.FileItem.LinkCategoryId = biographyContent.thisCategory;
                                biographyContent.saveNewFile();
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
    biographyContent.saveNewFile = function () {
        ajax.call(mainPathApi+"CmsFileContent/add", biographyContent.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                biographyContent.FileItem = response.Item;
                biographyContent.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            biographyContent.showErrorIcon();
            return -1;
        });
    }

    biographyContent.showSuccessIcon = function () {
    }

    biographyContent.showErrorIcon = function () {

    }
    //file is exist
    biographyContent.fileIsExist = function (fileName) {
        for (var i = 0; i < biographyContent.FileList.length; i++) {
            if (biographyContent.FileList[i].FileName == fileName) {
                biographyContent.fileIdToDelete = biographyContent.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    biographyContent.getFileItem = function (id) {
        for (var i = 0; i < biographyContent.FileList.length; i++) {
            if (biographyContent.FileList[i].Id == id) {
                return biographyContent.FileList[i];
            }
        }
    }

    //select file or folder
    biographyContent.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            biographyContent.fileTypes = 1;
            biographyContent.selectedFileId = biographyContent.getFileItem(index).Id;
            biographyContent.selectedFileName = biographyContent.getFileItem(index).FileName;
        }
        else {
            biographyContent.fileTypes = 2;
            biographyContent.selectedCategoryId = biographyContent.getCategoryName(index).Id;
            biographyContent.selectedCategoryTitle = biographyContent.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        biographyContent.selectedIndex = index;

    };
    //upload file Podcast
    biographyContent.uploadFilePodcast = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (biographyContent.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ biographyContent.replaceFile(uploadFile.name);
                    biographyContent.itemClicked(null, biographyContent.fileIdToDelete, "file");
                    biographyContent.fileTypes = 1;
                    biographyContent.fileIdToDelete = biographyContent.selectedIndex;
                    // replace the file
                    ajax
                        .call(
                            mainPathApi+"CmsFileContent/getviewmodel",
                            biographyContent.fileIdToDelete,
                            "GET"
                        )
                        .success(function (response1) {
                            if (response1.IsSuccess == true) {
                                console.log(response1.Item);
                                ajax.call(mainPathApi+"CmsFileContent/replace", response1.Item, "POST")
                                    .success(function (response2) {
                                        if (response2.IsSuccess == true) {
                                            biographyContent.FileItem = response2.Item;
                                            biographyContent.showSuccessIcon();
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-check");
                                            biographyContent.filePickerFilePodcast.filename =
                                                biographyContent.FileItem.FileName;
                                            biographyContent.filePickerFilePodcast.fileId =
                                                response2.Item.Id;
                                            biographyContent.selectedItem.LinkFilePodcastId =
                                                biographyContent.filePickerFilePodcast.fileId;
                                        } else {
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-remove");
                                        }
                                    })
                                    .error(function (data) {
                                        biographyContent.showErrorIcon();
                                        $("#save-icon" + index).removeClass("fa-save");
                                        $("#save-button" + index).removeClass("flashing-button");
                                        $("#save-icon" + index).addClass("fa-remove");
                                    });
                                //-----------------------------------
                            }
                        })
                        .error(function (data) {
                            console.log(data);
                        });
                    //--------------------------------
                } else {
                    return;
                }
            }
            else { // File does not exists
                // Save New file
                ajax.call(mainPathApi+"CmsFileContent/getviewmodel", "0", 'GET').success(function (response) {
                    biographyContent.FileItem = response.Item;
                    biographyContent.FileItem.FileName = uploadFile.name;
                    biographyContent.FileItem.uploadName = uploadFile.uploadName;
                    biographyContent.FileItem.Extension = uploadFile.name.split('.').pop();
                    biographyContent.FileItem.FileSrc = uploadFile.name;
                    biographyContent.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- biographyContent.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(mainPathApi+"CmsFileContent/add", biographyContent.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            biographyContent.FileItem = response.Item;
                            biographyContent.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            biographyContent.filePickerFilePodcast.filename = biographyContent.FileItem.FileName;
                            biographyContent.filePickerFilePodcast.fileId = response.Item.Id;
                            biographyContent.selectedItem.LinkFilePodcastId = biographyContent.filePickerFilePodcast.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        biographyContent.showErrorIcon();
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
    //upload file
    biographyContent.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (biographyContent.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ biographyContent.replaceFile(uploadFile.name);
                    biographyContent.itemClicked(null, biographyContent.fileIdToDelete, "file");
                    biographyContent.fileTypes = 1;
                    biographyContent.fileIdToDelete = biographyContent.selectedIndex;
                    // replace the file
                    ajax
                        .call(
                            mainPathApi+"CmsFileContent/getviewmodel",
                            biographyContent.fileIdToDelete,
                            "GET"
                        )
                        .success(function (response1) {
                            if (response1.IsSuccess == true) {
                                console.log(response1.Item);
                                ajax.call(mainPathApi+"CmsFileContent/replace", response1.Item, "POST")
                                    .success(function (response2) {
                                        if (response2.IsSuccess == true) {
                                            biographyContent.FileItem = response2.Item;
                                            biographyContent.showSuccessIcon();
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-check");
                                            biographyContent.filePickerMainImage.filename =
                                                biographyContent.FileItem.FileName;
                                            biographyContent.filePickerMainImage.fileId =
                                                response2.Item.Id;
                                            biographyContent.selectedItem.LinkMainImageId =
                                                biographyContent.filePickerMainImage.fileId;
                                        } else {
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-remove");
                                        }
                                    })
                                    .error(function (data) {
                                        biographyContent.showErrorIcon();
                                        $("#save-icon" + index).removeClass("fa-save");
                                        $("#save-button" + index).removeClass("flashing-button");
                                        $("#save-icon" + index).addClass("fa-remove");
                                    });
                                //-----------------------------------
                            }
                        })
                        .error(function (data) {
                            console.log(data);
                        });
                    //--------------------------------
                } else {
                    return;
                }
            }
            else { // File does not exists
                // Save New file
                ajax.call(mainPathApi+"CmsFileContent/getviewmodel", "0", 'GET').success(function (response) {
                    biographyContent.FileItem = response.Item;
                    biographyContent.FileItem.FileName = uploadFile.name;
                    biographyContent.FileItem.uploadName = uploadFile.uploadName;
                    biographyContent.FileItem.Extension = uploadFile.name.split('.').pop();
                    biographyContent.FileItem.FileSrc = uploadFile.name;
                    biographyContent.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- biographyContent.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(mainPathApi+"CmsFileContent/add", biographyContent.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            biographyContent.FileItem = response.Item;
                            biographyContent.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            biographyContent.filePickerMainImage.filename = biographyContent.FileItem.FileName;
                            biographyContent.filePickerMainImage.fileId = response.Item.Id;
                            biographyContent.selectedItem.LinkMainImageId = biographyContent.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        biographyContent.showErrorIcon();
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
    biographyContent.exportFile = function () {
        biographyContent.gridOptions.advancedSearchData.engine.ExportFile = biographyContent.ExportFileClass;
        biographyContent.addRequested = true;
        ajax.call(mainPathApi+'BiographyContent/exportfile', biographyContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            biographyContent.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                biographyContent.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //biographyContent.closeModal();
            }
            biographyContent.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    biographyContent.toggleExportForm = function () {
        biographyContent.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        biographyContent.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        biographyContent.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        biographyContent.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        biographyContent.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleBiography/BiographyContent/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    biographyContent.rowCountChanged = function () {
        if (!angular.isDefined(biographyContent.ExportFileClass.RowCount) || biographyContent.ExportFileClass.RowCount > 5000)
            biographyContent.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    biographyContent.getCount = function () {
        ajax.call(mainPathApi+"BiographyContent/count", biographyContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            biographyContent.addRequested = false;
            rashaErManage.checkAction(response);
            biographyContent.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            biographyContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    //TreeControl
    biographyContent.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (biographyContent.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    biographyContent.onNodeToggle = function (node, expanded) {
        if (expanded) {
            node.Children = [];
            var filterModel = { Filters: [] };
            var originalName = node.Title;
            node.messageText = " در حال بارگذاری...";
            filterModel.Filters.push({ PropertyName: "LinkParentId", SearchType: 0, IntValue1: node.Id });
            ajax.call(mainPathApi+"CmsFileCategory/GetAll", filterModel, 'POST').success(function (response1) {
                angular.forEach(response1.ListItems, function (value, key) {
                    node.Children.push(value);
                });
                ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", node.Id, 'POST').success(function (response2) {
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

    biographyContent.onSelection = function (node, selected) {
        if (!selected) {
            biographyContent.selectedItem.LinkMainImageId = null;
            biographyContent.selectedItem.previewImageSrc = null;
            return;
        }
        biographyContent.selectedItem.LinkMainImageId = node.Id;
        biographyContent.selectedItem.previewImageSrc = "CmsFiles/img/loader.gif";
        ajax.call(mainPathApi+"CmsFileContent/getviewmodel", node.Id, "GET").success(function (response) {
            biographyContent.selectedItem.previewImageSrc = "/files/" + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);