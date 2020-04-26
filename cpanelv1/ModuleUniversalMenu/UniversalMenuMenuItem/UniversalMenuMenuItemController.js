app.controller("menuItemGridController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$builder', '$rootScope', '$state', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $builder, $state, $window, $filter) {
    var menuItemCtrl = this;
    menuItemCtrl.RouteUploadFileContent = cmsServerConfig.configRouteUploadFileContent;
    //todo:کار این این دو خط معلوم نبود
    //if ($scope.UserAccessAdminAllowToAllData)
    //    $state.go("index.main");
    //For Grid Options
    menuItemCtrl.gridOptions = {};
    menuItemCtrl.selectedItem = {};
    menuItemCtrl.platformListItems = [];
    menuItemCtrl.MenuListItems = [];

    if (itemRecordStatus != undefined) menuItemCtrl.itemRecordStatus = itemRecordStatus;

    //{
    //Many To Many
    //MenuItemProcesses  جدول واسط
    //ProcessesId   فیلد جدول دیگر در جدول واسط
    //MenuId  فیلد ما در جدول واسط
    menuItemCtrl.processesListItems = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'ProcessesId';
    var thisTableFieldICollection = 'MenuItemProcesses';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    menuItemCtrl.showSavePriorityOrderBtn = false;

    ajax.call(cmsServerConfig.configApiServerPath+"universalmenuprocesses/getall", {}, 'POST').success(function (response) {
        menuItemCtrl.processesListItems = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    menuItemCtrl.hasInMany2Many = function (OtherTable) {
        if (menuItemCtrl.selectedItem[thisTableFieldICollection] == undefined) return false;
        return objectFindByKey(menuItemCtrl.selectedItem[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    };

    menuItemCtrl.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (menuItemCtrl.hasInMany2Many(OtherTable)) {
            //var index = menuItemCtrl.selectedItem[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(menuItemCtrl.selectedItem[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            menuItemCtrl.selectedItem[thisTableFieldICollection].splice(index, 1);
        } else {
            if (menuItemCtrl.selectedItem[thisTableFieldICollection] == null) // Check if it is the first time that this object will be used. If it is the first time
                menuItemCtrl.selectedItem[thisTableFieldICollection] = [];                // It will be converted to an array so that we can push and splice objects in or from it
            menuItemCtrl.selectedItem[thisTableFieldICollection].push(obj);
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
    //}
    // ----------------------------------- End of Many To Many ------------------------------------------

    // This array holds the Processes
    menuItemCtrl.ProcessesList = [];

    menuItemCtrl.selectFromDefinedPanel = true;  // Shows predefined processes window
    menuItemCtrl.defineNewProcessPanel = true;   // Shows "New Process" form

    //init Function
    menuItemCtrl.init = function () {
        menuItemCtrl.addRequested = true;
        menuItemCtrl.busyIndicator.isActive = true;
        menuItemCtrl.gridOptions.rowPerPage=1000;
        ajax.call(cmsServerConfig.configApiServerPath+"UniversalMenuMenuItem/GetAllMenu", {RowPerPage: 1000}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            // Populate TreeConfig with all the Menu
            sortChildren(response.ListItems);
            menuItemCtrl.treeConfig.Items = response.ListItems;
            menuItemCtrl.MenuListItems = response.ListItems;
            menuItemCtrl.ListItems = response.ListItems;
            menuItemCtrl.ListParentItems = menuItemCtrl.selectParents(menuItemCtrl.ListItems);
            menuItemCtrl.gridOptions.fillData(menuItemCtrl.ListParentItems, response.resultAccess);
            menuItemCtrl.gridOptions.currentPageNumber = response.CurrentPageNumber;
            menuItemCtrl.gridOptions.totalRowCount = response.TotalRowCount;
            menuItemCtrl.gridOptions.rowPerPage = response.RowPerPage;
            menuItemCtrl.gridOptions.maxSize = 5;
            menuItemCtrl.addRequested = false;
            menuItemCtrl.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(response);
            console.log(data);
        });
        // Get all MemberGroups to popluate the list
        ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/GetAll", {RowPerPage: 200}, 'POST').success(function (response) {
            menuItemCtrl.groupsListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }

    menuItemCtrl.gridOptions = {
        columns: [
           { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
           { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
           { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
           { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
           { name: 'Key', displayName: 'کلید', sortable: true, type: 'string' },
           { name: 'ViewCount', displayName: 'تعداد بازدید', sortable: true, type: 'integer' },
           { name: 'ShowInMenuOrder', displayName: 'ترتیب نمایش', sortable: true, type: 'string' },
           { name: 'ActionButton', displayName: 'ترتیب', sortable: true, type: 'string', displayForce: true, width: '85px', template: '<i class=\"fa fa-arrow-circle-up\" aria-hidden=\"true\" style=\"font-size:25px;color:#1ab394;text-align: center;\" title=\"انتقال به بالا\" ng-click=\"menuItemCtrl.editStepGoUp(x, $index)\" ng-show="menuItemCtrl.gridOptions.resultAccess.AccessEditRow"></i>&nbsp<i class=\"fa fa-arrow-circle-down\"  aria-hidden=\"true\" title=\"انتقال به پایین\" style=\"font-size:25px;color:#ec4758;text-align: center;\" ng-click=\"menuItemCtrl.editStepGoDown(x, $index)\" ng-show="menuItemCtrl.gridOptions.resultAccess.AccessEditRow"></i>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "Id",
                SortType: 0,
                NeedToRunFakePagination: false,
                TotalRowData: 200,
                RowPerPage: 200,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }
    //#Help سلکتور برای انتخاب زمانبندی
    menuItemCtrl.LinkTaskSchedulerIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkTaskSchedulerId',
        url: 'TaskSchedulerSchedule',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'LinkTaskSchedulerId',
        rowPerPage: 200,
        scope: menuItemCtrl,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
            ]
        }
    }
    // Show Loading Indicator
    menuItemCtrl.busyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    menuItemCtrl.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    menuItemCtrl.treeConfig.currentNode = {};
    menuItemCtrl.addRequested = false;

    menuItemCtrl.gridOptions.onRowSelected = function () {
        var item = menuItemCtrl.gridOptions.selectedRow.item;
    }

    //Tree On Node Select Options
    menuItemCtrl.treeConfig.onNodeSelect = function () {
        var node = menuItemCtrl.treeConfig.currentNode;
        menuItemCtrl.gridOptions.selectedRow.item = menuItemCtrl.treeConfig.currentNode;
        // menuItemCtrl.LinkParentIdMemo remembers the real LinkParentId of the selectedRow in order it later when loading open or edit modal
        menuItemCtrl.LinkParentIdMemo = menuItemCtrl.selectedItem.LinkParentId;
        if (node != null) { // Root is selected
            menuItemCtrl.selectedItem.LinkParentId = node.Id;
            menuItemCtrl.selectContent(node);
        }
        else {
            menuItemCtrl.selectRoots();
        }
    }
    //Show Content with Category Id
    menuItemCtrl.selectContent = function (node) {
        menuItemCtrl.busyIndicator.message = "در حال بارگذاری... " + node.Title;
        menuItemCtrl.busyIndicator.isActive = true;
        //menuItemCtrl.gridOptions.advancedSearchData = {};
        menuItemCtrl.gridOptions.advancedSearchData.engine.Filters = null;
        menuItemCtrl.gridOptions.advancedSearchData.engine.Filters = [];
        var s = {
            PropertyName: "LinkParentId",
            IntValue1: node.Id,
            SearchType: 0
        }
        menuItemCtrl.gridOptions.advancedSearchData.engine.Filters.rowPerPage=1000;
        menuItemCtrl.gridOptions.advancedSearchData.engine.Filters.push(s);
        ajax.call(cmsServerConfig.configApiServerPath+"UniversalMenuMenuItem/GetAll", menuItemCtrl.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            menuItemCtrl.busyIndicator.isActive = false;
            menuItemCtrl.ListItems = response.ListItems;
            menuItemCtrl.gridOptions.fillData(menuItemCtrl.ListItems, response.resultAccess);
            menuItemCtrl.gridOptions.currentPageNumber = response.CurrentPageNumber;
            menuItemCtrl.gridOptions.totalRowCount = response.TotalRowCount;
            menuItemCtrl.gridOptions.rowPerPage = response.RowPerPage;
            menuItemCtrl.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            menuItemCtrl.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            menuItemCtrl.busyIndicator.isActive = false;
        });
    }

    // Open Add Content Model
    menuItemCtrl.openAddContentModal = function () {
        if (buttonIsPressed) { return };
        // Clear the "New Process" form and populate CmsModules
        menuItemCtrl.clearProcessForm();
        var currentNode = menuItemCtrl.treeConfig.currentNode;
        menuItemCtrl.addRequested = false;
        menuItemCtrl.modalTitle = 'اضافه';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'UniversalMenumenuitem/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            menuItemCtrl.selectedItem = response.Item;
            if (currentNode == undefined || currentNode.Id == undefined || currentNode.Id == null)
                menuItemCtrl.selectedItem.LinkParentId = 'null';  // New node is a root
            else
                menuItemCtrl.selectedItem.LinkParentId = currentNode.Id;   // New node is child
            $modal.open({
                templateUrl: 'cpanelv1/ModuleUniversalMenu/UniversalMenuMenuItem/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    menuItemCtrl.openEditContentModal = function () {
        if (buttonIsPressed) { return };
        menuItemCtrl.addRequested = false;
        menuItemCtrl.modalTitle = 'ویرایش';
        if (!menuItemCtrl.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاً یک ردیف جهت ویرایش انتخاب کنید");
            return;
        }
        // Clear the "New Process" form and populate CmsModules
        menuItemCtrl.clearProcessForm();
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'UniversalMenumenuItem/GetOne', menuItemCtrl.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            menuItemCtrl.selectedItem = response.Item;
            if (menuItemCtrl.treeConfig.currentNode.Id == null || menuItemCtrl.treeConfig.currentNode.Id == undefined)
                menuItemCtrl.selectedItem.LinkParentId = 'null';

            if (menuItemCtrl.selectedItem.ProcessesJson == null || menuItemCtrl.selectedItem.ProcessesJson == "null" || menuItemCtrl.selectedItem.ProcessesJson == "[]") {
                menuItemCtrl.ProcessesList = [];
                menuItemCtrl.selectedProcessIndex = -1;
            } else
                menuItemCtrl.fillProcessForm(menuItemCtrl.selectedItem.ProcessesJson);          // Load all the processes
            // Get all MemberGroups to popluate the list
            $modal.open({
                templateUrl: 'cpanelv1/ModuleUniversalMenu/UniversalMenuMenuItem/edit.html',
                scope: $scope
            });
            menuItemCtrl.loadEmojiPicker();                                                    // Initiate EmojiPickers
            //Set AccessCheck Setting panel show or hide
            if (menuItemCtrl.selectedItem.AccessCheck) {
                // Populate AccessWhiteList and BlackList
                setWhiteList(menuItemCtrl.selectedItem.AccessWhiteListGroup);
                setBlackList(menuItemCtrl.selectedItem.AccessBlackListGroup);
            }
            setParentList(menuItemCtrl.selectedItem.AccessWhiteListGroup, menuItemCtrl.selectedItem.AccessBlackListGroup);

            //Set ScheduleSettings panel show or hide
            if (menuItemCtrl.selectedItem.LinkTaskSchedulerId != null && menuItemCtrl.scheduleListItems == undefined && menuItemCtrl.selectedItem.LinkTaskSchedulerId>0) {
                menuItemCtrl.isLoading = true;
                ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerSchedule/getall', {RowPerPage: 1000}, "POST").success(function (response) {
                    menuItemCtrl.isLoading = false;
                    menuItemCtrl.scheduleListItems = response.ListItems;
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add a Content
    menuItemCtrl.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        menuItemCtrl.addRequested = true;
        menuItemCtrl.selectedItem.ProcessesJson = $.trim(angular.toJson(menuItemCtrl.ProcessesList));
        //Concat whilte list and black list group ids
        menuItemCtrl.selectedItem.AccessWhiteListGroup = getWhilteList();
        menuItemCtrl.selectedItem.AccessBlackListGroup = getBlackList();
        ajax.call(cmsServerConfig.configApiServerPath+'UniversalMenumenuitem/add', menuItemCtrl.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                menuItemCtrl.ListItems.push(response.Item);
                if (response.Item.LinkParentId == null) {
                    // Do nothing یک روت اضافه شده است
                }
                else
                    for (var i = 0; i < menuItemCtrl.treeConfig.Items.length; i++) {
                        searchAndAddToTree(response.Item, menuItemCtrl.treeConfig.Items[i]);
                    }
                menuItemCtrl.closeModal();
            }
            else
            {
                menuItemCtrl.addRequested = false;
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            menuItemCtrl.addRequested = false;
        });
    }

    // Edit a Content
    menuItemCtrl.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        menuItemCtrl.addRequested = true;

        menuItemCtrl.selectedItem.ProcessesJson = $.trim(angular.toJson(menuItemCtrl.ProcessesList));

        //Concat whilte list and black list group ids
        menuItemCtrl.selectedItem.AccessWhiteListGroup = getWhilteList();
        menuItemCtrl.selectedItem.AccessBlackListGroup = getBlackList();

        menuItemCtrl.addRequested = true;
        menuItemCtrl.editProcess(false);
        ajax.call(cmsServerConfig.configApiServerPath+'UniversalMenumenuitem/edit', menuItemCtrl.selectedItem, 'PUT').success(function (response) {
            menuItemCtrl.addRequested = false;
            menuItemCtrl.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                menuItemCtrl.replaceItem(menuItemCtrl.selectedItem.Id, response.Item);
                for (var i = 0; i < menuItemCtrl.treeConfig.Items.length; i++) {
                    searchAndEditTreeItem(menuItemCtrl.selectedItem, menuItemCtrl.treeConfig.Items[i]);
                }
                menuItemCtrl.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            menuItemCtrl.addRequested = false;
        });
    }

    //Delete a Content 
    menuItemCtrl.deleteContent = function () {
        if (buttonIsPressed) { return };

        if (!menuItemCtrl.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("یک ردیف برای حذف انتخاب کنید");
            return;
        }
        rashaErManage.showYesNo(('اخطار'), ('آیا از حذف این مورد مطمئن هستید'), function (isConfirmed) {
            if (isConfirmed) {
                menuItemCtrl.busyIndicator.isActive = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"UniversalMenumenuitem/GetOne", menuItemCtrl.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    menuItemCtrl.busyIndicator.isActive = false;
                    rashaErManage.checkAction(response);
                    menuItemCtrl.selectedItemForDelete = response.Item;
                    menuItemCtrl.busyIndicator.isActive = true;
                    ajax.call(cmsServerConfig.configApiServerPath+"UniversalMenumenuitem/delete", menuItemCtrl.selectedItemForDelete, 'POST').success(function (res) {
                        menuItemCtrl.busyIndicator.isActive = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            menuItemCtrl.replaceItem(menuItemCtrl.selectedItemForDelete.Id);
                            menuItemCtrl.gridOptions.fillData(menuItemCtrl.ListItems);

                            if (menuItemCtrl.selectedItemForDelete.LinkParentId == null) {
                                var elementPos = menuItemCtrl.treeConfig.Items.map(function (x) { return x.Id; }).indexOf(menuItemCtrl.selectedItemForDelete.Id); // find the index of an item in an array
                                menuItemCtrl.treeConfig.Items.splice(elementPos, 1);
                            } else
                                for (var i = 0; i < menuItemCtrl.treeConfig.Items.length; i++) {
                                    searchAndDeleteFromTree(menuItemCtrl.selectedItemForDelete, menuItemCtrl.treeConfig.Items[i]);
                                }
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage("حذف امکان پذیر نیست. منو شامل زیر مجموعه است!");
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        menuItemCtrl.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    menuItemCtrl.busyIndicator.isActive = false;
                });
            }
        });
    }

    //Replace Item OnDelete/OnEdit Grid Options
    menuItemCtrl.replaceItem = function (oldId, newItem) {
        angular.forEach(menuItemCtrl.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = menuItemCtrl.ListItems.indexOf(item);
                menuItemCtrl.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            menuItemCtrl.ListItems.push(newItem);
    }

    menuItemCtrl.searchData = function () {
        menuItemCtrl.addRequested = true;
        menuItemCtrl.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"universalmenumenuItem/getAll", menuItemCtrl.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            // Populate TreeConfig with all the Menu
            menuItemCtrl.responseListItems = response.ListItems;
            menuItemCtrl.gridOptions.fillData(menuItemCtrl.responseListItems, response.resultAccess);
            menuItemCtrl.gridOptions.currentPageNumber = response.CurrentPageNumber;
            menuItemCtrl.gridOptions.totalRowCount = response.TotalRowCount;
            menuItemCtrl.gridOptions.rowPerPage = response.RowPerPage;
            menuItemCtrl.gridOptions.maxSize = 5;
            menuItemCtrl.addRequested = false;
            menuItemCtrl.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        // Get all MemberGroups to popluate the list
        ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/GetAll", engine, 'POST').success(function (response) {
            menuItemCtrl.groupsListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(response);
            console.log(data);
        });
    }

    //Close Model Stack
    menuItemCtrl.addRequested = false;

    menuItemCtrl.closeModal = function () {
        $modalStack.dismissAll();
    };

    //For reInit Categories
    menuItemCtrl.gridOptions.reGetAll = function () {
        if (menuItemCtrl.gridOptions.advancedSearchData.engine.Filters.length == 0)
            menuItemCtrl.init();
        else
            menuItemCtrl.searchData();
    };

    menuItemCtrl.isCurrentNodeEmpty = function () {
        return !angular.equals({}, menuItemCtrl.treeConfig.currentNodede);
    }

    menuItemCtrl.loadFileAndFolder = function (item) {
        menuItemCtrl.treeConfig.currentNode = item;
        menuItemCtrl.treeConfig.onNodeSelect(item);
    }

    menuItemCtrl.columnCheckbox = false;

    menuItemCtrl.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = menuItemCtrl.gridOptions.columns;
        if (menuItemCtrl.gridOptions.columnCheckbox) {
            for (var i = 0; i < menuItemCtrl.gridOptions.columns.length; i++) {
                var element = $("#" + menuItemCtrl.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                menuItemCtrl.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < menuItemCtrl.gridOptions.columns.length; i++) {
                var element = $("#" + menuItemCtrl.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + menuItemCtrl.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < menuItemCtrl.gridOptions.columns.length; i++) {
            console.log(menuItemCtrl.gridOptions.columns[i].name.concat(".visible: "), menuItemCtrl.gridOptions.columns[i].visible);
        }
        menuItemCtrl.gridOptions.columnCheckbox = !menuItemCtrl.gridOptions.columnCheckbox;
    }

    menuItemCtrl.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    menuItemCtrl.parseFileIds = function (stringOfIds) {
        menuItemCtrl.attachedFiles = [];
        if (stringOfIds != undefined && stringOfIds != null)
            menuItemCtrl.attachedFiles = stringOfIds.split(",");
    }

    menuItemCtrl.selectParents = function (menuListItems) {
        var length = menuListItems.length;
        var prenetListItems = [];
        for (var i = 0; i < length; i++) {
            if (menuListItems[i].LinkParentId == null || menuListItems[i].LinkParentId == undefined)
                prenetListItems.push(menuListItems[i]);
        }
        return prenetListItems;
    }

    menuItemCtrl.editStepGoUp = function (item, index) {
        if (index == 0) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Top_Of_The_List'));
            return;
        }
        menuItemCtrl.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'UniversalMenumenuItem/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            menuItemCtrl.selectedItem = response1.Item;
            var temp = response1.Item.ShowInMenuOrder;
            menuItemCtrl.selectedItem.ShowInMenuOrder = menuItemCtrl.ListItems[index - 1].ShowInMenuOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'UniversalMenumenuitem/edit', menuItemCtrl.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'UniversalMenumenuItem/GetOne', menuItemCtrl.ListItems[index - 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        menuItemCtrl.selectedItem = response3.Item;
                        menuItemCtrl.selectedItem.ShowInMenuOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'UniversalMenumenuitem/edit', menuItemCtrl.selectedItem, 'PUT').success(function (response4) {
                            menuItemCtrl.busyIndicator.isActive = false;
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                var engine = {};
                                engine.Filters = null;
                                engine.Filters = [];
                                var filterDataModel = {
                                    PropertyName: "LinkParentId",
                                    IntValue1: item.LinkParentId,
                                    SearchType: 0
                                };
                                menuItemCtrl.ListItems[index - 1] = response4.Item;
                                // Swap two items in the grid ListItems
                                menuItemCtrl.ListItems[index] = menuItemCtrl.ListItems.splice(index - 1, 1, menuItemCtrl.ListItems[index])[0];
                                menuItemCtrl.gridOptions.fillData(menuItemCtrl.ListItems);

                                var elementPos = menuItemCtrl.treeConfig.currentNode.Children.map(function (x) { return x.Id; }).indexOf(item.Id); // find the index of an item in an array
                                // Swap two items in the grid ListItems
                                menuItemCtrl.treeConfig.currentNode.Children[elementPos] = menuItemCtrl.treeConfig.currentNode.Children.splice(elementPos - 1, 1, menuItemCtrl.treeConfig.currentNode.Children[elementPos])[0];
                            }
                        }).error(function (data, errCode, c, d) {
                            rashaErManage.checkAction(data, errCode);
                        });
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    menuItemCtrl.editStepGoDown = function (item, index) {
        if (index == menuItemCtrl.ListItems.length - 1) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Bottom_Of_The_List'));
            return;
        }
        menuItemCtrl.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'UniversalMenumenuItem/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            menuItemCtrl.selectedItem = response1.Item;
            var temp = response1.Item.ShowInMenuOrder;
            menuItemCtrl.selectedItem.ShowInMenuOrder = menuItemCtrl.ListItems[index + 1].ShowInMenuOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'UniversalMenumenuitem/edit', menuItemCtrl.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'UniversalMenumenuItem/GetOne', menuItemCtrl.ListItems[index + 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        menuItemCtrl.selectedItem = response3.Item;
                        menuItemCtrl.selectedItem.ShowInMenuOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'UniversalMenumenuitem/edit', menuItemCtrl.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            menuItemCtrl.busyIndicator.isActive = false;
                            if (response4.IsSuccess) {
                                var engine = {};
                                engine.Filters = null;
                                engine.Filters = [];
                                var filterDataModel = {
                                    PropertyName: "LinkParentId",
                                    IntValue1: item.LinkParentId,
                                    SearchType: 0
                                };
                                menuItemCtrl.ListItems[index + 1] = response4.Item;
                                // Swap two items in the grid ListItems
                                menuItemCtrl.ListItems[index] = menuItemCtrl.ListItems.splice(index + 1, 1, menuItemCtrl.ListItems[index])[0];
                                menuItemCtrl.gridOptions.fillData(menuItemCtrl.ListItems);

                                var elementPos = menuItemCtrl.treeConfig.currentNode.Children.map(function (x) { return x.Id; }).indexOf(item.Id); // find the index of an item in an array
                                // Swap two items in the grid ListItems
                                menuItemCtrl.treeConfig.currentNode.Children[elementPos] = menuItemCtrl.treeConfig.currentNode.Children.splice(elementPos + 1, 1, menuItemCtrl.treeConfig.currentNode.Children[elementPos])[0];
                            }
                        }).error(function (data, errCode, c, d) {
                            rashaErManage.checkAction(data, errCode);
                        });
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // To load Emoji-picker
    menuItemCtrl.loadEmojiPicker = function (val) {
        window.emojiPicker = new EmojiPicker({
            emojiable_selector: '[data-emojiable=true]',
            assetsPath: 'cpanelv1/js/plugins/emoji-picker/img/',
            popupButtonClasses: 'fa fa-smile-o'
        });
        // window.emojiPicker.discover();

    }

    menuItemCtrl.loadEmojiPickerdiscover = function (val) {
        window.emojiPicker.discover();
    }

    /**
     * /
     * @param {} moduleId 
     * @returns {} 
     * پنل ایجاد پروسه جدید
     *
     */
    menuItemCtrl.newProcess = {};
    menuItemCtrl.newProcess.LinkModuleId = null;
    menuItemCtrl.newProcess.LinkModuleProcessId = null;
    menuItemCtrl.newProcess.LinkModuleProcessCustomizeId = null;
    menuItemCtrl.newProcess.ProcessCustomizationInputValue = null;

    /**
 * /
 * @param {} moduleId 
 * @returns {} 
 * پنل ایجاد پروسه پاسخ جدید
 *
 */
    // On Module Process Change Event
    menuItemCtrl.LoadcmsModuleProcess = function (moduleId) {
        menuItemCtrl.newProcess.LinkModuleId = moduleId;
        var filterValue = {
            PropertyName: "LinkModuleId",
            IntValue1: parseInt(moduleId),
            SearchType: 0
        } 
        var engine = {};

        engine.Filters = [];
        engine.Filters.push(filterValue);
        engine.RowPerPage = 1000;
        engine.SortColumn = "Title";
        engine.SortType = 1;
        menuItemCtrl.loadingCmsModuleProcess = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcess/getall', engine, "POST").success(function (response) {
            menuItemCtrl.loadingCmsModuleProcess = false;
            rashaErManage.checkAction(response);
            menuItemCtrl.cmsModulesProcessesListItems = response.ListItems;
            if (menuItemCtrl.cmsModulesProcessesListItems.length === 0) {
                menuItemCtrl.cmsModulesProcessesCustomizeListItems = [];
                menuItemCtrl.newProcess.LinkModuleProcessId = 0;
                menuItemCtrl.newProcess.LinkModuleProcessCustomizeId = 0;
                menuItemCtrl.newProcess.ProcessCustomizationInputValue = null;
            }
        }).error(function (data, errCode, c, d) {
            menuItemCtrl.busyIndicator = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    // On ModuleProcess Change Event
    menuItemCtrl.LoadcmsModuleProcessCustomize = function (moduleProcessId) {
        // Clear the form in case there is no ModuleProcessCustomize
        menuItemCtrl.clearFormBuilder();

        var filterValue = {
            SortType: 0,
            PropertyName: "LinkModuleProcessId",
            IntValue1: parseInt(moduleProcessId),
            SearchType: 0
        }

        var engine = {};
        engine.Filters = [];
        engine.Filters.push(filterValue);
        engine.RowPerPage = 1000;
        engine.SortColumn = "Title";
        engine.SortType = 1;
        menuItemCtrl.loadingCmsModuleProcessCustomize = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcessCustomize/getall', engine, "POST").success(function (response) {
            menuItemCtrl.loadingCmsModuleProcessCustomize = false;
            rashaErManage.checkAction(response);
            menuItemCtrl.cmsModulesProcessesCustomizeListItems = response.ListItems;

            if (menuItemCtrl.cmsModulesProcessesCustomizeListItems.length === 0) {
                menuItemCtrl.newProcess.LinkModuleProcessCustomizeId = 0;
                menuItemCtrl.newProcess.ProcessCustomizationInputValue = null;
            }
        }).error(function (data, errCode, c, d) {
            menuItemCtrl.busyIndicator = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    // On ModuleProcessCustomize Change Event: Load components into formBuilder
    menuItemCtrl.LoadProcessInputCustomizeValue = function (LinkModuleProcessCustomizeId) {
        menuItemCtrl.clearFormBuilder();
        menuItemCtrl.newProcess.ProcessCustomizationInputValue = null;
        menuItemCtrl.newProcess.Description = null;
        var isshowdescription = false;
        var length = menuItemCtrl.cmsModulesProcessesCustomizeListItems.length;
        for (var i = 0; i < length; i++) {
            if (menuItemCtrl.cmsModulesProcessesCustomizeListItems[i].Id == LinkModuleProcessCustomizeId) {
                menuItemCtrl.newProcess.Description = menuItemCtrl.cmsModulesProcessesCustomizeListItems[i].Description;
                var isshowdescription = true;
                var component = $.parseJSON(menuItemCtrl.cmsModulesProcessesCustomizeListItems[i].ProcessInputValueForm);
                if (component != null && component.length != undefined)
                    $.each(component, function (i, item) {
                        $builder.addFormObject('default', item);
                        menuItemCtrl.defaultValue[item.id] = null;
                    });
                if( menuItemCtrl.cmsModulesProcessesCustomizeListItems[i].LinkProcessCustomizeDependenceBeforRunId !=null)
                {
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcessCustomize/GetOne', menuItemCtrl.cmsModulesProcessesCustomizeListItems[i].LinkProcessCustomizeDependenceBeforRunId, "GET").success(function (response) {
                        rashaErManage.checkAction(response);
                        menuItemCtrl.newProcess.Description="برای استفاده از این فرایند به فرایند "+ response.Item.Title +" نیاز دارید"  ;
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    }); 
                    
                }

            }
        }
        
    }

    menuItemCtrl.valueSubmit = [];
    menuItemCtrl.defaultValue = {};

    menuItemCtrl.valueSubmit1 = [];
    menuItemCtrl.defaultValue1 = {};

    menuItemCtrl.removeProcess = function (index) {
        menuItemCtrl.ProcessesList.splice(index, 1);
        menuItemCtrl.selectedItem.ProcessesJson = $.trim(angular.toJson(menuItemCtrl.ProcessesList));

        if (menuItemCtrl.ProcessesList.length === 0)
            menuItemCtrl.selectedProcessIndex = -1;    // Hide Save Process button and show New Procss button
    }

    // Add Process Internal
    menuItemCtrl.addProcess = function () {

        if (menuItemCtrl.newProcess.LinkModuleProcessCustomizeId == undefined || menuItemCtrl.newProcess.LinkModuleProcessCustomizeId == 0 || menuItemCtrl.newProcess.LinkModuleProcessCustomizeId == null) {
            rashaErManage.showMessage("لطفاً انتخاب نوع بکارگیری را انتخاب کنید!");
            menuItemCtrl.showLinkModuleProcessCustomizeIdIsEmptyError = true;
            return;
        }
        if (menuItemCtrl.newProcess.Title == null || menuItemCtrl.newProcess.Title == "") {
            rashaErManage.showMessage("لطفاً عنوان عملیات را وارد کنید!");
            return;
        }

        menuItemCtrl.showLinkModuleProcessCustomizeIdIsEmptyError = false;
        menuItemCtrl.newProcess.ProcessCustomizationInputValue = $.trim(angular.toJson(menuItemCtrl.valueSubmit));
        menuItemCtrl.ProcessesList.push(menuItemCtrl.newProcess);
        menuItemCtrl.selectedItem.ProcessesJson = $.trim(angular.toJson(menuItemCtrl.ProcessesList));
        menuItemCtrl.resetProcess();
    }

    // Reset Process
    menuItemCtrl.resetProcess = function () {
        $(".back2").fadeOut(300);
        menuItemCtrl.newProcess = {};
        menuItemCtrl.clearFormBuilder();
        $(".back2").fadeIn(300);
        menuItemCtrl.selectedProcessIndex = -1;
        // Clear the "New Process" form and prepare it for a new process
        menuItemCtrl.clearFormBuilder();
        menuItemCtrl.newProcess = {};  // Clear the New Proces form for add modal

        menuItemCtrl.cmsModulesProcessesListItems = [];   // Clear ModuleProcesses combobox
        menuItemCtrl.cmsModulesProcessesCustomizeListItems = []; // Clear ModuleProcessesCustomize combobox

        // GetAll Modules to populate Module combobox for new Process form in add modal
        menuItemCtrl.loadingCmsModule = true;
        ajax.call(cmsServerConfig.configApiServerPath+"CoreModule/getall", {}, 'POST').success(function (response) {
            menuItemCtrl.loadingCmsModule = false;
            rashaErManage.checkAction(response);
            menuItemCtrl.cmsModulesListItems = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });
    }

    menuItemCtrl.editProcess = function (showNotif) {
        if (menuItemCtrl.newProcess.LinkModuleProcessCustomizeId == undefined || menuItemCtrl.newProcess.LinkModuleProcessCustomizeId == 0 || menuItemCtrl.newProcess.LinkModuleProcessCustomizeId == null) {
            if (showNotif || showNotif == 'true')
                rashaErManage.showMessage("لطفاً انتخاب نوع بکارگیری را انتخاب کنید!");
            menuItemCtrl.showLinkModuleProcessCustomizeIdIsEmptyError = true;
            return;
        }
        try {
            menuItemCtrl.showLinkModuleProcessCustomizeIdIsEmptyError = false;
            menuItemCtrl.newProcess.ProcessCustomizationInputValue = $.trim(angular.toJson(menuItemCtrl.valueSubmit));
            menuItemCtrl.ProcessesList[menuItemCtrl.selectedProcessIndex] = menuItemCtrl.newProcess;
            menuItemCtrl.selectedItem.ProcessesJson = $.trim(angular.toJson(menuItemCtrl.ProcessesList));
            if (showNotif || showNotif == 'true')
                rashaErManage.showMessage("ویرایش انجام شد!");

        } catch (e) {
            if (showNotif)
                rashaErManage.showMessage("ویرایش انجام نشد!");
            console.log(e);
        }
    }

    // Removes all the components from formBuilder
    menuItemCtrl.clearFormBuilder = function () {
        $builder.removeAllFormObject('default');
    }

    // Clear all the comboboxes and prepares it for a new process
    menuItemCtrl.clearProcessForm = function () {
        menuItemCtrl.clearFormBuilder();
        menuItemCtrl.newProcess = {};  // Clear the New Proces form for add modal

        menuItemCtrl.cmsModulesProcessesListItems = [];   // Clear ModuleProcesses combobox
        menuItemCtrl.cmsModulesProcessesCustomizeListItems = []; // Clear ModuleProcessesCustomize combobox
        menuItemCtrl.ProcessesList = [];  // Clear the new Processes

        // GetAll Modules to populate Module combobox for new Process form in add modal
        menuItemCtrl.loadingCmsModule = true;
        ajax.call(cmsServerConfig.configApiServerPath+"CoreModule/getall", {}, 'POST').success(function (response) {
            menuItemCtrl.loadingCmsModule = false;
            rashaErManage.checkAction(response);
            menuItemCtrl.cmsModulesListItems = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });
    }

    // Load the new process when edit modal opens 
    menuItemCtrl.fillProcessForm = function (processesJson) {

        // Get Processes and and set menuItemCtrl.newProcess
        menuItemCtrl.ProcessesList = [];
        try {
            menuItemCtrl.ProcessesList = JSON.parse(processesJson);  // List of processes is parsed and assgined to ProcessesList
            if (0 < menuItemCtrl.ProcessesList.length) {
                menuItemCtrl.newProcess = menuItemCtrl.ProcessesList[0];
                menuItemCtrl.selectedProcessIndex = 0;
            }
        } catch (error) {
            menuItemCtrl.selectedItem.ProcessesJson = "[]";
            menuItemCtrl.selectedProcessIndex = -1;
        }

        // Get all the CmsModules --------------------------------------
        var engine = {};
        engine.RowPerPage = 1010;
        engine.SortColumn = "Title";
        engine.SortType = 1;
        ajax.call(cmsServerConfig.configApiServerPath+"CoreModule/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            menuItemCtrl.cmsModulesListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });

        // Load CmsModuleProcess ------------------------------

        if (menuItemCtrl.newProcess.LinkModuleId == undefined || menuItemCtrl.newProcess.LinkModuleId == null) // If there are no processes for this UniversalMenu
            menuItemCtrl.newProcess.LinkModuleId = 0;                                                          // Clear all "New Process" form andcomboboxes

        var filterValue = {
            PropertyName: "LinkModuleId",
            IntValue1: parseInt(menuItemCtrl.newProcess.LinkModuleId),
            SearchType: 0
        }
        var engine = {};
        engine.Filters = [];
        engine.Filters.push(filterValue);
        engine.RowPerPage = 100;
        engine.SortColumn = "Title";
        engine.SortType = 1;
        
        menuItemCtrl.loadingCmsModuleProcess = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcess/getall', engine, "POST").success(function (response) {
            menuItemCtrl.loadingCmsModuleProcess = false;
            rashaErManage.checkAction(response);
            menuItemCtrl.cmsModulesProcessesListItems = response.ListItems;

            if (menuItemCtrl.cmsModulesProcessesListItems.length === 0) {
                menuItemCtrl.cmsModulesProcessesCustomizeListItems = [];
                menuItemCtrl.newProcess.LinkModuleProcessId = 0;
                menuItemCtrl.newProcess.LinkModuleProcessCustomizeId = 0;
                menuItemCtrl.newProcess.ProcessCustomizationInputValue = null;
            } else {
                var filterValue = {
                    SortColumn: menuItemCtrl.cmsModulesProcessesListItems.ti,
                    PropertyName: "LinkModuleProcessId",
                    IntValue1: parseInt(menuItemCtrl.newProcess.LinkModuleProcessId),
                    SearchType: 0
                }

                engine = {};
                engine.Filters = [];
                engine.RowPerPage = 1000;
                engine.Filters.push(filterValue);
                menuItemCtrl.loadingCmsModuleProcessCustomize = true;
                ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcessCustomize/getall', engine, "POST").success(function (response) {
                    menuItemCtrl.loadingCmsModuleProcessCustomize = false;
                    rashaErManage.checkAction(response);
                    menuItemCtrl.cmsModulesProcessesCustomizeListItems = response.ListItems;
                    if (menuItemCtrl.cmsModulesProcessesCustomizeListItems.length === 0) {
                        menuItemCtrl.newProcess.LinkModuleProcessCustomizeId = 0;
                        menuItemCtrl.newProcess.ProcessCustomizationInputValue = null;
                    }

                    var length = menuItemCtrl.cmsModulesProcessesCustomizeListItems.length;
                    for (var i = 0; i < length; i++) {
                        if (menuItemCtrl.cmsModulesProcessesCustomizeListItems[i].Id == menuItemCtrl.newProcess.LinkModuleProcessCustomizeId) {
                            // Fetch component for formBuilder from CmsModuleProcessCustomize
                            var component = $.parseJSON(menuItemCtrl.cmsModulesProcessesCustomizeListItems[i].ProcessInputValueForm);
                            // Load and set the values from ProcessesJson.newProcess.ProcessCustomizationInputValue
                            var values = $.parseJSON(menuItemCtrl.newProcess.ProcessCustomizationInputValue);
                            if (component != null && component.length != undefined)
                                $.each(component, function (i, item) {
                                    $builder.addFormObject('default', item);
                                        //#help مقدار دهی فرم
                                    if (values != null && values.length != undefined)
                                        $.each(values, function (iValue, itemValue) {
                                            if (item.label == itemValue.label) {
                                                $builder.forms.default[i].id = i;
                                                menuItemCtrl.defaultValue[i] = itemValue.value;
                                            }
                                        });
                                });

                           /* // Clear privous values in formBuilder
                            if (component != null && component.length != undefined)
                                $.each(component, function (i, item) {
                                    menuItemCtrl.defaultValue[item.id] = null;
                                });
                            // Load and set the values from ProcessesJson.newProcess.ProcessCustomizationInputValue
                            var values = $.parseJSON(menuItemCtrl.newProcess.ProcessCustomizationInputValue);
                            if (values != null && values.length != undefined)
                                $.each(values, function (i, item) {
                                    menuItemCtrl.defaultValue[item.id] = item.value;
                                });*/
                        }
                    }
                }).error(function (data, errCode, c, d) {
                    menuItemCtrl.busyIndicator = false;
                    rashaErManage.checkAction(data, errCode);
                });
            }
        }).error(function (data, errCode, c, d) {
            menuItemCtrl.busyIndicator = false;
            rashaErManage.checkAction(data, errCode);
        });

    }

    menuItemCtrl.selectedProcessIndex = -1;
    menuItemCtrl.onProcessCLick = function (index, process) {
        menuItemCtrl.selectedProcessIndex = index;
        menuItemCtrl.newProcess = process;
        loadselectedProcess(process);
    }

    function loadselectedProcess(process) {
        menuItemCtrl.newProcess = process;
        // Load CmsModuleProcess ------------------------------

        if (menuItemCtrl.newProcess.LinkModuleId == undefined || menuItemCtrl.newProcess.LinkModuleId == null) // If there are no processes for this UniversalMenu
            menuItemCtrl.newProcess.LinkModuleId = 0;                                                          // Clear all "New Process" form andcomboboxes

        var filterValue = {
            PropertyName: "LinkModuleId",
            IntValue1: parseInt(menuItemCtrl.newProcess.LinkModuleId),
            SearchType: 0
        }
        var engine = {};
        engine.Filters = [];
        engine.Filters.push(filterValue);
        engine.RowPerPage = 1000;
        engine.SortColumn = "Title";
        engine.SortType = 1;
        menuItemCtrl.loadingCmsModuleProcess = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcess/getall', engine, "POST").success(function (response) {
            menuItemCtrl.loadingCmsModuleProcess = false;
            rashaErManage.checkAction(response);
            menuItemCtrl.cmsModulesProcessesListItems = response.ListItems;

            if (menuItemCtrl.cmsModulesProcessesListItems.length === 0) {
                menuItemCtrl.cmsModulesProcessesCustomizeListItems = [];
                menuItemCtrl.newProcess.LinkModuleProcessId = 0;
                menuItemCtrl.newProcess.LinkModuleProcessCustomizeId = 0;
                menuItemCtrl.newProcess.ProcessCustomizationInputValue = null;
            } else {
                var filterValue = {
                    PropertyName: "LinkModuleProcessId",
                    IntValue1: parseInt(menuItemCtrl.newProcess.LinkModuleProcessId),
                    SearchType: 0
                }

                engine = {};
                engine.Filters = [];
                engine.RowPerPage = 100;
                engine.Filters.push(filterValue);

                menuItemCtrl.loadingCmsModuleProcessCustomize = true;
                ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcessCustomize/getall', engine, "POST").success(function (response) {
                    menuItemCtrl.loadingCmsModuleProcessCustomize = false;
                    rashaErManage.checkAction(response);
                    menuItemCtrl.cmsModulesProcessesCustomizeListItems = response.ListItems;
                    if (menuItemCtrl.cmsModulesProcessesCustomizeListItems.length === 0) {
                        menuItemCtrl.newProcess.LinkModuleProcessCustomizeId = 0;
                        menuItemCtrl.newProcess.ProcessCustomizationInputValue = null;
                    }

                    var length = menuItemCtrl.cmsModulesProcessesCustomizeListItems.length;
                    for (var i = 0; i < length; i++) {
                        if (menuItemCtrl.cmsModulesProcessesCustomizeListItems[i].Id == menuItemCtrl.newProcess.LinkModuleProcessCustomizeId) {
                            menuItemCtrl.clearFormBuilder();

                            // Fetch component for formBuilder from CmsModuleProcessCustomize
                            var component = $.parseJSON(menuItemCtrl.cmsModulesProcessesCustomizeListItems[i].ProcessInputValueForm);
                            if (component != null && component.length != undefined)
                                $.each(component, function (i, item) {
                                    $builder.addFormObject('default', item);
                                });

                            // Clear privous values in formBuilder
                            if (component != null && component.length != undefined)
                                $.each(component, function (i, item) {
                                    menuItemCtrl.defaultValue[item.id] = null;
                                });
                            // Load and set the values from ProcessesJson.newProcess.ProcessCustomizationInputValue
                            try {
                                var values = $.parseJSON(menuItemCtrl.newProcess.ProcessCustomizationInputValue);
                            } catch (e) {
                                console.log(e);
                                var values = [];
                            }
                            if (values != null && values.length != undefined)
                                $.each(values, function (i, item) {
                                    menuItemCtrl.defaultValue[item.id] = item.value;
                                });
                        }
                    }
                }).error(function (data, errCode, c, d) {
                    menuItemCtrl.busyIndicator = false;
                    rashaErManage.checkAction(data, errCode);
                });
            }
        }).error(function (data, errCode, c, d) {
            menuItemCtrl.busyIndicator = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    function compare(a, b) {
        if (a.ShowInMenuOrder < b.ShowInMenuOrder)
            return -1;
        if (a.ShowInMenuOrder > b.ShowInMenuOrder)
            return 1;
        return 0;
    }

    function sortChildren(menuListItems) {
        for (var i = 0; i < menuListItems.length; i++) {
            menuListItems[i].Children.sort(compare);
        }
    }

    function searchAndDeleteFromTree(deletedItem, currentNode) {
        var i,
            currentChild,
            result;

        if (deletedItem.LinkParentId == currentNode.Id) {
            var elementPos = currentNode.Children.map(function (x) { return x.Id; }).indexOf(deletedItem.Id); // find the index of an item in an array
            if (elementPos > -1)
                currentNode.Children.splice(elementPos, 1);
            return true;
        } else {
            // Use a for loop instead of forEach to avoid nested functions
            // Otherwise "return" will not work properly
            if (currentNode.Children != undefined)
                for (i = 0; i < currentNode.Children.length; i += 1) {
                    currentChild = currentNode.Children[i];

                    // Search in the current child
                    result = searchAndDeleteFromTree(deletedItem, currentChild);

                    // Return the result if the node has been found
                    if (result !== false) {
                        return result;
                    }
                }
            // The node has not been found and we have no more options
            return false;
        }
    }

    function searchAndEditTreeItem(editedItem, currentNode) {
        var i,
            currentChild,
            result;
        if (currentNode != undefined) {
            if (editedItem.Id == currentNode.Id) {
                currentNode.Title = editedItem.Title;
                return true;
            }
        } else {
            // Use a for loop instead of forEach to avoid nested functions
            // Otherwise "return" will not work properly
            if (currentNode.Children != undefined)
                for (i = 0; i < currentNode.Children.length; i += 1) {
                    currentChild = currentNode.Children[i];

                    // Search in the current child
                    result = searchAndEditTreeItem(editedItem, currentChild);

                    // Return the result if the node has been found
                    if (result !== false) {
                        return result;
                    }
                }
            // The node has not been found and we have no more options
            return false;
        }
    }

    function searchAndAddToTree(newItem, currentNode) {
        var i,
            currentChild,
            result;
        if (newItem.LinkParentId == currentNode.Id) {
            currentNode.Children.push(newItem);
            return true;
        } else {
            //Use a for loop instead of forEach to avoid nested functions
            //Otherwise "return" will not work properly
            if (currentNode.Children != undefined)
                for (i = 0; i < currentNode.Children.length; i += 1) {
                    currentChild = currentNode.Children[i];
                    //Search in the current child
                    result = searchAndAddToTree(newItem, currentChild);
                    //Return the result if the node has been found
                    if (result !== false) {
                        return result;
                    }
                }
            //The node has not been found and we have no more options
            return false;
        }
    }

    menuItemCtrl.selectRoots = function () {
        menuItemCtrl.gridOptions.fillData(menuItemCtrl.ListParentItems, null);
    }

    menuItemCtrl.showAccessListPanel = function () {
        if (menuItemCtrl.selectedItem.AccessCheck)
            $("#setAccessPanel").fadeIn();
        else
            $("#setAccessPanel").fadeOut();
    }

    function moveAll(from, to) {
        $('#' + from + ' option').remove().appendTo('#' + to);
    }

    function moveSelected(from, to) {
        $('#' + from + ' option:selected').remove().appendTo('#' + to);
    }

    function selectAll() {
        $("select option").attr("selected", "selected");
    }

    function getWhilteList() {
        var ids = "";
        $("#to1 option").each(function () {
            ids = ids + "," + $(this).val()
        });

        return ids.substring(1);
    }

    function getBlackList() {
        var ids = "";
        $("#to2 option").each(function () {
            ids = ids + "," + $(this).val()
        });
        return ids.substring(1);
    }

    function setWhiteList(ids) {
        var idsList = [];
        if (ids != null)
            idsList = ids.split(",");
        menuItemCtrl.whiteListItems = [];
        $.each(idsList, function (index, item) {
            $.grep(menuItemCtrl.groupsListItems, function (e) {
                if (e.Id == item) {
                    menuItemCtrl.whiteListItems.push(e);
                };
            });
        });
    }

    function setBlackList(ids) {
        var idsList = [];
        if (ids != null)
            idsList = ids.split(",");
        menuItemCtrl.blackListItems = [];
        $.each(idsList, function (index, item) {
            group = $.grep(menuItemCtrl.groupsListItems, function (e) {
                if (e.Id == item) {
                    menuItemCtrl.blackListItems.push(e);
                }
            });
        });
    }

    function setParentList(ids1, ids2) {
        var idsList1 = [];
        var idsList2 = [];
        if (ids1 != undefined && ids1 != null && ids1 != "")
            idsList1 = ids1.split(",");
        if (ids2 != undefined && ids2 != null && ids2 != "")
            idsList2 = ids2.split(",");
        var parentList = [];
        if (menuItemCtrl.groupsListItems)
            for (var j = 0; j < menuItemCtrl.groupsListItems.length; j++) {
                var found = false;
                for (var i = 0; i < idsList1.length; i++) {
                    if (idsList1[i] == menuItemCtrl.groupsListItems[j].Id) {
                        found = true;
                    }
                }
                for (var i = 0; i < idsList2.length; i++) {
                    if (idsList2[i] == menuItemCtrl.groupsListItems[j].Id) {
                        found = true;
                    }
                }
                if (!found)
                    parentList.push(menuItemCtrl.groupsListItems[j]);
            }
        menuItemCtrl.parentListItems = parentList;
    }

    menuItemCtrl.toggleScheduleSettings = function (id) {
        if ($('#' + id).is(":visible") == false && menuItemCtrl.scheduleListItems == undefined) {
            menuItemCtrl.isLoading = true;
            ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerSchedule/getall', {}, "POST").success(function (response) {
                menuItemCtrl.isLoading = false;
                menuItemCtrl.scheduleListItems = response.ListItems;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }
        $('#' + id).fadeToggle();
    }
    //Export Report 
    menuItemCtrl.exportFile = function () {
        menuItemCtrl.addRequested = true;
        menuItemCtrl.gridOptions.advancedSearchData.engine.ExportFile = menuItemCtrl.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'UniversalMenumenuItem/exportfile', menuItemCtrl.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            menuItemCtrl.addRequested = false;
            rashaErManage.checkAction(response);
            menuItemCtrl.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                menuItemCtrl.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //menuItemCtrl.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    menuItemCtrl.toggleExportForm = function () {
        menuItemCtrl.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        menuItemCtrl.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        menuItemCtrl.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        menuItemCtrl.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleUniversalMenu/UniversalMenuMenuItem/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    menuItemCtrl.rowCountChanged = function () {
        if (!angular.isDefined(menuItemCtrl.ExportFileClass.RowCount) || menuItemCtrl.ExportFileClass.RowCount > 5000)
            menuItemCtrl.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    menuItemCtrl.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"UniversalMenumenuItem/count", menuItemCtrl.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            menuItemCtrl.addRequested = false;
            rashaErManage.checkAction(response);
            menuItemCtrl.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            menuItemCtrl.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);