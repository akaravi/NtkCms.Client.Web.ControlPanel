app.controller("blogCommentCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var blogComment = this;
    blogComment.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    blogComment.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "blogCommentCtrl") {
            localStorage.setItem('AddRequest', '');
            blogComment.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }

    if (itemRecordStatus != undefined) blogComment.itemRecordStatus = itemRecordStatus;
    var engine = {};
    try {
        engine = blogComment.gridOptions.advancedSearchData.engine;
    } catch (error) {
        console.log(error)
    }
    blogComment.init = function () {
        blogComment.busyIndicator.isActive = true;

        //var engine = {};
        //try {
        //    engine = blogComment.gridOptions.advancedSearchData.engine;
        //} catch (error) {
        //    console.log(error)
        //}

        ajax.call(cmsServerConfig.configApiServerPath+"blogComment/getall", blogComment.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            blogComment.busyIndicator.isActive = false;
            blogComment.ListItems = response.ListItems;
            blogComment.gridOptions.fillData(blogComment.ListItems, response.resultAccess);
            blogComment.gridOptions.currentPageNumber = response.CurrentPageNumber;
            blogComment.gridOptions.totalRowCount = response.TotalRowCount;
            blogComment.gridOptions.rowPerPage = response.RowPerPage;
            blogComment.gridOptions.maxSize = 5;
            blogComment.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            blogComment.busyIndicator.isActive = false;
            blogComment.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //blogComment.busyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+'blogComment/getall', {}, 'POST').success(function (response) {
        //    blogComment.CommentList = response.ListItems;
        //    blogComment.busyIndicator.isActive = false;
        //});

        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        blogComment.checkRequestAddNewItemFromOtherControl(null);
    }

    blogComment.busyIndicator.isActive = true;
    blogComment.addRequested = false;
    blogComment.openAddModal = function () {
        blogComment.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'blogComment/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            blogComment.busyIndicator.isActive = false;
            blogComment.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleBlog/BlogComment/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    blogComment.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (!blogComment.selectedItem.LinkContentId) {
            rashaErManage.showMessage("لطفا خبر را مشخص کنید");
            return;
        }
        blogComment.busyIndicator.isActive = true;
        blogComment.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'blogComment/add', blogComment.selectedItem, 'POST').success(function (response) {
            blogComment.addRequested = false;
            blogComment.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                blogComment.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                blogComment.ListItems.unshift(response.Item);
                blogComment.gridOptions.fillData(blogComment.ListItems);
                blogComment.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogComment.busyIndicator.isActive = false;
            blogComment.addRequested = false;
        });
    }

    blogComment.openEditModal = function () {

        blogComment.modalTitle = 'ویرایش';
        if (!blogComment.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'blogComment/GetOne', blogComment.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            blogComment.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleBlog/BlogComment/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    blogComment.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        blogComment.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'blogComment/edit', blogComment.selectedItem, 'PUT').success(function (response) {
            blogComment.addRequested = true;
            rashaErManage.checkAction(response);
            blogComment.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                blogComment.addRequested = false;
                blogComment.replaceItem(blogComment.selectedItem.Id, response.Item);
                blogComment.gridOptions.fillData(blogComment.ListItems);
                blogComment.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogComment.addRequested = false;
        });
    }

    blogComment.closeModal = function () {
        $modalStack.dismissAll();
    };

    blogComment.replaceItem = function (oldId, newItem) {
        angular.forEach(blogComment.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = blogComment.ListItems.indexOf(item);
                blogComment.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            blogComment.ListItems.unshift(newItem);
    }

    blogComment.deleteRow = function () {
        if (!blogComment.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                blogComment.busyIndicator.isActive = true;
                console.log(blogComment.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'blogComment/GetOne', blogComment.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    blogComment.selectedItemForDelete = response.Item;
                    console.log(blogComment.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'blogComment/delete', blogComment.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        blogComment.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            blogComment.replaceItem(blogComment.selectedItemForDelete.Id);
                            blogComment.gridOptions.fillData(blogComment.ListItems);
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

    blogComment.searchData = function () {
        blogComment.gridOptions.searchData();

    }

    blogComment.LinkBlogContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkContentId',
        filterText: 'BlogContent',
        url: 'BlogContent',
        scope: blogComment,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    blogComment.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Writer', displayName: 'نام نویسنده', sortable: true, type: "string" },
            { name: 'Comment', displayName: 'کامنت', sortable: true, type: "string" },
            { name: 'virtual_BlogContent.Title', displayName: 'عنوان نوشته', sortable: true, type: 'string', visible: true },
            { name: 'LinkContentId', displayName: 'کد سیستمی نوشته', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },

        ],
        data: {},
        multiSelect: false,
        startDate: moment().format(),
        advancedSearchData: {
            engine: {}
        }
    }

    blogComment.gridOptions.advancedSearchData = {};
    blogComment.gridOptions.advancedSearchData.engine = {};
    blogComment.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    blogComment.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    blogComment.gridOptions.advancedSearchData.engine.SortType = 1;
    blogComment.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    blogComment.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    blogComment.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    blogComment.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    blogComment.gridOptions.advancedSearchData.engine.Filters = [];

    blogComment.test = 'false';

    blogComment.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            blogComment.focusExpireLockAccount = true;
        });
    };

    blogComment.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            blogComment.focus = true;
        });
    };

    blogComment.gridOptions.reGetAll = function () {
        blogComment.init();
    }

    blogComment.gridOptions.onRowSelected = function () {

    }

    blogComment.columnCheckbox = false;
    blogComment.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (blogComment.gridOptions.columnCheckbox) {
            for (var i = 0; i < blogComment.gridOptions.columns.length; i++) {
                //blogComment.gridOptions.columns[i].visible = $("#" + blogComment.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + blogComment.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                blogComment.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = blogComment.gridOptions.columns;
            for (var i = 0; i < blogComment.gridOptions.columns.length; i++) {
                blogComment.gridOptions.columns[i].visible = true;
                var element = $("#" + blogComment.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + blogComment.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < blogComment.gridOptions.columns.length; i++) {
            console.log(blogComment.gridOptions.columns[i].name.concat(".visible: "), blogComment.gridOptions.columns[i].visible);
        }
        blogComment.gridOptions.columnCheckbox = !blogComment.gridOptions.columnCheckbox;
    }
    //Export Report 
    blogComment.exportFile = function () {
        blogComment.gridOptions.advancedSearchData.engine.ExportFile = blogComment.ExportFileClass;
        blogComment.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'blogComment/exportfile', blogComment.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            blogComment.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                blogComment.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //blogComment.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    blogComment.toggleExportForm = function () {
        blogComment.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        blogComment.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        blogComment.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        blogComment.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        blogComment.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleBlog/BlogComment/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    blogComment.rowCountChanged = function () {
        if (!angular.isDefined(blogComment.ExportFileClass.RowCount) || blogComment.ExportFileClass.RowCount > 5000)
            blogComment.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    blogComment.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"blogComment/count", blogComment.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            blogComment.addRequested = false;
            rashaErManage.checkAction(response);
            blogComment.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            blogComment.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

