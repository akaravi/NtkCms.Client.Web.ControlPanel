app.controller("outBoxDetailCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var outBoxDetail = this;
    outBoxDetail.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"SmsOutBoxDetail/getall", outBoxDetail.gridOptions.advancedSearchData.engine,'POST').success(function (response) {
            rashaErManage.checkAction(response);
            outBoxDetail.ListItems = response.ListItems;
            outBoxDetail.gridOptions.fillData(outBoxDetail.ListItems);
            outBoxDetail.gridOptions.currentPageNumber = response.CurrentPageNumber;
            outBoxDetail.gridOptions.totalRowCount = response.TotalRowCount;
            outBoxDetail.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            outBoxDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    outBoxDetail.addRequested = false;
    outBoxDetail.openAddModal = function () {
        outBoxDetail.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'outBoxDetail/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            outBoxDetail.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleNews/outBoxDetail/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    outBoxDetail.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        outBoxDetail.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'outBoxDetail/add', outBoxDetail.selectedItem, 'POST').success(function (response) {
            outBoxDetail.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                outBoxDetail.ListItems.unshift(response.Item);
                outBoxDetail.gridOptions.fillData(outBoxDetail.ListItems);
                outBoxDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            outBoxDetail.addRequested = false;
        });
    }


    outBoxDetail.openEditModal = function () {
        outBoxDetail.modalTitle = 'ویرایش';
        if (!outBoxDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'outBoxDetail/GetOne', outBoxDetail.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            outBoxDetail.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleNews/outBoxDetail/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    outBoxDetail.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'outBoxDetail/edit', outBoxDetail.selectedItem, 'PUT').success(function (response) {
            outBoxDetail.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                outBoxDetail.addRequested = false;
                outBoxDetail.replaceItem(outBoxDetail.selectedItem.Id, response.Item);
                outBoxDetail.gridOptions.fillData(outBoxDetail.ListItems);
                outBoxDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            outBoxDetail.addRequested = false;
        });
    }

    outBoxDetail.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'outBoxDetail/edit', outBoxDetail.selectedItem, 'PUT').success(function (response) {
            outBoxDetail.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                outBoxDetail.addRequested = false;
                outBoxDetail.treeConfig.currentNode.Name = response.Item.Name;
                outBoxDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            outBoxDetail.addRequested = false;
        });
    }

    outBoxDetail.closeModal = function () {
        $modalStack.dismissAll();
    };

    outBoxDetail.replaceItem = function (oldId, newItem) {
        angular.forEach(outBoxDetail.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = outBoxDetail.ListItems.indexOf(item);
                outBoxDetail.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            outBoxDetail.ListItems.unshift(newItem);
    }

    outBoxDetail.deleteRow = function () {
        if (!outBoxDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(outBoxDetail.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'outBoxDetail/GetOne', outBoxDetail.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    outBoxDetail.selectedItemForDelete = response.Item;
                    console.log(outBoxDetail.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'outBoxDetail/delete', outBoxDetail.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            outBoxDetail.replaceItem(outBoxDetail.selectedItemForDelete.Id);
                            outBoxDetail.gridOptions.fillData(outBoxDetail.ListItems);
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

    outBoxDetail.searchData = function () {
        outBoxDetail.gridOptions.serachData();
    }

    outBoxDetail.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'SenderNumber', displayName: 'فرستنده', sortable: true, type: 'string' },
            { name: 'ReceiverNumber', displayName: 'گیرنده', sortable: true, type: 'string' },
            { name: 'SendDate', displayName: 'تاریخ ارسال', sortable: true, type: 'date' }

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    outBoxDetail.gridOptions.advancedSearchData = {};
    outBoxDetail.gridOptions.advancedSearchData.engine = {};
    outBoxDetail.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    outBoxDetail.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    outBoxDetail.gridOptions.advancedSearchData.engine.SortType = 1;
    outBoxDetail.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    outBoxDetail.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    outBoxDetail.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    outBoxDetail.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    outBoxDetail.gridOptions.advancedSearchData.engine.Filters = [];

    outBoxDetail.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $timeout(function () {
            outBoxDetail.focusExpireLockAccount = true;
        });
    };

    outBoxDetail.gridOptions.reGetAll = function () {
        outBoxDetail.init();
    }

}]);