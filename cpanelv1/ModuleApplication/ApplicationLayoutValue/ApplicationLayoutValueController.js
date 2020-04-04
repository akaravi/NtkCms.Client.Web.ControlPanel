app.controller("applicationLayoutValueController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$stateParams', '$builder', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $stateParams, $builder, $state, $filter) {
    var appLayoutValue = this;
    appLayoutValue.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    appLayoutValue.changeState = function (state) {
        $state.go("index." + state);
    }

    if ($stateParams.appid == null || $stateParams.appid <= 0 || $stateParams.sourceid == null || $stateParams.sourceid <= 0)
        appLayoutValue.changeState("applicationapp");
    appLayoutValue.appId = $stateParams.appid;
    appLayoutValue.appTitle = $stateParams.apptitle;
    appLayoutValue.sourceId = $stateParams.sourceid;

    appLayoutValue.init = function () {
        appLayoutValue.busyIndicator.isActive = true;
        appLayoutValue.gridOptions.advancedSearchData.engine.Filters.push({
            PropertyName: "LinkSourceId",
            searchType: 0,
            IntValue1: parseInt(appLayoutValue.sourceId)
        });
        ajax.call(cmsServerConfig.configApiServerPath + "applicationsource/getall", {}, 'POST').success(function (responseSource) {
            rashaErManage.checkAction(responseSource);
            appLayoutValue.sourceListItems = responseSource.ListItems;
            //
            ajax.call(cmsServerConfig.configApiServerPath + "applicationlayout/getall", appLayoutValue.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                appLayoutValue.busyIndicator.isActive = false;
                appLayoutValue.ListItems = response.ListItems;
                appLayoutValue.gridOptions.fillData(appLayoutValue.ListItems, response.resultAccess);
                appLayoutValue.gridOptions.currentPageNumber = response.CurrentPageNumber;
                appLayoutValue.gridOptions.totalRowCount = response.TotalRowCount;
                appLayoutValue.gridOptions.rowPerPage = response.RowPerPage;
                appLayoutValue.allowedSearch = response.AllowedSearchField;
                for (var i = 0; i < appLayoutValue.ListItems.length; i++) {
                    var fId = findWithAttr(appLayoutValue.sourceListItems, 'Id', appLayoutValue.ListItems[i].LinkSourceId)
                    if (fId >= 0)
                    appLayoutValue.ListItems[i].virtual_Source = appLayoutValue.sourceListItems[fId];
                }
            }).error(function (data, errCode, c, d) {
                appLayoutValue.busyIndicator.isActive = false;
                appLayoutValue.gridOptions.fillData();
                rashaErManage.checkAction(data, errCode);
            });
            //

        }).error(function (data, errCode, c, d) {
            appLayoutValue.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    function findWithAttr(array, attr, value) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }
    appLayoutValue.selectedItem = {};
    appLayoutValue.openEditModal = function () {
        appLayoutValue.modalTitle = 'ویرایش';
        if (!appLayoutValue.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        appLayoutValue.includeHtmlSite = 'cpanelv1/ModuleApplication/ConfigLayout/' + appLayoutValue.gridOptions.selectedRow.item.virtual_Source.ClassName + '.' + appLayoutValue.gridOptions.selectedRow.item.ClassName + '.Site.html';


        //start load ApplicationLayoutvalue If Exist
        var filterDataModel = {};
        filterDataModel.Filters = [];
        filterDataModel.Filters.push({
            PropertyName: "LinkApplicationId",//"LinkSourceId"
            searchType: 0,
            IntValue1: parseInt(appLayoutValue.appId)//parseInt(appLayoutValue.sourceId)
        });
        filterDataModel.Filters.push({
            PropertyName: "LinkLayoutId",
            searchType: 0,
            IntValue1: appLayoutValue.gridOptions.selectedRow.item.Id
        });

        ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationLayoutvalue/getone', filterDataModel, 'POST').success(function (responseValue) {
            appLayoutValue.busyIndicator.isActive = false;
            appLayoutValue.addRequested = false;
            appLayoutValue.selectedItem = responseValue.Item;
            if (responseValue.IsSuccess) {
                appLayoutValue.ConfigSite = $.parseJSON(appLayoutValue.selectedItem.JsonFormValues);
                if (appLayoutValue.selectedItem.JsonFormValues === "") {
                    appLayoutValue.ConfigSite = $.parseJSON(appLayoutValue.gridOptions.selectedRow.item.JsonFormDefaultValue);
                }
            } else {
                appLayoutValue.ConfigSite = $.parseJSON(appLayoutValue.gridOptions.selectedRow.item.JsonFormDefaultValue);
            }
            $modal.open({
                templateUrl: 'cpanelv1/ModuleApplication/applicationlayoutvalue/edit.html',
                scope: $scope
            });


        }).error(function (data, errCode, c, d) {
            appLayoutValue.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
        //End load ApplicationLayoutvalue If Exist



    }

    // Edit a Content
    appLayoutValue.editRow = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        appLayoutValue.busyIndicator.isActive = true;
        appLayoutValue.addRequested = true;
        //start load ApplicationLayoutvalue If Exist
        appLayoutValue.selectedItem.JsonFormValues = $.trim(angular.toJson(appLayoutValue.ConfigSite));
        if (appLayoutValue.selectedItem.Id && appLayoutValue.selectedItem.Id > 0) {
            ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationLayoutvalue/Edit', appLayoutValue.selectedItem, 'PUT').success(function (responseValue) {
                appLayoutValue.busyIndicator.isActive = false;
                appLayoutValue.addRequested = false;
                appLayoutValue.closeModal();
            }).error(function (data, errCode, c, d) {
                appLayoutValue.busyIndicator.isActive = false;
                rashaErManage.checkAction(data, errCode);
            });
        } else {
            appLayoutValue.selectedItem.LinkLayoutId = appLayoutValue.gridOptions.selectedRow.item.Id;
            //appLayoutValue.selectedItem.LinkSourceId = parseInt(appLayoutValue.sourceId);
            appLayoutValue.selectedItem.LinkApplicationId = parseInt(appLayoutValue.appId);
            ajax.call(cmsServerConfig.configApiServerPath + 'ApplicationLayoutvalue/Add', appLayoutValue.selectedItem, 'POST').success(function (responseValue) {
                appLayoutValue.busyIndicator.isActive = false;
                appLayoutValue.addRequested = false;
                appLayoutValue.closeModal();
            }).error(function (data, errCode, c, d) {
                appLayoutValue.busyIndicator.isActive = false;
                rashaErManage.checkAction(data, errCode);
            });
        }
        //End load ApplicationLayoutvalue If Exist


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


    appLayoutValue.gridOptions = {
        columns: [{
                name: "Id",
                displayName: "کد سیستمی",
                sortable: true,
                type: "integer",
                visible: true
            },
            {
                name: "Title",
                displayName: "عنوان",
                sortable: true,
                type: "string",
                visible: true
            },
            {
                name: "ClassName",
                displayName: "قالب",
                sortable: true,
                type: "string",
                displayForce: true,
                visible: true
            },
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
        } else {
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

    appLayoutValue.defaultValue = [];

}]);