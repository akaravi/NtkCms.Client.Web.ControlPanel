app.controller("outBoxCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var outBox = this;
    outBox.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"Smsoutbox/getall", outBox.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            outBox.ListItems = response.ListItems;
            outBox.gridOptions.fillData(outBox.ListItems);
            outBox.gridOptions.currentPageNumber = response.CurrentPageNumber;
            outBox.gridOptions.totalRowCount = response.TotalRowCount;
            outBox.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            outBox.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
     }

    outBox.addRequested = false;
    outBox.openAddModal = function () {
        outBox.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'outBox/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            outBox.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleNews/outBox/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    outBox.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        outBox.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'outBox/add',  outBox.selectedItem , 'POST').success(function (response) {
            outBox.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                outBox.ListItems.unshift(response.Item);
                outBox.gridOptions.fillData(outBox.ListItems);
                outBox.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            outBox.addRequested = false;
        });
    }

    outBox.openEditModal = function () {
        outBox.modalTitle = 'ویرایش';
        if (!outBox.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'outBox/GetOne', outBox.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            outBox.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleNews/outBox/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    outBox.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'outBox/edit',  outBox.selectedItem , 'PUT').success(function (response) {
            outBox.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                outBox.addRequested = false;
                outBox.replaceItem(outBox.selectedItem.Id, response.Item);
                outBox.gridOptions.fillData(outBox.ListItems);
                outBox.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            outBox.addRequested = false;
        });
    }

    outBox.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'outBox/edit',  outBox.selectedItem , 'PUT').success(function (response) {
            outBox.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                outBox.addRequested = false;
                outBox.treeConfig.currentNode.Name = response.Item.Name;
                outBox.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            outBox.addRequested = false;
        });
    }

    outBox.closeModal = function () {
        $modalStack.dismissAll();
    };

    outBox.replaceItem = function (oldId, newItem) {
        angular.forEach(outBox.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = outBox.ListItems.indexOf(item);
                outBox.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            outBox.ListItems.unshift(newItem);
    }

    outBox.deleteRow = function () {
        if (!outBox.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(outBox.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'outBox/GetOne',outBox.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    outBox.selectedItemForDelete = response.Item;
                    console.log(outBox.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'outBox/delete',  outBox.selectedItemForDelete , 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            outBox.replaceItem(outBox.selectedItemForDelete.Id);
                            outBox.gridOptions.fillData(outBox.ListItems);
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

    outBox.searchData = function () {
        outBox.gridOptions.serachData();
    }

    outBox.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'RegisterDate', displayName: 'تاریخ ثبت', sortable: true, type: 'date' },
            { name: 'DefaultApiNumber', displayName: 'Api پیش فرض', sortable: true, type: 'integer' },
            { name: 'Memo', displayName: 'متن', sortable: true, type: 'string' },
            { name: 'LinkSiteId.Title', displayName: 'نام سایت', sortable: true, type: 'link' },
            { name: 'Message', displayName: 'پیام', sortable: true, type: 'string' },
            { name: 'ReceiverNumberHidden', displayName: 'شماره مخفی', sortable: true, type: 'integer' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    outBox.gridOptions.advancedSearchData = {};
    outBox.gridOptions.advancedSearchData.engine = {};
    outBox.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    outBox.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    outBox.gridOptions.advancedSearchData.engine.SortType = 1;
    outBox.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    outBox.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    outBox.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    outBox.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    outBox.gridOptions.advancedSearchData.engine.Filters = [];

    outBox.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            outBox.focusExpireLockAccount = true;
        });
    }

    outBox.gridOptions.reGetAll = function () {
        outBox.init();
    }

}]);