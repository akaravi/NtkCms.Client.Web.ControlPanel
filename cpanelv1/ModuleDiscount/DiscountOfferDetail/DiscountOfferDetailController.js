app.controller("discountOfferDetailController", ["$scope", "$rootScope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $rootScope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var discountOfferDetail = this;
    discountOfferDetail.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }


    $rootScope.$on("OpenAddNewDialogFromOtherController", function (event, args) {
        console.log('discountOfferDetail loaded');
        //discountOffer.openAddModal();
    });

    discountOfferDetail.UninversalMenus = [];
    discountOfferDetail.selectUniversalMenuOnUndetectableKey = true;

    if (itemRecordStatus != undefined) discountOfferDetail.itemRecordStatus = itemRecordStatus;

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها


    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        discountOfferDetail.memberGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    //discountOfferDetail.hasInMany2Many = function (OtherTable) {
    //    if (discountOfferDetail.selectedMemberUser == null || discountOfferDetail.selectedMemberUser[thisTableFieldICollection] == undefined || discountOfferDetail.selectedMemberUser[thisTableFieldICollection] == null) return false;
    //    return objectFindByKey(discountOfferDetail.selectedMemberUser[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    //};
    //discountOfferDetail.toggleMany2Many = function (role, OtherTable) {
    //    var obj = {};
    //    obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
    //    if (discountOfferDetail.hasInMany2Many(OtherTable)) {
    //        //var index = discountOfferDetail.selectedMemberUser[thisTableFieldICollection].indexOf(obj);
    //        var index = arrayObjectIndexOf(discountOfferDetail.selectedMemberUser[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
    //        // get the index of this permission role
    //        discountOfferDetail.selectedMemberUser[thisTableFieldICollection].splice(index, 1);
    //    } else {
    //        discountOfferDetail.selectedMemberUser[thisTableFieldICollection].push(obj);
    //    }
    //}
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

    discountOfferDetail.init = function () {
        discountOfferDetail.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = discountOfferDetail.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"DiscountOfferDetail/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            discountOfferDetail.busyIndicator.isActive = false;
            discountOfferDetail.ListItems = response.ListItems;
            discountOfferDetail.gridOptions.fillData(discountOfferDetail.ListItems, response.resultAccess);
            discountOfferDetail.gridOptions.currentPageNumber = response.CurrentPageNumber;
            discountOfferDetail.gridOptions.totalRowCount = response.TotalRowCount;
            discountOfferDetail.gridOptions.rowPerPage = response.RowPerPage;
            discountOfferDetail.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            discountOfferDetail.busyIndicator.isActive = false;
            discountOfferDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    if (!angular.isDefined(discountOfferDetail.CategoryListItems))
        ajax.call(cmsServerConfig.configApiServerPath+"DiscountGroup/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            discountOfferDetail.CategoryListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            });
    if (!angular.isDefined(discountOfferDetail.CategoryListItemsOffer))
        ajax.call(cmsServerConfig.configApiServerPath+"DiscountOffer/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            discountOfferDetail.CategoryListItemsOffer = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    // Open Add Modal
    discountOfferDetail.busyIndicator.isActive = true;
    discountOfferDetail.addRequested = false;
    discountOfferDetail.openAddModal = function () {
        discountOfferDetail.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'DiscountOfferDetail/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            discountOfferDetail.busyIndicator.isActive = false;
            discountOfferDetail.selectedItem = response.Item;
            if (discountOfferDetail.CategoryListItems.length > 0)
                discountOfferDetail.selectedItem.LinkSiteCategoryId = discountOfferDetail.CategoryListItems[0].Id; // For auto selecting first SiteCategory option
            if (discountOfferDetail.CategoryListItemsOffer.length > 0)
                discountOfferDetail.selectedItem.LinkSiteCategoryId = discountOfferDetail.CategoryListItemsOffer[0].Id; // For auto selecting first SiteCategory option
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDiscount/DiscountOfferDetail/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountOfferDetail.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    discountOfferDetail.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        discountOfferDetail.busyIndicator.isActive = true;
        discountOfferDetail.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'DiscountOfferDetail/add', discountOfferDetail.selectedItem, 'POST').success(function (response) {
            discountOfferDetail.addRequested = false;
            discountOfferDetail.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                discountOfferDetail.gridOptions.advancedSearchData.engine.Filters = null;
                discountOfferDetail.gridOptions.advancedSearchData.engine.Filters = [];
                discountOfferDetail.ListItems.unshift(response.Item);
                discountOfferDetail.gridOptions.fillData(discountOfferDetail.ListItems);
                discountOfferDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountOfferDetail.busyIndicator.isActive = false;
            discountOfferDetail.addRequested = false;
        });
    }

    discountOfferDetail.LinkDiscountOfferIdSelector = {
        displayMember: 'DiscountOfferTitle',
        id: 'Id',
        fId: 'LinkDiscountOfferId',
        url: 'DiscountOffer',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'DiscountOfferTitle',
        rowPerPage: 200,
        scope: discountOfferDetail,
        rootScop: $rootScope,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'DiscountOfferTitle', displayName: 'عنوان', sortable: true, type: 'string' }
            ]
        }
    }


    discountOfferDetail.LinkDiscountGroupIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkDiscountGroupId',
        url: 'DiscountGroup',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        scope: discountOfferDetail,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    discountOfferDetail.LinkModuleReservationServiceIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkModuleReservationServiceId',
        url: 'ReservationService',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        scope: discountOfferDetail,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    discountOfferDetail.openEditModal = function () {

        discountOfferDetail.modalTitle = 'ویرایش';
        if (!discountOfferDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'DiscountOfferDetail/GetOne', discountOfferDetail.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            discountOfferDetail.selectedItem = response.Item;
            if (discountOfferDetail
                .LinkUniversalMenuIdOnUndetectableKey >
                0) discountOfferDetail.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDiscount/DiscountOfferDetail/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    discountOfferDetail.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        discountOfferDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'DiscountOfferDetail/edit', discountOfferDetail.selectedItem, 'PUT').success(function (response) {
            discountOfferDetail.addRequested = true;
            rashaErManage.checkAction(response);
            discountOfferDetail.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                discountOfferDetail.addRequested = false;
                discountOfferDetail.replaceItem(discountOfferDetail.selectedItem.Id, response.Item);
                discountOfferDetail.gridOptions.fillData(discountOfferDetail.ListItems);
                discountOfferDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountOfferDetail.addRequested = false;
            discountOfferDetail.busyIndicator.isActive = false;
        });
    }

    discountOfferDetail.closeModal = function () {
        $modalStack.dismissAll();
    };

    discountOfferDetail.replaceItem = function (oldId, newItem) {
        angular.forEach(discountOfferDetail.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = discountOfferDetail.ListItems.indexOf(item);
                discountOfferDetail.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            discountOfferDetail.ListItems.unshift(newItem);
    }

    discountOfferDetail.deleteRow = function () {
        if (!discountOfferDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                discountOfferDetail.busyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath+'DiscountOfferDetail/GetOne', discountOfferDetail.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    discountOfferDetail.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'DiscountOfferDetail/delete', discountOfferDetail.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        discountOfferDetail.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            discountOfferDetail.replaceItem(discountOfferDetail.selectedItemForDelete.Id);
                            discountOfferDetail.gridOptions.fillData(discountOfferDetail.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        discountOfferDetail.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    discountOfferDetail.busyIndicator.isActive = false;
                });
            }
        });
    }

    discountOfferDetail.searchData = function () {
        discountOfferDetail.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"discountOfferDetail/getall", discountOfferDetail.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            discountOfferDetail.categoryBusyIndicator.isActive = false;
            discountOfferDetail.ListItems = response.ListItems;
            discountOfferDetail.gridOptions.fillData(discountOfferDetail.ListItems);
            discountOfferDetail.gridOptions.currentPageNumber = response.CurrentPageNumber;
            discountOfferDetail.gridOptions.totalRowCount = response.TotalRowCount;
            discountOfferDetail.gridOptions.rowPerPage = response.RowPerPage;
            discountOfferDetail.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            discountOfferDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });

    }

    discountOfferDetail.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkDiscountOfferId', displayName: 'کد سیستمی پیشنهاد', sortable: true, type: 'string', visible: true },
            { name: 'LinkDiscountGroupId', displayName: 'ک سیستمی گروه', sortable: true, type: 'string', visible: true },
            { name: 'LinkModuleReservationServiceId', displayName: 'سرویس رزرواسیون', sortable: true, type: 'string', visible: true },
            { name: 'CardFixedPrice', displayName: 'قیمت ثابت کارت', sortable: true, type: 'string', visible: true },
            { name: 'CardPercentPrice', displayName: 'قیمت درصد کارت', sortable: true, type: 'string', visible: true },
            { name: 'MarketerFixedPrice', displayName: 'قیمت ثابت نماینده', sortable: true, type: 'string', visible: true },
            { name: 'MarketerPercentPrice', displayName: 'قیمت درصد نماینده', sortable: true, type: 'string', visible: true },
            { name: 'Star', displayName: 'ستاره', sortable: true, type: 'string', visible: true },
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

    discountOfferDetail.test = 'false';

    discountOfferDetail.gridOptions.reGetAll = function () {
        discountOfferDetail.init();
    }

    discountOfferDetail.gridOptions.onRowSelected = function () { }

    discountOfferDetail.columnCheckbox = false;
    discountOfferDetail.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (discountOfferDetail.gridOptions.columnCheckbox) {
            for (var i = 0; i < discountOfferDetail.gridOptions.columns.length; i++) {
                //discountOfferDetail.gridOptions.columns[i].visible = $("#" + discountOfferDetail.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + discountOfferDetail.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                discountOfferDetail.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = discountOfferDetail.gridOptions.columns;
            for (var i = 0; i < discountOfferDetail.gridOptions.columns.length; i++) {
                discountOfferDetail.gridOptions.columns[i].visible = true;
                var element = $("#" + discountOfferDetail.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + discountOfferDetail.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < discountOfferDetail.gridOptions.columns.length; i++) {
            console.log(discountOfferDetail.gridOptions.columns[i].name.concat(".visible: "), discountOfferDetail.gridOptions.columns[i].visible);
        }
        discountOfferDetail.gridOptions.columnCheckbox = !discountOfferDetail.gridOptions.columnCheckbox;
    }
    ////Open #MemberInfo Modal
    //discountOfferDetail.openInfoModal = function (selectedId, memberId, botConfigId, chatId) {
    //    //Get Telegram User Info
    //    discountOfferDetail.addRequested = true;
    //    discountOfferDetail.busyIndicator.isActive = true;
    //    var engine = { Filters: [{ PropertyName: "ChatId", IntValue1: chatId, SearchType: 0 }] };
    //    engine.SortColumn = "ChatId";
    //    engine.SortType = 0;
    //    engine.RowPerPage = 1000000;
    //    ajax.call(cmsServerConfig.configApiServerPath+"ApiTelegramLogInput/getone", engine, "POST").success(function (response) { //Get Telegram user info from input logs
    //        discountOfferDetail.addRequested = false;
    //        discountOfferDetail.busyIndicator.isActive = false;
    //        discountOfferDetail.selectedLogInput = response.Item;
    //    }).error(function (data, errCode, c, d) {
    //        rashaErManage.checkAction(data, errCode);
    //    });
    //    if (!angular.isDefined(discountOfferDetail.memberGroups))
    //        ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response3) {  //Get MemberGroups to set and assign members to groups
    //            discountOfferDetail.memberGroups = response3.ListItems;
    //        }).error(function (data, errCode, c, d) {
    //            console.log(data);
    //        });

    //    discountOfferDetail.modalTitle = 'اطّلاعات کاربران';
    //    if (memberId != null && memberId != "") {
    //        discountOfferDetail.alreadyExist = true;
    //    }
    //    else {
    //        memberId = "0";
    //        discountOfferDetail.alreadyExist = false;
    //    }
    //    discountOfferDetail.addRequested = true;
    //    discountOfferDetail.busyIndicator.isActive = true;
    //    ajax.call(cmsServerConfig.configApiServerPath+"ApiTelegramMemberInfo/GetOne", selectedId, "GET").success(function (response) {
    //        discountOfferDetail.selectedItem = response.Item;
    //        discountOfferDetail.selectedItem.LinkMemberId = memberId;
    //        ajax.call(cmsServerConfig.configApiServerPath+"MemberUser/GetOne", memberId, "GET").success(function (response) {
    //            discountOfferDetail.selectedMemberUser = response.Item;
    //            discountOfferDetail.addRequested = false;
    //            discountOfferDetail.busyIndicator.isActive = false;
    //            $modal.open({
    //                templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegramMemberInfo/discountOfferDetail.html',
    //                scope: $scope
    //            });
    //        }).error(function (data, errCode, c, d) {
    //            rashaErManage.checkAction(data, errCode);
    //        });
    //    }).error(function (data, errCode, c, d) {
    //        rashaErManage.checkAction(data, errCode);
    //    });
    //}

    //// Add #MemberInfo
    //discountOfferDetail.addMemberInfo = function (frm) {
    //    if (discountOfferDetail.addNewMemberUser == "1") {
    //        discountOfferDetail.addRequested = true;
    //        discountOfferDetail.busyIndicator.isActive = true;
    //        ajax.call(cmsServerConfig.configApiServerPath+'memberuser/add', discountOfferDetail.selectedMemberUser, 'POST').success(function (response1) {
    //            rashaErManage.checkAction(response1);
    //            if (response1.IsSuccess) {
    //                discountOfferDetail.selectedItem.LinkMemberId = response1.Item.Id;
    //                ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramdiscountOfferDetail/edit', discountOfferDetail.selectedItem, 'PUT').success(function (response2) {
    //                    rashaErManage.checkAction(response2);
    //                    discountOfferDetail.addRequested = false;
    //                    discountOfferDetail.busyIndicator.isActive = false;
    //                    if (response2.IsSuccess) {
    //                        discountOfferDetail.gridOptions.selectedRow.item.LinkMemberId = response2.Item.LinkMemberId;
    //                        discountOfferDetail.assginToGroup = true;
    //                        discountOfferDetail.alreadyExist = true;
    //                        discountOfferDetail.selectedMemberUser = response1.Item;
    //                        //discountOfferDetail.closeModal();
    //                    }
    //                }).error(function (data, errCode, c, d) {
    //                    rashaErManage.checkAction(data, errCode);
    //                });
    //            }
    //        }).error(function (data, errCode, c, d) {
    //            rashaErManage.checkAction(data, errCode);
    //        });
    //    }
    //    else {
    //        discountOfferDetail.addRequested = true;
    //        discountOfferDetail.busyIndicator.isActive = true;
    //        //discountOfferDetail.selectedItem.LinkMemberId = selected.originalObject.Id; //Delete MemberUser
    //        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramdiscountOfferDetail/edit', discountOfferDetail.selectedItem, 'PUT').success(function (response) {
    //            rashaErManage.checkAction(response);
    //            discountOfferDetail.addRequested = false;
    //            discountOfferDetail.busyIndicator.isActive = false;
    //            if (response.IsSuccess) {
    //                discountOfferDetail.gridOptions.selectedRow.item.LinkMemberId = response.Item.LinkMemberId;
    //                discountOfferDetail.closeModal();
    //            }
    //        }).error(function (data, errCode, c, d) {
    //            rashaErManage.checkAction(data, errCode);
    //        });
    //    }
    //}
    //discountOfferDetail.editMemberUserGroup = function (frm) {
    //    discountOfferDetail.addRequested = true;
    //    discountOfferDetail.busyIndicator.isActive = true;
    //    ajax.call(cmsServerConfig.configApiServerPath+'MemberUser/edit', discountOfferDetail.selectedMemberUser, 'PUT').success(function (response) {
    //        rashaErManage.checkAction(response);
    //        if (response.IsSuccess) {
    //            discountOfferDetail.addRequested = false;
    //            discountOfferDetail.busyIndicator.isActive = false;
    //            discountOfferDetail.closeModal();
    //        }
    //    }).error(function (data, errCode, c, d) {
    //        rashaErManage.checkAction(data, errCode);
    //    });
    //}
    //// Delete #MemberInfo
    //discountOfferDetail.deleteMemberInfo = function (frm) {
    //    discountOfferDetail.addRequested = true;
    //    discountOfferDetail.busyIndicator.isActive = true;
    //    discountOfferDetail.selectedItem.LinkMemberId = null;//Delete MemberUser
    //    ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramdiscountOfferDetail/edit', discountOfferDetail.selectedItem, 'PUT').success(function (response) {
    //        rashaErManage.checkAction(response);
    //        discountOfferDetail.addRequested = false;
    //        discountOfferDetail.busyIndicator.isActive = false;
    //        if (response.IsSuccess) {
    //            discountOfferDetail.closeModal();
    //            discountOfferDetail.gridOptions.selectedRow.item.LinkMemberId = null;
    //        }
    //    }).error(function (data, errCode, c, d) {
    //        rashaErManage.checkAction(data, errCode);
    //    });
    //}
    ////ngautocomplete
    //discountOfferDetail.userSelected = function (selected) {
    //    if (selected) {
    //        discountOfferDetail.selectedItem.LinkMemberId = 'loading';
    //        discountOfferDetail.selectedMemberUser = null;
    //        discountOfferDetail.addRequested = true;
    //        ajax.call(cmsServerConfig.configApiServerPath+"MemberUser/GetOne", selected.originalObject.Id, "GET").success(function (response) {
    //            discountOfferDetail.addRequested = false;
    //            rashaErManage.checkAction(response);
    //            discountOfferDetail.selectedItem.LinkMemberId = selected.originalObject.Id;
    //            discountOfferDetail.selectedMemberUser = response.Item;
    //        }).error(function (data, errCode, c, d) {
    //            rashaErManage.checkAction(data, errCode);
    //        });
    //    } else {
    //        discountOfferDetail.selectedMemberUser = null;
    //        discountOfferDetail.selectedItem.LinkMemberId = null;
    //    }
    //}
    ////ngautocomplete
    //discountOfferDetail.memberUserListItems = [];
    //discountOfferDetail.inputUserChanged = function (input) {
    //    var engine = { Filters: [] };
    //    engine.Filters.push({ PropertyName: "FirstName", SearchType: 5, StringValue1: input, ClauseType: 1 });
    //    engine.Filters.push({ PropertyName: "LastName", SearchType: 5, StringValue1: input, ClauseType: 1 });
    //    ajax.call(cmsServerConfig.configApiServerPath+"memberuser/search", engine, 'POST').success(function (response) {
    //        rashaErManage.checkAction(response);
    //        discountOfferDetail.memberUserListItems = response.ListItems;
    //    }).error(function (data, errCode, c, d) {
    //        rashaErManage.checkAction(data, errCode);
    //    });
    //}
    //Export Report 
    discountOfferDetail.exportFile = function (frm) {
        discountOfferDetail.addRequested = true;
        discountOfferDetail.gridOptions.advancedSearchData.engine.ExportFile = discountOfferDetail.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'DiscountOfferDetail/exportfile', discountOfferDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            discountOfferDetail.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                discountOfferDetail.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //discountOfferDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    discountOfferDetail.toggleExportForm = function () {
        discountOfferDetail.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        discountOfferDetail.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        discountOfferDetail.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        discountOfferDetail.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        discountOfferDetail.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleDiscount/DiscountOfferDetail/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    discountOfferDetail.rowCountChanged = function () {
        if (!angular.isDefined(discountOfferDetail.ExportFileClass.RowCount) || discountOfferDetail.ExportFileClass.RowCount > 5000)
            discountOfferDetail.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    discountOfferDetail.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"DiscountOfferDetail/count", discountOfferDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            discountOfferDetail.addRequested = false;
            rashaErManage.checkAction(response);
            discountOfferDetail.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            discountOfferDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

