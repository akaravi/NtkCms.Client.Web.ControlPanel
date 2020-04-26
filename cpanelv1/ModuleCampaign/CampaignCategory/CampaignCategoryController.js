app.controller("campaignCategoryCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var campaignCategory = this;
    campaignCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    if (itemRecordStatus != undefined) campaignCategory.itemRecordStatus = itemRecordStatus;
    campaignCategory.init = function () {
        campaignCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"campaignCategory/getall", { RowPerPage:1000}, 'POST').success(function (response) {

            rashaErManage.checkAction(response);
            campaignCategory.ListItems = response.ListItems;
            campaignCategory.categoryBusyIndicator.isActive = false;
            campaignCategory.gridOptions.fillData(campaignCategory.ListItems, response.resultAccess);
            campaignCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            campaignCategory.gridOptions.totalRowCount = response.TotalRowCount;
            campaignCategory.gridOptions.rowPerPage = response.RowPerPage;

        }).error(function (data, errCode, c, d) {
            campaignCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            campaignCategory.categoryBusyIndicator.isActive = false;
        });
    }



    campaignCategory.addRequested = false;
    campaignCategory.openAddModal = function () {
        campaignCategory.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'campaignCategory/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            campaignCategory.selectedItem = response.Item;
            //Set dataForTheTree
            campaignContent.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                campaignContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(campaignContent.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleCampaign/campaignCategory/add.html',
                        scope: $scope
                    });
                    campaignContent.addRequested = false;
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
    campaignCategory.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        campaignCategory.categoryBusyIndicator.isActive = true;
        campaignCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'campaignCategory/add', campaignCategory.selectedItem, 'POST').success(function (response) {
            campaignCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignCategory.ListItems.unshift(response.Item);
                campaignCategory.gridOptions.fillData(campaignCategory.ListItems);
                campaignCategory.closeModal();
            }
            campaignCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignCategory.addRequested = false;
        });
    }


    campaignCategory.openEditModal = function () {
        campaignCategory.modalTitle = 'ویرایش';
        if (!campaignCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'campaignCategory/GetOne', campaignCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            campaignCategory.selectedItem = response.Item;
            //Set dataForTheTree
            campaignCategory.selectedNode = [];
            campaignCategory.expandedNodes = [];
            campaignCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                campaignCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(campaignCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (campaignCategory.selectedItem.LinkMainImageId > 0)
                        campaignCategory.onSelection({ Id: campaignCategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleCampaign/campaignCategory/edit.html',
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
    campaignCategory.editRow = function (frm) {
        if (frm.$invalid)
         {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'campaignCategory/', campaignCategory.selectedItem, 'PUT').success(function (response) {
            campaignCategory.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignCategory.addRequested = false;
                campaignCategory.replaceItem(campaignCategory.selectedItem.Id, response.Item);
                campaignCategory.gridOptions.fillData(campaignCategory.ListItems);
                campaignCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignCategory.addRequested = false;
        });
    }



    campaignCategory.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        campaignCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'campaignCategory/edit/', campaignCategory.selectedItem, 'PUT').success(function (response) {
            campaignCategory.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignCategory.addRequested = false;
                campaignCategory.treeConfig.currentNode.Title = response.Item.Title;
                campaignCategory.closeModal();
            }
            campaignCategory.categoryBusyIndicator.isActive = false;

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignCategory.addRequested = false;
            campaignCategory.categoryBusyIndicator.isActive = false;
        });
    }






    campaignCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    campaignCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(campaignCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = campaignCategory.ListItems.indexOf(item);
                campaignCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            campaignCategory.ListItems.unshift(newItem);
    }

    campaignCategory.deleteRow = function () {
        if (!campaignCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        campaignCategory.categoryBusyIndicator.isActive = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(campaignCategory.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'campaignCategory/GetOne', campaignCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    campaignCategory.selectedItemForDelete = response.Item;
                    console.log(campaignCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'campaignCategory/delete', campaignCategory.selectedItemForDelete, 'POST').success(function (res) {
                        campaignCategory.categoryBusyIndicator.isActive = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            campaignCategory.replaceItem(campaignCategory.selectedItemForDelete.Id);
                            campaignCategory.gridOptions.fillData(campaignCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        campaignCategory.categoryBusyIndicator.isActive = false;
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });


    }

    campaignCategory.searchData = function () {
        campaignCategory.gridOptions.serachData();
    }

    campaignCategory.LinkPageIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkPageId',
        url: 'UserGroup',
        scope: campaignCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true , type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    campaignCategory.LinkSiteIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkSiteId',
        url: 'UserGroup',
        scope: campaignCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    campaignCategory.LinkModuleIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkModuleId',
        url: 'UserGroup',
        scope: campaignCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    campaignCategory.LinkParentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkParentId',
        url: 'campaignCategory',
        scope: campaignCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' }

            ]
        }
    }

    campaignCategory.gridOptions = {
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

    campaignCategory.gridOptions.reGetAll = function () {
        campaignCategory.init();
    }

    //TreeControl
    campaignContent.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (campaignContent.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    campaignContent.onNodeToggle = function (node, expanded) {
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

    campaignContent.onSelection = function (node, selected) {
        if (!selected) {
            campaignContent.selectedItem.LinkMainImageId = null;
            campaignContent.selectedItem.previewImageSrc = null;
            return;
        }
        campaignContent.selectedItem.LinkMainImageId = node.Id;
        campaignContent.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            campaignContent.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl

}]);