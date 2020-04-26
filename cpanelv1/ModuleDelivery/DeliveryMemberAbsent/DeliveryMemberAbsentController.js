app.controller("deliveryMemberAbsentController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {

    var deliveryMemberAbsent = this;


    deliveryMemberAbsent.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var todayDate = moment().format();
    //appDate.datePickerConfig = {
    //    defaultDate: todayDate
    //};
    deliveryMemberAbsent.BeginDate = {
        defaultDate: todayDate,
        viewTimePicker: true
    }

    deliveryMemberAbsent.EndDate = {
        defaultDate: todayDate,
        viewTimePicker: true
    }

    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    deliveryMemberAbsent.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "deliveryMemberAbsentController") {
            localStorage.setItem('AddRequest', '');
            deliveryMemberAbsent.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }



    if (itemRecordStatus != undefined) deliveryMemberAbsent.itemRecordStatus = itemRecordStatus;

    deliveryMemberAbsent.init = function () {
        deliveryMemberAbsent.busyIndicator.isActive = true;



        var engine = {};
        try {
            engine = deliveryMemberAbsent.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        
        ajax.call(cmsServerConfig.configApiServerPath+"DeliveryMemberAbsent/getall", deliveryMemberAbsent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            deliveryMemberAbsent.busyIndicator.isActive = false;
            deliveryMemberAbsent.ListItems = response.ListItems;
           
            // Call Excerpt Function to shorten the length of long strings
            deliveryMemberAbsent.gridOptions.fillData(deliveryMemberAbsent.ListItems, response.resultAccess);
            deliveryMemberAbsent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            deliveryMemberAbsent.gridOptions.totalRowCount = response.TotalRowCount;
            deliveryMemberAbsent.gridOptions.rowPerPage = response.RowPerPage;
            deliveryMemberAbsent.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            deliveryMemberAbsent.busyIndicator.isActive = false;
            deliveryMemberAbsent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            });

        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        deliveryMemberAbsent.checkRequestAddNewItemFromOtherControl(null);
    }
    deliveryMemberAbsent.setSessionStatusEnum = function (listItems, enumList) {
        angular.forEach(listItems, function (item, property) {
            angular.forEach(enumList, function (value, key) {
                if (item.SessionStatus == value.Value)
                    item.SessionStatusTitle = value.Description;
            });
        });
    }
    //deliveryMemberAbsent.BeginDateTime = null;
    //deliveryMemberAbsent.EndDateTime = null;
    // Open Add Modal
    deliveryMemberAbsent.busyIndicator.isActive = true;
    deliveryMemberAbsent.addRequested = false;
    deliveryMemberAbsent.openAddModal = function () {
        deliveryMemberAbsent.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMemberAbsent/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            deliveryMemberAbsent.busyIndicator.isActive = false;
            deliveryMemberAbsent.selectedItem = response.Item;
            //var date = sqlToJsDate(response.Item.BeginDateTime);
            //deliveryMemberAbsent.BeginDateTime = deliveryMemberAbsent.setTime(8, 30);
            //deliveryMemberAbsent.EndDateTime = deliveryMemberAbsent.setTime(13, 30);
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDelivery/DeliveryMemberAbsent/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            deliveryMemberAbsent.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    deliveryMemberAbsent.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        deliveryMemberAbsent.busyIndicator.isActive = true;
        deliveryMemberAbsent.addRequested = true;
        //------------- deliveryMemberAbsent.setTimeBeforeAdd
        //deliveryMemberAbsent.selectedItem.BeginDateTime = jsToSqlDate(deliveryMemberAbsent.BeginDateTime); didn't work
        //deliveryMemberAbsent.selectedItem.EndDateTime = jsToSqlDate(deliveryMemberAbsent.EndDateTime);
        //deliveryMemberAbsent.selectedItem.BeginDateTime = deliveryMemberAbsent.BeginDateTime;
        //deliveryMemberAbsent.selectedItem.EndDateTime = deliveryMemberAbsent.EndDateTime;

        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMemberAbsent/add', deliveryMemberAbsent.selectedItem, 'POST').success(function (response) {
            deliveryMemberAbsent.addRequested = false;
            deliveryMemberAbsent.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                deliveryMemberAbsent.checkRequestAddNewItemFromOtherControl(response.Item.Id);

                deliveryMemberAbsent.ListItems.unshift(response.Item);
                deliveryMemberAbsent.gridOptions.fillData(deliveryMemberAbsent.ListItems);
                deliveryMemberAbsent.setSessionStatusEnum(deliveryMemberAbsent.ListItems, deliveryMemberAbsent.SessionStatusEnum);
                deliveryMemberAbsent.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            deliveryMemberAbsent.busyIndicator.isActive = false;
            deliveryMemberAbsent.addRequested = false;
        });
    }

    // Open Edit Modal
    deliveryMemberAbsent.openEditModal = function () {
        deliveryMemberAbsent.modalTitle = 'ویرایش';
        if (!deliveryMemberAbsent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMemberAbsent/GetOne', deliveryMemberAbsent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            deliveryMemberAbsent.selectedItem = response.Item;
            deliveryMemberAbsent.BeginDate.defaultDate = deliveryMemberAbsent.selectedItem.BeginDate;
            deliveryMemberAbsent.EndDate.defaultDate = deliveryMemberAbsent.selectedItem.EndDate;
            //deliveryMemberAbsent.Date.defaultDate = deliveryMemberAbsent.selectedItem.Date;
            //deliveryMemberAbsent.BeginDateTime = deliveryMemberAbsent.selectedItem.BeginDateTime.getHours();
            //deliveryMemberAbsent.EndDateTime = deliveryMemberAbsent.selectedItem.EndDateTime.getHours();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDelivery/DeliveryMemberAbsent/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    deliveryMemberAbsent.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        deliveryMemberAbsent.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMemberAbsent/edit', deliveryMemberAbsent.selectedItem, 'PUT').success(function (response) {
            deliveryMemberAbsent.addRequested = true;
            rashaErManage.checkAction(response);
            deliveryMemberAbsent.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                deliveryMemberAbsent.addRequested = false;
                deliveryMemberAbsent.replaceItem(deliveryMemberAbsent.selectedItem.Id, response.Item);
                deliveryMemberAbsent.gridOptions.fillData(deliveryMemberAbsent.ListItems);
                deliveryMemberAbsent.setSessionStatusEnum(deliveryMemberAbsent.ListItems, deliveryMemberAbsent.SessionStatusEnum);
                deliveryMemberAbsent.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            deliveryMemberAbsent.addRequested = false;
            deliveryMemberAbsent.busyIndicator.isActive = false;

        });
    }

    deliveryMemberAbsent.closeModal = function () {
        $modalStack.dismissAll();
    };

    deliveryMemberAbsent.replaceItem = function (oldId, newItem) {
        angular.forEach(deliveryMemberAbsent.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = deliveryMemberAbsent.ListItems.indexOf(item);
                deliveryMemberAbsent.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            deliveryMemberAbsent.ListItems.unshift(newItem);
    }

    // Delete
    deliveryMemberAbsent.deleteRow = function () {
        if (!deliveryMemberAbsent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                deliveryMemberAbsent.busyIndicator.isActive = true;
                console.log(deliveryMemberAbsent.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMemberAbsent/GetOne', deliveryMemberAbsent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    deliveryMemberAbsent.selectedItemForDelete = response.Item;
                    console.log(deliveryMemberAbsent.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMemberAbsent/delete', deliveryMemberAbsent.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        deliveryMemberAbsent.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            deliveryMemberAbsent.replaceItem(deliveryMemberAbsent.selectedItemForDelete.Id);
                            deliveryMemberAbsent.gridOptions.fillData(deliveryMemberAbsent.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        deliveryMemberAbsent.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    deliveryMemberAbsent.busyIndicator.isActive = false;

                });
            }
        });
    }

    deliveryMemberAbsent.searchData = function () {
        deliveryMemberAbsent.gridOptions.searchData();

    }
    deliveryMemberAbsent.LinkDeliveryMemberIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkDeliveryMemberId',
        url: 'deliveryMember',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: deliveryMemberAbsent,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'BeginDateTime', displayName: 'زمان شروع', sortable: true, isDate: true, type: 'date', visible: true },
                { name: 'EndDateTime', displayName: 'زمان پایان', sortable: true, isDate: true, type: 'date', visible: true },
                { name: 'ServiceTimeMinute', displayName: 'زمان سرویس (دقیقه)', sortable: true, type: 'integer', visible: true } 
            ]
        }
    }
    deliveryMemberAbsent.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkAppointmentDateId', displayName: 'کد سیستمی اعلام روز', sortable: true, type: 'integer', visible: true },
            { name: 'virtual_AppointmentDate.AllowUserToCreateDetailInOrder', displayName: 'کاربر اجازه ایجاد سفارش دارد؟', sortable: true, type: 'string', visible: true },
            { name: 'BeginDate', displayName: 'شروع سرویس', sortable: true, isDate: true, type: 'date', visible: true },
            { name: 'EndDate', displayName: 'پایان سرویس', sortable: true, isDate: true, type: 'date', visible: true },
            { name: 'SessionStatusTitle', displayName: 'وضعیت سرویس', sortable: true, type: 'string', visible: true }
        ],
        data: {},
        multiSelect: false,
        BeginDate: moment().format(),
        advancedSearchData: {
            engine: {}
        }
    }

    deliveryMemberAbsent.gridOptions.advancedSearchData = {};
    deliveryMemberAbsent.gridOptions.advancedSearchData.engine = {};
    deliveryMemberAbsent.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    deliveryMemberAbsent.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    deliveryMemberAbsent.gridOptions.advancedSearchData.engine.SortType = 1;
    deliveryMemberAbsent.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    deliveryMemberAbsent.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    deliveryMemberAbsent.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    deliveryMemberAbsent.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    deliveryMemberAbsent.gridOptions.advancedSearchData.engine.Filters = [];

    deliveryMemberAbsent.gridOptions.reGetAll = function () {
        deliveryMemberAbsent.init();
    }

    deliveryMemberAbsent.gridOptions.onRowSelected = function () {

    }

    deliveryMemberAbsent.columnCheckbox = false;
    deliveryMemberAbsent.openGridUserTypeModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (deliveryMemberAbsent.gridOptions.columnCheckbox) {
            for (var i = 0; i < deliveryMemberAbsent.gridOptions.columns.length; i++) {
                //deliveryMemberAbsent.gridOptions.columns[i].visible = $("#" + deliveryMemberAbsent.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + deliveryMemberAbsent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                deliveryMemberAbsent.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = deliveryMemberAbsent.gridOptions.columns;
            for (var i = 0; i < deliveryMemberAbsent.gridOptions.columns.length; i++) {
                deliveryMemberAbsent.gridOptions.columns[i].visible = true;
                var element = $("#" + deliveryMemberAbsent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + deliveryMemberAbsent.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < deliveryMemberAbsent.gridOptions.columns.length; i++) {
            console.log(deliveryMemberAbsent.gridOptions.columns[i].name.concat(".visible: "), deliveryMemberAbsent.gridOptions.columns[i].visible);
        }
        deliveryMemberAbsent.gridOptions.columnCheckbox = !deliveryMemberAbsent.gridOptions.columnCheckbox;
    }

    deliveryMemberAbsent.openSetTimesModal = function (dateId) {
        deliveryMemberAbsent.modalTitle = 'تنظیمات';
        $modal.open({
            templateUrl: 'cpanelv1/ModuleDelivery/DeliveryMemberAbsent/setTimes.html',
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


    //deliveryMemberAbsent.setTime = function (hour, min) {
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
    deliveryMemberAbsent.exportFile = function () {
        deliveryMemberAbsent.addRequested = true;
        deliveryMemberAbsent.gridOptions.advancedSearchData.engine.ExportFile = deliveryMemberAbsent.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMemberAbsent/exportfile', deliveryMemberAbsent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            deliveryMemberAbsent.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                deliveryMemberAbsent.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //deliveryMemberAbsent.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    deliveryMemberAbsent.toggleExportForm = function () {
        deliveryMemberAbsent.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        deliveryMemberAbsent.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        deliveryMemberAbsent.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        deliveryMemberAbsent.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        deliveryMemberAbsent.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleDelivery/DeliveryMemberAbsent/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    deliveryMemberAbsent.rowCountChanged = function () {
        if (!angular.isDefined(deliveryMemberAbsent.ExportFileClass.RowCount) || deliveryMemberAbsent.ExportFileClass.RowCount > 5000)
            deliveryMemberAbsent.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    deliveryMemberAbsent.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"DeliveryMemberAbsent/count", deliveryMemberAbsent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            deliveryMemberAbsent.addRequested = false;
            rashaErManage.checkAction(response);
            deliveryMemberAbsent.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            deliveryMemberAbsent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

