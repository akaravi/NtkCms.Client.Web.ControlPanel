app.controller("shopProductFileSerialController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var shopProductFileSerial = this;
    shopProductFileSerial.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    shopProductFileSerial.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "shopProductFileSerialCtrl") {
            localStorage.setItem('AddRequest', '');
            shopProductFileSerial.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    shopProductFileSerial.ContentList = [];

    shopProductFileSerial.allowedSearch = [];
    if (itemRecordStatus != undefined) shopProductFileSerial.itemRecordStatus = itemRecordStatus;
    shopProductFileSerial.init = function () {
        shopProductFileSerial.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = shopProductFileSerial.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }

        ajax.call(cmsServerConfig.configApiServerPath+"shopProductFileSerial/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopProductFileSerial.busyIndicator.isActive = false;
            shopProductFileSerial.ListItems = response.ListItems;
            shopProductFileSerial.gridOptions.fillData(shopProductFileSerial.ListItems , response.resultAccess);
            shopProductFileSerial.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopProductFileSerial.gridOptions.totalRowCount = response.TotalRowCount;
            shopProductFileSerial.gridOptions.rowPerPage = response.RowPerPage;
            shopProductFileSerial.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            shopProductFileSerial.busyIndicator.isActive = false;
            shopProductFileSerial.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //shopProductFileSerial.busyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+'ShopContent/getall', {}, 'POST').success(function (response) {
        //    shopProductFileSerial.ContentList = response.ListItems;
        //    shopProductFileSerial.busyIndicator.isActive = false;
        //});

        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        shopProductFileSerial.checkRequestAddNewItemFromOtherControl(null);
    }
    shopProductFileSerial.busyIndicator.isActive = true;
    shopProductFileSerial.addRequested = false;
    shopProductFileSerial.openAddModal = function () {
        shopProductFileSerial.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'shopProductFileSerial/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            shopProductFileSerial.busyIndicator.isActive = false;
            shopProductFileSerial.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/shopProductFileSerial/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    shopProductFileSerial.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopProductFileSerial.busyIndicator.isActive = true;
        shopProductFileSerial.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopProductFileSerial/add', shopProductFileSerial.selectedItem, 'POST').success(function (response) {
            shopProductFileSerial.addRequested = false;
            shopProductFileSerial.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                shopProductFileSerial.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                shopProductFileSerial.ListItems.unshift(response.Item);
                shopProductFileSerial.gridOptions.fillData(shopProductFileSerial.ListItems);
                shopProductFileSerial.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopProductFileSerial.busyIndicator.isActive = false;
            shopProductFileSerial.addRequested = false;
        });
    }


    shopProductFileSerial.openEditModal = function () {

        shopProductFileSerial.modalTitle = 'ویرایش';
        if (!shopProductFileSerial.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'shopProductFileSerial/GetOne', shopProductFileSerial.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            shopProductFileSerial.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/shopProductFileSerial/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    shopProductFileSerial.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopProductFileSerial.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopProductFileSerial/edit', shopProductFileSerial.selectedItem, 'PUT').success(function (response) {
            shopProductFileSerial.addRequested = true;
            rashaErManage.checkAction(response);
            shopProductFileSerial.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                shopProductFileSerial.addRequested = false;
                shopProductFileSerial.replaceItem(shopProductFileSerial.selectedItem.Id, response.Item);
                shopProductFileSerial.gridOptions.fillData(shopProductFileSerial.ListItems);
                shopProductFileSerial.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopProductFileSerial.addRequested = false;
        });
    }


    shopProductFileSerial.closeModal = function () {
        $modalStack.dismissAll();
    };

    shopProductFileSerial.replaceItem = function (oldId, newItem) {
        angular.forEach(shopProductFileSerial.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = shopProductFileSerial.ListItems.indexOf(item);
                shopProductFileSerial.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            shopProductFileSerial.ListItems.unshift(newItem);
    }

    shopProductFileSerial.deleteRow = function () {
        if (!shopProductFileSerial.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                shopProductFileSerial.busyIndicator.isActive = true;
                console.log(shopProductFileSerial.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'shopProductFileSerial/GetOne', shopProductFileSerial.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    //rashaErManage.checkAction(response);
                    shopProductFileSerial.selectedItemForDelete = response.Item;
                    console.log(shopProductFileSerial.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'shopProductFileSerial/delete', shopProductFileSerial.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        shopProductFileSerial.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            shopProductFileSerial.replaceItem(shopProductFileSerial.selectedItemForDelete.Id);
                            shopProductFileSerial.gridOptions.fillData(shopProductFileSerial.ListItems);
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

    shopProductFileSerial.searchData = function () {
        shopProductFileSerial.gridOptions.serachData();
    }

    shopProductFileSerial.LinkContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkContentId',
        url: 'ShopContent',
        scope: shopProductFileSerial,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: "string"}
            ]
        }
    }

    shopProductFileSerial.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'DescriptionBeforeSale', displayName: 'DescriptionBeforeSale', sortable: true, type: "string" },
            { name: 'DescriptionAfterSale', displayName: 'DescriptionAfterSale', sortable: true, type: "string" },
            { name: 'virtual_ShopContent.Title', displayName: 'عنوان کالای فروشگاه', sortable: true, type: 'string', visible: true },
            { name: 'LinkContentId', displayName: 'کد سیستمی کالای فروشگاه', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    shopProductFileSerial.gridOptions.advancedSearchData = {};
    shopProductFileSerial.gridOptions.advancedSearchData.engine = {};
    shopProductFileSerial.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    shopProductFileSerial.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    shopProductFileSerial.gridOptions.advancedSearchData.engine.SortType = 1;
    shopProductFileSerial.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    shopProductFileSerial.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    shopProductFileSerial.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    shopProductFileSerial.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    shopProductFileSerial.gridOptions.advancedSearchData.engine.Filters = [];

    shopProductFileSerial.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            shopProductFileSerial.focusExpireLockAccount = true;
        });
    };

    shopProductFileSerial.gridOptions.reGetAll = function () {
        shopProductFileSerial.init();
    }

    shopProductFileSerial.columnCheckbox = false;
    shopProductFileSerial.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (shopProductFileSerial.gridOptions.columnCheckbox) {
            for (var i = 0; i < shopProductFileSerial.gridOptions.columns.length; i++) {
                //shopProductFileSerial.gridOptions.columns[i].visible = $("#" + shopProductFileSerial.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + shopProductFileSerial.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                shopProductFileSerial.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = shopProductFileSerial.gridOptions.columns;
            for (var i = 0; i < shopProductFileSerial.gridOptions.columns.length; i++) {
                shopProductFileSerial.gridOptions.columns[i].visible = true;
                var element = $("#" + shopProductFileSerial.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + shopProductFileSerial.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < shopProductFileSerial.gridOptions.columns.length; i++) {
            console.log(shopProductFileSerial.gridOptions.columns[i].name.concat(".visible: "), shopProductFileSerial.gridOptions.columns[i].visible);
        }
        shopProductFileSerial.gridOptions.columnCheckbox = !shopProductFileSerial.gridOptions.columnCheckbox;
    }
    //Export Report 
    shopProductFileSerial.exportFile = function () {
        shopProductFileSerial.addRequested = true;
        shopProductFileSerial.gridOptions.advancedSearchData.engine.ExportFile = shopProductFileSerial.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'shopProductFileSerial/exportfile', shopProductFileSerial.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            shopProductFileSerial.addRequested = false;
            rashaErManage.checkAction(response);
            shopProductFileSerial.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //shopProductFileSerial.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    shopProductFileSerial.toggleExportForm = function () {
        shopProductFileSerial.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        shopProductFileSerial.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        shopProductFileSerial.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        shopProductFileSerial.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleShop/shopProductFileSerial/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    shopProductFileSerial.rowCountChanged = function () {
        if (!angular.isDefined(shopProductFileSerial.ExportFileClass.RowCount) || shopProductFileSerial.ExportFileClass.RowCount > 5000)
            shopProductFileSerial.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    shopProductFileSerial.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"shopProductFileSerial/count", shopProductFileSerial.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            shopProductFileSerial.addRequested = false;
            rashaErManage.checkAction(response);
            shopProductFileSerial.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            shopProductFileSerial.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);