app.controller("estatePropertyController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var estateProperty = this;
    estateProperty.RouteUploadFileContent = cmsServerConfig.configRouteUploadFileContent;
    estateProperty.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    estateProperty.attachedFiles = [];
    estateProperty.attachedFile = "";
    estateProperty.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: 0,
        multiSelect: false,
    }

    estateProperty.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        filename: null,
        fileId: 0,
        multiSelect: false,
    }
    estateProperty.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    estateProperty.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:estateProperty.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:estateProperty,
        useCurrentLocationZoom:12,
    }
    estateProperty.filePickerMainImage.clear = function () {
        estateProperty.filePickerMainImage.fileId = 0;
        estateProperty.filePickerMainImage.filename = "";
    }

    estateProperty.filePickerFiles.clear = function () {
        estateProperty.filePickerFiles.fileId = 0;
        estateProperty.filePickerFiles.filename = "";
    }

    if (itemRecordStatus != undefined) estateProperty.itemRecordStatus = itemRecordStatus;

    estateProperty.propertyTypeListItems = [];
    estateProperty.propertyDetailGroupListItems = [];
    estateProperty.propertyDetailsListItems = [];
    estateProperty.cmsUsersListItems = [];
    estateProperty.contractTypeListItems = [];

    estateProperty.init = function () {
        estateProperty.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"estateproperty/getAllwithalias", estateProperty.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            estateProperty.ListItems = response.ListItems;
            estateProperty.gridOptions.fillData(estateProperty.ListItems, response.resultAccess);
            estateProperty.gridOptions.currentPageNumber = response.CurrentPageNumber;
            estateProperty.gridOptions.totalRowCount = response.TotalRowCount;
            estateProperty.gridOptions.rowPerPage = response.RowPerPage;
            estateProperty.allowedSearch = response.AllowedSearchField;
            estateProperty.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            estateProperty.busyIndicator.isActive = false;
            estateProperty.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"estatepropertytype/getAll", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            estateProperty.propertyTypeListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            estateProperty.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"CoreLocation/GetAllProvinces", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            estateProperty.provinceCmsLocatinoListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            estateProperty.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    estateProperty.busyIndicator.isActive = true;
    estateProperty.addRequested = false;
    $(".back1").hide();

    estateProperty.attachedFiles = [];
    estateProperty.attachedFile = "";
    estateProperty.filePickerMainImage.filename = "";
    estateProperty.filePickerMainImage.fileId = null;
    estateProperty.filePickerFiles.filename = "";
    estateProperty.filePickerFiles.fileId = null;

    // Open Add Modal
    estateProperty.openAddModal = function () {
        if (buttonIsPressed) return;
        estateProperty.onPropertyTypeChange();
        estateProperty.modalTitle = 'اضافه';
        //Clear file pickers
        estateProperty.attachedFiles = [];
        estateProperty.attachedFile = "";
        estateProperty.filePickerMainImage.filename = "";
        estateProperty.filePickerMainImage.fileId = null;
        estateProperty.filePickerFiles.filename = "";
        estateProperty.filePickerFiles.fileId = null;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'estateproperty/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            estateProperty.busyIndicator.isActive = false;
            estateProperty.selectedItem = response.Item;
            estateProperty.selectedItem.LinkPropertyTypeId = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleEstate/EstateProperty/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            estateProperty.busyIndicator.isActive = false;
        });
    }

    // Add New Content
    estateProperty.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (estateProperty.requiredPropertyIsEmpty(estateProperty.selectedItem)) {
            rashaErManage("مقادیر الزامی را وارد کنید!");
            return;
        }
        estateProperty.busyIndicator.isActive = true;
        estateProperty.addRequested = true;
        var valueItem = {};
        estateProperty.valueItems = [];
        ajax.call(cmsServerConfig.configApiServerPath+'estateproperty/add', estateProperty.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                estateProperty.closeModal();
                ajax.call(cmsServerConfig.configApiServerPath+"estatepropertydetailvalue/GetViewModel", "0", 'GET').success(function (response1) {
                    rashaErManage.checkAction(response1);
                    for (var i = 0; i < estateProperty.propertyDetailsListItems.length; i++) {
                        valueItem = $.extend(true, {}, response1.Item);
                        valueItem.LinkPropertyDetailId = estateProperty.propertyDetailsListItems[i].Id;
                        valueItem.LinkPropertyId = response.Item.Id;
                        if (estateProperty.propertyDetailsListItems[i].DefaultValue != null) {
                            if (estateProperty.propertyDetailsListItems[i].DefaultValue.multipleChoice) {
                                var checkboxName = "nameValue" + estateProperty.propertyDetailsListItems[i].Id;
                                estateProperty.selectionValueNames = [];
                                jQuery("input[name='" + checkboxName + "']").each(function () {
                                    if (this.checked) {
                                        estateProperty.selectionValueNames.push(this.value);
                                    }
                                });
                                valueItem.Value = estateProperty.selectionValueNames;
                            }
                            else {

                                if (estateProperty.propertyDetailsListItems[i].DefaultValue.forceUse && estateProperty.propertyDetailsListItems[i].DefaultValue.nameValue.length > 0) {  //ELement is a RadioButton/DropDown
                                    //Do not delete the following comments: Get the value if the element is a RadioButton
                                    /*var radioButton = "nameValue" + estateProperty.propertyDetailsListItems[i].Id;
                                    estateProperty.selectionValueNames = [];
                                    if ($("input[name='" + radioButton + "']").is(':checked')) {
                                        valueItem.Value = $("input[name='" + radioButton + "']:checked").val(); 
                                    }*/
                                    valueItem.Value = $('#dropDown' + estateProperty.propertyDetailsListItems[i].Id).find(":selected").val(); //Get the value if the element is a DropDown

                                } else
                                    valueItem.Value = estateProperty.propertyDetailsListItems[i].value;
                            }
                        } else
                            valueItem.Value = estateProperty.propertyDetailsListItems[i].value;
                        estateProperty.valueItems.push(valueItem);
                    }
                    ajax.call(cmsServerConfig.configApiServerPath+'EstatePropertyDetailValue/AddBatch', estateProperty.valueItems, 'POST').success(function (response2) {
                        rashaErManage.checkAction(response2);
                        if (response2.IsSuccess) {
                            estateProperty.ListItems.unshift(response.Item);
                            estateProperty.gridOptions.fillData(estateProperty.ListItems);
                            estateProperty.gridOptions.myfilterText(estateProperty.ListItems, "LinkCmsUserId", estateProperty.cmsUsersListItems, "Username", "LinkCmsUserUsername");
                            estateProperty.gridOptions.myfilterText(estateProperty.ListItems, "LinkPropertyTypeId", estateProperty.propertyTypeListItems, "Title", "LinkPropertyTypeTitle");
                            estateProperty.addRequested = false;
                            estateProperty.busyIndicator.isActive = false;
                            //ملک و مقادیر ثبت شده است از کاربر می خواهیم که نوع فروش را مشخص کند
                            estateProperty.openAddContractModal(response.Item.Id, response.Item.Title);
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
            estateProperty.addRequested = false;
        });
    }

    // Open Edit Content Modal 
    estateProperty.openEditModal = function () {
        if (buttonIsPressed) return;
        estateProperty.onPropertyTypeChange();
        //Clear file pickers
        estateProperty.attachedFiles = [];
        estateProperty.attachedFile = "";
        estateProperty.filePickerMainImage.filename = "";
        estateProperty.filePickerMainImage.fileId = null;
        estateProperty.filePickerFiles.filename = "";
        estateProperty.filePickerFiles.fileId = null;
        estateProperty.modalTitle = 'ویرایش';
        if (!estateProperty.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'estateproperty/GetOne', parseInt(estateProperty.gridOptions.selectedRow.item.Id), 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            estateProperty.selectedItem = response.Item;
            estateProperty.oldLinkPropertyTypeId = estateProperty.selectedItem.LinkPropertyTypeId;
            estateProperty.loadDetailValues(estateProperty.selectedItem.LinkPropertyTypeId, estateProperty.selectedItem.Id);
            //---- Set Province City Location
            //estateProperty.onProvinceChange(estateProperty.selectedItem.LinkProvinceId);
            //estateProperty.onCitiesChange(estateProperty.selectedItem.LinkLocationId);
            //---- Set MainImage and AttachedFiles on edit modal open
            estateProperty.filePickerMainImage.filename = null;
            estateProperty.filePickerMainImage.fileId = null;
            if (response.Item.LinkMainImageId != null && response.Item.LinkMainImageId > 0) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(response.Item.LinkMainImageId), 'GET').success(function (response2) {
                    if (response2.IsSuccess && response2.Item.Id > 9) {
                        estateProperty.filePickerMainImage.filename = response2.Item.FileName;
                        estateProperty.filePickerMainImage.fileId = response2.Item.Id;
                    }
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            if (response.Item.LinkExtraImageIds != null && response.Item.LinkExtraImageIds != "")
                estateProperty.parseFileIds(response.Item.LinkExtraImageIds);
            //*****************************************************************
            $modal.open({
                templateUrl: 'cpanelv1/ModuleEstate/EstateProperty/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    estateProperty.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        // Edit Property: Title, Description, LinkPropertyTypeId
        estateProperty.busyIndicator.isActive = true;
        estateProperty.selectedItem.LinkExtraImageIds = stringfyLinkFileIds(estateProperty.attachedFiles);
        ajax.call(cmsServerConfig.configApiServerPath+'estateproperty/edit', estateProperty.selectedItem, 'PUT').success(function (response) {
            estateProperty.addRequested = true;
            rashaErManage.checkAction(response);
            estateProperty.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                estateProperty.addRequested = false;
                estateProperty.replaceItem(estateProperty.selectedItem.Id, response.Item);
                estateProperty.gridOptions.fillData(estateProperty.ListItems);
                estateProperty.gridOptions.myfilterText(estateProperty.ListItems, "LinkCmsUserId", estateProperty.cmsUsersListItems, "Username", "LinkCmsUserUsername");
                estateProperty.gridOptions.myfilterText(estateProperty.ListItems, "LinkPropertyTypeId", estateProperty.propertyTypeListItems, "Title", "LinkPropertyTypeTitle");
                estateProperty.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            estateProperty.addRequested = false;
            estateProperty.busyIndicator.isActive = false;
        });

        // ------------------------- Check if Property Type (LinkPropertyTypeId) has changed ---------------------------
        if (estateProperty.oldLinkPropertyTypeId != estateProperty.selectedItem.LinkPropertyTypeId) {
            var filterValue = {
                PropertyName: "LinkPropertyId",
                IntValue1: parseInt(estateProperty.selectedItem.Id),
                SearchType: 0
            }
            var engine = {};
            engine.Filters = [];
            engine.Filters.push(filterValue);
            ajax.call(cmsServerConfig.configApiServerPath+'EstatePropertyDetailValue/deleteList', engine, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                console.log(response.Item);
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                estateProperty.busyIndicator.isActive = false;

            });
            ajax.call(cmsServerConfig.configApiServerPath+'EstatePropertyDetailValue/AddBatch', estateProperty.selectedItem.LinkPropertyId, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                console.log(response.Item);
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                estateProperty.busyIndicator.isActive = false;

            });
        }
        else {
            // -------------------------************* Set Values to Edit ************------------------------------
            for (var i = 0; i < estateProperty.propertyDetailsListItems.length; i++) {
                estateProperty.propertyDetailsListItems[i].valueFound = false;
                for (var j = 0; j < estateProperty.propertyDetailValuesListItems.length; j++) {
                    if (estateProperty.propertyDetailsListItems[i].Id == estateProperty.propertyDetailValuesListItems[j].LinkPropertyDetailId) {
                        estateProperty.propertyDetailsListItems[i].valueFound = true;
                        if (estateProperty.propertyDetailsListItems[i].DefaultValue.multipleChoice == false) { // Detail is not CheckBox
                            if (estateProperty.propertyDetailsListItems[i].DefaultValue.forceUse) { // Detail is RadioButton/DropDown
                                /*Do not delete the following comments: Get the value if the element is a RadioButton
                                var radioName = "selection" + estateProperty.propertyDetailsListItems[i].Id;
                                var radioValue = estateProperty[radioName];
                                estateProperty.propertyDetailsListItems[i].value = radioValue; */
                                estateProperty.propertyDetailValuesListItems[j].Value = $('#dropDown' + estateProperty.propertyDetailsListItems[i].Id).find(":selected").val(); //Get the value if the element is a DropDown
                            }
                            else
                                // Detail is not a CheckBox, nor a RadioButton
                                estateProperty.propertyDetailValuesListItems[j].Value = String(estateProperty.propertyDetailsListItems[i].value);
                        } else { // Detail is CheckBox
                            var checkboxName = "selection" + estateProperty.propertyDetailsListItems[i].Id;
                            estateProperty.propertyDetailValuesListItems[j].Value = estateProperty[checkboxName];
                        }
                    }
                }
                if (!estateProperty.propertyDetailsListItems[i].valueFound) {
                    console.log(estateProperty.propertyDetailsListItems[i]);
                    var proeprtyDetailValue = { LinkPropertyId: 0, LinkPropertyDetailId: 0, Value: 0 };
                    if (estateProperty.propertyDetailsListItems[i].DefaultValue.multipleChoice == false) { // Detail is not CheckBox
                        if (estateProperty.propertyDetailsListItems[i].DefaultValue.forceUse) { // Detail is RadioButton/DropDown
                            estateProperty.propertyDetailValuesListItems.push({ Id: 0, LinkPropertyId: estateProperty.selectedItem.Id, LinkPropertyDetailId: estateProperty.propertyDetailsListItems[i].Id, Value: $('#dropDown' + estateProperty.propertyDetailsListItems[i].Id).find(":selected").val() }); //Get the value if the element is a DropDown
                        }
                        else
                            // Detail is not a CheckBox, nor a RadioButton
                            estateProperty.propertyDetailValuesListItems.push({ Id: 0, LinkPropertyId: estateProperty.selectedItem.Id, LinkPropertyDetailId: estateProperty.propertyDetailsListItems[i].Id, Value: String(estateProperty.propertyDetailsListItems[i].value) });
                    } else { // Detail is CheckBox
                        var checkboxName = "selection" + estateProperty.propertyDetailsListItems[i].Id;
                        estateProperty.propertyDetailValuesListItems.push({ Id: 0, LinkPropertyId: estateProperty.selectedItem.Id, LinkPropertyDetailId: estateProperty.propertyDetailsListItems[i].Id, Value: estateProperty[checkboxName] });
                    }
                }
            }
            // ---------------------------------- End of Set Values to Edit --------------------------------------
            estateProperty.addRequested = true;
            ajax.call(cmsServerConfig.configApiServerPath+'EstatePropertyDetailValue/EditBatch', estateProperty.propertyDetailValuesListItems, 'PUT').success(function (response) {
                rashaErManage.checkAction(response);
                estateProperty.busyIndicator.isActive = false;
                if (response.IsSuccess) {
                    estateProperty.addRequested = false;
                    estateProperty.closeModal();
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                estateProperty.addRequested = false;
                estateProperty.busyIndicator.isActive = false;
            });
        }
    }

    estateProperty.closeModal = function () {
        $modalStack.dismissAll();
    };

    estateProperty.replaceItem = function (oldId, newItem) {
        angular.forEach(estateProperty.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = estateProperty.ListItems.indexOf(item);
                estateProperty.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            estateProperty.ListItems.unshift(newItem);
    }

    estateProperty.deleteRow = function () {
        if (buttonIsPressed) return;

        if (!estateProperty.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                estateProperty.busyIndicator.isActive = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'estateproperty/GetOne', estateProperty.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    estateProperty.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'estateproperty/delete', estateProperty.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        estateProperty.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            estateProperty.replaceItem(estateProperty.selectedItemForDelete.Id);
                            estateProperty.gridOptions.fillData(estateProperty.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        estateProperty.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    estateProperty.busyIndicator.isActive = false;
                });
            }
        });
    }

    estateProperty.searchData = function () {
        estateProperty.gridOptions.searchData();
    }
    estateProperty.LinkLocationIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkLocationId',
        url: 'CmsLocation',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'LinkLocationId',
        rowPerPage: 200,
        action: 'GetAllCities',
        scope: estateProperty,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'virtual_Parent.Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
                { name: 'Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
            ]
        }
    }
    estateProperty.gridOptions = {
        columns: [
            { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'نام', sortable: true, type: 'string', visible: true },
            { name: 'Description', displayName: 'توضیح', sortable: true, type: 'string', visible: true, excerpt: true, excerptLength: 30 },
            { name: 'LinkCmsUserId', displayName: 'کد سیستمی کاربر', sortable: true, type: 'string', visible: true, displayForce: true },
            { name: 'virtual_PropertyType.Title', displayName: 'نوع ملک', sortable: true, type: 'string', visible: true, displayForce: true },
            { name: 'ViewCount', displayName: 'تعداد بازدید', sortable: true, visible: true,type:'integer' },
            { name: 'ActionButtons', displayName: 'خصوصیات ملک', sortable: true, type: 'string', visible: true, displayForce: true, template: '<button type="button" class="btn btn-primary" ng-click="estateProperty.openAddContractModal(x.Id,x.Title)"  class="btn btn-primary"><i class="fa fa-plus-circle" aria-hidden="true"></i>&nbsp;سپردن نوع معامله</button>' }
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

    estateProperty.gridOptions.reGetAll = function () {
        estateProperty.init();
    }

    estateProperty.gridOptions.onRowSelected = function () { }

    estateProperty.columnCheckbox = false;

    estateProperty.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (estateProperty.gridOptions.columnCheckbox) {
            for (var i = 0; i < estateProperty.gridOptions.columns.length; i++) {
                //estateProperty.gridOptions.columns[i].visible = $("#" + estateProperty.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + estateProperty.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                estateProperty.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = estateProperty.gridOptions.columns;
            for (var i = 0; i < estateProperty.gridOptions.columns.length; i++) {
                estateProperty.gridOptions.columns[i].visible = true;
                var element = $("#" + estateProperty.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + estateProperty.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < estateProperty.gridOptions.columns.length; i++) {
            console.log(estateProperty.gridOptions.columns[i].name.concat(".visible: "), estateProperty.gridOptions.columns[i].visible);
        }
        estateProperty.gridOptions.columnCheckbox = !estateProperty.gridOptions.columnCheckbox;
    }

    estateProperty.onPropertyTypeChange = function (propertyTypeId) {
        estateProperty.propertyDetailsListItems = []; //Clear out the array from previous values
        estateProperty.propertyDetailGroupListItems = []; //Clear out the array from previous values
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
        ajax.call(cmsServerConfig.configApiServerPath+"EstatePropertyDetail/GetAll", engine, 'POST').success(function (response) {
            estateProperty.propertyDetailsListItems = response.ListItems;

            $.each(estateProperty.propertyDetailsListItems, function (index, item) {
                item.value = null;
                // Add groups to its list
                var result = $.grep(estateProperty.propertyDetailGroupListItems, function (e) { return e.Id == item.virtual_PropertyDetailGroup.Id; });
                if (result.length <= 0)
                    estateProperty.propertyDetailGroupListItems.push(item.virtual_PropertyDetailGroup);

                // Add DefaultValue to the object
                item.DefaultValue = JSON.parse(item.JsonDefaultValue);
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    estateProperty.selectedPropertyDetailsListItems = [];
    estateProperty.onPropertyDetailGroupChange = function (propertyDetailGroupId) {
        estateProperty.selectedPropertyDetailsListItems = [];
        if (0 < estateProperty.propertyDetailsListItems.length) {
            $.each(estateProperty.propertyDetailsListItems, function (index, propertyDetail) {
                if (propertyDetail.LinkPropertyDetailGroupId == propertyDetailGroupId) {
                    estateProperty.selectedPropertyDetailsListItems.push(propertyDetail);
                }
            });
        }
    }

    // Filter Texts for CmsUser
    estateProperty.gridOptions.myfilterText = function (gridListItems, foreignKeyName, childListItems, childDesiredPropertyName, childItemColumnName) {
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
    estateProperty.loadDetailValues = function (propertyTypeId, propertyId) {
        var filterValue1 = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(propertyTypeId),
            SearchType: 0
        }
        var engine1 = {
        };
        engine1.Filters = [];
        engine1.Filters.push(filterValue1);
        ajax.call(cmsServerConfig.configApiServerPath+"EstatePropertyDetail/GetAll", engine1, 'POST').success(function (response1) {
            estateProperty.propertyDetailsListItems = response1.ListItems;
            //---------- Load Values ---------------------------------------
            var filterValue2 = {
                PropertyName: "LinkPropertyId",
                IntValue1: parseInt(propertyId),
                SearchType: 0
            }
            var engine2 = { Filters: [] };
            engine2.Filters.push(filterValue2);
            ajax.call(cmsServerConfig.configApiServerPath+"EstatePropertyDetailValue/GetAll", engine2, 'POST').success(function (response) {
                $.each(estateProperty.propertyDetailsListItems, function (index, item) {
                    item.value = null;
                    // Add groups to its list
                    var result = $.grep(estateProperty.propertyDetailGroupListItems, function (e) { return e.Id == item.virtual_PropertyDetailGroup.Id; });
                    if (result.length <= 0)
                        estateProperty.propertyDetailGroupListItems.push(item.virtual_PropertyDetailGroup);

                    // Add DefaultValue to the object
                    if (item.JsonDefaultValue == null) item.JsonDefaultValue = "{\"nameValue\":[],\"forceUse\":false,\"multipleChoice\":false}"; // جلوگیری از بروز خطا اگر مقادیر پیش فرض تهی باشد
                    item.DefaultValue = JSON.parse(item.JsonDefaultValue);
                });
                estateProperty.propertyDetailValuesListItems = response.ListItems;
                for (var i = 0; i < estateProperty.propertyDetailsListItems.length; i++) {
                    for (var j = 0; j < estateProperty.propertyDetailValuesListItems.length; j++) {
                        if (estateProperty.propertyDetailsListItems[i].Id == estateProperty.propertyDetailValuesListItems[j].LinkPropertyDetailId) {
                            var jsonDefaultValue = null;
                            try {
                                jsonDefaultValue = JSON.parse(estateProperty.propertyDetailsListItems[i].JsonDefaultValue);
                            } catch (e) {
                                console.log(e);
                            }

                            if (estateProperty.propertyDetailValuesListItems[j].Value != null) {
                                if (jsonDefaultValue != undefined && jsonDefaultValue != null && jsonDefaultValue.nameValue != undefined && jsonDefaultValue.nameValue != null && 0 < jsonDefaultValue.nameValue.length) {
                                    if (jsonDefaultValue.multipleChoice) {   // Detail is CheckBox
                                        var multipleValues = estateProperty.propertyDetailValuesListItems[j].Value.split(',');
                                        setSelection(estateProperty.propertyDetailsListItems[i].Id, multipleValues);

                                    }
                                    else if (jsonDefaultValue.forceUse && jsonDefaultValue.nameValue.length > 0) {   // Detail is RadioButton/DropDown
                                        /*Do not delete this line: Load the value if the elements is RadioButton
                                        var radioValues = estateProperty.propertyDetailValuesListItems[j].Value.split(',');
                                        setSelection(estateProperty.propertyDetailsListItems[i].Id, radioValues); */
                                        estateProperty.propertyDetailsListItems[i].value = estateProperty.propertyDetailValuesListItems[j].Value;
                                    } else {     // Detail is InputDataList
                                        estateProperty.propertyDetailsListItems[i].value = estateProperty.propertyDetailValuesListItems[j].Value;
                                    }
                                } else {
                                    switch (estateProperty.propertyDetailsListItems[i].InputDataType) {
                                        case 0:                              // Detail is String
                                            estateProperty.propertyDetailsListItems[i].value = estateProperty.propertyDetailValuesListItems[j].Value;
                                            break;
                                        case 1:                              // Detail is Number
                                            estateProperty.propertyDetailsListItems[i].value = parseInt(estateProperty.propertyDetailValuesListItems[j].Value);
                                            break;
                                        case 2:                              // Detail is Boolean
                                            estateProperty.propertyDetailsListItems[i].value = (estateProperty.propertyDetailValuesListItems[j].Value === "true");
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
        var checkboxName = "selection" + detailId;
        estateProperty[checkboxName] = values;
    }

    // toggle selection for a given fruit by name
    estateProperty.toggleSelection = function (detailId, fruitName) {
        var checkboxName = "selection" + detailId;
        if (estateProperty[checkboxName] == undefined)
            estateProperty[checkboxName] = [];
        var idx = estateProperty[checkboxName].indexOf(fruitName);

        // is currently selected
        if (idx > -1) {
            estateProperty[checkboxName].splice(idx, 1);
        }

            // is newly selected
        else {
            estateProperty[checkboxName].push(fruitName);
        }
    }

    // toggle selection for a given fruit by name
    estateProperty.toggleRadioSelection = function (detailId, fruitName) {
        var radioName = "selection" + detailId;
        var idx = estateProperty[radioName].indexOf(fruitName);

        // is currently selected
        if (idx > -1) {

        }
            // is newly selected
        else {
            estateProperty[radioName] = [];
            estateProperty[radioName].push(fruitName);
        }
    }
    //---------------- End of LoadValues functino ------------------------------

    estateProperty.requiredPropertyIsEmpty = function (selectedItem) {
        $.each(estateProperty.propertyDetailsListItems, function (index, item) {
            if (item.Required)
                if (item.value == null || item.value == "")
                    return true;
        });
    }

    estateProperty.onContractTypeChange = function (contractTypeId) {
        var contractType = {
        };
        for (var i = 0; i < estateProperty.contractTypeListItems.length; i++) {
            if (parseInt(contractTypeId) == estateProperty.contractTypeListItems[i].Id) {
                estateProperty.selectedItem.HasSalePrice = estateProperty.contractTypeListItems[i].HasSalePrice;
                estateProperty.selectedItem.UnitSalePrice = estateProperty.contractTypeListItems[i].UnitSalePrice;
                estateProperty.selectedItem.HasPresalePrice = estateProperty.contractTypeListItems[i].HasPresalePrice;
                estateProperty.selectedItem.UnitPresalePrice = estateProperty.contractTypeListItems[i].UnitPresalePrice;
                estateProperty.selectedItem.HasRentPrice = estateProperty.contractTypeListItems[i].HasRentPrice;
                estateProperty.selectedItem.UnitRentPrice = estateProperty.contractTypeListItems[i].UnitRentPrice;
                estateProperty.selectedItem.HasDepositPrice = estateProperty.contractTypeListItems[i].HasDepositPrice;
                estateProperty.selectedItem.UnitDepositPrice = estateProperty.contractTypeListItems[i].UnitDepositPrice;
            }
        }
    }
   

    estateProperty.contractsList = [];
    estateProperty.openAddContractModal = function (propertyId, propertyTitle) {
        ajax.call(cmsServerConfig.configApiServerPath+"estatecontracttype/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            estateProperty.busyIndicator.isActive = false;
            estateProperty.contractTypeListItems = response.ListItems;
            estateProperty.selectedItem.LinkPropertyTypeId = null;
        }).error(function (data, errCode, c, d) {
            estateProperty.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
        ajax.call(cmsServerConfig.configApiServerPath+'EstateContract/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                estateProperty.selectedItem = response.Item;
                estateProperty.selectedItem.LinkPropertyId = parseInt(propertyId);  // Set LinkPropertyId for new Contract
                estateProperty.selectedItem.LinkPropertyTitle = propertyTitle;  // Set LinkPropertyId for new Contract
                var model = {
                };
                model.Filters = [];
                model.Filters.push({ PropertyName: "LinkPropertyId", IntValue1: parseInt(propertyId), SearchType: 0 });
                ajax.call(cmsServerConfig.configApiServerPath+'EstateContract/getall', model, 'POST').success(function (response) {
                    rashaErManage.checkAction(response);
                    estateProperty.contractsList = response.ListItems;
                    estateProperty.contractsListresultAccess = response.resultAccess;
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleEstate/EstateProperty/addContract.html',
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

    estateProperty.addContract = function () {
        var duplicateContract = false;
        var erMessage = "";
        if (estateProperty.selectedItem.LinkEstateContractTypeId == null || estateProperty.selectedItem.LinkEstateContractTypeId < 0)
            return;
        $.each(estateProperty.contractsList, function (index, item) {
            if (item.LinkEstateContractTypeId == parseInt(estateProperty.selectedItem.LinkEstateContractTypeId)) {
                erMessage = "آگهی" + ' ' + item.virtual_ContractType.Title + ' ' + "قبلاً برای این ملک ثبت شده است!";
                duplicateContract = true;
                return;
            }
        });
        if (duplicateContract) {
            rashaErManage.showMessage(erMessage);
            return;
        }
        estateProperty.addRequested = true;
        estateProperty.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'EstateContract/add', estateProperty.selectedItem, 'POST').success(function (response) {
            estateProperty.addRequested = false;
            estateProperty.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                estateProperty.contractsList.push(response.Item);
                estateProperty.selectedItem.SalePrice = null;
                estateProperty.selectedItem.PresalePrice = null;
                estateProperty.selectedItem.DepositPrice = null;
                estateProperty.selectedItem.RentPrice = null;
                estateProperty.selectedItem.Description = "";
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            estateProperty.addRequested = false;
        });

    }

    estateProperty.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }

    // ----------- FilePicker Codes --------------------------
    estateProperty.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !estateProperty.alreadyExist(id, estateProperty.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            estateProperty.attachedFiles.push(file);
            estateProperty.clearfilePickers();

        }
    }

    estateProperty.alreadyExist = function (fieldName, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldName == array[i]) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                estateProperty.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    estateProperty.editContract = function (index) {
        estateProperty.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'EstateContract/edit', estateProperty.contractsList[index], 'PUT').success(function (res) {
            estateProperty.addRequested = false;
            rashaErManage.checkAction(res);
            if (res.IsSuccess) {
                estateProperty.contractsList.splice(index, 1);
                estateProperty.contractsList.push(res.Item)
                rashaErManage.showMessage("ویرایش با موفقیت انجام شد!");
            }
        }).error(function (data2, errCode2, c2, d2) {
            rashaErManage.checkAction(data2);
        });
    }

    estateProperty.deleteContract = function (index) {
        estateProperty.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'EstateContract/delete', estateProperty.contractsList[index], 'POST').success(function (res) {
            estateProperty.addRequested = false;
            rashaErManage.checkAction(res);
            if (res.IsSuccess) {
                estateProperty.contractsList.splice(index, 1);
                rashaErManage.showMessage($filter('translatentk')('Removed_Successfully'));
            }
        }).error(function (data2, errCode2, c2, d2) {
            rashaErManage.checkAction(data2);
        });
    }

    estateProperty.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            estateProperty.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    estateProperty.clearfilePickers = function () {
        estateProperty.filePickerFiles.filename = null;
        estateProperty.filePickerFiles.fileId = null;
    }

    function stringfyLinkFileIds(arrayOfFiles) {
        var ret = "";
        $.each(arrayOfFiles, function (index, item) {
            if (ret == "")
                ret = item.fileId;
            else
                ret = ret + ',' + item.fileId;
        });
        return ret;
    }
    //--------- End FilePickers Codes ------------------------

    //---------------Upload Modal-----------------------------
    estateProperty.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleEstate/EstateProperty/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        estateProperty.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            estateProperty.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    estateProperty.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    estateProperty.whatcolor = function (progress) {
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

    estateProperty.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    estateProperty.replaceFile = function (name) {
        estateProperty.itemClicked(null, estateProperty.fileIdToDelete, "file");
        estateProperty.fileTypes = 1;
        estateProperty.fileIdToDelete = estateProperty.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", estateProperty.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    estateProperty.remove(estateProperty.FileList, estateProperty.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                estateProperty.FileItem = response3.Item;
                                estateProperty.FileItem.FileName = name;
                                estateProperty.FileItem.Extension = name.split('.').pop();
                                estateProperty.FileItem.FileSrc = name;
                                estateProperty.FileItem.LinkCategoryId = estateProperty.thisCategory;
                                estateProperty.saveNewFile();
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
    estateProperty.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", estateProperty.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                estateProperty.FileItem = response.Item;
                estateProperty.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            estateProperty.showErrorIcon();
            return -1;
        });
    }

    estateProperty.showSuccessIcon = function () {
    }

    estateProperty.showErrorIcon = function () {

    }
    //file is exist
    estateProperty.fileIsExist = function (fileName) {
        for (var i = 0; i < estateProperty.FileList.length; i++) {
            if (estateProperty.FileList[i].FileName == fileName) {
                estateProperty.fileIdToDelete = estateProperty.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    estateProperty.getFileItem = function (id) {
        for (var i = 0; i < estateProperty.FileList.length; i++) {
            if (estateProperty.FileList[i].Id == id) {
                return estateProperty.FileList[i];
            }
        }
    }

    //select file or folder
    estateProperty.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            estateProperty.fileTypes = 1;
            estateProperty.selectedFileId = estateProperty.getFileItem(index).Id;
            estateProperty.selectedFileName = estateProperty.getFileItem(index).FileName;
        }
        else {
            estateProperty.fileTypes = 2;
            estateProperty.selectedCategoryId = estateProperty.getCategoryName(index).Id;
            estateProperty.selectedCategoryTitle = estateProperty.getCategoryName(index).Title;
        }

        estateProperty.selectedIndex = index;

    }

    estateProperty.showContractDetails = function (contract) {
        estateProperty.selectedContract = contract;
    }
    //upload file
    estateProperty.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (estateProperty.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ estateProperty.replaceFile(uploadFile.name);
                    estateProperty.itemClicked(null, estateProperty.fileIdToDelete, "file");
                    estateProperty.fileTypes = 1;
                    estateProperty.fileIdToDelete = estateProperty.selectedIndex;
                    // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                estateProperty.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        estateProperty.FileItem = response2.Item;
                        estateProperty.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        estateProperty.filePickerMainImage.filename =
                          estateProperty.FileItem.FileName;
                        estateProperty.filePickerMainImage.fileId =
                          response2.Item.Id;
                        estateProperty.selectedItem.LinkMainImageId =
                          estateProperty.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      estateProperty.showErrorIcon();
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
                    estateProperty.FileItem = response.Item;
                    estateProperty.FileItem.FileName = uploadFile.name;
                    estateProperty.FileItem.uploadName = uploadFile.uploadName;
                    estateProperty.FileItem.Extension = uploadFile.name.split('.').pop();
                    estateProperty.FileItem.FileSrc = uploadFile.name;
                    estateProperty.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- estateProperty.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", estateProperty.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            estateProperty.FileItem = response.Item;
                            estateProperty.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            estateProperty.filePickerMainImage.filename = estateProperty.FileItem.FileName;
                            estateProperty.filePickerMainImage.fileId = response.Item.Id;
                            estateProperty.selectedItem.LinkMainImageId = response.Item.Id;
                            estateProperty.selectedItem.LinkMainImageId = estateProperty.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        estateProperty.showErrorIcon();
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
    estateProperty.exportFile = function () {
        estateProperty.addRequested = true;
        estateProperty.gridOptions.advancedSearchData.engine.ExportFile = estateProperty.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'EstateProperty/exportfile', estateProperty.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            estateProperty.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                estateProperty.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //estateProperty.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    estateProperty.toggleExportForm = function () {
        estateProperty.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        estateProperty.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        estateProperty.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        estateProperty.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        estateProperty.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleEstate/EstateProperty/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    estateProperty.rowCountChanged = function () {
        if (!angular.isDefined(estateProperty.ExportFileClass.RowCount) || estateProperty.ExportFileClass.RowCount > 5000)
            estateProperty.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    estateProperty.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"EstateProperty/count", estateProperty.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            estateProperty.addRequested = false;
            rashaErManage.checkAction(response);
            estateProperty.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            estateProperty.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    estateProperty.thousandSeparator = function (field, digit) {
        var value = digit.replace(new RegExp(",", "g"), '');
        var x = (parseInt(value)).toLocaleString();
        estateProperty.selectedItem[field] = x;
    }

    estateProperty.onRecordStatusChange = function (record) {
        //estateProperty.busyIndicator.isActive = true;
        //var filterstatus = { Filters: [{ PropertyName: "RecordStatus", SearchType: 0, IntValue1: record }] };
        //ajax.call(cmsServerConfig.configApiServerPath+"estateproperty/getAllwithalias", filterstatus, 'POST').success(function (response) {
        //    rashaErManage.checkAction(response);
        //    estateProperty.ListItems = response.ListItems;
        //    estateProperty.gridOptions.fillData(estateProperty.ListItems, response.resultAccess);
        //    estateProperty.gridOptions.currentPageNumber = response.CurrentPageNumber;
        //    estateProperty.gridOptions.totalRowCount = response.TotalRowCount;
        //    estateProperty.gridOptions.rowPerPage = response.RowPerPage;
        //    estateProperty.busyIndicator.isActive = false;
        //}).error(function (data, errCode, c, d) {
        //    estateProperty.busyIndicator.isActive = false;
        //    estateProperty.gridOptions.fillData();
        //    rashaErManage.checkAction(data, errCode);
        //});
    }
}]);

