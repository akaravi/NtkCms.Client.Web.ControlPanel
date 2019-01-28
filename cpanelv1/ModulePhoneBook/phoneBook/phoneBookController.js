app.controller("phoneBookCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var phoneBook = this;
    if (itemRecordStatus != undefined) phoneBook.itemRecordStatus = itemRecordStatus;
    phoneBook.init = function () {
        //ajax.call(mainPathApi+"phoneBook/getall", phoneBook.gridOptions.advancedSearchData, 'GET').success(function (response) {

        //    rashaErManage.checkAction(response);
        //    phoneBook.ListItems = response.ListItems;


        //    phoneBook.gridOptions.fillData(phoneBook.ListItems);
        //    phoneBook.gridOptions.currentPageNumber = response.CurrentPageNumber;
        //    phoneBook.gridOptions.totalRowCount = response.TotalRowCount;
        //    phoneBook.gridOptions.rowPerPage = response.RowPerPage;

        //}).error(function (data, errCode, c, d) {
        //    phoneBook.gridOptions.fillData();
        //    rashaErManage.checkAction(data, errCode);
        //});
    }



    phoneBook.addRequested = false;
    phoneBook.openAddModal = function () {
        phoneBook.modalTitle = 'اضافه';
        ajax.call(mainPathApi+'phoneBook/getviewmodel', "0", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            phoneBook.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModulePhoneBook/phoneBook/add.html',
                scope: $scope
            });
            ajax.call(mainPathApi+"phoneBookType/getall", {}, 'POST').success(function (response) {
                phoneBook.typeList = response.ListItems;
            }).error(function (data, errCode, c, d) {
                console.log(data);
                console.log(errCode);
                console.log(c);
                console.log(d);

            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    phoneBook.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }

        phoneBook.addRequested = true;
        ajax.call(mainPathApi+'phoneBook/add', phoneBook.selectedItem, 'POST').success(function (response) {
            phoneBook.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                phoneBook.ListItems.unshift(response.Item);
                phoneBook.gridOptions.fillData(phoneBook.ListItems);
                phoneBook.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            phoneBook.addRequested = false;
        });
    }


    phoneBook.openEditModal = function () {
        phoneBook.modalTitle = 'ویرایش';
        if (!phoneBook.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        ajax.call(mainPathApi+'phoneBook/getviewmodel', phoneBook.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            phoneBook.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModulePhoneBook/phoneBook/edit.html',
                scope: $scope
            });
            ajax.call(mainPathApi+"phoneBookType/getall", {}, 'POST').success(function (response) {
                phoneBook.typeList = response.ListItems;
            }).error(function (data, errCode, c, d) {
                console.log(data);
                console.log(errCode);
                console.log(c);
                console.log(d);

            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    phoneBook.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(mainPathApi+'phoneBook/edit', phoneBook.selectedItem, 'PUT').success(function (response) {
            phoneBook.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                phoneBook.addRequested = false;
                phoneBook.replaceItem(phoneBook.selectedItem.Id, response.Item);
                phoneBook.gridOptions.fillData(phoneBook.ListItems);
                phoneBook.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            phoneBook.addRequested = false;
        });
    }



    phoneBook.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(mainPathApi+'phoneBook/edit', phoneBook.selectedItem, 'PUT').success(function (response) {
            phoneBook.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                phoneBook.addRequested = false;
                phoneBook.treeConfig.currentNode.Name = response.Item.Name;
                phoneBook.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            phoneBook.addRequested = false;
        });
    }






    phoneBook.closeModal = function () {
        $modalStack.dismissAll();
    };

    phoneBook.replaceItem = function (oldId, newItem) {
        angular.forEach(phoneBook.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = phoneBook.ListItems.indexOf(item);
                phoneBook.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            phoneBook.ListItems.unshift(newItem);
    }

    phoneBook.deleteRow = function () {
        if (!phoneBook.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(phoneBook.gridOptions.selectedRow.item);
                ajax.call(mainPathApi+'phoneBook/getviewmodel', phoneBook.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    phoneBook.selectedItemForDelete = response.Item;
                    console.log(phoneBook.selectedItemForDelete);
                    ajax.call(mainPathApi+'phoneBook/delete', phoneBook.selectedItemForDelete, 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            phoneBook.replaceItem(phoneBook.selectedItemForDelete.Id);
                            phoneBook.gridOptions.fillData(phoneBook.ListItems);
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

    phoneBook.searchData = function () {
        phoneBook.gridOptions.serachData();
    }



    phoneBook.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
            { name: 'Title', displayName: 'عنوان', sortable: true },
            { name: 'PhoneBookType.Title', displayName: 'نوع', sortable: true },
            { name: 'IsActivated', displayName: 'وضعیت فعالیت', sortable: true },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    phoneBook.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            phoneBook.focusExpireLockAccount = true;
        });
    };



    phoneBook.gridOptions.reGetAll = function () {
        phoneBook.init();
    }

}]);