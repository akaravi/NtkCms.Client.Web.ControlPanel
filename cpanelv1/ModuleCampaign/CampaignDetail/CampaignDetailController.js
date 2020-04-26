app.controller("campaignDetailController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var campaignDetail = this;
    campaignDetail.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    campaignDetail.UninversalMenus = [];
    campaignDetail.selectUniversalMenuOnUndetectableKey = true;
    var todayDate = moment().format();

    campaignDetail.ToDate = {
        defaultDate: todayDate
    }
    campaignDetail.FromDate = {
        defaultDate: todayDate
    }
    campaignDetail.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    campaignDetail.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:campaignDetail.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:campaignDetail,
        useCurrentLocationZoom:12,
    }

    campaignDetail.testDate = moment().format();
    if (itemRecordStatus != undefined) campaignDetail.itemRecordStatus = itemRecordStatus;

    // Many To Many
    // MemberUserGroup  جدول واسط
    // LinkMemberUserId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    campaignDetail.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    

    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        campaignDetail.memberGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    //campaignDetail.hasInMany2Many = function (OtherTable) {
    //    if (campaignDetail.selectedMemberUser == null || campaignDetail.selectedMemberUser[thisTableFieldICollection] == undefined || campaignDetail.selectedMemberUser[thisTableFieldICollection] == null) return false;
    //    return objectFindByKey(campaignDetail.selectedMemberUser[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    //};
    campaignDetail.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (campaignDetail.hasInMany2Many(OtherTable)) {
            //var index = campaignDetail.selectedMemberUser[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(campaignDetail.selectedMemberUser[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            campaignDetail.selectedMemberUser[thisTableFieldICollection].splice(index, 1);
        } else {
            campaignDetail.selectedMemberUser[thisTableFieldICollection].push(obj);
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

    campaignDetail.init = function () {
        campaignDetail.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = campaignDetail.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"campaignDetail/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetail.busyIndicator.isActive = false;
            campaignDetail.ListItems = response.ListItems;
            campaignDetail.gridOptions.fillData(campaignDetail.ListItems, response.resultAccess);
            campaignDetail.gridOptions.currentPageNumber = response.CurrentPageNumber;
            campaignDetail.gridOptions.totalRowCount = response.TotalRowCount;
            campaignDetail.gridOptions.rowPerPage = response.RowPerPage;
            campaignDetail.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            campaignDetail.busyIndicator.isActive = false;
            campaignDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    campaignDetail.busyIndicator.isActive = true;
    campaignDetail.addRequested = false;
    campaignDetail.openAddModal = function () {
        campaignDetail.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetail/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetail.busyIndicator.isActive = false;
            campaignDetail.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCampaign/campaignDetail/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignDetail.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    campaignDetail.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        campaignDetail.busyIndicator.isActive = true;
        campaignDetail.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetail/add', campaignDetail.selectedItem, 'POST').success(function (response) {
            campaignDetail.addRequested = false;
            campaignDetail.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignDetail.gridOptions.advancedSearchData.engine.Filters = null;
                campaignDetail.gridOptions.advancedSearchData.engine.Filters = [];
                campaignDetail.ListItems.unshift(response.Item);
                campaignDetail.gridOptions.fillData(campaignDetail.ListItems);
                campaignDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignDetail.busyIndicator.isActive = false;
            campaignDetail.addRequested = false;
        });
    }

    campaignDetail.openEditModal = function () {

        campaignDetail.modalTitle = 'ویرایش';
        if (!campaignDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetail/GetOne', campaignDetail.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetail.selectedItem = response.Item;
            if (campaignDetail
                .LinkUniversalMenuIdOnUndetectableKey >
                0) campaignDetail.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCampaign/campaignDetail/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    campaignDetail.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        campaignDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetail/edit', campaignDetail.selectedItem, 'PUT').success(function (response) {
            campaignDetail.addRequested = true;
            rashaErManage.checkAction(response);
            campaignDetail.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                campaignDetail.addRequested = false;
                campaignDetail.replaceItem(campaignDetail.selectedItem.Id, response.Item);
                campaignDetail.gridOptions.fillData(campaignDetail.ListItems);
                campaignDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignDetail.addRequested = false;
            campaignDetail.busyIndicator.isActive = false;
        });
    }

    campaignDetail.closeModal = function () {
        $modalStack.dismissAll();
    };

    campaignDetail.replaceItem = function (oldId, newItem) {
        angular.forEach(campaignDetail.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = campaignDetail.ListItems.indexOf(item);
                campaignDetail.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            campaignDetail.ListItems.unshift(newItem);
    }
    // delete content
    campaignDetail.deleteRow = function () {
        if (!campaignDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                campaignDetail.busyIndicator.isActive = true;
                console.log(campaignDetail.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'campaignDetail/GetOne', campaignDetail.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    campaignDetail.selectedItemForDelete = response.Item;
                    console.log(campaignDetail.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'campaignDetail/delete', campaignDetail.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        campaignDetail.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            campaignDetail.replaceItem(campaignDetail.selectedItemForDelete.Id);
                            campaignDetail.gridOptions.fillData(campaignDetail.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        campaignDetail.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    campaignDetail.busyIndicator.isActive = false;
                });
            }
        });
    }

    campaignDetail.searchData = function () {
        campaignDetail.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"campaignDetail/getall", campaignDetail.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetail.categoryBusyIndicator.isActive = false;
            campaignDetail.ListItems = response.ListItems;
            campaignDetail.gridOptions.fillData(campaignDetail.ListItems);
            campaignDetail.gridOptions.currentPageNumber = response.CurrentPageNumber;
            campaignDetail.gridOptions.totalRowCount = response.TotalRowCount;
            campaignDetail.gridOptions.rowPerPage = response.RowPerPage;
            campaignDetail.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            campaignDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //campaignDetail.gridOptions.searchData();

    }
    campaignDetail.LinkCampaignContentIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkCampaignContentId',
        url: 'CampaignContent',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: campaignDetail,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
                { name: 'ProductPrice', displayName: 'ProductPrice', sortable: true, type: 'string', visible: true },
                { name: 'SalePrice', displayName: 'SalePrice', sortable: true, type: 'string', visible: true },
                { name: 'LinkCampaignContentId', displayName: 'کد سیستمی کمپ', sortable: true, type: 'integer', visible: true },
            ]
        }
    }
    campaignDetail.LinkMemberGroupIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkMemberGroupId',
        url: 'MemberGroup',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: campaignDetail,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
                { name: 'LinkMemberGroupId', displayName: 'کد سیستمی کمپ', sortable: true, type: 'integer', visible: true },
            ]
        }
    }
    campaignDetail.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkCampaignContentId', displayName: 'کد سیستمی کمپ', sortable: true, type: 'integer', visible: true },
            { name: 'virtual_CampaignContent.Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'virtual_CampaignContent.ProductPrice', displayName: 'قیمت کالا', sortable: true, type: 'string', visible: true },
            { name: 'virtual_CampaignContent.SalePrice', displayName: 'قیمت فروش', sortable: true, type: 'string', visible: true },
            { name: 'LinkMemberGroupId', displayName: 'کد سیستمی گروه اعضا', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: true },
            { name: 'NumberOfMainMembers', displayName: 'تعداد افراد شرکت کننده', sortable: true, type: 'integer', visible: true },
            { name: 'NumberOfReserveMembers', displayName: 'تعداد افراد رزرو', sortable: true, type: 'integer', visible: true },
            { name: 'WebAddress', displayName: 'آدرس وب', sortable: true, type: 'string', visible: true },
            { name: 'FromDate', displayName: 'از تاریخ', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'ToDate', displayName: 'تا تاریخ', sortable: true, isDate: true, type: 'date', visible: 'true' },
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

    campaignDetail.test = 'false';

    campaignDetail.gridOptions.reGetAll = function () {
        campaignDetail.init();
    }

    campaignDetail.gridOptions.onRowSelected = function () { }

    campaignDetail.columnCheckbox = false;
    campaignDetail.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (campaignDetail.gridOptions.columnCheckbox) {
            for (var i = 0; i < campaignDetail.gridOptions.columns.length; i++) {
                //campaignDetail.gridOptions.columns[i].visible = $("#" + campaignDetail.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + campaignDetail.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                campaignDetail.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = campaignDetail.gridOptions.columns;
            for (var i = 0; i < campaignDetail.gridOptions.columns.length; i++) {
                campaignDetail.gridOptions.columns[i].visible = true;
                var element = $("#" + campaignDetail.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + campaignDetail.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < campaignDetail.gridOptions.columns.length; i++) {
            console.log(campaignDetail.gridOptions.columns[i].name.concat(".visible: "), campaignDetail.gridOptions.columns[i].visible);
        }
        campaignDetail.gridOptions.columnCheckbox = !campaignDetail.gridOptions.columnCheckbox;
    }
   
    //Export Report 
    campaignDetail.exportFile = function () {
        campaignDetail.addRequested = true;
        campaignDetail.gridOptions.advancedSearchData.engine.ExportFile = campaignDetail.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetail/exportfile', campaignDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            campaignDetail.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignDetail.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //campaignDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    campaignDetail.toggleExportForm = function () {
        campaignDetail.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        campaignDetail.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        campaignDetail.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        campaignDetail.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        campaignDetail.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCampaign/campaignDetail/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    campaignDetail.rowCountChanged = function () {
        if (!angular.isDefined(campaignDetail.ExportFileClass.RowCount) || campaignDetail.ExportFileClass.RowCount > 5000)
            campaignDetail.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    campaignDetail.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"campaignDetail/count", campaignDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            campaignDetail.addRequested = false;
            rashaErManage.checkAction(response);
            campaignDetail.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            campaignDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

