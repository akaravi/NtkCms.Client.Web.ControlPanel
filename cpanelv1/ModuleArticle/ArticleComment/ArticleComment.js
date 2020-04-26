app.controller("articleCommentCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $window, $filter) {
    var articleComment = this;
    articleComment.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    articleComment.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "articleCommentCtrl") {
            localStorage.setItem('AddRequest', '');
            articleComment.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    articleComment.ContentList = [];

    articleComment.allowedSearch = [];
    if (itemRecordStatus != undefined) articleComment.itemRecordStatus = itemRecordStatus;
    articleComment.init = function () {
        articleComment.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = articleComment.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }

        ajax.call(cmsServerConfig.configApiServerPath+"articleComment/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            articleComment.busyIndicator.isActive = false;
            articleComment.ListItems = response.ListItems;
            articleComment.gridOptions.fillData(articleComment.ListItems , response.resultAccess);
            articleComment.gridOptions.currentPageNumber = response.CurrentPageNumber;
            articleComment.gridOptions.totalRowCount = response.TotalRowCount;
            articleComment.gridOptions.rowPerPage = response.RowPerPage;
            articleComment.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            articleComment.busyIndicator.isActive = false;
            articleComment.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //articleComment.busyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+'articleComment/getall', {}, 'POST').success(function (response) {
        //    articleComment.ContentList = response.ListItems;
        //    articleComment.busyIndicator.isActive = false;
        //});
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        articleComment.checkRequestAddNewItemFromOtherControl(null);
    }
    articleComment.busyIndicator.isActive = true;
    articleComment.addRequested = false;
    articleComment.openAddModal = function () {
        articleComment.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'articleComment/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            articleComment.busyIndicator.isActive = false;
            articleComment.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulearticle/articleComment/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    articleComment.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (articleComment.selectedItem.LinkContentId <= 0) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_content'));
            return;
        }
        articleComment.busyIndicator.isActive = true;
        articleComment.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'articleComment/add', articleComment.selectedItem, 'POST').success(function (response) {
            articleComment.addRequested = false;
            articleComment.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                articleComment.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                articleComment.ListItems.unshift(response.Item);
                articleComment.gridOptions.fillData(articleComment.ListItems);
                articleComment.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleComment.busyIndicator.isActive = false;
            articleComment.addRequested = false;
        });
    }


    articleComment.openEditModal = function () {

        articleComment.modalTitle = 'ویرایش';
        if (!articleComment.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
     
        ajax.call(cmsServerConfig.configApiServerPath+'articleComment/GetOne', articleComment.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            articleComment.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulearticle/articleComment/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    articleComment.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        articleComment.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'articleComment/edit', articleComment.selectedItem, 'PUT').success(function (response) {
            articleComment.addRequested = true;
            rashaErManage.checkAction(response);
            articleComment.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                articleComment.addRequested = false;
                articleComment.replaceItem(articleComment.selectedItem.Id, response.Item);
                articleComment.gridOptions.fillData(articleComment.ListItems);
                articleComment.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleComment.addRequested = false;
        });
    }


    articleComment.closeModal = function () {
        $modalStack.dismissAll();
    };

    articleComment.replaceItem = function (oldId, newItem) {
        angular.forEach(articleComment.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = articleComment.ListItems.indexOf(item);
                articleComment.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            articleComment.ListItems.unshift(newItem);
    }

    articleComment.deleteRow = function () {
        if (!articleComment.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                articleComment.busyIndicator.isActive = true;
                console.log(articleComment.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'articleComment/GetOne', articleComment.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    articleComment.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'articleComment/delete', articleComment.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        articleComment.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            articleComment.replaceItem(articleComment.selectedItemForDelete.Id);
                            articleComment.gridOptions.fillData(articleComment.ListItems);
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

    articleComment.searchData = function () {
        articleComment.gridOptions.serachData();
    }
    articleComment.LinkarticleContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkarticleContentId',
        url: 'articleContent',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: articleComment,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'},
                { name: 'RegisterDate', displayName: 'تاریخ ثبت', sortable: true, type: 'date'}
            ]
        }
    }



    articleComment.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Writer', displayName: 'نام نویسنده', sortable: true, type: "string" },
            { name: 'Comment', displayName: 'کامنت', sortable: true, type: "string" },
            { name: 'virtual_ArticleContent.Title', displayName: 'عنوان مقاله', sortable: true, type: 'string', visible: true },
            { name: 'LinkarticleContentId', displayName: 'کد سیستمی مقاله', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            
           

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    articleComment.gridOptions.advancedSearchData = {};
    articleComment.gridOptions.advancedSearchData.engine = {};
    articleComment.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    articleComment.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    articleComment.gridOptions.advancedSearchData.engine.SortType = 1;
    articleComment.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    articleComment.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    articleComment.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    articleComment.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    articleComment.gridOptions.advancedSearchData.engine.Filters = [];

    articleComment.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            articleComment.focusExpireLockAccount = true;
        });
    };

    articleComment.gridOptions.reGetAll = function () {
        articleComment.init();
    }

    articleComment.columnCheckbox = false;
    articleComment.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (articleComment.gridOptions.columnCheckbox) {
            for (var i = 0; i < articleComment.gridOptions.columns.length; i++) {
                //articleComment.gridOptions.columns[i].visible = $("#" + articleComment.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + articleComment.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                articleComment.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = articleComment.gridOptions.columns;
            for (var i = 0; i < articleComment.gridOptions.columns.length; i++) {
                articleComment.gridOptions.columns[i].visible = true;
                var element = $("#" + articleComment.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + articleComment.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < articleComment.gridOptions.columns.length; i++) {
            console.log(articleComment.gridOptions.columns[i].name.concat(".visible: "), articleComment.gridOptions.columns[i].visible);
        }
        articleComment.gridOptions.columnCheckbox = !articleComment.gridOptions.columnCheckbox;
    }
    //Export Report 
    articleComment.exportFile = function () {
        articleComment.addRequested = true;
        articleComment.gridOptions.advancedSearchData.engine.ExportFile = articleComment.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'articleComment/exportfile', articleComment.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            articleComment.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                articleComment.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //articleComment.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    articleComment.toggleExportForm = function () {
        articleComment.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        articleComment.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        articleComment.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        articleComment.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        articleComment.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleArticle/ArticleComment/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    articleComment.rowCountChanged = function () {
        if (!angular.isDefined(articleComment.ExportFileClass.RowCount) || articleComment.ExportFileClass.RowCount > 5000)
            articleComment.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    articleComment.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"articleComment/count", articleComment.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            articleComment.addRequested = false;
            rashaErManage.checkAction(response);
            articleComment.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            articleComment.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);