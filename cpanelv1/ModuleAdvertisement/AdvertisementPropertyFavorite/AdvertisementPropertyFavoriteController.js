app.controller("advertisementPropertyFavoriteController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $state, $filter) {
    var advertisementPropertyFavorite = this;
    advertisementPropertyFavorite.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    advertisementPropertyFavorite.ListItems = [];
    if (itemRecordStatus != undefined) advertisementPropertyFavorite.itemRecordStatus = itemRecordStatus;

    advertisementPropertyFavorite.init = function () {
        advertisementPropertyFavorite.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"advertisementPropertyFavorite/getall", advertisementPropertyFavorite.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            advertisementPropertyFavorite.busyIndicator.isActive = false;
            advertisementPropertyFavorite.ListItems = response.ListItems;
            advertisementPropertyFavorite.gridOptions.fillData(advertisementPropertyFavorite.ListItems, response.resultAccess);
            advertisementPropertyFavorite.gridOptions.currentPageNumber = response.CurrentPageNumber;
            advertisementPropertyFavorite.gridOptions.totalRowCount = response.TotalRowCount;
            advertisementPropertyFavorite.gridOptions.rowPerPage = response.RowPerPage;
            advertisementPropertyFavorite.allowedSearch = response.AllowedSearchField;

        }).error(function (data, errCode, c, d) {
            advertisementPropertyFavorite.busyIndicator.isActive = false;
            advertisementPropertyFavorite.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    advertisementPropertyFavorite.busyIndicator.isActive = true;
    advertisementPropertyFavorite.addRequested = false;
    advertisementPropertyFavorite.openAddModal = function () {
        advertisementPropertyFavorite.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementPropertyFavorite/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            advertisementPropertyFavorite.busyIndicator.isActive = false;
            advertisementPropertyFavorite.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleAdvertisement/AdvertisementPropertyFavorite/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            advertisementPropertyFavorite.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    advertisementPropertyFavorite.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        advertisementPropertyFavorite.busyIndicator.isActive = true;
        advertisementPropertyFavorite.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementPropertyFavorite/add', advertisementPropertyFavorite.selectedItem, 'POST').success(function (response) {
            advertisementPropertyFavorite.addRequested = false;
            advertisementPropertyFavorite.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                advertisementPropertyFavorite.ListItems.unshift(response.Item);
                advertisementPropertyFavorite.gridOptions.fillData(advertisementPropertyFavorite.ListItems);
                advertisementPropertyFavorite.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            advertisementPropertyFavorite.busyIndicator.isActive = false;
            advertisementPropertyFavorite.addRequested = false;
        });
    }

    advertisementPropertyFavorite.openEditModal = function () {
        advertisementPropertyFavorite.modalTitle = 'ویرایش';
        if (!advertisementPropertyFavorite.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementPropertyFavorite/GetOne', advertisementPropertyFavorite.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            advertisementPropertyFavorite.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleAdvertisement/AdvertisementPropertyFavorite/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    advertisementPropertyFavorite.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        advertisementPropertyFavorite.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementPropertyFavorite/edit', advertisementPropertyFavorite.selectedItem, 'PUT').success(function (response) {
            advertisementPropertyFavorite.addRequested = true;
            rashaErManage.checkAction(response);
            advertisementPropertyFavorite.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                advertisementPropertyFavorite.addRequested = false;
                advertisementPropertyFavorite.replaceItem(advertisementPropertyFavorite.selectedItem.Id, response.Item);
                advertisementPropertyFavorite.gridOptions.fillData(advertisementPropertyFavorite.ListItems);
                advertisementPropertyFavorite.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            advertisementPropertyFavorite.addRequested = false;
            advertisementPropertyFavorite.busyIndicator.isActive = false;

        });
    }

    advertisementPropertyFavorite.closeModal = function () {
        $modalStack.dismissAll();
    };

    advertisementPropertyFavorite.replaceItem = function (oldId, newItem) {
        angular.forEach(advertisementPropertyFavorite.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = advertisementPropertyFavorite.ListItems.indexOf(item);
                advertisementPropertyFavorite.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            advertisementPropertyFavorite.ListItems.unshift(newItem);
    }

    advertisementPropertyFavorite.deleteRow = function () {
        if (!advertisementPropertyFavorite.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                advertisementPropertyFavorite.busyIndicator.isActive = true;
                console.log(advertisementPropertyFavorite.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementPropertyFavorite/GetOne', advertisementPropertyFavorite.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    advertisementPropertyFavorite.selectedItemForDelete = response.Item;
                    console.log(advertisementPropertyFavorite.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementPropertyFavorite/delete', advertisementPropertyFavorite.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        advertisementPropertyFavorite.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            advertisementPropertyFavorite.replaceItem(advertisementPropertyFavorite.selectedItemForDelete.Id);
                            advertisementPropertyFavorite.gridOptions.fillData(advertisementPropertyFavorite.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        advertisementPropertyFavorite.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    advertisementPropertyFavorite.busyIndicator.isActive = false;

                });
            }
        });
    }

    advertisementPropertyFavorite.searchData = function () {
        advertisementPropertyFavorite.gridOptions.searchData();

    }

    advertisementPropertyFavorite.gridOptions = {
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

    advertisementPropertyFavorite.gridOptions.reGetAll = function () {
        advertisementPropertyFavorite.init();
    }

    advertisementPropertyFavorite.gridOptions.onRowSelected = function () {

    }

    advertisementPropertyFavorite.columnCheckbox = false;
    advertisementPropertyFavorite.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (advertisementPropertyFavorite.gridOptions.columnCheckbox) {
            for (var i = 0; i < advertisementPropertyFavorite.gridOptions.columns.length; i++) {
                //advertisementPropertyFavorite.gridOptions.columns[i].visible = $("#" + advertisementPropertyFavorite.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + advertisementPropertyFavorite.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                advertisementPropertyFavorite.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = advertisementPropertyFavorite.gridOptions.columns;
            for (var i = 0; i < advertisementPropertyFavorite.gridOptions.columns.length; i++) {
                advertisementPropertyFavorite.gridOptions.columns[i].visible = true;
                var element = $("#" + advertisementPropertyFavorite.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + advertisementPropertyFavorite.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < advertisementPropertyFavorite.gridOptions.columns.length; i++) {
            console.log(advertisementPropertyFavorite.gridOptions.columns[i].name.concat(".visible: "), advertisementPropertyFavorite.gridOptions.columns[i].visible);
        }
        advertisementPropertyFavorite.gridOptions.columnCheckbox = !advertisementPropertyFavorite.gridOptions.columnCheckbox;
    }

    advertisementPropertyFavorite.goToDetails = function (proprtyId) {
        $state.go('index.advertisementpropertydetail', { propertyParam: proprtyId });
    }

}]);

