app.controller("campaignDetailProductController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var campaignDetailProduct = this;
    campaignDetailProduct.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    campaignDetailProduct.UninversalMenus = [];
    campaignDetailProduct.selectUniversalMenuOnUndetectableKey = true;

    if (itemRecordStatus != undefined) campaignDetailProduct.itemRecordStatus = itemRecordStatus;

    // Many To Many
    // MemberUserGroup  جدول واسط
    // LinkMemberUserId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    campaignDetailProduct.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    

    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        campaignDetailProduct.memberGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    //campaignDetailProduct.hasInMany2Many = function (OtherTable) {
    //    if (campaignDetailProduct.selectedMemberUser == null || campaignDetailProduct.selectedMemberUser[thisTableFieldICollection] == undefined || campaignDetailProduct.selectedMemberUser[thisTableFieldICollection] == null) return false;
    //    return objectFindByKey(campaignDetailProduct.selectedMemberUser[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    //};
    campaignDetailProduct.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (campaignDetailProduct.hasInMany2Many(OtherTable)) {
            //var index = campaignDetailProduct.selectedMemberUser[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(campaignDetailProduct.selectedMemberUser[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            campaignDetailProduct.selectedMemberUser[thisTableFieldICollection].splice(index, 1);
        } else {
            campaignDetailProduct.selectedMemberUser[thisTableFieldICollection].push(obj);
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

    campaignDetailProduct.init = function () {
        campaignDetailProduct.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = campaignDetailProduct.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"campaignDetailProduct/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetailProduct.busyIndicator.isActive = false;
            campaignDetailProduct.ListItems = response.ListItems;
            campaignDetailProduct.gridOptions.fillData(campaignDetailProduct.ListItems, response.resultAccess);
            campaignDetailProduct.gridOptions.currentPageNumber = response.CurrentPageNumber;
            campaignDetailProduct.gridOptions.totalRowCount = response.TotalRowCount;
            campaignDetailProduct.gridOptions.rowPerPage = response.RowPerPage;
            campaignDetailProduct.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            campaignDetailProduct.busyIndicator.isActive = false;
            campaignDetailProduct.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    campaignDetailProduct.busyIndicator.isActive = true;
    campaignDetailProduct.addRequested = false;
    campaignDetailProduct.openAddModal = function () {
        campaignDetailProduct.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailProduct/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetailProduct.busyIndicator.isActive = false;
            campaignDetailProduct.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCampaign/campaignDetailProduct/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignDetailProduct.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    campaignDetailProduct.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        campaignDetailProduct.busyIndicator.isActive = true;
        campaignDetailProduct.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailProduct/add', campaignDetailProduct.selectedItem, 'POST').success(function (response) {
            campaignDetailProduct.addRequested = false;
            campaignDetailProduct.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignDetailProduct.gridOptions.advancedSearchData.engine.Filters = null;
                campaignDetailProduct.gridOptions.advancedSearchData.engine.Filters = [];
                campaignDetailProduct.ListItems.unshift(response.Item);
                campaignDetailProduct.gridOptions.fillData(campaignDetailProduct.ListItems);
                campaignDetailProduct.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignDetailProduct.busyIndicator.isActive = false;
            campaignDetailProduct.addRequested = false;
        });
    }

    campaignDetailProduct.openEditModal = function () {

        campaignDetailProduct.modalTitle = 'ویرایش';
        if (!campaignDetailProduct.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailProduct/GetOne', campaignDetailProduct.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetailProduct.selectedItem = response.Item;
            if (campaignDetailProduct
                .LinkUniversalMenuIdOnUndetectableKey >
                0) campaignDetailProduct.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCampaign/campaignDetailProduct/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    campaignDetailProduct.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        campaignDetailProduct.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailProduct/edit', campaignDetailProduct.selectedItem, 'PUT').success(function (response) {
            campaignDetailProduct.addRequested = true;
            rashaErManage.checkAction(response);
            campaignDetailProduct.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                campaignDetailProduct.addRequested = false;
                campaignDetailProduct.replaceItem(campaignDetailProduct.selectedItem.Id, response.Item);
                campaignDetailProduct.gridOptions.fillData(campaignDetailProduct.ListItems);
                campaignDetailProduct.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignDetailProduct.addRequested = false;
            campaignDetailProduct.busyIndicator.isActive = false;
        });
    }

    campaignDetailProduct.closeModal = function () {
        $modalStack.dismissAll();
    };

    campaignDetailProduct.replaceItem = function (oldId, newItem) {
        angular.forEach(campaignDetailProduct.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = campaignDetailProduct.ListItems.indexOf(item);
                campaignDetailProduct.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            campaignDetailProduct.ListItems.unshift(newItem);
    }
    // delete content
    campaignDetailProduct.deleteRow = function () {
        if (!campaignDetailProduct.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                campaignDetailProduct.busyIndicator.isActive = true;
                console.log(campaignDetailProduct.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailProduct/GetOne', campaignDetailProduct.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    campaignDetailProduct.selectedItemForDelete = response.Item;
                    console.log(campaignDetailProduct.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailProduct/delete', campaignDetailProduct.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        campaignDetailProduct.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            campaignDetailProduct.replaceItem(campaignDetailProduct.selectedItemForDelete.Id);
                            campaignDetailProduct.gridOptions.fillData(campaignDetailProduct.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        campaignDetailProduct.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    campaignDetailProduct.busyIndicator.isActive = false;
                });
            }
        });
    }

    campaignDetailProduct.searchData = function () {
        campaignDetailProduct.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"campaignDetailProduct/getall", campaignDetailProduct.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetailProduct.categoryBusyIndicator.isActive = false;
            campaignDetailProduct.ListItems = response.ListItems;
            campaignDetailProduct.gridOptions.fillData(campaignDetailProduct.ListItems);
            campaignDetailProduct.gridOptions.currentPageNumber = response.CurrentPageNumber;
            campaignDetailProduct.gridOptions.totalRowCount = response.TotalRowCount;
            campaignDetailProduct.gridOptions.rowPerPage = response.RowPerPage;
            campaignDetailProduct.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            campaignDetailProduct.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //campaignDetailProduct.gridOptions.searchData();

    }
    campaignDetailProduct.LinkCampaignDetailIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkCampaignDetailId',
        url: 'CampaignDetail',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: campaignDetailProduct,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
                { name: 'LinkCampaignDetailId', displayName: 'کد سیستمی جزییات', sortable: true, type: 'integer', visible: true },
            ]
        }
    }
    campaignDetailProduct.LinkModuleProductIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkModuleProductId',
        url: 'ProductContent',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: campaignDetailProduct,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
                { name: 'LinkModuleProductId', displayName: 'کد سیستمی ', sortable: true, type: 'integer', visible: true },
            ]
        }
    }
    
    campaignDetailProduct.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkCampaignDetailId', displayName: 'کد سیستمی جزییات', sortable: true, type: 'integer', visible: true },
            { name: 'IsNecessary', displayName: 'ضروری است', sortable: true, type: 'string', visible: true },
            { name: 'LinkModuleProductId', displayName: 'کد سیستمی کالا', sortable: true, type: 'string', visible: true },
            { name: 'virtual_ProductContent.Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            { name: 'ProductPrice', displayName: 'قیمت کالا', sortable: true, type: 'string', visible: true },
            { name: 'SalePrice', displayName: 'قیمت فروش', sortable: true, type: 'string', visible: true },
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

    campaignDetailProduct.test = 'false';

    campaignDetailProduct.gridOptions.reGetAll = function () {
        campaignDetailProduct.init();
    }

    campaignDetailProduct.gridOptions.onRowSelected = function () { }

    campaignDetailProduct.columnCheckbox = false;
    campaignDetailProduct.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (campaignDetailProduct.gridOptions.columnCheckbox) {
            for (var i = 0; i < campaignDetailProduct.gridOptions.columns.length; i++) {
                //campaignDetailProduct.gridOptions.columns[i].visible = $("#" + campaignDetailProduct.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + campaignDetailProduct.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                campaignDetailProduct.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = campaignDetailProduct.gridOptions.columns;
            for (var i = 0; i < campaignDetailProduct.gridOptions.columns.length; i++) {
                campaignDetailProduct.gridOptions.columns[i].visible = true;
                var element = $("#" + campaignDetailProduct.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + campaignDetailProduct.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < campaignDetailProduct.gridOptions.columns.length; i++) {
            console.log(campaignDetailProduct.gridOptions.columns[i].name.concat(".visible: "), campaignDetailProduct.gridOptions.columns[i].visible);
        }
        campaignDetailProduct.gridOptions.columnCheckbox = !campaignDetailProduct.gridOptions.columnCheckbox;
    }
   
    //Export Report 
    campaignDetailProduct.exportFile = function () {
        campaignDetailProduct.addRequested = true;
        campaignDetailProduct.gridOptions.advancedSearchData.engine.ExportFile = campaignDetailProduct.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailProduct/exportfile', campaignDetailProduct.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            campaignDetailProduct.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignDetailProduct.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //campaignDetailProduct.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    campaignDetailProduct.toggleExportForm = function () {
        campaignDetailProduct.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        campaignDetailProduct.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        campaignDetailProduct.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        campaignDetailProduct.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        campaignDetailProduct.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCampaign/campaignDetailProduct/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    campaignDetailProduct.rowCountChanged = function () {
        if (!angular.isDefined(campaignDetailProduct.ExportFileClass.RowCount) || campaignDetailProduct.ExportFileClass.RowCount > 5000)
            campaignDetailProduct.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    campaignDetailProduct.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"campaignDetailProduct/count", campaignDetailProduct.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            campaignDetailProduct.addRequested = false;
            rashaErManage.checkAction(response);
            campaignDetailProduct.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            campaignDetailProduct.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

