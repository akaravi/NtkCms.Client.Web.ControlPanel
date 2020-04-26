app.controller("deliveryMemberController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {

    var deliveryMember = this;


    deliveryMember.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var todayDate = moment().format();
    //appDate.datePickerConfig = {
    //    defaultDate: todayDate
    //};
    deliveryMember.StartDate = {
        defaultDate: todayDate,
        viewTimePicker: true
    }

    deliveryMember.EndDate = {
        defaultDate: todayDate,
        viewTimePicker: true
    }

    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    deliveryMember.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "deliveryMemberController") {
            localStorage.setItem('AddRequest', '');
            deliveryMember.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }



    if (itemRecordStatus != undefined) deliveryMember.itemRecordStatus = itemRecordStatus;

    deliveryMember.init = function () {
        deliveryMember.busyIndicator.isActive = true;



        var engine = {};
        try {
            engine = deliveryMember.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        
        ajax.call(cmsServerConfig.configApiServerPath+"DeliveryMember/getall", deliveryMember.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            deliveryMember.busyIndicator.isActive = false;
            deliveryMember.ListItems = response.ListItems;
            
            // Call Excerpt Function to shorten the length of long strings
            deliveryMember.gridOptions.fillData(deliveryMember.ListItems, response.resultAccess);
            deliveryMember.gridOptions.currentPageNumber = response.CurrentPageNumber;
            deliveryMember.gridOptions.totalRowCount = response.TotalRowCount;
            deliveryMember.gridOptions.rowPerPage = response.RowPerPage;
            deliveryMember.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            deliveryMember.busyIndicator.isActive = false;
            deliveryMember.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            });

        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        deliveryMember.checkRequestAddNewItemFromOtherControl(null);
    }
    deliveryMember.setSessionStatusEnum = function (listItems, enumList) {
        angular.forEach(listItems, function (item, property) {
            angular.forEach(enumList, function (value, key) {
                if (item.SessionStatus == value.Value)
                    item.SessionStatusTitle = value.Description;
            });
        });
    }
    //deliveryMember.StartDateTime = null;
    //deliveryMember.EndDateTime = null;
    // Open Add Modal
    deliveryMember.busyIndicator.isActive = true;
    deliveryMember.addRequested = false;
    deliveryMember.openAddModal = function () {
        deliveryMember.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMember/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            deliveryMember.busyIndicator.isActive = false;
            deliveryMember.selectedItem = response.Item;
            //var date = sqlToJsDate(response.Item.StartDateTime);
            //deliveryMember.StartDateTime = deliveryMember.setTime(8, 30);
            //deliveryMember.EndDateTime = deliveryMember.setTime(13, 30);
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDelivery/DeliveryMember/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            deliveryMember.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    deliveryMember.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        deliveryMember.busyIndicator.isActive = true;
        deliveryMember.addRequested = true;
        //------------- deliveryMember.setTimeBeforeAdd
        //deliveryMember.selectedItem.StartDateTime = jsToSqlDate(deliveryMember.StartDateTime); didn't work
        //deliveryMember.selectedItem.EndDateTime = jsToSqlDate(deliveryMember.EndDateTime);
        //deliveryMember.selectedItem.StartDateTime = deliveryMember.StartDateTime;
        //deliveryMember.selectedItem.EndDateTime = deliveryMember.EndDateTime;

        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMember/add', deliveryMember.selectedItem, 'POST').success(function (response) {
            deliveryMember.addRequested = false;
            deliveryMember.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                deliveryMember.checkRequestAddNewItemFromOtherControl(response.Item.Id);

                deliveryMember.ListItems.unshift(response.Item);
                deliveryMember.gridOptions.fillData(deliveryMember.ListItems);
                deliveryMember.setSessionStatusEnum(deliveryMember.ListItems, deliveryMember.SessionStatusEnum);
                deliveryMember.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            deliveryMember.busyIndicator.isActive = false;
            deliveryMember.addRequested = false;
        });
    }

    // Open Edit Modal
    deliveryMember.openEditModal = function () {
        deliveryMember.modalTitle = 'ویرایش';
        if (!deliveryMember.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMember/GetOne', deliveryMember.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            deliveryMember.selectedItem = response.Item;
            deliveryMember.StartDate.defaultDate = deliveryMember.selectedItem.StartDate;
            deliveryMember.EndDate.defaultDate = deliveryMember.selectedItem.EndDate;
            //deliveryMember.Date.defaultDate = deliveryMember.selectedItem.Date;
            //deliveryMember.StartDateTime = deliveryMember.selectedItem.StartDateTime.getHours();
            //deliveryMember.EndDateTime = deliveryMember.selectedItem.EndDateTime.getHours();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDelivery/DeliveryMember/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    deliveryMember.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        deliveryMember.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMember/edit', deliveryMember.selectedItem, 'PUT').success(function (response) {
            deliveryMember.addRequested = true;
            rashaErManage.checkAction(response);
            deliveryMember.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                deliveryMember.addRequested = false;
                deliveryMember.replaceItem(deliveryMember.selectedItem.Id, response.Item);
                deliveryMember.gridOptions.fillData(deliveryMember.ListItems);
                deliveryMember.setSessionStatusEnum(deliveryMember.ListItems, deliveryMember.SessionStatusEnum);
                deliveryMember.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            deliveryMember.addRequested = false;
            deliveryMember.busyIndicator.isActive = false;

        });
    }

    deliveryMember.closeModal = function () {
        $modalStack.dismissAll();
    };

    deliveryMember.replaceItem = function (oldId, newItem) {
        angular.forEach(deliveryMember.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = deliveryMember.ListItems.indexOf(item);
                deliveryMember.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            deliveryMember.ListItems.unshift(newItem);
    }

    // Delete
    deliveryMember.deleteRow = function () {
        if (!deliveryMember.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                deliveryMember.busyIndicator.isActive = true;
                console.log(deliveryMember.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMember/GetOne', deliveryMember.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    deliveryMember.selectedItemForDelete = response.Item;
                    console.log(deliveryMember.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMember/delete', deliveryMember.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        deliveryMember.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            deliveryMember.replaceItem(deliveryMember.selectedItemForDelete.Id);
                            deliveryMember.gridOptions.fillData(deliveryMember.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        deliveryMember.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    deliveryMember.busyIndicator.isActive = false;

                });
            }
        });
    }

    deliveryMember.searchData = function () {
        deliveryMember.gridOptions.searchData();

    }
    deliveryMember.LinkExternalUserIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkExternalUserId',
        url: 'coreuser',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: deliveryMember,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Username', displayName: 'نام کاربری', sortable: true, type: 'string' },
                { name: 'Name', displayName: 'نام', sortable: true, type: 'string' },
                { name: 'LastName', displayName: 'نام خانوادگی', sortable: true, type: 'string' }
            ]
        }
    }
    deliveryMember.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkAppointmentDateId', displayName: 'کد سیستمی اعلام روز', sortable: true, type: 'integer', visible: true },
            { name: 'virtual_AppointmentDate.AllowUserToCreateDetailInOrder', displayName: 'کاربر اجازه ایجاد سفارش دارد؟', sortable: true, type: 'string', visible: true },
            { name: 'StartDate', displayName: 'شروع سرویس', sortable: true, isDate: true, type: 'date', visible: true },
            { name: 'EndDate', displayName: 'پایان سرویس', sortable: true, isDate: true, type: 'date', visible: true },
            { name: 'SessionStatusTitle', displayName: 'وضعیت سرویس', sortable: true, type: 'string', visible: true }
        ],
        data: {},
        multiSelect: false,
        startDate: moment().format(),
        advancedSearchData: {
            engine: {}
        }
    }

    deliveryMember.gridOptions.advancedSearchData = {};
    deliveryMember.gridOptions.advancedSearchData.engine = {};
    deliveryMember.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    deliveryMember.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    deliveryMember.gridOptions.advancedSearchData.engine.SortType = 1;
    deliveryMember.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    deliveryMember.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    deliveryMember.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    deliveryMember.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    deliveryMember.gridOptions.advancedSearchData.engine.Filters = [];

    deliveryMember.gridOptions.reGetAll = function () {
        deliveryMember.init();
    }

    deliveryMember.gridOptions.onRowSelected = function () {

    }

    deliveryMember.columnCheckbox = false;
    deliveryMember.openGridUserTypeModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (deliveryMember.gridOptions.columnCheckbox) {
            for (var i = 0; i < deliveryMember.gridOptions.columns.length; i++) {
                //deliveryMember.gridOptions.columns[i].visible = $("#" + deliveryMember.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + deliveryMember.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                deliveryMember.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = deliveryMember.gridOptions.columns;
            for (var i = 0; i < deliveryMember.gridOptions.columns.length; i++) {
                deliveryMember.gridOptions.columns[i].visible = true;
                var element = $("#" + deliveryMember.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + deliveryMember.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < deliveryMember.gridOptions.columns.length; i++) {
            console.log(deliveryMember.gridOptions.columns[i].name.concat(".visible: "), deliveryMember.gridOptions.columns[i].visible);
        }
        deliveryMember.gridOptions.columnCheckbox = !deliveryMember.gridOptions.columnCheckbox;
    }

    deliveryMember.openSetTimesModal = function (dateId) {
        deliveryMember.modalTitle = 'تنظیمات';
        $modal.open({
            templateUrl: 'cpanelv1/ModuleDelivery/DeliveryMember/setTimes.html',
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


    //deliveryMember.setTime = function (hour, min) {
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
    deliveryMember.exportFile = function () {
        deliveryMember.addRequested = true;
        deliveryMember.gridOptions.advancedSearchData.engine.ExportFile = deliveryMember.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMember/exportfile', deliveryMember.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            deliveryMember.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                deliveryMember.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //deliveryMember.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    deliveryMember.toggleExportForm = function () {
        deliveryMember.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        deliveryMember.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        deliveryMember.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        deliveryMember.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        deliveryMember.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleDelivery/DeliveryMember/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    deliveryMember.rowCountChanged = function () {
        if (!angular.isDefined(deliveryMember.ExportFileClass.RowCount) || deliveryMember.ExportFileClass.RowCount > 5000)
            deliveryMember.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    deliveryMember.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"DeliveryMember/count", deliveryMember.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            deliveryMember.addRequested = false;
            rashaErManage.checkAction(response);
            deliveryMember.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            deliveryMember.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

