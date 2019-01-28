app.controller("buyModuleCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {
    var buyModule = this;

    buyModule.init = function () {
        buyModule.helloText = "Buy Module...";
    }

}]);