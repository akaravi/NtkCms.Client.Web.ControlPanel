app.controller("newsSharingCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var newssharingcategory = this;
    newssharingcategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    var todayDate = moment().format();
    newssharingcategory.FromDate = {
        defaultDate: todayDate
    }
    newssharingcategory.ToDate = {
        defaultDate: todayDate
    }
    newssharingcategory.testDate = moment().format();
    newssharingcategory.init = function () {
        newssharingcategory.categoryBusyIndicator.isActive = true;
        var engine = {};
        try {
            engine = newssharingcategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"newssharingcategory/getall", newssharingcategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            newssharingcategory.categoryBusyIndicator.isActive = false;
            newssharingcategory.ListItems = response.ListItems;
            newssharingcategory.gridOptions.resultAccess = response.resultAccess;
            newssharingcategory.gridOptions.fillData(newssharingcategory.ListItems);
            newssharingcategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            newssharingcategory.gridOptions.totalRowCount = response.TotalRowCount;
            newssharingcategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            newssharingcategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        ajax.call(cmsServerConfig.configApiServerPath+'NewsCategory/getall', {}, 'POST').success(function (response) {
            newssharingcategory.CategoryTargetList = response.ListItems;
        });
        ajax.call(cmsServerConfig.configApiServerPath+'NewsShareSettingCategory/PostGetAllOtherSite', {}, 'POST').success(function (response) {
            newssharingcategory.SettingCategoryList = response.ListItems;
            newssharingcategory.categoryBusyIndicator.isActive = false;
        });
    }
    newssharingcategory.addRequested = false;
    newssharingcategory.openAddModal = function () {
        newssharingcategory.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'newssharingcategory/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            newssharingcategory.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleNews/newssharingcategory/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    newssharingcategory.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        newssharingcategory.addRequested = true;
        newssharingcategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'newssharingcategory/add',  newssharingcategory.selectedItem , 'POST').success(function (response) {
            newssharingcategory.addRequested = false;
            rashaErManage.checkAction(response);
            newssharingcategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                newssharingcategory.ListItems.unshift(response.Item);
                newssharingcategory.gridOptions.fillData(newssharingcategory.ListItems);
                newssharingcategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newssharingcategory.addRequested = false;
        });
    }


    newssharingcategory.openEditModal = function () {
        newssharingcategory.modalTitle = 'ویرایش';
        if (!newssharingcategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'newssharingcategory/GetOne',  newssharingcategory.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            newssharingcategory.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleNews/newssharingcategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    newssharingcategory.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'newssharingcategory/edit',  newssharingcategory.selectedItem , 'PUT').success(function (response) {
            newssharingcategory.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                newssharingcategory.addRequested = false;
                newssharingcategory.replaceItem(newssharingcategory.selectedItem.Id, response.Item);
                newssharingcategory.gridOptions.fillData(newssharingcategory.ListItems);
                newssharingcategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newssharingcategory.addRequested = false;
        });
    }


    newssharingcategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    newssharingcategory.replaceItem = function (oldId, newItem) {
        angular.forEach(newssharingcategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = newssharingcategory.ListItems.indexOf(item);
                newssharingcategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            newssharingcategory.ListItems.unshift(newItem);
    }

    newssharingcategory.deleteRow = function () {
        if (!newssharingcategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(newssharingcategory.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'newssharingcategory/GetOne', newssharingcategory.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    newssharingcategory.selectedItemForDelete = response.Item;
                    console.log(newssharingcategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'newssharingcategory/delete',  newssharingcategory.selectedItemForDelete , 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            newssharingcategory.replaceItem(newssharingcategory.selectedItemForDelete.Id);
                            newssharingcategory.gridOptions.fillData(newssharingcategory.ListItems);
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

    newssharingcategory.searchData = function () {
        newssharingcategory.gridOptions.serachData();
    }

    newssharingcategory.LinkSharedSettingCategoryIdSelector = {
        displayMember: 'Title',
        Action: 'GetAllOtherSite',
        id: 'Id',
        fId: 'LinkSharedSettingCategoryId',
        url: 'NewsShareSettingCategory',
        scope: newssharingcategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true },
                { name: 'Title', displayName: 'عنوان', sortable: true }
            ]
        }
    }
    newssharingcategory.LinkCategoryTargetIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryTargetId',
        url: 'NewsCategory',
        scope: newssharingcategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true },
                { name: 'Title', displayName: 'عنوان', sortable: true }
            ]
        }
    }

    newssharingcategory.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
            { name: 'LinkSharedSettingCategoryId', displayName: 'اشتراک انتخاب شده', sortable: true },
            { name: 'virtual_SharedSettingCategory.Title', displayName: 'اشتراک انتخاب شده', sortable: true },
            { name: 'virtual_SharedSettingCategory.SharedCategory.Title', displayName: 'دسته اشتراک انتخاب شده', sortable: true },
            { name: 'LinkCategoryTargetId', displayName: 'اضافه به دسته', sortable: true },
            { name: 'virtual_CategoryTarget.Title', displayName: 'اضافه به دسته', sortable: true },
        ], 
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    newssharingcategory.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            newssharingcategory.focusExpireLockAccount = true;
        });
    };



    newssharingcategory.gridOptions.reGetAll = function () {
        newssharingcategory.init();
    }

    //Export Report 
    newssharingcategory.exportFile = function () {
        newssharingcategory.addRequested = true;
        newssharingcategory.gridOptions.advancedSearchData.engine.ExportFile = newssharingcategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'newssharingcategory/exportfile', newssharingcategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            newssharingcategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                newssharingcategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //newssharingcategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    newssharingcategory.toggleExportForm = function () {
        newssharingcategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        newssharingcategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        newssharingcategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        newssharingcategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        newssharingcategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleNews/newssharingcategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    newssharingcategory.rowCountChanged = function () {
        if (!angular.isDefined(newssharingcategory.ExportFileClass.RowCount) || newssharingcategory.ExportFileClass.RowCount > 5000)
            newssharingcategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    newssharingcategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"newssharingcategory/count", newssharingcategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            newssharingcategory.addRequested = false;
            rashaErManage.checkAction(response);
            newssharingcategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            newssharingcategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);