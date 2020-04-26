app.controller("discountOfferController", ["$scope", "$rootScope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $rootScope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var discountOffer = this;
    discountOffer.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    discountOffer.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item=='')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "discountOfferController")
        {
            localStorage.setItem('AddRequest','');
            discountOffer.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID',id);
    }

    discountOffer.UninversalMenus = [];
    discountOffer.selectUniversalMenuOnUndetectableKey = true;
    discountOffer.ViewNewUserDiv = false;
    discountOffer.ViewFindUserDiv = false;
    discountOffer.LinkMember = false;
    var todayDate = moment().format();
    discountOffer.FromDate = {
        defaultDate: todayDate
    }

    discountOffer.ToDate = {
        defaultDate: todayDate
    }

    discountOffer.testDate = moment().format();


    if (itemRecordStatus != undefined) discountOffer.itemRecordStatus = itemRecordStatus;

    
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

    discountOffer.init = function () {
        discountOffer.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = discountOffer.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"DiscountOffer/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            discountOffer.busyIndicator.isActive = false;
            discountOffer.ListItems = response.ListItems;
            discountOffer.gridOptions.fillData(discountOffer.ListItems, response.resultAccess);
            discountOffer.gridOptions.currentPageNumber = response.CurrentPageNumber;
            discountOffer.gridOptions.totalRowCount = response.TotalRowCount;
            discountOffer.gridOptions.rowPerPage = response.RowPerPage;
            discountOffer.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            discountOffer.busyIndicator.isActive = false;
            discountOffer.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            });

        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        discountOffer.checkRequestAddNewItemFromOtherControl(null);

    }
    if (!angular.isDefined(discountOffer.CategoryListItemsSeller))
        ajax.call(cmsServerConfig.configApiServerPath+"DiscountSeller/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            discountOffer.CategoryListItemsSeller = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    //// Open Add Modal
    //discountOffer.busyIndicator.isActive = true;
    //discountOffer.addRequested = false;
    //discountOffer.openAddModal = function () {
    //    discountOffer.ViewFindUserDiv = false;
    //    discountOffer.ViewNewUserDiv = false;
    //    discountOffer.modalTitle = 'اضافه';
    //    ajax.call(cmsServerConfig.configApiServerPath+'DiscountOffer/GetViewModel', "", 'GET').success(function (response) {
    //        rashaErManage.checkAction(response);
    //        discountOffer.busyIndicator.isActive = false;
    //        discountOffer.selectedItem = response.Item;
    //        if (discountOffer.CategoryListItemsSeller.length > 0)
    //            discountOffer.selectedItem.LinkSiteCategoryId = discountOffer.CategoryListItemsSeller[0].Id; // For auto selecting first SiteCategory option
    //        $modal.open({
    //            templateUrl: 'cpanelv1/ModuleDiscount/DiscountOffer/add.html',
    //            scope: $scope
    //        });
    //    }).error(function (data, errCode, c, d) {
    //        rashaErManage.checkAction(data, errCode);
    //        discountOffer.busyIndicator.isActive = false;

    //    });
    //}

    //// Add New Content
    //discountOffer.addNewRow = function (frm) {
    //    if (frm.$invalid)
    //        return;
    //    discountOffer.busyIndicator.isActive = true;
    //    discountOffer.addRequested = true;
    //    ajax.call(cmsServerConfig.configApiServerPath+'DiscountOffer/add', discountOffer.selectedItem, 'POST').success(function (response) {
    //        discountOffer.addRequested = false;
    //        discountOffer.busyIndicator.isActive = false;
    //        rashaErManage.checkAction(response);
    //        if (response.IsSuccess) {
    //            discountOffer.gridOptions.advancedSearchData.engine.Filters = null;
    //            discountOffer.gridOptions.advancedSearchData.engine.Filters = [];
    //            discountOffer.ListItems.unshift(response.Item);
    //            discountOffer.gridOptions.fillData(discountOffer.ListItems);
    //            discountOffer.closeModal();
    //        }
    //    }).error(function (data, errCode, c, d) {
    //        rashaErManage.checkAction(data, errCode);
    //        discountOffer.busyIndicator.isActive = false;
    //        discountOffer.addRequested = false;
    //    });
    //}
    // Open Add Modal

    discountOffer.busyIndicator.isActive = true;
    discountOffer.addRequested = false;
    discountOffer.openAddModal = function () {
        discountOffer.ViewFindUserDiv = false;
        discountOffer.ViewNewUserDiv = false;
        discountOffer.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'MemberUser/GetViewModel', "", "GET").success(function (response1) {
            discountOffer.busyIndicator.isActive = false;
            discountOffer.selectedMemberUser = response1.Item;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountOffer.busyIndicator.isActive = false;

        });
        ajax.call(cmsServerConfig.configApiServerPath+'discountOffer/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            discountOffer.busyIndicator.isActive = false;
            discountOffer.selectedItem = response.Item;

            $modal.open({
                templateUrl: 'cpanelv1/ModuleDiscount/discountOffer/add.html',
                scope: $scope
            });



        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountOffer.busyIndicator.isActive = false;

        });

    }

    // Add New Content
    discountOffer.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        discountOffer.busyIndicator.isActive = true;
        discountOffer.addRequested = true;
        if (discountOffer.ViewFindUserDiv) {
            discountOffer.addSerialCard();
            discountOffer.busyIndicator.isActive = false;
            discountOffer.addRequested = false;
        }
        else {

            discountOffer.addRequested = true;
            discountOffer.busyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+'memberuser/add', discountOffer.selectedMemberUser, 'POST').success(function (response1) {
                rashaErManage.checkAction(response1);
                if (response1.IsSuccess) {
                    discountOffer.selectedItem.LinkMemberId = response1.Item.Id;
                    discountOffer.addSerialCard();
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });



        }
    }
    discountOffer.addSerialCard = function () {
        ajax.call(cmsServerConfig.configApiServerPath+'discountOffer/add', discountOffer.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                discountOffer.checkRequestAddNewItemFromOtherControl(response.Item.Id);


                discountOffer.ListItems.unshift(response.Item);
                discountOffer.gridOptions.fillData(discountOffer.ListItems);
                discountOffer.closeModal();
                discountOffer.busyIndicator.isActive = false;
                discountOffer.addRequested = false;
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountOffer.busyIndicator.isActive = false;
            discountOffer.addRequested = false;
        });
    }
    //// Add #MemberInfo
    //discountOffer.addMemberInfo = function (frm) {
    //    if (discountOffer.addNewMemberUser == "1") {
    //        discountOffer.addRequested = true;
    //        discountOffer.busyIndicator.isActive = true;
    //        ajax.call(cmsServerConfig.configApiServerPath+'memberuser/add', discountOffer.selectedMemberUser, 'POST').success(function (response1) {
    //            rashaErManage.checkAction(response1);
    //            if (response1.IsSuccess) {
    //                discountOffer.selectedItem.LinkMemberId = response1.Item.Id;
    //                ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegrammemberInfo/edit', discountOffer.selectedItem, 'PUT').success(function (response2) {
    //                    rashaErManage.checkAction(response2);
    //                    discountOffer.addRequested = false;
    //                    discountOffer.busyIndicator.isActive = false;
    //                    if (response2.IsSuccess) {
    //                        discountOffer.gridOptions.selectedRow.item.LinkMemberId = response2.Item.LinkMemberId;
    //                        discountOffer.assginToGroup = true;
    //                        discountOffer.alreadyExist = true;
    //                        discountOffer.selectedMemberUser = response1.Item;
    //                        //memberInfo.closeModal();
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
    //        discountOffer.addRequested = true;
    //        discountOffer.busyIndicator.isActive = true;
    //        //discountOffer.selectedItem.LinkMemberId = selected.originalObject.Id; //Delete MemberUser
    //        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegrammemberInfo/edit', discountOffer.selectedItem, 'PUT').success(function (response) {
    //            rashaErManage.checkAction(response);
    //            discountOffer.addRequested = false;
    //            discountOffer.busyIndicator.isActive = false;
    //            if (response.IsSuccess) {
    //                discountOffer.gridOptions.selectedRow.item.LinkMemberId = response.Item.LinkMemberId;
    //                discountOffer.closeModal();
    //            }
    //        }).error(function (data, errCode, c, d) {
    //            rashaErManage.checkAction(data, errCode);
    //        });
    //    }
    //}

    //discountOffer.openEditModal = function () {

    //    discountOffer.modalTitle = 'ویرایش';
    //    if (!discountOffer.gridOptions.selectedRow.item) {
    //        rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
    //        return;
    //    }

    //    ajax.call(cmsServerConfig.configApiServerPath+'DiscountOffer/GetOne', discountOffer.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
    //        rashaErManage.checkAction(response);
    //        discountOffer.selectedItem = response.Item;
            
    //        if (discountOffer
    //            .LinkUniversalMenuIdOnUndetectableKey >
    //            0) discountOffer.selectUniversalMenuOnUndetectableKey = true;
    //        $modal.open({
    //            templateUrl: 'cpanelv1/ModuleDiscount/DiscountOffer/edit.html',
    //            scope: $scope
    //        });

    //    }).error(function (data, errCode, c, d) {
    //        rashaErManage.checkAction(data, errCode);
    //    });
    //}

    //// Edit a Content
    //discountOffer.editRow = function (frm) {
    //    if (frm.$invalid)
    //        return;
    //    discountOffer.busyIndicator.isActive = true;
    //    ajax.call(cmsServerConfig.configApiServerPath+'DiscountOffer/edit', discountOffer.selectedItem, 'PUT').success(function (response) {
    //        discountOffer.addRequested = true;
    //        rashaErManage.checkAction(response);
    //        discountOffer.busyIndicator.isActive = false;
    //        if (response.IsSuccess) {

    //            discountOffer.filterEnumSiteCategory(response.Item);
    //            discountOffer.addRequested = false;
    //            discountOffer.replaceItem(discountOffer.selectedItem.Id, response.Item);
    //            discountOffer.gridOptions.fillData(discountOffer.ListItems);
    //            discountOffer.closeModal();
    //        }
    //    }).error(function (data, errCode, c, d) {
    //        rashaErManage.checkAction(data, errCode);
    //        discountOffer.addRequested = false;
    //        discountOffer.busyIndicator.isActive = false;
    //    });
    //}
    //discountOffer.filterEnumSiteCategory = function (item) {
    //    for (var j = 0; j < discountOffer.CategoryListItems.length; j++) {
    //        if (item.LinkSiteCategoryId == discountOffer.CategoryListItems[j].Id) {
    //            item.virtual_CmsSiteCategory = {};
    //            item.virtual_CmsSiteCategory.Title = "";
    //            item.virtual_CmsSiteCategory.Title = discountOffer.CategoryListItems[j].Title;
    //        }
    //    }
    //}
    //discountOffer.closeModal = function () {
    //    $modalStack.dismissAll();
    //};

    //discountOffer.replaceItem = function (oldId, newItem) {
    //    angular.forEach(discountOffer.ListItems, function (item, key) {
    //        if (item.Id == oldId) {
    //            var index = discountOffer.ListItems.indexOf(item);
    //            discountOffer.ListItems.splice(index, 1);
    //        }
    //    });
    //    if (newItem)
    //        discountOffer.ListItems.unshift(newItem);
    //}
    discountOffer.openEditModal = function () {

        discountOffer.modalTitle = 'ویرایش';
        if (!discountOffer.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'MemberUser/GetViewModel', "", "GET").success(function (response2) {
            discountOffer.selectedMemberUser = response2.Item;

            discountOffer.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountOffer.busyIndicator.isActive = false;

        });
        ajax.call(cmsServerConfig.configApiServerPath+'discountOffer/GetOne', discountOffer.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            discountOffer.selectedItem = response.Item;
            if (response.Item.LinkMemberId != null && response.Item.LinkMemberId > 0) {
                discountOffer.LinkMember = true;
                //SEARCH MEMNER
                var engine = { Filters: [] };
                engine.Filters.push({ PropertyName: "NationalCode", SearchType: 0, StringValue1: discountOffer.gridOptions.selectedRow.item.LinkMemberId, ClauseType: 1 });
                engine.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: discountOffer.gridOptions.selectedRow.item.LinkMemberId, ClauseType: 1 });
                ajax.call(cmsServerConfig.configApiServerPath+'memberuser/GetOne', engine, 'POST').success(function (response) {
                    rashaErManage.checkAction(response);
                    discountOffer.selectedMember = response.Item;
                    if (discountOffer.selectedMember != null && discountOffer.selectedMember.Id > 0) {
                        discountOffer.ViewFindUserDiv = true;
                        discountOffer.ViewNewUserDiv = false;
                        discountOffer.selectedItem.LinkMemberId = discountOffer.selectedMember.Id;
                    }
                    else {
                        discountOffer.ViewFindUserDiv = false;
                        discountOffer.ViewNewUserDiv = false;
                    }
                }).error(function (data, errCode, c, d) {
                    discountOffer.ViewFindUserDiv = false;
                    discountOffer.ViewNewUserDiv = false;
                    rashaErManage.checkAction(data, errCode);
                });

                //SEARCH MEMBER
            }
            else
                discountOffer.LinkMember = false;
            if (discountOffer
                .LinkUniversalMenuIdOnUndetectableKey >
                0) discountOffer.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDiscount/discountOffer/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    discountOffer.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        //discountOffer.busyIndicator.isActive = true;
        discountOffer.addRequested = true;
        if (discountOffer.ViewFindUserDiv) {
            discountOffer.editSerialCard();
            //discountOffer.busyIndicator.isActive = false;
            //discountOffer.addRequested = false;
        }
        else {


            discountOffer.addRequested = true;
            discountOffer.busyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+'memberuser/add', discountOffer.selectedMemberUser, 'POST').success(function (response1) {
                rashaErManage.checkAction(response1);
                if (response1.IsSuccess) {
                    discountOffer.selectedItem.LinkMemberId = response1.Item.Id;
                    discountOffer.editSerialCard();
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });



        }

    }

    discountOffer.editSerialCard = function () {

        discountOffer.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'discountOffer/edit', discountOffer.selectedItem, 'PUT').success(function (response) {
            discountOffer.addRequested = true;
            rashaErManage.checkAction(response);
            discountOffer.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                discountOffer.addRequested = false;
                discountOffer.replaceItem(discountOffer.selectedItem.Id, response.item);
                discountOffer.gridOptions.fillData(discountOffer.ListItems);
                discountOffer.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountOffer.addRequested = false;
            discountOffer.busyIndicator.isActive = false;
        });
    }

    discountOffer.closeModal = function () {
        $modalStack.dismissAll();
    };

    discountOffer.replaceItem = function (oldId, newItem) {
        angular.forEach(discountOffer.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = discountOffer.ListItems.indexOf(item);
                discountOffer.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            discountOffer.ListItems.unshift(newItem);
    }

    discountOffer.deleteRow = function () {
        if (!discountOffer.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                discountOffer.busyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath+'DiscountOffer/GetOne', discountOffer.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    discountOffer.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'DiscountOffer/delete', discountOffer.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        discountOffer.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            discountOffer.replaceItem(discountOffer.selectedItemForDelete.Id);
                            discountOffer.gridOptions.fillData(discountOffer.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        discountOffer.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    discountOffer.busyIndicator.isActive = false;
                });
            }
        });
    }

    discountOffer.searchData = function () {
        discountOffer.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"discountOffer/getall", discountOffer.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            discountOffer.categoryBusyIndicator.isActive = false;
            discountOffer.ListItems = response.ListItems;
            discountOffer.gridOptions.fillData(discountOffer.ListItems);
            discountOffer.gridOptions.currentPageNumber = response.CurrentPageNumber;
            discountOffer.gridOptions.totalRowCount = response.TotalRowCount;
            discountOffer.gridOptions.rowPerPage = response.RowPerPage;
            discountOffer.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            discountOffer.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //discountOffer.gridOptions.searchData();

    }



    discountOffer.LinkMemberIdSelector = {
        displayMember: 'LastName',
        id: 'Id',
        fId: 'LinkMemberId',
        url: 'MemberUser',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'NationalCode',
        rowPerPage: 200,
        scope: discountOffer,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'FirstName', displayName: 'نام', sortable: true, type: 'string'},
                { name: 'LastName', displayName: 'نام خانوادگی', sortable: true, type: 'string'},
                { name: 'NationalCode', displayName: 'کد ملی', sortable: true, type: 'integer' }
            ]
        }
    }


    discountOffer.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'DiscountOfferTitle', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            { name: 'LinkMemberId', displayName: 'کد سیستمی مشتری', sortable: true, type: 'string', visible: true },
            { name: 'FromDate', displayName: 'از تاریخ', sortable: true, type: 'string', visible: true },
            { name: 'ToDate', displayName: 'تا تاریخ', sortable: true, type: 'string', visible: true },
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

    discountOffer.test = 'false';

    discountOffer.gridOptions.reGetAll = function () {
        discountOffer.init();
    }

    discountOffer.gridOptions.onRowSelected = function () { }

    discountOffer.columnCheckbox = false;
    discountOffer.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (discountOffer.gridOptions.columnCheckbox) {
            for (var i = 0; i < discountOffer.gridOptions.columns.length; i++) {
                //discountOffer.gridOptions.columns[i].visible = $("#" + discountOffer.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + discountOffer.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                discountOffer.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = discountOffer.gridOptions.columns;
            for (var i = 0; i < discountOffer.gridOptions.columns.length; i++) {
                discountOffer.gridOptions.columns[i].visible = true;
                var element = $("#" + discountOffer.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + discountOffer.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < discountOffer.gridOptions.columns.length; i++) {
            console.log(discountOffer.gridOptions.columns[i].name.concat(".visible: "), discountOffer.gridOptions.columns[i].visible);
        }
        discountOffer.gridOptions.columnCheckbox = !discountOffer.gridOptions.columnCheckbox;
    }

    //discountOffer.getUser = function (memberId) {
    //    discountOffer.ViewFindUserDiv = false;
    //    discountOffer.ViewNewUserDiv = false;
    //    ajax.call(cmsServerConfig.configApiServerPath+'memberuser/GetOne', memberId, 'GET').success(function (response) {
    //        rashaErManage.checkAction(response);
    //        discountOffer.selectedMember = response.Item;
    //    }).error(function (data, errCode, c, d) {
    //        rashaErManage.checkAction(data, errCode);
    //    });
    //    if (discountOffer.selectedMember != null) {
    //        discountOffer.ViewFindUserDiv = true;
    //        discountOffer.ViewNewUserDiv = false;
    //        discountOffer.selectedItem.LinkMemberId = discountOffer.selectedMember.Id;
    //    }
    //    else {
    //        discountOffer.ViewFindUserDiv = false;
    //        discountOffer.ViewNewUserDiv = true;
    //    }
    //}
    discountOffer.getUser = function (memberNa) {
        if (!memberNa)
            return;
        discountOffer.ViewFindUserDiv = false;
        discountOffer.ViewNewUserDiv = false;
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
            discountOffer.selectedMember = response.Item;
            if (discountOffer.selectedMember != null && discountOffer.selectedMember.Id!=0) {
                discountOffer.ViewFindUserDiv = true;
                discountOffer.ViewNewUserDiv = false;
                discountOffer.selectedItem.LinkMemberId = discountOffer.selectedMember.Id;
            }
            else {
                discountOffer.ViewFindUserDiv = false;
                discountOffer.ViewNewUserDiv = true;
            }
        }).error(function (data, errCode, c, d) {
            discountOffer.ViewFindUserDiv = false;
            discountOffer.ViewNewUserDiv = true;
            rashaErManage.checkAction(data, errCode);
        });

    }
    //Export Report 
    discountOffer.exportFile = function (frm) {
        discountOffer.addRequested = true;
        discountOffer.gridOptions.advancedSearchData.engine.ExportFile = discountOffer.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'DiscountOffer/exportfile', discountOffer.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            discountOffer.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                discountOffer.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //discountOffer.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    discountOffer.toggleExportForm = function () {
        discountOffer.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        discountOffer.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        discountOffer.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        discountOffer.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        discountOffer.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleDiscount/DiscountOffer/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    discountOffer.rowCountChanged = function () {
        if (!angular.isDefined(discountOffer.ExportFileClass.RowCount) || discountOffer.ExportFileClass.RowCount > 5000)
            discountOffer.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    discountOffer.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"DiscountOffer/count", discountOffer.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            discountOffer.addRequested = false;
            rashaErManage.checkAction(response);
            discountOffer.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            discountOffer.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

