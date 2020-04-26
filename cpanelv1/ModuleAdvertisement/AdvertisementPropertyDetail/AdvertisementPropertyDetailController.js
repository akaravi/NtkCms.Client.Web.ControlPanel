app.controller("advertisementPropertyDetailController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$location', '$state', '$stateParams', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $location, $state, $stateParams, $window, $filter) {
    var advertisementPropertyDetail = this;
    //For Grid Options
    if (itemRecordStatus != undefined) advertisementPropertyDetail.itemRecordStatus = itemRecordStatus;
    advertisementPropertyDetail.inputTypeArray = [];
    advertisementPropertyDetail.gridOptions = {};
    advertisementPropertyDetail.selectedItem = {};
    advertisementPropertyDetail.attachedFiles = [];
    advertisementPropertyDetail.ListItems = [];
    advertisementPropertyDetail.propertyTypeListItems = [];
    advertisementPropertyDetail.attachedFile = "";

    advertisementPropertyDetail.count = 0;
advertisementPropertyDetail.LinkCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryId',
        url: 'AdvertisementPropertyDetailGroup',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: advertisementPropertyDetail,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    //AdvertisementPropertyDetail Grid Options
    advertisementPropertyDetail.gridOptions = {
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
            { name: 'ActionButton', displayName: 'ترتیب نمایش', sortable: true, type: 'string', displayForce: true, template: "<button class=\"btn btn-primary btn-circle\" type=\"button\" title=\"انتقال به بالا\" ng-click=\"advertisementPropertyDetail.editStepGoUp(x, $index)\" ng-show=\"x.LinkPropertyDetailGroupId != null\"><i class=\"glyphicon glyphicon-arrow-up\"  aria-hidden=\"true\" style=\"font-weight: bold;\" ></i></button>&nbsp<button class=\"btn btn-danger btn-circle\" title=\"انتقال به پایین\" ng-show=\"x.LinkPropertyDetailGroupId != null\" ng-click=\"advertisementPropertyDetail.editStepGoDown(x, $index)\"><i class=\"glyphicon glyphicon-arrow-down\"  aria-hidden=\"true\" ></i></button>" }
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
    advertisementPropertyDetail.categorybusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show AdvertisementPropertyDetail Loading Indicator
    advertisementPropertyDetail.busyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    advertisementPropertyDetail.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children',
        Items: null
    };


    advertisementPropertyDetail.treeConfig.currentNode = {};
    advertisementPropertyDetail.treebusyIndicator = false;

    advertisementPropertyDetail.addRequested = false;

    advertisementPropertyDetail.advertisementPropertyDetailGroupListItems = [];

    //init Function
    advertisementPropertyDetail.init = function () {
        advertisementPropertyDetail.categorybusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"AdvertisementPropertyDetail/getAllUiDesignType", {}, 'POST').success(function (response) {
            advertisementPropertyDetail.UiDesignType = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"AdvertisementPropertyDetail/GetInputDataTypeEnum", {}, 'POST').success(function (response) {
            advertisementPropertyDetail.inputDataTypeArray = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"AdvertisementPropertyDetail/GetInputDataTypeEnum", {}, 'POST').success(function (response) {
            advertisementPropertyDetail.inputTypeArray = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });

        if ($stateParams.propertyParam != undefined && $stateParams.propertyParam != null)
            advertisementPropertyDetail.propertyTypeId = $stateParams.propertyParam;
        else
            advertisementPropertyDetail.propertyTypeId = 1;

        var filterValue = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(advertisementPropertyDetail.propertyTypeId),
            SearchType: 0
        }
        advertisementPropertyDetail.gridOptions.advancedSearchData.engine.Filters = [];
        advertisementPropertyDetail.gridOptions.advancedSearchData.engine.Filters.push(filterValue);

        advertisementPropertyDetail.groupResultAccess = null;
        ajax.call(cmsServerConfig.configApiServerPath+"AdvertisementPropertyDetailGroup/getall", advertisementPropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            advertisementPropertyDetail.advertisementPropertyDetailGroupListItems = response.ListItems;
            advertisementPropertyDetail.treeConfig.Items = response.ListItems;
            advertisementPropertyDetail.groupResultAccess = response.resultAccess;
            advertisementPropertyDetail.categorybusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"AdvertisementPropertyType/getall", advertisementPropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            advertisementPropertyDetail.propertyTypeListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    };

    // Open Add Category Modal 
    advertisementPropertyDetail.openAddCategoryModal = function () {
        advertisementPropertyDetail.addRequested = false;
        advertisementPropertyDetail.modalTitle = "ایجاد گروه جدید";
        ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementPropertyDetailGroup/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            advertisementPropertyDetail.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleAdvertisement/AdvertisementPropertyDetailGroup/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Add New Category
    advertisementPropertyDetail.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        advertisementPropertyDetail.addRequested = true;
        advertisementPropertyDetail.selectedItem.LinkPropertyTypeId = advertisementPropertyDetail.propertyTypeId;
        advertisementPropertyDetail.selectedItem.IconFont = $("#iconFont").val(); //Save selected icon name in the model
        ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementPropertyDetailGroup/add', advertisementPropertyDetail.selectedItem, 'POST').success(function (response) {
            advertisementPropertyDetail.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                advertisementPropertyDetail.treeConfig.Items.push(response.Item);
                advertisementPropertyDetail.categorybusyIndicator.isActive = false;
                advertisementPropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            advertisementPropertyDetail.addRequested = false;
            advertisementPropertyDetail.categorybusyIndicator.isActive = false;
        });
    };

    // Open Edit Category Modal
    advertisementPropertyDetail.openEditCategoryModal = function () {
        advertisementPropertyDetail.addRequested = false;
        advertisementPropertyDetail.modalTitle = 'ویرایش';
        if (advertisementPropertyDetail.treeConfig.currentNode.Id == 0 || !advertisementPropertyDetail.treeConfig.currentNode.Id) {
            rashaErManage.showMessage("لطفاَ یک دسته جهت ویرایش انتخاب کنید");
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementPropertyDetailGroup/GetOne', advertisementPropertyDetail.treeConfig.currentNode.Id, 'GET').success(function (response1) {
            advertisementPropertyDetail.showbusy = false;
            rashaErManage.checkAction(response1);
            advertisementPropertyDetail.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleAdvertisement/AdvertisementPropertyDetailGroup/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            advertisementPropertyDetail.categorybusyIndicator.isActive = false;
        });
    }
    // Edit a Category
    advertisementPropertyDetail.editCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        advertisementPropertyDetail.categorybusyIndicator.isActive = true;
        advertisementPropertyDetail.selectedItem.IconFont = $("#iconFont").val(); //Save selected icon name in the model
        ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementPropertyDetailGroup/edit', advertisementPropertyDetail.selectedItem, 'PUT').success(function (response) {
            advertisementPropertyDetail.addRequested = true;
            advertisementPropertyDetail.treeConfig.showbusy = false;
            advertisementPropertyDetail.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                advertisementPropertyDetail.addRequested = false;
                advertisementPropertyDetail.treeConfig.currentNode.Title = response.Item.Title;
                advertisementPropertyDetail.categorybusyIndicator.isActive = false;
                advertisementPropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            advertisementPropertyDetail.addRequested = false;
            advertisementPropertyDetail.categorybusyIndicator.isActive = false;
        });
    }
    //Delete a Category
    advertisementPropertyDetail.deleteCategory = function () {
        var node = advertisementPropertyDetail.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        if (advertisementPropertyDetail.ListItems.length == 0) {
            rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
                if (isConfirmed) {
                    advertisementPropertyDetail.categorybusyIndicator.isActive = true;
                    ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementPropertyDetailGroup/GetOne', node.Id, 'GET').success(function (response) {
                        rashaErManage.checkAction(response);
                        advertisementPropertyDetail.selectedItemForDelete = response.Item;
                        ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementPropertyDetailGroup/delete', advertisementPropertyDetail.selectedItemForDelete, 'POST').success(function (res) {

                            if (res.IsSuccess) {
                                advertisementPropertyDetail.gridOptions.advancedSearchData.engine.Filters = null;
                                advertisementPropertyDetail.gridOptions.advancedSearchData.engine.Filters = [];
                                advertisementPropertyDetail.gridOptions.fillData();
                                advertisementPropertyDetail.categorybusyIndicator.isActive = false;
                                advertisementPropertyDetail.gridOptions.reGetAll();
                                advertisementPropertyDetail.treeConfig.currentNode = null;
                            }

                        }).error(function (data2, errCode2, c2, d2) {
                            rashaErManage.checkAction(data2);
                            advertisementPropertyDetail.categorybusyIndicator.isActive = false;

                        });
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                        advertisementPropertyDetail.categorybusyIndicator.isActive = false;

                    });

                }
            });
        } else
            rashaErManage.showMessage("این دسته دارای محتوا است برای حذف دسته ابتدا محتوای آن را حذف نمایید!");
    }

    //Tree On Node Select Options
    advertisementPropertyDetail.treeConfig.onNodeSelect = function () {
        var node = advertisementPropertyDetail.treeConfig.currentNode;
        if (node != undefined && node != null)
            advertisementPropertyDetail.selectedItem.LinkCategoryId = node.Id;
        advertisementPropertyDetail.selectContent(node);

    };

    //Show Content with Category Id
    advertisementPropertyDetail.selectContent = function (node) {
        advertisementPropertyDetail.gridOptions.selectedRow.item = null;
        if (node == null || node.Id == undefined)
            advertisementPropertyDetail.busyIndicator.message = "در حال بارگذاری...";
        else
            advertisementPropertyDetail.busyIndicator.message = "در حال بارگذاری..." + node.Title;
        advertisementPropertyDetail.busyIndicator.isActive = true;
        //advertisementPropertyDetail.gridOptions.advancedSearchData = {};

        advertisementPropertyDetail.gridOptions.advancedSearchData.engine.Filters = null;
        advertisementPropertyDetail.gridOptions.advancedSearchData.engine.Filters = [];
        if (node != undefined && node.Id != undefined) {
            var filterValue1 = {
                PropertyName: "LinkPropertyDetailGroupId",
                IntValue1: node.Id,
                SearchType: 0
            }
            advertisementPropertyDetail.gridOptions.advancedSearchData.engine.Filters.push(filterValue1);
        }
        var filterValue2 = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: advertisementPropertyDetail.propertyTypeId,
            SearchType: 0
        }
        advertisementPropertyDetail.gridOptions.advancedSearchData.engine.Filters.push(filterValue2);

        ajax.call(cmsServerConfig.configApiServerPath+"advertisementPropertyDetail/getall", advertisementPropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            advertisementPropertyDetail.busyIndicator.isActive = false;
            advertisementPropertyDetail.ListItems = response.ListItems;
            advertisementPropertyDetail.filterEnum(advertisementPropertyDetail.ListItems, advertisementPropertyDetail.inputTypeArray);
            advertisementPropertyDetail.gridOptions.fillData(advertisementPropertyDetail.ListItems, response.resultAccess);
            advertisementPropertyDetail.gridOptions.currentPageNumber = response.CurrentPageNumber;
            advertisementPropertyDetail.gridOptions.totalRowCount = response.TotalRowCount;
            advertisementPropertyDetail.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            advertisementPropertyDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            advertisementPropertyDetail.busyIndicator.isActive = false;
        });
    };

    // Open add Content Model
    advertisementPropertyDetail.openAddContentModal = function () {
        var node = advertisementPropertyDetail.treeConfig.currentNode;
        if (node == undefined || node.Id === 0 || node.Id == undefined || node.Id == null) {
            rashaErManage.showMessage("برای اضافه کردن لطفاً دسته مربوطه را انتخاب کنید.");
            return;
        }
        advertisementPropertyDetail.attachedFields = [];
        advertisementPropertyDetail.FieldName = "";
        advertisementPropertyDetail.addRequested = false;
        advertisementPropertyDetail.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementPropertyDetail/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            advertisementPropertyDetail.selectedItem = response.Item;
            advertisementPropertyDetail.selectedItem.LinkPropertyDetailGroupId = node.Id;
            advertisementPropertyDetail.onMultipleChoiceChange();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleAdvertisement/advertisementPropertyDetail/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    //Add New Content
    advertisementPropertyDetail.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (advertisementPropertyDetail.DefaultValue && advertisementPropertyDetail.DefaultValue.multipleChoice && advertisementPropertyDetail.attachedFields < 2) {
            rashaErManage.showMessage("در صورت انتخاب چند گزینه ای باید حداقل دو گزینه اضافه کنید!");
            return;
        }
        advertisementPropertyDetail.addRequested = true;
        advertisementPropertyDetail.selectedItem.LinkPropertyTypeId = advertisementPropertyDetail.propertyTypeId;
        advertisementPropertyDetail.selectedItem.DefaultValue.nameValue = advertisementPropertyDetail.attachedFields;
        advertisementPropertyDetail.selectedItem.JsonDefaultValue = $.trim(angular.toJson(advertisementPropertyDetail.selectedItem.DefaultValue));
        advertisementPropertyDetail.selectedItem.IconFont = $("#iconFont").val(); //Save selected icon name in the model
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementPropertyDetail/add', advertisementPropertyDetail.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                // filter text
                $.each(advertisementPropertyDetail.propertyTypeListItems, function (index, item) {
                    if (item.Id == response.Item.LinkPropertyTypeId) {
                        response.Item.virtual_PropertyType = {};
                        response.Item.virtual_PropertyType.Title = advertisementPropertyDetail.propertyTypeListItems[index].Title;
                        return;
                    }
                });
                response.Item.TypeDescription = null;
                $.each(advertisementPropertyDetail.inputTypeArray, function (index, item) {
                    if (item.Value == response.Item.InputDataType)
                        response.Item.TypeDescription = advertisementPropertyDetail.inputTypeArray[index].Description;
                });
                advertisementPropertyDetail.ListItems.unshift(response.Item);
                advertisementPropertyDetail.gridOptions.fillData(advertisementPropertyDetail.ListItems);
                advertisementPropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            advertisementPropertyDetail.addRequested = false;
        });
    }

    // Open Edit Content Model
    advertisementPropertyDetail.openEditContentModal = function () {
        advertisementPropertyDetail.addRequested = false;
        advertisementPropertyDetail.modalTitle = 'ویرایش';
        if (!advertisementPropertyDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاً یک ردیف جهت ویرایش انتخاب کنید");
            return;
        }
        advertisementPropertyDetail.FieldName = "";
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementPropertyDetail/GetOne', advertisementPropertyDetail.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            advertisementPropertyDetail.selectedItem = response1.Item;

            advertisementPropertyDetail.attachedFields = [];
            advertisementPropertyDetail.attachedFields = response1.Item.DefaultValue.nameValue;
            advertisementPropertyDetail.onMultipleChoiceChange();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleAdvertisement/advertisementPropertyDetail/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Edit a Content
    advertisementPropertyDetail.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (advertisementPropertyDetail.DefaultValue) {
            if (advertisementPropertyDetail.DefaultValue.multipleChoice && advertisementPropertyDetail.attachedFields < 2) {
                rashaErManage.showMessage("در صورت انتخاب چند گزینه ای باید حداقل دو گزینه اضافه کنید!");
                return;
            }
        }
        advertisementPropertyDetail.selectedItem.DefaultValue.nameValue = advertisementPropertyDetail.attachedFields;
        advertisementPropertyDetail.selectedItem.JsonDefaultValue = $.trim(angular.toJson(advertisementPropertyDetail.selectedItem.DefaultValue));
        advertisementPropertyDetail.selectedItem.IconFont = $("#iconFont").val(); //Save selected icon name in the model
        advertisementPropertyDetail.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementPropertyDetail/edit', advertisementPropertyDetail.selectedItem, 'PUT').success(function (response) {
            // advertisementPropertyDetail.addRequested = false;
            advertisementPropertyDetail.treeConfig.showbusy = false;
            advertisementPropertyDetail.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                response.Item.TypeDescription = null;
                var n = advertisementPropertyDetail.inputTypeArray.length;
                for (var i = 0; i < n; i++) {
                    if (advertisementPropertyDetail.inputTypeArray[i].Value == response.Item.InputDataType) {
                        response.Item.TypeDescription = advertisementPropertyDetail.inputTypeArray[i].Description;
                    }
                }
                advertisementPropertyDetail.replaceItem(advertisementPropertyDetail.selectedItem.Id, response.Item);
                advertisementPropertyDetail.gridOptions.fillData(advertisementPropertyDetail.ListItems);
                advertisementPropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            advertisementPropertyDetail.addRequested = false;
        });
    }

    //Delete a Content 
    advertisementPropertyDetail.deleteContent = function () {
        if (!advertisementPropertyDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        advertisementPropertyDetail.treeConfig.showbusy = true;
        advertisementPropertyDetail.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                advertisementPropertyDetail.showbusy = true;
                advertisementPropertyDetail.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+"advertisementPropertyDetail/GetOne", advertisementPropertyDetail.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    advertisementPropertyDetail.showbusy = false;
                    advertisementPropertyDetail.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    advertisementPropertyDetail.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+"advertisementPropertyDetail/delete", advertisementPropertyDetail.selectedItemForDelete, 'POST').success(function (res) {
                        advertisementPropertyDetail.treeConfig.showbusy = false;
                        advertisementPropertyDetail.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            advertisementPropertyDetail.replaceItem(advertisementPropertyDetail.selectedItemForDelete.Id);
                            advertisementPropertyDetail.gridOptions.fillData(advertisementPropertyDetail.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        advertisementPropertyDetail.treeConfig.showbusy = false;
                        advertisementPropertyDetail.showIsBusy = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    advertisementPropertyDetail.treeConfig.showbusy = false;
                    advertisementPropertyDetail.showIsBusy = false;
                });
            }
        });
    }

    //Replace Item OnDelete/OnEdit Grid Options
    advertisementPropertyDetail.replaceItem = function (oldId, newItem) {
        angular.forEach(advertisementPropertyDetail.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = advertisementPropertyDetail.ListItems.indexOf(item);
                advertisementPropertyDetail.ListItems.splice(index, 1);
            }
        });
        if (newItem) {
            advertisementPropertyDetail.setPropertyTypeTitle(newItem);
            advertisementPropertyDetail.ListItems.unshift(newItem);
        }

    }

    advertisementPropertyDetail.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    advertisementPropertyDetail.setPropertyTypeTitle = function (newItem) {
        angular.forEach(advertisementPropertyDetail.propertyTypeListItems, function (item, key) {
            if (item.Id == newItem.LinkPropertyTypeId) {
                var index = advertisementPropertyDetail.propertyTypeListItems.indexOf(item);
                if (index > -1) {
                    newItem.virtual_PropertyType = {};
                    newItem.virtual_PropertyType.Title = advertisementPropertyDetail.propertyTypeListItems[index].Title;
                }
                return;
            }
        });
    }

    advertisementPropertyDetail.addRequested = false;

    advertisementPropertyDetail.closeModal = function () {
        $modalStack.dismissAll();
    };

    advertisementPropertyDetail.showIsBusy = false;

    //For reInit Categories
    advertisementPropertyDetail.gridOptions.reGetAll = function (regardFilters) {
        advertisementPropertyDetail.init();
    };

    advertisementPropertyDetail.isCurrentNodeEmpty = function () {
        return !angular.equals({}, advertisementPropertyDetail.treeConfig.currentNodede);
    }

    advertisementPropertyDetail.loadFileAndFolder = function (item) {
        advertisementPropertyDetail.treeConfig.currentNode = item;
        advertisementPropertyDetail.treeConfig.onNodeSelect(item);
    }

    advertisementPropertyDetail.addRequested = true;

    advertisementPropertyDetail.columnCheckbox = false;

    advertisementPropertyDetail.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = advertisementPropertyDetail.gridOptions.columns;
        if (advertisementPropertyDetail.gridOptions.columnCheckbox) {
            for (var i = 0; i < advertisementPropertyDetail.gridOptions.columns.length; i++) {
                var element = $("#" + advertisementPropertyDetail.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                advertisementPropertyDetail.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < advertisementPropertyDetail.gridOptions.columns.length; i++) {
                var element = $("#" + advertisementPropertyDetail.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + advertisementPropertyDetail.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < advertisementPropertyDetail.gridOptions.columns.length; i++) {
            console.log(advertisementPropertyDetail.gridOptions.columns[i].name.concat(".visible: "), advertisementPropertyDetail.gridOptions.columns[i].visible);
        }
        advertisementPropertyDetail.gridOptions.columnCheckbox = !advertisementPropertyDetail.gridOptions.columnCheckbox;
    }

    advertisementPropertyDetail.deleteAttachedFieldName = function (index) {
        advertisementPropertyDetail.attachedFields.splice(index, 1);
    }

    advertisementPropertyDetail.addAttachedFieldName = function (FieldName) {
        if (advertisementPropertyDetail.updateMode == "edit") {
            advertisementPropertyDetail.attachedFields[advertisementPropertyDetail.selectedIndex] = FieldName;
            advertisementPropertyDetail.selectedItem.DefaultValue.nameValue = advertisementPropertyDetail.attachedFields;
            advertisementPropertyDetail.selectedItem.JsonDefaultValue = $.trim(angular.toJson(advertisementPropertyDetail.selectedItem.DefaultValue));
            ajax.call(cmsServerConfig.configApiServerPath+'advertisementPropertyDetail/edit', advertisementPropertyDetail.selectedItem, 'PUT').success(function (response) {
                rashaErManage.checkAction(response);
                advertisementPropertyDetail.disableUpdate();
                $("#FieldName").val("");
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }
        else //advertisementPropertyDetail.updateMode = "add"
            if (FieldName != null && FieldName != undefined && FieldName != "" && !advertisementPropertyDetail.alreadyExist(FieldName, advertisementPropertyDetail.attachedFields)) {
                advertisementPropertyDetail.attachedFields.push(FieldName);
                $("#FieldName").val("");
            }
    }

    advertisementPropertyDetail.alreadyExist = function (FieldName, array) {
        for (var i = 0; i < array.length; i++) {
            if (FieldName == array[i]) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                return true;
            }
        }
        return false;
    }

    advertisementPropertyDetail.enableUpdate = function (index) {
        advertisementPropertyDetail.selectedIndex = index;
        advertisementPropertyDetail.FieldName = advertisementPropertyDetail.attachedFields[advertisementPropertyDetail.selectedIndex];
        advertisementPropertyDetail.updateMode = "edit";
        $("#addOrEditBtn").css("background-color", "#f3961c");
        $("#addOrEditIcon").removeClass("fa fa-plus").addClass("fa fa-check");
    }

    advertisementPropertyDetail.disableUpdate = function (index) {
        advertisementPropertyDetail.FieldName = advertisementPropertyDetail.attachedFields[index];
        advertisementPropertyDetail.updateMode = "add";
        $("#addOrEditBtn").css("background-color", "#1ab394");
        $("#addOrEditIcon").removeClass("fa fa-check").addClass("fa fa-plus");
    }

    advertisementPropertyDetail.filterEnum = function (myListItems, myEnums) {
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
    advertisementPropertyDetail.editStepGoDown = function (item, index) {
        if (index == advertisementPropertyDetail.ListItems.length - 1) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Bottom_Of_The_List'));
            return;
        }
        advertisementPropertyDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementPropertyDetail/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            advertisementPropertyDetail.selectedItem = response1.Item;
            var temp = response1.Item.ShowInFormOrder;
            advertisementPropertyDetail.selectedItem.ShowInFormOrder = advertisementPropertyDetail.ListItems[index + 1].ShowInFormOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementPropertyDetail/edit', advertisementPropertyDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementPropertyDetail/GetOne', advertisementPropertyDetail.ListItems[index + 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        advertisementPropertyDetail.selectedItem = response3.Item;
                        advertisementPropertyDetail.selectedItem.ShowInFormOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementPropertyDetail/edit', advertisementPropertyDetail.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                // Swap two item in the grid list without requesting a GetAll
                                advertisementPropertyDetail.ListItems[index] = advertisementPropertyDetail.ListItems.splice(index + 1, 1, advertisementPropertyDetail.ListItems[index])[0];
                                advertisementPropertyDetail.gridOptions.fillData(advertisementPropertyDetail.ListItems);
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
        advertisementPropertyDetail.busyIndicator.isActive = false;
    }

    // go up detail
    advertisementPropertyDetail.editStepGoUp = function (item, index) {
        if (index === 0) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Top_Of_The_List'));
            return;
        }
        advertisementPropertyDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementPropertyDetail/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            advertisementPropertyDetail.selectedItem = response1.Item;
            var temp = response1.Item.ShowInFormOrder;
            advertisementPropertyDetail.selectedItem.ShowInFormOrder = advertisementPropertyDetail.ListItems[index - 1].ShowInFormOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementPropertyDetail/edit', advertisementPropertyDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementPropertyDetail/GetOne', advertisementPropertyDetail.ListItems[index - 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        advertisementPropertyDetail.selectedItem = response3.Item;
                        advertisementPropertyDetail.selectedItem.ShowInFormOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'AdvertisementPropertyDetail/edit', advertisementPropertyDetail.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                // جابجا کردن مکان دو آیتم در آرایه
                                advertisementPropertyDetail.ListItems[index] = advertisementPropertyDetail.ListItems.splice(index - 1, 1, advertisementPropertyDetail.ListItems[index])[0];
                                advertisementPropertyDetail.gridOptions.fillData(advertisementPropertyDetail.ListItems);
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
        advertisementPropertyDetail.busyIndicator.isActive = false;
    }

    // Move a group one step down
    advertisementPropertyDetail.editStepGoDownGroup = function (item) {
        if (item.Id === undefined || item.Id === null) {
            rashaErManage.showMessage("برای جابجایی لطفاً یک مورد را انتخاب کنید!");
            return;
        }
        var index = null;
        for (var i = 0; i < advertisementPropertyDetail.treeConfig.Items.length; i++) {
            if (item.Id === advertisementPropertyDetail.treeConfig.Items[i].Id)
                index = i;
        }

        if (index === advertisementPropertyDetail.treeConfig.Items.length - 1) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Bottom_Of_The_List'));
            return;
        }
        advertisementPropertyDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementPropertyDetailGroup/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            advertisementPropertyDetail.selectedItem = response1.Item;
            var temp = response1.Item.ShowInFormOrder;
            advertisementPropertyDetail.selectedItem.ShowInFormOrder = advertisementPropertyDetail.treeConfig.Items[index + 1].ShowInFormOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'advertisementPropertyDetailGroup/edit', advertisementPropertyDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'advertisementPropertyDetailGroup/GetOne', advertisementPropertyDetail.treeConfig.Items[index + 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        advertisementPropertyDetail.selectedItem = response3.Item;
                        advertisementPropertyDetail.selectedItem.ShowInFormOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'advertisementPropertyDetailGroup/edit', advertisementPropertyDetail.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                advertisementPropertyDetail.treeConfig.Items[index + 1] = response4.Item;
                                advertisementPropertyDetail.treeConfig.Items[index] = advertisementPropertyDetail.treeConfig.Items.splice(index + 1, 1, advertisementPropertyDetail.treeConfig.Items[index])[0];
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
        advertisementPropertyDetail.busyIndicator.isActive = false;
    }

    // Move a group one step up
    advertisementPropertyDetail.editStepGoUpGroup = function (item) {
        if (item.Id === undefined || item.Id === null) {
            rashaErManage.showMessage("برای جابجایی لطفاً یک مورد را انتخاب کنید!");
            return;
        }
        var index = null;
        for (var i = 0; i < advertisementPropertyDetail.treeConfig.Items.length; i++) {
            if (item.Id === advertisementPropertyDetail.treeConfig.Items[i].Id)
                index = i;
        }
        if (index === 0) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Top_Of_The_List'));
            return;
        }
        advertisementPropertyDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementPropertyDetailGroup/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            advertisementPropertyDetail.selectedItem = response1.Item;
            var temp = response1.Item.ShowInFormOrder;
            advertisementPropertyDetail.selectedItem.ShowInFormOrder = advertisementPropertyDetail.treeConfig.Items[index - 1].ShowInFormOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'advertisementPropertyDetailGroup/edit', advertisementPropertyDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'advertisementPropertyDetailGroup/GetOne', advertisementPropertyDetail.treeConfig.Items[index - 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        advertisementPropertyDetail.selectedItem = response3.Item;
                        advertisementPropertyDetail.selectedItem.ShowInFormOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'advertisementPropertyDetailGroup/edit', advertisementPropertyDetail.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                advertisementPropertyDetail.treeConfig.Items[index - 1] = response4.Item;
                                // جابجا کردن دو آیتم در آرایه
                                advertisementPropertyDetail.treeConfig.Items[index] = advertisementPropertyDetail.treeConfig.Items.splice(index - 1, 1, advertisementPropertyDetail.treeConfig.Items[index])[0];
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
        advertisementPropertyDetail.busyIndicator.isActive = false;
    }

    function compare(a, b) {
        if (a.ShowInFormOrder < b.ShowInFormOrder)
            return -1;
        if (a.ShowInFormOrder > b.ShowInFormOrder)
            return 1;
        return 0;
    }

    advertisementPropertyDetail.onMultipleChoiceChange = function () {
        if (advertisementPropertyDetail.selectedItem.DefaultValue.multipleChoice) {
            $("#forceUseCheckbox").fadeOut(300);
            advertisementPropertyDetail.selectedItem.DefaultValue.forceUse = false;
            return;
        }
        $("#forceUseCheckbox").fadeIn(300);
    }

    advertisementPropertyDetail.onforceUserChange = function () {
        if (advertisementPropertyDetail.selectedItem.DefaultValue.forceUse) {
            advertisementPropertyDetail.selectedItem.DefaultValue.multipleChoice = false;
        }
    }

    advertisementPropertyDetail.backToState = function (state) {
        $state.go(state);
    }

    advertisementPropertyDetail.onPropertyTypeChange = function (propertyTypeId) {
        advertisementPropertyDetail.propertyTypeId = parseInt(propertyTypeId);
        $stateParams.propertyParam = parseInt(propertyTypeId);

        var filterValue = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(advertisementPropertyDetail.propertyTypeId),
            SearchType: 0
        }
        var engine = {};
        engine.Filters = [];
        engine.Filters.push(filterValue);

        ajax.call(cmsServerConfig.configApiServerPath+"AdvertisementPropertyDetailGroup/getall", engine, 'POST').success(function (response) {
            advertisementPropertyDetail.advertisementPropertyDetailGroupListItems = response.ListItems;
            advertisementPropertyDetail.treeConfig.Items = response.ListItems;
            advertisementPropertyDetail.categorybusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }

    advertisementPropertyDetail.gridOptions.myfilterText = function (gridListItems, foreignKeyName, childListItems, childItemColumnsName) {
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
    advertisementPropertyDetail.exportFile = function () {
        advertisementPropertyDetail.addRequested = true;
        advertisementPropertyDetail.gridOptions.advancedSearchData.engine.ExportFile = advertisementPropertyDetail.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementPropertyDetail/exportfile', advertisementPropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            advertisementPropertyDetail.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                advertisementPropertyDetail.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //advertisementPropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    advertisementPropertyDetail.toggleExportForm = function () {
        advertisementPropertyDetail.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        advertisementPropertyDetail.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        advertisementPropertyDetail.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        advertisementPropertyDetail.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        advertisementPropertyDetail.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleAdvertisement/advertisementPropertyDetail/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    advertisementPropertyDetail.rowCountChanged = function () {
        if (!angular.isDefined(advertisementPropertyDetail.ExportFileClass.RowCount) || advertisementPropertyDetail.ExportFileClass.RowCount > 5000)
            advertisementPropertyDetail.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    advertisementPropertyDetail.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"advertisementPropertyDetail/count", advertisementPropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            advertisementPropertyDetail.addRequested = false;
            rashaErManage.checkAction(response);
            advertisementPropertyDetail.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            advertisementPropertyDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Input DataType set to Boolean
    advertisementPropertyDetail.onInputDataTypeChange = function (inputType) {
        if (inputType == 0 || inputType == 1) {
            if (inputType == 1)
                advertisementPropertyDetail.selectedItem.InputDataType = 4;
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

    advertisementPropertyDetail.toggleIcons = function (fadeIn) {
        if (fadeIn)
            $('#icons').fadeIn();
        else
            $('#icons').fadeOut();
    }
}]);