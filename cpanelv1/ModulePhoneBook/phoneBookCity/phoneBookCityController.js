app.controller("phoneBookCityCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var phoneBookCity = this;

    if (itemRecordStatus != undefined) phoneBookCity.itemRecordStatus = itemRecordStatus;

    phoneBookCity.init = function () {
        ajax.call(mainPathApi+"phoneBookCity/getall", phoneBookCity.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {

            rashaErManage.checkAction(response);
            phoneBookCity.ListItems = response.ListItems;


            phoneBookCity.gridOptions.fillData(phoneBookCity.ListItems);
            phoneBookCity.gridOptions.currentPageNumber = response.CurrentPageNumber;
            phoneBookCity.gridOptions.totalRowCount = response.TotalRowCount;
            phoneBookCity.gridOptions.rowPerPage = response.RowPerPage;

        }).error(function (data, errCode, c, d) {
            phoneBookCity.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }


    /*add by ehsan shishehbor*/
    phoneBookCity.getStateByCountryId = function (countryId) {

        ajax.call(mainPathApi+"phoneBookState/getStateListByCountryId", { countryId: countryId }, 'GET').success(function (response) {
            phoneBookCity.stateList = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
            console.log(errCode);
            console.log(c);
            console.log(d);

        });
    };

    phoneBookCity.addRequested = false;
    phoneBookCity.openAddModal = function () {
        phoneBookCity.modalTitle = 'اضافه';
        ajax.call(mainPathApi+'phoneBookCity/getviewmodel', "0", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            $modal.open({
                templateUrl: 'cpanelv1/ModulePhoneBook/phoneBookCity/add.html',
                scope: $scope
            });
            ajax.call(mainPathApi+"phoneBookCountry/getall", {}, 'POST').success(function (response) {
                phoneBookCity.countryList = response.ListItems;
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
    phoneBookCity.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }

        phoneBookCity.addRequested = true;
        ajax.call(mainPathApi+'phoneBookCity/add', phoneBookCity.selectedItem, 'POST').success(function (response) {
            phoneBookCity.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                phoneBookCity.ListItems.unshift(response.Item);
                phoneBookCity.gridOptions.fillData(phoneBookCity.ListItems);
                phoneBookCity.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            phoneBookCity.addRequested = false;
        });
    }


    phoneBookCity.openEditModal = function () {
        phoneBookCity.modalTitle = 'ویرایش';
        if (!phoneBookCity.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        ajax.call(mainPathApi+'phoneBookCity/getviewmodel', phoneBookCity.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            phoneBookCity.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModulePhoneBook/phoneBookCity/edit.html',
                scope: $scope
            });
            ajax.call(mainPathApi+"phoneBookCountry/getall", {}, 'POST').success(function (response) {
                phoneBookCity.countryList = response.ListItems;
            }).error(function (data, errCode, c, d) {
                console.log(data);
                console.log(errCode);
                console.log(c);
                console.log(d);

            });
            phoneBookCity.getStateByCountryId(response.Item.LinkPhoneBookCountryId);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    phoneBookCity.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(mainPathApi+'phoneBookCity/edit', phoneBookCity.selectedItem, 'PUT').success(function (response) {
            phoneBookCity.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                phoneBookCity.addRequested = false;
                phoneBookCity.replaceItem(phoneBookCity.selectedItem.Id, response.Item);
                phoneBookCity.gridOptions.fillData(phoneBookCity.ListItems);
                phoneBookCity.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            phoneBookCity.addRequested = false;
        });
    }



    phoneBookCity.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(mainPathApi+'phoneBookCity/edit', phoneBookCity.selectedItem, 'PUT').success(function (response) {
            phoneBookCity.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                phoneBookCity.addRequested = false;
                phoneBookCity.treeConfig.currentNode.Name = response.Item.Name;
                phoneBookCity.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            phoneBookCity.addRequested = false;
        });
    }






    phoneBookCity.closeModal = function () {
        $modalStack.dismissAll();
    };

    phoneBookCity.replaceItem = function (oldId, newItem) {
        angular.forEach(phoneBookCity.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = phoneBookCity.ListItems.indexOf(item);
                phoneBookCity.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            phoneBookCity.ListItems.unshift(newItem);
    }

    phoneBookCity.deleteRow = function () {
        if (!phoneBookCity.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                // console.log(phoneBookCity.gridOptions.selectedRow.item);
                ajax.call(mainPathApi+'phoneBookCity/getviewmodel', phoneBookCity.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    phoneBookCity.selectedItemForDelete = response.Item;
                    //console.log(phoneBookCity.selectedItemForDelete);
                    ajax.call(mainPathApi+'phoneBookCity/delete', phoneBookCity.selectedItemForDelete, 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            phoneBookCity.replaceItem(phoneBookCity.selectedItemForDelete.Id);
                            phoneBookCity.gridOptions.fillData(phoneBookCity.ListItems);
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

    phoneBookCity.searchData = function () {
        phoneBookCity.gridOptions.serachData();
    }


    phoneBookCity.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true,  type: 'integer' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'CityCode', displayName: 'کد شهر', sortable: true, type: 'integer' },
            { name: 'PhoneBookState.Title', displayName: 'استان', sortable: true, type: 'link' },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    phoneBookCity.gridOptions.advancedSearchData = {};
    phoneBookCity.gridOptions.advancedSearchData.engine = {};
    phoneBookCity.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    phoneBookCity.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    phoneBookCity.gridOptions.advancedSearchData.engine.SortType = 1;
    phoneBookCity.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    phoneBookCity.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    phoneBookCity.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    phoneBookCity.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    phoneBookCity.gridOptions.advancedSearchData.engine.Filters = [];

    phoneBookCity.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            phoneBookCity.focusExpireLockAccount = true;
        });
    };



    phoneBookCity.gridOptions.reGetAll = function () {
        phoneBookCity.init();
    }

}]);