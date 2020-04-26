app.controller("CmsModuleSaleHeaderGroupController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var CmsModuleHeaderG = this;
    CmsModuleHeaderG.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    CmsModuleHeaderG.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "CmsModuleSaleHeaderGroupController") {
            localStorage.setItem('AddRequest', '');
            CmsModuleHeaderG.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    CmsModuleHeaderG.ContentList = [];

    CmsModuleHeaderG.allowedSearch = [];
    if (itemRecordStatus != undefined) CmsModuleHeaderG.itemRecordStatus = itemRecordStatus;
    CmsModuleHeaderG.init = function () {
        CmsModuleHeaderG.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = CmsModuleHeaderG.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }

        ajax.call(cmsServerConfig.configApiServerPath+"CoreModuleSaleHeaderGroup/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            CmsModuleHeaderG.busyIndicator.isActive = false;
            CmsModuleHeaderG.ListItems = response.ListItems;
            CmsModuleHeaderG.gridOptions.fillData(CmsModuleHeaderG.ListItems , response.resultAccess);
            CmsModuleHeaderG.gridOptions.currentPageNumber = response.CurrentPageNumber;
            CmsModuleHeaderG.gridOptions.totalRowCount = response.TotalRowCount;
            CmsModuleHeaderG.gridOptions.rowPerPage = response.RowPerPage;
            CmsModuleHeaderG.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            CmsModuleHeaderG.busyIndicator.isActive = false;
            CmsModuleHeaderG.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //CmsModuleHeaderG.busyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSaleHeaderGroup/getall', {}, 'POST').success(function (response) {
        //    CmsModuleHeaderG.ContentList = response.ListItems;
        //    CmsModuleHeaderG.busyIndicator.isActive = false;
        //});
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        CmsModuleHeaderG.checkRequestAddNewItemFromOtherControl(null);
    }
    CmsModuleHeaderG.busyIndicator.isActive = true;
    CmsModuleHeaderG.addRequested = false;
    CmsModuleHeaderG.openAddModal = function () {
        CmsModuleHeaderG.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSaleHeaderGroup/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            CmsModuleHeaderG.busyIndicator.isActive = false;
            CmsModuleHeaderG.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/CmsModuleSaleHeaderGroup/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    CmsModuleHeaderG.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        CmsModuleHeaderG.busyIndicator.isActive = true;
        CmsModuleHeaderG.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSaleHeaderGroup/add', CmsModuleHeaderG.selectedItem, 'POST').success(function (response) {
            CmsModuleHeaderG.addRequested = false;
            CmsModuleHeaderG.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                CmsModuleHeaderG.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                CmsModuleHeaderG.ListItems.unshift(response.Item);
                CmsModuleHeaderG.gridOptions.fillData(CmsModuleHeaderG.ListItems);
                CmsModuleHeaderG.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            CmsModuleHeaderG.busyIndicator.isActive = false;
            CmsModuleHeaderG.addRequested = false;
        });
    }


    CmsModuleHeaderG.openEditModal = function () {

        CmsModuleHeaderG.modalTitle = 'ویرایش';
        if (!CmsModuleHeaderG.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSaleHeaderGroup/GetOne', CmsModuleHeaderG.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            CmsModuleHeaderG.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/CmsModuleSaleHeaderGroup/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    CmsModuleHeaderG.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        CmsModuleHeaderG.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSaleHeaderGroup/edit', CmsModuleHeaderG.selectedItem, 'PUT').success(function (response) {
            CmsModuleHeaderG.addRequested = true;
            rashaErManage.checkAction(response);
            CmsModuleHeaderG.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                CmsModuleHeaderG.addRequested = false;
                CmsModuleHeaderG.replaceItem(CmsModuleHeaderG.selectedItem.Id, response.Item);
                CmsModuleHeaderG.gridOptions.fillData(CmsModuleHeaderG.ListItems);
                CmsModuleHeaderG.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            CmsModuleHeaderG.addRequested = false;
        });
    }


    CmsModuleHeaderG.closeModal = function () {
        $modalStack.dismissAll();
    };

    CmsModuleHeaderG.replaceItem = function (oldId, newItem) {
        angular.forEach(CmsModuleHeaderG.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = CmsModuleHeaderG.ListItems.indexOf(item);
                CmsModuleHeaderG.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            CmsModuleHeaderG.ListItems.unshift(newItem);
    }

    CmsModuleHeaderG.deleteRow = function () {
        if (!CmsModuleHeaderG.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                CmsModuleHeaderG.busyIndicator.isActive = true;
                console.log(CmsModuleHeaderG.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSaleHeaderGroup/GetOne', CmsModuleHeaderG.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    CmsModuleHeaderG.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSaleHeaderGroup/delete', CmsModuleHeaderG.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        CmsModuleHeaderG.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            CmsModuleHeaderG.replaceItem(CmsModuleHeaderG.selectedItemForDelete.Id);
                            CmsModuleHeaderG.gridOptions.fillData(CmsModuleHeaderG.ListItems);
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

    CmsModuleHeaderG.searchData = function () {
        CmsModuleHeaderG.gridOptions.serachData();
    }
    CmsModuleHeaderG.LinkUserGroupIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkUserGroupId',
        url: 'cmsusergroup',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: CmsModuleHeaderG,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'},
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: "string" }
            ]
        }
    }
 CmsModuleHeaderG.LinkCmsSiteCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCmsSiteCategoryId',
        url: 'cmsSiteCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: CmsModuleHeaderG,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'},
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: "string" }
            ]
        }
    }


    CmsModuleHeaderG.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'TitleML', displayName: 'عنوان', sortable: true, type: "string" },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: "string" },
            { name: 'virtual_UserGroup.Title', displayName: 'عنوان گروه کاربری', sortable: true, type: 'string', visible: true },
            { name: 'LinkUserGroupId', displayName: 'کد سیستمی  گروه کاربری', sortable: true, type: 'integer', visible: true },
            { name: 'virtual_SiteCategory.Title', displayName: 'عنوان دسته بندی سایت', sortable: true, type: 'string', visible: true },
            { name: 'LinkCmsSiteCategoryId', displayName: 'کد سیستمی دسته بندی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            
           

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    CmsModuleHeaderG.gridOptions.advancedSearchData = {};
    CmsModuleHeaderG.gridOptions.advancedSearchData.engine = {};
    CmsModuleHeaderG.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    CmsModuleHeaderG.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    CmsModuleHeaderG.gridOptions.advancedSearchData.engine.SortType = 1;
    CmsModuleHeaderG.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    CmsModuleHeaderG.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    CmsModuleHeaderG.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    CmsModuleHeaderG.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    CmsModuleHeaderG.gridOptions.advancedSearchData.engine.Filters = [];

    CmsModuleHeaderG.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            CmsModuleHeaderG.focusExpireLockAccount = true;
        });
    };

    CmsModuleHeaderG.gridOptions.reGetAll = function () {
        CmsModuleHeaderG.init();
    }

    CmsModuleHeaderG.columnCheckbox = false;
    CmsModuleHeaderG.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (CmsModuleHeaderG.gridOptions.columnCheckbox) {
            for (var i = 0; i < CmsModuleHeaderG.gridOptions.columns.length; i++) {
                //CmsModuleHeaderG.gridOptions.columns[i].visible = $("#" + CmsModuleHeaderG.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + CmsModuleHeaderG.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                CmsModuleHeaderG.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = CmsModuleHeaderG.gridOptions.columns;
            for (var i = 0; i < CmsModuleHeaderG.gridOptions.columns.length; i++) {
                CmsModuleHeaderG.gridOptions.columns[i].visible = true;
                var element = $("#" + CmsModuleHeaderG.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + CmsModuleHeaderG.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < CmsModuleHeaderG.gridOptions.columns.length; i++) {
            console.log(CmsModuleHeaderG.gridOptions.columns[i].name.concat(".visible: "), CmsModuleHeaderG.gridOptions.columns[i].visible);
        }
        CmsModuleHeaderG.gridOptions.columnCheckbox = !CmsModuleHeaderG.gridOptions.columnCheckbox;
    }
    //Export Report 
    CmsModuleHeaderG.exportFile = function () {
        CmsModuleHeaderG.addRequested = true;
        CmsModuleHeaderG.gridOptions.advancedSearchData.engine.ExportFile = CmsModuleHeaderG.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSaleHeaderGroup/exportfile', CmsModuleHeaderG.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            CmsModuleHeaderG.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                CmsModuleHeaderG.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //CmsModuleHeaderG.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    CmsModuleHeaderG.toggleExportForm = function () {
        CmsModuleHeaderG.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        CmsModuleHeaderG.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        CmsModuleHeaderG.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        CmsModuleHeaderG.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        CmsModuleHeaderG.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCore/CmsModuleSaleHeaderGroup/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    CmsModuleHeaderG.rowCountChanged = function () {
        if (!angular.isDefined(CmsModuleHeaderG.ExportFileClass.RowCount) || CmsModuleHeaderG.ExportFileClass.RowCount > 5000)
            CmsModuleHeaderG.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    CmsModuleHeaderG.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"CoreModuleSaleHeaderGroup/count", CmsModuleHeaderG.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            CmsModuleHeaderG.addRequested = false;
            rashaErManage.checkAction(response);
            CmsModuleHeaderG.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            CmsModuleHeaderG.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);