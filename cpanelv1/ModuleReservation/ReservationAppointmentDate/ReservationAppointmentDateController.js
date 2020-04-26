app.controller("reservationAppDateController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $state, $filter) {

    var appDate = this;
    appDate.RouteUploadFileContent = cmsServerConfig.configRouteUploadFileContent;
    appDate.ShowService = true;
    appDate.selectedItemDetail = {};
    appDate.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    var todayDate = moment().format();
    //appDate.datePickerConfig = {
    //    defaultDate: todayDate
    //};
    appDate.StartDateTime = {
        defaultDate: todayDate,
        viewTimePicker: false
    }

    appDate.EndDateTime = {
        defaultDate: todayDate,
        viewTimePicker: false
    }
    appDate.filePickerFileReport = {
        isActive: true,
        backElement: 'filePickerFileReport',
        filename: null,
        fileId: null,
        extension: 'mrt',
        multiSelect: false,
    }


    /////////////////کدهای مربوط به جزییات//////////////////

    appDate.StartService = {
        defaultDate: todayDate,
        // viewTimePicker: true
    }
    appDate.ReservedLockedTime = {
        defaultDate: todayDate,
    }
    appDate.EndService = {
        defaultDate: todayDate,
        //viewTimePicker: true
    }
    //////////////////////////////////
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    appDate.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "reservationAppDateController") {
            localStorage.setItem('AddRequest', '');
            appDate.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    //appDate.testDate = moment().format();
    appDate.LinkReservationServiceIdSelector = {
        displayMember: 'Title',
        id: 'LinkReservationServiceId',
        fId: 'LinkReservationServiceId',
        url: 'reservationservice',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        scope: appDate,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true }
            ]
        }
    }
    appDate.LinkAppointmentDateIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkAppointmentDateId',
        url: 'ReservationAppointmentDate',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: appDate,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'StartDateTime', displayName: 'زمان شروع', sortable: true, isDate: true, type: 'date', visible: true },
                { name: 'EndDateTime', displayName: 'زمان پایان', sortable: true, isDate: true, type: 'date', visible: true },
                { name: 'ServiceTimeMinute', displayName: 'زمان سرویس (دقیقه)', sortable: true, type: 'integer', visible: true }
            ]
        }
    }
    appDate.LinkContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkContentId',
        url: 'reservationcontent',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        scope: appDate,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true }
            ]
        }
    }
    appDate.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkReservationServiceId', displayName: 'کد سیستمی سرویس', sortable: true, type: 'integer', visible: true },
            { name: 'virtual_Service.Title', displayName: 'عنوان سرویس', sortable: true, type: 'string', visible: true },
            { name: 'StartDateTime', displayName: 'زمان شروع', sortable: true, isDate: true, type: 'date', visible: true },
            { name: 'EndDateTime', displayName: 'زمان پایان', sortable: true, isDate: true, type: 'date', visible: true },
            { name: 'ServiceTimeMinute', displayName: 'زمان سرویس (دقیقه)', sortable: true, type: 'integer', visible: true },
            { name: "ActionKey", displayName: "لیست سفارشات", displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="appDate.OpenDateToReservationOrder(x.Id)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        startDate: moment().format(),
        advancedSearchData: {
            engine: {}
        }
    }

    appDate.gridOptions.advancedSearchData = {};
    appDate.gridOptions.advancedSearchData.engine = {};
    appDate.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    appDate.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    appDate.gridOptions.advancedSearchData.engine.SortType = 1;
    appDate.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    appDate.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    appDate.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    appDate.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    appDate.gridOptions.advancedSearchData.engine.Filters = [];

    appDate.gridOptions.reGetAll = function () {
        appDate.init();
    }

    appDate.gridOptions.onRowSelected = function () {

    }



    appDate.OpenDateDetailToReservationOrder = function (LinkAppointmentDateDetailId) {
        $state.go("index.reservationorder", {
            AppointmentDateDetailId: LinkAppointmentDateDetailId
        });
    }
    appDate.OpenDateToReservationOrder = function (LinkAppointmentDateId) {
        $state.go("index.reservationorder", {
            AppointmentDateId: LinkAppointmentDateId
        });
    }
    //#help //Datedetail Grid Options
    appDate.gridContentDateDetail = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkAppointmentDateId', displayName: 'کد سیستمی سرویس', sortable: true, type: 'integer', visible: true },
            { name: 'StartService', displayName: 'StartService', sortable: true, type: 'string', visible: true },
            { name: 'EndService', displayName: 'EndService', sortable: true, type: 'string', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: "ActionKey", displayName: "لیست سفارشات", displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="appDate.OpenDateDetailToReservationOrder(x.Id)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        showUserSearchPanel: false,
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
    //#help//
    if (itemRecordStatus != undefined) appDate.itemRecordStatus = itemRecordStatus;
    appDate.showGridDatedetail = false;
    appDate.init = function () {
        appDate.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = appDate.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }



        ajax.call(cmsServerConfig.configApiServerPath+"ReservationAppointmentDate/getall", appDate.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            appDate.busyIndicator.isActive = false;
            appDate.ListItemsDate = response.ListItems;
            //////////////مقداردهی مقادیر enum////////////////////
            ajax.call(cmsServerConfig.configApiServerPath+"ReservationAppointmentDate/getAllGenerateTypeEnum", {}, 'POST').success(function (response) {
                appDate.GenerateTypeEnum = response.ListItems;
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            ajax.call(cmsServerConfig.configApiServerPath+"ReservationAppointmentDate/getAllReservationType", {}, 'POST').success(function (response) {
                appDate.ReservationType = response.ListItems;
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            /////////////////////////////////
            // Call Excerpt Function to shorten the length of long strings
            appDate.gridOptions.fillData(appDate.ListItemsDate, response.resultAccess);
            appDate.gridOptions.currentPageNumber = response.CurrentPageNumber;
            appDate.gridOptions.totalRowCount = response.TotalRowCount;
            appDate.gridOptions.rowPerPage = response.RowPerPage;
            appDate.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            appDate.busyIndicator.isActive = false;
            appDate.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"ReservationAppointmentDateDetail/getall", appDate.gridContentDateDetail.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            appDate.busyIndicator.isActive = false;
            appDate.ListItemsDateDetail = response.ListItems;
            ajax.call(cmsServerConfig.configApiServerPath+"ReservationAppointmentDateDetail/getAllSessionStatusEnum", {}, 'POST').success(function (response) {
                appDate.SessionStatus = response.ListItems;
                appDate.setSessionStatusEnum(appDate.ListItemsDateDetail, appDate.SessionStatus);
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            // Call Excerpt Function to shorten the length of long strings
            appDate.gridContentDateDetail.fillData(appDate.ListItemsDateDetail, response.resultAccess);
            appDate.gridContentDateDetail.currentPageNumber = response.CurrentPageNumber;
            appDate.gridContentDateDetail.totalRowCount = response.TotalRowCount;
            appDate.gridContentDateDetail.rowPerPage = response.RowPerPage;
            appDate.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            appDate.busyIndicator.isActive = false;
            appDate.gridContentDateDetail.fillData();
            rashaErManage.checkAction(data, errCode);
        });


        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        appDate.checkRequestAddNewItemFromOtherControl(null);
    }

    /////////////////////////

    appDate.setSessionStatusEnum = function (listItems, enumList) {
        angular.forEach(listItems, function (item, property) {
            angular.forEach(enumList, function (value, key) {
                if (item.SessionStatus == value.Value)
                    item.SessionStatusTitle = value.Description;
            });
        });
    }
    //////////////list service fore date
    appDate.moveSelected = function () {


        if (appDate.selectedItem.AppointmentDateAllowServices == undefined)
            appDate.selectedItem.AppointmentDateAllowServices = [];
        for (var i = 0; i < appDate.selectedItem.AppointmentDateAllowServices.length; i++) {
            if (
              appDate.selectedItem.AppointmentDateAllowServices[i].LinkReservationServiceId ==
              appDate.selectedItem.LinkReservationServiceId
            ) {
                rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
                return;
            }
        }
        appDate.selectedItem.AppointmentDateAllowServices.push({
            LinkReservationServiceId: appDate.selectedItem.LinkReservationServiceId,
        });
    };

    appDate.removeFromCollection = function (listsimilar, index) {
        for (var i = 0; i < appDate.selectedItem.AppointmentDateAllowServices.length; i++) {
            appDate.selectedItem.AppointmentDateAllowServices.splice(index, 1);
            return;
        }
    }
    //////////////list service for detail
    appDate.moveSelectedDetail = function () {


        if (appDate.selectedItemDetail.AppointmentDateDetailAllowServices == undefined)
            appDate.selectedItemDetail.AppointmentDateDetailAllowServices = [];
        for (var i = 0; i < appDate.selectedItemDetail.AppointmentDateDetailAllowServices.length; i++) {
            if (
              appDate.selectedItemDetail.AppointmentDateDetailAllowServices[i].LinkReservationServiceId ==
              appDate.selectedItemDetail.LinkReservationServiceId
            ) {
                rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
                return;
            }
        }
        appDate.selectedItemDetail.AppointmentDateDetailAllowServices.push({
            LinkReservationServiceId: appDate.selectedItemDetail.LinkReservationServiceId,
        });
    };

    appDate.removeFromCollectionDetail = function (listsimilar, index) {
        for (var i = 0; i < appDate.selectedItemDetail.AppointmentDateDetailAllowServices.length; i++) {
            appDate.selectedItemDetail.AppointmentDateDetailAllowServices.splice(index, 1);
            return;
        }
    }
    ////////////////

    appDate.gridOptions.onRowSelected = function () {
        var item = appDate.gridOptions.selectedRow.item;
        appDate.selectedItemDetail.LinkAppointmentDateId = appDate.gridOptions.selectedRow.item.Id;
        if (appDate.gridOptions.selectedRow.item.AppointmentDateAllowServices.length > 0) {
            appDate.ShowService = false;
        }
        appDate.showDatedetail(item);
    }




    //#help// For Show Datedetails
    appDate.showDatedetail = function () {
        if (appDate.gridOptions.selectedRow.item) {
            //var id = appDate.gridOptions.selectedRow.item.Id;
            var Filter_value = {
                PropertyName: "LinkAppointmentDateId",
                IntValue1: appDate.gridOptions.selectedRow.item.Id,
                SearchType: 0
            }

            var engine2 = appDate.gridContentDateDetail.advancedSearchData.engine;
            engine2.Filters = null;
            engine2.Filters = [];
            engine2.Filters.push(Filter_value);


            ajax.call(cmsServerConfig.configApiServerPath+'ReservationAppointmentDateDetail/getall', engine2, 'POST').success(function (response) {
                appDate.listDateDetails = response.ListItems;
                //appDate.gridOptions.resultAccess = response.resultAccess; // دسترسی ها نمایش
                appDate.gridContentDateDetail.fillData(appDate.listDateDetails, response.resultAccess);
                appDate.gridContentDateDetail.currentPageNumber = response.CurrentPageNumber;
                appDate.gridContentDateDetail.totalRowCount = response.TotalRowCount;
                appDate.allowedSearch = response.AllowedSearchField;
                rashaErManage.checkAction(response);
                appDate.gridContentDateDetail.rowPerPage = response.RowPerPage;
                appDate.gridOptions.maxSize = 5;
                appDate.showGridDatedetail = true;
                appDate.Title = appDate.gridOptions.selectedRow.item.Title;
            });
        }
    }


    //appDate.StartDateTime = null;
    //appDate.EndDateTime = null;
    // Open Add Modal
    appDate.busyIndicator.isActive = true;
    appDate.addRequested = false;
    appDate.openAddModal = function () {

        appDate.filePickerFileReport.filename = "";
        appDate.filePickerFileReport.fileId = null;
        appDate.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'ReservationAppointmentDate/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            appDate.busyIndicator.isActive = false;
            appDate.selectedItem = response.Item;

            //var date = sqlToJsDate(response.Item.StartDateTime);

            $modal.open({
                templateUrl: 'cpanelv1/ModuleReservation/ReservationAppointmentDate/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appDate.busyIndicator.isActive = false;

        });
    }

    //////open add modal date detail
    appDate.busyIndicator.isActive = true;
    appDate.addRequested = false;
    appDate.openAddModalDetail = function () {
        appDate.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'ReservationAppointmentDateDetail/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            appDate.busyIndicator.isActive = false;
            appDate.selectedItemDetail = response.Item;
            //var date = sqlToJsDate(response.Item.StartDateTime);
            //appDate.StartDateTime = appDate.setTime(8, 30);
            //appDate.EndDateTime = appDate.setTime(13, 30);
            $modal.open({
                templateUrl: 'cpanelv1/ModuleReservation/ReservationAppointmentDate/addDetail.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appDate.busyIndicator.isActive = false;

        });
    }
    ////////////////

    // Add New Content
    appDate.addNewRow = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        appDate.busyIndicator.isActive = true;
        appDate.addRequested = true;
        //------------- appDate.setTimeBeforeAdd
        //appDate.selectedItem.StartDateTime = jsToSqlDate(appDate.StartDateTime); didn't work
        //appDate.selectedItem.EndDateTime = jsToSqlDate(appDate.EndDateTime);
        //appDate.selectedItem.StartDateTime = appDate.StartDateTime;
        //appDate.selectedItem.EndDateTime = appDate.EndDateTime;

        ajax.call(cmsServerConfig.configApiServerPath+'ReservationAppointmentDate/add', appDate.selectedItem, 'POST').success(function (response) {
            appDate.addRequested = false;
            appDate.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                appDate.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                appDate.ListItemsDate.unshift(response.Item);
                appDate.gridOptions.fillData(appDate.ListItemsDate);
                appDate.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appDate.busyIndicator.isActive = false;
            appDate.addRequested = false;
        });
    }

    //// add new content detail
    // Add New Content
    appDate.addNewRowDetail = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        appDate.busyIndicator.isActive = true;
        appDate.addRequested = true;
        //------------- appDate.setTimeBeforeAdd
        //appDate.selectedItemDetail.StartDateTime = jsToSqlDate(appDate.StartDateTime); didn't work
        //appDate.selectedItemDetail.EndDateTime = jsToSqlDate(appDate.EndDateTime);
        //appDate.selectedItemDetail.StartDateTime = appDate.StartDateTime;
        //appDate.selectedItemDetail.EndDateTime = appDate.EndDateTime;

        ajax.call(cmsServerConfig.configApiServerPath+'ReservationAppointmentDateDetail/add', appDate.selectedItemDetail, 'POST').success(function (response) {
            appDate.addRequested = false;
            appDate.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                appDate.checkRequestAddNewItemFromOtherControl(response.Item.Id);

                appDate.ListItemsDateDetail.unshift(response.Item);
                appDate.gridContentDateDetail.fillData(appDate.ListItemsDateDetail);
                appDate.setSessionStatusEnum(appDate.ListItemsDateDetail, appDate.SessionStatusEnum);
                appDate.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appDate.busyIndicator.isActive = false;
            appDate.addRequested = false;
        });
    }
    //////////////////////////////////


    // Open Edit Modal
    appDate.openEditModal = function () {
        appDate.modalTitle = 'ویرایش';
        if (!appDate.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'ReservationAppointmentDate/GetOne', appDate.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            appDate.selectedItem = response.Item;
            appDate.StartDateTime.defaultDate = appDate.selectedItem.StartDateTime;
            appDate.EndDateTime.defaultDate = appDate.selectedItem.EndDateTime;
            appDate.filePickerFileReport.filename = null;
            appDate.filePickerFileReport.fileId = null;
            if (response.Item.LinkFileReportId != null) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', response.Item.LinkFileReportId, 'GET').success(function (response2) {
                    appDate.filePickerFileReport.filename = response2.Item.FileName;
                    appDate.filePickerFileReport.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            //appDate.Date.defaultDate = appDate.selectedItem.Date;
            //appDate.StartDateTime = appDate.selectedItem.StartDateTime.getHours();
            //appDate.EndDateTime = appDate.selectedItem.EndDateTime.getHours();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleReservation/ReservationAppointmentDate/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Modal detail
    appDate.openEditModaldetail = function () {
        appDate.modalTitle = 'ویرایش';
        if (!appDate.gridContentDateDetail.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'ReservationAppointmentDateDetail/GetOne', appDate.gridContentDateDetail.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            appDate.selectedItemDetail = response.Item;
            appDate.StartService.defaultDate = appDate.selectedItemDetail.StartService;
            appDate.EndService.defaultDate = appDate.selectedItemDetail.EndService;
            appDate.EndService.ReservedLockedTime = appDate.selectedItemDetail.ReservedLockedTime;
            //appDate.Date.defaultDate = appDate.selectedItemDetail.Date;
            //appDate.StartDateTime = appDate.selectedItemDetail.StartDateTime.getHours();
            //appDate.EndDateTime = appDate.selectedItemDetail.EndDateTime.getHours();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleReservation/ReservationAppointmentDate/editDetail.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    /////////////


    // Edit a Content
    appDate.editRow = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        appDate.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ReservationAppointmentDate/edit', appDate.selectedItem, 'PUT').success(function (response) {
            appDate.addRequested = true;
            rashaErManage.checkAction(response);
            appDate.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                appDate.addRequested = false;
                appDate.replaceItemDate(appDate.selectedItem.Id, response.Item);
                appDate.gridOptions.fillData(appDate.ListItemsDate);
                appDate.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appDate.addRequested = false;
            appDate.busyIndicator.isActive = false;

        });
    }
    // Edit a Content detail
    appDate.editRowdetail = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        appDate.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ReservationAppointmentDateDetail/edit', appDate.selectedItemDetail, 'PUT').success(function (response) {
            appDate.addRequested = true;
            rashaErManage.checkAction(response);
            appDate.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                appDate.addRequested = false;
                appDate.replaceItemDetail(appDate.selectedItemDetail.Id, response.Item);
                appDate.gridContentDateDetail.fillData(appDate.ListItemsDateDetail);
                appDate.setSessionStatusEnum(appDate.ListItemsDateDetail, appDate.SessionStatusEnum);
                appDate.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appDate.addRequested = false;
            appDate.busyIndicator.isActive = false;

        });
    }
    ///////////////////////////



    appDate.closeModal = function () {
        $modalStack.dismissAll();
    };
    ///replace item date 
    appDate.replaceItemDate = function (oldId, newItem) {
        angular.forEach(appDate.ListItemsDate, function (item, key) {
            if (item.Id == oldId) {
                var index = appDate.ListItemsDate.indexOf(item);
                appDate.ListItemsDate.splice(index, 1);
            }
        });
        if (newItem)
            appDate.ListItemsDate.unshift(newItem);
    }



    ////replace item detail
    appDate.replaceItemDetail = function (oldId, newItem) {
        angular.forEach(appDate.ListItemsDateDetail, function (item, key) {
            if (item.Id == oldId) {
                var index = appDate.ListItemsDateDetail.indexOf(item);
                appDate.ListItemsDateDetail.splice(index, 1);
            }
        });
        if (newItem)
            appDate.ListItemsDateDetail.unshift(newItem);
    }

    // Delete date detail
    appDate.deleteRowDetail = function () {
        if (!appDate.gridContentDateDetail.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                appDate.busyIndicator.isActive = true;
                console.log(appDate.gridContentDateDetail.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'ReservationAppointmentDateDetail/GetOne', appDate.gridContentDateDetail.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    appDate.selectedItemForDelete = response.Item;
                    console.log(appDate.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ReservationAppointmentDateDetail/delete', appDate.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        appDate.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            appDate.replaceItemDetail(appDate.selectedItemForDelete.Id);
                            appDate.gridContentDateDetail.fillData(appDate.ListItemsDateDetail);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        appDate.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    appDate.busyIndicator.isActive = false;

                });
            }
        });
    }




    // Delete
    appDate.deleteRow = function () {
        if (!appDate.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                appDate.busyIndicator.isActive = true;
                console.log(appDate.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'ReservationAppointmentDate/GetOne', appDate.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    appDate.selectedItemForDelete = response.Item;
                    console.log(appDate.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ReservationAppointmentDate/delete', appDate.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        appDate.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            appDate.replaceItemDate(appDate.selectedItemForDelete.Id);
                            appDate.gridOptions.fillData(appDate.ListItemsDate);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        appDate.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    appDate.busyIndicator.isActive = false;

                });
            }
        });
    }

    appDate.searchData = function () {
        appDate.gridOptions.searchData();

    }




    appDate.columnCheckbox = false;
    appDate.openGridUserTypeModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (appDate.gridOptions.columnCheckbox) {
            for (var i = 0; i < appDate.gridOptions.columns.length; i++) {
                //appDate.gridOptions.columns[i].visible = $("#" + appDate.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + appDate.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                appDate.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = appDate.gridOptions.columns;
            for (var i = 0; i < appDate.gridOptions.columns.length; i++) {
                appDate.gridOptions.columns[i].visible = true;
                var element = $("#" + appDate.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + appDate.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < appDate.gridOptions.columns.length; i++) {
            console.log(appDate.gridOptions.columns[i].name.concat(".visible: "), appDate.gridOptions.columns[i].visible);
        }
        appDate.gridOptions.columnCheckbox = !appDate.gridOptions.columnCheckbox;
    }

    appDate.openSetTimesModal = function (dateId) {
        appDate.modalTitle = 'تنظیمات';
        $modal.open({
            templateUrl: 'cpanelv1/ModuleReservation/ReservationAppointmentDate/setTimes.html',
            scope: $scope
        });

    }


    appDate.deleteAttachedFile = function (index) {
        appDate.attachedFiles.splice(index, 1);
    }

    appDate.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !appDate.alreadyExist(id, appDate.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = {
                id: fId, name: fname
            };
            appDate.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    appDate.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    appDate.filePickerFileReport.removeSelectedfile = function (config) {
        appDate.filePickerFileReport.fileId = null;
        appDate.filePickerFileReport.filename = null;
        appDate.selectedItem.LinkFileReportId = null;

    }

    appDate.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }

    // ----------- FilePicker Codes --------------------------------
    appDate.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !appDate.alreadyExist(id, appDate.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            appDate.attachedFiles.push(file);
            appDate.clearfilePickers();
        }
    }

    appDate.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                appDate.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    appDate.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;   //String is empty or whitespace then return
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            appDate.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    appDate.clearfilePickers = function () {
        appDate.filePickerFiles.fileId = null;
        appDate.filePickerFiles.filename = null;
    }

    appDate.stringfyLinkFileIds = function () {
        $.each(appDate.attachedFiles, function (i, item) {
            if (appDate.selectedItem.LinkFileIds == "")
                appDate.selectedItem.LinkFileIds = item.fileId;
            else
                appDate.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    appDate.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleReservation/ReservationAppointmentDate/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        appDate.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            appDate.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }
   

    appDate.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    appDate.whatcolor = function (progress) {
        wdth = Math.floor(progress * 100);
        if (wdth >= 0 && wdth < 30) {
            return 'danger';
        } else if (wdth >= 30 && wdth < 50) {
            return 'warning';
        } else if (wdth >= 50 && wdth < 85) {
            return 'info';
        } else {
            return 'success';
        }
    }

    appDate.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    appDate.replaceFile = function (name) {
        appDate.itemClicked(null, appDate.fileIdToDelete, "file");
        appDate.fileTypes = 1;
        appDate.fileIdToDelete = appDate.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", appDate.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    appDate.remove(appDate.FileList, appDate.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                appDate.FileItem = response3.Item;
                                appDate.FileItem.FileName = name;
                                appDate.FileItem.Extension = name.split('.').pop();
                                appDate.FileItem.FileSrc = name;
                                appDate.FileItem.LinkCategoryId = appDate.thisCategory;
                                appDate.saveNewFile();
                            }
                            else {
                                console.log("getting the model was not successfully returned!");
                            }
                        }).error(function (data) {
                            console.log(data);
                        });
                    }
                    else {
                        console.log("Request to api/CmsFileContent/delete was not successfully returned!");
                    }
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }
        }).error(function (data) {
            console.log(data);
        });
    }
    //save new file
    appDate.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", appDate.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                appDate.FileItem = response.Item;
                appDate.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            appDate.showErrorIcon();
            return -1;
        });
    }

    appDate.showSuccessIcon = function () {
    }

    appDate.showErrorIcon = function () {

    }
    //file is exist
    appDate.fileIsExist = function (fileName) {
        for (var i = 0; i < appDate.FileList.length; i++) {
            if (appDate.FileList[i].FileName == fileName) {
                appDate.fileIdToDelete = appDate.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    appDate.getFileItem = function (id) {
        for (var i = 0; i < appDate.FileList.length; i++) {
            if (appDate.FileList[i].Id == id) {
                return appDate.FileList[i];
            }
        }
    }

    //select file or folder
    appDate.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            appDate.fileTypes = 1;
            appDate.selectedFileId = appDate.getFileItem(index).Id;
            appDate.selectedFileName = appDate.getFileItem(index).FileName;
        }
        else {
            appDate.fileTypes = 2;
            appDate.selectedCategoryId = appDate.getCategoryName(index).Id;
            appDate.selectedCategoryTitle = appDate.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        appDate.selectedIndex = index;

    };

    //upload file
    appDate.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (appDate.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ appDate.replaceFile(uploadFile.name);
                    appDate.itemClicked(null, appDate.fileIdToDelete, "file");
                    appDate.fileTypes = 1;
                    appDate.fileIdToDelete = appDate.selectedIndex;
                    // replace the file
                    ajax
                        .call(
                            cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                            appDate.fileIdToDelete,
                            "GET"
                        )
                        .success(function (response1) {
                            if (response1.IsSuccess == true) {
                                console.log(response1.Item);
                                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                                    .success(function (response2) {
                                        if (response2.IsSuccess == true) {
                                            appDate.FileItem = response2.Item;
                                            appDate.showSuccessIcon();
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-check");
                                            appDate.filePickerFileReport.filename =
                                                appDate.FileItem.FileName;
                                            appDate.filePickerFileReport.fileId =
                                                response2.Item.Id;
                                            appDate.selectedItem.LinkFileReportId =
                                                appDate.filePickerFileReport.fileId;
                                        } else {
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-remove");
                                        }
                                    })
                                    .error(function (data) {
                                        appDate.showErrorIcon();
                                        $("#save-icon" + index).removeClass("fa-save");
                                        $("#save-button" + index).removeClass("flashing-button");
                                        $("#save-icon" + index).addClass("fa-remove");
                                    });
                                //-----------------------------------
                            }
                        })
                        .error(function (data) {
                            console.log(data);
                        });
                    //--------------------------------
                } else {
                    return;
                }
            }
            else { // File does not exists
                // Save New file
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response) {
                    appDate.FileItem = response.Item;
                    appDate.FileItem.FileName = uploadFile.name;
                    appDate.FileItem.uploadName = uploadFile.uploadName;
                    appDate.FileItem.Extension = uploadFile.name.split('.').pop();
                    appDate.FileItem.FileSrc = uploadFile.name;
                    appDate.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- appDate.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", appDate.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            appDate.FileItem = response.Item;
                            appDate.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            appDate.filePickerFileReport.filename = appDate.FileItem.FileName;
                            appDate.filePickerFileReport.fileId = response.Item.Id;
                            appDate.selectedItem.LinkFileReportId = appDate.filePickerFileReport.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        appDate.showErrorIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass("flashing-button");
                        $("#save-icon" + index).addClass("fa-remove");
                    });
                    //-----------------------------------
                }).error(function (data) {
                    console.log(data);
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-remove");
                });
            }
        }
    }
    //End of Upload Modal-----------------------------------------


    /////// export & count for detail
    //Export Report 
    appDate.exportFile = function () {
        appDate.addRequested = true;
        appDate.gridContentDateDetail.advancedSearchData.engine.ExportFile = appDate.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'ReservationAppointmentDateDetail/exportfile', appDate.gridContentDateDetail.advancedSearchData.engine, 'POST').success(function (response) {
            appDate.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                appDate.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //appDate.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    appDate.toggleExportFormDetail = function () {
        appDate.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        appDate.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        appDate.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        appDate.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        appDate.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleReservation/ReservationAppointmentDateDetail/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    appDate.rowCountChanged = function () {
        if (!angular.isDefined(appDate.ExportFileClass.RowCount) || appDate.ExportFileClass.RowCount > 5000)
            appDate.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    appDate.getCountDetail = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ReservationAppointmentDateDetail/count", appDate.gridContentDateDetail.advancedSearchData.engine, 'POST').success(function (response) {
            appDate.addRequested = false;
            rashaErManage.checkAction(response);
            appDate.ListItemsTotalRowCountDetail = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            appDate.gridContentDateDetail.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    ////////////////////////////////////////////////////


    //Export Report 
    appDate.exportFile = function () {
        appDate.addRequested = true;
        appDate.gridOptions.advancedSearchData.engine.ExportFile = appDate.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'ReservationAppointmentDate/exportfile', appDate.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            appDate.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                appDate.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //appDate.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    appDate.toggleExportForm = function () {
        appDate.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        appDate.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        appDate.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        appDate.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        appDate.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleReservation/ReservationAppointmentDate/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    appDate.rowCountChanged = function () {
        if (!angular.isDefined(appDate.ExportFileClass.RowCount) || appDate.ExportFileClass.RowCount > 5000)
            appDate.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    appDate.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ReservationAppointmentDate/count", appDate.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            appDate.addRequested = false;
            rashaErManage.checkAction(response);
            appDate.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            appDate.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

