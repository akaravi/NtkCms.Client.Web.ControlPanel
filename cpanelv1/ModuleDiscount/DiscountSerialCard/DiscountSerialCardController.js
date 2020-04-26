app.controller("discountSerialCardController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var discountSerialCard = this;
    discountSerialCard.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    discountSerialCard.selectedMemberUser = [];
    discountSerialCard.ViewNewUserDiv = false;
    discountSerialCard.ViewFindUserDiv = false;
    discountSerialCard.ViewInfoUserDiv = false;
    var todayDate = moment().format();

    discountSerialCard.ToDate = {
        defaultDate: todayDate
    }
    discountSerialCard.FromDate = {
        defaultDate: todayDate
    }
    discountSerialCard.testDate = moment().format();
    if (itemRecordStatus != undefined) discountSerialCard.itemRecordStatus = itemRecordStatus;

    // Many To Many
    // MemberUserGroup  جدول واسط
    // LinkMemberUserId   فیلد جدول دیگر در جدول واسط
    // LinkMemberGroupId  فیلد ما در جدول واسط
    discountSerialCard.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'MemberGroup_Id';
    var thisTableFieldICollection = 'MemberUserGroup';
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها


    ajax.call(cmsServerConfig.configApiServerPath+"MemberGroup/getall", {}, 'POST').success(function (response) {
        discountSerialCard.memberGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });



    discountSerialCard.init = function () {
        discountSerialCard.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"DiscountSerialCard/getall", discountSerialCard.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            discountSerialCard.busyIndicator.isActive = false;
            discountSerialCard.ListItems = response.ListItems;
            discountSerialCard.gridOptions.fillData(discountSerialCard.ListItems, response.resultAccess);
            discountSerialCard.gridOptions.currentPageNumber = response.CurrentPageNumber;
            discountSerialCard.gridOptions.totalRowCount = response.TotalRowCount;
            discountSerialCard.gridOptions.rowPerPage = response.RowPerPage;
            discountSerialCard.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            discountSerialCard.busyIndicator.isActive = false;
            discountSerialCard.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    if (!angular.isDefined(discountSerialCard.CategoryListItems))
        ajax.call(cmsServerConfig.configApiServerPath+"DiscountGroup/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            discountSerialCard.CategoryListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    if (!angular.isDefined(discountSerialCard.CategoryListItemsSeller))
        ajax.call(cmsServerConfig.configApiServerPath+"discountSerialCard/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            discountSerialCard.CategoryListItemsSeller = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    // Open Add Modal

    discountSerialCard.busyIndicator.isActive = true;
    discountSerialCard.addRequested = false;
    discountSerialCard.openAddModal = function () {
        discountSerialCard.ViewFindUserDiv = false;
        discountSerialCard.ViewNewUserDiv = false;
        discountSerialCard.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'MemberUser/GetViewModel', "", "GET").success(function (response1) {
            discountSerialCard.busyIndicator.isActive = false;
            discountSerialCard.selectedMemberUser = response1.Item;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountSerialCard.busyIndicator.isActive = false;

        });
        ajax.call(cmsServerConfig.configApiServerPath+'DiscountSerialCard/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            discountSerialCard.busyIndicator.isActive = false;
            discountSerialCard.selectedItem = response.Item;
            if (discountSerialCard.CategoryListItems.length > 0)
                discountSerialCard.selectedItem.LinkSiteCategoryId = discountSerialCard.CategoryListItems[0].Id; // For auto selecting first SiteCategory option
            if (discountSerialCard.CategoryListItemsSeller && discountSerialCard.CategoryListItemsSeller.length > 0)
                discountSerialCard.selectedItem.LinkSiteCategoryId = discountSerialCard.CategoryListItemsSeller[0].Id; // For auto selecting first SiteCategory option
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDiscount/DiscountSerialCard/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountSerialCard.busyIndicator.isActive = false;

        });

    }

    // Add New Content
    discountSerialCard.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        discountSerialCard.busyIndicator.isActive = true;
        discountSerialCard.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'DiscountSerialCard/add', discountSerialCard.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                discountSerialCard.ListItems.unshift(response.Item);
                discountSerialCard.gridOptions.fillData(discountSerialCard.ListItems);
                discountSerialCard.closeModal();
                discountSerialCard.busyIndicator.isActive = false;
                discountSerialCard.addRequested = false;
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountSerialCard.busyIndicator.isActive = false;
            discountSerialCard.addRequested = false;
        });
        //if (discountSerialCard.ViewFindUserDiv) {
        //    discountSerialCard.addSerialCard();
        //    discountSerialCard.busyIndicator.isActive = false;
        //    discountSerialCard.addRequested = false;
        //}
        //else {

        //        discountSerialCard.addRequested = true;
        //        discountSerialCard.busyIndicator.isActive = true;
        //        ajax.call(cmsServerConfig.configApiServerPath+'memberuser/add', discountSerialCard.selectedMemberUser, 'POST').success(function (response1) {
        //            rashaErManage.checkAction(response1);
        //            if (response1.IsSuccess) {
        //                discountSerialCard.selectedItem.LinkMemberId = response1.Item.Id;
        //                discountSerialCard.addSerialCard();
        //            }
        //        }).error(function (data, errCode, c, d) {
        //            rashaErManage.checkAction(data, errCode);
        //        });



        //}
    }
    //discountSerialCard.addSerialCard = function () {

    //}
    //discountSerialCard.openSaleModal = function () {

    //    discountSerialCard.modalTitle = 'فروش کارت';
    //    if (!discountSerialCard.gridOptions.selectedRow.item) {
    //        rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
    //        return;
    //    }

    //    ajax.call(cmsServerConfig.configApiServerPath+'DiscountSerialCard/GetOne', discountSerialCard.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
    //        rashaErManage.checkAction(response);
    //        discountSerialCard.selectedItem = response.Item;
    //        if (discountSerialCard
    //            .LinkUniversalMenuIdOnUndetectableKey >
    //            0) discountSerialCard.selectUniversalMenuOnUndetectableKey = true;
    //        $modal.open({
    //            templateUrl: 'cpanelv1/ModuleDiscount/DiscountSerialCard/sale.html',
    //            scope: $scope
    //        });

    //    }).error(function (data, errCode, c, d) {
    //        rashaErManage.checkAction(data, errCode);
    //    });
    //}



    discountSerialCard.openEditModal = function () {

        discountSerialCard.modalTitle = 'ویرایش';
        if (!discountSerialCard.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'MemberUser/GetViewModel', "", "GET").success(function (response2) {
            discountSerialCard.selectedMemberUser = response2.Item;

            discountSerialCard.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountSerialCard.busyIndicator.isActive = false;

        });
        ajax.call(cmsServerConfig.configApiServerPath+'DiscountSerialCard/GetOne', discountSerialCard.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            discountSerialCard.selectedItem = response.Item;
            discountSerialCard.ViewInfoUserDiv = false;
            discountSerialCard.ViewFindUserDiv = false;

            if (response.Item.LinkMemberId != null && response.Item.LinkMemberId > 0) {
                discountSerialCard.ViewInfoUserDiv = true;
                discountSerialCard.ViewFindUserDiv = true;
                //SEARCH MEMNER
                var engine = { Filters: [] };
                engine.Filters.push({ PropertyName: "NationalCode", SearchType: 0, StringValue1: discountSerialCard.gridOptions.selectedRow.item.LinkMemberId, ClauseType: 1 });
                engine.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: discountSerialCard.gridOptions.selectedRow.item.LinkMemberId, ClauseType: 1 });
                ajax.call(cmsServerConfig.configApiServerPath+'memberuser/GetOne', engine, 'POST').success(function (response) {
                    rashaErManage.checkAction(response);
                    discountSerialCard.selectedMemberUser = response.Item;
                    if (discountSerialCard.selectedMemberUser != null && discountSerialCard.selectedMemberUser.Id > 0) {
                        discountSerialCard.ViewFindUserDiv = true;
                        discountSerialCard.ViewNewUserDiv = false;
                        discountSerialCard.selectedItem.LinkMemberId = discountSerialCard.selectedMemberUser.Id;
                    }
                    else {
                        discountSerialCard.ViewFindUserDiv = false;
                        discountSerialCard.ViewNewUserDiv = false;
                    }
                }).error(function (data, errCode, c, d) {
                    discountSerialCard.ViewFindUserDiv = false;
                    discountSerialCard.ViewNewUserDiv = false;
                    rashaErManage.checkAction(data, errCode);
                });

                //SEARCH MEMBER
            }

            else
                discountSerialCard.ViewInfoUserDiv = false;
            if (discountSerialCard
                .LinkUniversalMenuIdOnUndetectableKey >
                0) discountSerialCard.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDiscount/DiscountSerialCard/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    discountSerialCard.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        //discountSerialCard.busyIndicator.isActive = true;
        discountSerialCard.addRequested = true;
        if (discountSerialCard.ViewFindUserDiv || discountSerialCard.selectedItem.NationalCode == undefined) {
            discountSerialCard.editSerialCard();
            //discountSerialCard.busyIndicator.isActive = false;
            //discountSerialCard.addRequested = false;
        }
        else {


            discountSerialCard.addRequested = true;
            discountSerialCard.busyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+'memberuser/add', discountSerialCard.selectedMemberUser, 'POST').success(function (response1) {
                rashaErManage.checkAction(response1);
                if (response1.IsSuccess) {
                    discountSerialCard.selectedItem.LinkMemberId = response1.Item.Id;
                    discountSerialCard.editSerialCard();
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });



        }

    }

    discountSerialCard.editSerialCard = function () {

        discountSerialCard.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'DiscountSerialCard/edit', discountSerialCard.selectedItem, 'PUT').success(function (response) {
            discountSerialCard.addRequested = true;
            rashaErManage.checkAction(response);
            discountSerialCard.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                discountSerialCard.addRequested = false;
                discountSerialCard.replaceItem(discountSerialCard.selectedItem.Id, response.Item);
                discountSerialCard.gridOptions.fillData(discountSerialCard.ListItems);
                discountSerialCard.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountSerialCard.addRequested = false;
            discountSerialCard.busyIndicator.isActive = false;
        });
    }

    discountSerialCard.closeModal = function () {
        $modalStack.dismissAll();
    };

    discountSerialCard.replaceItem = function (oldId, newItem) {
        angular.forEach(discountSerialCard.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = discountSerialCard.ListItems.indexOf(item);
                discountSerialCard.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            discountSerialCard.ListItems.unshift(newItem);
    }

    discountSerialCard.deleteRow = function () {
        if (!discountSerialCard.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                discountSerialCard.busyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath+'DiscountSerialCard/GetOne', discountSerialCard.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    discountSerialCard.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'DiscountSerialCard/delete', discountSerialCard.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        discountSerialCard.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            discountSerialCard.replaceItem(discountSerialCard.selectedItemForDelete.Id);
                            discountSerialCard.gridOptions.fillData(discountSerialCard.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        discountSerialCard.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    discountSerialCard.busyIndicator.isActive = false;
                });
            }
        });
    }

    discountSerialCard.searchData = function () {
        discountSerialCard.gridOptions.searchData();

    }



    discountSerialCard.LinkDiscountSerialCardFlowGroupIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkDiscountSerialCardFlowGroupId',
        url: 'DiscountSerialCardFlowGroup',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        scope: discountSerialCard,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true }
            ]
        }
    }
    discountSerialCard.LinkDiscountGroupIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkDiscountGroupId',
        url: 'DiscountGroup',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        scope: discountSerialCard,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true }
            ]
        }
    }

    discountSerialCard.LinkDiscountSellerIdSelector = {
        displayMember: 'BranchTitle',
        id: 'Id',
        fId: 'LinkDiscountSellerId',
        url: 'DiscountSeller',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: discountSerialCard,
        defaultFilter: { PropertyName: 'IsActivated', ClauseType: 2, BooleanValue1: true },
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'BranchTitle', displayName: 'عنوان شعبه', sortable: true, enableSearch: true, type: 'string'}
            ]
        }
    }

    discountSerialCard.gridOptions = {
        columns: [
            { name: 'LinkMemberId', displayName: 'وضعیت فروش', sortable: true, type: 'string', visible: true, template: '<div ng-if="x.LinkMemberId!=null ">فروخته شده</div>'},
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkMemberId', displayName: 'کد سیستمی مشتری', sortable: true, type: 'string', visible: true },
            { name: 'ModuleMember.FirstName', displayName: 'نام مشتری', sortable: true, type: 'string', visible: true },
            { name: 'ModuleMember.LastName', displayName: 'نام خانوادگی مشتری', sortable: true, type: 'string', visible: true },
            { name: 'ModuleMember.NationalCode', displayName: 'کد ملی مشتری', sortable: true, type: 'string', visible: true },
            { name: 'LinkDiscountGroupId', displayName: 'کد سیستمی گروه', sortable: true, type: 'string', visible: true },
            { name: 'DiscountSerialCardIdentifier', displayName: 'شماره کارت ', sortable: true, type: 'string', visible: true },
            { name: 'virtual_DiscountSeller.BranchTitle', displayName: 'نماینده', sortable: true, type: 'string', visible: true },
            { name: 'MonthExpireLength', displayName: 'تعداد ماه انقضا', sortable: true, type: 'string', visible: true },
            { name: 'SerialRfId', displayName: 'RfIdسریال', sortable: true, type: 'string', visible: true },
            { name: 'SerialNumber', displayName: 'شماره سریال', sortable: true, type: 'string', visible: true },
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

    discountSerialCard.test = 'false';

    discountSerialCard.gridOptions.reGetAll = function () {
        discountSerialCard.init();
    }

    discountSerialCard.gridOptions.onRowSelected = function () { }

    discountSerialCard.columnCheckbox = false;
    discountSerialCard.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (discountSerialCard.gridOptions.columnCheckbox) {
            for (var i = 0; i < discountSerialCard.gridOptions.columns.length; i++) {
                //discountSerialCard.gridOptions.columns[i].visible = $("#" + discountSerialCard.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + discountSerialCard.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                discountSerialCard.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = discountSerialCard.gridOptions.columns;
            for (var i = 0; i < discountSerialCard.gridOptions.columns.length; i++) {
                discountSerialCard.gridOptions.columns[i].visible = true;
                var element = $("#" + discountSerialCard.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + discountSerialCard.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < discountSerialCard.gridOptions.columns.length; i++) {
            console.log(discountSerialCard.gridOptions.columns[i].name.concat(".visible: "), discountSerialCard.gridOptions.columns[i].visible);
        }
        discountSerialCard.gridOptions.columnCheckbox = !discountSerialCard.gridOptions.columnCheckbox;
    }
    discountSerialCard.getUser = function (memberNa) {
        if (!memberNa)
            return;
        discountSerialCard.ViewFindUserDiv = false;
        discountSerialCard.ViewNewUserDiv = false;
        var engine = { Filters: [] };
        engine.Filters.push({ PropertyName: "NationalCode", SearchType: 0, StringValue1: memberNa, ClauseType: 1 });
        engine.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: memberNa, ClauseType: 1 });
        ajax.call(cmsServerConfig.configApiServerPath+'memberuser/GetOne', engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            discountSerialCard.selectedMemberUser = response.Item;
            if (discountSerialCard.selectedMemberUser != null && discountSerialCard.selectedMemberUser.Id > 0) {
                discountSerialCard.ViewFindUserDiv = true;
                discountSerialCard.ViewNewUserDiv = false;
                discountSerialCard.selectedItem.LinkMemberId = discountSerialCard.selectedMemberUser.Id;
            }
            else {
                discountSerialCard.ViewFindUserDiv = false;
                discountSerialCard.ViewNewUserDiv = true;
            }
        }).error(function (data, errCode, c, d) {
            discountSerialCard.ViewFindUserDiv = false;
            discountSerialCard.ViewNewUserDiv = true;
            rashaErManage.checkAction(data, errCode);
        });

    }

    //Export Report 
    discountSerialCard.exportFile = function (frm) {
        discountSerialCard.addRequested = true;
        discountSerialCard.gridOptions.advancedSearchData.engine.ExportFile = discountSerialCard.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'DiscountSerialCard/exportfile', discountSerialCard.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            discountSerialCard.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                discountSerialCard.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //discountSerialCard.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    discountSerialCard.toggleExportForm = function () {
        discountSerialCard.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        discountSerialCard.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        discountSerialCard.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        discountSerialCard.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        discountSerialCard.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleDiscount/DiscountSerialCard/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    discountSerialCard.rowCountChanged = function () {
        if (!angular.isDefined(discountSerialCard.ExportFileClass.RowCount) || discountSerialCard.ExportFileClass.RowCount > 5000)
            discountSerialCard.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    discountSerialCard.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"DiscountSerialCard/count", discountSerialCard.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            discountSerialCard.addRequested = false;
            rashaErManage.checkAction(response);
            discountSerialCard.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            discountSerialCard.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

