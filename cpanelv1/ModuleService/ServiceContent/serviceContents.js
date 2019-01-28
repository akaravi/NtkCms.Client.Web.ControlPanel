app.controller("serviceContentCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window','$stateParams', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window,$stateParams, $filter) {
    var serviceContent = this;
    var edititem = false;
    //For Grid Options
    serviceContent.gridOptions = {};
    serviceContent.selectedItem = {};
    serviceContent.attachedFiles = [];
    serviceContent.attachedFile = "";

    if (itemRecordStatus != undefined) serviceContent.itemRecordStatus = itemRecordStatus;
    serviceContent.selectedContentId = { Id: $stateParams.ContentId ,TitleTag:$stateParams.TitleTag };
    serviceContent.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    serviceContent.filePickerFilePodcast = {
        isActive: true,
        backElement: 'filePickerFilePodcast',
        filename: null,
        fileId: null,
        extension:'mp3',
        multiSelect: false,
    }
    serviceContent.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    serviceContent.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    serviceContent.GeolocationConfig={
        locationMember:'Geolocation',
        locationMemberString:'GeolocationString',
        onlocationChanged:serviceContent.locationChanged,
        useCurrentLocation:true,
        center:{lat: 33.437039, lng: 53.073182},
        zoom:4,
        scope:serviceContent,
        useCurrentLocationZoom:12,
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    var date = moment().format();
    serviceContent.selectedItem.ToDate = date;
    serviceContent.datePickerConfig = {
        defaultDate: date
    };
    serviceContent.startDate = {
        defaultDate: date
    }
    serviceContent.endDate = {
        defaultDate: date
    }
    serviceContent.count = 0;

//#help/ سلکتور similar
    serviceContent.LinkDestinationIdSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkDestinationId",
      url: "ServiceContent",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: serviceContent,
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
serviceContent.LinkCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryId',
        url: 'serviceCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: serviceContent,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' }
            ]
        }
    }
    //Service Grid Options
    serviceContent.gridOptions = {
        columns: [
            { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: 'true' },
            { name: 'FromDate', displayName: 'تاریخ آغاز', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'ToDate', displayName: 'تاریخ پایان', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: "ActionKey", displayName: "کلیدعملیاتی", displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="serviceContent.addMenu()"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
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
    serviceContent.gridOptions.advancedSearchData.engine.Filters = null;
    serviceContent.gridOptions.advancedSearchData.engine.Filters = [];

    //#tagsInput -----
    //serviceContent.onTagAdded = function (tag) {
    //    if (!angular.isDefined(tag.id)) {    //Check if this a new or a existing tag (existing tags comprise with an id)
    //        var tagObject = jQuery.extend({}, serviceContent.ModuleTag);   //#Clone a Javascript Object
    //        tagObject.Title = tag.text;
    //        ajax.call('/api/ServiceTag/add', tagObject, 'POST').success(function (response) {
    //            rashaErManage.checkAction(response);
    //            if (response.IsSuccess) {
    //                serviceContent.tags[serviceContent.tags.length - 1] = { id: response.Item.Id, text: response.Item.Title };  //Replace the newly added tag (last in the array) with a new object including its Id
    //            }
    //        }).error(function (data, errCode, c, d) {
    //            rashaErManage.checkAction(data, errCode);
    //        });
    //    }
    //}
    serviceContent.onTagRemoved = function (tag) { }
    //End of #tagsInput

    //For Show Category Loading Indicator
    serviceContent.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show Service Loading Indicator
    serviceContent.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    serviceContent.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    serviceContent.addMenu = function () {
        $modal.open({
            templateUrl: "cpanelv1/ModuleService/serviceContent/modalMenu.html",
            scope: $scope
        });
    }

    serviceContent.treeConfig.currentNode = {};

    serviceContent.treeBusyIndicator = false;

    serviceContent.addRequested = false;

    serviceContent.ServiceTitle = "";

    //init Function
    serviceContent.init = function () {
        ajax.call(mainPathApi+"ServiceCategory/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            serviceContent.treeConfig.Items = response.ListItems;
            serviceContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        filterModel = { PropertyName: "ContentTags",PropertyAnyName:"LinkTagId", SearchType: 0, IntValue1: serviceContent.selectedContentId.Id };
        if (serviceContent.selectedContentId.Id >0)
            serviceContent.gridOptions.advancedSearchData.engine.Filters.push(filterModel);             
        ajax.call(mainPathApi+"serviceContent/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            serviceContent.ListItems = response.ListItems;
            serviceContent.gridOptions.fillData(serviceContent.ListItems, response.resultAccess); // Sending Access as an argument
            serviceContent.contentBusyIndicator.isActive = false;
            serviceContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            serviceContent.gridOptions.totalRowCount = response.TotalRowCount;
            serviceContent.gridOptions.rowPerPage = response.RowPerPage;
            serviceContent.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            serviceContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            serviceContent.contentBusyIndicator.isActive = false;
        });
        ajax.call(mainPathApi+"ServiceTag/getviewmodel", "0", 'GET').success(function (response) {    //Get a ViewModel for ServiceTag
            serviceContent.ModuleTag = response.Item;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(mainPathApi+"serviceContentTag/getviewmodel", "0", 'GET').success(function (response) { //Get a ViewModel for serviceContentTag
            serviceContent.ModuleContentTag = response.Item;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    };

    serviceContent.gridOptions.onRowSelected = function () {
        var item = serviceContent.gridOptions.selectedRow.item;
    }

    // Open Add Category Modal 
    serviceContent.addNewCategoryModel = function () {
        if (buttonIsPressed) return;
        serviceContent.addRequested = false;
        buttonIsPressed = true;
        ajax.call(mainPathApi+'ServiceCategory/getviewmodel', "0", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            serviceContent.selectedItem = response.Item;
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
                serviceContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(serviceContent.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleService/ServiceCategory/add.html',
                        scope: $scope
                    });
                    serviceContent.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //-----
            //$modal.open({
            //    templateUrl: 'cpanelv1/ModuleService/ServiceCategory/add.html',
            //    scope: $scope
            //});
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Open Edit Category Modal
    serviceContent.openEditCategoryModel = function () {
        if (buttonIsPressed) { return };
        serviceContent.addRequested = false;
        serviceContent.modalTitle = 'ویرایش';
        if (!serviceContent.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Category_To_Edit'));
            return;
        }
        serviceContent.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(mainPathApi+'ServiceCategory/getviewmodel', serviceContent.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            serviceContent.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            serviceContent.selectedItem = response.Item;
            //Set dataForTheTree
            serviceContent.selectedNode = [];
            serviceContent.expandedNodes = [];
            serviceContent.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(mainPathApi+"CmsFileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                serviceContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(serviceContent.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (serviceContent.selectedItem.LinkMainImageId > 0)
                        serviceContent.onSelection({ Id: serviceContent.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleService/ServiceCategory/edit.html',
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
            //    templateUrl: 'cpanelv1/ModuleService/ServiceCategory/edit.html',
            //    scope: $scope
            //});
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Category
    serviceContent.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        serviceContent.categoryBusyIndicator.isActive = true;
        serviceContent.addRequested = true;
        serviceContent.selectedItem.LinkParentId = null;
        if (serviceContent.treeConfig.currentNode != null)
            serviceContent.selectedItem.LinkParentId = serviceContent.treeConfig.currentNode.Id;
        ajax.call(mainPathApi+'ServiceCategory/add', serviceContent.selectedItem, 'POST').success(function (response) {
            serviceContent.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                serviceContent.gridOptions.advancedSearchData.engine.Filters = null;
                serviceContent.gridOptions.advancedSearchData.engine.Filters = [];
                serviceContent.gridOptions.reGetAll();
                serviceContent.closeModal();
            }
            serviceContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            serviceContent.addRequested = false;
            serviceContent.categoryBusyIndicator.isActive = false;
        });
    }

    //Edit Category REST Api
    serviceContent.editCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        serviceContent.categoryBusyIndicator.isActive = true;
        ajax.call(mainPathApi+'ServiceCategory/edit', serviceContent.selectedItem, 'PUT').success(function (response) {
            serviceContent.addRequested = true;
            //serviceContent.showbusy = false;
            serviceContent.treeConfig.showbusy = false;
            serviceContent.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                serviceContent.addRequested = false;
                serviceContent.treeConfig.currentNode.Title = response.Item.Title;
                serviceContent.closeModal();
            }
            serviceContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            serviceContent.addRequested = false;
            serviceContent.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    serviceContent.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = serviceContent.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Category_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                serviceContent.categoryBusyIndicator.isActive = true;
                buttonIsPressed = true;
                ajax.call(mainPathApi+'ServiceCategory/getviewmodel', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    serviceContent.selectedItemForDelete = response.Item;
                    ajax.call(mainPathApi+'ServiceCategory/delete', serviceContent.selectedItemForDelete, 'DELETE').success(function (res) {
                        if (res.IsSuccess) {
                            serviceContent.gridOptions.advancedSearchData.engine.Filters = null;
                            serviceContent.gridOptions.advancedSearchData.engine.Filters = [];
                            serviceContent.gridOptions.fillData();
                            serviceContent.categoryBusyIndicator.isActive = false;
                            serviceContent.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translate')('Unable_To_Delete_The_Category_Contains_Content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        serviceContent.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    serviceContent.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree: On Node Select Options
    serviceContent.treeConfig.onNodeSelect = function () {
        var node = serviceContent.treeConfig.currentNode;
        serviceContent.selectContent(node);

    };
    //Show Content with Category Id
    serviceContent.selectContent = function (node) {
        serviceContent.gridOptions.advancedSearchData.engine.Filters = null;
        serviceContent.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            serviceContent.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            serviceContent.contentBusyIndicator.isActive = true;
            serviceContent.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryId",
                IntValue1: node.Id,
                SearchType: 0
            }
            serviceContent.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(mainPathApi+"serviceContent/getall", serviceContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            serviceContent.contentBusyIndicator.isActive = false;
            serviceContent.ListItems = response.ListItems;
            serviceContent.gridOptions.fillData(serviceContent.ListItems, response.resultAccess); // Sending Access as an argument
            serviceContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            serviceContent.gridOptions.totalRowCount = response.TotalRowCount;
            serviceContent.gridOptions.rowPerPage = response.RowPerPage;
            serviceContent.gridOptions.maxSize = 5;
            serviceContent.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            serviceContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    //open statistics
    serviceContent.Showstatistics = function () {
        if (!serviceContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        ajax.call(mainPathApi+'serviceContent/getviewmodel', serviceContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            serviceContent.selectedItem = response1.Item;
            $modal.open({
                templateUrl: "cpanelv1/ModuleService/serviceContent/statistics.html",
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add New Content Model
    serviceContent.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = serviceContent.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translate')('To_Add_A_Service_Please_Select_The_Category'));
            return;
        }

        serviceContent.attachedFiles = [];
        serviceContent.attachedFile = "";
        serviceContent.filePickerMainImage.filename = "";
        serviceContent.filePickerMainImage.fileId = null;
        serviceContent.filePickerFilePodcast.filename = "";
        serviceContent.filePickerFilePodcast.fileId = null;
        serviceContent.filePickerFiles.filename = "";
        serviceContent.filePickerFiles.fileId = null;
        serviceContent.tags = [];   //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
        serviceContent.kwords = [];   //tagsInput خالی کردن آرایه کلمات کلیدی برای محتوای جدید
        serviceContent.addRequested = false;
        serviceContent.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(mainPathApi+'serviceContent/getviewmodel', "0", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            serviceContent.selectedItem = response.Item;
            serviceContent.selectedItem.LinkCategoryId = node.Id;
            serviceContent.selectedItem.LinkFileIds = null;
            serviceContent.selectedItem.OtherInfos = [];
            serviceContent.selectedItem.Similars = [];
            serviceContent.clearPreviousData();

            $modal.open({
                templateUrl: 'cpanelv1/ModuleService/serviceContent/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    serviceContent.openEditModel = function () {
        if (buttonIsPressed) { return };
        serviceContent.addRequested = false;
        serviceContent.modalTitle = 'ویرایش';
        if (!serviceContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(mainPathApi+'serviceContent/getviewmodel', serviceContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            serviceContent.selectedItem = response1.Item;
            serviceContent.startDate.defaultDate = serviceContent.selectedItem.FromDate;
            serviceContent.endDate.defaultDate = serviceContent.selectedItem.ToDate;
            serviceContent.filePickerMainImage.filename = null;
            serviceContent.filePickerMainImage.fileId = null;
            serviceContent.filePickerFilePodcast.filename = null;
            serviceContent.filePickerFilePodcast.fileId = null;
            if (response1.Item.LinkMainImageId != null) {
                ajax.call(mainPathApi+'CmsFileContent/getviewmodel', response1.Item.LinkMainImageId, 'GET').success(function (response2) {
                    serviceContent.filePickerMainImage.filename = response2.Item.FileName;
                    serviceContent.filePickerMainImage.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            if (response1.Item.LinkFilePodcastId != null) {
                ajax.call(mainPathApi+'CmsFileContent/getviewmodel', response1.Item.LinkFilePodcastId, 'GET').success(function (response2) {
                    serviceContent.filePickerFilePodcast.filename = response2.Item.FileName;
                    serviceContent.filePickerFilePodcast.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            serviceContent.attachedFiles = [];
            serviceContent.parseFileIds(response1.Item.LinkFileIds);
            serviceContent.filePickerFiles.filename = null;
            serviceContent.filePickerFiles.fileId = null;
            //Load tagsInput
            serviceContent.tags = [];  //Clear out previous tags
            if (serviceContent.selectedItem.ContentTags == null)
                serviceContent.selectedItem.ContentTags = [];
            $.each(serviceContent.selectedItem.ContentTags, function (index, item) {
                if (item.ModuleTag != null)
                    serviceContent.tags.push({ id: item.ModuleTag.Id, text: item.ModuleTag.Title });  //Add current content's tag to tags array with id and title
            });
            //Load Keywords tagsInput
            serviceContent.kwords = [];  //Clear out previous tags
            var arraykwords = [];
            if (serviceContent.selectedItem.Keyword != null && serviceContent.selectedItem.Keyword != "")
                arraykwords = serviceContent.selectedItem.Keyword.split(',');
            $.each(arraykwords, function (index, item) {
                if (item != null)
                    serviceContent.kwords.push({ text: item });  //Add current content's tag to tags array with id and title
            });
            $modal.open({
                templateUrl: 'cpanelv1/ModuleService/serviceContent/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    serviceContent.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        serviceContent.categoryBusyIndicator.isActive = true;
        serviceContent.addRequested = true;

        //Save attached file ids into serviceContent.selectedItem.LinkFileIds
        serviceContent.selectedItem.LinkFileIds = "";
        serviceContent.stringfyLinkFileIds();
        //Save Keywords
        $.each(serviceContent.kwords, function (index, item) {
            if (index == 0)
                serviceContent.selectedItem.Keyword = item.text;
            else
                serviceContent.selectedItem.Keyword += ',' + item.text;
        });
        if (serviceContent.selectedItem.LinkCategoryId == null || serviceContent.selectedItem.LinkCategoryId == 0) {
            rashaErManage.showMessage($filter('translate')('To_Add_A_Service_Please_Select_The_Category'));
            return;
        }
        var apiSelectedItem = serviceContent.selectedItem;
        if (apiSelectedItem.Similars)
            $.each(apiSelectedItem.Similars, function (index, item) {
                item.Destination = [];
            });
        ajax.call(mainPathApi+'serviceContent/add', apiSelectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            serviceContent.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                serviceContent.ListItems.unshift(response.Item);
                serviceContent.gridOptions.fillData(serviceContent.ListItems);
                serviceContent.closeModal();
                //Save inputTags
                serviceContent.selectedItem.ContentTags = [];
                $.each(serviceContent.tags, function (index, item) {
                    if (item.id > 0) {
                        var newObject = $.extend({}, serviceContent.ModuleContentTag);
                        newObject.LinkTagId = item.id;
                        newObject.LinkContentId = response.Item.Id;
                        serviceContent.selectedItem.ContentTags.push(newObject);
                    }
                });
                ajax.call(mainPathApi+'serviceContentTag/addbatch', serviceContent.selectedItem.ContentTags, 'POST').success(function (response) {
                    console.log(response);
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            serviceContent.addRequested = false;
            serviceContent.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    serviceContent.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        serviceContent.categoryBusyIndicator.isActive = true;
        serviceContent.addRequested = true;

        //Save attached file ids into serviceContent.selectedItem.LinkFileIds
        serviceContent.selectedItem.LinkFileIds = "";
        serviceContent.stringfyLinkFileIds();
        //Save inputTags
        serviceContent.selectedItem.ContentTags = [];
        $.each(serviceContent.tags, function (index, item) {
            if (item.id > 0) {
                var newObject = $.extend({}, serviceContent.ModuleContentTag);
                newObject.LinkTagId = item.id;
                newObject.LinkContentId = serviceContent.selectedItem.Id;
                serviceContent.selectedItem.ContentTags.push(newObject);
            }
        });
        //Save Keywords
        $.each(serviceContent.kwords, function (index, item) {
            if (index == 0)
                serviceContent.selectedItem.Keyword = item.text;
            else
                serviceContent.selectedItem.Keyword += ',' + item.text;
        });
        if (serviceContent.selectedItem.LinkCategoryId == null || serviceContent.selectedItem.LinkCategoryId == 0) {
            rashaErManage.showMessage($filter('translate')('To_Add_A_Service_Please_Select_The_Category'));
            return;
        }
        var apiSelectedItem = serviceContent.selectedItem;
        if (apiSelectedItem.Similars)
            $.each(apiSelectedItem.Similars, function (index, item) {
                item.Destination = [];
            });
        ajax.call(mainPathApi+'serviceContent/edit', apiSelectedItem, 'PUT').success(function (response) {
            serviceContent.categoryBusyIndicator.isActive = false;
            serviceContent.addRequested = false;
            serviceContent.treeConfig.showbusy = false;
            serviceContent.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                serviceContent.replaceItem(serviceContent.selectedItem.Id, response.Item);
                serviceContent.gridOptions.fillData(serviceContent.ListItems);
                serviceContent.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            serviceContent.addRequested = false;
            serviceContent.categoryBusyIndicator.isActive = false;
        });
    }

    // Delete a Service Content 
    serviceContent.deleteContent = function () {
        if (buttonIsPressed) return;
        if (!serviceContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        serviceContent.treeConfig.showbusy = true;
        serviceContent.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                serviceContent.categoryBusyIndicator.isActive = true;
                serviceContent.showbusy = true;
                serviceContent.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(mainPathApi+"serviceContent/getviewmodel", serviceContent.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    serviceContent.showbusy = false;
                    serviceContent.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    serviceContent.selectedItemForDelete = response.Item;
                    ajax.call(mainPathApi+"serviceContent/delete", serviceContent.selectedItemForDelete, "DELETE").success(function (res) {
                        serviceContent.categoryBusyIndicator.isActive = false;
                        serviceContent.treeConfig.showbusy = false;
                        serviceContent.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            serviceContent.replaceItem(serviceContent.selectedItemForDelete.Id);
                            serviceContent.gridOptions.fillData(serviceContent.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        serviceContent.treeConfig.showbusy = false;
                        serviceContent.showIsBusy = false;
                        serviceContent.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    serviceContent.treeConfig.showbusy = false;
                    serviceContent.showIsBusy = false;
                    serviceContent.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }
 //#help similar & otherinfo
    serviceContent.clearPreviousData = function() {
      serviceContent.selectedItem.Similars = [];
      $("#to").empty();
    };
    

    serviceContent.moveSelected = function(from, to, calculatePrice) {
      if (from == "Content") {
        //var title = serviceContent.ItemListIdSelector.selectedItem.Title;
        // var optionSelectedPrice = serviceContent.ItemListIdSelector.selectedItem.Price;
        if (
          serviceContent.selectedItem.LinkDestinationId != undefined &&
          serviceContent.selectedItem.LinkDestinationId != null
        ) {
          if (serviceContent.selectedItem.Similars == undefined)
            serviceContent.selectedItem.Similars = [];
          for (var i = 0; i < serviceContent.selectedItem.Similars.length; i++) {
            if (
              serviceContent.selectedItem.Similars[i].LinkDestinationId ==
              serviceContent.selectedItem.LinkDestinationId
            ) {
              rashaErManage.showMessage($filter('translate')('Content_Is_Duplicate'));
              return;
            }
          }
          // if (serviceContent.selectedItem.Title == null || serviceContent.selectedItem.Title.length < 0)
          //     serviceContent.selectedItem.Title = title;
          serviceContent.selectedItem.Similars.push({
            //Id: 0,
            //Source: from,
            LinkDestinationId: serviceContent.selectedItem.LinkDestinationId,
            Destination: serviceContent.LinkDestinationIdSelector.selectedItem
          });
        }
      }
    };
     serviceContent.moveSelectedOtherInfo = function(from, to,y) {

            
             if (serviceContent.selectedItem.OtherInfos == undefined)
                serviceContent.selectedItem.OtherInfos = [];
              for (var i = 0; i < serviceContent.selectedItem.OtherInfos.length; i++) {
              
                if (serviceContent.selectedItem.OtherInfos[i].Title == serviceContent.selectedItemOtherInfos.Title && serviceContent.selectedItem.OtherInfos[i].HtmlBody ==serviceContent.selectedItemOtherInfos.HtmlBody && serviceContent.selectedItem.OtherInfos[i].Source ==serviceContent.selectedItemOtherInfos.Source) 
                {
                  rashaErManage.showMessage($filter('translate')('Information_Is_Duplicate'));
                  return;
                }
             
              }
             if (serviceContent.selectedItemOtherInfos.Title == "" && serviceContent.selectedItemOtherInfos.Source =="" && serviceContent.selectedItemOtherInfos.HtmlBody =="")
                {
                    rashaErManage.showMessage($filter('translate')('Fields_Values_Are_Empty_Please_Enter_Values'));
                }
             else
               {
            
             serviceContent.selectedItem.OtherInfos.push({
                Title:serviceContent.selectedItemOtherInfos.Title,
                HtmlBody:serviceContent.selectedItemOtherInfos.HtmlBody,
                Source:serviceContent.selectedItemOtherInfos.Source
              });
              serviceContent.selectedItemOtherInfos.Title="";
              serviceContent.selectedItemOtherInfos.Source="";
              serviceContent.selectedItemOtherInfos.HtmlBody="";
             }
             if(edititem)
               { 
                   edititem=false; 
               }
              
        };

    serviceContent.removeFromCollection = function(listsimilar,iddestination) {
      for (var i = 0; i < serviceContent.selectedItem.Similars.length; i++) 
       {       
            if(listsimilar[i].LinkDestinationId==iddestination)
            {
                serviceContent.selectedItem.Similars.splice(i, 1);
                return;
            }
          
      }
      
    };
   serviceContent.removeFromOtherInfo = function(listOtherInfo,title,body,source) {
    for (var i = 0; i < serviceContent.selectedItem.OtherInfos.length; i++) 
       {       
            if(listOtherInfo[i].Title==title && listOtherInfo[i].HtmlBody==body && listOtherInfo[i].Source==source)
            {
              serviceContent.selectedItem.OtherInfos.splice(i, 1);
              return;
            }
       }
    };
   serviceContent.editOtherInfo = function(y) {
      edititem=true;
      serviceContent.selectedItemOtherInfos.Title=y.Title;
      serviceContent.selectedItemOtherInfos.HtmlBody=y.HtmlBody;
      serviceContent.selectedItemOtherInfos.Source=y.Source;
      serviceContent.removeFromOtherInfo(serviceContent.selectedItem.OtherInfos,y.Title,y.HtmlBody,y.Source);
    };


    //#help
    //Confirm/UnConfirm Service Content
    serviceContent.confirmUnConfirmserviceContent = function () {
        if (!serviceContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }
        ajax.call(mainPathApi+'serviceContent/getviewmodel', serviceContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            serviceContent.selectedItem = response.Item;
            serviceContent.selectedItem.IsAccepted = (response.Item.IsAccepted == true) ? false : true;
            ajax.call(mainPathApi+'serviceContent/edit', serviceContent.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = serviceContent.ListItems.indexOf(serviceContent.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        serviceContent.ListItems[index] = response2.Item;
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
    serviceContent.enableArchive = function () {
        if (!serviceContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }
        ajax.call(mainPathApi+'serviceContent/getviewmodel', serviceContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            serviceContent.selectedItem = response.Item;
            serviceContent.selectedItem.IsArchive = (response.Item.IsArchive == true) ? false : true;
            ajax.call(mainPathApi+'serviceContent/edit', serviceContent.selectedItem, 'PUT').success(function (response2) {
                serviceContent.categoryBusyIndicator.isActive = true;
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = serviceContent.ListItems.indexOf(serviceContent.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        serviceContent.ListItems[index] = response2.Item;
                    }
                    serviceContent.categoryBusyIndicator.isActive = false;
                }

            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                serviceContent.categoryBusyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            serviceContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Replace Item OnDelete/OnEdit Grid Options
    serviceContent.replaceItem = function (oldId, newItem) {
        angular.forEach(serviceContent.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = serviceContent.ListItems.indexOf(item);
                serviceContent.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            serviceContent.ListItems.unshift(newItem);
    }
    serviceContent.summernoteOptions = {
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

    serviceContent.summernoteText = '<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />';
    serviceContent.searchData = function () {
        ajax.call(mainPathApi+"serviceContent/getall", serviceContent.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            serviceContent.contentBusyIndicator.isActive = false;
            serviceContent.ListItems = response.ListItems;
            serviceContent.gridOptions.fillData(serviceContent.ListItems);
            serviceContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            serviceContent.gridOptions.totalRowCount = response.TotalRowCount;
            serviceContent.gridOptions.rowPerPage = response.RowPerPage;
            serviceContent.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            serviceContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    serviceContent.addRequested = false;
    serviceContent.closeModal = function () {
        $modalStack.dismissAll();
    };

    serviceContent.showIsBusy = false;


    //For reInit Categories
    serviceContent.gridOptions.reGetAll = function () {
        if (serviceContent.gridOptions.advancedSearchData.engine.Filters.length > 0) serviceContent.searchData();
        else serviceContent.init();
    };

    serviceContent.isCurrentNodeEmpty = function () {
        return !angular.equals({}, serviceContent.treeConfig.currentNode);
    }

    serviceContent.loadFileAndFolder = function (item) {
        serviceContent.treeConfig.currentNode = item;
        serviceContent.treeConfig.onNodeSelect(item);
    }
    serviceContent.addRequested = true;

    serviceContent.columnCheckbox = false;

    serviceContent.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = serviceContent.gridOptions.columns;
        if (serviceContent.gridOptions.columnCheckbox) {
            for (var i = 0; i < serviceContent.gridOptions.columns.length; i++) {
                //serviceContent.gridOptions.columns[i].visible = $("#" + serviceContent.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + serviceContent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                serviceContent.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < serviceContent.gridOptions.columns.length; i++) {
                var element = $("#" + serviceContent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + serviceContent.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < serviceContent.gridOptions.columns.length; i++) {
            console.log(serviceContent.gridOptions.columns[i].name.concat(".visible: "), serviceContent.gridOptions.columns[i].visible);
        }
        serviceContent.gridOptions.columnCheckbox = !serviceContent.gridOptions.columnCheckbox;
    }

    serviceContent.deleteAttachedFile = function (index) {
        serviceContent.attachedFiles.splice(index, 1);
    }

    serviceContent.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !serviceContent.alreadyExist(id, serviceContent.attachedFiles) && fname != null && fname != "") {
            var file = { id: id, name: fname };
            serviceContent.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    serviceContent.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translate')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    serviceContent.filePickerMainImage.removeSelectedfile = function (config) {
        serviceContent.filePickerMainImage.fileId = null;
        serviceContent.filePickerMainImage.filename = null;
        serviceContent.selectedItem.LinkMainImageId = null;

    }
    serviceContent.filePickerFilePodcast.removeSelectedfile = function (config) {
        serviceContent.filePickerFilePodcast.fileId = null;
        serviceContent.filePickerFilePodcast.filename = null;
        serviceContent.selectedItem.LinkFilePodcastId = null;

    }
    serviceContent.filePickerFiles.removeSelectedfile = function (config) {
        serviceContent.filePickerFiles.fileId = null;
        serviceContent.filePickerFiles.filename = null;
        serviceContent.selectedItem.LinkFileIds = null;
    }

    serviceContent.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }



    serviceContent.showUpload = function () { $("#fastUpload").fadeToggle(); }

    // ----------- FilePicker Codes --------------------------------
    serviceContent.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !serviceContent.alreadyExist(id, serviceContent.attachedFiles)) {
            var fId = id;
            var file = { fileId: fId, filename: fname };
            serviceContent.attachedFiles.push(file);
            serviceContent.clearfilePickers();

        }
    }

    serviceContent.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translate')('This_Item_Has_Already_Been_Added'));
                serviceContent.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    serviceContent.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(mainPathApi+'CmsFileContent/getviewmodel', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            serviceContent.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    serviceContent.clearfilePickers = function () {
        serviceContent.filePickerFiles.filename = null;
        serviceContent.filePickerFiles.fileId = null;
    }

    serviceContent.stringfyLinkFileIds = function () {
        $.each(serviceContent.attachedFiles, function (i, item) {
            if (serviceContent.selectedItem.LinkFileIds == "")
                serviceContent.selectedItem.LinkFileIds = item.fileId;
            else
                serviceContent.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    serviceContent.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleService/serviceContent/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        serviceContent.FileList = [];
        //get list of file from category id
        ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", null, 'POST').success(function (response) {
            serviceContent.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }
//---------------Upload Modal Podcast-------------------------------
     serviceContent.openUploadModalPodcast = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleService/serviceContent/upload_modalPodcast.html',
            size: 'lg',
            scope: $scope
        });

        serviceContent.FileList = [];
        //get list of file from category id
        ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", null, 'POST').success(function (response) {
            serviceContent.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }
    serviceContent.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    serviceContent.whatcolor = function (progress) {
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

    serviceContent.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    serviceContent.replaceFile = function (name) {
        serviceContent.itemClicked(null, serviceContent.fileIdToDelete, "file");
        serviceContent.fileTypes = 1;
        serviceContent.fileIdToDelete = serviceContent.selectedIndex;

        // Delete the file
        ajax.call(mainPathApi+"CmsFileContent/getviewmodel", serviceContent.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(mainPathApi+'CmsFileContent/delete', response1.Item, 'DELETE').success(function (response2) {
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(mainPathApi+"CmsFileContent/getviewmodel", "0", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                serviceContent.FileItem = response3.Item;
                                serviceContent.FileItem.FileName = name;
                                serviceContent.FileItem.Extension = name.split('.').pop();
                                serviceContent.FileItem.FileSrc = name;
                                serviceContent.FileItem.LinkCategoryId = serviceContent.thisCategory;
                                serviceContent.saveNewFile();
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
    serviceContent.saveNewFile = function () {
        ajax.call(mainPathApi+"CmsFileContent/add", serviceContent.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                serviceContent.FileItem = response.Item;
                serviceContent.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            serviceContent.showErrorIcon();
            return -1;
        });
    }

    serviceContent.showSuccessIcon = function () {
    }

    serviceContent.showErrorIcon = function () {
    }
    //file is exist
    serviceContent.fileIsExist = function (fileName) {
        for (var i = 0; i < serviceContent.FileList.length; i++) {
            if (serviceContent.FileList[i].FileName == fileName) {
                serviceContent.fileIdToDelete = serviceContent.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    serviceContent.getFileItem = function (id) {
        for (var i = 0; i < serviceContent.FileList.length; i++) {
            if (serviceContent.FileList[i].Id == id) {
                return serviceContent.FileList[i];
            }
        }
    }

    //select file or folder
    serviceContent.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            serviceContent.fileTypes = 1;
            serviceContent.selectedFileId = serviceContent.getFileItem(index).Id;
            serviceContent.selectedFileName = serviceContent.getFileItem(index).FileName;
        }
        else {
            serviceContent.fileTypes = 2;
            serviceContent.selectedCategoryId = serviceContent.getCategoryName(index).Id;
            serviceContent.selectedCategoryTitle = serviceContent.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        serviceContent.selectedIndex = index;

    };
//upload file Podcast
    serviceContent.uploadFilePodcast = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (serviceContent.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ serviceContent.replaceFile(uploadFile.name);
                    serviceContent.itemClicked(null, serviceContent.fileIdToDelete, "file");
                    serviceContent.fileTypes = 1;
                    serviceContent.fileIdToDelete = serviceContent.selectedIndex;
                     // replace the file
            ajax
              .call(
                mainPathApi+"CmsFileContent/getviewmodel",
                serviceContent.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(mainPathApi+"CmsFileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        serviceContent.FileItem = response2.Item;
                        serviceContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        serviceContent.filePickerFilePodcast.filename =
                          serviceContent.FileItem.FileName;
                        serviceContent.filePickerFilePodcast.fileId =
                          response2.Item.Id;
                        serviceContent.selectedItem.LinkFilePodcastId =
                          serviceContent.filePickerFilePodcast.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      serviceContent.showErrorIcon();
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
                ajax.call(mainPathApi+"CmsFileContent/getviewmodel", "0", 'GET').success(function (response) {
                    serviceContent.FileItem = response.Item;
                    serviceContent.FileItem.FileName = uploadFile.name;
                    serviceContent.FileItem.uploadName = uploadFile.uploadName;
                    serviceContent.FileItem.Extension = uploadFile.name.split('.').pop();
                    serviceContent.FileItem.FileSrc = uploadFile.name;
                    serviceContent.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- serviceContent.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(mainPathApi+"CmsFileContent/add", serviceContent.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            serviceContent.FileItem = response.Item;
                            serviceContent.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            serviceContent.filePickerFilePodcast.filename = serviceContent.FileItem.FileName;
                            serviceContent.filePickerFilePodcast.fileId = response.Item.Id;
                            serviceContent.selectedItem.LinkFilePodcastId = serviceContent.filePickerFilePodcast.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        serviceContent.showErrorIcon();
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
    serviceContent.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (serviceContent.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ serviceContent.replaceFile(uploadFile.name);
                    serviceContent.itemClicked(null, serviceContent.fileIdToDelete, "file");
                    serviceContent.fileTypes = 1;
                    serviceContent.fileIdToDelete = serviceContent.selectedIndex;
                     // replace the file
            ajax
              .call(
                mainPathApi+"CmsFileContent/getviewmodel",
                serviceContent.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(mainPathApi+"CmsFileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        serviceContent.FileItem = response2.Item;
                        serviceContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        serviceContent.filePickerMainImage.filename =
                          serviceContent.FileItem.FileName;
                        serviceContent.filePickerMainImage.fileId =
                          response2.Item.Id;
                        serviceContent.selectedItem.LinkMainImageId =
                          serviceContent.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      serviceContent.showErrorIcon();
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
                ajax.call(mainPathApi+"CmsFileContent/getviewmodel", "0", 'GET').success(function (response) {
                    serviceContent.FileItem = response.Item;
                    serviceContent.FileItem.FileName = uploadFile.name;
                    serviceContent.FileItem.uploadName = uploadFile.uploadName;
                    serviceContent.FileItem.Extension = uploadFile.name.split('.').pop();
                    serviceContent.FileItem.FileSrc = uploadFile.name;
                    serviceContent.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- serviceContent.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(mainPathApi+"CmsFileContent/add", serviceContent.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            serviceContent.FileItem = response.Item;
                            serviceContent.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            serviceContent.filePickerMainImage.filename = serviceContent.FileItem.FileName;
                            serviceContent.filePickerMainImage.fileId = response.Item.Id;
                            serviceContent.selectedItem.LinkMainImageId = serviceContent.filePickerMainImage.fileId;
                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        serviceContent.showErrorIcon();
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
    serviceContent.exportFile = function () {
        serviceContent.addRequested = true;
        serviceContent.gridOptions.advancedSearchData.engine.ExportFile = serviceContent.ExportFileClass;
        ajax.call(mainPathApi+'ServiceCategory/exportfile', serviceContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            serviceContent.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                serviceContent.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //serviceContent.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    serviceContent.toggleExportForm = function () {
        serviceContent.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        serviceContent.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        serviceContent.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        serviceContent.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        serviceContent.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleService/ServiceContent/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    serviceContent.rowCountChanged = function () {
        if (!angular.isDefined(serviceContent.ExportFileClass.RowCount) || serviceContent.ExportFileClass.RowCount > 5000)
            serviceContent.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    serviceContent.getCount = function () {
        ajax.call(mainPathApi+"ServiceCategory/count", serviceContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            serviceContent.addRequested = false;
            rashaErManage.checkAction(response);
            serviceContent.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            serviceContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
    //TreeControl
    serviceContent.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (serviceContent.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    serviceContent.onNodeToggle = function (node, expanded) {
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

    serviceContent.onSelection = function (node, selected) {
        if (!selected) {
            serviceContent.selectedItem.LinkMainImageId = null;
            serviceContent.selectedItem.previewImageSrc = null;
            return;
        }
        serviceContent.selectedItem.LinkMainImageId = node.Id;
        serviceContent.selectedItem.previewImageSrc = "CmsFiles/img/loader.gif";
        ajax.call(mainPathApi+"CmsFileContent/getviewmodel", node.Id, "GET").success(function (response) {
            v.selectedItem.previewImageSrc = "/files/" + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);