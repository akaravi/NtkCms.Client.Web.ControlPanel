app.controller("campaignItemController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var campaignItem = this;
    //For Grid Options
    campaignItem.gridOptions = {};
    campaignItem.selectedItem = {};
    campaignItem.attachedFiles = [];
    campaignItem.attachedFile = "";


    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) campaignItem.itemRecordStatus = itemRecordStatus;


    //news Grid Options
    campaignItem.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }


    //For Show Category Loading Indicator
    campaignItem.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show news Loading Indicator
    campaignItem.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    campaignItem.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };


    campaignItem.treeConfig.currentNode = {};
    campaignItem.treeBusyIndicator = false;

    campaignItem.addRequested = false;

    campaignItem.showGridComment = false;
    campaignItem.newsTitle = "";

    //init Function
    campaignItem.init = function () {
        campaignItem.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = campaignItem.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        campaignItem.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"CampaignItemGroup/getall", { RowPerPage:1000}, 'POST').success(function (response) {
            campaignItem.treeConfig.Items = response.ListItems;
            campaignItem.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        campaignItem.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"CampaignItem/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            campaignItem.ListItems = response.ListItems;
            campaignItem.gridOptions.fillData(campaignItem.ListItems, response.resultAccess); // Sending Access as an argument
            campaignItem.contentBusyIndicator.isActive = false;
            campaignItem.gridOptions.currentPageNumber = response.CurrentPageNumber;
            campaignItem.gridOptions.totalRowCount = response.TotalRowCount;
            campaignItem.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            campaignItem.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            campaignItem.contentBusyIndicator.isActive = false;
        });
        ajax.call(cmsServerConfig.configApiServerPath+"newsTag/GetViewModel", "", 'GET').success(function (response) {    //Get a ViewModel for newsTag
            campaignItem.ModuleTag = response.Item;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });

    };

  
    // Open Add Category Modal 
    campaignItem.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        campaignItem.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CampaignItemGroup/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            campaignItem.selectedItem = response.Item;
            //Set dataForTheTree
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                campaignItem.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCampaignItemGroupId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(campaignItem.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/Modulecampaign/CampaignItemGroup/add.html',
                        scope: $scope
                    });
                    campaignItem.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //-----
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Open Edit Category Modal
    campaignItem.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        campaignItem.addRequested = false;
        campaignItem.modalTitle = 'ویرایش';
        if (!campaignItem.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        campaignItem.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CampaignItemGroup/GetOne', campaignItem.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            campaignItem.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            campaignItem.selectedItem = response.Item;
            //Set dataForTheTree
            campaignItem.selectedNode = [];
            campaignItem.expandedNodes = [];
            campaignItem.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                campaignItem.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCampaignItemGroupId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(campaignItem.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (campaignItem.selectedItem.LinkMainImageId > 0)
                        campaignItem.onSelection({ Id: campaignItem.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/Modulecampaign/CampaignItemGroup/edit.html',
                        scope: $scope
                    });
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //---
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Category
    campaignItem.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        campaignItem.categoryBusyIndicator.isActive = true;
        campaignItem.addRequested = true;
        campaignItem.selectedItem.LinkParentId = null;
        if (campaignItem.treeConfig.currentNode != null)
            campaignItem.selectedItem.LinkParentId = campaignItem.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'CampaignItemGroup/add', campaignItem.selectedItem, 'POST').success(function (response) {
            campaignItem.addRequested = false;
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                campaignItem.gridOptions.advancedSearchData.engine.Filters = null;
                campaignItem.gridOptions.advancedSearchData.engine.Filters = [];
                campaignItem.gridOptions.reGetAll();
                campaignItem.closeModal();
            }
            campaignItem.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignItem.addRequested = false;
            campaignItem.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    campaignItem.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        campaignItem.categoryBusyIndicator.isActive = true;
        campaignItem.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CampaignItemGroup/edit', campaignItem.selectedItem, 'PUT').success(function (response) {
            //campaignItem.showbusy = false;
            campaignItem.treeConfig.showbusy = false;
            campaignItem.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignItem.treeConfig.currentNode.Title = response.Item.Title;
                campaignItem.closeModal();
            }
            campaignItem.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignItem.addRequested = false;
            campaignItem.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    campaignItem.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = campaignItem.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                campaignItem.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'CampaignItemGroup/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    campaignItem.selectedItemForDelete = response.Item;
                    console.log(campaignItem.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'CampaignItemGroup/delete', campaignItem.selectedItemForDelete, 'POST').success(function (res) {
                        campaignItem.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //campaignItem.replaceCategoryItem(campaignItem.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            campaignItem.gridOptions.advancedSearchData.engine.Filters = null;
                            campaignItem.gridOptions.advancedSearchData.engine.Filters = [];
                            campaignItem.gridOptions.fillData();
                            campaignItem.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        campaignItem.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    campaignItem.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    campaignItem.treeConfig.onNodeSelect = function () {
        var node = campaignItem.treeConfig.currentNode;
        campaignItem.showGridComment = false;
        campaignItem.selectContent(node);

    };
    //Show Content with Category Id
    campaignItem.selectContent = function (node) {
        campaignItem.gridOptions.advancedSearchData.engine.Filters = null;
        campaignItem.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            campaignItem.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            campaignItem.contentBusyIndicator.isActive = true;
            //campaignItem.gridOptions.advancedSearchData = {};
            campaignItem.gridOptions.advancedSearchData.engine.Filters = null;
            campaignItem.gridOptions.advancedSearchData.engine.Filters = [];
            campaignItem.attachedFiles = null;
            campaignItem.attachedFiles = [];
            var s = {
                PropertyName: "LinkCampaignItemGroupId",
                IntValue1: node.Id,
                SearchType: 0
            }
            campaignItem.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"CampaignItem/getall", campaignItem.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            campaignItem.contentBusyIndicator.isActive = false;
            campaignItem.ListItems = response.ListItems;
            campaignItem.gridOptions.fillData(campaignItem.ListItems, response.resultAccess); // Sending Access as an argument
            campaignItem.gridOptions.currentPageNumber = response.CurrentPageNumber;
            campaignItem.gridOptions.totalRowCount = response.TotalRowCount;
            campaignItem.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            campaignItem.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    campaignItem.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = campaignItem.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Campain_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }

        campaignItem.addRequested = false;
        campaignItem.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CampaignItem/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            campaignItem.selectedItem = response.Item;
            campaignItem.selectedItem.LinkCampaignItemGroupId = node.Id;
            //campaignItem.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCampaign/CampaignItem/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    campaignItem.openEditModel = function () {
        if (buttonIsPressed) { return };
        campaignItem.addRequested = false;
        campaignItem.modalTitle = 'ویرایش';
        if (!campaignItem.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CampaignItem/GetOne', campaignItem.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            campaignItem.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCampaign/CampaignItem/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    campaignItem.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        campaignItem.categoryBusyIndicator.isActive = true;
        campaignItem.addRequested = true;
        if (campaignItem.selectedItem.LinkCampaignItemGroupId == null || campaignItem.selectedItem.LinkCampaignItemGroupId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Campain_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'CampaignItem/add', campaignItem.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            campaignItem.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                campaignItem.ListItems.unshift(response.Item);
                campaignItem.gridOptions.fillData(campaignItem.ListItems);
                campaignItem.closeModal();
               }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignItem.addRequested = false;
            campaignItem.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    campaignItem.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        campaignItem.categoryBusyIndicator.isActive = true;
        campaignItem.addRequested = true;
       
        if (campaignItem.selectedItem.LinkCampaignItemGroupId == null || campaignItem.selectedItem.LinkCampaignItemGroupId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Campain_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'CampaignItem/edit', campaignItem.selectedItem, 'PUT').success(function (response) {
            campaignItem.categoryBusyIndicator.isActive = false;
            campaignItem.addRequested = false;
            campaignItem.treeConfig.showbusy = false;
            campaignItem.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignItem.replaceItem(campaignItem.selectedItem.Id, response.Item);
                campaignItem.gridOptions.fillData(campaignItem.ListItems);
                campaignItem.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignItem.addRequested = false;
            campaignItem.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a news Content 
    campaignItem.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!campaignItem.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        campaignItem.treeConfig.showbusy = true;
        campaignItem.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                campaignItem.categoryBusyIndicator.isActive = true;
                //console.log(campaignItem.gridOptions.selectedRow.item);
                campaignItem.showbusy = true;
                campaignItem.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"CampaignItem/GetOne", campaignItem.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    campaignItem.showbusy = false;
                    campaignItem.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    campaignItem.selectedItemForDelete = response.Item;
                    //console.log(campaignItem.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"CampaignItem/delete", campaignItem.selectedItemForDelete, 'POST').success(function (res) {
                        campaignItem.categoryBusyIndicator.isActive = false;
                        campaignItem.treeConfig.showbusy = false;
                        campaignItem.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            campaignItem.replaceItem(campaignItem.selectedItemForDelete.Id);
                            campaignItem.gridOptions.fillData(campaignItem.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        campaignItem.treeConfig.showbusy = false;
                        campaignItem.showIsBusy = false;
                        campaignItem.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    campaignItem.treeConfig.showbusy = false;
                    campaignItem.showIsBusy = false;
                    campaignItem.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }

    //Confirm/UnConfirm news Content
    campaignItem.confirmUnConfirmcampaignItem = function () {
        if (!campaignItem.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'CampaignItem/GetOne', campaignItem.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            campaignItem.selectedItem = response.Item;
            campaignItem.selectedItem.IsAccepted = (response.Item.IsAccepted == true) ? false : true;
            ajax.call(cmsServerConfig.configApiServerPath+'CampaignItem/edit', campaignItem.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = campaignItem.ListItems.indexOf(campaignItem.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        campaignItem.ListItems[index] = response2.Item;
                    }
                    console.log("Confirm/UnConfirm Successfully");
                }

            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

   

    //Replace Item OnDelete/OnEdit Grid Options
    campaignItem.replaceItem = function (oldId, newItem) {
        angular.forEach(campaignItem.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = campaignItem.ListItems.indexOf(item);
                campaignItem.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            campaignItem.ListItems.unshift(newItem);
    }

 
    campaignItem.searchData = function () {
        campaignItem.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"CampaignItem/getall", campaignItem.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            campaignItem.categoryBusyIndicator.isActive = false;
            campaignItem.ListItems = response.ListItems;
            campaignItem.gridOptions.fillData(campaignItem.ListItems);
            campaignItem.gridOptions.currentPageNumber = response.CurrentPageNumber;
            campaignItem.gridOptions.totalRowCount = response.TotalRowCount;
            campaignItem.gridOptions.rowPerPage = response.RowPerPage;
            campaignItem.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            campaignItem.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    campaignItem.addRequested = false;
    campaignItem.closeModal = function () {
        $modalStack.dismissAll();
    };

    campaignItem.showIsBusy = false;

    //For reInit Categories
    campaignItem.gridOptions.reGetAll = function () {
        if (campaignItem.gridOptions.advancedSearchData.engine.Filters.length > 0) campaignItem.searchData();
        else campaignItem.init();
    };

    campaignItem.isCurrentNodeEmpty = function () {
        return !angular.equals({}, campaignItem.treeConfig.currentNode);
    }

  
    campaignItem.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    campaignItem.whatcolor = function (progress) {
        wdth = Math.floor(progress * 100);
        if (wdth >= 0 && wdth < 30) {
            return 'danger';
        } else if (wdth >= 30 && wdth < 50) {
            return 'warning';
        } else if (wdth >= 50 && wdth < 85) {
            return 'info';
        } else {
            return 'success';
        }
    }

    campaignItem.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
  
    campaignItem.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    campaignItem.columnCheckbox = false;
    campaignItem.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (campaignItem.gridOptions.columnCheckbox) {
            for (var i = 0; i < campaignItem.gridOptions.columns.length; i++) {
                //campaignItem.gridOptions.columns[i].visible = $("#" + campaignItem.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + campaignItem.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                campaignItem.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = campaignItem.gridOptions.columns;
            for (var i = 0; i < campaignItem.gridOptions.columns.length; i++) {
                campaignItem.gridOptions.columns[i].visible = true;
                var element = $("#" + campaignItem.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + campaignItem.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < campaignItem.gridOptions.columns.length; i++) {
            console.log(campaignItem.gridOptions.columns[i].name.concat(".visible: "), campaignItem.gridOptions.columns[i].visible);
        }
        campaignItem.gridOptions.columnCheckbox = !campaignItem.gridOptions.columnCheckbox;
    }
    //Export Report 
    campaignItem.exportFile = function () {
        campaignItem.addRequested = true;
        campaignItem.gridOptions.advancedSearchData.engine.ExportFile = campaignItem.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'CampaignItem/exportfile', campaignItem.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            campaignItem.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignItem.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //campaignItem.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    campaignItem.toggleExportForm = function () {
        campaignItem.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        campaignItem.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        campaignItem.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        campaignItem.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        campaignItem.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCampaign/CampaignItem/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    campaignItem.rowCountChanged = function () {
        if (!angular.isDefined(campaignItem.ExportFileClass.RowCount) || campaignItem.ExportFileClass.RowCount > 5000)
            campaignItem.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    campaignItem.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"CampaignItem/count", campaignItem.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            campaignItem.addRequested = false;
            rashaErManage.checkAction(response);
            campaignItem.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            campaignItem.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    campaignItem.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            campaignItem.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

}]);
