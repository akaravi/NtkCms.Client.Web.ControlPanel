app.controller("cmsSiteCategoryGridCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var cmsSiteCategorygrd = this;


    if (itemRecordStatus != undefined) cmsSiteCategorygrd.itemRecordStatus = itemRecordStatus;

    cmsSiteCategorygrd.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"CoreSiteCategory/getall", cmsSiteCategorygrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSiteCategorygrd.ListItems = response.ListItems;
            cmsSiteCategorygrd.gridOptions.fillData(cmsSiteCategorygrd.ListItems , response.resultAccess);
            cmsSiteCategorygrd.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsSiteCategorygrd.gridOptions.totalRowCount = response.TotalRowCount;
            cmsSiteCategorygrd.gridOptions.rowPerPage = response.RowPerPage;
            cmsSiteCategorygrd.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            cmsSiteCategorygrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsSiteCategorygrd.addRequested = false;
    cmsSiteCategorygrd.openAddModal = function () {
        cmsSiteCategorygrd.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'CoreSiteCategory/GetViewModel', '', 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSiteCategorygrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsSiteCategory/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsSiteCategorygrd.addNewRow = function (frm) {
        if (frm.$invalid)
            return;

        cmsSiteCategorygrd.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreSiteCategory/add', cmsSiteCategorygrd.selectedItem, 'POST').success(function (response) {
            cmsSiteCategorygrd.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsSiteCategorygrd.ListItems.unshift(response.Item);
                cmsSiteCategorygrd.gridOptions.fillData(cmsSiteCategorygrd.ListItems);
                cmsSiteCategorygrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsSiteCategorygrd.addRequested = false;
        });
    }


    cmsSiteCategorygrd.openEditModal = function () {
        cmsSiteCategorygrd.modalTitle = 'ویرایش';
        if (!cmsSiteCategorygrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'CoreSiteCategory/GetOne', cmsSiteCategorygrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSiteCategorygrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsSiteCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsSiteCategorygrd.editRow = function (frm) {
        if (frm.$invalid)
            return;

        ajax.call(cmsServerConfig.configApiServerPath+'CoreSiteCategory/edit', cmsSiteCategorygrd.selectedItem, 'PUT').success(function (response) {
            cmsSiteCategorygrd.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsSiteCategorygrd.addRequested = false;
                cmsSiteCategorygrd.replaceItem(cmsSiteCategorygrd.selectedItem.Id, response.Item);
                cmsSiteCategorygrd.gridOptions.fillData(cmsSiteCategorygrd.ListItems);
                cmsSiteCategorygrd.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsSiteCategorygrd.addRequested = false;
        });
    }


    cmsSiteCategorygrd.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsSiteCategorygrd.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsSiteCategorygrd.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsSiteCategorygrd.ListItems.indexOf(item);
                cmsSiteCategorygrd.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsSiteCategorygrd.ListItems.unshift(newItem);
    }

    cmsSiteCategorygrd.deleteRow = function () {
        if (!cmsSiteCategorygrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                ajax.call(cmsServerConfig.configApiServerPath+'CoreSiteCategory/GetOne', cmsSiteCategorygrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsSiteCategorygrd.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreSiteCategory/delete', cmsSiteCategorygrd.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsSiteCategorygrd.replaceItem(cmsSiteCategorygrd.selectedItemForDelete.Id);
                            cmsSiteCategorygrd.gridOptions.fillData(cmsSiteCategorygrd.ListItems);
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

    cmsSiteCategorygrd.searchData = function () {
        cmsSiteCategorygrd.gridOptions.serachData();
    }

    cmsSiteCategorygrd.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'TitleML', displayName: 'عنوان', sortable: true },
            { name: 'Description', displayName: 'توضیحات', sortable: true },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }




    cmsSiteCategorygrd.gridOptions.reGetAll = function () {
        cmsSiteCategorygrd.init();
    }

}]);