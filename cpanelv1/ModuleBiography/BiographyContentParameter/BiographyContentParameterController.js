app.controller("biographyContentParameterController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var biographyContentParameter = this;
    biographyContentParameter.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    biographyContentParameter.UninversalMenus = [];
    biographyContentParameter.selectUniversalMenuOnUndetectableKey = true;

    if (itemRecordStatus != undefined) biographyContentParameter.itemRecordStatus = itemRecordStatus;

    // Many To Many
    // MemberUserGroup  جدول واسط
    // LinkMemberUserId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    biographyContentParameter.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    

    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        biographyContentParameter.memberGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    biographyContentParameter.hasInMany2Many = function (OtherTable) {
        if (biographyContentParameter.selectedMemberUser == null || biographyContentParameter.selectedMemberUser[thisTableFieldICollection] == undefined || biographyContentParameter.selectedMemberUser[thisTableFieldICollection] == null) return false;
        return objectFindByKey(biographyContentParameter.selectedMemberUser[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    };
    biographyContentParameter.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (biographyContentParameter.hasInMany2Many(OtherTable)) {
            //var index = biographyContentParameter.selectedMemberUser[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(biographyContentParameter.selectedMemberUser[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            biographyContentParameter.selectedMemberUser[thisTableFieldICollection].splice(index, 1);
        } else {
            biographyContentParameter.selectedMemberUser[thisTableFieldICollection].push(obj);
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

    biographyContentParameter.init = function () {
        biographyContentParameter.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = biographyContentParameter.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"biographyContentParameter/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            biographyContentParameter.busyIndicator.isActive = false;
            biographyContentParameter.ListItems = response.ListItems;
            biographyContentParameter.gridOptions.fillData(biographyContentParameter.ListItems, response.resultAccess);
            biographyContentParameter.gridOptions.currentPageNumber = response.CurrentPageNumber;
            biographyContentParameter.gridOptions.totalRowCount = response.TotalRowCount;
            biographyContentParameter.gridOptions.rowPerPage = response.RowPerPage;
            biographyContentParameter.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            biographyContentParameter.busyIndicator.isActive = false;
            biographyContentParameter.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    biographyContentParameter.busyIndicator.isActive = true;
    biographyContentParameter.addRequested = false;
    biographyContentParameter.openAddModal = function () {
        biographyContentParameter.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'biographyContentParameter/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            biographyContentParameter.busyIndicator.isActive = false;
            biographyContentParameter.selectedItem = response.Item;
            $modal.open({
                templateUrl: '/views/Modulebiography/biographyContentParameter/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyContentParameter.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    biographyContentParameter.addNewRow = function (frm) {
        if (frm.$invalid)
            return;
        biographyContentParameter.busyIndicator.isActive = true;
        biographyContentParameter.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'biographyContentParameter/add', biographyContentParameter.selectedItem, 'POST').success(function (response) {
            biographyContentParameter.addRequested = false;
            biographyContentParameter.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                biographyContentParameter.gridOptions.advancedSearchData.engine.Filters = null;
                biographyContentParameter.gridOptions.advancedSearchData.engine.Filters = [];
                biographyContentParameter.ListItems.unshift(response.Item);
                biographyContentParameter.gridOptions.fillData(biographyContentParameter.ListItems);
                biographyContentParameter.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyContentParameter.busyIndicator.isActive = false;
            biographyContentParameter.addRequested = false;
        });
    }

    biographyContentParameter.openEditModal = function () {

        biographyContentParameter.modalTitle = 'ویرایش';
        if (!biographyContentParameter.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک ردیف جهت ویرایش انتخاب کنید");
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'biographyContentParameter/GetOne', biographyContentParameter.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            biographyContentParameter.selectedItem = response.Item;
            if (biographyContentParameter
                .LinkUniversalMenuIdOnUndetectableKey >
                0) biographyContentParameter.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: '/views/Modulebiography/biographyContentParameter/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    biographyContentParameter.editRow = function (frm) {
        if (frm.$invalid)
            return;
        biographyContentParameter.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'biographyContentParameter/edit', biographyContentParameter.selectedItem, 'PUT').success(function (response) {
            biographyContentParameter.addRequested = true;
            rashaErManage.checkAction(response);
            biographyContentParameter.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                biographyContentParameter.addRequested = false;
                biographyContentParameter.replaceItem(biographyContentParameter.selectedItem.Id, response.Item);
                biographyContentParameter.gridOptions.fillData(biographyContentParameter.ListItems);
                biographyContentParameter.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyContentParameter.addRequested = false;
            biographyContentParameter.busyIndicator.isActive = false;
        });
    }

    biographyContentParameter.closeModal = function () {
        $modalStack.dismissAll();
    };

    biographyContentParameter.replaceItem = function (oldId, newItem) {
        angular.forEach(biographyContentParameter.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = biographyContentParameter.ListItems.indexOf(item);
                biographyContentParameter.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            biographyContentParameter.ListItems.unshift(newItem);
    }
    // delete content
    biographyContentParameter.deleteRow = function () {
        if (!biographyContentParameter.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک ردیف جهت حذف انتخاب کنید");
            return;
        }
        rashaErManage.showYesNo("هشدار", "آیا می خواهید این مشخصه را حذف کنید", function (isConfirmed) {
            if (isConfirmed) {
                biographyContentParameter.busyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath+'biographyContentParameter/GetOne', biographyContentParameter.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    biographyContentParameter.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'biographyContentParameter/delete', biographyContentParameter.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        biographyContentParameter.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            biographyContentParameter.replaceItem(biographyContentParameter.selectedItemForDelete.Id);
                            biographyContentParameter.gridOptions.fillData(biographyContentParameter.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        biographyContentParameter.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    biographyContentParameter.busyIndicator.isActive = false;
                });
            }
        });
    }

    biographyContentParameter.searchData = function () {
        biographyContentParameter.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"biographyContentParameter/getall", biographyContentParameter.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            biographyContentParameter.categoryBusyIndicator.isActive = false;
            biographyContentParameter.ListItems = response.ListItems;
            biographyContentParameter.gridOptions.fillData(biographyContentParameter.ListItems);
            biographyContentParameter.gridOptions.currentPageNumber = response.CurrentPageNumber;
            biographyContentParameter.gridOptions.totalRowCount = response.TotalRowCount;
            biographyContentParameter.gridOptions.rowPerPage = response.RowPerPage;
            biographyContentParameter.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            biographyContentParameter.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //biographyContentParameter.gridOptions.searchData();

    }
    biographyContentParameter.LinkContentParameterTypeIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkContentParameterTypeId',
        url: 'biographyContentParameterType',
        sortColumn: 'Id',
        sortType: 0,
        showAddDialog: false,
        filterText: 'Title',
        rowPerPage: 200,
        scope: biographyContentParameter,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true },
                { name: 'Title', displayName: 'عنوان', sortable: true }
            ]
        }
    }
    biographyContentParameter.LinkExternalCoreCmsSiteCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkExternalCoreCmsSiteCategoryId',
        url: 'CmsSiteCategory',
        sortColumn: 'Id',
        sortType: 0,
        showAddDialog: false,
        filterText: 'Title',
        rowPerPage: 200,
        scope: biographyContentParameter,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true },
                { name: 'Title', displayName: 'عنوان', sortable: true }
            ]
        }
    }
    biographyContentParameter.LinkModuleCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkModuleCategoryId',
        url: 'biographycategory',
        sortColumn: 'Id',
        sortType: 0,
        showAddDialog: false,
        filterText: 'Title',
        rowPerPage: 200,
        scope: biographyContentParameter,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true },
                { name: 'Title', displayName: 'عنوان', sortable: true }
            ]
        }
    }
    biographyContentParameter.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            { name: 'ParameterType', displayName: 'نوع پارامتر', sortable: true, type: 'string', visible: true },
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

    biographyContentParameter.test = 'false';

    biographyContentParameter.gridOptions.reGetAll = function () {
        biographyContentParameter.init();
    }

    biographyContentParameter.gridOptions.onRowSelected = function () { }

    biographyContentParameter.columnCheckbox = false;
    biographyContentParameter.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (biographyContentParameter.gridOptions.columnCheckbox) {
            for (var i = 0; i < biographyContentParameter.gridOptions.columns.length; i++) {
                //biographyContentParameter.gridOptions.columns[i].visible = $("#" + biographyContentParameter.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + biographyContentParameter.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                biographyContentParameter.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = biographyContentParameter.gridOptions.columns;
            for (var i = 0; i < biographyContentParameter.gridOptions.columns.length; i++) {
                biographyContentParameter.gridOptions.columns[i].visible = true;
                var element = $("#" + biographyContentParameter.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + biographyContentParameter.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < biographyContentParameter.gridOptions.columns.length; i++) {
            console.log(biographyContentParameter.gridOptions.columns[i].name.concat(".visible: "), biographyContentParameter.gridOptions.columns[i].visible);
        }
        biographyContentParameter.gridOptions.columnCheckbox = !biographyContentParameter.gridOptions.columnCheckbox;
    }
   
    //Export Report 
    biographyContentParameter.exportFile = function () {
        biographyContentParameter.addRequested = true;
        biographyContentParameter.gridOptions.advancedSearchData.engine.ExportFile = biographyContentParameter.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'biographyContentParameter/exportfile', biographyContentParameter.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            biographyContentParameter.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                biographyContentParameter.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //biographyContentParameter.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    biographyContentParameter.toggleExportForm = function () {
        biographyContentParameter.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        biographyContentParameter.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        biographyContentParameter.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        biographyContentParameter.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        biographyContentParameter.exportDownloadLink = null;
        $modal.open({
            templateUrl: '/views/Modulebiography/biographyContentParameter/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    biographyContentParameter.rowCountChanged = function () {
        if (!angular.isDefined(biographyContentParameter.ExportFileClass.RowCount) || biographyContentParameter.ExportFileClass.RowCount > 5000)
            biographyContentParameter.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    biographyContentParameter.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"biographyContentParameter/count", biographyContentParameter.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            biographyContentParameter.addRequested = false;
            rashaErManage.checkAction(response);
            biographyContentParameter.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            biographyContentParameter.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

