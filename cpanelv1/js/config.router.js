angular.module('inspinia')
    .run(function ($rootScope, $state) {
        $rootScope.$state = $state;
    })
    .config([
        '$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider',
        function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
            $urlRouterProvider.otherwise("/login");
            $ocLazyLoadProvider.config({
                // Set to true if you want to see what and when is dynamically loaded
                debug: false,
                reconfig: true
            });
            $stateProvider
                .state('login', {
                    url: "/login",
                    templateUrl: "cpanelv1/ModuleCore/CmsUser/login.html",
                    data: {
                        pageTitle: 'Login',
                        specialClass: 'gray-bg'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsUser/loginController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("siteSelector", {
                    url: "/siteSelector",
                    templateUrl: "cpanelv1/ModuleCore/main/siteSelector.html",
                    data: {
                        pageTitle: "انتخاب سایت"
                    },
                    resolve: {
                        deps: [
                            "$ocLazyLoad",
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        "cpanelv1/ModuleCore/main/navigationController.js"
                                    ]
                                });
                            }
                        ]
                    }
                })

                .state('index.main', {
                    url: "/main",
                    templateUrl: "cpanelv1/ModuleCore/main/dashboard.html",
                    controller: "dashbCtrl",
                    controllerAs: "dashb",
                    data: {
                        pageTitle: 'داشبورد سیستمی'
                    },
                    ncyBreadcrumb: {
                        label: 'داشبورد'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'summernote', {
                                        //serie: false,
                                        files: [
                                            'cpanelv1/ModuleCore/Main/dashboard.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state("user_wizard", {
                    url: "/user_wizard",
                    controller: "registerUserCtrl",
                    controllerAs: "register",
                    templateUrl: "cpanelv1/ModuleCore/user-wizard/form_wizard.html",
                    data: {
                        pagetTitle: "New User",
                        specialClass: "gray-bg"
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/js/registerUserController.js',
                                        'cpanelv1/ModuleCore/user-wizard/jquery.steps.css'
                                    ]
                                });
                            }
                        ]
                    }

                })
                .state("user_wizard.step_one", {
                    url: "/step_one",
                    templateUrl: "cpanelv1/ModuleCore/user-wizard/step_one.html",
                    data: {
                        pagetTitle: "New User",
                        specialClass: "gray-bg"
                    }
                })
                .state("user_wizard.step_two", {
                    url: "/step_two",
                    templateUrl: "cpanelv1/ModuleCore/user-wizard/step_two.html",
                    data: {
                        pagetTitle: "New User",
                        specialClass: "gray-bg"
                    }
                })
                .state("user_wizard.step_three", {
                    url: "/step_three",
                    templateUrl: "cpanelv1/ModuleCore/user-wizard/step_three.html",
                    data: {
                        pagetTitle: "New User",
                        specialClass: "gray-bg"
                    }
                })
                .state("user_wizard.step_four", {
                    url: "/step_four",
                    templateUrl: "cpanelv1/ModuleCore/user-wizard/step_four.html",
                    data: {
                        pagetTitle: "New User",
                        specialClass: "gray-bg"
                    }
                })
                //-----Core-----
                .state("index.cmsuser", {
                    url: "/cmsuser",
                    templateUrl: "cpanelv1/ModuleCore/CmsUser/grid.html",
                    controller: "cmsUserController",
                    controllerAs: "cmsUser",
                    data: {
                        pageTitle: "کاربران سیستم"
                    },
                    ncyBreadcrumb: {
                        label: 'کاربران سیستم'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsUser/cmsUserController.js'
                                    ]
                                });
                            }
                        ]
                    }

                })
                .state("index.cmscpmainmenu", {
                    url: "/cmscpmainmenu",
                    templateUrl: "cpanelv1/ModuleCore/cmsCpMainMenu/grid.html",
                    controller: "cmsCpMainMenuGridCtrl",
                    controllerAs: "cmsCpMainMenugrd",
                    data: {
                        pageTitle: "منو"
                    },
                    ncyBreadcrumb: {
                        label: 'منو'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['minicolors', {
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsCpMainMenu/cmsCpMainMenuController.js'
                                    ]
                                }]);
                            }
                        ]
                    }

                })
                .state("index.cmslocation", {
                    url: "/cmslocation",
                    templateUrl: "cpanelv1/ModuleCore/CmsLocation/grid.html",
                    controller: "cmsLocationController",
                    controllerAs: "cmsLocation",
                    data: {
                        pageTitle: "مکان"
                    },
                    ncyBreadcrumb: {
                        label: 'مکان'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsLocation/cmsLocationController.js'
                                    ]
                                });
                            }
                        ]
                    }

                })
                .state("index.cmsuserbadlogingrd", {
                    url: "/cmsuserbadlogingrd",
                    templateUrl: "cpanelv1/ModuleCore/cmsUserBadLogin/grid.html",
                    controller: "cmsUserBadLoginGridCtrl",
                    controllerAs: "cmsUserBadLogingrd",
                    data: {
                        pageTitle: "لاگین های نادرست"
                    },
                    ncyBreadcrumb: {
                        label: 'لاگین های نادرست'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsUserBadLogin/cmsUserBadLoginController.js'
                                    ]
                                });
                            }
                        ]
                    }

                })
                .state("index.cmsusergroup", {
                    url: "/cmsusergroup",
                    templateUrl: "cpanelv1/ModuleCore/cmsUserGroup/grid.html",
                    controller: "cmsUserGroupGridCtrl",
                    controllerAs: "cmsUserGroupgrd",
                    data: {
                        pageTitle: "گروه بندی کاربران"
                    },
                    ncyBreadcrumb: {
                        label: 'گروه بندی کاربران'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsUserGroup/cmsUserGroupController.js'
                                    ]
                                });
                            }
                        ]
                    }

                })
                .state("index.cmssiteuser", {
                    url: "/cmssiteuser",

                    templateUrl: "cpanelv1/ModuleCore/cmsSiteUser/grid.html",
                    controller: "cmsSiteUserGridCtrl",
                    controllerAs: "cmsSiteUser",
                    data: {
                        pageTitle: "کاربران سایت"
                    },
                    ncyBreadcrumb: {
                        label: 'کاربران سایت'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleCore/CmsSiteUser/CmsSiteUserController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }

                })
                .state("index.cmspagetemplate", {
                    url: "/cmspagetemplate",
                    templateUrl: "cpanelv1/ModuleCore/CmsPageTemplate/grid.html",
                    controller: "cmsPageTemplateGridCtrl",
                    controllerAs: "cmsPageTemplategrd",
                    data: {
                        pageTitle: "قالب ها"
                    },
                    ncyBreadcrumb: {
                        label: 'قالب ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsPageTemplate/CmsPageTemplateController.js'
                                    ]
                                });
                            }
                        ]
                    }

                })
                .state("index.cmssite", {
                    url: "/cmssite",
                    templateUrl: "cpanelv1/ModuleCore/cmsSite/grid.html",
                    params: {
                        selectedId: null
                    },
                    controller: "cmsSiteGridCtrl",
                    controllerAs: "cmsSitegrd",
                    data: {
                        pageTitle: "سایت ها"
                    },
                    ncyBreadcrumb: {
                        label: 'سایت ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", 'ADM-dateTimePicker', {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleCore/CmsSite/cmsSiteController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state("index.domainaliases", {
                    url: "/domainaliases",
                    templateUrl: "cpanelv1/ModuleCore/CmsDomainAlias/grid.html",
                    controller: "domainAliasController",
                    controllerAs: "domainAlias",
                    data: {
                        pageTitle: "های دامنه Alias"
                    },
                    ncyBreadcrumb: {
                        label: "های دامنه Alias"
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    //serie: true,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsDomainAlias/domainAliasController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state("index.cmssitecategories", {
                    url: "/cmssitecategories",
                    templateUrl: "cpanelv1/ModuleCore/cmsSiteCategory/grid.html",
                    controller: "cmsSiteCategoryGridCtrl",
                    controllerAs: "cmsSiteCategorygrd",
                    data: {
                        pageTitle: "دسته بندی سایت ها"
                    },
                    ncyBreadcrumb: {
                        label: 'دسته بندی سایت ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsSiteCategory/cmsSiteCategoryController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.cmssitecategorycmsmodule", {
                    url: "/cmssitecategorycmsmodule",
                    templateUrl: "cpanelv1/ModuleCore/CmsSiteCategoryCmsModule/grid.html",
                    controller: "cmsSiteCategoryCmsModuleCtrl",
                    controllerAs: "cmsSiteCategoryCmsModule",
                    data: {
                        pageTitle: "ماژول های دسته"
                    },
                    ncyBreadcrumb: {
                        label: "ماژول های دسته"
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsSiteCategoryCmsModule/cmsSiteCategoryCmsModuleController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.cmspages", {
                    url: "/cmspages",
                    templateUrl: "cpanelv1/ModuleCore/CmsPage/grid.html",
                    controller: "cmsPageGridCtrl",
                    controllerAs: "cmsPagegrd",
                    data: {
                        pageTitle: "صفحات سایت"
                    },
                    ncyBreadcrumb: {
                        label: 'صفحات سایت'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsPage/cmsPageController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.cmspagesdesign", {
                    url: "/cmspagesdesign",
                    templateUrl: "cpanelv1/ModuleCore/CmsPage/boxes.html",
                    params: {
                        dependencyId: null,
                        dependencyTitle: null,
                        classActioName: null,
                        moduleId: null,
                        moduleTitle: null
                    },
                    controller: "cmsPageGridDesignCtrl",
                    controllerAs: "cmsPageDesign",
                    data: {
                        pageTitle: "صفحات سایت"
                    },
                    ncyBreadcrumb: {
                        label: 'صفحات سایت'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleCore/CmsPage/cmsPageDesignController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
           
                .state("index.modulesaleprice", {
                    url: "/modulesaleprice",
                    templateUrl: "cpanelv1/ModuleCore/cmsModuleSalePrice/grid.html",
                    controller: "cmsModuleSalePriceGridCtrl",
                    controllerAs: "cmsModulePricegrd",
                    data: {
                        pageTitle: "قیمت فروش ماژول"
                    },
                    ncyBreadcrumb: {
                        label: 'قیمت فروش ماژول'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsModuleSalePrice/cmsModuleSalePriceController.js'
                                    ]
                                });
                            }
                        ]
                    }

                })
                .state("index.cmsmoduleprocess", {
                    url: "/cmsmoduleprocess",
                    templateUrl: "cpanelv1/ModuleCore/cmsModuleProcess/grid.html",
                    controller: "cmsModuleProcessGridCtrl",
                    controllerAs: "cmsModulePrc",
                    data: {
                        pageTitle: "قیمت فروش ماژول"
                    },
                    ncyBreadcrumb: {
                        label: 'قیمت فروش ماژول'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsModuleProcess/cmsModuleProcessController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.cmsmoduleprocesscustomize", {
                    url: "/cmsmoduleprocesscustomize",
                    templateUrl: "cpanelv1/ModuleCore/cmsModuleProcessCustomize/grid.html",
                    params: {
                        cmsModulePrcId: null
                    },
                    controller: "cmsModuleProcessCustomizeGridCtrl",
                    controllerAs: "cmsMdlPrcCustm",
                    data: {
                        pageTitle: "بکار گیری ماژول"
                    },
                    ncyBreadcrumb: {
                        label: 'بکار گیری ماژول'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'treeControl', {
                                        serie: true,
                                        files: [
                                            'cpanelv1/ModuleCore/CmsModuleProcessCustomize/cmsModuleProcessCustomizeController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state("index.cmsmodulesite", {
                    url: "/cmsmodulesite",
                    templateUrl: "cpanelv1/ModuleCore/cmsModuleSite/grid.html",
                    controller: "cmsModuleSiteGridCtrl",
                    controllerAs: "cmsModuleSitegrd",
                    data: {
                        pageTitle: "ماژول های سایت"
                    },
                    ncyBreadcrumb: {
                        label: 'ماژول های سایت'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsModuleSite/CmsModuleSiteController.js'
                                    ]
                                });
                            }
                        ]
                    }

                })
                .state("index.cmsmodules", {
                    url: "/cmsmodules",
                    templateUrl: "cpanelv1/ModuleCore/cmsModule/grid.html",
                    controller: "cmsModuleGridCtrl",
                    controllerAs: "cmsModulegrd",
                    data: {
                        pageTitle: "ماژول ها"
                    },
                    ncyBreadcrumb: {
                        label: 'ماژول ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsModule/cmsModuleController.js'
                                    ]
                                });
                            }
                        ]
                    }

                })
                //.state("index.cmsmoduleoptimizer",
                //    {
                //        url: "/cmsmoduleoptimizer",
                //        templateUrl: "cpanelv1/ModuleCore/CmsModuleOptimizer/grid.html",
                //        controller: "cmsModuleOptimizerGridController",
                //        controllerAs: "cmsModuleOptimizer",
                //        data: { pageTitle: "ماژول ها" },
                //        ncyBreadcrumb: {
                //            label: 'ماژول ها'
                //        },
                //        resolve: {
                //            deps: [
                //                '$ocLazyLoad',
                //                function($ocLazyLoad) {
                //                    return $ocLazyLoad.load({
                //                        serie: true,
                //                        files: [
                //                            'cpanelv1/ModuleCore/CmsModuleOptimizer/cmsModuleOptimizerController.js'
                //                        ]
                //                    });
                //                }
                //            ]
                //        }

                //    })
                .state("index.cmsmodulepagedependency", {
                    url: "/cmsModulepagedependency",
                    templateUrl: "cpanelv1/ModuleCore/CmsModulePageDependency/grid.html",
                    controller: "cmsModulePageDependencyGridCtrl",
                    controllerAs: "cmsModulePageDependencygrd",
                    data: {
                        pageTitle: "وابستگی ها"
                    },
                    ncyBreadcrumb: {
                        label: 'وابستگی ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsModulePageDependency/CmsModulePageDependencyController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                //-----cmsmodulescheduleprocess-----
                .state("index.cmsmodulescheduleprocess", {
                    url: "/cmsmodulescheduleprocess",
                    templateUrl: "cpanelv1/ModuleCore/CmsModuleScheduleProcess/grid.html",
                    controller: "cmsModuleScheduleProcessCtrl",
                    controllerAs: "cmsMdlPayPrc",
                    data: {
                        pageTitle: "فعالیت پرداخت"
                    },
                    ncyBreadcrumb: {
                        label: 'فعالیت پرداخت'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsModuleScheduleProcess/cmsModuleScheduleProcessController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.cmsmodulescheduleprocesscustomize", {
                    url: "/cmsmodulescheduleprocesscustomize",
                    templateUrl: "cpanelv1/ModuleCore/CmsModuleScheduleProcessCustomize/grid.html",
                    controller: "cmsModuleScheduleProcessCustomizeCtrl",
                    controllerAs: "cmsMdlPayPrcCust",
                    data: {
                        pageTitle: "بکارگیری فعالیت پرداخت"
                    },
                    ncyBreadcrumb: {
                        label: 'بکارگیری فعالیت پرداخت'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsModuleScheduleProcessCustomize/cmsModuleScheduleProcessCustomizeController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                //-----cmsmodulepaymentprocess-----
                .state("index.cmsmodulepaymentprocess", {
                    url: "/cmsmodulepaymentprocess",
                    templateUrl: "cpanelv1/ModuleCore/CmsModulePaymentProcess/grid.html",
                    controller: "cmsModulePaymentProcessCtrl",
                    controllerAs: "cmsMdlPayPrc",
                    data: {
                        pageTitle: "فعالیت پرداخت"
                    },
                    ncyBreadcrumb: {
                        label: 'فعالیت پرداخت'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsModulePaymentProcess/cmsModulePaymentProcessController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.cmsmodulepaymentprocesscustomize", {
                    url: "/cmsmodulepaymentprocesscustomize",
                    templateUrl: "cpanelv1/ModuleCore/CmsModulePaymentProcessCustomize/grid.html",
                    params: {
                        cmsMdlPayPrcId: null
                    },
                    controller: "cmsModulePaymentProcessCustomizeCtrl",
                    controllerAs: "cmsMdlPayPrcCust",
                    data: {
                        pageTitle: "بکارگیری فعالیت پرداخت"
                    },
                    ncyBreadcrumb: {
                        label: 'بکارگیری فعالیت پرداخت'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsModulePaymentProcessCustomize/cmsModulePaymentProcessCustomizeController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                //-----Monitoring-----
                .state("index.usertickets", {
                    url: "/usertickets",
                    templateUrl: "cpanelv1/ModuleCore/cmsUserTicket/grid.html",
                    controller: "cmsUserTicketGridCtrl",
                    controllerAs: "cmsUserTicketgrd",
                    data: {
                        pageTitle: "توکن ها"
                    },
                    ncyBreadcrumb: {
                        label: 'توکن ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsUserTicket/cmsUserTicketController.js'
                                    ]
                                });
                            }
                        ]
                    }

                })
                //-----Module File-----
                .state("index.filemanager", {
                    url: "/filemanager",
                    templateUrl: "cpanelv1/ModuleFile/main.html",
                    controller: "FileManager",
                    controllerAs: "fdm",
                    data: {
                        pageTitle: "مدیریت فایل"
                    },
                    ncyBreadcrumb: {
                        label: 'مدیریت فایل'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleFile/FileManagerController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.filemanagernew", {
                    url: "/filemanagernew",
                    templateUrl: "cpanelv1/ModuleFile/FileManager/grid.html",
                    controller: "FileManager",
                    controllerAs: "fdm",
                    data: {
                        pageTitle: "مدیریت فایل"
                    },
                    ncyBreadcrumb: {
                        label: 'مدیریت فایل'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleFile/FileManager/FileManagerController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.fileslist", {
                    url: "/fileslist",
                    templateUrl: "cpanelv1/ModuleFile/grid.html",
                    controller: "filesListCtrl",
                    controllerAs: "filesList",
                    data: {
                        pageTitle: "مدیریت فایل"
                    },
                    ncyBreadcrumb: {
                        label: 'مدیریت فایل'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleFile/fileListController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.filespropertytype", {
                    url: "/filespropertytype",
                    templateUrl: "cpanelv1/ModuleFile/grid.html",
                    controller: "filesListCtrl",
                    controllerAs: "filesList",
                    data: {
                        pageTitle: "مدیریت فایل"
                    },
                    ncyBreadcrumb: {
                        label: 'مدیریت فایل'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleFile/fileListController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                //---------------------
                .state('index', {
                    //abstract: true,
                    url: "/index",
                    ncyBreadcrumb: {
                        skip: true,
                        label: ' '
                    },
                    //data: { pageTitle: 'صفحه اصلی' },
                    views: {
                        '': {
                            templateUrl: "cpanelv1/ModuleCore/main/content.html",
                            resolve: {
                                deps: [
                                    '$ocLazyLoad',
                                    function ($ocLazyLoad) {
                                        return $ocLazyLoad.load({
                                            serie: true,
                                            files: [
                                                'cpanelv1/ModuleCore/main/controllers.js'
                                            ]
                                        });
                                    }
                                ]
                            }
                        },
                        'navigation@index': {
                            url: "",
                            controller: 'navigationCtrl',
                            templateUrl: 'cpanelv1/ModuleCore/main/navigation.html',
                            resolve: {
                                deps: [
                                    '$ocLazyLoad',
                                    function ($ocLazyLoad) {
                                        return $ocLazyLoad.load({
                                            serie: true,
                                            files: [
                                                'cpanelv1/ModuleCore/main/navigationController.js'
                                            ]
                                        });
                                    }
                                ]
                            }
                        },
                        'navigationup@index': {
                            url: "",
                            controller: 'navigationCtrl',
                            templateUrl: 'cpanelv1/ModuleCore/main/navigationup.html',
                            resolve: {
                                deps: [
                                    '$ocLazyLoad',
                                    function ($ocLazyLoad) {
                                        return $ocLazyLoad.load({
                                            serie: true,
                                            files: [
                                                'cpanelv1/ModuleCore/main/navigationController.js'
                                            ]
                                        });
                                    }
                                ]
                            }
                        },
                        'navigationdown@index': {
                            url: "",
                            controller: 'navigationCtrl',
                            templateUrl: 'cpanelv1/ModuleCore/main/navigationdown.html',
                            resolve: {
                                deps: [
                                    '$ocLazyLoad',
                                    function ($ocLazyLoad) {
                                        return $ocLazyLoad.load({
                                            serie: true,
                                            files: [
                                                'cpanelv1/ModuleCore/main/navigationController.js'
                                            ]
                                        });
                                    }
                                ]
                            }
                        },

                        'topnavbar@index': {
                            url: '',
                            controller: 'topNavBarCtrl',
                            controllerAs: 'topNavBar',
                            templateUrl: 'cpanelv1/ModuleCore/main/topnavbar.html',
                            resolve: {
                                deps: [
                                    '$ocLazyLoad',
                                    function ($ocLazyLoad) {
                                        return $ocLazyLoad.load([
                                            'angucomplete-alt', {
                                                serie: true,
                                                files: [
                                                    'cpanelv1/ModuleCore/main/topnavbarController.js',
                                                    'cpanelv1/css/guide/introjs.css',
                                                    'cpanelv1/css/guide/introjs-rtl.css',
                                                    'cpanelv1/js/guide/intro.js',
                                                    'cpanelv1/js/guide/angular-intro.min.js'
                                                ]
                                            }
                                        ]);
                                    }
                                ]
                            }
                        },
                        'footer@index': {
                            url: '',
                            controller: 'footerCtrl',
                            templateUrl: 'cpanelv1/ModuleCore/main/footer.html',
                            resolve: {
                                deps: [
                                    '$ocLazyLoad',
                                    function ($ocLazyLoad) {
                                        return $ocLazyLoad.load({
                                            serie: true,
                                            files: [
                                                'cpanelv1/ModuleCore/main/footerController.js'
                                            ]
                                        });
                                    }
                                ]
                            }
                        }
                    }
                })

                .state('index.buy_module', {
                    url: "/buy_module",
                    templateUrl: "cpanelv1/ModuleCore/common/buy_module.html",
                    controller: "buyModuleCtrl",
                    controllerAs: "buyModule",
                    data: {
                        pageTitle: 'خرید ماژول'
                    },
                    ncyBreadcrumb: {
                        label: 'خرید ماژول'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {

                                return $ocLazyLoad.load([{
                                    serie: false,
                                    files: [
                                        'cpanelv1/ModuleCore/common/buyModuleController.js',
                                        'cpanelv1/ModuleCore/user-wizard/jquery.steps.css'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state("index.buy_module.step_one", {
                    url: "/step_one",
                    templateUrl: "cpanelv1/ModuleCore/common/buy_module_step_one.html",
                    data: {
                        pagetTitle: "New User",
                        specialClass: "gray-bg"
                    },
                    ncyBreadcrumb: {
                        label: 'مرحله اول'
                    }
                })
                .state("index.buy_module.step_two", {
                    url: "/step_two",
                    templateUrl: "cpanelv1/ModuleCore/common/buy_module_step_two.html",
                    data: {
                        pagetTitle: "New User",
                        specialClass: "gray-bg"
                    },
                    ncyBreadcrumb: {
                        label: 'مرحله دوم'
                    }
                })
                .state("index.buy_module.step_three", {
                    url: "/step_three",
                    templateUrl: "cpanelv1/ModuleCore/common/buy_module_step_three.html",
                    data: {
                        pagetTitle: "New User",
                        specialClass: "gray-bg"
                    },
                    ncyBreadcrumb: {
                        label: 'مرحله سوم'
                    }
                })
                .state('index.minor', {
                    url: "/minor",
                    templateUrl: "cpanelv1/ModuleCore/minor.html",
                    controller: "formCtrl",
                    controllerAs: "frm",
                    data: {
                        pageTitle: 'صفحه مینور'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'nouislider', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/js/formController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.NewsManage', {
                    url: "/NewsManage",
                    templateUrl: "cpanelv1/ModuleNews/NewsManage.html",
                    controller: "newsManageCtrl",
                    controllerAs: "newsManageCtrl",
                    data: {
                        pageTitle: 'صفحه مینور'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    serie: false,
                                    files: [
                                        'cpanelv1/ModuleNews/NewManage.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state('index.grid', {
                    url: "/grid",
                    templateUrl: "cpanelv1/ModuleCore/grid.html",
                    controller: "gridCtrl",
                    controllerAs: "grd",
                    data: {
                        pageTitle: 'صفحه گرید'
                    },
                    ncyBreadcrumb: {
                        label: 'گرید'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    serie: false,
                                    files: [
                                        'cpanelv1/js/plugins/angular-floatthead/jquery.floatThead.js',
                                        'cpanelv1/js/gridController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state('index.designer', {
                    url: "/designer",
                    templateUrl: "cpanelv1/ModuleCore/common/designer.html",
                    controller: "designerCtrl",
                    controllerAs: "designerct",
                    data: {
                        pageTitle: 'صفحه طراحی'
                    },
                    ncyBreadcrumb: {
                        label: 'طراحی'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    serie: false,
                                    files: [
                                        'cpanelv1/js/designerCtrl.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state('index.cmsapipath', {
                    url: "/cmsapipath",
                    templateUrl: "cpanelv1/ModuleSms/ApiPath/main.html",
                    controller: "apiPathCtrl",
                    controllerAs: "api",
                    data: {
                        pageTitle: 'مسیر های ارسال پیام کوتاه'
                    },
                    ncyBreadcrumb: {
                        label: 'مسیر های ارسال پیام کوتاه'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    //serie: true,
                                    files: [
                                        'cpanelv1/ModuleSms/ApiPathController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state('index.cmspathconfig', {
                    url: "/cmspathconfig",
                    templateUrl: "cpanelv1/ModuleSms/ApiPathSettingsTabs/main.html",
                    controller: "apiPathSettingsCtrl",
                    controllerAs: "apiSetting",
                    data: {
                        pageTitle: 'مسیر های ارسال پیام کوتاه'
                    },
                    ncyBreadcrumb: {
                        label: 'مسیر های ارسال پیام کوتاه'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    //serie: true,
                                    files: [
                                        'cpanelv1/ModuleSms/ApiPathSettingsController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state('index.cmscustomernumber', {
                    url: "/cmscustomernumber",
                    templateUrl: "cpanelv1/ModuleSms/CustomerNumber/main.html",
                    controller: "customerNumberCtrl",
                    controllerAs: "customerNumber",
                    data: {
                        pageTitle: 'شماره مشتری'
                    },
                    ncyBreadcrumb: {
                        label: 'شماره مشتری'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    //serie: true,
                                    files: [
                                        'cpanelv1/ModuleSms/CustomerNumberController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state('index.smsinbox', {
                    url: "/smsinbox",
                    templateUrl: "cpanelv1/ModuleSms/Inbox/main.html",
                    controller: "inboxCtrl",
                    controllerAs: "inbox",
                    data: {
                        pageTitle: 'صندوق ورودی'
                    },
                    ncyBreadcrumb: {
                        label: 'صندوق ورودی'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    //serie: true,
                                    files: [
                                        'cpanelv1/ModuleSms/InboxController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state('index.smsoutbox', {
                    url: "/smsoutbox",
                    templateUrl: "cpanelv1/ModuleSms/OutBox/main.html",
                    controller: "outBoxCtrl",
                    controllerAs: "outBox",
                    data: {
                        pageTitle: 'صندوق خروجی'
                    },
                    ncyBreadcrumb: {
                        label: 'صندوق خروجی'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    //serie: true,
                                    files: [
                                        'cpanelv1/ModuleSms/OutBoxController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state('index.smsinboxlock', {
                    url: "/smsinboxlock",
                    templateUrl: "cpanelv1/ModuleSms/InboxLock/main.html",
                    controller: "inboxLockCtrl",
                    controllerAs: "inboxLock",
                    data: {
                        pageTitle: 'پیام ها'
                    },
                    ncyBreadcrumb: {
                        label: 'پیام های قفل شده'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    //serie: true,
                                    files: [
                                        'cpanelv1/ModuleSms/InboxLockController.js'
                                        //  
                                        //  
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state('index.cmsapicompany', {
                    url: "/cmsapicompany",
                    templateUrl: "cpanelv1/ModuleSms/ApiPathCompany/main.html",
                    controller: "apiPathCompanyCtrl",
                    controllerAs: "apiCompany",
                    data: {
                        pageTitle: 'شرکت های پیام کوتاه'
                    },
                    ncyBreadcrumb: {
                        label: 'شرکت های پیام کوتاه'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    //serie: true,
                                    files: [
                                        'cpanelv1/ModuleSms/ApiPathCompanyController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state('index.apipathcustomer', {
                    url: "/apipathcustomer",
                    templateUrl: "cpanelv1/ModuleSms/ApiPathAndCustomerNumber/main.html",
                    controller: "apiPathCustomerCtrl",
                    controllerAs: "apiPathCustomer",
                    data: {
                        pageTitle: 'مسیر و مشتریان'
                    },
                    ncyBreadcrumb: {
                        label: 'مسیر و مشتریان'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    //serie: true,
                                    files: [
                                        'cpanelv1/ModuleSms/ApiPathAndCustomerNumberController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state('index.smsoutboxdetail', {
                    url: "/smsoutboxdetail",
                    templateUrl: "cpanelv1/ModuleSms/OutBoxDetail/main.html",
                    controller: "outBoxDetailCtrl",
                    controllerAs: "outBoxDetail",
                    data: {
                        pageTitle: 'پیام ها'
                    },
                    ncyBreadcrumb: {
                        label: 'جزئیات خروجی'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    //serie: true,
                                    files: [
                                        'cpanelv1/ModuleSms/OutBoxDetailController.js'
                                        //   
                                        //   
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state('index.inbox', {
                    url: "/inbox",
                    templateUrl: "cpanelv1/ModuleSms/Inbox/main.html",
                    controller: "inboxCtrl",
                    controllerAs: "inbox",
                    data: {
                        pageTitle: 'صندوق ورودی'
                    },
                    ncyBreadcrumb: {
                        label: 'صندوق ورودی'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    //serie: true,
                                    files: [
                                        'cpanelv1/ModuleSms/InboxController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                //-----CoreIdentity Module-----
                .state('index.coreidentityuser', {
                    url: "/coreidentityuser",
                    params: {
                        ContentId: null,
                        TitleTag: null
                    },
                    templateUrl: "cpanelv1/ModuleCoreIdentity/CoreIdentityUser/grid.html",
                    controller: "coreIdentityUserController",
                    controllerAs: "coreIdentityUser",
                    data: {
                        pageTitle: 'کاربران'
                    },
                    ncyBreadcrumb: {
                        label: 'کاربران'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", "treeControl", 'ADM-dateTimePicker', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleCoreIdentity/CoreIdentityUser/Controller.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.coreidentityuserlogin', {
                    url: "/coreidentityuserlogin",
                    params: {
                        ContentId: null,
                        TitleTag: null
                    },
                    templateUrl: "cpanelv1/ModuleCoreIdentity/CoreIdentityUserLogin/grid.html",
                    controller: "coreIdentityUserLoginController",
                    controllerAs: "coreIdentityUserLogin",
                    data: {
                        pageTitle: 'لاگ کاربران'
                    },
                    ncyBreadcrumb: {
                        label: 'لاگ کاربران'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", "treeControl", 'ADM-dateTimePicker', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleCoreIdentity/CoreIdentityUserLogin/Controller.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.coreidentityusertoken', {
                    url: "/coreidentityusertoken",
                    params: {
                        ContentId: null,
                        TitleTag: null
                    },
                    templateUrl: "cpanelv1/ModuleCoreIdentity/CoreIdentityUserToken/grid.html",
                    controller: "coreIdentityUserTokenController",
                    controllerAs: "coreIdentityUserToken",
                    data: {
                        pageTitle: 'توکن کاربران'
                    },
                    ncyBreadcrumb: {
                        label: 'توکن کاربران'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", "treeControl", 'ADM-dateTimePicker', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleCoreIdentity/CoreIdentityUserToken/Controller.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.coreidentityrole', {
                    url: "/coreidentityrole",
                    params: {
                        ContentId: null,
                        TitleTag: null
                    },
                    templateUrl: "cpanelv1/ModuleCoreIdentity/CoreIdentityRole/grid.html",
                    controller: "coreIdentityRoleController",
                    controllerAs: "coreIdentityRole",
                    data: {
                        pageTitle: 'کاربران'
                    },
                    ncyBreadcrumb: {
                        label: 'کاربران'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", "treeControl", 'ADM-dateTimePicker', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleCoreIdentity/CoreIdentityRole/Controller.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                //-----CoreIdentity Module-----
                //-----News Module-----
                .state('index.newscontent', {
                    url: "/newscontent",
                    params: {
                        ContentId: null,
                        TitleTag: null
                    },
                    templateUrl: "cpanelv1/ModuleNews/NewsContent/grid.html",
                    controller: "newsContentController",
                    controllerAs: "newsContent",
                    data: {
                        pageTitle: 'محتوای اخبار'
                    },
                    ncyBreadcrumb: {
                        label: 'محتوای اخبار'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", "treeControl", 'ADM-dateTimePicker', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleNews/NewsContent/Controller.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.newscomment', {
                    url: "/newscomment",
                    templateUrl: "cpanelv1/ModuleNews/NewsComment/grid.html",
                    controller: "newsCommentCtrl",
                    controllerAs: "newsComment",
                    data: {
                        pageTitle: 'اخبار-کامنت'
                    },
                    ncyBreadcrumb: {
                        label: 'کامنت اخبار'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    serie: false,
                                    files: [
                                        'cpanelv1/ModuleNews/NewsComment/NewsComment.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state('index.newstag', {
                    url: "/newstag",
                    templateUrl: "cpanelv1/ModuleNews/NewsTag/grid.html",
                    controller: "newsTagCtrl",
                    controllerAs: "newsTag",
                    data: {
                        pageTitle: 'تگهای اخبار'
                    },
                    ncyBreadcrumb: {
                        label: 'تگ اخبار'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleNews/NewsTag/NewsTag.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.mscgallerytag', {
                    url: "/mscgallerytag",
                    templateUrl: "cpanelv1/ModuleMusicGallery/MusicGalleryTag/grid.html",
                    controller: "mscGalleryTagCtrl",
                    controllerAs: "mscGalleryTag",
                    data: {
                        pageTitle: 'تگهای موسیقی'
                    },
                    ncyBreadcrumb: {
                        label: 'تگ موسیقی'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleMusicGallery/MusicGalleryTag/MusicGalleryTag.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.imggallerytag', {
                    url: "/imggallerytag",
                    templateUrl: "cpanelv1/ModuleImageGallery/ImageGalleryTag/grid.html",
                    controller: "imgGalleryTagCtrl",
                    controllerAs: "imgGalleryTag",
                    data: {
                        pageTitle: 'تگهای تصاویر'
                    },
                    ncyBreadcrumb: {
                        label: 'تگ تصاویر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleImageGallery/ImageGalleryTag/ImageGalleryTag.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.mvgallerytag', {
                    url: "/mvgallerytag",
                    templateUrl: "cpanelv1/ModuleMovieGallery/MovieGalleryTag/grid.html",
                    controller: "mvGalleryTagCtrl",
                    controllerAs: "mvGalleryTag",
                    data: {
                        pageTitle: 'تگهای فیلم'
                    },
                    ncyBreadcrumb: {
                        label: 'تگ فیلم'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleMovieGallery/MovieGalleryTag/MovieGalleryTag.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.charttag', {
                    url: "/charttag",
                    templateUrl: "cpanelv1/ModuleChart/ChartTag/grid.html",
                    controller: "chartTagCtrl",
                    controllerAs: "chartTag",
                    data: {
                        pageTitle: 'تگهای چارت'
                    },
                    ncyBreadcrumb: {
                        label: 'تگ چارت'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    "treeControl", {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleChart/ChartTag/ChartTag.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                //-----Article Module-----
                .state('index.articletag', {
                    url: "/articletag",
                    templateUrl: "cpanelv1/ModuleArticle/ArticleTag/grid.html",
                    controller: "articleTagCtrl",
                    controllerAs: "articleTag",
                    data: {
                        pageTitle: 'مقالات - تگ ها'
                    },
                    ncyBreadcrumb: {
                        label: 'تگ ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleArticle/ArticleTag/ArticleTag.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.articlecomment', {
                    url: "/articlecomment",
                    templateUrl: "cpanelv1/ModuleArticle/ArticleComment/grid.html",
                    controller: "articleCommentCtrl",
                    controllerAs: "articleComment",
                    data: {
                        pageTitle: 'مقالات-کامنت'
                    },
                    ncyBreadcrumb: {
                        label: 'کامنت مقالات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    serie: false,
                                    files: [
                                        'cpanelv1/ModuleArticle/ArticleComment/ArticleComment.js'
                                        //  
                                        // 
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state('index.articlecontent', {
                    url: "/articlecontent",
                    params: {
                        ContentId: null,
                        TitleTag: null
                    },
                    templateUrl: "cpanelv1/ModuleArticle/ArticleContent/grid.html",
                    controller: "articleContentController",
                    controllerAs: "articleContent",
                    data: {
                        pageTitle: 'مقالات - محتوا'
                    },
                    ncyBreadcrumb: {
                        label: 'محتوای مقالات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", "treeControl", 'ADM-dateTimePicker', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleArticle/ArticleContent/Controller.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }

                })
                //-----Delivery Module-----
                .state('index.deliveryinvoice', {
                    url: "/deliveryinvoice",
                    templateUrl: "cpanelv1/ModuleDelivery/DeliveryInvoice/grid.html",
                    controller: "deliveryInvoiceController",
                    controllerAs: "deliveryInvoice",
                    data: {
                        pageTitle: 'deliveryInvoice'
                    },
                    ncyBreadcrumb: {
                        label: 'deliveryInvoice'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleDelivery/DeliveryInvoice/DeliveryInvoiceController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.deliverymember', {
                    url: "/deliverymember",
                    templateUrl: "cpanelv1/ModuleDelivery/DeliveryMember/grid.html",
                    controller: "deliveryMemberController",
                    controllerAs: "deliveryMember",
                    data: {
                        pageTitle: 'DeliveryMember'
                    },
                    ncyBreadcrumb: {
                        label: 'DeliveryMember'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleDelivery/DeliveryMember/DeliveryMemberController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.deliverymemberabsent', {
                    url: "/deliverymemberabsent",
                    templateUrl: "cpanelv1/ModuleDelivery/DeliveryMemberAbsent/grid.html",
                    controller: "deliveryMemberAbsentController",
                    controllerAs: "deliveryMemberAbsent",
                    data: {
                        pageTitle: 'DeliveryMemberAbsent'
                    },
                    ncyBreadcrumb: {
                        label: 'DeliveryMemberAbsent'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleDelivery/DeliveryMemberAbsent/DeliveryMemberAbsentController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.deliverymembersetting', {
                    url: "/deliverymembersetting",
                    templateUrl: "cpanelv1/ModuleDelivery/DeliveryMemberSetting/grid.html",
                    controller: "deliveryMemberSettingController",
                    controllerAs: "deliveryMemberSetting",
                    data: {
                        pageTitle: 'deliveryMemberSetting'
                    },
                    ncyBreadcrumb: {
                        label: 'deliveryMemberSetting'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleDelivery/DeliveryMemberSetting/DeliveryMemberSettingController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.deliverymethod', {
                    url: "/deliverymethod",
                    templateUrl: "cpanelv1/ModuleDelivery/DeliveryMethod/grid.html",
                    controller: "deliveryMethodController",
                    controllerAs: "deliveryMethod",
                    data: {
                        pageTitle: 'deliveryMethod'
                    },
                    ncyBreadcrumb: {
                        label: 'deliveryMethod'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleDelivery/DeliveryMethod/DeliveryMethodController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.deliverymethoddetail', {
                    url: "/deliverymethoddetail",
                    templateUrl: "cpanelv1/ModuleDelivery/DeliveryMethodDetail/grid.html",
                    controller: "deliveryMethodDetailController",
                    controllerAs: "deliveryMethodDetail",
                    data: {
                        pageTitle: 'deliveryMethodDetail'
                    },
                    ncyBreadcrumb: {
                        label: 'deliveryMethodDetail'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleDelivery/DeliveryMethodDetail/DeliveryMethodDetailController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                //-----Biography Module-----
                .state('index.biographytag', {
                    url: "/biographytag",
                    templateUrl: "cpanelv1/ModuleBiography/BiographyTag/grid.html",
                    controller: "biographyTagCtrl",
                    controllerAs: "biographyTag",
                    data: {
                        pageTitle: 'زندگی نامه - تگ ها'
                    },
                    ncyBreadcrumb: {
                        label: 'تگ ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleBiography/BiographyTag/BiographyTag.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.biographycomment', {
                    url: "/biographycomment",
                    templateUrl: "cpanelv1/ModuleBiography/BiographyComment/grid.html",
                    controller: "biographyCommentCtrl",
                    controllerAs: "biographyComment",
                    data: {
                        pageTitle: 'زندگی نامه | کامنت'
                    },
                    ncyBreadcrumb: {
                        label: 'کامنت زندگی نامه'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleBiography/BiographyComment/BiographyComment.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.servicecomment', {
                    url: "/servicecomment",
                    templateUrl: "cpanelv1/ModuleService/ServiceComment/grid.html",
                    controller: "ServiceCommentCtrl",
                    controllerAs: "ServiceComment",
                    data: {
                        pageTitle: 'خدمات | کامنت'
                    },
                    ncyBreadcrumb: {
                        label: 'کامنت خدمات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleService/ServiceComment/serviceComment.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.productcomment', {
                    url: "/productcomment",
                    templateUrl: "cpanelv1/Moduleproduct/productComment/grid.html",
                    controller: "productContentController",
                    controllerAs: "productContent",
                    data: {
                        pageTitle: 'محصولات | کامنت'
                    },
                    ncyBreadcrumb: {
                        label: 'کامنت محصولات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/Moduleproduct/productComment/productComment.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.chartcomment', {
                    url: "/chartcomment",
                    templateUrl: "cpanelv1/ModuleChart/ChartComment/grid.html",
                    controller: "chartCommentCtrl",
                    controllerAs: "chartComment",
                    data: {
                        pageTitle: 'چارت | کامنت'
                    },
                    ncyBreadcrumb: {
                        label: 'کامنت چارت'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleChart/ChartComment/chartComment.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.imagegallerycomment', {
                    url: "/imagegallerycomment",
                    templateUrl: "cpanelv1/ModuleImageGallery/ImageGalleryComment/grid.html",
                    controller: "imgGalleryCommentCtrl",
                    controllerAs: "imgGalleryComment",
                    data: {
                        pageTitle: 'گالری تصاویر | کامنت'
                    },
                    ncyBreadcrumb: {
                        label: 'کامنت گالری تصاویر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleImageGallery/ImageGalleryComment/ImageGalleryComment.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.musicgallerycomment', {
                    url: "/musicgallerycomment",
                    templateUrl: "cpanelv1/ModuleMusicGallery/MusicGalleryComment/grid.html",
                    controller: "mscGalleryCommentCtrl",
                    controllerAs: "mscGalleryComment",
                    data: {
                        pageTitle: 'گالری موسیقی | کامنت'
                    },
                    ncyBreadcrumb: {
                        label: 'کامنت گالری موسیقی'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleMusicGallery/MusicGalleryComment/MusicGalleryComment.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.moviegallerycomment', {
                    url: "/moviegallerycomment",
                    templateUrl: "cpanelv1/ModuleMovieGallery/MovieGalleryComment/grid.html",
                    controller: "mvGalleryCommentCtrl",
                    controllerAs: "mvGalleryComment",
                    data: {
                        pageTitle: 'گالری فیلم | کامنت'
                    },
                    ncyBreadcrumb: {
                        label: 'کامنت گالری فیلم'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleMovieGallery/MovieGalleryComment/MovieGalleryComment.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.biographycontent', {
                    url: "/biographycontent",
                    params: {
                        ContentId: null,
                        TitleTag: null
                    },
                    templateUrl: "cpanelv1/ModuleBiography/BiographyContent/grid.html",
                    controller: "biographyContentController",
                    controllerAs: "biographyContent",
                    data: {
                        pageTitle: 'زندگی نامه | محتوا'
                    },
                    ncyBreadcrumb: {
                        label: 'محتوای زندگی نامه'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", "treeControl", 'ADM-dateTimePicker', {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleBiography/BiographyContent/Controller.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                //-----CmsSiteMenu-----
                .state('index.cmssitemenu', {
                    url: "/CmsSiteMenu",
                    templateUrl: "cpanelv1/ModuleCore/CmsSiteMenu/grid.html",
                    controller: "cmsSiteMenuCtrl",
                    controllerAs: "cmsSiteMenu",
                    data: {
                        pageTitle: 'مدیریت منو'
                    },
                    ncyBreadcrumb: {
                        label: 'منوها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleCore/CmsSiteMenu/CmsSiteMenuController.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                //-----Polling Module-----
                .state('index.pollingoption', {
                    url: "/pollingoption",
                    templateUrl: "cpanelv1/ModulePolling/PollingOption/grid.html",
                    controller: "pollingOptionCtrl",
                    controllerAs: "pollingOption",
                    data: {
                        pageTitle: 'نظرسنجی | گزینه ها'
                    },
                    ncyBreadcrumb: {
                        label: 'گزینه ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModulePolling/PollingOption/PollingOption.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.pollingcontent', {
                    url: "/PollingContent",
                    templateUrl: "cpanelv1/ModulePolling/PollingContent/grid.html",
                    controller: "pollingContentCtrl",
                    controllerAs: "pollingContent",
                    data: {
                        pageTitle: 'نظرسنجی | مدیریت نظرسنجی'
                    },
                    ncyBreadcrumb: {
                        label: 'نظرسنجی'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", "treeControl", 'ADM-dateTimePicker', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModulePolling/PollingContent/PollingContents.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                    //resolve: {
                    //    deps: [
                    //        '$ocLazyLoad',
                    //        function ($ocLazyLoad) {
                    //            return $ocLazyLoad.load(["ngTagsInput", "summernote", {
                    //                //serie: true,
                    //                files: [
                    //                    'cpanelv1/ModulePolling/PollingContent/PollingContents.js'

                    //                ]
                    //            }
                    //            ]);
                    //        }
                    //    ]
                    //}
                })
                .state('index.pollinglog', {
                    url: "/pollinglog",
                    templateUrl: "cpanelv1/ModulePolling/PollingLog/grid.html",
                    controller: "pollingLogCtrl",
                    controllerAs: "pollingLog",
                    data: {
                        pageTitle: 'نظرسنجی | گزارش آرا'
                    },
                    ncyBreadcrumb: {
                        label: 'گزارش آرا'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "summernote", {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModulePolling/PollingLog/pollingLog.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                //-----ImageGallery Module-----
                .state('index.imagegallery', {
                    url: "/imagegallery",
                    params: {
                        ContentId: null,
                        TitleTag: null
                    },
                    templateUrl: "cpanelv1/ModuleImageGallery/ImageGalleryContent/browser.html",
                    controller: "imageGalleryCtrl",
                    controllerAs: "imgGallery",
                    data: {
                        pageTitle: 'صفحه مدیریت تصاویر'
                    },
                    ncyBreadcrumb: {
                        label: 'مدیریت تصاویر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", "treeControl", {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleImageGallery/ImageGalleryContent/ImageGalleryContentController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                    //resolve: {
                    //    deps: [
                    //        '$ocLazyLoad',
                    //        function ($ocLazyLoad) {
                    //            return $ocLazyLoad.load(["ngTagsInput", "treeControl", {
                    //                serie: false,
                    //                files: [
                    //                    'cpanelv1/ModuleImageGallery/ImageGalleryContent/ImageGalleryContentController.js'
                    //                ]
                    //            }
                    //            ]);
                    //        }
                    //    ]
                    //}
                })
                //-----MovieGallery Module-----
                .state('index.moviegallery', {
                    url: "/moviegallery",
                    params: {
                        ContentId: null,
                        TitleTag: null
                    },
                    templateUrl: "cpanelv1/ModuleMovieGallery/MovieGalleryContent/browser.html",
                    controller: "movieGalleryCtrl",
                    controllerAs: "mvGallery",
                    data: {
                        pageTitle: 'صفحه مدیریت فیلم ها'
                    },
                    ncyBreadcrumb: {
                        label: 'مدیریت فیلم ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", "treeControl", "ADM-dateTimePicker", {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleMovieGallery/MovieGalleryContent/MovieGalleryContentController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                    //resolve: {
                    //    deps: [
                    //        '$ocLazyLoad',
                    //        function ($ocLazyLoad) {
                    //            return $ocLazyLoad.load(["ngTagsInput", "treeControl", {
                    //                serie: false,
                    //                files: [
                    //                    'cpanelv1/ModuleMovieGallery/MovieGalleryContent/MovieGalleryContentController.js'
                    //                ]
                    //            }
                    //            ]);
                    //        }
                    //    ]
                    //}
                })
                ///-----MusicGallery Module-----
                .state('index.musicgallery', {
                    url: "/musicgallery",
                    params: {
                        ContentId: null,
                        TitleTag: null
                    },
                    templateUrl: "cpanelv1/ModuleMusicGallery/MusicGalleryContent/browser.html",
                    controller: "musicGalleryCtrl",
                    controllerAs: "mscGallery",
                    data: {
                        pageTitle: 'صفحه مدیریت موسیقی ها'
                    },
                    ncyBreadcrumb: {
                        label: 'مدیریت موسیقی ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", "treeControl", "ADM-dateTimePicker", {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleMusicGallery/MusicGalleryContent/MusicGalleryContentController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                    //resolve: {
                    //    deps: [
                    //        '$ocLazyLoad',
                    //        function ($ocLazyLoad) {
                    //            return $ocLazyLoad.load(["ngTagsInput", "treeControl", {
                    //                serie: false,
                    //                files: [
                    //                    'cpanelv1/ModuleMusicGallery/MusicGalleryContent/MusicGalleryContentController.js'
                    //                ]
                    //            }
                    //            ]);
                    //        }
                    //    ]
                    //}

                })
                //-----FormBuilder Module-----
                .state('index.formbuilderform', {
                    url: "/formbuilderform",
                    templateUrl: "cpanelv1/ModuleFormBuilder/FormBuilderForm/grid.html",
                    controller: "formController",
                    controllerAs: "form",
                    data: {
                        pageTitle: 'مدیریت فرم ها'
                    },
                    ncyBreadcrumb: {
                        label: 'فرم های من'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'treeControl', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleFormBuilder/FormBuilderForm/formBuilderFormController.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.formbuilderformsubmit', {
                    url: "/formbuilderformsubmit",
                    params: {
                        FormBuilderId: null
                    },
                    templateUrl: "cpanelv1/ModuleFormBuilder/FormBuilderFormSubmit/grid.html",
                    controller: "formBuilderFormSubmitController",
                    controllerAs: "value",
                    data: {
                        pageTitle: 'بارگذاری فرم'
                    },
                    ncyBreadcrumb: {
                        label: 'بارگذاری فرم'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    serie: false,
                                    files: [
                                        'cpanelv1/ModuleFormBuilder/FormBuilderFormSubmit/formBuilderFormSubmitController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })

                //-----End of Module FormBuilder-----
                //-----Module LinkManagement-----
                .state('index.linkmanagementdashboard', {
                    url: "/linkmanagementdashboard",
                    templateUrl: "cpanelv1/ModuleLinkManagement/LinkManagementdashboard/dashboard.html",
                    controller: "linkManagementdashboardController",
                    controllerAs: "linkManagementdashboard",
                    data: {
                        pageTitle: 'داشبورد تبادل لینک'
                    },
                    ncyBreadcrumb: {
                        label: 'تبادل لینک'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleLinkManagement/LinkManagementdashboard/LinkManagementdashboardController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.linkmanagementcreatecampaign', {
                    url: "/linkmanagementcreatecampaign",
                    templateUrl: "cpanelv1/ModuleLinkManagement/LinkManagementCerateCampaign/CreateCampaign1.html",
                    controller: "linkManagementCreateCampaignController",
                    controllerAs: "linkManagementCreateCampaign",
                    data: {
                        pageTitle: 'کمپین های جاری'
                    },
                    ncyBreadcrumb: {
                        label: 'کمپین های جاری'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleLinkManagement/LinkManagementCerateCampaign/LinkManagementCreateCampaignController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                /* .state('index.sharinglink', {
                     url: "/sharinglink",
                     templateUrl: "cpanelv1/ModuleLinkManagement/SharingLink/grid.html",
                     controller: "sharingLinkController",
                     controllerAs: "sharingLink",
                     data: { pageTitle: 'مدیریت تبادل لینک' },
                     ncyBreadcrumb: {
                         label: 'تبادل لینک'
                     },
                     resolve: {
                         deps: [
                             '$ocLazyLoad',
                             function ($ocLazyLoad) {
                                 return $ocLazyLoad.load([
                                     'ngJsTree', 'summernote', {
                                         serie: false,
                                         files: [
                                             'cpanelv1/ModuleLinkManagement/SharingLink/sharingLink.js'
                                         ]
                                     }
                                 ]);
                             }
                         ]
                     }
                 })
                 .state('index.sharinglinkusing', {
                     url: "/sharinglinkusing",
                     templateUrl: "cpanelv1/ModuleLinkManagement/SharingUsing/grid.html",
                     controller: "sharingUsingController",
                     controllerAs: "sharingUsing",
                     data: { pageTitle: 'مدیریت تبادل لینک' },
                     ncyBreadcrumb: {
                         label: 'تبادل لینک'
                     },
                     resolve: {
                         deps: [
                             '$ocLazyLoad',
                             function ($ocLazyLoad) {
                                 return $ocLazyLoad.load({
                                     serie: false,
                                     files: [
                                         'cpanelv1/ModuleLinkManagement/SharingUsing/sharingUsing.js'
                                     ]
                                 });
                             }
                         ]
                     }
                 })
                 .state('index.sharinglinklog', {
                     url: "/sharinglinklog",
                     templateUrl: "cpanelv1/ModuleLinkManagement/SharingLog/grid.html",
                     controller: "sharingLogController",
                     controllerAs: "sharingLog",
                     data: { pageTitle: 'مدیریت تبادل لینک' },
                     ncyBreadcrumb: {
                         label: 'تبادل لینک'
                     },
                     resolve: {
                         deps: [
                             '$ocLazyLoad',
                             function ($ocLazyLoad) {
                                 return $ocLazyLoad.load([
                                     'ngJsTree', 'summernote', {
                                         serie: false,
                                         files: [
                                             'cpanelv1/ModuleLinkManagement/SharingLog/sharingLog.js'
                                         ]
                                     }
                                 ]);
                             }
                         ]
                     }
                 })*/
                //-----Ticketing Module-----
                .state('index.ticketingtask', {
                    url: "/ticketingtask",
                    params: {
                        Unreadticket: false
                    },
                    templateUrl: "cpanelv1/ModuleTicketing/TicketingTask/grid.html",
                    controller: "ticketingTaskController",
                    controllerAs: "ticketingTask",
                    data: {
                        pageTitle: 'مدیریت تیکت ها'
                    },
                    ncyBreadcrumb: {
                        label: 'مدیریت تیکت ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleTicketing/TicketingTask/TicketingTask.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.ticketinganswer', {
                    url: "/ticketinganswer",
                    templateUrl: "cpanelv1/ModuleTicketing/TicketingAnswer/grid.html",
                    controller: "ticketingAnswerController",
                    controllerAs: "ticketingAnswer",
                    data: {
                        pageTitle: 'پاسخ ها'
                    },
                    ncyBreadcrumb: {
                        label: 'پاسخ ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleTicketing/TicketingAnswer.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.ticketingdepartemen', {
                    url: "/ticketingdepartemen",
                    templateUrl: "cpanelv1/ModuleTicketing/TicketingDepartemen/grid.html",
                    controller: "ticketingDepartemenController",
                    controllerAs: "ticketingDepartemen",
                    data: {
                        pageTitle: 'مدیریت بخش ها'
                    },
                    ncyBreadcrumb: {
                        label: 'مدیریت بخش ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'summernote', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleTicketing/TicketingDepartemen/TicketingDepartemen.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.ticketingfaq', {
                    url: "/ticketingfaq",
                    templateUrl: "cpanelv1/ModuleTicketing/TicketingFaq/grid.html",
                    controller: "ticketingFaqController",
                    controllerAs: "ticketingFaq",
                    data: {
                        pageTitle: 'سوالات متداول'
                    },
                    ncyBreadcrumb: {
                        label: 'سوالات متداول'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleTicketing/TicketingFaq/TicketingFaq.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                //-----UniversalMenu Module-----
                .state('index.universalmenuplatform', {
                    url: "/universalmenuplatform",
                    templateUrl: "cpanelv1/ModuleUniversalMenu/UniversalMenuPlatform/grid.html",
                    controller: "platformGridController",
                    controllerAs: "platformCtrl",
                    data: {
                        pageTitle: 'پلتفرم ها'
                    },
                    ncyBreadcrumb: {
                        label: 'پلتفرم ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleUniversalMenu/UniversalMenuPlatform/UniversalMenuPlatformController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.universalmenuprocesses', {
                    url: "/universalmenuprocesses",
                    templateUrl: "cpanelv1/ModuleUniversalMenu/UniversalMenuProcesses/grid.html",
                    controller: "processGridController",
                    controllerAs: "processCtrl",
                    data: {
                        pageTitle: 'عملیات ها'
                    },
                    ncyBreadcrumb: {
                        label: 'عملیات ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'treeControl', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleUniversalMenu/UniversalMenuProcesses/UniversalMenuProcessesController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.universalmenumenuitem', {
                    url: "/universalmenumenuitem",
                    templateUrl: "cpanelv1/ModuleUniversalMenu/UniversalMenuMenuItem/grid.html",
                    controller: "menuItemGridController",
                    controllerAs: "menuItemCtrl",
                    data: {
                        pageTitle: 'موارد منو'
                    },
                    ncyBreadcrumb: {
                        label: 'موارد منو'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'treeControl', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleUniversalMenu/UniversalMenuMenuItem/UniversalMenuMenuItemController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.universalmenusession', {
                    url: "/universalmenusession",
                    templateUrl: "cpanelv1/ModuleUniversalMenu/UniversalMenuSession/grid.html",
                    controller: "sessionGridController",
                    controllerAs: "sessionCtrl",
                    data: {
                        pageTitle: 'نشست ها'
                    },
                    ncyBreadcrumb: {
                        label: 'نشست ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleUniversalMenu/UniversalMenuSession/UniversalMenuSessionController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.universalmenuinputlog', {
                    url: "/universalmenuinputlog",
                    templateUrl: "cpanelv1/ModuleUniversalMenu/UniversalMenuInputLog/grid.html",
                    controller: "inputLogGridController",
                    controllerAs: "inputLogCtrl",
                    data: {
                        pageTitle: 'نشست ها'
                    },
                    ncyBreadcrumb: {
                        label: 'نشست ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleUniversalMenu/UniversalMenuInputLog/UniversalMenuInputLogController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.universalmenuoutputlog', {
                    url: "/universalmenuoutputlog",
                    templateUrl: "cpanelv1/ModuleUniversalMenu/UniversalMenuOutpluLog/grid.html",
                    controller: "outputLogGridController",
                    controllerAs: "outputLogCtrl",
                    data: {
                        pageTitle: 'نشست ها'
                    },
                    ncyBreadcrumb: {
                        label: 'نشست ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleUniversalMenu/UniversalMenuOutpluLog/UniversalMenuOutpluLogController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                //-----ApiTelegram Module-----
                .state('index.apitelegrambotconfig', {
                    url: "/apitelegrambotconfig",
                    templateUrl: "cpanelv1/ModuleApiTelegram/ApiTelegramBotConfig/grid.html",
                    controller: "botConfigGridController",
                    controllerAs: "botConfigCtrl",
                    data: {
                        pageTitle: 'بات ها'
                    },
                    ncyBreadcrumb: {
                        label: 'بات ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'treeControl', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleApiTelegram/ApiTelegramBotConfig/ApiTelegramBotConfigController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.apitelegramloginput', {
                    url: "/loginput",
                    templateUrl: "cpanelv1/ModuleApiTelegram/ApiTelegramLogInput/grid.html",
                    controller: "logInputGridController",
                    controllerAs: "logInputCtrl",
                    data: {
                        pageTitle: 'گزارش پیام های ورودی'
                    },
                    ncyBreadcrumb: {
                        label: 'گزارش پیام های ورودی'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    'treeControl', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleApiTelegram/ApiTelegramLogInput/ApiTelegramLogInputController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.apitelegramlogoutput', {
                    url: "/logoutput",
                    templateUrl: "cpanelv1/ModuleApiTelegram/ApiTelegramLogOutput/grid.html",
                    controller: "logOutputGridController",
                    controllerAs: "logOutputCtrl",
                    data: {
                        pageTitle: 'گزارش پیام های خروجی'
                    },
                    ncyBreadcrumb: {
                        label: 'گزارش پیام های خروجی'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleApiTelegram/ApiTelegramLogOutput/ApiTelegramLogOutputController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.apitelegramuploadedfiles', {
                    url: "/apitelegramuploadedfiles",
                    templateUrl: "cpanelv1/ModuleApiTelegram/ApiTelegramUploadedFiles/grid.html",
                    controller: "UploadedFilesController",
                    controllerAs: "uploadedFiles",
                    data: {
                        pageTitle: 'فایل های آپلود شده'
                    },
                    ncyBreadcrumb: {
                        label: 'فایل های آپلود شده'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleApiTelegram/ApiTelegramUploadedFiles/ApiTelegramUploadedFilesController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.apitelegramreceivedfiles', {
                    url: "/apitelegramuploadedfiles",
                    templateUrl: "cpanelv1/ModuleApiTelegram/ApiTelegramReceivedFiles/grid.html",
                    controller: "ReceivedFilesController",
                    controllerAs: "ReceivedFiles",
                    data: {
                        pageTitle: 'فایل های دریافتی'
                    },
                    ncyBreadcrumb: {
                        label: 'فایل های دریافتی'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    serie: false,
                                    files: [
                                        'cpanelv1/ModuleApiTelegram/ApiTelegramReceivedFiles/ApiTelegramReceivedFilesController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state('index.apitelegrambotusertype', {
                    url: "/apitelegrambotusertype",
                    templateUrl: "cpanelv1/ModuleApiTelegram/ApiTelegramBotUserType/grid.html",
                    controller: "botUserTypeController",
                    controllerAs: "botUserType",
                    data: {
                        pageTitle: 'انواع کاربران'
                    },
                    ncyBreadcrumb: {
                        label: 'فایل های آپلود شده'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'nouislider', 'minicolors', 'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleApiTelegram/ApiTelegramBotUserType/ApiTelegramBotUserTypeController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.apitelegrambotuser', {
                    url: "/apitelegrambotuser",
                    templateUrl: "cpanelv1/ModuleApiTelegram/ApiTelegramBotUser/grid.html",
                    controller: "botUserController",
                    controllerAs: "botUser",
                    data: {
                        pageTitle: 'کاربران'
                    },
                    ncyBreadcrumb: {
                        label: 'کاربران ربات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'nouislider', 'minicolors', 'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleApiTelegram/ApiTelegramBotUser/ApiTelegramBotUserController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.apitelegrammemberinfo', {
                    url: "/apitelegrammemberinfo",
                    templateUrl: "cpanelv1/ModuleApiTelegram/ApiTelegramMemberInfo/grid.html",
                    controller: "memberInfoController",
                    controllerAs: "memberInfo",
                    data: {
                        pageTitle: 'کاربران'
                    },
                    ncyBreadcrumb: {
                        label: 'کاربران ربات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'nouislider', 'minicolors', 'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleApiTelegram/ApiTelegramMemberInfo/ApiTelegramMemberInfoController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
            
                //-----Reservation Module-----
                .state('index.reservationcontent', {
                    url: "/reservationcontent",
                    params: {
                        ContentId: null,
                        TitleTag: null
                    },
                    templateUrl: "cpanelv1/Modulereservation/reservationContent/grid.html",
                    controller: "reservationContentController",
                    controllerAs: "reservationContent",
                    data: {
                        pageTitle: 'محتوای رزرواسیون'
                    },
                    ncyBreadcrumb: {
                        label: 'محتوای رزرواسیون'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", "treeControl", 'ADM-dateTimePicker', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/Modulereservation/reservationContent/reservationContent.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.reservationcomment', {
                    url: "/reservationcomment",
                    templateUrl: "cpanelv1/Modulereservation/reservationComment/grid.html",
                    controller: "reservationCommentCtrl",
                    controllerAs: "reservationComment",
                    data: {
                        pageTitle: 'رزرواسیون-کامنت'
                    },
                    ncyBreadcrumb: {
                        label: 'کامنت رزرواسیون'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    serie: false,
                                    files: [
                                        'cpanelv1/Modulereservation/reservationComment/reservationComment.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state('index.reservationappointmentdate', {
                    url: "/reservationappointmentdate",
                    params: {
                        ContentId: null
                    },
                    templateUrl: "cpanelv1/ModuleReservation/ReservationAppointmentDate/grid.html",
                    controller: "reservationAppDateController",
                    controllerAs: "appDate",
                    data: {
                        pageTitle: 'اعلام رزرواسیون'
                    },
                    ncyBreadcrumb: {
                        label: 'اعلام رزرواسیون'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: true,
                                        files: [
                                            'cpanelv1/ModuleReservation/ReservationAppointmentDate/ReservationAppointmentDateController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.reservationappointmentdatedetail', {
                    url: "/reservationappointmentdatedetail",
                    templateUrl: "cpanelv1/ModuleReservation/ReservationAppointmentDateDetail/grid.html",
                    controller: "reservationAppointmentDateDetailController",
                    controllerAs: "appDateDetail",
                    data: {
                        pageTitle: 'اعلام روز'
                    },
                    ncyBreadcrumb: {
                        label: 'جزییات اعلام روز'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'nouislider', 'minicolors', 'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleReservation/ReservationAppointmentDateDetail/ReservationAppointmentDateDetailController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.reservationorder', {
                    url: "/reservationorder",
                    params: {
                        AppointmentDateDetailId: null,
                        AppointmentDateId: null,
                        ServiceId: null
                    },
                    templateUrl: "cpanelv1/ModuleReservation/ReservationOrder/grid.html",
                    controller: "reservationOrderController",
                    controllerAs: "order",
                    data: {
                        pageTitle: 'سفارش'
                    },
                    ncyBreadcrumb: {
                        label: 'سفارش'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'nouislider', 'minicolors', 'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleReservation/ReservationOrder/ReservationOrderController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.reservationplace', {
                    url: "/reservationplace",
                    params: {
                        AppointmentDateDetailId: null,
                        AppointmentDateId: null,
                        ServiceId: null
                    },
                    templateUrl: "cpanelv1/ModuleReservation/Reservationplace/grid.html",
                    controller: "reservationplaceController",
                    controllerAs: "place",
                    data: {
                        pageTitle: 'مکان'
                    },
                    ncyBreadcrumb: {
                        label: 'مکان'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'nouislider', 'minicolors', 'angucomplete-alt', 'angular.drag.resize', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleReservation/Reservationplace/ReservationplaceController.js',
                                            //'cpanelv1/ModuleReservation/Reservationplace/ReservationplaceNtkDragg.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.reservationorderadd', {
                    url: "/reservationorderadd",
                    params: {
                        AppointmentDateDetailId: null,
                        AppointmentDateId: null,
                        ServiceId: null
                    },
                    templateUrl: "cpanelv1/ModuleReservation/ReservationOrderAdd/grid.html",
                    controller: "orderAddCtrl",
                    controllerAs: "orderAdd",
                    data: {
                        pageTitle: 'سفارش'
                    },
                    ncyBreadcrumb: {
                        label: 'سفارش'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'nouislider', 'minicolors', 'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleReservation/ReservationOrderAdd/ReservationOrderAdd.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.reservationservice', {
                    url: "/reservationservice",
                    templateUrl: "cpanelv1/ModuleReservation/ReservationService/grid.html",
                    controller: "reservationServiceController",
                    controllerAs: "reservationService",
                    data: {
                        pageTitle: 'خدمات'
                    },
                    ncyBreadcrumb: {
                        label: 'خدمات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'nouislider', 'minicolors', 'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleReservation/ReservationService/ReservationServiceController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.reservationtag', {
                    url: "/reservationtag",
                    templateUrl: "cpanelv1/ModuleReservation/ReservationTag/grid.html",
                    controller: "reservationTagCtrl",
                    controllerAs: "reservationTag",
                    data: {
                        pageTitle: 'تگهای رزرواسیون'
                    },
                    ncyBreadcrumb: {
                        label: 'تگ رزرواسیون'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleReservation/ReservationTag/ReservationTag.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                //-----Application Module-----
                .state('index.applicationapp', {
                    url: "/applicationapp",
                    templateUrl: "cpanelv1/ModuleApplication/ApplicationApp/grid.html",
                    controller: "applicationAppController",
                    controllerAs: "themeConfig",
                    data: {
                        pageTitle: 'اپلیکشین ها'
                    },
                    ncyBreadcrumb: {
                        label: 'اپلیکشین ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'monospaced.qrcode', 'treeControl', 'minicolors', {
                                        serie: true,
                                        files: [
                                            'cpanelv1/ModuleApplication/ApplicationApp/ApplicationAppController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.applicationsource', {
                    url: "/applicationsource",
                    templateUrl: "cpanelv1/ModuleApplication/ApplicationSource/grid.html",
                    controller: "applicationSourceController",
                    controllerAs: "appSource",
                    data: {
                        pageTitle: 'منابع'
                    },
                    ncyBreadcrumb: {
                        label: 'منابع'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', 'minicolors', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleApplication/ApplicationSource/ApplicationSourceController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.applicationlayout', {
                    url: "/applicationlayout",
                    templateUrl: "cpanelv1/ModuleApplication/ApplicationLayout/grid.html",
                    params: {
                        sourceid: null
                    },
                    controller: "applicationLayoutController",
                    controllerAs: "appLayout",
                    data: {
                        pageTitle: 'نیازمندی صفحات'
                    },
                    ncyBreadcrumb: {
                        label: 'نیازمندی صفحات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'treeControl', 'minicolors', {
                                        serie: true,
                                        files: [
                                            'cpanelv1/ModuleApplication/ApplicationLayout/ApplicationLayoutController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.applicationlayoutvalue', {
                    url: "/applicationlayoutvalue",
                    templateUrl: "cpanelv1/ModuleApplication/ApplicationLayoutValue/grid.html",
                    params: {
                        sourceid: null,
                        appid: null,
                        apptitle: null
                    },
                    controller: "applicationLayoutValueController",
                    controllerAs: "appLayoutValue",
                    data: {
                        pageTitle: 'مقداردهی به صفحات'
                    },
                    ncyBreadcrumb: {
                        label: 'مقداردهی به صفحات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', 'minicolors', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleApplication/ApplicationLayoutValue/ApplicationLayoutValueController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.applicationthemeconfig', {
                    url: "/applicationthemeconfig",
                    templateUrl: "cpanelv1/ModuleApplication/ApplicationThemeConfig/grid.html",
                    controller: "themeConfigController",
                    controllerAs: "themeConfig",
                    data: {
                        pageTitle: 'رنگ بندی'
                    },
                    ncyBreadcrumb: {
                        label: 'رنگ بندی'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'nouislider', 'minicolors', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleApplication/ApplicationThemeConfig/ApplicationThemeConfigController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.applicationmemberinfo', {
                    url: "/applicationmemberinfo",
                    templateUrl: "cpanelv1/ModuleApplication/ApplicationMemberInfo/grid.html",
                    controller: "memberInfoController",
                    controllerAs: "memberInfo",
                    data: {
                        pageTitle: 'کاربران'
                    },
                    ncyBreadcrumb: {
                        label: 'کاربران'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    serie: false,
                                    files: [
                                        'cpanelv1/ModuleApplication/ApplicationMemberInfo/ApplicationMemberInfoController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state('index.applicationintro', {
                    url: "/applicationintro",
                    templateUrl: "cpanelv1/ModuleApplication/ApplicationIntro/grid.html",
                    controller: "applicationIntroController",
                    controllerAs: "applicationIntro",
                    data: {
                        pageTitle: 'راهنما'
                    },
                    ncyBreadcrumb: {
                        label: 'راهنما'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    serie: false,
                                    files: [
                                        'cpanelv1/ModuleApplication/ApplicationIntro/ApplicationIntroController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state('index.applicationlognotification', {
                    url: "/applicationlogNotification",
                    templateUrl: "cpanelv1/ModuleApplication/ApplicationlogNotification/grid.html",
                    controller: "logNotificationController",
                    controllerAs: "logNotification",
                    data: {
                        pageTitle: 'نوتیفیکیشن'
                    },
                    ncyBreadcrumb: {
                        label: 'نوتیفیکیشن'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    serie: false,
                                    files: [
                                        'cpanelv1/ModuleApplication/ApplicationlogNotification/applicationlogNotificationController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                //-----Blog Module-----
                .state('index.blogcontent', {
                    url: "/blogcontent",
                    params: {
                        ContentId: null,
                        TitleTag: null
                    },
                    templateUrl: "cpanelv1/ModuleBlog/BlogContent/grid.html",
                    controller: "blogContentController",
                    controllerAs: "blogContent",
                    data: {
                        pageTitle: 'بلاگ ها'
                    },
                    ncyBreadcrumb: {
                        label: 'بلاگ ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", "treeControl", 'ADM-dateTimePicker', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleBlog/BlogContent/Controller.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }

                })
                .state('index.blogtag', {
                    url: "/blogtag",
                    templateUrl: "cpanelv1/ModuleBlog/BlogTag/grid.html",
                    controller: "blogTagCtrl",
                    controllerAs: "blogTag",
                    data: {
                        pageTitle: 'مقالات - تگ ها'
                    },
                    ncyBreadcrumb: {
                        label: 'تگ ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleBlog/BlogTag/BlogTag.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.blogcomment', {
                    url: "/blogcomment",
                    templateUrl: "cpanelv1/ModuleBlog/BlogComment/grid.html",
                    controller: "blogCommentCtrl",
                    controllerAs: "blogComment",
                    data: {
                        pageTitle: 'مقالات-کامنت'
                    },
                    ncyBreadcrumb: {
                        label: 'کامنت مقالات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleBlog/BlogComment/BlogComment.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                //-----Advertisement Module-----
                .state('index.advertisementcontract', {
                    url: "/advertisementcontract",
                    templateUrl: "cpanelv1/ModuleAdvertisement/AdvertisementContract/grid.html",
                    controller: "advertisementContractController",
                    controllerAs: "advertisementContract",
                    data: {
                        pageTitle: 'ماژول نیازمندی ها | قراردادها'
                    },
                    ncyBreadcrumb: {
                        label: 'قرارداد ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'nouislider', 'minicolors', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleAdvertisement/AdvertisementContract/AdvertisementContractController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.advertisementcontracttype', {
                    url: "/advertisementcontracttype",
                    templateUrl: "cpanelv1/ModuleAdvertisement/AdvertisementContractType/grid.html",
                    controller: "advertisementContractTypeController",
                    controllerAs: "advertisementContractType",
                    data: {
                        pageTitle: 'ماژول نیازمندی ها | نوع آگهی'
                    },
                    ncyBreadcrumb: {
                        label: 'نوع آگهی'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleAdvertisement/AdvertisementContractType/AdvertisementContractTypeController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.advertisementproperty', {
                    url: "/advertisementproperty",
                    templateUrl: "cpanelv1/ModuleAdvertisement/AdvertisementProperty/grid.html",
                    controller: "advertisementPropertyController",
                    controllerAs: "advertisementProperty",
                    data: {
                        pageTitle: 'ماژول نیازمندی ها | مدیریت آگهی ها'
                    },
                    ncyBreadcrumb: {
                        label: 'مدیریت آگهی ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleAdvertisement/AdvertisementProperty/AdvertisementPropertyController.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.advertisementpropertydetail', {
                    url: "/advertisementpropertydetail",
                    params: {
                        propertyParam: null
                    },
                    templateUrl: "cpanelv1/ModuleAdvertisement/AdvertisementPropertyDetail/grid.html",
                    controller: "advertisementPropertyDetailController",
                    controllerAs: "advertisementPropertyDetail",
                    data: {
                        pageTitle: 'ماژول نیازمندی ها | خصوصیات آگهی '
                    },
                    ncyBreadcrumb: {
                        label: 'خصوصیات آگهی'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        //serie: false,
                                        files: [
                                            'cpanelv1/ModuleAdvertisement/AdvertisementPropertyDetail/AdvertisementPropertyDetailController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.advertisementpropertydetailgroup', {
                    url: "/advertisementpropertydetailgroup",
                    templateUrl: "cpanelv1/ModuleAdvertisement/advertisementPropertyDetailGroup/grid.html",
                    controller: "advertisementPropertyDetailGroupController",
                    controllerAs: "advertisementPropertyDetailGroup",
                    data: {
                        pageTitle: 'ماژول نیازمندی ها | گروه بندی خصوصیات'
                    },
                    ncyBreadcrumb: {
                        label: 'ماژول نیازمندی ها | گروه بندی خصوصیات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleAdvertisement/advertisementPropertyDetailGroup/advertisementPropertyDetailGroupController.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.advertisementpropertytype', {
                    url: "/advertisementpropertytype",
                    templateUrl: "cpanelv1/ModuleAdvertisement/AdvertisementPropertyType/grid.html",
                    controller: "advertisementPropertyTypeController",
                    controllerAs: "advertisementPropertyType",
                    data: {
                        pageTitle: 'ماژول نیازمندی ها | نوع آگهی'
                    },
                    ncyBreadcrumb: {
                        label: 'ماژول نیازمندی ها | نوع آگهی'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", "treeControl", {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleAdvertisement/AdvertisementPropertyType/AdvertisementPropertyTypeController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                    //resolve: {
                    //    deps: [
                    //        '$ocLazyLoad',
                    //        function ($ocLazyLoad) {
                    //            return $ocLazyLoad.load([
                    //                'angucomplete-alt',  {
                    //                    serie: false,
                    //                    files: [
                    //                        'cpanelv1/ModuleAdvertisement/AdvertisementPropertyType/AdvertisementPropertyTypeController.js'
                    //                      //  
                    //                       // 
                    //                    ]
                    //                }
                    //            ]);
                    //        }
                    //    ]
                    //}
                })
                .state('index.advertisementpropertyfavorite', {
                    url: "/advertisementpropertyfavorite",
                    templateUrl: "cpanelv1/ModuleAdvertisement/AdvertisementPropertyFavorite/grid.html",
                    controller: "advertisementPropertyFavoriteController",
                    controllerAs: "advertisementPropertyFavorite",
                    data: {
                        pageTitle: 'ماژول نیازمندی ها | آگهی های موردپسند'
                    },
                    ncyBreadcrumb: {
                        label: 'ماژول نیازمندی ها | آگهی های موردپسند'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleAdvertisement/AdvertisementPropertyFavorite/AdvertisementPropertyFavoriteController.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                //-----Chart Module-----
                .state('index.chartcontent', {
                    url: "/chartcontent",
                    params: {
                        ContentId: null,
                        TitleTag: null
                    },
                    templateUrl: "cpanelv1/ModuleChart/ChartContent/grid.html",
                    controller: "chartContentCtrl",
                    controllerAs: "chartContent",
                    data: {
                        pageTitle: 'چارت سازمانی'
                    },
                    ncyBreadcrumb: {
                        label: 'چارت سازمانی'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", "treeControl", 'ADM-dateTimePicker', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleChart/ChartContent/chartContent.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.chartcontentevent', {
                    url: "/chartcontentevent",
                    templateUrl: "cpanelv1/ModuleChart/ChartContentEvent/grid.html",
                    controller: "chartContentEventController",
                    controllerAs: "chartContentEvent",
                    data: {
                        pageTitle: 'رویداد چارت'
                    },
                    ncyBreadcrumb: {
                        label: 'رویداد چارت'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngTagsInput', 'summernote', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleChart/ChartContentEvent/ChartContentEvent.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                //-----Estate Module-----
                .state('index.estatecontract', {
                    url: "/estatecontract",
                    templateUrl: "cpanelv1/ModuleEstate/EstateContract/grid.html",
                    controller: "estateContractController",
                    controllerAs: "estateContract",
                    data: {
                        pageTitle: 'ماژول املاک | آگهی ها'
                    },
                    ncyBreadcrumb: {
                        label: 'آگهی ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'nouislider', 'minicolors', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleEstate/EstateContract/EstateContractController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.estatecontracttype', {
                    url: "/estatecontracttype",
                    templateUrl: "cpanelv1/ModuleEstate/EstateContractType/grid.html",
                    controller: "estateContractTypeController",
                    controllerAs: "estateContractType",
                    data: {
                        pageTitle: 'ماژول املاک | نوع آگهی'
                    },
                    ncyBreadcrumb: {
                        label: 'نوع آگهی'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleEstate/EstateContractType/EstateContractTypeController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.estateproperty', {
                    url: "/estateproperty",
                    templateUrl: "cpanelv1/ModuleEstate/EstateProperty/grid.html",
                    controller: "estatePropertyController",
                    controllerAs: "estateProperty",
                    data: {
                        pageTitle: 'ماژول املاک | مدیریت املاک'
                    },
                    ncyBreadcrumb: {
                        label: 'مدیریت املاک'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleEstate/EstateProperty/EstatePropertyController.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.estatepropertydetail', {
                    url: "/estatepropertydetail",
                    params: {
                        propertyParam: null
                    },
                    templateUrl: "cpanelv1/ModuleEstate/EstatePropertyDetail/grid.html",
                    controller: "estatePropertyDetailController",
                    controllerAs: "estatePropertyDetail",
                    data: {
                        pageTitle: 'ماژول املاک | خصوصیات '
                    },
                    ncyBreadcrumb: {
                        label: 'خصوصیات ملک'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        //serie: false,
                                        files: [
                                            'cpanelv1/ModuleEstate/EstatePropertyDetail/EstatePropertyDetailController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.estatepropertydetailgroup', {
                    url: "/estatepropertydetailgroup",
                    templateUrl: "cpanelv1/ModuleEstate/estatePropertyDetailGroup/grid.html",
                    controller: "estatePropertyDetailGroupController",
                    controllerAs: "estatePropertyDetailGroup",
                    data: {
                        pageTitle: 'ماژول املاک | گروه بندی خصوصیات'
                    },
                    ncyBreadcrumb: {
                        label: 'ماژول املاک | گروه بندی خصوصیات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleEstate/estatePropertyDetailGroup/estatePropertyDetailGroupController.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.estatepropertytype', {
                    url: "/estatepropertytype",
                    templateUrl: "cpanelv1/ModuleEstate/EstatePropertyType/grid.html",
                    controller: "estatePropertyTypeController",
                    controllerAs: "estatePropertyType",
                    data: {
                        pageTitle: 'ماژول املاک | نوع ملک'
                    },
                    ncyBreadcrumb: {
                        label: 'ماژول املاک | نوع ملک'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleEstate/EstatePropertyType/EstatePropertyTypeController.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.estatepropertyfavorite', {
                    url: "/estatepropertyfavorite",
                    templateUrl: "cpanelv1/ModuleEstate/EstatePropertyFavorite/grid.html",
                    controller: "estatePropertyFavoriteController",
                    controllerAs: "estatePropertyFavorite",
                    data: {
                        pageTitle: 'ماژول املاک | نوع ملک'
                    },
                    ncyBreadcrumb: {
                        label: 'ماژول املاک | ملک های موردپسند'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleEstate/EstatePropertyFavorite/EstatePropertyFavoriteController.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                //-----Vehicle Module-----
                .state('index.vehiclecontract', {
                    url: "/vehiclecontract",
                    templateUrl: "cpanelv1/ModuleVehicle/VehicleContract/grid.html",
                    controller: "vehicleContractController",
                    controllerAs: "vehicleContract",
                    data: {
                        pageTitle: 'ماژول آگهی خودرو | آگهی ها'
                    },
                    ncyBreadcrumb: {
                        label: 'آگهی ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'nouislider', 'minicolors', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleVehicle/VehicleContract/VehicleContractController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.vehiclecontracttype', {
                    url: "/vehiclecontracttype",
                    templateUrl: "cpanelv1/ModuleVehicle/VehicleContractType/grid.html",
                    controller: "vehicleContractTypeController",
                    controllerAs: "vehicleContractType",
                    data: {
                        pageTitle: 'ماژول آگهی خودرو | نوع آگهی'
                    },
                    ncyBreadcrumb: {
                        label: 'نوع آگهی'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleVehicle/VehicleContractType/VehicleContractTypeController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.vehicleproperty', {
                    url: "/vehicleproperty",
                    templateUrl: "cpanelv1/ModuleVehicle/VehicleProperty/grid.html",
                    controller: "vehiclePropertyController",
                    controllerAs: "vehicleProperty",
                    data: {
                        pageTitle: 'ماژول آگهی خودرو | مدیریت آگهی ها'
                    },
                    ncyBreadcrumb: {
                        label: 'مدیریت آگهی ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleVehicle/VehicleProperty/VehiclePropertyController.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.vehiclepropertydetail', {
                    url: "/vehiclepropertydetail",
                    params: {
                        propertyParam: null
                    },
                    templateUrl: "cpanelv1/ModuleVehicle/VehiclePropertyDetail/grid.html",
                    controller: "vehiclePropertyDetailController",
                    controllerAs: "vehiclePropertyDetail",
                    data: {
                        pageTitle: 'ماژول آگهی خودرو | خصوصیات '
                    },
                    ncyBreadcrumb: {
                        label: 'خصوصیات خودرو'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        //serie: false,
                                        files: [
                                            'cpanelv1/ModuleVehicle/VehiclePropertyDetail/VehiclePropertyDetailController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.vehiclepropertydetailgroup', {
                    url: "/vehiclepropertydetailgroup",
                    templateUrl: "cpanelv1/ModuleVehicle/vehiclePropertyDetailGroup/grid.html",
                    controller: "vehiclePropertyDetailGroupController",
                    controllerAs: "vehiclePropertyDetailGroup",
                    data: {
                        pageTitle: 'ماژول آگهی خودرو | گروه بندی خصوصیات'
                    },
                    ncyBreadcrumb: {
                        label: 'ماژول آگهی خودرو | گروه بندی خصوصیات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleVehicle/vehiclePropertyDetailGroup/vehiclePropertyDetailGroupController.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.vehiclepropertytype', {
                    url: "/vehiclepropertytype",
                    templateUrl: "cpanelv1/ModuleVehicle/VehiclePropertyType/grid.html",
                    controller: "vehiclePropertyTypeController",
                    controllerAs: "vehiclePropertyType",
                    data: {
                        pageTitle: 'ماژول آگهی خودرو | نوع خودرو'
                    },
                    ncyBreadcrumb: {
                        label: 'ماژول املاک | نوع خودرو'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleVehicle/VehiclePropertyType/VehiclePropertyTypeController.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.vehiclepropertyfavorite', {
                    url: "/vehiclepropertyfavorite",
                    templateUrl: "cpanelv1/ModuleVehicle/VehiclePropertyFavorite/grid.html",
                    controller: "vehiclePropertyFavoriteController",
                    controllerAs: "vehiclePropertyFavorite",
                    data: {
                        pageTitle: 'ماژول آگهی خودرو | نوع خودرو'
                    },
                    ncyBreadcrumb: {
                        label: 'ماژول املاک | خودرو های موردپسند'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleVehicle/VehiclePropertyFavorite/VehiclePropertyFavoriteController.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                //-----Job Module-----
                .state('index.jobcontract', {
                    url: "/jobcontract",
                    templateUrl: "cpanelv1/ModuleJob/JobContract/grid.html",
                    controller: "jobContractController",
                    controllerAs: "jobContract",
                    data: {
                        pageTitle: 'ماژول مشاغل | قراردادها'
                    },
                    ncyBreadcrumb: {
                        label: 'قراردادها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'nouislider', 'minicolors', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleJob/JobContract/JobContractController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.jobcontracttype', {
                    url: "/jobcontracttype",
                    templateUrl: "cpanelv1/ModuleJob/JobContractType/grid.html",
                    controller: "jobContractTypeController",
                    controllerAs: "jobContractType",
                    data: {
                        pageTitle: 'ماژول مشاغل | نوع قرارداد'
                    },
                    ncyBreadcrumb: {
                        label: 'نوع قرارداد'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleJob/JobContractType/JobContractTypeController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.jobproperty', {
                    url: "/jobproperty",
                    templateUrl: "cpanelv1/ModuleJob/JobProperty/grid.html",
                    controller: "jobPropertyController",
                    controllerAs: "jobProperty",
                    data: {
                        pageTitle: 'ماژول مشاغل | مدیریت متقاضیان'
                    },
                    ncyBreadcrumb: {
                        label: 'مدیریت متقاضیان'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleJob/JobProperty/JobPropertyController.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.jobpropertydetail', {
                    url: "/jobpropertydetail",
                    params: {
                        propertyParam: null
                    },
                    templateUrl: "cpanelv1/ModuleJob/JobPropertyDetail/grid.html",
                    controller: "jobPropertyDetailController",
                    controllerAs: "jobPropertyDetail",
                    data: {
                        pageTitle: 'ماژول مشاغل | خصوصیات '
                    },
                    ncyBreadcrumb: {
                        label: 'خصوصیات متقاضی'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        //serie: false,
                                        files: [
                                            'cpanelv1/ModuleJob/JobPropertyDetail/JobPropertyDetailController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.jobpropertydetailgroup', {
                    url: "/jobpropertydetailgroup",
                    templateUrl: "cpanelv1/ModuleJob/jobPropertyDetailGroup/grid.html",
                    controller: "jobPropertyDetailGroupController",
                    controllerAs: "jobPropertyDetailGroup",
                    data: {
                        pageTitle: 'ماژول مشاغل | گروه بندی خصوصیات'
                    },
                    ncyBreadcrumb: {
                        label: 'ماژول مشاغل | گروه بندی خصوصیات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleJob/jobPropertyDetailGroup/jobPropertyDetailGroupController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.jobpropertytype', {
                    url: "/jobpropertytype",
                    templateUrl: "cpanelv1/ModuleJob/JobPropertyType/grid.html",
                    controller: "jobPropertyTypeController",
                    controllerAs: "jobPropertyType",
                    data: {
                        pageTitle: 'ماژول مشاغل | نوع متقاضی'
                    },
                    ncyBreadcrumb: {
                        label: 'ماژول مشاغل | نوع متقاضی'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleJob/JobPropertyType/JobPropertyTypeController.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.jobposition', {
                    url: "/jobposition",
                    templateUrl: "cpanelv1/ModuleJob/JobPosition/grid.html",
                    controller: "jobPositionController",
                    controllerAs: "jobPosition",
                    data: {
                        pageTitle: 'ماژول مشاغل | نوع متقاضی'
                    },
                    ncyBreadcrumb: {
                        label: 'ماژول مشاغل | نوع متقاضی'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    serie: false,
                                    files: [
                                        'cpanelv1/ModuleJob/JobPosition/JobPositionController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state('index.jobcertificate', {
                    url: "/jobcertificate",
                    templateUrl: "cpanelv1/ModuleJob/JobCertificate/grid.html",
                    controller: "jobCertificateController",
                    controllerAs: "jobCertificate",
                    data: {
                        pageTitle: 'ماژول مشاغل | نوع متقاضی'
                    },
                    ncyBreadcrumb: {
                        label: 'ماژول مشاغل | نوع متقاضی'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    serie: false,
                                    files: [
                                        'cpanelv1/ModuleJob/JobCertificate/JobCertificateController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                //-----Database Module-----
                .state('index.dbcontent', {
                    url: "/dbcontent",
                    templateUrl: "cpanelv1/ModuleDatabase/DatabaseContent/grid.html",
                    controller: "dbContentCtrl",
                    controllerAs: "dbContent",
                    data: {
                        pageTitle: 'بلاگ ها'
                    },
                    ncyBreadcrumb: {
                        label: 'بلاگ ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleDatabase/DatabaseContent/DatabaseContents.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                //-----Module Product-----
                .state('index.productcontent', {
                    url: "/productcontent",
                    params: {
                        ContentId: null,
                        TitleTag: null
                    },
                    templateUrl: "cpanelv1/ModuleProduct/ProductContent/grid.html",
                    controller: "productContentController",
                    controllerAs: "productContent",
                    data: {
                        pageTitle: 'محصولات- محتوا'
                    },
                    ncyBreadcrumb: {
                        label: 'محتوای محصولات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", "treeControl", 'ADM-dateTimePicker', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleProduct/ProductContent/Controller.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                    //resolve: {
                    //    deps: [
                    //        '$ocLazyLoad',
                    //        function ($ocLazyLoad) {
                    //            return $ocLazyLoad.load(["ngTagsInput", "summernote", {
                    //                //serie: true,
                    //                files: [
                    //                    'cpanelv1/ModuleProduct/ProductContent/ProductContents.js'

                    //                ]
                    //            }
                    //            ]);
                    //        }
                    //    ]
                    //}
                })
                .state('index.productcontentother', {
                    url: "/productcontentother",
                    templateUrl: "cpanelv1/ModuleProduct/ProductContentOther/grid.html",
                    controller: "ProductContentOtherCtrl",
                    controllerAs: "ProductContentOther",
                    data: {
                        pageTitle: 'محصولات-دسته بندی'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleProduct/ProductContentOther/ProductContentOther.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.productcontenttag', {
                    url: "/productcontenttag",
                    templateUrl: "cpanelv1/ModuleProduct/ProductContentTag/grid.html",
                    controller: "ProductContentTagCtrl",
                    controllerAs: "ProductContentTag",
                    data: {
                        pageTitle: 'محصولات-دسته بندی'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleProduct/ProductContentTag/ProductContentTag.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.productsharesettingcat', {
                    url: "/productsharesettingcat",
                    templateUrl: "cpanelv1/ModuleProduct/ProductShareSettingCat/grid.html",
                    controller: "ProducthareSettingcatCtrl",
                    controllerAs: "ProducthareSettingcat",
                    data: {
                        pageTitle: 'محصولات-دسته بندی'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleProduct/ProductShareSettingCat/ProducthareSettingCat.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.productssharesetting', {
                    url: "/productssharesetting",
                    templateUrl: "cpanelv1/ModuleProduct/ProductShareSetting/grid.html",
                    controller: "productshareSettingCtrl",
                    controllerAs: "productshareSetting",
                    data: {
                        pageTitle: 'محصولات-تنظیمات اشتراک گذاری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleProduct/ProductShareSetting/ProducthareSetting.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.productsharing', {
                    url: "/productsharing",
                    templateUrl: "cpanelv1/ModuleProduct/ProductSharing/grid.html",
                    controller: "productSharingCtrl",
                    controllerAs: "productSharing",
                    data: {
                        pageTitle: 'محصولات-دسته بندی'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleProduct/ProductSharing/ProductSharing.js'
                                            //  
                                            //  
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.producttag', {
                    url: "/producttag",
                    templateUrl: "cpanelv1/ModuleProduct/ProductTag/grid.html",
                    controller: "productContentController",
                    controllerAs: "productContent",
                    data: {
                        pageTitle: 'محصولات-دسته بندی'
                    },
                    ncyBreadcrumb: {
                        label: 'تگ ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleProduct/ProductTag/ProductTag.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                //-----Quote Module-----
                .state('index.quotecontent', {
                    url: "/quotecontent",
                    templateUrl: "cpanelv1/ModuleQuote/QuoteContent/grid.html",
                    controller: "quoteContentCtrl",
                    controllerAs: "quoteContent",
                    data: {
                        pageTitle: 'کلام روز'
                    },
                    ncyBreadcrumb: {
                        label: 'کلام روز'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", "treeControl", 'ADM-dateTimePicker', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleQuote/QuoteContent/quoteContents.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                //-----Service Module-----
                .state('index.servicetag', {
                    url: "/servicetag",
                    templateUrl: "cpanelv1/ModuleService/ServiceTag/grid.html",
                    controller: "serviceContentController",
                    controllerAs: "serviceContent",
                    data: {
                        pageTitle: 'خدمات - تگ ها'
                    },
                    ncyBreadcrumb: {
                        label: 'تگ ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'angucomplete-alt', {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleService/ServiceTag/serviceTag.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.servicecontent', {
                    url: "/servicecontent",
                    params: {
                        ContentId: null,
                        TitleTag: null
                    },
                    templateUrl: "cpanelv1/ModuleService/ServiceContent/grid.html",
                    controller: "serviceContentController",
                    controllerAs: "serviceContent",
                    data: {
                        pageTitle: 'خدمات | محتوا'
                    },
                    ncyBreadcrumb: {
                        label: 'محتوای خدمات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", "treeControl", 'ADM-dateTimePicker', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleService/ServiceContent/Controller.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                    //resolve: {
                    //    deps: [
                    //        '$ocLazyLoad',
                    //        function ($ocLazyLoad) {
                    //            return $ocLazyLoad.load(["ngTagsInput", "summernote", {
                    //                //serie: true,
                    //                files: [
                    //                    'cpanelv1/ModuleService/ServiceContent/serviceContents.js'
                    //                ]
                    //            }
                    //            ]);
                    //        }
                    //    ]
                    //}
                })
                //-----Module Member-----
                .state('index.memberuser', {
                    url: "/memberuser",
                    templateUrl: "cpanelv1/ModuleMember/MemberUser/grid.html",
                    controller: "memberUserController",
                    controllerAs: "memberUser",
                    data: {
                        pageTitle: 'مدیریت اعضا'
                    },
                    ncyBreadcrumb: {
                        label: 'مدیریت اعضا'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleMember/MemberUser/memberUserController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })

                .state('index.membergroup', {
                    url: "/membergroup",
                    templateUrl: "cpanelv1/ModuleMember/MemberGroup/grid.html",
                    controller: "memberGroupController",
                    controllerAs: "memberGroup",
                    data: {
                        pageTitle: 'گروه اعضا'
                    },
                    ncyBreadcrumb: {
                        label: 'گروه اعضا'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleMember/MemberGroup/memberGroupController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                /*.state('index.memberuser',
                    {
                        url: "/memberuser",
                        templateUrl: "cpanelv1/ModuleMember/MemberUser/grid.html",
                        controller: "memberUserController",
                        controllerAs: "memberUser",
                        data: { pageTitle: 'اعضا' },
                        ncyBreadcrumb: {
                            label: 'اعضا'
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                         {
                                            serie: false,
                                            files: [
                                                'cpanelv1/ModuleMember/MemberUser/memberUserController.js'
                                            ]
                                        }
                                    ]);
                                }
                            ]
                        }
                    })
                .state('index.memberusergroup',
                    {
                        url: "/memberusergroup",
                        templateUrl: "cpanelv1/ModuleMember/MemberUserGroup/grid.html",
                        controller: "memberUserGroupController",
                        controllerAs: "memberUserGroup",
                        data: { pageTitle: 'اعضا در گروه' },
                        ncyBreadcrumb: {
                            label: 'اعضا در گروه'
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        {
                                            serie: false,
                                            files: [
                                                'cpanelv1/ModuleMember/MemberUserGroup/memberUserGroupController.js'
                                            ]
                                        }
                                    ]);
                                }
                            ]
                        }
                    })*/
                .state('index.memberproperty', {
                    url: "/memberproperty",
                    templateUrl: "cpanelv1/ModuleMember/MemberProperty/grid.html",
                    params: {
                        memberuserId: null
                    },
                    controller: "memberPropertyController",
                    controllerAs: "memberProperty",
                    data: {
                        pageTitle: 'ماژول اشخاص | مدیریت پرونده'
                    },
                    ncyBreadcrumb: {
                        label: 'مدیریت پرونده'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleMember/MemberProperty/MemberPropertyController.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.memberpropertydetail', {
                    url: "/memberpropertydetail",
                    params: {
                        propertyParam: null
                    },
                    templateUrl: "cpanelv1/ModuleMember/MemberPropertyDetail/grid.html",
                    controller: "memberPropertyDetailController",
                    controllerAs: "memberPropertyDetail",
                    data: {
                        pageTitle: 'ماژول اشخاص | خصوصیات '
                    },
                    ncyBreadcrumb: {
                        label: 'خصوصیات پرونده'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        //serie: false,
                                        files: [
                                            'cpanelv1/ModuleMember/MemberPropertyDetail/MemberPropertyDetailController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.memberpropertydetailgroup', {
                    url: "/memberpropertydetailgroup",
                    templateUrl: "cpanelv1/ModuleMember/memberPropertyDetailGroup/grid.html",
                    controller: "memberPropertyDetailGroupController",
                    controllerAs: "memberPropertyDetailGroup",
                    data: {
                        pageTitle: 'ماژول اشخاص | گروه بندی خصوصیات'
                    },
                    ncyBreadcrumb: {
                        label: 'ماژول اشخاص | گروه بندی خصوصیات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleMember/memberPropertyDetailGroup/memberPropertyDetailGroupController.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.memberpropertytype', {
                    url: "/memberpropertytype",
                    templateUrl: "cpanelv1/ModuleMember/MemberPropertyType/grid.html",
                    controller: "memberPropertyTypeController",
                    controllerAs: "memberPropertyType",
                    data: {
                        pageTitle: 'ماژول املاک | نوع ملک'
                    },
                    ncyBreadcrumb: {
                        label: 'ماژول املاک | نوع ملک'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleMember/MemberPropertyType/MemberPropertyTypeController.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.memberpropertytypesite', {
                    url: "/memberpropertytypesite",
                    templateUrl: "cpanelv1/ModuleMember/MemberPropertyTypeSite/grid.html",
                    controller: "memberPropertyTypeSiteController",
                    controllerAs: "memberPropertyTypeSite",
                    data: {
                        pageTitle: 'ماژول اشخاص | دسترسی '
                    },
                    ncyBreadcrumb: {
                        label: 'ماژول اشخاص | دسترسی'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleMember/MemberPropertyTypeSite/MemberPropertyTypeSiteController.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                //-----Module object-----
                .state('index.objectuser', {
                    url: "/objectuser",
                    templateUrl: "cpanelv1/Moduleobject/objectUser/grid.html",
                    controller: "objectUserController",
                    controllerAs: "objectUser",
                    data: {
                        pageTitle: 'مدیریت اشیا'
                    },
                    ncyBreadcrumb: {
                        label: 'مدیریت اشیا'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/Moduleobject/objectUser/objectUserController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.objectgroup', {
                    url: "/objectgroup",
                    templateUrl: "cpanelv1/Moduleobject/objectGroup/grid.html",
                    controller: "objectGroupController",
                    controllerAs: "objectGroup",
                    data: {
                        pageTitle: 'گروه اشیا'
                    },
                    ncyBreadcrumb: {
                        label: 'گروه اشیا'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/Moduleobject/objectGroup/objectGroupController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.objectproperty', {
                    url: "/objectproperty",
                    templateUrl: "cpanelv1/Moduleobject/objectProperty/grid.html",
                    params: {
                        objectuserId: null
                    },
                    controller: "objectPropertyController",
                    controllerAs: "objectProperty",
                    data: {
                        pageTitle: 'مدیریت پرونده'
                    },
                    ncyBreadcrumb: {
                        label: 'مدیریت پرونده'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/Moduleobject/objectProperty/objectPropertyController.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.objectpropertydetail', {
                    url: "/objectpropertydetail",
                    params: {
                        propertyParam: null
                    },
                    templateUrl: "cpanelv1/Moduleobject/objectPropertyDetail/grid.html",
                    controller: "objectPropertyDetailController",
                    controllerAs: "objectPropertyDetail",
                    data: {
                        pageTitle: 'خصوصیات اشیا '
                    },
                    ncyBreadcrumb: {
                        label: 'خصوصیات اشیا'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        //serie: false,
                                        files: [
                                            'cpanelv1/Moduleobject/objectPropertyDetail/objectPropertyDetailController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.objectpropertydetailgroup', {
                    url: "/objectpropertydetailgroup",
                    templateUrl: "cpanelv1/Moduleobject/objectPropertyDetailGroup/grid.html",
                    controller: "objectPropertyDetailGroupController",
                    controllerAs: "objectPropertyDetailGroup",
                    data: {
                        pageTitle: 'ماژول اشیا | گروه بندی خصوصیات'
                    },
                    ncyBreadcrumb: {
                        label: 'ماژول اشیا | گروه بندی خصوصیات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/Moduleobject/objectPropertyDetailGroup/objectPropertyDetailGroupController.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.objectpropertytype', {
                    url: "/objectpropertytype",
                    templateUrl: "cpanelv1/Moduleobject/objectPropertyType/grid.html",
                    controller: "objectPropertyTypeController",
                    controllerAs: "objectPropertyType",
                    data: {
                        pageTitle: 'ماژول اشیا | نوع اشیا'
                    },
                    ncyBreadcrumb: {
                        label: 'ماژول اشیا | نوع اشیا'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/Moduleobject/objectPropertyType/objectPropertyTypeController.js'
                                            //  
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                //-----Shop Module-----
                .state('index.shoptag', {
                    url: "/shoptag",
                    templateUrl: "cpanelv1/ModuleShop/ShopTag/grid.html",
                    controller: "shopTagCtrl",
                    controllerAs: "shopTag",
                    data: {
                        pageTitle: 'تگهای فروشگاه'
                    },
                    ncyBreadcrumb: {
                        label: 'تگ فروشگاه'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleShop/ShopTag/ShopTag.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state("index.shopcontent", {
                    url: "/shopcontent",
                    params: {
                        ContentId: null,
                        TitleTag: null
                    },
                    templateUrl: "cpanelv1/ModuleShop/ShopContent/grid.html",
                    controller: "shopContentController",
                    controllerAs: "shopContent",
                    data: {
                        pageTitle: "دسته بندی کالا ها"
                    },
                    ncyBreadcrumb: {
                        label: 'دسته بندی کالا ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", "treeControl", 'ADM-dateTimePicker', {
                                        serie: true,
                                        files: [
                                            'cpanelv1/ModuleShop/ShopContent/shopContentController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state("index.shopinvoicesale", {
                    url: "/shopinvoicesale",
                    params: {
                        PaymentInvoseSale: true
                    },
                    templateUrl: "cpanelv1/ModuleShop/ShopInvoiceSale/grid.html",
                    controller: "shopInvoiceSaleController",
                    controllerAs: "shopInvoiceSale",
                    data: {
                        pageTitle: "فاکتور فروش"
                    },
                    ncyBreadcrumb: {
                        label: 'مدیریت فاکتورها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: true,
                                        files: [
                                            'cpanelv1/ModuleShop/ShopInvoiceSale/shopInvoiceSaleController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state("index.shopcart", {
                    url: "/shopcart",
                    params: {
                        PaymentInvoseSale: true
                    },
                    templateUrl: "cpanelv1/ModuleShop/shopCart/grid.html",
                    controller: "shopCartController",
                    controllerAs: "shopCart",
                    data: {
                        pageTitle: "سبد فروش"
                    },
                    ncyBreadcrumb: {
                        label: 'مدیریت سبدها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: true,
                                        files: [
                                            'cpanelv1/ModuleShop/shopCart/shopCartController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state("index.shopnewinvoicesaledetail", {
                    url: "/shopnewinvoicesaledetail",
                    params: {
                        invoiceId: 0
                    },
                    templateUrl: "cpanelv1/ModuleShop/ShopInvoiceSaleDetail/grid.html",
                    controller: "shopInvoiceSaleDetailController",
                    controllerAs: "shopInvoiceSaleDetail",
                    data: {
                        pageTitle: "فاکتور جدید"
                    },
                    ncyBreadcrumb: {
                        label: 'فاکتور جدید'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: true,
                                        files: [
                                            'cpanelv1/ModuleShop/ShopInvoiceSaleDetail/shopInvoiceSaleDetailController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state("index.shopinvoicesaledetail", {
                    url: "/shopinvoicesaledetail",
                    params: {
                        invoiceId: 0
                    },
                    templateUrl: "cpanelv1/ModuleShop/ShopInvoiceSaleDetail/grid.html",
                    controller: "shopInvoiceSaleDetailController",
                    controllerAs: "shopInvoiceSaleDetail",
                    data: {
                        pageTitle: "فاکتور جدید"
                    },
                    ncyBreadcrumb: {
                        label: 'فاکتور جدید'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: true,
                                        files: [
                                            'cpanelv1/ModuleShop/ShopInvoiceSaleDetail/shopInvoiceSaleDetailController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state("index.shopproductcombine", {
                    url: "/shopproductcombine",
                    templateUrl: "cpanelv1/ModuleShop/ShopProductCombine/grid.html",
                    controller: "shopProductCombineController",
                    controllerAs: "shopCombine",
                    data: {
                        pageTitle: "کالای ترکیبی"
                    },
                    ncyBreadcrumb: {
                        label: 'دسته بندی کالا ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleShop/ShopProductCombine/shopProductCombineController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state("index.shopproductitem", {
                    url: "/shopproductitem",
                    templateUrl: "cpanelv1/ModuleShop/ShopProductItem/grid.html",
                    controller: "shopProductItemController",
                    controllerAs: "shopItem",
                    data: {
                        pageTitle: "اجناس"
                    },
                    ncyBreadcrumb: {
                        label: 'دسته بندی کالا ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleShop/ShopProductItem/shopProductItemController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state("index.shopproductprocess", {
                    url: "/shopproductprocess",
                    templateUrl: "cpanelv1/ModuleShop/ShopProductProcess/grid.html",
                    controller: "shopProductProcessController",
                    controllerAs: "shopProcess",
                    data: {
                        pageTitle: "فعّالیت"
                    },
                    ncyBreadcrumb: {
                        label: 'دسته بندی کالا ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleShop/ShopProductProcess/shopProductProcessController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.shopproductservice", {
                    url: "/shopproductservice",
                    templateUrl: "cpanelv1/ModuleShop/ShopProductService/grid.html",
                    controller: "shopProductServiceController",
                    controllerAs: "shopService",
                    data: {
                        pageTitle: "خدمات"
                    },
                    ncyBreadcrumb: {
                        label: 'دسته بندی کالا ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleShop/ShopProductService/shopProductServiceController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.shopproductsaleprice", {
                    url: "/shopproductsaleprice",
                    templateUrl: "cpanelv1/ModuleShop/ShopProductSalePrice/grid.html",
                    controller: "productSalePriceController",
                    controllerAs: "shopSalePrice",
                    data: {
                        pageTitle: "قیمت اجناس"
                    },
                    ncyBreadcrumb: {
                        label: 'دسته بندی کالا ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleShop/ShopProductSalePrice/shopProductSalePriceController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.shopinvoicesaleworkflow", {
                    url: "/shopinvoicesaleworkflow",
                    templateUrl: "cpanelv1/ModuleShop/shopInvoiceSaleWorkFlow/grid.html",
                    controller: "shopInvoiceSaleWorkFlowController",
                    controllerAs: "shopInvoiceSaleWorkFlow",
                    data: {
                        pageTitle: "shopInvoiceSaleWorkFlow"
                    },
                    ncyBreadcrumb: {
                        label: 'shopInvoiceSaleWorkFlow'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleShop/shopInvoiceSaleWorkFlow/shopInvoiceSaleWorkFlowController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.shopproductfileserial", {
                    url: "/shopproductfileserial",
                    templateUrl: "cpanelv1/ModuleShop/shopProductFileSerial/grid.html",
                    controller: "shopProductFileSerialController",
                    controllerAs: "shopProductFileSerial",
                    data: {
                        pageTitle: "shopProductFileSerial"
                    },
                    ncyBreadcrumb: {
                        label: 'shopProductFileSerial'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleShop/shopProductFileSerial/shopProductFileSerialController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.shopprocesscategory", {
                    url: "/shopprocesscategory",
                    templateUrl: "cpanelv1/ModuleShop/shopProcessCategory/grid.html",
                    controller: "shopProcessCategoryController",
                    controllerAs: "shopProcessCategory",
                    data: {
                        pageTitle: "shopProcessCategory"
                    },
                    ncyBreadcrumb: {
                        label: 'shopProcessCategory'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleShop/shopProcessCategory/shopProcessCategoryController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state('index.shopprocess', {
                    url: "/shopprocess",
                    templateUrl: "cpanelv1/ModuleShop/shopProcess/grid.html",
                    params: {
                        sourceid: null
                    },
                    controller: "shopProcessController",
                    controllerAs: "shopProcess",
                    data: {
                        pageTitle: 'نیازمندی صفحات'
                    },
                    ncyBreadcrumb: {
                        label: 'نیازمندی صفحات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'treeControl', {
                                        serie: true,
                                        files: [
                                            'cpanelv1/ModuleShop/ShopProcess/shopProcessController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.shopprocessvalue', {
                    url: "/shopprocessvalue",
                    templateUrl: "cpanelv1/ModuleShop/ShopProcessValue/grid.html",
                    params: {
                        sourceid: null,
                        appid: null,
                        apptitle: null
                    },
                    controller: "shopProcessValueController",
                    controllerAs: "shopProcessValue",
                    data: {
                        pageTitle: 'مقداردهی به صفحات'
                    },
                    ncyBreadcrumb: {
                        label: 'مقداردهی به صفحات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleShop/ShopProcessValue/ShopProcessValueController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                //---------Parameter--------
                .state("index.articlecontentparametertype", {
                    url: "/articlecontentparametertype",
                    templateUrl: "cpanelv1/Modulearticle/articleContentParameterType/grid.html",
                    controller: "articleContentParameterTypeController",
                    controllerAs: "articleContentParameterType",
                    data: {
                        pageTitle: "نوع پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'نوع پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Modulearticle/articleContentParameterType/articleContentParameterTypeController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.articlecontentparameter", {
                    url: "/articlecontentparameter",
                    templateUrl: "cpanelv1/Modulearticle/articleContentParameter/grid.html",
                    controller: "articleContentParameterController",
                    controllerAs: "articleContentParameter",
                    data: {
                        pageTitle: "پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Modulearticle/articleContentParameter/articleContentParameterController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.articlecontentandparametervalue", {
                    url: "/articlecontentandparametervalue",
                    templateUrl: "cpanelv1/Modulearticle/articleContentAndParameterValue/grid.html",
                    controller: "articleContentAndParameterValueController",
                    controllerAs: "articleContentAndParameterValue",
                    data: {
                        pageTitle: "مقدار پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'مقدار پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Modulearticle/articleContentAndParameterValue/articleContentAndParameterValueController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.blogcontentparametertype", {
                    url: "/blogcontentparametertype",
                    templateUrl: "cpanelv1/Moduleblog/blogContentParameterType/grid.html",
                    controller: "blogContentParameterTypeController",
                    controllerAs: "blogContentParameterType",
                    data: {
                        pageTitle: "نوع پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'نوع پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Moduleblog/blogContentParameterType/blogContentParameterTypeController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.blogcontentparameter", {
                    url: "/blogcontentparameter",
                    templateUrl: "cpanelv1/Moduleblog/blogContentParameter/grid.html",
                    controller: "blogContentParameterController",
                    controllerAs: "blogContentParameter",
                    data: {
                        pageTitle: "پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Moduleblog/blogContentParameter/blogContentParameterController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.blogcontentandparametervalue", {
                    url: "/blogcontentandparametervalue",
                    templateUrl: "cpanelv1/Moduleblog/blogContentAndParameterValue/grid.html",
                    controller: "blogContentAndParameterValueController",
                    controllerAs: "blogContentAndParameterValue",
                    data: {
                        pageTitle: "مقدار پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'مقدار پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Moduleblog/blogContentAndParameterValue/blogContentAndParameterValueController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.biographycontentparametertype", {
                    url: "/biographycontentparametertype",
                    templateUrl: "cpanelv1/Modulebiography/biographyContentParameterType/grid.html",
                    controller: "biographyContentParameterTypeController",
                    controllerAs: "biographyContentParameterType",
                    data: {
                        pageTitle: "نوع پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'نوع پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Modulebiography/biographyContentParameterType/biographyContentParameterTypeController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.biographycontentparameter", {
                    url: "/biographycontentparameter",
                    templateUrl: "cpanelv1/Modulebiography/biographyContentParameter/grid.html",
                    controller: "biographyContentParameterController",
                    controllerAs: "biographyContentParameter",
                    data: {
                        pageTitle: "پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Modulebiography/biographyContentParameter/biographyContentParameterController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.biographycontentandparametervalue", {
                    url: "/biographycontentandparametervalue",
                    templateUrl: "cpanelv1/Modulebiography/biographyContentAndParameterValue/grid.html",
                    controller: "biographyContentAndParameterValueController",
                    controllerAs: "biographyContentAndParameterValue",
                    data: {
                        pageTitle: "مقدار پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'مقدار پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Modulebiography/biographyContentAndParameterValue/biographyContentAndParameterValueController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.chartcontentparametertype", {
                    url: "/chartcontentparametertype",
                    templateUrl: "cpanelv1/Modulechart/chartContentParameterType/grid.html",
                    controller: "chartContentParameterTypeController",
                    controllerAs: "chartContentParameterType",
                    data: {
                        pageTitle: "نوع پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'نوع پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Modulechart/chartContentParameterType/chartContentParameterTypeController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.chartcontentparameter", {
                    url: "/chartcontentparameter",
                    templateUrl: "cpanelv1/Modulechart/chartContentParameter/grid.html",
                    controller: "chartContentParameterController",
                    controllerAs: "chartContentParameter",
                    data: {
                        pageTitle: "پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Modulechart/chartContentParameter/chartContentParameterController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.chartcontentandparametervalue", {
                    url: "/chartcontentandparametervalue",
                    templateUrl: "cpanelv1/Modulechart/chartContentAndParameterValue/grid.html",
                    controller: "chartContentAndParameterValueController",
                    controllerAs: "chartContentAndParameterValue",
                    data: {
                        pageTitle: "مقدار پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'مقدار پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Modulechart/chartContentAndParameterValue/chartContentAndParameterValueController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.campaigncontentparametertype", {
                    url: "/campaigncontentparametertype",
                    templateUrl: "cpanelv1/Modulecampaign/campaignContentParameterType/grid.html",
                    controller: "campaignContentParameterTypeController",
                    controllerAs: "campaignContentParameterType",
                    data: {
                        pageTitle: "نوع پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'نوع پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Modulecampaign/campaignContentParameterType/campaignContentParameterTypeController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.campaigncontentparameter", {
                    url: "/campaigncontentparameter",
                    templateUrl: "cpanelv1/Modulecampaign/campaignContentParameter/grid.html",
                    controller: "campaignContentParameterController",
                    controllerAs: "campaignContentParameter",
                    data: {
                        pageTitle: "پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Modulecampaign/campaignContentParameter/campaignContentParameterController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.campaigncontentandparametervalue", {
                    url: "/campaigncontentandparametervalue",
                    templateUrl: "cpanelv1/Modulecampaign/campaignContentAndParameterValue/grid.html",
                    controller: "campaignContentAndParameterValueController",
                    controllerAs: "campaignContentAndParameterValue",
                    data: {
                        pageTitle: "مقدار پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'مقدار پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Modulecampaign/campaignContentAndParameterValue/campaignContentAndParameterValueController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.newscontentparametertype", {
                    url: "/newscontentparametertype",
                    templateUrl: "cpanelv1/Modulenews/newsContentParameterType/grid.html",
                    controller: "newsContentParameterTypeController",
                    controllerAs: "newsContentParameterType",
                    data: {
                        pageTitle: "نوع پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'نوع پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Modulenews/newsContentParameterType/newsContentParameterTypeController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.newscontentparameter", {
                    url: "/newscontentparameter",
                    templateUrl: "cpanelv1/Modulenews/newsContentParameter/grid.html",
                    controller: "newsContentParameterController",
                    controllerAs: "newsContentParameter",
                    data: {
                        pageTitle: "پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Modulenews/newsContentParameter/newsContentParameterController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.newscontentandparametervalue", {
                    url: "/newscontentandparametervalue",
                    templateUrl: "cpanelv1/Modulenews/newsContentAndParameterValue/grid.html",
                    controller: "newsContentAndParameterValueController",
                    controllerAs: "newsContentAndParameterValue",
                    data: {
                        pageTitle: "مقدار پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'مقدار پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Modulenews/newsContentAndParameterValue/newsContentAndParameterValueController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.pollingcontentparametertype", {
                    url: "/pollingcontentparametertype",
                    templateUrl: "cpanelv1/Modulepolling/pollingContentParameterType/grid.html",
                    controller: "pollingContentParameterTypeController",
                    controllerAs: "pollingContentParameterType",
                    data: {
                        pageTitle: "نوع پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'نوع پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Modulepolling/pollingContentParameterType/pollingContentParameterTypeController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.pollingcontentparameter", {
                    url: "/pollingcontentparameter",
                    templateUrl: "cpanelv1/Modulepolling/pollingContentParameter/grid.html",
                    controller: "pollingContentParameterController",
                    controllerAs: "pollingContentParameter",
                    data: {
                        pageTitle: "پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Modulepolling/pollingContentParameter/pollingContentParameterController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.pollingcontentandparametervalue", {
                    url: "/pollingcontentandparametervalue",
                    templateUrl: "cpanelv1/Modulepolling/pollingContentAndParameterValue/grid.html",
                    controller: "pollingContentAndParameterValueController",
                    controllerAs: "pollingContentAndParameterValue",
                    data: {
                        pageTitle: "مقدار پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'مقدار پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Modulepolling/pollingContentAndParameterValue/pollingContentAndParameterValueController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.productcontentparametertype", {
                    url: "/productcontentparametertype",
                    templateUrl: "cpanelv1/Moduleproduct/productContentParameterType/grid.html",
                    controller: "productContentParameterTypeController",
                    controllerAs: "productContentParameterType",
                    data: {
                        pageTitle: "نوع پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'نوع پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Moduleproduct/productContentParameterType/productContentParameterTypeController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.productcontentparameter", {
                    url: "/productcontentparameter",
                    templateUrl: "cpanelv1/Moduleproduct/productContentParameter/grid.html",
                    controller: "productContentParameterController",
                    controllerAs: "productContentParameter",
                    data: {
                        pageTitle: "پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Moduleproduct/productContentParameter/productContentParameterController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.productcontentandparametervalue", {
                    url: "/productcontentandparametervalue",
                    templateUrl: "cpanelv1/Moduleproduct/productContentAndParameterValue/grid.html",
                    controller: "productContentAndParameterValueController",
                    controllerAs: "productContentAndParameterValue",
                    data: {
                        pageTitle: "مقدار پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'مقدار پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Moduleproduct/productContentAndParameterValue/productContentAndParameterValueController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.quotecontentparametertype", {
                    url: "/quotecontentparametertype",
                    templateUrl: "cpanelv1/Modulequote/quoteContentParameterType/grid.html",
                    controller: "quoteContentParameterTypeController",
                    controllerAs: "quoteContentParameterType",
                    data: {
                        pageTitle: "نوع پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'نوع پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Modulequote/quoteContentParameterType/quoteContentParameterTypeController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.quotecontentparameter", {
                    url: "/quotecontentparameter",
                    templateUrl: "cpanelv1/Modulequote/quoteContentParameter/grid.html",
                    controller: "quoteContentParameterController",
                    controllerAs: "quoteContentParameter",
                    data: {
                        pageTitle: "پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Modulequote/quoteContentParameter/quoteContentParameterController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.quotecontentandparametervalue", {
                    url: "/quotecontentandparametervalue",
                    templateUrl: "cpanelv1/Modulequote/quoteContentAndParameterValue/grid.html",
                    controller: "quoteContentAndParameterValueController",
                    controllerAs: "quoteContentAndParameterValue",
                    data: {
                        pageTitle: "مقدار پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'مقدار پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Modulequote/quoteContentAndParameterValue/quoteContentAndParameterValueController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.servicecontentparametertype", {
                    url: "/servicecontentparametertype",
                    templateUrl: "cpanelv1/Moduleservice/serviceContentParameterType/grid.html",
                    controller: "serviceContentParameterTypeController",
                    controllerAs: "serviceContentParameterType",
                    data: {
                        pageTitle: "نوع پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'نوع پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Moduleservice/serviceContentParameterType/serviceContentParameterTypeController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.servicecontentparameter", {
                    url: "/servicecontentparameter",
                    templateUrl: "cpanelv1/Moduleservice/serviceContentParameter/grid.html",
                    controller: "serviceContentParameterController",
                    controllerAs: "serviceContentParameter",
                    data: {
                        pageTitle: "پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Moduleservice/serviceContentParameter/serviceContentParameterController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index. ", {
                    url: "/servicecontentandparametervalue",
                    templateUrl: "cpanelv1/Moduleservice/serviceContentAndParameterValue/grid.html",
                    controller: "serviceContentAndParameterValueController",
                    controllerAs: "serviceContentAndParameterValue",
                    data: {
                        pageTitle: "مقدار پارامتر"
                    },
                    ncyBreadcrumb: {
                        label: 'مقدار پارامتر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/Moduleservice/serviceContentAndParameterValue/serviceContentAndParameterValueController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                //-----SiteAccounting Module-----
                .state("index.siteaccountingdocument", {
                    url: "/siteaccountingdocument",
                    templateUrl: "cpanelv1/ModuleSiteAccounting/SiteAccountingDocument/grid.html",
                    controller: "siteSccountingDocumentController",
                    controllerAs: "siteAccDocument",
                    data: {
                        pageTitle: "دسته بندی کالا ها"
                    },
                    ncyBreadcrumb: {
                        label: 'دسته بندی کالا ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleSiteAccounting/SiteAccountingDocument/siteAccountingDocumentController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.siteaccountingdocumentdetail", {
                    url: "/siteaccountingdocumentdetail",
                    templateUrl: "cpanelv1/ModuleSiteAccounting/SiteAccountingDocumentDetail/grid.html",
                    controller: "siteAccountingDocumentDetailController",
                    controllerAs: "siteAccDocumentDetail",
                    data: {
                        pageTitle: "فاکتور فروش"
                    },
                    ncyBreadcrumb: {
                        label: 'مدیریت فاکتورها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleSiteAccounting/SiteAccountingDocumentDetail/siteAccountingDocumentDetailController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state("index.siteaccountingdocumentdetailtype", {
                    url: "/siteaccountingdocumentdetailtype",
                    params: {
                        invoiceId: 0
                    },
                    templateUrl: "cpanelv1/ModuleSiteAccounting/SiteAccountingDocumentDetailType/grid.html",
                    controller: "siteAccountingDocumentDetailTypeController",
                    controllerAs: "siteAccDocumentDetailType",
                    data: {
                        pageTitle: "فاکتور جدید"
                    },
                    ncyBreadcrumb: {
                        label: 'فاکتور جدید'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleSiteAccounting/SiteAccountingDocumentDetailType/siteAccountingDocumentDetailTypeController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                //-----BankPayment Module-----
                .state("index.bankpaymentprivatesiteconfig", {
                    url: "/bankpaymentprivatesiteconfig",
                    templateUrl: "cpanelv1/ModuleBankPayment/BankPaymentPrivateSiteConfig/grid.html",
                    params: {
                        publicConfigId: null
                    },
                    controller: "bankPaymentPrivateSiteConfigController",
                    controllerAs: "privateSiteConfig",
                    data: {
                        pageTitle: "تنظیمات سایت"
                    },
                    ncyBreadcrumb: {
                        label: 'تنظیمات سایت'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    //'ngSanitize',
                                    {
                                        serie: true,
                                        files: [
                                            'cpanelv1/ModuleBankPayment/BankPaymentPrivateSiteConfig/bankPaymentPrivateSiteConfig.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state("index.bankpaymentpublicconfig", {
                    url: "/bankpaymentpublicconfig",
                    templateUrl: "cpanelv1/ModuleBankPayment/BankPaymentPublicConfig/grid.html",
                    controller: "bankPaymentPublicConfigController",
                    controllerAs: "publicConfig",
                    data: {
                        pageTitle: "تنظیمات"
                    },
                    ncyBreadcrumb: {
                        label: 'تنظیمات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'treeControl', {
                                        serie: true,
                                        files: [
                                            'cpanelv1/ModuleBankPayment/BankPaymentPublicConfig/bankPaymentPublicConfig.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state("index.bankpaymenttransc", {
                    url: "/bankpaymenttransc",
                    templateUrl: "cpanelv1/ModuleBankPayment/BankPaymentTransaction/grid.html",
                    controller: "bankPaymentTranscController",
                    controllerAs: "transc",
                    params: {
                        privateSiteConfigId: null,
                        transactionId: 0
                    },
                    data: {
                        pageTitle: "تراکنش ها"
                    },
                    ncyBreadcrumb: {
                        label: 'تراکنش ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleBankPayment/BankPaymentTransaction/bankPaymentTransaction.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state("index.bankpaymenttransclog", {
                    url: "/bankpaymenttransclog",
                    templateUrl: "cpanelv1/ModuleBankPayment/BankPaymentTransactionLog/grid.html",
                    controller: "bankPaymentTranscLogController",
                    controllerAs: "trancsLog",
                    data: {
                        pageTitle: "جزییات تراکنش ها"
                    },
                    ncyBreadcrumb: {
                        label: 'جزییات تراکنش ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleBankPayment/BankPaymentTransactionLog/bankPaymentTransactionLog.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                //-----Email Module-----
                .state("index.emailoutboxcontent", {
                    url: "/emailoutboxcontent",
                    templateUrl: "cpanelv1/ModuleEmail/EmailOutBoxContent/grid.html",
                    controller: "emailOutBoxContentCtrl",
                    controllerAs: "emailOutBoxContent",
                    data: {
                        pageTitle: "تنظیمات سایت"
                    },
                    ncyBreadcrumb: {
                        label: 'تنظیمات سایت'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    //'ngSanitize',
                                    {
                                        serie: true,
                                        files: [
                                            'cpanelv1/ModuleEmail/EmailOutBoxContent/emailOutBoxContent.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state("index.emailapipathcompany", {
                    url: "/emailapipathcompany",
                    templateUrl: "cpanelv1/ModuleEmail/EmailApiPathCompany/grid.html",
                    controller: "emailapipathcompanyCtrl",
                    controllerAs: "emailapipathcompany",
                    data: {
                        pageTitle: "تنظیمات شرکت"
                    },
                    ncyBreadcrumb: {
                        label: 'تنظیمات شرکت'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    //'ngSanitize',
                                    {
                                        serie: true,
                                        files: [
                                            'cpanelv1/ModuleEmail/EmailApiPathCompany/EmailApiPathCompany.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state("index.emailapipathpriceservice", {
                    url: "/emailapipathpriceservice",
                    templateUrl: "cpanelv1/ModuleEmail/EmailApiPathPriceService/grid.html",
                    params: {
                        PrivateSiteConfigId: null
                    },
                    controller: "emailapipathpriceserviceCtrl",
                    controllerAs: "emailapipathpriceservice",
                    data: {
                        pageTitle: "قیمت شرکت"
                    },
                    ncyBreadcrumb: {
                        label: 'قیمت شرکت'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    //'ngSanitize',
                                    {
                                        serie: true,
                                        files: [
                                            'cpanelv1/ModuleEmail/EmailApiPathPriceService/EmailApiPathPriceService.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state("index.emailoutboxreciver", {
                    url: "/emailoutboxreciver",
                    templateUrl: "cpanelv1/ModuleEmail/EmailOutBoxReciver/grid.html",
                    params: {
                        OutBoxContentId: null
                    },
                    controller: "emailOutBoxReciverController",
                    controllerAs: "emailOutBoxReciver",
                    data: {
                        pageTitle: "تنظیمات سایت"
                    },
                    ncyBreadcrumb: {
                        label: 'تنظیمات سایت'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    //'ngSanitize',
                                    {
                                        serie: true,
                                        files: [
                                            'cpanelv1/ModuleEmail/EmailOutBoxReciver/emailOutBoxReciver.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state("index.emailoutboxreciverlock", {
                    url: "/emailoutboxreciverlock",
                    templateUrl: "cpanelv1/ModuleEmail/EmailOutBoxReciverLock/grid.html",
                    controller: "emailOutBoxReciverLockController",
                    controllerAs: "emailOutBoxReciverLock",
                    data: {
                        pageTitle: "تنظیمات سایت"
                    },
                    ncyBreadcrumb: {
                        label: 'تنظیمات سایت'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    //'ngSanitize',
                                    {
                                        serie: true,
                                        files: [
                                            'cpanelv1/ModuleEmail/EmailOutBoxReciverLock/EmailOutBoxReciverLock.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state("index.emailprivatesiteconfig", {
                    url: "/emailprivatesiteconfig",
                    templateUrl: "cpanelv1/ModuleEmail/EmailPrivateSiteConfig/grid.html",
                    params: {
                        publicConfigId: null
                    },
                    controller: "emailPrivateSiteConfigCtrl",
                    controllerAs: "emailPrivateSiteConfig",
                    data: {
                        pageTitle: "تنظیمات سایت"
                    },
                    ncyBreadcrumb: {
                        label: 'تنظیمات سایت'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "summernote",
                                    //'ngSanitize',
                                    {
                                        serie: true,
                                        files: [
                                            'cpanelv1/ModuleEmail/EmailPrivateSiteConfig/emailPrivateSiteConfig.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state("index.emailpublicconfig", {
                    url: "/emailpublicconfig",
                    templateUrl: "cpanelv1/ModuleEmail/EmailPublicConfig/grid.html",
                    controller: "emailPublicConfigCtrl",
                    controllerAs: "emailPublicConfig",
                    data: {
                        pageTitle: "تنظیمات"
                    },
                    ncyBreadcrumb: {
                        label: 'تنظیمات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'treeControl', {
                                        serie: true,
                                        files: [
                                            'cpanelv1/ModuleEmail/EmailPublicConfig/emailPublicConfig.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state("index.emailprocesstask", {
                    url: "/emailprocesstask",
                    templateUrl: "cpanelv1/ModuleEmail/EmailProcessTask/grid.html",
                    controller: "emailProcessTaskCtrl",
                    controllerAs: "emailProcessTask",
                    params: {
                        privateSiteConfigId: null
                    },
                    data: {
                        pageTitle: "تراکنش ها"
                    },
                    ncyBreadcrumb: {
                        label: 'تراکنش ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleEmail/EmailProcessTask/emailProcessTask.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state("index.emailprocesstasklog", {
                    url: "/emailprocesstasklog",
                    templateUrl: "cpanelv1/ModuleEmail/EmailProcessTaskLog/grid.html",
                    controller: "emailProcessTaskLogCtrl",
                    controllerAs: "emailProcessTaskLog",
                    data: {
                        pageTitle: "جزییات تراکنش ها"
                    },
                    ncyBreadcrumb: {
                        label: 'جزییات تراکنش ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleEmail/EmailProcessTaskLog/emailProcessTaskLog.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                //-----Module TaskScheduler-----
                .state('index.taskschedulerprocesscategory', {
                    url: "/taskschedulerprocesscategory",
                    templateUrl: "cpanelv1/ModuleTaskScheduler/TaskSchedulerProcessCategory/grid.html",
                    controller: "taskSchedulerProcessCategoryController",
                    controllerAs: "taskSchedulerProcessCategory",
                    data: {
                        pageTitle: 'منابع'
                    },
                    ncyBreadcrumb: {
                        label: 'منابع'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleTaskScheduler/TaskSchedulerProcessCategory/TaskSchedulerProcessCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.taskschedulerprocess', {
                    url: "/taskschedulerprocess",
                    templateUrl: "cpanelv1/ModuleTaskScheduler/TaskSchedulerProcess/grid.html",
                    params: {
                        sourceid: null
                    },
                    controller: "taskSchedulerProcessController",
                    controllerAs: "taskSchedulerProcess",
                    data: {
                        pageTitle: 'نیازمندی صفحات'
                    },
                    ncyBreadcrumb: {
                        label: 'نیازمندی صفحات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'treeControl', {
                                        serie: true,
                                        files: [
                                            'cpanelv1/ModuleTaskScheduler/TaskSchedulerProcess/TaskSchedulerProcessController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.taskschedulerprocessvalue', {
                    url: "/taskschedulerprocessvalue",
                    templateUrl: "cpanelv1/ModuleTaskScheduler/TaskSchedulerProcessValue/grid.html",
                    params: {
                        sourceid: null,
                        appid: null,
                        apptitle: null
                    },
                    controller: "taskSchedulerProcessValueController",
                    controllerAs: "taskSchedulerProcessValue",
                    data: {
                        pageTitle: 'مقداردهی به صفحات'
                    },
                    ncyBreadcrumb: {
                        label: 'مقداردهی به صفحات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'angucomplete-alt', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleTaskScheduler/TaskSchedulerProcessValue/TaskSchedulerProcessValueController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state("index.taskscheduleschedule", {
                    url: "/taskscheduleschedule",
                    templateUrl: "cpanelv1/ModuleTaskScheduler/TaskSchedulerSchedule/grid.html",
                    controller: "scheduleController",
                    controllerAs: "schedule",
                    data: {
                        pageTitle: "دسته بندی کالا ها"
                    },
                    ncyBreadcrumb: {
                        label: 'دسته بندی کالا ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleTaskScheduler/TaskSchedulerSchedule/taskSchedulerScheduleController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                .state("index.taskscheduletask", {
                    url: "/taskscheduletask",
                    templateUrl: "cpanelv1/ModuleTaskScheduler/TaskSchedulerTask/grid.html",
                    controller: "taskscheduleTaskController",
                    controllerAs: "task",
                    data: {
                        pageTitle: "task"
                    },
                    ncyBreadcrumb: {
                        label: 'task'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleTaskScheduler/TaskSchedulerTask/taskSchedulerTaskController.js'
                                    ]
                                });
                            }
                        ]
                    }
                })
                //-----Module Phonebook-----
                .state('index.phonebookcountry', {
                    url: "/phonebookcountry",
                    templateUrl: "cpanelv1/ModulePhoneBook/phoneBookCountry/grid.html",
                    controller: "phoneBookCountryCtrl",
                    controllerAs: "phoneBookCountry",
                    data: {
                        pageTitle: 'مدیریت کشورها'
                    },
                    ncyBreadcrumb: {
                        label: 'مدیریت کشورها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModulePhoneBook/phoneBookCountry/phoneBookCountryController.js'
                                            // 
                                            //
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.phonebookstate', {
                    url: "/phonebookstate",
                    templateUrl: "cpanelv1/ModulePhoneBook/phoneBookState/grid.html",
                    controller: "phoneBookStateCtrl",
                    controllerAs: "phoneBookState",
                    data: {
                        pageTitle: 'مدیریت استانها'
                    },
                    ncyBreadcrumb: {
                        label: 'مدیریت استانها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModulePhoneBook/phoneBookState/phoneBookStateController.js'
                                            //  
                                            //  
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.phonebookcity', {
                    url: "/phonebookcity",
                    templateUrl: "cpanelv1/ModulePhoneBook/phoneBookCity/grid.html",
                    controller: "phoneBookCityCtrl",
                    controllerAs: "phoneBookCity",
                    data: {
                        pageTitle: 'مدیریت شهرها'
                    },
                    ncyBreadcrumb: {
                        label: 'مدیریت شهرها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModulePhoneBook/phoneBookCity/phoneBookCityController.js'
                                            // 
                                            // 
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.phonebookzone', {
                    url: "/phonebookzone",
                    templateUrl: "cpanelv1/ModulePhoneBook/phoneBookZone/grid.html",
                    controller: "phoneBookZoneCtrl",
                    controllerAs: "phoneBookZone",
                    data: {
                        pageTitle: 'مدیریت مناطق'
                    },
                    ncyBreadcrumb: {
                        label: 'مدیریت مناطق'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModulePhoneBook/phoneBookZone/phoneBookZoneController.js'
                                            //  
                                            //  
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.phonebooktype', {
                    url: "/phonebooktype",
                    templateUrl: "cpanelv1/ModulePhoneBook/phoneBookType/grid.html",
                    controller: "phoneBookTypeCtrl",
                    controllerAs: "phoneBookType",
                    data: {
                        pageTitle: 'نوع دفترچه تلفن'
                    },
                    ncyBreadcrumb: {
                        label: 'نوع دفترچه تلفن'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModulePhoneBook/phoneBookType/phoneBookTypeController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.phonebook', {
                    url: "/phonebook",
                    templateUrl: "cpanelv1/ModulePhoneBook/phoneBook/grid.html",
                    controller: "phoneBookCtrl",
                    controllerAs: "phoneBook",
                    data: {
                        pageTitle: 'دفترچه تلفن'
                    },
                    ncyBreadcrumb: {
                        label: 'دفترچه تلفن'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModulePhoneBook/phoneBook/phoneBookController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.tellnumbertype', {
                    url: "/tellnumbertype",
                    templateUrl: "cpanelv1/ModulePhoneBook/tellNumberType/grid.html",
                    controller: "tellNumberTypeCtrl",
                    controllerAs: "tellNumberType",
                    data: {
                        pageTitle: 'نوع شماره تلفن'
                    },
                    ncyBreadcrumb: {
                        label: 'نوع شماره تلفن'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModulePhoneBook/tellNumberType/tellNumberTypeController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.tellnumber', {
                    url: "/tellnumber",
                    templateUrl: "cpanelv1/ModulePhoneBook/tellNumber/grid.html",
                    controller: "tellNumberCtrl",
                    controllerAs: "tellNumber",
                    data: {
                        pageTitle: 'شماره تلفن'
                    },
                    ncyBreadcrumb: {
                        label: 'شماره تلفن ها'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModulePhoneBook/tellNumber/tellNumberController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.discountgroup', {
                    url: "/discountgroup",
                    templateUrl: "cpanelv1/ModuleDiscount/DiscountGroup/grid.html",
                    controller: "discountGroupController",
                    controllerAs: "discountGroup",
                    data: {
                        pageTitle: 'گروه تخفیفات'
                    },
                    ncyBreadcrumb: {
                        label: 'گروه تخفیفات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleDiscount/DiscountGroup/DiscountGroupController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.discountserialcardflowgroup', {
                    url: "/discountserialcardflowgroup",
                    templateUrl: "cpanelv1/ModuleDiscount/DiscountSerialCardFlowGroup/grid.html",
                    controller: "discountSerialCardFlowGroupController",
                    controllerAs: "discountSerialCardFlowGroup",
                    data: {
                        pageTitle: 'گروه تخفیفات'
                    },
                    ncyBreadcrumb: {
                        label: 'گروه تخفیفات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleDiscount/DiscountSerialCardFlowGroup/discountSerialCardFlowGroupController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.discountsellerpricesetting', {
                    url: "/discountSellerPriceSetting",
                    templateUrl: "cpanelv1/ModuleDiscount/discountSellerPriceSetting/grid.html",
                    controller: "discountSellerPriceSettingController",
                    controllerAs: "discountSellerPriceSetting",
                    data: {
                        pageTitle: 'گروه تخفیفات'
                    },
                    ncyBreadcrumb: {
                        label: 'گروه تخفیفات'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleDiscount/discountSellerPriceSetting/discountSellerPriceSettingController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.discountseller', {
                    url: "/discountseller",
                    templateUrl: "cpanelv1/ModuleDiscount/DiscountSeller/grid.html",
                    controller: "discountSellerController",
                    controllerAs: "discountSeller",
                    data: {
                        pageTitle: 'نمایندگان فروش'
                    },
                    ncyBreadcrumb: {
                        label: 'نمایندگان فروش'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleDiscount/DiscountSeller/DiscountSellerController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.discountserialcard', {
                    url: "/discountserialcard",
                    templateUrl: "cpanelv1/ModuleDiscount/DiscountSerialCard/grid.html",
                    controller: "discountSerialCardController",
                    controllerAs: "discountSerialCard",
                    data: {
                        pageTitle: 'فروش کارت'
                    },
                    ncyBreadcrumb: {
                        label: 'فروش کارت'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleDiscount/DiscountSerialCard/DiscountSerialCardController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.discountoffer', {
                    url: "/discountoffer",
                    templateUrl: "cpanelv1/ModuleDiscount/DiscountOffer/grid.html",
                    controller: "discountOfferController",
                    controllerAs: "discountOffer",
                    data: {
                        pageTitle: 'پیشنهادات تخفیف'
                    },
                    ncyBreadcrumb: {
                        label: 'پیشنهادات تخفیف'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleDiscount/DiscountOffer/DiscountOfferController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.discountofferdetail', {
                    url: "/discountofferdetail",
                    templateUrl: "cpanelv1/ModuleDiscount/DiscountOfferDetail/grid.html",
                    controller: "discountOfferDetailController",
                    controllerAs: "discountOfferDetail",
                    data: {
                        pageTitle: 'جزییات پیشنهاد'
                    },
                    ncyBreadcrumb: {
                        label: 'جزییات پیشنهاد'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleDiscount/DiscountOfferDetail/DiscountOfferDetailController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.campaigndetaillog', {
                    url: "/campaigndetaillog",
                    templateUrl: "cpanelv1/ModuleCampaign/CampaignDetailLog/grid.html",
                    controller: "campaignDetailLogController",
                    controllerAs: "campaignDetailLog",
                    data: {
                        pageTitle: 'اطلاعات کمپ'
                    },
                    ncyBreadcrumb: {
                        label: 'اطلاعات کمپ'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleCampaign/CampaignDetailLog/CampaignDetailLogController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.campaignadmin', {
                    url: "/campaignadmin",
                    templateUrl: "cpanelv1/ModuleCampaign/CampaignAdmin/grid.html",
                    controller: "campaignAdminController",
                    controllerAs: "campaignAdmin",
                    data: {
                        pageTitle: 'مدیر کمپ'
                    },
                    ncyBreadcrumb: {
                        label: 'مدیر کمپ'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleCampaign/CampaignAdmin/CampaignAdminController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.campaigndetail', {
                    url: "/campaigndetail",
                    templateUrl: "cpanelv1/ModuleCampaign/CampaignDetail/grid.html",
                    controller: "campaignDetailController",
                    controllerAs: "campaignDetail",
                    data: {
                        pageTitle: 'اطلاعات کمپ'
                    },
                    ncyBreadcrumb: {
                        label: 'اطلاعات کمپ'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleCampaign/CampaignDetail/CampaignDetailController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.campaigndetailitem', {
                    url: "/campaigndetailitem",
                    templateUrl: "cpanelv1/ModuleCampaign/CampaignDetailItem/grid.html",
                    controller: "campaignDetailItemController",
                    controllerAs: "campaignDetailItem",
                    data: {
                        pageTitle: 'موارد موردنیاز برای کمپ'
                    },
                    ncyBreadcrumb: {
                        label: 'موارد موردنیاز برای کمپ'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleCampaign/CampaignDetailItem/CampaignDetailItemController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.campaigndetailprogram', {
                    url: "/campaigndetailprogram",
                    templateUrl: "cpanelv1/ModuleCampaign/CampaignDetailProgram/grid.html",
                    controller: "campaignDetailProgramController",
                    controllerAs: "campaignDetailProgram",
                    data: {
                        pageTitle: 'برنامه کمپ'
                    },
                    ncyBreadcrumb: {
                        label: 'برنامه کمپ'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleCampaign/CampaignDetailProgram/CampaignDetailProgramController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.campaigndetailproduct', {
                    url: "/campaigndetailproduct",
                    templateUrl: "cpanelv1/ModuleCampaign/CampaignDetailProduct/grid.html",
                    controller: "campaignDetailProductController",
                    controllerAs: "CampaignDetailProduct",
                    data: {
                        pageTitle: 'کالاهای کمپ'
                    },
                    ncyBreadcrumb: {
                        label: 'کالاهای کمپ'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleCampaign/CampaignDetailProduct/CampaignDetailProductController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.campaigndetailmember', {
                    url: "/campaigndetailmember",
                    templateUrl: "cpanelv1/ModuleCampaign/CampaignDetailMember/grid.html",
                    controller: "campaignDetailMemberController",
                    controllerAs: "campaignDetailMember",
                    data: {
                        pageTitle: 'کالاهای کمپ'
                    },
                    ncyBreadcrumb: {
                        label: 'کالاهای کمپ'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleCampaign/CampaignDetailMember/CampaignDetailMemberController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.campaigncontent', {
                    url: "/campaigncontent",
                    templateUrl: "cpanelv1/ModuleCampaign/CampaignContent/grid.html",
                    controller: "campaignContentController",
                    controllerAs: "CampaignContent",
                    data: {
                        pageTitle: 'محتوای کمپ'
                    },
                    ncyBreadcrumb: {
                        label: 'محتوای کمپ'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", "treeControl", 'ADM-dateTimePicker', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleCampaign/CampaignContent/CampaignContent.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.campaignitem', {
                    url: "/campaignitem",
                    templateUrl: "cpanelv1/ModuleCampaign/CampaignItem/grid.html",
                    controller: "campaignItemController",
                    controllerAs: "campaignItem",
                    data: {
                        pageTitle: 'محتوای اخبار'
                    },
                    ncyBreadcrumb: {
                        label: 'محتوای اخبار'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    "ngTagsInput", "summernote", "treeControl", {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleCampaign/CampaignItem/CampaignItem.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                //-----Module LinkManagement-----
                .state('index.linkmanagementmember', {
                    url: "/linkmanagementmember",
                    templateUrl: "cpanelv1/ModuleLinkManagement/LinkManagementMember/grid.html",
                    controller: "linkManagementMemberController",
                    controllerAs: "linkManagementMember",
                    data: {
                        pageTitle: 'عضو'
                    },
                    ncyBreadcrumb: {
                        label: 'عضو'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleLinkManagement/LinkManagementMember/linkManagementMemberController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.linkmanagementmembercontent', {
                    url: "/linkmanagementmembercontent",
                    templateUrl: "cpanelv1/ModuleLinkManagement/LinkManagementMemberContent/grid.html",
                    controller: "linkManagementMemberContentController",
                    controllerAs: "linkManagementMemberContent",
                    data: {
                        pageTitle: 'اطلاعات عضو'
                    },
                    ncyBreadcrumb: {
                        label: 'اطلاعات عضو'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt', "treeControl", 'ADM-dateTimePicker',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleLinkManagement/LinkManagementMemberContent/LinkManagementMemberContentController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.linkmanagementbillboardpattern', {
                    url: "/linkmanagementbillboardpattern",
                    templateUrl: "cpanelv1/ModuleLinkManagement/LinkManagementBillboardPattern/grid.html",
                    controller: "linkManagementBillboardPatternController",
                    controllerAs: "linkManagementBillboardPattern",
                    data: {
                        pageTitle: 'تنظیمات محتوا'
                    },
                    ncyBreadcrumb: {
                        label: 'تنظیمات محتوا'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleLinkManagement/LinkManagementBillboardPattern/LinkManagementBillboardPatternController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.linkmanagementtargetbillboardlog', {
                    url: "/linkmanagementtargetbillboardlog",
                    templateUrl: "cpanelv1/ModuleLinkManagement/LinkManagementTargetBillboardLog/grid.html",
                    params: {
                        TargetId: null,
                        BillboardId: null,
                        BillBoardPatternId: null
                    },
                    controller: "linkManagementTargetBillboardLogController",
                    controllerAs: "linkManagementTargetBillboardLog",
                    data: {
                        pageTitle: 'لاگ عضو'
                    },
                    ncyBreadcrumb: {
                        label: 'لاگ عضو'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleLinkManagement/LinkManagementTargetBillboardLog/LinkManagementTargetBillboardLogController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.linkmanagementtarget', {
                    url: "/linkmanagementtarget",
                    templateUrl: "cpanelv1/ModuleLinkManagement/LinkManagementTarget/grid.html",
                    params: {
                        MemberId: null,
                        BillBoardPatternId: null
                    },
                    controller: "linkManagementTargetController",
                    controllerAs: "linkManagementTarget",
                    data: {
                        pageTitle: 'محتوا تبادل لینک'
                    },
                    ncyBreadcrumb: {
                        label: 'محتوا تبادل لینک'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleLinkManagement/LinkManagementTarget/LinkManagementTargetController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.linkmanagementbillboard', {
                    url: "/linkmanagementbillboard",
                    templateUrl: "cpanelv1/ModuleLinkManagement/LinkManagementBillboard/grid.html",
                    params: {
                        MemberId: null,
                        BillBoardPatternId: null
                    },
                    controller: "linkManagementBillboardController",
                    controllerAs: "linkManagementBillboard",
                    data: {
                        pageTitle: 'بیلبورد'
                    },
                    ncyBreadcrumb: {
                        label: 'بیلبورد'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', "ADM-dateTimePicker",
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleLinkManagement/LinkManagementBillboard/LinkManagementBillboardController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.linkmanagementcomment', {
                    url: "/linkmanagementcomment",
                    templateUrl: "cpanelv1/ModuleLinkManagement/LinkManagementComment/grid.html",
                    controller: "linkManagementCommentController",
                    controllerAs: "linkManagementComment",
                    data: {
                        pageTitle: 'کامنت تبادل لینک'
                    },
                    ncyBreadcrumb: {
                        label: 'کامنت تبادل لینک'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleLinkManagement/LinkManagementComment/LinkManagementCommentController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.linkmanagementaccounting', {
                    url: "/linkmanagementaccounting",
                    templateUrl: "cpanelv1/ModuleLinkManagement/LinkManagementAccounting/grid.html",
                    params: {
                        MemberId: null
                    },
                    controller: "linkManagementAccountingController",
                    controllerAs: "linkManagementAccounting",
                    data: {
                        pageTitle: 'محاسبه تبادل لینک'
                    },
                    ncyBreadcrumb: {
                        label: 'محاسبه تبادل لینک'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleLinkManagement/LinkManagementAccounting/LinkManagementAccountingController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.linkmanagementaccountingdetail', {
                    url: "/linkmanagementaccountingdetail",
                    templateUrl: "cpanelv1/ModuleLinkManagement/LinkManagementAccountingDetail/grid.html",
                    controller: "linkManagementAccountingDetailController",
                    controllerAs: "linkManagementAccountingDetail",
                    data: {
                        pageTitle: 'جزییات محاسبه تبادل لینک'
                    },
                    ncyBreadcrumb: {
                        label: 'جزییات محاسبه تبادل لینک'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleLinkManagement/LinkManagementAccountingDetail/LinkManagementAccountingDetailController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.linkmanagementcontentcategoryfavorite', {
                    url: "/linkmanagementcontentcategoryfavorite",
                    templateUrl: "cpanelv1/ModuleLinkManagement/LinkManagementContentCategoryFavorite/grid.html",
                    controller: "linkManagementContentCategoryFavoriteController",
                    controllerAs: "linkManagementContentCategoryFavorite",
                    data: {
                        pageTitle: 'علاقه مندیها تبادل لینک'
                    },
                    ncyBreadcrumb: {
                        label: 'علاقه مندیها تبادل لینک'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleLinkManagement/LinkManagementContentCategoryFavorite/LinkManagementContentCategoryFavoriteController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.linkmanagementcontentcategoryotherinfo', {
                    url: "/linkmanagementcontentcategoryotherinfo",
                    templateUrl: "cpanelv1/ModuleLinkManagement/LinkManagementContentCategoryOtherInfo/grid.html",
                    controller: "linkManagementContentCategoryOtherInfoController",
                    controllerAs: "linkManagementContentCategoryOtherInfo",
                    data: {
                        pageTitle: 'توضیحات تبادل لینک'
                    },
                    ncyBreadcrumb: {
                        label: 'توضیحات تبادل لینک'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleLinkManagement/LinkManagementContentCategoryOtherInfo/LinkManagementContentCategoryOtherInfoController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.linkmanagementcategorysimilar', {
                    url: "/linkmanagementcategorysimilar",
                    templateUrl: "cpanelv1/ModuleLinkManagement/LinkManagementCategorySimilar/grid.html",
                    controller: "linkManagementCategorySimilarController",
                    controllerAs: "linkManagementCategorySimilar",
                    data: {
                        pageTitle: 'دسته بندی مرتبط تبادل لینک'
                    },
                    ncyBreadcrumb: {
                        label: 'دسته بندی مرتبط تبادل لینک'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleLinkManagement/LinkManagementCategorySimilar/LinkManagementCategorySimilarController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.linkmanagementcontentsimilar', {
                    url: "/linkmanagementcontentsimilar",
                    templateUrl: "cpanelv1/ModuleLinkManagement/LinkManagementContentSimilar/grid.html",
                    controller: "linkManagementContentSimilarController",
                    controllerAs: "linkManagementContentSimilar",
                    data: {
                        pageTitle: 'لیست مرتبط تبادل لینک'
                    },
                    ncyBreadcrumb: {
                        label: 'لیست مرتبط تبادل لینک'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleLinkManagement/LinkManagementContentSimilar/LinkManagementContentSimilarController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                /////////////////
                .state('index.cmsuserbadlogin', {
                    url: "/cmsuserbadlogin",
                    templateUrl: "cpanelv1/ModuleCore/CmsUserBadLogin/grid.html",
                    controller: "cmsUserBadLoginController",
                    controllerAs: "cmsUserBadLogin",
                    data: {
                        pageTitle: 'خطاهای ورود'
                    },
                    ncyBreadcrumb: {
                        label: 'خطاهای ورود'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleCore/CmsUserBadLogin/cmsUserBadLoginController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state("index.cmsuserticketlog", {
                    url: "/cmsuserticketlog",
                    templateUrl: "cpanelv1/ModuleCore/cmsUserTicketLog/grid.html",
                    controller: "cmsUserTicketLogController",
                    controllerAs: "cmsUserTicketLog",
                    data: {
                        pageTitle: "لاگ های ورود"
                    },
                    ncyBreadcrumb: {
                        label: 'لاگ های ورود'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'cpanelv1/ModuleCore/cmsUserTicketLog/cmsUserTicketLogController.js'
                                    ]
                                });
                            }
                        ]
                    }

                })
                .state('index.newsshareservercategory', {
                    url: "/newsshareservercategory",
                    templateUrl: "cpanelv1/ModuleNews/NewsShareServerCategory/grid.html",
                    controller: "newsShareServerCategoryController",
                    controllerAs: "newsShareServerCategory",
                    data: {
                        pageTitle: 'اخبار - اشتراک گذاری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleNews/NewsShareServerCategory/NewsShareServerCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.newssharerecivercategory', {
                    url: "/newssharerecivercategory",
                    templateUrl: "cpanelv1/ModuleNews/NewsShareReciverCategory/grid.html",
                    controller: "newsShareReciverCategoryController",
                    controllerAs: "newsShareReciverCategory",
                    data: {
                        pageTitle: 'اخبار - اشتراک گیری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleNews/NewsShareReciverCategory/NewsShareReciverCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.fileshareservercategory', {
                    url: "/fileshareservercategory",
                    templateUrl: "cpanelv1/ModuleFile/FileShareServerCategory/grid.html",
                    controller: "fileShareServerCategoryController",
                    controllerAs: "fileShareServerCategory",
                    data: {
                        pageTitle: 'اخبار - اشتراک گذاری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleFile/FileShareServerCategory/FileShareServerCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.filesharerecivercategory', {
                    url: "/filesharerecivercategory",
                    templateUrl: "cpanelv1/ModuleFile/FileShareReciverCategory/grid.html",
                    controller: "fileShareReciverCategoryController",
                    controllerAs: "fileShareReciverCategory",
                    data: {
                        pageTitle: 'اخبار - اشتراک گیری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleFile/FileShareReciverCategory/FileShareReciverCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.quoteshareservercategory', {
                    url: "/quoteshareservercategory",
                    templateUrl: "cpanelv1/ModuleQuote/QuoteShareServerCategory/grid.html",
                    controller: "quoteShareServerCategoryController",
                    controllerAs: "quoteShareServerCategory",
                    data: {
                        pageTitle: 'سخن روز - اشتراک گذاری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleQuote/QuoteShareServerCategory/QuoteShareServerCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.quotesharerecivercategory', {
                    url: "/quotesharerecivercategory",
                    templateUrl: "cpanelv1/ModuleQuote/QuoteShareReciverCategory/grid.html",
                    controller: "quoteShareReciverCategoryController",
                    controllerAs: "quoteShareReciverCategory",
                    data: {
                        pageTitle: 'سخن روز - اشتراک گیری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleQuote/QuoteShareReciverCategory/QuoteShareReciverCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.shopshareservercategory', {
                    url: "/shopshareservercategory",
                    templateUrl: "cpanelv1/ModuleShop/ShopShareServerCategory/grid.html",
                    controller: "shopShareServerCategoryController",
                    controllerAs: "shopShareServerCategory",
                    data: {
                        pageTitle: 'فروشگاه - اشتراک گذاری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleShop/ShopShareServerCategory/ShopShareServerCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.shopsharerecivercategory', {
                    url: "/shopsharerecivercategory",
                    templateUrl: "cpanelv1/ModuleShop/ShopShareReciverCategory/grid.html",
                    controller: "shopShareReciverCategoryController",
                    controllerAs: "shopShareReciverCategory",
                    data: {
                        pageTitle: 'فروشگاه - اشتراک گیری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleShop/ShopShareReciverCategory/ShopShareReciverCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.chartshareservercategory', {
                    url: "/chartshareservercategory",
                    templateUrl: "cpanelv1/ModuleChart/ChartShareServerCategory/grid.html",
                    controller: "chartShareServerCategoryController",
                    controllerAs: "chartShareServerCategory",
                    data: {
                        pageTitle: 'چارت - اشتراک گذاری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleChart/ChartShareServerCategory/ChartShareServerCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.chartsharerecivercategory', {
                    url: "/chartsharerecivercategory",
                    templateUrl: "cpanelv1/ModuleChart/ChartShareReciverCategory/grid.html",
                    controller: "chartShareReciverCategoryController",
                    controllerAs: "chartShareReciverCategory",
                    data: {
                        pageTitle: 'چارت - اشتراک گیری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleChart/ChartShareReciverCategory/ChartShareReciverCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.imagegalleryshareservercategory', {
                    url: "/imageGalleryshareservercategory",
                    templateUrl: "cpanelv1/ModuleImageGallery/ImageGalleryShareServerCategory/grid.html",
                    controller: "imageGalleryShareServerCategoryController",
                    controllerAs: "imageGalleryShareServerCategory",
                    data: {
                        pageTitle: 'تصویر - اشتراک گذاری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleImageGallery/ImageGalleryShareServerCategory/ImageGalleryShareServerCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.imagegallerysharerecivercategory', {
                    url: "/imageGallerysharerecivercategory",
                    templateUrl: "cpanelv1/ModuleImageGallery/ImageGalleryShareReciverCategory/grid.html",
                    controller: "imageGalleryShareReciverCategoryController",
                    controllerAs: "imageGalleryShareReciverCategory",
                    data: {
                        pageTitle: 'تصویر - اشتراک گیری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleImageGallery/ImageGalleryShareReciverCategory/ImageGalleryShareReciverCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.moviegalleryshareservercategory', {
                    url: "/moviegalleryshareservercategory",
                    templateUrl: "cpanelv1/ModuleMovieGallery/MovieGalleryShareServerCategory/grid.html",
                    controller: "movieGalleryShareServerCategoryController",
                    controllerAs: "movieGalleryShareServerCategory",
                    data: {
                        pageTitle: 'فیلم - اشتراک گذاری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleMovieGallery/MovieGalleryShareServerCategory/MovieGalleryShareServerCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.moviegallerysharerecivercategory', {
                    url: "/moviegallerysharerecivercategory",
                    templateUrl: "cpanelv1/ModuleMovieGallery/MovieGalleryShareReciverCategory/grid.html",
                    controller: "movieGalleryShareReciverCategoryController",
                    controllerAs: "movieGalleryShareReciverCategory",
                    data: {
                        pageTitle: 'فیلم - اشتراک گیری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleMovieGallery/MovieGalleryShareReciverCategory/MovieGalleryShareReciverCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.musicgalleryshareservercategory', {
                    url: "/musicgalleryshareservercategory",
                    templateUrl: "cpanelv1/ModuleMusicGallery/MusicGalleryShareServerCategory/grid.html",
                    controller: "musicGalleryShareServerCategoryController",
                    controllerAs: "musicGalleryShareServerCategory",
                    data: {
                        pageTitle: 'موسیقی - اشتراک گذاری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleMusicGallery/MusicGalleryShareServerCategory/MusicGalleryShareServerCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.musicgallerysharerecivercategory', {
                    url: "/musicgallerysharerecivercategory",
                    templateUrl: "cpanelv1/ModuleMusicGallery/MusicGalleryShareReciverCategory/grid.html",
                    controller: "musicGalleryShareReciverCategoryController",
                    controllerAs: "musicGalleryShareReciverCategory",
                    data: {
                        pageTitle: 'موسیقی - اشتراک گیری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleMusicGallery/MusicGalleryShareReciverCategory/MusicGalleryShareReciverCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.serviceshareservercategory', {
                    url: "/serviceshareservercategory",
                    templateUrl: "cpanelv1/ModuleService/ServiceShareServerCategory/grid.html",
                    controller: "serviceShareServerCategoryController",
                    controllerAs: "serviceShareServerCategory",
                    data: {
                        pageTitle: 'خدمات - اشتراک گذاری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleService/ServiceShareServerCategory/ServiceShareServerCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.servicesharerecivercategory', {
                    url: "/servicesharerecivercategory",
                    templateUrl: "cpanelv1/ModuleService/ServiceShareReciverCategory/grid.html",
                    controller: "serviceShareReciverCategoryController",
                    controllerAs: "serviceShareReciverCategory",
                    data: {
                        pageTitle: 'خدمات - اشتراک گیری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleService/ServiceShareReciverCategory/ServiceShareReciverCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.productshareservercategory', {
                    url: "/productshareservercategory",
                    templateUrl: "cpanelv1/ModuleProduct/ProductShareServerCategory/grid.html",
                    controller: "productShareServerCategoryController",
                    controllerAs: "productShareServerCategory",
                    data: {
                        pageTitle: 'محصولات - اشتراک گذاری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleProduct/ProductShareServerCategory/ProductShareServerCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.productsharerecivercategory', {
                    url: "/productsharerecivercategory",
                    templateUrl: "cpanelv1/ModuleProduct/ProductShareReciverCategory/grid.html",
                    controller: "productShareReciverCategoryController",
                    controllerAs: "productShareReciverCategory",
                    data: {
                        pageTitle: 'محصولات - اشتراک گیری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleProduct/ProductShareReciverCategory/ProductShareReciverCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.blogshareservercategory', {
                    url: "/blogshareservercategory",
                    templateUrl: "cpanelv1/ModuleBlog/BlogShareServerCategory/grid.html",
                    controller: "blogShareServerCategoryController",
                    controllerAs: "blogShareServerCategory",
                    data: {
                        pageTitle: 'دست نوشته ها - اشتراک گذاری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleBlog/BlogShareServerCategory/BlogShareServerCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.blogsharerecivercategory', {
                    url: "/blogsharerecivercategory",
                    templateUrl: "cpanelv1/ModuleBlog/BlogShareReciverCategory/grid.html",
                    controller: "blogShareReciverCategoryController",
                    controllerAs: "blogShareReciverCategory",
                    data: {
                        pageTitle: 'دست نوشته ها - اشتراک گیری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleBlog/BlogShareReciverCategory/BlogShareReciverCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.articleshareservercategory', {
                    url: "/articleshareservercategory",
                    templateUrl: "cpanelv1/ModuleArticle/ArticleShareServerCategory/grid.html",
                    controller: "articleShareServerCategoryController",
                    controllerAs: "articleShareServerCategory",
                    data: {
                        pageTitle: 'مقالات - اشتراک گذاری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleArticle/ArticleShareServerCategory/ArticleShareServerCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.articlesharerecivercategory', {
                    url: "/articlesharerecivercategory",
                    templateUrl: "cpanelv1/ModuleArticle/ArticleShareReciverCategory/grid.html",
                    controller: "articleShareReciverCategoryController",
                    controllerAs: "articleShareReciverCategory",
                    data: {
                        pageTitle: 'مقالات - اشتراک گیری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleArticle/ArticleShareReciverCategory/articleShareReciverCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.biographyshareservercategory', {
                    url: "/biographyshareservercategory",
                    templateUrl: "cpanelv1/ModuleBiography/BiographyShareServerCategory/grid.html",
                    controller: "biographyShareServerCategoryController",
                    controllerAs: "biographyShareServerCategory",
                    data: {
                        pageTitle: 'زندگینامه - اشتراک گذاری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleBiography/BiographyShareServerCategory/BiographyShareServerCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.biographysharerecivercategory', {
                    url: "/biographysharerecivercategory",
                    templateUrl: "cpanelv1/ModuleBiography/BiographyShareReciverCategory/grid.html",
                    controller: "biographyShareReciverCategoryController",
                    controllerAs: "biographyShareReciverCategory",
                    data: {
                        pageTitle: 'زندگینامه - اشتراک گیری'
                    },
                    ncyBreadcrumb: {
                        label: 'مینور'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleBiography/BiographyShareReciverCategory/BiographyShareReciverCategoryController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.discountoffertransaction', {
                    url: "/discountoffertransaction",
                    templateUrl: "cpanelv1/ModuleDiscount/DiscountOfferTransaction/grid.html",
                    controller: "discountOfferTransactionController",
                    controllerAs: "discountOfferTransaction",
                    data: {
                        pageTitle: 'تراکنش پیشنهاد'
                    },
                    ncyBreadcrumb: {
                        label: 'تراکنش پیشنهاد'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleDiscount/DiscountOfferTransaction/DiscountOfferTransactionController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                /**********/
                .state('index.cmsmoduleheadergroup', {
                    url: "/cmsmoduleheadergroup",
                    templateUrl: "cpanelv1/ModuleCore/CmsModuleSaleHeaderGroup/grid.html",
                    controller: "CmsModuleSaleHeaderGroupController",
                    controllerAs: "CmsModuleHeaderG",
                    data: {
                        pageTitle: 'گروه هدر'
                    },
                    ncyBreadcrumb: {
                        label: 'گروه هدر'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    serie: false,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsModuleSaleHeaderGroup/CmsModuleSaleHeaderGroupController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state('index.cmsmodulesaleitem', {
                    url: "/cmsmodulesaleitem",
                    templateUrl: "cpanelv1/ModuleCore/CmsModuleSaleItem/grid.html",
                    controller: "cmsModuleSaleItemController",
                    controllerAs: "cmsModuleSaleItem",
                    data: {
                        pageTitle: 'cmsModuleSaleItem'
                    },
                    ncyBreadcrumb: {
                        label: 'cmsModuleSaleItem'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    serie: false,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsModuleSaleItem/CmsModuleSaleItemController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state('index.cmsmodulesaleserial', {
                    url: "/cmsmodulesaleserial",
                    templateUrl: "cpanelv1/ModuleCore/CmsModuleSaleSerial/grid.html",
                    controller: "cmsModuleSaleSerialController",
                    controllerAs: "cmsModuleSaleSerial",
                    data: {
                        pageTitle: 'CmsModuleSaleSerial'
                    },
                    ncyBreadcrumb: {
                        label: 'CmsModuleSaleSerial'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    serie: false,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsModuleSaleSerial/CmsModuleSaleSerialController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state('index.cmsmodulesaleinvoice', {
                    url: "/cmsmodulesaleinvoice",
                    templateUrl: "cpanelv1/ModuleCore/CmsModuleSaleInvoice/grid.html",
                    controller: "cmsModuleSaleInvoiceController",
                    controllerAs: "cmsModuleSaleInvoice",
                    data: {
                        pageTitle: 'CmsModuleSaleInvoice'
                    },
                    ncyBreadcrumb: {
                        label: 'CmsModuleSaleInvoice'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    serie: false,
                                    files: [
                                        'cpanelv1/ModuleCore/CmsModuleSaleInvoice/CmsModuleSaleInvoiceController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                .state('index.cmsguide', {
                    url: "/cmsguide",
                    templateUrl: "cpanelv1/ModuleCore/cmsguide/grid.html",
                    controller: "cmsGuideController",
                    controllerAs: "cmsGuide",
                    data: {
                        pageTitle: 'cmsguide'
                    },
                    ncyBreadcrumb: {
                        label: 'cmsguide'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'summernote', {
                                        serie: false,
                                        files: [
                                            'cpanelv1/ModuleCore/cmsguide/cmsguideController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })
                .state('index.cmslog', {
                    url: "/cmslog",
                    templateUrl: "cpanelv1/ModuleCore/cmsLog/grid.html",
                    controller: "cmsLogController",
                    controllerAs: "cmsLog",
                    data: {
                        pageTitle: 'cmsLog'
                    },
                    ncyBreadcrumb: {
                        label: 'cmsLog'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    serie: false,
                                    files: [
                                        'cpanelv1/ModuleCore/cmsLog/cmsLogController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                /***********************/
                .state('index.modulesrelationship', {
                    url: "/modulesrelationship",
                    templateUrl: "cpanelv1/ModulesRelationship/grid.html",
                    controller: "modulesRelationshipContentController",
                    controllerAs: "modulesRelationship",
                    data: {
                        pageTitle: 'ModulesRelationship'
                    },
                    ncyBreadcrumb: {
                        label: 'ModulesRelationship'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                    serie: false,
                                    files: [
                                        'cpanelv1/ModulesRelationship/ModulesRelationshipController.js'
                                    ]
                                }]);
                            }
                        ]
                    }
                })
                /**********/
                .state('index.marketingdashboard', {
                    url: "/marketingdashboard",
                    templateUrl: "cpanelv1/ModuleMarketing/MarketingDashboard/grid.html",
                    controller: "marketingDashboardController",
                    controllerAs: "dashboard",
                    data: {
                        pageTitle: 'داشبورد'
                    },
                    ncyBreadcrumb: {
                        label: 'داشبورد'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleMarketing/MarketingDashboard/marketingDashboardController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                })

                .state('index.marketingcustomersettingposition', {
                    url: "/marketingcustomersettingposition",
                    params: {
                        id: -3
                    },
                    templateUrl: "cpanelv1/ModuleMarketing/MarketingCustomerSettingPosition/grid.html",
                    controller: "marketingCustomerSettingPositionController",
                    controllerAs: "marketingPosition",
                    data: {
                        pageTitle: 'موقعیت فروش'
                    },
                    ncyBreadcrumb: {
                        label: 'موقعیت فروش'
                    },
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'ngJsTree', 'summernote', 'nouislider', 'minicolors', 'angucomplete-alt',
                                    {
                                        //serie: true,
                                        files: [
                                            'cpanelv1/ModuleMarketing/MarketingCustomerSettingPosition/marketingCustomerSettingPositionController.js'
                                        ]
                                    }
                                ]);
                            }
                        ]
                    }
                });
        }
    ]);