app.controller("phoneBookZoneCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var phoneBookZone = this;
    phoneBookZone.init = function () {
        ajax.call(mainPathApi+"phoneBookZone/getall", phoneBookZone.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
          
            rashaErManage.checkAction(response);
            phoneBookZone.ListItems = response.ListItems;

          
            phoneBookZone.gridOptions.fillData(phoneBookZone.ListItems);
            phoneBookZone.gridOptions.currentPageNumber = response.CurrentPageNumber;
            phoneBookZone.gridOptions.totalRowCount = response.TotalRowCount;
            phoneBookZone.gridOptions.rowPerPage = response.RowPerPage;
         
        }).error(function (data, errCode, c, d) {
            phoneBookZone.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    /*add by ehsan shishehbor*/
    phoneBookZone.getStateByCountryId = function (countryId) {

        ajax.call(mainPathApi+"phoneBookState/getStateListByCountryId", { countryId: countryId }, 'POST').success(function (response) {
            phoneBookZone.stateList = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
            console.log(errCode);
            console.log(c);
            console.log(d);

        });
    };

    phoneBookZone.getCityByStateId = function (stateId) {

        ajax.call(mainPathApi+"phoneBookCity/getCityListByStateId", { stateId: stateId }, 'POST').success(function (response) {
            phoneBookZone.cityList = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
            console.log(errCode);
            console.log(c);
            console.log(d);

        });
    };

    phoneBookZone.addRequested = false;
    phoneBookZone.openAddModal = function () {
        phoneBookZone.modalTitle = 'اضافه';
        ajax.call(mainPathApi+'phoneBookZone/getviewmodel', "0", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            phoneBookZone.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModulePhoneBook/phoneBookZone/add.html',
                scope: $scope
            });
            ajax.call(mainPathApi+"phoneBookCountry/getall", {}, 'POST').success(function (response) {
                phoneBookZone.countryList = response.ListItems;
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
    phoneBookZone.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }

        phoneBookZone.addRequested = true;
        ajax.call(mainPathApi+'phoneBookZone/add',  phoneBookZone.selectedItem , 'POST').success(function (response) {
            phoneBookZone.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                phoneBookZone.ListItems.unshift(response.Item);
                phoneBookZone.gridOptions.fillData(phoneBookZone.ListItems);
                phoneBookZone.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            phoneBookZone.addRequested = false;
        });
    }


    phoneBookZone.openEditModal = function () {
        phoneBookZone.modalTitle = 'ویرایش';
        if (!phoneBookZone.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        ajax.call(mainPathApi+'phoneBookZone/getviewmodel', phoneBookZone.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            phoneBookZone.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModulePhoneBook/phoneBookZone/edit.html',
                scope: $scope
            });
            ajax.call(mainPathApi+"phoneBookCountry/getall", {}, 'POST').success(function (response) {
                phoneBookZone.countryList = response.ListItems;
            }).error(function (data, errCode, c, d) {
                console.log(data);
                console.log(errCode);
                console.log(c);
                console.log(d);

            });
            phoneBookZone.getStateByCountryId(response.Item.LinkPhoneBookCountryId);
            phoneBookZone.getCityByStateId(response.Item.LinkPhoneBookStateId);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    phoneBookZone.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(mainPathApi+'phoneBookZone/edit',  phoneBookZone.selectedItem , 'PUT').success(function (response) {
            phoneBookZone.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                phoneBookZone.addRequested = false;
                phoneBookZone.replaceItem(phoneBookZone.selectedItem.Id, response.Item);
                phoneBookZone.gridOptions.fillData(phoneBookZone.ListItems);
                phoneBookZone.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            phoneBookZone.addRequested = false;
        });
    }
    

   
    phoneBookZone.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(mainPathApi+'phoneBookZone/edit',  phoneBookZone.selectedItem , 'PUT').success(function (response) {
            phoneBookZone.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                phoneBookZone.addRequested = false;
                phoneBookZone.treeConfig.currentNode.Name = response.Item.Name;
                phoneBookZone.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            phoneBookZone.addRequested = false;
        });
    }

    phoneBookZone.closeModal = function () {
        $modalStack.dismissAll();
    };

    phoneBookZone.replaceItem = function (oldId, newItem) {
        angular.forEach(phoneBookZone.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = phoneBookZone.ListItems.indexOf(item);
                phoneBookZone.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            phoneBookZone.ListItems.unshift(newItem);
    }

    phoneBookZone.deleteRow = function () {
        if (!phoneBookZone.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                //console.log(phoneBookZone.gridOptions.selectedRow.item);
                ajax.call(mainPathApi+'phoneBookZone/getviewmodel',  phoneBookZone.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    phoneBookZone.selectedItemForDelete = response.Item;
                  //  console.log(phoneBookZone.selectedItemForDelete);
                    ajax.call(mainPathApi+'phoneBookZone/delete', phoneBookZone.selectedItemForDelete , 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            phoneBookZone.replaceItem(phoneBookZone.selectedItemForDelete.Id);
                            phoneBookZone.gridOptions.fillData(phoneBookZone.ListItems);
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

    phoneBookZone.searchData = function () {
        phoneBookZone.gridOptions.serachData();
    }

   

    phoneBookZone.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type:'integer' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' },
            { name: 'PhoneBookCity.Title', displayName: 'شهر', sortable: true, type: 'link' },
            { name: 'PhoneBookCity.PhoneBookState.Title', displayName: 'استان', sortable: true, type: 'link' }

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    phoneBookZone.gridOptions.advancedSearchData = {};
    phoneBookZone.gridOptions.advancedSearchData.engine = {};
    phoneBookZone.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    phoneBookZone.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    phoneBookZone.gridOptions.advancedSearchData.engine.SortType = 1;
    phoneBookZone.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    phoneBookZone.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    phoneBookZone.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    phoneBookZone.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    phoneBookZone.gridOptions.advancedSearchData.engine.Filters = [];

    phoneBookZone.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            phoneBookZone.focusExpireLockAccount = true;
        });
    };



    phoneBookZone.gridOptions.reGetAll = function () {
        phoneBookZone.init();
    }

}]);