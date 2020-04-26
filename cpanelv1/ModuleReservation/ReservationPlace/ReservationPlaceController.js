app.controller("reservationplaceController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$stateParams', '$filter', '$rootScope', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $stateParams, $filter, $rootScope) {
    var place = this;
    place.boxes = [
        { element: 'video', width: 100, height: 100, pos_x: 50, pos_y: 60 },
        { element: 'image', width: 130, height: 100, pos_x: 90, pos_y: 100 },
        { element: 'nono', width: 20, height: 280, pos_x: 350, pos_y: 90 },
        { element: 'gogo', width: 200, height: 100, pos_x: 10, pos_y: 90 }
    ];
    place.resizableConfig = {
        mainDrag: 'mainDrag',
        sourceDrag: 'sourceDrag',
        deleteDrag: 'deleteDrag',
        values:[]
    }
    place.resizableConfig.values = [
        { element: 'video', width: 100, height: 100, pos_x: 50, pos_y: 60 },
        { element: 'image', width: 130, height: 100, pos_x: 90, pos_y: 100 },
        { element: 'nono', width: 20, height: 280, pos_x: 350, pos_y: 90 },
        { element: 'gogo', width: 200, height: 100, pos_x: 10, pos_y: 90 }
    ];

    //    [
    //      { type: "type1", height: 100, id: "a", left: 199, rotate: 0, top: 62, width: 200 },
    //  { type: "type2", height: 100, id: "b", left: 199, rotate: 30, top: 162, width: 300 }
    //];
    place.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    place.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    place.ViewNewUserDiv = false;
    place.ViewFindUserDiv = false;
    place.ViewInfoUserDiv = false;
    //place.UninversalMenus = [];
    //place.selectUniversalMenuOnUndetectableKey = true;
    if (itemRecordStatus != undefined) place.itemRecordStatus = itemRecordStatus;

    place.viewDetailPlace = false;
    place.init = function () {

        place.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = place.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        ajax.call(cmsServerConfig.configApiServerPath+"Reservationplace/getall", place.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            place.busyIndicator.isActive = false;
            place.ListItems = response.ListItems;

            // Call Excerpt Function to shorten the length of long strings
            //excerptField(place.ListItems, "BotToken");
            place.gridOptions.fillData(place.ListItems, response.resultAccess);
            place.gridOptions.currentPageNumber = response.CurrentPageNumber;
            place.gridOptions.totalRowCount = response.TotalRowCount;
            place.gridOptions.rowPerPage = response.RowPerPage;
            place.allowedSearch = response.AllowedSearchField;

        }).error(function (data, errCode, c, d) {
            place.busyIndicator.isActive = false;
            place.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });



    }
    includeMemberAdd = $scope;
    includeMemberAdd.selectedMember = [];
    // Open Add Modal
    place.busyIndicator.isActive = true;
    place.addRequested = false;
    place.openAddModal = function () {
        place.filePickerMainImage.filename = "";
        place.filePickerMainImage.fileId = null;
        place.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'Reservationplace/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            place.busyIndicator.isActive = false;
            place.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleReservation/Reservationplace/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            place.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    place.addNewRow = function (frm) {
        //if (frm.$invalid)
        //    return;
        place.busyIndicator.isActive = true;
        place.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'Reservationplace/add', place.selectedItem, 'POST').success(function (response) {
            place.addRequested = false;
            place.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {

                place.ListItems.unshift(response.Item);
                place.gridOptions.fillData(place.ListItems);
                place.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            place.busyIndicator.isActive = false;
            place.addRequested = false;
        });
    }


    place.openEditModal = function () {

        place.modalTitle = 'ویرایش';
        if (!place.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'Reservationplace/GetOne', place.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            place.selectedItem = response.Item;
            place.filePickerMainImage.filename = null;
            place.filePickerMainImage.fileId = null;
            if (response.Item.LinkBackgroundImageId != null) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', response.Item.LinkBackgroundImageId, 'GET').success(function (response2) {
                    place.filePickerMainImage.filename = response2.Item.FileName;
                    place.filePickerMainImage.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }

            $modal.open({
                templateUrl: 'cpanelv1/ModuleReservation/Reservationplace/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    place.editRow = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        //place.busyIndicator.isActive = true;
        place.addRequested = true;
        place.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'Reservationplace/edit', place.selectedItem, 'PUT').success(function (response) {
            place.addRequested = true;
            rashaErManage.checkAction(response);
            place.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                place.addRequested = false;
                place.replaceItem(place.selectedItem.Id, response.Item);
                place.gridOptions.fillData(place.ListItems);
                place.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            place.addRequested = false;
            place.busyIndicator.isActive = false;
        });
    }

    place.closeModal = function () {
        $modalStack.dismissAll();
    };

    place.replaceItem = function (oldId, newItem) {
        angular.forEach(place.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = place.ListItems.indexOf(item);
                place.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            place.ListItems.unshift(newItem);
    }

    place.deleteRow = function () {
        if (!place.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                place.busyIndicator.isActive = true;
                console.log(place.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'Reservationplace/GetOne', place.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    place.selectedItemForDelete = response.Item;
                    console.log(place.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'Reservationplace/delete', place.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        place.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            place.replaceItem(place.selectedItemForDelete.Id);
                            place.gridOptions.fillData(place.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        place.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    place.busyIndicator.isActive = false;

                });
            }
        });
    }

    place.searchData = function () {
        place.gridOptions.searchData();

    }
    place.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: "LinkBackgroundImageId", displayName: "عکس", sortable: true, visible: true, isThumbnailByFild: true, imageWidth: "80", imageHeight: "80" },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            { name: 'Address', displayName: 'آدرس', sortable: true, type: 'string', visible: true },
            { name: 'ImageWidth', displayName: 'عرض', sortable: true, type: 'integer', visible: true },
            { name: 'ImageHeight', displayName: 'ارتفاع', sortable: true, type: 'integer', visible: true },
            {
                name: 'ActionKey', displayName: 'طراحی', sortable: true, type: 'integer', visible: true, template:
                '<Button ng-if="!x.IsActivated" ng-click="place.DesignPlace(x)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>'
            },
        ],
        data: {},
        multiSelect: false,
        startDate: moment().format(),
        advancedSearchData: {
            engine: {}
        }
    }

    place.gridOptions.advancedSearchData = {};
    place.gridOptions.advancedSearchData.engine = {};
    place.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    place.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    place.gridOptions.advancedSearchData.engine.SortType = 1;
    place.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    place.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    place.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    place.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    place.gridOptions.advancedSearchData.engine.Filters = [];

    place.test = 'false';
    //open Design modal
    place.DesignPlace = function (item) {
        //place.ntkDragg.readFromDb(item.PlaceDetail, "divcontainer", "divcontainerdelete", "divcontainerSurce", event);
        ajax.call(cmsServerConfig.configApiServerPath+'Reservationplace/GetOne', item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            place.selectedItem = response.Item;
            place.filePickerMainImage.filename = null;
            place.filePickerMainImage.fileId = null;
            if (response.Item.LinkBackgroundImageId != null) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', response.Item.LinkBackgroundImageId, 'GET').success(function (response2) {
                    place.filePickerMainImage.filename = response2.Item.FileName;
                    place.filePickerMainImage.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
        place.myStyles = {
            'background-image': 'url("' + $rootScope.cmsServerConfig.configRouteThumbnails + item.LinkBackgroundImageId + '")',
            'width': item.ImageWidth + 'px',
            'height': item.ImageHeight + 'px',
            'margin-top': '10%'
        }
        place.viewDetailPlace = true;
    };
    place.SaveDesign = function (item) {

        // place.selectedItem.JsonPlaceValue = JSON.stringify(place.ntkDragg.valueGet());

        ajax.call(cmsServerConfig.configApiServerPath+'Reservationplace/edit', place.selectedItem, 'PUT').success(function (response) {
            place.addRequested = true;
            rashaErManage.checkAction(response);
            place.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                place.addRequested = false;
                place.replaceItem(place.selectedItem.Id, response.Item);
                place.gridOptions.fillData(place.ListItems);
                place.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            place.addRequested = false;
            place.busyIndicator.isActive = false;
        });

    }
    place.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            place.focusExpireLockAccount = true;
        });
    };

    place.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            place.focus = true;
        });
    };

    place.gridOptions.reGetAll = function () {
        place.init();
    }

    place.gridOptions.onRowSelected = function () {

    }

    place.columnCheckbox = false;
    place.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (place.gridOptions.columnCheckbox) {
            for (var i = 0; i < place.gridOptions.columns.length; i++) {
                //place.gridOptions.columns[i].visible = $("#" + place.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + place.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                place.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = place.gridOptions.columns;
            for (var i = 0; i < place.gridOptions.columns.length; i++) {
                place.gridOptions.columns[i].visible = true;
                var element = $("#" + place.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + place.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < place.gridOptions.columns.length; i++) {
            console.log(place.gridOptions.columns[i].name.concat(".visible: "), place.gridOptions.columns[i].visible);
        }
        place.gridOptions.columnCheckbox = !place.gridOptions.columnCheckbox;
    }



    place.filePickerMainImage.removeSelectedfile = function (config) {
        place.filePickerMainImage.fileId = null;
        place.filePickerMainImage.filename = null;
        place.selectedItem.LinkBackgroundImageId = null;

    }

    //---------------Upload Modal-------------------------------
    place.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleReservation/Reservationplace/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        place.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            place.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }


    place.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    place.whatcolor = function (progress) {
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

    place.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    place.replaceFile = function (name) {
        place.itemClicked(null, place.fileIdToDelete, "file");
        place.fileTypes = 1;
        place.fileIdToDelete = place.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", place.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    place.remove(place.FileList, place.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                place.FileItem = response3.Item;
                                place.FileItem.FileName = name;
                                place.FileItem.Extension = name.split('.').pop();
                                place.FileItem.FileSrc = name;
                                place.FileItem.LinkCategoryId = place.thisCategory;
                                place.saveNewFile();
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
    place.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", place.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                place.FileItem = response.Item;
                place.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            place.showErrorIcon();
            return -1;
        });
    }

    place.showSuccessIcon = function () {
    }

    place.showErrorIcon = function () {

    }
    //file is exist
    place.fileIsExist = function (fileName) {
        for (var i = 0; i < place.FileList.length; i++) {
            if (place.FileList[i].FileName == fileName) {
                place.fileIdToDelete = place.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    place.getFileItem = function (id) {
        for (var i = 0; i < place.FileList.length; i++) {
            if (place.FileList[i].Id == id) {
                return place.FileList[i];
            }
        }
    }

    //select file or folder
    place.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            place.fileTypes = 1;
            place.selectedFileId = place.getFileItem(index).Id;
            place.selectedFileName = place.getFileItem(index).FileName;
        }
        else {
            place.fileTypes = 2;
            place.selectedCategoryId = place.getCategoryName(index).Id;
            place.selectedCategoryTitle = place.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        place.selectedIndex = index;

    };
    //upload file
    place.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (place.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ place.replaceFile(uploadFile.name);
                    place.itemClicked(null, place.fileIdToDelete, "file");
                    place.fileTypes = 1;
                    place.fileIdToDelete = place.selectedIndex;
                    // replace the file
                    ajax
                      .call(
                        cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                        place.fileIdToDelete,
                        "GET"
                      )
                      .success(function (response1) {
                          if (response1.IsSuccess == true) {
                              console.log(response1.Item);
                              ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                                .success(function (response2) {
                                    if (response2.IsSuccess == true) {
                                        place.FileItem = response2.Item;
                                        place.showSuccessIcon();
                                        $("#save-icon" + index).removeClass("fa-save");
                                        $("#save-button" + index).removeClass(
                                          "flashing-button"
                                        );
                                        $("#save-icon" + index).addClass("fa-check");
                                        place.filePickerMainImage.filename =
                                          place.FileItem.FileName;
                                        place.filePickerMainImage.fileId =
                                          response2.Item.Id;
                                        place.selectedItem.LinkBackgroundImageId =
                                          place.filePickerMainImage.fileId;
                                    } else {
                                        $("#save-icon" + index).removeClass("fa-save");
                                        $("#save-button" + index).removeClass(
                                          "flashing-button"
                                        );
                                        $("#save-icon" + index).addClass("fa-remove");
                                    }
                                })
                                .error(function (data) {
                                    place.showErrorIcon();
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
            }
            else { // File does not exists
                // Save New file
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response) {
                    place.FileItem = response.Item;
                    place.FileItem.FileName = uploadFile.name;
                    place.FileItem.uploadName = uploadFile.uploadName;
                    place.FileItem.Extension = uploadFile.name.split('.').pop();
                    place.FileItem.FileSrc = uploadFile.name;
                    place.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- place.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", place.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            place.FileItem = response.Item;
                            place.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            place.filePickerMainImage.filename = place.FileItem.FileName;
                            place.filePickerMainImage.fileId = response.Item.Id;
                            place.selectedItem.LinkBackgroundImageId = place.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        place.showErrorIcon();
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
    //Export Report 
    place.exportFile = function () {
        place.addRequested = true;
        place.gridOptions.advancedSearchData.engine.ExportFile = place.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'Reservationplace/exportfile', place.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            place.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                place.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //place.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    place.toggleExportForm = function () {
        place.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        place.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        place.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        place.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        place.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleReservation/Reservationplace/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    place.rowCountChanged = function () {
        if (!angular.isDefined(place.ExportFileClass.RowCount) || place.ExportFileClass.RowCount > 5000)
            place.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    place.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"Reservationplace/count", place.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            place.addRequested = false;
            rashaErManage.checkAction(response);
            place.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            place.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

