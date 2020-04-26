app.controller("memberInfoController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var memberInfo = this;
    memberInfo.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    memberInfo.UninversalMenus = [];
    memberInfo.selectUniversalMenuOnUndetectableKey = true;

    if (itemRecordStatus != undefined) memberInfo.itemRecordStatus = itemRecordStatus;

    // Many To Many
    // MemberUserGroup  جدول واسط
    // LinkMemberUserId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    memberInfo.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها


    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        memberInfo.memberGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    memberInfo.hasInMany2Many = function (OtherTable) {
        if (memberInfo.selectedMemberUser == null || memberInfo.selectedMemberUser[thisTableFieldICollection] == undefined || memberInfo.selectedMemberUser[thisTableFieldICollection] == null) return false;
        return objectFindByKey(memberInfo.selectedMemberUser[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    };
    memberInfo.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (memberInfo.hasInMany2Many(OtherTable)) {
            //var index = memberInfo.selectedMemberUser[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(memberInfo.selectedMemberUser[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            memberInfo.selectedMemberUser[thisTableFieldICollection].splice(index, 1);
        } else {
            memberInfo.selectedMemberUser[thisTableFieldICollection].push(obj);
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
 //#help/ سلکتور  عضو 
    memberInfo.LinkUserIdSelector = {
      displayMember: "FirstName",
      id: "Id",
      fId: "LinkUserId",
      url: "cmsUser",
      sortColumn: "Id",
      sortType: 0,
      filterText: "FirstName",
      showAddDialog: false,
      rowPerPage: 200,
      scope: memberInfo,
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
    memberInfo.init = function () {
        memberInfo.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ApiTelegramMemberInfo/getall", memberInfo.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            memberInfo.busyIndicator.isActive = false;
            memberInfo.ListItems = response.ListItems;
            memberInfo.gridOptions.fillData(memberInfo.ListItems, response.resultAccess);
            memberInfo.gridOptions.currentPageNumber = response.CurrentPageNumber;
            memberInfo.gridOptions.totalRowCount = response.TotalRowCount;
            memberInfo.gridOptions.rowPerPage = response.RowPerPage;
            memberInfo.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            memberInfo.busyIndicator.isActive = false;
            memberInfo.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    memberInfo.busyIndicator.isActive = true;
    memberInfo.addRequested = false;
    memberInfo.openAddModal = function () {
        memberInfo.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegrammemberInfo/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            memberInfo.busyIndicator.isActive = false;
            memberInfo.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegrammemberInfo/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberInfo.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    memberInfo.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        memberInfo.busyIndicator.isActive = true;
        memberInfo.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegrammemberInfo/add', memberInfo.selectedItem, 'POST').success(function (response) {
            memberInfo.addRequested = false;
            memberInfo.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                memberInfo.ListItems.unshift(response.Item);
                memberInfo.gridOptions.fillData(memberInfo.ListItems);
                memberInfo.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberInfo.busyIndicator.isActive = false;
            memberInfo.addRequested = false;
        });
    }

    memberInfo.openEditModal = function () {

        memberInfo.modalTitle = 'ویرایش';
        if (!memberInfo.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegrammemberInfo/GetOne', memberInfo.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            memberInfo.selectedItem = response.Item;
            if (memberInfo
                .LinkUniversalMenuIdOnUndetectableKey >
                0) memberInfo.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegrammemberInfo/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    memberInfo.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        memberInfo.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegrammemberInfo/edit', memberInfo.selectedItem, 'PUT').success(function (response) {
            memberInfo.addRequested = true;
            rashaErManage.checkAction(response);
            memberInfo.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                memberInfo.addRequested = false;
                memberInfo.replaceItem(memberInfo.selectedItem.Id, response.Item);
                memberInfo.gridOptions.fillData(memberInfo.ListItems);
                memberInfo.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberInfo.addRequested = false;
            memberInfo.busyIndicator.isActive = false;
        });
    }

    memberInfo.closeModal = function () {
        $modalStack.dismissAll();
    };

    memberInfo.replaceItem = function (oldId, newItem) {
        angular.forEach(memberInfo.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = memberInfo.ListItems.indexOf(item);
                memberInfo.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            memberInfo.ListItems.unshift(newItem);
    }

    memberInfo.deleteRow = function () {
        if (!memberInfo.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                memberInfo.busyIndicator.isActive = true;
                console.log(memberInfo.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegrammemberInfo/GetOne', memberInfo.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    memberInfo.selectedItemForDelete = response.Item;
                    console.log(memberInfo.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegrammemberInfo/delete', memberInfo.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        memberInfo.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            memberInfo.replaceItem(memberInfo.selectedItemForDelete.Id);
                            memberInfo.gridOptions.fillData(memberInfo.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        memberInfo.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    memberInfo.busyIndicator.isActive = false;
                });
            }
        });
    }

    memberInfo.searchData = function () {
        memberInfo.gridOptions.searchData();

    }

    memberInfo.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'ChatId', displayName: 'شناسه چت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkBotConfigId', displayName: 'کد سیستمی بات', sortable: true, type: 'integer', visible: true },
            { name: 'LinkMemberId', displayName: 'کد سیستمی عضو', sortable: true, type: 'integer', visible: true },
            { name: 'ActionButtons', displayName: 'عملیات', sortable: true, type: 'string', visible: true, displayForce: true, template: '<button type="button" name="info_btn" ng-click="memberInfo.openInfoModal(x.Id,x.LinkMemberId,x.LinkBotConfigId,x.ChatId)" class="btn btn-primary">اطّلاعات&nbsp;<i class="fa fa-user" aria-hidden="true"></i></button>' }
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

    memberInfo.test = 'false';

    memberInfo.gridOptions.reGetAll = function () {
        memberInfo.init();
    }

    memberInfo.gridOptions.onRowSelected = function () { }

    memberInfo.columnCheckbox = false;
    memberInfo.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (memberInfo.gridOptions.columnCheckbox) {
            for (var i = 0; i < memberInfo.gridOptions.columns.length; i++) {
                //memberInfo.gridOptions.columns[i].visible = $("#" + memberInfo.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + memberInfo.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                memberInfo.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = memberInfo.gridOptions.columns;
            for (var i = 0; i < memberInfo.gridOptions.columns.length; i++) {
                memberInfo.gridOptions.columns[i].visible = true;
                var element = $("#" + memberInfo.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + memberInfo.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < memberInfo.gridOptions.columns.length; i++) {
            console.log(memberInfo.gridOptions.columns[i].name.concat(".visible: "), memberInfo.gridOptions.columns[i].visible);
        }
        memberInfo.gridOptions.columnCheckbox = !memberInfo.gridOptions.columnCheckbox;
    }
    //Open #MemberInfo Modal
    memberInfo.openInfoModal = function (selectedId, memberId, botConfigId, chatId) {
        //Get Telegram User Info
        memberInfo.addRequested = true;
        memberInfo.busyIndicator.isActive = true;
        var engine = { Filters: [{ PropertyName: "ChatId", IntValue1: chatId, SearchType: 0 }] };
        engine.SortColumn = "ChatId";
        engine.SortType = 0;
        engine.RowPerPage = 1000000;
        ajax.call(cmsServerConfig.configApiServerPath+"ApiTelegramLogInput/getone", engine, "POST").success(function (response) { //Get Telegram user info from input logs
            memberInfo.addRequested = false;
            memberInfo.busyIndicator.isActive = false;
            memberInfo.selectedLogInput = response.Item;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
        if (!angular.isDefined(memberInfo.memberGroups))
            ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response3) {  //Get MemberGroups to set and assign members to groups
                memberInfo.memberGroups = response3.ListItems;
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });

        memberInfo.modalTitle = 'اطّلاعات کاربران';
        if (memberId != null && memberId != "") {
            memberInfo.alreadyExist = true;
        }
        else {
            memberId = "0";
            memberInfo.alreadyExist = false;
        }
        memberInfo.addRequested = true;
        memberInfo.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ApiTelegramMemberInfo/GetOne", selectedId, "GET").success(function (response) {
            memberInfo.selectedItem = response.Item;
            memberInfo.selectedItem.LinkMemberId = memberId;
            ajax.call(cmsServerConfig.configApiServerPath+"MemberUser/GetOne", memberId, "GET").success(function (response) {
                memberInfo.selectedMemberUser = response.Item;
                memberInfo.addRequested = false;
                memberInfo.busyIndicator.isActive = false;
                $modal.open({
                    templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegramMemberInfo/memberInfo.html',
                    scope: $scope
                });
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add #MemberInfo
    memberInfo.addMemberInfo = function (frm) {
        if (memberInfo.addNewMemberUser == "1") {
            memberInfo.addRequested = true;
            memberInfo.busyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+'memberuser/add', memberInfo.selectedMemberUser, 'POST').success(function (response1) {
                rashaErManage.checkAction(response1);
                if (response1.IsSuccess) {
                    memberInfo.selectedItem.LinkMemberId = response1.Item.Id;
                    ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegrammemberInfo/edit', memberInfo.selectedItem, 'PUT').success(function (response2) {
                        rashaErManage.checkAction(response2);
                        memberInfo.addRequested = false;
                        memberInfo.busyIndicator.isActive = false;
                        if (response2.IsSuccess) {
                            memberInfo.gridOptions.selectedRow.item.LinkMemberId = response2.Item.LinkMemberId;
                            memberInfo.assginToGroup = true;
                            memberInfo.alreadyExist = true;
                            memberInfo.selectedMemberUser = response1.Item;
                            //memberInfo.closeModal();
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }
        else {
            memberInfo.addRequested = true;
            memberInfo.busyIndicator.isActive = true;
            //memberInfo.selectedItem.LinkMemberId = selected.originalObject.Id; //Delete MemberUser
            ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegrammemberInfo/edit', memberInfo.selectedItem, 'PUT').success(function (response) {
                rashaErManage.checkAction(response);
                memberInfo.addRequested = false;
                memberInfo.busyIndicator.isActive = false;
                if (response.IsSuccess) {
                    memberInfo.gridOptions.selectedRow.item.LinkMemberId = response.Item.LinkMemberId;
                    memberInfo.closeModal();
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }
    }
    memberInfo.editMemberUserGroup = function (frm) {
        memberInfo.addRequested = true;
        memberInfo.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MemberUser/edit', memberInfo.selectedMemberUser, 'PUT').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                memberInfo.addRequested = false;
                memberInfo.busyIndicator.isActive = false;
                memberInfo.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Delete #MemberInfo
    memberInfo.deleteMemberInfo = function (frm) {
        memberInfo.addRequested = true;
        memberInfo.busyIndicator.isActive = true;
        memberInfo.selectedItem.LinkMemberId = null;//Delete MemberUser
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegrammemberInfo/edit', memberInfo.selectedItem, 'PUT').success(function (response) {
            rashaErManage.checkAction(response);
            memberInfo.addRequested = false;
            memberInfo.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                memberInfo.closeModal();
                memberInfo.gridOptions.selectedRow.item.LinkMemberId = null;
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //ngautocomplete
    memberInfo.userSelected = function (selected) {
        if (selected) {
            memberInfo.selectedItem.LinkMemberId = 'loading';
            memberInfo.selectedMemberUser = null;
            memberInfo.addRequested = true;
            ajax.call(cmsServerConfig.configApiServerPath+"MemberUser/GetOne", selected.originalObject.Id, "GET").success(function (response) {
                memberInfo.addRequested = false;
                rashaErManage.checkAction(response);
                memberInfo.selectedItem.LinkMemberId = selected.originalObject.Id;
                memberInfo.selectedMemberUser = response.Item;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        } else {
            memberInfo.selectedMemberUser = null;
            memberInfo.selectedItem.LinkMemberId = null;
        }
    }
    //ngautocomplete
    memberInfo.memberUserListItems = [];
    memberInfo.inputUserChanged = function (input) {
        var engine = { Filters: [] };
        engine.Filters.push({ PropertyName: "FirstName", SearchType: 5, StringValue1: input, ClauseType: 1 });
        engine.Filters.push({ PropertyName: "LastName", SearchType: 5, StringValue1: input, ClauseType: 1 });
        ajax.call(cmsServerConfig.configApiServerPath+"memberuser/search", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            memberInfo.memberUserListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Export Report 
    memberInfo.exportFile = function () {
        memberInfo.addRequested = true;
        memberInfo.gridOptions.advancedSearchData.engine.ExportFile = memberInfo.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramMemberInfo/exportfile', memberInfo.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            memberInfo.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                memberInfo.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //memberInfo.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    memberInfo.toggleExportForm = function () {
        memberInfo.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        memberInfo.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        memberInfo.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        memberInfo.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        memberInfo.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegramMemberInfo/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    memberInfo.rowCountChanged = function () {
        if (!angular.isDefined(memberInfo.ExportFileClass.RowCount) || memberInfo.ExportFileClass.RowCount > 5000)
            memberInfo.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    memberInfo.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ApiTelegrammemberInfo/count", memberInfo.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            memberInfo.addRequested = false;
            rashaErManage.checkAction(response);
            memberInfo.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            memberInfo.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

