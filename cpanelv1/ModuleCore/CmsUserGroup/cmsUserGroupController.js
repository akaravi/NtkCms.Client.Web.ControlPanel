app.controller("cmsUserGroupGridCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var cmsUserGroupgrd = this;
    cmsUserGroupgrd.UserAccessControllerTypes = [];
    if (itemRecordStatus != undefined) cmsUserGroupgrd.itemRecordStatus = itemRecordStatus;
    cmsUserGroupgrd.init = function () {

        var engine = {};
        try {
            engine = cmsUserGroupgrd.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }

        // Get UserAccessControllerTypes Enum
        ajax.call(mainPathApi+"cmsUserGroup/getenum", engine, 'POST').success(function (response1) {
            cmsUserGroupgrd.UserAccessControllerTypes = response1;

            // Get ListItems to fillData
            ajax.call(mainPathApi+"cmsUserGroup/getall", engine, 'POST').success(function (response2) {
                cmsUserGroupgrd.ListItems = response2.ListItems;
                if (cmsUserGroupgrd.ListItems != undefined && cmsUserGroupgrd.ListItems != null) {
                    cmsUserGroupgrd.setUserTypeTitleDescriptioninGrid();
                    cmsUserGroupgrd.gridOptions.fillData(cmsUserGroupgrd.ListItems, response2.resultAccess);
                    cmsUserGroupgrd.gridOptions.currentPageNumber = response2.CurrentPageNumber;
                    cmsUserGroupgrd.gridOptions.totalRowCount = response2.TotalRowCount;
                    cmsUserGroupgrd.gridOptions.rowPerPage = response2.RowPerPage;
                    cmsUserGroupgrd.gridOptions.maxSize = 5;
                }
            }).error(function (data, errCode, c, d) {
                cmsUserGroupgrd.gridOptions.fillData();
                rashaErManage.checkAction(data, errCode);
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    cmsUserGroupgrd.addRequested = false;
    cmsUserGroupgrd.openAddModal = function () {
        cmsUserGroupgrd.modalTitle = 'اضافه';
        ajax.call(mainPathApi+'cmsUserGroup/getviewmodel', '0', 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsUserGroupgrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsUserGroup/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsUserGroupgrd.addNewRow = function (frm) {
        if (frm.$invalid)
            return;

        cmsUserGroupgrd.addRequested = true;
        ajax.call(mainPathApi+'cmsUserGroup/add', cmsUserGroupgrd.selectedItem, 'POST').success(function (response) {
            cmsUserGroupgrd.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsUserGroupgrd.ListItems.unshift(response.Item);
                cmsUserGroupgrd.setUserTypeTitleDescriptioninGrid();
                cmsUserGroupgrd.gridOptions.fillData(cmsUserGroupgrd.ListItems);
                cmsUserGroupgrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsUserGroupgrd.addRequested = false;
        });
    }


    cmsUserGroupgrd.openEditModal = function () {
        cmsUserGroupgrd.modalTitle = 'ویرایش';
        if (!cmsUserGroupgrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        ajax.call(mainPathApi+'cmsUserGroup/getviewmodel', cmsUserGroupgrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsUserGroupgrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsUserGroup/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsUserGroupgrd.editRow = function (frm) {
        if (frm.$invalid)
            return;

        ajax.call(mainPathApi+'cmsUserGroup/edit', cmsUserGroupgrd.selectedItem, 'PUT').success(function (response) {
            cmsUserGroupgrd.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsUserGroupgrd.addRequested = false;
                cmsUserGroupgrd.replaceItem(cmsUserGroupgrd.selectedItem.Id, response.Item);
                if (cmsUserGroupgrd.ListItems != undefined && cmsUserGroupgrd.ListItems != null) cmsUserGroupgrd.setUserTypeTitleDescriptioninGrid();
                cmsUserGroupgrd.gridOptions.fillData(cmsUserGroupgrd.ListItems);
                cmsUserGroupgrd.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsUserGroupgrd.addRequested = false;
        });
    }


    cmsUserGroupgrd.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsUserGroupgrd.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsUserGroupgrd.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsUserGroupgrd.ListItems.indexOf(item);
                cmsUserGroupgrd.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsUserGroupgrd.ListItems.unshift(newItem);
    }

    cmsUserGroupgrd.deleteRow = function () {
        if (!cmsUserGroupgrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(cmsUserGroupgrd.gridOptions.selectedRow.item);
                ajax.call(mainPathApi+'cmsUserGroup/getviewmodel', cmsUserGroupgrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsUserGroupgrd.selectedItemForDelete = response.Item;
                    console.log(cmsUserGroupgrd.selectedItemForDelete);
                    ajax.call(mainPathApi+'cmsUserGroup/delete', cmsUserGroupgrd.selectedItemForDelete, 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsUserGroupgrd.replaceItem(cmsUserGroupgrd.selectedItemForDelete.Id);
                            cmsUserGroupgrd.gridOptions.fillData(cmsUserGroupgrd.ListItems);
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

    cmsUserGroupgrd.searchData = function () {
        cmsUserGroupgrd.gridOptions.serachData();
    }

    cmsUserGroupgrd.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'TitleML', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' },
            { name: 'UserTypeTitle', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'UserTypeDescription', displayName: 'توضیحات', sortable: true, type: 'string' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    cmsUserGroupgrd.gridOptions.advancedSearchData = {};
    cmsUserGroupgrd.gridOptions.advancedSearchData.engine = {};
    cmsUserGroupgrd.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    cmsUserGroupgrd.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    cmsUserGroupgrd.gridOptions.advancedSearchData.engine.SortType = 1;
    cmsUserGroupgrd.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    cmsUserGroupgrd.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    cmsUserGroupgrd.gridOptions.advancedSearchData.engine.RowPerPage = 50;
    cmsUserGroupgrd.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    cmsUserGroupgrd.gridOptions.advancedSearchData.engine.Filters = [];

    cmsUserGroupgrd.gridOptions.reGetAll = function () {
        cmsUserGroupgrd.init();
    }

    cmsUserGroupgrd.gridOptions.onRowSelected = function () { }

    cmsUserGroupgrd.setUserTypeTitleDescriptioninGrid = function () {

        for (var i = 0; i < cmsUserGroupgrd.ListItems.length; i++) {
            for (var j = 0; j < cmsUserGroupgrd.UserAccessControllerTypes.length; j++) {
                if (cmsUserGroupgrd.ListItems[i].UserType == cmsUserGroupgrd.UserAccessControllerTypes[j].Value) {
                    cmsUserGroupgrd.ListItems[i].UserTypeTitle = cmsUserGroupgrd.UserAccessControllerTypes[j].Key;
                    cmsUserGroupgrd.ListItems[i].UserTypeDescription = cmsUserGroupgrd.UserAccessControllerTypes[j].Description;
                }
            }
        }
    }
    //Export Report 
    cmsUserGroupgrd.exportFile = function () {
        cmsUserGroupgrd.addRequested = true;
        cmsUserGroupgrd.gridOptions.advancedSearchData.engine.ExportFile = cmsUserGroupgrd.ExportFileClass;
        ajax.call(mainPathApi+'cmsUserGroup/exportfile', cmsUserGroupgrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            cmsUserGroupgrd.addRequested = false;
            rashaErManage.checkAction(response);
            cmsUserGroupgrd.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //cmsUserGroupgrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    cmsUserGroupgrd.toggleExportForm = function () {
        cmsUserGroupgrd.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        cmsUserGroupgrd.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        cmsUserGroupgrd.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        cmsUserGroupgrd.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCore/CmsUserGroup/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    cmsUserGroupgrd.rowCountChanged = function () {
        if (!angular.isDefined(cmsUserGroupgrd.ExportFileClass.RowCount) || cmsUserGroupgrd.ExportFileClass.RowCount > 5000)
            cmsUserGroupgrd.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    cmsUserGroupgrd.getCount = function () {
        ajax.call(mainPathApi+"cmsUserGroup/count", cmsUserGroupgrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            cmsUserGroupgrd.addRequested = false;
            rashaErManage.checkAction(response);
            cmsUserGroupgrd.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            cmsUserGroupgrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);