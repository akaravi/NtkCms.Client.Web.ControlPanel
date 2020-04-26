app.controller("bankPaymentTranscLogController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var trancsLog = this;
    trancsLog.ManageUserAccessControllerTypes = [];

    trancsLog.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) trancsLog.itemRecordStatus = itemRecordStatus;
    trancsLog.init = function () {
        trancsLog.busyIndicator.isActive = true;
        trancsLog.gridOptions.advancedSearchData.engine.RowPerPage = 20;
        ajax.call(cmsServerConfig.configApiServerPath+"bankpaymenttransactionlog/getall", trancsLog.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            trancsLog.ListItems = response.ListItems;
            trancsLog.gridOptions.fillData(trancsLog.ListItems, response.resultAccess);
            trancsLog.gridOptions.currentPageNumber = response.CurrentPageNumber;
            trancsLog.gridOptions.totalRowCount = response.TotalRowCount;
            trancsLog.gridOptions.rowPerPage = response.RowPerPage;
            trancsLog.gridOptions.maxSize = 5;
            var model = {};
            model.SortType = 0;
            model.SortColumn = "Id";
            trancsLog.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            trancsLog.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    trancsLog.addRequested = false;
    trancsLog.openAddModal = function () {
        if (buttonIsPressed) { return };
        trancsLog.modalTitle = 'اضافه';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'bankpaymenttransactionlog/GetViewModel', '', 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            trancsLog.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleBankPayment/BankPaymentTransactionLog/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    trancsLog.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        trancsLog.addRequested = true;
        trancsLog.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'transactionlog/add', trancsLog.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                trancsLog.ListItems.unshift(response.Item);
                trancsLog.gridOptions.fillData(trancsLog.ListItems);
                trancsLog.addRequested = false;
                trancsLog.busyIndicator.isActive = false;
                trancsLog.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            trancsLog.addRequested = false;
            trancsLog.busyIndicator.isActive = false;
        });
    }

    trancsLog.openEditModal = function () {
        if (buttonIsPressed) { return };
        trancsLog.modalTitle = 'ویرایش';
        if (!trancsLog.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'bankpaymenttransactionlog/GetOne', trancsLog.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            trancsLog.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleBankPayment/BankPaymentTransactionLog/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    trancsLog.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        trancsLog.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'bankpaymenttransactionlog/edit', trancsLog.selectedItem, 'PUT').success(function (response1) {
            trancsLog.addRequested = true;
            rashaErManage.checkAction(response1);
            if (response1.IsSuccess) {
                trancsLog.replaceItem(trancsLog.selectedItem.Id, response1.Item);
                trancsLog.busyIndicator.isActive = false;
                trancsLog.gridOptions.fillData(trancsLog.ListItems, response.resultAccess);
                trancsLog.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            trancsLog.addRequested = false;
            trancsLog.busyIndicator.isActive = false;
        });
    }

    trancsLog.closeModal = function () {
        $modalStack.dismissAll();
    };

    trancsLog.replaceItem = function (oldId, newItem) {
        angular.forEach(trancsLog.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = trancsLog.ListItems.indexOf(item);
                trancsLog.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            trancsLog.ListItems.unshift(newItem);
    }

    trancsLog.deleteRow = function () {
        if (buttonIsPressed) { return };
        if (!trancsLog.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'bankpaymenttransactionlog/GetOne', trancsLog.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    trancsLog.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'bankpaymenttransactionlog/delete', trancsLog.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            trancsLog.replaceItem(trancsLog.selectedItemForDelete.Id);
                            trancsLog.gridOptions.fillData(trancsLog.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });
    }

    trancsLog.searchData = function () {
        trancsLog.gridOptions.serachData();
    }

    trancsLog.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkTransactionId', displayName: 'کد سیستمی تراکنش', sortable: true, type: 'integer' },
            { name: 'CreatedDate', displayName: 'تاریخ ایجاد', sortable: true, isDateTime: true, type: 'date' },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {
                engine: {
                    CurrentPageNumber: 1,
                    SortColumn: "Id",
                    SortType: 0,
                    NeedToRunFakePagination: false,
                    TotalRowData: 2000,
                    RowPerPage: 20,
                    ContentFullSearch: null,
                    Filters: [],
                    Count: false
                }
            }
        }
    }

    trancsLog.gridOptions.reGetAll = function () {
        trancsLog.init();
    }

    trancsLog.gridOptions.onRowSelected = function () { }

    //Export Report 
    trancsLog.exportFile = function () {
        trancsLog.addRequested = true;
        trancsLog.gridOptions.advancedSearchData.engine.ExportFile = trancsLog.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'bankpaymenttransactionlog/exportfile', trancsLog.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            trancsLog.addRequested = false;
            rashaErManage.checkAction(response);
            trancsLog.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //trancsLog.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    trancsLog.toggleExportForm = function () {
        trancsLog.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        trancsLog.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        trancsLog.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        trancsLog.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleBankPayment/BankPaymentTransactionLog/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    trancsLog.rowCountChanged = function () {
        if (!angular.isDefined(trancsLog.ExportFileClass.RowCount) || trancsLog.ExportFileClass.RowCount > 5000)
            trancsLog.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    trancsLog.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"bankpaymenttransactionlog/count", trancsLog.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            trancsLog.addRequested = false;
            rashaErManage.checkAction(response);
            trancsLog.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            trancsLog.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);