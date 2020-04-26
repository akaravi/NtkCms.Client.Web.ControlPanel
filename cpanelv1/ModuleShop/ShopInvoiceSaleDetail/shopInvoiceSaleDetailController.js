app.controller("shopInvoiceSaleDetailController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$state', '$stateParams', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $state, $stateParams, $filter) {
    var shopInvoiceSaleDetail = this;

    if (itemRecordStatus != undefined) shopInvoiceSaleDetail.itemRecordStatus = itemRecordStatus;

    shopInvoiceSaleDetail.stateMode = "edit";
    if ($stateParams.invoiceId == 0)
        $stateParams.invoiceId = 1;
    //shopInvoiceSaleDetail.stateMode = "add";

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    shopInvoiceSaleDetail.LinkContentIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkContentId',
        url: 'ShopContent',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'LinkContentId',
        rowPerPage: 200,
        scope: shopInvoiceSaleDetail,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
            ]
        }
    }
    //Product Grid Options
    shopInvoiceSaleDetail.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'MainImageSrc', displayName: 'عکس', sortable: true, type: 'integer', visible: 'true' },
            { name: 'virtual_Content.Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'Quantity', displayName: 'تعداد', sortable: true, type: 'string', visible: 'true' },
            { name: 'Fee', displayName: 'قیمت واحد', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'SumRow', displayName: 'جمع کل', sortable: true, isDate: true, type: 'date', visible: 'true' }
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

    //For Show Category Loading Indicator
    shopInvoiceSaleDetail.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show Product Loading Indicator
    shopInvoiceSaleDetail.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }

    //open addMenu modal
    shopInvoiceSaleDetail.addMenu = function () {
        $modal.open({
            templateUrl: "cpanelv1/ModuleShop/shopInvoiceSaleDetail/modalMenu.html",
            scope: $scope
        });
    }

    shopInvoiceSaleDetail.addRequested = false;

    //init Function
    shopInvoiceSaleDetail.init = function () {
        if (shopInvoiceSaleDetail.stateMode == "edit") {
            shopInvoiceSaleDetail.categoryBusyIndicator.isActive = true;
            shopInvoiceSaleDetail.gridOptions.advancedSearchData.engine.Filters = [];
            var filterDataModel = { PropertyName: "LinkInvoiceSaleId", SearchType: 0, IntValue1: $stateParams.invoiceId };
            shopInvoiceSaleDetail.gridOptions.advancedSearchData.engine.Filters.push(filterDataModel);
            ajax.call(cmsServerConfig.configApiServerPath+"shopinvoicesaledetail/getall", shopInvoiceSaleDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                shopInvoiceSaleDetail.ListItems = response.ListItems;
                shopInvoiceSaleDetail.getFileDownloadPath(shopInvoiceSaleDetail.ListItems, "LinkMainImageId", "MainImageSrc");
                shopInvoiceSaleDetail.gridOptions.resultAccess = response.resultAccess;
                //shopInvoiceSaleDetail.gridOptions.fillData(shopInvoiceSaleDetail.ListItems, response.resultAccess); // Sending Access as an argument
                shopInvoiceSaleDetail.contentBusyIndicator.isActive = false;
                shopInvoiceSaleDetail.gridOptions.currentPageNumber = response.CurrentPageNumber;
                shopInvoiceSaleDetail.gridOptions.totalRowCount = response.TotalRowCount;
                shopInvoiceSaleDetail.gridOptions.rowPerPage = response.RowPerPage;
            }).error(function (data, errCode, c, d) {
                //shopInvoiceSaleDetail.gridOptions.fillData();
                rashaErManage.checkAction(data, errCode);
                shopInvoiceSaleDetail.contentBusyIndicator.isActive = false;
            });
        }
        else
            ajax.call(cmsServerConfig.configApiServerPath+"shopinvoicesaledetail/GetViewModel", "", 'GET').success(function (response) {
                rashaErManage.checkAction(response);
                shopInvoiceSaleDetail.selectedItem = response.Item;
            }).error(function (data, errCode, c, d) {
                //shopInvoiceSaleDetail.gridOptions.fillData();
                rashaErManage.checkAction(data, errCode);
            });
        if ($stateParams.invoiceId > 0)
            ajax.call(cmsServerConfig.configApiServerPath+"shopinvoicesale/GetOne", $stateParams.invoiceId, 'GET').success(function (response) {
                rashaErManage.checkAction(response);
                shopInvoiceSaleDetail.invoiceSale = response.Item;
            }).error(function (data, errCode, c, d) {
                //shopInvoiceSaleDetail.gridOptions.fillData();
                rashaErManage.checkAction(data, errCode);
            });
        ajax.call(cmsServerConfig.configApiServerPath+"shopconfiguration/site", {}, "POST").success(function (response) {
            shopInvoiceSaleDetail.Currency = response.Site.Currency;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    shopInvoiceSaleDetail.gridOptions.onRowSelected = function (item) {
        shopInvoiceSaleDetail.gridOptions.selectedRow = {};
        shopInvoiceSaleDetail.gridOptions.selectedRow.item = item;
        $("#row" + item.Id).addClass('active').siblings().removeClass('active');
    }

    //Show Content with Category Id
    shopInvoiceSaleDetail.selectContent = function (node) {
        shopInvoiceSaleDetail.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
        shopInvoiceSaleDetail.contentBusyIndicator.isActive = true;

        shopInvoiceSaleDetail.gridOptions.advancedSearchData.engine.Filters = null;
        shopInvoiceSaleDetail.gridOptions.advancedSearchData.engine.Filters = [];
        shopInvoiceSaleDetail.attachedFiles = [];
        var s = {
            PropertyName: "LinkCategoryId",
            IntValue1: node.Id,
            SearchType: 0
        }
        shopInvoiceSaleDetail.gridOptions.advancedSearchData.engine.Filters.push(s);
        ajax.call(cmsServerConfig.configApiServerPath+"shopInvoiceSaleDetail/getall", shopInvoiceSaleDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopInvoiceSaleDetail.contentBusyIndicator.isActive = false;
            shopInvoiceSaleDetail.ListItems = response.ListItems;
            shopInvoiceSaleDetail.gridOptions.fillData(shopInvoiceSaleDetail.ListItems, response.resultAccess); // Sending Access as an argument
            shopInvoiceSaleDetail.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopInvoiceSaleDetail.gridOptions.totalRowCount = response.TotalRowCount;
            shopInvoiceSaleDetail.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            shopInvoiceSaleDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    shopInvoiceSaleDetail.openAddModal = function () {
        shopInvoiceSaleDetail.addRequested = true;
        shopInvoiceSaleDetail.modalTitle = 'ردیف جدید';
        ajax.call(cmsServerConfig.configApiServerPath+'shopInvoicesaledetail/GetViewModel', "", 'GET').success(function (response) {
            shopInvoiceSaleDetail.addRequested = false;
            rashaErManage.checkAction(response);
            shopInvoiceSaleDetail.selectedItem = response.Item;
            shopInvoiceSaleDetail.selectedItem.LinkInvoiceSaleId = $stateParams.invoiceId;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/shopInvoiceSaleDetail/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    shopInvoiceSaleDetail.openEditModel = function () {
        shopInvoiceSaleDetail.modalTitle = 'ویرایش';
        if (!shopInvoiceSaleDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        shopInvoiceSaleDetail.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSaleDetail/GetOne', shopInvoiceSaleDetail.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            shopInvoiceSaleDetail.addRequested = false;
            rashaErManage.checkAction(response);
            shopInvoiceSaleDetail.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/shopInvoiceSaleDetail/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    shopInvoiceSaleDetail.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (!shopInvoiceSaleDetail.contentExists(shopInvoiceSaleDetail.selectedItem)) {
            shopInvoiceSaleDetail.addRequested = true;
            shopInvoiceSaleDetail.categoryBusyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSaleDetail/add', shopInvoiceSaleDetail.selectedItem, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                shopInvoiceSaleDetail.addRequested = false;
                shopInvoiceSaleDetail.categoryBusyIndicator.isActive = false;
                if (response.IsSuccess) {
                    //shopInvoiceSaleDetail.ListItems.unshift(response.Item);
                    shopInvoiceSaleDetail.closeModal();
                    shopInvoiceSaleDetail.gridOptions.reGetAll();
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                shopInvoiceSaleDetail.addRequested = false;
                shopInvoiceSaleDetail.categoryBusyIndicator.isActive = false;
            });
        } else
            rashaErManage.showMessage("این کالا قبلاً اضافه شده است!");
    }

    //Edit Content
    shopInvoiceSaleDetail.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopInvoiceSaleDetail.addRequested = true;
        shopInvoiceSaleDetail.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSaleDetail/edit', shopInvoiceSaleDetail.selectedItem, 'PUT').success(function (response) {
            shopInvoiceSaleDetail.addRequested = false;
            shopInvoiceSaleDetail.categoryBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopInvoiceSaleDetail.replaceItem(shopInvoiceSaleDetail.selectedItem.Id, response.Item);
                shopInvoiceSaleDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopInvoiceSaleDetail.addRequested = false;
            shopInvoiceSaleDetail.categoryBusyIndicator.isActive = false;
        });
    }

    // Delete a Product Content 
    shopInvoiceSaleDetail.deleteContent = function () {
        if (buttonIsPressed) return;
        if (!shopInvoiceSaleDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                shopInvoiceSaleDetail.categoryBusyIndicator.isActive = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"shopInvoiceSaleDetail/GetOne", shopInvoiceSaleDetail.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    shopInvoiceSaleDetail.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+"shopInvoiceSaleDetail/delete", shopInvoiceSaleDetail.selectedItemForDelete, 'POST').success(function (res) {
                        shopInvoiceSaleDetail.categoryBusyIndicator.isActive = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            shopInvoiceSaleDetail.replaceItem(shopInvoiceSaleDetail.selectedItemForDelete.Id);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        shopInvoiceSaleDetail.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    shopInvoiceSaleDetail.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }

    //Confirm/UnConfirm Product Content
    shopInvoiceSaleDetail.confirmUnConfirmshopInvoiceSaleDetail = function () {
        if (!shopInvoiceSaleDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSaleDetail/GetOne', shopInvoiceSaleDetail.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            shopInvoiceSaleDetail.selectedItem = response.Item;
            shopInvoiceSaleDetail.selectedItem.IsAccepted = (response.Item.IsAccepted == true) ? false : true;
            ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSaleDetail/edit', shopInvoiceSaleDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = shopInvoiceSaleDetail.ListItems.indexOf(shopInvoiceSaleDetail.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        shopInvoiceSaleDetail.ListItems[index] = response2.Item;
                    }
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    //Add To Archive New Content
    shopInvoiceSaleDetail.enableArchive = function () {
        if (!shopInvoiceSaleDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSaleDetail/GetOne', shopInvoiceSaleDetail.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            shopInvoiceSaleDetail.selectedItem = response.Item;
            shopInvoiceSaleDetail.selectedItem.IsArchive = (response.Item.IsArchive == true) ? false : true;
            ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSaleDetail/edit', shopInvoiceSaleDetail.selectedItem, 'PUT').success(function (response2) {
                shopInvoiceSaleDetail.categoryBusyIndicator.isActive = true;
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = shopInvoiceSaleDetail.ListItems.indexOf(shopInvoiceSaleDetail.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        shopInvoiceSaleDetail.ListItems[index] = response2.Item;
                    }
                    shopInvoiceSaleDetail.categoryBusyIndicator.isActive = false;
                }

            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                shopInvoiceSaleDetail.categoryBusyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopInvoiceSaleDetail.categoryBusyIndicator.isActive = false;
        });
    };

    //Replace Item OnDelete/OnEdit Grid Options
    shopInvoiceSaleDetail.replaceItem = function (oldId, newItem) {
        angular.forEach(shopInvoiceSaleDetail.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = shopInvoiceSaleDetail.ListItems.indexOf(item);
                shopInvoiceSaleDetail.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            shopInvoiceSaleDetail.ListItems.unshift(newItem);
    }

    shopInvoiceSaleDetail.searchData = function () {
        shopInvoiceSaleDetail.init();
    }

    //Close Model Stack
    shopInvoiceSaleDetail.addRequested = false;
    shopInvoiceSaleDetail.closeModal = function () {
        $modalStack.dismissAll();
    };

    shopInvoiceSaleDetail.showIsBusy = false;


    //For reInit Categories
    shopInvoiceSaleDetail.gridOptions.reGetAll = function () {
        if (shopInvoiceSaleDetail.gridOptions.advancedSearchData.engine.Filters.length > 0) shopInvoiceSaleDetail.searchData();
        else shopInvoiceSaleDetail.init();
    };

    shopInvoiceSaleDetail.addRequested = true;

    shopInvoiceSaleDetail.columnCheckbox = false;

    shopInvoiceSaleDetail.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = shopInvoiceSaleDetail.gridOptions.columns;
        if (shopInvoiceSaleDetail.gridOptions.columnCheckbox) {
            for (var i = 0; i < shopInvoiceSaleDetail.gridOptions.columns.length; i++) {
                //shopInvoiceSaleDetail.gridOptions.columns[i].visible = $("#" + shopInvoiceSaleDetail.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + shopInvoiceSaleDetail.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                shopInvoiceSaleDetail.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < shopInvoiceSaleDetail.gridOptions.columns.length; i++) {
                var element = $("#" + shopInvoiceSaleDetail.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + shopInvoiceSaleDetail.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < shopInvoiceSaleDetail.gridOptions.columns.length; i++) {
            console.log(shopInvoiceSaleDetail.gridOptions.columns[i].name.concat(".visible: "), shopInvoiceSaleDetail.gridOptions.columns[i].visible);
        }
        shopInvoiceSaleDetail.gridOptions.columnCheckbox = !shopInvoiceSaleDetail.gridOptions.columnCheckbox;
    }

    shopInvoiceSaleDetail.getFileDownloadPath = function (arr, imageFieldId, imageFieldName) {
        var model = [];
        $.each(arr, function (index, item) {
            item.MainImageSrc = "/CmsFiles/img/default-grid-img.png";
            item.imgHeight = 70;
            item.imgWidth = 70;
            var downloadModel = { id: item.virtual_Content[imageFieldId], name: null };
            model.push(downloadModel);
        });
        ajax.call(cmsServerConfig.configApiServerPath+'FileContent/PreviewThumbnailImages', model, 'POST').success(function (response) {
            $.each(arr, function (index, item) {
                item[imageFieldName] = response.ListItems[index].name;
            });
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }

    shopInvoiceSaleDetail.backToPrevState = function () {
        $state.go("index.shopinvoicesale");
    }
    //ngautocomplete
    shopInvoiceSaleDetail.contentListItems = [];
    shopInvoiceSaleDetail.inputContentChanged = function (input) {
        var engine = { Filters: [] };
        engine.Filters.push({ PropertyName: "Title", SearchType: 5, StringValue1: input, ClauseType: 1 });
        ajax.call(cmsServerConfig.configApiServerPath+"shopcontent/search", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopInvoiceSaleDetail.contentListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //ngautocomplete
    shopInvoiceSaleDetail.contentSelected = function (selected) {
        if (selected) {
            shopInvoiceSaleDetail.selectedItem.LinkContentId = selected.originalObject.Id;
            shopInvoiceSaleDetail.selectedItem.Fee = selected.originalObject.Price;
        } else {
            shopInvoiceSaleDetail.selectedItem.LinkContentId = null;
            shopInvoiceSaleDetail.selectedItem.Fee = null;
        }
    }

    shopInvoiceSaleDetail.contentExists = function (item) {
        for (var i = 0; i < shopInvoiceSaleDetail.ListItems.length; i++) {
            if (shopInvoiceSaleDetail.ListItems[i].LinkContentId == item.LinkContentId)
                return true;
        }
        return false;
    }
}]);