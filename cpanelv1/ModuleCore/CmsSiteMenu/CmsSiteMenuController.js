/// <reference path="../../views/CmsSiteMenu/add.html" />
app.controller("cmsSiteMenuCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var cmsSiteMenu = this;
    cmsSiteMenu.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری ..."
    }

    cmsSiteMenu.selectedNode = {};
    cmsSiteMenu.selectedPage = {};
    cmsSiteMenu.treeMenuConfig = {
        treeMenuContent: null,
        sampleMenuJsonValues: '[{"id":1,"title":"منوی 1","module":"","pageDependency":"","pageId":0,"pageTitle":"","parameter":"","AddressLink":"","nodes":[]}]',
        onSetLink: function (node) {
            $("#setMenuLinkPanel").fadeOut("fast");
            $("#setMenuLinkPanel").fadeIn("fast");
            cmsSiteMenu.selectedNode = {};
            cmsSiteMenu.selectedNode = node;
            var selectedPages = $.grep(cmsSiteMenu.cmsPagesListItems, function (e) { if (e.Id == node.pageId) return e; });
            if (0 < selectedPages.length)
                cmsSiteMenu.selectedPage = selectedPages[0];
        }
    };

    if (itemRecordStatus != undefined) cmsSiteMenu.itemRecordStatus = itemRecordStatus;
    cmsSiteMenu.allowedSearch = [];
    cmsSiteMenu.cmsModuleSitesListItems = [];
    cmsSiteMenu.cmsPageDependencyListItems = [];

    cmsSiteMenu.init = function () {
        cmsSiteMenu.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"WebDesignerMainMenu/getAreaType", {}, 'POST').success(function (response) {
            cmsSiteMenu.AreaType = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"WebDesignerMainMenu/getall", cmsSiteMenu.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSiteMenu.ListItems = response.ListItems;
            cmsSiteMenu.gridOptions.fillData(cmsSiteMenu.ListItems, response.resultAccess);
            cmsSiteMenu.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsSiteMenu.gridOptions.totalRowCount = response.TotalRowCount;
            cmsSiteMenu.gridOptions.rowPerPage = response.RowPerPage;
            cmsSiteMenu.gridOptions.maxSize = 5;
            cmsSiteMenu.allowedSearch = response.AllowedSearchField;
            cmsSiteMenu.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            cmsSiteMenu.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });

        ajax.call(cmsServerConfig.configApiServerPath+'CoreModule/getallmodulename', {}, 'POST').success(function (response) {
            cmsSiteMenu.cmsModuleSitesListItems = response.ListItems;
        }).error(function (data, errCode) {
            rashaErManage.checkAction(data, errCode);
        });

        cmsSiteMenu.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPageDependency/getAll', {}, 'POST').success(function (response) {
            cmsSiteMenu.cmsPageDependencyListItems = response.ListItems;
            cmsSiteMenu.busyIndicator.isActive = false;
        }).error(function (data, errCode) {
            cmsSiteMenu.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    cmsSiteMenu.openAddModal = function () {
        cmsSiteMenu.modalTitle = 'اضافه';
        cmsSiteMenu.addRequested = true;
        cmsSiteMenu.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainMenu/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSiteMenu.selectedItem = response.Item;

            // Create a default menu for the first time
            cmsSiteMenu.treeMenuConfig.treeMenuContent = JSON.parse(cmsSiteMenu.treeMenuConfig.sampleMenuJsonValues);
            //Load cmspages
            ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/getall', { RowPerPage: 200 }, 'POST').success(function (response) {
                cmsSiteMenu.cmsPagesListItems = response.ListItems;
                cmsSiteMenu.addRequested = false;
                cmsSiteMenu.busyIndicator.isActive = false;
                $modal.open({
                    templateUrl: 'cpanelv1/ModuleCore/CmsSiteMenu/add.html',
                    scope: $scope
                });
            }).error(function (data, errCode) {
                cmsSiteMenu.addRequested = false;
                cmsSiteMenu.busyIndicator.isActive = false;
                rashaErManage.checkAction(data, errCode);
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add a New Content
    cmsSiteMenu.addNewContent = function (frm) {
        if (frm.$invalid)
            return;

        cmsSiteMenu.busyIndicator.isActive = true;
        cmsSiteMenu.addRequested = true;
        cmsSiteMenu.selectedItem.JsonValues = $.trim(angular.toJson(cmsSiteMenu.treeMenuConfig.treeMenuContent));
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainMenu/add', cmsSiteMenu.selectedItem, 'POST').success(function (response) {
            cmsSiteMenu.addRequested = false;
            cmsSiteMenu.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsSiteMenu.ListItems.unshift(response.Item);
                cmsSiteMenu.gridOptions.fillData(cmsSiteMenu.ListItems);
                cmsSiteMenu.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsSiteMenu.busyIndicator.isActive = false;
            cmsSiteMenu.addRequested = false;
        });
    }

    // Open Edit Modal
    cmsSiteMenu.openEditModal = function () {
        cmsSiteMenu.modalTitle = 'ویرایش';
        if (!cmsSiteMenu.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        cmsSiteMenu.addRequested = true;
        cmsSiteMenu.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainMenu/GetOne', cmsSiteMenu.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSiteMenu.selectedItem = response.Item;
            try {
                var result = JSON.parse(cmsSiteMenu.selectedItem.JsonValues);
            } catch (e) {
                 result = cmsSiteMenu.sampleMenuJsonValues;
            }
            cmsSiteMenu.pageDependencyListItems = [];
            cmsSiteMenu.treeMenuConfig.treeMenuContent = result;
            //Load cmspages
            ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/getall', { RowPerPage: 200 }, 'POST').success(function (response) {
                cmsSiteMenu.cmsPagesListItems = response.ListItems;
                cmsSiteMenu.addRequested = false;
                cmsSiteMenu.busyIndicator.isActive = false;
                $modal.open({
                    templateUrl: 'cpanelv1/ModuleCore/CmsSiteMenu/edit.html',
                    scope: $scope
                });
            }).error(function (data, errCode) {
                cmsSiteMenu.addRequested = false;
                cmsSiteMenu.busyIndicator.isActive = false;
                rashaErManage.checkAction(data, errCode);
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Edit a Content
    cmsSiteMenu.editContent = function (frm) {
        if (frm.$invalid)
            return;
        cmsSiteMenu.busyIndicator.isActive = true;
        cmsSiteMenu.selectedItem.JsonValues = $.trim(angular.toJson(cmsSiteMenu.treeMenuConfig.treeMenuContent));
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainMenu/edit', cmsSiteMenu.selectedItem, 'PUT').success(function (response) {
            cmsSiteMenu.addRequested = false;
            rashaErManage.checkAction(response);
            cmsSiteMenu.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                cmsSiteMenu.replaceItem(cmsSiteMenu.selectedItem.Id, response.Item);
                cmsSiteMenu.gridOptions.fillData(cmsSiteMenu.ListItems);
                cmsSiteMenu.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsSiteMenu.addRequested = false;
        });
    }

    cmsSiteMenu.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsSiteMenu.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsSiteMenu.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsSiteMenu.ListItems.indexOf(item);
                cmsSiteMenu.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsSiteMenu.ListItems.unshift(newItem);
    }

    cmsSiteMenu.deleteRow = function () {
        if (!cmsSiteMenu.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک ردیف جهت حذف انتخاب کنید!");
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), "آیا می خواهید این منو را حذف کنید؟", function (isConfirmed) {
            if (isConfirmed) {
                cmsSiteMenu.busyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainMenu/GetOne', cmsSiteMenu.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    //rashaErManage.checkAction(response);
                    cmsSiteMenu.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainMenu/delete', cmsSiteMenu.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        cmsSiteMenu.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            cmsSiteMenu.replaceItem(cmsSiteMenu.selectedItemForDelete.Id);
                            cmsSiteMenu.gridOptions.fillData(cmsSiteMenu.ListItems);
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

    cmsSiteMenu.searchData = function () {
        cmsSiteMenu.gridOptions.serachData();
    }

    cmsSiteMenu.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: "integer" },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: "string" },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    cmsSiteMenu.gridOptions.advancedSearchData = {};
    cmsSiteMenu.gridOptions.advancedSearchData.engine = {};
    cmsSiteMenu.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    cmsSiteMenu.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    cmsSiteMenu.gridOptions.advancedSearchData.engine.SortType = 0;
    cmsSiteMenu.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    cmsSiteMenu.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    cmsSiteMenu.gridOptions.advancedSearchData.engine.RowPerPage = 20;
    cmsSiteMenu.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    cmsSiteMenu.gridOptions.advancedSearchData.engine.Filters = [];

    cmsSiteMenu.gridOptions.reGetAll = function () {
        cmsSiteMenu.init();
    }

    cmsSiteMenu.columnCheckbox = false;

    cmsSiteMenu.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (cmsSiteMenu.gridOptions.columnCheckbox) {
            for (var i = 0; i < cmsSiteMenu.gridOptions.columns.length; i++) {
                //cmsSiteMenu.gridOptions.columns[i].visible = $("#" + cmsSiteMenu.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + cmsSiteMenu.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                cmsSiteMenu.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = cmsSiteMenu.gridOptions.columns;
            for (var i = 0; i < cmsSiteMenu.gridOptions.columns.length; i++) {
                cmsSiteMenu.gridOptions.columns[i].visible = true;
                var element = $("#" + cmsSiteMenu.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + cmsSiteMenu.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < cmsSiteMenu.gridOptions.columns.length; i++) {
            cmsSiteMenu.gridOptions.columns[i].name.concat(".visible: ");
            cmsSiteMenu.gridOptions.columns[i].visible;
        }
        cmsSiteMenu.gridOptions.columnCheckbox = !cmsSiteMenu.gridOptions.columnCheckbox;
    }

    cmsSiteMenu.onModuleChange = function (moduleId) {
        cmsSiteMenu.pageDependencyListItems = [];
        var filterValue = {
            PropertyName: "LinkModuleId",
            IntValue1: parseInt(moduleId),
            SearchType: 0
        }
        var engine = { Filters: [] };
        engine.Filters = [];
        engine.Filters.push(filterValue);
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPageDependency/getall', engine, "POST").success(function (response) {
            cmsSiteMenu.pageDependencyListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    cmsSiteMenu.onPageChange = function (selectedPage) {
        //cmsSiteMenu.selectedNode.pageId = selectedPage.Id;
        cmsSiteMenu.selectedNode.pageTitle = selectedPage.Title;
        cmsSiteMenu.selectedNode.pageDependency = selectedPage.LinkPageDependencyGuId;
        cmsSiteMenu.addRequested = true;
        cmsSiteMenu.selectedNode.AddressLink = "در حال بارگذاری...";
        //var domain = selectedPage.virtual_CmsSite.Domain;
        //if (selectedPage.virtual_CmsSite.SubDomain != "")
        //    domain = selectedPage.virtual_CmsSite.SubDomain + '.' + domain;
        //var moduleName = getModuleTitle(selectedPage.virtual_CmsModulePageDependency.LinkModuleId);
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPageDependency/GetOne', selectedPage.LinkPageDependencyGuId, 'GET').success(function (response1) {
            if (response1.IsSuccess) {
                var pageDependencyClassActionName = response1.Item.ClassActionName;
                ajax.call(cmsServerConfig.configApiServerPath+'CoreModule/GetOne', response1.Item.LinkModuleId, 'GET').success(function (response2) {
                    cmsSiteMenu.addRequested = false;
                    rashaErManage.checkAction(response2);
                    var moduleName = response2.Item.ClassName;
                    if (pageDependencyClassActionName != "") {
                        cmsSiteMenu.AddressLink = '/' + moduleName + '/' + pageDependencyClassActionName;
                        if (pageDependencyClassActionName.toLowerCase().indexOf("contentview") >= 0)
                            cmsSiteMenu.AddressLink = cmsSiteMenu.AddressLink + '/' + selectedPage.Id + '/' + selectedPage.Title;
                    }
                    else // It is a home page
                        cmsSiteMenu.AddressLink = ""; //cmsSiteMenu.AddressLink = domain;
                    cmsSiteMenu.AddressLink = cmsSiteMenu.AddressLink.replace("//", "/").toLowerCase();
                    cmsSiteMenu.selectedNode.AddressLink = cmsSiteMenu.AddressLink;
                    var pageDependencies = $.grep(cmsSiteMenu.cmsPageDependencyListItems, function (e) { if (e.Id == cmsSiteMenu.selectedNode.pageDependency) return e; });
                    if (0 < pageDependencies.length) {
                        cmsSiteMenu.selectedNode.pageDependency = pageDependencies[0].ClassActionName;
                        var modules = $.grep(cmsSiteMenu.cmsModuleSitesListItems, function (e) { if (e.Id == pageDependencies[0].LinkModuleId) return e; });
                        if (0 < modules.length) cmsSiteMenu.selectedNode.module = modules[0].Title;
                    }
                    // Search the menu, find the selected node and update JsonValue;
                    $.each(cmsSiteMenu.treeMenuConfig.treeMenuContent, function (index, node) {
                        searchChildren(cmsSiteMenu.selectedNode, node);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    console.log(data);
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });




    }

    function searchChildren(newJsonValues, currentNode) {
        var i,
            currentChild,
            result;

        if (newJsonValues.id == currentNode.Id) {
            currentNode = newJsonValues;
            cmsSiteMenu.selectedItem.JsonValues = $.trim(angular.toJson(cmsSiteMenu.treeMenuConfig.treeMenuContent)); // Update JsonValues
            return currentNode;
        } else {
            // Use a for loop instead of forEach to avoid nested functions
            // Otherwise "return" will not work properly
            if (currentNode.nodes != undefined)
                for (i = 0; i < currentNode.nodes.length; i += 1) {
                    currentChild = currentNode.nodes[i];

                    // Search in the current child
                    result = searchChildren(newJsonValues, currentChild);

                    // Return the result if the node has been found
                    if (result !== false) {
                        //currentNode = newJsonValues;
                        //cmsSiteMenu.selectedItem.JsonValues = $.trim(angular.toJson(cmsSiteMenu.treeMenuConfig.treeMenuContent));
                        return result;
                    }
                }

            // The node has not been found and we have no more options
            return false;
        }
    }

    function getModuleTitle(moduleId) {
        var ret = "";
        $.each(cmsSiteMenu.cmsModuleSitesListItems, function (index, item) {
            if (item.Id == moduleId) {
                ret = item.ClassName;
            }
        });
        return ret;
    }
}]);