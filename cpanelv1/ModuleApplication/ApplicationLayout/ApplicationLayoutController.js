app.controller("applicationLayoutController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$builder', '$stateParams', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $builder, $stateParams, $state, $filter) {
    var appLayout = this;
    if (itemRecordStatus != undefined) appLayout.itemRecordStatus = itemRecordStatus;
    appLayout.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    appLayout.filePickerMainImage = {
        isActive: true,
        backElement: "filePickerMainImage",
        filename: null,
        fileId: null,
        multiSelect: false
    };
    appLayout.changeState = function (state) {
        $state.go("index." + state);
    }
    appLayout.selectedItem = {};
    appLayout.selectedSourceId = $stateParams.sourceid;
    appLayout.selectedAppId = $stateParams.appid;
    appLayout.selectedAppTitle = $stateParams.apptitle;

    function findWithAttr(array, attr, value) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }
    appLayout.init = function () {
        if ($stateParams.sourceid == null)
            appLayout.changeState("applicationsource");
        appLayout.busyIndicator.isActive = true;
        if (appLayout.selectedSourceId != undefined || appLayout.selectedSourceId != null) {
            appLayout.gridOptions.advancedSearchData.engine.Filters.push({
                PropertyName: "LinkSourceId",
                SearchType: 0,
                IntValue1: appLayout.selectedSourceId
            });
        }
        ajax.call(cmsServerConfig.configApiServerPath + "applicationLayout/getall", appLayout.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            appLayout.busyIndicator.isActive = false;
            appLayout.ListItems = response.ListItems;



            ajax.call(cmsServerConfig.configApiServerPath + "applicationsource/getall", {}, 'POST').success(function (responseSource) {
                rashaErManage.checkAction(responseSource);
                appLayout.busyIndicator.isActive = false;
                appLayout.sourceListItems = responseSource.ListItems;
                for (var i = 0; i < appLayout.ListItems.length; i++) {
                    var fId = findWithAttr(appLayout.sourceListItems, 'Id', appLayout.ListItems[i].LinkSourceId)
                    if (fId >= 0)
                        appLayout.ListItems[i].virtual_Source = appLayout.sourceListItems[fId];
                }
            }).error(function (data, errCode, c, d) {
                appLayout.busyIndicator.isActive = false;
                console.log(data);
            });

            appLayout.gridOptions.fillData(appLayout.ListItems, response.resultAccess);
            appLayout.gridOptions.currentPageNumber = response.CurrentPageNumber;
            appLayout.gridOptions.totalRowCount = response.TotalRowCount;
            appLayout.gridOptions.rowPerPage = response.RowPerPage;
            appLayout.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            appLayout.busyIndicator.isActive = false;
            appLayout.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });

    }





    appLayout.autoAdd = function () {
        appLayout.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationLayout/autoadd', {
            LinkSourceId: appLayout.selectedSourceId
        }, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            appLayout.busyIndicator.isActive = false;
            appLayout.init();
        }).error(function (data, errCode, c, d) {
            1
            appLayout.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    appLayout.openEditModal = function () {
        if (appLayout.addRequested)
            return;
        appLayout.modalTitle = 'ویرایش';
        if (!appLayout.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        appLayout.busyIndicator.isActive = true;
        appLayout.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationLayout/GetOne', appLayout.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            appLayout.selectedItem = response.Item;

            var fId = findWithAttr(appLayout.sourceListItems, 'Id', appLayout.selectedItem.LinkSourceId)
            if (fId >= 0) {
                appLayout.selectedItem.virtual_Source = appLayout.sourceListItems[fId];
                appLayout.includeHtmlAdmin = 'cpanelv1/ModuleApplication/ConfigLayout/' + appLayout.selectedItem.virtual_Source.ClassName + '.' + appLayout.selectedItem.ClassName + '.Admin.html';
                appLayout.includeHtmlSite = 'cpanelv1/ModuleApplication/ConfigLayout/' + appLayout.selectedItem.virtual_Source.ClassName + '.' + appLayout.selectedItem.ClassName + '.Site.html';
            }

            appLayout.ConfigAdmin = $.parseJSON(appLayout.selectedItem.JsonFormAdminSystemValue);
            appLayout.ConfigSite = $.parseJSON(appLayout.selectedItem.JsonFormDefaultValue);


            appLayout.filePickerMainImage.filename = null;
            appLayout.filePickerMainImage.fileId = null;
            if (response.Item.LinkMainImageId != null) {
                ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", response.Item.LinkMainImageId, "GET")
                    .success(function (response2) {
                        buttonIsPressed = false;
                        appLayout.filePickerMainImage.filename = response2.Item.FileName;
                        appLayout.filePickerMainImage.fileId = response2.Item.Id;
                    })
                    .error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
            }
            //Set dataForTheTree
            appLayout.selectedNode = [];
            appLayout.expandedNodes = [];
            appLayout.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath + "FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                appLayout.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = {
                    Filters: [{
                        PropertyName: "LinkCategoryId",
                        SearchType: 0,
                        IntValue1: null,
                        IntValueForceNullSearch: true
                    }]
                };
                ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(appLayout.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (appLayout.selectedItem.LinkModuleFilePreviewImageId > 0)
                        appLayout.onSelection({
                            Id: appLayout.selectedItem.LinkModuleFilePreviewImageId
                        }, true);
                    appLayout.addRequested = false;
                    appLayout.busyIndicator.isActive = false;
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleApplication/ApplicationLayout/edit.html',
                        scope: $scope
                    });
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    appLayout.editRow = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        appLayout.busyIndicator.isActive = true;

        appLayout.selectedItem.JsonFormAdminSystemValue = $.trim(angular.toJson(appLayout.ConfigAdmin));
        appLayout.selectedItem.JsonFormDefaultValue = $.trim(angular.toJson(appLayout.ConfigSite));
        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationLayout/edit', appLayout.selectedItem, 'PUT').success(function (response) {
            appLayout.addRequested = true;
            rashaErManage.checkAction(response);
            appLayout.busyIndicator.isActive = false;
            if (response.IsSuccess) {



                appLayout.addRequested = false;
                appLayout.replaceItem(appLayout.selectedItem.Id, response.Item);
                appLayout.gridOptions.fillData(appLayout.ListItems);
                appLayout.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appLayout.addRequested = false;
        });
    }

    appLayout.closeModal = function () {
        $modalStack.dismissAll();
    };

    appLayout.replaceItem = function (oldId, newItem) {
        angular.forEach(appLayout.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = appLayout.ListItems.indexOf(item);
                appLayout.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            appLayout.ListItems.unshift(newItem);
    }

    appLayout.deleteRow = function () {
        if (!appLayout.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                appLayout.busyIndicator.isActive = true;
                console.log(appLayout.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationLayout/GetOne', appLayout.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    appLayout.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationLayout/delete', appLayout.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        appLayout.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            appLayout.replaceItem(appLayout.selectedItemForDelete.Id);
                            appLayout.gridOptions.fillData(appLayout.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        appLayout.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    appLayout.busyIndicator.isActive = false;

                });
            }
        });
    }

    appLayout.searchData = function () {
        appLayout.gridOptions.searchData();
    }

    appLayout.gridOptions = {
        columns: [{
                name: "Id",
                displayName: "کد سیستمی",
                sortable: true,
                type: "integer",
                visible: true
            },
            {
                name: 'LinkModuleFilePreviewImageId',
                displayName: 'عکس',
                sortable: true,
                visible: true,
                isThumbnail: true,
                heightImg: 300,
                widthImg: 250
            },
            {
                name: "Title",
                displayName: "عنوان",
                sortable: true,
                type: "string",
                visible: true
            },
            {
                name: "ClassName",
                displayName: "ClassName",
                sortable: true,
                type: "string",
                visible: true
            },
            {
                name: "virtual_Source.Title",
                displayName: "قالب",
                sortable: true,
                type: "string",
                displayForce: true,
                visible: true
            },
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

    appLayout.gridOptions.reGetAll = function () {
        appLayout.init();
    }

    appLayout.gridOptions.onRowSelected = function () {}

    appLayout.columnCheckbox = false;

    appLayout.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (appLayout.gridOptions.columnCheckbox) {
            for (var i = 0; i < appLayout.gridOptions.columns.length; i++) {
                var element = $("#" + appLayout.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                appLayout.gridOptions.columns[i].visible = element[0].checked;
            }
        } else {
            var prechangeColumns = appLayout.gridOptions.columns;
            for (var i = 0; i < appLayout.gridOptions.columns.length; i++) {
                appLayout.gridOptions.columns[i].visible = true;
                var element = $("#" + appLayout.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + appLayout.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < appLayout.gridOptions.columns.length; i++) {
            console.log(appLayout.gridOptions.columns[i].name.concat(".visible: "), appLayout.gridOptions.columns[i].visible);
        }
        appLayout.gridOptions.columnCheckbox = !appLayout.gridOptions.columnCheckbox;
    }






    appLayout.defaultValue = {};



    //TreeControl
    appLayout.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (appLayout.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    appLayout.onNodeToggle = function (node, expanded) {
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

    appLayout.onSelection = function (node, selected) {
        if (!selected) {
            appLayout.selectedItem.LinkModuleFilePreviewImageId = null;
            appLayout.selectedItem.previewImageSrc = null;
            return;
        }
        appLayout.selectedItem.LinkModuleFilePreviewImageId = node.Id;
        appLayout.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages + "loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", node.Id, "GET").success(function (response) {
            appLayout.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
    //upload file
    appLayout.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (appLayout.fileIsExist(uploadFile.name)) {
                // File already exists
                if (
                    confirm(
                        'File "' +
                        uploadFile.name +
                        '" already exists! Do you want to replace the new file?'
                    )
                ) {
                    //------------ appLayout.replaceFile(uploadFile.name);
                    appLayout.itemClicked(null, appLayout.fileIdToDelete, "file");
                    appLayout.fileTypes = 1;
                    appLayout.fileIdToDelete = appLayout.selectedIndex;
                    // replace the file
                    ajax
                        .call(
                            cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                            appLayout.fileIdToDelete,
                            "GET"
                        )
                        .success(function (response1) {
                            if (response1.IsSuccess == true) {
                                console.log(response1.Item);
                                ajax.call(cmsServerConfig.configApiServerPath + "FileContent/replace", response1.Item, "POST")
                                    .success(function (response2) {
                                        if (response2.IsSuccess == true) {
                                            appLayout.FileItem = response2.Item;
                                            appLayout.showSuccessIcon();
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-check");
                                            appLayout.filePickerMainImage.filename =
                                                appLayout.FileItem.FileName;
                                            appLayout.filePickerMainImage.fileId =
                                                response2.Item.Id;
                                            appLayout.selectedItem.LinkMainImageId =
                                                appLayout.filePickerMainImage.fileId;
                                        } else {
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-remove");
                                        }
                                    })
                                    .error(function (data) {
                                        appLayout.showErrorIcon();
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
                        appLayout.FileItem = response.Item;
                        appLayout.FileItem.FileName = uploadFile.name;
                        appLayout.FileItem.uploadName = uploadFile.uploadName;
                        appLayout.FileItem.Extension = uploadFile.name.split(".").pop();
                        appLayout.FileItem.FileSrc = uploadFile.name;
                        appLayout.FileItem.LinkCategoryId = null; //Save the new file in the root
                        // ------- appLayout.saveNewFile()  ----------------------
                        var result = 0;
                        ajax
                            .call(cmsServerConfig.configApiServerPath + "FileContent/add", appLayout.FileItem, "POST")
                            .success(function (response) {
                                if (response.IsSuccess) {
                                    appLayout.FileItem = response.Item;
                                    appLayout.showSuccessIcon();
                                    $("#save-icon" + index).removeClass("fa-save");
                                    $("#save-button" + index).removeClass("flashing-button");
                                    $("#save-icon" + index).addClass("fa-check");
                                    appLayout.filePickerMainImage.filename =
                                        appLayout.FileItem.FileName;
                                    appLayout.filePickerMainImage.fileId = response.Item.Id;
                                    appLayout.selectedItem.LinkMainImageId =
                                        appLayout.filePickerMainImage.fileId;
                                } else {
                                    $("#save-icon" + index).removeClass("fa-save");
                                    $("#save-button" + index).removeClass("flashing-button");
                                    $("#save-icon" + index).addClass("fa-remove");
                                }
                            })
                            .error(function (data) {
                                appLayout.showErrorIcon();
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
}]);