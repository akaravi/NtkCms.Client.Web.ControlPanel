app.controller("advertisementPropertyController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var advertisementProperty = this;
    advertisementProperty.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    advertisementProperty.attachedFiles = [];
    advertisementProperty.attachedFile = "";
    advertisementProperty.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: 0,
        multiSelect: false,
    }

    advertisementProperty.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        filename: null,
        fileId: 0,
        multiSelect: false,
    }
    advertisementProperty.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    advertisementProperty.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:advertisementProperty.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:advertisementProperty,
        useCurrentLocationZoom:12,
    }
    advertisementProperty.filePickerMainImage.clear = function () {
        advertisementProperty.filePickerMainImage.fileId = 0;
        advertisementProperty.filePickerMainImage.filename = "";
    }

    advertisementProperty.filePickerFiles.clear = function () {
        advertisementProperty.filePickerFiles.fileId = 0;
        advertisementProperty.filePickerFiles.filename = "";
    }

    if (itemRecordStatus != undefined) advertisementProperty.itemRecordStatus = itemRecordStatus;

    advertisementProperty.propertyTypeListItems = [];
    advertisementProperty.propertyDetailGroupListItems = [];
    advertisementProperty.propertyDetailsListItems = [];
    advertisementProperty.cmsUsersListItems = [];
    advertisementProperty.contractTypeListItems = [];

    advertisementProperty.init = function () {
        advertisementProperty.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"advertisementproperty/getAllwithalias", advertisementProperty.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            advertisementProperty.ListItems = response.ListItems;
            advertisementProperty.gridOptions.fillData(advertisementProperty.ListItems, response.resultAccess);
            advertisementProperty.gridOptions.currentPageNumber = response.CurrentPageNumber;
            advertisementProperty.gridOptions.totalRowCount = response.TotalRowCount;
            advertisementProperty.gridOptions.rowPerPage = response.RowPerPage;
            advertisementProperty.allowedSearch = response.AllowedSearchField;
            advertisementProperty.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            advertisementProperty.busyIndicator.isActive = false;
            advertisementProperty.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"advertisementpropertytype/getAll", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            advertisementProperty.propertyTypeListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            advertisementProperty.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"CoreLocation/GetAllProvinces", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            advertisementProperty.provinceCmsLocatinoListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            advertisementProperty.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    advertisementProperty.busyIndicator.isActive = true;
    advertisementProperty.addRequested = false;
    $(".back1").hide();

    advertisementProperty.attachedFiles = [];
    advertisementProperty.attachedFile = "";
    advertisementProperty.filePickerMainImage.filename = "";
    advertisementProperty.filePickerMainImage.fileId = null;
    advertisementProperty.filePickerFiles.filename = "";
    advertisementProperty.filePickerFiles.fileId = null;

    // Open Add Modal
    advertisementProperty.openAddModal = function () {
        if (buttonIsPressed) return;
        advertisementProperty.onPropertyTypeChange();
        advertisementProperty.modalTitle = 'اضافه';
        //Clear file pickers
        advertisementProperty.attachedFiles = [];
        advertisementProperty.attachedFile = "";
        advertisementProperty.filePickerMainImage.filename = "";
        advertisementProperty.filePickerMainImage.fileId = null;
        advertisementProperty.filePickerFiles.filename = "";
        advertisementProperty.filePickerFiles.fileId = null;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementproperty/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            advertisementProperty.busyIndicator.isActive = false;
            advertisementProperty.selectedItem = response.Item;
            advertisementProperty.selectedItem.LinkPropertyTypeId = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleAdvertisement/AdvertisementProperty/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            advertisementProperty.busyIndicator.isActive = false;
        });
    }

    // Add New Content
    advertisementProperty.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (advertisementProperty.requiredPropertyIsEmpty(advertisementProperty.selectedItem)) {
            rashaErManage("مقادیر الزامی را وارد کنید!");
            return;
        }
        advertisementProperty.busyIndicator.isActive = true;
        advertisementProperty.addRequested = true;
        var valueItem = {};
        advertisementProperty.valueItems = [];
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementproperty/add', advertisementProperty.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                advertisementProperty.closeModal();
                ajax.call(cmsServerConfig.configApiServerPath+"advertisementpropertydetailvalue/GetViewModel", "0", 'GET').success(function (response1) {
                    rashaErManage.checkAction(response1);
                    for (var i = 0; i < advertisementProperty.propertyDetailsListItems.length; i++) {
                        valueItem = $.extend(true, {}, response1.Item);
                        valueItem.LinkPropertyDetailId = advertisementProperty.propertyDetailsListItems[i].Id;
                        valueItem.LinkPropertyId = response.Item.Id;
                        if (advertisementProperty.propertyDetailsListItems[i].DefaultValue != null) {
                            if (advertisementProperty.propertyDetailsListItems[i].DefaultValue.multipleChoice) {
                                var checkboxName = "nameValue" + advertisementProperty.propertyDetailsListItems[i].Id;
                                advertisementProperty.selectionValueNames = [];
                                jQuery("input[name='" + checkboxName + "']").each(function () {
                                    if (this.checked) {
                                        advertisementProperty.selectionValueNames.push(this.value);
                                    }
                                });
                                valueItem.Value = advertisementProperty.selectionValueNames.toString();
                            }
                            else {

                                if (advertisementProperty.propertyDetailsListItems[i].DefaultValue.forceUse && advertisementProperty.propertyDetailsListItems[i].DefaultValue.nameValue.length > 0) {  //ELement is a RadioButton/DropDown
                                    //Do not delete the following comments: Get the value if the element is a RadioButton
                                    /*var radioButton = "nameValue" + advertisementProperty.propertyDetailsListItems[i].Id;
                                    advertisementProperty.selectionValueNames = [];
                                    if ($("input[name='" + radioButton + "']").is(':checked')) {
                                        valueItem.Value = $("input[name='" + radioButton + "']:checked").val(); 
                                    }*/
                                    valueItem.Value = $('#dropDown' + advertisementProperty.propertyDetailsListItems[i].Id).find(":selected").val(); //Get the value if the element is a DropDown

                                } else
                                    valueItem.Value = advertisementProperty.propertyDetailsListItems[i].value;
                            }
                        } else
                            valueItem.Value = advertisementProperty.propertyDetailsListItems[i].value;
                        advertisementProperty.valueItems.push(valueItem);
                    }
                    ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementPropertyDetailValue/AddBatch', advertisementProperty.valueItems, 'POST').success(function (response2) {
                        rashaErManage.checkAction(response2);
                        if (response2.IsSuccess) {
                            advertisementProperty.ListItems.unshift(response.Item);
                            advertisementProperty.gridOptions.fillData(advertisementProperty.ListItems);
                            advertisementProperty.gridOptions.myfilterText(advertisementProperty.ListItems, "LinkCmsUserId", advertisementProperty.cmsUsersListItems, "Username", "LinkCmsUserUsername");
                            advertisementProperty.gridOptions.myfilterText(advertisementProperty.ListItems, "LinkPropertyTypeId", advertisementProperty.propertyTypeListItems, "Title", "LinkPropertyTypeTitle");
                            advertisementProperty.addRequested = false;
                            advertisementProperty.busyIndicator.isActive = false;
                            //ملک و مقادیر ثبت شده است از کاربر می خواهیم که نوع فروش را مشخص کند
                            advertisementProperty.openAddContractModal(response.Item.Id, response.Item.Title);
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
            advertisementProperty.addRequested = false;
        });
    }

    // Open Edit Content Modal 
    advertisementProperty.openEditModal = function () {
        if (buttonIsPressed) return;
        advertisementProperty.onPropertyTypeChange();
        //Clear file pickers
        advertisementProperty.attachedFiles = [];
        advertisementProperty.attachedFile = "";
        advertisementProperty.filePickerMainImage.filename = "";
        advertisementProperty.filePickerMainImage.fileId = null;
        advertisementProperty.filePickerFiles.filename = "";
        advertisementProperty.filePickerFiles.fileId = null;
        advertisementProperty.modalTitle = 'ویرایش';
        if (!advertisementProperty.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementproperty/GetOne', parseInt(advertisementProperty.gridOptions.selectedRow.item.Id), 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            advertisementProperty.selectedItem = response.Item;
            advertisementProperty.oldLinkPropertyTypeId = advertisementProperty.selectedItem.LinkPropertyTypeId;
            advertisementProperty.loadDetailValues(advertisementProperty.selectedItem.LinkPropertyTypeId, advertisementProperty.selectedItem.Id);
            //---- Set Province City Location
            //advertisementProperty.onProvinceChange(advertisementProperty.selectedItem.LinkProvinceId);
            //advertisementProperty.onCitiesChange(advertisementProperty.selectedItem.LinkLocationId);
            //---- Set MainImage and AttachedFiles on edit modal open
            advertisementProperty.filePickerMainImage.filename = null;
            advertisementProperty.filePickerMainImage.fileId = null;
            if (response.Item.LinkMainImageId != null && response.Item.LinkMainImageId > 0) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(response.Item.LinkMainImageId), 'GET').success(function (response2) {
                    if (response2.IsSuccess && response2.Item.Id > 9) {
                        advertisementProperty.filePickerMainImage.filename = response2.Item.FileName;
                        advertisementProperty.filePickerMainImage.fileId = response2.Item.Id;
                    }
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            if (response.Item.LinkExtraImageIds != null && response.Item.LinkExtraImageIds != "")
                advertisementProperty.parseFileIds(response.Item.LinkExtraImageIds);
            //*****************************************************************
            $modal.open({
                templateUrl: 'cpanelv1/ModuleAdvertisement/AdvertisementProperty/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    advertisementProperty.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        // Edit Property: Title, Description, LinkPropertyTypeId
        advertisementProperty.busyIndicator.isActive = true;
        advertisementProperty.selectedItem.LinkExtraImageIds = stringfyLinkFileIds(advertisementProperty.attachedFiles);
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementproperty/edit', advertisementProperty.selectedItem, 'PUT').success(function (response) {
            advertisementProperty.addRequested = true;
            rashaErManage.checkAction(response);
            advertisementProperty.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                advertisementProperty.addRequested = false;
                advertisementProperty.replaceItem(advertisementProperty.selectedItem.Id, response.Item);
                advertisementProperty.gridOptions.fillData(advertisementProperty.ListItems);
                advertisementProperty.gridOptions.myfilterText(advertisementProperty.ListItems, "LinkCmsUserId", advertisementProperty.cmsUsersListItems, "Username", "LinkCmsUserUsername");
                advertisementProperty.gridOptions.myfilterText(advertisementProperty.ListItems, "LinkPropertyTypeId", advertisementProperty.propertyTypeListItems, "Title", "LinkPropertyTypeTitle");
                advertisementProperty.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            advertisementProperty.addRequested = false;
            advertisementProperty.busyIndicator.isActive = false;
        });

        // ------------------------- Check if Property Type (LinkPropertyTypeId) has changed ---------------------------
        if (advertisementProperty.oldLinkPropertyTypeId != advertisementProperty.selectedItem.LinkPropertyTypeId) {
            var filterValue = {
                PropertyName: "LinkPropertyId",
                IntValue1: parseInt(advertisementProperty.selectedItem.Id),
                SearchType: 0
            }
            var engine = {};
            engine.Filters = [];
            engine.Filters.push(filterValue);
            ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementPropertyDetailValue/deleteList', engine, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                console.log(response.Item);
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                advertisementProperty.busyIndicator.isActive = false;

            });
            ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementPropertyDetailValue/AddBatch', advertisementProperty.selectedItem.LinkPropertyId, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                console.log(response.Item);
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                advertisementProperty.busyIndicator.isActive = false;

            });
        }
        else {
            // -------------------------************* Set Values to Edit ************------------------------------
            for (var i = 0; i < advertisementProperty.propertyDetailsListItems.length; i++) {
                advertisementProperty.propertyDetailsListItems[i].valueFound = false;
                for (var j = 0; j < advertisementProperty.propertyDetailValuesListItems.length; j++) {
                    if (advertisementProperty.propertyDetailsListItems[i].Id == advertisementProperty.propertyDetailValuesListItems[j].LinkPropertyDetailId) {
                        advertisementProperty.propertyDetailsListItems[i].valueFound = true;
                        if (advertisementProperty.propertyDetailsListItems[i].DefaultValue.multipleChoice == false) { // Detail is not CheckBox
                            if (advertisementProperty.propertyDetailsListItems[i].DefaultValue.forceUse) { // Detail is RadioButton/DropDown
                                /*Do not delete the following comments: Get the value if the element is a RadioButton
                                var radioName = "selection" + advertisementProperty.propertyDetailsListItems[i].Id;
                                var radioValue = advertisementProperty[radioName].toString();
                                advertisementProperty.propertyDetailsListItems[i].value = radioValue; */
                                advertisementProperty.propertyDetailValuesListItems[j].Value = $('#dropDown' + advertisementProperty.propertyDetailsListItems[i].Id).find(":selected").val(); //Get the value if the element is a DropDown
                            }
                            else
                                // Detail is not a CheckBox, nor a RadioButton
                                advertisementProperty.propertyDetailValuesListItems[j].Value = String(advertisementProperty.propertyDetailsListItems[i].value);
                        } else { // Detail is CheckBox
                            var checkboxName = "selection" + advertisementProperty.propertyDetailsListItems[i].Id.toString();
                            advertisementProperty.propertyDetailValuesListItems[j].Value = advertisementProperty[checkboxName].toString();
                        }
                    }
                }
                if (!advertisementProperty.propertyDetailsListItems[i].valueFound) {
                    console.log(advertisementProperty.propertyDetailsListItems[i]);
                    var proeprtyDetailValue = { LinkPropertyId: 0, LinkPropertyDetailId: 0, Value: 0 };
                    if (advertisementProperty.propertyDetailsListItems[i].DefaultValue.multipleChoice == false) { // Detail is not CheckBox
                        if (advertisementProperty.propertyDetailsListItems[i].DefaultValue.forceUse) { // Detail is RadioButton/DropDown
                            advertisementProperty.propertyDetailValuesListItems.push({ Id: 0, LinkPropertyId: advertisementProperty.selectedItem.Id, LinkPropertyDetailId: advertisementProperty.propertyDetailsListItems[i].Id, Value: $('#dropDown' + advertisementProperty.propertyDetailsListItems[i].Id).find(":selected").val() }); //Get the value if the element is a DropDown
                        }
                        else
                            // Detail is not a CheckBox, nor a RadioButton
                            advertisementProperty.propertyDetailValuesListItems.push({ Id: 0, LinkPropertyId: advertisementProperty.selectedItem.Id, LinkPropertyDetailId: advertisementProperty.propertyDetailsListItems[i].Id, Value: String(advertisementProperty.propertyDetailsListItems[i].value) });
                    } else { // Detail is CheckBox
                        var checkboxName = "selection" + advertisementProperty.propertyDetailsListItems[i].Id.toString();
                        advertisementProperty.propertyDetailValuesListItems.push({ Id: 0, LinkPropertyId: advertisementProperty.selectedItem.Id, LinkPropertyDetailId: advertisementProperty.propertyDetailsListItems[i].Id, Value: advertisementProperty[checkboxName].toString() });
                    }
                }
            }
            // ---------------------------------- End of Set Values to Edit --------------------------------------
            advertisementProperty.addRequested = true;
            ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementPropertyDetailValue/EditBatch', advertisementProperty.propertyDetailValuesListItems, 'PUT').success(function (response) {
                rashaErManage.checkAction(response);
                advertisementProperty.busyIndicator.isActive = false;
                if (response.IsSuccess) {
                    advertisementProperty.addRequested = false;
                    advertisementProperty.closeModal();
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                advertisementProperty.addRequested = false;
                advertisementProperty.busyIndicator.isActive = false;
            });
        }
    }

    advertisementProperty.closeModal = function () {
        $modalStack.dismissAll();
    };

    advertisementProperty.replaceItem = function (oldId, newItem) {
        angular.forEach(advertisementProperty.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = advertisementProperty.ListItems.indexOf(item);
                advertisementProperty.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            advertisementProperty.ListItems.unshift(newItem);
    }

    advertisementProperty.deleteRow = function () {
        if (buttonIsPressed) return;

        if (!advertisementProperty.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                advertisementProperty.busyIndicator.isActive = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'advertisementproperty/GetOne', advertisementProperty.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    advertisementProperty.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'advertisementproperty/delete', advertisementProperty.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        advertisementProperty.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            advertisementProperty.replaceItem(advertisementProperty.selectedItemForDelete.Id);
                            advertisementProperty.gridOptions.fillData(advertisementProperty.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        advertisementProperty.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    advertisementProperty.busyIndicator.isActive = false;
                });
            }
        });
    }

    advertisementProperty.searchData = function () {
        advertisementProperty.gridOptions.searchData();
    }
    advertisementProperty.LinkLocationIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkLocationId',
        url: 'CmsLocation',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'LinkLocationId',
        rowPerPage: 200,
        action: 'GetAllCities',
        scope: advertisementProperty,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'virtual_Parent.Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
                { name: 'Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
            ]
        }
    }
    advertisementProperty.gridOptions = {
        columns: [
            { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'نام', sortable: true, type: 'string', visible: true },
            { name: 'Description', displayName: 'توضیح', sortable: true, type: 'string', visible: true, excerpt: true, excerptLength: 30 },
            { name: 'LinkCmsUserId', displayName: 'کد سیستمی کاربر', sortable: true, type: 'string', visible: true, displayForce: true },
            { name: 'virtual_PropertyType.Title', displayName: 'نوع آگهی', sortable: true, type: 'string', visible: true, displayForce: true },      
            { name: 'ViewCount', displayName: 'تعداد بازدید', sortable: true, visible: true,type:'integer' },
            { name: 'ActionButtons', displayName: 'خصوصیات آگهی', sortable: true, type: 'string', visible: true, displayForce: true, template: '<button type="button" class="btn btn-primary" ng-click="advertisementProperty.openAddContractModal(x.Id,x.Title)"  class="btn btn-primary"><i class="fa fa-plus-circle" aria-hidden="true"></i>&nbsp;سپردن نوع معامله</button>' }
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

    advertisementProperty.gridOptions.reGetAll = function () {
        advertisementProperty.init();
    }

    advertisementProperty.gridOptions.onRowSelected = function () { }

    advertisementProperty.columnCheckbox = false;

    advertisementProperty.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (advertisementProperty.gridOptions.columnCheckbox) {
            for (var i = 0; i < advertisementProperty.gridOptions.columns.length; i++) {
                //advertisementProperty.gridOptions.columns[i].visible = $("#" + advertisementProperty.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + advertisementProperty.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                advertisementProperty.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = advertisementProperty.gridOptions.columns;
            for (var i = 0; i < advertisementProperty.gridOptions.columns.length; i++) {
                advertisementProperty.gridOptions.columns[i].visible = true;
                var element = $("#" + advertisementProperty.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + advertisementProperty.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < advertisementProperty.gridOptions.columns.length; i++) {
            console.log(advertisementProperty.gridOptions.columns[i].name.concat(".visible: "), advertisementProperty.gridOptions.columns[i].visible);
        }
        advertisementProperty.gridOptions.columnCheckbox = !advertisementProperty.gridOptions.columnCheckbox;
    }

    advertisementProperty.onPropertyTypeChange = function (propertyTypeId) {
        advertisementProperty.propertyDetailsListItems = []; //Clear out the array from previous values
        advertisementProperty.propertyDetailGroupListItems = []; //Clear out the array from previous values
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
        ajax.call(cmsServerConfig.configApiServerPath+"AdvertisementPropertyDetail/GetAll", engine, 'POST').success(function (response) {
            advertisementProperty.propertyDetailsListItems = response.ListItems;

            $.each(advertisementProperty.propertyDetailsListItems, function (index, item) {
                item.value = null;
                // Add groups to its list
                var result = $.grep(advertisementProperty.propertyDetailGroupListItems, function (e) { return e.Id == item.virtual_PropertyDetailGroup.Id; });
                if (result.length <= 0)
                    advertisementProperty.propertyDetailGroupListItems.push(item.virtual_PropertyDetailGroup);

                // Add DefaultValue to the object
                item.DefaultValue = JSON.parse(item.JsonDefaultValue);
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    advertisementProperty.selectedPropertyDetailsListItems = [];
    advertisementProperty.onPropertyDetailGroupChange = function (propertyDetailGroupId) {
        advertisementProperty.selectedPropertyDetailsListItems = [];
        if (0 < advertisementProperty.propertyDetailsListItems.length) {
            $.each(advertisementProperty.propertyDetailsListItems, function (index, propertyDetail) {
                if (propertyDetail.LinkPropertyDetailGroupId == propertyDetailGroupId) {
                    advertisementProperty.selectedPropertyDetailsListItems.push(propertyDetail);
                }
            });
        }
    }

    // Filter Texts for CmsUser
    advertisementProperty.gridOptions.myfilterText = function (gridListItems, foreignKeyName, childListItems, childDesiredPropertyName, childItemColumnName) {
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
    advertisementProperty.loadDetailValues = function (propertyTypeId, propertyId) {
        var filterValue1 = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(propertyTypeId),
            SearchType: 0
        }
        var engine1 = {
        };
        engine1.Filters = [];
        engine1.Filters.push(filterValue1);
        ajax.call(cmsServerConfig.configApiServerPath+"AdvertisementPropertyDetail/GetAll", engine1, 'POST').success(function (response1) {
            advertisementProperty.propertyDetailsListItems = response1.ListItems;
            //---------- Load Values ---------------------------------------
            var filterValue2 = {
                PropertyName: "LinkPropertyId",
                IntValue1: parseInt(propertyId),
                SearchType: 0
            }
            var engine2 = { Filters: [] };
            engine2.Filters.push(filterValue2);
            ajax.call(cmsServerConfig.configApiServerPath+"AdvertisementPropertyDetailValue/GetAll", engine2, 'POST').success(function (response) {
                $.each(advertisementProperty.propertyDetailsListItems, function (index, item) {
                    item.value = null;
                    // Add groups to its list
                    var result = $.grep(advertisementProperty.propertyDetailGroupListItems, function (e) { return e.Id == item.virtual_PropertyDetailGroup.Id; });
                    if (result.length <= 0)
                        advertisementProperty.propertyDetailGroupListItems.push(item.virtual_PropertyDetailGroup);

                    // Add DefaultValue to the object
                    if (item.JsonDefaultValue == null) item.JsonDefaultValue = "{\"nameValue\":[],\"forceUse\":false,\"multipleChoice\":false}"; // جلوگیری از بروز خطا اگر مقادیر پیش فرض تهی باشد
                    item.DefaultValue = JSON.parse(item.JsonDefaultValue);
                });
                advertisementProperty.propertyDetailValuesListItems = response.ListItems;
                for (var i = 0; i < advertisementProperty.propertyDetailsListItems.length; i++) {
                    for (var j = 0; j < advertisementProperty.propertyDetailValuesListItems.length; j++) {
                        if (advertisementProperty.propertyDetailsListItems[i].Id == advertisementProperty.propertyDetailValuesListItems[j].LinkPropertyDetailId) {
                            var jsonDefaultValue = null;
                            try {
                                jsonDefaultValue = JSON.parse(advertisementProperty.propertyDetailsListItems[i].JsonDefaultValue);
                            } catch (e) {
                                console.log(e);
                            }

                            if (advertisementProperty.propertyDetailValuesListItems[j].Value != null) {
                                if (jsonDefaultValue != undefined && jsonDefaultValue != null && jsonDefaultValue.nameValue != undefined && jsonDefaultValue.nameValue != null && 0 < jsonDefaultValue.nameValue.length) {
                                    if (jsonDefaultValue.multipleChoice) {   // Detail is CheckBox
                                        var multipleValues = advertisementProperty.propertyDetailValuesListItems[j].Value.split(',');
                                        setSelection(advertisementProperty.propertyDetailsListItems[i].Id, multipleValues);

                                    }
                                    else if (jsonDefaultValue.forceUse && jsonDefaultValue.nameValue.length > 0) {   // Detail is RadioButton/DropDown
                                        /*Do not delete this line: Load the value if the elements is RadioButton
                                        var radioValues = advertisementProperty.propertyDetailValuesListItems[j].Value.split(',');
                                        setSelection(advertisementProperty.propertyDetailsListItems[i].Id, radioValues); */
                                        advertisementProperty.propertyDetailsListItems[i].value = advertisementProperty.propertyDetailValuesListItems[j].Value;
                                    } else {     // Detail is InputDataList
                                        advertisementProperty.propertyDetailsListItems[i].value = advertisementProperty.propertyDetailValuesListItems[j].Value;
                                    }
                                } else {
                                    switch (advertisementProperty.propertyDetailsListItems[i].InputDataType) {
                                        case 0:                              // Detail is String
                                            advertisementProperty.propertyDetailsListItems[i].value = advertisementProperty.propertyDetailValuesListItems[j].Value;
                                            break;
                                        case 1:                              // Detail is Number
                                            advertisementProperty.propertyDetailsListItems[i].value = parseInt(advertisementProperty.propertyDetailValuesListItems[j].Value);
                                            break;
                                        case 2:                              // Detail is Boolean
                                            advertisementProperty.propertyDetailsListItems[i].value = (advertisementProperty.propertyDetailValuesListItems[j].Value === "true");
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
        advertisementProperty[checkboxName] = values;
    }

    // toggle selection for a given fruit by name
    advertisementProperty.toggleSelection = function (detailId, fruitName) {
        var checkboxName = "selection" + detailId.toString();
        if (advertisementProperty[checkboxName] == undefined)
            advertisementProperty[checkboxName] = [];
        var idx = advertisementProperty[checkboxName].indexOf(fruitName);

        // is currently selected
        if (idx > -1) {
            advertisementProperty[checkboxName].splice(idx, 1);
        }

            // is newly selected
        else {
            advertisementProperty[checkboxName].push(fruitName);
        }
    }

    // toggle selection for a given fruit by name
    advertisementProperty.toggleRadioSelection = function (detailId, fruitName) {
        var radioName = "selection" + detailId.toString();
        var idx = advertisementProperty[radioName].indexOf(fruitName);

        // is currently selected
        if (idx > -1) {

        }
            // is newly selected
        else {
            advertisementProperty[radioName] = [];
            advertisementProperty[radioName].push(fruitName);
        }
    }
    //---------------- End of LoadValues functino ------------------------------

    advertisementProperty.requiredPropertyIsEmpty = function (selectedItem) {
        $.each(advertisementProperty.propertyDetailsListItems, function (index, item) {
            if (item.Required)
                if (item.value == null || item.value == "")
                    return true;
        });
    }

    advertisementProperty.onContractTypeChange = function (contractTypeId) {
        var contractType = {
        };
        for (var i = 0; i < advertisementProperty.contractTypeListItems.length; i++) {
            if (parseInt(contractTypeId) == advertisementProperty.contractTypeListItems[i].Id) {
                advertisementProperty.selectedItem.HasSalePrice = advertisementProperty.contractTypeListItems[i].HasSalePrice;
                advertisementProperty.selectedItem.UnitSalePrice = advertisementProperty.contractTypeListItems[i].UnitSalePrice;
                advertisementProperty.selectedItem.HasPresalePrice = advertisementProperty.contractTypeListItems[i].HasPresalePrice;
                advertisementProperty.selectedItem.UnitPresalePrice = advertisementProperty.contractTypeListItems[i].UnitPresalePrice;
                advertisementProperty.selectedItem.HasRentPrice = advertisementProperty.contractTypeListItems[i].HasRentPrice;
                advertisementProperty.selectedItem.UnitRentPrice = advertisementProperty.contractTypeListItems[i].UnitRentPrice;
                advertisementProperty.selectedItem.HasDepositPrice = advertisementProperty.contractTypeListItems[i].HasDepositPrice;
                advertisementProperty.selectedItem.UnitDepositPrice = advertisementProperty.contractTypeListItems[i].UnitDepositPrice;
            }
        }
    }
   

    advertisementProperty.contractsList = [];
    advertisementProperty.openAddContractModal = function (propertyId, propertyTitle) {
        ajax.call(cmsServerConfig.configApiServerPath+"advertisementcontracttype/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            advertisementProperty.busyIndicator.isActive = false;
            advertisementProperty.contractTypeListItems = response.ListItems;
            advertisementProperty.selectedItem.LinkPropertyTypeId = null;
        }).error(function (data, errCode, c, d) {
            advertisementProperty.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
        ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementContract/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                advertisementProperty.selectedItem = response.Item;
                advertisementProperty.selectedItem.LinkPropertyId = parseInt(propertyId);  // Set LinkPropertyId for new Contract
                advertisementProperty.selectedItem.LinkPropertyTitle = propertyTitle;  // Set LinkPropertyId for new Contract
                var model = {
                };
                model.Filters = [];
                model.Filters.push({ PropertyName: "LinkPropertyId", IntValue1: parseInt(propertyId), SearchType: 0 });
                ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementContract/getall', model, 'POST').success(function (response) {
                    rashaErManage.checkAction(response);
                    advertisementProperty.contractsList = response.ListItems;
                    advertisementProperty.contractsListresultAccess = response.resultAccess;
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleAdvertisement/AdvertisementProperty/addContract.html',
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

    advertisementProperty.addContract = function () {
        var duplicateContract = false;
        var erMessage = "";
        if (advertisementProperty.selectedItem.LinkContractTypeId == null || advertisementProperty.selectedItem.LinkContractTypeId < 0)
            return;
        $.each(advertisementProperty.contractsList, function (index, item) {
            if (item.LinkContractTypeId == parseInt(advertisementProperty.selectedItem.LinkContractTypeId)) {
                erMessage = "آگهی" + ' ' + item.virtual_ContractType.Title + ' ' + "قبلاً برای این ملک ثبت شده است!";
                duplicateContract = true;
                return;
            }
        });
        if (duplicateContract) {
            rashaErManage.showMessage(erMessage);
            return;
        }
        advertisementProperty.addRequested = true;
        advertisementProperty.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementContract/add', advertisementProperty.selectedItem, 'POST').success(function (response) {
            advertisementProperty.addRequested = false;
            advertisementProperty.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                advertisementProperty.contractsList.push(response.Item);
                advertisementProperty.selectedItem.SalePrice = null;
                advertisementProperty.selectedItem.PresalePrice = null;
                advertisementProperty.selectedItem.DepositPrice = null;
                advertisementProperty.selectedItem.RentPrice = null;
                advertisementProperty.selectedItem.Description = "";
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            advertisementProperty.addRequested = false;
        });

    }

    advertisementProperty.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }

    // ----------- FilePicker Codes --------------------------
    advertisementProperty.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !advertisementProperty.alreadyExist(id, advertisementProperty.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            advertisementProperty.attachedFiles.push(file);
            advertisementProperty.clearfilePickers();

        }
    }

    advertisementProperty.alreadyExist = function (fieldName, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldName == array[i]) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                advertisementProperty.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    advertisementProperty.editContract = function (index) {
        advertisementProperty.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementContract/edit', advertisementProperty.contractsList[index], 'PUT').success(function (res) {
            advertisementProperty.addRequested = false;
            rashaErManage.checkAction(res);
            if (res.IsSuccess) {
                advertisementProperty.contractsList.splice(index, 1);
                advertisementProperty.contractsList.push(res.Item)
                rashaErManage.showMessage("ویرایش با موفقیت انجام شد!");
            }
        }).error(function (data2, errCode2, c2, d2) {
            rashaErManage.checkAction(data2);
        });
    }

    advertisementProperty.deleteContract = function (index) {
        advertisementProperty.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementContract/delete', advertisementProperty.contractsList[index], 'POST').success(function (res) {
            advertisementProperty.addRequested = false;
            rashaErManage.checkAction(res);
            if (res.IsSuccess) {
                advertisementProperty.contractsList.splice(index, 1);
                rashaErManage.showMessage($filter('translatentk')('Removed_Successfully'));
            }
        }).error(function (data2, errCode2, c2, d2) {
            rashaErManage.checkAction(data2);
        });
    }

    advertisementProperty.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            advertisementProperty.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    advertisementProperty.clearfilePickers = function () {
        advertisementProperty.filePickerFiles.filename = null;
        advertisementProperty.filePickerFiles.fileId = null;
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
    advertisementProperty.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleAdvertisement/AdvertisementProperty/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        advertisementProperty.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            advertisementProperty.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    advertisementProperty.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    advertisementProperty.whatcolor = function (progress) {
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

    advertisementProperty.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    advertisementProperty.replaceFile = function (name) {
        advertisementProperty.itemClicked(null, advertisementProperty.fileIdToDelete, "file");
        advertisementProperty.fileTypes = 1;
        advertisementProperty.fileIdToDelete = advertisementProperty.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", advertisementProperty.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    advertisementProperty.remove(advertisementProperty.FileList, advertisementProperty.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                advertisementProperty.FileItem = response3.Item;
                                advertisementProperty.FileItem.FileName = name;
                                advertisementProperty.FileItem.Extension = name.split('.').pop();
                                advertisementProperty.FileItem.FileSrc = name;
                                advertisementProperty.FileItem.LinkCategoryId = advertisementProperty.thisCategory;
                                advertisementProperty.saveNewFile();
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
    advertisementProperty.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", advertisementProperty.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                advertisementProperty.FileItem = response.Item;
                advertisementProperty.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            advertisementProperty.showErrorIcon();
            return -1;
        });
    }

    advertisementProperty.showSuccessIcon = function () {
    }

    advertisementProperty.showErrorIcon = function () {

    }
    //file is exist
    advertisementProperty.fileIsExist = function (fileName) {
        for (var i = 0; i < advertisementProperty.FileList.length; i++) {
            if (advertisementProperty.FileList[i].FileName == fileName) {
                advertisementProperty.fileIdToDelete = advertisementProperty.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    advertisementProperty.getFileItem = function (id) {
        for (var i = 0; i < advertisementProperty.FileList.length; i++) {
            if (advertisementProperty.FileList[i].Id == id) {
                return advertisementProperty.FileList[i];
            }
        }
    }

    //select file or folder
    advertisementProperty.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            advertisementProperty.fileTypes = 1;
            advertisementProperty.selectedFileId = advertisementProperty.getFileItem(index).Id;
            advertisementProperty.selectedFileName = advertisementProperty.getFileItem(index).FileName;
        }
        else {
            advertisementProperty.fileTypes = 2;
            advertisementProperty.selectedCategoryId = advertisementProperty.getCategoryName(index).Id;
            advertisementProperty.selectedCategoryTitle = advertisementProperty.getCategoryName(index).Title;
        }

        advertisementProperty.selectedIndex = index;

    }

    advertisementProperty.showContractDetails = function (contract) {
        advertisementProperty.selectedContract = contract;
    }
    //upload file
    advertisementProperty.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (advertisementProperty.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ advertisementProperty.replaceFile(uploadFile.name);
                    advertisementProperty.itemClicked(null, advertisementProperty.fileIdToDelete, "file");
                    advertisementProperty.fileTypes = 1;
                    advertisementProperty.fileIdToDelete = advertisementProperty.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                advertisementProperty.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        advertisementProperty.FileItem = response2.Item;
                        advertisementProperty.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        advertisementProperty.filePickerMainImage.filename =
                          advertisementProperty.FileItem.FileName;
                        advertisementProperty.filePickerMainImage.fileId =
                          response2.Item.Id;
                        advertisementProperty.selectedItem.LinkMainImageId =
                          advertisementProperty.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      advertisementProperty.showErrorIcon();
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
                    advertisementProperty.FileItem = response.Item;
                    advertisementProperty.FileItem.FileName = uploadFile.name;
                    advertisementProperty.FileItem.uploadName = uploadFile.uploadName;
                    advertisementProperty.FileItem.Extension = uploadFile.name.split('.').pop();
                    advertisementProperty.FileItem.FileSrc = uploadFile.name;
                    advertisementProperty.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- advertisementProperty.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", advertisementProperty.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            advertisementProperty.FileItem = response.Item;
                            advertisementProperty.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            advertisementProperty.filePickerMainImage.filename = advertisementProperty.FileItem.FileName;
                            advertisementProperty.filePickerMainImage.fileId = response.Item.Id;
                            advertisementProperty.selectedItem.LinkMainImageId = response.Item.Id;
                            advertisementProperty.selectedItem.LinkMainImageId = advertisementProperty.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        advertisementProperty.showErrorIcon();
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
    advertisementProperty.exportFile = function () {
        advertisementProperty.addRequested = true;
        advertisementProperty.gridOptions.advancedSearchData.engine.ExportFile = advertisementProperty.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementProperty/exportfile', advertisementProperty.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            advertisementProperty.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                advertisementProperty.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //advertisementProperty.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    advertisementProperty.toggleExportForm = function () {
        advertisementProperty.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        advertisementProperty.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        advertisementProperty.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        advertisementProperty.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        advertisementProperty.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleAdvertisement/AdvertisementProperty/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    advertisementProperty.rowCountChanged = function () {
        if (!angular.isDefined(advertisementProperty.ExportFileClass.RowCount) || advertisementProperty.ExportFileClass.RowCount > 5000)
            advertisementProperty.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    advertisementProperty.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"AdvertisementProperty/count", advertisementProperty.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            advertisementProperty.addRequested = false;
            rashaErManage.checkAction(response);
            advertisementProperty.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            advertisementProperty.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    advertisementProperty.thousandSeparator = function (field, digit) {
        var value = digit.replace(new RegExp(",", "g"), '');
        var x = (parseInt(value)).toLocaleString();
        advertisementProperty.selectedItem[field] = x;
    }

    advertisementProperty.onRecordStatusChange = function (record) {
        //advertisementProperty.busyIndicator.isActive = true;
        //var filterstatus = { Filters: [{ PropertyName: "RecordStatus", SearchType: 0, IntValue1: record }] };
        //ajax.call(cmsServerConfig.configApiServerPath+"advertisementproperty/getAllwithalias", filterstatus, 'POST').success(function (response) {
        //    rashaErManage.checkAction(response);
        //    advertisementProperty.ListItems = response.ListItems;
        //    advertisementProperty.gridOptions.fillData(advertisementProperty.ListItems, response.resultAccess);
        //    advertisementProperty.gridOptions.currentPageNumber = response.CurrentPageNumber;
        //    advertisementProperty.gridOptions.totalRowCount = response.TotalRowCount;
        //    advertisementProperty.gridOptions.rowPerPage = response.RowPerPage;
        //    advertisementProperty.busyIndicator.isActive = false;
        //}).error(function (data, errCode, c, d) {
        //    advertisementProperty.busyIndicator.isActive = false;
        //    advertisementProperty.gridOptions.fillData();
        //    rashaErManage.checkAction(data, errCode);
        //});
    }
}]);

