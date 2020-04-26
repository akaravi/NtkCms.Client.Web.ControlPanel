app.controller("cmsUserBadLoginController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var cmdUserBadLogin = this;
    cmdUserBadLogin.init = function () {
        var engine = {};
        try {
            engine = cmdUserBadLogin.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }
        ajax.call(cmsServerConfig.configApiServerPath+"CoreUserBadLogin/getall", cmdUserBadLogin.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmdUserBadLogin.ListItems = response.ListItems;
            cmdUserBadLogin.gridOptions.fillData(cmdUserBadLogin.ListItems ,  response.resultAccess);
            cmdUserBadLogin.gridOptions.currentPageNumber = response.CurrentPageNumber+1;
            cmdUserBadLogin.gridOptions.totalRowCount = response.TotalRowCount;
            cmdUserBadLogin.gridOptions.rowPerPage = response.RowPerPage;
            cmdUserBadLogin.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            cmdUserBadLogin.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmdUserBadLogin.addRequested = false;
    cmdUserBadLogin.openAddModal = function () {
        cmdUserBadLogin.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'CoreUserBadLogin/GetViewModel', '', 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmdUserBadLogin.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsUserBadLogin/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    cmdUserBadLogin.addNewRow = function (frm) {
	if (frm.$invalid)
            return;
        cmdUserBadLogin.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreUserBadLogin/add', cmdUserBadLogin.selectedItem , 'POST').success(function (response) {
            cmdUserBadLogin.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmdUserBadLogin.ListItems.unshift(response.Item);
                cmdUserBadLogin.gridOptions.fillData(cmdUserBadLogin.ListItems);
                cmdUserBadLogin.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmdUserBadLogin.addRequested = false;
        });
    }


    cmdUserBadLogin.openEditModal=function() {
        cmdUserBadLogin.modalTitle = 'ویرایش';
        if (!cmdUserBadLogin.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'CoreUserBadLogin/GetOne', cmdUserBadLogin.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmdUserBadLogin.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsUserBadLogin/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    cmdUserBadLogin.editRow = function (frm) {
	if (frm.$invalid)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreUserBadLogin/edit',  cmdUserBadLogin.selectedItem , 'PUT').success(function (response) {
            cmdUserBadLogin.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmdUserBadLogin.addRequested = false;
                cmdUserBadLogin.replaceItem(cmdUserBadLogin.selectedItem.Id, response.Item);
                cmdUserBadLogin.gridOptions.fillData(cmdUserBadLogin.ListItems);
                cmdUserBadLogin.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmdUserBadLogin.addRequested = false;
        });
    }

    cmdUserBadLogin.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmdUserBadLogin.replaceItem = function (oldId, newItem) {
        angular.forEach(cmdUserBadLogin.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmdUserBadLogin.ListItems.indexOf(item);
                cmdUserBadLogin.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmdUserBadLogin.ListItems.unshift(newItem);
    }

    cmdUserBadLogin.deleteRow = function () {
        if (!cmdUserBadLogin.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(cmdUserBadLogin.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'CoreUserBadLogin/GetOne', cmdUserBadLogin.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    cmdUserBadLogin.selectedItemForDelete = response.Item;
                    console.log(cmdUserBadLogin.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreUserBadLogin/delete', cmdUserBadLogin.selectedItemForDelete , 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmdUserBadLogin.replaceItem(cmdUserBadLogin.selectedItemForDelete.Id);
                            cmdUserBadLogin.gridOptions.fillData(cmdUserBadLogin.ListItems);
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

    cmdUserBadLogin.searchData=function() {
        cmdUserBadLogin.gridOptions.serachData();
    }

cmdUserBadLogin.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'DeviceId', displayName: 'شناسه دستگاه', sortable: true, type: 'string' },
            { name: 'RequestDate', displayName: 'تاریخ ثبت', sortable: true, isDate: true, type: 'date' },
            { name: 'UsedUsername', displayName: 'نام کاربری بکارگرفته شده', sortable: true, type: 'string' },
            { name: 'UsedPwd', displayName: 'کلمه عبور', sortable: true, type: 'string' },
            { name: 'LinkUserId.Title', displayName: 'کاربر سیستم', sortable: true, type: 'link',displayForce:true },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    cmdUserBadLogin.openDateRequestDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            cmdUserBadLogin.focusRequestDate = true;
        });
    };

   cmdUserBadLogin.gridOptions.reGetAll = function () {
        cmdUserBadLogin.init();
    }
   //Export Report 
   cmdUserBadLogin.exportFile = function () {
       cmdUserBadLogin.addRequested = true;
       cmdUserBadLogin.gridOptions.advancedSearchData.engine.ExportFile = cmdUserBadLogin.ExportFileClass;
       ajax.call(cmsServerConfig.configApiServerPath+'CoreUserBadLogin/exportfile', cmdUserBadLogin.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
           cmdUserBadLogin.addRequested = false;
           rashaErManage.checkAction(response);
           if (response.IsSuccess) {
               cmdUserBadLogin.exportDownloadLink = window.location.origin + response.LinkFile;
               $window.open(response.LinkFile, '_blank');
               //cmdUserBadLogin.closeModal();
           }
       }).error(function (data, errCode, c, d) {
           rashaErManage.checkAction(data, errCode);
       });
   }
   //Open Export Report Modal
   cmdUserBadLogin.toggleExportForm = function () {
       cmdUserBadLogin.SortType = [
           { key: 'نزولی', value: 0 },
           { key: 'صعودی', value: 1 },
           { key: 'تصادفی', value: 3 }
       ];
       cmdUserBadLogin.EnumExportFileType = [
           { key: 'Excel', value: 1 },
           { key: 'PDF', value: 2 },
           { key: 'Text', value: 3 }
       ];
       cmdUserBadLogin.EnumExportReceiveMethod = [
           { key: 'دانلود', value: 0 },
           { key: 'ایمیل', value: 1 },
           { key: 'فایل منیجر', value: 3 }
       ];
       cmdUserBadLogin.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
       cmdUserBadLogin.exportDownloadLink = null;
       $modal.open({
           templateUrl: 'cpanelv1/ModuleCore/CmsUserBadLogin/report.html',
           scope: $scope
       });
   }
   //Row Count Export Input Change
   cmdUserBadLogin.rowCountChanged = function () {
       if (!angular.isDefined(cmdUserBadLogin.ExportFileClass.RowCount) || cmdUserBadLogin.ExportFileClass.RowCount > 5000)
           cmdUserBadLogin.ExportFileClass.RowCount = 5000;
   }
   //Get TotalRowCount
   cmdUserBadLogin.getCount = function () {
       ajax.call(cmsServerConfig.configApiServerPath+"CoreUserBadLogin/count", cmdUserBadLogin.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
           cmdUserBadLogin.addRequested = false;
           rashaErManage.checkAction(response);
           cmdUserBadLogin.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
       }).error(function (data, errCode, c, d) {
           cmdUserBadLogin.gridOptions.fillData();
           rashaErManage.checkAction(data, errCode);
       });
   }
}]);