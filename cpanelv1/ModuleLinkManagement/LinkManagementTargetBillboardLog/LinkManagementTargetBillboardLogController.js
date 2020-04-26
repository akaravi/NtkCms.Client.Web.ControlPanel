app.controller("linkManagementTargetBillboardLogController", ["$scope", "$stateParams", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $stateParams, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var linkManagementTargetBillboardLog = this;
    linkManagementTargetBillboardLog.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    var date = moment().format();

    linkManagementTargetBillboardLog.datePickerConfig = {
        defaultDate: date
    };
    linkManagementTargetBillboardLog.VisitDate = {
        defaultDate: date
    }
    linkManagementTargetBillboardLog.selectedContentId = {
        TargetId: $stateParams.TargetId,
        BillboardId: $stateParams.BillboardId,
        BillBoardPatternId: $stateParams.BillBoardPatternId,
    };
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    linkManagementTargetBillboardLog.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "linkManagementTargetBillboardLogCtrl") {
            localStorage.setItem('AddRequest', '');
            linkManagementTargetBillboardLog.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    linkManagementTargetBillboardLog.ContentList = [];

    linkManagementTargetBillboardLog.allowedSearch = [];
    if (itemRecordStatus != undefined) linkManagementTargetBillboardLog.itemRecordStatus = itemRecordStatus;
    linkManagementTargetBillboardLog.init = function () {
        linkManagementTargetBillboardLog.busyIndicator.isActive = true;

     
        var filterModel = {
            PropertyName: "LinkManagementTargetId",
            SearchType: 0,
            IntValue1: linkManagementTargetBillboardLog.selectedContentId.TargetId
        };
        if (linkManagementTargetBillboardLog.selectedContentId.TargetId > 0)
            linkManagementTargetBillboardLog.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
        var filterModel = {
            PropertyName: "LinkManagementBillboardId",
            SearchType: 0,
            IntValue1: linkManagementTargetBillboardLog.selectedContentId.BillboardId
        };
        if (linkManagementTargetBillboardLog.selectedContentId.BillboardId > 0)
            linkManagementTargetBillboardLog.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
        var filterModel = {
            PropertyName: "LinkBillboardPatternId",
            SearchType: 0,
            IntValue1: linkManagementTargetBillboardLog.selectedContentId.BillBoardPatternId
        };
        if (linkManagementTargetBillboardLog.selectedContentId.BillBoardPatternId > 0)
            linkManagementTargetBillboardLog.gridOptions.advancedSearchData.engine.Filters.push(filterModel);

        ajax.call(cmsServerConfig.configApiServerPath+"linkManagementTargetBillboardLog/getall", linkManagementTargetBillboardLog.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementTargetBillboardLog.busyIndicator.isActive = false;
            linkManagementTargetBillboardLog.ListItems = response.ListItems;
            linkManagementTargetBillboardLog.gridOptions.fillData(linkManagementTargetBillboardLog.ListItems, response.resultAccess);
            linkManagementTargetBillboardLog.gridOptions.currentPageNumber = response.CurrentPageNumber;
            linkManagementTargetBillboardLog.gridOptions.totalRowCount = response.TotalRowCount;
            linkManagementTargetBillboardLog.gridOptions.rowPerPage = response.RowPerPage;
            linkManagementTargetBillboardLog.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            linkManagementTargetBillboardLog.busyIndicator.isActive = false;
            linkManagementTargetBillboardLog.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //linkManagementTargetBillboardLog.busyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+'linkManagementTargetBillboardLog/getall', {}, 'POST').success(function (response) {
        //    linkManagementTargetBillboardLog.ContentList = response.ListItems;
        //    linkManagementTargetBillboardLog.busyIndicator.isActive = false;
        //});
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        linkManagementTargetBillboardLog.checkRequestAddNewItemFromOtherControl(null);
    }
    linkManagementTargetBillboardLog.busyIndicator.isActive = true;
    linkManagementTargetBillboardLog.addRequested = false;
 


    linkManagementTargetBillboardLog.openEditModal = function (ContentLogId) {

        linkManagementTargetBillboardLog.modalTitle = 'ویرایش';
        if (!linkManagementTargetBillboardLog.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementTargetBillboardLog/GetOne', ContentLogId, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementTargetBillboardLog.selectedItem = response.Item;
            linkManagementTargetBillboardLog.VisitDate.defaultDate = linkManagementTargetBillboardLog.selectedItem.VisitDate;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleLinkManagement/linkManagementTargetBillboardLog/view.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    


    linkManagementTargetBillboardLog.closeModal = function () {
        $modalStack.dismissAll();
    };

    linkManagementTargetBillboardLog.replaceItem = function (oldId, newItem) {
        angular.forEach(linkManagementTargetBillboardLog.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = linkManagementTargetBillboardLog.ListItems.indexOf(item);
                linkManagementTargetBillboardLog.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            linkManagementTargetBillboardLog.ListItems.unshift(newItem);
    }

  

    linkManagementTargetBillboardLog.searchData = function () {
        linkManagementTargetBillboardLog.gridOptions.serachData();
    }
    linkManagementTargetBillboardLog.LinkManagementBillboardIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkManagementBillboardId',
        url: 'LinkManagementBillBoard',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: linkManagementTargetBillboardLog,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            ]
        }
    }
    linkManagementTargetBillboardLog.LinkManagementTargetIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkManagementTargetId',
        url: 'LinkManagementTarget',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: linkManagementTargetBillboardLog,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            ]
        }
    }


    linkManagementTargetBillboardLog.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'DeviceId', displayName: 'کد دستگاه', sortable: true, type: "string" },
            { name: 'IpAddress', displayName: 'آدرس Ip', sortable: true, type: "string" },
            { name: 'BrowserName', displayName: 'نام مرورگر', sortable: true, type: 'string', visible: true },
            { name: 'VisitDate', displayName: 'تاریخ بازدید', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: "ActionKey", displayName: 'مشاهده', displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="linkManagementTargetBillboardLog.openEditModal(x.Id)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-eye" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "Id",
                SortType: 0,
                NeedToRunFakePagination: false,
                TotalRowData: 2000,
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }
    linkManagementTargetBillboardLog.gridOptions.advancedSearchData.engine.Filters = null;
    linkManagementTargetBillboardLog.gridOptions.advancedSearchData.engine.Filters = [];
 

    linkManagementTargetBillboardLog.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            linkManagementTargetBillboardLog.focusExpireLockAccount = true;
        });
    };

    linkManagementTargetBillboardLog.gridOptions.reGetAll = function () {
        linkManagementTargetBillboardLog.init();
    }

    linkManagementTargetBillboardLog.columnCheckbox = false;
    linkManagementTargetBillboardLog.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (linkManagementTargetBillboardLog.gridOptions.columnCheckbox) {
            for (var i = 0; i < linkManagementTargetBillboardLog.gridOptions.columns.length; i++) {
                //linkManagementTargetBillboardLog.gridOptions.columns[i].visible = $("#" + linkManagementTargetBillboardLog.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + linkManagementTargetBillboardLog.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                linkManagementTargetBillboardLog.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = linkManagementTargetBillboardLog.gridOptions.columns;
            for (var i = 0; i < linkManagementTargetBillboardLog.gridOptions.columns.length; i++) {
                linkManagementTargetBillboardLog.gridOptions.columns[i].visible = true;
                var element = $("#" + linkManagementTargetBillboardLog.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + linkManagementTargetBillboardLog.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < linkManagementTargetBillboardLog.gridOptions.columns.length; i++) {
            console.log(linkManagementTargetBillboardLog.gridOptions.columns[i].name.concat(".visible: "), linkManagementTargetBillboardLog.gridOptions.columns[i].visible);
        }
        linkManagementTargetBillboardLog.gridOptions.columnCheckbox = !linkManagementTargetBillboardLog.gridOptions.columnCheckbox;
    }
    //Export Report 
    linkManagementTargetBillboardLog.exportFile = function () {
        linkManagementTargetBillboardLog.addRequested = true;
        linkManagementTargetBillboardLog.gridOptions.advancedSearchData.engine.ExportFile = linkManagementTargetBillboardLog.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementTargetBillboardLog/exportfile', linkManagementTargetBillboardLog.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            linkManagementTargetBillboardLog.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                linkManagementTargetBillboardLog.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //linkManagementTargetBillboardLog.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    linkManagementTargetBillboardLog.toggleExportForm = function () {
        linkManagementTargetBillboardLog.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        linkManagementTargetBillboardLog.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        linkManagementTargetBillboardLog.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        linkManagementTargetBillboardLog.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        linkManagementTargetBillboardLog.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleLinkManagement/linkManagementTargetBillboardLog/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    linkManagementTargetBillboardLog.rowCountChanged = function () {
        if (!angular.isDefined(linkManagementTargetBillboardLog.ExportFileClass.RowCount) || linkManagementTargetBillboardLog.ExportFileClass.RowCount > 5000)
            linkManagementTargetBillboardLog.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    linkManagementTargetBillboardLog.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"linkManagementTargetBillboardLog/count", linkManagementTargetBillboardLog.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            linkManagementTargetBillboardLog.addRequested = false;
            rashaErManage.checkAction(response);
            linkManagementTargetBillboardLog.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            linkManagementTargetBillboardLog.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);