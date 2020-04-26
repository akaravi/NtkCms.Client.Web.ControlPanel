app.controller("blogCategoryCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var blogCategory = this;
    blogCategory.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }

    if (itemRecordStatus != undefined) blogCategory.itemRecordStatus = itemRecordStatus;

    blogCategory.init = function () {
        blogCategory.cbusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"blogCategory/getall", { RowPerPage:1000}, 'POST').success(function (response) {
          
            rashaErManage.checkAction(response);
            blogCategory.ListItems = response.ListItems;
            blogCategory.busyIndicator.isActive = false;
            blogCategory.gridOptions.fillData(blogCategory.ListItems);
            blogCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            blogCategory.gridOptions.totalRowCount = response.TotalRowCount;
            blogCategory.gridOptions.rowPerPage = response.RowPerPage;
         
        }).error(function (data, errCode, c, d) {
            blogCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            blogCategory.busyIndicator.isActive = false;
        });
    }


    blogCategory.addRequested = false;
    blogCategory.openAddModal = function () {
        blogCategory.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'blogCategory/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            blogCategory.selectedItem = response.Item;

            //Set dataForTheTree
            blogContent.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                blogContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(blogContent.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleBlog/blogCategory/add.html',
                        scope: $scope
                    });
                    blogContent.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //-----
            //$modal.open({
            //    templateUrl: 'cpanelv1/ModuleArticle/blogCategory/add.html',
            //    scope: $scope
            //});

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    blogCategory.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        blogCategory.busyIndicator.isActive = true;
        blogCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'blogCategory/add',  blogCategory.selectedItem , 'POST').success(function (response) {
            blogCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                blogCategory.ListItems.unshift(response.Item);
                blogCategory.gridOptions.fillData(blogCategory.ListItems);
                blogCategory.closeModal();
                blogCategory.busyIndicator.isActive = false;

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogCategory.addRequested = false;
        });
    }


    blogCategory.openEditModal = function () {
        blogCategory.modalTitle = 'ویرایش';
        if (!blogCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'blogCategory/GetOne', blogCategory.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            blogCategory.selectedItem = response.Item;
            //Set dataForTheTree
            blogCategory.selectedNode = [];
            blogCategory.expandedNodes = [];
            blogCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                blogCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(blogCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (blogCategory.selectedItem.LinkMainImageId > 0)
                        blogCategory.onSelection({ Id: blogCategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleBlog/blogCategory/edit.html',
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
            //    templateUrl: 'cpanelv1/ModuleArticle/blogCategory/edit.html',
            //    scope: $scope
            //});

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    blogCategory.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        blogCategory.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'blogCategory/', blogCategory.selectedItem, 'PUT').success(function (response) {
            blogCategory.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                blogCategory.addRequested = false;
                blogCategory.replaceItem(blogCategory.selectedItem.Id, response.Item);
                blogCategory.gridOptions.fillData(blogCategory.ListItems);
                blogCategory.closeModal();
                blogCategory.busyIndicator.isActive = false;
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogCategory.addRequested = false;
        });
    }
    

   
    blogCategory.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        blogCategory.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'blogCategory/edit/', blogCategory.selectedItem , 'PUT').success(function (response) {
            blogCategory.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                blogCategory.addRequested = false;
                blogCategory.treeConfig.currentNode.Title = response.Item.Title;
                blogCategory.closeModal();
            }
            blogCategory.busyIndicator.isActive = false;

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogCategory.addRequested = false;
            blogCategory.busyIndicator.isActive = false;
        });
    }






    blogCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    blogCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(blogCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = blogCategory.ListItems.indexOf(item);
                blogCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            blogCategory.ListItems.unshift(newItem);
    }

    blogCategory.deleteRow = function () {
        if (!blogCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        blogCategory.busyIndicator.isActive = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(blogCategory.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'blogCategory/GetOne',  blogCategory.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    blogCategory.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'blogCategory/delete', blogCategory.selectedItemForDelete, 'POST').success(function (res) {
                        blogCategory.busyIndicator.isActive = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            blogCategory.replaceItem(blogCategory.selectedItemForDelete.Id);
                            blogCategory.gridOptions.fillData(blogCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        blogCategory.busyIndicator.isActive = false;
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    blogCategory.busyIndicator.isActive = false;
                });
            }
        });


    }

    blogCategory.searchData = function () {
        blogCategory.gridOptions.serachData();
    }

    blogCategory.LinkPageIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkPageId',
        url: 'UserGroup',
        scope: blogCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' }
            ]
        }
    }

    blogCategory.LinkSiteIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkSiteId',
        url: 'UserGroup',
        scope: blogCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' }
            ]
        }
    }
    blogCategory.LinkModuleIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkModuleId',
        url: 'UserGroup',
        scope: blogCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' }
            ]
        }
    }
    blogCategory.LinkParentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkParentId',
        url: 'blogCategory',
        scope: blogCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' }

            ]
        }
    }

    blogCategory.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
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

    //blogCategory.openDateExpireLockAccount = function ($event) {
    //    $event.preventDefault();
    //    $event.stopPropagation();

    //    $timeout(function () {
    //        blogCategory.focusExpireLockAccount = true;
    //    });
    //};



    blogCategory.gridOptions.reGetAll = function () {
        blogCategory.init();
    }
    //TreeControl
    blogCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (blogCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    blogCategory.onNodeToggle = function (node, expanded) {
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

    blogCategory.onSelection = function (node, selected) {
        if (!selected) {
            blogCategory.selectedItem.LinkMainImageId = null;
            blogCategory.selectedItem.previewImageSrc = null;
            return;
        }
        blogCategory.selectedItem.LinkMainImageId = node.Id;
        blogCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            blogCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl

}]);