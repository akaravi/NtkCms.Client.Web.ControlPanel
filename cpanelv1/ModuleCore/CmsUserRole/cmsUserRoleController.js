app.controller("cmsUserRoleGridCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var cmsUserRolegrd = this;
    cmsUserRolegrd.init = function () {
        ajax.call(mainPathApi+"cmsUserRole/getall", cmsUserRolegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsUserRolegrd.ListItems = response.ListItems;
            cmsUserRolegrd.gridOptions.fillData(cmsUserRolegrd.ListItems, response.resultAccess);
            cmsUserRolegrd.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsUserRolegrd.gridOptions.totalRowCount = response.TotalRowCount;
            cmsUserRolegrd.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            cmsUserRolegrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsUserRolegrd.addRequested = false;
    cmsUserRolegrd.openAddModal = function () {
        cmsUserRolegrd.modalTitle = 'اضافه';
        ajax.call(mainPathApi+'cmsUserRole/getviewmodel', '0', 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsUserRolegrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsUserRole/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsUserRolegrd.addNewRow = function (frm) {
        if (frm.$invalid)
            return;

        cmsUserRolegrd.addRequested = true;
        ajax.call(mainPathApi+'cmsUserRole/add', cmsUserRolegrd.selectedItem, 'POST').success(function (response) {
            cmsUserRolegrd.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsUserRolegrd.ListItems.unshift(response.Item);
                cmsUserRolegrd.gridOptions.fillData(cmsUserRolegrd.ListItems);
                cmsUserRolegrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsUserRolegrd.addRequested = false;
        });
    }

    cmsUserRolegrd.openEditModal = function () {
        cmsUserRolegrd.modalTitle = 'ویرایش';
        if (!cmsUserRolegrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        ajax.call(mainPathApi+'cmsUserRole/getviewmodel', cmsUserRolegrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsUserRolegrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsUserRole/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsUserRolegrd.editRow = function (frm) {
        if (frm.$invalid)
            return;
        ajax.call(mainPathApi+'cmsUserRole/edit', cmsUserRolegrd.selectedItem, 'PUT').success(function (response) {
            cmsUserRolegrd.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsUserRolegrd.addRequested = false;
                cmsUserRolegrd.replaceItem(cmsUserRolegrd.selectedItem.Id, response.Item);
                cmsUserRolegrd.gridOptions.fillData(cmsUserRolegrd.ListItems);
                cmsUserRolegrd.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsUserRolegrd.addRequested = false;
        });
    }

    cmsUserRolegrd.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsUserRolegrd.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsUserRolegrd.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsUserRolegrd.ListItems.indexOf(item);
                cmsUserRolegrd.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsUserRolegrd.ListItems.unshift(newItem);
    }

    cmsUserRolegrd.deleteRow = function () {
        if (!cmsUserRolegrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(cmsUserRolegrd.gridOptions.selectedRow.item);
                ajax.call(mainPathApi+'cmsUserRole/getviewmodel', cmsUserRolegrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsUserRolegrd.selectedItemForDelete = response.Item;
                    console.log(cmsUserRolegrd.selectedItemForDelete);
                    ajax.call(mainPathApi+'cmsUserRole/delete', cmsUserRolegrd.selectedItemForDelete, 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsUserRolegrd.replaceItem(cmsUserRolegrd.selectedItemForDelete.Id);
                            cmsUserRolegrd.gridOptions.fillData(cmsUserRolegrd.ListItems);
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

    cmsUserRolegrd.searchData = function () {
        cmsUserRolegrd.gridOptions.serachData();
    }

    cmsUserRolegrd.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
            { name: 'Title', displayName: 'عنوان', sortable: true },
            { name: 'TitleEn', displayName: 'عوان لاتین', sortable: true },
            { name: 'LinkCategoryId.Title', displayName: 'انتخاب دسته بندی', sortable: true, displayForce: true },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    cmsUserRolegrd.gridOptions.reGetAll = function () {
        cmsUserRolegrd.init();
    }

}]);