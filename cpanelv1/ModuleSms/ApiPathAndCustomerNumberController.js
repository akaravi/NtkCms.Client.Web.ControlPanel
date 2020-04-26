app.controller("apiPathCustomerCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$rootScope', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $rootScope, $state, $filter) {
    var apiPathCustomer = this;


    apiPathCustomer.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ApiPathAndCustomerNumber/getall", apiPathCustomer.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            apiPathCustomer.ListItems = response.ListItems;
            apiPathCustomer.gridOptions.fillData(apiPathCustomer.ListItems);
            apiPathCustomer.gridOptions.currentPageNumber = response.CurrentPageNumber;
            apiPathCustomer.gridOptions.totalRowCount = response.TotalRowCount;
            apiPathCustomer.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });


    };
    apiPathCustomer.addNewModel = function () {
        apiPathCustomer.addRequested = false;
        apiPathCustomer.modalTitle = "ایجاد لینک مشتری به مسیر جدید";
        ajax.call(cmsServerConfig.configApiServerPath+'ApiPathAndCustomerNumber/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            apiPathCustomer.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleSms/ApiPathAndCustomerNumber/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    apiPathCustomer.editOpenModel = function () {
        apiPathCustomer.modalTitle = "ویرایش کمپانی";
        if (!apiPathCustomer.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'ApiPathAndCustomerNumber/GetOne', apiPathCustomer.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            apiPathCustomer.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleSms/ApiPathAndCustomerNumber/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }


    apiPathCustomer.editRow = function () {
        apiPathCustomer.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiPathAndCustomerNumber/edit', apiPathCustomer.selectedItem, 'PUT').success(function (response) {
            apiPathCustomer.addRequested = false;
            rashaErManage.checkAction(response);
            apiPathCustomer.closeModal();
            apiPathCustomer.init();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            apiPathCustomer.addRequested = false;
        });
    };
    apiPathCustomer.addNewRow = function () {
        ajax.call(cmsServerConfig.configApiServerPath+'ApiPathAndCustomerNumber/add', apiPathCustomer.selectedItem, 'POST').success(function (response) {
            apiPathCustomer.addRequested = false;
            apiPathCustomer.closeModal();
            apiPathCustomer.init();
            rashaErManage.checkAction(response);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            apiPathCustomer.addRequested = false;
        });
    };



    apiPathCustomer.deleteRow = function () {
        var node = apiPathCustomer.gridOptions.selectedRow.item;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage("لطفا یک ردیف را جهت حذف انتخاب کنید .");
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                // console.log(node.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'ApiPathAndCustomerNumber/GetOne', node.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    apiPathCustomer.selectedItemForDelete = response.Item;
                    console.log(apiPathCustomer.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ApiPathAndCustomerNumber/delete', apiPathCustomer.selectedItemForDelete, 'POST').success(function (res) {
                        console.log(res);
                        if (res.IsSuccess) {
                            console.log("Deleted Succesfully !");
                            apiPathCustomer.init();
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


    apiPathCustomer.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد', sortable: true },
            { name: 'Title', displayName: 'عنوان کمپانی', sortable: true },
            { name: 'ServiceAvailableCredit', displayName: 'مقدار اعتبار موجود', sortable: true },
            { name: 'ServiceSumCredit', displayName: 'کل اعتبار ارسال شده', sortable: true },
            { name: 'UserSumCredit', displayName: 'مجموع اعتبار ارسال شده', sortable: true }

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    apiPathCustomer.closeModal = function () {
        $modalStack.dismissAll();
    };




}]);