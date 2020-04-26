app.controller("deliveryInvoiceController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {

    var deliveryInvoice = this;


    deliveryInvoice.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var todayDate = moment().format();
    //appDate.datePickerConfig = {
    //    defaultDate: todayDate
    //};
    deliveryInvoice.BeginTime = {
        defaultDate: todayDate,
        //viewTimePicker: true
    }

 

    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    deliveryInvoice.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "reservationAppointmentDateDetailController") {
            localStorage.setItem('AddRequest', '');
            deliveryInvoice.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }



    if (itemRecordStatus != undefined) deliveryInvoice.itemRecordStatus = itemRecordStatus;

    deliveryInvoice.init = function () {
        deliveryInvoice.busyIndicator.isActive = true;



        var engine = {};
        try {
            engine = deliveryInvoice.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        
        ajax.call(cmsServerConfig.configApiServerPath+"DeliveryInvoice/getall", deliveryInvoice.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            deliveryInvoice.busyIndicator.isActive = false;
            deliveryInvoice.ListItems = response.ListItems;
       
            // Call Excerpt Function to shorten the length of long strings
            deliveryInvoice.gridOptions.fillData(deliveryInvoice.ListItems, response.resultAccess);
            deliveryInvoice.gridOptions.currentPageNumber = response.CurrentPageNumber;
            deliveryInvoice.gridOptions.totalRowCount = response.TotalRowCount;
            deliveryInvoice.gridOptions.rowPerPage = response.RowPerPage;
            deliveryInvoice.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            deliveryInvoice.busyIndicator.isActive = false;
            deliveryInvoice.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            });

        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        deliveryInvoice.checkRequestAddNewItemFromOtherControl(null);
    }
    deliveryInvoice.setSessionStatusEnum = function (listItems, enumList) {
        angular.forEach(listItems, function (item, property) {
            angular.forEach(enumList, function (value, key) {
                if (item.SessionStatus == value.Value)
                    item.SessionStatusTitle = value.Description;
            });
        });
    }
    //deliveryInvoice.StartDateTime = null;
    //deliveryInvoice.EndDateTime = null;
    // Open Add Modal
    deliveryInvoice.busyIndicator.isActive = true;
    deliveryInvoice.addRequested = false;
    deliveryInvoice.openAddModal = function () {
        deliveryInvoice.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryInvoice/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            deliveryInvoice.busyIndicator.isActive = false;
            deliveryInvoice.selectedItem = response.Item;
            //var date = sqlToJsDate(response.Item.StartDateTime);
            //deliveryInvoice.StartDateTime = deliveryInvoice.setTime(8, 30);
            //deliveryInvoice.EndDateTime = deliveryInvoice.setTime(13, 30);
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDelivery/DeliveryInvoice/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            deliveryInvoice.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    deliveryInvoice.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        deliveryInvoice.busyIndicator.isActive = true;
        deliveryInvoice.addRequested = true;
        //------------- deliveryInvoice.setTimeBeforeAdd
        //deliveryInvoice.selectedItem.StartDateTime = jsToSqlDate(deliveryInvoice.StartDateTime); didn't work
        //deliveryInvoice.selectedItem.EndDateTime = jsToSqlDate(deliveryInvoice.EndDateTime);
        //deliveryInvoice.selectedItem.StartDateTime = deliveryInvoice.StartDateTime;
        //deliveryInvoice.selectedItem.EndDateTime = deliveryInvoice.EndDateTime;

        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryInvoice/add', deliveryInvoice.selectedItem, 'POST').success(function (response) {
            deliveryInvoice.addRequested = false;
            deliveryInvoice.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                deliveryInvoice.checkRequestAddNewItemFromOtherControl(response.Item.Id);

                deliveryInvoice.ListItems.unshift(response.Item);
                deliveryInvoice.gridOptions.fillData(deliveryInvoice.ListItems);
                deliveryInvoice.setSessionStatusEnum(deliveryInvoice.ListItems, deliveryInvoice.SessionStatusEnum);
                deliveryInvoice.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            deliveryInvoice.busyIndicator.isActive = false;
            deliveryInvoice.addRequested = false;
        });
    }

    // Open Edit Modal
    deliveryInvoice.openEditModal = function () {
        deliveryInvoice.modalTitle = 'ویرایش';
        if (!deliveryInvoice.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryInvoice/GetOne', deliveryInvoice.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            deliveryInvoice.selectedItem = response.Item;
            deliveryInvoice.BeginTime.defaultDate = deliveryInvoice.selectedItem.BeginTime;
            deliveryInvoice.EndService.defaultDate = deliveryInvoice.selectedItem.EndService;
            //deliveryInvoice.Date.defaultDate = deliveryInvoice.selectedItem.Date;
            //deliveryInvoice.StartDateTime = deliveryInvoice.selectedItem.StartDateTime.getHours();
            //deliveryInvoice.EndDateTime = deliveryInvoice.selectedItem.EndDateTime.getHours();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDelivery/DeliveryInvoice/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    deliveryInvoice.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        deliveryInvoice.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryInvoice/edit', deliveryInvoice.selectedItem, 'PUT').success(function (response) {
            deliveryInvoice.addRequested = true;
            rashaErManage.checkAction(response);
            deliveryInvoice.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                deliveryInvoice.addRequested = false;
                deliveryInvoice.replaceItem(deliveryInvoice.selectedItem.Id, response.Item);
                deliveryInvoice.gridOptions.fillData(deliveryInvoice.ListItems);
                deliveryInvoice.setSessionStatusEnum(deliveryInvoice.ListItems, deliveryInvoice.SessionStatusEnum);
                deliveryInvoice.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            deliveryInvoice.addRequested = false;
            deliveryInvoice.busyIndicator.isActive = false;

        });
    }

    deliveryInvoice.closeModal = function () {
        $modalStack.dismissAll();
    };

    deliveryInvoice.replaceItem = function (oldId, newItem) {
        angular.forEach(deliveryInvoice.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = deliveryInvoice.ListItems.indexOf(item);
                deliveryInvoice.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            deliveryInvoice.ListItems.unshift(newItem);
    }

    // Delete
    deliveryInvoice.deleteRow = function () {
        if (!deliveryInvoice.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                deliveryInvoice.busyIndicator.isActive = true;
                console.log(deliveryInvoice.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'DeliveryInvoice/GetOne', deliveryInvoice.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    deliveryInvoice.selectedItemForDelete = response.Item;
                    console.log(deliveryInvoice.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'DeliveryInvoice/delete', deliveryInvoice.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        deliveryInvoice.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            deliveryInvoice.replaceItem(deliveryInvoice.selectedItemForDelete.Id);
                            deliveryInvoice.gridOptions.fillData(deliveryInvoice.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        deliveryInvoice.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    deliveryInvoice.busyIndicator.isActive = false;

                });
            }
        });
    }

    deliveryInvoice.searchData = function () {
        deliveryInvoice.gridOptions.searchData();

    }
    deliveryInvoice.LinkExternalModuleShopInvoiceIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkExternalModuleShopInvoiceId',
        url: 'ShopInvoiceSale',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: deliveryInvoice,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'TotalAmount', displayName: 'مبلغ', sortable: true, type: 'string', visible: true },
                { name: 'InvoiceStatus', displayName: 'وضعیت', sortable: true, type: 'string', isDate: true, visible: true }
            ]
        }
    }
    deliveryInvoice.LinkDeliveryMemberSettingIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkDeliveryMemberSettingId',
        url: 'DeliveryMemberSetting',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: deliveryInvoice,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            ]
        }
    }
    deliveryInvoice.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkExternalModuleShopInvoiceId', displayName: 'کد سیستمی اعلام روز', sortable: true, type: 'integer', visible: true },
            { name: 'virtual_AppointmentDate.AllowUserToCreateDetailInOrder', displayName: 'کاربر اجازه ایجاد سفارش دارد؟', sortable: true, type: 'string', visible: true },
            { name: 'BeginTime', displayName: 'تاریخ شروع پخش', sortable: true, isDate: true, type: 'date', visible: true },
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

    deliveryInvoice.gridOptions.advancedSearchData = {};
    deliveryInvoice.gridOptions.advancedSearchData.engine = {};
    deliveryInvoice.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    deliveryInvoice.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    deliveryInvoice.gridOptions.advancedSearchData.engine.SortType = 1;
    deliveryInvoice.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    deliveryInvoice.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    deliveryInvoice.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    deliveryInvoice.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    deliveryInvoice.gridOptions.advancedSearchData.engine.Filters = [];

    deliveryInvoice.gridOptions.reGetAll = function () {
        deliveryInvoice.init();
    }

    deliveryInvoice.gridOptions.onRowSelected = function () {

    }

    deliveryInvoice.columnCheckbox = false;
    deliveryInvoice.openGridUserTypeModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (deliveryInvoice.gridOptions.columnCheckbox) {
            for (var i = 0; i < deliveryInvoice.gridOptions.columns.length; i++) {
                //deliveryInvoice.gridOptions.columns[i].visible = $("#" + deliveryInvoice.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + deliveryInvoice.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                deliveryInvoice.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = deliveryInvoice.gridOptions.columns;
            for (var i = 0; i < deliveryInvoice.gridOptions.columns.length; i++) {
                deliveryInvoice.gridOptions.columns[i].visible = true;
                var element = $("#" + deliveryInvoice.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + deliveryInvoice.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < deliveryInvoice.gridOptions.columns.length; i++) {
            console.log(deliveryInvoice.gridOptions.columns[i].name.concat(".visible: "), deliveryInvoice.gridOptions.columns[i].visible);
        }
        deliveryInvoice.gridOptions.columnCheckbox = !deliveryInvoice.gridOptions.columnCheckbox;
    }

    deliveryInvoice.openSetTimesModal = function (dateId) {
        deliveryInvoice.modalTitle = 'تنظیمات';
        $modal.open({
            templateUrl: 'cpanelv1/ModuleDelivery/DeliveryInvoice/setTimes.html',
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


    //deliveryInvoice.setTime = function (hour, min) {
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
    deliveryInvoice.exportFile = function () {
        deliveryInvoice.addRequested = true;
        deliveryInvoice.gridOptions.advancedSearchData.engine.ExportFile = deliveryInvoice.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryInvoice/exportfile', deliveryInvoice.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            deliveryInvoice.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                deliveryInvoice.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //deliveryInvoice.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    deliveryInvoice.toggleExportForm = function () {
        deliveryInvoice.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        deliveryInvoice.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        deliveryInvoice.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        deliveryInvoice.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        deliveryInvoice.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleDelivery/DeliveryInvoice/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    deliveryInvoice.rowCountChanged = function () {
        if (!angular.isDefined(deliveryInvoice.ExportFileClass.RowCount) || deliveryInvoice.ExportFileClass.RowCount > 5000)
            deliveryInvoice.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    deliveryInvoice.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"DeliveryInvoice/count", deliveryInvoice.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            deliveryInvoice.addRequested = false;
            rashaErManage.checkAction(response);
            deliveryInvoice.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            deliveryInvoice.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

