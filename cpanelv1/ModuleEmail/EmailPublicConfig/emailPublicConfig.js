app.controller("emailPublicConfigCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$builder', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $builder, $state, $filter) {
    var emailPublicConfig = this;
    emailPublicConfig.ManageUserAccessControllerTypes = [];

    emailPublicConfig.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) emailPublicConfig.itemRecordStatus = itemRecordStatus;

    emailPublicConfig.init = function () {
        emailPublicConfig.busyIndicator.isActive = true;
        emailPublicConfig.gridOptions.advancedSearchData.engine.RowPerPage = 20;
        ajax.call(cmsServerConfig.configApiServerPath+"EmailPublicConfig/getall", emailPublicConfig.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            emailPublicConfig.ListItems = response.ListItems;
            emailPublicConfig.gridOptions.fillData(emailPublicConfig.ListItems, response.resultAccess);
            emailPublicConfig.gridOptions.currentPageNumber = response.CurrentPageNumber;
            emailPublicConfig.gridOptions.totalRowCount = response.TotalRowCount;
            emailPublicConfig.gridOptions.rowPerPage = response.RowPerPage;
            emailPublicConfig.gridOptions.maxSize = 5;
            var model = {};
            model.SortType = 0;
            model.SortColumn = "Id";
            emailPublicConfig.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            emailPublicConfig.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    emailPublicConfig.addRequested = false;
   


    emailPublicConfig.autoAdd = function () {
        emailPublicConfig.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'EmailPublicConfig/autoadd', { LinkSourceId: emailPublicConfig.selectedSourceId }, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            emailPublicConfig.busyIndicator.isActive = false;
            emailPublicConfig.init();
        }).error(function (data, errCode, c, d) {
            emailPublicConfig.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    emailPublicConfig.dataForTheTree = [];

    emailPublicConfig.openEditModal = function () {
        emailPublicConfig.modalTitle = 'ویرایش';
        if (!emailPublicConfig.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        emailPublicConfig.defaultValue = {};
        $builder.removeAllFormObject('default');
        var engine = { Filters: [{ PropertyName: "Id", IntValue1: emailPublicConfig.gridOptions.selectedRow.item.Id }] };

        emailPublicConfig.addRequested = true;
        emailPublicConfig.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'EmailPublicConfig/getonewithjsonformatter', engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            emailPublicConfig.selectedItem = response.Item;

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
                                    emailPublicConfig.defaultValue[i] = itemValue.value;
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
                emailPublicConfig.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) {
                    Array.prototype.push.apply(emailPublicConfig.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (emailPublicConfig.selectedItem.LinkModuleFileLogoId > 0)
                        emailPublicConfig.onSelection({ Id: emailPublicConfig.selectedItem.LinkModuleFileLogoId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleEmail/EmailPublicConfig/edit.html',
                        scope: $scope
                    });
                    emailPublicConfig.addRequested = false;
                    emailPublicConfig.busyIndicator.isActive = false;
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

    emailPublicConfig.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        emailPublicConfig.addRequested = true;
        emailPublicConfig.busyIndicator.isActive = true;

        emailPublicConfig.selectedItem.PublicConfigJsonValues = $.trim(angular.toJson(emailPublicConfig.submitValue));

        ajax.call(cmsServerConfig.configApiServerPath+'EmailPublicConfig/edit', emailPublicConfig.selectedItem, 'PUT').success(function (response) {
            emailPublicConfig.addRequested = false;
            emailPublicConfig.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                emailPublicConfig.replaceItem(emailPublicConfig.selectedItem.Id, response.Item);
                emailPublicConfig.gridOptions.fillData(emailPublicConfig.ListItems, response.resultAccess);
                emailPublicConfig.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            emailPublicConfig.addRequested = false;
            emailPublicConfig.busyIndicator.isActive = false;
        });
    }

    emailPublicConfig.closeModal = function () {
        $modalStack.dismissAll();
    };

    emailPublicConfig.replaceItem = function (oldId, newItem) {
        angular.forEach(emailPublicConfig.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = emailPublicConfig.ListItems.indexOf(item);
                emailPublicConfig.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            emailPublicConfig.ListItems.unshift(newItem);
    }

    emailPublicConfig.deleteRow = function () {
        if (buttonIsPressed) { return };
        if (!emailPublicConfig.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'EmailPublicConfig/GetOne', emailPublicConfig.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    emailPublicConfig.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'EmailPublicConfig/delete', emailPublicConfig.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            emailPublicConfig.replaceItem(emailPublicConfig.selectedItemForDelete.Id);
                            emailPublicConfig.gridOptions.fillData(emailPublicConfig.ListItems);
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

    emailPublicConfig.searchData = function () {
        emailPublicConfig.gridOptions.serachData();
    }

    emailPublicConfig.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'ClassName', displayName: 'عنوان کلاس', sortable: true, type: 'string' },
            { name: 'PublicConfigJsonValues', displayName: 'تنظیمات', sortable: true, type: 'string', displayForce: true, template: '<button class="btn btn-success" ng-click="emailPublicConfig.goToPrivateConfig(x.Id)"><i class="fa fa-cog" aria-hidden="false"></i>&nbsp;مسیرها</button>' }
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

    emailPublicConfig.gridOptions.reGetAll = function () {
        emailPublicConfig.init();
    }

    emailPublicConfig.gridOptions.onRowSelected = function () { }

    emailPublicConfig.columnCheckbox = false;
    emailPublicConfig.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (emailPublicConfig.gridOptions.columnCheckbox) {
            for (var i = 0; i < emailPublicConfig.gridOptions.columns.length; i++) {
                //emailPublicConfig.gridOptions.columns[i].visible = $("#" + emailPublicConfig.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + emailPublicConfig.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                emailPublicConfig.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = emailPublicConfig.gridOptions.columns;
            for (var i = 0; i < emailPublicConfig.gridOptions.columns.length; i++) {
                emailPublicConfig.gridOptions.columns[i].visible = true;
                var element = $("#" + emailPublicConfig.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + emailPublicConfig.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < emailPublicConfig.gridOptions.columns.length; i++) {
            console.log(emailPublicConfig.gridOptions.columns[i].name.concat(".visible: "), emailPublicConfig.gridOptions.columns[i].visible);
        }
        emailPublicConfig.gridOptions.columnCheckbox = !emailPublicConfig.gridOptions.columnCheckbox;
    }
    //Export Report 
    emailPublicConfig.exportFile = function () {
        emailPublicConfig.addRequested = true;
        emailPublicConfig.gridOptions.advancedSearchData.engine.ExportFile = emailPublicConfig.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreSite/exportfile', emailPublicConfig.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            emailPublicConfig.addRequested = false;
            rashaErManage.checkAction(response);
            emailPublicConfig.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //emailPublicConfig.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    emailPublicConfig.toggleExportForm = function () {
        emailPublicConfig.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        emailPublicConfig.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        emailPublicConfig.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        emailPublicConfig.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleEmail/EmailPublicConfig/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    emailPublicConfig.rowCountChanged = function () {
        if (!angular.isDefined(emailPublicConfig.ExportFileClass.RowCount) || emailPublicConfig.ExportFileClass.RowCount > 5000)
            emailPublicConfig.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    emailPublicConfig.getCount = function () {
        emailPublicConfig.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+"EmailPublicConfig/count", emailPublicConfig.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            emailPublicConfig.addRequested = false;
            rashaErManage.checkAction(response);
            emailPublicConfig.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            emailPublicConfig.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    emailPublicConfig.openBaseConfigModal = function (selectedId) {
        emailPublicConfig.defaultValue = {};
        $builder.removeAllFormObject('default');
        var engine = { Filters: [{ PropertyName: "Id", IntValue1: selectedId }] };
        emailPublicConfig.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+"EmailPublicConfig/getonewithjsonformatter", engine, 'POST').success(function (response) {
            emailPublicConfig.addRequested = false;
            if (response.IsSuccess) {
                emailPublicConfig.selectedItem = response.Item;
                $modal.open({
                    templateUrl: 'cpanelv1/ModuleEmail/EmailPublicConfig/preview.html',
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
                                        emailPublicConfig.defaultValue[i] = itemValue.value;
                                });
                            }
                        }
                    });
                }
            }
        }).error(function (data, errCode, c, d) {
            emailPublicConfig.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    emailPublicConfig.saveSubmitValues = function () {
        emailPublicConfig.busyIndicator.isActive = true;
        emailPublicConfig.addRequested = true;
        emailPublicConfig.selectedItem.PublicConfigJsonValues = $.trim(angular.toJson(emailPublicConfig.submitValue));
        ajax.call(cmsServerConfig.configApiServerPath+'EmailPublicConfig/edit', emailPublicConfig.selectedItem, 'PUT').success(function (response) {
            rashaErManage.checkAction(response);
            emailPublicConfig.busyIndicator.isActive = false;
            emailPublicConfig.addRequested = false;
            emailPublicConfig.closeModal();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            emailPublicConfig.busyIndicator.isActive = false;
            emailPublicConfig.addRequested = false;
        });
    }

    emailPublicConfig.goToPrivateConfig = function (selectedId) {
        $state.go("index.emailprivatesiteconfig", { publicConfigId: selectedId });
    }
    emailPublicConfig.goToCompany = function () {
        $state.go("index.emailapipathcompany");
    }
    //TreeControl
    emailPublicConfig.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        dirSelectable: true
    }
    emailPublicConfig.onNodeToggle = function (node, expanded) {
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
    emailPublicConfig.onSelection = function (node, selected) {
        if (!selected) {
            emailPublicConfig.selectedItem.LinkModuleFileLogoId = null;
            emailPublicConfig.selectedItem.previewImageSrc = null;
            return;
        }
        emailPublicConfig.selectedItem.LinkModuleFileLogoId = node.Id;
        emailPublicConfig.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            emailPublicConfig.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);