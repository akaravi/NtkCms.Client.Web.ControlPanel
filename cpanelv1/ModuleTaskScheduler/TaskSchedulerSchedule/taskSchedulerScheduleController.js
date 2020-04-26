app.controller("scheduleController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$builder', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $builder, $timeout, $window, $filter) {
    var schedule = this;
    schedule.isLoading =true;
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    schedule.showWeekly = false;
    schedule.showmonthly = false;
    schedule.showonce = false;
    schedule.showmonthlyYear=false;
    checked_ = false;
    schedule.ProcessesListItems = [];
        // Get All ProcessCategory
        ajax.call(cmsServerConfig.configApiServerPath+"TaskSchedulerProcessCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            schedule.cmsModulesListItems = response.ListItems;
            //schedule.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            //schedule.busyIndicator.isActive = false;
        });
    /*schedule.weekdays = [
        { title: 'شنبه', value: 1, checked: checked_ },
        { title: 'یکشنبه', value: 2, checked: checked_ },
        { title: 'دوشنبه', value: 3, checked: checked_ },
        { title: 'سه شنبه', value: 4, checked: checked_ },
        { title: 'چهارشنبه', value: 5, checked: checked_ },
        { title: 'پنجشنبه', value: 6, checked: checked_ },
        { title: 'جمعه', value: 7, checked: checked_ }
    ];*/
    schedule.monthDay = [];
    for (var i = 1; i < 32; i++) {
        schedule.monthDay.push({ title: i + '', value: i, checked: checked_ });
    }
    if (itemRecordStatus != undefined) schedule.itemRecordStatus = itemRecordStatus;

    var date = moment().format();

    schedule.CronOnceDate = {
        defaultDate: date,
        setTime: function (date) { this.defaultDate = date; }
    }
    schedule.startDate = {
        defaultDate: date,
        setTime: function (date) { this.defaultDate = date; }
    }
    schedule.endDate = {
        defaultDate: date,
        setTime: function (date) { this.defaultDate = date; }
    }
    schedule.count = 0;

    //schedule Grid Options
    schedule.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: 'true' },
            { name: 'Frequency', displayName: 'زمان وقفه(ثانیه)', sortable: true, type: 'integer', visible: 'true' },
            { name: 'FrequencyCounter', displayName: 'تکرار', sortable: true, type: 'integer', visible: 'true' },
            { name: 'ScheduleCronType', displayName: 'نوع زمان بندی', sortable: true, type: 'string', visible: 'true' },
            
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "Id",
                SortType: 0,
                NeedToRunFakePagination: false,
                TotalRowData: 2000,
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: [{
                    PropertyName: "ScheduleUsageType",
                    EnumValue1: "limitation",
                    SearchType: 0,
                }]
            }
        }

    }
