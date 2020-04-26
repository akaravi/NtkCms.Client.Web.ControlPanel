app.controller("campaignContentController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter',
    function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var campaignContent = this;
        campaignContent.RouteUploadFileContent = cmsServerConfig.configRouteUploadFileContent;
 //For Grid Options
    campaignContent.gridOptions = {};
    campaignContent.selectedItem = {};
    campaignContent.attachedFiles = [];
    campaignContent.attachedFile = "";

    campaignContent.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    campaignContent.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    campaignContent.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    campaignContent.GeolocationConfig={
        latitude: 'Geolocationlatitude',
        longitude: 'Geolocationlongitude',
        onlocationChanged:campaignContent.locationChanged,
        useCurrentLocation:true,
        center:{lat: 32.658066, lng: 51.6693815},
        zoom:4,
        scope:campaignContent,
        useCurrentLocationZoom:12,
    }

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) campaignContent.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    campaignContent.selectedItem.ToDate = date;
    campaignContent.datePickerConfig = {
        defaultDate: date
    };
    campaignContent.startDate = {
        defaultDate: date
    }
    campaignContent.endDate = {
        defaultDate: date
    }
    campaignContent.LinkProductIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkProductId',
        url: 'ProductContent',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: campaignContent,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
                { name: 'LinkProductId', displayName: 'کد سیستمی ', sortable: true, type: 'integer', visible: true },
            ]
        }
    }
    campaignContent.LinkMemberGroupIdSelector = {
        displayMember: 'Id',
        id: 'Id',
        fId: 'LinkMemberGroupId',
        url: 'MemberGroup',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: campaignContent,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer'},
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
                { name: 'LinkMemberGroupId', displayName: 'کد سیستمی کمپ', sortable: true, type: 'integer', visible: true },
            ]
        }
    }
    //news Grid Options
    campaignContent.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'LinkMemberGroupId', displayName: 'کد سیستمی گروه اعضا', sortable: true, type: 'integer', visible: true },
            { name: 'LinkProductId', displayName: 'کد سیستمی کالا', sortable: true, type: 'string', visible: true },
            { name: 'ProductPrice', displayName: 'قیمت کالا', sortable: true, type: 'string', visible: true },
            { name: 'SalePrice', displayName: 'قیمت فروش', sortable: true, type: 'string', visible: true },
            { name: 'WebAddress', displayName: 'آدرس وب', sortable: true, type: 'string', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'ViewCount', displayName: 'تعداد بازدید', sortable: true, visible: true },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }
    ////Comment Grid Options
    //campaignContent.gridContentOptions = {
    //    columns: [
    //        { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
    //        { name: 'Writer', displayName: 'نویسنده', sortable: true, type: 'string' },
    //        { name: 'Comment', displayName: 'کامنت', sortable: true, type: 'string' },
    //        {
    //            name: 'ActionButtons', displayName: 'کلید عملیاتی', template: '<Button ng-if="!x.IsActivated" ng-click="campaignContent.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button>' +
    //            '<Button ng-if="x.IsActivated" ng-click="campaignContent.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button>' +
    //            '<Button ng-click="campaignContent.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>'
    //        },
    //    ],
    //    data: {},
    //    multiSelect: false,
    //    showUserSearchPanel: false,
    //    advancedSearchData: {
    //        engine: {
    //            CurrentPageNumber: 1,
    //            SortColumn: "Id",
    //            SortType: 0,
    //            NeedToRunFakePagination: false,
    //            TotalRowData: 2000,
    //            RowPerPage: 20,
    //            ContentFullSearch: null,
    //            Filters: []
    //        }
    //    }
    //}

    //#tagsInput -----
    //campaignContent.onTagAdded = function (tag) {
    //    if (!angular.isDefined(tag.id)) {    //Check if this a new or a existing tag (existing tags comprise with an id)
    //        var tagObject = jQuery.extend({}, campaignContent.ModuleTag);   //#Clone a Javascript Object
    //        tagObject.Title = tag.text;
    //        ajax.call('/api/newsTag/add', tagObject, 'POST').success(function (response) {
    //            rashaErManage.checkAction(response);
    //            if (response.IsSuccess) {
    //                campaignContent.tags[campaignContent.tags.length - 1] = { id: response.Item.Id, text: response.Item.Title };  //Replace the newly added tag (last in the array) with a new object including its Id
    //            }
    //        }).error(function (data, errCode, c, d) {
    //            rashaErManage.checkAction(data, errCode);
    //        });
    //    }
    //}

    //For Show Category Loading Indicator
    campaignContent.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show news Loading Indicator
    campaignContent.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    campaignContent.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    campaignContent.addMenu = function () {
        $modal.open({
            templateUrl: "cpanelv1/ModuleCampaign/campaignContent/modalMenu.html",
            scope: $scope
        });
    }

    campaignContent.treeConfig.currentNode = {};
    campaignContent.treeBusyIndicator = false;

    campaignContent.addRequested = false;

    campaignContent.showGridComment = false;
    campaignContent.newsTitle = "";

    //init Function
    campaignContent.init = function () {
        campaignContent.categoryBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = campaignContent.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        campaignContent.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"CampaignCategory/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            campaignContent.treeConfig.Items = response.ListItems;
            campaignContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        campaignContent.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"campaignContent/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            campaignContent.ListItems = response.ListItems;
            campaignContent.gridOptions.fillData(campaignContent.ListItems, response.resultAccess); // Sending Access as an argument
            campaignContent.contentBusyIndicator.isActive = false;
            campaignContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            campaignContent.gridOptions.totalRowCount = response.TotalRowCount;
            campaignContent.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            campaignContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            campaignContent.contentBusyIndicator.isActive = false;
        });
        ajax.call(cmsServerConfig.configApiServerPath+"newsTag/GetViewModel", "", 'GET').success(function (response) {    //Get a ViewModel for newsTag
            campaignContent.ModuleTag = response.Item;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"campaignContentTag/GetViewModel", "", 'GET').success(function (response) { //Get a ViewModel for campaignContentTag
            campaignContent.ModuleContentTag = response.Item;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    };

    // For Show Comments
    campaignContent.showComment = function () {

        if (campaignContent.gridOptions.selectedRow.item) {
            //var id = campaignContent.gridOptions.selectedRow.item.Id;

            var Filter_value = {
                PropertyName: "LinkcampaignContentId",
                IntValue1: campaignContent.gridOptions.selectedRow.item.Id,
                SearchType: 0
            }
            campaignContent.gridContentOptions.advancedSearchData.engine.Filters = null;
            campaignContent.gridContentOptions.advancedSearchData.engine.Filters = [];
            campaignContent.gridContentOptions.advancedSearchData.engine.Filters.push(Filter_value);


            ajax.call(cmsServerConfig.configApiServerPath+'newsComment/getall', campaignContent.gridContentOptions.advancedSearchData.engine, 'POST').success(function (response) {
                campaignContent.listComments = response.ListItems;
                //campaignContent.gridOptions.resultAccess = response.resultAccess; // دسترسی ها نمایش
                campaignContent.gridContentOptions.fillData(campaignContent.listComments, response.resultAccess);
                campaignContent.gridContentOptions.currentPageNumber = response.CurrentPageNumber;
                campaignContent.gridContentOptions.totalRowCount = response.TotalRowCount;
                campaignContent.allowedSearch = response.AllowedSearchField;
                rashaErManage.checkAction(response);
                campaignContent.gridContentOptions.RowPerPage = response.RowPerPage;
                campaignContent.showGridComment = true;
                campaignContent.Title = campaignContent.gridOptions.selectedRow.item.Title;
            });
        }
    }

    campaignContent.gridOptions.onRowSelected = function () {
        var item = campaignContent.gridOptions.selectedRow.item;
        campaignContent.showComment(item);
    }

    //campaignContent.gridContentOptions.onRowSelected = function () { }

    // Open Add Category Modal 
    campaignContent.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        campaignContent.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CampaignCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            campaignContent.selectedItem = response.Item;
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
                campaignContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(campaignContent.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleCampaign/CampaignCategory/add.html',
                        scope: $scope
                    });
                    campaignContent.addRequested = false;
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
    campaignContent.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        campaignContent.addRequested = false;
        campaignContent.modalTitle = 'ویرایش';
        if (!campaignContent.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }

        campaignContent.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CampaignCategory/GetOne', campaignContent.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            campaignContent.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            campaignContent.selectedItem = response.Item;
            //Set dataForTheTree
            campaignContent.selectedNode = [];
            campaignContent.expandedNodes = [];
            campaignContent.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                campaignContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(campaignContent.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (campaignContent.selectedItem.LinkMainImageId > 0)
                        campaignContent.onSelection({ Id: campaignContent.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleCampaign/CampaignCategory/edit.html',
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
    campaignContent.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        campaignContent.categoryBusyIndicator.isActive = true;
        campaignContent.addRequested = true;
        campaignContent.selectedItem.LinkParentId = null;
        if (campaignContent.treeConfig.currentNode != null)
            campaignContent.selectedItem.LinkParentId = campaignContent.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'CampaignCategory/add', campaignContent.selectedItem, 'POST').success(function (response) {
            campaignContent.addRequested = false;
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                campaignContent.gridOptions.advancedSearchData.engine.Filters = null;
                campaignContent.gridOptions.advancedSearchData.engine.Filters = [];
                campaignContent.gridOptions.reGetAll();
                campaignContent.closeModal();
            }
            campaignContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignContent.addRequested = false;
            campaignContent.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    campaignContent.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        campaignContent.categoryBusyIndicator.isActive = true;
        campaignContent.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CampaignCategory/edit', campaignContent.selectedItem, 'PUT').success(function (response) {
            //campaignContent.showbusy = false;
            campaignContent.treeConfig.showbusy = false;
            campaignContent.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignContent.treeConfig.currentNode.Title = response.Item.Title;
                campaignContent.closeModal();
            }
            campaignContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignContent.addRequested = false;
            campaignContent.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    campaignContent.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = campaignContent.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                campaignContent.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'CampaignCategory/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    campaignContent.selectedItemForDelete = response.Item;
                    console.log(campaignContent.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'CampaignCategory/delete', campaignContent.selectedItemForDelete, 'POST').success(function (res) {
                        campaignContent.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //campaignContent.replaceCategoryItem(campaignContent.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            campaignContent.gridOptions.advancedSearchData.engine.Filters = null;
                            campaignContent.gridOptions.advancedSearchData.engine.Filters = [];
                            campaignContent.gridOptions.fillData();
                            campaignContent.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translatentk')('unable_to_delete_the_category_contains_content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        campaignContent.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    campaignContent.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    campaignContent.treeConfig.onNodeSelect = function () {
        var node = campaignContent.treeConfig.currentNode;
        campaignContent.showGridComment = false;
        campaignContent.selectContent(node);

    };
    //Show Content with Category Id
    campaignContent.selectContent = function (node) {
        campaignContent.gridOptions.advancedSearchData.engine.Filters = null;
        campaignContent.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            campaignContent.contentBusyIndicator.message = "در حال بارگذاری  دسته " + node.Title;
            campaignContent.contentBusyIndicator.isActive = true;
            //campaignContent.gridOptions.advancedSearchData = {};
            campaignContent.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryId",
                IntValue1: node.Id,
                SearchType: 0
            }
            campaignContent.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"campaignContent/getall", campaignContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            campaignContent.contentBusyIndicator.isActive = false;
            campaignContent.ListItems = response.ListItems;
            campaignContent.gridOptions.fillData(campaignContent.ListItems, response.resultAccess); // Sending Access as an argument
            campaignContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            campaignContent.gridOptions.totalRowCount = response.TotalRowCount;
            campaignContent.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            campaignContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    campaignContent.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = campaignContent.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage(($filter('translatentk')('To_Add_Content_Please_Select_The_Category')));
            buttonIsPressed = false;
            return;
        }

        campaignContent.attachedFiles = [];
        campaignContent.attachedFile = "";
        campaignContent.filePickerMainImage.filename = "";
        campaignContent.filePickerMainImage.fileId = null;
        campaignContent.filePickerFiles.filename = "";
        campaignContent.filePickerFiles.fileId = null;
        campaignContent.tags = [];   //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
        campaignContent.kwords = [];   //tagsInput خالی کردن آرایه کلمات کلیدی برای محتوای جدید
        campaignContent.addRequested = false;
        campaignContent.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'campaignContent/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            //console.log(response);
            rashaErManage.checkAction(response);
            campaignContent.selectedItem = response.Item;
            campaignContent.selectedItem.LinkCategoryId = node.Id;
            campaignContent.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCampaign/campaignContent/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    campaignContent.openEditModel = function () {
        if (buttonIsPressed) { return };
        campaignContent.attachedFiles = [];
        campaignContent.addRequested = false;
        campaignContent.modalTitle = 'ویرایش';
        if (!campaignContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'campaignContent/GetOne', campaignContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            campaignContent.selectedItem = response1.Item;
            campaignContent.startDate.defaultDate = campaignContent.selectedItem.FromDate;
            campaignContent.endDate.defaultDate = campaignContent.selectedItem.ToDate;
            campaignContent.filePickerMainImage.filename = null;
            campaignContent.filePickerMainImage.fileId = null;
            if (response1.Item.LinkMainImageId != null) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', response1.Item.LinkMainImageId, 'GET').success(function (response2) {
                    buttonIsPressed = false;
                    campaignContent.filePickerMainImage.filename = response2.Item.FileName;
                    campaignContent.filePickerMainImage.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            campaignContent.parseFileIds(response1.Item.LinkFileIds);
            campaignContent.filePickerFiles.filename = null;
            campaignContent.filePickerFiles.fileId = null;
            //Load tagsInput
            campaignContent.tags = [];  //Clear out previous tags
            if (campaignContent.selectedItem.ContentTags == null)
                campaignContent.selectedItem.ContentTags = [];
            $.each(campaignContent.selectedItem.ContentTags, function (index, item) {
                if (item.ModuleTag != null)
                    campaignContent.tags.push({ id: item.ModuleTag.Id, text: item.ModuleTag.Title });  //Add current content's tag to tags array with id and title
            });
            //Load Keywords tagsInput
            campaignContent.kwords = [];  //Clear out previous tags
            var arraykwords = [];
            if (campaignContent.selectedItem.Keyword != null && campaignContent.selectedItem.Keyword != "")
                arraykwords = campaignContent.selectedItem.Keyword.split(',');
            $.each(arraykwords, function (index, item) {
                if (item != null)
                    campaignContent.kwords.push({ text: item });  //Add current content's tag to tags array with id and title
            });
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCampaign/campaignContent/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    campaignContent.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        campaignContent.categoryBusyIndicator.isActive = true;
        campaignContent.addRequested = true;

        //Save attached file ids into campaignContent.selectedItem.LinkFileIds
        campaignContent.selectedItem.LinkFileIds = "";
        campaignContent.stringfyLinkFileIds();
        //Save Keywords
        //$.each(campaignContent.kwords, function (index, item) {
        //    if (index == 0)
        //        campaignContent.selectedItem.Keyword = item.text;
        //    else
        //        campaignContent.selectedItem.Keyword += ',' + item.text;
        //});
        if (campaignContent.selectedItem.LinkCategoryId == null || campaignContent.selectedItem.LinkCategoryId == 0) {
            rashaErManage.showMessage(($filter('translatentk')('To_Add_Content_Please_Select_The_Category')));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'campaignContent/add', campaignContent.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            campaignContent.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                campaignContent.ListItems.unshift(response.Item);
                campaignContent.gridOptions.fillData(campaignContent.ListItems);
                campaignContent.closeModal();
                //Save inputTags
                campaignContent.selectedItem.ContentTags = [];
                $.each(campaignContent.tags, function (index, item) {
                    if (item.id > 0) {
                        var newObject = $.extend({}, campaignContent.ModuleContentTag);
                        newObject.LinkTagId = item.id;
                        newObject.LinkContentId = response.Item.Id;
                        campaignContent.selectedItem.ContentTags.push(newObject);
                    }
                });
                ajax.call(cmsServerConfig.configApiServerPath+'campaignContentTag/addbatch', campaignContent.selectedItem.ContentTags, 'POST').success(function (response) {
                    console.log(response);
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignContent.addRequested = false;
            campaignContent.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
        campaignContent.editContent = function (frm) {
            if (frm.$invalid) {
                rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
                return;
            }
            campaignContent.categoryBusyIndicator.isActive = true;
            campaignContent.addRequested = true;
            //Save attached file ids into campaignContent.selectedItem.LinkFileIds
            campaignContent.selectedItem.LinkFileIds = "";
            campaignContent.stringfyLinkFileIds();
            ////Save Keywords
            //$.each(campaignContent.kwords, function (index, item) {
            //    if (index == 0)
            //        campaignContent.selectedItem.Keyword = item.text;
            //    else
            //        campaignContent.selectedItem.Keyword += ',' + item.text;
            //});
            //Save inputTags
            //campaignContent.selectedItem.ContentTags = [];
            //$.each(campaignContent.tags, function (index, item) {
            //  if (item.id > 0) {
            //    var newObject = $.extend({}, campaignContent.ModuleContentTag);
            //    newObject.LinkTagId = item.id;
            //    newObject.LinkContentId = campaignContent.selectedItem.Id;
            //    campaignContent.selectedItem.ContentTags.push(newObject);
        //      }
        //});
        if (campaignContent.selectedItem.LinkCategoryId == null || campaignContent.selectedItem.LinkCategoryId == 0) {
            rashaErManage.showMessage(($filter('translatentk')('To_Add_Content_Please_Select_The_Category')));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'campaignContent/edit', campaignContent.selectedItem, 'PUT').success(function (response) {
            campaignContent.categoryBusyIndicator.isActive = false;
            campaignContent.addRequested = false;
            campaignContent.treeConfig.showbusy = false;
            campaignContent.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignContent.replaceItem(campaignContent.selectedItem.Id, response.Item);
                campaignContent.gridOptions.fillData(campaignContent.ListItems);
                campaignContent.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignContent.addRequested = false;
            campaignContent.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a news Content 
    campaignContent.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!campaignContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        campaignContent.treeConfig.showbusy = true;
        campaignContent.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                campaignContent.categoryBusyIndicator.isActive = true;
                console.log(campaignContent.gridOptions.selectedRow.item);
                campaignContent.showbusy = true;
                campaignContent.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"campaignContent/GetOne", campaignContent.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    campaignContent.showbusy = false;
                    campaignContent.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    campaignContent.selectedItemForDelete = response.Item;
                    console.log(campaignContent.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+"campaignContent/delete", campaignContent.selectedItemForDelete, 'POST').success(function (res) {
                        campaignContent.categoryBusyIndicator.isActive = false;
                        campaignContent.treeConfig.showbusy = false;
                        campaignContent.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            campaignContent.replaceItem(campaignContent.selectedItemForDelete.Id);
                            campaignContent.gridOptions.fillData(campaignContent.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        campaignContent.treeConfig.showbusy = false;
                        campaignContent.showIsBusy = false;
                        campaignContent.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    campaignContent.treeConfig.showbusy = false;
                    campaignContent.showIsBusy = false;
                    campaignContent.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }

    //Confirm/UnConfirm news Content
    campaignContent.confirmUnConfirmcampaignContent = function () {
        if (!campaignContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Content'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'campaignContent/GetOne', campaignContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            campaignContent.selectedItem = response.Item;
            campaignContent.selectedItem.IsAccepted = (response.Item.IsAccepted == true) ? false : true;
            ajax.call(cmsServerConfig.configApiServerPath+'campaignContent/edit', campaignContent.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = campaignContent.ListItems.indexOf(campaignContent.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        campaignContent.ListItems[index] = response2.Item;
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
    campaignContent.enableArchive = function () {
        if (!campaignContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Content'));
            return;
        }

        ajax.call(cmsServerConfig.configApiServerPath+'campaignContent/GetOne', campaignContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            campaignContent.selectedItem = response.Item;
            campaignContent.selectedItem.IsArchive = (response.Item.IsArchive == true) ? false : true;
            ajax.call(cmsServerConfig.configApiServerPath+'campaignContent/edit', campaignContent.selectedItem, 'PUT').success(function (response2) {
                campaignContent.categoryBusyIndicator.isActive = true;
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = campaignContent.ListItems.indexOf(campaignContent.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        campaignContent.ListItems[index] = response2.Item;
                    }
                    console.log("Arshived Succsseffully");
                    campaignContent.categoryBusyIndicator.isActive = false;
                }

            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                campaignContent.categoryBusyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            campaignContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Replace Item OnDelete/OnEdit Grid Options
    campaignContent.replaceItem = function (oldId, newItem) {
        angular.forEach(campaignContent.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = campaignContent.ListItems.indexOf(item);
                campaignContent.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            campaignContent.ListItems.unshift(newItem);
    }

    campaignContent.summernoteOptions = {
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

    //campaignContent.summernoteText = '<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />';

    campaignContent.searchData = function () {
        campaignContent.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"campaignContent/getall", campaignContent.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            campaignContent.categoryBusyIndicator.isActive = false;
            campaignContent.ListItems = response.ListItems;
            campaignContent.gridOptions.fillData(campaignContent.ListItems);
            campaignContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            campaignContent.gridOptions.totalRowCount = response.TotalRowCount;
            campaignContent.gridOptions.rowPerPage = response.RowPerPage;
            campaignContent.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            campaignContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    campaignContent.addRequested = false;
    campaignContent.closeModal = function () {
        $modalStack.dismissAll();
    };

    campaignContent.showIsBusy = false;

    //Aprove a comment
    campaignContent.confirmComment = function (item) {
        console.log("This comment will be confirmed:", item);
    }

    //Decline a comment
    campaignContent.doNotConfirmComment = function (item) {
        console.log("This comment will not be confirmed:", item);

    }
    //Remove a comment
    campaignContent.deleteComment = function (item) {
        if (!campaignContent.gridContentOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        campaignContent.treeConfig.showbusy = true;
        campaignContent.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), "آیا می خواهید این نظر را حذف کنید", function (isConfirmed) {
            if (isConfirmed) {
                console.log("Item to be deleted: ", campaignContent.gridOptions.selectedRow.item);
                campaignContent.showbusy = true;
                campaignContent.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+'campaignContent/GetOne', campaignContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    campaignContent.showbusy = false;
                    campaignContent.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    campaignContent.selectedItemForDelete = response.Item;
                    console.log(campaignContent.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'campaignContent/delete', campaignContent.selectedItemForDelete, 'POST').success(function (res) {
                        campaignContent.treeConfig.showbusy = false;
                        campaignContent.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            campaignContent.replaceItem(campaignContent.selectedItemForDelete.Id);
                            campaignContent.gridOptions.fillData(campaignContent.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        campaignContent.treeConfig.showbusy = false;
                        campaignContent.showIsBusy = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    campaignContent.treeConfig.showbusy = false;
                    campaignContent.showIsBusy = false;
                });
            }
        });
    }

    //For reInit Categories
    campaignContent.gridOptions.reGetAll = function () {
        if (campaignContent.gridOptions.advancedSearchData.engine.Filters.length > 0) campaignContent.searchData();
        else campaignContent.init();
    };

    campaignContent.isCurrentNodeEmpty = function () {
        return !angular.equals({}, campaignContent.treeConfig.currentNode);
    }

    campaignContent.loadFileAndFolder = function (item) {
        campaignContent.treeConfig.currentNode = item;
        console.log(item);
        campaignContent.treeConfig.onNodeSelect(item);
    }

    campaignContent.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            campaignContent.focus = true;
        });
    };
    campaignContent.openDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            campaignContent.focus1 = true;
        });
    };

    campaignContent.columnCheckbox = false;
    campaignContent.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = campaignContent.gridOptions.columns;
        if (campaignContent.gridOptions.columnCheckbox) {
            for (var i = 0; i < campaignContent.gridOptions.columns.length; i++) {
                //campaignContent.gridOptions.columns[i].visible = $("#" + campaignContent.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + campaignContent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                campaignContent.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < campaignContent.gridOptions.columns.length; i++) {
                var element = $("#" + campaignContent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + campaignContent.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < campaignContent.gridOptions.columns.length; i++) {
            console.log(campaignContent.gridOptions.columns[i].name.concat(".visible: "), campaignContent.gridOptions.columns[i].visible);
        }
        campaignContent.gridOptions.columnCheckbox = !campaignContent.gridOptions.columnCheckbox;
    }

    campaignContent.deleteAttachedFile = function (index) {
        campaignContent.attachedFiles.splice(index, 1);
    }

    campaignContent.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !campaignContent.alreadyExist(id, campaignContent.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = { id: fId, name: fname };
            campaignContent.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    campaignContent.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    campaignContent.filePickerMainImage.removeSelectedfile = function (config) {
        campaignContent.filePickerMainImage.fileId = null;
        campaignContent.filePickerMainImage.filename = null;
        campaignContent.selectedItem.LinkMainImageId = null;

    }

    campaignContent.filePickerFiles.removeSelectedfile = function (config) {
        campaignContent.filePickerFiles.fileId = null;
        campaignContent.filePickerFiles.filename = null;
    }




    campaignContent.showUpload = function () { $("#fastUpload").fadeToggle(); }

    // ----------- FilePicker Codes --------------------------------
    campaignContent.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !campaignContent.alreadyExist(id, campaignContent.attachedFiles)) {
            var fId = id;
            var file = { fileId: fId, filename: fname };
            campaignContent.attachedFiles.push(file);
            campaignContent.clearfilePickers();
        }
    }

    campaignContent.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                campaignContent.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    campaignContent.deleteAttachedfieldName = function (index) {
        ajax.call(cmsServerConfig.configApiServerPath+'campaignContent/delete', campaignContent.contractsList[index], 'POST').success(function (res) {
            rashaErManage.checkAction(res);
            if (res.IsSuccess) {
                campaignContent.contractsList.splice(index, 1);
                rashaErManage.showMessage($filter('translatentk')('Removed_Successfully'));
            }
        }).error(function (data2, errCode2, c2, d2) {
            rashaErManage.checkAction(data2);
        });
    }

    campaignContent.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            campaignContent.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    campaignContent.clearfilePickers = function () {
        campaignContent.filePickerFiles.fileId = null;
        campaignContent.filePickerFiles.filename = null;
    }

    campaignContent.stringfyLinkFileIds = function () {
        $.each(campaignContent.attachedFiles, function (i, item) {
            if (campaignContent.selectedItem.LinkFileIds == "")
                campaignContent.selectedItem.LinkFileIds = item.fileId;
            else
                campaignContent.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    campaignContent.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCampaign/campaignContent/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        campaignContent.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            campaignContent.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    campaignContent.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    campaignContent.whatcolor = function (progress) {
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

    campaignContent.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    campaignContent.replaceFile = function (name) {
        campaignContent.itemClicked(null, campaignContent.fileIdToDelete, "file");
        campaignContent.fileTypes = 1;
        campaignContent.fileIdToDelete = campaignContent.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", campaignContent.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    campaignContent.remove(campaignContent.FileList, campaignContent.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                campaignContent.FileItem = response3.Item;
                                campaignContent.FileItem.FileName = name;
                                campaignContent.FileItem.Extension = name.split('.').pop();
                                campaignContent.FileItem.FileSrc = name;
                                campaignContent.FileItem.LinkCategoryId = campaignContent.thisCategory;
                                campaignContent.saveNewFile();
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
    campaignContent.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", campaignContent.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                campaignContent.FileItem = response.Item;
                campaignContent.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            campaignContent.showErrorIcon();
            return -1;
        });
    }

    campaignContent.showSuccessIcon = function () {
    }

    campaignContent.showErrorIcon = function () {

    }
    //file is exist
    campaignContent.fileIsExist = function (fileName) {
        for (var i = 0; i < campaignContent.FileList.length; i++) {
            if (campaignContent.FileList[i].FileName == fileName) {
                campaignContent.fileIdToDelete = campaignContent.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    campaignContent.getFileItem = function (id) {
        for (var i = 0; i < campaignContent.FileList.length; i++) {
            if (campaignContent.FileList[i].Id == id) {
                return campaignContent.FileList[i];
            }
        }
    }

    //select file or folder
    campaignContent.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            campaignContent.fileTypes = 1;
            campaignContent.selectedFileId = campaignContent.getFileItem(index).Id;
            campaignContent.selectedFileName = campaignContent.getFileItem(index).FileName;
        }
        else {
            campaignContent.fileTypes = 2;
            campaignContent.selectedCategoryId = campaignContent.getCategoryName(index).Id;
            campaignContent.selectedCategoryTitle = campaignContent.getCategoryName(index).Title;
        }
        campaignContent.selectedIndex = index;
    };

    campaignContent.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    //upload file
        campaignContent.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (campaignContent.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ campaignContent.replaceFile(uploadFile.name);
                    campaignContent.itemClicked(null, campaignContent.fileIdToDelete, "file");
                    campaignContent.fileTypes = 1;
                    campaignContent.fileIdToDelete = campaignContent.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                campaignContent.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        campaignContent.FileItem = response2.Item;
                        campaignContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        campaignContent.filePickerMainImage.filename =
                          campaignContent.FileItem.FileName;
                        campaignContent.filePickerMainImage.fileId =
                          response2.Item.Id;
                        campaignContent.selectedItem.LinkMainImageId =
                          campaignContent.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      campaignContent.showErrorIcon();
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
                    campaignContent.FileItem = response.Item;
                    campaignContent.FileItem.FileName = uploadFile.name;
                    campaignContent.FileItem.uploadName = uploadFile.uploadName;
                    campaignContent.FileItem.Extension = uploadFile.name.split('.').pop();
                    campaignContent.FileItem.FileSrc = uploadFile.name;
                    campaignContent.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- campaignContent.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", campaignContent.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            campaignContent.FileItem = response.Item;
                            campaignContent.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            campaignContent.filePickerMainImage.filename = campaignContent.FileItem.FileName;
                            campaignContent.filePickerMainImage.fileId = response.Item.Id;
                            campaignContent.selectedItem.LinkMainImageId = campaignContent.filePickerMainImage.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        campaignContent.showErrorIcon();
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
    campaignContent.exportFile = function () {
        campaignContent.addRequested = true;
        campaignContent.gridOptions.advancedSearchData.engine.ExportFile = campaignContent.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'campaignContent/exportfile', campaignContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            campaignContent.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                campaignContent.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //campaignContent.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    campaignContent.toggleExportForm = function () {
        campaignContent.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        campaignContent.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        campaignContent.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        campaignContent.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        campaignContent.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCampaign/campaignContent/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    campaignContent.rowCountChanged = function () {
        if (!angular.isDefined(campaignContent.ExportFileClass.RowCount) || campaignContent.ExportFileClass.RowCount > 5000)
            campaignContent.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    campaignContent.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"campaignContent/count", campaignContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            campaignContent.addRequested = false;
            rashaErManage.checkAction(response);
            campaignContent.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            campaignContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    campaignContent.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            campaignContent.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //TreeControl
    //campaignContent.treeOptions = {
    //    nodeChildren: "Children",
    //    multiSelection: false,
    //    isLeaf: function (node) {
    //        if (node.FileName == undefined || node.Filename == "")
    //            return false;
    //        return true;
    //    },
    //    isSelectable: function (node) {
    //        if (campaignContent.treeOptions.dirSelectable)
    //            if (angular.isDefined(node.FileName))
    //                return false;
    //        return true;
    //    },
    //    dirSelectable: false
    //}

    //campaignContent.onNodeToggle = function (node, expanded) {
    //    if (expanded) {
    //        node.Children = [];
    //        var filterModel = { Filters: [] };
    //        var originalName = node.Title;
    //        node.messageText = " در حال بارگذاری...";
    //        filterModel.Filters.push({ PropertyName: "LinkParentId", SearchType: 0, IntValue1: node.Id });
    //        ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/GetAll", filterModel, 'POST').success(function (response1) {
    //            angular.forEach(response1.ListItems, function (value, key) {
    //                node.Children.push(value);
    //            });
    //            ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", node.Id, 'POST').success(function (response2) {
    //                angular.forEach(response2.ListItems, function (value, key) {
    //                    node.Children.push(value);
    //                });
    //                node.messageText = "";
    //            }).error(function (data, errCode, c, d) {
    //                console.log(data);
    //            });
    //        }).error(function (data, errCode, c, d) {
    //            console.log(data);
    //        });
    //    }
    //}

    //campaignContent.onSelection = function (node, selected) {
    //    if (!selected) {
    //        campaignContent.selectedItem.LinkMainImageId = null;
    //        campaignContent.selectedItem.previewImageSrc = null;
    //        return;
    //    }
    //    campaignContent.selectedItem.LinkMainImageId = node.Id;
    //    campaignContent.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
    //    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
    //        campaignContent.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
    //    }).error(function (data, errCode, c, d) {
    //        console.log(data);
    //    });
    //}
    //End of TreeControl
}]);
