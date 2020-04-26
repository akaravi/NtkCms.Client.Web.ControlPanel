app.controller("memberPropertyController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$stateParams', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $stateParams, $filter) {
    var memberProperty = this;
    memberProperty.RouteUploadFileContent = cmsServerConfig.configRouteUploadFileContent;
    //For Grid Options

    if (itemRecordStatus != undefined) memberProperty.itemRecordStatus = itemRecordStatus;

memberProperty.selectedPublicConfig = {
        member: $stateParams.LinkmemberuserId
    };


    memberProperty.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    memberProperty.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
memberProperty.selectedItem = {};
memberProperty.showlistHistory=false
memberProperty.PropertyTypeId;
memberProperty.propertyTypeListItems = [];
memberProperty.selectedItemPropertyType = {};
memberProperty.selectedItemhistor={};
memberProperty.selectedItemLinkMemberUserId=false;
    // Many To Many
    // memberGroupGroup  جدول واسط
    // LinkmemberGroupId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    memberProperty.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها





   
    ajax.call(cmsServerConfig.configApiServerPath+"memberPropertyType/getall", {}, 'POST').success(function (response) {
        memberProperty.menueGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    memberProperty.hasInMany2Many = function (OtherTable) {
        if (memberProperty.selectedItem[thisTableFieldICollection] == undefined) return false;
        return objectFindByKey(memberProperty.selectedItem[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    };
    memberProperty.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (memberProperty.hasInMany2Many(OtherTable)) {
            //var index = memberProperty.selectedItem[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(memberProperty.selectedItem[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            memberProperty.selectedItem[thisTableFieldICollection].splice(index, 1);
        } else {
            memberProperty.selectedItem[thisTableFieldICollection].push(obj);
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
    memberProperty.LinkPropertyTypeIdSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkPropertyTypeId",
      url: "MemberPropertyType",
      sortColumn: "Id",
      sortType: 0,
      filterText: "Title",
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


 memberProperty.GeolocationConfig={
     latitude: 'Geolocationlatitude',
     longitude: 'Geolocationlongitude',
        onlocationChanged:memberProperty.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:memberProperty,
        useCurrentLocationZoom:12,
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

    //Service Grid Options
    memberProperty.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'FirstName', displayName: 'نام', sortable: true, type: 'string', visible: 'true' },
            { name: 'LastName', displayName: 'نام خانوادگی', sortable: true, type: 'string', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, visible: 'true' },
            { name: 'Description', displayName: 'توضیحات', sortable: true, visible: 'true', },
            { name: "ActionKey", displayName: 'لیست تاریخچه', displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="memberProperty.openPreviewHistory(x.Id,x.LinkPropertyTypeId)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
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
    memberProperty.gridOptionsHistory = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'علت مراجعه', sortable: true, type: 'string', visible: true },
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
        memberProperty.openAddPropertyinSiteModal= function () {
                memberProperty.addRequested=false;
                memberProperty.addRequestedAddUserInSite=true;
                memberProperty.selectedItemPropertyInSiteLinkMemberUserId="";
                memberProperty.selectedItemPropertyInSiteLinkMemberPropertyId="";
                memberProperty.selectedItemPropertyInSiteJoinId="";
                $modal.open({
                    templateUrl: 'cpanelv1/ModuleMember/MemberProperty/addPropertyinSite.html',
                    scope: $scope
                });
        }
        //#help بررسی عضو و JoinId
        memberProperty.CheckPropertyToSite= function (frm) { 
        if (frm.$invalid)
            return;
        memberProperty.addRequested=true;
        ajax.call(cmsServerConfig.configApiServerPath+"MemberProperty/GetOneByJoinId", {LinkMemberPropertyId:memberProperty.selectedItemPropertyInSiteLinkMemberPropertyId,LinkMemberUserId: memberProperty.selectedItemPropertyInSiteLinkMemberUserId,JoinId: memberProperty.selectedItemPropertyInSiteJoinId}, "POST").success(function (response) {
            if(response.IsSuccess)
            {
                memberProperty.selectedItemMemberInSite=response.Item;
                memberProperty.addRequestedAddUserInSite=false;
                memberProperty.addRequested=true;
            }
            rashaErManage.checkAction(response);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
        }

        //#help اتصال عضو به سایت
        memberProperty.addNewPropertyToSite= function () { 
        memberProperty.addRequestedAddUserInSite=true;
        ajax.call(cmsServerConfig.configApiServerPath+"memberPropertySite/AddeByJoinId",  {LinkMemberPropertyId:memberProperty.selectedItemPropertyInSiteLinkMemberPropertyId,LinkMemberUserId: memberProperty.selectedItemPropertyInSiteLinkMemberUserId,JoinId: memberProperty.selectedItemPropertyInSiteJoinId}, "POST").success(function (response) {
            if(response.IsSuccess)
            {
                memberProperty.selectedItemMemberInSiteJoinId="";
                memberProperty.selectedItemPropertyInSiteLinkMemberUserId="";
                memberProperty.selectedItemPropertyInSiteLinkMemberPropertyId="";
                memberProperty.ListItems.unshift(response.Item);
                memberProperty.gridOptions.fillData(memberProperty.ListItems);
                memberProperty.closeModal();
                memberProperty.addRequested=false;
            }
            rashaErManage.checkAction(response);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberProperty.addRequested=false;
            memberProperty.addRequestedAddUserInSite=true;
        });
        }


///#help

// Open Add Modal History
    memberProperty.openAddModalHistory = function () {
 if (buttonIsPressed) return;
        memberProperty.onPropertyTypeChange(memberProperty.PropertyTypeId,true);
        memberProperty.addRequested = false;
        memberProperty.modalTitle = 'اضافه';
        //Clear file pickers
        memberProperty.attachedFiles = [];
        memberProperty.attachedFile = "";
        memberProperty.filePickerMainImage.filename = "";
        memberProperty.filePickerMainImage.fileId = null;
        memberProperty.filePickerFiles.filename = "";
        memberProperty.filePickerFiles.fileId = null;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MemberHistory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            //memberProperty.busyIndicator.isActive = false;
            memberProperty.selectedItemhistory = response.Item;
            memberProperty.selectedItemhistory.LinkPropertyTypeId = memberProperty.listHistorysSelectedLinkPropertyTypeId;
            memberProperty.onPropertyTypeChange(memberProperty.selectedItemhistory.LinkPropertyTypeId , true);
            $modal.open({
                templateUrl: 'cpanelv1/Modulemember/memberProperty/addhistory.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            //memberProperty.busyIndicator.isActive = false;
        });        

    }
//  Add History
 memberProperty.addNewContenthistory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
       /* if (memberProperty.selectedItemhistory.LinkPropertyId ==null) {
            rashaErManage.showMessage("لطفا Property را مشخص کنید");
            return;
        }*/
        //memberProperty.busyIndicator.isActive = true;
        //memberProperty.addRequested = true;
        memberProperty.selectedItemhistory.LinkPropertyId=memberProperty.PropertyID;
        //memberProperty.listHistorysSelectedLinkPropertyTypeId
        ajax.call(cmsServerConfig.configApiServerPath+'MemberHistory/add', memberProperty.selectedItemhistory, 'POST').success(function (response) {
            //memberProperty.addRequested = false;
            //memberProperty.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                memberProperty.listHistorys.unshift(response.Item);
                memberProperty.gridOptionsHistory.fillData(memberProperty.listHistorys);
                memberProperty.closeModal();
//#helper  اضافه کردن مقادیر
        var valueItem = {};
        memberProperty.valueItems = [];
        ajax.call(cmsServerConfig.configApiServerPath+"memberpropertydetailvalue/GetViewModel", "0", 'GET').success(function (response1) {
                    rashaErManage.checkAction(response1);
                    memberProperty.LinkHistoryId=response.Item.Id;
                    for (var i = 0; i < memberProperty.propertyDetailsListItems.length; i++) {
                        valueItem = $.extend(true, {}, response1.Item);
                        valueItem.LinkPropertyDetailId = memberProperty.propertyDetailsListItems[i].Id;
                        valueItem.LinkPropertyId = memberProperty.PropertyID;
                        valueItem.LinkHistoryId = memberProperty.LinkHistoryId;
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
                            memberProperty.listHistorys.unshift(response.Item);
                            memberProperty.gridOptionsHistory.fillData(memberProperty.listHistorys);
                            memberProperty.gridOptionsHistory.myfilterText(memberProperty.listHistorys, "LinkCmsUserId", memberProperty.cmsUsersListItems, "Username", "LinkCmsUserUsername");
                            memberProperty.gridOptionsHistory.myfilterText(memberProperty.listHistorys, "LinkPropertyTypeId", memberProperty.propertyTypeListItems, "Title", "LinkPropertyTypeTitle");
                            memberProperty.addRequested = false;
                            //memberProperty.busyIndicator.isActive = false;
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
//#helper  اضافه کردن مقادیر



            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberProperty.busyIndicator.isActive = false;
            memberProperty.addRequested = false;
        });

    }
// Open Edit Modal History
    memberProperty.openEditModelHistory = function () {
        
        //if (buttonIsPressed) { return };
        memberProperty.addRequested = false;
        memberProperty.modalTitle = 'ویرایش';
        memberProperty.onPropertyTypeChange(memberProperty.listHistorysSelectedLinkPropertyTypeId , true);
        if (!memberProperty.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }
        memberProperty.categoryBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MemberHistory/GetOne', memberProperty.gridOptionsHistory.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            memberProperty.categoryBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            memberProperty.selectedItemhistory = response.Item;
            memberProperty.selectedItemhistoryId = response.Item.Id;
            //#help
                memberProperty.loadDetailValues(memberProperty.listHistorysSelectedLinkPropertyTypeId, memberProperty.PropertyID, true);
            //#help
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMember/memberProperty/edithistory.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
//  Edit History
 memberProperty.editNewContenthistory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        //memberProperty.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MemberHistory/edit', memberProperty.selectedItemhistory, 'PUT').success(function (response) {
            //memberProperty.addRequested = true;
            rashaErManage.checkAction(response);
            //memberProperty.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                //memberProperty.addRequested = false;
                memberProperty.replaceItem(memberProperty.selectedItemhistory.Id, response.Item);
                memberProperty.gridOptionsHistory.fillData(memberProperty.listHistorys);
                memberProperty.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            //memberProperty.addRequested = false;
        });
    }
// Delete History
 memberProperty.deleteContentHistory = function () {
        if (!memberProperty.gridOptionsHistory.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                //memberProperty.busyIndicator.isActive = true;
                console.log(memberProperty.gridOptionsHistory.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'MemberHistory/GetOne', memberProperty.gridOptionsHistory.selectedRow.item.Id, 'GET').success(function (response) {
                    memberProperty.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'MemberHistory/delete', memberProperty.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        //memberProperty.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            memberProperty.replaceItem(memberProperty.selectedItemForDelete.Id);
                            memberProperty.gridOptionsHistory.fillData(memberProperty.selectedItemhistory);
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



memberProperty.listHistorysSelectedLinkPropertyTypeId=0;
memberProperty.openPreviewHistory = function (PropertyId,LinkPropertyTypeId) {
var engine2 = {};
        engine2.Filters = [];
         var d = {
                    PropertyName: "LinkPropertyId",
                    IntValue1: PropertyId,
                    ClauseType:1,
                    SearchType: 0
                }
                engine2.Filters.push(d);
memberProperty.PropertyID=PropertyId;
 ajax.call(cmsServerConfig.configApiServerPath+"MemberHistory/getall",engine2, 'POST').success(function (response1) {
            memberProperty.showlistHistory=true;
            memberProperty.listHistorys = response1.ListItems;
            memberProperty.listHistorysSelectedLinkPropertyTypeId = LinkPropertyTypeId;
            rashaErManage.checkAction(response1);
            memberProperty.gridOptionsHistory.fillData(memberProperty.listHistorys, response1.resultAccess);
            memberProperty.gridOptionsHistory.currentPageNumber = response1.CurrentPageNumber;
            memberProperty.gridOptionsHistory.totalRowCount = response1.TotalRowCount;
            memberProperty.gridOptionsHistory.RowPerPage = response1.RowPerPage;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
}



    //For Show Category Loading Indicator
    memberProperty.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show Service Loading Indicator
    memberProperty.categoryBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    memberProperty.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    memberProperty.addMenu = function () {
        $modal.open({
            templateUrl: "cpanelv1/ModuleMember/memberPropertyType/modalMenu.html",
            scope: $scope
        });
    }
    //#help//download file
    memberProperty.downloadFile = function (Id, FileName) {
        var DownloadModel = {
            id: null,
            name: null
        };

            DownloadModel.id = Id;
            DownloadModel.name = FileName;

        window.open(cmsServerConfig.configPathFileByIdAndName + DownloadModel.id + '/' + DownloadModel.name, '_blank', '');
    }
    //#help//

    //open addMenu modal
    memberProperty.showlistfile = function (sItem) {
        var s = {
            PropertyName: "LinkModuleMemberId",
            IntValue1: sItem.Id,
            SearchType: 0
        }
        var engine = {};
        engine.Filters = [];
        engine.Filters.push(s);
     
       
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/getall", engine, "POST").success(function (response) {
            memberProperty.listComments = response.ListItems;
            rashaErManage.checkAction(response);
            memberProperty.gridOptionsfile.fillData(memberProperty.listComments, response.resultAccess);
            memberProperty.gridOptionsfile.currentPageNumber = response.CurrentPageNumber;
            memberProperty.gridOptionsfile.totalRowCount = response.TotalRowCount;
            memberProperty.gridOptionsfile.RowPerPage = response.RowPerPage;
            memberProperty.showGridComment = true;
            memberProperty.Title = memberProperty.gridOptions.selectedRow.item.Title;
        });
        $('html, body').animate({
            scrollTop: $("#showlistfile").offset().top
        }, 850);
    }
   
    memberProperty.treeConfig.currentNode = {};

    memberProperty.treeBusyIndicator = false;

    memberProperty.addRequested = false;

    //init Function
    memberProperty.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"memberGroup/getall", {}, 'POST').success(function (response) {
                memberProperty.selectedItemPropertyType = response.ListItems;    


                      ///////////////////////////////////////////////////////////////
    if (memberProperty.selectedPublicConfig.member!= null || memberProperty.selectedPublicConfig.member != undefined)
    {
            
            MemberUserId=memberProperty.selectedPublicConfig.member.Id;
            memberProperty.selectedItemLinkMemberUserId=true;
            var engine = {};
            engine.Filters = [];

            //#help# گرفتن دسته بندی ها
             angular.forEach(memberProperty.selectedPublicConfig.member.MemberUserGroup, function (item, key) {

                   
            //#help# گرفتن اطلاعات شامل از دسته بندی ها
            angular.forEach(memberProperty.selectedItemPropertyType, function (itemG, key) {
            if(itemG.Id==item.MemberGroup_Id &&  itemG.LinkPropertyTypeId!=undefined && itemG.LinkPropertyTypeId!=null)
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
                    ajax.call(cmsServerConfig.configApiServerPath+"memberPropertyType/getall", engine, 'POST').success(function (response) {
                        memberProperty.treeConfig.Items = response.ListItems;
                        memberProperty.gridOptions.resultAccessGroup = response.resultAccess;
                        memberProperty.propertyTypeListItems = response.ListItems;
                        memberProperty.categoryBusyIndicator.isActive = false;
                    }).error(function (data, errCode, c, d) {
                        console.log(data);
                    });
             }
             memberProperty.selectedItem.LinkMemberUserId=memberProperty.selectedPublicConfig.member.Id;
            var engine = {};
            engine.Filters = [];

            var s = {
                        PropertyName: "LinkMemberUserId",
                        IntValue1: memberProperty.selectedPublicConfig.member.Id,
                        ClauseType:1,
                        SearchType: 0
                    }
                
        engine.Filters.push(s);

        ajax.call(cmsServerConfig.configApiServerPath+"MemberProperty/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            angular.forEach(response.ListItems.virtual_PropertyDetailValue, function (itemV, key) {
                if(itemV.PropertyDetail.IsHistoryable!=false)
                    { 
                            memberProperty.ListItems=response.ListItems;
                    }
            });
            memberProperty.ListItems = response.ListItems;
            memberProperty.gridOptions.fillData(memberProperty.ListItems, response.resultAccess); // Sending Access as an argument
            memberProperty.allowedSearch = response.AllowedSearchField;
            memberProperty.gridOptions.currentPageNumber = response.CurrentPageNumber;
            memberProperty.gridOptions.totalRowCount = response.TotalRowCount;
            memberProperty.gridOptions.rowPerPage = response.RowPerPage;
            memberProperty.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            memberProperty.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });

        }
        else
        {
            ajax.call(cmsServerConfig.configApiServerPath+"memberPropertyType/getall", {}, 'POST').success(function (response) {
                memberProperty.treeConfig.Items = response.ListItems;
                memberProperty.gridOptions.resultAccessGroup = response.resultAccess;
                memberProperty.propertyTypeListItems = response.ListItems;
                memberProperty.categoryBusyIndicator.isActive = false;
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
        memberProperty.categoryBusyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+"MemberProperty/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            angular.forEach(response.ListItems.virtual_PropertyDetailValue, function (itemV, key) {
                if(itemV.PropertyDetail.IsHistoryable!=false)
                    { 
                            memberProperty.ListItems=response.ListItems;
                    }
            });
            memberProperty.ListItems = response.ListItems;
            memberProperty.gridOptions.fillData(memberProperty.ListItems, response.resultAccess); // Sending Access as an argument
            memberProperty.allowedSearch = response.AllowedSearchField;
            memberProperty.gridOptions.currentPageNumber = response.CurrentPageNumber;
            memberProperty.gridOptions.totalRowCount = response.TotalRowCount;
            memberProperty.gridOptions.rowPerPage = response.RowPerPage;
            memberProperty.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            memberProperty.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });

        }
////////////////////////////////////////////////////////////////


    }).error(function (data, errCode, c, d) {
        console.log(data);
    });





        ajax.call(cmsServerConfig.configApiServerPath+"CoreLocation/GetAllProvinces", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            memberProperty.provinceCmsLocatinoListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            memberProperty.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });



    };


        memberProperty.getAllPropertyType = function (sItem)
        {
            MemberUserId=sItem.Id;
            var engine = {};
            engine.Filters = [];

            //#help# گرفتن دسته بندی ها
             angular.forEach(sItem.MemberUserGroup, function (item, key) {
      
            //#help# گرفتن اطلاعات شامل از دسته بندی ها
            angular.forEach(memberGroup.treeConfig.Items, function (itemG, key) {
            if(itemG.Id==item.MemberGroup_Id &&  itemG.LinkPropertyTypeId!=undefined && itemG.LinkPropertyTypeId!=null)
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
                    ajax.call(cmsServerConfig.configApiServerPath+"memberPropertyType/getall", engine, 'POST').success(function (response) {
                        memberProperty.treeConfig.Items = response.ListItems;
                        memberProperty.gridOptions.resultAccessGroup = response.resultAccess;
                        memberProperty.propertyTypeListItems = response.ListItems;
                        memberProperty.categoryBusyIndicator.isActive = false;
                    }).error(function (data, errCode, c, d) {
                        console.log(data);
                    });


                   
             }
        }




    memberProperty.gridOptions.onRowSelected = function () {
        var item = memberProperty.gridOptions.selectedRow.item;
    }

    // Open Add Category Modal 
    /*memberProperty.addNewCategoryModel = function () {
        if (buttonIsPressed) return;
        memberProperty.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyType/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            memberProperty.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMember/memberPropertyType/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }*/
    // Open Edit Category Modal
   /* memberProperty.openEditCategoryModel = function () {
        if (buttonIsPressed) { return };
        memberProperty.addRequested = false;
        memberProperty.modalTitle = 'ویرایش';
        if (!memberProperty.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }
        memberProperty.categoryBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyType/GetOne', memberProperty.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            memberProperty.categoryBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            memberProperty.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMember/memberPropertyType/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }*/

    // Add New Category
    /*memberProperty.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        memberProperty.categoryBusyIndicator.isActive = true;
        memberProperty.addRequested = true;
        memberProperty.selectedItem.LinkParentId = null;
        if (memberProperty.treeConfig.currentNode != null)
            memberProperty.selectedItem.LinkParentId = memberProperty.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyType/add', memberProperty.selectedItem, 'POST').success(function (response) {
            memberProperty.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                memberProperty.gridOptions.advancedSearchData.engine.Filters = null;
                memberProperty.gridOptions.advancedSearchData.engine.Filters = [];
                memberProperty.gridOptions.reGetAll();
                memberProperty.closeModal();
            }
            memberProperty.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberProperty.addRequested = false;
            memberProperty.categoryBusyIndicator.isActive = false;
        });
    }*/

    //Edit Group REST Api
    /*memberProperty.editCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        memberProperty.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyType/edit', memberProperty.selectedItem, 'PUT').success(function (response) {
            memberProperty.addRequested = true;
            //memberProperty.showbusy = false;
            memberProperty.treeConfig.showbusy = false;
            memberProperty.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                memberProperty.addRequested = false;
                memberProperty.treeConfig.currentNode.Title = response.Item.Title;
                memberProperty.closeModal();
            }
            memberProperty.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberProperty.addRequested = false;
            memberProperty.categoryBusyIndicator.isActive = false;

        });
    }*/

    // Delete a Group
    /*memberProperty.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = memberProperty.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                memberProperty.categoryBusyIndicator.isActive = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyType/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    memberProperty.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyType/delete', memberProperty.selectedItemForDelete, 'POST').success(function (res) {
                        if (res.IsSuccess) {
                            memberProperty.gridOptions.advancedSearchData.engine.Filters = null;
                            memberProperty.gridOptions.advancedSearchData.engine.Filters = [];
                            memberProperty.gridOptions.fillData();
                            memberProperty.categoryBusyIndicator.isActive = false;
                            memberProperty.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        memberProperty.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    memberProperty.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }
*/
    //Tree: On Node Select Options
    memberProperty.treeConfig.onNodeSelect = function () {
        var node = memberProperty.treeConfig.currentNode;
        //memberProperty.selectedItem.LinkCategoryId = node.Id;
        if(node != null)
        {
            memberProperty.PropertyTypeId = node.Id;
        }
        memberProperty.selectContent(node);

    };
    //Show Content with Category Id
    memberProperty.selectContent = function (node) {
        memberProperty.gridOptions.advancedSearchData.engine.Filters = null;
        memberProperty.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            memberProperty.categoryBusyIndicator.message = "در حال بارگذاری اعضای " + node.Title;
            memberProperty.categoryBusyIndicator.isActive = true;
            memberProperty.attachedFiles = [];
            var s = {
                PropertyName: "LinkPropertyTypeId",
                IntValue1: node.Id,
                ClauseType:2,
                SearchType: 0
            }
            memberProperty.gridOptions.advancedSearchData.engine.Filters.push(s);
            if (memberProperty.selectedPublicConfig.member!= null || memberProperty.selectedPublicConfig.member != undefined)
            {
                var d = {
                            PropertyName: "LinkMemberUserId",
                            IntValue1: memberProperty.selectedPublicConfig.member.Id,
                            ClauseType:2,
                            SearchType: 0
                        }
                
            memberProperty.gridOptions.advancedSearchData.engine.Filters.push(d);
            }
        }
            ajax.call(cmsServerConfig.configApiServerPath+"memberProperty/getAll", memberProperty.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
                memberProperty.categoryBusyIndicator.isActive = false;
                memberProperty.ListItems = response.ListItems;
                memberProperty.gridOptions.fillData(memberProperty.ListItems); // Sending Access as an argument
                memberProperty.gridOptions.currentPageNumber = response.CurrentPageNumber;
                memberProperty.gridOptions.totalRowCount = response.TotalRowCount;
                memberProperty.gridOptions.rowPerPage = response.RowPerPage;
                memberProperty.gridOptions.maxSize = 5;
            }).error(function (data, errCode, c, d) {
                memberProperty.gridOptions.fillData();
                rashaErManage.checkAction(data, errCode);
            });

    
    };

      // Open Add Modal
    memberProperty.openAddModal = function () {
        if (buttonIsPressed) return;
        memberProperty.onPropertyTypeChange(memberProperty.PropertyTypeId,false);
        memberProperty.addRequested = false;
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
            //memberProperty.busyIndicator.isActive = false;
            memberProperty.selectedItem = response.Item;
            if (memberProperty.selectedPublicConfig.member!= null || memberProperty.selectedPublicConfig.member != undefined)
            {
                memberProperty.selectedItem.LinkMemberUserId = memberProperty.selectedPublicConfig.member.Id;
                memberProperty.selectedItemLinkMemberUserId=true;
            }
            memberProperty.selectedItem.LinkPropertyTypeId = memberProperty.PropertyTypeId;
            memberProperty.onPropertyTypeChange(memberProperty.selectedItem.LinkPropertyTypeId , false);
            $modal.open({
                templateUrl: 'cpanelv1/Modulemember/memberProperty/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            //memberProperty.busyIndicator.isActive = false;
        });
    }

    // Add New Content
    memberProperty.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        /*if (memberProperty.requiredPropertyIsEmpty(memberProperty.selectedItem)) {
            rashaErManage("مقادیر الزامی را وارد کنید!");
            return;
        }*/
        //memberProperty.busyIndicator.isActive = true;
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
                            //memberProperty.gridOptions.myfilterText(memberProperty.ListItems, "LinkCmsUserId", memberProperty.cmsUsersListItems, "Username", "LinkCmsUserUsername");
                            memberProperty.gridOptions.myfilterText(memberProperty.ListItems, "LinkPropertyTypeId", memberProperty.propertyTypeListItems, "Title", "LinkPropertyTypeTitle");
                            memberProperty.addRequested = false;
                            //memberProperty.busyIndicator.isActive = false;
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
        memberProperty.onPropertyTypeChange(memberProperty.gridOptions.selectedRow.item.LinkPropertyTypeId , false);
        //Clear file pickers

        memberProperty.addRequested = false;
        memberProperty.attachedFiles = [];
        memberProperty.attachedFile = "";
        memberProperty.filePickerMainImage.filename = "";
        memberProperty.filePickerMainImage.fileId = null;
        memberProperty.filePickerFiles.filename = "";
        memberProperty.filePickerFiles.fileId = null;
        memberProperty.modalTitle = 'ویرایش';
        if (!memberProperty.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'memberproperty/GetOne', parseInt(memberProperty.gridOptions.selectedRow.item.Id), 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            memberProperty.selectedItem = response.Item;
            memberProperty.oldLinkPropertyTypeId = memberProperty.selectedItem.LinkPropertyTypeId;
            memberProperty.loadDetailValues(memberProperty.selectedItem.LinkPropertyTypeId, memberProperty.selectedItem.Id, false);
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
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        // Edit Property: Title, Description, LinkPropertyTypeId
        //memberProperty.busyIndicator.isActive = true;
        memberProperty.selectedItem.LinkExtraImageIds = stringfyLinkFileIds(memberProperty.attachedFiles);
        ajax.call(cmsServerConfig.configApiServerPath+'memberproperty/edit', memberProperty.selectedItem, 'PUT').success(function (response) {
            memberProperty.addRequested = true;
            rashaErManage.checkAction(response);
            //memberProperty.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                memberProperty.addRequested = false;
                memberProperty.replaceItem(memberProperty.selectedItem.Id, response.Item);
                memberProperty.gridOptions.fillData(memberProperty.ListItems);
                //memberProperty.gridOptions.myfilterText(memberProperty.ListItems, "LinkCmsUserId", memberProperty.cmsUsersListItems, "Username", "LinkCmsUserUsername");
                memberProperty.gridOptions.myfilterText(memberProperty.ListItems, "LinkPropertyTypeId", memberProperty.propertyTypeListItems, "Title", "LinkPropertyTypeTitle");
                memberProperty.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberProperty.addRequested = false;
            //memberProperty.busyIndicator.isActive = false;
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
                //memberProperty.busyIndicator.isActive = false;

            });
            ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyDetailValue/AddBatch', memberProperty.selectedItem.LinkPropertyId, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                console.log(response.Item);
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                //memberProperty.busyIndicator.isActive = false;

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
                            memberProperty.propertyDetailValuesListItems[j].Value = memberProperty[checkboxName];
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
                        memberProperty.propertyDetailValuesListItems.push({ Id: 0, LinkPropertyId: memberProperty.selectedItem.Id, LinkPropertyDetailId: memberProperty.propertyDetailsListItems[i].Id, Value: memberProperty[checkboxName] });
                    }
                }
            }
            // ---------------------------------- End of Set Values to Edit --------------------------------------
            memberProperty.addRequested = true;
            ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyDetailValue/EditBatch', memberProperty.propertyDetailValuesListItems, 'PUT').success(function (response) {
                rashaErManage.checkAction(response);
                //memberProperty.busyIndicator.isActive = false;
                if (response.IsSuccess) {
                    memberProperty.addRequested = false;
                    memberProperty.closeModal();
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                memberProperty.addRequested = false;
                //memberProperty.busyIndicator.isActive = false;
            });
        }
    }


 memberProperty.onPropertyTypeChange = function (propertyTypeId , historyable) {
        memberProperty.propertyDetailsListItems = []; //Clear out the array from previous values
        memberProperty.propertyDetailGroupListItems = []; //Clear out the array from previous values
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




   memberProperty.deleteContent = function () {
        if (buttonIsPressed) return;

        if (!memberProperty.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                //memberProperty.busyIndicator.isActive = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'memberproperty/GetOne', memberProperty.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    memberProperty.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'memberproperty/delete', memberProperty.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        //memberProperty.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            memberProperty.replaceItem(memberProperty.selectedItemForDelete.Id);
                            memberProperty.gridOptions.fillData(memberProperty.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        //memberProperty.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    //memberProperty.busyIndicator.isActive = false;
                });
            }
        });
    }



  //-----------------*** Load Values in Edit Modal ***----------------------
    memberProperty.loadDetailValues = function (propertyTypeId, propertyId,historyable) {
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
        ajax.call(cmsServerConfig.configApiServerPath+"memberPropertyDetail/GetAll", engine, 'POST').success(function (response1) {
            memberProperty.propertyDetailsListItems = response1.ListItems;
            //---------- Load Values ---------------------------------------
            var filterValue2 = {
                PropertyName: "LinkPropertyId",
                IntValue1: parseInt(propertyId),
                SearchType: 0
            }
            if (memberProperty.selectedItemhistoryId!=null && memberProperty.selectedItemhistoryId >0)
            {
            var filterValue2 = {
                            PropertyName: "LinkHistoryId",
                            IntValue1: parseInt(memberProperty.selectedItemhistoryId),
                            SearchType: 0
                        }

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


    function setSelection(detailId, values) {
        var checkboxName = "selection" + detailId.toString();
        memberProperty[checkboxName] = values;
    }
    //Replace Item OnDelete/OnEdit Grid Options
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

    memberProperty.searchData = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"memberPropertyType/getall", memberProperty.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            memberProperty.categoryBusyIndicator.isActive = false;
            memberProperty.ListItems = response.ListItems;
            memberProperty.gridOptions.fillData(memberProperty.ListItems);
            memberProperty.gridOptions.currentPageNumber = response.CurrentPageNumber;
            memberProperty.gridOptions.totalRowCount = response.TotalRowCount;
            memberProperty.gridOptions.rowPerPage = response.RowPerPage;
            memberProperty.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            memberProperty.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    memberProperty.addRequested = false;
    memberProperty.closeModal = function () {
        $modalStack.dismissAll();
    };


    //For reInit Categories
    memberProperty.gridOptions.reGetAll = function () {
        if (memberProperty.gridOptions.advancedSearchData.engine.Filters.length > 0) memberProperty.searchData();
        else memberProperty.init();
    };

    memberProperty.isCurrentNodeEmpty = function () {
        return !angular.equals({}, memberProperty.treeConfig.currentNode);
    }

    memberProperty.loadFileAndFolder = function (item) {
        memberProperty.treeConfig.currentNode = item;
        memberProperty.treeConfig.onNodeSelect(item);
    }
    memberProperty.addRequested = true;

    memberProperty.columnCheckbox = false;

    memberProperty.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = memberProperty.gridOptions.columns;
        if (memberProperty.gridOptions.columnCheckbox) {
            for (var i = 0; i < memberProperty.gridOptions.columns.length; i++) {
                //memberProperty.gridOptions.columns[i].visible = $("#" + memberProperty.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + memberProperty.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                memberProperty.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < memberProperty.gridOptions.columns.length; i++) {
                var element = $("#" + memberProperty.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + memberProperty.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < memberProperty.gridOptions.columns.length; i++) {
            console.log(memberProperty.gridOptions.columns[i].name.concat(".visible: "), memberProperty.gridOptions.columns[i].visible);
        }
        memberProperty.gridOptions.columnCheckbox = !memberProperty.gridOptions.columnCheckbox;
    }

    memberProperty.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }


    memberProperty.showUpload = function () { $("#fastUpload").fadeToggle(); }

    //---------------Upload Modal-------------------------------
    memberProperty.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleMember/memberPropertyType/upload_modal.html',
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
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        memberProperty.selectedIndex = index;

    };

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
                            memberProperty.selectedItem.LinkMainImageId = memberProperty.filePickerMainImage.fileId;
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
        ajax.call(cmsServerConfig.configApiServerPath+'MemberProperty/exportfile', memberProperty.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
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
            templateUrl: 'cpanelv1/ModuleMember/MemberProperty/report.html',
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
        ajax.call(cmsServerConfig.configApiServerPath+"MemberProperty/count", memberProperty.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            memberProperty.addRequested = false;
            rashaErManage.checkAction(response);
            memberProperty.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            memberProperty.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);