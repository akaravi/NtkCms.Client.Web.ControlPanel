app.controller("cmsSiteUserRoleGridCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var cmsSiteUserRolegrd = this;
    cmsSiteUserRolegrd.init = function () {
        ajax.call(mainPathApi+"cmsSiteUserRole/getall", cmsSiteUserRolegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSiteUserRolegrd.ListItems = response.ListItems;
            cmsSiteUserRolegrd.gridOptions.fillData(cmsSiteUserRolegrd.ListItems, response.resultAccess);
            cmsSiteUserRolegrd.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsSiteUserRolegrd.gridOptions.totalRowCount = response.TotalRowCount;
            cmsSiteUserRolegrd.gridOptions.rowPerPage = response.RowPerPage;
            cmsSiteUserRolegrd.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            cmsSiteUserRolegrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsSiteUserRolegrd.addRequested = false;
    cmsSiteUserRolegrd.openAddModal = function () {
        cmsSiteUserRolegrd.modalTitle = 'اضافه';
        ajax.call(mainPathApi+'cmsSiteUserRole/getviewmodel', 0, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSiteUserRolegrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsSiteUserRole/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsSiteUserRolegrd.addNewRow = function (frm) {
        if (frm.$invalid)
            return;
        cmsSiteUserRolegrd.addRequested = true;
        ajax.call(mainPathApi+'cmsSiteUserRole/add', cmsSiteUserRolegrd.selectedItem, 'POST').success(function (response) {
            cmsSiteUserRolegrd.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsSiteUserRolegrd.ListItems.unshift(response.Item);
                cmsSiteUserRolegrd.gridOptions.fillData(cmsSiteUserRolegrd.ListItems);
                cmsSiteUserRolegrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsSiteUserRolegrd.addRequested = false;
        });
    }

    cmsSiteUserRolegrd.openEditModal = function () {
        cmsSiteUserRolegrd.modalTitle = 'ویرایش';
        if (!cmsSiteUserRolegrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        ajax.call(mainPathApi+'cmsSiteUserRole/getviewmodel', cmsSiteUserRolegrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSiteUserRolegrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsSiteUserRole/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    cmsSiteUserRolegrd.editRow = function (frm) {
        if (frm.$invalid)
            return;
        ajax.call(mainPathApi+'cmsSiteUserRole/edit', cmsSiteUserRolegrd.selectedItem, 'PUT').success(function (response) {
            cmsSiteUserRolegrd.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsSiteUserRolegrd.addRequested = false;
                cmsSiteUserRolegrd.replaceItem(cmsSiteUserRolegrd.selectedItem.Id, response.Item);
                cmsSiteUserRolegrd.gridOptions.fillData(cmsSiteUserRolegrd.ListItems);
                cmsSiteUserRolegrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsSiteUserRolegrd.addRequested = false;
        });
    }

    cmsSiteUserRolegrd.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsSiteUserRolegrd.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsSiteUserRolegrd.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsSiteUserRolegrd.ListItems.indexOf(item);
                cmsSiteUserRolegrd.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsSiteUserRolegrd.ListItems.unshift(newItem);
    }

    cmsSiteUserRolegrd.deleteRow = function () {
        if (!cmsSiteUserRolegrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                ajax.call(mainPathApi+'cmsSiteUserRole/getviewmodel', cmsSiteUserRolegrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsSiteUserRolegrd.selectedItemForDelete = response.Item;
                    ajax.call(mainPathApi+'cmsSiteUserRole/delete', cmsSiteUserRolegrd.selectedItemForDelete, 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsSiteUserRolegrd.replaceItem(cmsSiteUserRolegrd.selectedItemForDelete.Id);
                            cmsSiteUserRolegrd.gridOptions.fillData(cmsSiteUserRolegrd.ListItems);
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

    cmsSiteUserRolegrd.searchData = function () {
        cmsSiteUserRolegrd.gridOptions.serachData();
    }

    cmsSiteUserRolegrd.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
            { name: 'HasAccess', displayName: 'آیا دسترسی دارد ؟', sortable: true, isCheckBox: true },
            { name: 'LinkSiteId.Title', displayName: 'انتخاب سایت', sortable: true, displayForce: true },
            { name: 'LinkRoleId.Title', displayName: 'انتخاب نقش', sortable: true, displayForce: true },
            { name: 'LinkSiteUserId.Title', displayName: 'انتخاب کاربر در سایت', sortable: true, displayForce: true },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    cmsSiteUserRolegrd.gridOptions.reGetAll = function () {
        cmsSiteUserRolegrd.init();
    }
}]);