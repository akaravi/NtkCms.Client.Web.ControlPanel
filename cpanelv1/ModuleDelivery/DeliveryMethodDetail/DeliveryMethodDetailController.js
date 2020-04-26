app.controller("deliveryMethodDetailController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {

    var deliveryMethodDetail = this;


    deliveryMethodDetail.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var todayDate = moment().format();
    //appDate.datePickerConfig = {
    //    defaultDate: todayDate
    //};
    deliveryMethodDetail.EstimateTime = {
        defaultDate: todayDate,
        viewTimePicker: true
    }

 

    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    deliveryMethodDetail.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "deliveryMethodDetailController") {
            localStorage.setItem('AddRequest', '');
            deliveryMethodDetail.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }



    if (itemRecordStatus != undefined) deliveryMethodDetail.itemRecordStatus = itemRecordStatus;

    deliveryMethodDetail.init = function () {
        deliveryMethodDetail.busyIndicator.isActive = true;



        var engine = {};
        try {
            engine = deliveryMethodDetail.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        
        ajax.call(cmsServerConfig.configApiServerPath+"DeliveryMethodDetail/getall", deliveryMethodDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            deliveryMethodDetail.busyIndicator.isActive = false;
            deliveryMethodDetail.ListItems = response.ListItems;
            
            // Call Excerpt Function to shorten the length of long strings
            deliveryMethodDetail.gridOptions.fillData(deliveryMethodDetail.ListItems, response.resultAccess);
            deliveryMethodDetail.gridOptions.currentPageNumber = response.CurrentPageNumber;
            deliveryMethodDetail.gridOptions.totalRowCount = response.TotalRowCount;
            deliveryMethodDetail.gridOptions.rowPerPage = response.RowPerPage;
            deliveryMethodDetail.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            deliveryMethodDetail.busyIndicator.isActive = false;
            deliveryMethodDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            });

        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        deliveryMethodDetail.checkRequestAddNewItemFromOtherControl(null);
    }
    deliveryMethodDetail.setSessionStatusEnum = function (listItems, enumList) {
        angular.forEach(listItems, function (item, property) {
            angular.forEach(enumList, function (value, key) {
                if (item.SessionStatus == value.Value)
                    item.SessionStatusTitle = value.Description;
            });
        });
    }
    //deliveryMethodDetail.StartDateTime = null;
    //deliveryMethodDetail.EndDateTime = null;
    // Open Add Modal
    deliveryMethodDetail.busyIndicator.isActive = true;
    deliveryMethodDetail.addRequested = false;
    deliveryMethodDetail.openAddModal = function () {
        deliveryMethodDetail.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMethodDetail/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            deliveryMethodDetail.busyIndicator.isActive = false;
            deliveryMethodDetail.selectedItem = response.Item;
            //var date = sqlToJsDate(response.Item.StartDateTime);
            //deliveryMethodDetail.StartDateTime = deliveryMethodDetail.setTime(8, 30);
            //deliveryMethodDetail.EndDateTime = deliveryMethodDetail.setTime(13, 30);
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDelivery/DeliveryMethodDetail/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            deliveryMethodDetail.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    deliveryMethodDetail.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        deliveryMethodDetail.busyIndicator.isActive = true;
        deliveryMethodDetail.addRequested = true;
        //------------- deliveryMethodDetail.setTimeBeforeAdd
        //deliveryMethodDetail.selectedItem.StartDateTime = jsToSqlDate(deliveryMethodDetail.StartDateTime); didn't work
        //deliveryMethodDetail.selectedItem.EndDateTime = jsToSqlDate(deliveryMethodDetail.EndDateTime);
        //deliveryMethodDetail.selectedItem.StartDateTime = deliveryMethodDetail.StartDateTime;
        //deliveryMethodDetail.selectedItem.EndDateTime = deliveryMethodDetail.EndDateTime;

        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMethodDetail/add', deliveryMethodDetail.selectedItem, 'POST').success(function (response) {
            deliveryMethodDetail.addRequested = false;
            deliveryMethodDetail.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                deliveryMethodDetail.checkRequestAddNewItemFromOtherControl(response.Item.Id);

                deliveryMethodDetail.ListItems.unshift(response.Item);
                deliveryMethodDetail.gridOptions.fillData(deliveryMethodDetail.ListItems);
                deliveryMethodDetail.setSessionStatusEnum(deliveryMethodDetail.ListItems, deliveryMethodDetail.SessionStatusEnum);
                deliveryMethodDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            deliveryMethodDetail.busyIndicator.isActive = false;
            deliveryMethodDetail.addRequested = false;
        });
    }

    // Open Edit Modal
    deliveryMethodDetail.openEditModal = function () {
        deliveryMethodDetail.modalTitle = 'ویرایش';
        if (!deliveryMethodDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMethodDetail/GetOne', deliveryMethodDetail.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            deliveryMethodDetail.selectedItem = response.Item;
            deliveryMethodDetail.EstimateTime.defaultDate = deliveryMethodDetail.selectedItem.EstimateTime;
            deliveryMethodDetail.EndService.defaultDate = deliveryMethodDetail.selectedItem.EndService;
            //deliveryMethodDetail.Date.defaultDate = deliveryMethodDetail.selectedItem.Date;
            //deliveryMethodDetail.StartDateTime = deliveryMethodDetail.selectedItem.StartDateTime.getHours();
            //deliveryMethodDetail.EndDateTime = deliveryMethodDetail.selectedItem.EndDateTime.getHours();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDelivery/DeliveryMethodDetail/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    deliveryMethodDetail.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        deliveryMethodDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMethodDetail/edit', deliveryMethodDetail.selectedItem, 'PUT').success(function (response) {
            deliveryMethodDetail.addRequested = true;
            rashaErManage.checkAction(response);
            deliveryMethodDetail.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                deliveryMethodDetail.addRequested = false;
                deliveryMethodDetail.replaceItem(deliveryMethodDetail.selectedItem.Id, response.Item);
                deliveryMethodDetail.gridOptions.fillData(deliveryMethodDetail.ListItems);
                deliveryMethodDetail.setSessionStatusEnum(deliveryMethodDetail.ListItems, deliveryMethodDetail.SessionStatusEnum);
                deliveryMethodDetail.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            deliveryMethodDetail.addRequested = false;
            deliveryMethodDetail.busyIndicator.isActive = false;

        });
    }

    deliveryMethodDetail.closeModal = function () {
        $modalStack.dismissAll();
    };

    deliveryMethodDetail.replaceItem = function (oldId, newItem) {
        angular.forEach(deliveryMethodDetail.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = deliveryMethodDetail.ListItems.indexOf(item);
                deliveryMethodDetail.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            deliveryMethodDetail.ListItems.unshift(newItem);
    }

    // Delete
    deliveryMethodDetail.deleteRow = function () {
        if (!deliveryMethodDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                deliveryMethodDetail.busyIndicator.isActive = true;
                console.log(deliveryMethodDetail.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMethodDetail/GetOne', deliveryMethodDetail.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    deliveryMethodDetail.selectedItemForDelete = response.Item;
                    console.log(deliveryMethodDetail.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMethodDetail/delete', deliveryMethodDetail.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        deliveryMethodDetail.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            deliveryMethodDetail.replaceItem(deliveryMethodDetail.selectedItemForDelete.Id);
                            deliveryMethodDetail.gridOptions.fillData(deliveryMethodDetail.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        deliveryMethodDetail.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    deliveryMethodDetail.busyIndicator.isActive = false;

                });
            }
        });
    }

    deliveryMethodDetail.searchData = function () {
        deliveryMethodDetail.gridOptions.searchData();

    }
    deliveryMethodDetail.LinkExternalModuleShopProductIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkExternalModuleShopProductId',
        url: 'ShopContent',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: deliveryMethodDetail,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: 'true' }
            ]
        }
    }
    deliveryMethodDetail.LinkLocationIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkLocationId',
        url: 'CmsLocation',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'LinkLocationId',
        rowPerPage: 200,
        action: 'GetAllCities',
        scope: deliveryMethodDetail,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'virtual_Parent.Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
                { name: 'Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
            ]
        }
    }
    deliveryMethodDetail.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkAppointmentDateId', displayName: 'کد سیستمی اعلام روز', sortable: true, type: 'integer', visible: true },
            { name: 'virtual_AppointmentDate.AllowUserToCreateDetailInOrder', displayName: 'کاربر اجازه ایجاد سفارش دارد؟', sortable: true, type: 'string', visible: true },
            { name: 'EstimateTime', displayName: 'تاریخ شروع پخش', sortable: true, isDate: true, type: 'date', visible: true },
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

    deliveryMethodDetail.gridOptions.advancedSearchData = {};
    deliveryMethodDetail.gridOptions.advancedSearchData.engine = {};
    deliveryMethodDetail.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    deliveryMethodDetail.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    deliveryMethodDetail.gridOptions.advancedSearchData.engine.SortType = 1;
    deliveryMethodDetail.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    deliveryMethodDetail.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    deliveryMethodDetail.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    deliveryMethodDetail.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    deliveryMethodDetail.gridOptions.advancedSearchData.engine.Filters = [];

    deliveryMethodDetail.gridOptions.reGetAll = function () {
        deliveryMethodDetail.init();
    }

    deliveryMethodDetail.gridOptions.onRowSelected = function () {

    }

    deliveryMethodDetail.columnCheckbox = false;
    deliveryMethodDetail.openGridUserTypeModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (deliveryMethodDetail.gridOptions.columnCheckbox) {
            for (var i = 0; i < deliveryMethodDetail.gridOptions.columns.length; i++) {
                //deliveryMethodDetail.gridOptions.columns[i].visible = $("#" + deliveryMethodDetail.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + deliveryMethodDetail.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                deliveryMethodDetail.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = deliveryMethodDetail.gridOptions.columns;
            for (var i = 0; i < deliveryMethodDetail.gridOptions.columns.length; i++) {
                deliveryMethodDetail.gridOptions.columns[i].visible = true;
                var element = $("#" + deliveryMethodDetail.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + deliveryMethodDetail.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < deliveryMethodDetail.gridOptions.columns.length; i++) {
            console.log(deliveryMethodDetail.gridOptions.columns[i].name.concat(".visible: "), deliveryMethodDetail.gridOptions.columns[i].visible);
        }
        deliveryMethodDetail.gridOptions.columnCheckbox = !deliveryMethodDetail.gridOptions.columnCheckbox;
    }

    deliveryMethodDetail.openSetTimesModal = function (dateId) {
        deliveryMethodDetail.modalTitle = 'تنظیمات';
        $modal.open({
            templateUrl: 'cpanelv1/ModuleDelivery/DeliveryMethodDetail/setTimes.html',
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


    //deliveryMethodDetail.setTime = function (hour, min) {
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
    deliveryMethodDetail.exportFile = function () {
        deliveryMethodDetail.addRequested = true;
        deliveryMethodDetail.gridOptions.advancedSearchData.engine.ExportFile = deliveryMethodDetail.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'DeliveryMethodDetail/exportfile', deliveryMethodDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            deliveryMethodDetail.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                deliveryMethodDetail.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //deliveryMethodDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    deliveryMethodDetail.toggleExportForm = function () {
        deliveryMethodDetail.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        deliveryMethodDetail.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        deliveryMethodDetail.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        deliveryMethodDetail.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        deliveryMethodDetail.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleDelivery/DeliveryMethodDetail/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    deliveryMethodDetail.rowCountChanged = function () {
        if (!angular.isDefined(deliveryMethodDetail.ExportFileClass.RowCount) || deliveryMethodDetail.ExportFileClass.RowCount > 5000)
            deliveryMethodDetail.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    deliveryMethodDetail.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"DeliveryMethodDetail/count", deliveryMethodDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            deliveryMethodDetail.addRequested = false;
            rashaErManage.checkAction(response);
            deliveryMethodDetail.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            deliveryMethodDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

