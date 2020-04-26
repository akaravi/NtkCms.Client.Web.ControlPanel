app.controller("campaignDetailLogController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var campaignDetailLog = this;
    campaignDetailLog.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    campaignDetailLog.gridOptions = {};
    campaignDetailLog.selectedItem = {};
    campaignDetailLog.attachedFiles = [];
    campaignDetailLog.attachedFile = "";

    campaignDetailLog.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    campaignDetailLog.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    campaignDetailLog.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    campaignDetailLog.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:campaignDetailLog.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:campaignDetailLog,
        useCurrentLocationZoom:12,
    }

    if (itemRecordStatus != undefined) campaignDetailLog.itemRecordStatus = itemRecordStatus;

    // Many To Many
    // MemberUserGroup  جدول واسط
    // LinkMemberUserId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    campaignDetailLog.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    

    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        campaignDetailLog.memberGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    //campaignDetailLog.hasInMany2Many = function (OtherTable) {
    //    if (campaignDetailLog.selectedMemberUser == null || campaignDetailLog.selectedMemberUser[thisTableFieldICollection] == undefined || campaignDetailLog.selectedMemberUser[thisTableFieldICollection] == null) return false;
    //    return objectFindByKey(campaignDetailLog.selectedMemberUser[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    //};
    campaignDetailLog.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (campaignDetailLog.hasInMany2Many(OtherTable)) {
            //var index = campaignDetailLog.selectedMemberUser[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(campaignDetailLog.selectedMemberUser[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            campaignDetailLog.selectedMemberUser[thisTableFieldICollection].splice(index, 1);
        } else {
            campaignDetailLog.selectedMemberUser[thisTableFieldICollection].push(obj);
        }
    }
    // array = [{key:value},{key:value}]
    function objectFindByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                var obj = {};
                obj[key] = value;
                array[i] = obj;
                return true;
            }
        }
        return false;
    }

    // Find an object in an array of objects and return its index if object is found, -1 if not 
    function arrayObjectIndexOf(myArray, searchTerm, property) {
        for (var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i][property] === searchTerm) return i;
        }
        return -1;
    }
    // End of Many To Many ========================================================================

    campaignDetailLog.init = function () {
        campaignDetailLog.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = campaignDetailLog.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"campaignDetailLog/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetailLog.busyIndicator.isActive = false;
            campaignDetailLog.ListItems = response.ListItems;
            campaignDetailLog.gridOptions.fillData(campaignDetailLog.ListItems, response.resultAccess);
            campaignDetailLog.gridOptions.currentPageNumber = response.CurrentPageNumber;
            campaignDetailLog.gridOptions.totalRowCount = response.TotalRowCount;
            campaignDetailLog.gridOptions.rowPerPage = response.RowPerPage;
            campaignDetailLog.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            campaignDetailLog.busyIndicator.isActive = false;
            campaignDetailLog.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    campaignDetailLog.busyIndicator.isActive = true;
    campaignDetailLog.attachedFiles = [];
    campaignDetailLog.attachedFile = "";
    campaignDetailLog.filePickerMainImage.filename = "";
    campaignDetailLog.filePickerMainImage.fileId = null;
    campaignDetailLog.filePickerFiles.filename = "";
    campaignDetailLog.filePickerFiles.fileId = null;
    campaignDetailLog.addRequested = false;
    campaignDetailLog.openAddModal = function () {
        campaignDetailLog.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailLog/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetailLog.busyIndicator.isActive = false;
            campaignDetailLog.selectedItem = response.Item;
            campaignDetailLog.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCampaign/campaignDetailLog/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignDetailLog.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    campaignDetailLog.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        campaignDetailLog.busyIndicator.isActive = true;
        campaignDetailLog.addRequested = true;
        //Save attached file ids into campaignDetailLog.selectedItem.LinkFileIds
        campaignDetailLog.selectedItem.LinkFileIds = "";
        campaignDetailLog.stringfyLinkFileIds();
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailLog/add', campaignDetailLog.selectedItem, 'POST').success(function (response) {
            campaignDetailLog.addRequested = false;
            campaignDetailLog.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignDetailLog.gridOptions.advancedSearchData.engine.Filters = null;
                campaignDetailLog.gridOptions.advancedSearchData.engine.Filters = [];
                campaignDetailLog.ListItems.unshift(response.Item);
                campaignDetailLog.gridOptions.fillData(campaignDetailLog.ListItems);
                campaignDetailLog.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignDetailLog.busyIndicator.isActive = false;
            campaignDetailLog.addRequested = false;
        });
    }

    campaignDetailLog.openEditModal = function () {

        campaignDetailLog.modalTitle = 'ویرایش';
        if (!campaignDetailLog.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailLog/GetOne', campaignDetailLog.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetailLog.selectedItem = response.Item;
            campaignDetailLog.filePickerMainImage.filename = null;
            campaignDetailLog.filePickerMainImage.fileId = null;
            campaignDetailLog.parseFileIds(response.Item.LinkFileIds);
            campaignDetailLog.filePickerFiles.filename = null;
            campaignDetailLog.filePickerFiles.fileId = null;
            if (campaignDetailLog
                .LinkUniversalMenuIdOnUndetectableKey >
                0) campaignDetailLog.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCampaign/campaignDetailLog/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    campaignDetailLog.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        campaignDetailLog.busyIndicator.isActive = true;
        //Save attached file ids into campaignDetailLog.selectedItem.LinkFileIds
        campaignDetailLog.selectedItem.LinkFileIds = "";
        campaignDetailLog.stringfyLinkFileIds();
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailLog/edit', campaignDetailLog.selectedItem, 'PUT').success(function (response) {
            campaignDetailLog.addRequested = true;
            rashaErManage.checkAction(response);
            campaignDetailLog.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                campaignDetailLog.addRequested = false;
                campaignDetailLog.replaceItem(campaignDetailLog.selectedItem.Id, response.Item);
                campaignDetailLog.gridOptions.fillData(campaignDetailLog.ListItems);
                campaignDetailLog.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignDetailLog.addRequested = false;
            campaignDetailLog.busyIndicator.isActive = false;
        });
    }

    campaignDetailLog.closeModal = function () {
        $modalStack.dismissAll();
    };

    campaignDetailLog.replaceItem = function (oldId, newItem) {
        angular.forEach(campaignDetailLog.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = campaignDetailLog.ListItems.indexOf(item);
                campaignDetailLog.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            campaignDetailLog.ListItems.unshift(newItem);
    }
    // delete content
    campaignDetailLog.deleteRow = function () {
        if (!campaignDetailLog.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                campaignDetailLog.busyIndicator.isActive = true;
                console.log(campaignDetailLog.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailLog/GetOne', campaignDetailLog.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    campaignDetailLog.selectedItemForDelete = response.Item;
                    console.log(campaignDetailLog.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailLog/delete', campaignDetailLog.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        campaignDetailLog.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            campaignDetailLog.replaceItem(campaignDetailLog.selectedItemForDelete.Id);
                            campaignDetailLog.gridOptions.fillData(campaignDetailLog.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        campaignDetailLog.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    campaignDetailLog.busyIndicator.isActive = false;
                });
            }
        });
    }

    campaignDetailLog.searchData = function () {
        campaignDetailLog.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"campaignDetailLog/getall", campaignDetailLog.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetailLog.categoryBusyIndicator.isActive = false;
            campaignDetailLog.ListItems = response.ListItems;
            campaignDetailLog.gridOptions.fillData(campaignDetailLog.ListItems);
            campaignDetailLog.gridOptions.currentPageNumber = response.CurrentPageNumber;
            campaignDetailLog.gridOptions.totalRowCount = response.TotalRowCount;
            campaignDetailLog.gridOptions.rowPerPage = response.RowPerPage;
            campaignDetailLog.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            campaignDetailLog.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //campaignDetailLog.gridOptions.searchData();

    }
    campaignDetailLog.LinkCampaignDetailIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkCampaignDetailId',
        url: 'CampaignDetail',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: campaignDetailLog,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
                { name: 'LinkCampaignDetailId', displayName: 'کد سیستمی جزییات', sortable: true, type: 'integer', visible: true },
            ]
        }
    }
   
    campaignDetailLog.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkCampaignDetailId', displayName: 'کد سیستمی جزییات', sortable: true, type: 'integer', visible: true },
            { name: 'Log', displayName: 'اطلاعات', sortable: true, type: 'string', visible: true },
            { name: 'WebAddress', displayName: 'آدرس وب', sortable: true, type: 'string', visible: true },
            { name: 'LinkFileIds', displayName: 'فایل', sortable: true, type: 'string', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            
            
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
                TotalRowData: 200,
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }

    campaignDetailLog.test = 'false';

    campaignDetailLog.gridOptions.reGetAll = function () {
        campaignDetailLog.init();
    }

    campaignDetailLog.gridOptions.onRowSelected = function () { }


    //For reInit Categories
    campaignDetailLog.gridOptions.reGetAll = function () {
        if (campaignDetailLog.gridOptions.advancedSearchData.engine.Filters.length > 0) campaignDetailLog.searchData();
        else campaignDetailLog.init();
    };

    campaignDetailLog.isCurrentNodeEmpty = function () {
        return !angular.equals({}, campaignDetailLog.treeConfig.currentNode);
    }

    campaignDetailLog.loadFileAndFolder = function (item) {
        campaignDetailLog.treeConfig.currentNode = item;
        console.log(item);
        campaignDetailLog.treeConfig.onNodeSelect(item);
    }

    campaignDetailLog.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            campaignDetailLog.focus = true;
        });
    };
    campaignDetailLog.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            campaignDetailLog.focus1 = true;
        });
    };

    campaignDetailLog.columnCheckbox = false;
    campaignDetailLog.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = campaignDetailLog.gridOptions.columns;
        if (campaignDetailLog.gridOptions.columnCheckbox) {
            for (var i = 0; i < campaignDetailLog.gridOptions.columns.length; i++) {
                //campaignDetailLog.gridOptions.columns[i].visible = $("#" + campaignDetailLog.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + campaignDetailLog.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                campaignDetailLog.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < campaignDetailLog.gridOptions.columns.length; i++) {
                var element = $("#" + campaignDetailLog.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + campaignDetailLog.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < campaignDetailLog.gridOptions.columns.length; i++) {
            console.log(campaignDetailLog.gridOptions.columns[i].name.concat(".visible: "), campaignDetailLog.gridOptions.columns[i].visible);
        }
        campaignDetailLog.gridOptions.columnCheckbox = !campaignDetailLog.gridOptions.columnCheckbox;
    }

    campaignDetailLog.deleteAttachedFile = function (index) {
        campaignDetailLog.attachedFiles.splice(index, 1);
    }

    campaignDetailLog.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !campaignDetailLog.alreadyExist(id, campaignDetailLog.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = { id: fId, name: fname };
            campaignDetailLog.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    campaignDetailLog.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    campaignDetailLog.filePickerMainImage.removeSelectedfile = function (config) {
        campaignDetailLog.filePickerMainImage.fileId = null;
        campaignDetailLog.filePickerMainImage.filename = null;
        campaignDetailLog.selectedItem.LinkMainImageId = null;

    }

    campaignDetailLog.filePickerFiles.removeSelectedfile = function (config) {
        campaignDetailLog.filePickerFiles.fileId = null;
        campaignDetailLog.filePickerFiles.filename = null;
    }




    campaignDetailLog.showUpload = function () { $("#fastUpload").fadeToggle(); }

    // ----------- FilePicker Codes --------------------------------
    campaignDetailLog.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !campaignDetailLog.alreadyExist(id, campaignDetailLog.attachedFiles)) {
            var fId = id;
            var file = { fileId: fId, filename: fname };
            campaignDetailLog.attachedFiles.push(file);
            campaignDetailLog.clearfilePickers();
        }
    }

    campaignDetailLog.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                campaignDetailLog.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    campaignDetailLog.deleteAttachedfieldName = function (index) {
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailLog/delete', campaignDetailLog.contractsList[index], 'POST').success(function (res) {
            rashaErManage.checkAction(res);
            if (res.IsSuccess) {
                campaignDetailLog.contractsList.splice(index, 1);
                rashaErManage.showMessage($filter('translatentk')('Removed_Successfully'));
            }
        }).error(function (data2, errCode2, c2, d2) {
            rashaErManage.checkAction(data2);
        });
    }

    campaignDetailLog.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            campaignDetailLog.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    campaignDetailLog.clearfilePickers = function () {
        campaignDetailLog.filePickerFiles.fileId = null;
        campaignDetailLog.filePickerFiles.filename = null;
    }

    campaignDetailLog.stringfyLinkFileIds = function () {
        $.each(campaignDetailLog.attachedFiles, function (i, item) {
            if (campaignDetailLog.selectedItem.LinkFileIds == "")
                campaignDetailLog.selectedItem.LinkFileIds = item.fileId;
            else
                campaignDetailLog.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    campaignDetailLog.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCampaign/campaignDetailLog/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        campaignDetailLog.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            campaignDetailLog.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    campaignDetailLog.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    campaignDetailLog.whatcolor = function (progress) {
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

    campaignDetailLog.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    campaignDetailLog.replaceFile = function (name) {
        campaignDetailLog.itemClicked(null, campaignDetailLog.fileIdToDelete, "file");
        campaignDetailLog.fileTypes = 1;
        campaignDetailLog.fileIdToDelete = campaignDetailLog.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", campaignDetailLog.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    campaignDetailLog.remove(campaignDetailLog.FileList, campaignDetailLog.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                campaignDetailLog.FileItem = response3.Item;
                                campaignDetailLog.FileItem.FileName = name;
                                campaignDetailLog.FileItem.Extension = name.split('.').pop();
                                campaignDetailLog.FileItem.FileSrc = name;
                                campaignDetailLog.FileItem.LinkCategoryId = campaignDetailLog.thisCategory;
                                campaignDetailLog.saveNewFile();
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
    campaignDetailLog.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", campaignDetailLog.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                campaignDetailLog.FileItem = response.Item;
                campaignDetailLog.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            campaignDetailLog.showErrorIcon();
            return -1;
        });
    }

    campaignDetailLog.showSuccessIcon = function () {
    }

    campaignDetailLog.showErrorIcon = function () {

    }
    //file is exist
    campaignDetailLog.fileIsExist = function (fileName) {
        for (var i = 0; i < campaignDetailLog.FileList.length; i++) {
            if (campaignDetailLog.FileList[i].FileName == fileName) {
                campaignDetailLog.fileIdToDelete = campaignDetailLog.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    campaignDetailLog.getFileItem = function (id) {
        for (var i = 0; i < campaignDetailLog.FileList.length; i++) {
            if (campaignDetailLog.FileList[i].Id == id) {
                return campaignDetailLog.FileList[i];
            }
        }
    }

    //select file or folder
    campaignDetailLog.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            campaignDetailLog.fileTypes = 1;
            campaignDetailLog.selectedFileId = campaignDetailLog.getFileItem(index).Id;
            campaignDetailLog.selectedFileName = campaignDetailLog.getFileItem(index).FileName;
        }
        else {
            campaignDetailLog.fileTypes = 2;
            campaignDetailLog.selectedCategoryId = campaignDetailLog.getCategoryName(index).Id;
            campaignDetailLog.selectedCategoryTitle = campaignDetailLog.getCategoryName(index).Title;
        }
        campaignDetailLog.selectedIndex = index;
    };

    campaignDetailLog.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    //upload file
    campaignDetailLog.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (campaignDetailLog.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ campaignDetailLog.replaceFile(uploadFile.name);
                    campaignDetailLog.itemClicked(null, campaignDetailLog.fileIdToDelete, "file");
                    campaignDetailLog.fileTypes = 1;
                    campaignDetailLog.fileIdToDelete = campaignDetailLog.selectedIndex;
                    // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                campaignDetailLog.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        campaignDetailLog.FileItem = response2.Item;
                        campaignDetailLog.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        campaignDetailLog.filePickerMainImage.filename =
                          campaignDetailLog.FileItem.FileName;
                        campaignDetailLog.filePickerMainImage.fileId =
                          response2.Item.Id;
                        campaignDetailLog.selectedItem.LinkMainImageId =
                          campaignDetailLog.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      campaignDetailLog.showErrorIcon();
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
                    campaignDetailLog.FileItem = response.Item;
                    campaignDetailLog.FileItem.FileName = uploadFile.name;
                    campaignDetailLog.FileItem.uploadName = uploadFile.uploadName;
                    campaignDetailLog.FileItem.Extension = uploadFile.name.split('.').pop();
                    campaignDetailLog.FileItem.FileSrc = uploadFile.name;
                    campaignDetailLog.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- campaignDetailLog.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", campaignDetailLog.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            campaignDetailLog.FileItem = response.Item;
                            campaignDetailLog.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            campaignDetailLog.filePickerMainImage.filename = campaignDetailLog.FileItem.FileName;
                            campaignDetailLog.filePickerMainImage.fileId = response.Item.Id;
                            campaignDetailLog.selectedItem.LinkMainImageId = campaignDetailLog.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        campaignDetailLog.showErrorIcon();
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
    campaignDetailLog.exportFile = function () {
        campaignDetailLog.addRequested = true;
        campaignDetailLog.gridOptions.advancedSearchData.engine.ExportFile = campaignDetailLog.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailLog/exportfile', campaignDetailLog.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            campaignDetailLog.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignDetailLog.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //campaignDetailLog.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    campaignDetailLog.toggleExportForm = function () {
        campaignDetailLog.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        campaignDetailLog.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        campaignDetailLog.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        campaignDetailLog.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        campaignDetailLog.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCampaign/campaignDetailLog/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    campaignDetailLog.rowCountChanged = function () {
        if (!angular.isDefined(campaignDetailLog.ExportFileClass.RowCount) || campaignDetailLog.ExportFileClass.RowCount > 5000)
            campaignDetailLog.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    campaignDetailLog.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"campaignDetailLog/count", campaignDetailLog.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            campaignDetailLog.addRequested = false;
            rashaErManage.checkAction(response);
            campaignDetailLog.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            campaignDetailLog.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

