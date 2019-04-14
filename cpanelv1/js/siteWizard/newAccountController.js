app.controller("newAccountController", ["$scope", "$http", "$state", function ($scope, $http, $state) {
    var newAccountCtrl = this;
    newAccountCtrl.goToNewSite = function () {
        // به صفحه ویزارد ایجاد سایت می رود
        $state.go("newSiteWizard");
    }

}]);