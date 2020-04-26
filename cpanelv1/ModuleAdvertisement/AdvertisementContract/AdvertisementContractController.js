app.controller("advertisementContractController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var advertisementContract = this;
    advertisementContract.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    advertisementContract.contractTypes = [];
    advertisementContract.properties = [];
    listProperties = [];
    if (itemRecordStatus != undefined) advertisementContract.itemRecordStatus = itemRecordStatus;



    advertisementContract.init = function () {
        advertisementContract.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = advertisementContract.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        ajax.call(cmsServerConfig.configApiServerPath+"advertisementcontracttype/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            advertisementContract.contractTypes = response.ListItems;

        }).error(function (data, errCode, c, d) {
            advertisementContract.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"advertisementContracttype/getall", {}, 'POST').success(function (response) {
            advertisementContract.propertyTypeListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            advertisementContract.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"advertisementcontract/getall", advertisementContract.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            advertisementContract.busyIndicator.isActive = false;
            advertisementContract.ListItems = response.ListItems;

            // Call Excerpt Function to shorten the length of long strings
            advertisementContract.gridOptions.myfilterText(advertisementContract.ListItems, "LinkContractTypeId", advertisementContract.contractTypes, "Title", "LinkContractTypeTitle");
            advertisementContract.gridOptions.myfilterText(advertisementContract.ListItems, "LinkPropertyId", listProperties, "Title", "LinkPropertyTitle");
            advertisementContract.gridOptions.fillData(advertisementContract.ListItems, response.resultAccess);
            advertisementContract.gridOptions.currentPageNumber = response.CurrentPageNumber;
            advertisementContract.gridOptions.totalRowCount = response.TotalRowCount;
            advertisementContract.gridOptions.rowPerPage = response.RowPerPage;
            advertisementContract.allowedSearch = response.AllowedSearchField;

        }).error(function (data, errCode, c, d) {
            advertisementContract.busyIndicator.isActive = false;
            advertisementContract.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    advertisementContract.busyIndicator.isActive = true;
    advertisementContract.addRequested = false;
    advertisementContract.openAddModal = function () {
        if (buttonIsPressed) { return };

        advertisementContract.modalTitle = 'اضافه';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementcontract/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;

            rashaErManage.checkAction(response);
            advertisementContract.busyIndicator.isActive = false;
            advertisementContract.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleAdvertisement/AdvertisementContract/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            advertisementContract.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    advertisementContract.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        advertisementContract.busyIndicator.isActive = true;
        advertisementContract.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementcontract/add', advertisementContract.selectedItem, 'POST').success(function (response) {
            advertisementContract.addRequested = false;
            advertisementContract.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                advertisementContract.ListItems.unshift(response.Item);
                advertisementContract.gridOptions.myfilterText(advertisementContract.ListItems, "LinkContractTypeId", advertisementContract.contractTypes, "Title", "LinkContractTypeTitle");
                advertisementContract.gridOptions.myfilterText(advertisementContract.ListItems, "LinkPropertyId", listProperties, "Title", "LinkPropertyTitle");
                advertisementContract.gridOptions.fillData(advertisementContract.ListItems);
                advertisementContract.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            advertisementContract.busyIndicator.isActive = false;
            advertisementContract.addRequested = false;
        });
    }

    advertisementContract.openEditModal = function () {
        if (buttonIsPressed) { return };


        advertisementContract.modalTitle = 'ویرایش';
        if (!advertisementContract.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementcontract/GetOne', advertisementContract.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;

            rashaErManage.checkAction(response);
            advertisementContract.selectedItem = response.Item;
            advertisementContract.selectedItem.LinkPropertyTitle = advertisementContract.gridOptions.selectedRow.item.LinkPropertyTitle;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleAdvertisement/AdvertisementContract/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    advertisementContract.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        advertisementContract.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementcontract/edit', advertisementContract.selectedItem, 'PUT').success(function (response) {
            advertisementContract.addRequested = true;
            rashaErManage.checkAction(response);
            advertisementContract.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                advertisementContract.addRequested = false;
                advertisementContract.replaceItem(advertisementContract.selectedItem.Id, response.Item);
                advertisementContract.gridOptions.myfilterText(advertisementContract.ListItems, "LinkContractTypeId", advertisementContract.contractTypes, "Title", "LinkContractTypeTitle");
                advertisementContract.gridOptions.myfilterText(advertisementContract.ListItems, "LinkPropertyId", listProperties, "Title", "LinkPropertyTitle");
                advertisementContract.gridOptions.fillData(advertisementContract.ListItems);
                advertisementContract.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            advertisementContract.addRequested = false;
            advertisementContract.busyIndicator.isActive = false;

        });
    }

    advertisementContract.closeModal = function () {
        $modalStack.dismissAll();
    };

    advertisementContract.replaceItem = function (oldId, newItem) {
        angular.forEach(advertisementContract.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = advertisementContract.ListItems.indexOf(item);
                advertisementContract.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            advertisementContract.ListItems.unshift(newItem);
    }

    advertisementContract.deleteRow = function () {
        if (buttonIsPressed) { return };

        if (!advertisementContract.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                advertisementContract.busyIndicator.isActive = true;
                console.log(advertisementContract.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'advertisementcontract/GetOne', advertisementContract.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    advertisementContract.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'advertisementcontract/delete', advertisementContract.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        advertisementContract.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            advertisementContract.replaceItem(advertisementContract.selectedItemForDelete.Id);
                            advertisementContract.gridOptions.fillData(advertisementContract.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        advertisementContract.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    advertisementContract.busyIndicator.isActive = false;

                });
            }
        });
    }

    advertisementContract.searchData = function () {
        advertisementContract.gridOptions.searchData();

    }

    advertisementContract.gridOptions = {
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

    advertisementContract.gridOptions.advancedSearchData = {};
    advertisementContract.gridOptions.advancedSearchData.engine = {};
    advertisementContract.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    advertisementContract.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    advertisementContract.gridOptions.advancedSearchData.engine.SortType = 1;
    advertisementContract.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    advertisementContract.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    advertisementContract.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    advertisementContract.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    advertisementContract.gridOptions.advancedSearchData.engine.Filters = [];

    advertisementContract.test = 'false';

    advertisementContract.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            advertisementContract.focusExpireLockAccount = true;
        });
    };

    advertisementContract.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            advertisementContract.focus = true;
        });
    };

    advertisementContract.gridOptions.reGetAll = function () {
        advertisementContract.init();
    }

    advertisementContract.gridOptions.onRowSelected = function () {

    }

    advertisementContract.columnCheckbox = false;
    advertisementContract.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (advertisementContract.gridOptions.columnCheckbox) {
            for (var i = 0; i < advertisementContract.gridOptions.columns.length; i++) {
                //advertisementContract.gridOptions.columns[i].visible = $("#" + advertisementContract.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + advertisementContract.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                advertisementContract.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = advertisementContract.gridOptions.columns;
            for (var i = 0; i < advertisementContract.gridOptions.columns.length; i++) {
                advertisementContract.gridOptions.columns[i].visible = true;
                var element = $("#" + advertisementContract.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + advertisementContract.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < advertisementContract.gridOptions.columns.length; i++) {
            console.log(advertisementContract.gridOptions.columns[i].name.concat(".visible: "), advertisementContract.gridOptions.columns[i].visible);
        }
        advertisementContract.gridOptions.columnCheckbox = !advertisementContract.gridOptions.columnCheckbox;
    }


    //insert properties into input
    advertisementContract.autoComplete = function () {
        $("#properties").autocomplete({
            source: advertisementContract.properties, select: function (event, ui) {
                advertisementContract.selectedItem.LinkPropertyId = ui.item.LinkPropertyId;
            }
        });
    }

    // Filter Texts
    advertisementContract.gridOptions.myfilterText = function (gridListItems, foreignKeyName, childListItems, childDesiredPropertyName, childItemColumnName) {
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

    advertisementContract.newProperty = false;
    advertisementContract.selectProperty = false;
    
    advertisementContract.onSelectPropertyPanelShowChange = function (propertyPanel) {
        if (propertyPanel == "select") {
            $("#newPropertyPanel").fadeOut("fast");
            $("#selectPropertyPanel").fadeIn("fast");
        } else {
            $("#selectPropertyPanel").fadeOut("fast");
            $("#newPropertyPanel").fadeIn("fast");
        }
    }

    advertisementContract.onPropertyTypeChange = function (propertyTypeId) {
        var filterValue = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(propertyTypeId),
            SearchType: 0
        }
        var engine = {};
        engine.Filters = [];
        engine.Filters.push(filterValue);
        ajax.call(cmsServerConfig.configApiServerPath+"advertisementContractDetail/GetAll", engine, 'POST').success(function (response) {
            advertisementContract.propertyDetailsListItems = response.ListItems;

            $.each(advertisementContract.propertyDetailsListItems, function (index, item) {
                item.value = null;
                // Add groups to its list
                var result = $.grep(advertisementContract.propertyDetailGroupListItems, function (e) { return e.Id == item.virtual_PropertyDetailGroup.Id; });
                if (result.length <= 0)
                    advertisementContract.propertyDetailGroupListItems.push(item.virtual_PropertyDetailGroup);

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
        ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementContract/exportfile', cmsSitegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
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
            templateUrl: 'cpanelv1/ModuleAdvertisement/AdvertisementContract/report.html',
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
        ajax.call(cmsServerConfig.configApiServerPath+"AdvertisementContract/count", cmsSitegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSitegrd.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            cmsSitegrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }


}]);

