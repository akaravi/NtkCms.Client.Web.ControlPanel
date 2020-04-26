app.controller("pollingcategoryCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var pollingcategory = this;
    pollingcategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    pollingcategory.init = function () {
        pollingcategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"pollingcategory/getall", { RowPerPage:1000}, 'POST').success(function (response) {
          
            rashaErManage.checkAction(response);
            pollingcategory.ListItems = response.ListItems;
            pollingcategory.categoryBusyIndicator.isActive = false;
            pollingcategory.gridOptions.fillData(pollingcategory.ListItems);
            pollingcategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            pollingcategory.gridOptions.totalRowCount = response.TotalRowCount;
            pollingcategory.gridOptions.rowPerPage = response.RowPerPage;
         
        }).error(function (data, errCode, c, d) {
            pollingcategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            pollingcategory.categoryBusyIndicator.isActive = false;
        });
    }

   

    pollingcategory.addRequested = false;
    pollingcategory.openAddModal = function () {
        if (buttonIsPressed) { return };

        pollingcategory.modalTitle = 'اضافه';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'pollingcategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            pollingcategory.selectedItem = response.Item;
            //Set dataForTheTree
            pollingContent.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                pollingContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(pollingContent.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModulePolling/pollingCategory/add.html',
                        scope: $scope
                    });
                    pollingContent.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //-----
            //$modal.open({
            //    templateUrl: 'cpanelv1/ModulePolling/pollingCategory/add.html',
            //    scope: $scope
            //});

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    pollingcategory.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        pollingcategory.categoryBusyIndicator.isActive = true;
        pollingcategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'pollingcategory/add',  pollingcategory.selectedItem , 'POST').success(function (response) {
            pollingcategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                pollingcategory.ListItems.unshift(response.Item);
                pollingcategory.gridOptions.fillData(pollingcategory.ListItems);
                pollingcategory.closeModal();
            }
            pollingcategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            pollingcategory.addRequested = false;
        });
    }


    pollingcategory.openEditModal = function () {
        if (buttonIsPressed) { return };
        pollingcategory.modalTitle = 'ویرایش';
        if (!pollingcategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'pollingcategory/GetOne', pollingcategory.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            pollingcategory.selectedItem = response.Item;
            //Set dataForTheTree
            pollingcategory.selectedNode = [];
            pollingcategory.expandedNodes = [];
            pollingcategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                pollingcategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(pollingcategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (pollingcategory.selectedItem.LinkMainImageId > 0)
                        pollingcategory.onSelection({ Id: pollingcategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModulePolling/pollingCategory/edit.html',
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
            //    templateUrl: 'cpanelv1/ModulePolling/pollingCategory/edit.html',
            //    scope: $scope
            //});

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    pollingcategory.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'pollingcategory/', pollingcategory.selectedItem, 'PUT').success(function (response) {
            pollingcategory.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                pollingcategory.addRequested = false;
                pollingcategory.replaceItem(pollingcategory.selectedItem.Id, response.Item);
                pollingcategory.gridOptions.fillData(pollingcategory.ListItems);
                pollingcategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            pollingcategory.addRequested = false;
        });
    }
    

   
    pollingcategory.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        pollingcategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'PollingCategory/edit/', pollingcategory.selectedItem , 'PUT').success(function (response) {
            pollingcategory.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                pollingcategory.addRequested = false;
                pollingcategory.treeConfig.currentNode.Name = response.Item.Name;
                pollingcategory.closeModal();
            }
            pollingcategory.categoryBusyIndicator.isActive = false;

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            pollingcategory.addRequested = false;
            pollingcategory.categoryBusyIndicator.isActive = false;
        });
    }






    pollingcategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    pollingcategory.replaceItem = function (oldId, newItem) {
        angular.forEach(pollingcategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = pollingcategory.ListItems.indexOf(item);
                pollingcategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            pollingcategory.ListItems.unshift(newItem);
    }

    pollingcategory.deleteRow = function () {
        if (buttonIsPressed) { return };

        if (!pollingcategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        pollingcategory.categoryBusyIndicator.isActive = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(pollingcategory.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'pollingcategory/GetOne',  pollingcategory.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    pollingcategory.selectedItemForDelete = response.Item;
                    console.log(pollingcategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'pollingcategory/delete', pollingcategory.selectedItemForDelete, 'POST').success(function (res) {
                        pollingcategory.categoryBusyIndicator.isActive = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            pollingcategory.replaceItem(pollingcategory.selectedItemForDelete.Id);
                            pollingcategory.gridOptions.fillData(pollingcategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        pollingcategory.categoryBusyIndicator.isActive = false;
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });


    }

    pollingcategory.searchData = function () {
        pollingcategory.gridOptions.serachData();
    }

    pollingcategory.LinkPageIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkPageId',
        url: 'UserGroup',
        scope: pollingcategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    pollingcategory.LinkSiteIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkSiteId',
        url: 'UserGroup',
        scope: pollingcategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    pollingcategory.LinkModuleIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkModuleId',
        url: 'UserGroup',
        scope: pollingcategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    pollingcategory.LinkParentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkParentId',
        url: 'PollingCategory',
        scope: pollingcategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}

            ]
        }
    }

    pollingcategory.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' },
            { name: 'LinkPageId.Title', displayName: 'انتخاب صفحه', sortable: true, type: 'link' },
            { name: 'LinkSiteId.Title', displayName: 'انتخاب سایت', sortable: true, type: 'link' },
            { name: 'LinkModuleId.Title', displayName: 'انتخاب ماژول', sortable: true, type: 'link' },
            { name: 'Category.Title', displayName: 'انتخاب شاخه والد', sortable: true, type: 'link' }

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    //pollingcategory.openDateExpireLockAccount = function ($event) {
    //    $event.preventDefault();
    //    $event.stopPropagation();

    //    $timeout(function () {
    //        pollingcategory.focusExpireLockAccount = true;
    //    });
    //};



    pollingcategory.gridOptions.reGetAll = function () {
        pollingcategory.init();
    }
    //TreeControl
    pollingContent.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (pollingContent.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    pollingContent.onNodeToggle = function (node, expanded) {
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

    pollingContent.onSelection = function (node, selected) {
        if (!selected) {
            pollingContent.selectedItem.LinkMainImageId = null;
            pollingContent.selectedItem.previewImageSrc = null;
            return;
        }
        pollingContent.selectedItem.LinkMainImageId = node.Id;
        pollingContent.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            pollingContent.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl

}]);