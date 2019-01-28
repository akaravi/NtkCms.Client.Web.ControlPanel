app.controller("cmsWidgetCategoryGridCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var cmsWidgetCategorygrd = this;
    cmsWidgetCategorygrd.init = function () {
        ajax.call(mainPathApi+"cmsWidgetCategory/getall", cmsWidgetCategorygrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsWidgetCategorygrd.ListItems = response.ListItems;
            cmsWidgetCategorygrd.gridOptions.fillData(cmsWidgetCategorygrd.ListItems);
            cmsWidgetCategorygrd.gridOptions.currentPageNumber = response.CurrentPageNumber+1;
            cmsWidgetCategorygrd.gridOptions.totalRowCount = response.TotalRowCount;
            cmsWidgetCategorygrd.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            cmsWidgetCategorygrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsWidgetCategorygrd.addRequested = false;
    cmsWidgetCategorygrd.openAddModal = function () {
        cmsWidgetCategorygrd.modalTitle = 'اضافه';
        ajax.call(mainPathApi+'cmsWidgetCategory/getviewmodel', "0", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsWidgetCategorygrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsWidgetCategory/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsWidgetCategorygrd.addNewRow = function (frm) {
	if (frm.$invalid)
            return;

        cmsWidgetCategorygrd.addRequested = true;
        ajax.call(mainPathApi+'cmsWidgetCategory/add', cmsWidgetCategorygrd.selectedItem , 'POST').success(function (response) {
            cmsWidgetCategorygrd.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsWidgetCategorygrd.ListItems.unshift(response.Item);
                cmsWidgetCategorygrd.gridOptions.fillData(cmsWidgetCategorygrd.ListItems);
                cmsWidgetCategorygrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsWidgetCategorygrd.addRequested = false;
        });
    }


    cmsWidgetCategorygrd.openEditModal=function() {
        cmsWidgetCategorygrd.modalTitle = 'ویرایش';
        if (!cmsWidgetCategorygrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        ajax.call(mainPathApi+'cmsWidgetCategory/getviewmodel', cmsWidgetCategorygrd.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsWidgetCategorygrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsWidgetCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsWidgetCategorygrd.editRow = function (frm) {
	if (frm.$invalid)
            return;

        ajax.call(mainPathApi+'cmsWidgetCategory/edit',  cmsWidgetCategorygrd.selectedItem , 'PUT').success(function (response) {
            cmsWidgetCategorygrd.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsWidgetCategorygrd.addRequested = false;
                cmsWidgetCategorygrd.replaceItem(cmsWidgetCategorygrd.selectedItem.Id, response.Item);
                cmsWidgetCategorygrd.gridOptions.fillData(cmsWidgetCategorygrd.ListItems);
                cmsWidgetCategorygrd.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsWidgetCategorygrd.addRequested = false;
        });
    }


    cmsWidgetCategorygrd.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsWidgetCategorygrd.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsWidgetCategorygrd.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsWidgetCategorygrd.ListItems.indexOf(item);
                cmsWidgetCategorygrd.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsWidgetCategorygrd.ListItems.unshift(newItem);
    }

    cmsWidgetCategorygrd.deleteRow = function () {
        if (!cmsWidgetCategorygrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(cmsWidgetCategorygrd.gridOptions.selectedRow.item);
                ajax.call(mainPathApi+'cmsWidgetCategory/getviewmodel', cmsWidgetCategorygrd.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsWidgetCategorygrd.selectedItemForDelete = response.Item;
                    console.log(cmsWidgetCategorygrd.selectedItemForDelete);
                    ajax.call(mainPathApi+'cmsWidgetCategory/delete', cmsWidgetCategorygrd.selectedItemForDelete , 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsWidgetCategorygrd.replaceItem(cmsWidgetCategorygrd.selectedItemForDelete.Id);
                            cmsWidgetCategorygrd.gridOptions.fillData(cmsWidgetCategorygrd.ListItems);
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

    cmsWidgetCategorygrd.searchData=function() {
        cmsWidgetCategorygrd.gridOptions.serachData();
    }

   cmsWidgetCategorygrd.linkParentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkLinkParentIdId',
        url: 'LinkParentId',
        scope: cmsWidgetCategorygrd,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

cmsWidgetCategorygrd.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'},
            { name: 'LinkParentId.Title', displayName: 'انتخاب والد', sortable: true, type: 'string' },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }




   cmsWidgetCategorygrd.gridOptions.reGetAll = function () {
        cmsWidgetCategorygrd.init();
    }

}]);