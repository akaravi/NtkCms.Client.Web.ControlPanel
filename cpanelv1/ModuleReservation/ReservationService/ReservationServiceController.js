app.controller("reservationServiceController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window','$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window,$state, $filter) {
    var reservationService = this;
    reservationService.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    reservationService.UninversalMenus = [];
    if (itemRecordStatus != undefined) reservationService.itemRecordStatus = itemRecordStatus;

    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    reservationService.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "reservationServiceController") {
            localStorage.setItem('AddRequest', '');
            reservationService.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }

    reservationService.init = function () {
        reservationService.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = reservationService.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
         //////////////مقداردهی مقادیر enum////////////////////
            ajax.call(cmsServerConfig.configApiServerPath+"reservationservice/getAllPaymentType", {}, 'POST').success(function (response) {
                reservationService.PaymentType = response.ListItems;
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
        //////////////////////////////////////////////////////////
        ajax.call(cmsServerConfig.configApiServerPath+"reservationservice/getall", reservationService.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            reservationService.busyIndicator.isActive = false;
            reservationService.ListItems = response.ListItems;

            // Call Excerpt Function to shorten the length of long strings
            reservationService.gridOptions.fillData(reservationService.ListItems, response.resultAccess);
            reservationService.gridOptions.currentPageNumber = response.CurrentPageNumber;
            reservationService.gridOptions.totalRowCount = response.TotalRowCount;
            reservationService.gridOptions.rowPerPage = response.RowPerPage;
            reservationService.allowedSearch = response.AllowedSearchField;

        }).error(function (data, errCode, c, d) {
            reservationService.busyIndicator.isActive = false;
            reservationService.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            });
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        reservationService.checkRequestAddNewItemFromOtherControl(null);
    }

    // Open Add Modal
    reservationService.busyIndicator.isActive = true;
    reservationService.addRequested = false;
    reservationService.openAddModal = function () {
        reservationService.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'reservationservice/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            reservationService.busyIndicator.isActive = false;
            reservationService.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulereservation/reservationservice/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            reservationService.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    reservationService.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        reservationService.busyIndicator.isActive = true;
        reservationService.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ReservationService/add', reservationService.selectedItem, 'POST').success(function (response) {
            reservationService.addRequested = false;
            reservationService.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                reservationService.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                reservationService.ListItems.unshift(response.Item);
                reservationService.gridOptions.fillData(reservationService.ListItems);
                reservationService.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            reservationService.busyIndicator.isActive = false;
            reservationService.addRequested = false;
        });
    }

    // Open Edit Modal
    reservationService.openEditModal = function () {
        reservationService.modalTitle = 'ویرایش';
        if (!reservationService.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'reservationservice/GetOne', reservationService.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            reservationService.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulereservation/reservationservice/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    reservationService.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        reservationService.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'reservationservice/edit', reservationService.selectedItem, 'PUT').success(function (response) {
            reservationService.addRequested = true;
            rashaErManage.checkAction(response);
            reservationService.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                reservationService.addRequested = false;
                reservationService.replaceItem(reservationService.selectedItem.Id, response.Item);
                reservationService.gridOptions.fillData(reservationService.ListItems);
                reservationService.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            reservationService.addRequested = false;
            reservationService.busyIndicator.isActive = false;

        });
    }

    reservationService.closeModal = function () {
        $modalStack.dismissAll();
    };

    

    reservationService.LinkExternalModuleShopContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkExternalModuleShopContentId',
        url: 'ShopContent',
        sortColumn: 'Id',
        sortType: 1,
        filterText: 'Title',
        rowPerPage: 200,
        scope: reservationService,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'},
                { name: 'ProductUnit', displayName: 'واحد', sortable: true, type: 'string'},
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string'}
            ]
        }
    }


    reservationService.replaceItem = function (oldId, newItem) {
        angular.forEach(reservationService.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = reservationService.ListItems.indexOf(item);
                reservationService.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            reservationService.ListItems.unshift(newItem);
    }

    reservationService.deleteRow = function () {
        if (!reservationService.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                reservationService.busyIndicator.isActive = true;
                console.log(reservationService.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'reservationservice/GetOne', reservationService.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    reservationService.selectedItemForDelete = response.Item;
                    console.log(reservationService.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'reservationservice/delete', reservationService.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        reservationService.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            reservationService.replaceItem(reservationService.selectedItemForDelete.Id);
                            reservationService.gridOptions.fillData(reservationService.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        reservationService.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    reservationService.busyIndicator.isActive = false;

                });
            }
        });
    }

    reservationService.searchData = function () {
        reservationService.gridOptions.searchData();

    }

    //reservationService.LinkArticleContentIdSelector = {
    //    displayMember: 'Title',
    //    id: 'Id',
    //    fId: 'LinkArticleContentId',
    //    filterText: 'ArticleContent',
    //    url: 'ArticleContent',
    //    scope: reservationService,
    //    columnOptions: {
    //        columns: [
    //            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
    //            { name: 'Title', displayName: 'عنوان', sortable: true }
    //        ]
    //    }
    //}

    reservationService.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: true },
            { name: 'LinkExternalModuleShopContentId', displayName: 'کد کالا', sortable: true, type: 'integer', visible: true },
            { name: 'ModuleShopContent.Title', displayName: 'عنوان کالا', sortable: true, type: 'string', visible: true },
            { name: 'ModuleShopContent.ProductUnit', displayName: 'واحد کالا', sortable: true, type: 'string', visible: true },
            { name: 'ModuleShopContent.Description', displayName: 'توضیحات کالا', sortable: true, type: 'string', visible: true },
            { name: 'ModuleShopContent.Price', displayName: 'قیمت', sortable: true, type: 'string', visible: true },
            { name: 'TimeUnits', displayName: 'واحد زمانی', sortable: true, type: 'integer', visible: true },
            { name: "ActionKey", displayName: "لیست سفارشات", displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="reservationService.OpenReservationOrder(x.Id)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        startDate: moment().format(),
        advancedSearchData: {
            engine: {}
        }
    }

    reservationService.gridOptions.advancedSearchData = {};
    reservationService.gridOptions.advancedSearchData.engine = {};
    reservationService.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    reservationService.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    reservationService.gridOptions.advancedSearchData.engine.SortType = 1;
    reservationService.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    reservationService.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    reservationService.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    reservationService.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    reservationService.gridOptions.advancedSearchData.engine.Filters = [];

    reservationService.test = 'false';

    reservationService.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            reservationService.focusExpireLockAccount = true;
        });
    };

    reservationService.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            reservationService.focus = true;
        });
    };

    reservationService.gridOptions.reGetAll = function () {
        reservationService.init();
    }

    reservationService.gridOptions.onRowSelected = function () {

    }

    reservationService.OpenReservationOrder = function (LinkServiceId) {
        $state.go("index.reservationorder", {
            ServiceId: LinkServiceId
        });
    }

    reservationService.columnCheckbox = false;
    reservationService.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (reservationService.gridOptions.columnCheckbox) {
            for (var i = 0; i < reservationService.gridOptions.columns.length; i++) {
                //reservationService.gridOptions.columns[i].visible = $("#" + reservationService.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + reservationService.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                reservationService.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = reservationService.gridOptions.columns;
            for (var i = 0; i < reservationService.gridOptions.columns.length; i++) {
                reservationService.gridOptions.columns[i].visible = true;
                var element = $("#" + reservationService.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + reservationService.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < reservationService.gridOptions.columns.length; i++) {
            console.log(reservationService.gridOptions.columns[i].name.concat(".visible: "), reservationService.gridOptions.columns[i].visible);
        }
        reservationService.gridOptions.columnCheckbox = !reservationService.gridOptions.columnCheckbox;
    }

   

    //reservationService.setWebhook = function (data) {
    //    ajax.call(cmsServerConfig.configApiServerPath+'reservationProcessUser/SetWebhookAsync', reservationService.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
    //        rashaErManage.showMessage(response.ErrorMessage);

    //    }).error(function (data, errCode, c, d) {
    //        rashaErManage.checkAction(data, errCode);
    //        reservationService.busyIndicator.isActive = false;

    //    });
    //}
    //reservationService.setWebhookEmpty = function (data) {
    //    ajax.call(cmsServerConfig.configApiServerPath+'reservationProcessUser/SetWebhookAsyncEmpty', reservationService.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
    //        rashaErManage.showMessage(response.ErrorMessage);

    //    }).error(function (data, errCode, c, d) {
    //        rashaErManage.checkAction(data, errCode);
    //        reservationService.busyIndicator.isActive = false;

    //    });
    //}
    //reservationService.GetUpdatesAsync = function (data) {
    //    ajax.call(cmsServerConfig.configApiServerPath+'reservationProcessReceive/GetUpdatesAsync', reservationService.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
    //        rashaErManage.showMessage(response.ErrorMessage);

    //    }).error(function (data, errCode, c, d) {
    //        rashaErManage.checkAction(data, errCode);
    //        reservationService.busyIndicator.isActive = false;

    //    });
    //}
    //Export Report 
    reservationService.exportFile = function () {
        reservationService.addRequested = true;
        reservationService.gridOptions.advancedSearchData.engine.ExportFile = reservationService.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'reservationservice/exportfile', reservationService.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            reservationService.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                reservationService.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //reservationService.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    reservationService.toggleExportForm = function () {
        reservationService.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        reservationService.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        reservationService.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        reservationService.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        reservationService.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/Modulereservation/reservationservice/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    reservationService.rowCountChanged = function () {
        if (!angular.isDefined(reservationService.ExportFileClass.RowCount) || reservationService.ExportFileClass.RowCount > 5000)
            reservationService.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    reservationService.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"reservationservice/count", reservationService.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            reservationService.addRequested = false;
            rashaErManage.checkAction(response);
            reservationService.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            reservationService.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

