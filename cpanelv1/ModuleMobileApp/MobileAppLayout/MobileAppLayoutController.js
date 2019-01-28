app.controller("mobileAppLayoutController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$builder', '$stateParams', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $builder, $stateParams, $state, $filter) {
    var appLayout = this;
    if (itemRecordStatus != undefined) appLayout.itemRecordStatus = itemRecordStatus;
    appLayout.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
   appLayout.filePickerMainImage = {
      isActive: true,
      backElement: "filePickerMainImage",
      filename: null,
      fileId: null,
      multiSelect: false
    };
    appLayout.changeState = function (state) {
        $state.go("index." + state);
    }

    appLayout.selectedSourceId = $stateParams.sourceid;
    appLayout.selectedAppId = $stateParams.appid;
    appLayout.selectedAppTitle = $stateParams.apptitle;

    appLayout.init = function () {
        if ($stateParams.sourceid == null)
            appLayout.changeState("mobileappsource");
        appLayout.busyIndicator.isActive = true;
        if (appLayout.selectedSourceId != undefined || appLayout.selectedSourceId != null) {
            appLayout.gridOptions.advancedSearchData.engine.Filters.push({ PropertyName: "LinkSourceId", SearchType: 0, IntValue1: appLayout.selectedSourceId });
        }
        ajax.call(mainPathApi+"mobileappLayout/getall", appLayout.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            appLayout.busyIndicator.isActive = false;
            appLayout.ListItems = response.ListItems;
            appLayout.gridOptions.fillData(appLayout.ListItems, response.resultAccess);
            appLayout.gridOptions.currentPageNumber = response.CurrentPageNumber;
            appLayout.gridOptions.totalRowCount = response.TotalRowCount;
            appLayout.gridOptions.rowPerPage = response.RowPerPage;
            appLayout.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            appLayout.busyIndicator.isActive = false;
            appLayout.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });

        ajax.call(mainPathApi+"mobileappsource/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            appLayout.busyIndicator.isActive = false;
            appLayout.sourceListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            appLayout.busyIndicator.isActive = false;
            console.log(data);
        });
    }

    // Open Add Modal
    appLayout.busyIndicator.isActive = true;
    appLayout.addRequested = false;
    appLayout.openAddModal = function () {
        appLayout.modalTitle = 'اضافه';
        appLayout.filePickerMainImage.filename = "";
        appLayout.filePickerMainImage.fileId = null; 
        ajax.call(mainPathApi+'MobileAppLayout/getviewmodel', "0", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            appLayout.busyIndicator.isActive = false;
            appLayout.selectedItem = response.Item;
            //Set dataForTheTree
            appLayout.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(mainPathApi+"CmsFileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                appLayout.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(appLayout.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleMobileApp/MobileAppLayout/add.html',
                        scope: $scope
                    });
                    appLayout.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //-----
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    appLayout.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        appLayout.busyIndicator.isActive = true;
        appLayout.addRequested = true;
        ajax.call(mainPathApi+'MobileAppLayout/add', appLayout.selectedItem, 'POST').success(function (response) {
            appLayout.addRequested = false;
            appLayout.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                appLayout.ListItems.unshift(response.Item);
                appLayout.gridOptions.fillData(appLayout.ListItems);
                appLayout.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appLayout.busyIndicator.isActive = false;
            appLayout.addRequested = false;
        });
    }

    appLayout.autoAdd = function () {
        appLayout.busyIndicator.isActive = true;
        ajax.call(mainPathApi+'MobileAppLayout/autoadd', { LinkSourceId: appLayout.selectedSourceId }, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            appLayout.busyIndicator.isActive = false;
            appLayout.init();
        }).error(function (data, errCode, c, d) {
            appLayout.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    appLayout.openEditModal = function () {
        if (appLayout.addRequested)
            return;
        appLayout.modalTitle = 'ویرایش';
        if (!appLayout.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        appLayout.busyIndicator.isActive = true;
        appLayout.addRequested = true;
        ajax.call(mainPathApi+'MobileAppLayout/getviewmodel', appLayout.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            appLayout.selectedItem = response.Item;
        appLayout.filePickerMainImage.filename = null;
          appLayout.filePickerMainImage.fileId = null;
         if (response.Item.LinkMainImageId != null) {
            ajax
              .call(
                mainPathApi+"CmsFileContent/getviewmodel",
                response.Item.LinkMainImageId,
                "GET"
              )
              .success(function(response2) {
                buttonIsPressed = false;
                appLayout.filePickerMainImage.filename =
                  response2.Item.FileName;
                appLayout.filePickerMainImage.fileId = response2.Item.Id;
              })
              .error(function(data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
              });
          }
            //Set dataForTheTree
            appLayout.selectedNode = [];
            appLayout.expandedNodes = [];
            appLayout.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(mainPathApi+"CmsFileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                appLayout.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(appLayout.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (appLayout.selectedItem.LinkModuleFilePreviewImageId > 0)
                        appLayout.onSelection({ Id: appLayout.selectedItem.LinkModuleFilePreviewImageId }, true);
                    appLayout.addRequested = false;
                    appLayout.busyIndicator.isActive = false;
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleMobileApp/MobileAppLayout/edit.html',
                        scope: $scope
                    });
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

    // Edit a Content
    appLayout.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        appLayout.busyIndicator.isActive = true;
        ajax.call(mainPathApi+'MobileAppLayout/edit', appLayout.selectedItem, 'PUT').success(function (response) {
            appLayout.addRequested = true;
            rashaErManage.checkAction(response);
            appLayout.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                appLayout.addRequested = false;
                appLayout.replaceItem(appLayout.selectedItem.Id, response.Item);
                appLayout.gridOptions.fillData(appLayout.ListItems);
                appLayout.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appLayout.addRequested = false;
        });
    }

    appLayout.closeModal = function () {
        $modalStack.dismissAll();
    };

    appLayout.replaceItem = function (oldId, newItem) {
        angular.forEach(appLayout.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = appLayout.ListItems.indexOf(item);
                appLayout.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            appLayout.ListItems.unshift(newItem);
    }

    appLayout.deleteRow = function () {
        if (!appLayout.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                appLayout.busyIndicator.isActive = true;
                console.log(appLayout.gridOptions.selectedRow.item);
                ajax.call(mainPathApi+'MobileAppLayout/getviewmodel', appLayout.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    appLayout.selectedItemForDelete = response.Item;
                    ajax.call(mainPathApi+'MobileAppLayout/delete', appLayout.selectedItemForDelete, 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        appLayout.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            appLayout.replaceItem(appLayout.selectedItemForDelete.Id);
                            appLayout.gridOptions.fillData(appLayout.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        appLayout.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    appLayout.busyIndicator.isActive = false;

                });
            }
        });
    }

    appLayout.searchData = function () {
        appLayout.gridOptions.searchData();
    }

    appLayout.gridOptions = {
        columns: [
            { name: "Id", displayName: "کد سیستمی", sortable: true, type: "integer", visible: true },
            { name: 'LinkModuleFilePreviewImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnail: true, heightImg: 300, widthImg: 250 },
            { name: "Title", displayName: "عنوان", sortable: true, type: "string", visible: true },
            { name: "ClassName", displayName: "ClassName", sortable: true, type: "string", visible: true },
            { name: "virtual_Source.Title", displayName: "قالب", sortable: true, type: "string", displayForce: true, visible: true },
            { name: "JsonForm", displayName: "فرم ساز", sortable: true, displayForce: true, template: "<button class=\"btn btn-warning\" ng-show=\"appLayout.gridOptions.resultAccess.AccessAddRow\" ng-click=\"appLayout.scrollToFormBuilder(x)\" title=\"ساخت فرم\" type=\"button\"><i class=\"fa fa-paint-brush\" aria-hidden=\"true\"></i></button>" },
            { name: "JsonFormAdminSystemValue", displayName: "تنظیمات مدیر", sortable: true, displayForce: true, visible: 'appLayout.gridOptions.resultAccess.AccessEditField.indexOf("JsonFormAdminSystemValue")>-1', template: "<button class=\"btn btn-info\" ng-show=\"appLayout.gridOptions.resultAccess.AccessAddRow\" ng-click=\"appLayout.openAdminMainForm(x.Id)\" title=\"مقداردهی مقادیر پیش فرض\" type=\"button\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i></button>" },
            { name: "JsonFormDefaultValue", displayName: "پیش فرض", sortable: true, displayForce: true, template: "<button class=\"btn btn-success\" ng-show=\"appLayout.gridOptions.resultAccess.AccessAddRow\" ng-click=\"appLayout.openPreviewModal(x.Id)\" title=\"مقداردهی مقادیر پیش فرض\" type=\"button\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i></button>" }
        ],
        data: {},
        multiSelect: false,
        startDate: moment().format(),
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

    appLayout.gridOptions.reGetAll = function () {
        appLayout.init();
    }

    appLayout.gridOptions.onRowSelected = function () { }

    appLayout.columnCheckbox = false;

    appLayout.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (appLayout.gridOptions.columnCheckbox) {
            for (var i = 0; i < appLayout.gridOptions.columns.length; i++) {
                var element = $("#" + appLayout.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                appLayout.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = appLayout.gridOptions.columns;
            for (var i = 0; i < appLayout.gridOptions.columns.length; i++) {
                appLayout.gridOptions.columns[i].visible = true;
                var element = $("#" + appLayout.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + appLayout.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < appLayout.gridOptions.columns.length; i++) {
            console.log(appLayout.gridOptions.columns[i].name.concat(".visible: "), appLayout.gridOptions.columns[i].visible);
        }
        appLayout.gridOptions.columnCheckbox = !appLayout.gridOptions.columnCheckbox;
    }

    appLayout.scrollToFormBuilder = function (item) {
        appLayout.busyIndicator.isActive = true;
        ajax.call(mainPathApi+'MobileAppLayout/getviewmodel', item.Id, 'GET').success(function (response) {
            appLayout.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            appLayout.selectedItem = response.Item;

            $builder.removeAllFormObject('default');
            var component = parseJSONcomponent(appLayout.selectedItem.JsonForm);
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
            appLayout.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Show Preview form
    appLayout.showFormPreview = function () {
        appLayout.busyIndicator.isActive = true;
        appLayout.addRequested = true;
        var filterDataModel = { PropertyName: "LinkApplicationId", searchType: 0, IntValue1: appLayout.selectedAppId };
        var filterDataModel = { PropertyName: "LinkLayoutId", searchType: 0, IntValue1: appLayout.selectedSourceId };
        ajax.call(mainPathApi+'MobileAppLayoutvalue/getone', appLayout.selectedItem.Id, 'GET').success(function (response1) {
            appLayout.busyIndicator.isActive = false;
            appLayout.addRequested = false;
            appLayout.formJson = $builder.forms['default'];
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMobileApp/MobileAppLayout/preview.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            appLayout.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Save Input Value Form
    appLayout.saveProcessInputCustomizeValue = function () {
        appLayout.busyIndicator.isActive = true;
        appLayout.selectedLayoutId = appLayout.gridOptions.selectedRow.item.Id;       //Storing selected Layout Id for further uses
        ajax.call(mainPathApi+'MobileAppLayout/getviewmodel', appLayout.selectedItem.Id, 'GET').success(function (response1) {
            appLayout.busyIndicator.isActive = false;
            rashaErManage.checkAction(response1);
            appLayout.selectedItem = response1.Item;
            // $builder.forms['default'] -> get the form in Json format
            appLayout.selectedItem.JsonForm = $.trim(angular.toJson($builder.forms['default']));
            appLayout.busyIndicator.isActive = true;
            ajax.call(mainPathApi+'MobileAppLayout/edit', appLayout.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    appLayout.closeModal();
                }
                appLayout.busyIndicator.isActive = false;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                appLayout.busyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            appLayout.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    function parseJSONcomponent(str) {
        var defaultStr = '[]';
        if (str == undefined || str == null || str == "")
            str = defaultStr;
        try {
            JSON.parse(str);
        } catch (e) {
            str = defaultStr;
        }
        return $.parseJSON(str);
    }

    appLayout.getFromSystem = function () {
        // Get selected Layout to load form using JsonFormFormat in ViewModel
        appLayout.busyIndicator.isActive = true;
        var filterModel = { Filters: [] };
        filterModel.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: appLayout.gridOptions.selectedRow.item.Id });
        ajax.call(mainPathApi+'mobileapplayout/getonewithjsonformat', filterModel, 'POST').success(function (response) {
            appLayout.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                $builder.removeAllFormObject('default');
                //var customizeValue = JSON.parse(response.Item.JsonFormFormat);
                var customizeValue = response.Item.JsonFormFormatter;
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
            appLayout.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appLayout.busyIndicator.isActive = false;
        });
    }

    appLayout.defaultValue = {};

    // Show Preview form
    appLayout.openPreviewModal = function (layoutId) {
        appLayout.openPreviewForm = true;
        var filterDataModel = { PropertyName: "Id", searchType: 0, IntValue1: appLayout.layoutId };
        var engine = { Filters: [] };
        engine.Filters.push(filterDataModel);
        ajax.call(mainPathApi+'mobileapplayout/getviewmodel', layoutId, 'GET').success(function (response) {
            appLayout.selectedItem = response.Item;
            appLayout.formJson = $builder.forms['default'];
            $builder.removeAllFormObject('default');
            var component = $.parseJSON(response.Item.JsonForm);
            var values = $.parseJSON(response.Item.JsonFormDefaultValue);
            if (component != null && component.length != undefined)
                $.each(component, function (i, item) {
                    try {
                        $builder.addFormObject('default', item);
                        //تخصیص مقادیر فرم بر اساس نام فیلد
                        if (values != null && values.length != undefined)
                            $.each(values, function (iValue, itemValue) {
                                if (item.fieldname == itemValue.fieldname)
                                    appLayout.defaultValue[i] = itemValue.value;
                            });
                    } catch (e) {
                    }
                });

            $modal.open({
                templateUrl: 'cpanelv1/ModuleMobileApp/MobileAppLayout/preview.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    appLayout.openAdminMainForm = function (layoutId) {
        appLayout.openPreviewForm = false;
        var filterDataModel = { PropertyName: "Id", SearchType: 0, IntValue1: layoutId };
        var engine = { Filters: [] };
        engine.Filters.push(filterDataModel);
        ajax.call(mainPathApi+'mobileapplayout/getonewithjsonformat', engine, 'POST').success(function (response) {

            appLayout.selectedItem = response.Item;
            appLayout.formJson = $builder.forms['default'];
            $builder.removeAllFormObject('default');
            //var component = $.parseJSON(response.Item.JsonFormAdminSystemValue);
            if (response.IsSuccess) {
                // Load and set the values
                var values = $.parseJSON(response.Item.JsonFormAdminSystemValue);
                // Clear privous values in formBuilder
                if (values != null && values.length != undefined)
                    $.each(values, function (i, item) {
                        appLayout.defaultValue[item.id] = null;
                    });
                var component = response.Item.JsonFormAdminSystemFormatter;
                if (component != null && component.length > 0) {
                    $.each(component, function (i, item) {
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
                            //بارگذاری مقادیر براساس نام فیلد
                            if (values != null && values.length != undefined)
                                $.each(values, function (iValue, itemValue) {
                                    if (item.FieldName == itemValue.fieldname)
                                        appLayout.defaultValue[i] = itemValue.value;
                                });
                        }
                    });
                }
                $modal.open({
                    templateUrl: 'cpanelv1/ModuleMobileApp/MobileAppLayout/preview.html',
                    scope: $scope
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    appLayout.saveSubmitValues = function () {
        appLayout.busyIndicator.isActive = true;
        appLayout.addRequested = true;
        if (appLayout.openPreviewForm)
            appLayout.selectedItem.JsonFormDefaultValue = $.trim(angular.toJson(appLayout.submitValue));
        else
            appLayout.selectedItem.JsonFormAdminSystemValue = $.trim(angular.toJson(appLayout.submitValue));
        ajax.call(mainPathApi+'MobileAppLayout/edit', appLayout.selectedItem, 'PUT').success(function (response) {
            appLayout.addRequested = true;
            rashaErManage.checkAction(response);
            appLayout.busyIndicator.isActive = false;
            appLayout.addRequested = false;
            appLayout.closeModal();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            appLayout.busyIndicator.isActive = false;
            appLayout.addRequested = false;
        });
    }
    //TreeControl
    appLayout.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (appLayout.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    appLayout.onNodeToggle = function (node, expanded) {
        if (expanded) {
            node.Children = [];
            var filterModel = { Filters: [] };
            var originalName = node.Title;
            node.messageText = " در حال بارگذاری...";
            filterModel.Filters.push({ PropertyName: "LinkParentId", SearchType: 0, IntValue1: node.Id });
            ajax.call(mainPathApi+"CmsFileCategory/GetAll", filterModel, 'POST').success(function (response1) {
                angular.forEach(response1.ListItems, function (value, key) {
                    node.Children.push(value);
                });
                ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", node.Id, 'POST').success(function (response2) {
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

    appLayout.onSelection = function (node, selected) {
        if (!selected) {
            appLayout.selectedItem.LinkModuleFilePreviewImageId = null;
            appLayout.selectedItem.previewImageSrc = null;
            return;
        }
        appLayout.selectedItem.LinkModuleFilePreviewImageId = node.Id;
        appLayout.selectedItem.previewImageSrc = "CmsFiles/img/loader.gif";
        ajax.call(mainPathApi+"CmsFileContent/getviewmodel", node.Id, "GET").success(function (response) {
            appLayout.selectedItem.previewImageSrc = "/files/" + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
//upload file
    appLayout.uploadFile = function (index, uploadFile) {
      if ($("#save-icon" + index).hasClass("fa-save")) {
          if (appLayout.fileIsExist(uploadFile.name)) {
          // File already exists
          if (
            confirm(
              'File "' +
                uploadFile.name +
                '" already exists! Do you want to replace the new file?'
            )
          ) {
            //------------ appLayout.replaceFile(uploadFile.name);
            appLayout.itemClicked(null, appLayout.fileIdToDelete, "file");
            appLayout.fileTypes = 1;
            appLayout.fileIdToDelete = appLayout.selectedIndex;
            // replace the file
            ajax
              .call(
                mainPathApi+"CmsFileContent/getviewmodel",
                appLayout.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(mainPathApi+"CmsFileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        appLayout.FileItem = response2.Item;
                        appLayout.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        appLayout.filePickerMainImage.filename =
                          appLayout.FileItem.FileName;
                        appLayout.filePickerMainImage.fileId =
                          response2.Item.Id;
                        appLayout.selectedItem.LinkMainImageId =
                          appLayout.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      appLayout.showErrorIcon();
                      $("#save-icon" + index).removeClass("fa-save");
                      $("#save-button" + index).removeClass("flashing-button");
                      $("#save-icon" + index).addClass("fa-remove");
                    });
                  //-----------------------------------
                }
              })
              .error(function(data) {
                console.log(data);
              });
            //--------------------------------
          } else {
            return;
          }
        } else {
          // File does not exists
          // Save New file
          ajax
            .call(mainPathApi + "CmsFileContent/getviewmodel", "0", "GET")
            .success(function(response) {
              appLayout.FileItem = response.Item;
                appLayout.FileItem.FileName = uploadFile.name;
                appLayout.FileItem.uploadName = uploadFile.uploadName;
                appLayout.FileItem.Extension = uploadFile.name.split(".").pop();
                appLayout.FileItem.FileSrc = uploadFile.name;
              appLayout.FileItem.LinkCategoryId = null; //Save the new file in the root
              // ------- appLayout.saveNewFile()  ----------------------
              var result = 0;
              ajax
                .call(mainPathApi + "CmsFileContent/add", appLayout.FileItem, "POST")
                .success(function(response) {
                  if (response.IsSuccess) {
                    appLayout.FileItem = response.Item;
                    appLayout.showSuccessIcon();
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-check");
                    appLayout.filePickerMainImage.filename =
                      appLayout.FileItem.FileName;
                    appLayout.filePickerMainImage.fileId = response.Item.Id;
                    appLayout.selectedItem.LinkMainImageId =
                      appLayout.filePickerMainImage.fileId;
                  } else {
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-remove");
                  }
                })
                .error(function(data) {
                  appLayout.showErrorIcon();
                  $("#save-icon" + index).removeClass("fa-save");
                  $("#save-button" + index).removeClass("flashing-button");
                  $("#save-icon" + index).addClass("fa-remove");
                });
              //-----------------------------------
            })
            .error(function(data) {
              console.log(data);
              $("#save-icon" + index).removeClass("fa-save");
              $("#save-button" + index).removeClass("flashing-button");
              $("#save-icon" + index).addClass("fa-remove");
            });
        }
      }
    };
    //End of Upload Modal-----------------------------------------
}]);

