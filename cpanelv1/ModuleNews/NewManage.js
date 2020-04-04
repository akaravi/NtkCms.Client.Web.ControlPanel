app.controller("newsManageStateCtrl", ["$scope", "$http", "ajax", function ($scope, $http, ajax) {
    
    
    var newsManageCtrl=this ;
    newsManageCtrl.treeConfig = {
        displayMember: 'Name',
        displayId: 'Id',
        displayChild: 'Children'
    };
    newsManageCtrl.treeConfig.currentNode = {};
    newsManageCtrl.treeBusyIndicator = false;
    newsManageCtrl.init = function () {
        alert("ok");
        newsManageCtrl.treeBusyIndicator = true;
        console.log("ok");
       
        ajax.call(cmsServerConfig.configApiServerPath+"NewsCategory/getall", {}, 'POST').success(function (response) {
            newsManageCtrl.treeConfig.Items = response.ListItems;
            console.log(response.ListItems);
            newsManageCtrl.treeBusyIndicator = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
            console.log(errCode);
            console.log(c);
            console.log(d);

        });

        //console.log(brwseCtrl);
    }
    newsManageCtrl.isCurrentNodeEmpty = function () {
        return !angular.equals({}, newsManageCtrl.treeConfig.currentNode);
    }

    newsManageCtrl.loadFileAndFolder = function (item) {
        newsManageCtrl.treeConfig.currentNode = item;
        console.log(item);
        newsManageCtrl.treeConfig.onNodeSelect(item);
    }

    newsManageCtrl.openNewFolder = function() {
        alert("ok");
    }

    
}]);