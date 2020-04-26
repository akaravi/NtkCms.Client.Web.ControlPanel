app.controller("outBoxDetailBulkLockCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var outBoxDetailBulkLock = this;
    outBoxDetailBulkLock.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"outBoxDetailBulkLock/getall", outBoxDetailBulkLock.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            outBoxDetailBulkLock.ListItems = response.ListItems;
            outBoxDetailBulkLock.gridOptions.fillData(outBoxDetailBulkLock.ListItems);
            outBoxDetailBulkLock.gridOptions.currentPageNumber = response.CurrentPageNumber;
            outBoxDetailBulkLock.gridOptions.totalRowCount = response.TotalRowCount;
            outBoxDetailBulkLock.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            outBoxDetailBulkLock.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    outBoxDetailBulkLock.addRequested = false;
    outBoxDetailBulkLock.openAddModal = function () {
        outBoxDetailBulkLock.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'outBoxDetailBulkLock/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            outBoxDetailBulkLock.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleNews/outBoxDetailBulkLock/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    outBoxDetailBulkLock.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        outBoxDetailBulkLock.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'outBoxDetailBulkLock/add', outBoxDetailBulkLock.selectedItem, 'POST').success(function (response) {
            outBoxDetailBulkLock.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                outBoxDetailBulkLock.ListItems.unshift(response.Item);
                outBoxDetailBulkLock.gridOptions.fillData(outBoxDetailBulkLock.ListItems);
                outBoxDetailBulkLock.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            outBoxDetailBulkLock.addRequested = false;
        });
    }

    outBoxDetailBulkLock.openEditModal = function () {
        outBoxDetailBulkLock.modalTitle = 'ویرایش';
        if (!outBoxDetailBulkLock.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'outBoxDetailBulkLock/GetOne', outBoxDetailBulkLock.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            outBoxDetailBulkLock.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleNews/outBoxDetailBulkLock/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    outBoxDetailBulkLock.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'outBoxDetailBulkLock/edit', outBoxDetailBulkLock.selectedItem, 'PUT').success(function (response) {
            outBoxDetailBulkLock.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                outBoxDetailBulkLock.addRequested = false;
                outBoxDetailBulkLock.replaceItem(outBoxDetailBulkLock.selectedItem.Id, response.Item);
                outBoxDetailBulkLock.gridOptions.fillData(outBoxDetailBulkLock.ListItems);
                outBoxDetailBulkLock.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            outBoxDetailBulkLock.addRequested = false;
        });
    }

    outBoxDetailBulkLock.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'outBoxDetailBulkLock/edit', outBoxDetailBulkLock.selectedItem, 'PUT').success(function (response) {
            outBoxDetailBulkLock.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                outBoxDetailBulkLock.addRequested = false;
                outBoxDetailBulkLock.treeConfig.currentNode.Name = response.Item.Name;
                outBoxDetailBulkLock.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            outBoxDetailBulkLock.addRequested = false;
        });
    }

    outBoxDetailBulkLock.closeModal = function () {
        $modalStack.dismissAll();
    };

    outBoxDetailBulkLock.replaceItem = function (oldId, newItem) {
        angular.forEach(outBoxDetailBulkLock.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = outBoxDetailBulkLock.ListItems.indexOf(item);
                outBoxDetailBulkLock.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            outBoxDetailBulkLock.ListItems.unshift(newItem);
    }

    outBoxDetailBulkLock.deleteRow = function () {
        if (!outBoxDetailBulkLock.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(outBoxDetailBulkLock.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'outBoxDetailBulkLock/GetOne', outBoxDetailBulkLock.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    outBoxDetailBulkLock.selectedItemForDelete = response.Item;
                    console.log(outBoxDetailBulkLock.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'outBoxDetailBulkLock/delete', outBoxDetailBulkLock.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            outBoxDetailBulkLock.replaceItem(outBoxDetailBulkLock.selectedItemForDelete.Id);
                            outBoxDetailBulkLock.gridOptions.fillData(outBoxDetailBulkLock.ListItems);
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
    outBoxDetailBulkLock.searchData = function () {
        outBoxDetailBulkLock.gridOptions.serachData();
    }

    outBoxDetailBulkLock.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true },
            { name: 'Description', displayName: 'توضیحات', sortable: true },
            { name: 'LinkPageId.Title', displayName: 'انتخاب صفحه', sortable: true },
            { name: 'LinkSiteId.Title', displayName: 'انتخاب سایت', sortable: true },
            { name: 'LinkModuleId.Title', displayName: 'انتخاب ماژول', sortable: true },
            { name: 'Category.Title', displayName: 'انتخاب شاخه والد', sortable: true },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    outBoxDetailBulkLock.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            outBoxDetailBulkLock.focusExpireLockAccount = true;
        });
    };

    outBoxDetailBulkLock.gridOptions.reGetAll = function () {
        outBoxDetailBulkLock.init();
    }

}]);