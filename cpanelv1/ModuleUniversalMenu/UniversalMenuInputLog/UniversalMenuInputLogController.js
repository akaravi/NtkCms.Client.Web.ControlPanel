app.controller("inputLogGridController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var inputLogCtrl = this;
    inputLogCtrl.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    inputLogCtrl.init = function () {
        inputLogCtrl.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = inputLogCtrl.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        ajax.call(cmsServerConfig.configApiServerPath+"inputLogCtrl/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            inputLogCtrl.busyIndicator.isActive = false;
            inputLogCtrl.ListItems = response.ListItems;
            inputLogCtrl.gridOptions.fillData(inputLogCtrl.ListItems, response.resultAccess);
            inputLogCtrl.gridOptions.currentPageNumber = response.CurrentPageNumber;
            inputLogCtrl.gridOptions.totalRowCount = response.TotalRowCount;
            inputLogCtrl.gridOptions.rowPerPage = response.RowPerPage;
            inputLogCtrl.gridOptions.maxSize = 5;
            inputLogCtrl.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            inputLogCtrl.busyIndicator.isActive = false;
            inputLogCtrl.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //inputLogCtrl.busyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+'articleContent/getall', {}, 'POST').success(function (response) {
        //    inputLogCtrl.CommentList = response.ListItems;
        //    inputLogCtrl.busyIndicator.isActive = false;
        //});
    }

    inputLogCtrl.busyIndicator.isActive = true;
    inputLogCtrl.addRequested = false;
    inputLogCtrl.openAddModal = function () {
        inputLogCtrl.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'inputLogCtrl/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            inputLogCtrl.busyIndicator.isActive = false;
            inputLogCtrl.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleArticle/inputLogCtrl/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    inputLogCtrl.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (!inputLogCtrl.selectedItem.LinkArticleContentId) {
            rashaErManage.showMessage("لطفا خبر را مشخص کنید");
            return;
        }
        inputLogCtrl.busyIndicator.isActive = true;
        inputLogCtrl.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'inputLogCtrl/add', inputLogCtrl.selectedItem, 'POST').success(function (response) {
            inputLogCtrl.addRequested = false;
            inputLogCtrl.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                inputLogCtrl.ListItems.unshift(response.Item);
                inputLogCtrl.gridOptions.fillData(inputLogCtrl.ListItems);
                inputLogCtrl.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            inputLogCtrl.busyIndicator.isActive = false;
            inputLogCtrl.addRequested = false;
        });
    }

    inputLogCtrl.openEditModal = function () {

        inputLogCtrl.modalTitle = 'ویرایش';
        if (!inputLogCtrl.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'inputLogCtrl/GetOne', inputLogCtrl.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            inputLogCtrl.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleArticle/inputLogCtrl/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    inputLogCtrl.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        inputLogCtrl.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'inputLogCtrl/edit', inputLogCtrl.selectedItem, 'PUT').success(function (response) {
            inputLogCtrl.addRequested = true;
            rashaErManage.checkAction(response);
            inputLogCtrl.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                inputLogCtrl.addRequested = false;
                inputLogCtrl.replaceItem(inputLogCtrl.selectedItem.Id, response.Item);
                inputLogCtrl.gridOptions.fillData(inputLogCtrl.ListItems);
                inputLogCtrl.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            inputLogCtrl.addRequested = false;
        });
    }

    inputLogCtrl.closeModal = function () {
        $modalStack.dismissAll();
    };

    inputLogCtrl.replaceItem = function (oldId, newItem) {
        angular.forEach(inputLogCtrl.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = inputLogCtrl.ListItems.indexOf(item);
                inputLogCtrl.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            inputLogCtrl.ListItems.unshift(newItem);
    }

    inputLogCtrl.deleteRow = function () {
        if (!inputLogCtrl.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                inputLogCtrl.busyIndicator.isActive = true;
                console.log(inputLogCtrl.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'inputLogCtrl/GetOne', inputLogCtrl.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    inputLogCtrl.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'inputLogCtrl/delete', inputLogCtrl.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        inputLogCtrl.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            inputLogCtrl.replaceItem(inputLogCtrl.selectedItemForDelete.Id);
                            inputLogCtrl.gridOptions.fillData(inputLogCtrl.ListItems);
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

    inputLogCtrl.searchData = function () {
        inputLogCtrl.gridOptions.searchData();

    }

    inputLogCtrl.LinkArticleContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkArticleContentId',
        filterText: 'ArticleContent',
        url: 'ArticleContent',
        scope: inputLogCtrl,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    inputLogCtrl.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Writer', displayName: 'نام نویسنده', sortable: true, type: 'string', visible: true },
            { name: 'Comment', displayName: 'کامنت', sortable: true, type: 'string', visible: true },
            { name: 'IsGlobalUser', displayName: 'آیا این کاربر سراسری است؟', sortable: true, isCheckBox: true, type: 'boolean', visible: true },
            { name: 'IsActivated', displayName: 'آیا فعال است؟', sortable: true, isCheckBox: true, type: 'boolean', visible: true },
            { name: 'RegisterDate', displayName: 'تاریخ ثبت', sortable: true, isDate: true, type: 'date', visible: true },
            { name: 'ArticleContent.Title', displayName: 'انتخاب محتوا', sortable: true, type: 'link', visible: true ,displayForce:true }
        ],
        data: {},
        multiSelect: false,
        startDate: moment().format(),
        advancedSearchData: {
            engine: {}
        }
    }

    inputLogCtrl.gridOptions.advancedSearchData = {};
    inputLogCtrl.gridOptions.advancedSearchData.engine = {};
    inputLogCtrl.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    inputLogCtrl.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    inputLogCtrl.gridOptions.advancedSearchData.engine.SortType = 0;
    inputLogCtrl.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    inputLogCtrl.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    inputLogCtrl.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    inputLogCtrl.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    inputLogCtrl.gridOptions.advancedSearchData.engine.Filters = [];

    inputLogCtrl.test = 'false';

    inputLogCtrl.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            inputLogCtrl.focusExpireLockAccount = true;
        });
    };

    inputLogCtrl.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            inputLogCtrl.focus = true;
        });
    };

    inputLogCtrl.gridOptions.reGetAll = function () {
        inputLogCtrl.init();
    }

    inputLogCtrl.gridOptions.onRowSelected = function () {

    }

    inputLogCtrl.columnCheckbox = false;
    inputLogCtrl.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (inputLogCtrl.gridOptions.columnCheckbox) {
            for (var i = 0; i < inputLogCtrl.gridOptions.columns.length; i++) {
                //inputLogCtrl.gridOptions.columns[i].visible = $("#" + inputLogCtrl.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + inputLogCtrl.gridOptions.columns[i].name.replace('.','') + "Checkbox");
                //var temp = element[0].checked;
                inputLogCtrl.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = inputLogCtrl.gridOptions.columns;
            for (var i = 0; i < inputLogCtrl.gridOptions.columns.length; i++) {
                inputLogCtrl.gridOptions.columns[i].visible = true;
                var element = $("#" + inputLogCtrl.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + inputLogCtrl.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < inputLogCtrl.gridOptions.columns.length; i++) {
            console.log(inputLogCtrl.gridOptions.columns[i].name.concat(".visible: "), inputLogCtrl.gridOptions.columns[i].visible);
        }
        inputLogCtrl.gridOptions.columnCheckbox = !inputLogCtrl.gridOptions.columnCheckbox;
    }
}]);

