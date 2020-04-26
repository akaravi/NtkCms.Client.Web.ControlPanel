app.controller("chartContentEventController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var chartContentEvent = this;
    chartContentEvent.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    chartContentEvent.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "chartContentEventController") {
            localStorage.setItem('AddRequest', '');
            chartContentEvent.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
var todayDate = moment().format();

    chartContentEvent.EndDateTime = {
        defaultDate: todayDate
    }
    chartContentEvent.StartDateTime = {
        defaultDate: todayDate
    }
    chartContentEvent.testDate = moment().format();
    if (itemRecordStatus != undefined) chartContentEvent.itemRecordStatus = itemRecordStatus;

    // Many To Many
    // MemberUserGroup  جدول واسط
    // LinkMemberUserId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    chartContentEvent.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    

    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        chartContentEvent.memberGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    //chartContentEvent.hasInMany2Many = function (OtherTable) {
    //    if (chartContentEvent.selectedMemberUser == null || chartContentEvent.selectedMemberUser[thisTableFieldICollection] == undefined || chartContentEvent.selectedMemberUser[thisTableFieldICollection] == null) return false;
    //    return objectFindByKey(chartContentEvent.selectedMemberUser[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    //};
    chartContentEvent.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (chartContentEvent.hasInMany2Many(OtherTable)) {
            //var index = chartContentEvent.selectedMemberUser[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(chartContentEvent.selectedMemberUser[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            chartContentEvent.selectedMemberUser[thisTableFieldICollection].splice(index, 1);
        } else {
            chartContentEvent.selectedMemberUser[thisTableFieldICollection].push(obj);
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

    chartContentEvent.init = function () {
        chartContentEvent.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = chartContentEvent.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"chartContentEvent/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            chartContentEvent.busyIndicator.isActive = false;
            chartContentEvent.ListItems = response.ListItems;
            chartContentEvent.gridOptions.fillData(chartContentEvent.ListItems, response.resultAccess);
            chartContentEvent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            chartContentEvent.gridOptions.totalRowCount = response.TotalRowCount;
            chartContentEvent.gridOptions.rowPerPage = response.RowPerPage;
            chartContentEvent.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            chartContentEvent.busyIndicator.isActive = false;
            chartContentEvent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            });
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        chartContentEvent.checkRequestAddNewItemFromOtherControl(null);
    }

    // Open Add Modal
    chartContentEvent.busyIndicator.isActive = true;
    chartContentEvent.addRequested = false;
    chartContentEvent.openAddModal = function () {
        chartContentEvent.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'chartContentEvent/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            chartContentEvent.busyIndicator.isActive = false;
            chartContentEvent.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleChart/chartContentEvent/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            chartContentEvent.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    chartContentEvent.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        chartContentEvent.busyIndicator.isActive = true;
        chartContentEvent.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'chartContentEvent/add', chartContentEvent.selectedItem, 'POST').success(function (response) {
            chartContentEvent.addRequested = false;
            chartContentEvent.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                chartContentEvent.checkRequestAddNewItemFromOtherControl(response.Item.Id);

                chartContentEvent.gridOptions.advancedSearchData.engine.Filters = null;
                chartContentEvent.gridOptions.advancedSearchData.engine.Filters = [];
                chartContentEvent.ListItems.unshift(response.Item);
                chartContentEvent.gridOptions.fillData(chartContentEvent.ListItems);
                chartContentEvent.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            chartContentEvent.busyIndicator.isActive = false;
            chartContentEvent.addRequested = false;
        });
    }

    chartContentEvent.openEditModal = function () {

        chartContentEvent.modalTitle = 'ویرایش';
        if (!chartContentEvent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'chartContentEvent/GetOne', chartContentEvent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            chartContentEvent.selectedItem = response.Item;
            if (chartContentEvent
                .LinkUniversalMenuIdOnUndetectableKey >
                0) chartContentEvent.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleChart/chartContentEvent/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    chartContentEvent.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        chartContentEvent.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'chartContentEvent/edit', chartContentEvent.selectedItem, 'PUT').success(function (response) {
            chartContentEvent.addRequested = true;
            rashaErManage.checkAction(response);
            chartContentEvent.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                chartContentEvent.addRequested = false;
                chartContentEvent.replaceItem(chartContentEvent.selectedItem.Id, response.Item);
                chartContentEvent.gridOptions.fillData(chartContentEvent.ListItems);
                chartContentEvent.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            chartContentEvent.addRequested = false;
            chartContentEvent.busyIndicator.isActive = false;
        });
    }

    chartContentEvent.closeModal = function () {
        $modalStack.dismissAll();
    };

    chartContentEvent.replaceItem = function (oldId, newItem) {
        angular.forEach(chartContentEvent.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = chartContentEvent.ListItems.indexOf(item);
                chartContentEvent.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            chartContentEvent.ListItems.unshift(newItem);
    }
    // delete content
    chartContentEvent.deleteRow = function () {
        if (!chartContentEvent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                chartContentEvent.busyIndicator.isActive = true;
                console.log(chartContentEvent.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'chartContentEvent/GetOne', chartContentEvent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    chartContentEvent.selectedItemForDelete = response.Item;
                    console.log(chartContentEvent.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'chartContentEvent/delete', chartContentEvent.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        chartContentEvent.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            chartContentEvent.replaceItem(chartContentEvent.selectedItemForDelete.Id);
                            chartContentEvent.gridOptions.fillData(chartContentEvent.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        chartContentEvent.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    chartContentEvent.busyIndicator.isActive = false;
                });
            }
        });
    }

    chartContentEvent.searchData = function () {
        chartContentEvent.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"chartContentEvent/getall", chartContentEvent.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            chartContentEvent.categoryBusyIndicator.isActive = false;
            chartContentEvent.ListItems = response.ListItems;
            chartContentEvent.gridOptions.fillData(chartContentEvent.ListItems);
            chartContentEvent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            chartContentEvent.gridOptions.totalRowCount = response.TotalRowCount;
            chartContentEvent.gridOptions.rowPerPage = response.RowPerPage;
            chartContentEvent.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            chartContentEvent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //chartContentEvent.gridOptions.searchData();

    }
    chartContentEvent.LinkChartContentIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkChartContentId',
        url: 'ChartContent',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'LinkChartContentId',
        rowPerPage: 200,
        scope: chartContentEvent,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
            ]
        }
    }
    chartContentEvent.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkChartContentId', displayName: 'کد سیستمی چارت', sortable: true, type: 'integer', visible: true },
            { name: 'virtual_ChartContent.Title', displayName: 'عنوان چارت', sortable: true, type: 'string', visible: true },
            { name: 'Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
            { name: 'Description', displayName: 'Description', sortable: true, type: 'string', visible: true },
            { name: 'StartDateTime', displayName: 'StartDateTime', sortable: true, sortable: true, type: 'date', visible: true },
            { name: 'EndDateTime', displayName: 'EndDateTime', sortable: true, sortable: true, type: 'date', visible: true },
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

    chartContentEvent.test = 'false';

    chartContentEvent.gridOptions.reGetAll = function () {
        chartContentEvent.init();
    }

    chartContentEvent.gridOptions.onRowSelected = function () { }

    chartContentEvent.columnCheckbox = false;
    chartContentEvent.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (chartContentEvent.gridOptions.columnCheckbox) {
            for (var i = 0; i < chartContentEvent.gridOptions.columns.length; i++) {
                //chartContentEvent.gridOptions.columns[i].visible = $("#" + chartContentEvent.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + chartContentEvent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                chartContentEvent.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = chartContentEvent.gridOptions.columns;
            for (var i = 0; i < chartContentEvent.gridOptions.columns.length; i++) {
                chartContentEvent.gridOptions.columns[i].visible = true;
                var element = $("#" + chartContentEvent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + chartContentEvent.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < chartContentEvent.gridOptions.columns.length; i++) {
            console.log(chartContentEvent.gridOptions.columns[i].name.concat(".visible: "), chartContentEvent.gridOptions.columns[i].visible);
        }
        chartContentEvent.gridOptions.columnCheckbox = !chartContentEvent.gridOptions.columnCheckbox;
    }
   
    //Export Report 
    chartContentEvent.exportFile = function () {
        chartContentEvent.addRequested = true;
        chartContentEvent.gridOptions.advancedSearchData.engine.ExportFile = chartContentEvent.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'chartContentEvent/exportfile', chartContentEvent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            chartContentEvent.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                chartContentEvent.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //chartContentEvent.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    chartContentEvent.toggleExportForm = function () {
        chartContentEvent.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        chartContentEvent.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        chartContentEvent.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        chartContentEvent.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        chartContentEvent.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleChart/chartContentEvent/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    chartContentEvent.rowCountChanged = function () {
        if (!angular.isDefined(chartContentEvent.ExportFileClass.RowCount) || chartContentEvent.ExportFileClass.RowCount > 5000)
            chartContentEvent.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    chartContentEvent.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"chartContentEvent/count", chartContentEvent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            chartContentEvent.addRequested = false;
            rashaErManage.checkAction(response);
            chartContentEvent.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            chartContentEvent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

