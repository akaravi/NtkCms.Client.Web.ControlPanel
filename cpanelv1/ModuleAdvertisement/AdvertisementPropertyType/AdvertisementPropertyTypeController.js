app.controller("advertisementPropertyTypeController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$state', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $state, $window, $filter) {

    var advertisementPropertyType = this;

    advertisementPropertyType.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    advertisementPropertyType.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    //Tree Config
    advertisementPropertyType.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    }

    advertisementPropertyType.ListItems = [];
    advertisementPropertyType.selectUniversalMenuOnUndetectableKey = true;
    if (itemRecordStatus != undefined) advertisementPropertyType.itemRecordStatus = itemRecordStatus;

    advertisementPropertyType.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"advertisementpropertytypecategory/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            advertisementPropertyType.treeConfig.Items = response.ListItems;
            advertisementPropertyType.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        advertisementPropertyType.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"advertisementpropertytype/getall", advertisementPropertyType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            advertisementPropertyType.busyIndicator.isActive = false;
            advertisementPropertyType.ListItems = response.ListItems;
            advertisementPropertyType.gridOptions.fillData(advertisementPropertyType.ListItems, response.resultAccess);
            advertisementPropertyType.gridOptions.currentPageNumber = response.CurrentPageNumber;
            advertisementPropertyType.gridOptions.totalRowCount = response.TotalRowCount;
            advertisementPropertyType.gridOptions.rowPerPage = response.RowPerPage;
            advertisementPropertyType.allowedSearch = response.AllowedSearchField;

        }).error(function (data, errCode, c, d) {
            advertisementPropertyType.busyIndicator.isActive = false;
            advertisementPropertyType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    advertisementPropertyType.busyIndicator.isActive = true;
    advertisementPropertyType.addRequested = false;
    advertisementPropertyType.openAddModal = function () {
        advertisementPropertyType.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementpropertytype/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            advertisementPropertyType.busyIndicator.isActive = false;
            advertisementPropertyType.selectedItem = response.Item;
            advertisementPropertyType.selectedItem.LinkCategoryId = advertisementPropertyType.treeConfig.currentNode.Id;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleAdvertisement/AdvertisementPropertyType/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            advertisementPropertyType.busyIndicator.isActive = false;

        });
    }
    // Open Add Category Modal 
    advertisementPropertyType.openAddCategoryModal = function () {
        advertisementPropertyType.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementpropertytypecategory/GetViewModel', "", 'GET').success(function (response) {
            advertisementPropertyType.addRequested = false;
            rashaErManage.checkAction(response);
            advertisementPropertyType.selectedItem = response.Item;
            //Set dataForTheTree
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                advertisementPropertyType.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(advertisementPropertyType.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleAdvertisement/AdvertisementPropertyTypeCategory/add.html',
                        scope: $scope
                    });
                    advertisementPropertyType.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //-----
            //$modal.open({
            //    templateUrl: 'cpanelv1/ModuleAdvertisement/AdvertisementPropertyTypeCategory/add.html',
            //    scope: $scope
            //});

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Open Edit Category Modal
    advertisementPropertyType.openEditCategoryModal = function () {
        advertisementPropertyType.modalTitle = 'ویرایش';
        if (!advertisementPropertyType.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }
        advertisementPropertyType.addRequested = true;
        advertisementPropertyType.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementpropertytypecategory/GetOne', advertisementPropertyType.treeConfig.currentNode.Id, 'GET').success(function (response) {
            advertisementPropertyType.addRequested = false;
            advertisementPropertyType.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            advertisementPropertyType.selectedItem = response.Item;
            //Set dataForTheTree
            advertisementPropertyType.selectedNode = [];
            advertisementPropertyType.expandedNodes = [];
            advertisementPropertyType.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                advertisementPropertyType.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(advertisementPropertyType.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (advertisementPropertyType.selectedItem.LinkMainImageId > 0)
                        advertisementPropertyType.onSelection({ Id: advertisementPropertyType.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleAdvertisement/AdvertisementPropertyTypeCategory/edit.html',
                        scope: $scope
                    });
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //---
            //$modal.open({
            //    templateUrl: 'cpanelv1/ModuleAdvertisement/AdvertisementPropertyTypeCategory/edit.html',
            //    scope: $scope
            //});
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    advertisementPropertyType.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        advertisementPropertyType.categoryBusyIndicator.isActive = true;
        advertisementPropertyType.addRequested = true;
        advertisementPropertyType.selectedItem.LinkParentId = null;
        if (advertisementPropertyType.treeConfig.currentNode != null)
            advertisementPropertyType.selectedItem.LinkParentId = advertisementPropertyType.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementpropertytypecategory/add', advertisementPropertyType.selectedItem, 'POST').success(function (response) {
            advertisementPropertyType.addRequested = false;
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                advertisementPropertyType.gridOptions.advancedSearchData.engine.Filters = null;
                advertisementPropertyType.gridOptions.advancedSearchData.engine.Filters = [];
                advertisementPropertyType.gridOptions.reGetAll();
                advertisementPropertyType.closeModal();
            }
            advertisementPropertyType.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            advertisementPropertyType.addRequested = false;
            advertisementPropertyType.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    advertisementPropertyType.editCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        advertisementPropertyType.addRequested = true;
        advertisementPropertyType.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementpropertytypecategory/edit', advertisementPropertyType.selectedItem, 'PUT').success(function (response) {
            advertisementPropertyType.addRequested = true;
            //advertisementPropertyType.showbusy = false;
            advertisementPropertyType.treeConfig.showbusy = false;
            advertisementPropertyType.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                advertisementPropertyType.addRequested = false;
                advertisementPropertyType.treeConfig.currentNode.Title = response.Item.Title;
                advertisementPropertyType.closeModal();
            }
            advertisementPropertyType.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            advertisementPropertyType.addRequested = false;
            advertisementPropertyType.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    advertisementPropertyType.deleteCategory = function () {
        if (advertisementPropertyType.addRequested) { return };
        var node = advertisementPropertyType.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                advertisementPropertyType.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                advertisementPropertyType.addRequested = true;
                ajax.call(cmsServerConfig.configApiServerPath+'advertisementpropertytypecategory/GetOne', node.Id, 'GET').success(function (response) {
                    advertisementPropertyType.addRequested = false;
                    rashaErManage.checkAction(response);
                    advertisementPropertyType.selectedItemForDelete = response.Item;
                    console.log(advertisementPropertyType.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'advertisementpropertytypecategory/delete', advertisementPropertyType.selectedItemForDelete, 'POST').success(function (res) {
                        advertisementPropertyType.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //advertisementPropertyType.replaceCategoryItem(advertisementPropertyType.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            advertisementPropertyType.gridOptions.advancedSearchData.engine.Filters = null;
                            advertisementPropertyType.gridOptions.advancedSearchData.engine.Filters = [];
                            advertisementPropertyType.gridOptions.fillData();
                            advertisementPropertyType.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        advertisementPropertyType.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    advertisementPropertyType.categoryBusyIndicator.isActive = false;

                });

            }
        });
    }
    advertisementPropertyType.selectedItem = {};
    //Tree On Node Select Options
    advertisementPropertyType.treeConfig.onNodeSelect = function () {
        var node = advertisementPropertyType.treeConfig.currentNode;
        advertisementPropertyType.showGridComment = false;
        //advertisementPropertyType.selectedItem.LinkCategoryId = node.Id;
        advertisementPropertyType.selectContent(node);
    }
    //Show Content with Category Id
    advertisementPropertyType.selectContent = function (node) {

        advertisementPropertyType.gridOptions.advancedSearchData.engine.Filters = null;
        advertisementPropertyType.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            advertisementPropertyType.busyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            advertisementPropertyType.busyIndicator.isActive = true;
            //advertisementPropertyType.gridOptions.advancedSearchData = {};

            advertisementPropertyType.attachedFiles = null;
            advertisementPropertyType.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryId",
                IntValue1: node.Id,
                SearchType: 0
            }
            advertisementPropertyType.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"advertisementPropertyType/getall", advertisementPropertyType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            advertisementPropertyType.busyIndicator.isActive = false;
            advertisementPropertyType.ListItems = response.ListItems;
            advertisementPropertyType.gridOptions.fillData(advertisementPropertyType.ListItems, response.resultAccess); // Sending Access as an argument
            advertisementPropertyType.gridOptions.currentPageNumber = response.CurrentPageNumber;
            advertisementPropertyType.gridOptions.totalRowCount = response.TotalRowCount;
            advertisementPropertyType.gridOptions.rowPerPage = response.RowPerPage;
            advertisementPropertyType.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            advertisementPropertyType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Add New Content
    advertisementPropertyType.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        advertisementPropertyType.busyIndicator.isActive = true;
        advertisementPropertyType.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementpropertytype/add', advertisementPropertyType.selectedItem, 'POST').success(function (response) {
            advertisementPropertyType.addRequested = false;
            advertisementPropertyType.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                advertisementPropertyType.ListItems.unshift(response.Item);
                advertisementPropertyType.gridOptions.fillData(advertisementPropertyType.ListItems);
                advertisementPropertyType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            advertisementPropertyType.busyIndicator.isActive = false;
            advertisementPropertyType.addRequested = false;
        });
    }

    advertisementPropertyType.openEditModal = function () {
        advertisementPropertyType.modalTitle = 'ویرایش';
        if (!advertisementPropertyType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementpropertytype/GetOne', advertisementPropertyType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            advertisementPropertyType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleAdvertisement/AdvertisementPropertyType/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    advertisementPropertyType.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        advertisementPropertyType.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementpropertytype/edit', advertisementPropertyType.selectedItem, 'PUT').success(function (response) {
            advertisementPropertyType.addRequested = true;
            rashaErManage.checkAction(response);
            advertisementPropertyType.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                advertisementPropertyType.addRequested = false;
                advertisementPropertyType.replaceItem(advertisementPropertyType.selectedItem.Id, response.Item);
                advertisementPropertyType.gridOptions.fillData(advertisementPropertyType.ListItems);
                advertisementPropertyType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            advertisementPropertyType.addRequested = false;
            advertisementPropertyType.busyIndicator.isActive = false;

        });
    }

    advertisementPropertyType.closeModal = function () {
        $modalStack.dismissAll();
    };

    advertisementPropertyType.replaceItem = function (oldId, newItem) {
        angular.forEach(advertisementPropertyType.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = advertisementPropertyType.ListItems.indexOf(item);
                advertisementPropertyType.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            advertisementPropertyType.ListItems.unshift(newItem);
    }

    advertisementPropertyType.deleteRow = function () {
        if (!advertisementPropertyType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                advertisementPropertyType.busyIndicator.isActive = true;
                console.log(advertisementPropertyType.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'advertisementpropertytype/GetOne', advertisementPropertyType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    advertisementPropertyType.selectedItemForDelete = response.Item;
                    console.log(advertisementPropertyType.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'advertisementpropertytype/delete', advertisementPropertyType.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        advertisementPropertyType.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            advertisementPropertyType.replaceItem(advertisementPropertyType.selectedItemForDelete.Id);
                            advertisementPropertyType.gridOptions.fillData(advertisementPropertyType.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        advertisementPropertyType.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    advertisementPropertyType.busyIndicator.isActive = false;

                });
            }
        });
    }

    advertisementPropertyType.searchData = function () {
        advertisementPropertyType.gridOptions.searchData();

    }

    advertisementPropertyType.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: true },
            { name: 'ActionButtons', displayName: 'خصوصیات آگهی', sortable: true, type: 'string', visible: true, displayForce: true, template: '<button type="button" class="btn btn-primary" ng-click="advertisementPropertyType.goToDetails(x.Id)"  class="btn btn-primary"><i class="fa fa-plus-circle" aria-hidden="true"></i>&nbsp;خصوصیات</button>' }
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
                Filters: [],
                Count: false
            }
        }
    }

    advertisementPropertyType.gridOptions.reGetAll = function () {
        advertisementPropertyType.init();
    }

    advertisementPropertyType.gridOptions.onRowSelected = function () {

    }

    advertisementPropertyType.columnCheckbox = false;
    advertisementPropertyType.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (advertisementPropertyType.gridOptions.columnCheckbox) {
            for (var i = 0; i < advertisementPropertyType.gridOptions.columns.length; i++) {
                //advertisementPropertyType.gridOptions.columns[i].visible = $("#" + advertisementPropertyType.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + advertisementPropertyType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                advertisementPropertyType.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = advertisementPropertyType.gridOptions.columns;
            for (var i = 0; i < advertisementPropertyType.gridOptions.columns.length; i++) {
                advertisementPropertyType.gridOptions.columns[i].visible = true;
                var element = $("#" + advertisementPropertyType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + advertisementPropertyType.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < advertisementPropertyType.gridOptions.columns.length; i++) {
            console.log(advertisementPropertyType.gridOptions.columns[i].name.concat(".visible: "), advertisementPropertyType.gridOptions.columns[i].visible);
        }
        advertisementPropertyType.gridOptions.columnCheckbox = !advertisementPropertyType.gridOptions.columnCheckbox;
    }
    //Export Report 
    advertisementPropertyType.exportFile = function () {
        advertisementPropertyType.addRequested = true;
        advertisementPropertyType.gridOptions.advancedSearchData.engine.ExportFile = advertisementPropertyType.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementPropertyType/exportfile', advertisementPropertyType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            advertisementPropertyType.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                advertisementPropertyType.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //advertisementPropertyType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    advertisementPropertyType.toggleExportForm = function () {
        advertisementPropertyType.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        advertisementPropertyType.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        advertisementPropertyType.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        advertisementPropertyType.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        advertisementPropertyType.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleAdvertisement/advertisementPropertyType/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    advertisementPropertyType.rowCountChanged = function () {
        if (!angular.isDefined(advertisementPropertyType.ExportFileClass.RowCount) || advertisementPropertyType.ExportFileClass.RowCount > 5000)
            advertisementPropertyType.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    advertisementPropertyType.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"advertisementPropertyType/count", advertisementPropertyType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            advertisementPropertyType.addRequested = false;
            rashaErManage.checkAction(response);
            advertisementPropertyType.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            advertisementPropertyType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    advertisementPropertyType.goToDetails = function (proprtyId) {
        $state.go('index.advertisementpropertydetail', { propertyParam: proprtyId });
    }

    advertisementPropertyType.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }
    //TreeControl
    advertisementPropertyType.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (advertisementPropertyType.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    advertisementPropertyType.onNodeToggle = function (node, expanded) {
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

    advertisementPropertyType.onSelection = function (node, selected) {
        if (!selected) {
            advertisementPropertyType.selectedItem.LinkMainImageId = null;
            advertisementPropertyType.selectedItem.previewImageSrc = null;
            return;
        }
        advertisementPropertyType.selectedItem.LinkMainImageId = node.Id;
        advertisementPropertyType.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            advertisementPropertyType.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);

