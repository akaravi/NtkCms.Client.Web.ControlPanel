app.controller("newscategoryCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var newscategory = this;
    newscategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    if (itemRecordStatus != undefined) newscategory.itemRecordStatus = itemRecordStatus;
    newscategory.init = function () {
        newscategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"newscategory/getall", { RowPerPage:1000}, 'POST').success(function (response) {

            rashaErManage.checkAction(response);
            newscategory.ListItems = response.ListItems;
            newscategory.categoryBusyIndicator.isActive = false;
            newscategory.gridOptions.fillData(newscategory.ListItems, response.resultAccess);
            newscategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            newscategory.gridOptions.totalRowCount = response.TotalRowCount;
            newscategory.gridOptions.rowPerPage = response.RowPerPage;

        }).error(function (data, errCode, c, d) {
            newscategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            newscategory.categoryBusyIndicator.isActive = false;
        });
    }



    newscategory.addRequested = false;
    newscategory.openAddModal = function () {
        newscategory.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'newscategory/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            newscategory.selectedItem = response.Item;
            //Set dataForTheTree
            newsContent.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                newsContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(newsContent.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleNews/NewsCategory/add.html',
                        scope: $scope
                    });
                    newsContent.addRequested = false;
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
    newscategory.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        newscategory.categoryBusyIndicator.isActive = true;
        newscategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'newscategory/add', newscategory.selectedItem, 'POST').success(function (response) {
            newscategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                newscategory.ListItems.unshift(response.Item);
                newscategory.gridOptions.fillData(newscategory.ListItems);
                newscategory.closeModal();
            }
            newscategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newscategory.addRequested = false;
        });
    }


    newscategory.openEditModal = function () {
        newscategory.modalTitle = 'ویرایش';
        if (!newscategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'newscategory/GetOne', newscategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            newscategory.selectedItem = response.Item;
            //Set dataForTheTree
            newscategory.selectedNode = [];
            newscategory.expandedNodes = [];
            newscategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                newscategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(newscategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (newscategory.selectedItem.LinkMainImageId > 0)
                        newscategory.onSelection({ Id: newscategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleNews/NewsCategory/edit.html',
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
    newscategory.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'newscategory/', newscategory.selectedItem, 'PUT').success(function (response) {
            newscategory.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                newscategory.addRequested = false;
                newscategory.replaceItem(newscategory.selectedItem.Id, response.Item);
                newscategory.gridOptions.fillData(newscategory.ListItems);
                newscategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newscategory.addRequested = false;
        });
    }



    newscategory.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        newscategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'NewsCategory/edit/', newscategory.selectedItem, 'PUT').success(function (response) {
            newscategory.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                newscategory.addRequested = false;
                newscategory.treeConfig.currentNode.Title = response.Item.Title;
                newscategory.closeModal();
            }
            newscategory.categoryBusyIndicator.isActive = false;

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newscategory.addRequested = false;
            newscategory.categoryBusyIndicator.isActive = false;
        });
    }






    newscategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    newscategory.replaceItem = function (oldId, newItem) {
        angular.forEach(newscategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = newscategory.ListItems.indexOf(item);
                newscategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            newscategory.ListItems.unshift(newItem);
    }

    newscategory.deleteRow = function () {
        if (!newscategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        newscategory.categoryBusyIndicator.isActive = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(newscategory.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'newscategory/GetOne', newscategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    newscategory.selectedItemForDelete = response.Item;
                    console.log(newscategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'newscategory/delete', newscategory.selectedItemForDelete, 'POST').success(function (res) {
                        newscategory.categoryBusyIndicator.isActive = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            newscategory.replaceItem(newscategory.selectedItemForDelete.Id);
                            newscategory.gridOptions.fillData(newscategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        newscategory.categoryBusyIndicator.isActive = false;
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });


    }

    newscategory.searchData = function () {
        newscategory.gridOptions.serachData();
    }

    newscategory.LinkPageIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkPageId',
        url: 'UserGroup',
        scope: newscategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: "string"}
            ]
        }
    }

    newscategory.LinkSiteIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkSiteId',
        url: 'UserGroup',
        scope: newscategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: "string"}
            ]
        }
    }
    newscategory.LinkModuleIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkModuleId',
        url: 'UserGroup',
        scope: newscategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: "string"}
            ]
        }
    }
    newscategory.LinkParentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkParentId',
        url: 'NewsCategory',
        scope: newscategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: "string" }

            ]
        }
    }

    newscategory.gridOptions = {
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

    newscategory.gridOptions.reGetAll = function () {
        newscategory.init();
    }

    //TreeControl
    newsContent.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (newsContent.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    newsContent.onNodeToggle = function (node, expanded) {
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

    newsContent.onSelection = function (node, selected) {
        if (!selected) {
            newsContent.selectedItem.LinkMainImageId = null;
            newsContent.selectedItem.previewImageSrc = null;
            return;
        }
        newsContent.selectedItem.LinkMainImageId = node.Id;
        newsContent.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            newsContent.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl

}]);