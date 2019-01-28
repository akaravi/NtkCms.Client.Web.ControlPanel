app.controller("mobileAppSourceController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$state', '$builder', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $state, $builder, $filter) {
    var appSource = this;
    appSource.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
   appSource.filePickerMainImage = {
      isActive: true,
      backElement: "filePickerMainImage",
      filename: null,
      fileId: null,
      multiSelect: false
    };
    appSource.UninversalMenus = [];
    appSource.selectUniversalMenuOnUndetectableKey = true;
    if (itemRecordStatus != undefined) appSource.itemRecordStatus = itemRecordStatus;

    appSource.init = function () {
        appSource.busyIndicator.isActive = true;
        ajax.call(mainPathApi+"MobileAppSource/getall", appSource.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            appSource.busyIndicator.isActive = false;
            appSource.ListItems = response.ListItems;
            appSource.gridOptions.fillData(appSource.ListItems, response.resultAccess);
            appSource.gridOptions.currentPageNumber = response.CurrentPageNumber;
            appSource.gridOptions.totalRowCount = response.TotalRowCount;
            appSource.gridOptions.rowPerPage = response.RowPerPage;
            appSource.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            appSource.busyIndicator.isActive = false;
            appSource.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    appSource.busyIndicator.isActive = true;
    appSource.addRequested = false;
    appSource.openAddModal = function () {
        if (buttonIsPressed) return;
        appSource.filePickerMainImage.filename = "";
        appSource.filePickerMainImage.fileId = null;
        appSource.modalTitle = 'اضافه';
        buttonIsPressed = true;
        ajax.call(mainPathApi+'MobileAppSource/getviewmodel', "0", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            appSource.busyIndicator.isActive = false;
            appSource.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMobileApp/MobileAppSource/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appSource.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    appSource.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        appSource.busyIndicator.isActive = true;
        appSource.addRequested = true;
        ajax.call(mainPathApi+'MobileAppSource/add', appSource.selectedItem, 'POST').success(function (response) {
            appSource.addRequested = false;
            appSource.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                appSource.ListItems.unshift(response.Item);
                appSource.gridOptions.fillData(appSource.ListItems);
                appSource.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appSource.busyIndicator.isActive = false;
            appSource.addRequested = false;
        });
    }

    appSource.autoAdd = function () {
        ajax.call(mainPathApi+'MobileAppSource/autoadd', '', 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            appSource.init();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    appSource.openEditModal = function () {
        if (buttonIsPressed) return;
        appSource.modalTitle = 'ویرایش';
        if (!appSource.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(mainPathApi+'MobileAppSource/getviewmodel', appSource.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            appSource.selectedItem = response.Item;
          appSource.filePickerMainImage.filename = null;
          appSource.filePickerMainImage.fileId = null;
         if (response.Item.LinkMainImageId != null) {
            ajax
              .call(
                mainPathApi+"CmsFileContent/getviewmodel",
                response.Item.LinkMainImageId,
                "GET"
              )
              .success(function(response2) {
                buttonIsPressed = false;
                appSource.filePickerMainImage.filename =
                  response2.Item.FileName;
                appSource.filePickerMainImage.fileId = response2.Item.Id;
              })
              .error(function(data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
              });
          }

            $modal.open({
                templateUrl: 'cpanelv1/ModuleMobileApp/MobileAppSource/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    appSource.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        appSource.addRequested = true;
        appSource.busyIndicator.isActive = true;
        ajax.call(mainPathApi+'MobileAppSource/edit', appSource.selectedItem, 'PUT').success(function (response) {
            rashaErManage.checkAction(response);
            appSource.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                appSource.addRequested = false;
                appSource.replaceItem(appSource.selectedItem.Id, response.Item);
                appSource.gridOptions.fillData(appSource.ListItems);
                appSource.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appSource.addRequested = false;
            appSource.busyIndicator.isActive = false;
        });
    }

    appSource.closeModal = function () {
        $modalStack.dismissAll();
    };

    appSource.replaceItem = function (oldId, newItem) {
        angular.forEach(appSource.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = appSource.ListItems.indexOf(item);
                appSource.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            appSource.ListItems.unshift(newItem);
    }

    appSource.deleteRow = function () {
        if (!appSource.gridOptions.selectedRow.item) {
            if (buttonIsPressed) return;
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                appSource.busyIndicator.isActive = true;
                buttonIsPressed = true;
                ajax.call(mainPathApi+'MobileAppSource/getviewmodel', appSource.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    appSource.selectedItemForDelete = response.Item;
                    ajax.call(mainPathApi+'MobileAppSource/delete', appSource.selectedItemForDelete, 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        appSource.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            appSource.replaceItem(appSource.selectedItemForDelete.Id);
                            appSource.gridOptions.fillData(appSource.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        appSource.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    appSource.busyIndicator.isActive = false;
                });
            }
        });
    }

    appSource.searchData = function () {
        appSource.gridOptions.searchData();
    }

    appSource.gridOptions = {
        columns: [
            { name: "Id", displayName: "کد سیستمی", sortable: true, type: "integer", visible: true },
            { name: "Title", displayName: "عنوان", sortable: true, type: "string", visible: true },
            { name: "ClassName", displayName: "ClassName", sortable: true, type: "string", visible: true },
            { name: "ActionButton", displayName: "تنظیمات پیش فرض مدیر سامانه", sortable: true, displayForce: true, visible: true, template: "<button class=\"btn btn-success\" ng-click=\"appSource.openAdminBuildSettings(x.Id)\" type=\"button\"><i class=\"fa fa-cog\" aria-hidden=\"true\"></i></button>" },
            { name: "ActionButton", displayName: "تنظیمات پیش فرض کاربر", sortable: true, displayForce: true, template: "<button class=\"btn btn-info\" ng-click=\"appSource.openUserBuildSettings(x.Id)\" type=\"button\"><i class=\"fa fa-cog\" aria-hidden=\"true\"></i></button>" },
            { name: "ActionButton", displayName: "صفحات", sortable: false, displayForce: true, template: "<button class=\"btn btn-warning\" ng-click=\"appSource.changeState('mobileapplayout', x)\" title=\"طراحی به صفحات\" type=\"button\"><i class=\"fa fa-file-text-o\" aria-hidden=\"true\"></i></button>" },
            { name: "ActionBuildApkButton", displayName: "ساخت Apk", sortable: false, displayForce: true, template: "<button class=\"btn btn-success\" ng-click=\"appSource.buildApp(x)\" title=\"ارسال دستور ساخت اپلیکیشن تمام برنامه های این نوع سورس\" type=\"button\"><i class=\"fa fa-cog\" aria-hidden=\"true\"></i></button>" },
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

    appSource.gridOptions.reGetAll = function () {
        appSource.init();
    }

    appSource.gridOptions.onRowSelected = function () {

    }

    appSource.columnCheckbox = false;

    appSource.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (appSource.gridOptions.columnCheckbox) {
            for (var i = 0; i < appSource.gridOptions.columns.length; i++) {
                var element = $("#" + appSource.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                appSource.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = appSource.gridOptions.columns;
            for (var i = 0; i < appSource.gridOptions.columns.length; i++) {
                appSource.gridOptions.columns[i].visible = true;
                var element = $("#" + appSource.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + appSource.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < appSource.gridOptions.columns.length; i++) {
            console.log(appSource.gridOptions.columns[i].name.concat(".visible: "), appSource.gridOptions.columns[i].visible);
        }
        appSource.gridOptions.columnCheckbox = !appSource.gridOptions.columnCheckbox;
    }

    appSource.changeState = function (state, source) {
        $state.go("index." + state, { sourceid: source.Id });
    }

    appSource.buildApp = function (source) {
        rashaErManage.showMessage("دستور برای سرور ارسال شد");
        ajax.call(mainPathApi+'MobileAppSource/buildApp', source.Id, 'GET').success(function (response) {
            rashaErManage.showMessage(response.ErrorMessage);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    appSource.saveSubmitValues = function () {
        appSource.addRequested = true;
        appSource.busyIndicator.isActive = true;
        appSource.selectedItem[appSource.selectedConfig] = $.trim(angular.toJson(appSource.submitValue));
        ajax.call(mainPathApi+'MobileAppSource/edit', appSource.selectedItem, 'PUT').success(function (response) {
            rashaErManage.checkAction(response);
            appSource.addRequested = false;
            appSource.busyIndicator.isActive = false;
            appSource.closeModal();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appSource.addRequested = false;
            appSource.busyIndicator.isActive = false;

        });
    }

    appSource.openAdminBuildSettings = function (id) {
        appSource.selectedConfig = "DefaultAdminConfigJsonValues";
        appSource.defaultValue = [];
        ajax.call(mainPathApi+'MobileAppSource/getviewmodel', id, 'GET').success(function (response) {
            if (response.IsSuccess) {
                appSource.selectedItem = response.Item;
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
                            if (response.Item[appSource.selectedConfig] != null && response.Item[appSource.selectedConfig] != "") {
                                values = $.parseJSON(response.Item[appSource.selectedConfig]);
                                $.each(values, function (iValue, itemValue) {
                                    if (item.FieldName == itemValue.fieldname) {
                                        $builder.forms.default[i].id = i;
                                        appSource.defaultValue[i] = itemValue.value;
                                    }
                                });
                            }
                        }
                    });
                }
            }
            appSource.busyIndicator.isActive = false;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMobileApp/MobileAppSource/preview.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    appSource.openUserBuildSettings = function (id) {
        appSource.selectedConfig = "DefaultUserConfigJsonValues";
        appSource.defaultValue = [];
        ajax.call(mainPathApi+'MobileAppSource/getviewmodel', id, 'GET').success(function (response) {
            if (response.IsSuccess) {
                appSource.selectedItem = response.Item;
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
                            if (response.Item[appSource.selectedConfig] != null && response.Item[appSource.selectedConfig] != "") {
                                values = $.parseJSON(response.Item[appSource.selectedConfig]);
                                $.each(values, function (iValue, itemValue) {
                                    if (item.FieldName == itemValue.fieldname) {
                                        $builder.forms.default[i].id = i;
                                        appSource.defaultValue[i] = itemValue.value;
                                    }
                                });
                            }
                        }
                    });
                }
            }
            appSource.busyIndicator.isActive = false;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMobileApp/MobileAppSource/preview.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
//upload file
    appSource.uploadFile = function (index, uploadFile) {
      if ($("#save-icon" + index).hasClass("fa-save")) {
          if (appSource.fileIsExist(uploadFile.name)) {
          // File already exists
          if (
            confirm(
              'File "' +
                uploadFile.name +
                '" already exists! Do you want to replace the new file?'
            )
          ) {
            //------------ appSource.replaceFile(uploadFile.name);
            appSource.itemClicked(null, appSource.fileIdToDelete, "file");
            appSource.fileTypes = 1;
            appSource.fileIdToDelete = appSource.selectedIndex;
             // replace the file
            ajax
              .call(
                mainPathApi+"CmsFileContent/getviewmodel",
                appSource.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(mainPathApi+"CmsFileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        appSource.FileItem = response2.Item;
                        appSource.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        appSource.filePickerMainImage.filename =
                          appSource.FileItem.FileName;
                        appSource.filePickerMainImage.fileId =
                          response2.Item.Id;
                        appSource.selectedItem.LinkMainImageId =
                          appSource.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      appSource.showErrorIcon();
                      $("#save-icon" + index).removeClass("fa-save");
                      $("#save-button" + index).removeClass("flashing-button");
                      $("#save-icon" + index).addClass("fa-remove");
                    });
                  //-----------------------------------
                }
              })
              .error(function(data) {
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
            .success(function(response) {
              appSource.FileItem = response.Item;
                appSource.FileItem.FileName = uploadFile.name;
                appSource.FileItem.uploadName = uploadFile.uploadName;
                appSource.FileItem.Extension = uploadFile.name.split(".").pop();
                appSource.FileItem.FileSrc = uploadFile.name;
              appSource.FileItem.LinkCategoryId = null; //Save the new file in the root
              // ------- appSource.saveNewFile()  ----------------------
              var result = 0;
              ajax
                .call(mainPathApi + "CmsFileContent/add", appSource.FileItem, "POST")
                .success(function(response) {
                  if (response.IsSuccess) {
                    appSource.FileItem = response.Item;
                    appSource.showSuccessIcon();
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-check");
                    appSource.filePickerMainImage.filename =
                      appSource.FileItem.FileName;
                    appSource.filePickerMainImage.fileId = response.Item.Id;
                    appSource.selectedItem.LinkMainImageId =
                      appSource.filePickerMainImage.fileId;
                  } else {
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-remove");
                  }
                })
                .error(function(data) {
                  appSource.showErrorIcon();
                  $("#save-icon" + index).removeClass("fa-save");
                  $("#save-button" + index).removeClass("flashing-button");
                  $("#save-icon" + index).addClass("fa-remove");
                });
              //-----------------------------------
            })
            .error(function(data) {
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

