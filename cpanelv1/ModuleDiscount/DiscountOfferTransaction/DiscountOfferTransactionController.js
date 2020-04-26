app.controller("discountOfferTransactionController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var discountOfferTransaction = this;
    discountOfferTransaction.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    discountOfferTransaction.UninversalMenus = [];
    discountOfferTransaction.selectUniversalMenuOnUndetectableKey = true;

    if (itemRecordStatus != undefined) discountOfferTransaction.itemRecordStatus = itemRecordStatus;

    // Many To Many
    // MemberUserGroup  جدول واسط
    // LinkMemberUserId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    discountOfferTransaction.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها


    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        discountOfferTransaction.memberGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    discountOfferTransaction.hasInMany2Many = function (OtherTable) {
        if (discountOfferTransaction.selectedMemberUser == null || discountOfferTransaction.selectedMemberUser[thisTableFieldICollection] == undefined || discountOfferTransaction.selectedMemberUser[thisTableFieldICollection] == null) return false;
        return objectFindByKey(discountOfferTransaction.selectedMemberUser[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    };
    discountOfferTransaction.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (discountOfferTransaction.hasInMany2Many(OtherTable)) {
            //var index = discountOfferTransaction.selectedMemberUser[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(discountOfferTransaction.selectedMemberUser[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            discountOfferTransaction.selectedMemberUser[thisTableFieldICollection].splice(index, 1);
        } else {
            discountOfferTransaction.selectedMemberUser[thisTableFieldICollection].push(obj);
        }
    }
    // array = [{key:value},{key:value}]
    function objectFindByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                var obj = {};
                obj[key] = value;
                array[i] = obj;
                return true;
            }
        }
        return false;
    }

    // Find an object in an array of objects and return its index if object is found, -1 if not 
    function arrayObjectIndexOf(myArray, searchTerm, property) {
        for (var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i][property] === searchTerm) return i;
        }
        return -1;
    }
    // End of Many To Many ========================================================================

    discountOfferTransaction.init = function () {
        discountOfferTransaction.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = discountOfferTransaction.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        ajax.call(cmsServerConfig.configApiServerPath+"DiscountOfferTransaction/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            discountOfferTransaction.busyIndicator.isActive = false;
            discountOfferTransaction.ListItems = response.ListItems;
            ajax.call(cmsServerConfig.configApiServerPath+"DiscountOfferTransaction/getEnumDiscountOfferTransactionType", {}, 'POST').success(function (responseGetEnum) {
                discountOfferTransaction.DiscountOfferTransactionType = responseGetEnum;
                discountOfferTransaction.setEnumDiscountOfferTransactionType(discountOfferTransaction.ListItems, discountOfferTransaction.DiscountOfferTransactionType);
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
            discountOfferTransaction.gridOptions.fillData(discountOfferTransaction.ListItems, response.resultAccess);
            discountOfferTransaction.gridOptions.currentPageNumber = response.CurrentPageNumber;
            discountOfferTransaction.gridOptions.totalRowCount = response.TotalRowCount;
            discountOfferTransaction.gridOptions.rowPerPage = response.RowPerPage;
            discountOfferTransaction.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            discountOfferTransaction.busyIndicator.isActive = false;
            discountOfferTransaction.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    if (!angular.isDefined(discountOfferTransaction.CategoryListItemsSeller))
        ajax.call(cmsServerConfig.configApiServerPath+"DiscountSeller/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            discountOfferTransaction.CategoryListItemsSeller = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            });

    discountOfferTransaction.setEnumDiscountOfferTransactionType = function (listItems, enumList) {
        angular.forEach(listItems, function (item, property) {
            angular.forEach(enumList, function (value, key) {
                if (item.DiscountOfferTransactionType == value.Value)
                    item.TransactionTypeTitle = value.Description;
            });
        });
    }

    // Open Add Modal
    discountOfferTransaction.busyIndicator.isActive = true;
    discountOfferTransaction.addRequested = false;
    discountOfferTransaction.openAddModal = function () {
        discountOfferTransaction.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'DiscountOfferTransaction/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            discountOfferTransaction.busyIndicator.isActive = false;
            discountOfferTransaction.selectedItem = response.Item;
            if (discountOfferTransaction.CategoryListItemsSeller.length > 0)
                discountOfferTransaction.selectedItem.LinkSiteCategoryId = discountOfferTransaction.CategoryListItemsSeller[0].Id; // For auto selecting first SiteCategory option
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDiscount/DiscountOfferTransaction/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountOfferTransaction.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    discountOfferTransaction.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        discountOfferTransaction.busyIndicator.isActive = true;
        discountOfferTransaction.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'DiscountOfferTransaction/add', discountOfferTransaction.selectedItem, 'POST').success(function (response) {
            discountOfferTransaction.addRequested = false;
            discountOfferTransaction.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                discountOfferTransaction.gridOptions.advancedSearchData.engine.Filters = null;
                discountOfferTransaction.gridOptions.advancedSearchData.engine.Filters = [];
                discountOfferTransaction.ListItems.unshift(response.Item);
                discountOfferTransaction.gridOptions.fillData(discountOfferTransaction.ListItems);
                discountOfferTransaction.setEnumDiscountOfferTransactionType(discountOfferTransaction.ListItems, discountOfferTransaction.EnumDiscountOfferTransactionType);
                discountOfferTransaction.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountOfferTransaction.busyIndicator.isActive = false;
            discountOfferTransaction.addRequested = false;
        });
    }

    discountOfferTransaction.openEditModal = function () {

        discountOfferTransaction.modalTitle = 'ویرایش';
        if (!discountOfferTransaction.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'DiscountOfferTransaction/GetOne', discountOfferTransaction.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            discountOfferTransaction.selectedItem = response.Item;
            if (discountOfferTransaction
                .LinkUniversalMenuIdOnUndetectableKey >
                0) discountOfferTransaction.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDiscount/DiscountOfferTransaction/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    discountOfferTransaction.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        discountOfferTransaction.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'DiscountOfferTransaction/edit', discountOfferTransaction.selectedItem, 'PUT').success(function (response) {
            discountOfferTransaction.addRequested = true;
            rashaErManage.checkAction(response);
            discountOfferTransaction.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                discountOfferTransaction.addRequested = false;
                discountOfferTransaction.replaceItem(discountOfferTransaction.selectedItem.Id, response.Item);
                discountOfferTransaction.gridOptions.fillData(discountOfferTransaction.ListItems);
                discountOfferTransaction.setEnumDiscountOfferTransactionType(discountOfferTransaction.ListItems, discountOfferTransaction.EnumDiscountOfferTransactionType);
                discountOfferTransaction.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountOfferTransaction.addRequested = false;
            discountOfferTransaction.busyIndicator.isActive = false;
        });
    }

    discountOfferTransaction.closeModal = function () {
        $modalStack.dismissAll();
    };

    discountOfferTransaction.replaceItem = function (oldId, newItem) {
        angular.forEach(discountOfferTransaction.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = discountOfferTransaction.ListItems.indexOf(item);
                discountOfferTransaction.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            discountOfferTransaction.ListItems.unshift(newItem);
    }

    discountOfferTransaction.deleteRow = function () {
        if (!discountOfferTransaction.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                discountOfferTransaction.busyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath+'DiscountOfferTransaction/GetOne', discountOfferTransaction.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    discountOfferTransaction.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'DiscountOfferTransaction/delete', discountOfferTransaction.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        discountOfferTransaction.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            discountOfferTransaction.replaceItem(discountOfferTransaction.selectedItemForDelete.Id);
                            discountOfferTransaction.gridOptions.fillData(discountOfferTransaction.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        discountOfferTransaction.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    discountOfferTransaction.busyIndicator.isActive = false;
                });
            }
        });
    }

    discountOfferTransaction.searchData = function () {
        discountOfferTransaction.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"discountOfferTransaction/getall", discountOfferTransaction.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            discountOfferTransaction.categoryBusyIndicator.isActive = false;
            discountOfferTransaction.ListItems = response.ListItems;
            discountOfferTransaction.gridOptions.fillData(discountOfferTransaction.ListItems);
            discountOfferTransaction.gridOptions.currentPageNumber = response.CurrentPageNumber;
            discountOfferTransaction.gridOptions.totalRowCount = response.TotalRowCount;
            discountOfferTransaction.gridOptions.rowPerPage = response.RowPerPage;
            discountOfferTransaction.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            discountOfferTransaction.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });


    }
    discountOfferTransaction.LinkDiscountSellerIdSelector = {
        displayMember: 'BranchTitle',
        id: 'Id',
        fId: 'LinkDiscountSellerId',
        url: 'DiscountSeller',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'LinkDiscountSellerId',
        rowPerPage: 200,
        scope: discountOfferTransaction,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'LinkMemberId', displayName: 'کد سیستمی عضو', sortable: true, type: 'integer', visible: true },
                { name: 'BranchTitle', displayName: 'عنوان شعبه', sortable: true, type: 'string', visible: true },
                { name: 'WebAddress', displayName: 'آدرس وب سایت', sortable: true, type: 'string', visible: true },

            ]
        }
    }

    discountOfferTransaction.LinkDiscountSerialCardIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkDiscountSerialCardId',
        url: 'DiscountSerialCard',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'DiscountSerialCardIdentifier',
        rowPerPage: 200,
        scope: discountOfferTransaction,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'LinkMemberId', displayName: 'کد سیستمی عضو', sortable: true, type: 'integer', visible: true },
                { name: 'LinkDiscountGroupId', displayName: 'کد سیستمی گروه', sortable: true, type: 'integer', visible: true },
                { name: 'DiscountSerialCardIdentifier', displayName: 'شماره کارت ', sortable: true, type: 'string', visible: true },
                { name: 'IsEnabled', displayName: 'IsEnabled', sortable: true, type: 'boolean', visible: true },
                { name: 'MonthExpireLength', displayName: 'تعداد ماه انقضا', sortable: true, type: 'integer', visible: true },
                { name: 'RegisterDate', displayName: 'تاریخ ثبت', sortable: true, type: 'DateTime', visible: true },
                { name: 'ActivationDate', displayName: 'تاریخ فعال شدن', sortable: true, type: 'DateTime', visible: true },
                { name: 'CardExpireDate', displayName: 'تاریخ انقضا کارت', sortable: true, type: 'DateTime', visible: true },

            ]
        }
    }
    discountOfferTransaction.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkDiscountSellerId', displayName: 'کد سیستمی نماینده', sortable: true, type: 'string', visible: true },
            { name: 'LinkDiscountSerialCardId', displayName: 'کد سیستمی فروش کارت', sortable: true, type: 'string', visible: true },
            { name: 'BasePrice', displayName: 'قیمت پایه', sortable: true, type: 'string', visible: true },
            { name: 'SellerPrice', displayName: 'قیمت نماینده', sortable: true, type: 'string', visible: true },
            { name: 'SitePrice', displayName: 'قیمت سایت', sortable: true, type: 'string', visible: true },
            { name: 'TransactionTypeTitle', displayName: 'نوع تراکنش', sortable: true, type: 'string', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },


        ],
        data: {},
        multiSelect: false,
        startDate: moment().format(),
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "Id",
                SortType: 0,
                NeedToRunFakePagination: false,
                TotalRowData: 200,
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }

    discountOfferTransaction.test = 'false';

    discountOfferTransaction.gridOptions.reGetAll = function () {
        discountOfferTransaction.init();
    }

    discountOfferTransaction.gridOptions.onRowSelected = function () { }

    discountOfferTransaction.columnCheckbox = false;
    discountOfferTransaction.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (discountOfferTransaction.gridOptions.columnCheckbox) {
            for (var i = 0; i < discountOfferTransaction.gridOptions.columns.length; i++) {
                //discountOfferTransaction.gridOptions.columns[i].visible = $("#" + discountOfferTransaction.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + discountOfferTransaction.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                discountOfferTransaction.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = discountOfferTransaction.gridOptions.columns;
            for (var i = 0; i < discountOfferTransaction.gridOptions.columns.length; i++) {
                discountOfferTransaction.gridOptions.columns[i].visible = true;
                var element = $("#" + discountOfferTransaction.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + discountOfferTransaction.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < discountOfferTransaction.gridOptions.columns.length; i++) {
            console.log(discountOfferTransaction.gridOptions.columns[i].name.concat(".visible: "), discountOfferTransaction.gridOptions.columns[i].visible);
        }
        discountOfferTransaction.gridOptions.columnCheckbox = !discountOfferTransaction.gridOptions.columnCheckbox;
    }

    //Export Report 
    discountOfferTransaction.exportFile = function (frm) {
        discountOfferTransaction.addRequested = true;
        discountOfferTransaction.gridOptions.advancedSearchData.engine.ExportFile = discountOfferTransaction.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'DiscountOfferTransaction/exportfile', discountOfferTransaction.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            discountOfferTransaction.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                discountOfferTransaction.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //discountOfferTransaction.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    discountOfferTransaction.toggleExportForm = function () {
        discountOfferTransaction.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        discountOfferTransaction.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        discountOfferTransaction.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        discountOfferTransaction.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        discountOfferTransaction.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleDiscount/DiscountOfferTransaction/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    discountOfferTransaction.rowCountChanged = function () {
        if (!angular.isDefined(discountOfferTransaction.ExportFileClass.RowCount) || discountOfferTransaction.ExportFileClass.RowCount > 5000)
            discountOfferTransaction.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    discountOfferTransaction.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"DiscountOfferTransaction/count", discountOfferTransaction.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            discountOfferTransaction.addRequested = false;
            rashaErManage.checkAction(response);
            discountOfferTransaction.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            discountOfferTransaction.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

