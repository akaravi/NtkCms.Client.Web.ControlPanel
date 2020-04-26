app.controller("cmsModulePageDependencyGridCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var cmsModulePageDependencygrd = this;

    cmsModulePageDependencygrd.CmsModulesListItems = [];

    var date = moment().format();
    cmsModulePageDependencygrd.ExpirationDate = {
        defaultDate: date
    }

    // Loading Indicator for RashaGrid
    cmsModulePageDependencygrd.busyIndicator = {
        isActive: false,
        message: "در حال بارگذاری "
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    cmsModulePageDependencygrd.init = function () {
        cmsModulePageDependencygrd.addRequested = true;
        cmsModulePageDependencygrd.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"WebDesignerMainPageDependency/getall", cmsModulePageDependencygrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsModulePageDependencygrd.ListItems = response.ListItems;
            cmsModulePageDependencygrd.gridOptions.fillData(cmsModulePageDependencygrd.ListItems, response.resultAccess);
            cmsModulePageDependencygrd.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsModulePageDependencygrd.gridOptions.totalRowCount = response.TotalRowCount;
            cmsModulePageDependencygrd.gridOptions.rowPerPage = response.RowPerPage;
            cmsModulePageDependencygrd.gridOptions.maxSize = 5;
            cmsModulePageDependencygrd.addRequested = false;
            cmsModulePageDependencygrd.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            cmsModulePageDependencygrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"CoreModule/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsModulePageDependencygrd.CmsModulesListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add New Content Modal
    cmsModulePageDependencygrd.addRequested = false;
    cmsModulePageDependencygrd.openAddModal = function () {
        if (buttonIsPressed) { return };
        cmsModulePageDependencygrd.busyIndicator.isActive = true;
        cmsModulePageDependencygrd.modalTitle = 'اضافه';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPageDependency/GetViewModel', '', 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            cmsModulePageDependencygrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/CmsModulePageDependency/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsModulePageDependencygrd.addNewRow = function (frm) {
        if (frm.$invalid)
            return;
        cmsModulePageDependencygrd.busyIndicator.isActive = true;
        cmsModulePageDependencygrd.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPageDependency/add', cmsModulePageDependencygrd.selectedItem, 'POST').success(function (response) {
            cmsModulePageDependencygrd.addRequested = false;
            cmsModulePageDependencygrd.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsModulePageDependencygrd.gridOptions.reGetAll();
                cmsModulePageDependencygrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsModulePageDependencygrd.addRequested = false;
        });
    }
    cmsModulePageDependencygrd.autoAdd = function () {
        cmsModulePageDependencygrd.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPageDependency/AutoAdd', '', 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsModulePageDependencygrd.init();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsModulePageDependencygrd.openEditModal = function () {
        if (buttonIsPressed) { return };
        cmsModulePageDependencygrd.modalTitle = 'ویرایش';
        if (!cmsModulePageDependencygrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPageDependency/GetOne', cmsModulePageDependencygrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            cmsModulePageDependencygrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/CmsModulePageDependency/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsModulePageDependencygrd.editRow = function (frm) {
        if (frm.$invalid)
            return;
        cmsModulePageDependencygrd.addRequested = true;
        cmsModulePageDependencygrd.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPageDependency/edit', cmsModulePageDependencygrd.selectedItem, 'PUT').success(function (response) {
            cmsModulePageDependencygrd.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsModulePageDependencygrd.addRequested = false;
                cmsModulePageDependencygrd.busyIndicator.isActive = true;
                cmsModulePageDependencygrd.gridOptions.reGetAll();
                cmsModulePageDependencygrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsModulePageDependencygrd.addRequested = false;
        });
    }


    cmsModulePageDependencygrd.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsModulePageDependencygrd.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsModulePageDependencygrd.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsModulePageDependencygrd.ListItems.indexOf(item);
                cmsModulePageDependencygrd.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsModulePageDependencygrd.ListItems.unshift(newItem);
    }

    cmsModulePageDependencygrd.deleteRow = function () {
        if (buttonIsPressed) { return };
        if (!cmsModulePageDependencygrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                cmsModulePageDependencygrd.addRequested = true;
                cmsModulePageDependencygrd.busyIndicator.isActive = true;
                console.log(cmsModulePageDependencygrd.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPageDependency/GetOne', cmsModulePageDependencygrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    cmsModulePageDependencygrd.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPageDependency/delete', cmsModulePageDependencygrd.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsModulePageDependencygrd.replaceItem(cmsModulePageDependencygrd.selectedItemForDelete.Id);
                            cmsModulePageDependencygrd.gridOptions.fillData(cmsModulePageDependencygrd.ListItems);
                            cmsModulePageDependencygrd.addRequested = false;
                            cmsModulePageDependencygrd.busyIndicator.isActive = false;
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
    cmsModulePageDependencygrd.searchData = function () {
        cmsModulePageDependencygrd.gridOptions.serachData();
    }

    cmsModulePageDependencygrd.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'TitleML', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'ClassActionName', displayName: 'عنوان کلاس', sortable: true, type: 'string' },
            { name: 'virtual_CmsModule.Title', displayName: 'ماژول', sortable: true, type: 'link', displayForce: true }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "Id",
                SortType: 1,
                NeedToRunFakePagination: false,
                TotalRowData: 2000,
                RowPerPage: 200,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }

    cmsModulePageDependencygrd.gridOptions.reGetAll = function () {
        cmsModulePageDependencygrd.init();
    }

    cmsModulePageDependencygrd.gridOptions.onRowSelected = function () { }

    cmsModulePageDependencygrd.columnCheckbox = false;
    cmsModulePageDependencygrd.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (cmsModulePageDependencygrd.gridOptions.columnCheckbox) {
            for (var i = 0; i < cmsModulePageDependencygrd.gridOptions.columns.length; i++) {
                //cmsModulePageDependencygrd.gridOptions.columns[i].visible = $("#" + cmsModulePageDependencygrd.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + cmsModulePageDependencygrd.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                cmsModulePageDependencygrd.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = cmsModulePageDependencygrd.gridOptions.columns;
            for (var i = 0; i < cmsModulePageDependencygrd.gridOptions.columns.length; i++) {
                cmsModulePageDependencygrd.gridOptions.columns[i].visible = true;
                var element = $("#" + cmsModulePageDependencygrd.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + cmsModulePageDependencygrd.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < cmsModulePageDependencygrd.gridOptions.columns.length; i++) {
            console.log(cmsModulePageDependencygrd.gridOptions.columns[i].name.concat(".visible: "), cmsModulePageDependencygrd.gridOptions.columns[i].visible);
        }
        cmsModulePageDependencygrd.gridOptions.columnCheckbox = !cmsModulePageDependencygrd.gridOptions.columnCheckbox;
    }
    //Get TotalRowCount
    cmsModulePageDependencygrd.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"WebDesignerMainPageDependency/count", cmsModulePageDependencygrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsModulePageDependencygrd.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            cmsModulePageDependencygrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);