app.controller("shopInvoiceSaleWorkFlowController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var shopInvoiceSaleWorkFlow = this;
    shopInvoiceSaleWorkFlow.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    shopInvoiceSaleWorkFlow.UninversalMenus = [];
    shopInvoiceSaleWorkFlow.selectUniversalMenuOnUndetectableKey = true;

    if (itemRecordStatus != undefined) shopInvoiceSaleWorkFlow.itemRecordStatus = itemRecordStatus;

    // Many To Many
    // MemberUserGroup  جدول واسط
    // LinkMemberUserId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    //shopInvoiceSaleWorkFlow.menueGroups = [];//لیست جدول دیگر
    //var otherTabaleFieldKey = 'Id';
    //var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    //var thisTableFieldICollection = 'MemberUserGroup';
    //var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    

    //ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
    //    shopInvoiceSaleWorkFlow.memberGroups = response.ListItems;
    //}).error(function (data, errCode, c, d) {
    //    console.log(data);
    //});
    //shopInvoiceSaleWorkFlow.hasInMany2Many = function (OtherTable) {
    //    if (shopInvoiceSaleWorkFlow.selectedMemberUser == null || shopInvoiceSaleWorkFlow.selectedMemberUser[thisTableFieldICollection] == undefined || shopInvoiceSaleWorkFlow.selectedMemberUser[thisTableFieldICollection] == null) return false;
    //    return objectFindByKey(shopInvoiceSaleWorkFlow.selectedMemberUser[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    //};
    //shopInvoiceSaleWorkFlow.toggleMany2Many = function (role, OtherTable) {
    //    var obj = {};
    //    obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
    //    if (shopInvoiceSaleWorkFlow.hasInMany2Many(OtherTable)) {
    //        //var index = shopInvoiceSaleWorkFlow.selectedMemberUser[thisTableFieldICollection].indexOf(obj);
    //        var index = arrayObjectIndexOf(shopInvoiceSaleWorkFlow.selectedMemberUser[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
    //        // get the index of this permission role
    //        shopInvoiceSaleWorkFlow.selectedMemberUser[thisTableFieldICollection].splice(index, 1);
    //    } else {
    //        shopInvoiceSaleWorkFlow.selectedMemberUser[thisTableFieldICollection].push(obj);
    //    }
    //}
    //// array = [{key:value},{key:value}]
    //function objectFindByKey(array, key, value) {
    //    for (var i = 0; i < array.length; i++) {
    //        if (array[i][key] === value) {
    //            var obj = {};
    //            obj[key] = value;
    //            array[i] = obj;
    //            return true;
    //        }
    //    }
    //    return false;
    //}

    //// Find an object in an array of objects and return its index if object is found, -1 if not 
    //function arrayObjectIndexOf(myArray, searchTerm, property) {
    //    for (var i = 0, len = myArray.length; i < len; i++) {
    //        if (myArray[i][property] === searchTerm) return i;
    //    }
    //    return -1;
    //}
    // End of Many To Many ========================================================================

    shopInvoiceSaleWorkFlow.init = function () {
        shopInvoiceSaleWorkFlow.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = shopInvoiceSaleWorkFlow.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"shopInvoiceSaleWorkFlow/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopInvoiceSaleWorkFlow.busyIndicator.isActive = false;
            shopInvoiceSaleWorkFlow.ListItems = response.ListItems;
            shopInvoiceSaleWorkFlow.gridOptions.fillData(shopInvoiceSaleWorkFlow.ListItems, response.resultAccess);
            shopInvoiceSaleWorkFlow.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopInvoiceSaleWorkFlow.gridOptions.totalRowCount = response.TotalRowCount;
            shopInvoiceSaleWorkFlow.gridOptions.rowPerPage = response.RowPerPage;
            shopInvoiceSaleWorkFlow.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            shopInvoiceSaleWorkFlow.busyIndicator.isActive = false;
            shopInvoiceSaleWorkFlow.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    shopInvoiceSaleWorkFlow.busyIndicator.isActive = true;
    shopInvoiceSaleWorkFlow.addRequested = false;
    shopInvoiceSaleWorkFlow.openAddModal = function () {
        shopInvoiceSaleWorkFlow.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSaleWorkFlow/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            shopInvoiceSaleWorkFlow.busyIndicator.isActive = false;
            shopInvoiceSaleWorkFlow.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/shopInvoiceSaleWorkFlow/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopInvoiceSaleWorkFlow.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    shopInvoiceSaleWorkFlow.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopInvoiceSaleWorkFlow.busyIndicator.isActive = true;
        shopInvoiceSaleWorkFlow.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSaleWorkFlow/add', shopInvoiceSaleWorkFlow.selectedItem, 'POST').success(function (response) {
            shopInvoiceSaleWorkFlow.addRequested = false;
            shopInvoiceSaleWorkFlow.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopInvoiceSaleWorkFlow.gridOptions.advancedSearchData.engine.Filters = null;
                shopInvoiceSaleWorkFlow.gridOptions.advancedSearchData.engine.Filters = [];
                shopInvoiceSaleWorkFlow.ListItems.unshift(response.Item);
                shopInvoiceSaleWorkFlow.gridOptions.fillData(shopInvoiceSaleWorkFlow.ListItems);
                shopInvoiceSaleWorkFlow.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopInvoiceSaleWorkFlow.busyIndicator.isActive = false;
            shopInvoiceSaleWorkFlow.addRequested = false;
        });
    }

    shopInvoiceSaleWorkFlow.openEditModal = function () {

        shopInvoiceSaleWorkFlow.modalTitle = 'ویرایش';
        if (!shopInvoiceSaleWorkFlow.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSaleWorkFlow/GetOne', shopInvoiceSaleWorkFlow.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            shopInvoiceSaleWorkFlow.selectedItem = response.Item;
            if (shopInvoiceSaleWorkFlow
                .LinkUniversalMenuIdOnUndetectableKey >
                0) shopInvoiceSaleWorkFlow.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/shopInvoiceSaleWorkFlow/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    shopInvoiceSaleWorkFlow.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopInvoiceSaleWorkFlow.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSaleWorkFlow/edit', shopInvoiceSaleWorkFlow.selectedItem, 'PUT').success(function (response) {
            shopInvoiceSaleWorkFlow.addRequested = true;
            rashaErManage.checkAction(response);
            shopInvoiceSaleWorkFlow.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                shopInvoiceSaleWorkFlow.addRequested = false;
                shopInvoiceSaleWorkFlow.replaceItem(shopInvoiceSaleWorkFlow.selectedItem.Id, response.Item);
                shopInvoiceSaleWorkFlow.gridOptions.fillData(shopInvoiceSaleWorkFlow.ListItems);
                shopInvoiceSaleWorkFlow.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopInvoiceSaleWorkFlow.addRequested = false;
            shopInvoiceSaleWorkFlow.busyIndicator.isActive = false;
        });
    }

    shopInvoiceSaleWorkFlow.closeModal = function () {
        $modalStack.dismissAll();
    };

    shopInvoiceSaleWorkFlow.replaceItem = function (oldId, newItem) {
        angular.forEach(shopInvoiceSaleWorkFlow.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = shopInvoiceSaleWorkFlow.ListItems.indexOf(item);
                shopInvoiceSaleWorkFlow.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            shopInvoiceSaleWorkFlow.ListItems.unshift(newItem);
    }
    // delete content
    shopInvoiceSaleWorkFlow.deleteRow = function () {
        if (!shopInvoiceSaleWorkFlow.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                shopInvoiceSaleWorkFlow.busyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSaleWorkFlow/GetOne', shopInvoiceSaleWorkFlow.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    shopInvoiceSaleWorkFlow.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSaleWorkFlow/delete', shopInvoiceSaleWorkFlow.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        shopInvoiceSaleWorkFlow.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            shopInvoiceSaleWorkFlow.replaceItem(shopInvoiceSaleWorkFlow.selectedItemForDelete.Id);
                            shopInvoiceSaleWorkFlow.gridOptions.fillData(shopInvoiceSaleWorkFlow.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        shopInvoiceSaleWorkFlow.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    shopInvoiceSaleWorkFlow.busyIndicator.isActive = false;
                });
            }
        });
    }

    shopInvoiceSaleWorkFlow.searchData = function () {
        shopInvoiceSaleWorkFlow.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"shopInvoiceSaleWorkFlow/getall", shopInvoiceSaleWorkFlow.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            shopInvoiceSaleWorkFlow.categoryBusyIndicator.isActive = false;
            shopInvoiceSaleWorkFlow.ListItems = response.ListItems;
            shopInvoiceSaleWorkFlow.gridOptions.fillData(shopInvoiceSaleWorkFlow.ListItems);
            shopInvoiceSaleWorkFlow.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopInvoiceSaleWorkFlow.gridOptions.totalRowCount = response.TotalRowCount;
            shopInvoiceSaleWorkFlow.gridOptions.rowPerPage = response.RowPerPage;
            shopInvoiceSaleWorkFlow.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            shopInvoiceSaleWorkFlow.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //shopInvoiceSaleWorkFlow.gridOptions.searchData();

    }
    shopInvoiceSaleWorkFlow.LinkExternalModuleUniversalMenuIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkExternalModuleUniversalMenuId',
        url: 'universalmenumenuitem',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: shopInvoiceSaleWorkFlow,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
                { name: 'ShowInMenuOrder', displayName: 'ترتیب نمایش', sortable: true, type: 'string' }
            ]
        }
    }
    shopInvoiceSaleWorkFlow.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            { name: 'IsDefault', displayName: 'پیش فرض', sortable: true, isCheckBox: true, visible: true },
            { name: 'IsInPreInvoiceActivation', displayName: 'فاکتور باز', sortable: true, isCheckBox: true, visible: 'true' },
            { name: 'IsInInvoiceClosedActivation', displayName: 'تسویه شده', sortable: true, isCheckBox: true, visible: 'true' },
            { name: 'LinkExternalModuleUniversalMenuId', displayName: 'کد درخت تصمیم', sortable: true, type: 'integer', visible: true },
            { name: 'ModuleUniversalMenuMenuItem.Title', displayName: ' عنوان درخت', sortable: true, type: 'string', visible: true },
            
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

    shopInvoiceSaleWorkFlow.test = 'false';

    shopInvoiceSaleWorkFlow.gridOptions.reGetAll = function () {
        shopInvoiceSaleWorkFlow.init();
    }

    shopInvoiceSaleWorkFlow.gridOptions.onRowSelected = function () { }

    shopInvoiceSaleWorkFlow.columnCheckbox = false;
    shopInvoiceSaleWorkFlow.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (shopInvoiceSaleWorkFlow.gridOptions.columnCheckbox) {
            for (var i = 0; i < shopInvoiceSaleWorkFlow.gridOptions.columns.length; i++) {
                //shopInvoiceSaleWorkFlow.gridOptions.columns[i].visible = $("#" + shopInvoiceSaleWorkFlow.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + shopInvoiceSaleWorkFlow.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                shopInvoiceSaleWorkFlow.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = shopInvoiceSaleWorkFlow.gridOptions.columns;
            for (var i = 0; i < shopInvoiceSaleWorkFlow.gridOptions.columns.length; i++) {
                shopInvoiceSaleWorkFlow.gridOptions.columns[i].visible = true;
                var element = $("#" + shopInvoiceSaleWorkFlow.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + shopInvoiceSaleWorkFlow.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < shopInvoiceSaleWorkFlow.gridOptions.columns.length; i++) {
            console.log(shopInvoiceSaleWorkFlow.gridOptions.columns[i].name.concat(".visible: "), shopInvoiceSaleWorkFlow.gridOptions.columns[i].visible);
        }
        shopInvoiceSaleWorkFlow.gridOptions.columnCheckbox = !shopInvoiceSaleWorkFlow.gridOptions.columnCheckbox;
    }
   
    //Export Report 
    shopInvoiceSaleWorkFlow.exportFile = function () {
        shopInvoiceSaleWorkFlow.addRequested = true;
        shopInvoiceSaleWorkFlow.gridOptions.advancedSearchData.engine.ExportFile = shopInvoiceSaleWorkFlow.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'shopInvoiceSaleWorkFlow/exportfile', shopInvoiceSaleWorkFlow.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            shopInvoiceSaleWorkFlow.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopInvoiceSaleWorkFlow.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //shopInvoiceSaleWorkFlow.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    shopInvoiceSaleWorkFlow.toggleExportForm = function () {
        shopInvoiceSaleWorkFlow.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        shopInvoiceSaleWorkFlow.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        shopInvoiceSaleWorkFlow.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        shopInvoiceSaleWorkFlow.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        shopInvoiceSaleWorkFlow.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleShop/shopInvoiceSaleWorkFlow/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    shopInvoiceSaleWorkFlow.rowCountChanged = function () {
        if (!angular.isDefined(shopInvoiceSaleWorkFlow.ExportFileClass.RowCount) || shopInvoiceSaleWorkFlow.ExportFileClass.RowCount > 5000)
            shopInvoiceSaleWorkFlow.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    shopInvoiceSaleWorkFlow.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"shopInvoiceSaleWorkFlow/count", shopInvoiceSaleWorkFlow.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            shopInvoiceSaleWorkFlow.addRequested = false;
            rashaErManage.checkAction(response);
            shopInvoiceSaleWorkFlow.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            shopInvoiceSaleWorkFlow.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

