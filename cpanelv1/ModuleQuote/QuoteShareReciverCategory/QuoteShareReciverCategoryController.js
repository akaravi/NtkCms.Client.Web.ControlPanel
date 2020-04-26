app.controller("quoteShareReciverCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var quoteShareReciverCategory = this;
    //For Grid Options
    quoteShareReciverCategory.gridOptions = {};
    quoteShareReciverCategory.selectedItem = {};
    quoteShareReciverCategory.attachedFiles = [];
    quoteShareReciverCategory.attachedFile = "";

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    var todayDate = moment().format();

    quoteShareReciverCategory.ToDate = {
        defaultDate: todayDate
    }
    quoteShareReciverCategory.FromDate = {
        defaultDate: todayDate
    }
    quoteShareReciverCategory.testDate = moment().format();
    if (itemRecordStatus != undefined) quoteShareReciverCategory.itemRecordStatus = itemRecordStatus;


    quoteShareReciverCategory.LinkShareReciverCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareReciverCategoryId',
        url: 'QuoteCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        scope: quoteShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }

    //quote Grid Options
    quoteShareReciverCategory.LinkShareServerCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkShareServerCategoryId',
        url: 'QuoteShareServerCategory',
        Action:'GetAllOtherSite',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        scope: quoteShareReciverCategory,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string'}
            ]
        }
    }
    quoteShareReciverCategory.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'ShareServerCategory.LinkShareMainAdminSettingId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'FromDate', displayName: 'از تاریخ', sortable: true, type: 'date', visible: 'true' },
            { name: 'ToDate', displayName: 'تا تاریخ', sortable: true, type: 'date', visible: 'true' },

        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }
    //For Show Category Loading Indicator
    quoteShareReciverCategory.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show quote Loading Indicator
    quoteShareReciverCategory.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    quoteShareReciverCategory.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayDescription: 'Description',
        displayChild: 'Children'
    };

    quoteShareReciverCategory.treeConfig.currentNode = {};
    quoteShareReciverCategory.treeBusyIndicator = false;

    quoteShareReciverCategory.addRequested = false;

    quoteShareReciverCategory.showGridComment = false;
    quoteShareReciverCategory.quoteTitle = "";

    //init Function
    quoteShareReciverCategory.init = function () {
        quoteShareReciverCategory.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = quoteShareReciverCategory.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        quoteShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"QuoteShareMainAdminSetting/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            quoteShareReciverCategory.treeConfig.Items = response.ListItems;
            quoteShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        quoteShareReciverCategory.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"quoteShareReciverCategory/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            quoteShareReciverCategory.ListItems = response.ListItems;
            quoteShareReciverCategory.gridOptions.fillData(quoteShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            quoteShareReciverCategory.contentBusyIndicator.isActive = false;
            quoteShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            quoteShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            quoteShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            quoteShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            quoteShareReciverCategory.contentBusyIndicator.isActive = false;
        });

    };

    // Open Add Category Modal 
    quoteShareReciverCategory.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        quoteShareReciverCategory.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'QuoteShareMainAdminSetting/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            quoteShareReciverCategory.selectedItem = response.Item;
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
                quoteShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(quoteShareReciverCategory.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleQuote/QuoteShareMainAdminSetting/add.html',
                        scope: $scope
                    });
                    quoteShareReciverCategory.addRequested = false;
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
    quoteShareReciverCategory.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        quoteShareReciverCategory.addRequested = false;
        quoteShareReciverCategory.modalTitle = 'ویرایش';
        if (!quoteShareReciverCategory.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        quoteShareReciverCategory.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'QuoteShareMainAdminSetting/GetOne', quoteShareReciverCategory.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            quoteShareReciverCategory.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            quoteShareReciverCategory.selectedItem = response.Item;
            //Set dataForTheTree
            quoteShareReciverCategory.selectedNode = [];
            quoteShareReciverCategory.expandedNodes = [];
            quoteShareReciverCategory.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                quoteShareReciverCategory.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(quoteShareReciverCategory.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (quoteShareReciverCategory.selectedItem.LinkMainImageId > 0)
                        quoteShareReciverCategory.onSelection({ Id: quoteShareReciverCategory.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleQuote/QuoteShareMainAdminSetting/edit.html',
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
    quoteShareReciverCategory.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        quoteShareReciverCategory.categoryBusyIndicator.isActive = true;
        quoteShareReciverCategory.addRequested = true;
        quoteShareReciverCategory.selectedItem.LinkParentId = null;
        if (quoteShareReciverCategory.treeConfig.currentNode != null)
            quoteShareReciverCategory.selectedItem.LinkParentId = quoteShareReciverCategory.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'QuoteShareMainAdminSetting/add', quoteShareReciverCategory.selectedItem, 'POST').success(function (response) {
            quoteShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                quoteShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                quoteShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                quoteShareReciverCategory.gridOptions.reGetAll();
                quoteShareReciverCategory.closeModal();
            }
            quoteShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            quoteShareReciverCategory.addRequested = false;
            quoteShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    quoteShareReciverCategory.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        quoteShareReciverCategory.categoryBusyIndicator.isActive = true;
        quoteShareReciverCategory.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'QuoteShareMainAdminSetting/edit', quoteShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            //quoteShareReciverCategory.showbusy = false;
            quoteShareReciverCategory.treeConfig.showbusy = false;
            quoteShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                quoteShareReciverCategory.treeConfig.currentNode.Title = response.Item.Title;
                quoteShareReciverCategory.closeModal();
            }
            quoteShareReciverCategory.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            quoteShareReciverCategory.addRequested = false;
            quoteShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    quoteShareReciverCategory.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = quoteShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                quoteShareReciverCategory.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'QuoteShareMainAdminSetting/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    quoteShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(quoteShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'QuoteShareMainAdminSetting/delete', quoteShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        quoteShareReciverCategory.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //quoteShareReciverCategory.replaceCategoryItem(quoteShareReciverCategory.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            quoteShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
                            quoteShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
                            quoteShareReciverCategory.gridOptions.fillData();
                            quoteShareReciverCategory.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        quoteShareReciverCategory.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    quoteShareReciverCategory.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    quoteShareReciverCategory.treeConfig.onNodeSelect = function () {
        var node = quoteShareReciverCategory.treeConfig.currentNode;
        quoteShareReciverCategory.showGridComment = false;
        quoteShareReciverCategory.selectContent(node);

    };
    //Show Content with Category Id
    quoteShareReciverCategory.selectContent = function (node) {
        quoteShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = null;
        quoteShareReciverCategory.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            quoteShareReciverCategory.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            quoteShareReciverCategory.contentBusyIndicator.isActive = true;
            quoteShareReciverCategory.attachedFiles = null;
            quoteShareReciverCategory.attachedFiles = [];
            var s = {
                PropertyName: "ShareServerCategory.LinkShareMainAdminSettingId",
                IntValue1: node.Id,
                SearchType: 0
            }
            quoteShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"quoteShareReciverCategory/getall", quoteShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            quoteShareReciverCategory.contentBusyIndicator.isActive = false;
            quoteShareReciverCategory.ListItems = response.ListItems;
            quoteShareReciverCategory.gridOptions.fillData(quoteShareReciverCategory.ListItems, response.resultAccess); // Sending Access as an argument
            quoteShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            quoteShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            quoteShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            quoteShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    quoteShareReciverCategory.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = quoteShareReciverCategory.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }
        quoteShareReciverCategory.addRequested = false;
        quoteShareReciverCategory.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'quoteShareReciverCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            quoteShareReciverCategory.selectedItem = response.Item;
            quoteShareReciverCategory.selectedItem.LinkShareServerCategoryId = node.Id;
            quoteShareReciverCategory.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/Modulequote/quoteShareReciverCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    quoteShareReciverCategory.openEditModel = function () {
        if (buttonIsPressed) { return };
        quoteShareReciverCategory.addRequested = false;
        quoteShareReciverCategory.modalTitle = 'ویرایش';
        if (!quoteShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'quoteShareReciverCategory/GetOne', quoteShareReciverCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            quoteShareReciverCategory.selectedItem = response1.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulequote/quoteShareReciverCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    quoteShareReciverCategory.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        quoteShareReciverCategory.categoryBusyIndicator.isActive = true;
        quoteShareReciverCategory.addRequested = true;

        if (quoteShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || quoteShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'quoteShareReciverCategory/add', quoteShareReciverCategory.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            quoteShareReciverCategory.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                quoteShareReciverCategory.ListItems.unshift(response.Item);
                quoteShareReciverCategory.gridOptions.fillData(quoteShareReciverCategory.ListItems);
                quoteShareReciverCategory.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            quoteShareReciverCategory.addRequested = false;
            quoteShareReciverCategory.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    quoteShareReciverCategory.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        quoteShareReciverCategory.categoryBusyIndicator.isActive = true;
        quoteShareReciverCategory.addRequested = true;

        if (quoteShareReciverCategory.selectedItem.LinkShareServerCategoryId == null || quoteShareReciverCategory.selectedItem.LinkShareServerCategoryId == 0) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Subscription_Please_Select_The_Category'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'quoteShareReciverCategory/edit', quoteShareReciverCategory.selectedItem, 'PUT').success(function (response) {
            quoteShareReciverCategory.categoryBusyIndicator.isActive = false;
            quoteShareReciverCategory.addRequested = false;
            quoteShareReciverCategory.treeConfig.showbusy = false;
            quoteShareReciverCategory.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                quoteShareReciverCategory.replaceItem(quoteShareReciverCategory.selectedItem.Id, response.Item);
                quoteShareReciverCategory.gridOptions.fillData(quoteShareReciverCategory.ListItems);
                quoteShareReciverCategory.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            quoteShareReciverCategory.addRequested = false;
            quoteShareReciverCategory.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a quote Content 
    quoteShareReciverCategory.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!quoteShareReciverCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        quoteShareReciverCategory.treeConfig.showbusy = true;
        quoteShareReciverCategory.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                quoteShareReciverCategory.categoryBusyIndicator.isActive = true;
                console.log(quoteShareReciverCategory.gridOptions.selectedRow.item);
                quoteShareReciverCategory.showbusy = true;
                quoteShareReciverCategory.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"quoteShareReciverCategory/GetOne", quoteShareReciverCategory.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    quoteShareReciverCategory.showbusy = false;
                    quoteShareReciverCategory.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    quoteShareReciverCategory.selectedItemForDelete = response.Item;
                    console.log(quoteShareReciverCategory.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"quoteShareReciverCategory/delete", quoteShareReciverCategory.selectedItemForDelete, 'POST').success(function (res) {
                        quoteShareReciverCategory.categoryBusyIndicator.isActive = false;
                        quoteShareReciverCategory.treeConfig.showbusy = false;
                        quoteShareReciverCategory.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            quoteShareReciverCategory.replaceItem(quoteShareReciverCategory.selectedItemForDelete.Id);
                            quoteShareReciverCategory.gridOptions.fillData(quoteShareReciverCategory.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        quoteShareReciverCategory.treeConfig.showbusy = false;
                        quoteShareReciverCategory.showIsBusy = false;
                        quoteShareReciverCategory.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    quoteShareReciverCategory.treeConfig.showbusy = false;
                    quoteShareReciverCategory.showIsBusy = false;
                    quoteShareReciverCategory.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }





    ////Replace Item OnDelete/OnEdit Grid Options
    quoteShareReciverCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(quoteShareReciverCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = quoteShareReciverCategory.ListItems.indexOf(item);
                quoteShareReciverCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            quoteShareReciverCategory.ListItems.unshift(newItem);
    }


    quoteShareReciverCategory.searchData = function () {
        quoteShareReciverCategory.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"quoteShareReciverCategory/getall", quoteShareReciverCategory.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            quoteShareReciverCategory.categoryBusyIndicator.isActive = false;
            quoteShareReciverCategory.ListItems = response.ListItems;
            quoteShareReciverCategory.gridOptions.fillData(quoteShareReciverCategory.ListItems);
            quoteShareReciverCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            quoteShareReciverCategory.gridOptions.totalRowCount = response.TotalRowCount;
            quoteShareReciverCategory.gridOptions.rowPerPage = response.RowPerPage;
            quoteShareReciverCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            quoteShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    quoteShareReciverCategory.addRequested = false;
    quoteShareReciverCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    quoteShareReciverCategory.showIsBusy = false;



    //For reInit Categories
    quoteShareReciverCategory.gridOptions.reGetAll = function () {
        if (quoteShareReciverCategory.gridOptions.advancedSearchData.engine.Filters.length > 0) quoteShareReciverCategory.searchData();
        else quoteShareReciverCategory.init();
    };

    quoteShareReciverCategory.isCurrentNodeEmpty = function () {
        return !angular.equals({}, quoteShareReciverCategory.treeConfig.currentNode);
    }

    quoteShareReciverCategory.loadFileAndFolder = function (item) {
        quoteShareReciverCategory.treeConfig.currentNode = item;
        console.log(item);
        quoteShareReciverCategory.treeConfig.onNodeSelect(item);
    }

    quoteShareReciverCategory.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            quoteShareReciverCategory.focus = true;
        });
    };
    quoteShareReciverCategory.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            quoteShareReciverCategory.focus1 = true;
        });
    };

    quoteShareReciverCategory.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }


    // End of Upload Modal-----------------------------------------
    quoteShareReciverCategory.columnCheckbox = false;
    quoteShareReciverCategory.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = quoteShareReciverCategory.gridOptions.columns;
        if (quoteShareReciverCategory.gridOptions.columnCheckbox) {
            for (var i = 0; i < quoteShareReciverCategory.gridOptions.columns.length; i++) {
                //quoteShareReciverCategory.gridOptions.columns[i].visible = $("#" + quoteShareReciverCategory.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + quoteShareReciverCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                quoteShareReciverCategory.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < quoteShareReciverCategory.gridOptions.columns.length; i++) {
                var element = $("#" + quoteShareReciverCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + quoteShareReciverCategory.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < quoteShareReciverCategory.gridOptions.columns.length; i++) {
            console.log(quoteShareReciverCategory.gridOptions.columns[i].name.concat(".visible: "), quoteShareReciverCategory.gridOptions.columns[i].visible);
        }
        quoteShareReciverCategory.gridOptions.columnCheckbox = !quoteShareReciverCategory.gridOptions.columnCheckbox;
    }
    //Export Report 
    quoteShareReciverCategory.exportFile = function () {
        quoteShareReciverCategory.addRequested = true;
        quoteShareReciverCategory.gridOptions.advancedSearchData.engine.ExportFile = quoteShareReciverCategory.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'quoteShareReciverCategory/exportfile', quoteShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            quoteShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                quoteShareReciverCategory.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //quoteShareReciverCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    quoteShareReciverCategory.toggleExportForm = function () {
        quoteShareReciverCategory.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        quoteShareReciverCategory.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        quoteShareReciverCategory.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        quoteShareReciverCategory.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        quoteShareReciverCategory.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleQuote/quoteShareReciverCategory/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    quoteShareReciverCategory.rowCountChanged = function () {
        if (!angular.isDefined(quoteShareReciverCategory.ExportFileClass.RowCount) || quoteShareReciverCategory.ExportFileClass.RowCount > 5000)
            quoteShareReciverCategory.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    quoteShareReciverCategory.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"quoteShareReciverCategory/count", quoteShareReciverCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            quoteShareReciverCategory.addRequested = false;
            rashaErManage.checkAction(response);
            quoteShareReciverCategory.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            quoteShareReciverCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    quoteShareReciverCategory.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            quoteShareReciverCategory.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    quoteShareReciverCategory.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (quoteShareReciverCategory.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    quoteShareReciverCategory.onNodeToggle = function (node, expanded) {
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

    quoteShareReciverCategory.onSelection = function (node, selected) {
        if (!selected) {
            quoteShareReciverCategory.selectedItem.LinkMainImageId = null;
            quoteShareReciverCategory.selectedItem.previewImageSrc = null;
            return;
        }
        quoteShareReciverCategory.selectedItem.LinkMainImageId = node.Id;
        quoteShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            quoteShareReciverCategory.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);
