app.controller("cmsPageTemplateGridCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var cmsPageTemplategrd = this;
    if (itemRecordStatus != undefined) cmsPageTemplategrd.itemRecordStatus = itemRecordStatus;
    cmsPageTemplategrd.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"WebDesignerMainPageTemplate/getall", cmsPageTemplategrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsPageTemplategrd.ListItems = response.ListItems;
            cmsPageTemplategrd.gridOptions.fillData(cmsPageTemplategrd.ListItems,response.resultAccess);
            cmsPageTemplategrd.gridOptions.currentPageNumber = response.CurrentPageNumber+1;
            cmsPageTemplategrd.gridOptions.totalRowCount = response.TotalRowCount;
            cmsPageTemplategrd.gridOptions.rowPerPage = response.RowPerPage;
            cmsPageTemplategrd.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            cmsPageTemplategrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsPageTemplategrd.addRequested = false;
    cmsPageTemplategrd.openAddModal = function () {
        cmsPageTemplategrd.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPageTemplate/GetViewModel', '', 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsPageTemplategrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsPageTemplate/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsPageTemplategrd.addNewRow = function (frm) {
	if (frm.$invalid)
            return;

        cmsPageTemplategrd.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPageTemplate/add', cmsPageTemplategrd.selectedItem, 'POST').success(function (response) {
            cmsPageTemplategrd.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsPageTemplategrd.ListItems.unshift(response.Item);
                cmsPageTemplategrd.gridOptions.fillData(cmsPageTemplategrd.ListItems);
                cmsPageTemplategrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsPageTemplategrd.addRequested = false;
        });
    }

    cmsPageTemplategrd.openEditModal=function() {
        cmsPageTemplategrd.modalTitle = 'ویرایش';
        if (!cmsPageTemplategrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPageTemplate/GetOne',  cmsPageTemplategrd.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsPageTemplategrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsPageTemplate/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsPageTemplategrd.editRow = function (frm) {
	if (frm.$invalid)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPageTemplate/edit', cmsPageTemplategrd.selectedItem , 'PUT').success(function (response) {
            cmsPageTemplategrd.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsPageTemplategrd.addRequested = false;
                cmsPageTemplategrd.replaceItem(cmsPageTemplategrd.selectedItem.Id, response.Item);
                cmsPageTemplategrd.gridOptions.fillData(cmsPageTemplategrd.ListItems);
                cmsPageTemplategrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsPageTemplategrd.addRequested = false;
        });
    }


    cmsPageTemplategrd.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsPageTemplategrd.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsPageTemplategrd.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsPageTemplategrd.ListItems.indexOf(item);
                cmsPageTemplategrd.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsPageTemplategrd.ListItems.unshift(newItem);
    }

    cmsPageTemplategrd.deleteRow = function () {
        if (!cmsPageTemplategrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPageTemplate/GetOne', cmsPageTemplategrd.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsPageTemplategrd.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPageTemplate/delete',  cmsPageTemplategrd.selectedItemForDelete , 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsPageTemplategrd.replaceItem(cmsPageTemplategrd.selectedItemForDelete.Id);
                            cmsPageTemplategrd.gridOptions.fillData(cmsPageTemplategrd.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });


    }

    cmsPageTemplategrd.searchData=function() {
        cmsPageTemplategrd.gridOptions.serachData();
    }

//   cmsPageTemplategrd.linkSiteIdSelector = {
//        displayMember: 'Title',
//        id: 'Id',
//        fId: 'LinkLinkSiteIdId',
//        url: 'LinkSiteId',
//        scope: cmsPageTemplategrd,
//        columnOptions: {
//            columns: [
//                { name: 'Id', displayName: 'کد سیستمی', sortable: true },
//                { name: 'Title', displayName: 'عنوان', sortable: true }
//            ]
//        }
//    }

//cmsPageTemplategrd.linkLayoutIdSelector = {
//        displayMember: 'Title',
//        id: 'Id',
//        fId: 'LinkLinkLayoutIdId',
//        url: 'LinkLayoutId',
//        scope: cmsPageTemplategrd,
//        columnOptions: {
//            columns: [
//                { name: 'Id', displayName: 'کد سیستمی', sortable: true },
//                { name: 'Title', displayName: 'عنوان', sortable: true }
//            ]
//        }
//    }

cmsPageTemplategrd.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان قالب', sortable: true },
            { name: 'Folder', displayName: 'نام فولدر', sortable: true },
            { name: 'IndexFile', displayName: 'فایل ایندکس', sortable: true },

            
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }




   cmsPageTemplategrd.gridOptions.reGetAll = function () {
        cmsPageTemplategrd.init();
    }

}]);