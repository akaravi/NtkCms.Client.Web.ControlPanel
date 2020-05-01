app.controller("cmsUserController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', "$rootScope", '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $rootScope, $filter) {
    var cmsUser = this;
    if (itemRecordStatus != undefined) cmsUser.itemRecordStatus = itemRecordStatus;
    var date = moment().format();
    var one_year = moment().add(1, "years").format();
    cmsUser.ExpireDate = {
        defaultDate: date
    }
    cmsUser.attachedFiles = [];
    cmsUser.attachedFile = "";

    cmsUser.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }

    cmsUser.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    cmsUser.init = function () {

        ajax.call(cmsServerConfig.configApiServerPath+"CoreEnum/EnumGender", {}, 'GET').success(function (response) {
            cmsUser.Gender = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"CoreUser/getall", cmsUser.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsUser.ListItems = response.ListItems;
            cmsUser.gridOptions.fillData(cmsUser.ListItems, response.resultAccess);
            cmsUser.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsUser.gridOptions.totalRowCount = response.TotalRowCount;
            cmsUser.gridOptions.rowPerPage = response.RowPerPage;
            cmsUser.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            cmsUser.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsUser.addRequested = false;
    cmsUser.openAddModal = function () {
        if (buttonIsPressed) { return };
        cmsUser.modalTitle = 'اضافه';
        cmsUser.attachedFiles = [];
        cmsUser.attachedFile = "";
        cmsUser.filePickerMainImage.filename = "";
        cmsUser.filePickerMainImage.fileId = null;
        cmsUser.filePickerFiles.filename = "";
        cmsUser.filePickerFiles.fileId = null;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/GetViewModel', '', 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            cmsUser.selectedItem = response.Item;
            cmsUser.ExpireDate.defaultDate = one_year;
            cmsUser.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsUser/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    var emailRegEx = /^\w+(?:\.\w+)*@\w+(?:\.\w+)+$/;  //Regex to validate Email e.g. info@user.oco.ir
    cmsUser.addNewRow = function (frm) {
        if (frm.$invalid)
            return;
        if (!emailRegEx.test(cmsUser.selectedItem.Username)) {   //Validate Username
            rashaErManage.showMessage($filter('translatentk')('Email_Format_Is_Not_Correct'));
            return;
        }
        //Save attached file ids into cmsUser.selectedItem.LinkFileIds
        cmsUser.selectedItem.LinkFileIds = "";
        cmsUser.stringfyLinkFileIds();
        cmsUser.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/add', cmsUser.selectedItem, 'POST').success(function (response) {
            cmsUser.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsUser.ListItems.unshift(response.Item);
                cmsUser.gridOptions.fillData(cmsUser.ListItems);
                cmsUser.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsUser.addRequested = false;
        });
    }

    // Open Edit Content Modal
    cmsUser.openEditModal = function () {
        if (buttonIsPressed) { return };
        cmsUser.modalTitle = 'ویرایش';
        if (!cmsUser.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/GetOne', cmsUser.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            cmsUser.selectedItem = response.Item;
            cmsUser.ExpireDate.defaultDate = cmsUser.selectedItem.ExpireDate;
            cmsUser.selectedItem.Pwd = "";
            cmsUser.filePickerMainImage.filename = null;
            cmsUser.filePickerMainImage.fileId = null;
            if (response.Item.LinkMainImageId != null) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', response.Item.LinkMainImageId, 'GET').success(function (response2) {
                    cmsUser.filePickerMainImage.filename = response2.Item.FileName;
                    cmsUser.filePickerMainImage.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            cmsUser.parseFileIds(response.Item.LinkFileIds);
            cmsUser.filePickerFiles.filename = null;
            cmsUser.filePickerFiles.fileId = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsUser/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsUser.editRow = function (frm) {
        if (frm.$invalid)
            return;
        if (cmsUser.selectedItem.Username != 'admin' && !emailRegEx.test(cmsUser.selectedItem.Username)) {   //Validate Username
            rashaErManage.showMessage($filter('translatentk')('Email_Format_Is_Not_Correct'));
            return;
        }
        cmsUser.buttonIsPressed = true;
        cmsUser.addRequested = true;
        //Save attached file ids into cmsUser.selectedItem.LinkFileIds
        cmsUser.selectedItem.LinkFileIds = "";
        cmsUser.stringfyLinkFileIds();
        ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/edit', cmsUser.selectedItem, 'PUT').success(function (response) {
            buttonIsPressed = false;
            cmsUser.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsUser.replaceItem(cmsUser.selectedItem.Id, response.Item);
                cmsUser.gridOptions.fillData(cmsUser.ListItems);
                cmsUser.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsUser.addRequested = false;
        });
    }

    cmsUser.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsUser.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsUser.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsUser.ListItems.indexOf(item);
                cmsUser.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsUser.ListItems.unshift(newItem);
    }

    cmsUser.deleteRow = function () {
        if (buttonIsPressed) { return };

        if (!cmsUser.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(cmsUser.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                cmsUser.addRequested = true;
                ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/GetOne', cmsUser.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    cmsUser.selectedItemForDelete = response.Item;
                    console.log(cmsUser.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/delete', cmsUser.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        cmsUser.addRequested = false;
                        if (res.IsSuccess) {
                            cmsUser.replaceItem(cmsUser.selectedItemForDelete.Id);
                            cmsUser.gridOptions.fillData(cmsUser.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });
    }
    cmsUser.LinkLocationIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkLocationId',
        url: 'CmsLocation',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'LinkLocationId',
        rowPerPage: 200,
        action: 'GetAllCities',
        scope: cmsUser,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'virtual_Parent.Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
                { name: 'Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
            ]
        }
    }
    cmsUser.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Username', displayName: 'نام کاربری', sortable: true, type: 'string' },
            { name: 'Name', displayName: 'نام', sortable: true, type: 'string' },
            { name: 'LastName', displayName: 'نام خانوادگی', sortable: true, type: 'string' },
            { name: 'Address', displayName: 'آدرس', sortable: true, type: 'string' },
            { name: 'Tell', displayName: 'تلفن تماس', sortable: true, type: 'string' },
            { name: 'ExpireDate', displayName: 'تاریخ انقضا', sortable: true, isDate: true, type: 'date' },
            { name: 'ExpireLockAccount', displayName: 'ممنوعیت ورود', sortable: true, isDate: true, type: 'date' },
            { name: "ActionKey", displayName: 'ورود به حساب', displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="cmsUser.logintoCp(x.Id)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
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
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: [],
                Count: false
            }
        }
    }

    cmsUser.gridOptions.reGetAll = function () {
        cmsUser.init();
    }

    cmsUser.gridOptions.onRowSelected = function () { }
    //log in to Cp
    cmsUser.logintoCp = function (SelectedUserId) {

        if (SelectedUserId == undefined || SelectedUserId == 'undefined') {
            rashaErManage.showMessage($filter('translatentk')('User_Not_Selected'));
            return;
        }

        var oldSelectedUserId = 0;
        var oderShowAllDataStatus = false;
        var oderShowProfessionalDataStatus = false;

        if ($rootScope.tokenInfo != undefined || $rootScope.tokenInfo==null || $rootScope.tokenInfo.token==undefined) {
            oldSelectedUserId = $rootScope.tokenInfo.Item.LinkUserId;
            oderShowAllDataStatus = $rootScope.tokenInfo.Item.UserAccessAdminAllowToAllData;
            oderShowProfessionalDataStatus = $rootScope.tokenInfo.Item.UserAccessAdminAllowToProfessionalData;
        }
        if (oldSelectedUserId == SelectedUserId) {
            rashaErManage.showMessage($filter('translatentk')('You_Are_Currently_Working_On_This_User'));
            return;
        }


        //if (!Silent)
        //    rashaErManage.showMessage("دستور تغییر دسترسی به سرور ارسال گردید..");
        ajax.call(cmsServerConfig.configApiServerPath+"Auth/RenewToken/", { Userid: SelectedUserId, UserAccessAdminAllowToAllData: oderShowAllDataStatus, UserAccessAdminAllowToProfessionalData: oderShowProfessionalDataStatus, lang: $rootScope.tokenInfo.UserLanguage }, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            $rootScope.tokenInfo = response;

            $rootScope.infoDomainAddress = "http://" + $rootScope.tokenInfo.Item.Domain + "/";
            if ($rootScope.tokenInfo.Item.SubDomain && $rootScope.tokenInfo.Item.SubDomain.length > 0)
                $rootScope.infoDomainAddress = "http://" + $rootScope.tokenInfo.Item.SubDomain + "." + $rootScope.tokenInfo.Item.Domain + "/";

            localStorage.setItem("userGlobaltoken", response.token);
            
            $state.reload();

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });

    }

