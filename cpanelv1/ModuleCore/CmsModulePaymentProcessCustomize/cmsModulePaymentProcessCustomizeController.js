app.controller("cmsModulePaymentProcessCustomizeCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$builder', '$stateParams', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $builder, $stateParams, $state, $filter) {
    var cmsMdlPayPrcCust = this;
    cmsMdlPayPrcCust.cmsModulesListItems = [];

    
    
    if (itemRecordStatus) cmsMdlPayPrcCust.itemRecordStatus = itemRecordStatus;
    cmsMdlPayPrcCust.changeState = function(state) {
        $state.go("index." + state);
    }
    // Show Category Loading Indicator
    cmsMdlPayPrcCust.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    cmsMdlPayPrcCust.selectedModulePaymentProcess = {
        Id: $stateParams.cmsMdlPayPrcId
    };
    cmsMdlPayPrcCust.init = function () {
        if (cmsMdlPayPrcCust.selectedModulePaymentProcess.Id == 0 || cmsMdlPayPrcCust.selectedModulePaymentProcess.Id == null) {
            $state.go("index.cmsmodulepaymentprocess");
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcess/GetOne', cmsMdlPayPrcCust.selectedModulePaymentProcess.Id, 'GET').success(function(response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            cmsMdlPayPrcCust.selectedModulePaymentProcess = response.Item;
        }).error(function(data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });

        cmsMdlPayPrcCust.busyIndicator.isActive = true;
        var filterModel = {
            PropertyName: "LinkModulePaymentProcessId",
            SearchType: 0,
            IntValue1: cmsMdlPayPrcCust.selectedModulePaymentProcess.Id
        };
        cmsMdlPayPrcCust.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
        ajax.call(cmsServerConfig.configApiServerPath+"CoreModulePaymentProcessCustomize/getall", cmsMdlPayPrcCust.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            cmsMdlPayPrcCust.ListItems = response.ListItems;
            //cmsModuleSitegrd.gridOptions.resultAccess = response.resultAccess;//دسترسی ها نمایش
            cmsMdlPayPrcCust.gridOptions.fillData(cmsMdlPayPrcCust.ListItems, response.resultAccess); // Send Access as an arguman
            cmsMdlPayPrcCust.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsMdlPayPrcCust.gridOptions.totalRowCount = response.TotalRowCount;
            cmsMdlPayPrcCust.gridOptions.rowPerPage = response.RowPerPage;
            cmsMdlPayPrcCust.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
            cmsMdlPayPrcCust.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"CoreModule/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsMdlPayPrcCust.cmsModulesListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"CoreModulePaymentProcess/getAll", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsMdlPayPrcCust.cmsModulesPaymentProcessListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }

    cmsMdlPayPrcCust.addRequested = false;

    cmsMdlPayPrcCust.openAddModal = function () {
        cmsMdlPayPrcCust.modalTitle = 'اضافه';
        cmsMdlPayPrcCust.isLoading = true;
        cmsMdlPayPrcCust.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcessCustomize/GetViewModel', '', 'GET').success(function (response) {
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            cmsMdlPayPrcCust.selectedItem = response.Item;
            cmsMdlPayPrcCust.selectedItem.LinkModuleId = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsModulePaymentProcessCustomize/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    cmsMdlPayPrcCust.autoAdd = function () {
        cmsMdlPayPrcCust.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcessCustomize/AutoAdd', '', 'POST').success(function (response) {
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            cmsMdlPayPrcCust.init();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    //Add New Content
    cmsMdlPayPrcCust.addNewRow = function (frm) {
        if (frm.$invalid)
            return;
        cmsMdlPayPrcCust.addRequested = true;
        cmsMdlPayPrcCust.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcessCustomize/add', cmsMdlPayPrcCust.selectedItem, 'POST').success(function (response) {
            cmsMdlPayPrcCust.addRequested = false;
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsMdlPayPrcCust.ListItems.unshift(response.Item);
                cmsMdlPayPrcCust.gridOptions.fillData(cmsMdlPayPrcCust.ListItems);
                cmsMdlPayPrcCust.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsMdlPayPrcCust.addRequested = false;
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
        });
    }

    // Open Edit Modal
    cmsMdlPayPrcCust.openEditModal = function () {
        cmsMdlPayPrcCust.modalTitle = 'ویرایش';
        if (!cmsMdlPayPrcCust.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        cmsMdlPayPrcCust.busyIndicator.isActive = true;
        cmsMdlPayPrcCust.isLoading = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcessCustomize/GetOne', cmsMdlPayPrcCust.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            cmsMdlPayPrcCust.selectedItem = response.Item;
            cmsMdlPayPrcCust.selectedItem.LinkModuleId = null;
            cmsMdlPayPrcCust.LoadModuleOfPaymentProcess(cmsMdlPayPrcCust.gridOptions.selectedRow.item.LinkModulePaymentProcessId);
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsModulePaymentProcessCustomize/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    cmsMdlPayPrcCust.editRow = function (frm) {
        if (frm.$invalid)
            return;
        var myControlerAdd = "";
        if (cmsMdlPayPrcCust.selectedItem.AutoEdit) myControlerAdd = "Auto";
        ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcessCustomize/edit' + myControlerAdd, cmsMdlPayPrcCust.selectedItem, 'PUT').success(function (response) {
            cmsMdlPayPrcCust.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsMdlPayPrcCust.addRequested = false;
                cmsMdlPayPrcCust.replaceItem(cmsMdlPayPrcCust.selectedItem.Id, response.Item);
                cmsMdlPayPrcCust.gridOptions.fillData(cmsMdlPayPrcCust.ListItems);
                cmsMdlPayPrcCust.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsMdlPayPrcCust.addRequested = false;
        });
    }

    cmsMdlPayPrcCust.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsMdlPayPrcCust.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsMdlPayPrcCust.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsMdlPayPrcCust.ListItems.indexOf(item);
                cmsMdlPayPrcCust.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsMdlPayPrcCust.ListItems.unshift(newItem);
    }

    cmsMdlPayPrcCust.deleteRow = function () {
        if (!cmsMdlPayPrcCust.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(cmsMdlPayPrcCust.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcessCustomize/GetOne', cmsMdlPayPrcCust.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsMdlPayPrcCust.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcessCustomize/delete', cmsMdlPayPrcCust.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsMdlPayPrcCust.replaceItem(cmsMdlPayPrcCust.selectedItemForDelete.Id);
                            cmsMdlPayPrcCust.gridOptions.fillData(cmsMdlPayPrcCust.ListItems);
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

    cmsMdlPayPrcCust.searchData = function () {
        cmsMdlPayPrcCust.gridOptions.serachData();
    }

    cmsMdlPayPrcCust.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'TitleEn', displayName: 'نام کلاس', sortable: true, type: 'string' },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' },
            { name: 'virtual_CmsModulePaymentProcess.ProcessName', displayName: 'نام فعّالیت', sortable: true, type: 'link', displayForce: true },
            { name: 'ActionButton1', displayName: 'عملیات ادمین', sortable: true, displayForce: true, width: '140px', template: '<button class="btn btn-success" ng-show="cmsMdlPayPrcCust.gridOptions.resultAccess.AccessAddField.indexOf(\'InputFormMainAdminClassJsonForm\')>-1" ng-click="cmsMdlPayPrcCust.scrollToFormBuilderMainAdmin(x)" title="طرّاحی مقادیر وردوی" type="button"><i class="fa fa-bars fa-1x" aria-hidden="true"></i></button>&nbsp;<button class="btn btn-warning" ng-show="cmsMdlPayPrcCust.gridOptions.resultAccess.AccessAddField.indexOf(\'InputFormMainAdminClassJsonFormValues\')>-1" title="مقداردهی" ng-click="cmsMdlPayPrcCust.showFormMainAdmin(\'false\',x.Id)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>' },
            { name: 'ActionButton2', displayName: 'عملیات ادمین سایت', sortable: true, displayForce: true, width: '140px', template: '<button class="btn btn-success" ng-show="cmsMdlPayPrcCust.gridOptions.resultAccess.AccessAddField.indexOf(\'InputFormSiteAdminClassJsonForm\')>-1" ng-click="cmsMdlPayPrcCust.scrollToFormBuilderSiteAdmin(x)" title="طرّاحی مقادیر وردوی" type="button"><i class="fa fa-bars fa-1x" aria-hidden="true"></i></button>&nbsp;<button class="btn btn-warning" ng-show="cmsMdlPayPrcCust.gridOptions.resultAccess.AccessAddField.indexOf(\'InputFormSiteAdminClassJsonFormValues\')>-1" title="مقداردهی" ng-click="cmsMdlPayPrcCust.showForm(\'false\',x.Id)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>' },
            { name: 'ActionButton3', displayName: 'عملیات کاربر', sortable: true, displayForce: true, width: '140px', template: '<button class="btn btn-success" ng-show="cmsMdlPayPrcCust.gridOptions.resultAccess.AccessAddField.indexOf(\'InputFormEndUserClassJsonForm\')>-1" ng-click="cmsMdlPayPrcCust.scrollToFormBuilderEndUser(x)" title="طرّاحی مقادیر وردوی" type="button"><i class="fa fa-bars fa-1x" aria-hidden="true"></i></button>&nbsp;<button class="btn btn-warning" ng-show="cmsMdlPayPrcCust.gridOptions.resultAccess.AccessAddField.indexOf(\'InputFormEndUserClassJsonFormValues\')>-1" title="مقداردهی" ng-click="cmsMdlPayPrcCust.showFormEndUser(\'false\',x.Id)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>' }
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

    cmsMdlPayPrcCust.gridOptions.reGetAll = function () {
        cmsMdlPayPrcCust.init();
    }
    
    cmsMdlPayPrcCust.gridOptions.onRowSelected = function () { }

    cmsMdlPayPrcCust.onModuleChange = function (moduleId) {
        cmsMdlPayPrcCust.cmsModulesPaymentProcessListItems = []; // Clear previous values
        var Filter_value = {
            PropertyName: "LinkModuleId",
            SearchType: 0,
            IntValue1: parseInt(moduleId)
        }
        cmsMdlPayPrcCust.gridOptions.advancedSearchData.engine.Filters = null;
        cmsMdlPayPrcCust.gridOptions.advancedSearchData.engine.Filters = [];
        cmsMdlPayPrcCust.gridOptions.advancedSearchData.engine.Filters.push(Filter_value);
        cmsMdlPayPrcCust.busyIndicator = true;
        cmsMdlPayPrcCust.isLoading = true;
        ajax.call(cmsServerConfig.configApiServerPath+"CoreModulePaymentProcess/GetAll", cmsMdlPayPrcCust.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            cmsMdlPayPrcCust.busyIndicator = false;
            cmsMdlPayPrcCust.isLoading = false;
            rashaErManage.checkAction(response);
            cmsMdlPayPrcCust.cmsModulesPaymentProcessListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            cmsMdlPayPrcCust.busyIndicator = false;
            console.log(data);
        });
    }

    cmsMdlPayPrcCust.LoadModuleOfPaymentProcess = function (modulePaymentProcessId) {
        if (modulePaymentProcessId != null) {
            cmsMdlPayPrcCust.selectedItem.selectedModule = null;
            cmsMdlPayPrcCust.isLoading = true;
            ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcess/GetOne', modulePaymentProcessId, 'GET').success(function (response1) {
                rashaErManage.checkAction(response1);
                ajax.call(cmsServerConfig.configApiServerPath+'CoreModule/GetOne', response1.Item.LinkModuleId, 'GET').success(function (response2) {
                    rashaErManage.checkAction(response2);
                    cmsMdlPayPrcCust.isLoading = false;
                    cmsMdlPayPrcCust.selectedItem.LinkModuleId = response2.Item.Id;
                    cmsMdlPayPrcCust.selectedItem.LinkModulePaymentProcessId = modulePaymentProcessId;
                    //cmsMdlPayPrcCust.LoadcmsModulesPaymentProcessListItems(cmsMdlPayPrcCust.selectedItem.LinkModuleId);
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                console.log(data);
            });
        }
    }

    cmsMdlPayPrcCust.LoadPaymentProcessInputCustomizeValue = function (modulePaymentProcessId) {
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Show InputValue form builder and auto scroll to its position Admin form
    cmsMdlPayPrcCust.scrollToFormBuilderMainAdmin = function (item) {
        cmsMdlPayPrcCust.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcessCustomize/GetOne', item.Id, 'GET').success(function (response) {
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            cmsMdlPayPrcCust.selectedItem = response.Item;
            $builder.removeAllFormObject('default');
            var component = $.parseJSON(cmsMdlPayPrcCust.selectedItem.InputFormMainAdminClassJsonForm);
            if (component != null && component.length != undefined)
                $.each(component, function (i, item) {
                    try {
                        $builder.addFormObject('default', item);
                    } catch (e) {

                    }
                });
            $("#inputValue_formBuilderMainAdmin").css("display", "");
            $("#inputValue_formBuilderEndUser").css("display", "none");
            $("#inputValue_formBuilderSiteAdmin").css("display", "none");
            $('html, body').animate({
                scrollTop: $("#inputValue_formBuilderMainAdmin").offset().top
            }, 850);
        }).error(function (data, errCode, c, d) {
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Show Preview form
    cmsMdlPayPrcCust.showFormMainAdmin = function (preview, selectedId) {
        cmsMdlPayPrcCust.showSaveButton = false;
        if (preview == "false") {
            cmsMdlPayPrcCust.showSaveButton = true;
            ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcessCustomize/GetOne', selectedId, 'GET').success(function (response) {
                cmsMdlPayPrcCust.busyIndicator.isActive = false;
                rashaErManage.checkAction(response);
                cmsMdlPayPrcCust.selectedItem = response.Item;
                $builder.removeAllFormObject('defaultMainAdmin');
                cmsMdlPayPrcCust.defaultValueMainAdmin = {};
                var component = $.parseJSON(cmsMdlPayPrcCust.selectedItem.InputFormMainAdminClassJsonForm);
                // Load and set the values from ProcessesJson.newProcess.ProcessCustomizationInputValue
                var values = []; 
                if (cmsMdlPayPrcCust.selectedItem.InputFormMainAdminClassJsonFormValues != null && cmsMdlPayPrcCust.selectedItem.InputFormMainAdminClassJsonFormValues != undefined &&
                    cmsMdlPayPrcCust.selectedItem.InputFormMainAdminClassJsonFormValues.length>0)
                 values =  $.parseJSON(cmsMdlPayPrcCust.selectedItem.InputFormMainAdminClassJsonFormValues);
                if (component != null && component.length != undefined)
                    $.each(component, function (i, item) {
                        $builder.addFormObject('defaultMainAdmin', item);
                        //تخصیص مقادیر فرم با تشخیص نام فیلد
                        if (values != null && values.length != undefined)
                            $.each(values, function (iValue, itemValue) {
                                if (item.fieldname == itemValue.fieldname) {
                                    $builder.forms.defaultMainAdmin[i].id = i;
                                    cmsMdlPayPrcCust.defaultValueMainAdmin[i] = itemValue.value;
                                }
                            });
                    });


            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                cmsMdlPayPrcCust.busyIndicator.isActive = false;
            });
        }
        else {
            $builder.removeAllFormObject('defaultMainAdmin');
            cmsMdlPayPrcCust.defaultValueMainAdmin = $builder.forms['default'];
            $.each(cmsMdlPayPrcCust.defaultValueMainAdmin, function (i, item) {
                $builder.addFormObject('defaultMainAdmin', item);
            });
        }
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCore/cmsModulePaymentProcessCustomize/formMainAdmin.html',
            scope: $scope
        });
    }
    // Save Input Value Form
    cmsMdlPayPrcCust.saveJsonFormMainAdmin = function () {
        cmsMdlPayPrcCust.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcessCustomize/GetOne', cmsMdlPayPrcCust.selectedItem.Id, 'GET').success(function (response1) {
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
            rashaErManage.checkAction(response1);
            cmsMdlPayPrcCust.selectedItem = response1.Item;
            // $builder.forms['default'] -> get the form in Json format
            cmsMdlPayPrcCust.selectedItem.InputFormMainAdminClassJsonForm = $.trim(angular.toJson($builder.forms['default']));
            cmsMdlPayPrcCust.busyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcessCustomize/edit', cmsMdlPayPrcCust.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    cmsMdlPayPrcCust.closeModal();
                }
                cmsMdlPayPrcCust.busyIndicator.isActive = false;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                cmsMdlPayPrcCust.busyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    cmsMdlPayPrcCust.getFromSystemMainAdmin = function () {
        // Get selected Layout to load form using JsonFormFormat in ViewModel
        var model = { Filters: [] };
        model.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: parseInt(cmsMdlPayPrcCust.selectedItem.LinkModulePaymentProcessId) });
        cmsMdlPayPrcCust.addRequested = true;
        cmsMdlPayPrcCust.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcess/GetOneWithJsonFormatter', model, 'POST').success(function (response) {
            cmsMdlPayPrcCust.addRequested = false;
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                $builder.removeAllFormObject('default');
                //var customizeValue = JSON.parse(response.Item.ProcessInputValue);
                var customizeValue = response.Item.ProcessInputFormMainAdminClassJsonFormFormatter;
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
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
        });
    }

    cmsMdlPayPrcCust.saveSubmitValuesMainAdmin = function () {
        var updateMethod = "PUT";
        var updateMode = "edit";
        //if (cmsMdlPayPrcCust.updateMode == "add")
        //    updateMethod = "POST";
        cmsMdlPayPrcCust.addRequested = true;
        cmsMdlPayPrcCust.selectedItem.InputFormMainAdminClassJsonFormValues = ($.trim(angular.toJson(cmsMdlPayPrcCust.submitValueFormMainAdmin)));
        ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcessCustomize/' + updateMode, cmsMdlPayPrcCust.selectedItem, updateMethod).success(function (response) {
            rashaErManage.checkAction(response);
            cmsMdlPayPrcCust.addRequested = false;
            cmsMdlPayPrcCust.closeModal();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsMdlPayPrcCust.addRequested = false;
        });
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Show InputValue form builder and auto scroll to its position User form
    cmsMdlPayPrcCust.scrollToFormBuilderEndUser = function (item) {
        cmsMdlPayPrcCust.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcessCustomize/GetOne', item.Id, 'GET').success(function (response) {
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            cmsMdlPayPrcCust.selectedItem = response.Item;
            $builder.removeAllFormObject('default');
            var component = $.parseJSON(cmsMdlPayPrcCust.selectedItem.InputFormEndUserClassJsonForm);
            if (component != null && component.length != undefined)
                $.each(component, function (i, item) {
                    try {
                        $builder.addFormObject('default', item);
                    } catch (e) {

                    }
                });
            $("#inputValue_formBuilderEndUser").css("display", "");
            $("#inputValue_formBuilderMainAdmin").css("display", "none");
            $("#inputValue_formBuilderSiteAdmin").css("display", "none");
            $('html, body').animate({
                scrollTop: $("#inputValue_formBuilderMainAdmin").offset().top
            }, 850);
        }).error(function (data, errCode, c, d) {
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Show Preview form
    cmsMdlPayPrcCust.showFormEndUser = function (preview, selectedId) {
        cmsMdlPayPrcCust.showSaveButton = false;
        if (preview == "false") {
            cmsMdlPayPrcCust.showSaveButton = true;
            ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcessCustomize/GetOne', selectedId, 'GET').success(function (response) {
                cmsMdlPayPrcCust.busyIndicator.isActive = false;
                rashaErManage.checkAction(response);
                cmsMdlPayPrcCust.selectedItem = response.Item;
                $builder.removeAllFormObject('defaultEndUser');
                cmsMdlPayPrcCust.defaultValueEndUser = {};
                var component = $.parseJSON(cmsMdlPayPrcCust.selectedItem.InputFormEndUserClassJsonForm);
                // Load and set the values from ProcessesJson.newProcess.ProcessCustomizationInputValue
                var values = $.parseJSON(cmsMdlPayPrcCust.selectedItem.InputFormEndUserClassJsonFormValues);
                if (component != null && component.length != undefined)
                    $.each(component, function (i, item) {
                        $builder.addFormObject('defaultEndUser', item);
                        //تخصیص مقادیر فرم با تشخیص نام فیلد
                        if (values != null && values.length != undefined)
                            $.each(values, function (iValue, itemValue) {
                                if (item.fieldname == itemValue.fieldname) {
                                    $builder.forms.defaultEndUser[i].id = i;
                                    cmsMdlPayPrcCust.defaultValueEndUser[i] = itemValue.value;
                                }
                            });
                    });

            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                cmsMdlPayPrcCust.busyIndicator.isActive = false;
            });
        }
        else {
            $builder.removeAllFormObject('defaultEndUser');
            cmsMdlPayPrcCust.defaultValueEndUser = $builder.forms['default'];
            $.each(cmsMdlPayPrcCust.defaultValueEndUser, function (i, item) {
                $builder.addFormObject('defaultEndUser', item);
            });
        }
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCore/cmsModulePaymentProcessCustomize/formEndUser.html',
            scope: $scope
        });
    }
    // Save Input Value Form
    cmsMdlPayPrcCust.saveJsonFormEndUser = function () {
        cmsMdlPayPrcCust.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcessCustomize/GetOne', cmsMdlPayPrcCust.selectedItem.Id, 'GET').success(function (response1) {
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
            rashaErManage.checkAction(response1);
            cmsMdlPayPrcCust.selectedItem = response1.Item;
            // $builder.forms['default'] -> get the form in Json format
            cmsMdlPayPrcCust.selectedItem.InputFormEndUserClassJsonForm = $.trim(angular.toJson($builder.forms['default']));
            cmsMdlPayPrcCust.busyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcessCustomize/edit', cmsMdlPayPrcCust.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    cmsMdlPayPrcCust.closeModal();
                }
                cmsMdlPayPrcCust.busyIndicator.isActive = false;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                cmsMdlPayPrcCust.busyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    cmsMdlPayPrcCust.getFromSystemEndUser = function () {
        // Get selected Layout to load form using JsonFormFormat in ViewModel
        var model = { Filters: [] };
        model.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: parseInt(cmsMdlPayPrcCust.selectedItem.LinkModulePaymentProcessId) });
        cmsMdlPayPrcCust.addRequested = true;
        cmsMdlPayPrcCust.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcess/GetOneWithJsonFormatter', model, 'POST').success(function (response) {
            cmsMdlPayPrcCust.addRequested = false;
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                $builder.removeAllFormObject('default');
                //var customizeValue = JSON.parse(response.Item.ProcessInputValue);
                var customizeValue = response.Item.ProcessInputFormEndUserClassJsonFormFormatter;
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
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
        });
    }

    cmsMdlPayPrcCust.saveSubmitValuesEndUser = function () {
        var updateMethod = "PUT";
        var updateMode = "edit";
        //if (cmsMdlPayPrcCust.updateMode == "add")
        //    updateMethod = "POST";
        cmsMdlPayPrcCust.addRequested = true;
        cmsMdlPayPrcCust.selectedItem.InputFormEndUserClassJsonFormValues = ($.trim(angular.toJson(cmsMdlPayPrcCust.submitValueFormEndUser)));
        ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcessCustomize/' + updateMode, cmsMdlPayPrcCust.selectedItem, updateMethod).success(function (response) {
            rashaErManage.checkAction(response);
            cmsMdlPayPrcCust.addRequested = false;
            cmsMdlPayPrcCust.closeModal();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsMdlPayPrcCust.addRequested = false;
        });
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Show InputValue form builder and auto scroll to its position
    cmsMdlPayPrcCust.scrollToFormBuilderSiteAdmin = function (item) {
        cmsMdlPayPrcCust.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcessCustomize/GetOne', item.Id, 'GET').success(function (response) {
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            cmsMdlPayPrcCust.selectedItem = response.Item;
            $builder.removeAllFormObject('default');
            var component = $.parseJSON(cmsMdlPayPrcCust.selectedItem.InputFormSiteAdminClassJsonForm);
            if (component != null && component.length != undefined)
                $.each(component, function (i, item) {
                    try {
                        $builder.addFormObject('default', item);
                    } catch (e) {

                    }
                });
            $("#inputValue_formBuilderSiteAdmin").css("display", "");
            $("#inputValue_formBuilderEndUser").css("display", "none");
            $("#inputValue_formBuilderMainAdmin").css("display", "none");
            $('html, body').animate({
                scrollTop: $("#inputValue_formBuilderSiteAdmin").offset().top
            }, 850);
        }).error(function (data, errCode, c, d) {
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Show Preview form
    cmsMdlPayPrcCust.showFormSiteAdmin = function (preview, selectedId) {
        cmsMdlPayPrcCust.showSaveButton = false;
        if (preview == "false") {
            cmsMdlPayPrcCust.showSaveButton = true;
            ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcessCustomize/GetOne', selectedId, 'GET').success(function (response) {
                cmsMdlPayPrcCust.busyIndicator.isActive = false;
                rashaErManage.checkAction(response);
                cmsMdlPayPrcCust.selectedItem = response.Item;
                $builder.removeAllFormObject('default');
                cmsMdlPayPrcCust.defaultValueSiteAdmin = {};
                var component = $.parseJSON(cmsMdlPayPrcCust.selectedItem.InputFormSiteAdminClassJsonForm);
                // Load and set the values from ProcessesJson.newProcess.ProcessCustomizationInputValue
                var values = $.parseJSON(cmsMdlPayPrcCust.selectedItem.InputFormSiteAdminClassJsonFormValues);
                if (component != null && component.length != undefined)
                    $.each(component, function (i, item) {
                        $builder.addFormObject('default', item);
                        //تخصیص مقادیر فرم با تشخیص نام فیلد
                        if (values != null && values.length != undefined)
                            $.each(values, function (iValue, itemValue) {
                                if (item.fieldname == itemValue.fieldname) {
                                    $builder.forms.defaultSiteAdmin[i].id = i;
                                    cmsMdlPayPrcCust.defaultValueSiteAdmin[i] = itemValue.value;
                                }
                            });
                    });
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                cmsMdlPayPrcCust.busyIndicator.isActive = false;
            });
        }
        else {
            $builder.removeAllFormObject('defaultSiteAdmin');
            cmsMdlPayPrcCust.defaultValueSiteAdmin = $builder.forms['default'];
            $.each(cmsMdlPayPrcCust.defaultValueSiteAdmin, function (i, item) {
                $builder.addFormObject('defaultSiteAdmin', item);
            });
        }
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCore/cmsModulePaymentProcessCustomize/formSiteAdmin.html',
            scope: $scope
        });
    }
    // Save Input Value Form
    cmsMdlPayPrcCust.saveJsonFormSiteAdmin = function () {
        cmsMdlPayPrcCust.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcessCustomize/GetOne', cmsMdlPayPrcCust.selectedItem.Id, 'GET').success(function (response1) {
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
            rashaErManage.checkAction(response1);
            cmsMdlPayPrcCust.selectedItem = response1.Item;
            // $builder.forms['default'] -> get the form in Json format
            cmsMdlPayPrcCust.selectedItem.InputFormSiteAdminClassJsonForm = $.trim(angular.toJson($builder.forms['default']));
            cmsMdlPayPrcCust.busyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcessCustomize/edit', cmsMdlPayPrcCust.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    cmsMdlPayPrcCust.closeModal();
                }
                cmsMdlPayPrcCust.busyIndicator.isActive = false;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                cmsMdlPayPrcCust.busyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    cmsMdlPayPrcCust.getFromSystemSiteAdmin = function () {
        // Get selected Layout to load form using JsonFormFormat in ViewModel
        var model = { Filters: [] };
        model.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: parseInt(cmsMdlPayPrcCust.selectedItem.LinkModulePaymentProcessId) });
        cmsMdlPayPrcCust.addRequested = true;
        cmsMdlPayPrcCust.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcess/GetOneWithJsonFormatter', model, 'POST').success(function (response) {
            cmsMdlPayPrcCust.addRequested = false;
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                $builder.removeAllFormObject('default');
                //var customizeValue = JSON.parse(response.Item.ProcessInputValue);
                var customizeValue = response.Item.ProcessInputFormSiteAdminClassJsonFormFormatter;
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
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsMdlPayPrcCust.busyIndicator.isActive = false;
        });
    }

    cmsMdlPayPrcCust.saveSubmitValuesSiteAdmin = function () {
        var updateMethod = "PUT";
        var updateMode = "edit";
        //if (cmsMdlPayPrcCust.updateMode == "add")
        //    updateMethod = "POST";
        cmsMdlPayPrcCust.addRequested = true;
        cmsMdlPayPrcCust.selectedItem.InputFormSiteAdminClassJsonFormValues = ($.trim(angular.toJson(cmsMdlPayPrcCust.submitValueFormSiteAdmin)));
        ajax.call(cmsServerConfig.configApiServerPath+'CmsModulePaymentProcessCustomize/' + updateMode, cmsMdlPayPrcCust.selectedItem, updateMethod).success(function (response) {
            rashaErManage.checkAction(response);
            cmsMdlPayPrcCust.addRequested = false;
            cmsMdlPayPrcCust.closeModal();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsMdlPayPrcCust.addRequested = false;
        });
    }
}]);