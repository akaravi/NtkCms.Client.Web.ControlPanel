app.controller("reservationContentController", [
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
    "$state",
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
        $state,
        $rootScope
    ) {
        var reservationContent = this;
        reservationContent.RouteUploadFileContent = cmsServerConfig.configRouteUploadFileContent;
        var edititem = false;
        //For Grid Options
        reservationContent.gridOptions = {};
        reservationContent.selectedItem = {};
        reservationContent.attachedFiles = [];
        

        reservationContent.filePickerMainImage = {
            isActive: true,
            backElement: "filePickerMainImage",
            filename: null,
            fileId: null,
            multiSelect: false
        };
        reservationContent.filePickerFilePodcast = {
            isActive: true,
            backElement: 'filePickerFilePodcast',
            filename: null,
            fileId: null,
            extension: 'mp3',
            multiSelect: false,
        }
        reservationContent.filePickerFiles = {
            isActive: true,
            backElement: "filePickerFiles",
            multiSelect: false,
            fileId: null,
            filename: null
        };
        reservationContent.locationChanged = function (lat, lang) {
            console.log("ok " + lat + " " + lang);
        }
        reservationContent.selectedContentId = { Id: $stateParams.ContentId, TitleTag: $stateParams.TitleTag };
        reservationContent.GeolocationConfig = {
            latitude: 'Geolocationlatitude',
            longitude: 'Geolocationlongitude',
            onlocationChanged: reservationContent.locationChanged,
            useCurrentLocation: true,
            center: { lat: 32.658066, lng: 51.6693815 },
            zoom: 4,
            scope: reservationContent,
            useCurrentLocationZoom: 12,
        }
        var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

        if (itemRecordStatus != undefined)
            reservationContent.itemRecordStatus = itemRecordStatus;

        var date = moment().format();
        reservationContent.selectedItem.ToDate = date;
        reservationContent.datePickerConfig = {
            defaultDate: date
        };
        reservationContent.startDate = {
            defaultDate: date
        };
        reservationContent.endDate = {
            defaultDate: date
        };
        //#help/ سلکتور دسته بندی در ویرایش محتوا
        reservationContent.LinkCategoryIdSelector = {
            displayMember: "Title",
            id: "Id",
            fId: "LinkCategoryId",
            url: "reservationCategory",
            sortColumn: "Id",
            sortType: 1,
            filterText: "Title",
            showAddDialog: false,
            rowPerPage: 200,
            scope: reservationContent,
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
        reservationContent.LinkDestinationIdSelector = {
            displayMember: "Title",
            id: "Id",
            fId: "LinkDestinationId",
            url: "reservationContent",
            sortColumn: "Id",
            sortType: 1,
            filterText: "Title",
            showAddDialog: false,
            rowPerPage: 200,
            scope: reservationContent,
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

        //reservation Grid Options
        reservationContent.gridOptions = {
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
                    '<Button ng-if="!x.IsActivated" ng-click="reservationContent.addMenu()"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>'
                },*/
                {
                    name: "ActionButtons",
                    displayName: "showAppDate",
                    template:
                        '<Button ng-if="!x.IsActivated" ng-click="reservationContent.showAppDate(x.Id)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>'
                },
                { name: "ActionKey", displayName: 'عملیات', displayForce: true, template: '<li ng-if="!x.IsActivated" class="dropdown" dropdown="" style="display: initial;"><a aria-expanded="false" aria-haspopup="true" class="dropdown-toggle count-info" href="" dropdown-toggle=""><i class="fa fa-cog" ></i></a><ul class="dropdown-menu animated fadeInLeft m-t-xs" style="right: -142px;"><li><a ng-click="reservationContent.addMenu()" style="color:black">AddMenu</a></li><li><a ng-click="reservationContent.showComment(x.Id)" style="color:black">CommentList</a></li></ul></li>' }

            ],
            data: {},
            multiSelect: false,
            advancedSearchData: {
                engine: {}
            }
        };
        //Comment Grid Options
        reservationContent.gridContentOptions = {
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
                        '<Button ng-if="!x.IsActivated" ng-click="reservationContent.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button>' +
                        '<Button ng-if="x.IsActivated" ng-click="reservationContent.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button>' +
                        '<Button ng-click="reservationContent.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>'
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
        reservationContent.gridOptions.advancedSearchData.engine.Filters = null;
        reservationContent.gridOptions.advancedSearchData.engine.Filters = [];

        //#tagsInput -----
        //reservationContent.onTagAdded = function(tag) {
        //   if (!angular.isDefined(tag.id)) {
        //     //Check if this a new or a existing tag (existing tags comprise with an id)
        //     var tagObject = jQuery.extend({}, reservationContent.ModuleTag); //#Clone a Javascript Object
        //     tagObject.Title = tag.text;
        //     ajax
        //       .call("/api/reservationTag/add", tagObject, "POST")
        //       .success(function(response) {
        //         rashaErManage.checkAction(response);
        //         if (response.IsSuccess) {
        //           reservationContent.tags[reservationContent.tags.length - 1] = {
        //             id: response.Item.Id,
        //             text: response.Item.Title
        //           }; //Replace the newly added tag (last in the array) with a new object including its Id
        //         }
        //       })
        //       .error(function(data, errCode, c, d) {
        //         rashaErManage.checkAction(data, errCode);
        //       });
        //   }
        // };

        //For Show Category Loading Indicator
        reservationContent.categoryBusyIndicator = {
            isActive: true,
            message: "در حال بارگذاری دسته ها ..."
        };
        //For Show reservation Loading Indicator
        reservationContent.contentBusyIndicator = {
            isActive: false,
            message: "در حال بارگذاری ..."
        };
        //Tree Config
        reservationContent.treeConfig = {
            displayMember: "Title",
            displayId: "Id",
            displayChild: "Children"
        };

        //open addMenu modal
        reservationContent.addMenu = function () {
            $modal.open({
                templateUrl: "cpanelv1/Modulereservation/reservationContent/modalMenu.html",
                scope: $scope
            });
        };

        reservationContent.treeConfig.currentNode = {};
        reservationContent.treeBusyIndicator = false;

        reservationContent.addRequested = false;

        reservationContent.showGridComment = false;
        reservationContent.reservationTitle = "";

        //init Function
        reservationContent.init = function () {
            reservationContent.categoryBusyIndicator.isActive = true;

            var engine = {};
            try {
                engine = reservationContent.gridOptions.advancedSearchData.engine;
            } catch (error) {
                console.log(error);
            }

            reservationContent.categoryBusyIndicator.isActive = true;
            ajax
                .call(cmsServerConfig.configApiServerPath + "reservationCategory/getall", { RowPerPage: 1000 }, "POST")
                .success(function (response) {
                    reservationContent.treeConfig.Items = response.ListItems;
                    reservationContent.categoryBusyIndicator.isActive = false;
                })
                .error(function (data, errCode, c, d) {
                    console.log(data);
                });
            filterModel = { PropertyName: "ContentTags", PropertyAnyName: "LinkTagId", SearchType: 0, IntValue1: reservationContent.selectedContentId.Id };
            if (reservationContent.selectedContentId.Id > 0)
                reservationContent.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
            reservationContent.contentBusyIndicator.isActive = true;
            ajax
                .call(cmsServerConfig.configApiServerPath + "reservationContent/getall", reservationContent.gridOptions.advancedSearchData.engine, "POST")
                .success(function (response) {
                    rashaErManage.checkAction(response);
                    reservationContent.ListItems = response.ListItems;
                    reservationContent.gridOptions.fillData(
                        reservationContent.ListItems,
                        response.resultAccess
                    ); // Sending Access as an argument
                    reservationContent.contentBusyIndicator.isActive = false;
                    reservationContent.gridOptions.currentPageNumber =
                        response.CurrentPageNumber;
                    reservationContent.gridOptions.totalRowCount = response.TotalRowCount;
                    reservationContent.gridOptions.rowPerPage = response.RowPerPage;
                    reservationContent.gridOptions.maxSize = 5;
                })
                .error(function (data, errCode, c, d) {
                    reservationContent.gridOptions.fillData();
                    rashaErManage.checkAction(data, errCode);
                    reservationContent.contentBusyIndicator.isActive = false;
                });
            ajax
                .call(cmsServerConfig.configApiServerPath + "reservationTag/GetViewModel", "", "GET")
                .success(function (response) {
                    //Get a ViewModel for reservationTag
                    reservationContent.ModuleTag = response.Item;
                })
                .error(function (data, errCode, c, d) {
                    console.log(data);
                });
            ajax
                .call(cmsServerConfig.configApiServerPath + "reservationContentTag/GetViewModel", "", "GET")
                .success(function (response) {
                    //Get a ViewModel for reservationContentTag
                    reservationContent.ModuleContentTag = response.Item;
                })
                .error(function (data, errCode, c, d) {
                    console.log(data);
                });
        };
        reservationContent.showAppDate = function (LinkContentId) {
            $state.go("index.reservationappointmentdate", { ContentId: LinkContentId });
        }
        // For Show Comments
        reservationContent.showComment = function (LinkContentId) {
            //reservationContent.contentBusyIndicator = true;
            engine = {};
            var filterValue = {
                PropertyName: "LinkContentId",
                IntValue1: parseInt(LinkContentId),
                SearchType: 0
            }
            reservationContent.busyIndicatorForDropDownProcess = true;
            engine.Filters = null;
            engine.Filters = [];
            engine.Filters.push(filterValue);
            ajax.call(cmsServerConfig.configApiServerPath+"reservationcomment/getall", engine, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                reservationContent.ListCommentItems = response.ListItems;
                reservationContent.gridContentOptions.fillData(reservationContent.ListCommentItems, response.resultAccess); // Sending Access as an argument
                reservationContent.showGridComment = true;
                reservationContent.gridContentOptions.currentPageNumber = response.CurrentPageNumber;
                reservationContent.gridContentOptions.totalRowCount = response.TotalRowCount;
                reservationContent.gridContentOptions.rowPerPage = response.RowPerPage;
                reservationContent.gridContentOptions.maxSize = 5;
                $('html, body').animate({
                    scrollTop: $("#ListComment").offset().top
                }, 850);
            }).error(function (data, errCode, c, d) {
                reservationContent.gridContentOptions.fillData();
                rashaErManage.checkAction(data, errCode);
                reservationContent.contentBusyIndicator.isActive = false;
            });
        };
        /* reservationContent.gridOptions.onRowSelected = function() {
           var item = reservationContent.gridOptions.selectedRow.item;
           reservationContent.showComment(item);
         };*/

        reservationContent.gridContentOptions.onRowSelected = function () { };


        //open statistics
        reservationContent.Showstatistics = function () {
            if (!reservationContent.gridOptions.selectedRow.item) {
                rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
                return;
            }
            ajax.call(cmsServerConfig.configApiServerPath+'reservationContent/GetOne', reservationContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
                rashaErManage.checkAction(response1);
                reservationContent.selectedItem = response1.Item;
                $modal.open({
                    templateUrl: "cpanelv1/Modulereservation/reservationContent/statistics.html",
                    scope: $scope
                });
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }

        // Open Add Category Modal
        reservationContent.addNewCategoryModel = function () {
            if (buttonIsPressed) {
                return;
            }
            //reservationContent.modalTitle = ($filter('translatentk')('Add_Category'));
            reservationContent.addRequested = false;
            buttonIsPressed = true;
            ajax
                .call(cmsServerConfig.configApiServerPath + "reservationCategory/GetViewModel", "", "GET")
                .success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    reservationContent.selectedItem = response.Item;
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
                            reservationContent.dataForTheTree = response1.ListItems;
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
                                        reservationContent.dataForTheTree,
                                        response2.ListItems
                                    );
                                    $modal.open({
                                        templateUrl: "cpanelv1/Modulereservation/reservationCategory/add.html",
                                        scope: $scope
                                    });
                                    reservationContent.addRequested = false;
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
        reservationContent.EditCategoryModel = function () {
            if (buttonIsPressed) {
                return;
            }
            reservationContent.addRequested = false;
            //reservationContent.modalTitle = ($filter('translatentk')('Edit_Category'));
            if (!reservationContent.treeConfig.currentNode) {
                rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
                return;
            }

            reservationContent.contentBusyIndicator.isActive = true;
            buttonIsPressed = true;
            ajax
                .call(
                    cmsServerConfig.configApiServerPath+"reservationCategory/GetOne",
                    reservationContent.treeConfig.currentNode.Id,
                    "GET"
                )
                .success(function (response) {
                    buttonIsPressed = false;
                    reservationContent.contentBusyIndicator.isActive = false;
                    rashaErManage.checkAction(response);
                    reservationContent.selectedItem = response.Item;
                    //Set dataForTheTree
                    reservationContent.selectedNode = [];
                    reservationContent.expandedNodes = [];
                    reservationContent.selectedItem = response.Item;
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
                            reservationContent.dataForTheTree = response1.ListItems;
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
                                        reservationContent.dataForTheTree,
                                        response2.ListItems
                                    );
                                    //Set selected files to treeControl
                                    if (reservationContent.selectedItem.LinkMainImageId > 0)
                                        reservationContent.onSelection(
                                            { Id: reservationContent.selectedItem.LinkMainImageId },
                                            true
                                        );
                                    $modal.open({
                                        templateUrl: "cpanelv1/Modulereservation/reservationCategory/edit.html",
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

        // Add New Category
        reservationContent.addNewCategory = function (frm) {
            if (frm.$invalid) return;
            reservationContent.categoryBusyIndicator.isActive = true;
            reservationContent.addRequested = true;
            reservationContent.selectedItem.LinkParentId = null;
            if (reservationContent.treeConfig.currentNode != null)
                reservationContent.selectedItem.LinkParentId =
                    reservationContent.treeConfig.currentNode.Id;
            ajax
                .call(cmsServerConfig.configApiServerPath + "reservationCategory/add", reservationContent.selectedItem, "POST")
                .success(function (response) {
                    reservationContent.addRequested = false;
                    rashaErManage.checkAction(response);
                    console.log(response);
                    if (response.IsSuccess) {
                        reservationContent.gridOptions.advancedSearchData.engine.Filters = null;
                        reservationContent.gridOptions.advancedSearchData.engine.Filters = [];
                        reservationContent.gridOptions.reGetAll();
                        reservationContent.closeModal();
                    }
                    reservationContent.categoryBusyIndicator.isActive = false;
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    reservationContent.addRequested = false;
                    reservationContent.categoryBusyIndicator.isActive = false;
                });
        };

        //Edit Category REST Api
        reservationContent.EditCategory = function (frm) {
            if (frm.$invalid) return;
            reservationContent.categoryBusyIndicator.isActive = true;
            reservationContent.addRequested = true;
            ajax
                .call(cmsServerConfig.configApiServerPath + "reservationCategory/edit", reservationContent.selectedItem, "PUT")
                .success(function (response) {
                    //reservationContent.showbusy = false;
                    reservationContent.treeConfig.showbusy = false;
                    reservationContent.addRequested = false;
                    rashaErManage.checkAction(response);
                    if (response.IsSuccess) {
                        reservationContent.treeConfig.currentNode.Title = response.Item.Title;
                        reservationContent.closeModal();
                    }
                    reservationContent.categoryBusyIndicator.isActive = false;
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    reservationContent.addRequested = false;
                    reservationContent.categoryBusyIndicator.isActive = false;
                });
        };

        // Delete a Category
        reservationContent.deleteCategory = function () {
            if (buttonIsPressed) {
                return;
            }
            var node = reservationContent.treeConfig.currentNode;
            if (node.Id == 0 || !node.Id) {
                rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
                return;
            }
            rashaErManage.showYesNo(
                ($filter('translatentk')('warning')),
                ($filter('translatentk')('do_you_want_to_delete_this_attribute')),
                function (isConfirmed) {
                    if (isConfirmed) {
                        reservationContent.categoryBusyIndicator.isActive = true;
                        // console.log(node.gridOptions.selectedRow.item);
                        buttonIsPressed = true;
                        ajax
                            .call(cmsServerConfig.configApiServerPath + "reservationCategory/GetOne", node.Id, "GET")
                            .success(function (response) {
                                buttonIsPressed = false;
                                rashaErManage.checkAction(response);
                                reservationContent.selectedItemForDelete = response.Item;
                                console.log(reservationContent.selectedItemForDelete);
                                ajax
                                    .call(
                                        cmsServerConfig.configApiServerPath+"reservationCategory/delete",
                                        reservationContent.selectedItemForDelete,
                                        "POST"
                                    )
                                    .success(function (res) {
                                        reservationContent.categoryBusyIndicator.isActive = false;
                                        if (res.IsSuccess) {
                                            //reservationContent.replaceCategoryItem(reservationContent.treeConfig.Items, node.Id);
                                            console.log("Deleted Successfully !");
                                            reservationContent.gridOptions.advancedSearchData.engine.Filters = null;
                                            reservationContent.gridOptions.advancedSearchData.engine.Filters = [];
                                            reservationContent.gridOptions.fillData();
                                            reservationContent.gridOptions.reGetAll();
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
                                        reservationContent.categoryBusyIndicator.isActive = false;
                                    });
                            })
                            .error(function (data, errCode, c, d) {
                                rashaErManage.checkAction(data, errCode);
                                reservationContent.categoryBusyIndicator.isActive = false;
                            });
                    }
                }
            );
        };

        //Tree On Node Select Options
        reservationContent.treeConfig.onNodeSelect = function () {
            var node = reservationContent.treeConfig.currentNode;
            reservationContent.showGridComment = false;
            reservationContent.selectContent(node);
        };
        //Show Content with Category Id
        reservationContent.selectContent = function (node) {
            reservationContent.gridOptions.advancedSearchData.engine.Filters = null;
            reservationContent.gridOptions.advancedSearchData.engine.Filters = [];
            if (node != null && node != undefined) {
                reservationContent.contentBusyIndicator.message =
                    "در حال بارگذاری مقاله های  دسته " + node.Title;
                reservationContent.contentBusyIndicator.isActive = true;
                //reservationContent.gridOptions.advancedSearchData = {};
                
                reservationContent.attachedFiles = [];
                var s = {
                    PropertyName: "LinkCategoryId",
                    IntValue1: node.Id,
                    SearchType: 0
                };
                reservationContent.gridOptions.advancedSearchData.engine.Filters.push(s);
            }
            ajax
                .call(
                    cmsServerConfig.configApiServerPath+"reservationContent/getall",
                    reservationContent.gridOptions.advancedSearchData.engine,
                    "POST"
                )
                .success(function (response) {
                    rashaErManage.checkAction(response);
                    reservationContent.contentBusyIndicator.isActive = false;
                    reservationContent.ListItems = response.ListItems;
                    reservationContent.gridOptions.fillData(
                        reservationContent.ListItems,
                        response.resultAccess
                    ); // Sending Access as an argument
                    reservationContent.gridOptions.currentPageNumber =
                        response.CurrentPageNumber;
                    reservationContent.gridOptions.totalRowCount = response.TotalRowCount;
                    reservationContent.gridOptions.rowPerPage = response.RowPerPage;
                })
                .error(function (data, errCode, c, d) {
                    reservationContent.gridOptions.fillData();
                    rashaErManage.checkAction(data, errCode);
                });
        };
        // Open Add New Content Modal
        reservationContent.addNewContentModel = function () {
            if (buttonIsPressed) {
                return;
            }
            var node = reservationContent.treeConfig.currentNode;
            if (node.Id == 0 || !node.Id) {
                rashaErManage.showMessage($filter('translatentk')('To_Add_A_reservation_Please_Select_The_Category'));
                buttonIsPressed = false;
                return;
            }

            reservationContent.attachedFiles = [];
            reservationContent.attachedFile = "";
            reservationContent.filePickerMainImage.filename = "";
            reservationContent.filePickerMainImage.fileId = null;
            reservationContent.filePickerFilePodcast.filename = "";
            reservationContent.filePickerFilePodcast.fileId = null;
            reservationContent.filePickerFiles.filename = "";
            reservationContent.filePickerFiles.fileId = null;
            reservationContent.tags = []; //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
            reservationContent.kwords = []; //tagsInput خالی کردن آرایه کلمات کلیدی برای محتوای جدید
            reservationContent.addRequested = false;
            //reservationContent.modalTitle = ($filter('translatentk')('Add_Content'));
            buttonIsPressed = true;
            ajax
                .call(cmsServerConfig.configApiServerPath + "reservationContent/GetViewModel", "", "GET")
                .success(function (response) {
                    buttonIsPressed = false;
                    console.log(response);
                    rashaErManage.checkAction(response);
                    reservationContent.selectedItem = response.Item;
                    reservationContent.selectedItem.OtherInfos = [];
                    reservationContent.selectedItem.Similars = [];
                    reservationContent.selectedItem.LinkCategoryId = node.Id;
                    reservationContent.selectedItem.LinkFileIds = null;
                    reservationContent.clearPreviousData();
                    $modal.open({
                        templateUrl: "cpanelv1/Modulereservation/reservationContent/add.html",
                        scope: $scope
                    });
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
        };
        //#help similar & otherinfo
        reservationContent.clearPreviousData = function () {
            reservationContent.selectedItem.Similars = [];
            $("#to").empty();
        };


        reservationContent.moveSelected = function (from, to, calculatePrice) {
            if (from == "Content") {
                //var title = reservationContent.ItemListIdSelector.selectedItem.Title;
                // var optionSelectedPrice = reservationContent.ItemListIdSelector.selectedItem.Price;
                if (
                    reservationContent.selectedItem.LinkDestinationId != undefined &&
                    reservationContent.selectedItem.LinkDestinationId != null
                ) {
                    if (reservationContent.selectedItem.Similars == undefined)
                        reservationContent.selectedItem.Similars = [];
                    for (var i = 0; i < reservationContent.selectedItem.Similars.length; i++) {
                        if (
                            reservationContent.selectedItem.Similars[i].LinkDestinationId ==
                            reservationContent.selectedItem.LinkDestinationId
                        ) {
                            rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
                            return;
                        }
                    }
                    // if (reservationContent.selectedItem.Title == null || reservationContent.selectedItem.Title.length < 0)
                    //     reservationContent.selectedItem.Title = title;
                    reservationContent.selectedItem.Similars.push({
                        //Id: 0,
                        //Source: from,
                        LinkDestinationId: reservationContent.selectedItem.LinkDestinationId,
                        Destination: reservationContent.LinkDestinationIdSelector.selectedItem
                    });
                }
            }
        };
        reservationContent.moveSelectedOtherInfo = function (from, to, y) {


            if (reservationContent.selectedItem.OtherInfos == undefined)
                reservationContent.selectedItem.OtherInfos = [];
            for (var i = 0; i < reservationContent.selectedItem.OtherInfos.length; i++) {

                if (reservationContent.selectedItem.OtherInfos[i].Title == reservationContent.selectedItemOtherInfos.Title && reservationContent.selectedItem.OtherInfos[i].HtmlBody == reservationContent.selectedItemOtherInfos.HtmlBody && reservationContent.selectedItem.OtherInfos[i].Source == reservationContent.selectedItemOtherInfos.Source) {
                    rashaErManage.showMessage($filter('translatentk')('Information_Is_Duplicate'));
                    return;
                }

            }
            if (reservationContent.selectedItemOtherInfos.Title == "" && reservationContent.selectedItemOtherInfos.Source == "" && reservationContent.selectedItemOtherInfos.HtmlBody == "") {
                rashaErManage.showMessage($filter('translatentk')('fields_values_are_empty_please_enter_values'));
            }
            else {

                reservationContent.selectedItem.OtherInfos.push({
                    Title: reservationContent.selectedItemOtherInfos.Title,
                    HtmlBody: reservationContent.selectedItemOtherInfos.HtmlBody,
                    Source: reservationContent.selectedItemOtherInfos.Source
                });
                reservationContent.selectedItemOtherInfos.Title = "";
                reservationContent.selectedItemOtherInfos.Source = "";
                reservationContent.selectedItemOtherInfos.HtmlBody = "";
            }
            if (edititem) {
                edititem = false;
            }

        };

        reservationContent.removeFromCollection = function (listsimilar, iddestination) {
            for (var i = 0; i < reservationContent.selectedItem.Similars.length; i++) {
                if (listsimilar[i].LinkDestinationId == iddestination) {
                    reservationContent.selectedItem.Similars.splice(i, 1);
                    return;
                }

            }

        };
        reservationContent.removeFromOtherInfo = function (listOtherInfo, title, body, source) {
            for (var i = 0; i < reservationContent.selectedItem.OtherInfos.length; i++) {
                if (listOtherInfo[i].Title == title && listOtherInfo[i].HtmlBody == body && listOtherInfo[i].Source == source) {
                    reservationContent.selectedItem.OtherInfos.splice(i, 1);
                    return;
                }
            }
        };
        reservationContent.editOtherInfo = function (y) {
            edititem = true;
            reservationContent.selectedItemOtherInfos.Title = y.Title;
            reservationContent.selectedItemOtherInfos.HtmlBody = y.HtmlBody;
            reservationContent.selectedItemOtherInfos.Source = y.Source;
            reservationContent.removeFromOtherInfo(reservationContent.selectedItem.OtherInfos, y.Title, y.HtmlBody, y.Source);
        };


        //#help
        // Open Edit Content Modal
        reservationContent.openEditModel = function () {
            if (buttonIsPressed) {
                return;
            }
            reservationContent.attachedFiles = [];
            reservationContent.addRequested = false;
            //reservationContent.modalTitle = ($filter('translatentk')('Edit_Content'));
            if (!reservationContent.gridOptions.selectedRow.item) {
                rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
                return;
            }
            if (reservationContent.gridOptions.selectedRow.item.LinkSiteId != $rootScope.tokenInfo.Item.SiteId && !$rootScope.tokenInfo.Item.UserAccessAdminAllowToAllData) {
                rashaErManage.showMessage($filter('translatentk')('This_reservation_Is_Shared'));
                return;
            }
            buttonIsPressed = true;
            ajax
                .call(
                    cmsServerConfig.configApiServerPath+"reservationContent/GetOne",
                    reservationContent.gridOptions.selectedRow.item.Id,
                    "GET"
                )
                .success(function (response1) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response1);
                    reservationContent.selectedItem = response1.Item;
                    //reservationContent.selectedItem.Similars = [];
                    //reservationContent.setCollection("Content", response1.Item.Similars,response1.Item.Id);
                    reservationContent.startDate.defaultDate = reservationContent.selectedItem.FromDate;
                    reservationContent.endDate.defaultDate = reservationContent.selectedItem.ToDate;
                    reservationContent.filePickerMainImage.filename = null;
                    reservationContent.filePickerMainImage.fileId = null;
                    reservationContent.filePickerFilePodcast.filename = null;
                    reservationContent.filePickerFilePodcast.fileId = null;
                    if (response1.Item.LinkMainImageId != null) {
                        ajax
                            .call(
                                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                                response1.Item.LinkMainImageId,
                                "GET"
                            )
                            .success(function (response2) {
                                buttonIsPressed = false;
                                reservationContent.filePickerMainImage.filename =
                                    response2.Item.FileName;
                                reservationContent.filePickerMainImage.fileId = response2.Item.Id;
                            })
                            .error(function (data, errCode, c, d) {
                                rashaErManage.checkAction(data, errCode);
                            });
                    }
                    if (response1.Item.LinkFilePodcastId != null) {
                        ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', response1.Item.LinkFilePodcastId, 'GET').success(function (response2) {
                            reservationContent.filePickerFilePodcast.filename = response2.Item.FileName;
                            reservationContent.filePickerFilePodcast.fileId = response2.Item.Id
                        }).error(function (data, errCode, c, d) {
                            rashaErManage.checkAction(data, errCode);
                        });
                    }
                    reservationContent.parseFileIds(response1.Item.LinkFileIds);
                    reservationContent.filePickerFiles.filename = null;
                    reservationContent.filePickerFiles.fileId = null;
                    //Load tagsInput
                    reservationContent.tags = []; //Clear out previous tags
                    if (reservationContent.selectedItem.ContentTags == null)
                        reservationContent.selectedItem.ContentTags = [];
                    $.each(reservationContent.selectedItem.ContentTags, function (index, item) {
                        if (item.ModuleTag != null)
                            reservationContent.tags.push({
                                id: item.ModuleTag.Id,
                                text: item.ModuleTag.Title
                            }); //Add current content's tag to tags array with id and title
                    });
                    //Load Keywords tagsInput
                    reservationContent.kwords = []; //Clear out previous tags
                    var arraykwords = [];
                    if (
                        reservationContent.selectedItem.Keyword != null &&
                        reservationContent.selectedItem.Keyword != ""
                    )
                        arraykwords = reservationContent.selectedItem.Keyword.split(",");
                    $.each(arraykwords, function (index, item) {
                        if (item != null) reservationContent.kwords.push({ text: item }); //Add current content's tag to tags array with id and title
                    });
                    $modal.open({
                        templateUrl: "cpanelv1/Modulereservation/reservationContent/edit.html",
                        scope: $scope
                    });
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
        };



        // Add New Content
        reservationContent.addNewContent = function (frm) {
            if (frm.$invalid) return;
            reservationContent.categoryBusyIndicator.isActive = true;
            reservationContent.addRequested = true;

            //Save attached file ids into reservationContent.selectedItem.LinkFileIds
            reservationContent.selectedItem.LinkFileIds = "";
            reservationContent.stringfyLinkFileIds();
            //Save Keywords
            $.each(reservationContent.kwords, function (index, item) {
                if (index == 0) reservationContent.selectedItem.Keyword = item.text;
                else reservationContent.selectedItem.Keyword += "," + item.text;
            });
            if (
                reservationContent.selectedItem.LinkCategoryId == null ||
                reservationContent.selectedItem.LinkCategoryId == 0
            ) {
                rashaErManage.showMessage($filter('translatentk')('To_Add_A_reservation_Please_Select_The_Category'));
                return;
            }
            //jQuery.extend(true, {}, reservationContent.selectedItem );
            var apiSelectedItem = reservationContent.selectedItem;
            if (apiSelectedItem.Similars)
                $.each(apiSelectedItem.Similars, function (index, item) {
                    item.Destination = [];
                });
            ajax
                .call(cmsServerConfig.configApiServerPath + "reservationContent/add", apiSelectedItem, "POST")
                .success(function (response) {
                    rashaErManage.checkAction(response);
                    reservationContent.categoryBusyIndicator.isActive = false;
                    if (response.IsSuccess) {
                        reservationContent.selectedItem.LinkSourceId = reservationContent.selectedItem.Id;

                        reservationContent.ListItems.unshift(response.Item);
                        reservationContent.gridOptions.fillData(reservationContent.ListItems);
                        reservationContent.closeModal();
                        //Save inputTags
                        reservationContent.selectedItem.ContentTags = [];
                        $.each(reservationContent.tags, function (index, item) {
                            if (item.id > 0) {
                                var newObject = $.extend({}, reservationContent.ModuleContentTag);
                                newObject.LinkTagId = item.id;
                                newObject.LinkContentId = response.Item.Id;
                                reservationContent.selectedItem.ContentTags.push(newObject);
                            }
                        });
                        ajax
                            .call(
                                cmsServerConfig.configApiServerPath+"reservationContentTag/addbatch",
                                reservationContent.selectedItem.ContentTags,
                                "POST"
                            )
                            .success(function (response) {
                                console.log(response);
                            })
                            .error(function (data, errCode, c, d) {
                                rashaErManage.checkAction(data, errCode);
                            });
                    }
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    reservationContent.addRequested = false;
                    reservationContent.categoryBusyIndicator.isActive = false;
                });
        };

        //Edit Content
        reservationContent.editContent = function (frm) {
            if (frm.$invalid) return;
            reservationContent.categoryBusyIndicator.isActive = true;
            reservationContent.addRequested = true;
            //Save attached file ids into reservationContent.selectedItem.LinkFileIds
            reservationContent.selectedItem.LinkFileIds = "";
            reservationContent.stringfyLinkFileIds();
            //Save Keywords
            $.each(reservationContent.kwords, function (index, item) {
                if (index == 0) reservationContent.selectedItem.Keyword = item.text;
                else reservationContent.selectedItem.Keyword += "," + item.text;
            });
            //Save inputTags
            reservationContent.selectedItem.ContentTags = [];
            $.each(reservationContent.tags, function (index, item) {
                if (item.id > 0) {
                    var newObject = $.extend({}, reservationContent.ModuleContentTag);
                    newObject.LinkTagId = item.id;
                    newObject.LinkContentId = reservationContent.selectedItem.Id;
                    reservationContent.selectedItem.ContentTags.push(newObject);
                }
            });
            if (
                reservationContent.selectedItem.LinkCategoryId == null ||
                reservationContent.selectedItem.LinkCategoryId == 0
            ) {
                rashaErManage.showMessage($filter('translatentk')('To_Add_A_reservation_Please_Select_The_Category'));
                return;
            }

            var apiSelectedItem = reservationContent.selectedItem;
            if (apiSelectedItem.Similars)
                $.each(apiSelectedItem.Similars, function (index, item) {
                    item.Destination = [];
                });
            ajax
                .call(cmsServerConfig.configApiServerPath + "reservationContent/edit", apiSelectedItem, "PUT")
                .success(function (response) {
                    reservationContent.categoryBusyIndicator.isActive = false;
                    reservationContent.addRequested = false;
                    reservationContent.treeConfig.showbusy = false;
                    reservationContent.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    if (response.IsSuccess) {
                        reservationContent.replaceItem(reservationContent.selectedItem.Id, response.Item);
                        reservationContent.gridOptions.fillData(reservationContent.ListItems);
                        reservationContent.closeModal();
                    }
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    reservationContent.addRequested = false;
                    reservationContent.categoryBusyIndicator.isActive = false;
                });
        };
        // Delete a reservation Content
        reservationContent.deleteContent = function () {
            if (buttonIsPressed) {
                return;
            }
            if (!reservationContent.gridOptions.selectedRow.item) {
                rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
                //rashaErManage.showMessage($filter('translatentk')('Tag'));
                return;
            }
            reservationContent.treeConfig.showbusy = true;
            reservationContent.showIsBusy = true;
            rashaErManage.showYesNo(
                ($filter('translatentk')('warning')),
                ($filter('translatentk')('do_you_want_to_delete_this_attribute')),
                function (isConfirmed) {
                    if (isConfirmed) {
                        reservationContent.categoryBusyIndicator.isActive = true;
                        console.log(reservationContent.gridOptions.selectedRow.item);
                        reservationContent.showbusy = true;
                        reservationContent.showIsBusy = true;
                        buttonIsPressed = true;
                        ajax
                            .call(
                                cmsServerConfig.configApiServerPath+"reservationContent/GetOne",
                                reservationContent.gridOptions.selectedRow.item.Id,
                                "GET"
                            )
                            .success(function (response) {
                                buttonIsPressed = false;
                                reservationContent.showbusy = false;
                                reservationContent.showIsBusy = false;
                                rashaErManage.checkAction(response);
                                reservationContent.selectedItemForDelete = response.Item;
                                console.log(reservationContent.selectedItemForDelete);
                                ajax
                                    .call(
                                        cmsServerConfig.configApiServerPath+"reservationContent/delete",
                                        reservationContent.selectedItemForDelete,
                                        "POST"
                                    )
                                    .success(function (res) {
                                        reservationContent.categoryBusyIndicator.isActive = false;
                                        reservationContent.treeConfig.showbusy = false;
                                        reservationContent.showIsBusy = false;
                                        rashaErManage.checkAction(res);
                                        if (res.IsSuccess) {
                                            reservationContent.replaceItem(
                                                reservationContent.selectedItemForDelete.Id
                                            );
                                            reservationContent.gridOptions.fillData(reservationContent.ListItems);
                                        }
                                    })
                                    .error(function (data2, errCode2, c2, d2) {
                                        rashaErManage.checkAction(data2);
                                        reservationContent.treeConfig.showbusy = false;
                                        reservationContent.showIsBusy = false;
                                        reservationContent.categoryBusyIndicator.isActive = false;
                                    });
                            })
                            .error(function (data, errCode, c, d) {
                                rashaErManage.checkAction(data, errCode);
                                reservationContent.treeConfig.showbusy = false;
                                reservationContent.showIsBusy = false;
                                reservationContent.categoryBusyIndicator.isActive = false;
                            });
                    }
                }
            );
        };

        //Confirm/UnConfirm reservation Content
        reservationContent.confirmUnConfirmreservationContent = function () {
            if (!reservationContent.gridOptions.selectedRow.item) {
                rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
                return;
            }
            ajax
                .call(
                    cmsServerConfig.configApiServerPath+"reservationContent/GetOne",
                    reservationContent.gridOptions.selectedRow.item.Id,
                    "GET"
                )
                .success(function (response) {
                    rashaErManage.checkAction(response);
                    reservationContent.selectedItem = response.Item;
                    reservationContent.selectedItem.IsAccepted = response.Item.IsAccepted == true
                        ? false
                        : true;
                    ajax
                        .call(cmsServerConfig.configApiServerPath + "reservationContent/edit", reservationContent.selectedItem, "PUT")
                        .success(function (response2) {
                            rashaErManage.checkAction(response2);
                            if (response2.IsSuccess) {
                                var index = reservationContent.ListItems.indexOf(
                                    reservationContent.gridOptions.selectedRow.item
                                );
                                if (index !== -1) {
                                    reservationContent.ListItems[index] = response2.Item;
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
        reservationContent.enableArchive = function () {
            if (!reservationContent.gridOptions.selectedRow.item) {
                rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
                return;
            }

            ajax
                .call(
                    cmsServerConfig.configApiServerPath+"reservationContent/GetOne",
                    reservationContent.gridOptions.selectedRow.item.Id,
                    "GET"
                )
                .success(function (response) {
                    rashaErManage.checkAction(response);
                    reservationContent.selectedItem = response.Item;
                    reservationContent.selectedItem.IsArchive = response.Item.IsArchive == true
                        ? false
                        : true;
                    ajax
                        .call(cmsServerConfig.configApiServerPath + "reservationContent/edit", reservationContent.selectedItem, "PUT")
                        .success(function (response2) {
                            reservationContent.categoryBusyIndicator.isActive = true;
                            rashaErManage.checkAction(response2);
                            if (response2.IsSuccess) {
                                var index = reservationContent.ListItems.indexOf(
                                    reservationContent.gridOptions.selectedRow.item
                                );
                                if (index !== -1) {
                                    reservationContent.ListItems[index] = response2.Item;
                                }
                                console.log("Arshived Succsseffully");
                                reservationContent.categoryBusyIndicator.isActive = false;
                            }
                        })
                        .error(function (data, errCode, c, d) {
                            rashaErManage.checkAction(data, errCode);
                            reservationContent.categoryBusyIndicator.isActive = false;
                        });
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    reservationContent.categoryBusyIndicator.isActive = false;
                });
        };

        //Replace Item OnDelete/OnEdit Grid Options
        reservationContent.replaceItem = function (oldId, newItem) {
            angular.forEach(reservationContent.ListItems, function (item, key) {
                if (item.Id == oldId) {
                    var index = reservationContent.ListItems.indexOf(item);
                    reservationContent.ListItems.splice(index, 1);
                }
            });
            if (newItem) reservationContent.ListItems.unshift(newItem);
        };

        reservationContent.summernoteOptions = {
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
                ['insert',['ltr','rtl']],
                ["insert", ["link", "picture", "video", "hr"]],
                ["view", ["fullscreen", "codeview"]],
                ["help", ["help"]]
            ]
        };

        //reservationContent.summernoteText = '<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />';

        reservationContent.searchData = function () {
            reservationContent.categoryBusyIndicator.isActive = true;
            ajax
                .call(
                    cmsServerConfig.configApiServerPath+"reservationContent/getall",
                    reservationContent.gridOptions.advancedSearchData.engine,
                    "POST"
                )
                .success(function (response) {
                    rashaErManage.checkAction(response);
                    reservationContent.categoryBusyIndicator.isActive = false;
                    reservationContent.ListItems = response.ListItems;
                    reservationContent.gridOptions.fillData(reservationContent.ListItems);
                    reservationContent.gridOptions.currentPageNumber =
                        response.CurrentPageNumber;
                    reservationContent.gridOptions.totalRowCount = response.TotalRowCount;
                    reservationContent.gridOptions.rowPerPage = response.RowPerPage;
                    reservationContent.allowedSearch = response.AllowedSearchField;
                })
                .error(function (data, errCode, c, d) {
                    reservationContent.gridOptions.fillData();
                    rashaErManage.checkAction(data, errCode);
                });
        };

        //Close Model Stack
        reservationContent.addRequested = false;
        reservationContent.closeModal = function () {
            $modalStack.dismissAll();
        };

        reservationContent.showIsBusy = false;

        //Aprove a comment
        reservationContent.confirmComment = function (item) {
            console.log("This comment will be confirmed:", item);
        };

        //Decline a comment
        reservationContent.doNotConfirmComment = function (item) {
            console.log("This comment will not be confirmed:", item);
        };
        //Remove a comment
        reservationContent.deleteComment = function (item) {
            if (!reservationContent.gridContentOptions.selectedRow.item) {
                rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
                return;
            }
            reservationContent.treeConfig.showbusy = true;
            reservationContent.showIsBusy = true;
            rashaErManage.showYesNo(
                ($filter('translatentk')('warning')),
                "آیا می خواهید این نظر را حذف کنید",
                function (isConfirmed) {
                    if (isConfirmed) {
                        console.log(
                            "Item to be deleted: ",
                            reservationContent.gridOptions.selectedRow.item
                        );
                        reservationContent.showbusy = true;
                        reservationContent.showIsBusy = true;
                        ajax
                            .call(
                                cmsServerConfig.configApiServerPath+"reservationContent/GetOne",
                                reservationContent.gridOptions.selectedRow.item.Id,
                                "GET"
                            )
                            .success(function (response) {
                                reservationContent.showbusy = false;
                                reservationContent.showIsBusy = false;
                                rashaErManage.checkAction(response);
                                reservationContent.selectedItemForDelete = response.Item;
                                console.log(reservationContent.selectedItemForDelete);
                                ajax
                                    .call(
                                        cmsServerConfig.configApiServerPath+"reservationContent/delete",
                                        reservationContent.selectedItemForDelete,
                                        "POST"
                                    )
                                    .success(function (res) {
                                        reservationContent.treeConfig.showbusy = false;
                                        reservationContent.showIsBusy = false;
                                        rashaErManage.checkAction(res);
                                        if (res.IsSuccess) {
                                            reservationContent.replaceItem(
                                                reservationContent.selectedItemForDelete.Id
                                            );
                                            reservationContent.gridOptions.fillData(reservationContent.ListItems);
                                        }
                                    })
                                    .error(function (data2, errCode2, c2, d2) {
                                        rashaErManage.checkAction(data2);
                                        reservationContent.treeConfig.showbusy = false;
                                        reservationContent.showIsBusy = false;
                                    });
                            })
                            .error(function (data, errCode, c, d) {
                                rashaErManage.checkAction(data, errCode);
                                reservationContent.treeConfig.showbusy = false;
                                reservationContent.showIsBusy = false;
                            });
                    }
                }
            );
        };

        //For reInit Categories
        reservationContent.gridOptions.reGetAll = function () {
            if (reservationContent.gridOptions.advancedSearchData.engine.Filters.length > 0)
                reservationContent.searchData();
            else reservationContent.init();
        };

        reservationContent.isCurrentNodeEmpty = function () {
            return !angular.equals({}, reservationContent.treeConfig.currentNode);
        };

        reservationContent.loadFileAndFolder = function (item) {
            reservationContent.treeConfig.currentNode = item;
            console.log(item);
            reservationContent.treeConfig.onNodeSelect(item);
        };

        reservationContent.openDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $timeout(function () {
                reservationContent.focus = true;
            });
        };
        reservationContent.openDate1 = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $timeout(function () {
                reservationContent.focus1 = true;
            });
        };

        reservationContent.columnCheckbox = false;
        reservationContent.openGridConfigModal = function () {
            $("#gridView-btn").toggleClass("active");
            var prechangeColumns = reservationContent.gridOptions.columns;
            if (reservationContent.gridOptions.columnCheckbox) {
                for (var i = 0; i < reservationContent.gridOptions.columns.length; i++) {
                    //reservationContent.gridOptions.columns[i].visible = $("#" + reservationContent.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                    var element = $(
                        "#" +
                        reservationContent.gridOptions.columns[i].name.replace(".", "") +
                        "Checkbox"
                    );
                    var temp = element[0].checked;
                    reservationContent.gridOptions.columns[i].visible = temp;
                }
            } else {
                for (var i = 0; i < reservationContent.gridOptions.columns.length; i++) {
                    var element = $(
                        "#" +
                        reservationContent.gridOptions.columns[i].name.replace(".", "") +
                        "Checkbox"
                    );
                    $(
                        "#" + reservationContent.gridOptions.columns[i].name + "Checkbox"
                    ).checked =
                        prechangeColumns[i].visible;
                }
            }
            for (var i = 0; i < reservationContent.gridOptions.columns.length; i++) {
                console.log(
                    reservationContent.gridOptions.columns[i].name.concat(".visible: "),
                    reservationContent.gridOptions.columns[i].visible
                );
            }
            reservationContent.gridOptions.columnCheckbox = !reservationContent.gridOptions
                .columnCheckbox;
        };

        reservationContent.deleteAttachedFile = function (index) {
            reservationContent.attachedFiles.splice(index, 1);
        };

        reservationContent.addAttachedFile = function (id) {
            var fname = $("#file" + id).text();
            if (
                id != null &&
                id != undefined &&
                !reservationContent.alreadyExist(id, reservationContent.attachedFiles) &&
                fname != null &&
                fname != ""
            ) {
                var fId = id;
                var file = { id: fId, name: fname };
                reservationContent.attachedFiles.push(file);
                if (document.getElementsByName("file" + id).length > 1)
                    document.getElementsByName("file" + id)[1].textContent = "";
                else document.getElementsByName("file" + id)[0].textContent = "";
            }
        };

        reservationContent.alreadyExist = function (id, array) {
            for (var i = 0; i < array.length; i++) {
                if (id == array[i].fileId) {
                    rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                    return true;
                }
            }
            return false;
        };

        reservationContent.filePickerMainImage.removeSelectedfile = function (config) {
            reservationContent.filePickerMainImage.fileId = null;
            reservationContent.filePickerMainImage.filename = null;
            reservationContent.selectedItem.LinkMainImageId = null;
        };
        reservationContent.filePickerFilePodcast.removeSelectedfile = function (config) {
            reservationContent.filePickerFilePodcast.fileId = null;
            reservationContent.filePickerFilePodcast.filename = null;
            reservationContent.selectedItem.LinkFilePodcastId = null;

        }
        reservationContent.filePickerFiles.removeSelectedfile = function (config) {
            reservationContent.filePickerFiles.fileId = null;
            reservationContent.filePickerFiles.filename = null;
        };

        reservationContent.showUpload = function () {
            $("#fastUpload").fadeToggle();
        };

        // ----------- FilePicker Codes --------------------------------
        reservationContent.addAttachedFile = function (id) {
            var fname = $("#file" + id).text();
            if (fname == "") {
                rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
                return;
            }
            if (
                id != null &&
                id != undefined &&
                !reservationContent.alreadyExist(id, reservationContent.attachedFiles)
            ) {
                var fId = id;
                var file = { fileId: fId, filename: fname };
                reservationContent.attachedFiles.push(file);
                reservationContent.clearfilePickers();
            }
        };

        reservationContent.alreadyExist = function (fieldId, array) {
            for (var i = 0; i < array.length; i++) {
                if (fieldId == array[i].fileId) {
                    rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                    reservationContent.clearfilePickers();
                    return true;
                }
            }
            return false;
        };

        reservationContent.deleteAttachedfieldName = function (index) {
            ajax
                .call(
                    cmsServerConfig.configApiServerPath+"reservationContent/delete",
                    reservationContent.contractsList[index],
                    "POST"
                )
                .success(function (res) {
                    rashaErManage.checkAction(res);
                    if (res.IsSuccess) {
                        reservationContent.contractsList.splice(index, 1);
                        rashaErManage.showMessage($filter('translatentk')('Removed_Successfully'));
                    }
                })
                .error(function (data2, errCode2, c2, d2) {
                    rashaErManage.checkAction(data2);
                });
        };

        reservationContent.parseFileIds = function (stringOfIds) {
            if (stringOfIds == null || !stringOfIds.trim()) return;
            var fileIds = stringOfIds.split(",");
            if (fileIds.length != undefined) {
                $.each(fileIds, function (index, item) {
                    if (item == parseInt(item, 10)) {
                        // Check if item is an integer
                        ajax
                            .call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", parseInt(item), "GET")
                            .success(function (response) {
                                if (response.IsSuccess) {
                                    reservationContent.attachedFiles.push({
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

        reservationContent.clearfilePickers = function () {
            reservationContent.filePickerFiles.fileId = null;
            reservationContent.filePickerFiles.filename = null;
        };

        reservationContent.stringfyLinkFileIds = function () {
            $.each(reservationContent.attachedFiles, function (i, item) {
                if (reservationContent.selectedItem.LinkFileIds == "")
                    reservationContent.selectedItem.LinkFileIds = item.fileId;
                else reservationContent.selectedItem.LinkFileIds += "," + item.fileId;
            });
        };
        //--------- End FilePickers Codes -------------------------

        //---------------Upload Modal-------------------------------
        reservationContent.openUploadModal = function () {
            $modal.open({
                templateUrl: "cpanelv1/Modulereservation/reservationContent/upload_modal.html",
                size: "lg",
                scope: $scope
            });

            reservationContent.FileList = [];
            //get list of file from category id
            ajax
                .call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", null, "POST")
                .success(function (response) {
                    reservationContent.FileList = response.ListItems;
                })
                .error(function (data) {
                    console.log(data);
                });
        };
        //---------------Upload Modal Podcast-------------------------------
        reservationContent.openUploadModalPodcast = function () {
            $modal.open({
                templateUrl: 'cpanelv1/Modulereservation/reservationContent/upload_modalPodcast.html',
                size: 'lg',
                scope: $scope
            });

            reservationContent.FileList = [];
            //get list of file from category id
            ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
                reservationContent.FileList = response.ListItems;
            }).error(function (data) {
                console.log(data);
            });

        }

        reservationContent.calcuteProgress = function (progress) {
            wdth = Math.floor(progress * 100);
            return wdth;
        };

        reservationContent.whatcolor = function (progress) {
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

        reservationContent.canShow = function (pr) {
            if (pr == 1) {
                return true;
            }
            return false;
        };
        // File Manager actions
        reservationContent.replaceFile = function (name) {
            reservationContent.itemClicked(null, reservationContent.fileIdToDelete, "file");
            reservationContent.fileTypes = 1;
            reservationContent.fileIdToDelete = reservationContent.selectedIndex;

            // Delete the file
            ajax
                .call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", reservationContent.fileIdToDelete, "GET")
                .success(function (response1) {
                    if (response1.IsSuccess == true) {
                        console.log(response1.Item);
                        ajax
                            .call(cmsServerConfig.configApiServerPath + "FileContent/delete", response1.Item, "POST")
                            .success(function (response2) {
                                reservationContent.remove(
                                    reservationContent.FileList,
                                    reservationContent.fileIdToDelete
                                );
                                if (response2.IsSuccess == true) {
                                    // Save New file
                                    ajax
                                        .call(cmsServerConfig.configApiServerPath + "FileContent/GetViewModel", "", "GET")
                                        .success(function (response3) {
                                            if (response3.IsSuccess == true) {
                                                reservationContent.FileItem = response3.Item;
                                                reservationContent.FileItem.FileName = name;
                                                reservationContent.FileItem.Extension = name.split(".").pop();
                                                reservationContent.FileItem.FileSrc = name;
                                                reservationContent.FileItem.LinkCategoryId =
                                                    reservationContent.thisCategory;
                                                reservationContent.saveNewFile();
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
        reservationContent.saveNewFile = function () {
            ajax
                .call(cmsServerConfig.configApiServerPath + "FileContent/add", reservationContent.FileItem, "POST")
                .success(function (response) {
                    if (response.IsSuccess) {
                        reservationContent.FileItem = response.Item;
                        reservationContent.showSuccessIcon();
                        return 1;
                    } else {
                        return 0;
                    }
                })
                .error(function (data) {
                    reservationContent.showErrorIcon();
                    return -1;
                });
        };

        reservationContent.showSuccessIcon = function () { };

        reservationContent.showErrorIcon = function () { };
        //file is exist
        reservationContent.fileIsExist = function (fileName) {
            for (var i = 0; i < reservationContent.FileList.length; i++) {
                if (reservationContent.FileList[i].FileName == fileName) {
                    reservationContent.fileIdToDelete = reservationContent.FileList[i].Id;
                    return true;
                }
            }
            return false;
        };

        reservationContent.getFileItem = function (id) {
            for (var i = 0; i < reservationContent.FileList.length; i++) {
                if (reservationContent.FileList[i].Id == id) {
                    return reservationContent.FileList[i];
                }
            }
        };

        //select file or folder
        reservationContent.itemClicked = function ($event, index, type) {
            if (type == "file" || type == 1) {
                reservationContent.fileTypes = 1;
                reservationContent.selectedFileId = reservationContent.getFileItem(index).Id;
                reservationContent.selectedFileName = reservationContent.getFileItem(index).FileName;
            } else {
                reservationContent.fileTypes = 2;
                reservationContent.selectedCategoryId = reservationContent.getCategoryName(index).Id;
                reservationContent.selectedCategoryTitle = reservationContent.getCategoryName(
                    index
                ).Title;
            }
            reservationContent.selectedIndex = index;
        };

        reservationContent.toggleCategoryButtons = function () {
            $("#categoryButtons").fadeToggle();
        };
        //upload file Podcast
        reservationContent.uploadFilePodcast = function (index, uploadFile) {
            if ($("#save-icon" + index).hasClass("fa-save")) {
                if (reservationContent.fileIsExist(uploadFile.name)) { // File already exists
                    if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                        //------------ reservationContent.replaceFile(uploadFile.name);
                        reservationContent.itemClicked(null, reservationContent.fileIdToDelete, "file");
                        reservationContent.fileTypes = 1;
                        reservationContent.fileIdToDelete = reservationContent.selectedIndex;
                        // replace the file
                        ajax
                            .call(
                                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                                reservationContent.fileIdToDelete,
                                "GET"
                            )
                            .success(function (response1) {
                                if (response1.IsSuccess == true) {
                                    console.log(response1.Item);
                                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                                        .success(function (response2) {
                                            if (response2.IsSuccess == true) {
                                                reservationContent.FileItem = response2.Item;
                                                reservationContent.showSuccessIcon();
                                                $("#save-icon" + index).removeClass("fa-save");
                                                $("#save-button" + index).removeClass(
                                                    "flashing-button"
                                                );
                                                $("#save-icon" + index).addClass("fa-check");
                                                reservationContent.filePickerFilePodcast.filename =
                                                    reservationContent.FileItem.FileName;
                                                reservationContent.filePickerFilePodcast.fileId =
                                                    response2.Item.Id;
                                                reservationContent.selectedItem.LinkFilePodcastId =
                                                    reservationContent.filePickerFilePodcast.fileId;
                                            } else {
                                                $("#save-icon" + index).removeClass("fa-save");
                                                $("#save-button" + index).removeClass(
                                                    "flashing-button"
                                                );
                                                $("#save-icon" + index).addClass("fa-remove");
                                            }
                                        })
                                        .error(function (data) {
                                            reservationContent.showErrorIcon();
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
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response) {
                        reservationContent.FileItem = response.Item;
                        reservationContent.FileItem.FileName = uploadFile.name;
                        reservationContent.FileItem.uploadName = uploadFile.uploadName;
                        reservationContent.FileItem.Extension = uploadFile.name.split('.').pop();
                        reservationContent.FileItem.FileSrc = uploadFile.name;
                        reservationContent.FileItem.LinkCategoryId = null;  //Save the new file in the root
                        // ------- reservationContent.saveNewFile()  ----------------------
                        var result = 0;
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", reservationContent.FileItem, 'POST').success(function (response) {
                            if (response.IsSuccess) {
                                reservationContent.FileItem = response.Item;
                                reservationContent.showSuccessIcon();
                                $("#save-icon" + index).removeClass("fa-save");
                                $("#save-button" + index).removeClass("flashing-button");
                                $("#save-icon" + index).addClass("fa-check");
                                reservationContent.filePickerFilePodcast.filename = reservationContent.FileItem.FileName;
                                reservationContent.filePickerFilePodcast.fileId = response.Item.Id;
                                reservationContent.selectedItem.LinkFilePodcastId = reservationContent.filePickerFilePodcast.fileId

                            }
                            else {
                                $("#save-icon" + index).removeClass("fa-save");
                                $("#save-button" + index).removeClass("flashing-button");
                                $("#save-icon" + index).addClass("fa-remove");
                            }
                        }).error(function (data) {
                            reservationContent.showErrorIcon();
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
        reservationContent.uploadFile = function (index, uploadFile) {
            if ($("#save-icon" + index).hasClass("fa-save")) {
                if (reservationContent.fileIsExist(uploadFile.name)) {
                    // File already exists
                    if (
                        confirm(
                            'File "' +
                            uploadFile.name +
                            '" already exists! Do you want to replace the new file?'
                        )
                    ) {
                        //------------ reservationContent.replaceFile(uploadFile.name);
                        reservationContent.itemClicked(null, reservationContent.fileIdToDelete, "file");
                        reservationContent.fileTypes = 1;
                        reservationContent.fileIdToDelete = reservationContent.selectedIndex;
                        // replace the file
                        ajax
                            .call(
                                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                                reservationContent.fileIdToDelete,
                                "GET"
                            )
                            .success(function (response1) {
                                if (response1.IsSuccess == true) {
                                    console.log(response1.Item);
                                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                                        .success(function (response2) {
                                            if (response2.IsSuccess == true) {
                                                reservationContent.FileItem = response2.Item;
                                                reservationContent.showSuccessIcon();
                                                $("#save-icon" + index).removeClass("fa-save");
                                                $("#save-button" + index).removeClass(
                                                    "flashing-button"
                                                );
                                                $("#save-icon" + index).addClass("fa-check");
                                                reservationContent.filePickerMainImage.filename =
                                                    reservationContent.FileItem.FileName;
                                                reservationContent.filePickerMainImage.fileId =
                                                    response2.Item.Id;
                                                reservationContent.selectedItem.LinkMainImageId =
                                                    reservationContent.filePickerMainImage.fileId;
                                            } else {
                                                $("#save-icon" + index).removeClass("fa-save");
                                                $("#save-button" + index).removeClass(
                                                    "flashing-button"
                                                );
                                                $("#save-icon" + index).addClass("fa-remove");
                                            }
                                        })
                                        .error(function (data) {
                                            reservationContent.showErrorIcon();
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
                        .call(cmsServerConfig.configApiServerPath + "FileContent/GetViewModel", "", "GET")
                        .success(function (response) {
                            reservationContent.FileItem = response.Item;
                            reservationContent.FileItem.FileName = uploadFile.name;
                            reservationContent.FileItem.uploadName = uploadFile.uploadName;
                            reservationContent.FileItem.Extension = uploadFile.name.split(".").pop();
                            reservationContent.FileItem.FileSrc = uploadFile.name;
                            reservationContent.FileItem.LinkCategoryId = null; //Save the new file in the root
                            // ------- reservationContent.saveNewFile()  ----------------------
                            var result = 0;
                            ajax
                                .call(cmsServerConfig.configApiServerPath + "FileContent/add", reservationContent.FileItem, "POST")
                                .success(function (response) {
                                    if (response.IsSuccess) {
                                        reservationContent.FileItem = response.Item;
                                        reservationContent.showSuccessIcon();
                                        $("#save-icon" + index).removeClass("fa-save");
                                        $("#save-button" + index).removeClass("flashing-button");
                                        $("#save-icon" + index).addClass("fa-check");
                                        reservationContent.filePickerMainImage.filename =
                                            reservationContent.FileItem.FileName;
                                        reservationContent.filePickerMainImage.fileId = response.Item.Id;
                                        reservationContent.selectedItem.LinkMainImageId =
                                            reservationContent.filePickerMainImage.fileId;
                                    } else {
                                        $("#save-icon" + index).removeClass("fa-save");
                                        $("#save-button" + index).removeClass("flashing-button");
                                        $("#save-icon" + index).addClass("fa-remove");
                                    }
                                })
                                .error(function (data) {
                                    reservationContent.showErrorIcon();
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
        reservationContent.exportFile = function () {
            reservationContent.addRequested = true;
            reservationContent.gridOptions.advancedSearchData.engine.ExportFile =
                reservationContent.ExportFileClass;
            ajax
                .call(
                    cmsServerConfig.configApiServerPath+"reservationContent/exportfile",
                    reservationContent.gridOptions.advancedSearchData.engine,
                    "POST"
                )
                .success(function (response) {
                    reservationContent.addRequested = false;
                    rashaErManage.checkAction(response);
                    if (response.IsSuccess) {
                        reservationContent.exportDownloadLink =
                            window.location.origin + response.LinkFile;
                        $window.open(response.LinkFile, "_blank");
                        //reservationContent.closeModal();
                    }
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
        };
        //Open Export Report Modal
        reservationContent.toggleExportForm = function () {
            reservationContent.SortType = [
                { key: "نزولی", value: 0 },
                { key: "صعودی", value: 1 },
                { key: "تصادفی", value: 3 }
            ];
            reservationContent.EnumExportFileType = [
                { key: "Excel", value: 1 },
                { key: "PDF", value: 2 },
                { key: "Text", value: 3 }
            ];
            reservationContent.EnumExportReceiveMethod = [
                { key: "دانلود", value: 0 },
                { key: "ایمیل", value: 1 },
                { key: "فایل منیجر", value: 3 }
            ];
            reservationContent.ExportFileClass = {
                FileType: 1,
                RecieveMethod: 0,
                RowCount: 100
            };
            reservationContent.exportDownloadLink = null;
            $modal.open({
                templateUrl: "cpanelv1/Modulereservation/reservationContent/report.html",
                scope: $scope
            });
        };
        //Row Count Export Input Change
        reservationContent.rowCountChanged = function () {
            if (
                !angular.isDefined(reservationContent.ExportFileClass.RowCount) ||
                reservationContent.ExportFileClass.RowCount > 5000
            )
                reservationContent.ExportFileClass.RowCount = 5000;
        };
        //Get TotalRowCount
        reservationContent.getCount = function () {
            ajax.call(cmsServerConfig.configApiServerPath+"reservationContent/count", reservationContent.gridOptions.advancedSearchData.engine, "POST")
                .success(function (response) {
                    reservationContent.addRequested = false;
                    rashaErManage.checkAction(response);
                    reservationContent.ListItemsTotalRowCount = ": " + response.TotalRowCount;
                })
                .error(function (data, errCode, c, d) {
                    reservationContent.gridOptions.fillData();
                    rashaErManage.checkAction(data, errCode);
                });
        };

        reservationContent.showCategoryImage = function (mainImageId) {
            if (mainImageId == 0 || mainImageId == null) return;
            ajax
                .call(cmsServerConfig.configApiServerPath + "FileContent/PreviewImage", { id: mainImageId, name: "" }, "POST")
                .success(function (response) {
                    reservationContent.selectedItem.MainImageSrc = response;
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
        };

        //TreeControl
        reservationContent.treeOptions = {
            nodeChildren: "Children",
            multiSelection: false,
            isLeaf: function (node) {
                if (node.FileName == undefined || node.Filename == "") return false;
                return true;
            },
            isSelectable: function (node) {
                if (reservationContent.treeOptions.dirSelectable)
                    if (angular.isDefined(node.FileName)) return false;
                return true;
            },
            dirSelectable: false
        };

        reservationContent.onNodeToggle = function (node, expanded) {
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

        reservationContent.onSelection = function (node, selected) {
            if (!selected) {
                reservationContent.selectedItem.LinkMainImageId = null;
                reservationContent.selectedItem.previewImageSrc = null;
                return;
            }
            reservationContent.selectedItem.LinkMainImageId = node.Id;
            reservationContent.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
            ajax
                .call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", node.Id, "GET")
                .success(function (response) {
                    reservationContent.selectedItem.previewImageSrc =
                        cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
                })
                .error(function (data, errCode, c, d) {
                    console.log(data);
                });
        };
        //End of TreeControl
    }
]);
