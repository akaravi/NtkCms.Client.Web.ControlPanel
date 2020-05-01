app.controller("cmsCpMainMenuGridCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {

    var cmsCpMainMenugrd = this;

    cmsCpMainMenugrd.busyIndicator = {
        isActive: false,
        message: "در حال بار گذاری ..."
    }

    cmsCpMainMenugrd.contentbusyIndicator = {
        isActive: false,
        message: "در حال بار گذاری ..."
    }

    cmsCpMainMenugrd.gridBusyIndicator = {
        isActive: false,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    cmsCpMainMenugrd.selectedItem = {};
    cmsCpMainMenugrd.selectUniversalMenuOnUndetectableKey = false;

    //Many To Many
    //MenuItemProcesses  جدول واسط
    //ProcessesId   فیلد جدول دیگر در جدول واسط
    //MenuId  فیلد ما در جدول واسط
    cmsCpMainMenugrd.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'CmsUserGroup_Id';
    var thisTableFieldICollection = 'CmsCpMainMenuCmsUserGroup';


    ajax.call(cmsServerConfig.configApiServerPath+"CoreUserGroup/getall", {}, 'POST').success(function (response) {
        cmsCpMainMenugrd.menueGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    cmsCpMainMenugrd.hasInMany2Many = function (OtherTable) {
        if (cmsCpMainMenugrd.selectedItem[thisTableFieldICollection] == undefined) return false;
        return objectFindByKey(cmsCpMainMenugrd.selectedItem[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    };
    cmsCpMainMenugrd.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (cmsCpMainMenugrd.hasInMany2Many(OtherTable)) {
            //var index = cmsCpMainMenugrd.selectedItem[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(cmsCpMainMenugrd.selectedItem[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            cmsCpMainMenugrd.selectedItem[thisTableFieldICollection].splice(index, 1);
        } else {
            cmsCpMainMenugrd.selectedItem[thisTableFieldICollection].push(obj);
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
    //Many To Many


    //Tree Config
    cmsCpMainMenugrd.treeConfig = {
        displayMember: 'TitleML',
        displayId: 'Id',
        displayChild: 'Children'
    };

    cmsCpMainMenugrd.treeConfig.currentNode = {};
    cmsCpMainMenugrd.treeBusyIndicator = false;


    cmsCpMainMenugrd.moduleList = {};
    ajax.call(cmsServerConfig.configApiServerPath+'CoreModule/getall', {}, 'POST').success(function (response) {
        cmsCpMainMenugrd.moduleList = response.ListItems;
    });

    cmsCpMainMenugrd.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, width: '85px', type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'TitleML', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'virtual_Parent.Title', displayName: 'صفحه والد', sortable: true, type: 'link', displayForce: true },
            { name: 'ShowInMenuOrder', displayName: 'ترتیب نمایش', sortable: true, type: 'integer' },
            { name: 'ActionButton', displayName: 'تغییر ترتیب', sortable: true, type: 'string', displayForce: true, width: '85px', template: '<i class=\"fa fa-arrow-circle-up\" aria-hidden=\"true\" style=\"font-size:25px;color:#1ab394;text-align: center;\" title=\"انتقال به بالا\" ng-click=\"cmsCpMainMenugrd.editStepGoUp(x, $index)\" ng-show="cmsCpMainMenugrd.gridOptions.resultAccess.AccessEditRow"></i>&nbsp<i class=\"fa fa-arrow-circle-down\"  aria-hidden=\"true\" title=\"انتقال به پایین\" style=\"font-size:25px;color:#ec4758;text-align: center;\" ng-click=\"cmsCpMainMenugrd.editStepGoDown(x, $index)\" ng-show="cmsCpMainMenugrd.gridOptions.resultAccess.AccessEditRow"></i>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "ShowInMenuOrder",
                SortType: 0,
                NeedToRunFakePagination: false,
                TotalRowData: 200,
                RowPerPage: 200,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }

    cmsCpMainMenugrd.init = function () {
        cmsCpMainMenugrd.addRequested = true;
        cmsCpMainMenugrd.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"CoreEnum/EnumMenuPlaceType", {}, 'GET').success(function (response) {
            cmsCpMainMenugrd.MenuPlaceType = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"CoreCpMainMenu/getAllMenu", cmsCpMainMenugrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            cmsCpMainMenugrd.treeConfig.Items = response.ListItems;
            rashaErManage.checkAction(response);
            cmsCpMainMenugrd.ListItems = response.ListItems;
            cmsCpMainMenugrd.ListParentItems = cmsCpMainMenugrd.selectParents();
            cmsCpMainMenugrd.gridOptions.fillData(cmsCpMainMenugrd.ListParentItems, response.resultAccess);
            cmsCpMainMenugrd.gridOptions.resultAccess = response.resultAccess;//دسترسی ها نمایش
            cmsCpMainMenugrd.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsCpMainMenugrd.gridOptions.totalRowCount = response.TotalRowCount;
            cmsCpMainMenugrd.gridOptions.rowPerPage = response.RowPerPage;
            cmsCpMainMenugrd.gridOptions.maxSize = 5;
            cmsCpMainMenugrd.addRequested = false;
            cmsCpMainMenugrd.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            cmsCpMainMenugrd.gridOptions.fillData();
            console.log(data);
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Tree On Node Select Options
    cmsCpMainMenugrd.treeConfig.onNodeSelect = function () {
        var node = cmsCpMainMenugrd.treeConfig.currentNode;
        cmsCpMainMenugrd.gridOptions.selectedRow.item = cmsCpMainMenugrd.treeConfig.currentNode;
        // cmsCpMainMenugrd.LinkParentIdMemo remembers the real LinkParentId of the selectedRow in order it later when loading open or edit modal
        cmsCpMainMenugrd.LinkParentIdMemo = cmsCpMainMenugrd.selectedItem.LinkParentId;
        if (node != null) { // Root is selected
            cmsCpMainMenugrd.selectedItem.LinkParentId = node.Id;
            cmsCpMainMenugrd.selectContent(node);
        }
        else {
            cmsCpMainMenugrd.selectRoots();
        }
    }

    //Show Content with Category Id
    cmsCpMainMenugrd.selectContent = function (node) {
        cmsCpMainMenugrd.busyIndicator.message = "در حال بارگذاری... " + node.Title;
        cmsCpMainMenugrd.busyIndicator.isActive = true;
        cmsCpMainMenugrd.gridOptions.advancedSearchData.engine.Filters = null;
        cmsCpMainMenugrd.gridOptions.advancedSearchData.engine.Filters = [];
        var s = {
            PropertyName: "LinkParentId",
            IntValue1: node.Id,
            SearchType: 0
        }
        cmsCpMainMenugrd.gridOptions.advancedSearchData.engine.Filters.push(s);
        ajax.call(cmsServerConfig.configApiServerPath+"CoreCpMainMenu/GetAll", cmsCpMainMenugrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsCpMainMenugrd.busyIndicator.isActive = false;
            cmsCpMainMenugrd.ListItems = response.ListItems;
            cmsCpMainMenugrd.gridOptions.fillData(cmsCpMainMenugrd.ListItems, response.resultAccess);
            cmsCpMainMenugrd.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsCpMainMenugrd.gridOptions.totalRowCount = response.TotalRowCount;
            cmsCpMainMenugrd.gridOptions.rowPerPage = response.RowPerPage;
            cmsCpMainMenugrd.gridOptions.maxSize = 5;

        }).error(function (data, errCode, c, d) {
            cmsCpMainMenugrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            cmsCpMainMenugrd.busyIndicator.isActive = false;
        });
    }

    // Open Add New Content Modal
    cmsCpMainMenugrd.addRequested = false;
    cmsCpMainMenugrd.openAddContentModal = function () {
        cmsCpMainMenugrd.modalTitle = 'اضافه';
         var node = cmsCpMainMenugrd.treeConfig.currentNode;
         
            
        ajax.call(cmsServerConfig.configApiServerPath+'CoreCpMainMenu/getall', {}, 'POST').success(function (response) {
            // To define an array otherwise cmsCpMainMenugrd.selectedItem[thisTableFieldICollection] will be detected as an object
            cmsCpMainMenugrd.selectedItem[thisTableFieldICollection] = [];
            cmsCpMainMenugrd.ListParentItems = response.ListItems;
            cmsCpMainMenugrd.busyIndicator.isActive = false;
        });
        ajax.call(cmsServerConfig.configApiServerPath+'CoreCpMainMenu/GetViewModel', '', 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsCpMainMenugrd.selectedItem = response.Item;
            if (node != null) 
            {
                if(node.Id != 0 || node.Id ) 
                {
                    cmsCpMainMenugrd.selectedItem.LinkParentId=node.Id;
                }
            }
            cmsCpMainMenugrd.selectedItem.isDependencyModule = false;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsCpMainMenu/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Add a Content
    cmsCpMainMenugrd.addNewRow = function (frm) {
        if (frm.$invalid)
            return;
        cmsCpMainMenugrd.busyIndicator.isActive = true;
        cmsCpMainMenugrd.addRequested = true;
        if (cmsCpMainMenugrd.selectedItem.isDependencyModule == false || cmsCpMainMenugrd.selectedItem.isDependencyModule == undefined)
            cmsCpMainMenugrd.selectedItem.LinkModuleId = null;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreCpMainMenu/add', cmsCpMainMenugrd.selectedItem, 'POST').success(function (response) {
            cmsCpMainMenugrd.busyIndicator.isActive = false;
            cmsCpMainMenugrd.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsCpMainMenugrd.ListItems.push(response.Item);
                if (response.Item.LinkParentId == null) {
                    // Do nothing یک روت اضافه شده است
                }
                else
                    for (var i = 0; i < cmsCpMainMenugrd.treeConfig.Items.length; i++) {
                        searchAndAddToTree(response.Item, cmsCpMainMenugrd.treeConfig.Items[i]);
                    }
                cmsCpMainMenugrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsCpMainMenugrd.addRequested = false;
            cmsCpMainMenugrd.busyIndicator.isActive = false;

        });
    }

    function searchTree(element, matchingId) {
        if (element.Id == matchingId) {
            return element;
        } else if (element.Children != undefined || element.Children != null) {
            var i;
            var result = null;
            for (i = 0; result == null && i < element.Children.length; i++) {
                result = searchTree(element.Children[i].Id, matchingId);
            }
            return result;
        }
        return null;
    }

    // Open Edit Content Modal
    cmsCpMainMenugrd.openEditContentModal = function () {
        if (buttonIsPressed) { return };
        cmsCpMainMenugrd.modalTitle = 'ویرایش';
        if (!cmsCpMainMenugrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        cmsCpMainMenugrd.CmsUserGroup_Id = [];
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreCpMainMenu/GetOne', cmsCpMainMenugrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            cmsCpMainMenugrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsCpMainMenu/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Edit a Content
    cmsCpMainMenugrd.editRow = function (frm) {
        if (frm.$invalid)
            return;
        cmsCpMainMenugrd.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreCpMainMenu/edit', cmsCpMainMenugrd.selectedItem, 'PUT').success(function (response) {
            cmsCpMainMenugrd.addRequested = false;
            cmsCpMainMenugrd.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                $.each(cmsCpMainMenugrd.ListItems, function (index, item) {
                    if (item.Id == response.Item.Id) {
                        var index = cmsCpMainMenugrd.ListItems.indexOf(item);
                        cmsCpMainMenugrd.ListItems[index] = response.Item;
                    }
                });
                for (var i = 0; i < cmsCpMainMenugrd.treeConfig.Items.length; i++) {
                    searchAndEditTreeItem(cmsCpMainMenugrd.selectedItem, cmsCpMainMenugrd.treeConfig.Items[i]);
                }
                cmsCpMainMenugrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsCpMainMenugrd.addRequested = false;
        });
    }

    cmsCpMainMenugrd.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsCpMainMenugrd.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsCpMainMenugrd.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsCpMainMenugrd.ListItems.indexOf(item);
                cmsCpMainMenugrd.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsCpMainMenugrd.ListItems.unshift(newItem);
    }

    // Delete a Content
    cmsCpMainMenugrd.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!cmsCpMainMenugrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(cmsCpMainMenugrd.gridOptions.selectedRow.item);
                cmsCpMainMenugrd.busyIndicator.isActive = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'CoreCpMainMenu/GetOne', cmsCpMainMenugrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    cmsCpMainMenugrd.selectedItemForDelete = response.Item;
                    console.log(cmsCpMainMenugrd.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreCpMainMenu/delete', cmsCpMainMenugrd.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsCpMainMenugrd.replaceItem(cmsCpMainMenugrd.selectedItemForDelete.Id);
                            cmsCpMainMenugrd.gridOptions.fillData(cmsCpMainMenugrd.ListItems);
                            if (cmsCpMainMenugrd.selectedItemForDelete.LinkParentId == null) {
                                var elementPos = cmsCpMainMenugrd.treeConfig.Items.map(function (x) { return x.Id; }).indexOf(cmsCpMainMenugrd.selectedItemForDelete.Id); // find the index of an item in an array
                                cmsCpMainMenugrd.treeConfig.Items.splice(elementPos, 1);
                            } else
                                for (var i = 0; i < cmsCpMainMenugrd.treeConfig.Items.length; i++) {
                                    searchAndDeleteFromTree(cmsCpMainMenugrd.selectedItemForDelete, cmsCpMainMenugrd.treeConfig.Items[i]);
                                }
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
                cmsCpMainMenugrd.busyIndicator.isActive = false;
            }
        });
    }

    cmsCpMainMenugrd.searchData = function () {
        cmsCpMainMenugrd.addRequested = true;
        cmsCpMainMenugrd.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"CoreCpMainMenu/getAll", cmsCpMainMenugrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsCpMainMenugrd.responseListItems = response.ListItems;
            cmsCpMainMenugrd.gridOptions.fillData(cmsCpMainMenugrd.responseListItems);
            cmsCpMainMenugrd.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsCpMainMenugrd.gridOptions.totalRowCount = response.TotalRowCount;
            cmsCpMainMenugrd.gridOptions.rowPerPage = response.RowPerPage;
            cmsCpMainMenugrd.gridOptions.maxSize = 5;
            cmsCpMainMenugrd.addRequested = false;
            cmsCpMainMenugrd.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            cmsCpMainMenugrd.gridOptions.fillData();
            console.log(data);
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Selector directive config
    cmsCpMainMenugrd.LinkParentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkParentId',
        url: 'CmsCpMainMenu',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'CmsCpMainMenu',
        rowPerPage: 200,
        scope: cmsCpMainMenugrd,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true,type:'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true,type:'string' }
            ]
        }
    }

    cmsCpMainMenugrd.gridOptions.reGetAll = function () {
        if (cmsCpMainMenugrd.gridOptions.advancedSearchData.engine.Filters.length == 0)
            cmsCpMainMenugrd.init();
        else
            cmsCpMainMenugrd.searchData();
    }

    cmsCpMainMenugrd.gridOptions.onRowSelected = function () { }

    cmsCpMainMenugrd.columnCheckbox = false;

    cmsCpMainMenugrd.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (cmsCpMainMenugrd.gridOptions.columnCheckbox) {
            for (var i = 0; i < cmsCpMainMenugrd.gridOptions.columns.length; i++) {
                var element = $("#" + cmsCpMainMenugrd.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                cmsCpMainMenugrd.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = cmsCpMainMenugrd.gridOptions.columns;
            for (var i = 0; i < cmsCpMainMenugrd.gridOptions.columns.length; i++) {
                cmsCpMainMenugrd.gridOptions.columns[i].visible = true;
                var element = $("#" + cmsCpMainMenugrd.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + cmsCpMainMenugrd.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < cmsCpMainMenugrd.gridOptions.columns.length; i++) {
            console.log(cmsCpMainMenugrd.gridOptions.columns[i].name.concat(".visible: "), cmsCpMainMenugrd.gridOptions.columns[i].visible);
        }
        cmsCpMainMenugrd.gridOptions.columnCheckbox = !cmsCpMainMenugrd.gridOptions.columnCheckbox;
    }

    cmsCpMainMenugrd.selectParents = function () {
        var length = cmsCpMainMenugrd.ListItems.length;
        var prenetListItems = [];
        for (var i = 0; i < length; i++) {
            if (cmsCpMainMenugrd.ListItems[i].LinkParentId == null || cmsCpMainMenugrd.ListItems[i].LinkParentId == undefined)
                prenetListItems.push(cmsCpMainMenugrd.ListItems[i]);
        }
        return prenetListItems;
    }

    cmsCpMainMenugrd.editStepGoUp = function (item, index) {
        if (index == 0) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Top_Of_The_List'));
            return;
        }
        cmsCpMainMenugrd.gridBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreCpMainMenu/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            cmsCpMainMenugrd.selectedItem = response1.Item;
            var temp = response1.Item.ShowInMenuOrder;
            cmsCpMainMenugrd.selectedItem.ShowInMenuOrder = cmsCpMainMenugrd.gridOptions.data[index - 1].ShowInMenuOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'CoreCpMainMenu/edit', cmsCpMainMenugrd.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreCpMainMenu/GetOne', cmsCpMainMenugrd.gridOptions.data[index - 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        cmsCpMainMenugrd.selectedItem = response3.Item;
                        cmsCpMainMenugrd.selectedItem.ShowInMenuOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'CoreCpMainMenu/edit', cmsCpMainMenugrd.selectedItem, 'PUT').success(function (response4) {
                            cmsCpMainMenugrd.gridBusyIndicator.isActive = false;
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
                                cmsCpMainMenugrd.gridOptions.data[index - 1].ShowInMenuOrder = response4.Item.ShowInMenuOrder;
                                // Swap two items in the grid ListItems
                                cmsCpMainMenugrd.gridOptions.data[index] = cmsCpMainMenugrd.gridOptions.data.splice(index - 1, 1, cmsCpMainMenugrd.gridOptions.data[index])[0];
                                //cmsCpMainMenugrd.gridOptions.fillData(cmsCpMainMenugrd.gridOptions.data);

                                // Swap two items in the grid ListItems
                                if (item.LinkParentId == null) {
                                    var elementPos = cmsCpMainMenugrd.treeConfig.Items.map(function (x) { return x.Id; }).indexOf(item.Id); // find the index of an item in an array
                                    cmsCpMainMenugrd.treeConfig.Items[elementPos] = cmsCpMainMenugrd.treeConfig.Items.splice(elementPos - 1, 1, cmsCpMainMenugrd.treeConfig.Items[elementPos])[0];
                                }
                                else
                                    var elementPos = cmsCpMainMenugrd.treeConfig.Items.map(function (x) { return x.Id; }).indexOf(item.Id); // find the index of an item in an array
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

    cmsCpMainMenugrd.editStepGoDown = function (item, index) {
        if (index == cmsCpMainMenugrd.gridOptions.data.length - 1) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Bottom_Of_The_List'));
            return;
        }
        cmsCpMainMenugrd.gridBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreCpMainMenu/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            cmsCpMainMenugrd.selectedItem = response1.Item;
            var temp = response1.Item.ShowInMenuOrder;
            cmsCpMainMenugrd.selectedItem.ShowInMenuOrder = cmsCpMainMenugrd.gridOptions.data[index + 1].ShowInMenuOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'CoreCpMainMenu/edit', cmsCpMainMenugrd.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreCpMainMenu/GetOne', cmsCpMainMenugrd.gridOptions.data[index + 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        cmsCpMainMenugrd.selectedItem = response3.Item;
                        cmsCpMainMenugrd.selectedItem.ShowInMenuOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'CoreCpMainMenu/edit', cmsCpMainMenugrd.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            cmsCpMainMenugrd.gridBusyIndicator.isActive = false;
                            if (response4.IsSuccess) {
                                var engine = {};
                                engine.Filters = null;
                                engine.Filters = [];
                                var filterDataModel = {
                                    PropertyName: "LinkParentId",
                                    IntValue1: item.LinkParentId,
                                    SearchType: 0
                                };
                                cmsCpMainMenugrd.gridOptions.data[index + 1] = response4.Item;
                                // Swap two items in the grid ListItems
                                cmsCpMainMenugrd.gridOptions.data[index] = cmsCpMainMenugrd.gridOptions.data.splice(index + 1, 1, cmsCpMainMenugrd.gridOptions.data[index])[0];
                                cmsCpMainMenugrd.gridOptions.fillData(cmsCpMainMenugrd.gridOptions.data);
                                var elementPos = cmsCpMainMenugrd.treeConfig.Items.map(function (x) { return x.Id; }).indexOf(item.Id); // find the index of an item in an array
                                // Swap two items in the grid ListItems
                                cmsCpMainMenugrd.treeConfig.Items[elementPos] = cmsCpMainMenugrd.treeConfig.Items.splice(elementPos + 1, 1, cmsCpMainMenugrd.treeConfig.Items[elementPos])[0];
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

    cmsCpMainMenugrd.selectRoots = function () {
        cmsCpMainMenugrd.gridOptions.fillData(cmsCpMainMenugrd.ListParentItems, null);
    }

    //------------------------ Add, edit and delete an Item to and from Tree Menu -------------------------------
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

        if (editedItem.Id == currentNode.Id) {
            currentNode.Title = editedItem.Title;
            return true;
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

    function searchAndSwapTreeItem(selectedItem, currentNode, dir) {
        var i,
            currentChild,
            result;

        if (selectedItem.LinkParentId == currentNode.Id) {
            //currentNode.Title = selectedItem.Title;
            var elementPos = menuItemCtrl.treeConfig.currentNode.Children.map(function (x) { return x.Id; }).indexOf(item.Id); // find the index of an item in an array
            // Swap two items in the grid ListItems
            if (dir = "down")
                currentNode.Children[elementPos] = currentNode.Children.splice(elementPos + 1, 1, currentNode.Children[elementPos])[0];
            else
                menuItemCtrl.treeConfig.currentNode.Children[elementPos] = menuItemCtrl.treeConfig.currentNode.Children.splice(elementPos + 1, 1, menuItemCtrl.treeConfig.currentNode.Children[elementPos])[0];
            return true;
        } else {
            // Use a for loop instead of forEach to avoid nested functions
            // Otherwise "return" will not work properly
            if (currentNode.Children != undefined)
                for (i = 0; i < currentNode.Children.length; i += 1) {
                    currentChild = currentNode.Children[i];

                    // Search in the current child
                    result = searchAndSwapTreeItem(selectedItem, currentChild);

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
    //--------

}]);