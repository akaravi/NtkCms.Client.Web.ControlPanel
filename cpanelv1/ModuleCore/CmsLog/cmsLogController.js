app.controller("cmsLogController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var cmsLog = this;
    var listforDel=[];
    cmsLog.init = function () {
        //cmsLog.LoadingBusyIndicator.isActive = true;
        var engine = {};
        try {
            engine = cmsLog.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        ajax.call(cmsServerConfig.configApiServerPath+"CoreLogError/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
        angular.forEach( response.ListItems, function (item, key) {
                item.isChecked=false
            });    
        cmsLog.ListItems = response.ListItems;
    
            cmsLog.gridOptions.fillData(cmsLog.ListItems , response.resultAccess);
            cmsLog.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsLog.gridOptions.totalRowCount = response.TotalRowCount;
            cmsLog.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            cmsLog.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    cmsLog.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsLog.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsLog.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsLog.ListItems.indexOf(item);
                cmsLog.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsLog.ListItems.unshift(newItem);
    }

cmsLog.deleteAllRow = function () {
    var filterModelparam = { Filters: [] };
      filterModelparam.Filters.push({
        PropertyName: "Id",
        SearchType: 3,
        IntValue1: 0,
      });
      ajax
        .call(cmsServerConfig.configApiServerPath + "CoreLogError/getall", filterModelparam, "POST")
        .success(function(response1) {
            cmsLog.ListItems=response1.ListItems;
            angular.forEach( cmsLog.ListItems, function (item, key) {
                item.isChecked=true;
                listforDel.push(item.Id);
            });
            cmsLog.deleteSelectRow();
        })
        .error(function(data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    //$window.location.reload();
}
cmsLog.deleteSelectRow = function () {
  angular.forEach( cmsLog.ListItems, function (item, key) {
             if(item.isChecked==true)
                {
                 listforDel.push(item.Id);
                }
            });
cmsLog.listforDel=listforDel;
        if (cmsLog.listforDel==null) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(cmsLog.gridOptions.selectedRow.item);
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreLogError/DeleteList',cmsLog.listforDel , 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            //cmsLog.replaceItem(cmsLog.selectedItemForDelete.Id);
                            cmsLog.gridOptions.fillData(cmsLog.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                    });
            }
        });


    }

    cmsLog.deleteRow = function () {
        if (!cmsLog.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(cmsLog.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'CoreLogError/GetOne', cmsLog.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsLog.selectedItemForDelete = response.Item;
                    console.log(cmsLog.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreLogError/delete', cmsLog.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsLog.replaceItem(cmsLog.selectedItemForDelete.Id);
                            cmsLog.gridOptions.fillData(cmsLog.ListItems);
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

    cmsLog.searchData = function () {
        cmsLog.gridOptions.serachData();
    }

    cmsLog.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
            { name: 'CurrentSiteId', displayName: 'کد سیستمی سایت', sortable: true },
            { name: 'LogDescription', displayName: 'توضیح', sortable: true },
            { name: 'ErrorMessage', displayName: 'پیام خطا', sortable: true, isDate: true },
            { name: 'ErrorType', displayName: 'نوع خطا', sortable: true },
            { name: 'Module', displayName: 'ماژول', sortable: true },
            { name: 'isChecked', displayName: 'حذف لاگ', sortable: true, template: '<input id="DeleteLog{{x.Id}}" type="checkbox"  ng-model="x.isChecked" />' }
            //{ name: 'LinkLinkUserTypeId.LinkUserType', displayName: 'نوع کاربر', sortable: true },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    cmsLog.gridOptions.advancedSearchData = {};
    cmsLog.gridOptions.advancedSearchData.engine = {};
    cmsLog.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    cmsLog.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    cmsLog.gridOptions.advancedSearchData.engine.SortType = 1;
    cmsLog.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    cmsLog.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    cmsLog.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    cmsLog.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    cmsLog.gridOptions.advancedSearchData.engine.Filters = [];

    
    cmsLog.openDateRequestDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            cmsLog.focusRequestDate = true;
        });
    };

    cmsLog.gridOptions.reGetAll = function () {
        cmsLog.init();
    }
    //Export Report 
    cmsLog.exportFile = function () {
        cmsLog.addRequested = true;
        cmsLog.gridOptions.advancedSearchData.engine.ExportFile = cmsLog.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreLogError/exportfile', cmsLog.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            cmsLog.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsLog.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //cmsLog.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    cmsLog.toggleExportForm = function () {
        cmsLog.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        cmsLog.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        cmsLog.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        cmsLog.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        cmsLog.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCore/cmsLog/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    cmsLog.rowCountChanged = function () {
        if (!angular.isDefined(cmsLog.ExportFileClass.RowCount) || cmsLog.ExportFileClass.RowCount > 5000)
            cmsLog.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    cmsLog.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"CoreLogError/count", cmsLog.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            cmsLog.addRequested = false;
            rashaErManage.checkAction(response);
            cmsLog.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            cmsLog.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);