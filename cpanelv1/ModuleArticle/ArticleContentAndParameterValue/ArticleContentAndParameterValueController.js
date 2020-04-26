app.controller("articleContentAndParameterValueController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var articleContentAndParameterValue = this;
    articleContentAndParameterValue.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    articleContentAndParameterValue.UninversalMenus = [];
    articleContentAndParameterValue.selectUniversalMenuOnUndetectableKey = true;

    if (itemRecordStatus != undefined) articleContentAndParameterValue.itemRecordStatus = itemRecordStatus;

    // Many To Many
    // MemberUserGroup  جدول واسط
    // LinkMemberUserId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    articleContentAndParameterValue.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    

    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        articleContentAndParameterValue.memberGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    articleContentAndParameterValue.hasInMany2Many = function (OtherTable) {
        if (articleContentAndParameterValue.selectedMemberUser == null || articleContentAndParameterValue.selectedMemberUser[thisTableFieldICollection] == undefined || articleContentAndParameterValue.selectedMemberUser[thisTableFieldICollection] == null) return false;
        return objectFindByKey(articleContentAndParameterValue.selectedMemberUser[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    };
    articleContentAndParameterValue.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (articleContentAndParameterValue.hasInMany2Many(OtherTable)) {
            //var index = articleContentAndParameterValue.selectedMemberUser[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(articleContentAndParameterValue.selectedMemberUser[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            articleContentAndParameterValue.selectedMemberUser[thisTableFieldICollection].splice(index, 1);
        } else {
            articleContentAndParameterValue.selectedMemberUser[thisTableFieldICollection].push(obj);
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

    articleContentAndParameterValue.init = function () {
        articleContentAndParameterValue.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = articleContentAndParameterValue.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"articleContentAndParameterValue/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            articleContentAndParameterValue.busyIndicator.isActive = false;
            articleContentAndParameterValue.ListItems = response.ListItems;
            articleContentAndParameterValue.gridOptions.fillData(articleContentAndParameterValue.ListItems, response.resultAccess);
            articleContentAndParameterValue.gridOptions.currentPageNumber = response.CurrentPageNumber;
            articleContentAndParameterValue.gridOptions.totalRowCount = response.TotalRowCount;
            articleContentAndParameterValue.gridOptions.rowPerPage = response.RowPerPage;
            articleContentAndParameterValue.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            articleContentAndParameterValue.busyIndicator.isActive = false;
            articleContentAndParameterValue.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    articleContentAndParameterValue.busyIndicator.isActive = true;
    articleContentAndParameterValue.addRequested = false;
    articleContentAndParameterValue.openAddModal = function () {
        articleContentAndParameterValue.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'articleContentAndParameterValue/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            articleContentAndParameterValue.busyIndicator.isActive = false;
            articleContentAndParameterValue.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleArticle/articleContentAndParameterValue/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleContentAndParameterValue.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    articleContentAndParameterValue.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        articleContentAndParameterValue.busyIndicator.isActive = true;
        articleContentAndParameterValue.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'articleContentAndParameterValue/add', articleContentAndParameterValue.selectedItem, 'POST').success(function (response) {
            articleContentAndParameterValue.addRequested = false;
            articleContentAndParameterValue.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                articleContentAndParameterValue.gridOptions.advancedSearchData.engine.Filters = null;
                articleContentAndParameterValue.gridOptions.advancedSearchData.engine.Filters = [];
                articleContentAndParameterValue.ListItems.unshift(response.Item);
                articleContentAndParameterValue.gridOptions.fillData(articleContentAndParameterValue.ListItems);
                articleContentAndParameterValue.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleContentAndParameterValue.busyIndicator.isActive = false;
            articleContentAndParameterValue.addRequested = false;
        });
    }

    articleContentAndParameterValue.openEditModal = function () {

        articleContentAndParameterValue.modalTitle = 'ویرایش';
        if (!articleContentAndParameterValue.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'articleContentAndParameterValue/GetOne', articleContentAndParameterValue.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            articleContentAndParameterValue.selectedItem = response.Item;
            if (articleContentAndParameterValue
                .LinkUniversalMenuIdOnUndetectableKey >
                0) articleContentAndParameterValue.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleArticle/articleContentAndParameterValue/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    articleContentAndParameterValue.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        articleContentAndParameterValue.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'articleContentAndParameterValue/edit', articleContentAndParameterValue.selectedItem, 'PUT').success(function (response) {
            articleContentAndParameterValue.addRequested = true;
            rashaErManage.checkAction(response);
            articleContentAndParameterValue.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                articleContentAndParameterValue.addRequested = false;
                articleContentAndParameterValue.replaceItem(articleContentAndParameterValue.selectedItem.Id, response.Item);
                articleContentAndParameterValue.gridOptions.fillData(articleContentAndParameterValue.ListItems);
                articleContentAndParameterValue.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleContentAndParameterValue.addRequested = false;
            articleContentAndParameterValue.busyIndicator.isActive = false;
        });
    }

    articleContentAndParameterValue.closeModal = function () {
        $modalStack.dismissAll();
    };

    articleContentAndParameterValue.replaceItem = function (oldId, newItem) {
        angular.forEach(articleContentAndParameterValue.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = articleContentAndParameterValue.ListItems.indexOf(item);
                articleContentAndParameterValue.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            articleContentAndParameterValue.ListItems.unshift(newItem);
    }
    // delete content
    articleContentAndParameterValue.deleteRow = function () {
        if (!articleContentAndParameterValue.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                articleContentAndParameterValue.busyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath+'articleContentAndParameterValue/GetOne', articleContentAndParameterValue.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    articleContentAndParameterValue.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'articleContentAndParameterValue/delete', articleContentAndParameterValue.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        articleContentAndParameterValue.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            articleContentAndParameterValue.replaceItem(articleContentAndParameterValue.selectedItemForDelete.Id);
                            articleContentAndParameterValue.gridOptions.fillData(articleContentAndParameterValue.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        articleContentAndParameterValue.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    articleContentAndParameterValue.busyIndicator.isActive = false;
                });
            }
        });
    }

    articleContentAndParameterValue.searchData = function () {
        articleContentAndParameterValue.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"articleContentAndParameterValue/getall", articleContentAndParameterValue.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            articleContentAndParameterValue.categoryBusyIndicator.isActive = false;
            articleContentAndParameterValue.ListItems = response.ListItems;
            articleContentAndParameterValue.gridOptions.fillData(articleContentAndParameterValue.ListItems);
            articleContentAndParameterValue.gridOptions.currentPageNumber = response.CurrentPageNumber;
            articleContentAndParameterValue.gridOptions.totalRowCount = response.TotalRowCount;
            articleContentAndParameterValue.gridOptions.rowPerPage = response.RowPerPage;
            articleContentAndParameterValue.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            articleContentAndParameterValue.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //articleContentAndParameterValue.gridOptions.searchData();

    }
    articleContentAndParameterValue.LinkContentParameterIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkContentParameterId',
        url: 'articleContentParameter',
        sortColumn: 'Id',
        sortType: 0,
        showAddDialog: false,
        filterText: 'Id',
        rowPerPage: 200,
        scope: articleContentAndParameterValue,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    articleContentAndParameterValue.LinkContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkContentId',
        url: 'articleContent',
        sortColumn: 'Id',
        sortType: 0,
        showAddDialog: false,
        filterText: 'Title',
        rowPerPage: 200,
        scope: articleContentAndParameterValue,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    articleContentAndParameterValue.LinkModuleCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkModuleCategoryId',
        url: 'CmsModule',
        sortColumn: 'Id',
        sortType: 0,
        showAddDialog: false,
        filterText: 'Title',
        rowPerPage: 200,
        scope: articleContentAndParameterValue,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    articleContentAndParameterValue.gridOptions = {
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
                SortType: 1,
                NeedToRunFakePagination: false,
                TotalRowData: 200,
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }

    articleContentAndParameterValue.test = 'false';

    articleContentAndParameterValue.gridOptions.reGetAll = function () {
        articleContentAndParameterValue.init();
    }

    articleContentAndParameterValue.gridOptions.onRowSelected = function () { }

    articleContentAndParameterValue.columnCheckbox = false;
    articleContentAndParameterValue.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (articleContentAndParameterValue.gridOptions.columnCheckbox) {
            for (var i = 0; i < articleContentAndParameterValue.gridOptions.columns.length; i++) {
                //articleContentAndParameterValue.gridOptions.columns[i].visible = $("#" + articleContentAndParameterValue.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + articleContentAndParameterValue.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                articleContentAndParameterValue.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = articleContentAndParameterValue.gridOptions.columns;
            for (var i = 0; i < articleContentAndParameterValue.gridOptions.columns.length; i++) {
                articleContentAndParameterValue.gridOptions.columns[i].visible = true;
                var element = $("#" + articleContentAndParameterValue.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + articleContentAndParameterValue.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < articleContentAndParameterValue.gridOptions.columns.length; i++) {
            console.log(articleContentAndParameterValue.gridOptions.columns[i].name.concat(".visible: "), articleContentAndParameterValue.gridOptions.columns[i].visible);
        }
        articleContentAndParameterValue.gridOptions.columnCheckbox = !articleContentAndParameterValue.gridOptions.columnCheckbox;
    }
   
    //Export Report 
    articleContentAndParameterValue.exportFile = function () {
        articleContentAndParameterValue.addRequested = true;
        articleContentAndParameterValue.gridOptions.advancedSearchData.engine.ExportFile = articleContentAndParameterValue.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'articleContentAndParameterValue/exportfile', articleContentAndParameterValue.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            articleContentAndParameterValue.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                articleContentAndParameterValue.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //articleContentAndParameterValue.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    articleContentAndParameterValue.toggleExportForm = function () {
        articleContentAndParameterValue.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        articleContentAndParameterValue.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        articleContentAndParameterValue.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        articleContentAndParameterValue.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        articleContentAndParameterValue.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleArticle/articleContentAndParameterValue/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    articleContentAndParameterValue.rowCountChanged = function () {
        if (!angular.isDefined(articleContentAndParameterValue.ExportFileClass.RowCount) || articleContentAndParameterValue.ExportFileClass.RowCount > 5000)
            articleContentAndParameterValue.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    articleContentAndParameterValue.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"articleContentAndParameterValue/count", articleContentAndParameterValue.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            articleContentAndParameterValue.addRequested = false;
            rashaErManage.checkAction(response);
            articleContentAndParameterValue.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            articleContentAndParameterValue.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

