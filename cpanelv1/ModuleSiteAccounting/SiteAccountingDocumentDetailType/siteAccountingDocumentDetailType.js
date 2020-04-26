app.controller("siteAccountingDocumentDetailTypeController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var siteAccDocumentDetailType = this;
    siteAccDocumentDetailType.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }

    if (itemRecordStatus != undefined) siteAccDocumentDetailType.itemRecordStatus = itemRecordStatus;

    siteAccDocumentDetailType.init = function () {

        siteAccDocumentDetailType.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = siteAccDocumentDetailType.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }

        ajax.call(cmsServerConfig.configApiServerPath+"siteAccDocumentDetailType/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            siteAccDocumentDetailType.busyIndicator.isActive = false;
            siteAccDocumentDetailType.ListItems = response.ListItems;
            siteAccDocumentDetailType.gridOptions.fillData(siteAccDocumentDetailType.ListItems, response.resultAccess);
            siteAccDocumentDetailType.gridOptions.currentPageNumber = response.CurrentPageNumber;
            siteAccDocumentDetailType.gridOptions.totalRowCount = response.TotalRowCount;
            siteAccDocumentDetailType.gridOptions.rowPerPage = response.RowPerPage;
            siteAccDocumentDetailType.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            siteAccDocumentDetailType.busyIndicator.isActive = false;
            siteAccDocumentDetailType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //siteAccDocumentDetailType.busyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+'ServiceContent/getall', {}, 'POST').success(function (response) {
        //    siteAccDocumentDetailType.CommentList = response.ListItems;
        //    siteAccDocumentDetailType.busyIndicator.isActive = false;
        //});
    }
    siteAccDocumentDetailType.busyIndicator.isActive = true;
    siteAccDocumentDetailType.addRequested = false;
    siteAccDocumentDetailType.openAddModal = function () {
        siteAccDocumentDetailType.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'siteAccountingDocumentDetailType/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            siteAccDocumentDetailType.busyIndicator.isActive = false;
            siteAccDocumentDetailType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleService/SiteAccountingDocumentDetailType/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    siteAccDocumentDetailType.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        //if (!siteAccDocumentDetailType.selectedItem.LinkSiteIdSelector) {
        //    rashaErManage.showMessage("لطفا سایت را مشخص کنید");
        //    return;
        //}
        siteAccDocumentDetailType.busyIndicator.isActive = true;
        siteAccDocumentDetailType.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'serviceTag/add', siteAccDocumentDetailType.selectedItem, 'POST').success(function (response) {
            siteAccDocumentDetailType.addRequested = false;
            siteAccDocumentDetailType.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                siteAccDocumentDetailType.ListItems.unshift(response.Item);
                siteAccDocumentDetailType.gridOptions.fillData(siteAccDocumentDetailType.ListItems);
                siteAccDocumentDetailType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            siteAccDocumentDetailType.busyIndicator.isActive = false;
            siteAccDocumentDetailType.addRequested = false;
        });
    }


    siteAccDocumentDetailType.openEditModal = function () {

        siteAccDocumentDetailType.modalTitle = 'ویرایش';
        if (!siteAccDocumentDetailType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'serviceTag/GetOne', siteAccDocumentDetailType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            siteAccDocumentDetailType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleService/siteAccountingDocumentDetailType/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    siteAccDocumentDetailType.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        siteAccDocumentDetailType.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'serviceTag/edit', siteAccDocumentDetailType.selectedItem, 'PUT').success(function (response) {
            siteAccDocumentDetailType.addRequested = true;
            rashaErManage.checkAction(response);
            siteAccDocumentDetailType.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                siteAccDocumentDetailType.addRequested = false;
                siteAccDocumentDetailType.replaceItem(siteAccDocumentDetailType.selectedItem.Id, response.Item);
                siteAccDocumentDetailType.gridOptions.fillData(siteAccDocumentDetailType.ListItems);
                siteAccDocumentDetailType.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            siteAccDocumentDetailType.addRequested = false;
        });
    }


    siteAccDocumentDetailType.closeModal = function () {
        $modalStack.dismissAll();
    };

    siteAccDocumentDetailType.replaceItem = function (oldId, newItem) {
        angular.forEach(siteAccDocumentDetailType.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = siteAccDocumentDetailType.ListItems.indexOf(item);
                siteAccDocumentDetailType.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            siteAccDocumentDetailType.ListItems.unshift(newItem);
    }

    siteAccDocumentDetailType.deleteRow = function () {
        if (!siteAccDocumentDetailType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                siteAccDocumentDetailType.busyIndicator.isActive = true;
                console.log(siteAccDocumentDetailType.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'siteAccDocumentDetailType/GetOne', siteAccDocumentDetailType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    //rashaErManage.checkAction(response);
                    siteAccDocumentDetailType.selectedItemForDelete = response.Item;
                    console.log(siteAccDocumentDetailType.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'siteAccountingDocumentDetailType/delete', siteAccDocumentDetailType.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        siteAccDocumentDetailType.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            siteAccDocumentDetailType.replaceItem(siteAccDocumentDetailType.selectedItemForDelete.Id);
                            siteAccDocumentDetailType.gridOptions.fillData(siteAccDocumentDetailType.ListItems);
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

    siteAccDocumentDetailType.searchData = function () {
        siteAccDocumentDetailType.gridOptions.serachData();
    }

    siteAccDocumentDetailType.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer", visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد وب سایت', sortable: true, type: "link", visible: 'true', displayForce: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: "string", visible: 'true' },
            { name: 'CreatedDate', displayName: 'تاریخ ایجاد', sortable: true, isDate: true, type: "date", visible: 'true' },
            { name: 'CreatedBy', displayName: 'ایجاد توسط', sortable: true, type: "link", visible: 'true' },
            { name: 'UpdatedDate', displayName: 'تاریخ ویرایش', sortable: true, isDate: true, type: "date", visible: 'true' },
            { name: 'UpdatedBy', displayName: 'ویرایش توسط', sortable: true, type: "link", visible: 'true' },
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
                Filters: []
            }
        }
    }

    siteAccDocumentDetailType.gridOptions.reGetAll = function () {
        siteAccDocumentDetailType.init();
    }

    siteAccDocumentDetailType.columnCheckbox = false;
    siteAccDocumentDetailType.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (siteAccDocumentDetailType.gridOptions.columnCheckbox) {
            for (var i = 0; i < siteAccDocumentDetailType.gridOptions.columns.length; i++) {
                var element = $("#" + siteAccDocumentDetailType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                siteAccDocumentDetailType.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = siteAccDocumentDetailType.gridOptions.columns;
            for (var i = 0; i < siteAccDocumentDetailType.gridOptions.columns.length; i++) {
                siteAccDocumentDetailType.gridOptions.columns[i].visible = true;
                var element = $("#" + siteAccDocumentDetailType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + siteAccDocumentDetailType.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < siteAccDocumentDetailType.gridOptions.columns.length; i++) {
            console.log(siteAccDocumentDetailType.gridOptions.columns[i].name.concat(".visible: "), siteAccDocumentDetailType.gridOptions.columns[i].visible);
        }
        siteAccDocumentDetailType.gridOptions.columnCheckbox = !siteAccDocumentDetailType.gridOptions.columnCheckbox;
    }

}]);