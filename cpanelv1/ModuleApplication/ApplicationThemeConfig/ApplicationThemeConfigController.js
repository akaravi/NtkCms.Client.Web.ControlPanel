app.controller("themeConfigController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$builder', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $builder, $window, $filter) {
    var themeConfig = this;
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    //For Grid Options
    if (itemRecordStatus != undefined) themeConfig.itemRecordStatus = itemRecordStatus;
    themeConfig.filePickerMainImage = {
        isActive: true,
        backElement: "filePickerMainImage",
        filename: null,
        fileId: null,
        multiSelect: false
    };
    //init Function
    themeConfig.init = function () {
        themeConfig.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath + "applicationsource/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            themeConfig.sourceListItems = response.ListItems;
            //
            ajax.call(cmsServerConfig.configApiServerPath + "applicationThemeConfig/getAll", themeConfig.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
                // Populate TreeConfig with all the Menu
                themeConfig.ListItems = response.ListItems;
                themeConfig.gridOptions.fillData(response.ListItems, response.resultAccess);
                themeConfig.gridOptions.currentPageNumber = response.CurrentPageNumber;
                themeConfig.gridOptions.totalRowCount = response.TotalRowCount;
                themeConfig.gridOptions.rowPerPage = response.RowPerPage;
                themeConfig.gridOptions.maxSize = 5;
                themeConfig.busyIndicator.isActive = false;
                for (var i = 0; i < themeConfig.ListItems.length; i++) {
                    var fId = findWithAttr(themeConfig.sourceListItems, 'Id', themeConfig.ListItems[i].LinkSourceId)
                    if (fId >= 0)
                        themeConfig.ListItems[i].virtual_Source = themeConfig.sourceListItems[fId];
                }
            }).error(function (data, errCode, c, d) {
                themeConfig.busyIndicator.isActive = false;
                console.log(data);
            });
            //

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    themeConfig.gridOptions = {
        columns: [{
                name: 'Id',
                displayName: 'کد سیستمی',
                sortable: true,
                type: 'integer'
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
                type: 'string'
            },
            {
                name: 'TypeId',
                displayName: 'Type',
                sortable: true,
                type: 'string'
            },
            {
                name: 'virtual_Source.Title',
                displayName: 'منبع',
                sortable: true,
                type: 'string'
            }

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
                RowPerPage: 2000,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }

    // Show Category Loading Indicator
    themeConfig.gridBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    // Show Loading Indicator
    themeConfig.busyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }

    themeConfig.addRequested = false;

    themeConfig.gridOptions.onRowSelected = function () {
        var item = themeConfig.gridOptions.selectedRow.item;
    }

    function findWithAttr(array, attr, value) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }

    //Show Content with Category Id
    themeConfig.selectContent = function (node) {
        themeConfig.busyIndicator.message = "در حال بارگذاری... " + node.Title;
        themeConfig.busyIndicator.isActive = true;
        themeConfig.gridOptions.advancedSearchData.engine.Filters = null;
        themeConfig.gridOptions.advancedSearchData.engine.Filters = [];
        var s = {
            PropertyName: "LinkParentId",
            IntValue1: node.Id,
            SearchType: 0
        }
        themeConfig.gridOptions.advancedSearchData.engine.Filters.push(s);

        ajax.call(cmsServerConfig.configApiServerPath + "ApplicationThemeConfig/GetAll", themeConfig.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            themeConfig.busyIndicator.isActive = false;
            themeConfig.ListItems = response.ListItems;
            for (var i = 0; i < themeConfig.ListItems.length; i++) {
                var fId = findWithAttr(themeConfig.sourceListItems, 'Id', themeConfig.ListItems[i].LinkSourceId)
                if (fId >= 0)
                    themeConfig.ListItems[i].virtual_Source = themeConfig.sourceListItems[fId];
            }
            themeConfig.gridOptions.fillData(themeConfig.ListItems, response.resultAccess);
        }).error(function (data, errCode, c, d) {
            themeConfig.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };


    // Open Add Content Model
    themeConfig.openAddModal = function () {
        themeConfig.addRequested = false;
        themeConfig.filePickerMainImage.filename = "";
        themeConfig.filePickerMainImage.fileId = null;
        themeConfig.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationThemeConfig/GetViewModel', "", 'GET').success(function (response) {
            console.log(response);
            rashaErManage.checkAction(response);
            themeConfig.selectedItem = response.Item;
            if (themeConfig.selectedItem != undefined && themeConfig.selectedItem.virtual_Source != undefined) {
                themeConfig.selectedItem.ThemeConfigBuilderJsonValuesHtml = 'cpanelv1/ModuleApplication/ConfigTheme/' + themeConfig.selectedItem.virtual_Source.ClassName + '.Builder.html';
                themeConfig.selectedItem.ThemeConfigRuntimeJsonValuesHtml = 'cpanelv1/ModuleApplication/ConfigTheme/' + themeConfig.selectedItem.virtual_Source.ClassName + '.Runtime.html';
            }
            themeConfig.selectedItem.ThemeConfigBuilderJsonValuesModel = $.parseJSON(themeConfig.selectedItem.ThemeConfigBuilderJsonValues);
            themeConfig.selectedItem.ThemeConfigRuntimeJsonValuesModel = $.parseJSON(themeConfig.selectedItem.ThemeConfigRuntimeJsonValues);
            $modal.open({
                templateUrl: 'cpanelv1/ModuleApplication/ApplicationThemeConfig/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    themeConfig.openEditModal = function () {
        themeConfig.addRequested = false;
        themeConfig.modalTitle = 'ویرایش';
        if (!themeConfig.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاً یک ردیف جهت ویرایش انتخاب کنید");
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationThemeConfig/GetOne', themeConfig.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            themeConfig.selectedItem = response.Item;
            themeConfig.filePickerMainImage.filename = null;
            themeConfig.filePickerMainImage.fileId = null;
            if (themeConfig.selectedItem != undefined && themeConfig.selectedItem.virtual_Source != undefined) {
                themeConfig.selectedItem.ThemeConfigBuilderJsonValuesHtml = 'cpanelv1/ModuleApplication/ConfigTheme/' + themeConfig.selectedItem.virtual_Source.ClassName + '.Builder.html';
                themeConfig.selectedItem.ThemeConfigRuntimeJsonValuesHtml = 'cpanelv1/ModuleApplication/ConfigTheme/' + themeConfig.selectedItem.virtual_Source.ClassName + '.Runtime.html';
            }
            themeConfig.selectedItem.ThemeConfigBuilderJsonValuesModel = $.parseJSON(themeConfig.selectedItem.ThemeConfigBuilderJsonValues);
            themeConfig.selectedItem.ThemeConfigRuntimeJsonValuesModel = $.parseJSON(themeConfig.selectedItem.ThemeConfigRuntimeJsonValues);
            if (response.Item.LinkMainImageId != null) {
                ajax
                    .call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", response.Item.LinkMainImageId, "GET")
                    .success(function (response2) {
                        buttonIsPressed = false;
                        themeConfig.filePickerMainImage.filename = response2.Item.FileName;
                        themeConfig.filePickerMainImage.fileId = response2.Item.Id;
                    })
                    .error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
            }
            themeConfig.onSourceChange(themeConfig.gridOptions.selectedRow.item.LinkSourceId);
            $modal.open({
                templateUrl: 'cpanelv1/ModuleApplication/ApplicationThemeConfig/edit.html',
                scope: $scope
            });

            //themeConfig.loadValues();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    themeConfig.addNewRow = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        themeConfig.addRequested = true;

        themeConfig.selectedItem.ThemeConfigBuilderJsonValues = $.trim(angular.toJson(themeConfig.selectedItem.ThemeConfigBuilderJsonValuesModel));
        themeConfig.selectedItem.ThemeConfigRuntimeJsonValues = $.trim(angular.toJson(themeConfig.selectedItem.ThemeConfigRuntimeJsonValuesModel));
        themeConfig.selectedItem.ThemeConfigLayoutJsonValues = $.trim(angular.toJson(themeConfig.ListItemsLayoutTheme));
        //
        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationThemeConfig/add', themeConfig.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                themeConfig.ListItems.unshift(response.Item);
                themeConfig.gridOptions.fillData(themeConfig.ListItems);
                themeConfig.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            themeConfig.addRequested = false;
        });
    }

    // Edit a Content
    themeConfig.editRow = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        themeConfig.addRequested = true;

        themeConfig.selectedItem.ThemeConfigBuilderJsonValues = $.trim(angular.toJson(themeConfig.selectedItem.ThemeConfigBuilderJsonValuesModel));
        themeConfig.selectedItem.ThemeConfigRuntimeJsonValues = $.trim(angular.toJson(themeConfig.selectedItem.ThemeConfigRuntimeJsonValuesModel));

        themeConfig.selectedItem.ThemeConfigLayoutJsonValues = $.trim(angular.toJson(themeConfig.ListItemsLayoutTheme));

        ajax.call(cmsServerConfig.configApiServerPath + 'applicationThemeConfig/edit', themeConfig.selectedItem, 'PUT').success(function (response) {
            themeConfig.addRequested = false;
            themeConfig.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                themeConfig.replaceItem(themeConfig.selectedItem.Id, response.Item);
                themeConfig.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            themeConfig.addRequested = false;
        });
    }

    //Delete a Content 
    themeConfig.deleteRow = function () {
        if (!themeConfig.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                themeConfig.busyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath + "applicationthemeconfig/GetOne", themeConfig.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    themeConfig.busyIndicator.isActive = false;
                    rashaErManage.checkAction(response);
                    themeConfig.selectedItemForDelete = response.Item;
                    themeConfig.busyIndicator.isActive = true;
                    ajax.call(cmsServerConfig.configApiServerPath + "applicationthemeconfig/delete", themeConfig.selectedItemForDelete, 'POST').success(function (res) {
                        themeConfig.busyIndicator.isActive = false;
                        rashaErManage.checkAction(res);
                        themeConfig.replaceItem(themeConfig.selectedItemForDelete.Id);
                        themeConfig.gridOptions.fillData(themeConfig.ListItems);
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        themeConfig.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    themeConfig.busyIndicator.isActive = false;
                });
            }
        });
    }

    //Replace Item OnDelete/OnEdit Grid Options
    themeConfig.replaceItem = function (oldId, newItem) {
        angular.forEach(themeConfig.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = themeConfig.ListItems.indexOf(item);
                themeConfig.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            themeConfig.ListItems.unshift(newItem);
    }

    themeConfig.searchData = function () {
        themeConfig.gridOptions.serachData();
    }

    //Close Model Stack
    themeConfig.addRequested = false;
    themeConfig.closeModal = function () {
        $modalStack.dismissAll();
    };

    //For reInit Categories
    themeConfig.gridOptions.reGetAll = function () {
        themeConfig.init();
    };

    themeConfig.addRequested = true;

    themeConfig.columnCheckbox = false;

    themeConfig.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = themeConfig.gridOptions.columns;
        if (themeConfig.gridOptions.columnCheckbox) {
            for (var i = 0; i < themeConfig.gridOptions.columns.length; i++) {
                var element = $("#" + themeConfig.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                themeConfig.gridOptions.columns[i].visible = temp;
            }
        } else {

            for (var i = 0; i < themeConfig.gridOptions.columns.length; i++) {
                var element = $("#" + themeConfig.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + themeConfig.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < themeConfig.gridOptions.columns.length; i++) {
            console.log(themeConfig.gridOptions.columns[i].name.concat(".visible: "), themeConfig.gridOptions.columns[i].visible);
        }
        themeConfig.gridOptions.columnCheckbox = !themeConfig.gridOptions.columnCheckbox;
    }



    themeConfig.ListItemsLayoutTheme = [];
    themeConfig.onSourceChange = function (sourceId) {

        var source = {};
        var fId = findWithAttr(themeConfig.sourceListItems, 'Id', sourceId)
        if (fId >= 0)
            source = themeConfig.sourceListItems[fId];


        if (themeConfig.selectedItem != undefined && source != undefined && source.ClassName != undefined) {
            themeConfig.selectedItem.ThemeConfigBuilderJsonValuesHtml = 'cpanelv1/ModuleApplication/ConfigTheme/' + source.ClassName + '.Builder.html';
            themeConfig.selectedItem.ThemeConfigRuntimeJsonValuesHtml = 'cpanelv1/ModuleApplication/ConfigTheme/' + source.ClassName + '.Runtime.html';
        }
        themeConfig.busyIndicator.isActive = true;

        var engine = {
            RowPerPage: 2000,
            Filters: []
        }
        engine.Filters.push({
            PropertyName: "LinkSourceId",
            searchType: 0,
            IntValue1: sourceId
        });
        var ListItemsLayoutThemeValue = [];
        themeConfig.ListItemsLayoutTheme = [];

        if (themeConfig.gridOptions.selectedRow.item && themeConfig.gridOptions.selectedRow.item.ThemeConfigLayoutJsonValues && themeConfig.gridOptions.selectedRow.item.ThemeConfigLayoutJsonValues.length > 0) {
            try {
                ListItemsLayoutThemeValue = $.parseJSON(themeConfig.gridOptions.selectedRow.item.ThemeConfigLayoutJsonValues);
            } catch {
                ListItemsLayoutThemeValue = [];
            }
        }
        ajax.call(cmsServerConfig.configApiServerPath + "ApplicationLayout/GetAllExist", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            themeConfig.busyIndicator.isActive = false;
            for (var i = 0; i < response.ListItems.length; i++) {
               var LayoutTheme = "1";
                var fId = findWithAttr(ListItemsLayoutThemeValue, 'LayoutName', response.ListItems[i].ClassName)
                if (fId >= 0) {
                    LayoutTheme = ListItemsLayoutThemeValue[fId].LayoutTheme;
                }
                themeConfig.ListItemsLayoutTheme.push({
                    Title: response.ListItems[i].Title,
                    LayoutName: response.ListItems[i].ClassName,
                    LayoutTheme: LayoutTheme,
                })

            }
        }).error(function (data, errCode, c, d) {
            themeConfig.busyIndicator.isActive = false;
            themeConfig.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }


    themeConfig.columnCheckbox = false;

    themeConfig.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (themeConfig.gridOptions.columnCheckbox) {
            for (var i = 0; i < themeConfig.gridOptions.columns.length; i++) {
                //themeConfig.gridOptions.columns[i].visible = $("#" + themeConfig.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + themeConfig.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                themeConfig.gridOptions.columns[i].visible = element[0].checked;
            }
        } else {
            var prechangeColumns = themeConfig.gridOptions.columns;
            for (var i = 0; i < themeConfig.gridOptions.columns.length; i++) {
                themeConfig.gridOptions.columns[i].visible = true;
                var element = $("#" + themeConfig.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + themeConfig.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < themeConfig.gridOptions.columns.length; i++) {
            console.log(themeConfig.gridOptions.columns[i].name.concat(".visible: "), themeConfig.gridOptions.columns[i].visible);
        }
        themeConfig.gridOptions.columnCheckbox = !themeConfig.gridOptions.columnCheckbox;
    }

    themeConfig.changeState = function (state, app) {
        $state.go("index." + state, {
            sourceid: app.LinkSourceId,
            appid: app.Id,
            apptitle: app.Title
        });
    }
    //upload file
    themeConfig.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (themeConfig.fileIsExist(uploadFile.name)) {
                // File already exists
                if (
                    confirm(
                        'File "' +
                        uploadFile.name +
                        '" already exists! Do you want to replace the new file?'
                    )
                ) {
                    //------------ themeConfig.replaceFile(uploadFile.name);
                    themeConfig.itemClicked(null, themeConfig.fileIdToDelete, "file");
                    themeConfig.fileTypes = 1;
                    themeConfig.fileIdToDelete = themeConfig.selectedIndex;
                    // replace the file
                    ajax
                        .call(
                            cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                            themeConfig.fileIdToDelete,
                            "GET"
                        )
                        .success(function (response1) {
                            if (response1.IsSuccess == true) {
                                console.log(response1.Item);
                                ajax.call(cmsServerConfig.configApiServerPath + "FileContent/replace", response1.Item, "POST")
                                    .success(function (response2) {
                                        if (response2.IsSuccess == true) {
                                            themeConfig.FileItem = response2.Item;
                                            themeConfig.showSuccessIcon();
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-check");
                                            themeConfig.filePickerMainImage.filename =
                                                themeConfig.FileItem.FileName;
                                            themeConfig.filePickerMainImage.fileId =
                                                response2.Item.Id;
                                            themeConfig.selectedItem.LinkMainImageId =
                                                themeConfig.filePickerMainImage.fileId;
                                        } else {
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-remove");
                                        }
                                    })
                                    .error(function (data) {
                                        themeConfig.showErrorIcon();
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
                    .call(cmsServerConfig.configApiServerPath + "FileContent/GetViewModel", "", "GET")
                    .success(function (response) {
                        themeConfig.FileItem = response.Item;
                        themeConfig.FileItem.FileName = uploadFile.name;
                        themeConfig.FileItem.uploadName = uploadFile.uploadName;
                        themeConfig.FileItem.Extension = uploadFile.name.split(".").pop();
                        themeConfig.FileItem.FileSrc = uploadFile.name;
                        themeConfig.FileItem.LinkCategoryId = null; //Save the new file in the root
                        // ------- themeConfig.saveNewFile()  ----------------------
                        var result = 0;
                        ajax
                            .call(cmsServerConfig.configApiServerPath + "FileContent/add", themeConfig.FileItem, "POST")
                            .success(function (response) {
                                if (response.IsSuccess) {
                                    themeConfig.FileItem = response.Item;
                                    themeConfig.showSuccessIcon();
                                    $("#save-icon" + index).removeClass("fa-save");
                                    $("#save-button" + index).removeClass("flashing-button");
                                    $("#save-icon" + index).addClass("fa-check");
                                    themeConfig.filePickerMainImage.filename =
                                        themeConfig.FileItem.FileName;
                                    themeConfig.filePickerMainImage.fileId = response.Item.Id;
                                    themeConfig.selectedItem.LinkMainImageId =
                                        themeConfig.filePickerMainImage.fileId;
                                } else {
                                    $("#save-icon" + index).removeClass("fa-save");
                                    $("#save-button" + index).removeClass("flashing-button");
                                    $("#save-icon" + index).addClass("fa-remove");
                                }
                            })
                            .error(function (data) {
                                themeConfig.showErrorIcon();
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
    themeConfig.exportFile = function () {
        themeConfig.addRequested = true;
        themeConfig.gridOptions.advancedSearchData.engine.ExportFile = themeConfig.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath + 'applicationthemeconfig/exportfile', themeConfig.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            themeConfig.addRequested = false;
            rashaErManage.checkAction(response);
            themeConfig.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                themeConfig.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //themeConfig.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    themeConfig.toggleExportForm = function () {
        themeConfig.SortType = [{
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
        themeConfig.EnumExportFileType = [{
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
        themeConfig.EnumExportReceiveMethod = [{
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
        themeConfig.ExportFileClass = {
            FileType: 1,
            RecieveMethod: 0,
            RowCount: 100
        };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleApplication/ApplicationThemeConfig/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    themeConfig.rowCountChanged = function () {
        if (!angular.isDefined(themeConfig.ExportFileClass.RowCount) || themeConfig.ExportFileClass.RowCount > 5000)
            themeConfig.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    themeConfig.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath + "applicationthemeconfig/count", themeConfig.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            themeConfig.addRequested = false;
            rashaErManage.checkAction(response);
            themeConfig.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            themeConfig.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);