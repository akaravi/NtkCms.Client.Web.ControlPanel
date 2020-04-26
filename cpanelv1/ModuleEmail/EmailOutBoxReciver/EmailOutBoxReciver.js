app.controller("emailOutBoxReciverController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$builder', '$state', '$filter','$stateParams', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $builder, $state, $filter,$stateParams) {
    var emailOutBoxReciver = this;
    emailOutBoxReciver.ManageUserAccessControllerTypes = [];

    emailOutBoxReciver.selectedOutBoxContent = {
        Id: $stateParams.OutBoxContentId
    };
    emailOutBoxReciver.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) emailOutBoxReciver.itemRecordStatus = itemRecordStatus;

    emailOutBoxReciver.init = function () {
        emailOutBoxReciver.busyIndicator.isActive = true;


        /*if (emailOutBoxReciver.selectedOutBoxContent.Id == 0 || emailOutBoxReciver.selectedOutBoxContent.Id == null) {
            $state.go("index.emailoutboxcontent");
            return;
        }*/
        var engine = {
            Filters: [{
                PropertyName: "Id",
                IntValue1: emailOutBoxReciver.selectedOutBoxContent.Id
            }]
        };
        ajax.call(cmsServerConfig.configApiServerPath+'emailOutBoxContent/getall', engine, 'POST').success(function(response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            emailOutBoxReciver.selectedOutBoxContent = response.Item;
        }).error(function(data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });

        emailOutBoxReciver.busyIndicator.isActive = true;
        var filterModel = {
            PropertyName: "LinkOutBoxContentId",
            SearchType: 0,
            IntValue1: emailOutBoxReciver.selectedOutBoxContent.Id
        };
        emailOutBoxReciver.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
        emailOutBoxReciver.gridOptions.advancedSearchData.engine.RowPerPage = 20;

        ajax.call(cmsServerConfig.configApiServerPath+"emailOutBoxReciver/getall", emailOutBoxReciver.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            emailOutBoxReciver.ListItems = response.ListItems;
            emailOutBoxReciver.gridOptions.fillData(emailOutBoxReciver.ListItems, response.resultAccess);
            emailOutBoxReciver.gridOptions.currentPageNumber = response.CurrentPageNumber;
            emailOutBoxReciver.gridOptions.totalRowCount = response.TotalRowCount;
            emailOutBoxReciver.gridOptions.rowPerPage = response.RowPerPage;
            emailOutBoxReciver.gridOptions.maxSize = 5;
            var model = {};
            model.SortType = 0;
            model.SortColumn = "Id";
            emailOutBoxReciver.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            emailOutBoxReciver.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
   /* emailOutBoxReciver.addRequested = false;
    emailOutBoxReciver.openAddModal = function () {
        if (buttonIsPressed) { return };
        emailOutBoxReciver.modalTitle = 'اضافه';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'emailOutBoxReciver/GetViewModel', '', 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            emailOutBoxReciver.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleEmail/emailOutBoxReciver/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    emailOutBoxReciver.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        emailOutBoxReciver.addRequested = true;
        emailOutBoxReciver.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'emailOutBoxReciver/add', emailOutBoxReciver.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                emailOutBoxReciver.ListItems.unshift(response.Item);
                emailOutBoxReciver.gridOptions.fillData(emailOutBoxReciver.ListItems);
                emailOutBoxReciver.addRequested = false;
                emailOutBoxReciver.busyIndicator.isActive = false;
                emailOutBoxReciver.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            emailOutBoxReciver.addRequested = false;
            emailOutBoxReciver.busyIndicator.isActive = false;

        });
    }

    emailOutBoxReciver.autoAdd = function () {
        emailOutBoxReciver.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'emailOutBoxReciver/autoadd', { LinkSourceId: emailOutBoxReciver.selectedSourceId }, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            emailOutBoxReciver.busyIndicator.isActive = false;
            emailOutBoxReciver.init();
        }).error(function (data, errCode, c, d) {
            emailOutBoxReciver.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }*/

    emailOutBoxReciver.dataForTheTree = [];

 /*   emailOutBoxReciver.openEditModal = function () {
        emailOutBoxReciver.modalTitle = 'ویرایش';
        if (!emailOutBoxReciver.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        emailOutBoxReciver.defaultValue = {};
        $builder.removeAllFormObject('default');
        var engine = { Filters: [{ PropertyName: "Id", IntValue1: emailOutBoxReciver.gridOptions.selectedRow.item.Id }] };

        emailOutBoxReciver.addRequested = true;
        emailOutBoxReciver.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'emailOutBoxReciver/getonewithjsonformatter', engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            emailOutBoxReciver.selectedItem = response.Item;

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
                                    emailOutBoxReciver.defaultValue[i] = itemValue.value;
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
                emailOutBoxReciver.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) {
                    Array.prototype.push.apply(emailOutBoxReciver.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (emailOutBoxReciver.selectedItem.LinkModuleFileLogoId > 0)
                        emailOutBoxReciver.onSelection({ Id: emailOutBoxReciver.selectedItem.LinkModuleFileLogoId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleEmail/emailOutBoxReciver/edit.html',
                        scope: $scope
                    });
                    emailOutBoxReciver.addRequested = false;
                    emailOutBoxReciver.busyIndicator.isActive = false;
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

    emailOutBoxReciver.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        emailOutBoxReciver.addRequested = true;
        emailOutBoxReciver.busyIndicator.isActive = true;

        emailOutBoxReciver.selectedItem.PublicConfigJsonValues = $.trim(angular.toJson(emailOutBoxReciver.submitValue));

        ajax.call(cmsServerConfig.configApiServerPath+'emailOutBoxReciver/edit', emailOutBoxReciver.selectedItem, 'PUT').success(function (response) {
            emailOutBoxReciver.addRequested = false;
            emailOutBoxReciver.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                emailOutBoxReciver.replaceItem(emailOutBoxReciver.selectedItem.Id, response.Item);
                emailOutBoxReciver.gridOptions.fillData(emailOutBoxReciver.ListItems, response.resultAccess);
                emailOutBoxReciver.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            emailOutBoxReciver.addRequested = false;
            emailOutBoxReciver.busyIndicator.isActive = false;
        });
    }*/

    emailOutBoxReciver.closeModal = function () {
        $modalStack.dismissAll();
    };

    emailOutBoxReciver.replaceItem = function (oldId, newItem) {
        angular.forEach(emailOutBoxReciver.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = emailOutBoxReciver.ListItems.indexOf(item);
                emailOutBoxReciver.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            emailOutBoxReciver.ListItems.unshift(newItem);
    }

   /* emailOutBoxReciver.deleteRow = function () {
        if (buttonIsPressed) { return };
        if (!emailOutBoxReciver.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'emailOutBoxReciver/GetOne', emailOutBoxReciver.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    emailOutBoxReciver.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'emailOutBoxReciver/delete', emailOutBoxReciver.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            emailOutBoxReciver.replaceItem(emailOutBoxReciver.selectedItemForDelete.Id);
                            emailOutBoxReciver.gridOptions.fillData(emailOutBoxReciver.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });
    }*/

    emailOutBoxReciver.searchData = function () {
        emailOutBoxReciver.gridOptions.serachData();
    }

    emailOutBoxReciver.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'ReciverRecordStatus', displayName: 'ReciverRecordStatus', sortable: true, type: 'string' },
            { name: 'Receiver', displayName: 'Receiver', sortable: true, type: 'string' },
            { name: 'Amount', displayName: 'Amount', sortable: true, type: 'integer' },
            { name: 'LastStatusMessage', displayName: 'LastStatusMessage', sortable: true, type: 'string' },
            { name: 'GetApiOnSendInfo', displayName: 'GetApiOnSendInfo', sortable: true, type: 'string' },
            { name: 'GetApiOnDeliveryInfo', displayName: 'GetApiOnDeliveryInfo', sortable: true, type: 'string' },
            { name: 'GetApiDeliveryStatus', displayName: 'GetApiDeliveryStatus', sortable: true, type: 'string' },
            //{ name: 'PublicConfigJsonValues', displayName: 'تنظیمات', sortable: true, type: 'string', displayForce: true, template: '<button class="btn btn-success" ng-click="emailOutBoxReciver.goToPrivateConfig(x.Id)"><i class="fa fa-cog" aria-hidden="false"></i>&nbsp;اختصاصی</button>' }
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

    emailOutBoxReciver.gridOptions.reGetAll = function () {
        emailOutBoxReciver.init();
    }

    emailOutBoxReciver.gridOptions.onRowSelected = function () { }

    //Export Report 
    emailOutBoxReciver.exportFile = function () {
        emailOutBoxReciver.addRequested = true;
        emailOutBoxReciver.gridOptions.advancedSearchData.engine.ExportFile = emailOutBoxReciver.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreSite/exportfile', emailOutBoxReciver.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            emailOutBoxReciver.addRequested = false;
            rashaErManage.checkAction(response);
            emailOutBoxReciver.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //emailOutBoxReciver.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    emailOutBoxReciver.toggleExportForm = function () {
        emailOutBoxReciver.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        emailOutBoxReciver.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        emailOutBoxReciver.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        emailOutBoxReciver.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleEmail/emailOutBoxReciver/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    emailOutBoxReciver.rowCountChanged = function () {
        if (!angular.isDefined(emailOutBoxReciver.ExportFileClass.RowCount) || emailOutBoxReciver.ExportFileClass.RowCount > 5000)
            emailOutBoxReciver.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    emailOutBoxReciver.getCount = function () {
        emailOutBoxReciver.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+"emailOutBoxReciver/count", emailOutBoxReciver.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            emailOutBoxReciver.addRequested = false;
            rashaErManage.checkAction(response);
            emailOutBoxReciver.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            emailOutBoxReciver.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    emailOutBoxReciver.openBaseConfigModal = function (selectedId) {
        emailOutBoxReciver.defaultValue = {};
        $builder.removeAllFormObject('default');
        var engine = { Filters: [{ PropertyName: "Id", IntValue1: selectedId }] };
        emailOutBoxReciver.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+"emailOutBoxReciver/getonewithjsonformatter", engine, 'POST').success(function (response) {
            emailOutBoxReciver.addRequested = false;
            if (response.IsSuccess) {
                emailOutBoxReciver.selectedItem = response.Item;
                $modal.open({
                    templateUrl: 'cpanelv1/ModuleEmail/emailOutBoxReciver/preview.html',
                    scope: $scope
                });
                $builder.removeAllFormObject('default');
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
                            //تخصیص مقادیر فرم با تشخیص نام فیلد
                            if (response.Item.PublicConfigJsonValues != null && response.Item.PublicConfigJsonValues != "") {
                                values = $.parseJSON(response.Item.PublicConfigJsonValues);
                                $.each(values, function (iValue, itemValue) {
                                    if (item.FieldName == itemValue.fieldname)
                                        emailOutBoxReciver.defaultValue[i] = itemValue.value;
                                });
                            }
                        }
                    });
                }
            }
        }).error(function (data, errCode, c, d) {
            emailOutBoxReciver.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    emailOutBoxReciver.saveSubmitValues = function () {
        emailOutBoxReciver.busyIndicator.isActive = true;
        emailOutBoxReciver.addRequested = true;
        emailOutBoxReciver.selectedItem.PublicConfigJsonValues = $.trim(angular.toJson(emailOutBoxReciver.submitValue));
        ajax.call(cmsServerConfig.configApiServerPath+'emailOutBoxReciver/edit', emailOutBoxReciver.selectedItem, 'PUT').success(function (response) {
            rashaErManage.checkAction(response);
            emailOutBoxReciver.busyIndicator.isActive = false;
            emailOutBoxReciver.addRequested = false;
            emailOutBoxReciver.closeModal();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            emailOutBoxReciver.busyIndicator.isActive = false;
            emailOutBoxReciver.addRequested = false;
        });
    }
    emailOutBoxReciver.changeState = function (state) {
        $state.go("index." + state);
    }
    emailOutBoxReciver.goToPrivateConfig = function (selectedId) {
        $state.go("index.bankpaymentprivatesiteconfig", { emailOutBoxReciverId: selectedId });
    }

    //TreeControl
    emailOutBoxReciver.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        dirSelectable: true
    }
    emailOutBoxReciver.onNodeToggle = function (node, expanded) {
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
    emailOutBoxReciver.onSelection = function (node, selected) {
        if (!selected) {
            emailOutBoxReciver.selectedItem.LinkModuleFileLogoId = null;
            emailOutBoxReciver.selectedItem.previewImageSrc = null;
            return;
        }
        emailOutBoxReciver.selectedItem.LinkModuleFileLogoId = node.Id;
        emailOutBoxReciver.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            emailOutBoxReciver.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);