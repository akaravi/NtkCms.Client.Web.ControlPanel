app.controller("discountSerialCardFlowGroupController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var discountSerialCardFlowGroup = this;
    discountSerialCardFlowGroup.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    discountSerialCardFlowGroup.UninversalMenus = [];
    discountSerialCardFlowGroup.selectUniversalMenuOnUndetectableKey = true;

    if (itemRecordStatus != undefined) discountSerialCardFlowGroup.itemRecordStatus = itemRecordStatus;

    // Many To Many
    // MemberUserGroup  جدول واسط
    // LinkMemberUserId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    discountSerialCardFlowGroup.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    

    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        discountSerialCardFlowGroup.memberGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    discountSerialCardFlowGroup.hasInMany2Many = function (OtherTable) {
        if (discountSerialCardFlowGroup.selectedMemberUser == null || discountSerialCardFlowGroup.selectedMemberUser[thisTableFieldICollection] == undefined || discountSerialCardFlowGroup.selectedMemberUser[thisTableFieldICollection] == null) return false;
        return objectFindByKey(discountSerialCardFlowGroup.selectedMemberUser[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    };
    discountSerialCardFlowGroup.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (discountSerialCardFlowGroup.hasInMany2Many(OtherTable)) {
            //var index = discountSerialCardFlowGroup.selectedMemberUser[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(discountSerialCardFlowGroup.selectedMemberUser[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            discountSerialCardFlowGroup.selectedMemberUser[thisTableFieldICollection].splice(index, 1);
        } else {
            discountSerialCardFlowGroup.selectedMemberUser[thisTableFieldICollection].push(obj);
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

    discountSerialCardFlowGroup.init = function () {
        discountSerialCardFlowGroup.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = discountSerialCardFlowGroup.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"DiscountSerialCardFlowGroup/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            discountSerialCardFlowGroup.busyIndicator.isActive = false;
            discountSerialCardFlowGroup.ListItems = response.ListItems;
            discountSerialCardFlowGroup.gridOptions.fillData(discountSerialCardFlowGroup.ListItems, response.resultAccess);
            discountSerialCardFlowGroup.gridOptions.currentPageNumber = response.CurrentPageNumber;
            discountSerialCardFlowGroup.gridOptions.totalRowCount = response.TotalRowCount;
            discountSerialCardFlowGroup.gridOptions.rowPerPage = response.RowPerPage;
            discountSerialCardFlowGroup.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            discountSerialCardFlowGroup.busyIndicator.isActive = false;
            discountSerialCardFlowGroup.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    discountSerialCardFlowGroup.busyIndicator.isActive = true;
    discountSerialCardFlowGroup.addRequested = false;
    discountSerialCardFlowGroup.openAddModal = function () {
        discountSerialCardFlowGroup.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'DiscountSerialCardFlowGroup/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            discountSerialCardFlowGroup.busyIndicator.isActive = false;
            discountSerialCardFlowGroup.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDiscount/discountSerialCardFlowGroup/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountSerialCardFlowGroup.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    discountSerialCardFlowGroup.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        discountSerialCardFlowGroup.busyIndicator.isActive = true;
        discountSerialCardFlowGroup.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'DiscountSerialCardFlowGroup/add', discountSerialCardFlowGroup.selectedItem, 'POST').success(function (response) {
            discountSerialCardFlowGroup.addRequested = false;
            discountSerialCardFlowGroup.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                discountSerialCardFlowGroup.gridOptions.advancedSearchData.engine.Filters = null;
                discountSerialCardFlowGroup.gridOptions.advancedSearchData.engine.Filters = [];
                discountSerialCardFlowGroup.ListItems.unshift(response.Item);
                discountSerialCardFlowGroup.gridOptions.fillData(discountSerialCardFlowGroup.ListItems);
                discountSerialCardFlowGroup.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountSerialCardFlowGroup.busyIndicator.isActive = false;
            discountSerialCardFlowGroup.addRequested = false;
        });
    }

    discountSerialCardFlowGroup.openEditModal = function () {

        discountSerialCardFlowGroup.modalTitle = 'ویرایش';
        if (!discountSerialCardFlowGroup.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'DiscountSerialCardFlowGroup/GetOne', discountSerialCardFlowGroup.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            discountSerialCardFlowGroup.selectedItem = response.Item;
            if (discountSerialCardFlowGroup
                .LinkUniversalMenuIdOnUndetectableKey >
                0) discountSerialCardFlowGroup.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDiscount/discountSerialCardFlowGroup/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    discountSerialCardFlowGroup.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        discountSerialCardFlowGroup.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'DiscountSerialCardFlowGroup/edit', discountSerialCardFlowGroup.selectedItem, 'PUT').success(function (response) {
            discountSerialCardFlowGroup.addRequested = true;
            rashaErManage.checkAction(response);
            discountSerialCardFlowGroup.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                discountSerialCardFlowGroup.addRequested = false;
                discountSerialCardFlowGroup.replaceItem(discountSerialCardFlowGroup.selectedItem.Id, response.Item);
                discountSerialCardFlowGroup.gridOptions.fillData(discountSerialCardFlowGroup.ListItems);
                discountSerialCardFlowGroup.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountSerialCardFlowGroup.addRequested = false;
            discountSerialCardFlowGroup.busyIndicator.isActive = false;
        });
    }

    discountSerialCardFlowGroup.closeModal = function () {
        $modalStack.dismissAll();
    };

    discountSerialCardFlowGroup.replaceItem = function (oldId, newItem) {
        angular.forEach(discountSerialCardFlowGroup.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = discountSerialCardFlowGroup.ListItems.indexOf(item);
                discountSerialCardFlowGroup.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            discountSerialCardFlowGroup.ListItems.unshift(newItem);
    }
    // delete content
    discountSerialCardFlowGroup.deleteRow = function () {
        if (!discountSerialCardFlowGroup.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                discountSerialCardFlowGroup.busyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath+'DiscountSerialCardFlowGroup/GetOne', discountSerialCardFlowGroup.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    discountSerialCardFlowGroup.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'DiscountSerialCardFlowGroup/delete', discountSerialCardFlowGroup.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        discountSerialCardFlowGroup.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            discountSerialCardFlowGroup.replaceItem(discountSerialCardFlowGroup.selectedItemForDelete.Id);
                            discountSerialCardFlowGroup.gridOptions.fillData(discountSerialCardFlowGroup.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        discountSerialCardFlowGroup.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    discountSerialCardFlowGroup.busyIndicator.isActive = false;
                });
            }
        });
    }

    discountSerialCardFlowGroup.searchData = function () {
        discountSerialCardFlowGroup.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"DiscountSerialCardFlowGroup/getall", discountSerialCardFlowGroup.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            discountSerialCardFlowGroup.categoryBusyIndicator.isActive = false;
            discountSerialCardFlowGroup.ListItems = response.ListItems;
            discountSerialCardFlowGroup.gridOptions.fillData(discountSerialCardFlowGroup.ListItems);
            discountSerialCardFlowGroup.gridOptions.currentPageNumber = response.CurrentPageNumber;
            discountSerialCardFlowGroup.gridOptions.totalRowCount = response.TotalRowCount;
            discountSerialCardFlowGroup.gridOptions.rowPerPage = response.RowPerPage;
            discountSerialCardFlowGroup.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            discountSerialCardFlowGroup.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //discountSerialCardFlowGroup.gridOptions.searchData();

    }

    discountSerialCardFlowGroup.gridOptions = {
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

    discountSerialCardFlowGroup.test = 'false';

    discountSerialCardFlowGroup.gridOptions.reGetAll = function () {
        discountSerialCardFlowGroup.init();
    }

    discountSerialCardFlowGroup.gridOptions.onRowSelected = function () { }

    discountSerialCardFlowGroup.columnCheckbox = false;
    discountSerialCardFlowGroup.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (discountSerialCardFlowGroup.gridOptions.columnCheckbox) {
            for (var i = 0; i < discountSerialCardFlowGroup.gridOptions.columns.length; i++) {
                //discountSerialCardFlowGroup.gridOptions.columns[i].visible = $("#" + discountSerialCardFlowGroup.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + discountSerialCardFlowGroup.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                discountSerialCardFlowGroup.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = discountSerialCardFlowGroup.gridOptions.columns;
            for (var i = 0; i < discountSerialCardFlowGroup.gridOptions.columns.length; i++) {
                discountSerialCardFlowGroup.gridOptions.columns[i].visible = true;
                var element = $("#" + discountSerialCardFlowGroup.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + discountSerialCardFlowGroup.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < discountSerialCardFlowGroup.gridOptions.columns.length; i++) {
            console.log(discountSerialCardFlowGroup.gridOptions.columns[i].name.concat(".visible: "), discountSerialCardFlowGroup.gridOptions.columns[i].visible);
        }
        discountSerialCardFlowGroup.gridOptions.columnCheckbox = !discountSerialCardFlowGroup.gridOptions.columnCheckbox;
    }
   
    //Export Report 
    discountSerialCardFlowGroup.exportFile = function () {
        discountSerialCardFlowGroup.addRequested = true;
        discountSerialCardFlowGroup.gridOptions.advancedSearchData.engine.ExportFile = discountSerialCardFlowGroup.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'DiscountSerialCardFlowGroup/exportfile', discountSerialCardFlowGroup.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            discountSerialCardFlowGroup.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                discountSerialCardFlowGroup.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //discountSerialCardFlowGroup.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    discountSerialCardFlowGroup.toggleExportForm = function () {
        discountSerialCardFlowGroup.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        discountSerialCardFlowGroup.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        discountSerialCardFlowGroup.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        discountSerialCardFlowGroup.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        discountSerialCardFlowGroup.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleDiscount/discountSerialCardFlowGroup/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    discountSerialCardFlowGroup.rowCountChanged = function () {
        if (!angular.isDefined(discountSerialCardFlowGroup.ExportFileClass.RowCount) || discountSerialCardFlowGroup.ExportFileClass.RowCount > 5000)
            discountSerialCardFlowGroup.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    discountSerialCardFlowGroup.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"DiscountSerialCardFlowGroup/count", discountSerialCardFlowGroup.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            discountSerialCardFlowGroup.addRequested = false;
            rashaErManage.checkAction(response);
            discountSerialCardFlowGroup.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            discountSerialCardFlowGroup.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

