
var cmsServerConfig = {
    configApiServerPath: "https://apicms.ir/api/v1/",
	//configApiServerPath: "http://localhost:2390/api/v1/",
    configMvcServerPath: "https://oco.ir",
    configCpanelImages: "/cpanelv1/images/",
    configPathFileByIdAndName:"https://oco.ir/files/",
    configRouteThumbnails:"https://oco.ir/imageThumbnails/",
    nnnnnnnnnnn:"https://apicms.ir/api/files/",
    configRouteUploadFileContent:"https://apicms.ir/api/v1/FileContent/upload/",
};

//tools
var filterByDifference = function (array1, array2, compareField) {
    var onlyInA = differenceInFirstArray(array1, array2, compareField);
    var onlyInb = differenceInFirstArray(array2, array1, compareField);
    return onlyInA.concat(onlyInb);
}

var differenceInFirstArray = function (array1, array2, compareField) {
    return array1.filter(function (current) {
        return array2.filter(function (current_b) {
            if (compareField && compareField.length > 0) {
                return current_b[compareField] === current[compareField];
            } else {
                return compareObjects(current_b, current)
            }
        }).length == 0;
    });
}
var findWithAttr = function (array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}
var compareObjects = function (o1, o2) {
    for (var p in o1) {
        if (o1.hasOwnProperty(p)) {
            if (o1[p] !== o2[p]) {
                return false;
            }
        }
    }
    for (var p in o2) {
        if (o2.hasOwnProperty(p)) {
            if (o1[p] !== o2[p]) {
                return false;
            }
        }
    }
    return true;
};
//tools
var app =
    angular.module('inspinia')
    .config(
        [
            '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
            function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
                app.controller = $controllerProvider.register;
                app.directive = $compileProvider.directive;
                app.filter = $filterProvider.register;
                app.factory = $provide.factory;
                app.service = $provide.service;
                app.constant = $provide.constant;
                app.value = $provide.value;
            }
        ]).config(function ($breadcrumbProvider, $tooltipProvider) {
        $breadcrumbProvider.setOptions({
            template: '<ol class="breadcrumb" style="margin-top:20px;"><li><a href="#/index/main">خانه</a></li><li ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract"><a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a><span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span></li></ol>'
        });
        $tooltipProvider.setTriggers({
            'mouseenter': 'mouseleave',
            'click': 'click',
            'focus': 'blur',
            'never': 'mouseleave' // <- This ensures the tooltip will go away on mouseleave
        });
    }).config(['$translateProvider', function ($translateProvider) {
        $translateProvider
            .useStaticFilesLoader({
                prefix: 'cpanelv1/translations/',
                suffix: '.json'
            })
            .preferredLanguage(localStorage.getItem("userLanguage") != null ? localStorage.getItem("userLanguage") : "fa_IR");
        //.useLocalStorage();
    }]).run([
        'ajax', '$builder',
        function (ajax, $builder) {
            $(window).bind("beforeunload", function () {});

        }
    ]);