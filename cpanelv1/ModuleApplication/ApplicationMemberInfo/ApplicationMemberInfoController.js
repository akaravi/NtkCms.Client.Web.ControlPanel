app.controller("memberInfoController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$builder', '$state', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $builder, $state, $window, $filter) {
    var memberInfo = this;
    memberInfo.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    memberInfo.filePickerSmallImage = {
        isActive: true,
        backElement: "filePickerSmallImage",
        filename: null,
        fileId: null,
        multiSelect: false
    };
    memberInfo.filePickerBigImage = {
        isActive: true,
        backElement: "filePickerBigImage",
        filename: null,
        fileId: null,
        multiSelect: false
    };
    memberInfo.UninversalMenus = [];
    memberInfo.selectUniversalMenuOnUndetectableKey = true;
    if (itemRecordStatus != undefined) memberInfo.itemRecordStatus = itemRecordStatus;
    //#help/ سلکتور  عضو 
    memberInfo.LinkUserIdSelector = {
        displayMember: "FirstName",
        id: "Id",
        fId: "LinkUserId",
        url: "cmsUser",
        sortColumn: "Id",
        sortType: 0,
        filterText: "FirstName",
        showAddDialog: false,
        rowPerPage: 200,
        scope: memberInfo,
        columnOptions: {
            columns: [{
                    name: "Id",
                    displayName: "کد سیستمی",
                    sortable: true,
                    type: "integer"
                },
                {
                    name: "FirstName",
                    displayName: "نام",
                    sortable: true,
                    type: "string"
                },
                {
                    name: "LastName",
                    displayName: "نام خانوادگی",
                    sortable: true,
                    type: "string"
                }
            ]
        }
    };
    memberInfo.calculatePercantage = function (list) {
        if (angular.isDefined(list) && list.length > 0) {

            $.each(list, function (index, item) {

                item.Virtual_ScoreSumPercent = '%' + (item.ScorePercent).toFixed(2);
            });
        }
    }
    memberInfo.init = function () {
        memberInfo.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath + "Applicationmemberinfo/getall", memberInfo.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);

            memberInfo.busyIndicator.isActive = false;
            memberInfo.ListItems = response.ListItems;
            memberInfo.calculatePercantage(memberInfo.ListItems);

            memberInfo.gridOptions.fillData(memberInfo.ListItems, response.resultAccess);
            memberInfo.gridOptions.currentPageNumber = response.CurrentPageNumber;
            memberInfo.gridOptions.totalRowCount = response.TotalRowCount;
            memberInfo.gridOptions.rowPerPage = response.RowPerPage;
            memberInfo.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            memberInfo.busyIndicator.isActive = false;
            memberInfo.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //@help برای زمانبندی
        ajax.call(cmsServerConfig.configApiServerPath + "TaskSchedulerSchedule/getAllScheduleCronType", {}, 'POST').success(function (response) {
            memberInfo.ScheduleCronType = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath + "ApplicationEnum/EnumNotificationType", '', 'GET').success(function (responseGetEnum) {
            rashaErManage.checkAction(responseGetEnum);
            if (responseGetEnum.IsSuccess)
                memberInfo.EnumNotificationType = responseGetEnum.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
        ajax.call(cmsServerConfig.configApiServerPath + "TaskSchedulerSchedule/getAllDayOfWeek", {}, 'POST').success(function (response) {
            memberInfo.weekdays = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        //@help برای زمانبندی
    }

    // Open Add Modal
    memberInfo.busyIndicator.isActive = true;

    memberInfo.addRequested = false;

    memberInfo.openAddModal = function () {
        if (buttonIsPressed) return;

        memberInfo.modalTitle = 'اضافه';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationmemberInfo/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            memberInfo.busyIndicator.isActive = false;
            memberInfo.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleApplication/ApplicationMemberInfo/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberInfo.busyIndicator.isActive = false;
        });

    }

    // Add New Content
    memberInfo.addNewRow = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        memberInfo.busyIndicator.isActive = true;
        memberInfo.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationMemberInfo/add', memberInfo.selectedItem, 'POST').success(function (response) {
            memberInfo.addRequested = false;
            memberInfo.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                memberInfo.ListItems.unshift(response.Item);
                memberInfo.gridOptions.fillData(memberInfo.ListItems);
                memberInfo.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberInfo.busyIndicator.isActive = false;
            memberInfo.addRequested = false;
        });
    }
    

    memberInfo.openEditModal = function () {
        if (buttonIsPressed) return;

        memberInfo.modalTitle = 'ویرایش';
        if (!memberInfo.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationMemberInfo/GetOne', memberInfo.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;

            rashaErManage.checkAction(response);
            memberInfo.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleApplication/ApplicationMemberInfo/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    memberInfo.editRow = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        memberInfo.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationMemberInfo/edit', memberInfo.selectedItem, 'PUT').success(function (response) {
            memberInfo.addRequested = true;
            rashaErManage.checkAction(response);
            memberInfo.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                memberInfo.addRequested = false;
                memberInfo.replaceItem(memberInfo.selectedItem.Id, response.Item);
                memberInfo.gridOptions.fillData(memberInfo.ListItems);
                memberInfo.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberInfo.addRequested = false;
            memberInfo.busyIndicator.isActive = false;

        });
    }

    memberInfo.closeModal = function () {
        $modalStack.dismissAll();
    };

    memberInfo.replaceItem = function (oldId, newItem) {
        angular.forEach(memberInfo.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = memberInfo.ListItems.indexOf(item);
                memberInfo.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            memberInfo.ListItems.unshift(newItem);
    }

    memberInfo.deleteRow = function () {
        if (buttonIsPressed) return;

        if (!memberInfo.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                memberInfo.busyIndicator.isActive = true;
                console.log(memberInfo.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationMemberInfo/GetOne', memberInfo.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    memberInfo.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationMemberInfo/delete', memberInfo.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        memberInfo.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            memberInfo.replaceItem(memberInfo.selectedItemForDelete.Id);
                            memberInfo.gridOptions.fillData(memberInfo.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        memberInfo.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    memberInfo.busyIndicator.isActive = false;

                });
            }
        });
    }

    memberInfo.searchData = function () {
        memberInfo.gridOptions.searchData();

    }

    memberInfo.gridOptions = {
        columns: [{
                name: 'Id',
                displayName: 'کد سیستمی',
                sortable: true,
                type: 'integer',
                visible: true
            },
            {
                name: 'LinkSiteId',
                displayName: 'کد سیستمی سایت',
                sortable: true,
                type: 'integer',
                visible: true
            },
            {
                name: 'CreatedDate',
                displayName: 'ساخت',
                sortable: true,
                isDate: true,
                type: 'date',
                visible: 'true'
            },
            {
                name: 'UpdatedDate',
                displayName: 'ویرایش',
                sortable: true,
                isDate: true,
                type: 'date',
                visible: 'true'
            },
            {
                name: 'AppSourceVer',
                displayName: 'Source Ver',
                sortable: true,
                type: 'integer',
                visible: true
            },
            {
                name: 'AppBuildVer',
                displayName: 'Build Ver',
                sortable: true,
                type: 'integer',
                visible: true
            },
            {
                name: 'LinkApplicationId',
                displayName: 'کد سیستمی اپ',
                sortable: true,
                type: 'integer',
                visible: true
            },
            {
                name: 'LinkMemberId',
                displayName: 'کد سیستمی عضو',
                sortable: true,
                type: 'integer',
                visible: true
            },
            {
                name: 'Virtual_ScoreSumPercent',
                displayName: 'امتیاز',
                sortable: true,
                type: 'string',
                visible: 'true',
                displayForce: true
            },

            {
                name: 'DeviceId',
                displayName: 'شناسه دستگاه',
                sortable: true,
                type: 'string',
                visible: true
            },
            {
                name: 'ActionButton2',
                displayName: 'عملیات',
                sortable: true,
                type: 'string',
                visible: true,
                displayForce: true,
                template: '<button type="button" name="getInfo_btn" ng-click="memberInfo.openSendToModal($index, x)" class="btn btn-success">{{"SEND"|lowercase|translate}}&nbsp;<i class="fa fa-envelope-o" aria-hidden="true"></i></button>'
            }
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
                TotalRowData: 2000,
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }

    memberInfo.gridOptions.reGetAll = function () {
        memberInfo.init();
    }

    memberInfo.gridOptions.onRowSelected = function () {

    }

    memberInfo.columnCheckbox = false;

    memberInfo.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (memberInfo.gridOptions.columnCheckbox) {
            for (var i = 0; i < memberInfo.gridOptions.columns.length; i++) {
                //memberInfo.gridOptions.columns[i].visible = $("#" + memberInfo.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + memberInfo.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                memberInfo.gridOptions.columns[i].visible = element[0].checked;
            }
        } else {
            var prechangeColumns = memberInfo.gridOptions.columns;
            for (var i = 0; i < memberInfo.gridOptions.columns.length; i++) {
                memberInfo.gridOptions.columns[i].visible = true;
                var element = $("#" + memberInfo.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + memberInfo.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < memberInfo.gridOptions.columns.length; i++) {
            console.log(memberInfo.gridOptions.columns[i].name.concat(".visible: "), memberInfo.gridOptions.columns[i].visible);
        }
        memberInfo.gridOptions.columnCheckbox = !memberInfo.gridOptions.columnCheckbox;
    }

    memberInfo.changeState = function (state, app) {
        $state.go("index." + state, {
            sourceid: app.LinkSourceId,
            appid: app.Id,
            apptitle: app.Title
        });
    }

    function parseJSONcomponent(str) {
        var defaultStr = '[{"id":0,"component":"text","editable":true,"index":0,"label":"متن ساده","description":"","placeholder":"","options":[],"required":false,"validation":"/.*/","logic":{"action":"Hide"}}]';
        if (str == undefined || str == null || str == "")
            str = defaultStr;
        try {
            JSON.parse(str);
        } catch (e) {
            str = defaultStr;
        }
        return $.parseJSON(str);
    }
    //Export Report 
    memberInfo.exportFile = function () {
        memberInfo.addRequested = true;
        memberInfo.gridOptions.advancedSearchData.engine.ExportFile = memberInfo.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationMemberInfo/exportfile', memberInfo.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            memberInfo.addRequested = false;
            rashaErManage.checkAction(response);
            memberInfo.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //memberInfo.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    memberInfo.toggleExportForm = function () {
        memberInfo.SortType = [{
                key: 'نزولی',
                value: 0
            },
            {
                key: 'صعودی',
                value: 1
            },
            {
                key: 'تصادفی',
                value: 3
            }
        ];
        memberInfo.EnumExportFileType = [{
                key: 'Excel',
                value: 1
            },
            {
                key: 'PDF',
                value: 2
            },
            {
                key: 'Text',
                value: 3
            }
        ];
        memberInfo.EnumExportReceiveMethod = [{
                key: 'دانلود',
                value: 0
            },
            {
                key: 'ایمیل',
                value: 1
            },
            {
                key: 'فایل منیجر',
                value: 3
            }
        ];
        memberInfo.ExportFileClass = {
            FileType: 1,
            RecieveMethod: 0,
            RowCount: 100
        };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleApplication/ApplicationMemberInfo/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    memberInfo.rowCountChanged = function () {
        if (!angular.isDefined(memberInfo.ExportFileClass.RowCount) || memberInfo.ExportFileClass.RowCount > 5000)
            memberInfo.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    memberInfo.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath + "ApplicationMemberInfo/count", memberInfo.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            memberInfo.addRequested = false;
            rashaErManage.checkAction(response);
            memberInfo.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            memberInfo.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    //@help@ ارسال پیام
    memberInfo.openSendToModal = function (selectedIndex, selected) {
        memberInfo.selectedItem = {
            AppId: selected.LinkApplicationId,
            memberIds: "" + selected.Id
        };
        memberInfo.filePickerSmallImage.filename = null;
        memberInfo.filePickerBigImage.fileId = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleApplication/ApplicationMemberInfo/sendNotificationModal.html',
            scope: $scope
        });
    }

    //var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    var date = moment().format();
    memberInfo.CronOnceDate = {
        defaultDate: date,
        setTime: function (date) {
            this.defaultDate = date;
        }
    }
    memberInfo.onEnumNotificationTypeChange = function (NotificationType) {
        switch (NotificationType) {
            case 1:
                // memberInfo.showWeekly = false;
                // memberInfo.showmonthly = false;
                // memberInfo.showonce = true;
                // memberInfo.showmonthlyYear = false;
                // memberInfo.showHourly = false;
                // memberInfo.showDaily = false;
                break;
            case 2:
                // memberInfo.showWeekly = false;
                // memberInfo.showmonthly = false;
                // memberInfo.showonce = false;
                // memberInfo.showmonthlyYear = false;
                // memberInfo.showHourly = true;
                // memberInfo.showDaily = false;
                break;
        }
    };


    memberInfo.onScheduleTypeChange = function (scheduleType) {
        switch (scheduleType) {
            case 1:
                memberInfo.showWeekly = false;
                memberInfo.showmonthly = false;
                memberInfo.showonce = true;
                memberInfo.showmonthlyYear = false;
                memberInfo.showHourly = false;
                memberInfo.showDaily = false;
                break;
            case 2:
                memberInfo.showWeekly = false;
                memberInfo.showmonthly = false;
                memberInfo.showonce = false;
                memberInfo.showmonthlyYear = false;
                memberInfo.showHourly = true;
                memberInfo.showDaily = false;
                break;
            case 3:
                memberInfo.showmonthly = false;
                memberInfo.showonce = false;
                memberInfo.showWeekly = false;
                memberInfo.showmonthlyYear = false;
                memberInfo.showHourly = false;
                memberInfo.showDaily = true;
                break;
            case 4:
                memberInfo.showmonthly = false;
                memberInfo.showonce = false;
                memberInfo.showWeekly = true;
                memberInfo.showmonthlyYear = false;
                memberInfo.showHourly = false;
                memberInfo.showDaily = false;
                break;
            case 5:
                memberInfo.showmonthly = true;
                memberInfo.showonce = false;
                memberInfo.showWeekly = false;
                memberInfo.showmonthlyYear = false;
                memberInfo.showHourly = false;
                memberInfo.showDaily = false;
                break;
            case 6:
                memberInfo.showonce = false;
                memberInfo.showWeekly = false;
                memberInfo.showmonthly = false;
                memberInfo.showmonthlyYear = true;
                memberInfo.showHourly = false;
                memberInfo.showDaily = false;
                break;
        }
    };


    memberInfo.sendButtonText = "ارسال";

    memberInfo.sendMessageToAll = function (selectedIndex, selectedId) {
        if (memberInfo.selectedItem.Title == '') {
            rashaErManage.showMessage("عنوان پیام را وارد کنید");
            return;
        }
        if (memberInfo.selectedItem.Content == '') {
            rashaErManage.showMessage("متن پیام را وارد کنید");
            return;
        }
        if (memberInfo.selectedItem.memberIds == '') {
            rashaErManage.showMessage("شناسه کاربر اپلیکیشن را وارد کنید");
            return;
        }


        memberInfo.addRequested = true;
        memberInfo.busyIndicator.isActive = true;
        memberInfo.sendButtonText = "در حال ارسال...";
        memberInfo.selectedItem.LinkMemberIds = [];
        if (memberInfo.selectedItem.memberIds != '')
            memberInfo.selectedItem.LinkMemberIds = memberInfo.selectedItem.memberIds.split(',');

        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationLogNotification/SendNotification', memberInfo.selectedItem, 'POST').success(function (response) {
            memberInfo.busyIndicator.isActive = false;
            memberInfo.addRequested = false;
            memberInfo.sendButtonText = "ارسال";
            rashaErManage.showMessage("گزارش سرور :" + response.Item.info + "   " + response.ErrorMessage);
            //memberInfo.closeModal();
        }).error(function (data, errCode, c, d) {
            memberInfo.addRequested = false;
            memberInfo.sendButtonText = "ارسال";
            rashaErManage.showMessage("گزارش خطا سرور ");
            memberInfo.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }
    //@help@ ارسال پیام
}]);