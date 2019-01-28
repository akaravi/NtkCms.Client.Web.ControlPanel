app.controller("apiPathCompanyCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$rootScope', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $rootScope, $state, $filter) {
    var apiCompany = this;

    apiCompany.init = function () {
        ajax.call(mainPathApi+"ApiPathCompany/getall", apiCompany.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            apiCompany.ListItems = response.ListItems;
            apiCompany.gridOptions.fillData(apiCompany.ListItems);
            apiCompany.gridOptions.currentPageNumber = response.CurrentPageNumber;
            apiCompany.gridOptions.totalRowCount = response.TotalRowCount;
            apiCompany.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    apiCompany.addNewModel = function(){
        apiCompany.addRequested = false;
        apiCompany.modalTitle = "ایجاد کمپانی جدید";
        ajax.call(mainPathApi+'ApiPathCompany/getviewmodel',  0 , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            apiCompany.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleSms/ApiPathCompany/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    apiCompany.editOpenModel = function() {
        apiCompany.modalTitle = "ویرایش کمپانی";
        if (!apiCompany.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        ajax.call(mainPathApi+'apiPathCompany/getviewmodel', apiCompany.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            apiCompany.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleSms/ApiPathCompany/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }


    apiCompany.editRow = function () {
        apiCompany.addRequested = true;
        ajax.call(mainPathApi+'apiPathCompany/edit',  apiCompany.selectedItem , 'PUT').success(function (response) {
            apiCompany.addRequested = false;
            rashaErManage.checkAction(response);
            apiCompany.closeModal();
            apiCompany.init();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            apiCompany.addRequested = false;
        });
    }; 
    apiCompany.addNewRow = function () {
        ajax.call(mainPathApi+'apiPathCompany/add', apiCompany.selectedItem , 'POST').success(function (response) {
            apiCompany.addRequested = false;
            apiCompany.closeModal();
            apiCompany.init();
            rashaErManage.checkAction(response);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            apiCompany.addRequested = false;
        });
    };

    

    apiCompany.deleteRow = function() {
        var node = apiCompany.gridOptions.selectedRow.item;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Category_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function(isConfirmed) {
            if (isConfirmed) {
                // console.log(node.gridOptions.selectedRow.item);
                ajax.call(mainPathApi+'apiPathCompany/getviewmodel', node.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    apiCompany.selectedItemForDelete = response.Item;
                    console.log(apiCompany.selectedItemForDelete);
                    ajax.call(mainPathApi+'apiPathCompany/delete', apiCompany.selectedItemForDelete, 'DELETE').success(function (res) {
                        console.log(res);
                        if (res.IsSuccess) {
                            console.log("Deleted Succesfully !");
                            apiCompany.init();
                        }

                    }).error(function(data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                    });
                }).error(function(data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });

            }
        });
    }


    apiCompany.gridOptions = {
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

    apiCompany.closeModal = function () {
        $modalStack.dismissAll();
    };

}]);