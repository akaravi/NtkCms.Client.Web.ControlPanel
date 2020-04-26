app.controller("deliveryMemberSettingController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {

    var deliveryMemberSetting = this;


    deliveryMemberSetting.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var todayDate = moment().format();
    //appDate.datePickerConfig = {
    //    defaultDate: todayDate
    //};
    deliveryMemberSetting.BeginTime = {
        defaultDate: todayDate,
        //viewTimePicker: true
    }

 

    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    deliveryMemberSetting.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "deliveryMemberSettingController") {
            localStorage.setItem('AddRequest', '');
            deliveryMemberSetting.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }



    if (itemRecordStatus != undefined) deliveryMemberSetting.itemRecordStatus = itemRecordStatus;

    deliveryMemberSetting.init = function () {
        deliveryMemberSetting.busyIndicator.isActive = true;



        var engine = {};
        try {
            engine = deliveryMemberSetting.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        
        ajax.call(cmsServerConfig.configApiServerPath+"DeliveryMemberSetting/getall", deliveryMemberSetting.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            deliveryMemberSetting.busyIndicator.isActive = false;
            deliveryMemberSetting.ListItems = response.ListItems;
            
            // Call Excerpt Function to shorten the length of long strings
            deliveryMemberSetting.gridOptions.fillData(deliveryMemberSetting.ListItems, response.resultAccess);
            deliveryMemberSetting.gridOptions.currentPageNumber = response.CurrentPageNumber;
            deliveryMemberSetting.gridOptions.totalRowCount = response.TotalRowCount;
            deliveryMemberSetting.gridOptions.rowPerPage = response.RowPerPage;
            deliveryMemberSetting.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            deliveryMemberSetting.busyIndicator.isActive = false;
            deliveryMemberSetting.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            });

        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        deliveryMemberSetting.checkRequestAddNewItemFromOtherControl(null);
    }
    deliveryMemberSetting.setSessionStatusEnum = function (listItems, enumList) {
        angular.forEach(listItems, function (item, property) {
            angular.forEach(enumList, function (value, key) {
                if (item.SessionStatus == value.Value)
                    item.SessionStatusTitle = value.Description;
            });
        });
    }
    //deliveryMemberSetting.StartDateTime = null;
    //deliveryMemberSetting.EndDateTime = null;
    // Open Add Modal
    deliveryMemberSetting.busyIndicator.isActive = true;
    deliveryMemberSetting.addRequested = false;
    deliveryMemberSetting.openAddModal = function () {
        deliveryMemberSetting.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMemberSetting/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            deliveryMemberSetting.busyIndicator.isActive = false;
            deliveryMemberSetting.selectedItem = response.Item;
            //var date = sqlToJsDate(response.Item.StartDateTime);
            //deliveryMemberSetting.StartDateTime = deliveryMemberSetting.setTime(8, 30);
            //deliveryMemberSetting.EndDateTime = deliveryMemberSetting.setTime(13, 30);
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDelivery/DeliveryMemberSetting/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            deliveryMemberSetting.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    deliveryMemberSetting.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        deliveryMemberSetting.busyIndicator.isActive = true;
        deliveryMemberSetting.addRequested = true;
        //------------- deliveryMemberSetting.setTimeBeforeAdd
        //deliveryMemberSetting.selectedItem.StartDateTime = jsToSqlDate(deliveryMemberSetting.StartDateTime); didn't work
        //deliveryMemberSetting.selectedItem.EndDateTime = jsToSqlDate(deliveryMemberSetting.EndDateTime);
        //deliveryMemberSetting.selectedItem.StartDateTime = deliveryMemberSetting.StartDateTime;
        //deliveryMemberSetting.selectedItem.EndDateTime = deliveryMemberSetting.EndDateTime;

        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMemberSetting/add', deliveryMemberSetting.selectedItem, 'POST').success(function (response) {
            deliveryMemberSetting.addRequested = false;
            deliveryMemberSetting.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                deliveryMemberSetting.checkRequestAddNewItemFromOtherControl(response.Item.Id);

                deliveryMemberSetting.ListItems.unshift(response.Item);
                deliveryMemberSetting.gridOptions.fillData(deliveryMemberSetting.ListItems);
                deliveryMemberSetting.setSessionStatusEnum(deliveryMemberSetting.ListItems, deliveryMemberSetting.SessionStatusEnum);
                deliveryMemberSetting.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            deliveryMemberSetting.busyIndicator.isActive = false;
            deliveryMemberSetting.addRequested = false;
        });
    }

    // Open Edit Modal
    deliveryMemberSetting.openEditModal = function () {
        deliveryMemberSetting.modalTitle = 'ویرایش';
        if (!deliveryMemberSetting.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMemberSetting/GetOne', deliveryMemberSetting.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            deliveryMemberSetting.selectedItem = response.Item;
            deliveryMemberSetting.BeginTime.defaultDate = deliveryMemberSetting.selectedItem.BeginTime;
            deliveryMemberSetting.EndService.defaultDate = deliveryMemberSetting.selectedItem.EndService;
            //deliveryMemberSetting.Date.defaultDate = deliveryMemberSetting.selectedItem.Date;
            //deliveryMemberSetting.StartDateTime = deliveryMemberSetting.selectedItem.StartDateTime.getHours();
            //deliveryMemberSetting.EndDateTime = deliveryMemberSetting.selectedItem.EndDateTime.getHours();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDelivery/DeliveryMemberSetting/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    deliveryMemberSetting.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        deliveryMemberSetting.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMemberSetting/edit', deliveryMemberSetting.selectedItem, 'PUT').success(function (response) {
            deliveryMemberSetting.addRequested = true;
            rashaErManage.checkAction(response);
            deliveryMemberSetting.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                deliveryMemberSetting.addRequested = false;
                deliveryMemberSetting.replaceItem(deliveryMemberSetting.selectedItem.Id, response.Item);
                deliveryMemberSetting.gridOptions.fillData(deliveryMemberSetting.ListItems);
                deliveryMemberSetting.setSessionStatusEnum(deliveryMemberSetting.ListItems, deliveryMemberSetting.SessionStatusEnum);
                deliveryMemberSetting.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            deliveryMemberSetting.addRequested = false;
            deliveryMemberSetting.busyIndicator.isActive = false;

        });
    }

    deliveryMemberSetting.closeModal = function () {
        $modalStack.dismissAll();
    };

    deliveryMemberSetting.replaceItem = function (oldId, newItem) {
        angular.forEach(deliveryMemberSetting.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = deliveryMemberSetting.ListItems.indexOf(item);
                deliveryMemberSetting.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            deliveryMemberSetting.ListItems.unshift(newItem);
    }

    // Delete
    deliveryMemberSetting.deleteRow = function () {
        if (!deliveryMemberSetting.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                deliveryMemberSetting.busyIndicator.isActive = true;
                console.log(deliveryMemberSetting.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMemberSetting/GetOne', deliveryMemberSetting.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    deliveryMemberSetting.selectedItemForDelete = response.Item;
                    console.log(deliveryMemberSetting.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMemberSetting/delete', deliveryMemberSetting.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        deliveryMemberSetting.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            deliveryMemberSetting.replaceItem(deliveryMemberSetting.selectedItemForDelete.Id);
                            deliveryMemberSetting.gridOptions.fillData(deliveryMemberSetting.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        deliveryMemberSetting.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    deliveryMemberSetting.busyIndicator.isActive = false;

                });
            }
        });
    }

    deliveryMemberSetting.searchData = function () {
        deliveryMemberSetting.gridOptions.searchData();

    }
    deliveryMemberSetting.LinkDeliveryMemberIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkDeliveryMemberId',
        url: 'DeliveryMember',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: deliveryMemberSetting,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
               
            ]
        }
    }
    deliveryMemberSetting.LinkDeliveryMethodDetailIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkDeliveryMethodDetailId',
        url: 'DeliveryMethodDetail',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: deliveryMemberSetting,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            ]
        }
    }
    deliveryMemberSetting.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkAppointmentDateId', displayName: 'کد سیستمی اعلام روز', sortable: true, type: 'integer', visible: true },
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

    deliveryMemberSetting.gridOptions.advancedSearchData = {};
    deliveryMemberSetting.gridOptions.advancedSearchData.engine = {};
    deliveryMemberSetting.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    deliveryMemberSetting.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    deliveryMemberSetting.gridOptions.advancedSearchData.engine.SortType = 1;
    deliveryMemberSetting.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    deliveryMemberSetting.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    deliveryMemberSetting.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    deliveryMemberSetting.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    deliveryMemberSetting.gridOptions.advancedSearchData.engine.Filters = [];

    deliveryMemberSetting.gridOptions.reGetAll = function () {
        deliveryMemberSetting.init();
    }

    deliveryMemberSetting.gridOptions.onRowSelected = function () {

    }

    deliveryMemberSetting.columnCheckbox = false;
    deliveryMemberSetting.openGridUserTypeModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (deliveryMemberSetting.gridOptions.columnCheckbox) {
            for (var i = 0; i < deliveryMemberSetting.gridOptions.columns.length; i++) {
                //deliveryMemberSetting.gridOptions.columns[i].visible = $("#" + deliveryMemberSetting.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + deliveryMemberSetting.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                deliveryMemberSetting.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = deliveryMemberSetting.gridOptions.columns;
            for (var i = 0; i < deliveryMemberSetting.gridOptions.columns.length; i++) {
                deliveryMemberSetting.gridOptions.columns[i].visible = true;
                var element = $("#" + deliveryMemberSetting.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + deliveryMemberSetting.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < deliveryMemberSetting.gridOptions.columns.length; i++) {
            console.log(deliveryMemberSetting.gridOptions.columns[i].name.concat(".visible: "), deliveryMemberSetting.gridOptions.columns[i].visible);
        }
        deliveryMemberSetting.gridOptions.columnCheckbox = !deliveryMemberSetting.gridOptions.columnCheckbox;
    }

    deliveryMemberSetting.openSetTimesModal = function (dateId) {
        deliveryMemberSetting.modalTitle = 'تنظیمات';
        $modal.open({
            templateUrl: 'cpanelv1/ModuleDelivery/DeliveryMemberSetting/setTimes.html',
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


    //deliveryMemberSetting.setTime = function (hour, min) {
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
    deliveryMemberSetting.exportFile = function () {
        deliveryMemberSetting.addRequested = true;
        deliveryMemberSetting.gridOptions.advancedSearchData.engine.ExportFile = deliveryMemberSetting.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMemberSetting/exportfile', deliveryMemberSetting.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            deliveryMemberSetting.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                deliveryMemberSetting.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //deliveryMemberSetting.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    deliveryMemberSetting.toggleExportForm = function () {
        deliveryMemberSetting.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        deliveryMemberSetting.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        deliveryMemberSetting.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        deliveryMemberSetting.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        deliveryMemberSetting.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleDelivery/DeliveryMemberSetting/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    deliveryMemberSetting.rowCountChanged = function () {
        if (!angular.isDefined(deliveryMemberSetting.ExportFileClass.RowCount) || deliveryMemberSetting.ExportFileClass.RowCount > 5000)
            deliveryMemberSetting.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    deliveryMemberSetting.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"DeliveryMemberSetting/count", deliveryMemberSetting.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            deliveryMemberSetting.addRequested = false;
            rashaErManage.checkAction(response);
            deliveryMemberSetting.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            deliveryMemberSetting.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

