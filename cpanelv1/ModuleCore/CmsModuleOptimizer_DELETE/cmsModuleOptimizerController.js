app.controller("cmsModuleOptimizerGridController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var cmsModuleOptimizer = this;
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) cmsModuleOptimizer.itemRecordStatus = itemRecordStatus;
    cmsModuleOptimizer.init = function () {
        

        ajax.call(cmsServerConfig.configApiServerPath+"coreModuleOptimizer/getall", cmsModuleOptimizer.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsModuleOptimizer.ListItems = response.ListItems;
            cmsModuleOptimizer.gridOptions.fillData(cmsModuleOptimizer.ListItems, response.resultAccess);
            cmsModuleOptimizer.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsModuleOptimizer.gridOptions.totalRowCount = response.TotalRowCount;
            cmsModuleOptimizer.gridOptions.rowPerPage = response.RowPerPage;
            cmsModuleOptimizer.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            cmsModuleOptimizer.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsModuleOptimizer.addRequested = false;
    cmsModuleOptimizer.openAddModal = function () {
        if (buttonIsPressed) { return };

        cmsModuleOptimizer.modalTitle = 'اضافه';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'cmsModuleOptimizer/GetViewModel', '', 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            cmsModuleOptimizer.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsModuleOptimizer/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsModuleOptimizer.autoAdd = function () {
        ajax.call(cmsServerConfig.configApiServerPath+'cmsModuleOptimizer/AutoAdd', '', 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsModuleOptimizer.init();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsModuleOptimizer.addNewRow = function (frm) {
        if (frm.$invalid)
            return;

        cmsModuleOptimizer.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'cmsModuleOptimizer/add', cmsModuleOptimizer.selectedItem, 'POST').success(function (response) {
            // cmsModuleOptimizer.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsModuleOptimizer.ListItems.unshift(response.Item);
                cmsModuleOptimizer.gridOptions.fillData(cmsModuleOptimizer.ListItems);
                cmsModuleOptimizer.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsModuleOptimizer.addRequested = false;
        });
    }


    cmsModuleOptimizer.openEditModal = function () {
        if (buttonIsPressed) { return };

        cmsModuleOptimizer.modalTitle = 'ویرایش';
        if (!cmsModuleOptimizer.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'cmsModuleOptimizer/GetOne', cmsModuleOptimizer.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            cmsModuleOptimizer.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsModuleOptimizer/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsModuleOptimizer.editRow = function (frm) {
        if (frm.$invalid)
            return;

        ajax.call(cmsServerConfig.configApiServerPath+'cmsModuleOptimizer/edit', cmsModuleOptimizer.selectedItem, 'PUT').success(function (response) {
            cmsModuleOptimizer.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsModuleOptimizer.addRequested = false;
                cmsModuleOptimizer.replaceItem(cmsModuleOptimizer.selectedItem.Id, response.Item);
                cmsModuleOptimizer.gridOptions.fillData(cmsModuleOptimizer.ListItems);
                cmsModuleOptimizer.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsModuleOptimizer.addRequested = false;
        });
    }


    cmsModuleOptimizer.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsModuleOptimizer.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsModuleOptimizer.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsModuleOptimizer.ListItems.indexOf(item);
                cmsModuleOptimizer.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsModuleOptimizer.ListItems.unshift(newItem);
    }

    cmsModuleOptimizer.deleteRow = function () {
        if (buttonIsPressed) { return };

        if (!cmsModuleOptimizer.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(cmsModuleOptimizer.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'cmsModuleOptimizer/GetOne', cmsModuleOptimizer.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;

                    rashaErManage.checkAction(response);
                    cmsModuleOptimizer.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'cmsModuleOptimizer/delete', cmsModuleOptimizer.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsModuleOptimizer.replaceItem(cmsModuleOptimizer.selectedItemForDelete.Id);
                            cmsModuleOptimizer.gridOptions.fillData(cmsModuleOptimizer.ListItems);
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

    cmsModuleOptimizer.searchData = function () {
        cmsModuleOptimizer.gridOptions.serachData();
    }

    cmsModuleOptimizer.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },//, filter: 'allowedWatchField'
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'ClassName', displayName: 'ClassName', sortable: true, type: 'string' },
            { name: 'LastRunDateTime', displayName: 'آخرین اجرا', isDateTime: true, sortable: true, type: 'string' },
            { name: 'AutoRun', displayName: 'اجرای خودکار', isCheckBox: true, sortable: true, type: 'bool' },
            { name: 'NextRun', displayName: 'اجرای بعدی', isDateTime: true, sortable: true, type: 'string' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    cmsModuleOptimizer.gridOptions.reGetAll = function () {
        cmsModuleOptimizer.init();
    }

    cmsModuleOptimizer.columnCheckbox = false;
    cmsModuleOptimizer.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (cmsModuleOptimizer.gridOptions.columnCheckbox) {
            for (var i = 0; i < cmsModuleOptimizer.gridOptions.columns.length; i++) {
                var element = $("#" + cmsModuleOptimizer.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                cmsModuleOptimizer.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = cmsModuleOptimizer.gridOptions.columns;
            for (var i = 0; i < cmsModuleOptimizer.gridOptions.columns.length; i++) {
                cmsModuleOptimizer.gridOptions.columns[i].visible = true;
                var element = $("#" + cmsModuleOptimizer.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + cmsModuleOptimizer.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < cmsModuleOptimizer.gridOptions.columns.length; i++) {
            console.log(cmsModuleOptimizer.gridOptions.columns[i].name.concat(".visible: "), cmsModuleOptimizer.gridOptions.columns[i].visible);
        }
        cmsModuleOptimizer.gridOptions.columnCheckbox = !cmsModuleOptimizer.gridOptions.columnCheckbox;
    }

}]);