app.controller("registerUserCtrl", ["$scope", "ajax", "rashaErManage", "$state", "$element", "$rootScope", "notify", function ($scope, ajax, rashaErManage, $state, $element, $rootScope, notify) {

    var register = this;
    var template = 'cpanelv1/ModuleCore/common/notify.html';
    register.selectedItem = {};

    register.sendSmsActivationCodeBusyIndicator = {
        isActive: false,
        message : "در حال ارسال کد فعالسازی"
    }

    register.verifyActivationCodeBusyIndicator = {
        isActive: false,
        message: 'در حال تایید کد فعالسازی'
    }

    register.setPasswordBusyIndicator = {
        isActive: false,
        message: 'اعمال رمز عبور جدید'
    }

    register.updateProfileBusyIndicator = {
        isActive: false,
        message: 'در حال بارگیری اطلاعات'
    }

    register.addRequested = true;

    register.init = function () {
        ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/getAntiForgeryToken', {}, 'POST').success(function (res) {
            register.sendSmsActivationCodeBusyIndicator.isActive = false;
            if (res) {
                console.log(res);
                register.selectedItem.registerantiForgeryToken = res;
            }
        }).error(function (data2, errCode2, c2, d2) {
            register.sendSmsActivationCodeBusyIndicator.isActive = false;
        });
        
    }

    register.processForm = function (param) {

    }

    register.gotoStepTwo = function (param) {
        if (param.$invalid)
            return;
        if (param.$valid) {
            if (register.selectedItem.Username.substring(0, 2) == "09") {
                register.sendSmsActivationCodeBusyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath+"CoreUser/GetActivationCode", { userName: register.selectedItem.Username }, "post").success(function (response) {
                    register.sendSmsActivationCodeBusyIndicator.isActive = false;
                    if (response.IsSuccess == true) {
                        notify({ message: 'کد فعالسازی برای شما ارسال شد', classes: 'alert-success', templateUrl: template });
                        register.sendSmsActivationCodeBusyIndicator.isActive = true;
                        ajax.call(cmsServerConfig.configApiServerPath+'CoreUser/GetOne',  0 , 'POST').success(function (res) {
                            register.sendSmsActivationCodeBusyIndicator.isActive = false;
                            if (res.IsSuccess) {
                                var userName = register.selectedItem.Username;
                                register.selectedItem = res.Item;
                                register.selectedItem.antiForgeryToken = register.registerantiForgeryToken;
                                register.selectedItem.Username = userName;
                                $state.go("user_wizard.step_two");
                            }
                        }).error(function (y) {
                            register.sendSmsActivationCodeBusyIndicator.isActive = false;
                        });
                    } else {
                        notify({ message: response.ErrorMessage, classes: 'alert-danger', templateUrl: template });
                    }
                    //$timeout(function(){},)
                }).error(function (a, b, c, d) {
                    register.sendSmsActivationCodeBusyIndicator.isActive = false;
                });
            } else {
                notify({ message: 'تلفن همراه معتبر وارد کنید', classes: 'alert-danger', templateUrl: template });
            }
        }

        
    }

    register.gotoStepThree = function (param) {
        if (param.$valid) {
            var ds = register.selectedItem;
            register.verifyActivationCodeBusyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+"CoreUser/VerifyActivationCode", { username: register.selectedItem.Username, activecode: register.selectedItem.ActiveCode }, "POST").success(function (response) {
                register.verifyActivationCodeBusyIndicator.isActive = false;
                if (response.IsSuccess == true) {
                    $state.go("user_wizard.step_three");

                } else {
                    notify({ message: response.ErrorMessage, classes: 'alert-danger', templateUrl: template });

                }
                //$timeout(function(){},)
            }).error(function (a, b, c, d) {
                register.verifyActivationCodeBusyIndicator.isActive = false;
            });
        } else {
            notify({ message: 'کد فعالسازی را وارد کنید', classes: 'alert-danger', templateUrl: template });
        }
    }

    register.gotoStepFour = function (param) {
        if (param.$valid) {
            var ds = register.selectedItem;
            register.setPasswordBusyIndicator.isActive = true;
            ajax.call(cmsServerConfig.configApiServerPath+"CoreUser/add", ds , "POST").success(function (response) {
                register.setPasswordBusyIndicator.isActive = false;
                if (response.IsSuccess == true) {
                    register.selectedItem.Id = response.Item.Id;
                    notify({ message: 'حساب کاربری شما با موفقیت ثبت شد', classes: 'alert-success', templateUrl: template });
                    $state.go("user_wizard.step_four");
                    
                } else {
                    notify({ message: response.ErrorMessage, classes: 'alert-danger', templateUrl: template });
                }
                //$timeout(function(){},)
            }).error(function (a, b, c, d) {
                register.setPasswordBusyIndicator.isActive = false;
            });
        } else {
            notify({ message: 'اطلاعات وارد شده صحیح نمی باشد', classes: 'alert-danger', templateUrl: template });
        }
    }

    register.updateProfile = function (param) {
        if (param.$valid) {
            var ds = register.selectedItem;
            ajax.call(cmsServerConfig.configApiServerPath+"CoreUser/edit",  ds , "PUT").success(function (response) {
                register.updateProfileBusyIndicator.isActive = false;
                if (response.IsSuccess == true) {                    
                    notify({ message: 'حساب کاربری شما با موفقیت ویرایش شد شد', classes: 'alert-success', templateUrl: template });                    
                    $state.go("login");
                } else {
                    notify({ message: response.ErrorMessage, classes: 'alert-danger', templateUrl: template });
                }                
            }).error(function (a, b, c, d) {
                register.updateProfileBusyIndicator.isActive = false;
            });
        } else {
            notify({ message: 'اطلاعات وارد شده صحیح نمی باشد', classes: 'alert-danger', templateUrl: template });
        }
    }

}]);