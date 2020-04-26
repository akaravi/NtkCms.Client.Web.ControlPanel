app.controller("applicationIntroController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$builder', '$state', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $builder, $state, $window, $filter) {
    var applicationIntro = this;
    applicationIntro.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    applicationIntro.filePickerSmallImage = {
        isActive: true,
        backElement: "filePickerSmallImage",
        filename: null,
        fileId: null,
        multiSelect: false
    };

    applicationIntro.filePickerMainImage = {
        isActive: true,
        backElement: "filePickerMainImage",
        filename: null,
        fileId: null,
        multiSelect: false
    };

    applicationIntro.UninversalMenus = [];
    applicationIntro.selectUniversalMenuOnUndetectableKey = true;
    if (itemRecordStatus != undefined) applicationIntro.itemRecordStatus = itemRecordStatus;
    //#help/ سلکتور  عضو 
    applicationIntro.LinkApplicationIdSelector = {
        displayMember: "Title",
        id: "Id",
        fId: "LinkApplicationId",
        url: "applicationapp",
        sortColumn: "Id",
        sortType: 0,
        filterText: "applicationapp",
        showAddDialog: true,
        rowPerPage: 200,
        scope: applicationIntro,
        columnOptions: {
            columns: [{
                    name: "Id",
                    displayName: "کد سیستمی",
                    sortable: true,
                    type: "integer"
                },
                {
                    name: "Title",
                    displayName: "عنوان",
                    sortable: true,
                    type: "string"
                }

            ]
        }
    };
    // applicationIntro.calculatePercantage = function (list) {
    //     if (angular.isDefined(list) && list.length > 0) {

    //         $.each(list, function (index, item) {

    //             item.Virtual_ScoreSumPercent = '%' + (item.ScorePercent).toFixed(2);
    //         });
    //     }
    // }
    applicationIntro.init = function () {
        applicationIntro.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath + "ApplicationIntro/getall", applicationIntro.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);

            applicationIntro.busyIndicator.isActive = false;
            applicationIntro.ListItems = response.ListItems;
            // applicationIntro.calculatePercantage(applicationIntro.ListItems);

            applicationIntro.gridOptions.fillData(applicationIntro.ListItems, response.resultAccess);
            applicationIntro.gridOptions.currentPageNumber = response.CurrentPageNumber;
            applicationIntro.gridOptions.totalRowCount = response.TotalRowCount;
            applicationIntro.gridOptions.rowPerPage = response.RowPerPage;
            applicationIntro.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            applicationIntro.busyIndicator.isActive = false;
            applicationIntro.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });


    }

    // Open Add Modal
    applicationIntro.busyIndicator.isActive = true;

    applicationIntro.addRequested = false;

    applicationIntro.openAddModal = function () {
        if (buttonIsPressed) return;

        applicationIntro.modalTitle = 'اضافه';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationIntro/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            applicationIntro.busyIndicator.isActive = false;
            applicationIntro.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleApplication/ApplicationIntro/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            applicationIntro.busyIndicator.isActive = false;
        });

    }

    // Add New Content
    applicationIntro.addNewRow = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        applicationIntro.busyIndicator.isActive = true;
        applicationIntro.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationIntro/add', applicationIntro.selectedItem, 'POST').success(function (response) {
            applicationIntro.addRequested = false;
            applicationIntro.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                applicationIntro.ListItems.unshift(response.Item);
                applicationIntro.gridOptions.fillData(applicationIntro.ListItems);
                applicationIntro.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            applicationIntro.busyIndicator.isActive = false;
            applicationIntro.addRequested = false;
        });
    }



    applicationIntro.openEditModal = function () {
        if (buttonIsPressed) return;

        applicationIntro.modalTitle = 'ویرایش';
        if (!applicationIntro.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationIntro/GetOne', applicationIntro.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;

            rashaErManage.checkAction(response);
            applicationIntro.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleApplication/ApplicationIntro/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    applicationIntro.editRow = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        applicationIntro.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationIntro/edit', applicationIntro.selectedItem, 'PUT').success(function (response) {
            applicationIntro.addRequested = true;
            rashaErManage.checkAction(response);
            applicationIntro.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                applicationIntro.addRequested = false;
                applicationIntro.replaceItem(applicationIntro.selectedItem.Id, response.Item);
                applicationIntro.gridOptions.fillData(applicationIntro.ListItems);
                applicationIntro.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            applicationIntro.addRequested = false;
            applicationIntro.busyIndicator.isActive = false;

        });
    }

    applicationIntro.closeModal = function () {
        $modalStack.dismissAll();
    };

    applicationIntro.replaceItem = function (oldId, newItem) {
        angular.forEach(applicationIntro.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = applicationIntro.ListItems.indexOf(item);
                applicationIntro.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            applicationIntro.ListItems.unshift(newItem);
    }

    applicationIntro.deleteRow = function () {
        if (buttonIsPressed) return;

        if (!applicationIntro.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                applicationIntro.busyIndicator.isActive = true;
                console.log(applicationIntro.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationIntro/GetOne', applicationIntro.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    applicationIntro.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationIntro/delete', applicationIntro.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        applicationIntro.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            applicationIntro.replaceItem(applicationIntro.selectedItemForDelete.Id);
                            applicationIntro.gridOptions.fillData(applicationIntro.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        applicationIntro.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    applicationIntro.busyIndicator.isActive = false;

                });
            }
        });
    }

    applicationIntro.searchData = function () {
        applicationIntro.gridOptions.searchData();

    }

    applicationIntro.gridOptions = {
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
            }, {
                name: 'Title',
                displayName: 'عنوان ',
                sortable: true,
                type: 'string',
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
                name: 'LinkApplicationId',
                displayName: 'کد سیستمی اپلیکیشن',
                sortable: true,
                type: 'integer',
                visible: true
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

    applicationIntro.gridOptions.reGetAll = function () {
        applicationIntro.init();
    }

    applicationIntro.gridOptions.onRowSelected = function () {

    }

    applicationIntro.columnCheckbox = false;

    applicationIntro.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (applicationIntro.gridOptions.columnCheckbox) {
            for (var i = 0; i < applicationIntro.gridOptions.columns.length; i++) {
                //applicationIntro.gridOptions.columns[i].visible = $("#" + applicationIntro.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + applicationIntro.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                applicationIntro.gridOptions.columns[i].visible = element[0].checked;
            }
        } else {
            var prechangeColumns = applicationIntro.gridOptions.columns;
            for (var i = 0; i < applicationIntro.gridOptions.columns.length; i++) {
                applicationIntro.gridOptions.columns[i].visible = true;
                var element = $("#" + applicationIntro.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + applicationIntro.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < applicationIntro.gridOptions.columns.length; i++) {
            console.log(applicationIntro.gridOptions.columns[i].name.concat(".visible: "), applicationIntro.gridOptions.columns[i].visible);
        }
        applicationIntro.gridOptions.columnCheckbox = !applicationIntro.gridOptions.columnCheckbox;
    }

    applicationIntro.changeState = function (state, app) {
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
    applicationIntro.exportFile = function () {
        applicationIntro.addRequested = true;
        applicationIntro.gridOptions.advancedSearchData.engine.ExportFile = applicationIntro.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationIntro/exportfile', applicationIntro.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            applicationIntro.addRequested = false;
            rashaErManage.checkAction(response);
            applicationIntro.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //applicationIntro.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    applicationIntro.toggleExportForm = function () {
        applicationIntro.SortType = [{
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
        applicationIntro.EnumExportFileType = [{
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
        applicationIntro.EnumExportReceiveMethod = [{
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
        applicationIntro.ExportFileClass = {
            FileType: 1,
            RecieveMethod: 0,
            RowCount: 100
        };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleApplication/ApplicationIntro/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    applicationIntro.rowCountChanged = function () {
        if (!angular.isDefined(applicationIntro.ExportFileClass.RowCount) || applicationIntro.ExportFileClass.RowCount > 5000)
            applicationIntro.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    applicationIntro.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath + "ApplicationIntro/count", applicationIntro.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            applicationIntro.addRequested = false;
            rashaErManage.checkAction(response);
            applicationIntro.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            applicationIntro.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }


    //var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    var date = moment().format();
    applicationIntro.CronOnceDate = {
        defaultDate: date,
        setTime: function (date) {
            this.defaultDate = date;
        }
    }
    applicationIntro.onEnumNotificationTypeChange = function (NotificationType) {
        switch (NotificationType) {
            case 1:
                // applicationIntro.showWeekly = false;
                // applicationIntro.showmonthly = false;
                // applicationIntro.showonce = true;
                // applicationIntro.showmonthlyYear = false;
                // applicationIntro.showHourly = false;
                // applicationIntro.showDaily = false;
                break;
            case 2:
                // applicationIntro.showWeekly = false;
                // applicationIntro.showmonthly = false;
                // applicationIntro.showonce = false;
                // applicationIntro.showmonthlyYear = false;
                // applicationIntro.showHourly = true;
                // applicationIntro.showDaily = false;
                break;
        }
    };


    applicationIntro.onScheduleTypeChange = function (scheduleType) {
        switch (scheduleType) {
            case 1:
                applicationIntro.showWeekly = false;
                applicationIntro.showmonthly = false;
                applicationIntro.showonce = true;
                applicationIntro.showmonthlyYear = false;
                applicationIntro.showHourly = false;
                applicationIntro.showDaily = false;
                break;
            case 2:
                applicationIntro.showWeekly = false;
                applicationIntro.showmonthly = false;
                applicationIntro.showonce = false;
                applicationIntro.showmonthlyYear = false;
                applicationIntro.showHourly = true;
                applicationIntro.showDaily = false;
                break;
            case 3:
                applicationIntro.showmonthly = false;
                applicationIntro.showonce = false;
                applicationIntro.showWeekly = false;
                applicationIntro.showmonthlyYear = false;
                applicationIntro.showHourly = false;
                applicationIntro.showDaily = true;
                break;
            case 4:
                applicationIntro.showmonthly = false;
                applicationIntro.showonce = false;
                applicationIntro.showWeekly = true;
                applicationIntro.showmonthlyYear = false;
                applicationIntro.showHourly = false;
                applicationIntro.showDaily = false;
                break;
            case 5:
                applicationIntro.showmonthly = true;
                applicationIntro.showonce = false;
                applicationIntro.showWeekly = false;
                applicationIntro.showmonthlyYear = false;
                applicationIntro.showHourly = false;
                applicationIntro.showDaily = false;
                break;
            case 6:
                applicationIntro.showonce = false;
                applicationIntro.showWeekly = false;
                applicationIntro.showmonthly = false;
                applicationIntro.showmonthlyYear = true;
                applicationIntro.showHourly = false;
                applicationIntro.showDaily = false;
                break;
        }
    };


    applicationIntro.sendButtonText = "ارسال";

    applicationIntro.sendMessageToAll = function (selectedIndex, selectedId) {
        if (applicationIntro.selectedItem.Title == '') {
            rashaErManage.showMessage("عنوان پیام را وارد کنید");
            return;
        }
        if (applicationIntro.selectedItem.Content == '') {
            rashaErManage.showMessage("متن پیام را وارد کنید");
            return;
        }
        if (applicationIntro.selectedItem.memberIds == '') {
            rashaErManage.showMessage("شناسه کاربر اپلیکیشن را وارد کنید");
            return;
        }


        applicationIntro.addRequested = true;
        applicationIntro.busyIndicator.isActive = true;
        applicationIntro.sendButtonText = "در حال ارسال...";
        applicationIntro.selectedItem.LinkMemberIds = [];
        if (applicationIntro.selectedItem.memberIds != '')
            applicationIntro.selectedItem.LinkMemberIds = applicationIntro.selectedItem.memberIds.split(',');

        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationLogNotification/SendNotification', applicationIntro.selectedItem, 'POST').success(function (response) {
            applicationIntro.busyIndicator.isActive = false;
            applicationIntro.addRequested = false;
            applicationIntro.sendButtonText = "ارسال";
            rashaErManage.showMessage("گزارش سرور :" + response.Item.info + "   " + response.ErrorMessage);
            //applicationIntro.closeModal();
        }).error(function (data, errCode, c, d) {
            applicationIntro.addRequested = false;
            applicationIntro.sendButtonText = "ارسال";
            rashaErManage.showMessage("گزارش خطا سرور ");
            applicationIntro.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }
    //@help@ ارسال پیام
}]);