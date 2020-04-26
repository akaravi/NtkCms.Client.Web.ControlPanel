app.controller("shopProductItemController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var shopItem = this;

    if (itemRecordStatus != undefined) shopItem.itemRecordStatus = itemRecordStatus;

    //For Show Shop Loading Indicator
    shopItem.busyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    //Shop Grid Options
    shopItem.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'Price', displayName: 'قیمت', sortable: true, type: 'integer', visible: 'true' },
            { name: 'CheckInventory', displayName: 'بررسی موجودی؟', sortable: true, isCheckBox: true, visible: 'true' },
            { name: 'CurrentInventory', displayName: 'موجودی', sortable: true, type: 'string', visible: 'true' }
            //{ name: "ActionKey", displayName: "کلیدعملیاتی", displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="shopItem.addMenu()"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
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


    //open addMenu modal
    shopItem.addMenu = function () {
        $modal.open({
            templateUrl: "cpanelv1/ModuleShop/ShopProductItem/modalMenu.html",
            scope: $scope
        });
    }
    shopItem.addRequested = false;

    //init Function
    shopItem.init = function () {
        //var engine = {};
        //try {
        //    engine = shopItem.gridOptions.advancedSearchData.engine;
        //} catch (error) {
        //    console.log(error);
        //}

        ajax.call(cmsServerConfig.configApiServerPath+"ShopProductItem/getall", shopItem.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopItem.ListItems = response.ListItems;
            shopItem.gridOptions.fillData(shopItem.ListItems, response.resultAccess); // Sending Access as an argument
            shopItem.busyIndicator.isActive = false;
            shopItem.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopItem.gridOptions.totalRowCount = response.TotalRowCount;
            shopItem.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            shopItem.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            shopItem.busyIndicator.isActive = false;
        });
    };

    shopItem.gridOptions.onRowSelected = function () {
        var item = shopItem.gridOptions.selectedRow.item;
    }

    // Open Add New Content Model
    shopItem.openAddContentModal = function () {
        if (buttonIsPressed) { return };
        shopItem.addRequested = false;
        shopItem.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductItem/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            shopItem.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/ShopProductItem/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    shopItem.openEditContentModel = function () {
        if (buttonIsPressed) { return };
        shopItem.addRequested = false;
        shopItem.modalTitle = 'ویرایش';
        if (!shopItem.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductItem/GetOne', shopItem.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            shopItem.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/ShopProductItem/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    shopItem.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopItem.busyIndicator.isActive = true;
        shopItem.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductItem/add', shopItem.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopItem.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                shopItem.ListItems.unshift(response.Item);
                shopItem.gridOptions.fillData(shopItem.ListItems);
                shopItem.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopItem.addRequested = false;
            shopItem.busyIndicator.isActive = false;

        });
    }

    //Edit Content
    shopItem.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopItem.busyIndicator.isActive = true;
        shopItem.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductItem/edit', shopItem.selectedItem, 'PUT').success(function (response) {
            shopItem.busyIndicator.isActive = false;
            shopItem.addRequested = false;
            shopItem.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopItem.replaceItem(shopItem.selectedItem.Id, response.Item);
                shopItem.gridOptions.fillData(shopItem.ListItems);
                shopItem.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopItem.addRequested = false;
            shopItem.busyIndicator.isActive = false;
        });
    }

    // Delete a Shop Content 
    shopItem.deleteContent = function () {
        if (buttonIsPressed) return;
        if (!shopItem.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        shopItem.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                shopItem.busyIndicator.isActive = true;
                shopItem.showbusy = true;
                shopItem.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"ShopProductItem/GetOne", shopItem.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    shopItem.showbusy = false;
                    shopItem.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    shopItem.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+"ShopProductItem/delete", shopItem.selectedItemForDelete, 'POST').success(function (res) {
                        shopItem.busyIndicator.isActive = false;
                        shopItem.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            shopItem.replaceItem(shopItem.selectedItemForDelete.Id);
                            shopItem.gridOptions.fillData(shopItem.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        shopItem.showIsBusy = false;
                        shopItem.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    shopItem.showIsBusy = false;
                    shopItem.busyIndicator.isActive = false;

                });
            }
        });
    }

    //Replace Item OnDelete/OnEdit Grid Options
    shopItem.replaceItem = function (oldId, newItem) {
        angular.forEach(shopItem.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = shopItem.ListItems.indexOf(item);
                shopItem.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            shopItem.ListItems.unshift(newItem);
    }

    shopItem.summernoteText = '<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />';
    shopItem.searchData = function () {
        shopItem.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"shopItem/getall", shopItem.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            shopItem.busyIndicator.isActive = false;
            shopItem.ListItems = response.ListItems;
            shopItem.gridOptions.fillData(shopItem.ListItems);
            shopItem.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopItem.gridOptions.totalRowCount = response.TotalRowCount;
            shopItem.gridOptions.rowPerPage = response.RowPerPage;
            shopItem.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            shopItem.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    shopItem.addRequested = false;
    shopItem.closeModal = function () {
        $modalStack.dismissAll();
    };

    shopItem.showIsBusy = false;


    //For reInit Categories
    shopItem.gridOptions.reGetAll = function () {
        shopItem.init();
    };

    shopItem.addRequested = true;

    shopItem.columnCheckbox = false;

    shopItem.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = shopItem.gridOptions.columns;
        if (shopItem.gridOptions.columnCheckbox) {
            for (var i = 0; i < shopItem.gridOptions.columns.length; i++) {
                //shopItem.gridOptions.columns[i].visible = $("#" + shopItem.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + shopItem.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                shopItem.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < shopItem.gridOptions.columns.length; i++) {
                var element = $("#" + shopItem.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + shopItem.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < shopItem.gridOptions.columns.length; i++) {
            console.log(shopItem.gridOptions.columns[i].name.concat(".visible: "), shopItem.gridOptions.columns[i].visible);
        }
        shopItem.gridOptions.columnCheckbox = !shopItem.gridOptions.columnCheckbox;
    }

    shopItem.deleteAttachedFile = function (index) {
        shopItem.attachedFiles.splice(index, 1);
    }
    //Export Report 
    shopItem.exportFile = function () {
        shopItem.addRequested = true;
        shopItem.gridOptions.advancedSearchData.engine.ExportFile = shopItem.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductItem/exportfile', shopItem.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            shopItem.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopItem.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //shopItem.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    shopItem.toggleExportForm = function () {
        shopItem.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        shopItem.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        shopItem.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        shopItem.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        shopItem.exportDownloadLink = null;
        shopItem.addRequested = false;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleShop/shopproductItem/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    shopItem.rowCountChanged = function () {
        if (!angular.isDefined(shopItem.ExportFileClass.RowCount) || shopItem.ExportFileClass.RowCount > 5000)
            shopItem.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    shopItem.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ShopProductItem/count", shopItem.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            shopItem.addRequested = false;
            rashaErManage.checkAction(response);
            shopItem.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            shopItem.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);