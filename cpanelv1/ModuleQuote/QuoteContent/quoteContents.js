app.controller("quoteContentCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var edititem = false;
    var quoteContent = this;
    //For Grid Options
    quoteContent.gridOptions = {};
    quoteContent.selectedItem = {};
    quoteContent.attachedFiles = [];
    

    quoteContent.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    quoteContent.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }

    quoteContent.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    quoteContent.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:quoteContent.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:quoteContent,
        useCurrentLocationZoom:12,
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) quoteContent.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    quoteContent.selectedItem.ToDate = date;
    quoteContent.datePickerConfig = {
        defaultDate: date
    };
    quoteContent.startDate = {
        defaultDate: date
    }
    quoteContent.endDate = {
        defaultDate: date
    }
    quoteContent.count = 0;

//#help/ سلکتور similar
    quoteContent.LinkDestinationIdSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkDestinationId",
      url: "QuoteContent",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: quoteContent,
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
          }
        ]
      }
    };
//#help/ سلکتور دسته بندی در ویرایش محتوا
quoteContent.LinkCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryId',
        url: 'quoteCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: quoteContent,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' }
            ]
        }
    }
    //Quote Grid Options
    quoteContent.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Content', displayName: 'محتوا', sortable: true, type: 'string', visible: 'true' },
            { name: "ActionKey", displayName: 'افزودن به منو', displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="quoteContent.addMenu()"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }
    //Comment Grid Options
    quoteContent.gridContentOptions = {
        columns: [
           { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
           { name: 'Writer', displayName: 'نویسنده', sortable: true, type: 'string' },
           { name: 'Comment', displayName: 'کامنت', sortable: true, type: 'string' },
           { name: 'ActionButtons', displayName: 'کلید عملیاتی', template: '<Button ng-if="!x.IsActivated" ng-click="quoteContent.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button>' + '<Button ng-if="x.IsActivated" ng-click="quoteContent.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button>' + '<Button ng-click="quoteContent.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>' },
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
                RowPerPage: 200,
                ContentFullSearch: null,
                Filters: [],
                Count: false
            }
        }
    }

    quoteContent.summernoteOptions = {
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

    //For Show Category Loading Indicator
    quoteContent.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show Quote Loading Indicator
    quoteContent.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    quoteContent.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    quoteContent.addMenu = function () {
        $modal.open({
            templateUrl: "cpanelv1/ModuleQuote/QuoteContent/modalMenu.html",
            scope: $scope
        });
    }

    quoteContent.treeConfig.currentNode = {};
    quoteContent.treeBusyIndicator = false;

    quoteContent.addRequested = false;

    quoteContent.showGridComment = false;

    //init Function
    quoteContent.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"quoteCategory/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            quoteContent.treeConfig.Items = response.ListItems;
            quoteContent.treeConfig.Items = response.ListItems;
            quoteContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"quoteContent/getall", quoteContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            quoteContent.ListItems = response.ListItems;
            quoteContent.gridOptions.fillData(quoteContent.ListItems, response.resultAccess); // Sending Access as an argument
            quoteContent.contentBusyIndicator.isActive = false;
            quoteContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            quoteContent.gridOptions.totalRowCount = response.TotalRowCount;
            quoteContent.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            quoteContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            quoteContent.contentBusyIndicator.isActive = false;
        });
    };

    quoteContent.gridContentOptions.onRowSelected = function () { }


    //open statistics
    quoteContent.Showstatistics = function () {
        if (!quoteContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'quoteContent/GetOne', quoteContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            quoteContent.selectedItem = response1.Item;
            $modal.open({
                templateUrl: "cpanelv1/ModuleQuote/quoteContent/statistics.html",
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Category Modal 
    quoteContent.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        quoteContent.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'QuoteCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            quoteContent.selectedItem = response.Item;
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
                quoteContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(quoteContent.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleQuote/QuoteCategory/add.html',
                        scope: $scope
                    });
                    quoteContent.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //-----
            //$modal.open({
            //    templateUrl: 'cpanelv1/ModuleQuote/QuoteCategory/add.html',
            //    scope: $scope
            //});

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Open Edit Category Modal
    quoteContent.editCategoryModel = function () {
        if (buttonIsPressed) { return };
        quoteContent.addRequested = false;
        quoteContent.modalTitle = 'ویرایش';
        if (!quoteContent.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        quoteContent.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'QuoteCategory/GetOne', quoteContent.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            quoteContent.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            quoteContent.selectedItem = response.Item;
            //Set dataForTheTree
            quoteContent.selectedNode = [];
            quoteContent.expandedNodes = [];
            quoteContent.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                quoteContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(quoteContent.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (quoteContent.selectedItem.LinkMainImageId > 0)
                        quoteContent.onSelection({ Id: quoteContent.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleQuote/QuoteCategory/edit.html',
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
            //    templateUrl: 'cpanelv1/ModuleQuote/QuoteCategory/edit.html',
            //    scope: $scope
            //});
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Category
    quoteContent.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        quoteContent.categoryBusyIndicator.isActive = true;
        quoteContent.addRequested = true;
        quoteContent.selectedItem.LinkParentId = null;
        if (quoteContent.treeConfig.currentNode != null)
            quoteContent.selectedItem.LinkParentId = quoteContent.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'QuoteCategory/add', quoteContent.selectedItem, 'POST').success(function (response) {
            quoteContent.addRequested = false;
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                quoteContent.gridOptions.advancedSearchData.engine.Filters = null;
                quoteContent.gridOptions.advancedSearchData.engine.Filters = [];
                quoteContent.gridOptions.reGetAll();
                quoteContent.closeModal();
            }
            quoteContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            quoteContent.addRequested = false;
            quoteContent.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    quoteContent.editCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        quoteContent.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'QuoteCategory/edit', quoteContent.selectedItem, 'PUT').success(function (response) {
            quoteContent.addRequested = true;
            //quoteContent.showbusy = false;
            quoteContent.treeConfig.showbusy = false;
            quoteContent.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                quoteContent.addRequested = false;
                quoteContent.treeConfig.currentNode.Title = response.Item.Title;
                quoteContent.closeModal();
            }
            quoteContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            quoteContent.addRequested = false;
            quoteContent.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    quoteContent.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = quoteContent.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                quoteContent.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'QuoteCategory/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    quoteContent.selectedItemForDelete = response.Item;
                    console.log(quoteContent.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'QuoteCategory/delete', quoteContent.selectedItemForDelete, 'POST').success(function (res) {
                        if (res.IsSuccess) {
                            //quoteContent.replaceCategoryItem(quoteContent.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            quoteContent.gridOptions.advancedSearchData.engine.Filters = null;
                            quoteContent.gridOptions.advancedSearchData.engine.Filters = [];
                            quoteContent.gridOptions.fillData();
                            quoteContent.categoryBusyIndicator.isActive = false;
                            quoteContent.gridOptions.reGetAll();
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        quoteContent.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    quoteContent.categoryBusyIndicator.isActive = false;

                });

            }
        });
    }

    //Tree On Node Select Options
    quoteContent.treeConfig.onNodeSelect = function () {
        var node = quoteContent.treeConfig.currentNode;
        quoteContent.showGridComment = false;
        quoteContent.selectContent(node);

    };
    //Show Content with Category Id
    quoteContent.selectContent = function (node) {
        quoteContent.gridOptions.advancedSearchData.engine.Filters = null;
        quoteContent.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            quoteContent.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            quoteContent.contentBusyIndicator.isActive = true;
            //quoteContent.gridOptions.advancedSearchData = {};
            
            quoteContent.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryId",
                IntValue1: node.Id,
                SearchType: 0
            }
            quoteContent.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"quoteContent/getall", quoteContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            quoteContent.contentBusyIndicator.isActive = false;
            quoteContent.ListItems = response.ListItems;
            quoteContent.gridOptions.fillData(quoteContent.ListItems, response.resultAccess); // Sending Access as an argument
            quoteContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            quoteContent.gridOptions.totalRowCount = response.TotalRowCount;
            quoteContent.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            quoteContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    quoteContent.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = quoteContent.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_A_Quote_Please_Select_The_Category'));
            return;
        }
        quoteContent.attachedFiles = [];
        quoteContent.attachedFile = "";
        quoteContent.filePickerMainImage.filename = "";
        quoteContent.filePickerMainImage.fileId = null;
        quoteContent.filePickerFiles.filename = "";
        quoteContent.filePickerFiles.fileId = null;
        quoteContent.addRequested = false;
        quoteContent.modalTitle = 'اضافه کردن محتوای جدید';
        addNewContentModel = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'quoteContent/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            addNewContentModel = false;
            console.log(response);
            rashaErManage.checkAction(response);
            quoteContent.selectedItem = response.Item;
            quoteContent.selectedItem.LinkCategoryId = node.Id;
            quoteContent.selectedItem.LinkFileIds = null;
            quoteContent.selectedItem.OtherInfos = [];
            quoteContent.selectedItem.Similars = [];
            quoteContent.clearPreviousData();

            $modal.open({
                templateUrl: 'cpanelv1/ModuleQuote/quoteContent/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    quoteContent.openEditModel = function () {
        if (buttonIsPressed) { return };
        quoteContent.attachedFiles = [];
        quoteContent.addRequested = false;
        quoteContent.modalTitle = 'ویرایش';
        if (!quoteContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'quoteContent/GetOne', quoteContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            quoteContent.selectedItem = response1.Item;
            quoteContent.startDate.defaultDate = quoteContent.selectedItem.FromDate;
            quoteContent.endDate.defaultDate = quoteContent.selectedItem.ToDate;
            quoteContent.filePickerMainImage.filename = null;
            quoteContent.filePickerMainImage.fileId = null;
            if (response1.Item.LinkMainImageId != null) {
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', response1.Item.LinkMainImageId, 'GET').success(function (response2) {
                    buttonIsPressed = false;
                    quoteContent.filePickerMainImage.filename = response2.Item.FileName;
                    quoteContent.filePickerMainImage.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            quoteContent.parseFileIds(response1.Item.LinkFileIds);
            quoteContent.filePickerFiles.filename = null;
            quoteContent.filePickerFiles.fileId = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleQuote/quoteContent/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    quoteContent.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        quoteContent.categoryBusyIndicator.isActive = true;
        quoteContent.addRequested = true;
        var apiSelectedItem = quoteContent.selectedItem;
        if (apiSelectedItem.Similars)
            $.each(apiSelectedItem.Similars, function (index, item) {
                item.Destination = [];
            });
        ajax.call(cmsServerConfig.configApiServerPath+'quoteContent/add', apiSelectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            quoteContent.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                quoteContent.ListItems.unshift(response.Item);
                quoteContent.gridOptions.fillData(quoteContent.ListItems);
                quoteContent.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            quoteContent.addRequested = false;
            quoteContent.categoryBusyIndicator.isActive = false;
        });
    }

    //Edit Content
    quoteContent.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        quoteContent.categoryBusyIndicator.isActive = true;
        quoteContent.addRequested = true;

        //Save attached file ids into quoteContent.selectedItem.LinkFileIds
        quoteContent.selectedItem.LinkFileIds = "";
        quoteContent.stringfyLinkFileIds();
        var apiSelectedItem = quoteContent.selectedItem;
        if (apiSelectedItem.Similars)
            $.each(apiSelectedItem.Similars, function (index, item) {
                item.Destination = [];
            });
        ajax.call(cmsServerConfig.configApiServerPath+'quoteContent/edit', apiSelectedItem, 'PUT').success(function (response) {
            quoteContent.categoryBusyIndicator.isActive = false;
            quoteContent.addRequested = false;
            quoteContent.treeConfig.showbusy = false;
            quoteContent.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                quoteContent.replaceItem(quoteContent.selectedItem.Id, response.Item);
                quoteContent.gridOptions.fillData(quoteContent.ListItems);
                quoteContent.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            quoteContent.addRequested = false;
            quoteContent.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a Quote Content 
    quoteContent.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!quoteContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        quoteContent.treeConfig.showbusy = true;
        quoteContent.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                quoteContent.categoryBusyIndicator.isActive = true;
                console.log(quoteContent.gridOptions.selectedRow.item);
                quoteContent.showbusy = true;
                quoteContent.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"quoteContent/GetOne", quoteContent.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    quoteContent.showbusy = false;
                    quoteContent.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    quoteContent.selectedItemForDelete = response.Item;
                    console.log(quoteContent.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"quoteContent/delete", quoteContent.selectedItemForDelete, 'POST').success(function (res) {
                        quoteContent.categoryBusyIndicator.isActive = false;
                        quoteContent.treeConfig.showbusy = false;
                        quoteContent.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            quoteContent.replaceItem(quoteContent.selectedItemForDelete.Id);
                            quoteContent.gridOptions.fillData(quoteContent.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        quoteContent.treeConfig.showbusy = false;
                        quoteContent.showIsBusy = false;
                        quoteContent.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    quoteContent.treeConfig.showbusy = false;
                    quoteContent.showIsBusy = false;
                    quoteContent.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }
 //#help similar & otherinfo
    quoteContent.clearPreviousData = function() {
      quoteContent.selectedItem.Similars = [];
      $("#to").empty();
    };
    

    quoteContent.moveSelected = function(from, to, calculatePrice) {
      if (from == "Content") {
        //var title = quoteContent.ItemListIdSelector.selectedItem.Title;
        // var optionSelectedPrice = quoteContent.ItemListIdSelector.selectedItem.Price;
        if (
          quoteContent.selectedItem.LinkDestinationId != undefined &&
          quoteContent.selectedItem.LinkDestinationId != null
        ) {
          if (quoteContent.selectedItem.Similars == undefined)
            quoteContent.selectedItem.Similars = [];
          for (var i = 0; i < quoteContent.selectedItem.Similars.length; i++) {
            if (
              quoteContent.selectedItem.Similars[i].LinkDestinationId ==
              quoteContent.selectedItem.LinkDestinationId
            ) {
              rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
              return;
            }
          }
          // if (quoteContent.selectedItem.Title == null || quoteContent.selectedItem.Title.length < 0)
          //     quoteContent.selectedItem.Title = title;
          quoteContent.selectedItem.Similars.push({
            //Id: 0,
            //Source: from,
            LinkDestinationId: quoteContent.selectedItem.LinkDestinationId,
            Destination: quoteContent.LinkDestinationIdSelector.selectedItem
          });
        }
      }
    };
     quoteContent.moveSelectedOtherInfo = function(from, to,y) {

            
             if (quoteContent.selectedItem.OtherInfos == undefined)
                quoteContent.selectedItem.OtherInfos = [];
              for (var i = 0; i < quoteContent.selectedItem.OtherInfos.length; i++) {
              
                if (quoteContent.selectedItem.OtherInfos[i].Title == quoteContent.selectedItemOtherInfos.Title && quoteContent.selectedItem.OtherInfos[i].HtmlBody ==quoteContent.selectedItemOtherInfos.HtmlBody && quoteContent.selectedItem.OtherInfos[i].Source ==quoteContent.selectedItemOtherInfos.Source) 
                {
                  rashaErManage.showMessage($filter('translatentk')('Information_Is_Duplicate'));
                  return;
                }
             
              }
             if (quoteContent.selectedItemOtherInfos.Title == "" && quoteContent.selectedItemOtherInfos.Source =="" && quoteContent.selectedItemOtherInfos.HtmlBody =="")
                {
                    rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
                }
             else
               {
            
             quoteContent.selectedItem.OtherInfos.push({
                Title:quoteContent.selectedItemOtherInfos.Title,
                HtmlBody:quoteContent.selectedItemOtherInfos.HtmlBody,
                Source:quoteContent.selectedItemOtherInfos.Source
              });
              quoteContent.selectedItemOtherInfos.Title="";
              quoteContent.selectedItemOtherInfos.Source="";
              quoteContent.selectedItemOtherInfos.HtmlBody="";
             }
             if(edititem)
               { 
                   edititem=false; 
               }
              
        };

    quoteContent.removeFromCollection = function(listsimilar,iddestination) {
      for (var i = 0; i < quoteContent.selectedItem.Similars.length; i++) 
       {       
            if(listsimilar[i].LinkDestinationId==iddestination)
            {
                quoteContent.selectedItem.Similars.splice(i, 1);
                return;
            }
          
      }
      
    };
   quoteContent.removeFromOtherInfo = function(listOtherInfo,title,body,source) {
    for (var i = 0; i < quoteContent.selectedItem.OtherInfos.length; i++) 
       {       
            if(listOtherInfo[i].Title==title && listOtherInfo[i].HtmlBody==body && listOtherInfo[i].Source==source)
            {
              quoteContent.selectedItem.OtherInfos.splice(i, 1);
              return;
            }
       }
    };
   quoteContent.editOtherInfo = function(y) {
      edititem=true;
      quoteContent.selectedItemOtherInfos.Title=y.Title;
      quoteContent.selectedItemOtherInfos.HtmlBody=y.HtmlBody;
      quoteContent.selectedItemOtherInfos.Source=y.Source;
      quoteContent.removeFromOtherInfo(quoteContent.selectedItem.OtherInfos,y.Title,y.HtmlBody,y.Source);
    };


    //#help
    //Confirm/UnConfirm Quote Content
    quoteContent.confirmUnConfirmquoteContent = function () {
        if (!quoteContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'quoteContent/GetOne', quoteContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            quoteContent.selectedItem = response.Item;
            quoteContent.selectedItem.IsAccepted = (response.Item.IsAccepted == true) ? false : true;
            ajax.call(cmsServerConfig.configApiServerPath+'quoteContent/edit', quoteContent.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = quoteContent.ListItems.indexOf(quoteContent.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        quoteContent.ListItems[index] = response2.Item;
                    }
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    //Add To Archive New Content
    quoteContent.enableArchive = function () {
        if (!quoteContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'quoteContent/GetOne', quoteContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            quoteContent.selectedItem = response.Item;
            quoteContent.selectedItem.IsArchive = (response.Item.IsArchive == true) ? false : true;
            ajax.call(cmsServerConfig.configApiServerPath+'quoteContent/edit', quoteContent.selectedItem, 'PUT').success(function (response2) {
                quoteContent.categoryBusyIndicator.isActive = true;
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = quoteContent.ListItems.indexOf(quoteContent.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        quoteContent.ListItems[index] = response2.Item;
                    }
                    quoteContent.categoryBusyIndicator.isActive = false;
                }

            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                quoteContent.categoryBusyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            quoteContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Replace Item OnDelete/OnEdit Grid Options
    quoteContent.replaceItem = function (oldId, newItem) {
        angular.forEach(quoteContent.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = quoteContent.ListItems.indexOf(item);
                quoteContent.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            quoteContent.ListItems.unshift(newItem);
    }

    quoteContent.summernoteText = '<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />';
    quoteContent.searchData = function () {
        quoteContent.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"quoteContent/getall", quoteContent.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            quoteContent.categoryBusyIndicator.isActive = false;
            quoteContent.ListItems = response.ListItems;
            quoteContent.gridOptions.fillData(quoteContent.ListItems);
            quoteContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            quoteContent.gridOptions.totalRowCount = response.TotalRowCount;
            quoteContent.gridOptions.rowPerPage = response.RowPerPage;
            quoteContent.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            quoteContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    quoteContent.addRequested = false;
    quoteContent.closeModal = function () {
        $modalStack.dismissAll();
    };

    quoteContent.showIsBusy = false;

    //For reInit Categories
    quoteContent.gridOptions.reGetAll = function () {
        if (quoteContent.gridOptions.advancedSearchData.engine.Filters.length > 0) quoteContent.searchData();
        else quoteContent.init();
    };



    quoteContent.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            quoteContent.focusExpireLockAccount = true;
        });
    };

    quoteContent.isCurrentNodeEmpty = function () {
        return !angular.equals({}, quoteContent.treeConfig.currentNode);
    }

    quoteContent.loadFileAndFolder = function (item) {
        quoteContent.treeConfig.currentNode = item;
        console.log(item);
        quoteContent.treeConfig.onNodeSelect(item);
    }
    quoteContent.addRequested = true;

    quoteContent.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            quoteContent.focus = true;
        });
    };
    quoteContent.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            quoteContent.focus1 = true;
        });
    };

    quoteContent.columnCheckbox = false;
    quoteContent.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = quoteContent.gridOptions.columns;
        if (quoteContent.gridOptions.columnCheckbox) {
            for (var i = 0; i < quoteContent.gridOptions.columns.length; i++) {
                //quoteContent.gridOptions.columns[i].visible = $("#" + quoteContent.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + quoteContent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                quoteContent.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < quoteContent.gridOptions.columns.length; i++) {
                var element = $("#" + quoteContent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + quoteContent.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < quoteContent.gridOptions.columns.length; i++) {
            console.log(quoteContent.gridOptions.columns[i].name.concat(".visible: "), quoteContent.gridOptions.columns[i].visible);
        }
        quoteContent.gridOptions.columnCheckbox = !quoteContent.gridOptions.columnCheckbox;
    }

    quoteContent.deleteAttachedFile = function (index) {
        quoteContent.attachedFiles.splice(index, 1);
    }

    quoteContent.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !quoteContent.alreadyExist(id, quoteContent.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = { id: fId, name: fname };
            quoteContent.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    quoteContent.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    quoteContent.filePickerMainImage.removeSelectedfile = function (config) {
        quoteContent.filePickerMainImage.fileId = null;
        quoteContent.filePickerMainImage.filename = null;
        quoteContent.selectedItem.LinkMainImageId = null;

    }

    quoteContent.filePickerFiles.removeSelectedfile = function (config) {
        quoteContent.filePickerFiles.fileId = null;
        quoteContent.filePickerFiles.filename = null;
    }




    quoteContent.showUpload = function () { $("#fastUpload").fadeToggle(); }

    // ----------- FilePicker Codes --------------------------------
    quoteContent.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !quoteContent.alreadyExist(id, quoteContent.attachedFiles)) {
            var fId = id;
            var file = { fileId: fId, filename: fname };
            quoteContent.attachedFiles.push(file);
            quoteContent.clearfilePickers();
        }
    }

    quoteContent.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                quoteContent.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    quoteContent.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            quoteContent.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    quoteContent.clearfilePickers = function () {
        quoteContent.filePickerFiles.fileId = null;
        quoteContent.filePickerFiles.filename = null;
    }

    quoteContent.stringfyLinkFileIds = function () {
        $.each(quoteContent.attachedFiles, function (i, item) {
            if (quoteContent.selectedItem.LinkFileIds == "")
                quoteContent.selectedItem.LinkFileIds = item.fileId;
            else
                quoteContent.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    quoteContent.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleQuote/QuoteContent/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        quoteContent.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            quoteContent.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    quoteContent.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    quoteContent.whatcolor = function (progress) {
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

    quoteContent.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    quoteContent.replaceFile = function (name) {
        quoteContent.itemClicked(null, quoteContent.fileIdToDelete, "file");
        quoteContent.fileTypes = 1;
        quoteContent.fileIdToDelete = quoteContent.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", quoteContent.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    quoteContent.remove(quoteContent.FileList, quoteContent.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                quoteContent.FileItem = response3.Item;
                                quoteContent.FileItem.FileName = name;
                                quoteContent.FileItem.Extension = name.split('.').pop();
                                quoteContent.FileItem.FileSrc = name;
                                quoteContent.FileItem.LinkCategoryId = quoteContent.thisCategory;
                                quoteContent.saveNewFile();
                            }
                            else {
                                console.log("getting the model was not successfully returned!");
                            }
                        }).error(function (data) {
                            console.log(data);
                        });
                    }
                    else {
                        console.log("Request to api/CmsFileContent/delete was not successfully returned!");
                    }
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }
        }).error(function (data) {
            console.log(data);
        });
    }
    //save new file
    quoteContent.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", quoteContent.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                quoteContent.FileItem = response.Item;
                quoteContent.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            quoteContent.showErrorIcon();
            return -1;
        });
    }

    quoteContent.showSuccessIcon = function () {
        $().toggle
    }

    quoteContent.showErrorIcon = function () {

    }
    //file is exist
    quoteContent.fileIsExist = function (fileName) {
        for (var i = 0; i < quoteContent.FileList.length; i++) {
            if (quoteContent.FileList[i].FileName == fileName) {
                quoteContent.fileIdToDelete = quoteContent.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    quoteContent.getFileItem = function (id) {
        for (var i = 0; i < quoteContent.FileList.length; i++) {
            if (quoteContent.FileList[i].Id == id) {
                return quoteContent.FileList[i];
            }
        }
    }

    //select file or folder
    quoteContent.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            quoteContent.fileTypes = 1;
            quoteContent.selectedFileId = quoteContent.getFileItem(index).Id;
            quoteContent.selectedFileName = quoteContent.getFileItem(index).FileName;
        }
        else {
            quoteContent.fileTypes = 2;
            quoteContent.selectedCategoryId = quoteContent.getCategoryName(index).Id;
            quoteContent.selectedCategoryTitle = quoteContent.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        quoteContent.selectedIndex = index;

    };

    quoteContent.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    //upload file
    quoteContent.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (quoteContent.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ quoteContent.replaceFile(uploadFile.name);
                    quoteContent.itemClicked(null, quoteContent.fileIdToDelete, "file");
                    quoteContent.fileTypes = 1;
                    quoteContent.fileIdToDelete = quoteContent.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                quoteContent.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        quoteContent.FileItem = response2.Item;
                        quoteContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        quoteContent.filePickerMainImage.filename =
                          quoteContent.FileItem.FileName;
                        quoteContent.filePickerMainImage.fileId =
                          response2.Item.Id;
                        quoteContent.selectedItem.LinkMainImageId =
                          quoteContent.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      quoteContent.showErrorIcon();
                      $("#save-icon" + index).removeClass("fa-save");
                      $("#save-button" + index).removeClass("flashing-button");
                      $("#save-icon" + index).addClass("fa-remove");
                    });
                  //-----------------------------------
                }
              })
              .error(function(data) {
                console.log(data);
              });
            //--------------------------------
                } else {
                    return;
                }
            }
            else { // File does not exists
                // Save New file
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response) {
                    quoteContent.FileItem = response.Item;
                    quoteContent.FileItem.FileName = uploadFile.name;
                    quoteContent.FileItem.uploadName = uploadFile.uploadName;
                    quoteContent.FileItem.Extension = uploadFile.name.split('.').pop();
                    quoteContent.FileItem.FileSrc = uploadFile.name;
                    quoteContent.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- quoteContent.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", quoteContent.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            quoteContent.FileItem = response.Item;
                            quoteContent.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            quoteContent.filePickerMainImage.filename = quoteContent.FileItem.FileName;
                            quoteContent.filePickerMainImage.fileId = response.Item.Id;
                            quoteContent.selectedItem.LinkMainImageId = quoteContent.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        quoteContent.showErrorIcon();
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
    quoteContent.exportFile = function () {
        quoteContent.addRequested = true;
        quoteContent.gridOptions.advancedSearchData.engine.ExportFile = quoteContent.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'QuoteContent/exportfile', quoteContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            quoteContent.addRequested = false;
            rashaErManage.checkAction(response);
            quoteContent.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //quoteContent.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    quoteContent.toggleExportForm = function () {
        quoteContent.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        quoteContent.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        quoteContent.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        quoteContent.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleQuote/QuoteContent/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    quoteContent.rowCountChanged = function () {
        if (!angular.isDefined(quoteContent.ExportFileClass.RowCount) || quoteContent.ExportFileClass.RowCount > 5000)
            quoteContent.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    quoteContent.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"quoteContent/count", quoteContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            quoteContent.addRequested = false;
            rashaErManage.checkAction(response);
            quoteContent.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            quoteContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    //TreeControl
    quoteContent.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (quoteContent.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    quoteContent.onNodeToggle = function (node, expanded) {
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

    quoteContent.onSelection = function (node, selected) {
        if (!selected) {
            quoteContent.selectedItem.LinkMainImageId = null;
            quoteContent.selectedItem.previewImageSrc = null;
            return;
        }
        quoteContent.selectedItem.LinkMainImageId = node.Id;
        quoteContent.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            quoteContent.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);