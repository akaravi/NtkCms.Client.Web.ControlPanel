app.controller("discountSellerPriceSettingController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var discountSellerPriceSetting = this;
    discountSellerPriceSetting.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    discountSellerPriceSetting.UninversalMenus = [];
    discountSellerPriceSetting.selectUniversalMenuOnUndetectableKey = true;

    if (itemRecordStatus != undefined) discountSellerPriceSetting.itemRecordStatus = itemRecordStatus;

    // Many To Many
    // MemberUserGroup  جدول واسط
    // LinkMemberUserId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    discountSellerPriceSetting.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    

    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        discountSellerPriceSetting.memberGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    discountSellerPriceSetting.hasInMany2Many = function (OtherTable) {
        if (discountSellerPriceSetting.selectedMemberUser == null || discountSellerPriceSetting.selectedMemberUser[thisTableFieldICollection] == undefined || discountSellerPriceSetting.selectedMemberUser[thisTableFieldICollection] == null) return false;
        return objectFindByKey(discountSellerPriceSetting.selectedMemberUser[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    };
    discountSellerPriceSetting.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (discountSellerPriceSetting.hasInMany2Many(OtherTable)) {
            //var index = discountSellerPriceSetting.selectedMemberUser[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(discountSellerPriceSetting.selectedMemberUser[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            discountSellerPriceSetting.selectedMemberUser[thisTableFieldICollection].splice(index, 1);
        } else {
            discountSellerPriceSetting.selectedMemberUser[thisTableFieldICollection].push(obj);
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

    discountSellerPriceSetting.init = function () {
        discountSellerPriceSetting.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = discountSellerPriceSetting.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"discountSellerPriceSetting/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            discountSellerPriceSetting.busyIndicator.isActive = false;
            discountSellerPriceSetting.ListItems = response.ListItems;
            discountSellerPriceSetting.gridOptions.fillData(discountSellerPriceSetting.ListItems, response.resultAccess);
            discountSellerPriceSetting.gridOptions.currentPageNumber = response.CurrentPageNumber;
            discountSellerPriceSetting.gridOptions.totalRowCount = response.TotalRowCount;
            discountSellerPriceSetting.gridOptions.rowPerPage = response.RowPerPage;
            discountSellerPriceSetting.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            discountSellerPriceSetting.busyIndicator.isActive = false;
            discountSellerPriceSetting.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    discountSellerPriceSetting.busyIndicator.isActive = true;
    discountSellerPriceSetting.addRequested = false;
    discountSellerPriceSetting.openAddModal = function () {
        discountSellerPriceSetting.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'discountSellerPriceSetting/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            discountSellerPriceSetting.busyIndicator.isActive = false;
            discountSellerPriceSetting.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDiscount/discountSellerPriceSetting/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountSellerPriceSetting.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    discountSellerPriceSetting.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        discountSellerPriceSetting.busyIndicator.isActive = true;
        discountSellerPriceSetting.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'discountSellerPriceSetting/add', discountSellerPriceSetting.selectedItem, 'POST').success(function (response) {
            discountSellerPriceSetting.addRequested = false;
            discountSellerPriceSetting.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                discountSellerPriceSetting.gridOptions.advancedSearchData.engine.Filters = null;
                discountSellerPriceSetting.gridOptions.advancedSearchData.engine.Filters = [];
                discountSellerPriceSetting.ListItems.unshift(response.Item);
                discountSellerPriceSetting.gridOptions.fillData(discountSellerPriceSetting.ListItems);
                discountSellerPriceSetting.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountSellerPriceSetting.busyIndicator.isActive = false;
            discountSellerPriceSetting.addRequested = false;
        });
    }

    discountSellerPriceSetting.openEditModal = function () {

        discountSellerPriceSetting.modalTitle = 'ویرایش';
        if (!discountSellerPriceSetting.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'discountSellerPriceSetting/GetOne', discountSellerPriceSetting.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            discountSellerPriceSetting.selectedItem = response.Item;
            if (discountSellerPriceSetting
                .LinkUniversalMenuIdOnUndetectableKey >
                0) discountSellerPriceSetting.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDiscount/discountSellerPriceSetting/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    discountSellerPriceSetting.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        discountSellerPriceSetting.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'discountSellerPriceSetting/edit', discountSellerPriceSetting.selectedItem, 'PUT').success(function (response) {
            discountSellerPriceSetting.addRequested = true;
            rashaErManage.checkAction(response);
            discountSellerPriceSetting.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                discountSellerPriceSetting.addRequested = false;
                discountSellerPriceSetting.replaceItem(discountSellerPriceSetting.selectedItem.Id, response.Item);
                discountSellerPriceSetting.gridOptions.fillData(discountSellerPriceSetting.ListItems);
                discountSellerPriceSetting.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountSellerPriceSetting.addRequested = false;
            discountSellerPriceSetting.busyIndicator.isActive = false;
        });
    }

    discountSellerPriceSetting.closeModal = function () {
        $modalStack.dismissAll();
    };

    discountSellerPriceSetting.replaceItem = function (oldId, newItem) {
        angular.forEach(discountSellerPriceSetting.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = discountSellerPriceSetting.ListItems.indexOf(item);
                discountSellerPriceSetting.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            discountSellerPriceSetting.ListItems.unshift(newItem);
    }
    // delete content
    discountSellerPriceSetting.deleteRow = function () {
        if (!discountSellerPriceSetting.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                discountSellerPriceSetting.busyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath+'discountSellerPriceSetting/GetOne', discountSellerPriceSetting.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    discountSellerPriceSetting.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'discountSellerPriceSetting/delete', discountSellerPriceSetting.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        discountSellerPriceSetting.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            discountSellerPriceSetting.replaceItem(discountSellerPriceSetting.selectedItemForDelete.Id);
                            discountSellerPriceSetting.gridOptions.fillData(discountSellerPriceSetting.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        discountSellerPriceSetting.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    discountSellerPriceSetting.busyIndicator.isActive = false;
                });
            }
        });
    }

    discountSellerPriceSetting.searchData = function () {
        discountSellerPriceSetting.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"discountSellerPriceSetting/getall", discountSellerPriceSetting.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            discountSellerPriceSetting.categoryBusyIndicator.isActive = false;
            discountSellerPriceSetting.ListItems = response.ListItems;
            discountSellerPriceSetting.gridOptions.fillData(discountSellerPriceSetting.ListItems);
            discountSellerPriceSetting.gridOptions.currentPageNumber = response.CurrentPageNumber;
            discountSellerPriceSetting.gridOptions.totalRowCount = response.TotalRowCount;
            discountSellerPriceSetting.gridOptions.rowPerPage = response.RowPerPage;
            discountSellerPriceSetting.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            discountSellerPriceSetting.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //discountSellerPriceSetting.gridOptions.searchData();

    }
    discountSellerPriceSetting.LinkDiscountSellerIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkDiscountSellerId',
        url: 'DiscountSeller',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: discountSellerPriceSetting,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'LinkModuleCoreCmsUserId', displayName: 'کد سیستمی کاربر', sortable: true, type: 'integer', visible: true },
            ]
        }
    }
    discountSellerPriceSetting.LinkDiscountGroupIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkDiscountGroupId',
        url: 'DiscountGroup',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: discountSellerPriceSetting,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            ]
        }
    }
    discountSellerPriceSetting.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'SellerPrice', displayName: 'قیمت نماینده فروش', sortable: true, type: 'string', visible: true },
            { name: 'BasePrice', displayName: 'قیمت ثابت', sortable: true, type: 'string', visible: true },
            { name: 'virtual_DiscountGroup.Title', displayName: 'عنوان گروه', sortable: true, type: 'string', visible: true },
            { name: 'LinkDiscountGroupId', displayName: 'کد سیستمی گروه', sortable: true, type: 'integer', visible: true },
            { name: 'virtual_DiscountSeller.BranchTitle', displayName: 'عنوان شعبه', sortable: true, type: 'string', visible: true },
            { name: 'LinkDiscountSellerId', displayName: 'کد سیستمی نماینده فروش', sortable: true, type: 'string', visible: true },
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

    discountSellerPriceSetting.test = 'false';

    discountSellerPriceSetting.gridOptions.reGetAll = function () {
        discountSellerPriceSetting.init();
    }

    discountSellerPriceSetting.gridOptions.onRowSelected = function () { }

    discountSellerPriceSetting.columnCheckbox = false;
    discountSellerPriceSetting.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (discountSellerPriceSetting.gridOptions.columnCheckbox) {
            for (var i = 0; i < discountSellerPriceSetting.gridOptions.columns.length; i++) {
                //discountSellerPriceSetting.gridOptions.columns[i].visible = $("#" + discountSellerPriceSetting.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + discountSellerPriceSetting.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                discountSellerPriceSetting.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = discountSellerPriceSetting.gridOptions.columns;
            for (var i = 0; i < discountSellerPriceSetting.gridOptions.columns.length; i++) {
                discountSellerPriceSetting.gridOptions.columns[i].visible = true;
                var element = $("#" + discountSellerPriceSetting.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + discountSellerPriceSetting.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < discountSellerPriceSetting.gridOptions.columns.length; i++) {
            console.log(discountSellerPriceSetting.gridOptions.columns[i].name.concat(".visible: "), discountSellerPriceSetting.gridOptions.columns[i].visible);
        }
        discountSellerPriceSetting.gridOptions.columnCheckbox = !discountSellerPriceSetting.gridOptions.columnCheckbox;
    }
   
    //Export Report 
    discountSellerPriceSetting.exportFile = function () {
        discountSellerPriceSetting.addRequested = true;
        discountSellerPriceSetting.gridOptions.advancedSearchData.engine.ExportFile = discountSellerPriceSetting.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'discountSellerPriceSetting/exportfile', discountSellerPriceSetting.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            discountSellerPriceSetting.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                discountSellerPriceSetting.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //discountSellerPriceSetting.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    discountSellerPriceSetting.toggleExportForm = function () {
        discountSellerPriceSetting.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        discountSellerPriceSetting.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        discountSellerPriceSetting.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        discountSellerPriceSetting.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        discountSellerPriceSetting.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleDiscount/discountSellerPriceSetting/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    discountSellerPriceSetting.rowCountChanged = function () {
        if (!angular.isDefined(discountSellerPriceSetting.ExportFileClass.RowCount) || discountSellerPriceSetting.ExportFileClass.RowCount > 5000)
            discountSellerPriceSetting.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    discountSellerPriceSetting.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"discountSellerPriceSetting/count", discountSellerPriceSetting.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            discountSellerPriceSetting.addRequested = false;
            rashaErManage.checkAction(response);
            discountSellerPriceSetting.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            discountSellerPriceSetting.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

