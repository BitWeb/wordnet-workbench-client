'use strict';

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
    'UserService',
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

    console.log('app.js');

    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$provide', function ($stateProvider, $urlRouterProvider, $httpProvider, $provide ) {
        console.log('app.config');

        stateConfig.setStates( $stateProvider, $urlRouterProvider/*, $ocLazyLoad*/);

        //$httpProvider.interceptors.push('ErrorInterceptor');
    }]);

    app.run(['$rootScope', '$state', '$stateParams', 'UserService','$log','$location','$window','$timeout', '$http', '$cookies', 'wnwbApi', '$sessionStorage', function ($rootScope, $state, $stateParams, userService, $log, $location, $window, $timeout, $http, $cookies, wnwbApi, $sessionStorage) {

        var csrfToken = $cookies.get('csrftoken');

        var xxx = wnwbApi.SenseRelType.get({id: 19}, function () {
            console.log(xxx);
        });

        if(!$sessionStorage.token) {
            var auth = new wnwbApi.Authorization();
            auth.$auth(function () {
                console.log(auth);
                console.log('Token: ' + auth.token);
                $http.defaults.headers.common['Authorization'] = 'Token ' + auth.token;
                $sessionStorage.token = auth.token;
            });
        } else {
            $http.defaults.headers.common['Authorization'] = 'Token ' + $sessionStorage.token;
        }


        /*var relType = new wnwbApi.SenseRelType();
        console.log(relType);
        relType.$save(relType, function () {
            alert('saved');
        });*/

        //$http.defaults.headers.common['X-CSRFToken'] = csrfToken;
        //$http.defaults.headers.common['testheader'] = 'testheader';
        //$http.defaults.withCredentials = true;

        $log.log('app.run');

        $rootScope.$state = $state;

        $rootScope.isInitFinished = false;

        //$rootScope.$state = $state;
        $rootScope.userService = userService;

        $rootScope.$on('notAuthenticated', function(event, fromState) {
            $log.log('Not auth event. Go auth');
            //$state.go('auth');
            event.preventDefault();
        });

        $rootScope.$on('authenticated', function(event, fromState) {
            $log.log('Auth event .', fromState.current.name);
            $log.log('Go home from auth state');
            //$state.go('home');
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
            if(userService.isAuthenticated()){
                userService.setLandingPath($location.path());
            }
        });

        var initState = null;
        var initParams = null;

        var sChange = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            $log.debug('State change start. To state: ', toState.name + ' Is authenticated: ' + userService.isAuthenticated() );

            /*if($rootScope.isInitFinished == false){
                $log.debug('Prevent change before init is finished', toState);
                initState = toState;
                initParams = toParams;
                event.preventDefault();
                sChange();
                return;
            }

            if(userService.isAuthenticated() && toState.name == 'auth' && toState.abstract == false){
                $log.error('Already authenticated. Go home.');
                event.preventDefault();
                //$state.go('home');
                return;
            }
            if(!userService.isAuthenticated() && toState.name && toState.name != 'auth'){
                $log.error('Some not auth state:  ' + toState.name + ' with path: ' + $location.path() );
                event.preventDefault();
                //$state.go('auth');
                return;
            }*/
        });

        userService.init(function () {
            $rootScope.isInitFinished = true;

            $log.log('userService.init');
            console.log('userService.init');

            if(initState){
                $log.debug('Go to init state: ', initState);
                //$state.go(initState, initParams, {reload: true});
                return;
            }

            if(userService.isAuthenticated()){
                $log.debug('Is auth but No init state. Go home ');
                //$state.go('home');
                return;
            }

            if(!userService.isAuthenticated()){
                //$log.debug('Not authenticated. Go auth from ' + $state.current.name);
                userService.setLandingPath($location.path());
                // $state.go('auth');
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