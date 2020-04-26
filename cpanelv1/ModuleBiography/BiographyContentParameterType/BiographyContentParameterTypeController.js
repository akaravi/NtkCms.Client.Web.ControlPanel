app.controller("biographyContentParameterTypeController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var biographyContentParameterType = this;
    biographyContentParameterType.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    biographyContentParameterType.UninversalMenus = [];
    biographyContentParameterType.selectUniversalMenuOnUndetectableKey = true;

    if (itemRecordStatus != undefined) biographyContentParameterType.itemRecordStatus = itemRecordStatus;

    // Many To Many
    // MemberUserGroup  جدول واسط
    // LinkMemberUserId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    biographyContentParameterType.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    

    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        biographyContentParameterType.memberGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    biographyContentParameterType.hasInMany2Many = function (OtherTable) {
        if (biographyContentParameterType.selectedMemberUser == null || biographyContentParameterType.selectedMemberUser[thisTableFieldICollection] == undefined || biographyContentParameterType.selectedMemberUser[thisTableFieldICollection] == null) return false;
        return objectFindByKey(biographyContentParameterType.selectedMemberUser[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    };
    biographyContentParameterType.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (biographyContentParameterType.hasInMany2Many(OtherTable)) {
            //var index = biographyContentParameterType.selectedMemberUser[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(biographyContentParameterType.selectedMemberUser[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            biographyContentParameterType.selectedMemberUser[thisTableFieldICollection].splice(index, 1);
        } else {
            biographyContentParameterType.selectedMemberUser[thisTableFieldICollection].push(obj);
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

    biographyContentParameterType.init = function () {
        biographyContentParameterType.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = biographyContentParameterType.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"biographyContentParameterType/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            biographyContentParameterType.busyIndicator.isActive = false;
            biographyContentParameterType.ListItems = response.ListItems;
            biographyContentParameterType.gridOptions.fillData(biographyContentParameterType.ListItems, response.resultAccess);
            biographyContentParameterType.gridOptions.currentPageNumber = response.CurrentPageNumber;
            biographyContentParameterType.gridOptions.totalRowCount = response.TotalRowCount;
            biographyContentParameterType.gridOptions.rowPerPage = response.RowPerPage;
            biographyContentParameterType.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            biographyContentParameterType.busyIndicator.isActive = false;
            biographyContentParameterType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    biographyContentParameterType.busyIndicator.isActive = true;
    biographyContentParameterType.addRequested = false;
    biographyContentParameterType.openAddModal = function () {
        biographyContentParameterType.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'biographyContentParameterType/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            biographyContentParameterType.busyIndicator.isActive = false;
            biographyContentParameterType.selectedItem = response.Item;
            $modal.open({
                templateUrl: '/views/Modulebiography/biographyContentParameterType/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyContentParameterType.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    biographyContentParameterType.addNewRow = function (frm) {
        if (frm.$invalid)
            return;
        biographyContentParameterType.busyIndicator.isActive = true;
        biographyContentParameterType.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'biographyContentParameterType/add', biographyContentParameterType.selectedItem, 'POST').success(function (response) {
            biographyContentParameterType.addRequested = false;
            biographyContentParameterType.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                biographyContentParameterType.gridOptions.advancedSearchData.engine.Filters = null;
                biographyContentParameterType.gridOptions.advancedSearchData.engine.Filters = [];
                biographyContentParameterType.ListItems.unshift(response.Item);
                biographyContentParameterType.gridOptions.fillData(biographyContentParameterType.ListItems);
                biographyContentParameterType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyContentParameterType.busyIndicator.isActive = false;
            biographyContentParameterType.addRequested = false;
        });
    }

    biographyContentParameterType.openEditModal = function () {

        biographyContentParameterType.modalTitle = 'ویرایش';
        if (!biographyContentParameterType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک ردیف جهت ویرایش انتخاب کنید");
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'biographyContentParameterType/GetOne', biographyContentParameterType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            biographyContentParameterType.selectedItem = response.Item;
            if (biographyContentParameterType
                .LinkUniversalMenuIdOnUndetectableKey >
                0) biographyContentParameterType.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: '/views/Modulebiography/biographyContentParameterType/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    biographyContentParameterType.editRow = function (frm) {
        if (frm.$invalid)
            return;
        biographyContentParameterType.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'biographyContentParameterType/edit', biographyContentParameterType.selectedItem, 'PUT').success(function (response) {
            biographyContentParameterType.addRequested = true;
            rashaErManage.checkAction(response);
            biographyContentParameterType.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                biographyContentParameterType.addRequested = false;
                biographyContentParameterType.replaceItem(biographyContentParameterType.selectedItem.Id, response.Item);
                biographyContentParameterType.gridOptions.fillData(biographyContentParameterType.ListItems);
                biographyContentParameterType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyContentParameterType.addRequested = false;
            biographyContentParameterType.busyIndicator.isActive = false;
        });
    }

    biographyContentParameterType.closeModal = function () {
        $modalStack.dismissAll();
    };

    biographyContentParameterType.replaceItem = function (oldId, newItem) {
        angular.forEach(biographyContentParameterType.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = biographyContentParameterType.ListItems.indexOf(item);
                biographyContentParameterType.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            biographyContentParameterType.ListItems.unshift(newItem);
    }
    // delete content
    biographyContentParameterType.deleteRow = function () {
        if (!biographyContentParameterType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک ردیف جهت حذف انتخاب کنید");
            return;
        }
        rashaErManage.showYesNo("هشدار", "آیا می خواهید این مشخصه را حذف کنید", function (isConfirmed) {
            if (isConfirmed) {
                biographyContentParameterType.busyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath+'biographyContentParameterType/GetOne', biographyContentParameterType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    biographyContentParameterType.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'biographyContentParameterType/delete', biographyContentParameterType.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        biographyContentParameterType.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            biographyContentParameterType.replaceItem(biographyContentParameterType.selectedItemForDelete.Id);
                            biographyContentParameterType.gridOptions.fillData(biographyContentParameterType.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        biographyContentParameterType.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    biographyContentParameterType.busyIndicator.isActive = false;
                });
            }
        });
    }

    biographyContentParameterType.searchData = function () {
        biographyContentParameterType.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"biographyContentParameterType/getall", biographyContentParameterType.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            biographyContentParameterType.categoryBusyIndicator.isActive = false;
            biographyContentParameterType.ListItems = response.ListItems;
            biographyContentParameterType.gridOptions.fillData(biographyContentParameterType.ListItems);
            biographyContentParameterType.gridOptions.currentPageNumber = response.CurrentPageNumber;
            biographyContentParameterType.gridOptions.totalRowCount = response.TotalRowCount;
            biographyContentParameterType.gridOptions.rowPerPage = response.RowPerPage;
            biographyContentParameterType.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            biographyContentParameterType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //biographyContentParameterType.gridOptions.searchData();

    }

    biographyContentParameterType.gridOptions = {
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

    biographyContentParameterType.test = 'false';

    biographyContentParameterType.gridOptions.reGetAll = function () {
        biographyContentParameterType.init();
    }

    biographyContentParameterType.gridOptions.onRowSelected = function () { }

    biographyContentParameterType.columnCheckbox = false;
    biographyContentParameterType.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (biographyContentParameterType.gridOptions.columnCheckbox) {
            for (var i = 0; i < biographyContentParameterType.gridOptions.columns.length; i++) {
                //biographyContentParameterType.gridOptions.columns[i].visible = $("#" + biographyContentParameterType.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + biographyContentParameterType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                biographyContentParameterType.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = biographyContentParameterType.gridOptions.columns;
            for (var i = 0; i < biographyContentParameterType.gridOptions.columns.length; i++) {
                biographyContentParameterType.gridOptions.columns[i].visible = true;
                var element = $("#" + biographyContentParameterType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + biographyContentParameterType.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < biographyContentParameterType.gridOptions.columns.length; i++) {
            console.log(biographyContentParameterType.gridOptions.columns[i].name.concat(".visible: "), biographyContentParameterType.gridOptions.columns[i].visible);
        }
        biographyContentParameterType.gridOptions.columnCheckbox = !biographyContentParameterType.gridOptions.columnCheckbox;
    }
   
    //Export Report 
    biographyContentParameterType.exportFile = function () {
        biographyContentParameterType.addRequested = true;
        biographyContentParameterType.gridOptions.advancedSearchData.engine.ExportFile = biographyContentParameterType.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'biographyContentParameterType/exportfile', biographyContentParameterType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            biographyContentParameterType.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                biographyContentParameterType.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //biographyContentParameterType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    biographyContentParameterType.toggleExportForm = function () {
        biographyContentParameterType.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        biographyContentParameterType.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        biographyContentParameterType.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        biographyContentParameterType.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        biographyContentParameterType.exportDownloadLink = null;
        $modal.open({
            templateUrl: '/views/Modulebiography/biographyContentParameterType/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    biographyContentParameterType.rowCountChanged = function () {
        if (!angular.isDefined(biographyContentParameterType.ExportFileClass.RowCount) || biographyContentParameterType.ExportFileClass.RowCount > 5000)
            biographyContentParameterType.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    biographyContentParameterType.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"biographyContentParameterType/count", biographyContentParameterType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            biographyContentParameterType.addRequested = false;
            rashaErManage.checkAction(response);
            biographyContentParameterType.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            biographyContentParameterType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

