app.controller("cmsLocationController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var cmsLocation = this;
    if (itemRecordStatus != undefined) cmsLocation.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    cmsLocation.ExpireDate = {
        defaultDate: date
    }

    cmsLocation.busyIndicator = {
        isActive: false,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    cmsLocation.init = function () {
        cmsLocation.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"CoreLocation/getall", cmsLocation.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            cmsLocation.ListItems = response.ListItems;
            cmsLocation.gridOptions.fillData(cmsLocation.ListItems, response.resultAccess);
            cmsLocation.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsLocation.gridOptions.totalRowCount = response.TotalRowCount;
            cmsLocation.gridOptions.rowPerPage = response.RowPerPage;
            cmsLocation.gridOptions.maxSize = 5;
            ajax.call(cmsServerConfig.configApiServerPath+"CoreEnum/EnumLocationType", {}, 'POST').success(function (response) {
                cmsLocation.locationTypeListItems = response.ListItems;
                //Filter LocationType
                $.each(cmsLocation.ListItems, function (index, location) {
                    $.each(cmsLocation.locationTypeListItems, function (index, type) {
                        if (location.LocationType == type.Value)
                            location.LocationTypeTitle = type.Description;
                    });
                });
                cmsLocation.busyIndicator.isActive = false;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }).error(function (data, errCode, c, d) {
            cmsLocation.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });

    }
    cmsLocation.addRequested = false;
    cmsLocation.openAddModal = function () {
        if (buttonIsPressed) { return };
        cmsLocation.modalTitle = 'اضافه';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreLocation/GetViewModel', '', 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            cmsLocation.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/CmsLocation/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsLocation.addNewRow = function (frm) {
        if (frm.$invalid)
            return;
        cmsLocation.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreLocation/add', cmsLocation.selectedItem, 'POST').success(function (response) {
            cmsLocation.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsLocation.ListItems.unshift(response.Item);
                cmsLocation.gridOptions.fillData(cmsLocation.ListItems);
                cmsLocation.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsLocation.addRequested = false;
        });
    }

    // Open Edit Content Modal
    cmsLocation.openEditModal = function () {
        if (buttonIsPressed) { return };
        cmsLocation.modalTitle = 'ویرایش';
        if (!cmsLocation.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreLocation/GetOne', cmsLocation.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            cmsLocation.selectedItem = response.Item;
            cmsLocation.ExpireDate.defaultDate = cmsLocation.selectedItem.ExpireDate;
            cmsLocation.selectedItem.Pwd = "";
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/CmsLocation/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsLocation.editRow = function (frm) {
        if (frm.$invalid)
            return;
        if (!emailRegEx.test(cmsLocation.selectedItem.Username)) {   //Validate Username
            rashaErManage.showMessage($filter('translatentk')('Email_Format_Is_Not_Correct'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'CoreLocation/edit', cmsLocation.selectedItem, 'PUT').success(function (response) {
            cmsLocation.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsLocation.addRequested = false;
                cmsLocation.replaceItem(cmsLocation.selectedItem.Id, response.Item);
                cmsLocation.gridOptions.fillData(cmsLocation.ListItems);
                cmsLocation.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsLocation.addRequested = false;
        });
    }


    cmsLocation.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsLocation.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsLocation.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsLocation.ListItems.indexOf(item);
                cmsLocation.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsLocation.ListItems.unshift(newItem);
    }

    cmsLocation.deleteRow = function () {
        if (buttonIsPressed) { return };
        if (!cmsLocation.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(cmsLocation.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'CoreLocation/GetOne', cmsLocation.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    cmsLocation.selectedItemForDelete = response.Item;
                    console.log(cmsLocation.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreLocation/delete', cmsLocation.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsLocation.replaceItem(cmsLocation.selectedItemForDelete.Id);
                            cmsLocation.gridOptions.fillData(cmsLocation.ListItems);
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

    cmsLocation.searchData = function () {
        cmsLocation.gridOptions.serachData();
    }

    cmsLocation.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'virtual_Parent.Title', displayName: 'والد', sortable: true, type: 'string', displayForce: true },
            { name: 'LocationTypeTitle', displayName: 'نوع', sortable: true, type: 'string', displayForce: true }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "Id",
                SortType: 0,
                NeedToRunFakePagination: false,
                TotalRowData: 2000,
                RowPerPage: 200,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }

    cmsLocation.openDateExpireDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            cmsLocation.focusExpireDate = true;
        });
    };

    cmsLocation.gridOptions.reGetAll = function () {
        cmsLocation.init();
    }

    cmsLocation.gridOptions.onRowSelected = function () { }
    //Export Report 
    cmsLocation.exportFile = function () {
        cmsLocation.addRequested = true;
        cmsLocation.gridOptions.advancedSearchData.engine.ExportFile = cmsLocation.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'Corelocation/exportfile', cmsLocation.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                cmsLocation.closeModal();
            }
            cmsLocation.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    cmsLocation.toggleExportForm = function () {
        cmsLocation.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'Random', value: 3 }
        ];
        cmsLocation.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        cmsLocation.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'فایل منیجر', value: 3 }
        ];
        cmsLocation.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCore/CmsLocation/report.html',
            scope: $scope
        });
    }
    //Row Count Input Change
    cmsLocation.rowCountChanged = function () {
        if (!angular.isDefined(cmsLocation.ExportFileClass.RowCount) || cmsLocation.ExportFileClass.RowCount > 2000)
            cmsLocation.ExportFileClass.RowCount = 2000;
    }
    //Get TotalRowCount
    cmsLocation.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"CoreLocation/count", cmsLocation.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsLocation.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            cmsLocation.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);