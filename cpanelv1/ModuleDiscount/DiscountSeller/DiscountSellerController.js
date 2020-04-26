app.controller("discountSellerController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var discountSeller = this;
    discountSeller.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    discountSeller.selectedUser = [];
    discountSeller.ViewNewUserDiv = false;
    discountSeller.ViewFindUserDiv = false;
    discountSeller.LinkMember = false;
    if (itemRecordStatus != undefined) discountSeller.itemRecordStatus = itemRecordStatus;




    discountSeller.init = function () {
        discountSeller.busyIndicator.isActive = true;
        var engine = {};
        try {
            engine = discountSeller.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"DiscountSeller/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            discountSeller.busyIndicator.isActive = false;
            discountSeller.ListItems = response.ListItems;
            discountSeller.gridOptions.fillData(discountSeller.ListItems, response.resultAccess);
            discountSeller.gridOptions.currentPageNumber = response.CurrentPageNumber;
            discountSeller.gridOptions.totalRowCount = response.TotalRowCount;
            discountSeller.gridOptions.rowPerPage = response.RowPerPage;
            discountSeller.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            discountSeller.busyIndicator.isActive = false;
            discountSeller.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }


    discountSeller.busyIndicator.isActive = true;
    discountSeller.addRequested = false;
    discountSeller.openAddModal = function () {
        discountSeller.ViewFindUserDiv = false;
        discountSeller.ViewNewUserDiv = false;
        discountSeller.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/GetViewModel', "", "GET").success(function (response1) {
            discountSeller.busyIndicator.isActive = false;
            discountSeller.selectedUser = response1.Item;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountSeller.busyIndicator.isActive = false;

        });
        ajax.call(cmsServerConfig.configApiServerPath+'discountSeller/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            discountSeller.busyIndicator.isActive = false;
            discountSeller.selectedItem = response.Item;

            $modal.open({
                templateUrl: 'cpanelv1/ModuleDiscount/DiscountSeller/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountSeller.busyIndicator.isActive = false;

        });

    }

    // Add New Content
    discountSeller.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }


        discountSeller.busyIndicator.isActive = true;
        discountSeller.addRequested = true;
        if (discountSeller.ViewFindUserDiv) {
            if (discountSeller.selectedUser == undefined || discountSeller.selectedUser.Id == undefined || discountSeller.selectedUser.Id == 0) {
                rashaErManage.showMessage("لطفاَ یک نماینده را انتخاب کنید");
                discountSeller.busyIndicator.isActive = false;
                discountSeller.addRequested = false;
                return;
            }
            discountSeller.addSerialCard();
            discountSeller.busyIndicator.isActive = false;
            discountSeller.addRequested = false;
        }
        else {
            console.log(discountSeller.selectedUser);
            if (discountSeller.selectedUser == undefined || discountSeller.selectedUser.Username == undefined || discountSeller.selectedUser.Username == null) {
                rashaErManage.showMessage("لطفاَ اطلاعات نماینده را وارد کنید");
                discountSeller.busyIndicator.isActive = false;
                discountSeller.addRequested = false;
                return;
            }
            discountSeller.addRequested = true;
            discountSeller.busyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/add', discountSeller.selectedUser, 'POST').success(function (response1) {
                rashaErManage.checkAction(response1);
                if (response1.IsSuccess) {
                    discountSeller.selectedItem.LinkModuleCoreCmsUserId = response1.Item.Id;
                    discountSeller.addSerialCard();
                }
                else {
                    discountSeller.addRequested = false;
                    discountSeller.busyIndicator.isActive = false;
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                discountSeller.addRequested = false;
                discountSeller.busyIndicator.isActive = false;

            });



        }
    }
    discountSeller.addSerialCard = function () {

        console.log(discountSeller.selectedItem);
        if (discountSeller.selectedItem.LinkModuleCoreCmsUserId == undefined || discountSeller.selectedItem.LinkModuleCoreCmsUserId == 0) {
            rashaErManage.showMessage("لطفاَ یک نماینده را انتخاب کنید");
            discountSeller.busyIndicator.isActive = false;
            discountSeller.addRequested = false;
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'discountSeller/add', discountSeller.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                discountSeller.ListItems.unshift(response.Item);
                discountSeller.gridOptions.fillData(discountSeller.ListItems);
                discountSeller.closeModal();
                discountSeller.busyIndicator.isActive = false;
                discountSeller.addRequested = false;
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountSeller.busyIndicator.isActive = false;
            discountSeller.addRequested = false;
        });
    }

    discountSeller.openEditModal = function () {

        discountSeller.modalTitle = 'ویرایش';
        if (!discountSeller.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/GetViewModel', "", "GET").success(function (response2) {
            discountSeller.selectedUser = response2.Item;
            discountSeller.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountSeller.busyIndicator.isActive = false;

        });
        ajax.call(cmsServerConfig.configApiServerPath+'discountSeller/GetOne', discountSeller.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            discountSeller.selectedItem = response.Item;
            discountSeller.selectedItem.LinkModuleCoreCmsUserIdSearch = '';
            if (response.Item.LinkModuleCoreCmsUserId != null && response.Item.LinkModuleCoreCmsUserId > 0) {
                discountSeller.LinkMember = true;
                //SEARCH MEMNER
                var engine = { Filters: [] };
                engine.Filters.push({ PropertyName: "NationalCode", SearchType: 0, StringValue1: discountSeller.gridOptions.selectedRow.item.LinkModuleCoreCmsUserId, ClauseType: 1 });
                engine.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: discountSeller.gridOptions.selectedRow.item.LinkModuleCoreCmsUserId, ClauseType: 1 });
                ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/GetOne', engine, 'POST').success(function (response3) {
                    rashaErManage.checkAction(response);
                    discountSeller.selectedUser = response3.Item;
                    if (discountSeller.selectedUser != null && discountSeller.selectedUser.Id > 0) {
                        discountSeller.ViewFindUserDiv = true;
                        discountSeller.ViewNewUserDiv = false;
                        discountSeller.selectedItem.LinkModuleCoreCmsUserId = discountSeller.selectedUser.Id;
                    }
                    else {
                        discountSeller.ViewFindUserDiv = false;
                        discountSeller.ViewNewUserDiv = false;
                    }
                }).error(function (data, errCode, c, d) {
                    discountSeller.ViewFindUserDiv = false;
                    discountSeller.ViewNewUserDiv = false;
                    rashaErManage.checkAction(data, errCode);
                });

                //SEARCH MEMBER
            }


            else
                discountSeller.LinkMember = false;
            if (discountSeller
                .LinkUniversalMenuIdOnUndetectableKey >
                0) discountSeller.selectUniversalMenuOnUndetectableKey = true;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDiscount/discountSeller/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }


    // Edit a Content
    discountSeller.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        //discountSeller.busyIndicator.isActive = true;
        discountSeller.addRequested = true;
        if (discountSeller.ViewFindUserDiv) {
            discountSeller.editSellserInternal();
            //discountSeller.busyIndicator.isActive = false;
            //discountSeller.addRequested = false;
        }
        else {


            discountSeller.addRequested = true;
            discountSeller.busyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/add', discountSeller.selectedUser, 'POST').success(function (response1) {
                rashaErManage.checkAction(response1);
                discountSeller.busyIndicator.isActive = false;
                discountSeller.addRequested = false;
                if (response1.IsSuccess) {
                    discountSeller.selectedItem.LinkModuleCoreCmsUserId = response1.Item.Id;
                    discountSeller.editSellserInternal();
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                discountSeller.busyIndicator.isActive = false;
                discountSeller.addRequested = false;
            });



        }

    }

    discountSeller.editSellserInternal = function () {

        discountSeller.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'discountSeller/edit', discountSeller.selectedItem, 'PUT').success(function (response) {
            discountSeller.addRequested = true;
            rashaErManage.checkAction(response);
            discountSeller.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                discountSeller.addRequested = false;
                discountSeller.replaceItem(discountSeller.selectedItem.Id, response.Item);
                discountSeller.gridOptions.fillData(discountSeller.ListItems);
                discountSeller.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            discountSeller.addRequested = false;
            discountSeller.busyIndicator.isActive = false;
        });
    }

    discountSeller.closeModal = function () {
        $modalStack.dismissAll();
    };

    discountSeller.replaceItem = function (oldId, newItem) {
        angular.forEach(discountSeller.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = discountSeller.ListItems.indexOf(item);
                discountSeller.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            discountSeller.ListItems.unshift(newItem);
    }




    discountSeller.LinkMemberIdSelector = {
        displayMember: 'LastName',
        id: 'Id',
        fId: 'LinkMemberId',
        url: 'MemberUser',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'NationalCode',
        rowPerPage: 200,
        scope: discountSeller,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'FirstName', displayName: 'نام', sortable: true, type: 'string'},
                { name: 'LastName', displayName: 'نام خانوادگی', sortable: true, type: 'string'},
                { name: 'NationalCode', displayName: 'کد ملی', sortable: true, type: 'integer' }
            ]
        }
    }


    discountSeller.deleteRow = function () {
        if (!discountSeller.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                discountSeller.busyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath+'DiscountSeller/GetOne', discountSeller.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    discountSeller.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'DiscountSeller/delete', discountSeller.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        discountSeller.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            discountSeller.replaceItem(discountSeller.selectedItemForDelete.Id);
                            discountSeller.gridOptions.fillData(discountSeller.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        discountSeller.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    discountSeller.busyIndicator.isActive = false;
                });
            }
        });
    }

    discountSeller.searchData = function () {
        discountSeller.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"discountSeller/getall", discountSeller.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            discountSeller.categoryBusyIndicator.isActive = false;
            discountSeller.ListItems = response.ListItems;
            discountSeller.gridOptions.fillData(discountSeller.ListItems);
            discountSeller.gridOptions.currentPageNumber = response.CurrentPageNumber;
            discountSeller.gridOptions.totalRowCount = response.TotalRowCount;
            discountSeller.gridOptions.rowPerPage = response.RowPerPage;
            discountSeller.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            discountSeller.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });

    }

    discountSeller.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'LinkModuleCoreCmsUserId', displayName: 'کد سیستمی نماینده', sortable: true, type: 'integer', visible: true },
            { name: 'BranchTitle', displayName: 'عنوان شعبه', sortable: true, type: 'string', visible: true },


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

    discountSeller.test = 'false';

    discountSeller.gridOptions.reGetAll = function () {
        discountSeller.init();
    }

    discountSeller.gridOptions.onRowSelected = function () { }

    discountSeller.columnCheckbox = false;
    discountSeller.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (discountSeller.gridOptions.columnCheckbox) {
            for (var i = 0; i < discountSeller.gridOptions.columns.length; i++) {
                //discountSeller.gridOptions.columns[i].visible = $("#" + discountSeller.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + discountSeller.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                discountSeller.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = discountSeller.gridOptions.columns;
            for (var i = 0; i < discountSeller.gridOptions.columns.length; i++) {
                discountSeller.gridOptions.columns[i].visible = true;
                var element = $("#" + discountSeller.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + discountSeller.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < discountSeller.gridOptions.columns.length; i++) {
            console.log(discountSeller.gridOptions.columns[i].name.concat(".visible: "), discountSeller.gridOptions.columns[i].visible);
        }
        discountSeller.gridOptions.columnCheckbox = !discountSeller.gridOptions.columnCheckbox;
    }
    discountSeller.getUser = function (userId) {
        if (!userId)
            return;
        discountSeller.ViewFindUserDiv = false;
        discountSeller.ViewNewUserDiv = false;
        var engine = { Filters: [] };
        engine.Filters.push({ PropertyName: "NationalCode", SearchType: 0, StringValue1: userId, ClauseType: 1 });
        engine.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: userId, ClauseType: 1 });
        ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/GetOne', engine, 'POST').success(function (response) {

            rashaErManage.checkAction(response);

            if (response.IsSuccess) {
                discountSeller.selectedUser = response.Item;
                if (discountSeller.selectedUser != null && discountSeller.selectedUser.Id != 0) {
                    discountSeller.ViewFindUserDiv = true;
                    discountSeller.ViewNewUserDiv = false;
                }
            }
            else {
                rashaErManage.showMessage("نماینده یافت نشد");
                discountSeller.ViewFindUserDiv = false;
                discountSeller.ViewNewUserDiv = true;
            }
        }).error(function (data, errCode, c, d) {
            //discountSeller.ViewFindUserDiv = false;
            //discountSeller.ViewNewUserDiv = true;
            //rashaErManage.checkAction(data, errCode);
        });

    }

    //Export Report 
    discountSeller.exportFile = function () {
        discountSeller.addRequested = true;
        discountSeller.gridOptions.advancedSearchData.engine.ExportFile = discountSeller.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'DiscountSeller/exportfile', discountSeller.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            discountSeller.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                discountSeller.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //discountSeller.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    discountSeller.toggleExportForm = function () {
        discountSeller.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        discountSeller.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        discountSeller.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        discountSeller.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        discountSeller.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleDiscount/DiscountSeller/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    discountSeller.rowCountChanged = function () {
        if (!angular.isDefined(discountSeller.ExportFileClass.RowCount) || discountSeller.ExportFileClass.RowCount > 5000)
            discountSeller.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    discountSeller.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"DiscountSeller/count", discountSeller.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            discountSeller.addRequested = false;
            rashaErManage.checkAction(response);
            discountSeller.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            discountSeller.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

