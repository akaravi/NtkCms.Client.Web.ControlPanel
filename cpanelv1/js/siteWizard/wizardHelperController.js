app.controller("wizardHelperController", ["$scope", "$http","$state","ajax", "rashaErManage","wizardService", function ($scope,$http,$state,ajax, rashaErManage,wizardService) {
    var wizHelperController = this;
   
    //wizHelperController.login = function() {
    //    userLoginServc.login(wizHelperController.usernameData, wizHelperController.passwordData);
    //}
   
    wizHelperController.usernameData = 'karavi';
    wizHelperController.passwordData = 'karavi';
    wizHelperController.loginRequest = false;
    wizHelperController.login = function () {
        wizHelperController.loginRequest = true;
        ajax.call(cmsServerConfig.configApiServerPath+"CoreUser/userlogin", { 'username': wizHelperController.usernameData, 'pwd': wizHelperController.passwordData }, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            wizHelperController.loginRequest = false;
            if (response.IsSuccess && response.Item) {
                localStorage.setItem('userGlobaltoken', response.token);
                wizardService.callNextPage = true;
            }

        }).error(function (data, errCode, c, d) {
            wizHelperController.loginRequest = false;
            rashaErManage.checkAction(data, errCode);
        });
    }
   
    wizHelperController.init = function () {
        wizHelperController.step1Activated = true;
        wizHelperController.step2Activated = false;
        wizHelperController.step3Activated = false;
        wizHelperController.step4Activated = false;
        wizHelperController.step5Activated = false;

    }
   
}]);
