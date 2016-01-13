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
    'angular-vertilize',
    'angular-scroll-glue',
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
    'controller/main/NavigationCtrl',
    'service/UtilsService',
    'service/WorkingLexiconService',
    'service/ErrorInterceptorService',
    'service/AnchorService',
    'service/LexiconService',
    'bootstrap',
    'ui-bootstrap',
    'directives'
], function (angularAMD, app, globalConf, stateConfig/*, $ocLazyLoad */) {

    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$provide', function ($stateProvider, $urlRouterProvider, $httpProvider, $provide) {

        stateConfig.setStates( $stateProvider, $urlRouterProvider/*, $ocLazyLoad*/);

        $provide.decorator('$uiViewScroll', function ($delegate) {
            return function (uiViewElement) {
                $('html,body').animate({
                    scrollTop: uiViewElement.offset().top
                }, 500);
            };
        });

        $httpProvider.interceptors.push('ErrorInterceptorService');
    }]);

    app.run([
        '$rootScope',
        '$state',
        '$stateParams',
        '$log',
        '$location',
        '$window',
        '$q',
        '$timeout',
        '$http',
        '$cookies',
        'wnwbApi',
        '$uibModal',
        'AuthService',
        'service/AnchorService',
        'service/LexiconService',
        'service/UtilsService',
        function (
            $rootScope,
            $state,
            $stateParams,
            $log,
            $location,
            $window,
            $q,
            $timeout,
            $http,
            $cookies,
            wnwbApi,
            $uibModal,
            authService,
            anchorService,
            lexiconService,
            utilsService
        ) {

            $rootScope.$state = $state;

            $rootScope.fInitFinished = false;

            $rootScope.authService = authService;



            /*
            Global data:
            lexicon list: api resource, loaded once / periodically updated
            working lexicon: set by: sense / synset / user
            anchor list: set by working lexicon / sense / synset / user
             */

            $http.get('config/language-codes.json').success(function (data) {
                $rootScope.languageCodes = data;
                $rootScope.languageCodeMap = {};
                angular.forEach($rootScope.languageCodes, function (value, key) {
                    $rootScope.languageCodeMap[value.code] = value;
                });
            });

            $rootScope.openLexiconSelectModal = function () {
                console.log('openLexiconSelectModal');

                return $uibModal.open({
                    templateUrl: 'view/main/selectLexicon.html',
                    scope: $rootScope,
                    controller: 'main/selectLexiconCtrl',
                    backdrop: 'static',
                    size: 'lg'
                });
            };

            utilsService.init();

            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                if(!authService.isAuthenticated() && toState.name != 'auth') {
                    $log.log('Not auth event. Go auth');
                    event.preventDefault();
                    $state.go('auth');
                }
                //auth check
                //token time / heartbeat
                //on fail redirect to auth

                //home controller handles sense/synset redirection
            });

            $rootScope.$on('$stateNotFound',
                function(event, unfoundState, fromState, fromParams){
                    $log.error('State not found: ', unfoundState.to);
                });

            $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
                $log.error('State change error.'); // "lazy.state"
            });

            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                $log.debug('State change success loading state: ', toState.name);
                if(authService.isAuthenticated()) {
                    authService.setLandingPath($location.path());
                }
            });

            $rootScope.$on('workingLexiconChanged', function (event, data) {
                //$rootScope.workingLexicon = workingLexiconService.getWorkingLexicon();
            });

            $rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams){
                //console.log('$stateChangeError - fired when an error occurs during transition.');
                //console.log(arguments);
            });

            $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
                //console.log('$stateChangeSuccess to '+toState.name+'- fired once the state transition is complete.');
            });

            $rootScope.$on('$viewContentLoaded',function(event){
                //console.log('$viewContentLoaded - fired after dom rendered',event);
            });

            $rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
                //console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
                //console.log(unfoundState, fromState, fromParams);
            });

            $rootScope.$on('$viewContentLoaded', function(event) {
                //console.debug(event);
            });

            $rootScope.$on('notAuthenticated', function(event, fromState) {
                $log.log('Not auth event. Go auth');
                $state.go('auth');
                event.preventDefault();
            });

            $rootScope.$on('authenticationFinished', function(event, fromState) {
                $log.log('Auth event.', fromState.current.name);
                $log.log('Go home from auth state');
                $state.go('home');
                event.preventDefault();

                lexiconService.init( function () {
                    console.log('[app.js] lexiconService init done');
                });

                anchorService.init(function () {
                    console.log('[app.js] anchorService init done');
                });
            });

            $rootScope.$on('authenticated', function(event, fromState) {
                $log.log('Auth event.', fromState.current.name);
                $log.log('Go home from auth state');
                $state.go('home');
                event.preventDefault();

                lexiconService.init( function () {
                    console.log('[app.js] lexiconService init done');
                });

                anchorService.init(function () {
                    console.log('[app.js] anchorService init done');
                });

                /*var deferred = $q.defer();
                 var deferred2 = $q.defer();

                 var promise = deferred.promise;
                 var promise2 = deferred2.promise;

                 var promiseB = promise.then(function(greeting) {
                 $log.log('Success: ' + greeting);
                 return promise2;
                 }, function(reason) {
                 $log.log('Failed: ' + reason);
                 }, function(update) {
                 $log.log('Got notification: ' + update);
                 });

                 promiseB.then(function(greeting) {
                 $log.log('SuccessB: ' + greeting);
                 }, function(reason) {
                 $log.log('FailedB: ' + reason);
                 }, function(update) {
                 $log.log('Got notificationB: ' + update);
                 });

                 deferred.resolve('XXX');
                 deferred2.resolve('YYY');*/
            });

            $rootScope.$on('noWorkingLexicon', function(event) {
                $log.log('No working lexicon');

                $rootScope.openLexiconSelectModal();
            });

            $rootScope.$on('workingLexiconChanged', function (event) {
                $log.log('Working lexicon changed');

                $state.go('home');
                //update anchor
            });

            $log.debug('[app.js] init');

            var initApp = function () {
                authService.init(function () {
                    $log.log('App init done');
                });
            };

            initApp();
    }]);

    return angularAMD.bootstrap(app);
});