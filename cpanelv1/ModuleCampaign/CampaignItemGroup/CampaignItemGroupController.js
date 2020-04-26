app.controller("campaignItemGroupCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var campaignItemGroup = this;
    campaignItemGroup.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    if (itemRecordStatus != undefined) campaignItemGroup.itemRecordStatus = itemRecordStatus;
    campaignItemGroup.init = function () {
        campaignItemGroup.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"CampaignItemGroup/getall",{ RowPerPage:1000}, 'POST').success(function (response) {

            rashaErManage.checkAction(response);
            campaignItemGroup.ListItems = response.ListItems;
            campaignItemGroup.categoryBusyIndicator.isActive = false;
            campaignItemGroup.gridOptions.fillData(campaignItemGroup.ListItems, response.resultAccess);
            campaignItemGroup.gridOptions.currentPageNumber = response.CurrentPageNumber;
            campaignItemGroup.gridOptions.totalRowCount = response.TotalRowCount;
            campaignItemGroup.gridOptions.rowPerPage = response.RowPerPage;

        }).error(function (data, errCode, c, d) {
            campaignItemGroup.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            campaignItemGroup.categoryBusyIndicator.isActive = false;
        });
    }



    campaignItemGroup.addRequested = false;
    campaignItemGroup.openAddModal = function () {
        campaignItemGroup.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'CampaignItemGroup/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            campaignItemGroup.selectedItem = response.Item;
            //Set dataForTheTree
            campaignItem.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                campaignItem.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(campaignItem.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleNews/CampaignItemGroup/add.html',
                        scope: $scope
                    });
                    campaignItem.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //-----
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    campaignItemGroup.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        campaignItemGroup.categoryBusyIndicator.isActive = true;
        campaignItemGroup.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CampaignItemGroup/add', campaignItemGroup.selectedItem, 'POST').success(function (response) {
            campaignItemGroup.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignItemGroup.ListItems.unshift(response.Item);
                campaignItemGroup.gridOptions.fillData(campaignItemGroup.ListItems);
                campaignItemGroup.closeModal();
            }
            campaignItemGroup.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignItemGroup.addRequested = false;
        });
    }


    campaignItemGroup.openEditModal = function () {
        campaignItemGroup.modalTitle = 'ویرایش';
        if (!campaignItemGroup.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'CampaignItemGroup/GetOne', campaignItemGroup.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            campaignItemGroup.selectedItem = response.Item;
            //Set dataForTheTree
            campaignItemGroup.selectedNode = [];
            campaignItemGroup.expandedNodes = [];
            campaignItemGroup.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                campaignItemGroup.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(campaignItemGroup.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (campaignItemGroup.selectedItem.LinkMainImageId > 0)
                        campaignItemGroup.onSelection({ Id: campaignItemGroup.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleNews/CampaignItemGroup/edit.html',
                        scope: $scope
                    });
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //---
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    campaignItemGroup.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'CampaignItemGroup/', campaignItemGroup.selectedItem, 'PUT').success(function (response) {
            campaignItemGroup.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignItemGroup.addRequested = false;
                campaignItemGroup.replaceItem(campaignItemGroup.selectedItem.Id, response.Item);
                campaignItemGroup.gridOptions.fillData(campaignItemGroup.ListItems);
                campaignItemGroup.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignItemGroup.addRequested = false;
        });
    }



    campaignItemGroup.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        campaignItemGroup.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CampaignItemGroup/edit/', campaignItemGroup.selectedItem, 'PUT').success(function (response) {
            campaignItemGroup.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignItemGroup.addRequested = false;
                campaignItemGroup.treeConfig.currentNode.Title = response.Item.Title;
                campaignItemGroup.closeModal();
            }
            campaignItemGroup.categoryBusyIndicator.isActive = false;

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignItemGroup.addRequested = false;
            campaignItemGroup.categoryBusyIndicator.isActive = false;
        });
    }






    campaignItemGroup.closeModal = function () {
        $modalStack.dismissAll();
    };

    campaignItemGroup.replaceItem = function (oldId, newItem) {
        angular.forEach(campaignItemGroup.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = campaignItemGroup.ListItems.indexOf(item);
                campaignItemGroup.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            campaignItemGroup.ListItems.unshift(newItem);
    }

    campaignItemGroup.deleteRow = function () {
        if (!campaignItemGroup.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        campaignItemGroup.categoryBusyIndicator.isActive = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(campaignItemGroup.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'CampaignItemGroup/GetOne', campaignItemGroup.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    campaignItemGroup.selectedItemForDelete = response.Item;
                    console.log(campaignItemGroup.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'CampaignItemGroup/delete', campaignItemGroup.selectedItemForDelete, 'POST').success(function (res) {
                        campaignItemGroup.categoryBusyIndicator.isActive = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            campaignItemGroup.replaceItem(campaignItemGroup.selectedItemForDelete.Id);
                            campaignItemGroup.gridOptions.fillData(campaignItemGroup.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        campaignItemGroup.categoryBusyIndicator.isActive = false;
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });


    }

    campaignItemGroup.searchData = function () {
        campaignItemGroup.gridOptions.serachData();
    }

    campaignItemGroup.LinkPageIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkPageId',
        url: 'UserGroup',
        scope: campaignItemGroup,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    campaignItemGroup.LinkSiteIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkSiteId',
        url: 'UserGroup',
        scope: campaignItemGroup,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    campaignItemGroup.LinkModuleIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkModuleId',
        url: 'UserGroup',
        scope: campaignItemGroup,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' }
            ]
        }
    }
    campaignItemGroup.LinkParentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkParentId',
        url: 'campaignItemGroup',
        scope: campaignItemGroup,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' }

            ]
        }
    }

    campaignItemGroup.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' },
            { name: 'LinkPageId.Title', displayName: 'انتخاب صفحه', sortable: true, type: 'link', displayForce: true },
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

    campaignItemGroup.gridOptions.reGetAll = function () {
        campaignItemGroup.init();
    }

    //TreeControl
    campaignItem.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (campaignItem.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    campaignItem.onNodeToggle = function (node, expanded) {
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

    campaignItem.onSelection = function (node, selected) {
        if (!selected) {
            campaignItem.selectedItem.LinkMainImageId = null;
            campaignItem.selectedItem.previewImageSrc = null;
            return;
        }
        campaignItem.selectedItem.LinkMainImageId = node.Id;
        campaignItem.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            campaignItem.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl

}]);