app.controller("blogContentTagCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var blogContentTag = this;
    blogContentTag.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    blogContentTag.init = function () {
        blogContentTag.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"BlogContenttag/getall", blogContentTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            blogContentTag.busyIndicator.isActive = false;

            blogContentTag.ListItems = response.ListItems;
            blogContentTag.gridOptions.fillData(blogContentTag.ListItems);
            blogContentTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            blogContentTag.gridOptions.totalRowCount = response.TotalRowCount;
            blogContentTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            blogContentTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    blogContentTag.addRequested = false;
    blogContentTag.openAddModal = function () {
        blogContentTag.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'BlogContenttag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            blogContentTag.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleBlog/blogcontentTag/views/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    blogContentTag.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        blogContentTag.addRequested = true;
        blogContentTag.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+'BlogContenttag/add', blogContentTag.selectedItem , 'POST').success(function (response) {
            blogContentTag.addRequested = false;
            blogContentTag.busyIndicator.isActive = false;

            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                blogContentTag.ListItems.unshift(response.Item);
                blogContentTag.gridOptions.fillData(blogContentTag.ListItems);
                blogContentTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogContentTag.busyIndicator.isActive = false;

            blogContentTag.addRequested = false;
        });
    }


    blogContentTag.openEditModal = function () {
        blogContentTag.modalTitle = 'ویرایش';
        if (!blogContentTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'BlogContenttag/GetOne',  blogContentTag.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            blogContentTag.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleBlog/blogcontentTag/views/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    blogContentTag.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        blogContentTag.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+'BlogContenttag/edit',  blogContentTag.selectedItem , 'PUT').success(function (response) {
            blogContentTag.addRequested = true;
            rashaErManage.checkAction(response);
            blogContentTag.busyIndicator.isActive = false;

            if (response.IsSuccess) {
                blogContentTag.addRequested = false;
                blogContentTag.replaceItem(blogContentTag.selectedItem.Id, response.Item);
                blogContentTag.gridOptions.fillData(blogContentTag.ListItems);
                blogContentTag.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogContentTag.busyIndicator.isActive = false;

            blogContentTag.addRequested = false;
        });
    }


    blogContentTag.closeModal = function () {
        $modalStack.dismissAll();
    };

    blogContentTag.replaceItem = function (oldId, newItem) {
        angular.forEach(blogContentTag.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = blogContentTag.ListItems.indexOf(item);
                blogContentTag.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            blogContentTag.ListItems.unshift(newItem);
    }

    blogContentTag.deleteRow = function () {
        if (!blogContentTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                blogContentTag.busyIndicator.isActive = true;
                console.log(blogContentTag.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'BlogContenttag/GetOne',  blogContentTag.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    blogContentTag.selectedItemForDelete = response.Item;
                    console.log(blogContentTag.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'BlogContenttag/delete',  blogContentTag.selectedItemForDelete , 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        blogContentTag.busyIndicator.isActive = false;

                        if (res.IsSuccess) {
                            blogContentTag.replaceItem(blogContentTag.selectedItemForDelete.Id);
                            blogContentTag.gridOptions.fillData(blogContentTag.ListItems);
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

    blogContentTag.searchData = function () {
        blogContentTag.gridOptions.serachData();
    }

    blogContentTag.LinkContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkContentId',
        url: 'BlogContent',
        scope: blogContentTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'  },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }


    blogContentTag.LinkTagIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkTagId',
        url: 'BlogTag',
        scope: blogContentTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' }
            ]
        }
    }
    blogContentTag.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
           { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Content.Title', displayName: 'انتخاب محتوا', sortable: true },
            { name: 'Tag.Title', displayName: 'انتخاب تگ', sortable: true },

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    blogContentTag.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            blogContentTag.focusExpireLockAccount = true;
        });
    };



    blogContentTag.gridOptions.reGetAll = function () {
        blogContentTag.init();
    }

}]);