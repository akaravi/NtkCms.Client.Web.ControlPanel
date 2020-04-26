app.controller("botConfigGridController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$rootScope', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $rootScope, $filter) {
    var botConfigCtrl = this;
    botConfigCtrl.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    botConfigCtrl.UninversalMenus = [];
    botConfigCtrl.selectUniversalMenuOnUndetectableKey = true;
    if (itemRecordStatus != undefined) botConfigCtrl.itemRecordStatus = itemRecordStatus;

    botConfigCtrl.showWeekly = false;
    botConfigCtrl.showmonthly = false;
    botConfigCtrl.showonce = false;
    botConfigCtrl.showmonthlyYear = false;
    botConfigCtrl.showHourly=false;
    botConfigCtrl.showDaily=false;

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    var date = moment().format();

    botConfigCtrl.CronOnceDate = {
        defaultDate: date,
        setTime: function (date) { this.defaultDate = date; }
    }
    botConfigCtrl.init = function () {
        botConfigCtrl.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"TaskSchedulerSchedule/getAllScheduleCronType", {}, 'POST').success(function (response) {
            botConfigCtrl.ScheduleCronType = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"TaskSchedulerSchedule/getAllDayOfWeek", {}, 'POST').success(function (response) {
            botConfigCtrl.weekdays = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"apitelegrambotconfig/getall", botConfigCtrl.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            botConfigCtrl.busyIndicator.isActive = false;
            botConfigCtrl.ListItems = response.ListItems;

            // Call Excerpt Function to shorten the length of long strings
            excerptField(botConfigCtrl.ListItems, "BotToken");
            botConfigCtrl.gridOptions.fillData(botConfigCtrl.ListItems, response.resultAccess);
            botConfigCtrl.gridOptions.currentPageNumber = response.CurrentPageNumber;
            botConfigCtrl.gridOptions.totalRowCount = response.TotalRowCount;
            botConfigCtrl.gridOptions.rowPerPage = response.RowPerPage;
            botConfigCtrl.allowedSearch = response.AllowedSearchField;

        }).error(function (data, errCode, c, d) {
            botConfigCtrl.busyIndicator.isActive = false;
            botConfigCtrl.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        var filterParentMenus = { Filters: [{ PropertyName: "LinkParentId", SearchType: 0, IntValueForceNullSearch: true }] };
        botConfigCtrl.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+"universalmenumenuitem/getall", filterParentMenus, 'POST').success(function (response) {
            botConfigCtrl.addRequested = false;
            rashaErManage.checkAction(response);
            botConfigCtrl.UninversalMenus = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });


        ajax.call(cmsServerConfig.configApiServerPath+"membergroup/getall", '', 'POST').success(function (response) {
            if (response.ListItems.length < 1)
                botConfigCtrl.memberGroupListItems = [{ Id: 0, Title: "گروهی وجود ندارد" }];
            else
                botConfigCtrl.memberGroupListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    botConfigCtrl.busyIndicator.isActive = true;
    botConfigCtrl.addRequested = false;
    botConfigCtrl.openAddModal = function () {
        if (buttonIsPressed) return;
        botConfigCtrl.modalTitle = 'اضافه';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramBotConfig/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            botConfigCtrl.busyIndicator.isActive = false;
            botConfigCtrl.selectedItem = response.Item;
            botConfigCtrl.selectedItem.chatIdStr = '';
            $modal.open({
                templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegramBotConfig/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            botConfigCtrl.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    botConfigCtrl.addNewRow = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        botConfigCtrl.busyIndicator.isActive = true;
        botConfigCtrl.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramBotConfig/add', botConfigCtrl.selectedItem, 'POST').success(function (response) {
            botConfigCtrl.addRequested = false;
            botConfigCtrl.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                botConfigCtrl.ListItems.unshift(response.Item);
                botConfigCtrl.gridOptions.fillData(botConfigCtrl.ListItems);
                botConfigCtrl.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            botConfigCtrl.busyIndicator.isActive = false;
            botConfigCtrl.addRequested = false;
        });
    }

    botConfigCtrl.openEditModal = function () {
        if (botConfigCtrl.addRequested) return;
        botConfigCtrl.modalTitle = 'ویرایش';
        if (!botConfigCtrl.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        botConfigCtrl.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramBotConfig/GetOne', botConfigCtrl.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            botConfigCtrl.addRequested = false;
            rashaErManage.checkAction(response);
            botConfigCtrl.selectedItem = response.Item;
            if (botConfigCtrl.LinkUniversalMenuIdOnUndetectableKey > 0)
                botConfigCtrl.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegramBotConfig/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    botConfigCtrl.editRow = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (!botConfigCtrl.selectUniversalMenuOnUndetectableKey)
            botConfigCtrl.selectedItem.LinkUniversalMenuIdOnUndetectableKey = null;
        botConfigCtrl.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramBotConfig/edit', botConfigCtrl.selectedItem, 'PUT').success(function (response) {
            botConfigCtrl.addRequested = true;
            rashaErManage.checkAction(response);
            botConfigCtrl.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                botConfigCtrl.addRequested = false;
                botConfigCtrl.replaceItem(botConfigCtrl.selectedItem.Id, response.Item);
                botConfigCtrl.gridOptions.fillData(botConfigCtrl.ListItems);
                botConfigCtrl.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            botConfigCtrl.addRequested = false;
            botConfigCtrl.busyIndicator.isActive = false;

        });
    }

    botConfigCtrl.closeModal = function () {
        $modalStack.dismissAll();
    };

    botConfigCtrl.replaceItem = function (oldId, newItem) {
        angular.forEach(botConfigCtrl.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = botConfigCtrl.ListItems.indexOf(item);
                botConfigCtrl.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            botConfigCtrl.ListItems.unshift(newItem);
    }

    botConfigCtrl.deleteRow = function () {
        if (!botConfigCtrl.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                botConfigCtrl.busyIndicator.isActive = true;
                console.log(botConfigCtrl.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramBotConfig/GetOne', botConfigCtrl.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    botConfigCtrl.selectedItemForDelete = response.Item;
                    console.log(botConfigCtrl.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramBotConfig/delete', botConfigCtrl.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        botConfigCtrl.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            botConfigCtrl.replaceItem(botConfigCtrl.selectedItemForDelete.Id);
                            botConfigCtrl.gridOptions.fillData(botConfigCtrl.ListItems);
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage("حذف امکان پذیر نیست. برای حذف این آیتم با پشتیبانی سامانه تماس بگیرید!");
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        botConfigCtrl.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    botConfigCtrl.busyIndicator.isActive = false;

                });
            }
        });
    }

    botConfigCtrl.searchData = function () {
        botConfigCtrl.gridOptions.searchData();

    }

    botConfigCtrl.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'نام بات', sortable: true, type: 'string', visible: true },
            { name: 'Username', displayName: 'نام کاربری', sortable: true, type: 'string', visible: true },
            { name: 'StatisticsMemberCount', displayName: 'عضو', sortable: true, type: 'integer', visible: true },
            { name: 'StatusWebhook', displayName: 'وضعیت هوک', sortable: true, isCheckBox: true, type: 'boolean', visible: true },
            //{ name: 'LinkUniversalMenuIdOnUndetectableKey', displayName: 'منوی پیش فرض در ارسال نامفهوم', sortable: true, type: 'string', visible: true },
            { name: 'ActionButton1', displayName: 'عملیات', sortable: true, type: 'string', visible: true, displayForce: true, template: '<button type="button" name="getInfo_btn" ng-click="botConfigCtrl.openGetInfoModal($index, x.Id)" class="btn btn-primary">بررسی&nbsp;<i class="fa fa-cog" aria-hidden="true"></i></button>' },
            { name: 'ActionButton2', displayName: 'عملیات', sortable: true, type: 'string', visible: true, displayForce: true, template: '<button type="button" name="getInfo_btn" ng-click="botConfigCtrl.openSendToAllModal($index, x.Id)" class="btn btn-success">{{"BULK_SEND"|lowercase|translate}}&nbsp;<i class="fa fa-envelope-o" aria-hidden="true"></i></button>' }
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

    botConfigCtrl.gridOptions.reGetAll = function () {
        botConfigCtrl.init();
    }

    botConfigCtrl.gridOptions.onRowSelected = function () {

    }

    botConfigCtrl.columnCheckbox = false;

    botConfigCtrl.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (botConfigCtrl.gridOptions.columnCheckbox) {
            for (var i = 0; i < botConfigCtrl.gridOptions.columns.length; i++) {
                //botConfigCtrl.gridOptions.columns[i].visible = $("#" + botConfigCtrl.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + botConfigCtrl.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                botConfigCtrl.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = botConfigCtrl.gridOptions.columns;
            for (var i = 0; i < botConfigCtrl.gridOptions.columns.length; i++) {
                botConfigCtrl.gridOptions.columns[i].visible = true;
                var element = $("#" + botConfigCtrl.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + botConfigCtrl.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < botConfigCtrl.gridOptions.columns.length; i++) {
            console.log(botConfigCtrl.gridOptions.columns[i].name.concat(".visible: "), botConfigCtrl.gridOptions.columns[i].visible);
        }
        botConfigCtrl.gridOptions.columnCheckbox = !botConfigCtrl.gridOptions.columnCheckbox;
    }

    botConfigCtrl.openGetInfoModal = function (selectedIndex, selectedId) {
        botConfigCtrl.modalTitle = 'بررسی';
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramBotConfig/getmeasync', selectedId, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            botConfigCtrl.busyIndicator.isActive = false;
            botConfigCtrl.selectedItem = response1.Item;
            botConfigCtrl.ErrorMessage = response1.ErrorMessage;
            botConfigCtrl.IsSuccess = response1.IsSuccess;
            if (response1.IsSuccess) {
                ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramBotConfig/GetOne', selectedId, 'GET').success(function (response2) {
                    rashaErManage.checkAction(response2);
                    botConfigCtrl.selectedBotConfig = response2.Item;
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegramBotConfig/getInfo.html',
                        scope: $scope
                    });
                    if (botConfigCtrl.selectedItem.first_name != botConfigCtrl.gridOptions.data[selectedIndex].Title || botConfigCtrl.gridOptions.data[selectedIndex].Username != botConfigCtrl.selectedItem.username) {
                        botConfigCtrl.selectedBotConfig.Title = botConfigCtrl.selectedItem.first_name;
                        botConfigCtrl.selectedBotConfig.Username = botConfigCtrl.selectedItem.username;
                        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramBotConfig/edit', botConfigCtrl.selectedBotConfig, 'PUT').success(function (response2) { //ذخیره مشخصات ربات 
                            if (response2.IsSuccess) {
                                botConfigCtrl.gridOptions.data[selectedIndex].Title = botConfigCtrl.selectedItem.first_name;
                                botConfigCtrl.gridOptions.data[selectedIndex].Username = botConfigCtrl.selectedItem.username;
                                rashaErManage.checkAction(response2);

                            }
                        }).error(function (data, errCode, c, d) {
                            rashaErManage.checkAction(data, errCode);
                        });
                    }
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            botConfigCtrl.busyIndicator.isActive = false;
        });
    }

    //Test (delete this code later)
    botConfigCtrl.qrCode = function () {
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramBotConfig/GetOne', 1, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            botConfigCtrl.selectedItem = response.Item;
            ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramBotConfig/SetQRCodeImage', botConfigCtrl.selectedItem, 'POST').success(function (response) {
                rashaErManage.showMessage(response.ErrorMessage);
                console.log(response);
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                botConfigCtrl.busyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    botConfigCtrl.setWebhook = function (data) {
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramBotConfig/SetWebhookAsync', botConfigCtrl.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.showMessage(response.ErrorMessage);
            botConfigCtrl.replaceItem(botConfigCtrl.gridOptions.selectedRow.item.Id, botConfigCtrl.gridOptions.selectedRow.item);
            botConfigCtrl.gridOptions.fillData(botConfigCtrl.ListItems);
            botConfigCtrl.closeModal();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            botConfigCtrl.busyIndicator.isActive = false;
        });
    }
    botConfigCtrl.setWebhookEmpty = function (data) {
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramBotConfig/SetWebhookAsyncEmpty', botConfigCtrl.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.showMessage(response.ErrorMessage);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            botConfigCtrl.busyIndicator.isActive = false;
        });
    }
    botConfigCtrl.GetUpdatesAsyncLast = function (data) {
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramBotConfig/GetUpdatesAsyncLast', botConfigCtrl.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.showMessage(response.ErrorMessage);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            botConfigCtrl.busyIndicator.isActive = false;
        });
    }
    botConfigCtrl.GetUpdatesAsync = function (data) {
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramBotConfig/GetUpdatesAsync', botConfigCtrl.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.showMessage(response.ErrorMessage);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            botConfigCtrl.busyIndicator.isActive = false;
        });
    }

    function excerptField(ListItems, longFiledName) {
        var n = ListItems.length;
        for (var i = 0; i < n; i++) {
            if (ListItems[i][longFiledName] && ListItems[i][longFiledName].length > 15)
                ListItems[i][longFiledName] = ListItems[i][longFiledName].substring(0, 12).concat("...");
        }
    }

    botConfigCtrl.openSendToAllModal = function (selectedIndex, selectedId) {
        botConfigCtrl.show_text = false;
        botConfigCtrl.show_title = false;
        botConfigCtrl.show_chatid = false;
        botConfigCtrl.show_membergroupid = false;
        botConfigCtrl.show_linkfileid = false;
        botConfigCtrl.show_latitude = false;
        botConfigCtrl.show_longitude = false;
        botConfigCtrl.show_menuId = false;
        var data = angularJsTreefileMangerList()
        botConfigCtrl.dataForTheTree = data.list;
        botConfigCtrl.selectedItem = { MessageType: 0, text: '', chatId: [], MemberGroupId: [], SentToAllMembers: false, BotId: selectedId, LinkFileId: 0, latitude: 0.0, longitude: 0.0, firstName: '', lastName: '', phoneNumber: '', universalMenuId: 0 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegramBotConfig/sendToAllModal.html',
            scope: $scope
        });
    }

    botConfigCtrl.sendMode = "all"; //Default
    botConfigCtrl.onReceiverChange = function (value) {
        botConfigCtrl.show_membergroup = false;
        botConfigCtrl.show_chatid = false;
        if (value == "group") {
            botConfigCtrl.sendMode = "group";
            botConfigCtrl.show_membergroup = true;
        }
        else if (value == "chatid") {
            botConfigCtrl.sendMode = "chatid";
            botConfigCtrl.show_chatid = true;
        }
        else {
            botConfigCtrl.sendMode = "all";
            botConfigCtrl.show_membergroup = false;
            botConfigCtrl.show_chatid = false;
        }
    }

    botConfigCtrl.sendButtonText = "ارسال";

    botConfigCtrl.sendMessageToAll = function (selectedIndex, selectedId) {
        if (botConfigCtrl.selectedItem.MessageType == '') {
            rashaErManage.showMessage("نوع ارسال را مشخص کنید");
            return;
        }
        botConfigCtrl.addRequested = true;
        botConfigCtrl.busyIndicator.isActive = true;
        botConfigCtrl.sendButtonText = "در حال ارسال...";
        botConfigCtrl.selectedItem.SentToAllMembers = false;
        botConfigCtrl.selectedItem.MemberGroupId = [];
        botConfigCtrl.selectedItem.chatId = [];
        botConfigCtrl.selectedItem.LinkFileId = 0;
        if (botConfigCtrl.sendMode == "all") {
            botConfigCtrl.selectedItem.SentToAllMembers = true;
        }
        else if (botConfigCtrl.sendMode == "group") {
            botConfigCtrl.selectedItem.MemberGroupId = [parseInt(botConfigCtrl.selectedItem.memberGroupid)];
        }
        else {
            //botConfigCtrl.selectedItem.chatId = [parseInt(botConfigCtrl.selectedItem.chatid)];
            botConfigCtrl.selectedItem.chatId = botConfigCtrl.selectedItem.chatIdStr.split(',')
        }
        if (botConfigCtrl.selectedItem.MessageType == 2 || botConfigCtrl.selectedItem.MessageType == 3 || botConfigCtrl.selectedItem.MessageType == 4 || botConfigCtrl.selectedItem.MessageType == 6 || botConfigCtrl.selectedItem.MessageType == 7)
            botConfigCtrl.selectedItem.LinkFileId = botConfigCtrl.selectedNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramBotConfig/SendMessage', botConfigCtrl.selectedItem, 'POST').success(function (response) {
            botConfigCtrl.busyIndicator.isActive = false;
            botConfigCtrl.addRequested = false;
            botConfigCtrl.sendButtonText = "ارسال";
            rashaErManage.showMessage("گزارش سرور :" + response.Item.info + "   " + response.ErrorMessage);
            //botConfigCtrl.closeModal();
        }).error(function (data, errCode, c, d) {
            botConfigCtrl.addRequested = false;
            botConfigCtrl.sendButtonText = "ارسال";
            rashaErManage.showMessage("گزارش خطا سرور ");
            botConfigCtrl.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TextMessage = 1,
    //PhotoMessage = 2,
    //AudioMessage = 3,
    //VideoMessage = 4,
    //VoiceMessage = 5,
    //DocumentMessage = 6,
    //StickerMessage = 7,
    //LocationMessage = 8,
    //ContactMessage = 9,
    //ServiceMessage = 10,
    //VenueMessage = 11,
    //GameMessage = 12,
    //VideoNoteMessage = 13,
    //Invoice = 14,
    //SuccessfulPayment = 15
    botConfigCtrl.messageTypeListItems = [
        { Key: "متن", Value: 1 },
        { Key: "عکس", Value: 2 },
        { Key: "صدا", Value: 3 },
        { Key: "ویدیو", Value: 4 },
        { Key: "فایل", Value: 6 },
        { Key: "استیکر", Value: 7 },
        { Key: "مکان", Value: 8 },
        { Key: "مخاطب", Value: 9 },
        { Key: "", Value: '' }];
    //{ Key: "منوی درخت تصمیم", Value: 0 }];


    botConfigCtrl.onMessageTypeChange = function (value) {
        if (value == '') {
            botConfigCtrl.addRequested = true;
        }
        else {
            botConfigCtrl.addRequested = false;
        }

        botConfigCtrl.selectedItem.MessageType = value;
        botConfigCtrl.show_text = false;
        botConfigCtrl.show_title = false;
        botConfigCtrl.show_linkfileid = false;
        botConfigCtrl.show_latitude = false;
        botConfigCtrl.show_longitude = false;
        botConfigCtrl.show_firstName = false;
        botConfigCtrl.show_lastName = false;
        botConfigCtrl.show_phoneNumber = false;
        botConfigCtrl.show_menuId = false;
        if (value == 1 ) botConfigCtrl.show_text = true;
        if (value == 3 ) botConfigCtrl.show_title = true;
        else if (value == 2 || value == 4 || value == 6 || value == 7) { botConfigCtrl.show_linkfileid = true; botConfigCtrl.show_text = true; }
        else if (value == 8) { botConfigCtrl.show_latitude = true; botConfigCtrl.show_longitude = true; }
        else if (value == 9) { botConfigCtrl.show_firstName = true; botConfigCtrl.show_lastName = true; botConfigCtrl.show_phoneNumber = true; }
        else if (value == 0) { botConfigCtrl.show_menuId = true; }
    }



    botConfigCtrl.treeOptions = {
        nodeChildren: "Children",
        dirSelectable: false,
        multiSelection: false
    }

    function searchTree(element, matchingId) {
        if (element.Id == matchingId) {
            return element;
        } else if (element.Children != null) {
            var i;
            var result = null;
            for (i = 0; result == null && i < element.Children.length; i++) {
                result = searchTree(element.Children[i], matchingId);
            }
            return result;
        }
        return { Id: -1 };
    }

    angularJsTreefileMangerList = function () {
        var ret = {};
        ret.list = [];
        ret.fileList = [];
        var FilterModel = {};
        FilterModel.RowPerPage = 1000;
        FilterModel.Filters = null;
        FilterModel.Filters = [];
        // Get all the Categories (Folders)
        $.ajax({
            type: "Post",
            async: false,
            data: JSON.stringify(FilterModel),
            url: cmsServerConfig.configApiServerPath+"FileCategory/getall",
            contentType: "application/json",
            headers: { "Authorization": $rootScope.tokenInfo.token },
            success: function (response1) {
                // response1.ListItems is list of all categories
                // Get all the Files
                $.ajax({
                    type: "Post",
                    async: false,
                    data: JSON.stringify(FilterModel),
                    url: cmsServerConfig.configApiServerPath+"FileContent/getall",
                    contentType: "application/json",
                    headers: { "Authorization": $rootScope.tokenInfo.token },
                    success: function (request2) {
                        ret.fileList = request2.ListItems;
                        ret.list = fileTreeMakeCategory(response1.ListItems, request2.ListItems);
                        $.each(ret.fileList, function (index, item) { if (item.LinkCategoryId == null) ret.list.push(item) }); //اضافه کردن فایل های داخل روت
                    },
                    error: function (msg) {
                        console.log(msg);
                    }
                });

            },
            error: function (msg) {
                console.log(msg);
            }
        });

        function fileTreeMakeCategory(valList, fileListItems, categoryParent) {
            var ret = [];
            $.each(valList, function (index1, category) {
                if (categoryParent == category.LinkParentId) {
                    category.Children = fileTreeMakeCategory(valList, fileListItems, category.Id);
                    var children = fileTreeMakeFile(fileListItems, category.Id);
                    //if (children.length == 1 && children[0].FileName == "No-file!")
                    //    category.Children = {};
                    //else
                    category.Children = category.Children.concat(children);
                    ret.push(category);
                }
            });
            return ret;
        }

        function fileTreeMakeFile(valList, categoryId) {
            var ret = [];
            var findChild = false;
            $.each(valList, function (index2, file) {
                if (categoryId == file.LinkCategoryId) {
                    ret.push(file);
                    file.Children = [];
                    findChild = true;
                }
            });
            if (!findChild) {
                ret.push({ Id: -1, FileName: 'No file in this folder' });
            }
            return ret;
        }
        return ret;   // Return all the Categories with their Children inside
    };


    //# help تابعی برای نمایش و عدم نمایش فیلدهای زمانبندی نسبت به نوع زمانبندی
    botConfigCtrl.onScheduleTypeChange = function (scheduleType) {
        switch (scheduleType) {
            case 1:
                botConfigCtrl.showWeekly = false;
                botConfigCtrl.showmonthly = false;
                botConfigCtrl.showonce = true;
                botConfigCtrl.showmonthlyYear = false;
                botConfigCtrl.showHourly=false;
                botConfigCtrl.showDaily=false;
                break;
            case 2:
                botConfigCtrl.showWeekly = false;
                botConfigCtrl.showmonthly = false;
                botConfigCtrl.showonce = false;
                botConfigCtrl.showmonthlyYear = false;
                botConfigCtrl.showHourly=true;
                botConfigCtrl.showDaily=false;
                break;
            case 3:
                botConfigCtrl.showmonthly = false;
                botConfigCtrl.showonce = false;
                botConfigCtrl.showWeekly = false;
                botConfigCtrl.showmonthlyYear = false;
                botConfigCtrl.showHourly=false;
                botConfigCtrl.showDaily=true;
                break;
            case 4:
                botConfigCtrl.showmonthly = false;
                botConfigCtrl.showonce = false;
                botConfigCtrl.showWeekly = true;
                botConfigCtrl.showmonthlyYear = false;
                botConfigCtrl.showHourly=false;
                botConfigCtrl.showDaily=false;
                break;
            case 5:
                botConfigCtrl.showmonthly = true;
                botConfigCtrl.showonce = false;
                botConfigCtrl.showWeekly = false;
                botConfigCtrl.showmonthlyYear = false;
                botConfigCtrl.showHourly=false;
                botConfigCtrl.showDaily=false;
                break;
            case 6:
                botConfigCtrl.showonce = false;
                botConfigCtrl.showWeekly = false;
                botConfigCtrl.showmonthly = false;
                botConfigCtrl.showmonthlyYear = true;
                botConfigCtrl.showHourly=false;
                botConfigCtrl.showDaily=false;
                break;
        }
    };




    //Export Report 
    botConfigCtrl.exportFile = function () {
        botConfigCtrl.gridOptions.advancedSearchData.engine.ExportFile = botConfigCtrl.ExportFileClass;
        botConfigCtrl.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramBotConfig/exportfile', botConfigCtrl.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            botConfigCtrl.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                botConfigCtrl.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //botConfigCtrl.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    botConfigCtrl.toggleExportForm = function () {
        botConfigCtrl.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        botConfigCtrl.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        botConfigCtrl.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        botConfigCtrl.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        botConfigCtrl.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegramBotConfig/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    botConfigCtrl.rowCountChanged = function () {
        if (!angular.isDefined(botConfigCtrl.ExportFileClass.RowCount) || botConfigCtrl.ExportFileClass.RowCount > 5000)
            botConfigCtrl.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    botConfigCtrl.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ApiTelegramBotConfig/count", botConfigCtrl.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            botConfigCtrl.addRequested = false;
            rashaErManage.checkAction(response);
            botConfigCtrl.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            botConfigCtrl.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

