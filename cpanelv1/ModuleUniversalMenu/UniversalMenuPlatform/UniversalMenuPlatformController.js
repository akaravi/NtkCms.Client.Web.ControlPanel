app.controller("platformGridController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var platformCtrl = this;;
    platformCtrl.platformTypeArray = [];
    platformCtrl.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    platformCtrl.UninversalMenus = [];
    if (itemRecordStatus != undefined) platformCtrl.itemRecordStatus = itemRecordStatus;
    platformCtrl.init = function () {
        platformCtrl.busyIndicator.isActive = true;

        var engine = {};
        try {
            engine = platformCtrl.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }
        //Set combobox items
        ajax.call(cmsServerConfig.configApiServerPath+"UniversalMenuPlatform/GetEnum", engine, 'POST').success(function (response1) {
            platformCtrl.platformTypeArray = response1;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });

        //set menu items
        ajax.call(cmsServerConfig.configApiServerPath+"universalmenumenuitem/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            platformCtrl.UninversalMenus = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"universalmenuplatform/getall", engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            platformCtrl.busyIndicator.isActive = false;
            platformCtrl.ListItems = response.ListItems;
            // Call FilterEnum to display enum desciption instead of its enum number
            filterEnum(platformCtrl.ListItems, platformCtrl.platformTypeArray);
            platformCtrl.gridOptions.fillData(platformCtrl.ListItems , response.resultAccess);
            platformCtrl.gridOptions.currentPgeNumber = response.CurrentPageNumber;
            platformCtrl.gridOptions.totalRowCount = response.TotalRowCount;
            platformCtrl.gridOptions.rowPerPage = response.RowPerPage;
            platformCtrl.gridOptions.maxSize = 5;
            platformCtrl.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            platformCtrl.busyIndicator.isActive = false;
            platformCtrl.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        //platformCtrl.loadRecordStatusEnum();
        //platformCtrl.busyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+'biographyContent/getall', {}, 'POST').success(function (response) {
        //    platformCtrl.CommentList = response.ListItems;
        //    platformCtrl.busyIndicator.isActive = false;
        //});
        //**********************************************************************************


    }
    //Open Add Modal
    platformCtrl.busyIndicator.isActive = true;
    platformCtrl.addRequested = false;
    platformCtrl.openAddModal = function () {
        platformCtrl.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'universalmenuplatform/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            platformCtrl.busyIndicator.isActive = false;
            platformCtrl.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleUniversalMenu/UniversalMenuPlatform/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    platformCtrl.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        platformCtrl.busyIndicator.isActive = true;
        platformCtrl.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'universalmenuplatform/add', platformCtrl.selectedItem, 'POST').success(function (response) {
            platformCtrl.addRequested = false;
            platformCtrl.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
     
                response.Item.TypeDescription = null;
                var n = platformCtrl.platformTypeArray.length;
                for (var i = 0; i < n; i++) {
                    if (platformCtrl.platformTypeArray[i].Value == response.Item.Type) {
                        response.Item.TypeDescription = platformCtrl.platformTypeArray[i].Description;
                    }
                }
                platformCtrl.ListItems.unshift(response.Item);
                platformCtrl.gridOptions.fillData(platformCtrl.ListItems);
                platformCtrl.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            platformCtrl.busyIndicator.isActive = false;
            platformCtrl.addRequested = false;
        });
    }


    platformCtrl.openEditModal = function () {

        platformCtrl.modalTitle = 'ویرایش';
        if (!platformCtrl.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'universalmenuplatform/GetOne', platformCtrl.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            platformCtrl.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleUniversalMenu/UniversalMenuPlatform/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    platformCtrl.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }

        platformCtrl.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'universalmenuplatform/edit', platformCtrl.selectedItem, 'PUT').success(function (response) {
            platformCtrl.addRequested = true;
            rashaErManage.checkAction(response);
            platformCtrl.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                platformCtrl.addRequested = false;
                response.Item.TypeDescription = null;
                var n = platformCtrl.platformTypeArray.length;
                for (var i = 0; i < n; i++) {
                    if (platformCtrl.platformTypeArray[i].Value == response.Item.Type) {
                        response.Item.TypeDescription = platformCtrl.platformTypeArray[i].Description;
                    }
                }
                platformCtrl.replaceItem(platformCtrl.selectedItem.Id, response.Item);

                platformCtrl.gridOptions.fillData(platformCtrl.ListItems);
                platformCtrl.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            platformCtrl.addRequested = false;
        });
    }

    platformCtrl.closeModal = function () {
        $modalStack.dismissAll();
    };

    platformCtrl.replaceItem = function (oldId, newItem) {
        angular.forEach(platformCtrl.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = platformCtrl.ListItems.indexOf(item);
                platformCtrl.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            platformCtrl.ListItems.unshift(newItem);
    }

    platformCtrl.deleteRow = function () {
        if (!platformCtrl.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }

        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                platformCtrl.busyIndicator.isActive = true;
                console.log(platformCtrl.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'universalmenuplatform/GetOne', platformCtrl.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    platformCtrl.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'universalmenuplatform/delete', platformCtrl.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        platformCtrl.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            platformCtrl.replaceItem(platformCtrl.selectedItemForDelete.Id);
                            platformCtrl.gridOptions.fillData(platformCtrl.ListItems);
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

    platformCtrl.searchData = function () {
        platformCtrl.gridOptions.searchData();

    }

    platformCtrl.LinkBiographyContentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkBiographyContentId',
        url: 'BiographyContent',
        scope: platformCtrl,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    platformCtrl.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'TypeDescription', displayName: 'نوع پلتفرم', sortable: true, type: 'string' }
            //{ name: 'Type', displayName: 'TypeEnum ', sortable: true, type: 'string' },
            //{ name: 'DefaultMenu', displayName: 'منو انتخابی', sortable: true, type: 'string' },
            //{ name: 'IsGlobalUser', displayName: 'آیا این کاربر سراسری است؟', sortable: true, isCheckBox: true, type: 'boolean' },
            //{ name: 'IsActivated', displayName: 'آیا فعال است؟', sortable: true, isCheckBox: true, type: 'boolean' },
            //{ name: 'RegisterDate', displayName: 'تاریخ ثبت', sortable: true, isDateTime: true, type: 'date' },
            //{ name: 'BiographyContent.Title', displayName: 'انتخاب محتوا', sortable: true, type: 'link' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        },
        startDate: moment().format()
    }

    platformCtrl.gridOptions.advancedSearchData = {};
    platformCtrl.gridOptions.advancedSearchData.engine = {};
    platformCtrl.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    platformCtrl.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    platformCtrl.gridOptions.advancedSearchData.engine.SortType = 0;
    platformCtrl.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    platformCtrl.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    platformCtrl.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    platformCtrl.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    platformCtrl.gridOptions.advancedSearchData.engine.Filters = [];

    platformCtrl.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            platformCtrl.focusExpireLockAccount = true;
        });
    };

    platformCtrl.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            platformCtrl.focus = true;
        });
    };

    platformCtrl.gridOptions.reGetAll = function () {
        platformCtrl.init();
    }

    platformCtrl.columnCheckbox = false;
    platformCtrl.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = platformCtrl.gridOptions.columns;
        if (platformCtrl.gridOptions.columnCheckbox) {
            for (var i = 0; i < platformCtrl.gridOptions.columns.length; i++) {
                var element = $("#" + platformCtrl.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                platformCtrl.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < platformCtrl.gridOptions.columns.length; i++) {
                var element = $("#" + platformCtrl.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + platformCtrl.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < platformCtrl.gridOptions.columns.length; i++) {
            console.log(platformCtrl.gridOptions.columns[i].name.concat(".visible: "), platformCtrl.gridOptions.columns[i].visible);
        }
        platformCtrl.gridOptions.columnCheckbox = !platformCtrl.gridOptions.columnCheckbox;
    }

    //Open Export Report Modal
    platformCtrl.toggleExportForm = function () {
        platformCtrl.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        platformCtrl.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        platformCtrl.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        platformCtrl.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleUniversalMenu/UniversalMenuPlatform/report.html',
            scope: $scope
        });
    }


    filterEnum = function (myListItems, myEnums) {
        var n = myListItems.length;
        var m = myEnums.length;
        for (var i = 0; i < n; i++) {
            myListItems[i].TypeDescription = null;
            for (var j = 0; j < m; j++) {
                if (myListItems[i].Type == myEnums[j].Value) {
                    myListItems[i].TypeDescription = myEnums[j].Description;
                }
            }
        }
    }
}]);

