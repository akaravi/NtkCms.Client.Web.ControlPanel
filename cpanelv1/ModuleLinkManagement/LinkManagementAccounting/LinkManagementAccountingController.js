app.controller("linkManagementAccountingController", ["$scope", "$stateParams", "$state", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $stateParams, $state, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var linkManagementAccounting = this;
    linkManagementAccounting.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    linkManagementAccounting.selectedMember = {
        MemberId: $stateParams.MemberId
    };
    var date = moment().format();
    
    linkManagementAccounting.datePickerConfig = {
        defaultDate: date
    };
    linkManagementAccounting.BeginDate = {
        defaultDate: date
    }
    linkManagementAccounting.EndDate = {
        defaultDate: date
    }

    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    linkManagementAccounting.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "linkManagementAccountingCtrl") {
            localStorage.setItem('AddRequest', '');
            linkManagementAccounting.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    linkManagementAccounting.ContentList = [];

    linkManagementAccounting.allowedSearch = [];
    if (itemRecordStatus != undefined) linkManagementAccounting.itemRecordStatus = itemRecordStatus;
    linkManagementAccounting.init = function () {
        linkManagementAccounting.busyIndicator.isActive = true;
        if (linkManagementAccounting.selectedMember.MemberId == 0 || linkManagementAccounting.selectedMember.MemberId == null) {
            $state.go("index.linkmanagementmember");
            return;
        }
        var engine = {};
        try {
            engine = linkManagementAccounting.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }
        linkManagementAccounting.busyIndicator.isActive = true;
        var filterModel = {
            PropertyName: "LinkManagementMemberId",
            SearchType: 0,
            IntValue1: linkManagementAccounting.selectedMember.MemberId
        };
        engine.Filters.push(filterModel);


        ajax.call(cmsServerConfig.configApiServerPath+"linkManagementAccounting/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementAccounting.busyIndicator.isActive = false;
            linkManagementAccounting.ListItems = response.ListItems;
            linkManagementAccounting.gridOptions.fillData(linkManagementAccounting.ListItems , response.resultAccess);
            linkManagementAccounting.gridOptions.currentPageNumber = response.CurrentPageNumber;
            linkManagementAccounting.gridOptions.totalRowCount = response.TotalRowCount;
            linkManagementAccounting.gridOptions.rowPerPage = response.RowPerPage;
            linkManagementAccounting.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            linkManagementAccounting.busyIndicator.isActive = false;
            linkManagementAccounting.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //linkManagementAccounting.busyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+'linkManagementAccounting/getall', {}, 'POST').success(function (response) {
        //    linkManagementAccounting.ContentList = response.ListItems;
        //    linkManagementAccounting.busyIndicator.isActive = false;
        //});
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        linkManagementAccounting.checkRequestAddNewItemFromOtherControl(null);
    }
    linkManagementAccounting.busyIndicator.isActive = true;
    linkManagementAccounting.addRequested = false;
    linkManagementAccounting.openAddModal = function () {
        linkManagementAccounting.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementAccounting/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementAccounting.busyIndicator.isActive = false;
            linkManagementAccounting.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleLinkManagement/linkManagementAccounting/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    linkManagementAccounting.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        linkManagementAccounting.busyIndicator.isActive = true;
        linkManagementAccounting.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementAccounting/add', linkManagementAccounting.selectedItem, 'POST').success(function (response) {
            linkManagementAccounting.addRequested = false;
            linkManagementAccounting.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                linkManagementAccounting.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                linkManagementAccounting.ListItems.unshift(response.Item);
                linkManagementAccounting.gridOptions.fillData(linkManagementAccounting.ListItems);
                linkManagementAccounting.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            linkManagementAccounting.busyIndicator.isActive = false;
            linkManagementAccounting.addRequested = false;
        });
    }


    linkManagementAccounting.openEditModal = function () {

        linkManagementAccounting.modalTitle = 'ویرایش';
        if (!linkManagementAccounting.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementAccounting/GetOne', linkManagementAccounting.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementAccounting.selectedItem = response.Item;
            linkManagementAccounting.BeginDate.defaultDate = linkManagementAccounting.selectedItem.BeginDate;
            linkManagementAccounting.EndDate.defaultDate = linkManagementAccounting.selectedItem.EndDate;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleLinkManagement/linkManagementAccounting/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    linkManagementAccounting.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        linkManagementAccounting.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementAccounting/edit', linkManagementAccounting.selectedItem, 'PUT').success(function (response) {
            linkManagementAccounting.addRequested = true;
            rashaErManage.checkAction(response);
            linkManagementAccounting.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                linkManagementAccounting.addRequested = false;
                linkManagementAccounting.replaceItem(linkManagementAccounting.selectedItem.Id, response.Item);
                linkManagementAccounting.gridOptions.fillData(linkManagementAccounting.ListItems);
                linkManagementAccounting.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            linkManagementAccounting.addRequested = false;
        });
    }


    linkManagementAccounting.closeModal = function () {
        $modalStack.dismissAll();
    };

    linkManagementAccounting.replaceItem = function (oldId, newItem) {
        angular.forEach(linkManagementAccounting.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = linkManagementAccounting.ListItems.indexOf(item);
                linkManagementAccounting.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            linkManagementAccounting.ListItems.unshift(newItem);
    }

    linkManagementAccounting.deleteRow = function () {
        if (!linkManagementAccounting.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                linkManagementAccounting.busyIndicator.isActive = true;
                console.log(linkManagementAccounting.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'linkManagementAccounting/GetOne', linkManagementAccounting.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    linkManagementAccounting.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'linkManagementAccounting/delete', linkManagementAccounting.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        linkManagementAccounting.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            linkManagementAccounting.replaceItem(linkManagementAccounting.selectedItemForDelete.Id);
                            linkManagementAccounting.gridOptions.fillData(linkManagementAccounting.ListItems);
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

    linkManagementAccounting.searchData = function () {
        linkManagementAccounting.gridOptions.serachData();
    }
    linkManagementAccounting.LinkManagementMemberIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkManagementMemberId',
        url: 'LinkManagementMember',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: linkManagementAccounting,
        columnOptions: {
            columns: [
               { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
               { name: 'Username', displayName: 'Username', sortable: true, type: 'string', visible: true },
            ]
        }
    }



    linkManagementAccounting.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkManagementMemberId', displayName: 'کد سیستمی عضو', sortable: true, type: 'integer', visible: true },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: "string" },
            { name: 'Notes', displayName: 'توضیحات اضافی', sortable: true, type: "string" },
            { name: 'Debtor', displayName: 'مبلغ بدهکار', sortable: true, type: 'integer', visible: true },
            { name: 'Creditor', displayName: 'مبلغ بستانکار', sortable: true, type: 'integer', visible: true },
            { name: 'BeginDate', displayName: 'از تاریخ', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'EndDate', displayName: 'تا تاریخ', sortable: true, isDate: true, type: 'date', visible: 'true' },
            
           

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    linkManagementAccounting.gridOptions.advancedSearchData = {};
    linkManagementAccounting.gridOptions.advancedSearchData.engine = {};
    linkManagementAccounting.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    linkManagementAccounting.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    linkManagementAccounting.gridOptions.advancedSearchData.engine.SortType = 1;
    linkManagementAccounting.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    linkManagementAccounting.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    linkManagementAccounting.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    linkManagementAccounting.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    linkManagementAccounting.gridOptions.advancedSearchData.engine.Filters = [];

    linkManagementAccounting.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            linkManagementAccounting.focusExpireLockAccount = true;
        });
    };

    linkManagementAccounting.gridOptions.reGetAll = function () {
        linkManagementAccounting.init();
    }

    linkManagementAccounting.columnCheckbox = false;
    linkManagementAccounting.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (linkManagementAccounting.gridOptions.columnCheckbox) {
            for (var i = 0; i < linkManagementAccounting.gridOptions.columns.length; i++) {
                //linkManagementAccounting.gridOptions.columns[i].visible = $("#" + linkManagementAccounting.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + linkManagementAccounting.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                linkManagementAccounting.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = linkManagementAccounting.gridOptions.columns;
            for (var i = 0; i < linkManagementAccounting.gridOptions.columns.length; i++) {
                linkManagementAccounting.gridOptions.columns[i].visible = true;
                var element = $("#" + linkManagementAccounting.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + linkManagementAccounting.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < linkManagementAccounting.gridOptions.columns.length; i++) {
            console.log(linkManagementAccounting.gridOptions.columns[i].name.concat(".visible: "), linkManagementAccounting.gridOptions.columns[i].visible);
        }
        linkManagementAccounting.gridOptions.columnCheckbox = !linkManagementAccounting.gridOptions.columnCheckbox;
    }
    //Export Report 
    linkManagementAccounting.exportFile = function () {
        linkManagementAccounting.addRequested = true;
        linkManagementAccounting.gridOptions.advancedSearchData.engine.ExportFile = linkManagementAccounting.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementAccounting/exportfile', linkManagementAccounting.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            linkManagementAccounting.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                linkManagementAccounting.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //linkManagementAccounting.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    linkManagementAccounting.toggleExportForm = function () {
        linkManagementAccounting.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        linkManagementAccounting.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        linkManagementAccounting.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        linkManagementAccounting.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        linkManagementAccounting.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleLinkManagement/linkManagementAccounting/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    linkManagementAccounting.rowCountChanged = function () {
        if (!angular.isDefined(linkManagementAccounting.ExportFileClass.RowCount) || linkManagementAccounting.ExportFileClass.RowCount > 5000)
            linkManagementAccounting.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    linkManagementAccounting.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"linkManagementAccounting/count", linkManagementAccounting.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            linkManagementAccounting.addRequested = false;
            rashaErManage.checkAction(response);
            linkManagementAccounting.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            linkManagementAccounting.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);