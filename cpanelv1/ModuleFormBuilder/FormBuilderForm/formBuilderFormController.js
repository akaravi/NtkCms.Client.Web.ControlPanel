app.controller("formController", ["$scope","$state", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$builder', '$filter', '$window', function ($scope,$state, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $builder, $filter, $window) {
    var form = this;
    form.cmsModulesListItems = [];

    //form.form = $builder.forms['default'];

    if (itemRecordStatus != undefined) form.itemRecordStatus = itemRecordStatus;

    // Show Category Loading Indicator
    form.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }

    form.formBuilderBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }

    form.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FormBuilderForm/getall", form.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            form.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            form.ListItems = response.ListItems;
            //cmsModuleSitegrd.gridOptions.resultAccess = response.resultAccess;//دسترسی ها نمایش
            form.gridOptions.fillData(form.ListItems, response.resultAccess); // Send Access as an arguman
            form.gridOptions.currentPageNumber = response.CurrentPageNumber;
            form.gridOptions.totalRowCount = response.TotalRowCount;
            form.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            form.busyIndicator.isActive = false;
            form.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    form.addRequested = false;
    form.openAddModal = function () {
        form.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'formbuilderform/GetViewModel', '', 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            form.selectedItem = response.Item;
            form.selectedItem.LinkModuleId = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleFormBuilder/FormBuilderForm/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    form.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        form.addRequested = true;
        form.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+'formbuilderform/add', form.selectedItem, 'POST').success(function (response) {
            form.addRequested = false;
            form.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                form.ListItems.unshift(response.Item);
                form.gridOptions.fillData(form.ListItems);
                form.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            form.addRequested = false;
            form.busyIndicator.isActive = false;
        });
    }

    // Open Edit Modal
    form.openEditModal = function () {
        form.modalTitle = 'ویرایش';
        if (!form.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        form.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'formbuilderform/GetOne', form.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            form.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            form.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleFormBuilder/FormBuilderForm/edit.html',
                scope: $scope
            });
            form.selectedItem.LinkModuleId = null;
        }).error(function (data, errCode, c, d) {
            form.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }
    form.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        var myControlerAdd = "";
        if (form.selectedItem.AutoEdit) myControlerAdd = "Auto";
        ajax.call(cmsServerConfig.configApiServerPath+'formbuilderform/edit' + myControlerAdd, form.selectedItem, 'PUT').success(function (response) {
            form.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                form.addRequested = false;
                form.replaceItem(form.selectedItem.Id, response.Item);
                form.gridOptions.fillData(form.ListItems);
                form.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            form.addRequested = false;
        });
    }

    form.closeModal = function () {
        $modalStack.dismissAll();
    };

    form.replaceItem = function (oldId, newItem) {
        angular.forEach(form.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = form.ListItems.indexOf(item);
                form.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            form.ListItems.unshift(newItem);
    }

    form.deleteRow = function () {
        if (!form.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(form.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'formbuilderform/GetOne', form.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    form.selectedItemForDelete = response.Item;
                    console.log(form.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'formbuilderform/delete', form.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            form.replaceItem(form.selectedItemForDelete.Id);
                            form.gridOptions.fillData(form.ListItems);
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

    form.searchData = function () {
        //form.gridOptions.serachData();
        //form.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"FormBuilderForm/getall", form.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            //form.contentBusyIndicator.isActive = false;
            form.ListItems = response.ListItems;
            form.gridOptions.fillData(form.ListItems);
            form.gridOptions.currentPageNumber = response.CurrentPageNumber;
            form.gridOptions.totalRowCount = response.TotalRowCount;
            form.gridOptions.rowPerPage = response.RowPerPage;
            form.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            form.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    form.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' },
            { name: 'ActionButton2', displayName: 'طرّاحی مقادیر ورودی', sortable: true, displayForce: true, width: '185px', template: '<button class="btn btn-success" ng-show="form.gridOptions.resultAccess.AccessEditRow" ng-click="form.gotoFormBuilderValue(x.Id)" title=" مقادیر " type="button"><i class="fa fa-bars fa-1x" ></i></button>' },
            { name: 'ActionButton', displayName: 'طرّاحی مقادیر ورودی', sortable: true, displayForce: true, width: '185px', template: '<button class="btn btn-success" ng-show="form.gridOptions.resultAccess.AccessEditRow" ng-click="form.scrollToInputValueFormBuilderPanel(x)" title="طرّاحی مقادیر وردوی" type="button"><i class="fa fa-bars fa-1x" ></i></button>' }
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

    form.gridOptions.reGetAll = function () {
        form.init();
    }
    form.gotoFormBuilderValue = function (selectedId) {
        $state.go("index.formbuilderformsubmit", { FormBuilderId: selectedId });
    }
    form.gridOptions.onRowSelected = function () { }

    form.LoadcmsModulesProcessListItems = function (moduleId) {
        var select = document.getElementById("moduleProcess_comboBox");
        var length = select.options.length;
        for (var i = 0; i < length; i++) {
            select.options[i] = null;
        }

        var Filter_value = {
            PropertyName: "LinkModuleId",
            IntValue1: parseInt(moduleId),
            SearchType: 0
        }
        form.gridOptions.advancedSearchData.engine.Filters = null;
        form.gridOptions.advancedSearchData.engine.Filters = [];
        form.gridOptions.advancedSearchData.engine.Filters.push(Filter_value);

        form.loadModuleProcesseListItemsIndicator = true;
        ajax.call(cmsServerConfig.configApiServerPath+"CoreModuleProcess/getall", form.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            form.loadModuleProcesseListItemsIndicator = false;
            rashaErManage.checkAction(response);
            form.cmsModulesProcessListItems = response.ListItems;

            if (form.cmsModulesProcessListItems.length > 0)
                form.selectedItem.LinkModuleProcessId = form.cmsModulesProcessListItems[0].Id;  // Automatic assign first PageDependency; without this line LinkModuleProcessId will not be assigned
            if (form.cmsModulesProcessListItems.length == 0) {
                form.selectedItem.LinkModuleProcessId = null;
                $("#moduleProcess_comboBox").prop("selectedIndex", -1);
            }

        }).error(function (data, errCode, c, d) {
            form.loadModuleProcesseListItemsIndicator = false;
            console.log(data);
        });
    }

    // Show InputValue form builder and auto scroll to its position
    form.scrollToInputValueFormBuilderPanel = function (item) {
        form.gridOptions.selectedRow.item = item;
        form.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'formbuilderform/GetOne', item.Id, 'GET').success(function (response) {
            form.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            form.selectedItem = response.Item;

            $builder.removeAllFormObject('default');
            var component = parseJSONcomponent(form.selectedItem.JsonForm);
            if (component != null && component.length != undefined)
                $.each(component, function (i, item) {
                    $builder.addFormObject('default', item);
                });

            $("#inputValue_formBuilder").css("display", "");
            $('html, body').animate({
                scrollTop: $("#inputValue_formBuilder").offset().top
            }, 850);
        }).error(function (data, errCode, c, d) {
            form.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Show Preview form
    form.showForm = function () {
            //$builder.removeAllFormObject('default');
            //form.defaultValue = $builder.forms['default'];
            //$.each(form.defaultValue, function (i, item) {
            //    $builder.addFormObject('defaultValue', item);
            //});

        form.formJson = $builder.forms['default'];
        $modal.open({
            templateUrl: 'cpanelv1/ModuleFormBuilder/FormBuilderForm/preview.html',
            scope: $scope
        });
    }

    // Save Input Value Form
    form.saveFormValues = function () {
        form.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'formbuilderform/GetOne', form.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            form.busyIndicator.isActive = false;
            rashaErManage.checkAction(response1);
            form.selectedItem = response1.Item;
            // $builder.forms['default'] -> get the form in Json format
            form.selectedItem.JsonForm = $.trim(angular.toJson($builder.forms['default']));
            form.busyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+'formbuilderform/edit', form.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    form.replaceItem(form.gridOptions.selectedRow.item.Id, response2.Item);
                    form.gridOptions.fillData(form.ListItems);
                }
                form.busyIndicator.isActive = false;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                form.busyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            form.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    function parseJSONcomponent(str) {
        if (str == undefined || str == null || str == "")
            str = "";
        try {
            return JSON.parse(str);
        } catch (e) {
            return str = "";
        }
    }
 //Export Report 
    form.exportFile = function () {
        form.gridOptions.advancedSearchData.engine.ExportFile = form.ExportFileClass;
        form.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'BiographyContent/exportfile', form.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            form.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                form.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //form.closeModal();
            }
            form.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    form.toggleExportForm = function () {
        form.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        form.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        form.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        form.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleFormBuilder/FormBuilderForm/report.html',
            scope: $scope
        });
    }


    //Mr.Karavi 1395/4/31
    form.getFromSystem = function () {
        $builder.removeAllFormObject('default');
        var CustomizeValue = JSON.parse(form.selectedItem.JsonForm);
        if (CustomizeValue != undefined && CustomizeValue.length > 0) {
            $.each(CustomizeValue, function (i, item) {
                if (item.FieldDataSource != undefined && item.FieldDataSource.InputForm != undefined && item.FieldDataSource.InputForm != '') {
                    $builder.addFormObject('default', {
                        "component": "text",
                        "label": item.FieldDataSource.InputForm,
                        "description": item.FieldDescription
                    });
                }
            });
        }
    }
}]);