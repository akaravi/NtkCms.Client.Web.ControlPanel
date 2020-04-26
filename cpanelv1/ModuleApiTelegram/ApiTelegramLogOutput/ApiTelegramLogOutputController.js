app.controller("logOutputGridController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var logOutputCtrl = this;
    logOutputCtrl.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    logOutputCtrl.UninversalMenus = [];

    logOutputCtrl.init = function () {
        logOutputCtrl.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = logOutputCtrl.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }

        ajax.call(cmsServerConfig.configApiServerPath+"ApiTelegramLogOutput/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            logOutputCtrl.busyIndicator.isActive = false;
            logOutputCtrl.ListItems = response.ListItems;
            logOutputCtrl.gridOptions.fillData(logOutputCtrl.ListItems, response.resultAccess);
            logOutputCtrl.gridOptions.currentPageNumber = response.CurrentPageNumber;
            logOutputCtrl.gridOptions.totalRowCount = response.TotalRowCount;
            logOutputCtrl.gridOptions.rowPerPage = response.RowPerPage;
            logOutputCtrl.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            logOutputCtrl.busyIndicator.isActive = false;
            logOutputCtrl.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    logOutputCtrl.busyIndicator.isActive = true;
    logOutputCtrl.addRequested = false;
    logOutputCtrl.openAddModal = function () {
        logOutputCtrl.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramLogOutput/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            logOutputCtrl.busyIndicator.isActive = false;
            logOutputCtrl.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegramLogOutput/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    logOutputCtrl.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        logOutputCtrl.busyIndicator.isActive = true;
        logOutputCtrl.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramLogOutput/add', logOutputCtrl.selectedItem, 'POST').success(function (response) {
            logOutputCtrl.addRequested = false;
            logOutputCtrl.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                logOutputCtrl.ListItems.unshift(response.Item);
                logOutputCtrl.gridOptions.fillData(logOutputCtrl.ListItems);
                logOutputCtrl.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            logOutputCtrl.busyIndicator.isActive = false;
            logOutputCtrl.addRequested = false;
        });
    }

    logOutputCtrl.openEditModal = function () {

        logOutputCtrl.modalTitle = 'ویرایش';
        if (!logOutputCtrl.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramLogInput/GetOne', logOutputCtrl.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            logOutputCtrl.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegramLogOutput/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    logOutputCtrl.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        logOutputCtrl.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramLogOutput/edit', logOutputCtrl.selectedItem, 'PUT').success(function (response) {
            logOutputCtrl.addRequested = true;
            rashaErManage.checkAction(response);
            logOutputCtrl.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                logOutputCtrl.addRequested = false;
                logOutputCtrl.replaceItem(logOutputCtrl.selectedItem.Id, response.Item);
                logOutputCtrl.gridOptions.fillData(logOutputCtrl.ListItems);
                logOutputCtrl.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            logOutputCtrl.addRequested = false;
        });
    }

    logOutputCtrl.closeModal = function () {
        $modalStack.dismissAll();
    };

    logOutputCtrl.replaceItem = function (oldId, newItem) {
        angular.forEach(logOutputCtrl.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = logOutputCtrl.ListItems.indexOf(item);
                logOutputCtrl.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            logOutputCtrl.ListItems.unshift(newItem);
    }

    logOutputCtrl.deleteRow = function () {
        if (!logOutputCtrl.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                logOutputCtrl.busyIndicator.isActive = true;
                console.log(logOutputCtrl.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramLogOutput/GetOne', logOutputCtrl.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    logOutputCtrl.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramLogOutput/delete', logOutputCtrl.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        logOutputCtrl.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            logOutputCtrl.replaceItem(logOutputCtrl.selectedItemForDelete.Id);
                            logOutputCtrl.gridOptions.fillData(logOutputCtrl.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        logOutputCtrl.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    logOutputCtrl.busyIndicator.isActive = false;

                });
            }
        });
    }

    logOutputCtrl.searchData = function () {
        logOutputCtrl.gridOptions.searchData();

    }

    logOutputCtrl.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'ChatId', displayName: 'کد چت گیرنده', sortable: true, type: 'integer', visible: true },
            { name: 'LinkLogInput', displayName: 'کد سیستمی ورودی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkUniversalMenuId', displayName: 'کد سیستمی Menu', sortable: true, type: 'integer', visible: true },
            { name: 'LinkUniversalProcessId', displayName: 'کد سیستمی Process', sortable: true, type: 'integer', visible: true },
            { name: 'LinkLogInput', displayName: 'کد سیستمی ورودی', sortable: true, type: 'integer', visible: true },
            { name: 'ContentMessage', displayName: 'محتوای خروجی', sortable: true, type: 'string', visible: true },
            { name: 'CreatedDate', displayName: 'تاریخ ارسال پیام ', sortable: true, type: 'data', isDateTime: true, visible: true },
            { name: 'LinkBotConfigId', displayName: 'کد سیستمی ربات', sortable: true, type: 'string', visible: true }
        ],
        data: {},
        multiSelect: false,
        startDate: moment().format(),
        advancedSearchData: {
            engine: {}
        }
    }

    logOutputCtrl.gridOptions.advancedSearchData = {};
    logOutputCtrl.gridOptions.advancedSearchData.engine = {};
    logOutputCtrl.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    logOutputCtrl.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    logOutputCtrl.gridOptions.advancedSearchData.engine.SortType = 0;
    logOutputCtrl.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    logOutputCtrl.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    logOutputCtrl.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    logOutputCtrl.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    logOutputCtrl.gridOptions.advancedSearchData.engine.Filters = [];

    logOutputCtrl.test = 'false';

    logOutputCtrl.gridOptions.reGetAll = function () {
        logOutputCtrl.init();
    }

    logOutputCtrl.gridOptions.onRowSelected = function () { }

    logOutputCtrl.columnCheckbox = false;
    logOutputCtrl.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (logOutputCtrl.gridOptions.columnCheckbox) {
            for (var i = 0; i < logOutputCtrl.gridOptions.columns.length; i++) {
                //logOutputCtrl.gridOptions.columns[i].visible = $("#" + logOutputCtrl.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + logOutputCtrl.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                logOutputCtrl.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = logOutputCtrl.gridOptions.columns;
            for (var i = 0; i < logOutputCtrl.gridOptions.columns.length; i++) {
                logOutputCtrl.gridOptions.columns[i].visible = true;
                var element = $("#" + logOutputCtrl.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + logOutputCtrl.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < logOutputCtrl.gridOptions.columns.length; i++) {
            console.log(logOutputCtrl.gridOptions.columns[i].name.concat(".visible: "), logOutputCtrl.gridOptions.columns[i].visible);
        }
        logOutputCtrl.gridOptions.columnCheckbox = !logOutputCtrl.gridOptions.columnCheckbox;
    }
    //Export Report 
    logOutputCtrl.exportFile = function () {
        logOutputCtrl.gridOptions.advancedSearchData.engine.ExportFile = logOutputCtrl.ExportFileClass;
        logOutputCtrl.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramLogOutput/exportfile', logOutputCtrl.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            logOutputCtrl.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                logOutputCtrl.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //logOutputCtrl.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    logOutputCtrl.toggleExportForm = function () {
        logOutputCtrl.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        logOutputCtrl.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        logOutputCtrl.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        logOutputCtrl.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        logOutputCtrl.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegramLogOutput/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    logOutputCtrl.rowCountChanged = function () {
        if (!angular.isDefined(logOutputCtrl.ExportFileClass.RowCount) || logOutputCtrl.ExportFileClass.RowCount > 5000)
            logOutputCtrl.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    logOutputCtrl.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ApiTelegramLogOutput/count", logOutputCtrl.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            logOutputCtrl.addRequested = false;
            rashaErManage.checkAction(response);
            logOutputCtrl.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            logOutputCtrl.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);

