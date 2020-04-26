app.controller("productSalePriceController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $filter) {
    var shopSalePrice = this;
    //For Grid Options
    shopSalePrice.gridOptions = {};
    shopSalePrice.selectedItem = {};
    shopSalePrice.attachedFiles = [];
    shopSalePrice.attachedFile = "";

    if (itemRecordStatus != undefined) shopSalePrice.itemRecordStatus = itemRecordStatus;

    shopSalePrice.filePickerMainImage = {
        isActive: true,
        backElement: 'filePickerMainImage',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    shopSalePrice.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    var date = moment().format();
    shopSalePrice.selectedItem.ToDate = date;
    shopSalePrice.datePickerConfig = {
        defaultDate: date
    };
    shopSalePrice.startDate = {
        defaultDate: date
    }
    shopSalePrice.endDate = {
        defaultDate: date
    }
    shopSalePrice.count = 0;

    //Product Grid Options
    shopSalePrice.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: 'true' },
            { name: 'FromDate', displayName: 'تاریخ آغاز', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'ToDate', displayName: 'تاریخ پایان', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: "ActionKey", displayName: "کلیدعملیاتی", displayForce: true, template: '<Button ng-if="!x.IsActivated" ng-click="shopSalePrice.addMenu()"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>' }
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

    //#tagsInput -----
    shopSalePrice.onTagAdded = function (tag) {
        if (!angular.isDefined(tag.id)) {    //Check if this a new or a existing tag (existing tags comprise with an id)
            var tagObject = jQuery.extend({}, shopSalePrice.ModuleTag);   //#Clone a Javascript Object
            tagObject.Title = tag.text;
            ajax.call('/api/productTag/add', tagObject, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                if (response.IsSuccess) {
                    shopSalePrice.tags[shopSalePrice.tags.length - 1] = { id: response.Item.Id, text: response.Item.Title };  //Replace the newly added tag (last in the array) with a new object including its Id
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }
    }
    shopSalePrice.onTagRemoved = function (tag) { }
    //End of #tagsInput

    //For Show Category Loading Indicator
    shopSalePrice.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show Product Loading Indicator
    shopSalePrice.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    shopSalePrice.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    //open addMenu modal
    shopSalePrice.addMenu = function () {
        $modal.open({
            templateUrl: "cpanelv1/ModuleProduct/shopSalePrice/modalMenu.html",
            scope: $scope
        });
    }

    shopSalePrice.treeConfig.currentNode = {};

    shopSalePrice.treeBusyIndicator = false;

    shopSalePrice.addRequested = false;

    shopSalePrice.ProductTitle = "";

    //init Function
    shopSalePrice.init = function () {
        shopSalePrice.categoryBusyIndicator.isActive = true;
        var engine = {};
        try {
            engine = shopSalePrice.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error);
        }

        ajax.call(cmsServerConfig.configApiServerPath+"ProductCategory/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            shopSalePrice.treeConfig.Items = response.ListItems;
            shopSalePrice.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"ProductContent/getall", {}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopSalePrice.ListItems = response.ListItems;
            shopSalePrice.gridOptions.fillData(shopSalePrice.ListItems, response.resultAccess); // Sending Access as an argument
            shopSalePrice.contentBusyIndicator.isActive = false;
            shopSalePrice.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopSalePrice.gridOptions.totalRowCount = response.TotalRowCount;
            shopSalePrice.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            shopSalePrice.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            shopSalePrice.contentBusyIndicator.isActive = false;
        });
        ajax.call(cmsServerConfig.configApiServerPath+"productTag/GetViewModel", "", 'GET').success(function (response) {    //Get a ViewModel for productTag
            shopSalePrice.ModuleTag = response.Item;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"shopSalePriceTag/GetViewModel", "", 'GET').success(function (response) { //Get a ViewModel for shopSalePriceTag
            shopSalePrice.ModuleContentTag = response.Item;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    };

    shopSalePrice.gridOptions.onRowSelected = function () {
        var item = shopSalePrice.gridOptions.selectedRow.item;
    }

    // Open Add Category Modal 
    shopSalePrice.addNewCategoryModel = function () {
        if (buttonIsPressed) { return };
        shopSalePrice.addRequested = false;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ProductCategory/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            shopSalePrice.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleProduct/ProductCategory/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Open Edit Category Modal
    shopSalePrice.openEditCategoryModel = function () {
        if (buttonIsPressed) { return };
        shopSalePrice.addRequested = false;
        shopSalePrice.modalTitle = 'ویرایش';
        if (!shopSalePrice.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_edit'));
            return;
        }
        shopSalePrice.contentBusyIndicator.isActive = true;
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ProductCategory/GetOne', shopSalePrice.treeConfig.currentNode.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            shopSalePrice.contentBusyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            shopSalePrice.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleProduct/ProductCategory/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Category
    shopSalePrice.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopSalePrice.categoryBusyIndicator.isActive = true;
        shopSalePrice.addRequested = true;
        shopSalePrice.selectedItem.LinkParentId = null;
        if (shopSalePrice.treeConfig.currentNode != null)
            shopSalePrice.selectedItem.LinkParentId = shopSalePrice.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'ProductCategory/add', shopSalePrice.selectedItem, 'POST').success(function (response) {
            shopSalePrice.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopSalePrice.gridOptions.advancedSearchData.engine.Filters = null;
                shopSalePrice.gridOptions.advancedSearchData.engine.Filters = [];
                shopSalePrice.gridOptions.reGetAll();
                shopSalePrice.closeModal();
            }
            shopSalePrice.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopSalePrice.addRequested = false;
            shopSalePrice.categoryBusyIndicator.isActive = false;
        });
    }

    //Edit Category REST Api
    shopSalePrice.editCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopSalePrice.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ProductCategory/edit', shopSalePrice.selectedItem, 'PUT').success(function (response) {
            shopSalePrice.addRequested = true;
            //shopSalePrice.showbusy = false;
            shopSalePrice.treeConfig.showbusy = false;
            shopSalePrice.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopSalePrice.addRequested = false;
                shopSalePrice.treeConfig.currentNode.Title = response.Item.Title;
                shopSalePrice.closeModal();
            }
            shopSalePrice.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopSalePrice.addRequested = false;
            shopSalePrice.categoryBusyIndicator.isActive = false;

        });
    }

    // Delete a Category
    shopSalePrice.deleteCategory = function () {
        if (buttonIsPressed) { return };
        var node = shopSalePrice.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                shopSalePrice.categoryBusyIndicator.isActive = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'ProductCategory/GetOne', node.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    shopSalePrice.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'ProductCategory/delete', shopSalePrice.selectedItemForDelete, 'POST').success(function (res) {
                        if (res.IsSuccess) {
                            shopSalePrice.gridOptions.advancedSearchData.engine.Filters = null;
                            shopSalePrice.gridOptions.advancedSearchData.engine.Filters = [];
                            shopSalePrice.gridOptions.fillData();
                            shopSalePrice.categoryBusyIndicator.isActive = false;
                            shopSalePrice.gridOptions.reGetAll();
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        shopSalePrice.categoryBusyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    shopSalePrice.categoryBusyIndicator.isActive = false;
                });
            }
        });
    }

    //Tree On Node Select Options
    shopSalePrice.treeConfig.onNodeSelect = function () {
        var node = shopSalePrice.treeConfig.currentNode;
        shopSalePrice.selectContent(node);

    };
    //Show Content with Category Id
    shopSalePrice.selectContent = function (node) {
        shopSalePrice.gridOptions.advancedSearchData.engine.Filters = null;
        shopSalePrice.gridOptions.advancedSearchData.engine.Filters = [];
        if(node !=null && node != undefined)
        {
            shopSalePrice.contentBusyIndicator.message = "در حال بارگذاری مقاله های  دسته " + node.Title;
            shopSalePrice.contentBusyIndicator.isActive = true;
            shopSalePrice.attachedFiles = [];
            var s = {
                PropertyName: "LinkCategoryId",
                IntValue1: node.Id,
                SearchType: 0
            }
            shopSalePrice.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        ajax.call(cmsServerConfig.configApiServerPath+"shopSalePrice/getall", shopSalePrice.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopSalePrice.contentBusyIndicator.isActive = false;
            shopSalePrice.ListItems = response.ListItems;
            shopSalePrice.gridOptions.fillData(shopSalePrice.ListItems, response.resultAccess); // Sending Access as an argument
            shopSalePrice.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopSalePrice.gridOptions.totalRowCount = response.TotalRowCount;
            shopSalePrice.gridOptions.rowPerPage = response.RowPerPage;


        }).error(function (data, errCode, c, d) {
            shopSalePrice.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };
    // Open Add New Content Model
    shopSalePrice.addNewContentModel = function () {
        if (buttonIsPressed) { return };
        var node = shopSalePrice.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('To_Add_The_Article_Please_Select_The_Category'));
            return;
        }

        shopSalePrice.attachedFiles = [];
        shopSalePrice.attachedFile = "";
        shopSalePrice.filePickerMainImage.filename = "";
        shopSalePrice.filePickerMainImage.fileId = null;
        shopSalePrice.filePickerFiles.filename = "";
        shopSalePrice.filePickerFiles.fileId = null;
        shopSalePrice.tags = [];   //tagsInput خالی کردن آرایه تگ ها برای محتوای جدید
        shopSalePrice.kwords = [];   //tagsInput خالی کردن آرایه کلمات کلیدی برای محتوای جدید
        shopSalePrice.addRequested = false;
        shopSalePrice.modalTitle = 'اضافه کردن محتوای جدید';
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopSalePrice/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            shopSalePrice.selectedItem = response.Item;
            shopSalePrice.selectedItem.LinkCategoryId = node.Id;
            shopSalePrice.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleProduct/shopSalePrice/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Edit Content Modal
    shopSalePrice.openEditModel = function () {
        if (buttonIsPressed) { return };
        shopSalePrice.addRequested = false;
        shopSalePrice.modalTitle = 'ویرایش';
        if (!shopSalePrice.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'shopSalePrice/GetOne', shopSalePrice.gridOptions.selectedRow.item.Id, 'GET').success(function (response1) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response1);
            shopSalePrice.selectedItem = response1.Item;
            shopSalePrice.startDate.defaultDate = shopSalePrice.selectedItem.FromDate;
            shopSalePrice.endDate.defaultDate = shopSalePrice.selectedItem.ToDate;
            shopSalePrice.filePickerMainImage.filename = null;
            shopSalePrice.filePickerMainImage.fileId = null;
            if (response1.Item.LinkMainImageId != null) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', response1.Item.LinkMainImageId, 'GET').success(function (response2) {
                    shopSalePrice.filePickerMainImage.filename = response2.Item.FileName;
                    shopSalePrice.filePickerMainImage.fileId = response2.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            shopSalePrice.attachedFiles = [];
            shopSalePrice.parseFileIds(response1.Item.LinkFileIds);
            shopSalePrice.filePickerFiles.filename = null;
            shopSalePrice.filePickerFiles.fileId = null;
            //Load tagsInput
            shopSalePrice.tags = [];  //Clear out previous tags
            if (shopSalePrice.selectedItem.ContentTags == null)
                shopSalePrice.selectedItem.ContentTags = [];
            $.each(shopSalePrice.selectedItem.ContentTags, function (index, item) {
                if (item.ModuleTag != null)
                    shopSalePrice.tags.push({ id: item.ModuleTag.Id, text: item.ModuleTag.Title });  //Add current content's tag to tags array with id and title
            });
            //Load Keywords tagsInput
            shopSalePrice.kwords = [];  //Clear out previous tags
            var arraykwords = [];
            if (shopSalePrice.selectedItem.Keyword != null && shopSalePrice.selectedItem.Keyword != "")
                arraykwords = shopSalePrice.selectedItem.Keyword.split(',');
            $.each(arraykwords, function (index, item) {
                if (item != null)
                    shopSalePrice.kwords.push({ text: item });  //Add current content's tag to tags array with id and title
            });
            $modal.open({
                templateUrl: 'cpanelv1/ModuleProduct/shopSalePrice/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add New Content
    shopSalePrice.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopSalePrice.categoryBusyIndicator.isActive = true;
        shopSalePrice.addRequested = true;

        //Save attached file ids into shopSalePrice.selectedItem.LinkFileIds
        shopSalePrice.selectedItem.LinkFileIds = "";
        shopSalePrice.stringfyLinkFileIds();
        //Save Keywords
        $.each(shopSalePrice.kwords, function (index, item) {
            if (index == 0)
                shopSalePrice.selectedItem.Keyword = item.text;
            else
                shopSalePrice.selectedItem.Keyword += ',' + item.text;
        });
        ajax.call(cmsServerConfig.configApiServerPath+'shopSalePrice/add', shopSalePrice.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopSalePrice.categoryBusyIndicator.isActive = false;
            if (response.IsSuccess) {
                shopSalePrice.ListItems.unshift(response.Item);
                shopSalePrice.gridOptions.fillData(shopSalePrice.ListItems);
                shopSalePrice.closeModal();
                //Save inputTags
                shopSalePrice.selectedItem.ContentTags = [];
                $.each(shopSalePrice.tags, function (index, item) {
                    var newObject = $.extend({}, shopSalePrice.ModuleContentTag);
                    newObject.LinkTagId = item.id;
                    newObject.LinkContentId = response.Item.Id;
                    shopSalePrice.selectedItem.ContentTags.push(newObject);
                });
                ajax.call(cmsServerConfig.configApiServerPath+'shopSalePriceTag/addbatch', shopSalePrice.selectedItem.ContentTags, 'POST').success(function (response) {
                    console.log(response);
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopSalePrice.addRequested = false;
            shopSalePrice.categoryBusyIndicator.isActive = false;

        });
    }

    //Edit Content
    shopSalePrice.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopSalePrice.categoryBusyIndicator.isActive = true;
        shopSalePrice.addRequested = true;

        //Save attached file ids into shopSalePrice.selectedItem.LinkFileIds
        shopSalePrice.selectedItem.LinkFileIds = "";
        shopSalePrice.stringfyLinkFileIds();
        //Save inputTags
        shopSalePrice.selectedItem.ContentTags = [];
        $.each(shopSalePrice.tags, function (index, item) {
            var newObject = $.extend({}, shopSalePrice.ModuleContentTag);
            newObject.LinkTagId = item.id;
            newObject.LinkContentId = shopSalePrice.selectedItem.Id;
            shopSalePrice.selectedItem.ContentTags.push(newObject);
        });
        //Save Keywords
        $.each(shopSalePrice.kwords, function (index, item) {
            if (index == 0)
                shopSalePrice.selectedItem.Keyword = item.text;
            else
                shopSalePrice.selectedItem.Keyword += ',' + item.text;
        });
        ajax.call(cmsServerConfig.configApiServerPath+'shopSalePrice/edit', shopSalePrice.selectedItem, 'PUT').success(function (response) {
            shopSalePrice.categoryBusyIndicator.isActive = false;
            shopSalePrice.addRequested = false;
            shopSalePrice.treeConfig.showbusy = false;
            shopSalePrice.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                shopSalePrice.replaceItem(shopSalePrice.selectedItem.Id, response.Item);
                shopSalePrice.gridOptions.fillData(shopSalePrice.ListItems);
                shopSalePrice.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopSalePrice.addRequested = false;
            shopSalePrice.categoryBusyIndicator.isActive = false;
        });
    }

    // Delete a Product Content 
    shopSalePrice.deleteContent = function () {
        if (buttonIsPressed) return;
        if (!shopSalePrice.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        shopSalePrice.treeConfig.showbusy = true;
        shopSalePrice.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                shopSalePrice.categoryBusyIndicator.isActive = true;
                shopSalePrice.showbusy = true;
                shopSalePrice.showIsBusy = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"shopSalePrice/GetOne", shopSalePrice.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    shopSalePrice.showbusy = false;
                    shopSalePrice.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    shopSalePrice.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+"shopSalePrice/delete", shopSalePrice.selectedItemForDelete, 'POST').success(function (res) {
                        shopSalePrice.categoryBusyIndicator.isActive = false;
                        shopSalePrice.treeConfig.showbusy = false;
                        shopSalePrice.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            shopSalePrice.replaceItem(shopSalePrice.selectedItemForDelete.Id);
                            shopSalePrice.gridOptions.fillData(shopSalePrice.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        shopSalePrice.treeConfig.showbusy = false;
                        shopSalePrice.showIsBusy = false;
                        shopSalePrice.categoryBusyIndicator.isActive = false;

                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    shopSalePrice.treeConfig.showbusy = false;
                    shopSalePrice.showIsBusy = false;
                    shopSalePrice.categoryBusyIndicator.isActive = false;

                });
            }
        });
    }

    //Confirm/UnConfirm Product Content
    shopSalePrice.confirmUnConfirmshopSalePrice = function () {
        if (!shopSalePrice.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'shopSalePrice/GetOne', shopSalePrice.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            shopSalePrice.selectedItem = response.Item;
            shopSalePrice.selectedItem.IsAccepted = (response.Item.IsAccepted == true) ? false : true;
            ajax.call(cmsServerConfig.configApiServerPath+'shopSalePrice/edit', shopSalePrice.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = shopSalePrice.ListItems.indexOf(shopSalePrice.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        shopSalePrice.ListItems[index] = response2.Item;
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
    shopSalePrice.enableArchive = function () {
        if (!shopSalePrice.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک مقاله را انتخاب کنید .");
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'shopSalePrice/GetOne', shopSalePrice.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            shopSalePrice.selectedItem = response.Item;
            shopSalePrice.selectedItem.IsArchive = (response.Item.IsArchive == true) ? false : true;
            ajax.call(cmsServerConfig.configApiServerPath+'shopSalePrice/edit', shopSalePrice.selectedItem, 'PUT').success(function (response2) {
                shopSalePrice.categoryBusyIndicator.isActive = true;
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = shopSalePrice.ListItems.indexOf(shopSalePrice.gridOptions.selectedRow.item);
                    if (index !== -1) {
                        shopSalePrice.ListItems[index] = response2.Item;
                    }
                    shopSalePrice.categoryBusyIndicator.isActive = false;
                }

            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                shopSalePrice.categoryBusyIndicator.isActive = false;
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopSalePrice.categoryBusyIndicator.isActive = false;
        });
    };

    //Replace Item OnDelete/OnEdit Grid Options
    shopSalePrice.replaceItem = function (oldId, newItem) {
        angular.forEach(shopSalePrice.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = shopSalePrice.ListItems.indexOf(item);
                shopSalePrice.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            shopSalePrice.ListItems.unshift(newItem);
    }

    shopSalePrice.summernoteText = '<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />';
    shopSalePrice.searchData = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"shopSalePrice/getall", shopSalePrice.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            shopSalePrice.contentBusyIndicator.isActive = false;
            shopSalePrice.ListItems = response.ListItems;
            shopSalePrice.gridOptions.fillData(shopSalePrice.ListItems);
            shopSalePrice.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopSalePrice.gridOptions.totalRowCount = response.TotalRowCount;
            shopSalePrice.gridOptions.rowPerPage = response.RowPerPage;
            shopSalePrice.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            shopSalePrice.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Close Model Stack
    shopSalePrice.addRequested = false;
    shopSalePrice.closeModal = function () {
        $modalStack.dismissAll();
    };

    shopSalePrice.showIsBusy = false;


    //For reInit Categories
    shopSalePrice.gridOptions.reGetAll = function () {
        if (shopSalePrice.gridOptions.advancedSearchData.engine.Filters.length > 0) shopSalePrice.searchData();
        else shopSalePrice.init();
    };



    shopSalePrice.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            shopSalePrice.focusExpireLockAccount = true;
        });
    };

    shopSalePrice.isCurrentNodeEmpty = function () {
        return !angular.equals({}, shopSalePrice.treeConfig.currentNode);
    }

    shopSalePrice.loadFileAndFolder = function (item) {
        shopSalePrice.treeConfig.currentNode = item;
        shopSalePrice.treeConfig.onNodeSelect(item);
    }
    shopSalePrice.addRequested = true;

    shopSalePrice.columnCheckbox = false;

    shopSalePrice.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = shopSalePrice.gridOptions.columns;
        if (shopSalePrice.gridOptions.columnCheckbox) {
            for (var i = 0; i < shopSalePrice.gridOptions.columns.length; i++) {
                //shopSalePrice.gridOptions.columns[i].visible = $("#" + shopSalePrice.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + shopSalePrice.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                shopSalePrice.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < shopSalePrice.gridOptions.columns.length; i++) {
                var element = $("#" + shopSalePrice.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + shopSalePrice.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < shopSalePrice.gridOptions.columns.length; i++) {
            console.log(shopSalePrice.gridOptions.columns[i].name.concat(".visible: "), shopSalePrice.gridOptions.columns[i].visible);
        }
        shopSalePrice.gridOptions.columnCheckbox = !shopSalePrice.gridOptions.columnCheckbox;
    }

    shopSalePrice.deleteAttachedFile = function (index) {
        shopSalePrice.attachedFiles.splice(index, 1);
    }

    shopSalePrice.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (id != null && id != undefined && !shopSalePrice.alreadyExist(id, shopSalePrice.attachedFiles) && fname != null && fname != "") {
            var file = { id: id, name: fname };
            shopSalePrice.attachedFiles.push(file);
            if (document.getElementsByName("file" + id).length > 1)
                document.getElementsByName("file" + id)[1].textContent = "";
            else
                document.getElementsByName("file" + id)[0].textContent = "";
        }
    }

    shopSalePrice.alreadyExist = function (id, array) {
        for (var i = 0; i < array.length; i++) {
            if (id == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_File_Has_Already_Been_Attachment'));
                return true;
            }
        }
        return false;
    }

    shopSalePrice.filePickerMainImage.removeSelectedfile = function (config) {
        shopSalePrice.filePickerMainImage.fileId = null;
        shopSalePrice.filePickerMainImage.filename = null;
        shopSalePrice.selectedItem.LinkMainImageId = null;

    }

    shopSalePrice.filePickerFiles.removeSelectedfile = function (config) {
        shopSalePrice.filePickerFiles.fileId = null;
        shopSalePrice.filePickerFiles.filename = null;
        shopSalePrice.selectedItem.LinkFileIds = null;
    }

    shopSalePrice.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }



    shopSalePrice.showUpload = function () { $("#fastUpload").fadeToggle(); }

    // ----------- FilePicker Codes --------------------------------
    shopSalePrice.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !shopSalePrice.alreadyExist(id, shopSalePrice.attachedFiles)) {
            var fId = id;
            var file = { fileId: fId, filename: fname };
            shopSalePrice.attachedFiles.push(file);
            shopSalePrice.clearfilePickers();

        }
    }

    shopSalePrice.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                shopSalePrice.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    shopSalePrice.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            shopSalePrice.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    shopSalePrice.clearfilePickers = function () {
        shopSalePrice.filePickerFiles.filename = null;
        shopSalePrice.filePickerFiles.fileId = null;
    }

    shopSalePrice.stringfyLinkFileIds = function () {
        $.each(shopSalePrice.attachedFiles, function (i, item) {
            if (shopSalePrice.selectedItem.LinkFileIds == "")
                shopSalePrice.selectedItem.LinkFileIds = item.fileId;
            else
                shopSalePrice.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


    //---------------Upload Modal-------------------------------
    shopSalePrice.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleProduct/shopSalePrice/upload_modal.html',
            size: 'lg',
            scope: $scope
        });

        shopSalePrice.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            shopSalePrice.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    shopSalePrice.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    shopSalePrice.whatcolor = function (progress) {
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

    shopSalePrice.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }
    // File Manager actions
    shopSalePrice.replaceFile = function (name) {
        shopSalePrice.itemClicked(null, shopSalePrice.fileIdToDelete, "file");
        shopSalePrice.fileTypes = 1;
        shopSalePrice.fileIdToDelete = shopSalePrice.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", shopSalePrice.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                shopSalePrice.FileItem = response3.Item;
                                shopSalePrice.FileItem.FileName = name;
                                shopSalePrice.FileItem.Extension = name.split('.').pop();
                                shopSalePrice.FileItem.FileSrc = name;
                                shopSalePrice.FileItem.LinkCategoryId = shopSalePrice.thisCategory;
                                shopSalePrice.saveNewFile();
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
    shopSalePrice.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", shopSalePrice.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                shopSalePrice.FileItem = response.Item;
                shopSalePrice.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            shopSalePrice.showErrorIcon();
            return -1;
        });
    }

    shopSalePrice.showSuccessIcon = function () {
    }

    shopSalePrice.showErrorIcon = function () {
    }
    //file is exist
    shopSalePrice.fileIsExist = function (fileName) {
        for (var i = 0; i < shopSalePrice.FileList.length; i++) {
            if (shopSalePrice.FileList[i].FileName == fileName) {
                shopSalePrice.fileIdToDelete = shopSalePrice.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    shopSalePrice.getFileItem = function (id) {
        for (var i = 0; i < shopSalePrice.FileList.length; i++) {
            if (shopSalePrice.FileList[i].Id == id) {
                return shopSalePrice.FileList[i];
            }
        }
    }

    //select file or folder
    shopSalePrice.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            shopSalePrice.fileTypes = 1;
            shopSalePrice.selectedFileId = shopSalePrice.getFileItem(index).Id;
            shopSalePrice.selectedFileName = shopSalePrice.getFileItem(index).FileName;
        }
        else {
            shopSalePrice.fileTypes = 2;
            shopSalePrice.selectedCategoryId = shopSalePrice.getCategoryName(index).Id;
            shopSalePrice.selectedCategoryTitle = shopSalePrice.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        shopSalePrice.selectedIndex = index;

    };

    //upload file
    shopSalePrice.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (shopSalePrice.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ shopSalePrice.replaceFile(uploadFile.name);
                    shopSalePrice.itemClicked(null, shopSalePrice.fileIdToDelete, "file");
                    shopSalePrice.fileTypes = 1;
                    shopSalePrice.fileIdToDelete = shopSalePrice.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                shopSalePrice.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        shopSalePrice.FileItem = response2.Item;
                        shopSalePrice.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        shopSalePrice.filePickerMainImage.filename =
                          shopSalePrice.FileItem.FileName;
                        shopSalePrice.filePickerMainImage.fileId =
                          response2.Item.Id;
                        shopSalePrice.selectedItem.LinkMainImageId =
                          shopSalePrice.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      shopSalePrice.showErrorIcon();
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
                    shopSalePrice.FileItem = response.Item;
                    shopSalePrice.FileItem.FileName = uploadFile.name;
                    shopSalePrice.FileItem.uploadName = uploadFile.uploadName;
                    shopSalePrice.FileItem.Extension = uploadFile.name.split('.').pop();
                    shopSalePrice.FileItem.FileSrc = uploadFile.name;
                    shopSalePrice.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- shopSalePrice.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", shopSalePrice.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            shopSalePrice.FileItem = response.Item;
                            shopSalePrice.showSuccessIcon();
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            shopSalePrice.filePickerMainImage.filename = shopSalePrice.FileItem.FileName;
                            shopSalePrice.filePickerMainImage.fileId = response.Item.Id;
                            shopSalePrice.selectedItem.LinkMainImageId = shopSalePrice.filePickerMainImage.fileId;
                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        shopSalePrice.showErrorIcon();
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
}]);