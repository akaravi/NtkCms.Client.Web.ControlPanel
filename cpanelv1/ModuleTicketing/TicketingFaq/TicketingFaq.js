app.controller("ticketingFaqController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var ticketingFaq = this;

    ticketingFaq.busyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }

    var date = moment().format();
    ticketingFaq.startDate = {
        defaultDate: date
    }
    ticketingFaq.endDate = {
        defaultDate: date
    }

    ticketingFaq.summernoteOptions = {
        height: 300,
        focus: true,
        airMode: false,
        toolbar: [
                ['edit', ['undo', 'redo']],
                ['headline', ['style']],
                ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
                ['fontface', ['fontname']],
                ['textsize', ['fontsize']],
                ['fontclr', ['color']],
                ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
                ['height', ['height']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'video', 'hr']],
                ['view', ['fullscreen', 'codeview']],
                ['help', ['help']]
        ]
    };

    ticketingFaq.init = function () {
        ticketingFaq.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ticketingFaq/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            ticketingFaq.ListItems = response.ListItems;
            ticketingFaq.gridOptions.fillData(response.ListItems, response.resultAccess);
            ticketingFaq.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
            ticketingFaq.busyIndicator.isActive = false;
        });
        ajax.call(cmsServerConfig.configApiServerPath+"ticketingDepartemen/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            ticketingFaq.ticketTypeListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(response);
            console.log(data);
        });
    }

    ticketingFaq.openAddModal = function () {
        ticketingFaq.modalTitle = "اضافه";
        ajax.call(cmsServerConfig.configApiServerPath+'ticketingFaq/GetViewModel', "", 'GET').success(function (response) {
            ticketingFaq.selectedItem = response.Item;
            ticketingFaq.selectedItem.ActionDate = date;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTicketing/ticketingFaq/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    ticketingFaq.openEditmodal = function () {
        if (!ticketingFaq.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ticketingFaq.modalTitle = 'ویرایش';
        ajax.call(cmsServerConfig.configApiServerPath+'ticketingFaq/GetOne', ticketingFaq.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            ticketingFaq.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTicketing/ticketingFaq/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    ticketingFaq.addNew = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        ticketingFaq.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ticketingFaq/add', ticketingFaq.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);

            if (response.IsSuccess) {
                ticketingFaq.ListItems.unshift(response.Item);
                ticketingFaq.gridOptions.fillData(ticketingFaq.ListItems);
                ticketingFaq.closeModal();
            }
            ticketingFaq.addRequested = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
            rashaErManage.checkAction(data, errCode);
            ticketingFaq.addRequested = false;
        });
    }

    ticketingFaq.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        ticketingFaq.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ticketingFaq/edit', ticketingFaq.selectedItem, 'PUT').success(function (response) {
            ticketingFaq.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                ticketingFaq.replaceItem(ticketingFaq.selectedItem.Id, response.Item);
                ticketingFaq.gridOptions.fillData(ticketingFaq.ListItems);
                ticketingFaq.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            ticketingFaq.addRequested = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    ticketingFaq.delete = function () {
        if (!ticketingFaq.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                ajax.call(cmsServerConfig.configApiServerPath+'ticketingFaq/GetOne', ticketingFaq.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    ticketingFaq.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'ticketingFaq/delete', ticketingFaq.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            ticketingFaq.replaceItem(ticketingFaq.selectedItemForDelete.Id);
                            ticketingFaq.gridOptions.fillData(ticketingFaq.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });
    };

    ticketingFaq.replaceItem = function (oldId, newItem) {
        angular.forEach(ticketingFaq.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = ticketingFaq.ListItems.indexOf(item);
                ticketingFaq.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            ticketingFaq.ListItems.unshift(newItem);
    }

    ticketingFaq.closeModal = function () {
        $modalStack.dismissAll();
    };

    ticketingFaq.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Question', displayName: 'سوال', sortable: true },
          //  { name: 'Answer', displayName: 'پاسخ', sortable: true },
            { name: 'virtual_TicketingDepartemen.Title', displayName: 'بخش', sortable: true, displayForce: true }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }
    ticketingFaq.columnCheckbox = false;
    ticketingFaq.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = ticketingFaq.gridOptions.columns;
        if (ticketingFaq.gridOptions.columnCheckbox) {
            for (var i = 0; i < ticketingFaq.gridOptions.columns.length; i++) {
                //ticketingFaq.gridOptions.columns[i].visible = $("#" + ticketingFaq.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + ticketingFaq.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                ticketingFaq.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < ticketingFaq.gridOptions.columns.length; i++) {
                var element = $("#" + ticketingFaq.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + ticketingFaq.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < ticketingFaq.gridOptions.columns.length; i++) {
            console.log(ticketingFaq.gridOptions.columns[i].name.concat(".visible: "), ticketingFaq.gridOptions.columns[i].visible);
        }
        ticketingFaq.gridOptions.columnCheckbox = !ticketingFaq.gridOptions.columnCheckbox;
    }
    //Export Report 
    ticketingFaq.exportFile = function () {
        ticketingFaq.addRequested = true;
        ticketingFaq.gridOptions.advancedSearchData.engine.ExportFile = ticketingFaq.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'ticketingFaq/exportfile', ticketingFaq.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            ticketingFaq.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                ticketingFaq.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //ticketingFaq.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    ticketingFaq.toggleExportForm = function () {
        ticketingFaq.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        ticketingFaq.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        ticketingFaq.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        ticketingFaq.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        ticketingFaq.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleTicketing/Faq/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    ticketingFaq.rowCountChanged = function () {
        if (!angular.isDefined(ticketingFaq.ExportFileClass.RowCount) || ticketingFaq.ExportFileClass.RowCount > 5000)
            ticketingFaq.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    ticketingFaq.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ticketingFaq/count", ticketingFaq.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            ticketingFaq.addRequested = false;
            rashaErManage.checkAction(response);
            ticketingFaq.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            ticketingFaq.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);