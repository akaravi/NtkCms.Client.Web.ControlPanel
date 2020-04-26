app.controller("bankPaymentPublicConfigController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$builder', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $builder, $state, $filter) {
    var publicConfig = this;
    publicConfig.ManageUserAccessControllerTypes = [];

    publicConfig.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) publicConfig.itemRecordStatus = itemRecordStatus;

    publicConfig.init = function () {
        publicConfig.busyIndicator.isActive = true;
        publicConfig.gridOptions.advancedSearchData.engine.RowPerPage = 20;
        ajax.call(cmsServerConfig.configApiServerPath+"bankpaymentpublicconfig/getall", publicConfig.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            publicConfig.ListItems = response.ListItems;
            publicConfig.gridOptions.fillData(publicConfig.ListItems, response.resultAccess);
            publicConfig.gridOptions.currentPageNumber = response.CurrentPageNumber;
            publicConfig.gridOptions.totalRowCount = response.TotalRowCount;
            publicConfig.gridOptions.rowPerPage = response.RowPerPage;
            publicConfig.gridOptions.maxSize = 5;
            var model = {};
            model.SortType = 0;
            model.SortColumn = "Id";
            publicConfig.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            publicConfig.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    publicConfig.addRequested = false;


    publicConfig.autoAdd = function () {
        publicConfig.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'bankpaymentpublicconfig/autoadd', { LinkSourceId: publicConfig.selectedSourceId }, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            publicConfig.busyIndicator.isActive = false;
            publicConfig.init();
        }).error(function (data, errCode, c, d) {
            publicConfig.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    publicConfig.dataForTheTree = [];

    publicConfig.openEditModal = function () {
        publicConfig.modalTitle = 'ویرایش';
        if (!publicConfig.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        publicConfig.defaultValue = {};
        $builder.removeAllFormObject('default');
        var engine = { Filters: [{ PropertyName: "Id", IntValue1: publicConfig.gridOptions.selectedRow.item.Id }] };

        publicConfig.addRequested = true;
        publicConfig.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'bankpaymentpublicconfig/getonewithjsonformatter', engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            publicConfig.selectedItem = response.Item;

            //Load FormBuilder and its values
            //var customizeValue = JSON.parse(response.Item.PublicConfigJsonValues);
            var customizeValue = response.Item.PublicConfigJsonFormatter;
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
                                "fieldname": item.FieldName,
                            });
                        }
                        ///تخصیص مقادیر با تشکخصی نام متغییر
                        if (response.Item.PublicConfigJsonValues != null && response.Item.PublicConfigJsonValues != "") {
                            values = $.parseJSON(response.Item.PublicConfigJsonValues);
                            $.each(values, function (iValue, itemValue) {
                                if (item.FieldName == itemValue.fieldname)
                                    publicConfig.defaultValue[i] = itemValue.value;
                            });
                        }
                    }
                });
            }

            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/GetAll", filterModelParentRootFolders, 'POST').success(function (response1) {
                publicConfig.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) {
                    Array.prototype.push.apply(publicConfig.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (publicConfig.selectedItem.LinkModuleFileLogoId > 0)
                        publicConfig.onSelection({ Id: publicConfig.selectedItem.LinkModuleFileLogoId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleBankPayment/BankPaymentPublicConfig/edit.html',
                        scope: $scope
                    });
                    publicConfig.addRequested = false;
                    publicConfig.busyIndicator.isActive = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    publicConfig.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        publicConfig.addRequested = true;
        publicConfig.busyIndicator.isActive = true;

        publicConfig.selectedItem.PublicConfigJsonValues = $.trim(angular.toJson(publicConfig.submitValue));

        ajax.call(cmsServerConfig.configApiServerPath+'bankpaymentpublicconfig/edit', publicConfig.selectedItem, 'PUT').success(function (response) {
            publicConfig.addRequested = false;
            publicConfig.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                publicConfig.replaceItem(publicConfig.selectedItem.Id, response.Item);
                publicConfig.gridOptions.fillData(publicConfig.ListItems, response.resultAccess);
                publicConfig.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            publicConfig.addRequested = false;
            publicConfig.busyIndicator.isActive = false;
        });
    }

    publicConfig.closeModal = function () {
        $modalStack.dismissAll();
    };

    publicConfig.replaceItem = function (oldId, newItem) {
        angular.forEach(publicConfig.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = publicConfig.ListItems.indexOf(item);
                publicConfig.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            publicConfig.ListItems.unshift(newItem);
    }

    publicConfig.deleteRow = function () {
        if (buttonIsPressed) { return };
        if (!publicConfig.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'bankpaymentpublicconfig/GetOne', publicConfig.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    publicConfig.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'bankpaymentpublicconfig/delete', publicConfig.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            publicConfig.replaceItem(publicConfig.selectedItemForDelete.Id);
                            publicConfig.gridOptions.fillData(publicConfig.ListItems);
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

    publicConfig.searchData = function () {
        publicConfig.gridOptions.serachData();
    }

    publicConfig.gridOptions = {
        columns: [

            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkModuleFileLogoId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            
            { name: 'ClassName', displayName: 'عنوان کلاس', sortable: true, type: 'string' },
            { name: 'CurrencyUnit', displayName: 'واحد پولی', sortable: true, type: 'string' },
            { name: 'PublicConfigJsonValues', displayName: 'تنظیمات', sortable: true, type: 'string', displayForce: true, template: '<button class="btn btn-success" ng-click="publicConfig.goToPrivateConfig(x.Id)"><i class="fa fa-cog" aria-hidden="false"></i>&nbsp;اختصاصی</button>' }
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
                Filters: [],
                Count: false

            }
        }
    }

    publicConfig.gridOptions.reGetAll = function () {
        publicConfig.init();
    }

    publicConfig.gridOptions.onRowSelected = function () { }
    publicConfig.columnCheckbox = false;
    publicConfig.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = publicConfig.gridOptions.columns;
        if (publicConfig.gridOptions.columnCheckbox) {
            for (var i = 0; i < publicConfig.gridOptions.columns.length; i++) {
                //publicConfig.gridOptions.columns[i].visible = $("#" + publicConfig.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + publicConfig.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                publicConfig.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < publicConfig.gridOptions.columns.length; i++) {
                var element = $("#" + publicConfig.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + publicConfig.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < publicConfig.gridOptions.columns.length; i++) {
            console.log(publicConfig.gridOptions.columns[i].name.concat(".visible: "), publicConfig.gridOptions.columns[i].visible);
        }
        publicConfig.gridOptions.columnCheckbox = !publicConfig.gridOptions.columnCheckbox;
    }
    //Export Report 
    publicConfig.exportFile = function () {
        publicConfig.addRequested = true;
        publicConfig.gridOptions.advancedSearchData.engine.ExportFile = publicConfig.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'bankpaymentpublicconfig/exportfile', publicConfig.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            publicConfig.addRequested = false;
            rashaErManage.checkAction(response);
            publicConfig.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //publicConfig.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    publicConfig.toggleExportForm = function () {
        publicConfig.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        publicConfig.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        publicConfig.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        publicConfig.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleBankPayment/BankPaymentPublicConfig/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    publicConfig.rowCountChanged = function () {
        if (!angular.isDefined(publicConfig.ExportFileClass.RowCount) || publicConfig.ExportFileClass.RowCount > 5000)
            publicConfig.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    publicConfig.getCount = function () {
        publicConfig.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+"BankPaymentPublicConfig/count", publicConfig.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            publicConfig.addRequested = false;
            rashaErManage.checkAction(response);
            publicConfig.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            publicConfig.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //publicConfig.openBaseConfigModal = function (selectedId) {
    //    publicConfig.defaultValue = {};
    //    $builder.removeAllFormObject('default');
    //    var engine = { Filters: [{ PropertyName: "Id", IntValue1: selectedId }] };
    //    publicConfig.addRequested = true;
    //    ajax.call(cmsServerConfig.configApiServerPath+"BankPaymentPublicConfig/getonewithjsonformatter", engine, 'POST').success(function (response) {
    //        publicConfig.addRequested = false;
    //        if (response.IsSuccess) {
    //            publicConfig.selectedItem = response.Item;
    //            $modal.open({
    //                templateUrl: 'cpanelv1/ModuleBankPayment/BankPaymentPublicConfig/preview.html',
    //                scope: $scope
    //            });
    //            $builder.removeAllFormObject('default');
    //            //var customizeValue = JSON.parse(response.Item.PublicConfigJsonValues);
    //            var customizeValue = response.Item.PublicConfigJsonFormatter;
    //            if (customizeValue != null && customizeValue.length > 0) {
    //                $.each(customizeValue, function (i, item) {
    //                    if (item.FieldName != undefined && item.FieldName != null && item.FieldName != "") {
    //                        var fieldType = "";
    //                        if (item.FieldType == "System.Boolean") {
    //                            fieldType = "radio";
    //                            $builder.addFormObject('default', {
    //                                "component": fieldType,
    //                                "label": item.FieldTitle,
    //                                "description": item.FieldDescription,
    //                                "id": i,
    //                                "fieldname": item.FieldName,
    //                                "options": [
    //                                      "True",
    //                                      "False"
    //                                ]
    //                            });
    //                        }
    //                        else {
    //                            fieldType = "text";
    //                            $builder.addFormObject('default', {
    //                                "component": fieldType,
    //                                "label": item.FieldTitle,
    //                                "description": item.FieldDescription,
    //                                "id": i,
    //                                "fieldname": item.FieldName,
    //                            });
    //                        }
    //                        //تخصیص مقادیر فرم با تشخیص نام فیلد
    //                        if (response.Item.PublicConfigJsonValues != null && response.Item.PublicConfigJsonValues != "") {
    //                            values = $.parseJSON(response.Item.PublicConfigJsonValues);
    //                            $.each(values, function (iValue, itemValue) {
    //                                if (item.FieldName == itemValue.fieldname)
    //                                    publicConfig.defaultValue[i] = itemValue.value;
    //                            });
    //                        }
    //                    }
    //                });
    //            }
    //        }
    //    }).error(function (data, errCode, c, d) {
    //        publicConfig.gridOptions.fillData();
    //        rashaErManage.checkAction(data, errCode);
    //    });
    //}

    publicConfig.saveSubmitValues = function () {
        publicConfig.busyIndicator.isActive = true;
        publicConfig.addRequested = true;
        publicConfig.selectedItem.PublicConfigJsonValues = $.trim(angular.toJson(publicConfig.submitValue));
        ajax.call(cmsServerConfig.configApiServerPath+'bankpaymentpublicconfig/edit', publicConfig.selectedItem, 'PUT').success(function (response) {
            rashaErManage.checkAction(response);
            publicConfig.busyIndicator.isActive = false;
            publicConfig.addRequested = false;
            publicConfig.closeModal();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            publicConfig.busyIndicator.isActive = false;
            publicConfig.addRequested = false;
        });
    }

    publicConfig.goToPrivateConfig = function (selectedId) {
        $state.go("index.bankpaymentprivatesiteconfig", { publicConfigId: selectedId });
    }

    //TreeControl
    publicConfig.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        dirSelectable: true
    }
    publicConfig.onNodeToggle = function (node, expanded) {
        if (expanded) {
            node.Children = [];
            var filterModel = { Filters: [] };
            var originalName = node.Title;
            node.messageText = " در حال بارگذاری...";
            filterModel.Filters.push({ PropertyName: "LinkParentId", SearchType: 0, IntValue1: node.Id });
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/GetAll", filterModel, 'POST').success(function (response1) {
                angular.forEach(response1.ListItems, function (value, key) {
                    node.Children.push(value);
                });
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", node.Id, 'POST').success(function (response2) {
                    angular.forEach(response2.ListItems, function (value, key) {
                        node.Children.push(value);
                    });
                    node.messageText = "";
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
        }
    }
    publicConfig.onSelection = function (node, selected) {
        if (!selected) {
            publicConfig.selectedItem.LinkModuleFileLogoId = null;
            publicConfig.selectedItem.previewImageSrc = null;
            return;
        }
        publicConfig.selectedItem.LinkModuleFileLogoId = node.Id;
        publicConfig.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            publicConfig.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);