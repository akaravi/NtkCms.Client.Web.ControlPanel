app.controller("UploadedFilesController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var uploadedFiles = this;
    uploadedFiles.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    uploadedFiles.UninversalMenus = [];

    uploadedFiles.init = function () {
        uploadedFiles.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = uploadedFiles.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        ajax.call(cmsServerConfig.configApiServerPath+"ApiTelegramUploadedFiles/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            uploadedFiles.busyIndicator.isActive = false;
            uploadedFiles.ListItems = response.ListItems;
            uploadedFiles.gridOptions.fillData(uploadedFiles.ListItems, response.resultAccess);
            uploadedFiles.gridOptions.currentPageNumber = response.CurrentPageNumber;
            uploadedFiles.gridOptions.totalRowCount = response.TotalRowCount;
            uploadedFiles.gridOptions.rowPerPage = response.RowPerPage;
            uploadedFiles.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            uploadedFiles.busyIndicator.isActive = false;
            uploadedFiles.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    uploadedFiles.busyIndicator.isActive = true;
    uploadedFiles.addRequested = false;
    uploadedFiles.openAddModal = function () {
        uploadedFiles.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramUploadedFiles/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            uploadedFiles.busyIndicator.isActive = false;
            uploadedFiles.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegramUploadedFiles/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    uploadedFiles.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        uploadedFiles.busyIndicator.isActive = true;
        uploadedFiles.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramUploadedFiles/add', uploadedFiles.selectedItem, 'POST').success(function (response) {
            uploadedFiles.addRequested = false;
            uploadedFiles.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                uploadedFiles.ListItems.unshift(response.Item);
                uploadedFiles.gridOptions.fillData(uploadedFiles.ListItems);
                uploadedFiles.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            uploadedFiles.busyIndicator.isActive = false;
            uploadedFiles.addRequested = false;
        });
    }

    uploadedFiles.openEditModal = function () {

        uploadedFiles.modalTitle = 'ویرایش';
        if (!uploadedFiles.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramUploadedFiles/GetOne', uploadedFiles.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            uploadedFiles.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegramUploadedFiles/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    uploadedFiles.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        uploadedFiles.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramUploadedFiles/edit', uploadedFiles.selectedItem, 'PUT').success(function (response) {
            uploadedFiles.addRequested = true;
            rashaErManage.checkAction(response);
            uploadedFiles.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                uploadedFiles.addRequested = false;
                uploadedFiles.replaceItem(uploadedFiles.selectedItem.Id, response.Item);
                uploadedFiles.gridOptions.fillData(uploadedFiles.ListItems);
                uploadedFiles.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            uploadedFiles.addRequested = false;
        });
    }

    uploadedFiles.closeModal = function () {
        $modalStack.dismissAll();
    };

    uploadedFiles.replaceItem = function (oldId, newItem) {
        angular.forEach(uploadedFiles.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = uploadedFiles.ListItems.indexOf(item);
                uploadedFiles.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            uploadedFiles.ListItems.unshift(newItem);
    }

    uploadedFiles.deleteRow = function () {
        if (!uploadedFiles.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                uploadedFiles.busyIndicator.isActive = true;
                console.log(uploadedFiles.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramUploadedFiles/GetOne', uploadedFiles.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    uploadedFiles.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramUploadedFiles/delete', uploadedFiles.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        uploadedFiles.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            uploadedFiles.replaceItem(uploadedFiles.selectedItemForDelete.Id);
                            uploadedFiles.gridOptions.fillData(uploadedFiles.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        uploadedFiles.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    uploadedFiles.busyIndicator.isActive = false;

                });
            }
        });
    }

    uploadedFiles.searchData = function () {
        uploadedFiles.gridOptions.searchData();

    }

    uploadedFiles.LinkArticleContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkArticleContentId',
        filterText: 'ArticleContent',
        url: 'ArticleContent',
        scope: uploadedFiles,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    uploadedFiles.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'LinkFileId', displayName: 'کد سیستمی فایل', sortable: true, type: 'string', visible: true },
            { name: 'Type', displayName: 'نوع', sortable: true, type: 'string', visible: true },
            { name: 'TelegramFileId', displayName: 'شناسه تلگرام', sortable: true, type: 'string', visible: true },

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

    uploadedFiles.gridOptions.reGetAll = function () {
        uploadedFiles.init();
    }

    uploadedFiles.gridOptions.onRowSelected = function () {

    }

    uploadedFiles.columnCheckbox = false;
    uploadedFiles.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (uploadedFiles.gridOptions.columnCheckbox) {
            for (var i = 0; i < uploadedFiles.gridOptions.columns.length; i++) {
                //uploadedFiles.gridOptions.columns[i].visible = $("#" + uploadedFiles.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + uploadedFiles.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                uploadedFiles.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = uploadedFiles.gridOptions.columns;
            for (var i = 0; i < uploadedFiles.gridOptions.columns.length; i++) {
                uploadedFiles.gridOptions.columns[i].visible = true;
                var element = $("#" + uploadedFiles.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + uploadedFiles.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < uploadedFiles.gridOptions.columns.length; i++) {
            console.log(uploadedFiles.gridOptions.columns[i].name.concat(".visible: "), uploadedFiles.gridOptions.columns[i].visible);
        }
        uploadedFiles.gridOptions.columnCheckbox = !uploadedFiles.gridOptions.columnCheckbox;
    }

    uploadedFiles.openSendMessageToSender = function (item) {
        uploadedFiles.modalTitle = "ارسال پیام";
        uploadedFiles.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramUploadedFiles/GetOne', item.Id, 'GET').success(function (response) {
            uploadedFiles.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegramUploadedFiles/sendMessageModal.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            uploadedFiles.addRequested = false;
        });
        uploadedFiles.busyIndicator.isActive = false;
    }
     //Export Report 
    uploadedFiles.exportFile = function () {
        uploadedFiles.gridOptions.advancedSearchData.engine.ExportFile = uploadedFiles.ExportFileClass;
        uploadedFiles.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ApiTelegramUploadedFiles/exportfile', uploadedFiles.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            uploadedFiles.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                uploadedFiles.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //uploadedFiles.closeModal();
            }
            uploadedFiles.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    uploadedFiles.toggleExportForm = function () {
        uploadedFiles.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        uploadedFiles.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        uploadedFiles.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        uploadedFiles.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        uploadedFiles.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleApiTelegram/ApiTelegramUploadedFiles/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    uploadedFiles.rowCountChanged = function () {
        if (!angular.isDefined(uploadedFiles.ExportFileClass.RowCount) || uploadedFiles.ExportFileClass.RowCount > 5000)
            uploadedFiles.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    uploadedFiles.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ApiTelegramUploadedFiles/count", uploadedFiles.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            uploadedFiles.addRequested = false;
            rashaErManage.checkAction(response);
            uploadedFiles.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            uploadedFiles.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

