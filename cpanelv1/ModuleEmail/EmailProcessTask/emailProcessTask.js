app.controller("emailProcessTaskCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$state', '$stateParams', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $state, $stateParams, $filter) {
    var emailProcessTask = this;
    emailProcessTask.ManageUserAccessControllerTypes = [];

    emailProcessTask.selectedPrivateSiteConfig = { Id: $stateParams.privateSiteConfigId };
//#help set default date
    var date = moment().format();
    emailProcessTask.datePickerConfig = {
        defaultDate: date
    };
    emailProcessTask.DateSendStart = {
        defaultDate: date
    }
    emailProcessTask.DateSendEnd = {
        defaultDate: date
    }
//#help
    emailProcessTask.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) emailProcessTask.itemRecordStatus = itemRecordStatus;
    emailProcessTask.init = function () {
        //if (emailProcessTask.selectedPrivateSiteConfig.Id == 0 || emailProcessTask.selectedPrivateSiteConfig.Id == null) {
        //    $state.go("index.emailprivatesiteconfig");
        //    return;
        //}
        if (emailProcessTask.selectedPrivateSiteConfig.Id == null || emailProcessTask.selectedPrivateSiteConfig.Id == 0) emailProcessTask.selectedPrivateSiteConfig.Id = '0';
        ajax.call(cmsServerConfig.configApiServerPath+'emailprivatesiteconfig/GetOne', emailProcessTask.selectedPrivateSiteConfig.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            emailProcessTask.selectedPrivateSiteConfig = response.Item;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
        emailProcessTask.busyIndicator.isActive = true;
        var filterModel = { PropertyName: "LinkPrivateSiteConfigId", SearchType: 0, IntValue1: emailProcessTask.selectedPrivateSiteConfig.Id };
        if (emailProcessTask.selectedPrivateSiteConfig.Id >0)
            emailProcessTask.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
        ajax.call(cmsServerConfig.configApiServerPath+"emailprocesstask/getall", emailProcessTask.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            emailProcessTask.ListItems = response.ListItems;
            emailProcessTask.gridOptions.fillData(emailProcessTask.ListItems, response.resultAccess);
            emailProcessTask.gridOptions.currentPageNumber = response.CurrentPageNumber;
            emailProcessTask.gridOptions.totalRowCount = response.TotalRowCount;
            emailProcessTask.gridOptions.rowPerPage = response.RowPerPage;
            emailProcessTask.gridOptions.maxSize = 5;
            var model = {};
            model.SortType = 0;
            model.SortColumn = "Id";
            emailProcessTask.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            emailProcessTask.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    emailProcessTask.addRequested = false;
    emailProcessTask.openAddModal = function () {
        if (buttonIsPressed) { return };
        emailProcessTask.modalTitle = 'اضافه';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'emailprocesstask/GetViewModel', '', 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            emailProcessTask.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleEmail/EmailProcessTask/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    emailProcessTask.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        
        emailProcessTask.addRequested = true;
        emailProcessTask.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'emailprocesstask/add', emailProcessTask.selectedItem, 'POST').success(function (response1) {
            rashaErManage.checkAction(response1);
            if (response1.IsSuccess) {

                        response1.Item.virtual_CmsUser = { Username: response3.Item.Username };
                        emailProcessTask.ListItems.unshift(response1.Item);
                        emailProcessTask.gridOptions.fillData(emailProcessTask.ListItems);
                        emailProcessTask.addRequested = false;
                        emailProcessTask.busyIndicator.isActive = false;
                        emailProcessTask.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            emailProcessTask.addRequested = false;
            emailProcessTask.busyIndicator.isActive = false;
        });
    }

    emailProcessTask.openEditModal = function () {
        if (buttonIsPressed) { return };
        emailProcessTask.modalTitle = 'ویرایش';
        emailProcessTask.addRequested = false;
        emailProcessTask.busyIndicator.isActive = false;
        if (!emailProcessTask.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'emailprocesstask/GetOne', emailProcessTask.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            emailProcessTask.selectedItem = response.Item;
            emailProcessTask.DateSendStart.defaultDate = emailProcessTask.selectedItem.DateSendStart;
            emailProcessTask.DateSendEnd.defaultDate = emailProcessTask.selectedItem.DateSendEnd;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleEmail/emailProcessTask/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    emailProcessTask.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
       
        emailProcessTask.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'emailprocesstask/edit', emailProcessTask.selectedItem, 'PUT').success(function (response) {
            emailProcessTask.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                emailProcessTask.replaceItem(emailProcessTask.selectedItem.Id, response.Item);
                emailProcessTask.busyIndicator.isActive = false;
                emailProcessTask.gridOptions.fillData(emailProcessTask.ListItems, response.resultAccess);
                emailProcessTask.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            emailProcessTask.addRequested = false;
            emailProcessTask.busyIndicator.isActive = false;
        });
    }

    emailProcessTask.closeModal = function () {
        $modalStack.dismissAll();
    };
    emailProcessTask.replaceItem = function (oldId, newItem) {
        angular.forEach(emailProcessTask.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = emailProcessTask.ListItems.indexOf(item);
                emailProcessTask.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            emailProcessTask.ListItems.unshift(newItem);
    }
    emailProcessTask.deleteRow = function () {
        if (buttonIsPressed) { return };
        if (!emailProcessTask.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'emailprocesstask/GetOne', emailProcessTask.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;

                    rashaErManage.checkAction(response);
                    emailProcessTask.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'emailprocesstask/delete', emailProcessTask.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            emailProcessTask.replaceItem(emailProcessTask.selectedItemForDelete.Id);
                            emailProcessTask.gridOptions.fillData(emailProcessTask.ListItems);
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
    emailProcessTask.searchData = function () {
        emailProcessTask.gridOptions.serachData();
    }
    emailProcessTask.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'DefaultSubject', displayName: 'موضوع پیش فرض', sortable: true, type: 'string' },
            { name: 'DefaultSender', displayName: 'ارسال کننده ی پیش فرض', sortable: true, type: 'string' },
            { name: 'DefaultSenderDisplayName', displayName: 'DefaultSenderDisplayName', sortable: true, type: 'string' }
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

    emailProcessTask.gridLogs = {
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

    emailProcessTask.gridOptions.reGetAll = function () {
        emailProcessTask.init();
    }

    emailProcessTask.gridOptions.onRowSelected = function () {
        var item = emailProcessTask.gridOptions.selectedRow.item;
        //Get Options
        $("#gridLogs").fadeOut('fast');
        var filterModel = { Filters: [] };
        filterModel.Filters.push({ PropertyName: "LinkProcessFlowId", IntValue1: item.Id, SearchType: 0 });
        emailProcessTask.addRequested = true;
        //emailProcessTask.optionsBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"emailprocesstaskLog/getall", filterModel, "POST").success(function (response) {
            emailProcessTask.addRequested = false;
            //emailProcessTask.optionsBusyIndicator.isActice = false;
            rashaErManage.checkAction(response);
            emailProcessTask.OptionList = response.ListItems;
            emailProcessTask.processFlowLogList = response.ListItems;
            emailProcessTask.gridLogs.fillData(emailProcessTask.processFlowLogList, response.resultAccess);
            emailProcessTask.gridLogs.currentPageNumber = response.CurrentPageNumber;
            emailProcessTask.gridLogs.totalRowCount = response.TotalRowCount;
            emailProcessTask.gridLogs.RowPerPage = response.RowPerPage;
            if (emailProcessTask.processFlowLogList.length > 0)
                $("#gridLogs").fadeIn('fast');
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    emailProcessTask.columnCheckbox = false;
    emailProcessTask.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (emailProcessTask.gridOptions.columnCheckbox) {
            for (var i = 0; i < emailProcessTask.gridOptions.columns.length; i++) {
                //emailProcessTask.gridOptions.columns[i].visible = $("#" + emailProcessTask.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + emailProcessTask.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                emailProcessTask.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = emailProcessTask.gridOptions.columns;
            for (var i = 0; i < emailProcessTask.gridOptions.columns.length; i++) {
                emailProcessTask.gridOptions.columns[i].visible = true;
                var element = $("#" + emailProcessTask.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + emailProcessTask.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < emailProcessTask.gridOptions.columns.length; i++) {
            console.log(emailProcessTask.gridOptions.columns[i].name.concat(".visible: "), emailProcessTask.gridOptions.columns[i].visible);
        }
        emailProcessTask.gridOptions.columnCheckbox = !emailProcessTask.gridOptions.columnCheckbox;
    }
    //Export Report 
    emailProcessTask.exportFile = function () {
        emailProcessTask.addRequested = true;
        emailProcessTask.gridOptions.advancedSearchData.engine.ExportFile = emailProcessTask.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'emailprivatesiteconfig/exportfile', emailProcessTask.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            emailProcessTask.addRequested = false;
            rashaErManage.checkAction(response);
            emailProcessTask.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //emailProcessTask.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    emailProcessTask.toggleExportForm = function () {
        emailProcessTask.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        emailProcessTask.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        emailProcessTask.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        emailProcessTask.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleEmail/EmailProcessTask/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    emailProcessTask.rowCountChanged = function () {
        if (!angular.isDefined(emailProcessTask.ExportFileClass.RowCount) || emailProcessTask.ExportFileClass.RowCount > 5000)
            emailProcessTask.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    emailProcessTask.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"emailprocesstask/count", emailProcessTask.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            emailProcessTask.addRequested = false;
            rashaErManage.checkAction(response);
            emailProcessTask.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            emailProcessTask.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //emailProcessTask.changeState = function (state) {
    //    $state.go("index." + state);
    //}

    emailProcessTask.retryTrans = function (selectedId) {
        ajax.call(cmsServerConfig.configApiServerPath+'emailprocesstask/processflowCheck', selectedId, 'GET').success(function (response) {
            emailProcessTask.addRequested = false;
            rashaErManage.checkAction(response);
            emailProcessTask.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //emailProcessTask.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);