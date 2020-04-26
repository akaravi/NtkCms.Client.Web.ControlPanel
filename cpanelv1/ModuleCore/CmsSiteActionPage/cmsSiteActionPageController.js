app.controller("cmsSiteActionPageGridCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var cmsSiteActionPagegrd = this;
    if (itemRecordStatus != undefined) cmsSiteActionPagegrd.itemRecordStatus = itemRecordStatus;
    cmsSiteActionPagegrd.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"coreSiteActionPage/getall", cmsSiteActionPagegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSiteActionPagegrd.ListItems = response.ListItems;
            cmsSiteActionPagegrd.gridOptions.fillData(cmsSiteActionPagegrd.ListItems,response.resultAccess);
            cmsSiteActionPagegrd.gridOptions.currentPageNumber = response.CurrentPageNumber+1;
            cmsSiteActionPagegrd.gridOptions.totalRowCount = response.TotalRowCount;
            cmsSiteActionPagegrd.gridOptions.rowPerPage = response.RowPerPage;
            cmsSiteActionPagegrd.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            cmsSiteActionPagegrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsSiteActionPagegrd.addRequested = false;
    cmsSiteActionPagegrd.openAddModal = function () {
        cmsSiteActionPagegrd.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'cmsSiteActionPage/GetViewModel', '', 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSiteActionPagegrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsSiteActionPage/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmsSiteActionPagegrd.addNewRow = function (frm) {
	if (frm.$invalid)
            return;

        cmsSiteActionPagegrd.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'cmsSiteActionPage/add',  cmsSiteActionPagegrd.selectedItem , 'POST').success(function (response) {
            cmsSiteActionPagegrd.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsSiteActionPagegrd.ListItems.unshift(response.Item);
                cmsSiteActionPagegrd.gridOptions.fillData(cmsSiteActionPagegrd.ListItems);
                cmsSiteActionPagegrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsSiteActionPagegrd.addRequested = false;
        });
    }


    cmsSiteActionPagegrd.openEditModal=function() {
        cmsSiteActionPagegrd.modalTitle = 'ویرایش';
        if (!cmsSiteActionPagegrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'cmsSiteActionPage/GetOne',  cmsSiteActionPagegrd.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSiteActionPagegrd.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsSiteActionPage/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmsSiteActionPagegrd.editRow = function (frm) {
	if (frm.$invalid)
            return;

        ajax.call(cmsServerConfig.configApiServerPath+'cmsSiteActionPage/edit', cmsSiteActionPagegrd.selectedItem , 'PUT').success(function (response) {
            cmsSiteActionPagegrd.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsSiteActionPagegrd.addRequested = false;
                cmsSiteActionPagegrd.replaceItem(cmsSiteActionPagegrd.selectedItem.Id, response.Item);
                cmsSiteActionPagegrd.gridOptions.fillData(cmsSiteActionPagegrd.ListItems);
                cmsSiteActionPagegrd.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsSiteActionPagegrd.addRequested = false;
        });
    }


    cmsSiteActionPagegrd.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsSiteActionPagegrd.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsSiteActionPagegrd.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsSiteActionPagegrd.ListItems.indexOf(item);
                cmsSiteActionPagegrd.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsSiteActionPagegrd.ListItems.unshift(newItem);
    }

    cmsSiteActionPagegrd.deleteRow = function () {
        if (!cmsSiteActionPagegrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                ajax.call(cmsServerConfig.configApiServerPath+'cmsSiteActionPage/GetOne', cmsSiteActionPagegrd.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsSiteActionPagegrd.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'cmsSiteActionPage/delete', cmsSiteActionPagegrd.selectedItemForDelete , 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsSiteActionPagegrd.replaceItem(cmsSiteActionPagegrd.selectedItemForDelete.Id);
                            cmsSiteActionPagegrd.gridOptions.fillData(cmsSiteActionPagegrd.ListItems);
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

    cmsSiteActionPagegrd.searchData=function() {
        cmsSiteActionPagegrd.gridOptions.serachData();
    }

   cmsSiteActionPagegrd.linkSiteIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkLinkSiteIdId',
        url: 'LinkSiteId',
        scope: cmsSiteActionPagegrd,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

cmsSiteActionPagegrd.linkPageIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkLinkPageIdId',
        url: 'LinkPageId',
        scope: cmsSiteActionPagegrd,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

cmsSiteActionPagegrd.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
            { name: 'LinkSiteId.Title', displayName: 'انتخاب سایت', sortable: true ,displayForce:true},
            { name: 'LinkPageId.Title', displayName: 'انتخاب صفحه', sortable: true, displayForce: true },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }




   cmsSiteActionPagegrd.gridOptions.reGetAll = function () {
        cmsSiteActionPagegrd.init();
    }

}]);