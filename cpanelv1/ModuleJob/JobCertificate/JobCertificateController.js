app.controller("jobCertificateController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var jobCertificate = this;
    jobCertificate.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    jobCertificate.certificateTypes = [];
    jobCertificate.properties = [];
    listProperties = [];
    jobCertificate.selectUniversalMenuOnUndetectableKey = true;
    if (itemRecordStatus != undefined) jobCertificate.itemRecordStatus = itemRecordStatus;

    jobCertificate.init = function () {
        jobCertificate.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"jobcertificate/getall", jobCertificate.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            jobCertificate.busyIndicator.isActive = false;
            jobCertificate.ListItems = response.ListItems;
            jobCertificate.gridOptions.fillData(jobCertificate.ListItems, response.resultAccess);
            jobCertificate.gridOptions.currentPageNumber = response.CurrentPageNumber;
            jobCertificate.gridOptions.totalRowCount = response.TotalRowCount;
            jobCertificate.gridOptions.rowPerPage = response.RowPerPage;
            jobCertificate.gridOptions.maxSize = 5;
            jobCertificate.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            jobCertificate.busyIndicator.isActive = false;
            jobCertificate.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    jobCertificate.busyIndicator.isActive = true;
    jobCertificate.addRequested = false;
    jobCertificate.openAddModal = function () {
        if (buttonIsPressed) { return };

        jobCertificate.modalTitle = 'اضافه';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'jobcertificate/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;

            rashaErManage.checkAction(response);
            jobCertificate.busyIndicator.isActive = false;
            jobCertificate.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleJob/JobCertificate/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            jobCertificate.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    jobCertificate.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        jobCertificate.busyIndicator.isActive = true;
        jobCertificate.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'jobcertificate/add', jobCertificate.selectedItem, 'POST').success(function (response) {
            jobCertificate.addRequested = false;
            jobCertificate.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                jobCertificate.ListItems.unshift(response.Item);
                jobCertificate.gridOptions.fillData(jobCertificate.ListItems);
                jobCertificate.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            jobCertificate.busyIndicator.isActive = false;
            jobCertificate.addRequested = false;
        });
    }

    jobCertificate.openEditModal = function () {
        if (buttonIsPressed) { return };


        jobCertificate.modalTitle = 'ویرایش';
        if (!jobCertificate.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'jobcertificate/GetOne', jobCertificate.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;

            rashaErManage.checkAction(response);
            jobCertificate.selectedItem = response.Item;
            jobCertificate.selectedItem.LinkPropertyTitle = jobCertificate.gridOptions.selectedRow.item.LinkPropertyTitle;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleJob/JobCertificate/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    jobCertificate.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        jobCertificate.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'jobcertificate/edit', jobCertificate.selectedItem, 'PUT').success(function (response) {
            jobCertificate.addRequested = true;
            rashaErManage.checkAction(response);
            jobCertificate.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                jobCertificate.addRequested = false;
                jobCertificate.replaceItem(jobCertificate.selectedItem.Id, response.Item);
                jobCertificate.gridOptions.fillData(jobCertificate.ListItems);
                jobCertificate.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            jobCertificate.addRequested = false;
            jobCertificate.busyIndicator.isActive = false;
        });
    }

    jobCertificate.closeModal = function () {
        $modalStack.dismissAll();
    };

    jobCertificate.replaceItem = function (oldId, newItem) {
        angular.forEach(jobCertificate.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = jobCertificate.ListItems.indexOf(item);
                jobCertificate.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            jobCertificate.ListItems.unshift(newItem);
    }

    jobCertificate.deleteRow = function () {
        if (buttonIsPressed) { return };

        if (!jobCertificate.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                jobCertificate.busyIndicator.isActive = true;
                console.log(jobCertificate.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'jobcertificate/GetOne', jobCertificate.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    jobCertificate.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'jobcertificate/delete', jobCertificate.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        jobCertificate.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            jobCertificate.replaceItem(jobCertificate.selectedItemForDelete.Id);
                            jobCertificate.gridOptions.fillData(jobCertificate.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        jobCertificate.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    jobCertificate.busyIndicator.isActive = false;
                });
            }
        });
    }

    jobCertificate.searchData = function () {
        jobCertificate.gridOptions.searchData();
    }

    jobCertificate.gridOptions = {
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

    jobCertificate.gridOptions.reGetAll = function () {
        jobCertificate.init();
    }

    jobCertificate.gridOptions.onRowSelected = function () {

    }

    jobCertificate.columnCheckbox = false;
    jobCertificate.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (jobCertificate.gridOptions.columnCheckbox) {
            for (var i = 0; i < jobCertificate.gridOptions.columns.length; i++) {
                //jobCertificate.gridOptions.columns[i].visible = $("#" + jobCertificate.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + jobCertificate.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                jobCertificate.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = jobCertificate.gridOptions.columns;
            for (var i = 0; i < jobCertificate.gridOptions.columns.length; i++) {
                jobCertificate.gridOptions.columns[i].visible = true;
                var element = $("#" + jobCertificate.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + jobCertificate.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < jobCertificate.gridOptions.columns.length; i++) {
            console.log(jobCertificate.gridOptions.columns[i].name.concat(".visible: "), jobCertificate.gridOptions.columns[i].visible);
        }
        jobCertificate.gridOptions.columnCheckbox = !jobCertificate.gridOptions.columnCheckbox;
    }


    //insert properties into input
    jobCertificate.autoComplete = function () {
        $("#properties").autocomplete({
            source: jobCertificate.properties, select: function (event, ui) {
                jobCertificate.selectedItem.LinkPropertyId = ui.item.LinkPropertyId;
            }
        });
    }

    // Filter Texts
    jobCertificate.gridOptions.myfilterText = function (gridListItems, foreignKeyName, childListItems, childDesiredPropertyName, childItemColumnName) {
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

    jobCertificate.newProperty = false;
    jobCertificate.selectProperty = false;

    jobCertificate.onSelectPropertyPanelShowChange = function (propertyPanel) {
        if (propertyPanel == "select") {
            $("#newPropertyPanel").fadeOut("fast");
            $("#selectPropertyPanel").fadeIn("fast");
        } else {
            $("#selectPropertyPanel").fadeOut("fast");
            $("#newPropertyPanel").fadeIn("fast");
        }
    }

    jobCertificate.onPropertyTypeChange = function (propertyTypeId) {
        var filterValue = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(propertyTypeId),
            SearchType: 0
        }
        var engine = {};
        engine.Filters = [];
        engine.Filters.push(filterValue);
        ajax.call(cmsServerConfig.configApiServerPath+"jobCertificateDetail/GetAll", engine, 'POST').success(function (response) {
            jobCertificate.propertyDetailsListItems = response.ListItems;

            $.each(jobCertificate.propertyDetailsListItems, function (index, item) {
                item.value = null;
                // Add groups to its list
                var result = $.grep(jobCertificate.propertyDetailGroupListItems, function (e) { return e.Id == item.virtual_PropertyDetailGroup.Id; });
                if (result.length <= 0)
                    jobCertificate.propertyDetailGroupListItems.push(item.virtual_PropertyDetailGroup);

                // Add DefaultValue to the object
                item.DefaultValue = JSON.parse(item.JsonDefaultValue);
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Export Report 
    jobCertificate.exportFile = function () {
        jobCertificate.addRequested = true;
        jobCertificate.gridOptions.advancedSearchData.engine.ExportFile = jobCertificate.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'JobCertificate/exportfile', jobCertificate.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                jobCertificate.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //jobCertificate.closeModal();
            }
            jobCertificate.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    jobCertificate.toggleExportForm = function () {
        jobCertificate.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        jobCertificate.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        jobCertificate.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        jobCertificate.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        jobCertificate.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleJob/JobCertificate/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    jobCertificate.rowCountChanged = function () {
        if (!angular.isDefined(jobCertificate.ExportFileClass.RowCount) || jobCertificate.ExportFileClass.RowCount > 5000)
            jobCertificate.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    jobCertificate.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"JobCertificate/count", jobCertificate.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            jobCertificate.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            jobCertificate.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }


}]);

