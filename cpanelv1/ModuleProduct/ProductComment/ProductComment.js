app.controller("ProductCommentCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var ProductComment = this;
    ProductComment.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    ProductComment.ContentList = [];
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    ProductComment.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "ProductCommentCtrl") {
            localStorage.setItem('AddRequest', '');
            ProductComment.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    ProductComment.allowedSearch = [];
    if (itemRecordStatus != undefined) ProductComment.itemRecordStatus = itemRecordStatus;
    ProductComment.init = function () {
        ProductComment.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = ProductComment.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }

        ajax.call(cmsServerConfig.configApiServerPath+"ProductComment/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            ProductComment.busyIndicator.isActive = false;
            ProductComment.ListItems = response.ListItems;
            ProductComment.gridOptions.fillData(ProductComment.ListItems , response.resultAccess);
            ProductComment.gridOptions.currentPageNumber = response.CurrentPageNumber;
            ProductComment.gridOptions.totalRowCount = response.TotalRowCount;
            ProductComment.gridOptions.rowPerPage = response.RowPerPage;
            ProductComment.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            ProductComment.busyIndicator.isActive = false;
            ProductComment.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //ProductComment.busyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+'ProductContent/getall', {}, 'POST').success(function (response) {
        //    ProductComment.ContentList = response.ListItems;
        //    ProductComment.busyIndicator.isActive = false;
        //});

        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        ProductComment.checkRequestAddNewItemFromOtherControl(null);
    }
    ProductComment.busyIndicator.isActive = true;
    ProductComment.addRequested = false;
    ProductComment.openAddModal = function () {
        ProductComment.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'ProductComment/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            ProductComment.busyIndicator.isActive = false;
            ProductComment.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleProduct/ProductComment/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    ProductComment.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        ProductComment.busyIndicator.isActive = true;
        ProductComment.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ProductComment/add', ProductComment.selectedItem, 'POST').success(function (response) {
            ProductComment.addRequested = false;
            ProductComment.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                ProductComment.checkRequestAddNewItemFromOtherControl(response.Item.Id);

                ProductComment.ListItems.unshift(response.Item);
                ProductComment.gridOptions.fillData(ProductComment.ListItems);
                ProductComment.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            ProductComment.busyIndicator.isActive = false;
            ProductComment.addRequested = false;
        });
    }


    ProductComment.openEditModal = function () {

        ProductComment.modalTitle = 'ویرایش';
        if (!ProductComment.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'ProductComment/GetOne', ProductComment.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            ProductComment.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleProduct/ProductComment/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    ProductComment.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        ProductComment.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ProductComment/edit', ProductComment.selectedItem, 'PUT').success(function (response) {
            ProductComment.addRequested = true;
            rashaErManage.checkAction(response);
            ProductComment.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                ProductComment.addRequested = false;
                ProductComment.replaceItem(ProductComment.selectedItem.Id, response.Item);
                ProductComment.gridOptions.fillData(ProductComment.ListItems);
                ProductComment.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            ProductComment.addRequested = false;
        });
    }


    ProductComment.closeModal = function () {
        $modalStack.dismissAll();
    };

    ProductComment.replaceItem = function (oldId, newItem) {
        angular.forEach(ProductComment.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = ProductComment.ListItems.indexOf(item);
                ProductComment.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            ProductComment.ListItems.unshift(newItem);
    }

    ProductComment.deleteRow = function () {
        if (!ProductComment.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                ProductComment.busyIndicator.isActive = true;
                console.log(ProductComment.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'ProductComment/GetOne', ProductComment.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    //rashaErManage.checkAction(response);
                    ProductComment.selectedItemForDelete = response.Item;
                    console.log(ProductComment.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ProductComment/delete', ProductComment.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        ProductComment.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            ProductComment.replaceItem(ProductComment.selectedItemForDelete.Id);
                            ProductComment.gridOptions.fillData(ProductComment.ListItems);
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

    ProductComment.searchData = function () {
        ProductComment.gridOptions.serachData();
    }

    ProductComment.LinkProductContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkProductContentId',
        url: 'ProductContent',
        scope: ProductComment,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'},
                { name: 'RegisterDate', displayName: 'تاریخ ثبت', sortable: true, type: 'date'}
            ]
        }
    }

    ProductComment.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Writer', displayName: 'نام نویسنده', sortable: true, type: "string" },
            { name: 'Comment', displayName: 'کامنت', sortable: true, type: "string" },
            { name: 'virtual_ProductContent.Title', displayName: 'عنوان محصولات', sortable: true, type: 'string', visible: true },
            { name: 'LinkProductContentId', displayName: 'کد سیستمی محصولات', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    ProductComment.gridOptions.advancedSearchData = {};
    ProductComment.gridOptions.advancedSearchData.engine = {};
    ProductComment.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    ProductComment.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    ProductComment.gridOptions.advancedSearchData.engine.SortType = 1;
    ProductComment.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    ProductComment.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    ProductComment.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    ProductComment.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    ProductComment.gridOptions.advancedSearchData.engine.Filters = [];

    ProductComment.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            ProductComment.focusExpireLockAccount = true;
        });
    };

    ProductComment.gridOptions.reGetAll = function () {
        ProductComment.init();
    }

    ProductComment.columnCheckbox = false;
    ProductComment.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (ProductComment.gridOptions.columnCheckbox) {
            for (var i = 0; i < ProductComment.gridOptions.columns.length; i++) {
                //ProductComment.gridOptions.columns[i].visible = $("#" + ProductComment.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + ProductComment.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                ProductComment.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = ProductComment.gridOptions.columns;
            for (var i = 0; i < ProductComment.gridOptions.columns.length; i++) {
                ProductComment.gridOptions.columns[i].visible = true;
                var element = $("#" + ProductComment.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + ProductComment.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < ProductComment.gridOptions.columns.length; i++) {
            console.log(ProductComment.gridOptions.columns[i].name.concat(".visible: "), ProductComment.gridOptions.columns[i].visible);
        }
        ProductComment.gridOptions.columnCheckbox = !ProductComment.gridOptions.columnCheckbox;
    }
}]);