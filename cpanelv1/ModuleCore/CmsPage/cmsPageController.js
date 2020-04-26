app.controller("cmsPageGridCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$state', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $state, $window, $filter) {
    var cmsPagegrd = this;

    cmsPagegrd.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }

    cmsPagegrd.cmsPageTemplatesListItems = [];
    cmsPagegrd.AllPageDependenciesListItems = [];
    cmsPagegrd.CmsModuleSitesListItems = [];
    cmsPagegrd.selectedItem = {};
    cmsPagegrd.selectedItemTools = {};
    cmsPagegrd.selectedItem.LinkModuleId = {};

    if (itemRecordStatus != undefined) cmsPagegrd.itemRecordStatus = itemRecordStatus;

    cmsPagegrd.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"WebDesignerMainPage/GetAllEnumAction", {}, 'POST').success(function (response) {
            cmsPagegrd.Action = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPageTemplate/getall', {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsPagegrd.cmsPageTemplatesListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
        cmsPagegrd.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"WebDesignerMainPageDependency/getall", cmsPagegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response2) {
            rashaErManage.checkAction(response2);
            cmsPagegrd.ListItems = response2.ListItems;
            cmsPagegrd.gridOptions.fillData(cmsPagegrd.ListItems, response2.resultAccess);
            cmsPagegrd.gridOptions.currentPageNumber = response2.CurrentPageNumber;
            cmsPagegrd.gridOptions.totalRowCount = response2.TotalRowCount;
            cmsPagegrd.gridOptions.rowPerPage = response2.RowPerPage;
            cmsPagegrd.gridOptions.maxSize = 5;
            cmsPagegrd.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            cmsPagegrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    cmsPagegrd.goTohtmlbuilder = function (item) {
        var token=localStorage.getItem("userGlobaltoken");
        //var urlTemplate = 'HtmlBuilder/?id=' + item.Id+ '&token=' + token;
        var urlTemplate = 'HtmlBuilder2/token/?id=' + item.Id+ '&token=' + token;
        localStorage.setItem("pageItem", $.trim(angular.toJson(item)));
        var win = window.open(urlTemplate, '_blank');
        win.focus();
    }
    cmsPagegrd.goTohtmlbuilderRender = function (item) {
        var urlTemplate = '/page/' + item.Id;
        localStorage.setItem("pageItem", $.trim(angular.toJson(item)));
        var win = window.open(urlTemplate, '_blank');
        win.focus();
    }

    cmsPagegrd.UtilityToolsInfo = "";
    cmsPagegrd.openUtilityToolseModal = function () {

            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsPage/UtilityTools.html',
                scope: $scope
            });
    }
    cmsPagegrd.runUtilityTools = function (frm) {
        if (frm.$invalid)
            return;
        cmsPagegrd.UtilityToolsInfo = "در حال بررسی ....";
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/UtilityTools', cmsPagegrd.selectedItemTools, 'Post').success(function (response) {
            rashaErManage.checkAction(response);
            cmsPagegrd.UtilityToolsInfo = response.ErrorMessage;
        }).error(function (data2, errCode2, c2, d2) {
            rashaErManage.checkAction(data2);
            cmsPagegrd.UtilityToolsInfo = response.ErrorMessage;
        });
    }

    // Open Add a New Content Modal
    cmsPagegrd.addRequested = false;

    cmsPagegrd.openAddModal = function () {
        cmsPagegrd.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/GetViewModel', '', 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsPagegrd.selectedItem = response.Item;

            // Select Canvas as default theme
            $.each(cmsPagegrd.cmsPageTemplatesListItems, function (index, item) {
                if (item.Title == "Canvas" || item.Title == "canvas")
                    cmsPagegrd.selectedItem.LinkPageTemplateId = item.Id
            });

            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsPage/view/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add a New Content
    cmsPagegrd.addNewRow = function (frm) {
        if (frm.$invalid)
            return;
        cmsPagegrd.addRequested = true;
        cmsPagegrd.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/add', cmsPagegrd.selectedItem, 'POST').success(function (response) {
            cmsPagegrd.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsPagegrd.pageList.push(response.Item);
                cmsPagegrd.closeModal();
            }
            cmsPagegrd.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsPagegrd.addRequested = false;
        });
    }

    cmsPagegrd.saveAndGoTohtmlbuilder = function (frm) {
        if (frm.$invalid)
            return;
        cmsPagegrd.addRequested = true;
        if (frm.$name == "frmCmsPageAdd") {   // Functions was called from add modal
            ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/add', cmsPagegrd.selectedItem, 'POST').success(function (response) {
                cmsPagegrd.addRequested = false;
                rashaErManage.checkAction(response);
                if (response.IsSuccess) {
                    cmsPagegrd.pageList.unshift(response.Item);
                    cmsPagegrd.closeModal();
                    // Go to htmlBuilder -----------------------
                    cmsPagegrd.goTohtmlbuilder(response.Item);
                    //------------------------------------------
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                cmsPagegrd.addRequested = false;
            });
        }
        else {  // Functions was called from edit modal
            ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/edit', cmsPagegrd.selectedItem, 'PUT').success(function (response) {
                cmsPagegrd.addRequested = false;
                rashaErManage.checkAction(response);
                if (response.IsSuccess) {
                    cmsPagegrd.replaceItem(cmsPagegrd.selectedItem.Id, response.Item);
                    cmsPagegrd.closeModal();
                    // Go to htmlBuilder -----------------------
                    cmsPagegrd.goTohtmlbuilder(response.Item);
                    //------------------------------------------
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                cmsPagegrd.addRequested = false;
            });
        }
    }

    // Open Edit Content Modal
    cmsPagegrd.openEditModal = function (item) {
        cmsPagegrd.modalTitle = 'ویرایش';
        if (!item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/GetOne', item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsPagegrd.selectedItem = response.Item;
            cmsPagegrd.selectedItem.LinkModuleId = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsPage/edit.html',
                scope: $scope
            });
            // Load Values Backward
            cmsPagegrd.LoadModuleOfDependency(item.LinkPageDependencyGuId);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit Content Modal
    cmsPagegrd.editRow = function (frm) {
        if (frm.$invalid)
            return;
        cmsPagegrd.busyIndicator.isActive = true;
        cmsPagegrd.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/edit', cmsPagegrd.selectedItem, 'PUT').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsPagegrd.addRequested = false;
                cmsPagegrd.busyIndicator.isActive = false;
                cmsPagegrd.replaceItem(cmsPagegrd.selectedItem.Id, response.Item);
                cmsPagegrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsPagegrd.addRequested = false;
        });
    }

    cmsPagegrd.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsPagegrd.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsPagegrd.pageList, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsPagegrd.pageList.indexOf(item);
                cmsPagegrd.pageList.splice(index, 1);
            }
        });
        if (newItem)
            cmsPagegrd.pageList.push(newItem);
    }

    cmsPagegrd.deleteRow = function (item) {
        if (!item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        cmsPagegrd.busyIndicator.isActive = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/GetOne', item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsPagegrd.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/delete', cmsPagegrd.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsPagegrd.replaceItem(cmsPagegrd.selectedItemForDelete.Id);
                        }
                        cmsPagegrd.busyIndicator.isActive = false;
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });
    }

    cmsPagegrd.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
             { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'TitleML', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'ClassActionName', displayName: 'عنوان کلاس', sortable: true, type: 'string' },
            { name: 'virtual_CmsModule.Title', displayName: 'ماژول', sortable: true, type: 'string', displayForce: true },
            { name: 'ActionButtons', displayName: 'عملیات', sortable: true, type: 'string', visible: true, width: '155px', displayForce: true, template: '<button type="button" class="btn btn-primary" ng-click="cmsPagegrd.redirectToBoxes(x.Id, x.Title, x.ClassActionName, x.virtual_CmsModule.Id, x.virtual_CmsModule.Title)"  class="btn btn-primary"><i class="fa fa-plus-circle" aria-hidden="true"></i>&nbsp;صفحات</button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "ClassActionName",
                SortType: 6,
                NeedToRunFakePagination: false,
                TotalRowData: 2000,
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }

    cmsPagegrd.gridOptions.reGetAll = function () {
        cmsPagegrd.init();
    }

    cmsPagegrd.onModuleChange = function (moduleId) {
        cmsPagegrd.PageDependenciesListItems = [];
        var Filter_value = {
            PropertyName: "LinkModuleId",
            IntValue1: parseInt(moduleId),
            SearchType: 0
        }
        cmsPagegrd.advancedSearchData.engine.Filters = null;
        cmsPagegrd.advancedSearchData.engine.Filters = [];
        cmsPagegrd.advancedSearchData.engine.Filters.push(Filter_value);
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPageDependency/getall', cmsPagegrd.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            cmsPagegrd.PageDependenciesListItems = response.ListItems;
            // خودبخود فراخوانی نمی شود LoadModuleOfDependency اگر ماژول انتخاب شده فقط یک وابستگی داشته باشد تابع 
            if (response.ListItems.length == 1)
                cmsPagegrd.selectedItem.LinkPageDependencyGuId = response.ListItems[0].Id;
        }).error(function (data, errCode, c, d) {
            cmsPagegrd.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    cmsPagegrd.LoadModuleOfDependency = function (pageDependencyId) {
        if (pageDependencyId != null) {
            cmsPagegrd.selectedItem.selectedModule = null;
            ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPageDependency/GetOne', pageDependencyId, 'GET').success(function (response1) {
                if (response1.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreModule/GetOne', response1.Item.LinkModuleId, 'GET').success(function (response2) {
                        rashaErManage.checkAction(response2);
                        cmsPagegrd.selectedItem.LinkModuleId = response2.Item.Id;
                        cmsPagegrd.selectedItem.LinkPageDependencyGuId = pageDependencyId;
                        cmsPagegrd.onModuleChange(cmsPagegrd.selectedItem.LinkModuleId);
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                        console.log(data);
                    });
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }
    }

    PageTemplateTitle = function (PageTemplateId) {
        for (var i = 0; i < cmsPagegrd.cmsPageTemplatesListItems.length; i++) {
            if (cmsPagegrd.cmsPageTemplatesListItems[i].Id === PageTemplateId)
                return cmsPagegrd.cmsPageTemplatesListItems[i].Folder;
        }
    }
    cmsPagegrd.redirectToBoxes = function (dependencyId, dependencyTitle, classActioName, moduleId, moduleTitle) {
        $state.go('index.cmspagesdesign', { dependencyId: dependencyId, dependencyTitle: dependencyTitle, classActioName: classActioName, moduleId: moduleId, moduleTitle: moduleTitle });
        }

    //Get TotalRowCount
    cmsPagegrd.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"WebDesignerMainPageDependency/count", cmsPagegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsPagegrd.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            cmsPagegrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
//Export Report 
    cmsPagegrd.exportFile = function () {
        cmsPagegrd.gridOptions.advancedSearchData.engine.ExportFile = cmsPagegrd.ExportFileClass;
        cmsPagegrd.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPageDependency/exportfile', cmsPagegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            cmsPagegrd.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsPagegrd.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //cmsPagegrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    cmsPagegrd.toggleExportForm = function () {
        cmsPagegrd.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        cmsPagegrd.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        cmsPagegrd.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        cmsPagegrd.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        cmsPagegrd.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCore/CmsPage/report.html',
            scope: $scope
        });
    }
}]);