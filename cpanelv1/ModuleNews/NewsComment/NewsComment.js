app.controller("newsCommentCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var newsComment = this;
    newsComment.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    newsComment.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "newsCommentCtrl") {
            localStorage.setItem('AddRequest', '');
            newsComment.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    newsComment.ContentList = [];

    newsComment.allowedSearch = [];
    if (itemRecordStatus != undefined) newsComment.itemRecordStatus = itemRecordStatus;
    newsComment.init = function () {
        newsComment.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = newsComment.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }

        ajax.call(cmsServerConfig.configApiServerPath+"newsComment/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            newsComment.busyIndicator.isActive = false;
            newsComment.ListItems = response.ListItems;
            newsComment.gridOptions.fillData(newsComment.ListItems , response.resultAccess);
            newsComment.gridOptions.currentPageNumber = response.CurrentPageNumber;
            newsComment.gridOptions.totalRowCount = response.TotalRowCount;
            newsComment.gridOptions.rowPerPage = response.RowPerPage;
            newsComment.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            newsComment.busyIndicator.isActive = false;
            newsComment.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //newsComment.busyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+'NewsContent/getall', {}, 'POST').success(function (response) {
        //    newsComment.ContentList = response.ListItems;
        //    newsComment.busyIndicator.isActive = false;
        //});

        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        newsComment.checkRequestAddNewItemFromOtherControl(null);
    }
    newsComment.busyIndicator.isActive = true;
    newsComment.addRequested = false;
    newsComment.openAddModal = function () {
        newsComment.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'newsComment/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            newsComment.busyIndicator.isActive = false;
            newsComment.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleNews/NewsComment/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    newsComment.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        newsComment.busyIndicator.isActive = true;
        newsComment.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'newsComment/add', newsComment.selectedItem, 'POST').success(function (response) {
            newsComment.addRequested = false;
            newsComment.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                newsComment.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                newsComment.ListItems.unshift(response.Item);
                newsComment.gridOptions.fillData(newsComment.ListItems);
                newsComment.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsComment.busyIndicator.isActive = false;
            newsComment.addRequested = false;
        });
    }


    newsComment.openEditModal = function () {

        newsComment.modalTitle = 'ویرایش';
        if (!newsComment.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'newsComment/GetOne', newsComment.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            newsComment.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleNews/NewsComment/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    newsComment.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (newsComment.selectedItem.LinkContentId <= 0) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_content'));
            return;
        }
        newsComment.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'newsComment/edit', newsComment.selectedItem, 'PUT').success(function (response) {
            newsComment.addRequested = true;
            rashaErManage.checkAction(response);
            newsComment.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                newsComment.addRequested = false;
                newsComment.replaceItem(newsComment.selectedItem.Id, response.Item);
                newsComment.gridOptions.fillData(newsComment.ListItems);
                newsComment.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsComment.addRequested = false;
        });
    }


    newsComment.closeModal = function () {
        $modalStack.dismissAll();
    };

    newsComment.replaceItem = function (oldId, newItem) {
        angular.forEach(newsComment.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = newsComment.ListItems.indexOf(item);
                newsComment.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            newsComment.ListItems.unshift(newItem);
    }

    newsComment.deleteRow = function () {
        if (!newsComment.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                newsComment.busyIndicator.isActive = true;
                console.log(newsComment.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'newsComment/GetOne', newsComment.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    //rashaErManage.checkAction(response);
                    newsComment.selectedItemForDelete = response.Item;
                    console.log(newsComment.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'newsComment/delete', newsComment.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        newsComment.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            newsComment.replaceItem(newsComment.selectedItemForDelete.Id);
                            newsComment.gridOptions.fillData(newsComment.ListItems);
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

    newsComment.searchData = function () {
        newsComment.gridOptions.serachData();
    }

    newsComment.LinkContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkContentId',
        url: 'NewsContent',
        scope: newsComment,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: "string"},
                { name: 'RegisterDate', displayName: 'تاریخ ثبت', sortable: true, type: 'date'}
            ]
        }
    }

    newsComment.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Writer', displayName: 'نام نویسنده', sortable: true, type: "string" },
            { name: 'Comment', displayName: 'کامنت', sortable: true, type: "string" },
            { name: 'virtual_NewsContent.Title', displayName: 'عنوان نوشته', sortable: true, type: 'string', visible: true },
            { name: 'LinkContentId', displayName: 'کد سیستمی نوشته', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    newsComment.gridOptions.advancedSearchData = {};
    newsComment.gridOptions.advancedSearchData.engine = {};
    newsComment.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    newsComment.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    newsComment.gridOptions.advancedSearchData.engine.SortType = 1;
    newsComment.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    newsComment.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    newsComment.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    newsComment.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    newsComment.gridOptions.advancedSearchData.engine.Filters = [];

    newsComment.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            newsComment.focusExpireLockAccount = true;
        });
    };

    newsComment.gridOptions.reGetAll = function () {
        newsComment.init();
    }

    newsComment.columnCheckbox = false;
    newsComment.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (newsComment.gridOptions.columnCheckbox) {
            for (var i = 0; i < newsComment.gridOptions.columns.length; i++) {
                //newsComment.gridOptions.columns[i].visible = $("#" + newsComment.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + newsComment.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                newsComment.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = newsComment.gridOptions.columns;
            for (var i = 0; i < newsComment.gridOptions.columns.length; i++) {
                newsComment.gridOptions.columns[i].visible = true;
                var element = $("#" + newsComment.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + newsComment.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < newsComment.gridOptions.columns.length; i++) {
            console.log(newsComment.gridOptions.columns[i].name.concat(".visible: "), newsComment.gridOptions.columns[i].visible);
        }
        newsComment.gridOptions.columnCheckbox = !newsComment.gridOptions.columnCheckbox;
    }
    //Export Report 
    newsComment.exportFile = function () {
        newsComment.addRequested = true;
        newsComment.gridOptions.advancedSearchData.engine.ExportFile = newsComment.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'newsComment/exportfile', newsComment.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            newsComment.addRequested = false;
            rashaErManage.checkAction(response);
            newsComment.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //newsComment.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    newsComment.toggleExportForm = function () {
        newsComment.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        newsComment.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        newsComment.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        newsComment.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleNews/NewsComment/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    newsComment.rowCountChanged = function () {
        if (!angular.isDefined(newsComment.ExportFileClass.RowCount) || newsComment.ExportFileClass.RowCount > 5000)
            newsComment.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    newsComment.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"newsComment/count", newsComment.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            newsComment.addRequested = false;
            rashaErManage.checkAction(response);
            newsComment.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            newsComment.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);