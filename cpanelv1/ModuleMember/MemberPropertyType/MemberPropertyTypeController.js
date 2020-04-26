app.controller("memberPropertyTypeController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$state', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $state, $window, $filter) {
    var memberPropertyType = this;
    memberPropertyType.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
 memberPropertyType.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    memberPropertyType.ListItems = [];
    memberPropertyType.selectUniversalMenuOnUndetectableKey = true;
    if (itemRecordStatus != undefined) memberPropertyType.itemRecordStatus = itemRecordStatus;

    memberPropertyType.init = function () {
        memberPropertyType.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"memberpropertytype/getall", memberPropertyType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            memberPropertyType.busyIndicator.isActive = false;
            memberPropertyType.ListItems = response.ListItems;
            memberPropertyType.gridOptions.fillData(memberPropertyType.ListItems, response.resultAccess);
            memberPropertyType.gridOptions.currentPageNumber = response.CurrentPageNumber;
            memberPropertyType.gridOptions.totalRowCount = response.TotalRowCount;
            memberPropertyType.gridOptions.rowPerPage = response.RowPerPage;
            memberPropertyType.allowedSearch = response.AllowedSearchField;

        }).error(function (data, errCode, c, d) {
            memberPropertyType.busyIndicator.isActive = false;
            memberPropertyType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    memberPropertyType.busyIndicator.isActive = true;
    memberPropertyType.addRequested = false;
    memberPropertyType.openAddModal = function () {
        memberPropertyType.filePickerMainImage.filename = "";
        memberPropertyType.filePickerMainImage.fileId = null;
        memberPropertyType.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'memberpropertytype/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            memberPropertyType.busyIndicator.isActive = false;
            memberPropertyType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMember/MemberPropertyType/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberPropertyType.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    memberPropertyType.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        memberPropertyType.busyIndicator.isActive = true;
        memberPropertyType.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'memberpropertytype/add', memberPropertyType.selectedItem, 'POST').success(function (response) {
            memberPropertyType.addRequested = false;
            memberPropertyType.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                memberPropertyType.ListItems.unshift(response.Item);
                memberPropertyType.gridOptions.fillData(memberPropertyType.ListItems);
                memberPropertyType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberPropertyType.busyIndicator.isActive = false;
            memberPropertyType.addRequested = false;
        });
    }

    memberPropertyType.openEditModal = function () {
        memberPropertyType.modalTitle = 'ویرایش';
        if (!memberPropertyType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'memberpropertytype/GetOne', memberPropertyType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            memberPropertyType.selectedItem = response.Item;
            memberPropertyType.filePickerMainImage.filename = null;
            memberPropertyType.filePickerMainImage.fileId = null;
            if (response.Item.LinkMainImageId != null) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', response.Item.LinkMainImageId, 'GET').success(function (response2) {
                    memberPropertyType.filePickerMainImage.filename = response2.Item.FileName;
                    memberPropertyType.filePickerMainImage.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMember/MemberPropertyType/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    memberPropertyType.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        memberPropertyType.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'memberpropertytype/edit', memberPropertyType.selectedItem, 'PUT').success(function (response) {
            memberPropertyType.addRequested = true;
            rashaErManage.checkAction(response);
            memberPropertyType.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                memberPropertyType.addRequested = false;
                memberPropertyType.replaceItem(memberPropertyType.selectedItem.Id, response.Item);
                memberPropertyType.gridOptions.fillData(memberPropertyType.ListItems);
                memberPropertyType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberPropertyType.addRequested = false;
            memberPropertyType.busyIndicator.isActive = false;

        });
    }

    memberPropertyType.closeModal = function () {
        $modalStack.dismissAll();
    };

    memberPropertyType.replaceItem = function (oldId, newItem) {
        angular.forEach(memberPropertyType.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = memberPropertyType.ListItems.indexOf(item);
                memberPropertyType.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            memberPropertyType.ListItems.unshift(newItem);
    }

    memberPropertyType.deleteRow = function () {
        if (!memberPropertyType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                memberPropertyType.busyIndicator.isActive = true;
                console.log(memberPropertyType.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'memberpropertytype/GetOne', memberPropertyType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    memberPropertyType.selectedItemForDelete = response.Item;
                    console.log(memberPropertyType.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'memberpropertytype/delete', memberPropertyType.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        memberPropertyType.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            memberPropertyType.replaceItem(memberPropertyType.selectedItemForDelete.Id);
                            memberPropertyType.gridOptions.fillData(memberPropertyType.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        memberPropertyType.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    memberPropertyType.busyIndicator.isActive = false;

                });
            }
        });
    }

    memberPropertyType.searchData = function () {
        memberPropertyType.gridOptions.searchData();

    }

    memberPropertyType.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: true },
            { name: 'ActionButtons', displayName: 'خصوصیات اعضا', sortable: true, type: 'string', visible: true, displayForce: true, template: '<button type="button" class="btn btn-primary" ng-click="memberPropertyType.goToDetails(x.Id)"  class="btn btn-primary"><i class="fa fa-plus-circle" aria-hidden="true"></i>&nbsp;خصوصیات</button>' }
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

    memberPropertyType.gridOptions.reGetAll = function () {
        memberPropertyType.init();
    }

    memberPropertyType.gridOptions.onRowSelected = function () {

    }

    memberPropertyType.columnCheckbox = false;
    memberPropertyType.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (memberPropertyType.gridOptions.columnCheckbox) {
            for (var i = 0; i < memberPropertyType.gridOptions.columns.length; i++) {
                //memberPropertyType.gridOptions.columns[i].visible = $("#" + memberPropertyType.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + memberPropertyType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                memberPropertyType.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = memberPropertyType.gridOptions.columns;
            for (var i = 0; i < memberPropertyType.gridOptions.columns.length; i++) {
                memberPropertyType.gridOptions.columns[i].visible = true;
                var element = $("#" + memberPropertyType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + memberPropertyType.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < memberPropertyType.gridOptions.columns.length; i++) {
            console.log(memberPropertyType.gridOptions.columns[i].name.concat(".visible: "), memberPropertyType.gridOptions.columns[i].visible);
        }
        memberPropertyType.gridOptions.columnCheckbox = !memberPropertyType.gridOptions.columnCheckbox;
    }

    memberPropertyType.goToDetails = function (proprtyId) {
        $state.go('index.memberpropertydetail', { propertyParam: proprtyId });
    }
    //Export Report 
    memberPropertyType.exportFile = function () {
        memberPropertyType.addRequested = true;
        memberPropertyType.gridOptions.advancedSearchData.engine.ExportFile = memberPropertyType.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'memberpropertytype/exportfile', memberPropertyType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            memberPropertyType.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                memberPropertyType.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //memberPropertyType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

memberPropertyType.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    memberPropertyType.filePickerMainImage.removeSelectedfile = function (config) {
        memberPropertyType.filePickerMainImage.fileId = null;
        memberPropertyType.filePickerMainImage.filename = null;
        memberPropertyType.selectedItem.LinkMainImageId = null;

    }
   //---------------Upload Modal-------------------------------
    memberPropertyType.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleService/memberPropertyType/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        memberPropertyType.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            memberPropertyType.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    memberPropertyType.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    memberPropertyType.whatcolor = function (progress) {
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

    memberPropertyType.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    memberPropertyType.replaceFile = function (name) {
        memberPropertyType.itemClicked(null, memberPropertyType.fileIdToDelete, "file");
        memberPropertyType.fileTypes = 1;
        memberPropertyType.fileIdToDelete = memberPropertyType.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", memberPropertyType.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                memberPropertyType.FileItem = response3.Item;
                                memberPropertyType.FileItem.FileName = name;
                                memberPropertyType.FileItem.Extension = name.split('.').pop();
                                memberPropertyType.FileItem.FileSrc = name;
                                memberPropertyType.FileItem.LinkCategoryId = memberPropertyType.thisCategory;
                                memberPropertyType.saveNewFile();
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
    memberPropertyType.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", memberPropertyType.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                memberPropertyType.FileItem = response.Item;
                memberPropertyType.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            memberPropertyType.showErrorIcon();
            return -1;
        });
    }

    memberPropertyType.showSuccessIcon = function () {
    }

    memberPropertyType.showErrorIcon = function () {
    }
    //file is exist
    memberPropertyType.fileIsExist = function (fileName) {
        for (var i = 0; i < memberPropertyType.FileList.length; i++) {
            if (memberPropertyType.FileList[i].FileName == fileName) {
                memberPropertyType.fileIdToDelete = memberPropertyType.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    memberPropertyType.getFileItem = function (id) {
        for (var i = 0; i < memberPropertyType.FileList.length; i++) {
            if (memberPropertyType.FileList[i].Id == id) {
                return memberPropertyType.FileList[i];
            }
        }
    }

    //select file or folder
    memberPropertyType.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            memberPropertyType.fileTypes = 1;
            memberPropertyType.selectedFileId = memberPropertyType.getFileItem(index).Id;
            memberPropertyType.selectedFileName = memberPropertyType.getFileItem(index).FileName;
        }
        else {
            memberPropertyType.fileTypes = 2;
            memberPropertyType.selectedCategoryId = memberPropertyType.getCategoryName(index).Id;
            memberPropertyType.selectedCategoryTitle = memberPropertyType.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        memberPropertyType.selectedIndex = index;

    };

    //upload file
    memberPropertyType.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (memberPropertyType.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ memberPropertyType.replaceFile(uploadFile.name);
                    memberPropertyType.itemClicked(null, memberPropertyType.fileIdToDelete, "file");
                    memberPropertyType.fileTypes = 1;
                    memberPropertyType.fileIdToDelete = memberPropertyType.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                memberPropertyType.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        memberPropertyType.FileItem = response2.Item;
                        memberPropertyType.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        memberPropertyType.filePickerMainImage.filename =
                          memberPropertyType.FileItem.FileName;
                        memberPropertyType.filePickerMainImage.fileId =
                          response2.Item.Id;
                        memberPropertyType.selectedItem.LinkMainImageId =
                          memberPropertyType.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      memberPropertyType.showErrorIcon();
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
                    memberPropertyType.FileItem = response.Item;
                    memberPropertyType.FileItem.FileName = uploadFile.name;
                    memberPropertyType.FileItem.uploadName = uploadFile.uploadName;
                    memberPropertyType.FileItem.Extension = uploadFile.name.split('.').pop();
                    memberPropertyType.FileItem.FileSrc = uploadFile.name;
                    memberPropertyType.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- memberPropertyType.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", memberPropertyType.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            memberPropertyType.FileItem = response.Item;
                            memberPropertyType.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            memberPropertyType.filePickerMainImage.filename = memberPropertyType.FileItem.FileName;
                            memberPropertyType.filePickerMainImage.fileId = response.Item.Id;
                            memberPropertyType.selectedItem.LinkMainImageId = memberPropertyType.filePickerMainImage.fileId;
                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        memberPropertyType.showErrorIcon();
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
    memberPropertyType.toggleExportForm = function () {
        memberPropertyType.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        memberPropertyType.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        memberPropertyType.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        memberPropertyType.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        memberPropertyType.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleMember/MemberPropertyType/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    memberPropertyType.rowCountChanged = function () {
        if (!angular.isDefined(memberPropertyType.ExportFileClass.RowCount) || memberPropertyType.ExportFileClass.RowCount > 5000)
            memberPropertyType.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    memberPropertyType.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"memberpropertytype/count", memberPropertyType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            memberPropertyType.addRequested = false;
            rashaErManage.checkAction(response);
            memberPropertyType.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            memberPropertyType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

