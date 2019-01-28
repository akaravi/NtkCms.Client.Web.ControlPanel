app.controller("cmsSiteWidgetCategoryGridCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var cmsSiteWidgetCategorygrd = this;
    cmsSiteWidgetCategorygrd.init = function () {
        ajax.call(mainPathApi+"cmsSiteWidgetCategory/getall", cmsSiteWidgetCategorygrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSiteWidgetCategorygrd.ListItems = response.ListItems;
            cmsSiteWidgetCategorygrd.gridOptions.fillData(cmsSiteWidgetCategorygrd.ListItems, response.resultAccess);
            cmsSiteWidgetCategorygrd.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsSiteWidgetCategorygrd.gridOptions.totalRowCount = response.TotalRowCount;
            cmsSiteWidgetCategorygrd.gridOptions.rowPerPage = response.RowPerPage;
            cmsSiteWidgetCategorygrd.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            cmsSiteWidgetCategorygrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsSiteWidgetCategorygrd.addRequested = false;
    cmsSiteWidgetCategorygrd.openAddModal = function () {
        cmsSiteWidgetCategorygrd.modalTitle = 'اضافه';
        ajax.call(mainPathApi+'cmsSiteWidgetCategory/getviewmodel', '0', 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSiteWidgetCategorygrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsSiteWidgetCategory/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsSiteWidgetCategorygrd.addNewRow = function (frm) {
        if (frm.$invalid)
            return;

        cmsSiteWidgetCategorygrd.addRequested = true;
        ajax.call(mainPathApi+'cmsSiteWidgetCategory/add', cmsSiteWidgetCategorygrd.selectedItem, 'POST').success(function (response) {
            cmsSiteWidgetCategorygrd.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsSiteWidgetCategorygrd.ListItems.unshift(response.Item);
                cmsSiteWidgetCategorygrd.gridOptions.fillData(cmsSiteWidgetCategorygrd.ListItems);
                cmsSiteWidgetCategorygrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsSiteWidgetCategorygrd.addRequested = false;
        });
    }

    cmsSiteWidgetCategorygrd.openEditModal = function () {
        cmsSiteWidgetCategorygrd.modalTitle = 'ویرایش';
        if (!cmsSiteWidgetCategorygrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        ajax.call(mainPathApi+'cmsSiteWidgetCategory/getviewmodel', cmsSiteWidgetCategorygrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSiteWidgetCategorygrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsSiteWidgetCategory/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsSiteWidgetCategorygrd.editRow = function (frm) {
        if (frm.$invalid)
            return;

        ajax.call(mainPathApi+'cmsSiteWidgetCategory/edit', cmsSiteWidgetCategorygrd.selectedItem, 'PUT').success(function (response) {
            cmsSiteWidgetCategorygrd.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsSiteWidgetCategorygrd.addRequested = false;
                cmsSiteWidgetCategorygrd.replaceItem(cmsSiteWidgetCategorygrd.selectedItem.Id, response.Item);
                cmsSiteWidgetCategorygrd.gridOptions.fillData(cmsSiteWidgetCategorygrd.ListItems);
                cmsSiteWidgetCategorygrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsSiteWidgetCategorygrd.addRequested = false;
        });
    }


    cmsSiteWidgetCategorygrd.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsSiteWidgetCategorygrd.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsSiteWidgetCategorygrd.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsSiteWidgetCategorygrd.ListItems.indexOf(item);
                cmsSiteWidgetCategorygrd.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsSiteWidgetCategorygrd.ListItems.unshift(newItem);
    }

    cmsSiteWidgetCategorygrd.deleteRow = function () {
        if (!cmsSiteWidgetCategorygrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                ajax.call(mainPathApi+'cmsSiteWidgetCategory/getviewmodel', cmsSiteWidgetCategorygrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsSiteWidgetCategorygrd.selectedItemForDelete = response.Item;
                    console.log(cmsSiteWidgetCategorygrd.selectedItemForDelete);
                    ajax.call(mainPathApi+'cmsSiteWidgetCategory/delete', cmsSiteWidgetCategorygrd.selectedItemForDelete, 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsSiteWidgetCategorygrd.replaceItem(cmsSiteWidgetCategorygrd.selectedItemForDelete.Id);
                            cmsSiteWidgetCategorygrd.gridOptions.fillData(cmsSiteWidgetCategorygrd.ListItems);
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

    cmsSiteWidgetCategorygrd.searchData = function () {
        cmsSiteWidgetCategorygrd.gridOptions.serachData();
    }

    cmsSiteWidgetCategorygrd.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
            { name: 'IsActive', displayName: 'آیا فعال است ؟', sortable: true, isCheckBox: true },
            { name: 'LinkSiteId.Title', displayName: 'انتخاب سایت', sortable: true, displayForce: true },
            { name: 'LinkWidgetCategoryId.Title', displayName: 'انتخاب دسته بندی ویجت', sortable: true, displayForce: true },
            { name: 'LinkModuleId.Title', displayName: 'انتخاب ماژول', sortable: true, displayForce: true },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    cmsSiteWidgetCategorygrd.gridOptions.reGetAll = function () {
        cmsSiteWidgetCategorygrd.init();
    }

}]);