

app.controller('wizardCtrl', ["$scope", "$http", "$state", "ajax", "rashaErManage",  function ($scope, $http, $state, ajax, rashaErManage) {

    var wizCtrl = this;

    wizCtrl.usernameData = 'karavi';
    wizCtrl.passwordData = 'karavi';

    wizCtrl.init = function () {
        $('[data-toggle="tooltip"]').tooltip();
    }

        wizCtrl.show = function(key, state) {
        console.log(key);
        console.log(state);
    };
    wizCtrl.save = function() {
        console.log('Got Save');
    };
    wizCtrl.cancel = function() {
        console.log('Got Cancel');
    };
   

    wizCtrl.goToNewAccount = function () {
        //انتقال به صفحه ایجاد حساب کاربری
        $state.go("registerAccount");
    }
    wizCtrl.goToResetUserPassword = function () {
        //انتقال به صفحه بازنشانی رمز عبور
        $state.go("resetPassword");

    }
        wizCtrl.login = function() {
            wizCtrl.isBusy = true;
            ajax.call(cmsServerConfig.configApiServerPath+"CoreUser/userlogin", { 'username': wizCtrl.usernameData, 'pwd': wizCtrl.passwordData }, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                wizCtrl.isBusy = false;
                if (response.IsSuccess && response.Item) {
                    localStorage.setItem('userGlobaltoken', response.token);
                    //به بخش ایجاد سایت جدید می رود
                    $state.go("newsite");
                }

            }).error(function (data, errCode, c, d) {
                wizCtrl.isBusy = false;
                rashaErManage.checkAction(data, errCode);
            });
        };

    }
]);
