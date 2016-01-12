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

    app.run(['$rootScope', '$state', '$stateParams', 'AuthService','$log','$location','$window','$timeout', '$http', '$cookies', 'wnwbApi', '$sessionStorage', '$uibModal', function ($rootScope, $state, $stateParams, authService, $log, $location, $window, $timeout, $http, $cookies, wnwbApi, $sessionStorage, $uibModal) {

        $rootScope.$storage = $sessionStorage;

        $rootScope.$state = $state;

        $rootScope.isInitFinished = false;

        $rootScope.$state = $state;
        $rootScope.authService = authService;

        $http.get('config/language-codes.json').success(function (data) {
            $rootScope.languageCodes = data;
            $rootScope.languageCodeMap = {};
            angular.forEach($rootScope.languageCodes, function (value, key) {
                $rootScope.languageCodeMap[value.code] = value;
            });
        });

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
            if(authService.isAuthenticated()) {

                $rootScope.initLexicon();

                authService.setLandingPath($location.path());
            }
        });

        $rootScope.typeOf = function(val) { return typeof(val); };
        $rootScope.toInt = function(val) {
            return parseInt(val,10);
        };

        $rootScope.updateLexicon = function () {
            $state.reload();
        };

        $rootScope.openLexiconSelectModal = function () {
            console.log('Select lexicon: ');
            return $uibModal.open({
                templateUrl: 'view/main/selectLexicon.html',
                scope: $rootScope,
                controller: 'main/selectLexiconCtrl',
                backdrop: 'static'
            });
        };

        $rootScope.setCurrentLexicon = function(lexicon) {
            $rootScope.$storage.currentLexicon = lexicon;
            $rootScope.updateLexicon();
        };

        $rootScope.initLexicon = function () {
            var lexicons = wnwbApi.Lexicon.query(function () {
                console.log(lexicons);
                $rootScope.lexicons = lexicons;
            });
            if(!$rootScope.$storage.currentLexicon) {
                $rootScope.openLexiconSelectModal();
            }
        };

        var initState = null;
        var initParams = null;

        var sChange = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            $log.debug('State change start. To state: ', toState.name + ' Is authenticated: ' + authService.isAuthenticated() );

            if($rootScope.isInitFinished == false) {
                $log.debug('Prevent change before init is finished', toState);
                initState = toState;
                initParams = toParams;
                event.preventDefault();
                sChange();
                return;
            }

            if(authService.isAuthenticated() && toState.name == 'auth' && toState.abstract == false) {
                $log.error('Already authenticated. Go home.');
                event.preventDefault();
                $state.go('home');
                return;
            }
            if(!authService.isAuthenticated() && toState.name && toState.name != 'auth') {
                $log.error('Some not auth state:  ' + toState.name + ' with path: ' + $location.path() );
                event.preventDefault();
                $state.go('auth');
                return;
            }
        });

        $rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams){
            console.log('$stateChangeError - fired when an error occurs during transition.');
            console.log(arguments);
        });

        $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
            console.log('$stateChangeSuccess to '+toState.name+'- fired once the state transition is complete.');
        });

        $rootScope.$on('$viewContentLoaded',function(event){
            console.log('$viewContentLoaded - fired after dom rendered',event);
        });

        $rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
            console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
            console.log(unfoundState, fromState, fromParams);
        });

        $rootScope.$on('$viewContentLoaded', function(event) {
            console.debug(event);
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
                //$log.debug('Is auth but No init state. Go home ');
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

    return angularAMD.bootstrap(app);
});