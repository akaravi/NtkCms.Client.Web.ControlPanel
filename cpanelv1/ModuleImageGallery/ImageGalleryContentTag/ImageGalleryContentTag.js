app.controller("mscGalleryContentTagCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var mscGalleryContentTag = this;
    mscGalleryContentTag.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    mscGalleryContentTag.init = function () {
        mscGalleryContentTag.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"MusicGalleryContentTag/getall", mscGalleryContentTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            mscGalleryContentTag.busyIndicator.isActive = false;

            mscGalleryContentTag.ListItems = response.ListItems;
            mscGalleryContentTag.gridOptions.fillData(mscGalleryContentTag.ListItems , response.resultAccess);
            mscGalleryContentTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            mscGalleryContentTag.gridOptions.totalRowCount = response.TotalRowCount;
            mscGalleryContentTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            mscGalleryContentTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    mscGalleryContentTag.addRequested = false;
    mscGalleryContentTag.openAddModal = function () {
        mscGalleryContentTag.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryContentTag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            mscGalleryContentTag.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleImageGallery/ImageGalleryContentTag/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    mscGalleryContentTag.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        mscGalleryContentTag.addRequested = true;
        mscGalleryContentTag.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryContentTag/add', mscGalleryContentTag.selectedItem , 'POST').success(function (response) {
            mscGalleryContentTag.addRequested = false;
            mscGalleryContentTag.busyIndicator.isActive = false;

            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                mscGalleryContentTag.ListItems.unshift(response.Item);
                mscGalleryContentTag.gridOptions.fillData(mscGalleryContentTag.ListItems);
                mscGalleryContentTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mscGalleryContentTag.busyIndicator.isActive = false;

            mscGalleryContentTag.addRequested = false;
        });
    }


    mscGalleryContentTag.openEditModal = function () {
        mscGalleryContentTag.modalTitle = 'ویرایش';
        if (!mscGalleryContentTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryContentTag/GetOne',  mscGalleryContentTag.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            mscGalleryContentTag.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleImageGallery/ImageGalleryContentTag/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    mscGalleryContentTag.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        mscGalleryContentTag.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryContentTag/edit',  mscGalleryContentTag.selectedItem , 'PUT').success(function (response) {
            mscGalleryContentTag.addRequested = true;
            rashaErManage.checkAction(response);
            mscGalleryContentTag.busyIndicator.isActive = false;

            if (response.IsSuccess) {
                mscGalleryContentTag.addRequested = false;
                mscGalleryContentTag.replaceItem(mscGalleryContentTag.selectedItem.Id, response.Item);
                mscGalleryContentTag.gridOptions.fillData(mscGalleryContentTag.ListItems);
                mscGalleryContentTag.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mscGalleryContentTag.busyIndicator.isActive = false;

            mscGalleryContentTag.addRequested = false;
        });
    }


    mscGalleryContentTag.closeModal = function () {
        $modalStack.dismissAll();
    };

    mscGalleryContentTag.replaceItem = function (oldId, newItem) {
        angular.forEach(mscGalleryContentTag.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = mscGalleryContentTag.ListItems.indexOf(item);
                mscGalleryContentTag.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            mscGalleryContentTag.ListItems.unshift(newItem);
    }

    mscGalleryContentTag.deleteRow = function () {
        if (!mscGalleryContentTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                mscGalleryContentTag.busyIndicator.isActive = true;
                console.log(mscGalleryContentTag.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryContentTag/GetOne',  mscGalleryContentTag.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    mscGalleryContentTag.selectedItemForDelete = response.Item;
                    console.log(mscGalleryContentTag.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryContentTag/delete',  mscGalleryContentTag.selectedItemForDelete , 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        mscGalleryContentTag.busyIndicator.isActive = false;

                        if (res.IsSuccess) {
                            mscGalleryContentTag.replaceItem(mscGalleryContentTag.selectedItemForDelete.Id);
                            mscGalleryContentTag.gridOptions.fillData(mscGalleryContentTag.ListItems);
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

    mscGalleryContentTag.searchData = function () {
        mscGalleryContentTag.gridOptions.serachData();
    }

    mscGalleryContentTag.LinkContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkContentId',
        url: 'NewsContent',
        scope: mscGalleryContentTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' }
            ]
        }
    }


    mscGalleryContentTag.LinkTagIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkTagId',
        url: 'NewsTag',
        scope: mscGalleryContentTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    mscGalleryContentTag.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
           { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Content.Title', displayName: 'انتخاب محتوا', sortable: true ,displayForce:true},
            { name: 'Tag.Title', displayName: 'انتخاب تگ', sortable: true, displayForce: true },

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    mscGalleryContentTag.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            mscGalleryContentTag.focusExpireLockAccount = true;
        });
    };



    mscGalleryContentTag.gridOptions.reGetAll = function () {
        mscGalleryContentTag.init();
    }

    //Export Report 
    mscGalleryContentTag.exportFile = function () {
        mscGalleryContentTag.addRequested = true;
        mscGalleryContentTag.gridOptions.advancedSearchData.engine.ExportFile = mscGalleryContentTag.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'MusicGalleryContentTag/exportfile', mscGalleryContentTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            mscGalleryContentTag.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                mscGalleryContentTag.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //mscGalleryContentTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    mscGalleryContentTag.toggleExportForm = function () {
        mscGalleryContentTag.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        mscGalleryContentTag.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        mscGalleryContentTag.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        mscGalleryContentTag.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        mscGalleryContentTag.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleImageGallery/ImageGalleryContentTag/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    mscGalleryContentTag.rowCountChanged = function () {
        if (!angular.isDefined(mscGalleryContentTag.ExportFileClass.RowCount) || mscGalleryContentTag.ExportFileClass.RowCount > 5000)
            mscGalleryContentTag.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    mscGalleryContentTag.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"MusicGalleryContentTag/count", mscGalleryContentTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            mscGalleryContentTag.addRequested = false;
            rashaErManage.checkAction(response);
            mscGalleryContentTag.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            mscGalleryContentTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);