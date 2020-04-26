app.controller("linkManagementBillboardPatternController", ["$scope", "$state", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $state, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var linkManagementBillboardPattern = this;
    linkManagementBillboardPattern.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    var date = moment().format();
    //linkManagementBillboardPattern.selectedItem.VisitDate = date;
    linkManagementBillboardPattern.datePickerConfig = {
        defaultDate: date
    };
    linkManagementBillboardPattern.VisitDate = {
        defaultDate: date
    }
    linkManagementBillboardPattern.attachedFiles = [];
    linkManagementBillboardPattern.attachedFile = "";

    linkManagementBillboardPattern.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    linkManagementBillboardPattern.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    linkManagementBillboardPattern.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "linkManagementBillboardPatternCtrl") {
            localStorage.setItem('AddRequest', '');
            linkManagementBillboardPattern.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    linkManagementBillboardPattern.ContentList = [];

    linkManagementBillboardPattern.allowedSearch = [];
    if (itemRecordStatus != undefined) linkManagementBillboardPattern.itemRecordStatus = itemRecordStatus;
    linkManagementBillboardPattern.init = function () {
        linkManagementBillboardPattern.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = linkManagementBillboardPattern.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }
        ajax.call(cmsServerConfig.configApiServerPath+"linkManagementBillboardPattern/getAllSharingLinkType", {}, 'POST').success(function (response) {
            linkManagementBillboardPattern.SharingLinkType = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
            });
        ajax.call(cmsServerConfig.configApiServerPath+"linkManagementBillboardPattern/getAllSettingType", {}, 'POST').success(function (response) {
            linkManagementBillboardPattern.SettingType = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"linkManagementBillboardPattern/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementBillboardPattern.busyIndicator.isActive = false;
            linkManagementBillboardPattern.ListItems = response.ListItems;
            linkManagementBillboardPattern.gridOptions.fillData(linkManagementBillboardPattern.ListItems , response.resultAccess);
            linkManagementBillboardPattern.gridOptions.currentPageNumber = response.CurrentPageNumber;
            linkManagementBillboardPattern.gridOptions.totalRowCount = response.TotalRowCount;
            linkManagementBillboardPattern.gridOptions.rowPerPage = response.RowPerPage;
            linkManagementBillboardPattern.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            linkManagementBillboardPattern.busyIndicator.isActive = false;
            linkManagementBillboardPattern.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //linkManagementBillboardPattern.busyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+'linkManagementBillboardPattern/getall', {}, 'POST').success(function (response) {
        //    linkManagementBillboardPattern.ContentList = response.ListItems;
        //    linkManagementBillboardPattern.busyIndicator.isActive = false;
        //});
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        linkManagementBillboardPattern.checkRequestAddNewItemFromOtherControl(null);
    }
    linkManagementBillboardPattern.busyIndicator.isActive = true;
    linkManagementBillboardPattern.addRequested = false;
    linkManagementBillboardPattern.openAddModal = function () {
        linkManagementBillboardPattern.filePickerMainImage.filename = "";
        linkManagementBillboardPattern.filePickerMainImage.fileId = null;
        linkManagementBillboardPattern.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementBillboardPattern/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementBillboardPattern.busyIndicator.isActive = false;
            linkManagementBillboardPattern.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleLinkManagement/linkManagementBillboardPattern/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    linkManagementBillboardPattern.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        linkManagementBillboardPattern.busyIndicator.isActive = true;
        linkManagementBillboardPattern.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementBillboardPattern/add', linkManagementBillboardPattern.selectedItem, 'POST').success(function (response) {
            linkManagementBillboardPattern.addRequested = false;
            linkManagementBillboardPattern.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                linkManagementBillboardPattern.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                linkManagementBillboardPattern.ListItems.unshift(response.Item);
                linkManagementBillboardPattern.gridOptions.fillData(linkManagementBillboardPattern.ListItems);
                linkManagementBillboardPattern.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            linkManagementBillboardPattern.busyIndicator.isActive = false;
            linkManagementBillboardPattern.addRequested = false;
        });
    }


    linkManagementBillboardPattern.openEditModal = function () {

        linkManagementBillboardPattern.modalTitle = 'ویرایش';
        if (!linkManagementBillboardPattern.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementBillboardPattern/GetOne', linkManagementBillboardPattern.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementBillboardPattern.selectedItem = response.Item;
            linkManagementBillboardPattern.VisitDate.defaultDate = linkManagementBillboardPattern.selectedItem.VisitDate;
            linkManagementBillboardPattern.filePickerMainImage.filename = null;
            linkManagementBillboardPattern.filePickerMainImage.fileId = null;
            if (response.Item.LinkMainImageId != null) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', response.Item.LinkMainImageId, 'GET').success(function (response2) {
                    linkManagementBillboardPattern.filePickerMainImage.filename = response2.Item.FileName;
                    linkManagementBillboardPattern.filePickerMainImage.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            linkManagementBillboardPattern.parseFileIds(response.Item.LinkFileIds);
            linkManagementBillboardPattern.filePickerFiles.filename = null;
            linkManagementBillboardPattern.filePickerFiles.fileId = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleLinkManagement/linkManagementBillboardPattern/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    linkManagementBillboardPattern.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        linkManagementBillboardPattern.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementBillboardPattern/edit', linkManagementBillboardPattern.selectedItem, 'PUT').success(function (response) {
            linkManagementBillboardPattern.addRequested = true;
            rashaErManage.checkAction(response);
            linkManagementBillboardPattern.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                linkManagementBillboardPattern.addRequested = false;
                linkManagementBillboardPattern.replaceItem(linkManagementBillboardPattern.selectedItem.Id, response.Item);
                linkManagementBillboardPattern.gridOptions.fillData(linkManagementBillboardPattern.ListItems);
                linkManagementBillboardPattern.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            linkManagementBillboardPattern.addRequested = false;
        });
    }


    linkManagementBillboardPattern.closeModal = function () {
        $modalStack.dismissAll();
    };

    linkManagementBillboardPattern.replaceItem = function (oldId, newItem) {
        angular.forEach(linkManagementBillboardPattern.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = linkManagementBillboardPattern.ListItems.indexOf(item);
                linkManagementBillboardPattern.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            linkManagementBillboardPattern.ListItems.unshift(newItem);
    }

    linkManagementBillboardPattern.deleteRow = function () {
        if (!linkManagementBillboardPattern.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                linkManagementBillboardPattern.busyIndicator.isActive = true;
                console.log(linkManagementBillboardPattern.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'linkManagementBillboardPattern/GetOne', linkManagementBillboardPattern.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    linkManagementBillboardPattern.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'linkManagementBillboardPattern/delete', linkManagementBillboardPattern.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        linkManagementBillboardPattern.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            linkManagementBillboardPattern.replaceItem(linkManagementBillboardPattern.selectedItemForDelete.Id);
                            linkManagementBillboardPattern.gridOptions.fillData(linkManagementBillboardPattern.ListItems);
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

    linkManagementBillboardPattern.searchData = function () {
        linkManagementBillboardPattern.gridOptions.serachData();
    }
    //linkManagementBillboardPattern.LinkManagementMemberIdSelector = {
    //    displayMember: 'Id',
    //    id: 'Id',
    //    fId: 'LinkManagementMemberId',
    //    url: 'LinkManagementMember',
    //    sortColumn: 'Id',
    //    sortType: 0,
    //    filterText: 'Id',
    //    rowPerPage: 200,
    //    scope: linkManagementBillboardPattern,
    //    columnOptions: {
    //        columns: [
    //           { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
               
    //        ]
    //    }
    //}



    linkManagementBillboardPattern.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: "string" },
            { name: 'ClickPrice', displayName: 'قیمت کلیک', sortable: true, type: "integer" },
            { name: 'ViewPrice', displayName: 'قیمت نمایش', sortable: true, type: 'integer', visible: true },
            { name: 'Width', displayName: 'عرض', sortable: true, type: 'integer', visible: true },
            { name: 'Height', displayName: 'ارتفاع', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: "ActionKey1", displayName: 'billboard', displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="linkManagementBillboardPattern.ShowBillboard(x.Id)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-eye" aria-hidden="true"></i></Button>' },
            { name: "ActionKey2", displayName: 'target', displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="linkManagementBillboardPattern.ShowTarget(x.Id)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-eye" aria-hidden="true"></i></Button>' },
            { name: "ActionKey3", displayName: 'log', displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="linkManagementBillboardPattern.ShowLog(x.Id)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-eye" aria-hidden="true"></i></Button>' }
           

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    linkManagementBillboardPattern.gridOptions.advancedSearchData = {};
    linkManagementBillboardPattern.gridOptions.advancedSearchData.engine = {};
    linkManagementBillboardPattern.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    linkManagementBillboardPattern.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    linkManagementBillboardPattern.gridOptions.advancedSearchData.engine.SortType = 1;
    linkManagementBillboardPattern.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    linkManagementBillboardPattern.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    linkManagementBillboardPattern.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    linkManagementBillboardPattern.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    linkManagementBillboardPattern.gridOptions.advancedSearchData.engine.Filters = [];


    linkManagementBillboardPattern.ShowBillboard = function (selectedId) {
        $state.go("index.linkmanagementbillboard", { BillBoardPatternId: selectedId });
    }
    linkManagementBillboardPattern.ShowTarget = function (selectedId) {
        $state.go("index.linkmanagementtarget", { BillBoardPatternId: selectedId });
    }
    linkManagementBillboardPattern.ShowLog = function (selectedId) {
        $state.go("index.linkmanagementtargetbillboardlog", { BillBoardPatternId: selectedId });
    }



    linkManagementBillboardPattern.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            linkManagementBillboardPattern.focusExpireLockAccount = true;
        });
    };

    linkManagementBillboardPattern.gridOptions.reGetAll = function () {
        linkManagementBillboardPattern.init();
    }

    linkManagementBillboardPattern.columnCheckbox = false;
    linkManagementBillboardPattern.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (linkManagementBillboardPattern.gridOptions.columnCheckbox) {
            for (var i = 0; i < linkManagementBillboardPattern.gridOptions.columns.length; i++) {
                //linkManagementBillboardPattern.gridOptions.columns[i].visible = $("#" + linkManagementBillboardPattern.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + linkManagementBillboardPattern.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                linkManagementBillboardPattern.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = linkManagementBillboardPattern.gridOptions.columns;
            for (var i = 0; i < linkManagementBillboardPattern.gridOptions.columns.length; i++) {
                linkManagementBillboardPattern.gridOptions.columns[i].visible = true;
                var element = $("#" + linkManagementBillboardPattern.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + linkManagementBillboardPattern.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < linkManagementBillboardPattern.gridOptions.columns.length; i++) {
            console.log(linkManagementBillboardPattern.gridOptions.columns[i].name.concat(".visible: "), linkManagementBillboardPattern.gridOptions.columns[i].visible);
        }
        linkManagementBillboardPattern.gridOptions.columnCheckbox = !linkManagementBillboardPattern.gridOptions.columnCheckbox;
    }


    linkManagementBillboardPattern.deleteAttachedFile = function (index) {
        linkManagementBillboardPattern.attachedFiles.splice(index, 1);
    }

    linkManagementBillboardPattern.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !linkManagementBillboardPattern.alreadyExist(id, linkManagementBillboardPattern.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = {
                id: fId, name: fname
            };
            linkManagementBillboardPattern.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    linkManagementBillboardPattern.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    linkManagementBillboardPattern.filePickerMainImage.removeSelectedfile = function (config) {
        linkManagementBillboardPattern.filePickerMainImage.fileId = null;
        linkManagementBillboardPattern.filePickerMainImage.filename = null;
        linkManagementBillboardPattern.selectedItem.LinkMainImageId = null;

    }


    linkManagementBillboardPattern.filePickerFiles.removeSelectedfile = function (config) {
        linkManagementBillboardPattern.filePickerFiles.fileId = null;
        linkManagementBillboardPattern.filePickerFiles.filename = null;
        linkManagementBillboardPattern.selectedItem.LinkFileIds = null;
    }


    linkManagementBillboardPattern.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }

    // ----------- FilePicker Codes --------------------------------
    linkManagementBillboardPattern.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !linkManagementBillboardPattern.alreadyExist(id, linkManagementBillboardPattern.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            linkManagementBillboardPattern.attachedFiles.push(file);
            linkManagementBillboardPattern.clearfilePickers();
        }
    }

    linkManagementBillboardPattern.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                linkManagementBillboardPattern.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    linkManagementBillboardPattern.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;   //String is empty or whitespace then return
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            linkManagementBillboardPattern.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    linkManagementBillboardPattern.clearfilePickers = function () {
        linkManagementBillboardPattern.filePickerFiles.fileId = null;
        linkManagementBillboardPattern.filePickerFiles.filename = null;
    }

    linkManagementBillboardPattern.stringfyLinkFileIds = function () {
        $.each(linkManagementBillboardPattern.attachedFiles, function (i, item) {
            if (linkManagementBillboardPattern.selectedItem.LinkFileIds == "")
                linkManagementBillboardPattern.selectedItem.LinkFileIds = item.fileId;
            else
                linkManagementBillboardPattern.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    linkManagementBillboardPattern.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleLinkManagement/LinkManagementBillboard/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        linkManagementBillboardPattern.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            linkManagementBillboardPattern.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }
 

    linkManagementBillboardPattern.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    linkManagementBillboardPattern.whatcolor = function (progress) {
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

    linkManagementBillboardPattern.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    linkManagementBillboardPattern.replaceFile = function (name) {
        linkManagementBillboardPattern.itemClicked(null, linkManagementBillboardPattern.fileIdToDelete, "file");
        linkManagementBillboardPattern.fileTypes = 1;
        linkManagementBillboardPattern.fileIdToDelete = linkManagementBillboardPattern.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", linkManagementBillboardPattern.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    linkManagementBillboardPattern.remove(linkManagementBillboardPattern.FileList, linkManagementBillboardPattern.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                linkManagementBillboardPattern.FileItem = response3.Item;
                                linkManagementBillboardPattern.FileItem.FileName = name;
                                linkManagementBillboardPattern.FileItem.Extension = name.split('.').pop();
                                linkManagementBillboardPattern.FileItem.FileSrc = name;
                                linkManagementBillboardPattern.FileItem.LinkCategoryId = linkManagementBillboardPattern.thisCategory;
                                linkManagementBillboardPattern.saveNewFile();
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
    linkManagementBillboardPattern.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", linkManagementBillboardPattern.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                linkManagementBillboardPattern.FileItem = response.Item;
                linkManagementBillboardPattern.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            linkManagementBillboardPattern.showErrorIcon();
            return -1;
        });
    }

    linkManagementBillboardPattern.showSuccessIcon = function () {
    }

    linkManagementBillboardPattern.showErrorIcon = function () {

    }
    //file is exist
    linkManagementBillboardPattern.fileIsExist = function (fileName) {
        for (var i = 0; i < linkManagementBillboardPattern.FileList.length; i++) {
            if (linkManagementBillboardPattern.FileList[i].FileName == fileName) {
                linkManagementBillboardPattern.fileIdToDelete = linkManagementBillboardPattern.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    linkManagementBillboardPattern.getFileItem = function (id) {
        for (var i = 0; i < linkManagementBillboardPattern.FileList.length; i++) {
            if (linkManagementBillboardPattern.FileList[i].Id == id) {
                return linkManagementBillboardPattern.FileList[i];
            }
        }
    }

    //select file or folder
    linkManagementBillboardPattern.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            linkManagementBillboardPattern.fileTypes = 1;
            linkManagementBillboardPattern.selectedFileId = linkManagementBillboardPattern.getFileItem(index).Id;
            linkManagementBillboardPattern.selectedFileName = linkManagementBillboardPattern.getFileItem(index).FileName;
        }
        else {
            linkManagementBillboardPattern.fileTypes = 2;
            linkManagementBillboardPattern.selectedCategoryId = linkManagementBillboardPattern.getCategoryName(index).Id;
            linkManagementBillboardPattern.selectedCategoryTitle = linkManagementBillboardPattern.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        linkManagementBillboardPattern.selectedIndex = index;

    };
   
    //upload file
    linkManagementBillboardPattern.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (linkManagementBillboardPattern.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ linkManagementBillboardPattern.replaceFile(uploadFile.name);
                    linkManagementBillboardPattern.itemClicked(null, linkManagementBillboardPattern.fileIdToDelete, "file");
                    linkManagementBillboardPattern.fileTypes = 1;
                    linkManagementBillboardPattern.fileIdToDelete = linkManagementBillboardPattern.selectedIndex;
                    // replace the file
                    ajax
                        .call(
                            cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                            linkManagementBillboardPattern.fileIdToDelete,
                            "GET"
                        )
                        .success(function (response1) {
                            if (response1.IsSuccess == true) {
                                console.log(response1.Item);
                                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                                    .success(function (response2) {
                                        if (response2.IsSuccess == true) {
                                            linkManagementBillboardPattern.FileItem = response2.Item;
                                            linkManagementBillboardPattern.showSuccessIcon();
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-check");
                                            linkManagementBillboardPattern.filePickerMainImage.filename =
                                                linkManagementBillboardPattern.FileItem.FileName;
                                            linkManagementBillboardPattern.filePickerMainImage.fileId =
                                                response2.Item.Id;
                                            linkManagementBillboardPattern.selectedItem.LinkMainImageId =
                                                linkManagementBillboardPattern.filePickerMainImage.fileId;
                                        } else {
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-remove");
                                        }
                                    })
                                    .error(function (data) {
                                        linkManagementBillboardPattern.showErrorIcon();
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
                    linkManagementBillboardPattern.FileItem = response.Item;
                    linkManagementBillboardPattern.FileItem.FileName = uploadFile.name;
                    linkManagementBillboardPattern.FileItem.uploadName = uploadFile.uploadName;
                    linkManagementBillboardPattern.FileItem.Extension = uploadFile.name.split('.').pop();
                    linkManagementBillboardPattern.FileItem.FileSrc = uploadFile.name;
                    linkManagementBillboardPattern.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- linkManagementBillboardPattern.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", linkManagementBillboardPattern.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            linkManagementBillboardPattern.FileItem = response.Item;
                            linkManagementBillboardPattern.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            linkManagementBillboardPattern.filePickerMainImage.filename = linkManagementBillboardPattern.FileItem.FileName;
                            linkManagementBillboardPattern.filePickerMainImage.fileId = response.Item.Id;
                            linkManagementBillboardPattern.selectedItem.LinkMainImageId = linkManagementBillboardPattern.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        linkManagementBillboardPattern.showErrorIcon();
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
    linkManagementBillboardPattern.exportFile = function () {
        linkManagementBillboardPattern.addRequested = true;
        linkManagementBillboardPattern.gridOptions.advancedSearchData.engine.ExportFile = linkManagementBillboardPattern.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementBillboardPattern/exportfile', linkManagementBillboardPattern.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            linkManagementBillboardPattern.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                linkManagementBillboardPattern.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //linkManagementBillboardPattern.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    linkManagementBillboardPattern.toggleExportForm = function () {
        linkManagementBillboardPattern.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        linkManagementBillboardPattern.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        linkManagementBillboardPattern.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        linkManagementBillboardPattern.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        linkManagementBillboardPattern.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleLinkManagement/linkManagementBillboardPattern/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    linkManagementBillboardPattern.rowCountChanged = function () {
        if (!angular.isDefined(linkManagementBillboardPattern.ExportFileClass.RowCount) || linkManagementBillboardPattern.ExportFileClass.RowCount > 5000)
            linkManagementBillboardPattern.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    linkManagementBillboardPattern.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"linkManagementBillboardPattern/count", linkManagementBillboardPattern.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            linkManagementBillboardPattern.addRequested = false;
            rashaErManage.checkAction(response);
            linkManagementBillboardPattern.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            linkManagementBillboardPattern.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);