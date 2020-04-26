app.controller("vehicleContractTypeController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var vehicleContractType = this;
    vehicleContractType.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    vehicleContractType.ListItems = [];
    if (itemRecordStatus != undefined) vehicleContractType.itemRecordStatus = itemRecordStatus;



    vehicleContractType.init = function () {
        vehicleContractType.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = vehicleContractType.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        ajax.call(cmsServerConfig.configApiServerPath+"vehiclecontracttype/getall", vehicleContractType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            vehicleContractType.busyIndicator.isActive = false;
            vehicleContractType.ListItems = response.ListItems;

            // Call Excerpt Function to shorten the length of long strings
            //excerptField(vehicleContractType.ListItems, "BotToken");
            vehicleContractType.gridOptions.fillData(vehicleContractType.ListItems, response.resultAccess);
            vehicleContractType.gridOptions.currentPageNumber = response.CurrentPageNumber;
            vehicleContractType.gridOptions.totalRowCount = response.TotalRowCount;
            vehicleContractType.gridOptions.rowPerPage = response.RowPerPage;
            vehicleContractType.allowedSearch = response.AllowedSearchField;

        }).error(function (data, errCode, c, d) {
            vehicleContractType.busyIndicator.isActive = false;
            vehicleContractType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    vehicleContractType.busyIndicator.isActive = true;
    vehicleContractType.addRequested = false;
    vehicleContractType.openAddModal = function () {
        vehicleContractType.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'vehiclecontracttype/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            vehicleContractType.busyIndicator.isActive = false;
            vehicleContractType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleVehicle/VehicleContractType/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            vehicleContractType.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    vehicleContractType.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        vehicleContractType.busyIndicator.isActive = true;
        vehicleContractType.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'vehiclecontracttype/add', vehicleContractType.selectedItem, 'POST').success(function (response) {
            vehicleContractType.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                vehicleContractType.ListItems.unshift(response.Item);
                vehicleContractType.gridOptions.fillData(vehicleContractType.ListItems);
                vehicleContractType.busyIndicator.isActive = false;
                vehicleContractType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            vehicleContractType.busyIndicator.isActive = false;
            vehicleContractType.addRequested = false;
        });
    }

    // Open Edit Modal
    vehicleContractType.openEditModal = function () {
        vehicleContractType.modalTitle = 'ویرایش';
        if (!vehicleContractType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'vehiclecontracttype/GetOne', vehicleContractType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            vehicleContractType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleVehicle/VehicleContractType/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    vehicleContractType.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        vehicleContractType.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'vehiclecontracttype/edit', vehicleContractType.selectedItem, 'PUT').success(function (response) {
            vehicleContractType.addRequested = true;
            rashaErManage.checkAction(response);
            vehicleContractType.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                vehicleContractType.addRequested = false;
                vehicleContractType.replaceItem(vehicleContractType.selectedItem.Id, response.Item);
                vehicleContractType.gridOptions.fillData(vehicleContractType.ListItems);
                vehicleContractType.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            vehicleContractType.addRequested = false;
            vehicleContractType.busyIndicator.isActive = false;

        });
    }

    vehicleContractType.closeModal = function () {
        $modalStack.dismissAll();
    };

    vehicleContractType.replaceItem = function (oldId, newItem) {
        angular.forEach(vehicleContractType.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = vehicleContractType.ListItems.indexOf(item);
                vehicleContractType.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            vehicleContractType.ListItems.unshift(newItem);
    }

    vehicleContractType.deleteRow = function () {
        if (!vehicleContractType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                vehicleContractType.busyIndicator.isActive = true;
                console.log(vehicleContractType.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'vehiclecontracttype/GetOne', vehicleContractType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    vehicleContractType.selectedItemForDelete = response.Item;
                    console.log(vehicleContractType.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'vehiclecontracttype/delete', vehicleContractType.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        vehicleContractType.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            vehicleContractType.replaceItem(vehicleContractType.selectedItemForDelete.Id);
                            vehicleContractType.gridOptions.fillData(vehicleContractType.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        vehicleContractType.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    vehicleContractType.busyIndicator.isActive = false;

                });
            }
        });
    }

    vehicleContractType.searchData = function () {
        vehicleContractType.gridOptions.searchData();

    }

    vehicleContractType.LinkArticleContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkArticleContentId',
        filterText: 'ArticleContent',
        url: 'ArticleContent',
        scope: vehicleContractType,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    vehicleContractType.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'نوع معامله', sortable: true, type: 'string', visible: true },
            { name: 'HasSalePrice', displayName: 'قیمت فروش دارد', sortable: true, type: 'string', isCheckBox: true, visible: true },
            { name: 'HasPresalePrice', displayName: 'قیمت پیش فروش دارد', sortable: true, type: 'string', isCheckBox: true, visible: true },
            { name: 'HasRentPrice', displayName: 'اجاره/اقساط دارد', sortable: true, type: 'string', isCheckBox: true, visible: true },
            { name: 'HasDepositPrice', displayName: 'قیمت رهن دارد', sortable: true, type: 'string', isCheckBox: true, visible: true }
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

    vehicleContractType.gridOptions.reGetAll = function () {
        vehicleContractType.init();
    }

    vehicleContractType.gridOptions.onRowSelected = function () {

    }

    vehicleContractType.columnCheckbox = false;
    vehicleContractType.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (vehicleContractType.gridOptions.columnCheckbox) {
            for (var i = 0; i < vehicleContractType.gridOptions.columns.length; i++) {
                //vehicleContractType.gridOptions.columns[i].visible = $("#" + vehicleContractType.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + vehicleContractType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                vehicleContractType.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = vehicleContractType.gridOptions.columns;
            for (var i = 0; i < vehicleContractType.gridOptions.columns.length; i++) {
                vehicleContractType.gridOptions.columns[i].visible = true;
                var element = $("#" + vehicleContractType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + vehicleContractType.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < vehicleContractType.gridOptions.columns.length; i++) {
            console.log(vehicleContractType.gridOptions.columns[i].name.concat(".visible: "), vehicleContractType.gridOptions.columns[i].visible);
        }
        vehicleContractType.gridOptions.columnCheckbox = !vehicleContractType.gridOptions.columnCheckbox;
    }
    //Export Report 
    vehicleContractType.exportFile = function () {
        vehicleContractType.addRequested = true;
        vehicleContractType.gridOptions.advancedSearchData.engine.ExportFile = vehicleContractType.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'vehicleContractType/exportfile', vehicleContractType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            vehicleContractType.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                vehicleContractType.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //vehicleContractType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    vehicleContractType.toggleExportForm = function () {
        vehicleContractType.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        vehicleContractType.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        vehicleContractType.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        vehicleContractType.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        vehicleContractType.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleVehicle/VehicleContractType/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    vehicleContractType.rowCountChanged = function () {
        if (!angular.isDefined(vehicleContractType.ExportFileClass.RowCount) || vehicleContractType.ExportFileClass.RowCount > 5000)
            vehicleContractType.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    vehicleContractType.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"vehicleContractType/count", vehicleContractType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            vehicleContractType.addRequested = false;
            rashaErManage.checkAction(response);
            vehicleContractType.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            vehicleContractType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);

