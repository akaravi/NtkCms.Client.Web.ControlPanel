app.controller("memberUserController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $state, $filter) {
    var memberUser = this;
    var PropertyTypeLink=0;
    //For Grid Options

    if (itemRecordStatus != undefined) memberUser.itemRecordStatus = itemRecordStatus;

    memberUser.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    memberUser.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    
memberUser.selectedItem = {};
//memberUser.selectedItemhistory = {};
memberUser.selectedItemMemberInSite = {};
    // Many To Many
    // memberGroupGroup  جدول واسط
    // LinkmemberGroupId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    memberUser.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها


    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        memberUser.menueGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    memberUser.hasInMany2Many = function (OtherTable) {
        if (memberUser.selectedItem[thisTableFieldICollection] == undefined) return false;
        return objectFindByKey(memberUser.selectedItem[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    };
    memberUser.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (memberUser.hasInMany2Many(OtherTable)) {
            //var index = memberUser.selectedItem[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(memberUser.selectedItem[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            memberUser.selectedItem[thisTableFieldICollection].splice(index, 1);
        } else {
            memberUser.selectedItem[thisTableFieldICollection].push(obj);
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


 //#help/ سلکتور  عضو 
    memberUser.LinkMemberUserIdSelector = {
      displayMember: "FirstName",
      id: "Id",
      fId: "LinkMemberUserId",
      url: "MemberUser",
      sortColumn: "Id",
      sortType: 0,
      filterText: "FirstName",
      showAddDialog: false,
      rowPerPage: 200,
      scope: memberUser,
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
          },
          {
            name: "JoinId",
            displayName: "JoinId",
            sortable: true,
            type: "string"
          }
        ]
      }
    };


 //#help/ سلکتور نوع عضو 
    memberUser.LinkPropertyTypeIdSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkPropertyTypeId",
      url: "MemberPropertyType",
      sortColumn: "Id",
      sortType: 0,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: memberUser,
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

    var s = {
        PropertyName: "LinkPropertyTypeId",
        IntValue1: 2,
        SearchType: 0
    }
    var engineproperty = {};
    engineproperty.Filters = [];
    engineproperty.Filters.push(s);
 //#help/ سلکتور Prpperty 
    memberUser.LinkPropertyIdSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkPropertyId",
      url: "MemberProperty",
      sortColumn: "Id",
      sortType: 0,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: memberUser,
      defaultFilter:engineproperty,
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

    //Service Grid Options
    memberUser.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'FirstName', displayName: 'نام', sortable: true, type: 'string', visible: 'true' },
            { name: 'LastName', displayName: 'نام خانوادگی', sortable: true, type: 'string', visible: 'true' },
            { name: 'MobileNo', displayName: 'شماره همراه', sortable: true, visible: 'true' },
            { name: 'OfficeNo', displayName: 'شماره دفترکار', sortable: true, visible: 'true', },
            { name: "ActionKey", displayName: 'عملیات', displayForce: true, template:'<li ng-if="!x.IsActivated" class="dropdown" dropdown="" style="display: initial;"><a aria-expanded="false" aria-haspopup="true" class="dropdown-toggle count-info" href="" dropdown-toggle=""><i class="fa fa-cog" ></i></a><ul class="dropdown-menu animated fadeInLeft m-t-xs" style="right: -142px;"><li><a ng-click="memberUser.showlistfile(x)" style="color:black">Listfile</a></li><li><a ng-click="memberUser.goToPrivateConfig(x)" style="color:black">PropertyList</a></li></ul></li>' }
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


 memberUser.goToPrivateConfig = function (selectedId) {
        $state.go("index.memberproperty", { memberuserId: selectedId });
    }

    //file Grid Options
    memberUser.gridOptionsfile = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkCategoryId', displayName: 'کد سیستمی پوشه', sortable: true, type: 'string', visible: true },
            { name: 'FileName', displayName: 'نام فایل', sortable: true, type: 'string', visible: true },
            { name: 'Extension', displayName: 'پسوند', sortable: true, type: 'string', visible: true },
            { name: 'FileSize', displayName: 'اندازه فایل', sortable: true, type: 'string', visible: true },
            { name: 'FileSrc', displayName: 'FileSrc', sortable: true, type: 'integer', visible: true },
            { name: "ActionKey", displayName: 'دانلود فایل ها', displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="memberUser.downloadFile(x.Id,x.FileName)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
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
 
memberUser.onPropertyTypeChange = function (propertyTypeId) {
        memberUser.propertyDetailsListItems = []; //Clear out the array from previous values
        memberUser.propertyDetailGroupListItems = []; //Clear out the array from previous values
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
            memberUser.propertyDetailsListItems = response.ListItems;
            $.each(memberUser.propertyDetailsListItems, function (index, item) {
               if(item.IsHistoryable==true)
                {
                    item.value = null;
                    // Add groups to its list
                    var result = $.grep(memberUser.propertyDetailGroupListItems, function (e) { return e.Id == item.virtual_PropertyDetailGroup.Id; });
                    if (result.length <= 0)
                        memberUser.propertyDetailGroupListItems.push(item.virtual_PropertyDetailGroup);
               
                    // Add DefaultValue to the object
                 
                    item.DefaultValue = JSON.parse(item.JsonDefaultValue);
                }
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
// Open Add Modal property
    memberUser.openAddPropertyModal = function (PropertyTypeId,UserId) {
        
        if (buttonIsPressed) return;
        memberUser.onPropertyTypeChange(PropertyTypeId);
        memberUser.modalTitle = 'اضافه';
        //Clear file pickers
        memberUser.attachedFiles = [];
        memberUser.attachedFile = "";
        memberUser.filePickerMainImage.filename = "";
        memberUser.filePickerMainImage.fileId = null;
        memberUser.filePickerFiles.filename = "";
        memberUser.filePickerFiles.fileId = null;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'memberproperty/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            //memberUser.busyIndicator.isActive = false;
            memberUser.selectedItemValue = response.Item;
            memberUser.selectedItemValue.LinkPropertyTypeId = PropertyTypeId;
            memberUser.selectedItemValue.LinkMemberUserId = UserId;
            $modal.open({
                templateUrl: 'cpanelv1/Modulemember/MemberUser/addValue.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberUser.busyIndicator.isActive = false;
        });
    }


// Open Add Modal History
   /* memberUser.openAddModalHistory = function () {
        
      //if (buttonIsPressed) return;
        memberUser.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MemberHistory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            memberUser.selectedItemhistory = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMember/MemberUser/addhistory.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }*/
//  Add History
/* memberUser.addNewContenthistory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
       /* if (memberUser.selectedItemhistory.LinkPropertyId ==null) {
            rashaErManage.showMessage("لطفا Property را مشخص کنید");
            return;
        }
        //memberUser.busyIndicator.isActive = true;
        //memberUser.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MemberHistory/add', memberUser.selectedItemhistory, 'POST').success(function (response) {
            //memberUser.addRequested = false;
            //memberUser.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                memberUser.listHistorys.unshift(response.Item);
                memberUser.gridOptionsHistory.fillData(memberUser.listHistorys);
                memberUser.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberUser.busyIndicator.isActive = false;
            memberUser.addRequested = false;
        });
    }*/
// Open Edit Modal History
   /* memberUser.openEditModelHistory = function () {
        
        //if (buttonIsPressed) { return };
        memberUser.addRequested = false;
        memberUser.modalTitle = 'ویرایش';
        if (!memberUser.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }
        memberUser.categoryBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MemberHistory/GetOne', memberUser.gridOptionsHistory.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            memberUser.categoryBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            memberUser.selectedItemhistory = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMember/MemberUser/edithistory.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }*/
//  Edit History
/* memberUser.editNewContenthistory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        //memberUser.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MemberHistory/edit', memberUser.selectedItemhistory, 'PUT').success(function (response) {
            //memberUser.addRequested = true;
            rashaErManage.checkAction(response);
            //memberUser.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                //memberUser.addRequested = false;
                memberUser.replaceItem(memberUser.selectedItemhistory.Id, response.Item);
                memberUser.gridOptionsHistory.fillData(memberUser.listHistorys);
                memberUser.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            //memberUser.addRequested = false;
        });
    }*/
// Delete History
/* memberUser.deleteContentHistory = function () {
        if (!memberUser.gridOptionsHistory.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                //memberUser.busyIndicator.isActive = true;
                console.log(memberUser.gridOptionsHistory.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'MemberHistory/GetOne', memberUser.gridOptionsHistory.selectedRow.item.Id, 'GET').success(function (response) {
                    memberUser.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'MemberHistory/delete', memberUser.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        //memberUser.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            memberUser.replaceItem(memberUser.selectedItemForDelete.Id);
                            memberUser.gridOptionsHistory.fillData(memberUser.selectedItemhistory);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });


    }*/

   // Add New Content
  /*  memberUser.addRowValueProperty = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        /*if (memberUser.requiredPropertyIsEmpty(memberUser.selectedItemValue)) {
            rashaErManage("مقادیر الزامی را وارد کنید!");
            return;
        }
        memberUser.busyIndicator.isActive = true;
        memberUser.addRequested = true;
        var valueItem = {};
        memberUser.valueItems = [];
        ajax.call(cmsServerConfig.configApiServerPath+'memberproperty/add', memberUser.selectedItemValue, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                memberUser.closeModal();
                ajax.call(cmsServerConfig.configApiServerPath+"memberpropertydetailvalue/GetViewModel", "0", 'GET').success(function (response1) {
                    rashaErManage.checkAction(response1);
                    for (var i = 0; i < memberUser.propertyDetailsListItems.length; i++) {
                        valueItem = $.extend(true, {}, response1.Item);
                        valueItem.LinkPropertyDetailId = memberUser.propertyDetailsListItems[i].Id;
                        valueItem.LinkPropertyId = response.Item.Id;
                        if (memberUser.propertyDetailsListItems[i].DefaultValue != null) {
                            if (memberUser.propertyDetailsListItems[i].DefaultValue.multipleChoice) {
                                var checkboxName = "nameValue" + memberUser.propertyDetailsListItems[i].Id;
                                memberUser.selectionValueNames = [];
                                jQuery("input[name='" + checkboxName + "']").each(function () {
                                    if (this.checked) {
                                        memberUser.selectionValueNames.push(this.value);
                                    }
                                });
                                valueItem.Value = memberUser.selectionValueNames.toString();
                            }
                            else {

                                if (memberUser.propertyDetailsListItems[i].DefaultValue.forceUse && memberUser.propertyDetailsListItems[i].DefaultValue.nameValue.length > 0) {  //ELement is a RadioButton/DropDown
                                    //Do not delete the following comments: Get the value if the element is a RadioButton
                                    /*var radioButton = "nameValue" + memberUser.propertyDetailsListItems[i].Id;
                                    memberUser.selectionValueNames = [];
                                    if ($("input[name='" + radioButton + "']").is(':checked')) {
                                        valueItem.Value = $("input[name='" + radioButton + "']:checked").val(); 
                                    }
                                    valueItem.Value = $('#dropDown' + memberUser.propertyDetailsListItems[i].Id).find(":selected").val(); //Get the value if the element is a DropDown

                                } else
                                    valueItem.Value = memberUser.propertyDetailsListItems[i].value;
                            }
                        } else
                            valueItem.Value = memberUser.propertyDetailsListItems[i].value;
                        memberUser.valueItems.push(valueItem);
                    }
                    ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyDetailValue/AddBatch', memberUser.valueItems, 'POST').success(function (response2) {
                        rashaErManage.checkAction(response2);
                        if (response2.IsSuccess) {
                            memberUser.ListItems.unshift(response.Item);
                            memberUser.gridOptions.fillData(memberUser.ListItems);
                            memberUser.gridOptions.myfilterText(memberUser.ListItems, "LinkCmsUserId", memberUser.cmsUsersListItems, "Username", "LinkCmsUserUsername");
                            memberUser.gridOptions.myfilterText(memberUser.ListItems, "LinkPropertyTypeId", memberUser.propertyTypeListItems, "Title", "LinkPropertyTypeTitle");
                            memberUser.addRequested = false;
                            memberUser.busyIndicator.isActive = false;
                            //ملک و مقادیر ثبت شده است از کاربر می خواهیم که نوع فروش را مشخص کند
                            //memberUser.openAddContractModal(response.Item.Id, response.Item.Title);
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
            memberUser.addRequested = false;
        });
    }*/


    //For Show Category Loading Indicator
    memberUser.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show Service Loading Indicator
    memberUser.categoryBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    memberUser.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    memberUser.addMenu = function () {
        $modal.open({
            templateUrl: "cpanelv1/ModuleMember/MemberUser/modalMenu.html",
            scope: $scope
        });
    }
    //#help//download file
    memberUser.downloadFile = function (Id, FileName) {
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
    memberUser.showlistfile = function (sItem) {
    memberUser.showlistFile =true;
    //memberUser.showlistPeoperty=false;
//memberUser.showlistHistory=false;
        var s = {
            PropertyName: "LinkModuleMemberId",
            IntValue1: sItem.Id,
            SearchType: 0
        }
        var engine = {};
        engine.Filters = [];
        engine.Filters.push(s);
     
       
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/getall", engine, "POST").success(function (response) {
            memberUser.listComments = response.ListItems;
            rashaErManage.checkAction(response);
            memberUser.gridOptionsfile.fillData(memberUser.listComments, response.resultAccess);
            memberUser.gridOptionsfile.currentPageNumber = response.CurrentPageNumber;
            memberUser.gridOptionsfile.totalRowCount = response.TotalRowCount;
            memberUser.gridOptionsfile.RowPerPage = response.RowPerPage;
            memberUser.showGridComment = true;
            memberUser.Title = memberUser.gridOptions.selectedRow.item.Title;
        });
        $('html, body').animate({
            scrollTop: $("#showlistfile").offset().top
        }, 850);
    }
 
    memberUser.treeConfig.currentNode = {};

    memberUser.treeBusyIndicator = false;

    memberUser.addRequested = false;

    //init Function
    memberUser.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"CoreEnum/EnumGender", {}, 'GET').success(function (response) {
            memberUser.Gender = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        memberUser.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
            memberUser.treeConfig.Items = response.ListItems;
            memberUser.gridOptions.resultAccessGroup = response.resultAccess;
            memberUser.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"memberuser/getall", memberUser.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            memberUser.ListItems = response.ListItems;
            memberUser.gridOptions.fillData(memberUser.ListItems, response.resultAccess); // Sending Access as an argument
            memberUser.allowedSearch = response.AllowedSearchField;
            memberUser.gridOptions.currentPageNumber = response.CurrentPageNumber;
            memberUser.gridOptions.totalRowCount = response.TotalRowCount;
            memberUser.gridOptions.rowPerPage = response.RowPerPage;
            memberUser.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            memberUser.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    memberUser.gridOptions.onRowSelected = function () {
        var item = memberUser.gridOptions.selectedRow.item;
    }

    // Open Add Category Modal 
    memberUser.addNewCategoryModel = function () {
        if (buttonIsPressed) return;
        memberUser.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MemberGroup/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            memberUser.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMember/MemberUser/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Open Edit Category Modal
    memberUser.openEditCategoryModel = function () {
        if (buttonIsPressed) { return };
        memberUser.addRequested = false;
        memberUser.modalTitle = 'ویرایش';
        if (!memberUser.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }
        memberUser.categoryBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MemberGroup/GetOne', memberUser.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            memberUser.categoryBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            memberUser.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMember/MemberUser/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Category
    memberUser.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        memberUser.categoryBusyIndicator.isActive = true;
        memberUser.addRequested = true;
        memberUser.selectedItem.LinkParentId = null;
        if (memberUser.treeConfig.currentNode != null)
            memberUser.selectedItem.LinkParentId = memberUser.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'MemberGroup/add', memberUser.selectedItem, 'POST').success(function (response) {
            memberUser.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                memberUser.gridOptions.advancedSearchData.engine.Filters = null;
                memberUser.gridOptions.advancedSearchData.engine.Filters = [];
                memberUser.gridOptions.reGetAll();
                memberUser.closeModal();
            }
            memberUser.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberUser.addRequested = false;
            memberUser.categoryBusyIndicator.isActive = false;
        });
    }

    //Edit Group REST Api
    memberUser.editCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        memberUser.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MemberGroup/edit', memberUser.selectedItem, 'PUT').success(function (response) {
            memberUser.addRequested = true;
            //memberUser.showbusy = false;
            memberUser.treeConfig.showbusy = false;
            memberUser.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                memberUser.addRequested = false;
                memberUser.treeConfig.currentNode.Title = response.Item.Title;
                memberUser.closeModal();
            }
            memberUser.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberUser.addRequested = false;
            memberUser.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Group
    memberUser.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = memberUser.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                memberUser.categoryBusyIndicator.isActive = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'MemberGroup/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    memberUser.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'MemberGroup/delete', memberUser.selectedItemForDelete, 'POST').success(function (res) {
                        if (res.IsSuccess) {
                            memberUser.gridOptions.advancedSearchData.engine.Filters = null;
                            memberUser.gridOptions.advancedSearchData.engine.Filters = [];
                            memberUser.gridOptions.fillData();
                            memberUser.categoryBusyIndicator.isActive = false;
                            memberUser.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        memberUser.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    memberUser.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree: On Node Select Options
    memberUser.treeConfig.onNodeSelect = function () {
        var node = memberUser.treeConfig.currentNode;
        //memberUser.selectedItem.LinkCategoryId = node.Id;
        memberUser.selectContent(node);

    };
    //Show Content with Category Id
    memberUser.selectContent = function (node) {
        memberUser.gridOptions.advancedSearchData.engine.Filters = null;
        memberUser.gridOptions.advancedSearchData.engine.Filters = [];
        var nodeTitle='';        
        nodeId='';
        if(node !=null && node != undefined)
        {       
            nodeId=node.Id;
            nodeTitle=node.Title;
        }
        
            memberUser.categoryBusyIndicator.message = "در حال بارگذاری اعضای " + nodeTitle;
            memberUser.categoryBusyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+"membergroup/getAllmember", "?id="+nodeId, 'GET').success(function (response) {
                memberUser.categoryBusyIndicator.isActive = false;
                memberUser.ListItems = response.ListItems;
                memberUser.gridOptions.fillData(memberUser.ListItems); // Sending Access as an argument
                memberUser.gridOptions.currentPageNumber = response.CurrentPageNumber;
                memberUser.gridOptions.totalRowCount = response.TotalRowCount;
                memberUser.gridOptions.rowPerPage = response.RowPerPage;
                memberUser.gridOptions.maxSize = 5;
            }).error(function (data, errCode, c, d) {
                memberUser.gridOptions.fillData();
                rashaErManage.checkAction(data, errCode);
            });
        
    };
    // Open Add New Content Model
    memberUser.openAddModal = function () {
        if (buttonIsPressed) { return };
        
        var node = memberUser.treeConfig.currentNode;
        //if (node.Id == 0 || !node.Id) {
        //    rashaErManage.showMessage("برای اضافه کردن عضو لطفا دسته مربوطه را انتخاب کنید .");
        //    return;
        //}
        memberUser.addRequested = false;
        memberUser.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'memberuser/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            memberUser.selectedItem = response.Item;
            if (node.Id != 0 || node.Id) {
                memberUser.selectedItem.LinkCategoryId = node.Id;
                memberUser.selectedItem.MemberUserGroup = [{ MemberUser_Id: 0, MemberGroup_Id: node.Id }];
            }
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMember/MemberUser/addUser.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

//#help فرم اتصال عضو به سایت
    memberUser.openAddMemberinSiteModal= function () {
         memberUser.addRequested=false;
         memberUser.addRequestedAddUserInSite=true;
         memberUser.selectedItemMemberInSiteJoinId="";
         memberUser.selectedItemMemberInSiteLinkMemberUserId="";
         $modal.open({
                templateUrl: 'cpanelv1/ModuleMember/MemberUser/addUserinSite.html',
                scope: $scope
            });
    }
//#help بررسی عضو و JoinId
    memberUser.CheckMemberToSite= function (frm) { 
        if (frm.$invalid)
            return;
        memberUser.addRequested=true;
        ajax.call(cmsServerConfig.configApiServerPath+"memberuser/GetOneByJoinId", {LinkMemberUserId: memberUser.selectedItemMemberInSiteLinkMemberUserId,JoinId: memberUser.selectedItemMemberInSiteJoinId}, "POST").success(function (response) {
            if(response.IsSuccess)
            {
                memberUser.selectedItemMemberInSite=response.Item;
                memberUser.addRequestedAddUserInSite=false;
                memberUser.addRequested=true;
            }
            else
            {
                memberUser.addRequestedAddUserInSite=true;
                memberUser.addRequested=false;
            }
            rashaErManage.checkAction(response);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

//#help اتصال عضو به سایت
    memberUser.addNewMemberToSite= function () { 
        memberUser.addRequestedAddUserInSite=true;
        ajax.call(cmsServerConfig.configApiServerPath+"memberuserSite/AddeByJoinId",  {LinkMemberUserId: memberUser.selectedItemMemberInSiteLinkMemberUserId,JoinId: memberUser.selectedItemMemberInSiteJoinId}, "POST").success(function (response) {
            if(response.IsSuccess)
            {
                memberUser.selectedItemMemberInSiteJoinId="";
                memberUser.selectedItemMemberInSiteLinkMemberUserId="";
                memberUser.ListItems.unshift(response.Item);
                memberUser.gridOptions.fillData(memberUser.ListItems);
                memberUser.closeModal();
                memberUser.addRequested=false;
            }
           rashaErManage.checkAction(response);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberUser.addRequested=false;
            memberUser.addRequestedAddUserInSite=true;
        });
    }


    // Open Edit Content Modal
    memberUser.openEditModel = function () {
        if (buttonIsPressed) { return };
        memberUser.addRequested = false;
        memberUser.modalTitle = 'ویرایش';
        if (!memberUser.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'memberuser/GetOne', memberUser.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            memberUser.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMember/MemberUser/editUser.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New MemberUser
    memberUser.addNewContent = function (frm) {
        if (frm.$invalid)
            return;
        memberUser.categoryBusyIndicator.isActive = true;
        memberUser.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'memberuser/add', memberUser.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            memberUser.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                memberUser.ListItems.unshift(response.Item);
                memberUser.gridOptions.fillData(memberUser.ListItems);
                memberUser.closeModal();
                //Save inputTags
                //ajax.call(cmsServerConfig.configApiServerPath+'memberusergroup/add', memberUser.selectedItem.ContentTags, 'POST').success(function (response) {
                //    console.log(response);
                //}).error(function (data, errCode, c, d) {
                //    rashaErManage.checkAction(data, errCode);
                //});
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberUser.addRequested = false;
            memberUser.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit MemberUser
    memberUser.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        memberUser.addRequested = true;
        memberUser.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'memberuser/edit', memberUser.selectedItem, 'PUT').success(function (response) {
            memberUser.addRequested = false;
            memberUser.categoryBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                memberUser.replaceItem(memberUser.selectedItem.Id, response.Item);
                memberUser.gridOptions.fillData(memberUser.ListItems);
                memberUser.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberUser.addRequested = false;
            memberUser.categoryBusyIndicator.isActive = false;
        });
    }

    // Delete a Service Content 
    memberUser.deleteContent = function () {
        if (buttonIsPressed) return;

        if (!memberUser.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        //memberUser.busyIndicator.isActive = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(memberUser.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'memberUser/GetOne', memberUser.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    memberUser.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'memberUser/delete', memberUser.selectedItemForDelete, 'POST').success(function (res) {
                        //memberUser.busyIndicator.isActive = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            memberUser.replaceItem(memberUser.selectedItemForDelete.Id);
                            memberUser.gridOptions.fillData(memberUser.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        //memberUser.busyIndicator.isActive = false;
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });
    }


    //Replace Item OnDelete/OnEdit Grid Options
    memberUser.replaceItem = function (oldId, newItem) {
        angular.forEach(memberUser.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = memberUser.ListItems.indexOf(item);
                memberUser.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            memberUser.ListItems.unshift(newItem);
    }

    memberUser.searchData = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"memberUser/getall", memberUser.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            memberUser.categoryBusyIndicator.isActive = false;
            memberUser.ListItems = response.ListItems;
            memberUser.gridOptions.fillData(memberUser.ListItems);
            memberUser.gridOptions.currentPageNumber = response.CurrentPageNumber;
            memberUser.gridOptions.totalRowCount = response.TotalRowCount;
            memberUser.gridOptions.rowPerPage = response.RowPerPage;
            memberUser.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            memberUser.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    memberUser.addRequested = false;
    memberUser.closeModal = function () {
        $modalStack.dismissAll();
    };


    //For reInit Categories
    memberUser.gridOptions.reGetAll = function () {
        if (memberUser.gridOptions.advancedSearchData.engine.Filters.length > 0) memberUser.searchData();
        else memberUser.init();
    };

    memberUser.isCurrentNodeEmpty = function () {
        return !angular.equals({}, memberUser.treeConfig.currentNode);
    }

    memberUser.loadFileAndFolder = function (item) {
        memberUser.treeConfig.currentNode = item;
        memberUser.treeConfig.onNodeSelect(item);
    }
    memberUser.addRequested = true;

    memberUser.columnCheckbox = false;

    memberUser.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = memberUser.gridOptions.columns;
        if (memberUser.gridOptions.columnCheckbox) {
            for (var i = 0; i < memberUser.gridOptions.columns.length; i++) {
                //memberUser.gridOptions.columns[i].visible = $("#" + memberUser.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + memberUser.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                memberUser.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < memberUser.gridOptions.columns.length; i++) {
                var element = $("#" + memberUser.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + memberUser.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < memberUser.gridOptions.columns.length; i++) {
            console.log(memberUser.gridOptions.columns[i].name.concat(".visible: "), memberUser.gridOptions.columns[i].visible);
        }
        memberUser.gridOptions.columnCheckbox = !memberUser.gridOptions.columnCheckbox;
    }

    memberUser.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }


    memberUser.showUpload = function () { $("#fastUpload").fadeToggle(); }

    //---------------Upload Modal-------------------------------
    memberUser.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleMember/MemberUser/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        memberUser.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            memberUser.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    memberUser.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    memberUser.whatcolor = function (progress) {
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

    memberUser.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    memberUser.replaceFile = function (name) {
        memberUser.itemClicked(null, memberUser.fileIdToDelete, "file");
        memberUser.fileTypes = 1;
        memberUser.fileIdToDelete = memberUser.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", memberUser.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                memberUser.FileItem = response3.Item;
                                memberUser.FileItem.FileName = name;
                                memberUser.FileItem.Extension = name.split('.').pop();
                                memberUser.FileItem.FileSrc = name;
                                memberUser.FileItem.LinkCategoryId = memberUser.thisCategory;
                                memberUser.saveNewFile();
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
    memberUser.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", memberUser.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                memberUser.FileItem = response.Item;
                memberUser.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            memberUser.showErrorIcon();
            return -1;
        });
    }

    memberUser.showSuccessIcon = function () {
    }

    memberUser.showErrorIcon = function () {
    }
    //file is exist
    memberUser.fileIsExist = function (fileName) {
        for (var i = 0; i < memberUser.FileList.length; i++) {
            if (memberUser.FileList[i].FileName == fileName) {
                memberUser.fileIdToDelete = memberUser.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    memberUser.getFileItem = function (id) {
        for (var i = 0; i < memberUser.FileList.length; i++) {
            if (memberUser.FileList[i].Id == id) {
                return memberUser.FileList[i];
            }
        }
    }

    //select file or folder
    memberUser.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            memberUser.fileTypes = 1;
            memberUser.selectedFileId = memberUser.getFileItem(index).Id;
            memberUser.selectedFileName = memberUser.getFileItem(index).FileName;
        }
        else {
            memberUser.fileTypes = 2;
            memberUser.selectedCategoryId = memberUser.getCategoryName(index).Id;
            memberUser.selectedCategoryTitle = memberUser.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        memberUser.selectedIndex = index;

    };

    //upload file
    memberUser.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (memberUser.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ memberUser.replaceFile(uploadFile.name);
                    memberUser.itemClicked(null, memberUser.fileIdToDelete, "file");
                    memberUser.fileTypes = 1;
                    memberUser.fileIdToDelete = memberUser.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                memberUser.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        memberUser.FileItem = response2.Item;
                        memberUser.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        memberUser.filePickerMainImage.filename =
                          memberUser.FileItem.FileName;
                        memberUser.filePickerMainImage.fileId =
                          response2.Item.Id;
                        memberUser.selectedItem.LinkMainImageId =
                          memberUser.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      memberUser.showErrorIcon();
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
                    memberUser.FileItem = response.Item;
                    memberUser.FileItem.FileName = uploadFile.name;
                    memberUser.FileItem.uploadName = uploadFile.uploadName;
                    memberUser.FileItem.Extension = uploadFile.name.split('.').pop();
                    memberUser.FileItem.FileSrc = uploadFile.name;
                    memberUser.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- memberUser.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", memberUser.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            memberUser.FileItem = response.Item;
                            memberUser.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            memberUser.filePickerMainImage.filename = memberUser.FileItem.FileName;
                            memberUser.filePickerMainImage.fileId = response.Item.Id;
                            memberUser.selectedItem.LinkMainImageId = memberUser.filePickerMainImage.fileId;
                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        memberUser.showErrorIcon();
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
    memberUser.exportFile = function () {
        memberUser.addRequested = true;
        memberUser.gridOptions.advancedSearchData.engine.ExportFile = memberUser.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'MemberUser/exportfile', memberUser.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            memberUser.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                memberUser.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //memberUser.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    memberUser.toggleExportForm = function () {
        memberUser.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        memberUser.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        memberUser.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        memberUser.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        memberUser.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleMember/MemberUser/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    memberUser.rowCountChanged = function () {
        if (!angular.isDefined(memberUser.ExportFileClass.RowCount) || memberUser.ExportFileClass.RowCount > 5000)
            memberUser.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    memberUser.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"MemberUser/count", memberUser.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            memberUser.addRequested = false;
            rashaErManage.checkAction(response);
            memberUser.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            memberUser.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);