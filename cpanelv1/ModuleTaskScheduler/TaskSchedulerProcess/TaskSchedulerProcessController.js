app.controller("taskSchedulerProcessController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$builder', '$stateParams', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $builder, $stateParams, $state, $filter) {
    var taskSchedulerProcess = this;
    if (itemRecordStatus != undefined) taskSchedulerProcess.itemRecordStatus = itemRecordStatus;
    taskSchedulerProcess.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
   taskSchedulerProcess.filePickerMainImage = {
      isActive: true,
      backElement: "filePickerMainImage",
      filename: null,
      fileId: null,
      multiSelect: false
    };
    taskSchedulerProcess.changeState = function (state) {
        $state.go("index." + state);
    }

    taskSchedulerProcess.selectedSourceId = $stateParams.sourceid;
    taskSchedulerProcess.selectedAppId = $stateParams.appid;
    taskSchedulerProcess.selectedAppTitle = $stateParams.apptitle;

    taskSchedulerProcess.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"taskschedulerProcess/getAllInputValueMethod", {}, 'POST').success(function (response) {
            taskSchedulerProcess.InputValueMethod = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        if ($stateParams.sourceid == null)
            taskSchedulerProcess.changeState("taskschedulerprocesscategory");
        taskSchedulerProcess.busyIndicator.isActive = true;
        if (taskSchedulerProcess.selectedSourceId != undefined || taskSchedulerProcess.selectedSourceId != null) {
            taskSchedulerProcess.gridOptions.advancedSearchData.engine.Filters.push({ PropertyName: "LinkProcessCategoryId", SearchType: 0, IntValue1: taskSchedulerProcess.selectedSourceId });
        }
        ajax.call(cmsServerConfig.configApiServerPath+"taskschedulerProcess/getall", taskSchedulerProcess.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            taskSchedulerProcess.busyIndicator.isActive = false;
            taskSchedulerProcess.ListItems = response.ListItems;
            taskSchedulerProcess.gridOptions.fillData(taskSchedulerProcess.ListItems, response.resultAccess);
            taskSchedulerProcess.gridOptions.currentPageNumber = response.CurrentPageNumber;
            taskSchedulerProcess.gridOptions.totalRowCount = response.TotalRowCount;
            taskSchedulerProcess.gridOptions.rowPerPage = response.RowPerPage;
            taskSchedulerProcess.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            taskSchedulerProcess.busyIndicator.isActive = false;
            taskSchedulerProcess.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"taskschedulerProcessCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            taskSchedulerProcess.busyIndicator.isActive = false;
            taskSchedulerProcess.sourceListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            taskSchedulerProcess.busyIndicator.isActive = false;
            console.log(data);
        });
    }

    // Open Add Modal
    taskSchedulerProcess.busyIndicator.isActive = true;
    taskSchedulerProcess.addRequested = false;
//   taskSchedulerProcess.openAddModal = function () {
//       taskSchedulerProcess.modalTitle = 'اضافه';
//       taskSchedulerProcess.filePickerMainImage.filename = "";
//       taskSchedulerProcess.filePickerMainImage.fileId = null; 
//       ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/GetViewModel', "", 'GET').success(function (response) {
//           rashaErManage.checkAction(response);
//           taskSchedulerProcess.busyIndicator.isActive = false;
//           taskSchedulerProcess.selectedItem = response.Item;
//           //Set dataForTheTree
//           taskSchedulerProcess.selectedItem = response.Item;
//           var filterModelParentRootFolders = {
//               Filters: [{
//                   PropertyName: "LinkParentId",
//                   IntValue1: null,
//                   SearchType: 0,
//                   IntValueForceNullSearch: true
//               }]
//           };
//           ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
//               taskSchedulerProcess.dataForTheTree = response1.ListItems;
//               var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
//               ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
//                   Array.prototype.push.apply(taskSchedulerProcess.dataForTheTree, response2.ListItems);
//                   $modal.open({
//                       templateUrl: 'cpanelv1/ModuleTaskScheduler/TaskSchedulerProcess/add.html',
//                       scope: $scope
//                   });
//                   taskSchedulerProcess.addRequested = false;
//               }).error(function (data, errCode, c, d) {
//                   console.log(data);
//               });
//           }).error(function (data, errCode, c, d) {
//               console.log(data);
//           });
//           //-----
//       }).error(function (data, errCode, c, d) {
//           rashaErManage.checkAction(data, errCode);
//       });
//   }

    // Add New Content
