app.controller("biographyContentTagCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var biographyContentTag = this;
    biographyContentTag.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }
    biographyContentTag.init = function () {
        biographyContentTag.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"biographyContenttag/getall", biographyContentTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            biographyContentTag.busyIndicator.isActive = false;

            biographyContentTag.ListItems = response.ListItems;
            biographyContentTag.gridOptions.fillData(biographyContentTag.ListItems , response.resultAccess);
            biographyContentTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            biographyContentTag.gridOptions.totalRowCount = response.TotalRowCount;
            biographyContentTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            biographyContentTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    biographyContentTag.addRequested = false;
    biographyContentTag.openAddModal = function () {
        biographyContentTag.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'biographyContenttag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            biographyContentTag.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulebiography/biographycontentTag/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    biographyContentTag.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        biographyContentTag.addRequested = true;
        biographyContentTag.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+'biographyContenttag/add', biographyContentTag.selectedItem , 'POST').success(function (response) {
            biographyContentTag.addRequested = false;
            biographyContentTag.busyIndicator.isActive = false;

            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                biographyContentTag.ListItems.unshift(response.Item);
                biographyContentTag.gridOptions.fillData(biographyContentTag.ListItems);
                biographyContentTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyContentTag.busyIndicator.isActive = false;

            biographyContentTag.addRequested = false;
        });
    }


    biographyContentTag.openEditModal = function () {
        biographyContentTag.modalTitle = 'ویرایش';
        if (!biographyContentTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'biographyContenttag/GetOne',  biographyContentTag.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            biographyContentTag.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulebiography/biographycontentTag/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    biographyContentTag.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        biographyContentTag.busyIndicator.isActive = true;

        ajax.call(cmsServerConfig.configApiServerPath+'biographyContenttag/edit',  biographyContentTag.selectedItem , 'PUT').success(function (response) {
            biographyContentTag.addRequested = true;
            rashaErManage.checkAction(response);
            biographyContentTag.busyIndicator.isActive = false;

            if (response.IsSuccess) {
                biographyContentTag.addRequested = false;
                biographyContentTag.replaceItem(biographyContentTag.selectedItem.Id, response.Item);
                biographyContentTag.gridOptions.fillData(biographyContentTag.ListItems);
                biographyContentTag.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyContentTag.busyIndicator.isActive = false;

            biographyContentTag.addRequested = false;
        });
    }


    biographyContentTag.closeModal = function () {
        $modalStack.dismissAll();
    };

    biographyContentTag.replaceItem = function (oldId, newItem) {
        angular.forEach(biographyContentTag.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = biographyContentTag.ListItems.indexOf(item);
                biographyContentTag.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            biographyContentTag.ListItems.unshift(newItem);
    }

    biographyContentTag.deleteRow = function () {
        if (!biographyContentTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                biographyContentTag.busyIndicator.isActive = true;
                console.log(biographyContentTag.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'biographyContenttag/GetOne',  biographyContentTag.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    biographyContentTag.selectedItemForDelete = response.Item;
                    console.log(biographyContentTag.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'biographyContenttag/delete',  biographyContentTag.selectedItemForDelete , 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        biographyContentTag.busyIndicator.isActive = false;

                        if (res.IsSuccess) {
                            biographyContentTag.replaceItem(biographyContentTag.selectedItemForDelete.Id);
                            biographyContentTag.gridOptions.fillData(biographyContentTag.ListItems);
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

    biographyContentTag.searchData = function () {
        biographyContentTag.gridOptions.serachData();
    }

    biographyContentTag.LinkContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkContentId',
        url: 'biographyContent',
        scope: biographyContentTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }


    biographyContentTag.LinkTagIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkTagId',
        url: 'biographyTag',
        scope: biographyContentTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    biographyContentTag.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true},
           
            { name: 'Content.Title', displayName: 'انتخاب محتوا', sortable: true ,displayForce:true},
            { name: 'Tag.Title', displayName: 'انتخاب تگ', sortable: true, displayForce: true },

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    biographyContentTag.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            biographyContentTag.focusExpireLockAccount = true;
        });
    };



    biographyContentTag.gridOptions.reGetAll = function () {
        biographyContentTag.init();
    }

}]);