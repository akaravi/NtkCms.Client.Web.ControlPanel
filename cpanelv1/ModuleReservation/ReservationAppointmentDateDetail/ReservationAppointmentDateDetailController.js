app.controller("reservationAppointmentDateDetailController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {

    var appDateDetail = this;


    appDateDetail.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var todayDate = moment().format();
    //appDate.datePickerConfig = {
    //    defaultDate: todayDate
    //};
    appDateDetail.StartService = {
        defaultDate: todayDate,
       // viewTimePicker: true
    }
    appDateDetail.ReservedLockedTime = {
        defaultDate: todayDate,
    }
    appDateDetail.EndService = {
        defaultDate: todayDate,
        //viewTimePicker: true
    }

    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    appDateDetail.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "reservationAppointmentDateDetailController") {
            localStorage.setItem('AddRequest', '');
            appDateDetail.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }



    if (itemRecordStatus != undefined) appDateDetail.itemRecordStatus = itemRecordStatus;

    appDateDetail.init = function () {
        appDateDetail.busyIndicator.isActive = true;



        var engine = {};
        try {
            engine = appDateDetail.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        
        ajax.call(cmsServerConfig.configApiServerPath+"ReservationAppointmentDateDetail/getall", appDateDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            appDateDetail.busyIndicator.isActive = false;
            appDateDetail.ListItems = response.ListItems;
            ajax.call(cmsServerConfig.configApiServerPath+"ReservationAppointmentDateDetail/getAllSessionStatusEnum", {}, 'POST').success(function (response) {
                appDateDetail.SessionStatus = response.ListItems;
                appDateDetail.setSessionStatusEnum(appDateDetail.ListItems, appDateDetail.SessionStatus);
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            // Call Excerpt Function to shorten the length of long strings
            appDateDetail.gridOptions.fillData(appDateDetail.ListItems, response.resultAccess);
            appDateDetail.gridOptions.currentPageNumber = response.CurrentPageNumber;
            appDateDetail.gridOptions.totalRowCount = response.TotalRowCount;
            appDateDetail.gridOptions.rowPerPage = response.RowPerPage;
            appDateDetail.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            appDateDetail.busyIndicator.isActive = false;
            appDateDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            });

        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        appDateDetail.checkRequestAddNewItemFromOtherControl(null);
    }
    appDateDetail.setSessionStatusEnum = function (listItems, enumList) {
        angular.forEach(listItems, function (item, property) {
            angular.forEach(enumList, function (value, key) {
                if (item.SessionStatus == value.Value)
                    item.SessionStatusTitle = value.Description;
            });
        });
    }
    //appDateDetail.StartDateTime = null;
    //appDateDetail.EndDateTime = null;
    // Open Add Modal
    appDateDetail.busyIndicator.isActive = true;
    appDateDetail.addRequested = false;
    appDateDetail.openAddModal = function () {
        appDateDetail.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'ReservationAppointmentDateDetail/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            appDateDetail.busyIndicator.isActive = false;
            appDateDetail.selectedItem = response.Item;
            //var date = sqlToJsDate(response.Item.StartDateTime);
            //appDateDetail.StartDateTime = appDateDetail.setTime(8, 30);
            //appDateDetail.EndDateTime = appDateDetail.setTime(13, 30);
            $modal.open({
                templateUrl: 'cpanelv1/ModuleReservation/ReservationAppointmentDateDetail/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appDateDetail.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    appDateDetail.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        appDateDetail.busyIndicator.isActive = true;
        appDateDetail.addRequested = true;
        //------------- appDateDetail.setTimeBeforeAdd
        //appDateDetail.selectedItem.StartDateTime = jsToSqlDate(appDateDetail.StartDateTime); didn't work
        //appDateDetail.selectedItem.EndDateTime = jsToSqlDate(appDateDetail.EndDateTime);
        //appDateDetail.selectedItem.StartDateTime = appDateDetail.StartDateTime;
        //appDateDetail.selectedItem.EndDateTime = appDateDetail.EndDateTime;

        ajax.call(cmsServerConfig.configApiServerPath+'ReservationAppointmentDateDetail/add', appDateDetail.selectedItem, 'POST').success(function (response) {
            appDateDetail.addRequested = false;
            appDateDetail.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                appDateDetail.checkRequestAddNewItemFromOtherControl(response.Item.Id);

                appDateDetail.ListItems.unshift(response.Item);
                appDateDetail.gridOptions.fillData(appDateDetail.ListItems);
                appDateDetail.setSessionStatusEnum(appDateDetail.ListItems, appDateDetail.SessionStatusEnum);
                appDateDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appDateDetail.busyIndicator.isActive = false;
            appDateDetail.addRequested = false;
        });
    }

    // Open Edit Modal
    appDateDetail.openEditModal = function () {
        appDateDetail.modalTitle = 'ویرایش';
        if (!appDateDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'ReservationAppointmentDateDetail/GetOne', appDateDetail.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            appDateDetail.selectedItem = response.Item;
            appDateDetail.StartService.defaultDate = appDateDetail.selectedItem.StartService;
            appDateDetail.EndService.defaultDate = appDateDetail.selectedItem.EndService;
            appDateDetail.EndService.ReservedLockedTime  = appDateDetail.selectedItem.ReservedLockedTime;
            //appDateDetail.Date.defaultDate = appDateDetail.selectedItem.Date;
            //appDateDetail.StartDateTime = appDateDetail.selectedItem.StartDateTime.getHours();
            //appDateDetail.EndDateTime = appDateDetail.selectedItem.EndDateTime.getHours();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleReservation/ReservationAppointmentDateDetail/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    appDateDetail.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        appDateDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ReservationAppointmentDateDetail/edit', appDateDetail.selectedItem, 'PUT').success(function (response) {
            appDateDetail.addRequested = true;
            rashaErManage.checkAction(response);
            appDateDetail.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                appDateDetail.addRequested = false;
                appDateDetail.replaceItem(appDateDetail.selectedItem.Id, response.Item);
                appDateDetail.gridOptions.fillData(appDateDetail.ListItems);
                appDateDetail.setSessionStatusEnum(appDateDetail.ListItems, appDateDetail.SessionStatusEnum);
                appDateDetail.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appDateDetail.addRequested = false;
            appDateDetail.busyIndicator.isActive = false;

        });
    }

    appDateDetail.closeModal = function () {
        $modalStack.dismissAll();
    };

    appDateDetail.replaceItem = function (oldId, newItem) {
        angular.forEach(appDateDetail.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = appDateDetail.ListItems.indexOf(item);
                appDateDetail.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            appDateDetail.ListItems.unshift(newItem);
    }

    // Delete
    appDateDetail.deleteRow = function () {
        if (!appDateDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                appDateDetail.busyIndicator.isActive = true;
                console.log(appDateDetail.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'ReservationAppointmentDateDetail/GetOne', appDateDetail.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    appDateDetail.selectedItemForDelete = response.Item;
                    console.log(appDateDetail.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ReservationAppointmentDateDetail/delete', appDateDetail.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        appDateDetail.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            appDateDetail.replaceItem(appDateDetail.selectedItemForDelete.Id);
                            appDateDetail.gridOptions.fillData(appDateDetail.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        appDateDetail.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    appDateDetail.busyIndicator.isActive = false;

                });
            }
        });
    }

    appDateDetail.searchData = function () {
        appDateDetail.gridOptions.searchData();

    }
    appDateDetail.LinkAppointmentDateIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkAppointmentDateId',
        url: 'ReservationAppointmentDate',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: appDateDetail,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'StartDateTime', displayName: 'زمان شروع', sortable: true, isDate: true, type: 'date', visible: true },
                { name: 'EndDateTime', displayName: 'زمان پایان', sortable: true, isDate: true, type: 'date', visible: true },
                { name: 'ServiceTimeMinute', displayName: 'زمان سرویس (دقیقه)', sortable: true, type: 'integer', visible: true } 
            ]
        }
    }
    appDateDetail.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkAppointmentDateId', displayName: 'کد سیستمی اعلام روز', sortable: true, type: 'integer', visible: true },
            { name: 'virtual_AppointmentDate.AllowUserToCreateDetailInOrder', displayName: 'کاربر اجازه ایجاد سفارش دارد؟', sortable: true, type: 'string', visible: true },
            { name: 'StartService', displayName: 'شروع سرویس', sortable: true, isDate: true, type: 'date', visible: true },
            { name: 'EndService', displayName: 'پایان سرویس', sortable: true, isDate: true, type: 'date', visible: true },
            { name: 'SessionStatusTitle', displayName: 'وضعیت سرویس', sortable: true, type: 'string', visible: true }
        ],
        data: {},
        multiSelect: false,
        startDate: moment().format(),
        advancedSearchData: {
            engine: {}
        }
    }

    appDateDetail.gridOptions.advancedSearchData = {};
    appDateDetail.gridOptions.advancedSearchData.engine = {};
    appDateDetail.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    appDateDetail.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    appDateDetail.gridOptions.advancedSearchData.engine.SortType = 1;
    appDateDetail.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    appDateDetail.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    appDateDetail.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    appDateDetail.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    appDateDetail.gridOptions.advancedSearchData.engine.Filters = [];

    appDateDetail.gridOptions.reGetAll = function () {
        appDateDetail.init();
    }

    appDateDetail.gridOptions.onRowSelected = function () {

    }

    appDateDetail.columnCheckbox = false;
    appDateDetail.openGridUserTypeModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (appDateDetail.gridOptions.columnCheckbox) {
            for (var i = 0; i < appDateDetail.gridOptions.columns.length; i++) {
                //appDateDetail.gridOptions.columns[i].visible = $("#" + appDateDetail.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + appDateDetail.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                appDateDetail.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = appDateDetail.gridOptions.columns;
            for (var i = 0; i < appDateDetail.gridOptions.columns.length; i++) {
                appDateDetail.gridOptions.columns[i].visible = true;
                var element = $("#" + appDateDetail.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + appDateDetail.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < appDateDetail.gridOptions.columns.length; i++) {
            console.log(appDateDetail.gridOptions.columns[i].name.concat(".visible: "), appDateDetail.gridOptions.columns[i].visible);
        }
        appDateDetail.gridOptions.columnCheckbox = !appDateDetail.gridOptions.columnCheckbox;
    }

    appDateDetail.openSetTimesModal = function (dateId) {
        appDateDetail.modalTitle = 'تنظیمات';
        $modal.open({
            templateUrl: 'cpanelv1/ModuleReservation/ReservationAppointmentDateDetail/setTimes.html',
            scope: $scope
        });

    }

    //function sqlToJsDate(sqlDate) {
    //    //sqlDate in SQL DATETIME format ("yyyy-mm-ddThh:mm:ss.ms")
    //    var sqlDateArr1 = sqlDate.split("-");
    //    //format of sqlDateArr1[] = ['yyyy','mm','dd hh:mm:ms']
    //    var sYear = sqlDateArr1[0];
    //    var sMonth = (Number(sqlDateArr1[1]) - 1).toString();
    //    var sqlDateArr2 = sqlDateArr1[2].split("T");
    //    //format of sqlDateArr2[] = ['dd', 'hh:mm:ss.ms']
    //    var sDay = sqlDateArr2[0];
    //    var sqlDateArr3 = sqlDateArr2[1].split(":");
    //    //format of sqlDateArr3[] = ['hh','mm','ss.ms']
    //    var sHour = sqlDateArr3[0];
    //    var sMinute = sqlDateArr3[1];
    //    var sqlDateArr4 = sqlDateArr3[2].split(".");
    //    //format of sqlDateArr4[] = ['ss','ms']
    //    var sSecond = sqlDateArr4[0];
    //    var sMillisecond = sqlDateArr4[1];
    //    var d = new Date(parseInt(sYear), parseInt(sMonth), parseInt(sDay), parseInt(sHour), parseInt(sMinute), parseInt(sSecond));
    //    return d;
    //}

    //function jsToSqlDate(jsDate) {
    //    //sqlDate in SQL DATETIME format ("yyyy-mm-ddThh:mm:ss.ms") 2016-10-30T20:30:00+00:00

    //    var sqlDate = jsDate.getFullYear() + "-" + jsDate.getMonth() + "-" + jsDate.getDay() + "T" + jsDate.getHours() + ":" + jsDate.getMinutes() + ":" + jsDate.getSeconds() + "+00:00";
    //    console.log("SQL Date is: " + sqlDate);
    //    return sqlDate;
    //}


    //appDateDetail.setTime = function (hour, min) {
    //    var today = new Date();
    //    var dd = today.getDate();
    //    var mm = today.getMonth() + 1; //January is 0!
    //    var yyyy = today.getFullYear();
    //    if (dd < 10) {
    //        dd = '0' + dd
    //    }
    //    if (mm < 10) {
    //        mm = '0' + mm
    //    }
    //    var today = dd + '/' + mm + '/' + yyyy;
    //    var d = new Date(yyyy, mm, dd, hour, min, 0, 0);
    //    return d;
    //}
    //Export Report 
    appDateDetail.exportFile = function () {
        appDateDetail.addRequested = true;
        appDateDetail.gridOptions.advancedSearchData.engine.ExportFile = appDateDetail.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'ReservationAppointmentDateDetail/exportfile', appDateDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            appDateDetail.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                appDateDetail.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //appDateDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    appDateDetail.toggleExportForm = function () {
        appDateDetail.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        appDateDetail.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        appDateDetail.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        appDateDetail.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        appDateDetail.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleReservation/ReservationAppointmentDateDetail/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    appDateDetail.rowCountChanged = function () {
        if (!angular.isDefined(appDateDetail.ExportFileClass.RowCount) || appDateDetail.ExportFileClass.RowCount > 5000)
            appDateDetail.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    appDateDetail.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ReservationAppointmentDateDetail/count", appDateDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            appDateDetail.addRequested = false;
            rashaErManage.checkAction(response);
            appDateDetail.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            appDateDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

