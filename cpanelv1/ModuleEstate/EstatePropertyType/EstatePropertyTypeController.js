app.controller("estatePropertyTypeController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$state', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $state, $window, $filter) {
    var estatePropertyType = this;
    estatePropertyType.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
 estatePropertyType.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    estatePropertyType.ListItems = [];
    estatePropertyType.selectUniversalMenuOnUndetectableKey = true;
    if (itemRecordStatus != undefined) estatePropertyType.itemRecordStatus = itemRecordStatus;

    estatePropertyType.init = function () {
        estatePropertyType.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"estatepropertytype/getall", estatePropertyType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            estatePropertyType.busyIndicator.isActive = false;
            estatePropertyType.ListItems = response.ListItems;
            estatePropertyType.gridOptions.fillData(estatePropertyType.ListItems, response.resultAccess);
            estatePropertyType.gridOptions.currentPageNumber = response.CurrentPageNumber;
            estatePropertyType.gridOptions.totalRowCount = response.TotalRowCount;
            estatePropertyType.gridOptions.rowPerPage = response.RowPerPage;
            estatePropertyType.allowedSearch = response.AllowedSearchField;

        }).error(function (data, errCode, c, d) {
            estatePropertyType.busyIndicator.isActive = false;
            estatePropertyType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    estatePropertyType.busyIndicator.isActive = true;
    estatePropertyType.addRequested = false;
    estatePropertyType.openAddModal = function () {
        estatePropertyType.filePickerMainImage.filename = "";
        estatePropertyType.filePickerMainImage.fileId = null;
        estatePropertyType.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'estatepropertytype/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            estatePropertyType.busyIndicator.isActive = false;
            estatePropertyType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleEstate/EstatePropertyType/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            estatePropertyType.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    estatePropertyType.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        estatePropertyType.busyIndicator.isActive = true;
        estatePropertyType.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'estatepropertytype/add', estatePropertyType.selectedItem, 'POST').success(function (response) {
            estatePropertyType.addRequested = false;
            estatePropertyType.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                estatePropertyType.ListItems.unshift(response.Item);
                estatePropertyType.gridOptions.fillData(estatePropertyType.ListItems);
                estatePropertyType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            estatePropertyType.busyIndicator.isActive = false;
            estatePropertyType.addRequested = false;
        });
    }

    estatePropertyType.openEditModal = function () {
        estatePropertyType.modalTitle = 'ویرایش';
        if (!estatePropertyType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'estatepropertytype/GetOne', estatePropertyType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            estatePropertyType.selectedItem = response.Item;
            estatePropertyType.filePickerMainImage.filename = null;
            estatePropertyType.filePickerMainImage.fileId = null;
            if (response.Item.LinkMainImageId != null) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', response.Item.LinkMainImageId, 'GET').success(function (response2) {
                    estatePropertyType.filePickerMainImage.filename = response2.Item.FileName;
                    estatePropertyType.filePickerMainImage.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            $modal.open({
                templateUrl: 'cpanelv1/ModuleEstate/EstatePropertyType/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    estatePropertyType.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        estatePropertyType.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'estatepropertytype/edit', estatePropertyType.selectedItem, 'PUT').success(function (response) {
            estatePropertyType.addRequested = true;
            rashaErManage.checkAction(response);
            estatePropertyType.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                estatePropertyType.addRequested = false;
                estatePropertyType.replaceItem(estatePropertyType.selectedItem.Id, response.Item);
                estatePropertyType.gridOptions.fillData(estatePropertyType.ListItems);
                estatePropertyType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            estatePropertyType.addRequested = false;
            estatePropertyType.busyIndicator.isActive = false;

        });
    }

    estatePropertyType.closeModal = function () {
        $modalStack.dismissAll();
    };

    estatePropertyType.replaceItem = function (oldId, newItem) {
        angular.forEach(estatePropertyType.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = estatePropertyType.ListItems.indexOf(item);
                estatePropertyType.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            estatePropertyType.ListItems.unshift(newItem);
    }

    estatePropertyType.deleteRow = function () {
        if (!estatePropertyType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                estatePropertyType.busyIndicator.isActive = true;
                console.log(estatePropertyType.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'estatepropertytype/GetOne', estatePropertyType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    estatePropertyType.selectedItemForDelete = response.Item;
                    console.log(estatePropertyType.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'estatepropertytype/delete', estatePropertyType.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        estatePropertyType.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            estatePropertyType.replaceItem(estatePropertyType.selectedItemForDelete.Id);
                            estatePropertyType.gridOptions.fillData(estatePropertyType.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        estatePropertyType.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    estatePropertyType.busyIndicator.isActive = false;

                });
            }
        });
    }

    estatePropertyType.searchData = function () {
        estatePropertyType.gridOptions.searchData();

    }

    estatePropertyType.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: true },
            { name: 'ActionButtons', displayName: 'خصوصیات ملک', sortable: true, type: 'string', visible: true, displayForce: true, template: '<button type="button" class="btn btn-primary" ng-click="estatePropertyType.goToDetails(x.Id)"  class="btn btn-primary"><i class="fa fa-plus-circle" aria-hidden="true"></i>&nbsp;خصوصیات</button>' }
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

    estatePropertyType.gridOptions.reGetAll = function () {
        estatePropertyType.init();
    }

    estatePropertyType.gridOptions.onRowSelected = function () {

    }

    estatePropertyType.columnCheckbox = false;
    estatePropertyType.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (estatePropertyType.gridOptions.columnCheckbox) {
            for (var i = 0; i < estatePropertyType.gridOptions.columns.length; i++) {
                //estatePropertyType.gridOptions.columns[i].visible = $("#" + estatePropertyType.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + estatePropertyType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                estatePropertyType.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = estatePropertyType.gridOptions.columns;
            for (var i = 0; i < estatePropertyType.gridOptions.columns.length; i++) {
                estatePropertyType.gridOptions.columns[i].visible = true;
                var element = $("#" + estatePropertyType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + estatePropertyType.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < estatePropertyType.gridOptions.columns.length; i++) {
            console.log(estatePropertyType.gridOptions.columns[i].name.concat(".visible: "), estatePropertyType.gridOptions.columns[i].visible);
        }
        estatePropertyType.gridOptions.columnCheckbox = !estatePropertyType.gridOptions.columnCheckbox;
    }

    estatePropertyType.goToDetails = function (proprtyId) {
        $state.go('index.estatepropertydetail', { propertyParam: proprtyId });
    }
    //Export Report 
    estatePropertyType.exportFile = function () {
        estatePropertyType.addRequested = true;
        estatePropertyType.gridOptions.advancedSearchData.engine.ExportFile = estatePropertyType.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'estatepropertytype/exportfile', estatePropertyType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            estatePropertyType.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                estatePropertyType.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //estatePropertyType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

estatePropertyType.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    estatePropertyType.filePickerMainImage.removeSelectedfile = function (config) {
        estatePropertyType.filePickerMainImage.fileId = null;
        estatePropertyType.filePickerMainImage.filename = null;
        estatePropertyType.selectedItem.LinkMainImageId = null;

    }
   //---------------Upload Modal-------------------------------
    estatePropertyType.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleService/estatePropertyType/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        estatePropertyType.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            estatePropertyType.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    estatePropertyType.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    estatePropertyType.whatcolor = function (progress) {
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

    estatePropertyType.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    estatePropertyType.replaceFile = function (name) {
        estatePropertyType.itemClicked(null, estatePropertyType.fileIdToDelete, "file");
        estatePropertyType.fileTypes = 1;
        estatePropertyType.fileIdToDelete = estatePropertyType.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", estatePropertyType.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                estatePropertyType.FileItem = response3.Item;
                                estatePropertyType.FileItem.FileName = name;
                                estatePropertyType.FileItem.Extension = name.split('.').pop();
                                estatePropertyType.FileItem.FileSrc = name;
                                estatePropertyType.FileItem.LinkCategoryId = estatePropertyType.thisCategory;
                                estatePropertyType.saveNewFile();
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
    estatePropertyType.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", estatePropertyType.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                estatePropertyType.FileItem = response.Item;
                estatePropertyType.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            estatePropertyType.showErrorIcon();
            return -1;
        });
    }

    estatePropertyType.showSuccessIcon = function () {
    }

    estatePropertyType.showErrorIcon = function () {
    }
    //file is exist
    estatePropertyType.fileIsExist = function (fileName) {
        for (var i = 0; i < estatePropertyType.FileList.length; i++) {
            if (estatePropertyType.FileList[i].FileName == fileName) {
                estatePropertyType.fileIdToDelete = estatePropertyType.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    estatePropertyType.getFileItem = function (id) {
        for (var i = 0; i < estatePropertyType.FileList.length; i++) {
            if (estatePropertyType.FileList[i].Id == id) {
                return estatePropertyType.FileList[i];
            }
        }
    }

    //select file or folder
    estatePropertyType.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            estatePropertyType.fileTypes = 1;
            estatePropertyType.selectedFileId = estatePropertyType.getFileItem(index).Id;
            estatePropertyType.selectedFileName = estatePropertyType.getFileItem(index).FileName;
        }
        else {
            estatePropertyType.fileTypes = 2;
            estatePropertyType.selectedCategoryId = estatePropertyType.getCategoryName(index).Id;
            estatePropertyType.selectedCategoryTitle = estatePropertyType.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        estatePropertyType.selectedIndex = index;

    };

    //upload file
    estatePropertyType.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (estatePropertyType.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ estatePropertyType.replaceFile(uploadFile.name);
                    estatePropertyType.itemClicked(null, estatePropertyType.fileIdToDelete, "file");
                    estatePropertyType.fileTypes = 1;
                    estatePropertyType.fileIdToDelete = estatePropertyType.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                estatePropertyType.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        estatePropertyType.FileItem = response2.Item;
                        estatePropertyType.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        estatePropertyType.filePickerMainImage.filename =
                          estatePropertyType.FileItem.FileName;
                        estatePropertyType.filePickerMainImage.fileId =
                          response2.Item.Id;
                        estatePropertyType.selectedItem.LinkMainImageId =
                          estatePropertyType.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      estatePropertyType.showErrorIcon();
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
                    estatePropertyType.FileItem = response.Item;
                    estatePropertyType.FileItem.FileName = uploadFile.name;
                    estatePropertyType.FileItem.uploadName = uploadFile.uploadName;
                    estatePropertyType.FileItem.Extension = uploadFile.name.split('.').pop();
                    estatePropertyType.FileItem.FileSrc = uploadFile.name;
                    estatePropertyType.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- estatePropertyType.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", estatePropertyType.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            estatePropertyType.FileItem = response.Item;
                            estatePropertyType.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            estatePropertyType.filePickerMainImage.filename = estatePropertyType.FileItem.FileName;
                            estatePropertyType.filePickerMainImage.fileId = response.Item.Id;
                            estatePropertyType.selectedItem.LinkMainImageId = estatePropertyType.filePickerMainImage.fileId;
                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        estatePropertyType.showErrorIcon();
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
    estatePropertyType.toggleExportForm = function () {
        estatePropertyType.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        estatePropertyType.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        estatePropertyType.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        estatePropertyType.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        estatePropertyType.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleEstate/EstatePropertyType/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    estatePropertyType.rowCountChanged = function () {
        if (!angular.isDefined(estatePropertyType.ExportFileClass.RowCount) || estatePropertyType.ExportFileClass.RowCount > 5000)
            estatePropertyType.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    estatePropertyType.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"estatepropertytype/count", estatePropertyType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            estatePropertyType.addRequested = false;
            rashaErManage.checkAction(response);
            estatePropertyType.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            estatePropertyType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

