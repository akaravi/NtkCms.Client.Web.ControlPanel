app.controller("discountGroupController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var discountGroup = this;
    discountGroup.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    discountGroup.UninversalMenus = [];
    discountGroup.selectUniversalMenuOnUndetectableKey = true;

    if (itemRecordStatus != undefined) discountGroup.itemRecordStatus = itemRecordStatus;

    // Many To Many
    // MemberUserGroup  جدول واسط
    // LinkMemberUserId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    discountGroup.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    

    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        discountGroup.memberGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    discountGroup.hasInMany2Many = function (OtherTable) {
        if (discountGroup.selectedMemberUser == null || discountGroup.selectedMemberUser[thisTableFieldICollection] == undefined || discountGroup.selectedMemberUser[thisTableFieldICollection] == null) return false;
        return objectFindByKey(discountGroup.selectedMemberUser[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    };
    discountGroup.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (discountGroup.hasInMany2Many(OtherTable)) {
            //var index = discountGroup.selectedMemberUser[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(discountGroup.selectedMemberUser[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            discountGroup.selectedMemberUser[thisTableFieldICollection].splice(index, 1);
        } else {
            discountGroup.selectedMemberUser[thisTableFieldICollection].push(obj);
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

    discountGroup.init = function () {
        discountGroup.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = discountGroup.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"DiscountGroup/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            discountGroup.busyIndicator.isActive = false;
            discountGroup.ListItems = response.ListItems;
            discountGroup.gridOptions.fillData(discountGroup.ListItems, response.resultAccess);
            discountGroup.gridOptions.currentPageNumber = response.CurrentPageNumber;
            discountGroup.gridOptions.totalRowCount = response.TotalRowCount;
            discountGroup.gridOptions.rowPerPage = response.RowPerPage;
            discountGroup.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            discountGroup.busyIndicator.isActive = false;
            discountGroup.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    discountGroup.busyIndicator.isActive = true;
    discountGroup.addRequested = false;
    discountGroup.openAddModal = function () {
        discountGroup.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'DiscountGroup/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            discountGroup.busyIndicator.isActive = false;
            discountGroup.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDiscount/DiscountGroup/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountGroup.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    discountGroup.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        discountGroup.busyIndicator.isActive = true;
        discountGroup.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'DiscountGroup/add', discountGroup.selectedItem, 'POST').success(function (response) {
            discountGroup.addRequested = false;
            discountGroup.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                discountGroup.gridOptions.advancedSearchData.engine.Filters = null;
                discountGroup.gridOptions.advancedSearchData.engine.Filters = [];
                discountGroup.ListItems.unshift(response.Item);
                discountGroup.gridOptions.fillData(discountGroup.ListItems);
                discountGroup.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountGroup.busyIndicator.isActive = false;
            discountGroup.addRequested = false;
        });
    }

    discountGroup.openEditModal = function () {

        discountGroup.modalTitle = 'ویرایش';
        if (!discountGroup.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'DiscountGroup/GetOne', discountGroup.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            discountGroup.selectedItem = response.Item;
            if (discountGroup
                .LinkUniversalMenuIdOnUndetectableKey >
                0) discountGroup.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDiscount/DiscountGroup/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    discountGroup.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        discountGroup.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'DiscountGroup/edit', discountGroup.selectedItem, 'PUT').success(function (response) {
            discountGroup.addRequested = true;
            rashaErManage.checkAction(response);
            discountGroup.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                discountGroup.addRequested = false;
                discountGroup.replaceItem(discountGroup.selectedItem.Id, response.Item);
                discountGroup.gridOptions.fillData(discountGroup.ListItems);
                discountGroup.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountGroup.addRequested = false;
            discountGroup.busyIndicator.isActive = false;
        });
    }

    discountGroup.closeModal = function () {
        $modalStack.dismissAll();
    };

    discountGroup.replaceItem = function (oldId, newItem) {
        angular.forEach(discountGroup.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = discountGroup.ListItems.indexOf(item);
                discountGroup.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            discountGroup.ListItems.unshift(newItem);
    }
    // delete content
    discountGroup.deleteRow = function () {
        if (!discountGroup.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                discountGroup.busyIndicator.isActive = true;
                
                ajax.call(cmsServerConfig.configApiServerPath+'DiscountGroup/GetOne', discountGroup.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    discountGroup.selectedItemForDelete = response.Item;
                    
                    ajax.call(cmsServerConfig.configApiServerPath+'DiscountGroup/delete', discountGroup.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        discountGroup.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            discountGroup.replaceItem(discountGroup.selectedItemForDelete.Id);
                            discountGroup.gridOptions.fillData(discountGroup.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        discountGroup.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    discountGroup.busyIndicator.isActive = false;
                });
            }
        });
    }

    discountGroup.searchData = function () {
        discountGroup.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"discountGroup/getall", discountGroup.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            discountGroup.categoryBusyIndicator.isActive = false;
            discountGroup.ListItems = response.ListItems;
            discountGroup.gridOptions.fillData(discountGroup.ListItems);
            discountGroup.gridOptions.currentPageNumber = response.CurrentPageNumber;
            discountGroup.gridOptions.totalRowCount = response.TotalRowCount;
            discountGroup.gridOptions.rowPerPage = response.RowPerPage;
            discountGroup.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            discountGroup.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //discountGroup.gridOptions.searchData();

    }

    discountGroup.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: true },
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

    discountGroup.test = 'false';

    discountGroup.gridOptions.reGetAll = function () {
        discountGroup.init();
    }

    discountGroup.gridOptions.onRowSelected = function () { }

    discountGroup.columnCheckbox = false;
    discountGroup.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (discountGroup.gridOptions.columnCheckbox) {
            for (var i = 0; i < discountGroup.gridOptions.columns.length; i++) {
                //discountGroup.gridOptions.columns[i].visible = $("#" + discountGroup.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + discountGroup.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                discountGroup.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = discountGroup.gridOptions.columns;
            for (var i = 0; i < discountGroup.gridOptions.columns.length; i++) {
                discountGroup.gridOptions.columns[i].visible = true;
                var element = $("#" + discountGroup.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + discountGroup.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < discountGroup.gridOptions.columns.length; i++) {
            console.log(discountGroup.gridOptions.columns[i].name.concat(".visible: "), discountGroup.gridOptions.columns[i].visible);
        }
        discountGroup.gridOptions.columnCheckbox = !discountGroup.gridOptions.columnCheckbox;
    }
   
    //Export Report 
    discountGroup.exportFile = function () {
        discountGroup.addRequested = true;
        discountGroup.gridOptions.advancedSearchData.engine.ExportFile = discountGroup.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'DiscountGroup/exportfile', discountGroup.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            discountGroup.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                discountGroup.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //discountGroup.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    discountGroup.toggleExportForm = function () {
        discountGroup.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        discountGroup.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        discountGroup.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        discountGroup.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        discountGroup.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleDiscount/DiscountGroup/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    discountGroup.rowCountChanged = function () {
        if (!angular.isDefined(discountGroup.ExportFileClass.RowCount) || discountGroup.ExportFileClass.RowCount > 5000)
            discountGroup.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    discountGroup.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"DiscountGroup/count", discountGroup.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            discountGroup.addRequested = false;
            rashaErManage.checkAction(response);
            discountGroup.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            discountGroup.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

