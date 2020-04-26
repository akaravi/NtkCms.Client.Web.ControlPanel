app.controller("articleContentParameterController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var articleContentParameter = this;
    articleContentParameter.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    articleContentParameter.UninversalMenus = [];
    articleContentParameter.selectUniversalMenuOnUndetectableKey = true;

    if (itemRecordStatus != undefined) articleContentParameter.itemRecordStatus = itemRecordStatus;

    // Many To Many
    // MemberUserGroup  جدول واسط
    // LinkMemberUserId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    articleContentParameter.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    

    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        articleContentParameter.memberGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    articleContentParameter.hasInMany2Many = function (OtherTable) {
        if (articleContentParameter.selectedMemberUser == null || articleContentParameter.selectedMemberUser[thisTableFieldICollection] == undefined || articleContentParameter.selectedMemberUser[thisTableFieldICollection] == null) return false;
        return objectFindByKey(articleContentParameter.selectedMemberUser[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    };
    articleContentParameter.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (articleContentParameter.hasInMany2Many(OtherTable)) {
            //var index = articleContentParameter.selectedMemberUser[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(articleContentParameter.selectedMemberUser[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            articleContentParameter.selectedMemberUser[thisTableFieldICollection].splice(index, 1);
        } else {
            articleContentParameter.selectedMemberUser[thisTableFieldICollection].push(obj);
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

    articleContentParameter.init = function () {
        articleContentParameter.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = articleContentParameter.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"articleContentParameter/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            articleContentParameter.busyIndicator.isActive = false;
            articleContentParameter.ListItems = response.ListItems;
            articleContentParameter.gridOptions.fillData(articleContentParameter.ListItems, response.resultAccess);
            articleContentParameter.gridOptions.currentPageNumber = response.CurrentPageNumber;
            articleContentParameter.gridOptions.totalRowCount = response.TotalRowCount;
            articleContentParameter.gridOptions.rowPerPage = response.RowPerPage;
            articleContentParameter.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            articleContentParameter.busyIndicator.isActive = false;
            articleContentParameter.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    articleContentParameter.busyIndicator.isActive = true;
    articleContentParameter.addRequested = false;
    articleContentParameter.openAddModal = function () {
        articleContentParameter.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'articleContentParameter/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            articleContentParameter.busyIndicator.isActive = false;
            articleContentParameter.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleArticle/articleContentParameter/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleContentParameter.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    articleContentParameter.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        articleContentParameter.busyIndicator.isActive = true;
        articleContentParameter.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'articleContentParameter/add', articleContentParameter.selectedItem, 'POST').success(function (response) {
            articleContentParameter.addRequested = false;
            articleContentParameter.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                articleContentParameter.gridOptions.advancedSearchData.engine.Filters = null;
                articleContentParameter.gridOptions.advancedSearchData.engine.Filters = [];
                articleContentParameter.ListItems.unshift(response.Item);
                articleContentParameter.gridOptions.fillData(articleContentParameter.ListItems);
                articleContentParameter.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleContentParameter.busyIndicator.isActive = false;
            articleContentParameter.addRequested = false;
        });
    }

    articleContentParameter.openEditModal = function () {

        articleContentParameter.modalTitle = 'ویرایش';
        if (!articleContentParameter.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'articleContentParameter/GetOne', articleContentParameter.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            articleContentParameter.selectedItem = response.Item;
            if (articleContentParameter
                .LinkUniversalMenuIdOnUndetectableKey >
                0) articleContentParameter.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleArticle/articleContentParameter/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    articleContentParameter.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        articleContentParameter.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'articleContentParameter/edit', articleContentParameter.selectedItem, 'PUT').success(function (response) {
            articleContentParameter.addRequested = true;
            rashaErManage.checkAction(response);
            articleContentParameter.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                articleContentParameter.addRequested = false;
                articleContentParameter.replaceItem(articleContentParameter.selectedItem.Id, response.Item);
                articleContentParameter.gridOptions.fillData(articleContentParameter.ListItems);
                articleContentParameter.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleContentParameter.addRequested = false;
            articleContentParameter.busyIndicator.isActive = false;
        });
    }

    articleContentParameter.closeModal = function () {
        $modalStack.dismissAll();
    };

    articleContentParameter.replaceItem = function (oldId, newItem) {
        angular.forEach(articleContentParameter.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = articleContentParameter.ListItems.indexOf(item);
                articleContentParameter.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            articleContentParameter.ListItems.unshift(newItem);
    }
    // delete content
    articleContentParameter.deleteRow = function () {
        if (!articleContentParameter.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                articleContentParameter.busyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath+'articleContentParameter/GetOne', articleContentParameter.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    articleContentParameter.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'articleContentParameter/delete', articleContentParameter.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        articleContentParameter.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            articleContentParameter.replaceItem(articleContentParameter.selectedItemForDelete.Id);
                            articleContentParameter.gridOptions.fillData(articleContentParameter.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        articleContentParameter.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    articleContentParameter.busyIndicator.isActive = false;
                });
            }
        });
    }

    articleContentParameter.searchData = function () {
        articleContentParameter.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"articleContentParameter/getall", articleContentParameter.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            articleContentParameter.categoryBusyIndicator.isActive = false;
            articleContentParameter.ListItems = response.ListItems;
            articleContentParameter.gridOptions.fillData(articleContentParameter.ListItems);
            articleContentParameter.gridOptions.currentPageNumber = response.CurrentPageNumber;
            articleContentParameter.gridOptions.totalRowCount = response.TotalRowCount;
            articleContentParameter.gridOptions.rowPerPage = response.RowPerPage;
            articleContentParameter.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            articleContentParameter.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //articleContentParameter.gridOptions.searchData();

    }
    articleContentParameter.LinkContentParameterTypeIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkContentParameterTypeId',
        url: 'ArticleContentParameterType',
        sortColumn: 'Id',
        sortType: 0,
        showAddDialog: false,
        filterText: 'Title',
        rowPerPage: 200,
        scope: articleContentParameter,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' }
            ]
        }
    }
    articleContentParameter.LinkExternalCoreCmsSiteCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkExternalCoreCmsSiteCategoryId',
        url: 'CmsSiteCategory',
        sortColumn: 'Id',
        sortType: 0,
        showAddDialog: false,
        filterText: 'Title',
        rowPerPage: 200,
        scope: articleContentParameter,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    articleContentParameter.LinkModuleCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkModuleCategoryId',
        url: 'articlecategory',
        sortColumn: 'Id',
        sortType: 0,
        showAddDialog: false,
        filterText: 'Title',
        rowPerPage: 200,
        scope: articleContentParameter,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    articleContentParameter.gridOptions = {
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

    articleContentParameter.test = 'false';

    articleContentParameter.gridOptions.reGetAll = function () {
        articleContentParameter.init();
    }

    articleContentParameter.gridOptions.onRowSelected = function () { }

    articleContentParameter.columnCheckbox = false;
    articleContentParameter.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (articleContentParameter.gridOptions.columnCheckbox) {
            for (var i = 0; i < articleContentParameter.gridOptions.columns.length; i++) {
                //articleContentParameter.gridOptions.columns[i].visible = $("#" + articleContentParameter.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + articleContentParameter.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                articleContentParameter.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = articleContentParameter.gridOptions.columns;
            for (var i = 0; i < articleContentParameter.gridOptions.columns.length; i++) {
                articleContentParameter.gridOptions.columns[i].visible = true;
                var element = $("#" + articleContentParameter.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + articleContentParameter.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < articleContentParameter.gridOptions.columns.length; i++) {
            console.log(articleContentParameter.gridOptions.columns[i].name.concat(".visible: "), articleContentParameter.gridOptions.columns[i].visible);
        }
        articleContentParameter.gridOptions.columnCheckbox = !articleContentParameter.gridOptions.columnCheckbox;
    }
   
    //Export Report 
    articleContentParameter.exportFile = function () {
        articleContentParameter.addRequested = true;
        articleContentParameter.gridOptions.advancedSearchData.engine.ExportFile = articleContentParameter.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'articleContentParameter/exportfile', articleContentParameter.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            articleContentParameter.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                articleContentParameter.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //articleContentParameter.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    articleContentParameter.toggleExportForm = function () {
        articleContentParameter.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        articleContentParameter.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        articleContentParameter.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        articleContentParameter.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        articleContentParameter.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleArticle/articleContentParameter/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    articleContentParameter.rowCountChanged = function () {
        if (!angular.isDefined(articleContentParameter.ExportFileClass.RowCount) || articleContentParameter.ExportFileClass.RowCount > 5000)
            articleContentParameter.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    articleContentParameter.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"articleContentParameter/count", articleContentParameter.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            articleContentParameter.addRequested = false;
            rashaErManage.checkAction(response);
            articleContentParameter.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            articleContentParameter.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

