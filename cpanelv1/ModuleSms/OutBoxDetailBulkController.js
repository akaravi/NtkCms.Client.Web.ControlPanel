app.controller("outBoxDetailBulkCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var outBoxDetailBulk = this;
    outBoxDetailBulk.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"outBoxDetailBulk/getall", outBoxDetailBulk.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            outBoxDetailBulk.ListItems = response.ListItems;
            outBoxDetailBulk.gridOptions.fillData(outBoxDetailBulk.ListItems);
            outBoxDetailBulk.gridOptions.currentPageNumber = response.CurrentPageNumber;
            outBoxDetailBulk.gridOptions.totalRowCount = response.TotalRowCount;
            outBoxDetailBulk.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            outBoxDetailBulk.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    outBoxDetailBulk.addRequested = false;
    outBoxDetailBulk.openAddModal = function () {
        outBoxDetailBulk.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'outBoxDetailBulk/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            outBoxDetailBulk.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleNews/outBoxDetailBulk/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    outBoxDetailBulk.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        outBoxDetailBulk.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'outBoxDetailBulk/add', outBoxDetailBulk.selectedItem , 'POST').success(function (response) {
            outBoxDetailBulk.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                outBoxDetailBulk.ListItems.unshift(response.Item);
                outBoxDetailBulk.gridOptions.fillData(outBoxDetailBulk.ListItems);
                outBoxDetailBulk.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            outBoxDetailBulk.addRequested = false;
        });
    }

    outBoxDetailBulk.openEditModal = function () {
        outBoxDetailBulk.modalTitle = 'ویرایش';
        if (!outBoxDetailBulk.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'outBoxDetailBulk/GetOne', outBoxDetailBulk.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            outBoxDetailBulk.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleNews/outBoxDetailBulk/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    outBoxDetailBulk.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'outBoxDetailBulk/edit', outBoxDetailBulk.selectedItem , 'PUT').success(function (response) {
            outBoxDetailBulk.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                outBoxDetailBulk.addRequested = false;
                outBoxDetailBulk.replaceItem(outBoxDetailBulk.selectedItem.Id, response.Item);
                outBoxDetailBulk.gridOptions.fillData(outBoxDetailBulk.ListItems);
                outBoxDetailBulk.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            outBoxDetailBulk.addRequested = false;
        });
    }

    outBoxDetailBulk.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'outBoxDetailBulk/edit',  outBoxDetailBulk.selectedItem , 'PUT').success(function (response) {
            outBoxDetailBulk.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                outBoxDetailBulk.addRequested = false;
                outBoxDetailBulk.treeConfig.currentNode.Name = response.Item.Name;
                outBoxDetailBulk.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            outBoxDetailBulk.addRequested = false;
        });
    }






    outBoxDetailBulk.closeModal = function () {
        $modalStack.dismissAll();
    };

    outBoxDetailBulk.replaceItem = function (oldId, newItem) {
        angular.forEach(outBoxDetailBulk.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = outBoxDetailBulk.ListItems.indexOf(item);
                outBoxDetailBulk.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            outBoxDetailBulk.ListItems.unshift(newItem);
    }

    outBoxDetailBulk.deleteRow = function () {
        if (!outBoxDetailBulk.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(outBoxDetailBulk.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'outBoxDetailBulk/GetOne',  outBoxDetailBulk.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    outBoxDetailBulk.selectedItemForDelete = response.Item;
                    console.log(outBoxDetailBulk.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'outBoxDetailBulk/delete',  outBoxDetailBulk.selectedItemForDelete , 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            outBoxDetailBulk.replaceItem(outBoxDetailBulk.selectedItemForDelete.Id);
                            outBoxDetailBulk.gridOptions.fillData(outBoxDetailBulk.ListItems);
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

    outBoxDetailBulk.searchData = function () {
        outBoxDetailBulk.gridOptions.serachData();
    }

    outBoxDetailBulk.gridOptions = {
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

    outBoxDetailBulk.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            outBoxDetailBulk.focusExpireLockAccount = true;
        });
    };

    outBoxDetailBulk.gridOptions.reGetAll = function () {
        outBoxDetailBulk.init();
    }

}]);