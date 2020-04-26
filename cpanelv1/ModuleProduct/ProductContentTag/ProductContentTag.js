app.controller("productContentTagCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var productContentTag = this;
    productContentTag.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    productContentTag.init = function () {
        productContentTag.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ProductContenttag/getall", productContentTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            productContentTag.busyIndicator.isActive = false;
            productContentTag.ListItems = response.ListItems;
            productContentTag.gridOptions.fillData(productContentTag.ListItems , response.resultAccess);
            productContentTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            productContentTag.gridOptions.totalRowCount = response.TotalRowCount;
            productContentTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            productContentTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    productContentTag.addRequested = false;
    productContentTag.openAddModal = function () {
        productContentTag.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'ProductContenttag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            productContentTag.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleProduct/ProductcontentTag/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    productContentTag.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        productContentTag.addRequested = true;
        productContentTag.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+'ProductContenttag/add', productContentTag.selectedItem , 'POST').success(function (response) {
            productContentTag.addRequested = false;
            productContentTag.busyIndicator.isActive = false;

            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                productContentTag.ListItems.unshift(response.Item);
                productContentTag.gridOptions.fillData(productContentTag.ListItems);
                productContentTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            productContentTag.busyIndicator.isActive = false;

            productContentTag.addRequested = false;
        });
    }


    productContentTag.openEditModal = function () {
        productContentTag.modalTitle = 'ویرایش';
        if (!productContentTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'ProductContenttag/GetOne',  productContentTag.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            productContentTag.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleProduct/ProductcontentTag/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    productContentTag.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        productContentTag.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+'ProductContenttag/edit',  productContentTag.selectedItem , 'PUT').success(function (response) {
            productContentTag.addRequested = true;
            rashaErManage.checkAction(response);
            productContentTag.busyIndicator.isActive = false;

            if (response.IsSuccess) {
                productContentTag.addRequested = false;
                productContentTag.replaceItem(productContentTag.selectedItem.Id, response.Item);
                productContentTag.gridOptions.fillData(productContentTag.ListItems);
                productContentTag.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            productContentTag.busyIndicator.isActive = false;

            productContentTag.addRequested = false;
        });
    }


    productContentTag.closeModal = function () {
        $modalStack.dismissAll();
    };

    productContentTag.replaceItem = function (oldId, newItem) {
        angular.forEach(productContentTag.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = productContentTag.ListItems.indexOf(item);
                productContentTag.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            productContentTag.ListItems.unshift(newItem);
    }

    productContentTag.deleteRow = function () {
        if (!productContentTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                productContentTag.busyIndicator.isActive = true;
                console.log(productContentTag.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'ProductContenttag/GetOne',  productContentTag.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    productContentTag.selectedItemForDelete = response.Item;
                    console.log(productContentTag.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ProductContenttag/delete',  productContentTag.selectedItemForDelete , 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        productContentTag.busyIndicator.isActive = false;

                        if (res.IsSuccess) {
                            productContentTag.replaceItem(productContentTag.selectedItemForDelete.Id);
                            productContentTag.gridOptions.fillData(productContentTag.ListItems);
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

    productContentTag.searchData = function () {
        productContentTag.gridOptions.serachData();
    }

    productContentTag.LinkContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkContentId',
        url: 'ProductContent',
        scope: productContentTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }


    productContentTag.LinkTagIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkTagId',
        url: 'ProductTag',
        scope: productContentTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    productContentTag.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
           { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Content.Title', displayName: 'انتخاب محتوا', sortable: true ,displayForce:true},
            { name: 'Tag.Title', displayName: 'انتخاب تگ', sortable: true, displayForce: true },

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    productContentTag.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            productContentTag.focusExpireLockAccount = true;
        });
    };



    productContentTag.gridOptions.reGetAll = function () {
        productContentTag.init();
    }

}]);