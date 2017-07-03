/**
 * Created by ivar on 21.11.15.
 */

require.config({
    baseUrl: "./",
    paths: {
        'angular'               : 'bower_components/angular/angular',
        //'angular-route'         : 'bower_components/angular-route/angular-route',
        'angular-ui-router'     : 'bower_components/angular-ui-router/release/angular-ui-router.min',
        'angular-cookies'       : 'bower_components/angular-cookies/angular-cookies.min',
        'angular-resource'      : 'bower_components/angular-resource/angular-resource.min',
        'angular-messages'      : 'bower_components/angular-messages/angular-messages.min',
        'angular-storage'       : 'bower_components/ngstorage/ngStorage.min',
        'angular-sanitize'      : 'bower_components/angular-sanitize/angular-sanitize.min',
        'angular-ui-select'     : 'bower_components/ui-select/dist/select',
        'angularAMD'            : 'bower_components/angularAMD/angularAMD',

        'underscore'            : 'bower_components/underscore/underscore-min',

        'angular-animate'       : 'bower_components/angular-animate/angular-animate.min',
        'angular-vertilize'     : 'bower_components/angular-vertilize/angular-vertilize.min',
        'angular-scroll'        : 'bower_components/angular-scroll/angular-scroll.min',
        'angular-scroll-glue'   : 'bower_components/angular-scroll-glue/src/scrollglue',
        'angular-spinners'      : 'bower_components/angular-spinners/dist/angular-spinners.min',

        'directives'            : 'directive/directives',

        'jquery'                : 'bower_components/jquery/dist/jquery',
        'bootstrap'             : 'bower_components/bootstrap/dist/js/bootstrap.min',
        'ui-bootstrap'          : 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        //'bootstrap-tab'         : 'bower_components/bootstrap/dist/js/bootstrap.min',
        //'bootstrap-treeview'    : 'bower_components/bootstrap-treeview/dist/bootstrap-treeview.min',
        //'PACE'                  : 'bower_components/PACE/pace.min.js',
        'less'                  : 'bower_components/less/dist/less.min',

        'MainCtrl'              : 'controller/MainCtrl',
        'AuthCtrl'              : 'controller/AuthCtrl',
        'LexiconCtrl'           : 'controller/LexiconCtrl',
        'SynSetCtrl'            : 'controller/SynSetCtrl',
        'SenseCtrl'             : 'controller/SenseCtrl',
        'SynSetRelCtrl'         : 'controller/synset/RelCtrl',
        'SenseRelCtrl'          : 'controller/sense/RelCtrl',
        'AdminCtrl'             : 'controller/AdminCtrl',
        'HomeCtrl'              : 'controller/HomeCtrl',
        'NewHomeCtrl'           : 'controller/NewHomeCtrl',
        'ExtendedSearchResultCtrl'    : 'controller/ExtendedSearchResultCtrl',
        //'SenseRelTypeCtrl'      : 'controller/admin/SenseRelTypeCtrl',
        //'SynSetRelTypeCtrl'     : 'controller/admin/SynSetRelTypeCtrl',
        'UserCtrl'              : 'controller/admin/UserCtrl',
        'TreeViewCtrl'          : 'controller/common/TreeViewCtrl',
        'AuthService'           : 'service/AuthService',
        'StatsService'          : 'service/StatsService',

        'js'                    : 'javascript/js'
    },
    shim: {
        'angular'               : ['jquery'],
        'angularAMD'            : ['angular'],
        'angular-cookies'       : ['angular'],
        'angular-resource'      : ['angular'],
        'angular-messages'      : ['angular'],
        'angular-storage'       : ['angular'],
        'angular-sanitize'      : ['angular'],
        'angular-ui-select'     : ['angular'],
        //'angular-route'         : ['angular'],
        'angular-ui-router'     : ['angular'],

        'angular-animate'       : ['angular'],
        'angular-vertilize'     : ['angular', 'jquery'],
        'angular-scroll'        : ['angular'],
        'angular-scroll-glue'   : ['angular', 'jquery'],
        'angular-spinners'      : ['angular'],

        'ui-bootstrap'          : ['angular'],

        'bootstrap'             : ['jquery'],
        //'bootstrap-treeview'    : ['jquery', 'bootstrap'],

        'js'                    : ['jquery', 'bootstrap', 'bootstrap-treeview']
    },
    deps: ['less', 'app']
});