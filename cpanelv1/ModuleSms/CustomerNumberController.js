app.controller("customerNumberCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$rootScope', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $rootScope, $state, $filter) {
    var customerNumber  = this;
    var date = moment().format();
    customerNumber.endDate = {
        defaultDate: date
    }
    customerNumber.endDate2 = {
        defaultDate: date
    }
    customerNumber.endDate3 = {
        defaultDate: date
    }

    customerNumber.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"CustomerNumber/getall", customerNumber.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            customerNumber.ListItems = response.ListItems;
            customerNumber.gridOptions.fillData(customerNumber.ListItems);
            //customerNumber.gridOptions.currentPageNumber = response.CurrentPageNumber;
            customerNumber.gridOptions.totalRowCount = response.TotalRowCount;
            customerNumber.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    customerNumber.addNewModel = function () {
        customerNumber.addRequested = false;
        customerNumber.modalTitle = "ایجاد کمپانی جدید";
        ajax.call(cmsServerConfig.configApiServerPath+'CustomerNumber/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            customerNumber.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleSms/CustomerNumber/add.html',
                scope: $scope
            });

        }).error(function (data) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    customerNumber.editOpenModel = function () {
        customerNumber.modalTitle = "ویرایش کمپانی";
        if (!customerNumber.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'CustomerNumber/GetOne', customerNumber.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            customerNumber.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleSms/CustomerNumber/edit.html',
                scope: $scope
            });

        }).error(function (data) {
            rashaErManage.checkAction(data, errCode);
        });
    }


    customerNumber.editRow = function () {
        customerNumber.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CustomerNumber/edit', customerNumber.selectedItem, 'PUT').success(function (response) {
            customerNumber.addRequested = false;
            rashaErManage.checkAction(response);
            customerNumber.closeModal();
            customerNumber.init();
        }).error(function (data) {
            rashaErManage.checkAction(data, errCode);
            customerNumber.addRequested = false;
        });
    };
    customerNumber.addNewRow = function () {
        ajax.call(cmsServerConfig.configApiServerPath+'CustomerNumber/add', customerNumber.selectedItem, 'POST').success(function (response) {
            customerNumber.addRequested = false;
            customerNumber.closeModal();
            customerNumber.init();
            rashaErManage.checkAction(response);
        }).error(function (data) {
            rashaErManage.checkAction(data, errCode);
            customerNumber.addRequested = false;
        });
    };



    customerNumber.deleteRow = function () {
        var node = customerNumber.gridOptions.selectedRow.item;
        if (!node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                // console.log(node.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'CustomerNumber/GetOne', node.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    customerNumber.selectedItemForDelete = response.Item;
                    console.log(customerNumber.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'CustomerNumber/delete', customerNumber.selectedItemForDelete, 'POST').success(function (res) {
                        console.log(res);
                        if (res.IsSuccess) {
                            console.log("Deleted Succesfully !");
                            customerNumber.init();
                        }

                    }).error(function (data2) {
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data) {
                    rashaErManage.checkAction(data, errCode);
                });

            }
        });
    }


    customerNumber.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد', sortable: true },
            { name: 'Status', displayName: 'وضعیت', sortable: true , isCheckBox : true},
            { name: 'FirstSubmit', displayName: 'تاریخ تایید', sortable: true },
            { name: 'UsanceDate', displayName: 'تاریخ سررسید', sortable: true },
            { name: 'ExpireDate', displayName: 'تاریخ انقضا', sortable: true },
            { name: 'SaleStatus', displayName: 'وضعیت فروش', sortable: true, isCheckBox: true }

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    customerNumber.closeModal = function () {
        $modalStack.dismissAll();
    };

}]);