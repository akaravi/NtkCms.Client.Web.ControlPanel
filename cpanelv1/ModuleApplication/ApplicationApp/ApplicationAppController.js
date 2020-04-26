app.controller("applicationAppController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$builder', '$state', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $builder, $state, $window, $filter) {
    var appApplication = this;
    appApplication.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    appApplication.FileIdIcon = {
        isActive: true,
        backElement: "LinkFileIdIcon",
        filename: null,
        fileId: null,
        multiSelect: false
    };
    appApplication.FileIdLogo = {
        isActive: true,
        backElement: "LinkFileIdLogo",
        filename: null,
        fileId: null,
        multiSelect: false
    };
    appApplication.FileIdSplashScreen = {
        isActive: true,
        backElement: "LinkFileIdSplashScreen",
        filename: null,
        fileId: null,
        multiSelect: false
    };
    appApplication.filePickerSmallImage = {
        isActive: true,
        backElement: "SmallImageId",
        filename: null,
        fileId: null,
        multiSelect: false
    };
    appApplication.filePickerBigImage = {
        isActive: true,
        backElement: "BigImageId",
        filename: null,
        fileId: null,
        multiSelect: false
    };




    appApplication.UninversalMenus = [];
    appApplication.EnumNotificationType = [];
    appApplication.selectUniversalMenuOnUndetectableKey = true;
    if (itemRecordStatus != undefined) appApplication.itemRecordStatus = itemRecordStatus;

    appApplication.init = function () {
        appApplication.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath + "ApplicationApp/getall", appApplication.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            appApplication.busyIndicator.isActive = false;
            appApplication.ListItems = response.ListItems;

            appApplication.calculatePercantage(appApplication.ListItems);

            //Get all Sources
            ajax.call(cmsServerConfig.configApiServerPath + "applicationsource/getall", {}, 'POST').success(function (responseSource) {
                rashaErManage.checkAction(responseSource);
                appApplication.sourceListItems = responseSource.ListItems;
                for (var i = 0; i < appApplication.ListItems.length; i++) {
                    var fId = findWithAttr(appApplication.sourceListItems, 'Id', appApplication.ListItems[i].LinkSourceId)
                    if (fId >= 0)
                        appApplication.ListItems[i].virtual_Source = appApplication.sourceListItems[fId];
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
            //Get all Sources
            ajax.call(cmsServerConfig.configApiServerPath + "applicationApp/getBuildStatusEnum", {}, 'POST').success(function (responseGetEnum) {
                appApplication.buildStatusEnum = responseGetEnum.ListItems;
                appApplication.setBuildStatusEnum(appApplication.ListItems, appApplication.buildStatusEnum);
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
            ajax.call(cmsServerConfig.configApiServerPath + "ApplicationEnum/EnumNotificationType", '', 'GET').success(function (responseGetEnum) {
                rashaErManage.checkAction(responseGetEnum);
                if (responseGetEnum.IsSuccess)
                    appApplication.EnumNotificationType = responseGetEnum.ListItems;
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


        //@help برای زمانبندی
        ajax.call(cmsServerConfig.configApiServerPath + "TaskSchedulerSchedule/getAllScheduleCronType", {}, 'POST').success(function (response) {
            appApplication.ScheduleCronType = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath + "TaskSchedulerSchedule/getAllDayOfWeek", {}, 'POST').success(function (response) {
            appApplication.weekdays = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        //@help برای زمانبندی
    }

    appApplication.setBuildStatusEnum = function (listItems, enumList) {
        // angular.forEach(listItems, function (item, property) {
        //     angular.forEach(enumList, function (value, key) {
        //         if (item.LastBuildStatus == value.Value)
        //             item.LastBuildStatusTitle = value.Description;
        //     });
        // });
        for (var i = 0; i < listItems.length; i++) {
            var fId = findWithAttr(enumList, 'Value', listItems[i].LastBuildStatus)
            if (fId >= 0)
                listItems[i].LastBuildStatusTitle = enumList[fId].Description;
        }
    }

    // Open Add Modal
    appApplication.busyIndicator.isActive = true;

    appApplication.addRequested = false;

    appApplication.openAddModal = function () {
        if (buttonIsPressed) return;

        appApplication.modalTitle = 'اضافه';
        appApplication.FileIdIcon.filename = "";
        appApplication.FileIdIcon.fileId = null;
        appApplication.FileIdLogo.filename = "";
        appApplication.FileIdLogo.fileId = null;
        appApplication.FileIdSplashScreen.filename = "";
        appApplication.FileIdSplashScreen.fileId = null;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationApp/GetViewModel', "", 'GET').success(function (response) {
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
            ajax.call(cmsServerConfig.configApiServerPath + "FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                appApplication.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = {
                    Filters: [{
                        PropertyName: "LinkCategoryId",
                        SearchType: 0,
                        IntValue1: null,
                        IntValueForceNullSearch: true
                    }]
                };
                ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(appApplication.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleApplication/ApplicationApp/add.html',
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
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (appApplication.selectedItem.LinkSourceId == null) {
            rashaErManage.showMessage("لطفاً منبع اپلیکیشن را انتخاب کنید!");
            return;
        }
        if (appApplication.selectedItem.LinkThemeConfigId == null) {
            rashaErManage.showMessage("لطفاً قالب اپلیکیشن را انتخاب کنید!");
            return;
        }
        
        appApplication.addRequested = true;
        appApplication.busyIndicator.isActive = true;
        //appApplication.selectedItem[appApplication.selectedConfig] = $.trim(angular.toJson(appApplication.submitValue));



        appApplication.selectedItem.ConfigBuilderAdminJsonValues = $.trim(angular.toJson(appApplication.ConfigBuilderAdmin));
        appApplication.selectedItem.ConfigRuntimeAdminJsonValues = $.trim(angular.toJson(appApplication.ConfigRuntimeAdmin));
        appApplication.selectedItem.ConfigBuilderSiteJsonValues = $.trim(angular.toJson(appApplication.ConfigBuilderSite));
        appApplication.selectedItem.ConfigRuntimeSiteJsonValues = $.trim(angular.toJson(appApplication.ConfigRuntimeSite));

        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationApp/add', appApplication.selectedItem, 'POST').success(function (response) {
            appApplication.addRequested = false;
            appApplication.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                appApplication.ListItems.unshift(response.Item);
                appApplication.gridOptions.fillData(appApplication.ListItems);
                appApplication.setBuildStatusEnum(appApplication.ListItems, appApplication.buildStatusEnum);
                appApplication.closeModal();
            }
            appApplication.closeModal();
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
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationApp/GetOne', appApplication.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            appApplication.selectedItem = response.Item;


            var fId = findWithAttr(appApplication.sourceListItems, 'Id', appApplication.selectedItem.LinkSourceId)
            if (fId >= 0) {
                appApplication.selectedItem.virtual_Source = appApplication.sourceListItems[fId];
                appApplication.includeHtmlBuilderAdmin = 'cpanelv1/ModuleApplication/ConfigSource/' + appApplication.selectedItem.virtual_Source.ClassName + '.Builder.Admin.html';
                appApplication.includeHtmlRuntimeAdmin = 'cpanelv1/ModuleApplication/ConfigSource/' + appApplication.selectedItem.virtual_Source.ClassName + '.Runtime.Admin.html';
                appApplication.includeHtmlBuilderSite = 'cpanelv1/ModuleApplication/ConfigSource/' + appApplication.selectedItem.virtual_Source.ClassName + '.Builder.Site.html';
                appApplication.includeHtmlRuntimeSite = 'cpanelv1/ModuleApplication/ConfigSource/' + appApplication.selectedItem.virtual_Source.ClassName + '.Runtime.Site.html';
            }
            appApplication.ConfigBuilderAdmin = $.parseJSON(appApplication.selectedItem.ConfigBuilderAdminJsonValues);
            appApplication.ConfigRuntimeAdmin = $.parseJSON(appApplication.selectedItem.ConfigRuntimeAdminJsonValues);
            appApplication.ConfigBuilderSite = $.parseJSON(appApplication.selectedItem.ConfigBuilderSiteJsonValues);
            appApplication.ConfigRuntimeSite = $.parseJSON(appApplication.selectedItem.ConfigRuntimeSiteJsonValues);


            appApplication.FileIdIcon.filename = null;
            appApplication.FileIdIcon.fileId = null;
            appApplication.FileIdLogo.filename = null;
            appApplication.FileIdLogo.fileId = null;
            appApplication.FileIdSplashScreen.filename = null;
            appApplication.FileIdSplashScreen.fileId = null;
            if (response.Item.LinkFileIdIcon != null) {
                ajax
                    .call(
                        cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                        response.Item.LinkFileIdIcon,
                        "GET"
                    )
                    .success(function (response2) {
                        buttonIsPressed = false;
                        appApplication.FileIdIcon.filename = response2.Item.FileName;
                        appApplication.FileIdIcon.fileId = response2.Item.Id;
                    })
                    .error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
            }
            if (response.Item.LinkFileIdLogo != null) {
                ajax
                    .call(
                        cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                        response.Item.LinkFileIdLogo,
                        "GET"
                    )
                    .success(function (response2) {
                        buttonIsPressed = false;
                        appApplication.FileIdLogo.filename = response2.Item.FileName;
                        appApplication.FileIdLogo.fileId = response2.Item.Id;
                    })
                    .error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
            }
            if (response.Item.LinkFileIdSplashScreen != null) {
                ajax
                    .call(
                        cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                        response.Item.LinkFileIdSplashScreen,
                        "GET"
                    )
                    .success(function (response2) {
                        buttonIsPressed = false;
                        appApplication.FileIdSplashScreen.filename = response2.Item.FileName;
                        appApplication.FileIdSplashScreen.fileId = response2.Item.Id;
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
            ajax.call(cmsServerConfig.configApiServerPath + "FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                appApplication.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = {
                    Filters: [{
                        PropertyName: "LinkCategoryId",
                        SearchType: 0,
                        IntValue1: null,
                        IntValueForceNullSearch: true
                    }]
                };
                ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(appApplication.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (appApplication.selectedItem.LinkModulesFilesIdIcon > 0)
                        appApplication.onSelection({
                            Id: appApplication.selectedItem.LinkModulesFilesIdIcon
                        }, true);
                    if (appApplication.selectedItem.LinkSourceId > 0)
                        appApplication.onSourceChange(appApplication.selectedItem.LinkSourceId);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleApplication/ApplicationApp/edit.html',
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
                        if ($.grep(scope.expandedNodes, function (e) {
                                return e.Id === currentChild.Id;
                            }).length <= 0) scope.expandedNodes.push(currentChild);
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
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }  
        if (appApplication.selectedItem.LinkSourceId == null) {
            rashaErManage.showMessage("لطفاً منبع اپلیکیشن را انتخاب کنید!");
            return;
        }
        if (appApplication.selectedItem.LinkThemeConfigId == null) {
            rashaErManage.showMessage("لطفاً قالب اپلیکیشن را انتخاب کنید!");
            return;
        }
        appApplication.addRequested = true;
        appApplication.busyIndicator.isActive = true;
        //appApplication.selectedItem[appApplication.selectedConfig] = $.trim(angular.toJson(appApplication.submitValue));


        appApplication.selectedItem.ConfigBuilderAdminJsonValues = $.trim(angular.toJson(appApplication.ConfigBuilderAdmin));
        appApplication.selectedItem.ConfigRuntimeAdminJsonValues = $.trim(angular.toJson(appApplication.ConfigRuntimeAdmin));
        appApplication.selectedItem.ConfigBuilderSiteJsonValues = $.trim(angular.toJson(appApplication.ConfigBuilderSite));
        appApplication.selectedItem.ConfigRuntimeSiteJsonValues = $.trim(angular.toJson(appApplication.ConfigRuntimeSite));

        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationApp/edit', appApplication.selectedItem, 'PUT').success(function (response) {
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
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                appApplication.busyIndicator.isActive = true;
                console.log(appApplication.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationApp/GetOne', appApplication.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    appApplication.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationApp/delete', appApplication.selectedItemForDelete, 'POST').success(function (res) {
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
                name: 'Title',
                displayName: 'عنوان',
                sortable: true,
                type: 'string',
                visible: true
            },
            {
                name: 'AppVersion',
                displayName: 'ورژن',
                sortable: true,
                type: 'string',
                visible: true
            },
            {
                name: 'virtual_Source.Title',
                displayName: 'منبع',
                sortable: true,
                type: 'string',
                visible: true,
                displayForce: true
            },
            {
                name: 'virtual_ThemeConfig.Title',
                displayName: 'تم',
                sortable: true,
                type: 'string',
                visible: true,
                displayForce: true
            },
            {
                name: 'DownloadCount',
                displayName: 'تعداد دانلود',
                sortable: true,
                type: 'integer',
                visible: true
            },
            {
                name: 'LastBuildOrderDate',
                displayName: 'تاریخ سفارش ساخت',
                sortable: true,
                isDateTime: true,
                type: 'date',
                visible: 'true'
            },
            {
                name: 'LastBuildStatusTitle',
                displayName: 'آخرین وضعیت',
                sortable: true,
                type: 'string',
                visible: true,
                template: "<p id=\"LastBuildStatusID\">{{x.LastBuildStatusTitle}}</p>"
            },
            {
                name: 'LastSuccessfullyBuildDate',
                displayName: 'آخرین ساخت موفق',
                sortable: true,
                isDateTime: true,
                visible: 'true'
            },
            {
                name: 'ScoreClick',
                displayName: ' تعداد رای',
                sortable: true,
                type: 'string',
                visible: 'true'
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
                name: "ActionButton",
                displayName: "مقداردهی",
                sortable: true,
                displayForce: true,
                template: "<button class=\"btn btn-primary\" ng-click=\"appApplication.changeState('applicationlayoutvalue', x)\" type=\"button\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i></button>"
            },
            {
                name: "ActionBuildApkButton",
                displayName: "ساخت Apk",
                sortable: false,
                displayForce: true,
                template: "<button class=\"btn btn-warning\" ng-click=\"appApplication.buildApp(x , x.LastBuildStatus)\" title=\"ارسال دستور ساخت اپلیکیشن  برنامه های این نوع اپ\" type=\"button\"><i class=\"fa fa-plus-square\" aria-hidden=\"true\"></i></button>"
            },
            {
                name: "ActionDownloadApkButton",
                displayName: "دانلود Apk",
                sortable: false,
                displayForce: true,
                template: "<button class=\"btn btn-success\" ng-show=\"{{x.AppKey != null && x.AppKey != ''}}\" ng-click=\"appApplication.downloadApk(x)\" title=\"دانلود فایل مربوط به این اپ\" type=\"button\"><i class=\"fa fa-download\" aria-hidden=\"true\"></i></button>"
            },
            {
                name: 'ActionButton2',
                displayName: 'عملیات',
                sortable: true,
                type: 'string',
                visible: true,
                displayForce: true,
                template: '<button type="button" name="getInfo_btn" ng-click="appApplication.openSendToAllModal($index, x)" class="btn btn-success">{{"BULK_SEND"|lowercase|translate}}&nbsp;<i class="fa fa-envelope-o" aria-hidden="true"></i></button>'
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

    appApplication.gridOptions.reGetAll = function () {
        appApplication.init();
    }

    appApplication.gridOptions.onRowSelected = function () {

    }

    appApplication.columnCheckbox = false;
    appApplication.calculatePercantage = function (list) {
        if (angular.isDefined(list) && list.length > 0) {


            $.each(list, function (index, item) {
                if (item.ScoreClick == null || item.ScoreClick == undefined || item.ScoreClick <= 0)
                    item.ScoreClick == 0;
                if (item.ScoreClick == 0)
                    item.Virtual_ScoreSumPercent = '%0';
                else
                    item.Virtual_ScoreSumPercent = '%' + (item.ScoreClick / item.ScoreClick).toFixed(2);
            });
        }
    }
    appApplication.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (appApplication.gridOptions.columnCheckbox) {
            for (var i = 0; i < appApplication.gridOptions.columns.length; i++) {
                //appApplication.gridOptions.columns[i].visible = $("#" + appApplication.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + appApplication.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                appApplication.gridOptions.columns[i].visible = element[0].checked;
            }
        } else {
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
    //upload file

    //End of Upload Modal-----------------------------------------
    //Export Report 
    appApplication.exportFile = function () {
        appApplication.addRequested = true;
        appApplication.gridOptions.advancedSearchData.engine.ExportFile = appApplication.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationApp/exportfile', appApplication.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
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
        appApplication.SortType = [{
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
        appApplication.EnumExportFileType = [{
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
        appApplication.EnumExportReceiveMethod = [{
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
        appApplication.ExportFileClass = {
            FileType: 1,
            RecieveMethod: 0,
            RowCount: 100
        };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleApplication/ApplicationApp/report.html',
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
        ajax.call(cmsServerConfig.configApiServerPath + "ApplicationApp/count", appApplication.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
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
        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationApp/buildApp', App.Id, 'GET').success(function (response) {
            /* var myVar = setInterval(myTimer,10000);
             function myTimer() {
                 ajax.call(cmsServerConfig.configApiServerPath+'ApplicationApp/GetOne', App.Id, 'GET').success(function (response) {
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
            templateUrl: 'cpanelv1/ModuleApplication/ApplicationApp/downloadApk.html',
            scope: $scope
        });
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
            var filterModel = {
                Filters: []
            };
            var originalName = node.Title;
            node.messageText = " در حال بارگذاری...";
            filterModel.Filters.push({
                PropertyName: "LinkParentId",
                SearchType: 0,
                IntValue1: node.Id
            });
            ajax.call(cmsServerConfig.configApiServerPath + "FileCategory/GetAll", filterModel, 'POST').success(function (response1) {
                angular.forEach(response1.ListItems, function (value, key) {
                    node.Children.push(value);
                });
                ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", node.Id, 'POST').success(function (response2) {
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
        appApplication.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages + "loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", node.Id, "GET").success(function (response) {
            appApplication.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl

    function findWithAttr(array, attr, value) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }


    appApplication.onSourceChange = function (sourceId) {
        appApplication.themeConfigListItems = [{
            Id: 0,
            Title: "تم را انتخاب کنید"
        }];
        //تغییر مقادیر


        var fId = findWithAttr(appApplication.sourceListItems, 'Id', sourceId)
        if (fId >= 0)
            appApplication.selectedItem.virtual_Source = appApplication.sourceListItems[fId];


        if (appApplication.selectedItem.virtual_Source != undefined && appApplication.selectedItem.virtual_Source && appApplication.selectedItem.virtual_Source != undefined && appApplication.selectedItem.virtual_Source.ClassName != undefined) {
            appApplication.includeHtmlBuilderAdmin = 'cpanelv1/ModuleApplication/ConfigSource/' + appApplication.selectedItem.virtual_Source.ClassName + '.Builder.Admin.html';
            appApplication.includeHtmlRuntimeAdmin = 'cpanelv1/ModuleApplication/ConfigSource/' + appApplication.selectedItem.virtual_Source.ClassName + '.Runtime.Admin.html';
            appApplication.includeHtmlBuilderSite = 'cpanelv1/ModuleApplication/ConfigSource/' + appApplication.selectedItem.virtual_Source.ClassName + '.Builder.Site.html';
            appApplication.includeHtmlRuntimeSite = 'cpanelv1/ModuleApplication/ConfigSource/' + appApplication.selectedItem.virtual_Source.ClassName + '.Runtime.Site.html';

            appApplication.ConfigBuilderAdmin = $.parseJSON(appApplication.selectedItem.ConfigBuilderAdminJsonValues);
            appApplication.ConfigRuntimeAdmin = $.parseJSON(appApplication.selectedItem.ConfigRuntimeAdminJsonValues);
            appApplication.ConfigBuilderSite = $.parseJSON(appApplication.selectedItem.ConfigBuilderSiteJsonValues);
            appApplication.ConfigRuntimeSite = $.parseJSON(appApplication.selectedItem.ConfigRuntimeSiteJsonValues);

            if (appApplication.selectedItem.ConfigBuilderAdminJsonValues == undefined || appApplication.selectedItem.ConfigBuilderAdminJsonValues.length == 0 || !appApplication.ConfigBuilderAdmin)
                appApplication.ConfigBuilderAdmin = $.parseJSON(appApplication.selectedItem.virtual_Source.DefaultConfigBuilderAdminJsonValues);
            if (appApplication.selectedItem.ConfigRuntimeAdminJsonValues == undefined || appApplication.selectedItem.ConfigRuntimeAdminJsonValues.length == 0 || !appApplication.ConfigRuntimeAdmin)
                appApplication.ConfigRuntimeAdmin = $.parseJSON(appApplication.selectedItem.virtual_Source.DefaultConfigRuntimeAdminJsonValues);
            if (appApplication.selectedItem.ConfigBuilderSiteJsonValues == undefined || appApplication.selectedItem.ConfigBuilderSiteJsonValues.length == 0 || !appApplication.ConfigBuilderSite)
                appApplication.ConfigBuilderSite = $.parseJSON(appApplication.selectedItem.virtual_Source.DefaultConfigBuilderSiteJsonValues);
            if (appApplication.selectedItem.ConfigRuntimeSiteJsonValues == undefined || appApplication.selectedItem.ConfigRuntimeSiteJsonValues.length == 0 || !appApplication.ConfigRuntimeSite)
                appApplication.ConfigRuntimeSite = $.parseJSON(appApplication.selectedItem.virtual_Source.DefaultConfigRuntimeSiteJsonValues);
        }
        //تغییر مقادیر


        ajax.call(cmsServerConfig.configApiServerPath + 'Applicationthemeconfig/getAll', {
            Filters: [{
                PropertyName: "LinkSourceId",
                IntValue1: sourceId
            }]
        }, 'POST').success(function (response) {
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
        appApplication.selectedItem = {
            AppId: selected.Id
        };
        appApplication.filePickerSmallImage.filename = null;
        appApplication.filePickerBigImage.fileId = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleApplication/ApplicationApp/sendNotificationToAllModal.html',
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
        } else {
            appApplication.sendMode = "all";
            appApplication.show_memberId = false;
            appApplication.selectedItem.memberIds = "";
        }
    }
    //var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    var date = moment().format();
    appApplication.CronOnceDate = {
        defaultDate: date,
        setTime: function (date) {
            this.defaultDate = date;
        }
    }
    appApplication.onEnumNotificationTypeChange = function (NotificationType) {
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
        if (appApplication.selectedItem.Title == '') {
            rashaErManage.showMessage("عنوان پیام را وارد کنید");
            return;
        }
        if (appApplication.selectedItem.Content == '') {
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
        if (appApplication.selectedItem.memberIds != '' && appApplication.sendMode == "memberId")
            appApplication.selectedItem.LinkMemberIds = appApplication.selectedItem.memberIds.split(',');

        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationLogNotification/SendNotification', appApplication.selectedItem, 'POST').success(function (response) {
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