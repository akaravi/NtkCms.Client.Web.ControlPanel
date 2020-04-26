app.controller("shopProcessController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$builder', '$stateParams', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $builder, $stateParams, $state, $filter) {
    var shopProcess = this;
    if (itemRecordStatus != undefined) shopProcess.itemRecordStatus = itemRecordStatus;
    shopProcess.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
   shopProcess.filePickerMainImage = {
      isActive: true,
      backElement: "filePickerMainImage",
      filename: null,
      fileId: null,
      multiSelect: false
    };
    shopProcess.changeState = function (state) {
        $state.go("index." + state);
    }

    shopProcess.selectedSourceId = $stateParams.sourceid;
    shopProcess.selectedAppId = $stateParams.appid;
    shopProcess.selectedAppTitle = $stateParams.apptitle;

    shopProcess.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"shopProcess/getAllInputValueMethod", {}, 'POST').success(function (response) {
            shopProcess.InputValueMethod = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        if ($stateParams.sourceid == null)
            shopProcess.changeState("shopprocesscategory");
        shopProcess.busyIndicator.isActive = true;
        if (shopProcess.selectedSourceId != undefined || shopProcess.selectedSourceId != null) {
            shopProcess.gridOptions.advancedSearchData.engine.Filters.push({ PropertyName: "LinkProcessCategoryId", SearchType: 0, IntValue1: shopProcess.selectedSourceId });
        }
        ajax.call(cmsServerConfig.configApiServerPath+"shopProcess/getall", shopProcess.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopProcess.busyIndicator.isActive = false;
            shopProcess.ListItems = response.ListItems;
            shopProcess.gridOptions.fillData(shopProcess.ListItems, response.resultAccess);
            shopProcess.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopProcess.gridOptions.totalRowCount = response.TotalRowCount;
            shopProcess.gridOptions.rowPerPage = response.RowPerPage;
            shopProcess.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            shopProcess.busyIndicator.isActive = false;
            shopProcess.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"shopProcessCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopProcess.busyIndicator.isActive = false;
            shopProcess.sourceListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            shopProcess.busyIndicator.isActive = false;
            console.log(data);
        });
    }

    // Open Add Modal
    shopProcess.busyIndicator.isActive = true;
    shopProcess.addRequested = false;
