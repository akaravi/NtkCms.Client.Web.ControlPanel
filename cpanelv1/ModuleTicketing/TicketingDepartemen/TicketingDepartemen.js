app.controller("ticketingDepartemenController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var ticketingDepartemen = this;

    ticketingDepartemen.busyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }

    var date = moment().format();
    ticketingDepartemen.startDate = {
        defaultDate: date
    }
    ticketingDepartemen.endDate = {
        defaultDate: date
    }

    ticketingDepartemen.gridOptions = {
        columns: [{
                name: 'Id',
                displayName: 'کد سیستمی',
                sortable: true,
                type: 'integer',
                visible: true
            },
            {
                name: 'LinkSiteId',
                displayName: 'کد سیستمی سایت',
                sortable: true,
                type: 'integer',
                visible: true
            },
            {
                name: 'Title',
                displayName: 'عنوان بخش',
                sortable: true,
                type: 'string',
                visible: true
            },
            {
                name: 'Priority',
                displayName: 'اولویت',
                sortable: true,
                type: 'integer',
                visible: true
            },
            //{ name: 'PriorityKey', displayName: 'اولویت', sortable: true, type: 'integer', visible: true,displayForce:true }
            //{ name: 'ActionButtons', displayName: 'اپراتورها', sortable: true, type: 'string', visible: true, displayForce: true, template: '<a type="button" ng-show="ticketingDepartemen.gridOptions.resultAccess.AccessWatchRow" class="btn btn-primary" ng-click="ticketingDepartemen.openOperatorModal(x.Id)"><i class="fa fa-user-plus" aria-hidden="true"></i>&nbsp;اپراتورها</a>' }
            //{ name: 'DefaultAnswerBody', displayName: 'جواب پیش فرض', sortable: true, type: 'string', visible: true }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    ticketingDepartemen.summernoteOptions = {
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

    ticketingDepartemen.init = function () {
        ticketingDepartemen.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath + "ticketingDepartemen/getall", ticketingDepartemen.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            ticketingDepartemen.ListItems = response.ListItems;
            ticketingDepartemen.gridOptions.fillData(response.ListItems, response.resultAccess);
            ticketingDepartemen.busyIndicator.isActive = false;
            if (!angular.isDefined(ticketingDepartemen.priorityEnum))
                ajax.call(cmsServerConfig.configApiServerPath + "ticketingDepartemen/GetPriorityEnum", {}, 'POST').success(function (response) {
                    ticketingDepartemen.priorityEnum = response.ListItems;
                    ticketingDepartemen.filterPriorityEnum(ticketingDepartemen.ListItems, ticketingDepartemen.priorityEnum);
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }

    ticketingDepartemen.filterPriorityEnum = function (arr, enu) {
        $.each(arr, function (i, item) {
            $.each(enu, function (j, prior) {
                if (item.Priority == prior.Value)
                    item.PriorityKey = prior.Description;
            });
        });
    }
    ticketingDepartemen.openAddModal = function () {
        ticketingDepartemen.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath + 'ticketingDepartemen/GetViewModel', "", 'GET').success(function (response) {
            //rashaErManage.checkAction(response);
            console.log(response);
            ticketingDepartemen.selectedItem = response.Item;
            ticketingDepartemen.selectedItem.ActionDate = date;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTicketing/TicketingDepartemen/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    ticketingDepartemen.openEditModal = function () {
        if (!ticketingDepartemen.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ticketingDepartemen.modalTitle = 'ویرایش';
        ajax.call(cmsServerConfig.configApiServerPath + 'ticketingDepartemen/GetOne', ticketingDepartemen.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            ticketingDepartemen.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTicketing/TicketingDepartemen/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    ticketingDepartemen.addNewRow = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        ticketingDepartemen.selectedItem.LinkCmsPageId = 1;
        ticketingDepartemen.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath + 'ticketingDepartemen/add', ticketingDepartemen.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                ticketingDepartemen.ListItems.unshift(response.Item);
                ticketingDepartemen.gridOptions.fillData(ticketingDepartemen.ListItems);
                ticketingDepartemen.closeModal();
            }
            ticketingDepartemen.addRequested = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
            rashaErManage.checkAction(data, errCode);
            ticketingDepartemen.addRequested = false;
        });
    }

    ticketingDepartemen.editRow = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        ticketingDepartemen.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath + 'ticketingDepartemen/edit', ticketingDepartemen.selectedItem, 'PUT').success(function (response) {
            ticketingDepartemen.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                ticketingDepartemen.replaceItem(ticketingDepartemen.selectedItem.Id, response.Item);
                ticketingDepartemen.gridOptions.fillData(ticketingDepartemen.ListItems);
                ticketingDepartemen.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            ticketingDepartemen.addRequested = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    ticketingDepartemen.delete = function () {
        if (!ticketingDepartemen.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(ticketingDepartemen.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath + 'ticketingDepartemen/GetOne', ticketingDepartemen.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {

                    rashaErManage.checkAction(response);
                    ticketingDepartemen.selectedItemForDelete = response.Item;
                    console.log(ticketingDepartemen.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath + 'ticketingDepartemen/delete', ticketingDepartemen.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            ticketingDepartemen.replaceItem(ticketingDepartemen.selectedItemForDelete.Id);
                            ticketingDepartemen.gridOptions.fillData(ticketingDepartemen.ListItems);
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

    ticketingDepartemen.replaceItem = function (oldId, newItem) {
        angular.forEach(ticketingDepartemen.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = ticketingDepartemen.ListItems.indexOf(item);
                ticketingDepartemen.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            ticketingDepartemen.ListItems.unshift(newItem);
    }

    ticketingDepartemen.closeModal = function () {
        $modalStack.dismissAll();
    }

    ticketingDepartemen.gridOptions.reGetAll = function () {
        ticketingDepartemen.init();
    }

    ticketingDepartemen.gridOptions.onRowSelected = function () {}

    //Operators
    ticketingDepartemen.operatorsList = [];

    ticketingDepartemen.openOperatorModal = function () {
        if (!ticketingDepartemen.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک بخش جهت افزودن اپراتور انتخاب کنید");
            return;
        }
        var ticketingDepartemenId = ticketingDepartemen.gridOptions.selectedRow.item.Id;
        ajax.call(cmsServerConfig.configApiServerPath + 'ticketingDepartemenoperator/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                ticketingDepartemen.selectedItem = response.Item;
                ticketingDepartemen.selectedItem.LinkticketingDepartemenId = ticketingDepartemenId;
                $modal.open({
                    templateUrl: 'cpanelv1/ModuleTicketing/TicketingDepartemen/addOperator.html',
                    scope: $scope
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
        var filterModel = {
            Filters: [{
                PropertyName: 'LinkticketingDepartemenId',
                SearchType: 0,
                IntValue1: ticketingDepartemenId
            }]
        };
        ajax.call(cmsServerConfig.configApiServerPath + 'ticketingDepartemenOperator/getAlloperator', filterModel, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                ticketingDepartemen.operatorsList = response.ListItems;
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    ticketingDepartemen.addMember = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        ticketingDepartemen.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath + 'ticketingDepartemenoperator/add', ticketingDepartemen.selectedItem, 'POST').success(function (response) {
            ticketingDepartemen.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                ticketingDepartemen.busyIndicator.isActive = false;
                ticketingDepartemen.operatorsList.push(response.Item);
                //Clear inputs
                ticketingDepartemen.selectedItem.Domain = "";
                ticketingDepartemen.selectedItem.SubDomain = "";
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            ticketingDepartemen.addRequested = false;
        });
    }

    ticketingDepartemen.deleteMember = function (index) {
        ajax.call(cmsServerConfig.configApiServerPath + 'ticketingDepartemenoprator/delete', ticketingDepartemen.operatorsList[index], 'POST').success(function (res) {
            rashaErManage.checkAction(res);
            if (res.IsSuccess) {
                ticketingDepartemen.operatorsList.splice(index, 1);
                rashaErManage.showMessage($filter('translatentk')('Removed_Successfully'));
            }
        }).error(function (data2, errCode2, c2, d2) {
            rashaErManage.checkAction(data2);
        });
    }

    ticketingDepartemen.userSelected = function (selected) {
        if (selected) {
            ticketingDepartemen.selectedItem.LinkUserId = selected.originalObject.Id;
        } else {
            ticketingDepartemen.selectedItem.LinkUserId = null;
        }
    }
    //ngautocomplete
    ticketingDepartemen.inputUserChanged = function (input) {
        var engine = {
            Filters: []
        };
        engine.Filters.push({
            PropertyName: "Name",
            SearchType: 5,
            StringValue1: input,
            ClauseType: 1
        });
        engine.Filters.push({
            PropertyName: "LastName",
            SearchType: 5,
            StringValue1: input,
            ClauseType: 1
        });
        //engine.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: input });
        ajax.call(cmsServerConfig.configApiServerPath + "CoreUser/search", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            ticketingDepartemen.cmsUsersListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Show Operators Grid
    ticketingDepartemen.showOperators = function (item) {
        if (item) {
            //var id = ticketingDepartemen.gridOptions.selectedRow.item.Id;
            ticketingDepartemen.operatorsloadingBusyIndicator = true;
            var Filter_value = {
                PropertyName: "LinkticketingDepartemenId",
                IntValue1: item.Id,
                SearchType: 0
            }
            ticketingDepartemen.gridContentOptions.advancedSearchData.engine.Filters = null;
            ticketingDepartemen.gridContentOptions.advancedSearchData.engine.Filters = [];
            ticketingDepartemen.gridContentOptions.advancedSearchData.engine.Filters.push(Filter_value);

            ajax.call(cmsServerConfig.configApiServerPath + 'ticketingDepartemenOperator/getall', ticketingDepartemen.gridContentOptions.advancedSearchData.engine, 'POST').success(function (response) {
                ticketingDepartemen.TypeOperator.ListItems = response.ListItems;
                ticketingDepartemen.gridContentOptions.fillData(ticketingDepartemen.TypeOperator.ListItems);
                ticketingDepartemen.gridContentOptions.currentPageNumber = response.CurrentPageNumber;
                ticketingDepartemen.gridContentOptions.totalRowCount = response.TotalRowCount;
                ticketingDepartemen.allowedSearch = response.AllowedSearchField;
                rashaErManage.checkAction(response);
                ticketingDepartemen.gridContentOptions.RowPerPage = response.RowPerPage;
                ticketingDepartemen.gridOptions.maxSize = 5;
                ticketingDepartemen.operatorsloadingBusyIndicator = false;
                ticketingDepartemen.showOperatorsGrid = true;
                ticketingDepartemen.Title = ticketingDepartemen.gridOptions.selectedRow.item.Title;
            }).error(function (data) {
                console.log(data);
                rashaErManage.checkAction(data, errCode);
            });;
        }
    }

    ticketingDepartemen.columnCheckbox = false;

    ticketingDepartemen.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (ticketingDepartemen.gridOptions.columnCheckbox) {
            for (var i = 0; i < ticketingDepartemen.gridOptions.columns.length; i++) {
                var element = $("#" + ticketingDepartemen.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                ticketingDepartemen.gridOptions.columns[i].visible = element[0].checked;
            }
        } else {
            var prechangeColumns = ticketingDepartemen.gridOptions.columns;
            for (var i = 0; i < ticketingDepartemen.gridOptions.columns.length; i++) {
                ticketingDepartemen.gridOptions.columns[i].visible = true;
                var element = $("#" + ticketingDepartemen.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + ticketingDepartemen.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < ticketingDepartemen.gridOptions.columns.length; i++) {
            console.log(ticketingDepartemen.gridOptions.columns[i].name.concat(".visible: "), ticketingDepartemen.gridOptions.columns[i].visible);
        }
        ticketingDepartemen.gridOptions.columnCheckbox = !ticketingDepartemen.gridOptions.columnCheckbox;
    }

    ticketingDepartemen.addNewRowTypeOperatorModel = function () {
        if (!ticketingDepartemen.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک ردیف جهت افزودن اپراتور انتخاب کنید");
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath + 'ticketingDepartemenOperator/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            console.log(response);
            ticketingDepartemen.TypeOperator.selectedItem = response.Item;
            ticketingDepartemen.TypeOperator.selectedItem.LinkticketingDepartemenId = ticketingDepartemen.gridOptions.selectedRow.item.Id;

            $modal.open({
                templateUrl: 'cpanelv1/ModuleTicketing/TicketingDepartemenOperator/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
        ticketingDepartemen.clearOperatorName();
        // ------------------------- Get users ----------------------------------
        ajax.call(cmsServerConfig.configApiServerPath + "CoreSiteUser/GetCurrentSiteUsers", "", 'GET').success(function (response) {
            ticketingDepartemen.CmsUser.ListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        // ------------------------- End of Get Users -----------------------
    }

    ticketingDepartemen.addNewRowTypeOperator = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (ticketingDepartemen.isAlreadyExists(ticketingDepartemen.TypeOperator.selectedItem.LinkUserId)) {
            rashaErManage.showMessage("این اپراتور در حال وجود دارد!");
            return;
        }
        ticketingDepartemen.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath + 'ticketingDepartemenOperator/add', ticketingDepartemen.TypeOperator.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                ticketingDepartemen.TypeOperator.ListItems.unshift(response.Item);
                ticketingDepartemen.gridContentOptions.fillData(ticketingDepartemen.TypeOperator.ListItems);
                ticketingDepartemen.closeModal();
            }
            ticketingDepartemen.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            ticketingDepartemen.addRequested = false;
        });
    }

    ticketingDepartemen.deleteTypeOperatorModel = function (item) {
        ticketingDepartemen.gridContentOptions.selectedRow.item = item;
        if (!ticketingDepartemen.gridContentOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                ajax.call(cmsServerConfig.configApiServerPath + 'ticketingDepartemenoperator/GetOne', ticketingDepartemen.gridContentOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    ticketingDepartemen.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath + 'ticketingDepartemenoperator/delete', ticketingDepartemen.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            ticketingDepartemen.replaceItem(ticketingDepartemen.selectedItemForDelete.Id);
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

    ticketingDepartemen.isAlreadyExists = function (operatorId) {
        for (i = 0; i < ticketingDepartemen.TypeOperator.ListItems.length; i++) {
            if (ticketingDepartemen.TypeOperator.ListItems[i].LinkUserId == operatorId) {
                return true;
            }
        }
        return false;
    }

    ticketingDepartemen.clearOperatorName = function () {
        ticketingDepartemen.Name = "_";
        ticketingDepartemen.LastName = "";
    }

    ticketingDepartemen.setName = function (operatorId) {
        for (var i = 0; i < ticketingDepartemen.CmsUser.ListItems.length; i++) {
            if (ticketingDepartemen.CmsUser.ListItems[i].User.Id == operatorId) {
                ticketingDepartemen.Name = ticketingDepartemen.CmsUser.ListItems[i].User.Name;
                ticketingDepartemen.LastName = ticketingDepartemen.CmsUser.ListItems[i].User.LastName;
            }
        }
    }
    ticketingDepartemen.columnCheckbox = false;
    ticketingDepartemen.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = ticketingDepartemen.gridOptions.columns;
        if (ticketingDepartemen.gridOptions.columnCheckbox) {
            for (var i = 0; i < ticketingDepartemen.gridOptions.columns.length; i++) {
                var element = $("#" + ticketingDepartemen.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                ticketingDepartemen.gridOptions.columns[i].visible = temp;
            }
        } else {

            for (var i = 0; i < ticketingDepartemen.gridOptions.columns.length; i++) {
                var element = $("#" + ticketingDepartemen.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + ticketingDepartemen.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < ticketingDepartemen.gridOptions.columns.length; i++) {
            console.log(ticketingDepartemen.gridOptions.columns[i].name.concat(".visible: "), ticketingDepartemen.gridOptions.columns[i].visible);
        }
        ticketingDepartemen.gridOptions.columnCheckbox = !ticketingDepartemen.gridOptions.columnCheckbox;
    }
    //Export Report 
    ticketingDepartemen.exportFile = function () {
        ticketingDepartemen.addRequested = true;
        ticketingDepartemen.gridOptions.advancedSearchData.engine.ExportFile = ticketingDepartemen.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath + 'ticketingDepartemen/exportfile', ticketingDepartemen.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            ticketingDepartemen.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                ticketingDepartemen.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    ticketingDepartemen.toggleExportForm = function () {
        ticketingDepartemen.SortType = [{
                key: 'نزولی',
                value: 0
            },
            {
                key: 'صعودی',
                value: 1
            },
            {
                key: 'تصادفی',
                value: 3
            }
        ];
        ticketingDepartemen.EnumExportFileType = [{
                key: 'Excel',
                value: 1
            },
            {
                key: 'PDF',
                value: 2
            },
            {
                key: 'Text',
                value: 3
            }
        ];
        ticketingDepartemen.EnumExportReceiveMethod = [{
                key: 'دانلود',
                value: 0
            },
            {
                key: 'ایمیل',
                value: 1
            },
            {
                key: 'فایل منیجر',
                value: 3
            }
        ];
        ticketingDepartemen.ExportFileClass = {
            FileType: 1,
            RecieveMethod: 0,
            RowCount: 100
        };
        ticketingDepartemen.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleTicketing/TicketingDepartemen/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    ticketingDepartemen.rowCountChanged = function () {
        if (!angular.isDefined(ticketingDepartemen.ExportFileClass.RowCount) || ticketingDepartemen.ExportFileClass.RowCount > 5000)
            ticketingDepartemen.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    ticketingDepartemen.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath + "ticketingDepartemen/count", ticketingDepartemen.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            ticketingDepartemen.addRequested = false;
            rashaErManage.checkAction(response);
            ticketingDepartemen.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            ticketingDepartemen.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);