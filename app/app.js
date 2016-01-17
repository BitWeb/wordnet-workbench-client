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

    angularAMD.service('TestService', function () {
        console.log('TestService');
    });

    angularAMD.service('TestService', function () {
        console.log('TestService2');
    });

    angularAMD.controller('TestService', ['$scope','$state', 'AuthService', function ($scope, $state, authService) {
        console.log('TestService controller');
    }]);


    angularAMD.factory('TestService', function() {
        return function(numCylinder) {
            console.log('car constructor');
            this.delaer="Bad";
            this.numCylinder = numCylinder
        };
    });

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
        'service/UtilsService',
        'service/AnchorService',
        'service/LexiconService',
        'service/UtilsService',
        'TestService',
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
            utilsService,
            TestService
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
                console.log('stateChangeStart');

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

                //check authentication, redirect to auth (with reload?)
                    //no token: redirect to auth (with reload?)

                //home controller handles sense/synset redirection
            });

            //load lexicons and user info on page load
            //init chain
            var deferred = $q.defer();
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
            deferred2.resolve('YYY');

            //check auth/anchor, redirect

            /*var initState = null;
            var initParams = null;

            var sChangeDtor = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                $log.debug('State change start. To state: ', toState.name + ' Is authenticated: ' + authService.isAuthenticated() );

                if($rootScope.fInitFinished == false) {
                    $log.debug('Prevent change before init is finished', toState);
                    initState = toState;
                    initParams = toParams;
                    event.preventDefault();
                    sChangeDtor();
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

                if(toState.name == 'home') {
                    //TODO: check current anchor / lexicon

                    //lexicon is set
                    //get achors & go

                    //wait for lexicon list?

                    //homecontroller redirects?
                    
                    if(false) {
                        //Go to synset/sense
                        event.preventDefault();
                        $state.go('auth');
                        return;
                    }

                    var workingLexiconId = 0;
                    var anchors = anchorService.getAnchorList(workingLexiconId);
                    var currentAnchor = anchorService.getWorkingAnchor();
                }
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
                $log.debug('State change success loading state: ', toState.name);
                if(authService.isAuthenticated()) {

                    authService.setLandingPath($location.path());

                    anchorService.init(function () {
                        console.log('[app.js] anchorService init done');
                    });
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

            $log.debug('[app.js] init');

            var initApp = function () {
                $rootScope.fInitFinished = false;

                authService.init(function () {

                    lexiconService.init(function () {
                        $rootScope.fInitFinished = true;

                    });

                    $rootScope.fInitFinished = true;

                    if(initState){
                        $log.debug('[app.js] Go to init state: ', initState);
                        $state.go(initState, initParams, {reload: true});
                        return;
                    }

                    if(authService.isAuthenticated()) {

                        lexiconService.init(function (lexicons) {
                            console.log('[app.js] LexiconService init done');
                        });

                        anchorService.init(function () {
                            console.log('[app.js] AnchorService init done');
                        });

                        //$log.debug('Is auth but No init state. Go home ');
                        //$state.go('home');
                        return;
                    }

                    if(!authService.isAuthenticated()){
                        $log.debug('[app.js] Not authenticated. Go auth from ' + $state.current.name);
                        authService.setLandingPath($location.path());
                        $state.go('auth');
                        return;
                    }
                });
            };

            initApp();*/
    }]);

    return angularAMD.bootstrap(app);
});