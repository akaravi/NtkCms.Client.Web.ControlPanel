app.controller("objectPropertyDetailController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$location', '$state', '$stateParams', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $location, $state, $stateParams, $window, $filter) {
    var objectPropertyDetail = this;
    //For Grid Options
    if (itemRecordStatus != undefined) objectPropertyDetail.itemRecordStatus = itemRecordStatus;
    objectPropertyDetail.inputTypeArray = [];
    objectPropertyDetail.gridOptions = {};
    objectPropertyDetail.selectedItem = {};
    objectPropertyDetail.selectedItemhistory = {};
    objectPropertyDetail.attachedFiles = [];
    objectPropertyDetail.ListItems = [];
    objectPropertyDetail.ListItemsHistory=[];
    objectPropertyDetail.propertyTypeListItems = [];
    objectPropertyDetail.attachedFile = "";

    objectPropertyDetail.count = 0;
//#help/ سلکتور history
objectPropertyDetail.LinkHistoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkHistoryId',
        url: 'objectHistory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: objectPropertyDetail,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

//#help/ سلکتور دسته بندی در ویرایش محتوا
objectPropertyDetail.LinkCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryId',
        url: 'objectPropertyDetailGroup',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: objectPropertyDetail,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    //objectPropertyDetail Grid Options
    objectPropertyDetail.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'TypeDescription', displayForce: true, displayName: 'نوع ورودی', sortable: true, type: 'string' },
            { name: 'virtual_PropertyType.Title', displayName: 'نوع ملک', sortable: true, displayForce: true, type: 'string' },
            { name: 'Required', displayName: 'الزامی است؟', sortable: true, isCheckBox: true, type: 'boolean' },
            { name: 'IsHistoryable', displayName: 'تاریخچه است؟', sortable: true, isCheckBox: true, type: 'boolean' },
            { name: 'ShowInFormOrder', displayName: 'عدد ترتیب نمایش', sortable: true, type: 'integer' },
            { name: 'ActionButton', displayName: 'ترتیب نمایش', sortable: true, type: 'string', displayForce: true, template: "<button class=\"btn btn-primary btn-circle\" type=\"button\" title=\"انتقال به بالا\" ng-click=\"objectPropertyDetail.editStepGoUp(x, $index)\" ng-show=\"x.LinkPropertyDetailGroupId != null\"><i class=\"glyphicon glyphicon-arrow-up\"  aria-hidden=\"true\" style=\"font-weight: bold;\" ></i></button>&nbsp<button class=\"btn btn-danger btn-circle\" title=\"انتقال به پایین\" ng-show=\"x.LinkPropertyDetailGroupId != null\" ng-click=\"objectPropertyDetail.editStepGoDown(x, $index)\"><i class=\"glyphicon glyphicon-arrow-down\"  aria-hidden=\"true\" ></i></button>" }
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
    objectPropertyDetail.categorybusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show objectPropertyDetail Loading Indicator
    objectPropertyDetail.busyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    objectPropertyDetail.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children',
        Items: null
    };


    objectPropertyDetail.treeConfig.currentNode = {};
    objectPropertyDetail.treebusyIndicator = false;

    objectPropertyDetail.addRequested = false;

    objectPropertyDetail.objectPropertyDetailGroupListItems = [];

    //init Function
    objectPropertyDetail.init = function () {
        objectPropertyDetail.categorybusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"objectPropertyDetail/getAllUiDesignType", {}, 'POST').success(function (response) {
            objectPropertyDetail.UiDesignType = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"objectPropertyDetail/GetInputDataTypeEnum", {}, 'POST').success(function (response) {
            objectPropertyDetail.inputDataTypeArray = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"objectPropertyDetail/GetInputDataTypeEnum", {}, 'POST').success(function (response) {
            objectPropertyDetail.inputTypeArray = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });

        if ($stateParams.propertyParam != undefined && $stateParams.propertyParam != null)
            objectPropertyDetail.propertyTypeId = $stateParams.propertyParam;
        else
            objectPropertyDetail.propertyTypeId = 1;

        var filterValue = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(objectPropertyDetail.propertyTypeId),
            SearchType: 0
        }
        objectPropertyDetail.gridOptions.advancedSearchData.engine.Filters = [];
        objectPropertyDetail.gridOptions.advancedSearchData.engine.Filters.push(filterValue);

        objectPropertyDetail.groupResultAccess = null;
        ajax.call(cmsServerConfig.configApiServerPath+"objectPropertyDetailGroup/getall", objectPropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            objectPropertyDetail.objectPropertyDetailGroupListItems = response.ListItems;
            objectPropertyDetail.treeConfig.Items = response.ListItems;
            objectPropertyDetail.groupResultAccess = response.resultAccess;
            objectPropertyDetail.categorybusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"objectPropertyType/getall", objectPropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            objectPropertyDetail.propertyTypeListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    };

    // Open Add Category Modal 
    objectPropertyDetail.openAddCategoryModal = function () {
        objectPropertyDetail.addRequested = false;
        objectPropertyDetail.modalTitle = "ایجاد گروه جدید";
        ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetailGroup/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            objectPropertyDetail.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleobject/objectPropertyDetailGroup/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Add New Category
    objectPropertyDetail.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        objectPropertyDetail.addRequested = true;
        objectPropertyDetail.selectedItem.LinkPropertyTypeId = objectPropertyDetail.propertyTypeId;
        objectPropertyDetail.selectedItem.IconFont = $("#iconFont").val(); //Save selected icon name in the model
        ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetailGroup/add', objectPropertyDetail.selectedItem, 'POST').success(function (response) {
            objectPropertyDetail.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                objectPropertyDetail.treeConfig.Items.push(response.Item);
                objectPropertyDetail.categorybusyIndicator.isActive = false;
                objectPropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            objectPropertyDetail.addRequested = false;
            objectPropertyDetail.categorybusyIndicator.isActive = false;
        });
    };

    // Open Edit Category Modal
    objectPropertyDetail.openEditCategoryModal = function () {
        objectPropertyDetail.addRequested = false;
        objectPropertyDetail.modalTitle = 'ویرایش';
        if (objectPropertyDetail.treeConfig.currentNode.Id == 0 || !objectPropertyDetail.treeConfig.currentNode.Id) {
            rashaErManage.showMessage("لطفاَ یک دسته جهت ویرایش انتخاب کنید");
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetailGroup/GetOne', objectPropertyDetail.treeConfig.currentNode.Id, 'GET').success(function (response1) {
            objectPropertyDetail.showbusy = false;
            rashaErManage.checkAction(response1);
            objectPropertyDetail.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Moduleobject/objectPropertyDetailGroup/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            objectPropertyDetail.categorybusyIndicator.isActive = false;
        });
    }
    // Edit a Category
    objectPropertyDetail.editCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        objectPropertyDetail.categorybusyIndicator.isActive = true;
        objectPropertyDetail.selectedItem.IconFont = $("#iconFont").val(); //Save selected icon name in the model
        ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetailGroup/edit', objectPropertyDetail.selectedItem, 'PUT').success(function (response) {
            objectPropertyDetail.addRequested = true;
            objectPropertyDetail.treeConfig.showbusy = false;
            objectPropertyDetail.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                objectPropertyDetail.addRequested = false;
                objectPropertyDetail.treeConfig.currentNode.Title = response.Item.Title;
                objectPropertyDetail.categorybusyIndicator.isActive = false;
                objectPropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            objectPropertyDetail.addRequested = false;
            objectPropertyDetail.categorybusyIndicator.isActive = false;
        });
    }
    //Delete a Category
    objectPropertyDetail.deleteCategory = function () {
        var node = objectPropertyDetail.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        if (objectPropertyDetail.ListItems.length == 0) {
            rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
                if (isConfirmed) {
                    objectPropertyDetail.categorybusyIndicator.isActive = true;
                    ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetailGroup/GetOne', node.Id, 'GET').success(function (response) {
                        rashaErManage.checkAction(response);
                        objectPropertyDetail.selectedItemForDelete = response.Item;
                        ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetailGroup/delete', objectPropertyDetail.selectedItemForDelete, 'POST').success(function (res) {

                            if (res.IsSuccess) {
                                objectPropertyDetail.gridOptions.advancedSearchData.engine.Filters = null;
                                objectPropertyDetail.gridOptions.advancedSearchData.engine.Filters = [];
                                objectPropertyDetail.gridOptions.fillData();
                                objectPropertyDetail.categorybusyIndicator.isActive = false;
                                objectPropertyDetail.gridOptions.reGetAll();
                                objectPropertyDetail.treeConfig.currentNode = null;
                            }

                        }).error(function (data2, errCode2, c2, d2) {
                            rashaErManage.checkAction(data2);
                            objectPropertyDetail.categorybusyIndicator.isActive = false;

                        });
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                        objectPropertyDetail.categorybusyIndicator.isActive = false;

                    });

                }
            });
        } else
            rashaErManage.showMessage("این دسته دارای محتوا است برای حذف دسته ابتدا محتوای آن را حذف نمایید!");
    }

    //Tree On Node Select Options
    objectPropertyDetail.treeConfig.onNodeSelect = function () {
        var node = objectPropertyDetail.treeConfig.currentNode;
        if (node != undefined && node != null)
            objectPropertyDetail.selectedItem.LinkCategoryId = node.Id;
        objectPropertyDetail.selectContent(node);

    };

    //Show Content with Category Id
    objectPropertyDetail.selectContent = function (node) {
        objectPropertyDetail.gridOptions.selectedRow.item = null;
        if (node == null || node.Id == undefined)
            objectPropertyDetail.busyIndicator.message = "در حال بارگذاری...";
        else
            objectPropertyDetail.busyIndicator.message = "در حال بارگذاری..." + node.Title;
        objectPropertyDetail.busyIndicator.isActive = true;
        //objectPropertyDetail.gridOptions.advancedSearchData = {};

        objectPropertyDetail.gridOptions.advancedSearchData.engine.Filters = null;
        objectPropertyDetail.gridOptions.advancedSearchData.engine.Filters = [];
        if (node != undefined && node.Id != undefined) {
            var filterValue1 = {
                PropertyName: "LinkPropertyDetailGroupId",
                IntValue1: node.Id,
                SearchType: 0
            }
            objectPropertyDetail.gridOptions.advancedSearchData.engine.Filters.push(filterValue1);
        }
        var filterValue2 = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: objectPropertyDetail.propertyTypeId,
            SearchType: 0
        }
        objectPropertyDetail.gridOptions.advancedSearchData.engine.Filters.push(filterValue2);

        ajax.call(cmsServerConfig.configApiServerPath+"objectPropertyDetail/getall", objectPropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            objectPropertyDetail.busyIndicator.isActive = false;
            objectPropertyDetail.ListItems = response.ListItems;
            objectPropertyDetail.filterEnum(objectPropertyDetail.ListItems, objectPropertyDetail.inputTypeArray);
            objectPropertyDetail.gridOptions.fillData(objectPropertyDetail.ListItems, response.resultAccess);
            objectPropertyDetail.gridOptions.currentPageNumber = response.CurrentPageNumber;
            objectPropertyDetail.gridOptions.totalRowCount = response.TotalRowCount;
            objectPropertyDetail.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            objectPropertyDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            objectPropertyDetail.busyIndicator.isActive = false;
        });
    };

    // Open add Content Model
    objectPropertyDetail.openAddContentModal = function () {
        var node = objectPropertyDetail.treeConfig.currentNode;
        if (node == undefined || node.Id === 0 || node.Id == undefined || node.Id == null) {
            rashaErManage.showMessage("برای اضافه کردن لطفاً دسته مربوطه را انتخاب کنید.");
            return;
        }
        objectPropertyDetail.attachedFields = [];
        objectPropertyDetail.FieldName = "";
        objectPropertyDetail.addRequested = false;
        objectPropertyDetail.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetail/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            objectPropertyDetail.selectedItem = response.Item;
            objectPropertyDetail.selectedItem.LinkPropertyDetailGroupId = node.Id;
            objectPropertyDetail.onMultipleChoiceChange();
            $modal.open({
                templateUrl: 'cpanelv1/Moduleobject/objectPropertyDetail/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
   
    //Add New Content
    objectPropertyDetail.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (objectPropertyDetail.DefaultValue && objectPropertyDetail.DefaultValue.multipleChoice && objectPropertyDetail.attachedFields < 2) {
            rashaErManage.showMessage("در صورت انتخاب چند گزینه ای باید حداقل دو گزینه اضافه کنید!");
            return;
        }
        objectPropertyDetail.addRequested = true;
        objectPropertyDetail.selectedItem.LinkPropertyTypeId = objectPropertyDetail.propertyTypeId;
        objectPropertyDetail.selectedItem.DefaultValue.nameValue = objectPropertyDetail.attachedFields;
        objectPropertyDetail.selectedItem.JsonDefaultValue = $.trim(angular.toJson(objectPropertyDetail.selectedItem.DefaultValue));
        objectPropertyDetail.selectedItem.IconFont = $("#iconFont").val(); //Save selected icon name in the model
        ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetail/add', objectPropertyDetail.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                // filter text
                $.each(objectPropertyDetail.propertyTypeListItems, function (index, item) {
                    if (item.Id == response.Item.LinkPropertyTypeId) {
                        response.Item.virtual_PropertyType = {};
                        response.Item.virtual_PropertyType.Title = objectPropertyDetail.propertyTypeListItems[index].Title;
                        return;
                    }
                });
                response.Item.TypeDescription = null;
                $.each(objectPropertyDetail.inputTypeArray, function (index, item) {
                    if (item.Value == response.Item.InputDataType)
                        response.Item.TypeDescription = objectPropertyDetail.inputTypeArray[index].Description;
                });
                objectPropertyDetail.ListItems.unshift(response.Item);
                objectPropertyDetail.gridOptions.fillData(objectPropertyDetail.ListItems);
                objectPropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            objectPropertyDetail.addRequested = false;
        });
    }

    // Open Edit Content Model
    objectPropertyDetail.openEditContentModal = function () {
        objectPropertyDetail.addRequested = false;
        objectPropertyDetail.modalTitle = 'ویرایش';
        if (!objectPropertyDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاً یک ردیف جهت ویرایش انتخاب کنید");
            return;
        }
        objectPropertyDetail.FieldName = "";
        ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetail/GetOne', objectPropertyDetail.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            objectPropertyDetail.selectedItem = response1.Item;

            objectPropertyDetail.attachedFields = [];
            objectPropertyDetail.attachedFields = response1.Item.DefaultValue.nameValue;
            objectPropertyDetail.onMultipleChoiceChange();
            $modal.open({
                templateUrl: 'cpanelv1/Moduleobject/objectPropertyDetail/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };


    // Edit a Content
    objectPropertyDetail.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (objectPropertyDetail.DefaultValue) {
            if (objectPropertyDetail.DefaultValue.multipleChoice && objectPropertyDetail.attachedFields < 2) {
                rashaErManage.showMessage("در صورت انتخاب چند گزینه ای باید حداقل دو گزینه اضافه کنید!");
                return;
            }
        }
        objectPropertyDetail.selectedItem.DefaultValue.nameValue = objectPropertyDetail.attachedFields;
        objectPropertyDetail.selectedItem.JsonDefaultValue = $.trim(angular.toJson(objectPropertyDetail.selectedItem.DefaultValue));
        objectPropertyDetail.selectedItem.IconFont = $("#iconFont").val(); //Save selected icon name in the model
        objectPropertyDetail.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetail/edit', objectPropertyDetail.selectedItem, 'PUT').success(function (response) {
            // objectPropertyDetail.addRequested = false;
            objectPropertyDetail.treeConfig.showbusy = false;
            objectPropertyDetail.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                response.Item.TypeDescription = null;
                var n = objectPropertyDetail.inputTypeArray.length;
                for (var i = 0; i < n; i++) {
                    if (objectPropertyDetail.inputTypeArray[i].Value == response.Item.InputDataType) {
                        response.Item.TypeDescription = objectPropertyDetail.inputTypeArray[i].Description;
                    }
                }
                objectPropertyDetail.replaceItem(objectPropertyDetail.selectedItem.Id, response.Item);
                objectPropertyDetail.gridOptions.fillData(objectPropertyDetail.ListItems);
                objectPropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            objectPropertyDetail.addRequested = false;
        });
    }

    //Delete a Content 
    objectPropertyDetail.deleteContent = function () {
        if (!objectPropertyDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        objectPropertyDetail.treeConfig.showbusy = true;
        objectPropertyDetail.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                objectPropertyDetail.showbusy = true;
                objectPropertyDetail.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+"objectPropertyDetail/GetOne", objectPropertyDetail.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    objectPropertyDetail.showbusy = false;
                    objectPropertyDetail.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    objectPropertyDetail.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+"objectPropertyDetail/delete", objectPropertyDetail.selectedItemForDelete, 'POST').success(function (res) {
                        objectPropertyDetail.treeConfig.showbusy = false;
                        objectPropertyDetail.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            objectPropertyDetail.replaceItem(objectPropertyDetail.selectedItemForDelete.Id);
                            objectPropertyDetail.gridOptions.fillData(objectPropertyDetail.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        objectPropertyDetail.treeConfig.showbusy = false;
                        objectPropertyDetail.showIsBusy = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    objectPropertyDetail.treeConfig.showbusy = false;
                    objectPropertyDetail.showIsBusy = false;
                });
            }
        });
    }

    //Replace Item OnDelete/OnEdit Grid Options
    objectPropertyDetail.replaceItem = function (oldId, newItem) {
        angular.forEach(objectPropertyDetail.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = objectPropertyDetail.ListItems.indexOf(item);
                objectPropertyDetail.ListItems.splice(index, 1);
            }
        });
        if (newItem) {
            objectPropertyDetail.setPropertyTypeTitle(newItem);
            objectPropertyDetail.ListItems.unshift(newItem);
        }

    }

    objectPropertyDetail.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    objectPropertyDetail.setPropertyTypeTitle = function (newItem) {
        angular.forEach(objectPropertyDetail.propertyTypeListItems, function (item, key) {
            if (item.Id == newItem.LinkPropertyTypeId) {
                var index = objectPropertyDetail.propertyTypeListItems.indexOf(item);
                if (index > -1) {
                    newItem.virtual_PropertyType = {};
                    newItem.virtual_PropertyType.Title = objectPropertyDetail.propertyTypeListItems[index].Title;
                }
                return;
            }
        });
    }

    objectPropertyDetail.addRequested = false;

    objectPropertyDetail.closeModal = function () {
        $modalStack.dismissAll();
    };

    objectPropertyDetail.showIsBusy = false;

    //For reInit Categories
    objectPropertyDetail.gridOptions.reGetAll = function (regardFilters) {
        objectPropertyDetail.init();
    };

    objectPropertyDetail.isCurrentNodeEmpty = function () {
        return !angular.equals({}, objectPropertyDetail.treeConfig.currentNodede);
    }

    objectPropertyDetail.loadFileAndFolder = function (item) {
        objectPropertyDetail.treeConfig.currentNode = item;
        objectPropertyDetail.treeConfig.onNodeSelect(item);
    }

    objectPropertyDetail.addRequested = true;

    objectPropertyDetail.columnCheckbox = false;

    objectPropertyDetail.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = objectPropertyDetail.gridOptions.columns;
        if (objectPropertyDetail.gridOptions.columnCheckbox) {
            for (var i = 0; i < objectPropertyDetail.gridOptions.columns.length; i++) {
                var element = $("#" + objectPropertyDetail.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                objectPropertyDetail.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < objectPropertyDetail.gridOptions.columns.length; i++) {
                var element = $("#" + objectPropertyDetail.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + objectPropertyDetail.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < objectPropertyDetail.gridOptions.columns.length; i++) {
            console.log(objectPropertyDetail.gridOptions.columns[i].name.concat(".visible: "), objectPropertyDetail.gridOptions.columns[i].visible);
        }
        objectPropertyDetail.gridOptions.columnCheckbox = !objectPropertyDetail.gridOptions.columnCheckbox;
    }

    objectPropertyDetail.deleteAttachedFieldName = function (index) {
        objectPropertyDetail.attachedFields.splice(index, 1);
    }

    objectPropertyDetail.addAttachedFieldName = function (FieldName) {
        if (objectPropertyDetail.updateMode == "edit") {
            objectPropertyDetail.attachedFields[objectPropertyDetail.selectedIndex] = FieldName;
            objectPropertyDetail.selectedItem.DefaultValue.nameValue = objectPropertyDetail.attachedFields;
            objectPropertyDetail.selectedItem.JsonDefaultValue = $.trim(angular.toJson(objectPropertyDetail.selectedItem.DefaultValue));
            ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetail/edit', objectPropertyDetail.selectedItem, 'PUT').success(function (response) {
                rashaErManage.checkAction(response);
                objectPropertyDetail.disableUpdate();
                $("#FieldName").val("");
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }
        else //objectPropertyDetail.updateMode = "add"
            if (FieldName != null && FieldName != undefined && FieldName != "" && !objectPropertyDetail.alreadyExist(FieldName, objectPropertyDetail.attachedFields)) {
                objectPropertyDetail.attachedFields.push(FieldName);
                $("#FieldName").val("");
            }
    }

    objectPropertyDetail.alreadyExist = function (FieldName, array) {
        for (var i = 0; i < array.length; i++) {
            if (FieldName == array[i]) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                return true;
            }
        }
        return false;
    }

    objectPropertyDetail.enableUpdate = function (index) {
        objectPropertyDetail.selectedIndex = index;
        objectPropertyDetail.FieldName = objectPropertyDetail.attachedFields[objectPropertyDetail.selectedIndex];
        objectPropertyDetail.updateMode = "edit";
        $("#addOrEditBtn").css("background-color", "#f3961c");
        $("#addOrEditIcon").removeClass("fa fa-plus").addClass("fa fa-check");
    }

    objectPropertyDetail.disableUpdate = function (index) {
        objectPropertyDetail.FieldName = objectPropertyDetail.attachedFields[index];
        objectPropertyDetail.updateMode = "add";
        $("#addOrEditBtn").css("background-color", "#1ab394");
        $("#addOrEditIcon").removeClass("fa fa-check").addClass("fa fa-plus");
    }

    objectPropertyDetail.filterEnum = function (myListItems, myEnums) {
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
    objectPropertyDetail.editStepGoDown = function (item, index) {
        if (index == objectPropertyDetail.ListItems.length - 1) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Bottom_Of_The_List'));
            return;
        }
        objectPropertyDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetail/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            objectPropertyDetail.selectedItem = response1.Item;
            var temp = response1.Item.ShowInFormOrder;
            objectPropertyDetail.selectedItem.ShowInFormOrder = objectPropertyDetail.ListItems[index + 1].ShowInFormOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetail/edit', objectPropertyDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetail/GetOne', objectPropertyDetail.ListItems[index + 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        objectPropertyDetail.selectedItem = response3.Item;
                        objectPropertyDetail.selectedItem.ShowInFormOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetail/edit', objectPropertyDetail.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                // Swap two item in the grid list without requesting a GetAll
                                objectPropertyDetail.ListItems[index] = objectPropertyDetail.ListItems.splice(index + 1, 1, objectPropertyDetail.ListItems[index])[0];
                                objectPropertyDetail.gridOptions.fillData(objectPropertyDetail.ListItems);
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
        objectPropertyDetail.busyIndicator.isActive = false;
    }

    // go up detail
    objectPropertyDetail.editStepGoUp = function (item, index) {
        if (index === 0) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Top_Of_The_List'));
            return;
        }
        objectPropertyDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetail/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            objectPropertyDetail.selectedItem = response1.Item;
            var temp = response1.Item.ShowInFormOrder;
            objectPropertyDetail.selectedItem.ShowInFormOrder = objectPropertyDetail.ListItems[index - 1].ShowInFormOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetail/edit', objectPropertyDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetail/GetOne', objectPropertyDetail.ListItems[index - 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        objectPropertyDetail.selectedItem = response3.Item;
                        objectPropertyDetail.selectedItem.ShowInFormOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetail/edit', objectPropertyDetail.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                // جابجا کردن مکان دو آیتم در آرایه
                                objectPropertyDetail.ListItems[index] = objectPropertyDetail.ListItems.splice(index - 1, 1, objectPropertyDetail.ListItems[index])[0];
                                objectPropertyDetail.gridOptions.fillData(objectPropertyDetail.ListItems);
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
        objectPropertyDetail.busyIndicator.isActive = false;
    }

    // Move a group one step down
    objectPropertyDetail.editStepGoDownGroup = function (item) {
        if (item.Id === undefined || item.Id === null) {
            rashaErManage.showMessage("برای جابجایی لطفاً یک مورد را انتخاب کنید!");
            return;
        }
        var index = null;
        for (var i = 0; i < objectPropertyDetail.treeConfig.Items.length; i++) {
            if (item.Id === objectPropertyDetail.treeConfig.Items[i].Id)
                index = i;
        }

        if (index === objectPropertyDetail.treeConfig.Items.length - 1) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Bottom_Of_The_List'));
            return;
        }
        objectPropertyDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetailGroup/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            objectPropertyDetail.selectedItem = response1.Item;
            var temp = response1.Item.ShowInFormOrder;
            objectPropertyDetail.selectedItem.ShowInFormOrder = objectPropertyDetail.treeConfig.Items[index + 1].ShowInFormOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetailGroup/edit', objectPropertyDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetailGroup/GetOne', objectPropertyDetail.treeConfig.Items[index + 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        objectPropertyDetail.selectedItem = response3.Item;
                        objectPropertyDetail.selectedItem.ShowInFormOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetailGroup/edit', objectPropertyDetail.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                objectPropertyDetail.treeConfig.Items[index + 1] = response4.Item;
                                objectPropertyDetail.treeConfig.Items[index] = objectPropertyDetail.treeConfig.Items.splice(index + 1, 1, objectPropertyDetail.treeConfig.Items[index])[0];
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
        objectPropertyDetail.busyIndicator.isActive = false;
    }

    // Move a group one step up
    objectPropertyDetail.editStepGoUpGroup = function (item) {
        if (item.Id === undefined || item.Id === null) {
            rashaErManage.showMessage("برای جابجایی لطفاً یک مورد را انتخاب کنید!");
            return;
        }
        var index = null;
        for (var i = 0; i < objectPropertyDetail.treeConfig.Items.length; i++) {
            if (item.Id === objectPropertyDetail.treeConfig.Items[i].Id)
                index = i;
        }
        if (index === 0) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Top_Of_The_List'));
            return;
        }
        objectPropertyDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetailGroup/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            objectPropertyDetail.selectedItem = response1.Item;
            var temp = response1.Item.ShowInFormOrder;
            objectPropertyDetail.selectedItem.ShowInFormOrder = objectPropertyDetail.treeConfig.Items[index - 1].ShowInFormOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetailGroup/edit', objectPropertyDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetailGroup/GetOne', objectPropertyDetail.treeConfig.Items[index - 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        objectPropertyDetail.selectedItem = response3.Item;
                        objectPropertyDetail.selectedItem.ShowInFormOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetailGroup/edit', objectPropertyDetail.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                objectPropertyDetail.treeConfig.Items[index - 1] = response4.Item;
                                // جابجا کردن دو آیتم در آرایه
                                objectPropertyDetail.treeConfig.Items[index] = objectPropertyDetail.treeConfig.Items.splice(index - 1, 1, objectPropertyDetail.treeConfig.Items[index])[0];
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
        objectPropertyDetail.busyIndicator.isActive = false;
    }

    function compare(a, b) {
        if (a.ShowInFormOrder < b.ShowInFormOrder)
            return -1;
        if (a.ShowInFormOrder > b.ShowInFormOrder)
            return 1;
        return 0;
    }

    objectPropertyDetail.onMultipleChoiceChange = function () {
        if (objectPropertyDetail.selectedItem.DefaultValue.multipleChoice) {
            $("#forceUseCheckbox").fadeOut(300);
            objectPropertyDetail.selectedItem.DefaultValue.forceUse = false;
            return;
        }
        $("#forceUseCheckbox").fadeIn(300);
    }

    objectPropertyDetail.onforceUserChange = function () {
        if (objectPropertyDetail.selectedItem.DefaultValue.forceUse) {
            objectPropertyDetail.selectedItem.DefaultValue.multipleChoice = false;
        }
    }
   


    objectPropertyDetail.backToState = function (state) {
        $state.go(state);
    }

    objectPropertyDetail.onPropertyTypeChange = function (propertyTypeId) {
        objectPropertyDetail.propertyTypeId = parseInt(propertyTypeId);
        $stateParams.propertyParam = parseInt(propertyTypeId);

        var filterValue = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(objectPropertyDetail.propertyTypeId),
            SearchType: 0
        }
        var engine = {};
        engine.Filters = [];
        engine.Filters.push(filterValue);

        ajax.call(cmsServerConfig.configApiServerPath+"objectPropertyDetailGroup/getall", engine, 'POST').success(function (response) {
            objectPropertyDetail.objectPropertyDetailGroupListItems = response.ListItems;
            objectPropertyDetail.treeConfig.Items = response.ListItems;
            objectPropertyDetail.categorybusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }

    objectPropertyDetail.gridOptions.myfilterText = function (gridListItems, foreignKeyName, childListItems, childItemColumnsName) {
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
    objectPropertyDetail.onInputDataTypeChange = function (inputType) {
        if (inputType == 0 || inputType == 1) {
            if (inputType == 1)
                objectPropertyDetail.selectedItem.InputDataType = 4;
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

    objectPropertyDetail.toggleIcons = function (fadeIn) {
        if (fadeIn)
            $('#icons').fadeIn();
        else
            $('#icons').fadeOut();
    }
    //Export Report 
    objectPropertyDetail.exportFile = function () {
        objectPropertyDetail.addRequested = true;
        objectPropertyDetail.gridOptions.advancedSearchData.engine.ExportFile = objectPropertyDetail.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'objectPropertyDetail/exportfile', objectPropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            objectPropertyDetail.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                objectPropertyDetail.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //objectPropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    objectPropertyDetail.toggleExportForm = function () {
        objectPropertyDetail.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        objectPropertyDetail.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        objectPropertyDetail.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        objectPropertyDetail.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        objectPropertyDetail.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/Moduleobject/objectPropertyDetail/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    objectPropertyDetail.rowCountChanged = function () {
        if (!angular.isDefined(objectPropertyDetail.ExportFileClass.RowCount) || objectPropertyDetail.ExportFileClass.RowCount > 5000)
            objectPropertyDetail.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    objectPropertyDetail.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"objectPropertyDetail/count", objectPropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            objectPropertyDetail.addRequested = false;
            rashaErManage.checkAction(response);
            objectPropertyDetail.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            objectPropertyDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);