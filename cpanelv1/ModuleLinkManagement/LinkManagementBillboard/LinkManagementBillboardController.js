app.controller("linkManagementBillboardController", ["$scope", "$rootScope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$state', '$stateParams', '$filter', function ($scope, $rootScope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $state, $stateParams, $filter) {
    var linkManagementBillboard = this;
    linkManagementBillboard.RouteUploadFileContent = cmsServerConfig.configRouteUploadFileContent;
    var edititem = false;
    //For Grid Options
    linkManagementBillboard.selectedContentId = { MemberId: $stateParams.MemberId, BillBoardPatternId: $stateParams.BillBoardPatternId };

    linkManagementBillboard.gridOptions = {};
    linkManagementBillboard.selectedItem = {};
    linkManagementBillboard.attachedFiles = [];
    linkManagementBillboard.attachedFile = "";

    var todayDate = moment().format();
    linkManagementBillboard.DateBirth = {
        defaultDate: todayDate,
        viewTimePicker: true
    }
    linkManagementBillboard.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }

    linkManagementBillboard.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    linkManagementBillboard.locationChanged = function (lat, lang) {
        console.log("ok " + lat + " " + lang);
    }

    linkManagementBillboard.GeolocationConfig = {
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged: linkManagementBillboard.locationChanged,
        useCurrentLocation: true,
        center: { lat: 32.658066, lng: 51.6693815 },
        zoom: 4,
        scope: linkManagementBillboard,
        useCurrentLocationZoom: 12,
    }
    if (itemRecordStatus != undefined) linkManagementBillboard.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    linkManagementBillboard.selectedItem.ToDate = date;
    linkManagementBillboard.datePickerConfig = {
        defaultDate: date
    };
    linkManagementBillboard.startDate = {
        defaultDate: date
    }
    linkManagementBillboard.endDate = {
        defaultDate: date
    }
    linkManagementBillboard.count = 0;

    //#help/ سلکتور member
    linkManagementBillboard.LinkManagementMemberIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkManagementMemberId',
        url: 'LinkManagementMember',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: linkManagementBillboard,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Username', displayName: 'Username', sortable: true, type: 'string', visible: true },
            ]
        }
    }
    linkManagementBillboard.LinkTargetCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkTargetCategoryId',
        url: 'LinkManagementTargetCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: linkManagementBillboard,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            ]
        }
    };
    //@help  loadimage pattern
    linkManagementBillboard.selectionChanged = function (item) {
        linkManagementBillboard.myStyles = {
            'background-image': 'url("' + $rootScope.cmsServerConfig.configRouteThumbnails + item.LinkMainImageId + '")',
            'height': '500px',
            'background-position': 'center',
            'background-repeat': 'no-repeat',
        }
    };

    linkManagementBillboard.LinkBillboardPatternIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkBillboardPatternId',
        url: 'LinkManagementBillboardPattern',
        sortColumn: 'Id',
        onSelectionChanged: linkManagementBillboard.selectionChanged,
        sortType: 0,
        filterText: 'LinkBillboardPatternId',
        rowPerPage: 200,
        scope: linkManagementBillboard,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            ]
        }
    };
    //shopInvoiceSale.LinkContentIdSelector = {
    //    displayMember: 'Title',
    //    id: 'Id',
    //    fId: 'LinkContentId',
    //    url: 'ShopContent',
    //    onSelectionChanged: shopInvoiceSale.selectionChanged,
    //    sortColumn: 'Id',
    //    sortType: 0,
    //    filterText: 'LinkContentId',
    //    rowPerPage: 200,
    //    scope: shopInvoiceSale,
    //    columnOptions: {
    //        columns: [
    //            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
    //            { name: 'Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
    //        ]
    //    }
    //}
    var buttonIsPressed = false;
    //biography Grid Options
    linkManagementBillboard.gridOptions = {
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
            { name: "ActionKey", displayName: 'آمار', displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="linkManagementBillboard.Showstatistics(x.Id)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' },
            { name: "ActionKey2", displayName: 'Log', displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="linkManagementBillboard.ShowLog(x.Id)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }





    //open addMenu modal
    linkManagementBillboard.Showstatistics = function (selectedId) {
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementBillboard/GetOne', selectedId, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            linkManagementBillboard.selectedItem = response1.Item;
            $modal.open({
                templateUrl: "cpanelv1/ModulelinkManagement/linkManagementBillboard/statistics.html",
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    linkManagementBillboard.ShowLog = function (selectedId) {
        $state.go("index.linkmanagementtargetbillboardlog", { BillboardId: selectedId });
    }


    linkManagementBillboard.gridOptions.advancedSearchData.engine.Filters = null;
    linkManagementBillboard.gridOptions.advancedSearchData.engine.Filters = [];

    //#tagsInput -----
    linkManagementBillboard.onTagAdded = function (tag) {
        if (!angular.isDefined(tag.id)) {    //Check if this a new or a existing tag (existing tags comprise with an id)
            var tagObject = jQuery.extend({}, linkManagementBillboard.ModuleTag);   //#Clone a Javascript Object
            tagObject.Title = tag.text;
            ajax.call('/api/biographyTag/add', tagObject, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                if (response.IsSuccess) {
                    linkManagementBillboard.tags[linkManagementBillboard.tags.length - 1] = { id: response.Item.Id, text: response.Item.Title };  //Replace the newly added tag (last in the array) with a new object including its Id
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }
    }
    linkManagementBillboard.onTagRemoved = function (tag) { }
    //End of #tagsInput

    //For Show Category Loading Indicator
    linkManagementBillboard.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show biography Loading Indicator
    linkManagementBillboard.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    linkManagementBillboard.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    linkManagementBillboard.addMenu = function () {
        $modal.open({
            templateUrl: "cpanelv1/ModuleLinkManagement/LinkManagementBillboard/modalMenu.html",
            scope: $scope
        });
    }
    linkManagementBillboard.treeConfig.currentNode = {};
    linkManagementBillboard.treeBusyIndicator = false;
    linkManagementBillboard.addRequested = false;
    //linkManagementBillboard.showGridComment = false;
    //linkManagementBillboard.biographyTitle = "";

    //init Function
    linkManagementBillboard.init = function () {
        //if (linkManagementBillboard.selectedContentId.MemberId == 0 || linkManagementBillboard.selectedContentId.MemberId == null) {
        //    $state.go("index.linkmanagementmember");
        //    return;
        //}
        //if (linkManagementBillboard.selectedContentId.BillBoardPatternId == 0 || linkManagementBillboard.selectedContentId.BillBoardPatternId == null) {
        //    $state.go("index.linkmanagementbillboardpattern");
        //    return;
        //}
        var engine = {};
        try {
            engine = linkManagementBillboard.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }

        linkManagementBillboard.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"LinkManagementTargetCategory/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            linkManagementBillboard.treeConfig.Items = response.ListItems;
            linkManagementBillboard.treeConfig.Items = response.ListItems;
            linkManagementBillboard.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        var filterModel = {
            PropertyName: "LinkManagementMemberId",
            SearchType: 0,
            IntValue1: linkManagementBillboard.selectedContentId.MemberId
        };
        if (linkManagementBillboard.selectedContentId.MemberId > 0)
            engine.Filters.push(filterModel);

        var filterModel = {
            PropertyName: "LinkBillboardPatternId",
            SearchType: 0,
            IntValue1: linkManagementBillboard.selectedContentId.BillBoardPatternId
        };
        if (linkManagementBillboard.selectedContentId.BillBoardPatternId > 0)
            engine.Filters.push(filterModel);

        ajax.call(cmsServerConfig.configApiServerPath+"LinkManagementBillboard/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementBillboard.ListItems = response.ListItems;
            linkManagementBillboard.gridOptions.fillData(linkManagementBillboard.ListItems, response.resultAccess); // Sending Access as an argument
            linkManagementBillboard.contentBusyIndicator.isActive = false;
            linkManagementBillboard.gridOptions.currentPageNumber = response.CurrentPageNumber;
            linkManagementBillboard.gridOptions.totalRowCount = response.TotalRowCount;
            linkManagementBillboard.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            linkManagementBillboard.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            linkManagementBillboard.contentBusyIndicator.isActive = false;
        });

    };


    linkManagementBillboard.gridOptions.onRowSelected = function () {
        var item = linkManagementBillboard.gridOptions.selectedRow.item;

    }




    //Tree On Node Select Options
    linkManagementBillboard.treeConfig.onNodeSelect = function () {
        var node = linkManagementBillboard.treeConfig.currentNode;
        linkManagementBillboard.showGridComment = false;
        linkManagementBillboard.LinkTargetCategoryIdSelector.selectedItem = node;
        linkManagementBillboard.selectedItem.LinkTargetCategoryId = node.Id;
        linkManagementBillboard.selectContent(node);
    };

    //Show Content with Category Id
    linkManagementBillboard.selectContent = function (node) {
        linkManagementBillboard.gridOptions.advancedSearchData.engine.Filters = null;
        linkManagementBillboard.gridOptions.advancedSearchData.engine.Filters = [];
        if (node != null && node != undefined) {
            linkManagementBillboard.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            linkManagementBillboard.contentBusyIndicator.isActive = true;

            linkManagementBillboard.attachedFiles = null;
            linkManagementBillboard.attachedFiles = [];

            var s = {
                PropertyName: "BillboardTargetCategories",
                PropertyAnyName: "LinkTargetCategoryId",
                IntValue1: node.Id,
                SearchType: 0
            }
            linkManagementBillboard.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"LinkManagementBillboard/getall", linkManagementBillboard.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementBillboard.contentBusyIndicator.isActive = false;
            linkManagementBillboard.ListItems = response.ListItems;
            linkManagementBillboard.gridOptions.fillData(linkManagementBillboard.ListItems, response.resultAccess); // Sending Access as an argument
            linkManagementBillboard.gridOptions.currentPageNumber = response.CurrentPageNumber;
            linkManagementBillboard.gridOptions.totalRowCount = response.TotalRowCount;
            linkManagementBillboard.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            linkManagementBillboard.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Open Add New Content Model
    linkManagementBillboard.openAddModel = function () {
        var node = linkManagementBillboard.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Biography_Please_Select_The_Category'));
            return;
        }
        linkManagementBillboard.attachedFiles = [];
        linkManagementBillboard.attachedFile = "";
        linkManagementBillboard.filePickerMainImage.filename = "";
        linkManagementBillboard.filePickerMainImage.fileId = null;

        linkManagementBillboard.filePickerFiles.filename = "";
        linkManagementBillboard.filePickerFiles.fileId = null;
        linkManagementBillboard.tags = [];   //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
        linkManagementBillboard.kwords = [];   //tagsInput خالی کردن آرایه کلمات کلیدی برای محتوای جدید
        linkManagementBillboard.addRequested = false;
        linkManagementBillboard.modalTitle = 'اضافه کردن محتوای جدید';



        ajax.call(cmsServerConfig.configApiServerPath+'LinkManagementBillboard/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementBillboard.selectedItem = response.Item;
            linkManagementBillboard.selectedItem.OtherInfos = [];
            linkManagementBillboard.selectedItem.BillboardTargetCategories = [];
            linkManagementBillboard.selectedItem.LinkCategoryId = node.Id;
            linkManagementBillboard.selectedItem.LinkFileIds = null;
            linkManagementBillboard.clearPreviousData();
            linkManagementBillboard.selectedItem.BillboardTargetCategories.push({
                LinkTargetCategoryId: linkManagementBillboard.LinkTargetCategoryIdSelector.selectedItem.Id,
                TargetCategory: linkManagementBillboard.LinkTargetCategoryIdSelector.selectedItem
            });
            $modal.open({
                templateUrl: 'cpanelv1/ModuleLinkManagement/LinkManagementBillboard/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    linkManagementBillboard.openEditModel = function () {
        if (buttonIsPressed) return;
        linkManagementBillboard.addRequested = false;
        linkManagementBillboard.modalTitle = 'ویرایش';
        if (!linkManagementBillboard.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'LinkManagementBillboard/GetOne', linkManagementBillboard.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            linkManagementBillboard.selectedItem = response1.Item;
            linkManagementBillboard.startDate.defaultDate = linkManagementBillboard.selectedItem.FromDate;
            linkManagementBillboard.endDate.defaultDate = linkManagementBillboard.selectedItem.ToDate;
            linkManagementBillboard.selectedItem.DateBirth = response1.Item.DateBirth;
            linkManagementBillboard.DateBirth.defaultDate = linkManagementBillboard.selectedItem.DateBirth;
            linkManagementBillboard.filePickerMainImage.filename = null;
            linkManagementBillboard.filePickerMainImage.fileId = null;

            if (response1.Item.LinkMainImageId != null) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', response1.Item.LinkMainImageId, 'GET').success(function (response2) {
                    linkManagementBillboard.filePickerMainImage.filename = response2.Item.FileName;
                    linkManagementBillboard.filePickerMainImage.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }

            linkManagementBillboard.parseFileIds(response1.Item.LinkFileIds);
            linkManagementBillboard.filePickerFiles.filename = null;
            linkManagementBillboard.filePickerFiles.fileId = null;
            //Load tagsInput
            linkManagementBillboard.tags = [];  //Clear out previous tags
            if (linkManagementBillboard.selectedItem.ContentTags == null)
                linkManagementBillboard.selectedItem.ContentTags = [];
            $.each(linkManagementBillboard.selectedItem.ContentTags, function (index, item) {
                if (item.ModuleTag != null)
                    linkManagementBillboard.tags.push({ id: item.ModuleTag.Id, text: item.ModuleTag.Title });  //Add current content's tag to tags array with id and title
            });
            //Load Keywords tagsInput
            linkManagementBillboard.kwords = [];  //Clear out previous tags
            var arraykwords = [];
            if (linkManagementBillboard.selectedItem.Keyword != null && linkManagementBillboard.selectedItem.Keyword != "")
                arraykwords = linkManagementBillboard.selectedItem.Keyword.split(',');
            $.each(arraykwords, function (index, item) {
                if (item != null)
                    linkManagementBillboard.kwords.push({ text: item });  //Add current content's tag to tags array with id and title
            });

            $modal.open({
                templateUrl: 'cpanelv1/ModuleLinkManagement/LinkManagementBillboard/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    linkManagementBillboard.addNewContent = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        linkManagementBillboard.categoryBusyIndicator.isActive = true;
        linkManagementBillboard.addRequested = true;

        //Save attached file ids into linkManagementBillboard.selectedItem.LinkFileIds
        linkManagementBillboard.selectedItem.LinkFileIds = "";
        linkManagementBillboard.stringfyLinkFileIds();
        //Save Keywords
        $.each(linkManagementBillboard.kwords, function (index, item) {
            if (index == 0)
                linkManagementBillboard.selectedItem.Keyword = item.text;
            else
                linkManagementBillboard.selectedItem.Keyword += ',' + item.text;
        });
        if (linkManagementBillboard.selectedItem.LinkCategoryId == null || linkManagementBillboard.selectedItem.LinkCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Biography_Please_Select_The_Category'));
            return;
        }
        //var apiSelectedItem = linkManagementBillboard.selectedItem;
        //if (apiSelectedItem.Similars)
        //    $.each(apiSelectedItem.Similars, function (index, item) {
        //        item.Destination = [];
        //    });
        ajax.call(cmsServerConfig.configApiServerPath+'LinkManagementBillboard/add', linkManagementBillboard.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementBillboard.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                //linkManagementBillboard.selectedItem.BillboardTargetCategories.push({
                //    //Id: 0,
                //    //Source: from,
                //    LinkManagementBillboardId: response.Item.Id,
                //    LinkTargetCategoryId: linkManagementBillboard.LinkTargetCategoryId
                //});



                linkManagementBillboard.ListItems.unshift(response.Item);
                linkManagementBillboard.gridOptions.fillData(linkManagementBillboard.ListItems);
                linkManagementBillboard.closeModal();
                //Save inputTags
                //linkManagementBillboard.selectedItem.ContentTags = [];
                //$.each(linkManagementBillboard.tags, function (index, item) {
                //    var newObject = $.extend({}, linkManagementBillboard.ModuleContentTag);
                //    newObject.LinkTagId = item.id;
                //    newObject.LinkContentId = response.Item.Id;
                //    linkManagementBillboard.selectedItem.ContentTags.push(newObject);
                //});
                //ajax.call(cmsServerConfig.configApiServerPath+'biographyContentTag/addbatch', linkManagementBillboard.selectedItem.ContentTags, 'POST').success(function (response) {
                //    console.log(response);
                //}).error(function (data, errCode, c, d) {
                //    rashaErManage.checkAction(data, errCode);
                //});
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            linkManagementBillboard.addRequested = false;
            linkManagementBillboard.categoryBusyIndicator.isActive = false;
        });
    }

    //Edit Content
    linkManagementBillboard.editContent = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        linkManagementBillboard.categoryBusyIndicator.isActive = true;
        linkManagementBillboard.addRequested = true;

        //Save attached file ids into linkManagementBillboard.selectedItem.LinkFileIds
        linkManagementBillboard.selectedItem.LinkFileIds = "";
        linkManagementBillboard.stringfyLinkFileIds();
        //Save inputTags
        linkManagementBillboard.selectedItem.ContentTags = [];
        //$.each(linkManagementBillboard.tags, function (index, item) {
        //    var newObject = $.extend({}, linkManagementBillboard.ModuleContentTag);
        //    newObject.LinkTagId = item.id;
        //    newObject.LinkContentId = linkManagementBillboard.selectedItem.Id;
        //    linkManagementBillboard.selectedItem.ContentTags.push(newObject);
        //});
        //Save Keywords
        $.each(linkManagementBillboard.kwords, function (index, item) {
            if (index == 0)
                linkManagementBillboard.selectedItem.Keyword = item.text;
            else
                linkManagementBillboard.selectedItem.Keyword += ',' + item.text;
        });
        //if (linkManagementBillboard.selectedItem.LinkCategoryId == null || linkManagementBillboard.selectedItem.LinkCategoryId == 0) {
        //    rashaErManage.showMessage($filter('translatentk')('To_Add_A_Biography_Please_Select_The_Category'));
        //    return;
        //}
        //var apiSelectedItem = linkManagementBillboard.selectedItem;
        //if (apiSelectedItem.BillboardTargetCategories)
        //  $.each(apiSelectedItem.Similars, function(index, item) {
        //    item.Destination = [];
        //  });

        if (linkManagementBillboard.selectedItem.BillboardTargetCategories)
            $.each(linkManagementBillboard.selectedItem.BillboardTargetCategories, function (index, item) {
                item.Billboard = [];
                var Title = item.TargetCategory.Title;
                item.TargetCategory = [];
                item.TargetCategory.Title = Title

            });
        ajax.call(cmsServerConfig.configApiServerPath+'LinkManagementBillboard/edit', linkManagementBillboard.selectedItem, 'PUT').success(function (response) {
            linkManagementBillboard.categoryBusyIndicator.isActive = false;
            linkManagementBillboard.addRequested = false;
            linkManagementBillboard.treeConfig.showbusy = false;
            linkManagementBillboard.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                linkManagementBillboard.replaceItem(linkManagementBillboard.selectedItem.Id, response.Item);
                linkManagementBillboard.gridOptions.fillData(linkManagementBillboard.ListItems);
                linkManagementBillboard.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            linkManagementBillboard.addRequested = false;
            linkManagementBillboard.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a biography Content 
    linkManagementBillboard.deleteContent = function () {
        if (!linkManagementBillboard.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        linkManagementBillboard.treeConfig.showbusy = true;
        linkManagementBillboard.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                linkManagementBillboard.categoryBusyIndicator.isActive = true;
                console.log(linkManagementBillboard.gridOptions.selectedRow.item);
                linkManagementBillboard.showbusy = true;
                linkManagementBillboard.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+"LinkManagementBillboard/GetOne", linkManagementBillboard.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    linkManagementBillboard.showbusy = false;
                    linkManagementBillboard.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    linkManagementBillboard.selectedItemForDelete = response.Item;
                    console.log(linkManagementBillboard.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"LinkManagementBillboard/delete", linkManagementBillboard.selectedItemForDelete, 'POST').success(function (res) {
                        linkManagementBillboard.categoryBusyIndicator.isActive = false;
                        linkManagementBillboard.treeConfig.showbusy = false;
                        linkManagementBillboard.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            linkManagementBillboard.replaceItem(linkManagementBillboard.selectedItemForDelete.Id);
                            linkManagementBillboard.gridOptions.fillData(linkManagementBillboard.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        linkManagementBillboard.treeConfig.showbusy = false;
                        linkManagementBillboard.showIsBusy = false;
                        linkManagementBillboard.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    linkManagementBillboard.treeConfig.showbusy = false;
                    linkManagementBillboard.showIsBusy = false;
                    linkManagementBillboard.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }
    //#help similar & otherinfo
    linkManagementBillboard.clearPreviousData = function () {
        linkManagementBillboard.selectedItem.BillboardTargetCategories = [];
        $("#to").empty();
    };


    linkManagementBillboard.moveSelected = function (from, to, calculatePrice) {
        if (from == "Content") {
            //var title = linkManagementBillboard.ItemListIdSelector.selectedItem.Title;
            // var optionSelectedPrice = linkManagementBillboard.ItemListIdSelector.selectedItem.Price;
            if (
                linkManagementBillboard.selectedItem.LinkTargetCategoryId != undefined &&
                linkManagementBillboard.selectedItem.LinkTargetCategoryId != null
            ) {
                if (linkManagementBillboard.selectedItem.BillboardTargetCategories == undefined)
                    linkManagementBillboard.selectedItem.BillboardTargetCategories = [];
                for (var i = 0; i < linkManagementBillboard.selectedItem.BillboardTargetCategories.length; i++) {
                    if (
                        linkManagementBillboard.selectedItem.BillboardTargetCategories[i].LinkTargetCategoryId ==
                        linkManagementBillboard.selectedItem.LinkTargetCategoryId
                    ) {
                        rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
                        return;
                    }
                }

                linkManagementBillboard.selectedItem.BillboardTargetCategories.push({
                    LinkTargetCategoryId: linkManagementBillboard.selectedItem.LinkTargetCategoryId,
                    LinkManagementBillboardId: linkManagementBillboard.selectedItem.Id,
                    TargetCategory: linkManagementBillboard.LinkTargetCategoryIdSelector.selectedItem
                });
            }
        }
    };


    linkManagementBillboard.removeFromCollection = function (listsimilar, iddestination) {
        for (var i = 0; i < linkManagementBillboard.selectedItem.BillboardTargetCategories.length; i++) {
            if (listsimilar[i].LinkTargetCategoryId == iddestination) {
                linkManagementBillboard.selectedItem.BillboardTargetCategories.splice(i, 1);
                return;
            }

        }

    };

    //#help
    //Confirm/UnConfirm biography Content
    linkManagementBillboard.confirmUnConfirmbiographyContent = function () {
        if (!linkManagementBillboard.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'LinkManagementBillboard/GetOne', linkManagementBillboard.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementBillboard.selectedItem = response.Item;
            linkManagementBillboard.selectedItem.IsAccepted = (response.Item.IsAccepted == true) ? false : true;
            ajax.call(cmsServerConfig.configApiServerPath+'LinkManagementBillboard/edit', linkManagementBillboard.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = linkManagementBillboard.ListItems.indexOf(linkManagementBillboard.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        linkManagementBillboard.ListItems[index] = response2.Item;
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
    linkManagementBillboard.enableArchive = function () {
        if (!linkManagementBillboard.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'LinkManagementBillboard/GetOne', linkManagementBillboard.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementBillboard.selectedItem = response.Item;
            linkManagementBillboard.selectedItem.IsArchive = (response.Item.IsArchive == true) ? false : true;
            ajax.call(cmsServerConfig.configApiServerPath+'LinkManagementBillboard/edit', linkManagementBillboard.selectedItem, 'PUT').success(function (response2) {
                linkManagementBillboard.categoryBusyIndicator.isActive = true;
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = linkManagementBillboard.ListItems.indexOf(linkManagementBillboard.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        linkManagementBillboard.ListItems[index] = response2.Item;
                    }
                    console.log("Arshived Succsseffully");
                    linkManagementBillboard.categoryBusyIndicator.isActive = false;
                }

            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                linkManagementBillboard.categoryBusyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            linkManagementBillboard.categoryBusyIndicator.isActive = false;
        });
    };

    //Replace Item OnDelete/OnEdit Grid Options
    linkManagementBillboard.replaceItem = function (oldId, newItem) {
        angular.forEach(linkManagementBillboard.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = linkManagementBillboard.ListItems.indexOf(item);
                linkManagementBillboard.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            linkManagementBillboard.ListItems.unshift(newItem);
    }

    linkManagementBillboard.summernoteOptions = {
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

    linkManagementBillboard.summernoteText = '<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />';
    linkManagementBillboard.searchData = function () {
        linkManagementBillboard.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"LinkManagementBillboard/getall", linkManagementBillboard.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementBillboard.contentBusyIndicator.isActive = false;
            linkManagementBillboard.ListItems = response.ListItems;
            linkManagementBillboard.gridOptions.fillData(linkManagementBillboard.ListItems);
            linkManagementBillboard.gridOptions.currentPageNumber = response.CurrentPageNumber;
            linkManagementBillboard.gridOptions.totalRowCount = response.TotalRowCount;
            linkManagementBillboard.gridOptions.rowPerPage = response.RowPerPage;
            linkManagementBillboard.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            linkManagementBillboard.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    linkManagementBillboard.addRequested = false;
    linkManagementBillboard.closeModal = function () {
        $modalStack.dismissAll();
    };

    linkManagementBillboard.showIsBusy = false;

    ////Aprove a comment
    //linkManagementBillboard.confirmComment = function (item) {
    //    console.log("This comment will be confirmed:", item);
    //}

    ////Decline a comment
    //linkManagementBillboard.doNotConfirmComment = function (item) {
    //    console.log("This comment will not be confirmed:", item);

    //}
    ////Remove a comment
    //linkManagementBillboard.deleteComment = function (item) {
    //    if (!linkManagementBillboard.gridContentOptions.selectedRow.item) {
    //        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
    //        return;
    //    }
    //    linkManagementBillboard.treeConfig.showbusy = true;
    //    linkManagementBillboard.showIsBusy = true;
    //    rashaErManage.showYesNo(($filter('translatentk')('warning')), "آیا می خواهید این نظر را حذف کنید", function (isConfirmed) {
    //        if (isConfirmed) {
    //            console.log("Item to be deleted: ", linkManagementBillboard.gridOptions.selectedRow.item);
    //            linkManagementBillboard.showbusy = true;
    //            linkManagementBillboard.showIsBusy = true;
    //            ajax.call(cmsServerConfig.configApiServerPath+'LinkManagementBillboard/GetOne', linkManagementBillboard.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
    //                linkManagementBillboard.showbusy = false;
    //                linkManagementBillboard.showIsBusy = false;
    //                rashaErManage.checkAction(response);
    //                linkManagementBillboard.selectedItemForDelete = response.Item;
    //                console.log(linkManagementBillboard.selectedItemForDelete);
    //                ajax.call(cmsServerConfig.configApiServerPath+'LinkManagementBillboard/delete', linkManagementBillboard.selectedItemForDelete, 'POST').success(function (res) {
    //                    linkManagementBillboard.treeConfig.showbusy = false;
    //                    linkManagementBillboard.showIsBusy = false;
    //                    rashaErManage.checkAction(res);
    //                    if (res.IsSuccess) {
    //                        linkManagementBillboard.replaceItem(linkManagementBillboard.selectedItemForDelete.Id);
    //                        linkManagementBillboard.gridOptions.fillData(linkManagementBillboard.ListItems);
    //                    }

    //                }).error(function (data2, errCode2, c2, d2) {
    //                    rashaErManage.checkAction(data2);
    //                    linkManagementBillboard.treeConfig.showbusy = false;
    //                    linkManagementBillboard.showIsBusy = false;
    //                });
    //            }).error(function (data, errCode, c, d) {
    //                rashaErManage.checkAction(data, errCode);
    //                linkManagementBillboard.treeConfig.showbusy = false;
    //                linkManagementBillboard.showIsBusy = false;
    //            });
    //        }
    //    });
    //}

    //For reInit Categories
    linkManagementBillboard.gridOptions.reGetAll = function () {
        linkManagementBillboard.init();
    };

    linkManagementBillboard.isCurrentNodeEmpty = function () {
        return !angular.equals({}, linkManagementBillboard.treeConfig.currentNode);
    }

    linkManagementBillboard.loadFileAndFolder = function (item) {
        linkManagementBillboard.treeConfig.currentNode = item;
        console.log(item);
        linkManagementBillboard.treeConfig.onNodeSelect(item);
    }

    linkManagementBillboard.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    linkManagementBillboard.columnCheckbox = false;
    linkManagementBillboard.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = linkManagementBillboard.gridOptions.columns;
        if (linkManagementBillboard.gridOptions.columnCheckbox) {
            for (var i = 0; i < linkManagementBillboard.gridOptions.columns.length; i++) {
                //linkManagementBillboard.gridOptions.columns[i].visible = $("#" + linkManagementBillboard.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + linkManagementBillboard.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                linkManagementBillboard.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < linkManagementBillboard.gridOptions.columns.length; i++) {
                var element = $("#" + linkManagementBillboard.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + linkManagementBillboard.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < linkManagementBillboard.gridOptions.columns.length; i++) {
            console.log(linkManagementBillboard.gridOptions.columns[i].name.concat(".visible: "), linkManagementBillboard.gridOptions.columns[i].visible);
        }
        linkManagementBillboard.gridOptions.columnCheckbox = !linkManagementBillboard.gridOptions.columnCheckbox;
    }

    linkManagementBillboard.deleteAttachedFile = function (index) {
        linkManagementBillboard.attachedFiles.splice(index, 1);
    }

    linkManagementBillboard.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !linkManagementBillboard.alreadyExist(id, linkManagementBillboard.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = {
                id: fId, name: fname
            };
            linkManagementBillboard.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    linkManagementBillboard.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    linkManagementBillboard.filePickerMainImage.removeSelectedfile = function (config) {
        linkManagementBillboard.filePickerMainImage.fileId = null;
        linkManagementBillboard.filePickerMainImage.filename = null;
        linkManagementBillboard.selectedItem.LinkMainImageId = null;

    }


    linkManagementBillboard.filePickerFiles.removeSelectedfile = function (config) {
        linkManagementBillboard.filePickerFiles.fileId = null;
        linkManagementBillboard.filePickerFiles.filename = null;
        linkManagementBillboard.selectedItem.LinkFileIds = null;
    }


    linkManagementBillboard.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }

    // ----------- FilePicker Codes --------------------------------
    linkManagementBillboard.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !linkManagementBillboard.alreadyExist(id, linkManagementBillboard.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            linkManagementBillboard.attachedFiles.push(file);
            linkManagementBillboard.clearfilePickers();
        }
    }

    linkManagementBillboard.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                linkManagementBillboard.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    linkManagementBillboard.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;   //String is empty or whitespace then return
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            linkManagementBillboard.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    linkManagementBillboard.clearfilePickers = function () {
        linkManagementBillboard.filePickerFiles.fileId = null;
        linkManagementBillboard.filePickerFiles.filename = null;
    }

    linkManagementBillboard.stringfyLinkFileIds = function () {
        $.each(linkManagementBillboard.attachedFiles, function (i, item) {
            if (linkManagementBillboard.selectedItem.LinkFileIds == "")
                linkManagementBillboard.selectedItem.LinkFileIds = item.fileId;
            else
                linkManagementBillboard.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    linkManagementBillboard.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleLinkManagement/LinkManagementBillboard/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        linkManagementBillboard.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            linkManagementBillboard.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }


    linkManagementBillboard.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    linkManagementBillboard.whatcolor = function (progress) {
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

    linkManagementBillboard.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    linkManagementBillboard.replaceFile = function (name) {
        linkManagementBillboard.itemClicked(null, linkManagementBillboard.fileIdToDelete, "file");
        linkManagementBillboard.fileTypes = 1;
        linkManagementBillboard.fileIdToDelete = linkManagementBillboard.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", linkManagementBillboard.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    linkManagementBillboard.remove(linkManagementBillboard.FileList, linkManagementBillboard.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                linkManagementBillboard.FileItem = response3.Item;
                                linkManagementBillboard.FileItem.FileName = name;
                                linkManagementBillboard.FileItem.Extension = name.split('.').pop();
                                linkManagementBillboard.FileItem.FileSrc = name;
                                linkManagementBillboard.FileItem.LinkCategoryId = linkManagementBillboard.thisCategory;
                                linkManagementBillboard.saveNewFile();
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
    linkManagementBillboard.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", linkManagementBillboard.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                linkManagementBillboard.FileItem = response.Item;
                linkManagementBillboard.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            linkManagementBillboard.showErrorIcon();
            return -1;
        });
    }

    linkManagementBillboard.showSuccessIcon = function () {
    }

    linkManagementBillboard.showErrorIcon = function () {

    }
    //file is exist
    linkManagementBillboard.fileIsExist = function (fileName) {
        for (var i = 0; i < linkManagementBillboard.FileList.length; i++) {
            if (linkManagementBillboard.FileList[i].FileName == fileName) {
                linkManagementBillboard.fileIdToDelete = linkManagementBillboard.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    linkManagementBillboard.getFileItem = function (id) {
        for (var i = 0; i < linkManagementBillboard.FileList.length; i++) {
            if (linkManagementBillboard.FileList[i].Id == id) {
                return linkManagementBillboard.FileList[i];
            }
        }
    }

    //select file or folder
    linkManagementBillboard.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            linkManagementBillboard.fileTypes = 1;
            linkManagementBillboard.selectedFileId = linkManagementBillboard.getFileItem(index).Id;
            linkManagementBillboard.selectedFileName = linkManagementBillboard.getFileItem(index).FileName;
        }
        else {
            linkManagementBillboard.fileTypes = 2;
            linkManagementBillboard.selectedCategoryId = linkManagementBillboard.getCategoryName(index).Id;
            linkManagementBillboard.selectedCategoryTitle = linkManagementBillboard.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        linkManagementBillboard.selectedIndex = index;

    };

    //upload file
    linkManagementBillboard.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (linkManagementBillboard.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ linkManagementBillboard.replaceFile(uploadFile.name);
                    linkManagementBillboard.itemClicked(null, linkManagementBillboard.fileIdToDelete, "file");
                    linkManagementBillboard.fileTypes = 1;
                    linkManagementBillboard.fileIdToDelete = linkManagementBillboard.selectedIndex;
                    // replace the file
                    ajax
                        .call(
                            cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                            linkManagementBillboard.fileIdToDelete,
                            "GET"
                        )
                        .success(function (response1) {
                            if (response1.IsSuccess == true) {
                                console.log(response1.Item);
                                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                                    .success(function (response2) {
                                        if (response2.IsSuccess == true) {
                                            linkManagementBillboard.FileItem = response2.Item;
                                            linkManagementBillboard.showSuccessIcon();
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-check");
                                            linkManagementBillboard.filePickerMainImage.filename =
                                                linkManagementBillboard.FileItem.FileName;
                                            linkManagementBillboard.filePickerMainImage.fileId =
                                                response2.Item.Id;
                                            linkManagementBillboard.selectedItem.LinkMainImageId =
                                                linkManagementBillboard.filePickerMainImage.fileId;
                                        } else {
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-remove");
                                        }
                                    })
                                    .error(function (data) {
                                        linkManagementBillboard.showErrorIcon();
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
                    linkManagementBillboard.FileItem = response.Item;
                    linkManagementBillboard.FileItem.FileName = uploadFile.name;
                    linkManagementBillboard.FileItem.uploadName = uploadFile.uploadName;
                    linkManagementBillboard.FileItem.Extension = uploadFile.name.split('.').pop();
                    linkManagementBillboard.FileItem.FileSrc = uploadFile.name;
                    linkManagementBillboard.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- linkManagementBillboard.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", linkManagementBillboard.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            linkManagementBillboard.FileItem = response.Item;
                            linkManagementBillboard.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            linkManagementBillboard.filePickerMainImage.filename = linkManagementBillboard.FileItem.FileName;
                            linkManagementBillboard.filePickerMainImage.fileId = response.Item.Id;
                            linkManagementBillboard.selectedItem.LinkMainImageId = linkManagementBillboard.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        linkManagementBillboard.showErrorIcon();
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
    linkManagementBillboard.exportFile = function () {
        linkManagementBillboard.gridOptions.advancedSearchData.engine.ExportFile = linkManagementBillboard.ExportFileClass;
        linkManagementBillboard.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'LinkManagementBillboard/exportfile', linkManagementBillboard.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            linkManagementBillboard.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                linkManagementBillboard.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //linkManagementBillboard.closeModal();
            }
            linkManagementBillboard.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    linkManagementBillboard.toggleExportForm = function () {
        linkManagementBillboard.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        linkManagementBillboard.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        linkManagementBillboard.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        linkManagementBillboard.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        linkManagementBillboard.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleLinkManagement/LinkManagementBillboard/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    linkManagementBillboard.rowCountChanged = function () {
        if (!angular.isDefined(linkManagementBillboard.ExportFileClass.RowCount) || linkManagementBillboard.ExportFileClass.RowCount > 5000)
            linkManagementBillboard.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    linkManagementBillboard.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"LinkManagementBillboard/count", linkManagementBillboard.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            linkManagementBillboard.addRequested = false;
            rashaErManage.checkAction(response);
            linkManagementBillboard.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            linkManagementBillboard.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    //TreeControl
    linkManagementBillboard.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (linkManagementBillboard.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    linkManagementBillboard.onNodeToggle = function (node, expanded) {
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

    linkManagementBillboard.onSelection = function (node, selected) {
        if (!selected) {
            linkManagementBillboard.selectedItem.LinkMainImageId = null;
            linkManagementBillboard.selectedItem.previewImageSrc = null;
            return;
        }
        linkManagementBillboard.selectedItem.LinkMainImageId = node.Id;
        linkManagementBillboard.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            linkManagementBillboard.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);