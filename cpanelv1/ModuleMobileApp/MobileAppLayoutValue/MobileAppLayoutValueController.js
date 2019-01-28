app.controller("mobileAppLayoutValueController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$stateParams', '$builder', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $stateParams, $builder, $state, $filter) {
    var appLayoutValue = this;
    appLayoutValue.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    appLayoutValue.changeState = function (state) {
        $state.go("index." + state);
    }

    if ($stateParams.appid == null || $stateParams.appid <= 0 || $stateParams.sourceid == null || $stateParams.sourceid <= 0)
        appLayoutValue.changeState("mobileappapplication");
    appLayoutValue.appId = $stateParams.appid;
    appLayoutValue.appTitle = $stateParams.apptitle;
    appLayoutValue.sourceId = $stateParams.sourceid;

    appLayoutValue.init = function () {
        appLayoutValue.busyIndicator.isActive = true;
        appLayoutValue.gridOptions.advancedSearchData.engine.Filters.push({ PropertyName: "LinkSourceId", searchType: 0, IntValue1: parseInt(appLayoutValue.sourceId) });
        ajax.call(mainPathApi+"mobileapplayout/getall", appLayoutValue.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            appLayoutValue.busyIndicator.isActive = false;
            appLayoutValue.ListItems = response.ListItems;
            appLayoutValue.gridOptions.fillData(appLayoutValue.ListItems, response.resultAccess);
            appLayoutValue.gridOptions.currentPageNumber = response.CurrentPageNumber;
            appLayoutValue.gridOptions.totalRowCount = response.TotalRowCount;
            appLayoutValue.gridOptions.rowPerPage = response.RowPerPage;
            appLayoutValue.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            appLayoutValue.busyIndicator.isActive = false;
            appLayoutValue.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    appLayoutValue.openAddModal = function () {
        appLayoutValue.busyIndicator.isActive = true;
        appLayoutValue.addRequested = true;
        appLayoutValue.modalTitle = 'اضافه';
        ajax.call(mainPathApi+'mobileapplayoutvalue/getviewmodel', "0", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            appLayoutValue.selectedItem = response.Item;
            appLayoutValue.busyIndicator.isActive = false;
            appLayoutValue.addRequested = false;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMobileApp/mobileapplayoutvalue/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    appLayoutValue.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        appLayoutValue.busyIndicator.isActive = true;
        appLayoutValue.addRequested = true;
        ajax.call(mainPathApi+'mobileapplayoutvalue/add', appLayoutValue.selectedItem, 'POST').success(function (response) {
            appLayoutValue.addRequested = false;
            appLayoutValue.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                appLayoutValue.ListItems.unshift(response.Item);
                appLayoutValue.gridOptions.fillData(appLayoutValue.ListItems);
                appLayoutValue.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appLayoutValue.busyIndicator.isActive = false;
            appLayoutValue.addRequested = false;
        });
    }

    appLayoutValue.openEditModal = function () {
        appLayoutValue.modalTitle = 'ویرایش';
        if (!appLayoutValue.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }

        ajax.call(mainPathApi+'mobileapplayoutvalue/getviewmodel', appLayoutValue.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            appLayoutValue.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMobileApp/mobileapplayoutvalue/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    appLayoutValue.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        appLayoutValue.busyIndicator.isActive = true;
        ajax.call(mainPathApi+'mobileapplayoutvalue/edit', appLayoutValue.selectedItem, 'PUT').success(function (response) {
            appLayoutValue.addRequested = true;
            rashaErManage.checkAction(response);
            appLayoutValue.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                appLayoutValue.addRequested = false;
                appLayoutValue.replaceItem(appLayoutValue.selectedItem.Id, response.Item);
                appLayoutValue.gridOptions.fillData(appLayoutValue.ListItems);
                appLayoutValue.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appLayoutValue.addRequested = false;
        });
    }

    appLayoutValue.closeModal = function () {
        $modalStack.dismissAll();
    };

    appLayoutValue.replaceItem = function (oldId, newItem) {
        angular.forEach(appLayoutValue.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = appLayoutValue.ListItems.indexOf(item);
                appLayoutValue.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            appLayoutValue.ListItems.unshift(newItem);
    }

    appLayoutValue.deleteRow = function () {
        if (!appLayoutValue.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                appLayoutValue.busyIndicator.isActive = true;
                console.log(appLayoutValue.gridOptions.selectedRow.item);
                ajax.call(mainPathApi+'mobileapplayoutvalue/getviewmodel', appLayoutValue.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    appLayoutValue.selectedItemForDelete = response.Item;
                    ajax.call(mainPathApi+'mobileapplayoutvalue/delete', appLayoutValue.selectedItemForDelete, 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        appLayoutValue.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            appLayoutValue.replaceItem(appLayoutValue.selectedItemForDelete.Id);
                            appLayoutValue.gridOptions.fillData(appLayoutValue.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        appLayoutValue.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    appLayoutValue.busyIndicator.isActive = false;
                });
            }
        });
    }

    appLayoutValue.gridOptions = {
        columns: [
            { name: "Id", displayName: "کد سیستمی", sortable: true, type: "integer", visible: true },
            { name: "Title", displayName: "عنوان", sortable: true, type: "string", visible: true },
            { name: "ClassName", displayName: "قالب", sortable: true, type: "string", displayForce: true, visible: true },
            { name: "ActionButton", displayName: "مقادیر", sortable: true, displayForce: true, template: "<button class=\"btn btn-success\" ng-click=\"appLayoutValue.openPreviewModal(x.Id)\" title=\"مقداردهی\" type=\"button\"><i class=\"fa fa-pencil fa-1x\" aria-hidden=\"true\"></i></button>" }
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

    appLayoutValue.gridOptions.reGetAll = function () {
        appLayoutValue.init();
    }

    appLayoutValue.gridOptions.onRowSelected = function () {

    }

    appLayoutValue.columnCheckbox = false;

    appLayoutValue.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (appLayoutValue.gridOptions.columnCheckbox) {
            for (var i = 0; i < appLayoutValue.gridOptions.columns.length; i++) {
                //appLayoutValue.gridOptions.columns[i].visible = $("#" + appLayoutValue.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + appLayoutValue.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                appLayoutValue.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = appLayoutValue.gridOptions.columns;
            for (var i = 0; i < appLayoutValue.gridOptions.columns.length; i++) {
                appLayoutValue.gridOptions.columns[i].visible = true;
                var element = $("#" + appLayoutValue.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + appLayoutValue.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < appLayoutValue.gridOptions.columns.length; i++) {
            console.log(appLayoutValue.gridOptions.columns[i].name.concat(".visible: "), appLayoutValue.gridOptions.columns[i].visible);
        }
        appLayoutValue.gridOptions.columnCheckbox = !appLayoutValue.gridOptions.columnCheckbox;
    }

    appLayoutValue.defaultValue = []
    ;
    // Show Preview form
    appLayoutValue.openPreviewModal = function (layoutId) {
        var filterDataModel = { PropertyName: "Id", searchType: 0, IntValue1: appLayoutValue.layoutId };
        var filterModel = { Filters: [] };
        filterModel.Filters.push(filterDataModel);
        ajax.call(mainPathApi+'mobileapplayout/getviewmodel', layoutId, 'GET').success(function (response1) {
            var engine = {};
            engine.Filters = [];
            engine.Filters.push({ PropertyName: "LinkLayoutId", searchType: 0, IntValue1: layoutId });
            engine.Filters.push({ PropertyName: "LinkApplicationId", searchType: 0, IntValue1: appLayoutValue.appId });
            ajax.call(mainPathApi+'mobileapplayoutvalue/getone', engine, 'POST').success(function (response2) {

                appLayoutValue.JsonFormDefaultValue = response1.Item.JsonFormDefaultValue;
                appLayoutValue.formJson = $builder.forms['default'];
                $builder.removeAllFormObject('default');

                // Clear privous values in formBuilder
                if (component != null)
                    $.each(component, function (i, item) {
                        appLayoutValue.defaultValue[item.id] = null;
                    });
                appLayoutValue.selectedItem = response2.Item;
                var values = [];
                if (response2.Item.Id > 0) {
                    // Load and set the values
                    values = $.parseJSON(response2.Item.JsonFormValues);
                    appLayoutValue.updateMode = 'edit';
                }
                else {
                    values = $.parseJSON(appLayoutValue.JsonFormDefaultValue);
                    appLayoutValue.updateMode = 'add';
                    appLayoutValue.selectedItem.LinkApplicationId = appLayoutValue.appId;
                    appLayoutValue.selectedItem.LinkLayoutId = layoutId;
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
                                        appLayoutValue.defaultValue[i] = itemValue.value;
                                });
                        }
                        catch (e) {
                        }
                    });
                $modal.open({
                    templateUrl: 'cpanelv1/ModuleMobileApp/MobileAppLayoutValue/preview.html',
                    scope: $scope
                });
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    appLayoutValue.saveSubmitValues = function () {
        var updateMethod = "PUT";
        if (appLayoutValue.updateMode == "add")
            updateMethod = "POST";
        appLayoutValue.busyIndicator.isActive = true;
        appLayoutValue.addRequested = true;
        appLayoutValue.selectedItem.JsonFormValues = $.trim(angular.toJson(appLayoutValue.submitValue));
        ajax.call(mainPathApi+'MobileAppLayoutValue/' + appLayoutValue.updateMode, appLayoutValue.selectedItem, updateMethod).success(function (response) {
            rashaErManage.checkAction(response);
            appLayoutValue.busyIndicator.isActive = false;
            appLayoutValue.addRequested = false;
            appLayoutValue.closeModal();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appLayoutValue.busyIndicator.isActive = false;
            appLayoutValue.addRequested = false;
        });
    }
}]);

