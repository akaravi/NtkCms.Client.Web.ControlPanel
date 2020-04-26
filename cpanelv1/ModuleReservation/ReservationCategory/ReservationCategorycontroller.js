app.controller("reservationcategoryCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var reservationcategory = this;
    reservationcategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    if (itemRecordStatus != undefined) reservationcategory.itemRecordStatus = itemRecordStatus;
    reservationcategory.init = function () {
        reservationcategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"reservationcategory/getall", { RowPerPage:1000}, 'POST').success(function (response) {

            rashaErManage.checkAction(response);
            reservationcategory.ListItems = response.ListItems;
            reservationcategory.categoryBusyIndicator.isActive = false;
            reservationcategory.gridOptions.fillData(reservationcategory.ListItems, response.resultAccess);
            reservationcategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            reservationcategory.gridOptions.totalRowCount = response.TotalRowCount;
            reservationcategory.gridOptions.rowPerPage = response.RowPerPage;

        }).error(function (data, errCode, c, d) {
            reservationcategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            reservationcategory.categoryBusyIndicator.isActive = false;
        });
    }



    reservationcategory.addRequested = false;
    reservationcategory.openAddModal = function () {
        reservationcategory.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'reservationcategory/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            reservationcategory.selectedItem = response.Item;
            //Set dataForTheTree
            reservationContent.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                reservationContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(reservationContent.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/Modulereservation/reservationCategory/add.html',
                        scope: $scope
                    });
                    reservationContent.addRequested = false;
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
    reservationcategory.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        reservationcategory.categoryBusyIndicator.isActive = true;
        reservationcategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'reservationcategory/add', reservationcategory.selectedItem, 'POST').success(function (response) {
            reservationcategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                reservationcategory.ListItems.unshift(response.Item);
                reservationcategory.gridOptions.fillData(reservationcategory.ListItems);
                reservationcategory.closeModal();
            }
            reservationcategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            reservationcategory.addRequested = false;
        });
    }


    reservationcategory.openEditModal = function () {
        reservationcategory.modalTitle = 'ویرایش';
        if (!reservationcategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'reservationcategory/GetOne', reservationcategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            reservationcategory.selectedItem = response.Item;
            //Set dataForTheTree
            reservationcategory.selectedNode = [];
            reservationcategory.expandedNodes = [];
            reservationcategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                reservationcategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(reservationcategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (reservationcategory.selectedItem.LinkMainImageId > 0)
                        reservationcategory.onSelection({ Id: reservationcategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/Modulereservation/reservationCategory/edit.html',
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
    reservationcategory.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'reservationcategory/', reservationcategory.selectedItem, 'PUT').success(function (response) {
            reservationcategory.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                reservationcategory.addRequested = false;
                reservationcategory.replaceItem(reservationcategory.selectedItem.Id, response.Item);
                reservationcategory.gridOptions.fillData(reservationcategory.ListItems);
                reservationcategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            reservationcategory.addRequested = false;
        });
    }



    reservationcategory.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        reservationcategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'reservationCategory/edit/', reservationcategory.selectedItem, 'PUT').success(function (response) {
            reservationcategory.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                reservationcategory.addRequested = false;
                reservationcategory.treeConfig.currentNode.Title = response.Item.Title;
                reservationcategory.closeModal();
            }
            reservationcategory.categoryBusyIndicator.isActive = false;

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            reservationcategory.addRequested = false;
            reservationcategory.categoryBusyIndicator.isActive = false;
        });
    }






    reservationcategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    reservationcategory.replaceItem = function (oldId, newItem) {
        angular.forEach(reservationcategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = reservationcategory.ListItems.indexOf(item);
                reservationcategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            reservationcategory.ListItems.unshift(newItem);
    }

    reservationcategory.deleteRow = function () {
        if (!reservationcategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        reservationcategory.categoryBusyIndicator.isActive = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(reservationcategory.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'reservationcategory/GetOne', reservationcategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    reservationcategory.selectedItemForDelete = response.Item;
                    console.log(reservationcategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'reservationcategory/delete', reservationcategory.selectedItemForDelete, 'POST').success(function (res) {
                        reservationcategory.categoryBusyIndicator.isActive = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            reservationcategory.replaceItem(reservationcategory.selectedItemForDelete.Id);
                            reservationcategory.gridOptions.fillData(reservationcategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        reservationcategory.categoryBusyIndicator.isActive = false;
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });


    }

    reservationcategory.searchData = function () {
        reservationcategory.gridOptions.serachData();
    }

    reservationcategory.LinkPageIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkPageId',
        url: 'UserGroup',
        scope: reservationcategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: "string"}
            ]
        }
    }

    reservationcategory.LinkSiteIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkSiteId',
        url: 'UserGroup',
        scope: reservationcategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: "string"}
            ]
        }
    }
    reservationcategory.LinkModuleIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkModuleId',
        url: 'UserGroup',
        scope: reservationcategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: "string"}
            ]
        }
    }
    reservationcategory.LinkParentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkParentId',
        url: 'reservationCategory',
        scope: reservationcategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: "string" }

            ]
        }
    }

    reservationcategory.gridOptions = {
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

    reservationcategory.gridOptions.reGetAll = function () {
        reservationcategory.init();
    }

    //TreeControl
    reservationContent.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (reservationContent.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    reservationContent.onNodeToggle = function (node, expanded) {
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

    reservationContent.onSelection = function (node, selected) {
        if (!selected) {
            reservationContent.selectedItem.LinkMainImageId = null;
            reservationContent.selectedItem.previewImageSrc = null;
            return;
        }
        reservationContent.selectedItem.LinkMainImageId = node.Id;
        reservationContent.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            reservationContent.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl

}]);