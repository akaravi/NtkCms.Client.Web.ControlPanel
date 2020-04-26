app.controller("advertisementContractTypeController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var advertisementContractType = this;
    advertisementContractType.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    advertisementContractType.ListItems = [];
    if (itemRecordStatus != undefined) advertisementContractType.itemRecordStatus = itemRecordStatus;



    advertisementContractType.init = function () {
        advertisementContractType.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = advertisementContractType.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        ajax.call(cmsServerConfig.configApiServerPath+"advertisementcontracttype/getall", advertisementContractType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            advertisementContractType.busyIndicator.isActive = false;
            advertisementContractType.ListItems = response.ListItems;

            // Call Excerpt Function to shorten the length of long strings
            //excerptField(advertisementContractType.ListItems, "BotToken");
            advertisementContractType.gridOptions.fillData(advertisementContractType.ListItems, response.resultAccess);
            advertisementContractType.gridOptions.currentPageNumber = response.CurrentPageNumber;
            advertisementContractType.gridOptions.totalRowCount = response.TotalRowCount;
            advertisementContractType.gridOptions.rowPerPage = response.RowPerPage;
            advertisementContractType.allowedSearch = response.AllowedSearchField;

        }).error(function (data, errCode, c, d) {
            advertisementContractType.busyIndicator.isActive = false;
            advertisementContractType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    advertisementContractType.busyIndicator.isActive = true;
    advertisementContractType.addRequested = false;
    advertisementContractType.openAddModal = function () {
        advertisementContractType.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementcontracttype/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            advertisementContractType.busyIndicator.isActive = false;
            advertisementContractType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleAdvertisement/AdvertisementContractType/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            advertisementContractType.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    advertisementContractType.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        advertisementContractType.busyIndicator.isActive = true;
        advertisementContractType.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementcontracttype/add', advertisementContractType.selectedItem, 'POST').success(function (response) {
            advertisementContractType.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                advertisementContractType.ListItems.unshift(response.Item);
                advertisementContractType.gridOptions.fillData(advertisementContractType.ListItems);
                advertisementContractType.busyIndicator.isActive = false;
                advertisementContractType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            advertisementContractType.busyIndicator.isActive = false;
            advertisementContractType.addRequested = false;
        });
    }

    // Open Edit Modal
    advertisementContractType.openEditModal = function () {
        advertisementContractType.modalTitle = 'ویرایش';
        if (!advertisementContractType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementcontracttype/GetOne', advertisementContractType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            advertisementContractType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleAdvertisement/AdvertisementContractType/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    advertisementContractType.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        advertisementContractType.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementcontracttype/edit', advertisementContractType.selectedItem, 'PUT').success(function (response) {
            advertisementContractType.addRequested = true;
            rashaErManage.checkAction(response);
            advertisementContractType.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                advertisementContractType.addRequested = false;
                advertisementContractType.replaceItem(advertisementContractType.selectedItem.Id, response.Item);
                advertisementContractType.gridOptions.fillData(advertisementContractType.ListItems);
                advertisementContractType.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            advertisementContractType.addRequested = false;
            advertisementContractType.busyIndicator.isActive = false;

        });
    }

    advertisementContractType.closeModal = function () {
        $modalStack.dismissAll();
    };

    advertisementContractType.replaceItem = function (oldId, newItem) {
        angular.forEach(advertisementContractType.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = advertisementContractType.ListItems.indexOf(item);
                advertisementContractType.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            advertisementContractType.ListItems.unshift(newItem);
    }

    advertisementContractType.deleteRow = function () {
        if (!advertisementContractType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                advertisementContractType.busyIndicator.isActive = true;
                console.log(advertisementContractType.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'advertisementcontracttype/GetOne', advertisementContractType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    advertisementContractType.selectedItemForDelete = response.Item;
                    console.log(advertisementContractType.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'advertisementcontracttype/delete', advertisementContractType.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        advertisementContractType.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            advertisementContractType.replaceItem(advertisementContractType.selectedItemForDelete.Id);
                            advertisementContractType.gridOptions.fillData(advertisementContractType.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        advertisementContractType.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    advertisementContractType.busyIndicator.isActive = false;

                });
            }
        });
    }

    advertisementContractType.searchData = function () {
        advertisementContractType.gridOptions.searchData();

    }

    advertisementContractType.LinkArticleContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkArticleContentId',
        filterText: 'ArticleContent',
        url: 'ArticleContent',
        scope: advertisementContractType,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    advertisementContractType.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'نوع معامله', sortable: true, type: 'string', visible: true },
            { name: 'HasSalePrice', displayName: 'قیمت فروش دارد', sortable: true, type: 'string', isCheckBox: true, visible: true },
            { name: 'HasPresalePrice', displayName: 'قیمت پیش فروش دارد', sortable: true, type: 'string', isCheckBox: true, visible: true },
            { name: 'HasRentPrice', displayName: 'اجاره/اقساط دارد', sortable: true, type: 'string', isCheckBox: true, visible: true },
            { name: 'HasDepositPrice', displayName: 'قیمت رهن دارد', sortable: true, type: 'string', isCheckBox: true, visible: true }
        ],
        data: {},
        multiSelect: false,
        startDate: moment().format(),
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "Id",
                SortType: 0,
                NeedToRunFakePagination: false,
                TotalRowData: 2000,
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }

    advertisementContractType.gridOptions.reGetAll = function () {
        advertisementContractType.init();
    }

    advertisementContractType.gridOptions.onRowSelected = function () {

    }

    advertisementContractType.columnCheckbox = false;
    advertisementContractType.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (advertisementContractType.gridOptions.columnCheckbox) {
            for (var i = 0; i < advertisementContractType.gridOptions.columns.length; i++) {
                //advertisementContractType.gridOptions.columns[i].visible = $("#" + advertisementContractType.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + advertisementContractType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                advertisementContractType.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = advertisementContractType.gridOptions.columns;
            for (var i = 0; i < advertisementContractType.gridOptions.columns.length; i++) {
                advertisementContractType.gridOptions.columns[i].visible = true;
                var element = $("#" + advertisementContractType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + advertisementContractType.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < advertisementContractType.gridOptions.columns.length; i++) {
            console.log(advertisementContractType.gridOptions.columns[i].name.concat(".visible: "), advertisementContractType.gridOptions.columns[i].visible);
        }
        advertisementContractType.gridOptions.columnCheckbox = !advertisementContractType.gridOptions.columnCheckbox;
    }
    //Export Report 
    advertisementContractType.exportFile = function () {
        advertisementContractType.addRequested = true;
        advertisementContractType.gridOptions.advancedSearchData.engine.ExportFile = advertisementContractType.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'advertisementContractType/exportfile', advertisementContractType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            advertisementContractType.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                advertisementContractType.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //advertisementContractType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    advertisementContractType.toggleExportForm = function () {
        advertisementContractType.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        advertisementContractType.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        advertisementContractType.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        advertisementContractType.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        advertisementContractType.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleAdvertisement/AdvertisementContractType/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    advertisementContractType.rowCountChanged = function () {
        if (!angular.isDefined(advertisementContractType.ExportFileClass.RowCount) || advertisementContractType.ExportFileClass.RowCount > 5000)
            advertisementContractType.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    advertisementContractType.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"advertisementContractType/count", advertisementContractType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            advertisementContractType.addRequested = false;
            rashaErManage.checkAction(response);
            advertisementContractType.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            advertisementContractType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

