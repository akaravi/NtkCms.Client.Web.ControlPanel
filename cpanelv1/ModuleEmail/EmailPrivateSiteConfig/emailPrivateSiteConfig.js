app.controller("emailPrivateSiteConfigCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$builder', '$state', '$stateParams', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $builder, $state, $stateParams, $filter) {
    var emailPrivateSiteConfig = this;
    emailPrivateSiteConfig.ManageUserAccessControllerTypes = [];

    emailPrivateSiteConfig.selectedPublicConfig = {
        Id: $stateParams.publicConfigId
    };
    var date = moment().format();
    emailPrivateSiteConfig.datePickerConfig = {
        defaultDate: date
    };
    emailPrivateSiteConfig.ErrorTextToStandByLastGetDate = {
        defaultDate: date
    };
    emailPrivateSiteConfig.ErrorTextToDisableLastGetDate = {
        defaultDate: date
    };
    emailPrivateSiteConfig.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) emailPrivateSiteConfig.itemRecordStatus = itemRecordStatus;

//#help/ سلکتور similar
    emailPrivateSiteConfig.LinkSuperSederIdSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkSuperSederId",
      url: "emailprivatesiteconfig",
      sortColumn: "Id",
      sortType: 0,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: emailPrivateSiteConfig,
      columnOptions: {
        columns: [
          {
            name: "Id",
            displayName: "کد سیستمی",
            sortable: true,
            type: "integer"
          },
          {
            name: "Title",
            displayName: "عنوان",
            sortable: true,
            type: "string"
          }
        ]
      }
    };
     emailPrivateSiteConfig.LinkApiPathCompanyIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkApiPathCompanyId',
        url: 'EmailApiPathCompany',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: emailPrivateSiteConfig,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    emailPrivateSiteConfig.init = function() {
        if (emailPrivateSiteConfig.selectedPublicConfig.Id == 0 || emailPrivateSiteConfig.selectedPublicConfig.Id == null) {
            $state.go("index.emailpublicconfig");
            return;
        }
        var engine = {
            Filters: [{
                PropertyName: "Id",
                IntValue1: emailPrivateSiteConfig.selectedPublicConfig.Id
            }]
        };
        ajax.call(cmsServerConfig.configApiServerPath+'emailpublicconfig/getonewithjsonformatter', engine, 'POST').success(function(response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            emailPrivateSiteConfig.selectedPublicConfig = response.Item;
        }).error(function(data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });

        emailPrivateSiteConfig.busyIndicator.isActive = true;
        var filterModel = {
            PropertyName: "LinkPublicConfigId",
            SearchType: 0,
            IntValue1: emailPrivateSiteConfig.selectedPublicConfig.Id
        };
        emailPrivateSiteConfig.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
        ajax.call(cmsServerConfig.configApiServerPath+"emailprivatesiteconfig/getall", emailPrivateSiteConfig.gridOptions.advancedSearchData.engine, 'POST').success(function(response) {
            emailPrivateSiteConfig.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            emailPrivateSiteConfig.ListItems = response.ListItems;
            emailPrivateSiteConfig.gridOptions.fillData(emailPrivateSiteConfig.ListItems, response.resultAccess);
            emailPrivateSiteConfig.gridOptions.currentPageNumber = response.CurrentPageNumber;
            emailPrivateSiteConfig.gridOptions.totalRowCount = response.TotalRowCount;
            emailPrivateSiteConfig.gridOptions.rowPerPage = response.RowPerPage;
            emailPrivateSiteConfig.gridOptions.maxSize = 5;
            emailPrivateSiteConfig.busyIndicator.isActive = false;
        }).error(function(data, errCode, c, d) {
            emailPrivateSiteConfig.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"emailPrivateSiteConfig/getall", {}, 'POST').success(function(response) {
            rashaErManage.checkAction(response);
            emailPrivateSiteConfig.emailPrivateSiteConfigListItems = response.ListItems;
        }).error(function(data, errCode, c, d) {
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
    emailPrivateSiteConfig.addRequested = false;
    emailPrivateSiteConfig.openAddModal = function() {
        if (buttonIsPressed) {
            return
        };
        emailPrivateSiteConfig.modalTitle = 'اضافه';
        $builder.removeAllFormObject('default');
        emailPrivateSiteConfig.defaultValue = {};

        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'emailprivatesiteconfig/GetViewModel', '', 'GET').success(function(response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            emailPrivateSiteConfig.selectedItem = response.Item;
            emailPrivateSiteConfig.selectedItem.ApiPathSuperSeder = [];
            emailPrivateSiteConfig.clearPreviousData();
            emailPrivateSiteConfig.selectedItem.LinkPublicConfigId = emailPrivateSiteConfig.selectedPublicConfig.Id;

            //Load FormBuilder and its values
            //var customizeValue = JSON.parse(response.Item.privateSiteConfigJsonValues);
            var customizeValue = emailPrivateSiteConfig.selectedPublicConfig.PrivateConfigJsonFormatter;
            if (customizeValue != null && customizeValue.length > 0) {
                $.each(customizeValue, function(i, item) {
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
                        } else {
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
                            $.each(values, function(iValue, itemValue) {
                                if (item.FieldName == itemValue.fieldname)
                                    emailPrivateSiteConfig.defaultValue[i] = itemValue.value;
                            });
                        }
                    }
                });
            }


            $modal.open({
                templateUrl: 'cpanelv1/ModuleEmail/EmailPrivateSiteConfig/add.html',
                scope: $scope
            });

        }).error(function(data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
//#help SuperSeder 
    emailPrivateSiteConfig.clearPreviousData = function() {
      emailPrivateSiteConfig.selectedItem.ApiPathSuperSeder = [];
      $("#to").empty();
    };


//#help Super Seder
emailPrivateSiteConfig.moveSelected = function(from, to, calculatePrice) {
      if (from == "Content") {
        //var title = emailPrivateSiteConfig.ItemListIdSelector.selectedItem.Title;
        // var optionSelectedPrice = emailPrivateSiteConfig.ItemListIdSelector.selectedItem.Price;
        if (
          emailPrivateSiteConfig.selectedItem.LinkSuperSederId != undefined &&
          emailPrivateSiteConfig.selectedItem.LinkSuperSederId != null
        ) {
          if (emailPrivateSiteConfig.selectedItem.SuperSeder == undefined)
            emailPrivateSiteConfig.selectedItem.ApiPathSuperSeder = [];
          for (var i = 0; i < emailPrivateSiteConfig.selectedItem.ApiPathSuperSeder.length; i++) {
            if (
              emailPrivateSiteConfig.selectedItem.ApiPathSuperSeder[i].LinkSuperSederId ==
              emailPrivateSiteConfig.selectedItem.LinkSuperSederId
            ) {
              rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
              return;
            }
          }
          // if (emailPrivateSiteConfig.selectedItem.Title == null || emailPrivateSiteConfig.selectedItem.Title.length < 0)
          //     emailPrivateSiteConfig.selectedItem.Title = title;
          emailPrivateSiteConfig.selectedItem.ApiPathSuperSeder.push({
            //Id: 0,
            //Source: from,
            LinkSuperSederId: emailPrivateSiteConfig.selectedItem.LinkSuperSederId,
            SuperSeder: emailPrivateSiteConfig.LinkSuperSederIdSelector.selectedItem
          });
        }
      }
    };
emailPrivateSiteConfig.removeFromCollection = function(listsimilar,idSuperSeder) {
      for (var i = 0; i < emailPrivateSiteConfig.selectedItem.ApiPathSuperSeder.length; i++) 
       {       
            if(listsimilar[i].LinkSuperSederId==idSuperSeder)
            {
                emailPrivateSiteConfig.selectedItem.ApiPathSuperSeder.splice(i, 1);
                return;
            }
          
      }
      
    };



    emailPrivateSiteConfig.addNewRow = function(frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        emailPrivateSiteConfig.addRequested = true;
        emailPrivateSiteConfig.busyIndicator.isActive = true;
        emailPrivateSiteConfig.selectedItem.PrivateConfigJsonValues = $.trim(angular.toJson(emailPrivateSiteConfig.submitValue));
        var apiSelectedItem =emailPrivateSiteConfig.selectedItem;
        if (apiSelectedItem.ApiPathSuperSeder)
        $.each(apiSelectedItem.ApiPathSuperSeder, function(index, item) {
          item.SuperSeder = [];
        });
        ajax.call(cmsServerConfig.configApiServerPath+'emailprivatesiteconfig/add', apiSelectedItem, 'POST').success(function(response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                emailPrivateSiteConfig.ListItems.unshift(response.Item);
                emailPrivateSiteConfig.gridOptions.fillData(emailPrivateSiteConfig.ListItems);
                emailPrivateSiteConfig.addRequested = false;
                emailPrivateSiteConfig.busyIndicator.isActive = false;
                emailPrivateSiteConfig.closeModal();
            }
        }).error(function(data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            emailPrivateSiteConfig.addRequested = false;
            emailPrivateSiteConfig.busyIndicator.isActive = false;
        });
    }

    emailPrivateSiteConfig.openEditModal = function() {
        if (buttonIsPressed) {
            return
        };
        emailPrivateSiteConfig.modalTitle = 'ویرایش';
        if (!emailPrivateSiteConfig.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        emailPrivateSiteConfig.defaultValue = {};
        $builder.removeAllFormObject('default');
        var engine = {
            Filters: [{
                PropertyName: "Id",
                IntValue1: emailPrivateSiteConfig.gridOptions.selectedRow.item.Id
            }]
        };

        buttonIsPressed = true;
        emailPrivateSiteConfig.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'emailprivatesiteconfig/getonewithjsonformatter', engine, 'POST').success(function(response) {
            buttonIsPressed = false;
            emailPrivateSiteConfig.addRequested = false;
            rashaErManage.checkAction(response);
            emailPrivateSiteConfig.selectedItem = response.Item;
            emailPrivateSiteConfig.ErrorTextToStandByLastGetDate.defaultDate = emailPrivateSiteConfig.selectedItem.ErrorTextToStandByLastGetDate;
            emailPrivateSiteConfig.ErrorTextToDisableLastGetDate.defaultDate = emailPrivateSiteConfig.selectedItem.ErrorTextToDisableLastGetDate;
            //Load FormBuilder and its values
            //var customizeValue = JSON.parse(response.Item.emailPrivateSiteConfigJsonValues);
            var customizeValue = response.Item.PrivateConfigJsonFormatter;
            if (customizeValue != null && customizeValue.length > 0) {
                $.each(customizeValue, function(i, item) {
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
                        } else {
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
                            $.each(values, function(iValue, itemValue) {
                                if (item.FieldName == itemValue.fieldname)
                                    emailPrivateSiteConfig.defaultValue[i] = itemValue.value;
                            });
                        }
                    }
                });
            }

            $modal.open({
                templateUrl: 'cpanelv1/ModuleEmail/EmailPrivateSiteConfig/edit.html',
                scope: $scope
            });
        }).error(function(data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    emailPrivateSiteConfig.editRow = function(frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        emailPrivateSiteConfig.addRequested = true;
        emailPrivateSiteConfig.busyIndicator.isActive = true;

        emailPrivateSiteConfig.selectedItem.PrivateConfigJsonValues = $.trim(angular.toJson(emailPrivateSiteConfig.submitValue));
        var apiSelectedItem = emailPrivateSiteConfig.selectedItem;
        if (apiSelectedItem.ApiPathSuperSeder)
        $.each(apiSelectedItem.ApiPathSuperSeder, function(index, item) {
          item.SuperSeder = [];
        });
        ajax.call(cmsServerConfig.configApiServerPath+'emailprivatesiteconfig/edit', apiSelectedItem, 'PUT').success(function(response) {
            emailPrivateSiteConfig.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                emailPrivateSiteConfig.replaceItem(emailPrivateSiteConfig.selectedItem.Id, response.Item);
                emailPrivateSiteConfig.addRequested = false;
                emailPrivateSiteConfig.busyIndicator.isActive = false;
                emailPrivateSiteConfig.gridOptions.fillData(emailPrivateSiteConfig.ListItems, response.resultAccess);
                emailPrivateSiteConfig.closeModal();
            }
        }).error(function(data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            emailPrivateSiteConfig.addRequested = false;
            emailPrivateSiteConfig.busyIndicator.isActive = false;
        });
    }

    emailPrivateSiteConfig.closeModal = function() {
        $modalStack.dismissAll();
    };

    emailPrivateSiteConfig.replaceItem = function(oldId, newItem) {
        angular.forEach(emailPrivateSiteConfig.ListItems, function(item, key) {
            if (item.Id == oldId) {
                var index = emailPrivateSiteConfig.ListItems.indexOf(item);
                emailPrivateSiteConfig.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            emailPrivateSiteConfig.ListItems.unshift(newItem);
    }

    emailPrivateSiteConfig.deleteRow = function() {
        if (buttonIsPressed) {
            return
        };
        if (!emailPrivateSiteConfig.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function(isConfirmed) {
            if (isConfirmed) {
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'emailprivatesiteconfig/GetOne', emailPrivateSiteConfig.gridOptions.selectedRow.item.Id, 'GET').success(function(response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    emailPrivateSiteConfig.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'emailprivatesiteconfig/delete', emailPrivateSiteConfig.selectedItemForDelete, 'POST').success(function(res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            emailPrivateSiteConfig.replaceItem(emailPrivateSiteConfig.selectedItemForDelete.Id);
                            emailPrivateSiteConfig.gridOptions.fillData(emailPrivateSiteConfig.ListItems);
                        }
                    }).error(function(data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                    });
                }).error(function(data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });
    }

    emailPrivateSiteConfig.searchData = function() {
        emailPrivateSiteConfig.gridOptions.serachData();
    }

    emailPrivateSiteConfig.gridOptions = {
        columns: [{
                name: 'Id',
                displayName: 'کد سیستمی',
                sortable: true,
                type: 'integer'
            },
            {
                name: 'CreatedDate',
                displayName: 'ساخت',
                sortable: true,
                isDate: true,
                type: 'date',
                visible: 'true'
            },
            {
                name: 'UpdatedDate',
                displayName: 'ویرایش',
                sortable: true,
                isDate: true,
                type: 'date',
                visible: 'true'
            },
            {
                name: 'Title',
                displayName: 'عنوان',
                sortable: true,
                type: 'string'
            },
            {
                name: 'EmailSenderEmail',
                displayName: 'ایمیل فرستنده',
                sortable: true,
                type: 'string'
            },
            {
                name: 'ActionButton',
                displayName: 'تست ارسال',
                sortable: true,
                displayForce: true,
                template: '<button class="btn btn-success" ng-click="emailPrivateSiteConfig.openTestEmailModal(x.Id)"><i class="fa fa-send" aria-hidden="true"></i></button>'
            },
            {
                name: 'ActionButton',
                displayName: 'لیست سفارشات',
                sortable: true,
                displayForce: true,
                template: '<button class="btn btn-success" ng-click="emailPrivateSiteConfig.goToTransactionState(x.Id)"><i class="fa fa-list" aria-hidden="true"></i></button>'
            },
            { name: 'ActionKey', displayName: 'تنظیمات', sortable: true, type: 'string', displayForce: true, template: '<button class="btn btn-success" ng-click="emailPrivateSiteConfig.goToPrivateConfig(x.Id)"><i class="fa fa-cog" aria-hidden="false"></i>&nbsp;قیمت گذاری</button>' }
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
    emailPrivateSiteConfig.goToPrivateConfig = function (selectedId) {
        $state.go("index.emailapipathpriceservice", { PrivateSiteConfigId: selectedId });
    }
    emailPrivateSiteConfig.gridOptions.reGetAll = function() {
        emailPrivateSiteConfig.init();
    }

    emailPrivateSiteConfig.gridOptions.onRowSelected = function() {}

    //Export Report 
    emailPrivateSiteConfig.exportFile = function() {
        emailPrivateSiteConfig.addRequested = true;
        emailPrivateSiteConfig.gridOptions.advancedSearchData.engine.ExportFile = emailPrivateSiteConfig.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreSite/exportfile', emailPrivateSiteConfig.gridOptions.advancedSearchData.engine, 'POST').success(function(response) {
            emailPrivateSiteConfig.addRequested = false;
            rashaErManage.checkAction(response);
            emailPrivateSiteConfig.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //emailPrivateSiteConfig.closeModal();
            }
        }).error(function(data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    emailPrivateSiteConfig.toggleExportForm = function() {
        emailPrivateSiteConfig.SortType = [{
                key: 'نزولی',
                value: 0
            },
            {
                key: 'صعودی',
                value: 1
            },
            {
                key: 'تصادفی',
                value: 3
            }
        ];
        emailPrivateSiteConfig.EnumExportFileType = [{
                key: 'Excel',
                value: 1
            },
            {
                key: 'PDF',
                value: 2
            },
            {
                key: 'Text',
                value: 3
            }
        ];
        emailPrivateSiteConfig.EnumExportReceiveMethod = [{
                key: 'دانلود',
                value: 0
            },
            {
                key: 'ایمیل',
                value: 1
            },
            {
                key: 'فایل منیجر',
                value: 3
            }
        ];
        emailPrivateSiteConfig.ExportFileClass = {
            FileType: 1,
            RecieveMethod: 0,
            RowCount: 100
        };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleEmail/EmailPrivateSiteConfig/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    emailPrivateSiteConfig.rowCountChanged = function() {
        if (!angular.isDefined(emailPrivateSiteConfig.ExportFileClass.RowCount) || emailPrivateSiteConfig.ExportFileClass.RowCount > 5000)
            emailPrivateSiteConfig.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    emailPrivateSiteConfig.getCount = function() {
        ajax.call(cmsServerConfig.configApiServerPath+"CoreSite/count", emailPrivateSiteConfig.gridOptions.advancedSearchData.engine, 'POST').success(function(response) {
            emailPrivateSiteConfig.addRequested = false;
            rashaErManage.checkAction(response);
            emailPrivateSiteConfig.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function(data, errCode, c, d) {
            emailPrivateSiteConfig.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    emailPrivateSiteConfig.openBaseConfigModal = function(selectedId) {
        emailPrivateSiteConfig.defaultValue = {};
        $builder.removeAllFormObject('default');
        var engine = {
            Filters: [{
                PropertyName: "Id",
                IntValue1: selectedId
            }]
        };
        emailPrivateSiteConfig.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+"emailPrivateSiteConfig/getonewithjsonformatter", engine, 'POST').success(function(response) {
            emailPrivateSiteConfig.addRequested = false;
            if (response.IsSuccess) {
                emailPrivateSiteConfig.selectedItem = response.Item;
                $modal.open({
                    templateUrl: 'cpanelv1/ModuleEmail/EmailPrivateSiteConfig/preview.html',
                    scope: $scope
                });
                $builder.removeAllFormObject('default');
                //var customizeValue = JSON.parse(response.Item.emailPrivateSiteConfigJsonValues);
                var customizeValue = response.Item.PrivateConfigJsonFormatter;
                if (customizeValue != null && customizeValue.length > 0) {
                    $.each(customizeValue, function(i, item) {
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
                            } else {
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
                                $.each(values, function(iValue, itemValue) {
                                    if (item.FieldName == itemValue.fieldname)
                                        emailPrivateSiteConfig.defaultValue[i] = itemValue.value;
                                });
                            }
                        }
                    });
                }
            }
        }).error(function(data, errCode, c, d) {
            emailPrivateSiteConfig.addRequested = false;
            rashaErManage.checkAction(data, errCode);
        });
    }
    emailPrivateSiteConfig.testPayValue = {};
    emailPrivateSiteConfig.testPayValue.Item = {};
    emailPrivateSiteConfig.EmailSendMakerClass = {
        LinkPrivateSiteId: 0,
        emailFrom: "",
        emailFromName: "",
        emailTo: "",
        emailSubject: "",
        emailBody: ""
    };
    emailPrivateSiteConfig.openTestEmailModal = function(selectedId) {
        emailPrivateSiteConfig.EmailSendMakerClass = {
            LinkPrivateSiteId: selectedId,
            emailFrom: "",
            emailFromName:"",
            emailTo: "",
            emailSubject:"",
            emailBody: ""
        };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleEmail/EmailPrivateSiteConfig/testEmail.html',
            scope: $scope

        });
    }
    emailPrivateSiteConfig.summernoteOptions = {
        height: 300,
        focus: true,
        airMode: false,
        toolbar: [
            ['edit', ['undo', 'redo']],
            ['headline', ['style']],
            ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
            ['fontface', ['fontname']],
            ['textsize', ['fontsize']],
            ['fontclr', ['color']],
            ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
            ['height', ['height']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'video', 'hr']],
            ['view', ['fullscreen', 'codeview']],
            ['help', ['help']]
        ]
    };
    emailPrivateSiteConfig.testEmail = function() {
        //emailPrivateSiteConfig.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+"emailprivatesiteconfig/testemail", emailPrivateSiteConfig.EmailSendMakerClass, 'POST').success(function(response) {
            emailPrivateSiteConfig.addRequested = false;
            emailPrivateSiteConfig.testPayValue = response;
            emailPrivateSiteConfig.EmailSendMakerClass.RedirectWebUrl = response.RedirectWebUrl;
        }).error(function(data, errCode, c, d) {
            pemailPrivateSiteConfig.addRequested = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    emailPrivateSiteConfig.saveSubmitValues = function() {
        emailPrivateSiteConfig.addRequested = true;
        emailPrivateSiteConfig.busyIndicator.isActive = true;
        emailPrivateSiteConfig.selectedItem.PrivateConfigJsonValues = $.trim(angular.toJson(emailPrivateSiteConfig.submitValue));
        ajax.call(cmsServerConfig.configApiServerPath+'emailPrivateSiteConfig/edit', emailPrivateSiteConfig.selectedItem, 'PUT').success(function(response) {
            emailPrivateSiteConfig.addRequested = true;
            emailPrivateSiteConfig.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            emailPrivateSiteConfig.closeModal();
        }).error(function(data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            emailPrivateSiteConfig.addRequested = false;
            emailPrivateSiteConfig.busyIndicator.isActive = false;
        });
    }
    emailPrivateSiteConfig.changeState = function(state) {
        $state.go("index." + state);
    }

    emailPrivateSiteConfig.goToTransactionState = function(selectedId) {
        $state.go("index.emailprocesstask", {
            privateSiteConfigId: selectedId
        });
    }
}]);