'use strict';

var TYPES = {
        'undefined'        : 'undefined',
        'number'           : 'number',
        'boolean'          : 'boolean',
        'string'           : 'string',
        '[object Function]': 'function',
        '[object RegExp]'  : 'regexp',
        '[object Array]'   : 'array',
        '[object Date]'    : 'date',
        '[object Error]'   : 'error'
    },
    TOSTRING = Object.prototype.toString;

function type(o) {
    return TYPES[typeof o] || TYPES[TOSTRING.call(o)] || (o ? 'object' : 'null');
};

define([
    'angularAMD',
    'appModule',
    'config/global',
    //'etTranslations',
    'config/stateConfig',
    'angular-cookies',
    'angular-resource',
    'angular-storage',
    //'ocLazyLoad',
    //'ErrorInterceptor',
    'AuthService',
    'MainCtrl',
    'AuthCtrl',
    'SynSetCtrl',
    'SenseCtrl',
    'AdminCtrl',
    'controller/admin/SenseRelTypeCtrl',
    'controller/admin/SynSetRelTypeCtrl',
    'controller/admin/DomainCtrl',
    'controller/admin/UserCtrl',
    'bootstrap',
    'ui-bootstrap',
    'directives'
    //'jquery',
    //'jquery-ui',
    //'bootstrap',
    //'pace',
    //'inspinia',
    //'angular-translate',
    //'directives',
    //'breadcrumb',
    //'sidebarDirectives',
    //'ui-bootstrap',
    //'icheck'

], function (angularAMD, app, globalConf, stateConfig/*, $ocLazyLoad */) {

    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$provide', function ($stateProvider, $urlRouterProvider, $httpProvider, $provide ) {

        stateConfig.setStates( $stateProvider, $urlRouterProvider/*, $ocLazyLoad*/);

        //$httpProvider.interceptors.push('ErrorInterceptor');
    }]);

    app.run(['$rootScope', '$state', '$stateParams', 'AuthService','$log','$location','$window','$timeout', '$http', '$cookies', 'wnwbApi', '$sessionStorage', function ($rootScope, $state, $stateParams, authService, $log, $location, $window, $timeout, $http, $cookies, wnwbApi, $sessionStorage) {



        /*var relType = new wnwbApi.SenseRelType();
        console.log(relType);
        relType.$save(relType, function () {
            alert('saved');
        });*/

        //$http.defaults.headers.common['X-CSRFToken'] = csrfToken;
        //$http.defaults.headers.common['testheader'] = 'testheader';
        //$http.defaults.withCredentials = true;

        $rootScope.$state = $state;

        $rootScope.isInitFinished = false;

        $rootScope.$state = $state;
        $rootScope.authService = authService;

        $rootScope.$on('notAuthenticated', function(event, fromState) {
            $log.log('Not auth event. Go auth');
            //$state.go('auth');
            event.preventDefault();
        });

        $rootScope.$on('authenticated', function(event, fromState) {
            $log.log('Auth event .', fromState.current.name);
            $log.log('Go home from auth state');
            $state.go('home');
            event.preventDefault();
        });

        $rootScope.$on('$stateNotFound',
            function(event, unfoundState, fromState, fromParams){
                $log.error('State not found: ', unfoundState.to);
            });

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
            $log.error('State change error.'); // "lazy.state"
        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $log.debug(' State change success loading state: ', toState.name);
            if(authService.isAuthenticated()){
                authService.setLandingPath($location.path());
            }
        });

        var initState = null;
        var initParams = null;

        var sChange = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            if(false) {
                var fLoginState = toState.name === "auth";
                if (fLoginState) {
                    return; // no need to redirect
                }

                // now, redirect only not authenticated

                var csrfToken = $cookies.get('csrftoken');
                $http.defaults.headers.common['Authorization'] = 'Token ' + token.token;

                $sessionStorage.token = null;

                var token = $sessionStorage.token;

                if (!token || new Date() - new Date(token.timeCreated) >= 28800000) {
                    event.preventDefault(); // stop current execution
                    $state.go('auth'); // go to login

                    /*var auth = new wnwbApi.Authorization();
                     auth.$auth(function () {
                     $http.defaults.headers.common['Authorization'] = 'Token ' + auth.token;
                     $sessionStorage.token = {token: auth.token, timeCreated: new Date()};
                     });*/
                } else {
                    //$sessionStorage.token = null;
                    $http.defaults.headers.common['Authorization'] = 'Token ' + token.token;
                }

                /*var userInfo = authenticationSvc.getUserInfo();

                 if(userInfo.authenticated === false) {
                 e.preventDefault(); // stop current execution
                 $state.go('login'); // go to login
                 }*/
            }

            $log.debug('State change start. To state: ', toState.name + ' Is authenticated: ' + authService.isAuthenticated() );

            if($rootScope.isInitFinished == false){
                $log.debug('Prevent change before init is finished', toState);
                initState = toState;
                initParams = toParams;
                event.preventDefault();
                sChange();
                return;
            }

            if(authService.isAuthenticated() && toState.name == 'auth' && toState.abstract == false){
                $log.error('Already authenticated. Go home.');
                event.preventDefault();
                $state.go('home');
                return;
            }
            if(!authService.isAuthenticated() && toState.name && toState.name != 'auth'){
                $log.error('Some not auth state:  ' + toState.name + ' with path: ' + $location.path() );
                event.preventDefault();
                $state.go('auth');
                return;
            }
        });

        authService.init(function () {
            $log.debug('[app.init()]');

            $rootScope.isInitFinished = true;

            if(initState){
                $log.debug('Go to init state: ', initState);
                $state.go(initState, initParams, {reload: true});
                return;
            }

            if(authService.isAuthenticated()){
                $log.debug('Is auth but No init state. Go home ');
                //$state.go('home');
                return;
            }

            if(!authService.isAuthenticated()){
                $log.debug('Not authenticated. Go auth from ' + $state.current.name);
                authService.setLandingPath($location.path());
                $state.go('auth');
                return;
            }
        });
    }]);

    /*app.config(['$routeProvider', function($routeProvider) {
        console.log('config');
        $routeProvider.when('/synset', {controller: 'SynSet', templateUrl: 'view/synset/view.html'});
        $routeProvider.otherwise({redirectTo: '/synset'});
    }]);

    app.run(['$route', function($route)  {
        $route.reload();
    }]);*/

    return angularAMD.bootstrap(app);
});