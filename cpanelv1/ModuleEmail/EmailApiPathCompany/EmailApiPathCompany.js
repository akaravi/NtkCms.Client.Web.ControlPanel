app.controller("emailapipathcompanyCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$state', '$stateParams', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $state, $stateParams, $filter) {
    var emailapipathcompany = this;
    emailapipathcompany.ManageUserAccessControllerTypes = [];

    var date = moment().format();

    emailapipathcompany.datePickerConfig = {
        defaultDate: date
    };
    emailapipathcompany.ServiceCreditLastEdit = {
        defaultDate: date
    }
    emailapipathcompany.UserCreditLastEdit = {
        defaultDate: date
    }
    emailapipathcompany.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) emailapipathcompany.itemRecordStatus = itemRecordStatus;
    emailapipathcompany.init = function () {
       
        emailapipathcompany.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+"emailapipathcompany/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            emailapipathcompany.ListItems = response.ListItems;
            emailapipathcompany.gridOptions.fillData(emailapipathcompany.ListItems, response.resultAccess);
            emailapipathcompany.gridOptions.currentPageNumber = response.CurrentPageNumber;
            emailapipathcompany.gridOptions.totalRowCount = response.TotalRowCount;
            emailapipathcompany.gridOptions.rowPerPage = response.RowPerPage;
            emailapipathcompany.gridOptions.maxSize = 5;
            var model = {};
            model.SortType = 0;
            model.SortColumn = "Id";
            emailapipathcompany.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            emailapipathcompany.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    emailapipathcompany.addRequested = false;
    emailapipathcompany.openAddModal = function () {
        if (buttonIsPressed) { return };
        emailapipathcompany.modalTitle = 'اضافه';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'emailapipathcompany/GetViewModel', '', 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            emailapipathcompany.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleEmail/emailapipathcompany/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    emailapipathcompany.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        emailapipathcompany.addRequested = true;
        emailapipathcompany.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'emailapipathcompany/add', emailapipathcompany.selectedItem, 'POST').success(function (response1) {
            rashaErManage.checkAction(response1);
            if (response1.IsSuccess) {
                emailapipathcompany.ListItems.unshift(response1.Item);
                emailapipathcompany.gridOptions.fillData(emailapipathcompany.ListItems);
                emailapipathcompany.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            emailapipathcompany.addRequested = false;
            emailapipathcompany.busyIndicator.isActive = false;
        });
    }

    emailapipathcompany.openEditModal = function () {
        if (buttonIsPressed) { return };
        emailapipathcompany.modalTitle = 'ویرایش';
        if (!emailapipathcompany.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'emailapipathcompany/GetOne', emailapipathcompany.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            emailapipathcompany.selectedItem = response.Item;
            emailapipathcompany.ServiceCreditLastEdit.defaultDate = emailapipathcompany.selectedItem.ServiceCreditLastEdit;
            emailapipathcompany.UserCreditLastEdit.defaultDate = emailapipathcompany.selectedItem.UserCreditLastEdit;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleEmail/emailapipathcompany/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    emailapipathcompany.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        emailapipathcompany.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'emailapipathcompany/edit', emailapipathcompany.selectedItem, 'PUT').success(function (response) {
            emailapipathcompany.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                emailapipathcompany.replaceItem(emailapipathcompany.selectedItem.Id, response.Item);
                emailapipathcompany.busyIndicator.isActive = false;
                emailapipathcompany.gridOptions.fillData(emailapipathcompany.ListItems, response.resultAccess);
                emailapipathcompany.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            emailapipathcompany.addRequested = false;
            emailapipathcompany.busyIndicator.isActive = false;
        });
    }

    emailapipathcompany.closeModal = function () {
        $modalStack.dismissAll();
    };
    emailapipathcompany.replaceItem = function (oldId, newItem) {
        angular.forEach(emailapipathcompany.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = emailapipathcompany.ListItems.indexOf(item);
                emailapipathcompany.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            emailapipathcompany.ListItems.unshift(newItem);
    }
    emailapipathcompany.deleteRow = function () {
        if (buttonIsPressed) { return };
        if (!emailapipathcompany.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'emailapipathcompany/GetOne', emailapipathcompany.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;

                    rashaErManage.checkAction(response);
                    emailapipathcompany.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'emailapipathcompany/delete', emailapipathcompany.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            emailapipathcompany.replaceItem(emailapipathcompany.selectedItemForDelete.Id);
                            emailapipathcompany.gridOptions.fillData(emailapipathcompany.ListItems);
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
    emailapipathcompany.searchData = function () {
        emailapipathcompany.gridOptions.serachData();
    }
    emailapipathcompany.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'integer' },
            { name: 'ServiceAvailableCredit', displayName: 'ServiceAvailableCredit', sortable: true, type: 'integer' },
            { name: 'ServiceSumCredit', displayName: 'ServiceSumCredit', sortable: true, type: 'integer' },
            { name: 'UserAvailableCredit', displayName: 'UserAvailableCredit', sortable: true, type: 'integer' },
            { name: 'UserSumCredit', displayName: 'UserSumCredit', sortable: true, type: 'integer' },
            { name: 'ServiceCreditLastEdit', displayName: 'ServiceCreditLastEdit', sortable: true, type: 'date', isDateTime: true },
            { name: 'UserCreditLastEdit', displayName: 'UserCreditLastEdit', sortable: true, type: 'date', isDateTime: true },
            
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
                Filters: [],
                Count: false
            }
        }
    }
   
    emailapipathcompany.gridLogs = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkTransactionId', displayName: 'کد سیستمی تراکنش', sortable: true, type: 'integer' },
            { name: 'TransactionStatus', displayName: 'Transaction Status', sortable: true, type: 'integer' },
            { name: 'Memo', displayName: 'یادداشت', sortable: true, type: 'integer' }
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
                Filters: [],
                Count: false
            }
        }
    }

    emailapipathcompany.gridOptions.reGetAll = function () {
        emailapipathcompany.init();
    }

   
    emailapipathcompany.columnCheckbox = false;
    emailapipathcompany.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (emailapipathcompany.gridOptions.columnCheckbox) {
            for (var i = 0; i < emailapipathcompany.gridOptions.columns.length; i++) {
                //emailapipathcompany.gridOptions.columns[i].visible = $("#" + emailapipathcompany.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + emailapipathcompany.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                emailapipathcompany.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = emailapipathcompany.gridOptions.columns;
            for (var i = 0; i < emailapipathcompany.gridOptions.columns.length; i++) {
                emailapipathcompany.gridOptions.columns[i].visible = true;
                var element = $("#" + emailapipathcompany.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + emailapipathcompany.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < emailapipathcompany.gridOptions.columns.length; i++) {
            console.log(emailapipathcompany.gridOptions.columns[i].name.concat(".visible: "), emailapipathcompany.gridOptions.columns[i].visible);
        }
        emailapipathcompany.gridOptions.columnCheckbox = !emailapipathcompany.gridOptions.columnCheckbox;
    }
    //Export Report 
    emailapipathcompany.exportFile = function () {
        emailapipathcompany.addRequested = true;
        emailapipathcompany.gridOptions.advancedSearchData.engine.ExportFile = emailapipathcompany.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'emailprivatesiteconfig/exportfile', emailapipathcompany.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            emailapipathcompany.addRequested = false;
            rashaErManage.checkAction(response);
            emailapipathcompany.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //emailapipathcompany.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    emailapipathcompany.toggleExportForm = function () {
        emailapipathcompany.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        emailapipathcompany.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        emailapipathcompany.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        emailapipathcompany.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleEmail/emailapipathcompany/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    emailapipathcompany.rowCountChanged = function () {
        if (!angular.isDefined(emailapipathcompany.ExportFileClass.RowCount) || emailapipathcompany.ExportFileClass.RowCount > 5000)
            emailapipathcompany.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    emailapipathcompany.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"emailapipathcompany/count", emailapipathcompany.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            emailapipathcompany.addRequested = false;
            rashaErManage.checkAction(response);
            emailapipathcompany.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            emailapipathcompany.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    emailapipathcompany.changeState = function (state) {
        $state.go("index." + state);
    }

    emailapipathcompany.retryTrans = function (selectedId) {
        ajax.call(cmsServerConfig.configApiServerPath+'emailapipathcompany/processflowCheck', selectedId, 'GET').success(function (response) {
            emailapipathcompany.addRequested = false;
            rashaErManage.checkAction(response);
            emailapipathcompany.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //emailapipathcompany.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);