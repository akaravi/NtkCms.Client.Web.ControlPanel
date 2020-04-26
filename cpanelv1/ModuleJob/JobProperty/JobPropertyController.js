app.controller("jobPropertyController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var jobProperty = this;
    jobProperty.RouteUploadFileContent = cmsServerConfig.configRouteUploadFileContent;
    jobProperty.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    jobProperty.attachedFiles = [];
    jobProperty.attachedFile = "";
    jobProperty.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: 0,
        multiSelect: false,
    }

    jobProperty.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        filename: null,
        fileId: 0,
        multiSelect: false,
    }
    jobProperty.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    jobProperty.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:jobProperty.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:jobProperty,
        useCurrentLocationZoom:12,
    }
    jobProperty.filePickerMainImage.clear = function () {
        jobProperty.filePickerMainImage.fileId = 0;
        jobProperty.filePickerMainImage.filename = "";
    }

    jobProperty.filePickerFiles.clear = function () {
        jobProperty.filePickerFiles.fileId = 0;
        jobProperty.filePickerFiles.filename = "";
    }

    if (itemRecordStatus != undefined) jobProperty.itemRecordStatus = itemRecordStatus;

    jobProperty.propertyTypeListItems = [];
    jobProperty.propertyDetailGroupListItems = [];
    jobProperty.propertyDetailsListItems = [];
    jobProperty.cmsUsersListItems = [];
    jobProperty.contractTypeListItems = [];

    jobProperty.init = function () {
        jobProperty.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"jobproperty/getAllwithalias", jobProperty.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            jobProperty.ListItems = response.ListItems;
            jobProperty.gridOptions.fillData(jobProperty.ListItems, response.resultAccess);
            jobProperty.gridOptions.currentPageNumber = response.CurrentPageNumber;
            jobProperty.gridOptions.totalRowCount = response.TotalRowCount;
            jobProperty.gridOptions.rowPerPage = response.RowPerPage;
            jobProperty.allowedSearch = response.AllowedSearchField;
            jobProperty.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            jobProperty.busyIndicator.isActive = false;
            jobProperty.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"CoreLocation/GetAllProvinces", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            jobProperty.provinceCmsLocatinoListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            jobProperty.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"jobpropertytype/getAll", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            jobProperty.propertyTypeListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            jobProperty.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    jobProperty.busyIndicator.isActive = true;
    jobProperty.addRequested = false;
    $(".back1").hide();

    jobProperty.attachedFiles = [];
    jobProperty.attachedFile = "";
    jobProperty.filePickerMainImage.filename = "";
    jobProperty.filePickerMainImage.fileId = null;
    jobProperty.filePickerFiles.filename = "";
    jobProperty.filePickerFiles.fileId = null;

    // Open Add Modal
    jobProperty.openAddModal = function () {
        if (buttonIsPressed) return;
        jobProperty.onPropertyTypeChange();
        jobProperty.modalTitle = 'اضافه';
        //Clear file pickers
        jobProperty.attachedFiles = [];
        jobProperty.attachedFile = "";
        jobProperty.filePickerMainImage.filename = "";
        jobProperty.filePickerMainImage.fileId = null;
        jobProperty.filePickerFiles.filename = "";
        jobProperty.filePickerFiles.fileId = null;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'jobproperty/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            jobProperty.busyIndicator.isActive = false;
            jobProperty.selectedItem = response.Item;
            jobProperty.selectedItem.LinkPropertyTypeId = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleJob/JobProperty/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            jobProperty.busyIndicator.isActive = false;
        });
    }

    // Add New Content
    jobProperty.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (jobProperty.requiredPropertyIsEmpty(jobProperty.selectedItem)) {
            rashaErManage("مقادیر الزامی را وارد کنید!");
            return;
        }
        jobProperty.busyIndicator.isActive = true;
        jobProperty.addRequested = true;
        var valueItem = {};
        jobProperty.valueItems = [];
        ajax.call(cmsServerConfig.configApiServerPath+'jobproperty/add', jobProperty.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                jobProperty.closeModal();
                ajax.call(cmsServerConfig.configApiServerPath+"jobpropertydetailvalue/GetViewModel", "0", 'GET').success(function (response1) {
                    rashaErManage.checkAction(response1);
                    for (var i = 0; i < jobProperty.propertyDetailsListItems.length; i++) {
                        valueItem = $.extend(true, {}, response1.Item);
                        valueItem.LinkPropertyDetailId = jobProperty.propertyDetailsListItems[i].Id;
                        valueItem.LinkPropertyId = response.Item.Id;
                        if (jobProperty.propertyDetailsListItems[i].DefaultValue != null) {
                            if (jobProperty.propertyDetailsListItems[i].DefaultValue.multipleChoice) {
                                var checkboxName = "nameValue" + jobProperty.propertyDetailsListItems[i].Id;
                                jobProperty.selectionValueNames = [];
                                jQuery("input[name='" + checkboxName + "']").each(function () {
                                    if (this.checked) {
                                        jobProperty.selectionValueNames.push(this.value);
                                    }
                                });
                                valueItem.Value = jobProperty.selectionValueNames.toString();
                            }
                            else {

                                if (jobProperty.propertyDetailsListItems[i].DefaultValue.forceUse && jobProperty.propertyDetailsListItems[i].DefaultValue.nameValue.length > 0) {  //ELement is a RadioButton/DropDown
                                    //Do not delete the following comments: Get the value if the element is a RadioButton
                                    /*var radioButton = "nameValue" + jobProperty.propertyDetailsListItems[i].Id;
                                    jobProperty.selectionValueNames = [];
                                    if ($("input[name='" + radioButton + "']").is(':checked')) {
                                        valueItem.Value = $("input[name='" + radioButton + "']:checked").val(); 
                                    }*/
                                    valueItem.Value = $('#dropDown' + jobProperty.propertyDetailsListItems[i].Id).find(":selected").val(); //Get the value if the element is a DropDown

                                } else
                                    valueItem.Value = jobProperty.propertyDetailsListItems[i].value;
                            }
                        } else
                            valueItem.Value = jobProperty.propertyDetailsListItems[i].value;
                        jobProperty.valueItems.push(valueItem);
                    }
                    ajax.call(cmsServerConfig.configApiServerPath+'JobPropertyDetailValue/AddBatch', jobProperty.valueItems, 'POST').success(function (response2) {
                        rashaErManage.checkAction(response2);
                        if (response2.IsSuccess) {
                            jobProperty.ListItems.unshift(response.Item);
                            jobProperty.gridOptions.fillData(jobProperty.ListItems);
                            jobProperty.gridOptions.myfilterText(jobProperty.ListItems, "LinkCmsUserId", jobProperty.cmsUsersListItems, "Username", "LinkCmsUserUsername");
                            jobProperty.gridOptions.myfilterText(jobProperty.ListItems, "LinkPropertyTypeId", jobProperty.propertyTypeListItems, "Title", "LinkPropertyTypeTitle");
                            jobProperty.addRequested = false;
                            jobProperty.busyIndicator.isActive = false;
                            //ملک و مقادیر ثبت شده است از کاربر می خواهیم که نوع فروش را مشخص کند
                            jobProperty.openAddContractModal(response.Item.Id, response.Item.Title);
                        }
                    }).error(function (data, errCode, c, d) {
                        console.log(data);
                        rashaErManage.checkAction(data, errCode);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            jobProperty.addRequested = false;
        });
    }

    // Open Edit Content Modal 
    jobProperty.openEditModal = function () {
        if (buttonIsPressed) return;
        jobProperty.onPropertyTypeChange();
        //Clear file pickers
        jobProperty.attachedFiles = [];
        jobProperty.attachedFile = "";
        jobProperty.filePickerMainImage.filename = "";
        jobProperty.filePickerMainImage.fileId = null;
        jobProperty.filePickerFiles.filename = "";
        jobProperty.filePickerFiles.fileId = null;
        jobProperty.modalTitle = 'ویرایش';
        if (!jobProperty.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'jobproperty/GetOne', parseInt(jobProperty.gridOptions.selectedRow.item.Id), 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            jobProperty.selectedItem = response.Item;
            jobProperty.oldLinkPropertyTypeId = jobProperty.selectedItem.LinkPropertyTypeId;
            jobProperty.loadDetailValues(jobProperty.selectedItem.LinkPropertyTypeId, jobProperty.selectedItem.Id);
            //---- Set Province City Location
            //jobProperty.onProvinceChange(jobProperty.selectedItem.LinkProvinceId);
            //jobProperty.onCitiesChange(jobProperty.selectedItem.LinkLocationId);
            //---- Set MainImage and AttachedFiles on edit modal open
            jobProperty.filePickerMainImage.filename = null;
            jobProperty.filePickerMainImage.fileId = null;
            if (response.Item.LinkMainImageId != null && response.Item.LinkMainImageId > 0) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(response.Item.LinkMainImageId), 'GET').success(function (response2) {
                    if (response2.IsSuccess && response2.Item.Id > 9) {
                        jobProperty.filePickerMainImage.filename = response2.Item.FileName;
                        jobProperty.filePickerMainImage.fileId = response2.Item.Id;
                    }
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            if (response.Item.LinkExtraImageIds != null && response.Item.LinkExtraImageIds != "")
                jobProperty.parseFileIds(response.Item.LinkExtraImageIds);
            //*****************************************************************
            $modal.open({
                templateUrl: 'cpanelv1/ModuleJob/JobProperty/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    jobProperty.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        // Edit Property: Title, Description, LinkPropertyTypeId
        jobProperty.busyIndicator.isActive = true;
        jobProperty.selectedItem.LinkExtraImageIds = stringfyLinkFileIds(jobProperty.attachedFiles);
        ajax.call(cmsServerConfig.configApiServerPath+'jobproperty/edit', jobProperty.selectedItem, 'PUT').success(function (response) {
            jobProperty.addRequested = true;
            rashaErManage.checkAction(response);
            jobProperty.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                jobProperty.addRequested = false;
                jobProperty.replaceItem(jobProperty.selectedItem.Id, response.Item);
                jobProperty.gridOptions.fillData(jobProperty.ListItems);
                jobProperty.gridOptions.myfilterText(jobProperty.ListItems, "LinkCmsUserId", jobProperty.cmsUsersListItems, "Username", "LinkCmsUserUsername");
                jobProperty.gridOptions.myfilterText(jobProperty.ListItems, "LinkPropertyTypeId", jobProperty.propertyTypeListItems, "Title", "LinkPropertyTypeTitle");
                jobProperty.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            jobProperty.addRequested = false;
            jobProperty.busyIndicator.isActive = false;
        });

        // ------------------------- Check if Property Type (LinkPropertyTypeId) has changed ---------------------------
        if (jobProperty.oldLinkPropertyTypeId != jobProperty.selectedItem.LinkPropertyTypeId) {
            var filterValue = {
                PropertyName: "LinkPropertyId",
                IntValue1: parseInt(jobProperty.selectedItem.Id),
                SearchType: 0
            }
            var engine = {};
            engine.Filters = [];
            engine.Filters.push(filterValue);
            ajax.call(cmsServerConfig.configApiServerPath+'JobPropertyDetailValue/deleteList', engine, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                console.log(response.Item);
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                jobProperty.busyIndicator.isActive = false;

            });
            ajax.call(cmsServerConfig.configApiServerPath+'JobPropertyDetailValue/AddBatch', jobProperty.selectedItem.LinkPropertyId, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                console.log(response.Item);
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                jobProperty.busyIndicator.isActive = false;

            });
        }
        else {
            // -------------------------************* Set Values to Edit ************------------------------------
            for (var i = 0; i < jobProperty.propertyDetailsListItems.length; i++) {
                jobProperty.propertyDetailsListItems[i].valueFound = false;
                for (var j = 0; j < jobProperty.propertyDetailValuesListItems.length; j++) {
                    if (jobProperty.propertyDetailsListItems[i].Id == jobProperty.propertyDetailValuesListItems[j].LinkPropertyDetailId) {
                        jobProperty.propertyDetailsListItems[i].valueFound = true;
                        if (jobProperty.propertyDetailsListItems[i].DefaultValue.multipleChoice == false) { // Detail is not CheckBox
                            if (jobProperty.propertyDetailsListItems[i].DefaultValue.forceUse) { // Detail is RadioButton/DropDown
                                /*Do not delete the following comments: Get the value if the element is a RadioButton
                                var radioName = "selection" + jobProperty.propertyDetailsListItems[i].Id;
                                var radioValue = jobProperty[radioName].toString();
                                jobProperty.propertyDetailsListItems[i].value = radioValue; */
                                jobProperty.propertyDetailValuesListItems[j].Value = $('#dropDown' + jobProperty.propertyDetailsListItems[i].Id).find(":selected").val(); //Get the value if the element is a DropDown
                            }
                            else
                                // Detail is not a CheckBox, nor a RadioButton
                                jobProperty.propertyDetailValuesListItems[j].Value = String(jobProperty.propertyDetailsListItems[i].value);
                        } else { // Detail is CheckBox
                            var checkboxName = "selection" + jobProperty.propertyDetailsListItems[i].Id.toString();
                            jobProperty.propertyDetailValuesListItems[j].Value = jobProperty[checkboxName].toString();
                        }
                    }
                }
                if (!jobProperty.propertyDetailsListItems[i].valueFound) {
                    console.log(jobProperty.propertyDetailsListItems[i]);
                    var proeprtyDetailValue = { LinkPropertyId: 0, LinkPropertyDetailId: 0, Value: 0 };
                    if (jobProperty.propertyDetailsListItems[i].DefaultValue.multipleChoice == false) { // Detail is not CheckBox
                        if (jobProperty.propertyDetailsListItems[i].DefaultValue.forceUse) { // Detail is RadioButton/DropDown
                            jobProperty.propertyDetailValuesListItems.push({ Id: 0, LinkPropertyId: jobProperty.selectedItem.Id, LinkPropertyDetailId: jobProperty.propertyDetailsListItems[i].Id, Value: $('#dropDown' + jobProperty.propertyDetailsListItems[i].Id).find(":selected").val() }); //Get the value if the element is a DropDown
                        }
                        else
                            // Detail is not a CheckBox, nor a RadioButton
                            jobProperty.propertyDetailValuesListItems.push({ Id: 0, LinkPropertyId: jobProperty.selectedItem.Id, LinkPropertyDetailId: jobProperty.propertyDetailsListItems[i].Id, Value: String(jobProperty.propertyDetailsListItems[i].value) });
                    } else { // Detail is CheckBox
                        var checkboxName = "selection" + jobProperty.propertyDetailsListItems[i].Id.toString();
                        jobProperty.propertyDetailValuesListItems.push({ Id: 0, LinkPropertyId: jobProperty.selectedItem.Id, LinkPropertyDetailId: jobProperty.propertyDetailsListItems[i].Id, Value: jobProperty[checkboxName].toString() });
                    }
                }
            }
            // ---------------------------------- End of Set Values to Edit --------------------------------------
            jobProperty.addRequested = true;
            ajax.call(cmsServerConfig.configApiServerPath+'JobPropertyDetailValue/EditBatch', jobProperty.propertyDetailValuesListItems, 'PUT').success(function (response) {
                rashaErManage.checkAction(response);
                jobProperty.busyIndicator.isActive = false;
                if (response.IsSuccess) {
                    jobProperty.addRequested = false;
                    jobProperty.closeModal();
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                jobProperty.addRequested = false;
                jobProperty.busyIndicator.isActive = false;
            });
        }
    }

    jobProperty.closeModal = function () {
        $modalStack.dismissAll();
    };

    jobProperty.replaceItem = function (oldId, newItem) {
        angular.forEach(jobProperty.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = jobProperty.ListItems.indexOf(item);
                jobProperty.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            jobProperty.ListItems.unshift(newItem);
    }

    jobProperty.deleteRow = function () {
        if (buttonIsPressed) return;

        if (!jobProperty.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                jobProperty.busyIndicator.isActive = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'jobproperty/GetOne', jobProperty.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    jobProperty.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'jobproperty/delete', jobProperty.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        jobProperty.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            jobProperty.replaceItem(jobProperty.selectedItemForDelete.Id);
                            jobProperty.gridOptions.fillData(jobProperty.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        jobProperty.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    jobProperty.busyIndicator.isActive = false;
                });
            }
        });
    }

    jobProperty.searchData = function () {
        jobProperty.gridOptions.searchData();
    }


    jobProperty.LinkLocationIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkLocationId',
        url: 'CmsLocation',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'LinkLocationId',
        rowPerPage: 200,
        action: 'GetAllCities',
        scope: jobProperty,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'virtual_Parent.Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
                { name: 'Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
            ]
        }
    }
    jobProperty.gridOptions = {
        columns: [
            { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'نام', sortable: true, type: 'string', visible: true },
            { name: 'Description', displayName: 'توضیح', sortable: true, type: 'string', visible: true, excerpt: true, excerptLength: 30 },
            { name: 'LinkCmsUserId', displayName: 'کد سیستمی کاربر', sortable: true, type: 'string', visible: true, displayForce: true },
            { name: 'virtual_PropertyType.Title', displayName: 'نوع متقاضی', sortable: true, type: 'string', visible: true, displayForce: true },
            { name: 'ActionButtons', displayName: 'خصوصیات متقاضی', sortable: true, type: 'string', visible: true, displayForce: true, template: '<button type="button" class="btn btn-primary" ng-click="jobProperty.openAddContractModal(x.Id,x.Title)"  class="btn btn-primary"><i class="fa fa-plus-circle" aria-hidden="true"></i>&nbsp;جزییات</button>' }
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

    jobProperty.gridOptions.reGetAll = function () {
        jobProperty.init();
    }

    jobProperty.gridOptions.onRowSelected = function () { }

    jobProperty.columnCheckbox = false;

    jobProperty.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (jobProperty.gridOptions.columnCheckbox) {
            for (var i = 0; i < jobProperty.gridOptions.columns.length; i++) {
                //jobProperty.gridOptions.columns[i].visible = $("#" + jobProperty.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + jobProperty.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                jobProperty.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = jobProperty.gridOptions.columns;
            for (var i = 0; i < jobProperty.gridOptions.columns.length; i++) {
                jobProperty.gridOptions.columns[i].visible = true;
                var element = $("#" + jobProperty.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + jobProperty.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < jobProperty.gridOptions.columns.length; i++) {
            console.log(jobProperty.gridOptions.columns[i].name.concat(".visible: "), jobProperty.gridOptions.columns[i].visible);
        }
        jobProperty.gridOptions.columnCheckbox = !jobProperty.gridOptions.columnCheckbox;
    }

    jobProperty.onPropertyTypeChange = function (propertyTypeId) {
        jobProperty.propertyDetailsListItems = []; //Clear out the array from previous values
        jobProperty.propertyDetailGroupListItems = []; //Clear out the array from previous values
        if (!angular.isDefined(propertyTypeId)) return;
        var filterValue = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(propertyTypeId),
            SearchType: 0
        }
        var engine = {
        };
        engine.Filters = [];
        engine.Filters.push(filterValue);
        jobProperty.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+"JobPropertyDetail/GetAll", engine, 'POST').success(function (response) {
            jobProperty.addRequested = false;
            jobProperty.propertyDetailsListItems = response.ListItems;

            $.each(jobProperty.propertyDetailsListItems, function (index, item) {
                item.value = null;
                // Add groups to its list
                var result = $.grep(jobProperty.propertyDetailGroupListItems, function (e) { return e.Id == item.virtual_PropertyDetailGroup.Id; });
                if (result.length <= 0)
                    jobProperty.propertyDetailGroupListItems.push(item.virtual_PropertyDetailGroup);

                // Add DefaultValue to the object
                item.DefaultValue = JSON.parse(item.JsonDefaultValue);
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    jobProperty.selectedPropertyDetailsListItems = [];
    jobProperty.onPropertyDetailGroupChange = function (propertyDetailGroupId) {
        jobProperty.selectedPropertyDetailsListItems = [];
        if (0 < jobProperty.propertyDetailsListItems.length) {
            $.each(jobProperty.propertyDetailsListItems, function (index, propertyDetail) {
                if (propertyDetail.LinkPropertyDetailGroupId == propertyDetailGroupId) {
                    jobProperty.selectedPropertyDetailsListItems.push(propertyDetail);
                }
            });
        }
    }

    // Filter Texts for CmsUser
    jobProperty.gridOptions.myfilterText = function (gridListItems, foreignKeyName, childListItems, childDesiredPropertyName, childItemColumnName) {
        var ilength = gridListItems.length;
        var jlength = childListItems.length;
        for (var i = 0; i < ilength; i++) {
            gridListItems[i][childItemColumnName] = "";  // Make a new field for title of the foreighn key
            for (var j = 0; j < jlength; j++) {
                if (gridListItems[i][foreignKeyName] == childListItems[j].Id) {
                    gridListItems[i][childItemColumnName] = childListItems[j][childDesiredPropertyName];
                }
            }
        }
    }

    //-----------------*** Load Values in Edit Modal ***----------------------
    jobProperty.loadDetailValues = function (propertyTypeId, propertyId) {
        var filterValue1 = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(propertyTypeId),
            SearchType: 0
        }
        var engine1 = {
        };
        engine1.Filters = [];
        engine1.Filters.push(filterValue1);
        ajax.call(cmsServerConfig.configApiServerPath+"JobPropertyDetail/GetAll", engine1, 'POST').success(function (response1) {
            jobProperty.propertyDetailsListItems = response1.ListItems;
            //---------- Load Values ---------------------------------------
            var filterValue2 = {
                PropertyName: "LinkPropertyId",
                IntValue1: parseInt(propertyId),
                SearchType: 0
            }
            var engine2 = { Filters: [] };
            engine2.Filters.push(filterValue2);
            ajax.call(cmsServerConfig.configApiServerPath+"JobPropertyDetailValue/GetAll", engine2, 'POST').success(function (response) {
                $.each(jobProperty.propertyDetailsListItems, function (index, item) {
                    item.value = null;
                    // Add groups to its list
                    var result = $.grep(jobProperty.propertyDetailGroupListItems, function (e) { return e.Id == item.virtual_PropertyDetailGroup.Id; });
                    if (result.length <= 0)
                        jobProperty.propertyDetailGroupListItems.push(item.virtual_PropertyDetailGroup);

                    // Add DefaultValue to the object
                    if (item.JsonDefaultValue == null) item.JsonDefaultValue = "{\"nameValue\":[],\"forceUse\":false,\"multipleChoice\":false}"; // جلوگیری از بروز خطا اگر مقادیر پیش فرض تهی باشد
                    item.DefaultValue = JSON.parse(item.JsonDefaultValue);
                });
                jobProperty.propertyDetailValuesListItems = response.ListItems;
                for (var i = 0; i < jobProperty.propertyDetailsListItems.length; i++) {
                    for (var j = 0; j < jobProperty.propertyDetailValuesListItems.length; j++) {
                        if (jobProperty.propertyDetailsListItems[i].Id == jobProperty.propertyDetailValuesListItems[j].LinkPropertyDetailId) {
                            var jsonDefaultValue = null;
                            try {
                                jsonDefaultValue = JSON.parse(jobProperty.propertyDetailsListItems[i].JsonDefaultValue);
                            } catch (e) {
                                console.log(e);
                            }

                            if (jobProperty.propertyDetailValuesListItems[j].Value != null) {
                                if (jsonDefaultValue != undefined && jsonDefaultValue != null && jsonDefaultValue.nameValue != undefined && jsonDefaultValue.nameValue != null && 0 < jsonDefaultValue.nameValue.length) {
                                    if (jsonDefaultValue.multipleChoice) {   // Detail is CheckBox
                                        var multipleValues = jobProperty.propertyDetailValuesListItems[j].Value.split(',');
                                        setSelection(jobProperty.propertyDetailsListItems[i].Id, multipleValues);

                                    }
                                    else if (jsonDefaultValue.forceUse && jsonDefaultValue.nameValue.length > 0) {   // Detail is RadioButton/DropDown
                                        /*Do not delete this line: Load the value if the elements is RadioButton
                                        var radioValues = jobProperty.propertyDetailValuesListItems[j].Value.split(',');
                                        setSelection(jobProperty.propertyDetailsListItems[i].Id, radioValues); */
                                        jobProperty.propertyDetailsListItems[i].value = jobProperty.propertyDetailValuesListItems[j].Value;
                                    } else {     // Detail is InputDataList
                                        jobProperty.propertyDetailsListItems[i].value = jobProperty.propertyDetailValuesListItems[j].Value;
                                    }
                                } else {
                                    switch (jobProperty.propertyDetailsListItems[i].InputDataType) {
                                        case 0:                              // Detail is String
                                            jobProperty.propertyDetailsListItems[i].value = jobProperty.propertyDetailValuesListItems[j].Value;
                                            break;
                                        case 1:                              // Detail is Number
                                            jobProperty.propertyDetailsListItems[i].value = parseInt(jobProperty.propertyDetailValuesListItems[j].Value);
                                            break;
                                        case 2:                              // Detail is Boolean
                                            jobProperty.propertyDetailsListItems[i].value = (jobProperty.propertyDetailValuesListItems[j].Value === "true");
                                            break;
                                    }
                                }
                            }
                        }
                    }
                }
                //--------------------------------
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
            //***************************************************************
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    function setSelection(detailId, values) {
        var checkboxName = "selection" + detailId.toString();
        jobProperty[checkboxName] = values;
    }

    // toggle selection for a given fruit by name
    jobProperty.toggleSelection = function (detailId, fruitName) {
        var checkboxName = "selection" + detailId.toString();
        if (jobProperty[checkboxName] == undefined)
            jobProperty[checkboxName] = [];
        var idx = jobProperty[checkboxName].indexOf(fruitName);

        // is currently selected
        if (idx > -1) {
            jobProperty[checkboxName].splice(idx, 1);
        }

            // is newly selected
        else {
            jobProperty[checkboxName].push(fruitName);
        }
    }

    // toggle selection for a given fruit by name
    jobProperty.toggleRadioSelection = function (detailId, fruitName) {
        var radioName = "selection" + detailId.toString();
        var idx = jobProperty[radioName].indexOf(fruitName);

        // is currently selected
        if (idx > -1) {

        }
            // is newly selected
        else {
            jobProperty[radioName] = [];
            jobProperty[radioName].push(fruitName);
        }
    }
    //---------------- End of LoadValues functino ------------------------------

    jobProperty.requiredPropertyIsEmpty = function (selectedItem) {
        $.each(jobProperty.propertyDetailsListItems, function (index, item) {
            if (item.Required)
                if (item.value == null || item.value == "")
                    return true;
        });
    }

    jobProperty.onContractTypeChange = function (contractTypeId) {
        var contractType = {
        };
        for (var i = 0; i < jobProperty.contractTypeListItems.length; i++) {
            if (parseInt(contractTypeId) == jobProperty.contractTypeListItems[i].Id) {
                jobProperty.selectedItem.HasFixedSalary = jobProperty.contractTypeListItems[i].HasSalePrice;
                jobProperty.selectedItem.UnitFixedSalary = jobProperty.contractTypeListItems[i].UnitSalePrice;
                jobProperty.selectedItem.HasCommission = jobProperty.contractTypeListItems[i].HasPresalePrice;
                jobProperty.selectedItem.UnitCommission = jobProperty.contractTypeListItems[i].UnitPresalePrice;
                jobProperty.selectedItem.HasShareInCompany = jobProperty.contractTypeListItems[i].HasRentPrice;
                //jobProperty.selectedItem.UnitRentPrice = jobProperty.contractTypeListItems[i].UnitRentPrice;
                //jobProperty.selectedItem.HasDepositPrice = jobProperty.contractTypeListItems[i].HasDepositPrice;
                //jobProperty.selectedItem.UnitDepositPrice = jobProperty.contractTypeListItems[i].UnitDepositPrice;
            }
        }
    }
 

    jobProperty.contractsList = [];
    jobProperty.openAddContractModal = function (propertyId, propertyTitle) {
        ajax.call(cmsServerConfig.configApiServerPath+"jobcontracttype/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            jobProperty.busyIndicator.isActive = false;
            jobProperty.contractTypeListItems = response.ListItems;
            jobProperty.selectedItem.LinkPropertyTypeId = null;
        }).error(function (data, errCode, c, d) {
            jobProperty.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
        ajax.call(cmsServerConfig.configApiServerPath+'JobContract/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                jobProperty.selectedItem = response.Item;
                jobProperty.selectedItem.LinkPropertyId = parseInt(propertyId);  // Set LinkPropertyId for new Contract
                jobProperty.selectedItem.LinkPropertyTitle = propertyTitle;  // Set LinkPropertyId for new Contract
                var model = {
                };
                model.Filters = [];
                model.Filters.push({ PropertyName: "LinkPropertyId", IntValue1: parseInt(propertyId), SearchType: 0 });
                ajax.call(cmsServerConfig.configApiServerPath+'JobContract/getall', model, 'POST').success(function (response) {
                    rashaErManage.checkAction(response);
                    jobProperty.contractsList = response.ListItems;
                    jobProperty.contractsListresultAccess = response.resultAccess;
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleJob/JobProperty/addContract.html',
                        scope: $scope
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    jobProperty.addContract = function () {
        var duplicateContract = false;
        var erMessage = "";
        if (jobProperty.selectedItem.LinkJobContractTypeId == null || jobProperty.selectedItem.LinkJobContractTypeId < 0)
            return;
        $.each(jobProperty.contractsList, function (index, item) {
            if (item.LinkJobContractTypeId == parseInt(jobProperty.selectedItem.LinkJobContractTypeId)) {
                erMessage = "آگهی" + ' ' + item.virtual_ContractType.Title + ' ' + "قبلاً برای این متقاضی ثبت شده است!";
                duplicateContract = true;
                return;
            }
        });
        if (duplicateContract) {
            rashaErManage.showMessage(erMessage);
            return;
        }
        jobProperty.addRequested = true;
        jobProperty.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'JobContract/add', jobProperty.selectedItem, 'POST').success(function (response) {
            jobProperty.addRequested = false;
            jobProperty.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                jobProperty.contractsList.push(response.Item);
                jobProperty.selectedItem.FixedSalary = null;
                jobProperty.selectedItem.Commission = null;
                jobProperty.selectedItem.DepositPrice = null;
                jobProperty.selectedItem.RentPrice = null;
                jobProperty.selectedItem.Description = "";
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            jobProperty.addRequested = false;
        });

    }

    jobProperty.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }

    // ----------- FilePicker Codes --------------------------
    jobProperty.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !jobProperty.alreadyExist(id, jobProperty.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            jobProperty.attachedFiles.push(file);
            jobProperty.clearfilePickers();

        }
    }

    jobProperty.alreadyExist = function (fieldName, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldName == array[i]) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                jobProperty.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    jobProperty.editContract = function (index) {
        jobProperty.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'JobContract/edit', jobProperty.contractsList[index], 'PUT').success(function (res) {
            jobProperty.addRequested = false;
            rashaErManage.checkAction(res);
            if (res.IsSuccess) {
                jobProperty.contractsList.splice(index, 1);
                jobProperty.contractsList.push(res.Item)
                rashaErManage.showMessage("ویرایش با موفقیت انجام شد!");
            }
        }).error(function (data2, errCode2, c2, d2) {
            rashaErManage.checkAction(data2);
        });
    }

    jobProperty.deleteContract = function (index) {
        jobProperty.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'JobContract/delete', jobProperty.contractsList[index], 'POST').success(function (res) {
            jobProperty.addRequested = false;
            rashaErManage.checkAction(res);
            if (res.IsSuccess) {
                jobProperty.contractsList.splice(index, 1);
                rashaErManage.showMessage($filter('translatentk')('Removed_Successfully'));
            }
        }).error(function (data2, errCode2, c2, d2) {
            rashaErManage.checkAction(data2);
        });
    }

    jobProperty.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            jobProperty.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    jobProperty.clearfilePickers = function () {
        jobProperty.filePickerFiles.filename = null;
        jobProperty.filePickerFiles.fileId = null;
    }

    function stringfyLinkFileIds(arrayOfFiles) {
        var ret = "";
        $.each(arrayOfFiles, function (index, item) {
            if (ret == "")
                ret = item.fileId;
            else
                ret = ret + ',' + item.fileId;
        });
        return ret.toString();
    }
    //--------- End FilePickers Codes ------------------------

    //---------------Upload Modal-----------------------------
    jobProperty.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleJob/JobProperty/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        jobProperty.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            jobProperty.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    jobProperty.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    jobProperty.whatcolor = function (progress) {
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

    jobProperty.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    jobProperty.replaceFile = function (name) {
        jobProperty.itemClicked(null, jobProperty.fileIdToDelete, "file");
        jobProperty.fileTypes = 1;
        jobProperty.fileIdToDelete = jobProperty.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", jobProperty.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    jobProperty.remove(jobProperty.FileList, jobProperty.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                jobProperty.FileItem = response3.Item;
                                jobProperty.FileItem.FileName = name;
                                jobProperty.FileItem.Extension = name.split('.').pop();
                                jobProperty.FileItem.FileSrc = name;
                                jobProperty.FileItem.LinkCategoryId = jobProperty.thisCategory;
                                jobProperty.saveNewFile();
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
    jobProperty.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", jobProperty.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                jobProperty.FileItem = response.Item;
                jobProperty.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            jobProperty.showErrorIcon();
            return -1;
        });
    }

    jobProperty.showSuccessIcon = function () {
    }

    jobProperty.showErrorIcon = function () {

    }
    //file is exist
    jobProperty.fileIsExist = function (fileName) {
        for (var i = 0; i < jobProperty.FileList.length; i++) {
            if (jobProperty.FileList[i].FileName == fileName) {
                jobProperty.fileIdToDelete = jobProperty.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    jobProperty.getFileItem = function (id) {
        for (var i = 0; i < jobProperty.FileList.length; i++) {
            if (jobProperty.FileList[i].Id == id) {
                return jobProperty.FileList[i];
            }
        }
    }

    //select file or folder
    jobProperty.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            jobProperty.fileTypes = 1;
            jobProperty.selectedFileId = jobProperty.getFileItem(index).Id;
            jobProperty.selectedFileName = jobProperty.getFileItem(index).FileName;
        }
        else {
            jobProperty.fileTypes = 2;
            jobProperty.selectedCategoryId = jobProperty.getCategoryName(index).Id;
            jobProperty.selectedCategoryTitle = jobProperty.getCategoryName(index).Title;
        }

        jobProperty.selectedIndex = index;

    }

    jobProperty.showContractDetails = function (contract) {
        jobProperty.selectedContract = contract;
    }
    //upload file
    jobProperty.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (jobProperty.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ jobProperty.replaceFile(uploadFile.name);
                    jobProperty.itemClicked(null, jobProperty.fileIdToDelete, "file");
                    jobProperty.fileTypes = 1;
                    jobProperty.fileIdToDelete = jobProperty.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                jobProperty.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        jobProperty.FileItem = response2.Item;
                        jobProperty.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        jobProperty.filePickerMainImage.filename =
                          jobProperty.FileItem.FileName;
                        jobProperty.filePickerMainImage.fileId =
                          response2.Item.Id;
                        jobProperty.selectedItem.LinkMainImageId =
                          jobProperty.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      jobProperty.showErrorIcon();
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
                    jobProperty.FileItem = response.Item;
                    jobProperty.FileItem.FileName = uploadFile.name;
                    jobProperty.FileItem.uploadName = uploadFile.uploadName;
                    jobProperty.FileItem.Extension = uploadFile.name.split('.').pop();
                    jobProperty.FileItem.FileSrc = uploadFile.name;
                    jobProperty.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- jobProperty.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", jobProperty.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            jobProperty.FileItem = response.Item;
                            jobProperty.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            jobProperty.filePickerMainImage.filename = jobProperty.FileItem.FileName;
                            jobProperty.filePickerMainImage.fileId = response.Item.Id;
                            jobProperty.selectedItem.LinkMainImageId = response.Item.Id;
                            jobProperty.selectedItem.LinkMainImageId = jobProperty.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        jobProperty.showErrorIcon();
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
    jobProperty.exportFile = function () {
        jobProperty.addRequested = true;
        jobProperty.gridOptions.advancedSearchData.engine.ExportFile = jobProperty.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'JobProperty/exportfile', jobProperty.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            jobProperty.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                jobProperty.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //jobProperty.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    jobProperty.toggleExportForm = function () {
        jobProperty.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        jobProperty.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        jobProperty.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        jobProperty.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        jobProperty.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleJob/JobProperty/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    jobProperty.rowCountChanged = function () {
        if (!angular.isDefined(jobProperty.ExportFileClass.RowCount) || jobProperty.ExportFileClass.RowCount > 5000)
            jobProperty.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    jobProperty.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"JobProperty/count", jobProperty.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            jobProperty.addRequested = false;
            rashaErManage.checkAction(response);
            jobProperty.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            jobProperty.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    jobProperty.thousandSeparator = function (field, digit) {
        var value = digit.replace(new RegExp(",", "g"), '');
        var x = (parseInt(value)).toLocaleString();
        jobProperty.selectedItem[field] = x;
    }

    jobProperty.onRecordStatusChange = function (record) {
        //jobProperty.busyIndicator.isActive = true;
        //var filterstatus = { Filters: [{ PropertyName: "RecordStatus", SearchType: 0, IntValue1: record }] };
        //ajax.call(cmsServerConfig.configApiServerPath+"jobproperty/getAllwithalias", filterstatus, 'POST').success(function (response) {
        //    rashaErManage.checkAction(response);
        //    jobProperty.ListItems = response.ListItems;
        //    jobProperty.gridOptions.fillData(jobProperty.ListItems, response.resultAccess);
        //    jobProperty.gridOptions.currentPageNumber = response.CurrentPageNumber;
        //    jobProperty.gridOptions.totalRowCount = response.TotalRowCount;
        //    jobProperty.gridOptions.rowPerPage = response.RowPerPage;
        //    jobProperty.busyIndicator.isActive = false;
        //}).error(function (data, errCode, c, d) {
        //    jobProperty.busyIndicator.isActive = false;
        //    jobProperty.gridOptions.fillData();
        //    rashaErManage.checkAction(data, errCode);
        //});
    }
}]);

