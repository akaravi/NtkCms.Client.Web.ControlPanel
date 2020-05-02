app.controller("topNavBarCtrl",
    [
        "$scope", "$state", "ajax", "rashaErManage", "$translate", '$modal', "$rootScope", "$modalStack", "$filter",
        function ($scope, $state, ajax, rashaErManage, $translate, $modal, $rootScope, $modalStack, $filter) {

            var topNavBar = this;
            topNavBar.selectedItem = {};
            //topNavBar.selectedItem.UserAccessAdminAllowToAllData = false;
            topNavBar.busyIndicator = {
                isActive: false,
                message: "در حال بار گذاری ..."
            }

            topNavBar.addNewItemNotRequested = true;

            var item = localStorage.getItem('AddRequest');
            if (!(item == undefined || item == null || item == '')) {
                var request = JSON.parse(item);
                if (!(request == undefined || request == null)) {
                    var t = new Date();
                    if (request.expireDate < t.getSeconds()) {
                        localStorage.removeItem('AddRequest');
                    } else
                        topNavBar.addNewItemNotRequested = false;
                }
            }


            topNavBar.logOut = function () {
                ajax.logOut();
            };

            topNavBar.init = function () {
                //Set page language
                var savedLang = localStorage.getItem("userLanguage");
                if (!savedLang) {
                    localStorage.setItem("userLanguage", topNavBar.language);
                    $translate.use(topNavBar.language);
                } else {
                    topNavBar.language = savedLang;
                    $translate.use(savedLang);
                }
                if ($rootScope.tokenInfo)
                    $rootScope.tokenInfo.UserLanguage = topNavBar.language;
                //End of set language
                if ($rootScope.tokenInfo == undefined || $rootScope.tokenInfo == null || $rootScope.tokenInfo.token == undefined) {
                    //#help# فقط توکن داریم و از سرور درخواست دریاف اطلاعات می کنیم
                    topNavBar.busyIndicator.isActive = true;
                    ajax.call(cmsServerConfig.configApiServerPath + "Auth/RenewToken/", {}, "POST").success(function (response) {
                        rashaErManage.checkAction(response);
                        $rootScope.tokenInfo = response;


                        $rootScope.infoDomainAddress = "http://" + $rootScope.tokenInfo.Item.Domain + "/";
                        if ($rootScope.tokenInfo.Item.SubDomain && $rootScope.tokenInfo.Item.SubDomain.length > 0)
                            $rootScope.infoDomainAddress = "http://" + $rootScope.tokenInfo.Item.SubDomain + "." + $rootScope.tokenInfo.Item.Domain + "/";


                        localStorage.setItem("userGlobaltoken", response.token);
                        topNavBar.setDiskSpaceInfo();
                        //SET
                        topNavBar.busyIndicator.isActive = false;
                    }).error(function (data, errCode, c, d) {
                        topNavBar.busyIndicator.isActive = false;
                        rashaErManage.checkAction(data, errCode, c, d);
                    });
                }

                topNavBar.inputSiteChanged(null);

            }

            topNavBar.gridOptions = {};
            topNavBar.gridOptions.advancedSearchData = {};
            topNavBar.gridOptions.advancedSearchData.engine = {};
            topNavBar.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
            topNavBar.gridOptions.advancedSearchData.engine.Filters = [];
            topNavBar.LoginByIdShow = {};
            topNavBar.LoginByIdShow.NewUserid = 0;
            topNavBar.LoginByIdShow.NewSiteid = 0;
            topNavBar.appLoginByIdShow = function () {
                $modal.open({
                    templateUrl: 'cpanelv1/ModuleCore/Main/topnavbarLoginById.html',
                    scope: $scope
                });
            }
            topNavBar.appLoginById = function (NewSiteid, NewUserid) {
                topNavBar.closeModal();
                if ((NewSiteid != undefined && NewSiteid > 0) || (NewUserid != undefined && NewUserid > 0)) {
                    if ($rootScope.tokenInfo == undefined || $rootScope.tokenInfo == null || $rootScope.tokenInfo.token == undefined) {
                        rashaErManage.showMessage("حساب کاربری شما این دسترسی را ندارد");
                        return;
                    };
                    rashaErManage.showMessage("درخواست برای سرور ارسال شد.");
                    topNavBar.busyIndicator.isActive = true;
                    ajax.call(cmsServerConfig.configApiServerPath + "Auth/RenewToken/", {
                            Userid: NewUserid,
                            SiteId: NewSiteid,
                            UserAccessAdminAllowToAllData: $rootScope.tokenInfo.Item.UserAccessAdminAllowToProfessionalData,
                            UserAccessAdminAllowToProfessionalData: $rootScope.tokenInfo.Item.UserAccessAdminAllowToAllData,
                            lang: $rootScope.tokenInfo.UserLanguage
                        },
                        "POST").success(function (response) {
                        rashaErManage.checkAction(response);
                        $rootScope.tokenInfo = response;


                        $rootScope.infoDomainAddress = "http://" + $rootScope.tokenInfo.Item.Domain + "/";
                        if ($rootScope.tokenInfo.Item.SubDomain && $rootScope.tokenInfo.Item.SubDomain.length > 0)
                            $rootScope.infoDomainAddress = "http://" + $rootScope.tokenInfo.Item.SubDomain + "." + $rootScope.tokenInfo.Item.Domain + "/";


                        localStorage.setItem("userGlobaltoken", response.token);
                        rashaErManage.showMessage("دسترسی جدید اعمال شد");
                        $state.reload();
                        topNavBar.busyIndicator.isActive = false;
                    }).error(function (data, errCode, c, d) {
                        topNavBar.busyIndicator.isActive = false;
                        rashaErManage.showMessage("برروز خطا در اعمال دسترسی");
                        rashaErManage.checkAction(data, errCode);
                    });

                } else {
                    topNavBar.busyIndicator.isActive = false;
                    rashaErManage.showMessage(" کد سیتمی کاربر یا کد سیستمی سایت را به صورت عددی وارد کنید");
                    return;
                }
            }
            topNavBar.closeModal = function () {
                $modalStack.dismissAll();
            };
            topNavBar.appFilter = function (data) {
                var Silent = false;

                var SelectedCurrentSiteId = 0;
                var oderShowAllDataStatus = false;
                var oderShowProfessionalDataStatus = false;
                if ($rootScope.tokenInfo != undefined || $rootScope.tokenInfo == null || $rootScope.tokenInfo.token == undefined) {
                    SelectedCurrentSiteId = $rootScope.tokenInfo.Item.SiteId;
                    oderShowAllDataStatus = $rootScope.tokenInfo.Item.UserAccessAdminAllowToAllData;
                    oderShowProfessionalDataStatus = $rootScope.tokenInfo.Item.UserAccessAdminAllowToProfessionalData;
                }
                //#help# تغییر سایت انتخاب شده
                if (topNavBar.selectedItem.LinkCmsSiteId != undefined &&
                    topNavBar.selectedItem.LinkCmsSiteId != 'undefined')
                    SelectedCurrentSiteId = topNavBar.selectedItem.LinkCmsSiteId;

                //#help# تغییر نوع دسترسی        
                if (data == 'UserAccessAdminAllowToAllData')
                    oderShowAllDataStatus = !oderShowAllDataStatus;
                if (data == 'UserAccessAdminAllowToProfessionalData')
                    oderShowProfessionalDataStatus = !oderShowProfessionalDataStatus;
                if (data == 'userLanguage')
                    Silent = true;
                if (!Silent)
                    rashaErManage.showMessage("دستور تغییر دسترسی به سرور ارسال گردید..");
                topNavBar.busyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath + "Auth/RenewToken/", {
                        SiteId: SelectedCurrentSiteId,
                        UserAccessAdminAllowToAllData: oderShowAllDataStatus,
                        UserAccessAdminAllowToProfessionalData: oderShowProfessionalDataStatus,
                        lang: $rootScope.tokenInfo.UserLanguage
                    },
                    "POST").success(function (response) {
                    rashaErManage.checkAction(response);
                    $rootScope.tokenInfo = response;

                    $rootScope.infoDomainAddress = "http://" + $rootScope.tokenInfo.Item.Domain + "/";
                    if ($rootScope.tokenInfo.Item.SubDomain && $rootScope.tokenInfo.Item.SubDomain.length > 0)
                        $rootScope.infoDomainAddress = "http://" + $rootScope.tokenInfo.Item.SubDomain + "." + $rootScope.tokenInfo.Item.Domain + "/";



                    if (data != 'UserAccessAdminAllowToAllData' && data != 'UserAccessAdminAllowToProfessionalData')
                        topNavBar.selectedItem.LinkCmsSiteId = SelectedCurrentSiteId;
                    localStorage.setItem("userGlobaltoken", response.token);
                    if (!Silent)
                        rashaErManage.showMessage("دسترسی جدید اعمال گردید");
                    if (!Silent)
                        $state.reload();
                    topNavBar.busyIndicator.isActive = false;
                }).error(function (data, errCode, c, d) {
                    topNavBar.busyIndicator.isActive = false;
                    rashaErManage.showMessage("دسترسی نمایش کلیه اطلاعات تغییر نکرد");
                    rashaErManage.checkAction(data, errCode);
                });
            }


            topNavBar.engine = {};
            topNavBar.changeLanguage = function (lang) {
                //Translate
                localStorage.setItem("userLanguage", lang);
                $rootScope.tokenInfo.UserLanguage = lang;
                $translate.use(lang);

                topNavBar.appFilter("userLanguage");
                $state.reload();
            }
            //ngautocomplete
            topNavBar.siteSelected = function (selected) {
                if (selected) {
                    topNavBar.selectedItem.LinkCmsSiteId = selected.originalObject.Id;
                } else {
                    topNavBar.selectedItem.LinkCmsSiteId = null;
                }
            }
            //ngautocomplete
            topNavBar.inputSiteChanged = function (input) {
                ajax.call(cmsServerConfig.configApiServerPath + "CoreSite/searchnew", {
                    key: input
                }, 'POST').success(function (response) {
                    rashaErManage.checkAction(response);
                    topNavBar.cmsSitesListItems = response.ListItems;
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            topNavBar.inputSiteChangedOld = function (input) {
                var engine = {
                    Filters: []
                };
                if (input == null)
                    var x = 0 //Do nothing
                else if (input.substring(0, 2) == "**")
                    var x = 0 //Do nothing
                else if (isNaN(input)) {
                    engine.Filters.push({
                        PropertyName: "Title",
                        SearchType: 5,
                        StringValue1: input,
                        ClauseType: 1
                    });
                    engine.Filters.push({
                        PropertyName: "SubDomain",
                        SearchType: 5,
                        StringValue1: input,
                        ClauseType: 1
                    });
                } else {
                    engine.Filters.push({
                        PropertyName: "Id",
                        SearchType: 10,
                        IntValue1: parseInt(input),
                        ClauseType: 1
                    });
                }
                ajax.call(cmsServerConfig.configApiServerPath + "CoreSite/search", engine, 'POST').success(function (response) {
                    rashaErManage.checkAction(response);
                    topNavBar.cmsSitesListItems = response.ListItems;
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }

            topNavBar.setDiskSpaceInfo = function () {
                ajax.call(cmsServerConfig.configApiServerPath + "FileConfiguration/SiteAccess/"+$rootScope.tokenInfo.Item.SiteId, "", "GET").success(function (responseSiteAccess) {
                    rashaErManage.checkAction(responseSiteAccess);
                    ajax.call(cmsServerConfig.configApiServerPath + "FileConfiguration/SiteStorage/"+$rootScope.tokenInfo.Item.SiteId, "", "GET").success(function (responseSiteStorage) {
                        try {
                            rashaErManage.checkAction(responseSiteStorage);
                            $rootScope.totalSite = responseSiteAccess.Item.AllCateSizeUploadMB;
                            $rootScope.usedSpace = Math.floor(responseSiteStorage.Item.SumSizeUploadMB);
                            $rootScope.freeSpace = Math.floor($rootScope.totalSpace - $rootScope.usedSpace);
                        } catch (e) {
                            console.log(e);
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });

                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
            var util = {};

            document.addEventListener('keydown', function (e) {

                var key = util.key[e.which];
                if (key && key === 'F1') {
                    e.preventDefault();
                    topNavBar.guideShow();
                }

                //if( key === 'F1' ){        
                //  topNavBar.guideShow();
                //}
            })

            util.key = {
                9: "tab",
                13: "enter",
                16: "shift",
                18: "alt",
                27: "esc",
                33: "rePag",
                34: "avPag",
                35: "end",
                36: "home",
                37: "left",
                38: "up",
                39: "right",
                40: "down",
                112: "F1",
                113: "F2",
                114: "F3",
                115: "F4",
                116: "F5",
                117: "F6",
                118: "F7",
                119: "F8",
                120: "F9",
                121: "F10",
                122: "F11",
                123: "F12"
            }
            topNavBar.guideShow = function (area) {
                var engine = {
                    Filters: []
                };
                var guideList = [];
                var selectArea = $('*[data-guide]');
                angular.forEach(angular.element(selectArea), function (item, key) {
                    if (!item.classList.contains('ng-hide')) {
                        var retId = item.attributes['data-guide'].value;
                        //console.log(retId);
                        guideList.push(retId);
                        if (Number.isInteger(parseInt(retId)))
                            engine.Filters.push({
                                PropertyName: "Id",
                                SearchType: 0,
                                IntValue1: parseInt(retId),
                                ClauseType: 1
                            });
                    }
                });
                //$('*[data-guide]').each(function () {
                //    var retId = $(this).data('guide');
                //    if (Number.isInteger(retId))
                //        engine.Filters.push({ PropertyName: "Id", SearchType: 0, IntValue1: parseInt(retId), ClauseType: 1 });
                //});

                if (engine.Filters.length > 0) {
                    //#help# یافت شد
                    topNavBar.busyIndicator.isActive = true;
                    ajax.call(cmsServerConfig.configApiServerPath + "CoreGuide/getall", engine, 'POST').success(function (response) {
                        rashaErManage.checkAction(response);
                        var introSteps = [];
                        if (response.IsSuccess) {
                            $.each(response.ListItems, function (i, item) {
                                introSteps.push({
                                    element: document.querySelectorAll('*[data-guide="' + item.Id + '"]')[0],
                                    intro: "<h3>" + item.Title + "</h3><br/>" + item.BodyFa
                                });
                                var index = guideList.indexOf("" + item.Id);
                                if (index > -1) {
                                    guideList.splice(index, 1);
                                }
                            });
                        }
                        $.each(guideList, function (i, item) {
                            introSteps.push({
                                element: document.querySelectorAll('*[data-guide="' + item + '"]')[0],
                                intro: "<h3>" + "Not Find" + "</h3><br/>" + "(" + item + ")"
                            });
                        });
                        topNavBar.busyIndicator.isActive = false;
                        var intro = introJs();
                        intro.setOptions({
                            'skipLabel': 'بازگشت',
                            'nextLabel': 'بعدی',
                            'prevLabel': 'قبلی'
                        });
                        intro.setOption('tooltipPosition', 'auto');
                        intro.setOption('positionPrecedence', ['left', 'right', 'bottom', 'top']);
                        intro.setOptions({
                            steps: introSteps
                        });
                        intro.start();
                    }).error(function (data, errCode, c, d) {
                        topNavBar.busyIndicator.isActive = false;
                        rashaErManage.checkAction(data, errCode);
                    });
                    //#help# یافت شد
                } else {
                    rashaErManage.showMessage("راهنمایی برای این بخش در نظر گرفته نشده است");
                }

            }

        }
    ]);