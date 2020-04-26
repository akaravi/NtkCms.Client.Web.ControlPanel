app.controller("newsContentParameterController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var newsContentParameter = this;
    newsContentParameter.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    newsContentParameter.UninversalMenus = [];
    newsContentParameter.selectUniversalMenuOnUndetectableKey = true;

    if (itemRecordStatus != undefined) newsContentParameter.itemRecordStatus = itemRecordStatus;

    // Many To Many
    // MemberUserGroup  جدول واسط
    // LinkMemberUserId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    newsContentParameter.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    

    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        newsContentParameter.memberGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    newsContentParameter.hasInMany2Many = function (OtherTable) {
        if (newsContentParameter.selectedMemberUser == null || newsContentParameter.selectedMemberUser[thisTableFieldICollection] == undefined || newsContentParameter.selectedMemberUser[thisTableFieldICollection] == null) return false;
        return objectFindByKey(newsContentParameter.selectedMemberUser[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    };
    newsContentParameter.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (newsContentParameter.hasInMany2Many(OtherTable)) {
            //var index = newsContentParameter.selectedMemberUser[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(newsContentParameter.selectedMemberUser[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            newsContentParameter.selectedMemberUser[thisTableFieldICollection].splice(index, 1);
        } else {
            newsContentParameter.selectedMemberUser[thisTableFieldICollection].push(obj);
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

    newsContentParameter.init = function () {
        newsContentParameter.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = newsContentParameter.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"newsContentParameter/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            newsContentParameter.busyIndicator.isActive = false;
            newsContentParameter.ListItems = response.ListItems;
            newsContentParameter.gridOptions.fillData(newsContentParameter.ListItems, response.resultAccess);
            newsContentParameter.gridOptions.currentPageNumber = response.CurrentPageNumber;
            newsContentParameter.gridOptions.totalRowCount = response.TotalRowCount;
            newsContentParameter.gridOptions.rowPerPage = response.RowPerPage;
            newsContentParameter.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            newsContentParameter.busyIndicator.isActive = false;
            newsContentParameter.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    newsContentParameter.busyIndicator.isActive = true;
    newsContentParameter.addRequested = false;
    newsContentParameter.openAddModal = function () {
        newsContentParameter.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'newsContentParameter/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            newsContentParameter.busyIndicator.isActive = false;
            newsContentParameter.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulenews/newsContentParameter/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsContentParameter.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    newsContentParameter.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        newsContentParameter.busyIndicator.isActive = true;
        newsContentParameter.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'newsContentParameter/add', newsContentParameter.selectedItem, 'POST').success(function (response) {
            newsContentParameter.addRequested = false;
            newsContentParameter.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                newsContentParameter.gridOptions.advancedSearchData.engine.Filters = null;
                newsContentParameter.gridOptions.advancedSearchData.engine.Filters = [];
                newsContentParameter.ListItems.unshift(response.Item);
                newsContentParameter.gridOptions.fillData(newsContentParameter.ListItems);
                newsContentParameter.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsContentParameter.busyIndicator.isActive = false;
            newsContentParameter.addRequested = false;
        });
    }

    newsContentParameter.openEditModal = function () {

        newsContentParameter.modalTitle = 'ویرایش';
        if (!newsContentParameter.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'newsContentParameter/GetOne', newsContentParameter.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            newsContentParameter.selectedItem = response.Item;
            if (newsContentParameter
                .LinkUniversalMenuIdOnUndetectableKey >
                0) newsContentParameter.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/Modulenews/newsContentParameter/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    newsContentParameter.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        newsContentParameter.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'newsContentParameter/edit', newsContentParameter.selectedItem, 'PUT').success(function (response) {
            newsContentParameter.addRequested = true;
            rashaErManage.checkAction(response);
            newsContentParameter.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                newsContentParameter.addRequested = false;
                newsContentParameter.replaceItem(newsContentParameter.selectedItem.Id, response.Item);
                newsContentParameter.gridOptions.fillData(newsContentParameter.ListItems);
                newsContentParameter.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsContentParameter.addRequested = false;
            newsContentParameter.busyIndicator.isActive = false;
        });
    }

    newsContentParameter.closeModal = function () {
        $modalStack.dismissAll();
    };

    newsContentParameter.replaceItem = function (oldId, newItem) {
        angular.forEach(newsContentParameter.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = newsContentParameter.ListItems.indexOf(item);
                newsContentParameter.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            newsContentParameter.ListItems.unshift(newItem);
    }
    // delete content
    newsContentParameter.deleteRow = function () {
        if (!newsContentParameter.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                newsContentParameter.busyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath+'newsContentParameter/GetOne', newsContentParameter.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    newsContentParameter.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'newsContentParameter/delete', newsContentParameter.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        newsContentParameter.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            newsContentParameter.replaceItem(newsContentParameter.selectedItemForDelete.Id);
                            newsContentParameter.gridOptions.fillData(newsContentParameter.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        newsContentParameter.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    newsContentParameter.busyIndicator.isActive = false;
                });
            }
        });
    }

    newsContentParameter.searchData = function () {
        newsContentParameter.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"newsContentParameter/getall", newsContentParameter.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            newsContentParameter.categoryBusyIndicator.isActive = false;
            newsContentParameter.ListItems = response.ListItems;
            newsContentParameter.gridOptions.fillData(newsContentParameter.ListItems);
            newsContentParameter.gridOptions.currentPageNumber = response.CurrentPageNumber;
            newsContentParameter.gridOptions.totalRowCount = response.TotalRowCount;
            newsContentParameter.gridOptions.rowPerPage = response.RowPerPage;
            newsContentParameter.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            newsContentParameter.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //newsContentParameter.gridOptions.searchData();

    }
    newsContentParameter.LinkContentParameterTypeIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkContentParameterTypeId',
        url: 'newsContentParameterType',
        sortColumn: 'Id',
        sortType: 1,
        showAddDialog: false,
        filterText: 'Title',
        rowPerPage: 200,
        scope: newsContentParameter,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true },
                { name: 'Title', displayName: 'عنوان', sortable: true }
            ]
        }
    }
    newsContentParameter.LinkExternalCoreCmsSiteCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkExternalCoreCmsSiteCategoryId',
        url: 'CmsSiteCategory',
        sortColumn: 'Id',
        sortType: 0,
        showAddDialog: false,
        filterText: 'Title',
        rowPerPage: 200,
        scope: newsContentParameter,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true },
                { name: 'Title', displayName: 'عنوان', sortable: true }
            ]
        }
    }
    newsContentParameter.LinkModuleCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkModuleCategoryId',
        url: 'newscategory',
        sortColumn: 'Id',
        sortType: 0,
        showAddDialog: false,
        filterText: 'Title',
        rowPerPage: 200,
        scope: newsContentParameter,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true },
                { name: 'Title', displayName: 'عنوان', sortable: true }
            ]
        }
    }
    newsContentParameter.gridOptions = {
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

    newsContentParameter.test = 'false';

    newsContentParameter.gridOptions.reGetAll = function () {
        newsContentParameter.init();
    }

    newsContentParameter.gridOptions.onRowSelected = function () { }

    newsContentParameter.columnCheckbox = false;
    newsContentParameter.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (newsContentParameter.gridOptions.columnCheckbox) {
            for (var i = 0; i < newsContentParameter.gridOptions.columns.length; i++) {
                //newsContentParameter.gridOptions.columns[i].visible = $("#" + newsContentParameter.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + newsContentParameter.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                newsContentParameter.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = newsContentParameter.gridOptions.columns;
            for (var i = 0; i < newsContentParameter.gridOptions.columns.length; i++) {
                newsContentParameter.gridOptions.columns[i].visible = true;
                var element = $("#" + newsContentParameter.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + newsContentParameter.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < newsContentParameter.gridOptions.columns.length; i++) {
            console.log(newsContentParameter.gridOptions.columns[i].name.concat(".visible: "), newsContentParameter.gridOptions.columns[i].visible);
        }
        newsContentParameter.gridOptions.columnCheckbox = !newsContentParameter.gridOptions.columnCheckbox;
    }
   
    //Export Report 
    newsContentParameter.exportFile = function () {
        newsContentParameter.addRequested = true;
        newsContentParameter.gridOptions.advancedSearchData.engine.ExportFile = newsContentParameter.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'newsContentParameter/exportfile', newsContentParameter.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            newsContentParameter.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                newsContentParameter.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //newsContentParameter.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    newsContentParameter.toggleExportForm = function () {
        newsContentParameter.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        newsContentParameter.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        newsContentParameter.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        newsContentParameter.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        newsContentParameter.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/Modulenews/newsContentParameter/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    newsContentParameter.rowCountChanged = function () {
        if (!angular.isDefined(newsContentParameter.ExportFileClass.RowCount) || newsContentParameter.ExportFileClass.RowCount > 5000)
            newsContentParameter.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    newsContentParameter.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"newsContentParameter/count", newsContentParameter.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            newsContentParameter.addRequested = false;
            rashaErManage.checkAction(response);
            newsContentParameter.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            newsContentParameter.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