//#help//
    cmsUser.loadFileAndFolder = function (item) {
        cmsUser.treeConfig.currentNode = item;
        console.log(item);
        cmsUser.treeConfig.onNodeSelect(item);
    }
    cmsUser.deleteAttachedFile = function (index) {
        cmsUser.attachedFiles.splice(index, 1);
    }

    cmsUser.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !cmsUser.alreadyExist(id, cmsUser.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = {
                id: fId, name: fname
            };
            cmsUser.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    cmsUser.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    cmsUser.filePickerMainImage.removeSelectedfile = function (config) {
        cmsUser.filePickerMainImage.fileId = null;
        cmsUser.filePickerMainImage.filename = null;
        cmsUser.selectedItem.LinkMainImageId = null;

    }

    cmsUser.filePickerFiles.removeSelectedfile = function (config) {
        cmsUser.filePickerFiles.fileId = null;
        cmsUser.filePickerFiles.filename = null;
        cmsUser.selectedItem.LinkFileIds = null;
    }


    cmsUser.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }

    // ----------- FilePicker Codes --------------------------------
    cmsUser.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !cmsUser.alreadyExist(id, cmsUser.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            cmsUser.attachedFiles.push(file);
            cmsUser.clearfilePickers();
        }
    }

    cmsUser.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                cmsUser.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    cmsUser.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;   //String is empty or whitespace then return
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            cmsUser.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    cmsUser.clearfilePickers = function () {
        cmsUser.filePickerFiles.fileId = null;
        cmsUser.filePickerFiles.filename = null;
    }

    cmsUser.stringfyLinkFileIds = function () {
        $.each(cmsUser.attachedFiles, function (i, item) {
            if (cmsUser.selectedItem.LinkFileIds == "")
                cmsUser.selectedItem.LinkFileIds = item.fileId;
            else
                cmsUser.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    cmsUser.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleBiography/cmsUser/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        cmsUser.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            cmsUser.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    cmsUser.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    cmsUser.whatcolor = function (progress) {
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

    cmsUser.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    cmsUser.replaceFile = function (name) {
        cmsUser.itemClicked(null, cmsUser.fileIdToDelete, "file");
        cmsUser.fileTypes = 1;
        cmsUser.fileIdToDelete = cmsUser.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", cmsUser.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    cmsUser.remove(cmsUser.FileList, cmsUser.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                cmsUser.FileItem = response3.Item;
                                cmsUser.FileItem.FileName = name;
                                cmsUser.FileItem.Extension = name.split('.').pop();
                                cmsUser.FileItem.FileSrc = name;
                                cmsUser.FileItem.LinkCategoryId = cmsUser.thisCategory;
                                cmsUser.saveNewFile();
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
    cmsUser.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", cmsUser.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                cmsUser.FileItem = response.Item;
                cmsUser.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            cmsUser.showErrorIcon();
            return -1;
        });
    }

    cmsUser.showSuccessIcon = function () {
    }

    cmsUser.showErrorIcon = function () {

    }
    //file is exist
    cmsUser.fileIsExist = function (fileName) {
        for (var i = 0; i < cmsUser.FileList.length; i++) {
            if (cmsUser.FileList[i].FileName == fileName) {
                cmsUser.fileIdToDelete = cmsUser.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    cmsUser.getFileItem = function (id) {
        for (var i = 0; i < cmsUser.FileList.length; i++) {
            if (cmsUser.FileList[i].Id == id) {
                return cmsUser.FileList[i];
            }
        }
    }

    //select file or folder
    cmsUser.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            cmsUser.fileTypes = 1;
            cmsUser.selectedFileId = cmsUser.getFileItem(index).Id;
            cmsUser.selectedFileName = cmsUser.getFileItem(index).FileName;
        }
        else {
            cmsUser.fileTypes = 2;
            cmsUser.selectedCategoryId = cmsUser.getCategoryName(index).Id;
            cmsUser.selectedCategoryTitle = cmsUser.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        cmsUser.selectedIndex = index;

    };

    //upload file
    cmsUser.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (cmsUser.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ cmsUser.replaceFile(uploadFile.name);
                    cmsUser.itemClicked(null, cmsUser.fileIdToDelete, "file");
                    cmsUser.fileTypes = 1;
                    cmsUser.fileIdToDelete = cmsUser.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                cmsUser.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        cmsUser.FileItem = response2.Item;
                        cmsUser.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        cmsUser.filePickerMainImage.filename =
                          cmsUser.FileItem.FileName;
                        cmsUser.filePickerMainImage.fileId =
                          response2.Item.Id;
                        cmsUser.selectedItem.LinkMainImageId =
                          cmsUser.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      cmsUser.showErrorIcon();
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
                    cmsUser.FileItem = response.Item;
                    cmsUser.FileItem.FileName = uploadFile.name;
                    cmsUser.FileItem.uploadName = uploadFile.uploadName;
                    cmsUser.FileItem.Extension = uploadFilename.split('.').pop();
                    cmsUser.FileItem.FileSrc = uploadFile.name;
                    cmsUser.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- cmsUser.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", cmsUser.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            cmsUser.FileItem = response.Item;
                            cmsUser.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            cmsUser.filePickerMainImage.filename = cmsUser.FileItem.FileName;
                            cmsUser.filePickerMainImage.fileId = response.Item.Id;
                            cmsUser.selectedItem.LinkMainImageId = cmsUser.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        cmsUser.showErrorIcon();
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
//#help//

    //Export Report 
    cmsUser.exportFile = function () {
        cmsUser.addRequested = true;
        cmsUser.gridOptions.advancedSearchData.engine.ExportFile = cmsUser.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/exportfile', cmsUser.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            cmsUser.addRequested = false;
            rashaErManage.checkAction(response);
            cmsUser.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //cmsUser.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    cmsUser.toggleExportForm = function () {
        cmsUser.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        cmsUser.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        cmsUser.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        cmsUser.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCore/CmsUser/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    cmsUser.rowCountChanged = function () {
        if (!angular.isDefined(cmsUser.ExportFileClass.RowCount) || cmsUser.ExportFileClass.RowCount > 5000)
            cmsUser.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    cmsUser.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"CoreUser/count", cmsUser.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            cmsUser.addRequested = false;
            rashaErManage.checkAction(response);
            cmsUser.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            cmsUser.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);