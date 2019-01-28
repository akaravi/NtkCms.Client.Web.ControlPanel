app.controller("newsContentController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var newsContent = this;
    //For Grid Options
    newsContent.gridOptions = {};
    newsContent.selectedItem = {};
    newsContent.attachedFiles = [];
    newsContent.attachedFile = "";

    newsContent.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    newsContent.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    if (itemRecordStatus != undefined) newsContent.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    newsContent.selectedItem.ToDate = date;
    newsContent.datePickerConfig = {
        defaultDate: date
    };
    newsContent.startDate = {
        defaultDate: date
    }
    newsContent.endDate = {
        defaultDate: date
    }

    //news Grid Options
    newsContent.gridOptions = {
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
            { name: 'ViewCount', displayName: 'تعداد بازدید', sortable: true, visible: true },
            { name: "ActionKey", displayName: "کلیدعملیاتی", displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="newsContent.addMenu()"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }
    //Comment Grid Options
    newsContent.gridContentOptions = {
        columns: [
           { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
           { name: 'Writer', displayName: 'نویسنده', sortable: true, type: 'string' },
           { name: 'Comment', displayName: 'کامنت', sortable: true, type: 'string' },
           {
               name: 'ActionButtons', displayName: 'کلید عملیاتی', template: '<Button ng-if="!x.IsActivated" ng-click="newsContent.confirmComment(x)" class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp&nbspتأیید</Button>' +
                                                                                              '<Button ng-if="x.IsActivated" ng-click="newsContent.doNotConfirmComment(x)" class="btn btn-warning" style="margin-left: 2px;"><i class="fa fa-square-o"></i>&nbsp&nbspتأیید</Button>' +
                                                                                              '<Button ng-click="newsContent.deleteComment(x)" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i>&nbsp&nbspحذف</Button>'
           },
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

    //#tagsInput -----
    newsContent.onTagAdded = function (tag) {
        if (!angular.isDefined(tag.id)) {    //Check if this a new or a existing tag (existing tags comprise with an id)
            var tagObject = jQuery.extend({}, newsContent.ModuleTag);   //#Clone a Javascript Object
            tagObject.Title = tag.text;
            ajax.call('/api/newsTag/add', tagObject, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                if (response.IsSuccess) {
                    newsContent.tags[newsContent.tags.length - 1] = { id: response.Item.Id, text: response.Item.Title };  //Replace the newly added tag (last in the array) with a new object including its Id
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }
    }

    //For Show Category Loading Indicator
    newsContent.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show news Loading Indicator
    newsContent.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    newsContent.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    newsContent.addMenu = function () {
        $modal.open({
            templateUrl: "cpanelv1/Modulenews/newsContent/modalMenu.html",
            scope: $scope
        });
    }

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

        newsContent.categoryBusyIndicator.isActive = true;
        ajax.call(mainPathApi+"newsCategory/getall", engine, 'POST').success(function (response) {
            newsContent.treeConfig.Items = response.ListItems;
            newsContent.treeConfig.Items = response.ListItems;
            newsContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {

            console.log(data);

        });

        newsContent.contentBusyIndicator.isActive = true;
        ajax.call(mainPathApi+"newsContent/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            newsContent.ListItems = response.ListItems;
            newsContent.gridOptions.fillData(newsContent.ListItems, response.resultAccess); // Sending Access as an argument
            newsContent.contentBusyIndicator.isActive = false;
            newsContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            newsContent.gridOptions.totalRowCount = response.TotalRowCount;
            newsContent.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            newsContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            newsContent.contentBusyIndicator.isActive = false;
        });
        ajax.call(mainPathApi+"newsTag/getviewmodel", "0", 'GET').success(function (response) {    //Get a ViewModel for newsTag
            newsContent.ModuleTag = response.Item;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(mainPathApi+"newsContentTag/getviewmodel", "0", 'GET').success(function (response) { //Get a ViewModel for newsContentTag
            newsContent.ModuleContentTag = response.Item;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    };

    // For Show Comments
    newsContent.showComment = function () {

        if (newsContent.gridOptions.selectedRow.item) {
            //var id = newsContent.gridOptions.selectedRow.item.Id;

            var Filter_value = {
                PropertyName: "LinknewsContentId",
                IntValue1: newsContent.gridOptions.selectedRow.item.Id,
                SearchType: 0
            }
            newsContent.gridContentOptions.advancedSearchData.engine.Filters = null;
            newsContent.gridContentOptions.advancedSearchData.engine.Filters = [];
            newsContent.gridContentOptions.advancedSearchData.engine.Filters.push(Filter_value);


            ajax.call(mainPathApi+'newsComment/getall', newsContent.gridContentOptions.advancedSearchData.engine, 'POST').success(function (response) {
                newsContent.listComments = response.ListItems;
                //newsContent.gridOptions.resultAccess = response.resultAccess; // دسترسی ها نمایش
                newsContent.gridContentOptions.fillData(newsContent.listComments, response.resultAccess);
                newsContent.gridContentOptions.currentPageNumber = response.CurrentPageNumber;
                newsContent.gridContentOptions.totalRowCount = response.TotalRowCount;
                newsContent.allowedSearch = response.AllowedSearchField;
                rashaErManage.checkAction(response);
                newsContent.gridContentOptions.RowPerPage = response.RowPerPage;
                newsContent.showGridComment = true;
                newsContent.Title = newsContent.gridOptions.selectedRow.item.Title;
            });
        }
    }

    newsContent.gridOptions.onRowSelected = function () {
        var item = newsContent.gridOptions.selectedRow.item;
        newsContent.showComment(item);
    }

    newsContent.gridContentOptions.onRowSelected = function () { }

    // Open Add Category Modal 
    newsContent.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        newsContent.addRequested = false;
        buttonIsPressed = true;
        ajax.call(mainPathApi+'newsCategory/getviewmodel', "0", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            newsContent.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulenews/NewsCategory/add.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Open Edit Category Modal
    newsContent.EditCategoryModel = function () {
        if (buttonIsPressed) { return };
        newsContent.addRequested = false;
        newsContent.modalTitle = 'ویرایش';
        if (!newsContent.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Category_To_Edit'));
            return;
        }

        newsContent.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(mainPathApi+'newsCategory/getviewmodel', newsContent.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            newsContent.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            newsContent.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/Modulenews/NewsCategory/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Category
    newsContent.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        newsContent.categoryBusyIndicator.isActive = true;
        newsContent.addRequested = true;
        newsContent.selectedItem.LinkParentId = null;
        if (newsContent.treeConfig.currentNode != null)
            newsContent.selectedItem.LinkParentId = newsContent.treeConfig.currentNode.Id;
        ajax.call(mainPathApi+'newsCategory/add', newsContent.selectedItem, 'POST').success(function (response) {
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
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsContent.addRequested = false;
            newsContent.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Category REST Api
    newsContent.EditCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        newsContent.categoryBusyIndicator.isActive = true;
        newsContent.addRequested = true;
        ajax.call(mainPathApi+'newsCategory/edit', newsContent.selectedItem, 'PUT').success(function (response) {
            //newsContent.showbusy = false;
            newsContent.treeConfig.showbusy = false;
            newsContent.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                newsContent.treeConfig.currentNode.Title = response.Item.Title;
                newsContent.closeModal();
            }
            newsContent.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsContent.addRequested = false;
            newsContent.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    newsContent.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = newsContent.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Category_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                newsContent.categoryBusyIndicator.isActive = true;
                // console.log(node.gridOptions.selectedRow.item);
                buttonIsPressed = true;
                ajax.call(mainPathApi+'newsCategory/getviewmodel', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    newsContent.selectedItemForDelete = response.Item;
                    console.log(newsContent.selectedItemForDelete);
                    ajax.call(mainPathApi+'newsCategory/delete', newsContent.selectedItemForDelete, 'DELETE').success(function (res) {
                        newsContent.categoryBusyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            //newsContent.replaceCategoryItem(newsContent.treeConfig.Items, node.Id);
                            console.log("Deleted Successfully !");
                            newsContent.gridOptions.advancedSearchData.engine.Filters = null;
                            newsContent.gridOptions.advancedSearchData.engine.Filters = [];
                            newsContent.gridOptions.fillData();
                            newsContent.gridOptions.reGetAll();
                        }
                        else { //Error occurred
                            if (res.ErrorType == 15)
                                rashaErManage.showMessage($filter('translate')('Unable_To_Delete_The_Category_Contains_Content'));
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        newsContent.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    newsContent.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

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
        if(node !=null && node != undefined)
        {
            newsContent.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            newsContent.contentBusyIndicator.isActive = true;
            //newsContent.gridOptions.advancedSearchData = {};
            newsContent.attachedFiles = null;
            newsContent.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryId",
                IntValue1: node.Id,
                SearchType: 0
            }
            newsContent.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(mainPathApi+"newsContent/getall", newsContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            newsContent.contentBusyIndicator.isActive = false;
            newsContent.ListItems = response.ListItems;
            newsContent.gridOptions.fillData(newsContent.ListItems, response.resultAccess); // Sending Access as an argument
            newsContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            newsContent.gridOptions.totalRowCount = response.TotalRowCount;
            newsContent.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            newsContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    newsContent.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = newsContent.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translate')('To_Add_A_News_Please_Select_The_Category'));
            buttonIsPressed = false;
            return;
        }

        newsContent.attachedFiles = [];
        newsContent.attachedFile = "";
        newsContent.filePickerMainImage.filename = "";
        newsContent.filePickerMainImage.fileId = null;
        newsContent.filePickerFiles.filename = "";
        newsContent.filePickerFiles.fileId = null;
        newsContent.tags = [];   //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
        newsContent.kwords = [];   //tagsInput خالی کردن آرایه کلمات کلیدی برای محتوای جدید
        newsContent.addRequested = false;
        newsContent.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(mainPathApi+'newsContent/getviewmodel', "0", 'GET').success(function (response) {
            buttonIsPressed = false;
            console.log(response);
            rashaErManage.checkAction(response);
            newsContent.selectedItem = response.Item;
            newsContent.selectedItem.LinkCategoryId = node.Id;
            newsContent.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/Modulenews/newsContent/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    newsContent.openEditModel = function () {
        if (buttonIsPressed) { return };
        newsContent.addRequested = false;
        newsContent.modalTitle = 'ویرایش';
        if (!newsContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(mainPathApi+'newsContent/getviewmodel', newsContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            newsContent.selectedItem = response1.Item;
            newsContent.startDate.defaultDate = newsContent.selectedItem.FromDate;
            newsContent.endDate.defaultDate = newsContent.selectedItem.ToDate;
            newsContent.filePickerMainImage.filename = null;
            newsContent.filePickerMainImage.fileId = null;
            if (response1.Item.LinkMainImageId != null) {
                ajax.call(mainPathApi+'CmsFileContent/getviewmodel', response1.Item.LinkMainImageId, 'GET').success(function (response2) {
                    buttonIsPressed = false;
                    newsContent.filePickerMainImage.filename = response2.Item.FileName;
                    newsContent.filePickerMainImage.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            newsContent.parseFileIds(response1.Item.LinkFileIds);
            newsContent.filePickerFiles.filename = null;
            newsContent.filePickerFiles.fileId = null;
            //Load tagsInput
            newsContent.tags = [];  //Clear out previous tags
            if (newsContent.selectedItem.ContentTags == null)
                newsContent.selectedItem.ContentTags = [];
            $.each(newsContent.selectedItem.ContentTags, function (index, item) {
                if (item.ModuleTag != null)
                    newsContent.tags.push({ id: item.ModuleTag.Id, text: item.ModuleTag.Title });  //Add current content's tag to tags array with id and title
            });
            //Load Keywords tagsInput
            newsContent.kwords = [];  //Clear out previous tags
            var arraykwords = [];
            if (newsContent.selectedItem.Keyword != null && newsContent.selectedItem.Keyword != "")
                arraykwords = newsContent.selectedItem.Keyword.split(',');
            $.each(arraykwords, function (index, item) {
                if (item != null)
                    newsContent.kwords.push({ text: item });  //Add current content's tag to tags array with id and title
            });
            $modal.open({
                templateUrl: 'cpanelv1/Modulenews/newsContent/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    newsContent.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        newsContent.categoryBusyIndicator.isActive = true;
        newsContent.addRequested = true;

        //Save attached file ids into newsContent.selectedItem.LinkFileIds
        newsContent.selectedItem.LinkFileIds = "";
        newsContent.stringfyLinkFileIds();
        //Save Keywords
        $.each(newsContent.kwords, function (index, item) {
            if (index == 0)
                newsContent.selectedItem.Keyword = item.text;
            else
                newsContent.selectedItem.Keyword += ',' + item.text;
        });
        if (newsContent.selectedItem.LinkCategoryId == null || newsContent.selectedItem.LinkCategoryId == 0) {
            rashaErManage.showMessage($filter('translate')('To_Add_A_News_Please_Select_The_Category'));
            return;
        }
        ajax.call(mainPathApi+'newsContent/add', newsContent.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            newsContent.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                newsContent.ListItems.unshift(response.Item);
                newsContent.gridOptions.fillData(newsContent.ListItems);
                newsContent.closeModal();
                //Save inputTags
                newsContent.selectedItem.ContentTags = [];
                $.each(newsContent.tags, function (index, item) {
                    var newObject = $.extend({}, newsContent.ModuleContentTag);
                    newObject.LinkTagId = item.id;
                    newObject.LinkContentId = response.Item.Id;
                    newsContent.selectedItem.ContentTags.push(newObject);
                });
                ajax.call(mainPathApi+'newsContentTag/addbatch', newsContent.selectedItem.ContentTags, 'POST').success(function (response) {
                    console.log(response);
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsContent.addRequested = false;
            newsContent.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    newsContent.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        newsContent.categoryBusyIndicator.isActive = true;
        newsContent.addRequested = true;
        //Save attached file ids into newsContent.selectedItem.LinkFileIds
        newsContent.selectedItem.LinkFileIds = "";
        newsContent.stringfyLinkFileIds();
        //Save Keywords
        $.each(newsContent.kwords, function (index, item) {
            if (index == 0)
                newsContent.selectedItem.Keyword = item.text;
            else
                newsContent.selectedItem.Keyword += ',' + item.text;
        });
        //Save inputTags
        newsContent.selectedItem.ContentTags = [];
        $.each(newsContent.tags, function (index, item) {
            var newObject = $.extend({}, newsContent.ModuleContentTag);
            newObject.LinkTagId = item.id;
            newObject.LinkContentId = newsContent.selectedItem.Id;
            newsContent.selectedItem.ContentTags.push(newObject);
        });
        if (newsContent.selectedItem.LinkCategoryId == null || newsContent.selectedItem.LinkCategoryId == 0) {
            rashaErManage.showMessage($filter('translate')('To_Add_A_News_Please_Select_The_Category'));
            return;
        }
        ajax.call(mainPathApi+'newsContent/edit', newsContent.selectedItem, 'PUT').success(function (response) {
            newsContent.categoryBusyIndicator.isActive = false;
            newsContent.addRequested = false;
            newsContent.treeConfig.showbusy = false;
            newsContent.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                newsContent.replaceItem(newsContent.selectedItem.Id, response.Item);
                newsContent.gridOptions.fillData(newsContent.ListItems);
                newsContent.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            newsContent.addRequested = false;
            newsContent.categoryBusyIndicator.isActive = false;
        });
    }
    // Delete a news Content 
    newsContent.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!newsContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        newsContent.treeConfig.showbusy = true;
        newsContent.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                newsContent.categoryBusyIndicator.isActive = true;
                console.log(newsContent.gridOptions.selectedRow.item);
                newsContent.showbusy = true;
                newsContent.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(mainPathApi+"newsContent/getviewmodel", newsContent.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    newsContent.showbusy = false;
                    newsContent.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    newsContent.selectedItemForDelete = response.Item;
                    console.log(newsContent.selectedItemForDelete);
                    ajax.call(mainPathApi+"newsContent/delete", newsContent.selectedItemForDelete, "DELETE").success(function (res) {
                        newsContent.categoryBusyIndicator.isActive = false;
                        newsContent.treeConfig.showbusy = false;
                        newsContent.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            newsContent.replaceItem(newsContent.selectedItemForDelete.Id);
                            newsContent.gridOptions.fillData(newsContent.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        newsContent.treeConfig.showbusy = false;
                        newsContent.showIsBusy = false;
                        newsContent.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    newsContent.treeConfig.showbusy = false;
                    newsContent.showIsBusy = false;
                    newsContent.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }

    //Confirm/UnConfirm news Content
    newsContent.confirmUnConfirmnewsContent = function () {
        if (!newsContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }
        ajax.call(mainPathApi+'newsContent/getviewmodel', newsContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            newsContent.selectedItem = response.Item;
            newsContent.selectedItem.IsAccepted = (response.Item.IsAccepted == true) ? false : true;
            ajax.call(mainPathApi+'newsContent/edit', newsContent.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = newsContent.ListItems.indexOf(newsContent.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        newsContent.ListItems[index] = response2.Item;
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
    newsContent.enableArchive = function () {
        if (!newsContent.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }

        ajax.call(mainPathApi+'newsContent/getviewmodel', newsContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            newsContent.selectedItem = response.Item;
            newsContent.selectedItem.IsArchive = (response.Item.IsArchive == true) ? false : true;
            ajax.call(mainPathApi+'newsContent/edit', newsContent.selectedItem, 'PUT').success(function (response2) {
                newsContent.categoryBusyIndicator.isActive = true;
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = newsContent.ListItems.indexOf(newsContent.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        newsContent.ListItems[index] = response2.Item;
                    }
                    console.log("Arshived Succsseffully");
                    newsContent.categoryBusyIndicator.isActive = false;
                }

            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                newsContent.categoryBusyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
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
        if (newItem)
            newsContent.ListItems.unshift(newItem);
    }

    newsContent.summernoteOptions = {
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

    //newsContent.summernoteText = '<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />';

    newsContent.searchData = function () {
        newsContent.categoryBusyIndicator.isActive = true;
        ajax.call(mainPathApi+"newsContent/getall", newsContent.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            newsContent.categoryBusyIndicator.isActive = false;
            newsContent.ListItems = response.ListItems;
            newsContent.gridOptions.fillData(newsContent.ListItems);
            newsContent.gridOptions.currentPageNumber = response.CurrentPageNumber;
            newsContent.gridOptions.totalRowCount = response.TotalRowCount;
            newsContent.gridOptions.rowPerPage = response.RowPerPage;
            newsContent.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            newsContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    newsContent.addRequested = false;
    newsContent.closeModal = function () {
        $modalStack.dismissAll();
    };

    newsContent.showIsBusy = false;

    //Aprove a comment
    newsContent.confirmComment = function (item) {
        console.log("This comment will be confirmed:", item);
    }

    //Decline a comment
    newsContent.doNotConfirmComment = function (item) {
        console.log("This comment will not be confirmed:", item);

    }
    //Remove a comment
    newsContent.deleteComment = function (item) {
        if (!newsContent.gridContentOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        newsContent.treeConfig.showbusy = true;
        newsContent.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translate')('Warning')), "آیا می خواهید این نظر را حذف کنید", function (isConfirmed) {
            if (isConfirmed) {
                console.log("Item to be deleted: ", newsContent.gridOptions.selectedRow.item);
                newsContent.showbusy = true;
                newsContent.showIsBusy = true;
                ajax.call(mainPathApi+'newsContent/getviewmodel', newsContent.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    newsContent.showbusy = false;
                    newsContent.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    newsContent.selectedItemForDelete = response.Item;
                    console.log(newsContent.selectedItemForDelete);
                    ajax.call(mainPathApi+'newsContent/delete', newsContent.selectedItemForDelete, 'DELETE').success(function (res) {
                        newsContent.treeConfig.showbusy = false;
                        newsContent.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            newsContent.replaceItem(newsContent.selectedItemForDelete.Id);
                            newsContent.gridOptions.fillData(newsContent.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        newsContent.treeConfig.showbusy = false;
                        newsContent.showIsBusy = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    newsContent.treeConfig.showbusy = false;
                    newsContent.showIsBusy = false;
                });
            }
        });
    }

    //For reInit Categories
    newsContent.gridOptions.reGetAll = function () {
        if (newsContent.gridOptions.advancedSearchData.engine.Filters.length > 0) newsContent.searchData();
        else newsContent.init();
    };

    newsContent.isCurrentNodeEmpty = function () {
        return !angular.equals({}, newsContent.treeConfig.currentNode);
    }

    newsContent.loadFileAndFolder = function (item) {
        newsContent.treeConfig.currentNode = item;
        console.log(item);
        newsContent.treeConfig.onNodeSelect(item);
    }

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
                var element = $("#" + newsContent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                newsContent.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < newsContent.gridOptions.columns.length; i++) {
                var element = $("#" + newsContent.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + newsContent.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < newsContent.gridOptions.columns.length; i++) {
            console.log(newsContent.gridOptions.columns[i].name.concat(".visible: "), newsContent.gridOptions.columns[i].visible);
        }
        newsContent.gridOptions.columnCheckbox = !newsContent.gridOptions.columnCheckbox;
    }

    newsContent.deleteAttachedFile = function (index) {
        newsContent.attachedFiles.splice(index, 1);
    }

    newsContent.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !newsContent.alreadyExist(id, newsContent.attachedFiles) && fname != null && fname != "") {
            var fId = id;
            var file = { id: fId, name: fname };
            newsContent.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    newsContent.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translate')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    newsContent.filePickerMainImage.removeSelectedfile = function (config) {
        newsContent.filePickerMainImage.fileId = null;
        newsContent.filePickerMainImage.filename = null;
        newsContent.selectedItem.LinkMainImageId = null;

    }

    newsContent.filePickerFiles.removeSelectedfile = function (config) {
        newsContent.filePickerFiles.fileId = null;
        newsContent.filePickerFiles.filename = null;
    }




    newsContent.showUpload = function () { $("#fastUpload").fadeToggle(); }

    // ----------- FilePicker Codes --------------------------------
    newsContent.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !newsContent.alreadyExist(id, newsContent.attachedFiles)) {
            var fId = id;
            var file = { fileId: fId, filename: fname };
            newsContent.attachedFiles.push(file);
            newsContent.clearfilePickers();
        }
    }

    newsContent.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translate')('This_Item_Has_Already_Been_Added'));
                newsContent.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    newsContent.deleteAttachedfieldName = function (index) {
        ajax.call(mainPathApi+'newsContent/delete', newsContent.contractsList[index], 'DELETE').success(function (res) {
            rashaErManage.checkAction(res);
            if (res.IsSuccess) {
                newsContent.contractsList.splice(index, 1);
                rashaErManage.showMessage($filter('translate')('Removed_Successfully'));
            }
        }).error(function (data2, errCode2, c2, d2) {
            rashaErManage.checkAction(data2);
        });
    }

    newsContent.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(mainPathApi+'CmsFileContent/getviewmodel', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            newsContent.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    newsContent.clearfilePickers = function () {
        newsContent.filePickerFiles.fileId = null;
        newsContent.filePickerFiles.filename = null;
    }

    newsContent.stringfyLinkFileIds = function () {
        $.each(newsContent.attachedFiles, function (i, item) {
            if (newsContent.selectedItem.LinkFileIds == "")
                newsContent.selectedItem.LinkFileIds = item.fileId;
            else
                newsContent.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    newsContent.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/Modulenews/newsContent/upload_modal.html',
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
    }

    newsContent.whatcolor = function (progress) {
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

    newsContent.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    newsContent.replaceFile = function (name) {
        newsContent.itemClicked(null, newsContent.fileIdToDelete, "file");
        newsContent.fileTypes = 1;
        newsContent.fileIdToDelete = newsContent.selectedIndex;

        // Delete the file
        ajax.call(mainPathApi+"CmsFileContent/getviewmodel", newsContent.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(mainPathApi+'CmsFileContent/delete', response1.Item, 'DELETE').success(function (response2) {
                    newsContent.remove(newsContent.FileList, newsContent.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(mainPathApi+"CmsFileContent/getviewmodel", "0", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                newsContent.FileItem = response3.Item;
                                newsContent.FileItem.FileName = name;
                                newsContent.FileItem.Extension = name.split('.').pop();
                                newsContent.FileItem.FileSrc = name;
                                newsContent.FileItem.LinkCategoryId = newsContent.thisCategory;
                                newsContent.saveNewFile();
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
    newsContent.saveNewFile = function () {
        ajax.call(mainPathApi+"CmsFileContent/add", newsContent.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                newsContent.FileItem = response.Item;
                newsContent.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            newsContent.showErrorIcon();
            return -1;
        });
    }

    newsContent.showSuccessIcon = function () {
    }

    newsContent.showErrorIcon = function () {

    }
    //file is exist
    newsContent.fileIsExist = function (fileName) {
        for (var i = 0; i < newsContent.FileList.length; i++) {
            if (newsContent.FileList[i].FileName == fileName) {
                newsContent.fileIdToDelete = newsContent.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    newsContent.getFileItem = function (id) {
        for (var i = 0; i < newsContent.FileList.length; i++) {
            if (newsContent.FileList[i].Id == id) {
                return newsContent.FileList[i];
            }
        }
    }

    //select file or folder
    newsContent.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            newsContent.fileTypes = 1;
            newsContent.selectedFileId = newsContent.getFileItem(index).Id;
            newsContent.selectedFileName = newsContent.getFileItem(index).FileName;
        }
        else {
            newsContent.fileTypes = 2;
            newsContent.selectedCategoryId = newsContent.getCategoryName(index).Id;
            newsContent.selectedCategoryTitle = newsContent.getCategoryName(index).Title;
        }
        newsContent.selectedIndex = index;
    };

    newsContent.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    //upload file
    newsContent.uploadFile = function (index, uploadFile) {
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
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(mainPathApi+"CmsFileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
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
                    .error(function(data) {
                      newsContent.showErrorIcon();
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
                            newsContent.filePickerMainImage.filename = newsContent.FileItem.FileName;
                            newsContent.filePickerMainImage.fileId = response.Item.Id;
                            newsContent.selectedItem.LinkMainImageId = newsContent.filePickerMainImage.fileId

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

    //Export Report 
    newsContent.exportFile = function () {
        newsContent.addRequested = true;
        newsContent.gridOptions.advancedSearchData.engine.ExportFile = newsContent.ExportFileClass;
        ajax.call(mainPathApi+'newsContent/exportfile', newsContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            newsContent.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                newsContent.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //newsContent.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    newsContent.toggleExportForm = function () {
        newsContent.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        newsContent.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        newsContent.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        newsContent.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        newsContent.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleNews/NewsContent/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    newsContent.rowCountChanged = function () {
        if (!angular.isDefined(newsContent.ExportFileClass.RowCount) || newsContent.ExportFileClass.RowCount > 5000)
            newsContent.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    newsContent.getCount = function () {
        ajax.call(mainPathApi+"newsContent/count", newsContent.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            newsContent.addRequested = false;
            rashaErManage.checkAction(response);
            newsContent.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            newsContent.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    newsContent.showCategoryImage = function (mainImageId) {
        if (mainImageId == 0 || mainImageId == null)
            return;
        ajax.call(mainPathApi+"CmsFileContent/PreviewImage", { id: mainImageId, name: '' }, 'POST').success(function (response) {
            newsContent.selectedItem.MainImageSrc = response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);
