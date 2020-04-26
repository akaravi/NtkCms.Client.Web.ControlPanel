app.controller("memberPropertyTypeSiteController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$state', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $state, $window, $filter) {
    var memberPropertyTypeSite = this;
    memberPropertyTypeSite.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
 memberPropertyTypeSite.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    memberPropertyTypeSite.ListItemsSite = [];
    memberPropertyTypeSite.ListItemsPropertyType = [];
    memberPropertyTypeSite.selectUniversalMenuOnUndetectableKey = true;
    if (itemRecordStatus != undefined) memberPropertyTypeSite.itemRecordStatus = itemRecordStatus;
//Selector نوع پرونده
    memberPropertyTypeSite.LinkMemberPropertyTypeIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkMemberPropertyTypeId',
        url: 'memberPropertyType',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        scope: memberPropertyTypeSite,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true,type:'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true,type:'string' }
            ]
        }
    }
    memberPropertyTypeSite.init = function () {
        memberPropertyTypeSite.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"memberPropertyTypeSite/getall", memberPropertyTypeSite.gridOptionsProperty.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            memberPropertyTypeSite.busyIndicator.isActive = false;
            memberPropertyTypeSite.ListItemsPropertyType = response.ListItems;
            memberPropertyTypeSite.gridOptionsProperty.fillData(memberPropertyTypeSite.ListItemsPropertyType, response.resultAccess);
            memberPropertyTypeSite.gridOptionsProperty.currentPageNumber = response.CurrentPageNumber;
            memberPropertyTypeSite.gridOptionsProperty.totalRowCount = response.TotalRowCount;
            memberPropertyTypeSite.gridOptionsProperty.rowPerPage = response.RowPerPage;
            memberPropertyTypeSite.allowedSearch = response.AllowedSearchField;

        }).error(function (data, errCode, c, d) {
            memberPropertyTypeSite.busyIndicator.isActive = false;
            memberPropertyTypeSite.gridOptionsProperty.fillData();
            rashaErManage.checkAction(data, errCode);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"CoreSite/getall", memberPropertyTypeSite.gridOptionsSite.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            memberPropertyTypeSite.busyIndicator.isActive = false;
            memberPropertyTypeSite.ListItemsSite = response.ListItems;
            memberPropertyTypeSite.gridOptionsSite.fillData(memberPropertyTypeSite.ListItemsSite, response.resultAccess);
            memberPropertyTypeSite.gridOptionsSite.currentPageNumber = response.CurrentPageNumber;
            memberPropertyTypeSite.gridOptionsSite.totalRowCount = response.TotalRowCount;
            memberPropertyTypeSite.gridOptionsSite.rowPerPage = response.RowPerPage;
            memberPropertyTypeSite.allowedSearch = response.AllowedSearchField;

        }).error(function (data, errCode, c, d) {
            memberPropertyTypeSite.busyIndicator.isActive = false;
            memberPropertyTypeSite.gridOptionsSite.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    memberPropertyTypeSite.busyIndicator.isActive = true;
    memberPropertyTypeSite.addRequested = false;
    memberPropertyTypeSite.openAddModal = function () {
        memberPropertyTypeSite.filePickerMainImage.filename = "";
        memberPropertyTypeSite.filePickerMainImage.fileId = null;

        memberPropertyTypeSite.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyTypeSite/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            memberPropertyTypeSite.busyIndicator.isActive = false;
            memberPropertyTypeSite.selectedItem = response.Item;
            memberPropertyTypeSite.selectedItem.Title=memberPropertyTypeSite.gridOptionsSite.selectedRow.item.Title;
            memberPropertyTypeSite.selectedItem.LinkCmsSiteId=memberPropertyTypeSite.gridOptionsSite.selectedRow.item.Id;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMember/memberPropertyTypeSite/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberPropertyTypeSite.busyIndicator.isActive = false;

        });
    }

    // Add New Content
    memberPropertyTypeSite.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        memberPropertyTypeSite.busyIndicator.isActive = true;
        memberPropertyTypeSite.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyTypeSite/add', memberPropertyTypeSite.selectedItem, 'POST').success(function (response) {
            memberPropertyTypeSite.addRequested = false;
            memberPropertyTypeSite.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                memberPropertyTypeSite.ListItemsPropertyType.unshift(response.Item);
                memberPropertyTypeSite.gridOptionsProperty.fillData(memberPropertyTypeSite.ListItemsPropertyType);
                memberPropertyTypeSite.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberPropertyTypeSite.busyIndicator.isActive = false;
            memberPropertyTypeSite.addRequested = false;
        });
    }

    memberPropertyTypeSite.openEditModal = function () {
        memberPropertyTypeSite.modalTitle = 'ویرایش';
        if (!memberPropertyTypeSite.gridOptionsProperty.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyTypeSite/GetOne', memberPropertyTypeSite.gridOptionsProperty.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            memberPropertyTypeSite.selectedItem = response.Item;
            memberPropertyTypeSite.filePickerMainImage.filename = null;
            memberPropertyTypeSite.filePickerMainImage.fileId = null;
            if (response.Item.LinkMainImageId != null) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', response.Item.LinkMainImageId, 'GET').success(function (response2) {
                    memberPropertyTypeSite.filePickerMainImage.filename = response2.Item.FileName;
                    memberPropertyTypeSite.filePickerMainImage.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMember/memberPropertyTypeSite/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    memberPropertyTypeSite.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        memberPropertyTypeSite.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyTypeSite/edit', memberPropertyTypeSite.selectedItem, 'PUT').success(function (response) {
            memberPropertyTypeSite.addRequested = true;
            rashaErManage.checkAction(response);
            memberPropertyTypeSite.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                memberPropertyTypeSite.addRequested = false;
                memberPropertyTypeSite.replaceItem(memberPropertyTypeSite.selectedItem.Id, response.Item);
                memberPropertyTypeSite.gridOptionsProperty.fillData(memberPropertyTypeSite.ListItemsPropertyType);
                memberPropertyTypeSite.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            memberPropertyTypeSite.addRequested = false;
            memberPropertyTypeSite.busyIndicator.isActive = false;

        });
    }

    memberPropertyTypeSite.closeModal = function () {
        $modalStack.dismissAll();
    };

    memberPropertyTypeSite.replaceItem = function (oldId, newItem) {
        angular.forEach(memberPropertyTypeSite.ListItemsPropertyType, function (item, key) {
            if (item.Id == oldId) {
                var index = memberPropertyTypeSite.ListItemsPropertyType.indexOf(item);
                memberPropertyTypeSite.ListItemsPropertyType.splice(index, 1);
            }
        });
        if (newItem)
            memberPropertyTypeSite.ListItemsPropertyType.unshift(newItem);
    }

    memberPropertyTypeSite.deleteRow = function () {
        if (!memberPropertyTypeSite.gridOptionsProperty.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                memberPropertyTypeSite.busyIndicator.isActive = true;
                console.log(memberPropertyTypeSite.gridOptionsProperty.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyTypeSite/GetOne', memberPropertyTypeSite.gridOptionsProperty.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    memberPropertyTypeSite.selectedItemForDelete = response.Item;
                    console.log(memberPropertyTypeSite.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyTypeSite/delete', memberPropertyTypeSite.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        memberPropertyTypeSite.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            memberPropertyTypeSite.replaceItem(memberPropertyTypeSite.selectedItemForDelete.Id);
                            memberPropertyTypeSite.gridOptionsProperty.fillData(memberPropertyTypeSite.ListItemsPropertyType);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        memberPropertyTypeSite.busyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    memberPropertyTypeSite.busyIndicator.isActive = false;

                });
            }
        });
    }

    memberPropertyTypeSite.searchData = function () {
        memberPropertyTypeSite.gridOptionsProperty.searchData();

    }
