app.controller("objectPropertyController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$stateParams', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $stateParams, $filter) {
    var objectProperty = this;
    objectProperty.RouteUploadFileContent = cmsServerConfig.configRouteUploadFileContent;
    //For Grid Options

    if (itemRecordStatus != undefined) objectProperty.itemRecordStatus = itemRecordStatus;

objectProperty.selectedPublicConfig = {
        object: $stateParams.objectuserId
    };


    objectProperty.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    objectProperty.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
objectProperty.selectedItem = {};
objectProperty.showlistHistory=false
objectProperty.PropertyTypeId;
objectProperty.propertyTypeListItems = [];
objectProperty.selectedItemPropertyType = {};
objectProperty.selectedItemhistor={};
objectProperty.selectedItemLinkobjectUserId=false;
    // Many To Many
    // objectGroupGroup  جدول واسط
    // LinkobjectGroupId   فیلد جدول دیگر در جدول واسط
    // LinkobjectGroupId  فیلد ما در جدول واسط
    objectProperty.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'objectGroup_Id';
    var thisTableFieldICollection = 'objectUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها





   
    ajax.call(cmsServerConfig.configApiServerPath+"objectPropertyType/getall", {}, 'POST').success(function (response) {
        objectProperty.menueGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    objectProperty.hasInMany2Many = function (OtherTable) {
        if (objectProperty.selectedItem[thisTableFieldICollection] == undefined) return false;
        return objectFindByKey(objectProperty.selectedItem[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    };
    objectProperty.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (objectProperty.hasInMany2Many(OtherTable)) {
            //var index = objectProperty.selectedItem[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(objectProperty.selectedItem[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            objectProperty.selectedItem[thisTableFieldICollection].splice(index, 1);
        } else {
            objectProperty.selectedItem[thisTableFieldICollection].push(obj);
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
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
 //#help/ سلکتور نوع عضو 
    objectProperty.LinkPropertyTypeIdSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkPropertyTypeId",
      url: "objectPropertyType",
      sortColumn: "Id",
      sortType: 0,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: objectProperty,
      columnOptions: {
        columns: [
          {
            name: "Id",
            displayName: "کد سیستمی",
            sortable: true,
            type: "integer"
          },
          {
            name: "Title",
            displayName: "عنوان",
            sortable: true,
            type: "string"
          },
          {
            name: "Description",
            displayName: "توضیحات",
            sortable: true,
            type: "string"
          }
        ]
      }
    };

 //#help/ سلکتور نوع عضو 
    objectProperty.LinkobjectUserIdSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkobjectUserId",
      url: "objectUser",
      sortColumn: "Id",
      sortType: 0,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: objectProperty,
      columnOptions: {
        columns: [
          {
            name: "Id",
            displayName: "کد سیستمی",
            sortable: true,
            type: "integer"
          },
          {
            name: "Title",
            displayName: "عنوان",
            sortable: true,
            type: "string"
          },
          {
            name: "Description",
            displayName: "توضیحات",
            sortable: true,
            type: "string"
          }
        ]
      }
    };


 objectProperty.GeolocationConfig={
     latitude: 'Geolocationlatitude',
     longitude: 'Geolocationlongitude',
        onlocationChanged:objectProperty.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:objectProperty,
        useCurrentLocationZoom:12,
    }
 objectProperty.LinkLocationIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkLocationId',
        url: 'CmsLocation',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'LinkLocationId',
        rowPerPage: 200,
        action: 'GetAllCities',
        scope: objectProperty,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'virtual_Parent.Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
                { name: 'Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
            ]
        }
    }

    //Service Grid Options
    objectProperty.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'FirstName', displayName: 'نام', sortable: true, type: 'string', visible: 'true' },
            { name: 'LastName', displayName: 'نام خانوادگی', sortable: true, type: 'string', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, visible: 'true' },
            { name: 'Description', displayName: 'توضیحات', sortable: true, visible: 'true', },
            { name: "ActionKey", displayName: 'لیست تاریخچه', displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="objectProperty.openPreviewHistory(x.Id,x.LinkPropertyTypeId)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
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
                Filters: []
            }
        }
    }
    //#help History Grid Options
    objectProperty.gridOptionsHistory = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
        ],
        data: {},
        multiSelect: false,
        showUserSearchPanel: false,
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

