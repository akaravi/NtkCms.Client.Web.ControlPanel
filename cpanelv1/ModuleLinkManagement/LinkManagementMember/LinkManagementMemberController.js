app.controller("linkManagementMemberController", ["$scope", "$state", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $state, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var linkManagementMember = this;
    linkManagementMember.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    linkManagementMember.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "linkManagementMemberCtrl") {
            localStorage.setItem('AddRequest', '');
            linkManagementMember.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    linkManagementMember.ContentList = [];

    linkManagementMember.allowedSearch = [];
    if (itemRecordStatus != undefined) linkManagementMember.itemRecordStatus = itemRecordStatus;
    linkManagementMember.init = function () {
        linkManagementMember.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = linkManagementMember.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }

        ajax.call(cmsServerConfig.configApiServerPath+"linkManagementMember/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementMember.busyIndicator.isActive = false;
            linkManagementMember.ListItems = response.ListItems;
            linkManagementMember.gridOptions.fillData(linkManagementMember.ListItems , response.resultAccess);
            linkManagementMember.gridOptions.currentPageNumber = response.CurrentPageNumber;
            linkManagementMember.gridOptions.totalRowCount = response.TotalRowCount;
            linkManagementMember.gridOptions.rowPerPage = response.RowPerPage;
            linkManagementMember.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            linkManagementMember.busyIndicator.isActive = false;
            linkManagementMember.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //linkManagementMember.busyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+'linkManagementMember/getall', {}, 'POST').success(function (response) {
        //    linkManagementMember.ContentList = response.ListItems;
        //    linkManagementMember.busyIndicator.isActive = false;
        //});
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        linkManagementMember.checkRequestAddNewItemFromOtherControl(null);
    }
    linkManagementMember.busyIndicator.isActive = true;
    linkManagementMember.addRequested = false;
    linkManagementMember.openAddModal = function () {
        linkManagementMember.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementMember/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementMember.busyIndicator.isActive = false;
            linkManagementMember.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleLinkManagement/linkManagementMember/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    linkManagementMember.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        linkManagementMember.busyIndicator.isActive = true;
        linkManagementMember.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementMember/add', linkManagementMember.selectedItem, 'POST').success(function (response) {
            linkManagementMember.addRequested = false;
            linkManagementMember.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                linkManagementMember.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                linkManagementMember.ListItems.unshift(response.Item);
                linkManagementMember.gridOptions.fillData(linkManagementMember.ListItems);
                linkManagementMember.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            linkManagementMember.busyIndicator.isActive = false;
            linkManagementMember.addRequested = false;
        });
    }


    linkManagementMember.openEditModal = function () {

        linkManagementMember.modalTitle = 'ویرایش';
        if (!linkManagementMember.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementMember/GetOne', linkManagementMember.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementMember.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleLinkManagement/linkManagementMember/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    linkManagementMember.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        linkManagementMember.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementMember/edit', linkManagementMember.selectedItem, 'PUT').success(function (response) {
            linkManagementMember.addRequested = true;
            rashaErManage.checkAction(response);
            linkManagementMember.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                linkManagementMember.addRequested = false;
                linkManagementMember.replaceItem(linkManagementMember.selectedItem.Id, response.Item);
                linkManagementMember.gridOptions.fillData(linkManagementMember.ListItems);
                linkManagementMember.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            linkManagementMember.addRequested = false;
        });
    }


    linkManagementMember.closeModal = function () {
        $modalStack.dismissAll();
    };

    linkManagementMember.replaceItem = function (oldId, newItem) {
        angular.forEach(linkManagementMember.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = linkManagementMember.ListItems.indexOf(item);
                linkManagementMember.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            linkManagementMember.ListItems.unshift(newItem);
    }

    linkManagementMember.deleteRow = function () {
        if (!linkManagementMember.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                linkManagementMember.busyIndicator.isActive = true;
                console.log(linkManagementMember.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'linkManagementMember/GetOne', linkManagementMember.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    linkManagementMember.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'linkManagementMember/delete', linkManagementMember.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        linkManagementMember.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            linkManagementMember.replaceItem(linkManagementMember.selectedItemForDelete.Id);
                            linkManagementMember.gridOptions.fillData(linkManagementMember.ListItems);
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

    linkManagementMember.searchData = function () {
        linkManagementMember.gridOptions.serachData();
    }
    linkManagementMember.LinkExternalCmsUserIdSelector = {
        displayMember: 'Username',
        id: 'Id',
        fId: 'LinkExternalCmsUserId',
        url: 'coreuser',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: linkManagementMember,
        columnOptions: {
            columns: [
               { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
               { name: 'Username', displayName: 'Username', sortable: true, type: 'string', visible: true },
            ]
        }
    }



    linkManagementMember.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkExternalCmsUserId', displayName: 'کد کاربر', sortable: true, type: "integer" },
            { name: 'CurrentDebtor', displayName: 'اعتبار فعلی بدهکار', sortable: true, type: 'string', visible: true },
            { name: 'CurrentCreditor', displayName: 'اعتبار فعلی بستانکار', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: "ActionKey1", displayName: 'billboard', displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="linkManagementMember.ShowBillboard(x.Id)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-eye" aria-hidden="true"></i></Button>' },
            { name: "ActionKey2", displayName: 'target', displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="linkManagementMember.ShowTarget(x.Id)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-eye" aria-hidden="true"></i></Button>' },
            { name: "ActionKey3", displayName: 'Accounting', displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="linkManagementMember.ShowAccounting(x.Id)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-eye" aria-hidden="true"></i></Button>' }
           

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    linkManagementMember.gridOptions.advancedSearchData = {};
    linkManagementMember.gridOptions.advancedSearchData.engine = {};
    linkManagementMember.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    linkManagementMember.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    linkManagementMember.gridOptions.advancedSearchData.engine.SortType = 1;
    linkManagementMember.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    linkManagementMember.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    linkManagementMember.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    linkManagementMember.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    linkManagementMember.gridOptions.advancedSearchData.engine.Filters = [];

    linkManagementMember.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            linkManagementMember.focusExpireLockAccount = true;
        });
    };

    linkManagementMember.gridOptions.reGetAll = function () {
        linkManagementMember.init();
    }


    linkManagementMember.ShowBillboard = function (selectedId) {
        $state.go("index.linkmanagementbillboard", { MemberId: selectedId });
    }
    linkManagementMember.ShowTarget = function (selectedId) {
        $state.go("index.linkmanagementtarget", { MemberId: selectedId });
    }
    linkManagementMember.ShowAccounting = function (selectedId) {
        $state.go("index.linkmanagementaccounting", { MemberId: selectedId });
    }


    linkManagementMember.columnCheckbox = false;
    linkManagementMember.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (linkManagementMember.gridOptions.columnCheckbox) {
            for (var i = 0; i < linkManagementMember.gridOptions.columns.length; i++) {
                //linkManagementMember.gridOptions.columns[i].visible = $("#" + linkManagementMember.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + linkManagementMember.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                linkManagementMember.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = linkManagementMember.gridOptions.columns;
            for (var i = 0; i < linkManagementMember.gridOptions.columns.length; i++) {
                linkManagementMember.gridOptions.columns[i].visible = true;
                var element = $("#" + linkManagementMember.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + linkManagementMember.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < linkManagementMember.gridOptions.columns.length; i++) {
            console.log(linkManagementMember.gridOptions.columns[i].name.concat(".visible: "), linkManagementMember.gridOptions.columns[i].visible);
        }
        linkManagementMember.gridOptions.columnCheckbox = !linkManagementMember.gridOptions.columnCheckbox;
    }
    //Export Report 
    linkManagementMember.exportFile = function () {
        linkManagementMember.addRequested = true;
        linkManagementMember.gridOptions.advancedSearchData.engine.ExportFile = linkManagementMember.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementMember/exportfile', linkManagementMember.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            linkManagementMember.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                linkManagementMember.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //linkManagementMember.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    linkManagementMember.toggleExportForm = function () {
        linkManagementMember.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        linkManagementMember.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        linkManagementMember.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        linkManagementMember.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        linkManagementMember.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleLinkManagement/linkManagementMember/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    linkManagementMember.rowCountChanged = function () {
        if (!angular.isDefined(linkManagementMember.ExportFileClass.RowCount) || linkManagementMember.ExportFileClass.RowCount > 5000)
            linkManagementMember.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    linkManagementMember.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"linkManagementMember/count", linkManagementMember.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            linkManagementMember.addRequested = false;
            rashaErManage.checkAction(response);
            linkManagementMember.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            linkManagementMember.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);