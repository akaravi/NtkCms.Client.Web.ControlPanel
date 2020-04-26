app.controller("dbCategoryCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var dbCategory = this;
    dbCategory.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }

    if (itemRecordStatus != undefined) dbCategory.itemRecordStatus = itemRecordStatus;

    dbCategory.init = function () {
        dbCategory.cbusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"dbCategory/getall", { RowPerPage:1000}, 'POST').success(function (response) {
          
            rashaErManage.checkAction(response);
            dbCategory.ListItems = response.ListItems;
            dbCategory.busyIndicator.isActive = false;
            dbCategory.gridOptions.fillData(dbCategory.ListItems);
            dbCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            dbCategory.gridOptions.totalRowCount = response.TotalRowCount;
            dbCategory.gridOptions.rowPerPage = response.RowPerPage;
         
        }).error(function (data, errCode, c, d) {
            dbCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            dbCategory.busyIndicator.isActive = false;
        });
    }


    dbCategory.addRequested = false;
    dbCategory.openAddModal = function () {
        dbCategory.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'dbCategory/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            dbCategory.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleArticle/dbCategory/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    dbCategory.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        dbCategory.busyIndicator.isActive = true;
        dbCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'dbCategory/add',  dbCategory.selectedItem , 'POST').success(function (response) {
            dbCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                dbCategory.ListItems.unshift(response.Item);
                dbCategory.gridOptions.fillData(dbCategory.ListItems);
                dbCategory.closeModal();
                dbCategory.busyIndicator.isActive = false;

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            dbCategory.addRequested = false;
        });
    }


    dbCategory.openEditModal = function () {
        dbCategory.modalTitle = 'ویرایش';
        if (!dbCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'dbCategory/GetOne', dbCategory.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            dbCategory.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleArticle/dbCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    dbCategory.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        dbCategory.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'dbCategory/', dbCategory.selectedItem, 'PUT').success(function (response) {
            dbCategory.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                dbCategory.addRequested = false;
                dbCategory.replaceItem(dbCategory.selectedItem.Id, response.Item);
                dbCategory.gridOptions.fillData(dbCategory.ListItems);
                dbCategory.closeModal();
                dbCategory.busyIndicator.isActive = false;
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            dbCategory.addRequested = false;
        });
    }
    

   
    dbCategory.editItem = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        dbCategory.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'dbCategory/edit/', dbCategory.selectedItem , 'PUT').success(function (response) {
            dbCategory.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                dbCategory.addRequested = false;
                dbCategory.treeConfig.currentNode.Title = response.Item.Title;
                dbCategory.closeModal();
            }
            dbCategory.busyIndicator.isActive = false;

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            dbCategory.addRequested = false;
            dbCategory.busyIndicator.isActive = false;
        });
    }






    dbCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    dbCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(dbCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = dbCategory.ListItems.indexOf(item);
                dbCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            dbCategory.ListItems.unshift(newItem);
    }

    dbCategory.deleteRow = function () {
        if (!dbCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        dbCategory.busyIndicator.isActive = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(dbCategory.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'dbCategory/GetOne',  dbCategory.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    dbCategory.selectedItemForDelete = response.Item;
                    console.log(dbCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'dbCategory/delete', dbCategory.selectedItemForDelete, 'POST').success(function (res) {
                        dbCategory.busyIndicator.isActive = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            dbCategory.replaceItem(dbCategory.selectedItemForDelete.Id);
                            dbCategory.gridOptions.fillData(dbCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        dbCategory.busyIndicator.isActive = false;
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    dbCategory.busyIndicator.isActive = false;
                });
            }
        });


    }

    dbCategory.searchData = function () {
        dbCategory.gridOptions.serachData();
    }

    dbCategory.LinkPageIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkPageId',
        url: 'UserGroup',
        scope: dbCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: "string" }
            ]
        }
    }

    dbCategory.LinkSiteIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkSiteId',
        url: 'UserGroup',
        scope: dbCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: "string" }
            ]
        }
    }
    dbCategory.LinkModuleIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkModuleId',
        url: 'UserGroup',
        scope: dbCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: "string"}
            ]
        }
    }
    dbCategory.LinkParentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkParentId',
        url: 'dbCategory',
        scope: dbCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: "string"}

            ]
        }
    }

    dbCategory.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true,  type: 'integer' },
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

    dbCategory.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            dbCategory.focusExpireLockAccount = true;
        });
    };



    dbCategory.gridOptions.reGetAll = function () {
        dbCategory.init();
    }

}]);