
app.controller("ServicecategoryCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var Servicecategory = this;
    Servicecategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    if (itemRecordStatus != undefined) Servicecategory.itemRecordStatus = itemRecordStatus;
    Servicecategory.init = function () {
        Servicecategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"Servicecategory/getall", { RowPerPage:1000}, 'POST').success(function (response) {
          
            rashaErManage.checkAction(response);
            Servicecategory.ListItems = response.ListItems;
            Servicecategory.categoryBusyIndicator.isActive = false;
            Servicecategory.gridOptions.fillData(Servicecategory.ListItems, response.resultAccess);
            Servicecategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            Servicecategory.gridOptions.totalRowCount = response.TotalRowCount;
            Servicecategory.gridOptions.rowPerPage = response.RowPerPage;
         
        }).error(function (data, errCode, c, d) {
            Servicecategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            Servicecategory.categoryBusyIndicator.isActive = false;
        });
    }

   

    Servicecategory.addRequested = false;
    Servicecategory.openAddModal = function () {
        Servicecategory.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'Servicecategory/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            Servicecategory.selectedItem = response.Item;
            //Set dataForTheTree
            serviceContent.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                serviceContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(serviceContent.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleService/ServiceCategory/add.html',
                        scope: $scope
                    });
                    serviceContent.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //-----
            //$modal.open({
            //    templateUrl: 'cpanelv1/ModuleService/ServiceCategory/add.html',
            //    scope: $scope
            //});

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    Servicecategory.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        Servicecategory.categoryBusyIndicator.isActive = true;
        Servicecategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'Servicecategory/add',  Servicecategory.selectedItem , 'POST').success(function (response) {
            Servicecategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                Servicecategory.ListItems.unshift(response.Item);
                Servicecategory.gridOptions.fillData(Servicecategory.ListItems);
                Servicecategory.closeModal();
            }
            Servicecategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            Servicecategory.addRequested = false;
        });
    }


    Servicecategory.openEditModal = function () {
        Servicecategory.modalTitle = 'ویرایش';
        if (!Servicecategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'Servicecategory/GetOne', Servicecategory.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            Servicecategory.selectedItem = response.Item;
            //Set dataForTheTree
            Servicecategory.selectedNode = [];
            Servicecategory.expandedNodes = [];
            Servicecategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                Servicecategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(Servicecategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (Servicecategory.selectedItem.LinkMainImageId > 0)
                        Servicecategory.onSelection({ Id: Servicecategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleService/ServiceCategory/edit.html',
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
            //    templateUrl: 'cpanelv1/ModuleService/ServiceCategory/edit.html',
            //    scope: $scope
            //});

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    Servicecategory.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'Servicecategory/', Servicecategory.selectedItem, 'PUT').success(function (response) {
            Servicecategory.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                Servicecategory.addRequested = false;
                Servicecategory.replaceItem(Servicecategory.selectedItem.Id, response.Item);
                Servicecategory.gridOptions.fillData(Servicecategory.ListItems);
                Servicecategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            Servicecategory.addRequested = false;
        });
    }
    

   
    Servicecategory.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        Servicecategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ServiceCategory/edit/', Servicecategory.selectedItem , 'PUT').success(function (response) {
            Servicecategory.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                Servicecategory.addRequested = false;
                Servicecategory.treeConfig.currentNode.Title = response.Item.Title;
                Servicecategory.closeModal();
            }
            Servicecategory.categoryBusyIndicator.isActive = false;

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            Servicecategory.addRequested = false;
            Servicecategory.categoryBusyIndicator.isActive = false;
        });
    }






    Servicecategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    Servicecategory.replaceItem = function (oldId, newItem) {
        angular.forEach(Servicecategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = Servicecategory.ListItems.indexOf(item);
                Servicecategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            Servicecategory.ListItems.unshift(newItem);
    }

    Servicecategory.deleteRow = function () {
        if (!Servicecategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        Servicecategory.categoryBusyIndicator.isActive = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(Servicecategory.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'Servicecategory/GetOne',  Servicecategory.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    Servicecategory.selectedItemForDelete = response.Item;
                    console.log(Servicecategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'Servicecategory/delete', Servicecategory.selectedItemForDelete, 'POST').success(function (res) {
                        Servicecategory.categoryBusyIndicator.isActive = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            Servicecategory.replaceItem(Servicecategory.selectedItemForDelete.Id);
                            Servicecategory.gridOptions.fillData(Servicecategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        Servicecategory.categoryBusyIndicator.isActive = false;
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });


    }

    Servicecategory.searchData = function () {
        Servicecategory.gridOptions.serachData();
    }

    Servicecategory.LinkPageIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkPageId',
        url: 'UserGroup',
        scope: Servicecategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    Servicecategory.LinkSiteIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkSiteId',
        url: 'UserGroup',
        scope: Servicecategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    Servicecategory.LinkModuleIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkModuleId',
        url: 'UserGroup',
        scope: Servicecategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    Servicecategory.LinkParentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkParentId',
        url: 'ServiceCategory',
        scope: Servicecategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}

            ]
        }
    }

    Servicecategory.gridOptions = {
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

    //Servicecategory.openDateExpireLockAccount = function ($event) {
    //    $event.preventDefault();
    //    $event.stopPropagation();

    //    $timeout(function () {
    //        Servicecategory.focusExpireLockAccount = true;
    //    });
    //};



    Servicecategory.gridOptions.reGetAll = function () {
        Servicecategory.init();
    }
    //TreeControl
    serviceContent.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (serviceContent.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    serviceContent.onNodeToggle = function (node, expanded) {
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

    serviceContent.onSelection = function (node, selected) {
        if (!selected) {
            serviceContent.selectedItem.LinkMainImageId = null;
            serviceContent.selectedItem.previewImageSrc = null;
            return;
        }
        serviceContent.selectedItem.LinkMainImageId = node.Id;
        serviceContent.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            serviceContent.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl

}]);