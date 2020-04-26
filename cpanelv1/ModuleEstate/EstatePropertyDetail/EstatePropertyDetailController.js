app.controller("estatePropertyDetailController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$location', '$state', '$stateParams', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $location, $state, $stateParams, $window, $filter) {
    var estatePropertyDetail = this;
    //For Grid Options
    if (itemRecordStatus != undefined) estatePropertyDetail.itemRecordStatus = itemRecordStatus;
    estatePropertyDetail.inputTypeArray = [];
    estatePropertyDetail.gridOptions = {};
    estatePropertyDetail.selectedItem = {};
    estatePropertyDetail.attachedFiles = [];
    estatePropertyDetail.ListItems = [];
    estatePropertyDetail.propertyTypeListItems = [];
    estatePropertyDetail.attachedFile = "";

    estatePropertyDetail.count = 0;
//#help/ سلکتور دسته بندی در ویرایش محتوا
estatePropertyDetail.LinkCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryId',
        url: 'EstatePropertyDetailGroup',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: estatePropertyDetail,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    //EstatePropertyDetail Grid Options
    estatePropertyDetail.gridOptions = {
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
            { name: 'ActionButton', displayName: 'ترتیب نمایش', sortable: true, type: 'string', displayForce: true, template: "<button class=\"btn btn-primary btn-circle\" type=\"button\" title=\"انتقال به بالا\" ng-click=\"estatePropertyDetail.editStepGoUp(x, $index)\" ng-show=\"x.LinkPropertyDetailGroupId != null\"><i class=\"glyphicon glyphicon-arrow-up\"  aria-hidden=\"true\" style=\"font-weight: bold;\" ></i></button>&nbsp<button class=\"btn btn-danger btn-circle\" title=\"انتقال به پایین\" ng-show=\"x.LinkPropertyDetailGroupId != null\" ng-click=\"estatePropertyDetail.editStepGoDown(x, $index)\"><i class=\"glyphicon glyphicon-arrow-down\"  aria-hidden=\"true\" ></i></button>" }
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
    estatePropertyDetail.categorybusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show EstatePropertyDetail Loading Indicator
    estatePropertyDetail.busyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    estatePropertyDetail.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children',
        Items: null
    };


    estatePropertyDetail.treeConfig.currentNode = {};
    estatePropertyDetail.treebusyIndicator = false;

    estatePropertyDetail.addRequested = false;

    estatePropertyDetail.estatePropertyDetailGroupListItems = [];

    //init Function
    estatePropertyDetail.init = function () {
        estatePropertyDetail.categorybusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"EstatePropertyDetail/getAllUiDesignType", {}, 'POST').success(function (response) {
            estatePropertyDetail.UiDesignType = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"EstatePropertyDetail/GetInputDataTypeEnum", {}, 'POST').success(function (response) {
            estatePropertyDetail.inputDataTypeArray = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"EstatePropertyDetail/GetInputDataTypeEnum", {}, 'POST').success(function (response) {
            estatePropertyDetail.inputTypeArray = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });

        if ($stateParams.propertyParam != undefined && $stateParams.propertyParam != null)
            estatePropertyDetail.propertyTypeId = $stateParams.propertyParam;
        else
            estatePropertyDetail.propertyTypeId = 1;

        var filterValue = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(estatePropertyDetail.propertyTypeId),
            SearchType: 0
        }
        estatePropertyDetail.gridOptions.advancedSearchData.engine.Filters = [];
        estatePropertyDetail.gridOptions.advancedSearchData.engine.Filters.push(filterValue);

        estatePropertyDetail.groupResultAccess = null;
        ajax.call(cmsServerConfig.configApiServerPath+"EstatePropertyDetailGroup/getall", estatePropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            estatePropertyDetail.estatePropertyDetailGroupListItems = response.ListItems;
            estatePropertyDetail.treeConfig.Items = response.ListItems;
            estatePropertyDetail.groupResultAccess = response.resultAccess;
            estatePropertyDetail.categorybusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"EstatePropertyType/getall", estatePropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            estatePropertyDetail.propertyTypeListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    };

    // Open Add Category Modal 
    estatePropertyDetail.openAddCategoryModal = function () {
        estatePropertyDetail.addRequested = false;
        estatePropertyDetail.modalTitle = "ایجاد گروه جدید";
        ajax.call(cmsServerConfig.configApiServerPath+'EstatePropertyDetailGroup/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            estatePropertyDetail.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleEstate/EstatePropertyDetailGroup/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Add New Category
    estatePropertyDetail.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        estatePropertyDetail.addRequested = true;
        estatePropertyDetail.selectedItem.LinkPropertyTypeId = estatePropertyDetail.propertyTypeId;
        estatePropertyDetail.selectedItem.IconFont = $("#iconFont").val(); //Save selected icon name in the model
        ajax.call(cmsServerConfig.configApiServerPath+'EstatePropertyDetailGroup/add', estatePropertyDetail.selectedItem, 'POST').success(function (response) {
            estatePropertyDetail.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                estatePropertyDetail.treeConfig.Items.push(response.Item);
                estatePropertyDetail.categorybusyIndicator.isActive = false;
                estatePropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            estatePropertyDetail.addRequested = false;
            estatePropertyDetail.categorybusyIndicator.isActive = false;
        });
    };

    // Open Edit Category Modal
    estatePropertyDetail.openEditCategoryModal = function () {
        estatePropertyDetail.addRequested = false;
        estatePropertyDetail.modalTitle = 'ویرایش';
        if (estatePropertyDetail.treeConfig.currentNode.Id == 0 || !estatePropertyDetail.treeConfig.currentNode.Id) {
            rashaErManage.showMessage("لطفاَ یک دسته جهت ویرایش انتخاب کنید");
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'EstatePropertyDetailGroup/GetOne', estatePropertyDetail.treeConfig.currentNode.Id, 'GET').success(function (response1) {
            estatePropertyDetail.showbusy = false;
            rashaErManage.checkAction(response1);
            estatePropertyDetail.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleEstate/EstatePropertyDetailGroup/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            estatePropertyDetail.categorybusyIndicator.isActive = false;
        });
    }
    // Edit a Category
    estatePropertyDetail.editCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        estatePropertyDetail.categorybusyIndicator.isActive = true;
        estatePropertyDetail.selectedItem.IconFont = $("#iconFont").val(); //Save selected icon name in the model
        ajax.call(cmsServerConfig.configApiServerPath+'EstatePropertyDetailGroup/edit', estatePropertyDetail.selectedItem, 'PUT').success(function (response) {
            estatePropertyDetail.addRequested = true;
            estatePropertyDetail.treeConfig.showbusy = false;
            estatePropertyDetail.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                estatePropertyDetail.addRequested = false;
                estatePropertyDetail.treeConfig.currentNode.Title = response.Item.Title;
                estatePropertyDetail.categorybusyIndicator.isActive = false;
                estatePropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            estatePropertyDetail.addRequested = false;
            estatePropertyDetail.categorybusyIndicator.isActive = false;
        });
    }
    //Delete a Category
    estatePropertyDetail.deleteCategory = function () {
        var node = estatePropertyDetail.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        if (estatePropertyDetail.ListItems.length == 0) {
            rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
                if (isConfirmed) {
                    estatePropertyDetail.categorybusyIndicator.isActive = true;
                    ajax.call(cmsServerConfig.configApiServerPath+'EstatePropertyDetailGroup/GetOne', node.Id, 'GET').success(function (response) {
                        rashaErManage.checkAction(response);
                        estatePropertyDetail.selectedItemForDelete = response.Item;
                        ajax.call(cmsServerConfig.configApiServerPath+'EstatePropertyDetailGroup/delete', estatePropertyDetail.selectedItemForDelete, 'POST').success(function (res) {

                            if (res.IsSuccess) {
                                estatePropertyDetail.gridOptions.advancedSearchData.engine.Filters = null;
                                estatePropertyDetail.gridOptions.advancedSearchData.engine.Filters = [];
                                estatePropertyDetail.gridOptions.fillData();
                                estatePropertyDetail.categorybusyIndicator.isActive = false;
                                estatePropertyDetail.gridOptions.reGetAll();
                                estatePropertyDetail.treeConfig.currentNode = null;
                            }

                        }).error(function (data2, errCode2, c2, d2) {
                            rashaErManage.checkAction(data2);
                            estatePropertyDetail.categorybusyIndicator.isActive = false;

                        });
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                        estatePropertyDetail.categorybusyIndicator.isActive = false;

                    });

                }
            });
        } else
            rashaErManage.showMessage("این دسته دارای محتوا است برای حذف دسته ابتدا محتوای آن را حذف نمایید!");
    }

    //Tree On Node Select Options
    estatePropertyDetail.treeConfig.onNodeSelect = function () {
        var node = estatePropertyDetail.treeConfig.currentNode;
        if (node != undefined && node != null)
            estatePropertyDetail.selectedItem.LinkCategoryId = node.Id;
        estatePropertyDetail.selectContent(node);

    };

    //Show Content with Category Id
    estatePropertyDetail.selectContent = function (node) {
        estatePropertyDetail.gridOptions.selectedRow.item = null;
        if (node == null || node.Id == undefined)
            estatePropertyDetail.busyIndicator.message = "در حال بارگذاری...";
        else
            estatePropertyDetail.busyIndicator.message = "در حال بارگذاری..." + node.Title;
        estatePropertyDetail.busyIndicator.isActive = true;
        //estatePropertyDetail.gridOptions.advancedSearchData = {};

        estatePropertyDetail.gridOptions.advancedSearchData.engine.Filters = null;
        estatePropertyDetail.gridOptions.advancedSearchData.engine.Filters = [];
        if (node != undefined && node.Id != undefined) {
            var filterValue1 = {
                PropertyName: "LinkPropertyDetailGroupId",
                IntValue1: node.Id,
                SearchType: 0
            }
            estatePropertyDetail.gridOptions.advancedSearchData.engine.Filters.push(filterValue1);
        }
        var filterValue2 = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: estatePropertyDetail.propertyTypeId,
            SearchType: 0
        }
        estatePropertyDetail.gridOptions.advancedSearchData.engine.Filters.push(filterValue2);

        ajax.call(cmsServerConfig.configApiServerPath+"estatePropertyDetail/getall", estatePropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            estatePropertyDetail.busyIndicator.isActive = false;
            estatePropertyDetail.ListItems = response.ListItems;
            estatePropertyDetail.filterEnum(estatePropertyDetail.ListItems, estatePropertyDetail.inputTypeArray);
            estatePropertyDetail.gridOptions.fillData(estatePropertyDetail.ListItems, response.resultAccess);
            estatePropertyDetail.gridOptions.currentPageNumber = response.CurrentPageNumber;
            estatePropertyDetail.gridOptions.totalRowCount = response.TotalRowCount;
            estatePropertyDetail.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            estatePropertyDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            estatePropertyDetail.busyIndicator.isActive = false;
        });
    };

    // Open add Content Model
    estatePropertyDetail.openAddContentModal = function () {
        var node = estatePropertyDetail.treeConfig.currentNode;
        if (node == undefined || node.Id === 0 || node.Id == undefined || node.Id == null) {
            rashaErManage.showMessage("برای اضافه کردن لطفاً دسته مربوطه را انتخاب کنید.");
            return;
        }
        estatePropertyDetail.attachedFields = [];
        estatePropertyDetail.FieldName = "";
        estatePropertyDetail.addRequested = false;
        estatePropertyDetail.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'estatePropertyDetail/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            estatePropertyDetail.selectedItem = response.Item;
            estatePropertyDetail.selectedItem.LinkPropertyDetailGroupId = node.Id;
            estatePropertyDetail.onMultipleChoiceChange();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleEstate/estatePropertyDetail/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    //Add New Content
    estatePropertyDetail.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (estatePropertyDetail.DefaultValue && estatePropertyDetail.DefaultValue.multipleChoice && estatePropertyDetail.attachedFields < 2) {
            rashaErManage.showMessage("در صورت انتخاب چند گزینه ای باید حداقل دو گزینه اضافه کنید!");
            return;
        }
        estatePropertyDetail.addRequested = true;
        estatePropertyDetail.selectedItem.LinkPropertyTypeId = estatePropertyDetail.propertyTypeId;
        estatePropertyDetail.selectedItem.DefaultValue.nameValue = estatePropertyDetail.attachedFields;
        estatePropertyDetail.selectedItem.JsonDefaultValue = $.trim(angular.toJson(estatePropertyDetail.selectedItem.DefaultValue));
        estatePropertyDetail.selectedItem.IconFont = $("#iconFont").val(); //Save selected icon name in the model
        ajax.call(cmsServerConfig.configApiServerPath+'estatePropertyDetail/add', estatePropertyDetail.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                // filter text
                $.each(estatePropertyDetail.propertyTypeListItems, function (index, item) {
                    if (item.Id == response.Item.LinkPropertyTypeId) {
                        response.Item.virtual_PropertyType = {};
                        response.Item.virtual_PropertyType.Title = estatePropertyDetail.propertyTypeListItems[index].Title;
                        return;
                    }
                });
                response.Item.TypeDescription = null;
                $.each(estatePropertyDetail.inputTypeArray, function (index, item) {
                    if (item.Value == response.Item.InputDataType)
                        response.Item.TypeDescription = estatePropertyDetail.inputTypeArray[index].Description;
                });
                estatePropertyDetail.ListItems.unshift(response.Item);
                estatePropertyDetail.gridOptions.fillData(estatePropertyDetail.ListItems);
                estatePropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            estatePropertyDetail.addRequested = false;
        });
    }

    // Open Edit Content Model
    estatePropertyDetail.openEditContentModal = function () {
        estatePropertyDetail.addRequested = false;
        estatePropertyDetail.modalTitle = 'ویرایش';
        if (!estatePropertyDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاً یک ردیف جهت ویرایش انتخاب کنید");
            return;
        }
        estatePropertyDetail.FieldName = "";
        ajax.call(cmsServerConfig.configApiServerPath+'estatePropertyDetail/GetOne', estatePropertyDetail.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            estatePropertyDetail.selectedItem = response1.Item;

            estatePropertyDetail.attachedFields = [];
            estatePropertyDetail.attachedFields = response1.Item.DefaultValue.nameValue;
            estatePropertyDetail.onMultipleChoiceChange();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleEstate/estatePropertyDetail/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Edit a Content
    estatePropertyDetail.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (estatePropertyDetail.DefaultValue) {
            if (estatePropertyDetail.DefaultValue.multipleChoice && estatePropertyDetail.attachedFields < 2) {
                rashaErManage.showMessage("در صورت انتخاب چند گزینه ای باید حداقل دو گزینه اضافه کنید!");
                return;
            }
        }
        estatePropertyDetail.selectedItem.DefaultValue.nameValue = estatePropertyDetail.attachedFields;
        estatePropertyDetail.selectedItem.JsonDefaultValue = $.trim(angular.toJson(estatePropertyDetail.selectedItem.DefaultValue));
        estatePropertyDetail.selectedItem.IconFont = $("#iconFont").val(); //Save selected icon name in the model
        estatePropertyDetail.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'estatePropertyDetail/edit', estatePropertyDetail.selectedItem, 'PUT').success(function (response) {
            // estatePropertyDetail.addRequested = false;
            estatePropertyDetail.treeConfig.showbusy = false;
            estatePropertyDetail.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                response.Item.TypeDescription = null;
                var n = estatePropertyDetail.inputTypeArray.length;
                for (var i = 0; i < n; i++) {
                    if (estatePropertyDetail.inputTypeArray[i].Value == response.Item.InputDataType) {
                        response.Item.TypeDescription = estatePropertyDetail.inputTypeArray[i].Description;
                    }
                }
                estatePropertyDetail.replaceItem(estatePropertyDetail.selectedItem.Id, response.Item);
                estatePropertyDetail.gridOptions.fillData(estatePropertyDetail.ListItems);
                estatePropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            estatePropertyDetail.addRequested = false;
        });
    }

    //Delete a Content 
    estatePropertyDetail.deleteContent = function () {
        if (!estatePropertyDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        estatePropertyDetail.treeConfig.showbusy = true;
        estatePropertyDetail.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                estatePropertyDetail.showbusy = true;
                estatePropertyDetail.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+"estatePropertyDetail/GetOne", estatePropertyDetail.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    estatePropertyDetail.showbusy = false;
                    estatePropertyDetail.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    estatePropertyDetail.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+"estatePropertyDetail/delete", estatePropertyDetail.selectedItemForDelete, 'POST').success(function (res) {
                        estatePropertyDetail.treeConfig.showbusy = false;
                        estatePropertyDetail.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            estatePropertyDetail.replaceItem(estatePropertyDetail.selectedItemForDelete.Id);
                            estatePropertyDetail.gridOptions.fillData(estatePropertyDetail.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        estatePropertyDetail.treeConfig.showbusy = false;
                        estatePropertyDetail.showIsBusy = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    estatePropertyDetail.treeConfig.showbusy = false;
                    estatePropertyDetail.showIsBusy = false;
                });
            }
        });
    }

    //Replace Item OnDelete/OnEdit Grid Options
    estatePropertyDetail.replaceItem = function (oldId, newItem) {
        angular.forEach(estatePropertyDetail.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = estatePropertyDetail.ListItems.indexOf(item);
                estatePropertyDetail.ListItems.splice(index, 1);
            }
        });
        if (newItem) {
            estatePropertyDetail.setPropertyTypeTitle(newItem);
            estatePropertyDetail.ListItems.unshift(newItem);
        }

    }

    estatePropertyDetail.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    estatePropertyDetail.setPropertyTypeTitle = function (newItem) {
        angular.forEach(estatePropertyDetail.propertyTypeListItems, function (item, key) {
            if (item.Id == newItem.LinkPropertyTypeId) {
                var index = estatePropertyDetail.propertyTypeListItems.indexOf(item);
                if (index > -1) {
                    newItem.virtual_PropertyType = {};
                    newItem.virtual_PropertyType.Title = estatePropertyDetail.propertyTypeListItems[index].Title;
                }
                return;
            }
        });
    }

    estatePropertyDetail.addRequested = false;

    estatePropertyDetail.closeModal = function () {
        $modalStack.dismissAll();
    };

    estatePropertyDetail.showIsBusy = false;

    //For reInit Categories
    estatePropertyDetail.gridOptions.reGetAll = function (regardFilters) {
        estatePropertyDetail.init();
    };

    estatePropertyDetail.isCurrentNodeEmpty = function () {
        return !angular.equals({}, estatePropertyDetail.treeConfig.currentNodede);
    }

    estatePropertyDetail.loadFileAndFolder = function (item) {
        estatePropertyDetail.treeConfig.currentNode = item;
        estatePropertyDetail.treeConfig.onNodeSelect(item);
    }

    estatePropertyDetail.addRequested = true;

    estatePropertyDetail.columnCheckbox = false;

    estatePropertyDetail.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = estatePropertyDetail.gridOptions.columns;
        if (estatePropertyDetail.gridOptions.columnCheckbox) {
            for (var i = 0; i < estatePropertyDetail.gridOptions.columns.length; i++) {
                var element = $("#" + estatePropertyDetail.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                estatePropertyDetail.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < estatePropertyDetail.gridOptions.columns.length; i++) {
                var element = $("#" + estatePropertyDetail.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + estatePropertyDetail.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < estatePropertyDetail.gridOptions.columns.length; i++) {
            console.log(estatePropertyDetail.gridOptions.columns[i].name.concat(".visible: "), estatePropertyDetail.gridOptions.columns[i].visible);
        }
        estatePropertyDetail.gridOptions.columnCheckbox = !estatePropertyDetail.gridOptions.columnCheckbox;
    }

    estatePropertyDetail.deleteAttachedFieldName = function (index) {
        estatePropertyDetail.attachedFields.splice(index, 1);
    }

    estatePropertyDetail.addAttachedFieldName = function (FieldName) {
        if (estatePropertyDetail.updateMode == "edit") {
            estatePropertyDetail.attachedFields[estatePropertyDetail.selectedIndex] = FieldName;
            estatePropertyDetail.selectedItem.DefaultValue.nameValue = estatePropertyDetail.attachedFields;
            estatePropertyDetail.selectedItem.JsonDefaultValue = $.trim(angular.toJson(estatePropertyDetail.selectedItem.DefaultValue));
            ajax.call(cmsServerConfig.configApiServerPath+'estatePropertyDetail/edit', estatePropertyDetail.selectedItem, 'PUT').success(function (response) {
                rashaErManage.checkAction(response);
                estatePropertyDetail.disableUpdate();
                $("#FieldName").val("");
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }
        else //estatePropertyDetail.updateMode = "add"
            if (FieldName != null && FieldName != undefined && FieldName != "" && !estatePropertyDetail.alreadyExist(FieldName, estatePropertyDetail.attachedFields)) {
                estatePropertyDetail.attachedFields.push(FieldName);
                $("#FieldName").val("");
            }
    }

    estatePropertyDetail.alreadyExist = function (FieldName, array) {
        for (var i = 0; i < array.length; i++) {
            if (FieldName == array[i]) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                return true;
            }
        }
        return false;
    }

    estatePropertyDetail.enableUpdate = function (index) {
        estatePropertyDetail.selectedIndex = index;
        estatePropertyDetail.FieldName = estatePropertyDetail.attachedFields[estatePropertyDetail.selectedIndex];
        estatePropertyDetail.updateMode = "edit";
        $("#addOrEditBtn").css("background-color", "#f3961c");
        $("#addOrEditIcon").removeClass("fa fa-plus").addClass("fa fa-check");
    }

    estatePropertyDetail.disableUpdate = function (index) {
        estatePropertyDetail.FieldName = estatePropertyDetail.attachedFields[index];
        estatePropertyDetail.updateMode = "add";
        $("#addOrEditBtn").css("background-color", "#1ab394");
        $("#addOrEditIcon").removeClass("fa fa-check").addClass("fa fa-plus");
    }

    estatePropertyDetail.filterEnum = function (myListItems, myEnums) {
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
    estatePropertyDetail.editStepGoDown = function (item, index) {
        if (index == estatePropertyDetail.ListItems.length - 1) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Bottom_Of_The_List'));
            return;
        }
        estatePropertyDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'EstatePropertyDetail/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            estatePropertyDetail.selectedItem = response1.Item;
            var temp = response1.Item.ShowInFormOrder;
            estatePropertyDetail.selectedItem.ShowInFormOrder = estatePropertyDetail.ListItems[index + 1].ShowInFormOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'EstatePropertyDetail/edit', estatePropertyDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'EstatePropertyDetail/GetOne', estatePropertyDetail.ListItems[index + 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        estatePropertyDetail.selectedItem = response3.Item;
                        estatePropertyDetail.selectedItem.ShowInFormOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'EstatePropertyDetail/edit', estatePropertyDetail.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                // Swap two item in the grid list without requesting a GetAll
                                estatePropertyDetail.ListItems[index] = estatePropertyDetail.ListItems.splice(index + 1, 1, estatePropertyDetail.ListItems[index])[0];
                                estatePropertyDetail.gridOptions.fillData(estatePropertyDetail.ListItems);
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
        estatePropertyDetail.busyIndicator.isActive = false;
    }

    // go up detail
    estatePropertyDetail.editStepGoUp = function (item, index) {
        if (index === 0) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Top_Of_The_List'));
            return;
        }
        estatePropertyDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'EstatePropertyDetail/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            estatePropertyDetail.selectedItem = response1.Item;
            var temp = response1.Item.ShowInFormOrder;
            estatePropertyDetail.selectedItem.ShowInFormOrder = estatePropertyDetail.ListItems[index - 1].ShowInFormOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'EstatePropertyDetail/edit', estatePropertyDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'EstatePropertyDetail/GetOne', estatePropertyDetail.ListItems[index - 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        estatePropertyDetail.selectedItem = response3.Item;
                        estatePropertyDetail.selectedItem.ShowInFormOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'EstatePropertyDetail/edit', estatePropertyDetail.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                // جابجا کردن مکان دو آیتم در آرایه
                                estatePropertyDetail.ListItems[index] = estatePropertyDetail.ListItems.splice(index - 1, 1, estatePropertyDetail.ListItems[index])[0];
                                estatePropertyDetail.gridOptions.fillData(estatePropertyDetail.ListItems);
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
        estatePropertyDetail.busyIndicator.isActive = false;
    }

    // Move a group one step down
    estatePropertyDetail.editStepGoDownGroup = function (item) {
        if (item.Id === undefined || item.Id === null) {
            rashaErManage.showMessage("برای جابجایی لطفاً یک مورد را انتخاب کنید!");
            return;
        }
        var index = null;
        for (var i = 0; i < estatePropertyDetail.treeConfig.Items.length; i++) {
            if (item.Id === estatePropertyDetail.treeConfig.Items[i].Id)
                index = i;
        }

        if (index === estatePropertyDetail.treeConfig.Items.length - 1) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Bottom_Of_The_List'));
            return;
        }
        estatePropertyDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'estatePropertyDetailGroup/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            estatePropertyDetail.selectedItem = response1.Item;
            var temp = response1.Item.ShowInFormOrder;
            estatePropertyDetail.selectedItem.ShowInFormOrder = estatePropertyDetail.treeConfig.Items[index + 1].ShowInFormOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'estatePropertyDetailGroup/edit', estatePropertyDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'estatePropertyDetailGroup/GetOne', estatePropertyDetail.treeConfig.Items[index + 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        estatePropertyDetail.selectedItem = response3.Item;
                        estatePropertyDetail.selectedItem.ShowInFormOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'estatePropertyDetailGroup/edit', estatePropertyDetail.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                estatePropertyDetail.treeConfig.Items[index + 1] = response4.Item;
                                estatePropertyDetail.treeConfig.Items[index] = estatePropertyDetail.treeConfig.Items.splice(index + 1, 1, estatePropertyDetail.treeConfig.Items[index])[0];
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
        estatePropertyDetail.busyIndicator.isActive = false;
    }

    // Move a group one step up
    estatePropertyDetail.editStepGoUpGroup = function (item) {
        if (item.Id === undefined || item.Id === null) {
            rashaErManage.showMessage("برای جابجایی لطفاً یک مورد را انتخاب کنید!");
            return;
        }
        var index = null;
        for (var i = 0; i < estatePropertyDetail.treeConfig.Items.length; i++) {
            if (item.Id === estatePropertyDetail.treeConfig.Items[i].Id)
                index = i;
        }
        if (index === 0) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Top_Of_The_List'));
            return;
        }
        estatePropertyDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'estatePropertyDetailGroup/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            estatePropertyDetail.selectedItem = response1.Item;
            var temp = response1.Item.ShowInFormOrder;
            estatePropertyDetail.selectedItem.ShowInFormOrder = estatePropertyDetail.treeConfig.Items[index - 1].ShowInFormOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'estatePropertyDetailGroup/edit', estatePropertyDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'estatePropertyDetailGroup/GetOne', estatePropertyDetail.treeConfig.Items[index - 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        estatePropertyDetail.selectedItem = response3.Item;
                        estatePropertyDetail.selectedItem.ShowInFormOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'estatePropertyDetailGroup/edit', estatePropertyDetail.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                estatePropertyDetail.treeConfig.Items[index - 1] = response4.Item;
                                // جابجا کردن دو آیتم در آرایه
                                estatePropertyDetail.treeConfig.Items[index] = estatePropertyDetail.treeConfig.Items.splice(index - 1, 1, estatePropertyDetail.treeConfig.Items[index])[0];
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
        estatePropertyDetail.busyIndicator.isActive = false;
    }

    function compare(a, b) {
        if (a.ShowInFormOrder < b.ShowInFormOrder)
            return -1;
        if (a.ShowInFormOrder > b.ShowInFormOrder)
            return 1;
        return 0;
    }

    estatePropertyDetail.onMultipleChoiceChange = function () {
        if (estatePropertyDetail.selectedItem.DefaultValue.multipleChoice) {
            $("#forceUseCheckbox").fadeOut(300);
            estatePropertyDetail.selectedItem.DefaultValue.forceUse = false;
            return;
        }
        $("#forceUseCheckbox").fadeIn(300);
    }

    estatePropertyDetail.onforceUserChange = function () {
        if (estatePropertyDetail.selectedItem.DefaultValue.forceUse) {
            estatePropertyDetail.selectedItem.DefaultValue.multipleChoice = false;
        }
    }

    estatePropertyDetail.backToState = function (state) {
        $state.go(state);
    }

    estatePropertyDetail.onPropertyTypeChange = function (propertyTypeId) {
        estatePropertyDetail.propertyTypeId = parseInt(propertyTypeId);
        $stateParams.propertyParam = parseInt(propertyTypeId);

        var filterValue = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(estatePropertyDetail.propertyTypeId),
            SearchType: 0
        }
        var engine = {};
        engine.Filters = [];
        engine.Filters.push(filterValue);

        ajax.call(cmsServerConfig.configApiServerPath+"EstatePropertyDetailGroup/getall", engine, 'POST').success(function (response) {
            estatePropertyDetail.estatePropertyDetailGroupListItems = response.ListItems;
            estatePropertyDetail.treeConfig.Items = response.ListItems;
            estatePropertyDetail.categorybusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }

    estatePropertyDetail.gridOptions.myfilterText = function (gridListItems, foreignKeyName, childListItems, childItemColumnsName) {
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

    // Input DataType set to Boolean
    estatePropertyDetail.onInputDataTypeChange = function (inputType) {
        if (inputType == 0 || inputType == 1) {
            if (inputType == 1)
                estatePropertyDetail.selectedItem.InputDataType = 4;
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

    estatePropertyDetail.toggleIcons = function (fadeIn) {
        if (fadeIn)
            $('#icons').fadeIn();
        else
            $('#icons').fadeOut();
    }
    //Export Report 
    estatePropertyDetail.exportFile = function () {
        estatePropertyDetail.addRequested = true;
        estatePropertyDetail.gridOptions.advancedSearchData.engine.ExportFile = estatePropertyDetail.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'estatePropertyDetail/exportfile', estatePropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            estatePropertyDetail.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                estatePropertyDetail.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //estatePropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    estatePropertyDetail.toggleExportForm = function () {
        estatePropertyDetail.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        estatePropertyDetail.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        estatePropertyDetail.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        estatePropertyDetail.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        estatePropertyDetail.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleEstate/EstatePropertyDetail/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    estatePropertyDetail.rowCountChanged = function () {
        if (!angular.isDefined(estatePropertyDetail.ExportFileClass.RowCount) || estatePropertyDetail.ExportFileClass.RowCount > 5000)
            estatePropertyDetail.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    estatePropertyDetail.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"estatePropertyDetail/count", estatePropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            estatePropertyDetail.addRequested = false;
            rashaErManage.checkAction(response);
            estatePropertyDetail.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            estatePropertyDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);