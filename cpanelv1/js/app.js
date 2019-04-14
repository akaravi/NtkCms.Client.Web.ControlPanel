(function () {
    angular.module('inspinia', [
        'ui.router', // Routing
        'oc.lazyLoad', // ocLazyLoad
        'ui.bootstrap', // Ui Bootstrap
        'ncy-angular-breadcrumb',
        'ngIdle',
        'ngSanitize',
        'cgNotify',
        'oitozero.ngSweetAlert',
        'flow',
        'pascalprecht.translate',
        'ui.tree',
        'builder', 'builder.components', 'validator.rules'
    ]);
})();