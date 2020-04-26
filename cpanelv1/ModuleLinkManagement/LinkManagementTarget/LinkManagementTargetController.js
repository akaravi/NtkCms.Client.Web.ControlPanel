app.controller("linkManagementTargetController", ["$scope", "$stateParams", "$state", "$rootScope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $stateParams, $state, $rootScope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var linkManagementTarget = this;
    linkManagementTarget.RouteUploadFileContent = cmsServerConfig.configRouteUploadFileContent;
    //For Grid Options
    linkManagementTarget.gridOptions = {};
    linkManagementTarget.selectedItem = {};
    linkManagementTarget.attachedFiles = [];
    linkManagementTarget.attachedFile = "";

    linkManagementTarget.selectedContentId = { MemberId: $stateParams.MemberId, BillBoardPatternId: $stateParams.BillBoardPatternId };

    linkManagementTarget.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    linkManagementTarget.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    linkManagementTarget.locationChanged = function (lat, lang) {
        console.log("ok " + lat + " " + lang);
    }


    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) linkManagementTarget.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    linkManagementTarget.selectedItem.ShareBeginDate = date;
    linkManagementTarget.selectedItem.ShareExpireDate = date;
    linkManagementTarget.datePickerConfig = {
        defaultDate: date
    };
    linkManagementTarget.ShareBeginDate = {
        defaultDate: date
    }
    linkManagementTarget.ShareExpireDate = {
        defaultDate: date
    }
    linkManagementTarget.count = 0;

    //#help/ سلکتور member
    linkManagementTarget.LinkManagementMemberIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkManagementMemberId',
        url: 'LinkManagementMember',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: linkManagementTarget,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Username', displayName: 'Username', sortable: true, type: 'string', visible: true },
            ]
        }
    }
    linkManagementTarget.LinkTargetCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkTargetCategoryId',
        url: 'LinkManagementTargetCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: linkManagementTarget,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            ]
        }
    }
    //@help  loadimage pattern
    linkManagementTarget.selectionChanged = function (item) {
        linkManagementTarget.myStyles = {
            'background-image': 'url("' + $rootScope.infoDomainAddress + 'imageThumbnails/' + item.LinkMainImageId + '")',
            'height': '500px',
            'background-position': 'center',
            'background-repeat': 'no-repeat',
        }
    };
    linkManagementTarget.LinkBillboardPatternIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkBillboardPatternId',
        url: 'LinkManagementBillboardPattern',
        onSelectionChanged: linkManagementTarget.selectionChanged,
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: linkManagementTarget,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            ]
        }
    }
    //linkManagement Grid Options
    linkManagementTarget.gridOptions = {
        columns: [
            { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'Description', displayName: ' توضیحات', sortable: true, type: 'string', visible: 'true' },
            { name: 'CarryToWebAddress', displayName: 'لینک مستقیم', sortable: true, type: 'string', visible: 'true' },
            
            { name: "ActionKey", displayName: 'آمار', displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="linkManagementTarget.Showstatistics(x.Id)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' },
            { name: "ActionKey2", displayName: 'Log', displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="linkManagementTarget.ShowLog(x.Id)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }
    //Comment Grid Options
    //linkManagementTarget.gridContentOptions = {
    //    columns: [
    //       { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
    //       { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
    //       { name: 'Writer', displayName: 'نویسنده', sortable: true, type: 'string' },
    //       { name: 'Comment', displayName: 'کامنت', sortable: true, type: 'string' },
    //       { name: 'ActionButtons', displayName: 'کلید عملیاتی', template: '<Button ng-if="!x.IsActivated" ng-click="linkManagementTarget.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button>' + '<Button ng-if="x.IsActivated" ng-click="linkManagementTarget.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button>' + '<Button ng-click="linkManagementTarget.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>' },
    //    ],
    //    data: {},
    //    multiSelect: false,
    //    showUserSearchPanel: false,
    //    advancedSearchData: {
    //        engine: {
    //            CurrentPageNumber: 1,
    //            SortColumn: "Id",
    //            SortType: 0,
    //            NeedToRunFakePagination: false,
    //            TotalRowData: 2000,
    //            RowPerPage: 20,
    //            ContentFullSearch: null,
    //            Filters: [],
    //            Count: false
    //        }
    //    }
    //}

    linkManagementTarget.summernoteOptions = {
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
    }
    //#tagsInput -----
    linkManagementTarget.onTagAdded = function (tag) {
        if (!angular.isDefined(tag.id)) {    //Check if this a new or a existing tag (existing tags comprise with an id)
            var tagObject = jQuery.extend({}, linkManagementTarget.ModuleTag);   //#Clone a Javascript Object
            tagObject.Title = tag.text;
            ajax.call('/api/linkManagementTag/add', tagObject, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                if (response.IsSuccess) {
                    linkManagementTarget.tags[linkManagementTarget.tags.length - 1] = { id: response.Item.Id, text: response.Item.Title };  //Replace the newly added tag (last in the array) with a new object including its Id
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }
    }
    linkManagementTarget.onTagRemoved = function (tag) { }
    //For Show Category Loading Indicator
    linkManagementTarget.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show linkManagement Loading Indicator
    linkManagementTarget.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    linkManagementTarget.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    }




    //open addMenu modal
    linkManagementTarget.Showstatistics = function (selectedId) {
        ajax.call(cmsServerConfig.configApiServerPath+'LinkManagementTarget/GetOne', selectedId, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            linkManagementTarget.selectedItem = response1.Item;
            $modal.open({
                templateUrl: "cpanelv1/ModulelinkManagement/LinkManagementTarget/statistics.html",
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    linkManagementTarget.ShowLog = function (selectedId) {
        $state.go("index.linkmanagementtargetbillboardlog", { TargetId: selectedId });
    }

    linkManagementTarget.treeConfig.currentNode = {};
    linkManagementTarget.treeBusyIndicator = false;

    linkManagementTarget.addRequested = false;

    //linkManagementTarget.showGridComment = false;
    linkManagementTarget.linkManagementTitle = "";

    //init Function
    linkManagementTarget.init = function () {
        //if ((linkManagementTarget.selectedContentId.MemberId == 0 || linkManagementTarget.selectedContentId.MemberId == null) && (linkManagementTarget.selectedContentId.BillBoardPatternId == 0 || linkManagementTarget.selectedContentId.BillBoardPatternId == null)) {
        //    $state.go("index.linkmanagementmember");
        //    return;
        //}
        //if (linkManagementTarget.selectedContentId.BillBoardPatternId == 0 || linkManagementTarget.selectedContentId.BillBoardPatternId == null) {
        //    $state.go("index.linkmanagementbillboardpattern");
        //    return;
        //}
        var engine = {};
        try {
            engine = linkManagementTarget.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }
        ajax.call(cmsServerConfig.configApiServerPath+"linkManagementTargetCategory/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            linkManagementTarget.treeConfig.Items = response.ListItems;
            linkManagementTarget.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"LinkManagementTarget/getAllSharingLinkType", {}, 'POST').success(function (response) {
            linkManagementTarget.SharingLinkType = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"LinkManagementTarget/getAllContentSettingType", {}, 'POST').success(function (response) {
            linkManagementTarget.ContentSettingType = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
            });

        var filterModel = {
            PropertyName: "LinkManagementMemberId",
            SearchType: 0,
            IntValue1: linkManagementTarget.selectedContentId.MemberId
        };
        if (linkManagementTarget.selectedContentId.MemberId > 0)
            engine.Filters.push(filterModel);

        var filterModel = {
            PropertyName: "LinkBillboardPatternId",
            SearchType: 0,
            IntValue1: linkManagementTarget.selectedContentId.BillBoardPatternId
        };
        if (linkManagementTarget.selectedContentId.BillBoardPatternId > 0)
            engine.Filters.push(filterModel);
        ajax.call(cmsServerConfig.configApiServerPath+"LinkManagementTarget/getall",engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementTarget.ListItems = response.ListItems;
            linkManagementTarget.gridOptions.fillData(linkManagementTarget.ListItems, response.resultAccess); // Sending Access as an argument
            linkManagementTarget.contentBusyIndicator.isActive = false;
            linkManagementTarget.gridOptions.currentPageNumber = response.CurrentPageNumber;
            linkManagementTarget.gridOptions.totalRowCount = response.TotalRowCount;
            linkManagementTarget.gridOptions.rowPerPage = response.RowPerPage;
            linkManagementTarget.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            linkManagementTarget.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            linkManagementTarget.contentBusyIndicator.isActive = false;
        });
        //ajax.call(cmsServerConfig.configApiServerPath+"linkManagementTag/GetViewModel", "", 'GET').success(function (response) {    //Get a ViewModel for BiographyTag
        //    linkManagementTarget.ModuleTag = response.Item;
        //}).error(function (data, errCode, c, d) {
        //    console.log(data);
        //});
        //ajax.call(cmsServerConfig.configApiServerPath+"linkManagementContentTag/GetViewModel", "", 'GET').success(function (response) { //Get a ViewModel for BiographyContentTag
        //    linkManagementTarget.ModuleContentTag = response.Item;
        //}).error(function (data, errCode, c, d) {
        //    console.log(data);
        //});
    };
    //#help دریافت پارامترهای مربوطه
    linkManagementTarget.getparameter = function (Idparam) {

        var filterModelparam = { Filters: [] };
        filterModelparam.Filters.push({ PropertyName: "LinkModuleCategoryId", SearchType: 0, IntValue1: Idparam });
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementContentParameter/getall', filterModelparam, 'POST').success(function (response1) {
            linkManagementTarget.ListItemsparam = response1.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //#help اضافه کردن پارامترهای مربوطه
    //linkManagementTarget.getparameter=function(Idparam){

    //            var filterModelparam = { Filters: [] };
    //            filterModelparam.Filters.push({ PropertyName: "LinkModuleCategoryId", SearchType: 0, IntValue1: Idparam });
    //            ajax.call(cmsServerConfig.configApiServerPath+'linkManagementContentAndParameterValue/add', filterModelparam, 'POST').success(function (response1) {
    //                linkManagementTarget.ListItemsparam = response1.ListItems;
    //            }).error(function (data, errCode, c, d) {
    //                rashaErManage.checkAction(data, errCode);
    //            });
    //}

    // For Show Comments
    //linkManagementTarget.showComment = function () {

    //    if (linkManagementTarget.gridOptions.selectedRow.item) {
    //        //var id = linkManagementTarget.gridOptions.selectedRow.item.Id;

    //        var Filter_value = {
    //            PropertyName: "LinklinkManagementTargetId",
    //            IntValue1: linkManagementTarget.gridOptions.selectedRow.item.Id,
    //            SearchType: 0
    //        }
    //        linkManagementTarget.gridContentOptions.advancedSearchData.engine.Filters = null;
    //        linkManagementTarget.gridContentOptions.advancedSearchData.engine.Filters = [];
    //        linkManagementTarget.gridContentOptions.advancedSearchData.engine.Filters.push(Filter_value);


    //        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementComment/getall', linkManagementTarget.gridContentOptions.advancedSearchData.engine, 'POST').success(function (response) {
    //            linkManagementTarget.listComments = response.ListItems;
    //            //linkManagementTarget.gridOptions.resultAccess = response.resultAccess; // دسترسی ها نمایش
    //            linkManagementTarget.gridContentOptions.fillData(linkManagementTarget.listComments, response.resultAccess);
    //            linkManagementTarget.gridContentOptions.currentPageNumber = response.CurrentPageNumber;
    //            linkManagementTarget.gridContentOptions.totalRowCount = response.TotalRowCount;
    //            linkManagementTarget.allowedSearch = response.AllowedSearchField;
    //            rashaErManage.checkAction(response);
    //            linkManagementTarget.gridContentOptions.rowPerPage = response.RowPerPage;
    //            linkManagementTarget.gridOptions.maxSize = 5;
    //            linkManagementTarget.showGridComment = true;
    //            linkManagementTarget.Title = linkManagementTarget.gridOptions.selectedRow.item.Title;
    //        });
    //    }
    //}

    linkManagementTarget.gridOptions.onRowSelected = function () {
        var item = linkManagementTarget.gridOptions.selectedRow.item;
        //linkManagementTarget.showComment(item);
    }

    //linkManagementTarget.gridContentOptions.onRowSelected = function () { }

    // Open Add Category Modal 
    linkManagementTarget.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        linkManagementTarget.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementTargetCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            linkManagementTarget.selectedItem = response.Item;
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
                linkManagementTarget.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(linkManagementTarget.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModulelinkManagement/linkManagementTargetCategory/add.html',
                        scope: $scope
                    });
                    linkManagementTarget.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //-----
            //$modal.open({
            //    templateUrl: 'cpanelv1/ModulelinkManagement/linkManagementTargetCategory/add.html',
            //    scope: $scope
            //});

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Open Edit Category Modal
    linkManagementTarget.editCategoryModel = function () {
        if (buttonIsPressed) { return };
        linkManagementTarget.addRequested = false;
        linkManagementTarget.modalTitle = 'ویرایش';
        if (!linkManagementTarget.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        linkManagementTarget.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementTargetCategory/GetOne', linkManagementTarget.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            linkManagementTarget.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            linkManagementTarget.selectedItem = response.Item;
            //Set dataForTheTree
            linkManagementTarget.selectedNode = [];
            linkManagementTarget.expandedNodes = [];
            linkManagementTarget.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                linkManagementTarget.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(linkManagementTarget.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (linkManagementTarget.selectedItem.LinkMainImageId > 0)
                        linkManagementTarget.onSelection({ Id: linkManagementTarget.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModulelinkManagement/linkManagementTargetCategory/edit.html',
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
            //    templateUrl: 'cpanelv1/ModulelinkManagement/linkManagementTargetCategory/edit.html',
            //    scope: $scope
            //});
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Category
    linkManagementTarget.addNewCategory = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        linkManagementTarget.categoryBusyIndicator.isActive = true;
        linkManagementTarget.addRequested = true;
        linkManagementTarget.selectedItem.LinkParentId = null;
        if (linkManagementTarget.treeConfig.currentNode != null)
            linkManagementTarget.selectedItem.LinkParentId = linkManagementTarget.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementTargetCategory/add', linkManagementTarget.selectedItem, 'POST').success(function (response) {

            linkManagementTarget.addRequested = false;
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                linkManagementTarget.gridOptions.advancedSearchData.engine.Filters = null;
                linkManagementTarget.gridOptions.advancedSearchData.engine.Filters = [];
                linkManagementTarget.gridOptions.reGetAll();
                linkManagementTarget.closeModal();
            }
            linkManagementTarget.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            linkManagementTarget.addRequested = false;
            linkManagementTarget.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    linkManagementTarget.EditCategory = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        linkManagementTarget.addRequested = true;
        linkManagementTarget.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementTargetCategory/edit', linkManagementTarget.selectedItem, 'PUT').success(function (response) {
            linkManagementTarget.addRequested = true;
            //linkManagementTarget.showbusy = false;
            linkManagementTarget.treeConfig.showbusy = false;
            linkManagementTarget.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                linkManagementTarget.addRequested = false;
                linkManagementTarget.treeConfig.currentNode.Title = response.Item.Title;
                linkManagementTarget.closeModal();
            }
            linkManagementTarget.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            linkManagementTarget.addRequested = false;
            linkManagementTarget.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    linkManagementTarget.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = linkManagementTarget.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                linkManagementTarget.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'linkManagementTargetCategory/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    linkManagementTarget.selectedItemForDelete = response.Item;
                    console.log(linkManagementTarget.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'linkManagementTargetCategory/delete', linkManagementTarget.selectedItemForDelete, 'POST').success(function (res) {
                        linkManagementTarget.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //linkManagementTarget.replaceCategoryItem(linkManagementTarget.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            linkManagementTarget.gridOptions.advancedSearchData.engine.Filters = null;
                            linkManagementTarget.gridOptions.advancedSearchData.engine.Filters = [];
                            linkManagementTarget.gridOptions.fillData();
                            linkManagementTarget.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        linkManagementTarget.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    linkManagementTarget.categoryBusyIndicator.isActive = false;

                });

            }
        });
    }

    //Tree On Node Select Options
    linkManagementTarget.treeConfig.onNodeSelect = function () {
        var node = linkManagementTarget.treeConfig.currentNode;
        //linkManagementTarget.showGridComment = false;
        linkManagementTarget.selectContent(node);
    }
    //Show Content with Category Id
    linkManagementTarget.selectContent = function (node) {
        linkManagementTarget.gridOptions.advancedSearchData.engine.Filters = null;
        linkManagementTarget.gridOptions.advancedSearchData.engine.Filters = [];
        if (node != null && node != undefined) {
            linkManagementTarget.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            linkManagementTarget.contentBusyIndicator.isActive = true;
            //linkManagementTarget.gridOptions.advancedSearchData = {};
            linkManagementTarget.attachedFiles = null;
            linkManagementTarget.attachedFiles = [];
            var s = {
                PropertyName: "LinkTargetCategoryId",
                IntValue1: node.Id,
                SearchType: 0
            }
            linkManagementTarget.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"LinkManagementTarget/getall", linkManagementTarget.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementTarget.contentBusyIndicator.isActive = false;
            linkManagementTarget.ListItems = response.ListItems;
            linkManagementTarget.gridOptions.fillData(linkManagementTarget.ListItems, response.resultAccess); // Sending Access as an argument
            linkManagementTarget.gridOptions.currentPageNumber = response.CurrentPageNumber;
            linkManagementTarget.gridOptions.totalRowCount = response.TotalRowCount;
            linkManagementTarget.gridOptions.rowPerPage = response.RowPerPage;
            linkManagementTarget.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            linkManagementTarget.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    linkManagementTarget.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = linkManagementTarget.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Link_Management_Please_Select_The_Category'));
            return;
        }
        linkManagementTarget.attachedFiles = [];
        linkManagementTarget.attachedFile = "";
        linkManagementTarget.filePickerMainImage.filename = "";
        linkManagementTarget.filePickerMainImage.fileId = null;
        linkManagementTarget.filePickerFiles.filename = "";
        linkManagementTarget.filePickerFiles.fileId = null;
        linkManagementTarget.tags = [];   //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
        linkManagementTarget.kwords = [];   //tagsInput خالی کردن آرایه کلمات کلیدی برای محتوای جدید
        linkManagementTarget.addRequested = false;
        linkManagementTarget.modalTitle = 'اضافه کردن محتوای جدید';
        addNewContentModel = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'LinkManagementTarget/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            addNewContentModel = false;
            console.log(response);
            rashaErManage.checkAction(response);
            linkManagementTarget.selectedItem = response.Item;
            linkManagementTarget.selectedItem.OtherInfos = [];
            linkManagementTarget.selectedItem.Similars = [];
            linkManagementTarget.clearPreviousData();
            linkManagementTarget.selectedItem.LinkTargetCategoryId = node.Id;
            linkManagementTarget.selectedItem.LinkFileIds = null;

            //#help دریافت پارامترهای مربوطه
            //linkManagementTarget.getparameter(linkManagementTarget.selectedItem.LinkTargetCategoryId);

            $modal.open({
                templateUrl: 'cpanelv1/ModulelinkManagement/LinkManagementTarget/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    linkManagementTarget.openEditModel = function () {
        if (buttonIsPressed) { return };
        linkManagementTarget.addRequested = false;
        linkManagementTarget.modalTitle = 'ویرایش';
        if (!linkManagementTarget.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'LinkManagementTarget/GetOne', linkManagementTarget.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            linkManagementTarget.selectedItem = response1.Item;
            linkManagementTarget.ShareBeginDate.defaultDate = linkManagementTarget.selectedItem.ShareBeginDate;
            linkManagementTarget.ShareExpireDate.defaultDate = linkManagementTarget.selectedItem.ShareExpireDate;
            linkManagementTarget.filePickerMainImage.filename = null;
            linkManagementTarget.filePickerMainImage.fileId = null;
            if (response1.Item.LinkMainImageId != null) {
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', response1.Item.LinkMainImageId, 'GET').success(function (response2) {
                    buttonIsPressed = false;
                    linkManagementTarget.filePickerMainImage.filename = response2.Item.FileName;
                    linkManagementTarget.filePickerMainImage.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            linkManagementTarget.parseFileIds(response1.Item.LinkFileIds);
            linkManagementTarget.filePickerFiles.filename = null;
            linkManagementTarget.filePickerFiles.fileId = null;
            //Load tagsInput
            linkManagementTarget.tags = [];  //Clear out previous tags
            if (linkManagementTarget.selectedItem.ContentTags == null)
                linkManagementTarget.selectedItem.ContentTags = [];
            $.each(linkManagementTarget.selectedItem.ContentTags, function (index, item) {
                if (item.ModuleTag != null)
                    linkManagementTarget.tags.push({ id: item.ModuleTag.Id, text: item.ModuleTag.Title });  //Add current content's tag to tags array with id and title
            });
            //Load Keywords tagsInput
            linkManagementTarget.kwords = [];  //Clear out previous tags
            var arraykwords = [];
            if (linkManagementTarget.selectedItem.Keyword != null && linkManagementTarget.selectedItem.Keyword != "")
                arraykwords = linkManagementTarget.selectedItem.Keyword.split(',');
            $.each(arraykwords, function (index, item) {
                if (item != null)
                    linkManagementTarget.kwords.push({ text: item });  //Add current content's tag to tags array with id and title
            });
            $modal.open({
                templateUrl: 'cpanelv1/ModulelinkManagement/LinkManagementTarget/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    linkManagementTarget.addNewContent = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        linkManagementTarget.categoryBusyIndicator.isActive = true;
        linkManagementTarget.addRequested = true;
        //Save attached file ids into linkManagementTarget.selectedItem.LinkFileIds
        linkManagementTarget.selectedItem.LinkFileIds = "";
        linkManagementTarget.stringfyLinkFileIds();
        //Save Keywords
        $.each(linkManagementTarget.kwords, function (index, item) {
            if (index == 0)
                linkManagementTarget.selectedItem.Keyword = item.text;
            else
                linkManagementTarget.selectedItem.Keyword += ',' + item.text;
        });
        if (linkManagementTarget.selectedItem.LinkTargetCategoryId == null || linkManagementTarget.selectedItem.LinkTargetCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Link_Management_Please_Select_The_Category'));
            return;
        }
        var apiSelectedItem = jQuery.extend(true, {}, linkManagementTarget.selectedItem);
        if (apiSelectedItem.Similars)
            $.each(apiSelectedItem.Similars, function (index, item) {
                item.Destination = [];
            });
        ajax.call(cmsServerConfig.configApiServerPath+'LinkManagementTarget/add', apiSelectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementTarget.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                linkManagementTarget.ListItems.unshift(response.Item);
                linkManagementTarget.gridOptions.fillData(linkManagementTarget.ListItems);
                linkManagementTarget.closeModal();
                //Save inputTags
                linkManagementTarget.selectedItem.ContentTags = [];
                $.each(linkManagementTarget.tags, function (index, item) {
                    var newObject = $.extend({}, linkManagementTarget.ModuleContentTag);
                    newObject.LinkTagId = item.id;
                    newObject.LinkContentId = response.Item.Id;
                    linkManagementTarget.selectedItem.ContentTags.push(newObject);
                });
                //ajax.call(cmsServerConfig.configApiServerPath+'linkManagementContentTag/addbatch', linkManagementTarget.selectedItem.ContentTags, 'POST').success(function (response) {
                //    console.log(response);
                //}).error(function (data, errCode, c, d) {
                //    rashaErManage.checkAction(data, errCode);
                //});
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            linkManagementTarget.addRequested = false;
            linkManagementTarget.categoryBusyIndicator.isActive = false;
        });
    }

    //Edit Content
    linkManagementTarget.editContent = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        linkManagementTarget.categoryBusyIndicator.isActive = true;
        linkManagementTarget.addRequested = true;

        //Save attached file ids into linkManagementTarget.selectedItem.LinkFileIds
        linkManagementTarget.selectedItem.LinkFileIds = "";
        linkManagementTarget.stringfyLinkFileIds();
        //Save inputTags
        linkManagementTarget.selectedItem.ContentTags = [];
        $.each(linkManagementTarget.tags, function (index, item) {
            var newObject = $.extend({}, linkManagementTarget.ModuleContentTag);
            newObject.LinkTagId = item.id;
            newObject.LinkContentId = linkManagementTarget.selectedItem.Id;
            linkManagementTarget.selectedItem.ContentTags.push(newObject);
        });
        //Save Keywords
        $.each(linkManagementTarget.kwords, function (index, item) {
            if (index == 0)
                linkManagementTarget.selectedItem.Keyword = item.text;
            else
                linkManagementTarget.selectedItem.Keyword += ',' + item.text;
        });
        if (linkManagementTarget.selectedItem.LinkTargetCategoryId == null || linkManagementTarget.selectedItem.LinkTargetCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Link_Management_Please_Select_The_Category'));
            return;
        }
        if (linkManagementTarget.selectedItem.LinkTargetCategoryId == null || linkManagementTarget.selectedItem.LinkTargetCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Link_Management_Please_Select_The_Category'));
            return;
        }
        var apiSelectedItem = jQuery.extend(true, {}, linkManagementTarget.selectedItem);
        if (apiSelectedItem.Similars)
            $.each(apiSelectedItem.Similars, function (index, item) {
                item.Destination = [];
            });
        ajax.call(cmsServerConfig.configApiServerPath+'LinkManagementTarget/edit', apiSelectedItem, 'PUT').success(function (response) {
            linkManagementTarget.categoryBusyIndicator.isActive = false;
            linkManagementTarget.addRequested = false;
            linkManagementTarget.treeConfig.showbusy = false;
            linkManagementTarget.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                linkManagementTarget.replaceItem(linkManagementTarget.selectedItem.Id, response.Item);
                linkManagementTarget.gridOptions.fillData(linkManagementTarget.ListItems);
                linkManagementTarget.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            linkManagementTarget.addRequested = false;
            linkManagementTarget.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a linkManagement Content 
    linkManagementTarget.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!linkManagementTarget.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        linkManagementTarget.treeConfig.showbusy = true;
        linkManagementTarget.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                linkManagementTarget.categoryBusyIndicator.isActive = true;
                console.log(linkManagementTarget.gridOptions.selectedRow.item);
                linkManagementTarget.showbusy = true;
                linkManagementTarget.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"LinkManagementTarget/GetOne", linkManagementTarget.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    linkManagementTarget.showbusy = false;
                    linkManagementTarget.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    linkManagementTarget.selectedItemForDelete = response.Item;
                    console.log(linkManagementTarget.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"LinkManagementTarget/delete", linkManagementTarget.selectedItemForDelete, 'POST').success(function (res) {
                        linkManagementTarget.categoryBusyIndicator.isActive = false;
                        linkManagementTarget.treeConfig.showbusy = false;
                        linkManagementTarget.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            linkManagementTarget.replaceItem(linkManagementTarget.selectedItemForDelete.Id);
                            linkManagementTarget.gridOptions.fillData(linkManagementTarget.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        linkManagementTarget.treeConfig.showbusy = false;
                        linkManagementTarget.showIsBusy = false;
                        linkManagementTarget.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    linkManagementTarget.treeConfig.showbusy = false;
                    linkManagementTarget.showIsBusy = false;
                    linkManagementTarget.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }

    //Confirm/UnConfirm linkManagement Content
    linkManagementTarget.confirmUnConfirmlinkManagementContent = function () {
        if (!linkManagementTarget.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'LinkManagementTarget/GetOne', linkManagementTarget.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementTarget.selectedItem = response.Item;
            linkManagementTarget.selectedItem.IsAccepted = (response.Item.IsAccepted == true) ? false : true;
            ajax.call(cmsServerConfig.configApiServerPath+'LinkManagementTarget/edit', linkManagementTarget.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = linkManagementTarget.ListItems.indexOf(linkManagementTarget.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        linkManagementTarget.ListItems[index] = response2.Item;
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
    linkManagementTarget.enableArchive = function () {
        if (!linkManagementTarget.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'LinkManagementTarget/GetOne', linkManagementTarget.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementTarget.selectedItem = response.Item;
            linkManagementTarget.selectedItem.IsArchive = (response.Item.IsArchive == true) ? false : true;
            ajax.call(cmsServerConfig.configApiServerPath+'LinkManagementTarget/edit', linkManagementTarget.selectedItem, 'PUT').success(function (response2) {
                linkManagementTarget.categoryBusyIndicator.isActive = true;
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = linkManagementTarget.ListItems.indexOf(linkManagementTarget.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        linkManagementTarget.ListItems[index] = response2.Item;
                    }
                    linkManagementTarget.categoryBusyIndicator.isActive = false;
                }

            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                linkManagementTarget.categoryBusyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            linkManagementTarget.categoryBusyIndicator.isActive = false;
        });
    };

    //Replace Item OnDelete/OnEdit Grid Options
    linkManagementTarget.replaceItem = function (oldId, newItem) {
        angular.forEach(linkManagementTarget.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = linkManagementTarget.ListItems.indexOf(item);
                linkManagementTarget.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            linkManagementTarget.ListItems.unshift(newItem);
    }

    linkManagementTarget.summernoteText = '<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />';
    linkManagementTarget.searchData = function () {
        linkManagementTarget.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"LinkManagementTarget/getall", linkManagementTarget.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementTarget.categoryBusyIndicator.isActive = false;
            linkManagementTarget.ListItems = response.ListItems;
            linkManagementTarget.gridOptions.fillData(linkManagementTarget.ListItems);
            linkManagementTarget.gridOptions.currentPageNumber = response.CurrentPageNumber;
            linkManagementTarget.gridOptions.totalRowCount = response.TotalRowCount;
            linkManagementTarget.gridOptions.rowPerPage = response.RowPerPage;
            linkManagementTarget.gridOptions.maxSize = 5;
            linkManagementTarget.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            linkManagementTarget.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    linkManagementTarget.addRequested = false;
    linkManagementTarget.closeModal = function () {
        $modalStack.dismissAll();
    };

    linkManagementTarget.showIsBusy = false;

    ////Aprove a comment
    //linkManagementTarget.confirmComment = function (item) {
    //    console.log("This comment will be confirmed:", item);
    //}

    ////Decline a comment
    //linkManagementTarget.doNotConfirmComment = function (item) {
    //    console.log("This comment will not be confirmed:", item);

    //}
    ////Remove a comment
    //linkManagementTarget.deleteComment = function (item) {
    //    if (!linkManagementTarget.gridContentOptions.selectedRow.item) {
    //        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
    //        return;
    //    }
    //    linkManagementTarget.treeConfig.showbusy = true;
    //    linkManagementTarget.showIsBusy = true;
    //    rashaErManage.showYesNo(($filter('translatentk')('warning')), "آیا می خواهید این نظر را حذف کنید", function (isConfirmed) {
    //        if (isConfirmed) {
    //            console.log("Item to be deleted: ", linkManagementTarget.gridOptions.selectedRow.item);
    //            linkManagementTarget.showbusy = true;
    //            linkManagementTarget.showIsBusy = true;
    //            ajax.call(cmsServerConfig.configApiServerPath+'LinkManagementTarget/GetOne', linkManagementTarget.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
    //                linkManagementTarget.showbusy = false;
    //                linkManagementTarget.showIsBusy = false;
    //                rashaErManage.checkAction(response);
    //                linkManagementTarget.selectedItemForDelete = response.Item;
    //                console.log(linkManagementTarget.selectedItemForDelete);
    //                ajax.call(cmsServerConfig.configApiServerPath+'LinkManagementTarget/delete', linkManagementTarget.selectedItemForDelete, 'POST').success(function (res) {
    //                    linkManagementTarget.treeConfig.showbusy = false;
    //                    linkManagementTarget.showIsBusy = false;
    //                    rashaErManage.checkAction(res);
    //                    if (res.IsSuccess) {
    //                        linkManagementTarget.replaceItem(linkManagementTarget.selectedItemForDelete.Id);
    //                        linkManagementTarget.gridOptions.fillData(linkManagementTarget.ListItems);
    //                    }

    //                }).error(function (data2, errCode2, c2, d2) {
    //                    rashaErManage.checkAction(data2);
    //                    linkManagementTarget.treeConfig.showbusy = false;
    //                    linkManagementTarget.showIsBusy = false;
    //                });
    //            }).error(function (data, errCode, c, d) {
    //                rashaErManage.checkAction(data, errCode);
    //                linkManagementTarget.treeConfig.showbusy = false;
    //                linkManagementTarget.showIsBusy = false;
    //            });
    //        }
    //    });
    //}

    //For reInit Categories
    linkManagementTarget.gridOptions.reGetAll = function () {
        if (linkManagementTarget.gridOptions.advancedSearchData.engine.Filters.length > 0) linkManagementTarget.searchData();
        else linkManagementTarget.init();
    };



    linkManagementTarget.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            linkManagementTarget.focusExpireLockAccount = true;
        });
    };

    linkManagementTarget.isCurrentNodeEmpty = function () {
        return !angular.equals({}, linkManagementTarget.treeConfig.currentNode);
    }

    linkManagementTarget.loadFileAndFolder = function (item) {
        linkManagementTarget.treeConfig.currentNode = item;
        console.log(item);
        linkManagementTarget.treeConfig.onNodeSelect(item);
    }

    linkManagementTarget.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            linkManagementTarget.focus = true;
        });
    };
    linkManagementTarget.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            linkManagementTarget.focus1 = true;
        });
    };

    linkManagementTarget.columnCheckbox = false;
    linkManagementTarget.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = linkManagementTarget.gridOptions.columns;
        if (linkManagementTarget.gridOptions.columnCheckbox) {
            for (var i = 0; i < linkManagementTarget.gridOptions.columns.length; i++) {
                //linkManagementTarget.gridOptions.columns[i].visible = $("#" + linkManagementTarget.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + linkManagementTarget.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                linkManagementTarget.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < linkManagementTarget.gridOptions.columns.length; i++) {
                var element = $("#" + linkManagementTarget.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + linkManagementTarget.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < linkManagementTarget.gridOptions.columns.length; i++) {
            console.log(linkManagementTarget.gridOptions.columns[i].name.concat(".visible: "), linkManagementTarget.gridOptions.columns[i].visible);
        }
        linkManagementTarget.gridOptions.columnCheckbox = !linkManagementTarget.gridOptions.columnCheckbox;
    }

    linkManagementTarget.deleteAttachedFile = function (index) {
        linkManagementTarget.attachedFiles.splice(index, 1);
    }

    linkManagementTarget.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !linkManagementTarget.alreadyExist(id, linkManagementTarget.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = { id: fId, name: fname };
            linkManagementTarget.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    linkManagementTarget.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    linkManagementTarget.filePickerMainImage.removeSelectedfile = function (config) {
        linkManagementTarget.filePickerMainImage.fileId = null;
        linkManagementTarget.filePickerMainImage.filename = null;
        linkManagementTarget.selectedItem.LinkMainImageId = null;

    }

    linkManagementTarget.filePickerFiles.removeSelectedfile = function (config) {
        linkManagementTarget.filePickerFiles.fileId = null;
        linkManagementTarget.filePickerFiles.filename = null;
    }




    linkManagementTarget.showUpload = function () { $("#fastUpload").fadeToggle(); }

    // ----------- FilePicker Codes --------------------------------
    linkManagementTarget.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !linkManagementTarget.alreadyExist(id, linkManagementTarget.attachedFiles)) {
            var fId = id;
            var file = { fileId: fId, filename: fname };
            linkManagementTarget.attachedFiles.push(file);
            linkManagementTarget.clearfilePickers();
        }
    }

    linkManagementTarget.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                linkManagementTarget.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    linkManagementTarget.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            linkManagementTarget.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    linkManagementTarget.clearfilePickers = function () {
        linkManagementTarget.filePickerFiles.fileId = null;
        linkManagementTarget.filePickerFiles.filename = null;
    }

    linkManagementTarget.stringfyLinkFileIds = function () {
        $.each(linkManagementTarget.attachedFiles, function (i, item) {
            if (linkManagementTarget.selectedItem.LinkFileIds == "")
                linkManagementTarget.selectedItem.LinkFileIds = item.fileId;
            else
                linkManagementTarget.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    linkManagementTarget.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModulelinkManagement/LinkManagementTarget/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        linkManagementTarget.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            linkManagementTarget.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    linkManagementTarget.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    linkManagementTarget.whatcolor = function (progress) {
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

    linkManagementTarget.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    linkManagementTarget.replaceFile = function (name) {
        linkManagementTarget.itemClicked(null, linkManagementTarget.fileIdToDelete, "file");
        linkManagementTarget.fileTypes = 1;
        linkManagementTarget.fileIdToDelete = linkManagementTarget.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", linkManagementTarget.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    linkManagementTarget.remove(linkManagementTarget.FileList, linkManagementTarget.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                linkManagementTarget.FileItem = response3.Item;
                                linkManagementTarget.FileItem.FileName = name;
                                linkManagementTarget.FileItem.Extension = name.split('.').pop();
                                linkManagementTarget.FileItem.FileSrc = name;
                                linkManagementTarget.FileItem.LinkCategoryId = linkManagementTarget.thisCategory;
                                linkManagementTarget.saveNewFile();
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
    linkManagementTarget.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", linkManagementTarget.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                linkManagementTarget.FileItem = response.Item;
                linkManagementTarget.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            linkManagementTarget.showErrorIcon();
            return -1;
        });
    }

    linkManagementTarget.showSuccessIcon = function () {
        $().toggle
    }

    linkManagementTarget.showErrorIcon = function () {

    }
    //file is exist
    linkManagementTarget.fileIsExist = function (fileName) {
        for (var i = 0; i < linkManagementTarget.FileList.length; i++) {
            if (linkManagementTarget.FileList[i].FileName == fileName) {
                linkManagementTarget.fileIdToDelete = linkManagementTarget.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    linkManagementTarget.getFileItem = function (id) {
        for (var i = 0; i < linkManagementTarget.FileList.length; i++) {
            if (linkManagementTarget.FileList[i].Id == id) {
                return linkManagementTarget.FileList[i];
            }
        }
    }

    //select file or folder
    linkManagementTarget.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            linkManagementTarget.fileTypes = 1;
            linkManagementTarget.selectedFileId = linkManagementTarget.getFileItem(index).Id;
            linkManagementTarget.selectedFileName = linkManagementTarget.getFileItem(index).FileName;
        }
        else {
            linkManagementTarget.fileTypes = 2;
            linkManagementTarget.selectedCategoryId = linkManagementTarget.getCategoryName(index).Id;
            linkManagementTarget.selectedCategoryTitle = linkManagementTarget.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        linkManagementTarget.selectedIndex = index;

    };

    linkManagementTarget.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    //upload file
    linkManagementTarget.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (linkManagementTarget.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ linkManagementTarget.replaceFile(uploadFile.name);
                    linkManagementTarget.itemClicked(null, linkManagementTarget.fileIdToDelete, "file");
                    linkManagementTarget.fileTypes = 1;
                    linkManagementTarget.fileIdToDelete = linkManagementTarget.selectedIndex;
                    // replace the file
                    ajax
                        .call(
                            cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                            linkManagementTarget.fileIdToDelete,
                            "GET"
                        )
                        .success(function (response1) {
                            if (response1.IsSuccess == true) {
                                console.log(response1.Item);
                                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                                    .success(function (response2) {
                                        if (response2.IsSuccess == true) {
                                            linkManagementTarget.FileItem = response2.Item;
                                            linkManagementTarget.showSuccessIcon();
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-check");
                                            linkManagementTarget.filePickerMainImage.filename =
                                                linkManagementTarget.FileItem.FileName;
                                            linkManagementTarget.filePickerMainImage.fileId =
                                                response2.Item.Id;
                                            linkManagementTarget.selectedItem.LinkMainImageId =
                                                linkManagementTarget.filePickerMainImage.fileId;
                                        } else {
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-remove");
                                        }
                                    })
                                    .error(function (data) {
                                        linkManagementTarget.showErrorIcon();
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
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response) {
                    linkManagementTarget.FileItem = response.Item;
                    linkManagementTarget.FileItem.FileName = uploadFile.name;
                    linkManagementTarget.FileItem.uploadName = uploadFile.uploadName;
                    linkManagementTarget.FileItem.Extension = uploadFile.name.split('.').pop();
                    linkManagementTarget.FileItem.FileSrc = uploadFile.name;
                    linkManagementTarget.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- linkManagementTarget.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", linkManagementTarget.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            linkManagementTarget.FileItem = response.Item;
                            linkManagementTarget.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            linkManagementTarget.filePickerMainImage.filename = linkManagementTarget.FileItem.FileName;
                            linkManagementTarget.filePickerMainImage.fileId = response.Item.Id;
                            linkManagementTarget.selectedItem.LinkMainImageId = linkManagementTarget.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        linkManagementTarget.showErrorIcon();
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
    linkManagementTarget.exportFile = function () {
        linkManagementTarget.gridOptions.advancedSearchData.engine.ExportFile = linkManagementTarget.ExportFileClass;
        linkManagementTarget.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'LinkManagementTarget/exportfile', linkManagementTarget.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            linkManagementTarget.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                linkManagementTarget.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //linkManagementTarget.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    linkManagementTarget.toggleExportForm = function () {
        linkManagementTarget.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        linkManagementTarget.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        linkManagementTarget.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        linkManagementTarget.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        linkManagementTarget.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModulelinkManagement/LinkManagementTarget/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    linkManagementTarget.rowCountChanged = function () {
        if (!angular.isDefined(linkManagementTarget.ExportFileClass.RowCount) || linkManagementTarget.ExportFileClass.RowCount > 5000)
            linkManagementTarget.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    linkManagementTarget.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"LinkManagementTarget/count", linkManagementTarget.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            linkManagementTarget.addRequested = false;
            rashaErManage.checkAction(response);
            linkManagementTarget.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            linkManagementTarget.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    linkManagementTarget.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            linkManagementTarget.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //#help similar & otherinfo
    linkManagementTarget.clearPreviousData = function () {
        linkManagementTarget.selectedItem.Similars = [];
        $("#to").empty();
    };


    linkManagementTarget.moveSelected = function (from, to, calculatePrice) {
        if (from == "Content") {
            //var title = linkManagementTarget.ItemListIdSelector.selectedItem.Title;
            // var optionSelectedPrice = linkManagementTarget.ItemListIdSelector.selectedItem.Price;
            if (
                linkManagementTarget.selectedItem.LinkDestinationId != undefined &&
                linkManagementTarget.selectedItem.LinkDestinationId != null
            ) {
                if (linkManagementTarget.selectedItem.Similars == undefined)
                    linkManagementTarget.selectedItem.Similars = [];
                for (var i = 0; i < linkManagementTarget.selectedItem.Similars.length; i++) {
                    if (
                        linkManagementTarget.selectedItem.Similars[i].LinkDestinationId ==
                        linkManagementTarget.selectedItem.LinkDestinationId
                    ) {
                        rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
                        return;
                    }
                }
                // if (linkManagementTarget.selectedItem.Title == null || linkManagementTarget.selectedItem.Title.length < 0)
                //     linkManagementTarget.selectedItem.Title = title;
                linkManagementTarget.selectedItem.Similars.push({
                    //Id: 0,
                    //Source: from,
                    LinkDestinationId: linkManagementTarget.selectedItem.LinkDestinationId,
                    Destination: linkManagementTarget.LinkDestinationIdSelector.selectedItem
                });
            }
        }
    };
    linkManagementTarget.moveSelectedOtherInfo = function (from, to, y) {


        if (linkManagementTarget.selectedItem.OtherInfos == undefined)
            linkManagementTarget.selectedItem.OtherInfos = [];
        for (var i = 0; i < linkManagementTarget.selectedItem.OtherInfos.length; i++) {

            if (linkManagementTarget.selectedItem.OtherInfos[i].Title == linkManagementTarget.selectedItemOtherInfos.Title && linkManagementTarget.selectedItem.OtherInfos[i].HtmlBody == linkManagementTarget.selectedItemOtherInfos.HtmlBody && linkManagementTarget.selectedItem.OtherInfos[i].Source == linkManagementTarget.selectedItemOtherInfos.Source) {
                rashaErManage.showMessage($filter('translatentk')('Information_Is_Duplicate'));
                return;
            }

        }
        if (linkManagementTarget.selectedItemOtherInfos.Title == "" && linkManagementTarget.selectedItemOtherInfos.Source == "" && linkManagementTarget.selectedItemOtherInfos.HtmlBody == "") {
            rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
        }
        else {

            linkManagementTarget.selectedItem.OtherInfos.push({
                Title: linkManagementTarget.selectedItemOtherInfos.Title,
                HtmlBody: linkManagementTarget.selectedItemOtherInfos.HtmlBody,
                Source: linkManagementTarget.selectedItemOtherInfos.Source
            });
            linkManagementTarget.selectedItemOtherInfos.Title = "";
            linkManagementTarget.selectedItemOtherInfos.Source = "";
            linkManagementTarget.selectedItemOtherInfos.HtmlBody = "";
        }
        if (edititem) {
            edititem = false;
        }

    };

    linkManagementTarget.removeFromCollection = function (listsimilar, iddestination) {
        for (var i = 0; i < linkManagementTarget.selectedItem.Similars.length; i++) {
            if (listsimilar[i].LinkDestinationId == iddestination) {
                linkManagementTarget.selectedItem.Similars.splice(i, 1);
                return;
            }

        }

    };
    linkManagementTarget.removeFromOtherInfo = function (listOtherInfo, title, body, source) {
        for (var i = 0; i < linkManagementTarget.selectedItem.OtherInfos.length; i++) {
            if (listOtherInfo[i].Title == title && listOtherInfo[i].HtmlBody == body && listOtherInfo[i].Source == source) {
                linkManagementTarget.selectedItem.OtherInfos.splice(i, 1);
                return;
            }
        }
    };
    linkManagementTarget.editOtherInfo = function (y) {
        edititem = true;
        linkManagementTarget.selectedItemOtherInfos.Title = y.Title;
        linkManagementTarget.selectedItemOtherInfos.HtmlBody = y.HtmlBody;
        linkManagementTarget.selectedItemOtherInfos.Source = y.Source;
        linkManagementTarget.removeFromOtherInfo(linkManagementTarget.selectedItem.OtherInfos, y.Title, y.HtmlBody, y.Source);
    };


    //#help
    //TreeControl
    linkManagementTarget.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (linkManagementTarget.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    linkManagementTarget.onNodeToggle = function (node, expanded) {
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

    linkManagementTarget.onSelection = function (node, selected) {
        if (!selected) {
            linkManagementTarget.selectedItem.LinkMainImageId = null;
            linkManagementTarget.selectedItem.previewImageSrc = null;
            return;
        }
        linkManagementTarget.selectedItem.LinkMainImageId = node.Id;
        linkManagementTarget.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            linkManagementTarget.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);