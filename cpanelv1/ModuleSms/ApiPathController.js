app.controller("apiPathCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$rootScope', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $rootScope, $state, $filter) {
    var api = this;

    api.init = function() {
        ajax.call(cmsServerConfig.configApiServerPath+"apipath/getall", api.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            api.ListItems = response.ListItems;
            api.gridOptions.fillData(api.ListItems);
            api.gridOptions.currentPageNumber = response.CurrentPageNumber;
            api.gridOptions.totalRowCount = response.TotalRowCount;
            api.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };


    api.addNew = function () {
        ajax.call(cmsServerConfig.configApiServerPath+'apipath/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            $rootScope.selectedPath = response.Item;
            $rootScope.action = "add";
            $state.go("index.cmspathconfig");
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };


    api.editRow = function () {
        if (!api.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        };
        ajax.call(cmsServerConfig.configApiServerPath+'apipath/GetOne', api.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            $rootScope.selectedPath = response.Item;
            $rootScope.action = "edit";
            $state.go("index.cmspathconfig");
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    
    };


    api.deleteRow = function() {
        var node = api.gridOptions.selectedRow.item;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function(isConfirmed) {
            if (isConfirmed) {
                ajax.call(cmsServerConfig.configApiServerPath+'apipath/GetOne', node.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    api.selectedItemForDelete = response.Item;
                    console.log(api.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'apipath/delete', api.selectedItemForDelete, 'POST').success(function (res) {
                        console.log(res);
                        if (res.IsSuccess) {
                            console.log("Deleted Succesfully !");
                            api.init();
                        }

                    }).error(function(data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                    });
                }).error(function(data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });

            }
        });
    }


    api.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد', sortable: true },
            { name: 'Title', displayName: 'عنوان', sortable: true },
            { name: 'ApiDefaultNumber', displayName: 'شماره پیش فرض', sortable: true },
            { name: 'Status', displayName: 'وضعیت', sortable: true, isCheckBox: true },
            { name: 'ServerConnectionPerMinute', displayName: 'ارسال/دقیقه', sortable: true },
            { name: 'ServerAbilityMinPack', displayName: 'حداقل', sortable: true },
            { name: 'ServerAbilityMaxPack', displayName: 'حداکثر', sortable: true },
            { name: 'ApiMinPathNeedToCheck', displayName: 'نیاز به تایید', sortable: true, isCheckBox: true },
            { name: 'ApiAbilitySendUnicodeMessage', displayName: 'ارسال یونیکد', sortable: true, isCheckBox: true },
            { name: 'ApiAbilitySendNormalMessage', displayName: 'ارسال معمولی', sortable: true, isCheckBox: true },
            { name: 'ApiAllowSuperSeder', displayName: 'جانشین', sortable: true, isCheckBox: true }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }



}]);