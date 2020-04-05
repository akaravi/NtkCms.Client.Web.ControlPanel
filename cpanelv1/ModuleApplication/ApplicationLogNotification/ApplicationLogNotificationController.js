app.controller("logNotificationController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$builder', '$state', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $builder, $state, $window, $filter) {
    var logNotification = this;
    logNotification.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    logNotification.UninversalMenus = [];
    logNotification.selectUniversalMenuOnUndetectableKey = true;
    if (itemRecordStatus != undefined) logNotification.itemRecordStatus = itemRecordStatus;

    logNotification.init = function () {
        logNotification.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ApplicationlogNotification/getall", logNotification.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            logNotification.busyIndicator.isActive = false;
            logNotification.ListItems = response.ListItems;
            logNotification.gridOptions.fillData(logNotification.ListItems, response.resultAccess);
            logNotification.gridOptions.currentPageNumber = response.CurrentPageNumber;
            logNotification.gridOptions.totalRowCount = response.TotalRowCount;
            logNotification.gridOptions.rowPerPage = response.RowPerPage;
            logNotification.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            logNotification.busyIndicator.isActive = false;
            logNotification.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });

    }

    // Open Add Modal
    logNotification.busyIndicator.isActive = true;

    logNotification.addRequested = false;

    
    logNotification.closeModal = function () {
        $modalStack.dismissAll();
    };

   

    logNotification.searchData = function () {
        logNotification.gridOptions.searchData();

    }

    logNotification.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'LinkApplicatinoId', displayName: 'کد سیستمی اپ', sortable: true, type: 'integer', visible: true },
            { name: 'LinkMemberId', displayName: 'کد سیستمی عضو', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            { name: 'Body', displayName: 'متن', sortable: true, type: 'string', visible: true },
        ],
        data: {},
        multiSelect: false,
        startDate: moment().format(),
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

    logNotification.gridOptions.reGetAll = function () {
        logNotification.init();
    }

    logNotification.gridOptions.onRowSelected = function () {

    }

    logNotification.columnCheckbox = false;

    logNotification.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (logNotification.gridOptions.columnCheckbox) {
            for (var i = 0; i < logNotification.gridOptions.columns.length; i++) {
                //logNotification.gridOptions.columns[i].visible = $("#" + logNotification.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + logNotification.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                logNotification.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = logNotification.gridOptions.columns;
            for (var i = 0; i < logNotification.gridOptions.columns.length; i++) {
                logNotification.gridOptions.columns[i].visible = true;
                var element = $("#" + logNotification.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + logNotification.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < logNotification.gridOptions.columns.length; i++) {
            console.log(logNotification.gridOptions.columns[i].name.concat(".visible: "), logNotification.gridOptions.columns[i].visible);
        }
        logNotification.gridOptions.columnCheckbox = !logNotification.gridOptions.columnCheckbox;
    }

    logNotification.changeState = function (state, app) {
        $state.go("index." + state, { sourceid: app.LinkSourceId, appid: app.Id, apptitle: app.Title });
    }

    function parseJSONcomponent(str) {
        var defaultStr = '[{"id":0,"component":"text","editable":true,"index":0,"label":"متن ساده","description":"","placeholder":"","options":[],"required":false,"validation":"/.*/","logic":{"action":"Hide"}}]';
        if (str == undefined || str == null || str == "")
            str = defaultStr;
        try {
            JSON.parse(str);
        } catch (e) {
            str = defaultStr;
        }
        return $.parseJSON(str);
    }
    //Export Report 
    logNotification.exportFile = function () {
        logNotification.addRequested = true;
        logNotification.gridOptions.advancedSearchData.engine.ExportFile = logNotification.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'ApplicationlogNotification/exportfile', logNotification.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            logNotification.addRequested = false;
            rashaErManage.checkAction(response);
            logNotification.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //logNotification.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    logNotification.toggleExportForm = function () {
        logNotification.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        logNotification.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        logNotification.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        logNotification.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleApplication/ApplicationlogNotification/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    logNotification.rowCountChanged = function () {
        if (!angular.isDefined(logNotification.ExportFileClass.RowCount) || logNotification.ExportFileClass.RowCount > 5000)
            logNotification.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    logNotification.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ApplicationlogNotification/count", logNotification.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            logNotification.addRequested = false;
            rashaErManage.checkAction(response);
            logNotification.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            logNotification.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);

