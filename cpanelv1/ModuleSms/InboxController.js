app.controller("inboxCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var inbox = this;
    inbox.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"smsinbox/getall", inbox.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            inbox.ListItems = response.ListItems;
            inbox.gridOptions.fillData(inbox.ListItems);
            inbox.gridOptions.currentPageNumber = response.CurrentPageNumber;
            inbox.gridOptions.totalRowCount = response.TotalRowCount;
            inbox.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            inbox.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }



    inbox.addRequested = false;
    inbox.openAddModal = function () {
        inbox.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'smsinbox/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            inbox.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleNews/inbox/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    inbox.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        inbox.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'smsinbox/add', inbox.selectedItem, 'POST').success(function (response) {
            inbox.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                inbox.ListItems.unshift(response.Item);
                inbox.gridOptions.fillData(inbox.ListItems);
                inbox.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            inbox.addRequested = false;
        });
    }


    inbox.openEditModal = function () {
        inbox.modalTitle = 'ویرایش';
        if (!inbox.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'smsinbox/GetOne', inbox.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            inbox.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleNews/inbox/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    inbox.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'smsinbox/edit', inbox.selectedItem, 'PUT').success(function (response) {
            inbox.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                inbox.addRequested = false;
                inbox.replaceItem(inbox.selectedItem.Id, response.Item);
                inbox.gridOptions.fillData(inbox.ListItems);
                inbox.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            inbox.addRequested = false;
        });
    }



    inbox.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'smsinbox/edit', inbox.selectedItem, 'PUT').success(function (response) {
            inbox.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                inbox.addRequested = false;
                inbox.treeConfig.currentNode.Name = response.Item.Name;
                inbox.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            inbox.addRequested = false;
        });
    }






    inbox.closeModal = function () {
        $modalStack.dismissAll();
    };

    inbox.replaceItem = function (oldId, newItem) {
        angular.forEach(inbox.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = inbox.ListItems.indexOf(item);
                inbox.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            inbox.ListItems.unshift(newItem);
    }

    inbox.deleteRow = function () {
        if (!inbox.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(inbox.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'smsinbox/GetOne', inbox.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    inbox.selectedItemForDelete = response.Item;
                    console.log(inbox.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'smsinbox/delete', inbox.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            inbox.replaceItem(inbox.selectedItemForDelete.Id);
                            inbox.gridOptions.fillData(inbox.ListItems);
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

    inbox.searchData = function () {
        inbox.gridOptions.serachData();
    }

    inbox.LinkPageIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkPageId',
        url: 'UserGroup',
        scope: inbox,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    inbox.LinkSiteIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkSiteId',
        url: 'UserGroup',
        scope: inbox,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    inbox.LinkModuleIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkModuleId',
        url: 'UserGroup',
        scope: inbox,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    inbox.LinkParentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkParentId',
        url: 'inbox',
        scope: inbox,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}

            ]
        }
    }

    inbox.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'ReceiverDate', displayName: 'تاریخ دریافت', sortable: true, type: 'date' },
            { name: 'AnalysisDate', displayName: 'تاریخ آنالیز', sortable: true, type: 'date' },
            { name: 'SenderNumber', displayName: 'ارسال کننده', sortable: true, type: 'integer' },
            { name: 'ReceiverNumber', displayName: 'دریافت کننده', sortable: true, type: 'integer' },
            { name: 'Message', displayName: 'پیام', sortable: true, type: 'string' },
            { name: 'ApiNumber', displayName: 'شماره Api', sortable: true, type: 'integer' },
            { name: 'IsRead', displayName: 'خوانده شده', sortable: true, isCheckBox: true, type: 'boolean' },
            { name: 'IsProcessed', displayName: 'پردازش شده', sortable: true, isCheckBox: true, type: 'boolean' },
            { name: 'Credit', displayName: 'اعتبار', sortable: true, type: 'integer' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    inbox.gridOptions.advancedSearchData = {};
    inbox.gridOptions.advancedSearchData.engine = {};
    inbox.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    inbox.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    inbox.gridOptions.advancedSearchData.engine.SortType = 1;
    inbox.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    inbox.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    inbox.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    inbox.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    inbox.gridOptions.advancedSearchData.engine.Filters = [];

    inbox.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            inbox.focusExpireLockAccount = true;
        });
    };



    inbox.gridOptions.reGetAll = function () {
        inbox.init();
    }

}]);