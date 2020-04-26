app.controller("blogContentParameterTypeController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var blogContentParameterType = this;
    blogContentParameterType.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    blogContentParameterType.UninversalMenus = [];
    blogContentParameterType.selectUniversalMenuOnUndetectableKey = true;

    if (itemRecordStatus != undefined) blogContentParameterType.itemRecordStatus = itemRecordStatus;

    // Many To Many
    // MemberUserGroup  جدول واسط
    // LinkMemberUserId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    blogContentParameterType.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    

    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        blogContentParameterType.memberGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    blogContentParameterType.hasInMany2Many = function (OtherTable) {
        if (blogContentParameterType.selectedMemberUser == null || blogContentParameterType.selectedMemberUser[thisTableFieldICollection] == undefined || blogContentParameterType.selectedMemberUser[thisTableFieldICollection] == null) return false;
        return objectFindByKey(blogContentParameterType.selectedMemberUser[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    };
    blogContentParameterType.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (blogContentParameterType.hasInMany2Many(OtherTable)) {
            //var index = blogContentParameterType.selectedMemberUser[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(blogContentParameterType.selectedMemberUser[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            blogContentParameterType.selectedMemberUser[thisTableFieldICollection].splice(index, 1);
        } else {
            blogContentParameterType.selectedMemberUser[thisTableFieldICollection].push(obj);
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

    blogContentParameterType.init = function () {
        blogContentParameterType.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = blogContentParameterType.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"blogContentParameterType/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            blogContentParameterType.busyIndicator.isActive = false;
            blogContentParameterType.ListItems = response.ListItems;
            blogContentParameterType.gridOptions.fillData(blogContentParameterType.ListItems, response.resultAccess);
            blogContentParameterType.gridOptions.currentPageNumber = response.CurrentPageNumber;
            blogContentParameterType.gridOptions.totalRowCount = response.TotalRowCount;
            blogContentParameterType.gridOptions.rowPerPage = response.RowPerPage;
            blogContentParameterType.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            blogContentParameterType.busyIndicator.isActive = false;
            blogContentParameterType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    blogContentParameterType.busyIndicator.isActive = true;
    blogContentParameterType.addRequested = false;
    blogContentParameterType.openAddModal = function () {
        blogContentParameterType.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'blogContentParameterType/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            blogContentParameterType.busyIndicator.isActive = false;
            blogContentParameterType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleblog/blogContentParameterType/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogContentParameterType.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    blogContentParameterType.addNewRow = function (frm) {
        if (frm.$invalid)
            return;
        blogContentParameterType.busyIndicator.isActive = true;
        blogContentParameterType.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'blogContentParameterType/add', blogContentParameterType.selectedItem, 'POST').success(function (response) {
            blogContentParameterType.addRequested = false;
            blogContentParameterType.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                blogContentParameterType.gridOptions.advancedSearchData.engine.Filters = null;
                blogContentParameterType.gridOptions.advancedSearchData.engine.Filters = [];
                blogContentParameterType.ListItems.unshift(response.Item);
                blogContentParameterType.gridOptions.fillData(blogContentParameterType.ListItems);
                blogContentParameterType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogContentParameterType.busyIndicator.isActive = false;
            blogContentParameterType.addRequested = false;
        });
    }

    blogContentParameterType.openEditModal = function () {

        blogContentParameterType.modalTitle = 'ویرایش';
        if (!blogContentParameterType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'blogContentParameterType/GetOne', blogContentParameterType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            blogContentParameterType.selectedItem = response.Item;
            if (blogContentParameterType
                .LinkUniversalMenuIdOnUndetectableKey >
                0) blogContentParameterType.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleblog/blogContentParameterType/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    blogContentParameterType.editRow = function (frm) {
        if (frm.$invalid)
            return;
        blogContentParameterType.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'blogContentParameterType/edit', blogContentParameterType.selectedItem, 'PUT').success(function (response) {
            blogContentParameterType.addRequested = true;
            rashaErManage.checkAction(response);
            blogContentParameterType.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                blogContentParameterType.addRequested = false;
                blogContentParameterType.replaceItem(blogContentParameterType.selectedItem.Id, response.Item);
                blogContentParameterType.gridOptions.fillData(blogContentParameterType.ListItems);
                blogContentParameterType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogContentParameterType.addRequested = false;
            blogContentParameterType.busyIndicator.isActive = false;
        });
    }

    blogContentParameterType.closeModal = function () {
        $modalStack.dismissAll();
    };

    blogContentParameterType.replaceItem = function (oldId, newItem) {
        angular.forEach(blogContentParameterType.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = blogContentParameterType.ListItems.indexOf(item);
                blogContentParameterType.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            blogContentParameterType.ListItems.unshift(newItem);
    }
    // delete content
    blogContentParameterType.deleteRow = function () {
        if (!blogContentParameterType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                blogContentParameterType.busyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath+'blogContentParameterType/GetOne', blogContentParameterType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    blogContentParameterType.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'blogContentParameterType/delete', blogContentParameterType.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        blogContentParameterType.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            blogContentParameterType.replaceItem(blogContentParameterType.selectedItemForDelete.Id);
                            blogContentParameterType.gridOptions.fillData(blogContentParameterType.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        blogContentParameterType.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    blogContentParameterType.busyIndicator.isActive = false;
                });
            }
        });
    }

    blogContentParameterType.searchData = function () {
        blogContentParameterType.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"blogContentParameterType/getall", blogContentParameterType.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            blogContentParameterType.categoryBusyIndicator.isActive = false;
            blogContentParameterType.ListItems = response.ListItems;
            blogContentParameterType.gridOptions.fillData(blogContentParameterType.ListItems);
            blogContentParameterType.gridOptions.currentPageNumber = response.CurrentPageNumber;
            blogContentParameterType.gridOptions.totalRowCount = response.TotalRowCount;
            blogContentParameterType.gridOptions.rowPerPage = response.RowPerPage;
            blogContentParameterType.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            blogContentParameterType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //blogContentParameterType.gridOptions.searchData();

    }

    blogContentParameterType.gridOptions = {
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

    blogContentParameterType.test = 'false';

    blogContentParameterType.gridOptions.reGetAll = function () {
        blogContentParameterType.init();
    }

    blogContentParameterType.gridOptions.onRowSelected = function () { }

    blogContentParameterType.columnCheckbox = false;
    blogContentParameterType.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (blogContentParameterType.gridOptions.columnCheckbox) {
            for (var i = 0; i < blogContentParameterType.gridOptions.columns.length; i++) {
                //blogContentParameterType.gridOptions.columns[i].visible = $("#" + blogContentParameterType.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + blogContentParameterType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                blogContentParameterType.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = blogContentParameterType.gridOptions.columns;
            for (var i = 0; i < blogContentParameterType.gridOptions.columns.length; i++) {
                blogContentParameterType.gridOptions.columns[i].visible = true;
                var element = $("#" + blogContentParameterType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + blogContentParameterType.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < blogContentParameterType.gridOptions.columns.length; i++) {
            console.log(blogContentParameterType.gridOptions.columns[i].name.concat(".visible: "), blogContentParameterType.gridOptions.columns[i].visible);
        }
        blogContentParameterType.gridOptions.columnCheckbox = !blogContentParameterType.gridOptions.columnCheckbox;
    }
   
    //Export Report 
    blogContentParameterType.exportFile = function () {
        blogContentParameterType.addRequested = true;
        blogContentParameterType.gridOptions.advancedSearchData.engine.ExportFile = blogContentParameterType.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'blogContentParameterType/exportfile', blogContentParameterType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            blogContentParameterType.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                blogContentParameterType.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //blogContentParameterType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    blogContentParameterType.toggleExportForm = function () {
        blogContentParameterType.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        blogContentParameterType.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        blogContentParameterType.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        blogContentParameterType.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        blogContentParameterType.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/Moduleblog/blogContentParameterType/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    blogContentParameterType.rowCountChanged = function () {
        if (!angular.isDefined(blogContentParameterType.ExportFileClass.RowCount) || blogContentParameterType.ExportFileClass.RowCount > 5000)
            blogContentParameterType.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    blogContentParameterType.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"blogContentParameterType/count", blogContentParameterType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            blogContentParameterType.addRequested = false;
            rashaErManage.checkAction(response);
            blogContentParameterType.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            blogContentParameterType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

