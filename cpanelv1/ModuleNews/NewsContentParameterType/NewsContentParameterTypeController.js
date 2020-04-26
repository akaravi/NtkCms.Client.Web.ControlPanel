app.controller("newsContentParameterTypeController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var newsContentParameterType = this;
    newsContentParameterType.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    newsContentParameterType.UninversalMenus = [];
    newsContentParameterType.selectUniversalMenuOnUndetectableKey = true;

    if (itemRecordStatus != undefined) newsContentParameterType.itemRecordStatus = itemRecordStatus;

    // Many To Many
    // MemberUserGroup  جدول واسط
    // LinkMemberUserId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    newsContentParameterType.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    

    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        newsContentParameterType.memberGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    newsContentParameterType.hasInMany2Many = function (OtherTable) {
        if (newsContentParameterType.selectedMemberUser == null || newsContentParameterType.selectedMemberUser[thisTableFieldICollection] == undefined || newsContentParameterType.selectedMemberUser[thisTableFieldICollection] == null) return false;
        return objectFindByKey(newsContentParameterType.selectedMemberUser[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    };
    newsContentParameterType.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (newsContentParameterType.hasInMany2Many(OtherTable)) {
            //var index = newsContentParameterType.selectedMemberUser[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(newsContentParameterType.selectedMemberUser[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            newsContentParameterType.selectedMemberUser[thisTableFieldICollection].splice(index, 1);
        } else {
            newsContentParameterType.selectedMemberUser[thisTableFieldICollection].push(obj);
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

    newsContentParameterType.init = function () {
        newsContentParameterType.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = newsContentParameterType.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"newsContentParameterType/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            newsContentParameterType.busyIndicator.isActive = false;
            newsContentParameterType.ListItems = response.ListItems;
            newsContentParameterType.gridOptions.fillData(newsContentParameterType.ListItems, response.resultAccess);
            newsContentParameterType.gridOptions.currentPageNumber = response.CurrentPageNumber;
            newsContentParameterType.gridOptions.totalRowCount = response.TotalRowCount;
            newsContentParameterType.gridOptions.rowPerPage = response.RowPerPage;
            newsContentParameterType.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            newsContentParameterType.busyIndicator.isActive = false;
            newsContentParameterType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    newsContentParameterType.busyIndicator.isActive = true;
    newsContentParameterType.addRequested = false;
    newsContentParameterType.openAddModal = function () {
        newsContentParameterType.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'newsContentParameterType/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            newsContentParameterType.busyIndicator.isActive = false;
            newsContentParameterType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulenews/newsContentParameterType/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsContentParameterType.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    newsContentParameterType.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        newsContentParameterType.busyIndicator.isActive = true;
        newsContentParameterType.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'newsContentParameterType/add', newsContentParameterType.selectedItem, 'POST').success(function (response) {
            newsContentParameterType.addRequested = false;
            newsContentParameterType.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                newsContentParameterType.gridOptions.advancedSearchData.engine.Filters = null;
                newsContentParameterType.gridOptions.advancedSearchData.engine.Filters = [];
                newsContentParameterType.ListItems.unshift(response.Item);
                newsContentParameterType.gridOptions.fillData(newsContentParameterType.ListItems);
                newsContentParameterType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsContentParameterType.busyIndicator.isActive = false;
            newsContentParameterType.addRequested = false;
        });
    }

    newsContentParameterType.openEditModal = function () {

        newsContentParameterType.modalTitle = 'ویرایش';
        if (!newsContentParameterType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'newsContentParameterType/GetOne', newsContentParameterType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            newsContentParameterType.selectedItem = response.Item;
            if (newsContentParameterType
                .LinkUniversalMenuIdOnUndetectableKey >
                0) newsContentParameterType.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/Modulenews/newsContentParameterType/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    newsContentParameterType.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        newsContentParameterType.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'newsContentParameterType/edit', newsContentParameterType.selectedItem, 'PUT').success(function (response) {
            newsContentParameterType.addRequested = true;
            rashaErManage.checkAction(response);
            newsContentParameterType.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                newsContentParameterType.addRequested = false;
                newsContentParameterType.replaceItem(newsContentParameterType.selectedItem.Id, response.Item);
                newsContentParameterType.gridOptions.fillData(newsContentParameterType.ListItems);
                newsContentParameterType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsContentParameterType.addRequested = false;
            newsContentParameterType.busyIndicator.isActive = false;
        });
    }

    newsContentParameterType.closeModal = function () {
        $modalStack.dismissAll();
    };

    newsContentParameterType.replaceItem = function (oldId, newItem) {
        angular.forEach(newsContentParameterType.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = newsContentParameterType.ListItems.indexOf(item);
                newsContentParameterType.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            newsContentParameterType.ListItems.unshift(newItem);
    }
    // delete content
    newsContentParameterType.deleteRow = function () {
        if (!newsContentParameterType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                newsContentParameterType.busyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath+'newsContentParameterType/GetOne', newsContentParameterType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    newsContentParameterType.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'newsContentParameterType/delete', newsContentParameterType.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        newsContentParameterType.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            newsContentParameterType.replaceItem(newsContentParameterType.selectedItemForDelete.Id);
                            newsContentParameterType.gridOptions.fillData(newsContentParameterType.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        newsContentParameterType.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    newsContentParameterType.busyIndicator.isActive = false;
                });
            }
        });
    }

    newsContentParameterType.searchData = function () {
        newsContentParameterType.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"newsContentParameterType/getall", newsContentParameterType.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            newsContentParameterType.categoryBusyIndicator.isActive = false;
            newsContentParameterType.ListItems = response.ListItems;
            newsContentParameterType.gridOptions.fillData(newsContentParameterType.ListItems);
            newsContentParameterType.gridOptions.currentPageNumber = response.CurrentPageNumber;
            newsContentParameterType.gridOptions.totalRowCount = response.TotalRowCount;
            newsContentParameterType.gridOptions.rowPerPage = response.RowPerPage;
            newsContentParameterType.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            newsContentParameterType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //newsContentParameterType.gridOptions.searchData();

    }

    newsContentParameterType.gridOptions = {
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

    newsContentParameterType.test = 'false';

    newsContentParameterType.gridOptions.reGetAll = function () {
        newsContentParameterType.init();
    }

    newsContentParameterType.gridOptions.onRowSelected = function () { }

    newsContentParameterType.columnCheckbox = false;
    newsContentParameterType.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (newsContentParameterType.gridOptions.columnCheckbox) {
            for (var i = 0; i < newsContentParameterType.gridOptions.columns.length; i++) {
                //newsContentParameterType.gridOptions.columns[i].visible = $("#" + newsContentParameterType.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + newsContentParameterType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                newsContentParameterType.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = newsContentParameterType.gridOptions.columns;
            for (var i = 0; i < newsContentParameterType.gridOptions.columns.length; i++) {
                newsContentParameterType.gridOptions.columns[i].visible = true;
                var element = $("#" + newsContentParameterType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + newsContentParameterType.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < newsContentParameterType.gridOptions.columns.length; i++) {
            console.log(newsContentParameterType.gridOptions.columns[i].name.concat(".visible: "), newsContentParameterType.gridOptions.columns[i].visible);
        }
        newsContentParameterType.gridOptions.columnCheckbox = !newsContentParameterType.gridOptions.columnCheckbox;
    }
   
    //Export Report 
    newsContentParameterType.exportFile = function () {
        newsContentParameterType.addRequested = true;
        newsContentParameterType.gridOptions.advancedSearchData.engine.ExportFile = newsContentParameterType.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'newsContentParameterType/exportfile', newsContentParameterType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            newsContentParameterType.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                newsContentParameterType.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //newsContentParameterType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    newsContentParameterType.toggleExportForm = function () {
        newsContentParameterType.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        newsContentParameterType.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        newsContentParameterType.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        newsContentParameterType.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        newsContentParameterType.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/Modulenews/newsContentParameterType/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    newsContentParameterType.rowCountChanged = function () {
        if (!angular.isDefined(newsContentParameterType.ExportFileClass.RowCount) || newsContentParameterType.ExportFileClass.RowCount > 5000)
            newsContentParameterType.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    newsContentParameterType.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"newsContentParameterType/count", newsContentParameterType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            newsContentParameterType.addRequested = false;
            rashaErManage.checkAction(response);
            newsContentParameterType.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            newsContentParameterType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

