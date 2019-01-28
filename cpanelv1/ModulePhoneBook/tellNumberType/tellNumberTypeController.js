app.controller("tellNumberTypeCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var tellNumberType = this;

    tellNumberType.init = function () {
        alert("saas");
        ajax.call(mainPathApi+"tellNumberType/getall", tellNumberType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {          
            rashaErManage.checkAction(response);
            tellNumberType.ListItems = response.ListItems;        
            tellNumberType.gridOptions.fillData(tellNumberType.ListItems);
            tellNumberType.gridOptions.currentPageNumber = response.CurrentPageNumber;
            tellNumberType.gridOptions.totalRowCount = response.TotalRowCount;
            tellNumberType.gridOptions.rowPerPage = response.RowPerPage;    
        }).error(function (data, errCode, c, d) {
            tellNumberType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    tellNumberType.addRequested = false;
    tellNumberType.openAddModal = function () {
        tellNumberType.modalTitle = 'اضافه';
        ajax.call(mainPathApi+'tellNumberType/getviewmodel', "0", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            tellNumberType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModulePhoneBook/tellNumberType/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    tellNumberType.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }

        tellNumberType.addRequested = true;
        ajax.call(mainPathApi+'tellNumberType/add',  tellNumberType.selectedItem , 'POST').success(function (response) {
            tellNumberType.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                tellNumberType.ListItems.unshift(response.Item);
                tellNumberType.gridOptions.fillData(tellNumberType.ListItems);
                tellNumberType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            tellNumberType.addRequested = false;
        });
    }


    tellNumberType.openEditModal = function () {
        tellNumberType.modalTitle = 'ویرایش';
        if (!tellNumberType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        ajax.call(mainPathApi+'tellNumberType/getviewmodel',  tellNumberType.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            tellNumberType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModulePhoneBook/tellNumberType/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    tellNumberType.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(mainPathApi+'tellNumberType/edit',  tellNumberType.selectedItem , 'PUT').success(function (response) {
            tellNumberType.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                tellNumberType.addRequested = false;
                tellNumberType.replaceItem(tellNumberType.selectedItem.Id, response.Item);
                tellNumberType.gridOptions.fillData(tellNumberType.ListItems);
                tellNumberType.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            tellNumberType.addRequested = false;
        });
    }
    

   
    tellNumberType.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(mainPathApi+'tellNumberType/edit',  tellNumberType.selectedItem , 'PUT').success(function (response) {
            tellNumberType.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                tellNumberType.addRequested = false;
                tellNumberType.treeConfig.currentNode.Name = response.Item.Name;
                tellNumberType.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            tellNumberType.addRequested = false;
        });
    }






    tellNumberType.closeModal = function () {
        $modalStack.dismissAll();
    };

    tellNumberType.replaceItem = function (oldId, newItem) {
        angular.forEach(tellNumberType.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = tellNumberType.ListItems.indexOf(item);
                tellNumberType.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            tellNumberType.ListItems.unshift(newItem);
    }

    tellNumberType.deleteRow = function () {
        if (!tellNumberType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(tellNumberType.gridOptions.selectedRow.item);
                ajax.call(mainPathApi+'tellNumberType/getviewmodel',tellNumberType.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    tellNumberType.selectedItemForDelete = response.Item;
                    console.log(tellNumberType.selectedItemForDelete);
                    ajax.call(mainPathApi+'tellNumberType/delete',  tellNumberType.selectedItemForDelete , 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            tellNumberType.replaceItem(tellNumberType.selectedItemForDelete.Id);
                            tellNumberType.gridOptions.fillData(tellNumberType.ListItems);
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

    tellNumberType.searchData = function () {
        tellNumberType.gridOptions.serachData();
    }

    tellNumberType.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
            { name: 'Title', displayName: 'عنوان', sortable: true },
            { name: 'CanSendSms', displayName: 'قابلیت ارسال پیامک', sortable: true },
            { name: 'CanSendMms', displayName: 'قابلیت ارسال پیام چندرسانه ای', sortable: true }

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    tellNumberType.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            tellNumberType.focusExpireLockAccount = true;
        });
    };



    tellNumberType.gridOptions.reGetAll = function () {
        tellNumberType.init();
    }

}]);