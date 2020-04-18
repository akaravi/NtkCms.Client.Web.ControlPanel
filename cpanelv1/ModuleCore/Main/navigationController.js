app.controller("navigationCtrl", ["$scope", "ajax", "rashaErManage", "$state", "$element", "$translate", "$rootScope", "$filter", function ($scope, ajax, rashaErManage, $state, $element, $translate, $rootScope, $filter) {
    var navCtrl = this;

    navCtrl.addNewItemNotRequested = true;

    var item = localStorage.getItem('AddRequest');
    if (!(item == undefined || item == null || item == '')) {
        var request = JSON.parse(item);
        if (!(request == undefined || request == null)) {
            var t = new Date();
            if (request.expireDate < t.getSeconds()) {
                localStorage.removeItem('AddRequest');
            }
            else
                navCtrl.addNewItemNotRequested = false;
        }
    }


    navCtrl.root = $rootScope
    navCtrl.$state = $state;
    navCtrl.navigationText = "تنظیمات کاربری";
    navCtrl.showSiteSelector = true;

    //Set page language
    var savedLang = localStorage.getItem("userLanguage");
    if (!savedLang) {
        localStorage.setItem("userLanguage", navCtrl.language);
        $translate.use(navCtrl.language);
    } else {
        navCtrl.language = savedLang;
        $translate.use(savedLang);
    }
    if ($rootScope.tokenInfo)
        $rootScope.tokenInfo.UserLanguage = navCtrl.language;
    //End of set language

    navCtrl.root.MenuDetailListUpItems = [];
    navCtrl.root.MenuDetailListDownItems = [];


    navCtrl.engine = {};
    navCtrl.engine.CurrentPageNumber = 1;
    navCtrl.engine.SortColumn = "Id";
    navCtrl.engine.SortType = 1;
    navCtrl.engine.NeedToRunFakePagination = false;
    navCtrl.engine.TotalRowData = 2000;
    navCtrl.engine.RowPerPage = 200;
    navCtrl.engine.ContentFullSearch = null;
    navCtrl.engine.Filters = [];

    navCtrl.menuConfig = {
        ListItems: []
    }

    navCtrl.logOut = function () {
        ajax.logOut();
    }
    navCtrl.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+'CoreSite/getAllwithalias', navCtrl.engine, 'POST').success(function (response1) {
            rashaErManage.checkAction(response1);
            navCtrl.ownerSite = response1.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
        //MenuRight
        ajax.call(cmsServerConfig.configApiServerPath+'CoreCpMainMenu/GetAllMenu', navCtrl.engine, 'POST').success(function (response) {
            if (response.ListItems.length === 0) return; //fix bug in menu
            rashaErManage.checkAction(response);

            $scope.MenuUpListItems = [];
            $scope.MenuDownListItems = [];
            $scope.MenuRightListItems = [];
            $scope.MenuLeftListItems = [];
            for (var i = 0; i < response.ListItems.length; i++) {
                //navCtrl.ListItems = response.ListItems;
                if (response.ListItems[i].MenuPlaceType == 0 || response.ListItems[i].MenuPlaceType == 1)
                    $scope.MenuUpListItems.push(response.ListItems[i]);
                if (response.ListItems[i].MenuPlaceType == 0 || response.ListItems[i].MenuPlaceType == 2)
                    $scope.MenuDownListItems.push(response.ListItems[i]);
                if (response.ListItems[i].MenuPlaceType == 0 || response.ListItems[i].MenuPlaceType == 3) {
                    $scope.MenuRightListItems.push(response.ListItems[i]);
                }
                if (response.ListItems[i].MenuPlaceType == 0 || response.ListItems[i].MenuPlaceType == 4)
                    $scope.MenuLeftListItems.push(response.ListItems[i]);
            }

            $scope.rashaMenuRun = '@' + Date();
        })
            .error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });

    };


    navCtrl.gotoState = function (button) {
        for (var i = 0; i < navCtrl.root.MenuDetailListUpItems.length; i++) {
            navCtrl.root.MenuDetailListUpItems[i].isActivatedClass = 'btn-default';
        }
        button.isActivatedClass = 'btn-success';
        $state.go("index." + button.AddressLink);
        button.isActivatedClass = 'btn-success';
    }
    navCtrl.OnHeaderMenuClick = function (menuId) {
        navCtrl.root.headerBtngroupClass = '';
        navCtrl.root.footerBtngroupClass = '';
        navCtrl.root.MenuDetailListUpItems = [];
        navCtrl.root.MenuDetailListDownItems = [];
        for (var i = 0; i < $scope.MenuRightListItems.length; i++)
            if ($scope.MenuRightListItems[i].Id == menuId) {
                for (var j = 0; j < $scope.MenuRightListItems[i].Children.length; j++) {
                    if ($scope.MenuRightListItems[i].Children[j] != null && $scope.MenuRightListItems[i].Children[j].MenuPlaceType == 1)
                        navCtrl.root.MenuDetailListUpItems.push($scope.MenuRightListItems[i].Children[j]);
                    if ($scope.MenuRightListItems[i].Children[j] != null && $scope.MenuRightListItems[i].Children[j].MenuPlaceType == 2)
                        navCtrl.root.MenuDetailListDownItems.push($scope.MenuRightListItems[i].Children[j]);
                }
                break;
            }

        for (var i = 0; i < navCtrl.root.MenuDetailListUpItems.length; i++) {
            navCtrl.root.MenuDetailListUpItems[i].isActivatedClass = 'btn-default';
        }





        if (navCtrl.root.MenuDetailListUpItems.length > 1)
            navCtrl.root.headerBtngroupClass = 'btn-group';

        for (var i = 0; i < navCtrl.root.MenuDetailListDownItems.length; i++) {
            navCtrl.root.MenuDetailListDownItems[i].isActivatedClass = 'btn-default';
            if (curState.name == "index." + navCtrl.root.MenuDetailListDownItems[i].AddressLink)
                navCtrl.root.MenuDetailListDownItems[i].isActivatedClass = 'btn-success';
        }


        if (navCtrl.root.MenuDetailListDownItems.length > 1)
            navCtrl.root.footerBtngroupClass = 'btn-group';

    }

    navCtrl.showDetail = function (ele) {
        $(ele.currentTarget).parent().next().slideToggle();
    };

    navCtrl.newSite = function () {
        navCtrl.showSiteSelector = false;
        $state.go("index.cmssite");
    };

    navCtrl.selectCurrentSite = function (item) {
        //console.log(item);
        var currentSite = item.Id;
        if (currentSite == undefined || currentSite == 'undefined')
            currentSite = $rootScope.tokenInfo.Item.SiteId;
        //rashaErManage.showMessage("دستور تغییر دسترسی به سرور ارسال گردید...");
        ajax.call(cmsServerConfig.configApiServerPath+"Auth/RenewToken/", { SiteId: currentSite }, "POST").success(function (response) {
            localStorage.setItem("userGlobaltoken", response.token);
            //rashaErManage.showMessage("دسترسی جدید اعمال گردید");
            $rootScope.tokenInfo = response;


            $rootScope.infoDomainAddress = "http://" + $rootScope.tokenInfo.Item.Domain + "/";
            if ($rootScope.tokenInfo.Item.SubDomain && $rootScope.tokenInfo.Item.SubDomain.length > 0)
                $rootScope.infoDomainAddress = "http://" + $rootScope.tokenInfo.Item.SubDomain + "." + $rootScope.tokenInfo.Item.Domain + "/";

            navCtrl.showSiteSelector = false;
            $state.go("index.main", {});
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);