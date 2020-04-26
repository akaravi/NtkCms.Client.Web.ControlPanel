app.controller("jobPropertyTypeController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$state', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $state, $window, $filter) {
    var jobPropertyType = this;
    jobPropertyType.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    jobPropertyType.ListItems = [];
    jobPropertyType.selectUniversalMenuOnUndetectableKey = true;
    if (itemRecordStatus != undefined) jobPropertyType.itemRecordStatus = itemRecordStatus;

    jobPropertyType.init = function () {
        jobPropertyType.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"jobpropertytype/getall", jobPropertyType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            jobPropertyType.busyIndicator.isActive = false;
            jobPropertyType.ListItems = response.ListItems;
            jobPropertyType.gridOptions.fillData(jobPropertyType.ListItems, response.resultAccess);
            jobPropertyType.gridOptions.currentPageNumber = response.CurrentPageNumber;
            jobPropertyType.gridOptions.totalRowCount = response.TotalRowCount;
            jobPropertyType.gridOptions.rowPerPage = response.RowPerPage;
            jobPropertyType.allowedSearch = response.AllowedSearchField;

        }).error(function (data, errCode, c, d) {
            jobPropertyType.busyIndicator.isActive = false;
            jobPropertyType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    jobPropertyType.busyIndicator.isActive = true;
    jobPropertyType.addRequested = false;
    jobPropertyType.openAddModal = function () {
        jobPropertyType.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'jobpropertytype/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            jobPropertyType.busyIndicator.isActive = false;
            jobPropertyType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleJob/JobPropertyType/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            jobPropertyType.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    jobPropertyType.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        jobPropertyType.busyIndicator.isActive = true;
        jobPropertyType.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'jobpropertytype/add', jobPropertyType.selectedItem, 'POST').success(function (response) {
            jobPropertyType.addRequested = false;
            jobPropertyType.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                jobPropertyType.ListItems.unshift(response.Item);
                jobPropertyType.gridOptions.fillData(jobPropertyType.ListItems);
                jobPropertyType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            jobPropertyType.busyIndicator.isActive = false;
            jobPropertyType.addRequested = false;
        });
    }

    jobPropertyType.openEditModal = function () {
        jobPropertyType.modalTitle = 'ویرایش';
        if (!jobPropertyType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'jobpropertytype/GetOne', jobPropertyType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            jobPropertyType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleJob/JobPropertyType/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    jobPropertyType.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        jobPropertyType.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'jobpropertytype/edit', jobPropertyType.selectedItem, 'PUT').success(function (response) {
            jobPropertyType.addRequested = true;
            rashaErManage.checkAction(response);
            jobPropertyType.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                jobPropertyType.addRequested = false;
                jobPropertyType.replaceItem(jobPropertyType.selectedItem.Id, response.Item);
                jobPropertyType.gridOptions.fillData(jobPropertyType.ListItems);
                jobPropertyType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            jobPropertyType.addRequested = false;
            jobPropertyType.busyIndicator.isActive = false;

        });
    }

    jobPropertyType.closeModal = function () {
        $modalStack.dismissAll();
    };

    jobPropertyType.replaceItem = function (oldId, newItem) {
        angular.forEach(jobPropertyType.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = jobPropertyType.ListItems.indexOf(item);
                jobPropertyType.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            jobPropertyType.ListItems.unshift(newItem);
    }

    jobPropertyType.deleteRow = function () {
        if (!jobPropertyType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                jobPropertyType.busyIndicator.isActive = true;
                console.log(jobPropertyType.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'jobpropertytype/GetOne', jobPropertyType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    jobPropertyType.selectedItemForDelete = response.Item;
                    console.log(jobPropertyType.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'jobpropertytype/delete', jobPropertyType.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        jobPropertyType.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            jobPropertyType.replaceItem(jobPropertyType.selectedItemForDelete.Id);
                            jobPropertyType.gridOptions.fillData(jobPropertyType.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        jobPropertyType.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    jobPropertyType.busyIndicator.isActive = false;

                });
            }
        });
    }

    jobPropertyType.searchData = function () {
        jobPropertyType.gridOptions.searchData();

    }

    jobPropertyType.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: true },
            { name: 'ActionButtons', displayName: 'خصوصیات متقاضی', sortable: true, type: 'string', visible: true, displayForce: true, template: '<button type="button" class="btn btn-primary" ng-click="jobPropertyType.goToDetails(x.Id)"  class="btn btn-primary"><i class="fa fa-plus-circle" aria-hidden="true"></i>&nbsp;خصوصیات</button>' }
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

    jobPropertyType.gridOptions.reGetAll = function () {
        jobPropertyType.init();
    }

    jobPropertyType.gridOptions.onRowSelected = function () {

    }

    jobPropertyType.columnCheckbox = false;
    jobPropertyType.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (jobPropertyType.gridOptions.columnCheckbox) {
            for (var i = 0; i < jobPropertyType.gridOptions.columns.length; i++) {
                //jobPropertyType.gridOptions.columns[i].visible = $("#" + jobPropertyType.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + jobPropertyType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                jobPropertyType.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = jobPropertyType.gridOptions.columns;
            for (var i = 0; i < jobPropertyType.gridOptions.columns.length; i++) {
                jobPropertyType.gridOptions.columns[i].visible = true;
                var element = $("#" + jobPropertyType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + jobPropertyType.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < jobPropertyType.gridOptions.columns.length; i++) {
            console.log(jobPropertyType.gridOptions.columns[i].name.concat(".visible: "), jobPropertyType.gridOptions.columns[i].visible);
        }
        jobPropertyType.gridOptions.columnCheckbox = !jobPropertyType.gridOptions.columnCheckbox;
    }

    jobPropertyType.goToDetails = function (proprtyId) {
        $state.go('index.jobpropertydetail', { propertyParam: proprtyId });
    }
    //Export Report 
    jobPropertyType.exportFile = function () {
        jobPropertyType.addRequested = true;
        jobPropertyType.gridOptions.advancedSearchData.engine.ExportFile = jobPropertyType.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'jobPropertyType/exportfile', jobPropertyType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                jobPropertyType.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //jobPropertyType.closeModal();
            }
            jobPropertyType.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    jobPropertyType.toggleExportForm = function () {
        jobPropertyType.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        jobPropertyType.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        jobPropertyType.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        jobPropertyType.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        jobPropertyType.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleJob/jobPropertyType/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    jobPropertyType.rowCountChanged = function () {
        if (!angular.isDefined(jobPropertyType.ExportFileClass.RowCount) || jobPropertyType.ExportFileClass.RowCount > 5000)
            jobPropertyType.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    jobPropertyType.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"jobPropertyType/count", jobPropertyType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            jobPropertyType.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            jobPropertyType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);

