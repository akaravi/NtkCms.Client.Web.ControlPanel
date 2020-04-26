app.controller("campaignDetailProgramController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var campaignDetailProgram = this;
    campaignDetailProgram.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    campaignDetailProgram.UninversalMenus = [];
    campaignDetailProgram.selectUniversalMenuOnUndetectableKey = true;

    if (itemRecordStatus != undefined) campaignDetailProgram.itemRecordStatus = itemRecordStatus;

    // Many To Many
    // MemberUserGroup  جدول واسط
    // LinkMemberUserId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    campaignDetailProgram.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    

    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        campaignDetailProgram.memberGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    //campaignDetailProgram.hasInMany2Many = function (OtherTable) {
    //    if (campaignDetailProgram.selectedMemberUser == null || campaignDetailProgram.selectedMemberUser[thisTableFieldICollection] == undefined || campaignDetailProgram.selectedMemberUser[thisTableFieldICollection] == null) return false;
    //    return objectFindByKey(campaignDetailProgram.selectedMemberUser[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    //};
    campaignDetailProgram.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (campaignDetailProgram.hasInMany2Many(OtherTable)) {
            //var index = campaignDetailProgram.selectedMemberUser[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(campaignDetailProgram.selectedMemberUser[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            campaignDetailProgram.selectedMemberUser[thisTableFieldICollection].splice(index, 1);
        } else {
            campaignDetailProgram.selectedMemberUser[thisTableFieldICollection].push(obj);
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

    campaignDetailProgram.init = function () {
        campaignDetailProgram.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = campaignDetailProgram.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"campaignDetailProgram/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetailProgram.busyIndicator.isActive = false;
            campaignDetailProgram.ListItems = response.ListItems;
            campaignDetailProgram.gridOptions.fillData(campaignDetailProgram.ListItems, response.resultAccess);
            campaignDetailProgram.gridOptions.currentPageNumber = response.CurrentPageNumber;
            campaignDetailProgram.gridOptions.totalRowCount = response.TotalRowCount;
            campaignDetailProgram.gridOptions.rowPerPage = response.RowPerPage;
            campaignDetailProgram.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            campaignDetailProgram.busyIndicator.isActive = false;
            campaignDetailProgram.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    campaignDetailProgram.busyIndicator.isActive = true;
    campaignDetailProgram.addRequested = false;
    campaignDetailProgram.openAddModal = function () {
        campaignDetailProgram.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailProgram/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetailProgram.busyIndicator.isActive = false;
            campaignDetailProgram.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCampaign/campaignDetailProgram/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignDetailProgram.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    campaignDetailProgram.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        campaignDetailProgram.busyIndicator.isActive = true;
        campaignDetailProgram.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailProgram/add', campaignDetailProgram.selectedItem, 'POST').success(function (response) {
            campaignDetailProgram.addRequested = false;
            campaignDetailProgram.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignDetailProgram.gridOptions.advancedSearchData.engine.Filters = null;
                campaignDetailProgram.gridOptions.advancedSearchData.engine.Filters = [];
                campaignDetailProgram.ListItems.unshift(response.Item);
                campaignDetailProgram.gridOptions.fillData(campaignDetailProgram.ListItems);
                campaignDetailProgram.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignDetailProgram.busyIndicator.isActive = false;
            campaignDetailProgram.addRequested = false;
        });
    }

    campaignDetailProgram.openEditModal = function () {

        campaignDetailProgram.modalTitle = 'ویرایش';
        if (!campaignDetailProgram.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailProgram/GetOne', campaignDetailProgram.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetailProgram.selectedItem = response.Item;
            if (campaignDetailProgram
                .LinkUniversalMenuIdOnUndetectableKey >
                0) campaignDetailProgram.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCampaign/campaignDetailProgram/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    campaignDetailProgram.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        campaignDetailProgram.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailProgram/edit', campaignDetailProgram.selectedItem, 'PUT').success(function (response) {
            campaignDetailProgram.addRequested = true;
            rashaErManage.checkAction(response);
            campaignDetailProgram.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                campaignDetailProgram.addRequested = false;
                campaignDetailProgram.replaceItem(campaignDetailProgram.selectedItem.Id, response.Item);
                campaignDetailProgram.gridOptions.fillData(campaignDetailProgram.ListItems);
                campaignDetailProgram.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignDetailProgram.addRequested = false;
            campaignDetailProgram.busyIndicator.isActive = false;
        });
    }

    campaignDetailProgram.closeModal = function () {
        $modalStack.dismissAll();
    };

    campaignDetailProgram.replaceItem = function (oldId, newItem) {
        angular.forEach(campaignDetailProgram.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = campaignDetailProgram.ListItems.indexOf(item);
                campaignDetailProgram.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            campaignDetailProgram.ListItems.unshift(newItem);
    }
    // delete content
    campaignDetailProgram.deleteRow = function () {
        if (!campaignDetailProgram.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                campaignDetailProgram.busyIndicator.isActive = true;
                console.log(campaignDetailProgram.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailProgram/GetOne', campaignDetailProgram.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    campaignDetailProgram.selectedItemForDelete = response.Item;
                    console.log(campaignDetailProgram.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailProgram/delete', campaignDetailProgram.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        campaignDetailProgram.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            campaignDetailProgram.replaceItem(campaignDetailProgram.selectedItemForDelete.Id);
                            campaignDetailProgram.gridOptions.fillData(campaignDetailProgram.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        campaignDetailProgram.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    campaignDetailProgram.busyIndicator.isActive = false;
                });
            }
        });
    }

    campaignDetailProgram.searchData = function () {
        campaignDetailProgram.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"campaignDetailProgram/getall", campaignDetailProgram.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetailProgram.categoryBusyIndicator.isActive = false;
            campaignDetailProgram.ListItems = response.ListItems;
            campaignDetailProgram.gridOptions.fillData(campaignDetailProgram.ListItems);
            campaignDetailProgram.gridOptions.currentPageNumber = response.CurrentPageNumber;
            campaignDetailProgram.gridOptions.totalRowCount = response.TotalRowCount;
            campaignDetailProgram.gridOptions.rowPerPage = response.RowPerPage;
            campaignDetailProgram.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            campaignDetailProgram.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //campaignDetailProgram.gridOptions.searchData();

    }
    campaignDetailProgram.LinkCampaignDetailIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkCampaignDetail',
        url: 'CampaignDetail',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: campaignDetailProgram,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
                { name: 'LinkCampaignDetailId', displayName: 'کد سیستمی جزییات', sortable: true, type: 'integer', visible: true },
            ]
        }
    }
   
    campaignDetailProgram.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkCampaignDetailId', displayName: 'کد سیستمی جزییات', sortable: true, type: 'integer', visible: true },
            { name: 'Program', displayName: 'برنامه', sortable: true, type: 'string', visible: true },
            { name: 'WebAddress', displayName: 'آدرس وب', sortable: true, type: 'string', visible: true },
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

    campaignDetailProgram.test = 'false';

    campaignDetailProgram.gridOptions.reGetAll = function () {
        campaignDetailProgram.init();
    }

    campaignDetailProgram.gridOptions.onRowSelected = function () { }

    campaignDetailProgram.columnCheckbox = false;
    campaignDetailProgram.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (campaignDetailProgram.gridOptions.columnCheckbox) {
            for (var i = 0; i < campaignDetailProgram.gridOptions.columns.length; i++) {
                //campaignDetailProgram.gridOptions.columns[i].visible = $("#" + campaignDetailProgram.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + campaignDetailProgram.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                campaignDetailProgram.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = campaignDetailProgram.gridOptions.columns;
            for (var i = 0; i < campaignDetailProgram.gridOptions.columns.length; i++) {
                campaignDetailProgram.gridOptions.columns[i].visible = true;
                var element = $("#" + campaignDetailProgram.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + campaignDetailProgram.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < campaignDetailProgram.gridOptions.columns.length; i++) {
            console.log(campaignDetailProgram.gridOptions.columns[i].name.concat(".visible: "), campaignDetailProgram.gridOptions.columns[i].visible);
        }
        campaignDetailProgram.gridOptions.columnCheckbox = !campaignDetailProgram.gridOptions.columnCheckbox;
    }
   
    //Export Report 
    campaignDetailProgram.exportFile = function () {
        campaignDetailProgram.addRequested = true;
        campaignDetailProgram.gridOptions.advancedSearchData.engine.ExportFile = campaignDetailProgram.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailProgram/exportfile', campaignDetailProgram.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            campaignDetailProgram.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignDetailProgram.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //campaignDetailProgram.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    campaignDetailProgram.toggleExportForm = function () {
        campaignDetailProgram.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        campaignDetailProgram.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        campaignDetailProgram.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        campaignDetailProgram.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        campaignDetailProgram.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCampaign/campaignDetailProgram/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    campaignDetailProgram.rowCountChanged = function () {
        if (!angular.isDefined(campaignDetailProgram.ExportFileClass.RowCount) || campaignDetailProgram.ExportFileClass.RowCount > 5000)
            campaignDetailProgram.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    campaignDetailProgram.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"campaignDetailProgram/count", campaignDetailProgram.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            campaignDetailProgram.addRequested = false;
            rashaErManage.checkAction(response);
            campaignDetailProgram.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            campaignDetailProgram.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

