angular.module('inspinia').config([
    '$ocLazyLoadProvider',
    function ($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            debug: true,
            events: true,
            modules: [{
                    name: 'ngJsTree',
                    serie: false,
                    files: [
                        'cpanelv1/js/plugins/jstree/style.min.css',
                        'cpanelv1/js/plugins/jstree/jstree.min.js',
                        'cpanelv1/js/plugins/jstree/ngJsTree.js'
                    ]
                },
                {
                    name: 'ngDroplet',
                    serie: true,
                    files: [
                        'cpanelv1/js/plugins/ngDroplet/Default.css',
                        'cpanelv1/js/plugins/ngDroplet/progressbar.js',
                        'cpanelv1/js/plugins/ngDroplet/ng-droplet.js'
                    ]
                },
                {
                    name: 'angucomplete-alt',
                    serie: false,
                    files: [
                        'cpanelv1/js/plugins/ngautocomplete-alt/angucomplete-alt.js',
                        'cpanelv1/js/plugins/ngautocomplete-alt/angucomplete-alt.css'
                    ]
                },
                {
                    //https://amirkabirdataminers.github.io/ADM-dateTimePicker/
                    name: 'ADM-dateTimePicker',
                    serie: false,
                    files: [
                        'cpanelv1/js/plugins/adm-datetimepicker-ntk/adm-datetimepicker.css',
                        'cpanelv1/js/plugins/adm-datetimepicker-ntk/adm-datetimepicker-ntk.js'

                    ]
                },
                {
                    name: 'guide.introjs',
                    serie: false,
                    files: [
                        'cpanelv1/css/guide/introjs.css',
                        'cpanelv1/css/guide/introjs-rtl.css',
                        'cpanelv1/js/guide/intro.js',
                        'cpanelv1/js/guide/angular-intro.min.js'
                    ]
                },
                {
                    name: 'editor-alt',
                    serie: false,
                    files: [
                        'cpanelv1/js/plugins/editor/bootstrap.min.css',
                        'cpanelv1/js/plugins/ngautocomplete-alt/angucomplete-alt.css',
                        'cpanelv1/js/plugins/textAngular/textAngular-sanitize.min.js',
                        'cpanelv1/js/plugins/textAngular/textAngular.min.js'

                    ]
                },
                {
                    name: 'nouislider',
                    //serie:false,
                    files: [
                        'cpanelv1/js/plugins/nouslider/jquery.nouislider.css',
                        'cpanelv1/js/plugins/nouslider/jquery.nouislider.min.js',
                        'cpanelv1/js/plugins/nouslider/angular-nouislider.js'
                    ]
                },
                {
                    name: 'ui.select',
                    serie: true,
                    files: [
                        //'cpanelv1/js/plugins/select2/select2.css',
                        'cpanelv1/js/plugins/select2/select2-bootstrap.css',
                        'cpanelv1/js/plugins/select2/select.css',
                        'cpanelv1/js/plugins/select2/select.js'
                    ]
                },
                {
                    name: 'minicolors',
                    serie: false,
                    files: [
                        'cpanelv1/js/plugins/minicolors/jquery.minicolors.css',
                        'cpanelv1/js/plugins/minicolors/jquery.minicolors.js',
                        'cpanelv1/js/plugins/minicolors/angular-minicolors.js'
                    ]
                },
                {
                    name: 'ui.select',
                    files: [
                        'cpanelv1/js/plugins/ui-select/select.min.js',
                        'cpanelv1/js/plugins/ui-select/select.min.css'
                    ]
                },
                {
                    name: 'summernote',
                    //serie: false,
                    files: [
                        'cpanelv1/js/plugins/summernote/summernote.css',
                        //'cpanelv1/js/plugins/summernote/summernote-bs3.css',
                        'cpanelv1/js/plugins/summernote/summernote.min.js',
                        'cpanelv1/js/plugins/summernote/angular-summernote.min.js'
                        

                        
                    ]
                },
                {
                    name: "ui.grid",
                    serie: false,
                    files: [
                        'cpanelv1/js/plugins/ui-grid/ui-grid.css',
                        'cpanelv1/js/plugins/ui-grid/ui-grid.js'
                    ]
                },
                {
                    name: "ngTagsInput",
                    serie: false,
                    files: [
                        "cpanelv1/js/plugins/ngtaginput/ng-tags-input.js",
                        "cpanelv1/js/plugins/ngtaginput/ng-tags-input.css"
                    ]
                },
                {
                    name: "floatThead",
                    serie: false,
                    files: [
                        'cpanelv1/js/plugins/angular-floatthead/jquery.floatThead.js',
                        'cpanelv1/js/plugins/angular-floatthead/angular-floatThead.js'
                    ]
                },
                {
                    name: "treeControl",
                    serie: false,
                    files: [
                        'cpanelv1/js/plugins/angular-tree-control/js/angular-tree-control.js',
                        'cpanelv1/js/plugins/angular-tree-control/css/tree-control.css',
                        'cpanelv1/js/plugins/angular-tree-control/css/tree-control-attribute.css'
                    ]
                },
                {
                    name: "monospaced.qrcode",
                    serie: false,
                    files: [
                        'cpanelv1/js/plugins/angular-qrcode/qrcode_UTF8.js',
                        'cpanelv1/js/plugins/angular-qrcode/angular-qrcode.js',
                        'cpanelv1/js/plugins/angular-qrcode/qrcode.js'
                    ]
                },
                {
                    name: 'angular.drag.resize',
                    serie: false,
                    files: ['cpanelv1/js/plugins/angular-drag-resize/angular-drag-resize.js']
                }

            ]
        });
    }
]);