app.controller("coreIdentityUserLoginController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var coreIdentityUserLogin = this;
    var listforDel=[];
    coreIdentityUserLogin.init = function () {
        //coreIdentityUserLogin.LoadingBusyIndicator.isActive = true;
        var engine = {};
        try {
            engine = coreIdentityUserLogin.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        ajax.call(cmsServerConfig.configApiServerPath+"coreIdentityUserLogin/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
        angular.forEach( response.ListItems, function (item, key) {
                item.isChecked=false
            });    
        coreIdentityUserLogin.ListItems = response.ListItems;
    
            coreIdentityUserLogin.gridOptions.fillData(coreIdentityUserLogin.ListItems , response.resultAccess);
            coreIdentityUserLogin.gridOptions.currentPageNumber = response.CurrentPageNumber;
            coreIdentityUserLogin.gridOptions.totalRowCount = response.TotalRowCount;
            coreIdentityUserLogin.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            coreIdentityUserLogin.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    coreIdentityUserLogin.closeModal = function () {
        $modalStack.dismissAll();
    };

    coreIdentityUserLogin.replaceItem = function (oldId, newItem) {
        angular.forEach(coreIdentityUserLogin.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = coreIdentityUserLogin.ListItems.indexOf(item);
                coreIdentityUserLogin.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            coreIdentityUserLogin.ListItems.unshift(newItem);
    }

coreIdentityUserLogin.deleteAllRow = function () {
    var filterModelparam = { Filters: [] };
      filterModelparam.Filters.push({
        PropertyName: "Id",
        SearchType: 3,
        IntValue1: 0,
      });
      ajax
        .call(cmsServerConfig.configApiServerPath + "coreIdentityUserLogin/getall", filterModelparam, "POST")
        .success(function(response1) {
            coreIdentityUserLogin.ListItems=response1.ListItems;
            angular.forEach( coreIdentityUserLogin.ListItems, function (item, key) {
                item.isChecked=true;
                listforDel.push(item.Id);
            });
            coreIdentityUserLogin.deleteSelectRow();
        })
        .error(function(data, errCode, c, d) {
          rashaErManage.checkAction(data, errCode);
        });
    //$window.location.reload();
}
coreIdentityUserLogin.deleteSelectRow = function () {
  angular.forEach( coreIdentityUserLogin.ListItems, function (item, key) {
             if(item.isChecked==true)
                {
                 listforDel.push(item.Id);
                }
            });
coreIdentityUserLogin.listforDel=listforDel;
        if (coreIdentityUserLogin.listforDel==null) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(coreIdentityUserLogin.gridOptions.selectedRow.item);
                    ajax.call(cmsServerConfig.configApiServerPath+'coreIdentityUserLogin/DeleteList',coreIdentityUserLogin.listforDel , 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            //coreIdentityUserLogin.replaceItem(coreIdentityUserLogin.selectedItemForDelete.Id);
                            coreIdentityUserLogin.gridOptions.fillData(coreIdentityUserLogin.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                    });
            }
        });


    }

    coreIdentityUserLogin.deleteRow = function () {
        if (!coreIdentityUserLogin.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(coreIdentityUserLogin.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'coreIdentityUserLogin/GetOne', coreIdentityUserLogin.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    coreIdentityUserLogin.selectedItemForDelete = response.Item;
                    console.log(coreIdentityUserLogin.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'coreIdentityUserLogin/delete', coreIdentityUserLogin.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            coreIdentityUserLogin.replaceItem(coreIdentityUserLogin.selectedItemForDelete.Id);
                            coreIdentityUserLogin.gridOptions.fillData(coreIdentityUserLogin.ListItems);
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

    coreIdentityUserLogin.searchData = function () {
        coreIdentityUserLogin.gridOptions.serachData();
    }

    coreIdentityUserLogin.gridOptions = {
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

    coreIdentityUserLogin.gridOptions.advancedSearchData = {};
    coreIdentityUserLogin.gridOptions.advancedSearchData.engine = {};
    coreIdentityUserLogin.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    coreIdentityUserLogin.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    coreIdentityUserLogin.gridOptions.advancedSearchData.engine.SortType = 1;
    coreIdentityUserLogin.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    coreIdentityUserLogin.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    coreIdentityUserLogin.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    coreIdentityUserLogin.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    coreIdentityUserLogin.gridOptions.advancedSearchData.engine.Filters = [];

    
    coreIdentityUserLogin.openDateRequestDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            coreIdentityUserLogin.focusRequestDate = true;
        });
    };

    coreIdentityUserLogin.gridOptions.reGetAll = function () {
        coreIdentityUserLogin.init();
    }
    //Export Report 
    coreIdentityUserLogin.exportFile = function () {
        coreIdentityUserLogin.addRequested = true;
        coreIdentityUserLogin.gridOptions.advancedSearchData.engine.ExportFile = coreIdentityUserLogin.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'coreIdentityUserLogin/exportfile', coreIdentityUserLogin.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            coreIdentityUserLogin.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                coreIdentityUserLogin.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //coreIdentityUserLogin.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    coreIdentityUserLogin.toggleExportForm = function () {
        coreIdentityUserLogin.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        coreIdentityUserLogin.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        coreIdentityUserLogin.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        coreIdentityUserLogin.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        coreIdentityUserLogin.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCoreIdentity/coreIdentityUserLogin/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    coreIdentityUserLogin.rowCountChanged = function () {
        if (!angular.isDefined(coreIdentityUserLogin.ExportFileClass.RowCount) || coreIdentityUserLogin.ExportFileClass.RowCount > 5000)
            coreIdentityUserLogin.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    coreIdentityUserLogin.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"coreIdentityUserLogin/count", coreIdentityUserLogin.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            coreIdentityUserLogin.addRequested = false;
            rashaErManage.checkAction(response);
            coreIdentityUserLogin.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            coreIdentityUserLogin.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);