app.controller("cmsSiteGridCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$builder', '$rootScope', '$window', '$state', '$stateParams', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $builder, $rootScope, $window, $state, $stateParams, $filter) {

    var cmsSitegrd = this;
    cmsSitegrd.RouteUploadFileContent = cmsServerConfig.configRouteUploadFileContent;
    //#formBuilder: define array for values
    cmsSitegrd.defaultValue = [];
    cmsSitegrd.configType = null;
    if (itemRecordStatus != undefined) cmsSitegrd.itemRecordStatus = itemRecordStatus;

    var LinkCreatedBySiteId = 0;
    cmsSitegrd.selectedItem = {};
    cmsSitegrd.selectedItem.ExpireDate = date;

    cmsSitegrd.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    cmsSitegrd.filePickerFavIcon = {
        isActive: true,
        backElement: 'filePickerFavIcon',
        filename: null,
        fileId: null,
        multiSelect: false,
    }

    cmsSitegrd.LinkCreatedBySiteIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCreatedBySiteId',
        url: 'coresite',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Id',
        rowPerPage: 200,
        scope: cmsSitegrd,
        columnOptions: {
            columns: [{
                    name: 'Id',
                    displayName: 'کد سیستمی',
                    sortable: true,
                    type: 'integer'
                },
                {
                    name: 'LinkSiteId',
                    displayName: 'کد سیستمی سایت',
                    sortable: true,
                    type: 'integer',
                    visible: true
                },
                {
                    name: 'Title',
                    displayName: 'عنوان',
                    sortable: true,
                    type: 'string'
                },
                {
                    name: 'Domain',
                    displayName: 'دامنه',
                    sortable: true,
                    type: 'string'
                },
                {
                    name: 'SubDomain',
                    displayName: 'زیر دامنه',
                    sortable: true,
                    type: 'string'
                }
            ]
        }
    }

  
    cmsSitegrd.AccountingFormCreatedDateDatePickerConfig = {
        defaultDate: date,
        setTime: function (date) {
            this.defaultDate = date;
        }
    }

    cmsSitegrd.AccountingFormUpdatedDateDatePickerConfig = {
        defaultDate: date,
        setTime: function (date) {
            this.defaultDate = date;
        }
    }
    var date = moment().format();
    

    //#tagsInput -----
    cmsSitegrd.onTagAdded = function (tag) {
        if (!angular.isDefined(tag.id)) { //Check if this a new or a existing tag (existing tags comprise with an id)
            var tagObject = jQuery.extend({}, cmsSitegrd.ModuleTag); //#Clone a Javascript Object
            tagObject.Title = tag.text;
            ajax.call('/api/cmsSiteTag/add', tagObject, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                if (response.IsSuccess) {
                    cmsSitegrd.tags[cmsSitegrd.tags.length - 1] = {
                        id: response.Item.Id,
                        text: response.Item.Title
                    }; //Replace the newly added tag (last in the array) with a new object including its Id
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }
    }
    cmsSitegrd.onTagRemoved = function (tag) {}
    //End of #tagsInput

    cmsSitegrd.OwnerSiteSetStatusListItems = [{
        Id: 1,
        Title: "فعال"
    }, {
        Id: 2,
        Title: "غیرفعال"
    }, {
        Id: 3,
        Title: "در حال نگهداری"
    }, {
        Id: 4,
        Title: "محدود به کاربر"
    }];

    cmsSitegrd.init = function () {

        var action = "getallwithalias";
        if ($stateParams.selectedId != null && $stateParams.selectedId > 0) {
            //cmsSitegrd.gridOptions.advancedSearchData.engine.Filters = [];
            cmsSitegrd.gridOptions.advancedSearchData.engine.Filters.push({
                PropertyName: "LinkCreatedBySiteId",
                IntValue1: $stateParams.selectedId
            });
            action = "getallChildwithalias";

        }
        cmsSitegrd.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath + "CoreSite/" + action, cmsSitegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSitegrd.ListItems = response.ListItems;
            if (response.ListItems.length > 0 && $stateParams.selectedId != null)
                LinkCreatedBySiteId = response.ListItems[0].LinkCreatedBySiteId;
            cmsSitegrd.TotalRowCount = response.TotalRowCount;
            cmsSitegrd.filterEnumOwnerSiteSetStatus(cmsSitegrd.ListItems);
            cmsSitegrd.gridOptions.fillData(cmsSitegrd.ListItems, response.resultAccess);
            cmsSitegrd.busyIndicator.isActive = false;
            cmsSitegrd.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsSitegrd.gridOptions.totalRowCount = response.TotalRowCount;
            cmsSitegrd.gridOptions.rowPerPage = response.RowPerPage;
            cmsSitegrd.gridOptions.maxSize = 5;
            ajax.call(cmsServerConfig.configApiServerPath + "CoreEnum/EnumUserLanguage", {}, 'POST').success(function (response) {
                cmsSitegrd.UserLanguage = response.ListItems;
                cmsSitegrd.setUserLanguageEnum(cmsSitegrd.ListItems, cmsSitegrd.UserLanguage);
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
        }).error(function (data, errCode, c, d) {
            cmsSitegrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            cmsSitegrd.busyIndicator.isActive = false;
        });

        if (!angular.isDefined(cmsSitegrd.CategoryListItems))
            ajax.call(cmsServerConfig.configApiServerPath + "CoreSiteCategory/getall", {}, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                cmsSitegrd.CategoryListItems = response.ListItems;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });

        cmsSitegrd.cmsUserGroups = [{
            Id: 2,
            Title: "مدیر سایت"
        }, {
            Id: 3,
            Title: "کاربر سایت"
        }, {
            Id: 5,
            Title: "دموی مدیریت سایت"
        }]
    }
    cmsSitegrd.setUserLanguageEnum = function (listItems, enumList) {
        angular.forEach(listItems, function (item, property) {
            angular.forEach(enumList, function (value, key) {
                if (item.UserLanguage == value.Value)
                    item.UserLanguageTitle = value.Description;
            });
        });
    }
    // Open Add New Content Modal
    cmsSitegrd.addRequested = false;
    cmsSitegrd.CoreConfig = {};
    cmsSitegrd.openAddModal = function () {
        cmsSitegrd.modalTitle = 'اضافه';
        cmsSitegrd.kwords = [];
        //Get Available Domains
        ajax.call(cmsServerConfig.configApiServerPath + "coreconfiguration/adminmain", "", "GET").success(function (response) {
            cmsSitegrd.CoreConfig = response.Item;
            console.log("response.DomainsList", cmsSitegrd.CoreConfig.DomainsList);
            cmsSitegrd.domainsList = ['oco.ir'];
            if (cmsSitegrd.CoreConfig.DomainsList)
                cmsSitegrd.domainsList = cmsSitegrd.CoreConfig.DomainsList.replace(/\n/g, ",").split(',');
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
        ajax.call(cmsServerConfig.configApiServerPath + 'CoreSite/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSitegrd.selectedItem = response.Item;
            if (cmsSitegrd.CategoryListItems.length > 0)
                cmsSitegrd.selectedItem.LinkSiteCategoryId = cmsSitegrd.CategoryListItems[0].Id; // For auto selecting first SiteCategory option
            cmsSitegrd.filePickerFavIcon.fileId = 0;
            cmsSitegrd.filePickerFavIcon.fileName = "";
            //Set DatPickers
            cmsSitegrd.AccountingFormCreatedDateDatePickerConfig.defaultDate = date;
            cmsSitegrd.AccountingFormUpdatedDateDatePickerConfig.defaultDate = date;
            cmsSitegrd.selectedItem.mode = 1;
            cmsSitegrd.selectedItem.LinkCreatedBySiteId = $scope.tokenInfo.Item.SiteId;
            cmsSitegrd.selectedItem.IsActivated = 1;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/cmsSite/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    // Add New Content
    cmsSitegrd.addNewRow = function (frm) {
        if (frm.$invalid)
            return;
        cmsSitegrd.busyIndicator.isActive = true;
        cmsSitegrd.addRequested = true;
        //Save Keywords
        $.each(cmsSitegrd.kwords, function (index, item) {
            if (index == 0)
                cmsSitegrd.selectedItem.Keyword = item.text;
            else
                cmsSitegrd.selectedItem.Keyword += ',' + item.text;
        });
        if (cmsSitegrd.selectedItem.mode == 1)
            ajax.call(cmsServerConfig.configApiServerPath + 'CoreSite/add', cmsSitegrd.selectedItem, 'POST').success(function (response) {
                cmsSitegrd.addRequested = false;
                rashaErManage.checkAction(response);
                if (response.IsSuccess) {
                    cmsSitegrd.filterEnumSiteCategory(response.Item);
                    cmsSitegrd.filterEnumOwnerSiteSetStatus(response.Item);
                    cmsSitegrd.ListItems.unshift(response.Item);
                    cmsSitegrd.gridOptions.fillData(cmsSitegrd.ListItems,cmsSitegrd.gridOptions.resultAccess);
                    
                    cmsSitegrd.busyIndicator.isActive = false;
                    cmsSitegrd.setUserLanguageEnum(cmsSitegrd.ListItems, cmsSitegrd.UserLanguage);
                    cmsSitegrd.closeModal();
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                cmsSitegrd.addRequested = false;
            });
        if (cmsSitegrd.selectedItem.mode == 2) //ساخت سایت با کاربر جدید
            ajax.call(cmsServerConfig.configApiServerPath + 'CoreUser/add', cmsSitegrd.selectedItem, 'POST').success(function (response1) {
                cmsSitegrd.addRequested = false;
                rashaErManage.checkAction(response1);
                cmsSitegrd.selectedUser = response1.Item;
                if (response1.IsSuccess) {
                    ajax.call(cmsServerConfig.configApiServerPath + 'CoreSite/add', cmsSitegrd.selectedItem, 'POST').success(function (response2) {
                        cmsSitegrd.addRequested = false;
                        rashaErManage.checkAction(response2);
                        if (response2.IsSuccess) {
                            cmsSitegrd.filterEnumSiteCategory(response2.Item);
                            cmsSitegrd.filterEnumOwnerSiteSetStatus(response2.Item);
                            cmsSitegrd.ListItems.unshift(response2.Item);
                            cmsSitegrd.gridOptions.fillData(cmsSitegrd.ListItems, response2.resultAccess);
                            cmsSitegrd.busyIndicator.isActive = false;
                            cmsSitegrd.closeModal();
                            ajax.call(cmsServerConfig.configApiServerPath + 'CoreSiteUser/add', {
                                LinkSiteId: response2.Item.Id,
                                LinkUserId: cmsSitegrd.selectedUser.Id,
                                LinkUserGroupId: cmsSitegrd.selectedItem.LinkUserGroupId
                            }, 'POST').success(function (response3) {
                                cmsSitegrd.addRequested = false;
                                rashaErManage.checkAction(response3);
                                if (response3.IsSuccess) {

                                }
                            }).error(function (data, errCode, c, d) {
                                rashaErManage.checkAction(data, errCode);
                                cmsSitegrd.addRequested = false;
                            });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                        cmsSitegrd.addRequested = false;
                    });
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                cmsSitegrd.addRequested = false;
            });
        if (cmsSitegrd.selectedItem.mode == 3) //ساخت سایت با کاربر کنونی
            ajax.call(cmsServerConfig.configApiServerPath + 'CoreUser/GetOne', cmsSitegrd.selectedItem.LinkUserId, 'GET').success(function (response) {
                rashaErManage.checkAction(response);
                cmsSitegrd.selectedUser = response.Item;
                if (cmsSitegrd.selectedUser.Id > 0)
                    ajax.call(cmsServerConfig.configApiServerPath + 'CoreSite/add', cmsSitegrd.selectedItem, 'POST').success(function (response) {
                        cmsSitegrd.addRequested = false;
                        rashaErManage.checkAction(response);
                        if (response.IsSuccess) {
                            cmsSitegrd.filterEnumSiteCategory(response.Item);
                            cmsSitegrd.filterEnumOwnerSiteSetStatus(response.Item);
                            cmsSitegrd.ListItems.unshift(response.Item);
                            cmsSitegrd.gridOptions.fillData(cmsSitegrd.ListItems, cmsSitegrd.gridOptions.resultAccess);
                            cmsSitegrd.busyIndicator.isActive = false;
                            cmsSitegrd.closeModal();
                            ajax.call(cmsServerConfig.configApiServerPath + 'CoreSiteUser/add', {
                                LinkSiteId: response.Item.Id,
                                LinkUserId: cmsSitegrd.selectedUser.Id,
                                LinkUserGroupId: cmsSitegrd.selectedItem.LinkUserGroupId,
                                RecordStatus: 1
                            }, 'POST').success(function (response) {
                                cmsSitegrd.addRequested = false;
                                rashaErManage.checkAction(response);
                                if (response.IsSuccess) {}
                            }).error(function (data, errCode, c, d) {
                                rashaErManage.checkAction(data, errCode);
                                cmsSitegrd.addRequested = false;
                            });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                        cmsSitegrd.addRequested = false;
                    });
                else {
                    rashaErManage.showMessage("کد سیستمی کاربر اشتباه است");
                    return;
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                cmsSitegrd.addRequested = false;
            });
    }

    // Open Edit Content Modal
    cmsSitegrd.openEditModal = function () {
        cmsSitegrd.modalTitle = 'ویرایش';
        if (!cmsSitegrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ajax.call(cmsServerConfig.configApiServerPath + 'CoreSite/GetOne', cmsSitegrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSitegrd.selectedItem = response.Item;
            if(!cmsSitegrd.selectedItem.ExpireDate)
                cmsSitegrd.selectedItem.ExpireDate=moment().add(1, "months").format();
            //Clear FavIcon file picker
            cmsSitegrd.filePickerFavIcon.filename = null;
            cmsSitegrd.filePickerFavIcon.fileId = null;
            //Set DatPickers 
            cmsSitegrd.AccountingFormCreatedDateDatePickerConfig.defaultDate = cmsSitegrd.selectedItem.AccountingFormCreatedDate;
            cmsSitegrd.AccountingFormUpdatedDateDatePickerConfig.defaultDate = cmsSitegrd.selectedItem.AccountingFormUpdatedDate;
            //Set FavIcon
            if (response.Item.LinkFavIconId != null) {
                ajax.call(cmsServerConfig.configApiServerPath + 'FileContent/GetOne', response.Item.LinkFavIconId, 'GET').success(function (response) {
                    cmsSitegrd.filePickerFavIcon.filename = response.Item.FileName;
                    cmsSitegrd.filePickerFavIcon.fileId = response.Item.Id
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            //Load Keywords tagsInput
            cmsSitegrd.kwords = []; //Clear out previous tags
            var arraykwords = [];
            if (cmsSitegrd.selectedItem.Keyword != null && cmsSitegrd.selectedItem.Keyword != "")
                arraykwords = cmsSitegrd.selectedItem.Keyword.split(',');
            $.each(arraykwords, function (index, item) {
                if (item != null)
                    cmsSitegrd.kwords.push({
                        text: item
                    }); //Add current content's tag to tags array with id and title
            });
            //End of file picker codes
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/CmsSite/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    cmsSitegrd.editRow = function (frm) {
        if (frm.$invalid)
            return;
        cmsSitegrd.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath + 'CoreSite/edit', cmsSitegrd.selectedItem, 'PUT').success(function (response) {
            cmsSitegrd.addRequested = true;
            rashaErManage.checkAction(response);
            cmsSitegrd.addRequested = false;
            cmsSitegrd.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                cmsSitegrd.filterEnumSiteCategory(response.Item);
                cmsSitegrd.filterEnumOwnerSiteSetStatus(response.Item);
                cmsSitegrd.replaceItem(cmsSitegrd.selectedItem.Id, response.Item);
                cmsSitegrd.gridOptions.fillData(cmsSitegrd.ListItems, cmsSitegrd.gridOptions.resultAccess);
                cmsSitegrd.setUserLanguageEnum(cmsSitegrd.ListItems, cmsSitegrd.UserLanguage);
                cmsSitegrd.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsSitegrd.addRequested = false;
            cmsSitegrd.busyIndicator.isActive = false;
        });
    }

    cmsSitegrd.closeModal = function () {

        $modalStack.dismissAll();
    };

    cmsSitegrd.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsSitegrd.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsSitegrd.ListItems.indexOf(item);
                cmsSitegrd.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsSitegrd.ListItems.unshift(newItem);
    }

    cmsSitegrd.deleteRow = function () {
        if (!cmsSitegrd.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                ajax.call(cmsServerConfig.configApiServerPath + 'CoreSite/GetOne', cmsSitegrd.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    cmsSitegrd.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath + 'CoreSite/delete', cmsSitegrd.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsSitegrd.replaceItem(cmsSitegrd.selectedItemForDelete.Id);
                            cmsSitegrd.gridOptions.fillData(cmsSitegrd.ListItems);
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

    cmsSitegrd.searchData = function () {
        cmsSitegrd.gridOptions.serachData();
    }


    cmsSitegrd.gridOptions = {
        columns: [{
                name: 'Id',
                displayName: 'کد سیستمی',
                sortable: true,
                type: 'integer'
            },
            {
                name: "Action",
                displayName: "عکس",
                sortable: true,
                visible: true,
                template: '<img ng-src="{{x.MainImageSrc}}" style="width:80px;height:80px" />'
            },
            {
                name: 'LinkCreatedBySiteId',
                displayName: 'کد سیستمی والد',
                sortable: true,
                type: 'integer',
                visible: true
            },
            {
                name: 'ExpireDate',
                displayName: 'تاریخ انقضا',
                sortable: true,
                isDate: true,
                type: 'date',
                visible: 'true'
            },
            {
                name: 'CreatedDate',
                displayName: 'ساخت',
                sortable: true,
                isDate: true,
                type: 'date',
                visible: 'true'
            },
            {
                name: 'UpdatedDate',
                displayName: 'ویرایش',
                sortable: true,
                isDate: true,
                type: 'date',
                visible: 'true'
            },
            {
                name: 'UserLanguageTitle',
                displayName: 'زبان',
                sortable: true,
                type: 'string'
            },
            {
                name: 'Title',
                displayName: 'عنوان',
                sortable: true,
                type: 'string'
            },
            {
                name: 'BaseUrl',
                displayName: 'آدرس پایه',
                sortable: true,
                type: 'string'
            },
            {
                name: 'Domain',
                displayName: 'دامنه',
                sortable: true,
                type: 'string'
            },
            {
                name: 'SubDomain',
                displayName: 'زیر دامنه',
                sortable: true,
                type: 'string'
            },
            {
                name: 'OwnerSiteSetStatusTitle',
                displayName: 'وضعیت',
                sortable: true,
                type: 'string'
            },
            {
                name: 'SetDomains',
                displayName: 'دامنه ها',
                sortable: true,
                type: 'string',
                visible: true,
                displayForce: true,
                template: '<a type="button" ng-show="cmsSitegrd.gridOptions.resultAccess.AccessWatchRow" class="btn btn-primary" ng-disabled="cmsSitegrd.addRequested" ng-click="cmsSitegrd.openAliasesModal(x.Id)"><i class="fa fa-plus-circle" aria-hidden="true"></i>&nbsp;دامنه ها</a>'
            },
            {
                name: 'SetModules',
                displayName: 'ماژول ها',
                sortable: true,
                type: 'string',
                visible: true,
                displayForce: true,
                template: '<a type="button" ng-show="cmsSitegrd.gridOptions.resultAccess.AccessWatchRow" class="btn btn-success" ng-disabled="cmsSitegrd.addRequested" ng-click="cmsSitegrd.openModulesModal(x.Id)"><i class="fa fa-plus-circle" aria-hidden="true"></i>&nbsp;ماژول ها</a>'
            },
            {
                name: 'Login',
                displayName: 'ورود',
                sortable: true,
                type: 'string',
                visible: true,
                displayForce: true,
                template: '<a type="button" ng-show="cmsSitegrd.gridOptions.resultAccess.AccessWatchRow" class="btn btn-warning" ng-disabled="cmsSitegrd.addRequested" ng-click="cmsSitegrd.loginToSite(x.Id)"><i class="fa fa-sign-in" aria-hidden="true"></i>&nbsp;ورود</a>'
            },
            {
                name: 'Login',
                displayName: 'سایت های زیرمجموعه',
                sortable: true,
                type: 'string',
                visible: true,
                displayForce: true,
                template: '<a type="button" ng-show="tokenInfo.Item.UserAccessAllowToChildSite" class="btn btn-info" ng-disabled="cmsSitegrd.addRequested" ng-click="cmsSitegrd.showChildren(x.Id)">نمایش&nbsp;<i class="fa fa-arrow-circle-left" aria-hidden="true"></i></a>'
            }
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
                Filters: [],
                Count: false
            }
        }
    }
    cmsSitegrd.MainImageSrc = function (ImageSite) {
        ImageUrl = ImageSite;
        return ImageUrl;
    }
    cmsSitegrd.gridOptions.onRowSelected = function () {}

    cmsSitegrd.gridOptions.reGetAll = function () {
        cmsSitegrd.init();
    }

    cmsSitegrd.filterEnumSiteCategory = function (item) {
        for (var j = 0; j < cmsSitegrd.CategoryListItems.length; j++) {
            if (item.LinkSiteCategoryId == cmsSitegrd.CategoryListItems[j].Id) {
                item.virtual_CmsSiteCategory = {};
                item.virtual_CmsSiteCategory.Title = "";
                item.virtual_CmsSiteCategory.Title = cmsSitegrd.CategoryListItems[j].Title;
            }
        }
    }

    cmsSitegrd.filterEnumOwnerSiteSetStatus = function (ListItemsOrItem) {
        if (!ListItemsOrItem.length) { // It's an Item
            for (var j = 0; j < cmsSitegrd.OwnerSiteSetStatusListItems.length; j++) {
                if (ListItemsOrItem.OwnerSiteSetStatus == cmsSitegrd.OwnerSiteSetStatusListItems[j].Id) {
                    ListItemsOrItem.OwnerSiteSetStatusTitle = cmsSitegrd.OwnerSiteSetStatusListItems[j].Title;
                }
            }
        } else { // It's a Listitems
            for (var i = 0; i < ListItemsOrItem.length; i++) {
                for (var j = 0; j < cmsSitegrd.OwnerSiteSetStatusListItems.length; j++) {
                    if (ListItemsOrItem[i].OwnerSiteSetStatus == cmsSitegrd.OwnerSiteSetStatusListItems[j].Id) {
                        ListItemsOrItem[i].OwnerSiteSetStatusTitle = cmsSitegrd.OwnerSiteSetStatusListItems[j].Title;
                    }
                }
            }
        }
    }

    //Add alias
    cmsSitegrd.openAliasesModal = function (siteId) {
        cmsSitegrd.modalTitle = "دامنه ها";
        ajax.call(cmsServerConfig.configApiServerPath + 'CoreSiteDomainAlias/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsSitegrd.selectedItem = response.Item;
                $modal.open({
                    templateUrl: 'cpanelv1/ModuleCore/CmsSite/addAlias.html',
                    scope: $scope
                });
                cmsSitegrd.selectedItem.LinkCmsSiteId = siteId;
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
        var filterModel = {
            Filters: [{
                PropertyName: "LinkCmsSiteId",
                SearchType: 0,
                IntValue1: siteId
            }]
        };
        ajax.call(cmsServerConfig.configApiServerPath + 'CoreSiteDomainAlias/getall', filterModel, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsSitegrd.aliasesList = response.ListItems;
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    cmsSitegrd.addNewAlias = function (frm) {
        if (frm.$invalid)
            return;
        cmsSitegrd.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath + 'CoreSiteDomainAlias/add', cmsSitegrd.selectedItem, 'POST').success(function (response) {
            cmsSitegrd.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsSitegrd.busyIndicator.isActive = false;
                cmsSitegrd.aliasesList.push(response.Item);
                //Clear inputs
                cmsSitegrd.selectedItem.Domain = "";
                cmsSitegrd.selectedItem.SubDomain = "";
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsSitegrd.addRequested = false;
        });

    }

    cmsSitegrd.deleteAttachedfieldName = function (index) {
        ajax.call(cmsServerConfig.configApiServerPath + 'CoreSiteDomainAlias/delete', cmsSitegrd.aliasesList[index], 'POST').success(function (res) {
            rashaErManage.checkAction(res);
            if (res.IsSuccess) {
                cmsSitegrd.aliasesList.splice(index, 1);
                rashaErManage.showMessage($filter('translatentk')('Removed_Successfully'));
            }
        }).error(function (data2, errCode2, c2, d2) {
            rashaErManage.checkAction(data2);
        });
    }

    cmsSitegrd.CmsModuleSite = [];
    cmsSitegrd.CmsModuleSiteDb = [];
    cmsSitegrd.CmsModuleSiteAdded = [];
    cmsSitegrd.CmsModuleSiteRemoved = [];
    cmsSitegrd.CmsModuleSiteEdited = [];

    //Open ModuleSites Modal
    cmsSitegrd.openModulesModal = function (siteId) {
        cmsSitegrd.selectedSiteId = siteId;
        cmsSitegrd.newModuleSiteListItems = []; // List of ModuleSites
        cmsSitegrd.modalTitle = "ماژول ها";
        cmsSitegrd.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath + "CoreModule/GetAll", {}, 'POST').success(function (response) {
            cmsSitegrd.cmsModulesListItems = response.ListItems;
            cmsSitegrd.cmsModulesListItemsresultAccess = response.resultAccess;
            //Set DatePicker = Now  به ازای هر ماژول یک دیت پیکر ساخته می شود

            $.each(cmsSitegrd.cmsModulesListItems, function (index, item) {

                var modulConfig = angular.fromJson(item.ModuleConfigAdminMainJson);
                if (modulConfig && modulConfig.AccessBuyMonth) {
                    item.AccessBuyMonth = modulConfig.AccessBuyMonth;
                } else {
                    item.AccessBuyMonth = 2;
                }
                
                item.ModuleSiteExpireDate = moment().add(item.AccessBuyMonth, "months").format();
            });
            cmsSitegrd.selectedItem = {};

            var engine = {};
            engine.Filters = [];
            // engine.Filters.push({
            //     PropertyName: "LinkSiteId",
            //     IntValue1: siteId,
            //     SearchType: 0
            // });
            ajax.call(cmsServerConfig.configApiServerPath + "CoreModuleSite/GetAll/" + siteId, engine, 'POST').success(function (response) {
                cmsSitegrd.busyIndicator.isActive = false;
              
                cmsSitegrd.CmsModuleSite = angular.extend(cmsSitegrd.CmsModuleSite, response.ListItems);
                cmsSitegrd.CmsModuleSiteDb = angular.extend(cmsSitegrd.CmsModuleSiteDb, response.ListItems);
                cmsSitegrd.cmsModulesSiteresultAccess = response.resultAccess;

                for (var i = 0; i < cmsSitegrd.cmsModulesListItems.length; i++) {
                    cmsSitegrd.cmsModulesListItems[i].Checked = false;
                    cmsSitegrd.cmsModulesListItems[i].hasExpired = false;
                    for (var j = 0; j < cmsSitegrd.CmsModuleSiteDb.length; j++) {

                        if (cmsSitegrd.cmsModulesListItems[i].Id == cmsSitegrd.CmsModuleSiteDb[j].LinkModuleId) {
                            cmsSitegrd.cmsModulesListItems[i].CmsModuleSiteRecordStatus = cmsSitegrd.CmsModuleSiteDb[j].RecordStatus;
                            cmsSitegrd.cmsModulesListItems[i].RenewDate = cmsSitegrd.CmsModuleSiteDb[j].RenewDate;
                            if (cmsSitegrd.CmsModuleSiteDb[j].ExpireDate) {
                                cmsSitegrd.cmsModulesListItems[i].ModuleSiteExpireDate=cmsSitegrd.CmsModuleSiteDb[j].ExpireDate;
                            } else {
                                cmsSitegrd.CmsModuleSiteDb[j].ExpireDate = moment().add(cmsSitegrd.cmsModulesListItems[i].AccessBuyMonth, "months").format()
                                cmsSitegrd.CmsModuleSiteDb[j].Edited = true;
                            }
                         
                            if (cmsSitegrd.cmsModulesListItems[i].CmsModuleSiteRecordStatus == 1 && !cmsSitegrd.cmsModulesListItems[i].hasExpired) //if CmsModuleSite RecordSatus is Available
                                cmsSitegrd.cmsModulesListItems[i].Checked = true;
                        }
                    }
                }
                $modal.open({
                    templateUrl: 'cpanelv1/ModuleCore/CmsSite/EditModules.html',
                    scope: $scope
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }

    cmsSitegrd.onModuleCkeckedChange = function (module) {
        var retFind = findWithAttr(cmsSitegrd.CmsModuleSite, "LinkModuleId", module.Id);
        if (retFind >= 0) {
            cmsSitegrd.CmsModuleSite[retFind].Edited = true;
            if (module.Checked) {
                cmsSitegrd.CmsModuleSite[retFind].RecordStatus = 1;
            } else {
                cmsSitegrd.CmsModuleSite[retFind].RecordStatus = 5;
            }
            cmsSitegrd.CmsModuleSite[retFind].ExpireDate = module.ModuleSiteExpireDate;
        } else {
            cmsSitegrd.CmsModuleSite.push({
                RecordStatus: 1,
                LinkModuleId: module.Id,
                LinkSiteId: cmsSitegrd.selectedSiteId,
                ExpireDate : module.ModuleSiteExpireDate
            });
        }
    }

    // Add a new ModuleSite
    cmsSitegrd.EditModuleSites = function () {
        cmsSitegrd.addRequested = true;
        cmsSitegrd.busyIndicator.isActive = true;

        ///Save CmsModuleSite
        cmsSitegrd.CmsModuleSiteRemoved = differenceInFirstArray(cmsSitegrd.CmsModuleSiteDb, cmsSitegrd.CmsModuleSite, 'Id');
        cmsSitegrd.CmsModuleSiteAdded = differenceInFirstArray(cmsSitegrd.CmsModuleSite, cmsSitegrd.CmsModuleSiteDb, 'Id');
        cmsSitegrd.CmsModuleSiteEdit = [];
        $.each(cmsSitegrd.CmsModuleSite, function (index, item) {
            if (item.Edited && item.Id && item.Id > 0)
                cmsSitegrd.CmsModuleSiteEdit.push(item);
        });

        var changedAny=false;
        //remove
        if (cmsSitegrd.CmsModuleSiteRemoved && cmsSitegrd.CmsModuleSiteRemoved.length > 0) {
            ajax.call(cmsServerConfig.configApiServerPath + "CoreModuleSite/DeleteList", cmsSitegrd.CmsModuleSiteRemoved, "Delete").success(function (response) {
                    rashaErManage.checkAction(response);
                    rashaErManage.showMessage("ماژول های اضافه حذف شد");
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    rashaErManage.showMessage("خطا در حذف ماژول های اضافه");
                });
                changedAny=true;
        }
        //Add
        if (cmsSitegrd.CmsModuleSiteAdded && cmsSitegrd.CmsModuleSiteAdded.length > 0) {
            ajax.call(cmsServerConfig.configApiServerPath + "CoreModuleSite/addbatch", cmsSitegrd.CmsModuleSiteAdded, "POST").success(function (response) {
                    rashaErManage.checkAction(response);
                    rashaErManage.showMessage("ماژول های جدید اضافه شد");
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    rashaErManage.showMessage("خطا در اضاف کردن ماژول های جدید");
                });
                changedAny=true;
        }
        //edit
        if (cmsSitegrd.CmsModuleSiteEdit && cmsSitegrd.CmsModuleSiteEdit.length > 0) {
            ajax.call(cmsServerConfig.configApiServerPath + "CoreModuleSite/editbatch", cmsSitegrd.CmsModuleSiteEdit, "PUT").success(function (response) {
                    rashaErManage.checkAction(response);
                    rashaErManage.showMessage("ماژول های قبلی ویرایش شد");
                })
                .error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    rashaErManage.showMessage("خطا در ویرایش کردن ماژول ها");
                });
                changedAny=true;
        }
        if(!changedAny)
        {
            rashaErManage.showMessage("تغییراتی جهت ثبت یافت نشد");
        }
        //edit
        ///Save CmsModuleSite


        cmsSitegrd.addRequested = false;
        cmsSitegrd.busyIndicator.isActive = false;




    }

    //#fastUpload
    cmsSitegrd.openUploadModal = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCore/CmsSite/upload.html',
            size: 'lg',
            scope: $scope
        });

        cmsSitegrd.FileList = [];
        //get list of file from category id
        ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
            cmsSitegrd.FileList = response.ListItems;
        }).error(function (data) {
            console.log(data);
        });

    }

    cmsSitegrd.calcuteProgress = function (progress) {
        wdth = Math.floor(progress * 100);
        return wdth;
    }

    cmsSitegrd.whatcolor = function (progress) {
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

    cmsSitegrd.canShow = function (pr) {
        if (pr == 1) {
            return true;
        }
        return false;
    }

    // File Manager actions
    cmsSitegrd.replaceFile = function (name) {
        cmsSitegrd.itemClicked(null, cmsSitegrd.fileIdToDelete, "file");
        cmsSitegrd.fileTypes = 1;
        cmsSitegrd.fileIdToDelete = cmsSitegrd.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", cmsSitegrd.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath + 'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                cmsSitegrd.FileItem = response3.Item;
                                cmsSitegrd.FileItem.FileName = name;
                                cmsSitegrd.FileItem.Extension = name.split('.').pop();
                                cmsSitegrd.FileItem.FileSrc = name;
                                cmsSitegrd.FileItem.LinkCategoryId = cmsSitegrd.thisCategory;
                                cmsSitegrd.saveNewFile();
                            } else {
                                console.log("getting the model was not successfully returned!");
                            }
                        }).error(function (data) {
                            console.log(data);
                        });
                    } else {
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
    cmsSitegrd.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath + "FileContent/add", cmsSitegrd.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                cmsSitegrd.FileItem = response.Item;
                return 1;
            } else {
                return 0;
            }
        }).error(function (data) {
            cmsSitegrd.showErrorIcon();
            return -1;
        });
    }

    //file is exist
    cmsSitegrd.fileIsExist = function (fileName) {
        for (var i = 0; i < cmsSitegrd.FileList.length; i++) {
            if (cmsSitegrd.FileList[i].FileName == fileName) {
                cmsSitegrd.fileIdToDelete = cmsSitegrd.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    cmsSitegrd.getFileItem = function (id) {
        for (var i = 0; i < cmsSitegrd.FileList.length; i++) {
            if (cmsSitegrd.FileList[i].Id == id) {
                return cmsSitegrd.FileList[i];
            }
        }
    }

    //select file or folder
    cmsSitegrd.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            cmsSitegrd.fileTypes = 1;
            cmsSitegrd.selectedFileId = cmsSitegrd.getFileItem(index).Id;
            cmsSitegrd.selectedFileName = cmsSitegrd.getFileItem(index).FileName;
        } else {
            cmsSitegrd.fileTypes = 2;
            cmsSitegrd.selectedCategoryId = cmsSitegrd.getCategoryName(index).Id;
            cmsSitegrd.selectedCategoryTitle = cmsSitegrd.getCategoryName(index).Title;
        }
        cmsSitegrd.selectedIndex = index;
    }

    //upload file
    cmsSitegrd.uploadFile = function (index, uploadFile) {
        if ($("#save-icon" + index).hasClass("fa-save")) {
            if (cmsSitegrd.fileIsExist(uploadFile.name)) { // File already exists
                if (confirm('File "' + uploadFile.name + '" already exists! Do you want to replace the new file?')) {
                    //------------ cmsSitegrd.replaceFile(uploadFile.name);
                    cmsSitegrd.itemClicked(null, cmsSitegrd.fileIdToDelete, "file");
                    cmsSitegrd.fileTypes = 1;
                    cmsSitegrd.fileIdToDelete = cmsSitegrd.selectedIndex;
                    // replace the file
                    ajax
                        .call(
                            cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                            cmsSitegrd.fileIdToDelete,
                            "GET"
                        )
                        .success(function (response1) {
                            if (response1.IsSuccess == true) {
                                console.log(response1.Item);
                                ajax.call(cmsServerConfig.configApiServerPath + "FileContent/replace", response1.Item, "POST")
                                    .success(function (response2) {
                                        if (response2.IsSuccess == true) {
                                            cmsSitegrd.FileItem = response2.Item;
                                            cmsSitegrd.showSuccessIcon();
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-check");
                                            cmsSitegrd.filePickerMainImage.filename =
                                                cmsSitegrd.FileItem.FileName;
                                            cmsSitegrd.filePickerMainImage.fileId =
                                                response2.Item.Id;
                                            cmsSitegrd.selectedItem.LinkMainImageId =
                                                cmsSitegrd.filePickerMainImage.fileId;
                                        } else {
                                            $("#save-icon" + index).removeClass("fa-save");
                                            $("#save-button" + index).removeClass(
                                                "flashing-button"
                                            );
                                            $("#save-icon" + index).addClass("fa-remove");
                                        }
                                    })
                                    .error(function (data) {
                                        cmsSitegrd.showErrorIcon();
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
            } else { // File does not exists
                // Save New file
                ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetViewModel", "", 'GET').success(function (response) {
                    cmsSitegrd.FileItem = response.Item;
                    cmsSitegrd.FileItem.FileName = uploadFile.name;
                    cmsSitegrd.FileItem.uploadName = uploadFile.uploadName;
                    cmsSitegrd.FileItem.Extension = uploadFile.name.split('.').pop();
                    cmsSitegrd.FileItem.FileSrc = uploadFile.name;
                    cmsSitegrd.FileItem.LinkCategoryId = null; //Save the new file in the root
                    // ------- cmsSitegrd.saveNewFile()  ----------------------
                    var result = 0;
                    ajax.call(cmsServerConfig.configApiServerPath + "FileContent/add", cmsSitegrd.FileItem, 'POST').success(function (response) {
                        if (response.IsSuccess) {
                            cmsSitegrd.FileItem = response.Item;
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-check");
                            cmsSitegrd.filePickerFavIcon.filename = cmsSitegrd.FileItem.FileName;
                            cmsSitegrd.filePickerFavIcon.fileId = response.Item.Id;
                            cmsSitegrd.selectedItem.LinkFavIconId = cmsSitegrd.filePickerFavIcon.fileId;
                        } else {
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        }
                    }).error(function (data) {
                        cmsSitegrd.showErrorIcon();
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
    //start # module config

    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها


    cmsSitegrd.contentBusyConfig = {
        isActive: false,
        message: "در حال بارگذاری ..."
    };


    cmsSitegrd.SiteStorageLoad = function () {

        cmsSitegrd.contentBusyConfig.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath + cmsSitegrd.ModuleConfigSelected.ClassName + 'Configuration/SiteStorage/' + cmsSitegrd.ModuleConfigSelectedSiteId, '', 'GET').success(function (response) {
            if (response.IsSuccess) {
                cmsSitegrd.Item.SiteStorage = response.Item;
            } else {
                rashaErManage.showMessage(response.ErrorMessage);
            }
            cmsSitegrd.contentBusyConfig.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsSitegrd.contentBusyConfig.isActive = false;
        });
    }
    cmsSitegrd.SiteStorageSave = function (frm) {
        if (buttonIsPressed) {
            return;
        }
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        cmsSitegrd.contentBusyConfig.isActive = true;
        cmsSitegrd.buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath + cmsSitegrd.ModuleConfigSelected.ClassName + 'Configuration/SiteStorage/' + cmsSitegrd.ModuleConfigSelectedSiteId, cmsSitegrd.Item.SiteStorage, 'POST').success(function (response) {
            cmsSitegrd.buttonIsPressed = false;
            cmsSitegrd.contentBusyConfig.isActive = false;
            rashaErManage.showMessage("تغییرات با موفقیت انجام شد");
            rashaErManage.checkAction(response);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsSitegrd.buttonIsPressed = false;
            cmsSitegrd.contentBusyConfig.isActive = false;
        });
    }



    // cmsSitegrd.AdminMainLoad = function () {

    //     cmsSitegrd.contentBusyConfig.isActive = true;
    //     ajax.call(cmsServerConfig.configApiServerPath + cmsSitegrd.ModuleConfigSelected.ClassName + "Configuration/AdminMain", '', 'GET').success(function (response) {
    //         if (response.IsSuccess) {
    //             cmsSitegrd.Item.AdminMain = response.Item;
    //         } else {
    //             rashaErManage.showMessage(response.ErrorMessage);
    //         }
    //         cmsSitegrd.contentBusyConfig.isActive = false;
    //     }).error(function (data, errCode, c, d) {
    //         rashaErManage.checkAction(data, errCode);
    //         cmsSitegrd.contentBusyConfig.isActive = false;
    //     });
    // }
    // cmsSitegrd.AdminMainSave = function (frm) {
    //     if (buttonIsPressed) {
    //         return;
    //     }
    //     if (frm.$invalid) {
    //         rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
    //         return;
    //     }
    //     cmsSitegrd.contentBusyConfig.isActive = true;
    //     cmsSitegrd.buttonIsPressed = true;
    //     ajax.call(cmsServerConfig.configApiServerPath + cmsSitegrd.ModuleConfigSelected.ClassName + 'Configuration/AdminMain', cmsSitegrd.Item.AdminMain, 'POST').success(function (response) {
    //         cmsSitegrd.buttonIsPressed = false;
    //         cmsSitegrd.contentBusyConfig.isActive = false;
    //         rashaErManage.showMessage("تغییرات با موفقیت انجام شد");
    //         rashaErManage.checkAction(response);
    //     }).error(function (data, errCode, c, d) {
    //         rashaErManage.checkAction(data, errCode);
    //         cmsSitegrd.buttonIsPressed = false;
    //         cmsSitegrd.contentBusyConfig.isActive = false;
    //     });
    // }

    //cmsSitegrd.SiteDefaultLoad = function () {
    //     cmsSitegrd.contentBusyConfig.isActive = true;
    //     ajax.call(cmsServerConfig.configApiServerPath + cmsSitegrd.ModuleConfigSelected.ClassName + "Configuration/SiteDefault", '', 'GET').success(function (response) {
    //         if (response.IsSuccess) {
    //             cmsSitegrd.Item.SiteDefault = response.Item;
    //         } else {
    //             rashaErManage.showMessage(response.ErrorMessage);
    //         }
    //         cmsSitegrd.contentBusyConfig.isActive = false;
    //     }).error(function (data, errCode, c, d) {
    //         rashaErManage.checkAction(data, errCode);
    //         cmsSitegrd.contentBusyConfig.isActive = false;
    //     });
    // }
    // cmsSitegrd.SiteDefaultSave = function (frm) {
    //     if (buttonIsPressed) {
    //         return;
    //     }
    //     if (frm.$invalid) {
    //         rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
    //         return;
    //     }
    //     cmsSitegrd.contentBusyConfig.isActive = true;
    //     cmsSitegrd.buttonIsPressed = true;
    //     ajax.call(cmsServerConfig.configApiServerPath + cmsSitegrd.ModuleConfigSelected.ClassName + 'Configuration/SiteDefault', cmsSitegrd.Item.SiteDefault, 'POST').success(function (response) {
    //         cmsSitegrd.buttonIsPressed = false;
    //         cmsSitegrd.contentBusyConfig.isActive = false;
    //         rashaErManage.showMessage("تغییرات با موفقیت انجام شد");
    //         rashaErManage.checkAction(response);
    //     }).error(function (data, errCode, c, d) {
    //         rashaErManage.checkAction(data, errCode);
    //         cmsSitegrd.buttonIsPressed = false;
    //         cmsSitegrd.contentBusyConfig.isActive = false;
    //     });
    // }

    cmsSitegrd.SiteLoad = function () {
        cmsSitegrd.contentBusyConfig.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath + cmsSitegrd.ModuleConfigSelected.ClassName + 'Configuration/Site/' + cmsSitegrd.ModuleConfigSelectedSiteId, '', 'GET').success(function (response) {
            if (response.IsSuccess) {
                cmsSitegrd.Item.Site = response.Item;
            } else {
                rashaErManage.showMessage(response.ErrorMessage);
            }
            cmsSitegrd.contentBusyConfig.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsSitegrd.contentBusyConfig.isActive = false;
        });
    }
    cmsSitegrd.SiteSave = function (frm) {
        if (buttonIsPressed) {
            return;
        }
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        cmsSitegrd.contentBusyConfig.isActive = true;
        cmsSitegrd.buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath + cmsSitegrd.ModuleConfigSelected.ClassName + 'Configuration/Site/' + cmsSitegrd.ModuleConfigSelectedSiteId, cmsSitegrd.Item.Site, 'POST').success(function (response) {
            cmsSitegrd.buttonIsPressed = false;
            cmsSitegrd.contentBusyConfig.isActive = false;
            rashaErManage.showMessage("تغییرات با موفقیت انجام شد");
            rashaErManage.checkAction(response);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsSitegrd.buttonIsPressed = false;
            cmsSitegrd.contentBusyConfig.isActive = false;
        });
    }

    // cmsSitegrd.SiteAccessDefaultLoad = function () {
    //     cmsSitegrd.contentBusyConfig.isActive = true;
    //     ajax.call(cmsServerConfig.configApiServerPath + cmsSitegrd.ModuleConfigSelected.ClassName + "Configuration/SiteAccessDefault", '', 'GET').success(function (response) {
    //         if (response.IsSuccess) {
    //             cmsSitegrd.Item.SiteAccessDefault = response.Item;
    //         } else {
    //             rashaErManage.showMessage(response.ErrorMessage);
    //         }
    //         cmsSitegrd.contentBusyConfig.isActive = false;
    //     }).error(function (data, errCode, c, d) {
    //         rashaErManage.checkAction(data, errCode);
    //         cmsSitegrd.contentBusyConfig.isActive = false;
    //     });
    // }
    // cmsSitegrd.SiteAccessDefaultSave = function (frm) {
    //     if (buttonIsPressed) {
    //         return;
    //     }
    //     if (frm.$invalid) {
    //         rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
    //         return;
    //     }
    //     cmsSitegrd.contentBusyConfig.isActive = true;
    //     cmsSitegrd.buttonIsPressed = true;
    //     ajax.call(cmsServerConfig.configApiServerPath + cmsSitegrd.ModuleConfigSelected.ClassName + 'Configuration/SiteAccessDefault', cmsSitegrd.Item.SiteAccessDefault, 'POST').success(function (response) {
    //         cmsSitegrd.buttonIsPressed = false;
    //         cmsSitegrd.contentBusyConfig.isActive = false;
    //         rashaErManage.showMessage("تغییرات با موفقیت انجام شد");
    //         rashaErManage.checkAction(response);
    //     }).error(function (data, errCode, c, d) {
    //         rashaErManage.checkAction(data, errCode);
    //         cmsSitegrd.buttonIsPressed = false;
    //         cmsSitegrd.contentBusyConfig.isActive = false;
    //     });
    // }

    cmsSitegrd.SiteAccessLoad = function () {
        cmsSitegrd.contentBusyConfig.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath + cmsSitegrd.ModuleConfigSelected.ClassName + 'Configuration/SiteAccess/' + cmsSitegrd.ModuleConfigSelectedSiteId, '', 'GET').success(function (response) {
            if (response.IsSuccess) {
                cmsSitegrd.Item.SiteAccess = response.Item;
            } else {
                rashaErManage.showMessage(response.ErrorMessage);
            }
            cmsSitegrd.contentBusyConfig.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsSitegrd.contentBusyConfig.isActive = false;
        });
    }
    cmsSitegrd.SiteAccessSave = function (frm) {
        if (buttonIsPressed) {
            return;
        }
        if (frm.$invalid) {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        cmsSitegrd.contentBusyConfig.isActive = true;
        cmsSitegrd.buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath + cmsSitegrd.ModuleConfigSelected.ClassName + 'Configuration/SiteAccess/' + cmsSitegrd.ModuleConfigSelectedSiteId, cmsSitegrd.Item.SiteAccess, 'POST').success(function (response) {
            cmsSitegrd.buttonIsPressed = false;
            cmsSitegrd.contentBusyConfig.isActive = false;
            rashaErManage.showMessage("تغییرات با موفقیت انجام شد");
            rashaErManage.checkAction(response);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsSitegrd.buttonIsPressed = false;
            cmsSitegrd.contentBusyConfig.isActive = false;
        });
    }
    //init Function       
    cmsSitegrd.Item = {};
    //end #module Config
    //End #fastUpload
    cmsSitegrd.ModuleConfigSelected = {};
    cmsSitegrd.ModuleConfigSelectedSiteId = 0;
    cmsSitegrd.openModuleConfigModal = function (module) {
        if (module == undefined || cmsSitegrd.gridOptions.selectedRow == undefined || cmsSitegrd.gridOptions.selectedRow.item == undefined) {

            return;
        }
        cmsSitegrd.Item.SiteStorage = {};
        cmsSitegrd.Item.AdminMain = {};
        cmsSitegrd.Item.SiteDefault = {};
        cmsSitegrd.Item.Site = {};
        cmsSitegrd.Item.SiteAccessDefault = {};
        cmsSitegrd.ModuleConfigSelected = module;
        cmsSitegrd.ModuleConfigSelectedSiteId = cmsSitegrd.gridOptions.selectedRow.item.Id;

        cmsSitegrd.SiteStorageLoad();
        cmsSitegrd.SiteLoad();
        cmsSitegrd.SiteAccessLoad();

        $modal.open({
            templateUrl: 'cpanelv1/Module' + cmsSitegrd.ModuleConfigSelected.ClassName + '/Config/Module.html',
            scope: $scope
        });
    }
    //cmsSitegrd.openModuleConfigModalDefault = function (module) {
    //     if (module == undefined || cmsSitegrd.gridOptions.selectedRow == undefined || cmsSitegrd.gridOptions.selectedRow.item == undefined) {

    //         return;
    //     }
    //     cmsSitegrd.Item.SiteStorage = {};
    //     cmsSitegrd.Item.AdminMain = {};
    //     cmsSitegrd.Item.SiteDefault = {};
    //     cmsSitegrd.Item.Site = {};
    //     cmsSitegrd.Item.SiteAccessDefault = {};
    //     cmsSitegrd.ModuleConfigSelected = module;
    //     cmsSitegrd.ModuleConfigSelectedSiteId = cmsSitegrd.gridOptions.selectedRow.item.Id;

    //     if ($rootScope.tokenInfo && $rootScope.tokenInfo.Item.UserAccessAdminAllowToProfessionalData) {
    //         cmsSitegrd.AdminMainLoad();
    //         cmsSitegrd.SiteDefaultLoad();
    //         cmsSitegrd.SiteAccessDefaultLoad();
    //     }
    //     $modal.open({
    //         templateUrl: 'cpanelv1/Module' + cmsSitegrd.ModuleConfigSelected.ClassName + '/Config/ModuleDefault.html',
    //         scope: $scope
    //     });
    // }
    //#formBuilder
    // cmsSitegrd.openPreviewModal = function (module, formName, configName, configType) {
    //     cmsSitegrd.configType = configType;
    //     cmsSitegrd.modalTitle = $('#' + configName).attr("title");
    //     cmsSitegrd.configName = configName;
    //     cmsSitegrd.formName = formName;
    //     // Get selected Layout to load form using JsonFormFormat in ViewModel
    //     var model = {
    //         Filters: []
    //     };
    //     model.Filters.push({
    //         PropertyName: "LinkModuleId",
    //         SearchType: 0,
    //         IntValue1: module.Id
    //     });
    //     model.Filters.push({
    //         PropertyName: "LinkSiteId",
    //         SearchType: 0,
    //         IntValue1: cmsSitegrd.gridOptions.selectedRow.item.Id
    //     });
    //     cmsSitegrd.busyIndicator.isActive = true;
    //     ajax.call(cmsServerConfig.configApiServerPath + 'CoreModuleSite/GetOne', model, 'POST').success(function (response) {
    //         cmsSitegrd.busyIndicator.isActive = false;
    //         cmsSitegrd.cmsModuleSite = response.Item;
    //         cmsSitegrd.formJson = $builder.forms['default'];
    //         $builder.removeAllFormObject('default');
    //         var component = $.parseJSON(module[formName]);

    //         // Clear privous values in formBuilder
    //         var values = [];
    //         if (cmsSitegrd.cmsModuleSite[configName] != null && cmsSitegrd.cmsModuleSite[configName] != "") {
    //             values = $.parseJSON(cmsSitegrd.cmsModuleSite[configName]);
    //         }

    //         if (component != null && component.length != undefined)
    //             $.each(component, function (i, item) {
    //                 try {
    //                     $builder.addFormObject('default', item);
    //                     //بارگذاری مقادیر براساس نام فیلد
    //                     if (values != null && values.length != undefined)
    //                         $.each(values, function (iValue, itemValue) {
    //                             if (item.fieldname == itemValue.fieldname) {
    //                                 $builder.forms.default[i].id = i;
    //                                 cmsSitegrd.defaultValue[i] = itemValue.value;
    //                             }
    //                         });
    //                 } catch (e) {}
    //             });
    //         $modal.open({
    //             templateUrl: 'cpanelv1/ModuleCore/CmsSite/preview.html',
    //             scope: $scope
    //         });
    //     }).error(function (data, errCode, c, d) {
    //         rashaErManage.checkAction(data, errCode);
    //     });
    // }

    // cmsSitegrd.saveSubmitValues = function () {
    //     cmsSitegrd.busyIndicator.isActive = true;
    //     cmsSitegrd.addRequested = true;
    //     cmsSitegrd.cmsModuleSite[cmsSitegrd.configName] = $.trim(angular.toJson(cmsSitegrd.submitValue));
    //     if (cmsSitegrd.configType == "ConfigSite") {
    //         ajax.call(cmsServerConfig.configApiServerPath + 'CoreModuleSite/EditConfigSite', cmsSitegrd.cmsModuleSite, 'POST').success(function (response) {
    //             rashaErManage.checkAction(response);
    //             if (response.IsSuccess) {
    //                 //cmsSitegrd.closeModal();
    //                 rashaErManage.showMessage("تغییرات ثبت گردید");
    //             }
    //             cmsSitegrd.busyIndicator.isActive = false;
    //             cmsSitegrd.addRequested = false;
    //         }).error(function (data, errCode, c, d) {
    //             rashaErManage.checkAction(data, errCode);
    //             cmsSitegrd.busyIndicator.isActive = false;
    //         });
    //     } else if (cmsSitegrd.configType == "ConfigSiteAccess") {
    //         ajax.call(cmsServerConfig.configApiServerPath + 'CoreModuleSite/edit', cmsSitegrd.cmsModuleSite, 'PUT').success(function (response) {
    //             rashaErManage.checkAction(response);
    //             if (response.IsSuccess) {
    //                 //cmsSitegrd.closeModal();
    //                 rashaErManage.showMessage("تغییرات ثبت گردید");
    //             }
    //             cmsSitegrd.busyIndicator.isActive = false;
    //             cmsSitegrd.addRequested = false;
    //         }).error(function (data, errCode, c, d) {
    //             rashaErManage.checkAction(data, errCode);
    //             cmsSitegrd.busyIndicator.isActive = false;
    //         });
    //     }
    // }
    //End of formBuilder

    //Export Report 
    cmsSitegrd.exportFile = function () {

        cmsSitegrd.addRequested = true;
        cmsSitegrd.gridOptions.advancedSearchData.engine.ExportFile = cmsSitegrd.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath + 'CoreSite/exportfile', cmsSitegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsSitegrd.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //cmsSitegrd.closeModal();
            }
            cmsSitegrd.addRequested = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    cmsSitegrd.toggleExportForm = function () {
        cmsSitegrd.SortType = [{
                key: 'نزولی',
                value: 0
            },
            {
                key: 'صعودی',
                value: 1
            },
            {
                key: 'تصادفی',
                value: 3
            }
        ];
        cmsSitegrd.EnumExportFileType = [{
                key: 'Excel',
                value: 1
            },
            {
                key: 'PDF',
                value: 2
            },
            {
                key: 'Text',
                value: 3
            }
        ];
        cmsSitegrd.EnumExportReceiveMethod = [{
                key: 'دانلود',
                value: 0
            },
            {
                key: 'ایمیل',
                value: 1
            },
            {
                key: 'فایل منیجر',
                value: 3
            }
        ];
        cmsSitegrd.ExportFileClass = {
            FileType: 1,
            RecieveMethod: 0,
            RowCount: 100
        };
        cmsSitegrd.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleCore/cmsSite/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    cmsSitegrd.rowCountChanged = function () {
        if (!angular.isDefined(cmsSitegrd.ExportFileClass.RowCount) || cmsSitegrd.ExportFileClass.RowCount > 5000)
            cmsSitegrd.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    cmsSitegrd.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath + "CoreSite/count", cmsSitegrd.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSitegrd.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            cmsSitegrd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    cmsSitegrd.loginToSite = function (selectedId) {
        cmsSitegrd.addRequested = true;
        cmsSitegrd.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath + "Auth/RenewToken/", {
            SiteId: selectedId,
            lang: $rootScope.tokenInfo.Language
        }, 'POST').success(function (response) {
           
            cmsSitegrd.addRequested = false;
            cmsSitegrd.busyIndicator.isActive = false;
            rashaErManage.showMessage("ورود به سایت موردنظر انجام شد!");
            $rootScope.tokenInfo = response;
            localStorage.setItem("userGlobaltoken", response.token);
            $state.reload();
            rashaErManage.checkAction(response);
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    cmsSitegrd.showChildren = function (selectedId) {
        $state.go("index.cmssite", {
            selectedId: selectedId
        });
    }
    cmsSitegrd.goToParent = function () {
        if (LinkCreatedBySiteId == $stateParams.selectedId)
            LinkCreatedBySiteId = 0;
        $state.go("index.cmssite", {
            selectedId: LinkCreatedBySiteId
        });
    }

    cmsSitegrd.getUser = function (userId) {
        ajax.call(cmsServerConfig.configApiServerPath + 'CoreUser/GetOne', userId, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsSitegrd.selectedUser = response.Item;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);