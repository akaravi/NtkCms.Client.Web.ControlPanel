app.controller("mvGalleryContentTagCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var mvGalleryContentTag = this;
    mvGalleryContentTag.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    mvGalleryContentTag.init = function () {
        mvGalleryContentTag.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"MovieGalleryContentTag/getall", mvGalleryContentTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            mvGalleryContentTag.busyIndicator.isActive = false;

            mvGalleryContentTag.ListItems = response.ListItems;
            mvGalleryContentTag.gridOptions.fillData(mvGalleryContentTag.ListItems , response.resultAccess);
            mvGalleryContentTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            mvGalleryContentTag.gridOptions.totalRowCount = response.TotalRowCount;
            mvGalleryContentTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            mvGalleryContentTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    mvGalleryContentTag.addRequested = false;
    mvGalleryContentTag.openAddModal = function () {
        mvGalleryContentTag.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryContentTag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            mvGalleryContentTag.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMovieGallery/MovieGalleryContentTag/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    mvGalleryContentTag.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        mvGalleryContentTag.addRequested = true;
        mvGalleryContentTag.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryContentTag/add', mvGalleryContentTag.selectedItem , 'POST').success(function (response) {
            mvGalleryContentTag.addRequested = false;
            mvGalleryContentTag.busyIndicator.isActive = false;

            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                mvGalleryContentTag.ListItems.unshift(response.Item);
                mvGalleryContentTag.gridOptions.fillData(mvGalleryContentTag.ListItems);
                mvGalleryContentTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mvGalleryContentTag.busyIndicator.isActive = false;

            mvGalleryContentTag.addRequested = false;
        });
    }


    mvGalleryContentTag.openEditModal = function () {
        mvGalleryContentTag.modalTitle = 'ویرایش';
        if (!mvGalleryContentTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryContentTag/GetOne',  mvGalleryContentTag.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            mvGalleryContentTag.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMovieGallery/MovieGalleryContentTag/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    mvGalleryContentTag.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        mvGalleryContentTag.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryContentTag/edit',  mvGalleryContentTag.selectedItem , 'PUT').success(function (response) {
            mvGalleryContentTag.addRequested = true;
            rashaErManage.checkAction(response);
            mvGalleryContentTag.busyIndicator.isActive = false;

            if (response.IsSuccess) {
                mvGalleryContentTag.addRequested = false;
                mvGalleryContentTag.replaceItem(mvGalleryContentTag.selectedItem.Id, response.Item);
                mvGalleryContentTag.gridOptions.fillData(mvGalleryContentTag.ListItems);
                mvGalleryContentTag.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            mvGalleryContentTag.busyIndicator.isActive = false;

            mvGalleryContentTag.addRequested = false;
        });
    }


    mvGalleryContentTag.closeModal = function () {
        $modalStack.dismissAll();
    };

    mvGalleryContentTag.replaceItem = function (oldId, newItem) {
        angular.forEach(mvGalleryContentTag.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = mvGalleryContentTag.ListItems.indexOf(item);
                mvGalleryContentTag.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            mvGalleryContentTag.ListItems.unshift(newItem);
    }

    mvGalleryContentTag.deleteRow = function () {
        if (!mvGalleryContentTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                mvGalleryContentTag.busyIndicator.isActive = true;
                console.log(mvGalleryContentTag.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryContentTag/GetOne',  mvGalleryContentTag.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    mvGalleryContentTag.selectedItemForDelete = response.Item;
                    console.log(mvGalleryContentTag.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryContentTag/delete',  mvGalleryContentTag.selectedItemForDelete , 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        mvGalleryContentTag.busyIndicator.isActive = false;

                        if (res.IsSuccess) {
                            mvGalleryContentTag.replaceItem(mvGalleryContentTag.selectedItemForDelete.Id);
                            mvGalleryContentTag.gridOptions.fillData(mvGalleryContentTag.ListItems);
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

    mvGalleryContentTag.searchData = function () {
        mvGalleryContentTag.gridOptions.serachData();
    }

    mvGalleryContentTag.LinkContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkContentId',
        url: 'NewsContent',
        scope: mvGalleryContentTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }


    mvGalleryContentTag.LinkTagIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkTagId',
        url: 'NewsTag',
        scope: mvGalleryContentTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    mvGalleryContentTag.gridOptions = {
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

    mvGalleryContentTag.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            mvGalleryContentTag.focusExpireLockAccount = true;
        });
    };



    mvGalleryContentTag.gridOptions.reGetAll = function () {
        mvGalleryContentTag.init();
    }

    //Export Report 
    mvGalleryContentTag.exportFile = function () {
        mvGalleryContentTag.addRequested = true;
        mvGalleryContentTag.gridOptions.advancedSearchData.engine.ExportFile = mvGalleryContentTag.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'MovieGalleryContentTag/exportfile', mvGalleryContentTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            mvGalleryContentTag.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                mvGalleryContentTag.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //mvGalleryContentTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    mvGalleryContentTag.toggleExportForm = function () {
        mvGalleryContentTag.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        mvGalleryContentTag.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        mvGalleryContentTag.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        mvGalleryContentTag.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        mvGalleryContentTag.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleMovieGallery/MovieGalleryContentTag/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    mvGalleryContentTag.rowCountChanged = function () {
        if (!angular.isDefined(mvGalleryContentTag.ExportFileClass.RowCount) || mvGalleryContentTag.ExportFileClass.RowCount > 5000)
            mvGalleryContentTag.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    mvGalleryContentTag.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"MovieGalleryContentTag/count", mvGalleryContentTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            mvGalleryContentTag.addRequested = false;
            rashaErManage.checkAction(response);
            mvGalleryContentTag.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            mvGalleryContentTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);