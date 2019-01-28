app.controller("cmsUserGroupPageRoleGridCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var cmsUserGroupPageRolegrd = this;
    cmsUserGroupPageRolegrd.init = function () {
        ajax.call(mainPathApi+"cmsUserGroupPageRole/getall", cmsUserGroupPageRolegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsUserGroupPageRolegrd.ListItems = response.ListItems;
            cmsUserGroupPageRolegrd.gridOptions.fillData(cmsUserGroupPageRolegrd.ListItems, response.resultAccess);
            cmsUserGroupPageRolegrd.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsUserGroupPageRolegrd.gridOptions.totalRowCount = response.TotalRowCount;
            cmsUserGroupPageRolegrd.gridOptions.rowPerPage = response.RowPerPage;
            cmsUserGroupPageRolegrd.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            cmsUserGroupPageRolegrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsUserGroupPageRolegrd.addRequested = false;
    cmsUserGroupPageRolegrd.openAddModal = function () {
        cmsUserGroupPageRolegrd.modalTitle = 'اضافه';
        ajax.call(mainPathApi+'cmsUserGroupPageRole/getviewmodel', '0', 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsUserGroupPageRolegrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsUserGroupPageRole/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsUserGroupPageRolegrd.addNewRow = function (frm) {
        if (frm.$invalid)
            return;
        cmsUserGroupPageRolegrd.addRequested = true;
        ajax.call(mainPathApi+'cmsUserGroupPageRole/add', cmsUserGroupPageRolegrd.selectedItem, 'POST').success(function (response) {
            cmsUserGroupPageRolegrd.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsUserGroupPageRolegrd.ListItems.unshift(response.Item);
                cmsUserGroupPageRolegrd.gridOptions.fillData(cmsUserGroupPageRolegrd.ListItems);
                cmsUserGroupPageRolegrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsUserGroupPageRolegrd.addRequested = false;
        });
    }


    cmsUserGroupPageRolegrd.openEditModal = function () {
        cmsUserGroupPageRolegrd.modalTitle = 'ویرایش';
        if (!cmsUserGroupPageRolegrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        ajax.call(mainPathApi+'cmsUserGroupPageRole/getviewmodel', cmsUserGroupPageRolegrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsUserGroupPageRolegrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsUserGroupPageRole/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsUserGroupPageRolegrd.editRow = function (frm) {
        if (frm.$invalid)
            return;
        ajax.call(mainPathApi+'cmsUserGroupPageRole/edit', cmsUserGroupPageRolegrd.selectedItem, 'PUT').success(function (response) {
            cmsUserGroupPageRolegrd.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsUserGroupPageRolegrd.addRequested = false;
                cmsUserGroupPageRolegrd.replaceItem(cmsUserGroupPageRolegrd.selectedItem.Id, response.Item);
                cmsUserGroupPageRolegrd.gridOptions.fillData(cmsUserGroupPageRolegrd.ListItems);
                cmsUserGroupPageRolegrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsUserGroupPageRolegrd.addRequested = false;
        });
    }

    cmsUserGroupPageRolegrd.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsUserGroupPageRolegrd.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsUserGroupPageRolegrd.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsUserGroupPageRolegrd.ListItems.indexOf(item);
                cmsUserGroupPageRolegrd.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsUserGroupPageRolegrd.ListItems.unshift(newItem);
    }

    cmsUserGroupPageRolegrd.deleteRow = function () {
        if (!cmsUserGroupPageRolegrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(cmsUserGroupPageRolegrd.gridOptions.selectedRow.item);
                ajax.call(mainPathApi+'cmsUserGroupPageRole/getviewmodel', cmsUserGroupPageRolegrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsUserGroupPageRolegrd.selectedItemForDelete = response.Item;
                    console.log(cmsUserGroupPageRolegrd.selectedItemForDelete);
                    ajax.call(mainPathApi+'cmsUserGroupPageRole/delete', cmsUserGroupPageRolegrd.selectedItemForDelete, 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsUserGroupPageRolegrd.replaceItem(cmsUserGroupPageRolegrd.selectedItemForDelete.Id);
                            cmsUserGroupPageRolegrd.gridOptions.fillData(cmsUserGroupPageRolegrd.ListItems);
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

    cmsUserGroupPageRolegrd.searchData = function () {
        cmsUserGroupPageRolegrd.gridOptions.serachData();
    }

    cmsUserGroupPageRolegrd.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
            { name: 'HasDisplay', displayName: 'آیا مشاهده شود ؟', sortable: true, isCheckBox: true },
            { name: 'HasEditable', displayName: 'آیا ویرایش شود ؟', sortable: true, isCheckBox: true },
            { name: 'LinkUserGroupId.Title', displayName: 'انتخاب گروه کاربری', sortable: true, displayForce: true },
            { name: 'LinkSiteId.Title', displayName: 'انتخاب سایت', sortable: true, displayForce: true },
            { name: 'LinkPageId.Title', displayName: 'انتخاب صفحه', sortable: true, displayForce: true }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    cmsUserGroupPageRolegrd.gridOptions.reGetAll = function () {
        cmsUserGroupPageRolegrd.init();
    }

}]);