app.controller("shopProductCombineController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var shopCombine = this;

    if (itemRecordStatus != undefined) shopCombine.itemRecordStatus = itemRecordStatus;

    //For Show Shop Loading Indicator
    shopCombine.busyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    //Shop Grid Options
    shopCombine.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'Price', displayName: 'قیمت', sortable: true, type: 'integer', visible: 'true' },
            { name: 'CheckInventory', displayName: 'بررسی موجودی؟', sortable: true, isCheckBox: true, visible: 'true' },
            { name: 'CurrentInventory', displayName: 'موجودی', sortable: true, type: 'string', visible: 'true' },
            { name: "ActionKey", displayName: "اجناس", displayForce: true, template: '<a ng-click="shopCombine.openItemsModal(x.Id)" class="btn btn-primary" style="margin:5px;"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "Id",
                SortType: 0,
                NeedToRunFakePagination: false,
                TotalRowData: 2000,
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: []
            }
        }

    }

    shopCombine.LinkProductItemIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkProductItemId',
        url: 'ShopProductItem',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'LinkProductItemId',
        rowPerPage: 200,
        scope: shopCombine,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
            ]
        }
    }
    //open addMenu modal
    shopCombine.addMenu = function () {
        $modal.open({
            templateUrl: "cpanelv1/ModuleShop/ShopProductCombine/grid.html",
            scope: $scope
        });
    }
    shopCombine.addRequested = false;

    //init Function
    shopCombine.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ShopProductCombine/getall", shopCombine.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopCombine.ListItems = response.ListItems;
            shopCombine.gridOptions.fillData(shopCombine.ListItems, response.resultAccess); // Sending Access as an argument
            shopCombine.busyIndicator.isActive = false;
            shopCombine.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopCombine.gridOptions.totalRowCount = response.TotalRowCount;
            shopCombine.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            shopCombine.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            shopCombine.busyIndicator.isActive = false;
        });

        ajax.call(cmsServerConfig.configApiServerPath+"ShopProductItem/search", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopCombine.itemListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    shopCombine.gridOptions.onRowSelected = function () {
        var item = shopCombine.gridOptions.selectedRow.item;
    }

    // Open Add New Content Model
    shopCombine.openAddContentModal = function () {
        if (buttonIsPressed) { return };
        shopCombine.addRequested = false;
        shopCombine.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductCombine/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            shopCombine.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/ShopProductCombine/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    shopCombine.openEditContentModel = function () {
        if (buttonIsPressed) { return };
        shopCombine.addRequested = false;
        shopCombine.modalTitle = 'ویرایش';
        if (!shopCombine.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductCombine/GetOne', shopCombine.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            shopCombine.selectedItem = response.Item;
            angular.forEach(shopCombine.selectedItem.ProductItemCombines, function (value, key) {
                console.log(value);
                value.LinkProductItemTitle = value.ProductItem.Title;
            });
            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/ShopProductCombine/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
        //ajax.call(cmsServerConfig.configApiServerPath+'ShopProductItemCombine/GetViewModel', '', 'GET').success(function (response) {
        //    rashaErManage.checkAction(response);
        //    if (response.IsSuccess) {
        //        shopCombine.shopProductItemCombineToadd = response.Item;
        //    }
        //}).error(function (data, errCode, c, d) {
        //    rashaErManage.checkAction(data, errCode);
        //});
    }

    // Add New Content
    shopCombine.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopCombine.addRequested = true;
        shopCombine.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductCombine/add', shopCombine.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopCombine.addRequested = false;
            shopCombine.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                shopCombine.ListItems.unshift(response.Item);
                shopCombine.gridOptions.fillData(shopCombine.ListItems);
                shopCombine.closeModal();
                if (shopCombine.selectedItem.ProductItemCombines != null && shopCombine.selectedItem.ProductItemCombines != undefined) {
                    $.each(shopCombine.selectedItem.ProductItemCombines, function (index, item) {
                        item.LinkProductCombineId = response.Item.Id;
                    });
                }
                shopCombine.addRequested = true;
                shopCombine.busyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath+'ShopProductCombine/addbatch', shopCombine.selectedItem.ProductItemCombines, 'POST').success(function (response) {
                    rashaErManage.checkAction(response);
                    shopCombine.addRequested = false;
                    shopCombine.busyIndicator.isActive = false;
                    if (response.IsSuccess) {
                        shopCombine.ListItems.unshift(response.Item);
                        shopCombine.gridOptions.fillData(shopCombine.ListItems);
                        shopCombine.closeModal();
                    }
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    shopCombine.addRequested = false;
                    shopCombine.busyIndicator.isActive = false;
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopCombine.addRequested = false;
            shopCombine.busyIndicator.isActive = false;
        });
    }

    //Edit Content
    shopCombine.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopCombine.busyIndicator.isActive = true;
        shopCombine.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductCombine/edit', shopCombine.selectedItem, 'PUT').success(function (response) {
            shopCombine.busyIndicator.isActive = false;
            shopCombine.addRequested = false;
            shopCombine.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopCombine.replaceItem(shopCombine.selectedItem.Id, response.Item);
                shopCombine.gridOptions.fillData(shopCombine.ListItems);
                shopCombine.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopCombine.addRequested = false;
            shopCombine.busyIndicator.isActive = false;
        });
    }

    // Delete a Shop Content 
    shopCombine.deleteContent = function () {
        if (buttonIsPressed) return;
        if (!shopCombine.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        shopCombine.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                shopCombine.busyIndicator.isActive = true;
                shopCombine.showbusy = true;
                shopCombine.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"ShopProductCombine/GetOne", shopCombine.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    shopCombine.showbusy = false;
                    shopCombine.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    shopCombine.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+"ShopProductCombine/delete", shopCombine.selectedItemForDelete, 'POST').success(function (res) {
                        shopCombine.busyIndicator.isActive = false;
                        shopCombine.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            shopCombine.replaceItem(shopCombine.selectedItemForDelete.Id);
                            shopCombine.gridOptions.fillData(shopCombine.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        shopCombine.showIsBusy = false;
                        shopCombine.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    shopCombine.showIsBusy = false;
                    shopCombine.busyIndicator.isActive = false;
                });
            }
        });
    }

    //Replace Item OnDelete/OnEdit Grid Options
    shopCombine.replaceItem = function (oldId, newItem) {
        angular.forEach(shopCombine.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = shopCombine.ListItems.indexOf(item);
                shopCombine.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            shopCombine.ListItems.unshift(newItem);
    }

    shopCombine.searchData = function () {
    }

    //Close Model Stack
    shopCombine.addRequested = false;
    shopCombine.closeModal = function () {
        $modalStack.dismissAll();
    };

    shopCombine.showIsBusy = false;


    //For reInit Categories
    shopCombine.gridOptions.reGetAll = function () {
        shopCombine.init();
    };

    shopCombine.addRequested = true;

    shopCombine.columnCheckbox = false;

    shopCombine.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = shopCombine.gridOptions.columns;
        if (shopCombine.gridOptions.columnCheckbox) {
            for (var i = 0; i < shopCombine.gridOptions.columns.length; i++) {
                //shopCombine.gridOptions.columns[i].visible = $("#" + shopCombine.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + shopCombine.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                shopCombine.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < shopCombine.gridOptions.columns.length; i++) {
                var element = $("#" + shopCombine.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + shopCombine.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < shopCombine.gridOptions.columns.length; i++) {
            console.log(shopCombine.gridOptions.columns[i].name.concat(".visible: "), shopCombine.gridOptions.columns[i].visible);
        }
        shopCombine.gridOptions.columnCheckbox = !shopCombine.gridOptions.columnCheckbox;
    }

    //Add Item

    shopCombine.openItemsModal = function (selectedId) {
        shopCombine.itemsList = [];
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductCombine/GetOne', selectedId, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopCombine.selectedItem = response.Item;
                shopCombine.ShopProductItemCombineresultAccess = response.resultAccess;
                shopCombine.selectedItem.LinkProductCombineId = selectedId;
                shopCombine.selectedItem.ProductItemCount = 1;
                response.Item.ProductItemCombines.forEach(function (item) {
                    shopCombine.itemsList.push({ Id: item.ProductItem.Id, Title: item.ProductItem.Title });
                });
                $modal.open({
                    templateUrl: 'cpanelv1/ModuleShop/ShopProductCombine/addItem.html',
                    scope: $scope
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    shopCombine.pushNewItem = function () {
        if (shopCombine.selectedItem.ProductItemCombines == null)
            shopCombine.selectedItem.ProductItemCombines = [];
        if (shopCombine.itemAlreadyExist(shopCombine.selectedItem.LinkProductItemId)) {
            rashaErManage.showMessage("این مورد قبلاً اضافه شده است!");
            return;
        }
        if (shopCombine.selectedItem.ProductItemCount == undefined || shopCombine.selectedItem.ProductItemCount == null || shopCombine.selectedItem.ProductItemCount == 0) {
            rashaErManage.showMessage("تعداد وارد نشده است!");
            return;
        }
        shopCombine.selectedItem.ProductItemCombines.push({ LinkProductCombineId: 0, ProductItemCount: shopCombine.selectedItem.ProductItemCount, LinkProductItemId: shopCombine.selectedItem.LinkProductItemId, Price: shopCombine.selectedItem.LinkProductItemPrice, LinkProductItemTitle: shopCombine.selectedItem.LinkProductItemTitle });
        shopCombine.selectedItem.Price = shopCombine.selectedItem.LinkProductItemPrice * shopCombine.selectedItem.ProductItemCount;
    }
    shopCombine.popNewItem = function (index) {
        shopCombine.selectedItem.ProductItemCombines.splice(index, 1);
    }
    shopCombine.itemAlreadyExist = function (itemId) {
        var itemExist = false;
        $.each(shopCombine.selectedItem.ProductItemCombines, function (index, item) { if (item.LinkProductItemId == itemId) { itemExist = true; return itemExist } });
        return itemExist;
    }
    shopCombine.addNewItem = function (frm) {
        if (shopCombine.selectedItem.ProductItemCount == undefined || shopCombine.selectedItem.ProductItemCount == null || shopCombine.selectedItem.ProductItemCount == 0) {
            rashaErManage.showMessage("تعداد را وارد کنید!");
            return;
        }
        var itemFound = false;
        angular.forEach(shopCombine.selectedItem.ProductItemCombines, function (value, key) {
            if (value.LinkProductItemId == shopCombine.selectedItem.LinkProductItemId)
                itemFound = true;
        });
        if (itemFound == true) {
            rashaErManage.showMessage("این کالا قبلاْ وارد شده است!");
            return;
        }
        shopCombine.selectedItem.LinkProductCombineId = shopCombine.selectedItem.Id;
        shopCombine.selectedItem.Id = 0;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductItemCombine/add', shopCombine.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopCombine.selectedItem.ProductItemCombines.push({ LinkProductItemId: shopCombine.selectedItem.LinkProductItemId, LinkProductItemTitle: shopCombine.selectedItem.LinkProductItemTitle });
                //Clear inputs
                shopCombine.selectedItem.ProductItemCount = 1;
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    shopCombine.alreadyExist = function (arr) {
        var found = false;
        arr.forEach(function (item) {
            if (item.Id == shopCombine.selectedItem.LinkProductItemId)
                found = true;
        });
        return found;
    }

    shopCombine.deleteItem = function (index) {
        var filterModel = { Filters: [] };
        filterModel.Filters.push({ PropertyName: "LinkProductItemId", SearchType: 0, IntValue1: shopCombine.itemsList[index].Id });
        filterModel.Filters.push({ PropertyName: "LinkProductCombineId", SearchType: 0, IntValue1: shopCombine.selectedItem.LinkProductCombineId });
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductItemCombine/DeleteFilterModel', filterModel, 'POST').success(function (res) {
            rashaErManage.checkAction(res);
            if (res.IsSuccess) {
                shopCombine.itemsList.splice(index, 1);
                rashaErManage.showMessage($filter('translatentk')('Removed_Successfully'));
            }
        }).error(function (data2, errCode2, c2, d2) {
            rashaErManage.checkAction(data2);
        });
    }

    //ngautocomplete
    shopCombine.itemSelected = function (selected) {
        if (selected) {
            shopCombine.selectedItem.LinkProductItemId = selected.originalObject.Id;
            shopCombine.selectedItem.LinkProductItemTitle = selected.originalObject.Title;
            shopCombine.selectedItem.LinkProductItemPrice = selected.originalObject.Price;
        } else {
            shopCombine.selectedItem.LinkProductItemId = null;
        }
    }
    //Export Report 
    shopCombine.exportFile = function () {
        shopCombine.addRequested = true;
        shopCombine.gridOptions.advancedSearchData.engine.ExportFile = shopCombine.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductCombine/exportfile', shopCombine.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopCombine.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //shopCombine.closeModal();
            }
            shopCombine.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    shopCombine.toggleExportForm = function () {
        shopCombine.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        shopCombine.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        shopCombine.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        shopCombine.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        shopCombine.exportDownloadLink = null;
        shopCombine.addRequested = false;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleShop/ShopProductCombine/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    shopCombine.rowCountChanged = function () {
        if (!angular.isDefined(shopCombine.ExportFileClass.RowCount) || shopCombine.ExportFileClass.RowCount > 5000)
            shopCombine.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    shopCombine.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ShopProductCombine/count", shopCombine.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopCombine.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            shopCombine.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);