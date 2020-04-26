app.controller("shopProcessValueController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$stateParams', '$builder', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $stateParams, $builder, $state, $filter) {
    var taskScheduleProcessValue = this;
    taskScheduleProcessValue.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    taskScheduleProcessValue.changeState = function (state) {
        $state.go("index." + state);
    }

    if ($stateParams.appid == null || $stateParams.appid <= 0 || $stateParams.sourceid == null || $stateParams.sourceid <= 0)
        taskScheduleProcessValue.changeState("shopapplication");
    taskScheduleProcessValue.appId = $stateParams.appid;
    taskScheduleProcessValue.appTitle = $stateParams.apptitle;
    taskScheduleProcessValue.sourceId = $stateParams.sourceid;

    taskScheduleProcessValue.init = function () {
        taskScheduleProcessValue.busyIndicator.isActive = true;
        taskScheduleProcessValue.gridOptions.advancedSearchData.engine.Filters.push({ PropertyName: "LinkSourceId", searchType: 0, IntValue1: parseInt(taskScheduleProcessValue.sourceId) });
        ajax.call(cmsServerConfig.configApiServerPath+"shopProcess/getall", taskScheduleProcessValue.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            taskScheduleProcessValue.busyIndicator.isActive = false;
            taskScheduleProcessValue.ListItems = response.ListItems;
            taskScheduleProcessValue.gridOptions.fillData(taskScheduleProcessValue.ListItems, response.resultAccess);
            taskScheduleProcessValue.gridOptions.currentPageNumber = response.CurrentPageNumber;
            taskScheduleProcessValue.gridOptions.totalRowCount = response.TotalRowCount;
            taskScheduleProcessValue.gridOptions.rowPerPage = response.RowPerPage;
            taskScheduleProcessValue.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            taskScheduleProcessValue.busyIndicator.isActive = false;
            taskScheduleProcessValue.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    taskScheduleProcessValue.openAddModal = function () {
        taskScheduleProcessValue.busyIndicator.isActive = true;
        taskScheduleProcessValue.addRequested = true;
        taskScheduleProcessValue.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'shopProcessvalue/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            taskScheduleProcessValue.selectedItem = response.Item;
            taskScheduleProcessValue.busyIndicator.isActive = false;
            taskScheduleProcessValue.addRequested = false;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/shopProcessvalue/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    taskScheduleProcessValue.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        taskScheduleProcessValue.busyIndicator.isActive = true;
        taskScheduleProcessValue.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopProcessvalue/add', taskScheduleProcessValue.selectedItem, 'POST').success(function (response) {
            taskScheduleProcessValue.addRequested = false;
            taskScheduleProcessValue.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                taskScheduleProcessValue.ListItems.unshift(response.Item);
                taskScheduleProcessValue.gridOptions.fillData(taskScheduleProcessValue.ListItems);
                taskScheduleProcessValue.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            taskScheduleProcessValue.busyIndicator.isActive = false;
            taskScheduleProcessValue.addRequested = false;
        });
    }

    taskScheduleProcessValue.openEditModal = function () {
        taskScheduleProcessValue.modalTitle = 'ویرایش';
        if (!taskScheduleProcessValue.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'shopProcessvalue/GetOne', taskScheduleProcessValue.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            taskScheduleProcessValue.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/shopProcessvalue/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    taskScheduleProcessValue.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        taskScheduleProcessValue.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopProcessvalue/edit', taskScheduleProcessValue.selectedItem, 'PUT').success(function (response) {
            taskScheduleProcessValue.addRequested = true;
            rashaErManage.checkAction(response);
            taskScheduleProcessValue.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                taskScheduleProcessValue.addRequested = false;
                taskScheduleProcessValue.replaceItem(taskScheduleProcessValue.selectedItem.Id, response.Item);
                taskScheduleProcessValue.gridOptions.fillData(taskScheduleProcessValue.ListItems);
                taskScheduleProcessValue.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            taskScheduleProcessValue.addRequested = false;
        });
    }

    taskScheduleProcessValue.closeModal = function () {
        $modalStack.dismissAll();
    };

    taskScheduleProcessValue.replaceItem = function (oldId, newItem) {
        angular.forEach(taskScheduleProcessValue.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = taskScheduleProcessValue.ListItems.indexOf(item);
                taskScheduleProcessValue.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            taskScheduleProcessValue.ListItems.unshift(newItem);
    }

    taskScheduleProcessValue.deleteRow = function () {
        if (!taskScheduleProcessValue.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                taskScheduleProcessValue.busyIndicator.isActive = true;
                console.log(taskScheduleProcessValue.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'shopProcessvalue/GetOne', taskScheduleProcessValue.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    taskScheduleProcessValue.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'shopProcessvalue/delete', taskScheduleProcessValue.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        taskScheduleProcessValue.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            taskScheduleProcessValue.replaceItem(taskScheduleProcessValue.selectedItemForDelete.Id);
                            taskScheduleProcessValue.gridOptions.fillData(taskScheduleProcessValue.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        taskScheduleProcessValue.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    taskScheduleProcessValue.busyIndicator.isActive = false;
                });
            }
        });
    }

    taskScheduleProcessValue.gridOptions = {
        columns: [
            { name: "Id", displayName: "کد سیستمی", sortable: true, type: "integer", visible: true },
            { name: "Title", displayName: "عنوان", sortable: true, type: "string", visible: true },
            { name: "ClassName", displayName: "قالب", sortable: true, type: "string", displayForce: true, visible: true },
            { name: "ActionButton", displayName: "مقادیر", sortable: true, displayForce: true, template: "<button class=\"btn btn-success\" ng-click=\"taskScheduleProcessValue.openPreviewModal(x.Id)\" title=\"مقداردهی\" type=\"button\"><i class=\"fa fa-pencil fa-1x\" aria-hidden=\"true\"></i></button>" }
        ],
        data: {},
        multiSelect: false,
        startDate: moment().format(),
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "Id",
                SortType: 0,
                NeedToRunFakePagination: false,
                TotalRowData: 2000,
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }

    taskScheduleProcessValue.gridOptions.reGetAll = function () {
        taskScheduleProcessValue.init();
    }

    taskScheduleProcessValue.gridOptions.onRowSelected = function () {

    }

    taskScheduleProcessValue.columnCheckbox = false;

    taskScheduleProcessValue.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (taskScheduleProcessValue.gridOptions.columnCheckbox) {
            for (var i = 0; i < taskScheduleProcessValue.gridOptions.columns.length; i++) {
                //taskScheduleProcessValue.gridOptions.columns[i].visible = $("#" + taskScheduleProcessValue.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + taskScheduleProcessValue.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                taskScheduleProcessValue.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = taskScheduleProcessValue.gridOptions.columns;
            for (var i = 0; i < taskScheduleProcessValue.gridOptions.columns.length; i++) {
                taskScheduleProcessValue.gridOptions.columns[i].visible = true;
                var element = $("#" + taskScheduleProcessValue.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + taskScheduleProcessValue.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < taskScheduleProcessValue.gridOptions.columns.length; i++) {
            console.log(taskScheduleProcessValue.gridOptions.columns[i].name.concat(".visible: "), taskScheduleProcessValue.gridOptions.columns[i].visible);
        }
        taskScheduleProcessValue.gridOptions.columnCheckbox = !taskScheduleProcessValue.gridOptions.columnCheckbox;
    }

    taskScheduleProcessValue.defaultValue = []
    ;
    // Show Preview form
    taskScheduleProcessValue.openPreviewModal = function (ProcessId) {
        var filterDataModel = { PropertyName: "Id", searchType: 0, IntValue1: taskScheduleProcessValue.ProcessId };
        var filterModel = { Filters: [] };
        filterModel.Filters.push(filterDataModel);
        ajax.call(cmsServerConfig.configApiServerPath+'shopProcess/GetOne', ProcessId, 'GET').success(function (response1) {
            var engine = {};
            engine.Filters = [];
            engine.Filters.push({ PropertyName: "LinkProcessId", searchType: 0, IntValue1: ProcessId });
            engine.Filters.push({ PropertyName: "LinkApplicationId", searchType: 0, IntValue1: taskScheduleProcessValue.appId });
            ajax.call(cmsServerConfig.configApiServerPath+'shopProcessvalue/getone', engine, 'POST').success(function (response2) {

                taskScheduleProcessValue.JsonFormDefaultValue = response1.Item.JsonFormDefaultValue;
                taskScheduleProcessValue.formJson = $builder.forms['default'];
                $builder.removeAllFormObject('default');

                // Clear privous values in formBuilder
                if (component != null)
                    $.each(component, function (i, item) {
                        taskScheduleProcessValue.defaultValue[item.id] = null;
                    });
                taskScheduleProcessValue.selectedItem = response2.Item;
                var values = [];
                if (response2.Item.Id > 0) {
                    // Load and set the values
                    values = $.parseJSON(response2.Item.JsonFormValues);
                    taskScheduleProcessValue.updateMode = 'edit';
                }
                else {
                    values = $.parseJSON(taskScheduleProcessValue.JsonFormDefaultValue);
                    taskScheduleProcessValue.updateMode = 'add';
                    taskScheduleProcessValue.selectedItem.LinkApplicationId = taskScheduleProcessValue.appId;
                    taskScheduleProcessValue.selectedItem.LinkProcessId = ProcessId;
                }
                var component = $.parseJSON(response1.Item.JsonForm);
                if (component != null)
                    $.each(component, function (i, item) {
                        try {
                            $builder.addFormObject('default', item);
                            //تخصیص مقادیر براساس نام فیلد
                            if (values != null && values.length != undefined)
                                $.each(values, function (iValue, itemValue) {
                                    if (item.fieldname == itemValue.fieldname)
                                        taskScheduleProcessValue.defaultValue[i] = itemValue.value;
                                });
                        }
                        catch (e) {
                        }
                    });
                $modal.open({
                    templateUrl: 'cpanelv1/ModuleShop/ShopProcessValue/preview.html',
                    scope: $scope
                });
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    taskScheduleProcessValue.saveSubmitValues = function () {
        var updateMethod = "PUT";
        if (taskScheduleProcessValue.updateMode == "add")
            updateMethod = "POST";
        taskScheduleProcessValue.busyIndicator.isActive = true;
        taskScheduleProcessValue.addRequested = true;
        taskScheduleProcessValue.selectedItem.JsonFormValues = $.trim(angular.toJson(taskScheduleProcessValue.submitValue));
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProcessValue/' + taskScheduleProcessValue.updateMode, taskScheduleProcessValue.selectedItem, updateMethod).success(function (response) {
            rashaErManage.checkAction(response);
            taskScheduleProcessValue.busyIndicator.isActive = false;
            taskScheduleProcessValue.addRequested = false;
            taskScheduleProcessValue.closeModal();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            taskScheduleProcessValue.busyIndicator.isActive = false;
            taskScheduleProcessValue.addRequested = false;
        });
    }
}]);