///#help اضافه کردن property 

        //#help فرم اتصال عضو به سایت
        objectProperty.openAddPropertyinSiteModal= function () {
                objectProperty.addRequested=false;
                objectProperty.addRequestedAddUserInSite=true;
                objectProperty.selectedItemPropertyInSiteLinkobjectUserId="";
                objectProperty.selectedItemPropertyInSiteLinkobjectPropertyId="";
                objectProperty.selectedItemPropertyInSiteJoinId="";
                $modal.open({
                    templateUrl: 'cpanelv1/Moduleobject/objectProperty/addPropertyinSite.html',
                    scope: $scope
                });
        }
        //#help بررسی عضو و JoinId
        objectProperty.CheckPropertyToSite= function (frm) { 
        if (frm.$invalid)
            return;
        objectProperty.addRequested=true;
        ajax.call(cmsServerConfig.configApiServerPath+"objectProperty/GetOneByJoinId", {LinkobjectPropertyId:objectProperty.selectedItemPropertyInSiteLinkobjectPropertyId,LinkobjectUserId: objectProperty.selectedItemPropertyInSiteLinkobjectUserId,JoinId: objectProperty.selectedItemPropertyInSiteJoinId}, "POST").success(function (response) {
            if(response.IsSuccess)
            {
                objectProperty.selectedItemobjectInSite=response.Item;
                objectProperty.addRequestedAddUserInSite=false;
                objectProperty.addRequested=true;
            }
            rashaErManage.checkAction(response);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
        }

        //#help اتصال عضو به سایت
        objectProperty.addNewPropertyToSite= function () { 
        objectProperty.addRequestedAddUserInSite=true;
        ajax.call(cmsServerConfig.configApiServerPath+"objectPropertySite/AddeByJoinId",  {LinkobjectPropertyId:objectProperty.selectedItemPropertyInSiteLinkobjectPropertyId,LinkobjectUserId: objectProperty.selectedItemPropertyInSiteLinkobjectUserId,JoinId: objectProperty.selectedItemPropertyInSiteJoinId}, "POST").success(function (response) {
            if(response.IsSuccess)
            {
                objectProperty.selectedItemobjectInSiteJoinId="";
                objectProperty.selectedItemPropertyInSiteLinkobjectUserId="";
                objectProperty.selectedItemPropertyInSiteLinkobjectPropertyId="";
                objectProperty.ListItems.unshift(response.Item);
                objectProperty.gridOptions.fillData(objectProperty.ListItems);
                objectProperty.closeModal();
                objectProperty.addRequested=false;
            }
            rashaErManage.checkAction(response);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            objectProperty.addRequested=false;
            objectProperty.addRequestedAddUserInSite=true;
        });
        }


///#help

// Open Add Modal History
    objectProperty.openAddModalHistory = function () {
 if (buttonIsPressed) return;
        objectProperty.onPropertyTypeChange(objectProperty.PropertyTypeId,true);
        objectProperty.addRequested = false;
        objectProperty.modalTitle = 'اضافه';
        //Clear file pickers
        objectProperty.attachedFiles = [];
        objectProperty.attachedFile = "";
        objectProperty.filePickerMainImage.filename = "";
        objectProperty.filePickerMainImage.fileId = null;
        objectProperty.filePickerFiles.filename = "";
        objectProperty.filePickerFiles.fileId = null;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'objectHistory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            //objectProperty.busyIndicator.isActive = false;
            objectProperty.selectedItemhistory = response.Item;
            objectProperty.selectedItemhistory.LinkPropertyTypeId = objectProperty.listHistorysSelectedLinkPropertyTypeId;
            objectProperty.onPropertyTypeChange(objectProperty.selectedItemhistory.LinkPropertyTypeId , true);
            $modal.open({
                templateUrl: 'cpanelv1/Moduleobject/objectProperty/addhistory.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            //objectProperty.busyIndicator.isActive = false;
        });        

    }
//  Add History
 objectProperty.addNewContenthistory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
       /* if (objectProperty.selectedItemhistory.LinkPropertyId ==null) {
            rashaErManage.showMessage("لطفا Property را مشخص کنید");
            return;
        }*/
        //objectProperty.busyIndicator.isActive = true;
        //objectProperty.addRequested = true;
        objectProperty.selectedItemhistory.LinkPropertyId=objectProperty.PropertyID;
        //objectProperty.listHistorysSelectedLinkPropertyTypeId
        ajax.call(cmsServerConfig.configApiServerPath+'objectHistory/add', objectProperty.selectedItemhistory, 'POST').success(function (response) {
            //objectProperty.addRequested = false;
            //objectProperty.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                objectProperty.listHistorys.unshift(response.Item);
                objectProperty.gridOptionsHistory.fillData(objectProperty.listHistorys);
                objectProperty.closeModal();
//#helper  اضافه کردن مقادیر
        var valueItem = {};
        objectProperty.valueItems = [];
        ajax.call(cmsServerConfig.configApiServerPath+"objectpropertydetailvalue/GetViewModel", "0", 'GET').success(function (response1) {
                    rashaErManage.checkAction(response1);
                    objectProperty.LinkHistoryId=response.Item.Id;
                    for (var i = 0; i < objectProperty.propertyDetailsListItems.length; i++) {
                        valueItem = $.extend(true, {}, response1.Item);
                        valueItem.LinkPropertyDetailId = objectProperty.propertyDetailsListItems[i].Id;
                        valueItem.LinkPropertyId = objectProperty.PropertyID;
                        valueItem.LinkHistoryId = objectProperty.LinkHistoryId;
                        if (objectProperty.propertyDetailsListItems[i].DefaultValue != null) {
                            if (objectProperty.propertyDetailsListItems[i].DefaultValue.multipleChoice) {
                                var checkboxName = "nameValue" + objectProperty.propertyDetailsListItems[i].Id;
                                objectProperty.selectionValueNames = [];
                                jQuery("input[name='" + checkboxName + "']").each(function () {
                                    if (this.checked) {
                                        objectProperty.selectionValueNames.push(this.value);
                                    }
                                });
                                valueItem.Value = objectProperty.selectionValueNames.toString();
                            }
                            else {

                                if (objectProperty.propertyDetailsListItems[i].DefaultValue.forceUse && objectProperty.propertyDetailsListItems[i].DefaultValue.nameValue.length > 0) {  //ELement is a RadioButton/DropDown
                                    //Do not delete the following comments: Get the value if the element is a RadioButton
                                    /*var radioButton = "nameValue" + objectProperty.propertyDetailsListItems[i].Id;
                                    objectProperty.selectionValueNames = [];
                                    if ($("input[name='" + radioButton + "']").is(':checked')) {
                                        valueItem.Value = $("input[name='" + radioButton + "']:checked").val(); 
                                    }*/
                                    valueItem.Value = $('#dropDown' + objectProperty.propertyDetailsListItems[i].Id).find(":selected").val(); //Get the value if the element is a DropDown

                                } else
                                    valueItem.Value = objectProperty.propertyDetailsListItems[i].value;
                            }
                        } else
                            valueItem.Value = objectProperty.propertyDetailsListItems[i].value;
                        objectProperty.valueItems.push(valueItem);
                    }
                    ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetailValue/AddBatch', objectProperty.valueItems, 'POST').success(function (response2) {
                        rashaErManage.checkAction(response2);
                        if (response2.IsSuccess) {
                            objectProperty.listHistorys.unshift(response.Item);
                            objectProperty.gridOptionsHistory.fillData(objectProperty.listHistorys);
                            objectProperty.gridOptionsHistory.myfilterText(objectProperty.listHistorys, "LinkPropertyTypeId", objectProperty.propertyTypeListItems, "Title", "LinkPropertyTypeTitle");
                            objectProperty.addRequested = false;
                            //objectProperty.busyIndicator.isActive = false;
                            //ملک و مقادیر ثبت شده است از کاربر می خواهیم که نوع فروش را مشخص کند
                            //objectProperty.openAddContractModal(response.Item.Id, response.Item.Title);
                        }
                    }).error(function (data, errCode, c, d) {
                        console.log(data);
                        rashaErManage.checkAction(data, errCode);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
//#helper  اضافه کردن مقادیر



            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            objectProperty.busyIndicator.isActive = false;
            objectProperty.addRequested = false;
        });

    }
// Open Edit Modal History
    objectProperty.openEditModelHistory = function () {
        
        //if (buttonIsPressed) { return };
        objectProperty.addRequested = false;
        objectProperty.modalTitle = 'ویرایش';
        objectProperty.onPropertyTypeChange(objectProperty.listHistorysSelectedLinkPropertyTypeId , true);
        if (!objectProperty.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }
        objectProperty.categoryBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'objectHistory/GetOne', objectProperty.gridOptionsHistory.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            objectProperty.categoryBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            objectProperty.selectedItemhistory = response.Item;
            objectProperty.selectedItemhistoryId = response.Item.Id;
            //#help
                objectProperty.loadDetailValues(objectProperty.listHistorysSelectedLinkPropertyTypeId, objectProperty.PropertyID, true);
            //#help
            $modal.open({
                templateUrl: 'cpanelv1/Moduleobject/objectProperty/edithistory.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
//  Edit History
 objectProperty.editNewContenthistory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        //objectProperty.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'objectHistory/edit', objectProperty.selectedItemhistory, 'PUT').success(function (response) {
            //objectProperty.addRequested = true;
            rashaErManage.checkAction(response);
            //objectProperty.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                //objectProperty.addRequested = false;
                objectProperty.replaceItem(objectProperty.selectedItemhistory.Id, response.Item);
                objectProperty.gridOptionsHistory.fillData(objectProperty.listHistorys);
                objectProperty.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            //objectProperty.addRequested = false;
        });
    }
// Delete History
 objectProperty.deleteContentHistory = function () {
        if (!objectProperty.gridOptionsHistory.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                //objectProperty.busyIndicator.isActive = true;
                console.log(objectProperty.gridOptionsHistory.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'objectHistory/GetOne', objectProperty.gridOptionsHistory.selectedRow.item.Id, 'GET').success(function (response) {
                    objectProperty.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'objectHistory/delete', objectProperty.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        //objectProperty.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            objectProperty.replaceItem(objectProperty.selectedItemForDelete.Id);
                            objectProperty.gridOptionsHistory.fillData(objectProperty.selectedItemhistory);
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



objectProperty.listHistorysSelectedLinkPropertyTypeId=0;
objectProperty.openPreviewHistory = function (PropertyId,LinkPropertyTypeId) {
var engine2 = {};
        engine2.Filters = [];
         var d = {
                    PropertyName: "LinkPropertyId",
                    IntValue1: PropertyId,
                    ClauseType:1,
                    SearchType: 0
                }
                engine2.Filters.push(d);
objectProperty.PropertyID=PropertyId;
 ajax.call(cmsServerConfig.configApiServerPath+"objectHistory/getall",engine2, 'POST').success(function (response1) {
            objectProperty.showlistHistory=true;
            objectProperty.listHistorys = response1.ListItems;
            objectProperty.listHistorysSelectedLinkPropertyTypeId = LinkPropertyTypeId;
            rashaErManage.checkAction(response1);
            objectProperty.gridOptionsHistory.fillData(objectProperty.listHistorys, response1.resultAccess);
            objectProperty.gridOptionsHistory.currentPageNumber = response1.CurrentPageNumber;
            objectProperty.gridOptionsHistory.totalRowCount = response1.TotalRowCount;
            objectProperty.gridOptionsHistory.RowPerPage = response1.RowPerPage;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
}



    //For Show Category Loading Indicator
    objectProperty.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show Service Loading Indicator
    objectProperty.categoryBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    objectProperty.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    objectProperty.addMenu = function () {
        $modal.open({
            templateUrl: "cpanelv1/Moduleobject/objectPropertyType/modalMenu.html",
            scope: $scope
        });
    }
    //#help//download file
    objectProperty.downloadFile = function (Id, FileName) {
        var DownloadModel = {
            id: null,
            name: null
        };

            DownloadModel.id = Id;
            DownloadModel.name = FileName;

        window.open('/files/' + DownloadModel.id + '/' + DownloadModel.name, '_blank', '');
    }
    //#help//

    //open addMenu modal
    objectProperty.showlistfile = function (sItem) {
        var s = {
            PropertyName: "LinkModuleobjectId",
            IntValue1: sItem.Id,
            SearchType: 0
        }
        var engine = {};
        engine.Filters = [];
        engine.Filters.push(s);
     
       
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/getall", engine, "POST").success(function (response) {
            objectProperty.listComments = response.ListItems;
            rashaErManage.checkAction(response);
            objectProperty.gridOptionsfile.fillData(objectProperty.listComments, response.resultAccess);
            objectProperty.gridOptionsfile.currentPageNumber = response.CurrentPageNumber;
            objectProperty.gridOptionsfile.totalRowCount = response.TotalRowCount;
            objectProperty.gridOptionsfile.RowPerPage = response.RowPerPage;
            objectProperty.showGridComment = true;
            objectProperty.Title = objectProperty.gridOptions.selectedRow.item.Title;
        });
        $('html, body').animate({
            scrollTop: $("#showlistfile").offset().top
        }, 850);
    }
   
    objectProperty.treeConfig.currentNode = {};

    objectProperty.treeBusyIndicator = false;

    objectProperty.addRequested = false;

    //init Function
    objectProperty.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"objectGroup/getall", {}, 'POST').success(function (response) {
                objectProperty.selectedItemPropertyType = response.ListItems;    


                      ///////////////////////////////////////////////////////////////
    if (objectProperty.selectedPublicConfig.object!= null || objectProperty.selectedPublicConfig.object != undefined)
    {
            
            objectUserId=objectProperty.selectedPublicConfig.object.Id;
            objectProperty.selectedItemLinkobjectUserId=true;
            var engine = {};
            engine.Filters = [];

            //#help# گرفتن دسته بندی ها
             angular.forEach(objectProperty.selectedPublicConfig.object.ObjectUserGroup, function (item, key) {

                   
            //#help# گرفتن اطلاعات شامل از دسته بندی ها
            angular.forEach(objectProperty.selectedItemPropertyType, function (itemG, key) {
            if(itemG.Id==item.objectGroup_Id &&  itemG.LinkPropertyTypeId!=undefined && itemG.LinkPropertyTypeId!=null)
             { 
            var s = {
                                PropertyName: "Id",
                                IntValue1: itemG.LinkPropertyTypeId,
                                ClauseType:1,
                                SearchType: 0
                            }
                
                            engine.Filters.push(s);
            }
            });
            //#help# گرفتن اطلاعات شامل از دسته بندی ها

            });
            //#help# گرفتن دسته بندی ها
            if(engine.Filters.length>0)
            {
                    ajax.call(cmsServerConfig.configApiServerPath+"objectPropertyType/getall", engine, 'POST').success(function (response) {
                        objectProperty.treeConfig.Items = response.ListItems;
                        objectProperty.gridOptions.resultAccessGroup = response.resultAccess;
                        objectProperty.propertyTypeListItems = response.ListItems;
                        objectProperty.categoryBusyIndicator.isActive = false;
                    }).error(function (data, errCode, c, d) {
                        console.log(data);
                    });
             }
             objectProperty.selectedItem.LinkobjectUserId=objectProperty.selectedPublicConfig.object.Id;
            var engine = {};
            engine.Filters = [];

            var s = {
                        PropertyName: "LinkobjectUserId",
                        IntValue1: objectProperty.selectedPublicConfig.object.Id,
                        ClauseType:1,
                        SearchType: 0
                    }
                
        engine.Filters.push(s);

        ajax.call(cmsServerConfig.configApiServerPath+"objectProperty/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            angular.forEach(response.ListItems.virtual_PropertyDetailValue, function (itemV, key) {
                if(itemV.PropertyDetail.IsHistoryable!=false)
                    { 
                            objectProperty.ListItems=response.ListItems;
                    }
            });
            objectProperty.ListItems = response.ListItems;
            objectProperty.gridOptions.fillData(objectProperty.ListItems, response.resultAccess); // Sending Access as an argument
            objectProperty.allowedSearch = response.AllowedSearchField;
            objectProperty.gridOptions.currentPageNumber = response.CurrentPageNumber;
            objectProperty.gridOptions.totalRowCount = response.TotalRowCount;
            objectProperty.gridOptions.rowPerPage = response.RowPerPage;
            objectProperty.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            objectProperty.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });

        }
        else
        {
            ajax.call(cmsServerConfig.configApiServerPath+"objectPropertyType/getall", {}, 'POST').success(function (response) {
                objectProperty.treeConfig.Items = response.ListItems;
                objectProperty.gridOptions.resultAccessGroup = response.resultAccess;
                objectProperty.propertyTypeListItems = response.ListItems;
                objectProperty.categoryBusyIndicator.isActive = false;
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
        objectProperty.categoryBusyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+"objectProperty/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            angular.forEach(response.ListItems.virtual_PropertyDetailValue, function (itemV, key) {
                if(itemV.PropertyDetail.IsHistoryable!=false)
                    { 
                            objectProperty.ListItems=response.ListItems;
                    }
            });
            objectProperty.ListItems = response.ListItems;
            objectProperty.gridOptions.fillData(objectProperty.ListItems, response.resultAccess); // Sending Access as an argument
            objectProperty.allowedSearch = response.AllowedSearchField;
            objectProperty.gridOptions.currentPageNumber = response.CurrentPageNumber;
            objectProperty.gridOptions.totalRowCount = response.TotalRowCount;
            objectProperty.gridOptions.rowPerPage = response.RowPerPage;
            objectProperty.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            objectProperty.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });

        }
////////////////////////////////////////////////////////////////


    }).error(function (data, errCode, c, d) {
        console.log(data);
    });





        ajax.call(cmsServerConfig.configApiServerPath+"CoreLocation/GetAllProvinces", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            objectProperty.provinceCmsLocatinoListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            objectProperty.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });



    };


        objectProperty.getAllPropertyType = function (sItem)
        {
            objectUserId=sItem.Id;
            var engine = {};
            engine.Filters = [];

            //#help# گرفتن دسته بندی ها
             angular.forEach(sItem.objectUserGroup, function (item, key) {
      
            //#help# گرفتن اطلاعات شامل از دسته بندی ها
            angular.forEach(objectGroup.treeConfig.Items, function (itemG, key) {
            if(itemG.Id==item.objectGroup_Id &&  itemG.LinkPropertyTypeId!=undefined && itemG.LinkPropertyTypeId!=null)
             { 
            var s = {
                                PropertyName: "Id",
                                IntValue1: itemG.LinkPropertyTypeId,
                                ClauseType:1,
                                SearchType: 0
                            }
                
                            engine.Filters.push(s);
            }
            });
            //#help# گرفتن اطلاعات شامل از دسته بندی ها

            });
            //#help# گرفتن دسته بندی ها
            if(engine.Filters.length>0)
            {
                    ajax.call(cmsServerConfig.configApiServerPath+"objectPropertyType/getall", engine, 'POST').success(function (response) {
                        objectProperty.treeConfig.Items = response.ListItems;
                        objectProperty.gridOptions.resultAccessGroup = response.resultAccess;
                        objectProperty.propertyTypeListItems = response.ListItems;
                        objectProperty.categoryBusyIndicator.isActive = false;
                    }).error(function (data, errCode, c, d) {
                        console.log(data);
                    });


                      /*  ajax.call(cmsServerConfig.configApiServerPath+"objectPropertyType/getall", engine, "POST").success(function (response) {
                            objectGroup.listComments = response.ListItems;
                            angular.forEach( response.ListItems, function (item, key) {
                                item.objectUserId=objectUserId;
                            });
                            rashaErManage.checkAction(response);
                            objectGroup.gridOptionsProperty.fillData(objectGroup.listComments, response.resultAccess);
                            objectGroup.gridOptionsProperty.currentPageNumber = response.CurrentPageNumber;
                            objectGroup.gridOptionsProperty.totalRowCount = response.TotalRowCount;
                            objectGroup.gridOptionsProperty.RowPerPage = response.RowPerPage;
                            objectGroup.showGridComment = true;
                            objectGroup.Title = objectGroup.gridOptions.selectedRow.item.Title;
                        });
                        $('html, body').animate({
                            scrollTop: $("#showlistProperty").offset().top
                        }, 850);*/
             }
        }




    objectProperty.gridOptions.onRowSelected = function () {
        var item = objectProperty.gridOptions.selectedRow.item;
    }

    // Open Add Category Modal 
    /*objectProperty.addNewCategoryModel = function () {
        if (buttonIsPressed) return;
        objectProperty.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyType/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            objectProperty.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleobject/objectPropertyType/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }*/
    // Open Edit Category Modal
   /* objectProperty.openEditCategoryModel = function () {
        if (buttonIsPressed) { return };
        objectProperty.addRequested = false;
        objectProperty.modalTitle = 'ویرایش';
        if (!objectProperty.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }
        objectProperty.categoryBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyType/GetOne', objectProperty.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            objectProperty.categoryBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            objectProperty.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleobject/objectPropertyType/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }*/

    // Add New Category
    /*objectProperty.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        objectProperty.categoryBusyIndicator.isActive = true;
        objectProperty.addRequested = true;
        objectProperty.selectedItem.LinkParentId = null;
        if (objectProperty.treeConfig.currentNode != null)
            objectProperty.selectedItem.LinkParentId = objectProperty.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyType/add', objectProperty.selectedItem, 'POST').success(function (response) {
            objectProperty.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                objectProperty.gridOptions.advancedSearchData.engine.Filters = null;
                objectProperty.gridOptions.advancedSearchData.engine.Filters = [];
                objectProperty.gridOptions.reGetAll();
                objectProperty.closeModal();
            }
            objectProperty.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            objectProperty.addRequested = false;
            objectProperty.categoryBusyIndicator.isActive = false;
        });
    }*/

    //Edit Group REST Api
    /*objectProperty.editCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        objectProperty.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyType/edit', objectProperty.selectedItem, 'PUT').success(function (response) {
            objectProperty.addRequested = true;
            //objectProperty.showbusy = false;
            objectProperty.treeConfig.showbusy = false;
            objectProperty.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                objectProperty.addRequested = false;
                objectProperty.treeConfig.currentNode.Title = response.Item.Title;
                objectProperty.closeModal();
            }
            objectProperty.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            objectProperty.addRequested = false;
            objectProperty.categoryBusyIndicator.isActive = false;

        });
    }*/

    // Delete a Group
    /*objectProperty.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = objectProperty.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                objectProperty.categoryBusyIndicator.isActive = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyType/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    objectProperty.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyType/delete', objectProperty.selectedItemForDelete, 'POST').success(function (res) {
                        if (res.IsSuccess) {
                            objectProperty.gridOptions.advancedSearchData.engine.Filters = null;
                            objectProperty.gridOptions.advancedSearchData.engine.Filters = [];
                            objectProperty.gridOptions.fillData();
                            objectProperty.categoryBusyIndicator.isActive = false;
                            objectProperty.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        objectProperty.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    objectProperty.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }
*/
    //Tree: On Node Select Options
    objectProperty.treeConfig.onNodeSelect = function () {
        var node = objectProperty.treeConfig.currentNode;
        //objectProperty.selectedItem.LinkCategoryId = node.Id;
        if(node != null)
        {
            objectProperty.PropertyTypeId = node.Id;
        }
        objectProperty.selectContent(node);

    };
    //Show Content with Category Id
    objectProperty.selectContent = function (node) {
        objectProperty.gridOptions.advancedSearchData.engine.Filters = null;
        objectProperty.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            objectProperty.categoryBusyIndicator.message = "در حال بارگذاری اعضای " + node.Title;
            objectProperty.categoryBusyIndicator.isActive = true;
            objectProperty.attachedFiles = [];
            var s = {
                PropertyName: "LinkPropertyTypeId",
                IntValue1: node.Id,
                ClauseType:2,
                SearchType: 0
            }
            objectProperty.gridOptions.advancedSearchData.engine.Filters.push(s);
            if (objectProperty.selectedPublicConfig.object!= null || objectProperty.selectedPublicConfig.object != undefined)
            {
                var d = {
                            PropertyName: "LinkobjectUserId",
                            IntValue1: objectProperty.selectedPublicConfig.object.Id,
                            ClauseType:2,
                            SearchType: 0
                        }
                
            objectProperty.gridOptions.advancedSearchData.engine.Filters.push(d);
            }
        }
            ajax.call(cmsServerConfig.configApiServerPath+"objectProperty/getAll", objectProperty.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
                objectProperty.categoryBusyIndicator.isActive = false;
                objectProperty.ListItems = response.ListItems;
                objectProperty.gridOptions.fillData(objectProperty.ListItems); // Sending Access as an argument
                objectProperty.gridOptions.currentPageNumber = response.CurrentPageNumber;
                objectProperty.gridOptions.totalRowCount = response.TotalRowCount;
                objectProperty.gridOptions.rowPerPage = response.RowPerPage;
                objectProperty.gridOptions.maxSize = 5;
            }).error(function (data, errCode, c, d) {
                objectProperty.gridOptions.fillData();
                rashaErManage.checkAction(data, errCode);
            });

    
    };

      // Open Add Modal
    objectProperty.openAddModal = function () {
        if (buttonIsPressed) return;
        objectProperty.onPropertyTypeChange(objectProperty.PropertyTypeId,false);
        objectProperty.addRequested = false;
        objectProperty.modalTitle = 'اضافه';
        //Clear file pickers
        objectProperty.attachedFiles = [];
        objectProperty.attachedFile = "";
        objectProperty.filePickerMainImage.filename = "";
        objectProperty.filePickerMainImage.fileId = null;
        objectProperty.filePickerFiles.filename = "";
        objectProperty.filePickerFiles.fileId = null;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'objectproperty/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            //objectProperty.busyIndicator.isActive = false;
            objectProperty.selectedItem = response.Item;
            if (objectProperty.selectedPublicConfig.object!= null || objectProperty.selectedPublicConfig.object != undefined)
            {
                objectProperty.selectedItem.LinkobjectUserId = objectProperty.selectedPublicConfig.object.Id;
                objectProperty.selectedItemLinkobjectUserId=true;
            }
            objectProperty.selectedItem.LinkPropertyTypeId = objectProperty.PropertyTypeId;
            objectProperty.onPropertyTypeChange(objectProperty.selectedItem.LinkPropertyTypeId , false);
            $modal.open({
                templateUrl: 'cpanelv1/Moduleobject/objectProperty/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            //objectProperty.busyIndicator.isActive = false;
        });
    }

    // Add New Content
    objectProperty.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        /*if (objectProperty.requiredPropertyIsEmpty(objectProperty.selectedItem)) {
            rashaErManage("مقادیر الزامی را وارد کنید!");
            return;
        }*/
        //objectProperty.busyIndicator.isActive = true;
        objectProperty.addRequested = true;
        var valueItem = {};
        objectProperty.valueItems = [];
        ajax.call(cmsServerConfig.configApiServerPath+'objectproperty/add', objectProperty.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                objectProperty.closeModal();
                ajax.call(cmsServerConfig.configApiServerPath+"objectpropertydetailvalue/GetViewModel", "0", 'GET').success(function (response1) {
                    rashaErManage.checkAction(response1);
                    for (var i = 0; i < objectProperty.propertyDetailsListItems.length; i++) {
                        valueItem = $.extend(true, {}, response1.Item);
                        valueItem.LinkPropertyDetailId = objectProperty.propertyDetailsListItems[i].Id;
                        valueItem.LinkPropertyId = response.Item.Id;
                        if (objectProperty.propertyDetailsListItems[i].DefaultValue != null) {
                            if (objectProperty.propertyDetailsListItems[i].DefaultValue.multipleChoice) {
                                var checkboxName = "nameValue" + objectProperty.propertyDetailsListItems[i].Id;
                                objectProperty.selectionValueNames = [];
                                jQuery("input[name='" + checkboxName + "']").each(function () {
                                    if (this.checked) {
                                        objectProperty.selectionValueNames.push(this.value);
                                    }
                                });
                                valueItem.Value = objectProperty.selectionValueNames.toString();
                            }
                            else {

                                if (objectProperty.propertyDetailsListItems[i].DefaultValue.forceUse && objectProperty.propertyDetailsListItems[i].DefaultValue.nameValue.length > 0) {  //ELement is a RadioButton/DropDown
                                    //Do not delete the following comments: Get the value if the element is a RadioButton
                                    /*var radioButton = "nameValue" + objectProperty.propertyDetailsListItems[i].Id;
                                    objectProperty.selectionValueNames = [];
                                    if ($("input[name='" + radioButton + "']").is(':checked')) {
                                        valueItem.Value = $("input[name='" + radioButton + "']:checked").val(); 
                                    }*/
                                    valueItem.Value = $('#dropDown' + objectProperty.propertyDetailsListItems[i].Id).find(":selected").val(); //Get the value if the element is a DropDown

                                } else
                                    valueItem.Value = objectProperty.propertyDetailsListItems[i].value;
                            }
                        } else
                            valueItem.Value = objectProperty.propertyDetailsListItems[i].value;
                        objectProperty.valueItems.push(valueItem);
                    }
                    ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetailValue/AddBatch', objectProperty.valueItems, 'POST').success(function (response2) {
                        rashaErManage.checkAction(response2);
                        if (response2.IsSuccess) {
                            objectProperty.ListItems.unshift(response.Item);
                            objectProperty.gridOptions.fillData(objectProperty.ListItems);
                            objectProperty.gridOptions.myfilterText(objectProperty.ListItems, "LinkPropertyTypeId", objectProperty.propertyTypeListItems, "Title", "LinkPropertyTypeTitle");
                            objectProperty.addRequested = false;
                            //objectProperty.busyIndicator.isActive = false;
                            //ملک و مقادیر ثبت شده است از کاربر می خواهیم که نوع فروش را مشخص کند
                            //objectProperty.openAddContractModal(response.Item.Id, response.Item.Title);
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
            objectProperty.addRequested = false;
        });
    }

    // Open Edit Content Modal 
    objectProperty.openEditModal = function () {
        if (buttonIsPressed) return;
        objectProperty.onPropertyTypeChange(objectProperty.gridOptions.selectedRow.item.LinkPropertyTypeId , false);
        //Clear file pickers

        objectProperty.addRequested = false;
        objectProperty.attachedFiles = [];
        objectProperty.attachedFile = "";
        objectProperty.filePickerMainImage.filename = "";
        objectProperty.filePickerMainImage.fileId = null;
        objectProperty.filePickerFiles.filename = "";
        objectProperty.filePickerFiles.fileId = null;
        objectProperty.modalTitle = 'ویرایش';
        if (!objectProperty.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'objectproperty/GetOne', parseInt(objectProperty.gridOptions.selectedRow.item.Id), 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            objectProperty.selectedItem = response.Item;
            objectProperty.oldLinkPropertyTypeId = objectProperty.selectedItem.LinkPropertyTypeId;
            objectProperty.loadDetailValues(objectProperty.selectedItem.LinkPropertyTypeId, objectProperty.selectedItem.Id, false);
            //---- Set Province City Location
            //objectProperty.onProvinceChange(objectProperty.selectedItem.LinkProvinceId);
            //objectProperty.onCitiesChange(objectProperty.selectedItem.LinkLocationId);
            //---- Set MainImage and AttachedFiles on edit modal open
            objectProperty.filePickerMainImage.filename = null;
            objectProperty.filePickerMainImage.fileId = null;
            if (response.Item.LinkMainImageId != null && response.Item.LinkMainImageId > 0) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(response.Item.LinkMainImageId), 'GET').success(function (response2) {
                    if (response2.IsSuccess && response2.Item.Id > 9) {
                        objectProperty.filePickerMainImage.filename = response2.Item.FileName;
                        objectProperty.filePickerMainImage.fileId = response2.Item.Id;
                    }
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            if (response.Item.LinkExtraImageIds != null && response.Item.LinkExtraImageIds != "")
                objectProperty.parseFileIds(response.Item.LinkExtraImageIds);
            //*****************************************************************
            $modal.open({
                templateUrl: 'cpanelv1/Moduleobject/objectProperty/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    objectProperty.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        // Edit Property: Title, Description, LinkPropertyTypeId
        //objectProperty.busyIndicator.isActive = true;
        objectProperty.selectedItem.LinkExtraImageIds = stringfyLinkFileIds(objectProperty.attachedFiles);
        ajax.call(cmsServerConfig.configApiServerPath+'objectproperty/edit', objectProperty.selectedItem, 'PUT').success(function (response) {
            objectProperty.addRequested = true;
            rashaErManage.checkAction(response);
            //objectProperty.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                objectProperty.addRequested = false;
                objectProperty.replaceItem(objectProperty.selectedItem.Id, response.Item);
                objectProperty.gridOptions.fillData(objectProperty.ListItems);
                objectProperty.gridOptions.myfilterText(objectProperty.ListItems, "LinkPropertyTypeId", objectProperty.propertyTypeListItems, "Title", "LinkPropertyTypeTitle");
                objectProperty.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            objectProperty.addRequested = false;
            //objectProperty.busyIndicator.isActive = false;
        });

        // ------------------------- Check if Property Type (LinkPropertyTypeId) has changed ---------------------------
        if (objectProperty.oldLinkPropertyTypeId != objectProperty.selectedItem.LinkPropertyTypeId) {
            var filterValue = {
                PropertyName: "LinkPropertyId",
                IntValue1: parseInt(objectProperty.selectedItem.Id),
                SearchType: 0
            }
            var engine = {};
            engine.Filters = [];
            engine.Filters.push(filterValue);
            ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetailValue/DeleteFilterModel', engine, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                console.log(response.Item);
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                //objectProperty.busyIndicator.isActive = false;

            });
            ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetailValue/AddBatch', objectProperty.selectedItem.LinkPropertyId, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                console.log(response.Item);
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                //objectProperty.busyIndicator.isActive = false;

            });
        }
        else {
            // -------------------------************* Set Values to Edit ************------------------------------
            for (var i = 0; i < objectProperty.propertyDetailsListItems.length; i++) {
                objectProperty.propertyDetailsListItems[i].valueFound = false;
                for (var j = 0; j < objectProperty.propertyDetailValuesListItems.length; j++) {
                    if (objectProperty.propertyDetailsListItems[i].Id == objectProperty.propertyDetailValuesListItems[j].LinkPropertyDetailId) {
                        objectProperty.propertyDetailsListItems[i].valueFound = true;
                        if (objectProperty.propertyDetailsListItems[i].DefaultValue.multipleChoice == false) { // Detail is not CheckBox
                            if (objectProperty.propertyDetailsListItems[i].DefaultValue.forceUse) { // Detail is RadioButton/DropDown
                                /*Do not delete the following comments: Get the value if the element is a RadioButton
                                var radioName = "selection" + objectProperty.propertyDetailsListItems[i].Id;
                                var radioValue = objectProperty[radioName].toString();
                                objectProperty.propertyDetailsListItems[i].value = radioValue; */
                                objectProperty.propertyDetailValuesListItems[j].Value = $('#dropDown' + objectProperty.propertyDetailsListItems[i].Id).find(":selected").val(); //Get the value if the element is a DropDown
                            }
                            else
                                // Detail is not a CheckBox, nor a RadioButton
                                objectProperty.propertyDetailValuesListItems[j].Value = String(objectProperty.propertyDetailsListItems[i].value);
                        } else { // Detail is CheckBox
                            var checkboxName = "selection" + objectProperty.propertyDetailsListItems[i].Id.toString();
                            objectProperty.propertyDetailValuesListItems[j].Value = objectProperty[checkboxName];
                        }
                    }
                }
                if (!objectProperty.propertyDetailsListItems[i].valueFound) {
                    console.log(objectProperty.propertyDetailsListItems[i]);
                    var proeprtyDetailValue = { LinkPropertyId: 0, LinkPropertyDetailId: 0, Value: 0 };
                    if (objectProperty.propertyDetailsListItems[i].DefaultValue.multipleChoice == false) { // Detail is not CheckBox
                        if (objectProperty.propertyDetailsListItems[i].DefaultValue.forceUse) { // Detail is RadioButton/DropDown
                            objectProperty.propertyDetailValuesListItems.push({ Id: 0, LinkPropertyId: objectProperty.selectedItem.Id, LinkPropertyDetailId: objectProperty.propertyDetailsListItems[i].Id, Value: $('#dropDown' + objectProperty.propertyDetailsListItems[i].Id).find(":selected").val() }); //Get the value if the element is a DropDown
                        }
                        else
                            // Detail is not a CheckBox, nor a RadioButton
                            objectProperty.propertyDetailValuesListItems.push({ Id: 0, LinkPropertyId: objectProperty.selectedItem.Id, LinkPropertyDetailId: objectProperty.propertyDetailsListItems[i].Id, Value: String(objectProperty.propertyDetailsListItems[i].value) });
                    } else { // Detail is CheckBox
                        var checkboxName = "selection" + objectProperty.propertyDetailsListItems[i].Id.toString();
                        objectProperty.propertyDetailValuesListItems.push({ Id: 0, LinkPropertyId: objectProperty.selectedItem.Id, LinkPropertyDetailId: objectProperty.propertyDetailsListItems[i].Id, Value: objectProperty[checkboxName] });
                    }
                }
            }
            // ---------------------------------- End of Set Values to Edit --------------------------------------
            objectProperty.addRequested = true;
            ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetailValue/EditBatch', objectProperty.propertyDetailValuesListItems, 'PUT').success(function (response) {
                rashaErManage.checkAction(response);
                //objectProperty.busyIndicator.isActive = false;
                if (response.IsSuccess) {
                    objectProperty.addRequested = false;
                    objectProperty.closeModal();
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                objectProperty.addRequested = false;
                //objectProperty.busyIndicator.isActive = false;
            });
        }
    }


 objectProperty.onPropertyTypeChange = function (propertyTypeId , historyable) {
        objectProperty.propertyDetailsListItems = []; //Clear out the array from previous values
        objectProperty.propertyDetailGroupListItems = []; //Clear out the array from previous values
        if (!angular.isDefined(propertyTypeId)) return;
    var engine = {};
        engine.Filters = [];
        var filterValue1 = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(propertyTypeId),
            SearchType: 0,
            ClauseType:2
        }
 engine.Filters.push(filterValue1);
        var filterValue = {
            PropertyName: "IsHistoryable",
            BooleanValue1: historyable,
            SearchType: 0,
            ClauseType:2
        }
        
        engine.Filters.push(filterValue);
       

        ajax.call(cmsServerConfig.configApiServerPath+"objectPropertyDetail/GetAll", engine, 'POST').success(function (response) {
            
            objectProperty.propertyDetailsListItems = response.ListItems;
            $.each(objectProperty.propertyDetailsListItems, function (index, item) {
                item.value = null;
                // Add groups to its list
                var result = $.grep(objectProperty.propertyDetailGroupListItems, function (e) { return e.Id == item.virtual_PropertyDetailGroup.Id; });
                if (result.length <= 0)
                    objectProperty.propertyDetailGroupListItems.push(item.virtual_PropertyDetailGroup);

                // Add DefaultValue to the object
                item.DefaultValue = JSON.parse(item.JsonDefaultValue);
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }




   objectProperty.deleteContent = function () {
        if (buttonIsPressed) return;

        if (!objectProperty.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                //objectProperty.busyIndicator.isActive = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'objectproperty/GetOne', objectProperty.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    objectProperty.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'objectproperty/delete', objectProperty.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        //objectProperty.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            objectProperty.replaceItem(objectProperty.selectedItemForDelete.Id);
                            objectProperty.gridOptions.fillData(objectProperty.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        //objectProperty.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    //objectProperty.busyIndicator.isActive = false;
                });
            }
        });
    }



  //-----------------*** Load Values in Edit Modal ***----------------------
    objectProperty.loadDetailValues = function (propertyTypeId, propertyId,historyable) {
        /*var filterValue1 = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(propertyTypeId),
            SearchType: 0
        }
        var engine1 = {
        };
        engine1.Filters = [];
        engine1.Filters.push(filterValue1);*/
var engine = {};
        engine.Filters = [];
        var filterValue1 = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(propertyTypeId),
            SearchType: 0,
            ClauseType:2
        }
 engine.Filters.push(filterValue1);
        var filterValue = {
            PropertyName: "IsHistoryable",
            BooleanValue1: historyable,
            SearchType: 0,
            ClauseType:2
        }
        
        engine.Filters.push(filterValue);
        ajax.call(cmsServerConfig.configApiServerPath+"objectPropertyDetail/GetAll", engine, 'POST').success(function (response1) {
            objectProperty.propertyDetailsListItems = response1.ListItems;
            //---------- Load Values ---------------------------------------
            var filterValue2 = {
                PropertyName: "LinkPropertyId",
                IntValue1: parseInt(propertyId),
                SearchType: 0
            }
            if (objectProperty.selectedItemhistoryId!=null && objectProperty.selectedItemhistoryId >0)
            {
            var filterValue2 = {
                            PropertyName: "LinkHistoryId",
                            IntValue1: parseInt(objectProperty.selectedItemhistoryId),
                            SearchType: 0
                        }

            }

            var engine2 = { Filters: [] };
            engine2.Filters.push(filterValue2);
            ajax.call(cmsServerConfig.configApiServerPath+"objectPropertyDetailValue/GetAll", engine2, 'POST').success(function (response) {
                $.each(objectProperty.propertyDetailsListItems, function (index, item) {
                    item.value = null;
                    // Add groups to its list
                    var result = $.grep(objectProperty.propertyDetailGroupListItems, function (e) { return e.Id == item.virtual_PropertyDetailGroup.Id; });
                    if (result.length <= 0)
                        objectProperty.propertyDetailGroupListItems.push(item.virtual_PropertyDetailGroup);

                    // Add DefaultValue to the object
                    if (item.JsonDefaultValue == null) item.JsonDefaultValue = "{\"nameValue\":[],\"forceUse\":false,\"multipleChoice\":false}"; // جلوگیری از بروز خطا اگر مقادیر پیش فرض تهی باشد
                    item.DefaultValue = JSON.parse(item.JsonDefaultValue);
                });
                objectProperty.propertyDetailValuesListItems = response.ListItems;
                for (var i = 0; i < objectProperty.propertyDetailsListItems.length; i++) {
                    for (var j = 0; j < objectProperty.propertyDetailValuesListItems.length; j++) {
                        if (objectProperty.propertyDetailsListItems[i].Id == objectProperty.propertyDetailValuesListItems[j].LinkPropertyDetailId) {
                            var jsonDefaultValue = null;
                            try {
                                jsonDefaultValue = JSON.parse(objectProperty.propertyDetailsListItems[i].JsonDefaultValue);
                            } catch (e) {
                                console.log(e);
                            }

                            if (objectProperty.propertyDetailValuesListItems[j].Value != null) {
                                if (jsonDefaultValue != undefined && jsonDefaultValue != null && jsonDefaultValue.nameValue != undefined && jsonDefaultValue.nameValue != null && 0 < jsonDefaultValue.nameValue.length) {
                                    if (jsonDefaultValue.multipleChoice) {   // Detail is CheckBox
                                        var multipleValues = objectProperty.propertyDetailValuesListItems[j].Value.split(',');
                                        setSelection(objectProperty.propertyDetailsListItems[i].Id, multipleValues);

                                    }
                                    else if (jsonDefaultValue.forceUse && jsonDefaultValue.nameValue.length > 0) {   // Detail is RadioButton/DropDown
                                        /*Do not delete this line: Load the value if the elements is RadioButton
                                        var radioValues = objectProperty.propertyDetailValuesListItems[j].Value.split(',');
                                        setSelection(objectProperty.propertyDetailsListItems[i].Id, radioValues); */
                                        objectProperty.propertyDetailsListItems[i].value = objectProperty.propertyDetailValuesListItems[j].Value;
                                    } else {     // Detail is InputDataList
                                        objectProperty.propertyDetailsListItems[i].value = objectProperty.propertyDetailValuesListItems[j].Value;
                                    }
                                } else {
                                    switch (objectProperty.propertyDetailsListItems[i].InputDataType) {
                                        case 0:                              // Detail is String
                                            objectProperty.propertyDetailsListItems[i].value = objectProperty.propertyDetailValuesListItems[j].Value;
                                            break;
                                        case 1:                              // Detail is Number
                                            objectProperty.propertyDetailsListItems[i].value = parseInt(objectProperty.propertyDetailValuesListItems[j].Value);
                                            break;
                                        case 2:                              // Detail is Boolean
                                            objectProperty.propertyDetailsListItems[i].value = (objectProperty.propertyDetailValuesListItems[j].Value === "true");
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

    //Replace Item OnDelete/OnEdit Grid Options
    objectProperty.replaceItem = function (oldId, newItem) {
        angular.forEach(objectProperty.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = objectProperty.ListItems.indexOf(item);
                objectProperty.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            objectProperty.ListItems.unshift(newItem);
    }

    objectProperty.searchData = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"objectPropertyType/getall", objectProperty.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            objectProperty.categoryBusyIndicator.isActive = false;
            objectProperty.ListItems = response.ListItems;
            objectProperty.gridOptions.fillData(objectProperty.ListItems);
            objectProperty.gridOptions.currentPageNumber = response.CurrentPageNumber;
            objectProperty.gridOptions.totalRowCount = response.TotalRowCount;
            objectProperty.gridOptions.rowPerPage = response.RowPerPage;
            objectProperty.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            objectProperty.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    objectProperty.addRequested = false;
    objectProperty.closeModal = function () {
        $modalStack.dismissAll();
    };

 // Filter Texts for CmsUser
    objectProperty.gridOptions.myfilterText = function (gridListItems, foreignKeyName, childListItems, childDesiredPropertyName, childItemColumnName) {
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


    function setSelection(detailId, values) {
        var checkboxName = "selection" + detailId.toString();
        objectProperty[checkboxName] = values;
    }
    //For reInit Categories
    objectProperty.gridOptions.reGetAll = function () {
        if (objectProperty.gridOptions.advancedSearchData.engine.Filters.length > 0) objectProperty.searchData();
        else objectProperty.init();
    };

    objectProperty.isCurrentNodeEmpty = function () {
        return !angular.equals({}, objectProperty.treeConfig.currentNode);
    }

    objectProperty.loadFileAndFolder = function (item) {
        objectProperty.treeConfig.currentNode = item;
        objectProperty.treeConfig.onNodeSelect(item);
    }
    objectProperty.addRequested = true;

    objectProperty.columnCheckbox = false;

    objectProperty.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = objectProperty.gridOptions.columns;
        if (objectProperty.gridOptions.columnCheckbox) {
            for (var i = 0; i < objectProperty.gridOptions.columns.length; i++) {
                //objectProperty.gridOptions.columns[i].visible = $("#" + objectProperty.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + objectProperty.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                objectProperty.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < objectProperty.gridOptions.columns.length; i++) {
                var element = $("#" + objectProperty.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + objectProperty.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < objectProperty.gridOptions.columns.length; i++) {
            console.log(objectProperty.gridOptions.columns[i].name.concat(".visible: "), objectProperty.gridOptions.columns[i].visible);
        }
        objectProperty.gridOptions.columnCheckbox = !objectProperty.gridOptions.columnCheckbox;
    }

    objectProperty.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }


    objectProperty.showUpload = function () { $("#fastUpload").fadeToggle(); }

    //---------------Upload Modal-------------------------------
    objectProperty.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/Moduleobject/objectPropertyType/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        objectProperty.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            objectProperty.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    objectProperty.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    objectProperty.whatcolor = function (progress) {
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

    objectProperty.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    objectProperty.replaceFile = function (name) {
        objectProperty.itemClicked(null, objectProperty.fileIdToDelete, "file");
        objectProperty.fileTypes = 1;
        objectProperty.fileIdToDelete = objectProperty.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", objectProperty.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                objectProperty.FileItem = response3.Item;
                                objectProperty.FileItem.FileName = name;
                                objectProperty.FileItem.Extension = name.split('.').pop();
                                objectProperty.FileItem.FileSrc = name;
                                objectProperty.FileItem.LinkCategoryId = objectProperty.thisCategory;
                                objectProperty.saveNewFile();
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
    objectProperty.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", objectProperty.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                objectProperty.FileItem = response.Item;
                objectProperty.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            objectProperty.showErrorIcon();
            return -1;
        });
    }

    objectProperty.showSuccessIcon = function () {
    }

    objectProperty.showErrorIcon = function () {
    }
    //file is exist
    objectProperty.fileIsExist = function (fileName) {
        for (var i = 0; i < objectProperty.FileList.length; i++) {
            if (objectProperty.FileList[i].FileName == fileName) {
                objectProperty.fileIdToDelete = objectProperty.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    objectProperty.getFileItem = function (id) {
        for (var i = 0; i < objectProperty.FileList.length; i++) {
            if (objectProperty.FileList[i].Id == id) {
                return objectProperty.FileList[i];
            }
        }
    }

    //select file or folder
    objectProperty.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            objectProperty.fileTypes = 1;
            objectProperty.selectedFileId = objectProperty.getFileItem(index).Id;
            objectProperty.selectedFileName = objectProperty.getFileItem(index).FileName;
        }
        else {
            objectProperty.fileTypes = 2;
            objectProperty.selectedCategoryId = objectProperty.getCategoryName(index).Id;
            objectProperty.selectedCategoryTitle = objectProperty.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        objectProperty.selectedIndex = index;

    };

    //upload file
    objectProperty.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (objectProperty.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ objectProperty.replaceFile(uploadFile.name);
                    objectProperty.itemClicked(null, objectProperty.fileIdToDelete, "file");
                    objectProperty.fileTypes = 1;
                    objectProperty.fileIdToDelete = objectProperty.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                objectProperty.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        objectProperty.FileItem = response2.Item;
                        objectProperty.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        objectProperty.filePickerMainImage.filename =
                          objectProperty.FileItem.FileName;
                        objectProperty.filePickerMainImage.fileId =
                          response2.Item.Id;
                        objectProperty.selectedItem.LinkMainImageId =
                          objectProperty.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      objectProperty.showErrorIcon();
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
                    objectProperty.FileItem = response.Item;
                    objectProperty.FileItem.FileName = uploadFile.name;
                    objectProperty.FileItem.uploadName = uploadFile.uploadName;
                    objectProperty.FileItem.Extension = uploadFile.name.split('.').pop();
                    objectProperty.FileItem.FileSrc = uploadFile.name;
                    objectProperty.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- objectProperty.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", objectProperty.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            objectProperty.FileItem = response.Item;
                            objectProperty.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            objectProperty.filePickerMainImage.filename = objectProperty.FileItem.FileName;
                            objectProperty.filePickerMainImage.fileId = response.Item.Id;
                            objectProperty.selectedItem.LinkMainImageId = objectProperty.filePickerMainImage.fileId;
                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        objectProperty.showErrorIcon();
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
    objectProperty.exportFile = function () {
        objectProperty.addRequested = true;
        objectProperty.gridOptions.advancedSearchData.engine.ExportFile = objectProperty.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'objectProperty/exportfile', objectProperty.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            objectProperty.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                objectProperty.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //objectProperty.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    objectProperty.toggleExportForm = function () {
        objectProperty.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        objectProperty.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        objectProperty.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        objectProperty.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        objectProperty.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/Moduleobject/objectProperty/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    objectProperty.rowCountChanged = function () {
        if (!angular.isDefined(objectProperty.ExportFileClass.RowCount) || objectProperty.ExportFileClass.RowCount > 5000)
            objectProperty.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    objectProperty.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"objectProperty/count", objectProperty.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            objectProperty.addRequested = false;
            rashaErManage.checkAction(response);
            objectProperty.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            objectProperty.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);