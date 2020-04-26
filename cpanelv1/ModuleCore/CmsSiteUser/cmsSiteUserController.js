app.controller("cmsSiteUserGridCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var cmsSiteUser = this;
    cmsSiteUser.ManageUserAccessControllerTypes = [];
    cmsSiteUser.LinkSiteId=0;
    cmsSiteUser.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    var date = moment().format();
    cmsSiteUser.ExpireDate = {
        defaultDate: date
    }
    if (itemRecordStatus != undefined) cmsSiteUser.itemRecordStatus = itemRecordStatus;
    cmsSiteUser.init = function () {
        cmsSiteUser.busyIndicator.isActive = true;
        cmsSiteUser.gridOptions.advancedSearchData.engine.RowPerPage = 20;
        ajax.call(cmsServerConfig.configApiServerPath+"CoreSiteUser/getall", cmsSiteUser.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSiteUser.ListItems = response.ListItems;
            cmsSiteUser.gridOptions.fillData(cmsSiteUser.ListItems, response.resultAccess);
            cmsSiteUser.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsSiteUser.gridOptions.totalRowCount = response.TotalRowCount;
            cmsSiteUser.gridOptions.rowPerPage = response.RowPerPage;
            cmsSiteUser.gridOptions.maxSize = 5;
            var model = {};
            model.SortType = 1;
            model.SortColumn = "Id";
            //ajax.call(cmsServerConfig.configApiServerPath+"CoreSite/getallwithalias", model, 'POST').success(function (response) {
            //    rashaErManage.checkAction(response);
            //    cmsSiteUser.cmsSitesListItems = response.ListItems;
            //    ajax.call(cmsServerConfig.configApiServerPath+"CoreUser/getall", {}, 'POST').success(function (response) {
            //        rashaErManage.checkAction(response);
            //        cmsSiteUser.cmsUsersListItems = response.ListItems;
            //            cmsSiteUser.gridOptions.myfilterText(cmsSiteUser.ListItems, "LinkSiteId", cmsSiteUser.cmsSitesListItems, "Title", "LinkSiteTitle");
            //            cmsSiteUser.gridOptions.myfilterText(cmsSiteUser.ListItems, "LinkUserId", cmsSiteUser.cmsUsersListItems, "Username", "LinkUserTitle");
            //            cmsSiteUser.gridOptions.myfilterText(cmsSiteUser.ListItems, "LinkUserGroupId", cmsSiteUser.cmsUserGroups, "Title", "LinkUserGroupTitle");
            cmsSiteUser.busyIndicator.isActive = false;
            //    }).error(function (data, errCode, c, d) {
            //        rashaErManage.checkAction(data, errCode);
            //    });
            //}).error(function (data, errCode, c, d) {
            //    rashaErManage.checkAction(data, errCode);
            //});
        }).error(function (data, errCode, c, d) {
            cmsSiteUser.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"CoreSite/getall", cmsSiteUser.gridOptionsSite.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSiteUser.busyIndicator.isActive = false;
            cmsSiteUser.ListItemsSite = response.ListItems;
            cmsSiteUser.gridOptionsSite.fillData(cmsSiteUser.ListItemsSite, response.resultAccess);
            cmsSiteUser.gridOptionsSite.currentPageNumber = response.CurrentPageNumber;
            cmsSiteUser.gridOptionsSite.totalRowCount = response.TotalRowCount;
            cmsSiteUser.gridOptionsSite.rowPerPage = response.RowPerPage;
            cmsSiteUser.allowedSearch = response.AllowedSearchField;

        }).error(function (data, errCode, c, d) {
            cmsSiteUser.busyIndicator.isActive = false;
            cmsSiteUser.gridOptionsSite.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"CoreUserGroup/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSiteUser.cmsUserGroups = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
        cmsSiteUser.inputSiteChanged(null);
        cmsSiteUser.inputUserChanged(null);
    }
    cmsSiteUser.addRequested = false;
    cmsSiteUser.openAddModal = function () {
        if (buttonIsPressed) { return };
        cmsSiteUser.modalTitle = 'اضافه';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreSiteUser/GetViewModel', '', 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            cmsSiteUser.selectedItem = response.Item;
            cmsSiteUser.selectedItem.LinkSiteId=cmsSiteUser.LinkSiteId;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsSiteUser/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsSiteUser.addNewRow = function (frm) {
        if (frm.$invalid)
            return;
        if (cmsSiteUser.selectedItem.LinkSiteId == null || cmsSiteUser.selectedItem.LinkUserId == null)
            return;
        //برای جلوگیر ی از وارد کردن اطلاعات تکراری
        for (var i = 0; i < cmsSiteUser.ListItems.length; i++) {
            if (cmsSiteUser.selectedItem.LinkSiteId == cmsSiteUser.ListItems[i].LinkSiteId &&
                cmsSiteUser.selectedItem.LinkUserId == cmsSiteUser.ListItems[i].LinkUserId &&
                cmsSiteUser.selectedItem.LinkUserGroupId == cmsSiteUser.ListItems[i].LinkUserGroupId) {
                rashaErManage.showMessage($filter('translatentk')('Information_Is_Duplicate'));
                return;
            }
        }
        cmsSiteUser.addRequested = true;
        cmsSiteUser.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreSiteUser/add', cmsSiteUser.selectedItem, 'POST').success(function (response1) {
            rashaErManage.checkAction(response1);
            if (response1.IsSuccess) {
                ajax.call(cmsServerConfig.configApiServerPath+'CoreSite/GetOne', response1.Item.LinkSiteId, 'GET').success(function (response2) {
                    response1.Item.virtual_CmsSite = { Title: response2.Item.Title };
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/GetOne', response1.Item.LinkUserId, 'GET').success(function (response3) {
                        response1.Item.virtual_CmsUser = { Username: response3.Item.Username };
                        cmsSiteUser.ListItems.unshift(response1.Item);
                        cmsSiteUser.gridOptions.myfilterText(cmsSiteUser.ListItems, "LinkUserGroupId", cmsSiteUser.cmsUserGroups, "Title", "LinkUserGroupTitle");
                        cmsSiteUser.gridOptions.fillData(cmsSiteUser.ListItems);
                        //cmsSiteUser.replaceItem(cmsSiteUser.selectedItem.Id, response1.Item);
                        cmsSiteUser.addRequested = false;
                        cmsSiteUser.busyIndicator.isActive = false;
                        //cmsSiteUser.gridOptions.fillData(cmsSiteUser.ListItems, response.resultAccess);
                        cmsSiteUser.closeModal();
                    }).error(function (data, errCode, c, d) {
                        cmsSiteUser.addRequested = false;
                        cmsSiteUser.busyIndicator.isActive = false;
                        rashaErManage.checkAction(data, errCode);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
                //var listItems = []; listItems.push(response.Item);
                //cmsSiteUser.gridOptions.myfilterText(listItems, "LinkSiteId", cmsSiteUser.cmsSitesListItems, "Title", "LinkSiteTitle");
                //cmsSiteUser.gridOptions.myfilterText(listItems, "LinkUserId", cmsSiteUser.cmsUsersListItems, "Username", "LinkUserTitle");
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsSiteUser.addRequested = false;
            cmsSiteUser.busyIndicator.isActive = false;

        });
    }

    cmsSiteUser.openEditModal = function () {
        if (buttonIsPressed) { return };
        cmsSiteUser.modalTitle = 'ویرایش';
        if (!cmsSiteUser.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreSiteUser/GetOne', cmsSiteUser.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            cmsSiteUser.selectedItem = response.Item;
            cmsSiteUser.ExpireDate.defaultDate = cmsSiteUser.selectedItem.ExpireDate;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsSiteUser/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    cmsSiteUser.editRow = function (frm) {
        if (frm.$invalid)
            return;
        //برای جلوگیر ی از وارد کردن اطلاعات تکراری
        for (var i = 0; i < cmsSiteUser.ListItems.length; i++) {
            if (cmsSiteUser.selectedItem.LinkSiteId == cmsSiteUser.ListItems[i].LinkSiteId &&
                cmsSiteUser.selectedItem.LinkUserId == cmsSiteUser.ListItems[i].LinkUserId &&
                cmsSiteUser.selectedItem.LinkUserGroupId == cmsSiteUser.ListItems[i].LinkUserGroupId) {
                if (cmsSiteUser.selectedItem.Id != cmsSiteUser.ListItems[i].Id) {
                    rashaErManage.showMessage($filter('translatentk')('Information_Is_Duplicate'));
                    return;
                }
            }
        }
        cmsSiteUser.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreSiteUser/edit', cmsSiteUser.selectedItem, 'PUT').success(function (response1) {
            cmsSiteUser.addRequested = true;
            rashaErManage.checkAction(response1);
            if (response1.IsSuccess) {
                ajax.call(cmsServerConfig.configApiServerPath+'CoreSite/GetOne', response1.Item.LinkSiteId, 'GET').success(function (response2) {
                    response1.Item.virtual_CmsSite = { Title: response2.Item.Title };
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/GetOne', response1.Item.LinkUserId, 'GET').success(function (response3) {
                        response1.Item.virtual_CmsUser = { Username: response3.Item.Username };
                        cmsSiteUser.replaceItem(cmsSiteUser.selectedItem.Id, response1.Item);
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
                //var listItems = []; listItems.push(response.Item);
                //cmsSiteUser.gridOptions.myfilterText(listItems, "LinkSiteId", cmsSiteUser.cmsSitesListItems, "Title", "LinkSiteTitle");
                //cmsSiteUser.gridOptions.myfilterText(listItems, "LinkUserId", cmsSiteUser.cmsUsersListItems, "Username", "LinkUserTitle");
                //cmsSiteUser.gridOptions.myfilterText(listItems, "LinkUserGroupId", cmsSiteUser.cmsUserGroups, "Title", "LinkUserGroupTitle");
                cmsSiteUser.busyIndicator.isActive = false;
                cmsSiteUser.gridOptions.fillData(cmsSiteUser.ListItems, response1.resultAccess);
                cmsSiteUser.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsSiteUser.addRequested = false;
            cmsSiteUser.busyIndicator.isActive = false;
        });
    }

    cmsSiteUser.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsSiteUser.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsSiteUser.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsSiteUser.ListItems.indexOf(item);
                cmsSiteUser.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsSiteUser.ListItems.unshift(newItem);
    }

    cmsSiteUser.deleteRow = function () {
        if (buttonIsPressed) { return };
        if (!cmsSiteUser.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'CoreSiteUser/GetOne', cmsSiteUser.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;

                    rashaErManage.checkAction(response);
                    cmsSiteUser.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreSiteUser/delete', cmsSiteUser.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsSiteUser.replaceItem(cmsSiteUser.selectedItemForDelete.Id);
                            cmsSiteUser.gridOptions.fillData(cmsSiteUser.ListItems);
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

    cmsSiteUser.searchData = function () {
        cmsSiteUser.gridOptions.serachData();
    }
    cmsSiteUser.LinkUserIdSelector = {
        displayMember: 'Name',
        id: 'Id',
        fId: 'LinkUserId',
        url: 'coreuser',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: cmsSiteUser,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Username', displayName: 'نام کاربری', sortable: true, type: 'string' },
                { name: 'Name', displayName: 'نام', sortable: true, type: 'string' },
                { name: 'LastName', displayName: 'نام خانوادگی', sortable: true, type: 'string' }
            ]
        }
    }
    cmsSiteUser.LinkSiteIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkSiteId',
        url: 'coresite',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: cmsSiteUser,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
                { name: 'Domain', displayName: 'دامنه', sortable: true, type: 'string' }
            ]
        }
    }
cmsSiteUser.gridOptionsSite = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'ExpireDate', displayName: 'تاریخ انقضا', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'BaseUrl', displayName: 'آدرس پایه', sortable: true, type: 'string' },
            { name: 'Domain', displayName: 'دامنه', sortable: true, type: 'string' },
            { name: 'SubDomain', displayName: 'زیر دامنه', sortable: true, type: 'string' },
            { name: 'OwnerSiteSetStatusTitle', displayName: 'وضعیت', sortable: true, type: 'string' }
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
                RowPerPage: 200,
                ContentFullSearch: null,
                Filters: [],
                Count: false
            }
        }
    }

    cmsSiteUser.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkUserId', displayName: 'کد سیستمی کاربر', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            //{ name: 'LinkUserTitle', displayName: 'نام کاربری کاربر', sortable: true, type: 'link', displayForce: true },
            //{ name: 'LinkSiteTitle', displayName: 'عنوان سایت', sortable: true, type: 'link', displayForce: true },
            //{ name: 'LinkUserGroupTitle', displayName: 'گروه کاربر', sortable: true, type: 'link', displayForce: true }
            { name: 'virtual_CmsUser.Username', displayName: 'نام کاربری کاربر', sortable: true, type: 'link', displayForce: true },
            { name: 'virtual_CmsSite.Title', displayName: 'عنوان سایت', sortable: true, type: 'link', displayForce: true },
            { name: 'virtual_CmsUserGroup.Title', displayName: 'گروه کاربر', sortable: true, type: 'link', displayForce: true }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {
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
    }

    cmsSiteUser.gridOptions.reGetAll = function () {
        cmsSiteUser.init();
    }

    cmsSiteUser.gridOptions.onRowSelected = function () { }

    cmsSiteUser.gridOptionsSite.onRowSelected = function () {
        var node=cmsSiteUser.gridOptionsSite.selectedRow.item;
        cmsSiteUser.LinkSiteId=cmsSiteUser.gridOptionsSite.selectedRow.item.Id;
        cmsSiteUser.selectContent(node);
    }

 //Show Content with Category Id
    cmsSiteUser.selectContent = function (node) {
        cmsSiteUser.gridOptions.advancedSearchData.engine.Filters = null;
        cmsSiteUser.gridOptions.advancedSearchData.engine.Filters = [];
        var nodeTitle='';        
        nodeId='';
        if(node !=null && node != undefined)
        {       
            nodeId=node.Id;
            nodeTitle=node.Title;
        }
        var filterModel = {
                Filters: [{
                    PropertyName: "LinkSiteId",
                    IntValue1: nodeId,
                    SearchType: 0,
                }]
               
            };
       
        ajax.call(cmsServerConfig.configApiServerPath+"CoreSiteUser/getall", filterModel, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSiteUser.ListItems = response.ListItems;
            cmsSiteUser.gridOptions.fillData(cmsSiteUser.ListItems, response.resultAccess);
            cmsSiteUser.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsSiteUser.gridOptions.totalRowCount = response.TotalRowCount;
            cmsSiteUser.gridOptions.rowPerPage = response.RowPerPage;
            cmsSiteUser.gridOptions.maxSize = 5;
            }).error(function (data, errCode, c, d) {
                cmsSiteUser.gridOptions.fillData();
                rashaErManage.checkAction(data, errCode);
            });
        
    };
    // Filter Texts
    cmsSiteUser.gridOptions.myfilterText = function (gridListItems, foreignKeyName, childListItems, childDesiredPropertyName, childItemColumnName) {
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
    //ngautocomplete
    cmsSiteUser.siteSelected = function (selected) {
        if (selected) {
            cmsSiteUser.selectedItem.LinkSiteId = selected.originalObject.Id;
        } else {
            cmsSiteUser.selectedItem.LinkSiteId = null;
        }
    }
    //ngautocomplete
    cmsSiteUser.userSelected = function (selected) {
        if (selected) {
            cmsSiteUser.selectedItem.LinkUserId = selected.originalObject.Id;
        } else {
            cmsSiteUser.selectedItem.LinkUserId = null;
        }
    }
    //ngautocomplete
    cmsSiteUser.inputSiteChanged = function (input) {
        var engine = { Filters: [] };
        engine.Filters.push({ PropertyName: "Title", SearchType: 5, StringValue1: input, ClauseType: 1 });
        engine.Filters.push({ PropertyName: "SubDomain", SearchType: 5, StringValue1: input, ClauseType: 1 });
        //engine.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: input });
        ajax.call(cmsServerConfig.configApiServerPath+"CoreSite/search", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSiteUser.cmsSitesListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //ngautocomplete
    cmsSiteUser.inputUserChanged = function (input) {
        var engine = { Filters: [] };
        engine.Filters.push({ PropertyName: "Name", SearchType: 5, StringValue1: input, ClauseType: 1 });
        engine.Filters.push({ PropertyName: "LastName", SearchType: 5, StringValue1: input, ClauseType: 1 });
        //engine.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: input });
        ajax.call(cmsServerConfig.configApiServerPath+"CoreUser/search", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSiteUser.cmsUsersListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
           rashaErManage.checkAction(data, errCode);
        });
    }

    cmsSiteUser.filterEnumSiteCategory = function (item) {
        for (var j = 0; j < cmsSiteUser.CategoryListItems.length; j++) {
            if (item.LinkSiteCategoryId == cmsSiteUser.CategoryListItems[j].Id) {
                item.virtual_CmsSiteCategory = {};
                item.virtual_CmsSiteCategory.Title = "";
                item.virtual_CmsSiteCategory.Title = cmsSiteUser.CategoryListItems[j].Title;
            }
        }
    }

    cmsSiteUser.filterEnumOwnerSiteSetStatus = function (ListItemsOrItem) {
        if (!ListItemsOrItem.length) { // It's an Item
            for (var j = 0; j < cmsSiteUser.OwnerSiteSetStatusListItems.length; j++) {
                if (ListItemsOrItem.OwnerSiteSetStatus == cmsSiteUser.OwnerSiteSetStatusListItems[j].Id) {
                    ListItemsOrItem.OwnerSiteSetStatusTitle = cmsSiteUser.OwnerSiteSetStatusListItems[j].Title;
                }
            }
        }
        else { // It's a Listitems
            for (var i = 0; i < ListItemsOrItem.length; i++) {
                for (var j = 0; j < cmsSiteUser.OwnerSiteSetStatusListItems.length; j++) {
                    if (ListItemsOrItem[i].OwnerSiteSetStatus == cmsSiteUser.OwnerSiteSetStatusListItems[j].Id) {
                        ListItemsOrItem[i].OwnerSiteSetStatusTitle = cmsSiteUser.OwnerSiteSetStatusListItems[j].Title;
                    }
                }
            }
        }
    }
    //Export Report 
    cmsSiteUser.exportFile = function () {
        cmsSiteUser.addRequested = true;
        cmsSiteUser.gridOptions.advancedSearchData.engine.ExportFile = cmsSiteUser.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreSite/exportfile', cmsSiteUser.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            cmsSiteUser.addRequested = false;
            rashaErManage.checkAction(response);
            cmsSiteUser.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //cmsSiteUser.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    cmsSiteUser.toggleExportForm = function () {
        cmsSiteUser.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        cmsSiteUser.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        cmsSiteUser.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        cmsSiteUser.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCore/CmsSiteUser/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    cmsSiteUser.rowCountChanged = function () {
        if (!angular.isDefined(cmsSiteUser.ExportFileClass.RowCount) || cmsSiteUser.ExportFileClass.RowCount > 5000)
            cmsSiteUser.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    cmsSiteUser.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"CoreSite/count", cmsSiteUser.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            cmsSiteUser.addRequested = false;
            rashaErManage.checkAction(response);
            cmsSiteUser.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            cmsSiteUser.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);