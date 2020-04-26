app.controller("FileManager", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$rootScope', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $rootScope, $filter) {
    var fdm = this;
    var Accesswatch = $rootScope;
    fdm.loadingBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    };

    fdm.topCategory = [];
    fdm.topCategoryIndex = 0;
    fdm.pathCross = [];
    fdm.pathCrossIndex = 0;
    fdm.pathCrossGo = 0;
    fdm.selectedIndex = -1;
    fdm.fileIdToCopy = 0;
    fdm.fileIdToCut = 0;
    fdm.CopyType = -1;
    fdm.CutType = -1;
    fdm.msgText = "No message";
    fdm.msgTextERROR = "";
    fdm.msgColor = "#007e1e"; //ff0000
    var rootcat = {
        Name: "Root",
        Id: null
    };
    fdm.Path = [rootcat];
    fdm.fileTypes = 0;
    fdm.uploadQueueCurrentIndex = null;

    fdm.fileSelectionChanged = function (fileList, folderList) {

    };

    fdm.fileConfig = {
        selectionChanged: fdm.fileSelectionChanged,
        selectMultipleFile: true,
        selectMultipleFolder: true,
        allowSelectFolder: true,
        allowSelectFile: true,
        allowCopyCut: true,
        allowDelete: true,
        inSelectionMode: true,
        allowedFileType: 'Image,Word,Excel,PowerPoint,Font,Voice,Video,Pdf,Zip,Text,Code,Html,Text,File',
        cssStyle: 'min-height:500px'

    }

    //init get 150 folder of user in first loading
    fdm.init = function () {
        fdm.loadingBusyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getall", { RowPerPage: 150 }, 'Post').success(function (response) {
        ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getall", { RowPerPage: 500 }, 'Post').success(function (response) {
            fdm.msgText = "Total " + response.ListItems.length + " folders were loaded";
            if (response.ListItems.length == 1)
                fdm.msgText = response.ListItems.length + " folder was loaded";
            fdm.msgColor = "#007e1e";
            fdm.categoryList = response.ListItems;
            fdm.categoryList.sort(compareCategory);
            fdm.OnCategoryChange(null, false);
            fdm.topCategory[fdm.topCategoryIndex] = 0;
            fdm.loadingBusyIndicator.isActive = false;
        }).error(function (data) {
            console.log(data);
            fdm.msgText = "An Error Accrued .";
            fdm.msgColor = "#ff0000";
            fdm.loadingBusyIndicator.isActive = false;
        });

    };

    //on double click on folder
    fdm.OnCategoryChange = function (categoryid, top) {
        fdm.CurrentCategoryList = [];
        fdm.count = 0;
        fdm.thisCategory = categoryid;
        fdm.FileList = [];
        if (!categoryid) {
            fdm.pathCross[fdm.pathCross.length++] = 0;
            for (var i = 0; i < fdm.categoryList.length; i++) {
                if (fdm.categoryList[i].LinkParentId == null) {
                    fdm.CurrentCategoryList[fdm.count] = fdm.categoryList[i];
                    fdm.CurrentCategoryList.sort(compareCategory);
                    fdm.count++;
                }
            }
        } else {
            if (!top) {
                fdm.topCategoryIndex++;
                fdm.topCategory[fdm.topCategoryIndex] = categoryid;
                fdm.Path.push(fdm.getCategoryName(categoryid));
            }

            fdm.pathCross[fdm.pathCross.length++] = categoryid;
            for (var i = 0; i < fdm.categoryList.length; i++) {
                if (fdm.categoryList[i].LinkParentId == categoryid) {
                    fdm.CurrentCategoryList[fdm.count] = fdm.categoryList[i];
                    fdm.CurrentCategoryList.sort(compareCategory);
                    fdm.count++;
                }
            }

        }
        fdm.msgText = "Total " + fdm.CurrentCategoryList.length + " folders were loaded";
        if (fdm.CurrentCategoryList.length == 1)
            fdm.msgText = fdm.CurrentCategoryList.length + " folder was loaded";
        fdm.msgColor = "#007e1e";

        fdm.getCategoryFiles(categoryid);
    }

    //
    fdm.openUploadModal = function () {
        //if (fdm.thisCategory == null) {
        //    rashaErManage.showMessage("آپلود فایل در شاخه ی Root امکان پذیر نمی باشد!");
        //    return;
        //}
        $modal.open({
            templateUrl: 'cpanelv1/ModuleFile/upload_modal.html',
            size: 'lg',
            scope: $scope
        });
    }
    fdm.openUploadByUrlModal = function () {
        fdm.UploadByUrlfiles = [];
        $modal.open({
            templateUrl: 'cpanelv1/ModuleFile/uploadByUrl_modal.html',
            size: 'lg',
            scope: $scope
        });
    }
    fdm.UploadByUrlfiles = [];
    //fdm.UploadByUrlfiles.push({ Url: 'http://', Description: '..' });
    fdm.UploadByUrlAdd = function () {

        fdm.UploadByUrlfiles.push({ Url: 'http://', Description:'..'});
    }
    fdm.uploadByUrlStart = function (index, uploadFile) {
        frm.msgTextERROR = "";
        $("#save-button-start" + index).removeClass("flashing-button");
        $("#save-button-start"+index).attr("disabled", "disabled");
        // ------- fdm.saveNewFile()  ----------------------
        var result = 0;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/UploadByUrl", { url: uploadFile.Url}, 'POST').success(function (response) {
            fdm.loadingBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                fdm.msgTextERROR = "successful!";
                uploadFile.uploadName = response.ErrorMessage;
                uploadFile.uploaded = 1;
                fdm.loadingBusyIndicator.isActive = false;
                $("#save-icon-start" + index).removeClass("fa-save");
                $("#save-button-start" + index).removeClass("flashing-button");
                $("#save-icon-start" + index).addClass("fa-check");
            }
            else {
                fdm.msgText = "Saving new file was not successful!";
                fdm.msgTextERROR = "Saving new file was not successful!";
                fdm.msgColor = "#ff0000";
                $("#save-icon-start" + index).removeClass("fa-save");
                $("#save-button-start" + index).removeClass("flashing-button");
                $("#save-icon-start" + index).addClass("fa-remove");

            }
        }).error(function (data) {
            fdm.msgText = "An error occured during saving process!";
            fdm.msgTextERROR = "An error occured during saving process!";
            fdm.msgColor = "#ff0000";
            fdm.showErrorIcon();
            fdm.loadingBusyIndicator.isActive = false;
            $("#save-icon-start" + index).removeClass("fa-save");
            $("#save-button-start" + index).removeClass("flashing-button");
            $("#save-icon-start" + index).addClass("fa-remove");
        });
                                            //-----------------------------------
    }

    //go to up folder
    fdm.goToUp = function () {
        if (fdm.topCategoryIndex == 0) {
            rashaErManage.showMessage("شما در فولدر Root هستید!");
        } else {
            fdm.topCategoryIndex--;
            var cid = fdm.topCategory[fdm.topCategoryIndex];
            fdm.pathCross[fdm.pathCross.length++] = cid;
            if (cid == 0) {
                fdm.OnCategoryChange(null, true);
            } else {

                fdm.OnCategoryChange(cid, true);
            }
            if (fdm.Path.length > 1) {
                fdm.Path.pop();
            }
        }
    }

    //Search files in current folder
    fdm.searchStr = "";
    fdm.search = function (input) {
        if (input == undefined)
            fdm.searchStr = "";
        fdm.loadingBusyIndicator.isActive = true;
        //Search in folders
        var filterModel = { Filters: [] };
        if (fdm.searchStr == "") {
            fdm.init();
            return;
        }
        filterModel.Filters[0] = ({ PropertyName: "Id", SearchType: 0, IntValue1: input });
        if (isNaN(fdm.searchStr))
            filterModel.Filters[0] = ({ PropertyName: "Title", SearchType: 5, StringValue1: input, IntValue1: null });
        fdm.CurrentCategoryList = [];
        ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getall", filterModel, 'Post').success(function (response) {
            fdm.msgText = "Total " + response.ListItems.length + " folder is loaded:";
            fdm.msgColor = "#007e1e";
            fdm.categoryList = response.ListItems;
            fdm.categoryList.sort(compareCategory);
            if (response.ListItems.length > 0)
                for (var i = 0; i < fdm.categoryList.length; i++) {
                    fdm.CurrentCategoryList.push(fdm.categoryList[i]);
                    fdm.CurrentCategoryList.sort(compareCategory);
                }
            //fdm.OnCategoryChange(fdm.thisCategory, false);
            //fdm.topCategory[fdm.topCategoryIndex] = 0;
        }).error(function (data) {
            console.log(data);
            fdm.msgText = "An Error Accrued .";
            fdm.msgColor = "#ff0000";
            fdm.loadingBusyIndicator.isActive = false;
        });
        //Search in files
        fdm.FileList = [];
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/getall", filterModel, 'POST').success(function (response) {
            fdm.FileList = response.ListItems;
            fdm.FileList.sort(compare);
            fdm.loadingBusyIndicator.isActive = false;
        }).error(function (data) {
            console.log(data);
            fdm.msgText = "An Error Accrued .";
            fdm.msgColor = "#ff0000";
            fdm.loadingBusyIndicator.isActive = false;
        });
    }

    //for breadcrums
    fdm.getCategoryName = function (id) {
        for (var i = 0; i < fdm.categoryList.length; i++) {
            if (fdm.categoryList[i].Id == id) {
                return fdm.categoryList[i];
            }
        }
    };

    fdm.getFileName = function (id) {
        for (var i = 0; i < fdm.FileList.length; i++) {
            if (fdm.FileList[i].Id == id) {
                return fdm.FileList[i].FileName;
            }
        }
    }

    fdm.getFileItem = function (id) {
        for (var i = 0; i < fdm.FileList.length; i++) {
            if (fdm.FileList[i].Id == id) {
                return fdm.FileList[i];
            }
        }
    }

    //select file or folder
    fdm.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            fdm.fileTypes = 1; //File is selected
            fdm.selectedFileId = fdm.getFileItem(index).Id;
            fdm.selectedFileName = fdm.getFileItem(index).FileName;
            fdm.selectedFileSrc = fdm.getFileItem(index).FileSrc;
            fdm.selectedFileDescription = fdm.getFileItem(index).Description;
            //fdm.msgText = "File \"" + fdm.selectedFileName + "\"  File Id: " + fdm.selectedFileId + "  File Src: \"" + fdm.selectedFileSrc + "\"";
            fdm.msgText = "File name: \"" + fdm.selectedFileName + "\"" + "<br/> file Description: " + fdm.selectedFileDescription + "<br/> file ID: " + fdm.selectedFileId + "\"<br/> file Src: " + cmsServerConfig.configPathFileByIdAndName+  fdm.selectedFileId + '/' + fdm.selectedFileName + "<br/>";//+"<button ng-click="+fdm.EditFile(fdm.selectedFileId)+">Edit</button>";
            fdm.msgColor = "#007e1e";
        }
        else {
            fdm.fileTypes = 2; //Folder is selected
            fdm.selectedCategoryId = fdm.getCategoryName(index).Id;
            fdm.selectedCategoryTitle = fdm.getCategoryName(index).Title;
            fdm.msgText = "Folder \"" + fdm.selectedCategoryTitle + "\" is selected. Folder Id: " + fdm.selectedCategoryId;
            fdm.msgColor = "#007e1e";
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        fdm.selectedIndex = index;

    };
    // /#help edit file name & description
    /* fdm.EditFile = function (Idfile) {
        $modal.open({
                templateUrl: 'cpanelv1/ModuleFile/editfile.html',
                size: 'lg',
                scope: $scope
            });
        };
    
    */



    //create new folder
    fdm.createNewFolderAction = function (fname) {
        if (fdm.categoryList.length > 1000) {
            fdm.msgText = "Every User Can make 150 Directory . Please Delete one to create one.";
            fdm.msgColor = "#ff0000";
            return;
        }
        var folder_name = fdm.getNextFolderName();


        if (!fname) {
            fname = prompt("Please enter new folder name :", folder_name);
        }
        if (fname != null) {
            if (fdm.categoryIsExist(fname)) {
                rashaErManage.showMessage("پوشه ای با این نام در حال حاضر وجود دارد!");
                //fdm.msgText = "Folder already exists!";
                //fdm.msgColor = "#ff0000";
                return;
            }
            else {
                fdm.createFolder(fname);
            }
        }
    }

    fdm.createFolder = function (name) {
        fdm.loadingBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/GetViewModel", "", 'GET').success(function (response) {
            fdm.Item = response.Item;
            fdm.Item.Title = name;
            //fdm.Item.Name = name;
            fdm.Item.LinkParentId = fdm.thisCategory;
            fdm.saveNewFolder();
            fdm.loadingBusyIndicator.isActive = false;
        }).error(function (data) {
            fdm.msgText = "An error occrued durnig creating folder!";
            fdm.msgColor = "#ff0000";
            console.log(data);
            fdm.loadingBusyIndicator.isActive = false;
        });
    }

    fdm.saveNewFolder = function () {
        fdm.loadingBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/add", fdm.Item, 'Post').success(function (response) {
            fdm.Item = response.Item;
            fdm.loadingBusyIndicator.isActive = false;
            fdm.categoryList.unshift(response.Item);
            fdm.refreshFolder();
        }).error(function (data) {
            console.log(data);
            fdm.msgText = "An error occrued durnig saving new folder!";
            fdm.msgColor = "#ff0000";
            fdm.loadingBusyIndicator.isActive = false;
        });
    }

    //get list of file from category id
    fdm.getCategoryFiles = function (id) {
        fdm.loadingBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", id, 'POST').success(function (response) {
            fdm.FileList = response.ListItems;
            fdm.FileList.sort(compare);
            fdm.msgText = fdm.msgText + ", " + response.ListItems.length + " files were loaded";
            fdm.loadingBusyIndicator.isActive = false;
        }).error(function (data) {
            console.log(data);
            fdm.msgText = "An Error Accrued .";
            fdm.msgColor = "#ff0000";
            fdm.loadingBusyIndicator.isActive = false;
        });
    };

    //delete selected file
    fdm.delete = function (confirmed) {
        if (fdm.selectedIndex > 0) {
            fdm.fileIdToDelete = fdm.selectedIndex;
            if (confirmed) {
                var result = fdm.deleteFileOrFolder();
                return result;
            }
            else {
                var prompMessage = "آیا می خواهید این فایل را حذف کنید؟";
                if (fdm.fileTypes == 2)
                    prompMessage = "آیا می خواهید این پوشه و تمامی محتوایات آن حذف شود؟";
                if (confirm(prompMessage)) {
                    var result = fdm.deleteFileOrFolder();
                    return result;
                }
            }
        } else {
            fdm.msgText = "No file is selected!";
            fdm.msgColor = "#ff0000";
            return false;
        }
    }

    fdm.deleteFileOrFolder = function () {
        fdm.loadingBusyIndicator.isActive = true;
        if (fdm.fileTypes == 1) { // file type
            ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", fdm.fileIdToDelete, 'GET').success(function (response) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response.Item, 'POST').success(function (response) {
                    fdm.loadingBusyIndicator.isActive = false;
                    //fdm.getCategoryFiles(fdm.thisCategory);
                    if (response.IsSuccess) {
                        fdm.remove(fdm.FileList, fdm.fileIdToDelete);
                        return true;
                    }
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                    fdm.loadingBusyIndicator.isActive = false;
                    return false;
                });
            }).error(function (data) {
                console.log(data);
                fdm.msgText = "An error occrued during deleting the file!";
                fdm.msgColor = "#ff0000";
                fdm.loadingBusyIndicator.isActive = false;
                return false;

            });
        } else if (fdm.fileTypes == 2) { // Folder type
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/GetOne", fdm.fileIdToDelete, 'GET').success(function (response) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileCategory/delete', response.Item, 'POST').success(function (response) {
                    if (response.IsSuccess) {
                        fdm.loadingBusyIndicator.isActive = false;
                        fdm.remove(fdm.categoryList, fdm.fileIdToDelete);
                        return true;
                    }
                }).error(function (data, errCode, c, d) {
                    fdm.msgText = "An error occrued during deleting the folder!";
                    fdm.msgColor = "#ff0000";
                    console.log(data);
                    fdm.loadingBusyIndicator.isActive = false;
                    return false;
                });
            }).error(function (data) {
                console.log(data);
                fdm.msgText = "An Error Accrued .";
                fdm.msgColor = "#ff0000";
                fdm.loadingBusyIndicator.isActive = false;
                return false;
            });
        }
    }

    //for refreshing folder
    fdm.refreshFolder = function () {
        fdm.OnCategoryChange(fdm.thisCategory, true);
    }

    //upload file
    fdm.uploadFile = function (index, uploadFile, description) {
        $("#save-button" + index).attr("disabled", "disabled");

        if ($("#save-icon" + index).hasClass("fa-save")) {
            //$("#save-icon" + index).removeClass("fa-save");


            if (fdm.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ fdm.replaceFile(uploadFile.name);
                    fdm.itemClicked(null, fdm.fileIdToDelete, "file");
                    fdm.fileTypes = 1;
                    fdm.fileIdToDelete = fdm.selectedIndex;
                    fdm.loadingBusyIndicator.isActive = true;
                    // Delete the file
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", fdm.fileIdToDelete, 'GET').success(function (response1) {
                        if (response1.IsSuccess == true) {
                            console.log(response1.Item);
                            ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                                fdm.loadingBusyIndicator.isActive = false;
                                fdm.remove(fdm.FileList, fdm.fileIdToDelete);
                                if (response2.IsSuccess == true) {
                                    // Save New file
                                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                                        if (response3.IsSuccess == true) {
                                            fdm.FileItem = response3.Item;
                                            fdm.FileItem.FileName = uploadFile.name;
                                            fdm.FileItem.uploadName = uploadFile.uploadName;
                                            fdm.FileItem.Description = description;
                                            fdm.FileItem.Extension = uploadFile.name.split('.').pop();
                                            fdm.FileItem.FileSrc = uploadFile.name;
                                            fdm.FileItem.LinkCategoryId = fdm.thisCategory;
                                            // ------- fdm.saveNewFile()  ----------------------
                                            var result = 0;
                                            ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", fdm.FileItem, 'POST').success(function (response) {
                                                fdm.loadingBusyIndicator.isActive = false;
                                                if (response.IsSuccess) {
                                                    fdm.FileItem = response.Item;
                                                    fdm.showSuccessIcon();
                                                    fdm.refreshFolder();
                                                    fdm.loadingBusyIndicator.isActive = false;
                                                    $("#save-icon" + index).removeClass("fa-save");
                                                    $("#save-button" + index).removeClass("flashing-button");
                                                    $("#save-icon" + index).addClass("fa-check");
                                                }
                                                else {
                                                    fdm.msgText = "Saving new file was not successful!";
                                                    fdm.msgTextERROR = "Saving new file was not successful!";
                                                    fdm.msgColor = "#ff0000";
                                                    $("#save-icon" + index).removeClass("fa-save");
                                                    $("#save-button" + index).removeClass("flashing-button");
                                                    $("#save-icon" + index).addClass("fa-remove");

                                                }
                                            }).error(function (data) {
                                                fdm.msgText = "An error occured during saving process!";
                                                fdm.msgTextERROR = "An error occured during saving process!";
                                                fdm.msgColor = "#ff0000";
                                                fdm.showErrorIcon();
                                                fdm.loadingBusyIndicator.isActive = false;
                                                $("#save-icon" + index).removeClass("fa-save");
                                                $("#save-button" + index).removeClass("flashing-button");
                                                $("#save-icon" + index).addClass("fa-remove");
                                            });
                                            //-----------------------------------
                                            fdm.loadingBusyIndicator.isActive = false;
                                        }
                                        else {
                                            console.log("getting the model was not successfully returned!");
                                        }
                                    }).error(function (data) {
                                        console.log(data);
                                        fdm.msgText = "An error occrued during getting the new file!";
                                        fdm.msgTextERROR = "An error occrued during getting the new file!";
                                        fdm.msgColor = "#ff0000";
                                        fdm.loadingBusyIndicator.isActive = false;
                                    });
                                }
                                else {
                                    console.log("Request to api/CmsFileContent/delete was not successfully returned!");
                                }
                            }).error(function (data, errCode, c, d) {
                                console.log(data);
                                fdm.msgText = "An error occrued during deleting the old file!";
                                fdm.msgTextERROR = "An error occrued during deleting the old file!";
                                fdm.msgColor = "#ff0000";
                                fdm.loadingBusyIndicator.isActive = false;
                            });
                        }
                    }).error(function (data) {
                        console.log(data);
                        fdm.msgText = "An error occrued during getting the old file!";
                        fdm.msgTextERROR = "An error occrued during getting the old file!";
                        fdm.msgColor = "#ff0000";
                        fdm.loadingBusyIndicator.isActive = false;
                    });
                    //--------------------------------
                } else {
                    fdm.msgText = "File already exists! New file was not uploaded.";
                    fdm.msgTextERROR = "File already exists! New file was not uploaded.";
                    fdm.msgColor = "#ff0000";
                    return;
                }
            }
            else { // File does not exists
                // Save New file
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response) {
                    fdm.FileItem = response.Item;
                    fdm.FileItem.FileName = uploadFile.name;
                    fdm.FileItem.uploadName = uploadFile.uploadName;
                    fdm.FileItem.Description = description;
                    //fdm.FileItem.Extension = uploadFile.name.split('.').pop();
                    //fdm.FileItem.FileSrc = uploadFile.name;
                    fdm.FileItem.LinkCategoryId = fdm.thisCategory;
                    // ------- fdm.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", fdm.FileItem, 'POST').success(function (response) {
                        fdm.loadingBusyIndicator.isActive = false;
                        if (response.IsSuccess) {
                            fdm.FileItem = response.Item;
                            fdm.showSuccessIcon();
                            fdm.refreshFolder();
                            fdm.loadingBusyIndicator.isActive = false;
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                        }
                        else {
                            fdm.msgText = "Saving new file was not successful!";
                            fdm.msgTextERROR = "Saving new file was not successful!";
                            fdm.msgColor = "#ff0000";
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");

                        }
                    }).error(function (data) {
                        fdm.msgText = "An error occured during saving process!";
                        fdm.msgTextERROR = "An error occured during saving process!";
                        fdm.msgColor = "#ff0000";
                        fdm.showErrorIcon();
                        fdm.loadingBusyIndicator.isActive = false;
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass("flashing-button");
                        $("#save-icon" + index).addClass("fa-remove");
                    });
                    //-----------------------------------
                    fdm.loadingBusyIndicator.isActive = false;
                }).error(function (data) {
                    console.log(data);
                    fdm.msgText = "An error occrued during getviewmodel!";
                    fdm.msgTextERROR = "An error occrued during getviewmodel!";
                    fdm.msgColor = "#ff0000";
                    fdm.loadingBusyIndicator.isActive = false;
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-remove");
                });
            }
        }
    }

    fdm.downloadFile = function (Id, FileName) {
        //var DownloadModel = {
        //    id: null,
        //    name: null
        //};
        //if (Id === undefined && FileName === undefined) {
        //    DownloadModel.id = fdm.selectedFileId;
        //    DownloadModel.name = fdm.selectedFileName;
        //} else {
        //    DownloadModel.id = Id;
        //    DownloadModel.name = FileName;
        //}
        if (fdm.selectedFileId != undefined && fdm.selectedFileName != undefined) {
            window.open(cmsServerConfig.configPathFileByIdAndName + fdm.selectedFileId + '/' + fdm.selectedFileName, '_blank', '');
        }
    }

    fdm.replaceFile = function (name) {
        fdm.itemClicked(null, fdm.fileIdToDelete, "file");
        fdm.fileTypes = 1;
        fdm.fileIdToDelete = fdm.selectedIndex;
        fdm.loadingBusyIndicator.isActive = true;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", fdm.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    fdm.loadingBusyIndicator.isActive = false;
                    fdm.remove(fdm.FileList, fdm.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                fdm.FileItem = response3.Item;
                                fdm.FileItem.FileName = name;
                                fdm.FileItem.Extension = name.split('.').pop();
                                fdm.FileItem.FileSrc = name;
                                fdm.FileItem.LinkCategoryId = fdm.thisCategory;
                                fdm.saveNewFile();
                                fdm.loadingBusyIndicator.isActive = false;
                            }
                            else {
                                console.log("getting the model was not successfully returned!");
                            }
                        }).error(function (data) {
                            console.log(data);
                            fdm.msgText = "An error occrued during getting the new file!";
                            fdm.msgColor = "#ff0000";
                            fdm.loadingBusyIndicator.isActive = false;
                        });
                    }
                    else {
                        console.log("Request to api/CmsFileContent/delete was not successfully returned!");
                    }
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                    fdm.msgText = "An error occrued during deleting the old file!";
                    fdm.msgColor = "#ff0000";
                    fdm.loadingBusyIndicator.isActive = false;
                });
            }
        }).error(function (data) {
            console.log(data);
            fdm.msgText = "An error occrued during getting the old file!";
            fdm.msgColor = "#ff0000";
            fdm.loadingBusyIndicator.isActive = false;
        });
    }
    //save new file
    fdm.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", fdm.FileItem, 'POST').success(function (response) {
            fdm.loadingBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                fdm.FileItem = response.Item;
                fdm.showSuccessIcon();
                fdm.refreshFolder();
                fdm.loadingBusyIndicator.isActive = false;
                return 1;
            }
            else {
                fdm.msgText = "Saving new file was not successful!";
                fdm.msgColor = "#ff0000";
                return 0;

            }
        }).error(function (data) {
            fdm.msgText = "An error occured during saving process!";
            fdm.msgColor = "#ff0000";
            fdm.showErrorIcon();
            fdm.loadingBusyIndicator.isActive = false;
            return -1;
        });
    }

    fdm.showSuccessIcon = function () {

    }

    fdm.showErrorIcon = function () {

    }
    //copy function
    fdm.copy = function () {
        if (fdm.selectedIndex > 0) {
            fdm.fileIdToCopy = fdm.selectedIndex;
            fdm.fileNameToCopy = fdm.selectedFileName;
        }
        else {
            fdm.msgText = "No file is selected!";
            fdm.msgColor = "#ff0000";
        }

        fdm.msgText = "Copied To ClipBoard .";
        fdm.msgColor = "#007e1e";

        fdm.CopyType = fdm.fileTypes;
        fdm.fileIdToCut = -1;         // Cancel "Cut" on next paste

    }

    fdm.copyWork = function (id, name, parentFolderDes) {
        if (fdm.CopyType == 1) { // file type
            if (fdm.fileIsExist(name)) {
                if (confirm('File "' + name + '" Is Exist , are sure to delete file ?')) {
                    fdm.itemClicked(null, fdm.fileIdToDelete, fdm.CopyType);
                    fdm.fileTypes = 1;
                    // fdm.delete(true); ---------------------------------
                    // Type is file
                    fdm.loadingBusyIndicator.isActive = true;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", fdm.fileIdToDelete, 'GET').success(function (response) {
                        ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response.Item, 'POST').success(function (response) {
                            if (response.IsSuccess) {
                                fdm.remove(fdm.FileList, fdm.fileIdToDelete);
                                fdm.copyWork(id, name, parentFolderDes);
                                fdm.loadingBusyIndicator.isActive = false;
                            }
                        }).error(function (data, errCode, c, d) {
                            console.log(data);
                            fdm.loadingBusyIndicator.isActive = false;
                        });
                    }).error(function (data) {
                        console.log(data);
                        fdm.msgText = "An error occrued during deleting the file!";
                        fdm.msgColor = "#ff0000";
                        fdm.loadingBusyIndicator.isActive = false;
                    });
                    // End of fdm.delete() ---------------------------------
                    return;
                }
                else { // User does not confirm replace
                    fdm.msgText = "File Is Exist .";
                    fdm.msgColor = "#ff0000";
                    return;
                }
            }
            //Same filename does not exist
            fdm.loadingBusyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", id, 'GET').success(function (response) {
                response.Item.LinkCategoryId = parentFolderDes;
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/Copy', response.Item, 'POST').success(function (response) {
                    fdm.FileList.unshift(response.Item);
                    fdm.loadingBusyIndicator.isActive = false;
                    fdm.msgText = "Pasted Succeccfully!";
                    fdm.msgColor = "#007e1e";
                    fdm.refreshFolder();
                }).error(function (data, errCode, c, d) {
                    fdm.msgText = "An error occrued .";
                    fdm.msgColor = "#ff0000";
                    fdm.loadingBusyIndicator.isActive = false;
                });

            }).error(function (data) {
                fdm.msgText = "An error occrued .";
                fdm.msgColor = "#ff0000";
                console.log(data);
                fdm.loadingBusyIndicator.isActive = false;
            });
        } else if (fdm.CopyType == 2) {  //folder type
            if (fdm.categoryIsExist(name)) {
                if (confirm('File "' + name + '" Is Exist , are sure to delete file ?')) {
                    fdm.itemClicked(null, fdm.fileIdToDelete, fdm.CutType);
                    fdm.fileTypes = 2;
                    // fdm.delete(true); ---------------------------------
                    // Type is folder
                    fdm.loadingBusyIndicator.isActive = true;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/GetOne", fdm.fileIdToDelete, 'GET').success(function (response) {
                        ajax.call(cmsServerConfig.configApiServerPath+'FileCategory/delete', response.Item, 'POST').success(function (response) {
                            if (response.IsSuccess) {
                                fdm.remove(fdm.categoryList, fdm.fileIdToDelete);
                                fdm.copyWork(id, name, parentFolderDes);
                                fdm.loadingBusyIndicator.isActive = false;
                            }
                        }).error(function (data, errCode, c, d) {
                            fdm.msgText = "An error occrued during deleting the folder!";
                            fdm.msgColor = "#ff0000";
                            console.log(data);
                        });
                    }).error(function (data) {
                        console.log(data);
                        fdm.msgText = "An Error Accrued .";
                        fdm.msgColor = "#ff0000";
                        fdm.loadingBusyIndicator.isActive = false;
                    });
                    // End of fdm.delete() ---------------------------------
                    return;
                } else {
                    fdm.msgText = "File is Exist .";
                    fdm.msgColor = "#ff0000";
                    return;
                }
            }
            //Same folder name does not exist
            fdm.loadingBusyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/GetOne", id, 'GET').success(function (response) {
                response.Item.LinkParentId = parentFolderDes;
                ajax.call(cmsServerConfig.configApiServerPath+'FileCategory/add', response.Item, 'POST').success(function (response) {
                    fdm.categoryList.unshift(response.Item);
                    fdm.loadingBusyIndicator.isActive = false;

                    fdm.msgText = "Pasted Succeccfully .";
                    fdm.msgColor = "#007e1e";
                    fdm.refreshFolder();
                }).error(function (data, errCode, c, d) {
                    fdm.msgText = "An Error Accrued .";
                    fdm.msgColor = "#ff0000";
                    console.log(data);
                    fdm.loadingBusyIndicator.isActive = false;
                });

            }).error(function (data) {
                fdm.msgText = "An Error Accrued .";
                fdm.msgColor = "#ff0000";
                console.log(data);
                fdm.loadingBusyIndicator.isActive = false;
            });
        }
    }
    //cut function

    fdm.cut = function () {
        if (fdm.selectedIndex > 0) {
            fdm.fileIdToCut = fdm.selectedIndex;
            fdm.fileNameToCut = fdm.selectedFileName;
        }
        else {

            fdm.msgText = "No File Selected.";
            fdm.msgColor = "#ff0000";
        }

        fdm.msgText = "Copeid To ClipBoard .";
        fdm.msgColor = "#007e1e";
        fdm.CutType = fdm.fileTypes;
        fdm.fileIdToCopy = -1;       // Cancel "Copy" on next Paste
    }

    fdm.cutWork = function (id, name, parentFolderDes) {
        if (fdm.CutType == 1) { // file type
            if (fdm.fileIsExist(name)) {
                if (confirm('File "' + name + '" is already exist. Replace?')) {
                    fdm.itemClicked(null, fdm.fileIdToDelete, fdm.CutType);
                    fdm.fileTypes = 1;
                    // fdm.delete(true); ---------------------------------
                    // Type is file
                    fdm.loadingBusyIndicator.isActive = true;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", fdm.fileIdToDelete, 'GET').success(function (response) {
                        ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response.Item, 'POST').success(function (response) {
                            if (response.IsSuccess) {
                                fdm.remove(fdm.FileList, fdm.fileIdToDelete);
                                fdm.cutWork(id, name, parentFolderDes);
                                fdm.loadingBusyIndicator.isActive = false;
                            }
                        }).error(function (data, errCode, c, d) {
                            console.log(data);
                            fdm.loadingBusyIndicator.isActive = false;
                        });
                    }).error(function (data) {
                        console.log(data);
                        fdm.msgText = "An error occrued during deleting the file!";
                        fdm.msgColor = "#ff0000";
                        fdm.loadingBusyIndicator.isActive = false;
                    });
                    // End of fdm.delete() ---------------------------------
                    return;
                } else {

                    fdm.msgText = "This filename is alreadt exists";
                    fdm.msgColor = "#ff0000";
                    return;
                }
            }
            fdm.loadingBusyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", id, 'GET').success(function (response) {
                response.Item.LinkCategoryId = parentFolderDes;
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/edit', response.Item, 'PUT').success(function (response) {
                    if (fdm.FileList.length > 0) {
                        fdm.replace(fdm.FileList, response.Item);
                        fdm.refreshFolder();
                    } else {
                        fdm.FileList[0] = response.Item;
                    }
                    fdm.loadingBusyIndicator.isActive = false;
                    fdm.msgText = "Pasted successfully!";
                    fdm.msgColor = "#007e1e";
                }).error(function (data, errCode, c, d) {
                    fdm.msgText = "An Error Accrued .";
                    fdm.msgColor = "#ff0000";
                    console.log(data);
                    fdm.loadingBusyIndicator.isActive = false;
                });
            }).error(function (data) {
                fdm.msgText = "An Error Accrued .";
                fdm.msgColor = "#ff0000";
                console.log(data);
                fdm.loadingBusyIndicator.isActive = false;
            });

        } else if (fdm.CutType == 2) {             //folder type
            if (fdm.categoryIsExist(name)) {      // Chekc if file exists and keep the existed fileId in FileIdToDelete  
                if (confirm('File "' + name + '" Is Exist , are sure to delete file ?')) {
                    fdm.itemClicked(null, fdm.fileIdToDelete, fdm.CutType);
                    fdm.fileTypes = 2;
                    // fdm.delete(true); ---------------------------------
                    // Type is folder
                    fdm.loadingBusyIndicator.isActive = true;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/GetOne", fdm.fileIdToDelete, 'GET').success(function (response) {
                        ajax.call(cmsServerConfig.configApiServerPath+'FileCategory/delete', response.Item, 'POST').success(function (response) {
                            if (response.IsSuccess) {
                                fdm.remove(fdm.categoryList, fdm.fileIdToDelete);
                                fdm.cutWork(id, name, parentFolderDes);
                                fdm.loadingBusyIndicator.isActive = false;
                            }
                        }).error(function (data, errCode, c, d) {
                            fdm.msgText = "An error occrued during deleting the folder!";
                            fdm.msgColor = "#ff0000";
                            console.log(data);
                        });
                    }).error(function (data) {
                        console.log(data);
                        fdm.msgText = "An Error Accrued .";
                        fdm.msgColor = "#ff0000";
                        fdm.loadingBusyIndicator.isActive = false;
                    });
                    // End of fdm.delete() ---------------------------------
                    return;
                } else {

                    fdm.msgText = "File is Exist .";
                    fdm.msgColor = "#ff0000";
                    return;
                }
            }
            fdm.loadingBusyIndicator.isActive = true;

            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/GetOne", id, 'GET').success(function (response) {
                response.Item.LinkParentId = fdm.thisCategory;
                ajax.call(cmsServerConfig.configApiServerPath+'FileCategory/edit', response.Item, 'PUT').success(function (response) {
                    fdm.replace(fdm.categoryList, response.Item);
                    fdm.refreshFolder();
                    fdm.loadingBusyIndicator.isActive = false;
                    fdm.msgText = "Pasted Succeccfully .";
                    fdm.msgColor = "#007e1e";
                }).error(function (data, errCode, c, d) {
                    fdm.msgText = "An Error Accrued .";
                    fdm.msgColor = "#ff0000";
                    console.log(data);
                    fdm.loadingBusyIndicator.isActive = false;
                });

            }).error(function (data) {
                fdm.msgText = "An Error Accrued .";
                fdm.msgColor = "#ff0000";
                console.log(data);
                fdm.loadingBusyIndicator.isActive = false;
            });

        } else {
            fdm.msgText = "Not File Or Folder Detected .";
            fdm.msgColor = "#ff0000";
        }

    }
    //paste
    fdm.paste = function () {
        if (fdm.fileIdToCopy == fdm.fileIdToCut) {
            fdm.msgText = "Your have selected the same file to Copy and Cut. Please reselect file and action .";
            fdm.msgColor = "#ff0000";
            fdm.fileIdToCopy = 0;
            fdm.fileIdToCut = 0;
            return;
        }

        if (fdm.fileIdToCopy > 0)
            fdm.copyWork(fdm.fileIdToCopy, fdm.fileNameToCopy, fdm.thisCategory);
        if (fdm.fileIdToCut > 0)
            fdm.cutWork(fdm.fileIdToCut, fdm.fileNameToCut, fdm.thisCategory);
    }

    //rename function
    fdm.rename = function () {
        if (fdm.selectedIndex > 0) {
            filename = "";
            extension = "";
            if (fdm.fileTypes == 1) {
                filename = fdm.selectedFileName.substring(0, fdm.selectedFileName.lastIndexOf('.'));
                extension = fdm.selectedFileName.substring(fdm.selectedFileName.lastIndexOf('.'));
            } if (fdm.fileTypes == 2) {
                filename = fdm.selectedCategoryTitle;
            }
            fdm.fileIdToRename = fdm.selectedIndex;
            var newFileName = prompt("Enter New File Name :", filename);
            if (newFileName != null) {
                if (!fdm.fileIsExist(newFileName + extension) && fdm.fileTypes == 1 || !fdm.fileIsExist(newFileName) && fdm.fileTypes == 2)  // fdm.selectedFileName = filename + extention
                    fdm.renameFile(newFileName);
                else {
                    if (fdm.fileTypes == 1)
                        fdm.msgText = "This file name already exists.";
                    if (fdm.fileTypes == 2)
                        fdm.msgText = "This folder name already exists.";
                    fdm.msgColor = "#ff0000";
                }
            }
        } else {
            fdm.msgText = "No File Selected .";
            fdm.msgColor = "#ff0000";
        }
    }

    fdm.renameFile = function (newFileName) {
        if (fdm.fileTypes == 1) { // file type
            ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", fdm.fileIdToRename, 'GET').success(function (response) {
                var ext = response.Item.FileName.split('.').pop();
                response.Item.FileName = newFileName + "." + ext;
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/edit', response.Item, 'PUT').success(function (response) {
                    fdm.replace(fdm.FileList, response.Item);
                    fdm.loadingBusyIndicator.isActive = false;
                    fdm.refreshFolder();
                }).error(function (data, errCode, c, d) {
                    fdm.msgText = "An Error Accrued .";
                    fdm.msgColor = "#ff0000";
                    console.log(data);
                    fdm.loadingBusyIndicator.isActive = false;
                });

            }).error(function (data) {
                fdm.msgText = "An Error Accrued .";
                fdm.msgColor = "#ff0000";
                console.log(data);
                fdm.loadingBusyIndicator.isActive = false;
            });

        } else if (fdm.fileTypes == 2) { //folder type
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/GetOne", fdm.fileIdToRename, 'GET').success(function (response) {
                response.Item.Title = newFileName;
                ajax.call(cmsServerConfig.configApiServerPath+'FileCategory/edit', response.Item, 'PUT').success(function (response) {
                    fdm.replace(fdm.categoryList, response.Item);
                    fdm.loadingBusyIndicator.isActive = false;
                    fdm.refreshFolder();
                }).error(function (data, errCode, c, d) {
                    fdm.msgText = "An Error Accrued .";
                    fdm.msgColor = "#ff0000";
                    console.log(data);
                    fdm.loadingBusyIndicator.isActive = false;
                });

            }).error(function (data) {
                fdm.msgText = "An Error Accrued .";
                fdm.msgColor = "#ff0000";
                console.log(data);
                fdm.loadingBusyIndicator.isActive = false;
            });

        } else {
            fdm.msgText = "Not File Or Folder Detected .";
            fdm.msgColor = "#ff0000";
        }

    }
    //replace item
    fdm.replace = function (list, item) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].Id == item.Id)
                list[i] = item;
        }

    };
    //change file type  icon
    fdm.setFileViewByType = function (filename) {
        var ext = filename.split('.').pop();
        var classCss = "";
        switch (ext) {
            case "jpg":
                classCss = "fa-file-image-o";
                break;
            case "jpeg":
                classCss = "fa-file-image-o";
                break;
            case "png":
                classCss = "fa-file-image-o";
                break;
            case "bmp":
                classCss = "fa-file-image-o";
                break;
            case "gif":
                classCss = "fa-file-image-o";
                break;
            case "doc":
                classCss = "fa-file-word-o";
                break;
            case "docx":
                classCss = "fa-file-word-o";
                break;
            case "xls":
                classCss = "fa-file-excel-o";
                break;
            case "xlsx":
                classCss = "fa-file-excel-o";
                break;
            case "ppt":
                classCss = "fa-file-powerpoint-o";
                break;
            case "pptx":
                classCss = "fa-file-powerpoint-o";
                break;
            case "ttf":
                classCss = "fa-font";
                break;
            case "mp3":
                classCss = "fa-file-sound-o";
                break;
            case "ogg":
                classCss = "fa-file-sound-o";
                break;
            case "mp4":
                classCss = "fa-file-movie-o";
                break;
            case "avi":
                classCss = "fa-file-movie-o";
                break;
            case "flv":
                classCss = "fa-file-movie-o";
                break;
            case "pdf":
                classCss = "fa-file-pdf-o";
                break;
            case "zip":
                classCss = "fa-file-archive-o";
                break;
            case "rar":
                classCss = "fa-file-archive-o";
                break;
            case "tar":
                classCss = "fa-file-archive-o";
                break;
            case "txt":
                classCss = "fa-file-text-o";
                break;
            case "php":
                classCss = "fa-file-code-o";
                break;
            case "asp":
                classCss = "fa-file-code-o";
                break;
            case "java":
                classCss = "fa-file-code-o";
                break;
            case "py":
                classCss = "fa-file-code-o";
                break;
            case "html":
                classCss = "fa-internet-explorer";
                break;
            case "htm":
                classCss = "fa-internet-explorer";
                break;
            case "conf":
                classCss = "fa-gears";
                break;
            case "ini":
                classCss = "fa-gears";
                break;
            default:
                classCss = "fa-file";

        }
        return classCss;
    };
    //file is exist
    fdm.fileIsExist = function (fileName) {
        for (var i = 0; i < fdm.FileList.length; i++) {
            if (fdm.FileList[i].FileName == fileName) {
                fdm.fileIdToDelete = fdm.FileList[i].Id;
                return true;
            }
        }
        return false;
    }

    //category is exist
    fdm.categoryIsExist = function (folderName) {
        for (var i = 0; i < fdm.categoryList.length; i++) {
            if (fdm.categoryList[i].Title == folderName && fdm.categoryList[i].LinkParentId == fdm.thisCategory) {
                return true;
            }
        }
        return false;
    }

    // sort compare
    function compare(a, b) {
        if (a.FileName < b.FileName)
            return -1;
        else if (a.FileName > b.FileName)
            return 1;
        else
            return 0;
    }

    function compareCategory(a, b) {
        if (a.Title < b.Title)
            return -1;
        else if (a.Title > b.Title)
            return 1;
        else
            return 0;
    }

    fdm.remove = function (list, item) {
        for (i = 0; i < list.length; i++) {
            if (list[i].Id == item) {
                list.splice(i, 1);
                fdm.refreshFolder();
            }
        }

    }

    fdm.getNextFolderName = function () {
        count = 0;
        notFound = true;
        while (notFound) {
            for (i = 0; i < fdm.CurrentCategoryList.length; i++) {
                if (fdm.CurrentCategoryList[i].Title == "New Folder (" + count + ")") {
                    count++;
                    i = 0;
                    continue;
                }

            }
            notFound = false;
        }
        return "New Folder (" + count + ")";
    }

    fdm.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    fdm.whatcolor = function (progress) {
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

    fdm.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }

    fdm.closeModal = function () {
        $modalStack.dismissAll();
    }

    //var dropZone = document.getElementById('dropZone');

    //// Optional.   Show the copy icon when dragging over.  Seems to only work for chrome.
    //dropZone.addEventListener('dragover', function (e) {
    //    e.stopPropagation();
    //    e.preventDefault();
    //    e.dataTransfer.dropEffect = 'copy';
    //});

    //// Get file data on drop
    //dropZone.addEventListener('drop', function (e) {
    //    e.stopPropagation();
    //    e.preventDefault();
    //    var files = e.dataTransfer.files; // Array of all files
    //    for (var i = 0; i < files.length; i++) {
    //        fdm.uploadFile2(0, files[i]);
    //        if (file[i].type.match(/image.*/)) {
    //            console.log(file);
    //        }
    //    }
    //});

    fdm.uploadFile2 = function (index, name) {

        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response) {
            fdm.FileItem = response.Item;
            fdm.FileItem.FileName = name;
            fdm.FileItem.Extension = name.split('.').pop();
            fdm.FileItem.FileSrc = name;
            fdm.FileItem.LinkCategoryId = fdm.thisCategory;
            // ------- fdm.saveNewFile()  ----------------------
            var result = 0;
            ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", fdm.FileItem, 'POST').success(function (response) {
                fdm.loadingBusyIndicator.isActive = false;
                if (response.IsSuccess) {
                    fdm.FileItem = response.Item;
                    fdm.showSuccessIcon();
                    fdm.refreshFolder();
                    fdm.loadingBusyIndicator.isActive = false;
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-check");
                }
                else {
                    fdm.msgText = "Saving new file was not successful!";
                    fdm.msgColor = "#ff0000";
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-remove");

                }
            }).error(function (data) {
                fdm.msgText = "An error occured during saving process!";
                fdm.msgColor = "#ff0000";
                fdm.showErrorIcon();
                fdm.loadingBusyIndicator.isActive = false;
                $("#save-icon" + index).removeClass("fa-save");
                $("#save-button" + index).removeClass("flashing-button");
                $("#save-icon" + index).addClass("fa-remove");
            });
            //-----------------------------------
            fdm.loadingBusyIndicator.isActive = false;
        }).error(function (data) {
            console.log(data);
            fdm.msgText = "An error occrued during getviewmodel!";
            fdm.msgColor = "#ff0000";
            fdm.loadingBusyIndicator.isActive = false;
            $("#save-icon" + index).removeClass("fa-save");
            $("#save-button" + index).removeClass("flashing-button");
            $("#save-icon" + index).addClass("fa-remove");
        });

    }


    //#help# image edit
    fdm.imageFileEdit = function (Id, FileName) {
        var DownloadModel = {
            id: null,
            name: null
        };
        if (Id === undefined && FileName === undefined) {
            DownloadModel.id = fdm.selectedFileId;
            DownloadModel.name = fdm.selectedFileName;
        } else {
            DownloadModel.id = Id;
            DownloadModel.name = FileName;
        }
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/imageFileEdit", DownloadModel, 'POST').success(function (response) {
            fdm.loadingBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                fdm.msgText = "فایل عکس به رزولیشن عکس وب ذخیره شد";
                fdm.msgColor = "#ff0000";
                fdm.showErrorIcon();

            }
            else {
                fdm.msgText = "برروز خطا";
                fdm.msgColor = "#ff0000";
                fdm.showErrorIcon();
                fdm.loadingBusyIndicator.isActive = false;
            }
        }).error(function (data) {
            fdm.msgText = "An error occured during saving process!";
            fdm.msgColor = "#ff0000";
            fdm.showErrorIcon();
            fdm.loadingBusyIndicator.isActive = false;
            return -1;
        });
    }
}]);