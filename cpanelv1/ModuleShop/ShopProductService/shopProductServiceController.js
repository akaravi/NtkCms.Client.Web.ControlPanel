app.controller("shopProductServiceController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var shopService = this;

    if (itemRecordStatus != undefined) shopService.itemRecordStatus = itemRecordStatus;

    //For Show Shop Loading Indicator
    shopService.busyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    //Shop Grid Options
    shopService.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'Price', displayName: 'قیمت', sortable: true, type: 'integer', visible: 'true' },
            { name: 'CheckInventory', displayName: 'بررسی موجودی؟', sortable: true, isCheckBox: true, visible: 'true' },
            { name: 'CurrentInventory', displayName: 'موجودی', sortable: true, type: 'string', visible: 'true' }
            //{ name: "ActionKey", displayName: "کلیدعملیاتی", displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="shopService.addMenu()"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
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
    shopService.LinkExternalServiceIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkExternalServiceId',
        url: 'ServiceContent',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'LinkExternalServiceId',
        rowPerPage: 200,
        scope: shopService,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
            ]
        }
    }

    //open addMenu modal
    shopService.addMenu = function () {
        $modal.open({
            templateUrl: "cpanelv1/ModuleShop/ShopProductService/grid.html",
            scope: $scope
        });
    }
    shopService.addRequested = false;

    //init Function
    shopService.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ShopProductService/getall", shopService.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopService.ListItems = response.ListItems;
            shopService.gridOptions.fillData(shopService.ListItems, response.resultAccess); // Sending Access as an argument
            shopService.busyIndicator.isActive = false;
            shopService.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopService.gridOptions.totalRowCount = response.TotalRowCount;
            shopService.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            shopService.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            shopService.busyIndicator.isActive = false;
        });
    };

    shopService.gridOptions.onRowSelected = function () {
        var item = shopService.gridOptions.selectedRow.item;
    }

    // Open Add New Content Model
    shopService.openAddContentModal = function () {
        if (buttonIsPressed) { return };
        shopService.addRequested = false;
        shopService.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductService/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            shopService.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/ShopProductService/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    shopService.openEditContentModel = function () {
        if (buttonIsPressed) { return };
        shopService.addRequested = false;
        shopService.modalTitle = 'ویرایش';
        if (!shopService.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductService/GetOne', shopService.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            shopService.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/ShopProductService/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    shopService.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopService.busyIndicator.isActive = true;
        shopService.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductService/add', shopService.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopService.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                shopService.ListItems.unshift(response.Item);
                shopService.gridOptions.fillData(shopService.ListItems);
                shopService.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopService.addRequested = false;
            shopService.busyIndicator.isActive = false;

        });
    }

    //Edit Content
    shopService.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopService.busyIndicator.isActive = true;
        shopService.addRequested = true;
        ////Save Keywords
        //$.each(shopService.kwords, function (index, item) {
        //    if (index == 0)
        //        shopService.selectedItem.Keyword = item.text;
        //    else
        //        shopService.selectedItem.Keyword += ',' + item.text;
        //});
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductService/edit', shopService.selectedItem, 'PUT').success(function (response) {
            shopService.busyIndicator.isActive = false;
            shopService.addRequested = false;
            shopService.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopService.replaceItem(shopService.selectedItem.Id, response.Item);
                shopService.gridOptions.fillData(shopService.ListItems);
                shopService.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopService.addRequested = false;
            shopService.busyIndicator.isActive = false;
        });
    }

    // Delete a Shop Content 
    shopService.deleteContent = function () {
        if (buttonIsPressed) return;
        if (!shopService.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        shopService.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                shopService.busyIndicator.isActive = true;
                shopService.showbusy = true;
                shopService.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"ShopProductService/GetOne", shopService.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    shopService.showbusy = false;
                    shopService.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    shopService.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+"ShopProductService/delete", shopService.selectedItemForDelete, 'POST').success(function (res) {
                        shopService.busyIndicator.isActive = false;
                        shopService.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            shopService.replaceItem(shopService.selectedItemForDelete.Id);
                            shopService.gridOptions.fillData(shopService.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        shopService.showIsBusy = false;
                        shopService.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    shopService.showIsBusy = false;
                    shopService.busyIndicator.isActive = false;

                });
            }
        });
    }

    //Replace Item OnDelete/OnEdit Grid Options
    shopService.replaceItem = function (oldId, newItem) {
        angular.forEach(shopService.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = shopService.ListItems.indexOf(item);
                shopService.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            shopService.ListItems.unshift(newItem);
    }

    shopService.summernoteText = '<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />';
    shopService.searchData = function () {
        shopService.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ShopProductService/getall", shopService.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            shopService.busyIndicator.isActive = false;
            shopService.ListItems = response.ListItems;
            shopService.gridOptions.fillData(shopService.ListItems);
            shopService.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopService.gridOptions.totalRowCount = response.TotalRowCount;
            shopService.gridOptions.rowPerPage = response.RowPerPage;
            shopService.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            shopService.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    shopService.addRequested = false;
    shopService.closeModal = function () {
        $modalStack.dismissAll();
    };

    shopService.showIsBusy = false;


    //For reInit Categories
    shopService.gridOptions.reGetAll = function () {
        shopService.init();
    };

    shopService.addRequested = true;

    shopService.columnCheckbox = false;

    shopService.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = shopService.gridOptions.columns;
        if (shopService.gridOptions.columnCheckbox) {
            for (var i = 0; i < shopService.gridOptions.columns.length; i++) {
                var element = $("#" + shopService.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                shopService.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < shopService.gridOptions.columns.length; i++) {
                var element = $("#" + shopService.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + shopService.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < shopService.gridOptions.columns.length; i++) {
            console.log(shopService.gridOptions.columns[i].name.concat(".visible: "), shopService.gridOptions.columns[i].visible);
        }
        shopService.gridOptions.columnCheckbox = !shopService.gridOptions.columnCheckbox;
    }

    shopService.deleteAttachedFile = function (index) {
        shopService.attachedFiles.splice(index, 1);
    }

    //Export Report 
    shopService.exportFile = function () {
        shopService.addRequested = true;
        shopService.gridOptions.advancedSearchData.engine.ExportFile = shopService.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductService/exportfile', shopService.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopService.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //shopService.closeModal();
            }
            shopService.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    shopService.toggleExportForm = function () {
        shopService.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        shopService.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        shopService.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        shopService.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        shopService.exportDownloadLink = null;
        shopService.addRequested = false;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleShop/ShopProductService/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    shopService.rowCountChanged = function () {
        if (!angular.isDefined(shopService.ExportFileClass.RowCount) || shopService.ExportFileClass.RowCount > 5000)
            shopService.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    shopService.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ShopProductService/count", shopService.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopService.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            shopService.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);