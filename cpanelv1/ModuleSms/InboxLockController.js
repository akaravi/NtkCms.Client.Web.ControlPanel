app.controller("inboxLockCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var inboxLock = this;
    inboxLock.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"smsInboxLock/getall", inboxLock.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            inboxLock.ListItems = response.ListItems;
            inboxLock.gridOptions.fillData(inboxLock.ListItems);
            inboxLock.gridOptions.currentPageNumber = response.CurrentPageNumber;
            inboxLock.gridOptions.totalRowCount = response.TotalRowCount;
            inboxLock.gridOptions.rowPerPage = response.RowPerPage;
           }).error(function (data, errCode, c, d) {
            inboxLock.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    inboxLock.addRequested = false;
    inboxLock.openAddModal = function () {
        inboxLock.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'inboxLock/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            inboxLock.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleNews/inboxLock/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    inboxLock.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        inboxLock.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'inboxLock/add', inboxLock.selectedItem , 'POST').success(function (response) {
            inboxLock.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                inboxLock.ListItems.unshift(response.Item);
                inboxLock.gridOptions.fillData(inboxLock.ListItems);
                inboxLock.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            inboxLock.addRequested = false;
        });
    }

    inboxLock.openEditModal = function () {
        inboxLock.modalTitle = 'ویرایش';
        if (!inboxLock.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'inboxLock/GetOne', inboxLock.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            inboxLock.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleNews/inboxLock/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    inboxLock.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'inboxLock/edit',  inboxLock.selectedItem , 'PUT').success(function (response) {
            inboxLock.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                inboxLock.addRequested = false;
                inboxLock.replaceItem(inboxLock.selectedItem.Id, response.Item);
                inboxLock.gridOptions.fillData(inboxLock.ListItems);
                inboxLock.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            inboxLock.addRequested = false;
        });
    }

    inboxLock.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'inboxLock/edit', inboxLock.selectedItem , 'PUT').success(function (response) {
            inboxLock.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                inboxLock.addRequested = false;
                inboxLock.treeConfig.currentNode.Name = response.Item.Name;
                inboxLock.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            inboxLock.addRequested = false;
        });
    }

    inboxLock.closeModal = function () {
        $modalStack.dismissAll();
    };

    inboxLock.replaceItem = function (oldId, newItem) {
        angular.forEach(inboxLock.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = inboxLock.ListItems.indexOf(item);
                inboxLock.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            inboxLock.ListItems.unshift(newItem);
    }

    inboxLock.deleteRow = function () {
        if (!inboxLock.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(inboxLock.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'inboxLock/GetOne', inboxLock.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    inboxLock.selectedItemForDelete = response.Item;
                    console.log(inboxLock.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'inboxLock/delete', inboxLock.selectedItemForDelete , 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            inboxLock.replaceItem(inboxLock.selectedItemForDelete.Id);
                            inboxLock.gridOptions.fillData(inboxLock.ListItems);
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

    inboxLock.searchData = function () {
        inboxLock.gridOptions.serachData();
    }

    inboxLock.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LockDate', displayName: 'تاریخ قفل شدن', sortable: true, type: 'date' },
            { name: 'ProcessId', displayName: 'شماره پردازش', sortable: true, type: 'integer' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    inboxLock.gridOptions.advancedSearchData = {};
    inboxLock.gridOptions.advancedSearchData.engine = {};
    inboxLock.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    inboxLock.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    inboxLock.gridOptions.advancedSearchData.engine.SortType = 1;
    inboxLock.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    inboxLock.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    inboxLock.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    inboxLock.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    inboxLock.gridOptions.advancedSearchData.engine.Filters = [];

    inboxLock.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            inboxLock.focusExpireLockAccount = true;
        });
    };

    inboxLock.gridOptions.reGetAll = function () {
        inboxLock.init();
    }

}]);