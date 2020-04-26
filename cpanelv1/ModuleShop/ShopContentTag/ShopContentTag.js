app.controller("shopContentTagCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var shopContentTag = this;
    shopContentTag.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    shopContentTag.init = function () {
        shopContentTag.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"shopContenttag/getall", shopContentTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopContentTag.busyIndicator.isActive = false;

            shopContentTag.ListItems = response.ListItems;
            shopContentTag.gridOptions.fillData(shopContentTag.ListItems , response.resultAccess);
            shopContentTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopContentTag.gridOptions.totalRowCount = response.TotalRowCount;
            shopContentTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            shopContentTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    shopContentTag.addRequested = false;
    shopContentTag.openAddModal = function () {
        shopContentTag.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'shopContenttag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            shopContentTag.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleshop/shopcontentTag/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    shopContentTag.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopContentTag.addRequested = true;
        shopContentTag.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+'shopContenttag/add', shopContentTag.selectedItem , 'POST').success(function (response) {
            shopContentTag.addRequested = false;
            shopContentTag.busyIndicator.isActive = false;

            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopContentTag.ListItems.unshift(response.Item);
                shopContentTag.gridOptions.fillData(shopContentTag.ListItems);
                shopContentTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopContentTag.busyIndicator.isActive = false;

            shopContentTag.addRequested = false;
        });
    }


    shopContentTag.openEditModal = function () {
        shopContentTag.modalTitle = 'ویرایش';
        if (!shopContentTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'shopContenttag/GetOne',  shopContentTag.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            shopContentTag.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleshop/shopcontentTag/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    shopContentTag.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopContentTag.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+'shopContenttag/edit',  shopContentTag.selectedItem , 'PUT').success(function (response) {
            shopContentTag.addRequested = true;
            rashaErManage.checkAction(response);
            shopContentTag.busyIndicator.isActive = false;

            if (response.IsSuccess) {
                shopContentTag.addRequested = false;
                shopContentTag.replaceItem(shopContentTag.selectedItem.Id, response.Item);
                shopContentTag.gridOptions.fillData(shopContentTag.ListItems);
                shopContentTag.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopContentTag.busyIndicator.isActive = false;

            shopContentTag.addRequested = false;
        });
    }


    shopContentTag.closeModal = function () {
        $modalStack.dismissAll();
    };

    shopContentTag.replaceItem = function (oldId, newItem) {
        angular.forEach(shopContentTag.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = shopContentTag.ListItems.indexOf(item);
                shopContentTag.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            shopContentTag.ListItems.unshift(newItem);
    }

    shopContentTag.deleteRow = function () {
        if (!shopContentTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                shopContentTag.busyIndicator.isActive = true;
                console.log(shopContentTag.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'shopContenttag/GetOne',  shopContentTag.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    shopContentTag.selectedItemForDelete = response.Item;
                    console.log(shopContentTag.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'shopContenttag/delete',  shopContentTag.selectedItemForDelete , 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        shopContentTag.busyIndicator.isActive = false;

                        if (res.IsSuccess) {
                            shopContentTag.replaceItem(shopContentTag.selectedItemForDelete.Id);
                            shopContentTag.gridOptions.fillData(shopContentTag.ListItems);
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

    shopContentTag.searchData = function () {
        shopContentTag.gridOptions.serachData();
    }

    shopContentTag.LinkContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkContentId',
        url: 'shopContent',
        scope: shopContentTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }


    shopContentTag.LinkTagIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkTagId',
        url: 'shopTag',
        scope: shopContentTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    shopContentTag.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true},
           
            { name: 'Content.Title', displayName: 'انتخاب محتوا', sortable: true ,displayForce:true},
            { name: 'Tag.Title', displayName: 'انتخاب تگ', sortable: true, displayForce: true },

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    shopContentTag.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            shopContentTag.focusExpireLockAccount = true;
        });
    };



    shopContentTag.gridOptions.reGetAll = function () {
        shopContentTag.init();
    }

}]);