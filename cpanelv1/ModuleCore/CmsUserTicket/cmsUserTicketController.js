app.controller("cmsUserTicketGridCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var cmsUserTicketgrd = this;
    cmsUserTicketgrd.init = function () {
        //cmsUserTicketgrd.LoadingBusyIndicator.isActive = true;
        var engine = {};
        try {
            engine = cmsUserTicketgrd.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }

        ajax.call(cmsServerConfig.configApiServerPath+"CoreTokenUser/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsUserTicketgrd.ListItems = response.ListItems;
            cmsUserTicketgrd.gridOptions.fillData(cmsUserTicketgrd.ListItems , response.resultAccess);
            cmsUserTicketgrd.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsUserTicketgrd.gridOptions.totalRowCount = response.TotalRowCount;
            cmsUserTicketgrd.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            cmsUserTicketgrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsUserTicketgrd.addRequested = false;
    cmsUserTicketgrd.openAddModal = function () {
        cmsUserTicketgrd.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'CoreTokenUser/GetViewModel', '', 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsUserTicketgrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsUserTicket/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsUserTicketgrd.addNewRow = function (frm) {
        if (frm.$invalid)
            return;

        cmsUserTicketgrd.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreTokenUser/add', cmsUserTicketgrd.selectedItem, 'POST').success(function (response) {
            cmsUserTicketgrd.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsUserTicketgrd.ListItems.unshift(response.Item);
                cmsUserTicketgrd.gridOptions.fillData(cmsUserTicketgrd.ListItems);
                cmsUserTicketgrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsUserTicketgrd.addRequested = false;
        });
    }


    cmsUserTicketgrd.openEditModal = function () {
        cmsUserTicketgrd.modalTitle = 'ویرایش';
        if (!cmsUserTicketgrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'CoreTokenUser/GetOne', cmsUserTicketgrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsUserTicketgrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsUserTicket/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsUserTicketgrd.editRow = function (frm) {
        if (frm.$invalid)
            return;

        ajax.call(cmsServerConfig.configApiServerPath+'CoreTokenUser/edit', cmsUserTicketgrd.selectedItem, 'PUT').success(function (response) {
            cmsUserTicketgrd.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsUserTicketgrd.addRequested = false;
                cmsUserTicketgrd.replaceItem(cmsUserTicketgrd.selectedItem.Id, response.Item);
                cmsUserTicketgrd.gridOptions.fillData(cmsUserTicketgrd.ListItems);
                cmsUserTicketgrd.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsUserTicketgrd.addRequested = false;
        });
    }


    cmsUserTicketgrd.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsUserTicketgrd.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsUserTicketgrd.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsUserTicketgrd.ListItems.indexOf(item);
                cmsUserTicketgrd.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsUserTicketgrd.ListItems.unshift(newItem);
    }

    cmsUserTicketgrd.deleteRow = function () {
        if (!cmsUserTicketgrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(cmsUserTicketgrd.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'CoreTokenUser/GetOne', cmsUserTicketgrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsUserTicketgrd.selectedItemForDelete = response.Item;
                    console.log(cmsUserTicketgrd.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreTokenUser/delete', cmsUserTicketgrd.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsUserTicketgrd.replaceItem(cmsUserTicketgrd.selectedItemForDelete.Id);
                            cmsUserTicketgrd.gridOptions.fillData(cmsUserTicketgrd.ListItems);
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

    cmsUserTicketgrd.searchData = function () {
        cmsUserTicketgrd.gridOptions.serachData();
    }

    cmsUserTicketgrd.linkUserTypeSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkLinkUserTypeId',
        url: 'LinkUserType',
        scope: cmsUserTicketgrd,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' }
            ]
        }
    }

    cmsUserTicketgrd.gridOptions = {
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

    cmsUserTicketgrd.gridOptions.advancedSearchData = {};
    cmsUserTicketgrd.gridOptions.advancedSearchData.engine = {};
    cmsUserTicketgrd.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    cmsUserTicketgrd.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    cmsUserTicketgrd.gridOptions.advancedSearchData.engine.SortType = 1;
    cmsUserTicketgrd.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    cmsUserTicketgrd.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    cmsUserTicketgrd.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    cmsUserTicketgrd.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    cmsUserTicketgrd.gridOptions.advancedSearchData.engine.Filters = [];

    cmsUserTicketgrd.openDateRequestDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            cmsUserTicketgrd.focusRequestDate = true;
        });
    };

    cmsUserTicketgrd.gridOptions.reGetAll = function () {
        cmsUserTicketgrd.init();
    }
    //Export Report 
    cmsUserTicketgrd.exportFile = function () {
        cmsUserTicketgrd.addRequested = true;
        cmsUserTicketgrd.gridOptions.advancedSearchData.engine.ExportFile = cmsUserTicketgrd.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreTokenUser/exportfile', cmsUserTicketgrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            cmsUserTicketgrd.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsUserTicketgrd.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //cmsUserTicketgrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    cmsUserTicketgrd.toggleExportForm = function () {
        cmsUserTicketgrd.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        cmsUserTicketgrd.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        cmsUserTicketgrd.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        cmsUserTicketgrd.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        cmsUserTicketgrd.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCore/cmsUserTicketg/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    cmsUserTicketgrd.rowCountChanged = function () {
        if (!angular.isDefined(cmsUserTicketgrd.ExportFileClass.RowCount) || cmsUserTicketgrd.ExportFileClass.RowCount > 5000)
            cmsUserTicketgrd.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    cmsUserTicketgrd.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"CoreTokenUser/count", cmsUserTicketgrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            cmsUserTicketgrd.addRequested = false;
            rashaErManage.checkAction(response);
            cmsUserTicketgrd.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            cmsUserTicketgrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);