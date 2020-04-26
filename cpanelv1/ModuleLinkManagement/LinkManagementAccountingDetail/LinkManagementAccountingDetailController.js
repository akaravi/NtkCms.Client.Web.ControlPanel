app.controller("linkManagementAccountingDetailController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var linkManagementAccountingDetail = this;
    linkManagementAccountingDetail.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    linkManagementAccountingDetail.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "linkManagementAccountingDetailCtrl") {
            localStorage.setItem('AddRequest', '');
            linkManagementAccountingDetail.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    linkManagementAccountingDetail.ContentList = [];

    linkManagementAccountingDetail.allowedSearch = [];
    if (itemRecordStatus != undefined) linkManagementAccountingDetail.itemRecordStatus = itemRecordStatus;
    linkManagementAccountingDetail.init = function () {
        linkManagementAccountingDetail.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = linkManagementAccountingDetail.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }

        ajax.call(cmsServerConfig.configApiServerPath+"linkManagementAccountingDetail/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementAccountingDetail.busyIndicator.isActive = false;
            linkManagementAccountingDetail.ListItems = response.ListItems;
            linkManagementAccountingDetail.gridOptions.fillData(linkManagementAccountingDetail.ListItems , response.resultAccess);
            linkManagementAccountingDetail.gridOptions.currentPageNumber = response.CurrentPageNumber;
            linkManagementAccountingDetail.gridOptions.totalRowCount = response.TotalRowCount;
            linkManagementAccountingDetail.gridOptions.rowPerPage = response.RowPerPage;
            linkManagementAccountingDetail.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            linkManagementAccountingDetail.busyIndicator.isActive = false;
            linkManagementAccountingDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //linkManagementAccountingDetail.busyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+'linkManagementAccountingDetail/getall', {}, 'POST').success(function (response) {
        //    linkManagementAccountingDetail.ContentList = response.ListItems;
        //    linkManagementAccountingDetail.busyIndicator.isActive = false;
        //});
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        linkManagementAccountingDetail.checkRequestAddNewItemFromOtherControl(null);
    }
    linkManagementAccountingDetail.busyIndicator.isActive = true;
    linkManagementAccountingDetail.addRequested = false;
    linkManagementAccountingDetail.openAddModal = function () {
        linkManagementAccountingDetail.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementAccountingDetail/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementAccountingDetail.busyIndicator.isActive = false;
            linkManagementAccountingDetail.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleLinkManagement/linkManagementAccountingDetail/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    linkManagementAccountingDetail.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        linkManagementAccountingDetail.busyIndicator.isActive = true;
        linkManagementAccountingDetail.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementAccountingDetail/add', linkManagementAccountingDetail.selectedItem, 'POST').success(function (response) {
            linkManagementAccountingDetail.addRequested = false;
            linkManagementAccountingDetail.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                linkManagementAccountingDetail.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                linkManagementAccountingDetail.ListItems.unshift(response.Item);
                linkManagementAccountingDetail.gridOptions.fillData(linkManagementAccountingDetail.ListItems);
                linkManagementAccountingDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            linkManagementAccountingDetail.busyIndicator.isActive = false;
            linkManagementAccountingDetail.addRequested = false;
        });
    }


    linkManagementAccountingDetail.openEditModal = function () {

        linkManagementAccountingDetail.modalTitle = 'ویرایش';
        if (!linkManagementAccountingDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementAccountingDetail/GetOne', linkManagementAccountingDetail.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementAccountingDetail.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleLinkManagement/linkManagementAccountingDetail/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    linkManagementAccountingDetail.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        linkManagementAccountingDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementAccountingDetail/edit', linkManagementAccountingDetail.selectedItem, 'PUT').success(function (response) {
            linkManagementAccountingDetail.addRequested = true;
            rashaErManage.checkAction(response);
            linkManagementAccountingDetail.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                linkManagementAccountingDetail.addRequested = false;
                linkManagementAccountingDetail.replaceItem(linkManagementAccountingDetail.selectedItem.Id, response.Item);
                linkManagementAccountingDetail.gridOptions.fillData(linkManagementAccountingDetail.ListItems);
                linkManagementAccountingDetail.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            linkManagementAccountingDetail.addRequested = false;
        });
    }


    linkManagementAccountingDetail.closeModal = function () {
        $modalStack.dismissAll();
    };

    linkManagementAccountingDetail.replaceItem = function (oldId, newItem) {
        angular.forEach(linkManagementAccountingDetail.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = linkManagementAccountingDetail.ListItems.indexOf(item);
                linkManagementAccountingDetail.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            linkManagementAccountingDetail.ListItems.unshift(newItem);
    }

    linkManagementAccountingDetail.deleteRow = function () {
        if (!linkManagementAccountingDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                linkManagementAccountingDetail.busyIndicator.isActive = true;
                console.log(linkManagementAccountingDetail.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'linkManagementAccountingDetail/GetOne', linkManagementAccountingDetail.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    linkManagementAccountingDetail.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'linkManagementAccountingDetail/delete', linkManagementAccountingDetail.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        linkManagementAccountingDetail.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            linkManagementAccountingDetail.replaceItem(linkManagementAccountingDetail.selectedItemForDelete.Id);
                            linkManagementAccountingDetail.gridOptions.fillData(linkManagementAccountingDetail.ListItems);
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

    linkManagementAccountingDetail.searchData = function () {
        linkManagementAccountingDetail.gridOptions.serachData();
    }
    linkManagementAccountingDetail.LinkManagementAccountingIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkManagementAccountingId',
        url: 'LinkManagementAccounting',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: linkManagementAccountingDetail,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: true },
                
            ]
        }
    }



    linkManagementAccountingDetail.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkManagementAccountingId', displayName: 'کد سند', sortable: true, type: 'integer', visible: true },
            { name: 'RowNumber', displayName: 'شماره ردیف', sortable: true, type: "string" },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: "string" },
            { name: 'Debtor', displayName: 'بدهکار', sortable: true, type: 'string', visible: true },
            { name: 'Creditor', displayName: 'بستانکار', sortable: true, type: 'integer', visible: true },
            { name: 'FishNumber', displayName: 'شماره فیش', sortable: true, type: 'integer', visible: true },
            { name: 'TokenNumber', displayName: 'شماره توکن', sortable: true, type: 'integer', visible: true },
            { name: 'ReceiptCode', displayName: 'شماره تحویل', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            
           

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    linkManagementAccountingDetail.gridOptions.advancedSearchData = {};
    linkManagementAccountingDetail.gridOptions.advancedSearchData.engine = {};
    linkManagementAccountingDetail.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    linkManagementAccountingDetail.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    linkManagementAccountingDetail.gridOptions.advancedSearchData.engine.SortType = 1;
    linkManagementAccountingDetail.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    linkManagementAccountingDetail.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    linkManagementAccountingDetail.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    linkManagementAccountingDetail.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    linkManagementAccountingDetail.gridOptions.advancedSearchData.engine.Filters = [];

    linkManagementAccountingDetail.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            linkManagementAccountingDetail.focusExpireLockAccount = true;
        });
    };

    linkManagementAccountingDetail.gridOptions.reGetAll = function () {
        linkManagementAccountingDetail.init();
    }

    linkManagementAccountingDetail.columnCheckbox = false;
    linkManagementAccountingDetail.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (linkManagementAccountingDetail.gridOptions.columnCheckbox) {
            for (var i = 0; i < linkManagementAccountingDetail.gridOptions.columns.length; i++) {
                //linkManagementAccountingDetail.gridOptions.columns[i].visible = $("#" + linkManagementAccountingDetail.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + linkManagementAccountingDetail.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                linkManagementAccountingDetail.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = linkManagementAccountingDetail.gridOptions.columns;
            for (var i = 0; i < linkManagementAccountingDetail.gridOptions.columns.length; i++) {
                linkManagementAccountingDetail.gridOptions.columns[i].visible = true;
                var element = $("#" + linkManagementAccountingDetail.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + linkManagementAccountingDetail.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < linkManagementAccountingDetail.gridOptions.columns.length; i++) {
            console.log(linkManagementAccountingDetail.gridOptions.columns[i].name.concat(".visible: "), linkManagementAccountingDetail.gridOptions.columns[i].visible);
        }
        linkManagementAccountingDetail.gridOptions.columnCheckbox = !linkManagementAccountingDetail.gridOptions.columnCheckbox;
    }
    //Export Report 
    linkManagementAccountingDetail.exportFile = function () {
        linkManagementAccountingDetail.addRequested = true;
        linkManagementAccountingDetail.gridOptions.advancedSearchData.engine.ExportFile = linkManagementAccountingDetail.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementAccountingDetail/exportfile', linkManagementAccountingDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            linkManagementAccountingDetail.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                linkManagementAccountingDetail.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //linkManagementAccountingDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    linkManagementAccountingDetail.toggleExportForm = function () {
        linkManagementAccountingDetail.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        linkManagementAccountingDetail.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        linkManagementAccountingDetail.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        linkManagementAccountingDetail.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        linkManagementAccountingDetail.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleLinkManagement/linkManagementAccountingDetail/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    linkManagementAccountingDetail.rowCountChanged = function () {
        if (!angular.isDefined(linkManagementAccountingDetail.ExportFileClass.RowCount) || linkManagementAccountingDetail.ExportFileClass.RowCount > 5000)
            linkManagementAccountingDetail.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    linkManagementAccountingDetail.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"linkManagementAccountingDetail/count", linkManagementAccountingDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            linkManagementAccountingDetail.addRequested = false;
            rashaErManage.checkAction(response);
            linkManagementAccountingDetail.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            linkManagementAccountingDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);