app.controller("articleContentTagCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var articleContentTag = this;
    articleContentTag.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    articleContentTag.init = function () {
        articleContentTag.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"articleContenttag/getall", articleContentTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            articleContentTag.busyIndicator.isActive = false;

            articleContentTag.ListItems = response.ListItems;
            articleContentTag.gridOptions.fillData(articleContentTag.ListItems , response.resultAccess);
            articleContentTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            articleContentTag.gridOptions.totalRowCount = response.TotalRowCount;
            articleContentTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            articleContentTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    articleContentTag.addRequested = false;
    articleContentTag.openAddModal = function () {
        articleContentTag.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'articleContenttag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            articleContentTag.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulearticle/articlecontentTag/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    articleContentTag.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        articleContentTag.addRequested = true;
        articleContentTag.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+'articleContenttag/add', articleContentTag.selectedItem , 'POST').success(function (response) {
            articleContentTag.addRequested = false;
            articleContentTag.busyIndicator.isActive = false;

            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                articleContentTag.ListItems.unshift(response.Item);
                articleContentTag.gridOptions.fillData(articleContentTag.ListItems);
                articleContentTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleContentTag.busyIndicator.isActive = false;

            articleContentTag.addRequested = false;
        });
    }


    articleContentTag.openEditModal = function () {
        articleContentTag.modalTitle = 'ویرایش';
        if (!articleContentTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'articleContenttag/GetOne',  articleContentTag.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            articleContentTag.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulearticle/articlecontentTag/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    articleContentTag.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        articleContentTag.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+'articleContenttag/edit',  articleContentTag.selectedItem , 'PUT').success(function (response) {
            articleContentTag.addRequested = true;
            rashaErManage.checkAction(response);
            articleContentTag.busyIndicator.isActive = false;

            if (response.IsSuccess) {
                articleContentTag.addRequested = false;
                articleContentTag.replaceItem(articleContentTag.selectedItem.Id, response.Item);
                articleContentTag.gridOptions.fillData(articleContentTag.ListItems);
                articleContentTag.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            articleContentTag.busyIndicator.isActive = false;

            articleContentTag.addRequested = false;
        });
    }


    articleContentTag.closeModal = function () {
        $modalStack.dismissAll();
    };

    articleContentTag.replaceItem = function (oldId, newItem) {
        angular.forEach(articleContentTag.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = articleContentTag.ListItems.indexOf(item);
                articleContentTag.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            articleContentTag.ListItems.unshift(newItem);
    }

    articleContentTag.deleteRow = function () {
        if (!articleContentTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                articleContentTag.busyIndicator.isActive = true;
                console.log(articleContentTag.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'articleContenttag/GetOne',  articleContentTag.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    articleContentTag.selectedItemForDelete = response.Item;
                    console.log(articleContentTag.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'articleContenttag/delete',  articleContentTag.selectedItemForDelete , 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        articleContentTag.busyIndicator.isActive = false;

                        if (res.IsSuccess) {
                            articleContentTag.replaceItem(articleContentTag.selectedItemForDelete.Id);
                            articleContentTag.gridOptions.fillData(articleContentTag.ListItems);
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

    articleContentTag.searchData = function () {
        articleContentTag.gridOptions.serachData();
    }

    articleContentTag.LinkContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkContentId',
        url: 'articleContent',
        scope: articleContentTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }


    articleContentTag.LinkTagIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkTagId',
        url: 'articleTag',
        scope: articleContentTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    articleContentTag.gridOptions = {
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

    articleContentTag.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            articleContentTag.focusExpireLockAccount = true;
        });
    };



    articleContentTag.gridOptions.reGetAll = function () {
        articleContentTag.init();
    }

}]);