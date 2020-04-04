app.controller("verifyingCodeController", ["$scope", "$http", "ajax", 'rashaErManage', '$state', '$filter', function ($scope, $http, ajax, rashaErManage, $state, $filter) {

    var verifyCodeCtrl = this;
    verifyCodeCtrl.isBusy = false;
    verifyCodeCtrl.code = "";
    verifyCodeCtrl.userName = "";
    

    verifyCodeCtrl.getCode = function () {
        verifyCodeCtrl.isBusy = true;
        ajax.call(cmsServerConfig.configApiServerPath+"CoreUser/getActivationCode", { 'userName':verifyCodeCtrl.userName,'code': verifyCodeCtrl.code }, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            verifyCodeCtrl.isBusy = false;
            if (response.IsSuccess && response.Item) {
                
                $state.go('verifyCode', {});
            }

        }).error(function (data, errCode, c, d) {
            verifyCodeCtrl.isBusy = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    verifyCodeCtrl.goToResetUserPassword = function () {
        $state.go('resetUserPassword', {});
    }


    
}]);