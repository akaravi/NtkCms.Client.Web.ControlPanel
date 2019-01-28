app.controller("phoneBookCountryCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var phoneBookCountry = this;
    phoneBookCountry.loadingBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }

    if (itemRecordStatus != undefined) phoneBookCountry.itemRecordStatus = itemRecordStatus;

    phoneBookCountry.init = function () {
        var engine = {};
        try {
            engine = phoneBookCountry.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }

        ajax.call(mainPathApi+"phoneBookCountry/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            phoneBookCountry.ListItems = response.ListItems;
            phoneBookCountry.gridOptions.fillData(phoneBookCountry.ListItems);
            phoneBookCountry.gridOptions.currentPageNumber = response.CurrentPageNumber;
            phoneBookCountry.gridOptions.totalRowCount = response.TotalRowCount;
            phoneBookCountry.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            phoneBookCountry.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }



    phoneBookCountry.addRequested = false;
    phoneBookCountry.openAddModal = function () {
        phoneBookCountry.modalTitle = 'اضافه';
        ajax.call(mainPathApi+'phoneBookCountry/getviewmodel', "0", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            phoneBookCountry.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModulePhoneBook/phoneBookCountry/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            phoneBookCountry.addRequested = false;
            console.log(data);
            rashaErManage.checkAction(data, errCode);
        });
    };
    phoneBookCountry.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }

        phoneBookCountry.addRequested = true;
        ajax.call(mainPathApi+'phoneBookCountry/add', phoneBookCountry.selectedItem, 'POST').success(function (response) {
            phoneBookCountry.addRequested = false;
            rashaErManage.checkAction(response);

            if (response.IsSuccess) {
                phoneBookCountry.ListItems.unshift(response.Item);
                phoneBookCountry.gridOptions.fillData(phoneBookCountry.ListItems);
                phoneBookCountry.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            console.log(data);
            rashaErManage.checkAction(data, errCode);
            phoneBookCountry.addRequested = false;
        });
    }


    phoneBookCountry.openEditModal = function () {
        phoneBookCountry.modalTitle = 'ویرایش';
        if (!phoneBookCountry.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        ajax.call(mainPathApi+'phoneBookCountry/getviewmodel', phoneBookCountry.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            phoneBookCountry.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModulePhoneBook/phoneBookCountry/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            console.log(data);
            rashaErManage.checkAction(data, errCode);
        });
    }
    phoneBookCountry.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        phoneBookCountry.addRequested = true;
        ajax.call(mainPathApi+'phoneBookCountry/edit', phoneBookCountry.selectedItem, 'PUT').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                phoneBookCountry.addRequested = false;
                phoneBookCountry.replaceItem(phoneBookCountry.selectedItem.Id, response.Item);
                phoneBookCountry.gridOptions.fillData(phoneBookCountry.ListItems);
                phoneBookCountry.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            console.log(data);
            rashaErManage.checkAction(data, errCode);
            phoneBookCountry.addRequested = false;
        });
    }



    phoneBookCountry.closeModal = function () {
        $modalStack.dismissAll();
    };

    phoneBookCountry.replaceItem = function (oldId, newItem) {
        angular.forEach(phoneBookCountry.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = phoneBookCountry.ListItems.indexOf(item);
                phoneBookCountry.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            phoneBookCountry.ListItems.unshift(newItem);
    }

    phoneBookCountry.deleteRow = function () {
        if (!phoneBookCountry.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                ajax.call(mainPathApi+'phoneBookCountry/getviewmodel', phoneBookCountry.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    phoneBookCountry.selectedItemForDelete = response.Item;
                    ajax.call(mainPathApi+'phoneBookCountry/delete', phoneBookCountry.selectedItemForDelete, 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            phoneBookCountry.replaceItem(phoneBookCountry.selectedItemForDelete.Id);
                            phoneBookCountry.gridOptions.fillData(phoneBookCountry.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        //console.log(data);
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    // console.log(data);
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });


    }

    phoneBookCountry.searchData = function () {
        phoneBookCountry.gridOptions.serachData();
    }


    phoneBookCountry.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'Title', displayName: 'نام', sortable: true, type: 'string' },
            { name: 'Code', displayName: 'کد', sortable: true, type: 'integer' },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    phoneBookCountry.gridOptions.advancedSearchData = {};
    phoneBookCountry.gridOptions.advancedSearchData.engine = {};
    phoneBookCountry.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    phoneBookCountry.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    phoneBookCountry.gridOptions.advancedSearchData.engine.SortType = 1;
    phoneBookCountry.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    phoneBookCountry.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    phoneBookCountry.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    phoneBookCountry.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    phoneBookCountry.gridOptions.advancedSearchData.engine.Filters = [];


    phoneBookCountry.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            phoneBookCountry.focusExpireLockAccount = true;
        });
    };



    phoneBookCountry.gridOptions.reGetAll = function () {
        phoneBookCountry.init();
    }

}]);