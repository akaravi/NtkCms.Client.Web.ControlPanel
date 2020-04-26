app.controller("jobPositionController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var jobPosition = this;
    jobPosition.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) jobPosition.itemRecordStatus = itemRecordStatus;

    jobPosition.init = function () {
        jobPosition.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"jobposition/getall", jobPosition.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            jobPosition.busyIndicator.isActive = false;
            jobPosition.ListItems = response.ListItems;
            jobPosition.gridOptions.fillData(jobPosition.ListItems, response.resultAccess);
            jobPosition.gridOptions.currentPageNumber = response.CurrentPageNumber;
            jobPosition.gridOptions.totalRowCount = response.TotalRowCount;
            jobPosition.gridOptions.rowPerPage = response.RowPerPage;
            jobPosition.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            jobPosition.busyIndicator.isActive = false;
            jobPosition.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    jobPosition.busyIndicator.isActive = true;
    jobPosition.addRequested = false;
    jobPosition.openAddModal = function () {
        if (buttonIsPressed) { return };

        jobPosition.modalTitle = 'اضافه';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'jobposition/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;

            rashaErManage.checkAction(response);
            jobPosition.busyIndicator.isActive = false;
            jobPosition.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleJob/JobPosition/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            jobPosition.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    jobPosition.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        jobPosition.busyIndicator.isActive = true;
        jobPosition.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'jobposition/add', jobPosition.selectedItem, 'POST').success(function (response) {
            jobPosition.addRequested = false;
            jobPosition.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                jobPosition.ListItems.unshift(response.Item);
                jobPosition.gridOptions.myfilterText(jobPosition.ListItems, "LinkJobPositionTypeId", jobPosition.positionTypes, "Title", "LinkPositionTypeTitle");
                jobPosition.gridOptions.myfilterText(jobPosition.ListItems, "LinkPropertyId", listProperties, "Title", "LinkPropertyTitle");
                jobPosition.gridOptions.fillData(jobPosition.ListItems);
                jobPosition.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            jobPosition.busyIndicator.isActive = false;
            jobPosition.addRequested = false;
        });
    }

    jobPosition.openEditModal = function () {
        if (buttonIsPressed) { return };
        jobPosition.modalTitle = 'ویرایش';
        if (!jobPosition.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'jobposition/GetOne', jobPosition.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;

            rashaErManage.checkAction(response);
            jobPosition.selectedItem = response.Item;
            jobPosition.selectedItem.LinkPropertyTitle = jobPosition.gridOptions.selectedRow.item.LinkPropertyTitle;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleJob/JobPosition/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    jobPosition.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        jobPosition.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'jobposition/edit', jobPosition.selectedItem, 'PUT').success(function (response) {
            jobPosition.addRequested = true;
            rashaErManage.checkAction(response);
            jobPosition.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                jobPosition.addRequested = false;
                jobPosition.replaceItem(jobPosition.selectedItem.Id, response.Item);
                jobPosition.gridOptions.myfilterText(jobPosition.ListItems, "LinkJobPositionTypeId", jobPosition.positionTypes, "Title", "LinkPositionTypeTitle");
                jobPosition.gridOptions.myfilterText(jobPosition.ListItems, "LinkPropertyId", listProperties, "Title", "LinkPropertyTitle");
                jobPosition.gridOptions.fillData(jobPosition.ListItems);
                jobPosition.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            jobPosition.addRequested = false;
            jobPosition.busyIndicator.isActive = false;
        });
    }

    jobPosition.closeModal = function () {
        $modalStack.dismissAll();
    };

    jobPosition.replaceItem = function (oldId, newItem) {
        angular.forEach(jobPosition.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = jobPosition.ListItems.indexOf(item);
                jobPosition.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            jobPosition.ListItems.unshift(newItem);
    }

    jobPosition.deleteRow = function () {
        if (buttonIsPressed) { return };
        if (!jobPosition.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                jobPosition.busyIndicator.isActive = true;
                console.log(jobPosition.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'jobposition/GetOne', jobPosition.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    jobPosition.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'jobposition/delete', jobPosition.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        jobPosition.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            jobPosition.replaceItem(jobPosition.selectedItemForDelete.Id);
                            jobPosition.gridOptions.fillData(jobPosition.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        jobPosition.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    jobPosition.busyIndicator.isActive = false;

                });
            }
        });
    }

    jobPosition.searchData = function () {
        jobPosition.gridOptions.searchData();

    }

    jobPosition.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            { name: 'LinkParentId', displayName: 'کد سیستمی والد', sortable: true, type: 'string', visible: true }
        ],
        data: {},
        multiSelect: false,
        startDate: moment().format(),
        advancedSearchData: {
            engine: {}
        }
    }

    jobPosition.gridOptions.advancedSearchData = {};
    jobPosition.gridOptions.advancedSearchData.engine = {};
    jobPosition.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    jobPosition.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    jobPosition.gridOptions.advancedSearchData.engine.SortType = 1;
    jobPosition.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    jobPosition.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    jobPosition.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    jobPosition.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    jobPosition.gridOptions.advancedSearchData.engine.Filters = [];

    jobPosition.test = 'false';

    jobPosition.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            jobPosition.focusExpireLockAccount = true;
        });
    };

    jobPosition.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            jobPosition.focus = true;
        });
    };

    jobPosition.gridOptions.reGetAll = function () {
        jobPosition.init();
    }

    jobPosition.gridOptions.onRowSelected = function () {

    }

    jobPosition.columnCheckbox = false;
    jobPosition.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (jobPosition.gridOptions.columnCheckbox) {
            for (var i = 0; i < jobPosition.gridOptions.columns.length; i++) {
                //jobPosition.gridOptions.columns[i].visible = $("#" + jobPosition.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + jobPosition.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                jobPosition.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = jobPosition.gridOptions.columns;
            for (var i = 0; i < jobPosition.gridOptions.columns.length; i++) {
                jobPosition.gridOptions.columns[i].visible = true;
                var element = $("#" + jobPosition.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + jobPosition.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < jobPosition.gridOptions.columns.length; i++) {
            console.log(jobPosition.gridOptions.columns[i].name.concat(".visible: "), jobPosition.gridOptions.columns[i].visible);
        }
        jobPosition.gridOptions.columnCheckbox = !jobPosition.gridOptions.columnCheckbox;
    }


    //insert properties into input
    jobPosition.autoComplete = function () {
        $("#properties").autocomplete({
            source: jobPosition.properties, select: function (event, ui) {
                jobPosition.selectedItem.LinkPropertyId = ui.item.LinkPropertyId;
            }
        });
    }

    // Filter Texts
    jobPosition.gridOptions.myfilterText = function (gridListItems, foreignKeyName, childListItems, childDesiredPropertyName, childItemColumnName) {
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

    jobPosition.newProperty = false;
    jobPosition.selectProperty = false;
    
    jobPosition.onSelectPropertyPanelShowChange = function (propertyPanel) {
        if (propertyPanel == "select") {
            $("#newPropertyPanel").fadeOut("fast");
            $("#selectPropertyPanel").fadeIn("fast");
        } else {
            $("#selectPropertyPanel").fadeOut("fast");
            $("#newPropertyPanel").fadeIn("fast");
        }
    }

    jobPosition.onPropertyTypeChange = function (propertyTypeId) {
        var filterValue = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(propertyTypeId),
            SearchType: 0
        }
        var engine = {};
        engine.Filters = [];
        engine.Filters.push(filterValue);
        ajax.call(cmsServerConfig.configApiServerPath+"jobPositionDetail/GetAll", engine, 'POST').success(function (response) {
            jobPosition.propertyDetailsListItems = response.ListItems;

            $.each(jobPosition.propertyDetailsListItems, function (index, item) {
                item.value = null;
                // Add groups to its list
                var result = $.grep(jobPosition.propertyDetailGroupListItems, function (e) { return e.Id == item.virtual_PropertyDetailGroup.Id; });
                if (result.length <= 0)
                    jobPosition.propertyDetailGroupListItems.push(item.virtual_PropertyDetailGroup);

                // Add DefaultValue to the object
                item.DefaultValue = JSON.parse(item.JsonDefaultValue);
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Export Report 
    jobPosition.exportFile = function () {
        jobPosition.addRequested = true;
        jobPosition.gridOptions.advancedSearchData.engine.ExportFile = jobPosition.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'JobPosition/exportfile', jobPosition.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                jobPosition.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //jobPosition.closeModal();
            }
            jobPosition.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    jobPosition.toggleExportForm = function () {
        jobPosition.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        jobPosition.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        jobPosition.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        jobPosition.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        jobPosition.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleJob/JobPosition/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    jobPosition.rowCountChanged = function () {
        if (!angular.isDefined(jobPosition.ExportFileClass.RowCount) || jobPosition.ExportFileClass.RowCount > 5000)
            jobPosition.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    jobPosition.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"JobPosition/count", jobPosition.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            jobPosition.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            jobPosition.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }


}]);

