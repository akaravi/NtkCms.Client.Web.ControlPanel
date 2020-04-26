
app.controller("ProductcategoryCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var Productcategory = this;
    Productcategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    if (itemRecordStatus != undefined) Productcategory.itemRecordStatus = itemRecordStatus;
    Productcategory.init = function () {
        Productcategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"Productcategory/getall", { RowPerPage:1000}, 'POST').success(function (response) {
          
            rashaErManage.checkAction(response);
            Productcategory.ListItems = response.ListItems;
            Productcategory.categoryBusyIndicator.isActive = false;
            Productcategory.gridOptions.fillData(Productcategory.ListItems, response.resultAccess);
            Productcategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            Productcategory.gridOptions.totalRowCount = response.TotalRowCount;
            Productcategory.gridOptions.rowPerPage = response.RowPerPage;
         
        }).error(function (data, errCode, c, d) {
            Productcategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            Productcategory.categoryBusyIndicator.isActive = false;
        });
    }

   

    Productcategory.addRequested = false;
    Productcategory.openAddModal = function () {
        Productcategory.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'Productcategory/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            Productcategory.selectedItem = response.Item;
            //Set dataForTheTree
            productContent.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                productContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(productContent.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleProduct/ProductCategory/add.html',
                        scope: $scope
                    });
                    productContent.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //-----
            //$modal.open({
            //    templateUrl: 'cpanelv1/ModuleProduct/ProductCategory/add.html',
            //    scope: $scope
            //});

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    Productcategory.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        Productcategory.categoryBusyIndicator.isActive = true;
        Productcategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'Productcategory/add',  Productcategory.selectedItem , 'POST').success(function (response) {
            Productcategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                Productcategory.ListItems.unshift(response.Item);
                Productcategory.gridOptions.fillData(Productcategory.ListItems);
                Productcategory.closeModal();
            }
            Productcategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            Productcategory.addRequested = false;
        });
    }


    Productcategory.openEditModal = function () {
        Productcategory.modalTitle = 'ویرایش';
        if (!Productcategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'Productcategory/GetOne', Productcategory.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            Productcategory.selectedItem = response.Item;
            //Set dataForTheTree
            Productcategory.selectedNode = [];
            Productcategory.expandedNodes = [];
            Productcategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                Productcategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(Productcategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (Productcategory.selectedItem.LinkMainImageId > 0)
                        Productcategory.onSelection({ Id: Productcategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleProduct/ProductCategory/edit.html',
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
            //    templateUrl: 'cpanelv1/ModuleProduct/ProductCategory/edit.html',
            //    scope: $scope
            //});

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    Productcategory.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'Productcategory/', Productcategory.selectedItem, 'PUT').success(function (response) {
            Productcategory.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                Productcategory.addRequested = false;
                Productcategory.replaceItem(Productcategory.selectedItem.Id, response.Item);
                Productcategory.gridOptions.fillData(Productcategory.ListItems);
                Productcategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            Productcategory.addRequested = false;
        });
    }
    

   
    Productcategory.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        Productcategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ProductCategory/edit/', Productcategory.selectedItem , 'PUT').success(function (response) {
            Productcategory.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                Productcategory.addRequested = false;
                Productcategory.treeConfig.currentNode.Title = response.Item.Title;
                Productcategory.closeModal();
            }
            Productcategory.categoryBusyIndicator.isActive = false;

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            Productcategory.addRequested = false;
            Productcategory.categoryBusyIndicator.isActive = false;
        });
    }






    Productcategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    Productcategory.replaceItem = function (oldId, newItem) {
        angular.forEach(Productcategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = Productcategory.ListItems.indexOf(item);
                Productcategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            Productcategory.ListItems.unshift(newItem);
    }

    Productcategory.deleteRow = function () {
        if (!Productcategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        Productcategory.categoryBusyIndicator.isActive = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(Productcategory.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'Productcategory/GetOne',  Productcategory.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    Productcategory.selectedItemForDelete = response.Item;
                    console.log(Productcategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'Productcategory/delete', Productcategory.selectedItemForDelete, 'POST').success(function (res) {
                        Productcategory.categoryBusyIndicator.isActive = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            Productcategory.replaceItem(Productcategory.selectedItemForDelete.Id);
                            Productcategory.gridOptions.fillData(Productcategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        Productcategory.categoryBusyIndicator.isActive = false;
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });


    }

    Productcategory.searchData = function () {
        Productcategory.gridOptions.serachData();
    }

    Productcategory.LinkPageIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkPageId',
        url: 'UserGroup',
        scope: Productcategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    Productcategory.LinkSiteIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkSiteId',
        url: 'UserGroup',
        scope: Productcategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    Productcategory.LinkModuleIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkModuleId',
        url: 'UserGroup',
        scope: Productcategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    Productcategory.LinkParentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkParentId',
        url: 'ProductCategory',
        scope: Productcategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}

            ]
        }
    }

    Productcategory.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' },
            { name: 'LinkPageId.Title', displayName: 'انتخاب صفحه', sortable: true, type: 'link' ,displayForce:true },
            { name: 'LinkSiteId.Title', displayName: 'انتخاب سایت', sortable: true, type: 'link', displayForce: true },
            { name: 'LinkModuleId.Title', displayName: 'انتخاب ماژول', sortable: true, type: 'link', displayForce: true },
            { name: 'Category.Title', displayName: 'انتخاب شاخه والد', sortable: true, type: 'link', displayForce: true }

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    //Productcategory.openDateExpireLockAccount = function ($event) {
    //    $event.preventDefault();
    //    $event.stopPropagation();

    //    $timeout(function () {
    //        Productcategory.focusExpireLockAccount = true;
    //    });
    //};



    Productcategory.gridOptions.reGetAll = function () {
        Productcategory.init();
    }
    //TreeControl
    productContent.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (productContent.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    productContent.onNodeToggle = function (node, expanded) {
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

    productContent.onSelection = function (node, selected) {
        if (!selected) {
            productContent.selectedItem.LinkMainImageId = null;
            productContent.selectedItem.previewImageSrc = null;
            return;
        }
        productContent.selectedItem.LinkMainImageId = node.Id;
        productContent.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            productContent.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl

}]);