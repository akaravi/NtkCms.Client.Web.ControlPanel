app.controller("newSiteController", ["$scope", "$http", "$state", "ajax", "rashaErManage", function ($scope, $http, $state, ajax, rashaErManage) {
    var newSiteCtrl = this;
    newSiteCtrl.goToNewSite = function () {
        // به صفحه ویزارد ایجاد سایت می رود
        $state.go("newSiteWizard");
    }

}]);