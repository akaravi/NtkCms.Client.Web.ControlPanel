app.controller("linkManagementCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var linkManagementCategory = this;
    linkManagementCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    if (itemRecordStatus != undefined) linkManagementCategory.itemRecordStatus = itemRecordStatus;
    linkManagementCategory.init = function () {
        linkManagementCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"linkManagementCategory/getall", { RowPerPage:1000}, 'POST').success(function (response) {          
            rashaErManage.checkAction(response);
            linkManagementCategory.ListItems = response.ListItems;
            linkManagementCategory.categoryBusyIndicator.isActive = false;
            linkManagementCategory.gridOptions.fillData(linkManagementCategory.ListItems, response.resultAccess);
            linkManagementCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            linkManagementCategory.gridOptions.totalRowCount = response.TotalRowCount;
            linkManagementCategory.gridOptions.rowPerPage = response.RowPerPage;  
        }).error(function (data, errCode, c, d) {
            linkManagementCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            linkManagementCategory.categoryBusyIndicator.isActive = false;
        });

        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementCategory/getall', {}, 'POST').success(function (response) {
            linkManagementCategory.ParentList = response.ListItems;
        });
    }

    linkManagementCategory.addRequested = false;
    linkManagementCategory.openAddModal = function () {
        linkManagementCategory.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementCategory/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementCategory.selectedItem = response.Item;
            //Set dataForTheTree
            articleContent.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                articleContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(articleContent.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleArticle/linkManagementCategory/add.html',
                        scope: $scope
                    });
                    articleContent.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //-----
            //$modal.open({
            //    templateUrl: 'cpanelv1/ModuleArticle/linkManagementCategory/add.html',
            //    scope: $scope
            //});

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    linkManagementCategory.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        linkManagementCategory.categoryBusyIndicator.isActive = true;
        linkManagementCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementCategory/add',  linkManagementCategory.selectedItem , 'POST').success(function (response) {
            linkManagementCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                linkManagementCategory.ListItems.unshift(response.Item);
                linkManagementCategory.gridOptions.fillData(linkManagementCategory.ListItems);
                linkManagementCategory.closeModal();
            }
            linkManagementCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            linkManagementCategory.addRequested = false;
        });
    }

    linkManagementCategory.openEditModal = function () {
        linkManagementCategory.modalTitle = 'ویرایش';
        if (!linkManagementCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementCategory/GetOne', linkManagementCategory.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            linkManagementCategory.selectedItem = response.Item;
            //Set dataForTheTree
            linkManagementCategory.selectedNode = [];
            linkManagementCategory.expandedNodes = [];
            linkManagementCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                linkManagementCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(linkManagementCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (linkManagementCategory.selectedItem.LinkMainImageId > 0)
                        linkManagementCategory.onSelection({ Id: linkManagementCategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/Modulearticle/linkManagementCategory/edit.html',
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
            //    templateUrl: 'cpanelv1/Modulearticle/linkManagementCategory/edit.html',
            //    scope: $scope
            //});

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    linkManagementCategory.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementCategory/', linkManagementCategory.selectedItem, 'PUT').success(function (response) {
            linkManagementCategory.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                linkManagementCategory.addRequested = false;
                linkManagementCategory.replaceItem(linkManagementCategory.selectedItem.Id, response.Item);
                linkManagementCategory.gridOptions.fillData(linkManagementCategory.ListItems);
                linkManagementCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            linkManagementCategory.addRequested = false;
        });
    }
     
    linkManagementCategory.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        linkManagementCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'linkManagementCategory/edit/', linkManagementCategory.selectedItem , 'PUT').success(function (response) {
            linkManagementCategory.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                linkManagementCategory.addRequested = false;
                linkManagementCategory.treeConfig.currentNode.Title = response.Item.Title;
                linkManagementCategory.closeModal();
            }
            linkManagementCategory.categoryBusyIndicator.isActive = false;

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            linkManagementCategory.addRequested = false;
            linkManagementCategory.categoryBusyIndicator.isActive = false;
        });
    }

    linkManagementCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    linkManagementCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(linkManagementCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = linkManagementCategory.ListItems.indexOf(item);
                linkManagementCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            linkManagementCategory.ListItems.unshift(newItem);
    }

    linkManagementCategory.deleteRow = function () {
        if (!linkManagementCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        linkManagementCategory.categoryBusyIndicator.isActive = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(linkManagementCategory.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'linkManagementCategory/GetOne',  linkManagementCategory.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    linkManagementCategory.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'linkManagementCategory/delete', linkManagementCategory.selectedItemForDelete, 'POST').success(function (res) {
                        linkManagementCategory.categoryBusyIndicator.isActive = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            linkManagementCategory.replaceItem(linkManagementCategory.selectedItemForDelete.Id);
                            linkManagementCategory.gridOptions.fillData(linkManagementCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        linkManagementCategory.categoryBusyIndicator.isActive = false;
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });
    }

    linkManagementCategory.searchData = function () {
        linkManagementCategory.gridOptions.serachData();
    }

    linkManagementCategory.gridOptions = {
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

    //linkManagementCategory.openDateExpireLockAccount = function ($event) {
    //    $event.preventDefault();
    //    $event.stopPropagation();

    //    $timeout(function () {
    //        linkManagementCategory.focusExpireLockAccount = true;
    //    });
    //};

    linkManagementCategory.gridOptions.reGetAll = function () {
        linkManagementCategory.init();
    }
    //TreeControl
    articleContent.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (articleContent.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    articleContent.onNodeToggle = function (node, expanded) {
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

    articleContent.onSelection = function (node, selected) {
        if (!selected) {
            articleContent.selectedItem.LinkMainImageId = null;
            articleContent.selectedItem.previewImageSrc = null;
            return;
        }
        articleContent.selectedItem.LinkMainImageId = node.Id;
        articleContent.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            articleContent.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);