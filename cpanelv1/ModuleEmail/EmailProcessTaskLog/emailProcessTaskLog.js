app.controller("emailProcessTaskLogCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var emailProcessTaskLog = this;
    emailProcessTaskLog.ManageUserAccessControllerTypes = [];

    emailProcessTaskLog.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) emailProcessTaskLog.itemRecordStatus = itemRecordStatus;
    emailProcessTaskLog.init = function () {
        emailProcessTaskLog.busyIndicator.isActive = true;
        emailProcessTaskLog.gridOptions.advancedSearchData.engine.RowPerPage = 20;
        ajax.call(cmsServerConfig.configApiServerPath+"bankpaymenttransactionlog/getall", emailProcessTaskLog.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            emailProcessTaskLog.ListItems = response.ListItems;
            emailProcessTaskLog.gridOptions.fillData(emailProcessTaskLog.ListItems, response.resultAccess);
            emailProcessTaskLog.gridOptions.currentPageNumber = response.CurrentPageNumber;
            emailProcessTaskLog.gridOptions.totalRowCount = response.TotalRowCount;
            emailProcessTaskLog.gridOptions.rowPerPage = response.RowPerPage;
            emailProcessTaskLog.gridOptions.maxSize = 5;
            var model = {};
            model.SortType = 0;
            model.SortColumn = "Id";
            emailProcessTaskLog.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            emailProcessTaskLog.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    emailProcessTaskLog.addRequested = false;
    emailProcessTaskLog.openAddModal = function () {
        if (buttonIsPressed) { return };
        emailProcessTaskLog.modalTitle = 'اضافه';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'bankpaymenttransactionlog/GetViewModel', '', 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            emailProcessTaskLog.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleBankPayment/BankPaymentTransactionLog/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    emailProcessTaskLog.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        emailProcessTaskLog.addRequested = true;
        emailProcessTaskLog.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'transactionlog/add', emailProcessTaskLog.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                emailProcessTaskLog.ListItems.unshift(response.Item);
                emailProcessTaskLog.gridOptions.fillData(emailProcessTaskLog.ListItems);
                emailProcessTaskLog.addRequested = false;
                emailProcessTaskLog.busyIndicator.isActive = false;
                emailProcessTaskLog.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            emailProcessTaskLog.addRequested = false;
            emailProcessTaskLog.busyIndicator.isActive = false;
        });
    }

    emailProcessTaskLog.openEditModal = function () {
        if (buttonIsPressed) { return };
        emailProcessTaskLog.modalTitle = 'ویرایش';
        if (!emailProcessTaskLog.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'bankpaymenttransactionlog/GetOne', emailProcessTaskLog.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            emailProcessTaskLog.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleBankPayment/BankPaymentTransactionLog/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    emailProcessTaskLog.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        emailProcessTaskLog.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'bankpaymenttransactionlog/edit', emailProcessTaskLog.selectedItem, 'PUT').success(function (response1) {
            emailProcessTaskLog.addRequested = true;
            rashaErManage.checkAction(response1);
            if (response1.IsSuccess) {
                emailProcessTaskLog.replaceItem(emailProcessTaskLog.selectedItem.Id, response1.Item);
                emailProcessTaskLog.busyIndicator.isActive = false;
                emailProcessTaskLog.gridOptions.fillData(emailProcessTaskLog.ListItems, response.resultAccess);
                emailProcessTaskLog.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            emailProcessTaskLog.addRequested = false;
            emailProcessTaskLog.busyIndicator.isActive = false;
        });
    }

    emailProcessTaskLog.closeModal = function () {
        $modalStack.dismissAll();
    };

    emailProcessTaskLog.replaceItem = function (oldId, newItem) {
        angular.forEach(emailProcessTaskLog.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = emailProcessTaskLog.ListItems.indexOf(item);
                emailProcessTaskLog.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            emailProcessTaskLog.ListItems.unshift(newItem);
    }

    emailProcessTaskLog.deleteRow = function () {
        if (buttonIsPressed) { return };
        if (!emailProcessTaskLog.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'bankpaymenttransactionlog/GetOne', emailProcessTaskLog.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    emailProcessTaskLog.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'bankpaymenttransactionlog/delete', emailProcessTaskLog.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            emailProcessTaskLog.replaceItem(emailProcessTaskLog.selectedItemForDelete.Id);
                            emailProcessTaskLog.gridOptions.fillData(emailProcessTaskLog.ListItems);
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

    emailProcessTaskLog.searchData = function () {
        emailProcessTaskLog.gridOptions.serachData();
    }

    emailProcessTaskLog.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
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

    emailProcessTaskLog.gridOptions.reGetAll = function () {
        emailProcessTaskLog.init();
    }

    emailProcessTaskLog.gridOptions.onRowSelected = function () { }

    //Export Report 
    emailProcessTaskLog.exportFile = function () {
        emailProcessTaskLog.addRequested = true;
        emailProcessTaskLog.gridOptions.advancedSearchData.engine.ExportFile = emailProcessTaskLog.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'bankpaymenttransactionlog/exportfile', emailProcessTaskLog.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            emailProcessTaskLog.addRequested = false;
            rashaErManage.checkAction(response);
            emailProcessTaskLog.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //emailProcessTaskLog.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    emailProcessTaskLog.toggleExportForm = function () {
        emailProcessTaskLog.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        emailProcessTaskLog.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        emailProcessTaskLog.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        emailProcessTaskLog.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleBankPayment/BankPaymentTransactionLog/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    emailProcessTaskLog.rowCountChanged = function () {
        if (!angular.isDefined(emailProcessTaskLog.ExportFileClass.RowCount) || emailProcessTaskLog.ExportFileClass.RowCount > 5000)
            emailProcessTaskLog.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    emailProcessTaskLog.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"bankpaymenttransactionlog/count", emailProcessTaskLog.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            emailProcessTaskLog.addRequested = false;
            rashaErManage.checkAction(response);
            emailProcessTaskLog.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            emailProcessTaskLog.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);