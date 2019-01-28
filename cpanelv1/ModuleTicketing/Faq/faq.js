app.controller("faqController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var faq = this;

    faq.busyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }

    var date = moment().format();
    faq.startDate = {
        defaultDate: date
    }
    faq.endDate = {
        defaultDate: date
    }

    faq.summernoteOptions = {
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

    faq.init = function () {
        faq.busyIndicator.isActive = true;
        ajax.call(mainPathApi+"faq/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            faq.ListItems = response.ListItems;
            faq.gridOptions.fillData(response.ListItems, response.resultAccess);
            faq.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
            faq.busyIndicator.isActive = false;
        });
        ajax.call(mainPathApi+"tickettype/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            faq.ticketTypeListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(response);
            console.log(data);
        });
    }

    faq.openAddModal = function () {
        faq.modalTitle = "اضافه";
        ajax.call(mainPathApi+'faq/getviewmodel', "0", 'GET').success(function (response) {
            //rashaErManage.checkAction(response);
            console.log(response);
            faq.selectedItem = response.Item;
            faq.selectedItem.ActionDate = date;
            console.log(faq.TypeList);
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTicketing/Faq/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    faq.openEditmodal = function () {
        if (!faq.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        faq.modalTitle = 'ویرایش';
        ajax.call(mainPathApi+'faq/getviewmodel', faq.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            faq.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTicketing/Faq/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    faq.addNew = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        console.log((faq.selectedItem));
        faq.addRequested = true;
        ajax.call(mainPathApi+'faq/add', faq.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                faq.ListItems.unshift(response.Item);
                faq.gridOptions.fillData(faq.ListItems);
                faq.closeModal();
            }
            faq.addRequested = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
            rashaErManage.checkAction(data, errCode);
            faq.addRequested = false;
        });
    }

    faq.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        faq.addRequested = true;
        ajax.call(mainPathApi+'faq/edit', faq.selectedItem, 'PUT').success(function (response) {
            faq.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                faq.replaceItem(faq.selectedItem.Id, response.Item);
                faq.gridOptions.fillData(faq.ListItems);
                faq.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            faq.addRequested = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    faq.delete = function () {
        if (!faq.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(faq.gridOptions.selectedRow.item);
                ajax.call(mainPathApi+'faq/getviewmodel', faq.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    faq.selectedItemForDelete = response.Item;
                    console.log(faq.selectedItemForDelete);
                    ajax.call(mainPathApi+'faq/delete', faq.selectedItemForDelete, 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            faq.replaceItem(faq.selectedItemForDelete.Id);
                            faq.gridOptions.fillData(faq.ListItems);
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

    faq.replaceItem = function (oldId, newItem) {
        angular.forEach(faq.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = faq.ListItems.indexOf(item);
                faq.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            faq.ListItems.unshift(newItem);
    }

    faq.closeModal = function () {
        $modalStack.dismissAll();
    };

    faq.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Question', displayName: 'سوال', sortable: true },
            { name: 'Answer', displayName: 'پاسخ', sortable: true },
            { name: 'virtual_TicketType.Title', displayName: 'بخش', sortable: true, displayForce: true }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }
    faq.columnCheckbox = false;
    faq.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = faq.gridOptions.columns;
        if (faq.gridOptions.columnCheckbox) {
            for (var i = 0; i < faq.gridOptions.columns.length; i++) {
                //faq.gridOptions.columns[i].visible = $("#" + faq.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + faq.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                faq.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < faq.gridOptions.columns.length; i++) {
                var element = $("#" + faq.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + faq.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < faq.gridOptions.columns.length; i++) {
            console.log(faq.gridOptions.columns[i].name.concat(".visible: "), faq.gridOptions.columns[i].visible);
        }
        faq.gridOptions.columnCheckbox = !faq.gridOptions.columnCheckbox;
    }
    //Export Report 
    faq.exportFile = function () {
        faq.addRequested = true;
        faq.gridOptions.advancedSearchData.engine.ExportFile = faq.ExportFileClass;
        ajax.call(mainPathApi+'faq/exportfile', faq.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            faq.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                faq.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //faq.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    faq.toggleExportForm = function () {
        faq.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        faq.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        faq.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        faq.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        faq.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleTicketing/Faq/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    faq.rowCountChanged = function () {
        if (!angular.isDefined(faq.ExportFileClass.RowCount) || faq.ExportFileClass.RowCount > 5000)
            faq.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    faq.getCount = function () {
        ajax.call(mainPathApi+"faq/count", faq.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            faq.addRequested = false;
            rashaErManage.checkAction(response);
            faq.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            faq.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);