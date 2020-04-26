app.controller("mscGalleryCommentCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var mscGalleryComment = this;
    mscGalleryComment.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    mscGalleryComment.ContentList = [];
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    mscGalleryComment.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "mscGalleryCommentCtrl") {
            localStorage.setItem('AddRequest', '');
            mscGalleryComment.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    mscGalleryComment.allowedSearch = [];
    if (itemRecordStatus != undefined) mscGalleryComment.itemRecordStatus = itemRecordStatus;
    mscGalleryComment.init = function () {
        mscGalleryComment.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = mscGalleryComment.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }

        ajax.call(cmsServerConfig.configApiServerPath+"MusicGalleryComment/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            mscGalleryComment.busyIndicator.isActive = false;
            mscGalleryComment.ListItems = response.ListItems;
            mscGalleryComment.gridOptions.fillData(mscGalleryComment.ListItems , response.resultAccess);
            mscGalleryComment.gridOptions.currentPageNumber = response.CurrentPageNumber;
            mscGalleryComment.gridOptions.totalRowCount = response.TotalRowCount;
            mscGalleryComment.gridOptions.rowPerPage = response.RowPerPage;
            mscGalleryComment.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            mscGalleryComment.busyIndicator.isActive = false;
            mscGalleryComment.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //MusicGalleryComment.busyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryComment/getall', {}, 'POST').success(function (response) {
        //    mscGalleryComment.ContentList = response.ListItems;
        //    mscGalleryComment.busyIndicator.isActive = false;
        //});
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        mscGalleryComment.checkRequestAddNewItemFromOtherControl(null);
    }
    mscGalleryComment.busyIndicator.isActive = true;
    mscGalleryComment.addRequested = false;
    mscGalleryComment.openAddModal = function () {
        mscGalleryComment.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryComment/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            mscGalleryComment.busyIndicator.isActive = false;
            mscGalleryComment.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMusicGallery/MusicGalleryComment/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    mscGalleryComment.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        mscGalleryComment.busyIndicator.isActive = true;
        mscGalleryComment.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryComment/add', mscGalleryComment.selectedItem, 'POST').success(function (response) {
            mscGalleryComment.addRequested = false;
            mscGalleryComment.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                mscGalleryComment.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                mscGalleryComment.ListItems.unshift(response.Item);
                mscGalleryComment.gridOptions.fillData(mscGalleryComment.ListItems);
                mscGalleryComment.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mscGalleryComment.busyIndicator.isActive = false;
            mscGalleryComment.addRequested = false;
        });
    }


    mscGalleryComment.openEditModal = function () {

        mscGalleryComment.modalTitle = 'ویرایش';
        if (!mscGalleryComment.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryComment/GetOne', mscGalleryComment.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            mscGalleryComment.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMusicGallery/MusicGalleryComment/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    mscGalleryComment.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        mscGalleryComment.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryComment/edit', mscGalleryComment.selectedItem, 'PUT').success(function (response) {
            mscGalleryComment.addRequested = true;
            rashaErManage.checkAction(response);
            mscGalleryComment.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                mscGalleryComment.addRequested = false;
                mscGalleryComment.replaceItem(mscGalleryComment.selectedItem.Id, response.Item);
                mscGalleryComment.gridOptions.fillData(mscGalleryComment.ListItems);
                mscGalleryComment.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mscGalleryComment.addRequested = false;
        });
    }


    mscGalleryComment.closeModal = function () {
        $modalStack.dismissAll();
    };

    mscGalleryComment.replaceItem = function (oldId, newItem) {
        angular.forEach(mscGalleryComment.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = mscGalleryComment.ListItems.indexOf(item);
                mscGalleryComment.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            mscGalleryComment.ListItems.unshift(newItem);
    }

    mscGalleryComment.deleteRow = function () {
        if (!mscGalleryComment.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                mscGalleryComment.busyIndicator.isActive = true;
                console.log(mscGalleryComment.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryComment/GetOne', mscGalleryComment.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    //rashaErManage.checkAction(response);
                    mscGalleryComment.selectedItemForDelete = response.Item;
                    console.log(mscGalleryComment.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryComment/delete', mscGalleryComment.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        mscGalleryComment.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            mscGalleryComment.replaceItem(mscGalleryComment.selectedItemForDelete.Id);
                            mscGalleryComment.gridOptions.fillData(mscGalleryComment.ListItems);
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

    mscGalleryComment.searchData = function () {
        mscGalleryComment.gridOptions.serachData();
    }
    mscGalleryComment.LinkMusicGalleryContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkMusicGalleryContentId',
        url: 'MusicGalleryContent',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: mscGalleryComment,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'},
                { name: 'RegisterDate', displayName: 'تاریخ ثبت', sortable: true, type: 'date'}
            ]
        }
    }
   

    mscGalleryComment.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Writer', displayName: 'نام نویسنده', sortable: true, type: "string" },
            { name: 'Comment', displayName: 'کامنت', sortable: true, type: "string" },
            { name: 'virtual_MusicGalleryContent.Title', displayName: 'عنوان موسیقی', sortable: true, type: 'string', visible: true },
            { name: 'LinkMusicGalleryContentId', displayName: 'کد سیستمی موسیقی', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    mscGalleryComment.gridOptions.advancedSearchData = {};
    mscGalleryComment.gridOptions.advancedSearchData.engine = {};
    mscGalleryComment.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    mscGalleryComment.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    mscGalleryComment.gridOptions.advancedSearchData.engine.SortType = 1;
    mscGalleryComment.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    mscGalleryComment.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    mscGalleryComment.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    mscGalleryComment.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    mscGalleryComment.gridOptions.advancedSearchData.engine.Filters = [];

    mscGalleryComment.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            mscGalleryComment.focusExpireLockAccount = true;
        });
    };

    mscGalleryComment.gridOptions.reGetAll = function () {
        mscGalleryComment.init();
    }

    mscGalleryComment.columnCheckbox = false;
    mscGalleryComment.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (mscGalleryComment.gridOptions.columnCheckbox) {
            for (var i = 0; i < mscGalleryComment.gridOptions.columns.length; i++) {
                //MusicGalleryComment.gridOptions.columns[i].visible = $("#" + mscGalleryComment.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + mscGalleryComment.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                mscGalleryComment.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = mscGalleryComment.gridOptions.columns;
            for (var i = 0; i < mscGalleryComment.gridOptions.columns.length; i++) {
                mscGalleryComment.gridOptions.columns[i].visible = true;
                var element = $("#" + mscGalleryComment.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + mscGalleryComment.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < mscGalleryComment.gridOptions.columns.length; i++) {
            console.log(mscGalleryComment.gridOptions.columns[i].name.concat(".visible: "), mscGalleryComment.gridOptions.columns[i].visible);
        }
        mscGalleryComment.gridOptions.columnCheckbox = !mscGalleryComment.gridOptions.columnCheckbox;
    }
    //Export Report 
    mscGalleryComment.exportFile = function () {
        mscGalleryComment.gridOptions.advancedSearchData.engine.ExportFile = mscGalleryComment.ExportFileClass;
        mscGalleryComment.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryComment/exportfile', mscGalleryComment.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            mscGalleryComment.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                mscGalleryComment.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //MusicGalleryComment.closeModal();
            }
            mscGalleryComment.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    mscGalleryComment.toggleExportForm = function () {
        mscGalleryComment.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        mscGalleryComment.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        mscGalleryComment.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        mscGalleryComment.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        mscGalleryComment.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleMusicGallery/MusicGalleryComment/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    mscGalleryComment.rowCountChanged = function () {
        if (!angular.isDefined(mscGalleryComment.ExportFileClass.RowCount) || mscGalleryComment.ExportFileClass.RowCount > 5000)
            mscGalleryComment.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    mscGalleryComment.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"MusicGalleryComment/count", mscGalleryComment.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            mscGalleryComment.addRequested = false;
            rashaErManage.checkAction(response);
            mscGalleryComment.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            mscGalleryComment.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);