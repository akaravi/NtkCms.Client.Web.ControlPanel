app.controller("reservationCommentCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var reservationComment = this;
    reservationComment.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    reservationComment.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "reservationCommentCtrl") {
            localStorage.setItem('AddRequest', '');
            reservationComment.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    reservationComment.ContentList = [];

    reservationComment.allowedSearch = [];
    if (itemRecordStatus != undefined) reservationComment.itemRecordStatus = itemRecordStatus;
    reservationComment.init = function () {
        reservationComment.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = reservationComment.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }

        ajax.call(cmsServerConfig.configApiServerPath+"reservationComment/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            reservationComment.busyIndicator.isActive = false;
            reservationComment.ListItems = response.ListItems;
            reservationComment.gridOptions.fillData(reservationComment.ListItems , response.resultAccess);
            reservationComment.gridOptions.currentPageNumber = response.CurrentPageNumber;
            reservationComment.gridOptions.totalRowCount = response.TotalRowCount;
            reservationComment.gridOptions.rowPerPage = response.RowPerPage;
            reservationComment.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            reservationComment.busyIndicator.isActive = false;
            reservationComment.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //reservationComment.busyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+'reservationContent/getall', {}, 'POST').success(function (response) {
        //    reservationComment.ContentList = response.ListItems;
        //    reservationComment.busyIndicator.isActive = false;
        //});

        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        reservationComment.checkRequestAddNewItemFromOtherControl(null);
    }
    reservationComment.busyIndicator.isActive = true;
    reservationComment.addRequested = false;
    reservationComment.openAddModal = function () {
        reservationComment.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'reservationComment/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            reservationComment.busyIndicator.isActive = false;
            reservationComment.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulereservation/reservationComment/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    reservationComment.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        reservationComment.busyIndicator.isActive = true;
        reservationComment.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'reservationComment/add', reservationComment.selectedItem, 'POST').success(function (response) {
            reservationComment.addRequested = false;
            reservationComment.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                reservationComment.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                reservationComment.ListItems.unshift(response.Item);
                reservationComment.gridOptions.fillData(reservationComment.ListItems);
                reservationComment.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            reservationComment.busyIndicator.isActive = false;
            reservationComment.addRequested = false;
        });
    }


    reservationComment.openEditModal = function () {

        reservationComment.modalTitle = 'ویرایش';
        if (!reservationComment.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'reservationComment/GetOne', reservationComment.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            reservationComment.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulereservation/reservationComment/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    reservationComment.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        reservationComment.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'reservationComment/edit', reservationComment.selectedItem, 'PUT').success(function (response) {
            reservationComment.addRequested = true;
            rashaErManage.checkAction(response);
            reservationComment.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                reservationComment.addRequested = false;
                reservationComment.replaceItem(reservationComment.selectedItem.Id, response.Item);
                reservationComment.gridOptions.fillData(reservationComment.ListItems);
                reservationComment.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            reservationComment.addRequested = false;
        });
    }


    reservationComment.closeModal = function () {
        $modalStack.dismissAll();
    };

    reservationComment.replaceItem = function (oldId, newItem) {
        angular.forEach(reservationComment.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = reservationComment.ListItems.indexOf(item);
                reservationComment.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            reservationComment.ListItems.unshift(newItem);
    }

    reservationComment.deleteRow = function () {
        if (!reservationComment.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                reservationComment.busyIndicator.isActive = true;
                console.log(reservationComment.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'reservationComment/GetOne', reservationComment.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    //rashaErManage.checkAction(response);
                    reservationComment.selectedItemForDelete = response.Item;
                    console.log(reservationComment.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'reservationComment/delete', reservationComment.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        reservationComment.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            reservationComment.replaceItem(reservationComment.selectedItemForDelete.Id);
                            reservationComment.gridOptions.fillData(reservationComment.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });


    }

    reservationComment.searchData = function () {
        reservationComment.gridOptions.serachData();
    }

    reservationComment.LinkContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkContentId',
        url: 'reservationContent',
        scope: reservationComment,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: "string"},
                { name: 'RegisterDate', displayName: 'تاریخ ثبت', sortable: true, type: 'date'}
            ]
        }
    }

    reservationComment.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Writer', displayName: 'نام نویسنده', sortable: true, type: "string" },
            { name: 'Comment', displayName: 'کامنت', sortable: true, type: "string" },
            { name: 'virtual_reservationContent.Title', displayName: 'عنوان نوشته', sortable: true, type: 'string', visible: true },
            { name: 'LinkreservationContentId', displayName: 'کد سیستمی نوشته', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    reservationComment.gridOptions.advancedSearchData = {};
    reservationComment.gridOptions.advancedSearchData.engine = {};
    reservationComment.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    reservationComment.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    reservationComment.gridOptions.advancedSearchData.engine.SortType = 1;
    reservationComment.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    reservationComment.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    reservationComment.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    reservationComment.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    reservationComment.gridOptions.advancedSearchData.engine.Filters = [];

    reservationComment.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            reservationComment.focusExpireLockAccount = true;
        });
    };

    reservationComment.gridOptions.reGetAll = function () {
        reservationComment.init();
    }

    reservationComment.columnCheckbox = false;
    reservationComment.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (reservationComment.gridOptions.columnCheckbox) {
            for (var i = 0; i < reservationComment.gridOptions.columns.length; i++) {
                //reservationComment.gridOptions.columns[i].visible = $("#" + reservationComment.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + reservationComment.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                reservationComment.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = reservationComment.gridOptions.columns;
            for (var i = 0; i < reservationComment.gridOptions.columns.length; i++) {
                reservationComment.gridOptions.columns[i].visible = true;
                var element = $("#" + reservationComment.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + reservationComment.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < reservationComment.gridOptions.columns.length; i++) {
            console.log(reservationComment.gridOptions.columns[i].name.concat(".visible: "), reservationComment.gridOptions.columns[i].visible);
        }
        reservationComment.gridOptions.columnCheckbox = !reservationComment.gridOptions.columnCheckbox;
    }
    //Export Report 
    reservationComment.exportFile = function () {
        reservationComment.addRequested = true;
        reservationComment.gridOptions.advancedSearchData.engine.ExportFile = reservationComment.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'reservationComment/exportfile', reservationComment.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            reservationComment.addRequested = false;
            rashaErManage.checkAction(response);
            reservationComment.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //reservationComment.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    reservationComment.toggleExportForm = function () {
        reservationComment.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        reservationComment.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        reservationComment.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        reservationComment.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/Modulereservation/reservationComment/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    reservationComment.rowCountChanged = function () {
        if (!angular.isDefined(reservationComment.ExportFileClass.RowCount) || reservationComment.ExportFileClass.RowCount > 5000)
            reservationComment.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    reservationComment.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"reservationComment/count", reservationComment.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            reservationComment.addRequested = false;
            rashaErManage.checkAction(response);
            reservationComment.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            reservationComment.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);