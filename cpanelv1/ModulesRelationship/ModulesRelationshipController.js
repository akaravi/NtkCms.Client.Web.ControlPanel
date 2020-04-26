app.controller("modulesRelationshipContentController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var modulesRelationship = this;
    var listforDel=[];
    modulesRelationship.init = function () {
        //modulesRelationship.LoadingBusyIndicator.isActive = true;
        var engine = {};
        try {
            engine = modulesRelationship.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        ajax.call(cmsServerConfig.configApiServerPath+"ModulesRelationshipContent/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
        angular.forEach( response.ListItems, function (item, key) {
                item.isChecked=false
            });    
        modulesRelationship.ListItems = response.ListItems;
    
            modulesRelationship.gridOptions.fillData(modulesRelationship.ListItems , response.resultAccess);
            modulesRelationship.gridOptions.currentPageNumber = response.CurrentPageNumber;
            modulesRelationship.gridOptions.totalRowCount = response.TotalRowCount;
            modulesRelationship.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            modulesRelationship.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    modulesRelationship.closeModal = function () {
        $modalStack.dismissAll();
    };

    modulesRelationship.replaceItem = function (oldId, newItem) {
        angular.forEach(modulesRelationship.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = modulesRelationship.ListItems.indexOf(item);
                modulesRelationship.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            modulesRelationship.ListItems.unshift(newItem);
    }


    modulesRelationship.deleteRow = function () {
        if (!modulesRelationship.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(modulesRelationship.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'ModulesRelationshipContent/GetOne', modulesRelationship.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    modulesRelationship.selectedItemForDelete = response.Item;
                    console.log(modulesRelationship.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ModulesRelationshipContent/delete', modulesRelationship.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            modulesRelationship.replaceItem(modulesRelationship.selectedItemForDelete.Id);
                            modulesRelationship.gridOptions.fillData(modulesRelationship.ListItems);
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

    modulesRelationship.searchData = function () {
        modulesRelationship.gridOptions.serachData();
    }

    modulesRelationship.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
            { name: 'CurrentSiteId', displayName: 'کد سیستمی سایت', sortable: true },
            { name: 'Title', displayName: 'عنوان', sortable: true },
            { name: 'LinkModuleContentIdMain', displayName: 'از', sortable: true, isDate: true },
            { name: 'LinkModuleContentIdOther', displayName: 'به', sortable: true },
            //{ name: 'LinkLinkUserTypeId.LinkUserType', displayName: 'نوع کاربر', sortable: true },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    modulesRelationship.gridOptions.advancedSearchData = {};
    modulesRelationship.gridOptions.advancedSearchData.engine = {};
    modulesRelationship.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    modulesRelationship.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    modulesRelationship.gridOptions.advancedSearchData.engine.SortType = 1;
    modulesRelationship.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    modulesRelationship.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    modulesRelationship.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    modulesRelationship.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    modulesRelationship.gridOptions.advancedSearchData.engine.Filters = [];

    
    modulesRelationship.openDateRequestDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            modulesRelationship.focusRequestDate = true;
        });
    };

    modulesRelationship.gridOptions.reGetAll = function () {
        modulesRelationship.init();
    }
    //Export Report 
    modulesRelationship.exportFile = function () {
        modulesRelationship.addRequested = true;
        modulesRelationship.gridOptions.advancedSearchData.engine.ExportFile = modulesRelationship.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'ModulesRelationshipContent/exportfile', modulesRelationship.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            modulesRelationship.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                modulesRelationship.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //modulesRelationship.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    modulesRelationship.toggleExportForm = function () {
        modulesRelationship.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        modulesRelationship.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        modulesRelationship.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        modulesRelationship.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        modulesRelationship.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCore/ModulesRelationship/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    modulesRelationship.rowCountChanged = function () {
        if (!angular.isDefined(modulesRelationship.ExportFileClass.RowCount) || modulesRelationship.ExportFileClass.RowCount > 5000)
            modulesRelationship.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    modulesRelationship.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ModulesRelationshipContent/count", modulesRelationship.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            modulesRelationship.addRequested = false;
            rashaErManage.checkAction(response);
            modulesRelationship.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            modulesRelationship.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);