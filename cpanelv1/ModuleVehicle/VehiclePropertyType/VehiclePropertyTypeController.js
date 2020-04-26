app.controller("vehiclePropertyTypeController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$state', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $state, $window, $filter) {
    var vehiclePropertyType = this;
    vehiclePropertyType.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    vehiclePropertyType.ListItems = [];
    vehiclePropertyType.selectUniversalMenuOnUndetectableKey = true;
    if (itemRecordStatus != undefined) vehiclePropertyType.itemRecordStatus = itemRecordStatus;

    vehiclePropertyType.init = function () {
        vehiclePropertyType.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"vehiclepropertytype/getall", vehiclePropertyType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            vehiclePropertyType.busyIndicator.isActive = false;
            vehiclePropertyType.ListItems = response.ListItems;
            vehiclePropertyType.gridOptions.fillData(vehiclePropertyType.ListItems, response.resultAccess);
            vehiclePropertyType.gridOptions.currentPageNumber = response.CurrentPageNumber;
            vehiclePropertyType.gridOptions.totalRowCount = response.TotalRowCount;
            vehiclePropertyType.gridOptions.rowPerPage = response.RowPerPage;
            vehiclePropertyType.allowedSearch = response.AllowedSearchField;

        }).error(function (data, errCode, c, d) {
            vehiclePropertyType.busyIndicator.isActive = false;
            vehiclePropertyType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    vehiclePropertyType.busyIndicator.isActive = true;
    vehiclePropertyType.addRequested = false;
    vehiclePropertyType.openAddModal = function () {
        vehiclePropertyType.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'vehiclepropertytype/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            vehiclePropertyType.busyIndicator.isActive = false;
            vehiclePropertyType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleVehicle/VehiclePropertyType/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            vehiclePropertyType.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    vehiclePropertyType.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        vehiclePropertyType.busyIndicator.isActive = true;
        vehiclePropertyType.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'vehiclepropertytype/add', vehiclePropertyType.selectedItem, 'POST').success(function (response) {
            vehiclePropertyType.addRequested = false;
            vehiclePropertyType.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                vehiclePropertyType.ListItems.unshift(response.Item);
                vehiclePropertyType.gridOptions.fillData(vehiclePropertyType.ListItems);
                vehiclePropertyType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            vehiclePropertyType.busyIndicator.isActive = false;
            vehiclePropertyType.addRequested = false;
        });
    }

    vehiclePropertyType.openEditModal = function () {
        vehiclePropertyType.modalTitle = 'ویرایش';
        if (!vehiclePropertyType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'vehiclepropertytype/GetOne', vehiclePropertyType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            vehiclePropertyType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleVehicle/VehiclePropertyType/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    vehiclePropertyType.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        vehiclePropertyType.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'vehiclepropertytype/edit', vehiclePropertyType.selectedItem, 'PUT').success(function (response) {
            vehiclePropertyType.addRequested = true;
            rashaErManage.checkAction(response);
            vehiclePropertyType.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                vehiclePropertyType.addRequested = false;
                vehiclePropertyType.replaceItem(vehiclePropertyType.selectedItem.Id, response.Item);
                vehiclePropertyType.gridOptions.fillData(vehiclePropertyType.ListItems);
                vehiclePropertyType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            vehiclePropertyType.addRequested = false;
            vehiclePropertyType.busyIndicator.isActive = false;

        });
    }

    vehiclePropertyType.closeModal = function () {
        $modalStack.dismissAll();
    };

    vehiclePropertyType.replaceItem = function (oldId, newItem) {
        angular.forEach(vehiclePropertyType.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = vehiclePropertyType.ListItems.indexOf(item);
                vehiclePropertyType.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            vehiclePropertyType.ListItems.unshift(newItem);
    }

    vehiclePropertyType.deleteRow = function () {
        if (!vehiclePropertyType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                vehiclePropertyType.busyIndicator.isActive = true;
                console.log(vehiclePropertyType.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'vehiclepropertytype/GetOne', vehiclePropertyType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    vehiclePropertyType.selectedItemForDelete = response.Item;
                    console.log(vehiclePropertyType.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'vehiclepropertytype/delete', vehiclePropertyType.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        vehiclePropertyType.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            vehiclePropertyType.replaceItem(vehiclePropertyType.selectedItemForDelete.Id);
                            vehiclePropertyType.gridOptions.fillData(vehiclePropertyType.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        vehiclePropertyType.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    vehiclePropertyType.busyIndicator.isActive = false;

                });
            }
        });
    }

    vehiclePropertyType.searchData = function () {
        vehiclePropertyType.gridOptions.searchData();

    }

    vehiclePropertyType.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: true },
            { name: 'ActionButtons', displayName: 'خصوصیات خودرو', sortable: true, type: 'string', visible: true, displayForce: true, template: '<button type="button" class="btn btn-primary" ng-click="vehiclePropertyType.goToDetails(x.Id)"  class="btn btn-primary"><i class="fa fa-plus-circle" aria-hidden="true"></i>&nbsp;خصوصیات</button>' }
        ],
        data: {},
        multiSelect: false,
        startDate: moment().format(),
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

    vehiclePropertyType.gridOptions.reGetAll = function () {
        vehiclePropertyType.init();
    }

    vehiclePropertyType.gridOptions.onRowSelected = function () {

    }

    vehiclePropertyType.columnCheckbox = false;
    vehiclePropertyType.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (vehiclePropertyType.gridOptions.columnCheckbox) {
            for (var i = 0; i < vehiclePropertyType.gridOptions.columns.length; i++) {
                //vehiclePropertyType.gridOptions.columns[i].visible = $("#" + vehiclePropertyType.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + vehiclePropertyType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                vehiclePropertyType.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = vehiclePropertyType.gridOptions.columns;
            for (var i = 0; i < vehiclePropertyType.gridOptions.columns.length; i++) {
                vehiclePropertyType.gridOptions.columns[i].visible = true;
                var element = $("#" + vehiclePropertyType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + vehiclePropertyType.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < vehiclePropertyType.gridOptions.columns.length; i++) {
            console.log(vehiclePropertyType.gridOptions.columns[i].name.concat(".visible: "), vehiclePropertyType.gridOptions.columns[i].visible);
        }
        vehiclePropertyType.gridOptions.columnCheckbox = !vehiclePropertyType.gridOptions.columnCheckbox;
    }

    vehiclePropertyType.goToDetails = function (proprtyId) {
        $state.go('index.vehiclepropertydetail', { propertyParam: proprtyId });
    }
    //Export Report 
    vehiclePropertyType.exportFile = function () {
        vehiclePropertyType.addRequested = true;
        vehiclePropertyType.gridOptions.advancedSearchData.engine.ExportFile = vehiclePropertyType.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'vehiclePropertyType/exportfile', vehiclePropertyType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            vehiclePropertyType.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                vehiclePropertyType.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //vehiclePropertyType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    vehiclePropertyType.toggleExportForm = function () {
        vehiclePropertyType.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        vehiclePropertyType.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        vehiclePropertyType.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        vehiclePropertyType.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        vehiclePropertyType.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleVehicle/VehiclePropertyType/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    vehiclePropertyType.rowCountChanged = function () {
        if (!angular.isDefined(vehiclePropertyType.ExportFileClass.RowCount) || vehiclePropertyType.ExportFileClass.RowCount > 5000)
            vehiclePropertyType.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    vehiclePropertyType.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"vehiclePropertyType/count", vehiclePropertyType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            vehiclePropertyType.addRequested = false;
            rashaErManage.checkAction(response);
            vehiclePropertyType.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            vehiclePropertyType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);

