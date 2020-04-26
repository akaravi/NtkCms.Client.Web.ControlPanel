app.controller("estateContractTypeController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var estateContractType = this;
    estateContractType.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    estateContractType.ListItems = [];
    if (itemRecordStatus != undefined) estateContractType.itemRecordStatus = itemRecordStatus;



    estateContractType.init = function () {
        estateContractType.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = estateContractType.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        ajax.call(cmsServerConfig.configApiServerPath+"estatecontracttype/getall", estateContractType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            estateContractType.busyIndicator.isActive = false;
            estateContractType.ListItems = response.ListItems;

            // Call Excerpt Function to shorten the length of long strings
            //excerptField(estateContractType.ListItems, "BotToken");
            estateContractType.gridOptions.fillData(estateContractType.ListItems, response.resultAccess);
            estateContractType.gridOptions.currentPageNumber = response.CurrentPageNumber;
            estateContractType.gridOptions.totalRowCount = response.TotalRowCount;
            estateContractType.gridOptions.rowPerPage = response.RowPerPage;
            estateContractType.allowedSearch = response.AllowedSearchField;

        }).error(function (data, errCode, c, d) {
            estateContractType.busyIndicator.isActive = false;
            estateContractType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    estateContractType.busyIndicator.isActive = true;
    estateContractType.addRequested = false;
    estateContractType.openAddModal = function () {
        estateContractType.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'estatecontracttype/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            estateContractType.busyIndicator.isActive = false;
            estateContractType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleEstate/EstateContractType/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            estateContractType.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    estateContractType.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        estateContractType.busyIndicator.isActive = true;
        estateContractType.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'estatecontracttype/add', estateContractType.selectedItem, 'POST').success(function (response) {
            estateContractType.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                estateContractType.ListItems.unshift(response.Item);
                estateContractType.gridOptions.fillData(estateContractType.ListItems);
                estateContractType.busyIndicator.isActive = false;
                estateContractType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            estateContractType.busyIndicator.isActive = false;
            estateContractType.addRequested = false;
        });
    }

    // Open Edit Modal
    estateContractType.openEditModal = function () {
        estateContractType.modalTitle = 'ویرایش';
        if (!estateContractType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'estatecontracttype/GetOne', estateContractType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            estateContractType.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleEstate/EstateContractType/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    estateContractType.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        estateContractType.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'estatecontracttype/edit', estateContractType.selectedItem, 'PUT').success(function (response) {
            estateContractType.addRequested = true;
            rashaErManage.checkAction(response);
            estateContractType.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                estateContractType.addRequested = false;
                estateContractType.replaceItem(estateContractType.selectedItem.Id, response.Item);
                estateContractType.gridOptions.fillData(estateContractType.ListItems);
                estateContractType.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            estateContractType.addRequested = false;
            estateContractType.busyIndicator.isActive = false;

        });
    }

    estateContractType.closeModal = function () {
        $modalStack.dismissAll();
    };

    estateContractType.replaceItem = function (oldId, newItem) {
        angular.forEach(estateContractType.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = estateContractType.ListItems.indexOf(item);
                estateContractType.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            estateContractType.ListItems.unshift(newItem);
    }

    estateContractType.deleteRow = function () {
        if (!estateContractType.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                estateContractType.busyIndicator.isActive = true;
                console.log(estateContractType.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'estatecontracttype/GetOne', estateContractType.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    estateContractType.selectedItemForDelete = response.Item;
                    console.log(estateContractType.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'estatecontracttype/delete', estateContractType.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        estateContractType.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            estateContractType.replaceItem(estateContractType.selectedItemForDelete.Id);
                            estateContractType.gridOptions.fillData(estateContractType.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        estateContractType.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    estateContractType.busyIndicator.isActive = false;

                });
            }
        });
    }

    estateContractType.searchData = function () {
        estateContractType.gridOptions.searchData();

    }

    estateContractType.LinkArticleContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkArticleContentId',
        filterText: 'ArticleContent',
        url: 'ArticleContent',
        scope: estateContractType,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    estateContractType.gridOptions = {
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

    estateContractType.gridOptions.reGetAll = function () {
        estateContractType.init();
    }

    estateContractType.gridOptions.onRowSelected = function () {

    }

    estateContractType.columnCheckbox = false;
    estateContractType.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (estateContractType.gridOptions.columnCheckbox) {
            for (var i = 0; i < estateContractType.gridOptions.columns.length; i++) {
                //estateContractType.gridOptions.columns[i].visible = $("#" + estateContractType.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + estateContractType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                estateContractType.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = estateContractType.gridOptions.columns;
            for (var i = 0; i < estateContractType.gridOptions.columns.length; i++) {
                estateContractType.gridOptions.columns[i].visible = true;
                var element = $("#" + estateContractType.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + estateContractType.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < estateContractType.gridOptions.columns.length; i++) {
            console.log(estateContractType.gridOptions.columns[i].name.concat(".visible: "), estateContractType.gridOptions.columns[i].visible);
        }
        estateContractType.gridOptions.columnCheckbox = !estateContractType.gridOptions.columnCheckbox;
    }
    //Export Report 
    estateContractType.exportFile = function () {
        estateContractType.addRequested = true;
        estateContractType.gridOptions.advancedSearchData.engine.ExportFile = estateContractType.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'estateContractType/exportfile', estateContractType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            estateContractType.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                estateContractType.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //estateContractType.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    estateContractType.toggleExportForm = function () {
        estateContractType.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        estateContractType.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        estateContractType.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        estateContractType.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        estateContractType.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleEstate/EstateContractType/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    estateContractType.rowCountChanged = function () {
        if (!angular.isDefined(estateContractType.ExportFileClass.RowCount) || estateContractType.ExportFileClass.RowCount > 5000)
            estateContractType.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    estateContractType.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"estateContractType/count", estateContractType.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            estateContractType.addRequested = false;
            rashaErManage.checkAction(response);
            estateContractType.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            estateContractType.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

