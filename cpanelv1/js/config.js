var mainPathApi = "api/";
mainPathApi = "http://oco.ir/api/";
//mainPathApi = "http://localhost:2391/api/";
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
                    prefix: 'cpanelv1/js/translations/',
                    suffix: '.json'
                })
                .preferredLanguage(localStorage.getItem("userLanguage") != null ? localStorage.getItem("userLanguage") : "fa_IR");
            //.useLocalStorage();
        }
        ]).run([
            'ajax', '$builder', function (ajax, $builder) {
                $(window).bind("beforeunload", function () {
                });

            }
        ]);