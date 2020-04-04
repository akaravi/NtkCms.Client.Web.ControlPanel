app.controller("apiPathSettingsCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$rootScope', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $rootScope, $state, $filter) {
    var apiSetting = this;
    apiSetting.selectedItem = {};
    apiSetting.sederList = [];
    apiSetting.init = function () {
        apiSetting.action = $rootScope.action;
        if (!$rootScope.selectedPath)
            apiSetting.goBack();
        apiSetting.selectedItem = $rootScope.selectedPath;

        ajax.call(cmsServerConfig.configApiServerPath+"ApiPathCompany/getall", "", 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            apiSetting.CompanyListItems = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });

        ajax.call(cmsServerConfig.configApiServerPath+"ApiPath/getall", "", 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            apiSetting.PathListItems = response.ListItems;
            for (i = 1; i < apiSetting.sederList.length; i++) {
                apiSetting.sederList[apiSetting.PathListItems.id] = false;
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    apiSetting.save = function () {
        if (apiSetting.action == "add") {
            apiSetting.addNewRow();
        } else {
            apiSetting.editRow();
        }



    };

    apiSetting.stateChanged = function (qId) {
        console.log(apiSetting.sederList.length);
    }

    apiSetting.addNewRow = function () {
        ajax.call(cmsServerConfig.configApiServerPath+'apipath/add', apiSetting.selectedItem, 'POST').success(function (response) {
            apiSetting.addRequested = false;
            rashaErManage.checkAction(response);
            apiSetting.goBack();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            apiSetting.addRequested = false;
        });
    };

    apiSetting.editRow = function () {
        apiSetting.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'apipath/edit', apiSetting.selectedItem, 'PUT').success(function (response) {
            apiSetting.addRequested = false;
            rashaErManage.checkAction(response);
            apiSetting.goBack();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            apiSetting.addRequested = false;
        });
    };

    apiSetting.goBack = function () {
        $state.go("index.cmsapipath");
    };
    apiSetting.saveSeders = function () {
        for (var i = 0; i < apiSetting.sederList.length; i++) {
            //apiSetting.sederList[i]
        }
    };

}]);