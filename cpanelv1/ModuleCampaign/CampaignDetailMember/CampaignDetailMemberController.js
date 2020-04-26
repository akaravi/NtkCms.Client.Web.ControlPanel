app.controller("campaignDetailMemberController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var campaignDetailMember = this;
    campaignDetailMember.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    campaignDetailMember.selectedMemberUser = [];
    campaignDetailMember.gridOptions = {};
    campaignDetailMember.selectedItem = {};
    campaignDetailMember.attachedFiles = [];
    campaignDetailMember.attachedFile = "";
    campaignDetailMember.ViewFindUserDiv = false;
    campaignDetailMember.ViewNewUserDiv = false;
    campaignDetailMember.LinkMember = false;

    campaignDetailMember.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    campaignDetailMember.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    if (itemRecordStatus != undefined) campaignDetailMember.itemRecordStatus = itemRecordStatus;

    // Many To Many
    // MemberUserGroup  جدول واسط
    // LinkMemberUserId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    campaignDetailMember.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    

    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        campaignDetailMember.memberGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    //campaignDetailMember.hasInMany2Many = function (OtherTable) {
    //    if (campaignDetailMember.selectedMemberUser == null || campaignDetailMember.selectedMemberUser[thisTableFieldICollection] == undefined || campaignDetailMember.selectedMemberUser[thisTableFieldICollection] == null) return false;
    //    return objectFindByKey(campaignDetailMember.selectedMemberUser[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    //};
    campaignDetailMember.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (campaignDetailMember.hasInMany2Many(OtherTable)) {
            //var index = campaignDetailMember.selectedMemberUser[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(campaignDetailMember.selectedMemberUser[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            campaignDetailMember.selectedMemberUser[thisTableFieldICollection].splice(index, 1);
        } else {
            campaignDetailMember.selectedMemberUser[thisTableFieldICollection].push(obj);
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

    campaignDetailMember.init = function () {
        campaignDetailMember.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = campaignDetailMember.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"campaignDetailMember/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetailMember.busyIndicator.isActive = false;
            campaignDetailMember.ListItems = response.ListItems;
            campaignDetailMember.gridOptions.fillData(campaignDetailMember.ListItems, response.resultAccess);
            campaignDetailMember.gridOptions.currentPageNumber = response.CurrentPageNumber;
            campaignDetailMember.gridOptions.totalRowCount = response.TotalRowCount;
            campaignDetailMember.gridOptions.rowPerPage = response.RowPerPage;
            campaignDetailMember.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            campaignDetailMember.busyIndicator.isActive = false;
            campaignDetailMember.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }


    // Open Add Modal
    campaignDetailMember.busyIndicator.isActive = true;
    campaignDetailMember.attachedFiles = [];
    campaignDetailMember.attachedFile = "";
    campaignDetailMember.filePickerMainImage.filename = "";
    campaignDetailMember.filePickerMainImage.fileId = null;
    campaignDetailMember.filePickerFiles.filename = "";
    campaignDetailMember.filePickerFiles.fileId = null;
    campaignDetailMember.addRequested = false;
    campaignDetailMember.openAddModal = function () {
        campaignDetailMember.ViewFindUserDiv = false;
        campaignDetailMember.ViewNewUserDiv = false;
        campaignDetailMember.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'MemberUser/GetViewModel', "", "GET").success(function (response1) {
            campaignDetailMember.busyIndicator.isActive = false;
            campaignDetailMember.selectedMemberUser = response1.Item;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignDetailMember.busyIndicator.isActive = false;

        });
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailMember/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetailMember.busyIndicator.isActive = false;
            campaignDetailMember.selectedItem = response.Item;
           
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCampaign/campaignDetailMember/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignDetailMember.busyIndicator.isActive = false;

        });

    }

    // Add New Content
    campaignDetailMember.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        campaignDetailMember.busyIndicator.isActive = true;
        campaignDetailMember.addRequested = true;
        //Save attached file ids into campaignDetailMember.selectedItem.LinkFileIds
        campaignDetailMember.selectedItem.LinkFileIds = "";
        campaignDetailMember.stringfyLinkFileIds();
        if (campaignDetailMember.ViewFindUserDiv) {
            campaignDetailMember.addSerialCard();
            campaignDetailMember.busyIndicator.isActive = false;
            campaignDetailMember.addRequested = false;
        }
        else {

            campaignDetailMember.addRequested = true;
            campaignDetailMember.busyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+'memberuser/add', campaignDetailMember.selectedMemberUser, 'POST').success(function (response1) {
                rashaErManage.checkAction(response1);
                if (response1.IsSuccess) {
                    campaignDetailMember.selectedItem.LinkMemberId = response1.Item.Id;
                    campaignDetailMember.addSerialCard();
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });



        }
    }
    campaignDetailMember.addSerialCard = function () {
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailMember/add', campaignDetailMember.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignDetailMember.ListItems.unshift(response.Item);
                campaignDetailMember.gridOptions.fillData(campaignDetailMember.ListItems);
                campaignDetailMember.closeModal();
                campaignDetailMember.busyIndicator.isActive = false;
                campaignDetailMember.addRequested = false;
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignDetailMember.busyIndicator.isActive = false;
            campaignDetailMember.addRequested = false;
        });
    }
    //Edit Modal
    //campaignDetailMember.openEditModal = function () {

    //    campaignDetailMember.modalTitle = 'ویرایش';
    //    if (!campaignDetailMember.gridOptions.selectedRow.item) {
    //        rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
    //        return;
    //    }

    //    ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailMember/GetOne', campaignDetailMember.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
    //        rashaErManage.checkAction(response);
    //        campaignDetailMember.selectedItem = response.Item;
    //        campaignDetailMember.filePickerMainImage.filename = null;
    //        campaignDetailMember.filePickerMainImage.fileId = null;
    //        campaignDetailMember.parseFileIds(response.Item.LinkFileIds);
    //        campaignDetailMember.filePickerFiles.filename = null;
    //        campaignDetailMember.filePickerFiles.fileId = null;
    //        if (campaignDetailMember
    //            .LinkUniversalMenuIdOnUndetectableKey >
    //            0) campaignDetailMember.selectUniversalMenuOnUndetectableKey = true;
    //        $modal.open({
    //            templateUrl: 'cpanelv1/ModuleCampaign/campaignDetailMember/edit.html',
    //            scope: $scope
    //        });

    //    }).error(function (data, errCode, c, d) {
    //        rashaErManage.checkAction(data, errCode);
    //    });
    //}

    //// Edit a Content
    //campaignDetailMember.editRow = function (frm) {
    //    if (frm.$invalid)
    //        return;
    //    campaignDetailMember.busyIndicator.isActive = true;
    //    //Save attached file ids into campaignDetailMember.selectedItem.LinkFileIds
    //    campaignDetailMember.selectedItem.LinkFileIds = "";
    //    campaignDetailMember.stringfyLinkFileIds();
    //    ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailMember/edit', campaignDetailMember.selectedItem, 'PUT').success(function (response) {
    //        campaignDetailMember.addRequested = true;
    //        rashaErManage.checkAction(response);
    //        campaignDetailMember.busyIndicator.isActive = false;
    //        if (response.IsSuccess) {
    //            campaignDetailMember.addRequested = false;
    //            campaignDetailMember.replaceItem(campaignDetailMember.selectedItem.Id, response.Item);
    //            campaignDetailMember.gridOptions.fillData(campaignDetailMember.ListItems);
    //            campaignDetailMember.closeModal();
    //        }
    //    }).error(function (data, errCode, c, d) {
    //        rashaErManage.checkAction(data, errCode);
    //        campaignDetailMember.addRequested = false;
    //        campaignDetailMember.busyIndicator.isActive = false;
    //    });
    //}

    //campaignDetailMember.closeModal = function () {
    //    $modalStack.dismissAll();
    //};

    //campaignDetailMember.replaceItem = function (oldId, newItem) {
    //    angular.forEach(campaignDetailMember.ListItems, function (item, key) {
    //        if (item.Id == oldId) {
    //            var index = campaignDetailMember.ListItems.indexOf(item);
    //            campaignDetailMember.ListItems.splice(index, 1);
    //        }
    //    });
    //    if (newItem)
    //        campaignDetailMember.ListItems.unshift(newItem);
    //}
    campaignDetailMember.openEditModal = function () {

        campaignDetailMember.modalTitle = 'ویرایش';
        if (!campaignDetailMember.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'MemberUser/GetViewModel', "", "GET").success(function (response2) {
            campaignDetailMember.selectedMemberUser = response2.Item;

            campaignDetailMember.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignDetailMember.busyIndicator.isActive = false;

        });
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailMember/GetOne', campaignDetailMember.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetailMember.selectedItem = response.Item;
            if (response.Item.LinkMemberId != null)
                campaignDetailMember.LinkMember = true;
            else
                campaignDetailMember.LinkMember = false;
            campaignDetailMember.filePickerMainImage.filename = null;
            campaignDetailMember.filePickerMainImage.fileId = null;
            campaignDetailMember.parseFileIds(response.Item.LinkFileIds);
            campaignDetailMember.filePickerFiles.filename = null;
            campaignDetailMember.filePickerFiles.fileId = null;
            if (campaignDetailMember
                .LinkUniversalMenuIdOnUndetectableKey >
                0) campaignDetailMember.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCampaign/campaignDetailMember/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    campaignDetailMember.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        //campaignDetailMember.busyIndicator.isActive = true;
        campaignDetailMember.addRequested = true;
        if (campaignDetailMember.ViewFindUserDiv) {
            campaignDetailMember.editSerialCard();
            //campaignDetailMember.busyIndicator.isActive = false;
            //campaignDetailMember.addRequested = false;
        }
        else {


            campaignDetailMember.addRequested = true;
            campaignDetailMember.busyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+'memberuser/add', campaignDetailMember.selectedMemberUser, 'POST').success(function (response1) {
                rashaErManage.checkAction(response1);
                if (response1.IsSuccess) {
                    campaignDetailMember.selectedItem.LinkMemberId = response1.Item.Id;
                    campaignDetailMember.editSerialCard();
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });



        }

    }

    campaignDetailMember.editSerialCard = function () {

        campaignDetailMember.busyIndicator.isActive = true;
        //Save attached file ids into campaignDetailMember.selectedItem.LinkFileIds
        campaignDetailMember.selectedItem.LinkFileIds = "";
        campaignDetailMember.stringfyLinkFileIds();
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailMember/edit', campaignDetailMember.selectedItem, 'PUT').success(function (response) {
            campaignDetailMember.addRequested = true;
            rashaErManage.checkAction(response);
            campaignDetailMember.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                campaignDetailMember.addRequested = false;
                campaignDetailMember.replaceItem(campaignDetailMember.selectedItem.Id, response.item);
                campaignDetailMember.gridOptions.fillData(campaignDetailMember.ListItems);
                campaignDetailMember.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignDetailMember.addRequested = false;
            campaignDetailMember.busyIndicator.isActive = false;
        });
    }

    campaignDetailMember.closeModal = function () {
        $modalStack.dismissAll();
    };

    campaignDetailMember.replaceItem = function (oldId, newItem) {
        angular.forEach(campaignDetailMember.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = campaignDetailMember.ListItems.indexOf(item);
                campaignDetailMember.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            campaignDetailMember.ListItems.unshift(newItem);
    }

    // delete content
    campaignDetailMember.deleteRow = function () {
        if (!campaignDetailMember.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                campaignDetailMember.busyIndicator.isActive = true;
                console.log(campaignDetailMember.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailMember/GetOne', campaignDetailMember.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    campaignDetailMember.selectedItemForDelete = response.Item;
                    console.log(campaignDetailMember.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailMember/delete', campaignDetailMember.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        campaignDetailMember.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            campaignDetailMember.replaceItem(campaignDetailMember.selectedItemForDelete.Id);
                            campaignDetailMember.gridOptions.fillData(campaignDetailMember.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        campaignDetailMember.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    campaignDetailMember.busyIndicator.isActive = false;
                });
            }
        });
    }

    campaignDetailMember.searchData = function () {
        campaignDetailMember.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"campaignDetailMember/getall", campaignDetailMember.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetailMember.categoryBusyIndicator.isActive = false;
            campaignDetailMember.ListItems = response.ListItems;
            campaignDetailMember.gridOptions.fillData(campaignDetailMember.ListItems);
            campaignDetailMember.gridOptions.currentPageNumber = response.CurrentPageNumber;
            campaignDetailMember.gridOptions.totalRowCount = response.TotalRowCount;
            campaignDetailMember.gridOptions.rowPerPage = response.RowPerPage;
            campaignDetailMember.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            campaignDetailMember.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //campaignDetailMember.gridOptions.searchData();

    }
    campaignDetailMember.LinkCampaignDetailIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkCampaignDetailId',
        url: 'CampaignDetail',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: campaignDetailMember,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'LinkCampaignDetailId', displayName: 'کد سیستمی جزییات', sortable: true, type: 'integer', visible: true },
            ]
        }
    }
   
    campaignDetailMember.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkCampaignDetailId', displayName: 'کد سیستمی جزییات', sortable: true, type: 'integer', visible: true },
            { name: 'LinkMemberId', displayName: 'کد سیستمی اعضا', sortable: true, type: 'integer', visible: true },
            { name: 'HasPresent', displayName: 'تاکنون وجود داشته است', sortable: true, type: 'string', visible: true },
            { name: 'Grade', displayName: 'رتبه', sortable: true, type: 'string', visible: true },
            { name: 'Log', displayName: 'اطلاعات', sortable: true, type: 'string', visible: true },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: true },
            { name: 'LinkFileIds', displayName: 'فایل', sortable: true, type: 'string', visible: true },
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

    campaignDetailMember.test = 'false';

    campaignDetailMember.gridOptions.reGetAll = function () {
        campaignDetailMember.init();
    }

    campaignDetailMember.gridOptions.onRowSelected = function () { }

    
    campaignDetailMember.getUser = function (memberNa) {
        campaignDetailMember.ViewFindUserDiv = false;
        campaignDetailMember.ViewNewUserDiv = false;
        var filterValue = {
            PropertyName: "NationalCode",
            StringValue1: memberNa,
            SearchType: 0
        }
        var filterModel = {
            CurrentPageNumber: 1,
            SortColumn: "Id",
            SortType: 1,
            NeedToRunFakePagination: false,
            TotalRowData: 200,
            RowPerPage: 20,
            ContentFullSearch: null,
            Filters: [filterValue]
        }
        ajax.call(cmsServerConfig.configApiServerPath+'memberuser/GetOne', filterModel, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            campaignDetailMember.selectedMember = response.Item;
            if (campaignDetailMember.selectedMember != null && campaignDetailMember.selectedMember.Id != 0) {
                campaignDetailMember.ViewFindUserDiv = true;
                campaignDetailMember.ViewNewUserDiv = false;
                campaignDetailMember.selectedItem.LinkMemberId = campaignDetailMember.selectedMember.Id;
            }
            else {
                campaignDetailMember.ViewFindUserDiv = false;
                campaignDetailMember.ViewNewUserDiv = true;
            }
        }).error(function (data, errCode, c, d) {
            //campaignDetailMember.ViewFindUserDiv = false;
            //campaignDetailMember.ViewNewUserDiv = true;
            rashaErManage.checkAction(data, errCode);
        });

    }
    //For reInit Categories
    campaignDetailMember.gridOptions.reGetAll = function () {
        if (campaignDetailMember.gridOptions.advancedSearchData.engine.Filters.length > 0) campaignDetailMember.searchData();
        else campaignDetailMember.init();
    };

    campaignDetailMember.isCurrentNodeEmpty = function () {
        return !angular.equals({}, campaignDetailMember.treeConfig.currentNode);
    }

    campaignDetailMember.loadFileAndFolder = function (item) {
        campaignDetailMember.treeConfig.currentNode = item;
        console.log(item);
        campaignDetailMember.treeConfig.onNodeSelect(item);
    }

    campaignDetailMember.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            campaignDetailMember.focus = true;
        });
    };
    campaignDetailMember.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            campaignDetailMember.focus1 = true;
        });
    };

    campaignDetailMember.columnCheckbox = false;
    campaignDetailMember.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = campaignDetailMember.gridOptions.columns;
        if (campaignDetailMember.gridOptions.columnCheckbox) {
            for (var i = 0; i < campaignDetailMember.gridOptions.columns.length; i++) {
                //campaignDetailMember.gridOptions.columns[i].visible = $("#" + campaignDetailMember.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + campaignDetailMember.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                campaignDetailMember.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < campaignDetailMember.gridOptions.columns.length; i++) {
                var element = $("#" + campaignDetailMember.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + campaignDetailMember.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < campaignDetailMember.gridOptions.columns.length; i++) {
            console.log(campaignDetailMember.gridOptions.columns[i].name.concat(".visible: "), campaignDetailMember.gridOptions.columns[i].visible);
        }
        campaignDetailMember.gridOptions.columnCheckbox = !campaignDetailMember.gridOptions.columnCheckbox;
    }

    campaignDetailMember.deleteAttachedFile = function (index) {
        campaignDetailMember.attachedFiles.splice(index, 1);
    }

    campaignDetailMember.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !campaignDetailMember.alreadyExist(id, campaignDetailMember.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = { id: fId, name: fname };
            campaignDetailMember.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    campaignDetailMember.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    campaignDetailMember.filePickerMainImage.removeSelectedfile = function (config) {
        campaignDetailMember.filePickerMainImage.fileId = null;
        campaignDetailMember.filePickerMainImage.filename = null;
        campaignDetailMember.selectedItem.LinkMainImageId = null;

    }

    campaignDetailMember.filePickerFiles.removeSelectedfile = function (config) {
        campaignDetailMember.filePickerFiles.fileId = null;
        campaignDetailMember.filePickerFiles.filename = null;
    }




    campaignDetailMember.showUpload = function () { $("#fastUpload").fadeToggle(); }

    // ----------- FilePicker Codes --------------------------------
    campaignDetailMember.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !campaignDetailMember.alreadyExist(id, campaignDetailMember.attachedFiles)) {
            var fId = id;
            var file = { fileId: fId, filename: fname };
            campaignDetailMember.attachedFiles.push(file);
            campaignDetailMember.clearfilePickers();
        }
    }

    campaignDetailMember.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                campaignDetailMember.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    campaignDetailMember.deleteAttachedfieldName = function (index) {
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailMember/delete', campaignDetailMember.contractsList[index], 'POST').success(function (res) {
            rashaErManage.checkAction(res);
            if (res.IsSuccess) {
                campaignDetailMember.contractsList.splice(index, 1);
                rashaErManage.showMessage($filter('translatentk')('Removed_Successfully'));
            }
        }).error(function (data2, errCode2, c2, d2) {
            rashaErManage.checkAction(data2);
        });
    }

    campaignDetailMember.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            campaignDetailMember.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    campaignDetailMember.clearfilePickers = function () {
        campaignDetailMember.filePickerFiles.fileId = null;
        campaignDetailMember.filePickerFiles.filename = null;
    }

    campaignDetailMember.stringfyLinkFileIds = function () {
        $.each(campaignDetailMember.attachedFiles, function (i, item) {
            if (campaignDetailMember.selectedItem.LinkFileIds == "")
                campaignDetailMember.selectedItem.LinkFileIds = item.fileId;
            else
                campaignDetailMember.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    campaignDetailMember.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCampaign/campaignDetailMember/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        campaignDetailMember.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            campaignDetailMember.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    campaignDetailMember.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    campaignDetailMember.whatcolor = function (progress) {
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

    campaignDetailMember.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    campaignDetailMember.replaceFile = function (name) {
        campaignDetailMember.itemClicked(null, campaignDetailMember.fileIdToDelete, "file");
        campaignDetailMember.fileTypes = 1;
        campaignDetailMember.fileIdToDelete = campaignDetailMember.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", campaignDetailMember.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    campaignDetailMember.remove(campaignDetailMember.FileList, campaignDetailMember.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                campaignDetailMember.FileItem = response3.Item;
                                campaignDetailMember.FileItem.FileName = name;
                                campaignDetailMember.FileItem.Extension = name.split('.').pop();
                                campaignDetailMember.FileItem.FileSrc = name;
                                campaignDetailMember.FileItem.LinkCategoryId = campaignDetailMember.thisCategory;
                                campaignDetailMember.saveNewFile();
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
    campaignDetailMember.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", campaignDetailMember.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                campaignDetailMember.FileItem = response.Item;
                campaignDetailMember.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            campaignDetailMember.showErrorIcon();
            return -1;
        });
    }

    campaignDetailMember.showSuccessIcon = function () {
    }

    campaignDetailMember.showErrorIcon = function () {

    }
    //file is exist
    campaignDetailMember.fileIsExist = function (fileName) {
        for (var i = 0; i < campaignDetailMember.FileList.length; i++) {
            if (campaignDetailMember.FileList[i].FileName == fileName) {
                campaignDetailMember.fileIdToDelete = campaignDetailMember.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    campaignDetailMember.getFileItem = function (id) {
        for (var i = 0; i < campaignDetailMember.FileList.length; i++) {
            if (campaignDetailMember.FileList[i].Id == id) {
                return campaignDetailMember.FileList[i];
            }
        }
    }

    //select file or folder
    campaignDetailMember.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            campaignDetailMember.fileTypes = 1;
            campaignDetailMember.selectedFileId = campaignDetailMember.getFileItem(index).Id;
            campaignDetailMember.selectedFileName = campaignDetailMember.getFileItem(index).FileName;
        }
        else {
            campaignDetailMember.fileTypes = 2;
            campaignDetailMember.selectedCategoryId = campaignDetailMember.getCategoryName(index).Id;
            campaignDetailMember.selectedCategoryTitle = campaignDetailMember.getCategoryName(index).Title;
        }
        campaignDetailMember.selectedIndex = index;
    };

    campaignDetailMember.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    //upload file
    campaignDetailMember.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (campaignDetailMember.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ campaignDetailMember.replaceFile(uploadFile.name);
                    campaignDetailMember.itemClicked(null, campaignDetailMember.fileIdToDelete, "file");
                    campaignDetailMember.fileTypes = 1;
                    campaignDetailMember.fileIdToDelete = campaignDetailMember.selectedIndex;
                    // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                campaignDetailMember.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        campaignDetailMember.FileItem = response2.Item;
                        campaignDetailMember.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        campaignDetailMember.filePickerMainImage.filename =
                          campaignDetailMember.FileItem.FileName;
                        campaignDetailMember.filePickerMainImage.fileId =
                          response2.Item.Id;
                        campaignDetailMember.selectedItem.LinkMainImageId =
                          campaignDetailMember.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      campaignDetailMember.showErrorIcon();
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
                    campaignDetailMember.FileItem = response.Item;
                    campaignDetailMember.FileItem.FileName = uploadFile.name;
                    campaignDetailMember.FileItem.uploadName = uploadFile.uploadName;
                    campaignDetailMember.FileItem.Extension = uploadFile.name.split('.').pop();
                    campaignDetailMember.FileItem.FileSrc = uploadFile.name;
                    campaignDetailMember.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- campaignDetailMember.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", campaignDetailMember.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            campaignDetailMember.FileItem = response.Item;
                            campaignDetailMember.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            campaignDetailMember.filePickerMainImage.filename = campaignDetailMember.FileItem.FileName;
                            campaignDetailMember.filePickerMainImage.fileId = response.Item.Id;
                            campaignDetailMember.selectedItem.LinkMainImageId = campaignDetailMember.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        campaignDetailMember.showErrorIcon();
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
    campaignDetailMember.exportFile = function () {
        campaignDetailMember.addRequested = true;
        campaignDetailMember.gridOptions.advancedSearchData.engine.ExportFile = campaignDetailMember.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'campaignDetailMember/exportfile', campaignDetailMember.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            campaignDetailMember.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignDetailMember.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //campaignDetailMember.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    campaignDetailMember.toggleExportForm = function () {
        campaignDetailMember.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        campaignDetailMember.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        campaignDetailMember.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        campaignDetailMember.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        campaignDetailMember.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCampaign/campaignDetailMember/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    campaignDetailMember.rowCountChanged = function () {
        if (!angular.isDefined(campaignDetailMember.ExportFileClass.RowCount) || campaignDetailMember.ExportFileClass.RowCount > 5000)
            campaignDetailMember.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    campaignDetailMember.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"campaignDetailMember/count", campaignDetailMember.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            campaignDetailMember.addRequested = false;
            rashaErManage.checkAction(response);
            campaignDetailMember.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            campaignDetailMember.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

