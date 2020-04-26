app.controller("shopInvoiceSaleController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$state', '$window','$stateParams', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $state, $window,$stateParams, $filter) {
    var shopInvoiceSale = this;
    shopInvoiceSale.showInfoMember = false;
    shopInvoiceSale.showInfoUser = false;
    if (itemRecordStatus != undefined) shopInvoiceSale.itemRecordStatus = itemRecordStatus;

    shopInvoiceSale.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    shopInvoiceSale.selectedShopNoPayment = {
        PaymentInvoseSale: $stateParams.PaymentInvoseSale
    };
    shopInvoiceSale.showInvoiceSaleDetail = false;
    var date = moment().format();
    shopInvoiceSale.RegisterDate = {
        defaultDate: date
    };
    shopInvoiceSale.DeliveryDate = {
        defaultDate: date
    };

    shopInvoiceSale.selectionChanged = function (item) {
        shopInvoiceSale.selectedItemSaleDetail.Fee = item.Price;
    };
    shopInvoiceSale.selectionChangedUser = function (item) {
        ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/GetOne', shopInvoiceSale.selectedItem.LinkCmsUserId, 'GET').success(function (response2) {
            shopInvoiceSale.selectedItem.ReceiverName = response2.Item.Name;
            shopInvoiceSale.selectedItem.ReceiverLastName = response2.Item.LastName;
            shopInvoiceSale.selectedItem.ReceiverMobile = response2.Item.Mobile;
            shopInvoiceSale.selectedItem.ReceiverTel = response2.Item.Tell;
            shopInvoiceSale.selectedItem.ReceiverCity = response2.Item.LinkLocationId;
            shopInvoiceSale.selectedItem.ReceiverPostalCode = response2.Item.PostalCode;
            shopInvoiceSale.selectedItem.ReceiverAddress = response2.Item.Address;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    //shopInvoiceSale.selectionChangedMember = function (item) {
    //    if (shopInvoiceSale.selectedItem.LinkMemberUserId > 0)
    //        ajax.call(cmsServerConfig.configApiServerPath+'Memberuser/GetOne', shopInvoiceSale.selectedItem.LinkMemberUserId, 'GET').success(function (response2) {
    //            shopInvoiceSale.selectedItem.ReceiverName = response2.Item.FirstName;
    //            shopInvoiceSale.selectedItem.ReceiverLastName = response2.Item.LastName;
    //            shopInvoiceSale.selectedItem.ReceiverMobile = response2.Item.MobileNo;
    //            shopInvoiceSale.selectedItem.ReceiverTel = response2.Item.PhoneNo;
    //            shopInvoiceSale.selectedItem.ReceiverAddress = response2.Item.Address;
    //        }).error(function (data, errCode, c, d) {
    //            rashaErManage.checkAction(data, errCode);
    //        });
    //};
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    //#Help سلکتور برای انتخاب کالا
    shopInvoiceSale.LinkContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkContentId',
        url: 'ShopContent',
        onSelectionChanged: shopInvoiceSale.selectionChanged,
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'LinkContentId',
        rowPerPage: 200,
        scope: shopInvoiceSale,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
            ]
        }
    }
    //#Help سلکتور برای انتخاب کاربر
    shopInvoiceSale.LinkCmsUserIdSelector = {
        displayMember: 'Username',
        id: 'Id',
        fId: 'LinkCmsUserId',
        url: 'coreuser',
        sortColumn: 'Id',
        onSelectionChanged: shopInvoiceSale.selectionChangedUser,
        sortType: 0,
        filterText: 'LinkCmsUserId',
        rowPerPage: 200,
        scope: shopInvoiceSale,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Username', displayName: 'Username', sortable: true, type: 'string', visible: true },
            ]
        }
    }
    //#Help سلکتور برای انتخاب عضو
    //shopInvoiceSale.LinkMemberUserIdSelector = {
    //    displayMember: 'FirstName,LastName',
    //    id: 'Id',
    //    fId: 'LinkMemberUserId',
    //    url: 'Memberuser',
    //    sortColumn: 'Id',
    //    onSelectionChanged: shopInvoiceSale.selectionChangedMember,
    //    sortType: 0,
    //    filterText: 'LinkMemberUserId',
    //    rowPerPage: 200,
    //    scope: shopInvoiceSale,
    //    columnOptions: {
    //        columns: [
    //            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
    //            { name: 'FirstName', displayName: 'FirstName', sortable: true, type: 'string', visible: true },
    //            { name: 'LastName', displayName: 'LastName', sortable: true, type: 'string', visible: true },
    //        ]
    //    }
    //}
    //Shop Grid Options
    shopInvoiceSale.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'RegisterDate', displayName: 'تاریخ فاکتور', sortable: true, type: 'string', isDate: true, visible: true },
            { name: 'TotalAmount', displayName: 'مبلغ', sortable: true, type: 'string', visible: true },
            { name: 'LinkCmsUserId', displayName: 'کد سیستمی کاربر', sortable: true, type: 'integer', visible: true },
            { name: 'InvoiceStatusTitle', displayName: 'وضعیت فاکتور', sortable: true, type: 'string', visible: true },
            { name: 'PaymentStatusTitle', displayName: 'وضعیت پرداخت', sortable: true, type: 'string', visible: true },
            { name: "ActionKey", displayName: "پرداخت آنلاین", displayForce: true, template: '<button ng-if="!x.IsActivated && (x.PaymentStatus==0 )" ng-click="shopInvoiceSale.openPaymentModel(x.Id)"class="btn btn-info" style="margin-left: 2px;"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>' },
            { name: "ActionKey", displayName: "پرداخت در محل", displayForce: true, template: '<button ng-if="!x.IsActivated && x.PaymentStatus==0" ng-click="shopInvoiceSale.openPaymentonlocationModel(x.Id)"class="btn btn-info" style="margin-left: 2px;"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>' },
            { name: "ActionKey", displayName: "کد پرداخت", displayForce: true,template: '<button ng-if="x.LinkModelBankPaymentTransactionSuccessfulId!=null && x.LinkModelBankPaymentTransactionSuccessfulId!=0" ng-click="shopInvoiceSale.BankPaymentTransactionSuccessfulId(x.LinkModelBankPaymentTransactionSuccessfulId)"class="btn btn-info" style="margin-left: 2px;">{{x.LinkModelBankPaymentTransactionSuccessfulId}}</button>' }, 
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
    shopInvoiceSale.gridOptionIvoceSaleDetail = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'MainImageSrc', displayName: 'عکس', sortable: true, type: 'integer', visible: 'true' },
            { name: 'virtual_Content.Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'Quantity', displayName: 'تعداد', sortable: true, type: 'string', visible: 'true' },
            { name: 'Fee', displayName: 'قیمت واحد', sortable: true, type: 'integer', visible: 'true' },
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
    shopInvoiceSale.addMenu = function () {
        $modal.open({
            templateUrl: "cpanelv1/ModuleShop/shopInvoiceSale/modalMenu.html",
            scope: $scope
        });
    }
    //init Function
    shopInvoiceSale.init = function () {
        shopInvoiceSale.addRequested = true;
        shopInvoiceSale.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"shopinvoicesale/GetAllPaymentStatus", {}, 'POST').success(function (response) {
            shopInvoiceSale.PaymentStatus = response.ListItems;
            
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"shopinvoicesale/GetAllInvoiceStatus", {}, 'POST').success(function (response) {
            shopInvoiceSale.InvoiceStatus = response.ListItems;
            shopInvoiceSale.setInvoiceStatusEnum(shopInvoiceSale.ListItems, shopInvoiceSale.InvoiceStatus);
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        if (shopInvoiceSale.selectedShopNoPayment.PaymentInvoseSale == false) {
            shopInvoiceSale.gridOptions.advancedSearchData.engine = {
                Filters: [{
                        PropertyName: "PaymentStatus",
                        EnumValue1: "WithoutPayment",
                        SearchType: 0,
                }]
            };
        }
        ajax.call(cmsServerConfig.configApiServerPath+"shopinvoicesale/getall", shopInvoiceSale.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopInvoiceSale.ListItems = response.ListItems;
            shopInvoiceSale.gridOptions.fillData(shopInvoiceSale.ListItems, response.resultAccess);
            shopInvoiceSale.setPaymentStatusEnum(shopInvoiceSale.ListItems, shopInvoiceSale.PaymentStatus); // Sending Access as an argument
            shopInvoiceSale.addRequested = false;
            shopInvoiceSale.busyIndicator.isActive = false;
            shopInvoiceSale.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopInvoiceSale.gridOptions.totalRowCount = response.TotalRowCount;
            shopInvoiceSale.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            shopInvoiceSale.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            shopInvoiceSale.busyIndicator.isActive = false;
        });
    };
    shopInvoiceSale.setPaymentStatusEnum = function (listItems, enumList) {
        angular.forEach(listItems, function (item, property) {
            angular.forEach(enumList, function (value, key) {
                if (item.PaymentStatus == value.Value)
                    item.PaymentStatusTitle = value.Description;
            });
        });
    }

shopInvoiceSale.printDiv = function(divName) {
   var printContents = document.getElementById(divName).innerHTML;
    var originalContents = document.body.innerHTML;      

    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        var popupWin = window.open('', '_blank', 'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        popupWin.window.focus();
        popupWin.document.write('<!DOCTYPE html><html><head>' +
            '<link rel="stylesheet" type="text/css" href="style.css" />' +
            '<link href="cpanelv1/ModuleShop/ShopInvoiceSale/print.css" rel="stylesheet" />'+
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

    shopInvoiceSale.setInvoiceStatusEnum = function (listItems, enumList) {
        angular.forEach(listItems, function (item, property) {
            angular.forEach(enumList, function (value, key) {
                if (item.InvoiceStatus == value.Value)
                    item.InvoiceStatusTitle = value.Description;
            });
        });
    }
    shopInvoiceSale.gridOptions.onRowSelected = function () {
        var item = shopInvoiceSale.gridOptions.selectedRow.item;
    }
    shopInvoiceSale.gridOptionIvoceSaleDetail.onRowSelected = function () {
        var item = shopInvoiceSale.gridOptionIvoceSaleDetail.selectedRow.item;
    }
    //Show Content with Category Id
    shopInvoiceSale.selectContent = function (node) {
        shopInvoiceSale.busyIndicator.message = "در حال بارگذاری " + node.Title;
        shopInvoiceSale.busyIndicator.isActive = true;

        shopInvoiceSale.gridOptions.advancedSearchData.engine.Filters = null;
        shopInvoiceSale.gridOptions.advancedSearchData.engine.Filters = [];
        shopInvoiceSale.attachedFiles = [];
        var s = {
            PropertyName: "LinkCategoryId",
            IntValue1: node.Id,
            SearchType: 0
        }
        shopInvoiceSale.gridOptions.advancedSearchData.engine.Filters.push(s);

        ajax.call(cmsServerConfig.configApiServerPath+"shopinvoicesale/getAll", shopInvoiceSale.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopInvoiceSale.busyIndicator.isActive = false;
            shopInvoiceSale.ListItems = response.ListItems;
            shopInvoiceSale.gridOptions.fillData(shopInvoiceSale.ListItems, response.resultAccess); // Sending Access as an argument
            shopInvoiceSale.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopInvoiceSale.gridOptions.totalRowCount = response.TotalRowCount;
            shopInvoiceSale.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            shopInvoiceSale.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    shopInvoiceSale.addNewContentModel = function () {
        if (shopInvoiceSale.addRequested) { return };
        shopInvoiceSale.addRequested = true;
        shopInvoiceSale.modalTitle = 'اضافه کردن محتوای جدید';
        ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSale/GetViewModel', "", 'GET').success(function (response) {
            shopInvoiceSale.addRequested = false;
            rashaErManage.checkAction(response);
            shopInvoiceSale.selectedItem = response.Item;

            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/ShopInvoiceSale/addInvoiceByItem.html',
                scope: $scope,
                size: 'lg'
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    shopInvoiceSale.openEditModel = function () {
        //        if (shopInvoiceSale.addRequested) { return };
        shopInvoiceSale.addRequested = false;
        shopInvoiceSale.modalTitle = 'ویرایش';
        if (!shopInvoiceSale.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSale/GetOne', shopInvoiceSale.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            shopInvoiceSale.selectedItem = response1.Item;
            if (shopInvoiceSale.selectedItem.LinkCmsUserId > 0) {
                ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/GetOne', shopInvoiceSale.selectedItem.LinkCmsUserId, 'GET').success(function (response2) {
                    shopInvoiceSale.selectedUser = response2.Item;
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
                shopInvoiceSale.showInfoMember = false;
                shopInvoiceSale.showInfoUser = true;
            }
            //if (shopInvoiceSale.selectedItem.LinkMemberUserId > 0) {
            //    ajax.call(cmsServerConfig.configApiServerPath+'Memberuser/GetOne', shopInvoiceSale.selectedItem.LinkMemberUserId, 'GET').success(function (response3) {
            //        shopInvoiceSale.selectedMember = response3.Item;
            //    }).error(function (data, errCode, c, d) {
            //        rashaErManage.checkAction(data, errCode);
            //    });
            //    shopInvoiceSale.showInfoUser = false;
            //    shopInvoiceSale.showInfoMember = true;
            //}
            shopInvoiceSale.loadivocesaledetail();
            //shopInvoiceSale.registerDate.defaultDate = shopInvoiceSale.selectedItem.RegisterDate;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/ShopInvoiceSale/editInvoiceByItem.html',
                scope: $scope,
                size: 'lg'
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    shopInvoiceSale.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopInvoiceSale.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSale/add', shopInvoiceSale.selectedItem, 'POST').success(function (response) {
            //rashaErManage.checkAction(response);
            shopInvoiceSale.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                shopInvoiceSale.selectedItem = response.Item;
                shopInvoiceSale.ListItems.unshift(response.Item);
                shopInvoiceSale.gridOptions.fillData(shopInvoiceSale.ListItems);
                shopInvoiceSale.setPaymentStatusEnum(shopInvoiceSale.ListItems, shopInvoiceSale.PaymentStatus);
                shopInvoiceSale.setInvoiceStatusEnum(shopInvoiceSale.ListItems, shopInvoiceSale.InvoiceStatus);

                shopInvoiceSale.showInvoiceSaleDetail = true;
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopInvoiceSale.addRequested = false;

            shopInvoiceSale.busyIndicator.isActive = false;

        });
    }

    //Edit Content
    shopInvoiceSale.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopInvoiceSale.busyIndicator.isActive = true;
        shopInvoiceSale.addRequested = true;

        ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSale/edit', shopInvoiceSale.selectedItem, 'PUT').success(function (response) {
            shopInvoiceSale.busyIndicator.isActive = false;
            shopInvoiceSale.addRequested = false;
            shopInvoiceSale.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopInvoiceSale.replaceItem(shopInvoiceSale.selectedItem.Id, response.Item);
                shopInvoiceSale.gridOptions.fillData(shopInvoiceSale.ListItems);
                shopInvoiceSale.setPaymentStatusEnum(shopInvoiceSale.ListItems, shopInvoiceSale.PaymentStatus);
                shopInvoiceSale.setInvoiceStatusEnum(shopInvoiceSale.ListItems, shopInvoiceSale.InvoiceStatus);

                shopInvoiceSale.showInvoiceSaleDetail = true;
                // shopInvoiceSale.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopInvoiceSale.addRequested = false;
            shopInvoiceSale.busyIndicator.isActive = false;
        });
    }

    // Delete a Shop Content 
    shopInvoiceSale.deleteContent = function () {
        if (!shopInvoiceSale.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                shopInvoiceSale.busyIndicator.isActive = true;
                shopInvoiceSale.showbusy = true;
                shopInvoiceSale.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+"shopinvoiceSale/GetOne", shopInvoiceSale.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    shopInvoiceSale.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+"shopInvoiceSale/delete", shopInvoiceSale.selectedItemForDelete, 'POST').success(function (res) {
                        shopInvoiceSale.busyIndicator.isActive = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            shopInvoiceSale.replaceItem(shopInvoiceSale.selectedItemForDelete.Id);
                            shopInvoiceSale.gridOptions.fillData(shopInvoiceSale.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        shopInvoiceSale.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    shopInvoiceSale.busyIndicator.isActive = false;
                });
            }
        });
    }

    //Replace Item OnDelete/OnEdit Grid Options
    shopInvoiceSale.replaceItem = function (oldId, newItem) {
        angular.forEach(shopInvoiceSale.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = shopInvoiceSale.ListItems.indexOf(item);
                shopInvoiceSale.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            shopInvoiceSale.ListItems.unshift(newItem);
    }

    shopInvoiceSale.searchData = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"shopInvoiceSale/getall", shopInvoiceSale.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            shopInvoiceSale.busyIndicator.isActive = false;
            shopInvoiceSale.ListItems = response.ListItems;
            shopInvoiceSale.gridOptions.fillData(shopInvoiceSale.ListItems);
            shopInvoiceSale.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopInvoiceSale.gridOptions.totalRowCount = response.TotalRowCount;
            shopInvoiceSale.gridOptions.rowPerPage = response.RowPerPage;
            shopInvoiceSale.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            shopInvoiceSale.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    shopInvoiceSale.addRequested = false;
    shopInvoiceSale.closeModal = function () {
        $modalStack.dismissAll();
    };

    shopInvoiceSale.showIsBusy = false;


    //For reInit Categories
    shopInvoiceSale.gridOptions.reGetAll = function () {
        if (shopInvoiceSale.gridOptions.advancedSearchData.engine.Filters.length > 0) shopInvoiceSale.searchData();
        else shopInvoiceSale.init();
    };

    //#help/لود شدن اقلام فاکتور
    shopInvoiceSale.gridOptionIvoceSaleDetail.reGetAll = function () {
        
         shopInvoiceSale.loadivocesaledetail();
    };


    shopInvoiceSale.addRequested = true;

    shopInvoiceSale.columnCheckbox = false;

    shopInvoiceSale.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = shopInvoiceSale.gridOptions.columns;
        if (shopInvoiceSale.gridOptions.columnCheckbox) {
            for (var i = 0; i < shopInvoiceSale.gridOptions.columns.length; i++) {
                //shopInvoiceSale.gridOptions.columns[i].visible = $("#" + shopInvoiceSale.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + shopInvoiceSale.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                shopInvoiceSale.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < shopInvoiceSale.gridOptions.columns.length; i++) {
                var element = $("#" + shopInvoiceSale.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + shopInvoiceSale.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < shopInvoiceSale.gridOptions.columns.length; i++) {
            console.log(shopInvoiceSale.gridOptions.columns[i].name.concat(".visible: "), shopInvoiceSale.gridOptions.columns[i].visible);
        }
        shopInvoiceSale.gridOptions.columnCheckbox = !shopInvoiceSale.gridOptions.columnCheckbox;
    }

    shopInvoiceSale.BankPaymentTransactionSuccessfulId = function (LinktransactionId) {
        $state.go("index.bankpaymenttransc", {
            transactionId: LinktransactionId
        });
    }

    shopInvoiceSale.openPaymentonlocationModel = function (invoiceId) {
        ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSale/GetOne', invoiceId, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            shopInvoiceSale.selectedItem = response.Item;
            shopInvoiceSale.selectedItem.PaymentStatus = 2;
            ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSale/edit', shopInvoiceSale.selectedItem, 'PUT').success(function (response) {
                rashaErManage.showMessage("پرداخت در محل");
                shopInvoiceSale.init();
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                shopInvoiceSale.busyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopInvoiceSale.busyIndicator.isActive = false;
        });
    }

    shopInvoiceSale.openPaymentModel = function (invoiceId) {
        ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSale/GetOne', invoiceId, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            shopInvoiceSale.selectedItem = response.Item;
            if (shopInvoiceSale.selectedItem.InvoiceStatus == 1) // فاکتور باز است
            {
                var angularUrl = $state.current.ncyBreadcrumbLink;
                shopInvoiceSale.TransactionPaymentMakerClass = { PaymentPrivateId: 0, Price: 0, LastUrlAddressInUse: angularUrl, InvoiceId: invoiceId };
                shopInvoiceSale.addRequested = true;
                shopInvoiceSale.busyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath+"bankpaymentprivatesiteconfig/GetAllAvailable", shopInvoiceSale.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
                    rashaErManage.checkAction(response);
                    shopInvoiceSale.privateSiteConfigListItems = response.ListItems;
                    ajax.call(cmsServerConfig.configApiServerPath+"shopinvoiceSale/GetOne", invoiceId, "GET").success(function (response) {
                        shopInvoiceSale.addRequested = false;
                        shopInvoiceSale.TransactionPaymentMakerClass.Price = response.Item.TotalAmount;
                        angular.forEach(shopInvoiceSale.privateSiteConfigListItems, function (value, key) {
                            if (value.virtual_PublicConfig.LinkModuleFileLogoId != null)
                                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: value.virtual_PublicConfig.LinkModuleFileLogoId, name: null }, "POST").success(function (response) {
                                    var position = response.lastIndexOf(".");
                                    var output = [response.slice(0, position), "thumbnailimage", response.slice(position)].join('');
                                    value.logoUrl = window.location.origin + output;
                                    if (key == 0) {
                                        shopInvoiceSale.addRequested = false;
                                        shopInvoiceSale.busyIndicator.isActive = false;
                                        $modal.open({
                                            templateUrl: 'cpanelv1/ModuleShop/ShopInvoiceSale/payment.html',
                                            scope: $scope
                                        });
                                    }
                                }).error(function (data, errCode, c, d) {
                                    rashaErManage.checkAction(data, errCode);
                                    shopInvoiceSale.busyIndicator.isActive = false;
                                });
                        });
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                        shopInvoiceSale.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    shopInvoiceSale.gridOptions.fillData();
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
    shopInvoiceSale.cmsUsersListItems = [];
    shopInvoiceSale.inputUserChanged = function (input) {
        var engine = { Filters: [] };
        engine.Filters.push({ PropertyName: "Name", SearchType: 5, StringValue1: input, ClauseType: 1 });
        engine.Filters.push({ PropertyName: "LastName", SearchType: 5, StringValue1: input, ClauseType: 1 });
        ajax.call(cmsServerConfig.configApiServerPath+"CoreUser/search", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopInvoiceSale.cmsUsersListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //ngautocomplete
    shopInvoiceSale.userSelected = function (selected) {
        if (selected) {
            shopInvoiceSale.selectedItem.LinkCmsUserId = selected.originalObject.Id;
        } else {
            shopInvoiceSale.selectedItem.LinkCmsUserId = null;
        }
    }

    shopInvoiceSale.invoicePay = function (index) {

        shopInvoiceSale.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+"BankPaymentPrivateSiteConfig/GoToBankPaymentWebSite", shopInvoiceSale.TransactionPaymentMakerClass, 'POST').success(function (response) {
            shopInvoiceSale.addRequested = false;
            shopInvoiceSale.paymentResponse = response;
            rashaErManage.showMessage(shopInvoiceSale.paymentResponse.ErrorMessage);
        }).error(function (data, errCode, c, d) {
            shopInvoiceSale.addRequested = false;
            rashaErManage.checkAction(data, errCode);
        });
    }
    shopInvoiceSale.onPrivateConfigChange = function (index) {
        shopInvoiceSale.TransactionPaymentMakerClass.PaymentPrivateId = shopInvoiceSale.privateSiteConfigListItems[index].Id;
    }


    //کدهای مربوط به اقلام


    shopInvoiceSale.close = function () {
        $("#modalinvocesaledetail").hide();
    };


    //#Help کد مربوط به لود گیرید اقلام فاکتور
    shopInvoiceSale.loadivocesaledetail = function () {
        shopInvoiceSale.gridOptionIvoceSaleDetail.advancedSearchData.engine.Filters = [];
        var filterDataModel = { PropertyName: "LinkInvoiceSaleId", SearchType: 0, IntValue1: shopInvoiceSale.selectedItem.Id };
        shopInvoiceSale.gridOptionIvoceSaleDetail.advancedSearchData.engine.Filters.push(filterDataModel);
        ajax.call(cmsServerConfig.configApiServerPath+"shopinvoicesaledetail/getall", shopInvoiceSale.gridOptionIvoceSaleDetail.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopInvoiceSale.gridOptionIvoceSaleDetail.ListItems = response.ListItems;
            shopInvoiceSale.gridOptionIvoceSaleDetail.resultAccess = response.resultAccess;
            shopInvoiceSale.gridOptionIvoceSaleDetail.fillData(shopInvoiceSale.gridOptionIvoceSaleDetail.ListItems);

        }).error(function (data, errCode, c, d) {
            //shopInvoiceSaleDetail.gridOptionIvoceSaleDetail.fillData();
            rashaErManage.checkAction(data, errCode);

        });
    };
    //#Help کد بازشدن فرم اضافه اقلام فاکتور
    // Open Add New Content Model
    shopInvoiceSale.openAddModalSaleDetail = function () {
        shopInvoiceSale.addRequested = true;
        shopInvoiceSale.modalTitle = 'ردیف جدید';
        ajax.call(cmsServerConfig.configApiServerPath+'shopInvoicesaledetail/GetViewModel', "", 'GET').success(function (response) {
            shopInvoiceSale.addRequested = false;
            rashaErManage.checkAction(response);
            shopInvoiceSale.selectedItemSaleDetail = response.Item;
            shopInvoiceSale.selectedItemSaleDetail.LinkInvoiceSaleId = shopInvoiceSale.selectedItem.Id;
            //shopInvoiceSale.selectedItemSaleDetail.Fee=shopInvoiceSale.LinkContentIdSelector.selectedItem;
            //shopInvoiceSale.selectedItem.LinkInvoiceSaleId = $stateParams.invoiceId;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/shopInvoiceSale/addInvoiceSaleDetail.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //#Help کد تشخیص تکراری بودن اقلام
    //shopInvoiceSaleDetail.contentExists = function (item) {
    //    for (var i = 0; i < shopInvoiceSaleDetail.ListItems.length; i++) {
    //        if (shopInvoiceSaleDetail.ListItems[i].LinkContentId == item.LinkContentId)
    //            return true;
    //    }
    //    return false;
    //}
    //#Help کد ثبت اقلام برای فاکتور مورد نظر
    // Add New Content
    shopInvoiceSale.addNewContentsaledetail = function (frm) {

        //if (!shopInvoiceSale.contentExists(shopInvoiceSale.selectedItemSaleDetail)) {
        shopInvoiceSale.addRequested = true;
        shopInvoiceSale.selectedItemSaleDetail.LinkContentId = shopInvoiceSale.selectedItem.LinkContentId;
        ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSaleDetail/add', shopInvoiceSale.selectedItemSaleDetail, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopInvoiceSale.addRequested = false;

            if (response.IsSuccess) {
                //shopInvoiceSaleDetail.ListItems.unshift(response.Item);
                //shopInvoiceSale.closeModal();
                shopInvoiceSale.gridOptionIvoceSaleDetail.reGetAll();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopInvoiceSale.addRequested = false;

        });
        //    } else
        //        rashaErManage.showMessage("این کالا قبلاً اضافه شده است!");
    }



    //#Help کد بازشدن فرم ویرایش اقلام فاکتور
    // Open Edit Content Modal
    shopInvoiceSale.openEditModelSaleDetail = function () {
        shopInvoiceSale.modalTitle = 'ویرایش';
        if (!shopInvoiceSale.gridOptionIvoceSaleDetail.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        shopInvoiceSale.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSaleDetail/GetOne', shopInvoiceSale.gridOptionIvoceSaleDetail.selectedRow.item.Id, 'GET').success(function (response) {
            shopInvoiceSale.addRequested = false;
            rashaErManage.checkAction(response);
            shopInvoiceSale.selectedItemSaleDetail = response.Item;
            shopInvoiceSale.selectedItemSaleDetail.LinkInvoiceSaleId = shopInvoiceSale.selectedItem.Id;

            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/shopInvoiceSale/editInvoiceSaleDetail.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //#Help کد ویرایش اقلام برای فاکتور مورد نظر
    //Edit Content
    shopInvoiceSale.EditNewContentsaledetail = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopInvoiceSale.addRequested = true;
        shopInvoiceSale.selectedItemSaleDetail.LinkContentId = shopInvoiceSale.selectedItem.LinkContentId;
        ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSaleDetail/edit', shopInvoiceSale.selectedItemSaleDetail, 'PUT').success(function (response) {
            shopInvoiceSale.addRequested = false;

            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopInvoiceSale.replaceItem(shopInvoiceSale.selectedItemSaleDetail.Id, response.Item);
               
                //shopInvoiceSale.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopInvoiceSale.addRequested = false;

        });
    }
    // Delete a Product Content 
    shopInvoiceSale.deleteContentSaleDetail = function () {
        if (buttonIsPressed) return;
        if (!shopInvoiceSale.gridOptionIvoceSaleDetail.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {

                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"shopInvoiceSaleDetail/GetOne", shopInvoiceSale.gridOptionIvoceSaleDetail.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    shopInvoiceSale.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+"shopInvoiceSaleDetail/delete", shopInvoiceSale.selectedItemForDelete, 'POST').success(function (res) {

                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            shopInvoiceSale.replaceItem(shopInvoiceSale.selectedItemForDelete.Id);
                        }
                        shopInvoiceSale.loadivocesaledetail();
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
    shopInvoiceSale.exportFile = function () {
        shopInvoiceSale.addRequested = true;
        shopInvoiceSale.gridOptionIvoceSaleDetail.advancedSearchData.engine.ExportFile = shopInvoiceSale.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSaleDetail/exportfile', shopInvoiceSale.gridOptionIvoceSaleDetail.advancedSearchData.engine, 'POST').success(function (response) {
            shopInvoiceSale.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopInvoiceSale.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //shopInvoiceSale.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    shopInvoiceSale.toggleExportForm = function () {
        shopInvoiceSale.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        shopInvoiceSale.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        shopInvoiceSale.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        shopInvoiceSale.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        shopInvoiceSale.exportDownloadLink = null;
        shopInvoiceSale.addRequested = false;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleShop/shopInvoiceSale/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    shopInvoiceSale.rowCountChanged = function () {
        if (!angular.isDefined(shopInvoiceSale.ExportFileClass.RowCount) || shopInvoiceSale.ExportFileClass.RowCount > 5000)
            shopInvoiceSale.ExportFileClass.RowCount = 5000;
    }
    //#Help کد تعداد اقلام
    //Get TotalRowCount
    shopInvoiceSale.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"shopInvoiceSaleDetail/count", shopInvoiceSale.gridOptionIvoceSaleDetail.advancedSearchData.engine, 'POST').success(function (response) {
            shopInvoiceSale.addRequested = false;
            rashaErManage.checkAction(response);
            shopInvoiceSale.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            shopInvoiceSale.gridOptionIvoceSaleDetail.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);