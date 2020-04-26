app.controller("siteAccDocumentDetailCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var siteAccDocumentDetail = this;
    siteAccDocumentDetail.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    if (itemRecordStatus != undefined) siteAccDocumentDetail.itemRecordStatus = itemRecordStatus;
    siteAccDocumentDetail.init = function () {
        siteAccDocumentDetail.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"siteAccDocumentDetail/getall", { RowPerPage:1000}, 'POST').success(function (response) {
          
            rashaErManage.checkAction(response);
            siteAccDocumentDetail.ListItems = response.ListItems;
            siteAccDocumentDetail.categoryBusyIndicator.isActive = false;
            siteAccDocumentDetail.gridOptions.fillData(siteAccDocumentDetail.ListItems, response.resultAccess);
            siteAccDocumentDetail.gridOptions.currentPageNumber = response.CurrentPageNumber;
            siteAccDocumentDetail.gridOptions.totalRowCount = response.TotalRowCount;
            siteAccDocumentDetail.gridOptions.rowPerPage = response.RowPerPage;
         
        }).error(function (data, errCode, c, d) {
            siteAccDocumentDetail.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            siteAccDocumentDetail.categoryBusyIndicator.isActive = false;
        });
    }

    siteAccDocumentDetail.addRequested = false;
    siteAccDocumentDetail.openAddModal = function () {
        siteAccDocumentDetail.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'siteAccountingDocumentDetail/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            siteAccDocumentDetail.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleService/ServiceCategory/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    siteAccDocumentDetail.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        siteAccDocumentDetail.categoryBusyIndicator.isActive = true;
        siteAccDocumentDetail.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'siteAccountingDocumentDetail/add',  siteAccDocumentDetail.selectedItem , 'POST').success(function (response) {
            siteAccDocumentDetail.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                siteAccDocumentDetail.ListItems.unshift(response.Item);
                siteAccDocumentDetail.gridOptions.fillData(siteAccDocumentDetail.ListItems);
                siteAccDocumentDetail.closeModal();
            }
            siteAccDocumentDetail.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            siteAccDocumentDetail.addRequested = false;
        });
    }

    siteAccDocumentDetail.openEditModal = function () {
        siteAccDocumentDetail.modalTitle = 'ویرایش';
        if (!siteAccDocumentDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'siteAccountingDocumentDetail/GetOne', siteAccDocumentDetail.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            siteAccDocumentDetail.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleService/ServiceCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    siteAccDocumentDetail.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'siteAccountingDocumentDetail/', siteAccDocumentDetail.selectedItem, 'PUT').success(function (response) {
            siteAccDocumentDetail.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                siteAccDocumentDetail.addRequested = false;
                siteAccDocumentDetail.replaceItem(siteAccDocumentDetail.selectedItem.Id, response.Item);
                siteAccDocumentDetail.gridOptions.fillData(siteAccDocumentDetail.ListItems);
                siteAccDocumentDetail.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            siteAccDocumentDetail.addRequested = false;
        });
    }
   
    siteAccDocumentDetail.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        siteAccDocumentDetail.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ServiceCategory/edit/', siteAccDocumentDetail.selectedItem , 'PUT').success(function (response) {
            siteAccDocumentDetail.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                siteAccDocumentDetail.addRequested = false;
                siteAccDocumentDetail.treeConfig.currentNode.Title = response.Item.Title;
                siteAccDocumentDetail.closeModal();
            }
            siteAccDocumentDetail.categoryBusyIndicator.isActive = false;

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            siteAccDocumentDetail.addRequested = false;
            siteAccDocumentDetail.categoryBusyIndicator.isActive = false;
        });
    }

    siteAccDocumentDetail.closeModal = function () {
        $modalStack.dismissAll();
    };

    siteAccDocumentDetail.replaceItem = function (oldId, newItem) {
        angular.forEach(siteAccDocumentDetail.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = siteAccDocumentDetail.ListItems.indexOf(item);
                siteAccDocumentDetail.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            siteAccDocumentDetail.ListItems.unshift(newItem);
    }

    siteAccDocumentDetail.deleteRow = function () {
        if (!siteAccDocumentDetail.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        siteAccDocumentDetail.categoryBusyIndicator.isActive = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(siteAccDocumentDetail.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'siteAccDocumentDetail/GetOne',  siteAccDocumentDetail.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    siteAccDocumentDetail.selectedItemForDelete = response.Item;
                    console.log(siteAccDocumentDetail.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'siteAccDocumentDetail/delete', siteAccDocumentDetail.selectedItemForDelete, 'POST').success(function (res) {
                        siteAccDocumentDetail.categoryBusyIndicator.isActive = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            siteAccDocumentDetail.replaceItem(siteAccDocumentDetail.selectedItemForDelete.Id);
                            siteAccDocumentDetail.gridOptions.fillData(siteAccDocumentDetail.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        siteAccDocumentDetail.categoryBusyIndicator.isActive = false;
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });
    }

    siteAccDocumentDetail.searchData = function () {
        siteAccDocumentDetail.gridOptions.serachData();
    }

    siteAccDocumentDetail.gridOptions = {
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

    siteAccDocumentDetail.gridOptions.reGetAll = function () {
        siteAccDocumentDetail.init();
    }
}]);