app.controller("campaignDetailItemController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var campaignDetailItem = this;
    campaignDetailItem.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    campaignDetailItem.UninversalMenus = [];
    campaignDetailItem.selectUniversalMenuOnUndetectableKey = true;

    if (itemRecordStatus != undefined) campaignDetailItem.itemRecordStatus = itemRecordStatus;

    // Many To Many
    // MemberUserGroup  جدول واسط
    // LinkMemberUserId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    campaignDetailItem.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    

    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        campaignDetailItem.memberGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    //campaignDetailItem.hasInMany2Many = function (OtherTable) {
    //    if (campaignDetailItem.selectedMemberUser == null || campaignDetailItem.selectedMemberUser[thisTableFieldICollection] == undefined || campaignDetailItem.selectedMemberUser[thisTableFieldICollection] == null) return false;
    //    return objectFindByKey(campaignDetailItem.selectedMemberUser[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    //};
    campaignDetailItem.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (campaignDetailItem.hasInMany2Many(OtherTable)) {
            //var index = campaignDetailItem.selectedMemberUser[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(campaignDetailItem.selectedMemberUser[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            campaignDetailItem.selectedMemberUser[thisTableFieldICollection].splice(index, 1);
        } else {
            campaignDetailItem.selectedMemberUser[thisTableFieldICollection].push(obj);
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

    campaignDetailItem.init = function () {
        campaignDetailItem.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = campaignDetailItem.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"campaignDetailItem/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetailItem.busyIndicator.isActive = false;
            campaignDetailItem.ListItems = response.ListItems;
            campaignDetailItem.gridOptions.fillData(campaignDetailItem.ListItems, response.resultAccess);
            campaignDetailItem.gridOptions.currentPageNumber = response.CurrentPageNumber;
            campaignDetailItem.gridOptions.totalRowCount = response.TotalRowCount;
            campaignDetailItem.gridOptions.rowPerPage = response.RowPerPage;
            campaignDetailItem.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            campaignDetailItem.busyIndicator.isActive = false;
            campaignDetailItem.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    campaignDetailItem.busyIndicator.isActive = true;
    campaignDetailItem.addRequested = false;
    campaignDetailItem.openAddModal = function () {
        campaignDetailItem.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailItem/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetailItem.busyIndicator.isActive = false;
            campaignDetailItem.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCampaign/campaignDetailItem/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignDetailItem.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    campaignDetailItem.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        campaignDetailItem.busyIndicator.isActive = true;
        campaignDetailItem.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailItem/add', campaignDetailItem.selectedItem, 'POST').success(function (response) {
            campaignDetailItem.addRequested = false;
            campaignDetailItem.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignDetailItem.gridOptions.advancedSearchData.engine.Filters = null;
                campaignDetailItem.gridOptions.advancedSearchData.engine.Filters = [];
                campaignDetailItem.ListItems.unshift(response.Item);
                campaignDetailItem.gridOptions.fillData(campaignDetailItem.ListItems);
                campaignDetailItem.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignDetailItem.busyIndicator.isActive = false;
            campaignDetailItem.addRequested = false;
        });
    }

    campaignDetailItem.openEditModal = function () {

        campaignDetailItem.modalTitle = 'ویرایش';
        if (!campaignDetailItem.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailItem/GetOne', campaignDetailItem.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetailItem.selectedItem = response.Item;
            if (campaignDetailItem
                .LinkUniversalMenuIdOnUndetectableKey >
                0) campaignDetailItem.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCampaign/campaignDetailItem/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    campaignDetailItem.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        campaignDetailItem.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailItem/edit', campaignDetailItem.selectedItem, 'PUT').success(function (response) {
            campaignDetailItem.addRequested = true;
            rashaErManage.checkAction(response);
            campaignDetailItem.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                campaignDetailItem.addRequested = false;
                campaignDetailItem.replaceItem(campaignDetailItem.selectedItem.Id, response.Item);
                campaignDetailItem.gridOptions.fillData(campaignDetailItem.ListItems);
                campaignDetailItem.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignDetailItem.addRequested = false;
            campaignDetailItem.busyIndicator.isActive = false;
        });
    }

    campaignDetailItem.closeModal = function () {
        $modalStack.dismissAll();
    };

    campaignDetailItem.replaceItem = function (oldId, newItem) {
        angular.forEach(campaignDetailItem.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = campaignDetailItem.ListItems.indexOf(item);
                campaignDetailItem.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            campaignDetailItem.ListItems.unshift(newItem);
    }
    // delete content
    campaignDetailItem.deleteRow = function () {
        if (!campaignDetailItem.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                campaignDetailItem.busyIndicator.isActive = true;
                console.log(campaignDetailItem.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailItem/GetOne', campaignDetailItem.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    campaignDetailItem.selectedItemForDelete = response.Item;
                    console.log(campaignDetailItem.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailItem/delete', campaignDetailItem.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        campaignDetailItem.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            campaignDetailItem.replaceItem(campaignDetailItem.selectedItemForDelete.Id);
                            campaignDetailItem.gridOptions.fillData(campaignDetailItem.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        campaignDetailItem.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    campaignDetailItem.busyIndicator.isActive = false;
                });
            }
        });
    }

    campaignDetailItem.searchData = function () {
        campaignDetailItem.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"campaignDetailItem/getall", campaignDetailItem.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetailItem.categoryBusyIndicator.isActive = false;
            campaignDetailItem.ListItems = response.ListItems;
            campaignDetailItem.gridOptions.fillData(campaignDetailItem.ListItems);
            campaignDetailItem.gridOptions.currentPageNumber = response.CurrentPageNumber;
            campaignDetailItem.gridOptions.totalRowCount = response.TotalRowCount;
            campaignDetailItem.gridOptions.rowPerPage = response.RowPerPage;
            campaignDetailItem.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            campaignDetailItem.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //campaignDetailItem.gridOptions.searchData();

    }
    campaignDetailItem.LinkCampaignDetailIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkCampaignDetailId',
        url: 'CampaignDetail',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: campaignDetailItem,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
                { name: 'FromDate', displayName: 'از تاریخ', sortable: true, isDate: true, type: 'date', visible: 'true' },
                { name: 'ToDate', displayName: 'تا تاریخ', sortable: true, isDate: true, type: 'date', visible: 'true' },
                { name: 'LinkCampaignDetailId', displayName: 'کد سیستمی جزییات', sortable: true, type: 'integer', visible: true },
            ]
        }
    }
    campaignDetailItem.LinkCampaignItemIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkCampaignItemId',
        url: 'CampaignItem',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: campaignDetailItem,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
                { name: 'LinkCampaignItemId', displayName: 'کد سیستمی جزییات', sortable: true, type: 'integer', visible: true },
            ]
        }
    }
    campaignDetailItem.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkCampaignDetailId', displayName: 'کد سیستمی جزییات', sortable: true, type: 'integer', visible: true },
            { name: 'virtual_CampaignDetail.Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'LinkCampaignItemId', displayName: 'کد سیستمی جزییات', sortable: true, type: 'integer', visible: true },
            { name: 'virtual_CampaignItem.Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'IsNecessary', displayName: 'ضروری است', sortable: true, type: 'string', visible: true },
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

    campaignDetailItem.test = 'false';

    campaignDetailItem.gridOptions.reGetAll = function () {
        campaignDetailItem.init();
    }

    campaignDetailItem.gridOptions.onRowSelected = function () { }

    campaignDetailItem.columnCheckbox = false;
    campaignDetailItem.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (campaignDetailItem.gridOptions.columnCheckbox) {
            for (var i = 0; i < campaignDetailItem.gridOptions.columns.length; i++) {
                //campaignDetailItem.gridOptions.columns[i].visible = $("#" + campaignDetailItem.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + campaignDetailItem.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                campaignDetailItem.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = campaignDetailItem.gridOptions.columns;
            for (var i = 0; i < campaignDetailItem.gridOptions.columns.length; i++) {
                campaignDetailItem.gridOptions.columns[i].visible = true;
                var element = $("#" + campaignDetailItem.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + campaignDetailItem.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < campaignDetailItem.gridOptions.columns.length; i++) {
            console.log(campaignDetailItem.gridOptions.columns[i].name.concat(".visible: "), campaignDetailItem.gridOptions.columns[i].visible);
        }
        campaignDetailItem.gridOptions.columnCheckbox = !campaignDetailItem.gridOptions.columnCheckbox;
    }
   
    //Export Report 
    campaignDetailItem.exportFile = function () {
        campaignDetailItem.addRequested = true;
        campaignDetailItem.gridOptions.advancedSearchData.engine.ExportFile = campaignDetailItem.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailItem/exportfile', campaignDetailItem.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            campaignDetailItem.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignDetailItem.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //campaignDetailItem.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    campaignDetailItem.toggleExportForm = function () {
        campaignDetailItem.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        campaignDetailItem.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        campaignDetailItem.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        campaignDetailItem.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        campaignDetailItem.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCampaign/campaignDetailItem/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    campaignDetailItem.rowCountChanged = function () {
        if (!angular.isDefined(campaignDetailItem.ExportFileClass.RowCount) || campaignDetailItem.ExportFileClass.RowCount > 5000)
            campaignDetailItem.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    campaignDetailItem.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"campaignDetailItem/count", campaignDetailItem.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            campaignDetailItem.addRequested = false;
            rashaErManage.checkAction(response);
            campaignDetailItem.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            campaignDetailItem.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

