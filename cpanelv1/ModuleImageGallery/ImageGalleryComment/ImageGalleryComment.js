app.controller("imgGalleryCommentCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var imgGalleryComment = this;
    imgGalleryComment.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    imgGalleryComment.ContentList = [];
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    imgGalleryComment.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "imgGalleryCommentCtrl") {
            localStorage.setItem('AddRequest', '');
            imgGalleryComment.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    imgGalleryComment.allowedSearch = [];
    if (itemRecordStatus != undefined) imgGalleryComment.itemRecordStatus = itemRecordStatus;
    imgGalleryComment.init = function () {
        imgGalleryComment.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = imgGalleryComment.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }

        ajax.call(cmsServerConfig.configApiServerPath+"ImageGalleryComment/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            imgGalleryComment.busyIndicator.isActive = false;
            imgGalleryComment.ListItems = response.ListItems;
            imgGalleryComment.gridOptions.fillData(imgGalleryComment.ListItems , response.resultAccess);
            imgGalleryComment.gridOptions.currentPageNumber = response.CurrentPageNumber;
            imgGalleryComment.gridOptions.totalRowCount = response.TotalRowCount;
            imgGalleryComment.gridOptions.rowPerPage = response.RowPerPage;
            imgGalleryComment.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            imgGalleryComment.busyIndicator.isActive = false;
            imgGalleryComment.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //ImageGalleryComment.busyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryComment/getall', {}, 'POST').success(function (response) {
        //    imgGalleryComment.ContentList = response.ListItems;
        //    imgGalleryComment.busyIndicator.isActive = false;
        //});
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        imgGalleryComment.checkRequestAddNewItemFromOtherControl(null);
    }
    imgGalleryComment.busyIndicator.isActive = true;
    imgGalleryComment.addRequested = false;
    imgGalleryComment.openAddModal = function () {
        imgGalleryComment.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryComment/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            imgGalleryComment.busyIndicator.isActive = false;
            imgGalleryComment.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleImageGallery/ImageGalleryComment/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    imgGalleryComment.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        imgGalleryComment.busyIndicator.isActive = true;
        imgGalleryComment.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryComment/add', imgGalleryComment.selectedItem, 'POST').success(function (response) {
            imgGalleryComment.addRequested = false;
            imgGalleryComment.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                imgGalleryComment.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                imgGalleryComment.ListItems.unshift(response.Item);
                imgGalleryComment.gridOptions.fillData(imgGalleryComment.ListItems);
                imgGalleryComment.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            imgGalleryComment.busyIndicator.isActive = false;
            imgGalleryComment.addRequested = false;
        });
    }


    imgGalleryComment.openEditModal = function () {

        imgGalleryComment.modalTitle = 'ویرایش';
        if (!imgGalleryComment.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryComment/GetOne', imgGalleryComment.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            imgGalleryComment.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleImageGallery/ImageGalleryComment/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    imgGalleryComment.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        imgGalleryComment.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryComment/edit', imgGalleryComment.selectedItem, 'PUT').success(function (response) {
            imgGalleryComment.addRequested = true;
            rashaErManage.checkAction(response);
            imgGalleryComment.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                imgGalleryComment.addRequested = false;
                imgGalleryComment.replaceItem(imgGalleryComment.selectedItem.Id, response.Item);
                imgGalleryComment.gridOptions.fillData(imgGalleryComment.ListItems);
                imgGalleryComment.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            imgGalleryComment.addRequested = false;
        });
    }


    imgGalleryComment.closeModal = function () {
        $modalStack.dismissAll();
    };

    imgGalleryComment.replaceItem = function (oldId, newItem) {
        angular.forEach(imgGalleryComment.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = imgGalleryComment.ListItems.indexOf(item);
                imgGalleryComment.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            imgGalleryComment.ListItems.unshift(newItem);
    }

    imgGalleryComment.deleteRow = function () {
        if (!imgGalleryComment.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                imgGalleryComment.busyIndicator.isActive = true;
                console.log(imgGalleryComment.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryComment/GetOne', imgGalleryComment.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    //rashaErManage.checkAction(response);
                    imgGalleryComment.selectedItemForDelete = response.Item;
                    console.log(imgGalleryComment.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryComment/delete', imgGalleryComment.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        imgGalleryComment.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            imgGalleryComment.replaceItem(imgGalleryComment.selectedItemForDelete.Id);
                            imgGalleryComment.gridOptions.fillData(imgGalleryComment.ListItems);
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

    imgGalleryComment.searchData = function () {
        imgGalleryComment.gridOptions.serachData();
    }
    imgGalleryComment.LinkImageGalleryContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkImageGalleryContentId',
        url: 'ImageGalleryContent',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: imgGalleryComment,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
                { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: "string"},
                { name: 'RegisterDate', displayName: 'تاریخ ثبت', sortable: true, type: 'date'}
            ]
        }
    }
   

    imgGalleryComment.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Writer', displayName: 'نام نویسنده', sortable: true, type: "string" },
            { name: 'Comment', displayName: 'کامنت', sortable: true, type: "string" },
            { name: 'virtual_ImageGalleryContent.Title', displayName: 'عنوان تصویر', sortable: true, type: 'string', visible: true },
            { name: 'LinkImageGalleryContentId', displayName: 'کد سیستمی تصویر', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    imgGalleryComment.gridOptions.advancedSearchData = {};
    imgGalleryComment.gridOptions.advancedSearchData.engine = {};
    imgGalleryComment.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    imgGalleryComment.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    imgGalleryComment.gridOptions.advancedSearchData.engine.SortType = 1;
    imgGalleryComment.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    imgGalleryComment.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    imgGalleryComment.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    imgGalleryComment.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    imgGalleryComment.gridOptions.advancedSearchData.engine.Filters = [];

    imgGalleryComment.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            imgGalleryComment.focusExpireLockAccount = true;
        });
    };

    imgGalleryComment.gridOptions.reGetAll = function () {
        imgGalleryComment.init();
    }

    imgGalleryComment.columnCheckbox = false;
    imgGalleryComment.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (imgGalleryComment.gridOptions.columnCheckbox) {
            for (var i = 0; i < imgGalleryComment.gridOptions.columns.length; i++) {
                //ImageGalleryComment.gridOptions.columns[i].visible = $("#" + imgGalleryComment.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + imgGalleryComment.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                imgGalleryComment.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = imgGalleryComment.gridOptions.columns;
            for (var i = 0; i < imgGalleryComment.gridOptions.columns.length; i++) {
                imgGalleryComment.gridOptions.columns[i].visible = true;
                var element = $("#" + imgGalleryComment.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + imgGalleryComment.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < imgGalleryComment.gridOptions.columns.length; i++) {
            console.log(imgGalleryComment.gridOptions.columns[i].name.concat(".visible: "), imgGalleryComment.gridOptions.columns[i].visible);
        }
        imgGalleryComment.gridOptions.columnCheckbox = !imgGalleryComment.gridOptions.columnCheckbox;
    }
    //Export Report 
    imgGalleryComment.exportFile = function () {
        imgGalleryComment.gridOptions.advancedSearchData.engine.ExportFile = imgGalleryComment.ExportFileClass;
        imgGalleryComment.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ImageGalleryComment/exportfile', imgGalleryComment.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            imgGalleryComment.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                imgGalleryComment.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //ImageGalleryComment.closeModal();
            }
            imgGalleryComment.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    imgGalleryComment.toggleExportForm = function () {
        imgGalleryComment.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        imgGalleryComment.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        imgGalleryComment.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        imgGalleryComment.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        imgGalleryComment.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleImageGallery/ImageGalleryComment/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    imgGalleryComment.rowCountChanged = function () {
        if (!angular.isDefined(imgGalleryComment.ExportFileClass.RowCount) || imgGalleryComment.ExportFileClass.RowCount > 5000)
            imgGalleryComment.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    imgGalleryComment.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ImageGalleryComment/count", imgGalleryComment.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            imgGalleryComment.addRequested = false;
            rashaErManage.checkAction(response);
            imgGalleryComment.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            imgGalleryComment.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);