app.controller("cmsWidgetGridCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var cmsWidgetgrd = this;
    cmsWidgetgrd.init = function () {
        ajax.call(mainPathApi+"cmsWidget/getall", cmsWidgetgrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsWidgetgrd.ListItems = response.ListItems;
            cmsWidgetgrd.gridOptions.fillData(cmsWidgetgrd.ListItems , response.resultAccess);
            cmsWidgetgrd.gridOptions.currentPageNumber = response.CurrentPageNumber+1;
            cmsWidgetgrd.gridOptions.totalRowCount = response.TotalRowCount;
            cmsWidgetgrd.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            cmsWidgetgrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsWidgetgrd.addRequested = false;
    cmsWidgetgrd.openAddModal = function () {
        cmsWidgetgrd.modalTitle = 'اضافه';
        ajax.call(mainPathApi+'cmsWidget/getviewmodel', '0', 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsWidgetgrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsWidget/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsWidgetgrd.addNewRow = function (frm) {
	if (frm.$invalid)
            return;

        cmsWidgetgrd.addRequested = true;
        ajax.call(mainPathApi+'cmsWidget/add',  cmsWidgetgrd.selectedItem , 'POST').success(function (response) {
            cmsWidgetgrd.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsWidgetgrd.ListItems.unshift(response.Item);
                cmsWidgetgrd.gridOptions.fillData(cmsWidgetgrd.ListItems);
                cmsWidgetgrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsWidgetgrd.addRequested = false;
        });
    }


    cmsWidgetgrd.openEditModal=function() {
        cmsWidgetgrd.modalTitle = 'ویرایش';
        if (!cmsWidgetgrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        ajax.call(mainPathApi+'cmsWidget/getviewmodel',  cmsWidgetgrd.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsWidgetgrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsWidget/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsWidgetgrd.editRow = function (frm) {
	if (frm.$invalid)
            return;

        ajax.call(mainPathApi+'cmsWidget/edit',  cmsWidgetgrd.selectedItem , 'PUT').success(function (response) {
            cmsWidgetgrd.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsWidgetgrd.addRequested = false;
                cmsWidgetgrd.replaceItem(cmsWidgetgrd.selectedItem.Id, response.Item);
                cmsWidgetgrd.gridOptions.fillData(cmsWidgetgrd.ListItems);
                cmsWidgetgrd.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsWidgetgrd.addRequested = false;
        });
    }


    cmsWidgetgrd.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsWidgetgrd.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsWidgetgrd.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsWidgetgrd.ListItems.indexOf(item);
                cmsWidgetgrd.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsWidgetgrd.ListItems.unshift(newItem);
    }

    cmsWidgetgrd.deleteRow = function () {
        if (!cmsWidgetgrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(cmsWidgetgrd.gridOptions.selectedRow.item);
                ajax.call(mainPathApi+'cmsWidget/getviewmodel',  cmsWidgetgrd.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsWidgetgrd.selectedItemForDelete = response.Item;
                    console.log(cmsWidgetgrd.selectedItemForDelete);
                    ajax.call(mainPathApi+'cmsWidget/delete', cmsWidgetgrd.selectedItemForDelete , 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsWidgetgrd.replaceItem(cmsWidgetgrd.selectedItemForDelete.Id);
                            cmsWidgetgrd.gridOptions.fillData(cmsWidgetgrd.ListItems);
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

    cmsWidgetgrd.searchData=function() {
        cmsWidgetgrd.gridOptions.serachData();
    }

   cmsWidgetgrd.linkCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkLinkCategoryIdId',
        url: 'LinkCategoryId',
        scope: cmsWidgetgrd,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' }
            ]
        }
    }

cmsWidgetgrd.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
            { name: 'Name', displayName: 'نام', sortable: true },
            { name: 'Description', displayName: 'توضیحات', sortable: true },
            { name: 'DefaultController', displayName: 'کنترل پیش فرض', sortable: true },
            { name: 'DefultAction', displayName: 'فعالیت پیش فرض', sortable: true },
            { name: 'JsonSettingValue', displayName: 'مقادیر  Json', sortable: true },
            { name: 'LinkCategoryId.Title', displayName: 'انتخاب دسته بندی', sortable: true , displayForce:true }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }




   cmsWidgetgrd.gridOptions.reGetAll = function () {
        cmsWidgetgrd.init();
    }

}]);