memberPropertyTypeSite.gridOptionsSite = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'ExpireDate', displayName: 'تاریخ انقضا', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'BaseUrl', displayName: 'آدرس پایه', sortable: true, type: 'string' },
            { name: 'Domain', displayName: 'دامنه', sortable: true, type: 'string' },
            { name: 'SubDomain', displayName: 'زیر دامنه', sortable: true, type: 'string' },
            { name: 'OwnerSiteSetStatusTitle', displayName: 'وضعیت', sortable: true, type: 'string' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "Id",
                SortType: 0,
                NeedToRunFakePagination: false,
                TotalRowData: 2000,
                RowPerPage: 200,
                ContentFullSearch: null,
                Filters: [],
                Count: false
            }
        }
    }
    memberPropertyTypeSite.gridOptionsProperty = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: true }
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
                Filters: [],
                Count: false
            }
        }
    }

    memberPropertyTypeSite.gridOptionsProperty.reGetAll = function () {
        memberPropertyTypeSite.init();
    }
    memberPropertyTypeSite.gridOptionsSite.reGetAll = function () {
        memberPropertyTypeSite.init();
    }
    memberPropertyTypeSite.gridOptionsProperty.onRowSelected = function () {

    }
    memberPropertyTypeSite.gridOptionsSite.onRowSelected = function () {
        var node=memberPropertyTypeSite.gridOptionsSite.selectedRow.item;
        memberPropertyTypeSite.selectContent(node);
    }

 //Show Content with Category Id
    memberPropertyTypeSite.selectContent = function (node) {
        memberPropertyTypeSite.gridOptionsProperty.advancedSearchData.engine.Filters = null;
        memberPropertyTypeSite.gridOptionsProperty.advancedSearchData.engine.Filters = [];
        var nodeTitle='';        
        nodeId='';
        if(node !=null && node != undefined)
        {       
            nodeId=node.Id;
            nodeTitle=node.Title;
        }
        var filterModel = {
                Filters: [{
                    PropertyName: "LinkCmsSiteId",
                    IntValue1: nodeId,
                    SearchType: 0,
                }]
               
            };
       
            ajax.call(cmsServerConfig.configApiServerPath+"memberPropertyTypeSite/getall", filterModel, 'POST').success(function (response) {
                memberPropertyTypeSite.ListItemsPropertyType = response.ListItems;
                memberPropertyTypeSite.gridOptionsProperty.fillData(memberPropertyTypeSite.ListItemsPropertyType); // Sending Access as an argument
                memberPropertyTypeSite.gridOptionsProperty.currentPageNumber = response.CurrentPageNumber;
                memberPropertyTypeSite.gridOptionsProperty.totalRowCount = response.TotalRowCount;
                memberPropertyTypeSite.gridOptionsProperty.rowPerPage = response.RowPerPage;
                memberPropertyTypeSite.gridOptionsProperty.maxSize = 5;
            }).error(function (data, errCode, c, d) {
                memberPropertyTypeSite.gridOptionsProperty.fillData();
                rashaErManage.checkAction(data, errCode);
            });
        
    };

    memberPropertyTypeSite.columnCheckbox = false;
    memberPropertyTypeSite.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (memberPropertyTypeSite.gridOptionsProperty.columnCheckbox) {
            for (var i = 0; i < memberPropertyTypeSite.gridOptionsProperty.columns.length; i++) {
                //memberPropertyTypeSite.gridOptionsProperty.columns[i].visible = $("#" + memberPropertyTypeSite.gridOptionsProperty.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + memberPropertyTypeSite.gridOptionsProperty.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                memberPropertyTypeSite.gridOptionsProperty.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = memberPropertyTypeSite.gridOptionsProperty.columns;
            for (var i = 0; i < memberPropertyTypeSite.gridOptionsProperty.columns.length; i++) {
                memberPropertyTypeSite.gridOptionsProperty.columns[i].visible = true;
                var element = $("#" + memberPropertyTypeSite.gridOptionsProperty.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + memberPropertyTypeSite.gridOptionsProperty.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < memberPropertyTypeSite.gridOptionsProperty.columns.length; i++) {
            console.log(memberPropertyTypeSite.gridOptionsProperty.columns[i].name.concat(".visible: "), memberPropertyTypeSite.gridOptionsProperty.columns[i].visible);
        }
        memberPropertyTypeSite.gridOptionsProperty.columnCheckbox = !memberPropertyTypeSite.gridOptionsProperty.columnCheckbox;
    }


    //Export Report 
    memberPropertyTypeSite.exportFile = function () {
        memberPropertyTypeSite.addRequested = true;
        memberPropertyTypeSite.gridOptionsProperty.advancedSearchData.engine.ExportFile = memberPropertyTypeSite.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'memberPropertyTypeSite/exportfile', memberPropertyTypeSite.gridOptionsProperty.advancedSearchData.engine, 'POST').success(function (response) {
            memberPropertyTypeSite.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                memberPropertyTypeSite.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //memberPropertyTypeSite.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }


    //Open Export Report Modal
    memberPropertyTypeSite.toggleExportForm = function () {
        memberPropertyTypeSite.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        memberPropertyTypeSite.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        memberPropertyTypeSite.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        memberPropertyTypeSite.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        memberPropertyTypeSite.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleMember/memberPropertyTypeSite/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    memberPropertyTypeSite.rowCountChanged = function () {
        if (!angular.isDefined(memberPropertyTypeSite.ExportFileClass.RowCount) || memberPropertyTypeSite.ExportFileClass.RowCount > 5000)
            memberPropertyTypeSite.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    memberPropertyTypeSite.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"memberPropertyTypeSite/count", memberPropertyTypeSite.gridOptionsProperty.advancedSearchData.engine, 'POST').success(function (response) {
            memberPropertyTypeSite.addRequested = false;
            rashaErManage.checkAction(response);
            memberPropertyTypeSite.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            memberPropertyTypeSite.gridOptionsProperty.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);

