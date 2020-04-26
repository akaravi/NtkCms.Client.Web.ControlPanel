app.controller("deliveryMethodController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {

    var deliveryMethod = this;


    deliveryMethod.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var todayDate = moment().format();
    deliveryMethod.datePickerConfig = {
        defaultDate: todayDate
    };
    deliveryMethod.ActivateDate = {
        defaultDate: todayDate,
        //viewTimePicker: true
    }



    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    deliveryMethod.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "DeliveryMethodController") {
            localStorage.setItem('AddRequest', '');
            deliveryMethod.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }



    if (itemRecordStatus != undefined) deliveryMethod.itemRecordStatus = itemRecordStatus;

    deliveryMethod.init = function () {
        deliveryMethod.busyIndicator.isActive = true;



        var engine = {};
        try {
            engine = deliveryMethod.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        ajax.call(cmsServerConfig.configApiServerPath+"DeliveryMethod/getall", deliveryMethod.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            deliveryMethod.busyIndicator.isActive = false;
            deliveryMethod.ListItems = response.ListItems;

            // Call Excerpt Function to shorten the length of long strings
            deliveryMethod.gridOptions.fillData(deliveryMethod.ListItems, response.resultAccess);
            deliveryMethod.gridOptions.currentPageNumber = response.CurrentPageNumber;
            deliveryMethod.gridOptions.totalRowCount = response.TotalRowCount;
            deliveryMethod.gridOptions.rowPerPage = response.RowPerPage;
            deliveryMethod.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            deliveryMethod.busyIndicator.isActive = false;
            deliveryMethod.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });

        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        deliveryMethod.checkRequestAddNewItemFromOtherControl(null);
    }
    deliveryMethod.setSessionStatusEnum = function (listItems, enumList) {
        angular.forEach(listItems, function (item, property) {
            angular.forEach(enumList, function (value, key) {
                if (item.SessionStatus == value.Value)
                    item.SessionStatusTitle = value.Description;
            });
        });
    }
    //deliveryMethod.StartDateTime = null;
    //deliveryMethod.EndDateTime = null;
    // Open Add Modal
    deliveryMethod.busyIndicator.isActive = true;
    deliveryMethod.addRequested = false;
    deliveryMethod.openAddModal = function () {
        deliveryMethod.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMethod/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            deliveryMethod.busyIndicator.isActive = false;
            deliveryMethod.selectedItem = response.Item;
            //var date = sqlToJsDate(response.Item.StartDateTime);
            //deliveryMethod.StartDateTime = deliveryMethod.setTime(8, 30);
            //deliveryMethod.EndDateTime = deliveryMethod.setTime(13, 30);
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDelivery/DeliveryMethod/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            deliveryMethod.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    deliveryMethod.addNewRow = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        deliveryMethod.busyIndicator.isActive = true;
        deliveryMethod.addRequested = true;
        //------------- deliveryMethod.setTimeBeforeAdd
        //deliveryMethod.selectedItem.StartDateTime = jsToSqlDate(deliveryMethod.StartDateTime); didn't work
        //deliveryMethod.selectedItem.EndDateTime = jsToSqlDate(deliveryMethod.EndDateTime);
        //deliveryMethod.selectedItem.StartDateTime = deliveryMethod.StartDateTime;
        //deliveryMethod.selectedItem.EndDateTime = deliveryMethod.EndDateTime;

        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMethod/add', deliveryMethod.selectedItem, 'POST').success(function (response) {
            deliveryMethod.addRequested = false;
            deliveryMethod.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                deliveryMethod.checkRequestAddNewItemFromOtherControl(response.Item.Id);

                deliveryMethod.ListItems.unshift(response.Item);
                deliveryMethod.gridOptions.fillData(deliveryMethod.ListItems);
                deliveryMethod.setSessionStatusEnum(deliveryMethod.ListItems, deliveryMethod.SessionStatusEnum);
                deliveryMethod.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            deliveryMethod.busyIndicator.isActive = false;
            deliveryMethod.addRequested = false;
        });
    }

    // Open Edit Modal
    deliveryMethod.openEditModal = function () {
        deliveryMethod.modalTitle = 'ویرایش';
        if (!deliveryMethod.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMethod/GetOne', deliveryMethod.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            deliveryMethod.selectedItem = response.Item;
            deliveryMethod.ActivateDate.defaultDate = deliveryMethod.selectedItem.ActivateDate;
            //deliveryMethod.EndService.defaultDate = deliveryMethod.selectedItem.EndService;
            //deliveryMethod.Date.defaultDate = deliveryMethod.selectedItem.Date;
            //deliveryMethod.StartDateTime = deliveryMethod.selectedItem.StartDateTime.getHours();
            //deliveryMethod.EndDateTime = deliveryMethod.selectedItem.EndDateTime.getHours();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDelivery/DeliveryMethod/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    deliveryMethod.editRow = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        deliveryMethod.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMethod/edit', deliveryMethod.selectedItem, 'PUT').success(function (response) {
            deliveryMethod.addRequested = true;
            rashaErManage.checkAction(response);
            deliveryMethod.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                deliveryMethod.addRequested = false;
                deliveryMethod.replaceItem(deliveryMethod.selectedItem.Id, response.Item);
                deliveryMethod.gridOptions.fillData(deliveryMethod.ListItems);
                deliveryMethod.setSessionStatusEnum(deliveryMethod.ListItems, deliveryMethod.SessionStatusEnum);
                deliveryMethod.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            deliveryMethod.addRequested = false;
            deliveryMethod.busyIndicator.isActive = false;

        });
    }

    deliveryMethod.closeModal = function () {
        $modalStack.dismissAll();
    };

    deliveryMethod.replaceItem = function (oldId, newItem) {
        angular.forEach(deliveryMethod.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = deliveryMethod.ListItems.indexOf(item);
                deliveryMethod.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            deliveryMethod.ListItems.unshift(newItem);
    }

    // Delete
    deliveryMethod.deleteRow = function () {
        if (!deliveryMethod.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                deliveryMethod.busyIndicator.isActive = true;
                console.log(deliveryMethod.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMethod/GetOne', deliveryMethod.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    deliveryMethod.selectedItemForDelete = response.Item;
                    console.log(deliveryMethod.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMethod/delete', deliveryMethod.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        deliveryMethod.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            deliveryMethod.replaceItem(deliveryMethod.selectedItemForDelete.Id);
                            deliveryMethod.gridOptions.fillData(deliveryMethod.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        deliveryMethod.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    deliveryMethod.busyIndicator.isActive = false;

                });
            }
        });
    }

    deliveryMethod.searchData = function () {
        deliveryMethod.gridOptions.searchData();

    }
    deliveryMethod.LinkAppointmentDateIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkAppointmentDateId',
        url: 'ReservationAppointmentDate',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: deliveryMethod,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'StartDateTime', displayName: 'زمان شروع', sortable: true, isDate: true, type: 'date', visible: true },
                { name: 'EndDateTime', displayName: 'زمان پایان', sortable: true, isDate: true, type: 'date', visible: true },
                { name: 'ServiceTimeMinute', displayName: 'زمان سرویس (دقیقه)', sortable: true, type: 'integer', visible: true }
            ]
        }
    }
    deliveryMethod.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkAppointmentDateId', displayName: 'کد سیستمی اعلام روز', sortable: true, type: 'integer', visible: true },
            { name: 'virtual_AppointmentDate.AllowUserToCreateDetailInOrder', displayName: 'کاربر اجازه ایجاد سفارش دارد؟', sortable: true, type: 'string', visible: true },
            { name: 'ActivateDate', displayName: 'تاریخ شروع پخش', sortable: true, isDate: true, type: 'date', visible: true },
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

    deliveryMethod.gridOptions.advancedSearchData = {};
    deliveryMethod.gridOptions.advancedSearchData.engine = {};
    deliveryMethod.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    deliveryMethod.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    deliveryMethod.gridOptions.advancedSearchData.engine.SortType = 1;
    deliveryMethod.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    deliveryMethod.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    deliveryMethod.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    deliveryMethod.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    deliveryMethod.gridOptions.advancedSearchData.engine.Filters = [];

    deliveryMethod.gridOptions.reGetAll = function () {
        deliveryMethod.init();
    }

    deliveryMethod.gridOptions.onRowSelected = function () {

    }

    deliveryMethod.columnCheckbox = false;
    deliveryMethod.openGridUserTypeModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (deliveryMethod.gridOptions.columnCheckbox) {
            for (var i = 0; i < deliveryMethod.gridOptions.columns.length; i++) {
                //deliveryMethod.gridOptions.columns[i].visible = $("#" + deliveryMethod.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + deliveryMethod.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                deliveryMethod.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = deliveryMethod.gridOptions.columns;
            for (var i = 0; i < deliveryMethod.gridOptions.columns.length; i++) {
                deliveryMethod.gridOptions.columns[i].visible = true;
                var element = $("#" + deliveryMethod.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + deliveryMethod.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < deliveryMethod.gridOptions.columns.length; i++) {
            console.log(deliveryMethod.gridOptions.columns[i].name.concat(".visible: "), deliveryMethod.gridOptions.columns[i].visible);
        }
        deliveryMethod.gridOptions.columnCheckbox = !deliveryMethod.gridOptions.columnCheckbox;
    }

    deliveryMethod.openSetTimesModal = function (dateId) {
        deliveryMethod.modalTitle = 'تنظیمات';
        $modal.open({
            templateUrl: 'cpanelv1/ModuleDelivery/DeliveryMethod/setTimes.html',
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


    //deliveryMethod.setTime = function (hour, min) {
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
    deliveryMethod.exportFile = function () {
        deliveryMethod.addRequested = true;
        deliveryMethod.gridOptions.advancedSearchData.engine.ExportFile = deliveryMethod.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMethod/exportfile', deliveryMethod.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            deliveryMethod.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                deliveryMethod.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //deliveryMethod.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    deliveryMethod.toggleExportForm = function () {
        deliveryMethod.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        deliveryMethod.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        deliveryMethod.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        deliveryMethod.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        deliveryMethod.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleDelivery/DeliveryMethod/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    deliveryMethod.rowCountChanged = function () {
        if (!angular.isDefined(deliveryMethod.ExportFileClass.RowCount) || deliveryMethod.ExportFileClass.RowCount > 5000)
            deliveryMethod.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    deliveryMethod.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"DeliveryMethod/count", deliveryMethod.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            deliveryMethod.addRequested = false;
            rashaErManage.checkAction(response);
            deliveryMethod.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            deliveryMethod.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

