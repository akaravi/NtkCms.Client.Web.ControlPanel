app.controller("vehiclePropertyController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var vehicleProperty = this;
    vehicleProperty.RouteUploadFileContent = cmsServerConfig.configRouteUploadFileContent;
    vehicleProperty.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    vehicleProperty.attachedFiles = [];
    vehicleProperty.attachedFile = "";
    vehicleProperty.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: 0,
        multiSelect: false,
    }
    vehicleProperty.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        filename: null,
        fileId: 0,
        multiSelect: false,
    }
    vehicleProperty.filePickerFile1 = {
        isActive: true,
        backElement: 'filePickerFile1',
        filename: null,
        fileId: 0,
        multiSelect: false,
    }
    vehicleProperty.filePickerFile2 = {
        isActive: true,
        backElement: 'filePickerFile2',
        filename: null,
        fileId: 0,
        multiSelect: false,
    }
    vehicleProperty.filePickerFile3 = {
        isActive: true,
        backElement: 'filePickerFile3',
        filename: null,
        fileId: 0,
        multiSelect: false,
    }
    vehicleProperty.filePickerFile4 = {
        isActive: true,
        backElement: 'filePickerFile4',
        filename: null,
        fileId: 0,
        multiSelect: false,
    }

    vehicleProperty.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    vehicleProperty.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:vehicleProperty.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:vehicleProperty,
        useCurrentLocationZoom:12,
    }
    vehicleProperty.filePickerMainImage.clear = function () {
        vehicleProperty.filePickerMainImage.fileId = 0;
        vehicleProperty.filePickerMainImage.filename = "";
    }

    vehicleProperty.filePickerFiles.clear = function () {
        vehicleProperty.filePickerFiles.fileId = 0;
        vehicleProperty.filePickerFiles.filename = "";
    }

    if (itemRecordStatus != undefined) vehicleProperty.itemRecordStatus = itemRecordStatus;

    vehicleProperty.propertyTypeListItems = [];
    vehicleProperty.propertyDetailGroupListItems = [];
    vehicleProperty.propertyDetailsListItems = [];
    vehicleProperty.cmsUsersListItems = [];
    vehicleProperty.contractTypeListItems = [];

    vehicleProperty.init = function () {
        vehicleProperty.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"vehicleproperty/getAllwithalias", vehicleProperty.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            vehicleProperty.ListItems = response.ListItems;
            vehicleProperty.gridOptions.fillData(vehicleProperty.ListItems, response.resultAccess);
            vehicleProperty.gridOptions.currentPageNumber = response.CurrentPageNumber;
            vehicleProperty.gridOptions.totalRowCount = response.TotalRowCount;
            vehicleProperty.gridOptions.rowPerPage = response.RowPerPage;
            vehicleProperty.allowedSearch = response.AllowedSearchField;
            vehicleProperty.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            vehicleProperty.busyIndicator.isActive = false;
            vehicleProperty.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"vehiclepropertytype/getAll", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            vehicleProperty.propertyTypeListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            vehicleProperty.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"CoreLocation/GetAllProvinces", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            vehicleProperty.provinceCmsLocatinoListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            vehicleProperty.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    vehicleProperty.busyIndicator.isActive = true;
    vehicleProperty.addRequested = false;
    $(".back1").hide();

    vehicleProperty.attachedFiles = [];
    vehicleProperty.attachedFile = "";
    vehicleProperty.filePickerMainImage.filename = "";
    vehicleProperty.filePickerMainImage.fileId = null;
    vehicleProperty.filePickerFiles.filename = "";
    vehicleProperty.filePickerFiles.fileId = null;

    // Open Add Modal
    vehicleProperty.openAddModal = function () {
        if (buttonIsPressed) return;
        vehicleProperty.onPropertyTypeChange();
        vehicleProperty.modalTitle = 'اضافه';
        //Clear file pickers
        vehicleProperty.attachedFiles = [];
        vehicleProperty.attachedFile = "";
        vehicleProperty.filePickerMainImage.filename = "";
        vehicleProperty.filePickerMainImage.fileId = null;
        vehicleProperty.filePickerFiles.filename = "";
        vehicleProperty.filePickerFiles.fileId = null;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'vehicleproperty/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            vehicleProperty.busyIndicator.isActive = false;
            vehicleProperty.selectedItem = response.Item;
            vehicleProperty.selectedItem.LinkPropertyTypeId = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleVehicle/VehicleProperty/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            vehicleProperty.busyIndicator.isActive = false;
        });
    }

    // Add New Content
    vehicleProperty.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (vehicleProperty.requiredPropertyIsEmpty(vehicleProperty.selectedItem)) {
            rashaErManage("مقادیر الزامی را وارد کنید!");
            return;
        }
        vehicleProperty.busyIndicator.isActive = true;
        vehicleProperty.addRequested = true;
        var valueItem = {};
        vehicleProperty.valueItems = [];
        ajax.call(cmsServerConfig.configApiServerPath+'vehicleproperty/add', vehicleProperty.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                vehicleProperty.closeModal();
                ajax.call(cmsServerConfig.configApiServerPath+"vehiclepropertydetailvalue/GetViewModel", "0", 'GET').success(function (response1) {
                    rashaErManage.checkAction(response1);
                    for (var i = 0; i < vehicleProperty.propertyDetailsListItems.length; i++) {
                        valueItem = $.extend(true, {}, response1.Item);
                        valueItem.LinkPropertyDetailId = vehicleProperty.propertyDetailsListItems[i].Id;
                        valueItem.LinkPropertyId = response.Item.Id;
                        if (vehicleProperty.propertyDetailsListItems[i].DefaultValue != null) {
                            if (vehicleProperty.propertyDetailsListItems[i].DefaultValue.multipleChoice) {
                                var checkboxName = "nameValue" + vehicleProperty.propertyDetailsListItems[i].Id;
                                vehicleProperty.selectionValueNames = [];
                                jQuery("input[name='" + checkboxName + "']").each(function () {
                                    if (this.checked) {
                                        vehicleProperty.selectionValueNames.push(this.value);
                                    }
                                });
                                valueItem.Value = vehicleProperty.selectionValueNames.toString();
                            }
                            else {

                                if (vehicleProperty.propertyDetailsListItems[i].DefaultValue.forceUse && vehicleProperty.propertyDetailsListItems[i].DefaultValue.nameValue.length > 0) {  //ELement is a RadioButton/DropDown
                                    //Do not delete the following comments: Get the value if the element is a RadioButton
                                    /*var radioButton = "nameValue" + vehicleProperty.propertyDetailsListItems[i].Id;
                                    vehicleProperty.selectionValueNames = [];
                                    if ($("input[name='" + radioButton + "']").is(':checked')) {
                                        valueItem.Value = $("input[name='" + radioButton + "']:checked").val(); 
                                    }*/
                                    valueItem.Value = $('#dropDown' + vehicleProperty.propertyDetailsListItems[i].Id).find(":selected").val(); //Get the value if the element is a DropDown

                                } else
                                    valueItem.Value = vehicleProperty.propertyDetailsListItems[i].value;
                            }
                        } else
                            valueItem.Value = vehicleProperty.propertyDetailsListItems[i].value;
                        vehicleProperty.valueItems.push(valueItem);
                    }
                    ajax.call(cmsServerConfig.configApiServerPath+'VehiclePropertyDetailValue/AddBatch', vehicleProperty.valueItems, 'POST').success(function (response2) {
                        rashaErManage.checkAction(response2);
                        if (response2.IsSuccess) {
                            vehicleProperty.ListItems.unshift(response.Item);
                            vehicleProperty.gridOptions.fillData(vehicleProperty.ListItems);
                            vehicleProperty.gridOptions.myfilterText(vehicleProperty.ListItems, "LinkCmsUserId", vehicleProperty.cmsUsersListItems, "Username", "LinkCmsUserUsername");
                            vehicleProperty.gridOptions.myfilterText(vehicleProperty.ListItems, "LinkPropertyTypeId", vehicleProperty.propertyTypeListItems, "Title", "LinkPropertyTypeTitle");
                            vehicleProperty.addRequested = false;
                            vehicleProperty.busyIndicator.isActive = false;
                            //ملک و مقادیر ثبت شده است از کاربر می خواهیم که نوع فروش را مشخص کند
                            vehicleProperty.openAddContractModal(response.Item.Id, response.Item.Title);
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
            vehicleProperty.addRequested = false;
        });
    }

    // Open Edit Content Modal 
    vehicleProperty.openEditModal = function () {
        if (buttonIsPressed) return;
        vehicleProperty.onPropertyTypeChange();
        //Clear file pickers
        vehicleProperty.attachedFiles = [];
        vehicleProperty.attachedFile = "";
        vehicleProperty.filePickerMainImage.filename = "";
        vehicleProperty.filePickerMainImage.fileId = null;
        vehicleProperty.filePickerFiles.filename = "";
        vehicleProperty.filePickerFiles.fileId = null;
        vehicleProperty.modalTitle = 'ویرایش';
        if (!vehicleProperty.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'vehicleproperty/GetOne', parseInt(vehicleProperty.gridOptions.selectedRow.item.Id), 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            vehicleProperty.selectedItem = response.Item;
            vehicleProperty.oldLinkPropertyTypeId = vehicleProperty.selectedItem.LinkPropertyTypeId;
            vehicleProperty.loadDetailValues(vehicleProperty.selectedItem.LinkPropertyTypeId, vehicleProperty.selectedItem.Id);
            //---- Set Province City Location
            //vehicleProperty.onProvinceChange(vehicleProperty.selectedItem.LinkProvinceId);
            //vehicleProperty.onCitiesChange(vehicleProperty.selectedItem.LinkLocationId);
            //---- Set MainImage and AttachedFiles on edit modal open
            vehicleProperty.filePickerMainImage.filename = null;
            vehicleProperty.filePickerMainImage.fileId = null;
            if (response.Item.LinkMainImageId != null && response.Item.LinkMainImageId > 0) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(response.Item.LinkMainImageId), 'GET').success(function (response2) {
                    if (response2.IsSuccess && response2.Item.Id > 9) {
                        vehicleProperty.filePickerMainImage.filename = response2.Item.FileName;
                        vehicleProperty.filePickerMainImage.fileId = response2.Item.Id;
                    }
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            if (response.Item.LinkExtraImageIds != null && response.Item.LinkExtraImageIds != "")
                vehicleProperty.parseFileIds(response.Item.LinkExtraImageIds);
            //*****************************************************************
            $modal.open({
                templateUrl: 'cpanelv1/ModuleVehicle/VehicleProperty/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    vehicleProperty.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        // Edit Property: Title, Description, LinkPropertyTypeId
        vehicleProperty.busyIndicator.isActive = true;
        vehicleProperty.selectedItem.LinkExtraImageIds = stringfyLinkFileIds(vehicleProperty.attachedFiles);
        ajax.call(cmsServerConfig.configApiServerPath+'vehicleproperty/edit', vehicleProperty.selectedItem, 'PUT').success(function (response) {
            vehicleProperty.addRequested = true;
            rashaErManage.checkAction(response);
            vehicleProperty.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                vehicleProperty.addRequested = false;
                vehicleProperty.replaceItem(vehicleProperty.selectedItem.Id, response.Item);
                vehicleProperty.gridOptions.fillData(vehicleProperty.ListItems);
                vehicleProperty.gridOptions.myfilterText(vehicleProperty.ListItems, "LinkCmsUserId", vehicleProperty.cmsUsersListItems, "Username", "LinkCmsUserUsername");
                vehicleProperty.gridOptions.myfilterText(vehicleProperty.ListItems, "LinkPropertyTypeId", vehicleProperty.propertyTypeListItems, "Title", "LinkPropertyTypeTitle");
                vehicleProperty.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            vehicleProperty.addRequested = false;
            vehicleProperty.busyIndicator.isActive = false;
        });

        // ------------------------- Check if Property Type (LinkPropertyTypeId) has changed ---------------------------
        if (vehicleProperty.oldLinkPropertyTypeId != vehicleProperty.selectedItem.LinkPropertyTypeId) {
            var filterValue = {
                PropertyName: "LinkPropertyId",
                IntValue1: parseInt(vehicleProperty.selectedItem.Id),
                SearchType: 0
            }
            var engine = {};
            engine.Filters = [];
            engine.Filters.push(filterValue);
            ajax.call(cmsServerConfig.configApiServerPath+'VehiclePropertyDetailValue/DeleteFilterModel', engine, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                console.log(response.Item);
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                vehicleProperty.busyIndicator.isActive = false;

            });
            ajax.call(cmsServerConfig.configApiServerPath+'VehiclePropertyDetailValue/AddBatch', vehicleProperty.selectedItem.LinkPropertyId, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                console.log(response.Item);
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                vehicleProperty.busyIndicator.isActive = false;

            });
        }
        else {
            // -------------------------************* Set Values to Edit ************------------------------------
            for (var i = 0; i < vehicleProperty.propertyDetailsListItems.length; i++) {
                vehicleProperty.propertyDetailsListItems[i].valueFound = false;
                for (var j = 0; j < vehicleProperty.propertyDetailValuesListItems.length; j++) {
                    if (vehicleProperty.propertyDetailsListItems[i].Id == vehicleProperty.propertyDetailValuesListItems[j].LinkPropertyDetailId) {
                        vehicleProperty.propertyDetailsListItems[i].valueFound = true;
                        if (vehicleProperty.propertyDetailsListItems[i].DefaultValue.multipleChoice == false) { // Detail is not CheckBox
                            if (vehicleProperty.propertyDetailsListItems[i].DefaultValue.forceUse) { // Detail is RadioButton/DropDown
                                /*Do not delete the following comments: Get the value if the element is a RadioButton
                                var radioName = "selection" + vehicleProperty.propertyDetailsListItems[i].Id;
                                var radioValue = vehicleProperty[radioName].toString();
                                vehicleProperty.propertyDetailsListItems[i].value = radioValue; */
                                vehicleProperty.propertyDetailValuesListItems[j].Value = $('#dropDown' + vehicleProperty.propertyDetailsListItems[i].Id).find(":selected").val(); //Get the value if the element is a DropDown
                            }
                            else
                                // Detail is not a CheckBox, nor a RadioButton
                                vehicleProperty.propertyDetailValuesListItems[j].Value = String(vehicleProperty.propertyDetailsListItems[i].value);
                        } else { // Detail is CheckBox
                            var checkboxName = "selection" + vehicleProperty.propertyDetailsListItems[i].Id.toString();
                            vehicleProperty.propertyDetailValuesListItems[j].Value = vehicleProperty[checkboxName].toString();
                        }
                    }
                }
                if (!vehicleProperty.propertyDetailsListItems[i].valueFound) {
                    console.log(vehicleProperty.propertyDetailsListItems[i]);
                    var proeprtyDetailValue = { LinkPropertyId: 0, LinkPropertyDetailId: 0, Value: 0 };
                    if (vehicleProperty.propertyDetailsListItems[i].DefaultValue.multipleChoice == false) { // Detail is not CheckBox
                        if (vehicleProperty.propertyDetailsListItems[i].DefaultValue.forceUse) { // Detail is RadioButton/DropDown
                            vehicleProperty.propertyDetailValuesListItems.push({ Id: 0, LinkPropertyId: vehicleProperty.selectedItem.Id, LinkPropertyDetailId: vehicleProperty.propertyDetailsListItems[i].Id, Value: $('#dropDown' + vehicleProperty.propertyDetailsListItems[i].Id).find(":selected").val() }); //Get the value if the element is a DropDown
                        }
                        else
                            // Detail is not a CheckBox, nor a RadioButton
                            vehicleProperty.propertyDetailValuesListItems.push({ Id: 0, LinkPropertyId: vehicleProperty.selectedItem.Id, LinkPropertyDetailId: vehicleProperty.propertyDetailsListItems[i].Id, Value: String(vehicleProperty.propertyDetailsListItems[i].value) });
                    } else { // Detail is CheckBox
                        var checkboxName = "selection" + vehicleProperty.propertyDetailsListItems[i].Id.toString();
                        vehicleProperty.propertyDetailValuesListItems.push({ Id: 0, LinkPropertyId: vehicleProperty.selectedItem.Id, LinkPropertyDetailId: vehicleProperty.propertyDetailsListItems[i].Id, Value: vehicleProperty[checkboxName].toString() });
                    }
                }
            }
            // ---------------------------------- End of Set Values to Edit --------------------------------------
            vehicleProperty.addRequested = true;
            ajax.call(cmsServerConfig.configApiServerPath+'VehiclePropertyDetailValue/EditBatch', vehicleProperty.propertyDetailValuesListItems, 'PUT').success(function (response) {
                rashaErManage.checkAction(response);
                vehicleProperty.busyIndicator.isActive = false;
                if (response.IsSuccess) {
                    vehicleProperty.addRequested = false;
                    vehicleProperty.closeModal();
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                vehicleProperty.addRequested = false;
                vehicleProperty.busyIndicator.isActive = false;
            });
        }
    }

    vehicleProperty.closeModal = function () {
        $modalStack.dismissAll();
    };

    vehicleProperty.replaceItem = function (oldId, newItem) {
        angular.forEach(vehicleProperty.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = vehicleProperty.ListItems.indexOf(item);
                vehicleProperty.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            vehicleProperty.ListItems.unshift(newItem);
    }

    vehicleProperty.deleteRow = function () {
        if (buttonIsPressed) return;

        if (!vehicleProperty.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                vehicleProperty.busyIndicator.isActive = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'vehicleproperty/GetOne', vehicleProperty.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    vehicleProperty.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'vehicleproperty/delete', vehicleProperty.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        vehicleProperty.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            vehicleProperty.replaceItem(vehicleProperty.selectedItemForDelete.Id);
                            vehicleProperty.gridOptions.fillData(vehicleProperty.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        vehicleProperty.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    vehicleProperty.busyIndicator.isActive = false;
                });
            }
        });
    }

    vehicleProperty.searchData = function () {
        vehicleProperty.gridOptions.searchData();
    }
    vehicleProperty.LinkLocationIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkLocationId',
        url: 'CmsLocation',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'LinkLocationId',
        rowPerPage: 200,
        action: 'GetAllCities',
        scope: vehicleProperty,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'virtual_Parent.Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
                { name: 'Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
            ]
        }
    }
    vehicleProperty.gridOptions = {
        columns: [
            { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Brand', displayName: 'برند', sortable: true, type: 'string', visible: true },
            { name: 'Model', displayName: 'مدل', sortable: true, type: 'string', visible: true },
            { name: 'LinkCmsUserId', displayName: 'کد سیستمی کاربر', sortable: true, type: 'string', visible: true, displayForce: true },
            { name: 'virtual_PropertyType.Title', displayName: 'نوع خودرو', sortable: true, type: 'string', visible: true, displayForce: true },
            { name: 'ViewCount', displayName: 'تعداد بازدید', sortable: true, visible: true, type: 'integer' },
            { name: 'ActionButtons', displayName: 'خصوصیات خودرو', sortable: true, type: 'string', visible: true, displayForce: true, template: '<button type="button" class="btn btn-primary" ng-click="vehicleProperty.openAddContractModal(x.Id,x.Title)"  class="btn btn-primary col-sm-12 col-md-12 col-lg-12"><i class="fa fa-plus-circle" aria-hidden="true"></i>&nbsp;آگهی</button>' }
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

    vehicleProperty.gridOptions.reGetAll = function () {
        vehicleProperty.init();
    }

    vehicleProperty.gridOptions.onRowSelected = function () { }

    vehicleProperty.columnCheckbox = false;

    vehicleProperty.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (vehicleProperty.gridOptions.columnCheckbox) {
            for (var i = 0; i < vehicleProperty.gridOptions.columns.length; i++) {
                //vehicleProperty.gridOptions.columns[i].visible = $("#" + vehicleProperty.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + vehicleProperty.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                vehicleProperty.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = vehicleProperty.gridOptions.columns;
            for (var i = 0; i < vehicleProperty.gridOptions.columns.length; i++) {
                vehicleProperty.gridOptions.columns[i].visible = true;
                var element = $("#" + vehicleProperty.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + vehicleProperty.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < vehicleProperty.gridOptions.columns.length; i++) {
            console.log(vehicleProperty.gridOptions.columns[i].name.concat(".visible: "), vehicleProperty.gridOptions.columns[i].visible);
        }
        vehicleProperty.gridOptions.columnCheckbox = !vehicleProperty.gridOptions.columnCheckbox;
    }

    vehicleProperty.onPropertyTypeChange = function (propertyTypeId) {
        vehicleProperty.propertyDetailsListItems = []; //Clear out the array from previous values
        vehicleProperty.propertyDetailGroupListItems = []; //Clear out the array from previous values
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
        ajax.call(cmsServerConfig.configApiServerPath+"VehiclePropertyDetail/GetAll", engine, 'POST').success(function (response) {
            vehicleProperty.propertyDetailsListItems = response.ListItems;

            $.each(vehicleProperty.propertyDetailsListItems, function (index, item) {
                item.value = null;
                // Add groups to its list
                var result = $.grep(vehicleProperty.propertyDetailGroupListItems, function (e) { return e.Id == item.virtual_PropertyDetailGroup.Id; });
                if (result.length <= 0)
                    vehicleProperty.propertyDetailGroupListItems.push(item.virtual_PropertyDetailGroup);

                // Add DefaultValue to the object
                item.DefaultValue = JSON.parse(item.JsonDefaultValue);
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    vehicleProperty.selectedPropertyDetailsListItems = [];
    vehicleProperty.onPropertyDetailGroupChange = function (propertyDetailGroupId) {
        vehicleProperty.selectedPropertyDetailsListItems = [];
        if (0 < vehicleProperty.propertyDetailsListItems.length) {
            $.each(vehicleProperty.propertyDetailsListItems, function (index, propertyDetail) {
                if (propertyDetail.LinkPropertyDetailGroupId == propertyDetailGroupId) {
                    vehicleProperty.selectedPropertyDetailsListItems.push(propertyDetail);
                }
            });
        }
    }

    // Filter Texts for CmsUser
    vehicleProperty.gridOptions.myfilterText = function (gridListItems, foreignKeyName, childListItems, childDesiredPropertyName, childItemColumnName) {
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
    vehicleProperty.loadDetailValues = function (propertyTypeId, propertyId) {
        var filterValue1 = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(propertyTypeId),
            SearchType: 0
        }
        var engine1 = {
        };
        engine1.Filters = [];
        engine1.Filters.push(filterValue1);
        ajax.call(cmsServerConfig.configApiServerPath+"VehiclePropertyDetail/GetAll", engine1, 'POST').success(function (response1) {
            vehicleProperty.propertyDetailsListItems = response1.ListItems;
            //---------- Load Values ---------------------------------------
            var filterValue2 = {
                PropertyName: "LinkPropertyId",
                IntValue1: parseInt(propertyId),
                SearchType: 0
            }
            var engine2 = { Filters: [] };
            engine2.Filters.push(filterValue2);
            ajax.call(cmsServerConfig.configApiServerPath+"VehiclePropertyDetailValue/GetAll", engine2, 'POST').success(function (response) {
                $.each(vehicleProperty.propertyDetailsListItems, function (index, item) {
                    item.value = null;
                    // Add groups to its list
                    var result = $.grep(vehicleProperty.propertyDetailGroupListItems, function (e) { return e.Id == item.virtual_PropertyDetailGroup.Id; });
                    if (result.length <= 0)
                        vehicleProperty.propertyDetailGroupListItems.push(item.virtual_PropertyDetailGroup);

                    // Add DefaultValue to the object
                    if (item.JsonDefaultValue == null) item.JsonDefaultValue = "{\"nameValue\":[],\"forceUse\":false,\"multipleChoice\":false}"; // جلوگیری از بروز خطا اگر مقادیر پیش فرض تهی باشد
                    item.DefaultValue = JSON.parse(item.JsonDefaultValue);
                });
                vehicleProperty.propertyDetailValuesListItems = response.ListItems;
                for (var i = 0; i < vehicleProperty.propertyDetailsListItems.length; i++) {
                    for (var j = 0; j < vehicleProperty.propertyDetailValuesListItems.length; j++) {
                        if (vehicleProperty.propertyDetailsListItems[i].Id == vehicleProperty.propertyDetailValuesListItems[j].LinkPropertyDetailId) {
                            var jsonDefaultValue = null;
                            try {
                                jsonDefaultValue = JSON.parse(vehicleProperty.propertyDetailsListItems[i].JsonDefaultValue);
                            } catch (e) {
                                console.log(e);
                            }

                            if (vehicleProperty.propertyDetailValuesListItems[j].Value != null) {
                                if (jsonDefaultValue != undefined && jsonDefaultValue != null && jsonDefaultValue.nameValue != undefined && jsonDefaultValue.nameValue != null && 0 < jsonDefaultValue.nameValue.length) {
                                    if (jsonDefaultValue.multipleChoice) {   // Detail is CheckBox
                                        var multipleValues = vehicleProperty.propertyDetailValuesListItems[j].Value.split(',');
                                        setSelection(vehicleProperty.propertyDetailsListItems[i].Id, multipleValues);

                                    }
                                    else if (jsonDefaultValue.forceUse && jsonDefaultValue.nameValue.length > 0) {   // Detail is RadioButton/DropDown
                                        /*Do not delete this line: Load the value if the elements is RadioButton
                                        var radioValues = vehicleProperty.propertyDetailValuesListItems[j].Value.split(',');
                                        setSelection(vehicleProperty.propertyDetailsListItems[i].Id, radioValues); */
                                        vehicleProperty.propertyDetailsListItems[i].value = vehicleProperty.propertyDetailValuesListItems[j].Value;
                                    } else {     // Detail is InputDataList
                                        vehicleProperty.propertyDetailsListItems[i].value = vehicleProperty.propertyDetailValuesListItems[j].Value;
                                    }
                                } else {
                                    switch (vehicleProperty.propertyDetailsListItems[i].InputDataType) {
                                        case 0:                              // Detail is String
                                            vehicleProperty.propertyDetailsListItems[i].value = vehicleProperty.propertyDetailValuesListItems[j].Value;
                                            break;
                                        case 1:                              // Detail is Number
                                            vehicleProperty.propertyDetailsListItems[i].value = parseInt(vehicleProperty.propertyDetailValuesListItems[j].Value);
                                            break;
                                        case 2:                              // Detail is Boolean
                                            vehicleProperty.propertyDetailsListItems[i].value = (vehicleProperty.propertyDetailValuesListItems[j].Value === "true");
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
        vehicleProperty[checkboxName] = values;
    }

    // toggle selection for a given fruit by name
    vehicleProperty.toggleSelection = function (detailId, fruitName) {
        var checkboxName = "selection" + detailId.toString();
        if (vehicleProperty[checkboxName] == undefined)
            vehicleProperty[checkboxName] = [];
        var idx = vehicleProperty[checkboxName].indexOf(fruitName);

        // is currently selected
        if (idx > -1) {
            vehicleProperty[checkboxName].splice(idx, 1);
        }

            // is newly selected
        else {
            vehicleProperty[checkboxName].push(fruitName);
        }
    }

    // toggle selection for a given fruit by name
    vehicleProperty.toggleRadioSelection = function (detailId, fruitName) {
        var radioName = "selection" + detailId.toString();
        var idx = vehicleProperty[radioName].indexOf(fruitName);

        // is currently selected
        if (idx > -1) {

        }
            // is newly selected
        else {
            vehicleProperty[radioName] = [];
            vehicleProperty[radioName].push(fruitName);
        }
    }
    //---------------- End of LoadValues functino ------------------------------

    vehicleProperty.requiredPropertyIsEmpty = function (selectedItem) {
        $.each(vehicleProperty.propertyDetailsListItems, function (index, item) {
            if (item.Required)
                if (item.value == null || item.value == "")
                    return true;
        });
    }

    vehicleProperty.onContractTypeChange = function (contractTypeId) {
        var contractType = {
        };
        for (var i = 0; i < vehicleProperty.contractTypeListItems.length; i++) {
            if (parseInt(contractTypeId) == vehicleProperty.contractTypeListItems[i].Id) {
                vehicleProperty.selectedItem.HasSalePrice = vehicleProperty.contractTypeListItems[i].HasSalePrice;
                vehicleProperty.selectedItem.UnitSalePrice = vehicleProperty.contractTypeListItems[i].UnitSalePrice;
                vehicleProperty.selectedItem.HasPresalePrice = vehicleProperty.contractTypeListItems[i].HasPresalePrice;
                vehicleProperty.selectedItem.UnitPresalePrice = vehicleProperty.contractTypeListItems[i].UnitPresalePrice;
                vehicleProperty.selectedItem.HasRentPrice = vehicleProperty.contractTypeListItems[i].HasRentPrice;
                vehicleProperty.selectedItem.UnitRentPrice = vehicleProperty.contractTypeListItems[i].UnitRentPrice;
                vehicleProperty.selectedItem.HasDepositPrice = vehicleProperty.contractTypeListItems[i].HasDepositPrice;
                vehicleProperty.selectedItem.UnitDepositPrice = vehicleProperty.contractTypeListItems[i].UnitDepositPrice;
            }
        }
    }
  

    vehicleProperty.contractsList = [];
    vehicleProperty.openAddContractModal = function (propertyId, propertyTitle) {
        ajax.call(cmsServerConfig.configApiServerPath+"vehiclecontracttype/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            vehicleProperty.busyIndicator.isActive = false;
            vehicleProperty.contractTypeListItems = response.ListItems;
            vehicleProperty.selectedItem.LinkPropertyTypeId = null;
        }).error(function (data, errCode, c, d) {
            vehicleProperty.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
        ajax.call(cmsServerConfig.configApiServerPath+'VehicleContract/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                vehicleProperty.selectedItem = response.Item;
                vehicleProperty.selectedItem.LinkPropertyId = parseInt(propertyId);  // Set LinkPropertyId for new Contract
                vehicleProperty.selectedItem.LinkPropertyTitle = propertyTitle;  // Set LinkPropertyId for new Contract
                var model = {
                };
                model.Filters = [];
                model.Filters.push({ PropertyName: "LinkPropertyId", IntValue1: parseInt(propertyId), SearchType: 0 });
                ajax.call(cmsServerConfig.configApiServerPath+'VehicleContract/getall', model, 'POST').success(function (response) {
                    rashaErManage.checkAction(response);
                    vehicleProperty.contractsList = response.ListItems;
                    vehicleProperty.contractsListresultAccess = response.resultAccess;
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleVehicle/VehicleProperty/addContract.html',
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

    vehicleProperty.addContract = function () {
        var duplicateContract = false;
        var erMessage = "";
        if (vehicleProperty.selectedItem.LinkVehicleContractTypeId == null || vehicleProperty.selectedItem.LinkVehicleContractTypeId < 0)
            return;
        $.each(vehicleProperty.contractsList, function (index, item) {
            if (item.LinkVehicleContractTypeId == parseInt(vehicleProperty.selectedItem.LinkVehicleContractTypeId)) {
                erMessage = "آگهی" + ' ' + item.virtual_ContractType.Title + ' ' + "قبلاً برای این ملک ثبت شده است!";
                duplicateContract = true;
                return;
            }
        });
        if (duplicateContract) {
            rashaErManage.showMessage(erMessage);
            return;
        }
        vehicleProperty.addRequested = true;
        vehicleProperty.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'VehicleContract/add', vehicleProperty.selectedItem, 'POST').success(function (response) {
            vehicleProperty.addRequested = false;
            vehicleProperty.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                vehicleProperty.contractsList.push(response.Item);
                vehicleProperty.selectedItem.SalePrice = null;
                vehicleProperty.selectedItem.PresalePrice = null;
                vehicleProperty.selectedItem.DepositPrice = null;
                vehicleProperty.selectedItem.RentPrice = null;
                vehicleProperty.selectedItem.Description = "";
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            vehicleProperty.addRequested = false;
        });

    }

    vehicleProperty.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }

    // ----------- FilePicker Codes --------------------------
    vehicleProperty.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !vehicleProperty.alreadyExist(id, vehicleProperty.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            vehicleProperty.attachedFiles.push(file);
            vehicleProperty.clearfilePickers();

        }
    }

    vehicleProperty.alreadyExist = function (fieldName, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldName == array[i]) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                vehicleProperty.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    vehicleProperty.editContract = function (index) {
        vehicleProperty.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'VehicleContract/edit', vehicleProperty.contractsList[index], 'PUT').success(function (res) {
            vehicleProperty.addRequested = false;
            rashaErManage.checkAction(res);
            if (res.IsSuccess) {
                vehicleProperty.contractsList.splice(index, 1);
                vehicleProperty.contractsList.push(res.Item)
                rashaErManage.showMessage("ویرایش با موفقیت انجام شد!");
            }
        }).error(function (data2, errCode2, c2, d2) {
            rashaErManage.checkAction(data2);
        });
    }

    vehicleProperty.deleteContract = function (index) {
        vehicleProperty.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'VehicleContract/delete', vehicleProperty.contractsList[index], 'POST').success(function (res) {
            vehicleProperty.addRequested = false;
            rashaErManage.checkAction(res);
            if (res.IsSuccess) {
                vehicleProperty.contractsList.splice(index, 1);
                rashaErManage.showMessage($filter('translatentk')('Removed_Successfully'));
            }
        }).error(function (data2, errCode2, c2, d2) {
            rashaErManage.checkAction(data2);
        });
    }

    vehicleProperty.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            if (index == 0)
                                vehicleProperty.selectedItem.LinkExtraImageId1 = response.Item.Id;
                            if (index == 1)
                                vehicleProperty.selectedItem.LinkExtraImageId2 = response.Item.Id;
                            if (index == 2)
                                vehicleProperty.selectedItem.LinkExtraImageId3 = response.Item.Id;
                            if (index == 3)
                                vehicleProperty.selectedItem.LinkExtraImageId4 = response.Item.Id;
                            //vehicleProperty.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    vehicleProperty.clearfilePickers = function () {
        vehicleProperty.filePickerFiles.filename = null;
        vehicleProperty.filePickerFiles.fileId = null;
    }

    function stringfyLinkFileIds(arrayOfFiles) {
        //var ret = "";
        //$.each(arrayOfFiles, function (index, item) {
        //    if (ret == "")
        //        ret = item.fileId;
        //    else
        //        ret = ret + ',' + item.fileId;
        //});
        //return ret.toString();
        var ret = "";
        if (vehicleProperty.selectedItem.LinkExtraImageId1 != null || vehicleProperty.selectedItem.LinkExtraImageId1 != "")
            ret = vehicleProperty.selectedItem.LinkExtraImageId1;
        if (vehicleProperty.selectedItem.LinkExtraImageId2 != null || vehicleProperty.selectedItem.LinkExtraImageId2 != "")
            ret = ret + ',' + vehicleProperty.selectedItem.LinkExtraImageId2;
        if (vehicleProperty.selectedItem.LinkExtraImageId3 != null || vehicleProperty.selectedItem.LinkExtraImageId3 != "")
            ret = ret + ',' + vehicleProperty.selectedItem.LinkExtraImageId3;
        if (vehicleProperty.selectedItem.LinkExtraImageId4 != null || vehicleProperty.selectedItem.LinkExtraImageId4 != "")
            ret = ret + ',' + vehicleProperty.selectedItem.LinkExtraImageId4;
    }
    //--------- End FilePickers Codes ------------------------

    //---------------Upload Modal-----------------------------
    vehicleProperty.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleVehicle/VehicleProperty/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        vehicleProperty.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            vehicleProperty.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    vehicleProperty.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    vehicleProperty.whatcolor = function (progress) {
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

    vehicleProperty.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    vehicleProperty.replaceFile = function (name) {
        vehicleProperty.itemClicked(null, vehicleProperty.fileIdToDelete, "file");
        vehicleProperty.fileTypes = 1;
        vehicleProperty.fileIdToDelete = vehicleProperty.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", vehicleProperty.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    vehicleProperty.remove(vehicleProperty.FileList, vehicleProperty.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                vehicleProperty.FileItem = response3.Item;
                                vehicleProperty.FileItem.FileName = name;
                                vehicleProperty.FileItem.Extension = name.split('.').pop();
                                vehicleProperty.FileItem.FileSrc = name;
                                vehicleProperty.FileItem.LinkCategoryId = vehicleProperty.thisCategory;
                                vehicleProperty.saveNewFile();
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
    vehicleProperty.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", vehicleProperty.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                vehicleProperty.FileItem = response.Item;
                vehicleProperty.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            vehicleProperty.showErrorIcon();
            return -1;
        });
    }

    vehicleProperty.showSuccessIcon = function () {
    }

    vehicleProperty.showErrorIcon = function () {

    }
    //file is exist
    vehicleProperty.fileIsExist = function (fileName) {
        for (var i = 0; i < vehicleProperty.FileList.length; i++) {
            if (vehicleProperty.FileList[i].FileName == fileName) {
                vehicleProperty.fileIdToDelete = vehicleProperty.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    vehicleProperty.getFileItem = function (id) {
        for (var i = 0; i < vehicleProperty.FileList.length; i++) {
            if (vehicleProperty.FileList[i].Id == id) {
                return vehicleProperty.FileList[i];
            }
        }
    }

    //select file or folder
    vehicleProperty.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            vehicleProperty.fileTypes = 1;
            vehicleProperty.selectedFileId = vehicleProperty.getFileItem(index).Id;
            vehicleProperty.selectedFileName = vehicleProperty.getFileItem(index).FileName;
        }
        else {
            vehicleProperty.fileTypes = 2;
            vehicleProperty.selectedCategoryId = vehicleProperty.getCategoryName(index).Id;
            vehicleProperty.selectedCategoryTitle = vehicleProperty.getCategoryName(index).Title;
        }

        vehicleProperty.selectedIndex = index;

    }

    vehicleProperty.showContractDetails = function (contract) {
        vehicleProperty.selectedContract = contract;
    }
    //upload file
    vehicleProperty.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (vehicleProperty.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ vehicleProperty.replaceFile(uploadFile.name);
                    vehicleProperty.itemClicked(null, vehicleProperty.fileIdToDelete, "file");
                    vehicleProperty.fileTypes = 1;
                    vehicleProperty.fileIdToDelete = vehicleProperty.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                vehicleProperty.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        vehicleProperty.FileItem = response2.Item;
                        vehicleProperty.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        vehicleProperty.filePickerMainImage.filename =
                          vehicleProperty.FileItem.FileName;
                        vehicleProperty.filePickerMainImage.fileId =
                          response2.Item.Id;
                        vehicleProperty.selectedItem.LinkMainImageId =
                          vehicleProperty.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      vehicleProperty.showErrorIcon();
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
                    vehicleProperty.FileItem = response.Item;
                    vehicleProperty.FileItem.FileName = uploadFile.name;
                    vehicleProperty.FileItem.uploadName = uploadFile.uploadName;
                    vehicleProperty.FileItem.Extension = uploadFile.name.split('.').pop();
                    vehicleProperty.FileItem.FileSrc = uploadFile.name;
                    vehicleProperty.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- vehicleProperty.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", vehicleProperty.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            vehicleProperty.FileItem = response.Item;
                            vehicleProperty.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            vehicleProperty.filePickerMainImage.filename = vehicleProperty.FileItem.FileName;
                            vehicleProperty.filePickerMainImage.fileId = response.Item.Id;
                            vehicleProperty.selectedItem.LinkMainImageId = response.Item.Id;
                            vehicleProperty.selectedItem.LinkMainImageId = vehicleProperty.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        vehicleProperty.showErrorIcon();
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
    vehicleProperty.exportFile = function () {
        vehicleProperty.addRequested = true;
        vehicleProperty.gridOptions.advancedSearchData.engine.ExportFile = vehicleProperty.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'VehicleProperty/exportfile', vehicleProperty.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            vehicleProperty.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                vehicleProperty.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //vehicleProperty.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    vehicleProperty.toggleExportForm = function () {
        vehicleProperty.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        vehicleProperty.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        vehicleProperty.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        vehicleProperty.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        vehicleProperty.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleVehicle/VehicleProperty/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    vehicleProperty.rowCountChanged = function () {
        if (!angular.isDefined(vehicleProperty.ExportFileClass.RowCount) || vehicleProperty.ExportFileClass.RowCount > 5000)
            vehicleProperty.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    vehicleProperty.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"VehicleProperty/count", vehicleProperty.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            vehicleProperty.addRequested = false;
            rashaErManage.checkAction(response);
            vehicleProperty.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            vehicleProperty.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    vehicleProperty.thousandSeparator = function (field, digit) {
        var value = digit.replace(new RegExp(",", "g"), '');
        var x = (parseInt(value)).toLocaleString();
        vehicleProperty.selectedItem[field] = x;
    }

    vehicleProperty.onRecordStatusChange = function (record) {
        //vehicleProperty.busyIndicator.isActive = true;
        //var filterstatus = { Filters: [{ PropertyName: "RecordStatus", SearchType: 0, IntValue1: record }] };
        //ajax.call(cmsServerConfig.configApiServerPath+"vehicleproperty/getAllwithalias", filterstatus, 'POST').success(function (response) {
        //    rashaErManage.checkAction(response);
        //    vehicleProperty.ListItems = response.ListItems;
        //    vehicleProperty.gridOptions.fillData(vehicleProperty.ListItems, response.resultAccess);
        //    vehicleProperty.gridOptions.currentPageNumber = response.CurrentPageNumber;
        //    vehicleProperty.gridOptions.totalRowCount = response.TotalRowCount;
        //    vehicleProperty.gridOptions.rowPerPage = response.RowPerPage;
        //    vehicleProperty.busyIndicator.isActive = false;
        //}).error(function (data, errCode, c, d) {
        //    vehicleProperty.busyIndicator.isActive = false;
        //    vehicleProperty.gridOptions.fillData();
        //    rashaErManage.checkAction(data, errCode);
        //});
    }
}]);

