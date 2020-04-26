app.controller("jobContractTypeController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var jobContractType = this;
    jobContractType.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    jobContractType.ListItems = [];
    if (itemRecordStatus != undefined) jobContractType.itemRecordStatus = itemRecordStatus;



    jobContractType.init = function () {
        jobContractType.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = jobContractType.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        ajax.call(cmsServerConfig.configApiServerPath+"jobcontracttype/getall", jobContractType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            jobContractType.busyIndicator.isActive = false;
            jobContractType.ListItems = response.ListItems;

            // Call Excerpt Function to shorten the length of long strings
            //excerptField(jobContractType.ListItems, "BotToken");
            jobContractType.gridOptions.fillData(jobContractType.ListItems, response.resultAccess);
            jobContractType.gridOptions.currentPageNumber = response.CurrentPageNumber;
            jobContractType.gridOptions.totalRowCount = response.TotalRowCount;
            jobContractType.gridOptions.rowPerPage = response.RowPerPage;
            jobContractType.allowedSearch = response.AllowedSearchField;

        }).error(function (data, errCode, c, d) {
            jobContractType.busyIndicator.isActive = false;
            jobContractType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    jobContractType.busyIndicator.isActive = true;
    jobContractType.addRequested = false;
    jobContractType.openAddModal = function () {
        jobContractType.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'jobcontracttype/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            jobContractType.busyIndicator.isActive = false;
            jobContractType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleJob/JobContractType/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            jobContractType.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    jobContractType.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        jobContractType.busyIndicator.isActive = true;
        jobContractType.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'jobcontracttype/add', jobContractType.selectedItem, 'POST').success(function (response) {
            jobContractType.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                jobContractType.ListItems.unshift(response.Item);
                jobContractType.gridOptions.fillData(jobContractType.ListItems);
                jobContractType.busyIndicator.isActive = false;
                jobContractType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            jobContractType.busyIndicator.isActive = false;
            jobContractType.addRequested = false;
        });
    }

    // Open Edit Modal
    jobContractType.openEditModal = function () {
        jobContractType.modalTitle = 'ویرایش';
        if (!jobContractType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'jobcontracttype/GetOne', jobContractType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            jobContractType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleJob/JobContractType/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    jobContractType.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        jobContractType.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'jobcontracttype/edit', jobContractType.selectedItem, 'PUT').success(function (response) {
            jobContractType.addRequested = true;
            rashaErManage.checkAction(response);
            jobContractType.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                jobContractType.addRequested = false;
                jobContractType.replaceItem(jobContractType.selectedItem.Id, response.Item);
                jobContractType.gridOptions.fillData(jobContractType.ListItems);
                jobContractType.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            jobContractType.addRequested = false;
            jobContractType.busyIndicator.isActive = false;

        });
    }

    jobContractType.closeModal = function () {
        $modalStack.dismissAll();
    };

    jobContractType.replaceItem = function (oldId, newItem) {
        angular.forEach(jobContractType.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = jobContractType.ListItems.indexOf(item);
                jobContractType.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            jobContractType.ListItems.unshift(newItem);
    }

    jobContractType.deleteRow = function () {
        if (!jobContractType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                jobContractType.busyIndicator.isActive = true;
                console.log(jobContractType.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'jobcontracttype/GetOne', jobContractType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    jobContractType.selectedItemForDelete = response.Item;
                    console.log(jobContractType.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'jobcontracttype/delete', jobContractType.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        jobContractType.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            jobContractType.replaceItem(jobContractType.selectedItemForDelete.Id);
                            jobContractType.gridOptions.fillData(jobContractType.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        jobContractType.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    jobContractType.busyIndicator.isActive = false;

                });
            }
        });
    }

    jobContractType.searchData = function () {
        jobContractType.gridOptions.searchData();

    }

    jobContractType.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'نوع معامله', sortable: true, type: 'string', visible: true },
            { name: 'HasFixedSalary', displayName: 'حقوق ثابت دارد', sortable: true, type: 'string', isCheckBox: true, visible: true },
            { name: 'HasCommission', displayName: 'پورسانت دارد', sortable: true, type: 'string', isCheckBox: true, visible: true },
            { name: 'HasShareInCompany', displayName: 'در شرکت سهم دارد', sortable: true, type: 'string', isCheckBox: true, visible: true },
            //{ name: 'HasDepositPrice', displayName: 'قیمت رهن دارد', sortable: true, type: 'string', isCheckBox: true, visible: true }
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

    jobContractType.gridOptions.reGetAll = function () {
        jobContractType.init();
    }

    jobContractType.gridOptions.onRowSelected = function () {

    }

    jobContractType.columnCheckbox = false;
    jobContractType.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (jobContractType.gridOptions.columnCheckbox) {
            for (var i = 0; i < jobContractType.gridOptions.columns.length; i++) {
                //jobContractType.gridOptions.columns[i].visible = $("#" + jobContractType.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + jobContractType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                jobContractType.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = jobContractType.gridOptions.columns;
            for (var i = 0; i < jobContractType.gridOptions.columns.length; i++) {
                jobContractType.gridOptions.columns[i].visible = true;
                var element = $("#" + jobContractType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + jobContractType.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < jobContractType.gridOptions.columns.length; i++) {
            console.log(jobContractType.gridOptions.columns[i].name.concat(".visible: "), jobContractType.gridOptions.columns[i].visible);
        }
        jobContractType.gridOptions.columnCheckbox = !jobContractType.gridOptions.columnCheckbox;
    }
    //Export Report 
    jobContractType.exportFile = function () {
        jobContractType.addRequested = true;
        jobContractType.gridOptions.advancedSearchData.engine.ExportFile = jobContractType.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'jobContractType/exportfile', jobContractType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                jobContractType.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //jobContractType.closeModal();
            }
            jobContractType.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    jobContractType.toggleExportForm = function () {
        jobContractType.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        jobContractType.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        jobContractType.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        jobContractType.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        jobContractType.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleJob/jobContractType/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    jobContractType.rowCountChanged = function () {
        if (!angular.isDefined(jobContractType.ExportFileClass.RowCount) || jobContractType.ExportFileClass.RowCount > 5000)
            jobContractType.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    jobContractType.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"jobContractType/count", jobContractType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            jobContractType.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            jobContractType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);

