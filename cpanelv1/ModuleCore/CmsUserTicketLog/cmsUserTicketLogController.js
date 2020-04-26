app.controller("cmsUserTicketLogController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var cmsUserTicketLog = this;
    cmsUserTicketLog.init = function () {
        //cmsUserTicketLog.LoadingBusyIndicator.isActive = true;
        var engine = {};
        try {
            engine = cmsUserTicketLog.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }

        ajax.call(cmsServerConfig.configApiServerPath+"CoreTokenUserLog/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsUserTicketLog.ListItems = response.ListItems;
            cmsUserTicketLog.gridOptions.fillData(cmsUserTicketLog.ListItems , response.resultAccess);
            cmsUserTicketLog.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsUserTicketLog.gridOptions.totalRowCount = response.TotalRowCount;
            cmsUserTicketLog.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            cmsUserTicketLog.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsUserTicketLog.addRequested = false;
    cmsUserTicketLog.openAddModal = function () {
        cmsUserTicketLog.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'CoreTokenUserLog/GetViewModel', '', 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsUserTicketLog.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsUserTicketLog/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsUserTicketLog.addNewRow = function (frm) {
        if (frm.$invalid)
            return;

        cmsUserTicketLog.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreTokenUserLog/add', cmsUserTicketLog.selectedItem, 'POST').success(function (response) {
            cmsUserTicketLog.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsUserTicketLog.ListItems.unshift(response.Item);
                cmsUserTicketLog.gridOptions.fillData(cmsUserTicketLog.ListItems);
                cmsUserTicketLog.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsUserTicketLog.addRequested = false;
        });
    }


    cmsUserTicketLog.openEditModal = function () {
        cmsUserTicketLog.modalTitle = 'ویرایش';
        if (!cmsUserTicketLog.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'CoreTokenUserLog/GetOne', cmsUserTicketLog.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsUserTicketLog.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsUserTicketLog/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsUserTicketLog.editRow = function (frm) {
        if (frm.$invalid)
            return;

        ajax.call(cmsServerConfig.configApiServerPath+'CoreTokenUserLog/edit', cmsUserTicketLog.selectedItem, 'PUT').success(function (response) {
            cmsUserTicketLog.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsUserTicketLog.addRequested = false;
                cmsUserTicketLog.replaceItem(cmsUserTicketLog.selectedItem.Id, response.Item);
                cmsUserTicketLog.gridOptions.fillData(cmsUserTicketLog.ListItems);
                cmsUserTicketLog.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsUserTicketLog.addRequested = false;
        });
    }


    cmsUserTicketLog.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsUserTicketLog.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsUserTicketLog.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsUserTicketLog.ListItems.indexOf(item);
                cmsUserTicketLog.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsUserTicketLog.ListItems.unshift(newItem);
    }

    cmsUserTicketLog.deleteRow = function () {
        if (!cmsUserTicketLog.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(cmsUserTicketLog.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'CoreTokenUserLog/GetOne', cmsUserTicketLog.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsUserTicketLog.selectedItemForDelete = response.Item;
                    console.log(cmsUserTicketLog.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreTokenUserLog/delete', cmsUserTicketLog.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsUserTicketLog.replaceItem(cmsUserTicketLog.selectedItemForDelete.Id);
                            cmsUserTicketLog.gridOptions.fillData(cmsUserTicketLog.ListItems);
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

    cmsUserTicketLog.searchData = function () {
        cmsUserTicketLog.gridOptions.serachData();
    }

    cmsUserTicketLog.linkUserTypeSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkLinkUserTypeId',
        url: 'LinkUserType',
        scope: cmsUserTicketLog,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true },
                { name: 'Title', displayName: 'عنوان', sortable: true }
            ]
        }
    }

    cmsUserTicketLog.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
            { name: 'CurrentSiteId', displayName: 'کد سیستمی سایت', sortable: true },
            { name: 'DeviceId', displayName: 'کد سیستمی دستگاه', sortable: true },
            { name: 'TicketDate', displayName: 'تاریخ', sortable: true, isDate: true },
            { name: 'UserId', displayName: 'کد سیستمی کاربر', sortable: true },
            { name: 'UserTypeValue', displayName: 'نوع کاربر', sortable: true }
            //{ name: 'LinkLinkUserTypeId.LinkUserType', displayName: 'نوع کاربر', sortable: true },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    cmsUserTicketLog.gridOptions.advancedSearchData = {};
    cmsUserTicketLog.gridOptions.advancedSearchData.engine = {};
    cmsUserTicketLog.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    cmsUserTicketLog.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    cmsUserTicketLog.gridOptions.advancedSearchData.engine.SortType = 1;
    cmsUserTicketLog.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    cmsUserTicketLog.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    cmsUserTicketLog.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    cmsUserTicketLog.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    cmsUserTicketLog.gridOptions.advancedSearchData.engine.Filters = [];

    cmsUserTicketLog.openDateRequestDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            cmsUserTicketLog.focusRequestDate = true;
        });
    };

    cmsUserTicketLog.gridOptions.reGetAll = function () {
        cmsUserTicketLog.init();
    }
    //Export Report 
    cmsUserTicketLog.exportFile = function () {
        cmsUserTicketLog.addRequested = true;
        cmsUserTicketLog.gridOptions.advancedSearchData.engine.ExportFile = cmsUserTicketLog.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreTokenUserLog/exportfile', cmsUserTicketLog.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            cmsUserTicketLog.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsUserTicketLog.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //cmsUserTicketLog.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    cmsUserTicketLog.toggleExportForm = function () {
        cmsUserTicketLog.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        cmsUserTicketLog.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        cmsUserTicketLog.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        cmsUserTicketLog.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        cmsUserTicketLog.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCore/cmsUserTicketLog/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    cmsUserTicketLog.rowCountChanged = function () {
        if (!angular.isDefined(cmsUserTicketLog.ExportFileClass.RowCount) || cmsUserTicketLog.ExportFileClass.RowCount > 5000)
            cmsUserTicketLog.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    cmsUserTicketLog.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"CoreTokenUserLog/count", cmsUserTicketLog.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            cmsUserTicketLog.addRequested = false;
            rashaErManage.checkAction(response);
            cmsUserTicketLog.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            cmsUserTicketLog.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);