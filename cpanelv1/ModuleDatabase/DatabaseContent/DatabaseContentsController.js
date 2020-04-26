app.controller("dbContentCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $filter) {
    var dbContent = this;
    //For Grid Options
    dbContent.gridOptions = {};
    dbContent.selectedItem = {};
    dbContent.attachedFiles = [];
    dbContent.attachedFile = "";

    dbContent.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    dbContent.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    dbContent.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    dbContent.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:dbContent.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:dbContent,
        useCurrentLocationZoom:12,
    }
    if (itemRecordStatus != undefined) dbContent.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    dbContent.selectedItem.ToDate = date;
    dbContent.datePickerConfig = {
        defaultDate: date
    };
    dbContent.startDate = {
        defaultDate: date
    }
    dbContent.endDate = {
        defaultDate: date
    }
    dbContent.count = 0;

    //DB Grid Options
    dbContent.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'Description', displayName: 'عنوان توضیحات', sortable: true, type: 'string', visible: 'true' },
            { name: 'FromDate', displayName: 'تاریخ آغاز', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'ToDate', displayName: 'تاریخ پایان', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: "ActionKey", displayName: "کلیدعملیاتی", displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="dbContent.addMenu()"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    //Comment Grid Options
    dbContent.gridContentOptions = {
        columns: [
           { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
           { name: 'Writer', displayName: 'نویسنده', sortable: true, type: 'string' },
           { name: 'Comment', displayName: 'کامنت', sortable: true, type: 'string' },
           { name: 'ActionButtons', displayName: 'کلید عملیاتی', template: '<Button ng-if="!x.IsActivated" ng-click="dbContent.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button>' + '<Button ng-if="x.IsActivated" ng-click="dbContent.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button>' + '<Button ng-click="dbContent.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>' },
        ],
        data: {},
        multiSelect: false,
        showUserSearchPanel: false,
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

    dbContent.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        multiSelect: false
    }

    dbContent.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false
    }

    //For Show Category Loading Indicator
    dbContent.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show DB Loading Indicator
    dbContent.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    dbContent.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    dbContent.addMenu = function () {
        $modal.open({
            templateUrl: "cpanelv1/ModuleDatabase/DBContent/modalMenu.html",
            scope: $scope
        });
    }

    dbContent.treeConfig.currentNode = {};
    dbContent.treeBusyIndicator = false;

    dbContent.addRequested = false;

    dbContent.showGridComment = false;
    dbContent.dbTitle = "";

    dbContent.summernoteOptions = {
        height: 300,
        focus: true,
        airMode: false,
        toolbar: [
                ['edit', ['undo', 'redo']],
                ['headline', ['style']],
                ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
                ['fontface', ['fontname']],
                ['textsize', ['fontsize']],
                ['fontclr', ['color']],
                ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
                ['height', ['height']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'video', 'hr']],
                ['view', ['fullscreen', 'codeview']],
                ['help', ['help']]
        ]
    };
    //init Function
    dbContent.init = function () {
        dbContent.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = dbContent.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        ajax.call(cmsServerConfig.configApiServerPath+"DBCategory/getall", engine, 'POST').success(function (response) {
            dbContent.treeConfig.Items = response.ListItems;
            dbContent.treeConfig.Items = response.ListItems;
            dbContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        ajax.call(cmsServerConfig.configApiServerPath+"dbContent/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            dbContent.ListItems = response.ListItems;
            dbContent.gridOptions.fillData(dbContent.ListItems, response.resultAccess); // Sending Access as an argument
            dbContent.contentBusyIndicator.isActive = false;
            dbContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            dbContent.gridOptions.totalRowCount = response.TotalRowCount;
            dbContent.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            dbContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            dbContent.contentBusyIndicator.isActive = false;
        });
    };

    // For Show Comments
    dbContent.showComment = function () {

        if (dbContent.gridOptions.selectedRow.item) {
            //var id = dbContent.gridOptions.selectedRow.item.Id;

            var Filter_value = {
                PropertyName: "LinkdbContentId",
                IntValue1: dbContent.gridOptions.selectedRow.item.Id,
                SearchType: 0
            }
            dbContent.gridContentOptions.advancedSearchData.engine.Filters = null;
            dbContent.gridContentOptions.advancedSearchData.engine.Filters = [];
            dbContent.gridContentOptions.advancedSearchData.engine.Filters.push(Filter_value);


            ajax.call(cmsServerConfig.configApiServerPath+'dbComment/getall', dbContent.gridContentOptions.advancedSearchData.engine, 'POST').success(function (response) {
                dbContent.listComments = response.ListItems;
                //dbContent.gridOptions.resultAccess = response.resultAccess; // دسترسی ها نمایش
                dbContent.gridContentOptions.fillData(dbContent.listComments, response.resultAccess);
                dbContent.gridContentOptions.currentPageNumber = response.CurrentPageNumber;
                dbContent.gridContentOptions.totalRowCount = response.TotalRowCount;
                dbContent.allowedSearch = response.AllowedSearchField;
                rashaErManage.checkAction(response);
                dbContent.gridContentOptions.RowPerPage = response.RowPerPage;
                dbContent.showGridComment = true;
                dbContent.Title = dbContent.gridOptions.selectedRow.item.Title;
            });
        }
    }

    dbContent.gridOptions.onRowSelected = function () {
        var item = dbContent.gridOptions.selectedRow.item;
        dbContent.showComment(item);
    }

    dbContent.gridContentOptions.onRowSelected = function () { }

    // Open Add Category Modal 
    dbContent.addNewCategoryModel = function () {
        dbContent.addRequested = false;
        ajax.call(cmsServerConfig.configApiServerPath+'DBCategory/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            dbContent.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDatabase/DBCategory/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Open Edit Category Modal
    dbContent.EditCategoryModel = function () {
        dbContent.addRequested = false;
        dbContent.modalTitle = 'ویرایش';
        if (!dbContent.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        dbContent.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'DBCategory/GetOne', dbContent.treeConfig.currentNode.Id, 'GET').success(function (response) {
            dbContent.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            dbContent.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDatabase/dbCategory/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Category
    dbContent.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        dbContent.categoryBusyIndicator.isActive = true;
        dbContent.addRequested = true;
        dbContent.selectedItem.LinkParentId = null;
        //if (dbContent.treeConfig.currentNode != null)
        //    dbContent.selectedItem.LinkParentId = dbContent.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'DBCategory/add', dbContent.selectedItem, 'POST').success(function (response) {
            dbContent.addRequested = false;
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                dbContent.gridOptions.advancedSearchData.engine.Filters = null;
                dbContent.gridOptions.advancedSearchData.engine.Filters = [];
                dbContent.gridOptions.reGetAll();
                dbContent.closeModal();
            }
            dbContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            dbContent.addRequested = false;
            dbContent.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    dbContent.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        dbContent.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'DBCategory/edit', dbContent.selectedItem, 'PUT').success(function (response) {
            dbContent.addRequested = true;
            //dbContent.showbusy = false;
            dbContent.treeConfig.showbusy = false;
            dbContent.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                dbContent.addRequested = false;
                dbContent.treeConfig.currentNode.Title = response.Item.Title;
                dbContent.closeModal();
            }
            dbContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            dbContent.addRequested = false;
            dbContent.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    dbContent.deleteCategory = function () {
        var node = dbContent.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                dbContent.categoryBusyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath+'DBCategory/GetOne', node.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    dbContent.selectedItemForDelete = response.Item;
                    console.log(dbContent.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'DBCategory/delete', dbContent.selectedItemForDelete, 'POST').success(function (res) {

                        if (res.IsSuccess) {
                            dbContent.gridOptions.advancedSearchData.engine.Filters = null;
                            dbContent.gridOptions.advancedSearchData.engine.Filters = [];
                            dbContent.gridOptions.fillData();
                            dbContent.categoryBusyIndicator.isActive = false;
                            dbContent.gridOptions.reGetAll();
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        dbContent.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    dbContent.categoryBusyIndicator.isActive = false;

                });

            }
        });
    }

    //Tree On Node Select Options
    dbContent.treeConfig.onNodeSelect = function () {
        var node = dbContent.treeConfig.currentNode;
        dbContent.showGridComment = false;
        //dbContent.selectedItem.LinkCategoryId = node.Id;
        dbContent.selectContent(node);

    };
    //Show Content with Category Id
    dbContent.selectContent = function (node) {
        dbContent.gridOptions.advancedSearchData.engine.Filters = null;
        dbContent.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            dbContent.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            dbContent.contentBusyIndicator.isActive = true;
            //dbContent.gridOptions.advancedSearchData = {};
            dbContent.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryId",
                IntValue1: node.Id,
                SearchType: 0
            }
            dbContent.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"dbContent/getall", dbContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            dbContent.contentBusyIndicator.isActive = false;
            dbContent.ListItems = response.ListItems;
            dbContent.gridOptions.fillData(dbContent.ListItems, response.resultAccess); // Sending Access as an argument
            dbContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            dbContent.gridOptions.totalRowCount = response.TotalRowCount;
            dbContent.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            dbContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    dbContent.addNewContentModel = function () {
        var node = dbContent.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_DataBase_Please_Select_The_Category'));
            return;
        }

        dbContent.attachedFiles = [];
        dbContent.attachedFile = "";
        dbContent.filePickerMainImage.filename = "";
        dbContent.filePickerMainImage.fileId = null;
        dbContent.filePickerFiles.filename = "";
        dbContent.filePickerFiles.fileId = null;
        dbContent.addRequested = false;
        dbContent.modalTitle = 'اضافه کردن محتوای جدید';
        ajax.call(cmsServerConfig.configApiServerPath+'dbContent/GetViewModel', "", 'GET').success(function (response) {
            console.log(response);
            rashaErManage.checkAction(response);
            dbContent.selectedItem = response.Item;
            dbContent.selectedItem.LinkCategoryId = node.Id;
            dbContent.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDatabase/dbContent/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    dbContent.editContentModel = function () {
        dbContent.addRequested = false;
        dbContent.modalTitle = 'ویرایش';
        if (!dbContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'dbContent/GetOne', dbContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            dbContent.selectedItem = response1.Item;
            dbContent.startDate.defaultDate = dbContent.selectedItem.FromDate;
            dbContent.endDate.defaultDate = dbContent.selectedItem.ToDate;
            dbContent.filePickerMainImage.filename = null;
            dbContent.filePickerMainImage.fileId = null;
            if (response1.Item.LinkMainImageId != null) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', response1.Item.LinkMainImageId, 'GET').success(function (response2) {
                    dbContent.filePickerMainImage.filename = response2.Item.FileName;
                    dbContent.filePickerMainImage.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            dbContent.parseFileIds(response1.Item.LinkFileIds);
            dbContent.filePickerFiles.filename = null;
            dbContent.filePickerFiles.fileId = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleDatabase/DatabaseContent/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    dbContent.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        dbContent.categoryBusyIndicator.isActive = true;
        dbContent.addRequested = true;
        console.log(('dbContent.selectedItem: ' + dbContent.selectedItem));
        dbContent.selectedItem.LinkFileIds = angular.toJson(dbContent.attachedFiles, function (key, val) {
            if (key == '$$hashKey') {
                return undefined;
            }
            return val;
        });
        ajax.call(cmsServerConfig.configApiServerPath+'dbContent/add', dbContent.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            dbContent.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                dbContent.ListItems.unshift(response.Item);
                dbContent.gridOptions.fillData(dbContent.ListItems);
                dbContent.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            dbContent.addRequested = false;
            dbContent.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit  Content REST Api
    dbContent.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        dbContent.categoryBusyIndicator.isActive = true;
        dbContent.addRequested = true;
        dbContent.selectedItem.LinkFileIds = angular.toJson(dbContent.attachedFiles, function (key, val) {
            if (key == '$$hashKey') {
                return undefined;
            }
            return val;
        });
        ajax.call(cmsServerConfig.configApiServerPath+'dbContent/edit', dbContent.selectedItem, 'PUT').success(function (response) {
            dbContent.categoryBusyIndicator.isActive = false;
            dbContent.addRequested = false;
            dbContent.treeConfig.showbusy = false;
            dbContent.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                dbContent.replaceItem(dbContent.selectedItem.Id, response.Item);
                dbContent.gridOptions.fillData(dbContent.ListItems);
                dbContent.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            dbContent.addRequested = false;
            dbContent.categoryBusyIndicator.isActive = false;
        });
    }

    // Delete a DB Content 
    dbContent.deleteContent = function () {
        if (!dbContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        dbContent.treeConfig.showbusy = true;
        dbContent.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                dbContent.categoryBusyIndicator.isActive = true;
                console.log(dbContent.gridOptions.selectedRow.item);
                dbContent.showbusy = true;
                dbContent.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+"dbContent/GetOne", dbContent.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    dbContent.showbusy = false;
                    dbContent.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    dbContent.selectedItemForDelete = response.Item;
                    console.log(dbContent.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"dbContent/delete", dbContent.selectedItemForDelete, 'POST').success(function (res) {
                        dbContent.categoryBusyIndicator.isActive = false;
                        dbContent.treeConfig.showbusy = false;
                        dbContent.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            dbContent.replaceItem(dbContent.selectedItemForDelete.Id);
                            dbContent.gridOptions.fillData(dbContent.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        dbContent.treeConfig.showbusy = false;
                        dbContent.showIsBusy = false;
                        dbContent.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    dbContent.treeConfig.showbusy = false;
                    dbContent.showIsBusy = false;
                    dbContent.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }

    //Confirm/UnConfirm DB Content
    dbContent.confirmUnConfirmdbContent = function () {
        if (!dbContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'dbContent/GetOne', dbContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            dbContent.selectedItem = response.Item;
            dbContent.selectedItem.IsAccepted = (response.Item.IsAccepted == true) ? false : true;
            ajax.call(cmsServerConfig.configApiServerPath+'dbContent/edit', dbContent.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = dbContent.ListItems.indexOf(dbContent.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        dbContent.ListItems[index] = response2.Item;
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

    //Add To Archive New Content
    dbContent.enableArchive = function () {
        if (!dbContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'dbContent/GetOne', dbContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            dbContent.selectedItem = response.Item;
            dbContent.selectedItem.IsArchive = (response.Item.IsArchive == true) ? false : true;
            ajax.call(cmsServerConfig.configApiServerPath+'dbContent/edit', dbContent.selectedItem, 'PUT').success(function (response2) {
                dbContent.categoryBusyIndicator.isActive = true;
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = dbContent.ListItems.indexOf(dbContent.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        dbContent.ListItems[index] = response2.Item;
                    }
                    console.log("Arshived Succsseffully");
                    dbContent.categoryBusyIndicator.isActive = false;
                }

            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                dbContent.categoryBusyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            dbContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Replace Item OnDelete/OnEdit Grid Options
    dbContent.replaceItem = function (oldId, newItem) {
        angular.forEach(dbContent.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = dbContent.ListItems.indexOf(item);
                dbContent.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            dbContent.ListItems.unshift(newItem);
    }

    dbContent.summernoteText = '<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />';
    dbContent.searchData = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"dbContent/getall", dbContent.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            dbContent.dbsBusyIndicator.isActive = false;
            dbContent.ListItems = response.ListItems;
            dbContent.gridOptions.fillData(dbContent.ListItems);
            dbContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            dbContent.gridOptions.totalRowCount = response.TotalRowCount;
            dbContent.gridOptions.rowPerPage = response.RowPerPage;
            dbContent.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            dbContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    dbContent.addRequested = false;
    dbContent.closeModal = function () {
        $modalStack.dismissAll();
    };

    dbContent.showIsBusy = false;

    //Aprove a comment
    dbContent.confirmComment = function (item) {
        console.log("This comment will be confirmed:", item);
    }

    //Decline a comment
    dbContent.doNotConfirmComment = function (item) {
        console.log("This comment will not be confirmed:", item);

    }
    //Remove a comment
    dbContent.deleteComment = function (item) {
        if (!dbContent.gridContentOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        dbContent.treeConfig.showbusy = true;
        dbContent.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), "آیا می خواهید این نظر را حذف کنید", function (isConfirmed) {
            if (isConfirmed) {
                console.log("Item to be deleted: ", dbContent.gridOptions.selectedRow.item);
                dbContent.showbusy = true;
                dbContent.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+'dbContent/GetOne', dbContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    dbContent.showbusy = false;
                    dbContent.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    dbContent.selectedItemForDelete = response.Item;
                    console.log(dbContent.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'dbContent/delete', dbContent.selectedItemForDelete, 'POST').success(function (res) {
                        dbContent.treeConfig.showbusy = false;
                        dbContent.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            dbContent.replaceItem(dbContent.selectedItemForDelete.Id);
                            dbContent.gridOptions.fillData(dbContent.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        dbContent.treeConfig.showbusy = false;
                        dbContent.showIsBusy = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    dbContent.treeConfig.showbusy = false;
                    dbContent.showIsBusy = false;
                });
            }
        });
    }

    //For reInit Categories
    dbContent.gridOptions.reGetAll = function () {
        if (dbContent.gridOptions.advancedSearchData.engine.Filters.length > 0) dbContent.searchData();
        else dbContent.init();
    };



    dbContent.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            dbContent.focusExpireLockAccount = true;
        });
    };

    dbContent.isCurrentNodeEmpty = function () {
        return !angular.equals({}, dbContent.treeConfig.currentNode);
    }

    dbContent.loadFileAndFolder = function (item) {
        dbContent.treeConfig.currentNode = item;
        console.log(item);
        dbContent.treeConfig.onNodeSelect(item);
    }
    dbContent.addRequested = true;

    dbContent.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            dbContent.focus = true;
        });
    };
    dbContent.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            dbContent.focus1 = true;
        });
    };

    dbContent.columnCheckbox = false;
    dbContent.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = dbContent.gridOptions.columns;
        if (dbContent.gridOptions.columnCheckbox) {
            for (var i = 0; i < dbContent.gridOptions.columns.length; i++) {
                //dbContent.gridOptions.columns[i].visible = $("#" + dbContent.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + dbContent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                dbContent.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < dbContent.gridOptions.columns.length; i++) {
                var element = $("#" + dbContent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + dbContent.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < dbContent.gridOptions.columns.length; i++) {
            console.log(dbContent.gridOptions.columns[i].name.concat(".visible: "), dbContent.gridOptions.columns[i].visible);
        }
        dbContent.gridOptions.columnCheckbox = !dbContent.gridOptions.columnCheckbox;
    }

    dbContent.deleteAttachedFile = function (index) {
        dbContent.attachedFiles.splice(index, 1);
    }

    dbContent.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !dbContent.alreadyExist(id, dbContent.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = { id: fId, name: fname };
            dbContent.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    dbContent.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    dbContent.parseFileIds = function (stringOfIds) {
        dbContent.attachedFiles = [];
        dbContent.attachedFile = "";
        if (stringOfIds != undefined && stringOfIds != null) {
            var fileIds = JSON.parse(stringOfIds)
            if (fileIds != undefined && fileIds.length > 0 && fileIds != null) {
                dbContent.attachedFiles = fileIds;

            }
        }
    }

    dbContent.filePickerMainImage.removeSelectedfile = function (config) {
        dbContent.filePickerMainImage.fileId = null;
        dbContent.filePickerMainImage.filename = null;
        dbContent.selectedItem.LinkMainImageId = null;

    }

    dbContent.filePickerFiles.removeSelectedfile = function (config) {
        dbContent.filePickerFiles.fileId = null;
        dbContent.filePickerFiles.filename = null;
    }
    //Export Report 
    dbContent.exportFile = function () {
        dbContent.addRequested = true;
        dbContent.gridOptions.advancedSearchData.engine.ExportFile = dbContent.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'DatabaseContent/exportfile', dbContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                dbContent.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //dbContent.closeModal();
            }
            dbContent.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    dbContent.toggleExportForm = function () {
        dbContent.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        dbContent.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        dbContent.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        dbContent.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        dbContent.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleDatabase/DatabaseContent/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    dbContent.rowCountChanged = function () {
        if (!angular.isDefined(dbContent.ExportFileClass.RowCount) || dbContent.ExportFileClass.RowCount > 5000)
            dbContent.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    dbContent.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"DatabaseContent/count", dbContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            dbContent.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            dbContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);