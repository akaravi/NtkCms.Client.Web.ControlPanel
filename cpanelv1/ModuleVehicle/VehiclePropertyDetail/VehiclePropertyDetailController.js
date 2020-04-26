app.controller("vehiclePropertyDetailController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$location', '$state', '$stateParams', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $location, $state, $stateParams, $window, $filter) {
    var vehiclePropertyDetail = this;
    //For Grid Options
    if (itemRecordStatus != undefined) vehiclePropertyDetail.itemRecordStatus = itemRecordStatus;
    vehiclePropertyDetail.inputTypeArray = [];
    vehiclePropertyDetail.gridOptions = {};
    vehiclePropertyDetail.selectedItem = {};
    vehiclePropertyDetail.attachedFiles = [];
    vehiclePropertyDetail.ListItems = [];
    vehiclePropertyDetail.propertyTypeListItems = [];
    vehiclePropertyDetail.attachedFile = "";

    vehiclePropertyDetail.count = 0;
//#help/ سلکتور دسته بندی در ویرایش محتوا
vehiclePropertyDetail.LinkCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryId',
        url: 'VehiclePropertyDetailGroup',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: vehiclePropertyDetail,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    //VehiclePropertyDetail Grid Options
    vehiclePropertyDetail.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'TypeDescription', displayForce: true, displayName: 'نوع ورودی', sortable: true, type: 'string' },
            { name: 'virtual_PropertyType.Title', displayName: 'نوع ملک', sortable: true, displayForce: true, type: 'string' },
            { name: 'Required', displayName: 'الزامی است؟', sortable: true, isCheckBox: true, type: 'boolean' },
            { name: 'ShowInFormOrder', displayName: 'عدد ترتیب نمایش', sortable: true, type: 'integer' },
            { name: 'ActionButton', displayName: 'ترتیب نمایش', sortable: true, type: 'string', displayForce: true, template: "<button class=\"btn btn-primary btn-circle\" type=\"button\" title=\"انتقال به بالا\" ng-click=\"vehiclePropertyDetail.editStepGoUp(x, $index)\" ng-show=\"x.LinkPropertyDetailGroupId != null\"><i class=\"glyphicon glyphicon-arrow-up\"  aria-hidden=\"true\" style=\"font-weight: bold;\" ></i></button>&nbsp<button class=\"btn btn-danger btn-circle\" title=\"انتقال به پایین\" ng-show=\"x.LinkPropertyDetailGroupId != null\" ng-click=\"vehiclePropertyDetail.editStepGoDown(x, $index)\"><i class=\"glyphicon glyphicon-arrow-down\"  aria-hidden=\"true\" ></i></button>" }
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
                RowPerPage: 100,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }

    //For Show Category Loading Indicator
    vehiclePropertyDetail.categorybusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show VehiclePropertyDetail Loading Indicator
    vehiclePropertyDetail.busyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    vehiclePropertyDetail.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children',
        Items: null
    };


    vehiclePropertyDetail.treeConfig.currentNode = {};
    vehiclePropertyDetail.treebusyIndicator = false;

    vehiclePropertyDetail.addRequested = false;

    vehiclePropertyDetail.vehiclePropertyDetailGroupListItems = [];

    //init Function
    vehiclePropertyDetail.init = function () {
        vehiclePropertyDetail.categorybusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"VehiclePropertyDetail/getAllUiDesignType", {}, 'POST').success(function (response) {
            vehiclePropertyDetail.UiDesignType = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"VehiclePropertyDetail/GetInputDataTypeEnum", {}, 'POST').success(function (response) {
            vehiclePropertyDetail.inputDataTypeArray = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"VehiclePropertyDetail/GetInputDataTypeEnum", {}, 'POST').success(function (response) {
            vehiclePropertyDetail.inputTypeArray = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });

        if ($stateParams.propertyParam != undefined && $stateParams.propertyParam != null)
            vehiclePropertyDetail.propertyTypeId = $stateParams.propertyParam;
        else
            vehiclePropertyDetail.propertyTypeId = 1;

        var filterValue = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(vehiclePropertyDetail.propertyTypeId),
            SearchType: 0
        }
        vehiclePropertyDetail.gridOptions.advancedSearchData.engine.Filters = [];
        vehiclePropertyDetail.gridOptions.advancedSearchData.engine.Filters.push(filterValue);

        vehiclePropertyDetail.groupResultAccess = null;
        ajax.call(cmsServerConfig.configApiServerPath+"VehiclePropertyDetailGroup/getall", vehiclePropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            vehiclePropertyDetail.vehiclePropertyDetailGroupListItems = response.ListItems;
            vehiclePropertyDetail.treeConfig.Items = response.ListItems;
            vehiclePropertyDetail.groupResultAccess = response.resultAccess;
            vehiclePropertyDetail.categorybusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"VehiclePropertyType/getall", vehiclePropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            vehiclePropertyDetail.propertyTypeListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    };

    // Open Add Category Modal 
    vehiclePropertyDetail.openAddCategoryModal = function () {
        vehiclePropertyDetail.addRequested = false;
        vehiclePropertyDetail.modalTitle = "ایجاد گروه جدید";
        ajax.call(cmsServerConfig.configApiServerPath+'VehiclePropertyDetailGroup/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            vehiclePropertyDetail.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleVehicle/VehiclePropertyDetailGroup/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Add New Category
    vehiclePropertyDetail.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        vehiclePropertyDetail.addRequested = true;
        vehiclePropertyDetail.selectedItem.LinkPropertyTypeId = vehiclePropertyDetail.propertyTypeId;
        vehiclePropertyDetail.selectedItem.IconFont = $("#iconFont").val(); //Save selected icon name in the model
        ajax.call(cmsServerConfig.configApiServerPath+'VehiclePropertyDetailGroup/add', vehiclePropertyDetail.selectedItem, 'POST').success(function (response) {
            vehiclePropertyDetail.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                vehiclePropertyDetail.treeConfig.Items.push(response.Item);
                vehiclePropertyDetail.categorybusyIndicator.isActive = false;
                vehiclePropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            vehiclePropertyDetail.addRequested = false;
            vehiclePropertyDetail.categorybusyIndicator.isActive = false;
        });
    };

    // Open Edit Category Modal
    vehiclePropertyDetail.openEditCategoryModal = function () {
        vehiclePropertyDetail.addRequested = false;
        vehiclePropertyDetail.modalTitle = 'ویرایش';
        if (vehiclePropertyDetail.treeConfig.currentNode.Id == 0 || !vehiclePropertyDetail.treeConfig.currentNode.Id) {
            rashaErManage.showMessage("لطفاَ یک دسته جهت ویرایش انتخاب کنید");
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'VehiclePropertyDetailGroup/GetOne', vehiclePropertyDetail.treeConfig.currentNode.Id, 'GET').success(function (response1) {
            vehiclePropertyDetail.showbusy = false;
            rashaErManage.checkAction(response1);
            vehiclePropertyDetail.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleVehicle/VehiclePropertyDetailGroup/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            vehiclePropertyDetail.categorybusyIndicator.isActive = false;
        });
    }
    // Edit a Category
    vehiclePropertyDetail.editCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        vehiclePropertyDetail.categorybusyIndicator.isActive = true;
        vehiclePropertyDetail.selectedItem.IconFont = $("#iconFont").val(); //Save selected icon name in the model
        ajax.call(cmsServerConfig.configApiServerPath+'VehiclePropertyDetailGroup/edit', vehiclePropertyDetail.selectedItem, 'PUT').success(function (response) {
            vehiclePropertyDetail.addRequested = true;
            vehiclePropertyDetail.treeConfig.showbusy = false;
            vehiclePropertyDetail.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                vehiclePropertyDetail.addRequested = false;
                vehiclePropertyDetail.treeConfig.currentNode.Title = response.Item.Title;
                vehiclePropertyDetail.categorybusyIndicator.isActive = false;
                vehiclePropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            vehiclePropertyDetail.addRequested = false;
            vehiclePropertyDetail.categorybusyIndicator.isActive = false;
        });
    }
    //Delete a Category
    vehiclePropertyDetail.deleteCategory = function () {
        var node = vehiclePropertyDetail.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        if (vehiclePropertyDetail.ListItems.length == 0) {
            rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
                if (isConfirmed) {
                    vehiclePropertyDetail.categorybusyIndicator.isActive = true;
                    ajax.call(cmsServerConfig.configApiServerPath+'VehiclePropertyDetailGroup/GetOne', node.Id, 'GET').success(function (response) {
                        rashaErManage.checkAction(response);
                        vehiclePropertyDetail.selectedItemForDelete = response.Item;
                        ajax.call(cmsServerConfig.configApiServerPath+'VehiclePropertyDetailGroup/delete', vehiclePropertyDetail.selectedItemForDelete, 'POST').success(function (res) {

                            if (res.IsSuccess) {
                                vehiclePropertyDetail.gridOptions.advancedSearchData.engine.Filters = null;
                                vehiclePropertyDetail.gridOptions.advancedSearchData.engine.Filters = [];
                                vehiclePropertyDetail.gridOptions.fillData();
                                vehiclePropertyDetail.categorybusyIndicator.isActive = false;
                                vehiclePropertyDetail.gridOptions.reGetAll();
                                vehiclePropertyDetail.treeConfig.currentNode = null;
                            }

                        }).error(function (data2, errCode2, c2, d2) {
                            rashaErManage.checkAction(data2);
                            vehiclePropertyDetail.categorybusyIndicator.isActive = false;

                        });
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                        vehiclePropertyDetail.categorybusyIndicator.isActive = false;

                    });

                }
            });
        } else
            rashaErManage.showMessage("این دسته دارای محتوا است برای حذف دسته ابتدا محتوای آن را حذف نمایید!");
    }

    //Tree On Node Select Options
    vehiclePropertyDetail.treeConfig.onNodeSelect = function () {
        var node = vehiclePropertyDetail.treeConfig.currentNode;
        if (node != undefined && node != null)
            vehiclePropertyDetail.selectedItem.LinkCategoryId = node.Id;
        vehiclePropertyDetail.selectContent(node);

    };

    //Show Content with Category Id
    vehiclePropertyDetail.selectContent = function (node) {
        vehiclePropertyDetail.gridOptions.selectedRow.item = null;
        if (node == null || node.Id == undefined)
            vehiclePropertyDetail.busyIndicator.message = "در حال بارگذاری...";
        else
            vehiclePropertyDetail.busyIndicator.message = "در حال بارگذاری..." + node.Title;
        vehiclePropertyDetail.busyIndicator.isActive = true;
        //vehiclePropertyDetail.gridOptions.advancedSearchData = {};

        vehiclePropertyDetail.gridOptions.advancedSearchData.engine.Filters = null;
        vehiclePropertyDetail.gridOptions.advancedSearchData.engine.Filters = [];
        if (node != undefined && node.Id != undefined) {
            var filterValue1 = {
                PropertyName: "LinkPropertyDetailGroupId",
                IntValue1: node.Id,
                SearchType: 0
            }
            vehiclePropertyDetail.gridOptions.advancedSearchData.engine.Filters.push(filterValue1);
        }
        var filterValue2 = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: vehiclePropertyDetail.propertyTypeId,
            SearchType: 0
        }
        vehiclePropertyDetail.gridOptions.advancedSearchData.engine.Filters.push(filterValue2);

        ajax.call(cmsServerConfig.configApiServerPath+"vehiclePropertyDetail/getall", vehiclePropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            vehiclePropertyDetail.busyIndicator.isActive = false;
            vehiclePropertyDetail.ListItems = response.ListItems;
            vehiclePropertyDetail.filterEnum(vehiclePropertyDetail.ListItems, vehiclePropertyDetail.inputTypeArray);
            vehiclePropertyDetail.gridOptions.fillData(vehiclePropertyDetail.ListItems, response.resultAccess);
            vehiclePropertyDetail.gridOptions.currentPageNumber = response.CurrentPageNumber;
            vehiclePropertyDetail.gridOptions.totalRowCount = response.TotalRowCount;
            vehiclePropertyDetail.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            vehiclePropertyDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            vehiclePropertyDetail.busyIndicator.isActive = false;
        });
    };

    // Open add Content Model
    vehiclePropertyDetail.openAddContentModal = function () {
        var node = vehiclePropertyDetail.treeConfig.currentNode;
        if (node == undefined || node.Id === 0 || node.Id == undefined || node.Id == null) {
            rashaErManage.showMessage("برای اضافه کردن لطفاً دسته مربوطه را انتخاب کنید.");
            return;
        }
        vehiclePropertyDetail.attachedFields = [];
        vehiclePropertyDetail.FieldName = "";
        vehiclePropertyDetail.addRequested = false;
        vehiclePropertyDetail.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'vehiclePropertyDetail/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            vehiclePropertyDetail.selectedItem = response.Item;
            vehiclePropertyDetail.selectedItem.LinkPropertyDetailGroupId = node.Id;
            vehiclePropertyDetail.onMultipleChoiceChange();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleVehicle/vehiclePropertyDetail/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    //Add New Content
    vehiclePropertyDetail.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (vehiclePropertyDetail.DefaultValue && vehiclePropertyDetail.DefaultValue.multipleChoice && vehiclePropertyDetail.attachedFields < 2) {
            rashaErManage.showMessage("در صورت انتخاب چند گزینه ای باید حداقل دو گزینه اضافه کنید!");
            return;
        }
        vehiclePropertyDetail.addRequested = true;
        vehiclePropertyDetail.selectedItem.LinkPropertyTypeId = vehiclePropertyDetail.propertyTypeId;
        vehiclePropertyDetail.selectedItem.DefaultValue.nameValue = vehiclePropertyDetail.attachedFields;
        vehiclePropertyDetail.selectedItem.JsonDefaultValue = $.trim(angular.toJson(vehiclePropertyDetail.selectedItem.DefaultValue));
        vehiclePropertyDetail.selectedItem.IconFont = $("#iconFont").val(); //Save selected icon name in the model
        ajax.call(cmsServerConfig.configApiServerPath+'vehiclePropertyDetail/add', vehiclePropertyDetail.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                // filter text
                $.each(vehiclePropertyDetail.propertyTypeListItems, function (index, item) {
                    if (item.Id == response.Item.LinkPropertyTypeId) {
                        response.Item.virtual_PropertyType = {};
                        response.Item.virtual_PropertyType.Title = vehiclePropertyDetail.propertyTypeListItems[index].Title;
                        return;
                    }
                });
                response.Item.TypeDescription = null;
                $.each(vehiclePropertyDetail.inputTypeArray, function (index, item) {
                    if (item.Value == response.Item.InputDataType)
                        response.Item.TypeDescription = vehiclePropertyDetail.inputTypeArray[index].Description;
                });
                vehiclePropertyDetail.ListItems.unshift(response.Item);
                vehiclePropertyDetail.gridOptions.fillData(vehiclePropertyDetail.ListItems);
                vehiclePropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            vehiclePropertyDetail.addRequested = false;
        });
    }

    // Open Edit Content Model
    vehiclePropertyDetail.openEditContentModal = function () {
        vehiclePropertyDetail.addRequested = false;
        vehiclePropertyDetail.modalTitle = 'ویرایش';
        if (!vehiclePropertyDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاً یک ردیف جهت ویرایش انتخاب کنید");
            return;
        }
        vehiclePropertyDetail.FieldName = "";
        ajax.call(cmsServerConfig.configApiServerPath+'vehiclePropertyDetail/GetOne', vehiclePropertyDetail.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            vehiclePropertyDetail.selectedItem = response1.Item;

            vehiclePropertyDetail.attachedFields = [];
            vehiclePropertyDetail.attachedFields = response1.Item.DefaultValue.nameValue;
            vehiclePropertyDetail.onMultipleChoiceChange();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleVehicle/vehiclePropertyDetail/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Edit a Content
    vehiclePropertyDetail.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (vehiclePropertyDetail.DefaultValue) {
            if (vehiclePropertyDetail.DefaultValue.multipleChoice && vehiclePropertyDetail.attachedFields < 2) {
                rashaErManage.showMessage("در صورت انتخاب چند گزینه ای باید حداقل دو گزینه اضافه کنید!");
                return;
            }
        }
        vehiclePropertyDetail.selectedItem.DefaultValue.nameValue = vehiclePropertyDetail.attachedFields;
        vehiclePropertyDetail.selectedItem.JsonDefaultValue = $.trim(angular.toJson(vehiclePropertyDetail.selectedItem.DefaultValue));
        vehiclePropertyDetail.selectedItem.IconFont = $("#iconFont").val(); //Save selected icon name in the model
        vehiclePropertyDetail.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'vehiclePropertyDetail/edit', vehiclePropertyDetail.selectedItem, 'PUT').success(function (response) {
            // vehiclePropertyDetail.addRequested = false;
            vehiclePropertyDetail.treeConfig.showbusy = false;
            vehiclePropertyDetail.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                response.Item.TypeDescription = null;
                var n = vehiclePropertyDetail.inputTypeArray.length;
                for (var i = 0; i < n; i++) {
                    if (vehiclePropertyDetail.inputTypeArray[i].Value == response.Item.InputDataType) {
                        response.Item.TypeDescription = vehiclePropertyDetail.inputTypeArray[i].Description;
                    }
                }
                vehiclePropertyDetail.replaceItem(vehiclePropertyDetail.selectedItem.Id, response.Item);
                vehiclePropertyDetail.gridOptions.fillData(vehiclePropertyDetail.ListItems);
                vehiclePropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            vehiclePropertyDetail.addRequested = false;
        });
    }

    //Delete a Content 
    vehiclePropertyDetail.deleteContent = function () {
        if (!vehiclePropertyDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        vehiclePropertyDetail.treeConfig.showbusy = true;
        vehiclePropertyDetail.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                vehiclePropertyDetail.showbusy = true;
                vehiclePropertyDetail.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+"vehiclePropertyDetail/GetOne", vehiclePropertyDetail.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    vehiclePropertyDetail.showbusy = false;
                    vehiclePropertyDetail.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    vehiclePropertyDetail.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+"vehiclePropertyDetail/delete", vehiclePropertyDetail.selectedItemForDelete, 'POST').success(function (res) {
                        vehiclePropertyDetail.treeConfig.showbusy = false;
                        vehiclePropertyDetail.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            vehiclePropertyDetail.replaceItem(vehiclePropertyDetail.selectedItemForDelete.Id);
                            vehiclePropertyDetail.gridOptions.fillData(vehiclePropertyDetail.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        vehiclePropertyDetail.treeConfig.showbusy = false;
                        vehiclePropertyDetail.showIsBusy = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    vehiclePropertyDetail.treeConfig.showbusy = false;
                    vehiclePropertyDetail.showIsBusy = false;
                });
            }
        });
    }

    //Replace Item OnDelete/OnEdit Grid Options
    vehiclePropertyDetail.replaceItem = function (oldId, newItem) {
        angular.forEach(vehiclePropertyDetail.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = vehiclePropertyDetail.ListItems.indexOf(item);
                vehiclePropertyDetail.ListItems.splice(index, 1);
            }
        });
        if (newItem) {
            vehiclePropertyDetail.setPropertyTypeTitle(newItem);
            vehiclePropertyDetail.ListItems.unshift(newItem);
        }

    }

    vehiclePropertyDetail.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    vehiclePropertyDetail.setPropertyTypeTitle = function (newItem) {
        angular.forEach(vehiclePropertyDetail.propertyTypeListItems, function (item, key) {
            if (item.Id == newItem.LinkPropertyTypeId) {
                var index = vehiclePropertyDetail.propertyTypeListItems.indexOf(item);
                if (index > -1) {
                    newItem.virtual_PropertyType = {};
                    newItem.virtual_PropertyType.Title = vehiclePropertyDetail.propertyTypeListItems[index].Title;
                }
                return;
            }
        });
    }

    vehiclePropertyDetail.addRequested = false;

    vehiclePropertyDetail.closeModal = function () {
        $modalStack.dismissAll();
    };

    vehiclePropertyDetail.showIsBusy = false;

    //For reInit Categories
    vehiclePropertyDetail.gridOptions.reGetAll = function (regardFilters) {
        vehiclePropertyDetail.init();
    };

    vehiclePropertyDetail.isCurrentNodeEmpty = function () {
        return !angular.equals({}, vehiclePropertyDetail.treeConfig.currentNodede);
    }

    vehiclePropertyDetail.loadFileAndFolder = function (item) {
        vehiclePropertyDetail.treeConfig.currentNode = item;
        vehiclePropertyDetail.treeConfig.onNodeSelect(item);
    }

    vehiclePropertyDetail.addRequested = true;

    vehiclePropertyDetail.columnCheckbox = false;

    vehiclePropertyDetail.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = vehiclePropertyDetail.gridOptions.columns;
        if (vehiclePropertyDetail.gridOptions.columnCheckbox) {
            for (var i = 0; i < vehiclePropertyDetail.gridOptions.columns.length; i++) {
                var element = $("#" + vehiclePropertyDetail.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                vehiclePropertyDetail.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < vehiclePropertyDetail.gridOptions.columns.length; i++) {
                var element = $("#" + vehiclePropertyDetail.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + vehiclePropertyDetail.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < vehiclePropertyDetail.gridOptions.columns.length; i++) {
            console.log(vehiclePropertyDetail.gridOptions.columns[i].name.concat(".visible: "), vehiclePropertyDetail.gridOptions.columns[i].visible);
        }
        vehiclePropertyDetail.gridOptions.columnCheckbox = !vehiclePropertyDetail.gridOptions.columnCheckbox;
    }

    vehiclePropertyDetail.deleteAttachedFieldName = function (index) {
        vehiclePropertyDetail.attachedFields.splice(index, 1);
    }

    vehiclePropertyDetail.addAttachedFieldName = function (FieldName) {
        if (vehiclePropertyDetail.updateMode == "edit") {
            vehiclePropertyDetail.attachedFields[vehiclePropertyDetail.selectedIndex] = FieldName;
            vehiclePropertyDetail.selectedItem.DefaultValue.nameValue = vehiclePropertyDetail.attachedFields;
            vehiclePropertyDetail.selectedItem.JsonDefaultValue = $.trim(angular.toJson(vehiclePropertyDetail.selectedItem.DefaultValue));
            ajax.call(cmsServerConfig.configApiServerPath+'vehiclePropertyDetail/edit', vehiclePropertyDetail.selectedItem, 'PUT').success(function (response) {
                rashaErManage.checkAction(response);
                vehiclePropertyDetail.disableUpdate();
                $("#FieldName").val("");
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }
        else //vehiclePropertyDetail.updateMode = "add"
            if (FieldName != null && FieldName != undefined && FieldName != "" && !vehiclePropertyDetail.alreadyExist(FieldName, vehiclePropertyDetail.attachedFields)) {
                vehiclePropertyDetail.attachedFields.push(FieldName);
                $("#FieldName").val("");
            }
    }

    vehiclePropertyDetail.alreadyExist = function (FieldName, array) {
        for (var i = 0; i < array.length; i++) {
            if (FieldName == array[i]) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                return true;
            }
        }
        return false;
    }

    vehiclePropertyDetail.enableUpdate = function (index) {
        vehiclePropertyDetail.selectedIndex = index;
        vehiclePropertyDetail.FieldName = vehiclePropertyDetail.attachedFields[vehiclePropertyDetail.selectedIndex];
        vehiclePropertyDetail.updateMode = "edit";
        $("#addOrEditBtn").css("background-color", "#f3961c");
        $("#addOrEditIcon").removeClass("fa fa-plus").addClass("fa fa-check");
    }

    vehiclePropertyDetail.disableUpdate = function (index) {
        vehiclePropertyDetail.FieldName = vehiclePropertyDetail.attachedFields[index];
        vehiclePropertyDetail.updateMode = "add";
        $("#addOrEditBtn").css("background-color", "#1ab394");
        $("#addOrEditIcon").removeClass("fa fa-check").addClass("fa fa-plus");
    }

    vehiclePropertyDetail.filterEnum = function (myListItems, myEnums) {
        var n = myListItems.length;
        var m = myEnums.length;
        for (var i = 0; i < n; i++) {
            myListItems[i].TypeDescription = null;
            for (var j = 0; j < m; j++) {
                if (myListItems[i].InputDataType == myEnums[j].Value) {
                    myListItems[i].TypeDescription = myEnums[j].Description;
                }
            }
        }
    }

    // go down detail 
    vehiclePropertyDetail.editStepGoDown = function (item, index) {
        if (index == vehiclePropertyDetail.ListItems.length - 1) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Bottom_Of_The_List'));
            return;
        }
        vehiclePropertyDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'VehiclePropertyDetail/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            vehiclePropertyDetail.selectedItem = response1.Item;
            var temp = response1.Item.ShowInFormOrder;
            vehiclePropertyDetail.selectedItem.ShowInFormOrder = vehiclePropertyDetail.ListItems[index + 1].ShowInFormOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'VehiclePropertyDetail/edit', vehiclePropertyDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'VehiclePropertyDetail/GetOne', vehiclePropertyDetail.ListItems[index + 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        vehiclePropertyDetail.selectedItem = response3.Item;
                        vehiclePropertyDetail.selectedItem.ShowInFormOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'VehiclePropertyDetail/edit', vehiclePropertyDetail.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                // Swap two item in the grid list without requesting a GetAll
                                vehiclePropertyDetail.ListItems[index] = vehiclePropertyDetail.ListItems.splice(index + 1, 1, vehiclePropertyDetail.ListItems[index])[0];
                                vehiclePropertyDetail.gridOptions.fillData(vehiclePropertyDetail.ListItems);
                            }
                        }).error(function (data, errCode, c, d) {
                            rashaErManage.checkAction(data, errCode);
                        });
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
        vehiclePropertyDetail.busyIndicator.isActive = false;
    }

    // go up detail
    vehiclePropertyDetail.editStepGoUp = function (item, index) {
        if (index === 0) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Top_Of_The_List'));
            return;
        }
        vehiclePropertyDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'VehiclePropertyDetail/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            vehiclePropertyDetail.selectedItem = response1.Item;
            var temp = response1.Item.ShowInFormOrder;
            vehiclePropertyDetail.selectedItem.ShowInFormOrder = vehiclePropertyDetail.ListItems[index - 1].ShowInFormOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'VehiclePropertyDetail/edit', vehiclePropertyDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'VehiclePropertyDetail/GetOne', vehiclePropertyDetail.ListItems[index - 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        vehiclePropertyDetail.selectedItem = response3.Item;
                        vehiclePropertyDetail.selectedItem.ShowInFormOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'VehiclePropertyDetail/edit', vehiclePropertyDetail.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                // جابجا کردن مکان دو آیتم در آرایه
                                vehiclePropertyDetail.ListItems[index] = vehiclePropertyDetail.ListItems.splice(index - 1, 1, vehiclePropertyDetail.ListItems[index])[0];
                                vehiclePropertyDetail.gridOptions.fillData(vehiclePropertyDetail.ListItems);
                            }
                        }).error(function (data, errCode, c, d) {
                            rashaErManage.checkAction(data, errCode);
                        });
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
        vehiclePropertyDetail.busyIndicator.isActive = false;
    }

    // Move a group one step down
    vehiclePropertyDetail.editStepGoDownGroup = function (item) {
        if (item.Id === undefined || item.Id === null) {
            rashaErManage.showMessage("برای جابجایی لطفاً یک مورد را انتخاب کنید!");
            return;
        }
        var index = null;
        for (var i = 0; i < vehiclePropertyDetail.treeConfig.Items.length; i++) {
            if (item.Id === vehiclePropertyDetail.treeConfig.Items[i].Id)
                index = i;
        }

        if (index === vehiclePropertyDetail.treeConfig.Items.length - 1) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Bottom_Of_The_List'));
            return;
        }
        vehiclePropertyDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'vehiclePropertyDetailGroup/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            vehiclePropertyDetail.selectedItem = response1.Item;
            var temp = response1.Item.ShowInFormOrder;
            vehiclePropertyDetail.selectedItem.ShowInFormOrder = vehiclePropertyDetail.treeConfig.Items[index + 1].ShowInFormOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'vehiclePropertyDetailGroup/edit', vehiclePropertyDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'vehiclePropertyDetailGroup/GetOne', vehiclePropertyDetail.treeConfig.Items[index + 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        vehiclePropertyDetail.selectedItem = response3.Item;
                        vehiclePropertyDetail.selectedItem.ShowInFormOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'vehiclePropertyDetailGroup/edit', vehiclePropertyDetail.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                vehiclePropertyDetail.treeConfig.Items[index + 1] = response4.Item;
                                vehiclePropertyDetail.treeConfig.Items[index] = vehiclePropertyDetail.treeConfig.Items.splice(index + 1, 1, vehiclePropertyDetail.treeConfig.Items[index])[0];
                            }
                        }).error(function (data, errCode, c, d) {
                            rashaErManage.checkAction(data, errCode);
                        });
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
        vehiclePropertyDetail.busyIndicator.isActive = false;
    }

    // Move a group one step up
    vehiclePropertyDetail.editStepGoUpGroup = function (item) {
        if (item.Id === undefined || item.Id === null) {
            rashaErManage.showMessage("برای جابجایی لطفاً یک مورد را انتخاب کنید!");
            return;
        }
        var index = null;
        for (var i = 0; i < vehiclePropertyDetail.treeConfig.Items.length; i++) {
            if (item.Id === vehiclePropertyDetail.treeConfig.Items[i].Id)
                index = i;
        }
        if (index === 0) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Top_Of_The_List'));
            return;
        }
        vehiclePropertyDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'vehiclePropertyDetailGroup/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            vehiclePropertyDetail.selectedItem = response1.Item;
            var temp = response1.Item.ShowInFormOrder;
            vehiclePropertyDetail.selectedItem.ShowInFormOrder = vehiclePropertyDetail.treeConfig.Items[index - 1].ShowInFormOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'vehiclePropertyDetailGroup/edit', vehiclePropertyDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'vehiclePropertyDetailGroup/GetOne', vehiclePropertyDetail.treeConfig.Items[index - 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        vehiclePropertyDetail.selectedItem = response3.Item;
                        vehiclePropertyDetail.selectedItem.ShowInFormOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'vehiclePropertyDetailGroup/edit', vehiclePropertyDetail.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                vehiclePropertyDetail.treeConfig.Items[index - 1] = response4.Item;
                                // جابجا کردن دو آیتم در آرایه
                                vehiclePropertyDetail.treeConfig.Items[index] = vehiclePropertyDetail.treeConfig.Items.splice(index - 1, 1, vehiclePropertyDetail.treeConfig.Items[index])[0];
                            }
                        }).error(function (data, errCode, c, d) {
                            rashaErManage.checkAction(data, errCode);
                        });
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
        vehiclePropertyDetail.busyIndicator.isActive = false;
    }

    function compare(a, b) {
        if (a.ShowInFormOrder < b.ShowInFormOrder)
            return -1;
        if (a.ShowInFormOrder > b.ShowInFormOrder)
            return 1;
        return 0;
    }

    vehiclePropertyDetail.onMultipleChoiceChange = function () {
        if (vehiclePropertyDetail.selectedItem.DefaultValue.multipleChoice) {
            $("#forceUseCheckbox").fadeOut(300);
            vehiclePropertyDetail.selectedItem.DefaultValue.forceUse = false;
            return;
        }
        $("#forceUseCheckbox").fadeIn(300);
    }

    vehiclePropertyDetail.onforceUserChange = function () {
        if (vehiclePropertyDetail.selectedItem.DefaultValue.forceUse) {
            vehiclePropertyDetail.selectedItem.DefaultValue.multipleChoice = false;
        }
    }

    vehiclePropertyDetail.backToState = function (state) {
        $state.go(state);
    }

    vehiclePropertyDetail.onPropertyTypeChange = function (propertyTypeId) {
        vehiclePropertyDetail.propertyTypeId = parseInt(propertyTypeId);
        $stateParams.propertyParam = parseInt(propertyTypeId);

        var filterValue = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(vehiclePropertyDetail.propertyTypeId),
            SearchType: 0
        }
        var engine = {};
        engine.Filters = [];
        engine.Filters.push(filterValue);

        ajax.call(cmsServerConfig.configApiServerPath+"VehiclePropertyDetailGroup/getall", engine, 'POST').success(function (response) {
            vehiclePropertyDetail.vehiclePropertyDetailGroupListItems = response.ListItems;
            vehiclePropertyDetail.treeConfig.Items = response.ListItems;
            vehiclePropertyDetail.categorybusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }

    vehiclePropertyDetail.gridOptions.myfilterText = function (gridListItems, foreignKeyName, childListItems, childItemColumnsName) {
        var ilength = gridListItems.length;
        var jlength = childListItems.length;
        for (var i = 0; i < ilength; i++) {
            gridListItems[i][childItemColumnsName] = "";  // Make a new field for title of the foreighn key
            for (var j = 0; j < jlength; j++) {
                if (gridListItems[i][foreignKeyName] == childListItems[j].Id) {
                    gridListItems[i][childItemColumnsName] = childListItems[j].Title;
                }
            }
        }
    }
    //Export Report 
    vehiclePropertyDetail.exportFile = function () {
        vehiclePropertyDetail.addRequested = true;
        vehiclePropertyDetail.gridOptions.advancedSearchData.engine.ExportFile = vehiclePropertyDetail.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'vehiclePropertyDetail/exportfile', vehiclePropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            vehiclePropertyDetail.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                vehiclePropertyDetail.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //vehiclePropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    vehiclePropertyDetail.toggleExportForm = function () {
        vehiclePropertyDetail.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        vehiclePropertyDetail.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        vehiclePropertyDetail.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        vehiclePropertyDetail.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        vehiclePropertyDetail.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleVehicle/vehiclePropertyDetail/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    vehiclePropertyDetail.rowCountChanged = function () {
        if (!angular.isDefined(vehiclePropertyDetail.ExportFileClass.RowCount) || vehiclePropertyDetail.ExportFileClass.RowCount > 5000)
            vehiclePropertyDetail.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    vehiclePropertyDetail.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"vehiclePropertyDetail/count", vehiclePropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            vehiclePropertyDetail.addRequested = false;
            rashaErManage.checkAction(response);
            vehiclePropertyDetail.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            vehiclePropertyDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Input DataType set to Boolean
    vehiclePropertyDetail.onInputDataTypeChange = function (inputType) {
        if (inputType == 0 || inputType == 1) {
            if (inputType == 1)
                vehiclePropertyDetail.selectedItem.InputDataType = 4;
            $("#addOptinosPanel").fadeOut();
            $("#setRangePanel").fadeOut();
        }
        else if (inputType == 2 || inputType == 3 || inputType == 4) {
            $("#setRangePanel").fadeOut(100);
            $("#addOptinosPanel").fadeIn(300);
        }
        else if (inputType == 5) {
            $("#addOptinosPanel").fadeOut(100);
            $("#setRangePanel").fadeIn(300);
        }
    }

    vehiclePropertyDetail.toggleIcons = function (fadeIn) {
        if (fadeIn)
            $('#icons').fadeIn();
        else
            $('#icons').fadeOut();
    }

}]);