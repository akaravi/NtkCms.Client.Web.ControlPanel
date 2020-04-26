app.controller("reservationOrderController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window','$stateParams', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window,$stateParams, $filter) {
    var order = this;
    order.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    order.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "reservationOrderController") {
            localStorage.setItem('AddRequest', '');
            order.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    order.ViewNewUserDiv = false;
    order.ViewFindUserDiv = false;
    order.ViewInfoUserDiv = false;
    //order.UninversalMenus = [];
    //order.selectUniversalMenuOnUndetectableKey = true;
    if (itemRecordStatus != undefined) order.itemRecordStatus = itemRecordStatus;

   order.selectedContentId = { LinkAppointmentDateDetailId: $stateParams.AppointmentDateDetailId ,LinkAppointmentDateId: $stateParams.AppointmentDateId ,LinkServiceId: $stateParams.ServiceId};
    order.init = function () {

        order.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = order.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        filterModel = { PropertyName: "LinkAppointmentDateDetailId", SearchType: 0, IntValue1: order.selectedContentId.LinkAppointmentDateDetailId };
        if (order.selectedContentId.LinkAppointmentDateDetailId > 0)
            order.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
        filterModel = { PropertyName: "AppointmentDateDetails",PropertyAnyName:"Id", SearchType: 0, IntValue1: order.selectedContentId.LinkAppointmentDateId };
        if (order.selectedContentId.LinkAppointmentDateId > 0)
            order.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
        filterModel = { PropertyName: "LinkServiceId", SearchType: 0, IntValue1: order.selectedContentId.LinkServiceId };
        if (order.selectedContentId.LinkServiceId >0)
            order.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
        ajax.call(cmsServerConfig.configApiServerPath+"ReservationOrder/getall", order.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            order.busyIndicator.isActive = false;
            order.ListItems = response.ListItems;

            // Call Excerpt Function to shorten the length of long strings
            //excerptField(order.ListItems, "BotToken");
            order.gridOptions.fillData(order.ListItems, response.resultAccess);
            order.gridOptions.currentPageNumber = response.CurrentPageNumber;
            order.gridOptions.totalRowCount = response.TotalRowCount;
            order.gridOptions.rowPerPage = response.RowPerPage;
            order.allowedSearch = response.AllowedSearchField;

        }).error(function (data, errCode, c, d) {
            order.busyIndicator.isActive = false;
            order.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"universalmenumenuitem/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            order.UninversalMenus = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
        //order.busyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+'articleContent/getall', {}, 'POST').success(function (response) {
        //    order.CommentList = response.ListItems;
        //    order.busyIndicator.isActive = false;
        //});
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        order.checkRequestAddNewItemFromOtherControl(null);
    }
    includeMemberAdd = $scope;
    includeMemberAdd.selectedMember = [];
    // Open Add Modal
    order.busyIndicator.isActive = true;
    order.addRequested = false;
    order.openAddModal = function () {
        order.ViewFindUserDiv = false;
        order.ViewNewUserDiv = false;
        order.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'ReservationOrder/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            order.busyIndicator.isActive = false;
            order.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleReservation/ReservationOrder/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            order.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    order.addNewRow = function (frm) {
        //if (frm.$invalid)
        //    return;
        order.busyIndicator.isActive = true;
        order.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ReservationOrder/add', order.selectedItem, 'POST').success(function (response) {
            order.addRequested = false;
            order.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                order.checkRequestAddNewItemFromOtherControl(response.item.Id);

                order.ListItems.unshift(response.Item);
                order.gridOptions.fillData(order.ListItems);
                order.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            order.busyIndicator.isActive = false;
            order.addRequested = false;
        });
    }

   
    order.openEditModal = function () {

        order.modalTitle = 'ویرایش';
        if (!order.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'ReservationOrder/GetOne', order.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            order.selectedItem = response.Item;
            order.ViewInfoUserDiv = false;
            order.ViewFindUserDiv = false;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleReservation/ReservationOrder/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    order.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        //order.busyIndicator.isActive = true;
        order.addRequested = true;
         order.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ReservationOrder/edit', order.selectedItem, 'PUT').success(function (response) {
            order.addRequested = true;
            rashaErManage.checkAction(response);
            order.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                order.addRequested = false;
                order.replaceItem(order.selectedItem.Id, response.Item);
                order.gridOptions.fillData(order.ListItems);
                order.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            order.addRequested = false;
            order.busyIndicator.isActive = false;
        });
    }

    order.closeModal = function () {
        $modalStack.dismissAll();
    };

    order.replaceItem = function (oldId, newItem) {
        angular.forEach(order.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = order.ListItems.indexOf(item);
                order.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            order.ListItems.unshift(newItem);
    }

    order.deleteRow = function () {
        if (!order.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                order.busyIndicator.isActive = true;
                console.log(order.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'ReservationOrder/GetOne', order.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    order.selectedItemForDelete = response.Item;
                    console.log(order.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ReservationOrder/delete', order.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        order.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            order.replaceItem(order.selectedItemForDelete.Id);
                            order.gridOptions.fillData(order.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        order.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    order.busyIndicator.isActive = false;

                });
            }
        });
    }

    order.searchData = function () {
        order.gridOptions.searchData();

    }
    order.LinkServiceIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkServiceId',
        url: 'reservationservice',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        scope: order,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true }
            ]
        }
    }

