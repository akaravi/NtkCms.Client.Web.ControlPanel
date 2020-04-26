app.controller("biographyCommentCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var biographyComment = this;
    biographyComment.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    biographyComment.ContentList = [];
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    biographyComment.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "biographyCommentCtrl") {
            localStorage.setItem('AddRequest', '');
            biographyComment.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    biographyComment.allowedSearch = [];
    if (itemRecordStatus != undefined) biographyComment.itemRecordStatus = itemRecordStatus;
    biographyComment.init = function () {
        biographyComment.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = biographyComment.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }

        ajax.call(cmsServerConfig.configApiServerPath+"biographyComment/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            biographyComment.busyIndicator.isActive = false;
            biographyComment.ListItems = response.ListItems;
            biographyComment.gridOptions.fillData(biographyComment.ListItems , response.resultAccess);
            biographyComment.gridOptions.currentPageNumber = response.CurrentPageNumber;
            biographyComment.gridOptions.totalRowCount = response.TotalRowCount;
            biographyComment.gridOptions.rowPerPage = response.RowPerPage;
            biographyComment.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            biographyComment.busyIndicator.isActive = false;
            biographyComment.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //biographyComment.busyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+'biographyComment/getall', {}, 'POST').success(function (response) {
        //    biographyComment.ContentList = response.ListItems;
        //    biographyComment.busyIndicator.isActive = false;
        //});
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        biographyComment.checkRequestAddNewItemFromOtherControl(null);
    }
    biographyComment.busyIndicator.isActive = true;
    biographyComment.addRequested = false;
    biographyComment.openAddModal = function () {
        biographyComment.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'biographyComment/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            biographyComment.busyIndicator.isActive = false;
            biographyComment.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulebiography/biographyComment/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    biographyComment.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        biographyComment.busyIndicator.isActive = true;
        biographyComment.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'biographyComment/add', biographyComment.selectedItem, 'POST').success(function (response) {
            biographyComment.addRequested = false;
            biographyComment.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                biographyComment.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                biographyComment.ListItems.unshift(response.Item);
                biographyComment.gridOptions.fillData(biographyComment.ListItems);
                biographyComment.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyComment.busyIndicator.isActive = false;
            biographyComment.addRequested = false;
        });
    }


    biographyComment.openEditModal = function () {

        biographyComment.modalTitle = 'ویرایش';
        if (!biographyComment.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'biographyComment/GetOne', biographyComment.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            biographyComment.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulebiography/biographyComment/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    biographyComment.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        biographyComment.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'biographyComment/edit', biographyComment.selectedItem, 'PUT').success(function (response) {
            biographyComment.addRequested = true;
            rashaErManage.checkAction(response);
            biographyComment.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                biographyComment.addRequested = false;
                biographyComment.replaceItem(biographyComment.selectedItem.Id, response.Item);
                biographyComment.gridOptions.fillData(biographyComment.ListItems);
                biographyComment.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyComment.addRequested = false;
        });
    }


    biographyComment.closeModal = function () {
        $modalStack.dismissAll();
    };

    biographyComment.replaceItem = function (oldId, newItem) {
        angular.forEach(biographyComment.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = biographyComment.ListItems.indexOf(item);
                biographyComment.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            biographyComment.ListItems.unshift(newItem);
    }

    biographyComment.deleteRow = function () {
        if (!biographyComment.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                biographyComment.busyIndicator.isActive = true;
                console.log(biographyComment.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'biographyComment/GetOne', biographyComment.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    //rashaErManage.checkAction(response);
                    biographyComment.selectedItemForDelete = response.Item;
                    console.log(biographyComment.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'biographyComment/delete', biographyComment.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        biographyComment.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            biographyComment.replaceItem(biographyComment.selectedItemForDelete.Id);
                            biographyComment.gridOptions.fillData(biographyComment.ListItems);
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

    biographyComment.searchData = function () {
        biographyComment.gridOptions.serachData();
    }
    biographyComment.LinkbiographyContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkbiographyContentId',
        url: 'biographyContent',
        sortColumn: 'Id',
        sortType: 1,
        filterText: 'Id',
        rowPerPage: 200,
        scope: biographyComment,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'},
                { name: 'RegisterDate', displayName: 'تاریخ ثبت', sortable: true, type: 'date'}
            ]
        }
    }
   

    biographyComment.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Writer', displayName: 'نام نویسنده', sortable: true, type: "string" },
            { name: 'Comment', displayName: 'کامنت', sortable: true, type: "string" },
            { name: 'virtual_BiographyContent.Title', displayName: 'عنوان زندگینامه', sortable: true, type: 'string', visible: true },
            { name: 'LinkbiographyContentId', displayName: 'کد سیستمی زندگینامه', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    biographyComment.gridOptions.advancedSearchData = {};
    biographyComment.gridOptions.advancedSearchData.engine = {};
    biographyComment.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    biographyComment.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    biographyComment.gridOptions.advancedSearchData.engine.SortType = 1;
    biographyComment.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    biographyComment.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    biographyComment.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    biographyComment.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    biographyComment.gridOptions.advancedSearchData.engine.Filters = [];

    biographyComment.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            biographyComment.focusExpireLockAccount = true;
        });
    };

    biographyComment.gridOptions.reGetAll = function () {
        biographyComment.init();
    }

    biographyComment.columnCheckbox = false;
    biographyComment.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (biographyComment.gridOptions.columnCheckbox) {
            for (var i = 0; i < biographyComment.gridOptions.columns.length; i++) {
                //biographyComment.gridOptions.columns[i].visible = $("#" + biographyComment.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + biographyComment.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                biographyComment.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = biographyComment.gridOptions.columns;
            for (var i = 0; i < biographyComment.gridOptions.columns.length; i++) {
                biographyComment.gridOptions.columns[i].visible = true;
                var element = $("#" + biographyComment.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + biographyComment.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < biographyComment.gridOptions.columns.length; i++) {
            console.log(biographyComment.gridOptions.columns[i].name.concat(".visible: "), biographyComment.gridOptions.columns[i].visible);
        }
        biographyComment.gridOptions.columnCheckbox = !biographyComment.gridOptions.columnCheckbox;
    }
    //Export Report 
    biographyComment.exportFile = function () {
        biographyComment.gridOptions.advancedSearchData.engine.ExportFile = biographyComment.ExportFileClass;
        biographyComment.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'biographyComment/exportfile', biographyComment.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            biographyComment.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                biographyComment.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //biographyComment.closeModal();
            }
            biographyComment.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    biographyComment.toggleExportForm = function () {
        biographyComment.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        biographyComment.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        biographyComment.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        biographyComment.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        biographyComment.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleBiography/biographyComment/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    biographyComment.rowCountChanged = function () {
        if (!angular.isDefined(biographyComment.ExportFileClass.RowCount) || biographyComment.ExportFileClass.RowCount > 5000)
            biographyComment.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    biographyComment.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"biographyComment/count", biographyComment.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            biographyComment.addRequested = false;
            rashaErManage.checkAction(response);
            biographyComment.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            biographyComment.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);