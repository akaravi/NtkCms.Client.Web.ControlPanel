app.controller("ReceivedFilesController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var receivedFiles = this;
    receivedFiles.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    receivedFiles.UninversalMenus = [];

    receivedFiles.init = function () {
        receivedFiles.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ApiTelegramreceivedFiles/getall", receivedFiles.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            receivedFiles.busyIndicator.isActive = false;
            receivedFiles.ListItems = response.ListItems;
            receivedFiles.gridOptions.fillData(receivedFiles.ListItems, response.resultAccess);
            receivedFiles.gridOptions.currentPageNumber = response.CurrentPageNumber;
            receivedFiles.gridOptions.totalRowCount = response.TotalRowCount;
            receivedFiles.gridOptions.rowPerPage = response.RowPerPage;
            receivedFiles.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            receivedFiles.busyIndicator.isActive = false;
            receivedFiles.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    receivedFiles.busyIndicator.isActive = true;
    receivedFiles.addRequested = false;
    receivedFiles.openAddModal = function () {
        receivedFiles.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramreceivedFiles/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            receivedFiles.busyIndicator.isActive = false;
            receivedFiles.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegramReceivedFiles/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    receivedFiles.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        receivedFiles.busyIndicator.isActive = true;
        receivedFiles.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramreceivedFiles/add', receivedFiles.selectedItem, 'POST').success(function (response) {
            receivedFiles.addRequested = false;
            receivedFiles.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                receivedFiles.ListItems.unshift(response.Item);
                receivedFiles.gridOptions.fillData(receivedFiles.ListItems);
                receivedFiles.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            receivedFiles.busyIndicator.isActive = false;
            receivedFiles.addRequested = false;
        });
    }

    receivedFiles.openEditModal = function () {

        receivedFiles.modalTitle = 'ویرایش';
        if (!receivedFiles.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramreceivedFiles/GetOne', receivedFiles.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            receivedFiles.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegramReceivedFiles/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    receivedFiles.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        receivedFiles.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramReceivedFiles/edit', receivedFiles.selectedItem, 'PUT').success(function (response) {
            receivedFiles.addRequested = true;
            rashaErManage.checkAction(response);
            receivedFiles.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                receivedFiles.addRequested = false;
                receivedFiles.replaceItem(receivedFiles.selectedItem.Id, response.Item);
                receivedFiles.gridOptions.fillData(receivedFiles.ListItems);
                receivedFiles.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            receivedFiles.addRequested = false;
        });
    }

    receivedFiles.closeModal = function () {
        $modalStack.dismissAll();
    };

    receivedFiles.replaceItem = function (oldId, newItem) {
        angular.forEach(receivedFiles.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = receivedFiles.ListItems.indexOf(item);
                receivedFiles.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            receivedFiles.ListItems.unshift(newItem);
    }

    receivedFiles.deleteRow = function () {
        if (!receivedFiles.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                receivedFiles.busyIndicator.isActive = true;
                console.log(receivedFiles.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramReceivedFiles/GetOne', receivedFiles.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    receivedFiles.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramReceivedFiles/delete', receivedFiles.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        receivedFiles.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            receivedFiles.replaceItem(receivedFiles.selectedItemForDelete.Id);
                            receivedFiles.gridOptions.fillData(receivedFiles.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        receivedFiles.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    receivedFiles.busyIndicator.isActive = false;

                });
            }
        });
    }

    receivedFiles.searchData = function () {
        receivedFiles.gridOptions.searchData();

    }

    receivedFiles.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'LinkFileId', displayName: 'کد سیستمی فایل', sortable: true, type: 'string', visible: true },
            { name: 'Type', displayName: 'نوع', sortable: true, type: 'string', visible: true },
            { name: 'TelegramFileId', displayName: 'شناسه تلگرام', sortable: true, type: 'string', visible: true },

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

    receivedFiles.gridOptions.reGetAll = function () {
        receivedFiles.init();
    }

    receivedFiles.gridOptions.onRowSelected = function () {

    }

    receivedFiles.columnCheckbox = false;
    receivedFiles.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (receivedFiles.gridOptions.columnCheckbox) {
            for (var i = 0; i < receivedFiles.gridOptions.columns.length; i++) {
                //receivedFiles.gridOptions.columns[i].visible = $("#" + receivedFiles.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + receivedFiles.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                receivedFiles.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = receivedFiles.gridOptions.columns;
            for (var i = 0; i < receivedFiles.gridOptions.columns.length; i++) {
                receivedFiles.gridOptions.columns[i].visible = true;
                var element = $("#" + receivedFiles.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + receivedFiles.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < receivedFiles.gridOptions.columns.length; i++) {
            console.log(receivedFiles.gridOptions.columns[i].name.concat(".visible: "), receivedFiles.gridOptions.columns[i].visible);
        }
        receivedFiles.gridOptions.columnCheckbox = !receivedFiles.gridOptions.columnCheckbox;
    }

    receivedFiles.openSendMessageToSender = function (item) {
        receivedFiles.modalTitle = "ارسال پیام";
        receivedFiles.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramReceivedFiles/GetOne', item.Id, 'GET').success(function (response) {
            receivedFiles.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegramReceivedFiles/sendMessageModal.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            receivedFiles.addRequested = false;
        });
        receivedFiles.busyIndicator.isActive = false;
    }
    //Export Report 
    receivedFiles.exportFile = function () {
        receivedFiles.gridOptions.advancedSearchData.engine.ExportFile = receivedFiles.ExportFileClass;
        receivedFiles.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramReceivedFiles/exportfile', receivedFiles.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            receivedFiles.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                receivedFiles.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //receivedFiles.closeModal();
            }
            receivedFiles.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    receivedFiles.toggleExportForm = function () {
        receivedFiles.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        receivedFiles.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        receivedFiles.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        receivedFiles.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        receivedFiles.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegramReceivedFiles/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    receivedFiles.rowCountChanged = function () {
        if (!angular.isDefined(receivedFiles.ExportFileClass.RowCount) || receivedFiles.ExportFileClass.RowCount > 5000)
            receivedFiles.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    receivedFiles.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ApiTelegramReceivedFiles/count", receivedFiles.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            receivedFiles.addRequested = false;
            rashaErManage.checkAction(response);
            receivedFiles.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            receivedFiles.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

