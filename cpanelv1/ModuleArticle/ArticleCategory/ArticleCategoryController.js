app.controller("articlecategoryCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var articlecategory = this;
    articlecategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    if (itemRecordStatus != undefined) articlecategory.itemRecordStatus = itemRecordStatus;
    articlecategory.init = function () {
        articlecategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"articlecategory/getall", { RowPerPage:1000}, 'POST').success(function (response) {          
            rashaErManage.checkAction(response);
            articlecategory.ListItems = response.ListItems;
            articlecategory.categoryBusyIndicator.isActive = false;
            articlecategory.gridOptions.fillData(articlecategory.ListItems, response.resultAccess);
            articlecategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            articlecategory.gridOptions.totalRowCount = response.TotalRowCount;
            articlecategory.gridOptions.rowPerPage = response.RowPerPage;  
        }).error(function (data, errCode, c, d) {
            articlecategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            articlecategory.categoryBusyIndicator.isActive = false;
        });

        ajax.call(cmsServerConfig.configApiServerPath+'articleCategory/getall', {}, 'POST').success(function (response) {
            articlecategory.ParentList = response.ListItems;
        });
    }

    articlecategory.addRequested = false;
    articlecategory.openAddModal = function () {
        articlecategory.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'articlecategory/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            articlecategory.selectedItem = response.Item;
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
                        templateUrl: 'cpanelv1/ModuleArticle/ArticleCategory/add.html',
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
            //    templateUrl: 'cpanelv1/ModuleArticle/ArticleCategory/add.html',
            //    scope: $scope
            //});

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    articlecategory.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        articlecategory.categoryBusyIndicator.isActive = true;
        articlecategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'articlecategory/add',  articlecategory.selectedItem , 'POST').success(function (response) {
            articlecategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                articlecategory.ListItems.unshift(response.Item);
                articlecategory.gridOptions.fillData(articlecategory.ListItems);
                articlecategory.closeModal();
            }
            articlecategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articlecategory.addRequested = false;
        });
    }

    articlecategory.openEditModal = function () {
        articlecategory.modalTitle = 'ویرایش';
        if (!articlecategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'articlecategory/GetOne', articlecategory.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            articlecategory.selectedItem = response.Item;
            //Set dataForTheTree
            articlecategory.selectedNode = [];
            articlecategory.expandedNodes = [];
            articlecategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                articlecategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(articlecategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (articlecategory.selectedItem.LinkMainImageId > 0)
                        articlecategory.onSelection({ Id: articlecategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/Modulearticle/articleCategory/edit.html',
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
            //    templateUrl: 'cpanelv1/Modulearticle/articleCategory/edit.html',
            //    scope: $scope
            //});

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    articlecategory.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'articlecategory/', articlecategory.selectedItem, 'PUT').success(function (response) {
            articlecategory.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                articlecategory.addRequested = false;
                articlecategory.replaceItem(articlecategory.selectedItem.Id, response.Item);
                articlecategory.gridOptions.fillData(articlecategory.ListItems);
                articlecategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articlecategory.addRequested = false;
        });
    }
     
    articlecategory.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        articlecategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'articleCategory/edit/', articlecategory.selectedItem , 'PUT').success(function (response) {
            articlecategory.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                articlecategory.addRequested = false;
                articlecategory.treeConfig.currentNode.Title = response.Item.Title;
                articlecategory.closeModal();
            }
            articlecategory.categoryBusyIndicator.isActive = false;

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articlecategory.addRequested = false;
            articlecategory.categoryBusyIndicator.isActive = false;
        });
    }

    articlecategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    articlecategory.replaceItem = function (oldId, newItem) {
        angular.forEach(articlecategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = articlecategory.ListItems.indexOf(item);
                articlecategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            articlecategory.ListItems.unshift(newItem);
    }

    articlecategory.deleteRow = function () {
        if (!articlecategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        articlecategory.categoryBusyIndicator.isActive = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(articlecategory.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'articlecategory/GetOne',  articlecategory.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    articlecategory.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'articlecategory/delete', articlecategory.selectedItemForDelete, 'POST').success(function (res) {
                        articlecategory.categoryBusyIndicator.isActive = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            articlecategory.replaceItem(articlecategory.selectedItemForDelete.Id);
                            articlecategory.gridOptions.fillData(articlecategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        articlecategory.categoryBusyIndicator.isActive = false;
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });
    }

    articlecategory.searchData = function () {
        articlecategory.gridOptions.serachData();
    }

    articlecategory.gridOptions = {
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

    //articlecategory.openDateExpireLockAccount = function ($event) {
    //    $event.preventDefault();
    //    $event.stopPropagation();

    //    $timeout(function () {
    //        articlecategory.focusExpireLockAccount = true;
    //    });
    //};

    articlecategory.gridOptions.reGetAll = function () {
        articlecategory.init();
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