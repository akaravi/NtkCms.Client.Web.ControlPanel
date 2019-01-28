app.controller("blogContentCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$stateParams', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $stateParams, $filter) {
    var blogContent = this;
    var edititem = false;
    //For Grid Options
    blogContent.gridOptions = {};
    blogContent.selectedItem = {};
    blogContent.attachedFiles = [];
    blogContent.attachedFile = "";
    blogContent.selectedContentId = { Id: $stateParams.ContentId, TitleTag: $stateParams.TitleTag };
    blogContent.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    blogContent.filePickerFilePodcast = {
        isActive: true,
        backElement: 'filePickerFilePodcast',
        filename: null,
        fileId: null,
        extension: 'mp3',
        multiSelect: false,
    }
    blogContent.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    blogContent.locationChanged = function (lat, lang) {
        console.log("ok " + lat + " " + lang);
    }

    blogContent.GeolocationConfig = {
        locationMember: 'Geolocation',
        locationMemberString: 'GeolocationString',
        onlocationChanged: blogContent.locationChanged,
        useCurrentLocation: true,
        center: { lat: 33.437039, lng: 53.073182 },
        zoom: 4,
        scope: blogContent,
        useCurrentLocationZoom: 12,
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) blogContent.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    blogContent.selectedItem.ToDate = date;
    blogContent.datePickerConfig = {
        defaultDate: date
    };
    blogContent.startDate = {
        defaultDate: date
    }
    blogContent.endDate = {
        defaultDate: date
    }
    blogContent.count = 0;

    //#help/ سلکتور similar
    blogContent.LinkDestinationIdSelector = {
        displayMember: "Title",
        id: "Id",
        fId: "LinkDestinationId",
        url: "BlogContent",
        sortColumn: "Id",
        sortType: 1,
        filterText: "Title",
        showAddDialog: false,
        rowPerPage: 200,
        scope: blogContent,
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
    blogContent.LinkCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryId',
        url: 'blogCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: blogContent,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' }
            ]
        }
    }
    //Blog Grid Options
    blogContent.gridOptions = {
        columns: [
            { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Description', displayName: 'عنوان توضیحات', sortable: true, type: 'string', visible: 'true' },
            { name: 'FromDate', displayName: 'تاریخ آغاز', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'ToDate', displayName: 'تاریخ پایان', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'ViewCount', displayName: 'تعداد بازدید', sortable: true, visible: true },
            { name: "ActionKey", displayName: 'افزودن به منو', displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="blogContent.addMenu()"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }
    //Comment Grid Options
    blogContent.gridContentOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Writer', displayName: 'نویسنده', sortable: true, type: 'string' },
            { name: 'Comment', displayName: 'کامنت', sortable: true, type: 'string' },
            { name: 'ActionButtons', displayName: 'کلید عملیاتی', template: '<Button ng-if="!x.IsActivated" ng-click="blogContent.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button>' + '<Button ng-if="x.IsActivated" ng-click="blogContent.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button>' + '<Button ng-click="blogContent.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>' },
        ],
        data: {},
        multiSelect: false,
        showUserSearchPanel: false,
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "Id",
                SortType: 1,
                NeedToRunFakePagination: false,
                TotalRowData: 2000,
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: [],
                Count: false
            }
        }
    }
    blogContent.gridOptions.advancedSearchData.engine.Filters = null;
    blogContent.gridOptions.advancedSearchData.engine.Filters = [];

    blogContent.summernoteOptions = {
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
    }
    //#tagsInput -----
    //blogContent.onTagAdded = function (tag) {
    //    if (!angular.isDefined(tag.id)) {    //Check if this a new or a existing tag (existing tags comprise with an id)
    //        var tagObject = jQuery.extend({}, blogContent.ModuleTag);   //#Clone a Javascript Object
    //        tagObject.Title = tag.text;
    //        ajax.call('/api/blogTag/add', tagObject, 'POST').success(function (response) {
    //            rashaErManage.checkAction(response);
    //            if (response.IsSuccess) {
    //                blogContent.tags[blogContent.tags.length - 1] = { id: response.Item.Id, text: response.Item.Title };  //Replace the newly added tag (last in the array) with a new object including its Id
    //            }
    //        }).error(function (data, errCode, c, d) {
    //            rashaErManage.checkAction(data, errCode);
    //        });
    //    }
    //}
    blogContent.onTagRemoved = function (tag) { }
    //For Show Category Loading Indicator
    blogContent.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show Blog Loading Indicator
    blogContent.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    blogContent.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    }

    //open addMenu modal
    blogContent.addMenu = function () {
        $modal.open({
            templateUrl: "cpanelv1/ModuleBlog/BlogContent/modalMenu.html",
            scope: $scope
        });
    }

    blogContent.treeConfig.currentNode = {};
    blogContent.treeBusyIndicator = false;

    blogContent.addRequested = false;

    blogContent.showGridComment = false;
    blogContent.blogTitle = "";

    //init Function
    blogContent.init = function () {
        ajax.call(mainPathApi+"BlogCategory/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            blogContent.treeConfig.Items = response.ListItems;
            blogContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        filterModel = { PropertyName: "ContentTags", PropertyAnyName: "LinkTagId", SearchType: 0, IntValue1: blogContent.selectedContentId.Id };
        if (blogContent.selectedContentId.Id > 0)
            blogContent.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
        ajax.call(mainPathApi+"blogContent/getall", blogContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            blogContent.ListItems = response.ListItems;
            blogContent.gridOptions.fillData(blogContent.ListItems, response.resultAccess); // Sending Access as an argument
            blogContent.contentBusyIndicator.isActive = false;
            blogContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            blogContent.gridOptions.totalRowCount = response.TotalRowCount;
            blogContent.gridOptions.rowPerPage = response.RowPerPage; blogContent.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            blogContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            blogContent.contentBusyIndicator.isActive = false;
        });
        ajax.call(mainPathApi+"blogTag/getviewmodel", "0", 'GET').success(function (response) {    //Get a ViewModel for BiographyTag
            blogContent.ModuleTag = response.Item;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(mainPathApi+"blogContentTag/getviewmodel", "0", 'GET').success(function (response) { //Get a ViewModel for blogContentTag
            blogContent.ModuleContentTag = response.Item;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    };

    // For Show Comments
    blogContent.showComment = function () {

        if (blogContent.gridOptions.selectedRow.item) {
            //var id = blogContent.gridOptions.selectedRow.item.Id;

            var Filter_value = {
                PropertyName: "LinkContentId",
                IntValue1: blogContent.gridOptions.selectedRow.item.Id,
                SearchType: 0
            }
            blogContent.gridContentOptions.advancedSearchData.engine.Filters = null;
            blogContent.gridContentOptions.advancedSearchData.engine.Filters = [];
            blogContent.gridContentOptions.advancedSearchData.engine.Filters.push(Filter_value);


            ajax.call(mainPathApi+'blogComment/getall', blogContent.gridContentOptions.advancedSearchData.engine, 'POST').success(function (response) {
                blogContent.listComments = response.ListItems;
                //blogContent.gridOptions.resultAccess = response.resultAccess; // دسترسی ها نمایش
                blogContent.gridContentOptions.fillData(blogContent.listComments, response.resultAccess);
                blogContent.gridContentOptions.currentPageNumber = response.CurrentPageNumber;
                blogContent.gridContentOptions.totalRowCount = response.TotalRowCount;
                blogContent.allowedSearch = response.AllowedSearchField;
                rashaErManage.checkAction(response);
                blogContent.gridContentOptions.rowPerPage = response.RowPerPage;
                blogContent.gridOptions.maxSize = 5;
                blogContent.showGridComment = true;
                blogContent.Title = blogContent.gridOptions.selectedRow.item.Title;
            });
        }
    }

    blogContent.gridOptions.onRowSelected = function () {
        var item = blogContent.gridOptions.selectedRow.item;
        blogContent.showComment(item);
    }

    blogContent.gridContentOptions.onRowSelected = function () { }

    // Open Add Category Modal 
    blogContent.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        blogContent.addRequested = false;
        buttonIsPressed = true;
        ajax.call(mainPathApi+'BlogCategory/getviewmodel', "0", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            blogContent.selectedItem = response.Item;
            //Set dataForTheTree
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(mainPathApi+"CmsFileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                blogContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(blogContent.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleBlog/BlogCategory/add.html',
                        scope: $scope
                    });
                    blogContent.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //-----
            //$modal.open({
            //    templateUrl: 'cpanelv1/ModuleBlog/BlogCategory/add.html',
            //    scope: $scope
            //});

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Open Edit Category Modal
    blogContent.editCategoryModel = function () {
        if (buttonIsPressed) { return };
        blogContent.addRequested = false;
        blogContent.modalTitle = 'ویرایش';
        if (!blogContent.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Category_To_Edit'));
            return;
        }

        blogContent.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(mainPathApi+'BlogCategory/getviewmodel', blogContent.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            blogContent.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            blogContent.selectedItem = response.Item;
            //Set dataForTheTree
            blogContent.selectedNode = [];
            blogContent.expandedNodes = [];
            blogContent.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(mainPathApi+"CmsFileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                blogContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(blogContent.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (blogContent.selectedItem.LinkMainImageId > 0)
                        blogContent.onSelection({ Id: blogContent.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleBlog/blogCategory/edit.html',
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
            //    templateUrl: 'cpanelv1/ModuleBlog/blogCategory/edit.html',
            //    scope: $scope
            //});
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Category
    blogContent.addNewCategory = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        blogContent.categoryBusyIndicator.isActive = true;
        blogContent.addRequested = true;
        blogContent.selectedItem.LinkParentId = null;
        if (blogContent.treeConfig.currentNode != null)
            blogContent.selectedItem.LinkParentId = blogContent.treeConfig.currentNode.Id;
        ajax.call(mainPathApi+'BlogCategory/add', blogContent.selectedItem, 'POST').success(function (response) {
            blogContent.addRequested = false;
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                blogContent.gridOptions.advancedSearchData.engine.Filters = null;
                blogContent.gridOptions.advancedSearchData.engine.Filters = [];
                blogContent.gridOptions.reGetAll();
                blogContent.closeModal();
            }
            blogContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogContent.addRequested = false;
            blogContent.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    blogContent.editCategory = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        blogContent.categoryBusyIndicator.isActive = true;
        ajax.call(mainPathApi+'BlogCategory/edit', blogContent.selectedItem, 'PUT').success(function (response) {
            blogContent.addRequested = true;
            //blogContent.showbusy = false;
            blogContent.treeConfig.showbusy = false;
            blogContent.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                blogContent.addRequested = false;
                blogContent.treeConfig.currentNode.Title = response.Item.Title;
                blogContent.closeModal();
            }
            blogContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogContent.addRequested = false;
            blogContent.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    blogContent.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = blogContent.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Category_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                blogContent.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(mainPathApi+'BlogCategory/getviewmodel', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    blogContent.selectedItemForDelete = response.Item;
                    console.log(blogContent.selectedItemForDelete);
                    ajax.call(mainPathApi+'BlogCategory/delete', blogContent.selectedItemForDelete, 'DELETE').success(function (res) {
                        blogContent.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //blogContent.replaceCategoryItem(blogContent.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            blogContent.gridOptions.advancedSearchData.engine.Filters = null;
                            blogContent.gridOptions.advancedSearchData.engine.Filters = [];
                            blogContent.gridOptions.fillData();
                            blogContent.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translate')('Unable_To_Delete_The_Category_Contains_Content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        blogContent.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    blogContent.categoryBusyIndicator.isActive = false;

                });

            }
        });
    }

    //Tree On Node Select Options
    blogContent.treeConfig.onNodeSelect = function () {
        var node = blogContent.treeConfig.currentNode;
        blogContent.showGridComment = false;
        blogContent.selectContent(node);
    }
    //Show Content with Category Id
    blogContent.selectContent = function (node) {
        blogContent.gridOptions.advancedSearchData.engine.Filters = null;
        blogContent.gridOptions.advancedSearchData.engine.Filters = [];
        if (node != null && node != undefined) {
            blogContent.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            blogContent.contentBusyIndicator.isActive = true;
            //blogContent.gridOptions.advancedSearchData = {};


            blogContent.attachedFiles = null;
            blogContent.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryId",
                IntValue1: node.Id,
                SearchType: 0
            }
            blogContent.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(mainPathApi+"blogContent/getall", blogContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            blogContent.contentBusyIndicator.isActive = false;
            blogContent.ListItems = response.ListItems;
            blogContent.gridOptions.fillData(blogContent.ListItems, response.resultAccess); // Sending Access as an argument
            blogContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            blogContent.gridOptions.totalRowCount = response.TotalRowCount;
            blogContent.gridOptions.rowPerPage = response.RowPerPage;
            blogContent.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            blogContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    //open statistics
    blogContent.Showstatistics = function () {
        if (!blogContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        ajax.call(mainPathApi+'blogContent/getviewmodel', blogContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            blogContent.selectedItem = response1.Item;
            $modal.open({
                templateUrl: "cpanelv1/ModuleBlog/blogContent/statistics.html",
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add New Content Model
    blogContent.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = blogContent.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translate')('To_Add_A_Blog_Please_Select_The_Category'));
            return;
        }
        blogContent.selectedItemOtherInfos = {};
        blogContent.attachedFiles = [];
        blogContent.attachedFile = "";
        blogContent.filePickerMainImage.filename = "";
        blogContent.filePickerMainImage.fileId = null;
        blogContent.filePickerFilePodcast.filename = "";
        blogContent.filePickerFilePodcast.fileId = null;
        blogContent.filePickerFiles.filename = "";
        blogContent.filePickerFiles.fileId = null;
        blogContent.tags = [];   //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
        blogContent.kwords = [];   //tagsInput خالی کردن آرایه کلمات کلیدی برای محتوای جدید
        blogContent.addRequested = false;
        blogContent.modalTitle = 'اضافه کردن محتوای جدید';
        addNewContentModel = true;
        buttonIsPressed = true;
        ajax.call(mainPathApi+'blogContent/getviewmodel', "0", 'GET').success(function (response) {
            buttonIsPressed = false;
            addNewContentModel = false;
            console.log(response);
            rashaErManage.checkAction(response);
            blogContent.selectedItem = response.Item;
            blogContent.selectedItem.OtherInfos = [];
            blogContent.selectedItem.Similars = [];
            blogContent.selectedItem.LinkCategoryId = node.Id;
            blogContent.selectedItem.LinkFileIds = null;
            blogContent.clearPreviousData();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleBlog/blogContent/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    blogContent.openEditModel = function () {
        if (buttonIsPressed) { return };
        blogContent.addRequested = false;
        blogContent.modalTitle = 'ویرایش';
        if (!blogContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        blogContent.selectedItemOtherInfos = {};
        buttonIsPressed = true;
        ajax.call(mainPathApi+'blogContent/getviewmodel', blogContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            blogContent.selectedItem = response1.Item;
            blogContent.startDate.defaultDate = blogContent.selectedItem.FromDate;
            blogContent.endDate.defaultDate = blogContent.selectedItem.ToDate;
            blogContent.filePickerMainImage.filename = null;
            blogContent.filePickerMainImage.fileId = null;
            blogContent.filePickerFilePodcast.filename = null;
            blogContent.filePickerFilePodcast.fileId = null;
            if (response1.Item.LinkMainImageId != null) {
                buttonIsPressed = true;
                ajax.call(mainPathApi+'CmsFileContent/getviewmodel', response1.Item.LinkMainImageId, 'GET').success(function (response2) {
                    buttonIsPressed = false;
                    blogContent.filePickerMainImage.filename = response2.Item.FileName;
                    blogContent.filePickerMainImage.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            if (response1.Item.LinkFilePodcastId != null) {
                ajax.call(mainPathApi+'CmsFileContent/getviewmodel', response1.Item.LinkFilePodcastId, 'GET').success(function (response2) {
                    blogContent.filePickerFilePodcast.filename = response2.Item.FileName;
                    blogContent.filePickerFilePodcast.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            blogContent.parseFileIds(response1.Item.LinkFileIds);
            blogContent.filePickerFiles.filename = null;
            blogContent.filePickerFiles.fileId = null;
            //Load tagsInput
            blogContent.tags = [];  //Clear out previous tags
            if (blogContent.selectedItem.ContentTags == null)
                blogContent.selectedItem.ContentTags = [];
            $.each(blogContent.selectedItem.ContentTags, function (index, item) {
                if (item.ModuleTag != null)
                    blogContent.tags.push({ id: item.ModuleTag.Id, text: item.ModuleTag.Title });  //Add current content's tag to tags array with id and title
            });
            //Load Keywords tagsInput
            blogContent.kwords = [];  //Clear out previous tags
            var arraykwords = [];
            if (blogContent.selectedItem.Keyword != null && blogContent.selectedItem.Keyword != "")
                arraykwords = blogContent.selectedItem.Keyword.split(',');
            $.each(arraykwords, function (index, item) {
                if (item != null)
                    blogContent.kwords.push({ text: item });  //Add current content's tag to tags array with id and title
            });
            $modal.open({
                templateUrl: 'cpanelv1/ModuleBlog/blogContent/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    blogContent.addNewContent = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        blogContent.categoryBusyIndicator.isActive = true;
        blogContent.addRequested = true;
        //Save attached file ids into blogContent.selectedItem.LinkFileIds
        blogContent.selectedItem.LinkFileIds = "";
        blogContent.stringfyLinkFileIds();
        //Save Keywords
        $.each(blogContent.kwords, function (index, item) {
            if (index == 0)
                blogContent.selectedItem.Keyword = item.text;
            else
                blogContent.selectedItem.Keyword += ',' + item.text;
        });
        if (blogContent.selectedItem.LinkCategoryId == null || blogContent.selectedItem.LinkCategoryId == 0) {
            rashaErManage.showMessage($filter('translate')('To_Add_A_Blog_Please_Select_The_Category'));
            return;
        }
        var apiSelectedItem = blogContent.selectedItem;
        if (apiSelectedItem.Similars)
            $.each(apiSelectedItem.Similars, function (index, item) {
                item.Destination = [];
            });
        ajax.call(mainPathApi+'blogContent/add', apiSelectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            blogContent.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                blogContent.ListItems.unshift(response.Item);
                blogContent.gridOptions.fillData(blogContent.ListItems);
                blogContent.closeModal();
                //Save inputTags
                blogContent.selectedItem.ContentTags = [];
                $.each(blogContent.tags, function (index, item) {
                    if (item.id > 0) {
                        var newObject = $.extend({}, blogContent.ModuleContentTag);
                        newObject.LinkTagId = item.id;
                        newObject.LinkContentId = response.Item.Id;
                        blogContent.selectedItem.ContentTags.push(newObject);
                    }
                });
                ajax.call(mainPathApi+'blogContentTag/addbatch', blogContent.selectedItem.ContentTags, 'POST').success(function (response) {
                    console.log(response);
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogContent.addRequested = false;
            blogContent.categoryBusyIndicator.isActive = false;
        });
    }

    //Edit Content
    blogContent.editContent = function (frm) {
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        blogContent.categoryBusyIndicator.isActive = true;
        blogContent.addRequested = true;

        //Save attached file ids into blogContent.selectedItem.LinkFileIds
        blogContent.selectedItem.LinkFileIds = "";
        blogContent.stringfyLinkFileIds();
        //Save inputTags
        blogContent.selectedItem.ContentTags = [];
        $.each(blogContent.tags, function (index, item) {
            if (item.id > 0) {
                var newObject = $.extend({}, blogContent.ModuleContentTag);
                newObject.LinkTagId = item.id;
                newObject.LinkContentId = blogContent.selectedItem.Id;
                blogContent.selectedItem.ContentTags.push(newObject);
            }
        });
        //Save Keywords
        $.each(blogContent.kwords, function (index, item) {
            if (index == 0)
                blogContent.selectedItem.Keyword = item.text;
            else
                blogContent.selectedItem.Keyword += ',' + item.text;
        });
        if (blogContent.selectedItem.LinkCategoryId == null || blogContent.selectedItem.LinkCategoryId == 0) {
            rashaErManage.showMessage($filter('translate')('To_Add_A_Blog_Please_Select_The_Category'));
            return;
        }
        if (blogContent.selectedItem.LinkCategoryId == null || blogContent.selectedItem.LinkCategoryId == 0) {
            rashaErManage.showMessage($filter('translate')('To_Add_A_Blog_Please_Select_The_Category'));
            return;
        }
        var apiSelectedItem = blogContent.selectedItem;
        if (apiSelectedItem.Similars)
            $.each(apiSelectedItem.Similars, function (index, item) {
                item.Destination = [];
            });
        ajax.call(mainPathApi+'blogContent/edit', blogContent.selectedItem, 'PUT').success(function (response) {
            blogContent.categoryBusyIndicator.isActive = false;
            blogContent.addRequested = false;
            blogContent.treeConfig.showbusy = false;
            blogContent.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                blogContent.replaceItem(blogContent.selectedItem.Id, response.Item);
                blogContent.gridOptions.fillData(blogContent.ListItems);
                blogContent.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogContent.addRequested = false;
            blogContent.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a Blog Content 
    blogContent.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!blogContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        blogContent.treeConfig.showbusy = true;
        blogContent.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                blogContent.categoryBusyIndicator.isActive = true;
                console.log(blogContent.gridOptions.selectedRow.item);
                blogContent.showbusy = true;
                blogContent.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(mainPathApi+"blogContent/getviewmodel", blogContent.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    blogContent.showbusy = false;
                    blogContent.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    blogContent.selectedItemForDelete = response.Item;
                    console.log(blogContent.selectedItemForDelete);
                    ajax.call(mainPathApi+"blogContent/delete", blogContent.selectedItemForDelete, "DELETE").success(function (res) {
                        blogContent.categoryBusyIndicator.isActive = false;
                        blogContent.treeConfig.showbusy = false;
                        blogContent.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            blogContent.replaceItem(blogContent.selectedItemForDelete.Id);
                            blogContent.gridOptions.fillData(blogContent.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        blogContent.treeConfig.showbusy = false;
                        blogContent.showIsBusy = false;
                        blogContent.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    blogContent.treeConfig.showbusy = false;
                    blogContent.showIsBusy = false;
                    blogContent.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }
    //#help similar & otherinfo
    blogContent.clearPreviousData = function () {
        blogContent.selectedItem.Similars = [];
        $("#to").empty();
    };


    blogContent.moveSelected = function (from, to, calculatePrice) {
        if (from == "Content") {
            //var title = blogContent.ItemListIdSelector.selectedItem.Title;
            // var optionSelectedPrice = blogContent.ItemListIdSelector.selectedItem.Price;
            if (
                blogContent.selectedItem.LinkDestinationId != undefined &&
                blogContent.selectedItem.LinkDestinationId != null
            ) {
                if (blogContent.selectedItem.Similars == undefined)
                    blogContent.selectedItem.Similars = [];
                for (var i = 0; i < blogContent.selectedItem.Similars.length; i++) {
                    if (
                        blogContent.selectedItem.Similars[i].LinkDestinationId ==
                        blogContent.selectedItem.LinkDestinationId
                    ) {
                        rashaErManage.showMessage($filter('translate')('Content_Is_Duplicate'));
                        return;
                    }
                }
                // if (blogContent.selectedItem.Title == null || blogContent.selectedItem.Title.length < 0)
                //     blogContent.selectedItem.Title = title;
                blogContent.selectedItem.Similars.push({
                    //Id: 0,
                    //Source: from,
                    LinkDestinationId: blogContent.selectedItem.LinkDestinationId,
                    Destination: blogContent.LinkDestinationIdSelector.selectedItem
                });
            }
        }
    };
    blogContent.moveSelectedOtherInfo = function (from, to, y) {


        if (blogContent.selectedItem.OtherInfos == undefined)
            blogContent.selectedItem.OtherInfos = [];
        for (var i = 0; i < blogContent.selectedItem.OtherInfos.length; i++) {

            if (blogContent.selectedItem.OtherInfos[i].Title == blogContent.selectedItemOtherInfos.Title && blogContent.selectedItem.OtherInfos[i].HtmlBody == blogContent.selectedItemOtherInfos.HtmlBody && blogContent.selectedItem.OtherInfos[i].Source == blogContent.selectedItemOtherInfos.Source) {
                rashaErManage.showMessage($filter('translate')('Information_Is_Duplicate'));
                return;
            }

        }
        if (blogContent.selectedItemOtherInfos.Title == "" && blogContent.selectedItemOtherInfos.Source == "" && blogContent.selectedItemOtherInfos.HtmlBody == "") {
            rashaErManage.showMessage($filter('translate')('Fields_Values_Are_Empty_Please_Enter_Values'));
        }
        else {

            blogContent.selectedItem.OtherInfos.push({
                Title: blogContent.selectedItemOtherInfos.Title,
                HtmlBody: blogContent.selectedItemOtherInfos.HtmlBody,
                Source: blogContent.selectedItemOtherInfos.Source
            });
            blogContent.selectedItemOtherInfos.Title = "";
            blogContent.selectedItemOtherInfos.Source = "";
            blogContent.selectedItemOtherInfos.HtmlBody = "";
        }
        if (edititem) {
            edititem = false;
        }

    };

    //#help otherInfo
    blogContent.selectedItemOtherInfos = {};
    blogContent.todoModeTitle = $filter('translate')('ADD_NOW');
    blogContent.saveTodo = function (mainLIst) {
        if (!mainLIst)
            mainLIst = [];
        if (blogContent.editMode) {
            $scope.currentItem = blogContent.selectedItemOtherInfos;
            mainLIst[$scope.currentItemIndex] = blogContent.selectedItemOtherInfos;
            blogContent.editMode = false;

            //#help edit
            if (blogContent.selectedItemOtherInfos.Id && blogContent.selectedItemOtherInfos.Id > 0)
                ajax.call(mainPathApi+'blogContentOtherInfo/edit', blogContent.selectedItemOtherInfos, 'PUT').success(function (response) {
                    rashaErManage.checkAction(response);
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            //#help edit
        } else if (blogContent.removeMode) {
            $scope.currentItem = blogContent.selectedItemOtherInfos;
            mainLIst.splice($scope.currentItemIndex, 1);
            blogContent.removeMode = false;
        } else {
            mainLIst.push(blogContent.selectedItemOtherInfos);
        }
        blogContent.selectedItemOtherInfos = "";
        blogContent.todoModeTitle = $filter('translate')('ADD_NOW');
    };
    blogContent.editTodo = function (mainLIst, todo) {
        if (!mainLIst)
            mainLIst = [];
        blogContent.todoModeTitle = $filter('translate')('EDIT_NOW');
        blogContent.editMode = true;
        blogContent.selectedItemOtherInfos = angular.copy(todo);
        $scope.currentItemIndex = mainLIst.indexOf(todo);
    };
    blogContent.removeTodo = function (mainLIst, todo) {
        if (!mainLIst)
            mainLIst = [];
        blogContent.todoModeTitle = $filter('translate')('REMOVE_NOW');
        blogContent.removeMode = true;
        blogContent.selectedItemOtherInfos = angular.copy(todo);
        $scope.currentItemIndex = mainLIst.indexOf(todo);
    };
    //#help otherInfo

    blogContent.removeFromCollection = function (listsimilar, iddestination) {
        for (var i = 0; i < blogContent.selectedItem.Similars.length; i++) {
            if (listsimilar[i].LinkDestinationId == iddestination) {
                blogContent.selectedItem.Similars.splice(i, 1);
                return;
            }

        }

    };
    blogContent.removeFromOtherInfo = function (listOtherInfo, title, body, source) {
        for (var i = 0; i < blogContent.selectedItem.OtherInfos.length; i++) {
            if (listOtherInfo[i].Title == title && listOtherInfo[i].HtmlBody == body && listOtherInfo[i].Source == source) {
                blogContent.selectedItem.OtherInfos.splice(i, 1);
                return;
            }
        }
    };
    blogContent.editOtherInfo = function (y) {
        edititem = true;
        blogContent.selectedItemOtherInfos.Title = y.Title;
        blogContent.selectedItemOtherInfos.HtmlBody = y.HtmlBody;
        blogContent.selectedItemOtherInfos.Source = y.Source;
        blogContent.removeFromOtherInfo(blogContent.selectedItem.OtherInfos, y.Title, y.HtmlBody, y.Source);
    };


    //#help
    //Confirm/UnConfirm Blog Content
    blogContent.confirmUnConfirmblogContent = function () {
        if (!blogContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }
        ajax.call(mainPathApi+'blogContent/getviewmodel', blogContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            blogContent.selectedItem = response.Item;
            blogContent.selectedItem.IsAccepted = (response.Item.IsAccepted == true) ? false : true;
            ajax.call(mainPathApi+'blogContent/edit', blogContent.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = blogContent.ListItems.indexOf(blogContent.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        blogContent.ListItems[index] = response2.Item;
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
    blogContent.enableArchive = function () {
        if (!blogContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }
        ajax.call(mainPathApi+'blogContent/getviewmodel', blogContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            blogContent.selectedItem = response.Item;
            blogContent.selectedItem.IsArchive = (response.Item.IsArchive == true) ? false : true;
            ajax.call(mainPathApi+'blogContent/edit', blogContent.selectedItem, 'PUT').success(function (response2) {
                blogContent.categoryBusyIndicator.isActive = true;
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = blogContent.ListItems.indexOf(blogContent.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        blogContent.ListItems[index] = response2.Item;
                    }
                    blogContent.categoryBusyIndicator.isActive = false;
                }

            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                blogContent.categoryBusyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Replace Item OnDelete/OnEdit Grid Options
    blogContent.replaceItem = function (oldId, newItem) {
        angular.forEach(blogContent.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = blogContent.ListItems.indexOf(item);
                blogContent.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            blogContent.ListItems.unshift(newItem);
    }

    blogContent.summernoteText = '<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />';
    blogContent.searchData = function () {
        blogContent.categoryBusyIndicator.isActive = true;
        ajax.call(mainPathApi+"blogContent/getall", blogContent.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            blogContent.categoryBusyIndicator.isActive = false;
            blogContent.ListItems = response.ListItems;
            blogContent.gridOptions.fillData(blogContent.ListItems);
            blogContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            blogContent.gridOptions.totalRowCount = response.TotalRowCount;
            blogContent.gridOptions.rowPerPage = response.RowPerPage;
            blogContent.gridOptions.maxSize = 5;
            blogContent.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            blogContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    blogContent.addRequested = false;
    blogContent.closeModal = function () {
        $modalStack.dismissAll();
    };

    blogContent.showIsBusy = false;

    //Aprove a comment
    blogContent.confirmComment = function (item) {
        console.log("This comment will be confirmed:", item);
    }

    //Decline a comment
    blogContent.doNotConfirmComment = function (item) {
        console.log("This comment will not be confirmed:", item);

    }
    //Remove a comment
    blogContent.deleteComment = function (item) {
        if (!blogContent.gridContentOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        blogContent.treeConfig.showbusy = true;
        blogContent.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translate')('Warning')), "آیا می خواهید این نظر را حذف کنید", function (isConfirmed) {
            if (isConfirmed) {
                console.log("Item to be deleted: ", blogContent.gridOptions.selectedRow.item);
                blogContent.showbusy = true;
                blogContent.showIsBusy = true;
                ajax.call(mainPathApi+'blogContent/getviewmodel', blogContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    blogContent.showbusy = false;
                    blogContent.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    blogContent.selectedItemForDelete = response.Item;
                    console.log(blogContent.selectedItemForDelete);
                    ajax.call(mainPathApi+'blogContent/delete', blogContent.selectedItemForDelete, 'DELETE').success(function (res) {
                        blogContent.treeConfig.showbusy = false;
                        blogContent.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            blogContent.replaceItem(blogContent.selectedItemForDelete.Id);
                            blogContent.gridOptions.fillData(blogContent.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        blogContent.treeConfig.showbusy = false;
                        blogContent.showIsBusy = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    blogContent.treeConfig.showbusy = false;
                    blogContent.showIsBusy = false;
                });
            }
        });
    }

    //For reInit Categories
    blogContent.gridOptions.reGetAll = function () {
        if (blogContent.gridOptions.advancedSearchData.engine.Filters.length > 0) blogContent.searchData();
        else blogContent.init();
    };



    blogContent.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            blogContent.focusExpireLockAccount = true;
        });
    };

    blogContent.isCurrentNodeEmpty = function () {
        return !angular.equals({}, blogContent.treeConfig.currentNode);
    }

    blogContent.loadFileAndFolder = function (item) {
        blogContent.treeConfig.currentNode = item;
        console.log(item);
        blogContent.treeConfig.onNodeSelect(item);
    }

    blogContent.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            blogContent.focus = true;
        });
    };
    blogContent.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            blogContent.focus1 = true;
        });
    };

    blogContent.columnCheckbox = false;
    blogContent.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = blogContent.gridOptions.columns;
        if (blogContent.gridOptions.columnCheckbox) {
            for (var i = 0; i < blogContent.gridOptions.columns.length; i++) {
                //blogContent.gridOptions.columns[i].visible = $("#" + blogContent.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + blogContent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                blogContent.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < blogContent.gridOptions.columns.length; i++) {
                var element = $("#" + blogContent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + blogContent.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < blogContent.gridOptions.columns.length; i++) {
            console.log(blogContent.gridOptions.columns[i].name.concat(".visible: "), blogContent.gridOptions.columns[i].visible);
        }
        blogContent.gridOptions.columnCheckbox = !blogContent.gridOptions.columnCheckbox;
    }

    blogContent.deleteAttachedFile = function (index) {
        blogContent.attachedFiles.splice(index, 1);
    }

    blogContent.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !blogContent.alreadyExist(id, blogContent.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = { id: fId, name: fname };
            blogContent.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    blogContent.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translate')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    blogContent.filePickerMainImage.removeSelectedfile = function (config) {
        blogContent.filePickerMainImage.fileId = null;
        blogContent.filePickerMainImage.filename = null;
        blogContent.selectedItem.LinkMainImageId = null;

    }
    blogContent.filePickerFilePodcast.removeSelectedfile = function (config) {
        blogContent.filePickerFilePodcast.fileId = null;
        blogContent.filePickerFilePodcast.filename = null;
        blogContent.selectedItem.LinkFilePodcastId = null;

    }
    blogContent.filePickerFiles.removeSelectedfile = function (config) {
        blogContent.filePickerFiles.fileId = null;
        blogContent.filePickerFiles.filename = null;
    }




    blogContent.showUpload = function () { $("#fastUpload").fadeToggle(); }

    // ----------- FilePicker Codes --------------------------------
    blogContent.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !blogContent.alreadyExist(id, blogContent.attachedFiles)) {
            var fId = id;
            var file = { fileId: fId, filename: fname };
            blogContent.attachedFiles.push(file);
            blogContent.clearfilePickers();
        }
    }

    blogContent.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translate')('This_Item_Has_Already_Been_Added'));
                blogContent.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    blogContent.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(mainPathApi+'CmsFileContent/getviewmodel', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            blogContent.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    blogContent.clearfilePickers = function () {
        blogContent.filePickerFiles.fileId = null;
        blogContent.filePickerFiles.filename = null;
    }

    blogContent.stringfyLinkFileIds = function () {
        $.each(blogContent.attachedFiles, function (i, item) {
            if (blogContent.selectedItem.LinkFileIds == "")
                blogContent.selectedItem.LinkFileIds = item.fileId;
            else
                blogContent.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    blogContent.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleBlog/BlogContent/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        blogContent.FileList = [];
        //get list of file from category id
        ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", null, 'POST').success(function (response) {
            blogContent.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }
    //---------------Upload Modal Podcast-------------------------------
    blogContent.openUploadModalPodcast = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleBlog/blogContent/upload_modalPodcast.html',
            size: 'lg',
            scope: $scope
        });

        blogContent.FileList = [];
        //get list of file from category id
        ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", null, 'POST').success(function (response) {
            blogContent.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }
    blogContent.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    blogContent.whatcolor = function (progress) {
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

    blogContent.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    blogContent.replaceFile = function (name) {
        blogContent.itemClicked(null, blogContent.fileIdToDelete, "file");
        blogContent.fileTypes = 1;
        blogContent.fileIdToDelete = blogContent.selectedIndex;

        // Delete the file
        ajax.call(mainPathApi+"CmsFileContent/getviewmodel", blogContent.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(mainPathApi+'CmsFileContent/delete', response1.Item, 'DELETE').success(function (response2) {
                    blogContent.remove(blogContent.FileList, blogContent.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(mainPathApi+"CmsFileContent/getviewmodel", "0", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                blogContent.FileItem = response3.Item;
                                blogContent.FileItem.FileName = name;
                                blogContent.FileItem.Extension = name.split('.').pop();
                                blogContent.FileItem.FileSrc = name;
                                blogContent.FileItem.LinkCategoryId = blogContent.thisCategory;
                                blogContent.saveNewFile();
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
    blogContent.saveNewFile = function () {
        ajax.call(mainPathApi+"CmsFileContent/add", blogContent.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                blogContent.FileItem = response.Item;
                blogContent.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            blogContent.showErrorIcon();
            return -1;
        });
    }

    blogContent.showSuccessIcon = function () {
        $().toggle
    }

    blogContent.showErrorIcon = function () {

    }
    //file is exist
    blogContent.fileIsExist = function (fileName) {
        for (var i = 0; i < blogContent.FileList.length; i++) {
            if (blogContent.FileList[i].FileName == fileName) {
                blogContent.fileIdToDelete = blogContent.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    blogContent.getFileItem = function (id) {
        for (var i = 0; i < blogContent.FileList.length; i++) {
            if (blogContent.FileList[i].Id == id) {
                return blogContent.FileList[i];
            }
        }
    }

    //select file or folder
    blogContent.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            blogContent.fileTypes = 1;
            blogContent.selectedFileId = blogContent.getFileItem(index).Id;
            blogContent.selectedFileName = blogContent.getFileItem(index).FileName;
        }
        else {
            blogContent.fileTypes = 2;
            blogContent.selectedCategoryId = blogContent.getCategoryName(index).Id;
            blogContent.selectedCategoryTitle = blogContent.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        blogContent.selectedIndex = index;

    };

    blogContent.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }
    //upload file Podcast
    blogContent.uploadFilePodcast = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (blogContent.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ blogContent.replaceFile(uploadFile.name);
                    blogContent.itemClicked(null, blogContent.fileIdToDelete, "file");
                    blogContent.fileTypes = 1;
                    blogContent.fileIdToDelete = blogContent.selectedIndex;
                    // replace the file
                    ajax
                        .call(
                            mainPathApi+"CmsFileContent/getviewmodel",
                            blogContent.fileIdToDelete,
                            "GET"
                        )
                        .success(function (response1) {
                            if (response1.IsSuccess == true) {
                                console.log(response1.Item);
                                ajax.call(mainPathApi+"CmsFileContent/replace", response1.Item, "POST")
                                    .success(function (response2) {
                                        if (response2.IsSuccess == true) {
                                            blogContent.FileItem = response2.Item;
                                            blogContent.showSuccessIcon();
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-check");
                                            blogContent.filePickerFilePodcast.filename =
                                                blogContent.FileItem.FileName;
                                            blogContent.filePickerFilePodcast.fileId =
                                                response2.Item.Id;
                                            blogContent.selectedItem.LinkFilePodcastId =
                                                blogContent.filePickerFilePodcast.fileId;
                                        } else {
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-remove");
                                        }
                                    })
                                    .error(function (data) {
                                        blogContent.showErrorIcon();
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
            }
            else { // File does not exists
                // Save New file
                ajax.call(mainPathApi+"CmsFileContent/getviewmodel", "0", 'GET').success(function (response) {
                    blogContent.FileItem = response.Item;
                    blogContent.FileItem.FileName = uploadFile.name;
                    blogContent.FileItem.uploadName = uploadFile.uploadName;
                    blogContent.FileItem.Extension = uploadFile.name.split('.').pop();
                    blogContent.FileItem.FileSrc = uploadFile.name;
                    blogContent.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- blogContent.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(mainPathApi+"CmsFileContent/add", blogContent.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            blogContent.FileItem = response.Item;
                            blogContent.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            blogContent.filePickerFilePodcast.filename = blogContent.FileItem.FileName;
                            blogContent.filePickerFilePodcast.fileId = response.Item.Id;
                            blogContent.selectedItem.LinkFilePodcastId = blogContent.filePickerFilePodcast.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        blogContent.showErrorIcon();
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
    //upload file
    blogContent.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (blogContent.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ blogContent.replaceFile(uploadFile.name);
                    blogContent.itemClicked(null, blogContent.fileIdToDelete, "file");
                    blogContent.fileTypes = 1;
                    blogContent.fileIdToDelete = blogContent.selectedIndex;
                    // replace the file
                    ajax
                        .call(
                            mainPathApi+"CmsFileContent/getviewmodel",
                            blogContent.fileIdToDelete,
                            "GET"
                        )
                        .success(function (response1) {
                            if (response1.IsSuccess == true) {
                                console.log(response1.Item);
                                ajax.call(mainPathApi+"CmsFileContent/replace", response1.Item, "POST")
                                    .success(function (response2) {
                                        if (response2.IsSuccess == true) {
                                            blogContent.FileItem = response2.Item;
                                            blogContent.showSuccessIcon();
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-check");
                                            blogContent.filePickerMainImage.filename =
                                                blogContent.FileItem.FileName;
                                            blogContent.filePickerMainImage.fileId =
                                                response2.Item.Id;
                                            blogContent.selectedItem.LinkMainImageId =
                                                blogContent.filePickerMainImage.fileId;
                                        } else {
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-remove");
                                        }
                                    })
                                    .error(function (data) {
                                        blogContent.showErrorIcon();
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
            }
            else { // File does not exists
                // Save New file
                ajax.call(mainPathApi+"CmsFileContent/getviewmodel", "0", 'GET').success(function (response) {
                    blogContent.FileItem = response.Item;
                    blogContent.FileItem.FileName = uploadFile.name;
                    blogContent.FileItem.uploadName = uploadFile.uploadName;
                    blogContent.FileItem.Extension = uploadFile.name.split('.').pop();
                    blogContent.FileItem.FileSrc = uploadFile.name;
                    blogContent.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- blogContent.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(mainPathApi+"CmsFileContent/add", blogContent.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            blogContent.FileItem = response.Item;
                            blogContent.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            blogContent.filePickerMainImage.filename = blogContent.FileItem.FileName;
                            blogContent.filePickerMainImage.fileId = response.Item.Id;
                            blogContent.selectedItem.LinkMainImageId = blogContent.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        blogContent.showErrorIcon();
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
    blogContent.exportFile = function () {
        blogContent.gridOptions.advancedSearchData.engine.ExportFile = blogContent.ExportFileClass;
        blogContent.addRequested = true;
        ajax.call(mainPathApi+'BlogContent/exportfile', blogContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            blogContent.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                blogContent.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //blogContent.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    blogContent.toggleExportForm = function () {
        blogContent.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        blogContent.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        blogContent.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        blogContent.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        blogContent.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleBlog/BlogContent/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    blogContent.rowCountChanged = function () {
        if (!angular.isDefined(blogContent.ExportFileClass.RowCount) || blogContent.ExportFileClass.RowCount > 5000)
            blogContent.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    blogContent.getCount = function () {
        ajax.call(mainPathApi+"BlogContent/count", blogContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            blogContent.addRequested = false;
            rashaErManage.checkAction(response);
            blogContent.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            blogContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    blogContent.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (blogContent.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    blogContent.onNodeToggle = function (node, expanded) {
        if (expanded) {
            node.Children = [];
            var filterModel = { Filters: [] };
            var originalName = node.Title;
            node.messageText = " در حال بارگذاری...";
            filterModel.Filters.push({ PropertyName: "LinkParentId", SearchType: 0, IntValue1: node.Id });
            ajax.call(mainPathApi+"CmsFileCategory/GetAll", filterModel, 'POST').success(function (response1) {
                angular.forEach(response1.ListItems, function (value, key) {
                    node.Children.push(value);
                });
                ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", node.Id, 'POST').success(function (response2) {
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

    blogContent.onSelection = function (node, selected) {
        if (!selected) {
            blogContent.selectedItem.LinkMainImageId = null;
            blogContent.selectedItem.previewImageSrc = null;
            return;
        }
        blogContent.selectedItem.LinkMainImageId = node.Id;
        blogContent.selectedItem.previewImageSrc = "CmsFiles/img/loader.gif";
        ajax.call(mainPathApi+"CmsFileContent/getviewmodel", node.Id, "GET").success(function (response) {
            blogContent.selectedItem.previewImageSrc = "/files/" + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);