//    taskSchedulerProcess.addNewRow = function (frm) {
//        if (frm.$invalid)
//        {
//            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
//            return;
//        }
//        taskSchedulerProcess.busyIndicator.isActive = true;
//        taskSchedulerProcess.addRequested = true;
//        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/add', taskSchedulerProcess.selectedItem, 'POST').success(function (response) {
//            taskSchedulerProcess.addRequested = false;
//            taskSchedulerProcess.busyIndicator.isActive = false;
//            rashaErManage.checkAction(response);
//            if (response.IsSuccess) {
//                taskSchedulerProcess.ListItems.unshift(response.Item);
//                taskSchedulerProcess.gridOptions.fillData(taskSchedulerProcess.ListItems);
//                taskSchedulerProcess.closeModal();
//            }
//        }).error(function (data, errCode, c, d) {
//            rashaErManage.checkAction(data, errCode);
//            taskSchedulerProcess.busyIndicator.isActive = false;
//            taskSchedulerProcess.addRequested = false;
//        });
//    }

    taskSchedulerProcess.autoAdd = function () {
        taskSchedulerProcess.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/autoadd', { LinkProcessCategoryId: taskSchedulerProcess.selectedSourceId }, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            taskSchedulerProcess.busyIndicator.isActive = false;
            taskSchedulerProcess.init();
        }).error(function (data, errCode, c, d) {
            taskSchedulerProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    taskSchedulerProcess.openEditModal = function () {
        if (taskSchedulerProcess.addRequested)
            return;
        taskSchedulerProcess.modalTitle = 'ویرایش';
        if (!taskSchedulerProcess.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        taskSchedulerProcess.busyIndicator.isActive = true;
        taskSchedulerProcess.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/GetOne', taskSchedulerProcess.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            taskSchedulerProcess.selectedItem = response.Item;
        taskSchedulerProcess.filePickerMainImage.filename = null;
          taskSchedulerProcess.filePickerMainImage.fileId = null;
         if (response.Item.LinkMainImageId != null) {
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                response.Item.LinkMainImageId,
                "GET"
              )
              .success(function(response2) {
                buttonIsPressed = false;
                taskSchedulerProcess.filePickerMainImage.filename =
                  response2.Item.FileName;
                taskSchedulerProcess.filePickerMainImage.fileId = response2.Item.Id;
              })
              .error(function(data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
              });
          }
            //Set dataForTheTree
            taskSchedulerProcess.selectedNode = [];
            taskSchedulerProcess.expandedNodes = [];
            taskSchedulerProcess.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                taskSchedulerProcess.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(taskSchedulerProcess.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (taskSchedulerProcess.selectedItem.LinkModuleFilePreviewImageId > 0)
                        taskSchedulerProcess.onSelection({ Id: taskSchedulerProcess.selectedItem.LinkModuleFilePreviewImageId }, true);
                    taskSchedulerProcess.addRequested = false;
                    taskSchedulerProcess.busyIndicator.isActive = false;
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleTaskScheduler/TaskSchedulerProcess/edit.html',
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
    taskSchedulerProcess.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        taskSchedulerProcess.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/edit', taskSchedulerProcess.selectedItem, 'PUT').success(function (response) {
            taskSchedulerProcess.addRequested = true;
            rashaErManage.checkAction(response);
            taskSchedulerProcess.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                taskSchedulerProcess.addRequested = false;
                taskSchedulerProcess.replaceItem(taskSchedulerProcess.selectedItem.Id, response.Item);
                taskSchedulerProcess.gridOptions.fillData(taskSchedulerProcess.ListItems);
                taskSchedulerProcess.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            taskSchedulerProcess.addRequested = false;
        });
    }

    taskSchedulerProcess.closeModal = function () {
        $modalStack.dismissAll();
    };

    taskSchedulerProcess.replaceItem = function (oldId, newItem) {
        angular.forEach(taskSchedulerProcess.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = taskSchedulerProcess.ListItems.indexOf(item);
                taskSchedulerProcess.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            taskSchedulerProcess.ListItems.unshift(newItem);
    }

    taskSchedulerProcess.deleteRow = function () {
        if (!taskSchedulerProcess.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                taskSchedulerProcess.busyIndicator.isActive = true;
                console.log(taskSchedulerProcess.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/GetOne', taskSchedulerProcess.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    taskSchedulerProcess.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/delete', taskSchedulerProcess.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        taskSchedulerProcess.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            taskSchedulerProcess.replaceItem(taskSchedulerProcess.selectedItemForDelete.Id);
                            taskSchedulerProcess.gridOptions.fillData(taskSchedulerProcess.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        taskSchedulerProcess.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    taskSchedulerProcess.busyIndicator.isActive = false;

                });
            }
        });
    }

    taskSchedulerProcess.searchData = function () {
        taskSchedulerProcess.gridOptions.searchData();
    }

    taskSchedulerProcess.gridOptions = {
        columns: [
            { name: "Id", displayName: "کد سیستمی", sortable: true, type: "integer", visible: true },
            { name: "Title", displayName: "عنوان", sortable: true, type: "string", visible: true },
            { name: "ClassName", displayName: "ClassName", sortable: true, type: "string", visible: true },
            { name: "virtual_Source.Title", displayName: "قالب", sortable: true, type: "string", displayForce: true, visible: true },
            { name: 'IsPublish', displayName: 'قابل نمایش برای همه؟', sortable: true, isCheckBox: true, type: 'boolean' },
            { name: 'ActionButton1', displayName: 'عملیات ادمین', sortable: true, displayForce: true, width: '140px', template: '<button class="btn btn-success" ng-show="taskSchedulerProcess.gridOptions.resultAccess.AccessAddField.indexOf(\'JsonFormAdminMainJsonForm\')>-1" ng-click="taskSchedulerProcess.scrollToFormBuilderMainAdmin(x)" title="طرّاحی مقادیر وردوی" type="button"><i class="fa fa-bars fa-1x" aria-hidden="true"></i></button>&nbsp;<button class="btn btn-warning" ng-show="taskSchedulerProcess.gridOptions.resultAccess.AccessAddField.indexOf(\'JsonFormAdminMainValues\')>-1" title="مقداردهی" ng-click="taskSchedulerProcess.showFormMainAdmin(\'false\',x.Id)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>' },
            { name: 'ActionButton2', displayName: 'عملیات ادمین سایت', sortable: true, displayForce: true, width: '140px', template: '<button class="btn btn-success" ng-show="taskSchedulerProcess.gridOptions.resultAccess.AccessAddField.indexOf(\'JsonFormAdminSiteJsonForm\')>-1" ng-click="taskSchedulerProcess.scrollToFormBuilderSiteAdmin(x)" title="طرّاحی مقادیر وردوی" type="button"><i class="fa fa-bars fa-1x" aria-hidden="true"></i></button>&nbsp;<button class="btn btn-warning" ng-show="taskSchedulerProcess.gridOptions.resultAccess.AccessAddField.indexOf(\'JsonFormAdminSiteValuesDefault\')>-1" title="مقداردهی" ng-click="taskSchedulerProcess.showFormSiteAdmin(\'false\',x.Id)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>' }
            //{ name: "JsonForm", displayName: "فرم ساز", sortable: true, displayForce: true, template: "<button class=\"btn btn-warning\" ng-show=\"taskSchedulerProcess.gridOptions.resultAccess.AccessAddRow\" ng-click=\"taskSchedulerProcess.scrollToFormBuilder(x)\" title=\"ساخت فرم\" type=\"button\"><i class=\"fa fa-paint-brush\" aria-hidden=\"true\"></i></button>" },
            //{ name: "JsonFormAdminSystemValue", displayName: "تنظیمات مدیر", sortable: true, displayForce: true, visible: 'taskSchedulerProcess.gridOptions.resultAccess.AccessEditField.indexOf("JsonFormAdminSystemValue")>-1', template: "<button class=\"btn btn-info\" ng-show=\"taskSchedulerProcess.gridOptions.resultAccess.AccessAddRow\" ng-click=\"taskSchedulerProcess.openAdminMainForm(x.Id)\" title=\"مقداردهی مقادیر پیش فرض\" type=\"button\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i></button>" },
            //{ name: "JsonFormDefaultValue", displayName: "پیش فرض", sortable: true, displayForce: true, template: "<button class=\"btn btn-success\" ng-show=\"taskSchedulerProcess.gridOptions.resultAccess.AccessAddRow\" ng-click=\"taskSchedulerProcess.openPreviewModal(x.Id)\" title=\"مقداردهی مقادیر پیش فرض\" type=\"button\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i></button>" }
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

    taskSchedulerProcess.gridOptions.reGetAll = function () {
        taskSchedulerProcess.init();
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Show InputValue form builder and auto scroll to its position Admin form
    taskSchedulerProcess.scrollToFormBuilderMainAdmin = function (item) {
        taskSchedulerProcess.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/GetOne', item.Id, 'GET').success(function (response) {
            taskSchedulerProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            taskSchedulerProcess.selectedItem = response.Item;
            $builder.removeAllFormObject('default');
            var component = $.parseJSON(taskSchedulerProcess.selectedItem.JsonFormAdminMainJsonForm);
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
            taskSchedulerProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Show Preview form
    taskSchedulerProcess.showFormMainAdmin = function (preview, selectedId) {
        taskSchedulerProcess.showSaveButton = false;
        if (preview == "false") {
            taskSchedulerProcess.showSaveButton = true;
            ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/GetOne', selectedId, 'GET').success(function (response) {
                taskSchedulerProcess.busyIndicator.isActive = false;
                rashaErManage.checkAction(response);
                taskSchedulerProcess.selectedItem = response.Item;
                $builder.removeAllFormObject('defaultMainAdmin');
                taskSchedulerProcess.defaultValueMainAdmin = {};
                var component = $.parseJSON(taskSchedulerProcess.selectedItem.JsonFormAdminMainJsonForm);
                // Load and set the values from ProcessesJson.newProcess.ProcessCustomizationInputValue
                var values = []; 
                if (taskSchedulerProcess.selectedItem.JsonFormAdminMainValues != null && taskSchedulerProcess.selectedItem.JsonFormAdminMainValues != undefined &&
                    taskSchedulerProcess.selectedItem.JsonFormAdminMainValues.length>0)
                 values =  $.parseJSON(taskSchedulerProcess.selectedItem.JsonFormAdminMainValues);
                if (component != null && component.length != undefined)
                    $.each(component, function (i, item) {
                        $builder.addFormObject('defaultMainAdmin', item);
                        //تخصیص مقادیر فرم با تشخیص نام فیلد
                        if (values != null && values.length != undefined)
                            $.each(values, function (iValue, itemValue) {
                                if (item.fieldname == itemValue.fieldname) {
                                    $builder.forms.defaultMainAdmin[i].id = i;
                                    taskSchedulerProcess.defaultValueMainAdmin[i] = itemValue.value;
                                }
                            });
                    });


            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                taskSchedulerProcess.busyIndicator.isActive = false;
            });
        }
        else {
            $builder.removeAllFormObject('defaultMainAdmin');
            taskSchedulerProcess.defaultValueMainAdmin = $builder.forms['default'];
            $.each(taskSchedulerProcess.defaultValueMainAdmin, function (i, item) {
                $builder.addFormObject('defaultMainAdmin', item);
            });
        }
        $modal.open({
            templateUrl: 'cpanelv1/ModuleTaskScheduler/TaskSchedulerProcess/formMainAdmin.html',
            scope: $scope
        });
    }
    // Save Input Value Form
    taskSchedulerProcess.saveJsonFormMainAdmin = function () {
        taskSchedulerProcess.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/GetOne', taskSchedulerProcess.selectedItem.Id, 'GET').success(function (response1) {
            taskSchedulerProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(response1);
            taskSchedulerProcess.selectedItem = response1.Item;
            // $builder.forms['default'] -> get the form in Json format
            taskSchedulerProcess.selectedItem.JsonFormAdminMainJsonForm = $.trim(angular.toJson($builder.forms['default']));
            taskSchedulerProcess.busyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/edit', taskSchedulerProcess.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    taskSchedulerProcess.closeModal();
                }
                taskSchedulerProcess.busyIndicator.isActive = false;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                taskSchedulerProcess.busyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            taskSchedulerProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    taskSchedulerProcess.getFromSystemMainAdmin = function () {
        // Get selected Layout to load form using JsonFormFormat in ViewModel
        var model = { Filters: [] };
        model.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: taskSchedulerProcess.gridOptions.selectedRow.item.Id });
        taskSchedulerProcess.addRequested = true;
        taskSchedulerProcess.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/GetOneWithJsonFormat', model, 'POST').success(function (response) {
            taskSchedulerProcess.addRequested = false;
            taskSchedulerProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                $builder.removeAllFormObject('default');
                //var customizeValue = JSON.parse(response.Item.ProcessInputValue);
                var customizeValue = response.Item.JsonFormFormatterInputFormMainAdminClass;
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
            taskSchedulerProcess.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            taskSchedulerProcess.busyIndicator.isActive = false;
        });
    }

    taskSchedulerProcess.saveSubmitValuesMainAdmin = function () {
        var updateMethod = "PUT";
        var updateMode = "edit";
        //if (taskSchedulerProcess.updateMode == "add")
        //    updateMethod = "POST";
        taskSchedulerProcess.addRequested = true;
        taskSchedulerProcess.selectedItem.JsonFormAdminMainValues = ($.trim(angular.toJson(taskSchedulerProcess.submitValueFormMainAdmin)));
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/' + updateMode, taskSchedulerProcess.selectedItem, updateMethod).success(function (response) {
            rashaErManage.checkAction(response);
            taskSchedulerProcess.addRequested = false;
            taskSchedulerProcess.closeModal();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            taskSchedulerProcess.addRequested = false;
        });
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Show InputValue form builder and auto scroll to its position
    taskSchedulerProcess.scrollToFormBuilderSiteAdmin = function (item) {
        taskSchedulerProcess.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/GetOne', item.Id, 'GET').success(function (response) {
            taskSchedulerProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            taskSchedulerProcess.selectedItem = response.Item;
            $builder.removeAllFormObject('default');
           // var component = taskSchedulerProcess.selectedItem.JsonFormAdminSiteJsonForm;
   var component = $.parseJSON(taskSchedulerProcess.selectedItem.JsonFormAdminSiteJsonForm);
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
            taskSchedulerProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Show Preview form
    taskSchedulerProcess.showFormSiteAdmin = function (preview, selectedId) {
        taskSchedulerProcess.showSaveButton = false;
        if (preview == "false") {
            taskSchedulerProcess.showSaveButton = true;
            ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/GetOne', selectedId, 'GET').success(function (response) {
                taskSchedulerProcess.busyIndicator.isActive = false;
                rashaErManage.checkAction(response);
                taskSchedulerProcess.selectedItem = response.Item;
                $builder.removeAllFormObject('defaultSiteAdmin');
                taskSchedulerProcess.defaultValueSiteAdmin = {};
                var component = $.parseJSON(taskSchedulerProcess.selectedItem.JsonFormAdminSiteJsonForm);
                // Load and set the values from ProcessesJson.newProcess.ProcessCustomizationInputValue
                var values = $.parseJSON(taskSchedulerProcess.selectedItem.JsonFormAdminSiteValuesDefault);
                if (component != null && component.length != undefined)
                    $.each(component, function (i, item) {
                        $builder.addFormObject('defaultSiteAdmin', item);
                        //تخصیص مقادیر فرم با تشخیص نام فیلد
                        if (values != null && values.length != undefined)
                            $.each(values, function (iValue, itemValue) {
                                if (item.fieldname == itemValue.fieldname) {
                                    $builder.forms.defaultSiteAdmin[i].id = i;
                                    taskSchedulerProcess.defaultValueSiteAdmin[i] = itemValue.value;
                                }
                            });
                    });
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                taskSchedulerProcess.busyIndicator.isActive = false;
            });
        }
        else {
            $builder.removeAllFormObject('defaultSiteAdmin');
            taskSchedulerProcess.defaultValueSiteAdmin = $builder.forms['default'];
            $.each(taskSchedulerProcess.defaultValueSiteAdmin, function (i, item) {
                $builder.addFormObject('defaultSiteAdmin', item);
            });
        }
        $modal.open({
            templateUrl: 'cpanelv1/ModuleTaskScheduler/TaskSchedulerProcess/formSiteAdmin.html',
            scope: $scope
        });
    }
    // Save Input Value Form
    taskSchedulerProcess.saveJsonFormSiteAdmin = function () {
        taskSchedulerProcess.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/GetOne', taskSchedulerProcess.selectedItem.Id, 'GET').success(function (response1) {
            taskSchedulerProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(response1);
            taskSchedulerProcess.selectedItem = response1.Item;
            // $builder.forms['default'] -> get the form in Json format
            taskSchedulerProcess.selectedItem.JsonFormAdminSiteJsonForm = $.trim(angular.toJson($builder.forms['default']));
            taskSchedulerProcess.busyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/edit', taskSchedulerProcess.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    taskSchedulerProcess.closeModal();
                }
                taskSchedulerProcess.busyIndicator.isActive = false;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                taskSchedulerProcess.busyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            taskSchedulerProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    taskSchedulerProcess.getFromSystemSiteAdmin = function () {
        // Get selected Layout to load form using JsonFormFormat in ViewModel
        var model = { Filters: [] };
        model.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: taskSchedulerProcess.gridOptions.selectedRow.item.Id });
        taskSchedulerProcess.addRequested = true;
        taskSchedulerProcess.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/GetOneWithJsonFormat', model, 'POST').success(function (response) {
            taskSchedulerProcess.addRequested = false;
            taskSchedulerProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                $builder.removeAllFormObject('default');
                //var customizeValue = JSON.parse(response.Item.ProcessInputValue);
                var customizeValue = response.Item.JsonFormFormatterInputFormSiteAdminClass;
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
            taskSchedulerProcess.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            taskSchedulerProcess.busyIndicator.isActive = false;
        });
    }

    taskSchedulerProcess.saveSubmitValuesSiteAdmin = function () {
        var updateMethod = "PUT";
        var updateMode = "edit";
        //if (taskSchedulerProcess.updateMode == "add")
        //    updateMethod = "POST";
        taskSchedulerProcess.addRequested = true;
        taskSchedulerProcess.selectedItem.JsonFormAdminSiteValuesDefault = ($.trim(angular.toJson(taskSchedulerProcess.submitValueFormSiteAdmin)));
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/' + updateMode, taskSchedulerProcess.selectedItem, updateMethod).success(function (response) {
            rashaErManage.checkAction(response);
            taskSchedulerProcess.addRequested = false;
            taskSchedulerProcess.closeModal();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            taskSchedulerProcess.addRequested = false;
        });
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    taskSchedulerProcess.gridOptions.onRowSelected = function () { }

    taskSchedulerProcess.columnCheckbox = false;

    taskSchedulerProcess.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (taskSchedulerProcess.gridOptions.columnCheckbox) {
            for (var i = 0; i < taskSchedulerProcess.gridOptions.columns.length; i++) {
                var element = $("#" + taskSchedulerProcess.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                taskSchedulerProcess.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = taskSchedulerProcess.gridOptions.columns;
            for (var i = 0; i < taskSchedulerProcess.gridOptions.columns.length; i++) {
                taskSchedulerProcess.gridOptions.columns[i].visible = true;
                var element = $("#" + taskSchedulerProcess.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + taskSchedulerProcess.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < taskSchedulerProcess.gridOptions.columns.length; i++) {
            console.log(taskSchedulerProcess.gridOptions.columns[i].name.concat(".visible: "), taskSchedulerProcess.gridOptions.columns[i].visible);
        }
        taskSchedulerProcess.gridOptions.columnCheckbox = !taskSchedulerProcess.gridOptions.columnCheckbox;
    }

    taskSchedulerProcess.scrollToFormBuilder = function (item) {
        taskSchedulerProcess.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/GetOne', item.Id, 'GET').success(function (response) {
            taskSchedulerProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            taskSchedulerProcess.selectedItem = response.Item;

            $builder.removeAllFormObject('default');
            var component = parseJSONcomponent(taskSchedulerProcess.selectedItem.JsonForm);
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
            taskSchedulerProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Show Preview form
    taskSchedulerProcess.showFormPreview = function () {
        taskSchedulerProcess.busyIndicator.isActive = true;
        taskSchedulerProcess.addRequested = true;
        var filterDataModel = { PropertyName: "LinkApplicationId", searchType: 0, IntValue1: taskSchedulerProcess.selectedAppId };
        var filterDataModel = { PropertyName: "LinkProcessId", searchType: 0, IntValue1: taskSchedulerProcess.selectedSourceId };
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcessvalue/getone', taskSchedulerProcess.selectedItem.Id, 'GET').success(function (response1) {
            taskSchedulerProcess.busyIndicator.isActive = false;
            taskSchedulerProcess.addRequested = false;
            taskSchedulerProcess.formJson = $builder.forms['default'];
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTaskScheduler/TaskSchedulerProcess/preview.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            taskSchedulerProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Save Input Value Form
    taskSchedulerProcess.saveProcessInputCustomizeValue = function () {
        taskSchedulerProcess.busyIndicator.isActive = true;
        taskSchedulerProcess.selectedProcessId = taskSchedulerProcess.gridOptions.selectedRow.item.Id;       //Storing selected Process Id for further uses
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/GetOne', taskSchedulerProcess.selectedItem.Id, 'GET').success(function (response1) {
            taskSchedulerProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(response1);
            taskSchedulerProcess.selectedItem = response1.Item;
            // $builder.forms['default'] -> get the form in Json format
            taskSchedulerProcess.selectedItem.JsonForm = $.trim(angular.toJson($builder.forms['default']));
            taskSchedulerProcess.busyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/edit', taskSchedulerProcess.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    taskSchedulerProcess.closeModal();
                }
                taskSchedulerProcess.busyIndicator.isActive = false;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                taskSchedulerProcess.busyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            taskSchedulerProcess.busyIndicator.isActive = false;
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

    taskSchedulerProcess.getFromSystem = function () {
        // Get selected Process to load form using JsonFormFormat in ViewModel
        taskSchedulerProcess.busyIndicator.isActive = true;
        var filterModel = { Filters: [] };
        filterModel.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: taskSchedulerProcess.gridOptions.selectedRow.item.Id });
        ajax.call(cmsServerConfig.configApiServerPath+'taskschedulerProcess/getonewithjsonformat', filterModel, 'POST').success(function (response) {
            taskSchedulerProcess.busyIndicator.isActive = false;
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
            taskSchedulerProcess.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            taskSchedulerProcess.busyIndicator.isActive = false;
        });
    }

    taskSchedulerProcess.defaultValue = {};

    // Show Preview form
    taskSchedulerProcess.openPreviewModal = function (ProcessId) {
        taskSchedulerProcess.openPreviewForm = true;
        var filterDataModel = { PropertyName: "Id", searchType: 0, IntValue1: taskSchedulerProcess.ProcessId };
        var engine = { Filters: [] };
        engine.Filters.push(filterDataModel);
        ajax.call(cmsServerConfig.configApiServerPath+'taskschedulerProcess/GetOne', ProcessId, 'GET').success(function (response) {
            taskSchedulerProcess.selectedItem = response.Item;
            taskSchedulerProcess.formJson = $builder.forms['default'];
            $builder.removeAllFormObject('default');
            var component = $.parseJSON(response.Item.JsonForm);
            var values = $.parseJSON(response.Item.JsonFormAdminSiteValuesDefault);
            if (component != null && component.length != undefined)
                $.each(component, function (i, item) {
                    try {
                        $builder.addFormObject('default', item);
                        //تخصیص مقادیر فرم بر اساس نام فیلد
                        if (values != null && values.length != undefined)
                            $.each(values, function (iValue, itemValue) {
                                if (item.fieldname == itemValue.fieldname)
                                    taskSchedulerProcess.defaultValue[i] = itemValue.value;
                            });
                    } catch (e) {
                    }
                });

            $modal.open({
                templateUrl: 'cpanelv1/ModuleTaskScheduler/TaskSchedulerProcess/preview.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    taskSchedulerProcess.openAdminMainForm = function (ProcessId) {
        taskSchedulerProcess.openPreviewForm = false;
        var filterDataModel = { PropertyName: "Id", SearchType: 0, IntValue1: ProcessId };
        var engine = { Filters: [] };
        engine.Filters.push(filterDataModel);
        ajax.call(cmsServerConfig.configApiServerPath+'taskschedulerProcess/getonewithjsonformat', engine, 'POST').success(function (response) {

            taskSchedulerProcess.selectedItem = response.Item;
            taskSchedulerProcess.formJson = $builder.forms['default'];
            $builder.removeAllFormObject('default');
            //var component = $.parseJSON(response.Item.JsonFormAdminSystemValue);
            if (response.IsSuccess) {
                // Load and set the values
                var values = $.parseJSON(response.Item.JsonFormAdminSystemValue);
                // Clear privous values in formBuilder
                if (values != null && values.length != undefined)
                    $.each(values, function (i, item) {
                        taskSchedulerProcess.defaultValue[item.id] = null;
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
                                        taskSchedulerProcess.defaultValue[i] = itemValue.value;
                                });
                        }
                    });
                }
                $modal.open({
                    templateUrl: 'cpanelv1/ModuleTaskScheduler/TaskSchedulerProcess/preview.html',
                    scope: $scope
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    taskSchedulerProcess.saveSubmitValues = function () {
        taskSchedulerProcess.busyIndicator.isActive = true;
        taskSchedulerProcess.addRequested = true;
        if (taskSchedulerProcess.openPreviewForm)
            taskSchedulerProcess.selectedItem.JsonFormDefaultValue = $.trim(angular.toJson(taskSchedulerProcess.submitValue));
        else
            taskSchedulerProcess.selectedItem.JsonFormAdminSystemValue = $.trim(angular.toJson(taskSchedulerProcess.submitValue));
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/edit', taskSchedulerProcess.selectedItem, 'PUT').success(function (response) {
            taskSchedulerProcess.addRequested = true;
            rashaErManage.checkAction(response);
            taskSchedulerProcess.busyIndicator.isActive = false;
            taskSchedulerProcess.addRequested = false;
            taskSchedulerProcess.closeModal();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            taskSchedulerProcess.busyIndicator.isActive = false;
            taskSchedulerProcess.addRequested = false;
        });
    }
    //TreeControl
    taskSchedulerProcess.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (taskSchedulerProcess.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    taskSchedulerProcess.onNodeToggle = function (node, expanded) {
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

    taskSchedulerProcess.onSelection = function (node, selected) {
        if (!selected) {
            taskSchedulerProcess.selectedItem.LinkModuleFilePreviewImageId = null;
            taskSchedulerProcess.selectedItem.previewImageSrc = null;
            return;
        }
        taskSchedulerProcess.selectedItem.LinkModuleFilePreviewImageId = node.Id;
        taskSchedulerProcess.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            taskSchedulerProcess.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
//upload file
    taskSchedulerProcess.uploadFile = function (index, uploadFile) {
      if ($("#save-icon" + index).hasClass("fa-save")) {
          if (taskSchedulerProcess.fileIsExist(uploadFile.name)) {
          // File already exists
          if (
            confirm(
              'File "' +
                uploadFile.name +
                '" already exists! Do you want to replace the new file?'
            )
          ) {
            //------------ taskSchedulerProcess.replaceFile(uploadFile.name);
            taskSchedulerProcess.itemClicked(null, taskSchedulerProcess.fileIdToDelete, "file");
            taskSchedulerProcess.fileTypes = 1;
            taskSchedulerProcess.fileIdToDelete = taskSchedulerProcess.selectedIndex;
            // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                taskSchedulerProcess.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        taskSchedulerProcess.FileItem = response2.Item;
                        taskSchedulerProcess.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        taskSchedulerProcess.filePickerMainImage.filename =
                          taskSchedulerProcess.FileItem.FileName;
                        taskSchedulerProcess.filePickerMainImage.fileId =
                          response2.Item.Id;
                        taskSchedulerProcess.selectedItem.LinkMainImageId =
                          taskSchedulerProcess.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      taskSchedulerProcess.showErrorIcon();
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
            .call(cmsServerConfig.configApiServerPath + "FileContent/GetViewModel", "", "GET")
            .success(function(response) {
              taskSchedulerProcess.FileItem = response.Item;
                taskSchedulerProcess.FileItem.FileName = uploadFile.name;
                taskSchedulerProcess.FileItem.uploadName = uploadFile.uploadName;
                taskSchedulerProcess.FileItem.Extension = uploadFile.name.split(".").pop();
                taskSchedulerProcess.FileItem.FileSrc = uploadFile.name;
              taskSchedulerProcess.FileItem.LinkCategoryId = null; //Save the new file in the root
              // ------- taskSchedulerProcess.saveNewFile()  ----------------------
              var result = 0;
              ajax
                .call(cmsServerConfig.configApiServerPath + "FileContent/add", taskSchedulerProcess.FileItem, "POST")
                .success(function(response) {
                  if (response.IsSuccess) {
                    taskSchedulerProcess.FileItem = response.Item;
                    taskSchedulerProcess.showSuccessIcon();
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-check");
                    taskSchedulerProcess.filePickerMainImage.filename =
                      taskSchedulerProcess.FileItem.FileName;
                    taskSchedulerProcess.filePickerMainImage.fileId = response.Item.Id;
                    taskSchedulerProcess.selectedItem.LinkMainImageId =
                      taskSchedulerProcess.filePickerMainImage.fileId;
                  } else {
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-remove");
                  }
                })
                .error(function(data) {
                  taskSchedulerProcess.showErrorIcon();
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

