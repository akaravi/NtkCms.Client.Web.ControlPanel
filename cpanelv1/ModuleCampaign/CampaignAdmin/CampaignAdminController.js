app.controller("campaignAdminController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var campaignAdmin = this;
    campaignAdmin.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    campaignAdmin.selectedMemberUser = [];
    campaignAdmin.ViewNewUserDiv = false;
    campaignAdmin.ViewFindUserDiv = false;
    campaignAdmin.LinkMember = false;
    if (itemRecordStatus != undefined) campaignAdmin.itemRecordStatus = itemRecordStatus;

    // Many To Many
    // MemberUserGroup  جدول واسط
    // LinkMemberUserId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    campaignAdmin.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    

    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        campaignAdmin.memberGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
  
    campaignAdmin.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (campaignAdmin.hasInMany2Many(OtherTable)) {
            //var index = campaignAdmin.selectedMemberUser[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(campaignAdmin.selectedMemberUser[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            campaignAdmin.selectedMemberUser[thisTableFieldICollection].splice(index, 1);
        } else {
            campaignAdmin.selectedMemberUser[thisTableFieldICollection].push(obj);
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
    // End of Many To Many ========================================================================

    campaignAdmin.init = function () {
        campaignAdmin.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = campaignAdmin.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"campaignAdmin/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            campaignAdmin.busyIndicator.isActive = false;
            campaignAdmin.ListItems = response.ListItems;
            campaignAdmin.gridOptions.fillData(campaignAdmin.ListItems, response.resultAccess);
            campaignAdmin.gridOptions.currentPageNumber = response.CurrentPageNumber;
            campaignAdmin.gridOptions.totalRowCount = response.TotalRowCount;
            campaignAdmin.gridOptions.rowPerPage = response.RowPerPage;
            campaignAdmin.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            campaignAdmin.busyIndicator.isActive = false;
            campaignAdmin.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //// Open Add Modal
    //campaignAdmin.busyIndicator.isActive = true;
    //campaignAdmin.addRequested = false;
    //campaignAdmin.openAddModal = function () {
    //    campaignAdmin.modalTitle = 'اضافه';
    //    ajax.call(cmsServerConfig.configApiServerPath+'campaignAdmin/GetViewModel', "", 'GET').success(function (response) {
    //        rashaErManage.checkAction(response);
    //        campaignAdmin.busyIndicator.isActive = false;
    //        campaignAdmin.selectedItem = response.Item;
    //        $modal.open({
    //            templateUrl: 'cpanelv1/ModuleCampaign/campaignAdmin/add.html',
    //            scope: $scope
    //        });
    //    }).error(function (data, errCode, c, d) {
    //        rashaErManage.checkAction(data, errCode);
    //        campaignAdmin.busyIndicator.isActive = false;

    //    });
    //}
    // Open Add Modal
    campaignAdmin.busyIndicator.isActive = true;
    campaignAdmin.addRequested = false;
    campaignAdmin.openAddModal = function () {
        campaignAdmin.ViewFindUserDiv = false;
        campaignAdmin.ViewNewUserDiv = false;
        campaignAdmin.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/GetViewModel', "", "GET").success(function (response1) {
            campaignAdmin.busyIndicator.isActive = false;
            campaignAdmin.selectedMemberUser = response1.Item;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignAdmin.busyIndicator.isActive = false;

        });
        ajax.call(cmsServerConfig.configApiServerPath+'campaignAdmin/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            campaignAdmin.busyIndicator.isActive = false;
            campaignAdmin.selectedItem = response.Item;
           
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCampaign/campaignAdmin/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignAdmin.busyIndicator.isActive = false;

        });

    }
    //// Add New Content
    //campaignAdmin.addNewRow = function (frm) {
    //    if (frm.$invalid)
    //        return;
    //    campaignAdmin.busyIndicator.isActive = true;
    //    campaignAdmin.addRequested = true;
    //    ajax.call(cmsServerConfig.configApiServerPath+'campaignAdmin/add', campaignAdmin.selectedItem, 'POST').success(function (response) {
    //        campaignAdmin.addRequested = false;
    //        campaignAdmin.busyIndicator.isActive = false;
    //        rashaErManage.checkAction(response);
    //        if (response.IsSuccess) {
    //            campaignAdmin.gridOptions.advancedSearchData.engine.Filters = null;
    //            campaignAdmin.gridOptions.advancedSearchData.engine.Filters = [];
    //            campaignAdmin.ListItems.unshift(response.Item);
    //            campaignAdmin.gridOptions.fillData(campaignAdmin.ListItems);
    //            campaignAdmin.closeModal();
    //        }
    //    }).error(function (data, errCode, c, d) {
    //        rashaErManage.checkAction(data, errCode);
    //        campaignAdmin.busyIndicator.isActive = false;
    //        campaignAdmin.addRequested = false;
    //    });
    //}
    // Add New Content
    campaignAdmin.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        campaignAdmin.busyIndicator.isActive = true;
        campaignAdmin.addRequested = true;
        if (campaignAdmin.ViewFindUserDiv) {
            campaignAdmin.addSerialCard();
            campaignAdmin.busyIndicator.isActive = false;
            campaignAdmin.addRequested = false;
        }
        else {

            campaignAdmin.addRequested = true;
            campaignAdmin.busyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/add', campaignAdmin.selectedMemberUser, 'POST').success(function (response1) {
                rashaErManage.checkAction(response1);
                if (response1.IsSuccess) {
                    campaignAdmin.selectedItem.LinkModuleCoreCmsUserId = response1.Item.Id;
                    campaignAdmin.addSerialCard();
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });



        }
    }
    campaignAdmin.addSerialCard = function () {
        ajax.call(cmsServerConfig.configApiServerPath+'campaignAdmin/add', campaignAdmin.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignAdmin.ListItems.unshift(response.Item);
                campaignAdmin.gridOptions.fillData(campaignAdmin.ListItems);
                campaignAdmin.closeModal();
                campaignAdmin.busyIndicator.isActive = false;
                campaignAdmin.addRequested = false;
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignAdmin.busyIndicator.isActive = false;
            campaignAdmin.addRequested = false;
        });
    }
    // Open Edit Modal
    //campaignAdmin.openEditModal = function () {

    //    campaignAdmin.modalTitle = 'ویرایش';
    //    if (!campaignAdmin.gridOptions.selectedRow.item) {
    //        rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
    //        return;
    //    }

    //    ajax.call(cmsServerConfig.configApiServerPath+'campaignAdmin/GetOne', campaignAdmin.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
    //        rashaErManage.checkAction(response);
    //        campaignAdmin.selectedItem = response.Item;
    //        if (campaignAdmin
    //            .LinkUniversalMenuIdOnUndetectableKey >
    //            0) campaignAdmin.selectUniversalMenuOnUndetectableKey = true;
    //        $modal.open({
    //            templateUrl: 'cpanelv1/ModuleCampaign/campaignAdmin/edit.html',
    //            scope: $scope
    //        });

    //    }).error(function (data, errCode, c, d) {
    //        rashaErManage.checkAction(data, errCode);
    //    });
    //}

    //// Edit a Content
    //campaignAdmin.editRow = function (frm) {
    //    if (frm.$invalid)
    //        return;
    //    campaignAdmin.busyIndicator.isActive = true;
    //    ajax.call(cmsServerConfig.configApiServerPath+'campaignAdmin/edit', campaignAdmin.selectedItem, 'PUT').success(function (response) {
    //        campaignAdmin.addRequested = true;
    //        rashaErManage.checkAction(response);
    //        campaignAdmin.busyIndicator.isActive = false;
    //        if (response.IsSuccess) {
    //            campaignAdmin.addRequested = false;
    //            campaignAdmin.replaceItem(campaignAdmin.selectedItem.Id, response.Item);
    //            campaignAdmin.gridOptions.fillData(campaignAdmin.ListItems);
    //            campaignAdmin.closeModal();
    //        }
    //    }).error(function (data, errCode, c, d) {
    //        rashaErManage.checkAction(data, errCode);
    //        campaignAdmin.addRequested = false;
    //        campaignAdmin.busyIndicator.isActive = false;
    //    });
    //}

    //campaignAdmin.closeModal = function () {
    //    $modalStack.dismissAll();
    //};

    //campaignAdmin.replaceItem = function (oldId, newItem) {
    //    angular.forEach(campaignAdmin.ListItems, function (item, key) {
    //        if (item.Id == oldId) {
    //            var index = campaignAdmin.ListItems.indexOf(item);
    //            campaignAdmin.ListItems.splice(index, 1);
    //        }
    //    });
    //    if (newItem)
    //        campaignAdmin.ListItems.unshift(newItem);
    //}


    campaignAdmin.openEditModal = function () {

        campaignAdmin.modalTitle = 'ویرایش';
        if (!campaignAdmin.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/GetViewModel', "", "GET").success(function (response2) {
            campaignAdmin.selectedMemberUser = response2.Item;
            campaignAdmin.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignAdmin.busyIndicator.isActive = false;

        });
        ajax.call(cmsServerConfig.configApiServerPath+'campaignAdmin/GetOne', campaignAdmin.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            campaignAdmin.selectedItem = response.Item;
            if (response.Item.LinkModuleCoreCmsUserId != null)
                campaignAdmin.LinkMember = true;
            else
                campaignAdmin.LinkMember = false;
            if (campaignAdmin
                .LinkUniversalMenuIdOnUndetectableKey >
                0) campaignAdmin.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCampaign/campaignAdmin/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    campaignAdmin.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        //campaignAdmin.busyIndicator.isActive = true;
        campaignAdmin.addRequested = true;
        if (campaignAdmin.ViewFindUserDiv) {
            campaignAdmin.editSerialCard();
            //campaignAdmin.busyIndicator.isActive = false;
            //campaignAdmin.addRequested = false;
        }
        else {


            campaignAdmin.addRequested = true;
            campaignAdmin.busyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/add', campaignAdmin.selectedMemberUser, 'POST').success(function (response1) {
                rashaErManage.checkAction(response1);
                if (response1.IsSuccess) {
                    campaignAdmin.selectedItem.LinkModuleCoreCmsUserId = response1.Item.Id;
                    campaignAdmin.editSerialCard();
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });



        }

    }

    campaignAdmin.editSerialCard = function () {

        campaignAdmin.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'campaignAdmin/edit', campaignAdmin.selectedItem, 'PUT').success(function (response) {
            campaignAdmin.addRequested = true;
            rashaErManage.checkAction(response);
            campaignAdmin.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                campaignAdmin.addRequested = false;
                campaignAdmin.replaceItem(campaignAdmin.selectedItem.Id, response.item);
                campaignAdmin.gridOptions.fillData(campaignAdmin.ListItems);
                campaignAdmin.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignAdmin.addRequested = false;
            campaignAdmin.busyIndicator.isActive = false;
        });
    }

    campaignAdmin.closeModal = function () {
        $modalStack.dismissAll();
    };

    campaignAdmin.replaceItem = function (oldId, newItem) {
        angular.forEach(campaignAdmin.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = campaignAdmin.ListItems.indexOf(item);
                campaignAdmin.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            campaignAdmin.ListItems.unshift(newItem);
    }

    // delete content
    campaignAdmin.deleteRow = function () {
        if (!campaignAdmin.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                campaignAdmin.busyIndicator.isActive = true;
                console.log(campaignAdmin.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'campaignAdmin/GetOne', campaignAdmin.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    campaignAdmin.selectedItemForDelete = response.Item;
                    console.log(campaignAdmin.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'campaignAdmin/delete', campaignAdmin.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        campaignAdmin.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            campaignAdmin.replaceItem(campaignAdmin.selectedItemForDelete.Id);
                            campaignAdmin.gridOptions.fillData(campaignAdmin.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        campaignAdmin.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    campaignAdmin.busyIndicator.isActive = false;
                });
            }
        });
    }

    campaignAdmin.searchData = function () {
        campaignAdmin.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"campaignAdmin/getall", campaignAdmin.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            campaignAdmin.categoryBusyIndicator.isActive = false;
            campaignAdmin.ListItems = response.ListItems;
            campaignAdmin.gridOptions.fillData(campaignAdmin.ListItems);
            campaignAdmin.gridOptions.currentPageNumber = response.CurrentPageNumber;
            campaignAdmin.gridOptions.totalRowCount = response.TotalRowCount;
            campaignAdmin.gridOptions.rowPerPage = response.RowPerPage;
            campaignAdmin.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            campaignAdmin.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //campaignAdmin.gridOptions.searchData();

    }
    campaignAdmin.LinkCampaignDetailIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkCampaignDetailId',
        url: 'CampaignDetail',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: campaignAdmin,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
                { name: 'LinkCampaignDetailId', displayName: 'کد سیستمی جزییات', sortable: true, type: 'integer', visible: true },
            ]
        }
    }
    campaignAdmin.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkCampaignDetailId', displayName: 'کد سیستمی جزییات', sortable: true, type: 'integer', visible: true },
            { name: 'LinkModuleCoreCmsUserId', displayName: 'کد ملی کاربر', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            
            
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
                TotalRowData: 200,
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }

    campaignAdmin.test = 'false';

    campaignAdmin.gridOptions.reGetAll = function () {
        campaignAdmin.init();
    }

    campaignAdmin.gridOptions.onRowSelected = function () { }

    campaignAdmin.columnCheckbox = false;
    campaignAdmin.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (campaignAdmin.gridOptions.columnCheckbox) {
            for (var i = 0; i < campaignAdmin.gridOptions.columns.length; i++) {
                //campaignAdmin.gridOptions.columns[i].visible = $("#" + campaignAdmin.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + campaignAdmin.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                campaignAdmin.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = campaignAdmin.gridOptions.columns;
            for (var i = 0; i < campaignAdmin.gridOptions.columns.length; i++) {
                campaignAdmin.gridOptions.columns[i].visible = true;
                var element = $("#" + campaignAdmin.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + campaignAdmin.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < campaignAdmin.gridOptions.columns.length; i++) {
            console.log(campaignAdmin.gridOptions.columns[i].name.concat(".visible: "), campaignAdmin.gridOptions.columns[i].visible);
        }
        campaignAdmin.gridOptions.columnCheckbox = !campaignAdmin.gridOptions.columnCheckbox;
    }
    campaignAdmin.getUser = function (userId) {
        campaignAdmin.ViewFindUserDiv = false;
        campaignAdmin.ViewNewUserDiv = false;
        var engine = { Filters: [] };
        engine.Filters.push({ PropertyName: "NationalCode", SearchType: 0, StringValue1: userId, ClauseType: 1 });
        engine.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: userId, ClauseType: 1 });
        ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/GetOne', engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            campaignAdmin.selectedUser = response.Item;
            if (campaignAdmin.selectedUser != null && campaignAdmin.selectedUser.Id != 0) {
                campaignAdmin.ViewFindUserDiv = true;
                campaignAdmin.ViewNewUserDiv = false;
                campaignAdmin.selectedItem.LinkModuleCoreCmsUserId = campaignAdmin.selectedUser.Id;
            }
            else {
                campaignAdmin.ViewFindUserDiv = false;
                campaignAdmin.ViewNewUserDiv = true;
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });

    }
    //Export Report 
    campaignAdmin.exportFile = function () {
        campaignAdmin.addRequested = true;
        campaignAdmin.gridOptions.advancedSearchData.engine.ExportFile = campaignAdmin.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'campaignAdmin/exportfile', campaignAdmin.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            campaignAdmin.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignAdmin.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //campaignAdmin.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    campaignAdmin.toggleExportForm = function () {
        campaignAdmin.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        campaignAdmin.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        campaignAdmin.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        campaignAdmin.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        campaignAdmin.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCampaign/campaignAdmin/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    campaignAdmin.rowCountChanged = function () {
        if (!angular.isDefined(campaignAdmin.ExportFileClass.RowCount) || campaignAdmin.ExportFileClass.RowCount > 5000)
            campaignAdmin.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    campaignAdmin.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"campaignAdmin/count", campaignAdmin.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            campaignAdmin.addRequested = false;
            rashaErManage.checkAction(response);
            campaignAdmin.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            campaignAdmin.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

