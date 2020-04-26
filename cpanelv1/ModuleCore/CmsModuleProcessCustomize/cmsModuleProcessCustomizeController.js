app.controller("cmsModuleProcessCustomizeGridCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$builder', '$stateParams', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $builder, $stateParams, $state, $filter) {
    var cmsMdlPrcCustm = this;
    cmsMdlPrcCustm.cmsModulesListItems = [];

    //cmsMdlPrcCustm.form = $builder.forms['default'];

    if (itemRecordStatus) cmsMdlPrcCustm.itemRecordStatus = itemRecordStatus;

    cmsMdlPrcCustm.changeState = function(state) {
        $state.go("index." + state);
    }
    // Show Category Loading Indicator
    cmsMdlPrcCustm.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }

    cmsMdlPrcCustm.formBuilderBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    cmsMdlPrcCustm.LinkProcessCustomizeDependenceBeforRunIdSelector = {
            displayMember: 'Title',
            id: 'Id',
            fId: 'LinkProcessCustomizeDependenceBeforRunId',
            url: 'cmsmoduleprocesscustomize',
            scope: cmsMdlPrcCustm,
            columnOptions: {
                columns: [
                    { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
                    { name: 'Title', displayName: 'عنوان', sortable: true, type: "string"}
                ]
            }
        }
        cmsMdlPrcCustm.selectedModuleProcess = {
            Id: $stateParams.cmsModulePrcId
        };
    cmsMdlPrcCustm.init = function () {
        cmsMdlPrcCustm.busyIndicator.isActive = true;

        if (cmsMdlPrcCustm.selectedModuleProcess.Id == 0 || cmsMdlPrcCustm.selectedModuleProcess.Id == null) {
            $state.go("index.cmsmoduleprocess");
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcess/GetOne', cmsMdlPrcCustm.selectedModuleProcess.Id, 'GET').success(function(response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            cmsMdlPrcCustm.selectedModuleProcess = response.Item;
        }).error(function(data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });

        cmsMdlPrcCustm.busyIndicator.isActive = true;
        var filterModel = {
            PropertyName: "LinkModuleProcessId",
            SearchType: 0,
            IntValue1: cmsMdlPrcCustm.selectedModuleProcess.Id
        };
        cmsMdlPrcCustm.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
        ajax.call(cmsServerConfig.configApiServerPath+"CoreModuleProcessCustomize/getall", cmsMdlPrcCustm.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            cmsMdlPrcCustm.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            cmsMdlPrcCustm.ListItems = response.ListItems;
            //cmsModuleSitegrd.gridOptions.resultAccess = response.resultAccess;//دسترسی ها نمایش
            cmsMdlPrcCustm.gridOptions.fillData(cmsMdlPrcCustm.ListItems, response.resultAccess); // Send Access as an arguman
            cmsMdlPrcCustm.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsMdlPrcCustm.gridOptions.totalRowCount = response.TotalRowCount;
            cmsMdlPrcCustm.gridOptions.rowPerPage = response.RowPerPage;
            cmsMdlPrcCustm.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            cmsMdlPrcCustm.busyIndicator.isActive = false;
            cmsMdlPrcCustm.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"CoreModule/getall", {}, 'POST').success(function (response) {

            rashaErManage.checkAction(response);
            cmsMdlPrcCustm.cmsModulesListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }

    cmsMdlPrcCustm.addRequested = false;
    cmsMdlPrcCustm.openAddModal = function () {
        cmsMdlPrcCustm.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcessCustomize/GetViewModel', '', 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsMdlPrcCustm.selectedItem = response.Item;
            cmsMdlPrcCustm.selectedItem.LinkModuleId = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsModuleProcessCustomize/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    cmsMdlPrcCustm.autoAdd = function () {
        cmsMdlPrcCustm.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcessCustomize/AutoAdd', '', 'POST').success(function (response) {
            cmsMdlPrcCustm.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            cmsMdlPrcCustm.init();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsMdlPrcCustm.addNewRow = function (frm) {
        if (frm.$invalid)
            return;
        cmsMdlPrcCustm.addRequested = true;
        cmsMdlPrcCustm.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcessCustomize/add', cmsMdlPrcCustm.selectedItem, 'POST').success(function (response) {
            cmsMdlPrcCustm.addRequested = false;
            cmsMdlPrcCustm.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsMdlPrcCustm.ListItems.unshift(response.Item);
                cmsMdlPrcCustm.gridOptions.fillData(cmsMdlPrcCustm.ListItems);
                cmsMdlPrcCustm.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsMdlPrcCustm.addRequested = false;
            cmsMdlPrcCustm.busyIndicator.isActive = false;
        });
    }

    // Open Edit Modal
    cmsMdlPrcCustm.openEditModal = function () {
        cmsMdlPrcCustm.modalTitle = 'ویرایش';
        if (!cmsMdlPrcCustm.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        cmsMdlPrcCustm.busyIndicator.isActive = true;
        cmsMdlPrcCustm.isLoading = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcessCustomize/GetOne', cmsMdlPrcCustm.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            cmsMdlPrcCustm.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            cmsMdlPrcCustm.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsModuleProcessCustomize/edit.html',
                scope: $scope
            });
            cmsMdlPrcCustm.onModuleChange(cmsMdlPrcCustm.selectedItem.virtual_CmsModuleProcess.LinkModuleId);
            cmsMdlPrcCustm.isLoading = false;
        }).error(function (data, errCode, c, d) {
            cmsMdlPrcCustm.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsMdlPrcCustm.editRow = function (frm) {
        if (frm.$invalid)
            return;
        var myControlerAdd = "";
        if (cmsMdlPrcCustm.selectedItem.AutoEdit) myControlerAdd = "Auto";
        cmsMdlPrcCustm.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcessCustomize/edit' + myControlerAdd, cmsMdlPrcCustm.selectedItem, 'PUT').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsMdlPrcCustm.addRequested = false;
                cmsMdlPrcCustm.replaceItem(cmsMdlPrcCustm.selectedItem.Id, response.Item);
                cmsMdlPrcCustm.gridOptions.fillData(cmsMdlPrcCustm.ListItems);
                cmsMdlPrcCustm.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsMdlPrcCustm.addRequested = false;
        });
    }

    cmsMdlPrcCustm.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsMdlPrcCustm.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsMdlPrcCustm.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsMdlPrcCustm.ListItems.indexOf(item);
                cmsMdlPrcCustm.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsMdlPrcCustm.ListItems.unshift(newItem);
    }

    cmsMdlPrcCustm.deleteRow = function () {
        if (!cmsMdlPrcCustm.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(cmsMdlPrcCustm.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcessCustomize/GetOne', cmsMdlPrcCustm.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsMdlPrcCustm.selectedItemForDelete = response.Item;
                    console.log(cmsMdlPrcCustm.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcessCustomize/delete', cmsMdlPrcCustm.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsMdlPrcCustm.replaceItem(cmsMdlPrcCustm.selectedItemForDelete.Id);
                            cmsMdlPrcCustm.gridOptions.fillData(cmsMdlPrcCustm.ListItems);
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

    //cmsMdlPrcCustm.searchData = function () {
    //    cmsMdlPrcCustm.gridOptions.serachData();
    //}

    cmsMdlPrcCustm.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'virtual_CmsModuleProcess.virtual_CmsModule.Title', displayName: 'ماژول', sortable: true, type: 'string' },
            { name: 'virtual_CmsModuleProcess.Title', displayName: 'فعالیت ماژول', sortable: true, type: 'string' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'TitleEn', displayName: 'عنوان لاتین', sortable: true, type: 'string' },
            { name: 'CmsModuleProcess.Title', displayName: 'فعّالیت ماژول', sortable: true, type: 'link', displayForce: true },
            { name: 'ActionButton', displayName: 'طرّاحی مقادیر ورودی', sortable: true, displayForce: true, template: '<button class="btn btn-success" ng-show="cmsMdlPrcCustm.gridOptions.resultAccess.AccessEditRow" ng-click="cmsMdlPrcCustm.scrollToInputValueFormBuilderPanel(x)" title="طرّاحی مقادیر وردوی" type="button"><i class="fa fa-bars fa-1x" ></i></button>' }
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

    cmsMdlPrcCustm.openDateExpireDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            cmsMdlPrcCustm.focusExpireDate = true;
        });
    };
    cmsMdlPrcCustm.openDateNotificationForExpireDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            cmsMdlPrcCustm.focusNotificationForExpireDate = true;
        });
    };

    cmsMdlPrcCustm.gridOptions.reGetAll = function () {
        cmsMdlPrcCustm.init();
    }

    cmsMdlPrcCustm.gridOptions.onRowSelected = function () { }

    cmsMdlPrcCustm.isLoading = true;
    cmsMdlPrcCustm.onModuleChange = function (moduleId) {
        cmsMdlPrcCustm.cmsModulesProcessListItems = []; // Clear previous values
        var filterDataModel = {
            PropertyName: "LinkModuleId",
            IntValue1: parseInt(moduleId),
            SearchType: 0
        }
        var filterModuleId = { Filters: [], RowPerPage: 200 };
        filterModuleId.Filters.push(filterDataModel);
        cmsMdlPrcCustm.isLoading = true;
        ajax.call(cmsServerConfig.configApiServerPath+"CoreModuleProcess/getall", filterModuleId, 'POST').success(function (response) {
            cmsMdlPrcCustm.isLoading = false;
            rashaErManage.checkAction(response);
            cmsMdlPrcCustm.cmsModulesProcessListItems = response.ListItems;

            //if (cmsMdlPrcCustm.cmsModulesProcessListItems.length > 0)
            //   cmsMdlPrcCustm.selectedItem.LinkModuleProcessId = cmsMdlPrcCustm.cmsModulesProcessListItems[0].Id;  // Automatic assign first PageDependency; without this line LinkModuleProcessId will not be assigned
            if (cmsMdlPrcCustm.cmsModulesProcessListItems.length == 0) {
                cmsMdlPrcCustm.selectedItem.LinkModuleProcessId = null;
            }

        }).error(function (data, errCode, c, d) {
            cmsMdlPrcCustm.loadModuleProcesseListItemsIndicator = false;
            console.log(data);
        });
    }

    cmsMdlPrcCustm.LoadModuleOfProcess = function (moduleProcessId) {
        if (moduleProcessId != null) {
            cmsMdlPrcCustm.isLoading = true;
            cmsMdlPrcCustm.selectedItem.selectedModule = null;
            ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcess/GetOne', moduleProcessId, 'GET').success(function (response1) {
                rashaErManage.checkAction(response1);
                ajax.call(cmsServerConfig.configApiServerPath+'CoreModule/GetOne', response1.Item.LinkModuleId, 'GET').success(function (response2) {
                    cmsMdlPrcCustm.isLoading = false;
                    rashaErManage.checkAction(response2);
                    cmsMdlPrcCustm.selectedItem.LinkModuleId = response2.Item.Id;
                    cmsMdlPrcCustm.selectedItem.LinkModuleProcessId = moduleProcessId;
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

    // Show InputValue form builder and auto scroll to its position
    cmsMdlPrcCustm.scrollToInputValueFormBuilderPanel = function (item) {
        cmsMdlPrcCustm.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcessCustomize/GetOne', item.Id, 'GET').success(function (response) {
            cmsMdlPrcCustm.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            cmsMdlPrcCustm.selectedItem = response.Item;

            $builder.removeAllFormObject('default');
            var component = parseJSONcomponent(cmsMdlPrcCustm.selectedItem.ProcessInputValueForm);
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
            cmsMdlPrcCustm.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Show Preview form
    cmsMdlPrcCustm.showForm = function () {
        cmsMdlPrcCustm.formJson = $builder.forms['default'];
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCore/cmsModuleProcessCustomize/preview.html',
            scope: $scope
        });
    }

    // Save Input Value Form
    cmsMdlPrcCustm.saveProcessInputCustomizeValue = function () {
        cmsMdlPrcCustm.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcessCustomize/GetOne', cmsMdlPrcCustm.selectedItem.Id, 'GET').success(function (response1) {
            cmsMdlPrcCustm.busyIndicator.isActive = false;
            rashaErManage.checkAction(response1);
            cmsMdlPrcCustm.selectedItem = response1.Item;
            // $builder.forms['default'] -> get the form in Json format
            cmsMdlPrcCustm.selectedItem.ProcessInputValueForm = $.trim(angular.toJson($builder.forms['default']));
            cmsMdlPrcCustm.busyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcessCustomize/edit', cmsMdlPrcCustm.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    cmsMdlPrcCustm.closeModal();
                }
                cmsMdlPrcCustm.busyIndicator.isActive = false;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                cmsMdlPrcCustm.busyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            cmsMdlPrcCustm.busyIndicator.isActive = false;
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
    cmsMdlPrcCustm.getFromSystem = function () {
        $builder.removeAllFormObject('default');
        var CustomizeValue = JSON.parse(cmsMdlPrcCustm.selectedItem.ProcessInputCustomizeValue);
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

    //Get TotalRowCount
    cmsMdlPrcCustm.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"CoreModuleProcessCustomize/count", cmsMdlPrcCustm.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsMdlPrcCustm.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            cmsMdlPrcCustm.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);