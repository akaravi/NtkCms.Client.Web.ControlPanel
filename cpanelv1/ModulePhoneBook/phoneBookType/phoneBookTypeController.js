app.controller("phoneBookTypeCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var phoneBookType = this;
    if (itemRecordStatus != undefined) phoneBookType.itemRecordStatus = itemRecordStatus;
    phoneBookType.init = function () {
        alert('sdsad');
        ajax.call(mainPathApi+"phoneBookType/getall", phoneBookType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {

            rashaErManage.checkAction(response);
            phoneBookType.ListItems = response.ListItems;


            phoneBookType.gridOptions.fillData(phoneBookType.ListItems);
            phoneBookType.gridOptions.currentPageNumber = response.CurrentPageNumber;
            phoneBookType.gridOptions.totalRowCount = response.TotalRowCount;
            phoneBookType.gridOptions.rowPerPage = response.RowPerPage;

        }).error(function (data, errCode, c, d) {
            phoneBookType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }



    phoneBookType.addRequested = false;
    phoneBookType.openAddModal = function () {
        phoneBookType.modalTitle = 'اضافه';
        ajax.call(mainPathApi+'phoneBookType/getviewmodel', "0", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            phoneBookType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModulePhoneBook/phoneBookType/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    phoneBookType.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }

        phoneBookType.addRequested = true;
        ajax.call(mainPathApi+'phoneBookType/add', phoneBookType.selectedItem, 'POST').success(function (response) {
            phoneBookType.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                phoneBookType.ListItems.unshift(response.Item);
                phoneBookType.gridOptions.fillData(phoneBookType.ListItems);
                phoneBookType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            phoneBookType.addRequested = false;
        });
    }


    phoneBookType.openEditModal = function () {
        phoneBookType.modalTitle = 'ویرایش';
        if (!phoneBookType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        ajax.call(mainPathApi+'phoneBookType/getviewmodel', phoneBookType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            phoneBookType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModulePhoneBook/phoneBookType/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    phoneBookType.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(mainPathApi+'phoneBookType/edit', phoneBookType.selectedItem, 'PUT').success(function (response) {
            phoneBookType.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                phoneBookType.addRequested = false;
                phoneBookType.replaceItem(phoneBookType.selectedItem.Id, response.Item);
                phoneBookType.gridOptions.fillData(phoneBookType.ListItems);
                phoneBookType.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            phoneBookType.addRequested = false;
        });
    }



    phoneBookType.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(mainPathApi+'phoneBookType/edit', phoneBookType.selectedItem, 'PUT').success(function (response) {
            phoneBookType.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                phoneBookType.addRequested = false;
                phoneBookType.treeConfig.currentNode.Name = response.Item.Name;
                phoneBookType.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            phoneBookType.addRequested = false;
        });
    }






    phoneBookType.closeModal = function () {
        $modalStack.dismissAll();
    };

    phoneBookType.replaceItem = function (oldId, newItem) {
        angular.forEach(phoneBookType.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = phoneBookType.ListItems.indexOf(item);
                phoneBookType.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            phoneBookType.ListItems.unshift(newItem);
    }

    phoneBookType.deleteRow = function () {
        if (!phoneBookType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
              //  console.log(phoneBookType.gridOptions.selectedRow.item);
                ajax.call(mainPathApi+'phoneBookType/getviewmodel', phoneBookType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    phoneBookType.selectedItemForDelete = response.Item;
                   // console.log(phoneBookType.selectedItemForDelete);
                    ajax.call(mainPathApi+'phoneBookType/delete', phoneBookType.selectedItemForDelete, 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            phoneBookType.replaceItem(phoneBookType.selectedItemForDelete.Id);
                            phoneBookType.gridOptions.fillData(phoneBookType.ListItems);
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

    phoneBookType.searchData = function () {
        phoneBookType.gridOptions.serachData();
    }


    phoneBookType.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
           ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    phoneBookType.gridOptions.advancedSearchData = {};
    phoneBookType.gridOptions.advancedSearchData.engine = {};
    phoneBookType.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    phoneBookType.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    phoneBookType.gridOptions.advancedSearchData.engine.SortType = 1;
    phoneBookType.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    phoneBookType.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    phoneBookType.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    phoneBookType.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    phoneBookType.gridOptions.advancedSearchData.engine.Filters = [];

    phoneBookType.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            phoneBookType.focusExpireLockAccount = true;
        });
    };



    phoneBookType.gridOptions.reGetAll = function () {
        phoneBookType.init();
    }

}]);