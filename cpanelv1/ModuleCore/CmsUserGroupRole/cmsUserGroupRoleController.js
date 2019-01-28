app.controller("cmsUserGroupRoleGridCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var cmsUserGroupRolegrd = this;
    cmsUserGroupRolegrd.init = function () {
        ajax.call(mainPathApi+"cmsUserGroupRole/getall", cmsUserGroupRolegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsUserGroupRolegrd.ListItems = response.ListItems;
            cmsUserGroupRolegrd.gridOptions.fillData(cmsUserGroupRolegrd.ListItems, response.resultAccess);
            cmsUserGroupRolegrd.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsUserGroupRolegrd.gridOptions.totalRowCount = response.TotalRowCount;
            cmsUserGroupRolegrd.gridOptions.rowPerPage = response.RowPerPage;
            cmsUserGroupRolegrd.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            cmsUserGroupRolegrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsUserGroupRolegrd.addRequested = false;
    cmsUserGroupRolegrd.openAddModal = function () {
        cmsUserGroupRolegrd.modalTitle = 'اضافه';
        ajax.call(mainPathApi+'cmsUserGroupRole/getviewmodel', '0', 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsUserGroupRolegrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsUserGroupRole/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsUserGroupRolegrd.addNewRow = function (frm) {
        if (frm.$invalid)
            return;
        cmsUserGroupRolegrd.addRequested = true;
        ajax.call(mainPathApi+'cmsUserGroupRole/add', cmsUserGroupRolegrd.selectedItem, 'POST').success(function (response) {
            cmsUserGroupRolegrd.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsUserGroupRolegrd.ListItems.unshift(response.Item);
                cmsUserGroupRolegrd.gridOptions.fillData(cmsUserGroupRolegrd.ListItems);
                cmsUserGroupRolegrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsUserGroupRolegrd.addRequested = false;
        });
    }

    cmsUserGroupRolegrd.openEditModal = function () {
        cmsUserGroupRolegrd.modalTitle = 'ویرایش';
        if (!cmsUserGroupRolegrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        ajax.call(mainPathApi+'cmsUserGroupRole/getviewmodel', cmsUserGroupRolegrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsUserGroupRolegrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsUserGroupRole/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsUserGroupRolegrd.editRow = function (frm) {
        if (frm.$invalid)
            return;

        ajax.call(mainPathApi+'cmsUserGroupRole/edit', cmsUserGroupRolegrd.selectedItem, 'PUT').success(function (response) {
            cmsUserGroupRolegrd.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsUserGroupRolegrd.addRequested = false;
                cmsUserGroupRolegrd.replaceItem(cmsUserGroupRolegrd.selectedItem.Id, response.Item);
                cmsUserGroupRolegrd.gridOptions.fillData(cmsUserGroupRolegrd.ListItems);
                cmsUserGroupRolegrd.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsUserGroupRolegrd.addRequested = false;
        });
    }

    cmsUserGroupRolegrd.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsUserGroupRolegrd.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsUserGroupRolegrd.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsUserGroupRolegrd.ListItems.indexOf(item);
                cmsUserGroupRolegrd.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsUserGroupRolegrd.ListItems.unshift(newItem);
    }

    cmsUserGroupRolegrd.deleteRow = function () {
        if (!cmsUserGroupRolegrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(cmsUserGroupRolegrd.gridOptions.selectedRow.item);
                ajax.call(mainPathApi+'cmsUserGroupRole/getviewmodel', cmsUserGroupRolegrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsUserGroupRolegrd.selectedItemForDelete = response.Item;
                    console.log(cmsUserGroupRolegrd.selectedItemForDelete);
                    ajax.call(mainPathApi+'cmsUserGroupRole/delete', cmsUserGroupRolegrd.selectedItemForDelete, 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsUserGroupRolegrd.replaceItem(cmsUserGroupRolegrd.selectedItemForDelete.Id);
                            cmsUserGroupRolegrd.gridOptions.fillData(cmsUserGroupRolegrd.ListItems);
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

    cmsUserGroupRolegrd.searchData = function () {
        cmsUserGroupRolegrd.gridOptions.serachData();
    }

    cmsUserGroupRolegrd.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
            { name: 'HasAccess', displayName: 'آیا دسترسی دارد ؟', sortable: true, isCheckBox: true },
            { name: 'LinkUserGroupId.Title', displayName: 'انتخاب گروه کاربری', sortable: true, displayForce: true },
            { name: 'LinkRoleId.Title', displayName: 'انتخاب قوانین', sortable: true, displayForce: true },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    cmsUserGroupRolegrd.gridOptions.reGetAll = function () {
        cmsUserGroupRolegrd.init();
    }

}]);