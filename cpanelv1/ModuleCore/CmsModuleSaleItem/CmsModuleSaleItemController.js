app.controller("cmsModuleSaleItemController", [
    "$scope",
    "$http",
    "ajax",
    "rashaErManage",
    "$modal",
    "$modalStack",
    "SweetAlert",
    "$timeout",
    "$window",
    "$filter",
    function (
        $scope,
        $http,
        ajax,
        rashaErManage,
        $modal,
        $modalStack,
        sweetAlert,
        $timeout,
        $window,
        $filter
    ) {
        var cmsModuleSaleItem = this;
        //For Grid Options
        cmsModuleSaleItem.gridOptions = {};
        cmsModuleSaleItem.selectedItem = {};
        //cmsModuleSaleItem.attachedFiles = [];
        //cmsModuleSaleItem.attachedFile = "";

    
        var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

        if (itemRecordStatus != undefined)
            cmsModuleSaleItem.itemRecordStatus = itemRecordStatus;

        var date = moment().format();
        cmsModuleSaleItem.selectedItem.ToDate = date;
        // cmsModuleSaleItem.datePickerConfig = {
        //     defaultDate: date
        // };
        // cmsModuleSaleItem.startDate = {
        //     defaultDate: date
        // };
        // cmsModuleSaleItem.endDate = {
        //     defaultDate: date
        // };
        cmsModuleSaleItem.count = 0;
      

        //#help/ سلکتور دسته بندی در هدر
        cmsModuleSaleItem.LinkModuleSaleHeaderGroupIdSelector = {
            displayMember: "Title",
            id: "Id",
            fId: "LinkModuleSaleHeaderGroupId",
            url: "CmsModuleSaleHeaderGroup",
            sortColumn: "Id",
            sortType: 0,
            filterText: "Title",
            showAddDialog: false,
            rowPerPage: 200,
            scope: cmsModuleSaleItem,
            columnOptions: {
                columns: [
                    {
                        name: "Id",
                        displayName: "کد سیستمی",
                        sortable: true,
                        type: "integer"
                    },
                    {
                        name: "Title",
                        displayName: "عنوان",
                        sortable: true,
                        type: "string"
                    },
                    {
                        name: "Description",
                        displayName: "توضیحات",
                        sortable: true,
                        type: "string"
                    }
                ]
            }
        };
        //#help/ سلکتور ماژول در محتوا
        cmsModuleSaleItem.LinkModuleIdSelector = {
            displayMember: "Title",
            id: "Id",
            fId: "LinkModuleId",
            url: "CmsModule",
            sortColumn: "Id",
            sortType: 0,
            filterText: "Title",
            showAddDialog: false,
            rowPerPage: 200,
            scope: cmsModuleSaleItem,
            columnOptions: {
                columns: [
                    {
                        name: "Id",
                        displayName: "کد سیستمی",
                        sortable: true,
                        type: "integer"
                    },
                    {
                        name: "Title",
                        displayName: "عنوان",
                        sortable: true,
                        type: "string"
                    },
                    {
                        name: "Description",
                        displayName: "توضیحات",
                        sortable: true,
                        type: "string"
                    }
                ]
            }
        };
        // Grid Options
        cmsModuleSaleItem.gridOptions = {
            columns: [
                {
                    name: "LinkMainImageId",
                    displayName: "عکس",
                    sortable: true,
                    visible: true,
                    isThumbnailByFild: true,
                    imageWidth: "80",
                    imageHeight: "80"
                },
                {
                    name: "Id",
                    displayName: "کد سیستمی",
                    sortable: true,
                    type: "integer",
                    visible: "true"
                },
                {
                    name: "LinkSiteId",
                    displayName: "کد سیستمی سایت",
                    sortable: true,
                    type: "integer",
                    visible: true
                },
                {
                    name: "CreatedDate",
                    displayName: "ساخت",
                    sortable: true,
                    isDate: true,
                    type: "date",
                    visible: "true"
                },
                {
                    name: "UpdatedDate",
                    displayName: "ویرایش",
                    sortable: true,
                    isDate: true,
                    type: "date",
                    visible: "true"
                },
                {
                    name: "Description",
                    displayName: " توضیحات",
                    sortable: true,
                    type: "string",
                    visible: "true"
                },
                {
                    name: "FromDate",
                    displayName: "تاریخ آغاز",
                    sortable: true,
                    isDate: true,
                    type: "date",
                    visible: "true"
                },
                {
                    name: "ToDate",
                    displayName: "تاریخ پایان",
                    sortable: true,
                    isDate: true,
                    type: "date",
                    visible: "true"
                }
            ],
            data: {},
            multiSelect: false,
            advancedSearchData: {
                engine: {}
            }
        };
    
        //cmsModuleSaleItem.onTagRemoved = function(tag) {};
        //For Show Category Loading Indicator
        cmsModuleSaleItem.categoryBusyIndicator = {
            isActive: true,
            message: "در حال بارگذاری دسته ها ..."
        };
        //For Show Article Loading Indicator
        cmsModuleSaleItem.contentBusyIndicator = {
            isActive: false,
            message: "در حال بارگذاری ..."
        };
        //Tree Config
        cmsModuleSaleItem.treeConfig = {
            displayMember: "Id",
            displayId: "Id",
            displayChild: "Children",
            displayLinkParentId: "LinkParentId"
        };

     

        cmsModuleSaleItem.treeConfig.currentNode = {};
        cmsModuleSaleItem.treeBusyIndicator = false;

        cmsModuleSaleItem.addRequested = false;

        cmsModuleSaleItem.showGridComment = false;
        //cmsModuleSaleItem.articleTitle = "";

        //init Function
        cmsModuleSaleItem.init = function () {
            ajax.call(cmsServerConfig.configApiServerPath+"CoreModuleSaleItem/getAllEnumCmsModuleSaleItemType", {}, 'POST').success(function (response) {
                cmsModuleSaleItem.EnumCmsModuleSaleItemType = response.ListItems;
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            ajax
                .call(cmsServerConfig.configApiServerPath + "CoreModuleSaleHeader/getall", { RowPerPage: 1000 }, "POST")
                .success(function (response) {
                    cmsModuleSaleItem.treeConfig.Items = response.ListItems;
                    cmsModuleSaleItem.categoryBusyIndicator.isActive = false;
                })
                .error(function (data, errCode, c, d) {
                    console.log(data);
                });

            ajax
                .call(
                    cmsServerConfig.configApiServerPath+"CoreModuleSaleItem/getall",
                    cmsModuleSaleItem.gridOptions.advancedSearchData.engine,
                    "POST"
                )
                .success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsModuleSaleItem.ListItems = response.ListItems;
                    cmsModuleSaleItem.gridOptions.fillData(
                        cmsModuleSaleItem.ListItems,
                        response.resultAccess
                    ); // Sending Access as an argument
                    cmsModuleSaleItem.contentBusyIndicator.isActive = false;
                    cmsModuleSaleItem.gridOptions.currentPageNumber =
                        response.CurrentPageNumber;
                    cmsModuleSaleItem.gridOptions.totalRowCount = response.TotalRowCount;
                    cmsModuleSaleItem.gridOptions.rowPerPage = response.RowPerPage;
                    cmsModuleSaleItem.gridOptions.maxSize = 5;
                })
                .error(function (data, errCode, c, d) {
                    cmsModuleSaleItem.gridOptions.fillData();
                    rashaErManage.checkAction(data, errCode);
                    cmsModuleSaleItem.contentBusyIndicator.isActive = false;
                });

        };
        

        cmsModuleSaleItem.gridOptions.onRowSelected = function () {
            var item = cmsModuleSaleItem.gridOptions.selectedRow.item;
            //cmsModuleSaleItem.showComment(item);
        };

        //cmsModuleSaleItem.gridContentOptions.onRowSelected = function() {};

        // Open Add Category Modal
        cmsModuleSaleItem.addNewCategoryModel = function () {
            if (buttonIsPressed) {
                return;
            }
            cmsModuleSaleItem.addRequested = false;
            buttonIsPressed = true;
            ajax
                .call(cmsServerConfig.configApiServerPath + "CoreModuleSaleHeader/GetViewModel", "", "GET")
                .success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    cmsModuleSaleItem.selectedItem = response.Item;
                    //Set dataForTheTree
                    var filterModelParentRootFolders = {
                        Filters: [
                            {
                                PropertyName: "LinkParentId",
                                IntValue1: null,
                                SearchType: 0,
                                IntValueForceNullSearch: true
                            }
                        ]
                    };
                    ajax
                        .call(
                            cmsServerConfig.configApiServerPath+"FileCategory/getAll",
                            filterModelParentRootFolders,
                            "POST"
                        )
                        .success(function (response1) {
                            //Get root directories
                            cmsModuleSaleItem.dataForTheTree = response1.ListItems;
                            var filterModelRootFiles = {
                                Filters: [
                                    {
                                        PropertyName: "LinkCategoryId",
                                        SearchType: 0,
                                        IntValue1: null,
                                        IntValueForceNullSearch: true
                                    }
                                ]
                            };
                            ajax
                                .call(
                                    cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory",
                                    filterModelRootFiles,
                                    "POST"
                                )
                                .success(function (response2) {
                                    //Get files in root
                                    Array.prototype.push.apply(
                                        cmsModuleSaleItem.dataForTheTree,
                                        response2.ListItems
                                    );
                                    $modal.open({
                                        templateUrl:
                                            "cpanelv1/ModuleCore/CmsModuleSaleHeader/add.html",
                                        scope: $scope
                                    });
                                    cmsModuleSaleItem.addRequested = false;
                                })
                                .error(function (data, errCode, c, d) {
                                    console.log(data);
                                });
                        })
                        .error(function (data, errCode, c, d) {
                            console.log(data);
                        });
                    //-----
                    //$modal.open({
                    //    templateUrl: 'cpanelv1/ModuleCore/CmsModuleSaleHeader/add.html',
                    //    scope: $scope
                    //});
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
        };
        // Open Edit Category Modal
        cmsModuleSaleItem.editCategoryModel = function () {
            if (buttonIsPressed) {
                return;
            }
            cmsModuleSaleItem.addRequested = false;
            cmsModuleSaleItem.modalTitle = "ویرایش";
            if (!cmsModuleSaleItem.treeConfig.currentNode) {
                rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
                return;
            }

            cmsModuleSaleItem.contentBusyIndicator.isActive = true;
            buttonIsPressed = true;
            ajax
                .call(
                    cmsServerConfig.configApiServerPath+"CoreModuleSaleHeader/GetOne",
                    cmsModuleSaleItem.treeConfig.currentNode.Id,
                    "GET"
                )
                .success(function (response) {
                    buttonIsPressed = false;
                    cmsModuleSaleItem.contentBusyIndicator.isActive = false;
                    rashaErManage.checkAction(response);
                    cmsModuleSaleItem.selectedItem = response.Item;
                    //Set dataForTheTree
                    cmsModuleSaleItem.selectedNode = [];
                    cmsModuleSaleItem.expandedNodes = [];
                    cmsModuleSaleItem.selectedItem = response.Item;
                    var filterModelParentRootFolders = {
                        Filters: [
                            {
                                PropertyName: "LinkParentId",
                                IntValue1: null,
                                SearchType: 0,
                                IntValueForceNullSearch: true
                            }
                        ]
                    };
                    ajax
                        .call(
                            cmsServerConfig.configApiServerPath+"FileCategory/getAll",
                            filterModelParentRootFolders,
                            "POST"
                        )
                        .success(function (response1) {
                            //Get root directories
                            cmsModuleSaleItem.dataForTheTree = response1.ListItems;
                            var filterModelRootFiles = {
                                Filters: [
                                    {
                                        PropertyName: "LinkCategoryId",
                                        SearchType: 0,
                                        IntValue1: null,
                                        IntValueForceNullSearch: true
                                    }
                                ]
                            };
                            ajax
                                .call(
                                    cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory",
                                    filterModelRootFiles,
                                    "POST"
                                )
                                .success(function (response2) {
                                    //Get files in root
                                    Array.prototype.push.apply(
                                        cmsModuleSaleItem.dataForTheTree,
                                        response2.ListItems
                                    );
                                    //Set selected files to treeControl
                                    if (cmsModuleSaleItem.selectedItem.LinkMainImageId > 0)
                                        cmsModuleSaleItem.onSelection(
                                            { Id: cmsModuleSaleItem.selectedItem.LinkMainImageId },
                                            true
                                        );
                                    $modal.open({
                                        templateUrl:
                                            "cpanelv1/ModuleCore/CmsModuleSaleHeader/edit.html",
                                        scope: $scope
                                    });
                                })
                                .error(function (data, errCode, c, d) {
                                    console.log(data);
                                });
                        })
                        .error(function (data, errCode, c, d) {
                            console.log(data);
                        });
                    //---
                    //$modal.open({
                    //    templateUrl: 'cpanelv1/ModuleCore/CmsModuleSaleHeader/edit.html',
                    //    scope: $scope
                    //});
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
        };

        // Add New Category
        cmsModuleSaleItem.addNewCategory = function (frm) {
            if (frm.$invalid) {
                rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
                return;
            }
            cmsModuleSaleItem.categoryBusyIndicator.isActive = true;
            cmsModuleSaleItem.addRequested = true;
            cmsModuleSaleItem.selectedItem.LinkParentId = null;
            if (cmsModuleSaleItem.treeConfig.currentNode != null)
                cmsModuleSaleItem.selectedItem.LinkParentId =
                    cmsModuleSaleItem.treeConfig.currentNode.Id;
            ajax
                .call(cmsServerConfig.configApiServerPath + "CoreModuleSaleHeader/add", cmsModuleSaleItem.selectedItem, "POST")
                .success(function (response) {
                    cmsModuleSaleItem.addRequested = false;
                    rashaErManage.checkAction(response);
                    console.log(response);
                    if (response.IsSuccess) {
                        cmsModuleSaleItem.gridOptions.advancedSearchData.engine.Filters = null;
                        cmsModuleSaleItem.gridOptions.advancedSearchData.engine.Filters = [];
                        cmsModuleSaleItem.gridOptions.reGetAll();
                        cmsModuleSaleItem.closeModal();
                    }
                    cmsModuleSaleItem.categoryBusyIndicator.isActive = false;
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    cmsModuleSaleItem.addRequested = false;
                    cmsModuleSaleItem.categoryBusyIndicator.isActive = false;
                });
        };

        //Edit Category REST Api
        cmsModuleSaleItem.editCategory = function (frm) {
            if (frm.$invalid) {
                rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
                return;
            }
            cmsModuleSaleItem.addRequested = true;
            cmsModuleSaleItem.categoryBusyIndicator.isActive = true;
            ajax
                .call(cmsServerConfig.configApiServerPath + "CoreModuleSaleHeader/edit", cmsModuleSaleItem.selectedItem, "PUT")
                .success(function (response) {
                    cmsModuleSaleItem.addRequested = true;
                    //cmsModuleSaleItem.showbusy = false;
                    cmsModuleSaleItem.treeConfig.showbusy = false;
                    cmsModuleSaleItem.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    if (response.IsSuccess) {
                        cmsModuleSaleItem.addRequested = false;
                        cmsModuleSaleItem.treeConfig.currentNode.Title = response.Item.Title;
                        cmsModuleSaleItem.closeModal();
                    }
                    cmsModuleSaleItem.categoryBusyIndicator.isActive = false;
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    cmsModuleSaleItem.addRequested = false;
                    cmsModuleSaleItem.categoryBusyIndicator.isActive = false;
                });
        };

        // Delete a Category
        cmsModuleSaleItem.deleteCategory = function () {
            if (buttonIsPressed) {
                return;
            }
            var node = cmsModuleSaleItem.treeConfig.currentNode;
            if (node.Id == 0 || !node.Id) {
                rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
                return;
            }
            rashaErManage.showYesNo(
                ($filter('translatentk')('warning')),
                ($filter('translatentk')('do_you_want_to_delete_this_attribute')),
                function (isConfirmed) {
                    if (isConfirmed) {
                        cmsModuleSaleItem.categoryBusyIndicator.isActive = true;
                        // console.log(node.gridOptions.selectedRow.item);
                        buttonIsPressed = true;
                        ajax
                            .call(cmsServerConfig.configApiServerPath + "CoreModuleSaleHeader/GetOne", node.Id, "GET")
                            .success(function (response) {
                                buttonIsPressed = false;
                                rashaErManage.checkAction(response);
                                cmsModuleSaleItem.selectedItemForDelete = response.Item;
                                console.log(cmsModuleSaleItem.selectedItemForDelete);
                                ajax
                                    .call(
                                        cmsServerConfig.configApiServerPath+"CoreModuleSaleHeader/delete",
                                        cmsModuleSaleItem.selectedItemForDelete,
                                        "POST"
                                    )
                                    .success(function (res) {
                                        cmsModuleSaleItem.categoryBusyIndicator.isActive = false;
                                        if (res.IsSuccess) {
                                            cmsModuleSaleItem.replaceCategoryItem(cmsModuleSaleItem.treeConfig.Items, node.Id);
                                            console.log("Deleted Successfully !");
                                            cmsModuleSaleItem.gridOptions.advancedSearchData.engine.Filters = null;
                                            cmsModuleSaleItem.gridOptions.advancedSearchData.engine.Filters = [];
                                            cmsModuleSaleItem.gridOptions.fillData();
                                            cmsModuleSaleItem.gridOptions.reGetAll();
                                        } else {
                                            //Error occurred
                                            if (res.ErrorType == 15)
                                                rashaErManage.showMessage(
                                                    ($filter('translatentk')('unable_to_delete_the_category_contains_content'))
                                                );
                                        }
                                    })
                                    .error(function (data2, errCode2, c2, d2) {
                                        rashaErManage.checkAction(data2);
                                        cmsModuleSaleItem.categoryBusyIndicator.isActive = false;
                                    });
                            })
                            .error(function (data, errCode, c, d) {
                                rashaErManage.checkAction(data, errCode);
                                cmsModuleSaleItem.categoryBusyIndicator.isActive = false;
                            });
                    }
                }
            );
        };

        //Tree On Node Select Options
        cmsModuleSaleItem.treeConfig.onNodeSelect = function () {
            var node = cmsModuleSaleItem.treeConfig.currentNode;
            cmsModuleSaleItem.showGridComment = false;
            //cmsModuleSaleItem.selectedItem.LinkCategoryId = node.Id;
            cmsModuleSaleItem.selectContent(node);
        };
        //Show Content with Category Id
        cmsModuleSaleItem.selectContent = function (node) {
            cmsModuleSaleItem.gridOptions.advancedSearchData.engine.Filters = null;
            cmsModuleSaleItem.gridOptions.advancedSearchData.engine.Filters = [];
            if (node != null && node != undefined) {
                cmsModuleSaleItem.contentBusyIndicator.message =
                    "در حال بارگذاری مقاله های  دسته " + node.Title;
                cmsModuleSaleItem.contentBusyIndicator.isActive = true;
                //cmsModuleSaleItem.gridOptions.advancedSearchData = {};

                cmsModuleSaleItem.gridOptions.advancedSearchData.engine.Filters = null;
                cmsModuleSaleItem.gridOptions.advancedSearchData.engine.Filters = [];
                //cmsModuleSaleItem.attachedFiles = null;
                //cmsModuleSaleItem.attachedFiles = [];
                var s = {
                    PropertyName: "LinkCategoryId",
                    IntValue1: node.Id,
                    SearchType: 0
                };
                cmsModuleSaleItem.gridOptions.advancedSearchData.engine.Filters.push(s);
            }
            ajax
                .call(
                    cmsServerConfig.configApiServerPath+"CoreModuleSaleItem/getall",
                    cmsModuleSaleItem.gridOptions.advancedSearchData.engine,
                    "POST"
                )
                .success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsModuleSaleItem.contentBusyIndicator.isActive = false;
                    cmsModuleSaleItem.ListItems = response.ListItems;
                    cmsModuleSaleItem.gridOptions.fillData(
                        cmsModuleSaleItem.ListItems,
                        response.resultAccess
                    ); // Sending Access as an argument
                    cmsModuleSaleItem.gridOptions.currentPageNumber =
                        response.CurrentPageNumber;
                    cmsModuleSaleItem.gridOptions.totalRowCount = response.TotalRowCount;
                    cmsModuleSaleItem.gridOptions.rowPerPage = response.RowPerPage;
                    cmsModuleSaleItem.gridOptions.maxSize = 5;
                })
                .error(function (data, errCode, c, d) {
                    cmsModuleSaleItem.gridOptions.fillData();
                    rashaErManage.checkAction(data, errCode);
                });
        };
        // Open Add New Content Model
        cmsModuleSaleItem.addNewContentModel = function () {
            if (buttonIsPressed) {
                return;
            }
            var node = cmsModuleSaleItem.treeConfig.currentNode;
            if (node.Id == 0 || !node.Id) {
                rashaErManage.showMessage(
                    ($filter('translatentk')('To_Add_Content_Please_Select_The_Category'))
                );
                return;
            }
            //cmsModuleSaleItem.attachedFiles = [];
            //cmsModuleSaleItem.attachedFile = "";
            //cmsModuleSaleItem.filePickerMainImage.filename = "";
            //cmsModuleSaleItem.filePickerMainImage.fileId = null;
            //cmsModuleSaleItem.filePickerFiles.filename = "";
            //cmsModuleSaleItem.filePickerFiles.fileId = null;
            //cmsModuleSaleItem.tags = [];   //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
            //cmsModuleSaleItem.kwords = [];   //tagsInput خالی کردن آرایه کلمات کلیدی برای محتوای جدید
            cmsModuleSaleItem.addRequested = false;
            cmsModuleSaleItem.modalTitle = "اضافه کردن محتوای جدید";
            addNewContentModel = true;
            buttonIsPressed = true;
            ajax
                .call(cmsServerConfig.configApiServerPath + "CoreModuleSaleItem/GetViewModel", "", "GET")
                .success(function (response) {
                    buttonIsPressed = false;
                    addNewContentModel = false;
                    console.log(response);
                    rashaErManage.checkAction(response);
                    cmsModuleSaleItem.selectedItem = response.Item;
                    //cmsModuleSaleItem.selectedItem.OtherInfos = [];
                    //cmsModuleSaleItem.selectedItem.Similars = [];
                    cmsModuleSaleItem.selectedItem.LinkModuleSaleHeader = node.Id;
                    //cmsModuleSaleItem.selectedItem.LinkFileIds = null;
                    //cmsModuleSaleItem.clearPreviousData();

                    //#help دریافت پارامترهای مربوطه
                    //cmsModuleSaleItem.getparameter(cmsModuleSaleItem.selectedItem.LinkModuleSaleHeader);

                    $modal.open({
                        templateUrl: "cpanelv1/ModuleCore/cmsModuleSaleItem/add.html",
                        scope: $scope
                    });
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
        };

        // Open Edit Content Modal
        cmsModuleSaleItem.openEditModel = function () {
            if (buttonIsPressed) {
                return;
            }
            cmsModuleSaleItem.addRequested = false;
            cmsModuleSaleItem.modalTitle = "ویرایش";
            if (!cmsModuleSaleItem.gridOptions.selectedRow.item) {
                rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
                return;
            }
            buttonIsPressed = true;
            ajax
                .call(
                    cmsServerConfig.configApiServerPath+"CoreModuleSaleItem/GetOne",
                    cmsModuleSaleItem.gridOptions.selectedRow.item.Id,
                    "GET"
                )
                .success(function (response1) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response1);
                    cmsModuleSaleItem.selectedItem = response1.Item;
                    // cmsModuleSaleItem.startDate.defaultDate =
                    //     cmsModuleSaleItem.selectedItem.FromDate;
                    // cmsModuleSaleItem.endDate.defaultDate =
                    //     cmsModuleSaleItem.selectedItem.ToDate;
                   
                    $modal.open({
                        templateUrl: "cpanelv1/ModuleCore/cmsModuleSaleItem/edit.html",
                        scope: $scope
                    });
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
        };
        // Add New Content
        cmsModuleSaleItem.addNewContent = function (frm) {
            if (frm.$invalid) {
                rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
                return;
            }
            //cmsModuleSaleItem.categoryBusyIndicator.isActive = true;
            //cmsModuleSaleItem.addRequested = true;
            ////Save attached file ids into cmsModuleSaleItem.selectedItem.LinkFileIds
            //cmsModuleSaleItem.selectedItem.LinkFileIds = "";
            //cmsModuleSaleItem.stringfyLinkFileIds();
            //Save Keywords
            //$.each(cmsModuleSaleItem.kwords, function (index, item) {
            //    if (index == 0)
            //        cmsModuleSaleItem.selectedItem.Keyword = item.text;
            //    else
            //        cmsModuleSaleItem.selectedItem.Keyword += ',' + item.text;
            //});
            if (
                cmsModuleSaleItem.selectedItem.LinkModuleSaleHeader == null ||
                cmsModuleSaleItem.selectedItem.LinkModuleSaleHeader == 0
            ) {
                rashaErManage.showMessage(
                    ($filter('translatentk')('To_Add_Content_Please_Select_The_Category'))
                );
                return;
            }
            //var apiSelectedItem =jQuery.extend(true, {}, cmsModuleSaleItem.selectedItem );
            //if (apiSelectedItem.Similars)
            //  $.each(apiSelectedItem.Similars, function(index, item) {
            //    item.Destination = [];
            //  });
            ajax
                .call(cmsServerConfig.configApiServerPath + "CoreModuleSaleItem/add", cmsModuleSaleItem.selectedItem, "POST")
                .success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsModuleSaleItem.categoryBusyIndicator.isActive = false;
                    if (response.IsSuccess) {
                        cmsModuleSaleItem.ListItems.unshift(response.Item);
                        cmsModuleSaleItem.gridOptions.fillData(cmsModuleSaleItem.ListItems);
                        cmsModuleSaleItem.closeModal();
                      
                    }
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    cmsModuleSaleItem.addRequested = false;
                    cmsModuleSaleItem.categoryBusyIndicator.isActive = false;
                });
        };

        //Edit Content
        cmsModuleSaleItem.editContent = function (frm) {
            if (frm.$invalid) {
                rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
                return;
            }
            cmsModuleSaleItem.categoryBusyIndicator.isActive = true;
            cmsModuleSaleItem.addRequested = true;

            //Save attached file ids into cmsModuleSaleItem.selectedItem.LinkFileIds
            //cmsModuleSaleItem.selectedItem.LinkFileIds = "";
            //cmsModuleSaleItem.stringfyLinkFileIds();
            //Save inputTags
            //cmsModuleSaleItem.selectedItem.ContentTags = [];
            //$.each(cmsModuleSaleItem.tags, function (index, item) {
            //    var newObject = $.extend({}, cmsModuleSaleItem.ModuleContentTag);
            //    newObject.LinkTagId = item.id;
            //    newObject.LinkContentId = cmsModuleSaleItem.selectedItem.Id;
            //    cmsModuleSaleItem.selectedItem.ContentTags.push(newObject);
            //});
            //Save Keywords
            //$.each(cmsModuleSaleItem.kwords, function (index, item) {
            //    if (index == 0)
            //        cmsModuleSaleItem.selectedItem.Keyword = item.text;
            //    else
            //        cmsModuleSaleItem.selectedItem.Keyword += ',' + item.text;
            //});
            if (
                cmsModuleSaleItem.selectedItem.LinkModuleSaleHeader == null ||
                cmsModuleSaleItem.selectedItem.LinkModuleSaleHeader == 0
            ) {
                rashaErManage.showMessage(
                    ($filter('translatentk')('To_Add_Content_Please_Select_The_Category'))
                );
                return;
            }
            if (
                cmsModuleSaleItem.selectedItem.LinkModuleSaleHeader == null ||
                cmsModuleSaleItem.selectedItem.LinkModuleSaleHeader == 0
            ) {
                rashaErManage.showMessage(
                    ($filter('translatentk')('To_Add_Content_Please_Select_The_Category'))
                );
                return;
            }
            //var apiSelectedItem = jQuery.extend(true, {},cmsModuleSaleItem.selectedItem);
            //if (apiSelectedItem.Similars)
            //  $.each(apiSelectedItem.Similars, function(index, item) {
            //    item.Destination = [];
            //  });
            ajax
                .call(cmsServerConfig.configApiServerPath + "CoreModuleSaleItem/edit", cmsModuleSaleItem.selectedItem, "PUT")
                .success(function (response) {
                    cmsModuleSaleItem.categoryBusyIndicator.isActive = false;
                    cmsModuleSaleItem.addRequested = false;
                    cmsModuleSaleItem.treeConfig.showbusy = false;
                    cmsModuleSaleItem.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    if (response.IsSuccess) {
                        cmsModuleSaleItem.replaceItem(
                            cmsModuleSaleItem.selectedItem.Id,
                            response.Item
                        );
                        cmsModuleSaleItem.gridOptions.fillData(cmsModuleSaleItem.ListItems);
                        cmsModuleSaleItem.closeModal();
                    }
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    cmsModuleSaleItem.addRequested = false;
                    cmsModuleSaleItem.categoryBusyIndicator.isActive = false;
                });
        };
        //#help similar & otherinfo
        //    cmsModuleSaleItem.clearPreviousData = function() {
        //      cmsModuleSaleItem.selectedItem.Similars = [];
        //      $("#to").empty();
        //    };
        //
        //
        //    cmsModuleSaleItem.moveSelected = function(from, to, calculatePrice) {
        //      if (from == "Content") {
        //        //var title = cmsModuleSaleItem.ItemListIdSelector.selectedItem.Title;
        //        // var optionSelectedPrice = cmsModuleSaleItem.ItemListIdSelector.selectedItem.Price;
        //        if (
        //          cmsModuleSaleItem.selectedItem.LinkDestinationId != undefined &&
        //          cmsModuleSaleItem.selectedItem.LinkDestinationId != null
        //        ) {
        //          if (cmsModuleSaleItem.selectedItem.Similars == undefined)
        //            cmsModuleSaleItem.selectedItem.Similars = [];
        //          for (var i = 0; i < cmsModuleSaleItem.selectedItem.Similars.length; i++) {
        //            if (
        //              cmsModuleSaleItem.selectedItem.Similars[i].LinkDestinationId ==
        //              cmsModuleSaleItem.selectedItem.LinkDestinationId
        //            ) {
        //              rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
        //              return;
        //            }
        //          }
        //          // if (cmsModuleSaleItem.selectedItem.Title == null || cmsModuleSaleItem.selectedItem.Title.length < 0)
        //          //     cmsModuleSaleItem.selectedItem.Title = title;
        //          cmsModuleSaleItem.selectedItem.Similars.push({
        //            //Id: 0,
        //            //Source: from,
        //            LinkDestinationId: cmsModuleSaleItem.selectedItem.LinkDestinationId,
        //            Destination: cmsModuleSaleItem.LinkDestinationIdSelector.selectedItem
        //          });
        //        }
        //      }
        //    };
        //     cmsModuleSaleItem.moveSelectedOtherInfo = function(from, to,y) {
        //
        //
        //             if (cmsModuleSaleItem.selectedItem.OtherInfos == undefined)
        //                cmsModuleSaleItem.selectedItem.OtherInfos = [];
        //              for (var i = 0; i < cmsModuleSaleItem.selectedItem.OtherInfos.length; i++) {
        //
        //                if (cmsModuleSaleItem.selectedItem.OtherInfos[i].Title == cmsModuleSaleItem.selectedItemOtherInfos.Title && cmsModuleSaleItem.selectedItem.OtherInfos[i].HtmlBody ==cmsModuleSaleItem.selectedItemOtherInfos.HtmlBody && cmsModuleSaleItem.selectedItem.OtherInfos[i].Source ==cmsModuleSaleItem.selectedItemOtherInfos.Source)
        //                {
        //                  rashaErManage.showMessage($filter('translatentk')('Information_Is_Duplicate'));
        //                  return;
        //                }
        //
        //              }
        //             if (cmsModuleSaleItem.selectedItemOtherInfos.Title == "" && cmsModuleSaleItem.selectedItemOtherInfos.Source =="" && cmsModuleSaleItem.selectedItemOtherInfos.HtmlBody =="")
        //                {
        //                    rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
        //                }
        //             else
        //               {
        //
        //             cmsModuleSaleItem.selectedItem.OtherInfos.push({
        //                Title:cmsModuleSaleItem.selectedItemOtherInfos.Title,
        //                HtmlBody:cmsModuleSaleItem.selectedItemOtherInfos.HtmlBody,
        //                Source:cmsModuleSaleItem.selectedItemOtherInfos.Source
        //              });
        //              cmsModuleSaleItem.selectedItemOtherInfos.Title="";
        //              cmsModuleSaleItem.selectedItemOtherInfos.Source="";
        //              cmsModuleSaleItem.selectedItemOtherInfos.HtmlBody="";
        //             }
        //             if(edititem)
        //               {
        //                   edititem=false;
        //               }
        //
        //        };
        //
        //    cmsModuleSaleItem.removeFromCollection = function(listsimilar,iddestination) {
        //      for (var i = 0; i < cmsModuleSaleItem.selectedItem.Similars.length; i++)
        //       {
        //            if(listsimilar[i].LinkDestinationId==iddestination)
        //            {
        //                cmsModuleSaleItem.selectedItem.Similars.splice(i, 1);
        //                return;
        //            }
        //
        //      }
        //
        //    };
        //   cmsModuleSaleItem.removeFromOtherInfo = function(listOtherInfo,title,body,source) {
        //    for (var i = 0; i < cmsModuleSaleItem.selectedItem.OtherInfos.length; i++)
        //       {
        //            if(listOtherInfo[i].Title==title && listOtherInfo[i].HtmlBody==body && listOtherInfo[i].Source==source)
        //            {
        //              cmsModuleSaleItem.selectedItem.OtherInfos.splice(i, 1);
        //              return;
        //            }
        //       }
        //    };
        //   cmsModuleSaleItem.editOtherInfo = function(y) {
        //      edititem=true;
        //      cmsModuleSaleItem.selectedItemOtherInfos.Title=y.Title;
        //      cmsModuleSaleItem.selectedItemOtherInfos.HtmlBody=y.HtmlBody;
        //      cmsModuleSaleItem.selectedItemOtherInfos.Source=y.Source;
        //      cmsModuleSaleItem.removeFromOtherInfo(cmsModuleSaleItem.selectedItem.OtherInfos,y.Title,y.HtmlBody,y.Source);
        //    };

        //#help
        // Delete a  Content
        cmsModuleSaleItem.deleteContent = function () {
            if (buttonIsPressed) {
                return;
            }
            if (!cmsModuleSaleItem.gridOptions.selectedRow.item) {
                rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
                return;
            }
            cmsModuleSaleItem.treeConfig.showbusy = true;
            cmsModuleSaleItem.showIsBusy = true;
            rashaErManage.showYesNo(
                ($filter('translatentk')('warning')),
                ($filter('translatentk')('do_you_want_to_delete_this_attribute')),
                function (isConfirmed) {
                    if (isConfirmed) {
                        cmsModuleSaleItem.categoryBusyIndicator.isActive = true;
                        console.log(cmsModuleSaleItem.gridOptions.selectedRow.item);
                        cmsModuleSaleItem.showbusy = true;
                        cmsModuleSaleItem.showIsBusy = true;
                        buttonIsPressed = true;
                        ajax
                            .call(
                                cmsServerConfig.configApiServerPath+"CoreModuleSaleItem/GetOne",
                                cmsModuleSaleItem.gridOptions.selectedRow.item.Id,
                                "GET"
                            )
                            .success(function (response) {
                                buttonIsPressed = false;
                                cmsModuleSaleItem.showbusy = false;
                                cmsModuleSaleItem.showIsBusy = false;
                                rashaErManage.checkAction(response);
                                cmsModuleSaleItem.selectedItemForDelete = response.Item;
                                console.log(cmsModuleSaleItem.selectedItemForDelete);
                                ajax
                                    .call(
                                        cmsServerConfig.configApiServerPath+"CoreModuleSaleItem/delete",
                                        cmsModuleSaleItem.selectedItemForDelete,
                                        "POST"
                                    )
                                    .success(function (res) {
                                        cmsModuleSaleItem.categoryBusyIndicator.isActive = false;
                                        cmsModuleSaleItem.treeConfig.showbusy = false;
                                        cmsModuleSaleItem.showIsBusy = false;
                                        rashaErManage.checkAction(res);
                                        if (res.IsSuccess) {
                                            cmsModuleSaleItem.replaceItem(
                                                cmsModuleSaleItem.selectedItemForDelete.Id
                                            );
                                            cmsModuleSaleItem.gridOptions.fillData(
                                                cmsModuleSaleItem.ListItems
                                            );
                                        }
                                    })
                                    .error(function (data2, errCode2, c2, d2) {
                                        rashaErManage.checkAction(data2);
                                        cmsModuleSaleItem.treeConfig.showbusy = false;
                                        cmsModuleSaleItem.showIsBusy = false;
                                        cmsModuleSaleItem.categoryBusyIndicator.isActive = false;
                                    });
                            })
                            .error(function (data, errCode, c, d) {
                                rashaErManage.checkAction(data, errCode);
                                cmsModuleSaleItem.treeConfig.showbusy = false;
                                cmsModuleSaleItem.showIsBusy = false;
                                cmsModuleSaleItem.categoryBusyIndicator.isActive = false;
                            });
                    }
                }
            );
        };

        //Confirm/UnConfirm  Content
        cmsModuleSaleItem.confirmUnConfirmcmsModuleSaleItem = function () {
            if (!cmsModuleSaleItem.gridOptions.selectedRow.item) {
                rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Content'));
                return;
            }
            ajax
                .call(
                    cmsServerConfig.configApiServerPath+"CoreModuleSaleItem/GetOne",
                    cmsModuleSaleItem.gridOptions.selectedRow.item.Id,
                    "GET"
                )
                .success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsModuleSaleItem.selectedItem = response.Item;
                    cmsModuleSaleItem.selectedItem.IsAccepted = response.Item.IsAccepted ==
                        true
                        ? false
                        : true;
                    ajax
                        .call(cmsServerConfig.configApiServerPath + "CoreModuleSaleItem/edit", cmsModuleSaleItem.selectedItem, "PUT")
                        .success(function (response2) {
                            rashaErManage.checkAction(response2);
                            if (response2.IsSuccess) {
                                var index = cmsModuleSaleItem.ListItems.indexOf(
                                    cmsModuleSaleItem.gridOptions.selectedRow.item
                                );
                                if (index !== -1) {
                                    cmsModuleSaleItem.ListItems[index] = response2.Item;
                                }
                            }
                        })
                        .error(function (data, errCode, c, d) {
                            rashaErManage.checkAction(data, errCode);
                        });
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
        };

        //Add To Archive New Content
        cmsModuleSaleItem.enableArchive = function () {
            if (!cmsModuleSaleItem.gridOptions.selectedRow.item) {
                rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Content'));
                return;
            }
            ajax
                .call(
                    cmsServerConfig.configApiServerPath+"CoreModuleSaleItem/GetOne",
                    cmsModuleSaleItem.gridOptions.selectedRow.item.Id,
                    "GET"
                )
                .success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsModuleSaleItem.selectedItem = response.Item;
                    cmsModuleSaleItem.selectedItem.IsArchive = response.Item.IsArchive ==
                        true
                        ? false
                        : true;
                    ajax
                        .call(cmsServerConfig.configApiServerPath + "CoreModuleSaleItem/edit", cmsModuleSaleItem.selectedItem, "PUT")
                        .success(function (response2) {
                            cmsModuleSaleItem.categoryBusyIndicator.isActive = true;
                            rashaErManage.checkAction(response2);
                            if (response2.IsSuccess) {
                                var index = cmsModuleSaleItem.ListItems.indexOf(
                                    cmsModuleSaleItem.gridOptions.selectedRow.item
                                );
                                if (index !== -1) {
                                    cmsModuleSaleItem.ListItems[index] = response2.Item;
                                }
                                cmsModuleSaleItem.categoryBusyIndicator.isActive = false;
                            }
                        })
                        .error(function (data, errCode, c, d) {
                            rashaErManage.checkAction(data, errCode);
                            cmsModuleSaleItem.categoryBusyIndicator.isActive = false;
                        });
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    cmsModuleSaleItem.categoryBusyIndicator.isActive = false;
                });
        };

        //Replace Item OnDelete/OnEdit Grid Options
        cmsModuleSaleItem.replaceItem = function (oldId, newItem) {
            angular.forEach(cmsModuleSaleItem.ListItems, function (item, key) {
                if (item.Id == oldId) {
                    var index = cmsModuleSaleItem.ListItems.indexOf(item);
                    cmsModuleSaleItem.ListItems.splice(index, 1);
                }
            });
            if (newItem) cmsModuleSaleItem.ListItems.unshift(newItem);
        };

        cmsModuleSaleItem.summernoteText =
            "<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />";
        cmsModuleSaleItem.searchData = function () {
            cmsModuleSaleItem.categoryBusyIndicator.isActive = true;
            ajax
                .call(
                    cmsServerConfig.configApiServerPath+"CoreModuleSaleItem/getall",
                    cmsModuleSaleItem.gridOptions.advancedSearchData.engine,
                    "POST"
                )
                .success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsModuleSaleItem.categoryBusyIndicator.isActive = false;
                    cmsModuleSaleItem.ListItems = response.ListItems;
                    cmsModuleSaleItem.gridOptions.fillData(cmsModuleSaleItem.ListItems);
                    cmsModuleSaleItem.gridOptions.currentPageNumber =
                        response.CurrentPageNumber;
                    cmsModuleSaleItem.gridOptions.totalRowCount = response.TotalRowCount;
                    cmsModuleSaleItem.gridOptions.rowPerPage = response.RowPerPage;
                    cmsModuleSaleItem.gridOptions.maxSize = 5;
                    cmsModuleSaleItem.allowedSearch = response.AllowedSearchField;
                })
                .error(function (data, errCode, c, d) {
                    cmsModuleSaleItem.gridOptions.fillData();
                    rashaErManage.checkAction(data, errCode);
                });
        };

        //Close Model Stack
        cmsModuleSaleItem.addRequested = false;
        cmsModuleSaleItem.closeModal = function () {
            $modalStack.dismissAll();
        };

        cmsModuleSaleItem.showIsBusy = false;

        //Aprove a comment
        //    cmsModuleSaleItem.confirmComment = function (item) {
        //        console.log("This comment will be confirmed:", item);
        //    }
        //
        //    //Decline a comment
        //    cmsModuleSaleItem.doNotConfirmComment = function (item) {
        //        console.log("This comment will not be confirmed:", item);
        //
        //    }
        //    //Remove a comment
        //    cmsModuleSaleItem.deleteComment = function (item) {
        //        if (!cmsModuleSaleItem.gridContentOptions.selectedRow.item) {
        //            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
        //            return;
        //        }
        //        cmsModuleSaleItem.treeConfig.showbusy = true;
        //        cmsModuleSaleItem.showIsBusy = true;
        //        rashaErManage.showYesNo(($filter('translatentk')('warning')), "آیا می خواهید این نظر را حذف کنید", function (isConfirmed) {
        //            if (isConfirmed) {
        //                console.log("Item to be deleted: ", cmsModuleSaleItem.gridOptions.selectedRow.item);
        //                cmsModuleSaleItem.showbusy = true;
        //                cmsModuleSaleItem.showIsBusy = true;
        //                ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSaleItem/GetOne', cmsModuleSaleItem.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
        //                    cmsModuleSaleItem.showbusy = false;
        //                    cmsModuleSaleItem.showIsBusy = false;
        //                    rashaErManage.checkAction(response);
        //                    cmsModuleSaleItem.selectedItemForDelete = response.Item;
        //                    console.log(cmsModuleSaleItem.selectedItemForDelete);
        //                    ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleSaleItem/delete', cmsModuleSaleItem.selectedItemForDelete, 'POST').success(function (res) {
        //                        cmsModuleSaleItem.treeConfig.showbusy = false;
        //                        cmsModuleSaleItem.showIsBusy = false;
        //                        rashaErManage.checkAction(res);
        //                        if (res.IsSuccess) {
        //                            cmsModuleSaleItem.replaceItem(cmsModuleSaleItem.selectedItemForDelete.Id);
        //                            cmsModuleSaleItem.gridOptions.fillData(cmsModuleSaleItem.ListItems);
        //                        }
        //
        //                    }).error(function (data2, errCode2, c2, d2) {
        //                        rashaErManage.checkAction(data2);
        //                        cmsModuleSaleItem.treeConfig.showbusy = false;
        //                        cmsModuleSaleItem.showIsBusy = false;
        //                    });
        //                }).error(function (data, errCode, c, d) {
        //                    rashaErManage.checkAction(data, errCode);
        //                    cmsModuleSaleItem.treeConfig.showbusy = false;
        //                    cmsModuleSaleItem.showIsBusy = false;
        //                });
        //            }
        //        });
        //    }

        //For reInit Categories
        cmsModuleSaleItem.gridOptions.reGetAll = function () {
            if (
                cmsModuleSaleItem.gridOptions.advancedSearchData.engine.Filters.length > 0
            )
                cmsModuleSaleItem.searchData();
            else cmsModuleSaleItem.init();
        };

        cmsModuleSaleItem.openDateExpireLockAccount = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $timeout(function () {
                cmsModuleSaleItem.focusExpireLockAccount = true;
            });
        };

        cmsModuleSaleItem.isCurrentNodeEmpty = function () {
            return !angular.equals({}, cmsModuleSaleItem.treeConfig.currentNode);
        };

        cmsModuleSaleItem.loadFileAndFolder = function (item) {
            cmsModuleSaleItem.treeConfig.currentNode = item;
            console.log(item);
            cmsModuleSaleItem.treeConfig.onNodeSelect(item);
        };

        cmsModuleSaleItem.openDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $timeout(function () {
                cmsModuleSaleItem.focus = true;
            });
        };
        cmsModuleSaleItem.openDate1 = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $timeout(function () {
                cmsModuleSaleItem.focus1 = true;
            });
        };

        cmsModuleSaleItem.columnCheckbox = false;
        cmsModuleSaleItem.openGridConfigModal = function () {
            $("#gridView-btn").toggleClass("active");
            var prechangeColumns = cmsModuleSaleItem.gridOptions.columns;
            if (cmsModuleSaleItem.gridOptions.columnCheckbox) {
                for (var i = 0; i < cmsModuleSaleItem.gridOptions.columns.length; i++) {
                    //cmsModuleSaleItem.gridOptions.columns[i].visible = $("#" + cmsModuleSaleItem.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                    var element = $(
                        "#" +
                        cmsModuleSaleItem.gridOptions.columns[i].name.replace(".", "") +
                        "Checkbox"
                    );
                    var temp = element[0].checked;
                    cmsModuleSaleItem.gridOptions.columns[i].visible = temp;
                }
            } else {
                for (var i = 0; i < cmsModuleSaleItem.gridOptions.columns.length; i++) {
                    var element = $(
                        "#" +
                        cmsModuleSaleItem.gridOptions.columns[i].name.replace(".", "") +
                        "Checkbox"
                    );
                    $(
                        "#" + cmsModuleSaleItem.gridOptions.columns[i].name + "Checkbox"
                    ).checked =
                        prechangeColumns[i].visible;
                }
            }
            for (var i = 0; i < cmsModuleSaleItem.gridOptions.columns.length; i++) {
                console.log(
                    cmsModuleSaleItem.gridOptions.columns[i].name.concat(".visible: "),
                    cmsModuleSaleItem.gridOptions.columns[i].visible
                );
            }
            cmsModuleSaleItem.gridOptions.columnCheckbox = !cmsModuleSaleItem.gridOptions
                .columnCheckbox;
        };

      
        cmsModuleSaleItem.toggleCategoryButtons = function () {
            $("#categoryButtons").fadeToggle();
        }
      
        //End of Upload Modal-----------------------------------------

        //Export Report
        cmsModuleSaleItem.exportFile = function () {
            cmsModuleSaleItem.gridOptions.advancedSearchData.engine.ExportFile =
                cmsModuleSaleItem.ExportFileClass;
            cmsModuleSaleItem.addRequested = true;
            ajax
                .call(
                    cmsServerConfig.configApiServerPath+"CoreModuleSaleItem/exportfile",
                    cmsModuleSaleItem.gridOptions.advancedSearchData.engine,
                    "POST"
                )
                .success(function (response) {
                    cmsModuleSaleItem.addRequested = false;
                    rashaErManage.checkAction(response);
                    if (response.IsSuccess) {
                        cmsModuleSaleItem.exportDownloadLink =
                            window.location.origin + response.LinkFile;
                        $window.open(response.LinkFile, "_blank");
                        //cmsModuleSaleItem.closeModal();
                    }
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
        };
        //Open Export Report Modal
        cmsModuleSaleItem.toggleExportForm = function () {
            cmsModuleSaleItem.SortType = [
                { key: "نزولی", value: 0 },
                { key: "صعودی", value: 1 },
                { key: "تصادفی", value: 3 }
            ];
            cmsModuleSaleItem.EnumExportFileType = [
                { key: "Excel", value: 1 },
                { key: "PDF", value: 2 },
                { key: "Text", value: 3 }
            ];
            cmsModuleSaleItem.EnumExportReceiveMethod = [
                { key: "دانلود", value: 0 },
                { key: "ایمیل", value: 1 },
                { key: "فایل منیجر", value: 3 }
            ];
            cmsModuleSaleItem.ExportFileClass = {
                FileType: 1,
                RecieveMethod: 0,
                RowCount: 100
            };
            cmsModuleSaleItem.exportDownloadLink = null;
            $modal.open({
                templateUrl: "cpanelv1/ModuleCore/cmsModuleSaleItem/report.html",
                scope: $scope
            });
        };
        //Row Count Export Input Change
        cmsModuleSaleItem.rowCountChanged = function () {
            if (
                !angular.isDefined(cmsModuleSaleItem.ExportFileClass.RowCount) ||
                cmsModuleSaleItem.ExportFileClass.RowCount > 5000
            )
                cmsModuleSaleItem.ExportFileClass.RowCount = 5000;
        };
        //Get TotalRowCount
        cmsModuleSaleItem.getCount = function () {
            ajax
                .call(cmsServerConfig.configApiServerPath + "CoreModuleSaleItem/count", cmsModuleSaleItem.gridOptions.advancedSearchData.engine, "POST")
                .success(function (response) {
                    cmsModuleSaleItem.addRequested = false;
                    rashaErManage.checkAction(response);
                    cmsModuleSaleItem.ListItemsTotalRowCount = ": " + response.TotalRowCount;
                })
                .error(function (data, errCode, c, d) {
                    cmsModuleSaleItem.gridOptions.fillData();
                    rashaErManage.checkAction(data, errCode);
                });
        };

        cmsModuleSaleItem.showCategoryImage = function (mainImageId) {
            if (mainImageId == 0 || mainImageId == null) return;
            ajax
                .call(cmsServerConfig.configApiServerPath + "FileContent/PreviewImage", { id: mainImageId, name: "" }, "POST")
                .success(function (response) {
                    cmsModuleSaleItem.selectedItem.MainImageSrc = response;
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
        };
        //TreeControl
        cmsModuleSaleItem.treeOptions = {
            nodeChildren: "Children",
            multiSelection: false,
            isLeaf: function (node) {
                if (node.FileName == undefined || node.Filename == "") return false;
                return true;
            },
            isSelectable: function (node) {
                if (cmsModuleSaleItem.treeOptions.dirSelectable)
                    if (angular.isDefined(node.FileName)) return false;
                return true;
            },
            dirSelectable: false
        };

        cmsModuleSaleItem.onNodeToggle = function (node, expanded) {
            if (expanded) {
                node.Children = [];
                var filterModel = { Filters: [] };
                var originalName = node.Title;
                node.messageText = " در حال بارگذاری...";
                filterModel.Filters.push({
                    PropertyName: "LinkParentId",
                    SearchType: 0,
                    IntValue1: node.Id
                });
                ajax
                    .call(cmsServerConfig.configApiServerPath + "FileCategory/GetAll", filterModel, "POST")
                    .success(function (response1) {
                        angular.forEach(response1.ListItems, function (value, key) {
                            node.Children.push(value);
                        });
                        ajax
                            .call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", node.Id, "POST")
                            .success(function (response2) {
                                angular.forEach(response2.ListItems, function (value, key) {
                                    node.Children.push(value);
                                });
                                node.messageText = "";
                            })
                            .error(function (data, errCode, c, d) {
                                console.log(data);
                            });
                    })
                    .error(function (data, errCode, c, d) {
                        console.log(data);
                    });
            }
        };

        cmsModuleSaleItem.onSelection = function (node, selected) {
            if (!selected) {
                cmsModuleSaleItem.selectedItem.LinkMainImageId = null;
                cmsModuleSaleItem.selectedItem.previewImageSrc = null;
                return;
            }
            cmsModuleSaleItem.selectedItem.LinkMainImageId = node.Id;
            cmsModuleSaleItem.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
            ajax
                .call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", node.Id, "GET")
                .success(function (response) {
                    cmsModuleSaleItem.selectedItem.previewImageSrc =
                        cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
                })
                .error(function (data, errCode, c, d) {
                    console.log(data);
                });
        };
        //End of TreeControl
    }
]);
