app.controller("jobPropertyDetailController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$location', '$state', '$stateParams', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $location, $state, $stateParams, $filter) {
    var jobPropertyDetail = this;
    //For Grid Options
    if (itemRecordStatus != undefined) jobPropertyDetail.itemRecordStatus = itemRecordStatus;
    jobPropertyDetail.inputTypeArray = [];
    jobPropertyDetail.gridOptions = {};
    jobPropertyDetail.selectedItem = {};
    jobPropertyDetail.attachedFiles = [];
    jobPropertyDetail.ListItems = [];
    jobPropertyDetail.propertyTypeListItems = [];
    jobPropertyDetail.attachedFile = "";

    jobPropertyDetail.count = 0;

    //JobPropertyDetail Grid Options
    jobPropertyDetail.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'TypeDescription', displayForce: true, displayName: 'نوع ورودی', sortable: true, type: 'string' },
            { name: 'virtual_PropertyType.Title', displayName: 'نوع متقاضی', sortable: true, displayForce: true, type: 'string' },
            { name: 'Required', displayName: 'الزامی است؟', sortable: true, isCheckBox: true, type: 'boolean' },
            { name: 'ShowInFormOrder', displayName: 'عدد ترتیب نمایش', sortable: true, type: 'integer' },
            { name: 'ActionButton', displayName: 'ترتیب نمایش', sortable: true, type: 'string', displayForce: true, template: "<button class=\"btn btn-primary btn-circle\" type=\"button\" title=\"انتقال به بالا\" ng-click=\"jobPropertyDetail.editStepGoUp(x, $index)\" ng-show=\"x.LinkPropertyDetailGroupId != null\"><i class=\"glyphicon glyphicon-arrow-up\"  aria-hidden=\"true\" style=\"font-weight: bold;\" ></i></button>&nbsp<button class=\"btn btn-danger btn-circle\" title=\"انتقال به پایین\" ng-show=\"x.LinkPropertyDetailGroupId != null\" ng-click=\"jobPropertyDetail.editStepGoDown(x, $index)\"><i class=\"glyphicon glyphicon-arrow-down\"  aria-hidden=\"true\" ></i></button>" }
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
    jobPropertyDetail.categorybusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show JobPropertyDetail Loading Indicator
    jobPropertyDetail.busyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    jobPropertyDetail.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children',
        Items: null
    };


    jobPropertyDetail.treeConfig.currentNode = {};
    jobPropertyDetail.treebusyIndicator = false;

    jobPropertyDetail.addRequested = false;

    jobPropertyDetail.jobPropertyDetailGroupListItems = [];

    //init Function
    jobPropertyDetail.init = function () {
        jobPropertyDetail.categorybusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"JobPropertyDetail/getAllUiDesignType", {}, 'POST').success(function (response) {
            jobPropertyDetail.UiDesignType = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"JobPropertyDetail/GetInputDataTypeEnum", {}, 'POST').success(function (response) {
            jobPropertyDetail.inputDataTypeArray = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"JobPropertyDetail/GetInputDataTypeEnum", {}, 'POST').success(function (response) {
            jobPropertyDetail.inputTypeArray = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });

        if ($stateParams.propertyParam != undefined && $stateParams.propertyParam != null)
            jobPropertyDetail.propertyTypeId = $stateParams.propertyParam;
        else
            jobPropertyDetail.propertyTypeId = 1;

        var filterValue = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(jobPropertyDetail.propertyTypeId),
            SearchType: 0
        }
        jobPropertyDetail.gridOptions.advancedSearchData.engine.Filters = [];
        jobPropertyDetail.gridOptions.advancedSearchData.engine.Filters.push(filterValue);

        jobPropertyDetail.groupResultAccess = null;
        ajax.call(cmsServerConfig.configApiServerPath+"JobPropertyDetailGroup/getall", jobPropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            jobPropertyDetail.jobPropertyDetailGroupListItems = response.ListItems;
            jobPropertyDetail.treeConfig.Items = response.ListItems;
            jobPropertyDetail.groupResultAccess = response.resultAccess;
            jobPropertyDetail.categorybusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"JobPropertyType/getall", jobPropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            jobPropertyDetail.propertyTypeListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    };

    // Open Add Category Modal 
    jobPropertyDetail.openAddCategoryModal = function () {
        jobPropertyDetail.addRequested = false;
        jobPropertyDetail.modalTitle = "ایجاد گروه جدید";
        ajax.call(cmsServerConfig.configApiServerPath+'JobPropertyDetailGroup/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            jobPropertyDetail.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleJob/JobPropertyDetailGroup/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Add New Category
    jobPropertyDetail.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        jobPropertyDetail.addRequested = true;
        jobPropertyDetail.selectedItem.LinkPropertyTypeId = jobPropertyDetail.propertyTypeId;
        jobPropertyDetail.selectedItem.IconFont = $("#iconFont").val(); //Save selected icon name in the model
        ajax.call(cmsServerConfig.configApiServerPath+'JobPropertyDetailGroup/add', jobPropertyDetail.selectedItem, 'POST').success(function (response) {
            jobPropertyDetail.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                jobPropertyDetail.treeConfig.Items.push(response.Item);
                jobPropertyDetail.categorybusyIndicator.isActive = false;
                jobPropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            jobPropertyDetail.addRequested = false;
            jobPropertyDetail.categorybusyIndicator.isActive = false;
        });
    };

    // Open Edit Category Modal
    jobPropertyDetail.openEditCategoryModal = function () {
        jobPropertyDetail.addRequested = false;
        jobPropertyDetail.modalTitle = 'ویرایش';
        if (jobPropertyDetail.treeConfig.currentNode.Id == 0 || !jobPropertyDetail.treeConfig.currentNode.Id) {
            rashaErManage.showMessage("لطفاَ یک دسته جهت ویرایش انتخاب کنید");
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'JobPropertyDetailGroup/GetOne', jobPropertyDetail.treeConfig.currentNode.Id, 'GET').success(function (response1) {
            jobPropertyDetail.showbusy = false;
            rashaErManage.checkAction(response1);
            jobPropertyDetail.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleJob/JobPropertyDetailGroup/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            jobPropertyDetail.categorybusyIndicator.isActive = false;
        });
    }
    // Edit a Category
    jobPropertyDetail.editCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        jobPropertyDetail.categorybusyIndicator.isActive = true;
        jobPropertyDetail.selectedItem.IconFont = $("#iconFont").val(); //Save selected icon name in the model
        ajax.call(cmsServerConfig.configApiServerPath+'JobPropertyDetailGroup/edit', jobPropertyDetail.selectedItem, 'PUT').success(function (response) {
            jobPropertyDetail.addRequested = true;
            jobPropertyDetail.treeConfig.showbusy = false;
            jobPropertyDetail.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                jobPropertyDetail.addRequested = false;
                jobPropertyDetail.treeConfig.currentNode.Title = response.Item.Title;
                jobPropertyDetail.categorybusyIndicator.isActive = false;
                jobPropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            jobPropertyDetail.addRequested = false;
            jobPropertyDetail.categorybusyIndicator.isActive = false;
        });
    }
    //Delete a Category
    jobPropertyDetail.deleteCategory = function () {
        var node = jobPropertyDetail.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        if (jobPropertyDetail.ListItems.length == 0) {
            rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
                if (isConfirmed) {
                    jobPropertyDetail.categorybusyIndicator.isActive = true;
                    ajax.call(cmsServerConfig.configApiServerPath+'JobPropertyDetailGroup/GetOne', node.Id, 'GET').success(function (response) {
                        rashaErManage.checkAction(response);
                        jobPropertyDetail.selectedItemForDelete = response.Item;
                        ajax.call(cmsServerConfig.configApiServerPath+'JobPropertyDetailGroup/delete', jobPropertyDetail.selectedItemForDelete, 'POST').success(function (res) {

                            if (res.IsSuccess) {
                                jobPropertyDetail.gridOptions.advancedSearchData.engine.Filters = null;
                                jobPropertyDetail.gridOptions.advancedSearchData.engine.Filters = [];
                                jobPropertyDetail.gridOptions.fillData();
                                jobPropertyDetail.categorybusyIndicator.isActive = false;
                                jobPropertyDetail.gridOptions.reGetAll();
                                jobPropertyDetail.treeConfig.currentNode = null;
                            }

                        }).error(function (data2, errCode2, c2, d2) {
                            rashaErManage.checkAction(data2);
                            jobPropertyDetail.categorybusyIndicator.isActive = false;

                        });
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                        jobPropertyDetail.categorybusyIndicator.isActive = false;

                    });

                }
            });
        } else
            rashaErManage.showMessage("این دسته دارای محتوا است برای حذف دسته ابتدا محتوای آن را حذف نمایید!");
    }

    //Tree On Node Select Options
    jobPropertyDetail.treeConfig.onNodeSelect = function () {
        var node = jobPropertyDetail.treeConfig.currentNode;
        if (node != undefined && node != null)
            jobPropertyDetail.selectedItem.LinkCategoryId = node.Id;
        jobPropertyDetail.selectContent(node);

    };

    //Show Content with Category Id
    jobPropertyDetail.selectContent = function (node) {
        jobPropertyDetail.gridOptions.selectedRow.item = null;
        if (node == null || node.Id == undefined)
            jobPropertyDetail.busyIndicator.message = "در حال بارگذاری...";
        else
            jobPropertyDetail.busyIndicator.message = "در حال بارگذاری..." + node.Title;
        jobPropertyDetail.busyIndicator.isActive = true;
        //jobPropertyDetail.gridOptions.advancedSearchData = {};

        jobPropertyDetail.gridOptions.advancedSearchData.engine.Filters = null;
        jobPropertyDetail.gridOptions.advancedSearchData.engine.Filters = [];
        if (node != undefined && node.Id != undefined) {
            var filterValue1 = {
                PropertyName: "LinkPropertyDetailGroupId",
                IntValue1: node.Id,
                SearchType: 0
            }
            jobPropertyDetail.gridOptions.advancedSearchData.engine.Filters.push(filterValue1);
        }
        var filterValue2 = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: jobPropertyDetail.propertyTypeId,
            SearchType: 0
        }
        jobPropertyDetail.gridOptions.advancedSearchData.engine.Filters.push(filterValue2);

        ajax.call(cmsServerConfig.configApiServerPath+"jobPropertyDetail/getall", jobPropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            jobPropertyDetail.busyIndicator.isActive = false;
            jobPropertyDetail.ListItems = response.ListItems;
            jobPropertyDetail.filterEnum(jobPropertyDetail.ListItems, jobPropertyDetail.inputTypeArray);
            jobPropertyDetail.gridOptions.fillData(jobPropertyDetail.ListItems, response.resultAccess);
            jobPropertyDetail.gridOptions.currentPageNumber = response.CurrentPageNumber;
            jobPropertyDetail.gridOptions.totalRowCount = response.TotalRowCount;
            jobPropertyDetail.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            jobPropertyDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            jobPropertyDetail.busyIndicator.isActive = false;
        });
    };

    // Open add Content Model
    jobPropertyDetail.openAddContentModal = function () {
        var node = jobPropertyDetail.treeConfig.currentNode;
        if (node == undefined || node.Id === 0 || node.Id == undefined || node.Id == null) {
            rashaErManage.showMessage("برای اضافه کردن لطفاً دسته مربوطه را انتخاب کنید.");
            return;
        }
        jobPropertyDetail.attachedFields = [];
        jobPropertyDetail.FieldName = "";
        jobPropertyDetail.addRequested = false;
        jobPropertyDetail.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'jobPropertyDetail/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            jobPropertyDetail.selectedItem = response.Item;
            jobPropertyDetail.selectedItem.LinkPropertyDetailGroupId = node.Id;
            jobPropertyDetail.onMultipleChoiceChange();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleJob/jobPropertyDetail/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    //Add New Content
    jobPropertyDetail.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (jobPropertyDetail.DefaultValue && jobPropertyDetail.DefaultValue.multipleChoice && jobPropertyDetail.attachedFields < 2) {
            rashaErManage.showMessage("در صورت انتخاب چند گزینه ای باید حداقل دو گزینه اضافه کنید!");
            return;
        }
        jobPropertyDetail.addRequested = true;
        jobPropertyDetail.selectedItem.LinkPropertyTypeId = jobPropertyDetail.propertyTypeId;
        jobPropertyDetail.selectedItem.DefaultValue.nameValue = jobPropertyDetail.attachedFields;
        jobPropertyDetail.selectedItem.JsonDefaultValue = $.trim(angular.toJson(jobPropertyDetail.selectedItem.DefaultValue));
        jobPropertyDetail.selectedItem.IconFont = $("#iconFont").val(); //Save selected icon name in the model
        ajax.call(cmsServerConfig.configApiServerPath+'jobPropertyDetail/add', jobPropertyDetail.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                // filter text
                $.each(jobPropertyDetail.propertyTypeListItems, function (index, item) {
                    if (item.Id == response.Item.LinkPropertyTypeId) {
                        response.Item.virtual_PropertyType = {};
                        response.Item.virtual_PropertyType.Title = jobPropertyDetail.propertyTypeListItems[index].Title;
                        return;
                    }
                });
                response.Item.TypeDescription = null;
                $.each(jobPropertyDetail.inputTypeArray, function (index, item) {
                    if (item.Value == response.Item.InputDataType)
                        response.Item.TypeDescription = jobPropertyDetail.inputTypeArray[index].Description;
                });
                jobPropertyDetail.ListItems.unshift(response.Item);
                jobPropertyDetail.gridOptions.fillData(jobPropertyDetail.ListItems);
                jobPropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            jobPropertyDetail.addRequested = false;
        });
    }

    // Open Edit Content Model
    jobPropertyDetail.openEditContentModal = function () {
        jobPropertyDetail.addRequested = false;
        jobPropertyDetail.modalTitle = 'ویرایش';
        if (!jobPropertyDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاً یک ردیف جهت ویرایش انتخاب کنید");
            return;
        }
        jobPropertyDetail.FieldName = "";
        ajax.call(cmsServerConfig.configApiServerPath+'jobPropertyDetail/GetOne', jobPropertyDetail.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            jobPropertyDetail.selectedItem = response1.Item;

            jobPropertyDetail.attachedFields = [];
            jobPropertyDetail.attachedFields = response1.Item.DefaultValue.nameValue;
            jobPropertyDetail.onMultipleChoiceChange();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleJob/jobPropertyDetail/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Edit a Content
    jobPropertyDetail.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (jobPropertyDetail.DefaultValue) {
            if (jobPropertyDetail.DefaultValue.multipleChoice && jobPropertyDetail.attachedFields < 2) {
                rashaErManage.showMessage("در صورت انتخاب چند گزینه ای باید حداقل دو گزینه اضافه کنید!");
                return;
            }
        }
        jobPropertyDetail.selectedItem.DefaultValue.nameValue = jobPropertyDetail.attachedFields;
        jobPropertyDetail.selectedItem.JsonDefaultValue = $.trim(angular.toJson(jobPropertyDetail.selectedItem.DefaultValue));
        jobPropertyDetail.selectedItem.IconFont = $("#iconFont").val(); //Save selected icon name in the model
        jobPropertyDetail.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'jobPropertyDetail/edit', jobPropertyDetail.selectedItem, 'PUT').success(function (response) {
            // jobPropertyDetail.addRequested = false;
            jobPropertyDetail.treeConfig.showbusy = false;
            jobPropertyDetail.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                response.Item.TypeDescription = null;
                var n = jobPropertyDetail.inputTypeArray.length;
                for (var i = 0; i < n; i++) {
                    if (jobPropertyDetail.inputTypeArray[i].Value == response.Item.InputDataType) {
                        response.Item.TypeDescription = jobPropertyDetail.inputTypeArray[i].Description;
                    }
                }
                jobPropertyDetail.replaceItem(jobPropertyDetail.selectedItem.Id, response.Item);
                jobPropertyDetail.gridOptions.fillData(jobPropertyDetail.ListItems);
                jobPropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            jobPropertyDetail.addRequested = false;
        });
    }

    //Delete a Content 
    jobPropertyDetail.deleteContent = function () {
        if (!jobPropertyDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        jobPropertyDetail.treeConfig.showbusy = true;
        jobPropertyDetail.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                jobPropertyDetail.showbusy = true;
                jobPropertyDetail.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+"jobPropertyDetail/GetOne", jobPropertyDetail.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    jobPropertyDetail.showbusy = false;
                    jobPropertyDetail.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    jobPropertyDetail.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+"jobPropertyDetail/delete", jobPropertyDetail.selectedItemForDelete, 'POST').success(function (res) {
                        jobPropertyDetail.treeConfig.showbusy = false;
                        jobPropertyDetail.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            jobPropertyDetail.replaceItem(jobPropertyDetail.selectedItemForDelete.Id);
                            jobPropertyDetail.gridOptions.fillData(jobPropertyDetail.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        jobPropertyDetail.treeConfig.showbusy = false;
                        jobPropertyDetail.showIsBusy = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    jobPropertyDetail.treeConfig.showbusy = false;
                    jobPropertyDetail.showIsBusy = false;
                });
            }
        });
    }

    //Replace Item OnDelete/OnEdit Grid Options
    jobPropertyDetail.replaceItem = function (oldId, newItem) {
        angular.forEach(jobPropertyDetail.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = jobPropertyDetail.ListItems.indexOf(item);
                jobPropertyDetail.ListItems.splice(index, 1);
            }
        });
        if (newItem) {
            jobPropertyDetail.setPropertyTypeTitle(newItem);
            jobPropertyDetail.ListItems.unshift(newItem);
        }

    }

    jobPropertyDetail.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    jobPropertyDetail.setPropertyTypeTitle = function (newItem) {
        angular.forEach(jobPropertyDetail.propertyTypeListItems, function (item, key) {
            if (item.Id == newItem.LinkPropertyTypeId) {
                var index = jobPropertyDetail.propertyTypeListItems.indexOf(item);
                if (index > -1) {
                    newItem.virtual_PropertyType = {};
                    newItem.virtual_PropertyType.Title = jobPropertyDetail.propertyTypeListItems[index].Title;
                }
                return;
            }
        });
    }

    jobPropertyDetail.addRequested = false;

    jobPropertyDetail.closeModal = function () {
        $modalStack.dismissAll();
    };

    jobPropertyDetail.showIsBusy = false;

    //For reInit Categories
    jobPropertyDetail.gridOptions.reGetAll = function (regardFilters) {
        jobPropertyDetail.init();
    };

    jobPropertyDetail.isCurrentNodeEmpty = function () {
        return !angular.equals({}, jobPropertyDetail.treeConfig.currentNodede);
    }

    jobPropertyDetail.loadFileAndFolder = function (item) {
        jobPropertyDetail.treeConfig.currentNode = item;
        jobPropertyDetail.treeConfig.onNodeSelect(item);
    }

    jobPropertyDetail.addRequested = true;

    jobPropertyDetail.columnCheckbox = false;

    jobPropertyDetail.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = jobPropertyDetail.gridOptions.columns;
        if (jobPropertyDetail.gridOptions.columnCheckbox) {
            for (var i = 0; i < jobPropertyDetail.gridOptions.columns.length; i++) {
                var element = $("#" + jobPropertyDetail.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                jobPropertyDetail.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < jobPropertyDetail.gridOptions.columns.length; i++) {
                var element = $("#" + jobPropertyDetail.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + jobPropertyDetail.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < jobPropertyDetail.gridOptions.columns.length; i++) {
            console.log(jobPropertyDetail.gridOptions.columns[i].name.concat(".visible: "), jobPropertyDetail.gridOptions.columns[i].visible);
        }
        jobPropertyDetail.gridOptions.columnCheckbox = !jobPropertyDetail.gridOptions.columnCheckbox;
    }

    jobPropertyDetail.deleteAttachedFieldName = function (index) {
        jobPropertyDetail.attachedFields.splice(index, 1);
    }

    jobPropertyDetail.addAttachedFieldName = function (FieldName) {
        if (jobPropertyDetail.updateMode == "edit") {
            jobPropertyDetail.attachedFields[jobPropertyDetail.selectedIndex] = FieldName;
            jobPropertyDetail.selectedItem.DefaultValue.nameValue = jobPropertyDetail.attachedFields;
            jobPropertyDetail.selectedItem.JsonDefaultValue = $.trim(angular.toJson(jobPropertyDetail.selectedItem.DefaultValue));
            ajax.call(cmsServerConfig.configApiServerPath+'jobPropertyDetail/edit', jobPropertyDetail.selectedItem, 'PUT').success(function (response) {
                rashaErManage.checkAction(response);
                jobPropertyDetail.disableUpdate();
                $("#FieldName").val("");
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }
        else //jobPropertyDetail.updateMode = "add"
            if (FieldName != null && FieldName != undefined && FieldName != "" && !jobPropertyDetail.alreadyExist(FieldName, jobPropertyDetail.attachedFields)) {
                jobPropertyDetail.attachedFields.push(FieldName);
                $("#FieldName").val("");
            }
    }

    jobPropertyDetail.alreadyExist = function (FieldName, array) {
        for (var i = 0; i < array.length; i++) {
            if (FieldName == array[i]) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                return true;
            }
        }
        return false;
    }

    jobPropertyDetail.enableUpdate = function (index) {
        jobPropertyDetail.selectedIndex = index;
        jobPropertyDetail.FieldName = jobPropertyDetail.attachedFields[jobPropertyDetail.selectedIndex];
        jobPropertyDetail.updateMode = "edit";
        $("#addOrEditBtn").css("background-color", "#f3961c");
        $("#addOrEditIcon").removeClass("fa fa-plus").addClass("fa fa-check");
    }

    jobPropertyDetail.disableUpdate = function (index) {
        jobPropertyDetail.FieldName = jobPropertyDetail.attachedFields[index];
        jobPropertyDetail.updateMode = "add";
        $("#addOrEditBtn").css("background-color", "#1ab394");
        $("#addOrEditIcon").removeClass("fa fa-check").addClass("fa fa-plus");
    }

    jobPropertyDetail.filterEnum = function (myListItems, myEnums) {
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
    jobPropertyDetail.editStepGoDown = function (item, index) {
        if (index == jobPropertyDetail.ListItems.length - 1) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Bottom_Of_The_List'));
            return;
        }
        jobPropertyDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'JobPropertyDetail/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            jobPropertyDetail.selectedItem = response1.Item;
            var temp = response1.Item.ShowInFormOrder;
            jobPropertyDetail.selectedItem.ShowInFormOrder = jobPropertyDetail.ListItems[index + 1].ShowInFormOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'JobPropertyDetail/edit', jobPropertyDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'JobPropertyDetail/GetOne', jobPropertyDetail.ListItems[index + 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        jobPropertyDetail.selectedItem = response3.Item;
                        jobPropertyDetail.selectedItem.ShowInFormOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'JobPropertyDetail/edit', jobPropertyDetail.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                // Swap two item in the grid list without requesting a GetAll
                                jobPropertyDetail.ListItems[index] = jobPropertyDetail.ListItems.splice(index + 1, 1, jobPropertyDetail.ListItems[index])[0];
                                jobPropertyDetail.gridOptions.fillData(jobPropertyDetail.ListItems);
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
        jobPropertyDetail.busyIndicator.isActive = false;
    }

    // go up detail
    jobPropertyDetail.editStepGoUp = function (item, index) {
        if (index === 0) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Top_Of_The_List'));
            return;
        }
        jobPropertyDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'JobPropertyDetail/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            jobPropertyDetail.selectedItem = response1.Item;
            var temp = response1.Item.ShowInFormOrder;
            jobPropertyDetail.selectedItem.ShowInFormOrder = jobPropertyDetail.ListItems[index - 1].ShowInFormOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'JobPropertyDetail/edit', jobPropertyDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'JobPropertyDetail/GetOne', jobPropertyDetail.ListItems[index - 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        jobPropertyDetail.selectedItem = response3.Item;
                        jobPropertyDetail.selectedItem.ShowInFormOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'JobPropertyDetail/edit', jobPropertyDetail.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                // جابجا کردن مکان دو آیتم در آرایه
                                jobPropertyDetail.ListItems[index] = jobPropertyDetail.ListItems.splice(index - 1, 1, jobPropertyDetail.ListItems[index])[0];
                                jobPropertyDetail.gridOptions.fillData(jobPropertyDetail.ListItems);
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
        jobPropertyDetail.busyIndicator.isActive = false;
    }

    // Move a group one step down
    jobPropertyDetail.editStepGoDownGroup = function (item) {
        if (item.Id === undefined || item.Id === null) {
            rashaErManage.showMessage("برای جابجایی لطفاً یک مورد را انتخاب کنید!");
            return;
        }
        var index = null;
        for (var i = 0; i < jobPropertyDetail.treeConfig.Items.length; i++) {
            if (item.Id === jobPropertyDetail.treeConfig.Items[i].Id)
                index = i;
        }

        if (index === jobPropertyDetail.treeConfig.Items.length - 1) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Bottom_Of_The_List'));
            return;
        }
        jobPropertyDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'jobPropertyDetailGroup/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            jobPropertyDetail.selectedItem = response1.Item;
            var temp = response1.Item.ShowInFormOrder;
            jobPropertyDetail.selectedItem.ShowInFormOrder = jobPropertyDetail.treeConfig.Items[index + 1].ShowInFormOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'jobPropertyDetailGroup/edit', jobPropertyDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'jobPropertyDetailGroup/GetOne', jobPropertyDetail.treeConfig.Items[index + 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        jobPropertyDetail.selectedItem = response3.Item;
                        jobPropertyDetail.selectedItem.ShowInFormOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'jobPropertyDetailGroup/edit', jobPropertyDetail.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                jobPropertyDetail.treeConfig.Items[index + 1] = response4.Item;
                                jobPropertyDetail.treeConfig.Items[index] = jobPropertyDetail.treeConfig.Items.splice(index + 1, 1, jobPropertyDetail.treeConfig.Items[index])[0];
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
        jobPropertyDetail.busyIndicator.isActive = false;
    }

    // Move a group one step up
    jobPropertyDetail.editStepGoUpGroup = function (item) {
        if (item.Id === undefined || item.Id === null) {
            rashaErManage.showMessage("برای جابجایی لطفاً یک مورد را انتخاب کنید!");
            return;
        }
        var index = null;
        for (var i = 0; i < jobPropertyDetail.treeConfig.Items.length; i++) {
            if (item.Id === jobPropertyDetail.treeConfig.Items[i].Id)
                index = i;
        }
        if (index === 0) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Top_Of_The_List'));
            return;
        }
        jobPropertyDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'jobPropertyDetailGroup/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            jobPropertyDetail.selectedItem = response1.Item;
            var temp = response1.Item.ShowInFormOrder;
            jobPropertyDetail.selectedItem.ShowInFormOrder = jobPropertyDetail.treeConfig.Items[index - 1].ShowInFormOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'jobPropertyDetailGroup/edit', jobPropertyDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'jobPropertyDetailGroup/GetOne', jobPropertyDetail.treeConfig.Items[index - 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        jobPropertyDetail.selectedItem = response3.Item;
                        jobPropertyDetail.selectedItem.ShowInFormOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'jobPropertyDetailGroup/edit', jobPropertyDetail.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                jobPropertyDetail.treeConfig.Items[index - 1] = response4.Item;
                                // جابجا کردن دو آیتم در آرایه
                                jobPropertyDetail.treeConfig.Items[index] = jobPropertyDetail.treeConfig.Items.splice(index - 1, 1, jobPropertyDetail.treeConfig.Items[index])[0];
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
        jobPropertyDetail.busyIndicator.isActive = false;
    }

    function compare(a, b) {
        if (a.ShowInFormOrder < b.ShowInFormOrder)
            return -1;
        if (a.ShowInFormOrder > b.ShowInFormOrder)
            return 1;
        return 0;
    }

    jobPropertyDetail.onMultipleChoiceChange = function () {
        if (jobPropertyDetail.selectedItem.DefaultValue.multipleChoice) {
            $("#forceUseCheckbox").fadeOut(300);
            jobPropertyDetail.selectedItem.DefaultValue.forceUse = false;
            return;
        }
        $("#forceUseCheckbox").fadeIn(300);
    }

    jobPropertyDetail.onforceUserChange = function () {
        if (jobPropertyDetail.selectedItem.DefaultValue.forceUse) {
            jobPropertyDetail.selectedItem.DefaultValue.multipleChoice = false;
        }
    }

    jobPropertyDetail.backToState = function (state) {
        $state.go(state);
    }

    jobPropertyDetail.onPropertyTypeChange = function (propertyTypeId) {
        jobPropertyDetail.propertyTypeId = parseInt(propertyTypeId);
        $stateParams.propertyParam = parseInt(propertyTypeId);

        var filterValue = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(jobPropertyDetail.propertyTypeId),
            SearchType: 0
        }
        var engine = {};
        engine.Filters = [];
        engine.Filters.push(filterValue);

        ajax.call(cmsServerConfig.configApiServerPath+"JobPropertyDetailGroup/getall", engine, 'POST').success(function (response) {
            jobPropertyDetail.jobPropertyDetailGroupListItems = response.ListItems;
            jobPropertyDetail.treeConfig.Items = response.ListItems;
            jobPropertyDetail.categorybusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }

    jobPropertyDetail.gridOptions.myfilterText = function (gridListItems, foreignKeyName, childListItems, childItemColumnsName) {
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
    jobPropertyDetail.onInputDataTypeChange = function (inputType) {
        if (inputType == 0 || inputType == 1) {
            if (inputType == 1)
                jobPropertyDetail.selectedItem.InputDataType = 4;
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

    jobPropertyDetail.toggleIcons = function (fadeIn) {
        if (fadeIn)
            $('#icons').fadeIn();
        else
            $('#icons').fadeOut();
    }
}]);