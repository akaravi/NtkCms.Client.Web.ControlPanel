app.controller("chartContentTagCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var chartContentTag = this;
    chartContentTag.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    chartContentTag.init = function () {
        chartContentTag.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ChartContentTag/getall", chartContentTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            chartContentTag.busyIndicator.isActive = false;

            chartContentTag.ListItems = response.ListItems;
            chartContentTag.gridOptions.fillData(chartContentTag.ListItems , response.resultAccess);
            chartContentTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            chartContentTag.gridOptions.totalRowCount = response.TotalRowCount;
            chartContentTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            chartContentTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    chartContentTag.addRequested = false;
    chartContentTag.openAddModal = function () {
        chartContentTag.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'ChartContentTag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            chartContentTag.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleChart/ChartContentTag/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    chartContentTag.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        chartContentTag.addRequested = true;
        chartContentTag.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+'ChartContentTag/add', chartContentTag.selectedItem , 'POST').success(function (response) {
            chartContentTag.addRequested = false;
            chartContentTag.busyIndicator.isActive = false;

            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                chartContentTag.ListItems.unshift(response.Item);
                chartContentTag.gridOptions.fillData(chartContentTag.ListItems);
                chartContentTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            chartContentTag.busyIndicator.isActive = false;

            chartContentTag.addRequested = false;
        });
    }


    chartContentTag.openEditModal = function () {
        chartContentTag.modalTitle = 'ویرایش';
        if (!chartContentTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'ChartContentTag/GetOne',  chartContentTag.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            chartContentTag.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleChart/ChartContentTag/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    chartContentTag.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        chartContentTag.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+'ChartContentTag/edit',  chartContentTag.selectedItem , 'PUT').success(function (response) {
            chartContentTag.addRequested = true;
            rashaErManage.checkAction(response);
            chartContentTag.busyIndicator.isActive = false;

            if (response.IsSuccess) {
                chartContentTag.addRequested = false;
                chartContentTag.replaceItem(chartContentTag.selectedItem.Id, response.Item);
                chartContentTag.gridOptions.fillData(chartContentTag.ListItems);
                chartContentTag.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            chartContentTag.busyIndicator.isActive = false;

            chartContentTag.addRequested = false;
        });
    }


    chartContentTag.closeModal = function () {
        $modalStack.dismissAll();
    };

    chartContentTag.replaceItem = function (oldId, newItem) {
        angular.forEach(chartContentTag.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = chartContentTag.ListItems.indexOf(item);
                chartContentTag.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            chartContentTag.ListItems.unshift(newItem);
    }

    chartContentTag.deleteRow = function () {
        if (!chartContentTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                chartContentTag.busyIndicator.isActive = true;
                console.log(chartContentTag.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'ChartContentTag/GetOne',  chartContentTag.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    chartContentTag.selectedItemForDelete = response.Item;
                    console.log(chartContentTag.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ChartContentTag/delete',  chartContentTag.selectedItemForDelete , 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        chartContentTag.busyIndicator.isActive = false;

                        if (res.IsSuccess) {
                            chartContentTag.replaceItem(chartContentTag.selectedItemForDelete.Id);
                            chartContentTag.gridOptions.fillData(chartContentTag.ListItems);
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

    chartContentTag.searchData = function () {
        chartContentTag.gridOptions.serachData();
    }

    chartContentTag.LinkContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkContentId',
        url: 'NewsContent',
        scope: chartContentTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }


    chartContentTag.LinkTagIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkTagId',
        url: 'NewsTag',
        scope: chartContentTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    chartContentTag.gridOptions = {
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

    chartContentTag.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            chartContentTag.focusExpireLockAccount = true;
        });
    };



    chartContentTag.gridOptions.reGetAll = function () {
        chartContentTag.init();
    }

    //Export Report 
    chartContentTag.exportFile = function () {
        chartContentTag.addRequested = true;
        chartContentTag.gridOptions.advancedSearchData.engine.ExportFile = chartContentTag.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'ChartContentTag/exportfile', chartContentTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            chartContentTag.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                chartContentTag.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //chartContentTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    chartContentTag.toggleExportForm = function () {
        chartContentTag.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        chartContentTag.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        chartContentTag.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        chartContentTag.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        chartContentTag.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleChart/ChartContentTag/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    chartContentTag.rowCountChanged = function () {
        if (!angular.isDefined(chartContentTag.ExportFileClass.RowCount) || chartContentTag.ExportFileClass.RowCount > 5000)
            chartContentTag.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    chartContentTag.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ChartContentTag/count", chartContentTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            chartContentTag.addRequested = false;
            rashaErManage.checkAction(response);
            chartContentTag.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            chartContentTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);