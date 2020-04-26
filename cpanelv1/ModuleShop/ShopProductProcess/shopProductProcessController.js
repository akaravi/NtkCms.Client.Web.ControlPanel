app.controller("shopProductProcessController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$builder', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $builder, $window, $filter) {
    var shopProcess = this;

    if (itemRecordStatus != undefined) shopProcess.itemRecordStatus = itemRecordStatus;

    //For Show Shop Loading Indicator
    shopProcess.busyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    //Shop Grid Options
    shopProcess.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'Price', displayName: 'قیمت', sortable: true, type: 'integer', visible: 'true' },
            { name: 'CheckInventory', displayName: 'بررسی موجودی؟', sortable: true, isCheckBox: true, visible: 'true' },
            { name: 'CurrentInventory', displayName: 'موجودی', sortable: true, type: 'string', visible: 'true' },
            { name: 'LinkExternalPaymentProcessCustomizeId', displayName: 'کد سیستمی فعالیت', sortable: true, visible: 'true' }
            //{ name: "ActionKey", displayName: "کلیدعملیاتی", displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="shopProcess.addMenu()"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
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
    //open addMenu modal
    shopProcess.addMenu = function () {
        $modal.open({
            templateUrl: "cpanelv1/ModuleShop/ShopProductProcess/grid.html",
            scope: $scope
        });
    }
    shopProcess.addRequested = false;

    //init Function
    shopProcess.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ShopProductProcess/getall", shopProcess.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopProcess.ListItems = response.ListItems;
            shopProcess.gridOptions.fillData(shopProcess.ListItems, response.resultAccess); // Sending Access as an argument
            shopProcess.busyIndicator.isActive = false;
            shopProcess.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopProcess.gridOptions.totalRowCount = response.TotalRowCount;
            shopProcess.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            shopProcess.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            shopProcess.busyIndicator.isActive = false;
        });
        shopProcess.modulesbusyIndicator = true;
    // Get All CmsModules
        ajax.call(cmsServerConfig.configApiServerPath+"ShopProcessCategory/getall", '', 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopProcess.ProcessCategoryListItems = response.ListItems;
            shopProcess.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopProcess.busyIndicator.isActive = false;
        });

       
    };

    shopProcess.gridOptions.onRowSelected = function () {
        var item = shopProcess.gridOptions.selectedRow.item;
    }

    // Open Add New Content Model
    shopProcess.openAddModal = function () {
        if (buttonIsPressed) { return };
        shopProcess.modulesListItemsSelectedId = 0;
        shopProcess.paymentProcessListItemsSelectedId = 0;
        shopProcess.paymentProcessListItems = [];//Clear previous PaymentProcesses
        shopProcess.paymentProcessListItemsbusyIndicator = true;
        shopProcess.paymentProcessCustomizeListItemsbusyIndicator = true;
        shopProcess.submitValue = null;
        $builder.removeAllFormObject('default'); 
        shopProcess.addRequested = false;
        shopProcess.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductProcess/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            shopProcess.selectedItem = response.Item;
            $builder.removeAllFormObject('default');
            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/ShopProductProcess/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    shopProcess.defaultValue = [];

    // Open Edit Content Modal
    shopProcess.openEditModal = function () {
        shopProcess.paymentProcessListItems = [];//Clear previous PaymentProcesses
        shopProcess.modalTitle = 'ویرایش';
        if (!shopProcess.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
            ajax.call(cmsServerConfig.configApiServerPath+"ShopProcessCategory/getall", {}, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                shopProcess.ProcessCategoryListItems = response.ListItems;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                shopProcess.busyIndicator.isActive = false;
            });
            
        $builder.removeAllFormObject('default');
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductProcess/GetOne', shopProcess.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            shopProcess.selectedItem = response1.Item;
            var values = JSON.parse(shopProcess.selectedItem.JsonFormAdminSiteValues);

            shopProcess.paymentProcessListItemsbusyIndicator = true;
            shopProcess.paymentProcessCustomizeListItemsbusyIndicator = true;

            
               ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/GetOne', shopProcess.selectedItem.LinkProcessId, "GET").success(function (response) {
                    rashaErManage.checkAction(response);
                    shopProcess.cmsModulesProcessesCustomizeListItems = response.Item;
                    
                    var filterValue = {
                                PropertyName: "LinkProcessCategoryId",
                                IntValue1: parseInt(shopProcess.cmsModulesProcessesCustomizeListItems.LinkProcessCategoryId),
                                SearchType: 0
                            }
                            var engine = {};
                            engine.RowPerPage = 100;
                            engine.Filters = [];
                            engine.Filters.push(filterValue);
                    ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/getall',engine , "POST").success(function (response2) {
                        rashaErManage.checkAction(response2);
                        shopProcess.cmsModulesProcessesListItems = response2.ListItems;
                    }).error(function (data, errCode, c, d) {
                        shopProcess.busyIndicator = false;
                        rashaErManage.checkAction(data, errCode);
                    });
                    shopProcess.selectedItem.LinkProcessId=response.Item.Id;
                    shopProcess.selectedItem.LinkProcessCategoryId=response.Item.LinkProcessCategoryId;
                    var component = $.parseJSON(shopProcess.cmsModulesProcessesCustomizeListItems.JsonFormAdminSiteJsonForm);
                            // Load and set the values from ProcessesJson.newProcess.ProcessCustomizationInputValue
                            try {
                                var values = $.parseJSON(shopProcess.selectedItem.JsonFormAdminSiteValues);
                            } catch (e) {
                                console.log(e);
                                var values = [];
                            }
                            if (component != null && component.length != undefined)
                                $.each(component, function (i, item) {
                                    $builder.addFormObject('default', item);

                                    if (values != null && values.length != undefined)
                                        $.each(values, function (iValue, itemValue) {
                                            if (item.fieldname == itemValue.fieldname) {
                                                $builder.forms.default[i].id = i;
                                                shopProcess.defaultValue[i] = itemValue.value;
                                            }
                                        });
                                });
                }).error(function (data, errCode, c, d) {
                    shopProcess.busyIndicator = false;
                    rashaErManage.checkAction(data, errCode);
                });
                            $modal.open({
                                templateUrl: 'cpanelv1/ModuleShop/ShopProductProcess/edit.html',
                                scope: $scope
                            });
                 
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }



    // Add New Content
    shopProcess.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        $builder.removeAllFormObject('default');
        shopProcess.busyIndicator.isActive = true;
        shopProcess.addRequested = true;
        shopProcess.selectedItem.JsonFormAdminSiteValues = $.trim(angular.toJson(shopProcess.submitValue));
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductProcess/add', shopProcess.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopProcess.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                shopProcess.ListItems.unshift(response.Item);
                shopProcess.gridOptions.fillData(shopProcess.ListItems);
                shopProcess.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopProcess.addRequested = false;
            shopProcess.busyIndicator.isActive = false;
        });
    }

    shopProcess.saveSubmitValues = function () {
        var updateMethod = "PUT";
        var updateMode = "edit";
        //if (shopProcess.updateMode == "add")
        //    updateMethod = "POST";
        shopProcess.addRequested = true;
        shopProcess.selectedItem.JsonFormValues = $.trim(angular.toJson(shopProcess.submitValue));
        ajax.call(cmsServerConfig.configApiServerPath+'cmsModulepaymentprocesscustomize/' + updateMode, shopProcess.selectedItem, updateMethod).success(function (response) {
            rashaErManage.checkAction(response);
            shopProcess.addRequested = false;
            shopProcess.closeModal();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopProcess.addRequested = false;
        });
    }

    //Edit Content
    shopProcess.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopProcess.addRequested = true;
        shopProcess.busyIndicator.isActive = true;

        shopProcess.selectedItem.JsonFormAdminSiteValues = $.trim(angular.toJson(shopProcess.submitValue));
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductProcess/edit', shopProcess.selectedItem, 'PUT').success(function (response) {
            shopProcess.addRequested = false;
            shopProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopProcess.replaceItem(shopProcess.selectedItem.Id, response.Item);
                shopProcess.gridOptions.fillData(shopProcess.ListItems);
                //shopProcess.saveSubmitValues();
                shopProcess.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopProcess.addRequested = false;
            shopProcess.busyIndicator.isActive = false;
        });
    }

    // Delete a Shop Content 
    shopProcess.deleteContent = function () {
        if (buttonIsPressed) return;
        if (!shopProcess.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        shopProcess.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                shopProcess.busyIndicator.isActive = true;
                shopProcess.showbusy = true;
                shopProcess.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"ShopProductProcess/GetOne", shopProcess.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    shopProcess.showbusy = false;
                    shopProcess.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    shopProcess.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+"ShopProductProcess/delete", shopProcess.selectedItemForDelete, 'POST').success(function (res) {
                        shopProcess.busyIndicator.isActive = false;
                        shopProcess.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            shopProcess.replaceItem(shopProcess.selectedItemForDelete.Id);
                            shopProcess.gridOptions.fillData(shopProcess.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        shopProcess.showIsBusy = false;
                        shopProcess.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    shopProcess.showIsBusy = false;
                    shopProcess.busyIndicator.isActive = false;
                });
            }
        });
    }

    //Replace Item OnDelete/OnEdit Grid Options
    shopProcess.replaceItem = function (oldId, newItem) {
        angular.forEach(shopProcess.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = shopProcess.ListItems.indexOf(item);
                shopProcess.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            shopProcess.ListItems.unshift(newItem);
    }

    shopProcess.searchData = function () {
        shopProcess.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"shopProcess/getall", shopProcess.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            shopProcess.busyIndicator.isActive = false;
            shopProcess.ListItems = response.ListItems;
            shopProcess.gridOptions.fillData(shopProcess.ListItems);
            shopProcess.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopProcess.gridOptions.totalRowCount = response.TotalRowCount;
            shopProcess.gridOptions.rowPerPage = response.RowPerPage;
            shopProcess.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            shopProcess.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    shopProcess.addRequested = false;

    shopProcess.closeModal = function () {
        $modalStack.dismissAll();
    };

    //For reInit Categories
    shopProcess.gridOptions.reGetAll = function () {
        if (shopProcess.gridOptions.advancedSearchData.engine.Filters.length > 0) shopProcess.searchData();
        else shopProcess.init();
    };

    // On Module Process Change Event

    /*shopProcess.onModuleChange = function (moduleId) {
        $builder.removeAllFormObject('default');
        shopProcess.paymentProcessCustomizeListItems = [];
        shopProcess.paymentProcessListItems = [];
        var filterValue = {
            PropertyName: "LinkModuleId",
            IntValue1: parseInt(moduleId),
            SearchType: 0
        }
        var engine = {};
        engine.RowPerPage = 100;
        engine.Filters = [];
        engine.Filters.push(filterValue);
        shopProcess.paymentProcessListItemsbusyIndicator = true;
        shopProcess.paymentProcessCustomizeListItemsbusyIndicator = true;
        ajax.call(cmsServerConfig.configApiServerPath+'cmsmodulepaymentprocess/getall', engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            shopProcess.paymentProcessListItems = response.ListItems;
            shopProcess.paymentProcessListItemsbusyIndicator = false;
        }).error(function (data, errCode, c, d) {
            shopProcess.busyIndicator = false;
            rashaErManage.checkAction(data, errCode);
        });
    }*/

    shopProcess.onPaymentProcessChange = function (paymentProcessId) {
        $builder.removeAllFormObject('default');
        var filterValue = {
            PropertyName: "LinkModulePaymentProcessId",
            IntValue1: parseInt(paymentProcessId),
            SearchType: 0
        }
        var engine = {};
        engine.RowPerPage = 100;
        engine.Filters = [];
        engine.Filters.push(filterValue);
        shopProcess.paymentProcessCustomizeListItemsbusyIndicator = true;
        ajax.call(cmsServerConfig.configApiServerPath+'cmsModulePaymentProcessCustomize/getall', engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            shopProcess.paymentProcessCustomizeListItems = response.ListItems;
            shopProcess.paymentProcessListItemsbusyIndicator = false;
            shopProcess.paymentProcessCustomizeListItemsbusyIndicator = false;
        }).error(function (data, errCode, c, d) {
            shopProcess.busyIndicator = false;
            rashaErManage.checkAction(data, errCode);
        });


    }
    shopProcess.onPaymentProcessCustomizeChange = function (selectedId) {

        if (!selectedId)
            return;
        $builder.removeAllFormObject('default');
        var selectedItem = {};
        for (var index = 0; index < shopProcess.paymentProcessCustomizeListItems.length; index++) {
            if (shopProcess.paymentProcessCustomizeListItems[index].Id == selectedId)
                selectedItem = shopProcess.paymentProcessCustomizeListItems[index];
        }

        var customizeValue = JSON.parse(selectedItem.InputFormSiteAdminClassJsonForm);

        shopProcess.defaultValue = [];
        if (customizeValue != null && customizeValue.length > 0) {
            $.each(customizeValue, function (i, item) {
                if (item.fieldname != undefined && item.fieldname != null && item.fieldname != "") {
                    var fieldType = "";
                    if (item.FieldType == "System.Boolean") {
                        fieldType = "radio";
                        $builder.addFormObject('default', {
                            "component": fieldType,
                            "label": item.label,
                            "description": item.description,
                            "fieldname": item.fieldname,
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
                            "label": item.label,
                            "description": item.description,
                            "fieldname": item.fieldname,
                        });
                    }

                }
            });
        }
    }





///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



  // On Module Change Event
    shopProcess.onModuleChange = function (moduleId) {
        //shopProcess.PageDependenciesListItems = [];
        var filterValue = [{
            PropertyName: "LinkProcessCategoryId",
            IntValue1: parseInt(moduleId),
            SearchType: 0
        }]
        /*shopProcess.busyIndicatorForDropDownProcess = true;
        shopProcess.advancedSearchData.engine.Filters = null;
        shopProcess.advancedSearchData.engine.Filters = [];
        shopProcess.advancedSearchData.engine.Filters.push(filterValue);
        shopProcess.advancedSearchData.engine.RowPerPage = 200;
        shopProcess.isLoading = true;                 // غیرفعال کردن منوی کشویی بعدی
        shopProcess.isWaiting = true;*/
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/getall', filterValue, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            shopProcess.cmsModulesProcessesListItems = response.ListItems;
            shopProcess.isLoading = false;          // فعال کردن منوی کشویی بعدی
            if (shopProcess.cmsModulesProcessesListItems.length == 0) {
                shopProcess.selectedItem.LinkModuleProcessId = null;
                shopProcess.cmsModulesProcessesCustomizeListItems = [];
                shopProcess.selectedItem.LinkModuleProcessCustomizeId = null;
                shopProcess.selectedItem.ProcessCustomizationInputValue = null;
                $("#cmsModuleProcesses_comboBox").prop("selectedIndex", -1);
                $("#cmsModuleProcessesCustomize_comboBox").prop("selectedIndex", -1);
            }
        }).error(function (data, errCode, c, d) {
            shopProcess.busyIndicator = false;
            rashaErManage.checkAction(data, errCode);
            shopProcess.busyIndicatorForDropDownProcess = false;
        });
    }

    // On ModuleProcess Change Event
   /* shopProcess.LoadUniversalMenuProcessOfModuleProcessCustomize = function (moduleProcessId) {

        // Clear the form in case there is no ModuleProcessCustomize
        $builder.removeAllFormObject('default');
        var filterValue = [{
            PropertyName: "LinkModuleProcessId",
            IntValue1: parseInt(moduleProcessId),
            SearchType: 0
        }];
        /*shopProcess.busyIndicatorForDropDownProcessCustomize = true;
        shopProcess.advancedSearchData.engine.Filters = null;
        shopProcess.advancedSearchData.engine.Filters = [];
        shopProcess.advancedSearchData.engine.Filters.push(filterValue);
        shopProcess.isWaiting = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/getall', filterValue, "POST").success(function (response) {
            shopProcess.isWaiting = false;
            rashaErManage.checkAction(response);
            shopProcess.cmsModulesProcessesCustomizeListItems = response.ListItems;
            shopProcess.busyIndicatorForDropDownProcessCustomize = false;

            if (shopProcess.cmsModulesProcessesCustomizeListItems.length == 0) {
                shopProcess.selectedItem.LinkModuleProcessCustomizeId = null;
                shopProcess.selectedItem.ProcessCustomizationInputValue = null;
                $("#cmsModuleProcessesCustomize_comboBox").prop("selectedIndex", -1);
            }

        }).error(function (data, errCode, c, d) {
            shopProcess.busyIndicator = false;
            rashaErManage.checkAction(data, errCode);
            shopProcess.busyIndicatorForDropDownProcessCustomize = false;
        });
    }*/

    shopProcess.gridOptions.reGetAll = function () {
        shopProcess.init();
    }

    // On ModuleProcessCustomize Change Event
    shopProcess.LoadProcessInputCustomizeValue = function (LinkModuleProcessCustomizeId) {
        $builder.removeAllFormObject('default');
        var length = shopProcess.cmsModulesProcessesCustomizeListItems.length;
        for (var i = 0; i < length; i++) {
            if (shopProcess.cmsModulesProcessesCustomizeListItems[i].Id == LinkModuleProcessCustomizeId) {
                var component = $.parseJSON(shopProcess.cmsModulesProcessesCustomizeListItems[i].ProcessInputValueForm);
                if (component != null && component.length != undefined)
                    $.each(component, function (i, item) {
                        $builder.addFormObject('default', item);
                    });
            }
        }
    }

    shopProcess.LoadUniversalMenuProcessOfModuleProcessCustomize = function (LinkProcessId) {
        $builder.removeAllFormObject('default');
        // Get Process
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/GetOne', LinkProcessId, "GET").success(function (response1) {
            shopProcess.selectedItem.LinkProcessId = response1.Item.Id;
            // Get CmsModuleProcess 
           
                            var length = shopProcess.cmsModulesProcessesListItems.length;
                            for (var j = 0; j < length; j++) {
                                if (shopProcess.cmsModulesProcessesListItems[j].Id == LinkProcessId) {
                                    var component = $.parseJSON(shopProcess.cmsModulesProcessesListItems[j].JsonFormAdminSiteJsonForm);
                                    if (component != null && component.length != undefined)
                                        $.each(component, function (i, item) {
                                            $builder.addFormObject('default', item);
                                        });
                               

                            // Set values
                            angular.forEach($.parseJSON(shopProcess.cmsModulesProcessesListItems[j].JsonFormAdminSiteValuesDefault), function (item, key) {
                                shopProcess.defaultValue[item.id] = item.value;
                            }); 
                            }
                            }
                            if (shopProcess.cmsModulesProcessesListItems.length == 0) {
                                shopProcess.selectedItem.LinkModuleProcessCustomizeId = null;
                                shopProcess.selectedItem.ProcessCustomizationInputValue = null;
                                $("#cmsModuleProcessesCustomize_comboBox").prop("selectedIndex", -1);
                            }
                    
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    shopProcess.valueSubmit = [];
    shopProcess.defaultValue = {};

    // Show InputValue form builder and auto scroll to its position
    shopProcess.openCustomizeInputValueModal = function (item) {

        shopProcess.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductProcess/GetOne', item.Id, 'GET').success(function (response) {
            shopProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            shopProcess.selectedItem = response.Item;
            //shopProcess.defaultValue = $.parseJSON(shopProcess.selectedItem.ProcessCustomizationInputValue);
            //$scope.defaultValue = $.parseJSON(shopProcess.selectedItem.ProcessCustomizationInputValue);

            // Set values
            angular.forEach($.parseJSON(shopProcess.selectedItem.ProcessCustomizationInputValue), function (item, key) {
                shopProcess.defaultValue[item.id] = item.value;
            });

            $builder.removeAllFormObject('default');

            var length = shopProcess.cmsModulesProcessesCustomizeListItems.length;
            for (var i = 0; i < length; i++) {
                if (shopProcess.cmsModulesProcessesCustomizeListItems[i].Id == item.LinkModuleProcessCustomizeId) {
                    var component = $.parseJSON(shopProcess.cmsModulesProcessesCustomizeListItems[i].ProcessInputValueForm);
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
    shopProcess.showSubmitValueForm = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleShop/ShopProductProcess/submitValueForm.html',
            scope: $scope
        });
    }

    shopProcess.submitValues = function (item) {
        shopProcess.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductProcess/GetOne', shopProcess.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            shopProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            shopProcess.selectedItem = response.Item;
            shopProcess.selectedItem.LinkProcessCategoryId = null;
            shopProcess.selectedItem.LinkModuleProcessId = null;
            shopProcess.selectedItem.ProcessCustomizationInputValue = $.trim(angular.toJson(shopProcess.valueSubmit));
            ajax.call(cmsServerConfig.configApiServerPath+'ShopProductProcess/', shopProcess.selectedItem, 'PUT').success(function (response) {
                shopProcess.addRequested = true;
                rashaErManage.checkAction(response);
                if (response.IsSuccess) {
                    shopProcess.addRequested = false;
                    shopProcess.replaceItem(shopProcess.selectedItem.Id, response.Item);
                    shopProcess.gridOptions.fillData(shopProcess.ListItems);
                    shopProcess.closeModal();
                }

            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                shopProcess.addRequested = false;
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });

        $("#inputValue_form").css("display", "none");
        $('html, body').animate({
            scrollTop: $("#inputValue_form").offset().top
        }, 850);
    }
  

    shopProcess.columnCheckbox = false;

    shopProcess.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = shopProcess.gridOptions.columns;
        if (shopProcess.gridOptions.columnCheckbox) {
            for (var i = 0; i < shopProcess.gridOptions.columns.length; i++) {
                //shopProcess.gridOptions.columns[i].visible = $("#" + shopProcess.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + shopProcess.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                shopProcess.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < shopProcess.gridOptions.columns.length; i++) {
                var element = $("#" + shopProcess.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + shopProcess.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < shopProcess.gridOptions.columns.length; i++) {
            console.log(shopProcess.gridOptions.columns[i].name.concat(".visible: "), shopProcess.gridOptions.columns[i].visible);
        }
        shopProcess.gridOptions.columnCheckbox = !shopProcess.gridOptions.columnCheckbox;
    }

    shopProcess.deleteAttachedFile = function (index) {
        shopProcess.attachedFiles.splice(index, 1);
    }
    //Export Report 
    shopProcess.exportFile = function () {
        shopProcess.addRequested = true;
        shopProcess.gridOptions.advancedSearchData.engine.ExportFile = shopProcess.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductProcess/exportfile', shopProcess.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopProcess.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //shopProcess.closeModal();
            }
            shopProcess.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    shopProcess.toggleExportForm = function () {
        shopProcess.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        shopProcess.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        shopProcess.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        shopProcess.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        shopProcess.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleShop/ShopProductProcess/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    shopProcess.rowCountChanged = function () {
        if (!angular.isDefined(shopProcess.ExportFileClass.RowCount) || shopProcess.ExportFileClass.RowCount > 5000)
            shopProcess.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    shopProcess.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ShopProductProcess/count", shopProcess.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopProcess.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            shopProcess.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Export Report 
    shopProcess.exportFile = function () {
        shopProcess.addRequested = true;
        shopProcess.gridOptions.advancedSearchData.engine.ExportFile = shopProcess.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProductService/exportfile', shopProcess.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopProcess.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //shopProcess.closeModal();
            }
            shopProcess.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    shopProcess.toggleExportForm = function () {
        shopProcess.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        shopProcess.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        shopProcess.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        shopProcess.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        shopProcess.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleShop/ShopProductProcess/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    shopProcess.rowCountChanged = function () {
        if (!angular.isDefined(shopProcess.ExportFileClass.RowCount) || shopProcess.ExportFileClass.RowCount > 5000)
            shopProcess.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    shopProcess.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ShopProductService/count", shopProcess.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopProcess.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            shopProcess.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);