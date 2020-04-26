app.controller("bankPaymentTranscController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$state', '$stateParams', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $state, $stateParams, $filter) {
    var transc = this;
    transc.ManageUserAccessControllerTypes = [];

    transc.selectedPrivateSiteConfig = { Id: $stateParams.privateSiteConfigId };
    transc.selectedTransactionId = { Id: $stateParams.transactionId };
    transc.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) transc.itemRecordStatus = itemRecordStatus;
    transc.init = function () {
        //if (transc.selectedPrivateSiteConfig.Id == 0 || transc.selectedPrivateSiteConfig.Id == null) {
        //    $state.go("index.bankpaymentprivatesiteconfig");
        //    return;
        //}
        if (transc.selectedPrivateSiteConfig.Id == null || transc.selectedPrivateSiteConfig.Id == 0) transc.selectedPrivateSiteConfig.Id = '0';
        ajax.call(cmsServerConfig.configApiServerPath+'bankpaymentprivatesiteconfig/GetOne', transc.selectedPrivateSiteConfig.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            transc.selectedPrivateSiteConfig = response.Item;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
        transc.busyIndicator.isActive = true;
        var filterModel = { PropertyName: "LinkPrivateSiteConfigId", SearchType: 0, IntValue1: transc.selectedPrivateSiteConfig.Id };
        if (transc.selectedPrivateSiteConfig.Id >0)
            transc.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
        filterModel = { PropertyName: "Id", SearchType: 0, IntValue1: transc.selectedTransactionId.Id };
        if (transc.selectedTransactionId.Id >0)
            transc.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
        ajax.call(cmsServerConfig.configApiServerPath+"BankPaymentTransaction/getall", transc.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            transc.ListItems = response.ListItems;
            transc.gridOptions.fillData(transc.ListItems, response.resultAccess);
            transc.gridOptions.currentPageNumber = response.CurrentPageNumber;
            transc.gridOptions.totalRowCount = response.TotalRowCount;
            transc.gridOptions.rowPerPage = response.RowPerPage;
            transc.gridOptions.maxSize = 5;
            var model = {};
            model.SortType = 0;
            model.SortColumn = "Id";
            transc.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            transc.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    transc.addRequested = false;
    transc.openAddModal = function () {
        if (buttonIsPressed) { return };
        transc.modalTitle = 'اضافه';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'bankpaymenttransaction/GetViewModel', '', 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            transc.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleBankPayment/BankPaymentTransaction/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    transc.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (transc.selectedItem.LinkSiteId == null || transc.selectedItem.LinkUserId == null)
            return;
        //برای جلوگیر ی از وارد کردن اطلاعات تکراری
        for (var i = 0; i < transc.ListItems.length; i++) {
            if (transc.selectedItem.LinkSiteId == transc.ListItems[i].LinkSiteId &&
                transc.selectedItem.LinkUserId == transc.ListItems[i].LinkUserId &&
                transc.selectedItem.LinkUserGroupId == transc.ListItems[i].LinkUserGroupId) {
                rashaErManage.showMessage($filter('translatentk')('Information_Is_Duplicate'));
                return;
            }
        }
        transc.addRequested = true;
        transc.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'BankPaymentTransaction/add', transc.selectedItem, 'POST').success(function (response1) {
            rashaErManage.checkAction(response1);
            if (response1.IsSuccess) {
                ajax.call(cmsServerConfig.configApiServerPath+'CoreSite/GetOne', response1.Item.LinkSiteId, 'GET').success(function (response2) {
                    response1.Item.virtual_CmsSite = { Title: response2.Item.Title };
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/GetOne', response1.Item.LinkUserId, 'GET').success(function (response3) {
                        response1.Item.virtual_CmsUser = { Username: response3.Item.Username };
                        transc.ListItems.unshift(response1.Item);
                        transc.gridOptions.myfilterText(transc.ListItems, "LinkUserGroupId", transc.cmsUserGroups, "Title", "LinkUserGroupTitle");
                        transc.gridOptions.fillData(transc.ListItems);
                        transc.addRequested = false;
                        transc.busyIndicator.isActive = false;
                        transc.closeModal();
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            transc.addRequested = false;
            transc.busyIndicator.isActive = false;
        });
    }

    transc.openEditModal = function () {
        if (buttonIsPressed) { return };
        transc.modalTitle = 'ویرایش';
        if (!transc.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'BankPaymentTransaction/GetOne', transc.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            transc.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleBankPayment/transc/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    transc.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        //برای جلوگیر ی از وارد کردن اطلاعات تکراری
        for (var i = 0; i < transc.ListItems.length; i++) {
            if (transc.selectedItem.LinkSiteId == transc.ListItems[i].LinkSiteId &&
                transc.selectedItem.LinkUserId == transc.ListItems[i].LinkUserId &&
                transc.selectedItem.LinkUserGroupId == transc.ListItems[i].LinkUserGroupId) {
                if (transc.selectedItem.Id != transc.ListItems[i].Id) {
                    rashaErManage.showMessage($filter('translatentk')('Information_Is_Duplicate'));
                    return;
                }
            }
        }
        transc.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'BankPaymentTransaction/edit', transc.selectedItem, 'PUT').success(function (response) {
            transc.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                transc.replaceItem(transc.selectedItem.Id, response.Item);
                transc.busyIndicator.isActive = false;
                transc.gridOptions.fillData(transc.ListItems, response.resultAccess);
                transc.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            transc.addRequested = false;
            transc.busyIndicator.isActive = false;
        });
    }

    transc.closeModal = function () {
        $modalStack.dismissAll();
    };
    transc.replaceItem = function (oldId, newItem) {
        angular.forEach(transc.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = transc.ListItems.indexOf(item);
                transc.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            transc.ListItems.unshift(newItem);
    }
    transc.deleteRow = function () {
        if (buttonIsPressed) { return };
        if (!transc.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'BankPaymentTransaction/GetOne', transc.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;

                    rashaErManage.checkAction(response);
                    transc.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'BankPaymentTransaction/delete', transc.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            transc.replaceItem(transc.selectedItemForDelete.Id);
                            transc.gridOptions.fillData(transc.ListItems);
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
    transc.searchData = function () {
        transc.gridOptions.serachData();
    }
    transc.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'LinkPrivateSiteConfigId', displayName: 'کد سیستمی تنظیمات خصوصی', sortable: true, type: 'integer' },
            { name: 'Amount', displayName: 'مبلغ', sortable: true, type: 'integer' },
            { name: 'SuccessStatusMessage', displayName: 'پیام موفقیت', sortable: true, type: 'date' },
            { name: 'LastStatusMessage', displayName: 'آخرین پیام', sortable: true, type: 'date' },
            { name: 'BankStatus', displayName: 'BankStatus', sortable: true, type: 'date' },
            { name: 'OnlineDateLock', displayName: 'زمان قفل', sortable: true, type: 'date', isDateTime: true },
            { name: 'OnlineDateUnlock', displayName: 'زمان بازشدن قفل', sortable: true, type: 'date', isDateTime: true },
            { name: 'TransactionStatus', displayName: 'Status', sortable: true, type: 'integer'},
            { name: 'ActionKey', displayName: 'Stamp', sortable: true, template: '<button class="btn btn-info" title="{{x.StampJsonValues}}"><i class="fa fa-info" aria-hidden="true"></i></button>' },
            { name: 'ActionKey', displayName: 'Request Back User',sortable: true, template: '<button class="btn btn-info" title="{{x.RequestBackUserFromBankJsonValues}}"><i class="fa fa-info" aria-hidden="true"></i></button>' },
            { name: 'Retry', displayName: 'بررسی مجدّد', sortable: true, type: 'date', isDateTime: true, displayForce: true, template: '<button class="btn btn-success" ng-click="transc.retryTrans(x.Id)"><i class="fa fa-refresh" aria-hidden="true"></i></button>' }
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

    transc.gridLogs = {
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

    transc.gridOptions.reGetAll = function () {
        transc.init();
    }

    transc.gridOptions.onRowSelected = function () {
        var item = transc.gridOptions.selectedRow.item;
        //Get Options
        $("#gridLogs").fadeOut('fast');
        var filterModel = { Filters: [] };
        filterModel.Filters.push({ PropertyName: "LinkTransactionId", IntValue1: item.Id, SearchType: 0 });
        transc.addRequested = true;
        //transc.optionsBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"BankPaymentTransactionLog/getall", filterModel, "POST").success(function (response) {
            transc.addRequested = false;
            //transc.optionsBusyIndicator.isActice = false;
            rashaErManage.checkAction(response);
            transc.OptionList = response.ListItems;
            transc.TransactionLogList = response.ListItems;
            transc.gridLogs.fillData(transc.TransactionLogList, response.resultAccess);
            transc.gridLogs.currentPageNumber = response.CurrentPageNumber;
            transc.gridLogs.totalRowCount = response.TotalRowCount;
            transc.gridLogs.RowPerPage = response.RowPerPage;
            if (transc.TransactionLogList.length > 0)
                $("#gridLogs").fadeIn('fast');
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }

    //Export Report 
    transc.exportFile = function () {
        transc.addRequested = true;
        transc.gridOptions.advancedSearchData.engine.ExportFile = transc.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'bankpaymentprivatesiteconfig/exportfile', transc.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            transc.addRequested = false;
            rashaErManage.checkAction(response);
            transc.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //transc.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    transc.toggleExportForm = function () {
        transc.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        transc.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        transc.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        transc.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleBankPayment/BankPaymentTransaction/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    transc.rowCountChanged = function () {
        if (!angular.isDefined(transc.ExportFileClass.RowCount) || transc.ExportFileClass.RowCount > 5000)
            transc.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    transc.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"BankPaymentTransaction/count", transc.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            transc.addRequested = false;
            rashaErManage.checkAction(response);
            transc.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            transc.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    transc.changeState = function (state) {
        $state.go("index." + state);
    }

    transc.retryTrans = function (selectedId) {
        ajax.call(cmsServerConfig.configApiServerPath+'BankPaymentTransaction/TransactionCheck', selectedId, 'GET').success(function (response) {
            transc.addRequested = false;
            rashaErManage.checkAction(response);
            transc.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //transc.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);