app.controller("newsContentController", [
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
    "$stateParams",
    "$rootScope",
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
        $filter,
        $stateParams,
        $rootScope
    ) {
        var newsContent = this;
        var edititem = false;
        //For Grid Options
        newsContent.gridOptions = {};
        newsContent.selectedItem = {};
        newsContent.selectedItemRelationship = {};
        newsContent.attachedFiles = [];
        newsContent.attachedFile = "";

        newsContent.filePickerMainImage = {
            isActive: true,
            backElement: "filePickerMainImage",
            filename: null,
            fileId: null,
            multiSelect: false
        };
        newsContent.filePickerFilePodcast = {
            isActive: true,
            backElement: 'filePickerFilePodcast',
            filename: null,
            fileId: null,
            extension: 'mp3',
            multiSelect: false,
        }
        newsContent.filePickerFiles = {
            isActive: true,
            backElement: "filePickerFiles",
            multiSelect: false,
            fileId: null,
            filename: null
        };
        newsContent.locationChanged = function (lat, lang) {
            console.log("ok " + lat + " " + lang);
        }
        newsContent.selectedContentId = { Id: $stateParams.ContentId, TitleTag: $stateParams.TitleTag };
        newsContent.GeolocationConfig = {
            locationMember: 'Geolocation',
            locationMemberString: 'GeolocationString',
            onlocationChanged: newsContent.locationChanged,
            useCurrentLocation: true,
            center: { lat: 33.437039, lng: 53.073182 },
            zoom: 4,
            scope: newsContent,
            useCurrentLocationZoom: 12,
        }
        var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

        if (itemRecordStatus != undefined)
            newsContent.itemRecordStatus = itemRecordStatus;

        var date = moment().format();
        newsContent.selectedItem.ToDate = date;
        newsContent.datePickerConfig = {
            defaultDate: date
        };
        newsContent.startDate = {
            defaultDate: date
        };
        newsContent.endDate = {
            defaultDate: date
        };
        //#help/ سلکتور دسته بندی در ویرایش محتوا
        newsContent.LinkCategoryIdSelector = {
            displayMember: "Title",
            id: "Id",
            fId: "LinkCategoryId",
            url: "NewsCategory",
            sortColumn: "Id",
            sortType: 1,
            filterText: "Title",
            showAddDialog: false,
            rowPerPage: 200,
            scope: newsContent,
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
                        name: 'Description',
                        displayName: 'توضیحات',
                        sortable: true,
                        type: 'string'
                    }
                ]
            }
        };
        //#help/ سلکتور similar
        newsContent.LinkDestinationIdSelector = {
            displayMember: "Title",
            id: "Id",
            fId: "LinkDestinationId",
            url: "NewsContent",
            sortColumn: "Id",
            sortType: 1,
            filterText: "Title",
            showAddDialog: false,
            rowPerPage: 200,
            scope: newsContent,
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


        //#help RelationShip
        newsContent.clearPreviousData = function () {
            newsContent.selectedItemModuleRelationShip = [];
            $("#to").empty();
        };

        newsContent.selectedItemModuleRelationShip = [];
        newsContent.ItemModuleRelationShip = [];


        newsContent.moveSelectedRelationOnAdd = function () {
            if (!newsContent.LinkModuleContentIdOtherSelector.selectedItem.Id || !newsContent.selectedItemModuleRelationShip.ModuleNameOther) {
                rashaErManage.showMessage($filter('translate')('Please_Select_A_RelationShip'));
                return;
            }
            if (!newsContent.selectedItemModuleRelationShip.Title || newsContent.selectedItemModuleRelationShip.Title.length == 0)
                newsContent.selectedItemModuleRelationShip.Title = newsContent.LinkModuleContentIdOtherSelector.filterText;
            newsContent.ItemModuleRelationShip.push({
                Title: newsContent.selectedItemModuleRelationShip.Title,
                ModuleNameOther: newsContent.selectedItemModuleRelationShip.ModuleNameOther.Value,
                LinkModuleContentIdOther: newsContent.LinkModuleContentIdOtherSelector.selectedItem.Id
            });
            newsContent.selectedItemModuleRelationShip = [];
        };
        newsContent.moveSelectedRelationOnEdit = function () {
            if (!newsContent.LinkModuleContentIdOtherSelector.selectedItem.Id || !newsContent.selectedItemRelationship.ModuleNameOther) {
                rashaErManage.showMessage($filter('translate')('Please_Select_A_RelationShip'));
                return;
            }
            if (!newsContent.selectedItemRelationship.Title || newsContent.selectedItemRelationship.Title.length == 0)
                newsContent.selectedItemRelationship.Title = newsContent.LinkModuleContentIdOtherSelector.filterText;
            newsContent.ItemModuleRelationShip.push({
                Title: newsContent.selectedItemRelationship.Title,
                ModuleNameOther: newsContent.selectedItemRelationship.ModuleNameOther.Value,
                LinkModuleContentIdOther: newsContent.LinkModuleContentIdOtherSelector.selectedItem.Id
            });
            newsContent.selectedItemRelationship = [];
        };
        //#help/ سلکتور relationship
        newsContent.LinkModuleContentIdOtherSelector = {
            displayMember: "Title",
            id: "Id",
            fId: "LinkModuleContentIdOther",
            url: "newsContent",
            sortColumn: "Id",
            sortType: 1,
            filterText: "Title",
            showAddDialog: false,
            rowPerPage: 200,
            scope: newsContent,
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
        newsContent.removeFromCollectionRelationShip = function (listsimilar, iddestination) {
            for (var i = 0; i < newsContent.selectedItemModuleRelationShip.length; i++) {
                if (listsimilar[i].LinkDestinationId == iddestination) {
                    newsContent.selectedItemModuleRelationShip.splice(i, 1);
                    return;
                }

            }

        };
        newsContent.changSelectedRelationModuleAdd = function () {
            newsContent.LinkModuleContentIdOtherSelector.url = newsContent.selectedItemModuleRelationShip.ModuleNameOther.Key.split(/Wrapper(.+)/)[1];
            newsContent.LinkModuleContentIdOtherSelector.selectedItem = {};
        }
        newsContent.changSelectedRelationModuleEdit = function () {
            newsContent.LinkModuleContentIdOtherSelector.url = newsContent.selectedItemRelationship.ModuleNameOther.Key.split(/Wrapper(.+)/)[1];
            newsContent.selectedItem.LinkModuleContentIdOther = {};
        }
        newsContent.UrlContent = "";


        //news Grid Options
        newsContent.gridOptions = {
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
                    name: "Title",
                    displayName: "عنوان",
                    sortable: true,
                    type: "string",
                    visible: "true"
                },
                {
                    name: "Description",
                    displayName: "توضیحات",
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
                },
                {
                    name: "ViewCount",
                    displayName: "تعداد بازدید",
                    sortable: true,
                    visible: true
                },
                /*{
                  name: "ActionKey",
                  displayName: "کلیدعملیاتی",
                  displayForce: true,
                  template:
                    '<Button ng-if="!x.IsActivated" ng-click="newsContent.addMenu()"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>'
                },
                {
                  name: "ActionButtons",
                  displayName: "showComment",
                  template:
                    '<Button ng-if="!x.IsActivated" ng-click="newsContent.showComment(x.Id)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>'
                },*/
                { name: "ActionKey", displayName: 'عملیات', displayForce: true, template: '<li ng-if="!x.IsActivated" class="dropdown" dropdown="" style="display: initial;"><a aria-expanded="false" aria-haspopup="true" class="dropdown-toggle count-info" href="" dropdown-toggle=""><i class="fa fa-cog" ></i></a><ul class="dropdown-menu animated fadeInLeft m-t-xs" style="right: -142px;"><li><a ng-click="newsContent.addMenu()" style="color:black">AddMenu</a></li><li><a ng-click="newsContent.showComment(x.Id)" style="color:black">CommentList</a></li></ul></li>' }

            ],
            data: {},
            multiSelect: false,
            advancedSearchData: {
                engine: {}
            }
        };
        //Comment Grid Options
        newsContent.gridContentOptions = {
            columns: [
                {
                    name: "Id",
                    displayName: "کد سیستمی",
                    sortable: true,
                    type: "integer"
                },
                {
                    name: "Writer",
                    displayName: "نویسنده",
                    sortable: true,
                    type: "string"
                },
                {
                    name: "Comment",
                    displayName: "کامنت",
                    sortable: true,
                    type: "string"
                },
                {
                    name: "ActionButtons",
                    displayName: "کلید عملیاتی",
                    template:
                        '<Button ng-if="!x.IsActivated" ng-click="newsContent.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button>' +
                        '<Button ng-if="x.IsActivated" ng-click="newsContent.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button>' +
                        '<Button ng-click="newsContent.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>'
                }
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
        };
        newsContent.gridOptions.advancedSearchData.engine.Filters = null;
        newsContent.gridOptions.advancedSearchData.engine.Filters = [];

        //For Show Category Loading Indicator
        newsContent.categoryBusyIndicator = {
            isActive: true,
            message: "در حال بارگذاری دسته ها ..."
        };
        //For Show news Loading Indicator
        newsContent.contentBusyIndicator = {
            isActive: false,
            message: "در حال بارگذاری ..."
        };
        //Tree Config
        newsContent.treeConfig = {
            displayMember: "Title",
            displayId: "Id",
            displayChild: "Children"
        };

        //open addMenu modal
        newsContent.addMenu = function () {

            $modal.open({
                templateUrl: "cpanelv1/Modulenews/newsContent/modalMenu.html",
                scope: $scope
            });
        };

        newsContent.treeConfig.currentNode = {};
        newsContent.treeBusyIndicator = false;

        newsContent.addRequested = false;

        newsContent.showGridComment = false;
        newsContent.newsTitle = "";

        //init Function
        newsContent.init = function () {
            newsContent.categoryBusyIndicator.isActive = true;

            var engine = {};
            try {
                engine = newsContent.gridOptions.advancedSearchData.engine;
            } catch (error) {
                console.log(error);
            }
            ajax.call(mainPathApi+"ModulesRelationshipContent/GetEnum", {}, 'POST').success(function (response) {
                newsContent.EnumModuleRelationshipName = response;
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            newsContent.categoryBusyIndicator.isActive = true;
            ajax
                .call(mainPathApi + "newsCategory/getall", { RowPerPage: 1000 }, "POST")
                .success(function (response) {
                    newsContent.treeConfig.Items = response.ListItems;
                    newsContent.categoryBusyIndicator.isActive = false;
                })
                .error(function (data, errCode, c, d) {
                    console.log(data);
                });
            filterModel = { PropertyName: "ContentTags", PropertyAnyName: "LinkTagId", SearchType: 0, IntValue1: newsContent.selectedContentId.Id };
            if (newsContent.selectedContentId.Id > 0)
                newsContent.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
            newsContent.contentBusyIndicator.isActive = true;
            ajax
                .call(mainPathApi + "newsContent/getall", newsContent.gridOptions.advancedSearchData.engine, "POST")
                .success(function (response) {
                    rashaErManage.checkAction(response);
                    newsContent.ListItems = response.ListItems;
                    newsContent.gridOptions.fillData(
                        newsContent.ListItems,
                        response.resultAccess
                    ); // Sending Access as an argument
                    newsContent.contentBusyIndicator.isActive = false;
                    newsContent.gridOptions.currentPageNumber =
                        response.CurrentPageNumber;
                    newsContent.gridOptions.totalRowCount = response.TotalRowCount;
                    newsContent.gridOptions.rowPerPage = response.RowPerPage;
                    newsContent.gridOptions.maxSize = 5;
                })
                .error(function (data, errCode, c, d) {
                    newsContent.gridOptions.fillData();
                    rashaErManage.checkAction(data, errCode);
                    newsContent.contentBusyIndicator.isActive = false;
                });
            ajax.call(mainPathApi+"newsTag/getviewmodel", "0", "GET").success(function (response) { //Get a ViewModel for newsTag
                newsContent.ModuleTag = response.Item;
            })
                .error(function (data, errCode, c, d) {
                    console.log(data);
                });
            ajax.call(mainPathApi+"newsContentTag/getviewmodel", "0", "GET").success(function (response) { //Get a ViewModel for newsContentTag
                newsContent.ModuleContentTag = response.Item;
            })
                .error(function (data, errCode, c, d) {
                    console.log(data);
                });
        };

        // For Show Comments
        newsContent.showComment = function (LinkContentId) {
            //newsContent.contentBusyIndicator = true;
            engine = {};
            var filterValue = {
                PropertyName: "LinkContentId",
                IntValue1: parseInt(LinkContentId),
                SearchType: 0
            }
            newsContent.busyIndicatorForDropDownProcess = true;
            engine.Filters = null;
            engine.Filters = [];
            engine.Filters.push(filterValue);
            ajax.call(mainPathApi+"newscomment/getall", engine, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                newsContent.ListCommentItems = response.ListItems;
                newsContent.gridContentOptions.fillData(newsContent.ListCommentItems, response.resultAccess); // Sending Access as an argument
                newsContent.showGridComment = true;
                newsContent.gridContentOptions.currentPageNumber = response.CurrentPageNumber;
                newsContent.gridContentOptions.totalRowCount = response.TotalRowCount;
                newsContent.gridContentOptions.rowPerPage = response.RowPerPage;
                newsContent.gridContentOptions.maxSize = 5;
                $('html, body').animate({
                    scrollTop: $("#ListComment").offset().top
                }, 850);
            }).error(function (data, errCode, c, d) {
                newsContent.gridContentOptions.fillData();
                rashaErManage.checkAction(data, errCode);
                newsContent.contentBusyIndicator.isActive = false;
            });
        };
        /* newsContent.gridOptions.onRowSelected = function() {
           var item = newsContent.gridOptions.selectedRow.item;
           newsContent.showComment(item);
         };*/

        newsContent.gridContentOptions.onRowSelected = function () { };

        // Open Add Category Modal
        newsContent.addNewCategoryModel = function () {
            if (buttonIsPressed) {
                return;
            }
            //newsContent.modalTitle = ($filter('translate')('Add_Category'));
            newsContent.addRequested = false;
            buttonIsPressed = true;
            ajax
                .call(mainPathApi + "newsCategory/getviewmodel", "0", "GET")
                .success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    newsContent.selectedItem = response.Item;
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
                            mainPathApi+"CmsFileCategory/getAll",
                            filterModelParentRootFolders,
                            "POST"
                        )
                        .success(function (response1) {
                            //Get root directories
                            newsContent.dataForTheTree = response1.ListItems;
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
                                    mainPathApi+"CmsFileContent/GetFilesFromCategory",
                                    filterModelRootFiles,
                                    "POST"
                                )
                                .success(function (response2) {
                                    //Get files in root
                                    Array.prototype.push.apply(
                                        newsContent.dataForTheTree,
                                        response2.ListItems
                                    );
                                    $modal.open({
                                        templateUrl: "cpanelv1/ModuleNews/NewsCategory/add.html",
                                        scope: $scope
                                    });
                                    newsContent.addRequested = false;
                                })
                                .error(function (data, errCode, c, d) {
                                    console.log(data);
                                });
                        })
                        .error(function (data, errCode, c, d) {
                            console.log(data);
                        });
                    //-----
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
        };
        // Open Edit Category Modal
        newsContent.EditCategoryModel = function () {
            if (buttonIsPressed) {
                return;
            }
            newsContent.addRequested = false;
            //newsContent.modalTitle = ($filter('translate')('Edit_Category'));
            if (!newsContent.treeConfig.currentNode) {
                rashaErManage.showMessage($filter('translate')('Please_Select_A_Category_To_Edit'));
                return;
            }

            newsContent.contentBusyIndicator.isActive = true;
            buttonIsPressed = true;
            ajax
                .call(
                    mainPathApi+"newsCategory/getviewmodel",
                    newsContent.treeConfig.currentNode.Id,
                    "GET"
                )
                .success(function (response) {
                    buttonIsPressed = false;
                    newsContent.contentBusyIndicator.isActive = false;
                    rashaErManage.checkAction(response);
                    newsContent.selectedItem = response.Item;
                    //Set dataForTheTree
                    newsContent.selectedNode = [];
                    newsContent.expandedNodes = [];
                    newsContent.selectedItem = response.Item;
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
                            mainPathApi+"CmsFileCategory/getAll",
                            filterModelParentRootFolders,
                            "POST"
                        )
                        .success(function (response1) {
                            //Get root directories
                            newsContent.dataForTheTree = response1.ListItems;
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
                                    mainPathApi+"CmsFileContent/GetFilesFromCategory",
                                    filterModelRootFiles,
                                    "POST"
                                )
                                .success(function (response2) {
                                    //Get files in root
                                    Array.prototype.push.apply(
                                        newsContent.dataForTheTree,
                                        response2.ListItems
                                    );
                                    //Set selected files to treeControl
                                    if (newsContent.selectedItem.LinkMainImageId > 0)
                                        newsContent.onSelection(
                                            { Id: newsContent.selectedItem.LinkMainImageId },
                                            true
                                        );
                                    $modal.open({
                                        templateUrl: "cpanelv1/ModuleNews/NewsCategory/edit.html",
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
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
        };

        //open statistics
        newsContent.Showstatistics = function () {
            if (!newsContent.gridOptions.selectedRow.item) {
                rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
                return;
            }
            ajax.call(mainPathApi+'newsContent/getviewmodel', newsContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
                rashaErManage.checkAction(response1);
                newsContent.selectedItem = response1.Item;
                $modal.open({
                    templateUrl: "cpanelv1/Modulenews/newsContent/statistics.html",
                    scope: $scope
                });
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }

        // Add New Category
        newsContent.addNewCategory = function (frm) {
            if (frm.$invalid) return;
            newsContent.categoryBusyIndicator.isActive = true;
            newsContent.addRequested = true;
            newsContent.selectedItem.LinkParentId = null;
            if (newsContent.treeConfig.currentNode != null)
                newsContent.selectedItem.LinkParentId =
                    newsContent.treeConfig.currentNode.Id;
            ajax
                .call(mainPathApi + "newsCategory/add", newsContent.selectedItem, "POST")
                .success(function (response) {
                    newsContent.addRequested = false;
                    rashaErManage.checkAction(response);
                    console.log(response);
                    if (response.IsSuccess) {
                        newsContent.gridOptions.advancedSearchData.engine.Filters = null;
                        newsContent.gridOptions.advancedSearchData.engine.Filters = [];
                        newsContent.gridOptions.reGetAll();
                        newsContent.closeModal();
                    }
                    newsContent.categoryBusyIndicator.isActive = false;
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    newsContent.addRequested = false;
                    newsContent.categoryBusyIndicator.isActive = false;
                });
        };

        //Edit Category REST Api
        newsContent.EditCategory = function (frm) {
            if (frm.$invalid) return;
            newsContent.categoryBusyIndicator.isActive = true;
            newsContent.addRequested = true;
            ajax
                .call(mainPathApi + "newsCategory/edit", newsContent.selectedItem, "PUT")
                .success(function (response) {
                    //newsContent.showbusy = false;
                    newsContent.treeConfig.showbusy = false;
                    newsContent.addRequested = false;
                    rashaErManage.checkAction(response);
                    if (response.IsSuccess) {
                        newsContent.treeConfig.currentNode.Title = response.Item.Title;
                        newsContent.closeModal();
                    }
                    newsContent.categoryBusyIndicator.isActive = false;
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    newsContent.addRequested = false;
                    newsContent.categoryBusyIndicator.isActive = false;
                });
        };

        // Delete a Category
        newsContent.deleteCategory = function () {
            if (buttonIsPressed) {
                return;
            }
            var node = newsContent.treeConfig.currentNode;
            if (node.Id == 0 || !node.Id) {
                rashaErManage.showMessage($filter('translate')('Please_Select_A_Category_To_Remove'));
                return;
            }
            rashaErManage.showYesNo(
                ($filter('translate')('Warning')),
                ($filter('translate')('do_you_want_to_delete_this_attribute')),
                function (isConfirmed) {
                    if (isConfirmed) {
                        newsContent.categoryBusyIndicator.isActive = true;
                        // console.log(node.gridOptions.selectedRow.item);
                        buttonIsPressed = true;
                        ajax
                            .call(mainPathApi + "newsCategory/getviewmodel", node.Id, "GET")
                            .success(function (response) {
                                buttonIsPressed = false;
                                rashaErManage.checkAction(response);
                                newsContent.selectedItemForDelete = response.Item;
                                console.log(newsContent.selectedItemForDelete);
                                ajax
                                    .call(
                                        mainPathApi+"newsCategory/delete",
                                        newsContent.selectedItemForDelete,
                                        "DELETE"
                                    )
                                    .success(function (res) {
                                        newsContent.categoryBusyIndicator.isActive = false;
                                        if (res.IsSuccess) {
                                            //newsContent.replaceCategoryItem(newsContent.treeConfig.Items, node.Id);
                                            console.log("Deleted Successfully !");
                                            newsContent.gridOptions.advancedSearchData.engine.Filters = null;
                                            newsContent.gridOptions.advancedSearchData.engine.Filters = [];
                                            newsContent.gridOptions.fillData();
                                            newsContent.gridOptions.reGetAll();
                                        } else {
                                            //Error occurred
                                            if (res.ErrorType == 15)
                                                rashaErManage.showMessage(
                                                    ($filter('translate')('Unable_To_Delete_The_Category_Contains_Content'))
                                                );
                                        }
                                    })
                                    .error(function (data2, errCode2, c2, d2) {
                                        rashaErManage.checkAction(data2);
                                        newsContent.categoryBusyIndicator.isActive = false;
                                    });
                            })
                            .error(function (data, errCode, c, d) {
                                rashaErManage.checkAction(data, errCode);
                                newsContent.categoryBusyIndicator.isActive = false;
                            });
                    }
                }
            );
        };

        //Tree On Node Select Options
        newsContent.treeConfig.onNodeSelect = function () {
            var node = newsContent.treeConfig.currentNode;
            newsContent.showGridComment = false;
            newsContent.selectContent(node);
        };
        //Show Content with Category Id
        newsContent.selectContent = function (node) {
            newsContent.gridOptions.advancedSearchData.engine.Filters = null;
            newsContent.gridOptions.advancedSearchData.engine.Filters = [];
            if (node != null && node != undefined) {
                newsContent.contentBusyIndicator.message =
                    "در حال بارگذاری مقاله های  دسته " + node.Title;
                newsContent.contentBusyIndicator.isActive = true;
                //newsContent.gridOptions.advancedSearchData = {};
                newsContent.attachedFiles = null;
                newsContent.attachedFiles = [];
                var s = {
                    PropertyName: "LinkCategoryId",
                    IntValue1: node.Id,
                    SearchType: 0
                };
                newsContent.gridOptions.advancedSearchData.engine.Filters.push(s);
            }
            ajax
                .call(
                    mainPathApi+"newsContent/getall",
                    newsContent.gridOptions.advancedSearchData.engine,
                    "POST"
                )
                .success(function (response) {
                    rashaErManage.checkAction(response);
                    newsContent.contentBusyIndicator.isActive = false;
                    newsContent.ListItems = response.ListItems;
                    newsContent.gridOptions.fillData(
                        newsContent.ListItems,
                        response.resultAccess
                    ); // Sending Access as an argument
                    newsContent.gridOptions.currentPageNumber =
                        response.CurrentPageNumber;
                    newsContent.gridOptions.totalRowCount = response.TotalRowCount;
                    newsContent.gridOptions.rowPerPage = response.RowPerPage;
                })
                .error(function (data, errCode, c, d) {
                    newsContent.gridOptions.fillData();
                    rashaErManage.checkAction(data, errCode);
                });
        };
        // Open Add New Content Modal
        newsContent.addNewContentModel = function () {
            newsContent.selectedItemModuleRelationShip = [];
            newsContent.ItemModuleRelationShip = [];
            if (buttonIsPressed) {
                return;
            }
            var node = newsContent.treeConfig.currentNode;
            if (node.Id == 0 || !node.Id) {
                rashaErManage.showMessage($filter('translate')('To_Add_A_News_Please_Select_The_Category'));
                buttonIsPressed = false;
                return;
            }
            newsContent.selectedItemOtherInfos = {};
            newsContent.attachedFiles = [];
            newsContent.attachedFile = "";
            newsContent.filePickerMainImage.filename = "";
            newsContent.filePickerMainImage.fileId = null;
            newsContent.filePickerFilePodcast.filename = "";
            newsContent.filePickerFilePodcast.fileId = null;
            newsContent.filePickerFiles.filename = "";
            newsContent.filePickerFiles.fileId = null;
            newsContent.tags = []; //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
            newsContent.kwords = []; //tagsInput خالی کردن آرایه کلمات کلیدی برای محتوای جدید
            newsContent.addRequested = false;
            //newsContent.modalTitle = ($filter('translate')('Add_Content'));
            buttonIsPressed = true;
            ajax
                .call(mainPathApi + "newsContent/getviewmodel", "0", "GET")
                .success(function (response) {
                    buttonIsPressed = false;
                    console.log(response);
                    rashaErManage.checkAction(response);
                    newsContent.selectedItem = response.Item;
                    newsContent.selectedItem.OtherInfos = [];
                    newsContent.selectedItem.Similars = [];
                    newsContent.selectedItem.LinkCategoryId = node.Id;
                    newsContent.selectedItem.LinkFileIds = null;
                    newsContent.clearPreviousData();
                    $modal.open({
                        templateUrl: "cpanelv1/Modulenews/newsContent/add.html",
                        scope: $scope
                    });
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
        };
        //#help similar & otherinfo
        newsContent.clearPreviousData = function () {
            newsContent.selectedItem.Similars = [];
            $("#to").empty();
        };


        newsContent.moveSelected = function (from, to, calculatePrice) {
            if (from == "Content") {
                //var title = newsContent.ItemListIdSelector.selectedItem.Title;
                // var optionSelectedPrice = newsContent.ItemListIdSelector.selectedItem.Price;
                if (
                    newsContent.selectedItem.LinkDestinationId != undefined &&
                    newsContent.selectedItem.LinkDestinationId != null
                ) {
                    if (newsContent.selectedItem.Similars == undefined)
                        newsContent.selectedItem.Similars = [];
                    for (var i = 0; i < newsContent.selectedItem.Similars.length; i++) {
                        if (
                            newsContent.selectedItem.Similars[i].LinkDestinationId ==
                            newsContent.selectedItem.LinkDestinationId
                        ) {
                            rashaErManage.showMessage($filter('translate')('Content_Is_Duplicate'));
                            return;
                        }
                    }
                    // if (newsContent.selectedItem.Title == null || newsContent.selectedItem.Title.length < 0)
                    //     newsContent.selectedItem.Title = title;
                    newsContent.selectedItem.Similars.push({
                        //Id: 0,
                        //Source: from,
                        LinkDestinationId: newsContent.selectedItem.LinkDestinationId,
                        Destination: newsContent.LinkDestinationIdSelector.selectedItem
                    });
                }
            }
        };
        newsContent.moveSelectedOtherInfo = function (from, to, y) {


            if (newsContent.selectedItem.OtherInfos == undefined)
                newsContent.selectedItem.OtherInfos = [];
            for (var i = 0; i < newsContent.selectedItem.OtherInfos.length; i++) {

                if (newsContent.selectedItem.OtherInfos[i].Title == newsContent.selectedItemOtherInfos.Title && newsContent.selectedItem.OtherInfos[i].HtmlBody == newsContent.selectedItemOtherInfos.HtmlBody && newsContent.selectedItem.OtherInfos[i].Source == newsContent.selectedItemOtherInfos.Source) {
                    rashaErManage.showMessage($filter('translate')('Information_Is_Duplicate'));
                    return;
                }

            }
            if (newsContent.selectedItemOtherInfos.Title == "" && newsContent.selectedItemOtherInfos.Source == "" && newsContent.selectedItemOtherInfos.HtmlBody == "") {
                rashaErManage.showMessage($filter('translate')('Fields_Values_Are_Empty_Please_Enter_Values'));
            }
            else {

                newsContent.selectedItem.OtherInfos.push({
                    Title: newsContent.selectedItemOtherInfos.Title,
                    HtmlBody: newsContent.selectedItemOtherInfos.HtmlBody,
                    Source: newsContent.selectedItemOtherInfos.Source
                });
                newsContent.selectedItemOtherInfos.Title = "";
                newsContent.selectedItemOtherInfos.Source = "";
                newsContent.selectedItemOtherInfos.HtmlBody = "";
            }
            if (edititem) {
                edititem = false;
            }

        };
        //#help otherInfo
        newsContent.selectedItemOtherInfos = {};
        newsContent.todoModeTitle = $filter('translate')('ADD_NOW');
        newsContent.saveTodo = function (mainLIst) {
            if (!mainLIst)
                mainLIst = [];
            if (newsContent.editMode) {
                $scope.currentItem = newsContent.selectedItemOtherInfos;
                mainLIst[$scope.currentItemIndex] = newsContent.selectedItemOtherInfos;
                newsContent.editMode = false;

                //#help edit
                if (newsContent.selectedItemOtherInfos.Id && newsContent.selectedItemOtherInfos.Id > 0)
                    ajax.call(mainPathApi+'newsContentOtherInfo/edit', newsContent.selectedItemOtherInfos, 'PUT').success(function (response) {
                        rashaErManage.checkAction(response);
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                //#help edit
            } else if (newsContent.removeMode) {
                $scope.currentItem = newsContent.selectedItemOtherInfos;
                mainLIst.splice($scope.currentItemIndex, 1);
                newsContent.removeMode = false;
            } else {
                mainLIst.push(newsContent.selectedItemOtherInfos);
            }
            newsContent.selectedItemOtherInfos = "";
            newsContent.todoModeTitle = $filter('translate')('ADD_NOW');
        };
        newsContent.editTodo = function (mainLIst, todo) {
            if (!mainLIst)
                mainLIst = [];
            newsContent.todoModeTitle = $filter('translate')('EDIT_NOW');
            newsContent.editMode = true;
            newsContent.selectedItemOtherInfos = angular.copy(todo);
            $scope.currentItemIndex = mainLIst.indexOf(todo);
        };
        newsContent.removeTodo = function (mainLIst, todo) {
            if (!mainLIst)
                mainLIst = [];
            newsContent.todoModeTitle = $filter('translate')('REMOVE_NOW');
            newsContent.removeMode = true;
            newsContent.selectedItemOtherInfos = angular.copy(todo);
            $scope.currentItemIndex = mainLIst.indexOf(todo);
        };
        //#help otherInfo
        newsContent.removeFromCollection = function (listsimilar, iddestination) {
            for (var i = 0; i < newsContent.selectedItem.Similars.length; i++) {
                if (listsimilar[i].LinkDestinationId == iddestination) {
                    newsContent.selectedItem.Similars.splice(i, 1);
                    return;
                }

            }

        };
        newsContent.removeFromOtherInfo = function (listOtherInfo, title, body, source) {
            for (var i = 0; i < newsContent.selectedItem.OtherInfos.length; i++) {
                if (listOtherInfo[i].Title == title && listOtherInfo[i].HtmlBody == body && listOtherInfo[i].Source == source) {
                    newsContent.selectedItem.OtherInfos.splice(i, 1);
                    return;
                }
            }
        };
        newsContent.editOtherInfo = function (y) {
            edititem = true;
            newsContent.selectedItemOtherInfos.Title = y.Title;
            newsContent.selectedItemOtherInfos.HtmlBody = y.HtmlBody;
            newsContent.selectedItemOtherInfos.Source = y.Source;
            newsContent.removeFromOtherInfo(newsContent.selectedItem.OtherInfos, y.Title, y.HtmlBody, y.Source);
        };


        //#help
        // Open Edit Content Modal
        newsContent.openEditModel = function () {
            newsContent.selectedItemModuleRelationShip = [];
            newsContent.ItemModuleRelationShip = [];
            if (buttonIsPressed) {
                return;
            }
            newsContent.addRequested = false;
            //newsContent.modalTitle = ($filter('translate')('Edit_Content'));
            if (!newsContent.gridOptions.selectedRow.item) {
                rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
                return;
            }
            if (newsContent.gridOptions.selectedRow.item.LinkSiteId != $rootScope.tokenInfo.Item.virtual_CmsSite.Id && !$rootScope.tokenInfo.UserAccessAdminAllowToAllData) {
                rashaErManage.showMessage($filter('translate')('This_News_Is_Shared'));
                return;
            }
            newsContent.selectedItemOtherInfos = {};
            buttonIsPressed = true;
            ajax.call(mainPathApi+"newsContent/getviewmodel", newsContent.gridOptions.selectedRow.item.Id, "GET")
                .success(function (response1) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response1);
                    newsContent.selectedItem = response1.Item;
                    //newsContent.selectedItem.Similars = [];
                    //newsContent.setCollection("Content", response1.Item.Similars,response1.Item.Id);
                    newsContent.startDate.defaultDate = newsContent.selectedItem.FromDate;
                    newsContent.endDate.defaultDate = newsContent.selectedItem.ToDate;
                    newsContent.filePickerMainImage.filename = null;
                    newsContent.filePickerMainImage.fileId = null;
                    newsContent.filePickerFilePodcast.filename = null;
                    newsContent.filePickerFilePodcast.fileId = null;
                    if (response1.Item.LinkMainImageId != null) {
                        ajax
                            .call(
                                mainPathApi+"CmsFileContent/getviewmodel",
                                response1.Item.LinkMainImageId,
                                "GET"
                            )
                            .success(function (response2) {
                                buttonIsPressed = false;
                                newsContent.filePickerMainImage.filename =
                                    response2.Item.FileName;
                                newsContent.filePickerMainImage.fileId = response2.Item.Id;
                            })
                            .error(function (data, errCode, c, d) {
                                rashaErManage.checkAction(data, errCode);
                            });
                    }
                    if (response1.Item.LinkFilePodcastId != null) {
                        ajax.call(mainPathApi+'CmsFileContent/getviewmodel', response1.Item.LinkFilePodcastId, 'GET').success(function (response2) {
                            newsContent.filePickerFilePodcast.filename = response2.Item.FileName;
                            newsContent.filePickerFilePodcast.fileId = response2.Item.Id
                        }).error(function (data, errCode, c, d) {
                            rashaErManage.checkAction(data, errCode);
                        });
                    }
                    //link to other module

                    ajax.call(mainPathApi+'ModulesRelationshipContent/GetAllByContentId', { Id: newsContent.gridOptions.selectedRow.item.Id, enumValue: 20 }, 'POST').success(function (response2) {
                        newsContent.ItemModuleRelationShip = response2.ListItems;

                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                    //link to other module
                    newsContent.parseFileIds(response1.Item.LinkFileIds);
                    newsContent.filePickerFiles.filename = null;
                    newsContent.filePickerFiles.fileId = null;
                    //Load tagsInput
                    newsContent.tags = []; //Clear out previous tags
                    if (newsContent.selectedItem.ContentTags == null)
                        newsContent.selectedItem.ContentTags = [];
                    $.each(newsContent.selectedItem.ContentTags, function (index, item) {
                        if (item.ModuleTag != null)
                            newsContent.tags.push({ id: item.ModuleTag.Id, text: item.ModuleTag.Title }); //Add current content's tag to tags array with id and title
                    });
                    //Load Keywords tagsInput
                    newsContent.kwords = []; //Clear out previous tags
                    var arraykwords = [];
                    if (
                        newsContent.selectedItem.Keyword != null &&
                        newsContent.selectedItem.Keyword != ""
                    )
                        arraykwords = newsContent.selectedItem.Keyword.split(",");
                    $.each(arraykwords, function (index, item) {
                        if (item != null) newsContent.kwords.push({ text: item }); //Add current content's tag to tags array with id and title
                    });
                    $modal.open({
                        templateUrl: "cpanelv1/Modulenews/newsContent/edit.html",
                        scope: $scope
                    });
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
        };



        // Add New Content
        newsContent.addNewContent = function (frm) {
            if (frm.$invalid) return;
            newsContent.categoryBusyIndicator.isActive = true;
            newsContent.addRequested = true;

            //Save attached file ids into newsContent.selectedItem.LinkFileIds
            newsContent.selectedItem.LinkFileIds = "";
            newsContent.stringfyLinkFileIds();
            //Save Keywords
            $.each(newsContent.kwords, function (index, item) {
                if (index == 0) newsContent.selectedItem.Keyword = item.text;
                else newsContent.selectedItem.Keyword += "," + item.text;
            });
            if (
                newsContent.selectedItem.LinkCategoryId == null ||
                newsContent.selectedItem.LinkCategoryId == 0
            ) {
                rashaErManage.showMessage($filter('translate')('To_Add_A_News_Please_Select_The_Category'));
                return;
            }
            //jQuery.extend(true, {}, newsContent.selectedItem );
            var apiSelectedItem = newsContent.selectedItem;
            if (apiSelectedItem.Similars)
                $.each(apiSelectedItem.Similars, function (index, item) {
                    item.Destination = [];
                });
            ajax.call(mainPathApi+"newsContent/add", apiSelectedItem, "POST").success(function (response) {
                rashaErManage.checkAction(response);
                newsContent.categoryBusyIndicator.isActive = false;
                if (response.IsSuccess) {
                    newsContent.selectedItem.LinkSourceId = newsContent.selectedItem.Id;
                    angular.forEach(newsContent.ItemModuleRelationShip, function (item, key) {
                        item.ModuleNameMain = 20;
                        item.LinkModuleContentIdMain = response.Item.Id;
                    });
                    ajax.call(mainPathApi+"ModulesRelationshipContent/AddBatch", newsContent.ItemModuleRelationShip, "POST").success(function (response) {

                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                    newsContent.ListItems.unshift(response.Item);
                    newsContent.gridOptions.fillData(newsContent.ListItems);
                    newsContent.closeModal();
                    //Save inputTags
                    newsContent.selectedItem.ContentTags = [];
                    $.each(newsContent.tags, function (index, item) {
                        if (item.id > 0) {
                            var newObject = $.extend({}, newsContent.ModuleContentTag);
                            newObject.LinkTagId = item.id;
                            newObject.LinkContentId = response.Item.Id;
                            newsContent.selectedItem.ContentTags.push(newObject);
                        }
                    });
                    ajax.call(mainPathApi+"newsContentTag/addbatch", newsContent.selectedItem.ContentTags, "POST").success(function (response) {
                        console.log(response);
                    })
                        .error(function (data, errCode, c, d) {
                            rashaErManage.checkAction(data, errCode);
                        });
                }
            })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    newsContent.addRequested = false;
                    newsContent.categoryBusyIndicator.isActive = false;
                });
        };

        //Edit Content
        newsContent.editContent = function (frm) {
            if (frm.$invalid) return;
            newsContent.categoryBusyIndicator.isActive = true;
            newsContent.addRequested = true;
            //Save attached file ids into newsContent.selectedItem.LinkFileIds
            newsContent.selectedItem.LinkFileIds = "";
            newsContent.stringfyLinkFileIds();
            //Save Keywords
            $.each(newsContent.kwords, function (index, item) {
                if (index == 0) newsContent.selectedItem.Keyword = item.text;
                else newsContent.selectedItem.Keyword += "," + item.text;
            });
            //Save inputTags
            newsContent.selectedItem.ContentTags = [];
            $.each(newsContent.tags, function (index, item) {
                if (item.id > 0) {
                    var newObject = $.extend({}, newsContent.ModuleContentTag);
                    newObject.LinkTagId = item.id;
                    newObject.LinkContentId = newsContent.selectedItem.Id;
                    newsContent.selectedItem.ContentTags.push(newObject);
                }
            });
            if (
                newsContent.selectedItem.LinkCategoryId == null ||
                newsContent.selectedItem.LinkCategoryId == 0
            ) {
                rashaErManage.showMessage($filter('translate')('To_Add_A_News_Please_Select_The_Category'));
                return;
            }

            var apiSelectedItem = newsContent.selectedItem;
            if (apiSelectedItem.Similars)
                $.each(apiSelectedItem.Similars, function (index, item) {
                    item.Destination = [];
                });
            ajax
                .call(mainPathApi + "newsContent/edit", apiSelectedItem, "PUT")
                .success(function (response) {
                    newsContent.categoryBusyIndicator.isActive = false;
                    newsContent.addRequested = false;
                    newsContent.treeConfig.showbusy = false;
                    newsContent.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    if (response.IsSuccess) {
                        newsContent.replaceItem(newsContent.selectedItem.Id, response.Item);
                        newsContent.gridOptions.fillData(newsContent.ListItems);
                        angular.forEach(newsContent.ItemModuleRelationShip, function (item, key) {
                            item.ModuleNameMain = 20;
                            item.LinkModuleContentIdMain = response.Item.Id;
                        });
                        ajax.call(mainPathApi+"ModulesRelationshipContent/AddBatch", newsContent.ItemModuleRelationShip, "POST").success(function (response) {

                        }).error(function (data, errCode, c, d) {
                            rashaErManage.checkAction(data, errCode);
                        });
                        newsContent.closeModal();

                    }
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    newsContent.addRequested = false;
                    newsContent.categoryBusyIndicator.isActive = false;
                });
        };
        // Delete a news Content
        newsContent.deleteContent = function () {
            if (buttonIsPressed) {
                return;
            }
            if (!newsContent.gridOptions.selectedRow.item) {
                rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
                //rashaErManage.showMessage($filter('translate')('Tag'));
                return;
            }
            newsContent.treeConfig.showbusy = true;
            newsContent.showIsBusy = true;
            rashaErManage.showYesNo(
                ($filter('translate')('Warning')),
                ($filter('translate')('do_you_want_to_delete_this_attribute')),
                function (isConfirmed) {
                    if (isConfirmed) {
                        newsContent.categoryBusyIndicator.isActive = true;
                        console.log(newsContent.gridOptions.selectedRow.item);
                        newsContent.showbusy = true;
                        newsContent.showIsBusy = true;
                        buttonIsPressed = true;
                        ajax
                            .call(
                                mainPathApi+"newsContent/getviewmodel",
                                newsContent.gridOptions.selectedRow.item.Id,
                                "GET"
                            )
                            .success(function (response) {
                                buttonIsPressed = false;
                                newsContent.showbusy = false;
                                newsContent.showIsBusy = false;
                                rashaErManage.checkAction(response);
                                newsContent.selectedItemForDelete = response.Item;
                                console.log(newsContent.selectedItemForDelete);
                                ajax
                                    .call(
                                        mainPathApi+"newsContent/delete",
                                        newsContent.selectedItemForDelete,
                                        "DELETE"
                                    )
                                    .success(function (res) {
                                        newsContent.categoryBusyIndicator.isActive = false;
                                        newsContent.treeConfig.showbusy = false;
                                        newsContent.showIsBusy = false;
                                        rashaErManage.checkAction(res);
                                        if (res.IsSuccess) {
                                            newsContent.replaceItem(
                                                newsContent.selectedItemForDelete.Id
                                            );
                                            newsContent.gridOptions.fillData(newsContent.ListItems);
                                        }
                                    })
                                    .error(function (data2, errCode2, c2, d2) {
                                        rashaErManage.checkAction(data2);
                                        newsContent.treeConfig.showbusy = false;
                                        newsContent.showIsBusy = false;
                                        newsContent.categoryBusyIndicator.isActive = false;
                                    });
                            })
                            .error(function (data, errCode, c, d) {
                                rashaErManage.checkAction(data, errCode);
                                newsContent.treeConfig.showbusy = false;
                                newsContent.showIsBusy = false;
                                newsContent.categoryBusyIndicator.isActive = false;
                            });
                    }
                }
            );
        };

        //Confirm/UnConfirm news Content
        newsContent.confirmUnConfirmnewsContent = function () {
            if (!newsContent.gridOptions.selectedRow.item) {
                rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
                return;
            }
            ajax
                .call(
                    mainPathApi+"newsContent/getviewmodel",
                    newsContent.gridOptions.selectedRow.item.Id,
                    "GET"
                )
                .success(function (response) {
                    rashaErManage.checkAction(response);
                    newsContent.selectedItem = response.Item;
                    newsContent.selectedItem.IsAccepted = response.Item.IsAccepted == true
                        ? false
                        : true;
                    ajax
                        .call(mainPathApi + "newsContent/edit", newsContent.selectedItem, "PUT")
                        .success(function (response2) {
                            rashaErManage.checkAction(response2);
                            if (response2.IsSuccess) {
                                var index = newsContent.ListItems.indexOf(
                                    newsContent.gridOptions.selectedRow.item
                                );
                                if (index !== -1) {
                                    newsContent.ListItems[index] = response2.Item;
                                }
                                console.log("Confirm/UnConfirm Successfully");
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
        newsContent.enableArchive = function () {
            if (!newsContent.gridOptions.selectedRow.item) {
                rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
                return;
            }

            ajax
                .call(
                    mainPathApi+"newsContent/getviewmodel",
                    newsContent.gridOptions.selectedRow.item.Id,
                    "GET"
                )
                .success(function (response) {
                    rashaErManage.checkAction(response);
                    newsContent.selectedItem = response.Item;
                    newsContent.selectedItem.IsArchive = response.Item.IsArchive == true
                        ? false
                        : true;
                    ajax
                        .call(mainPathApi + "newsContent/edit", newsContent.selectedItem, "PUT")
                        .success(function (response2) {
                            newsContent.categoryBusyIndicator.isActive = true;
                            rashaErManage.checkAction(response2);
                            if (response2.IsSuccess) {
                                var index = newsContent.ListItems.indexOf(
                                    newsContent.gridOptions.selectedRow.item
                                );
                                if (index !== -1) {
                                    newsContent.ListItems[index] = response2.Item;
                                }
                                console.log("Arshived Succsseffully");
                                newsContent.categoryBusyIndicator.isActive = false;
                            }
                        })
                        .error(function (data, errCode, c, d) {
                            rashaErManage.checkAction(data, errCode);
                            newsContent.categoryBusyIndicator.isActive = false;
                        });
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    newsContent.categoryBusyIndicator.isActive = false;
                });
        };

        //Replace Item OnDelete/OnEdit Grid Options
        newsContent.replaceItem = function (oldId, newItem) {
            angular.forEach(newsContent.ListItems, function (item, key) {
                if (item.Id == oldId) {
                    var index = newsContent.ListItems.indexOf(item);
                    newsContent.ListItems.splice(index, 1);
                }
            });
            if (newItem) newsContent.ListItems.unshift(newItem);
        };

        newsContent.summernoteOptions = {
            height: 300,
            focus: true,
            airMode: false,
            toolbar: [
                ["edit", ["undo", "redo"]],
                ["headline", ["style"]],
                [
                    "style",
                    [
                        "bold",
                        "italic",
                        "underline",
                        "superscript",
                        "subscript",
                        "strikethrough",
                        "clear"
                    ]
                ],
                ["fontface", ["fontname"]],
                ["textsize", ["fontsize"]],
                ["fontclr", ["color"]],
                ["alignment", ["ul", "ol", "paragraph", "lineheight"]],
                ["height", ["height"]],
                ["table", ["table"]],
                ["insert", ["link", "picture", "video", "hr"]],
                ["view", ["fullscreen", "codeview"]],
                ["help", ["help"]]
            ]
        };

        //newsContent.summernoteText = '<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />';

        newsContent.searchData = function () {
            newsContent.categoryBusyIndicator.isActive = true;
            ajax
                .call(
                    mainPathApi+"newsContent/getall",
                    newsContent.gridOptions.advancedSearchData.engine,
                    "POST"
                )
                .success(function (response) {
                    rashaErManage.checkAction(response);
                    newsContent.categoryBusyIndicator.isActive = false;
                    newsContent.ListItems = response.ListItems;
                    newsContent.gridOptions.fillData(newsContent.ListItems);
                    newsContent.gridOptions.currentPageNumber =
                        response.CurrentPageNumber;
                    newsContent.gridOptions.totalRowCount = response.TotalRowCount;
                    newsContent.gridOptions.rowPerPage = response.RowPerPage;
                    newsContent.allowedSearch = response.AllowedSearchField;
                })
                .error(function (data, errCode, c, d) {
                    newsContent.gridOptions.fillData();
                    rashaErManage.checkAction(data, errCode);
                });
        };

        //Close Model Stack
        newsContent.addRequested = false;
        newsContent.closeModal = function () {
            $modalStack.dismissAll();
        };

        newsContent.showIsBusy = false;

        //Aprove a comment
        newsContent.confirmComment = function (item) {
            console.log("This comment will be confirmed:", item);
        };

        //Decline a comment
        newsContent.doNotConfirmComment = function (item) {
            console.log("This comment will not be confirmed:", item);
        };
        //Remove a comment
        newsContent.deleteComment = function (item) {
            if (!newsContent.gridContentOptions.selectedRow.item) {
                rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
                return;
            }
            newsContent.treeConfig.showbusy = true;
            newsContent.showIsBusy = true;
            rashaErManage.showYesNo(
                ($filter('translate')('Warning')),
                "آیا می خواهید این نظر را حذف کنید",
                function (isConfirmed) {
                    if (isConfirmed) {
                        console.log(
                            "Item to be deleted: ",
                            newsContent.gridOptions.selectedRow.item
                        );
                        newsContent.showbusy = true;
                        newsContent.showIsBusy = true;
                        ajax
                            .call(
                                mainPathApi+"newsContent/getviewmodel",
                                newsContent.gridOptions.selectedRow.item.Id,
                                "GET"
                            )
                            .success(function (response) {
                                newsContent.showbusy = false;
                                newsContent.showIsBusy = false;
                                rashaErManage.checkAction(response);
                                newsContent.selectedItemForDelete = response.Item;
                                console.log(newsContent.selectedItemForDelete);
                                ajax
                                    .call(
                                        mainPathApi+"newsContent/delete",
                                        newsContent.selectedItemForDelete,
                                        "DELETE"
                                    )
                                    .success(function (res) {
                                        newsContent.treeConfig.showbusy = false;
                                        newsContent.showIsBusy = false;
                                        rashaErManage.checkAction(res);
                                        if (res.IsSuccess) {
                                            newsContent.replaceItem(
                                                newsContent.selectedItemForDelete.Id
                                            );
                                            newsContent.gridOptions.fillData(newsContent.ListItems);
                                        }
                                    })
                                    .error(function (data2, errCode2, c2, d2) {
                                        rashaErManage.checkAction(data2);
                                        newsContent.treeConfig.showbusy = false;
                                        newsContent.showIsBusy = false;
                                    });
                            })
                            .error(function (data, errCode, c, d) {
                                rashaErManage.checkAction(data, errCode);
                                newsContent.treeConfig.showbusy = false;
                                newsContent.showIsBusy = false;
                            });
                    }
                }
            );
        };

        //For reInit Categories
        newsContent.gridOptions.reGetAll = function () {
            if (newsContent.gridOptions.advancedSearchData.engine.Filters.length > 0)
                newsContent.searchData();
            else newsContent.init();
        };

        newsContent.isCurrentNodeEmpty = function () {
            return !angular.equals({}, newsContent.treeConfig.currentNode);
        };

        newsContent.loadFileAndFolder = function (item) {
            newsContent.treeConfig.currentNode = item;
            console.log(item);
            newsContent.treeConfig.onNodeSelect(item);
        };

        newsContent.openDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $timeout(function () {
                newsContent.focus = true;
            });
        };
        newsContent.openDate1 = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $timeout(function () {
                newsContent.focus1 = true;
            });
        };

        newsContent.columnCheckbox = false;
        newsContent.openGridConfigModal = function () {
            $("#gridView-btn").toggleClass("active");
            var prechangeColumns = newsContent.gridOptions.columns;
            if (newsContent.gridOptions.columnCheckbox) {
                for (var i = 0; i < newsContent.gridOptions.columns.length; i++) {
                    //newsContent.gridOptions.columns[i].visible = $("#" + newsContent.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                    var element = $(
                        "#" +
                        newsContent.gridOptions.columns[i].name.replace(".", "") +
                        "Checkbox"
                    );
                    var temp = element[0].checked;
                    newsContent.gridOptions.columns[i].visible = temp;
                }
            } else {
                for (var i = 0; i < newsContent.gridOptions.columns.length; i++) {
                    var element = $(
                        "#" +
                        newsContent.gridOptions.columns[i].name.replace(".", "") +
                        "Checkbox"
                    );
                    $(
                        "#" + newsContent.gridOptions.columns[i].name + "Checkbox"
                    ).checked =
                        prechangeColumns[i].visible;
                }
            }
            for (var i = 0; i < newsContent.gridOptions.columns.length; i++) {
                console.log(
                    newsContent.gridOptions.columns[i].name.concat(".visible: "),
                    newsContent.gridOptions.columns[i].visible
                );
            }
            newsContent.gridOptions.columnCheckbox = !newsContent.gridOptions
                .columnCheckbox;
        };

        newsContent.deleteAttachedFile = function (index) {
            newsContent.attachedFiles.splice(index, 1);
        };

        newsContent.addAttachedFile = function (id) {
            var fname = $("#file" + id).text();
            if (
                id != null &&
                id != undefined &&
                !newsContent.alreadyExist(id, newsContent.attachedFiles) &&
                fname != null &&
                fname != ""
            ) {
                var fId = id;
                var file = { id: fId, name: fname };
                newsContent.attachedFiles.push(file);
                if (document.getElementsByName("file" + id).length > 1)
                    document.getElementsByName("file" + id)[1].textContent = "";
                else document.getElementsByName("file" + id)[0].textContent = "";
            }
        };

        newsContent.alreadyExist = function (id, array) {
            for (var i = 0; i < array.length; i++) {
                if (id == array[i].fileId) {
                    rashaErManage.showMessage($filter('translate')('This_File_Has_Already_Been_Attachment'));
                    return true;
                }
            }
            return false;
        };

        newsContent.filePickerMainImage.removeSelectedfile = function (config) {
            newsContent.filePickerMainImage.fileId = null;
            newsContent.filePickerMainImage.filename = null;
            newsContent.selectedItem.LinkMainImageId = null;
        };
        newsContent.filePickerFilePodcast.removeSelectedfile = function (config) {
            newsContent.filePickerFilePodcast.fileId = null;
            newsContent.filePickerFilePodcast.filename = null;
            newsContent.selectedItem.LinkFilePodcastId = null;

        }
        newsContent.filePickerFiles.removeSelectedfile = function (config) {
            newsContent.filePickerFiles.fileId = null;
            newsContent.filePickerFiles.filename = null;
        };

        newsContent.showUpload = function () {
            $("#fastUpload").fadeToggle();
        };

        // ----------- FilePicker Codes --------------------------------
        newsContent.addAttachedFile = function (id) {
            var fname = $("#file" + id).text();
            if (fname == "") {
                rashaErManage.showMessage($filter('translate')('Please_Select_A_File_To_Add'));
                return;
            }
            if (
                id != null &&
                id != undefined &&
                !newsContent.alreadyExist(id, newsContent.attachedFiles)
            ) {
                var fId = id;
                var file = { fileId: fId, filename: fname };
                newsContent.attachedFiles.push(file);
                newsContent.clearfilePickers();
            }
        };

        newsContent.alreadyExist = function (fieldId, array) {
            for (var i = 0; i < array.length; i++) {
                if (fieldId == array[i].fileId) {
                    rashaErManage.showMessage($filter('translate')('This_Item_Has_Already_Been_Added'));
                    newsContent.clearfilePickers();
                    return true;
                }
            }
            return false;
        };

        newsContent.deleteAttachedfieldName = function (index) {
            ajax
                .call(
                    mainPathApi+"newsContent/delete",
                    newsContent.contractsList[index],
                    "DELETE"
                )
                .success(function (res) {
                    rashaErManage.checkAction(res);
                    if (res.IsSuccess) {
                        newsContent.contractsList.splice(index, 1);
                        rashaErManage.showMessage($filter('translate')('Removed_Successfully'));
                    }
                })
                .error(function (data2, errCode2, c2, d2) {
                    rashaErManage.checkAction(data2);
                });
        };

        newsContent.parseFileIds = function (stringOfIds) {
            if (stringOfIds == null || !stringOfIds.trim()) return;
            var fileIds = stringOfIds.split(",");
            if (fileIds.length != undefined) {
                $.each(fileIds, function (index, item) {
                    if (item == parseInt(item, 10)) {
                        // Check if item is an integer
                        ajax
                            .call(mainPathApi + "CmsFileContent/getviewmodel", parseInt(item), "GET")
                            .success(function (response) {
                                if (response.IsSuccess) {
                                    newsContent.attachedFiles.push({
                                        fileId: response.Item.Id,
                                        filename: response.Item.FileName
                                    });
                                }
                            })
                            .error(function (data, errCode, c, d) {
                                rashaErManage.checkAction(data, errCode);
                            });
                    }
                });
            }
        };

        newsContent.clearfilePickers = function () {
            newsContent.filePickerFiles.fileId = null;
            newsContent.filePickerFiles.filename = null;
        };

        newsContent.stringfyLinkFileIds = function () {
            $.each(newsContent.attachedFiles, function (i, item) {
                if (newsContent.selectedItem.LinkFileIds == "")
                    newsContent.selectedItem.LinkFileIds = item.fileId;
                else newsContent.selectedItem.LinkFileIds += "," + item.fileId;
            });
        };
        //--------- End FilePickers Codes -------------------------

        //---------------Upload Modal-------------------------------
        newsContent.openUploadModal = function () {
            $modal.open({
                templateUrl: "cpanelv1/Modulenews/newsContent/upload_modal.html",
                size: "lg",
                scope: $scope
            });

            newsContent.FileList = [];
            //get list of file from category id
            ajax
                .call(mainPathApi + "CmsFileContent/GetFilesFromCategory", null, "POST")
                .success(function (response) {
                    newsContent.FileList = response.ListItems;
                })
                .error(function (data) {
                    console.log(data);
                });
        };
        //---------------Upload Modal Podcast-------------------------------
        newsContent.openUploadModalPodcast = function () {
            $modal.open({
                templateUrl: 'cpanelv1/Modulenews/newsContent/upload_modalPodcast.html',
                size: 'lg',
                scope: $scope
            });

            newsContent.FileList = [];
            //get list of file from category id
            ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", null, 'POST').success(function (response) {
                newsContent.FileList = response.ListItems;
            }).error(function (data) {
                console.log(data);
            });

        }

        newsContent.calcuteProgress = function (progress) {
            wdth = Math.floor(progress * 100);
            return wdth;
        };

        newsContent.whatcolor = function (progress) {
            wdth = Math.floor(progress * 100);
            if (wdth >= 0 && wdth < 30) {
                return "danger";
            } else if (wdth >= 30 && wdth < 50) {
                return "warning";
            } else if (wdth >= 50 && wdth < 85) {
                return "info";
            } else {
                return "success";
            }
        };

        newsContent.canShow = function (pr) {
            if (pr == 1) {
                return true;
            }
            return false;
        };
        // File Manager actions
        newsContent.replaceFile = function (name) {
            newsContent.itemClicked(null, newsContent.fileIdToDelete, "file");
            newsContent.fileTypes = 1;
            newsContent.fileIdToDelete = newsContent.selectedIndex;

            // Delete the file
            ajax
                .call(mainPathApi + "CmsFileContent/getviewmodel", newsContent.fileIdToDelete, "GET")
                .success(function (response1) {
                    if (response1.IsSuccess == true) {
                        console.log(response1.Item);
                        ajax
                            .call(mainPathApi + "CmsFileContent/delete", response1.Item, "DELETE")
                            .success(function (response2) {
                                newsContent.remove(
                                    newsContent.FileList,
                                    newsContent.fileIdToDelete
                                );
                                if (response2.IsSuccess == true) {
                                    // Save New file
                                    ajax
                                        .call(mainPathApi + "CmsFileContent/getviewmodel", "0", "GET")
                                        .success(function (response3) {
                                            if (response3.IsSuccess == true) {
                                                newsContent.FileItem = response3.Item;
                                                newsContent.FileItem.FileName = name;
                                                newsContent.FileItem.Extension = name.split(".").pop();
                                                newsContent.FileItem.FileSrc = name;
                                                newsContent.FileItem.LinkCategoryId =
                                                    newsContent.thisCategory;
                                                newsContent.saveNewFile();
                                            } else {
                                                console.log(
                                                    "getting the model was not successfully returned!"
                                                );
                                            }
                                        })
                                        .error(function (data) {
                                            console.log(data);
                                        });
                                } else {
                                    console.log(
                                        "Request to api/CmsFileContent/delete was not successfully returned!"
                                    );
                                }
                            })
                            .error(function (data, errCode, c, d) {
                                console.log(data);
                            });
                    }
                })
                .error(function (data) {
                    console.log(data);
                });
        };
        //save new file
        newsContent.saveNewFile = function () {
            ajax
                .call(mainPathApi + "CmsFileContent/add", newsContent.FileItem, "POST")
                .success(function (response) {
                    if (response.IsSuccess) {
                        newsContent.FileItem = response.Item;
                        newsContent.showSuccessIcon();
                        return 1;
                    } else {
                        return 0;
                    }
                })
                .error(function (data) {
                    newsContent.showErrorIcon();
                    return -1;
                });
        };

        newsContent.showSuccessIcon = function () { };

        newsContent.showErrorIcon = function () { };
        //file is exist
        newsContent.fileIsExist = function (fileName) {
            for (var i = 0; i < newsContent.FileList.length; i++) {
                if (newsContent.FileList[i].FileName == fileName) {
                    newsContent.fileIdToDelete = newsContent.FileList[i].Id;
                    return true;
                }
            }
            return false;
        };

        newsContent.getFileItem = function (id) {
            for (var i = 0; i < newsContent.FileList.length; i++) {
                if (newsContent.FileList[i].Id == id) {
                    return newsContent.FileList[i];
                }
            }
        };

        //select file or folder
        newsContent.itemClicked = function ($event, index, type) {
            if (type == "file" || type == 1) {
                newsContent.fileTypes = 1;
                newsContent.selectedFileId = newsContent.getFileItem(index).Id;
                newsContent.selectedFileName = newsContent.getFileItem(index).FileName;
            } else {
                newsContent.fileTypes = 2;
                newsContent.selectedCategoryId = newsContent.getCategoryName(index).Id;
                newsContent.selectedCategoryTitle = newsContent.getCategoryName(
                    index
                ).Title;
            }
            newsContent.selectedIndex = index;
        };

        newsContent.toggleCategoryButtons = function () {
            $("#categoryButtons").fadeToggle();
        };
        //upload file Podcast
        newsContent.uploadFilePodcast = function (index, uploadFile) {
            if ($("#save-icon" + index).hasClass("fa-save")) {
                if (newsContent.fileIsExist(uploadFile.name)) { // File already exists
                    if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                        //------------ newsContent.replaceFile(uploadFile.name);
                        newsContent.itemClicked(null, newsContent.fileIdToDelete, "file");
                        newsContent.fileTypes = 1;
                        newsContent.fileIdToDelete = newsContent.selectedIndex;
                        // replace the file
                        ajax
                            .call(
                                mainPathApi+"CmsFileContent/getviewmodel",
                                newsContent.fileIdToDelete,
                                "GET"
                            )
                            .success(function (response1) {
                                if (response1.IsSuccess == true) {
                                    console.log(response1.Item);
                                    ajax.call(mainPathApi+"CmsFileContent/replace", response1.Item, "POST")
                                        .success(function (response2) {
                                            if (response2.IsSuccess == true) {
                                                newsContent.FileItem = response2.Item;
                                                newsContent.showSuccessIcon();
                                                $("#save-icon" + index).removeClass("fa-save");
                                                $("#save-button" + index).removeClass(
                                                    "flashing-button"
                                                );
                                                $("#save-icon" + index).addClass("fa-check");
                                                newsContent.filePickerFilePodcast.filename =
                                                    newsContent.FileItem.FileName;
                                                newsContent.filePickerFilePodcast.fileId =
                                                    response2.Item.Id;
                                                newsContent.selectedItem.LinkFilePodcastId =
                                                    newsContent.filePickerFilePodcast.fileId;
                                            } else {
                                                $("#save-icon" + index).removeClass("fa-save");
                                                $("#save-button" + index).removeClass(
                                                    "flashing-button"
                                                );
                                                $("#save-icon" + index).addClass("fa-remove");
                                            }
                                        })
                                        .error(function (data) {
                                            newsContent.showErrorIcon();
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
                        newsContent.FileItem = response.Item;
                        newsContent.FileItem.FileName = uploadFile.name;
                        newsContent.FileItem.uploadName = uploadFile.uploadName;
                        newsContent.FileItem.Extension = uploadFile.name.split('.').pop();
                        newsContent.FileItem.FileSrc = uploadFile.name;
                        newsContent.FileItem.LinkCategoryId = null;  //Save the new file in the root
                        // ------- newsContent.saveNewFile()  ----------------------
                        var result = 0;
                        ajax.call(mainPathApi+"CmsFileContent/add", newsContent.FileItem, 'POST').success(function (response) {
                            if (response.IsSuccess) {
                                newsContent.FileItem = response.Item;
                                newsContent.showSuccessIcon();
                                $("#save-icon" + index).removeClass("fa-save");
                                $("#save-button" + index).removeClass("flashing-button");
                                $("#save-icon" + index).addClass("fa-check");
                                newsContent.filePickerFilePodcast.filename = newsContent.FileItem.FileName;
                                newsContent.filePickerFilePodcast.fileId = response.Item.Id;
                                newsContent.selectedItem.LinkFilePodcastId = newsContent.filePickerFilePodcast.fileId

                            }
                            else {
                                $("#save-icon" + index).removeClass("fa-save");
                                $("#save-button" + index).removeClass("flashing-button");
                                $("#save-icon" + index).addClass("fa-remove");
                            }
                        }).error(function (data) {
                            newsContent.showErrorIcon();
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
        newsContent.uploadFile = function (index, uploadFile) {
            if ($("#save-icon" + index).hasClass("fa-save")) {
                if (newsContent.fileIsExist(uploadFile.name)) {
                    // File already exists
                    if (
                        confirm(
                            'File "' +
                            uploadFile.name +
                            '" already exists! Do you want to replace the new file?'
                        )
                    ) {
                        //------------ newsContent.replaceFile(uploadFile.name);
                        newsContent.itemClicked(null, newsContent.fileIdToDelete, "file");
                        newsContent.fileTypes = 1;
                        newsContent.fileIdToDelete = newsContent.selectedIndex;
                        // replace the file
                        ajax
                            .call(
                                mainPathApi+"CmsFileContent/getviewmodel",
                                newsContent.fileIdToDelete,
                                "GET"
                            )
                            .success(function (response1) {
                                if (response1.IsSuccess == true) {
                                    console.log(response1.Item);
                                    ajax.call(mainPathApi+"CmsFileContent/replace", response1.Item, "POST")
                                        .success(function (response2) {
                                            if (response2.IsSuccess == true) {
                                                newsContent.FileItem = response2.Item;
                                                newsContent.showSuccessIcon();
                                                $("#save-icon" + index).removeClass("fa-save");
                                                $("#save-button" + index).removeClass(
                                                    "flashing-button"
                                                );
                                                $("#save-icon" + index).addClass("fa-check");
                                                newsContent.filePickerMainImage.filename =
                                                    newsContent.FileItem.FileName;
                                                newsContent.filePickerMainImage.fileId =
                                                    response2.Item.Id;
                                                newsContent.selectedItem.LinkMainImageId =
                                                    newsContent.filePickerMainImage.fileId;
                                            } else {
                                                $("#save-icon" + index).removeClass("fa-save");
                                                $("#save-button" + index).removeClass(
                                                    "flashing-button"
                                                );
                                                $("#save-icon" + index).addClass("fa-remove");
                                            }
                                        })
                                        .error(function (data) {
                                            newsContent.showErrorIcon();
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
                } else {
                    // File does not exists
                    // Save New file
                    ajax
                        .call(mainPathApi + "CmsFileContent/getviewmodel", "0", "GET")
                        .success(function (response) {
                            newsContent.FileItem = response.Item;
                            newsContent.FileItem.FileName = uploadFile.name;
                            newsContent.FileItem.uploadName = uploadFile.uploadName;
                            newsContent.FileItem.Extension = uploadFile.name.split(".").pop();
                            newsContent.FileItem.FileSrc = uploadFile.name;
                            newsContent.FileItem.LinkCategoryId = null; //Save the new file in the root
                            // ------- newsContent.saveNewFile()  ----------------------
                            var result = 0;
                            ajax
                                .call(mainPathApi + "CmsFileContent/add", newsContent.FileItem, "POST")
                                .success(function (response) {
                                    if (response.IsSuccess) {
                                        newsContent.FileItem = response.Item;
                                        newsContent.showSuccessIcon();
                                        $("#save-icon" + index).removeClass("fa-save");
                                        $("#save-button" + index).removeClass("flashing-button");
                                        $("#save-icon" + index).addClass("fa-check");
                                        newsContent.filePickerMainImage.filename =
                                            newsContent.FileItem.FileName;
                                        newsContent.filePickerMainImage.fileId = response.Item.Id;
                                        newsContent.selectedItem.LinkMainImageId =
                                            newsContent.filePickerMainImage.fileId;
                                    } else {
                                        $("#save-icon" + index).removeClass("fa-save");
                                        $("#save-button" + index).removeClass("flashing-button");
                                        $("#save-icon" + index).addClass("fa-remove");
                                    }
                                })
                                .error(function (data) {
                                    newsContent.showErrorIcon();
                                    $("#save-icon" + index).removeClass("fa-save");
                                    $("#save-button" + index).removeClass("flashing-button");
                                    $("#save-icon" + index).addClass("fa-remove");
                                });
                            //-----------------------------------
                        })
                        .error(function (data) {
                            console.log(data);
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        });
                }
            }
        };
        //End of Upload Modal-----------------------------------------

        //Export Report
        newsContent.exportFile = function () {
            newsContent.addRequested = true;
            newsContent.gridOptions.advancedSearchData.engine.ExportFile =
                newsContent.ExportFileClass;
            ajax
                .call(
                    mainPathApi+"newsContent/exportfile",
                    newsContent.gridOptions.advancedSearchData.engine,
                    "POST"
                )
                .success(function (response) {
                    newsContent.addRequested = false;
                    rashaErManage.checkAction(response);
                    if (response.IsSuccess) {
                        newsContent.exportDownloadLink =
                            window.location.origin + response.LinkFile;
                        $window.open(response.LinkFile, "_blank");
                        //newsContent.closeModal();
                    }
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
        };
        //Open Export Report Modal
        newsContent.toggleExportForm = function () {
            newsContent.SortType = [
                { key: "نزولی", value: 0 },
                { key: "صعودی", value: 1 },
                { key: "تصادفی", value: 3 }
            ];
            newsContent.EnumExportFileType = [
                { key: "Excel", value: 1 },
                { key: "PDF", value: 2 },
                { key: "Text", value: 3 }
            ];
            newsContent.EnumExportReceiveMethod = [
                { key: "دانلود", value: 0 },
                { key: "ایمیل", value: 1 },
                { key: "فایل منیجر", value: 3 }
            ];
            newsContent.ExportFileClass = {
                FileType: 1,
                RecieveMethod: 0,
                RowCount: 100
            };
            newsContent.exportDownloadLink = null;
            $modal.open({
                templateUrl: "cpanelv1/ModuleNews/NewsContent/report.html",
                scope: $scope
            });
        };
        //Row Count Export Input Change
        newsContent.rowCountChanged = function () {
            if (
                !angular.isDefined(newsContent.ExportFileClass.RowCount) ||
                newsContent.ExportFileClass.RowCount > 5000
            )
                newsContent.ExportFileClass.RowCount = 5000;
        };
        //Get TotalRowCount
        newsContent.getCount = function () {
            ajax.call(mainPathApi+"newsContent/count", newsContent.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
                newsContent.addRequested = false;
                rashaErManage.checkAction(response);
                newsContent.ListItemsTotalRowCount = ": " + response.TotalRowCount;
            })
                .error(function (data, errCode, c, d) {
                    newsContent.gridOptions.fillData();
                    rashaErManage.checkAction(data, errCode);
                });
        };

        newsContent.showCategoryImage = function (mainImageId) {
            if (mainImageId == 0 || mainImageId == null) return;
            ajax
                .call(mainPathApi + "CmsFileContent/PreviewImage", { id: mainImageId, name: "" }, "POST")
                .success(function (response) {
                    newsContent.selectedItem.MainImageSrc = response;
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
        };

        //TreeControl
        newsContent.treeOptions = {
            nodeChildren: "Children",
            multiSelection: false,
            isLeaf: function (node) {
                if (node.FileName == undefined || node.Filename == "") return false;
                return true;
            },
            isSelectable: function (node) {
                if (newsContent.treeOptions.dirSelectable)
                    if (angular.isDefined(node.FileName)) return false;
                return true;
            },
            dirSelectable: false
        };

        newsContent.onNodeToggle = function (node, expanded) {
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
                    .call(mainPathApi + "CmsFileCategory/GetAll", filterModel, "POST")
                    .success(function (response1) {
                        angular.forEach(response1.ListItems, function (value, key) {
                            node.Children.push(value);
                        });
                        ajax
                            .call(mainPathApi + "CmsFileContent/GetFilesFromCategory", node.Id, "POST")
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

        newsContent.onSelection = function (node, selected) {
            if (!selected) {
                newsContent.selectedItem.LinkMainImageId = null;
                newsContent.selectedItem.previewImageSrc = null;
                return;
            }
            newsContent.selectedItem.LinkMainImageId = node.Id;
            newsContent.selectedItem.previewImageSrc = "CmsFiles/img/loader.gif";
            ajax
                .call(mainPathApi + "CmsFileContent/getviewmodel", node.Id, "GET")
                .success(function (response) {
                    newsContent.selectedItem.previewImageSrc =
                        "/files/" + response.Item.Id + "/" + response.Item.FileName;
                })
                .error(function (data, errCode, c, d) {
                    console.log(data);
                });
        };
        //End of TreeControl
    }
]);
