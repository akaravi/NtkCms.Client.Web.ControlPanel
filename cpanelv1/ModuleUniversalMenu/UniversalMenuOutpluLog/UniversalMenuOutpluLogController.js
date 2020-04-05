app.controller("outputLogGridController", ["$scope", "$http", "ajax", function ($scope, $http, ajax) {
    
    
    var outputLogCtrl=this ;
    outputLogCtrl.treeConfig = {
        displayMember: 'Name',
        displayId: 'Id',
        displayChild: 'Children'
    };

    outputLogCtrl.treeConfig.currentNode = {};
    outputLogCtrl.treeBusyIndicator = false;
    outputLogCtrl.init = function () {
        alert("ok");
        outputLogCtrl.treeBusyIndicator = true;
        console.log("ok");
       
        ajax.call(cmsServerConfig.configApiServerPath+"ArticleCategory/getall", {}, 'POST').success(function (response) {
            outputLogCtrl.treeConfig.Items = response.ListItems;
            console.log(response.ListItems);
            outputLogCtrl.treeBusyIndicator = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
            console.log(errCode);
            console.log(c);
            console.log(d);

        });

        //console.log(brwseCtrl);
    }
    outputLogCtrl.isCurrentNodeEmpty = function () {
        return !angular.equals({}, outputLogCtrl.treeConfig.currentNode);
    }

    outputLogCtrl.loadFileAndFolder = function (item) {
        outputLogCtrl.treeConfig.currentNode = item;
        console.log(item);
        outputLogCtrl.treeConfig.onNodeSelect(item);
    }

    outputLogCtrl.openNewFolder = function() {
        alert("ok");
    }

    
}]);