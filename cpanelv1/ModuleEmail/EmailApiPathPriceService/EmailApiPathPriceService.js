app.controller("emailapipathpriceserviceCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$state', '$stateParams', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $state, $stateParams, $filter) {
    var emailapipathpriceservice = this;
    emailapipathpriceservice.ManageUserAccessControllerTypes = [];


    emailapipathpriceservice.selectedPrivateSiteConfig = {
        Id: $stateParams.PrivateSiteConfigId
    };
    emailapipathpriceservice.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) emailapipathpriceservice.itemRecordStatus = itemRecordStatus;
    emailapipathpriceservice.init = function () {
        if (emailapipathpriceservice.selectedPrivateSiteConfig.Id == 0 || emailapipathpriceservice.selectedPrivateSiteConfig.Id == null) {
            $state.go("index.emailprivatesiteconfig");
            return;
        }
        if (emailapipathpriceservice.selectedPrivateSiteConfig.Id == null || emailapipathpriceservice.selectedPrivateSiteConfig.Id == 0) emailapipathpriceservice.selectedPriceService.Id = '0';
        ajax.call(cmsServerConfig.configApiServerPath+'emailprivatesiteconfig/GetOne', emailapipathpriceservice.selectedPrivateSiteConfig.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            emailapipathpriceservice.selectedPrivateSiteConfig = response.Item;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
        emailapipathpriceservice.busyIndicator.isActive = true;
        var filterModel = { PropertyName: "LinkPrivateSiteConfigId", SearchType: 0, IntValue1: emailapipathpriceservice.selectedPrivateSiteConfig.Id };
        if (emailapipathpriceservice.selectedPrivateSiteConfig.Id >0)
            emailapipathpriceservice.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
        ajax.call(cmsServerConfig.configApiServerPath+"emailapipathpriceservice/getall", emailapipathpriceservice.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            emailapipathpriceservice.ListItems = response.ListItems;
            emailapipathpriceservice.gridOptions.fillData(emailapipathpriceservice.ListItems, response.resultAccess);
            emailapipathpriceservice.gridOptions.currentPageNumber = response.CurrentPageNumber;
            emailapipathpriceservice.gridOptions.totalRowCount = response.TotalRowCount;
            emailapipathpriceservice.gridOptions.rowPerPage = response.RowPerPage;
            emailapipathpriceservice.gridOptions.maxSize = 5;
            var model = {};
            model.SortType = 0;
            model.SortColumn = "Id";
            emailapipathpriceservice.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            emailapipathpriceservice.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    emailapipathpriceservice.addRequested = false;
    emailapipathpriceservice.openAddModal = function () {
        if (buttonIsPressed) { return };
        emailapipathpriceservice.modalTitle = 'اضافه';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'emailapipathpriceservice/GetViewModel', '', 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            emailapipathpriceservice.selectedItem = response.Item;
            emailapipathpriceservice.selectedItem.LinkPrivateSiteConfigId = emailapipathpriceservice.selectedPrivateSiteConfig.Id;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleEmail/emailapipathpriceservice/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    emailapipathpriceservice.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
       
        emailapipathpriceservice.addRequested = true;
        emailapipathpriceservice.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'emailapipathpriceservice/add', emailapipathpriceservice.selectedItem, 'POST').success(function (response1) {
            rashaErManage.checkAction(response1);
           if (response1.IsSuccess) {
                emailapipathpriceservice.ListItems.unshift(response1.Item);
                emailapipathpriceservice.gridOptions.fillData(emailapipathpriceservice.ListItems);
                emailapipathpriceservice.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            emailapipathpriceservice.addRequested = false;
            emailapipathpriceservice.busyIndicator.isActive = false;
        });
    }

    emailapipathpriceservice.openEditModal = function () {
        if (buttonIsPressed) { return };
        emailapipathpriceservice.modalTitle = 'ویرایش';
        if (!emailapipathpriceservice.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'emailapipathpriceservice/GetOne', emailapipathpriceservice.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            emailapipathpriceservice.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleEmail/emailapipathpriceservice/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    emailapipathpriceservice.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
       
        emailapipathpriceservice.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'emailapipathpriceservice/edit', emailapipathpriceservice.selectedItem, 'PUT').success(function (response) {
            emailapipathpriceservice.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                emailapipathpriceservice.replaceItem(emailapipathpriceservice.selectedItem.Id, response.Item);
                emailapipathpriceservice.busyIndicator.isActive = false;
                emailapipathpriceservice.gridOptions.fillData(emailapipathpriceservice.ListItems, response.resultAccess);
                emailapipathpriceservice.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            emailapipathpriceservice.addRequested = false;
            emailapipathpriceservice.busyIndicator.isActive = false;
        });
    }

    emailapipathpriceservice.closeModal = function () {
        $modalStack.dismissAll();
    };
    emailapipathpriceservice.replaceItem = function (oldId, newItem) {
        angular.forEach(emailapipathpriceservice.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = emailapipathpriceservice.ListItems.indexOf(item);
                emailapipathpriceservice.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            emailapipathpriceservice.ListItems.unshift(newItem);
    }
    emailapipathpriceservice.deleteRow = function () {
        if (buttonIsPressed) { return };
        if (!emailapipathpriceservice.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'emailapipathpriceservice/GetOne', emailapipathpriceservice.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;

                    rashaErManage.checkAction(response);
                    emailapipathpriceservice.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'emailapipathpriceservice/delete', emailapipathpriceservice.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            emailapipathpriceservice.replaceItem(emailapipathpriceservice.selectedItemForDelete.Id);
                            emailapipathpriceservice.gridOptions.fillData(emailapipathpriceservice.ListItems);
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
    emailapipathpriceservice.searchData = function () {
        emailapipathpriceservice.gridOptions.serachData();
    }
    emailapipathpriceservice.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'LinkPrivateSiteConfigId', displayName: 'کد سیستمی تنظیمات خصوصی', sortable: true, type: 'integer' },
            { name: 'RegulatorNumber', displayName: 'الگوی نشخیص شماره', sortable: true, type: 'integer' },
            { name: 'ServiceUnicodeMessagePrice', displayName: 'قیمت خرید از سرویس دهنده متن یونیکد', sortable: true, type: 'integer' },
            { name: 'ServiceNormalMessagePrice', displayName: 'قیمت خرید از سرویس دهنده متن غیر یونیکد', sortable: true, type: 'integer' },
            { name: 'UserUnicodeMessagePrice', displayName: 'قیمت فروش به کاربر متن یونیکد', sortable: true, type: 'integer' },
            { name: 'UserNormalMessagePrice', displayName: 'قیمت فروش به کاربر متن غیر یونیکد', sortable: true, type: 'integer' },

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

    emailapipathpriceservice.gridLogs = {
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

    emailapipathpriceservice.gridOptions.reGetAll = function () {
        emailapipathpriceservice.init();
    }

    emailapipathpriceservice.gridOptions.onRowSelected = function () {
        var item = emailapipathpriceservice.gridOptions.selectedRow.item;
        //Get Options
        $("#gridLogs").fadeOut('fast');
        var filterModel = { Filters: [] };
        filterModel.Filters.push({ PropertyName: "LinkProcessFlowId", IntValue1: item.Id, SearchType: 0 });
        emailapipathpriceservice.addRequested = true;
        //emailapipathpriceservice.optionsBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"emailprocesstaskLog/getall", filterModel, "POST").success(function (response) {
            emailapipathpriceservice.addRequested = false;
            //emailapipathpriceservice.optionsBusyIndicator.isActice = false;
            rashaErManage.checkAction(response);
            emailapipathpriceservice.OptionList = response.ListItems;
            emailapipathpriceservice.processFlowLogList = response.ListItems;
            emailapipathpriceservice.gridLogs.fillData(emailapipathpriceservice.processFlowLogList, response.resultAccess);
            emailapipathpriceservice.gridLogs.currentPageNumber = response.CurrentPageNumber;
            emailapipathpriceservice.gridLogs.totalRowCount = response.TotalRowCount;
            emailapipathpriceservice.gridLogs.RowPerPage = response.RowPerPage;
            if (emailapipathpriceservice.processFlowLogList.length > 0)
                $("#gridLogs").fadeIn('fast');
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    emailapipathpriceservice.columnCheckbox = false;
    emailapipathpriceservice.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (emailapipathpriceservice.gridOptions.columnCheckbox) {
            for (var i = 0; i < emailapipathpriceservice.gridOptions.columns.length; i++) {
                //emailapipathpriceservice.gridOptions.columns[i].visible = $("#" + emailapipathpriceservice.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + emailapipathpriceservice.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                emailapipathpriceservice.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = emailapipathpriceservice.gridOptions.columns;
            for (var i = 0; i < emailapipathpriceservice.gridOptions.columns.length; i++) {
                emailapipathpriceservice.gridOptions.columns[i].visible = true;
                var element = $("#" + emailapipathpriceservice.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + emailapipathpriceservice.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < emailapipathpriceservice.gridOptions.columns.length; i++) {
            console.log(emailapipathpriceservice.gridOptions.columns[i].name.concat(".visible: "), emailapipathpriceservice.gridOptions.columns[i].visible);
        }
        emailapipathpriceservice.gridOptions.columnCheckbox = !emailapipathpriceservice.gridOptions.columnCheckbox;
    }
    //Export Report 
    emailapipathpriceservice.exportFile = function () {
        emailapipathpriceservice.addRequested = true;
        emailapipathpriceservice.gridOptions.advancedSearchData.engine.ExportFile = emailapipathpriceservice.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'emailprivatesiteconfig/exportfile', emailapipathpriceservice.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            emailapipathpriceservice.addRequested = false;
            rashaErManage.checkAction(response);
            emailapipathpriceservice.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //emailapipathpriceservice.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    emailapipathpriceservice.toggleExportForm = function () {
        emailapipathpriceservice.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        emailapipathpriceservice.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        emailapipathpriceservice.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        emailapipathpriceservice.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleEmail/emailapipathpriceservice/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    emailapipathpriceservice.rowCountChanged = function () {
        if (!angular.isDefined(emailapipathpriceservice.ExportFileClass.RowCount) || emailapipathpriceservice.ExportFileClass.RowCount > 5000)
            emailapipathpriceservice.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    emailapipathpriceservice.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"emailapipathpriceservice/count", emailapipathpriceservice.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            emailapipathpriceservice.addRequested = false;
            rashaErManage.checkAction(response);
            emailapipathpriceservice.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            emailapipathpriceservice.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    emailapipathpriceservice.changeState = function (state) {
        $state.go("index." + state);
    }

    emailapipathpriceservice.retryTrans = function (selectedId) {
        ajax.call(cmsServerConfig.configApiServerPath+'emailapipathpriceservice/processflowCheck', selectedId, 'GET').success(function (response) {
            emailapipathpriceservice.addRequested = false;
            rashaErManage.checkAction(response);
            emailapipathpriceservice.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //emailapipathpriceservice.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);