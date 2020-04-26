app.controller("filesListCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var filesList = this;
    filesList.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    filesList.UninversalMenus = [];

    filesList.init = function () {
        filesList.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = filesList.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            filesList.busyIndicator.isActive = false;
            filesList.ListItems = response.ListItems;
            filesList.gridOptions.fillData(filesList.ListItems, response.resultAccess);
            filesList.gridOptions.currentPageNumber = response.CurrentPageNumber;
            filesList.gridOptions.totalRowCount = response.TotalRowCount;
            filesList.gridOptions.rowPerPage = response.RowPerPage;
            filesList.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            filesList.busyIndicator.isActive = false;
            filesList.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    filesList.busyIndicator.isActive = true;
    filesList.addRequested = false;
    
    // Add New Content
    filesList.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        filesList.busyIndicator.isActive = true;
        filesList.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'FileContent/add', filesList.selectedItem, 'POST').success(function (response) {
            filesList.addRequested = false;
            filesList.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                filesList.ListItems.unshift(response.Item);
                filesList.gridOptions.fillData(filesList.ListItems);
                filesList.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            filesList.busyIndicator.isActive = false;
            filesList.addRequested = false;
        });
    }

    filesList.openViewModal = function () {
        filesList.modalTitle = 'ویرایش';
        if (!filesList.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', filesList.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            filesList.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleFile/view.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    filesList.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        filesList.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'FileContent/edit', filesList.selectedItem, 'PUT').success(function (response) {
            filesList.addRequested = true;
            rashaErManage.checkAction(response);
            filesList.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                filesList.addRequested = false;
                filesList.replaceItem(filesList.selectedItem.Id, response.Item);
                filesList.gridOptions.fillData(filesList.ListItems);
                filesList.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            filesList.addRequested = false;
        });
    }

    filesList.closeModal = function () {
        $modalStack.dismissAll();
    };

    filesList.replaceItem = function (oldId, newItem) {
        angular.forEach(filesList.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = filesList.ListItems.indexOf(item);
                filesList.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            filesList.ListItems.unshift(newItem);
    }

    filesList.deleteRow = function () {
        if (!filesList.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                filesList.busyIndicator.isActive = true;
                console.log(filesList.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', filesList.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    filesList.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', filesList.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        filesList.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            filesList.replaceItem(filesList.selectedItemForDelete.Id);
                            filesList.gridOptions.fillData(filesList.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        filesList.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    filesList.busyIndicator.isActive = false;

                });
            }
        });
    }

    filesList.searchData = function () {
        filesList.gridOptions.searchData();

    }

    filesList.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkCategoryId', displayName: 'کد سیستمی پوشه', sortable: true, type: 'string', visible: true },
            { name: 'FileName', displayName: 'نام فایل', sortable: true, type: 'string', visible: true },
            { name: 'Extension', displayName: 'پسوند', sortable: true, type: 'string', visible: true },
            { name: 'FileSize', displayName: 'اندازه فایل', sortable: true, type: 'string', visible: true },
            { name: 'FileSrc', displayName: 'FileSrc', sortable: true, type: 'integer', visible: true }
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
                Filters: []
            }
        }
    }

    filesList.gridOptions.reGetAll = function () {
        filesList.init();
    }

    filesList.gridOptions.onRowSelected = function () {

    }

    filesList.columnCheckbox = false;
    filesList.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (filesList.gridOptions.columnCheckbox) {
            for (var i = 0; i < filesList.gridOptions.columns.length; i++) {
                //filesList.gridOptions.columns[i].visible = $("#" + filesList.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + filesList.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                filesList.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = filesList.gridOptions.columns;
            for (var i = 0; i < filesList.gridOptions.columns.length; i++) {
                filesList.gridOptions.columns[i].visible = true;
                var element = $("#" + filesList.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + filesList.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < filesList.gridOptions.columns.length; i++) {
            console.log(filesList.gridOptions.columns[i].name.concat(".visible: "), filesList.gridOptions.columns[i].visible);
        }
        filesList.gridOptions.columnCheckbox = !filesList.gridOptions.columnCheckbox;
    }
    //Export Report 
    filesList.exportFile = function () {
        filesList.gridOptions.advancedSearchData.engine.ExportFile = filesList.ExportFileClass;
        filesList.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'FileContent/exportfile', filesList.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            filesList.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                filesList.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //filesList.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    filesList.toggleExportForm = function () {
        filesList.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        filesList.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        filesList.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        filesList.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        filesList.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleFile/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    filesList.rowCountChanged = function () {
        if (!angular.isDefined(filesList.ExportFileClass.RowCount) || filesList.ExportFileClass.RowCount > 5000)
            filesList.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    filesList.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/count", filesList.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            filesList.addRequested = false;
            rashaErManage.checkAction(response);
            filesList.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            filesList.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);

