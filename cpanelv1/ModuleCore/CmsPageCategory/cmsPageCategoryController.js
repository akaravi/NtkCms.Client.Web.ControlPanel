app.controller("cmsPageCategoryGridCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var cmsPageCategorygrd = this;

    if (itemRecordStatus != undefined) cmsPageCategorygrd.itemRecordStatus = itemRecordStatus;

    cmsPageCategorygrd.init = function () {
        ajax.call(mainPathApi+"cmsPageCategory/getall", cmsPageCategorygrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsPageCategorygrd.ListItems = response.ListItems;
            cmsPageCategorygrd.gridOptions.fillData(cmsPageCategorygrd.ListItems , response.resultAccess);
            cmsPageCategorygrd.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsPageCategorygrd.gridOptions.totalRowCount = response.TotalRowCount;
            cmsPageCategorygrd.gridOptions.rowPerPage = response.RowPerPage;
            cmsPageCategorygrd.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            cmsPageCategorygrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsPageCategorygrd.addRequested = false;
    cmsPageCategorygrd.openAddModal = function () {
        cmsPageCategorygrd.modalTitle = 'اضافه';
        ajax.call(mainPathApi+'cmsPageCategory/getviewmodel', '0', 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsPageCategorygrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsPageCategory/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsPageCategorygrd.addNewRow = function (frm) {
        if (frm.$invalid)
            return;

        cmsPageCategorygrd.addRequested = true;
        ajax.call(mainPathApi+'cmsPageCategory/add', cmsPageCategorygrd.selectedItem, 'POST').success(function (response) {
            cmsPageCategorygrd.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsPageCategorygrd.ListItems.unshift(response.Item);
                cmsPageCategorygrd.gridOptions.fillData(cmsPageCategorygrd.ListItems);
                cmsPageCategorygrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsPageCategorygrd.addRequested = false;
        });
    }


    cmsPageCategorygrd.openEditModal = function () {
        cmsPageCategorygrd.modalTitle = 'ویرایش';
        if (!cmsPageCategorygrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        ajax.call(mainPathApi+'cmsPageCategory/getviewmodel', cmsPageCategorygrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsPageCategorygrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsPageCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsPageCategorygrd.editRow = function (frm) {
        if (frm.$invalid)
            return;

        ajax.call(mainPathApi+'cmsPageCategory/edit', cmsPageCategorygrd.selectedItem, 'PUT').success(function (response) {
            cmsPageCategorygrd.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsPageCategorygrd.addRequested = false;
                cmsPageCategorygrd.replaceItem(cmsPageCategorygrd.selectedItem.Id, response.Item);
                cmsPageCategorygrd.gridOptions.fillData(cmsPageCategorygrd.ListItems);
                cmsPageCategorygrd.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsPageCategorygrd.addRequested = false;
        });
    }


    cmsPageCategorygrd.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsPageCategorygrd.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsPageCategorygrd.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsPageCategorygrd.ListItems.indexOf(item);
                cmsPageCategorygrd.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsPageCategorygrd.ListItems.unshift(newItem);
    }

    cmsPageCategorygrd.deleteRow = function () {
        if (!cmsPageCategorygrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                ajax.call(mainPathApi+'cmsPageCategory/getviewmodel', cmsPageCategorygrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsPageCategorygrd.selectedItemForDelete = response.Item;
                    ajax.call(mainPathApi+'cmsPageCategory/delete', cmsPageCategorygrd.selectedItemForDelete, 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsPageCategorygrd.replaceItem(cmsPageCategorygrd.selectedItemForDelete.Id);
                            cmsPageCategorygrd.gridOptions.fillData(cmsPageCategorygrd.ListItems);
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

    cmsPageCategorygrd.searchData = function () {
        cmsPageCategorygrd.gridOptions.serachData();
    }

    cmsPageCategorygrd.linkParentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkLinkParentIdId',
        url: 'LinkParentId',
        scope: cmsPageCategorygrd,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true ,type: 'string'}
            ]
        }
    }

    cmsPageCategorygrd.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string'},
            { name: 'LinkParentId.Title', displayName: 'انتخاب والد', sortable: true, displayForce: true, type: 'string'},
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }


    cmsPageCategorygrd.gridOptions.reGetAll = function () {
        cmsPageCategorygrd.init();
    }

}]);