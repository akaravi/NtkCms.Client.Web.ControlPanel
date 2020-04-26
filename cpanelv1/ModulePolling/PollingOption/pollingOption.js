app.controller("pollingOptionCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var pollingOption = this;
    pollingOption.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }

    pollingOption.allowedSearch = [];

    pollingOption.init = function () {
        pollingOption.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = pollingOption.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }

        ajax.call(cmsServerConfig.configApiServerPath+"pollingOption/getall", '', 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            pollingOption.busyIndicator.isActive = false;
            pollingOption.ListItems = response.ListItems;
            pollingOption.gridOptions.fillData(pollingOption.ListItems);
            pollingOption.gridOptions.currentPageNumber = response.CurrentPageNumber;
            pollingOption.gridOptions.totalRowCount = response.TotalRowCount;
            pollingOption.gridOptions.rowPerPage = response.RowPerPage;
            pollingOption.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            pollingOption.busyIndicator.isActive = false;
            pollingOption.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    pollingOption.busyIndicator.isActive = true;
    pollingOption.addRequested = false;
    pollingOption.OptionList = [{ Option: "test1"}, {Option: "test2"}, { Option: "test3"}];
    pollingOption.openAddModal = function () {
        pollingOption.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'pollingOption/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            pollingOption.busyIndicator.isActive = false;
            pollingOption.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModulePolling/pollingOption/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    pollingOption.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (!pollingOption.selectedItem.LinkpollingContentId) {
            rashaErManage.showMessage("لطفا نظرسنجی را مشخص کنید");
            return;
        }
        pollingOption.busyIndicator.isActive = true;
        pollingOption.addRequested = true;

        $.each(pollingOption.OptionList, function (index, option) {

            //ajax.call(cmsServerConfig.configApiServerPath+'pollingOption/add', pollingOption.selectedItem, 'POST').success(function (response) {
            ajax.call(cmsServerConfig.configApiServerPath+'pollingOption/add', option, 'POST').success(function (response) {
                pollingOption.addRequested = false;
                pollingOption.busyIndicator.isActive = false;
                rashaErManage.checkAction(response);
                if (response.IsSuccess) {
                    pollingOption.ListItems.unshift(response.Item);
                    pollingOption.gridOptions.fillData(pollingOption.ListItems);
                    pollingOption.closeModal();
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                pollingOption.busyIndicator.isActive = false;
                pollingOption.addRequested = false;
            });
        });
    }


    pollingOption.openEditModal = function () {

        pollingOption.modalTitle = 'ویرایش';
        if (!pollingOption.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'pollingOption/GetOne', pollingOption.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            pollingOption.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModulePolling/pollingOption/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    pollingOption.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        pollingOption.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'pollingOption/edit', pollingOption.selectedItem, 'PUT').success(function (response) {
            pollingOption.addRequested = true;
            rashaErManage.checkAction(response);
            pollingOption.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                pollingOption.addRequested = false;
                pollingOption.replaceItem(pollingOption.selectedItem.Id, response.Item);
                pollingOption.gridOptions.fillData(pollingOption.ListItems);
                pollingOption.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            pollingOption.addRequested = false;
        });
    }


    pollingOption.closeModal = function () {
        $modalStack.dismissAll();
    };

    pollingOption.replaceItem = function (oldId, newItem) {
        angular.forEach(pollingOption.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = pollingOption.ListItems.indexOf(item);
                pollingOption.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            pollingOption.ListItems.unshift(newItem);
    }

    pollingOption.deleteRow = function () {
        if (!pollingOption.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                pollingOption.busyIndicator.isActive = true;
                console.log(pollingOption.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'pollingOption/GetOne', pollingOption.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    //rashaErManage.checkAction(response);
                    pollingOption.selectedItemForDelete = response.Item;
                    console.log(pollingOption.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'pollingOption/delete', pollingOption.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        pollingOption.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            pollingOption.replaceItem(pollingOption.selectedItemForDelete.Id);
                            pollingOption.gridOptions.fillData(pollingOption.ListItems);
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

    pollingOption.searchData = function () {
        pollingOption.gridOptions.serachData();
    }

    pollingOption.LinkpollingContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkpollingContentId',
        url: 'pollingContent',
        scope: pollingOption,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: "string" },
                { name: 'RegisterDate', displayName: 'تاریخ ثبت', sortable: true, type: "date"}
            ]
        }
    }

    pollingOption.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Writer', displayName: 'نام نویسنده', sortable: true, type: "string" },
            { name: 'Option', displayName: 'گزینه', sortable: true, type: "string" },
            { name: 'IsGlobalUser', displayName: 'آیا این کاربر سراسری است؟', sortable: true, isCheckBox: true, type: "boolean" },
            { name: 'IsActivated', displayName: 'آیا فعال است؟', sortable: true, isCheckBox: true, type: "boolean" },
            { name: 'RegisterDate', displayName: 'تاریخ ثبت', sortable: true, isDate: true, type: "date" },
            { name: 'pollingContent.Title', displayName: 'انتخاب محتوا', sortable: true, type: "link" }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    pollingOption.gridOptions.advancedSearchData = {};
    pollingOption.gridOptions.advancedSearchData.engine = {};
    pollingOption.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    pollingOption.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    pollingOption.gridOptions.advancedSearchData.engine.SortType = 1;
    pollingOption.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    pollingOption.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    pollingOption.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    pollingOption.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    pollingOption.gridOptions.advancedSearchData.engine.Filters = [];

    pollingOption.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            pollingOption.focusExpireLockAccount = true;
        });
    };

    pollingOption.gridOptions.reGetAll = function () {
        pollingOption.init();
    }

    pollingOption.openGridConfigModal = function () {
        pollingOption.modalTitle = 'تنظیمات نمایش';
        $modal.open({
            templateUrl: 'cpanelv1/ModulePolling/pollingOption/gridConfig.html',
            scope: $scope
        });
    }
}]);