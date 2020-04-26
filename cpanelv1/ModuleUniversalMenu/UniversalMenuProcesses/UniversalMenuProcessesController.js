app.controller("processGridController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$builder', '$validator', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $builder, $validator, $window, $filter) {
    var processCtrl = this;
    processCtrl.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    processCtrl.busyIndicatorForDropDownProcess = {
        isActive: false,
        message: "در حال بارگذاری فعالیت ها ..."
    }

    processCtrl.busyIndicatorForDropDownProcessCustomize = {
        isActive: false,
        message: "در حال بارگذاری  ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    //processCtrl.form = $builder.forms['default'];

    processCtrl.cmsModulesProcessesListItems = [];
    processCtrl.cmsModulesProcessesCustomizeListItems = [];
    processCtrl.cmsModulesListItems = [];
    if (itemRecordStatus != undefined) processCtrl.itemRecordStatus = itemRecordStatus;

    //processCtrl.cmsProcessesListItems = [];
    processCtrl.cmsModuleProcess = {};

    processCtrl.init = function () {
        processCtrl.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"UniversalMenuProcesses/getall", processCtrl.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            processCtrl.ListItems = response.ListItems;
            processCtrl.busyIndicator.isActive = false;
            //cmsModuleSitegrd.gridOptions.resultAccess = response.resultAccess;//دسترسی ها نمایش
            processCtrl.gridOptions.fillData(processCtrl.ListItems, response.resultAccess); // دسترسی ها نمایش
            processCtrl.gridOptions.currentPageNumber = response.CurrentPageNumber;
            processCtrl.gridOptions.totalRowCount = response.TotalRowCount;
            processCtrl.gridOptions.rowPerPage = response.RowPerPage;
            processCtrl.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            processCtrl.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            processCtrl.busyIndicator.isActive = false;
        });

        // Get All CmsModules
        ajax.call(cmsServerConfig.configApiServerPath+"CoreModule/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            processCtrl.cmsModulesListItems = response.ListItems;
            processCtrl.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            processCtrl.busyIndicator.isActive = false;
        });

        // Get ViewModel of CmsModuleProcess
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcess/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            processCtrl.cmsModuleProcess = response.Item;

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    processCtrl.addRequested = false;
    processCtrl.openAddModal = function () {
        if (buttonIsPressed) return;
        processCtrl.modalTitle = 'اضافه';
        processCtrl.busyIndicator.isActive = true;

        // Clear previous values
        if (processCtrl.selectedItem)
            processCtrl.selectedItem.LinkModuleId = null;
        if (processCtrl.selectedItem)
            processCtrl.selectedItem.LinkModuleProcessId = null;
        processCtrl.cmsModulesProcessesListItems = null;
        processCtrl.cmsModulesProcessesListItems = [];
        processCtrl.cmsModulesProcessesCustomizeListItems = null;
        processCtrl.cmsModulesProcessesCustomizeListItems = [];
        processCtrl.valueSubmit = null;
        $builder.removeAllFormObject('default');   // Clear the form builder from previous values
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'universalmenuProcesses/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            processCtrl.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            processCtrl.selectedItem = response.Item;

            $modal.open({
                templateUrl: 'cpanelv1/ModuleUniversalMenu/UniversalMenuProcesses/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Add New Row
    processCtrl.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        processCtrl.busyIndicator.isActive = true;
        processCtrl.addRequested = true;
        processCtrl.selectedItem.ProcessCustomizationInputValue = $.trim(angular.toJson(processCtrl.valueSubmit));
        ajax.call(cmsServerConfig.configApiServerPath+'universalmenuProcesses/add', processCtrl.selectedItem, 'POST').success(function (response) {
            processCtrl.addRequested = false;
            processCtrl.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                processCtrl.ListItems.unshift(response.Item);
                processCtrl.gridOptions.fillData(processCtrl.ListItems);
                processCtrl.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            processCtrl.addRequested = false;
            processCtrl.busyIndicator.isActive = false;
        });
    }

    // Open Edit Modal
    processCtrl.openEditModal = function () {
        processCtrl.modalTitle = 'ویرایش';

        if (!processCtrl.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        processCtrl.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'universalmenuProcesses/GetOne', processCtrl.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            processCtrl.addRequested = false;
            processCtrl.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            processCtrl.selectedItem = response.Item;
            processCtrl.selectedItem.LinkModuleId = null;
            processCtrl.selectedItem.LinkModuleProcessId = null;


            $builder.removeAllFormObject('default');   // فرم بیلدر را از مقادیر پیشین خالی می کند
            var length = processCtrl.cmsModulesProcessesCustomizeListItems.length;
            for (var i = 0; i < length; i++) {
                if (processCtrl.cmsModulesProcessesCustomizeListItems[i].Id == processCtrl.selectedItem.LinkModuleProcessCustomizeId) {
                    var component = $.parseJSON(processCtrl.cmsModulesProcessesCustomizeListItems[i].ProcessInputValueForm);
                    if (component != null && component.length != undefined)
                        $.each(component, function (i, item) {
                            $builder.addFormObject('default', item);
                        });
                }
            }
            // Load the form inside the edit modal
            var values = $.parseJSON(processCtrl.selectedItem.ProcessCustomizationInputValue);
            if (values.length != undefined)
                $.each(values, function (i, item) {
                    processCtrl.defaultValue[item.id] = item.value;
                });

            // Load CmsModuleProcessCustomize, CmsModuleProcess, CmsModule Backward
            processCtrl.LoadUniversalMenuProcessOfModuleProcessCustomize(processCtrl.gridOptions.selectedRow.item.LinkModuleProcessCustomizeId);

            // Open the modal
            $modal.open({
                templateUrl: 'cpanelv1/ModuleUniversalMenu/UniversalMenuProcesses/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            
            rashaErManage.checkAction(data, errCode);
            processCtrl.addRequested = false;
            processCtrl.busyIndicator.isActive = false;
        });

    }

    processCtrl.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        processCtrl.selectedItem.ProcessCustomizationInputValue = $.trim(angular.toJson(processCtrl.valueSubmit));
        ajax.call(cmsServerConfig.configApiServerPath+'universalmenuProcesses/edit', processCtrl.selectedItem, 'PUT').success(function (response) {
            processCtrl.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                processCtrl.addRequested = false;
                processCtrl.replaceItem(processCtrl.selectedItem.Id, response.Item);
                processCtrl.gridOptions.fillData(processCtrl.ListItems);
                processCtrl.closeModal();
            }
            else {
                if (ErrorMessage = "x.LinkSiteId != userTicket.LinkSiteId" && response.SetAsPublic)
                    rashaErManage.showMessage("این فعالیت عمومی است، امکان ویرایش برای آن وجود ندارد");
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            processCtrl.addRequested = false;
        });
    }

    processCtrl.closeModal = function () {
        $modalStack.dismissAll();
    };

    processCtrl.replaceItem = function (oldId, newItem) {
        angular.forEach(processCtrl.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = processCtrl.ListItems.indexOf(item);
                processCtrl.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            processCtrl.ListItems.unshift(newItem);
    }

    processCtrl.deleteRow = function () {
        if (!processCtrl.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        processCtrl.busyIndicator.isActive = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(processCtrl.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'universalmenuProcesses/GetOne', processCtrl.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    processCtrl.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'universalmenuProcesses/delete', processCtrl.selectedItemForDelete, 'POST').success(function (res) {
                        processCtrl.busyIndicator.isActive = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            processCtrl.replaceItem(processCtrl.selectedItemForDelete.Id);
                            processCtrl.gridOptions.fillData(processCtrl.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        processCtrl.busyIndicator.isActive = false;
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });
    }

    processCtrl.searchData = function () {
        processCtrl.gridOptions.serachData();
    }

    processCtrl.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    processCtrl.advancedSearchData = {};
    processCtrl.advancedSearchData.engine = {};
    processCtrl.advancedSearchData.engine.CurrentPageNumber = 1;
    processCtrl.advancedSearchData.engine.SortColumn = "Id";
    processCtrl.advancedSearchData.engine.SortType = 0;
    processCtrl.advancedSearchData.engine.NeedToRunFakePagination = false;
    processCtrl.advancedSearchData.engine.TotalRowData = 2000;
    processCtrl.advancedSearchData.engine.RowPerPage = 20;
    processCtrl.advancedSearchData.engine.ContentFullSearch = null;
    processCtrl.advancedSearchData.engine.Filters = [];

    processCtrl.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            processCtrl.focusExpireLockAccount = true;
        });
    };

    processCtrl.gridOptions.reGetAll = function () {
        processCtrl.init();
    }

    processCtrl.gridOptions.onRowSelected = function () { }

    // On Module Change Event
    processCtrl.onModuleChange = function (moduleId) {
        //processCtrl.PageDependenciesListItems = [];
        var filterValue = {
            PropertyName: "LinkModuleId",
            IntValue1: parseInt(moduleId),
            SearchType: 0
        }
        processCtrl.busyIndicatorForDropDownProcess = true;
        processCtrl.advancedSearchData.engine.Filters = null;
        processCtrl.advancedSearchData.engine.Filters = [];
        processCtrl.advancedSearchData.engine.Filters.push(filterValue);
        processCtrl.advancedSearchData.engine.RowPerPage = 200;
        processCtrl.isLoading = true;                 // غیرفعال کردن منوی کشویی بعدی
        processCtrl.isWaiting = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcess/getall', processCtrl.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            processCtrl.cmsModulesProcessesListItems = response.ListItems;
            processCtrl.isLoading = false;          // فعال کردن منوی کشویی بعدی
            if (processCtrl.cmsModulesProcessesListItems.length == 0) {
                processCtrl.selectedItem.LinkModuleProcessId = null;
                processCtrl.cmsModulesProcessesCustomizeListItems = [];
                processCtrl.selectedItem.LinkModuleProcessCustomizeId = null;
                processCtrl.selectedItem.ProcessCustomizationInputValue = null;
                $("#cmsModuleProcesses_comboBox").prop("selectedIndex", -1);
                $("#cmsModuleProcessesCustomize_comboBox").prop("selectedIndex", -1);
            }
        }).error(function (data, errCode, c, d) {
            processCtrl.busyIndicator = false;
            rashaErManage.checkAction(data, errCode);
            processCtrl.busyIndicatorForDropDownProcess = false;
        });
    }

    // On ModuleProcess Change Event
    processCtrl.LoadcmsModuleProcessCustomize = function (moduleProcessId) {

        // Clear the form in case there is no ModuleProcessCustomize
        $builder.removeAllFormObject('default');
        var filterValue = {
            PropertyName: "LinkModuleProcessId",
            IntValue1: parseInt(moduleProcessId),
            SearchType: 0
        }
        processCtrl.busyIndicatorForDropDownProcessCustomize = true;
        processCtrl.advancedSearchData.engine.Filters = null;
        processCtrl.advancedSearchData.engine.Filters = [];
        processCtrl.advancedSearchData.engine.Filters.push(filterValue);
        processCtrl.isWaiting = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcessCustomize/getall', processCtrl.advancedSearchData.engine, "POST").success(function (response) {
            processCtrl.isWaiting = false;
            rashaErManage.checkAction(response);
            processCtrl.cmsModulesProcessesCustomizeListItems = response.ListItems;
            processCtrl.busyIndicatorForDropDownProcessCustomize = false;

            if (processCtrl.cmsModulesProcessesCustomizeListItems.length == 0) {
                processCtrl.selectedItem.LinkModuleProcessCustomizeId = null;
                processCtrl.selectedItem.ProcessCustomizationInputValue = null;
                $("#cmsModuleProcessesCustomize_comboBox").prop("selectedIndex", -1);
            }
            //processCtrl.LoadProcessInputCustomizeValue(processCtrl.cmsModulesProcessesCustomizeListItems[0].Id);
            //processCtrl.LoadProcessInputCustomizeValue(processCtrl.selectedItem.LinkModuleProcessCustomizeId);
        }).error(function (data, errCode, c, d) {
            processCtrl.busyIndicator = false;
            rashaErManage.checkAction(data, errCode);
            processCtrl.busyIndicatorForDropDownProcessCustomize = false;
        });
    }

    processCtrl.gridOptions.reGetAll = function () {
        processCtrl.init();
    }

    // On ModuleProcessCustomize Change Event
    processCtrl.LoadProcessInputCustomizeValue = function (LinkModuleProcessCustomizeId) {
        $builder.removeAllFormObject('default');
        var length = processCtrl.cmsModulesProcessesCustomizeListItems.length;
        for (var i = 0; i < length; i++) {
            if (processCtrl.cmsModulesProcessesCustomizeListItems[i].Id == LinkModuleProcessCustomizeId) {
                var component = $.parseJSON(processCtrl.cmsModulesProcessesCustomizeListItems[i].ProcessInputValueForm);
                if (component != null && component.length != undefined)
                    $.each(component, function (i, item) {
                        $builder.addFormObject('default', item);
                    });
            }
        }
    }

    processCtrl.LoadUniversalMenuProcessOfModuleProcessCustomize = function (LinkModuleProcessCustomizeId) {
        // Get CmsModuleProcessCustomize
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcessCustomize/GetOne', LinkModuleProcessCustomizeId, "GET").success(function (response1) {
            processCtrl.selectedItem.LinkModuleProcessCustomizeId = response1.Item.Id;
            // Get CmsModuleProcess 
            ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcess/GetOne', response1.Item.LinkModuleProcessId, "GET").success(function (response2) {
                //rashaErManage.checkAction(response);
                processCtrl.selectedItem.LinkModuleProcessId = response2.Item.Id;
                for (var i = 0; i < processCtrl.cmsModulesListItems.length; i++) {
                    if (processCtrl.cmsModulesListItems[i].Id == response2.Item.LinkModuleId) {
                        processCtrl.selectedItem.LinkModuleId = processCtrl.cmsModulesListItems[i].Id;
                        processCtrl.onModuleChange(processCtrl.selectedItem.LinkModuleId);

                        //processCtrl.LoadcmsModuleProcessCustomize(processCtrl.selectedItem.LinkModuleProcessId);
                        var filterValue = {
                            PropertyName: "LinkModuleProcessId",
                            IntValue1: parseInt(processCtrl.selectedItem.LinkModuleProcessId),
                            SearchType: 0
                        }
                        processCtrl.busyIndicatorForDropDownProcessCustomize = true;
                        processCtrl.advancedSearchData.engine.Filters = null;
                        processCtrl.advancedSearchData.engine.Filters = [];
                        processCtrl.advancedSearchData.engine.Filters.push(filterValue);
                        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcessCustomize/getall', processCtrl.advancedSearchData.engine, "POST").success(function (response) {
                            rashaErManage.checkAction(response);
                            processCtrl.isWaiting = false;
                            processCtrl.cmsModulesProcessesCustomizeListItems = response.ListItems;
                            processCtrl.busyIndicatorForDropDownProcessCustomize = false;

                            $builder.removeAllFormObject('default');
                            var length = processCtrl.cmsModulesProcessesCustomizeListItems.length;
                            for (var j = 0; j < length; j++) {
                                if (processCtrl.cmsModulesProcessesCustomizeListItems[j].Id == LinkModuleProcessCustomizeId) {
                                    var component = $.parseJSON(processCtrl.cmsModulesProcessesCustomizeListItems[j].ProcessInputValueForm);
                                    if (component != null && component.length != undefined)
                                        $.each(component, function (i, item) {
                                            $builder.addFormObject('default', item);
                                        });
                                }
                            }
                            // Set values
                            angular.forEach($.parseJSON(processCtrl.selectedItem.ProcessCustomizationInputValue), function (item, key) {
                                processCtrl.defaultValue[item.id] = item.value;
                            });
                            if (processCtrl.cmsModulesProcessesCustomizeListItems.length == 0) {
                                processCtrl.selectedItem.LinkModuleProcessCustomizeId = null;
                                processCtrl.selectedItem.ProcessCustomizationInputValue = null;
                                $("#cmsModuleProcessesCustomize_comboBox").prop("selectedIndex", -1);
                            }
                        }).error(function (data, errCode, c, d) {
                            processCtrl.busyIndicator = false;
                            rashaErManage.checkAction(data, errCode);
                            processCtrl.busyIndicatorForDropDownProcessCustomize = false;
                        });
                        // Load FormBuilder
                        
                    }
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    processCtrl.valueSubmit = [];
    processCtrl.defaultValue = {};

    // Show InputValue form builder and auto scroll to its position
    processCtrl.openCustomizeInputValueModal = function (item) {

        processCtrl.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'universalmenuProcesses/GetOne', item.Id, 'GET').success(function (response) {
            processCtrl.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            processCtrl.selectedItem = response.Item;
            //processCtrl.defaultValue = $.parseJSON(processCtrl.selectedItem.ProcessCustomizationInputValue);
            //$scope.defaultValue = $.parseJSON(processCtrl.selectedItem.ProcessCustomizationInputValue);

            // Set values
            angular.forEach($.parseJSON(processCtrl.selectedItem.ProcessCustomizationInputValue), function (item, key) {
                processCtrl.defaultValue[item.id] = item.value;
            });

            $builder.removeAllFormObject('default');

            var length = processCtrl.cmsModulesProcessesCustomizeListItems.length;
            for (var i = 0; i < length; i++) {
                if (processCtrl.cmsModulesProcessesCustomizeListItems[i].Id == item.LinkModuleProcessCustomizeId) {
                    var component = $.parseJSON(processCtrl.cmsModulesProcessesCustomizeListItems[i].ProcessInputValueForm);
                    if (component != null && component.length != undefined)
                        $.each(component, function (i, item) {
                            $builder.addFormObject('default', item);
                        });
                }
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Show Preview form
    processCtrl.showSubmitValueForm = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleUniversalMenu/UniversalMenuProcesses/submitValueForm.html',
            scope: $scope
        });
    }

    processCtrl.submitValues = function (item) {
        processCtrl.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'universalmenuProcesses/GetOne', processCtrl.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            processCtrl.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            processCtrl.selectedItem = response.Item;
            processCtrl.selectedItem.LinkModuleId = null;
            processCtrl.selectedItem.LinkModuleProcessId = null;
            processCtrl.selectedItem.ProcessCustomizationInputValue = $.trim(angular.toJson(processCtrl.valueSubmit));
            ajax.call(cmsServerConfig.configApiServerPath+'universalmenuProcesses/', processCtrl.selectedItem, 'PUT').success(function (response) {
                processCtrl.addRequested = true;
                rashaErManage.checkAction(response);
                if (response.IsSuccess) {
                    processCtrl.addRequested = false;
                    processCtrl.replaceItem(processCtrl.selectedItem.Id, response.Item);
                    processCtrl.gridOptions.fillData(processCtrl.ListItems);
                    processCtrl.closeModal();
                }

            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                processCtrl.addRequested = false;
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });

        $("#inputValue_form").css("display", "none");
        $('html, body').animate({
            scrollTop: $("#inputValue_form").offset().top
        }, 850);
    }
    ///////////////////////
    processCtrl.columnCheckbox = false;
    processCtrl.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (processCtrl.gridOptions.columnCheckbox) {
            for (var i = 0; i < processCtrl.gridOptions.columns.length; i++) {
                //processCtrl.gridOptions.columns[i].visible = $("#" + processCtrl.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + processCtrl.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                processCtrl.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = processCtrl.gridOptions.columns;
            for (var i = 0; i < processCtrl.gridOptions.columns.length; i++) {
                processCtrl.gridOptions.columns[i].visible = true;
                var element = $("#" + processCtrl.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + processCtrl.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < processCtrl.gridOptions.columns.length; i++) {
            console.log(processCtrl.gridOptions.columns[i].name.concat(".visible: "), processCtrl.gridOptions.columns[i].visible);
        }
        processCtrl.gridOptions.columnCheckbox = !processCtrl.gridOptions.columnCheckbox;
    }
    //Export Report 
    processCtrl.exportFile = function () {
        processCtrl.addRequested = true;
        processCtrl.gridOptions.advancedSearchData.engine.ExportFile = processCtrl.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'universalmenuProcesses/exportfile', processCtrl.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            processCtrl.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                processCtrl.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //processCtrl.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    processCtrl.toggleExportForm = function () {
        processCtrl.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        processCtrl.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        processCtrl.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        processCtrl.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleUniversalMenu/UniversalMenuProcesses/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    processCtrl.rowCountChanged = function () {
        if (!angular.isDefined(processCtrl.ExportFileClass.RowCount) || processCtrl.ExportFileClass.RowCount > 5000)
            processCtrl.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    processCtrl.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"universalmenuProcesses/count", processCtrl.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            processCtrl.addRequested = false;
            rashaErManage.checkAction(response);
            processCtrl.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            processCtrl.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);