//schedule Grid Options
    schedule.gridOptionsTaskLog = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: 'true' },
            { name: 'IntervalSeconds', displayName: 'زمان وقفه(ثانیه)', sortable: true, type: 'integer', visible: 'true' },
            { name: 'Frequency', displayName: 'تکرار', sortable: true, type: 'integer', visible: 'true' },
            { name: 'ScheduleCronType', displayName: 'نوع زمان بندی', sortable: true, type: 'string', visible: 'true' },
            
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "Id",
                SortType: 0,
                NeedToRunFakePagination: false,
                TotalRowData: 2000,
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: []
            }
        }

    }
    //For Show schedule Loading Indicator
    schedule.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    schedule.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    schedule.addMenu = function () {
        $modal.open({
            templateUrl: "cpanelv1/ModuleTaskScheduler/schedule/modalMenu.html",
            scope: $scope
        });
    }
    
    schedule.treeConfig.currentNode = {};
    schedule.treeBusyIndicator = false;

    schedule.addRequested = false;

    schedule.showGridComment = false;
    schedule.scheduleTitle = "";

    //init Function
    schedule.init = function () {
        schedule.contentBusyIndicator = true;
        ajax.call(cmsServerConfig.configApiServerPath+"TaskSchedulerSchedule/getAllScheduleCronType", {}, 'POST').success(function (response) {
            schedule.ScheduleCronType = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"TaskSchedulerSchedule/getAllDayOfWeek", {}, 'POST').success(function (response) {
            schedule.weekdays = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
            var filterModel = {
                Filters: [{
                    PropertyName: "ScheduleUsageType",
                    EnumValue1: "limitation",
                    SearchType: 0,
                }]
            };
        /*var engine={};
        engine.Filters = [];
        engine.Filters.push(filterModel);*/
        ajax.call(cmsServerConfig.configApiServerPath+"TaskSchedulerSchedule/getall", filterModel, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            schedule.ListItems = response.ListItems;
            schedule.gridOptions.fillData(schedule.ListItems, response.resultAccess); // Sending Access as an argument
            schedule.contentBusyIndicator.isActive = false;
            schedule.gridOptions.currentPageNumber = response.CurrentPageNumber;
            schedule.gridOptions.totalRowCount = response.TotalRowCount;
            schedule.gridOptions.rowPerPage = response.RowPerPage;
            schedule.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            schedule.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            schedule.contentBusyIndicator.isActive = false;
        });
    };
 schedule.showTaskLog = function () {
        //schedule.contentBusyIndicator = true;
        ajax.call(cmsServerConfig.configApiServerPath+"TaskSchedulerTaskLog/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            schedule.ListItems = response.ListItems;
            schedule.gridOptionsTaskLog.fillData(schedule.ListItems, response.resultAccess); // Sending Access as an argument
            //schedule.contentBusyIndicator.isActive = false;
            schedule.gridOptionsTaskLog.currentPageNumber = response.CurrentPageNumber;
            schedule.gridOptionsTaskLog.totalRowCount = response.TotalRowCount;
            schedule.gridOptionsTaskLog.rowPerPage = response.RowPerPage;
            schedule.gridOptionsTaskLog.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            schedule.gridOptionsTaskLog.fillData();
            rashaErManage.checkAction(data, errCode);
            schedule.contentBusyIndicator.isActive = false;
        });
    };
    schedule.gridOptions.onRowSelected = function () {
    }
    // Open Add New Content Model
    schedule.openAddModal = function () {
        if (buttonIsPressed) { return };
        schedule.addRequested = false;
        schedule.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        schedule.valueSubmit = [];
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerSchedule/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            schedule.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTaskScheduler/TaskSchedulerSchedule/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    schedule.openEditModel = function () {
        if (buttonIsPressed) { return };
        schedule.addRequested = false;
        schedule.modalTitle = 'ویرایش';
        if (!schedule.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerSchedule/GetOne', schedule.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            schedule.selectedItem = response1.Item;
            schedule.startDate.setTime(response1.Item.StartDate);
            schedule.endDate.setTime(response1.Item.EndDate);
            schedule.onScheduleTypeChange(response1.Item.ScheduleCronType);
            schedule.schedueDetail=[];
            schedule.schedueDetail.StartLiveTime;
            switch (response1.Item.ScheduleCronType) {
                case 1:
                        //schedule.schedueDetail.StartLiveTime = new Date("October 13 2014," + dayly.StartLiveTime);
                    break;
                case 2:
                        schedule.schedueDetail.StartLiveTime = new Date("October 13 2014," + schedule.selectedItem.CronHourlyMinute);
                    break;
                case 3:
                        schedule.schedueDetail.StartLiveTime = new Date("October 13 2014," + schedule.selectedItem.CronDailyHour + ":" + schedule.selectedItem.CronDailyMinute + ":00");
                    break;
                case 4:
                        schedule.schedueDetail.StartLiveTime = new Date("October 13 2014," + schedule.selectedItem.CronWeeklyHour + ":" + schedule.selectedItem.CronWeeklyMinute + ":00");
                    break;
                case 5:
                        schedule.schedueDetail.StartLiveTime = new Date("October 13 2014," + schedule.selectedItem.CronMonthlyHour + ":" + schedule.selectedItem.CronMonthlyMinute + ":00");
                    break;
                case 6:
                        schedule.schedueDetail.StartLiveTime = new Date("October 13 2014," + schedule.selectedItem.CronYearlyHour + ":" + chedule.selectedItem.CronYearlyMinute + ":00");
                    break;
            }
            schedule.startDate.defaultDate = schedule.selectedItem.FromDate;
            schedule.endDate.defaultDate = schedule.selectedItem.ToDate;
            
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTaskScheduler/TaskSchedulerSchedule/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }


    // Add New Content
    schedule.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
         switch (schedule.selectedItem.ScheduleCronType) {
            case 5:
                if(schedule.selectedItem.CronMonthlyDay>31 || schedule.selectedItem.CronMonthlyDay<1)
                {
                    rashaErManage.showMessage("روز نامعتبر است");
                    return;
                }
                break;
            case 6:
               if((schedule.selectedItem.CronYearlyMonth>12 || schedule.selectedItem.CronYearlyMonth<1) || (schedule.selectedItem.CronYearlyDay>31 || schedule.selectedItem.CronYearlyDay<1))
                {
                    rashaErManage.showMessage("روز نامعتبر است");
                    return;
                }
                break;
           }
        schedule.contentBusyIndicator.isActive = true;
        schedule.addRequested = true;
        schedule.selectedItem.ScheduleUsageType=2;
        //schedule.selectedItem.ProcessInputValue = $.trim(angular.toJson(schedule.valueSubmit));
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerSchedule/add', schedule.selectedItem, 'POST').success(function (response1) {
            rashaErManage.checkAction(response1);
            schedule.contentBusyIndicator.isActive = false;
            if (response1.IsSuccess) {
                schedule.ListItems.unshift(response1.Item);
                schedule.gridOptions.fillData(schedule.ListItems);
                schedule.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            schedule.addRequested = false;
            schedule.contentBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    schedule.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
         switch (schedule.selectedItem.ScheduleCronType) {
            case 5:
                if(schedule.selectedItem.CronMonthlyDay>31 || schedule.selectedItem.CronMonthlyDay<1)
                {
                    rashaErManage.showMessage("روز نامعتبر است");
                    return;
                }
                break;
            case 6:
               if((schedule.selectedItem.CronYearlyMonth>12 || schedule.selectedItem.CronYearlyMonth<1) || (schedule.selectedItem.CronYearlyDay>31 || schedule.selectedItem.CronYearlyDay<1))
                {
                    rashaErManage.showMessage("روز یا ماه نامعتبر است");
                    return;
                }
                break;
           }
        schedule.contentBusyIndicator.isActive = true;
        schedule.editRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerSchedule/edit', schedule.selectedItem, 'PUT').success(function (response1) {
            schedule.editRequested = false;
            rashaErManage.checkAction(response1);
            schedule.contentBusyIndicator.isActive = false;
            if (response1.IsSuccess) {
                schedule.gridOptions.fillData(schedule.ListItems);
                schedule.closeModal();
              }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            schedule.editRequested = false;
            schedule.contentBusyIndicator.isActive = false;

        });
    }
    // Delete a schedule Content 
    schedule.deleteContent = function () {
        if (buttonIsPressed) { return }
        if (!schedule.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        schedule.treeConfig.showbusy = true;
        schedule.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                schedule.contentBusyIndicator.isActive = true;
                console.log(schedule.gridOptions.selectedRow.item);
                schedule.showbusy = true;
                schedule.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerSchedule/GetOne', schedule.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    schedule.showbusy = false;
                    schedule.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    schedule.selectedItemForDelete = response.Item;
                    console.log(schedule.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"TaskSchedulerSchedule/delete", schedule.selectedItemForDelete, 'POST').success(function (res) {
                        schedule.contentBusyIndicator.isActive = false;
                        schedule.treeConfig.showbusy = false;
                        schedule.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            schedule.replaceItem(schedule.selectedItemForDelete.Id);
                            schedule.gridOptions.fillData(schedule.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        schedule.treeConfig.showbusy = false;
                        schedule.showIsBusy = false;
                        schedule.contentBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    schedule.treeConfig.showbusy = false;
                    schedule.showIsBusy = false;
                    schedule.contentBusyIndicator.isActive = false;
                });
            }
        });
    }

   //Replace Item OnDelete/OnEdit Grid Options
    schedule.replaceItem = function (oldId, newItem) {
        angular.forEach(schedule.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = schedule.ListItems.indexOf(item);
                schedule.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            schedule.ListItems.unshift(newItem);
    }

    //Close Model Stack
    schedule.addRequested = false;
    schedule.closeModal = function () {
        $modalStack.dismissAll();
        schedule.isLoading=true;
        schedule.valueSubmit=null;
    };

    schedule.showIsBusy = false;

    //For reInit Categories
    schedule.gridOptions.reGetAll = function () {
        schedule.init();
    };

    schedule.isCurrentNodeEmpty = function () {
        return !angular.equals({}, schedule.treeConfig.currentNode);
    }

    schedule.loadFileAndFolder = function (item) {
        schedule.treeConfig.currentNode = item;
        console.log(item);
        schedule.treeConfig.onNodeSelect(item);
    }
    schedule.addRequested = true;

    schedule.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            schedule.focus = true;
        });
    };

    schedule.columnCheckbox = false;

    schedule.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = schedule.gridOptions.columns;
        if (schedule.gridOptions.columnCheckbox) {
            for (var i = 0; i < schedule.gridOptions.columns.length; i++) {
                //schedule.gridOptions.columns[i].visible = $("#" + schedule.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + schedule.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                schedule.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < schedule.gridOptions.columns.length; i++) {
                var element = $("#" + schedule.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + schedule.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < schedule.gridOptions.columns.length; i++) {
            console.log(schedule.gridOptions.columns[i].name.concat(".visible: "), schedule.gridOptions.columns[i].visible);
        }
        schedule.gridOptions.columnCheckbox = !schedule.gridOptions.columnCheckbox;
    }
   
    schedule.onScheduleTypeChange = function (scheduleType) {
        switch (scheduleType) {
            case 1:
                schedule.showWeekly = false;
                schedule.showmonthly = false;
                schedule.showonce = true;
                schedule.showmonthlyYear = false;
                schedule.showHourly=false;
                schedule.showDaily=false;
                break;
            case 2:
                schedule.showWeekly = false;
                schedule.showmonthly = false;
                schedule.showonce = false;
                schedule.showmonthlyYear = false; 
                schedule.showHourly=true;
                schedule.showDaily=false;
                break;
            case 3:
                schedule.showmonthly = false;
                schedule.showonce = false;
                schedule.showWeekly = false;
                schedule.showmonthlyYear = false;
                schedule.showHourly=false;
                schedule.showDaily=true;
                break;
            case 4:
                schedule.showmonthly = false;
                schedule.showonce = false;
                schedule.showWeekly = true;
                schedule.showmonthlyYear = false;
                schedule.showHourly=false;
                schedule.showDaily=false;
                break;
            case 5:
                schedule.showmonthly = true;
                schedule.showonce = false;
                schedule.showWeekly = false;
                schedule.showmonthlyYear = false;
                schedule.showHourly=false;
                schedule.showDaily=false;
                break;
            case 6:
                schedule.showonce = false;
                schedule.showWeekly = false;
                schedule.showmonthly = false;
                schedule.showmonthlyYear = true;
                schedule.showHourly=false;
                schedule.showDaily=false;
                break;
        }
    };
    //Export Report 
    schedule.exportFile = function () {
        schedule.gridOptions.advancedSearchData.engine.ExportFile = schedule.ExportFileClass;
        schedule.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerSchedule/exportfile', schedule.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            schedule.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                schedule.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //schedule.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    schedule.toggleExportForm = function () {
        schedule.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        schedule.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        schedule.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        schedule.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        schedule.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleTaskScheduler/TaskSchedulerSchedule/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    schedule.rowCountChanged = function () {
        if (!angular.isDefined(schedule.ExportFileClass.RowCount) || schedule.ExportFileClass.RowCount > 5000)
            schedule.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    schedule.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"TaskSchedulerSchedule/count", schedule.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            schedule.addRequested = false;
            rashaErManage.checkAction(response);
            schedule.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            schedule.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);
