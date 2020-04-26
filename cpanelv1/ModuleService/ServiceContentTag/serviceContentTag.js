app.controller("ServiceContentTagCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var ServiceContentTag = this;
    ServiceContentTag.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    ServiceContentTag.init = function () {
        ServiceContentTag.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ServiceContenttag/getall", ServiceContentTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            ServiceContentTag.busyIndicator.isActive = false;

            ServiceContentTag.ListItems = response.ListItems;
            ServiceContentTag.gridOptions.fillData(ServiceContentTag.ListItems , response.resultAccess);
            ServiceContentTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            ServiceContentTag.gridOptions.totalRowCount = response.TotalRowCount;
            ServiceContentTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            ServiceContentTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    ServiceContentTag.addRequested = false;
    ServiceContentTag.openAddModal = function () {
        ServiceContentTag.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'ServiceContenttag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            ServiceContentTag.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleService/ServicecontentTag/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    ServiceContentTag.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        ServiceContentTag.addRequested = true;
        ServiceContentTag.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+'ServiceContenttag/add', ServiceContentTag.selectedItem , 'POST').success(function (response) {
            ServiceContentTag.addRequested = false;
            ServiceContentTag.busyIndicator.isActive = false;

            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                ServiceContentTag.ListItems.unshift(response.Item);
                ServiceContentTag.gridOptions.fillData(ServiceContentTag.ListItems);
                ServiceContentTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            ServiceContentTag.busyIndicator.isActive = false;

            ServiceContentTag.addRequested = false;
        });
    }


    ServiceContentTag.openEditModal = function () {
        ServiceContentTag.modalTitle = 'ویرایش';
        if (!ServiceContentTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'ServiceContenttag/GetOne',  ServiceContentTag.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            ServiceContentTag.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleService/ServicecontentTag/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    ServiceContentTag.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        ServiceContentTag.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+'ServiceContenttag/edit',  ServiceContentTag.selectedItem , 'PUT').success(function (response) {
            ServiceContentTag.addRequested = true;
            rashaErManage.checkAction(response);
            ServiceContentTag.busyIndicator.isActive = false;

            if (response.IsSuccess) {
                ServiceContentTag.addRequested = false;
                ServiceContentTag.replaceItem(ServiceContentTag.selectedItem.Id, response.Item);
                ServiceContentTag.gridOptions.fillData(ServiceContentTag.ListItems);
                ServiceContentTag.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            ServiceContentTag.busyIndicator.isActive = false;

            ServiceContentTag.addRequested = false;
        });
    }


    ServiceContentTag.closeModal = function () {
        $modalStack.dismissAll();
    };

    ServiceContentTag.replaceItem = function (oldId, newItem) {
        angular.forEach(ServiceContentTag.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = ServiceContentTag.ListItems.indexOf(item);
                ServiceContentTag.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            ServiceContentTag.ListItems.unshift(newItem);
    }

    ServiceContentTag.deleteRow = function () {
        if (!ServiceContentTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                ServiceContentTag.busyIndicator.isActive = true;
                console.log(ServiceContentTag.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'ServiceContenttag/GetOne',  ServiceContentTag.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    ServiceContentTag.selectedItemForDelete = response.Item;
                    console.log(ServiceContentTag.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ServiceContenttag/delete',  ServiceContentTag.selectedItemForDelete , 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        ServiceContentTag.busyIndicator.isActive = false;

                        if (res.IsSuccess) {
                            ServiceContentTag.replaceItem(ServiceContentTag.selectedItemForDelete.Id);
                            ServiceContentTag.gridOptions.fillData(ServiceContentTag.ListItems);
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

    ServiceContentTag.searchData = function () {
        ServiceContentTag.gridOptions.serachData();
    }

    ServiceContentTag.LinkContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkContentId',
        url: 'ServiceContent',
        scope: ServiceContentTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }


    ServiceContentTag.LinkTagIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkTagId',
        url: 'ServiceTag',
        scope: ServiceContentTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    ServiceContentTag.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
           { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Content.Title', displayName: 'انتخاب محتوا', sortable: true ,displayForce:true},
            { name: 'Tag.Title', displayName: 'انتخاب تگ', sortable: true, displayForce: true },

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    ServiceContentTag.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            ServiceContentTag.focusExpireLockAccount = true;
        });
    };



    ServiceContentTag.gridOptions.reGetAll = function () {
        ServiceContentTag.init();
    }

}]);