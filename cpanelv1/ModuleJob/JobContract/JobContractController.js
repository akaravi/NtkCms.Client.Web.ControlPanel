app.controller("jobContractController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var jobContract = this;
    jobContract.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    jobContract.contractTypes = [];
    jobContract.properties = [];
    listProperties = [];
    jobContract.selectUniversalMenuOnUndetectableKey = true;
    if (itemRecordStatus != undefined) jobContract.itemRecordStatus = itemRecordStatus;



    jobContract.init = function () {
        jobContract.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = jobContract.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        ajax.call(cmsServerConfig.configApiServerPath+"jobcontracttype/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            jobContract.contractTypes = response.ListItems;

        }).error(function (data, errCode, c, d) {
            jobContract.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"jobContracttype/getall", {}, 'POST').success(function (response) {
            jobContract.propertyTypeListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            jobContract.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"jobcontract/getall", jobContract.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            jobContract.busyIndicator.isActive = false;
            jobContract.ListItems = response.ListItems;

            // Call Excerpt Function to shorten the length of long strings
            jobContract.gridOptions.myfilterText(jobContract.ListItems, "LinkJobContractTypeId", jobContract.contractTypes, "Title", "LinkContractTypeTitle");
            jobContract.gridOptions.myfilterText(jobContract.ListItems, "LinkPropertyId", listProperties, "Title", "LinkPropertyTitle");
            jobContract.gridOptions.fillData(jobContract.ListItems, response.resultAccess);
            jobContract.gridOptions.currentPageNumber = response.CurrentPageNumber;
            jobContract.gridOptions.totalRowCount = response.TotalRowCount;
            jobContract.gridOptions.rowPerPage = response.RowPerPage;
            jobContract.allowedSearch = response.AllowedSearchField;

        }).error(function (data, errCode, c, d) {
            jobContract.busyIndicator.isActive = false;
            jobContract.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    jobContract.busyIndicator.isActive = true;
    jobContract.addRequested = false;
    jobContract.openAddModal = function () {
        if (buttonIsPressed) { return };

        jobContract.modalTitle = 'اضافه';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'jobcontract/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;

            rashaErManage.checkAction(response);
            jobContract.busyIndicator.isActive = false;
            jobContract.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleJob/JobContract/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            jobContract.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    jobContract.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        jobContract.busyIndicator.isActive = true;
        jobContract.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'jobcontract/add', jobContract.selectedItem, 'POST').success(function (response) {
            jobContract.addRequested = false;
            jobContract.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                jobContract.ListItems.unshift(response.Item);
                jobContract.gridOptions.myfilterText(jobContract.ListItems, "LinkJobContractTypeId", jobContract.contractTypes, "Title", "LinkContractTypeTitle");
                jobContract.gridOptions.myfilterText(jobContract.ListItems, "LinkPropertyId", listProperties, "Title", "LinkPropertyTitle");
                jobContract.gridOptions.fillData(jobContract.ListItems);
                jobContract.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            jobContract.busyIndicator.isActive = false;
            jobContract.addRequested = false;
        });
    }

    jobContract.openEditModal = function () {
        if (buttonIsPressed) { return };


        jobContract.modalTitle = 'ویرایش';
        if (!jobContract.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'jobcontract/GetOne', jobContract.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;

            rashaErManage.checkAction(response);
            jobContract.selectedItem = response.Item;
            jobContract.selectedItem.LinkPropertyTitle = jobContract.gridOptions.selectedRow.item.LinkPropertyTitle;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleJob/JobContract/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    jobContract.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        jobContract.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'jobcontract/edit', jobContract.selectedItem, 'PUT').success(function (response) {
            jobContract.addRequested = true;
            rashaErManage.checkAction(response);
            jobContract.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                jobContract.addRequested = false;
                jobContract.replaceItem(jobContract.selectedItem.Id, response.Item);
                jobContract.gridOptions.myfilterText(jobContract.ListItems, "LinkJobContractTypeId", jobContract.contractTypes, "Title", "LinkContractTypeTitle");
                jobContract.gridOptions.myfilterText(jobContract.ListItems, "LinkPropertyId", listProperties, "Title", "LinkPropertyTitle");
                jobContract.gridOptions.fillData(jobContract.ListItems);
                jobContract.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            jobContract.addRequested = false;
            jobContract.busyIndicator.isActive = false;

        });
    }

    jobContract.closeModal = function () {
        $modalStack.dismissAll();
    };

    jobContract.replaceItem = function (oldId, newItem) {
        angular.forEach(jobContract.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = jobContract.ListItems.indexOf(item);
                jobContract.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            jobContract.ListItems.unshift(newItem);
    }

    jobContract.deleteRow = function () {
        if (buttonIsPressed) { return };

        if (!jobContract.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                jobContract.busyIndicator.isActive = true;
                console.log(jobContract.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'jobcontract/GetOne', jobContract.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    jobContract.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'jobcontract/delete', jobContract.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        jobContract.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            jobContract.replaceItem(jobContract.selectedItemForDelete.Id);
                            jobContract.gridOptions.fillData(jobContract.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        jobContract.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    jobContract.busyIndicator.isActive = false;

                });
            }
        });
    }

    jobContract.searchData = function () {
        jobContract.gridOptions.searchData();

    }

    jobContract.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: true },
            { name: 'LinkContractTypeTitle', displayName: 'قرارداد', sortable: true, type: 'string', visible: true, displayForce: true },
            { name: 'LinkPropertyTitle', displayName: 'متقاضی', sortable: true, type: 'string', visible: true, displayForce: true }
        ],
        data: {},
        multiSelect: false,
        startDate: moment().format(),
        advancedSearchData: {
            engine: {}
        }
    }

    jobContract.gridOptions.advancedSearchData = {};
    jobContract.gridOptions.advancedSearchData.engine = {};
    jobContract.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    jobContract.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    jobContract.gridOptions.advancedSearchData.engine.SortType = 1;
    jobContract.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    jobContract.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    jobContract.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    jobContract.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    jobContract.gridOptions.advancedSearchData.engine.Filters = [];

    jobContract.test = 'false';

    jobContract.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            jobContract.focusExpireLockAccount = true;
        });
    };

    jobContract.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            jobContract.focus = true;
        });
    };

    jobContract.gridOptions.reGetAll = function () {
        jobContract.init();
    }

    jobContract.gridOptions.onRowSelected = function () {

    }

    jobContract.columnCheckbox = false;
    jobContract.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (jobContract.gridOptions.columnCheckbox) {
            for (var i = 0; i < jobContract.gridOptions.columns.length; i++) {
                //jobContract.gridOptions.columns[i].visible = $("#" + jobContract.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + jobContract.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                jobContract.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = jobContract.gridOptions.columns;
            for (var i = 0; i < jobContract.gridOptions.columns.length; i++) {
                jobContract.gridOptions.columns[i].visible = true;
                var element = $("#" + jobContract.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + jobContract.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < jobContract.gridOptions.columns.length; i++) {
            console.log(jobContract.gridOptions.columns[i].name.concat(".visible: "), jobContract.gridOptions.columns[i].visible);
        }
        jobContract.gridOptions.columnCheckbox = !jobContract.gridOptions.columnCheckbox;
    }


    //insert properties into input
    jobContract.autoComplete = function () {
        $("#properties").autocomplete({
            source: jobContract.properties, select: function (event, ui) {
                jobContract.selectedItem.LinkPropertyId = ui.item.LinkPropertyId;
            }
        });
    }

    // Filter Texts
    jobContract.gridOptions.myfilterText = function (gridListItems, foreignKeyName, childListItems, childDesiredPropertyName, childItemColumnName) {
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

    jobContract.newProperty = false;
    jobContract.selectProperty = false;
    
    jobContract.onSelectPropertyPanelShowChange = function (propertyPanel) {
        if (propertyPanel == "select") {
            $("#newPropertyPanel").fadeOut("fast");
            $("#selectPropertyPanel").fadeIn("fast");
        } else {
            $("#selectPropertyPanel").fadeOut("fast");
            $("#newPropertyPanel").fadeIn("fast");
        }
    }

    jobContract.onPropertyTypeChange = function (propertyTypeId) {
        var filterValue = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(propertyTypeId),
            SearchType: 0
        }
        var engine = {};
        engine.Filters = [];
        engine.Filters.push(filterValue);
        ajax.call(cmsServerConfig.configApiServerPath+"jobContractDetail/GetAll", engine, 'POST').success(function (response) {
            jobContract.propertyDetailsListItems = response.ListItems;

            $.each(jobContract.propertyDetailsListItems, function (index, item) {
                item.value = null;
                // Add groups to its list
                var result = $.grep(jobContract.propertyDetailGroupListItems, function (e) { return e.Id == item.virtual_PropertyDetailGroup.Id; });
                if (result.length <= 0)
                    jobContract.propertyDetailGroupListItems.push(item.virtual_PropertyDetailGroup);

                // Add DefaultValue to the object
                item.DefaultValue = JSON.parse(item.JsonDefaultValue);
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Export Report 
    jobContract.exportFile = function () {
        jobContract.addRequested = true;
        jobContract.gridOptions.advancedSearchData.engine.ExportFile = jobContract.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'JobContract/exportfile', jobContract.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                jobContract.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //jobContract.closeModal();
            }
            jobContract.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    jobContract.toggleExportForm = function () {
        jobContract.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        jobContract.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        jobContract.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        jobContract.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        jobContract.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleJob/JobContract/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    jobContract.rowCountChanged = function () {
        if (!angular.isDefined(jobContract.ExportFileClass.RowCount) || jobContract.ExportFileClass.RowCount > 5000)
            jobContract.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    jobContract.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"JobContract/count", jobContract.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            jobContract.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            jobContract.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }


}]);

