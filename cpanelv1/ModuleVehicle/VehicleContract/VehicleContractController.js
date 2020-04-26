app.controller("vehicleContractController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var vehicleContract = this;
    vehicleContract.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    vehicleContract.contractTypes = [];
    vehicleContract.properties = [];
    listProperties = [];
    if (itemRecordStatus != undefined) vehicleContract.itemRecordStatus = itemRecordStatus;



    vehicleContract.init = function () {
        vehicleContract.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = vehicleContract.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        ajax.call(cmsServerConfig.configApiServerPath+"vehiclecontracttype/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            vehicleContract.contractTypes = response.ListItems;

        }).error(function (data, errCode, c, d) {
            vehicleContract.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"vehicleContracttype/getall", {}, 'POST').success(function (response) {
            vehicleContract.propertyTypeListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            vehicleContract.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"vehiclecontract/getall", vehicleContract.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            vehicleContract.busyIndicator.isActive = false;
            vehicleContract.ListItems = response.ListItems;

            // Call Excerpt Function to shorten the length of long strings
            vehicleContract.gridOptions.myfilterText(vehicleContract.ListItems, "LinkVehicleContractTypeId", vehicleContract.contractTypes, "Title", "LinkContractTypeTitle");
            vehicleContract.gridOptions.myfilterText(vehicleContract.ListItems, "LinkPropertyId", listProperties, "Title", "LinkPropertyTitle");
            vehicleContract.gridOptions.fillData(vehicleContract.ListItems, response.resultAccess);
            vehicleContract.gridOptions.currentPageNumber = response.CurrentPageNumber;
            vehicleContract.gridOptions.totalRowCount = response.TotalRowCount;
            vehicleContract.gridOptions.rowPerPage = response.RowPerPage;
            vehicleContract.allowedSearch = response.AllowedSearchField;

        }).error(function (data, errCode, c, d) {
            vehicleContract.busyIndicator.isActive = false;
            vehicleContract.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    vehicleContract.busyIndicator.isActive = true;
    vehicleContract.addRequested = false;
    vehicleContract.openAddModal = function () {
        if (buttonIsPressed) { return };

        vehicleContract.modalTitle = 'اضافه';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'vehiclecontract/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;

            rashaErManage.checkAction(response);
            vehicleContract.busyIndicator.isActive = false;
            vehicleContract.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleVehicle/VehicleContract/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            vehicleContract.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    vehicleContract.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        vehicleContract.busyIndicator.isActive = true;
        vehicleContract.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'vehiclecontract/add', vehicleContract.selectedItem, 'POST').success(function (response) {
            vehicleContract.addRequested = false;
            vehicleContract.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                vehicleContract.ListItems.unshift(response.Item);
                vehicleContract.gridOptions.myfilterText(vehicleContract.ListItems, "LinkVehicleContractTypeId", vehicleContract.contractTypes, "Title", "LinkContractTypeTitle");
                vehicleContract.gridOptions.myfilterText(vehicleContract.ListItems, "LinkPropertyId", listProperties, "Title", "LinkPropertyTitle");
                vehicleContract.gridOptions.fillData(vehicleContract.ListItems);
                vehicleContract.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            vehicleContract.busyIndicator.isActive = false;
            vehicleContract.addRequested = false;
        });
    }

    vehicleContract.openEditModal = function () {
        if (buttonIsPressed) { return };


        vehicleContract.modalTitle = 'ویرایش';
        if (!vehicleContract.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'vehiclecontract/GetOne', vehicleContract.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;

            rashaErManage.checkAction(response);
            vehicleContract.selectedItem = response.Item;
            vehicleContract.selectedItem.LinkPropertyTitle = vehicleContract.gridOptions.selectedRow.item.LinkPropertyTitle;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleVehicle/VehicleContract/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    vehicleContract.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        vehicleContract.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'vehiclecontract/edit', vehicleContract.selectedItem, 'PUT').success(function (response) {
            vehicleContract.addRequested = true;
            rashaErManage.checkAction(response);
            vehicleContract.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                vehicleContract.addRequested = false;
                vehicleContract.replaceItem(vehicleContract.selectedItem.Id, response.Item);
                vehicleContract.gridOptions.myfilterText(vehicleContract.ListItems, "LinkVehicleContractTypeId", vehicleContract.contractTypes, "Title", "LinkContractTypeTitle");
                vehicleContract.gridOptions.myfilterText(vehicleContract.ListItems, "LinkPropertyId", listProperties, "Title", "LinkPropertyTitle");
                vehicleContract.gridOptions.fillData(vehicleContract.ListItems);
                vehicleContract.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            vehicleContract.addRequested = false;
            vehicleContract.busyIndicator.isActive = false;

        });
    }

    vehicleContract.closeModal = function () {
        $modalStack.dismissAll();
    };

    vehicleContract.replaceItem = function (oldId, newItem) {
        angular.forEach(vehicleContract.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = vehicleContract.ListItems.indexOf(item);
                vehicleContract.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            vehicleContract.ListItems.unshift(newItem);
    }

    vehicleContract.deleteRow = function () {
        if (buttonIsPressed) { return };

        if (!vehicleContract.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                vehicleContract.busyIndicator.isActive = true;
                console.log(vehicleContract.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'vehiclecontract/GetOne', vehicleContract.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    vehicleContract.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'vehiclecontract/delete', vehicleContract.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        vehicleContract.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            vehicleContract.replaceItem(vehicleContract.selectedItemForDelete.Id);
                            vehicleContract.gridOptions.fillData(vehicleContract.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        vehicleContract.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    vehicleContract.busyIndicator.isActive = false;

                });
            }
        });
    }

    vehicleContract.searchData = function () {
        vehicleContract.gridOptions.searchData();

    }

    vehicleContract.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: true },
            { name: 'LinkContractTypeTitle', displayName: 'قرارداد', sortable: true, type: 'string', visible: true, displayForce: true },
            { name: 'LinkPropertyTitle', displayName: 'ملک', sortable: true, type: 'string', visible: true, displayForce: true }
        ],
        data: {},
        multiSelect: false,
        startDate: moment().format(),
        advancedSearchData: {
            engine: {}
        }
    }

    vehicleContract.gridOptions.advancedSearchData = {};
    vehicleContract.gridOptions.advancedSearchData.engine = {};
    vehicleContract.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    vehicleContract.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    vehicleContract.gridOptions.advancedSearchData.engine.SortType = 1;
    vehicleContract.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    vehicleContract.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    vehicleContract.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    vehicleContract.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    vehicleContract.gridOptions.advancedSearchData.engine.Filters = [];

    vehicleContract.test = 'false';

    vehicleContract.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            vehicleContract.focusExpireLockAccount = true;
        });
    };

    vehicleContract.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            vehicleContract.focus = true;
        });
    };

    vehicleContract.gridOptions.reGetAll = function () {
        vehicleContract.init();
    }

    vehicleContract.gridOptions.onRowSelected = function () {

    }

    vehicleContract.columnCheckbox = false;
    vehicleContract.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (vehicleContract.gridOptions.columnCheckbox) {
            for (var i = 0; i < vehicleContract.gridOptions.columns.length; i++) {
                //vehicleContract.gridOptions.columns[i].visible = $("#" + vehicleContract.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + vehicleContract.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                vehicleContract.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = vehicleContract.gridOptions.columns;
            for (var i = 0; i < vehicleContract.gridOptions.columns.length; i++) {
                vehicleContract.gridOptions.columns[i].visible = true;
                var element = $("#" + vehicleContract.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + vehicleContract.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < vehicleContract.gridOptions.columns.length; i++) {
            console.log(vehicleContract.gridOptions.columns[i].name.concat(".visible: "), vehicleContract.gridOptions.columns[i].visible);
        }
        vehicleContract.gridOptions.columnCheckbox = !vehicleContract.gridOptions.columnCheckbox;
    }


    //insert properties into input
    vehicleContract.autoComplete = function () {
        $("#properties").autocomplete({
            source: vehicleContract.properties, select: function (event, ui) {
                vehicleContract.selectedItem.LinkPropertyId = ui.item.LinkPropertyId;
            }
        });
    }

    // Filter Texts
    vehicleContract.gridOptions.myfilterText = function (gridListItems, foreignKeyName, childListItems, childDesiredPropertyName, childItemColumnName) {
        var ilength = gridListItems.length;
        var jlength = childListItems.length;
        for (var i = 0; i < ilength; i++) {
            gridListItems[i][childItemColumnName] = "";  // Make a new field for title of the foreighn key
            for (var j = 0; j < jlength; j++) {
                if (gridListItems[i][foreignKeyName] == childListItems[j].Id) {
                    gridListItems[i][childItemColumnName] = childListItems[j][childDesiredPropertyName];
                }
            }
        }
    }

    vehicleContract.newProperty = false;
    vehicleContract.selectProperty = false;
    
    vehicleContract.onSelectPropertyPanelShowChange = function (propertyPanel) {
        if (propertyPanel == "select") {
            $("#newPropertyPanel").fadeOut("fast");
            $("#selectPropertyPanel").fadeIn("fast");
        } else {
            $("#selectPropertyPanel").fadeOut("fast");
            $("#newPropertyPanel").fadeIn("fast");
        }
    }

    vehicleContract.onPropertyTypeChange = function (propertyTypeId) {
        var filterValue = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(propertyTypeId),
            SearchType: 0
        }
        var engine = {};
        engine.Filters = [];
        engine.Filters.push(filterValue);
        ajax.call(cmsServerConfig.configApiServerPath+"vehicleContractDetail/GetAll", engine, 'POST').success(function (response) {
            vehicleContract.propertyDetailsListItems = response.ListItems;

            $.each(vehicleContract.propertyDetailsListItems, function (index, item) {
                item.value = null;
                // Add groups to its list
                var result = $.grep(vehicleContract.propertyDetailGroupListItems, function (e) { return e.Id == item.virtual_PropertyDetailGroup.Id; });
                if (result.length <= 0)
                    vehicleContract.propertyDetailGroupListItems.push(item.virtual_PropertyDetailGroup);

                // Add DefaultValue to the object
                item.DefaultValue = JSON.parse(item.JsonDefaultValue);
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Export Report 
    cmsSitegrd.exportFile = function () {
        cmsSitegrd.addRequested = true;
        cmsSitegrd.gridOptions.advancedSearchData.engine.ExportFile = cmsSitegrd.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'VehicleContract/exportfile', cmsSitegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsSitegrd.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //cmsSitegrd.closeModal();
            }
            cmsSitegrd.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    cmsSitegrd.toggleExportForm = function () {
        cmsSitegrd.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        cmsSitegrd.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        cmsSitegrd.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        cmsSitegrd.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        cmsSitegrd.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleVehicle/VehicleContract/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    cmsSitegrd.rowCountChanged = function () {
        if (!angular.isDefined(cmsSitegrd.ExportFileClass.RowCount) || cmsSitegrd.ExportFileClass.RowCount > 5000)
            cmsSitegrd.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    cmsSitegrd.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"VehicleContract/count", cmsSitegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSitegrd.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            cmsSitegrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }


}]);

