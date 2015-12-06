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
        'angular-storage'       : 'bower_components/ngstorage/ngStorage.min',
        'angularAMD'            : 'bower_components/angularAMD/angularAMD',

        'underscore'            : 'bower_components/underscore/underscore-min',

        'directives'            : 'directive/directives',

        'jquery'                : 'bower_components/jquery/dist/jquery',
        'bootstrap'             : 'bower_components/bootstrap/dist/js/bootstrap.min',
        'ui-bootstrap'          : 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        //'bootstrap-tab'         : 'bower_components/bootstrap/dist/js/bootstrap.min',
        'bootstrap-treeview'    : 'bower_components/bootstrap-treeview/dist/bootstrap-treeview.min',
        'PACE'                  : 'bower_components/PACE/pace.min.js',
        'less'                  : 'bower_components/less/dist/less.min',

        'MainCtrl'              : 'controller/MainCtrl',
        'AuthCtrl'              : 'controller/AuthCtrl',
        'SynSetCtrl'            : 'controller/SynSetCtrl',
        'SenseCtrl'             : 'controller/SenseCtrl',
        'AdminCtrl'             : 'controller/AdminCtrl',
        //'SenseRelTypeCtrl'      : 'controller/admin/SenseRelTypeCtrl',
        'SynSetRelTypeCtrl'     : 'controller/admin/SynSetRelTypeCtrl',
        'DomainCtrl'            : 'controller/admin/DomainCtrl',
        'UserCtrl'              : 'controller/admin/UserCtrl',
        'UserService'           : 'service/UserService',
        'SynSetService'         : 'service/SynSetService',
        'SenseRelTypeService'   : 'service/SenseRelTypeService',

        'js'                    : 'javascript/js'
    },
    shim: {
        'angular'               : ['jquery'],
        'angularAMD'            : ['angular'],
        'angular-cookies'       : ['angular'],
        'angular-resource'      : ['angular'],
        'angular-storage'       : ['angular'],
        //'angular-route'         : ['angular'],
        'angular-ui-router'     : ['angular'],
        'ui-bootstrap'          : ['angular'],

        'bootstrap'             : ['jquery'],
        'bootstrap-treeview'    : ['jquery', 'bootstrap'],

        'js'                    : ['jquery', 'bootstrap', 'bootstrap-treeview']
    },
    deps: ['bootstrap-treeview', 'less', 'app']
});