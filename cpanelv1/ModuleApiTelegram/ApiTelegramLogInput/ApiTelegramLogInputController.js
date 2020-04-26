app.controller("logInputGridController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var logInputCtrl = this;
    logInputCtrl.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
        logInputCtrl.show_text = true;
        logInputCtrl.show_title = true;
        logInputCtrl.show_chatid = false;
        logInputCtrl.show_membergroupid = false;
        logInputCtrl.show_linkfileid = false;
        logInputCtrl.show_latitude = false;
        logInputCtrl.show_longitude = false;
        logInputCtrl.show_menuId = false;
        var data = angularJsTreefileMangerList();
        logInputCtrl.dataForTheTree = data.list;
    logInputCtrl.UninversalMenus = [];
    //FilterModel.GetExport = { ExportType: 1, RecieveMethod:0,RowData:1000}
    logInputCtrl.init = function () {
        logInputCtrl.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ApiTelegramLogInput/getall", logInputCtrl.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            logInputCtrl.ListItems = response.ListItems;
            logInputCtrl.gridOptions.fillData(logInputCtrl.ListItems, response.resultAccess);
            logInputCtrl.gridOptions.currentPageNumber = response.CurrentPageNumber;
            logInputCtrl.gridOptions.totalRowCount = response.TotalRowCount;
            logInputCtrl.gridOptions.rowPerPage = response.RowPerPage;
            logInputCtrl.gridOptions.maxSize = 5;
            logInputCtrl.allowedSearch = response.AllowedSearchField;
            logInputCtrl.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            logInputCtrl.busyIndicator.isActive = false;
            logInputCtrl.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
logInputCtrl.messageTypeListItems = [
        { Key: "متن", Value: 1 },
        { Key: "عکس", Value: 2 },
        { Key: "صدا", Value: 3 },
        { Key: "ویدیو", Value: 4 },
        { Key: "فایل", Value: 6 },
        { Key: "استیکر", Value: 7 },
        { Key: "مکان", Value: 8 },
        { Key: "مخاطب", Value: 9 },
        { Key: "", Value: '' }];
        //{ Key: "منوی درخت تصمیم", Value: 0 }];

    logInputCtrl.onMessageTypeChange = function (value) {
        if (value == '') {
            logInputCtrl.addRequested = true;
        }
        else {
            logInputCtrl.addRequested = false;
        }
        logInputCtrl.selectedItem.MessageType = value;
        logInputCtrl.show_text = false;
        logInputCtrl.show_title = false;
        logInputCtrl.show_linkfileid = false;
        logInputCtrl.show_latitude = false;
        logInputCtrl.show_longitude = false;
        logInputCtrl.show_firstName = false;
        logInputCtrl.show_lastName = false;
        logInputCtrl.show_phoneNumber = false;
        logInputCtrl.show_menuId = false;
        if (value == 1) logInputCtrl.show_text = true;
        if (value == 3 ) botConfigCtrl.show_title = true;
        else if (value == 2 ||value == 3 || value == 4 || value == 6 || value == 7) { logInputCtrl.show_linkfileid = true; logInputCtrl.show_text = true; }
        else if (value == 8) { logInputCtrl.show_latitude = true; logInputCtrl.show_longitude = true; }
        else if (value == 9) { logInputCtrl.show_firstName = true; logInputCtrl.show_lastName = true; logInputCtrl.show_phoneNumber = true; }
        else if (value == 0) { logInputCtrl.show_menuId = true; }
    }
logInputCtrl.treeOptions = {
        nodeChildren: "Children",
        dirSelectable: false,
        multiSelection: false
    }
    // Open Add Modal
    logInputCtrl.busyIndicator.isActive = true;
    logInputCtrl.addRequested = false;
    logInputCtrl.openAddModal = function () {
        logInputCtrl.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramLogInput/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            logInputCtrl.busyIndicator.isActive = false;
            logInputCtrl.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegramLogInput/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    logInputCtrl.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        logInputCtrl.busyIndicator.isActive = true;
        logInputCtrl.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramLogInput/add', logInputCtrl.selectedItem, 'POST').success(function (response) {
            logInputCtrl.addRequested = false;
            logInputCtrl.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                logInputCtrl.ListItems.unshift(response.Item);
                logInputCtrl.gridOptions.fillData(logInputCtrl.ListItems);
                logInputCtrl.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            logInputCtrl.busyIndicator.isActive = false;
            logInputCtrl.addRequested = false;
        });
    }

    logInputCtrl.openEditModal = function () {

        logInputCtrl.modalTitle = 'ویرایش';
        if (!logInputCtrl.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramLogInput/GetOne', logInputCtrl.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            logInputCtrl.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegramLogInput/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    logInputCtrl.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        logInputCtrl.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramLogInput/edit', logInputCtrl.selectedItem, 'PUT').success(function (response) {
            logInputCtrl.addRequested = true;
            rashaErManage.checkAction(response);
            logInputCtrl.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                logInputCtrl.addRequested = false;
                logInputCtrl.replaceItem(logInputCtrl.selectedItem.Id, response.Item);
                logInputCtrl.gridOptions.fillData(logInputCtrl.ListItems);
                logInputCtrl.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            logInputCtrl.addRequested = false;
        });
    }

    logInputCtrl.closeModal = function () {
        $modalStack.dismissAll();
    };

    logInputCtrl.replaceItem = function (oldId, newItem) {
        angular.forEach(logInputCtrl.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = logInputCtrl.ListItems.indexOf(item);
                logInputCtrl.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            logInputCtrl.ListItems.unshift(newItem);
    }

    logInputCtrl.deleteRow = function () {
        if (!logInputCtrl.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                logInputCtrl.busyIndicator.isActive = true;
                console.log(logInputCtrl.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'apitelegramloginput/GetOne', logInputCtrl.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    logInputCtrl.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramLogInput/delete', logInputCtrl.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        logInputCtrl.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            logInputCtrl.replaceItem(logInputCtrl.selectedItemForDelete.Id);
                            logInputCtrl.gridOptions.fillData(logInputCtrl.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        logInputCtrl.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    logInputCtrl.busyIndicator.isActive = false;

                });
            }
        });
    }

    logInputCtrl.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'LinkBotConfigId', displayName: 'کد سیستمی ربات', sortable: true, type: 'integer', visible: true },
            { name: 'ChatId', displayName: 'شناسه چت', sortable: true, type: 'integer', visible: true },
            { name: 'UserId', displayName: 'شناسه کاربر', sortable: true, type: 'integer', visible: true },
            { name: 'Username', displayName: 'نام کاربری', sortable: true, type: 'string', visible: true },
            { name: 'FirstName', displayName: 'نام', sortable: true, type: 'string', visible: true },
            { name: 'ContentMessage', displayName: 'محتوای پیام', sortable: true, type: 'string', visible: true },
            { name: 'CreatedDate', displayName: 'تاریخ دریافت پیام ', sortable: true, type: 'data', isDateTime: true, width: '185px', visible: true },
            { name: 'ActionButton', displayName: 'عملیات', sortable: true, displayForce: true, width: '85px', template: '<button class="btn btn-success" ng-click="logInputCtrl.openSendMessageToSender(x)" title="ارسال پیام" type="button"><i class="fa fa-envelope-o" aria-hidden="true"></i></button>' }
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

    logInputCtrl.test = 'false';

    logInputCtrl.gridOptions.reGetAll = function () {
        logInputCtrl.init();
    }

    logInputCtrl.gridOptions.onRowSelected = function () { }

    logInputCtrl.columnCheckbox = false;
    logInputCtrl.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (logInputCtrl.gridOptions.columnCheckbox) {
            for (var i = 0; i < logInputCtrl.gridOptions.columns.length; i++) {
                //logInputCtrl.gridOptions.columns[i].visible = $("#" + logInputCtrl.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + logInputCtrl.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                logInputCtrl.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = logInputCtrl.gridOptions.columns;
            for (var i = 0; i < logInputCtrl.gridOptions.columns.length; i++) {
                logInputCtrl.gridOptions.columns[i].visible = true;
                var element = $("#" + logInputCtrl.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + logInputCtrl.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < logInputCtrl.gridOptions.columns.length; i++) {
            console.log(logInputCtrl.gridOptions.columns[i].name.concat(".visible: "), logInputCtrl.gridOptions.columns[i].visible);
        }
        logInputCtrl.gridOptions.columnCheckbox = !logInputCtrl.gridOptions.columnCheckbox;
    }

    logInputCtrl.openSendMessageToSender = function (item) {
        logInputCtrl.modalTitle = "ارسال پیام";
        logInputCtrl.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramLogInput/GetOne', item.Id, 'GET').success(function (response) {
            logInputCtrl.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegramLogInput/sendMessageModal.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            logInputCtrl.addRequested = false;
        });
        logInputCtrl.busyIndicator.isActive = false;
    }

    logInputCtrl.sendButtonText = "ارسال";
    logInputCtrl.sendMessageToSender = function () {
        if (logInputCtrl.selectedItem.MessageType == '') {
            rashaErManage.showMessage("نوع ارسال را مشخص کنید");
            return;
        }
        logInputCtrl.addRequested = true;
        logInputCtrl.busyIndicator.isActive = true;
        logInputCtrl.sendButtonText = "در حال ارسال...";
        logInputCtrl.selectedItem.SentToAllMembers = false;
        logInputCtrl.selectedItem.MemberGroupId = [];
        logInputCtrl.selectedItem.chatId = [];
        logInputCtrl.selectedItem.LinkFileId = 0;
        if (logInputCtrl.sendMode == "all")
            logInputCtrl.selectedItem.SentToAllMembers = true;
        else if (logInputCtrl.sendMode == "group")
            logInputCtrl.selectedItem.MemberGroupId = [parseInt(logInputCtrl.selectedItem.memberGroupid)];
        else
            logInputCtrl.selectedItem.chatId = [parseInt(logInputCtrl.selectedItem.chatid)];
        if (logInputCtrl.selectedItem.MessageType == 2 || logInputCtrl.selectedItem.MessageType == 3 || logInputCtrl.selectedItem.MessageType == 4 || logInputCtrl.selectedItem.MessageType == 6 || logInputCtrl.selectedItem.MessageType == 7)
            logInputCtrl.selectedItem.LinkFileId = logInputCtrl.selectedNode.Id;
        logInputCtrl.selectedItem.chatId=[parseInt(logInputCtrl.selectedItem.LinkUserId)];

        logInputCtrl.inputClass = { MessageType: logInputCtrl.selectedItem.MessageType, text: logInputCtrl.selectedItem.text,title: logInputCtrl.selectedItem.title, chatId: [parseInt(logInputCtrl.selectedItem.ChatId)], MemberGroupId: [], SentToAllMembers: false, BotId: logInputCtrl.selectedItem.LinkBotConfigId, LinkFileId:logInputCtrl.selectedItem.LinkFileId, latitude: logInputCtrl.selectedItem.latitude0, longitude: logInputCtrl.selectedItem.longitude, firstName:logInputCtrl.selectedItem.firstName, lastName: logInputCtrl.selectedItem.lastName, phoneNumber: logInputCtrl.selectedItem.phoneNumber};
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramBotConfig/SendMessage', logInputCtrl.inputClass, 'POST').success(function (response) {
            logInputCtrl.busyIndicator.isActive = false;
            logInputCtrl.addRequested = false;
            logInputCtrl.sendButtonText = "ارسال";
            //logInputCtrl.closeModal();
            rashaErManage.showMessage("گزارش سرور :" + response.Item.info + "   " + response.ErrorMessage);

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Export Report 
    logInputCtrl.exportFile = function () {
        logInputCtrl.addRequested = true;
        logInputCtrl.gridOptions.advancedSearchData.engine.ExportFile = logInputCtrl.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramLogInput/exportfile', logInputCtrl.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                logInputCtrl.closeModal();
            }
            logInputCtrl.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    logInputCtrl.toggleExportForm = function () {
        logInputCtrl.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'Random', value: 3 }
        ];
        logInputCtrl.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        logInputCtrl.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'فایل منیجر', value: 3 }
        ];
        logInputCtrl.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegramLogInput/report.html',
            scope: $scope
        });
    }
    //Row Count Input Change
    logInputCtrl.rowCountChanged = function () {
        if (!angular.isDefined(logInputCtrl.ExportFileClass.RowCount) || logInputCtrl.ExportFileClass.RowCount > 10000)
            logInputCtrl.ExportFileClass.RowCount = 10000;
    }
    //Get TotalRowCount
    logInputCtrl.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ApiTelegramLogInput/count", logInputCtrl.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            logInputCtrl.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            logInputCtrl.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Export Report 
    logInputCtrl.exportFile = function () {
        logInputCtrl.addRequested = true;
        logInputCtrl.gridOptions.advancedSearchData.engine.ExportFile = logInputCtrl.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramLogInput/exportfile', logInputCtrl.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            logInputCtrl.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                logInputCtrl.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //logInputCtrl.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    logInputCtrl.toggleExportForm = function () {
        logInputCtrl.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        logInputCtrl.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        logInputCtrl.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        logInputCtrl.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        logInputCtrl.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegramLogInput/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    logInputCtrl.rowCountChanged = function () {
        if (!angular.isDefined(logInputCtrl.ExportFileClass.RowCount) || logInputCtrl.ExportFileClass.RowCount > 5000)
            logInputCtrl.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    logInputCtrl.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ApiTelegramLogInput/count", logInputCtrl.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            logInputCtrl.addRequested = false;
            rashaErManage.checkAction(response);
            logInputCtrl.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            logInputCtrl.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

