app.controller("estatePropertyFavoriteController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$state', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $state, $window, $filter) {
    var estatePropertyFavorite = this;
    estatePropertyFavorite.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    estatePropertyFavorite.ListItems = [];
    if (itemRecordStatus != undefined) estatePropertyFavorite.itemRecordStatus = itemRecordStatus;

    estatePropertyFavorite.init = function () {
        estatePropertyFavorite.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"estatePropertyFavorite/getall", estatePropertyFavorite.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            estatePropertyFavorite.busyIndicator.isActive = false;
            estatePropertyFavorite.ListItems = response.ListItems;
            estatePropertyFavorite.gridOptions.fillData(estatePropertyFavorite.ListItems, response.resultAccess);
            estatePropertyFavorite.gridOptions.currentPageNumber = response.CurrentPageNumber;
            estatePropertyFavorite.gridOptions.totalRowCount = response.TotalRowCount;
            estatePropertyFavorite.gridOptions.rowPerPage = response.RowPerPage;
            estatePropertyFavorite.allowedSearch = response.AllowedSearchField;

        }).error(function (data, errCode, c, d) {
            estatePropertyFavorite.busyIndicator.isActive = false;
            estatePropertyFavorite.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    estatePropertyFavorite.busyIndicator.isActive = true;
    estatePropertyFavorite.addRequested = false;
    estatePropertyFavorite.openAddModal = function () {
        estatePropertyFavorite.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'estatePropertyFavorite/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            estatePropertyFavorite.busyIndicator.isActive = false;
            estatePropertyFavorite.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleEstate/EstatePropertyFavorite/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            estatePropertyFavorite.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    estatePropertyFavorite.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        estatePropertyFavorite.busyIndicator.isActive = true;
        estatePropertyFavorite.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'estatePropertyFavorite/add', estatePropertyFavorite.selectedItem, 'POST').success(function (response) {
            estatePropertyFavorite.addRequested = false;
            estatePropertyFavorite.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                estatePropertyFavorite.ListItems.unshift(response.Item);
                estatePropertyFavorite.gridOptions.fillData(estatePropertyFavorite.ListItems);
                estatePropertyFavorite.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            estatePropertyFavorite.busyIndicator.isActive = false;
            estatePropertyFavorite.addRequested = false;
        });
    }

    estatePropertyFavorite.openEditModal = function () {
        estatePropertyFavorite.modalTitle = 'ویرایش';
        if (!estatePropertyFavorite.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'estatePropertyFavorite/GetOne', estatePropertyFavorite.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            estatePropertyFavorite.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleEstate/EstatePropertyFavorite/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    estatePropertyFavorite.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        estatePropertyFavorite.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'estatePropertyFavorite/edit', estatePropertyFavorite.selectedItem, 'PUT').success(function (response) {
            estatePropertyFavorite.addRequested = true;
            rashaErManage.checkAction(response);
            estatePropertyFavorite.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                estatePropertyFavorite.addRequested = false;
                estatePropertyFavorite.replaceItem(estatePropertyFavorite.selectedItem.Id, response.Item);
                estatePropertyFavorite.gridOptions.fillData(estatePropertyFavorite.ListItems);
                estatePropertyFavorite.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            estatePropertyFavorite.addRequested = false;
            estatePropertyFavorite.busyIndicator.isActive = false;

        });
    }

    estatePropertyFavorite.closeModal = function () {
        $modalStack.dismissAll();
    };

    estatePropertyFavorite.replaceItem = function (oldId, newItem) {
        angular.forEach(estatePropertyFavorite.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = estatePropertyFavorite.ListItems.indexOf(item);
                estatePropertyFavorite.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            estatePropertyFavorite.ListItems.unshift(newItem);
    }

    estatePropertyFavorite.deleteRow = function () {
        if (!estatePropertyFavorite.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                estatePropertyFavorite.busyIndicator.isActive = true;
                console.log(estatePropertyFavorite.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'EstatePropertyFavorite/GetOne', estatePropertyFavorite.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    estatePropertyFavorite.selectedItemForDelete = response.Item;
                    console.log(estatePropertyFavorite.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'EstatePropertyFavorite/delete', estatePropertyFavorite.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        estatePropertyFavorite.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            estatePropertyFavorite.replaceItem(estatePropertyFavorite.selectedItemForDelete.Id);
                            estatePropertyFavorite.gridOptions.fillData(estatePropertyFavorite.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        estatePropertyFavorite.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    estatePropertyFavorite.busyIndicator.isActive = false;

                });
            }
        });
    }

    estatePropertyFavorite.searchData = function () {
        estatePropertyFavorite.gridOptions.searchData();

    }

    estatePropertyFavorite.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'LinkContentId', displayName: 'کد سیستمی ملک', sortable: true, type: 'integer', visible: true },
            { name: 'LinkMemberId', displayName: 'کد سیستمی عضو', sortable: true, type: 'integer', visible: true },
            { name: 'Like', displayName: 'پسندیدم', sortable: true, type: 'string', visible: true, isCheckBox: true },
            { name: 'Dislike', displayName: 'نپسندیدم', sortable: true, type: 'string', visible: true, isCheckBox: true }
        ],
        data: {},
        multiSelect: false,
        startDate: moment().format(),
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

    estatePropertyFavorite.gridOptions.reGetAll = function () {
        estatePropertyFavorite.init();
    }

    estatePropertyFavorite.gridOptions.onRowSelected = function () {

    }

    estatePropertyFavorite.columnCheckbox = false;
    estatePropertyFavorite.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (estatePropertyFavorite.gridOptions.columnCheckbox) {
            for (var i = 0; i < estatePropertyFavorite.gridOptions.columns.length; i++) {
                //estatePropertyFavorite.gridOptions.columns[i].visible = $("#" + estatePropertyFavorite.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + estatePropertyFavorite.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                estatePropertyFavorite.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = estatePropertyFavorite.gridOptions.columns;
            for (var i = 0; i < estatePropertyFavorite.gridOptions.columns.length; i++) {
                estatePropertyFavorite.gridOptions.columns[i].visible = true;
                var element = $("#" + estatePropertyFavorite.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + estatePropertyFavorite.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < estatePropertyFavorite.gridOptions.columns.length; i++) {
            console.log(estatePropertyFavorite.gridOptions.columns[i].name.concat(".visible: "), estatePropertyFavorite.gridOptions.columns[i].visible);
        }
        estatePropertyFavorite.gridOptions.columnCheckbox = !estatePropertyFavorite.gridOptions.columnCheckbox;
    }

    estatePropertyFavorite.goToDetails = function (proprtyId) {
        $state.go('index.estatepropertydetail', { propertyParam: proprtyId });
    }
 //Export Report 
    estatePropertyFavorite.exportFile = function () {
        estatePropertyFavorite.addRequested = true;
        estatePropertyFavorite.gridOptions.advancedSearchData.engine.ExportFile = estatePropertyFavorite.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'EstatePropertyFavorite/exportfile', estatePropertyFavorite.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            estatePropertyFavorite.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                estatePropertyFavorite.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //estatePropertyFavorite.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    estatePropertyFavorite.toggleExportForm = function () {
        estatePropertyFavorite.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        estatePropertyFavorite.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        estatePropertyFavorite.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        estatePropertyFavorite.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        estatePropertyFavorite.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleEstate/EstatePropertyFavorite/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    estatePropertyFavorite.rowCountChanged = function () {
        if (!angular.isDefined(estatePropertyFavorite.ExportFileClass.RowCount) || estatePropertyFavorite.ExportFileClass.RowCount > 5000)
            estatePropertyFavorite.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    estatePropertyFavorite.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"EstatePropertyFavorite/count", estatePropertyFavorite.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            estatePropertyFavorite.addRequested = false;
            rashaErManage.checkAction(response);
            estatePropertyFavorite.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            estatePropertyFavorite.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

