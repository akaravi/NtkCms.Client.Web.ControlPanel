app.controller("formBuilderFormSubmitController", ["$scope", "$state", "$stateParams", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$builder', '$validator', '$filter', '$window', function ($scope, $state,$stateParams, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $builder, $validator, $filter, $window) {
    var value = this;
    value.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }

    //value.form = $builder.forms['default'];

    value.selectedFormBuilderSubmit = {
        Id: $stateParams.FormBuilderId
    };
    value.cmsModulesProcessesListItems = [];
    value.cmsModulesProcessesCustomizeListItems = [];
    value.cmsModulesListItems = [];
    if (itemRecordStatus != undefined) value.itemRecordStatus = itemRecordStatus;

    //value.cmsProcessesListItems = [];
    value.cmsModuleProcess = {};

    value.init = function () {
        value.busyIndicator.isActive = true;
        if (value.selectedFormBuilderSubmit.Id <= 0) {
            $state.go("index.formbuilderform");
            return;
        }
        var engine = {
            Filters: [{
                PropertyName: "LinkFormId",
                IntValue1: value.selectedFormBuilderSubmit.Id
            }]
        };
        ajax.call(cmsServerConfig.configApiServerPath+"FormBuilderFormSubmit/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            value.ListItems = response.ListItems;
            value.busyIndicator.isActive = false;
            //cmsModuleSitegrd.gridOptions.resultAccess = response.resultAccess;//دسترسی ها نمایش
            value.gridOptions.fillData(value.ListItems, response.resultAccess); // دسترسی ها نمایش
            value.gridOptions.currentPageNumber = response.CurrentPageNumber;
            value.gridOptions.totalRowCount = response.TotalRowCount;
            value.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            value.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            value.busyIndicator.isActive = false;
        });
        value.getAllForms(1000, 1);
    }
    value.getAllForms = function (rowPerPage, currentPageNumber) {
        ajax.call(cmsServerConfig.configApiServerPath+"formBuilderform/getall", { RowPerPage: rowPerPage, CurrentPageNumber: currentPageNumber }, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            value.formListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Open Add Model
    value.addRequested = false;
    value.openAddModal = function () {
        value.modalTitle = 'اضافه';
        value.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'formBuilderFormSubmit/GetViewModel', "", 'GET').success(function (response) {
            value.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            value.selectedItem = response.Item;
            $builder.removeAllFormObject('default');
            $modal.open({
                templateUrl: 'cpanelv1/ModuleFormBuilder/FormBuilderFormSubmit/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Add New Row
    value.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (value.selectedItem.LinkFormId == null || value.selectedItem.LinkFormId == undefined)
        { rashaErManage.showMessage("فرم انتخاب نشده است!"); return; }
        value.busyIndicator.isActive = true;
        value.addRequested = true;
        value.selectedItem.JsonValues = $.trim(angular.toJson(value.submitValue));
        ajax.call(cmsServerConfig.configApiServerPath+'FormBuilderFormSubmit/add', value.selectedItem, 'POST').success(function (response) {
            value.addRequested = false;
            value.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                value.ListItems.unshift(response.Item);
                value.gridOptions.fillData(value.ListItems);
                value.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            value.busyIndicator.isActive = false;
            value.addRequested = false;
        });
    }

    // Open Edit Modal
    value.openEditModal = function () {
        value.modalTitle = 'ویرایش';

        if (!value.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        value.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'FormBuilderFormSubmit/GetOne', value.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            value.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            value.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleFormBuilder/FormBuilderFormSubmit/edit.html',
                scope: $scope
            });
            var values = $.parseJSON(value.selectedItem.JsonValues);
            value.onLinkFormIdChange(value.selectedItem.LinkFormId, values);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    value.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        value.addRequested = true;
        value.selectedItem.JsonValues = $.trim(angular.toJson(value.submitValue));
        ajax.call(cmsServerConfig.configApiServerPath+'FormBuilderFormSubmit/edit', value.selectedItem, 'PUT').success(function (response) {
            value.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                value.addRequested = false;
                value.replaceItem(value.selectedItem.Id, response.Item);
                value.gridOptions.fillData(value.ListItems);
                value.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            value.addRequested = false;
        });
    }


    value.closeModal = function () {
        $modalStack.dismissAll();
    };

    value.replaceItem = function (oldId, newItem) {
        angular.forEach(value.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = value.ListItems.indexOf(item);
                value.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            value.ListItems.unshift(newItem);
    }

    value.deleteRow = function () {
        if (!value.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        value.busyIndicator.isActive = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(value.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'formBuilderFormSubmit/GetOne', value.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    value.selectedItemForDelete = response.Item;
                    console.log(value.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'formBuilderFormSubmit/delete', value.selectedItemForDelete, 'POST').success(function (res) {
                        value.busyIndicator.isActive = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            value.replaceItem(value.selectedItemForDelete.Id);
                            value.gridOptions.fillData(value.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        value.busyIndicator.isActive = false;
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });
    }

    value.searchData = function () {
        //value.gridOptions.serachData();
        ajax.call(cmsServerConfig.configApiServerPath+"FormBuilderFormSubmit/getall", value.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            //value.contentBusyIndicator.isActive = false;
            value.ListItems = response.ListItems;
            value.gridOptions.fillData(value.ListItems);
            value.gridOptions.currentPageNumber = response.CurrentPageNumber;
            value.gridOptions.totalRowCount = response.TotalRowCount;
            value.gridOptions.rowPerPage = response.RowPerPage;
            value.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            value.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    value.LinkExternalUserIdSelector = {
        displayMember: 'Name',
        id: 'Id',
        fId: 'LinkExternalUserId',
        url: 'coreuser',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: value,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Username', displayName: 'نام کاربری', sortable: true, type: 'string' },
                { name: 'Name', displayName: 'نام', sortable: true, type: 'string' },
                { name: 'LastName', displayName: 'نام خانوادگی', sortable: true, type: 'string' }
            ]
        }
    }
    value.LinkExternalModuleMemberIdSelector = {
        displayMember: 'FirstName',
        id: 'Id',
        fId: 'LinkExternalModuleMemberId',
        url: 'memberuser',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: value,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'FirstName', displayName: 'نام', sortable: true, type: 'string' },
                { name: 'LastName', displayName: 'نام خانوادگی', sortable: true, type: 'string' }
            ]
        }
    }
    value.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'ModuleMember.FirstName', displayName: 'نام عضو', sortable: true, type: 'string' },
            { name: 'ModuleMember.LastName', displayName: 'نام خانوادگی عضو', sortable: true, type: 'string' },
            { name: 'ModuleCore.Name', displayName: 'نام کاربر', sortable: true, type: 'string' },
            { name: 'ModuleCore.LastName', displayName: 'نام خانوادگی کاربر', sortable: true, type: 'string' },
            { name: 'LinkExternalUserId', displayName: 'کد کاربر', sortable: true, type: 'integer', visible: true },
            { name: 'LinkExternalModuleMemberId', displayName: 'کد عضو', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'LinkFormId', displayName: 'کد سیستمی فرم', sortable: true, type: 'string' }
            //{ name: 'JsonValue', displayName: 'توضیحات', sortable: true, type: 'string' },
            //{ name: 'ActionButton', displayName: 'مقادیر ورودی', sortable: true, displayForce: true, template: '<button class="btn btn-success" ng-click="value.openCustomizeInputValueModal(x)" title="طرّاحی مقادیر وردوی" type="button"><i class="fa fa-bars fa-1x" ></i></button>' }
        ],
        data: {},
        multiSelect: false,
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

    value.gridOptions.reGetAll = function () {
        value.init();
    }

    value.gridOptions.onRowSelected = function () { }

    value.gridOptions.reGetAll = function () {
        value.init();
    }

    value.valueSubmit = [];
    value.defaultValue = {};

    // Show InputValue form builder and auto scroll to its position
    value.openCustomizeInputValueModal = function (item) {
        value.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'universalmenuProcesses/GetOne', item.Id, 'GET').success(function (response) {
            value.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            value.selectedItem = response.Item;
            //value.defaultValue = $.parseJSON(value.selectedItem.ProcessCustomizationInputValue);
            //$scope.defaultValue = $.parseJSON(value.selectedItem.ProcessCustomizationInputValue);
            ////Load Data
            angular.forEach($.parseJSON(value.selectedItem.ProcessCustomizationInputValue), function (item, key) {
                value.defaultValue[item.id] = item.value;
            });
            $builder.removeAllFormObject('default');
            var length = value.cmsModulesProcessesCustomizeListItems.length;
            for (var i = 0; i < length; i++) {
                if (value.cmsModulesProcessesCustomizeListItems[i].Id == item.LinkModuleProcessCustomizeId) {
                    component = $.parseJSON(value.cmsModulesProcessesCustomizeListItems[i].ProcessInputValueForm);
                    if (component != null && component.length != undefined)
                        $.each(component, function (i, item) {
                            $builder.addFormObject('default', item);
                        });
                }
            }
            //var json = '[{"component":"textInput","editable":true,"index":0,"label":"National ID","description":"","placeholder":"","options":[],"required":true,"validation":"[number]"},{"component":"checkbox","editable":true,"index":1,"label":"Interest","description":"","placeholder":"","options":["Games","Reading","Movies"],"required":false,"validation":"\/.*\/"},{"component":"radio","editable":true,"index":2,"label":"Gender","description":"","placeholder":"","options":["Male","Female"],"required":false,"validation":"\/.*\/"},{"component":"select","editable":true,"index":3,"label":"Country","description":"","placeholder":"","options":["Egypt","Russia"],"required":false,"validation":"\/.*\/"},{"component":"textArea","editable":true,"index":4,"label":"Feedback","description":"","placeholder":"","options":[],"required":false,"validation":"\/.*\/"}]';
            //json = '[{"component":"checkbox","editable":true,"index":1,"label":"Interest","description":"","placeholder":"","options":["Games","Reading","Movies"],"required":false,"validation":"\/.*\/"},{"component":"radio","editable":true,"index":2,"label":"Gender","description":"","placeholder":"","options":["Male","Female"],"required":false,"validation":"\/.*\/"}]';

            //value.valueSubmit = $.parseJSON(value.selectedItem.ProcessCustomizationInputValue);
            value.form = $builder.forms['default'];
            $("#inputValue_form").css("display", "");
            $('html, body').animate({
                scrollTop: $("#inputValue_form").offset().top
            }, 850);


            ////Load Data
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });

    }
 //Export Report 
    value.exportFile = function () {
        value.gridOptions.advancedSearchData.engine.ExportFile = value.ExportFileClass;
        value.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'BiographyContent/exportfile', value.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            value.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                value.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //value.closeModal();
            }
            value.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    value.toggleExportForm = function () {
        value.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        value.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        value.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        value.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleFormBuilder/FormBuilderFormSubmit/report.html',
            scope: $scope
        });
    }

    $builder.defa
    value.onLinkFormIdChange = function (formId, values) {
        ajax.call(cmsServerConfig.configApiServerPath+'formbuilderform/GetOne', formId, 'GET').success(function (response) {
            value.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            value.selectedItem.JsonForm = response.Item.JsonForm;

            $builder.removeAllFormObject('default');
            if (value.selectedItem.JsonForm == null || value.selectedItem.JsonForm == "")
                return;
            var component = JSON.parse(value.selectedItem.JsonForm);
            if (component != null && component.length != undefined)
                $.each(component, function (i, item) {
                    $builder.addFormObject('default', item);
                });
            //تخصیص مقادیر براساس نام فیلد
            if (values != null && values.length != undefined)
                $.each(values, function (i, item) {
                    value.defaultValue[item.id] = item.value;
                });
        }).error(function (data, errCode, c, d) {
            value.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);