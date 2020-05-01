app.controller("coreIdentityUserController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', "$rootScope", '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $rootScope, $filter) {
    var coreIdentityUser = this;
    if (itemRecordStatus != undefined) coreIdentityUser.itemRecordStatus = itemRecordStatus;
    var date = moment().format();
    var one_year = moment().add(1, "years").format();
    coreIdentityUser.ExpireDate = {
        defaultDate: date
    }
    coreIdentityUser.attachedFiles = [];
    coreIdentityUser.attachedFile = "";

    coreIdentityUser.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }

    coreIdentityUser.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    coreIdentityUser.init = function () {

        ajax.call(cmsServerConfig.configApiServerPath+"CoreEnum/EnumGender", {}, 'GET').success(function (response) {
            coreIdentityUser.Gender = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"CoreIdentityUser/getall", coreIdentityUser.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            coreIdentityUser.ListItems = response.ListItems;
            coreIdentityUser.gridOptions.fillData(coreIdentityUser.ListItems, response.resultAccess);
            coreIdentityUser.gridOptions.currentPageNumber = response.CurrentPageNumber;
            coreIdentityUser.gridOptions.totalRowCount = response.TotalRowCount;
            coreIdentityUser.gridOptions.rowPerPage = response.RowPerPage;
            coreIdentityUser.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            coreIdentityUser.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    coreIdentityUser.addRequested = false;
    coreIdentityUser.openAddModal = function () {
        if (buttonIsPressed) { return };
        coreIdentityUser.modalTitle = 'اضافه';
        coreIdentityUser.attachedFiles = [];
        coreIdentityUser.attachedFile = "";
        coreIdentityUser.filePickerMainImage.filename = "";
        coreIdentityUser.filePickerMainImage.fileId = null;
        coreIdentityUser.filePickerFiles.filename = "";
        coreIdentityUser.filePickerFiles.fileId = null;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreIdentityUser/GetViewModel', '', 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            coreIdentityUser.selectedItem = response.Item;
            coreIdentityUser.ExpireDate.defaultDate = one_year;
            coreIdentityUser.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCoreIdentity/CoreIdentityUser/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    var emailRegEx = /^\w+(?:\.\w+)*@\w+(?:\.\w+)+$/;  //Regex to validate Email e.g. info@user.oco.ir
    coreIdentityUser.addNewRow = function (frm) {
        if (frm.$invalid)
            return;
        if (!emailRegEx.test(coreIdentityUser.selectedItem.UserName)) {   //Validate UserName
            rashaErManage.showMessage($filter('translatentk')('Email_Format_Is_Not_Correct'));
            return;
        }
        //Save attached file ids into coreIdentityUser.selectedItem.LinkFileIds
        coreIdentityUser.selectedItem.LinkFileIds = "";
        coreIdentityUser.stringfyLinkFileIds();
        coreIdentityUser.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreIdentityUser/add', coreIdentityUser.selectedItem, 'POST').success(function (response) {
            coreIdentityUser.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                coreIdentityUser.ListItems.unshift(response.Item);
                coreIdentityUser.gridOptions.fillData(coreIdentityUser.ListItems);
                coreIdentityUser.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            coreIdentityUser.addRequested = false;
        });
    }

    // Open Edit Content Modal
    coreIdentityUser.openEditModal = function () {
        if (buttonIsPressed) { return };
        coreIdentityUser.modalTitle = 'ویرایش';
        if (!coreIdentityUser.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreIdentityUser/GetOne', coreIdentityUser.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            coreIdentityUser.selectedItem = response.Item;
            coreIdentityUser.ExpireDate.defaultDate = coreIdentityUser.selectedItem.ExpireDate;
            coreIdentityUser.selectedItem.Pwd = "";
            coreIdentityUser.filePickerMainImage.filename = null;
            coreIdentityUser.filePickerMainImage.fileId = null;
            if (response.Item.LinkMainImageId != null) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', response.Item.LinkMainImageId, 'GET').success(function (response2) {
                    coreIdentityUser.filePickerMainImage.filename = response2.Item.FileName;
                    coreIdentityUser.filePickerMainImage.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            coreIdentityUser.parseFileIds(response.Item.LinkFileIds);
            coreIdentityUser.filePickerFiles.filename = null;
            coreIdentityUser.filePickerFiles.fileId = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCoreIdentity/CoreIdentityUser/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    coreIdentityUser.editRow = function (frm) {
        if (frm.$invalid)
            return;
        if (coreIdentityUser.selectedItem.UserName != 'admin' && !emailRegEx.test(coreIdentityUser.selectedItem.UserName)) {   //Validate UserName
            rashaErManage.showMessage($filter('translatentk')('Email_Format_Is_Not_Correct'));
            return;
        }
        coreIdentityUser.buttonIsPressed = true;
        coreIdentityUser.addRequested = true;
        //Save attached file ids into coreIdentityUser.selectedItem.LinkFileIds
        coreIdentityUser.selectedItem.LinkFileIds = "";
        coreIdentityUser.stringfyLinkFileIds();
        ajax.call(cmsServerConfig.configApiServerPath+'CoreIdentityUser/edit', coreIdentityUser.selectedItem, 'PUT').success(function (response) {
            buttonIsPressed = false;
            coreIdentityUser.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                coreIdentityUser.replaceItem(coreIdentityUser.selectedItem.Id, response.Item);
                coreIdentityUser.gridOptions.fillData(coreIdentityUser.ListItems);
                coreIdentityUser.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            coreIdentityUser.addRequested = false;
        });
    }

    coreIdentityUser.closeModal = function () {
        $modalStack.dismissAll();
    };

    coreIdentityUser.replaceItem = function (oldId, newItem) {
        angular.forEach(coreIdentityUser.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = coreIdentityUser.ListItems.indexOf(item);
                coreIdentityUser.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            coreIdentityUser.ListItems.unshift(newItem);
    }

    coreIdentityUser.deleteRow = function () {
        if (buttonIsPressed) { return };

        if (!coreIdentityUser.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(coreIdentityUser.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                coreIdentityUser.addRequested = true;
                ajax.call(cmsServerConfig.configApiServerPath+'CoreIdentityUser/GetOne', coreIdentityUser.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    coreIdentityUser.selectedItemForDelete = response.Item;
                    console.log(coreIdentityUser.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreIdentityUser/delete', coreIdentityUser.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        coreIdentityUser.addRequested = false;
                        if (res.IsSuccess) {
                            coreIdentityUser.replaceItem(coreIdentityUser.selectedItemForDelete.Id);
                            coreIdentityUser.gridOptions.fillData(coreIdentityUser.ListItems);
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
    coreIdentityUser.LinkLocationIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkLocationId',
        url: 'CmsLocation',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'LinkLocationId',
        rowPerPage: 200,
        action: 'GetAllCities',
        scope: coreIdentityUser,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'virtual_Parent.Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
                { name: 'Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
            ]
        }
    }
    coreIdentityUser.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UserName', displayName: 'نام کاربری', sortable: true, type: 'string' },
            { name: 'Name', displayName: 'نام', sortable: true, type: 'string' },
            { name: 'LastName', displayName: 'نام خانوادگی', sortable: true, type: 'string' },
            { name: 'Address', displayName: 'آدرس', sortable: true, type: 'string' },
            { name: 'Tell', displayName: 'تلفن تماس', sortable: true, type: 'string' },
            { name: 'ExpireDate', displayName: 'تاریخ انقضا', sortable: true, isDate: true, type: 'date' },
            { name: 'ExpireLockAccount', displayName: 'ممنوعیت ورود', sortable: true, isDate: true, type: 'date' },
            { name: "ActionKey", displayName: 'ورود به حساب', displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="coreIdentityUser.logintoCp(x.Id)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
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

    coreIdentityUser.gridOptions.reGetAll = function () {
        coreIdentityUser.init();
    }

    coreIdentityUser.gridOptions.onRowSelected = function () { }
    //log in to Cp
    coreIdentityUser.logintoCp = function (SelectedUserId) {

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
    coreIdentityUser.loadFileAndFolder = function (item) {
        coreIdentityUser.treeConfig.currentNode = item;
        console.log(item);
        coreIdentityUser.treeConfig.onNodeSelect(item);
    }
    coreIdentityUser.deleteAttachedFile = function (index) {
        coreIdentityUser.attachedFiles.splice(index, 1);
    }

    coreIdentityUser.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !coreIdentityUser.alreadyExist(id, coreIdentityUser.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = {
                id: fId, name: fname
            };
            coreIdentityUser.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    coreIdentityUser.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    coreIdentityUser.filePickerMainImage.removeSelectedfile = function (config) {
        coreIdentityUser.filePickerMainImage.fileId = null;
        coreIdentityUser.filePickerMainImage.filename = null;
        coreIdentityUser.selectedItem.LinkMainImageId = null;

    }

    coreIdentityUser.filePickerFiles.removeSelectedfile = function (config) {
        coreIdentityUser.filePickerFiles.fileId = null;
        coreIdentityUser.filePickerFiles.filename = null;
        coreIdentityUser.selectedItem.LinkFileIds = null;
    }


    coreIdentityUser.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }

    // ----------- FilePicker Codes --------------------------------
    coreIdentityUser.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !coreIdentityUser.alreadyExist(id, coreIdentityUser.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            coreIdentityUser.attachedFiles.push(file);
            coreIdentityUser.clearfilePickers();
        }
    }

    coreIdentityUser.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                coreIdentityUser.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    coreIdentityUser.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;   //String is empty or whitespace then return
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            coreIdentityUser.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    coreIdentityUser.clearfilePickers = function () {
        coreIdentityUser.filePickerFiles.fileId = null;
        coreIdentityUser.filePickerFiles.filename = null;
    }

    coreIdentityUser.stringfyLinkFileIds = function () {
        $.each(coreIdentityUser.attachedFiles, function (i, item) {
            if (coreIdentityUser.selectedItem.LinkFileIds == "")
                coreIdentityUser.selectedItem.LinkFileIds = item.fileId;
            else
                coreIdentityUser.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    coreIdentityUser.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleBiography/CoreIdentityUser/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        coreIdentityUser.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            coreIdentityUser.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    coreIdentityUser.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    coreIdentityUser.whatcolor = function (progress) {
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

    coreIdentityUser.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    coreIdentityUser.replaceFile = function (name) {
        coreIdentityUser.itemClicked(null, coreIdentityUser.fileIdToDelete, "file");
        coreIdentityUser.fileTypes = 1;
        coreIdentityUser.fileIdToDelete = coreIdentityUser.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", coreIdentityUser.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    coreIdentityUser.remove(coreIdentityUser.FileList, coreIdentityUser.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                coreIdentityUser.FileItem = response3.Item;
                                coreIdentityUser.FileItem.FileName = name;
                                coreIdentityUser.FileItem.Extension = name.split('.').pop();
                                coreIdentityUser.FileItem.FileSrc = name;
                                coreIdentityUser.FileItem.LinkCategoryId = coreIdentityUser.thisCategory;
                                coreIdentityUser.saveNewFile();
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
    coreIdentityUser.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", coreIdentityUser.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                coreIdentityUser.FileItem = response.Item;
                coreIdentityUser.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            coreIdentityUser.showErrorIcon();
            return -1;
        });
    }

    coreIdentityUser.showSuccessIcon = function () {
    }

    coreIdentityUser.showErrorIcon = function () {

    }
    //file is exist
    coreIdentityUser.fileIsExist = function (fileName) {
        for (var i = 0; i < coreIdentityUser.FileList.length; i++) {
            if (coreIdentityUser.FileList[i].FileName == fileName) {
                coreIdentityUser.fileIdToDelete = coreIdentityUser.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    coreIdentityUser.getFileItem = function (id) {
        for (var i = 0; i < coreIdentityUser.FileList.length; i++) {
            if (coreIdentityUser.FileList[i].Id == id) {
                return coreIdentityUser.FileList[i];
            }
        }
    }

    //select file or folder
    coreIdentityUser.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            coreIdentityUser.fileTypes = 1;
            coreIdentityUser.selectedFileId = coreIdentityUser.getFileItem(index).Id;
            coreIdentityUser.selectedFileName = coreIdentityUser.getFileItem(index).FileName;
        }
        else {
            coreIdentityUser.fileTypes = 2;
            coreIdentityUser.selectedCategoryId = coreIdentityUser.getCategoryName(index).Id;
            coreIdentityUser.selectedCategoryTitle = coreIdentityUser.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        coreIdentityUser.selectedIndex = index;

    };

    //upload file
    coreIdentityUser.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (coreIdentityUser.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ coreIdentityUser.replaceFile(uploadFile.name);
                    coreIdentityUser.itemClicked(null, coreIdentityUser.fileIdToDelete, "file");
                    coreIdentityUser.fileTypes = 1;
                    coreIdentityUser.fileIdToDelete = coreIdentityUser.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                coreIdentityUser.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        coreIdentityUser.FileItem = response2.Item;
                        coreIdentityUser.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        coreIdentityUser.filePickerMainImage.filename =
                          coreIdentityUser.FileItem.FileName;
                        coreIdentityUser.filePickerMainImage.fileId =
                          response2.Item.Id;
                        coreIdentityUser.selectedItem.LinkMainImageId =
                          coreIdentityUser.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      coreIdentityUser.showErrorIcon();
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
                    coreIdentityUser.FileItem = response.Item;
                    coreIdentityUser.FileItem.FileName = uploadFile.name;
                    coreIdentityUser.FileItem.uploadName = uploadFile.uploadName;
                    coreIdentityUser.FileItem.Extension = uploadFilename.split('.').pop();
                    coreIdentityUser.FileItem.FileSrc = uploadFile.name;
                    coreIdentityUser.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- coreIdentityUser.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", coreIdentityUser.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            coreIdentityUser.FileItem = response.Item;
                            coreIdentityUser.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            coreIdentityUser.filePickerMainImage.filename = coreIdentityUser.FileItem.FileName;
                            coreIdentityUser.filePickerMainImage.fileId = response.Item.Id;
                            coreIdentityUser.selectedItem.LinkMainImageId = coreIdentityUser.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        coreIdentityUser.showErrorIcon();
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
    coreIdentityUser.exportFile = function () {
        coreIdentityUser.addRequested = true;
        coreIdentityUser.gridOptions.advancedSearchData.engine.ExportFile = coreIdentityUser.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreIdentityUser/exportfile', coreIdentityUser.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            coreIdentityUser.addRequested = false;
            rashaErManage.checkAction(response);
            coreIdentityUser.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //coreIdentityUser.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    coreIdentityUser.toggleExportForm = function () {
        coreIdentityUser.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        coreIdentityUser.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        coreIdentityUser.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        coreIdentityUser.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCoreIdentity/CoreIdentityUser/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    coreIdentityUser.rowCountChanged = function () {
        if (!angular.isDefined(coreIdentityUser.ExportFileClass.RowCount) || coreIdentityUser.ExportFileClass.RowCount > 5000)
            coreIdentityUser.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    coreIdentityUser.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"CoreIdentityUser/count", coreIdentityUser.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            coreIdentityUser.addRequested = false;
            rashaErManage.checkAction(response);
            coreIdentityUser.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            coreIdentityUser.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);