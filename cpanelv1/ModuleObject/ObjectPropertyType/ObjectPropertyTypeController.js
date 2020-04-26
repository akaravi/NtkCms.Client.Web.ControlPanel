app.controller("objectPropertyTypeController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$state', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $state, $window, $filter) {
    var objectPropertyType = this;
    objectPropertyType.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
 objectPropertyType.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    objectPropertyType.ListItems = [];
    objectPropertyType.selectUniversalMenuOnUndetectableKey = true;
    if (itemRecordStatus != undefined) objectPropertyType.itemRecordStatus = itemRecordStatus;

    objectPropertyType.init = function () {
        objectPropertyType.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"objectpropertytype/getall", objectPropertyType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            objectPropertyType.busyIndicator.isActive = false;
            objectPropertyType.ListItems = response.ListItems;
            objectPropertyType.gridOptions.fillData(objectPropertyType.ListItems, response.resultAccess);
            objectPropertyType.gridOptions.currentPageNumber = response.CurrentPageNumber;
            objectPropertyType.gridOptions.totalRowCount = response.TotalRowCount;
            objectPropertyType.gridOptions.rowPerPage = response.RowPerPage;
            objectPropertyType.allowedSearch = response.AllowedSearchField;

        }).error(function (data, errCode, c, d) {
            objectPropertyType.busyIndicator.isActive = false;
            objectPropertyType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    objectPropertyType.busyIndicator.isActive = true;
    objectPropertyType.addRequested = false;
    objectPropertyType.openAddModal = function () {
        objectPropertyType.filePickerMainImage.filename = "";
        objectPropertyType.filePickerMainImage.fileId = null;
        objectPropertyType.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'objectpropertytype/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            objectPropertyType.busyIndicator.isActive = false;
            objectPropertyType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleobject/objectPropertyType/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            objectPropertyType.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    objectPropertyType.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        objectPropertyType.busyIndicator.isActive = true;
        objectPropertyType.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'objectpropertytype/add', objectPropertyType.selectedItem, 'POST').success(function (response) {
            objectPropertyType.addRequested = false;
            objectPropertyType.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                objectPropertyType.ListItems.unshift(response.Item);
                objectPropertyType.gridOptions.fillData(objectPropertyType.ListItems);
                objectPropertyType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            objectPropertyType.busyIndicator.isActive = false;
            objectPropertyType.addRequested = false;
        });
    }

    objectPropertyType.openEditModal = function () {
        objectPropertyType.modalTitle = 'ویرایش';
        if (!objectPropertyType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'objectpropertytype/GetOne', objectPropertyType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            objectPropertyType.selectedItem = response.Item;
            objectPropertyType.filePickerMainImage.filename = null;
            objectPropertyType.filePickerMainImage.fileId = null;
            if (response.Item.LinkMainImageId != null) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', response.Item.LinkMainImageId, 'GET').success(function (response2) {
                    objectPropertyType.filePickerMainImage.filename = response2.Item.FileName;
                    objectPropertyType.filePickerMainImage.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            $modal.open({
                templateUrl: 'cpanelv1/Moduleobject/objectPropertyType/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    objectPropertyType.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        objectPropertyType.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'objectpropertytype/edit', objectPropertyType.selectedItem, 'PUT').success(function (response) {
            objectPropertyType.addRequested = true;
            rashaErManage.checkAction(response);
            objectPropertyType.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                objectPropertyType.addRequested = false;
                objectPropertyType.replaceItem(objectPropertyType.selectedItem.Id, response.Item);
                objectPropertyType.gridOptions.fillData(objectPropertyType.ListItems);
                objectPropertyType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            objectPropertyType.addRequested = false;
            objectPropertyType.busyIndicator.isActive = false;

        });
    }

    objectPropertyType.closeModal = function () {
        $modalStack.dismissAll();
    };

    objectPropertyType.replaceItem = function (oldId, newItem) {
        angular.forEach(objectPropertyType.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = objectPropertyType.ListItems.indexOf(item);
                objectPropertyType.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            objectPropertyType.ListItems.unshift(newItem);
    }

    objectPropertyType.deleteRow = function () {
        if (!objectPropertyType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                objectPropertyType.busyIndicator.isActive = true;
                console.log(objectPropertyType.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'objectpropertytype/GetOne', objectPropertyType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    objectPropertyType.selectedItemForDelete = response.Item;
                    console.log(objectPropertyType.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'objectpropertytype/delete', objectPropertyType.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        objectPropertyType.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            objectPropertyType.replaceItem(objectPropertyType.selectedItemForDelete.Id);
                            objectPropertyType.gridOptions.fillData(objectPropertyType.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        objectPropertyType.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    objectPropertyType.busyIndicator.isActive = false;

                });
            }
        });
    }

    objectPropertyType.searchData = function () {
        objectPropertyType.gridOptions.searchData();

    }

    objectPropertyType.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: true },
            { name: 'ActionButtons', displayName: 'خصوصیات اعضا', sortable: true, type: 'string', visible: true, displayForce: true, template: '<button type="button" class="btn btn-primary" ng-click="objectPropertyType.goToDetails(x.Id)"  class="btn btn-primary"><i class="fa fa-plus-circle" aria-hidden="true"></i>&nbsp;خصوصیات</button>' }
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
                Filters: [],
                Count: false
            }
        }
    }

    objectPropertyType.gridOptions.reGetAll = function () {
        objectPropertyType.init();
    }

    objectPropertyType.gridOptions.onRowSelected = function () {

    }

    objectPropertyType.columnCheckbox = false;
    objectPropertyType.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (objectPropertyType.gridOptions.columnCheckbox) {
            for (var i = 0; i < objectPropertyType.gridOptions.columns.length; i++) {
                //objectPropertyType.gridOptions.columns[i].visible = $("#" + objectPropertyType.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + objectPropertyType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                objectPropertyType.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = objectPropertyType.gridOptions.columns;
            for (var i = 0; i < objectPropertyType.gridOptions.columns.length; i++) {
                objectPropertyType.gridOptions.columns[i].visible = true;
                var element = $("#" + objectPropertyType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + objectPropertyType.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < objectPropertyType.gridOptions.columns.length; i++) {
            console.log(objectPropertyType.gridOptions.columns[i].name.concat(".visible: "), objectPropertyType.gridOptions.columns[i].visible);
        }
        objectPropertyType.gridOptions.columnCheckbox = !objectPropertyType.gridOptions.columnCheckbox;
    }

    objectPropertyType.goToDetails = function (proprtyId) {
        $state.go('index.objectpropertydetail', { propertyParam: proprtyId });
    }
    //Export Report 
    objectPropertyType.exportFile = function () {
        objectPropertyType.addRequested = true;
        objectPropertyType.gridOptions.advancedSearchData.engine.ExportFile = objectPropertyType.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'objectpropertytype/exportfile', objectPropertyType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            objectPropertyType.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                objectPropertyType.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //objectPropertyType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

objectPropertyType.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    objectPropertyType.filePickerMainImage.removeSelectedfile = function (config) {
        objectPropertyType.filePickerMainImage.fileId = null;
        objectPropertyType.filePickerMainImage.filename = null;
        objectPropertyType.selectedItem.LinkMainImageId = null;

    }
   //---------------Upload Modal-------------------------------
    objectPropertyType.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleService/objectPropertyType/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        objectPropertyType.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            objectPropertyType.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    objectPropertyType.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    objectPropertyType.whatcolor = function (progress) {
        wdth = Math.floor(progress * 100);
        if (wdth >= 0 && wdth < 30) {
            return 'danger';
        } else if (wdth >= 30 && wdth < 50) {
            return 'warning';
        } else if (wdth >= 50 && wdth < 85) {
            return 'info';
        } else {
            return 'success';
        }
    }

    objectPropertyType.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    objectPropertyType.replaceFile = function (name) {
        objectPropertyType.itemClicked(null, objectPropertyType.fileIdToDelete, "file");
        objectPropertyType.fileTypes = 1;
        objectPropertyType.fileIdToDelete = objectPropertyType.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", objectPropertyType.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                objectPropertyType.FileItem = response3.Item;
                                objectPropertyType.FileItem.FileName = name;
                                objectPropertyType.FileItem.Extension = name.split('.').pop();
                                objectPropertyType.FileItem.FileSrc = name;
                                objectPropertyType.FileItem.LinkCategoryId = objectPropertyType.thisCategory;
                                objectPropertyType.saveNewFile();
                            }
                            else {
                                console.log("getting the model was not successfully returned!");
                            }
                        }).error(function (data) {
                            console.log(data);
                        });
                    }
                    else {
                        console.log("Request to api/CmsFileContent/delete was not successfully returned!");
                    }
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }
        }).error(function (data) {
            console.log(data);
        });
    }
    //save new file
    objectPropertyType.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", objectPropertyType.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                objectPropertyType.FileItem = response.Item;
                objectPropertyType.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            objectPropertyType.showErrorIcon();
            return -1;
        });
    }

    objectPropertyType.showSuccessIcon = function () {
    }

    objectPropertyType.showErrorIcon = function () {
    }
    //file is exist
    objectPropertyType.fileIsExist = function (fileName) {
        for (var i = 0; i < objectPropertyType.FileList.length; i++) {
            if (objectPropertyType.FileList[i].FileName == fileName) {
                objectPropertyType.fileIdToDelete = objectPropertyType.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    objectPropertyType.getFileItem = function (id) {
        for (var i = 0; i < objectPropertyType.FileList.length; i++) {
            if (objectPropertyType.FileList[i].Id == id) {
                return objectPropertyType.FileList[i];
            }
        }
    }

    //select file or folder
    objectPropertyType.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            objectPropertyType.fileTypes = 1;
            objectPropertyType.selectedFileId = objectPropertyType.getFileItem(index).Id;
            objectPropertyType.selectedFileName = objectPropertyType.getFileItem(index).FileName;
        }
        else {
            objectPropertyType.fileTypes = 2;
            objectPropertyType.selectedCategoryId = objectPropertyType.getCategoryName(index).Id;
            objectPropertyType.selectedCategoryTitle = objectPropertyType.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        objectPropertyType.selectedIndex = index;

    };

    //upload file
    objectPropertyType.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (objectPropertyType.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ objectPropertyType.replaceFile(uploadFile.name);
                    objectPropertyType.itemClicked(null, objectPropertyType.fileIdToDelete, "file");
                    objectPropertyType.fileTypes = 1;
                    objectPropertyType.fileIdToDelete = objectPropertyType.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                objectPropertyType.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        objectPropertyType.FileItem = response2.Item;
                        objectPropertyType.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        objectPropertyType.filePickerMainImage.filename =
                          objectPropertyType.FileItem.FileName;
                        objectPropertyType.filePickerMainImage.fileId =
                          response2.Item.Id;
                        objectPropertyType.selectedItem.LinkMainImageId =
                          objectPropertyType.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      objectPropertyType.showErrorIcon();
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
            }
            else { // File does not exists
                // Save New file
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response) {
                    objectPropertyType.FileItem = response.Item;
                    objectPropertyType.FileItem.FileName = uploadFile.name;
                    objectPropertyType.FileItem.uploadName = uploadFile.uploadName;
                    objectPropertyType.FileItem.Extension = uploadFile.name.split('.').pop();
                    objectPropertyType.FileItem.FileSrc = uploadFile.name;
                    objectPropertyType.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- objectPropertyType.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", objectPropertyType.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            objectPropertyType.FileItem = response.Item;
                            objectPropertyType.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            objectPropertyType.filePickerMainImage.filename = objectPropertyType.FileItem.FileName;
                            objectPropertyType.filePickerMainImage.fileId = response.Item.Id;
                            objectPropertyType.selectedItem.LinkMainImageId = objectPropertyType.filePickerMainImage.fileId;
                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        objectPropertyType.showErrorIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass("flashing-button");
                        $("#save-icon" + index).addClass("fa-remove");
                    });
                    //-----------------------------------
                }).error(function (data) {
                    console.log(data);
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-remove");
                });
            }
        }
    }
    //End of Upload Modal-----------------------------------------
    //Open Export Report Modal
    objectPropertyType.toggleExportForm = function () {
        objectPropertyType.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        objectPropertyType.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        objectPropertyType.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        objectPropertyType.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        objectPropertyType.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/Moduleobject/objectPropertyType/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    objectPropertyType.rowCountChanged = function () {
        if (!angular.isDefined(objectPropertyType.ExportFileClass.RowCount) || objectPropertyType.ExportFileClass.RowCount > 5000)
            objectPropertyType.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    objectPropertyType.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"objectpropertytype/count", objectPropertyType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            objectPropertyType.addRequested = false;
            rashaErManage.checkAction(response);
            objectPropertyType.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            objectPropertyType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

