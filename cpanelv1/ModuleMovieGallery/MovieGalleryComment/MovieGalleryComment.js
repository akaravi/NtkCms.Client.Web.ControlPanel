app.controller("mvGalleryCommentCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var mvGalleryComment = this;
    mvGalleryComment.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    mvGalleryComment.ContentList = [];
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    mvGalleryComment.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "mvGalleryCommentCtrl") {
            localStorage.setItem('AddRequest', '');
            mvGalleryComment.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    mvGalleryComment.allowedSearch = [];
    if (itemRecordStatus != undefined) mvGalleryComment.itemRecordStatus = itemRecordStatus;
    mvGalleryComment.init = function () {
        mvGalleryComment.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = mvGalleryComment.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }

        ajax.call(cmsServerConfig.configApiServerPath+"MovieGalleryComment/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            mvGalleryComment.busyIndicator.isActive = false;
            mvGalleryComment.ListItems = response.ListItems;
            mvGalleryComment.gridOptions.fillData(mvGalleryComment.ListItems , response.resultAccess);
            mvGalleryComment.gridOptions.currentPageNumber = response.CurrentPageNumber;
            mvGalleryComment.gridOptions.totalRowCount = response.TotalRowCount;
            mvGalleryComment.gridOptions.rowPerPage = response.RowPerPage;
            mvGalleryComment.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            mvGalleryComment.busyIndicator.isActive = false;
            mvGalleryComment.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //mvGalleryComment.busyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryComment/getall', {}, 'POST').success(function (response) {
        //    mvGalleryComment.ContentList = response.ListItems;
        //    mvGalleryComment.busyIndicator.isActive = false;
        //});
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        mvGalleryComment.checkRequestAddNewItemFromOtherControl(null);
    }
    mvGalleryComment.busyIndicator.isActive = true;
    mvGalleryComment.addRequested = false;
    mvGalleryComment.openAddModal = function () {
        mvGalleryComment.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryComment/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            mvGalleryComment.busyIndicator.isActive = false;
            mvGalleryComment.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMovieGallery/MovieGalleryComment/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    mvGalleryComment.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        mvGalleryComment.busyIndicator.isActive = true;
        mvGalleryComment.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryComment/add', mvGalleryComment.selectedItem, 'POST').success(function (response) {
            mvGalleryComment.addRequested = false;
            mvGalleryComment.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                mvGalleryComment.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                mvGalleryComment.ListItems.unshift(response.Item);
                mvGalleryComment.gridOptions.fillData(mvGalleryComment.ListItems);
                mvGalleryComment.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mvGalleryComment.busyIndicator.isActive = false;
            mvGalleryComment.addRequested = false;
        });
    }


    mvGalleryComment.openEditModal = function () {

        mvGalleryComment.modalTitle = 'ویرایش';
        if (!mvGalleryComment.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryComment/GetOne', mvGalleryComment.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            mvGalleryComment.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMovieGallery/MovieGalleryComment/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    mvGalleryComment.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        mvGalleryComment.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryComment/edit', mvGalleryComment.selectedItem, 'PUT').success(function (response) {
            mvGalleryComment.addRequested = true;
            rashaErManage.checkAction(response);
            mvGalleryComment.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                mvGalleryComment.addRequested = false;
                mvGalleryComment.replaceItem(mvGalleryComment.selectedItem.Id, response.Item);
                mvGalleryComment.gridOptions.fillData(mvGalleryComment.ListItems);
                mvGalleryComment.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mvGalleryComment.addRequested = false;
        });
    }


    mvGalleryComment.closeModal = function () {
        $modalStack.dismissAll();
    };

    mvGalleryComment.replaceItem = function (oldId, newItem) {
        angular.forEach(mvGalleryComment.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = mvGalleryComment.ListItems.indexOf(item);
                mvGalleryComment.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            mvGalleryComment.ListItems.unshift(newItem);
    }

    mvGalleryComment.deleteRow = function () {
        if (!mvGalleryComment.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                mvGalleryComment.busyIndicator.isActive = true;
                console.log(mvGalleryComment.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryComment/GetOne', mvGalleryComment.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    //rashaErManage.checkAction(response);
                    mvGalleryComment.selectedItemForDelete = response.Item;
                    console.log(mvGalleryComment.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryComment/delete', mvGalleryComment.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        mvGalleryComment.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            mvGalleryComment.replaceItem(mvGalleryComment.selectedItemForDelete.Id);
                            mvGalleryComment.gridOptions.fillData(mvGalleryComment.ListItems);
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
 
    mvGalleryComment.searchData = function () {
        mvGalleryComment.gridOptions.serachData();
    }
    mvGalleryComment.LinkMovieGalleryContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkMovieGalleryContentId',
        url: 'MovieGalleryContent',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: mvGalleryComment,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
                { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'},
                { name: 'RegisterDate', displayName: 'تاریخ ثبت', sortable: true, type: 'date'}
            ]
        }
    }
   

    mvGalleryComment.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Writer', displayName: 'نام نویسنده', sortable: true, type: "string" },
            { name: 'Comment', displayName: 'کامنت', sortable: true, type: "string" },
            { name: 'MovieGalleryContent.Title', displayName: 'عنوان موسیقی', sortable: true, type: 'string', visible: true },
            { name: 'LinkMovieGalleryContentId', displayName: 'کد سیستمی موسیقی', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    mvGalleryComment.gridOptions.advancedSearchData = {};
    mvGalleryComment.gridOptions.advancedSearchData.engine = {};
    mvGalleryComment.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    mvGalleryComment.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    mvGalleryComment.gridOptions.advancedSearchData.engine.SortType = 1;
    mvGalleryComment.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    mvGalleryComment.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    mvGalleryComment.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    mvGalleryComment.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    mvGalleryComment.gridOptions.advancedSearchData.engine.Filters = [];

    mvGalleryComment.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            mvGalleryComment.focusExpireLockAccount = true;
        });
    };

    mvGalleryComment.gridOptions.reGetAll = function () {
        mvGalleryComment.init();
    }

    mvGalleryComment.columnCheckbox = false;
    mvGalleryComment.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (mvGalleryComment.gridOptions.columnCheckbox) {
            for (var i = 0; i < mvGalleryComment.gridOptions.columns.length; i++) {
                //mvGalleryComment.gridOptions.columns[i].visible = $("#" + mvGalleryComment.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + mvGalleryComment.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                mvGalleryComment.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = mvGalleryComment.gridOptions.columns;
            for (var i = 0; i < mvGalleryComment.gridOptions.columns.length; i++) {
                mvGalleryComment.gridOptions.columns[i].visible = true;
                var element = $("#" + mvGalleryComment.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + mvGalleryComment.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < mvGalleryComment.gridOptions.columns.length; i++) {
            console.log(mvGalleryComment.gridOptions.columns[i].name.concat(".visible: "), mvGalleryComment.gridOptions.columns[i].visible);
        }
        mvGalleryComment.gridOptions.columnCheckbox = !mvGalleryComment.gridOptions.columnCheckbox;
    }
    //Export Report 
    mvGalleryComment.exportFile = function () {
        mvGalleryComment.gridOptions.advancedSearchData.engine.ExportFile = mvGalleryComment.ExportFileClass;
        mvGalleryComment.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryComment/exportfile', mvGalleryComment.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            mvGalleryComment.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                mvGalleryComment.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //mvGalleryComment.closeModal();
            }
            mvGalleryComment.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    mvGalleryComment.toggleExportForm = function () {
        mvGalleryComment.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        mvGalleryComment.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        mvGalleryComment.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        mvGalleryComment.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        mvGalleryComment.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleMovieGallery/MovieGalleryComment/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    mvGalleryComment.rowCountChanged = function () {
        if (!angular.isDefined(mvGalleryComment.ExportFileClass.RowCount) || mvGalleryComment.ExportFileClass.RowCount > 5000)
            mvGalleryComment.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    mvGalleryComment.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"MovieGalleryComment/count", mvGalleryComment.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            mvGalleryComment.addRequested = false;
            rashaErManage.checkAction(response);
            mvGalleryComment.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            mvGalleryComment.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);