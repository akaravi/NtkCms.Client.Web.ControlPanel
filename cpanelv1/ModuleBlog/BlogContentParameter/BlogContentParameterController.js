app.controller("blogContentParameterController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var blogContentParameter = this;
    blogContentParameter.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    blogContentParameter.UninversalMenus = [];
    blogContentParameter.selectUniversalMenuOnUndetectableKey = true;

    if (itemRecordStatus != undefined) blogContentParameter.itemRecordStatus = itemRecordStatus;

    // Many To Many
    // MemberUserGroup  جدول واسط
    // LinkMemberUserId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    blogContentParameter.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    

    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        blogContentParameter.memberGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    blogContentParameter.hasInMany2Many = function (OtherTable) {
        if (blogContentParameter.selectedMemberUser == null || blogContentParameter.selectedMemberUser[thisTableFieldICollection] == undefined || blogContentParameter.selectedMemberUser[thisTableFieldICollection] == null) return false;
        return objectFindByKey(blogContentParameter.selectedMemberUser[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    };
    blogContentParameter.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (blogContentParameter.hasInMany2Many(OtherTable)) {
            //var index = blogContentParameter.selectedMemberUser[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(blogContentParameter.selectedMemberUser[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            blogContentParameter.selectedMemberUser[thisTableFieldICollection].splice(index, 1);
        } else {
            blogContentParameter.selectedMemberUser[thisTableFieldICollection].push(obj);
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

    blogContentParameter.init = function () {
        blogContentParameter.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = blogContentParameter.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"blogContentParameter/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            blogContentParameter.busyIndicator.isActive = false;
            blogContentParameter.ListItems = response.ListItems;
            blogContentParameter.gridOptions.fillData(blogContentParameter.ListItems, response.resultAccess);
            blogContentParameter.gridOptions.currentPageNumber = response.CurrentPageNumber;
            blogContentParameter.gridOptions.totalRowCount = response.TotalRowCount;
            blogContentParameter.gridOptions.rowPerPage = response.RowPerPage;
            blogContentParameter.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            blogContentParameter.busyIndicator.isActive = false;
            blogContentParameter.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    blogContentParameter.busyIndicator.isActive = true;
    blogContentParameter.addRequested = false;
    blogContentParameter.openAddModal = function () {
        blogContentParameter.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'blogContentParameter/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            blogContentParameter.busyIndicator.isActive = false;
            blogContentParameter.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleblog/blogContentParameter/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogContentParameter.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    blogContentParameter.addNewRow = function (frm) {
        if (frm.$invalid)
            return;
        blogContentParameter.busyIndicator.isActive = true;
        blogContentParameter.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'blogContentParameter/add', blogContentParameter.selectedItem, 'POST').success(function (response) {
            blogContentParameter.addRequested = false;
            blogContentParameter.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                blogContentParameter.gridOptions.advancedSearchData.engine.Filters = null;
                blogContentParameter.gridOptions.advancedSearchData.engine.Filters = [];
                blogContentParameter.ListItems.unshift(response.Item);
                blogContentParameter.gridOptions.fillData(blogContentParameter.ListItems);
                blogContentParameter.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogContentParameter.busyIndicator.isActive = false;
            blogContentParameter.addRequested = false;
        });
    }

    blogContentParameter.openEditModal = function () {

        blogContentParameter.modalTitle = 'ویرایش';
        if (!blogContentParameter.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'blogContentParameter/GetOne', blogContentParameter.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            blogContentParameter.selectedItem = response.Item;
            if (blogContentParameter
                .LinkUniversalMenuIdOnUndetectableKey >
                0) blogContentParameter.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleblog/blogContentParameter/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    blogContentParameter.editRow = function (frm) {
        if (frm.$invalid)
            return;
        blogContentParameter.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'blogContentParameter/edit', blogContentParameter.selectedItem, 'PUT').success(function (response) {
            blogContentParameter.addRequested = true;
            rashaErManage.checkAction(response);
            blogContentParameter.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                blogContentParameter.addRequested = false;
                blogContentParameter.replaceItem(blogContentParameter.selectedItem.Id, response.Item);
                blogContentParameter.gridOptions.fillData(blogContentParameter.ListItems);
                blogContentParameter.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogContentParameter.addRequested = false;
            blogContentParameter.busyIndicator.isActive = false;
        });
    }

    blogContentParameter.closeModal = function () {
        $modalStack.dismissAll();
    };

    blogContentParameter.replaceItem = function (oldId, newItem) {
        angular.forEach(blogContentParameter.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = blogContentParameter.ListItems.indexOf(item);
                blogContentParameter.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            blogContentParameter.ListItems.unshift(newItem);
    }
    // delete content
    blogContentParameter.deleteRow = function () {
        if (!blogContentParameter.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                blogContentParameter.busyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath+'blogContentParameter/GetOne', blogContentParameter.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    blogContentParameter.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'blogContentParameter/delete', blogContentParameter.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        blogContentParameter.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            blogContentParameter.replaceItem(blogContentParameter.selectedItemForDelete.Id);
                            blogContentParameter.gridOptions.fillData(blogContentParameter.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        blogContentParameter.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    blogContentParameter.busyIndicator.isActive = false;
                });
            }
        });
    }

    blogContentParameter.searchData = function () {
        blogContentParameter.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"blogContentParameter/getall", blogContentParameter.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            blogContentParameter.categoryBusyIndicator.isActive = false;
            blogContentParameter.ListItems = response.ListItems;
            blogContentParameter.gridOptions.fillData(blogContentParameter.ListItems);
            blogContentParameter.gridOptions.currentPageNumber = response.CurrentPageNumber;
            blogContentParameter.gridOptions.totalRowCount = response.TotalRowCount;
            blogContentParameter.gridOptions.rowPerPage = response.RowPerPage;
            blogContentParameter.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            blogContentParameter.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //blogContentParameter.gridOptions.searchData();

    }
    blogContentParameter.LinkContentParameterTypeIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkContentParameterTypeId',
        url: 'blogContentParameterType',
        sortColumn: 'Id',
        sortType: 0,
        showAddDialog: false,
        filterText: 'Title',
        rowPerPage: 200,
        scope: blogContentParameter,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true },
                { name: 'Title', displayName: 'عنوان', sortable: true }
            ]
        }
    }
    blogContentParameter.LinkExternalCoreCmsSiteCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkExternalCoreCmsSiteCategoryId',
        url: 'CmsSiteCategory',
        sortColumn: 'Id',
        sortType: 0,
        showAddDialog: false,
        filterText: 'Title',
        rowPerPage: 200,
        scope: blogContentParameter,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true },
                { name: 'Title', displayName: 'عنوان', sortable: true }
            ]
        }
    }
    blogContentParameter.LinkModuleCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkModuleCategoryId',
        url: 'blogcategory',
        sortColumn: 'Id',
        sortType: 0,
        showAddDialog: false,
        filterText: 'Title',
        rowPerPage: 200,
        scope: blogContentParameter,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true },
                { name: 'Title', displayName: 'عنوان', sortable: true }
            ]
        }
    }
    blogContentParameter.gridOptions = {
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

    blogContentParameter.test = 'false';

    blogContentParameter.gridOptions.reGetAll = function () {
        blogContentParameter.init();
    }

    blogContentParameter.gridOptions.onRowSelected = function () { }

    blogContentParameter.columnCheckbox = false;
    blogContentParameter.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (blogContentParameter.gridOptions.columnCheckbox) {
            for (var i = 0; i < blogContentParameter.gridOptions.columns.length; i++) {
                //blogContentParameter.gridOptions.columns[i].visible = $("#" + blogContentParameter.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + blogContentParameter.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                blogContentParameter.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = blogContentParameter.gridOptions.columns;
            for (var i = 0; i < blogContentParameter.gridOptions.columns.length; i++) {
                blogContentParameter.gridOptions.columns[i].visible = true;
                var element = $("#" + blogContentParameter.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + blogContentParameter.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < blogContentParameter.gridOptions.columns.length; i++) {
            console.log(blogContentParameter.gridOptions.columns[i].name.concat(".visible: "), blogContentParameter.gridOptions.columns[i].visible);
        }
        blogContentParameter.gridOptions.columnCheckbox = !blogContentParameter.gridOptions.columnCheckbox;
    }
   
    //Export Report 
    blogContentParameter.exportFile = function () {
        blogContentParameter.addRequested = true;
        blogContentParameter.gridOptions.advancedSearchData.engine.ExportFile = blogContentParameter.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'blogContentParameter/exportfile', blogContentParameter.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            blogContentParameter.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                blogContentParameter.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //blogContentParameter.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    blogContentParameter.toggleExportForm = function () {
        blogContentParameter.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        blogContentParameter.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        blogContentParameter.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        blogContentParameter.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        blogContentParameter.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/Moduleblog/blogContentParameter/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    blogContentParameter.rowCountChanged = function () {
        if (!angular.isDefined(blogContentParameter.ExportFileClass.RowCount) || blogContentParameter.ExportFileClass.RowCount > 5000)
            blogContentParameter.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    blogContentParameter.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"blogContentParameter/count", blogContentParameter.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            blogContentParameter.addRequested = false;
            rashaErManage.checkAction(response);
            blogContentParameter.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            blogContentParameter.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

