app.controller("cmsModuleSiteGridCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var cmsModuleSitegrd = this;
    cmsModuleSitegrd.ListItems = [];
    cmsModuleSitegrd.cmsModuleListItems = [];
    cmsModuleSitegrd.CmsSiteListItems = [];
    if (itemRecordStatus != undefined) cmsModuleSitegrd.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    cmsModuleSitegrd.datePickerConfig = {
        defaultDate: date

    };
    cmsModuleSitegrd.ExpireDate = {
        defaultDate: date,
        setTime: function (date) { this.defaultDate = date; }
    }

    cmsModuleSitegrd.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    cmsModuleSitegrd.init = function () {
        cmsModuleSitegrd.busyIndicator.isActive = true;
        // Populate CmsModules
        ajax.call(cmsServerConfig.configApiServerPath+"CoreModule/getall", cmsModuleSitegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response1) {
            rashaErManage.checkAction(response1);
            cmsModuleSitegrd.cmsModuleListItems = response1.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsModuleSitegrd.busyIndicator.isActive = false;
            console.log(data);
        });
        // Populate CmsSites
        ajax.call(cmsServerConfig.configApiServerPath+"CoreSite/getallwithalias", cmsModuleSitegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response2) {
            rashaErManage.checkAction(response2);
            cmsModuleSitegrd.CmsSiteListItems = response2.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsModuleSitegrd.busyIndicator.isActive = false;
            console.log(data);
        });
        //Get all CmsModuleSite
        ajax.call(cmsServerConfig.configApiServerPath+"CoreModuleSite/getall", cmsModuleSitegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response3) {
            rashaErManage.checkAction(response3);
            cmsModuleSitegrd.ListItems = response3.ListItems;
            cmsModuleSitegrd.gridOptions.fillData(cmsModuleSitegrd.ListItems, response3.resultAccess);
            cmsModuleSitegrd.gridOptions.resultAccess = response3.resultAccess;//دسترسی ها نمایش
            cmsModuleSitegrd.gridOptions.currentPageNumber = response3.CurrentPageNumber;
            cmsModuleSitegrd.gridOptions.totalRowCount = response3.TotalRowCount;
            cmsModuleSitegrd.gridOptions.rowPerPage = response3.RowPerPage;
            cmsModuleSitegrd.gridOptions.maxSize = 5;
            cmsModuleSitegrd.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            cmsModuleSitegrd.busyIndicator.isActive = false;
            cmsModuleSitegrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    cmsModuleSitegrd.addRequested = false;
    cmsModuleSitegrd.openAddModal = function () {
        cmsModuleSitegrd.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSite/GetViewModel', '', 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            var now = moment().add(1, "years").format();
            response.Item.ExpireDate = now;
            cmsModuleSitegrd.ExpireDate.setTime(now);
            cmsModuleSitegrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsModuleSite/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    cmsModuleSitegrd.addNewRow = function (frm) {
        if (frm.$invalid)
            return;
        //برای جلوگیر ی از وارد کردن اطلاعات تکراری
        for (var i = 0; i < cmsModuleSitegrd.ListItems.length; i++) {
            if (cmsModuleSitegrd.selectedItem.LinkSiteId == cmsModuleSitegrd.ListItems[i].LinkSiteId && cmsModuleSitegrd.selectedItem.LinkModuleId == cmsModuleSitegrd.ListItems[i].LinkModuleId) {
                rashaErManage.showMessage($filter('translatentk')('Information_Is_Duplicate'));
                return;
            }
        }

        cmsModuleSitegrd.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSite/add', cmsModuleSitegrd.selectedItem, 'POST').success(function (response) {
            cmsModuleSitegrd.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsModuleSitegrd.ListItems.unshift(response.Item);
                cmsModuleSitegrd.gridOptions.fillData(cmsModuleSitegrd.ListItems);
                cmsModuleSitegrd.gridOptions.myfilterText(cmsModuleSitegrd.ListItems, "LinkSiteId", cmsModuleSitegrd.CmsSiteListItems, "SiteTitle");
                cmsModuleSitegrd.gridOptions.myfilterText(cmsModuleSitegrd.ListItems, "LinkModuleId", cmsModuleSitegrd.cmsModuleListItems, "ModlueTitle");
                cmsModuleSitegrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsModuleSitegrd.addRequested = false;
        });

    }

    // Open Edit Content Modal
    cmsModuleSitegrd.openEditModal = function () {
        cmsModuleSitegrd.modalTitle = 'ویرایش';
        if (!cmsModuleSitegrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        cmsModuleSitegrd.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSite/GetOne', cmsModuleSitegrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            cmsModuleSitegrd.addRequested = false;
            rashaErManage.checkAction(response);
            cmsModuleSitegrd.selectedItem = response.Item;
            cmsModuleSitegrd.ExpireDate.setTime(response.Item.ExpireDate);
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsModuleSite/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsModuleSitegrd.editRow = function (frm) {
        if (frm.$invalid)
            return;
        //برای جلوگیر ی از وارد کردن اطلاعات تکراری
        for (var i = 0; i < cmsModuleSitegrd.ListItems.length; i++) {
            if (cmsModuleSitegrd.selectedItem.LinkSiteId == cmsModuleSitegrd.ListItems[i].LinkSiteId && cmsModuleSitegrd.selectedItem.LinkModuleId == cmsModuleSitegrd.ListItems[i].LinkModuleId) {
                if (cmsModuleSitegrd.selectedItem.Id != cmsModuleSitegrd.ListItems[i].Id) {
                    rashaErManage.showMessage($filter('translatentk')('Information_Is_Duplicate'));
                    return;
                }
            }
        }
        cmsModuleSitegrd.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSite/edit', cmsModuleSitegrd.selectedItem, 'PUT').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsModuleSitegrd.addRequested = false;
                cmsModuleSitegrd.replaceItem(cmsModuleSitegrd.selectedItem.Id, response.Item);
                cmsModuleSitegrd.gridOptions.fillData(cmsModuleSitegrd.ListItems);
                cmsModuleSitegrd.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsModuleSitegrd.addRequested = false;
        });

    }

    cmsModuleSitegrd.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsModuleSitegrd.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsModuleSitegrd.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsModuleSitegrd.ListItems.indexOf(item);
                cmsModuleSitegrd.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsModuleSitegrd.ListItems.unshift(newItem);
    }

    cmsModuleSitegrd.deleteRow = function () {
        if (!cmsModuleSitegrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(cmsModuleSitegrd.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSite/GetOne', cmsModuleSitegrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsModuleSitegrd.selectedItemForDelete = response.Item;
                    console.log(cmsModuleSitegrd.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSite/delete', cmsModuleSitegrd.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsModuleSitegrd.replaceItem(cmsModuleSitegrd.selectedItemForDelete.Id);
                            cmsModuleSitegrd.gridOptions.fillData(cmsModuleSitegrd.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });


    }

    cmsModuleSitegrd.searchData = function () {
        cmsModuleSitegrd.gridOptions.serachData();
    }

    cmsModuleSitegrd.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'virtual_CmsSite.Title', displayName: 'سایت', sortable: true, type: 'link', displayForce: true },
            { name: 'virtual_CmsModule.Title', displayName: 'ماژول', sortable: true, type: 'link', displayForce: true },
            { name: 'ExpireDate', displayName: 'تاریخ  انقضا', sortable: true, isDate: true, type: 'date' }
        ],
        data: {},
        multiSelect: false,
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

    cmsModuleSitegrd.gridOptions.reGetAll = function () {
        cmsModuleSitegrd.init();
    }

    cmsModuleSitegrd.columnCheckbox = false;
    cmsModuleSitegrd.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = cmsModuleSitegrd.gridOptions.columns;
        if (cmsModuleSitegrd.gridOptions.columnCheckbox) {
            for (var i = 0; i < cmsModuleSitegrd.gridOptions.columns.length; i++) {
                var element = $("#" + cmsModuleSitegrd.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                cmsModuleSitegrd.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < cmsModuleSitegrd.gridOptions.columns.length; i++) {
                var element = $("#" + cmsModuleSitegrd.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + cmsModuleSitegrd.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < cmsModuleSitegrd.gridOptions.columns.length; i++) {
            console.log(cmsModuleSitegrd.gridOptions.columns[i].name.concat(".visible: "), cmsModuleSitegrd.gridOptions.columns[i].visible);
        }
        cmsModuleSitegrd.gridOptions.columnCheckbox = !cmsModuleSitegrd.gridOptions.columnCheckbox;
    }

    //Export Report 
    cmsModuleSitegrd.exportFile = function () {
        cmsModuleSitegrd.addRequested = true;
        cmsModuleSitegrd.gridOptions.advancedSearchData.engine.ExportFile = cmsModuleSitegrd.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSite/exportfile', cmsModuleSitegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                cmsModuleSitegrd.closeModal();
            }
            cmsModuleSitegrd.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    cmsModuleSitegrd.toggleExportForm = function () {
        cmsModuleSitegrd.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'Random', value: 3 }
        ];
        cmsModuleSitegrd.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        cmsModuleSitegrd.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'فایل منیجر', value: 3 }
        ];
        cmsModuleSitegrd.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCore/CmsModuleSite/report.html',
            scope: $scope
        });
    }
    //Row Count Input Change
    cmsModuleSitegrd.rowCountChanged = function () {
        if (!angular.isDefined(cmsModuleSitegrd.ExportFileClass.RowCount) || cmsModuleSitegrd.ExportFileClass.RowCount > 2000)
            cmsModuleSitegrd.ExportFileClass.RowCount = 2000;
    }
    //Get TotalRowCount
    cmsModuleSitegrd.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"WebDesignerMainPage/count", cmsModuleSitegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsModuleSitegrd.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            cmsModuleSitegrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);