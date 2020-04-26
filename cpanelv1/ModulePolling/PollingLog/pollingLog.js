app.controller("pollingLogCtrl", ["$scope", "$http", "ajax", "rashaErManage", "$modal", "$modalStack", "SweetAlert", "$timeout", "$state", '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $state, $window, $filter) {
    var pollingLog = this;

    var date = moment().format();

    pollingLog.datePickerConfig = {
        defaultDate: date,
    };
    pollingLog.startDate = {
        defaultDate: date,
    }
    pollingLog.endDate = {
        defaultDate: date,
    }
    pollingLog.count = 0;

    pollingLog.filePickerconfig = {
        isActive: true,
    }
    //Polling Content Grid Options
    pollingLog.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Serial', displayName: 'سریال', sortable: true, type: 'string', visible: 'true' },
            { name: 'OtherInfo', displayName: 'اطلاعات', sortable: true, type: 'string', visible: 'true' },
            { name: 'LinkModuleId', displayName: 'کدسیستمی ماژول', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'virtual_Content.Title', displayName: 'عنوان نظرسنجی', sortable: true, type: 'date', visible: 'true', excerpt: true, displayForce: true },
            { name: 'virtual_Option.Option', displayName: 'گزینه', sortable: true, type: 'date', visible: 'true', excerpt: true, displayForce: true }
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
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    //pollingLog.selectedItem.ToDate=pollingLog.datePickerConfig.defaultDate;

    //For Show Category Loading Indicator
    pollingLog.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show polling Loading Indicator
    pollingLog.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    pollingLog.treeConfig = {
        displayMember: "Title",
        displayId: "Id",
        displayChild: "Children"
    };

    pollingLog.treeConfig.currentNode = {};
    pollingLog.treeBusyIndicator = false;

    pollingLog.addRequested = false;

    //init Function
    pollingLog.init = function () {
        pollingLog.categoryBusyIndicator.isActive = true;
        //ajax.call(cmsServerConfig.configApiServerPath+"pollingcategory/getall", pollingLog.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
        //    pollingLog.treeConfig.Items = response.ListItems;
        //    pollingLog.categoryBusyIndicator.isActive = false;
        //}).error(function (data, errCode, c, d) {
        //    console.log(data);
        //});
        pollingLog.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"pollingLog/getall", pollingLog.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            pollingLog.ListItems = response.ListItems;
            pollingLog.gridOptions.fillData(pollingLog.ListItems, response.resultAccess);
            pollingLog.contentBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    };

    pollingLog.gridOptions.onRowSelected = function () {
        var item = pollingLog.gridOptions.selectedRow.item;
        //Get Options
        //$("#grid-options").fadeOut('fast');
        //var filterModel = { Filters: [] };
        //filterModel.Filters.push({ PropertyName: "LinkpollingLogId", IntValue1: item.Id, SearchType: 0 });
        //ajax.call(cmsServerConfig.configApiServerPath+"pollingoption/getall", filterModel, "POST").success(function (response) {
        //    rashaErManage.checkAction(response);
        //    pollingLog.OptionList = response.ListItems;
        //    pollingLog.calculatePercantage(pollingLog.OptionList);
        //    pollingLog.gridOptions2.fillData(pollingLog.OptionList, response.resultAccess);
        //    pollingLog.gridOptions2.currentPageNumber = response.CurrentPageNumber;
        //    pollingLog.gridOptions2.totalRowCount = response.TotalRowCount;
        //    pollingLog.gridOptions2.RowPerPage = response.RowPerPage;
        //    if (pollingLog.OptionList.length > 0)
        //        $("#grid-options").fadeIn('fast');
        //}).error(function (data, errCode, c, d) {
        //    console.log(data);
        //});
    }

    // Open Add Category 
    pollingLog.openAddCategoryModal = function () {
        if (buttonIsPressed) { return };
        pollingLog.addRequested = false;
        pollingLog.modalTitle = "ایجاد دسته جدید";
        buttonIsPressed == true;
        ajax.call(cmsServerConfig.configApiServerPath+"pollingCategory/GetViewModel", "", "GET").success(function (response) {
            buttonIsPressed == false;
            rashaErManage.checkAction(response);
            pollingLog.selectedItem = response.Item;
            $modal.open({
                templateUrl: "cpanelv1/ModulePolling/pollingCategory/add.html",
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Open Edit Category
    pollingLog.openEditCategoryModal = function () {
        if (buttonIsPressed) { return };
        pollingLog.addRequested = false;
        pollingLog.modalTitle = " ویرایش دسته";
        if (!pollingLog.treeConfig.currentNode) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+"pollingCategory/GetOne", pollingLog.treeConfig.currentNode.Id, "GET").success(function (response) {
            buttonIsPressed = false;
            pollingLog.showbusy = false;
            rashaErManage.checkAction(response);
            pollingLog.selectedItem = response.Item;
            $modal.open({
                templateUrl: "cpanelv1/ModulePolling/pollingCategory/edit.html",
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add Category
    pollingLog.addNewCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        pollingLog.addRequested = true;
        pollingLog.selectedItem.LinkParentId = null;
        if (pollingLog.treeConfig.currentNode != null)
            pollingLog.selectedItem.LinkParentId = pollingLog.treeConfig.currentNode.Id;
        ajax.call(cmsServerConfig.configApiServerPath+"pollingCategory/add", pollingLog.selectedItem, "POST").success(function (response) {
            pollingLog.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                if (response.Item.LinkParentId == null)
                    pollingLog.treeConfig.Items.push(response.Item);
                else {
                    pollingLog.treeConfig.currentNode.Children.push(response.Item);
                }
                pollingLog.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            pollingLog.addRequested = false;
        });
    };

    //Edit Category
    pollingLog.editCategory = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+"pollingCategory/edit", pollingLog.selectedItem, "PUT").success(function (response) {
            pollingLog.addRequested = true;
            //pollingLog.showbusy = false;
            pollingLog.treeConfig.showbusy = false;
            pollingLog.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                pollingLog.addRequested = false;
                pollingLog.treeConfig.currentNode.Title = response.Item.Title;
                pollingLog.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            pollingLog.addRequested = false;
        });
    }

    // Delete a Category
    pollingLog.deleteCategory = function () {
        if (buttonIsPressed) { return };

        var node = pollingLog.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_category_to_remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                pollingLog.categoryBusyIndicator.isActive = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+"pollingCategory/GetOne", node.Id, "GET").success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    pollingLog.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+"pollingCategory/delete", pollingLog.selectedItemForDelete, 'POST').success(function (res) {
                        if (res.IsSuccess) {
                            pollingLog.categoryBusyIndicator.isActive = false;
                            if (pollingLog.selectedItemForDelete.LinkParentId == null) {
                                var elementPos = pollingLog.treeConfig.Items.map(function (x) { return x.Id; }).indexOf(pollingLog.selectedItemForDelete.Id); // find the index of an item in an array
                                pollingLog.treeConfig.Items.splice(elementPos, 1);
                            } else
                                for (var i = 0; i < pollingLog.treeConfig.Items.length; i++) {
                                    searchAndDeleteFromTree(pollingLog.selectedItemForDelete, pollingLog.treeConfig.Items[i]);
                                }
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });

            }
        });
    }
    //Tree On Node Select Options
    pollingLog.treeConfig.onNodeSelect = function () {
        var node = pollingLog.treeConfig.currentNode;
        pollingLog.selectContent(node);

    };

    //Show Content with Category Id
    pollingLog.selectContent = function (node) {
        pollingLog.contentBusyIndicator.isActive = true;
        pollingLog.gridOptions.advancedSearchData.engine.Filters = [];
        if (node != null) {
            var s = {
                PropertyName: "LinkCategoryId",
                IntValue1: node.Id,
                SearchType: 0
            }
            pollingLog.gridOptions.advancedSearchData.engine.Filters.push(s);
        }
        else
            pollingLog.gridOptions.advancedSearchData.engine.Filters = [];
        ajax.call(cmsServerConfig.configApiServerPath+"pollingLog/getall", pollingLog.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            pollingLog.contentBusyIndicator.isActive = false;
            pollingLog.ListItems = response.ListItems;
            pollingLog.gridOptions.fillData(pollingLog.ListItems, response.resultAccess);
            pollingLog.gridOptions.currentPageNumber = response.CurrentPageNumber;
            pollingLog.gridOptions.totalRowCount = response.TotalRowCount;
            pollingLog.gridOptions.rowPerPage = response.RowPerPage;
            pollingLog.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            pollingLog.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Open Add Content Modal
    pollingLog.openAddModal = function () {
        var node = pollingLog.treeConfig.currentNode;
        if (node.Id == 0 || !node.Id) {
            rashaErManage.showMessage("برای اضافه کردن رای لطفا دسته مربوطه را انتخاب کنید .");
            return;
        }

        pollingLog.addRequested = false;
        pollingLog.modalTitle = "اضافه";
        ajax.call(cmsServerConfig.configApiServerPath+"pollingLog/GetViewModel", "", "GET").success(function (response) {
            rashaErManage.checkAction(response);
            pollingLog.selectedItem = response.Item;
            pollingLog.selectedItem.LinkCategoryId = node.Id;
            $modal.open({
                templateUrl: "cpanelv1/ModulePolling/pollingLog/add.html",
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Open Edit Content Modal
    pollingLog.openEditModal = function () {
        pollingLog.addRequested = false;
        pollingLog.modalTitle = "ویرایش";
        if (!pollingLog.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+"pollingLog/GetOne", pollingLog.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
            rashaErManage.checkAction(response);
            pollingLog.selectedItem = response.Item;
            $modal.open({
                templateUrl: "cpanelv1/ModulePolling/pollingLog/edit.html",
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    //Add a Content
    pollingLog.addNewContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        pollingLog.selectedItem.ContentTags = [43, 48, 51];
        pollingLog.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+"pollingLog/add", pollingLog.selectedItem, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                pollingLog.ListItems.unshift(response.Item);
                pollingLog.gridOptions.fillData(pollingLog.ListItems, response.resultAccess);
                pollingLog.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            pollingLog.addRequested = false;
        });
    }
    //Edit New Content
    pollingLog.editContent = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        pollingLog.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+"pollingLog/edit", pollingLog.selectedItem, "PUT").success(function (response) {
            pollingLog.addRequested = false;
            pollingLog.treeConfig.showbusy = false;
            pollingLog.showIsBusy = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                pollingLog.replaceItem(pollingLog.selectedItem.Id, response.Item);
                pollingLog.gridOptions.fillData(pollingLog.ListItems, response.resultAccess);
                pollingLog.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            pollingLog.addRequested = false;
        });
    }

    //Delete a Content 
    pollingLog.deleteContent = function () {
        if (!pollingLog.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        pollingLog.treeConfig.showbusy = true;
        pollingLog.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                pollingLog.showbusy = true;
                pollingLog.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+"pollingLog/GetOne", pollingLog.gridOptions.selectedRow.item.Id, "GET").success(function (response) {
                    pollingLog.showbusy = false;
                    pollingLog.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    pollingLog.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+"pollingLog/delete", pollingLog.selectedItemForDelete, 'POST').success(function (res) {
                        pollingLog.treeConfig.showbusy = false;
                        pollingLog.showIsBusy = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            pollingLog.replaceItem(pollingLog.selectedItemForDelete.Id);
                            pollingLog.gridOptions.fillData(pollingLog.ListItems, response.resultAccess);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        pollingLog.treeConfig.showbusy = false;
                        pollingLog.showIsBusy = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    pollingLog.treeConfig.showbusy = false;
                    pollingLog.showIsBusy = false;
                });
            }
        });
    }

    //Replace Item OnDelete/OnEdit Grid Options
    pollingLog.replaceItem = function (oldId, newItem) {
        angular.forEach(pollingLog.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = pollingLog.ListItems.indexOf(item);
                pollingLog.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            pollingLog.ListItems.unshift(newItem);
    }

    //Close Model Stack
    pollingLog.addRequested = false;
    pollingLog.closeModal = function () {
        $modalStack.dismissAll();
    };

    pollingLog.showIsBusy = false;

    //For reInit Categories
    pollingLog.gridOptions.reGetAll = function (getAllwithFilters) {
        pollingLog.init();
    }

    pollingLog.isCurrentNodeEmpty = function () {
        return !angular.equals({}, pollingLog.treeConfig.currentNode);
    }

    pollingLog.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    pollingLog.updateContentOption = function (optionIndex) {
        if ($("#option" + optionIndex).is('[readonly]')) { // Update is pressed
            $("#editSaveBtn" + optionIndex).css("background-color", "#1ab394");
            $("#editSaveBtn" + optionIndex).attr("title", "ذخیره");
            $("#option" + optionIndex).attr("readonly", false);
        }
        else {     // Save is pressed
            $("#option" + optionIndex).attr("readonly", true);
            $("#editSaveBtn" + optionIndex).css("background-color", "#f8ac59");
            $("#editSaveBtn" + optionIndex).attr("title", "ویرایش");
            ajax.call(cmsServerConfig.configApiServerPath+"pollingOption/GetOne", pollingLog.OptionList[optionIndex].Id, "GET").success(function (response) {
                rashaErManage.checkAction(response);
                pollingLog.selectedItemForUpdate = response.Item;
                pollingLog.selectedItemForUpdate.Option = pollingLog.OptionList[optionIndex].Option;
                ajax.call(cmsServerConfig.configApiServerPath+"pollingOption/edit", pollingLog.selectedItemForUpdate, "PUT").success(function (res) {
                    rashaErManage.checkAction(res);
                }).error(function (data2, errCode2, c2, d2) {
                    rashaErManage.checkAction(data2);
                    pollingLog.treeConfig.showbusy = false;
                    pollingLog.showIsBusy = false;
                });
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }
        $("#editSaveIcon" + optionIndex).toggleClass('fa-pencil-square-o fa-check');
    }

    pollingLog.OptionList = [];
    var optionModalAddMode = true;
    pollingLog.addRequested = false;
    pollingLog.openOptionModal = function (selectedId) {
        if (!selectedId) {
            rashaErManage.showMessage("برای اضافه یا ویرایش گزینه لطفاً نظرسنجی مربوطه را انتخاب کنید .");
            return;
        }
        pollingLog.OptionList = [];
        var filterModel = { Filters: [] };
        filterModel.Filters.push({ PropertyName: "LinkpollingLogId", IntValue1: parseInt(selectedId), SearchType: 0 });
        ajax.call(cmsServerConfig.configApiServerPath+"pollingoption/getall", filterModel, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            pollingLog.OptionList = response.ListItems;
            pollingLog.calculatePercantage(pollingLog.OptionList);
            ajax.call(cmsServerConfig.configApiServerPath+"pollingoption/GetViewModel", "", "GET").success(function (response) {
                rashaErManage.checkAction(response);
                pollingLog.selectedItem = response.Item;
                pollingLog.selectedItem.LinkpollingLogId = selectedId;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
            $modal.open({
                templateUrl: "cpanelv1/ModulePolling/pollingLog/addOption.html",
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit or Delete options
    pollingLog.editDeleteOptions = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (pollingLog.OptionList.length < 2) {
            rashaErManage.showMessage("شما باید حداقل دو جواب برای این نظرسنجی مشخص کنید!");
            return;
        }

        // Get Options
        var optionsBeforeSave = [];
        var Filter_value = {
            PropertyName: "LinkpollingLogId",
            IntValue1: pollingLog.gridOptions.selectedRow.item.Id,
            SearchType: 0
        }
        // -----------

        for (var i = 0; i < pollingLog.OptionList.length; i++) {
            for (var i = 0; i < optionsBeforeSave.length; i++) {

            }
        }
        // Delete all options
        pollingLog.contentBusyIndicator.isActive = true;
        for (var i = 0; i < pollingLog.listComments.length; i++) {

            ajax.call(cmsServerConfig.configApiServerPath+"pollingOption/GetOne", pollingLog.listComments[i].Id, "GET").success(function (response) {
                pollingLog.showbusy = false;
                pollingLog.showIsBusy = false;
                rashaErManage.checkAction(response);
                pollingLog.selectedItemForDelete = response.Item;
                ajax.call(cmsServerConfig.configApiServerPath+"pollingOption/delete", pollingLog.selectedItemForDelete, 'POST').success(function (res) {
                    pollingLog.treeConfig.showbusy = false;
                    pollingLog.showIsBusy = false;
                    rashaErManage.checkAction(res);
                    if (res.IsSuccess) {
                        pollingLog.replaceItem(pollingLog.selectedItemForDelete.Id);
                        pollingLog.gridOptions.fillData(pollingLog.ListItems, response.resultAccess);
                    }

                }).error(function (data2, errCode2, c2, d2) {
                    rashaErManage.checkAction(data2);
                    pollingLog.treeConfig.showbusy = false;
                    pollingLog.showIsBusy = false;
                });
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                pollingLog.treeConfig.showbusy = false;
                pollingLog.showIsBusy = false;
            });
        }

        // Add all options
        pollingLog.contentBusyIndicator.isActive = true;
        pollingLog.addRequested = true;
        for (var i = 0; i < pollingLog.OptionList.length; i++) {
            ajax.call(cmsServerConfig.configApiServerPath+'pollingOption/add', pollingLog.OptionList[i], 'POST').success(function (response) {
                pollingLog.addRequested = false;
                pollingLog.contentBusyIndicator.isActive = false;
                rashaErManage.checkAction(response);
                if (response.IsSuccess) {
                    pollingLog.closeModal();
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                pollingLog.contentBusyIndicator.isActive = false;
                pollingLog.addRequested = false;
            });
        }
    }

    pollingLog.deleteOption = function (item) {
        if (!item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        pollingLog.treeConfig.showbusy = true;
        pollingLog.showIsBusy = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), "آیا می خواهید این گزینه را حذف کنید؟", function (isConfirmed) {
            if (isConfirmed) {
                pollingLog.showbusy = true;
                pollingLog.showIsBusy = true;
                ajax.call(cmsServerConfig.configApiServerPath+'pollingOption/GetOne', pollingLog.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    pollingLog.showbusy = false;
                    pollingLog.showIsBusy = false;
                    rashaErManage.checkAction(response);
                    pollingLog.selectedItemForDelete = response.Item;
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    pollingLog.treeConfig.showbusy = false;
                    pollingLog.showIsBusy = false;
                });
            }
        });
    }

    pollingLog.addNewOption = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        if (pollingLog.selectedItem.Option == null || pollingLog.selectedItem.Option == "") {
            rashaErManage.showMessage($filter('translatentk')('Option_can_not_be_empty'));
            return;
        }
        pollingLog.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+"pollingoption/add", pollingLog.selectedItem, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                pollingLog.selectedItem.Option = ""; //Clear textbox
                pollingLog.OptionList.push(response.Item);
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            pollingLog.addRequested = false;
        });
    }

    pollingLog.deleteContentOption = function (index) {
        pollingLog.addOptionBusyIndicator = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), "آیا می خواهید این گزینه را حذف کنید؟", function (isConfirmed) {
            if (isConfirmed) {
                pollingLog.addOptionBusyIndicator = true;
                ajax.call(cmsServerConfig.configApiServerPath+"pollingoption/GetOne", pollingLog.OptionList[index].Id, "GET").success(function (response) {
                    pollingLog.addOptionBusyIndicator = false;
                    rashaErManage.checkAction(response);
                    pollingLog.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+"pollingoption/delete", pollingLog.selectedItemForDelete, 'POST').success(function (res) {
                        pollingLog.addOptionBusyIndicator = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            //pollingLog.replaceItem(pollingLog.selectedItemForDelete.Id);
                            pollingLog.OptionList.splice(index, 1);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        pollingLog.treeConfig.showbusy = false;
                        pollingLog.showIsBusy = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    pollingLog.treeConfig.showbusy = false;
                    pollingLog.showIsBusy = false;
                });
            }
        });
    }

    pollingLog.calculatePercantage = function (list) {
        if (angular.isDefined(list) && list.length > 0) {
            var totalCount = 0;
            $.each(list, function (index, item) {
                totalCount += item.NumberOfVotes;
            });
            $.each(list, function (index, item) {
                item.Percentage = '%' + ((item.NumberOfVotes * 100) / totalCount).toFixed(2);
            });
        }
    }

    function searchAndDeleteFromTree(deletedItem, currentNode) {
        var i,
            currentChild,
            result;

        if (deletedItem.LinkParentId == currentNode.Id) {
            var elementPos = currentNode.Children.map(function (x) { return x.Id; }).indexOf(deletedItem.Id); // find the index of an item in an array
            currentNode.Children.splice(elementPos, 1);
            return true;
        } else {
            // Use a for loop instead of forEach to avoid nested functions
            // Otherwise "return" will not work properly
            if (currentNode.Children != undefined)
                for (i = 0; i < currentNode.Children.length; i += 1) {
                    currentChild = currentNode.Children[i];

                    // Search in the current child
                    result = searchAndDeleteFromTree(deletedItem, currentChild);

                    // Return the result if the node has been found
                    if (result !== false) {
                        return result;
                    }
                }
            // The node has not been found and we have no more options
            return false;
        }
    }
    pollingLog.columnCheckbox = false;
    pollingLog.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = pollingLog.gridOptions.columns;
        if (pollingLog.gridOptions.columnCheckbox) {
            for (var i = 0; i < pollingLog.gridOptions.columns.length; i++) {
                //pollingLog.gridOptions.columns[i].visible = $("#" + pollingLog.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + pollingLog.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                pollingLog.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < pollingLog.gridOptions.columns.length; i++) {
                var element = $("#" + pollingLog.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + pollingLog.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < pollingLog.gridOptions.columns.length; i++) {
            console.log(pollingLog.gridOptions.columns[i].name.concat(".visible: "), pollingLog.gridOptions.columns[i].visible);
        }
        pollingLog.gridOptions.columnCheckbox = !pollingLog.gridOptions.columnCheckbox;
    }
    //Export Report 
    pollingLog.exportFile = function () {
        pollingLog.addRequested = true;
        pollingLog.gridOptions.advancedSearchData.engine.ExportFile = pollingLog.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'pollingLog/exportfile', pollingLog.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            pollingLog.addRequested = false;
            rashaErManage.checkAction(response);
            pollingLog.reportDownloadLink = response.LinkFile;
            if (response.IsSuccess) {
                $window.open(response.LinkFile, '_blank');
                //pollingLog.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    pollingLog.toggleExportForm = function () {
        pollingLog.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        pollingLog.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        pollingLog.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        pollingLog.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModulePolling/pollingLog/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    pollingLog.rowCountChanged = function () {
        if (!angular.isDefined(pollingLog.ExportFileClass.RowCount) || pollingLog.ExportFileClass.RowCount > 5000)
            pollingLog.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    pollingLog.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"pollingLog/count", pollingLog.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            pollingLog.addRequested = false;
            rashaErManage.checkAction(response);
            pollingLog.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            pollingLog.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);