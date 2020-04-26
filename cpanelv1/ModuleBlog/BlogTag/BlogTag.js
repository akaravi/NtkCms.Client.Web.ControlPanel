app.controller("blogTagCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window','$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window,$state, $filter) {
    var blogTag = this;
    var edititem=false;
    //For Grid Options
    blogTag.gridOptions = {};
    blogTag.selectedItem = {};
    blogTag.attachedFiles = [];
    blogTag.attachedFile = "";
    var todayDate = moment().format();
    blogTag.DateBirth = {
        defaultDate: todayDate,
        viewTimePicker: true
    }
    blogTag.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }

    blogTag.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    blogTag.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    blogTag.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:blogTag.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:blogTag,
        useCurrentLocationZoom:12,
    }
    if (itemRecordStatus != undefined) blogTag.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    blogTag.selectedItem.ToDate = date;
    blogTag.datePickerConfig = {
        defaultDate: date
    };
    blogTag.startDate = {
        defaultDate: date
    }
    blogTag.endDate = {
        defaultDate: date
    }
    blogTag.count = 0;

//#help/ سلکتور دسته بندی در ویرایش محتوا
 blogTag.LinkCategoryTagIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryTagId',
        url: 'blogCategoryTag',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: blogTag,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' }
            ]
        }
    }

    //blog Grid Options
    blogTag.gridOptions = {
        columns: [
            { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: "ActionKey", displayName: "لیست مطالب", displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="blogTag.OpenContentTag(x.Id,x.Title)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }

    //Comment Grid Options
    blogTag.gridContentOptions = {
        columns: [
           { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
           { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
           { name: 'Writer', displayName: 'نویسنده', sortable: true, type: 'string' },
           { name: 'Comment', displayName: 'کامنت', sortable: true, type: 'string' },
           { name: 'ActionButtons', displayName: 'کلید عملیاتی', template: '<Button ng-if="!x.IsActivated" ng-click="blogTag.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button><Button ng-if="x.IsActivated" ng-click="blogTag.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button><Button ng-click="blogTag.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>' },
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
                Filters: []
            }
        }
    }



    //For Show Category Loading Indicator
    blogTag.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show blog Loading Indicator
    blogTag.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    blogTag.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    blogTag.OpenContentTag = function (LinkTagContentId,TitleTag) {
                $state.go("index.blogcontent", {
            ContentId: LinkTagContentId,
            TitleTag:TitleTag
        });
    }
    blogTag.treeConfig.currentNode = {};
    blogTag.treeBusyIndicator = false;
    blogTag.addRequested = false;
    blogTag.showGridComment = false;
    blogTag.blogTitle = "";

    //init Function
    blogTag.init = function () {
        blogTag.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"blogCategorytag/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            blogTag.treeConfig.Items = response.ListItems;
            blogTag.treeConfig.Items = response.ListItems;
            blogTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"blogtag/getall", blogTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            blogTag.ListItems = response.ListItems;
            blogTag.gridOptions.fillData(blogTag.ListItems, response.resultAccess); // Sending Access as an argument
            blogTag.contentBusyIndicator.isActive = false;
            blogTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            blogTag.gridOptions.totalRowCount = response.TotalRowCount;
            blogTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            blogTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            blogTag.contentBusyIndicator.isActive = false;
        });

    };



    blogTag.gridContentOptions.onRowSelected = function () { }

    // Open Add Category Modal 
    blogTag.addNewCategoryModel = function () {
        blogTag.addRequested = false;
        ajax.call(cmsServerConfig.configApiServerPath+'blogCategorytag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            blogTag.selectedItem = response.Item;
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
                blogTag.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(blogTag.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/Moduleblog/blogCategorytag/add.html',
                        scope: $scope
                    });
                    blogTag.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    buttonIsPressed = false;
    // Open Edit Category Modal
    blogTag.openEditCategoryModel = function () {
        if (buttonIsPressed) return;
        blogTag.addRequested = false;
        blogTag.modalTitle = 'ویرایش';
        if (!blogTag.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        blogTag.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'blogCategorytag/GetOne', blogTag.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            blogTag.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            blogTag.selectedItem = response.Item;
            //Set dataForTheTree
            blogTag.selectedNode = [];
            blogTag.expandedNodes = [];
            blogTag.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                blogTag.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryTagId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(blogTag.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (blogTag.selectedItem.LinkMainImageId > 0)
                        blogTag.onSelection({ Id: blogTag.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/Moduleblog/blogCategorytag/edit.html',
                        scope: $scope
                    });
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Category
    blogTag.addNewCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        blogTag.categoryBusyIndicator.isActive = true;
        blogTag.addRequested = true;
        blogTag.selectedItem.LinkParentId = null;
        if (blogTag.treeConfig.currentNode != null)
            blogTag.selectedItem.LinkParentId = blogTag.treeConfig.currentNode.Id;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'blogCategorytag/add', blogTag.selectedItem, 'POST').success(function (response) {
            buttonIsPressed = false;
            blogTag.addRequested = false;
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                blogTag.gridOptions.advancedSearchData.engine.Filters = null;
                blogTag.gridOptions.advancedSearchData.engine.Filters = [];
                blogTag.gridOptions.reGetAll();
                blogTag.closeModal();
            }
            blogTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogTag.addRequested = false;
            blogTag.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category
    blogTag.editCategory = function (frm) {
        if (frm.$invalid || buttonIsPressed)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        blogTag.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'blogCategorytag/edit', blogTag.selectedItem, 'PUT').success(function (response) {
            blogTag.addRequested = true;
            //blogTag.showbusy = false;
            blogTag.treeConfig.showbusy = false;
            blogTag.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                blogTag.addRequested = false;
                blogTag.treeConfig.currentNode.Title = response.Item.Title;
                blogTag.closeModal();
            }
            blogTag.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogTag.addRequested = false;
            blogTag.categoryBusyIndicator.isActive = false;
        });
    }

    // Delete a Category
    blogTag.deleteCategory = function () {
        if (buttonIsPressed) return;
        var node = blogTag.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                blogTag.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'blogCategorytag/GetOne', node.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    blogTag.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'blogCategorytag/delete', blogTag.selectedItemForDelete, 'POST').success(function (res) {
                        blogTag.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            blogTag.gridOptions.advancedSearchData.engine.Filters = null;
                            blogTag.gridOptions.advancedSearchData.engine.Filters = [];
                            blogTag.gridOptions.fillData();
                            blogTag.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        blogTag.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    blogTag.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    blogTag.treeConfig.onNodeSelect = function () {
        var node = blogTag.treeConfig.currentNode;
        blogTag.showGridComment = false;
        blogTag.CategoryTagId = node.Id;
        blogTag.selectContent(node);
    };

    //Show Content with Category Id
    blogTag.selectContent = function (node) {
        blogTag.gridOptions.advancedSearchData.engine.Filters = null;
        blogTag.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            blogTag.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            blogTag.contentBusyIndicator.isActive = true;

            blogTag.attachedFiles = null;
            blogTag.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryTagId",
                IntValue1: node.Id,
                SearchType: 0
            }
            blogTag.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"blogtag/getall", blogTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            blogTag.contentBusyIndicator.isActive = false;
            blogTag.ListItems = response.ListItems;
            blogTag.gridOptions.fillData(blogTag.ListItems, response.resultAccess); // Sending Access as an argument
            blogTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            blogTag.gridOptions.totalRowCount = response.TotalRowCount;
            blogTag.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            blogTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Open Add New Content Model
    blogTag.openAddModel = function () {

        blogTag.addRequested = false;
        blogTag.modalTitle = 'اضافه کردن محتوای جدید';
        ajax.call(cmsServerConfig.configApiServerPath+'blogtag/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            blogTag.selectedItem = response.Item;
            blogTag.selectedItem.LinkCategoryTagId = blogTag.CategoryTagId;
            //blogTag.clearPreviousData();
            $modal.open({
                templateUrl: 'cpanelv1/Moduleblog/blogtag/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    blogTag.openEditModel = function () {
        if (buttonIsPressed) return;
        blogTag.addRequested = false;
        blogTag.modalTitle = 'ویرایش';
        if (!blogTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'blogtag/GetOne', blogTag.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            blogTag.selectedItem = response1.Item;

            $modal.open({
                templateUrl: 'cpanelv1/Moduleblog/blogtag/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    blogTag.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        blogTag.categoryBusyIndicator.isActive = true;
        blogTag.addRequested = true;


        ajax.call(cmsServerConfig.configApiServerPath+'blogtag/add', blogTag.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            blogTag.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                blogTag.ListItems.unshift(response.Item);
                blogTag.gridOptions.fillData(blogTag.ListItems);
                blogTag.closeModal();

            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogTag.addRequested = false;
            blogTag.categoryBusyIndicator.isActive = false;
        });
    }

    //Edit Content
    blogTag.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        blogTag.categoryBusyIndicator.isActive = true;
        blogTag.addRequested = true;


        ajax.call(cmsServerConfig.configApiServerPath+'blogtag/edit', blogTag.selectedItem, 'PUT').success(function (response) {
            blogTag.categoryBusyIndicator.isActive = false;
            blogTag.addRequested = false;
            blogTag.treeConfig.showbusy = false;
            blogTag.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                blogTag.replaceItem(blogTag.selectedItem.Id, response.Item);
                blogTag.gridOptions.fillData(blogTag.ListItems);
                blogTag.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            blogTag.addRequested = false;
            blogTag.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a blog Content 
    blogTag.deleteContent = function () {
        if (!blogTag.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        blogTag.treeConfig.showbusy = true;
        blogTag.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                blogTag.categoryBusyIndicator.isActive = true;
                console.log(blogTag.gridOptions.selectedRow.item);
                blogTag.showbusy = true;
                blogTag.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+"blogtag/GetOne", blogTag.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    blogTag.showbusy = false;
                    blogTag.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    blogTag.selectedItemForDelete = response.Item;
                    console.log(blogTag.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"blogtag/delete", blogTag.selectedItemForDelete, 'POST').success(function (res) {
                        blogTag.categoryBusyIndicator.isActive = false;
                        blogTag.treeConfig.showbusy = false;
                        blogTag.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            blogTag.replaceItem(blogTag.selectedItemForDelete.Id);
                            blogTag.gridOptions.fillData(blogTag.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        blogTag.treeConfig.showbusy = false;
                        blogTag.showIsBusy = false;
                        blogTag.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    blogTag.treeConfig.showbusy = false;
                    blogTag.showIsBusy = false;
                    blogTag.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }


    //Replace Item OnDelete/OnEdit Grid Options
    blogTag.replaceItem = function (oldId, newItem) {
        angular.forEach(blogTag.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = blogTag.ListItems.indexOf(item);
                blogTag.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            blogTag.ListItems.unshift(newItem);
    }

    blogTag.searchData = function () {
        blogTag.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"blogtsg/getall", blogTag.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            blogTag.contentBusyIndicator.isActive = false;
            blogTag.ListItems = response.ListItems;
            blogTag.gridOptions.fillData(blogTag.ListItems);
            blogTag.gridOptions.currentPageNumber = response.CurrentPageNumber;
            blogTag.gridOptions.totalRowCount = response.TotalRowCount;
            blogTag.gridOptions.rowPerPage = response.RowPerPage;
            blogTag.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            blogTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    blogTag.addRequested = false;
    blogTag.closeModal = function () {
        $modalStack.dismissAll();
    };

    blogTag.showIsBusy = false;



    //For reInit Categories
    blogTag.gridOptions.reGetAll = function () {
        blogTag.init();
    };

    blogTag.isCurrentNodeEmpty = function () {
        return !angular.equals({}, blogTag.treeConfig.currentNode);
    }

    blogTag.loadFileAndFolder = function (item) {
        blogTag.treeConfig.currentNode = item;
        console.log(item);
        blogTag.treeConfig.onNodeSelect(item);
    }

    blogTag.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    blogTag.columnCheckbox = false;
    blogTag.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = blogTag.gridOptions.columns;
        if (blogTag.gridOptions.columnCheckbox) {
            for (var i = 0; i < blogTag.gridOptions.columns.length; i++) {
                var element = $("#" + blogTag.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                blogTag.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < blogTag.gridOptions.columns.length; i++) {
                var element = $("#" + blogTag.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + blogTag.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < blogTag.gridOptions.columns.length; i++) {
            console.log(blogTag.gridOptions.columns[i].name.concat(".visible: "), blogTag.gridOptions.columns[i].visible);
        }
        blogTag.gridOptions.columnCheckbox = !blogTag.gridOptions.columnCheckbox;
    }

    blogTag.deleteAttachedFile = function (index) {
        blogTag.attachedFiles.splice(index, 1);
    }

    blogTag.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !blogTag.alreadyExist(id, blogTag.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = {
                id: fId, name: fname
            };
            blogTag.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    blogTag.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    blogTag.filePickerMainImage.removeSelectedfile = function (config) {
        blogTag.filePickerMainImage.fileId = null;
        blogTag.filePickerMainImage.filename = null;
        blogTag.selectedItem.LinkMainImageId = null;

    }

    blogTag.filePickerFiles.removeSelectedfile = function (config) {
        blogTag.filePickerFiles.fileId = null;
        blogTag.filePickerFiles.filename = null;
        blogTag.selectedItem.LinkFileIds = null;
    }


    blogTag.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }

    // ----------- FilePicker Codes --------------------------------
    blogTag.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !blogTag.alreadyExist(id, blogTag.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            blogTag.attachedFiles.push(file);
            blogTag.clearfilePickers();
        }
    }

    blogTag.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                blogTag.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    blogTag.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;   //String is empty or whitespace then return
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            blogTag.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    blogTag.clearfilePickers = function () {
        blogTag.filePickerFiles.fileId = null;
        blogTag.filePickerFiles.filename = null;
    }

    blogTag.stringfyLinkFileIds = function () {
        $.each(blogTag.attachedFiles, function (i, item) {
            if (blogTag.selectedItem.LinkFileIds == "")
                blogTag.selectedItem.LinkFileIds = item.fileId;
            else
                blogTag.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    blogTag.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/Moduleblog/blogContent/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        blogTag.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            blogTag.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    blogTag.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    blogTag.whatcolor = function (progress) {
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

    blogTag.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    blogTag.replaceFile = function (name) {
        blogTag.itemClicked(null, blogTag.fileIdToDelete, "file");
        blogTag.fileTypes = 1;
        blogTag.fileIdToDelete = blogTag.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", blogTag.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    blogTag.remove(blogTag.FileList, blogTag.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                blogTag.FileItem = response3.Item;
                                blogTag.FileItem.FileName = name;
                                blogTag.FileItem.Extension = name.split('.').pop();
                                blogTag.FileItem.FileSrc = name;
                                blogTag.FileItem.LinkCategoryId = blogTag.thisCategory;
                                blogTag.saveNewFile();
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
    blogTag.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", blogTag.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                blogTag.FileItem = response.Item;
                blogTag.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            blogTag.showErrorIcon();
            return -1;
        });
    }

    blogTag.showSuccessIcon = function () {
    }

    blogTag.showErrorIcon = function () {

    }
    //file is exist
    blogTag.fileIsExist = function (fileName) {
        for (var i = 0; i < blogTag.FileList.length; i++) {
            if (blogTag.FileList[i].FileName == fileName) {
                blogTag.fileIdToDelete = blogTag.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    blogTag.getFileItem = function (id) {
        for (var i = 0; i < blogTag.FileList.length; i++) {
            if (blogTag.FileList[i].Id == id) {
                return blogTag.FileList[i];
            }
        }
    }

    //select file or folder
    blogTag.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            blogTag.fileTypes = 1;
            blogTag.selectedFileId = blogTag.getFileItem(index).Id;
            blogTag.selectedFileName = blogTag.getFileItem(index).FileName;
        }
        else {
            blogTag.fileTypes = 2;
            blogTag.selectedCategoryId = blogTag.getCategoryName(index).Id;
            blogTag.selectedCategoryTitle = blogTag.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        blogTag.selectedIndex = index;

    };

    //upload file
    blogTag.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (blogTag.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ blogTag.replaceFile(uploadFile.name);
                    blogTag.itemClicked(null, blogTag.fileIdToDelete, "file");
                    blogTag.fileTypes = 1;
                    blogTag.fileIdToDelete = blogTag.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                blogTag.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        blogTag.FileItem = response2.Item;
                        blogTag.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        blogTag.filePickerMainImage.filename =
                          blogTag.FileItem.FileName;
                        blogTag.filePickerMainImage.fileId =
                          response2.Item.Id;
                        blogTag.selectedItem.LinkMainImageId =
                          blogTag.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      blogTag.showErrorIcon();
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
                    blogTag.FileItem = response.Item;
                    blogTag.FileItem.FileName = uploadFile.name;
                    blogTag.FileItem.uploadName = uploadFile.uploadName;
                    blogTag.FileItem.Extension = uploadFile.name.split('.').pop();
                    blogTag.FileItem.FileSrc = uploadFile.name;
                    blogTag.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- blogTag.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", blogTag.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            blogTag.FileItem = response.Item;
                            blogTag.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            blogTag.filePickerMainImage.filename = blogTag.FileItem.FileName;
                            blogTag.filePickerMainImage.fileId = response.Item.Id;
                            blogTag.selectedItem.LinkMainImageId = blogTag.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        blogTag.showErrorIcon();
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
    blogTag.exportFile = function () {
        blogTag.gridOptions.advancedSearchData.engine.ExportFile = blogTag.ExportFileClass;
        blogTag.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'blogtag/exportfile', blogTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            blogTag.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                blogTag.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //blogTag.closeModal();
            }
            blogTag.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    blogTag.toggleExportForm = function () {
        blogTag.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        blogTag.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        blogTag.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        blogTag.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        blogTag.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/Moduleblog/blogtag/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    blogTag.rowCountChanged = function () {
        if (!angular.isDefined(blogTag.ExportFileClass.RowCount) || blogTag.ExportFileClass.RowCount > 5000)
            blogTag.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    blogTag.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"blogtag/count", blogTag.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            blogTag.addRequested = false;
            rashaErManage.checkAction(response);
            blogTag.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            blogTag.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    //TreeControl
    blogTag.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (blogTag.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    blogTag.onNodeToggle = function (node, expanded) {
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

    blogTag.onSelection = function (node, selected) {
        if (!selected) {
            blogTag.selectedItem.LinkMainImageId = null;
            blogTag.selectedItem.previewImageSrc = null;
            return;
        }
        blogTag.selectedItem.LinkMainImageId = node.Id;
        blogTag.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            blogTag.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);