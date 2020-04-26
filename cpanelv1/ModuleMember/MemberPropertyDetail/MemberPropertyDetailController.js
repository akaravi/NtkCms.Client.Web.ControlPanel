app.controller("memberPropertyDetailController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$location', '$state', '$stateParams', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $location, $state, $stateParams, $window, $filter) {
    var memberPropertyDetail = this;
    //For Grid Options
    if (itemRecordStatus != undefined) memberPropertyDetail.itemRecordStatus = itemRecordStatus;
    memberPropertyDetail.inputTypeArray = [];
    memberPropertyDetail.gridOptions = {};
    memberPropertyDetail.selectedItem = {};
    memberPropertyDetail.selectedItemhistory = {};
    memberPropertyDetail.attachedFiles = [];
    memberPropertyDetail.ListItems = [];
    memberPropertyDetail.ListItemsHistory=[];
    memberPropertyDetail.propertyTypeListItems = [];
    memberPropertyDetail.attachedFile = "";

    memberPropertyDetail.count = 0;
//#help/ سلکتور history
memberPropertyDetail.LinkHistoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkHistoryId',
        url: 'MemberHistory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: memberPropertyDetail,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

//#help/ سلکتور دسته بندی در ویرایش محتوا
memberPropertyDetail.LinkCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryId',
        url: 'MemberPropertyDetailGroup',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: memberPropertyDetail,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    //MemberPropertyDetail Grid Options
    memberPropertyDetail.gridOptions = {
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
            { name: 'ActionButton', displayName: 'ترتیب نمایش', sortable: true, type: 'string', displayForce: true, template: "<button class=\"btn btn-primary btn-circle\" type=\"button\" title=\"انتقال به بالا\" ng-click=\"memberPropertyDetail.editStepGoUp(x, $index)\" ng-show=\"x.LinkPropertyDetailGroupId != null\"><i class=\"glyphicon glyphicon-arrow-up\"  aria-hidden=\"true\" style=\"font-weight: bold;\" ></i></button>&nbsp<button class=\"btn btn-danger btn-circle\" title=\"انتقال به پایین\" ng-show=\"x.LinkPropertyDetailGroupId != null\" ng-click=\"memberPropertyDetail.editStepGoDown(x, $index)\"><i class=\"glyphicon glyphicon-arrow-down\"  aria-hidden=\"true\" ></i></button>" }
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
    memberPropertyDetail.categorybusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show MemberPropertyDetail Loading Indicator
    memberPropertyDetail.busyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    memberPropertyDetail.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children',
        Items: null
    };


    memberPropertyDetail.treeConfig.currentNode = {};
    memberPropertyDetail.treebusyIndicator = false;

    memberPropertyDetail.addRequested = false;

    memberPropertyDetail.memberPropertyDetailGroupListItems = [];

    //init Function
    memberPropertyDetail.init = function () {
        memberPropertyDetail.categorybusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"MemberPropertyDetail/getAllUiDesignType", {}, 'POST').success(function (response) {
            memberPropertyDetail.UiDesignType = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"MemberPropertyDetail/GetInputDataTypeEnum", {}, 'POST').success(function (response) {
            memberPropertyDetail.inputDataTypeArray = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"MemberPropertyDetail/GetInputDataTypeEnum", {}, 'POST').success(function (response) {
            memberPropertyDetail.inputTypeArray = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });

        if ($stateParams.propertyParam != undefined && $stateParams.propertyParam != null)
            memberPropertyDetail.propertyTypeId = $stateParams.propertyParam;
        else
            memberPropertyDetail.propertyTypeId = 1;

        var filterValue = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(memberPropertyDetail.propertyTypeId),
            SearchType: 0
        }
        memberPropertyDetail.gridOptions.advancedSearchData.engine.Filters = [];
        memberPropertyDetail.gridOptions.advancedSearchData.engine.Filters.push(filterValue);

        memberPropertyDetail.groupResultAccess = null;
        ajax.call(cmsServerConfig.configApiServerPath+"MemberPropertyDetailGroup/getall", memberPropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            memberPropertyDetail.memberPropertyDetailGroupListItems = response.ListItems;
            memberPropertyDetail.treeConfig.Items = response.ListItems;
            memberPropertyDetail.groupResultAccess = response.resultAccess;
            memberPropertyDetail.categorybusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"MemberPropertyType/getall", memberPropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            memberPropertyDetail.propertyTypeListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    };

    // Open Add Category Modal 
    memberPropertyDetail.openAddCategoryModal = function () {
        memberPropertyDetail.addRequested = false;
        memberPropertyDetail.modalTitle = "ایجاد گروه جدید";
        ajax.call(cmsServerConfig.configApiServerPath+'MemberPropertyDetailGroup/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            memberPropertyDetail.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMember/MemberPropertyDetailGroup/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Add New Category
    memberPropertyDetail.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        memberPropertyDetail.addRequested = true;
        memberPropertyDetail.selectedItem.LinkPropertyTypeId = memberPropertyDetail.propertyTypeId;
        memberPropertyDetail.selectedItem.IconFont = $("#iconFont").val(); //Save selected icon name in the model
        ajax.call(cmsServerConfig.configApiServerPath+'MemberPropertyDetailGroup/add', memberPropertyDetail.selectedItem, 'POST').success(function (response) {
            memberPropertyDetail.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                memberPropertyDetail.treeConfig.Items.push(response.Item);
                memberPropertyDetail.categorybusyIndicator.isActive = false;
                memberPropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberPropertyDetail.addRequested = false;
            memberPropertyDetail.categorybusyIndicator.isActive = false;
        });
    };

    // Open Edit Category Modal
    memberPropertyDetail.openEditCategoryModal = function () {
        memberPropertyDetail.addRequested = false;
        memberPropertyDetail.modalTitle = 'ویرایش';
        if (memberPropertyDetail.treeConfig.currentNode.Id == 0 || !memberPropertyDetail.treeConfig.currentNode.Id) {
            rashaErManage.showMessage("لطفاَ یک دسته جهت ویرایش انتخاب کنید");
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'MemberPropertyDetailGroup/GetOne', memberPropertyDetail.treeConfig.currentNode.Id, 'GET').success(function (response1) {
            memberPropertyDetail.showbusy = false;
            rashaErManage.checkAction(response1);
            memberPropertyDetail.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMember/MemberPropertyDetailGroup/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberPropertyDetail.categorybusyIndicator.isActive = false;
        });
    }
    // Edit a Category
    memberPropertyDetail.editCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        memberPropertyDetail.categorybusyIndicator.isActive = true;
        memberPropertyDetail.selectedItem.IconFont = $("#iconFont").val(); //Save selected icon name in the model
        ajax.call(cmsServerConfig.configApiServerPath+'MemberPropertyDetailGroup/edit', memberPropertyDetail.selectedItem, 'PUT').success(function (response) {
            memberPropertyDetail.addRequested = true;
            memberPropertyDetail.treeConfig.showbusy = false;
            memberPropertyDetail.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                memberPropertyDetail.addRequested = false;
                memberPropertyDetail.treeConfig.currentNode.Title = response.Item.Title;
                memberPropertyDetail.categorybusyIndicator.isActive = false;
                memberPropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberPropertyDetail.addRequested = false;
            memberPropertyDetail.categorybusyIndicator.isActive = false;
        });
    }
    //Delete a Category
    memberPropertyDetail.deleteCategory = function () {
        var node = memberPropertyDetail.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        if (memberPropertyDetail.ListItems.length == 0) {
            rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
                if (isConfirmed) {
                    memberPropertyDetail.categorybusyIndicator.isActive = true;
                    ajax.call(cmsServerConfig.configApiServerPath+'MemberPropertyDetailGroup/GetOne', node.Id, 'GET').success(function (response) {
                        rashaErManage.checkAction(response);
                        memberPropertyDetail.selectedItemForDelete = response.Item;
                        ajax.call(cmsServerConfig.configApiServerPath+'MemberPropertyDetailGroup/delete', memberPropertyDetail.selectedItemForDelete, 'POST').success(function (res) {

                            if (res.IsSuccess) {
                                memberPropertyDetail.gridOptions.advancedSearchData.engine.Filters = null;
                                memberPropertyDetail.gridOptions.advancedSearchData.engine.Filters = [];
                                memberPropertyDetail.gridOptions.fillData();
                                memberPropertyDetail.categorybusyIndicator.isActive = false;
                                memberPropertyDetail.gridOptions.reGetAll();
                                memberPropertyDetail.treeConfig.currentNode = null;
                            }

                        }).error(function (data2, errCode2, c2, d2) {
                            rashaErManage.checkAction(data2);
                            memberPropertyDetail.categorybusyIndicator.isActive = false;

                        });
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                        memberPropertyDetail.categorybusyIndicator.isActive = false;

                    });

                }
            });
        } else
            rashaErManage.showMessage("این دسته دارای محتوا است برای حذف دسته ابتدا محتوای آن را حذف نمایید!");
    }

    //Tree On Node Select Options
    memberPropertyDetail.treeConfig.onNodeSelect = function () {
        var node = memberPropertyDetail.treeConfig.currentNode;
        if (node != undefined && node != null)
            memberPropertyDetail.selectedItem.LinkCategoryId = node.Id;
        memberPropertyDetail.selectContent(node);

    };

    //Show Content with Category Id
    memberPropertyDetail.selectContent = function (node) {
        memberPropertyDetail.gridOptions.selectedRow.item = null;
        if (node == null || node.Id == undefined)
            memberPropertyDetail.busyIndicator.message = "در حال بارگذاری...";
        else
            memberPropertyDetail.busyIndicator.message = "در حال بارگذاری..." + node.Title;
        memberPropertyDetail.busyIndicator.isActive = true;
        //memberPropertyDetail.gridOptions.advancedSearchData = {};

        memberPropertyDetail.gridOptions.advancedSearchData.engine.Filters = null;
        memberPropertyDetail.gridOptions.advancedSearchData.engine.Filters = [];
        if (node != undefined && node.Id != undefined) {
            var filterValue1 = {
                PropertyName: "LinkPropertyDetailGroupId",
                IntValue1: node.Id,
                SearchType: 0
            }
            memberPropertyDetail.gridOptions.advancedSearchData.engine.Filters.push(filterValue1);
        }
        var filterValue2 = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: memberPropertyDetail.propertyTypeId,
            SearchType: 0
        }
        memberPropertyDetail.gridOptions.advancedSearchData.engine.Filters.push(filterValue2);

        ajax.call(cmsServerConfig.configApiServerPath+"memberPropertyDetail/getall", memberPropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            memberPropertyDetail.busyIndicator.isActive = false;
            memberPropertyDetail.ListItems = response.ListItems;
            memberPropertyDetail.filterEnum(memberPropertyDetail.ListItems, memberPropertyDetail.inputTypeArray);
            memberPropertyDetail.gridOptions.fillData(memberPropertyDetail.ListItems, response.resultAccess);
            memberPropertyDetail.gridOptions.currentPageNumber = response.CurrentPageNumber;
            memberPropertyDetail.gridOptions.totalRowCount = response.TotalRowCount;
            memberPropertyDetail.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            memberPropertyDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            memberPropertyDetail.busyIndicator.isActive = false;
        });
    };

    // Open add Content Model
    memberPropertyDetail.openAddContentModal = function () {
        var node = memberPropertyDetail.treeConfig.currentNode;
        if (node == undefined || node.Id === 0 || node.Id == undefined || node.Id == null) {
            rashaErManage.showMessage("برای اضافه کردن لطفاً دسته مربوطه را انتخاب کنید.");
            return;
        }
        memberPropertyDetail.attachedFields = [];
        memberPropertyDetail.FieldName = "";
        memberPropertyDetail.addRequested = false;
        memberPropertyDetail.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyDetail/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            memberPropertyDetail.selectedItem = response.Item;
            memberPropertyDetail.selectedItem.LinkPropertyDetailGroupId = node.Id;
            memberPropertyDetail.onMultipleChoiceChange();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMember/memberPropertyDetail/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
   
    //Add New Content
    memberPropertyDetail.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (memberPropertyDetail.DefaultValue && memberPropertyDetail.DefaultValue.multipleChoice && memberPropertyDetail.attachedFields < 2) {
            rashaErManage.showMessage("در صورت انتخاب چند گزینه ای باید حداقل دو گزینه اضافه کنید!");
            return;
        }
        memberPropertyDetail.addRequested = true;
        memberPropertyDetail.selectedItem.LinkPropertyTypeId = memberPropertyDetail.propertyTypeId;
        memberPropertyDetail.selectedItem.DefaultValue.nameValue = memberPropertyDetail.attachedFields;
        memberPropertyDetail.selectedItem.JsonDefaultValue = $.trim(angular.toJson(memberPropertyDetail.selectedItem.DefaultValue));
        memberPropertyDetail.selectedItem.IconFont = $("#iconFont").val(); //Save selected icon name in the model
        ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyDetail/add', memberPropertyDetail.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                // filter text
                $.each(memberPropertyDetail.propertyTypeListItems, function (index, item) {
                    if (item.Id == response.Item.LinkPropertyTypeId) {
                        response.Item.virtual_PropertyType = {};
                        response.Item.virtual_PropertyType.Title = memberPropertyDetail.propertyTypeListItems[index].Title;
                        return;
                    }
                });
                response.Item.TypeDescription = null;
                $.each(memberPropertyDetail.inputTypeArray, function (index, item) {
                    if (item.Value == response.Item.InputDataType)
                        response.Item.TypeDescription = memberPropertyDetail.inputTypeArray[index].Description;
                });
                memberPropertyDetail.ListItems.unshift(response.Item);
                memberPropertyDetail.gridOptions.fillData(memberPropertyDetail.ListItems);
                memberPropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberPropertyDetail.addRequested = false;
        });
    }

    // Open Edit Content Model
    memberPropertyDetail.openEditContentModal = function () {
        memberPropertyDetail.addRequested = false;
        memberPropertyDetail.modalTitle = 'ویرایش';
        if (!memberPropertyDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاً یک ردیف جهت ویرایش انتخاب کنید");
            return;
        }
        memberPropertyDetail.FieldName = "";
        ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyDetail/GetOne', memberPropertyDetail.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            memberPropertyDetail.selectedItem = response1.Item;

            memberPropertyDetail.attachedFields = [];
            memberPropertyDetail.attachedFields = response1.Item.DefaultValue.nameValue;
            memberPropertyDetail.onMultipleChoiceChange();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMember/memberPropertyDetail/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };


    // Edit a Content
    memberPropertyDetail.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (memberPropertyDetail.DefaultValue) {
            if (memberPropertyDetail.DefaultValue.multipleChoice && memberPropertyDetail.attachedFields < 2) {
                rashaErManage.showMessage("در صورت انتخاب چند گزینه ای باید حداقل دو گزینه اضافه کنید!");
                return;
            }
        }
        memberPropertyDetail.selectedItem.DefaultValue.nameValue = memberPropertyDetail.attachedFields;
        memberPropertyDetail.selectedItem.JsonDefaultValue = $.trim(angular.toJson(memberPropertyDetail.selectedItem.DefaultValue));
        memberPropertyDetail.selectedItem.IconFont = $("#iconFont").val(); //Save selected icon name in the model
        memberPropertyDetail.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyDetail/edit', memberPropertyDetail.selectedItem, 'PUT').success(function (response) {
            // memberPropertyDetail.addRequested = false;
            memberPropertyDetail.treeConfig.showbusy = false;
            memberPropertyDetail.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                response.Item.TypeDescription = null;
                var n = memberPropertyDetail.inputTypeArray.length;
                for (var i = 0; i < n; i++) {
                    if (memberPropertyDetail.inputTypeArray[i].Value == response.Item.InputDataType) {
                        response.Item.TypeDescription = memberPropertyDetail.inputTypeArray[i].Description;
                    }
                }
                memberPropertyDetail.replaceItem(memberPropertyDetail.selectedItem.Id, response.Item);
                memberPropertyDetail.gridOptions.fillData(memberPropertyDetail.ListItems);
                memberPropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberPropertyDetail.addRequested = false;
        });
    }

    //Delete a Content 
    memberPropertyDetail.deleteContent = function () {
        if (!memberPropertyDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        memberPropertyDetail.treeConfig.showbusy = true;
        memberPropertyDetail.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                memberPropertyDetail.showbusy = true;
                memberPropertyDetail.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+"memberPropertyDetail/GetOne", memberPropertyDetail.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    memberPropertyDetail.showbusy = false;
                    memberPropertyDetail.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    memberPropertyDetail.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+"memberPropertyDetail/delete", memberPropertyDetail.selectedItemForDelete, 'POST').success(function (res) {
                        memberPropertyDetail.treeConfig.showbusy = false;
                        memberPropertyDetail.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            memberPropertyDetail.replaceItem(memberPropertyDetail.selectedItemForDelete.Id);
                            memberPropertyDetail.gridOptions.fillData(memberPropertyDetail.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        memberPropertyDetail.treeConfig.showbusy = false;
                        memberPropertyDetail.showIsBusy = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    memberPropertyDetail.treeConfig.showbusy = false;
                    memberPropertyDetail.showIsBusy = false;
                });
            }
        });
    }

    //Replace Item OnDelete/OnEdit Grid Options
    memberPropertyDetail.replaceItem = function (oldId, newItem) {
        angular.forEach(memberPropertyDetail.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = memberPropertyDetail.ListItems.indexOf(item);
                memberPropertyDetail.ListItems.splice(index, 1);
            }
        });
        if (newItem) {
            memberPropertyDetail.setPropertyTypeTitle(newItem);
            memberPropertyDetail.ListItems.unshift(newItem);
        }

    }

    memberPropertyDetail.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    memberPropertyDetail.setPropertyTypeTitle = function (newItem) {
        angular.forEach(memberPropertyDetail.propertyTypeListItems, function (item, key) {
            if (item.Id == newItem.LinkPropertyTypeId) {
                var index = memberPropertyDetail.propertyTypeListItems.indexOf(item);
                if (index > -1) {
                    newItem.virtual_PropertyType = {};
                    newItem.virtual_PropertyType.Title = memberPropertyDetail.propertyTypeListItems[index].Title;
                }
                return;
            }
        });
    }

    memberPropertyDetail.addRequested = false;

    memberPropertyDetail.closeModal = function () {
        $modalStack.dismissAll();
    };

    memberPropertyDetail.showIsBusy = false;

    //For reInit Categories
    memberPropertyDetail.gridOptions.reGetAll = function (regardFilters) {
        memberPropertyDetail.init();
    };

    memberPropertyDetail.isCurrentNodeEmpty = function () {
        return !angular.equals({}, memberPropertyDetail.treeConfig.currentNodede);
    }

    memberPropertyDetail.loadFileAndFolder = function (item) {
        memberPropertyDetail.treeConfig.currentNode = item;
        memberPropertyDetail.treeConfig.onNodeSelect(item);
    }

    memberPropertyDetail.addRequested = true;

    memberPropertyDetail.columnCheckbox = false;

    memberPropertyDetail.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = memberPropertyDetail.gridOptions.columns;
        if (memberPropertyDetail.gridOptions.columnCheckbox) {
            for (var i = 0; i < memberPropertyDetail.gridOptions.columns.length; i++) {
                var element = $("#" + memberPropertyDetail.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                memberPropertyDetail.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < memberPropertyDetail.gridOptions.columns.length; i++) {
                var element = $("#" + memberPropertyDetail.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + memberPropertyDetail.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < memberPropertyDetail.gridOptions.columns.length; i++) {
            console.log(memberPropertyDetail.gridOptions.columns[i].name.concat(".visible: "), memberPropertyDetail.gridOptions.columns[i].visible);
        }
        memberPropertyDetail.gridOptions.columnCheckbox = !memberPropertyDetail.gridOptions.columnCheckbox;
    }

    memberPropertyDetail.deleteAttachedFieldName = function (index) {
        memberPropertyDetail.attachedFields.splice(index, 1);
    }

    memberPropertyDetail.addAttachedFieldName = function (FieldName) {
        if (memberPropertyDetail.updateMode == "edit") {
            memberPropertyDetail.attachedFields[memberPropertyDetail.selectedIndex] = FieldName;
            memberPropertyDetail.selectedItem.DefaultValue.nameValue = memberPropertyDetail.attachedFields;
            memberPropertyDetail.selectedItem.JsonDefaultValue = $.trim(angular.toJson(memberPropertyDetail.selectedItem.DefaultValue));
            ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyDetail/edit', memberPropertyDetail.selectedItem, 'PUT').success(function (response) {
                rashaErManage.checkAction(response);
                memberPropertyDetail.disableUpdate();
                $("#FieldName").val("");
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }
        else //memberPropertyDetail.updateMode = "add"
            if (FieldName != null && FieldName != undefined && FieldName != "" && !memberPropertyDetail.alreadyExist(FieldName, memberPropertyDetail.attachedFields)) {
                memberPropertyDetail.attachedFields.push(FieldName);
                $("#FieldName").val("");
            }
    }

    memberPropertyDetail.alreadyExist = function (FieldName, array) {
        for (var i = 0; i < array.length; i++) {
            if (FieldName == array[i]) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                return true;
            }
        }
        return false;
    }

    memberPropertyDetail.enableUpdate = function (index) {
        memberPropertyDetail.selectedIndex = index;
        memberPropertyDetail.FieldName = memberPropertyDetail.attachedFields[memberPropertyDetail.selectedIndex];
        memberPropertyDetail.updateMode = "edit";
        $("#addOrEditBtn").css("background-color", "#f3961c");
        $("#addOrEditIcon").removeClass("fa fa-plus").addClass("fa fa-check");
    }

    memberPropertyDetail.disableUpdate = function (index) {
        memberPropertyDetail.FieldName = memberPropertyDetail.attachedFields[index];
        memberPropertyDetail.updateMode = "add";
        $("#addOrEditBtn").css("background-color", "#1ab394");
        $("#addOrEditIcon").removeClass("fa fa-check").addClass("fa fa-plus");
    }

    memberPropertyDetail.filterEnum = function (myListItems, myEnums) {
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
    memberPropertyDetail.editStepGoDown = function (item, index) {
        if (index == memberPropertyDetail.ListItems.length - 1) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Bottom_Of_The_List'));
            return;
        }
        memberPropertyDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MemberPropertyDetail/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            memberPropertyDetail.selectedItem = response1.Item;
            var temp = response1.Item.ShowInFormOrder;
            memberPropertyDetail.selectedItem.ShowInFormOrder = memberPropertyDetail.ListItems[index + 1].ShowInFormOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'MemberPropertyDetail/edit', memberPropertyDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'MemberPropertyDetail/GetOne', memberPropertyDetail.ListItems[index + 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        memberPropertyDetail.selectedItem = response3.Item;
                        memberPropertyDetail.selectedItem.ShowInFormOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'MemberPropertyDetail/edit', memberPropertyDetail.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                // Swap two item in the grid list without requesting a GetAll
                                memberPropertyDetail.ListItems[index] = memberPropertyDetail.ListItems.splice(index + 1, 1, memberPropertyDetail.ListItems[index])[0];
                                memberPropertyDetail.gridOptions.fillData(memberPropertyDetail.ListItems);
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
        memberPropertyDetail.busyIndicator.isActive = false;
    }

    // go up detail
    memberPropertyDetail.editStepGoUp = function (item, index) {
        if (index === 0) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Top_Of_The_List'));
            return;
        }
        memberPropertyDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'MemberPropertyDetail/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            memberPropertyDetail.selectedItem = response1.Item;
            var temp = response1.Item.ShowInFormOrder;
            memberPropertyDetail.selectedItem.ShowInFormOrder = memberPropertyDetail.ListItems[index - 1].ShowInFormOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'MemberPropertyDetail/edit', memberPropertyDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'MemberPropertyDetail/GetOne', memberPropertyDetail.ListItems[index - 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        memberPropertyDetail.selectedItem = response3.Item;
                        memberPropertyDetail.selectedItem.ShowInFormOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'MemberPropertyDetail/edit', memberPropertyDetail.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                // جابجا کردن مکان دو آیتم در آرایه
                                memberPropertyDetail.ListItems[index] = memberPropertyDetail.ListItems.splice(index - 1, 1, memberPropertyDetail.ListItems[index])[0];
                                memberPropertyDetail.gridOptions.fillData(memberPropertyDetail.ListItems);
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
        memberPropertyDetail.busyIndicator.isActive = false;
    }

    // Move a group one step down
    memberPropertyDetail.editStepGoDownGroup = function (item) {
        if (item.Id === undefined || item.Id === null) {
            rashaErManage.showMessage("برای جابجایی لطفاً یک مورد را انتخاب کنید!");
            return;
        }
        var index = null;
        for (var i = 0; i < memberPropertyDetail.treeConfig.Items.length; i++) {
            if (item.Id === memberPropertyDetail.treeConfig.Items[i].Id)
                index = i;
        }

        if (index === memberPropertyDetail.treeConfig.Items.length - 1) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Bottom_Of_The_List'));
            return;
        }
        memberPropertyDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyDetailGroup/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            memberPropertyDetail.selectedItem = response1.Item;
            var temp = response1.Item.ShowInFormOrder;
            memberPropertyDetail.selectedItem.ShowInFormOrder = memberPropertyDetail.treeConfig.Items[index + 1].ShowInFormOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyDetailGroup/edit', memberPropertyDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyDetailGroup/GetOne', memberPropertyDetail.treeConfig.Items[index + 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        memberPropertyDetail.selectedItem = response3.Item;
                        memberPropertyDetail.selectedItem.ShowInFormOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyDetailGroup/edit', memberPropertyDetail.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                memberPropertyDetail.treeConfig.Items[index + 1] = response4.Item;
                                memberPropertyDetail.treeConfig.Items[index] = memberPropertyDetail.treeConfig.Items.splice(index + 1, 1, memberPropertyDetail.treeConfig.Items[index])[0];
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
        memberPropertyDetail.busyIndicator.isActive = false;
    }

    // Move a group one step up
    memberPropertyDetail.editStepGoUpGroup = function (item) {
        if (item.Id === undefined || item.Id === null) {
            rashaErManage.showMessage("برای جابجایی لطفاً یک مورد را انتخاب کنید!");
            return;
        }
        var index = null;
        for (var i = 0; i < memberPropertyDetail.treeConfig.Items.length; i++) {
            if (item.Id === memberPropertyDetail.treeConfig.Items[i].Id)
                index = i;
        }
        if (index === 0) {
            rashaErManage.showMessage($filter('translatentk')('The_Menu_Is_At_The_Top_Of_The_List'));
            return;
        }
        memberPropertyDetail.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyDetailGroup/GetOne', item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            memberPropertyDetail.selectedItem = response1.Item;
            var temp = response1.Item.ShowInFormOrder;
            memberPropertyDetail.selectedItem.ShowInFormOrder = memberPropertyDetail.treeConfig.Items[index - 1].ShowInFormOrder;
            ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyDetailGroup/edit', memberPropertyDetail.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyDetailGroup/GetOne', memberPropertyDetail.treeConfig.Items[index - 1].Id, 'GET').success(function (response3) {
                        rashaErManage.checkAction(response3);
                        memberPropertyDetail.selectedItem = response3.Item;
                        memberPropertyDetail.selectedItem.ShowInFormOrder = temp;
                        ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyDetailGroup/edit', memberPropertyDetail.selectedItem, 'PUT').success(function (response4) {
                            rashaErManage.checkAction(response4);
                            if (response4.IsSuccess) {
                                memberPropertyDetail.treeConfig.Items[index - 1] = response4.Item;
                                // جابجا کردن دو آیتم در آرایه
                                memberPropertyDetail.treeConfig.Items[index] = memberPropertyDetail.treeConfig.Items.splice(index - 1, 1, memberPropertyDetail.treeConfig.Items[index])[0];
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
        memberPropertyDetail.busyIndicator.isActive = false;
    }

    function compare(a, b) {
        if (a.ShowInFormOrder < b.ShowInFormOrder)
            return -1;
        if (a.ShowInFormOrder > b.ShowInFormOrder)
            return 1;
        return 0;
    }

    memberPropertyDetail.onMultipleChoiceChange = function () {
        if (memberPropertyDetail.selectedItem.DefaultValue.multipleChoice) {
            $("#forceUseCheckbox").fadeOut(300);
            memberPropertyDetail.selectedItem.DefaultValue.forceUse = false;
            return;
        }
        $("#forceUseCheckbox").fadeIn(300);
    }

    memberPropertyDetail.onforceUserChange = function () {
        if (memberPropertyDetail.selectedItem.DefaultValue.forceUse) {
            memberPropertyDetail.selectedItem.DefaultValue.multipleChoice = false;
        }
    }
   


    memberPropertyDetail.backToState = function (state) {
        $state.go(state);
    }

    memberPropertyDetail.onPropertyTypeChange = function (propertyTypeId) {
        memberPropertyDetail.propertyTypeId = parseInt(propertyTypeId);
        $stateParams.propertyParam = parseInt(propertyTypeId);

        var filterValue = {
            PropertyName: "LinkPropertyTypeId",
            IntValue1: parseInt(memberPropertyDetail.propertyTypeId),
            SearchType: 0
        }
        var engine = {};
        engine.Filters = [];
        engine.Filters.push(filterValue);

        ajax.call(cmsServerConfig.configApiServerPath+"MemberPropertyDetailGroup/getall", engine, 'POST').success(function (response) {
            memberPropertyDetail.memberPropertyDetailGroupListItems = response.ListItems;
            memberPropertyDetail.treeConfig.Items = response.ListItems;
            memberPropertyDetail.categorybusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }

    memberPropertyDetail.gridOptions.myfilterText = function (gridListItems, foreignKeyName, childListItems, childItemColumnsName) {
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
    memberPropertyDetail.onInputDataTypeChange = function (inputType) {
        if (inputType == 0 || inputType == 1) {
            if (inputType == 1)
                memberPropertyDetail.selectedItem.InputDataType = 4;
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

    memberPropertyDetail.toggleIcons = function (fadeIn) {
        if (fadeIn)
            $('#icons').fadeIn();
        else
            $('#icons').fadeOut();
    }
    //Export Report 
    memberPropertyDetail.exportFile = function () {
        memberPropertyDetail.addRequested = true;
        memberPropertyDetail.gridOptions.advancedSearchData.engine.ExportFile = memberPropertyDetail.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyDetail/exportfile', memberPropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            memberPropertyDetail.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                memberPropertyDetail.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //memberPropertyDetail.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    memberPropertyDetail.toggleExportForm = function () {
        memberPropertyDetail.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        memberPropertyDetail.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        memberPropertyDetail.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        memberPropertyDetail.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        memberPropertyDetail.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleMember/MemberPropertyDetail/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    memberPropertyDetail.rowCountChanged = function () {
        if (!angular.isDefined(memberPropertyDetail.ExportFileClass.RowCount) || memberPropertyDetail.ExportFileClass.RowCount > 5000)
            memberPropertyDetail.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    memberPropertyDetail.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"memberPropertyDetail/count", memberPropertyDetail.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            memberPropertyDetail.addRequested = false;
            rashaErManage.checkAction(response);
            memberPropertyDetail.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            memberPropertyDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);