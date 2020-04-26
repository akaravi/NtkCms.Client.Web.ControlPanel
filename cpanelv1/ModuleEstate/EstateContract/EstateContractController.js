app.controller("estateContractController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var estateContract = this;
    estateContract.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    estateContract.contractTypes = [];
    estateContract.properties = [];
    listProperties = [];
    if (itemRecordStatus != undefined) estateContract.itemRecordStatus = itemRecordStatus;



    estateContract.init = function () {
        estateContract.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = estateContract.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        ajax.call(cmsServerConfig.configApiServerPath+"estatecontracttype/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            estateContract.contractTypes = response.ListItems;

        }).error(function (data, errCode, c, d) {
            estateContract.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"estateContracttype/getall", {}, 'POST').success(function (response) {
            estateContract.propertyTypeListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            estateContract.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"estatecontract/getall", estateContract.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            estateContract.busyIndicator.isActive = false;
            estateContract.ListItems = response.ListItems;

            // Call Excerpt Function to shorten the length of long strings
            estateContract.gridOptions.myfilterText(estateContract.ListItems, "LinkEstateContractTypeId", estateContract.contractTypes, "Title", "LinkContractTypeTitle");
            estateContract.gridOptions.myfilterText(estateContract.ListItems, "LinkPropertyId", listProperties, "Title", "LinkPropertyTitle");
            estateContract.gridOptions.fillData(estateContract.ListItems, response.resultAccess);
            estateContract.gridOptions.currentPageNumber = response.CurrentPageNumber;
            estateContract.gridOptions.totalRowCount = response.TotalRowCount;
            estateContract.gridOptions.rowPerPage = response.RowPerPage;
            estateContract.allowedSearch = response.AllowedSearchField;

        }).error(function (data, errCode, c, d) {
            estateContract.busyIndicator.isActive = false;
            estateContract.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    estateContract.busyIndicator.isActive = true;
    estateContract.addRequested = false;
    estateContract.openAddModal = function () {
        if (buttonIsPressed) { return };

        estateContract.modalTitle = 'اضافه';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'estatecontract/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;

            rashaErManage.checkAction(response);
            estateContract.busyIndicator.isActive = false;
            estateContract.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleEstate/EstateContract/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            estateContract.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    estateContract.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        estateContract.busyIndicator.isActive = true;
        estateContract.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'estatecontract/add', estateContract.selectedItem, 'POST').success(function (response) {
            estateContract.addRequested = false;
            estateContract.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                estateContract.ListItems.unshift(response.Item);
                estateContract.gridOptions.myfilterText(estateContract.ListItems, "LinkEstateContractTypeId", estateContract.contractTypes, "Title", "LinkContractTypeTitle");
                estateContract.gridOptions.myfilterText(estateContract.ListItems, "LinkPropertyId", listProperties, "Title", "LinkPropertyTitle");
                estateContract.gridOptions.fillData(estateContract.ListItems);
                estateContract.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            estateContract.busyIndicator.isActive = false;
            estateContract.addRequested = false;
        });
    }

    estateContract.openEditModal = function () {
        if (buttonIsPressed) { return };


        estateContract.modalTitle = 'ویرایش';
        if (!estateContract.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'estatecontract/GetOne', estateContract.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;

            rashaErManage.checkAction(response);
            estateContract.selectedItem = response.Item;
            estateContract.selectedItem.LinkPropertyTitle = estateContract.gridOptions.selectedRow.item.LinkPropertyTitle;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleEstate/EstateContract/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    estateContract.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        estateContract.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'estatecontract/edit', estateContract.selectedItem, 'PUT').success(function (response) {
            estateContract.addRequested = true;
            rashaErManage.checkAction(response);
            estateContract.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                estateContract.addRequested = false;
                estateContract.replaceItem(estateContract.selectedItem.Id, response.Item);
                estateContract.gridOptions.myfilterText(estateContract.ListItems, "LinkEstateContractTypeId", estateContract.contractTypes, "Title", "LinkContractTypeTitle");
                estateContract.gridOptions.myfilterText(estateContract.ListItems, "LinkPropertyId", listProperties, "Title", "LinkPropertyTitle");
                estateContract.gridOptions.fillData(estateContract.ListItems);
                estateContract.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            estateContract.addRequested = false;
            estateContract.busyIndicator.isActive = false;

        });
    }

    estateContract.closeModal = function () {
        $modalStack.dismissAll();
    };

    estateContract.replaceItem = function (oldId, newItem) {
        angular.forEach(estateContract.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = estateContract.ListItems.indexOf(item);
                estateContract.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            estateContract.ListItems.unshift(newItem);
    }

    estateContract.deleteRow = function () {
        if (buttonIsPressed) { return };

        if (!estateContract.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                estateContract.busyIndicator.isActive = true;
                console.log(estateContract.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'estatecontract/GetOne', estateContract.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    estateContract.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'estatecontract/delete', estateContract.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        estateContract.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            estateContract.replaceItem(estateContract.selectedItemForDelete.Id);
                            estateContract.gridOptions.fillData(estateContract.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        estateContract.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    estateContract.busyIndicator.isActive = false;

                });
            }
        });
    }

    estateContract.searchData = function () {
        estateContract.gridOptions.searchData();

    }

    estateContract.gridOptions = {
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

    estateContract.gridOptions.advancedSearchData = {};
    estateContract.gridOptions.advancedSearchData.engine = {};
    estateContract.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    estateContract.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    estateContract.gridOptions.advancedSearchData.engine.SortType = 1;
    estateContract.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    estateContract.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    estateContract.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    estateContract.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    estateContract.gridOptions.advancedSearchData.engine.Filters = [];

    estateContract.test = 'false';

    estateContract.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            estateContract.focusExpireLockAccount = true;
        });
    };

    estateContract.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            estateContract.focus = true;
        });
    };

    estateContract.gridOptions.reGetAll = function () {
        estateContract.init();
    }

    estateContract.gridOptions.onRowSelected = function () {

    }

    estateContract.columnCheckbox = false;
    estateContract.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (estateContract.gridOptions.columnCheckbox) {
            for (var i = 0; i < estateContract.gridOptions.columns.length; i++) {
                //estateContract.gridOptions.columns[i].visible = $("#" + estateContract.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + estateContract.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                estateContract.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = estateContract.gridOptions.columns;
            for (var i = 0; i < estateContract.gridOptions.columns.length; i++) {
                estateContract.gridOptions.columns[i].visible = true;
                var element = $("#" + estateContract.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + estateContract.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < estateContract.gridOptions.columns.length; i++) {
            console.log(estateContract.gridOptions.columns[i].name.concat(".visible: "), estateContract.gridOptions.columns[i].visible);
        }
        estateContract.gridOptions.columnCheckbox = !estateContract.gridOptions.columnCheckbox;
    }


    //insert properties into input
    estateContract.autoComplete = function () {
        $("#properties").autocomplete({
            source: estateContract.properties, select: function (event, ui) {
                estateContract.selectedItem.LinkPropertyId = ui.item.LinkPropertyId;
            }
        });
    }

    // Filter Texts
    estateContract.gridOptions.myfilterText = function (gridListItems, foreignKeyName, childListItems, childDesiredPropertyName, childItemColumnName) {
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

    estateContract.newProperty = false;
    estateContract.selectProperty = false;
    
    estateContract.onSelectPropertyPanelShowChange = function (propertyPanel) {
        if (propertyPanel == "select") {
            $("#newPropertyPanel").fadeOut("fast");
            $("#selectPropertyPanel").fadeIn("fast");
        } else {
            $("#selectPropertyPanel").fadeOut("fast");
            $("#newPropertyPanel").fadeIn("fast");
        }
    }

    estateContract.onPropertyTypeChange = function (propertyTypeId) {
        var filterValue = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(propertyTypeId),
            SearchType: 0
        }
        var engine = {};
        engine.Filters = [];
        engine.Filters.push(filterValue);
        ajax.call(cmsServerConfig.configApiServerPath+"estateContractDetail/GetAll", engine, 'POST').success(function (response) {
            estateContract.propertyDetailsListItems = response.ListItems;

            $.each(estateContract.propertyDetailsListItems, function (index, item) {
                item.value = null;
                // Add groups to its list
                var result = $.grep(estateContract.propertyDetailGroupListItems, function (e) { return e.Id == item.virtual_PropertyDetailGroup.Id; });
                if (result.length <= 0)
                    estateContract.propertyDetailGroupListItems.push(item.virtual_PropertyDetailGroup);

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
        ajax.call(cmsServerConfig.configApiServerPath+'EstateContract/exportfile', cmsSitegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
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
            templateUrl: 'cpanelv1/ModuleEstate/EstateContract/report.html',
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
        ajax.call(cmsServerConfig.configApiServerPath+"EstateContract/count", cmsSitegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSitegrd.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            cmsSitegrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }


}]);

