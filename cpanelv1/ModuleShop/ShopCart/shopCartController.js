app.controller("shopCartController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$state', '$window', '$stateParams', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $state, $window, $stateParams, $filter) {
    var shopCart = this;
    shopCart.showInfoMember = false;
    shopCart.showInfoUser = false;
    if (itemRecordStatus != undefined) shopCart.itemRecordStatus = itemRecordStatus;

    shopCart.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    shopCart.selectedShopNoPayment = {
        PaymentInvoseSale: $stateParams.PaymentInvoseSale
    };
    shopCart.showInvoiceSaleDetail = false;
    var date = moment().format();
    shopCart.RegisterDate = {
        defaultDate: date
    };
    shopCart.DeliveryDate = {
        defaultDate: date
    };

    shopCart.selectionChanged = function (item) {
        shopCart.selectedItemSaleDetail.Fee = item.Price;
    };
    shopCart.selectionChangedUser = function (item) {
        ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/GetOne', shopCart.selectedItem.LinkCmsUserId, 'GET').success(function (response2) {
            shopCart.selectedItem.ReceiverName = response2.Item.Name;
            shopCart.selectedItem.ReceiverLastName = response2.Item.LastName;
            shopCart.selectedItem.ReceiverMobile = response2.Item.Mobile;
            shopCart.selectedItem.ReceiverTel = response2.Item.Tell;
            shopCart.selectedItem.ReceiverCity = response2.Item.LinkLocationId;
            shopCart.selectedItem.ReceiverPostalCode = response2.Item.PostalCode;
            shopCart.selectedItem.ReceiverAddress = response2.Item.Address;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    //#Help سلکتور برای انتخاب کالا
    shopCart.LinkContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkContentId',
        url: 'ShopContent',
        onSelectionChanged: shopCart.selectionChanged,
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'LinkContentId',
        rowPerPage: 200,
        scope: shopCart,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
            ]
        }
    }
    //#Help سلکتور برای انتخاب کاربر
    shopCart.LinkCmsUserIdSelector = {
        displayMember: 'Username',
        id: 'Id',
        fId: 'LinkCmsUserId',
        url: 'coreuser',
        sortColumn: 'Id',
        onSelectionChanged: shopCart.selectionChangedUser,
        sortType: 0,
        filterText: 'LinkCmsUserId',
        rowPerPage: 200,
        scope: shopCart,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Username', displayName: 'Username', sortable: true, type: 'string', visible: true },
            ]
        }
    }


    //Shop Grid Options
    shopCart.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkCmsUserId', displayName: 'کد سیستمی کاربر', sortable: true, type: 'integer', visible: true },

            { name: 'CreatedDate', displayName: 'ایجاد', sortable: true, type: 'string', isDate: true, visible: true },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, type: 'string', isDate: true, visible: true },
            { name: 'CloseDate', displayName: 'بستن', sortable: true, type: 'string', isDate: true, visible: true },

            { name: 'TotalTax', displayName: 'مالیات', sortable: true, type: 'integer', visible: true },
            { name: 'TotalAmount', displayName: 'مبلغ', sortable: true, type: 'integer', visible: true },

            { name: 'InvoiceStatus', displayName: 'وضعیت ', sortable: true, type: 'string', visible: true },
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
    shopCart.gridOptionIvoceSaleDetail = {
        columns: [
            { name: 'Content.Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'Content.MainImageSrc', displayName: 'عکس', sortable: true, type: 'integer', visible: 'true' },
            { name: 'Content.Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'Quantity', displayName: 'تعداد', sortable: true, type: 'string', visible: 'true' },
            { name: 'Price', displayName: 'قیمت واحد', sortable: true, type: 'integer', visible: 'true' },
            { name: 'SumRow', displayName: 'جمع کل', sortable: true, type: 'integer', visible: 'true' }
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
    shopCart.addMenu = function () {
        $modal.open({
            templateUrl: "cpanelv1/ModuleShop/shopCart/modalMenu.html",
            scope: $scope
        });
    }
    //init Function
    shopCart.init = function () {
        shopCart.addRequested = true;
        shopCart.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"shopCart/GetAllPaymentStatus", {}, 'POST').success(function (response) {
            shopCart.PaymentStatus = response.ListItems;

        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"shopCart/GetAllInvoiceStatus", {}, 'POST').success(function (response) {
            shopCart.InvoiceStatus = response.ListItems;
            shopCart.setInvoiceStatusEnum(shopCart.ListItems, shopCart.InvoiceStatus);
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        if (shopCart.selectedShopNoPayment.PaymentInvoseSale == false) {
            shopCart.gridOptions.advancedSearchData.engine = {
                Filters: [{
                    PropertyName: "PaymentStatus",
                    EnumValue1: "WithoutPayment",
                    SearchType: 0,
                }]
            };
        }
        ajax.call(cmsServerConfig.configApiServerPath+"shopCart/getall", shopCart.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopCart.ListItems = response.ListItems;
            shopCart.gridOptions.fillData(shopCart.ListItems, response.resultAccess);
            shopCart.setPaymentStatusEnum(shopCart.ListItems, shopCart.PaymentStatus); // Sending Access as an argument
            shopCart.addRequested = false;
            shopCart.busyIndicator.isActive = false;
            shopCart.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopCart.gridOptions.totalRowCount = response.TotalRowCount;
            shopCart.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            shopCart.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            shopCart.busyIndicator.isActive = false;
        });
    };
    shopCart.setPaymentStatusEnum = function (listItems, enumList) {
        angular.forEach(listItems, function (item, property) {
            angular.forEach(enumList, function (value, key) {
                if (item.PaymentStatus == value.Value)
                    item.PaymentStatusTitle = value.Description;
            });
        });
    }

    shopCart.printDiv = function (divName) {
        var printContents = document.getElementById(divName).innerHTML;
        var originalContents = document.body.innerHTML;

        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
            var popupWin = window.open('', '_blank', 'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWin.window.focus();
            popupWin.document.write('<!DOCTYPE html><html><head>' +
                '<link rel="stylesheet" type="text/css" href="style.css" />' +
                '<link href="cpanelv1/ModuleShop/shopCart/print.css" rel="stylesheet" />' +
                '</head><body onload="window.print()"><div class="reward-body">' + printContents + '</div></html>');
            popupWin.onbeforeunload = function (event) {
                popupWin.close();
                return '.\n';
            };
            popupWin.onabort = function (event) {
                popupWin.document.close();
                popupWin.close();
            }
        } else {
            var popupWin = window.open('', '_blank', 'width=800,height=600');
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</html>');
            popupWin.document.close();
        }
        popupWin.document.close();

        return true;
    }

    shopCart.setInvoiceStatusEnum = function (listItems, enumList) {
        angular.forEach(listItems, function (item, property) {
            angular.forEach(enumList, function (value, key) {
                if (item.InvoiceStatus == value.Value)
                    item.InvoiceStatusTitle = value.Description;
            });
        });
    }
    shopCart.gridOptions.onRowSelected = function () {
        var item = shopCart.gridOptions.selectedRow.item;
    }
    shopCart.gridOptionIvoceSaleDetail.onRowSelected = function () {
        var item = shopCart.gridOptionIvoceSaleDetail.selectedRow.item;
    }
    //Show Content with Category Id
    shopCart.selectContent = function (node) {
        shopCart.busyIndicator.message = "در حال بارگذاری " + node.Title;
        shopCart.busyIndicator.isActive = true;

        shopCart.gridOptions.advancedSearchData.engine.Filters = null;
        shopCart.gridOptions.advancedSearchData.engine.Filters = [];
        shopCart.attachedFiles = [];
        var s = {
            PropertyName: "LinkCategoryId",
            IntValue1: node.Id,
            SearchType: 0
        }
        shopCart.gridOptions.advancedSearchData.engine.Filters.push(s);

        ajax.call(cmsServerConfig.configApiServerPath+"shopCart/getAll", shopCart.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopCart.busyIndicator.isActive = false;
            shopCart.ListItems = response.ListItems;
            shopCart.gridOptions.fillData(shopCart.ListItems, response.resultAccess); // Sending Access as an argument
            shopCart.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopCart.gridOptions.totalRowCount = response.TotalRowCount;
            shopCart.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            shopCart.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    shopCart.addNewContentModel = function () {
        if (shopCart.addRequested) { return };
        shopCart.addRequested = true;
        shopCart.modalTitle = 'اضافه کردن محتوای جدید';
        ajax.call(cmsServerConfig.configApiServerPath+'shopCart/GetViewModel', "", 'GET').success(function (response) {
            shopCart.addRequested = false;
            rashaErManage.checkAction(response);
            shopCart.selectedItem = response.Item;

            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/shopCart/addInvoiceByItem.html',
                scope: $scope,
                size: 'lg'
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    shopCart.openEditModel = function () {
        //        if (shopCart.addRequested) { return };
        shopCart.addRequested = false;
        shopCart.modalTitle = 'ویرایش';
        if (!shopCart.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'shopCart/GetOne', shopCart.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            shopCart.selectedItem = response1.Item;
            if (shopCart.selectedItem.LinkCmsUserId > 0) {
                ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/GetOne', shopCart.selectedItem.LinkCmsUserId, 'GET').success(function (response2) {
                    shopCart.selectedUser = response2.Item;
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
                shopCart.showInfoMember = false;
                shopCart.showInfoUser = true;
            }

            shopCart.loadivocesaledetail();
            //shopCart.registerDate.defaultDate = shopCart.selectedItem.RegisterDate;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/shopCart/editInvoiceByItem.html',
                scope: $scope,
                size: 'lg'
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    shopCart.addNewContent = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopCart.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopCart/add', shopCart.selectedItem, 'POST').success(function (response) {
            //rashaErManage.checkAction(response);
            shopCart.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                shopCart.selectedItem = response.Item;
                shopCart.ListItems.unshift(response.Item);
                shopCart.gridOptions.fillData(shopCart.ListItems);
                shopCart.setPaymentStatusEnum(shopCart.ListItems, shopCart.PaymentStatus);
                shopCart.setInvoiceStatusEnum(shopCart.ListItems, shopCart.InvoiceStatus);

                shopCart.showInvoiceSaleDetail = true;
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopCart.addRequested = false;

            shopCart.busyIndicator.isActive = false;

        });
    }

    //Edit Content
    shopCart.editContent = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopCart.busyIndicator.isActive = true;
        shopCart.addRequested = true;

        ajax.call(cmsServerConfig.configApiServerPath+'shopCart/edit', shopCart.selectedItem, 'PUT').success(function (response) {
            shopCart.busyIndicator.isActive = false;
            shopCart.addRequested = false;
            shopCart.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopCart.replaceItem(shopCart.selectedItem.Id, response.Item);
                shopCart.gridOptions.fillData(shopCart.ListItems);
                shopCart.setPaymentStatusEnum(shopCart.ListItems, shopCart.PaymentStatus);
                shopCart.setInvoiceStatusEnum(shopCart.ListItems, shopCart.InvoiceStatus);

                shopCart.showInvoiceSaleDetail = true;
                // shopCart.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopCart.addRequested = false;
            shopCart.busyIndicator.isActive = false;
        });
    }

    // Delete a Shop Content 
    shopCart.deleteContent = function () {
        if (!shopCart.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                shopCart.busyIndicator.isActive = true;
                shopCart.showbusy = true;
                shopCart.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+"shopCart/GetOne", shopCart.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    shopCart.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+"shopCart/delete", shopCart.selectedItemForDelete, 'POST').success(function (res) {
                        shopCart.busyIndicator.isActive = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            shopCart.replaceItem(shopCart.selectedItemForDelete.Id);
                            shopCart.gridOptions.fillData(shopCart.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        shopCart.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    shopCart.busyIndicator.isActive = false;
                });
            }
        });
    }

    //Replace Item OnDelete/OnEdit Grid Options
    shopCart.replaceItem = function (oldId, newItem) {
        angular.forEach(shopCart.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = shopCart.ListItems.indexOf(item);
                shopCart.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            shopCart.ListItems.unshift(newItem);
    }

    shopCart.searchData = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"shopCart/getall", shopCart.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            shopCart.busyIndicator.isActive = false;
            shopCart.ListItems = response.ListItems;
            shopCart.gridOptions.fillData(shopCart.ListItems);
            shopCart.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopCart.gridOptions.totalRowCount = response.TotalRowCount;
            shopCart.gridOptions.rowPerPage = response.RowPerPage;
            shopCart.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            shopCart.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    shopCart.addRequested = false;
    shopCart.closeModal = function () {
        $modalStack.dismissAll();
    };

    shopCart.showIsBusy = false;


    //For reInit Categories
    shopCart.gridOptions.reGetAll = function () {
        if (shopCart.gridOptions.advancedSearchData.engine.Filters.length > 0) shopCart.searchData();
        else shopCart.init();
    };

    //#help/لود شدن اقلام فاکتور
    shopCart.gridOptionIvoceSaleDetail.reGetAll = function () {

        shopCart.loadivocesaledetail();
    };


    shopCart.addRequested = true;

    shopCart.columnCheckbox = false;

    shopCart.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = shopCart.gridOptions.columns;
        if (shopCart.gridOptions.columnCheckbox) {
            for (var i = 0; i < shopCart.gridOptions.columns.length; i++) {
                //shopCart.gridOptions.columns[i].visible = $("#" + shopCart.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + shopCart.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                shopCart.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < shopCart.gridOptions.columns.length; i++) {
                var element = $("#" + shopCart.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + shopCart.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < shopCart.gridOptions.columns.length; i++) {
            console.log(shopCart.gridOptions.columns[i].name.concat(".visible: "), shopCart.gridOptions.columns[i].visible);
        }
        shopCart.gridOptions.columnCheckbox = !shopCart.gridOptions.columnCheckbox;
    }

    shopCart.BankPaymentTransactionSuccessfulId = function (LinktransactionId) {
        $state.go("index.bankpaymenttransc", {
            transactionId: LinktransactionId
        });
    }

    shopCart.openPaymentonlocationModel = function (invoiceId) {
        ajax.call(cmsServerConfig.configApiServerPath+'shopCart/GetOne', invoiceId, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            shopCart.selectedItem = response.Item;
            shopCart.selectedItem.PaymentStatus = 2;
            ajax.call(cmsServerConfig.configApiServerPath+'shopCart/edit', shopCart.selectedItem, 'PUT').success(function (response) {
                rashaErManage.showMessage("پرداخت در محل");
                shopCart.init();
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                shopCart.busyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopCart.busyIndicator.isActive = false;
        });
    }

    shopCart.openPaymentModel = function (invoiceId) {
        ajax.call(cmsServerConfig.configApiServerPath+'shopCart/GetOne', invoiceId, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            shopCart.selectedItem = response.Item;
            if (shopCart.selectedItem.InvoiceStatus == 1) // فاکتور باز است
            {
                var angularUrl = $state.current.ncyBreadcrumbLink;
                shopCart.TransactionPaymentMakerClass = { PaymentPrivateId: 0, Price: 0, LastUrlAddressInUse: angularUrl, InvoiceId: invoiceId };
                shopCart.addRequested = true;
                shopCart.busyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath+"bankpaymentprivatesiteconfig/GetAllAvailable", shopCart.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
                    rashaErManage.checkAction(response);
                    shopCart.privateSiteConfigListItems = response.ListItems;
                    ajax.call(cmsServerConfig.configApiServerPath+"shopCart/GetOne", invoiceId, "GET").success(function (response) {
                        shopCart.addRequested = false;
                        shopCart.TransactionPaymentMakerClass.Price = response.Item.TotalAmount;
                        angular.forEach(shopCart.privateSiteConfigListItems, function (value, key) {
                            if (value.virtual_PublicConfig.LinkModuleFileLogoId != null)
                                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: value.virtual_PublicConfig.LinkModuleFileLogoId, name: null }, "POST").success(function (response) {
                                    var position = response.lastIndexOf(".");
                                    var output = [response.slice(0, position), "thumbnailimage", response.slice(position)].join('');
                                    value.logoUrl = window.location.origin + output;
                                    if (key == 0) {
                                        shopCart.addRequested = false;
                                        shopCart.busyIndicator.isActive = false;
                                        $modal.open({
                                            templateUrl: 'cpanelv1/ModuleShop/shopCart/payment.html',
                                            scope: $scope
                                        });
                                    }
                                }).error(function (data, errCode, c, d) {
                                    rashaErManage.checkAction(data, errCode);
                                    shopCart.busyIndicator.isActive = false;
                                });
                        });
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                        shopCart.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    shopCart.gridOptions.fillData();
                    rashaErManage.checkAction(data, errCode);
                });
            }
            else {
                rashaErManage.showMessage("این فاکتور قبلاً تسویه شده است!");
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });

    }
    //ngautocomplete
    shopCart.cmsUsersListItems = [];
    shopCart.inputUserChanged = function (input) {
        var engine = { Filters: [] };
        engine.Filters.push({ PropertyName: "Name", SearchType: 5, StringValue1: input, ClauseType: 1 });
        engine.Filters.push({ PropertyName: "LastName", SearchType: 5, StringValue1: input, ClauseType: 1 });
        ajax.call(cmsServerConfig.configApiServerPath+"CoreUser/search", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopCart.cmsUsersListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //ngautocomplete
    shopCart.userSelected = function (selected) {
        if (selected) {
            shopCart.selectedItem.LinkCmsUserId = selected.originalObject.Id;
        } else {
            shopCart.selectedItem.LinkCmsUserId = null;
        }
    }

    shopCart.invoicePay = function (index) {

        shopCart.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+"BankPaymentPrivateSiteConfig/GoToBankPaymentWebSite", shopCart.TransactionPaymentMakerClass, 'POST').success(function (response) {
            shopCart.addRequested = false;
            shopCart.paymentResponse = response;
            rashaErManage.showMessage(shopCart.paymentResponse.ErrorMessage);
        }).error(function (data, errCode, c, d) {
            shopCart.addRequested = false;
            rashaErManage.checkAction(data, errCode);
        });
    }
    shopCart.onPrivateConfigChange = function (index) {
        shopCart.TransactionPaymentMakerClass.PaymentPrivateId = shopCart.privateSiteConfigListItems[index].Id;
    }


    //کدهای مربوط به اقلام


    shopCart.close = function () {
        $("#modalinvocesaledetail").hide();
    };


    //#Help کد مربوط به لود گیرید اقلام فاکتور
    shopCart.loadivocesaledetail = function () {

        ajax.call(cmsServerConfig.configApiServerPath+"shopCart/GetOne", shopCart.selectedItem.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            shopCart.gridOptionIvoceSaleDetail.ListItems = response.Item.CartDetails;
            shopCart.gridOptionIvoceSaleDetail.resultAccess = response.resultAccess;
            shopCart.gridOptionIvoceSaleDetail.fillData(shopCart.gridOptionIvoceSaleDetail.ListItems);

        }).error(function (data, errCode, c, d) {
            //shopCartDetail.gridOptionIvoceSaleDetail.fillData();
            rashaErManage.checkAction(data, errCode);

        });
    };
    //#Help کد بازشدن فرم اضافه اقلام فاکتور
    // Open Add New Content Model
    shopCart.openAddModalSaleDetail = function () {
        shopCart.addRequested = true;
        shopCart.modalTitle = 'ردیف جدید';
        ajax.call(cmsServerConfig.configApiServerPath+'shopCartdetail/GetViewModel', "", 'GET').success(function (response) {
            shopCart.addRequested = false;
            rashaErManage.checkAction(response);
            shopCart.selectedItemSaleDetail = response.Item;
            shopCart.selectedItemSaleDetail.LinkInvoiceSaleId = shopCart.selectedItem.Id;
            //shopCart.selectedItemSaleDetail.Fee=shopCart.LinkContentIdSelector.selectedItem;
            //shopCart.selectedItem.LinkInvoiceSaleId = $stateParams.invoiceId;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/shopCart/addInvoiceSaleDetail.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //#Help کد تشخیص تکراری بودن اقلام
    //shopCartDetail.contentExists = function (item) {
    //    for (var i = 0; i < shopCartDetail.ListItems.length; i++) {
    //        if (shopCartDetail.ListItems[i].LinkContentId == item.LinkContentId)
    //            return true;
    //    }
    //    return false;
    //}
    //#Help کد ثبت اقلام برای فاکتور مورد نظر
    // Add New Content
    shopCart.addNewContentsaledetail = function (frm) {

        //if (!shopCart.contentExists(shopCart.selectedItemSaleDetail)) {
        shopCart.addRequested = true;
        shopCart.selectedItemSaleDetail.LinkContentId = shopCart.selectedItem.LinkContentId;
        ajax.call(cmsServerConfig.configApiServerPath+'shopCartDetail/add', shopCart.selectedItemSaleDetail, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopCart.addRequested = false;

            if (response.IsSuccess) {
                //shopCartDetail.ListItems.unshift(response.Item);
                //shopCart.closeModal();
                shopCart.gridOptionIvoceSaleDetail.reGetAll();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopCart.addRequested = false;

        });
        //    } else
        //        rashaErManage.showMessage("این کالا قبلاً اضافه شده است!");
    }



    //#Help کد بازشدن فرم ویرایش اقلام فاکتور
    // Open Edit Content Modal
    shopCart.openEditModelSaleDetail = function () {
        shopCart.modalTitle = 'ویرایش';
        if (!shopCart.gridOptionIvoceSaleDetail.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        shopCart.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopCartDetail/GetOne', shopCart.gridOptionIvoceSaleDetail.selectedRow.item.Id, 'GET').success(function (response) {
            shopCart.addRequested = false;
            rashaErManage.checkAction(response);
            shopCart.selectedItemSaleDetail = response.Item;
            shopCart.selectedItemSaleDetail.LinkInvoiceSaleId = shopCart.selectedItem.Id;

            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/shopCart/editInvoiceSaleDetail.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //#Help کد ویرایش اقلام برای فاکتور مورد نظر
    //Edit Content
    shopCart.EditNewContentsaledetail = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopCart.addRequested = true;
        shopCart.selectedItemSaleDetail.LinkContentId = shopCart.selectedItem.LinkContentId;
        ajax.call(cmsServerConfig.configApiServerPath+'shopCartDetail/edit', shopCart.selectedItemSaleDetail, 'PUT').success(function (response) {
            shopCart.addRequested = false;

            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopCart.replaceItem(shopCart.selectedItemSaleDetail.Id, response.Item);

                //shopCart.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopCart.addRequested = false;

        });
    }
    // Delete a Product Content 
    shopCart.deleteContentSaleDetail = function () {
        if (buttonIsPressed) return;
        if (!shopCart.gridOptionIvoceSaleDetail.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {

                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"shopCartDetail/GetOne", shopCart.gridOptionIvoceSaleDetail.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    shopCart.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+"shopCartDetail/delete", shopCart.selectedItemForDelete, 'POST').success(function (res) {

                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            shopCart.replaceItem(shopCart.selectedItemForDelete.Id);
                        }
                        shopCart.loadivocesaledetail();
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);


                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);


                });
            }
        });
    }

    //#Help کد گزارش گیری از اقلام
    //Export Report 
    shopCart.exportFile = function () {
        shopCart.addRequested = true;
        shopCart.gridOptionIvoceSaleDetail.advancedSearchData.engine.ExportFile = shopCart.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'shopCartDetail/exportfile', shopCart.gridOptionIvoceSaleDetail.advancedSearchData.engine, 'POST').success(function (response) {
            shopCart.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopCart.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //shopCart.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    shopCart.toggleExportForm = function () {
        shopCart.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        shopCart.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        shopCart.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        shopCart.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        shopCart.exportDownloadLink = null;
        shopCart.addRequested = false;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleShop/shopCart/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    shopCart.rowCountChanged = function () {
        if (!angular.isDefined(shopCart.ExportFileClass.RowCount) || shopCart.ExportFileClass.RowCount > 5000)
            shopCart.ExportFileClass.RowCount = 5000;
    }
    //#Help کد تعداد اقلام
    //Get TotalRowCount
    shopCart.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"shopCartDetail/count", shopCart.gridOptionIvoceSaleDetail.advancedSearchData.engine, 'POST').success(function (response) {
            shopCart.addRequested = false;
            rashaErManage.checkAction(response);
            shopCart.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            shopCart.gridOptionIvoceSaleDetail.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);