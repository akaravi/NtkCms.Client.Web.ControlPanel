app.controller("sessionGridController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var sessionCtrl = this;;

    sessionCtrl.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    sessionCtrl.init = function () {
        sessionCtrl.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = sessionCtrl.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"universalmenusession/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            sessionCtrl.busyIndicator.isActive = false;
            sessionCtrl.ListItems = response.ListItems;
            sessionCtrl.gridOptions.fillData(sessionCtrl.ListItems,response.resultAccess);
            sessionCtrl.gridOptions.currentPgeNumber = response.CurrentPageNumber;
            sessionCtrl.gridOptions.totalRowCount = response.TotalRowCount;
            sessionCtrl.gridOptions.rowPerPage = response.RowPerPage;
            sessionCtrl.gridOptions.maxSize = 5;
            sessionCtrl.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            sessionCtrl.busyIndicator.isActive = false;
            sessionCtrl.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //sessionCtrl.busyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+'biographyContent/getall', {}, 'POST').success(function (response) {
        //    sessionCtrl.CommentList = response.ListItems;
        //    sessionCtrl.busyIndicator.isActive = false;
        //});
        //**********************************************************************************


    }
    //Open Add Modal
    sessionCtrl.busyIndicator.isActive = true;
    sessionCtrl.addRequested = false;
    sessionCtrl.openAddModal = function () {
        sessionCtrl.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'universalmenusession/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            sessionCtrl.busyIndicator.isActive = false;
            sessionCtrl.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleUniversalMenu/Session/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    sessionCtrl.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        sessionCtrl.busyIndicator.isActive = true;
        sessionCtrl.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'universalmenusession/add', sessionCtrl.selectedItem, 'POST').success(function (response) {
            sessionCtrl.addRequested = false;
            sessionCtrl.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                sessionCtrl.ListItems.unshift(response.Item);
                sessionCtrl.gridOptions.fillData(sessionCtrl.ListItems);
                sessionCtrl.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            sessionCtrl.busyIndicator.isActive = false;
            sessionCtrl.addRequested = false;
        });
    }


    sessionCtrl.openEditModal = function () {

        sessionCtrl.modalTitle = 'ویرایش';
        if (!sessionCtrl.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'universalmenusession/GetOne', sessionCtrl.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            sessionCtrl.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleUniversalMenu/Session/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    sessionCtrl.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        sessionCtrl.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'universalmenusession/edit', sessionCtrl.selectedItem, 'PUT').success(function (response) {
            sessionCtrl.addRequested = true;
            rashaErManage.checkAction(response);
            sessionCtrl.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                sessionCtrl.addRequested = false;
                //response.Item.TypeDescription = null;
                //var n = sessionCtrl.sessionTypeArray.length;
                //for (var i = 0; i < n; i++) {
                //    if (sessionCtrl.sessionTypeArray[i].Value == response.Item.Type) {
                //        response.Item.TypeDescription = sessionCtrl.sessionTypeArray[i].Description;
                //    }
                //}
                sessionCtrl.replaceItem(sessionCtrl.selectedItem.Id, response.Item);

                sessionCtrl.gridOptions.fillData(sessionCtrl.ListItems);
                sessionCtrl.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            sessionCtrl.addRequested = false;
        });
    }

    sessionCtrl.closeModal = function () {
        $modalStack.dismissAll();
    };

    sessionCtrl.replaceItem = function (oldId, newItem) {
        angular.forEach(sessionCtrl.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = sessionCtrl.ListItems.indexOf(item);
                sessionCtrl.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            sessionCtrl.ListItems.unshift(newItem);
    }

    sessionCtrl.deleteRow = function () {
        if (!sessionCtrl.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                sessionCtrl.busyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath+'universalmenusession/GetOne', sessionCtrl.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    sessionCtrl.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'universalmenusession/delete', sessionCtrl.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        sessionCtrl.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            sessionCtrl.replaceItem(sessionCtrl.selectedItemForDelete.Id);
                            sessionCtrl.gridOptions.fillData(sessionCtrl.ListItems);
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

    sessionCtrl.searchData = function () {
        sessionCtrl.gridOptions.searchData();

    }

    sessionCtrl.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'UserId', displayName: 'شماره کاربری', sortable: true, type: 'integer' },
            { name: 'LastResponse', displayName: 'LastResponse', sortable: true, type: 'string' },
            { name: 'LinkMenuItemId', displayName: 'LinkMenuItemId', sortable: true, type: 'string' },
            { name: 'LinkProcessesId', displayName: 'LinkProcessesId ', sortable: true, type: 'string' },
            { name: 'LastResponseDateTime', displayName: 'LastResponseDateTime', sortable: true, type: 'date' },
            { name: 'Processes.Title', displayName: 'پلتفرم', sortable: true, type: 'string', displayForce:true},
            { name: 'MenuItem.DisplayText', displayName: 'منو', sortable: true, type: 'string', displayForce: true },
            //{ name: 'RegisterDate', displayName: 'تاریخ ثبت', sortable: true, isDate: true, type: 'date' },
            //{ name: 'BiographyContent.Title', displayName: 'انتخاب محتوا', sortable: true, type: 'link' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        },
        startDate: moment().format()
    }

    sessionCtrl.gridOptions.advancedSearchData = {};
    sessionCtrl.gridOptions.advancedSearchData.engine = {};
    sessionCtrl.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    sessionCtrl.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    sessionCtrl.gridOptions.advancedSearchData.engine.SortType = 0;
    sessionCtrl.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    sessionCtrl.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    sessionCtrl.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    sessionCtrl.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    sessionCtrl.gridOptions.advancedSearchData.engine.Filters = [];

    sessionCtrl.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            sessionCtrl.focusExpireLockAccount = true;
        });
    };

    sessionCtrl.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            sessionCtrl.focus = true;
        });
    };

    sessionCtrl.gridOptions.reGetAll = function () {
        sessionCtrl.init();
    }

    sessionCtrl.columnCheckbox = false;
    sessionCtrl.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = sessionCtrl.gridOptions.columns;
        if (sessionCtrl.gridOptions.columnCheckbox) {
            for (var i = 0; i < sessionCtrl.gridOptions.columns.length; i++) {
                var element = $("#" + sessionCtrl.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                sessionCtrl.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < sessionCtrl.gridOptions.columns.length; i++) {
                var element = $("#" + sessionCtrl.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + sessionCtrl.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < sessionCtrl.gridOptions.columns.length; i++) {
            sessionCtrl.gridOptions.columns[i].name.concat(".visible: ");
            sessionCtrl.gridOptions.columns[i].visible;
        }
        sessionCtrl.gridOptions.columnCheckbox = !sessionCtrl.gridOptions.columnCheckbox;
    }
}]);

