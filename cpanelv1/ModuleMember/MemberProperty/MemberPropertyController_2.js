app.controller("memberPropertyController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var memberProperty = this;
    memberProperty.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    memberProperty.attachedFiles = [];
    memberProperty.attachedFile = "";
    memberProperty.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: 0,
        multiSelect: false,
    }

    memberProperty.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        filename: null,
        fileId: 0,
        multiSelect: false,
    }
    memberProperty.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    memberProperty.GeolocationConfig={
        locationMember:'Geolocation',
        locationMemberString:'GeolocationString',
        onlocationChanged:memberProperty.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:memberProperty,
        useCurrentLocationZoom:12,
    }
    memberProperty.filePickerMainImage.clear = function () {
        memberProperty.filePickerMainImage.fileId = 0;
        memberProperty.filePickerMainImage.filename = "";
    }

    memberProperty.filePickerFiles.clear = function () {
        memberProperty.filePickerFiles.fileId = 0;
        memberProperty.filePickerFiles.filename = "";
    }

    if (itemRecordStatus != undefined) memberProperty.itemRecordStatus = itemRecordStatus;

    memberProperty.propertyTypeListItems = [];
    memberProperty.propertyDetailGroupListItems = [];
    memberProperty.propertyDetailsListItems = [];
    memberProperty.cmsUsersListItems = [];
    memberProperty.contractTypeListItems = [];
 //#help/ سلکتور نوع عضو 
    memberProperty.LinkMemberUserIdSelector = {
      displayMember: "FirstName",
      id: "Id",
      fId: "LinkMemberUserId",
      url: "MemberUser",
      sortColumn: "Id",
      sortType: 0,
      filterText: "FirstName",
      showAddDialog: false,
      rowPerPage: 200,
      scope: memberProperty,
      columnOptions: {
        columns: [
          {
            name: "Id",
            displayName: "کد سیستمی",
            sortable: true,
            type: "integer"
          },
          {
            name: "FirstName",
            displayName: "نام",
            sortable: true,
            type: "string"
          },
          {
            name: "LastName",
            displayName: "نام خانوادگی",
            sortable: true,
            type: "string"
          }
        ]
      }
    };
    memberProperty.init = function () {
        memberProperty.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"memberproperty/getAllwithalias", memberProperty.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            memberProperty.ListItems = response.ListItems;
            memberProperty.gridOptions.fillData(memberProperty.ListItems, response.resultAccess);
            memberProperty.gridOptions.currentPageNumber = response.CurrentPageNumber;
            memberProperty.gridOptions.totalRowCount = response.TotalRowCount;
            memberProperty.gridOptions.rowPerPage = response.RowPerPage;
            memberProperty.allowedSearch = response.AllowedSearchField;
            memberProperty.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            memberProperty.busyIndicator.isActive = false;
            memberProperty.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"memberpropertytype/getAll", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            memberProperty.propertyTypeListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            memberProperty.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"CoreLocation/GetAllProvinces", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            memberProperty.provinceCmsLocatinoListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            memberProperty.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    memberProperty.busyIndicator.isActive = true;
    memberProperty.addRequested = false;
    $(".back1").hide();

    memberProperty.attachedFiles = [];
    memberProperty.attachedFile = "";
    memberProperty.filePickerMainImage.filename = "";
    memberProperty.filePickerMainImage.fileId = null;
    memberProperty.filePickerFiles.filename = "";
    memberProperty.filePickerFiles.fileId = null;

    // Open Add Modal
    memberProperty.openAddModal = function () {
        if (buttonIsPressed) return;
        memberProperty.onPropertyTypeChange();
        memberProperty.modalTitle = 'اضافه';
        //Clear file pickers
        memberProperty.attachedFiles = [];
        memberProperty.attachedFile = "";
        memberProperty.filePickerMainImage.filename = "";
        memberProperty.filePickerMainImage.fileId = null;
        memberProperty.filePickerFiles.filename = "";
        memberProperty.filePickerFiles.fileId = null;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'memberproperty/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            memberProperty.busyIndicator.isActive = false;
            memberProperty.selectedItem = response.Item;
            memberProperty.selectedItem.LinkPropertyTypeId = null;
            $modal.open({
                templateUrl: 'cpanelv1/Modulemember/memberProperty/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberProperty.busyIndicator.isActive = false;
        });
    }

    // Add New Content
    memberProperty.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage("مقادیر فرم کامل وارد نشده");
            return;
        }
        if (memberProperty.requiredPropertyIsEmpty(memberProperty.selectedItem)) {
            rashaErManage("مقادیر الزامی را وارد کنید!");
            return;
        }
        memberProperty.busyIndicator.isActive = true;
        memberProperty.addRequested = true;
        var valueItem = {};
        memberProperty.valueItems = [];
        ajax.call(cmsServerConfig.configApiServerPath+'memberproperty/add', memberProperty.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                memberProperty.closeModal();
                ajax.call(cmsServerConfig.configApiServerPath+"memberpropertydetailvalue/GetViewModel", "0", 'GET').success(function (response1) {
                    rashaErManage.checkAction(response1);
                    for (var i = 0; i < memberProperty.propertyDetailsListItems.length; i++) {
                        valueItem = $.extend(true, {}, response1.Item);
                        valueItem.LinkPropertyDetailId = memberProperty.propertyDetailsListItems[i].Id;
                        valueItem.LinkPropertyId = response.Item.Id;
                        if (memberProperty.propertyDetailsListItems[i].DefaultValue != null) {
                            if (memberProperty.propertyDetailsListItems[i].DefaultValue.multipleChoice) {
                                var checkboxName = "nameValue" + memberProperty.propertyDetailsListItems[i].Id;
                                memberProperty.selectionValueNames = [];
                                jQuery("input[name='" + checkboxName + "']").each(function () {
                                    if (this.checked) {
                                        memberProperty.selectionValueNames.push(this.value);
                                    }
                                });
                                valueItem.Value = memberProperty.selectionValueNames.toString();
                            }
                            else {

                                if (memberProperty.propertyDetailsListItems[i].DefaultValue.forceUse && memberProperty.propertyDetailsListItems[i].DefaultValue.nameValue.length > 0) {  //ELement is a RadioButton/DropDown
                                    //Do not delete the following comments: Get the value if the element is a RadioButton
                                    /*var radioButton = "nameValue" + memberProperty.propertyDetailsListItems[i].Id;
                                    memberProperty.selectionValueNames = [];
                                    if ($("input[name='" + radioButton + "']").is(':checked')) {
                                        valueItem.Value = $("input[name='" + radioButton + "']:checked").val(); 
                                    }*/
                                    valueItem.Value = $('#dropDown' + memberProperty.propertyDetailsListItems[i].Id).find(":selected").val(); //Get the value if the element is a DropDown

                                } else
                                    valueItem.Value = memberProperty.propertyDetailsListItems[i].value;
                            }
                        } else
                            valueItem.Value = memberProperty.propertyDetailsListItems[i].value;
                        memberProperty.valueItems.push(valueItem);
                    }
                    ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyDetailValue/AddBatch', memberProperty.valueItems, 'POST').success(function (response2) {
                        rashaErManage.checkAction(response2);
                        if (response2.IsSuccess) {
                            memberProperty.ListItems.unshift(response.Item);
                            memberProperty.gridOptions.fillData(memberProperty.ListItems);
                            memberProperty.gridOptions.myfilterText(memberProperty.ListItems, "LinkCmsUserId", memberProperty.cmsUsersListItems, "Username", "LinkCmsUserUsername");
                            memberProperty.gridOptions.myfilterText(memberProperty.ListItems, "LinkPropertyTypeId", memberProperty.propertyTypeListItems, "Title", "LinkPropertyTypeTitle");
                            memberProperty.addRequested = false;
                            memberProperty.busyIndicator.isActive = false;
                            //ملک و مقادیر ثبت شده است از کاربر می خواهیم که نوع فروش را مشخص کند
                            //memberProperty.openAddContractModal(response.Item.Id, response.Item.Title);
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
            memberProperty.addRequested = false;
        });
    }

    // Open Edit Content Modal 
    memberProperty.openEditModal = function () {
        if (buttonIsPressed) return;
        memberProperty.onPropertyTypeChange();
        //Clear file pickers
        memberProperty.attachedFiles = [];
        memberProperty.attachedFile = "";
        memberProperty.filePickerMainImage.filename = "";
        memberProperty.filePickerMainImage.fileId = null;
        memberProperty.filePickerFiles.filename = "";
        memberProperty.filePickerFiles.fileId = null;
        memberProperty.modalTitle = 'ویرایش';
        if (!memberProperty.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک ردیف جهت ویرایش انتخاب کنید");
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'memberproperty/GetOne', parseInt(memberProperty.gridOptions.selectedRow.item.Id), 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            memberProperty.selectedItem = response.Item;
            memberProperty.oldLinkPropertyTypeId = memberProperty.selectedItem.LinkPropertyTypeId;
            memberProperty.loadDetailValues(memberProperty.selectedItem.LinkPropertyTypeId, memberProperty.selectedItem.Id);
            //---- Set Province City Location
            //memberProperty.onProvinceChange(memberProperty.selectedItem.LinkProvinceId);
            //memberProperty.onCitiesChange(memberProperty.selectedItem.LinkLocationId);
            //---- Set MainImage and AttachedFiles on edit modal open
            memberProperty.filePickerMainImage.filename = null;
            memberProperty.filePickerMainImage.fileId = null;
            if (response.Item.LinkMainImageId != null && response.Item.LinkMainImageId > 0) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(response.Item.LinkMainImageId), 'GET').success(function (response2) {
                    if (response2.IsSuccess && response2.Item.Id > 9) {
                        memberProperty.filePickerMainImage.filename = response2.Item.FileName;
                        memberProperty.filePickerMainImage.fileId = response2.Item.Id;
                    }
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            if (response.Item.LinkExtraImageIds != null && response.Item.LinkExtraImageIds != "")
                memberProperty.parseFileIds(response.Item.LinkExtraImageIds);
            //*****************************************************************
            $modal.open({
                templateUrl: 'cpanelv1/Modulemember/memberProperty/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    memberProperty.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage("مقادیر فرم کامل وارد نشده");
            return;
        }
        // Edit Property: Title, Description, LinkPropertyTypeId
        memberProperty.busyIndicator.isActive = true;
        memberProperty.selectedItem.LinkExtraImageIds = stringfyLinkFileIds(memberProperty.attachedFiles);
        ajax.call(cmsServerConfig.configApiServerPath+'memberproperty/edit', memberProperty.selectedItem, 'PUT').success(function (response) {
            memberProperty.addRequested = true;
            rashaErManage.checkAction(response);
            memberProperty.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                memberProperty.addRequested = false;
                memberProperty.replaceItem(memberProperty.selectedItem.Id, response.Item);
                memberProperty.gridOptions.fillData(memberProperty.ListItems);
                memberProperty.gridOptions.myfilterText(memberProperty.ListItems, "LinkCmsUserId", memberProperty.cmsUsersListItems, "Username", "LinkCmsUserUsername");
                memberProperty.gridOptions.myfilterText(memberProperty.ListItems, "LinkPropertyTypeId", memberProperty.propertyTypeListItems, "Title", "LinkPropertyTypeTitle");
                memberProperty.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberProperty.addRequested = false;
            memberProperty.busyIndicator.isActive = false;
        });

        // ------------------------- Check if Property Type (LinkPropertyTypeId) has changed ---------------------------
        if (memberProperty.oldLinkPropertyTypeId != memberProperty.selectedItem.LinkPropertyTypeId) {
            var filterValue = {
                PropertyName: "LinkPropertyId",
                IntValue1: parseInt(memberProperty.selectedItem.Id),
                SearchType: 0
            }
            var engine = {};
            engine.Filters = [];
            engine.Filters.push(filterValue);
            ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyDetailValue/DeleteFilterModel', engine, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                console.log(response.Item);
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                memberProperty.busyIndicator.isActive = false;

            });
            ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyDetailValue/AddBatch', memberProperty.selectedItem.LinkPropertyId, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                console.log(response.Item);
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                memberProperty.busyIndicator.isActive = false;

            });
        }
        else {
            // -------------------------************* Set Values to Edit ************------------------------------
            for (var i = 0; i < memberProperty.propertyDetailsListItems.length; i++) {
                memberProperty.propertyDetailsListItems[i].valueFound = false;
                for (var j = 0; j < memberProperty.propertyDetailValuesListItems.length; j++) {
                    if (memberProperty.propertyDetailsListItems[i].Id == memberProperty.propertyDetailValuesListItems[j].LinkPropertyDetailId) {
                        memberProperty.propertyDetailsListItems[i].valueFound = true;
                        if (memberProperty.propertyDetailsListItems[i].DefaultValue.multipleChoice == false) { // Detail is not CheckBox
                            if (memberProperty.propertyDetailsListItems[i].DefaultValue.forceUse) { // Detail is RadioButton/DropDown
                                /*Do not delete the following comments: Get the value if the element is a RadioButton
                                var radioName = "selection" + memberProperty.propertyDetailsListItems[i].Id;
                                var radioValue = memberProperty[radioName].toString();
                                memberProperty.propertyDetailsListItems[i].value = radioValue; */
                                memberProperty.propertyDetailValuesListItems[j].Value = $('#dropDown' + memberProperty.propertyDetailsListItems[i].Id).find(":selected").val(); //Get the value if the element is a DropDown
                            }
                            else
                                // Detail is not a CheckBox, nor a RadioButton
                                memberProperty.propertyDetailValuesListItems[j].Value = String(memberProperty.propertyDetailsListItems[i].value);
                        } else { // Detail is CheckBox
                            var checkboxName = "selection" + memberProperty.propertyDetailsListItems[i].Id.toString();
                            memberProperty.propertyDetailValuesListItems[j].Value = memberProperty[checkboxName].toString();
                        }
                    }
                }
                if (!memberProperty.propertyDetailsListItems[i].valueFound) {
                    console.log(memberProperty.propertyDetailsListItems[i]);
                    var proeprtyDetailValue = { LinkPropertyId: 0, LinkPropertyDetailId: 0, Value: 0 };
                    if (memberProperty.propertyDetailsListItems[i].DefaultValue.multipleChoice == false) { // Detail is not CheckBox
                        if (memberProperty.propertyDetailsListItems[i].DefaultValue.forceUse) { // Detail is RadioButton/DropDown
                            memberProperty.propertyDetailValuesListItems.push({ Id: 0, LinkPropertyId: memberProperty.selectedItem.Id, LinkPropertyDetailId: memberProperty.propertyDetailsListItems[i].Id, Value: $('#dropDown' + memberProperty.propertyDetailsListItems[i].Id).find(":selected").val() }); //Get the value if the element is a DropDown
                        }
                        else
                            // Detail is not a CheckBox, nor a RadioButton
                            memberProperty.propertyDetailValuesListItems.push({ Id: 0, LinkPropertyId: memberProperty.selectedItem.Id, LinkPropertyDetailId: memberProperty.propertyDetailsListItems[i].Id, Value: String(memberProperty.propertyDetailsListItems[i].value) });
                    } else { // Detail is CheckBox
                        var checkboxName = "selection" + memberProperty.propertyDetailsListItems[i].Id.toString();
                        memberProperty.propertyDetailValuesListItems.push({ Id: 0, LinkPropertyId: memberProperty.selectedItem.Id, LinkPropertyDetailId: memberProperty.propertyDetailsListItems[i].Id, Value: memberProperty[checkboxName].toString() });
                    }
                }
            }
            // ---------------------------------- End of Set Values to Edit --------------------------------------
            memberProperty.addRequested = true;
            ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyDetailValue/EditBatch', memberProperty.propertyDetailValuesListItems, 'PUT').success(function (response) {
                rashaErManage.checkAction(response);
                memberProperty.busyIndicator.isActive = false;
                if (response.IsSuccess) {
                    memberProperty.addRequested = false;
                    memberProperty.closeModal();
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                memberProperty.addRequested = false;
                memberProperty.busyIndicator.isActive = false;
            });
        }
    }

    memberProperty.closeModal = function () {
        $modalStack.dismissAll();
    };

    memberProperty.replaceItem = function (oldId, newItem) {
        angular.forEach(memberProperty.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = memberProperty.ListItems.indexOf(item);
                memberProperty.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            memberProperty.ListItems.unshift(newItem);
    }

    memberProperty.deleteRow = function () {
        if (buttonIsPressed) return;

        if (!memberProperty.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک ردیف جهت حذف انتخاب کنید");
            return;
        }
        rashaErManage.showYesNo("هشدار", "آیا می خواهید این مشخصه را حذف کنید", function (isConfirmed) {
            if (isConfirmed) {
                memberProperty.busyIndicator.isActive = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'memberproperty/GetOne', memberProperty.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    memberProperty.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'memberproperty/delete', memberProperty.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        memberProperty.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            memberProperty.replaceItem(memberProperty.selectedItemForDelete.Id);
                            memberProperty.gridOptions.fillData(memberProperty.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        memberProperty.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    memberProperty.busyIndicator.isActive = false;
                });
            }
        });
    }

    memberProperty.searchData = function () {
        memberProperty.gridOptions.searchData();
    }
    memberProperty.LinkLocationIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkLocationId',
        url: 'CmsLocation',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'LinkLocationId',
        rowPerPage: 200,
        action: 'GetAllCities',
        scope: memberProperty,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'virtual_Parent.Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
                { name: 'Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
            ]
        }
    }
    memberProperty.gridOptions = {
        columns: [
            { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'نام', sortable: true, type: 'string', visible: true },
            { name: 'Description', displayName: 'توضیح', sortable: true, type: 'string', visible: true, excerpt: true, excerptLength: 30 },
            { name: 'LinkCmsUserId', displayName: 'کد سیستمی کاربر', sortable: true, type: 'string', visible: true, displayForce: true },
            { name: 'virtual_PropertyType.Title', displayName: 'نوع عضو', sortable: true, type: 'string', visible: true, displayForce: true },
            { name: 'ViewCount', displayName: 'تعداد بازدید', sortable: true, visible: true,type:'integer' },
           // { name: 'ActionButtons', displayName: 'خصوصیات ملک', sortable: true, type: 'string', visible: true, displayForce: true, template: '<button type="button" class="btn btn-primary" ng-click="memberProperty.openAddContractModal(x.Id,x.Title)"  class="btn btn-primary"><i class="fa fa-plus-circle" aria-hidden="true"></i>&nbsp;سپردن نوع معامله</button>' }
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

    memberProperty.gridOptions.reGetAll = function () {
        memberProperty.init();
    }

    memberProperty.gridOptions.onRowSelected = function () { }

    memberProperty.columnCheckbox = false;

    memberProperty.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (memberProperty.gridOptions.columnCheckbox) {
            for (var i = 0; i < memberProperty.gridOptions.columns.length; i++) {
                //memberProperty.gridOptions.columns[i].visible = $("#" + memberProperty.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + memberProperty.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                memberProperty.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = memberProperty.gridOptions.columns;
            for (var i = 0; i < memberProperty.gridOptions.columns.length; i++) {
                memberProperty.gridOptions.columns[i].visible = true;
                var element = $("#" + memberProperty.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + memberProperty.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < memberProperty.gridOptions.columns.length; i++) {
            console.log(memberProperty.gridOptions.columns[i].name.concat(".visible: "), memberProperty.gridOptions.columns[i].visible);
        }
        memberProperty.gridOptions.columnCheckbox = !memberProperty.gridOptions.columnCheckbox;
    }

    memberProperty.onPropertyTypeChange = function (propertyTypeId) {
        memberProperty.propertyDetailsListItems = []; //Clear out the array from previous values
        memberProperty.propertyDetailGroupListItems = []; //Clear out the array from previous values
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
        ajax.call(cmsServerConfig.configApiServerPath+"memberPropertyDetail/GetAll", engine, 'POST').success(function (response) {
            memberProperty.propertyDetailsListItems = response.ListItems;
            $.each(memberProperty.propertyDetailsListItems, function (index, item) {
                item.value = null;
                // Add groups to its list
                var result = $.grep(memberProperty.propertyDetailGroupListItems, function (e) { return e.Id == item.virtual_PropertyDetailGroup.Id; });
                if (result.length <= 0)
                    memberProperty.propertyDetailGroupListItems.push(item.virtual_PropertyDetailGroup);

                // Add DefaultValue to the object
                item.DefaultValue = JSON.parse(item.JsonDefaultValue);
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    memberProperty.selectedPropertyDetailsListItems = [];
    memberProperty.onPropertyDetailGroupChange = function (propertyDetailGroupId) {
        memberProperty.selectedPropertyDetailsListItems = [];
        if (0 < memberProperty.propertyDetailsListItems.length) {
            $.each(memberProperty.propertyDetailsListItems, function (index, propertyDetail) {
                if (propertyDetail.LinkPropertyDetailGroupId == propertyDetailGroupId) {
                    memberProperty.selectedPropertyDetailsListItems.push(propertyDetail);
                }
            });
        }
    }

    // Filter Texts for CmsUser
    memberProperty.gridOptions.myfilterText = function (gridListItems, foreignKeyName, childListItems, childDesiredPropertyName, childItemColumnName) {
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
    memberProperty.loadDetailValues = function (propertyTypeId, propertyId) {
        var filterValue1 = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(propertyTypeId),
            SearchType: 0
        }
        var engine1 = {
        };
        engine1.Filters = [];
        engine1.Filters.push(filterValue1);
        ajax.call(cmsServerConfig.configApiServerPath+"memberPropertyDetail/GetAll", engine1, 'POST').success(function (response1) {
            memberProperty.propertyDetailsListItems = response1.ListItems;
            //---------- Load Values ---------------------------------------
            var filterValue2 = {
                PropertyName: "LinkPropertyId",
                IntValue1: parseInt(propertyId),
                SearchType: 0
            }
            var engine2 = { Filters: [] };
            engine2.Filters.push(filterValue2);
            ajax.call(cmsServerConfig.configApiServerPath+"memberPropertyDetailValue/GetAll", engine2, 'POST').success(function (response) {
                $.each(memberProperty.propertyDetailsListItems, function (index, item) {
                    item.value = null;
                    // Add groups to its list
                    var result = $.grep(memberProperty.propertyDetailGroupListItems, function (e) { return e.Id == item.virtual_PropertyDetailGroup.Id; });
                    if (result.length <= 0)
                        memberProperty.propertyDetailGroupListItems.push(item.virtual_PropertyDetailGroup);

                    // Add DefaultValue to the object
                    if (item.JsonDefaultValue == null) item.JsonDefaultValue = "{\"nameValue\":[],\"forceUse\":false,\"multipleChoice\":false}"; // جلوگیری از بروز خطا اگر مقادیر پیش فرض تهی باشد
                    item.DefaultValue = JSON.parse(item.JsonDefaultValue);
                });
                memberProperty.propertyDetailValuesListItems = response.ListItems;
                for (var i = 0; i < memberProperty.propertyDetailsListItems.length; i++) {
                    for (var j = 0; j < memberProperty.propertyDetailValuesListItems.length; j++) {
                        if (memberProperty.propertyDetailsListItems[i].Id == memberProperty.propertyDetailValuesListItems[j].LinkPropertyDetailId) {
                            var jsonDefaultValue = null;
                            try {
                                jsonDefaultValue = JSON.parse(memberProperty.propertyDetailsListItems[i].JsonDefaultValue);
                            } catch (e) {
                                console.log(e);
                            }

                            if (memberProperty.propertyDetailValuesListItems[j].Value != null) {
                                if (jsonDefaultValue != undefined && jsonDefaultValue != null && jsonDefaultValue.nameValue != undefined && jsonDefaultValue.nameValue != null && 0 < jsonDefaultValue.nameValue.length) {
                                    if (jsonDefaultValue.multipleChoice) {   // Detail is CheckBox
                                        var multipleValues = memberProperty.propertyDetailValuesListItems[j].Value.split(',');
                                        setSelection(memberProperty.propertyDetailsListItems[i].Id, multipleValues);

                                    }
                                    else if (jsonDefaultValue.forceUse && jsonDefaultValue.nameValue.length > 0) {   // Detail is RadioButton/DropDown
                                        /*Do not delete this line: Load the value if the elements is RadioButton
                                        var radioValues = memberProperty.propertyDetailValuesListItems[j].Value.split(',');
                                        setSelection(memberProperty.propertyDetailsListItems[i].Id, radioValues); */
                                        memberProperty.propertyDetailsListItems[i].value = memberProperty.propertyDetailValuesListItems[j].Value;
                                    } else {     // Detail is InputDataList
                                        memberProperty.propertyDetailsListItems[i].value = memberProperty.propertyDetailValuesListItems[j].Value;
                                    }
                                } else {
                                    switch (memberProperty.propertyDetailsListItems[i].InputDataType) {
                                        case 0:                              // Detail is String
                                            memberProperty.propertyDetailsListItems[i].value = memberProperty.propertyDetailValuesListItems[j].Value;
                                            break;
                                        case 1:                              // Detail is Number
                                            memberProperty.propertyDetailsListItems[i].value = parseInt(memberProperty.propertyDetailValuesListItems[j].Value);
                                            break;
                                        case 2:                              // Detail is Boolean
                                            memberProperty.propertyDetailsListItems[i].value = (memberProperty.propertyDetailValuesListItems[j].Value === "true");
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
        memberProperty[checkboxName] = values;
    }

    // toggle selection for a given fruit by name
    memberProperty.toggleSelection = function (detailId, fruitName) {
        var checkboxName = "selection" + detailId.toString();
        if (memberProperty[checkboxName] == undefined)
            memberProperty[checkboxName] = [];
        var idx = memberProperty[checkboxName].indexOf(fruitName);

        // is currently selected
        if (idx > -1) {
            memberProperty[checkboxName].splice(idx, 1);
        }

            // is newly selected
        else {
            memberProperty[checkboxName].push(fruitName);
        }
    }

    // toggle selection for a given fruit by name
    memberProperty.toggleRadioSelection = function (detailId, fruitName) {
        var radioName = "selection" + detailId.toString();
        var idx = memberProperty[radioName].indexOf(fruitName);

        // is currently selected
        if (idx > -1) {

        }
            // is newly selected
        else {
            memberProperty[radioName] = [];
            memberProperty[radioName].push(fruitName);
        }
    }
    //---------------- End of LoadValues functino ------------------------------

    memberProperty.requiredPropertyIsEmpty = function (selectedItem) {
        $.each(memberProperty.propertyDetailsListItems, function (index, item) {
            if (item.Required)
                if (item.value == null || item.value == "")
                    return true;
        });
    }

    memberProperty.onContractTypeChange = function (contractTypeId) {
        var contractType = {
        };
        for (var i = 0; i < memberProperty.contractTypeListItems.length; i++) {
            if (parseInt(contractTypeId) == memberProperty.contractTypeListItems[i].Id) {
                memberProperty.selectedItem.HasSalePrice = memberProperty.contractTypeListItems[i].HasSalePrice;
                memberProperty.selectedItem.UnitSalePrice = memberProperty.contractTypeListItems[i].UnitSalePrice;
                memberProperty.selectedItem.HasPresalePrice = memberProperty.contractTypeListItems[i].HasPresalePrice;
                memberProperty.selectedItem.UnitPresalePrice = memberProperty.contractTypeListItems[i].UnitPresalePrice;
                memberProperty.selectedItem.HasRentPrice = memberProperty.contractTypeListItems[i].HasRentPrice;
                memberProperty.selectedItem.UnitRentPrice = memberProperty.contractTypeListItems[i].UnitRentPrice;
                memberProperty.selectedItem.HasDepositPrice = memberProperty.contractTypeListItems[i].HasDepositPrice;
                memberProperty.selectedItem.UnitDepositPrice = memberProperty.contractTypeListItems[i].UnitDepositPrice;
            }
        }
    }
    //memberProperty.isloadind = true;
   

    memberProperty.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }

    // ----------- FilePicker Codes --------------------------
    memberProperty.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !memberProperty.alreadyExist(id, memberProperty.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            memberProperty.attachedFiles.push(file);
            memberProperty.clearfilePickers();

        }
    }

    memberProperty.alreadyExist = function (fieldName, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldName == array[i]) {
                rashaErManage.showMessage("این مورد در حال حاضر اضافه شده است!");
                memberProperty.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    memberProperty.editContract = function (index) {
        memberProperty.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'memberContract/edit', memberProperty.contractsList[index], 'PUT').success(function (res) {
            memberProperty.addRequested = false;
            rashaErManage.checkAction(res);
            if (res.IsSuccess) {
                memberProperty.contractsList.splice(index, 1);
                memberProperty.contractsList.push(res.Item)
                rashaErManage.showMessage("ویرایش با موفقیت انجام شد!");
            }
        }).error(function (data2, errCode2, c2, d2) {
            rashaErManage.checkAction(data2);
        });
    }

    memberProperty.deleteContract = function (index) {
        memberProperty.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'memberContract/delete', memberProperty.contractsList[index], 'POST').success(function (res) {
            memberProperty.addRequested = false;
            rashaErManage.checkAction(res);
            if (res.IsSuccess) {
                memberProperty.contractsList.splice(index, 1);
                rashaErManage.showMessage("حذف با موفقیت انجام شد!");
            }
        }).error(function (data2, errCode2, c2, d2) {
            rashaErManage.checkAction(data2);
        });
    }

    memberProperty.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            memberProperty.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    memberProperty.clearfilePickers = function () {
        memberProperty.filePickerFiles.filename = null;
        memberProperty.filePickerFiles.fileId = null;
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
    memberProperty.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/Modulemember/memberProperty/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        memberProperty.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            memberProperty.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    memberProperty.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    memberProperty.whatcolor = function (progress) {
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

    memberProperty.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    memberProperty.replaceFile = function (name) {
        memberProperty.itemClicked(null, memberProperty.fileIdToDelete, "file");
        memberProperty.fileTypes = 1;
        memberProperty.fileIdToDelete = memberProperty.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", memberProperty.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    memberProperty.remove(memberProperty.FileList, memberProperty.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                memberProperty.FileItem = response3.Item;
                                memberProperty.FileItem.FileName = name;
                                memberProperty.FileItem.Extension = name.split('.').pop();
                                memberProperty.FileItem.FileSrc = name;
                                memberProperty.FileItem.LinkCategoryId = memberProperty.thisCategory;
                                memberProperty.saveNewFile();
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
    memberProperty.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", memberProperty.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                memberProperty.FileItem = response.Item;
                memberProperty.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            memberProperty.showErrorIcon();
            return -1;
        });
    }

    memberProperty.showSuccessIcon = function () {
    }

    memberProperty.showErrorIcon = function () {

    }
    //file is exist
    memberProperty.fileIsExist = function (fileName) {
        for (var i = 0; i < memberProperty.FileList.length; i++) {
            if (memberProperty.FileList[i].FileName == fileName) {
                memberProperty.fileIdToDelete = memberProperty.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    memberProperty.getFileItem = function (id) {
        for (var i = 0; i < memberProperty.FileList.length; i++) {
            if (memberProperty.FileList[i].Id == id) {
                return memberProperty.FileList[i];
            }
        }
    }

    //select file or folder
    memberProperty.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            memberProperty.fileTypes = 1;
            memberProperty.selectedFileId = memberProperty.getFileItem(index).Id;
            memberProperty.selectedFileName = memberProperty.getFileItem(index).FileName;
        }
        else {
            memberProperty.fileTypes = 2;
            memberProperty.selectedCategoryId = memberProperty.getCategoryName(index).Id;
            memberProperty.selectedCategoryTitle = memberProperty.getCategoryName(index).Title;
        }

        memberProperty.selectedIndex = index;

    }

    memberProperty.showContractDetails = function (contract) {
        memberProperty.selectedContract = contract;
    }
    //upload file
    memberProperty.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (memberProperty.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ memberProperty.replaceFile(uploadFile.name);
                    memberProperty.itemClicked(null, memberProperty.fileIdToDelete, "file");
                    memberProperty.fileTypes = 1;
                    memberProperty.fileIdToDelete = memberProperty.selectedIndex;
                    // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                memberProperty.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        memberProperty.FileItem = response2.Item;
                        memberProperty.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        memberProperty.filePickerMainImage.filename =
                          memberProperty.FileItem.FileName;
                        memberProperty.filePickerMainImage.fileId =
                          response2.Item.Id;
                        memberProperty.selectedItem.LinkMainImageId =
                          memberProperty.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      memberProperty.showErrorIcon();
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
                    memberProperty.FileItem = response.Item;
                    memberProperty.FileItem.FileName = uploadFile.name;
                    memberProperty.FileItem.uploadName = uploadFile.uploadName;
                    memberProperty.FileItem.Extension = uploadFile.name.split('.').pop();
                    memberProperty.FileItem.FileSrc = uploadFile.name;
                    memberProperty.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- memberProperty.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", memberProperty.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            memberProperty.FileItem = response.Item;
                            memberProperty.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            memberProperty.filePickerMainImage.filename = memberProperty.FileItem.FileName;
                            memberProperty.filePickerMainImage.fileId = response.Item.Id;
                            memberProperty.selectedItem.LinkMainImageId = response.Item.Id;
                            memberProperty.selectedItem.LinkMainImageId = memberProperty.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        memberProperty.showErrorIcon();
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
    memberProperty.exportFile = function () {
        memberProperty.addRequested = true;
        memberProperty.gridOptions.advancedSearchData.engine.ExportFile = memberProperty.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'memberProperty/exportfile', memberProperty.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            memberProperty.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                memberProperty.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //memberProperty.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    memberProperty.toggleExportForm = function () {
        memberProperty.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        memberProperty.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        memberProperty.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        memberProperty.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        memberProperty.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/Modulemember/memberProperty/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    memberProperty.rowCountChanged = function () {
        if (!angular.isDefined(memberProperty.ExportFileClass.RowCount) || memberProperty.ExportFileClass.RowCount > 5000)
            memberProperty.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    memberProperty.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"memberProperty/count", memberProperty.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            memberProperty.addRequested = false;
            rashaErManage.checkAction(response);
            memberProperty.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            memberProperty.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    memberProperty.thousandSeparator = function (field, digit) {
        var value = digit.replace(new RegExp(",", "g"), '');
        var x = (parseInt(value)).toLocaleString();
        memberProperty.selectedItem[field] = x;
    }

    memberProperty.onRecordStatusChange = function (record) {
        //memberProperty.busyIndicator.isActive = true;
        //var filterstatus = { Filters: [{ PropertyName: "RecordStatus", SearchType: 0, IntValue1: record }] };
        //ajax.call(cmsServerConfig.configApiServerPath+"memberproperty/getAllwithalias", filterstatus, 'POST').success(function (response) {
        //    rashaErManage.checkAction(response);
        //    memberProperty.ListItems = response.ListItems;
        //    memberProperty.gridOptions.fillData(memberProperty.ListItems, response.resultAccess);
        //    memberProperty.gridOptions.currentPageNumber = response.CurrentPageNumber;
        //    memberProperty.gridOptions.totalRowCount = response.TotalRowCount;
        //    memberProperty.gridOptions.rowPerPage = response.RowPerPage;
        //    memberProperty.busyIndicator.isActive = false;
        //}).error(function (data, errCode, c, d) {
        //    memberProperty.busyIndicator.isActive = false;
        //    memberProperty.gridOptions.fillData();
        //    rashaErManage.checkAction(data, errCode);
        //});
    }
}]);

