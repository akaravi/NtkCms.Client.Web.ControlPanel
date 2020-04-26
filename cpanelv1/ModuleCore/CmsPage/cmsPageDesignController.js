app.controller("cmsPageGridDesignCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$state', '$stateParams', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $state, $stateParams, $filter) {
    var cmsPageDesign = this;
    cmsPageDesign.ModalLargeImageShow = false;
    cmsPageDesign.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    cmsPageDesign.filePickerFavIcon = {
        isActive: true,
        backElement: 'filePickerFavIcon',
        filename: null,
        fileId: null,
        multiSelect: false,
    }
    cmsPageDesign.AllPageDependenciesListItems = [];
    cmsPageDesign.CmsModuleSitesListItems = [];
    cmsPageDesign.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'ClassActionName', displayName: 'عنوان کلاس', sortable: true, type: 'string' },
            { name: 'virtual_CmsModule.Title', displayName: 'ماژول', sortable: true, type: 'link', displayForce: true }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "Id",
                SortType: 0,
                NeedToRunFakePagination: false,
                //TotalRowData: 2000,
                RowPerPage: 12,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }
    
    cmsPageDesign.gridOptions.pageChanged = function (page) {
        cmsPageDesign.gridOptions.advancedSearchData.engine.CurrentPageNumber = cmsPageDesign.gridOptions.currentPageNumber;
        cmsPageDesign.gridOptions.reGetAll();
    }

    cmsPageDesign.gridOptions.reGetAll = function () {
        cmsPageDesign.init();
    }

    if (itemRecordStatus != undefined) cmsPageDesign.itemRecordStatus = itemRecordStatus;

    cmsPageDesign.backToPreviousState = function () {
        $state.go("index.cmspages");
    }


    cmsPageDesign.dependencyId = $stateParams.dependencyId;
    cmsPageDesign.dependencyTitle = $stateParams.dependencyTitle;
    cmsPageDesign.moduleId = $stateParams.moduleId;
    cmsPageDesign.moduleTitle = $stateParams.moduleTitle;
    cmsPageDesign.classActioName = $stateParams.classActioName;
    //#cmsPageDesign.init
    cmsPageDesign.init = function () {
        if (cmsPageDesign.dependencyId == null || cmsPageDesign.dependencyId == undefined) {
            if ($stateParams.classActioName == null || $stateParams.classActioName == undefined)
                cmsPageDesign.backToPreviousState();
        }
        //#help# یافتن صفحه های مادر
        if (cmsPageDesign.classActioName != null && cmsPageDesign.classActioName.toLowerCase().indexOf("withembeddedchild") >= 0) {
            var engine = { Filters: [{ PropertyName: "ClassActionName", SearchType: 0, StringValue1: "CoreMainTemplateWithEmbeddedChild" }] };
            ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPageDependency/getAll', engine, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                cmsPageDesign.dependencyId = response.ListItems[0].Id;
                cmsPageDesign.onloadmydata();
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        } else {
            cmsPageDesign.onloadmydata();
        }
        //#help# صفحه بر اساس نیازمندی


        if (!angular.isDefined(cmsPageDesign.cmsPageTemplatesListItems))
            ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPageTemplate/getallAvailable', {}, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                cmsPageDesign.cmsPageTemplatesListItems = response.ListItems;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });

        if (!angular.isDefined(cmsPageDesign.pageAbilityTypeEnum))
            ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/getenumpagetype', {}, 'POST').success(function (response) {
                cmsPageDesign.pageAbilityTypeEnum = response.ListItems;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
    }
    //#cmsPageDesign.init
    //#help#بارگزاری لیست
    cmsPageDesign.onloadmydata = function () {
        cmsPageDesign.gridOptions.advancedSearchData.engine.Filters=[];
        cmsPageDesign.gridOptions.advancedSearchData.engine.Filters.push({ PropertyName: "LinkPageDependencyGuId", ObjectIdValue1: cmsPageDesign.dependencyId, SearchType: 0 }); 
        cmsPageDesign.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/getall', cmsPageDesign.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsPageDesign.gridOptions.resultAccess = response.resultAccess;
            cmsPageDesign.ListItems = response.ListItems;
            cmsPageDesign.gridOptions.fillData(cmsPageDesign.ListItems, response.resultAccess);
            cmsPageDesign.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsPageDesign.gridOptions.totalRowCount = response.TotalRowCount;
            cmsPageDesign.gridOptions.rowPerPage = response.RowPerPage;
            cmsPageDesign.gridOptions.maxSize = 5;
            cmsPageDesign.busyIndicator.isActive = false;
            cmsPageDesign.pageList = response.ListItems;
            

        }).error(function (data, errCode, c, d) {
            cmsPageDesign.busyIndicator.isActive = false;
            rashaErManage.checkAction(data, errCode);
        });
    }
  
    cmsPageDesign.goTohtmlbuilder = function (item) {
        var token=localStorage.getItem("userGlobaltoken");
        item.rowOption = null;
        item.virtual_CmsModulePageDependency = null;
        item.virtual_CmsSite = null;
        var themName = pageTemplateTitle(item.LinkPageTemplateGuId);
        if (!themName || themName.length == 0)
            return;
        //var urlTemplate = 'HtmlBuilder/?id=' + item.Id;// + '&theme=' + themName;
        //var urlTemplate = configMvcServerPath+'HtmlBuilder/home/index/' + item.Id+'?token='+token;
        var urlTemplate = '/HtmlBuilder/home/token/' + item.Id+'?token='+encodeURIComponent(token);
        localStorage.setItem("pageItem", $.trim(angular.toJson(item)));
        var win = window.open(urlTemplate, '_blank');
        win.focus();
    }

    cmsPageDesign.goTohtmlbuilderRender = function (item) {
        item.rowOption = null;
        item.virtual_CmsModulePageDependency = null;
        item.virtual_CmsSite = null;
        var urlTemplate = '/page/' + item.Id;
        localStorage.setItem("pageItem", $.trim(angular.toJson(item)));
        var win = window.open(urlTemplate, '_blank');
        win.focus();
    }

    cmsPageDesign.enableMainPage = function (item) {
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/GetOne', item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsPageDesign.selectedItem = response.Item;
            cmsPageDesign.selectedItem.PageDependencyIsDefualtPage = (response.Item.PageDependencyIsDefualtPage == true) ? false : true;
            ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/edit', cmsPageDesign.selectedItem, 'PUT').success(function (response2) {
                rashaErManage.checkAction(response2);
                if (response2.IsSuccess) {
                    var index = cmsPageDesign.pageList.indexOf(item);
                    if (index !== -1) {
                        cmsPageDesign.pageList[index] = response2.Item;
                    }
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add a New Content Modal
    cmsPageDesign.addRequested = false;
    cmsPageDesign.openAddModal = function () {
        cmsPageDesign.modalTitle = 'اضافه';
        cmsPageDesign.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/GetViewModel', '', 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsPageDesign.selectedItem = response.Item;
            cmsPageDesign.selectedItem.LinkPageDependencyGuId = cmsPageDesign.dependencyId;
            cmsPageDesign.filePickerFavIcon.fileId = 0;
            cmsPageDesign.filePickerFavIcon.fileName = "";
            cmsPageDesign.busyIndicator.isActive = false;
            // Select Canvas as default theme
            $.each(cmsPageDesign.cmsPageTemplatesListItems, function (index, item) {
                if (item.Title == "bootstrap راست به چپ" || item.Title == "bootstrap راست به چپ")
                    cmsPageDesign.selectedItem.LinkPageTemplateId = item.Id
            });
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsPage/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Add a New Content
    cmsPageDesign.addNewRow = function (frm) {
        if (frm.$invalid)
            return;
        cmsPageDesign.addRequested = true;
        cmsPageDesign.busyIndicator.isActive = true;
        //Save Keywords
        if (cmsPageDesign.kwords != null)
            $.each(cmsPageDesign.kwords, function (index, item) {
                if (index == 0)
                    cmsPageDesign.selectedItem.Keyword = item.text;
                else
                    cmsPageDesign.selectedItem.Keyword += ',' + item.text;
            });
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/add', cmsPageDesign.selectedItem, 'POST').success(function (response) {
            cmsPageDesign.addRequested = false;
            cmsPageDesign.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsPageDesign.pageList.push(response.Item);
                cmsPageDesign.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsPageDesign.addRequested = false;
        });
    }

    cmsPageDesign.saveAndGoTohtmlbuilder = function (frm) {
        if (frm.$invalid)
            return;
        cmsPageDesign.addRequested = true;
        if (frm.$name == "frmCmsPageAdd") {   // Functions was called from add modal
            ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/add', cmsPageDesign.selectedItem, 'POST').success(function (response) {
                cmsPageDesign.addRequested = false;
                rashaErManage.checkAction(response);
                if (response.IsSuccess) {
                    cmsPageDesign.pageList.unshift(response.Item);
                    cmsPageDesign.closeModal();
                    // Go to htmlBuilder -----------------------
                    cmsPageDesign.goTohtmlbuilder(response.Item);
                    //------------------------------------------
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                cmsPageDesign.addRequested = false;
            });
        }
        else {  // Functions was called from edit modal
            ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/edit', cmsPageDesign.selectedItem, 'PUT').success(function (response) {
                cmsPageDesign.addRequested = false;
                rashaErManage.checkAction(response);
                if (response.IsSuccess) {
                    cmsPageDesign.replaceItem(cmsPageDesign.selectedItem.Id, response.Item);
                    cmsPageDesign.closeModal();
                    // Go to htmlBuilder -----------------------
                    cmsPageDesign.goTohtmlbuilder(response.Item);
                    //------------------------------------------
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                cmsPageDesign.addRequested = false;
            });
        }
    }

    // Open Edit Content Modal
    cmsPageDesign.openEditModal = function (item) {
        cmsPageDesign.modalTitle = 'ویرایش';
        if (!item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/GetOne', item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsPageDesign.selectedItem = response.Item;
            cmsPageDesign.filePickerFavIcon.filename = null;
            cmsPageDesign.filePickerFavIcon.fileId = null;
            //Set FavIcon
            if (response.Item.LinkFavIconId != null) {
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', response.Item.LinkFavIconId, 'GET').success(function (response) {
                    cmsPageDesign.filePickerFavIcon.filename = response.Item.FileName;
                    cmsPageDesign.filePickerFavIcon.fileId = response.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            //cmsPageDesign.selectedItem.LinkModuleId = null;
            //Load Keywords tagsInput
            cmsPageDesign.kwords = [];  //Clear out previous tags
            var arraykwords = [];
            if (cmsPageDesign.selectedItem.Keyword != null && cmsPageDesign.selectedItem.Keyword != "")
                arraykwords = cmsPageDesign.selectedItem.Keyword.split(',');
            $.each(arraykwords, function (index, item) {
                if (item != null)
                    cmsPageDesign.kwords.push({ text: item });  //Add current content's tag to tags array with id and title
            });
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsPage/edit.html',
                scope: $scope
            });
            // Load Values Backward
            //cmsPageDesign.LoadModuleOfDependency(item.LinkPageDependencyGuId);  این تابع در قالب قبلی کاربرد داشت
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit Content Modal
    cmsPageDesign.editRow = function (frm) {
        if (frm.$invalid)
            return;
        cmsPageDesign.busyIndicator.isActive = true;
        cmsPageDesign.addRequested = true;
        //Save Keywords
        $.each(cmsPageDesign.kwords, function (index, item) {
            if (index == 0)
                cmsPageDesign.selectedItem.Keyword = item.text;
            else
                cmsPageDesign.selectedItem.Keyword += ',' + item.text;
        });
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/edit', cmsPageDesign.selectedItem, 'PUT').success(function (response) {
            cmsPageDesign.busyIndicator.isActive = false;
            cmsPageDesign.addRequested = false;
            if (response.IsSuccess) {
                cmsPageDesign.replaceItem(cmsPageDesign.selectedItem.Id, response.Item);
                cmsPageDesign.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsPageDesign.addRequested = false;
        });
    }

    cmsPageDesign.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsPageDesign.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsPageDesign.pageList, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsPageDesign.pageList.indexOf(item);
                cmsPageDesign.pageList.splice(index, 1);
            }
        });
        if (newItem)
            cmsPageDesign.pageList.push(newItem);
    }

    cmsPageDesign.deleteRow = function (item) {
        if (!item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                cmsPageDesign.busyIndicator.isActive = true;
                cmsPageDesign.addRequested = true;
                ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/GetOne', item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsPageDesign.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/delete', cmsPageDesign.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsPageDesign.replaceItem(cmsPageDesign.selectedItemForDelete.Id);
                        }
                        cmsPageDesign.busyIndicator.isActive = false;
                        cmsPageDesign.addRequested = false;
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });
    }



    pageTemplateTitle = function (PageTemplateGuId) {
        if (cmsPageDesign.cmsPageTemplatesListItems != undefined )
            for (var i = 0; i < cmsPageDesign.cmsPageTemplatesListItems.length; i++) {
                if (cmsPageDesign.cmsPageTemplatesListItems[i].Id === PageTemplateGuId)
                    return cmsPageDesign.cmsPageTemplatesListItems[i].Folder;
            }
        rashaErManage.showMessage($filter('translatentk')('Template_specifications_not_found'));
        return;
    }

    cmsPageDesign.saveFromAdmin = function (item) {
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/SetDefaultAdminValuePage', item.Id, 'GET').success(function (res) {
            rashaErManage.checkAction(res);
            if (res.IsSuccess) {
                rashaErManage.showMessage($filter('translatentk')('Saving_successfully'));
            }
            cmsPageDesign.busyIndicator.isActive = false;
            cmsPageDesign.addRequested = false;
        }).error(function (data2, errCode2, c2, d2) {
            rashaErManage.checkAction(data2);
        });
    }

    cmsPageDesign.openDefaultPagesModal = function (item) {
        cmsPageDesign.addRequested = true;
        cmsPageDesign.busyIndicator.isActive = true;
        cmsPageDesign.LargeImageSelectPageJsonValue = "";
        cmsPageDesign.selectedItem = item;
        cmsPageDesign.onSiteCategoryChange(0);
        cmsPageDesign.selectedItem.LinkSiteCategoryId = 0;

        //#help#لیست انواع سایتها
        if (cmsPageDesign.cmsSiteCategoryListItems == undefined || cmsPageDesign.cmsSiteCategoryListItems.length == 0) {
            ajax.call(cmsServerConfig.configApiServerPath+'CoreSiteCategory/getall', {}, 'POST').success(function (response1) {
                cmsPageDesign.busyIndicator.isActive = false;
                cmsPageDesign.addRequested = false;
                cmsPageDesign.cmsSiteCategoryListItems = response1.ListItems;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }
        //#help#لیست انواع سایتها

        //#help#لیست  صفحات پیش فرض
        
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCore/cmsPage/default_pages.html',
            scope: $scope
        });
        //#help#لیست  صفحات پیش فرض
    }
    //#help#لیست  صفحات پیش فرض
    cmsPageDesign.onSiteCategoryChange = function (categoryId) {
        cmsPageDesign.LargeImageSelect = {};
        cmsPageDesign.LargeImageSelectPage = {};
        cmsPageDesign.addRequested = true;
        cmsPageDesign.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/GetAllDefaultPagesBySiteCategory', { pageId: cmsPageDesign.selectedItem.Id, LinkSiteCategoryId: categoryId, LinkPageDependencyGuId: cmsPageDesign.dependencyId }, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsPageDesign.cmsDefaultPageListItems = response.ListItems;
            }
            cmsPageDesign.busyIndicator.isActive = false;
            cmsPageDesign.addRequested = false;
        }).error(function (data2, errCode2, c2, d2) {
            rashaErManage.checkAction(data2);
            cmsPageDesign.busyIndicator.isActive = false;
            cmsPageDesign.addRequested = false;
        });
    }
    //#help#لیست  صفحات پیش فرض

    //#help# انتخاب صفحه پیش فرض
    cmsPageDesign.LargeImageSelect = {};
    cmsPageDesign.LargeImageSelectPage = {};
    cmsPageDesign.LargeImage = function (thisSelect) {
        cmsPageDesign.LargeImageSelect = thisSelect;
        //cmsPageDesign.LargeImageSelect.PageJsonValue = "";
    }
    cmsPageDesign.LargeImageClose = function () {
        cmsPageDesign.ModalLargeImageShow = false;
    }
    cmsPageDesign.onDefaultPageSelect = function (thisSelect) {
        cmsPageDesign.LargeImageSelect = thisSelect;
        cmsPageDesign.LargeImageSelectPage = thisSelect;
    }
    cmsPageDesign.saveDefaultJsonValue = function (frm) {
        if (frm.$invalid || cmsPageDesign.LargeImageSelectPage.PageJsonValue == undefined) {
            rashaErManage.showMessage($filter('translatentk')('Please_select_a_template'));
            return;
        }
        cmsPageDesign.addRequested = true;
        cmsPageDesign.busyIndicator.isActive = true;
        var model = { id: cmsPageDesign.selectedItem.Id, ver: "1", jsonValue: cmsPageDesign.LargeImageSelectPage.JsonValue };
        ajax.call(cmsServerConfig.configApiServerPath+'WebDesignerMainPage/EditHtml', model, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsPageDesign.closeModal();
            }
            cmsPageDesign.busyIndicator.isActive = false;
            cmsPageDesign.addRequested = false;
        }).error(function (data2, errCode2, c2, d2) {
            rashaErManage.checkAction(data2);
            cmsPageDesign.busyIndicator.isActive = false;
            cmsPageDesign.addRequested = false;
        });
    }
    //#help# انتخاب صفحه پیش فرض



    cmsPageDesign.onPageTypeChange = function (value) {
        if (value == 2)
            cmsPageDesign.selectedItem.LinkCmsPageId = 0;
    }


  //#fastUpload
    cmsPageDesign.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCore/CmsSite/upload.html',
            size: 'lg',
            scope: $scope
        });

        cmsPageDesign.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            cmsPageDesign.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    cmsPageDesign.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    cmsPageDesign.whatcolor = function (progress) {
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

    cmsPageDesign.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }

    // File Manager actions
    cmsPageDesign.replaceFile = function (name) {
        cmsPageDesign.itemClicked(null, cmsPageDesign.fileIdToDelete, "file");
        cmsPageDesign.fileTypes = 1;
        cmsPageDesign.fileIdToDelete = cmsPageDesign.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", cmsPageDesign.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                cmsPageDesign.FileItem = response3.Item;
                                cmsPageDesign.FileItem.FileName = name;
                                cmsPageDesign.FileItem.Extension = name.split('.').pop();
                                cmsPageDesign.FileItem.FileSrc = name;
                                cmsPageDesign.FileItem.LinkCategoryId = cmsPageDesign.thisCategory;
                                cmsPageDesign.saveNewFile();
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
    cmsPageDesign.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", cmsPageDesign.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                cmsPageDesign.FileItem = response.Item;
                return 1;
            }
            else {
                return 0;
            }
        }).error(function (data) {
            cmsPageDesign.showErrorIcon();
            return -1;
        });
    }

    //file is exist
    cmsPageDesign.fileIsExist = function (fileName) {
        for (var i = 0; i < cmsPageDesign.FileList.length; i++) {
            if (cmsPageDesign.FileList[i].FileName == fileName) {
                cmsPageDesign.fileIdToDelete = cmsPageDesign.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    cmsPageDesign.getFileItem = function (id) {
        for (var i = 0; i < cmsPageDesign.FileList.length; i++) {
            if (cmsPageDesign.FileList[i].Id == id) {
                return cmsPageDesign.FileList[i];
            }
        }
    }

    //select file or folder
    cmsPageDesign.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            cmsPageDesign.fileTypes = 1;
            cmsPageDesign.selectedFileId = cmsPageDesign.getFileItem(index).Id;
            cmsPageDesign.selectedFileName = cmsPageDesign.getFileItem(index).FileName;
        }
        else {
            cmsPageDesign.fileTypes = 2;
            cmsPageDesign.selectedCategoryId = cmsPageDesign.getCategoryName(index).Id;
            cmsPageDesign.selectedCategoryTitle = cmsPageDesign.getCategoryName(index).Title;
        }
        cmsPageDesign.selectedIndex = index;
    }

    //upload file
    cmsPageDesign.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (cmsPageDesign.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ cmsPageDesign.replaceFile(name);
                    cmsPageDesign.itemClicked(null, cmsPageDesign.fileIdToDelete, "file");
                    cmsPageDesign.fileTypes = 1;
                    cmsPageDesign.fileIdToDelete = cmsPageDesign.selectedIndex;
                     // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                cmsPageDesign.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        cmsPageDesign.FileItem = response2.Item;
                        cmsPageDesign.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        cmsPageDesign.filePickerMainImage.filename =
                          cmsPageDesign.FileItem.FileName;
                        cmsPageDesign.filePickerMainImage.fileId =
                          response2.Item.Id;
                        cmsPageDesign.selectedItem.LinkMainImageId =
                          cmsPageDesign.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      cmsPageDesign.showErrorIcon();
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
                    cmsPageDesign.FileItem = response.Item;
                    cmsPageDesign.FileItem.FileName = uploadFile.name;
                    cmsPageDesign.FileItem.uploadName = uploadFile.uploadName;
                    cmsPageDesign.FileItem.Extension = uploadFile.name.split('.').pop();
                    cmsPageDesign.FileItem.FileSrc = uploadFile.name;
                    cmsPageDesign.FileItem.LinkCategoryId = null;  //Save the new file in the root
                    // ------- cmsPageDesign.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", cmsPageDesign.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            cmsPageDesign.FileItem = response.Item;
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            cmsPageDesign.filePickerFavIcon.filename = cmsPageDesign.FileItem.FileName;
                            cmsPageDesign.filePickerFavIcon.fileId = response.Item.Id;
                            cmsPageDesign.selectedItem.LinkFavIconId = cmsPageDesign.filePickerFavIcon.fileId;
                        }
                        else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        cmsPageDesign.showErrorIcon();
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
    //End #fastUpload
    //Get TotalRowCount
    cmsPageDesign.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"WebDesignerMainPage/count", cmsPageDesign.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsPageDesign.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            cmsPageDesign.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);