app.controller("biographyShareServerCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var biographyShareServerCategory = this;
    //For Grid Options
    biographyShareServerCategory.gridOptions = {};
    biographyShareServerCategory.selectedItem = {};
    biographyShareServerCategory.attachedFiles = [];
    biographyShareServerCategory.attachedFile = "";

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    // درخواست اضافه کردن ردیف جدید از کنترل های دیگر
    biographyShareServerCategory.checkRequestAddNewItemFromOtherControl = function (id) {
        var item = localStorage.getItem('AddRequest');
        if (item == undefined || item == null || item == '')
            return;
        var request = JSON.parse(item);
        if (request == undefined || request == null)
            return;
        if (request.controller == "biographyShareServerCategoryController") {
            localStorage.setItem('AddRequest', '');
            biographyShareServerCategory.openAddModal();
        }
        else
            localStorage.getItem('AddRequestID', id);
    }
    if (itemRecordStatus != undefined) biographyShareServerCategory.itemRecordStatus = itemRecordStatus;

    
    biographyShareServerCategory.LinkShareMainAdminSettingIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkServerCategoryId',
        url: 'BiographyCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        showAddDialog: false,
        scope: biographyShareServerCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    //biography Grid Options
                      
    biographyShareServerCategory.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'virtual_ServerCategory.Title', displayName: 'عنوان دسته', sortable: true, type: 'string', visible: 'true' },
            { name: 'LinkServerCategoryId', displayName: 'کد سیستمی دسته', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }
    //For Show Category Loading Indicator
    biographyShareServerCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show biography Loading Indicator
    biographyShareServerCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    biographyShareServerCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    biographyShareServerCategory.treeConfig.currentNode = {};
    biographyShareServerCategory.treeBusyIndicator = false;

    biographyShareServerCategory.addRequested = false;

    biographyShareServerCategory.showGridComment = false;
    biographyShareServerCategory.biographyTitle = "";

    //init Function
    biographyShareServerCategory.init = function () {
        biographyShareServerCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = biographyShareServerCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        biographyShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"BiographyShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            biographyShareServerCategory.treeConfig.Items = response.ListItems;
            biographyShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        biographyShareServerCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"biographyShareServerCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            biographyShareServerCategory.ListItems = response.ListItems;
            biographyShareServerCategory.gridOptions.fillData(biographyShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            biographyShareServerCategory.contentBusyIndicator.isActive = false;
            biographyShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            biographyShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            biographyShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            biographyShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            biographyShareServerCategory.contentBusyIndicator.isActive = false;
            });
        // چک کردن درخواست اضافه کردن ردیف جدید از کنترلر های دیگر
        biographyShareServerCategory.checkRequestAddNewItemFromOtherControl(null);
  
    };

    // Open Add Category Modal 
    biographyShareServerCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        biographyShareServerCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'BiographyShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            biographyShareServerCategory.selectedItem = response.Item;
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
                biographyShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(biographyShareServerCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleBiography/BiographyShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    biographyShareServerCategory.addRequested = false;
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
    biographyShareServerCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        biographyShareServerCategory.addRequested = false;
        biographyShareServerCategory.modalTitle = 'ویرایش';
        if (!biographyShareServerCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        biographyShareServerCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'BiographyShareMainAdminSetting/GetOne', biographyShareServerCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            biographyShareServerCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            biographyShareServerCategory.selectedItem = response.Item;
            //Set dataForTheTree
            biographyShareServerCategory.selectedNode = [];
            biographyShareServerCategory.expandedNodes = [];
            biographyShareServerCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                biographyShareServerCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(biographyShareServerCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (biographyShareServerCategory.selectedItem.LinkMainImageId > 0)
                        biographyShareServerCategory.onSelection({ Id: biographyShareServerCategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleBiography/BiographyShareMainAdminSetting/edit.html',
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
    biographyShareServerCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        biographyShareServerCategory.categoryBusyIndicator.isActive = true;
        biographyShareServerCategory.addRequested = true;
        biographyShareServerCategory.selectedItem.LinkParentId = null;
        if (biographyShareServerCategory.treeConfig.currentNode != null)
            biographyShareServerCategory.selectedItem.LinkParentId = biographyShareServerCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'BiographyShareMainAdminSetting/add', biographyShareServerCategory.selectedItem, 'POST').success(function (response) {
            biographyShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                biographyShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                biographyShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                biographyShareServerCategory.gridOptions.reGetAll();
                biographyShareServerCategory.closeModal();
            }
            biographyShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyShareServerCategory.addRequested = false;
            biographyShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    biographyShareServerCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        biographyShareServerCategory.categoryBusyIndicator.isActive = true;
        biographyShareServerCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'BiographyShareMainAdminSetting/edit', biographyShareServerCategory.selectedItem, 'PUT').success(function (response) {
            //biographyShareServerCategory.showbusy = false;
            biographyShareServerCategory.treeConfig.showbusy = false;
            biographyShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                biographyShareServerCategory.treeConfig.currentNode.Title = response.Item.Title;
                biographyShareServerCategory.closeModal();
            }
            biographyShareServerCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyShareServerCategory.addRequested = false;
            biographyShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    biographyShareServerCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = biographyShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                biographyShareServerCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'BiographyShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    biographyShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(biographyShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'BiographyShareMainAdminSetting/delete', biographyShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        biographyShareServerCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //biographyShareServerCategory.replaceCategoryItem(biographyShareServerCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            biographyShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            biographyShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            biographyShareServerCategory.gridOptions.fillData();
                            biographyShareServerCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        biographyShareServerCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    biographyShareServerCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    biographyShareServerCategory.treeConfig.onNodeSelect = function () {
        var node = biographyShareServerCategory.treeConfig.currentNode;
        biographyShareServerCategory.showGridComment = false;
        biographyShareServerCategory.selectContent(node);

    };
    //Show Content with Category Id
    biographyShareServerCategory.selectContent = function (node) {
        biographyShareServerCategory.gridOptions.advancedSearchData.engine.Filters = null;
        biographyShareServerCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            biographyShareServerCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            biographyShareServerCategory.contentBusyIndicator.isActive = true;
            biographyShareServerCategory.attachedFiles = null;
            biographyShareServerCategory.attachedFiles = [];
            var s = {
                PropertyName: "LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            biographyShareServerCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }

        ajax.call(cmsServerConfig.configApiServerPath+"biographyShareServerCategory/getall", biographyShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            biographyShareServerCategory.contentBusyIndicator.isActive = false;
            biographyShareServerCategory.ListItems = response.ListItems;
            biographyShareServerCategory.gridOptions.fillData(biographyShareServerCategory.ListItems, response.resultAccess); // Sending Access as an argument
            biographyShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            biographyShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            biographyShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            biographyShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    biographyShareServerCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = biographyShareServerCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Biography_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        biographyShareServerCategory.addRequested = false;
        biographyShareServerCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'biographyShareServerCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            biographyShareServerCategory.selectedItem = response.Item;
            biographyShareServerCategory.selectedItem.LinkShareMainAdminSettingId = node.Id;
            biographyShareServerCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/Modulebiography/biographyShareServerCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    biographyShareServerCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        biographyShareServerCategory.addRequested = false;
        biographyShareServerCategory.modalTitle = 'ویرایش';
        if (!biographyShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'biographyShareServerCategory/GetOne', biographyShareServerCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            biographyShareServerCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulebiography/biographyShareServerCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    biographyShareServerCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        biographyShareServerCategory.categoryBusyIndicator.isActive = true;
        biographyShareServerCategory.addRequested = true;

        if (biographyShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || biographyShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Biography_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'biographyShareServerCategory/add', biographyShareServerCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            biographyShareServerCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                //ثبت درخواست اضافه کردن از طریق کنترلرهای دیگر
                biographyShareServerCategory.checkRequestAddNewItemFromOtherControl(response.Item.Id);
                biographyShareServerCategory.ListItems.unshift(response.Item);
                biographyShareServerCategory.gridOptions.fillData(biographyShareServerCategory.ListItems);
                biographyShareServerCategory.closeModal();
            
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyShareServerCategory.addRequested = false;
            biographyShareServerCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    biographyShareServerCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        biographyShareServerCategory.categoryBusyIndicator.isActive = true;
        biographyShareServerCategory.addRequested = true;
    
        if (biographyShareServerCategory.selectedItem.LinkShareMainAdminSettingId == null || biographyShareServerCategory.selectedItem.LinkShareMainAdminSettingId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Biography_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'biographyShareServerCategory/edit', biographyShareServerCategory.selectedItem, 'PUT').success(function (response) {
            biographyShareServerCategory.categoryBusyIndicator.isActive = false;
            biographyShareServerCategory.addRequested = false;
            biographyShareServerCategory.treeConfig.showbusy = false;
            biographyShareServerCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                biographyShareServerCategory.replaceItem(biographyShareServerCategory.selectedItem.Id, response.Item);
                biographyShareServerCategory.gridOptions.fillData(biographyShareServerCategory.ListItems);
                biographyShareServerCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            biographyShareServerCategory.addRequested = false;
            biographyShareServerCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a biography Content 
    biographyShareServerCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!biographyShareServerCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        biographyShareServerCategory.treeConfig.showbusy = true;
        biographyShareServerCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                biographyShareServerCategory.categoryBusyIndicator.isActive = true;
                console.log(biographyShareServerCategory.gridOptions.selectedRow.item);
                biographyShareServerCategory.showbusy = true;
                biographyShareServerCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"biographyShareServerCategory/GetOne", biographyShareServerCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    biographyShareServerCategory.showbusy = false;
                    biographyShareServerCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    biographyShareServerCategory.selectedItemForDelete = response.Item;
                    console.log(biographyShareServerCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"biographyShareServerCategory/delete", biographyShareServerCategory.selectedItemForDelete, 'POST').success(function (res) {
                        biographyShareServerCategory.categoryBusyIndicator.isActive = false;
                        biographyShareServerCategory.treeConfig.showbusy = false;
                        biographyShareServerCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            biographyShareServerCategory.replaceItem(biographyShareServerCategory.selectedItemForDelete.Id);
                            biographyShareServerCategory.gridOptions.fillData(biographyShareServerCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        biographyShareServerCategory.treeConfig.showbusy = false;
                        biographyShareServerCategory.showIsBusy = false;
                        biographyShareServerCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    biographyShareServerCategory.treeConfig.showbusy = false;
                    biographyShareServerCategory.showIsBusy = false;
                    biographyShareServerCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }

    

   

    ////Replace Item OnDelete/OnEdit Grid Options
    biographyShareServerCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(biographyShareServerCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = biographyShareServerCategory.ListItems.indexOf(item);
                biographyShareServerCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            biographyShareServerCategory.ListItems.unshift(newItem);
    }

   
    biographyShareServerCategory.searchData = function () {
        biographyShareServerCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"biographyShareServerCategory/getall", biographyShareServerCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            biographyShareServerCategory.categoryBusyIndicator.isActive = false;
            biographyShareServerCategory.ListItems = response.ListItems;
            biographyShareServerCategory.gridOptions.fillData(biographyShareServerCategory.ListItems);
            biographyShareServerCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            biographyShareServerCategory.gridOptions.totalRowCount = response.TotalRowCount;
            biographyShareServerCategory.gridOptions.rowPerPage = response.RowPerPage;
            biographyShareServerCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            biographyShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    biographyShareServerCategory.addRequested = false;
    biographyShareServerCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    biographyShareServerCategory.showIsBusy = false;

   

    //For reInit Categories
    biographyShareServerCategory.gridOptions.reGetAll = function () {
        if (biographyShareServerCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) biographyShareServerCategory.searchData();
        else biographyShareServerCategory.init();
    };

    biographyShareServerCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, biographyShareServerCategory.treeConfig.currentNode);
    }

    biographyShareServerCategory.loadFileAndFolder = function (item) {
        biographyShareServerCategory.treeConfig.currentNode = item;
        console.log(item);
        biographyShareServerCategory.treeConfig.onNodeSelect(item);
    }

    biographyShareServerCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            biographyShareServerCategory.focus = true;
        });
    };
    biographyShareServerCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            biographyShareServerCategory.focus1 = true;
        });
    };

     biographyShareServerCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

  
   // End of Upload Modal-----------------------------------------
     biographyShareServerCategory.columnCheckbox = false;
     biographyShareServerCategory.openGridConfigModal = function () {
         $("#gridView-btn").toggleClass("active");
         if (biographyShareServerCategory.gridOptions.columnCheckbox) {
             for (var i = 0; i < biographyShareServerCategory.gridOptions.columns.length; i++) {
                 //biographyShareServerCategory.gridOptions.columns[i].visible = $("#" + biographyShareServerCategory.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                 var element = $("#" + biographyShareServerCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                 //var temp = element[0].checked;
                 biographyShareServerCategory.gridOptions.columns[i].visible = element[0].checked;
             }
         }
         else {
             var prechangeColumns = biographyShareServerCategory.gridOptions.columns;
             for (var i = 0; i < biographyShareServerCategory.gridOptions.columns.length; i++) {
                 biographyShareServerCategory.gridOptions.columns[i].visible = true;
                 var element = $("#" + biographyShareServerCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                 $("#" + biographyShareServerCategory.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
             }
         }
         for (var i = 0; i < biographyShareServerCategory.gridOptions.columns.length; i++) {
             console.log(biographyShareServerCategory.gridOptions.columns[i].name.concat(".visible: "), biographyShareServerCategory.gridOptions.columns[i].visible);
         }
         biographyShareServerCategory.gridOptions.columnCheckbox = !biographyShareServerCategory.gridOptions.columnCheckbox;
     }
    //Export Report 
    biographyShareServerCategory.exportFile = function () {
        biographyShareServerCategory.addRequested = true;
        biographyShareServerCategory.gridOptions.advancedSearchData.engine.ExportFile = biographyShareServerCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'biographyShareServerCategory/exportfile', biographyShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            biographyShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                biographyShareServerCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //biographyShareServerCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    biographyShareServerCategory.toggleExportForm = function () {
        biographyShareServerCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        biographyShareServerCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        biographyShareServerCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        biographyShareServerCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        biographyShareServerCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleBiography/biographyShareServerCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    biographyShareServerCategory.rowCountChanged = function () {
        if (!angular.isDefined(biographyShareServerCategory.ExportFileClass.RowCount) || biographyShareServerCategory.ExportFileClass.RowCount > 5000)
            biographyShareServerCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    biographyShareServerCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"biographyShareServerCategory/count", biographyShareServerCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            biographyShareServerCategory.addRequested = false;
            rashaErManage.checkAction(response);
            biographyShareServerCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            biographyShareServerCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    biographyShareServerCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            biographyShareServerCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    biographyShareServerCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (biographyShareServerCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    biographyShareServerCategory.onNodeToggle = function (node, expanded) {
        if (expanded) {
            node.Children = [];
            var filterModel = { Filters: [] };
            var originalName = node.Title;
            node.messageText = " در حال بارگذاری...";
            filterModel.Filters.push({ PropertyName: "LinkParentId", SearchType: 0, IntValue1: node.Id });
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/GetAll", filterModel, 'POST').success(function (response1) {
                angular.forEach(response1.ListItems, function (value, key) {
                    node.Children.push(value);
                });
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", node.Id, 'POST').success(function (response2) {
                    angular.forEach(response2.ListItems, function (value, key) {
                        node.Children.push(value);
                    });
                    node.messageText = "";
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
        }
    }

    biographyShareServerCategory.onSelection = function (node, selected) {
        if (!selected) {
            biographyShareServerCategory.selectedItem.LinkMainImageId = null;
            biographyShareServerCategory.selectedItem.previewImageSrc = null;
            return;
        }
        biographyShareServerCategory.selectedItem.LinkMainImageId = node.Id;
        biographyShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            biographyShareServerCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
