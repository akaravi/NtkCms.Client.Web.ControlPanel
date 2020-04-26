app.controller("objectUserController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $state, $filter) {
    var objectUser = this;
    var PropertyTypeLink=0;
    //For Grid Options

    if (itemRecordStatus != undefined) objectUser.itemRecordStatus = itemRecordStatus;

    objectUser.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    objectUser.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    objectUser.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:objectUser.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:objectUser,
        useCurrentLocationZoom:12,
    }
 var todayDate = moment().format();
    objectUser.DateManufacture = {
        defaultDate: todayDate,
    }
objectUser.selectedItem = {};
//objectUser.selectedItemhistory = {};
objectUser.selectedItemobjectInSite = {};
    // Many To Many
    // objectGroupGroup  جدول واسط
    // LinkobjectGroupId   فیلد جدول دیگر در جدول واسط
    // LinkobjectGroupId  فیلد ما در جدول واسط
    objectUser.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'objectGroup_Id';
    var thisTableFieldICollection = 'ObjectUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها


    ajax.call(cmsServerConfig.configApiServerPath+"objectGroup/getall", {}, 'POST').success(function (response) {
        objectUser.menueGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    objectUser.hasInMany2Many = function (OtherTable) {
        if (objectUser.selectedItem[thisTableFieldICollection] == undefined) return false;
        return objectFindByKey(objectUser.selectedItem[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    };
    objectUser.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (objectUser.hasInMany2Many(OtherTable)) {
            //var index = objectUser.selectedItem[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(objectUser.selectedItem[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            objectUser.selectedItem[thisTableFieldICollection].splice(index, 1);
        } else {
            objectUser.selectedItem[thisTableFieldICollection].push(obj);
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
    objectUser.LinkobjectUserIdSelector = {
      displayMember: "FirstName",
      id: "Id",
      fId: "LinkobjectUserId",
      url: "objectUser",
      sortColumn: "Id",
      sortType: 0,
      filterText: "FirstName",
      showAddDialog: false,
      rowPerPage: 200,
      scope: objectUser,
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
    objectUser.LinkPropertyTypeIdSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkPropertyTypeId",
      url: "objectPropertyType",
      sortColumn: "Id",
      sortType: 0,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: objectUser,
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
    objectUser.LinkPropertyIdSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkPropertyId",
      url: "objectProperty",
      sortColumn: "Id",
      sortType: 0,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: objectUser,
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
    objectUser.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: 'true' },
            { name: 'SerialNumber', displayName: 'شماره سریال', sortable: true, visible: 'true' },
            { name: 'SerialRfId', displayName: 'شماره Rfid', sortable: true, visible: 'true', },
            { name: "ActionKey", displayName: 'عملیات', displayForce: true, template:'<li ng-if="!x.IsActivated" class="dropdown" dropdown="" style="display: initial;"><a aria-expanded="false" aria-haspopup="true" class="dropdown-toggle count-info" href="" dropdown-toggle=""><i class="fa fa-cog" ></i></a><ul class="dropdown-menu animated fadeInLeft m-t-xs" style="right: -142px;"><li><a ng-click="objectUser.showlistfile(x)" style="color:black">Listfile</a></li><li><a ng-click="objectUser.goToPrivateConfig(x)" style="color:black">PropertyList</a></li></ul></li>' }
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


 objectUser.goToPrivateConfig = function (selectedId) {
        $state.go("index.objectproperty", { objectuserId: selectedId });
    }

    //file Grid Options
    objectUser.gridOptionsfile = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkCategoryId', displayName: 'کد سیستمی پوشه', sortable: true, type: 'string', visible: true },
            { name: 'FileName', displayName: 'نام فایل', sortable: true, type: 'string', visible: true },
            { name: 'Extension', displayName: 'پسوند', sortable: true, type: 'string', visible: true },
            { name: 'FileSize', displayName: 'اندازه فایل', sortable: true, type: 'string', visible: true },
            { name: 'FileSrc', displayName: 'FileSrc', sortable: true, type: 'integer', visible: true },
            { name: "ActionKey", displayName: 'دانلود فایل ها', displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="objectUser.downloadFile(x.Id,x.FileName)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
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
 
objectUser.onPropertyTypeChange = function (propertyTypeId) {
        objectUser.propertyDetailsListItems = []; //Clear out the array from previous values
        objectUser.propertyDetailGroupListItems = []; //Clear out the array from previous values
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
        ajax.call(cmsServerConfig.configApiServerPath+"objectPropertyDetail/GetAll", engine, 'POST').success(function (response) {
            objectUser.propertyDetailsListItems = response.ListItems;
            $.each(objectUser.propertyDetailsListItems, function (index, item) {
               if(item.IsHistoryable==true)
                {
                    item.value = null;
                    // Add groups to its list
                    var result = $.grep(objectUser.propertyDetailGroupListItems, function (e) { return e.Id == item.virtual_PropertyDetailGroup.Id; });
                    if (result.length <= 0)
                        objectUser.propertyDetailGroupListItems.push(item.virtual_PropertyDetailGroup);
               
                    // Add DefaultValue to the object
                 
                    item.DefaultValue = JSON.parse(item.JsonDefaultValue);
                }
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
// Open Add Modal property
    objectUser.openAddPropertyModal = function (PropertyTypeId,UserId) {
        
        if (buttonIsPressed) return;
        objectUser.onPropertyTypeChange(PropertyTypeId);
        objectUser.modalTitle = 'اضافه';
        //Clear file pickers
        objectUser.attachedFiles = [];
        objectUser.attachedFile = "";
        objectUser.filePickerMainImage.filename = "";
        objectUser.filePickerMainImage.fileId = null;
        objectUser.filePickerFiles.filename = "";
        objectUser.filePickerFiles.fileId = null;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'objectproperty/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            //objectUser.busyIndicator.isActive = false;
            objectUser.selectedItemValue = response.Item;
            objectUser.selectedItemValue.LinkPropertyTypeId = PropertyTypeId;
            objectUser.selectedItemValue.LinkobjectUserId = UserId;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleobject/objectUser/addValue.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            objectUser.busyIndicator.isActive = false;
        });
    }

    //For Show Category Loading Indicator
    objectUser.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show Service Loading Indicator
    objectUser.categoryBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    objectUser.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    objectUser.addMenu = function () {
        $modal.open({
            templateUrl: "cpanelv1/Moduleobject/objectUser/modalMenu.html",
            scope: $scope
        });
    }
    //#help//download file
    objectUser.downloadFile = function (Id, FileName) {
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
    objectUser.showlistfile = function (sItem) {
    objectUser.showlistFile =true;
    //objectUser.showlistPeoperty=false;
//objectUser.showlistHistory=false;
        var s = {
            PropertyName: "LinkModuleobjectId",
            IntValue1: sItem.Id,
            SearchType: 0
        }
        var engine = {};
        engine.Filters = [];
        engine.Filters.push(s);
     
       
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/getall", engine, "POST").success(function (response) {
            objectUser.listComments = response.ListItems;
            rashaErManage.checkAction(response);
            objectUser.gridOptionsfile.fillData(objectUser.listComments, response.resultAccess);
            objectUser.gridOptionsfile.currentPageNumber = response.CurrentPageNumber;
            objectUser.gridOptionsfile.totalRowCount = response.TotalRowCount;
            objectUser.gridOptionsfile.RowPerPage = response.RowPerPage;
            objectUser.showGridComment = true;
            objectUser.Title = objectUser.gridOptions.selectedRow.item.Title;
        });
        $('html, body').animate({
            scrollTop: $("#showlistfile").offset().top
        }, 850);
    }
 
    objectUser.treeConfig.currentNode = {};

    objectUser.treeBusyIndicator = false;

    objectUser.addRequested = false;

    //init Function
    objectUser.init = function () {
      
        objectUser.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"objectGroup/getall", {}, 'POST').success(function (response) {
            objectUser.treeConfig.Items = response.ListItems;
            objectUser.gridOptions.resultAccessGroup = response.resultAccess;
            objectUser.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"objectuser/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            objectUser.ListItems = response.ListItems;
            objectUser.gridOptions.fillData(objectUser.ListItems, response.resultAccess); // Sending Access as an argument
            objectUser.allowedSearch = response.AllowedSearchField;
            objectUser.gridOptions.currentPageNumber = response.CurrentPageNumber;
            objectUser.gridOptions.totalRowCount = response.TotalRowCount;
            objectUser.gridOptions.rowPerPage = response.RowPerPage;
            objectUser.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            objectUser.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    objectUser.gridOptions.onRowSelected = function () {
        var item = objectUser.gridOptions.selectedRow.item;
    }

    // Open Add Category Modal 
    objectUser.addNewCategoryModel = function () {
        if (buttonIsPressed) return;
        objectUser.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'objectGroup/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            objectUser.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleobject/objectUser/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Open Edit Category Modal
    objectUser.openEditCategoryModel = function () {
        if (buttonIsPressed) { return };
        objectUser.addRequested = false;
        objectUser.modalTitle = 'ویرایش';
        if (!objectUser.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }
        objectUser.categoryBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'objectGroup/GetOne', objectUser.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            objectUser.categoryBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            objectUser.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleobject/objectUser/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Category
    objectUser.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        objectUser.categoryBusyIndicator.isActive = true;
        objectUser.addRequested = true;
        objectUser.selectedItem.LinkParentId = null;
        if (objectUser.treeConfig.currentNode != null)
            objectUser.selectedItem.LinkParentId = objectUser.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'objectGroup/add', objectUser.selectedItem, 'POST').success(function (response) {
            objectUser.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                objectUser.gridOptions.advancedSearchData.engine.Filters = null;
                objectUser.gridOptions.advancedSearchData.engine.Filters = [];
                objectUser.gridOptions.reGetAll();
                objectUser.closeModal();
            }
            objectUser.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            objectUser.addRequested = false;
            objectUser.categoryBusyIndicator.isActive = false;
        });
    }

    //Edit Group REST Api
    objectUser.editCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        objectUser.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'objectGroup/edit', objectUser.selectedItem, 'PUT').success(function (response) {
            objectUser.addRequested = true;
            //objectUser.showbusy = false;
            objectUser.treeConfig.showbusy = false;
            objectUser.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                objectUser.addRequested = false;
                objectUser.treeConfig.currentNode.Title = response.Item.Title;
                objectUser.closeModal();
            }
            objectUser.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            objectUser.addRequested = false;
            objectUser.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Group
    objectUser.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = objectUser.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                objectUser.categoryBusyIndicator.isActive = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'objectGroup/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    objectUser.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'objectGroup/delete', objectUser.selectedItemForDelete, 'POST').success(function (res) {
                        if (res.IsSuccess) {
                            objectUser.gridOptions.advancedSearchData.engine.Filters = null;
                            objectUser.gridOptions.advancedSearchData.engine.Filters = [];
                            objectUser.gridOptions.fillData();
                            objectUser.categoryBusyIndicator.isActive = false;
                            objectUser.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        objectUser.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    objectUser.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree: On Node Select Options
    objectUser.treeConfig.onNodeSelect = function () {
        var node = objectUser.treeConfig.currentNode;
        //objectUser.selectedItem.LinkCategoryId = node.Id;
        objectUser.selectContent(node);

    };
    //Show Content with Category Id
    objectUser.selectContent = function (node) {
        objectUser.gridOptions.advancedSearchData.engine.Filters = null;
        objectUser.gridOptions.advancedSearchData.engine.Filters = [];
        var nodeTitle='';        
        nodeId='';
        if(node !=null && node != undefined)
        {       
            nodeId=node.Id;
            nodeTitle=node.Title;
        }
        
            objectUser.categoryBusyIndicator.message = "در حال بارگذاری اعضای " + nodeTitle;
            objectUser.categoryBusyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+"objectgroup/getAllobject","?id="+nodeId, 'GET').success(function (response) {
                objectUser.categoryBusyIndicator.isActive = false;
                objectUser.ListItems = response.ListItems;
                objectUser.gridOptions.fillData(objectUser.ListItems); // Sending Access as an argument
                objectUser.gridOptions.currentPageNumber = response.CurrentPageNumber;
                objectUser.gridOptions.totalRowCount = response.TotalRowCount;
                objectUser.gridOptions.rowPerPage = response.RowPerPage;
                objectUser.gridOptions.maxSize = 5;
            }).error(function (data, errCode, c, d) {
                objectUser.gridOptions.fillData();
                rashaErManage.checkAction(data, errCode);
            });
        
    };
    // Open Add New Content Model
    objectUser.openAddModal = function () {
        if (buttonIsPressed) { return };
        
        var node = objectUser.treeConfig.currentNode;

        objectUser.addRequested = false;
        objectUser.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'objectuser/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            objectUser.selectedItem = response.Item;
            if (node.Id != 0 || node.Id) {
                objectUser.selectedItem.LinkCategoryId = node.Id;
                objectUser.selectedItem.objectUserGroup = [{ objectUser_Id: 0, objectGroup_Id: node.Id }];
            }
            $modal.open({
                templateUrl: 'cpanelv1/Moduleobject/objectUser/addUser.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

//#help فرم اتصال عضو به سایت
    objectUser.openAddobjectinSiteModal= function () {
         objectUser.addRequested=false;
         objectUser.addRequestedAddUserInSite=true;
         objectUser.selectedItemobjectInSiteJoinId="";
         objectUser.selectedItemobjectInSiteLinkobjectUserId="";
         $modal.open({
                templateUrl: 'cpanelv1/Moduleobject/objectUser/addUserinSite.html',
                scope: $scope
            });
    }
//#help بررسی عضو و JoinId
    objectUser.CheckobjectToSite= function (frm) { 
        if (frm.$invalid)
            return;
        objectUser.addRequested=true;
        ajax.call(cmsServerConfig.configApiServerPath+"objectuser/GetOneByJoinId", {LinkobjectUserId: objectUser.selectedItemobjectInSiteLinkobjectUserId,JoinId: objectUser.selectedItemobjectInSiteJoinId}, "POST").success(function (response) {
            if(response.IsSuccess)
            {
                objectUser.selectedItemobjectInSite=response.Item;
                objectUser.addRequestedAddUserInSite=false;
                objectUser.addRequested=true;
            }
            else
            {
                objectUser.addRequestedAddUserInSite=true;
                objectUser.addRequested=false;
            }
            rashaErManage.checkAction(response);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

//#help اتصال عضو به سایت
    objectUser.addNewobjectToSite= function () { 
        objectUser.addRequestedAddUserInSite=true;
        ajax.call(cmsServerConfig.configApiServerPath+"objectuserSite/AddeByJoinId",  {LinkobjectUserId: objectUser.selectedItemobjectInSiteLinkobjectUserId,JoinId: objectUser.selectedItemobjectInSiteJoinId}, "POST").success(function (response) {
            if(response.IsSuccess)
            {
                objectUser.selectedItemobjectInSiteJoinId="";
                objectUser.selectedItemobjectInSiteLinkobjectUserId="";
                objectUser.ListItems.unshift(response.Item);
                objectUser.gridOptions.fillData(objectUser.ListItems);
                objectUser.closeModal();
                objectUser.addRequested=false;
            }
           rashaErManage.checkAction(response);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            objectUser.addRequested=false;
            objectUser.addRequestedAddUserInSite=true;
        });
    }


    // Open Edit Content Modal
    objectUser.openEditModel = function () {
        if (buttonIsPressed) { return };
        objectUser.addRequested = false;
        objectUser.modalTitle = 'ویرایش';
        if (!objectUser.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'objectuser/GetOne', objectUser.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            objectUser.selectedItem = response1.Item;
            objectUser.selectedItem.DateManufacture = response1.Item.DateManufacture;
            objectUser.DateManufacture.defaultDate = objectUser.selectedItem.DateManufacture;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleobject/objectUser/editUser.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New objectUser
    objectUser.addNewContent = function (frm) {
        if (frm.$invalid)
            return;
        objectUser.categoryBusyIndicator.isActive = true;
        objectUser.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'objectuser/add', objectUser.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            objectUser.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                objectUser.ListItems.unshift(response.Item);
                objectUser.gridOptions.fillData(objectUser.ListItems);
                objectUser.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            objectUser.addRequested = false;
            objectUser.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit objectUser
    objectUser.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        objectUser.addRequested = true;
        objectUser.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'objectuser/edit', objectUser.selectedItem, 'PUT').success(function (response) {
            objectUser.addRequested = false;
            objectUser.categoryBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                objectUser.replaceItem(objectUser.selectedItem.Id, response.Item);
                objectUser.gridOptions.fillData(objectUser.ListItems);
                objectUser.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            objectUser.addRequested = false;
            objectUser.categoryBusyIndicator.isActive = false;
        });
    }

    // Delete a Service Content 
    objectUser.deleteContent = function () {
        if (buttonIsPressed) return;

        if (!objectUser.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        //objectUser.busyIndicator.isActive = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(objectUser.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'objectUser/GetOne', objectUser.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    objectUser.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'objectUser/delete', objectUser.selectedItemForDelete, 'POST').success(function (res) {
                        //objectUser.busyIndicator.isActive = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            objectUser.replaceItem(objectUser.selectedItemForDelete.Id);
                            objectUser.gridOptions.fillData(objectUser.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        //objectUser.busyIndicator.isActive = false;
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });
    }


    //Replace Item OnDelete/OnEdit Grid Options
    objectUser.replaceItem = function (oldId, newItem) {
        angular.forEach(objectUser.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = objectUser.ListItems.indexOf(item);
                objectUser.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            objectUser.ListItems.unshift(newItem);
    }

    objectUser.searchData = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"objectUser/getall", objectUser.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            objectUser.categoryBusyIndicator.isActive = false;
            objectUser.ListItems = response.ListItems;
            objectUser.gridOptions.fillData(objectUser.ListItems);
            objectUser.gridOptions.currentPageNumber = response.CurrentPageNumber;
            objectUser.gridOptions.totalRowCount = response.TotalRowCount;
            objectUser.gridOptions.rowPerPage = response.RowPerPage;
            objectUser.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            objectUser.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    objectUser.addRequested = false;
    objectUser.closeModal = function () {
        $modalStack.dismissAll();
    };


    //For reInit Categories
    objectUser.gridOptions.reGetAll = function () {
        if (objectUser.gridOptions.advancedSearchData.engine.Filters.length > 0) objectUser.searchData();
        else objectUser.init();
    };

    objectUser.isCurrentNodeEmpty = function () {
        return !angular.equals({}, objectUser.treeConfig.currentNode);
    }

    objectUser.loadFileAndFolder = function (item) {
        objectUser.treeConfig.currentNode = item;
        objectUser.treeConfig.onNodeSelect(item);
    }
    objectUser.addRequested = true;

    objectUser.columnCheckbox = false;

    objectUser.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = objectUser.gridOptions.columns;
        if (objectUser.gridOptions.columnCheckbox) {
            for (var i = 0; i < objectUser.gridOptions.columns.length; i++) {
                //objectUser.gridOptions.columns[i].visible = $("#" + objectUser.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + objectUser.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                objectUser.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < objectUser.gridOptions.columns.length; i++) {
                var element = $("#" + objectUser.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + objectUser.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < objectUser.gridOptions.columns.length; i++) {
            console.log(objectUser.gridOptions.columns[i].name.concat(".visible: "), objectUser.gridOptions.columns[i].visible);
        }
        objectUser.gridOptions.columnCheckbox = !objectUser.gridOptions.columnCheckbox;
    }

    objectUser.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }


    objectUser.showUpload = function () { $("#fastUpload").fadeToggle(); }

    //---------------Upload Modal-------------------------------
    objectUser.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/Moduleobject/objectUser/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        objectUser.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            objectUser.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    objectUser.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    objectUser.whatcolor = function (progress) {
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

    objectUser.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    objectUser.replaceFile = function (name) {
        objectUser.itemClicked(null, objectUser.fileIdToDelete, "file");
        objectUser.fileTypes = 1;
        objectUser.fileIdToDelete = objectUser.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", objectUser.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                objectUser.FileItem = response3.Item;
                                objectUser.FileItem.FileName = name;
                                objectUser.FileItem.Extension = name.split('.').pop();
                                objectUser.FileItem.FileSrc = name;
                                objectUser.FileItem.LinkCategoryId = objectUser.thisCategory;
                                objectUser.saveNewFile();
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
    objectUser.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", objectUser.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                objectUser.FileItem = response.Item;
                objectUser.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            objectUser.showErrorIcon();
            return -1;
        });
    }

    objectUser.showSuccessIcon = function () {
    }

    objectUser.showErrorIcon = function () {
    }
    //file is exist
    objectUser.fileIsExist = function (fileName) {
        for (var i = 0; i < objectUser.FileList.length; i++) {
            if (objectUser.FileList[i].FileName == fileName) {
                objectUser.fileIdToDelete = objectUser.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    objectUser.getFileItem = function (id) {
        for (var i = 0; i < objectUser.FileList.length; i++) {
            if (objectUser.FileList[i].Id == id) {
                return objectUser.FileList[i];
            }
        }
    }

    //select file or folder
    objectUser.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            objectUser.fileTypes = 1;
            objectUser.selectedFileId = objectUser.getFileItem(index).Id;
            objectUser.selectedFileName = objectUser.getFileItem(index).FileName;
        }
        else {
            objectUser.fileTypes = 2;
            objectUser.selectedCategoryId = objectUser.getCategoryName(index).Id;
            objectUser.selectedCategoryTitle = objectUser.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        objectUser.selectedIndex = index;

    };

    //upload file
    objectUser.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (objectUser.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ objectUser.replaceFile(uploadFile.name);
                    objectUser.itemClicked(null, objectUser.fileIdToDelete, "file");
                    objectUser.fileTypes = 1;
                    objectUser.fileIdToDelete = objectUser.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                objectUser.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        objectUser.FileItem = response2.Item;
                        objectUser.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        objectUser.filePickerMainImage.filename =
                          objectUser.FileItem.FileName;
                        objectUser.filePickerMainImage.fileId =
                          response2.Item.Id;
                        objectUser.selectedItem.LinkMainImageId =
                          objectUser.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      objectUser.showErrorIcon();
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
                    objectUser.FileItem = response.Item;
                    objectUser.FileItem.FileName = uploadFile.name;
                    objectUser.FileItem.uploadName = uploadFile.uploadName;
                    objectUser.FileItem.Extension = uploadFile.name.split('.').pop();
                    objectUser.FileItem.FileSrc = uploadFile.name;
                    objectUser.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- objectUser.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", objectUser.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            objectUser.FileItem = response.Item;
                            objectUser.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            objectUser.filePickerMainImage.filename = objectUser.FileItem.FileName;
                            objectUser.filePickerMainImage.fileId = response.Item.Id;
                            objectUser.selectedItem.LinkMainImageId = objectUser.filePickerMainImage.fileId;
                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        objectUser.showErrorIcon();
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
    objectUser.exportFile = function () {
        objectUser.addRequested = true;
        objectUser.gridOptions.advancedSearchData.engine.ExportFile = objectUser.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'objectUser/exportfile', objectUser.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            objectUser.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                objectUser.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //objectUser.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    objectUser.toggleExportForm = function () {
        objectUser.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        objectUser.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        objectUser.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        objectUser.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        objectUser.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/Moduleobject/objectUser/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    objectUser.rowCountChanged = function () {
        if (!angular.isDefined(objectUser.ExportFileClass.RowCount) || objectUser.ExportFileClass.RowCount > 5000)
            objectUser.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    objectUser.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"objectUser/count", objectUser.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            objectUser.addRequested = false;
            rashaErManage.checkAction(response);
            objectUser.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            objectUser.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);