app.controller("chartCommentCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var chartComment = this;
    chartComment.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    chartComment.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "chartCommentCtrl") {
            localStorage.setItem('AddRequest', '');
            chartComment.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    if (itemRecordStatus != undefined) chartComment.itemRecordStatus = itemRecordStatus;

    chartComment.init = function () {
        chartComment.busyIndicator.isActive = true;

        //var engine = {};
        //try {
        //    engine = chartComment.gridOptions.advancedSearchData.engine;
        //} catch (error) {
        //    console.log(error)
        //}

        ajax.call(cmsServerConfig.configApiServerPath+"chartComment/getall", chartComment.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            chartComment.busyIndicator.isActive = false;
            chartComment.ListItems = response.ListItems;
            chartComment.gridOptions.fillData(chartComment.ListItems, response.resultAccess);
            chartComment.gridOptions.currentPageNumber = response.CurrentPageNumber;
            chartComment.gridOptions.totalRowCount = response.TotalRowCount;
            chartComment.gridOptions.rowPerPage = response.RowPerPage;
            chartComment.gridOptions.maxSize = 5;
            chartComment.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            chartComment.busyIndicator.isActive = false;
            chartComment.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //chartComment.busyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+'chartComment/getall', {}, 'POST').success(function (response) {
        //    chartComment.CommentList = response.ListItems;
        //    chartComment.busyIndicator.isActive = false;
        //});

        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        chartComment.checkRequestAddNewItemFromOtherControl(null);
    }

    chartComment.busyIndicator.isActive = true;
    chartComment.addRequested = false;
    chartComment.openAddModal = function () {
        chartComment.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'chartComment/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            chartComment.busyIndicator.isActive = false;
            chartComment.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleChart/ChartComment/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    chartComment.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (!chartComment.selectedItem.LinkChartContentId) {
            rashaErManage.showMessage("لطفا خبر را مشخص کنید");
            return;
        }
        chartComment.busyIndicator.isActive = true;
        chartComment.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'chartComment/add', chartComment.selectedItem, 'POST').success(function (response) {
            chartComment.addRequested = false;
            chartComment.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                chartComment.checkRequestAddNewItemFromOtherControl(response.Item.Id);

                chartComment.ListItems.unshift(response.Item);
                chartComment.gridOptions.fillData(chartComment.ListItems);
                chartComment.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            chartComment.busyIndicator.isActive = false;
            chartComment.addRequested = false;
        });
    }

    chartComment.openEditModal = function () {

        chartComment.modalTitle = 'ویرایش';
        if (!chartComment.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'chartComment/GetOne', chartComment.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            chartComment.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleChart/ChartComment/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    chartComment.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        chartComment.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'chartComment/edit', chartComment.selectedItem, 'PUT').success(function (response) {
            chartComment.addRequested = true;
            rashaErManage.checkAction(response);
            chartComment.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                chartComment.addRequested = false;
                chartComment.replaceItem(chartComment.selectedItem.Id, response.Item);
                chartComment.gridOptions.fillData(chartComment.ListItems);
                chartComment.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            chartComment.addRequested = false;
        });
    }

    chartComment.closeModal = function () {
        $modalStack.dismissAll();
    };

    chartComment.replaceItem = function (oldId, newItem) {
        angular.forEach(chartComment.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = chartComment.ListItems.indexOf(item);
                chartComment.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            chartComment.ListItems.unshift(newItem);
    }

    chartComment.deleteRow = function () {
        if (!chartComment.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                chartComment.busyIndicator.isActive = true;
                console.log(chartComment.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'chartComment/GetOne', chartComment.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    chartComment.selectedItemForDelete = response.Item;
                    console.log(chartComment.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'chartComment/delete', chartComment.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        chartComment.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            chartComment.replaceItem(chartComment.selectedItemForDelete.Id);
                            chartComment.gridOptions.fillData(chartComment.ListItems);
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

    chartComment.searchData = function () {
        chartComment.gridOptions.searchData();

    }

    chartComment.LinkChartContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkChartContentId',
        filterText: 'ChartContent',
        url: 'ChartContent',
        scope: chartComment,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    chartComment.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Writer', displayName: 'نام نویسنده', sortable: true, type: "string" },
            { name: 'Comment', displayName: 'کامنت', sortable: true, type: "string" },
            { name: 'virtual_ChartContent.Title', displayName: 'عنوان چارت', sortable: true, type: 'string', visible: true },
            { name: 'LinkChartContentId', displayName: 'کد سیستمی چارت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },

        ],
        data: {},
        multiSelect: false,
        startDate: moment().format(),
        advancedSearchData: {
            engine: {}
        }
    }

    chartComment.gridOptions.advancedSearchData = {};
    chartComment.gridOptions.advancedSearchData.engine = {};
    chartComment.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    chartComment.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    chartComment.gridOptions.advancedSearchData.engine.SortType = 1;
    chartComment.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    chartComment.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    chartComment.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    chartComment.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    chartComment.gridOptions.advancedSearchData.engine.Filters = [];

    chartComment.test = 'false';

    chartComment.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            chartComment.focusExpireLockAccount = true;
        });
    };

    chartComment.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            chartComment.focus = true;
        });
    };

    chartComment.gridOptions.reGetAll = function () {
        chartComment.init();
    }

    chartComment.gridOptions.onRowSelected = function () {

    }

    chartComment.columnCheckbox = false;
    chartComment.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (chartComment.gridOptions.columnCheckbox) {
            for (var i = 0; i < chartComment.gridOptions.columns.length; i++) {
                //chartComment.gridOptions.columns[i].visible = $("#" + chartComment.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + chartComment.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                chartComment.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = chartComment.gridOptions.columns;
            for (var i = 0; i < chartComment.gridOptions.columns.length; i++) {
                chartComment.gridOptions.columns[i].visible = true;
                var element = $("#" + chartComment.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + chartComment.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < chartComment.gridOptions.columns.length; i++) {
            console.log(chartComment.gridOptions.columns[i].name.concat(".visible: "), chartComment.gridOptions.columns[i].visible);
        }
        chartComment.gridOptions.columnCheckbox = !chartComment.gridOptions.columnCheckbox;
    }
    //Export Report 
    chartComment.exportFile = function () {
        chartComment.gridOptions.advancedSearchData.engine.ExportFile = chartComment.ExportFileClass;
        chartComment.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'chartComment/exportfile', chartComment.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            chartComment.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                chartComment.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //chartComment.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    chartComment.toggleExportForm = function () {
        chartComment.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        chartComment.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        chartComment.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        chartComment.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        chartComment.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleChart/ChartComment/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    chartComment.rowCountChanged = function () {
        if (!angular.isDefined(chartComment.ExportFileClass.RowCount) || chartComment.ExportFileClass.RowCount > 5000)
            chartComment.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    chartComment.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"chartComment/count", chartComment.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            chartComment.addRequested = false;
            rashaErManage.checkAction(response);
            chartComment.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            chartComment.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

