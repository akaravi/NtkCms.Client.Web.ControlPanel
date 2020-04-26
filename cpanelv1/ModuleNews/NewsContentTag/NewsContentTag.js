app.controller("newsContentTagCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var newsContentTag = this;
    newsContentTag.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    newsContentTag.init = function () {
        newsContentTag.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"NewsContenttag/getall", newsContentTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            newsContentTag.busyIndicator.isActive = false;

            newsContentTag.ListItems = response.ListItems;
            newsContentTag.gridOptions.fillData(newsContentTag.ListItems , response.resultAccess);
            newsContentTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            newsContentTag.gridOptions.totalRowCount = response.TotalRowCount;
            newsContentTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            newsContentTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    newsContentTag.addRequested = false;
    newsContentTag.openAddModal = function () {
        newsContentTag.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'NewsContenttag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            newsContentTag.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleNews/newscontentTag/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    newsContentTag.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        newsContentTag.addRequested = true;
        newsContentTag.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+'NewsContenttag/add', newsContentTag.selectedItem , 'POST').success(function (response) {
            newsContentTag.addRequested = false;
            newsContentTag.busyIndicator.isActive = false;

            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                newsContentTag.ListItems.unshift(response.Item);
                newsContentTag.gridOptions.fillData(newsContentTag.ListItems);
                newsContentTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsContentTag.busyIndicator.isActive = false;

            newsContentTag.addRequested = false;
        });
    }


    newsContentTag.openEditModal = function () {
        newsContentTag.modalTitle = 'ویرایش';
        if (!newsContentTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'NewsContenttag/GetOne',  newsContentTag.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            newsContentTag.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleNews/newscontentTag/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    newsContentTag.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        newsContentTag.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+'NewsContenttag/edit',  newsContentTag.selectedItem , 'PUT').success(function (response) {
            newsContentTag.addRequested = true;
            rashaErManage.checkAction(response);
            newsContentTag.busyIndicator.isActive = false;

            if (response.IsSuccess) {
                newsContentTag.addRequested = false;
                newsContentTag.replaceItem(newsContentTag.selectedItem.Id, response.Item);
                newsContentTag.gridOptions.fillData(newsContentTag.ListItems);
                newsContentTag.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsContentTag.busyIndicator.isActive = false;

            newsContentTag.addRequested = false;
        });
    }


    newsContentTag.closeModal = function () {
        $modalStack.dismissAll();
    };

    newsContentTag.replaceItem = function (oldId, newItem) {
        angular.forEach(newsContentTag.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = newsContentTag.ListItems.indexOf(item);
                newsContentTag.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            newsContentTag.ListItems.unshift(newItem);
    }

    newsContentTag.deleteRow = function () {
        if (!newsContentTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                newsContentTag.busyIndicator.isActive = true;
                console.log(newsContentTag.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'NewsContenttag/GetOne',  newsContentTag.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    newsContentTag.selectedItemForDelete = response.Item;
                    console.log(newsContentTag.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'NewsContenttag/delete',  newsContentTag.selectedItemForDelete , 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        newsContentTag.busyIndicator.isActive = false;

                        if (res.IsSuccess) {
                            newsContentTag.replaceItem(newsContentTag.selectedItemForDelete.Id);
                            newsContentTag.gridOptions.fillData(newsContentTag.ListItems);
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

    newsContentTag.searchData = function () {
        newsContentTag.gridOptions.serachData();
    }

    newsContentTag.LinkContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkContentId',
        url: 'NewsContent',
        scope: newsContentTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }


    newsContentTag.LinkTagIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkTagId',
        url: 'NewsTag',
        scope: newsContentTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    newsContentTag.gridOptions = {
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

    newsContentTag.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            newsContentTag.focusExpireLockAccount = true;
        });
    };



    newsContentTag.gridOptions.reGetAll = function () {
        newsContentTag.init();
    }

    //Export Report 
    newsContentTag.exportFile = function () {
        newsContentTag.addRequested = true;
        newsContentTag.gridOptions.advancedSearchData.engine.ExportFile = newsContentTag.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'newsContentTag/exportfile', newsContentTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            newsContentTag.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                newsContentTag.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //newsContentTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    newsContentTag.toggleExportForm = function () {
        newsContentTag.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        newsContentTag.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        newsContentTag.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        newsContentTag.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        newsContentTag.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleNews/newsContentTag/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    newsContentTag.rowCountChanged = function () {
        if (!angular.isDefined(newsContentTag.ExportFileClass.RowCount) || newsContentTag.ExportFileClass.RowCount > 5000)
            newsContentTag.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    newsContentTag.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"newsContentTag/count", newsContentTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            newsContentTag.addRequested = false;
            rashaErManage.checkAction(response);
            newsContentTag.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            newsContentTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);