app.controller("pollingContentCtrl", ["$scope", "$http", "ajax", "rashaErManage", "$modal", "$modalStack", "SweetAlert", "$timeout", "$state", '$window', '$filter',
 function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $state, $window, $filter) {
    var pollingContent = this;

    var date = moment().format();

    if (itemRecordStatus != undefined) pollingContent.itemRecordStatus = itemRecordStatus;
    pollingContent.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    pollingContent.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    pollingContent.locationChanged = function (lat, lang) {
        console.log("ok " + lat + " " + lang);
    }

    pollingContent.GeolocationConfig = {
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged: pollingContent.locationChanged,
        useCurrentLocation: true,
        center: {
            lat: 32.658066,
            lng: 51.6693815
        },
        zoom: 4,
        scope: pollingContent,
        useCurrentLocationZoom: 12,
    }

    // pollingContent.datePickerConfig = {
    //     defaultDate: date,
    // };
    // pollingContent.FromDate = {
    //     defaultDate: date,
    // };
    // pollingContent.ExpireDate = {
    //     defaultDate: date,
    // };

  
    pollingContent.count = 0;

    pollingContent.filePickerconfig = {
        isActive: true,
    }
    //#help/ سلکتور دسته بندی در ویرایش محتوا
    pollingContent.LinkCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryId',
        url: 'pollingCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: pollingContent,
        columnOptions: {
            columns: [{
                    name: 'Id',
                    displayName: 'کد سیستمی',
                    sortable: true,
                    type: 'integer'
                },
                {
                    name: 'Title',
                    displayName: 'عنوان',
                    sortable: true,
                    type: 'string'
                },
                {
                    name: 'Description',
                    displayName: 'توضیحات',
                    sortable: true,
                    type: 'string'
                }
            ]
        }
    }
    //Polling Content Grid Options
    pollingContent.gridOptions = {
        columns: [{
                name: 'Id',
                displayName: 'کد سیستمی',
                sortable: true,
                type: 'integer',
                visible: 'true'
            },
            {
                name: 'LinkSiteId',
                displayName: 'کد سیستمی سایت',
                sortable: true,
                type: 'integer',
                visible: true
            },
            {
                name: 'CreatedDate',
                displayName: 'ساخت',
                sortable: true,
                isDate: true,
                type: 'date',
                visible: 'true'
            },
            {
                name: 'UpdatedDate',
                displayName: 'ویرایش',
                sortable: true,
                isDate: true,
                type: 'date',
                visible: 'true'
            },
            {
                name: 'Title',
                displayName: 'عنوان',
                sortable: true,
                type: 'string',
                visible: 'true'
            },
            {
                name: 'Question',
                displayName: 'سؤال',
                sortable: true,
                type: 'string',
                visible: 'true'
            },
            {
                name: 'FromDate',
                displayName: 'تاریخ آغاز',
                sortable: true,
                isDate: true,
                type: 'date',
                visible: 'true'
            },
            {
                name: 'ExpireDate',
                displayName: 'تاریخ پایان',
                sortable: true,
                isDate: true,
                type: 'date',
                visible: 'true'
            },
            {
                name: 'ViewStatisticsBeforeVote',
                displayName: 'نمایش نتیجه قبل از رای',
                sortable: true,
                isCheckBox: true,
                type: 'boolean'
            },
            {
                name: 'ViewStatisticsAfterVote',
                displayName: 'نمایش نتیجه بعد از رای',
                sortable: true,
                isCheckBox: true,
                type: 'boolean'
            },

            {
                name: 'ActionButtons',
                displayName: 'عملیات',
                sortable: true,
                type: 'string',
                visible: 'true',
                displayForce: true,
                template: '<a type="button" ng-show="pollingContent.gridOptions.resultAccess.AccessAddRow || pollingContent.gridOptions.resultAccess.AccessEditRow" class="btn btn-success" ng-click="pollingContent.moveToOptions()"><i class="fa fa-pencil" aria-hidden="true"></i>&nbsp;گزینه ها</a>'
            }
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
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }
    //Polling Content Grid Options
    pollingContent.gridOptions2 = {
        columns: [{
                name: 'Id',
                displayName: 'کد سیستمی',
                sortable: true,
                type: 'integer',
                visible: 'true'
            },
            {
                name: 'LinkSiteId',
                displayName: 'کد سیستمی سایت',
                sortable: true,
                type: 'integer',
                visible: true
            },
            {
                name: 'CreatedDate',
                displayName: 'ساخت',
                sortable: true,
                isDate: true,
                type: 'date',
                visible: 'true'
            },
            {
                name: 'UpdatedDate',
                displayName: 'ویرایش',
                sortable: true,
                isDate: true,
                type: 'date',
                visible: 'true'
            },
            {
                name: 'Option',
                displayName: 'گزینه',
                sortable: true,
                type: 'string',
                visible: 'true'
            },
            {
                name: 'NumberOfVotes',
                displayName: 'تعداد',
                sortable: true,
                type: 'string',
                visible: 'true'
            },
            {
                name: 'Percentage',
                displayName: 'درصد',
                sortable: true,
                type: 'string',
                visible: 'true',
                displayForce: true
            }
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
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    //pollingContent.selectedItem.ToDate=pollingContent.datePickerConfig.defaultDate;

    //For Show Category Loading Indicator
    pollingContent.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show polling Loading Indicator
    pollingContent.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //For Show Polling Options Loading Indicator
    pollingContent.optionsBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    pollingContent.treeConfig = {
        displayMember: "Title",
        displayId: "Id",
        displayChild: "Children"
    };

    pollingContent.treeConfig.currentNode = {};
    pollingContent.treeBusyIndicator = false;

    pollingContent.addRequested = false;

    //init Function
    pollingContent.init = function () {
        pollingContent.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath + "pollingcategory/getall", {
            RowPerPage: 1000
        }, "POST").success(function (response) {
            pollingContent.treeConfig.Items = response.ListItems;
            pollingContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        pollingContent.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath + "pollingContent/getall", {}, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            pollingContent.categoryBusyIndicator.isActive = false;
            pollingContent.ListItems = response.ListItems;

  

            pollingContent.gridOptions.fillData(pollingContent.ListItems, response.resultAccess);
            pollingContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            pollingContent.gridOptions.totalRowCount = response.TotalRowCount;
            pollingContent.gridOptions.rowPerPage = response.RowPerPage;
            pollingContent.gridOptions.maxSize = 5;
            pollingContent.allowedSearch = response.AllowedSearchField;
            pollingContent.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            pollingContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    pollingContent.gridOptions.onRowSelected = function () {
        var item = pollingContent.gridOptions.selectedRow.item;
        //Get Options
        $("#grid-options").fadeOut('fast');
        var filterModel = {
            Filters: []
        };
        filterModel.Filters.push({
            PropertyName: "LinkPollingContentId",
            IntValue1: item.Id,
            SearchType: 0
        });
        pollingContent.addRequested = true;
        pollingContent.optionsBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath + "pollingoption/getall", filterModel, "POST").success(function (response) {
            pollingContent.addRequested = false;
            pollingContent.optionsBusyIndicator.isActice = false;
            rashaErManage.checkAction(response);
            pollingContent.OptionList = response.ListItems;
            pollingContent.calculatePercantage(pollingContent.OptionList);
            pollingContent.gridOptions2.fillData(pollingContent.OptionList, response.resultAccess);
            pollingContent.gridOptions2.currentPageNumber = response.CurrentPageNumber;
            pollingContent.gridOptions2.totalRowCount = response.TotalRowCount;
            pollingContent.gridOptions2.RowPerPage = response.RowPerPage;
            if (pollingContent.OptionList.length > 0)
                $("#grid-options").fadeIn('fast');
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    pollingContent.moveToOptions = function () {
        if ($("#grid-options").is(":visible"))
            $('html, body').animate({
                scrollTop: $("#grid-options").offset().top
            }, 850);
    }
    // Open Add Category 
    pollingContent.openAddCategoryModal = function () {
        if (buttonIsPressed) {
            return
        };
        pollingContent.addRequested = false;
        pollingContent.modalTitle = "ایجاد دسته جدید";
        buttonIsPressed == true;
        ajax.call(cmsServerConfig.configApiServerPath + "pollingCategory/GetViewModel", "", "GET").success(function (response) {
            buttonIsPressed == false;
            rashaErManage.checkAction(response);
            pollingContent.selectedItem = response.Item;
            //Set dataForTheTree
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath + "FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                pollingContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = {
                    Filters: [{
                        PropertyName: "LinkCategoryId",
                        SearchType: 0,
                        IntValue1: null,
                        IntValueForceNullSearch: true
                    }]
                };
                ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(pollingContent.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModulePolling/pollingCategory/add.html',
                        scope: $scope
                    });
                    pollingContent.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //-----
            //$modal.open({
            //    templateUrl: "cpanelv1/ModulePolling/pollingCategory/add.html",
            //    scope: $scope
            //});
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Category
    pollingContent.openEditCategoryModal = function () {
        if (buttonIsPressed) {
            return
        };
        pollingContent.addRequested = false;
        pollingContent.modalTitle = " ویرایش دسته";
        if (!pollingContent.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath + "pollingCategory/GetOne", pollingContent.treeConfig.currentNode.Id, "GET").success(function (response) {
            buttonIsPressed = false;
            pollingContent.showbusy = false;
            rashaErManage.checkAction(response);
            pollingContent.selectedItem = response.Item;
            //Set dataForTheTree
            pollingContent.selectedNode = [];
            pollingContent.expandedNodes = [];
            pollingContent.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath + "FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                pollingContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = {
                    Filters: [{
                        PropertyName: "LinkCategoryId",
                        SearchType: 0,
                        IntValue1: null,
                        IntValueForceNullSearch: true
                    }]
                };
                ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(pollingContent.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (pollingContent.selectedItem.LinkMainImageId > 0)
                        pollingContent.onSelection({
                            Id: pollingContent.selectedItem.LinkMainImageId
                        }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModulePolling/pollingCategory/edit.html',
                        scope: $scope
                    });
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //---
            //$modal.open({
            //    templateUrl: "cpanelv1/ModulePolling/pollingCategory/edit.html",
            //    scope: $scope
            //});
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }


    //open statistics
    pollingContent.Showstatistics = function () {
        if (!pollingContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath + 'pollingContent/GetOne', pollingContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            pollingContent.selectedItem = response1.Item;
            $modal.open({
                templateUrl: "cpanelv1/ModulePolling/pollingContent/statistics.html",
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add Category
    pollingContent.addNewCategory = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        pollingContent.addRequested = true;
        pollingContent.selectedItem.LinkParentId = null;
        if (pollingContent.treeConfig.currentNode != null)
            pollingContent.selectedItem.LinkParentId = pollingContent.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath + "pollingCategory/add", pollingContent.selectedItem, "POST").success(function (response) {
            pollingContent.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                if (response.Item.LinkParentId == null)
                    pollingContent.treeConfig.Items.push(response.Item);
                else {
                    pollingContent.treeConfig.currentNode.Children.push(response.Item);
                }
                pollingContent.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            pollingContent.addRequested = false;
        });
    };

    //Edit Category
    pollingContent.editCategory = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath + "pollingCategory/edit", pollingContent.selectedItem, "PUT").success(function (response) {
            pollingContent.addRequested = true;
            //pollingContent.showbusy = false;
            pollingContent.treeConfig.showbusy = false;
            pollingContent.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                pollingContent.addRequested = false;
                pollingContent.treeConfig.currentNode.Title = response.Item.Title;
                pollingContent.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            pollingContent.addRequested = false;
        });
    }

    // Delete a Category
    pollingContent.deleteCategory = function () {
        if (buttonIsPressed) {
            return
        };
        var node = pollingContent.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                pollingContent.categoryBusyIndicator.isActive = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath + "pollingCategory/GetOne", node.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    pollingContent.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath + "pollingCategory/delete", pollingContent.selectedItemForDelete, 'POST').success(function (res) {
                        if (res.IsSuccess) {
                            pollingContent.categoryBusyIndicator.isActive = false;
                            if (pollingContent.selectedItemForDelete.LinkParentId == null) {
                                var elementPos = pollingContent.treeConfig.Items.map(function (x) {
                                    return x.Id;
                                }).indexOf(pollingContent.selectedItemForDelete.Id); // find the index of an item in an array
                                pollingContent.treeConfig.Items.splice(elementPos, 1);
                            } else
                                for (var i = 0; i < pollingContent.treeConfig.Items.length; i++) {
                                    searchAndDeleteFromTree(pollingContent.selectedItemForDelete, pollingContent.treeConfig.Items[i]);
                                }
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

    //Tree On Node Select Options
    pollingContent.treeConfig.onNodeSelect = function () {
        var node = pollingContent.treeConfig.currentNode;
        pollingContent.selectContent(node);
    }

    //Show Content with Category Id
    pollingContent.selectContent = function (node) {
        pollingContent.gridOptions.advancedSearchData.engine.Filters = [];
        pollingContent.contentBusyIndicator.isActive = true;
        if (node != null && node != undefined) {
            var s = {
                PropertyName: "LinkCategoryId",
                IntValue1: node.Id,
                SearchType: 0
            }
            pollingContent.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath + "pollingContent/getall", pollingContent.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            pollingContent.contentBusyIndicator.isActive = false;
            pollingContent.ListItems = response.ListItems;
            pollingContent.gridOptions.fillData(pollingContent.ListItems, response.resultAccess);
            pollingContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            pollingContent.gridOptions.totalRowCount = response.TotalRowCount;
            pollingContent.gridOptions.rowPerPage = response.RowPerPage;
            pollingContent.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            pollingContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Content Modal
    pollingContent.openAddModal = function () {
        var node = pollingContent.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage("برای اضافه کردن نظرسنجی لطفا نظرسنجی مربوطه را انتخاب کنید .");
            return;
        }
        pollingContent.attachedFiles = [];
        pollingContent.attachedFile = "";
        pollingContent.filePickerMainImage.filename = "";
        pollingContent.filePickerMainImage.fileId = null;
        pollingContent.filePickerFiles.filename = "";
        pollingContent.filePickerFiles.fileId = null;
        pollingContent.addRequested = false;
        pollingContent.modalTitle = "اضافه";
        ajax.call(cmsServerConfig.configApiServerPath + "pollingcontent/GetViewModel", "", "GET").success(function (response) {
            rashaErManage.checkAction(response);
            pollingContent.selectedItem = response.Item;
            pollingContent.selectedItem.LinkCategoryId = node.Id;
            $modal.open({
                templateUrl: "cpanelv1/ModulePolling/pollingContent/add.html",
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }


    // Open Edit Content Modal
    pollingContent.openEditModal = function () {
        pollingContent.addRequested = false;
        pollingContent.modalTitle = "ویرایش";
        if (!pollingContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath + "pollingcontent/GetOne", pollingContent.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
            rashaErManage.checkAction(response);
            pollingContent.selectedItem = response.Item;
            // pollingContent.FromDate.defaultDate = pollingContent.selectedItem.FromDate;
            // pollingContent.ExpireDate.defaultDate = pollingContent.selectedItem.ExpireDate;
            pollingContent.filePickerMainImage.filename = null;
            pollingContent.filePickerMainImage.fileId = null;
            if (response.Item.LinkMainImageId != null) {
                ajax.call(cmsServerConfig.configApiServerPath + 'FileContent/GetOne', response.Item.LinkMainImageId, 'GET').success(function (response2) {
                    buttonIsPressed = false;
                    pollingContent.filePickerMainImage.filename = response2.Item.FileName;
                    pollingContent.filePickerMainImage.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            pollingContent.parseFileIds(response.Item.LinkFileIds);
            pollingContent.filePickerFiles.filename = null;
            pollingContent.filePickerFiles.fileId = null;
            // if (pollingContent.selectedItem.ExpireDate == "9999-12-31T23:59:59.997")
            //     pollingContent.ExpireDate.defaultDate = "2018-11-01 23:59:59.997";
            $modal.open({
                templateUrl: "cpanelv1/ModulePolling/pollingContent/edit.html",
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Add a Content
    pollingContent.addNewContent = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        pollingContent.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath + "pollingcontent/add", pollingContent.selectedItem, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                pollingContent.ListItems.unshift(response.Item);
                pollingContent.gridOptions.fillData(pollingContent.ListItems, response.resultAccess);
                pollingContent.closeModal();
            }
            pollingContent.addRequested = false;

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            pollingContent.addRequested = false;
        });
    }

    //Edit New Content
    pollingContent.editContent = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        pollingContent.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath + "pollingcontent/edit", pollingContent.selectedItem, "PUT").success(function (response) {
            pollingContent.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                pollingContent.replaceItem(pollingContent.selectedItem.Id, response.Item, pollingContent.ListItems);
                pollingContent.gridOptions.fillData(pollingContent.ListItems, response.resultAccess);
                pollingContent.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            pollingContent.addRequested = false;
        });
    }

    //Delete a Content 
    pollingContent.deleteContent = function () {
        if (!pollingContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                ajax.call(cmsServerConfig.configApiServerPath + "pollingContent/GetOne", pollingContent.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    rashaErManage.checkAction(response);
                    pollingContent.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath + "pollingContent/delete", pollingContent.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            pollingContent.replaceItem(pollingContent.selectedItemForDelete.Id, false, pollingContent.ListItems);
                            pollingContent.gridOptions.fillData(pollingContent.ListItems, response.resultAccess);
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

    //Replace Item OnDelete/OnEdit Grid Options
    pollingContent.replaceItem = function (oldId, newItem, arr) {
        angular.forEach(arr, function (item, key) {
            if (item.Id == oldId) {
                var index = arr.indexOf(item);
                arr.splice(index, 1);
            }
        });
        if (newItem)
            arr.unshift(newItem);
    }

    //Close Model Stack
    pollingContent.addRequested = false;

    pollingContent.closeModal = function () {
        $modalStack.dismissAll();
    }
    pollingContent.deleteAttachedFile = function (index) {
        pollingContent.attachedFiles.splice(index, 1);
    }

    pollingContent.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !pollingContent.alreadyExist(id, pollingContent.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = {
                id: fId,
                name: fname
            };
            pollingContent.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    pollingContent.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    pollingContent.filePickerMainImage.removeSelectedfile = function (config) {
        pollingContent.filePickerMainImage.fileId = null;
        pollingContent.filePickerMainImage.filename = null;
        pollingContent.selectedItem.LinkMainImageId = null;

    }

    pollingContent.filePickerFiles.removeSelectedfile = function (config) {
        pollingContent.filePickerFiles.fileId = null;
        pollingContent.filePickerFiles.filename = null;
    }




    pollingContent.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }

    //For reInit Categories
    pollingContent.gridOptions.reGetAll = function (getAllwithFilters) {
        pollingContent.init();
    }

    pollingContent.gridOptions2.reGetAll = function (getAllwithFilters) {
        pollingContent.gridOptions.onRowSelected();
    }

    pollingContent.isCurrentNodeEmpty = function () {
        return !angular.equals({}, pollingContent.treeConfig.currentNode);
    }

    pollingContent.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    pollingContent.addRequested = false;




    //---------------------------------Add, Edit or Delete Options-----------------------------------
    pollingContent.updateContentOption = function (optionIndex) {
        if ($("#option" + optionIndex).is('[readonly]')) { // Update is pressed
            $("#editSaveBtn" + optionIndex).css("background-color", "#1ab394");
            $("#editSaveBtn" + optionIndex).attr("title", "ذخیره");
            $("#option" + optionIndex).attr("readonly", false);
        } else { // Save is pressed
            $("#option" + optionIndex).attr("readonly", true);
            $("#editSaveBtn" + optionIndex).css("background-color", "#f8ac59");
            $("#editSaveBtn" + optionIndex).attr("title", "ویرایش");
            ajax.call(cmsServerConfig.configApiServerPath + "pollingOption/GetOne", pollingContent.OptionList[optionIndex].Id, "GET").success(function (response) {
                rashaErManage.checkAction(response);
                pollingContent.selectedItemForUpdate = response.Item;
                pollingContent.selectedItemForUpdate.Option = pollingContent.OptionList[optionIndex].Option;
                ajax.call(cmsServerConfig.configApiServerPath + "pollingOption/edit", pollingContent.selectedItemForUpdate, "PUT").success(function (res) {
                    rashaErManage.checkAction(res);
                }).error(function (data2, errCode2, c2, d2) {
                    rashaErManage.checkAction(data2);
                    pollingContent.treeConfig.showbusy = false;
                    pollingContent.showIsBusy = false;
                });
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }
        $("#editSaveIcon" + optionIndex).toggleClass('fa-pencil-square-o fa-check');
    }

    pollingContent.OptionList = [];

    var optionModalAddMode = true;

    pollingContent.openOptionModal = function (selectedId) {
        if (!selectedId) {
            rashaErManage.showMessage("برای اضافه یا ویرایش گزینه لطفاً نظرسنجی مربوطه را انتخاب کنید .");
            return;
        }
        pollingContent.OptionList = [];
        var filterModel = {
            Filters: []
        };
        filterModel.Filters.push({
            PropertyName: "LinkPollingContentId",
            IntValue1: parseInt(selectedId),
            SearchType: 0
        });
        ajax.call(cmsServerConfig.configApiServerPath + "pollingoption/getall", filterModel, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            pollingContent.OptionList = response.ListItems;
            pollingContent.calculatePercantage(pollingContent.OptionList);
            ajax.call(cmsServerConfig.configApiServerPath + "pollingoption/GetViewModel", "", "GET").success(function (response) {
                rashaErManage.checkAction(response);
                pollingContent.selectedItem = response.Item;
                pollingContent.selectedItem.LinkPollingContentId = selectedId;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
            $modal.open({
                templateUrl: "cpanelv1/ModulePolling/pollingContent/addOption.html",
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit or Delete options
    pollingContent.editDeleteOptions = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (pollingContent.OptionList.length < 2) {
            rashaErManage.showMessage("شما باید حداقل دو جواب برای این نظرسنجی مشخص کنید!");
            return;
        }

        // Get Options
        var optionsBeforeSave = [];
        var Filter_value = {
            PropertyName: "LinkPollingContentId",
            IntValue1: pollingContent.gridOptions.selectedRow.item.Id,
            SearchType: 0
        }
        // -----------

        for (var i = 0; i < pollingContent.OptionList.length; i++) {
            for (var i = 0; i < optionsBeforeSave.length; i++) {

            }
        }
        // Delete all options
        pollingContent.contentBusyIndicator.isActive = true;
        for (var i = 0; i < pollingContent.listComments.length; i++) {
            ajax.call(cmsServerConfig.configApiServerPath + "pollingOption/GetOne", pollingContent.listComments[i].Id, "GET").success(function (response) {
                pollingContent.showbusy = false;
                pollingContent.showIsBusy = false;
                rashaErManage.checkAction(response);
                pollingContent.selectedItemForDelete = response.Item;
                ajax.call(cmsServerConfig.configApiServerPath + "pollingOption/delete", pollingContent.selectedItemForDelete, 'POST').success(function (res) {
                    pollingContent.treeConfig.showbusy = false;
                    pollingContent.showIsBusy = false;
                    rashaErManage.checkAction(res);
                    if (res.IsSuccess) {
                        //pollingContent.replaceItem(pollingContent.selectedItemForDelete.Id);
                        pollingContent.gridOptions.fillData(pollingContent.ListItems, response.resultAccess);
                    }
                }).error(function (data2, errCode2, c2, d2) {
                    rashaErManage.checkAction(data2);
                    pollingContent.treeConfig.showbusy = false;
                    pollingContent.showIsBusy = false;
                });
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                pollingContent.treeConfig.showbusy = false;
                pollingContent.showIsBusy = false;
            });
        }

        // Add all options
        pollingContent.contentBusyIndicator.isActive = true;
        pollingContent.addRequested = true;
        for (var i = 0; i < pollingContent.OptionList.length; i++) {
            ajax.call(cmsServerConfig.configApiServerPath + 'pollingOption/add', pollingContent.OptionList[i], 'POST').success(function (response) {
                pollingContent.addRequested = false;
                pollingContent.contentBusyIndicator.isActive = false;
                rashaErManage.checkAction(response);
                if (response.IsSuccess) {
                    pollingContent.closeModal();
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                pollingContent.contentBusyIndicator.isActive = false;
                pollingContent.addRequested = false;
            });
        }
    }

    // Open Add Content Modal
    pollingContent.openAddOptionModal = function () {
        var item = pollingContent.gridOptions.selectedRow.item;
        if (item.Id == 0 || !item.Id) {
            rashaErManage.showMessage("برای اضافه کردن گزینه لطفاً سوال مربوطه را انتخاب کنید .");
            return;
        }
        pollingContent.addRequested = false;
        pollingContent.modalTitle = "اضافه";
        ajax.call(cmsServerConfig.configApiServerPath + "pollingoption/GetViewModel", "", "GET").success(function (response) {
            rashaErManage.checkAction(response);
            pollingContent.selectedItem = response.Item;
            pollingContent.selectedItem.LinkPollingContentId = item.Id;
            $modal.open({
                templateUrl: "cpanelv1/ModulePolling/pollingOption/add.html",
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    pollingContent.addNewOption = function (frm, addtoGrid) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (pollingContent.selectedItem.Option == null || pollingContent.selectedItem.Option == "") {
            rashaErManage.showMessage($filter('translatentk')('Option_can_not_be_empty'));
            return;
        }
        pollingContent.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath + "pollingoption/add", pollingContent.selectedItem, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                if (addtoGrid) {
                    pollingContent.OptionList.unshift(response.Item);
                    pollingContent.gridOptions2.fillData(pollingContent.OptionList);
                    pollingContent.closeModal();
                } else {
                    pollingContent.selectedItem.Option = ""; //Clear textbox
                    pollingContent.OptionList.push(response.Item);
                    pollingContent.closeModal();
                }
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            pollingContent.addRequested = false;
        });
    }

    // Open Edit Content Modal
    pollingContent.openEditOptionModal = function () {
        pollingContent.addRequested = false;
        pollingContent.modalTitle = "ویرایش";
        if (!pollingContent.gridOptions2.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath + "pollingoption/GetOne", pollingContent.gridOptions2.selectedRow.item.Id, "GET").success(function (response) {
            rashaErManage.checkAction(response);
            pollingContent.selectedItem = response.Item;
            // pollingContent.FromDate.defaultDate = pollingContent.selectedItem.FromDate;
            // pollingContent.ExpireDate.defaultDate = pollingContent.selectedItem.ExpireDate;
            // if (pollingContent.selectedItem.ExpireDate == "9999-12-31T23:59:59.997")
            //     pollingContent.ExpireDate.defaultDate = "2018-11-01 23:59:59.997";
            $modal.open({
                templateUrl: "cpanelv1/ModulePolling/pollingOption/edit.html",
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Edit New Content
    pollingContent.editOption = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        pollingContent.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath + "pollingoption/edit", pollingContent.selectedItem, "PUT").success(function (response) {
            pollingContent.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                pollingContent.replaceItem(pollingContent.selectedItem.Id, response.Item, pollingContent.OptionList);
                pollingContent.gridOptions2.fillData(pollingContent.OptionList, response.resultAccess);
                pollingContent.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            pollingContent.addRequested = false;
        });
    }

    pollingContent.deleteOption = function (item) {
        if (!pollingContent.gridOptions2.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                ajax.call(cmsServerConfig.configApiServerPath + "pollingoption/GetOne", pollingContent.gridOptions2.selectedRow.item.Id, "GET").success(function (response) {
                    rashaErManage.checkAction(response);
                    pollingContent.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath + "pollingoption/delete", pollingContent.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            pollingContent.replaceItem(pollingContent.selectedItemForDelete.Id, false, pollingContent.OptionList);
                            pollingContent.gridOptions2.fillData(pollingContent.OptionList, response.resultAccess);
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

    pollingContent.deleteContentOption = function (index) {
        pollingContent.addOptionBusyIndicator = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), "آیا می خواهید این گزینه را حذف کنید؟", function (isConfirmed) {
            if (isConfirmed) {
                pollingContent.addOptionBusyIndicator = true;
                ajax.call(cmsServerConfig.configApiServerPath + "pollingoption/GetOne", pollingContent.OptionList[index].Id, "GET").success(function (response) {
                    pollingContent.addOptionBusyIndicator = false;
                    rashaErManage.checkAction(response);
                    pollingContent.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath + "pollingoption/delete", pollingContent.selectedItemForDelete, 'POST').success(function (res) {
                        pollingContent.addOptionBusyIndicator = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            //pollingContent.replaceItem(pollingContent.selectedItemForDelete.Id);
                            pollingContent.OptionList.splice(index, 1);
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

    //-----------------------------------End of Add, Edit or Delete Options-------------------------------

    pollingContent.calculatePercantage = function (list) {
        if (angular.isDefined(list) && list.length > 0) {
            var totalCount = 0;
            $.each(list, function (index, item) {
                totalCount += item.NumberOfVotes;
            });

            $.each(list, function (index, item) {
                if (totalCount == 0)
                    item.Percentage = '%0';
                else
                    item.Percentage = '%' + ((item.NumberOfVotes * 100) / totalCount).toFixed(2);
            });
        }
    }

    function searchAndDeleteFromTree(deletedItem, currentNode) {
        var i,
            currentChild,
            result;

        if (deletedItem.LinkParentId == currentNode.Id) {
            var elementPos = currentNode.Children.map(function (x) {
                return x.Id;
            }).indexOf(deletedItem.Id); // find the index of an item in an array
            currentNode.Children.splice(elementPos, 1);
            return true;
        } else {
            // Use a for loop instead of forEach to avoid nested functions
            // Otherwise "return" will not work properly
            if (currentNode.Children != undefined)
                for (i = 0; i < currentNode.Children.length; i += 1) {
                    currentChild = currentNode.Children[i];

                    // Search in the current child
                    result = searchAndDeleteFromTree(deletedItem, currentChild);

                    // Return the result if the node has been found
                    if (result !== false) {
                        return result;
                    }
                }
            // The node has not been found and we have no more options
            return false;
        }
    }
    pollingContent.columnCheckbox = false;
    pollingContent.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = pollingContent.gridOptions.columns;
        if (pollingContent.gridOptions.columnCheckbox) {
            for (var i = 0; i < pollingContent.gridOptions.columns.length; i++) {
                //pollingContent.gridOptions.columns[i].visible = $("#" + pollingContent.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + pollingContent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                pollingContent.gridOptions.columns[i].visible = temp;
            }
        } else {

            for (var i = 0; i < pollingContent.gridOptions.columns.length; i++) {
                var element = $("#" + pollingContent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + pollingContent.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < pollingContent.gridOptions.columns.length; i++) {
            console.log(pollingContent.gridOptions.columns[i].name.concat(".visible: "), pollingContent.gridOptions.columns[i].visible);
        }
        pollingContent.gridOptions.columnCheckbox = !pollingContent.gridOptions.columnCheckbox;
    }
    // ----------- FilePicker Codes --------------------------------
    pollingContent.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !pollingContent.alreadyExist(id, pollingContent.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId,
                filename: fname
            };
            pollingContent.attachedFiles.push(file);
            pollingContent.clearfilePickers();
        }
    }

    pollingContent.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                pollingContent.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    pollingContent.deleteAttachedfieldName = function (index) {
        ajax.call(cmsServerConfig.configApiServerPath + 'pollingContent/delete', pollingContent.contractsList[index], 'POST').success(function (res) {
            rashaErManage.checkAction(res);
            if (res.IsSuccess) {
                pollingContent.contractsList.splice(index, 1);
                rashaErManage.showMessage($filter('translatentk')('Removed_Successfully'));
            }
        }).error(function (data2, errCode2, c2, d2) {
            rashaErManage.checkAction(data2);
        });
    }

    pollingContent.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) { // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath + 'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            pollingContent.attachedFiles.push({
                                fileId: response.Item.Id,
                                filename: response.Item.FileName
                            });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    pollingContent.clearfilePickers = function () {
        pollingContent.filePickerFiles.fileId = null;
        pollingContent.filePickerFiles.filename = null;
    }

    pollingContent.stringfyLinkFileIds = function () {
        $.each(pollingContent.attachedFiles, function (i, item) {
            if (pollingContent.selectedItem.LinkFileIds == "")
                pollingContent.selectedItem.LinkFileIds = item.fileId;
            else
                pollingContent.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------

    //upload file
    pollingContent.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (pollingContent.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ pollingContent.replaceFile(uploadFile.name);
                    pollingContent.itemClicked(null, pollingContent.fileIdToDelete, "file");
                    pollingContent.fileTypes = 1;
                    pollingContent.fileIdToDelete = pollingContent.selectedIndex;
                    // replace the file
                    ajax
                        .call(
                            cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                            pollingContent.fileIdToDelete,
                            "GET"
                        )
                        .success(function (response1) {
                            if (response1.IsSuccess == true) {
                                console.log(response1.Item);
                                ajax.call(cmsServerConfig.configApiServerPath + "FileContent/replace", response1.Item, "POST")
                                    .success(function (response2) {
                                        if (response2.IsSuccess == true) {
                                            pollingContent.FileItem = response2.Item;
                                            pollingContent.showSuccessIcon();
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-check");
                                            pollingContent.filePickerMainImage.filename =
                                                pollingContent.FileItem.FileName;
                                            pollingContent.filePickerMainImage.fileId =
                                                response2.Item.Id;
                                            pollingContent.selectedItem.LinkMainImageId =
                                                pollingContent.filePickerMainImage.fileId;
                                        } else {
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-remove");
                                        }
                                    })
                                    .error(function (data) {
                                        pollingContent.showErrorIcon();
                                        $("#save-icon" + index).removeClass("fa-save");
                                        $("#save-button" + index).removeClass("flashing-button");
                                        $("#save-icon" + index).addClass("fa-remove");
                                    });
                                //-----------------------------------
                            }
                        })
                        .error(function (data) {
                            console.log(data);
                        });
                    //--------------------------------
                } else {
                    return;
                }
            } else { // File does not exists
                // Save New file
                ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetViewModel", "", 'GET').success(function (response) {
                    pollingContent.FileItem = response.Item;
                    pollingContent.FileItem.FileName = uploadFile.name;
                    pollingContent.FileItem.uploadName = uploadFile.uploadName;
                    pollingContent.FileItem.Extension = uploadFile.name.split('.').pop();
                    pollingContent.FileItem.FileSrc = uploadFile.name;
                    pollingContent.FileItem.LinkCategoryId = null; //Save the new file in the root
                    // ------- pollingContent.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath + "FileContent/add", pollingContent.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            pollingContent.FileItem = response.Item;
                            pollingContent.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            pollingContent.filePickerMainImage.filename = pollingContent.FileItem.FileName;
                            pollingContent.filePickerMainImage.fileId = response.Item.Id;
                            pollingContent.selectedItem.LinkMainImageId = pollingContent.filePickerMainImage.fileId

                        } else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        pollingContent.showErrorIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass("flashing-button");
                        $("#save-icon" + index).addClass("fa-remove");
                    });
                    //-----------------------------------
                }).error(function (data) {
                    console.log(data);
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-remove");
                });
            }
        }
    }
    //End of Upload Modal-----------------------------------------
    //Export Report 
    pollingContent.exportFile = function () {
        pollingContent.reportDownloadLink = null;
        pollingContent.addRequested = true;
        pollingContent.gridOptions.advancedSearchData.engine.ExportFile = pollingContent.ExportFileClass;
        if (pollingContent.exportOptions) {
            var engine = {
                SortColumn: "NumberOfVotes",
                SortType: 0,
                Filters: [{
                    PropertyName: "LinkPollingContentId",
                    SearchType: 0,
                    IntValue1: pollingContent.gridOptions.selectedRow.item.Id
                }],
                ExportFile: pollingContent.ExportFileClass,
                CurrentPageNumber: 1
            };
            ajax.call(cmsServerConfig.configApiServerPath + 'pollingoption/exportfile', engine, 'POST').success(function (response) {
                pollingContent.addRequested = false;
                rashaErManage.checkAction(response);
                pollingContent.reportDownloadLink = window.location.origin + response.LinkFile;
                if (response.IsSuccess) {
                    $window.open(response.LinkFile, '_blank');
                    console.log(window.location);
                    //pollingContent.closeModal();
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        } else
            ajax.call(cmsServerConfig.configApiServerPath + 'pollingContent/exportfile', pollingContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
                pollingContent.addRequested = false;
                rashaErManage.checkAction(response);
                pollingContent.reportDownloadLink = response.LinkFile;
                if (response.IsSuccess) {
                    $window.open(response.LinkFile, '_blank');
                    //pollingContent.closeModal();
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
    }

    //Open Export Report Modal
    pollingContent.toggleExportForm = function (options) {
        pollingContent.exportOptions = false;
        if (angular.isDefined(options))
            pollingContent.exportOptions = true;
        pollingContent.SortType = [{
                key: 'نزولی',
                value: 0
            },
            {
                key: 'صعودی',
                value: 1
            },
            {
                key: 'تصادفی',
                value: 3
            }
        ];
        pollingContent.EnumExportFileType = [{
                key: 'Excel',
                value: 1
            },
            {
                key: 'PDF',
                value: 2
            },
            {
                key: 'Text',
                value: 3
            }
        ];
        pollingContent.EnumExportReceiveMethod = [{
                key: 'دانلود',
                value: 0
            },
            {
                key: 'ایمیل',
                value: 1
            },
            {
                key: 'فایل منیجر',
                value: 3
            }
        ];
        pollingContent.ExportFileClass = {
            FileType: 1,
            RecieveMethod: 0,
            RowCount: 200
        };
        $modal.open({
            templateUrl: 'cpanelv1/ModulePolling/PollingContent/report.html',
            scope: $scope
        });
    }

    //Row Count Export Input Change
    pollingContent.rowCountChanged = function () {
        if (!angular.isDefined(pollingContent.ExportFileClass.RowCount) || pollingContent.ExportFileClass.RowCount > 5000)
            pollingContent.ExportFileClass.RowCount = 5000;
    }

    //Get TotalRowCount
    pollingContent.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath + "pollingContent/count", pollingContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            pollingContent.addRequested = false;
            rashaErManage.checkAction(response);
            pollingContent.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            pollingContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Get TotalRowCount
    pollingContent.getOptionsCount = function () {
        var filterOptions = {
            Filters: [{
                PropertyName: "LinkPollingContentId",
                SearchType: 0,
                IntValue1: pollingContent.gridOptions.selectedRow.item.Id
            }]
        };
        ajax.call(cmsServerConfig.configApiServerPath + "pollingoption/count", filterOptions, 'POST').success(function (response) {
            pollingContent.addRequested = false;
            rashaErManage.checkAction(response);
            pollingContent.ListItemsTotalOptionsRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            pollingContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    //TreeControl
    pollingContent.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (pollingContent.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    pollingContent.onNodeToggle = function (node, expanded) {
        if (expanded) {
            node.Children = [];
            var filterModel = {
                Filters: []
            };
            var originalName = node.Title;
            node.messageText = " در حال بارگذاری...";
            filterModel.Filters.push({
                PropertyName: "LinkParentId",
                SearchType: 0,
                IntValue1: node.Id
            });
            ajax.call(cmsServerConfig.configApiServerPath + "FileCategory/GetAll", filterModel, 'POST').success(function (response1) {
                angular.forEach(response1.ListItems, function (value, key) {
                    node.Children.push(value);
                });
                ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", node.Id, 'POST').success(function (response2) {
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

    pollingContent.onSelection = function (node, selected) {
        if (!selected) {
            pollingContent.selectedItem.LinkMainImageId = null;
            pollingContent.selectedItem.previewImageSrc = null;
            return;
        }
        pollingContent.selectedItem.LinkMainImageId = node.Id;
        pollingContent.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages + "loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", node.Id, "GET").success(function (response) {
            pollingContent.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);