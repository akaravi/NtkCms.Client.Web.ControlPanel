app.controller("cmsModulePaymentProcessCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $state, $filter) {
    var cmsMdlPayPrc = this;
    if (itemRecordStatus != undefined) cmsMdlPayPrc.itemRecordStatus = itemRecordStatus;

    // Show Loading Indicator
    cmsMdlPayPrc.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }

    cmsMdlPayPrc.cmsModulesListItems = [];
    cmsMdlPayPrc.init = function () {
        cmsMdlPayPrc.addRequested = true;
        cmsMdlPayPrc.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"CoreModulePaymentProcess/getall", cmsMdlPayPrc.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsMdlPayPrc.ListItems = response.ListItems;
            cmsMdlPayPrc.gridOptions.fillData(cmsMdlPayPrc.ListItems, response.resultAccess);
            cmsMdlPayPrc.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsMdlPayPrc.gridOptions.totalRowCount = response.TotalRowCount;
            cmsMdlPayPrc.gridOptions.rowPerPage = response.RowPerPage;
            cmsMdlPayPrc.gridOptions.maxSize = 5;
            cmsMdlPayPrc.addRequested = false;
            cmsMdlPayPrc.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            cmsMdlPayPrc.gridOptions.fillData();
            cmsMdlPayPrc.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"CoreModule/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsMdlPayPrc.cmsModulesListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }

    cmsMdlPayPrc.openAddModal = function () {
        cmsMdlPayPrc.modalTitle = 'اضافه';
        cmsMdlPayPrc.addRequested = true;
        cmsMdlPayPrc.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcess/GetViewModel', '', 'GET').success(function (response) {
            cmsMdlPayPrc.addRequested = false;
            cmsMdlPayPrc.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            cmsMdlPayPrc.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsModulePaymentProcess/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsMdlPayPrc.autoAdd = function () {
        cmsMdlPayPrc.addRequested =true;
        ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcess/AutoAdd', '', 'POST').success(function (response) {
            cmsMdlPayPrc.addRequested = false;
            rashaErManage.checkAction(response);
            cmsMdlPayPrc.init();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsMdlPayPrc.addNewRow = function (frm) {
        if (frm.$invalid)
            return;
        cmsMdlPayPrc.addRequested = true;
        cmsMdlPayPrc.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcess/add', cmsMdlPayPrc.selectedItem, 'POST').success(function (response) {
            cmsMdlPayPrc.busyIndicator.isActive = false;
            cmsMdlPayPrc.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsMdlPayPrc.ListItems.unshift(response.Item);
                cmsMdlPayPrc.gridOptions.fillData(cmsMdlPayPrc.ListItems);
                cmsMdlPayPrc.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsMdlPayPrc.addRequested = false;
        });
    }

    cmsMdlPayPrc.openEditModal = function () {
        cmsMdlPayPrc.modalTitle = 'ویرایش';
        if (!cmsMdlPayPrc.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        cmsMdlPayPrc.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcess/GetOne', cmsMdlPayPrc.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            cmsMdlPayPrc.addRequested = false;
            rashaErManage.checkAction(response);
            cmsMdlPayPrc.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsModulePaymentProcess/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsMdlPayPrc.editRow = function (frm) {
        if (frm.$invalid)
            return;
        var myControlerAdd = "";
        if (cmsMdlPayPrc.selectedItem.AutoEdit) myControlerAdd = "Auto";
        cmsMdlPayPrc.busyIndicator.isActive = true;
        cmsMdlPayPrc.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcess/edit' + myControlerAdd, cmsMdlPayPrc.selectedItem, 'PUT').success(function (response) {
            cmsMdlPayPrc.busyIndicator.isActive = false;
            cmsMdlPayPrc.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsMdlPayPrc.addRequested = false;
                cmsMdlPayPrc.replaceItem(cmsMdlPayPrc.selectedItem.Id, response.Item);
                cmsMdlPayPrc.gridOptions.fillData(cmsMdlPayPrc.ListItems);
                cmsMdlPayPrc.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsMdlPayPrc.addRequested = false;
        });
    }

    cmsMdlPayPrc.closeModal = function () {
        $modalStack.dismissAll();
    }

    cmsMdlPayPrc.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsMdlPayPrc.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsMdlPayPrc.ListItems.indexOf(item);
                cmsMdlPayPrc.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsMdlPayPrc.ListItems.unshift(newItem);
    }

    cmsMdlPayPrc.deleteRow = function () {
        if (!cmsMdlPayPrc.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                cmsMdlPayPrc.addRequested = true;
                ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcess/GetOne', cmsMdlPayPrc.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsMdlPayPrc.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcess/delete', cmsMdlPayPrc.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        cmsMdlPayPrc.addRequested = false;
                        if (res.IsSuccess) {
                            cmsMdlPayPrc.replaceItem(cmsMdlPayPrc.selectedItemForDelete.Id);
                            cmsMdlPayPrc.gridOptions.fillData(cmsMdlPayPrc.ListItems);
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

    cmsMdlPayPrc.searchData = function () {
        cmsMdlPayPrc.gridOptions.serachData();
    }

    if (itemRecordStatus != undefined) cmsMdlPayPrc.itemRecordStatus = itemRecordStatus;

    cmsMdlPayPrc.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
            { name: 'Title', displayName: 'عنوان', sortable: true },
            { name: 'TitleEn', displayName: 'عنوان لاتین', sortable: true },
            { name: 'ProcessName', displayName: 'نام فعالیت', sortable: true },
            { name: 'virtual_CmsModule.Title', displayName: 'عنوان ماژول', sortable: true, displayForce: true },
            { name: 'Actionkey', displayName: 'بکارگیری فعالیت ها', sortable: true, type: 'string', displayForce: true, template: '<button class="btn btn-success" ng-click="cmsMdlPayPrc.goToPrivateConfig(x.Id)"><i class="fa fa-cog" aria-hidden="false"></i>&nbsp;فعالیت</button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "Id",
                SortType: 0,
                NeedToRunFakePagination: false,
                TotalRowData: 2000,
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: [],
                Count: false
            }
        }
    }

    cmsMdlPayPrc.gridOptions.reGetAll = function () {
        cmsMdlPayPrc.init();
    }
    cmsMdlPayPrc.goToPrivateConfig = function (selectedId) {
        $state.go("index.cmsmodulepaymentprocesscustomize", { cmsMdlPayPrcId: selectedId });
    }
    cmsMdlPayPrc.gridOptions.onRowSelected = function () { }

}]);