//   shopProcess.openAddModal = function () {
//       shopProcess.modalTitle = 'اضافه';
//       shopProcess.filePickerMainImage.filename = "";
//       shopProcess.filePickerMainImage.fileId = null; 
//       ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/GetViewModel', "", 'GET').success(function (response) {
//           rashaErManage.checkAction(response);
//           shopProcess.busyIndicator.isActive = false;
//           shopProcess.selectedItem = response.Item;
//           //Set dataForTheTree
//           shopProcess.selectedItem = response.Item;
//           var filterModelParentRootFolders = {
//               Filters: [{
//                   PropertyName: "LinkParentId",
//                   IntValue1: null,
//                   SearchType: 0,
//                   IntValueForceNullSearch: true
//               }]
//           };
//           ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
//               shopProcess.dataForTheTree = response1.ListItems;
//               var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
//               ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
//                   Array.prototype.push.apply(shopProcess.dataForTheTree, response2.ListItems);
//                   $modal.open({
//                       templateUrl: 'cpanelv1/ModuleShop/ShopProcess/add.html',
//                       scope: $scope
//                   });
//                   shopProcess.addRequested = false;
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
//    shopProcess.addNewRow = function (frm) {
//        if (frm.$invalid)
//        {
//            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
//            return;
//        }
//        shopProcess.busyIndicator.isActive = true;
//        shopProcess.addRequested = true;
//        ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/add', shopProcess.selectedItem, 'POST').success(function (response) {
//            shopProcess.addRequested = false;
//            shopProcess.busyIndicator.isActive = false;
//            rashaErManage.checkAction(response);
//            if (response.IsSuccess) {
//                shopProcess.ListItems.unshift(response.Item);
//                shopProcess.gridOptions.fillData(shopProcess.ListItems);
//                shopProcess.closeModal();
//            }
//        }).error(function (data, errCode, c, d) {
//            rashaErManage.checkAction(data, errCode);
//            shopProcess.busyIndicator.isActive = false;
//            shopProcess.addRequested = false;
//        });
//    }

    shopProcess.autoAdd = function () {
        shopProcess.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/autoadd', { LinkProcessCategoryId: shopProcess.selectedSourceId }, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopProcess.busyIndicator.isActive = false;
            shopProcess.init();
        }).error(function (data, errCode, c, d) {
            shopProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    shopProcess.openEditModal = function () {
        if (shopProcess.addRequested)
            return;
        shopProcess.modalTitle = 'ویرایش';
        if (!shopProcess.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        shopProcess.busyIndicator.isActive = true;
        shopProcess.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/GetOne', shopProcess.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            shopProcess.selectedItem = response.Item;
        shopProcess.filePickerMainImage.filename = null;
          shopProcess.filePickerMainImage.fileId = null;
         if (response.Item.LinkMainImageId != null) {
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                response.Item.LinkMainImageId,
                "GET"
              )
              .success(function(response2) {
                buttonIsPressed = false;
                shopProcess.filePickerMainImage.filename =
                  response2.Item.FileName;
                shopProcess.filePickerMainImage.fileId = response2.Item.Id;
              })
              .error(function(data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
              });
          }
            //Set dataForTheTree
            shopProcess.selectedNode = [];
            shopProcess.expandedNodes = [];
            shopProcess.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                shopProcess.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(shopProcess.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (shopProcess.selectedItem.LinkModuleFilePreviewImageId > 0)
                        shopProcess.onSelection({ Id: shopProcess.selectedItem.LinkModuleFilePreviewImageId }, true);
                    shopProcess.addRequested = false;
                    shopProcess.busyIndicator.isActive = false;
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleShop/ShopProcess/edit.html',
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
    shopProcess.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopProcess.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/edit', shopProcess.selectedItem, 'PUT').success(function (response) {
            shopProcess.addRequested = true;
            rashaErManage.checkAction(response);
            shopProcess.busyIndicator.isActive = false;
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
    }

    shopProcess.closeModal = function () {
        $modalStack.dismissAll();
    };

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

    shopProcess.deleteRow = function () {
        if (!shopProcess.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                shopProcess.busyIndicator.isActive = true;
                console.log(shopProcess.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/GetOne', shopProcess.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    shopProcess.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/delete', shopProcess.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        shopProcess.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            shopProcess.replaceItem(shopProcess.selectedItemForDelete.Id);
                            shopProcess.gridOptions.fillData(shopProcess.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        shopProcess.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    shopProcess.busyIndicator.isActive = false;

                });
            }
        });
    }

    shopProcess.searchData = function () {
        shopProcess.gridOptions.searchData();
    }

    shopProcess.gridOptions = {
        columns: [
            { name: "Id", displayName: "کد سیستمی", sortable: true, type: "integer", visible: true },
            { name: "Title", displayName: "عنوان", sortable: true, type: "string", visible: true },
            { name: "ClassName", displayName: "ClassName", sortable: true, type: "string", visible: true },
            { name: "virtual_Source.Title", displayName: "قالب", sortable: true, type: "string", displayForce: true, visible: true },
            { name: 'IsPublish', displayName: 'قابل نمایش برای همه؟', sortable: true, isCheckBox: true, type: 'boolean' },
            { name: 'ActionButton1', displayName: 'عملیات ادمین', sortable: true, displayForce: true, width: '140px', template: '<button class="btn btn-success" ng-show="shopProcess.gridOptions.resultAccess.AccessAddField.indexOf(\'JsonFormAdminMainJsonForm\')>-1" ng-click="shopProcess.scrollToFormBuilderMainAdmin(x)" title="طرّاحی مقادیر وردوی" type="button"><i class="fa fa-bars fa-1x" aria-hidden="true"></i></button>&nbsp;<button class="btn btn-warning" ng-show="shopProcess.gridOptions.resultAccess.AccessAddField.indexOf(\'JsonFormAdminMainValues\')>-1" title="مقداردهی" ng-click="shopProcess.showFormMainAdmin(\'false\',x.Id)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>' },
            { name: 'ActionButton2', displayName: 'عملیات ادمین سایت', sortable: true, displayForce: true, width: '140px', template: '<button class="btn btn-success" ng-show="shopProcess.gridOptions.resultAccess.AccessAddField.indexOf(\'JsonFormAdminSiteJsonForm\')>-1" ng-click="shopProcess.scrollToFormBuilderSiteAdmin(x)" title="طرّاحی مقادیر وردوی" type="button"><i class="fa fa-bars fa-1x" aria-hidden="true"></i></button>&nbsp;<button class="btn btn-warning" ng-show="shopProcess.gridOptions.resultAccess.AccessAddField.indexOf(\'JsonFormAdminSiteValuesDefault\')>-1" title="مقداردهی" ng-click="shopProcess.showFormSiteAdmin(\'false\',x.Id)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>' }
            //{ name: "JsonForm", displayName: "فرم ساز", sortable: true, displayForce: true, template: "<button class=\"btn btn-warning\" ng-show=\"shopProcess.gridOptions.resultAccess.AccessAddRow\" ng-click=\"shopProcess.scrollToFormBuilder(x)\" title=\"ساخت فرم\" type=\"button\"><i class=\"fa fa-paint-brush\" aria-hidden=\"true\"></i></button>" },
            //{ name: "JsonFormAdminSystemValue", displayName: "تنظیمات مدیر", sortable: true, displayForce: true, visible: 'shopProcess.gridOptions.resultAccess.AccessEditField.indexOf("JsonFormAdminSystemValue")>-1', template: "<button class=\"btn btn-info\" ng-show=\"shopProcess.gridOptions.resultAccess.AccessAddRow\" ng-click=\"shopProcess.openAdminMainForm(x.Id)\" title=\"مقداردهی مقادیر پیش فرض\" type=\"button\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i></button>" },
            //{ name: "JsonFormDefaultValue", displayName: "پیش فرض", sortable: true, displayForce: true, template: "<button class=\"btn btn-success\" ng-show=\"shopProcess.gridOptions.resultAccess.AccessAddRow\" ng-click=\"shopProcess.openPreviewModal(x.Id)\" title=\"مقداردهی مقادیر پیش فرض\" type=\"button\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i></button>" }
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

    shopProcess.gridOptions.reGetAll = function () {
        shopProcess.init();
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Show InputValue form builder and auto scroll to its position Admin form
    shopProcess.scrollToFormBuilderMainAdmin = function (item) {
        shopProcess.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/GetOne', item.Id, 'GET').success(function (response) {
            shopProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            shopProcess.selectedItem = response.Item;
            $builder.removeAllFormObject('default');
            var component = $.parseJSON(shopProcess.selectedItem.JsonFormAdminMainJsonForm);
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
            shopProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Show Preview form
    shopProcess.showFormMainAdmin = function (preview, selectedId) {
        shopProcess.showSaveButton = false;
        if (preview == "false") {
            shopProcess.showSaveButton = true;
            ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/GetOne', selectedId, 'GET').success(function (response) {
                shopProcess.busyIndicator.isActive = false;
                rashaErManage.checkAction(response);
                shopProcess.selectedItem = response.Item;
                $builder.removeAllFormObject('defaultMainAdmin');
                shopProcess.defaultValueMainAdmin = {};
                var component = $.parseJSON(shopProcess.selectedItem.JsonFormAdminMainJsonForm);
                // Load and set the values from ProcessesJson.newProcess.ProcessCustomizationInputValue
                var values = []; 
                if (shopProcess.selectedItem.JsonFormAdminMainValues != null && shopProcess.selectedItem.JsonFormAdminMainValues != undefined &&
                    shopProcess.selectedItem.JsonFormAdminMainValues.length>0)
                 values =  $.parseJSON(shopProcess.selectedItem.JsonFormAdminMainValues);
                if (component != null && component.length != undefined)
                    $.each(component, function (i, item) {
                        $builder.addFormObject('defaultMainAdmin', item);
                        //تخصیص مقادیر فرم با تشخیص نام فیلد
                        if (values != null && values.length != undefined)
                            $.each(values, function (iValue, itemValue) {
                                if (item.fieldname == itemValue.fieldname) {
                                    $builder.forms.defaultMainAdmin[i].id = i;
                                    shopProcess.defaultValueMainAdmin[i] = itemValue.value;
                                }
                            });
                    });


            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                shopProcess.busyIndicator.isActive = false;
            });
        }
        else {
            $builder.removeAllFormObject('defaultMainAdmin');
            shopProcess.defaultValueMainAdmin = $builder.forms['default'];
            $.each(shopProcess.defaultValueMainAdmin, function (i, item) {
                $builder.addFormObject('defaultMainAdmin', item);
            });
        }
        $modal.open({
            templateUrl: 'cpanelv1/ModuleShop/ShopProcess/formMainAdmin.html',
            scope: $scope
        });
    }
    // Save Input Value Form
    shopProcess.saveJsonFormMainAdmin = function () {
        shopProcess.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/GetOne', shopProcess.selectedItem.Id, 'GET').success(function (response1) {
            shopProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(response1);
            shopProcess.selectedItem = response1.Item;
            // $builder.forms['default'] -> get the form in Json format
            shopProcess.selectedItem.JsonFormAdminMainJsonForm = $.trim(angular.toJson($builder.forms['default']));
            shopProcess.busyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/edit', shopProcess.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    shopProcess.closeModal();
                }
                shopProcess.busyIndicator.isActive = false;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                shopProcess.busyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            shopProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    shopProcess.getFromSystemMainAdmin = function () {
        // Get selected Layout to load form using JsonFormFormat in ViewModel
        var model = { Filters: [] };
        model.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: shopProcess.gridOptions.selectedRow.item.Id });
        shopProcess.addRequested = true;
        shopProcess.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/GetOneWithJsonFormat', model, 'POST').success(function (response) {
            shopProcess.addRequested = false;
            shopProcess.busyIndicator.isActive = false;
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
            shopProcess.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopProcess.busyIndicator.isActive = false;
        });
    }

    shopProcess.saveSubmitValuesMainAdmin = function () {
        var updateMethod = "PUT";
        var updateMode = "edit";
        //if (shopProcess.updateMode == "add")
        //    updateMethod = "POST";
        shopProcess.addRequested = true;
        shopProcess.selectedItem.JsonFormAdminMainValues = ($.trim(angular.toJson(shopProcess.submitValueFormMainAdmin)));
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/' + updateMode, shopProcess.selectedItem, updateMethod).success(function (response) {
            rashaErManage.checkAction(response);
            shopProcess.addRequested = false;
            shopProcess.closeModal();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopProcess.addRequested = false;
        });
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Show InputValue form builder and auto scroll to its position
    shopProcess.scrollToFormBuilderSiteAdmin = function (item) {
        shopProcess.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/GetOne', item.Id, 'GET').success(function (response) {
            shopProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            shopProcess.selectedItem = response.Item;
            $builder.removeAllFormObject('default');
           // var component = shopProcess.selectedItem.JsonFormAdminSiteJsonForm;
   var component = $.parseJSON(shopProcess.selectedItem.JsonFormAdminSiteJsonForm);
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
            shopProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Show Preview form
    shopProcess.showFormSiteAdmin = function (preview, selectedId) {
        shopProcess.showSaveButton = false;
        if (preview == "false") {
            shopProcess.showSaveButton = true;
            ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/GetOne', selectedId, 'GET').success(function (response) {
                shopProcess.busyIndicator.isActive = false;
                rashaErManage.checkAction(response);
                shopProcess.selectedItem = response.Item;
                $builder.removeAllFormObject('defaultSiteAdmin');
                shopProcess.defaultValueSiteAdmin = {};
                var component = $.parseJSON(shopProcess.selectedItem.JsonFormAdminSiteJsonForm);
                // Load and set the values from ProcessesJson.newProcess.ProcessCustomizationInputValue
                var values = $.parseJSON(shopProcess.selectedItem.JsonFormAdminSiteValuesDefault);
                if (component != null && component.length != undefined)
                    $.each(component, function (i, item) {
                        $builder.addFormObject('defaultSiteAdmin', item);
                        //تخصیص مقادیر فرم با تشخیص نام فیلد
                        if (values != null && values.length != undefined)
                            $.each(values, function (iValue, itemValue) {
                                if (item.fieldname == itemValue.fieldname) {
                                    $builder.forms.defaultSiteAdmin[i].id = i;
                                    shopProcess.defaultValueSiteAdmin[i] = itemValue.value;
                                }
                            });
                    });
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                shopProcess.busyIndicator.isActive = false;
            });
        }
        else {
            $builder.removeAllFormObject('defaultSiteAdmin');
            shopProcess.defaultValueSiteAdmin = $builder.forms['default'];
            $.each(shopProcess.defaultValueSiteAdmin, function (i, item) {
                $builder.addFormObject('defaultSiteAdmin', item);
            });
        }
        $modal.open({
            templateUrl: 'cpanelv1/ModuleShop/ShopProcess/formSiteAdmin.html',
            scope: $scope
        });
    }
    // Save Input Value Form
    shopProcess.saveJsonFormSiteAdmin = function () {
        shopProcess.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/GetOne', shopProcess.selectedItem.Id, 'GET').success(function (response1) {
            shopProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(response1);
            shopProcess.selectedItem = response1.Item;
            // $builder.forms['default'] -> get the form in Json format
            shopProcess.selectedItem.JsonFormAdminSiteJsonForm = $.trim(angular.toJson($builder.forms['default']));
            shopProcess.busyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/edit', shopProcess.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    shopProcess.closeModal();
                }
                shopProcess.busyIndicator.isActive = false;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                shopProcess.busyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            shopProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    shopProcess.getFromSystemSiteAdmin = function () {
        // Get selected Layout to load form using JsonFormFormat in ViewModel
        var model = { Filters: [] };
        model.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: shopProcess.gridOptions.selectedRow.item.Id });
        shopProcess.addRequested = true;
        shopProcess.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/GetOneWithJsonFormat', model, 'POST').success(function (response) {
            shopProcess.addRequested = false;
            shopProcess.busyIndicator.isActive = false;
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
            shopProcess.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopProcess.busyIndicator.isActive = false;
        });
    }

    shopProcess.saveSubmitValuesSiteAdmin = function () {
        var updateMethod = "PUT";
        var updateMode = "edit";
        //if (shopProcess.updateMode == "add")
        //    updateMethod = "POST";
        shopProcess.addRequested = true;
        shopProcess.selectedItem.JsonFormAdminSiteValuesDefault = ($.trim(angular.toJson(shopProcess.submitValueFormSiteAdmin)));
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/' + updateMode, shopProcess.selectedItem, updateMethod).success(function (response) {
            rashaErManage.checkAction(response);
            shopProcess.addRequested = false;
            shopProcess.closeModal();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopProcess.addRequested = false;
        });
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    shopProcess.gridOptions.onRowSelected = function () { }

    shopProcess.columnCheckbox = false;

    shopProcess.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (shopProcess.gridOptions.columnCheckbox) {
            for (var i = 0; i < shopProcess.gridOptions.columns.length; i++) {
                var element = $("#" + shopProcess.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                shopProcess.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = shopProcess.gridOptions.columns;
            for (var i = 0; i < shopProcess.gridOptions.columns.length; i++) {
                shopProcess.gridOptions.columns[i].visible = true;
                var element = $("#" + shopProcess.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + shopProcess.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < shopProcess.gridOptions.columns.length; i++) {
            console.log(shopProcess.gridOptions.columns[i].name.concat(".visible: "), shopProcess.gridOptions.columns[i].visible);
        }
        shopProcess.gridOptions.columnCheckbox = !shopProcess.gridOptions.columnCheckbox;
    }

    shopProcess.scrollToFormBuilder = function (item) {
        shopProcess.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/GetOne', item.Id, 'GET').success(function (response) {
            shopProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            shopProcess.selectedItem = response.Item;

            $builder.removeAllFormObject('default');
            var component = parseJSONcomponent(shopProcess.selectedItem.JsonForm);
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
            shopProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Show Preview form
    shopProcess.showFormPreview = function () {
        shopProcess.busyIndicator.isActive = true;
        shopProcess.addRequested = true;
        var filterDataModel = { PropertyName: "LinkApplicationId", searchType: 0, IntValue1: shopProcess.selectedAppId };
        var filterDataModel = { PropertyName: "LinkProcessId", searchType: 0, IntValue1: shopProcess.selectedSourceId };
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProcessvalue/getone', shopProcess.selectedItem.Id, 'GET').success(function (response1) {
            shopProcess.busyIndicator.isActive = false;
            shopProcess.addRequested = false;
            shopProcess.formJson = $builder.forms['default'];
            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/ShopProcess/preview.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            shopProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Save Input Value Form
    shopProcess.saveProcessInputCustomizeValue = function () {
        shopProcess.busyIndicator.isActive = true;
        shopProcess.selectedProcessId = shopProcess.gridOptions.selectedRow.item.Id;       //Storing selected Process Id for further uses
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/GetOne', shopProcess.selectedItem.Id, 'GET').success(function (response1) {
            shopProcess.busyIndicator.isActive = false;
            rashaErManage.checkAction(response1);
            shopProcess.selectedItem = response1.Item;
            // $builder.forms['default'] -> get the form in Json format
            shopProcess.selectedItem.JsonForm = $.trim(angular.toJson($builder.forms['default']));
            shopProcess.busyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/edit', shopProcess.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    shopProcess.closeModal();
                }
                shopProcess.busyIndicator.isActive = false;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                shopProcess.busyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            shopProcess.busyIndicator.isActive = false;
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

    shopProcess.getFromSystem = function () {
        // Get selected Process to load form using JsonFormFormat in ViewModel
        shopProcess.busyIndicator.isActive = true;
        var filterModel = { Filters: [] };
        filterModel.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: shopProcess.gridOptions.selectedRow.item.Id });
        ajax.call(cmsServerConfig.configApiServerPath+'shopProcess/getonewithjsonformat', filterModel, 'POST').success(function (response) {
            shopProcess.busyIndicator.isActive = false;
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
            shopProcess.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopProcess.busyIndicator.isActive = false;
        });
    }

    shopProcess.defaultValue = {};

    // Show Preview form
    shopProcess.openPreviewModal = function (ProcessId) {
        shopProcess.openPreviewForm = true;
        var filterDataModel = { PropertyName: "Id", searchType: 0, IntValue1: shopProcess.ProcessId };
        var engine = { Filters: [] };
        engine.Filters.push(filterDataModel);
        ajax.call(cmsServerConfig.configApiServerPath+'shopProcess/GetOne', ProcessId, 'GET').success(function (response) {
            shopProcess.selectedItem = response.Item;
            shopProcess.formJson = $builder.forms['default'];
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
                                    shopProcess.defaultValue[i] = itemValue.value;
                            });
                    } catch (e) {
                    }
                });

            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/ShopProcess/preview.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    shopProcess.openAdminMainForm = function (ProcessId) {
        shopProcess.openPreviewForm = false;
        var filterDataModel = { PropertyName: "Id", SearchType: 0, IntValue1: ProcessId };
        var engine = { Filters: [] };
        engine.Filters.push(filterDataModel);
        ajax.call(cmsServerConfig.configApiServerPath+'shopProcess/getonewithjsonformat', engine, 'POST').success(function (response) {

            shopProcess.selectedItem = response.Item;
            shopProcess.formJson = $builder.forms['default'];
            $builder.removeAllFormObject('default');
            //var component = $.parseJSON(response.Item.JsonFormAdminSystemValue);
            if (response.IsSuccess) {
                // Load and set the values
                var values = $.parseJSON(response.Item.JsonFormAdminSystemValue);
                // Clear privous values in formBuilder
                if (values != null && values.length != undefined)
                    $.each(values, function (i, item) {
                        shopProcess.defaultValue[item.id] = null;
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
                                        shopProcess.defaultValue[i] = itemValue.value;
                                });
                        }
                    });
                }
                $modal.open({
                    templateUrl: 'cpanelv1/ModuleShop/ShopProcess/preview.html',
                    scope: $scope
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    shopProcess.saveSubmitValues = function () {
        shopProcess.busyIndicator.isActive = true;
        shopProcess.addRequested = true;
        if (shopProcess.openPreviewForm)
            shopProcess.selectedItem.JsonFormDefaultValue = $.trim(angular.toJson(shopProcess.submitValue));
        else
            shopProcess.selectedItem.JsonFormAdminSystemValue = $.trim(angular.toJson(shopProcess.submitValue));
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProcess/edit', shopProcess.selectedItem, 'PUT').success(function (response) {
            shopProcess.addRequested = true;
            rashaErManage.checkAction(response);
            shopProcess.busyIndicator.isActive = false;
            shopProcess.addRequested = false;
            shopProcess.closeModal();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopProcess.busyIndicator.isActive = false;
            shopProcess.addRequested = false;
        });
    }
    //TreeControl
    shopProcess.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (shopProcess.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    shopProcess.onNodeToggle = function (node, expanded) {
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

    shopProcess.onSelection = function (node, selected) {
        if (!selected) {
            shopProcess.selectedItem.LinkModuleFilePreviewImageId = null;
            shopProcess.selectedItem.previewImageSrc = null;
            return;
        }
        shopProcess.selectedItem.LinkModuleFilePreviewImageId = node.Id;
        shopProcess.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            shopProcess.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
//upload file
    shopProcess.uploadFile = function (index, uploadFile) {
      if ($("#save-icon" + index).hasClass("fa-save")) {
          if (shopProcess.fileIsExist(uploadFile.name)) {
          // File already exists
          if (
            confirm(
              'File "' +
                uploadFile.name +
                '" already exists! Do you want to replace the new file?'
            )
          ) {
            //------------ shopProcess.replaceFile(uploadFile.name);
            shopProcess.itemClicked(null, shopProcess.fileIdToDelete, "file");
            shopProcess.fileTypes = 1;
            shopProcess.fileIdToDelete = shopProcess.selectedIndex;
            // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                shopProcess.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        shopProcess.FileItem = response2.Item;
                        shopProcess.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        shopProcess.filePickerMainImage.filename =
                          shopProcess.FileItem.FileName;
                        shopProcess.filePickerMainImage.fileId =
                          response2.Item.Id;
                        shopProcess.selectedItem.LinkMainImageId =
                          shopProcess.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      shopProcess.showErrorIcon();
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
              shopProcess.FileItem = response.Item;
                shopProcess.FileItem.FileName = uploadFile.name;
                shopProcess.FileItem.uploadName = uploadFile.uploadName;
                shopProcess.FileItem.Extension = uploadFile.name.split(".").pop();
                shopProcess.FileItem.FileSrc = uploadFile.name;
              shopProcess.FileItem.LinkCategoryId = null; //Save the new file in the root
              // ------- shopProcess.saveNewFile()  ----------------------
              var result = 0;
              ajax
                .call(cmsServerConfig.configApiServerPath + "FileContent/add", shopProcess.FileItem, "POST")
                .success(function(response) {
                  if (response.IsSuccess) {
                    shopProcess.FileItem = response.Item;
                    shopProcess.showSuccessIcon();
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-check");
                    shopProcess.filePickerMainImage.filename =
                      shopProcess.FileItem.FileName;
                    shopProcess.filePickerMainImage.fileId = response.Item.Id;
                    shopProcess.selectedItem.LinkMainImageId =
                      shopProcess.filePickerMainImage.fileId;
                  } else {
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-remove");
                  }
                })
                .error(function(data) {
                  shopProcess.showErrorIcon();
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

