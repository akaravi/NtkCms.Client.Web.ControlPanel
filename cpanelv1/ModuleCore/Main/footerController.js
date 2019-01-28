app.controller("footerCtrl", ["$scope", function ($scope) {

    var footer = this;

    footer.addNewItemNotRequested = true;

    var item = localStorage.getItem('AddRequest');
    if (!(item == undefined || item == null || item == '')) {
        var request = JSON.parse(item);
        if (!(request == undefined || request == null)) {
            var t = new Date();
            if (request.expireDate < t.getSeconds()) {
                localStorage.removeItem('AddRequest');
            }
            else
                footer.addNewItemNotRequested = false;
        }
    }

    $scope.footerText = "Negin Tejrata Karavi";
}]);