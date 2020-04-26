app.controller("biographycategoryCtrl", 
["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter',
 function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) 
 {
    var biographycategory = this;
    biographycategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    if (itemRecordStatus != undefined) biographycategory.itemRecordStatus = itemRecordStatus;
    biographycategory.init = function () {
        biographycategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"biographycategory/getall", { RowPerPage:1000}, 'POST').success(function (response) {
          
            rashaErManage.checkAction(response);
            biographycategory.ListItems = response.ListItems;
            biographycategory.categoryBusyIndicator.isActive = false;
            biographycategory.gridOptions.fillData(biographycategory.ListItems, response.resultAccess);
            biographycategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            biographycategory.gridOptions.totalRowCount = response.TotalRowCount;
            biographycategory.gridOptions.rowPerPage = response.RowPerPage;
         
        }).error(function (data, errCode, c, d) {
            biographycategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            biographycategory.categoryBusyIndicator.isActive = false;
        });
    }

   

    biographycategory.addRequested = false;
    biographycategory.openAddModal = function () {
        biographycategory.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'biographycategory/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            biographycategory.selectedItem = response.Item;
            //Set dataForTheTree
            biographyContent.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                biographyContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(biographyContent.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/Modulebiography/biographyCategory/add.html',
                        scope: $scope
                    });
                    biographyContent.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //-----
            //$modal.open({
            //    templateUrl: 'cpanelv1/Modulebiography/biographyCategory/add.html',
            //    scope: $scope
            //});

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    biographycategory.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        biographycategory.categoryBusyIndicator.isActive = true;
        biographycategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'biographycategory/add',  biographycategory.selectedItem , 'POST').success(function (response) {
            biographycategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                biographycategory.ListItems.unshift(response.Item);
                biographycategory.gridOptions.fillData(biographycategory.ListItems);
                biographycategory.closeModal();
            }
            biographycategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographycategory.addRequested = false;
        });
    }

    

    biographycategory.EditCategoryModel = function () {
        biographycategory.modalTitle = 'ویرایش';
        if (!biographycategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'biographycategory/GetOne', biographycategory.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            biographycategory.selectedItem = response.Item;
            //Set dataForTheTree
            biographyContent.selectedNode = [];
            biographyContent.expandedNodes = [];
            biographyContent.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                biographyContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(biographyContent.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (biographyContent.selectedItem.LinkMainImageId > 0)
                        biographyContent.onSelection({ Id: biographyContent.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/Modulebiography/biographyCategory/edit.html',
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
            //    templateUrl: 'cpanelv1/Modulebiography/biographyCategory/edit.html',
            //    scope: $scope
            //});

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    biographycategory.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'biographycategory/', biographycategory.selectedItem, 'PUT').success(function (response) {
            biographycategory.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                biographycategory.addRequested = false;
                biographycategory.replaceItem(biographycategory.selectedItem.Id, response.Item);
                biographycategory.gridOptions.fillData(biographycategory.ListItems);
                biographycategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographycategory.addRequested = false;
        });
    }
    

   
    biographycategory.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        biographycategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'biographyCategory/edit/', biographycategory.selectedItem , 'PUT').success(function (response) {
            biographycategory.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                biographycategory.addRequested = false;
                biographycategory.treeConfig.currentNode.Title = response.Item.Title;
                biographycategory.closeModal();
            }
            biographycategory.categoryBusyIndicator.isActive = false;

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographycategory.addRequested = false;
            biographycategory.categoryBusyIndicator.isActive = false;
        });
    }



    biographycategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    biographycategory.replaceItem = function (oldId, newItem) {
        angular.forEach(biographycategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = biographycategory.ListItems.indexOf(item);
                biographycategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            biographycategory.ListItems.unshift(newItem);
    }

    biographycategory.deleteRow = function () {
        if (!biographycategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        biographycategory.categoryBusyIndicator.isActive = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(biographycategory.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'biographycategory/GetOne',  biographycategory.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    biographycategory.selectedItemForDelete = response.Item;
                    console.log(biographycategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'biographycategory/delete', biographycategory.selectedItemForDelete, 'POST').success(function (res) {
                        biographycategory.categoryBusyIndicator.isActive = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            biographycategory.replaceItem(biographycategory.selectedItemForDelete.Id);
                            biographycategory.gridOptions.fillData(biographycategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        biographycategory.categoryBusyIndicator.isActive = false;
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });


    }

    biographycategory.searchData = function () {
        biographycategory.gridOptions.serachData();
    }

    biographycategory.LinkPageIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkPageId',
        url: 'UserGroup',
        scope: biographycategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    biographycategory.LinkSiteIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkSiteId',
        url: 'UserGroup',
        scope: biographycategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    biographycategory.LinkModuleIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkModuleId',
        url: 'UserGroup',
        scope: biographycategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    biographycategory.LinkParentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkParentId',
        url: 'biographyCategory',
        scope: biographycategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}

            ]
        }
    }

    biographycategory.gridOptions = {
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

    //biographycategory.openDateExpireLockAccount = function ($event) {
    //    $event.preventDefault();
    //    $event.stopPropagation();

    //    $timeout(function () {
    //        biographycategory.focusExpireLockAccount = true;
    //    });
    //};



    biographycategory.gridOptions.reGetAll = function () {
        biographycategory.init();
    }
    //TreeControl
    biographyContent.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (biographyContent.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    biographyContent.onNodeToggle = function (node, expanded) {
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

    biographyContent.onSelection = function (node, selected) {
        if (!selected) {
            biographyContent.selectedItem.LinkMainImageId = null;
            biographyContent.selectedItem.previewImageSrc = null;
            return;
        }
        biographyContent.selectedItem.LinkMainImageId = node.Id;
        biographyContent.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            biographyContent.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl

}]);