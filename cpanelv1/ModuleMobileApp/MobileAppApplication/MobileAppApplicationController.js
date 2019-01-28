app.controller("mobileAppApplicationController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$builder', '$state', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $builder, $state, $window, $filter) {
    var appApplication = this;
    appApplication.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    appApplication.filePickerMainImage = {
        isActive: true,
        backElement: "filePickerMainImage",
        filename: null,
        fileId: null,
        multiSelect: false
    };
    appApplication.UninversalMenus = [];
    appApplication.selectUniversalMenuOnUndetectableKey = true;
    if (itemRecordStatus != undefined) appApplication.itemRecordStatus = itemRecordStatus;

    appApplication.init = function () {
        appApplication.busyIndicator.isActive = true;
        ajax.call(mainPathApi+"MobileAppApplication/getall", appApplication.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            appApplication.busyIndicator.isActive = false;
            appApplication.ListItems = response.ListItems;
            ajax.call(mainPathApi+"mobileAppApplication/getBuildStatusEnum", {}, 'POST').success(function (responseGetEnum) {
                appApplication.buildStatusEnum = responseGetEnum;
                appApplication.setBuildStatusEnum(appApplication.ListItems, appApplication.buildStatusEnum);
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
            appApplication.gridOptions.fillData(appApplication.ListItems, response.resultAccess);
            appApplication.gridOptions.currentPageNumber = response.CurrentPageNumber;
            appApplication.gridOptions.totalRowCount = response.TotalRowCount;
            appApplication.gridOptions.rowPerPage = response.RowPerPage;
            appApplication.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            appApplication.busyIndicator.isActive = false;
            appApplication.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //Get all Sources
        ajax.call(mainPathApi+"mobileappsource/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            appApplication.sourceListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });

        //@help برای زمانبندی
        ajax.call(mainPathApi+"TaskSchedulerSchedule/getAllScheduleCronType", {}, 'POST').success(function (response) {
            appApplication.ScheduleCronType = response;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(mainPathApi+"TaskSchedulerSchedule/getAllDayOfWeek", {}, 'POST').success(function (response) {
            appApplication.weekdays = response;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        //@help برای زمانبندی
    }

    appApplication.setBuildStatusEnum = function (listItems, enumList) {
        angular.forEach(listItems, function (item, property) {
            angular.forEach(enumList, function (value, key) {
                if (item.LastBuildStatus == value.Value)
                    item.LastBuildStatusTitle = value.Description;
            });
        });
    }

    // Open Add Modal
    appApplication.busyIndicator.isActive = true;

    appApplication.addRequested = false;

    appApplication.openAddModal = function () {
        if (buttonIsPressed) return;

        appApplication.modalTitle = 'اضافه';
        appApplication.filePickerMainImage.filename = "";
        appApplication.filePickerMainImage.fileId = null;
        buttonIsPressed = true;
        ajax.call(mainPathApi+'MobileAppApplication/getviewmodel', "0", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            appApplication.busyIndicator.isActive = false;
            //Set dataForTheTree
            appApplication.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(mainPathApi+"CmsFileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                appApplication.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(appApplication.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleMobileApp/MobileAppApplication/add.html',
                        scope: $scope
                    });
                    appApplication.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //-----
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appApplication.busyIndicator.isActive = false;
        });
    }

    // Add New Content
    appApplication.addNewRow = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        if (appApplication.selectedItem.LinkSourceId == null) {
            rashaErManage.showMessage("لطفاً منبع اپلیکیشن را انتخاب کنید!");
            return;
        }
        appApplication.addRequested = true;
        appApplication.busyIndicator.isActive = true;
        appApplication.selectedItem[appApplication.selectedConfig] = $.trim(angular.toJson(appApplication.submitValue));
        ajax.call(mainPathApi+'MobileAppApplication/add', appApplication.selectedItem, 'POST').success(function (response) {
            appApplication.addRequested = false;
            appApplication.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                appApplication.ListItems.unshift(response.Item);
                appApplication.gridOptions.fillData(appApplication.ListItems);
                appApplication.setBuildStatusEnum(appApplication.ListItems, appApplication.buildStatusEnum);
                appApplication.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appApplication.busyIndicator.isActive = false;
            appApplication.addRequested = false;
        });
    }

    appApplication.openEditModal = function () {
        if (buttonIsPressed) return;

        appApplication.modalTitle = 'ویرایش';
        if (!appApplication.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(mainPathApi+'MobileAppApplication/getviewmodel', appApplication.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            appApplication.selectedItem = response.Item;
            appApplication.filePickerMainImage.filename = null;
            appApplication.filePickerMainImage.fileId = null;
            if (response.Item.LinkMainImageId != null) {
                ajax
                    .call(
                        mainPathApi+"CmsFileContent/getviewmodel",
                        response.Item.LinkMainImageId,
                        "GET"
                    )
                    .success(function (response2) {
                        buttonIsPressed = false;
                        appApplication.filePickerMainImage.filename =
                            response2.Item.FileName;
                        appApplication.filePickerMainImage.fileId = response2.Item.Id;
                    })
                    .error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
            }
            //Set dataForTheTree
            appApplication.selectedNode = [];
            appApplication.expandedNodes = [];
            appApplication.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(mainPathApi+"CmsFileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                appApplication.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(appApplication.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (appApplication.selectedItem.LinkModulesFilesIdIcon > 0)
                        appApplication.onSelection({ Id: appApplication.selectedItem.LinkModulesFilesIdIcon }, true);
                    if (appApplication.selectedItem.LinkSourceId > 0)
                        appApplication.onSourceChange(appApplication.selectedItem.LinkSourceId);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleMobileApp/MobileAppApplication/edit.html',
                        scope: $scope
                    });
                    appApplication.onSourceChange(appApplication.selectedItem.LinkSourceId);
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //---
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    function selectNode(dataForTheTree, selectedFile) {
        var nodeIds = [];
        $.each(dataForTheTree,
            function (index, file) {
                if (nodeIds.indexOf(file.Id + '') > -1 && file.FileName != undefined && file.FileName.length > 0) {
                    appApplication.selectedNode = file;

                    $.each(retData.list, function (index, category) {
                        if (searchChildren(file, category))
                            appApplication.expandedNodes.push(category);
                    });

                }
            });
    }
    function searchChildren(file, currentNode) {
        var i,
            currentChild,
            result;
        if (file.Id == currentNode.Id) {
            return currentNode;
        } else {
            // Use a for loop instead of forEach to avoid nested functions
            // Otherwise "return" will not work properly
            if (currentNode.Children != undefined)
                for (i = 0; i < currentNode.Children.length; i += 1) {
                    currentChild = currentNode.Children[i];
                    // Search in the current child
                    result = searchChildren(file, currentChild);
                    // Return the result if the node has been found
                    if (result !== false) {
                        if ($.grep(scope.expandedNodes, function (e) { return e.Id === currentChild.Id; }).length <= 0) scope.expandedNodes.push(currentChild);
                        return result;
                    }
                }
            // The node has not been found and we have no more options
            return false;
        }
    }
    // Edit a Content
    appApplication.editRow = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        appApplication.addRequested = true;
        appApplication.busyIndicator.isActive = true;
        appApplication.selectedItem[appApplication.selectedConfig] = $.trim(angular.toJson(appApplication.submitValue));
        ajax.call(mainPathApi+'MobileAppApplication/edit', appApplication.selectedItem, 'PUT').success(function (response) {
            rashaErManage.checkAction(response);
            appApplication.addRequested = false;
            appApplication.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                appApplication.replaceItem(appApplication.selectedItem.Id, response.Item);
                appApplication.gridOptions.fillData(appApplication.ListItems);
                appApplication.setBuildStatusEnum(appApplication.ListItems, appApplication.buildStatusEnum);
                appApplication.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appApplication.addRequested = false;
            appApplication.busyIndicator.isActive = false;
        });
    }

    appApplication.closeModal = function () {
        $modalStack.dismissAll();
    };

    appApplication.replaceItem = function (oldId, newItem) {
        angular.forEach(appApplication.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = appApplication.ListItems.indexOf(item);
                appApplication.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            appApplication.ListItems.unshift(newItem);
    }

    appApplication.deleteRow = function () {
        if (buttonIsPressed) return;

        if (!appApplication.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                appApplication.busyIndicator.isActive = true;
                console.log(appApplication.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(mainPathApi+'MobileAppApplication/getviewmodel', appApplication.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    appApplication.selectedItemForDelete = response.Item;
                    ajax.call(mainPathApi+'MobileAppApplication/delete', appApplication.selectedItemForDelete, 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        appApplication.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            appApplication.replaceItem(appApplication.selectedItemForDelete.Id);
                            appApplication.gridOptions.fillData(appApplication.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        appApplication.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    appApplication.busyIndicator.isActive = false;

                });
            }
        });
    }

    appApplication.searchData = function () {
        appApplication.gridOptions.searchData();

    }

    appApplication.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            { name: 'AppVersion', displayName: 'ورژن', sortable: true, type: 'string', visible: true },
            { name: 'virtual_Source.Title', displayName: 'منبع', sortable: true, type: 'string', visible: true, displayForce: true },
            { name: 'virtual_ThemeConfig.Title', displayName: 'تم', sortable: true, type: 'string', visible: true, displayForce: true },
            { name: 'DownloadCount', displayName: 'تعداد دانلود', sortable: true, type: 'integer', visible: true },
            { name: 'LastBuildOrderDate', displayName: 'تاریخ سفارش ساخت', sortable: true, isDateTime: true, type: 'date', visible: 'true' },
            { name: 'LastBuildStatusTitle', displayName: 'آخرین وضعیت', sortable: true, type: 'string', visible: true, template: "<p id=\"LastBuildStatusID\">{{x.LastBuildStatusTitle}}</p>" },
            { name: 'LastSuccessfullyBuildDate', displayName: 'آخرین ساخت موفق', sortable: true, isDateTime: true, visible: 'true' },
            //{ name: 'LastBuildErrorMessage', displayName: 'نتیجه ساخت', sortable: true },
            { name: "ActionButton", displayName: "مقداردهی", sortable: true, displayForce: true, template: "<button class=\"btn btn-primary\" ng-click=\"appApplication.changeState('mobileapplayoutvalue', x)\" type=\"button\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i></button>" },
            { name: "ActionButton", displayName: "تنظیمات مدیر سامانه", sortable: true, displayForce: true, visible: 'appApplication.gridOptions.resultAccess.AccessEditField.indexOf("AdminConfigJsonValues")>-1', template: "<button class=\"btn btn-success\" ng-click=\"appApplication.openAdminBuildSettings(x.Id)\" type=\"button\"><i class=\"fa fa-cog\" aria-hidden=\"true\"></i></button>" },
            //{ name: "ActionButton", displayName: "تنظیمات ساخت", sortable: true, displayForce: true, width: "85px", template: "<button class=\"btn btn-info\" ng-click=\"appApplication.openUserBuildSettings(x.Id,x.LinkSourceId)\" type=\"button\"><i class=\"fa fa-cog\" aria-hidden=\"true\"></i></button>" },
            { name: "ActionBuildApkButton", displayName: "ساخت Apk", sortable: false, displayForce: true, template: "<button class=\"btn btn-warning\" ng-click=\"appApplication.buildApp(x , x.LastBuildStatus)\" title=\"ارسال دستور ساخت اپلیکیشن  برنامه های این نوع اپ\" type=\"button\"><i class=\"fa fa-plus-square\" aria-hidden=\"true\"></i></button>" },
            { name: "ActionDownloadApkButton", displayName: "دانلود Apk", sortable: false, displayForce: true, template: "<button class=\"btn btn-success\" ng-show=\"{{x.AppKey != null && x.AppKey != ''}}\" ng-click=\"appApplication.downloadApk(x)\" title=\"دانلود فایل مربوط به این اپ\" type=\"button\"><i class=\"fa fa-download\" aria-hidden=\"true\"></i></button>" },
            { name: 'ActionButton2', displayName: 'عملیات', sortable: true, type: 'string', visible: true, displayForce: true, template: '<button type="button" name="getInfo_btn" ng-click="appApplication.openSendToAllModal($index, x)" class="btn btn-success">{{"BULK_SEND"|lowercase|translate}}&nbsp;<i class="fa fa-envelope-o" aria-hidden="true"></i></button>' }
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

    appApplication.gridOptions.reGetAll = function () {
        appApplication.init();
    }

    appApplication.gridOptions.onRowSelected = function () {

    }

    appApplication.columnCheckbox = false;

    appApplication.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (appApplication.gridOptions.columnCheckbox) {
            for (var i = 0; i < appApplication.gridOptions.columns.length; i++) {
                //appApplication.gridOptions.columns[i].visible = $("#" + appApplication.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + appApplication.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                appApplication.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = appApplication.gridOptions.columns;
            for (var i = 0; i < appApplication.gridOptions.columns.length; i++) {
                appApplication.gridOptions.columns[i].visible = true;
                var element = $("#" + appApplication.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + appApplication.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < appApplication.gridOptions.columns.length; i++) {
            console.log(appApplication.gridOptions.columns[i].name.concat(".visible: "), appApplication.gridOptions.columns[i].visible);
        }
        appApplication.gridOptions.columnCheckbox = !appApplication.gridOptions.columnCheckbox;
    }

    appApplication.changeState = function (state, app) {
        $state.go("index." + state, { sourceid: app.LinkSourceId, appid: app.Id, apptitle: app.Title });
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
    //upload file
    appApplication.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (appApplication.fileIsExist(uploadFile.name)) {
                // File already exists
                if (
                    confirm(
                        'File "' +
                        uploadFile.name +
                        '" already exists! Do you want to replace the new file?'
                    )
                ) {
                    //------------ appApplication.replaceFile(uploadFile.name);
                    appApplication.itemClicked(null, appApplication.fileIdToDelete, "file");
                    appApplication.fileTypes = 1;
                    appApplication.fileIdToDelete = appApplication.selectedIndex;
                    // replace the file
                    ajax
                        .call(
                            mainPathApi+"CmsFileContent/getviewmodel",
                            appApplication.fileIdToDelete,
                            "GET"
                        )
                        .success(function (response1) {
                            if (response1.IsSuccess == true) {
                                console.log(response1.Item);
                                ajax.call(mainPathApi+"CmsFileContent/replace", response1.Item, "POST")
                                    .success(function (response2) {
                                        if (response2.IsSuccess == true) {
                                            appApplication.FileItem = response2.Item;
                                            appApplication.showSuccessIcon();
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-check");
                                            appApplication.filePickerMainImage.filename =
                                                appApplication.FileItem.FileName;
                                            appApplication.filePickerMainImage.fileId =
                                                response2.Item.Id;
                                            appApplication.selectedItem.LinkMainImageId =
                                                appApplication.filePickerMainImage.fileId;
                                        } else {
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-remove");
                                        }
                                    })
                                    .error(function (data) {
                                        appApplication.showErrorIcon();
                                        $("#save-icon" + index).removeClass("fa-save");
                                        $("#save-button" + index).removeClass("flashing-button");
                                        $("#save-icon" + index).addClass("fa-remove");
                                    });
                                //-----------------------------------
                            }
                        })
                        .error(function (data) {
                            console.log(data);
                        });
                    //--------------------------------
                } else {
                    return;
                }
            } else {
                // File does not exists
                // Save New file
                ajax
                    .call(mainPathApi + "CmsFileContent/getviewmodel", "0", "GET")
                    .success(function (response) {
                        appApplication.FileItem = response.Item;
                        appApplication.FileItem.FileName = uploadFile.name;
                        appApplication.FileItem.uploadName = uploadFile.uploadName;
                        appApplication.FileItem.Extension = uploadFile.name.split(".").pop();
                        appApplication.FileItem.FileSrc = uploadFile.name;
                        appApplication.FileItem.LinkCategoryId = null; //Save the new file in the root
                        // ------- appApplication.saveNewFile()  ----------------------
                        var result = 0;
                        ajax
                            .call(mainPathApi + "CmsFileContent/add", appApplication.FileItem, "POST")
                            .success(function (response) {
                                if (response.IsSuccess) {
                                    appApplication.FileItem = response.Item;
                                    appApplication.showSuccessIcon();
                                    $("#save-icon" + index).removeClass("fa-save");
                                    $("#save-button" + index).removeClass("flashing-button");
                                    $("#save-icon" + index).addClass("fa-check");
                                    appApplication.filePickerMainImage.filename =
                                        appApplication.FileItem.FileName;
                                    appApplication.filePickerMainImage.fileId = response.Item.Id;
                                    appApplication.selectedItem.LinkMainImageId =
                                        appApplication.filePickerMainImage.fileId;
                                } else {
                                    $("#save-icon" + index).removeClass("fa-save");
                                    $("#save-button" + index).removeClass("flashing-button");
                                    $("#save-icon" + index).addClass("fa-remove");
                                }
                            })
                            .error(function (data) {
                                appApplication.showErrorIcon();
                                $("#save-icon" + index).removeClass("fa-save");
                                $("#save-button" + index).removeClass("flashing-button");
                                $("#save-icon" + index).addClass("fa-remove");
                            });
                        //-----------------------------------
                    })
                    .error(function (data) {
                        console.log(data);
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass("flashing-button");
                        $("#save-icon" + index).addClass("fa-remove");
                    });
            }
        }
    };
    //End of Upload Modal-----------------------------------------
    //Export Report 
    appApplication.exportFile = function () {
        appApplication.addRequested = true;
        appApplication.gridOptions.advancedSearchData.engine.ExportFile = appApplication.ExportFileClass;
        ajax.call(mainPathApi+'MobileAppApplication/exportfile', appApplication.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            appApplication.addRequested = false;
            rashaErManage.checkAction(response);
            appApplication.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //appApplication.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    appApplication.toggleExportForm = function () {
        appApplication.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        appApplication.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        appApplication.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        appApplication.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleMobileApp/MobileAppApplication/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    appApplication.rowCountChanged = function () {
        if (!angular.isDefined(appApplication.ExportFileClass.RowCount) || appApplication.ExportFileClass.RowCount > 5000)
            appApplication.ExportFileClass.RowCount = 5000;
    }

    //Get TotalRowCount
    appApplication.getCount = function () {
        ajax.call(mainPathApi+"MobileAppApplication/count", appApplication.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            appApplication.addRequested = false;
            rashaErManage.checkAction(response);
            appApplication.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            appApplication.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }


    appApplication.buildApp = function (App, LastBuildStatus) {
        rashaErManage.showMessage("دستور برای سرور ارسال شد");
        ajax.call(mainPathApi+'MobileAppApplication/buildApp', App.Id, 'GET').success(function (response) {
            /* var myVar = setInterval(myTimer,10000);
             function myTimer() {
                 ajax.call(mainPathApi+'MobileAppApplication/getviewmodel', App.Id, 'GET').success(function (response) {
                     $("#LastBuildStatusID").empty();
                   
                     $(document).ready(function()
                         {
                         if (App.LastBuildStatusTitle==null){
                             App.LastBuildStatusTitle=""
                         }
                         document.getElementById("LastBuildStatusID").innerHTML = App.LastBuildStatusTitle;
                     }
                     );
                 if (LastBuildStatus==6 || LastBuildStatus==7 || LastBuildStatus==8 ) {
                     clearInterval(myVar);
                 }
 
             rashaErManage.showMessage(response.ErrorMessage);
         }).error(function (data, errCode, c, d) {
             rashaErManage.checkAction(data, errCode);
         });
         }*/
            rashaErManage.showMessage(response.ErrorMessage);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    appApplication.downloadApk = function (source) {
        //rashaErManage.showMessage("دستور برای سرور ارسال شد");


        appApplication.FilePathOnBrowserWithDomain = source.DownloadLinksrcByDomain;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleMobileApp/MobileAppApplication/downloadApk.html',
            scope: $scope
        });
        //appApplication.addRequested = true;
        //appApplication.busyIndicator.isActive = true;
        //ajax.call(mainPathApi+'MobileAppApplication/DownloadApp', source.Id, 'GET').success(function (response) {
        //    appApplication.addRequested = false;
        //    appApplication.busyIndicator.isActive = false;
        //    console.log(response);
        //    appApplication.FilePathOnBrowserWithDomain = response.FilePathOnBrowserWithDomain;
        //    $modal.open({
        //        templateUrl: 'cpanelv1/ModuleMobileApp/MobileAppApplication/downloadApk.html',
        //        scope: $scope
        //    });
        //}).error(function (data, errCode, c, d) {
        //    rashaErManage.checkAction(data, errCode);
        //});
    }

    //TreeControl
    appApplication.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (appApplication.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    appApplication.onNodeToggle = function (node, expanded) {
        if (expanded) {
            node.Children = [];
            var filterModel = { Filters: [] };
            var originalName = node.Title;
            node.messageText = " در حال بارگذاری...";
            filterModel.Filters.push({ PropertyName: "LinkParentId", SearchType: 0, IntValue1: node.Id });
            ajax.call(mainPathApi+"CmsFileCategory/GetAll", filterModel, 'POST').success(function (response1) {
                angular.forEach(response1.ListItems, function (value, key) {
                    node.Children.push(value);
                });
                ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", node.Id, 'POST').success(function (response2) {
                    angular.forEach(response2.ListItems, function (value, key) {
                        node.Children.push(value);
                    });
                    node.messageText = "";
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
        }
    }

    appApplication.onSelection = function (node, selected) {
        if (!selected) {
            appApplication.selectedItem.LinkModulesFilesIdIcon = null;
            appApplication.selectedItem.previewImageSrc = null;
            return;
        }
        appApplication.selectedItem.LinkModulesFilesIdIcon = node.Id;
        appApplication.selectedItem.previewImageSrc = "CmsFiles/img/loader.gif";
        ajax.call(mainPathApi+"CmsFileContent/getviewmodel", node.Id, "GET").success(function (response) {
            appApplication.selectedItem.previewImageSrc = "/files/" + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl

    appApplication.openAdminBuildSettings = function (appId) {
        appApplication.selectedConfig = "AdminConfigJsonValues";
        appApplication.defaultValue = [];
        appApplication.addRequested = true;
        ajax.call(mainPathApi+"mobileappApplication/getone", { Filters: [{ PropertyName: "Id", IntValue1: appId }] }, "POST").success(function (response) {
            appApplication.addRequested = false;
            if (response.IsSuccess) {
                appApplication.selectedItem = response.Item;
                $builder.removeAllFormObject('default');
                //var customizeValue = JSON.parse(response.Item.JsonFormFormat);
                var customizeValue = response.Item.AdminConfigFormFormatter;
                if (customizeValue != null && customizeValue.length > 0) {
                    $.each(customizeValue, function (i, item) {
                        if (item.FieldName != undefined && item.FieldName != null && item.FieldName != "") {
                            var fieldType = "";
                            if (item.FieldType == "System.Boolean") {
                                fieldType = "radio";
                                $builder.addFormObject('default', {
                                    "component": fieldType,
                                    "label": item.FieldTitle,
                                    "description": item.FieldDescription,
                                    "fieldname": item.FieldName,
                                    "options": [
                                        "True",
                                        "False"
                                    ]
                                });
                            }
                            else {
                                fieldType = "text";
                                $builder.addFormObject('default', {
                                    "component": fieldType,
                                    "label": item.FieldTitle,
                                    "description": item.FieldDescription,
                                    "fieldname": item.FieldName,
                                });
                            }
                            //تخصیص مقادیر با تشخصیص نام متغییر
                            if (response.Item[appApplication.selectedConfig] != null && response.Item[appApplication.selectedConfig] != "") {
                                values = $.parseJSON(response.Item[appApplication.selectedConfig]);
                                $.each(values, function (iValue, itemValue) {
                                    if (item.FieldName == itemValue.fieldname) {
                                        $builder.forms.default[i].id = i;
                                        appApplication.defaultValue[i] = itemValue.value;
                                    }
                                });
                            }
                        }
                    });
                }
            }
            appApplication.busyIndicator.isActive = false;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMobileApp/MobileAppApplication/preview.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }

    appApplication.openUserBuildSettings = function (sourceId) {
        appApplication.selectedConfig = "UserConfigJsonValues";
        appApplication.defaultValue = [];
        appApplication.addRequested = true;
        ajax.call(mainPathApi+"mobileappsource/getone", { Filters: [{ PropertyName: "Id", IntValue1: sourceId }] }, "POST").success(function (response) {
            appApplication.addRequested = false;
            if (response.IsSuccess) {
                //appApplication.selectedItem = response.Item;
                $builder.removeAllFormObject('default');
                //var customizeValue = JSON.parse(response.Item.JsonFormFormat);
                var customizeValue = response.Item.UserConfigFormFormatter;
                if (customizeValue != null && customizeValue.length > 0) {
                    $.each(customizeValue, function (i, item) {
                        if (item.FieldName != undefined && item.FieldName != null && item.FieldName != "") {
                            var fieldType = "";
                            if (item.FieldType == "System.Boolean") {
                                fieldType = "radio";
                                $builder.addFormObject('default', {
                                    "component": fieldType,
                                    "label": item.FieldTitle,
                                    "description": item.FieldDescription,
                                    "fieldname": item.FieldName,
                                    "options": [
                                        "True",
                                        "False"
                                    ]
                                });
                            }
                            else {
                                fieldType = "text";
                                $builder.addFormObject('default', {
                                    "component": fieldType,
                                    "label": item.FieldTitle,
                                    "description": item.FieldDescription,
                                    "fieldname": item.FieldName,
                                });
                            }
                            //تخصیص مقادیر با تشخصیص نام متغییر
                            if (appApplication.selectedItem[appApplication.selectedConfig] != null && appApplication.selectedItem[appApplication.selectedConfig] != "") {
                                values = $.parseJSON(appApplication.selectedItem[appApplication.selectedConfig]);
                                $.each(values, function (iValue, itemValue) {
                                    if (item.FieldName == itemValue.fieldname) {
                                        $builder.forms.default[i].id = i;
                                        appApplication.defaultValue[i] = itemValue.value;
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }

    appApplication.saveSubmitValues = function () {
        appApplication.addRequested = true;
        appApplication.busyIndicator.isActive = true;
        appApplication.selectedItem[appApplication.selectedConfig] = $.trim(angular.toJson(appApplication.submitValue));
        ajax.call(mainPathApi+'MobileAppApplication/edit', appApplication.selectedItem, 'PUT').success(function (response) {
            rashaErManage.checkAction(response);
            appApplication.addRequested = false;
            appApplication.busyIndicator.isActive = false;
            appApplication.closeModal();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appApplication.addRequested = false;
            appApplication.busyIndicator.isActive = false;
        });
    }

    appApplication.onSourceChange = function (sourceId) {
        appApplication.themeConfigListItems = [{ Id: 0, Title: "تم را انتخاب کنید" }];
        appApplication.openUserBuildSettings(sourceId);
        ajax.call(mainPathApi+'MobileAppthemeconfig/getAll', { Filters: [{ PropertyName: "LinkSourceId", IntValue1: sourceId }] }, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            appApplication.addRequested = false;
            appApplication.busyIndicator.isActive = false;
            if (response.ListItems.length > 0)
                appApplication.themeConfigListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appApplication.addRequested = false;
            appApplication.busyIndicator.isActive = false;
        });
    }
    //@help@ ارسال پیام
    appApplication.openSendToAllModal = function (selectedIndex, selected) {
        appApplication.selectedItem = { AppId: selected.Id };

        $modal.open({
            templateUrl: 'cpanelv1/ModuleMobileApp/MobileAppApplication/sendNotificationToAllModal.html',
            scope: $scope
        });
    }
    appApplication.sendMode = "all"; //Default
    appApplication.onReceiverChange = function (value) {
        appApplication.show_membergroup = false;
        appApplication.show_chatid = false;
        if (value == "memberId") {
            appApplication.sendMode = "memberId";
            appApplication.show_memberId = true;
        }
        else {
            appApplication.sendMode = "all";
            appApplication.show_memberId = false;
            appApplication.selectedItem.memberIds = "";
        }
    }
    //var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    var date = moment().format();
    appApplication.CronOnceDate = {
        defaultDate: date,
        setTime: function (date) { this.defaultDate = date; }
    }
    appApplication.onScheduleTypeChange = function (scheduleType) {
        switch (scheduleType) {
            case 1:
                appApplication.showWeekly = false;
                appApplication.showmonthly = false;
                appApplication.showonce = true;
                appApplication.showmonthlyYear = false;
                appApplication.showHourly = false;
                appApplication.showDaily = false;
                break;
            case 2:
                appApplication.showWeekly = false;
                appApplication.showmonthly = false;
                appApplication.showonce = false;
                appApplication.showmonthlyYear = false;
                appApplication.showHourly = true;
                appApplication.showDaily = false;
                break;
            case 3:
                appApplication.showmonthly = false;
                appApplication.showonce = false;
                appApplication.showWeekly = false;
                appApplication.showmonthlyYear = false;
                appApplication.showHourly = false;
                appApplication.showDaily = true;
                break;
            case 4:
                appApplication.showmonthly = false;
                appApplication.showonce = false;
                appApplication.showWeekly = true;
                appApplication.showmonthlyYear = false;
                appApplication.showHourly = false;
                appApplication.showDaily = false;
                break;
            case 5:
                appApplication.showmonthly = true;
                appApplication.showonce = false;
                appApplication.showWeekly = false;
                appApplication.showmonthlyYear = false;
                appApplication.showHourly = false;
                appApplication.showDaily = false;
                break;
            case 6:
                appApplication.showonce = false;
                appApplication.showWeekly = false;
                appApplication.showmonthly = false;
                appApplication.showmonthlyYear = true;
                appApplication.showHourly = false;
                appApplication.showDaily = false;
                break;
        }
    };


    appApplication.sendButtonText = "ارسال";

    appApplication.sendMessageToAll = function (selectedIndex, selectedId) {
        if (appApplication.selectedItem.TitleMessage == '') {
            rashaErManage.showMessage("عنوان پیام را وارد کنید");
            return;
        }
        if (appApplication.selectedItem.BodyMessage == '') {
            rashaErManage.showMessage("متن پیام را وارد کنید");
            return;
        }
        if (appApplication.sendMode == "memberId" && appApplication.selectedItem.memberIds == '') {
            rashaErManage.showMessage("شناسه کاربر اپلیکیشن را وارد کنید");
            return;
        }


        appApplication.addRequested = true;
        appApplication.busyIndicator.isActive = true;
        appApplication.sendButtonText = "در حال ارسال...";
        appApplication.selectedItem.LinkMemberIds = [];
        if (appApplication.selectedItem.memberIds != '')
            appApplication.selectedItem.LinkMemberIds = appApplication.selectedItem.memberIds.split(',');

        ajax.call(mainPathApi+'MobileAppLogNotification/SendNotification', appApplication.selectedItem, 'POST').success(function (response) {
            appApplication.busyIndicator.isActive = false;
            appApplication.addRequested = false;
            appApplication.sendButtonText = "ارسال";
            rashaErManage.showMessage("گزارش سرور :" + response.Item.info + "   " + response.ErrorMessage);
            //appApplication.closeModal();
        }).error(function (data, errCode, c, d) {
            appApplication.addRequested = false;
            appApplication.sendButtonText = "ارسال";
            rashaErManage.showMessage("گزارش خطا سرور ");
            appApplication.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }
    //@help@ ارسال پیام
}]);