order.LinkExternalModuleCoreCmsUserIdSelector = {
        displayMember: 'Name',
        id: 'Id',
        fId: 'LinkExternalModuleCoreCmsUserId',
        url: 'coreuser',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Name',
        //defaultFilter: [{ PropertyName: "SessionStatus", SearchType: 0, StringValue1: 'Available' }],
        rowPerPage: 200,
        scope: order,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Username', displayName: 'نام کاربری', sortable: true, type: 'string' },
                { name: 'Name', displayName: 'نام', sortable: true, type: 'string' },
                { name: 'LastName', displayName: 'نام خانوادگی', sortable: true, type: 'string' }
            ]
        }
    }
    order.LinkAppointmentDateDetailIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkAppointmentDateDetailId',
        url: 'reservationappointmentdatedetail',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        defaultFilter: [{ PropertyName: "SessionStatus", SearchType: 0, StringValue1: 'Available' }],
        rowPerPage: 200,
        scope: order,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'ServiceTimeMinute', displayName: 'واحد', sortable: true, type: 'integer'},
            ]
        }
    }
    
    order.LinkExternalModuleShopInvoiceDetailIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkExternalModuleShopInvoiceDetailId',
        url: 'shopinvoicesaledetail',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,

        scope: order,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Quantity', displayName: 'Quantity', sortable: true, type: 'string'},
                { name: 'Fee', displayName: 'Fee', sortable: true, type: 'string'},
                { name: 'Tax', displayName: 'Tax', sortable: true, type: 'string'},
            ]
        }
    }
    order.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkAppointmentDateDetailId', displayName: 'کد سیستمی اعلام روز', sortable: true, type: 'string', visible: true },
            { name: 'LinkExternalModuleMemberUserId', displayName: 'کد کاربری', sortable: true, type: 'string', visible: true },
            { name: 'ModuleMember.FirstName', displayName: 'نام مشتری', sortable: true, type: 'string', visible: true },
            { name: 'ModuleMember.LastName', displayName: 'نام خانوادگی مشتری', sortable: true, type: 'string', visible: true },
            { name: 'ModuleMember.NationalCode', displayName: 'کد ملی مشتری', sortable: true, type: 'string', visible: true },
            { name: 'LinkExternalModuleShopInvoiceDetailId', displayName: 'کد سیستمی کالا', sortable: true, type: 'string', visible: true },
            { name: 'ModuleShopInvoiceDetail.Quantity', displayName: 'Quantity', sortable: true, type: 'string', visible: true },
            { name: 'ModuleShopInvoiceDetail.Fee', displayName: 'Fee', sortable: true, type: 'string', visible: true },
            { name: 'ModuleShopInvoiceDetail.Tax', displayName: 'Tax', sortable: true, type: 'string', visible: true },
            { name: 'ActionButtonprint', displayName: 'چاپ', sortable: true, type: 'string', visible: true, displayForce: true, template: '<button type="button" name="getInfo_btn" ng-click="order.openReport(x)" class="btn btn-primary">چاپ&nbsp;<i class="fa fa-cog" aria-hidden="true"></i></button>' },

         ],
        data: {},
        multiSelect: false,
        startDate: moment().format(),
        advancedSearchData: {
            engine: {}
        }
    }

    order.gridOptions.advancedSearchData = {};
    order.gridOptions.advancedSearchData.engine = {};
    order.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    order.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    order.gridOptions.advancedSearchData.engine.SortType = 1;
    order.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    order.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    order.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    order.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    order.gridOptions.advancedSearchData.engine.Filters = [];

    order.test = 'false';

    order.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            order.focusExpireLockAccount = true;
        });
    };
    order.openReport = function (selected) {
        var linkfilereport = 0;
        ajax.call(cmsServerConfig.configApiServerPath+'ReservationOrder/GetOne', selected.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            linkfilereport = response.Item.virtual_AppointmentDateDetail.AppointmentDate.LinkFileReportId
            window.open('/mvc/ReservationOrder/getonereport/' + selected.Id + '?reportfile=' + linkfilereport);
        }).error(function (data2, errCode2, c2, d2) {
            rashaErManage.checkAction(data2);
            order.busyIndicator.isActive = false;
        });
        
    };
    order.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            order.focus = true;
        });
    };

    order.gridOptions.reGetAll = function () {
        order.init();
    }

    order.gridOptions.onRowSelected = function () {

    }

    order.columnCheckbox = false;
    order.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (order.gridOptions.columnCheckbox) {
            for (var i = 0; i < order.gridOptions.columns.length; i++) {
                //order.gridOptions.columns[i].visible = $("#" + order.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + order.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                order.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = order.gridOptions.columns;
            for (var i = 0; i < order.gridOptions.columns.length; i++) {
                order.gridOptions.columns[i].visible = true;
                var element = $("#" + order.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + order.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < order.gridOptions.columns.length; i++) {
            console.log(order.gridOptions.columns[i].name.concat(".visible: "), order.gridOptions.columns[i].visible);
        }
        order.gridOptions.columnCheckbox = !order.gridOptions.columnCheckbox;
    }

    

    //Export Report 
    order.exportFile = function () {
        order.addRequested = true;
        order.gridOptions.advancedSearchData.engine.ExportFile = order.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'ReservationOrder/exportfile', order.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            order.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                order.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //order.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    order.toggleExportForm = function () {
        order.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        order.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        order.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        order.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        order.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleReservation/ReservationOrder/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    order.rowCountChanged = function () {
        if (!angular.isDefined(order.ExportFileClass.RowCount) || order.ExportFileClass.RowCount > 5000)
            order.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    order.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ReservationOrder/count", order.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            order.addRequested = false;
            rashaErManage.checkAction(response);
            order.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            order.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

