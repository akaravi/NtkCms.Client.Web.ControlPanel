app.controller("cmsModuleProcessGridCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $state, $filter) {
    var cmsModulePrc = this;
    if (itemRecordStatus != undefined) cmsModulePrc.itemRecordStatus = itemRecordStatus;

    // Show Category Loading Indicator
    cmsModulePrc.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }


    cmsModulePrc.cmsModulesListItems = [];
    cmsModulePrc.init = function () {
        cmsModulePrc.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"CoreModuleProcess/getall", cmsModulePrc.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsModulePrc.ListItems = response.ListItems;
            cmsModulePrc.gridOptions.fillData(cmsModulePrc.ListItems, response.resultAccess);
            cmsModulePrc.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsModulePrc.gridOptions.totalRowCount = response.TotalRowCount;
            cmsModulePrc.gridOptions.rowPerPage = response.RowPerPage;
            cmsModulePrc.gridOptions.maxSize = 5;
            cmsModulePrc.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            cmsModulePrc.gridOptions.fillData();
            cmsModulePrc.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"CoreModule/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsModulePrc.cmsModulesListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    cmsModulePrc.addRequested = false;
    cmsModulePrc.openAddModal = function () {
        cmsModulePrc.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcess/GetViewModel', '', 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsModulePrc.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsModuleProcess/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsModulePrc.autoAdd = function () {
        cmsModulePrc.addRequested = true;
        cmsModulePrc.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcess/AutoAdd', '', 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsModulePrc.addRequested = false;
            cmsModulePrc.init();
        }).error(function (data, errCode, c, d) {
            cmsModulePrc.busyIndicator.isActive = false;
            cmsModulePrc.addRequested = false;
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsModulePrc.addNewRow = function (frm) {
        if (frm.$invalid)
            return;
        cmsModulePrc.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcess/add', cmsModulePrc.selectedItem, 'POST').success(function (response) {
            cmsModulePrc.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsModulePrc.ListItems.unshift(response.Item);
                cmsModulePrc.gridOptions.fillData(cmsModulePrc.ListItems);
                cmsModulePrc.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsModulePrc.addRequested = false;
        });
    }

    cmsModulePrc.openEditModal = function () {
        cmsModulePrc.modalTitle = 'ویرایش';
        if (!cmsModulePrc.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcess/GetOne', cmsModulePrc.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsModulePrc.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsModuleProcess/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsModulePrc.editRow = function (frm) {
        if (frm.$invalid)
            return;
        var myControlerAdd = "";
        if (cmsModulePrc.selectedItem.AutoEdit) myControlerAdd = "Auto";
        cmsModulePrc.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcess/edit' + myControlerAdd, cmsModulePrc.selectedItem, 'PUT').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsModulePrc.addRequested = false;
                cmsModulePrc.replaceItem(cmsModulePrc.selectedItem.Id, response.Item);
                cmsModulePrc.gridOptions.fillData(cmsModulePrc.ListItems);
                cmsModulePrc.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsModulePrc.addRequested = false;
        });
    }

    cmsModulePrc.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsModulePrc.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsModulePrc.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsModulePrc.ListItems.indexOf(item);
                cmsModulePrc.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsModulePrc.ListItems.unshift(newItem);
    }

    cmsModulePrc.deleteRow = function () {
        if (!cmsModulePrc.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcess/GetOne', cmsModulePrc.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsModulePrc.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcess/delete', cmsModulePrc.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsModulePrc.replaceItem(cmsModulePrc.selectedItemForDelete.Id);
                            cmsModulePrc.gridOptions.fillData(cmsModulePrc.ListItems);
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

    cmsModulePrc.searchData = function () {
        cmsModulePrc.gridOptions.serachData();
    }

    if (itemRecordStatus != undefined) cmsModulePrc.itemRecordStatus = itemRecordStatus;

    cmsModulePrc.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
            { name: 'TitleML', displayName: 'عنوان', sortable: true },
            { name: 'ProcessName', displayName: 'نام کلاس', sortable: true },
            { name: 'virtual_CmsModule.Title', displayName: 'عنوان ماژول', sortable: true, displayForce: true },
            { name: 'Actionkey', displayName: 'بکارگیری فعالیت ها', sortable: true, type: 'string', displayForce: true, template: '<button class="btn btn-success" ng-click="cmsModulePrc.goToPrivateConfig(x.Id)"><i class="fa fa-cog" aria-hidden="false"></i>&nbsp;فعالیت</button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {
                CurrentPageNumber : 1,
                SortColumn : "Id",
                SortType : 1,
                NeedToRunFakePagination : false,
                TotalRowData : 2000,
                RowPerPage : 10,
                ContentFullSearch : null,
                Filters : [],
             }
        }
    }
    cmsModulePrc.gridOptions.advancedSearchData = {};
    cmsModulePrc.gridOptions.advancedSearchData.engine = {};
    cmsModulePrc.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    cmsModulePrc.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    cmsModulePrc.gridOptions.advancedSearchData.engine.SortType = 1;
    cmsModulePrc.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    cmsModulePrc.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    cmsModulePrc.gridOptions.advancedSearchData.engine.RowPerPage = 10;
    cmsModulePrc.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    cmsModulePrc.gridOptions.advancedSearchData.engine.Filters = [];

    cmsModulePrc.gridOptions.reGetAll = function () {
        cmsModulePrc.init();
    }
    cmsModulePrc.goToPrivateConfig = function (selectedId) {
        $state.go("index.cmsmoduleprocesscustomize", { cmsModulePrcId: selectedId });
    }

    cmsModulePrc.gridOptions.onRowSelected = function () { }

    cmsModulePrc.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"CoreModuleProcess/count", cmsModulePrc.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsModulePrc.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            cmsModulePrc.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);