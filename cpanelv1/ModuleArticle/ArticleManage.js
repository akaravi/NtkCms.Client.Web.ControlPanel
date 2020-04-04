article.controller("articleManageStateCtrl", ["$scope", "$http", "ajax", function ($scope, $http, ajax) {
    
    
    var articleManageCtrl=this ;
    articleManageCtrl.treeConfig = {
        displayMember: 'Name',
        displayId: 'Id',
        displayChild: 'Children'
    };
    articleManageCtrl.treeConfig.currentNode = {};
    articleManageCtrl.treeBusyIndicator = false;
    articleManageCtrl.init = function () {
        alert("ok");
        articleManageCtrl.treeBusyIndicator = true;
        console.log("ok");
       
        ajax.call(cmsServerConfig.configApiServerPath+"articleCategory/getall", {}, 'POST').success(function (response) {
            articleManageCtrl.treeConfig.Items = response.ListItems;
            console.log(response.ListItems);
            articleManageCtrl.treeBusyIndicator = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
            console.log(errCode);
            console.log(c);
            console.log(d);

        });

        //console.log(brwseCtrl);
    }
    articleManageCtrl.isCurrentNodeEmpty = function () {
        return !angular.equals({}, articleManageCtrl.treeConfig.currentNode);
    }

    articleManageCtrl.loadFileAndFolder = function (item) {
        articleManageCtrl.treeConfig.currentNode = item;
        console.log(item);
        articleManageCtrl.treeConfig.onNodeSelect(item);
    }

    articleManageCtrl.openNewFolder = function() {
        alert("ok");
    }

    
}]);