app.controller("ticketTypeController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var ticketType = this;

    ticketType.busyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }

    var date = moment().format();
    ticketType.startDate = {
        defaultDate: date
    }
    ticketType.endDate = {
        defaultDate: date
    }

    ticketType.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان بخش', sortable: true, type: 'string', visible: true },
            { name: 'Priority', displayName: 'اولویت', sortable: true, type: 'integer', visible: true },
            //{ name: 'PriorityKey', displayName: 'اولویت', sortable: true, type: 'integer', visible: true,displayForce:true }
            //{ name: 'ActionButtons', displayName: 'اپراتورها', sortable: true, type: 'string', visible: true, displayForce: true, template: '<a type="button" ng-show="ticketType.gridOptions.resultAccess.AccessWatchRow" class="btn btn-primary" ng-click="ticketType.openOperatorModal(x.Id)"><i class="fa fa-user-plus" aria-hidden="true"></i>&nbsp;اپراتورها</a>' }
            //{ name: 'DefaultAnswerBody', displayName: 'جواب پیش فرض', sortable: true, type: 'string', visible: true }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    ticketType.summernoteOptions = {
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

    ticketType.init = function () {
        ticketType.busyIndicator.isActive = true;
        ajax.call(mainPathApi+"ticketType/getall", ticketType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            ticketType.ListItems = response.ListItems;
            ticketType.gridOptions.fillData(response.ListItems, response.resultAccess);
            ticketType.busyIndicator.isActive = false;
            if (!angular.isDefined(ticketType.priorityEnum))
                ajax.call(mainPathApi+"ticketType/GetPriorityEnum", {}, 'POST').success(function (response) {
                    ticketType.priorityEnum = response;
                    ticketType.filterPriorityEnum(ticketType.ListItems, ticketType.priorityEnum);
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }

    ticketType.filterPriorityEnum = function (arr, enu) {
        $.each(arr, function (i, item) {
            $.each(enu, function (j, prior) {
                if (item.Priority == prior.Value)
                    item.PriorityKey = prior.Description;
            });
        });
    }
    ticketType.openAddModal = function () {
        ticketType.modalTitle = 'اضافه';
        ajax.call(mainPathApi+'ticketType/getviewmodel', "0", 'GET').success(function (response) {
            //rashaErManage.checkAction(response);
            console.log(response);
            ticketType.selectedItem = response.Item;
            ticketType.selectedItem.ActionDate = date;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTicketing/TicketType/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    ticketType.openEditModal = function () {
        if (!ticketType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        ticketType.modalTitle = 'ویرایش';
        ajax.call(mainPathApi+'ticketType/getviewmodel', ticketType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            ticketType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTicketing/TicketType/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    ticketType.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        ticketType.selectedItem.LinkCmsPageId = 1;
        console.log((ticketType.selectedItem));
        ticketType.addRequested = true;
        ajax.call(mainPathApi+'ticketType/add', ticketType.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                ticketType.ListItems.unshift(response.Item);
                ticketType.gridOptions.fillData(ticketType.ListItems);
                ticketType.closeModal();
            }
            ticketType.addRequested = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
            rashaErManage.checkAction(data, errCode);
            ticketType.addRequested = false;
        });
    }

    ticketType.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        ticketType.addRequested = true;
        ajax.call(mainPathApi+'ticketType/edit', ticketType.selectedItem, 'PUT').success(function (response) {
            ticketType.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                ticketType.replaceItem(ticketType.selectedItem.Id, response.Item);
                ticketType.gridOptions.fillData(ticketType.ListItems);
                ticketType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            ticketType.addRequested = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    ticketType.delete = function () {
        if (!ticketType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(ticketType.gridOptions.selectedRow.item);
                ajax.call(mainPathApi+'ticketType/getviewmodel', ticketType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {

                    rashaErManage.checkAction(response);
                    ticketType.selectedItemForDelete = response.Item;
                    console.log(ticketType.selectedItemForDelete);
                    ajax.call(mainPathApi+'ticketType/delete', ticketType.selectedItemForDelete, 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            ticketType.replaceItem(ticketType.selectedItemForDelete.Id);
                            ticketType.gridOptions.fillData(ticketType.ListItems);
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

    ticketType.replaceItem = function (oldId, newItem) {
        angular.forEach(ticketType.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = ticketType.ListItems.indexOf(item);
                ticketType.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            ticketType.ListItems.unshift(newItem);
    }

    ticketType.closeModal = function () {
        $modalStack.dismissAll();
    }

    ticketType.gridOptions.reGetAll = function () {
        ticketType.init();
    }

    ticketType.gridOptions.onRowSelected = function () { }

    //Operators
    ticketType.operatorsList = [];

    ticketType.openOperatorModal = function () {
        if (!ticketType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک بخش جهت افزودن اپراتور انتخاب کنید");
            return;
        }
        var ticketTypeId = ticketType.gridOptions.selectedRow.item.Id;
        ajax.call(mainPathApi+'tickettypeoperator/getviewmodel', "0", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                ticketType.selectedItem = response.Item;
                ticketType.selectedItem.LinkTicketTypeId = ticketTypeId;
                $modal.open({
                    templateUrl: 'cpanelv1/ModuleTicketing/TicketType/addOperator.html',
                    scope: $scope
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
        var filterModel = { Filters: [{ PropertyName: 'LinkTicketTypeId', SearchType: 0, IntValue1: ticketTypeId }] };
        ajax.call(mainPathApi+'TicketTypeOperator/getAlloperator', filterModel, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                ticketType.operatorsList = response.ListItems;
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    ticketType.addMember = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        ticketType.addRequested = true;
        ajax.call(mainPathApi+'tickettypeoperator/add', ticketType.selectedItem, 'POST').success(function (response) {
            ticketType.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                ticketType.busyIndicator.isActive = false;
                ticketType.operatorsList.push(response.Item);
                //Clear inputs
                ticketType.selectedItem.Domain = "";
                ticketType.selectedItem.SubDomain = "";
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            ticketType.addRequested = false;
        });
    }

    ticketType.deleteMember = function (index) {
        ajax.call(mainPathApi+'tickettypeoprator/delete', ticketType.operatorsList[index], 'DELETE').success(function (res) {
            rashaErManage.checkAction(res);
            if (res.IsSuccess) {
                ticketType.operatorsList.splice(index, 1);
                rashaErManage.showMessage($filter('translate')('Removed_Successfully'));
            }
        }).error(function (data2, errCode2, c2, d2) {
            rashaErManage.checkAction(data2);
        });
    }

    ticketType.userSelected = function (selected) {
        if (selected) {
            ticketType.selectedItem.LinkUserId = selected.originalObject.Id;
        } else {
            ticketType.selectedItem.LinkUserId = null;
        }
    }
    //ngautocomplete
    ticketType.inputUserChanged = function (input) {
        var engine = { Filters: [] };
        engine.Filters.push({ PropertyName: "Name", SearchType: 5, StringValue1: input, ClauseType: 1 });
        engine.Filters.push({ PropertyName: "LastName", SearchType: 5, StringValue1: input, ClauseType: 1 });
        //engine.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: input });
        ajax.call(mainPathApi+"cmsuser/search", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            ticketType.cmsUsersListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Show Operators Grid
    ticketType.showOperators = function (item) {
        if (item) {
            //var id = ticketType.gridOptions.selectedRow.item.Id;
            ticketType.operatorsloadingBusyIndicator = true;
            var Filter_value = {
                PropertyName: "LinkTicketTypeId",
                IntValue1: item.Id,
                SearchType: 0
            }
            ticketType.gridContentOptions.advancedSearchData.engine.Filters = null;
            ticketType.gridContentOptions.advancedSearchData.engine.Filters = [];
            ticketType.gridContentOptions.advancedSearchData.engine.Filters.push(Filter_value);

            ajax.call(mainPathApi+'ticketTypeTypeOperator/getall', ticketType.gridContentOptions.advancedSearchData.engine, 'POST').success(function (response) {
                //ticketType.listOperators = response.ListItems;
                ticketType.TypeOperator.ListItems = response.ListItems;
                //ticketType.gridContentOptions.fillData(ticketType.listOperators);
                ticketType.gridContentOptions.fillData(ticketType.TypeOperator.ListItems);
                ticketType.gridContentOptions.currentPageNumber = response.CurrentPageNumber;
                ticketType.gridContentOptions.totalRowCount = response.TotalRowCount;
                ticketType.allowedSearch = response.AllowedSearchField;
                rashaErManage.checkAction(response);
                ticketType.gridContentOptions.RowPerPage = response.RowPerPage;
                ticketType.gridOptions.maxSize = 5;
                ticketType.operatorsloadingBusyIndicator = false;
                ticketType.showOperatorsGrid = true;
                ticketType.Title = ticketType.gridOptions.selectedRow.item.Title;
            }).error(function (data) {
                console.log(data);
                rashaErManage.checkAction(data, errCode);
            });;
        }
    }

    ticketType.columnCheckbox = false;

    ticketType.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (ticketType.gridOptions.columnCheckbox) {
            for (var i = 0; i < ticketType.gridOptions.columns.length; i++) {
                //ticketType.gridOptions.columns[i].visible = $("#" + ticketType.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + ticketType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                ticketType.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = ticketType.gridOptions.columns;
            for (var i = 0; i < ticketType.gridOptions.columns.length; i++) {
                ticketType.gridOptions.columns[i].visible = true;
                var element = $("#" + ticketType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + ticketType.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < ticketType.gridOptions.columns.length; i++) {
            console.log(ticketType.gridOptions.columns[i].name.concat(".visible: "), ticketType.gridOptions.columns[i].visible);
        }
        ticketType.gridOptions.columnCheckbox = !ticketType.gridOptions.columnCheckbox;
    }

    ticketType.addNewRowTypeOperatorModel = function () {
        if (!ticketType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک ردیف جهت افزودن اپراتور انتخاب کنید");
            return;
        }
        ajax.call(mainPathApi+'ticketTypeTypeOperator/getviewmodel', "0", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            console.log(response);
            ticketType.TypeOperator.selectedItem = response.Item;
            ticketType.TypeOperator.selectedItem.LinkTicketTypeId = ticketType.gridOptions.selectedRow.item.Id;
            //ticketType.selectedItem = response.Item;
            //ticketType.selectedItem.ActionDate = date;
            //console.log(Ticket.TypeListItems);
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTicketing/TicketTypeOperator/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
        ticketType.clearOperatorName();
        // ------------------------- Get users ----------------------------------
        ajax.call(mainPathApi+"CmsSiteUser/GetCurrentSiteUsers", "", 'POST').success(function (response) {
            ticketType.CmsUser.ListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        // ------------------------- End of Get Users -----------------------
    }

    ticketType.addNewRowTypeOperator = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        if (ticketType.isAlreadyExists(ticketType.TypeOperator.selectedItem.LinkUserId)) {
            rashaErManage.showMessage("این اپراتور در حال وجود دارد!");
            return;
        }
        console.log((ticketType.TypeOperator.selectedItem));
        ticketType.addRequested = true;
        ajax.call(mainPathApi+'ticketTypeTypeOperator/add', ticketType.TypeOperator.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                ticketType.TypeOperator.ListItems.unshift(response.Item);
                ticketType.gridContentOptions.fillData(ticketType.TypeOperator.ListItems);
                ticketType.closeModal();
            }
            ticketType.addRequested = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
            rashaErManage.checkAction(data, errCode);
            ticketType.addRequested = false;
        });
    }

    ticketType.deleteTypeOperatorModel = function (item) {
        ticketType.gridContentOptions.selectedRow.item = item;
        if (!ticketType.gridContentOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(ticketType.gridContentOptions.selectedRow.item);
                ajax.call(mainPathApi+'ticketTypeoperator/getviewmodel', ticketType.gridContentOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    ticketType.selectedItemForDelete = response.Item;
                    console.log(ticketType.selectedItemForDelete);
                    ajax.call(mainPathApi+'ticketTypeoperator/delete', ticketType.selectedItemForDelete, 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            ticketType.replaceItem(ticketType.selectedItemForDelete.Id);
                            //ticketType.gridContentOptions.fillData(ticketType.ListItems);
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

    ticketType.isAlreadyExists = function (operatorId) {
        for (i = 0; i < ticketType.TypeOperator.ListItems.length; i++) {
            if (ticketType.TypeOperator.ListItems[i].LinkUserId == operatorId) {
                return true;
            }
        }
        return false;
    }

    ticketType.clearOperatorName = function () {
        ticketType.Name = "_";
        ticketType.LastName = "";
    }

    ticketType.setName = function (operatorId) {
        for (var i = 0; i < ticketType.CmsUser.ListItems.length; i++) {
            if (ticketType.CmsUser.ListItems[i].User.Id == operatorId) {
                ticketType.Name = ticketType.CmsUser.ListItems[i].User.Name;
                ticketType.LastName = ticketType.CmsUser.ListItems[i].User.LastName;
            }
        }
    }
    ticketType.columnCheckbox = false;
    ticketType.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = ticketType.gridOptions.columns;
        if (ticketType.gridOptions.columnCheckbox) {
            for (var i = 0; i < ticketType.gridOptions.columns.length; i++) {
                //ticketType.gridOptions.columns[i].visible = $("#" + ticketType.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + ticketType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                ticketType.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < ticketType.gridOptions.columns.length; i++) {
                var element = $("#" + ticketType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + ticketType.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < ticketType.gridOptions.columns.length; i++) {
            console.log(ticketType.gridOptions.columns[i].name.concat(".visible: "), ticketType.gridOptions.columns[i].visible);
        }
        ticketType.gridOptions.columnCheckbox = !ticketType.gridOptions.columnCheckbox;
    }
    //Export Report 
    ticketType.exportFile = function () {
        ticketType.addRequested = true;
        ticketType.gridOptions.advancedSearchData.engine.ExportFile = ticketType.ExportFileClass;
        ajax.call(mainPathApi+'ticketType/exportfile', ticketType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            ticketType.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                ticketType.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //ticketType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    ticketType.toggleExportForm = function () {
        ticketType.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        ticketType.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        ticketType.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        ticketType.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        ticketType.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleTicketing/TicketType/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    ticketType.rowCountChanged = function () {
        if (!angular.isDefined(ticketType.ExportFileClass.RowCount) || ticketType.ExportFileClass.RowCount > 5000)
            ticketType.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    ticketType.getCount = function () {
        ajax.call(mainPathApi+"ticketType/count", ticketType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            ticketType.addRequested = false;
            rashaErManage.checkAction(response);
            ticketType.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            ticketType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);