app.controller("vehiclePropertyFavoriteController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $state, $filter) {
    var vehiclePropertyFavorite = this;
    vehiclePropertyFavorite.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    vehiclePropertyFavorite.ListItems = [];
    if (itemRecordStatus != undefined) vehiclePropertyFavorite.itemRecordStatus = itemRecordStatus;

    vehiclePropertyFavorite.init = function () {
        vehiclePropertyFavorite.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"vehiclePropertyFavorite/getall", vehiclePropertyFavorite.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            vehiclePropertyFavorite.busyIndicator.isActive = false;
            vehiclePropertyFavorite.ListItems = response.ListItems;
            vehiclePropertyFavorite.gridOptions.fillData(vehiclePropertyFavorite.ListItems, response.resultAccess);
            vehiclePropertyFavorite.gridOptions.currentPageNumber = response.CurrentPageNumber;
            vehiclePropertyFavorite.gridOptions.totalRowCount = response.TotalRowCount;
            vehiclePropertyFavorite.gridOptions.rowPerPage = response.RowPerPage;
            vehiclePropertyFavorite.allowedSearch = response.AllowedSearchField;

        }).error(function (data, errCode, c, d) {
            vehiclePropertyFavorite.busyIndicator.isActive = false;
            vehiclePropertyFavorite.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    vehiclePropertyFavorite.busyIndicator.isActive = true;
    vehiclePropertyFavorite.addRequested = false;
    vehiclePropertyFavorite.openAddModal = function () {
        vehiclePropertyFavorite.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'vehiclePropertyFavorite/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            vehiclePropertyFavorite.busyIndicator.isActive = false;
            vehiclePropertyFavorite.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleVehicle/VehiclePropertyFavorite/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            vehiclePropertyFavorite.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    vehiclePropertyFavorite.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        vehiclePropertyFavorite.busyIndicator.isActive = true;
        vehiclePropertyFavorite.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'vehiclePropertyFavorite/add', vehiclePropertyFavorite.selectedItem, 'POST').success(function (response) {
            vehiclePropertyFavorite.addRequested = false;
            vehiclePropertyFavorite.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                vehiclePropertyFavorite.ListItems.unshift(response.Item);
                vehiclePropertyFavorite.gridOptions.fillData(vehiclePropertyFavorite.ListItems);
                vehiclePropertyFavorite.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            vehiclePropertyFavorite.busyIndicator.isActive = false;
            vehiclePropertyFavorite.addRequested = false;
        });
    }

    vehiclePropertyFavorite.openEditModal = function () {
        vehiclePropertyFavorite.modalTitle = 'ویرایش';
        if (!vehiclePropertyFavorite.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'vehiclePropertyFavorite/GetOne', vehiclePropertyFavorite.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            vehiclePropertyFavorite.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleVehicle/VehiclePropertyFavorite/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    vehiclePropertyFavorite.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        vehiclePropertyFavorite.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'vehiclePropertyFavorite/edit', vehiclePropertyFavorite.selectedItem, 'PUT').success(function (response) {
            vehiclePropertyFavorite.addRequested = true;
            rashaErManage.checkAction(response);
            vehiclePropertyFavorite.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                vehiclePropertyFavorite.addRequested = false;
                vehiclePropertyFavorite.replaceItem(vehiclePropertyFavorite.selectedItem.Id, response.Item);
                vehiclePropertyFavorite.gridOptions.fillData(vehiclePropertyFavorite.ListItems);
                vehiclePropertyFavorite.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            vehiclePropertyFavorite.addRequested = false;
            vehiclePropertyFavorite.busyIndicator.isActive = false;

        });
    }

    vehiclePropertyFavorite.closeModal = function () {
        $modalStack.dismissAll();
    };

    vehiclePropertyFavorite.replaceItem = function (oldId, newItem) {
        angular.forEach(vehiclePropertyFavorite.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = vehiclePropertyFavorite.ListItems.indexOf(item);
                vehiclePropertyFavorite.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            vehiclePropertyFavorite.ListItems.unshift(newItem);
    }

    vehiclePropertyFavorite.deleteRow = function () {
        if (!vehiclePropertyFavorite.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                vehiclePropertyFavorite.busyIndicator.isActive = true;
                console.log(vehiclePropertyFavorite.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'VehiclePropertyFavorite/GetOne', vehiclePropertyFavorite.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    vehiclePropertyFavorite.selectedItemForDelete = response.Item;
                    console.log(vehiclePropertyFavorite.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'VehiclePropertyFavorite/delete', vehiclePropertyFavorite.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        vehiclePropertyFavorite.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            vehiclePropertyFavorite.replaceItem(vehiclePropertyFavorite.selectedItemForDelete.Id);
                            vehiclePropertyFavorite.gridOptions.fillData(vehiclePropertyFavorite.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        vehiclePropertyFavorite.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    vehiclePropertyFavorite.busyIndicator.isActive = false;

                });
            }
        });
    }

    vehiclePropertyFavorite.searchData = function () {
        vehiclePropertyFavorite.gridOptions.searchData();

    }

    vehiclePropertyFavorite.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkContentId', displayName: 'کد سیستمی ملک', sortable: true, type: 'integer', visible: true },
            { name: 'LinkMemberId', displayName: 'کد سیستمی عضو', sortable: true, type: 'integer', visible: true },
            { name: 'Like', displayName: 'پسندیدم', sortable: true, type: 'string', visible: true, isCheckBox: true },
            { name: 'Dislike', displayName: 'نپسندیدم', sortable: true, type: 'string', visible: true, isCheckBox: true }
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

    vehiclePropertyFavorite.gridOptions.reGetAll = function () {
        vehiclePropertyFavorite.init();
    }

    vehiclePropertyFavorite.gridOptions.onRowSelected = function () {

    }

    vehiclePropertyFavorite.columnCheckbox = false;
    vehiclePropertyFavorite.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (vehiclePropertyFavorite.gridOptions.columnCheckbox) {
            for (var i = 0; i < vehiclePropertyFavorite.gridOptions.columns.length; i++) {
                //vehiclePropertyFavorite.gridOptions.columns[i].visible = $("#" + vehiclePropertyFavorite.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + vehiclePropertyFavorite.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                vehiclePropertyFavorite.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = vehiclePropertyFavorite.gridOptions.columns;
            for (var i = 0; i < vehiclePropertyFavorite.gridOptions.columns.length; i++) {
                vehiclePropertyFavorite.gridOptions.columns[i].visible = true;
                var element = $("#" + vehiclePropertyFavorite.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + vehiclePropertyFavorite.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < vehiclePropertyFavorite.gridOptions.columns.length; i++) {
            console.log(vehiclePropertyFavorite.gridOptions.columns[i].name.concat(".visible: "), vehiclePropertyFavorite.gridOptions.columns[i].visible);
        }
        vehiclePropertyFavorite.gridOptions.columnCheckbox = !vehiclePropertyFavorite.gridOptions.columnCheckbox;
    }

    vehiclePropertyFavorite.goToDetails = function (proprtyId) {
        $state.go('index.vehiclepropertydetail', { propertyParam: proprtyId });
    }

}]);

