app.controller("phoneBookStateCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var phoneBookState = this;

    if (itemRecordStatus != undefined) phoneBookState.itemRecordStatus = itemRecordStatus;

    phoneBookState.init = function () {
        ajax.call(mainPathApi+"phoneBookState/getall", phoneBookState.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {

            rashaErManage.checkAction(response);
            phoneBookState.ListItems = response.ListItems;


            phoneBookState.gridOptions.fillData(phoneBookState.ListItems);
            phoneBookState.gridOptions.currentPageNumber = response.CurrentPageNumber;
            phoneBookState.gridOptions.totalRowCount = response.TotalRowCount;
            phoneBookState.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            phoneBookState.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }



    phoneBookState.addRequested = false;
    phoneBookState.openAddModal = function () {
        phoneBookState.modalTitle = 'اضافه';
        ajax.call(mainPathApi+'phoneBookState/getviewmodel', "0", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            phoneBookState.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModulePhoneBook/phoneBookState/add.html',
                scope: $scope
            });

            ajax.call(mainPathApi+"phoneBookCountry/getall", {}, 'POST').success(function (response) {
                phoneBookState.countryList = response.ListItems;
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

    phoneBookState.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }

        phoneBookState.addRequested = true;
        ajax.call(mainPathApi+'phoneBookState/add', phoneBookState.selectedItem, 'POST').success(function (response) {
            phoneBookState.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                phoneBookState.ListItems.unshift(response.Item);
                phoneBookState.gridOptions.fillData(phoneBookState.ListItems);
                phoneBookState.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            phoneBookState.addRequested = false;
        });
    }


    phoneBookState.openEditModal = function () {
        phoneBookState.modalTitle = 'ویرایش';
        if (!phoneBookState.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        ajax.call(mainPathApi+'phoneBookState/getviewmodel', phoneBookState.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            phoneBookState.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModulePhoneBook/phoneBookState/edit.html',
                scope: $scope
            });

            ajax.call(mainPathApi+"phoneBookCountry/getall", {}, 'POST').success(function (response) {
                phoneBookState.countryList = response.ListItems;
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
    phoneBookState.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(mainPathApi+'phoneBookState/edit', phoneBookState.selectedItem, 'PUT').success(function (response) {
            phoneBookState.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                phoneBookState.addRequested = false;
                phoneBookState.replaceItem(phoneBookState.selectedItem.Id, response.Item);
                phoneBookState.gridOptions.fillData(phoneBookState.ListItems);
                phoneBookState.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            phoneBookState.addRequested = false;
        });
    }



    phoneBookState.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(mainPathApi+'phoneBookState/edit', phoneBookState.selectedItem, 'PUT').success(function (response) {
            phoneBookState.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                phoneBookState.addRequested = false;
                phoneBookState.treeConfig.currentNode.Name = response.Item.Name;
                phoneBookState.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            phoneBookState.addRequested = false;
        });
    }






    phoneBookState.closeModal = function () {
        $modalStack.dismissAll();
    };

    phoneBookState.replaceItem = function (oldId, newItem) {
        angular.forEach(phoneBookState.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = phoneBookState.ListItems.indexOf(item);
                phoneBookState.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            phoneBookState.ListItems.unshift(newItem);
    }

    phoneBookState.deleteRow = function () {
        if (!phoneBookState.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(phoneBookState.gridOptions.selectedRow.item);
                ajax.call(mainPathApi+'phoneBookState/getviewmodel', phoneBookState.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    phoneBookState.selectedItemForDelete = response.Item;
                    //  console.log(phoneBookState.selectedItemForDelete);
                    ajax.call(mainPathApi+'phoneBookState/delete', phoneBookState.selectedItemForDelete, 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            phoneBookState.replaceItem(phoneBookState.selectedItemForDelete.Id);
                            phoneBookState.gridOptions.fillData(phoneBookState.ListItems);
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

    phoneBookState.searchData = function () {
        phoneBookState.gridOptions.serachData();
    }



    phoneBookState.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'PhoneBookCountry.Title', displayName: 'کشور', sortable: true, type: 'link' },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    phoneBookState.gridOptions.advancedSearchData = {};
    phoneBookState.gridOptions.advancedSearchData.engine = {};
    phoneBookState.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    phoneBookState.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    phoneBookState.gridOptions.advancedSearchData.engine.SortType = 1;
    phoneBookState.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    phoneBookState.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    phoneBookState.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    phoneBookState.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    phoneBookState.gridOptions.advancedSearchData.engine.Filters = [];

    phoneBookState.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            phoneBookState.focusExpireLockAccount = true;
        });
    };



    phoneBookState.gridOptions.reGetAll = function () {
        phoneBookState.init();
    }

}]);