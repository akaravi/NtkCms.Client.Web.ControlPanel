app.controller("articleContentParameterTypeController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var articleContentParameterType = this;
    articleContentParameterType.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    articleContentParameterType.UninversalMenus = [];
    articleContentParameterType.selectUniversalMenuOnUndetectableKey = true;

    if (itemRecordStatus != undefined) articleContentParameterType.itemRecordStatus = itemRecordStatus;

    // Many To Many
    // MemberUserGroup  جدول واسط
    // LinkMemberUserId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    articleContentParameterType.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    

    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        articleContentParameterType.memberGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    articleContentParameterType.hasInMany2Many = function (OtherTable) {
        if (articleContentParameterType.selectedMemberUser == null || articleContentParameterType.selectedMemberUser[thisTableFieldICollection] == undefined || articleContentParameterType.selectedMemberUser[thisTableFieldICollection] == null) return false;
        return objectFindByKey(articleContentParameterType.selectedMemberUser[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    };
    articleContentParameterType.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (articleContentParameterType.hasInMany2Many(OtherTable)) {
            //var index = articleContentParameterType.selectedMemberUser[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(articleContentParameterType.selectedMemberUser[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            articleContentParameterType.selectedMemberUser[thisTableFieldICollection].splice(index, 1);
        } else {
            articleContentParameterType.selectedMemberUser[thisTableFieldICollection].push(obj);
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

    articleContentParameterType.init = function () {
        articleContentParameterType.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = articleContentParameterType.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"articleContentParameterType/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            articleContentParameterType.busyIndicator.isActive = false;
            articleContentParameterType.ListItems = response.ListItems;
            articleContentParameterType.gridOptions.fillData(articleContentParameterType.ListItems, response.resultAccess);
            articleContentParameterType.gridOptions.currentPageNumber = response.CurrentPageNumber;
            articleContentParameterType.gridOptions.totalRowCount = response.TotalRowCount;
            articleContentParameterType.gridOptions.rowPerPage = response.RowPerPage;
            articleContentParameterType.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            articleContentParameterType.busyIndicator.isActive = false;
            articleContentParameterType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    articleContentParameterType.busyIndicator.isActive = true;
    articleContentParameterType.addRequested = false;
    articleContentParameterType.openAddModal = function () {
        articleContentParameterType.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'articleContentParameterType/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            articleContentParameterType.busyIndicator.isActive = false;
            articleContentParameterType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleArticle/ArticleContentParameterType/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleContentParameterType.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    articleContentParameterType.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        articleContentParameterType.busyIndicator.isActive = true;
        articleContentParameterType.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'articleContentParameterType/add', articleContentParameterType.selectedItem, 'POST').success(function (response) {
            articleContentParameterType.addRequested = false;
            articleContentParameterType.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                articleContentParameterType.gridOptions.advancedSearchData.engine.Filters = null;
                articleContentParameterType.gridOptions.advancedSearchData.engine.Filters = [];
                articleContentParameterType.ListItems.unshift(response.Item);
                articleContentParameterType.gridOptions.fillData(articleContentParameterType.ListItems);
                articleContentParameterType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleContentParameterType.busyIndicator.isActive = false;
            articleContentParameterType.addRequested = false;
        });
    }

    articleContentParameterType.openEditModal = function () {

        articleContentParameterType.modalTitle = 'ویرایش';
        if (!articleContentParameterType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'articleContentParameterType/GetOne', articleContentParameterType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            articleContentParameterType.selectedItem = response.Item;
            if (articleContentParameterType
                .LinkUniversalMenuIdOnUndetectableKey >
                0) articleContentParameterType.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleArticle/articleContentParameterType/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    articleContentParameterType.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        articleContentParameterType.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'articleContentParameterType/edit', articleContentParameterType.selectedItem, 'PUT').success(function (response) {
            articleContentParameterType.addRequested = true;
            rashaErManage.checkAction(response);
            articleContentParameterType.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                articleContentParameterType.addRequested = false;
                articleContentParameterType.replaceItem(articleContentParameterType.selectedItem.Id, response.Item);
                articleContentParameterType.gridOptions.fillData(articleContentParameterType.ListItems);
                articleContentParameterType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleContentParameterType.addRequested = false;
            articleContentParameterType.busyIndicator.isActive = false;
        });
    }

    articleContentParameterType.closeModal = function () {
        $modalStack.dismissAll();
    };

    articleContentParameterType.replaceItem = function (oldId, newItem) {
        angular.forEach(articleContentParameterType.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = articleContentParameterType.ListItems.indexOf(item);
                articleContentParameterType.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            articleContentParameterType.ListItems.unshift(newItem);
    }
    // delete content
    articleContentParameterType.deleteRow = function () {
        if (!articleContentParameterType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                articleContentParameterType.busyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath+'articleContentParameterType/GetOne', articleContentParameterType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    articleContentParameterType.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'articleContentParameterType/delete', articleContentParameterType.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        articleContentParameterType.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            articleContentParameterType.replaceItem(articleContentParameterType.selectedItemForDelete.Id);
                            articleContentParameterType.gridOptions.fillData(articleContentParameterType.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        articleContentParameterType.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    articleContentParameterType.busyIndicator.isActive = false;
                });
            }
        });
    }

    articleContentParameterType.searchData = function () {
        articleContentParameterType.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"articleContentParameterType/getall", articleContentParameterType.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            articleContentParameterType.categoryBusyIndicator.isActive = false;
            articleContentParameterType.ListItems = response.ListItems;
            articleContentParameterType.gridOptions.fillData(articleContentParameterType.ListItems);
            articleContentParameterType.gridOptions.currentPageNumber = response.CurrentPageNumber;
            articleContentParameterType.gridOptions.totalRowCount = response.TotalRowCount;
            articleContentParameterType.gridOptions.rowPerPage = response.RowPerPage;
            articleContentParameterType.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            articleContentParameterType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //articleContentParameterType.gridOptions.searchData();

    }

    articleContentParameterType.gridOptions = {
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

    articleContentParameterType.test = 'false';

    articleContentParameterType.gridOptions.reGetAll = function () {
        articleContentParameterType.init();
    }

    articleContentParameterType.gridOptions.onRowSelected = function () { }

    articleContentParameterType.columnCheckbox = false;
    articleContentParameterType.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (articleContentParameterType.gridOptions.columnCheckbox) {
            for (var i = 0; i < articleContentParameterType.gridOptions.columns.length; i++) {
                //articleContentParameterType.gridOptions.columns[i].visible = $("#" + articleContentParameterType.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + articleContentParameterType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                articleContentParameterType.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = articleContentParameterType.gridOptions.columns;
            for (var i = 0; i < articleContentParameterType.gridOptions.columns.length; i++) {
                articleContentParameterType.gridOptions.columns[i].visible = true;
                var element = $("#" + articleContentParameterType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + articleContentParameterType.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < articleContentParameterType.gridOptions.columns.length; i++) {
            console.log(articleContentParameterType.gridOptions.columns[i].name.concat(".visible: "), articleContentParameterType.gridOptions.columns[i].visible);
        }
        articleContentParameterType.gridOptions.columnCheckbox = !articleContentParameterType.gridOptions.columnCheckbox;
    }
   
    //Export Report 
    articleContentParameterType.exportFile = function () {
        articleContentParameterType.addRequested = true;
        articleContentParameterType.gridOptions.advancedSearchData.engine.ExportFile = articleContentParameterType.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'articleContentParameterType/exportfile', articleContentParameterType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            articleContentParameterType.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                articleContentParameterType.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //articleContentParameterType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    articleContentParameterType.toggleExportForm = function () {
        articleContentParameterType.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        articleContentParameterType.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        articleContentParameterType.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        articleContentParameterType.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        articleContentParameterType.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleArticle/articleContentParameterType/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    articleContentParameterType.rowCountChanged = function () {
        if (!angular.isDefined(articleContentParameterType.ExportFileClass.RowCount) || articleContentParameterType.ExportFileClass.RowCount > 5000)
            articleContentParameterType.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    articleContentParameterType.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"articleContentParameterType/count", articleContentParameterType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            articleContentParameterType.addRequested = false;
            rashaErManage.checkAction(response);
            articleContentParameterType.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            articleContentParameterType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

