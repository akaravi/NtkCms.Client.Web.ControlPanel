app.controller("domainAliasController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$builder', '$rootScope', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $builder, $rootScope, $window, $filter) {

    var domainAlias = this;

    //#formBuilder: define array for values
    domainAlias.defaultValue = [];

    if (itemRecordStatus != undefined) domainAlias.itemRecordStatus = itemRecordStatus;

    domainAlias.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    domainAlias.filePickerFavIcon = {
        isActive: true,
        backElement: 'filePickerFavIcon',
        filename: null,
        fileId: null,
        multiSelect: false,
    }

    var date = moment().format();

    domainAlias.init = function () {
        domainAlias.addRequested = true;
        domainAlias.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"CoreSiteDomainAlias/getall", domainAlias.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            domainAlias.ListItems = response.ListItems;
            domainAlias.TotalRowCount = response.TotalRowCount;
            domainAlias.gridOptions.fillData(domainAlias.ListItems, response.resultAccess);
            domainAlias.busyIndicator.isActive = false;
            domainAlias.addRequested = false;
            domainAlias.gridOptions.currentPageNumber = response.CurrentPageNumber;
            domainAlias.gridOptions.totalRowCount = response.TotalRowCount;
            domainAlias.gridOptions.rowPerPage = response.RowPerPage;
            domainAlias.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            domainAlias.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            domainAlias.busyIndicator.isActive = false;
        });
    }

    // Open Add New Content Modal
    domainAlias.addRequested = false;

    domainAlias.openAddModal = function () {
        domainAlias.modalTitle = 'اضافه';
        domainAlias.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreSiteDomainAlias/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            domainAlias.selectedItem = response.Item;
            domainAlias.addRequested = false;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/CmsDomainAlias/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    domainAlias.addNewRow = function (frm) {
        if (frm.$invalid)
            return;
        domainAlias.busyIndicator.isActive = true;
        domainAlias.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreSiteDomainAlias/add', domainAlias.selectedItem, 'POST').success(function (response) {
            domainAlias.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                domainAlias.ListItems.unshift(response.Item);
                domainAlias.busyIndicator.isActive = false;
                domainAlias.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            domainAlias.addRequested = false;
        });
    }

    // Open Edit Content Modal
    domainAlias.openEditModal = function () {
        domainAlias.modalTitle = 'ویرایش';
        if (!domainAlias.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'CoreSiteDomainAlias/GetOne', domainAlias.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            domainAlias.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/CmsDomainAlias/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    domainAlias.editRow = function (frm) {
        if (frm.$invalid)
            return;
        domainAlias.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreSiteDomainAlias/edit', domainAlias.selectedItem, 'PUT').success(function (response) {
            domainAlias.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                domainAlias.addRequested = false;
                domainAlias.replaceItem(domainAlias.selectedItem.Id, response.Item);
                domainAlias.busyIndicator.isActive = false;
                domainAlias.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            domainAlias.addRequested = false;
            domainAlias.busyIndicator.isActive = false;
        });
    }

    domainAlias.closeModal = function () {
        $modalStack.dismissAll();
    };

    domainAlias.replaceItem = function (oldId, newItem) {
        angular.forEach(domainAlias.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = domainAlias.ListItems.indexOf(item);
                domainAlias.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            domainAlias.ListItems.unshift(newItem);
    }

    domainAlias.deleteRow = function () {
        if (!domainAlias.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                ajax.call(cmsServerConfig.configApiServerPath+'CoreSiteDomainAlias/GetOne', domainAlias.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    domainAlias.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreSiteDomainAlias/delete', domainAlias.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            domainAlias.replaceItem(domainAlias.selectedItemForDelete.Id);
                            domainAlias.gridOptions.fillData(domainAlias.ListItems);
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

    domainAlias.searchData = function () {
        domainAlias.gridOptions.serachData();
    }

    domainAlias.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'SubDomain', displayName: 'زیردامنه', sortable: true, type: 'string' },
            { name: 'Domain', displayName: 'دامنه', sortable: true, type: 'string' },
            { name: 'LinkCmsSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'string' }
            //{ name: 'virtual_CmsSite.Title', displayName: 'عنوان سایت', sortable: true, type: 'string', displayForce: true }
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
                RowPerPage: 200,
                ContentFullSearch: null,
                Filters: [],
                Count: false
            }
        }
    }

    domainAlias.gridOptions.onRowSelected = function () { }

    domainAlias.gridOptions.reGetAll = function () {
        domainAlias.init();
    }

    //Export Report 
    domainAlias.exportFile = function () {
        domainAlias.addRequested = true;
        domainAlias.gridOptions.advancedSearchData.engine.ExportFile = domainAlias.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreSiteDomainAlias/exportfile', domainAlias.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                domainAlias.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //domainAlias.closeModal();
            }
            domainAlias.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    domainAlias.toggleExportForm = function () {
        domainAlias.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        domainAlias.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        domainAlias.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        domainAlias.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        domainAlias.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCore/CmsDomainAlias/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    domainAlias.rowCountChanged = function () {
        if (!angular.isDefined(domainAlias.ExportFileClass.RowCount) || domainAlias.ExportFileClass.RowCount > 5000)
            domainAlias.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    domainAlias.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"CoreSiteDomainAlias/count", domainAlias.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            domainAlias.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            domainAlias.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);