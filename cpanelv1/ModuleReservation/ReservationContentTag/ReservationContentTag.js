app.controller("reservationContentTagCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var reservationContentTag = this;
    reservationContentTag.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    reservationContentTag.init = function () {
        reservationContentTag.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"reservationContenttag/getall", reservationContentTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            reservationContentTag.busyIndicator.isActive = false;

            reservationContentTag.ListItems = response.ListItems;
            reservationContentTag.gridOptions.fillData(reservationContentTag.ListItems , response.resultAccess);
            reservationContentTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            reservationContentTag.gridOptions.totalRowCount = response.TotalRowCount;
            reservationContentTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            reservationContentTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    reservationContentTag.addRequested = false;
    reservationContentTag.openAddModal = function () {
        reservationContentTag.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'reservationContenttag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            reservationContentTag.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulereservation/reservationcontentTag/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    reservationContentTag.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        reservationContentTag.addRequested = true;
        reservationContentTag.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+'reservationContenttag/add', reservationContentTag.selectedItem , 'POST').success(function (response) {
            reservationContentTag.addRequested = false;
            reservationContentTag.busyIndicator.isActive = false;

            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                reservationContentTag.ListItems.unshift(response.Item);
                reservationContentTag.gridOptions.fillData(reservationContentTag.ListItems);
                reservationContentTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            reservationContentTag.busyIndicator.isActive = false;

            reservationContentTag.addRequested = false;
        });
    }


    reservationContentTag.openEditModal = function () {
        reservationContentTag.modalTitle = 'ویرایش';
        if (!reservationContentTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'reservationContenttag/GetOne',  reservationContentTag.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            reservationContentTag.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulereservation/reservationcontentTag/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    reservationContentTag.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        reservationContentTag.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+'reservationContenttag/edit',  reservationContentTag.selectedItem , 'PUT').success(function (response) {
            reservationContentTag.addRequested = true;
            rashaErManage.checkAction(response);
            reservationContentTag.busyIndicator.isActive = false;

            if (response.IsSuccess) {
                reservationContentTag.addRequested = false;
                reservationContentTag.replaceItem(reservationContentTag.selectedItem.Id, response.Item);
                reservationContentTag.gridOptions.fillData(reservationContentTag.ListItems);
                reservationContentTag.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            reservationContentTag.busyIndicator.isActive = false;

            reservationContentTag.addRequested = false;
        });
    }


    reservationContentTag.closeModal = function () {
        $modalStack.dismissAll();
    };

    reservationContentTag.replaceItem = function (oldId, newItem) {
        angular.forEach(reservationContentTag.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = reservationContentTag.ListItems.indexOf(item);
                reservationContentTag.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            reservationContentTag.ListItems.unshift(newItem);
    }

    reservationContentTag.deleteRow = function () {
        if (!reservationContentTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                reservationContentTag.busyIndicator.isActive = true;
                console.log(reservationContentTag.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'reservationContenttag/GetOne',  reservationContentTag.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    reservationContentTag.selectedItemForDelete = response.Item;
                    console.log(reservationContentTag.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'reservationContenttag/delete',  reservationContentTag.selectedItemForDelete , 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        reservationContentTag.busyIndicator.isActive = false;

                        if (res.IsSuccess) {
                            reservationContentTag.replaceItem(reservationContentTag.selectedItemForDelete.Id);
                            reservationContentTag.gridOptions.fillData(reservationContentTag.ListItems);
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

    reservationContentTag.searchData = function () {
        reservationContentTag.gridOptions.serachData();
    }

    reservationContentTag.LinkContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkContentId',
        url: 'reservationContent',
        scope: reservationContentTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }


    reservationContentTag.LinkTagIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkTagId',
        url: 'reservationTag',
        scope: reservationContentTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    reservationContentTag.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
           { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Content.Title', displayName: 'انتخاب محتوا', sortable: true ,displayForce:true},
            { name: 'Tag.Title', displayName: 'انتخاب تگ', sortable: true, displayForce: true },

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    reservationContentTag.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            reservationContentTag.focusExpireLockAccount = true;
        });
    };



    reservationContentTag.gridOptions.reGetAll = function () {
        reservationContentTag.init();
    }

    //Export Report 
    reservationContentTag.exportFile = function () {
        reservationContentTag.addRequested = true;
        reservationContentTag.gridOptions.advancedSearchData.engine.ExportFile = reservationContentTag.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'reservationContentTag/exportfile', reservationContentTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            reservationContentTag.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                reservationContentTag.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //reservationContentTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    reservationContentTag.toggleExportForm = function () {
        reservationContentTag.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        reservationContentTag.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        reservationContentTag.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        reservationContentTag.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        reservationContentTag.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/Modulereservation/reservationContentTag/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    reservationContentTag.rowCountChanged = function () {
        if (!angular.isDefined(reservationContentTag.ExportFileClass.RowCount) || reservationContentTag.ExportFileClass.RowCount > 5000)
            reservationContentTag.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    reservationContentTag.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"reservationContentTag/count", reservationContentTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            reservationContentTag.addRequested = false;
            rashaErManage.checkAction(response);
            reservationContentTag.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            reservationContentTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);