app.controller("cmsModuleGridCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$builder', '$window', '$filter', '$rootScope', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $builder, $window, $filter, $rootScope) {
    var cmsModulegrd = this;

    cmsModulegrd.defaultValue = [];

    cmsModulegrd.busyIndicator = {
        isActive: false,
        message: "در حال بار گذاری ..."
    }
    cmsModulegrd.contentBusyConfig= {
        isActive: false,
        message: "در حال بار گذاری ..."
    }
    cmsModulegrd.contentBusyAdminMain= {
        isActive: false,
        message: "در حال بار گذاری ..."
    }
    cmsModulegrd.contentBusySiteAccessDefault= {
        isActive: false,
        message: "در حال بار گذاری ..."
    }
    cmsModulegrd.contentBusySiteDefault= {
        isActive: false,
        message: "در حال بار گذاری ..."
    }
    cmsModulegrd.ConfigBuilderAdmin={};
  
    
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    var date = moment().format();

    cmsModulegrd.ExpireDate = {
        defaultDate: date,
    }
    if (itemRecordStatus != undefined) cmsModulegrd.itemRecordStatus = itemRecordStatus;
    cmsModulegrd.init = function () {
        cmsModulegrd.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"CoreModule/getall", cmsModulegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsModulegrd.ListItems = response.ListItems;
            cmsModulegrd.gridOptions.fillData(cmsModulegrd.ListItems, response.resultAccess);
            cmsModulegrd.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsModulegrd.gridOptions.totalRowCount = response.TotalRowCount;
            cmsModulegrd.gridOptions.rowPerPage = response.RowPerPage;
            cmsModulegrd.gridOptions.maxSize = 5;
            cmsModulegrd.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            cmsModulegrd.busyIndicator.isActive = false;
            cmsModulegrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsModulegrd.addRequested = false;
    cmsModulegrd.openAddModal = function () {
        cmsModulegrd.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'coremodule/GetViewModel', '', 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsModulegrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsModule/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    cmsModulegrd.autoAdd = function () {
        cmsModulegrd.addRequested = true;
        cmsModulegrd.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'coremodule/AutoAdd', '', 'POST').success(function (response) {
            cmsModulegrd.addRequested = false;
            cmsModulegrd.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            cmsModulegrd.init();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    cmsModulegrd.addNewRow = function (frm) {
        if (frm.$invalid)
            return;
        cmsModulegrd.addRequested = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'coremodule/add', cmsModulegrd.selectedItem, 'POST').success(function (response) {
            buttonIsPressed = false;
            cmsModulegrd.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsModulegrd.ListItems.unshift(response.Item);
                cmsModulegrd.gridOptions.fillData(cmsModulegrd.ListItems);
                cmsModulegrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsModulegrd.addRequested = false;
        });
    }

    cmsModulegrd.openEditModal = function () {
        if (buttonIsPressed) { return };

        cmsModulegrd.modalTitle = 'ویرایش';
        if (!cmsModulegrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'coremodule/GetOne', cmsModulegrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;

            rashaErManage.checkAction(response);
            
            cmsModulegrd.selectedItem = response.Item;
            cmsModulegrd.ExpireDate.defaultDate = cmsModulegrd.selectedItem.ExpireDate;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsModule/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsModulegrd.editRow = function (frm) {
        if (frm.$invalid)
            return;

        ajax.call(cmsServerConfig.configApiServerPath+'coremodule/edit', cmsModulegrd.selectedItem, 'PUT').success(function (response) {
            cmsModulegrd.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsModulegrd.addRequested = false;
                cmsModulegrd.replaceItem(cmsModulegrd.selectedItem.Id, response.Item);
                cmsModulegrd.gridOptions.fillData(cmsModulegrd.ListItems);
                cmsModulegrd.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsModulegrd.addRequested = false;
        });
    }


    cmsModulegrd.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsModulegrd.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsModulegrd.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsModulegrd.ListItems.indexOf(item);
                cmsModulegrd.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsModulegrd.ListItems.unshift(newItem);
    }

    cmsModulegrd.deleteRow = function () {
        if (buttonIsPressed) { return };

        if (!cmsModulegrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(cmsModulegrd.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'coremodule/GetOne', cmsModulegrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    cmsModulegrd.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'coremodule/delete', cmsModulegrd.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsModulegrd.replaceItem(cmsModulegrd.selectedItemForDelete.Id);
                            cmsModulegrd.gridOptions.fillData(cmsModulegrd.ListItems);
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

    cmsModulegrd.searchData = function () {
        cmsModulegrd.gridOptions.serachData();
    }

    cmsModulegrd.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'TitleML', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'ClassName', displayName: 'ClassName', sortable: true, type: 'string' },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' },
            { name: 'ModuleConfigAdminMainJson', displayName: 'تنظیمات ماژول', sortable: true, visible: 'cmsModulegrd.gridOptions.resultAccess.AccessEditField.indexOf("ModuleConfigAdminMainJson")>-1', template: '<a class="btn btn-success" ng-click="cmsModulegrd.openModuleConfigModalDefault(x)" title="مقداردهی"><i class="fa fa-pencil" aria-hidden="true"></i></a>' },
            // { name: 'ModuleConfigAdminMainJson', displayName: 'تنظیمات ماژول', sortable: true, visible: 'cmsModulegrd.gridOptions.resultAccess.AccessEditField.indexOf("ModuleConfigAdminMainJson")>-1', template: '<a ng-if="cmsModulegrd.gridOptions.resultAccess.AccessEditField.indexOf(\'ModuleConfigAdminMainJson\')>-1" class="btn btn-warning" ng-show="cmsModulegrd.gridOptions.resultAccess.AccessWatchRow" ng-click="cmsModulegrd.designForm(x, \'ModuleConfigAdminMainJsonForm\')" title="طراحی فرم"><i class="fa fa-paint-brush" aria-hidden="true"></i></a>&nbsp;<a ng-if="cmsModulegrd.gridOptions.resultAccess.AccessEditField.indexOf(\'ModuleConfigAdminMainJsonForm\')>-1" class="btn btn-success" ng-click="cmsModulegrd.openPreviewModal(x, \'ModuleConfigAdminMainJsonForm\', \'ModuleConfigAdminMainJson\')" title="مقداردهی"><i class="fa fa-pencil" aria-hidden="true"></i></a>' },
            // { name: 'ModuleConfigSiteAccessDefaultJson', displayName: 'تنظیمات دسترسی', sortable: true, visible: 'cmsModulegrd.gridOptions.resultAccess.AccessEditField.indexOf("ModuleConfigSiteAccessDefaultJson")>-1', template: '<a ng-if="cmsModulegrd.gridOptions.resultAccess.AccessEditField.indexOf(\'ModuleConfigSiteAccessDefaultJson\')>-1" class="btn btn-warning" ng-show="cmsModulegrd.gridOptions.resultAccess.AccessWatchRow" ng-click="cmsModulegrd.designForm(x, \'ModuleConfigSiteAccessJsonFrom\')" title="طراحی فرم\"><i class=\"fa fa-paint-brush\" aria-hidden="true"></i></a>&nbsp;<a  ng-if="cmsModulegrd.gridOptions.resultAccess.AccessEditField.indexOf(\'ModuleConfigSiteJsonForm\')>-1" class="btn btn-success" ng-click="cmsModulegrd.openPreviewModal(x, \'ModuleConfigSiteAccessJsonFrom\', \'ModuleConfigSiteAccessDefaultJson\')" title="مقداردهی"><i class=\"fa fa-pencil\" aria-hidden="true"></i></a>' },
            // { name: 'ModuleConfigSiteDefaultJson', displayName: 'تنظیمات سایت', sortable: true, template: '<a ng-if="cmsModulegrd.gridOptions.resultAccess.AccessEditField.indexOf(\'ModuleConfigSiteJsonForm\')>-1" class="btn btn-warning" ng-show="cmsModulegrd.gridOptions.resultAccess.AccessWatchRow" ng-click="cmsModulegrd.designForm(x, \'ModuleConfigSiteJsonForm\')" title="طراحی فرم"><i class="fa fa-paint-brush" aria-hidden="true"></i></a>&nbsp;<a ng-if="cmsModulegrd.gridOptions.resultAccess.AccessEditField.indexOf(\'ModuleConfigSiteDefaultJson\')>-1" class="btn btn-success" ng-click="cmsModulegrd.openPreviewModal(x, \'ModuleConfigSiteJsonForm\', \'ModuleConfigSiteDefaultJson\')" title="مقداردهی"><i class=\"fa fa-pencil\" aria-hidden="true"></i></a>' },
            // { name: 'ModuleSiteStorageValuesJsonForm', displayName: 'مقادیر موردنیاز', sortable: true, visible: 'cmsModulegrd.gridOptions.resultAccess.AccessEditField.indexOf("ModuleSiteStorageValuesJsonForm")>-1', type: 'string', template: '<a ng-if="cmsModulegrd.gridOptions.resultAccess.AccessEditField.indexOf(\'ModuleSiteStorageValuesJsonForm\')>-1" class="btn btn-warning" ng-show="cmsModulegrd.gridOptions.resultAccess.AccessWatchRow" ng-click="cmsModulegrd.designForm(x, \'ModuleSiteStorageValuesJsonForm\')" title="طراحی فرم"><i class="fa fa-paint-brush" aria-hidden="true"></i></a>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "Id",
                SortType: 1,
                NeedToRunFakePagination: false,
                TotalRowData: 2000,
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: [],
                Count: false
            }
        }
    }

    cmsModulegrd.gridOptions.reGetAll = function () {
        cmsModulegrd.init();
    }

    cmsModulegrd.columnCheckbox = false;

    cmsModulegrd.openModuleConfigModalDefault = function (module) {
        if (module == undefined || cmsModulegrd.gridOptions.selectedRow == undefined || cmsModulegrd.gridOptions.selectedRow.item == undefined) {

            return;
        }
        cmsModulegrd.Item={};
        cmsModulegrd.Item.SiteStorage = {};
        cmsModulegrd.Item.AdminMain = {};
        cmsModulegrd.Item.SiteDefault = {};
        cmsModulegrd.Item.Site = {};
        cmsModulegrd.Item.SiteAccessDefault = {};
        cmsModulegrd.ModuleConfigSelected = module;
        if ($rootScope.tokenInfo && $rootScope.tokenInfo.Item.UserAccessAdminAllowToProfessionalData) {
            cmsModulegrd.AdminMainLoad();
            cmsModulegrd.SiteDefaultLoad();
            cmsModulegrd.SiteAccessDefaultLoad();
        }
        
        $modal.open({
            templateUrl:'cpanelv1/Module' + cmsModulegrd.ModuleConfigSelected.ClassName + '/Config/ModuleDefault.html',
            scope: $scope
        });
    }
  

    cmsModulegrd.SiteAccessDefaultLoad = function () {
        cmsModulegrd.contentBusyConfig.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath + cmsModulegrd.ModuleConfigSelected.ClassName + "Configuration/SiteAccessDefault", '', 'GET').success(function (response) {
            if (response.IsSuccess) {
                cmsModulegrd.Item.SiteAccessDefault = response.Item;
            } else {
                rashaErManage.showMessage(response.ErrorMessage);
            }
            cmsModulegrd.contentBusyConfig.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsModulegrd.contentBusyConfig.isActive = false;
        });
    }
    cmsModulegrd.SiteAccessDefaultSave = function (frm) {
        if (buttonIsPressed) {
            return;
        }
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        cmsModulegrd.contentBusyConfig.isActive = true;
        cmsModulegrd.buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath + cmsModulegrd.ModuleConfigSelected.ClassName + 'Configuration/SiteAccessDefault', cmsModulegrd.Item.SiteAccessDefault, 'POST').success(function (response) {
            cmsModulegrd.buttonIsPressed = false;
            cmsModulegrd.contentBusyConfig.isActive = false;
            rashaErManage.showMessage("تغییرات با موفقیت انجام شد");
            rashaErManage.checkAction(response);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsModulegrd.buttonIsPressed = false;
            cmsModulegrd.contentBusyConfig.isActive = false;
        });
    }

    cmsModulegrd.AdminMainLoad = function () {

        cmsModulegrd.contentBusyConfig.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath + cmsModulegrd.ModuleConfigSelected.ClassName + "Configuration/AdminMain", '', 'GET').success(function (response) {
            if (response.IsSuccess) {
                cmsModulegrd.Item.AdminMain = response.Item;
            } else {
                rashaErManage.showMessage(response.ErrorMessage);
            }
            cmsModulegrd.contentBusyConfig.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsModulegrd.contentBusyConfig.isActive = false;
        });
    }
    cmsModulegrd.AdminMainSave = function (frm) {
        if (buttonIsPressed) {
            return;
        }
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        cmsModulegrd.contentBusyConfig.isActive = true;
        cmsModulegrd.buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath + cmsModulegrd.ModuleConfigSelected.ClassName + 'Configuration/AdminMain', cmsModulegrd.Item.AdminMain, 'POST').success(function (response) {
            cmsModulegrd.buttonIsPressed = false;
            cmsModulegrd.contentBusyConfig.isActive = false;
            rashaErManage.showMessage("تغییرات با موفقیت انجام شد");
            rashaErManage.checkAction(response);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsModulegrd.buttonIsPressed = false;
            cmsModulegrd.contentBusyConfig.isActive = false;
        });
    }

    cmsModulegrd.SiteDefaultLoad = function () {
        cmsModulegrd.contentBusyConfig.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath + cmsModulegrd.ModuleConfigSelected.ClassName + "Configuration/SiteDefault", '', 'GET').success(function (response) {
            if (response.IsSuccess) {
                cmsModulegrd.Item.SiteDefault = response.Item;
            } else {
                rashaErManage.showMessage(response.ErrorMessage);
            }
            cmsModulegrd.contentBusyConfig.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsModulegrd.contentBusyConfig.isActive = false;
        });
    }
    cmsModulegrd.SiteDefaultSave = function (frm) {
        if (buttonIsPressed) {
            return;
        }
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        cmsModulegrd.contentBusyConfig.isActive = true;
        cmsModulegrd.buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath + cmsModulegrd.ModuleConfigSelected.ClassName + 'Configuration/SiteDefault', cmsModulegrd.Item.SiteDefault, 'POST').success(function (response) {
            cmsModulegrd.buttonIsPressed = false;
            cmsModulegrd.contentBusyConfig.isActive = false;
            rashaErManage.showMessage("تغییرات با موفقیت انجام شد");
            rashaErManage.checkAction(response);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsModulegrd.buttonIsPressed = false;
            cmsModulegrd.contentBusyConfig.isActive = false;
        });
    }




    cmsModulegrd.scrollToFormBuilder = function (item) {
        cmsModulegrd.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MobilecmsModulegrd/GetOne', item.Id, 'GET').success(function (response) {
            cmsModulegrd.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            cmsModulegrd.selectedItem = response.Item;

            $builder.removeAllFormObject('default');
            var component = parseJSONcomponent(cmsModulegrd.selectedItem.JsonForm);
            if (component != null && component.length != undefined)
                $.each(component, function (i, item) {
                    try {
                        $builder.addFormObject('default', item);
                    } catch (e) {
                    }
                });
            $("#inputValue_formBuilder").css("display", "");
            $('html, body').animate({
                scrollTop: $("#inputValue_formBuilder").offset().top
            }, 850);
        }).error(function (data, errCode, c, d) {
            cmsModulegrd.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    cmsModulegrd.getFromSystem = function () {
        // Get selected Layout to load form using JsonFormFormat in ViewModel
        var model = { Filters: [] };
        model.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: parseInt(cmsModulegrd.selectedItem.Id) });
        cmsModulegrd.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'coremodule/GetOneWithModuleConfig', model, 'POST').success(function (response) {
            cmsModulegrd.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                $builder.removeAllFormObject('default');
                //var customizeValue = JSON.parse(response.Item.JsonFormFormat);
                //var formatter = cmsModulegrd.formName+ "Formatter";
                var customizeValue = response.Item[cmsModulegrd.formName + 'Formatter'];
                if (customizeValue != null && customizeValue.length > 0) {
                    $.each(customizeValue, function (i, item) {
                        if (item.FieldName != undefined && item.FieldName != null && item.FieldName != "") {
                            var fieldType = "";
                            if (item.FieldType == "System.Boolean") {
                                fieldType = "radio";
                                $builder.addFormObject('default', {
                                    "component": fieldType,
                                    "label": item.FieldTitle,
                                    "description": item.FieldDescription,
                                    "fieldname": item.FieldName,
                                    "options": [
                                          "True",
                                          "False"
                                    ]
                                });
                            }
                            else {
                                fieldType = "text";
                                $builder.addFormObject('default', {
                                    "component": fieldType,
                                    "label": item.FieldTitle,
                                    "description": item.FieldDescription,
                                    "fieldname": item.FieldName,
                                });
                            }
                        }
                    });
                }
            }
            cmsModulegrd.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsModulegrd.busyIndicator.isActive = false;
        });
    }

    cmsModulegrd.openPreviewModal = function (item, formName, fieldName) {
        cmsModulegrd.fieldName = fieldName;
        cmsModulegrd.formName = formName;
        // Get selected Layout to load form using JsonFormFormat in ViewModel
        var model = { Filters: [] };
        model.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: parseInt(item.Id) });
        cmsModulegrd.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'coremodule/GetOneWithModuleConfig', model, 'POST').success(function (response) {
            cmsModulegrd.busyIndicator.isActive = false;
            cmsModulegrd.selectedLayoutValue = response.Item;

            cmsModulegrd.formJson = $builder.forms['default'];
            $builder.removeAllFormObject('default');

            // Clear privous values in formBuilder
            var values = [];
            if (response.Item[fieldName] != null && response.Item[fieldName] != "") {
                values = $.parseJSON(response.Item[fieldName]);
            }
            var component = $.parseJSON(response.Item[formName]);
            if (component != null && component.length != undefined)
                $.each(component, function (i, item) {
                    try {
                        $builder.addFormObject('default', item);
                        //تخصیص مقادیر فرم با تشخیص نام فیلد
                        if (values != null && values.length != undefined)
                            $.each(values, function (iValue, itemValue) {
                                if (item.fieldname == itemValue.fieldname)
                                    cmsModulegrd.defaultValue[i] = itemValue.value;
                            });
                    }
                    catch (exception) {
                    }
                });
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/CmsModule/preview.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    cmsModulegrd.designForm = function (item, formName) {
        cmsModulegrd.formName = formName;
        cmsModulegrd.busyIndicator.isActive = true;
        var model = { Filters: [] };
        model.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: parseInt(item.Id) });
        ajax.call(cmsServerConfig.configApiServerPath+'coremodule/GetOneWithModuleConfig', model, 'POST').success(function (response) {
            cmsModulegrd.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            cmsModulegrd.selectedItem = response.Item;

            $builder.removeAllFormObject('default');
            var component = [];
            if (cmsModulegrd.selectedItem[formName] != null && cmsModulegrd.selectedItem[formName] != "")
                component = angular.fromJson(cmsModulegrd.selectedItem[formName]);
            if (component != null && component.length != undefined)
                $.each(component, function (i, item) {
                    try {
                        $builder.addFormObject('default', item);
                    } catch (e) {
                    }
                });
            $("#inputValue_formBuilder").css("display", "");
            $('html, body').animate({
                scrollTop: $("#inputValue_formBuilder").offset().top
            }, 850);

        }).error(function (data, errCode, c, d) {
            cmsModulegrd.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    cmsModulegrd.saveJsonForm = function () {
        var model = { Filters: [] };
        model.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: parseInt(cmsModulegrd.selectedItem.Id) });
        cmsModulegrd.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'coremodule/GetOneWithModuleConfig', model, 'POST').success(function (response1) {
            cmsModulegrd.busyIndicator.isActive = false;
            rashaErManage.checkAction(response1);
            cmsModulegrd.selectedItem = response1.Item;
            // $builder.forms['default'] -> get the form in Json format
            cmsModulegrd.selectedItem[cmsModulegrd.formName] = $.trim(angular.toJson($builder.forms['default']));
            cmsModulegrd.busyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+'coremodule/edit', cmsModulegrd.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    cmsModulegrd.closeModal();
                }
                cmsModulegrd.busyIndicator.isActive = false;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                cmsModulegrd.busyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            cmsModulegrd.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    cmsModulegrd.saveSubmitValues = function () {
        var model = { Filters: [] };
        model.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: parseInt(cmsModulegrd.gridOptions.selectedRow.item.Id) });
        cmsModulegrd.busyIndicator.isActive = true;
        cmsModulegrd.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'coremodule/GetOneWithModuleConfig', model, 'POST').success(function (response1) {
            rashaErManage.checkAction(response1);
            cmsModulegrd.selectedItem = response1.Item;
            cmsModulegrd.selectedItem[cmsModulegrd.fieldName] = $.trim(angular.toJson(cmsModulegrd.submitValue));
            ajax.call(cmsServerConfig.configApiServerPath+'coremodule/edit', cmsModulegrd.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    cmsModulegrd.closeModal();
                }
                cmsModulegrd.busyIndicator.isActive = false;
                cmsModulegrd.addRequested = false;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                cmsModulegrd.busyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            cmsModulegrd.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Export Report 
    cmsModulegrd.exportFile = function () {
        cmsModulegrd.addRequested = true;
        cmsModulegrd.gridOptions.advancedSearchData.engine.ExportFile = cmsModulegrd.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'coremodule/exportfile', cmsModulegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                cmsModulegrd.closeModal();
            }
            cmsModulegrd.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    cmsModulegrd.toggleExportForm = function () {
        cmsModulegrd.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'Random', value: 3 }
        ];
        cmsModulegrd.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        cmsModulegrd.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'فایل منیجر', value: 3 }
        ];
        cmsModulegrd.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCore/CmsModule/report.html',
            scope: $scope
        });
    }
    //Row Count Input Change
    cmsModulegrd.rowCountChanged = function () {
        if (!angular.isDefined(cmsModulegrd.ExportFileClass.RowCount) || cmsModulegrd.ExportFileClass.RowCount > 2000)
            cmsModulegrd.ExportFileClass.RowCount = 2000;
    }
    //Get TotalRowCount
    cmsModulegrd.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"CoreModule/count", cmsModulegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsModulegrd.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            cmsModulegrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);