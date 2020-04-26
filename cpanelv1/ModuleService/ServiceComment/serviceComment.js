app.controller("ServiceCommentCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var ServiceComment = this;
    ServiceComment.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    ServiceComment.ContentList = [];
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    ServiceComment.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "ServiceCommentCtrl") {
            localStorage.setItem('AddRequest', '');
            ServiceComment.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    ServiceComment.allowedSearch = [];
    if (itemRecordStatus != undefined) ServiceComment.itemRecordStatus = itemRecordStatus;
    ServiceComment.init = function () {
        ServiceComment.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = ServiceComment.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }

        ajax.call(cmsServerConfig.configApiServerPath+"ServiceComment/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            ServiceComment.busyIndicator.isActive = false;
            ServiceComment.ListItems = response.ListItems;
            ServiceComment.gridOptions.fillData(ServiceComment.ListItems , response.resultAccess);
            ServiceComment.gridOptions.currentPageNumber = response.CurrentPageNumber;
            ServiceComment.gridOptions.totalRowCount = response.TotalRowCount;
            ServiceComment.gridOptions.rowPerPage = response.RowPerPage;
            ServiceComment.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            ServiceComment.busyIndicator.isActive = false;
            ServiceComment.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //ServiceComment.busyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+'ServiceContent/getall', {}, 'POST').success(function (response) {
        //    ServiceComment.ContentList = response.ListItems;
        //    ServiceComment.busyIndicator.isActive = false;
        //});

        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        ServiceComment.checkRequestAddNewItemFromOtherControl(null);
    }
    ServiceComment.busyIndicator.isActive = true;
    ServiceComment.addRequested = false;
    ServiceComment.openAddModal = function () {
        ServiceComment.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'ServiceComment/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            ServiceComment.busyIndicator.isActive = false;
            ServiceComment.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleService/ServiceComment/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    ServiceComment.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        ServiceComment.busyIndicator.isActive = true;
        ServiceComment.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ServiceComment/add', ServiceComment.selectedItem, 'POST').success(function (response) {
            ServiceComment.addRequested = false;
            ServiceComment.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                ServiceComment.checkRequestAddNewItemFromOtherControl(response.Item.Id);

                ServiceComment.ListItems.unshift(response.Item);
                ServiceComment.gridOptions.fillData(ServiceComment.ListItems);
                ServiceComment.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            ServiceComment.busyIndicator.isActive = false;
            ServiceComment.addRequested = false;
        });
    }


    ServiceComment.openEditModal = function () {

        ServiceComment.modalTitle = 'ویرایش';
        if (!ServiceComment.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'ServiceComment/GetOne', ServiceComment.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            ServiceComment.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleService/ServiceComment/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    ServiceComment.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        ServiceComment.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ServiceComment/edit', ServiceComment.selectedItem, 'PUT').success(function (response) {
            ServiceComment.addRequested = true;
            rashaErManage.checkAction(response);
            ServiceComment.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                ServiceComment.addRequested = false;
                ServiceComment.replaceItem(ServiceComment.selectedItem.Id, response.Item);
                ServiceComment.gridOptions.fillData(ServiceComment.ListItems);
                ServiceComment.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            ServiceComment.addRequested = false;
        });
    }


    ServiceComment.closeModal = function () {
        $modalStack.dismissAll();
    };

    ServiceComment.replaceItem = function (oldId, newItem) {
        angular.forEach(ServiceComment.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = ServiceComment.ListItems.indexOf(item);
                ServiceComment.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            ServiceComment.ListItems.unshift(newItem);
    }

    ServiceComment.deleteRow = function () {
        if (!ServiceComment.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                ServiceComment.busyIndicator.isActive = true;
                console.log(ServiceComment.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'ServiceComment/GetOne', ServiceComment.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    //rashaErManage.checkAction(response);
                    ServiceComment.selectedItemForDelete = response.Item;
                    console.log(ServiceComment.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ServiceComment/delete', ServiceComment.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        ServiceComment.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            ServiceComment.replaceItem(ServiceComment.selectedItemForDelete.Id);
                            ServiceComment.gridOptions.fillData(ServiceComment.ListItems);
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

    ServiceComment.searchData = function () {
        ServiceComment.gridOptions.serachData();
    }

    ServiceComment.LinkServiceContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkServiceContentId',
        url: 'ServiceContent',
        scope: ServiceComment,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'},
                { name: 'RegisterDate', displayName: 'تاریخ ثبت', sortable: true, type: 'date'}
            ]
        }
    }

    ServiceComment.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Writer', displayName: 'نام نویسنده', sortable: true, type: "string" },
            { name: 'Comment', displayName: 'کامنت', sortable: true, type: "string" },
            { name: 'virtual_ServiceContent.Title', displayName: 'عنوان خدمات', sortable: true, type: 'string', visible: true },
            { name: 'LinkServiceContentId', displayName: 'کد سیستمی خدمات', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    ServiceComment.gridOptions.advancedSearchData = {};
    ServiceComment.gridOptions.advancedSearchData.engine = {};
    ServiceComment.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    ServiceComment.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    ServiceComment.gridOptions.advancedSearchData.engine.SortType = 1;
    ServiceComment.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    ServiceComment.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    ServiceComment.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    ServiceComment.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    ServiceComment.gridOptions.advancedSearchData.engine.Filters = [];

    ServiceComment.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            ServiceComment.focusExpireLockAccount = true;
        });
    };

    ServiceComment.gridOptions.reGetAll = function () {
        ServiceComment.init();
    }

    ServiceComment.columnCheckbox = false;
    ServiceComment.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (ServiceComment.gridOptions.columnCheckbox) {
            for (var i = 0; i < ServiceComment.gridOptions.columns.length; i++) {
                //ServiceComment.gridOptions.columns[i].visible = $("#" + ServiceComment.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + ServiceComment.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                ServiceComment.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = ServiceComment.gridOptions.columns;
            for (var i = 0; i < ServiceComment.gridOptions.columns.length; i++) {
                ServiceComment.gridOptions.columns[i].visible = true;
                var element = $("#" + ServiceComment.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + ServiceComment.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < ServiceComment.gridOptions.columns.length; i++) {
            console.log(ServiceComment.gridOptions.columns[i].name.concat(".visible: "), ServiceComment.gridOptions.columns[i].visible);
        }
        ServiceComment.gridOptions.columnCheckbox = !ServiceComment.gridOptions.columnCheckbox;
    }
}]);