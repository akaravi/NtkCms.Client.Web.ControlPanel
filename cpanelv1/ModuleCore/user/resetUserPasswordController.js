app.controller("resetUserPasswordController", ["$scope", "$http", "$state",   function ($scope, $http, $state) {

    var resetPassCtrl = this;
    resetPassCtrl.isBusy = false;

    resetPassCtrl.getCode = function() {

    }
    resetPassCtrl.goToNewSiteWizard = function () { $state.go("newSiteWizard"); }
    resetPassCtrl.verifyCode = function() {}
}]);