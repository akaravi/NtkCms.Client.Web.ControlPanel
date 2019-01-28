app.controller("productContentCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window','$stateParams', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window,$stateParams, $filter) {
    var productContent = this;
    var edititem = false;
    //For Grid Options
    productContent.gridOptions = {};
    productContent.selectedItem = {};
    productContent.attachedFiles = [];
    productContent.attachedFile = "";

    if (itemRecordStatus != undefined) productContent.itemRecordStatus = itemRecordStatus;
    productContent.selectedContentId = { Id: $stateParams.ContentId ,TitleTag:$stateParams.TitleTag };
    productContent.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    productContent.filePickerFilePodcast = {
        isActive: true,
        backElement: 'filePickerFilePodcast',
        filename: null,
        fileId: null,
        extension:'mp3',
        multiSelect: false,
    }
    productContent.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    productContent.locationChanged=function(lat,lang)
    {
        console.log("ok "+lat+" "+lang);
    }

    productContent.GeolocationConfig={
        locationMember:'Geolocation',
        locationMemberString:'GeolocationString',
        onlocationChanged:productContent.locationChanged,
        useCurrentLocation:true,
        center:{lat: 33.437039, lng: 53.073182},
        zoom:4,
        scope:productContent,
        useCurrentLocationZoom:12,
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    var date = moment().format();
    productContent.selectedItem.ToDate = date;
    productContent.datePickerConfig = {
        defaultDate: date
    };
    productContent.startDate = {
        defaultDate: date
    }
    productContent.endDate = {
        defaultDate: date
    }
    productContent.count = 0;

//#help/ سلکتور similar
    productContent.LinkDestinationIdSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkDestinationId",
      url: "ProductContent",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: productContent,
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
productContent.LinkCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryId',
        url: 'productCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        showAddDialog: false,
        rowPerPage: 200,
        scope: productContent,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' }
            ]
        }
    }

    //Product Grid Options
    productContent.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild:true,imageWidth:'80',imageHeight:'80' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: "ActionKey", displayName: "کلیدعملیاتی", displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="productContent.addMenu()"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
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
                RowPerPage: 200,
                ContentFullSearch: null,
                Filters: []
            }
        }

    }
    productContent.gridOptions.advancedSearchData.engine.Filters = null;
    productContent.gridOptions.advancedSearchData.engine.Filters = [];

    //#tagsInput -----
    //productContent.onTagAdded = function (tag) {
    //    if (!angular.isDefined(tag.id)) {    //Check if this a new or a existing tag (existing tags comprise with an id)
    //        var tagObject = jQuery.extend({}, productContent.ModuleTag);   //#Clone a Javascript Object
    //        tagObject.Title = tag.text;
    //        ajax.call('/api/productTag/add', tagObject, 'POST').success(function (response) {
    //            rashaErManage.checkAction(response);
    //            if (response.IsSuccess) {
    //                productContent.tags[productContent.tags.length - 1] = { id: response.Item.Id, text: response.Item.Title };  //Replace the newly added tag (last in the array) with a new object including its Id
    //            }
    //        }).error(function (data, errCode, c, d) {
    //            rashaErManage.checkAction(data, errCode);
    //        });
    //    }
    //}
    productContent.onTagRemoved = function (tag) { }
    //End of #tagsInput

    //For Show Category Loading Indicator
    productContent.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show Product Loading Indicator
    productContent.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    productContent.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    productContent.addMenu = function () {
        $modal.open({
            templateUrl: "cpanelv1/ModuleProduct/productContent/modalMenu.html",
            scope: $scope
        });
    }

    productContent.treeConfig.currentNode = {};

    productContent.treeBusyIndicator = false;

    productContent.addRequested = false;

    productContent.ProductTitle = "";

    //init Function
    productContent.init = function () {
        productContent.categoryBusyIndicator.isActive = true;
        var engine = {};
        try {
            engine = productContent.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }
        ajax.call(mainPathApi+"ProductCategory/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            productContent.treeConfig.Items = response.ListItems;
            productContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        filterModel = { PropertyName: "ContentTags",PropertyAnyName:"LinkTagId", SearchType: 0, IntValue1: productContent.selectedContentId.Id };
        if (productContent.selectedContentId.Id >0)
            productContent.gridOptions.advancedSearchData.engine.Filters.push(filterModel);
        ajax.call(mainPathApi+"ProductContent/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            productContent.ListItems = response.ListItems;
            productContent.gridOptions.fillData(productContent.ListItems, response.resultAccess); // Sending Access as an argument
            productContent.contentBusyIndicator.isActive = false;
            productContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            productContent.gridOptions.totalRowCount = response.TotalRowCount;
            productContent.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            productContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            productContent.contentBusyIndicator.isActive = false;
        });
        ajax.call(mainPathApi+"productTag/getviewmodel", "0", 'GET').success(function (response) {    //Get a ViewModel for productTag
            productContent.ModuleTag = response.Item;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(mainPathApi+"productContentTag/getviewmodel", "0", 'GET').success(function (response) { //Get a ViewModel for productContentTag
            productContent.ModuleContentTag = response.Item;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    };

    productContent.gridOptions.onRowSelected = function () {
        var item = productContent.gridOptions.selectedRow.item;
    }

    // Open Add Category Modal 
    productContent.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        productContent.addRequested = false;
        buttonIsPressed = true;
        ajax.call(mainPathApi+'ProductCategory/getviewmodel', "0", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            productContent.selectedItem = response.Item;
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
                productContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(productContent.dataForTheTree, response2.ListItems);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleProduct/ProductCategory/add.html',
                        scope: $scope
                    });
                    productContent.addRequested = false;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
            //-----
            //$modal.open({
            //    templateUrl: 'cpanelv1/ModuleProduct/ProductCategory/add.html',
            //    scope: $scope
            //});
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Open Edit Category Modal
    productContent.openEditCategoryModel = function () {
        if (buttonIsPressed) { return };
        productContent.addRequested = false;
        productContent.modalTitle = 'ویرایش';
        if (!productContent.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Category_To_Edit'));
            return;
        }
        productContent.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(mainPathApi+'ProductCategory/getviewmodel', productContent.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            productContent.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            productContent.selectedItem = response.Item;
            //Set dataForTheTree
            productContent.selectedNode = [];
            productContent.expandedNodes = [];
            productContent.selectedItem = response.Item;
            var filterModelParentRootFolders = {
                Filters: [{
                    PropertyName: "LinkParentId",
                    IntValue1: null,
                    SearchType: 0,
                    IntValueForceNullSearch: true
                }]
            };
            ajax.call(mainPathApi+"CmsFileCategory/getAll", filterModelParentRootFolders, 'POST').success(function (response1) { //Get root directories
                productContent.dataForTheTree = response1.ListItems;
                var filterModelRootFiles = { Filters: [{ PropertyName: "LinkCategoryId", SearchType: 0, IntValue1: null, IntValueForceNullSearch: true }] };
                ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", filterModelRootFiles, 'POST').success(function (response2) { //Get files in root
                    Array.prototype.push.apply(productContent.dataForTheTree, response2.ListItems);
                    //Set selected files to treeControl
                    if (productContent.selectedItem.LinkMainImageId > 0)
                        productContent.onSelection({ Id: productContent.selectedItem.LinkMainImageId }, true);
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleProduct/ProductCategory/edit.html',
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
            //    templateUrl: 'cpanelv1/ModuleProduct/ProductCategory/edit.html',
            //    scope: $scope
            //});
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Category
    productContent.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        productContent.categoryBusyIndicator.isActive = true;
        productContent.addRequested = true;
        productContent.selectedItem.LinkParentId = null;
        if (productContent.treeConfig.currentNode != null)
            productContent.selectedItem.LinkParentId = productContent.treeConfig.currentNode.Id;
        ajax.call(mainPathApi+'ProductCategory/add', productContent.selectedItem, 'POST').success(function (response) {
            productContent.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                productContent.gridOptions.advancedSearchData.engine.Filters = null;
                productContent.gridOptions.advancedSearchData.engine.Filters = [];
                productContent.gridOptions.reGetAll();
                productContent.closeModal();
            }
            productContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            productContent.addRequested = false;
            productContent.categoryBusyIndicator.isActive = false;
        });
    }

    //Edit Category REST Api
    productContent.editCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        productContent.categoryBusyIndicator.isActive = true;
        ajax.call(mainPathApi+'ProductCategory/edit', productContent.selectedItem, 'PUT').success(function (response) {
            productContent.addRequested = true;
            //productContent.showbusy = false;
            productContent.treeConfig.showbusy = false;
            productContent.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                productContent.addRequested = false;
                productContent.treeConfig.currentNode.Title = response.Item.Title;
                productContent.closeModal();
            }
            productContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            productContent.addRequested = false;
            productContent.categoryBusyIndicator.isActive = false;
        });
    }

    // Delete a Category
    productContent.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = productContent.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Category_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                productContent.categoryBusyIndicator.isActive = true;
                buttonIsPressed = true;
                ajax.call(mainPathApi+'ProductCategory/getviewmodel', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    productContent.selectedItemForDelete = response.Item;
                    ajax.call(mainPathApi+'ProductCategory/delete', productContent.selectedItemForDelete, 'DELETE').success(function (res) {
                        if (res.IsSuccess) {
                            productContent.gridOptions.advancedSearchData.engine.Filters = null;
                            productContent.gridOptions.advancedSearchData.engine.Filters = [];
                            productContent.gridOptions.fillData();
                            productContent.categoryBusyIndicator.isActive = false;
                            productContent.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translate')('Unable_To_Delete_The_Category_Contains_Content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        productContent.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    productContent.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    productContent.treeConfig.onNodeSelect = function () {
        var node = productContent.treeConfig.currentNode;
        productContent.selectContent(node);

    };
    //Show Content with Category Id
    productContent.selectContent = function (node) {
        productContent.gridOptions.advancedSearchData.engine.Filters = null;
        productContent.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            productContent.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            productContent.contentBusyIndicator.isActive = true;
            productContent.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryId",
                IntValue1: node.Id,
                SearchType: 0
            }
            productContent.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(mainPathApi+"productContent/getall", productContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            productContent.contentBusyIndicator.isActive = false;
            productContent.ListItems = response.ListItems;
            productContent.gridOptions.fillData(productContent.ListItems, response.resultAccess); // Sending Access as an argument
            productContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            productContent.gridOptions.totalRowCount = response.TotalRowCount;
            productContent.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            productContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    //open statistics
    productContent.Showstatistics = function () {
        if (!productContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        ajax.call(mainPathApi+'productContent/getviewmodel', productContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            rashaErManage.checkAction(response1);
            productContent.selectedItem = response1.Item;
            $modal.open({
                templateUrl: "cpanelv1/ModuleProduct/productContent/statistics.html",
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add New Content Model
    productContent.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = productContent.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translate')('To_Add_A_Product_Please_Select_The_Category'));
            return;
        }
        productContent.attachedFiles = [];
        productContent.attachedFile = "";
        productContent.filePickerMainImage.filename = "";
        productContent.filePickerMainImage.fileId = null;
        productContent.filePickerFilePodcast.filename = "";
        productContent.filePickerFilePodcast.fileId = null;
        productContent.filePickerFiles.filename = "";
        productContent.filePickerFiles.fileId = null;
        productContent.tags = [];   //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
        productContent.kwords = [];   //tagsInput خالی کردن آرایه کلمات کلیدی برای محتوای جدید
        productContent.addRequested = false;
        productContent.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(mainPathApi+'productContent/getviewmodel', "0", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            productContent.selectedItem = response.Item;
            productContent.selectedItem.LinkCategoryId = node.Id;
            productContent.selectedItem.LinkFileIds = null;
            productContent.selectedItem.OtherInfos = [];
            productContent.selectedItem.Similars = [];
            productContent.clearPreviousData();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleProduct/productContent/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    productContent.openEditModel = function () {
        if (buttonIsPressed) { return };
        productContent.addRequested = false;
        productContent.modalTitle = 'ویرایش';
        if (!productContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(mainPathApi+'productContent/getviewmodel', productContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            productContent.selectedItem = response1.Item;
            productContent.startDate.defaultDate = productContent.selectedItem.FromDate;
            productContent.endDate.defaultDate = productContent.selectedItem.ToDate;
            productContent.filePickerMainImage.filename = null;
            productContent.filePickerMainImage.fileId = null;
            productContent.filePickerFilePodcast.filename = null;
            productContent.filePickerFilePodcast.fileId = null;
            if (response1.Item.LinkMainImageId != null) {
                ajax.call(mainPathApi+'CmsFileContent/getviewmodel', response1.Item.LinkMainImageId, 'GET').success(function (response2) {
                    productContent.filePickerMainImage.filename = response2.Item.FileName;
                    productContent.filePickerMainImage.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            if (response1.Item.LinkFilePodcastId != null) {
                ajax.call(mainPathApi+'CmsFileContent/getviewmodel', response1.Item.LinkFilePodcastId, 'GET').success(function (response2) {
                    productContent.filePickerFilePodcast.filename = response2.Item.FileName;
                    productContent.filePickerFilePodcast.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            productContent.attachedFiles = [];
            productContent.parseFileIds(response1.Item.LinkFileIds);
            productContent.filePickerFiles.filename = null;
            productContent.filePickerFiles.fileId = null;
            //Load tagsInput
            productContent.tags = [];  //Clear out previous tags
            if (productContent.selectedItem.ContentTags == null)
                productContent.selectedItem.ContentTags = [];
            $.each(productContent.selectedItem.ContentTags, function (index, item) {
                if (item.ModuleTag != null)
                    productContent.tags.push({ id: item.ModuleTag.Id, text: item.ModuleTag.Title });  //Add current content's tag to tags array with id and title
            });
            //Load Keywords tagsInput
            productContent.kwords = [];  //Clear out previous tags
            var arraykwords = [];
            if (productContent.selectedItem.Keyword != null && productContent.selectedItem.Keyword != "")
                arraykwords = productContent.selectedItem.Keyword.split(',');
            $.each(arraykwords, function (index, item) {
                if (item != null)
                    productContent.kwords.push({ text: item });  //Add current content's tag to tags array with id and title
            });
            $modal.open({
                templateUrl: 'cpanelv1/ModuleProduct/productContent/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    productContent.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        productContent.categoryBusyIndicator.isActive = true;
        productContent.addRequested = true;

        //Save attached file ids into productContent.selectedItem.LinkFileIds
        productContent.selectedItem.LinkFileIds = "";
        productContent.stringfyLinkFileIds();
        //Save Keywords
        $.each(productContent.kwords, function (index, item) {
            if (index == 0)
                productContent.selectedItem.Keyword = item.text;
            else
                productContent.selectedItem.Keyword += ',' + item.text;
        });
        if (productContent.selectedItem.LinkCategoryId == null || productContent.selectedItem.LinkCategoryId == 0) {
            rashaErManage.showMessage($filter('translate')('To_Add_A_Product_Please_Select_The_Category'));
            return;
        }
        var apiSelectedItem = productContent.selectedItem;
        if (apiSelectedItem.Similars)
            $.each(apiSelectedItem.Similars, function (index, item) {
                item.Destination = [];
            });
        ajax.call(mainPathApi+'productContent/add', apiSelectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            productContent.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                productContent.ListItems.unshift(response.Item);
                productContent.gridOptions.fillData(productContent.ListItems);
                productContent.closeModal();
                //Save inputTags
                productContent.selectedItem.ContentTags = [];
                $.each(productContent.tags, function (index, item) {
                    if (item.id > 0) {
                        var newObject = $.extend({}, productContent.ModuleContentTag);
                        newObject.LinkTagId = item.id;
                        newObject.LinkContentId = response.Item.Id;
                        productContent.selectedItem.ContentTags.push(newObject);
                    }
                });
                ajax.call(mainPathApi+'productContentTag/addbatch', productContent.selectedItem.ContentTags, 'POST').success(function (response) {
                    console.log(response);
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            productContent.addRequested = false;
            productContent.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    productContent.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        productContent.categoryBusyIndicator.isActive = true;
        productContent.addRequested = true;

        //Save attached file ids into productContent.selectedItem.LinkFileIds
        productContent.selectedItem.LinkFileIds = "";
        productContent.stringfyLinkFileIds();
        //Save inputTags
        productContent.selectedItem.ContentTags = [];
        $.each(productContent.tags, function (index, item) {
            if (item.id > 0) {
                var newObject = $.extend({}, productContent.ModuleContentTag);
                newObject.LinkTagId = item.id;
                newObject.LinkContentId = productContent.selectedItem.Id;
                productContent.selectedItem.ContentTags.push(newObject);
            }
        });
        //Save Keywords
        $.each(productContent.kwords, function (index, item) {
            if (index == 0)
                productContent.selectedItem.Keyword = item.text;
            else
                productContent.selectedItem.Keyword += ',' + item.text;
        });
        if (productContent.selectedItem.LinkCategoryId == null || productContent.selectedItem.LinkCategoryId == 0) {
            rashaErManage.showMessage($filter('translate')('To_Add_A_Product_Please_Select_The_Category'));
            return;
        }
        var apiSelectedItem = productContent.selectedItem;
        if (apiSelectedItem.Similars)
            $.each(apiSelectedItem.Similars, function (index, item) {
                item.Destination = [];
            });
        ajax.call(mainPathApi+'productContent/edit', apiSelectedItem, 'PUT').success(function (response) {
            productContent.categoryBusyIndicator.isActive = false;
            productContent.addRequested = false;
            productContent.treeConfig.showbusy = false;
            productContent.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                productContent.replaceItem(productContent.selectedItem.Id, response.Item);
                productContent.gridOptions.fillData(productContent.ListItems);
                productContent.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            productContent.addRequested = false;
            productContent.categoryBusyIndicator.isActive = false;
        });
    }

    // Delete a Product Content 
    productContent.deleteContent = function () {
        if (buttonIsPressed) return;
        if (!productContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        productContent.treeConfig.showbusy = true;
        productContent.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                productContent.categoryBusyIndicator.isActive = true;
                productContent.showbusy = true;
                productContent.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(mainPathApi+"productContent/getviewmodel", productContent.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    productContent.showbusy = false;
                    productContent.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    productContent.selectedItemForDelete = response.Item;
                    ajax.call(mainPathApi+"productContent/delete", productContent.selectedItemForDelete, "DELETE").success(function (res) {
                        productContent.categoryBusyIndicator.isActive = false;
                        productContent.treeConfig.showbusy = false;
                        productContent.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            productContent.replaceItem(productContent.selectedItemForDelete.Id);
                            productContent.gridOptions.fillData(productContent.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        productContent.treeConfig.showbusy = false;
                        productContent.showIsBusy = false;
                        productContent.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    productContent.treeConfig.showbusy = false;
                    productContent.showIsBusy = false;
                    productContent.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }
 //#help similar & otherinfo
    productContent.clearPreviousData = function() {
      productContent.selectedItem.Similars = [];
      $("#to").empty();
    };
    

    productContent.moveSelected = function(from, to, calculatePrice) {
      if (from == "Content") {
        //var title = productContent.ItemListIdSelector.selectedItem.Title;
        // var optionSelectedPrice = productContent.ItemListIdSelector.selectedItem.Price;
        if (
          productContent.selectedItem.LinkDestinationId != undefined &&
          productContent.selectedItem.LinkDestinationId != null
        ) {
          if (productContent.selectedItem.Similars == undefined)
            productContent.selectedItem.Similars = [];
          for (var i = 0; i < productContent.selectedItem.Similars.length; i++) {
            if (
              productContent.selectedItem.Similars[i].LinkDestinationId ==
              productContent.selectedItem.LinkDestinationId
            ) {
              rashaErManage.showMessage($filter('translate')('Content_Is_Duplicate'));
              return;
            }
          }
          // if (productContent.selectedItem.Title == null || productContent.selectedItem.Title.length < 0)
          //     productContent.selectedItem.Title = title;
          productContent.selectedItem.Similars.push({
            //Id: 0,
            //Source: from,
            LinkDestinationId: productContent.selectedItem.LinkDestinationId,
            Destination: productContent.LinkDestinationIdSelector.selectedItem
          });
        }
      }
    };
     productContent.moveSelectedOtherInfo = function(from, to,y) {

            
             if (productContent.selectedItem.OtherInfos == undefined)
                productContent.selectedItem.OtherInfos = [];
              for (var i = 0; i < productContent.selectedItem.OtherInfos.length; i++) {
              
                if (productContent.selectedItem.OtherInfos[i].Title == productContent.selectedItemOtherInfos.Title && productContent.selectedItem.OtherInfos[i].HtmlBody ==productContent.selectedItemOtherInfos.HtmlBody && productContent.selectedItem.OtherInfos[i].Source ==productContent.selectedItemOtherInfos.Source) 
                {
                  rashaErManage.showMessage($filter('translate')('Information_Is_Duplicate'));
                  return;
                }
             
              }
             if (productContent.selectedItemOtherInfos.Title == "" && productContent.selectedItemOtherInfos.Source =="" && productContent.selectedItemOtherInfos.HtmlBody =="")
                {
                    rashaErManage.showMessage($filter('translate')('Fields_Values_Are_Empty_Please_Enter_Values'));
                }
             else
               {
            
             productContent.selectedItem.OtherInfos.push({
                Title:productContent.selectedItemOtherInfos.Title,
                HtmlBody:productContent.selectedItemOtherInfos.HtmlBody,
                Source:productContent.selectedItemOtherInfos.Source
              });
              productContent.selectedItemOtherInfos.Title="";
              productContent.selectedItemOtherInfos.Source="";
              productContent.selectedItemOtherInfos.HtmlBody="";
             }
             if(edititem)
               { 
                   edititem=false; 
               }
              
        };

    productContent.removeFromCollection = function(listsimilar,iddestination) {
      for (var i = 0; i < productContent.selectedItem.Similars.length; i++) 
       {       
            if(listsimilar[i].LinkDestinationId==iddestination)
            {
                productContent.selectedItem.Similars.splice(i, 1);
                return;
            }
          
      }
      
    };
   productContent.removeFromOtherInfo = function(listOtherInfo,title,body,source) {
    for (var i = 0; i < productContent.selectedItem.OtherInfos.length; i++) 
       {       
            if(listOtherInfo[i].Title==title && listOtherInfo[i].HtmlBody==body && listOtherInfo[i].Source==source)
            {
              productContent.selectedItem.OtherInfos.splice(i, 1);
              return;
            }
       }
    };
   productContent.editOtherInfo = function(y) {
      edititem=true;
      productContent.selectedItemOtherInfos.Title=y.Title;
      productContent.selectedItemOtherInfos.HtmlBody=y.HtmlBody;
      productContent.selectedItemOtherInfos.Source=y.Source;
      productContent.removeFromOtherInfo(productContent.selectedItem.OtherInfos,y.Title,y.HtmlBody,y.Source);
    };


    //#help
    //Confirm/UnConfirm Product Content
    productContent.confirmUnConfirmproductContent = function () {
        if (!productContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }
        ajax.call(mainPathApi+'productContent/getviewmodel', productContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            productContent.selectedItem = response.Item;
            productContent.selectedItem.IsAccepted = (response.Item.IsAccepted == true) ? false : true;
            ajax.call(mainPathApi+'productContent/edit', productContent.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = productContent.ListItems.indexOf(productContent.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        productContent.ListItems[index] = response2.Item;
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
    productContent.enableArchive = function () {
        if (!productContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }
        ajax.call(mainPathApi+'productContent/getviewmodel', productContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            productContent.selectedItem = response.Item;
            productContent.selectedItem.IsArchive = (response.Item.IsArchive == true) ? false : true;
            ajax.call(mainPathApi+'productContent/edit', productContent.selectedItem, 'PUT').success(function (response2) {
                productContent.categoryBusyIndicator.isActive = true;
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = productContent.ListItems.indexOf(productContent.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        productContent.ListItems[index] = response2.Item;
                    }
                    productContent.categoryBusyIndicator.isActive = false;
                }

            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                productContent.categoryBusyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            productContent.categoryBusyIndicator.isActive = false;
        });
    };

    //Replace Item OnDelete/OnEdit Grid Options
    productContent.replaceItem = function (oldId, newItem) {
        angular.forEach(productContent.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = productContent.ListItems.indexOf(item);
                productContent.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            productContent.ListItems.unshift(newItem);
    }

    productContent.summernoteOptions = {
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
    productContent.summernoteText = '<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />';
    productContent.searchData = function () {
        ajax.call(mainPathApi+"productContent/getall", productContent.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            productContent.contentBusyIndicator.isActive = false;
            productContent.ListItems = response.ListItems;
            productContent.gridOptions.fillData(productContent.ListItems);
            productContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            productContent.gridOptions.totalRowCount = response.TotalRowCount;
            productContent.gridOptions.rowPerPage = response.RowPerPage;
            productContent.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            productContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    productContent.addRequested = false;
    productContent.closeModal = function () {
        $modalStack.dismissAll();
    };

    productContent.showIsBusy = false;


    //For reInit Categories
    productContent.gridOptions.reGetAll = function () {
        if (productContent.gridOptions.advancedSearchData.engine.Filters.length > 0) productContent.searchData();
        else productContent.init();
    };



    productContent.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            productContent.focusExpireLockAccount = true;
        });
    };

    productContent.isCurrentNodeEmpty = function () {
        return !angular.equals({}, productContent.treeConfig.currentNode);
    }

    productContent.loadFileAndFolder = function (item) {
        productContent.treeConfig.currentNode = item;
        productContent.treeConfig.onNodeSelect(item);
    }
    productContent.addRequested = true;

    productContent.columnCheckbox = false;

    productContent.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = productContent.gridOptions.columns;
        if (productContent.gridOptions.columnCheckbox) {
            for (var i = 0; i < productContent.gridOptions.columns.length; i++) {
                //productContent.gridOptions.columns[i].visible = $("#" + productContent.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + productContent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                productContent.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < productContent.gridOptions.columns.length; i++) {
                var element = $("#" + productContent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + productContent.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < productContent.gridOptions.columns.length; i++) {
            console.log(productContent.gridOptions.columns[i].name.concat(".visible: "), productContent.gridOptions.columns[i].visible);
        }
        productContent.gridOptions.columnCheckbox = !productContent.gridOptions.columnCheckbox;
    }

    productContent.deleteAttachedFile = function (index) {
        productContent.attachedFiles.splice(index, 1);
    }

    productContent.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !productContent.alreadyExist(id, productContent.attachedFiles) && fname != null && fname != "") {
            var file = { id: id, name: fname };
            productContent.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    productContent.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translate')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    productContent.filePickerMainImage.removeSelectedfile = function (config) {
        productContent.filePickerMainImage.fileId = null;
        productContent.filePickerMainImage.filename = null;
        productContent.selectedItem.LinkMainImageId = null;

    }
    productContent.filePickerFilePodcast.removeSelectedfile = function (config) {
        productContent.filePickerFilePodcast.fileId = null;
        productContent.filePickerFilePodcast.filename = null;
        productContent.selectedItem.LinkFilePodcastId = null;

    }
    productContent.filePickerFiles.removeSelectedfile = function (config) {
        productContent.filePickerFiles.fileId = null;
        productContent.filePickerFiles.filename = null;
        productContent.selectedItem.LinkFileIds = null;
    }

    productContent.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }



    productContent.showUpload = function () { $("#fastUpload").fadeToggle(); }

    // ----------- FilePicker Codes --------------------------------
    productContent.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !productContent.alreadyExist(id, productContent.attachedFiles)) {
            var fId = id;
            var file = { fileId: fId, filename: fname };
            productContent.attachedFiles.push(file);
            productContent.clearfilePickers();

        }
    }

    productContent.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translate')('This_Item_Has_Already_Been_Added'));
                productContent.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    productContent.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(mainPathApi+'CmsFileContent/getviewmodel', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            productContent.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    productContent.clearfilePickers = function () {
        productContent.filePickerFiles.filename = null;
        productContent.filePickerFiles.fileId = null;
    }

    productContent.stringfyLinkFileIds = function () {
        $.each(productContent.attachedFiles, function (i, item) {
            if (productContent.selectedItem.LinkFileIds == "")
                productContent.selectedItem.LinkFileIds = item.fileId;
            else
                productContent.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    productContent.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleProduct/productContent/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        productContent.FileList = [];
        //get list of file from category id
        ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", null, 'POST').success(function (response) {
            productContent.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }
//---------------Upload Modal Podcast-------------------------------
     productContent.openUploadModalPodcast = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleProduct/productContent/upload_modalPodcast.html',
            size: 'lg',
            scope: $scope
        });

        productContent.FileList = [];
        //get list of file from category id
        ajax.call(mainPathApi+"CmsFileContent/GetFilesFromCategory", null, 'POST').success(function (response) {
            productContent.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }
    productContent.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    productContent.whatcolor = function (progress) {
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

    productContent.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    productContent.replaceFile = function (name) {
        productContent.itemClicked(null, productContent.fileIdToDelete, "file");
        productContent.fileTypes = 1;
        productContent.fileIdToDelete = productContent.selectedIndex;

        // Delete the file
        ajax.call(mainPathApi+"CmsFileContent/getviewmodel", productContent.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(mainPathApi+'CmsFileContent/delete', response1.Item, 'DELETE').success(function (response2) {
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(mainPathApi+"CmsFileContent/getviewmodel", "0", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                productContent.FileItem = response3.Item;
                                productContent.FileItem.FileName = name;
                                productContent.FileItem.Extension = name.split('.').pop();
                                productContent.FileItem.FileSrc = name;
                                productContent.FileItem.LinkCategoryId = productContent.thisCategory;
                                productContent.saveNewFile();
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
    productContent.saveNewFile = function () {
        ajax.call(mainPathApi+"CmsFileContent/add", productContent.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                productContent.FileItem = response.Item;
                productContent.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            productContent.showErrorIcon();
            return -1;
        });
    }

    productContent.showSuccessIcon = function () {
    }

    productContent.showErrorIcon = function () {
    }
    //file is exist
    productContent.fileIsExist = function (fileName) {
        for (var i = 0; i < productContent.FileList.length; i++) {
            if (productContent.FileList[i].FileName == fileName) {
                productContent.fileIdToDelete = productContent.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    productContent.getFileItem = function (id) {
        for (var i = 0; i < productContent.FileList.length; i++) {
            if (productContent.FileList[i].Id == id) {
                return productContent.FileList[i];
            }
        }
    }

    //select file or folder
    productContent.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            productContent.fileTypes = 1;
            productContent.selectedFileId = productContent.getFileItem(index).Id;
            productContent.selectedFileName = productContent.getFileItem(index).FileName;
        }
        else {
            productContent.fileTypes = 2;
            productContent.selectedCategoryId = productContent.getCategoryName(index).Id;
            productContent.selectedCategoryTitle = productContent.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        productContent.selectedIndex = index;

    };
//upload file Podcast
    productContent.uploadFilePodcast = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (productContent.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ productContent.replaceFile(uploadFile.name);
                    productContent.itemClicked(null, productContent.fileIdToDelete, "file");
                    productContent.fileTypes = 1;
                    productContent.fileIdToDelete = productContent.selectedIndex;
                     // replace the file
            ajax
              .call(
                mainPathApi+"CmsFileContent/getviewmodel",
                productContent.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(mainPathApi+"CmsFileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        productContent.FileItem = response2.Item;
                        productContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        productContent.filePickerFilePodcast.filename =
                          productContent.FileItem.FileName;
                        productContent.filePickerFilePodcast.fileId =
                          response2.Item.Id;
                        productContent.selectedItem.LinkFilePodcastId =
                          productContent.filePickerFilePodcast.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      productContent.showErrorIcon();
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
                    productContent.FileItem = response.Item;
                    productContent.FileItem.FileName = uploadFile.name;
                    productContent.FileItem.uploadName = uploadFile.uploadName;
                    productContent.FileItem.Extension = uploadFile.name.split('.').pop();
                    productContent.FileItem.FileSrc = uploadFile.name;
                    productContent.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- productContent.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(mainPathApi+"CmsFileContent/add", productContent.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            productContent.FileItem = response.Item;
                            productContent.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            productContent.filePickerFilePodcast.filename = productContent.FileItem.FileName;
                            productContent.filePickerFilePodcast.fileId = response.Item.Id;
                            productContent.selectedItem.LinkFilePodcastId = productContent.filePickerFilePodcast.fileId

                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        productContent.showErrorIcon();
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
    productContent.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (productContent.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ productContent.replaceFile(uploadFile.name);
                    productContent.itemClicked(null, productContent.fileIdToDelete, "file");
                    productContent.fileTypes = 1;
                    productContent.fileIdToDelete = productContent.selectedIndex;
                     // replace the file
            ajax
              .call(
                mainPathApi+"CmsFileContent/getviewmodel",
                productContent.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(mainPathApi+"CmsFileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        productContent.FileItem = response2.Item;
                        productContent.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        productContent.filePickerMainImage.filename =
                          productContent.FileItem.FileName;
                        productContent.filePickerMainImage.fileId =
                          response2.Item.Id;
                        productContent.selectedItem.LinkMainImageId =
                          productContent.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      productContent.showErrorIcon();
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
                    productContent.FileItem = response.Item;
                    productContent.FileItem.FileName = uploadFile.name;
                    productContent.FileItem.uploadName = uploadFile.uploadName;
                    productContent.FileItem.Extension = uploadFile.name.split('.').pop();
                    productContent.FileItem.FileSrc = uploadFile.name;
                    productContent.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- productContent.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(mainPathApi+"CmsFileContent/add", productContent.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            productContent.FileItem = response.Item;
                            productContent.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            productContent.filePickerMainImage.filename = productContent.FileItem.FileName;
                            productContent.filePickerMainImage.fileId = response.Item.Id;
                            productContent.selectedItem.LinkMainImageId = productContent.filePickerMainImage.fileId;
                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        productContent.showErrorIcon();
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
    productContent.exportFile = function () {
        productContent.addRequested = true;
        productContent.gridOptions.advancedSearchData.engine.ExportFile = productContent.ExportFileClass;
        ajax.call(mainPathApi+'productContent/exportfile', productContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            productContent.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                productContent.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //productContent.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    productContent.toggleExportForm = function () {
        productContent.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        productContent.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        productContent.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        productContent.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        productContent.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleProduct/ProductContent/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    productContent.rowCountChanged = function () {
        if (!angular.isDefined(productContent.ExportFileClass.RowCount) || productContent.ExportFileClass.RowCount > 5000)
            productContent.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    productContent.getCount = function () {
        ajax.call(mainPathApi+"productContent/count", productContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            productContent.addRequested = false;
            rashaErManage.checkAction(response);
            productContent.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            productContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    productContent.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(mainPathApi+"CmsFileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            productContent.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //TreeControl
    productContent.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (productContent.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    productContent.onNodeToggle = function (node, expanded) {
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

    productContent.onSelection = function (node, selected) {
        if (!selected) {
            productContent.selectedItem.LinkMainImageId = null;
            productContent.selectedItem.previewImageSrc = null;
            return;
        }
        productContent.selectedItem.LinkMainImageId = node.Id;
        productContent.selectedItem.previewImageSrc = "CmsFiles/img/loader.gif";
        ajax.call(mainPathApi+"CmsFileContent/getviewmodel", node.Id, "GET").success(function (response) {
            productContent.selectedItem.previewImageSrc = "/files/" + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);