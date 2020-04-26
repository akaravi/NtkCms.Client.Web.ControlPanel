app.controller("cmsModuleSaleInvoiceController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var cmsModuleSaleInvoice = this;
    cmsModuleSaleInvoice.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    cmsModuleSaleInvoice.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "CmsModuleSaleInvoiceController") {
            localStorage.setItem('AddRequest', '');
            cmsModuleSaleInvoice.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    cmsModuleSaleInvoice.ContentList = [];

    cmsModuleSaleInvoice.allowedSearch = [];
    if (itemRecordStatus != undefined) cmsModuleSaleInvoice.itemRecordStatus = itemRecordStatus;
    cmsModuleSaleInvoice.init = function () {
        cmsModuleSaleInvoice.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = cmsModuleSaleInvoice.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }

        ajax.call(cmsServerConfig.configApiServerPath+"CoreModuleSaleInvoice/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsModuleSaleInvoice.busyIndicator.isActive = false;
            cmsModuleSaleInvoice.ListItems = response.ListItems;
            cmsModuleSaleInvoice.gridOptions.fillData(cmsModuleSaleInvoice.ListItems , response.resultAccess);
            cmsModuleSaleInvoice.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsModuleSaleInvoice.gridOptions.totalRowCount = response.TotalRowCount;
            cmsModuleSaleInvoice.gridOptions.rowPerPage = response.RowPerPage;
            cmsModuleSaleInvoice.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            cmsModuleSaleInvoice.busyIndicator.isActive = false;
            cmsModuleSaleInvoice.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //cmsModuleSaleInvoice.busyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSaleInvoice/getall', {}, 'POST').success(function (response) {
        //    cmsModuleSaleInvoice.ContentList = response.ListItems;
        //    cmsModuleSaleInvoice.busyIndicator.isActive = false;
        //});
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        cmsModuleSaleInvoice.checkRequestAddNewItemFromOtherControl(null);
    }
    cmsModuleSaleInvoice.busyIndicator.isActive = true;
    cmsModuleSaleInvoice.addRequested = false;
    cmsModuleSaleInvoice.openAddModal = function () {
        cmsModuleSaleInvoice.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSaleInvoice/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsModuleSaleInvoice.busyIndicator.isActive = false;
            cmsModuleSaleInvoice.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/CmsModuleSaleInvoice/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsModuleSaleInvoice.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        cmsModuleSaleInvoice.busyIndicator.isActive = true;
        cmsModuleSaleInvoice.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSaleInvoice/add', cmsModuleSaleInvoice.selectedItem, 'POST').success(function (response) {
            cmsModuleSaleInvoice.addRequested = false;
            cmsModuleSaleInvoice.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                cmsModuleSaleInvoice.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                cmsModuleSaleInvoice.ListItems.unshift(response.Item);
                cmsModuleSaleInvoice.gridOptions.fillData(cmsModuleSaleInvoice.ListItems);
                cmsModuleSaleInvoice.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsModuleSaleInvoice.busyIndicator.isActive = false;
            cmsModuleSaleInvoice.addRequested = false;
        });
    }


    cmsModuleSaleInvoice.openEditModal = function () {

        cmsModuleSaleInvoice.modalTitle = 'ویرایش';
        if (!cmsModuleSaleInvoice.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSaleInvoice/GetOne', cmsModuleSaleInvoice.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsModuleSaleInvoice.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/CmsModuleSaleInvoice/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsModuleSaleInvoice.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        cmsModuleSaleInvoice.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSaleInvoice/edit', cmsModuleSaleInvoice.selectedItem, 'PUT').success(function (response) {
            cmsModuleSaleInvoice.addRequested = true;
            rashaErManage.checkAction(response);
            cmsModuleSaleInvoice.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                cmsModuleSaleInvoice.addRequested = false;
                cmsModuleSaleInvoice.replaceItem(cmsModuleSaleInvoice.selectedItem.Id, response.Item);
                cmsModuleSaleInvoice.gridOptions.fillData(cmsModuleSaleInvoice.ListItems);
                cmsModuleSaleInvoice.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsModuleSaleInvoice.addRequested = false;
        });
    }


    cmsModuleSaleInvoice.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsModuleSaleInvoice.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsModuleSaleInvoice.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsModuleSaleInvoice.ListItems.indexOf(item);
                cmsModuleSaleInvoice.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsModuleSaleInvoice.ListItems.unshift(newItem);
    }

    cmsModuleSaleInvoice.deleteRow = function () {
        if (!cmsModuleSaleInvoice.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                cmsModuleSaleInvoice.busyIndicator.isActive = true;
                console.log(cmsModuleSaleInvoice.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSaleInvoice/GetOne', cmsModuleSaleInvoice.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    cmsModuleSaleInvoice.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSaleInvoice/delete', cmsModuleSaleInvoice.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        cmsModuleSaleInvoice.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            cmsModuleSaleInvoice.replaceItem(cmsModuleSaleInvoice.selectedItemForDelete.Id);
                            cmsModuleSaleInvoice.gridOptions.fillData(cmsModuleSaleInvoice.ListItems);
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

    cmsModuleSaleInvoice.searchData = function () {
        cmsModuleSaleInvoice.gridOptions.serachData();
    }
    cmsModuleSaleInvoice.LinkUserGroupIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkUserGroupId',
        url: 'cmsusergroup',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: cmsModuleSaleInvoice,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'},
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: "string" }
            ]
        }
    }
 cmsModuleSaleInvoice.LinkCmsSiteCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCmsSiteCategoryId',
        url: 'cmsSiteCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: cmsModuleSaleInvoice,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'},
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: "string" }
            ]
        }
    }


    cmsModuleSaleInvoice.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'virtual_SiteBuyer.Title', displayName: 'عنوان سایت خریدار', sortable: true, type: 'string', visible: true },
            { name: 'LinkSiteIdBuyer', displayName: 'کد سیستمی سایت خریدار', sortable: true, type: "string" },
            { name: 'HasUsed', displayName: 'استفاده شده',isCheckBox:true, sortable: true, type: "string" },
            { name: 'Price', displayName: 'قیمت', sortable: true, type: "integer" },
            { name: 'virtual_UserGroup.Title', displayName: 'عنوان گروه کاربری', sortable: true, type: 'string', visible: true },
            { name: 'LinkModuleSaleSerialId', displayName: 'کد سیستمی سریال', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: "ActionKey", displayName: 'جزییات', displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="cmsModuleSaleInvoice.showlistDetail(x.Id)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
           

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }
cmsModuleSaleInvoice.showlistDetail=function (IdInvoice){
     var s = {
            PropertyName: "LinkModuleSaleInvoiceId",
            IntValue1: IdInvoice,
            SearchType: 0
        }
        var engine = {};
        engine.Filters = [];
        engine.Filters.push(s);
ajax.call(cmsServerConfig.configApiServerPath+"CoreModuleSaleInvoiceDetail/getall", engine, "POST").success(function (response) {
            cmsModuleSaleInvoice.listComments = response.ListItems;
            rashaErManage.checkAction(response);
            cmsModuleSaleInvoice.gridOptionsDetail.fillData(cmsModuleSaleInvoice.listComments, response.resultAccess);
            cmsModuleSaleInvoice.gridOptionsDetail.currentPageNumber = response.CurrentPageNumber;
            cmsModuleSaleInvoice.gridOptionsDetail.totalRowCount = response.TotalRowCount;
            cmsModuleSaleInvoice.gridOptionsDetail.RowPerPage = response.RowPerPage;
            cmsModuleSaleInvoice.showGridComment = true;
            cmsModuleSaleInvoice.Title = cmsModuleSaleInvoice.gridOptions.selectedRow.item.Title;
        });
        $('html, body').animate({
            scrollTop: $("#showlistDetail").offset().top
        }, 850);
}
cmsModuleSaleInvoice.gridOptionsDetail = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'SalePrice', displayName: 'قیمت', sortable: true, type: "integer" },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: "string" },
            { name: 'ErrorMessage', displayName: 'پیغام خطا', sortable: true, type: "integer" },
            { name: 'HasWarning', displayName: 'اخطار',isCheckBox:true, sortable: true, type: "string" },
            { name: 'HasError', displayName: 'خطا',isCheckBox:true, sortable: true, type: "string" },
            { name: 'virtual_Module.Title', displayName: 'عنوان ماژول', sortable: true, type: 'string', visible: true },
            { name: 'LinkModuleId', displayName: 'کد سیستمی ماژول', sortable: true, type: "string" },
            { name: 'FromDate', displayName: 'تاریخ آغاز', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'ToDate', displayName: 'تاریخ پایان', sortable: true, isDate: true, type: 'date', visible: 'true' },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }
    cmsModuleSaleInvoice.gridOptions.advancedSearchData = {};
    cmsModuleSaleInvoice.gridOptions.advancedSearchData.engine = {};
    cmsModuleSaleInvoice.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    cmsModuleSaleInvoice.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    cmsModuleSaleInvoice.gridOptions.advancedSearchData.engine.SortType = 1;
    cmsModuleSaleInvoice.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    cmsModuleSaleInvoice.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    cmsModuleSaleInvoice.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    cmsModuleSaleInvoice.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    cmsModuleSaleInvoice.gridOptions.advancedSearchData.engine.Filters = [];

    cmsModuleSaleInvoice.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            cmsModuleSaleInvoice.focusExpireLockAccount = true;
        });
    };

    cmsModuleSaleInvoice.gridOptions.reGetAll = function () {
        cmsModuleSaleInvoice.init();
    }

    cmsModuleSaleInvoice.columnCheckbox = false;
    cmsModuleSaleInvoice.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (cmsModuleSaleInvoice.gridOptions.columnCheckbox) {
            for (var i = 0; i < cmsModuleSaleInvoice.gridOptions.columns.length; i++) {
                //cmsModuleSaleInvoice.gridOptions.columns[i].visible = $("#" + cmsModuleSaleInvoice.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + cmsModuleSaleInvoice.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                cmsModuleSaleInvoice.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = cmsModuleSaleInvoice.gridOptions.columns;
            for (var i = 0; i < cmsModuleSaleInvoice.gridOptions.columns.length; i++) {
                cmsModuleSaleInvoice.gridOptions.columns[i].visible = true;
                var element = $("#" + cmsModuleSaleInvoice.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + cmsModuleSaleInvoice.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < cmsModuleSaleInvoice.gridOptions.columns.length; i++) {
            console.log(cmsModuleSaleInvoice.gridOptions.columns[i].name.concat(".visible: "), cmsModuleSaleInvoice.gridOptions.columns[i].visible);
        }
        cmsModuleSaleInvoice.gridOptions.columnCheckbox = !cmsModuleSaleInvoice.gridOptions.columnCheckbox;
    }
    //Export Report 
    cmsModuleSaleInvoice.exportFile = function () {
        cmsModuleSaleInvoice.addRequested = true;
        cmsModuleSaleInvoice.gridOptions.advancedSearchData.engine.ExportFile = cmsModuleSaleInvoice.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSaleInvoice/exportfile', cmsModuleSaleInvoice.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            cmsModuleSaleInvoice.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsModuleSaleInvoice.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //cmsModuleSaleInvoice.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    cmsModuleSaleInvoice.toggleExportForm = function () {
        cmsModuleSaleInvoice.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        cmsModuleSaleInvoice.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        cmsModuleSaleInvoice.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        cmsModuleSaleInvoice.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        cmsModuleSaleInvoice.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCore/CmsModuleSaleInvoice/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    cmsModuleSaleInvoice.rowCountChanged = function () {
        if (!angular.isDefined(cmsModuleSaleInvoice.ExportFileClass.RowCount) || cmsModuleSaleInvoice.ExportFileClass.RowCount > 5000)
            cmsModuleSaleInvoice.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    cmsModuleSaleInvoice.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"CoreModuleSaleInvoice/count", cmsModuleSaleInvoice.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            cmsModuleSaleInvoice.addRequested = false;
            rashaErManage.checkAction(response);
            cmsModuleSaleInvoice.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            cmsModuleSaleInvoice.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);