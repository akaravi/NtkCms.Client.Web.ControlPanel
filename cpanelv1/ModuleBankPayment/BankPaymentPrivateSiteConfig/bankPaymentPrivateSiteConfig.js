app.controller("bankPaymentPrivateSiteConfigController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$builder', '$state', '$stateParams', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $builder, $state, $stateParams, $filter) {
    var privateSiteConfig = this;
    
    privateSiteConfig.ManageUserAccessControllerTypes = [];

    privateSiteConfig.selectedPublicConfig = { Id: $stateParams.publicConfigId };

    privateSiteConfig.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) privateSiteConfig.itemRecordStatus = itemRecordStatus;

    privateSiteConfig.init = function () {
        if (privateSiteConfig.selectedPublicConfig.Id == 0 || privateSiteConfig.selectedPublicConfig.Id == null) {
            $state.go("index.bankpaymentpublicconfig");
            return;
        }
        var engine = { Filters: [{ PropertyName: "Id", IntValue1: privateSiteConfig.selectedPublicConfig.Id }] };
        ajax.call(cmsServerConfig.configApiServerPath+'bankpaymentpublicconfig/getonewithjsonformatter', engine, 'POST').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            privateSiteConfig.selectedPublicConfig = response.Item;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });

        privateSiteConfig.busyIndicator.isActive = true;
        var filterModel = { PropertyName: "LinkPublicConfigId", SearchType: 0, IntValue1: privateSiteConfig.selectedPublicConfig.Id };
        privateSiteConfig.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
        ajax.call(cmsServerConfig.configApiServerPath+"bankpaymentprivatesiteconfig/getall", privateSiteConfig.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            privateSiteConfig.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            privateSiteConfig.ListItems = response.ListItems;
            privateSiteConfig.gridOptions.fillData(privateSiteConfig.ListItems, response.resultAccess);
            privateSiteConfig.gridOptions.currentPageNumber = response.CurrentPageNumber;
            privateSiteConfig.gridOptions.totalRowCount = response.TotalRowCount;
            privateSiteConfig.gridOptions.rowPerPage = response.RowPerPage;
            privateSiteConfig.gridOptions.maxSize = 5;
            privateSiteConfig.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            privateSiteConfig.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"bankpaymentprivateSiteConfig/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            privateSiteConfig.privateSiteConfigListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    function parseJSONcomponent(str) {
        var defaultStr = '[{"id":0,"component":"text","editable":true,"index":0,"label":"متن ساده","description":"","placeholder":"","options":[],"required":false,"validation":"/.*/","logic":{"action":"Hide"},"$$hashKey":"object:153"}]';
        if (str == undefined || str == null || str == "")
            str = defaultStr;
        try {
            JSON.parse(str);
        } catch (e) {
            str = defaultStr;
        }
        return $.parseJSON(str);
    }
    privateSiteConfig.addRequested = false;
    privateSiteConfig.openAddModal = function () {
        if (buttonIsPressed) { return };
        privateSiteConfig.modalTitle = 'اضافه';
        buttonIsPressed = true;
        privateSiteConfig.defaultValue = {};
        $builder.removeAllFormObject('default');
        ajax.call(cmsServerConfig.configApiServerPath+'bankpaymentprivatesiteconfig/GetViewModel', '', 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            privateSiteConfig.selectedItem = response.Item;
            privateSiteConfig.selectedItem.LinkPublicConfigId = privateSiteConfig.selectedPublicConfig.Id;

            //Load FormBuilder and its values
            //var customizeValue = JSON.parse(response.Item.privateSiteConfigJsonValues);
            var customizeValue = privateSiteConfig.selectedPublicConfig.PrivateConfigJsonFormatter;
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
                                "id": i,
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
                                "id": i,
                                "fieldname": item.FieldName
                            });
                        }
                        //تخصیص مقادیر با تشخصیص نام متغییر
                        if (response.Item.PrivateConfigJsonValues != null && response.Item.PrivateConfigJsonValues != "") {
                            values = $.parseJSON(response.Item.PrivateConfigJsonValues);
                            $.each(values, function (iValue, itemValue) {
                                if (item.FieldName == itemValue.fieldname)
                                    privateSiteConfig.defaultValue[i] = itemValue.value;
                            });
                        }
                    }
                });
            }

            $modal.open({
                templateUrl: 'cpanelv1/ModuleBankPayment/BankPaymentPrivateSiteConfig/add.html',
                scope: $scope
            });




        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    privateSiteConfig.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        privateSiteConfig.addRequested = true;
        privateSiteConfig.busyIndicator.isActive = true;
        privateSiteConfig.selectedItem.PrivateConfigJsonValues = $.trim(angular.toJson(privateSiteConfig.submitValue));
        ajax.call(cmsServerConfig.configApiServerPath+'bankpaymentprivatesiteconfig/add', privateSiteConfig.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                privateSiteConfig.ListItems.unshift(response.Item);
                privateSiteConfig.gridOptions.fillData(privateSiteConfig.ListItems);
                privateSiteConfig.addRequested = false;
                privateSiteConfig.busyIndicator.isActive = false;
                privateSiteConfig.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            privateSiteConfig.addRequested = false;
            privateSiteConfig.busyIndicator.isActive = false;
        });
    }

    privateSiteConfig.openEditModal = function () {
        if (buttonIsPressed) { return };
        privateSiteConfig.modalTitle = 'ویرایش';
        if (!privateSiteConfig.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        privateSiteConfig.defaultValue = {};
        $builder.removeAllFormObject('default');
        var engine = { Filters: [{ PropertyName: "Id", IntValue1: privateSiteConfig.gridOptions.selectedRow.item.Id }] };

        buttonIsPressed = true;
        privateSiteConfig.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'bankpaymentprivatesiteconfig/getonewithjsonformatter', engine, 'POST').success(function (response) {
            buttonIsPressed = false;
            privateSiteConfig.addRequested = false;
            rashaErManage.checkAction(response);
            privateSiteConfig.selectedItem = response.Item;

            //Load FormBuilder and its values
            //var customizeValue = JSON.parse(response.Item.privateSiteConfigJsonValues);
            var customizeValue = response.Item.PrivateConfigJsonFormatter;
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
                                "id": i,
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
                                "id": i,
                                "fieldname": item.FieldName
                            });
                        }
                        //تخصیص مقادیر با تشخصیص نام متغییر
                        if (response.Item.PrivateConfigJsonValues != null && response.Item.PrivateConfigJsonValues != "") {
                            values = $.parseJSON(response.Item.PrivateConfigJsonValues);
                            $.each(values, function (iValue, itemValue) {
                                if (item.FieldName == itemValue.fieldname)
                                    privateSiteConfig.defaultValue[i] = itemValue.value;
                            });
                        }
                    }
                });
            }

            $modal.open({
                templateUrl: 'cpanelv1/ModuleBankPayment/BankPaymentPrivateSiteConfig/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    privateSiteConfig.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        privateSiteConfig.addRequested = true;
        privateSiteConfig.busyIndicator.isActive = true;

        privateSiteConfig.selectedItem.PrivateConfigJsonValues = $.trim(angular.toJson(privateSiteConfig.submitValue));

        ajax.call(cmsServerConfig.configApiServerPath+'bankpaymentprivatesiteconfig/edit', privateSiteConfig.selectedItem, 'PUT').success(function (response) {
            privateSiteConfig.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                privateSiteConfig.replaceItem(privateSiteConfig.selectedItem.Id, response.Item);
                privateSiteConfig.addRequested = false;
                privateSiteConfig.busyIndicator.isActive = false;
                privateSiteConfig.gridOptions.fillData(privateSiteConfig.ListItems, response.resultAccess);
                privateSiteConfig.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            privateSiteConfig.addRequested = false;
            privateSiteConfig.busyIndicator.isActive = false;
        });
    }

    privateSiteConfig.closeModal = function () {
        $modalStack.dismissAll();
    };

    privateSiteConfig.replaceItem = function (oldId, newItem) {
        angular.forEach(privateSiteConfig.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = privateSiteConfig.ListItems.indexOf(item);
                privateSiteConfig.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            privateSiteConfig.ListItems.unshift(newItem);
    }

    privateSiteConfig.deleteRow = function () {
        if (buttonIsPressed) { return };
        if (!privateSiteConfig.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'bankpaymentprivatesiteconfig/GetOne', privateSiteConfig.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    privateSiteConfig.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'bankpaymentprivatesiteconfig/delete', privateSiteConfig.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            privateSiteConfig.replaceItem(privateSiteConfig.selectedItemForDelete.Id);
                            privateSiteConfig.gridOptions.fillData(privateSiteConfig.ListItems);
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

    privateSiteConfig.searchData = function () {
        privateSiteConfig.gridOptions.serachData();
    }

    privateSiteConfig.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'virtual_PublicConfig.CurrencyUnit', displayName: 'واحد پولی', sortable: true, type: 'string' },
            { name: 'CurrencyUnitRatioByShop', displayName: 'واحد پولی به فروشگاه', sortable: true, type: 'string' },

            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'MaxTransactionAmount', displayName: 'حداکثر مقدار تراکنش', sortable: true, type: 'integer' },
            { name: 'MinTransactionAmount', displayName: 'حداقل مقدار تراکنش', sortable: true, type: 'integer' },
            { name: 'FixFeeTransactionAmount', displayName: 'مقدار کارمزد تراکنش', sortable: true, type: 'integer' },
            { name: 'PercentFeeTransactionAmount', displayName: 'درصد کارمزد تراکنش', sortable: true, type: 'integer' },
            //{ name: 'PrivateConfigJsonValues', displayName: 'عملیات', sortable: true, type: 'string', displayForce: true, template: '<button class="btn btn-success" ng-click="privateSiteConfig.openBaseConfigModal(x.Id)"><i class="fa fa-cog" aria-hidden="false"></i></button>' },
            { name: 'ActionButton', displayName: 'تست پرداخت', sortable: true, displayForce: true, template: '<button class="btn btn-success" ng-click="privateSiteConfig.openTestPayModal(x.Id,x.virtual_PublicConfig.CurrencyUnit)"><i class="fa fa-credit-card" aria-hidden="true"></i></button>' },
            { name: 'ActionButton', displayName: 'لیست تراکنش ها', sortable: true, displayForce: true, template: '<button class="btn btn-success" ng-click="privateSiteConfig.goToTransactionState(x.Id)"><i class="fa fa-list" aria-hidden="true"></i></button>' }
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
                RowPerPage: 25,
                ContentFullSearch: null,
                Filters: [],
                Count: false
            }
        }
    }

    privateSiteConfig.gridOptions.reGetAll = function () {
        privateSiteConfig.init();
    }

    privateSiteConfig.gridOptions.onRowSelected = function () { }

    //Export Report 
    privateSiteConfig.exportFile = function () {
        privateSiteConfig.addRequested = true;
        privateSiteConfig.gridOptions.advancedSearchData.engine.ExportFile = privateSiteConfig.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreSite/exportfile', privateSiteConfig.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            privateSiteConfig.addRequested = false;
            rashaErManage.checkAction(response);
            privateSiteConfig.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //privateSiteConfig.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    privateSiteConfig.toggleExportForm = function () {
        privateSiteConfig.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        privateSiteConfig.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        privateSiteConfig.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        privateSiteConfig.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleBankPayment/BankPaymentPrivateSiteConfig/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    privateSiteConfig.rowCountChanged = function () {
        if (!angular.isDefined(privateSiteConfig.ExportFileClass.RowCount) || privateSiteConfig.ExportFileClass.RowCount > 5000)
            privateSiteConfig.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    privateSiteConfig.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"CoreSite/count", privateSiteConfig.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            privateSiteConfig.addRequested = false;
            rashaErManage.checkAction(response);
            privateSiteConfig.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            privateSiteConfig.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    privateSiteConfig.openBaseConfigModal = function (selectedId) {
        privateSiteConfig.defaultValue = {};
        $builder.removeAllFormObject('default');
        var engine = { Filters: [{ PropertyName: "Id", IntValue1: selectedId }] };
        privateSiteConfig.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+"BankPaymentprivateSiteConfig/getonewithjsonformatter", engine, 'POST').success(function (response) {
            privateSiteConfig.addRequested = false;
            if (response.IsSuccess) {
                privateSiteConfig.selectedItem = response.Item;
                $modal.open({
                    templateUrl: 'cpanelv1/ModuleBankPayment/BankPaymentprivateSiteConfig/preview.html',
                    scope: $scope
                });
                $builder.removeAllFormObject('default');
                //var customizeValue = JSON.parse(response.Item.privateSiteConfigJsonValues);
                var customizeValue = response.Item.PrivateConfigJsonFormatter;
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
                                    "id": i,
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
                                    "id": i,
                                    "fieldname": item.FieldName
                                });
                            }
                            //تخصیص مقادیر فرم با تشخیص نام فیلد
                            if (response.Item.PrivateConfigJsonValues != null && response.Item.PrivateConfigJsonValues != "") {
                                values = $.parseJSON(response.Item.PrivateConfigJsonValues);
                                $.each(values, function (iValue, itemValue) {
                                    if (item.FieldName == itemValue.fieldname)
                                        privateSiteConfig.defaultValue[i] = itemValue.value;
                                });
                            }
                        }
                    });
                }
            }
        }).error(function (data, errCode, c, d) {
            privateSiteConfig.addRequested = false;
            rashaErManage.checkAction(data, errCode);
        });
    }
    privateSiteConfig.testPayValue = {};
    privateSiteConfig.testPayValue.Item = {};
    privateSiteConfig.openTestPayModal = function (id,unit) {
        privateSiteConfig.currentunit=unit;
        privateSiteConfig.testPayModel = { PaymentPrivateId: id, Price: 0 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleBankPayment/BankPaymentPrivateSiteConfig/testPay.html',
            scope: $scope

        });
    }

    privateSiteConfig.testPay = function () {
        privateSiteConfig.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+"BankPaymentPrivateSiteConfig/testpay", privateSiteConfig.testPayModel, 'POST').success(function (response) {
            privateSiteConfig.addRequested = false;
            privateSiteConfig.testPayValue = response;
            privateSiteConfig.testPayModel.RedirectWebUrl = response.RedirectWebUrl;
        }).error(function (data, errCode, c, d) {
            privateSiteConfig.addRequested = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    privateSiteConfig.saveSubmitValues = function () {
        privateSiteConfig.addRequested = true;
        privateSiteConfig.busyIndicator.isActive = true;
        privateSiteConfig.selectedItem.PrivateConfigJsonValues = $.trim(angular.toJson(privateSiteConfig.submitValue));
        ajax.call(cmsServerConfig.configApiServerPath+'bankpaymentprivateSiteConfig/edit', privateSiteConfig.selectedItem, 'PUT').success(function (response) {
            privateSiteConfig.addRequested = true;
            privateSiteConfig.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            privateSiteConfig.closeModal();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            privateSiteConfig.addRequested = false;
            privateSiteConfig.busyIndicator.isActive = false;
        });
    }
    privateSiteConfig.changeState = function (state) {
        $state.go("index." + state);
    }

    privateSiteConfig.goToTransactionState = function (selectedId) {
        $state.go("index.bankpaymenttransc", { privateSiteConfigId: selectedId });
    }
}]);