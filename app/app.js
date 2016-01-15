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
        'AuthService',
        '$log',
        '$location',
        '$window',
        '$timeout',
        '$http',
        '$cookies',
        'wnwbApi',
        '$sessionStorage',
        '$uibModal',
        'service/AnchorService',
        'service/LexiconService',
        function (
            $rootScope,
            $state,
            $stateParams,
            authService,
            $log,
            $location,
            $window,
            $timeout,
            $http,
            $cookies,
            wnwbApi,
            $sessionStorage,
            $uibModal,
            anchorService,
            lexiconService
        ) {
            $rootScope.$state = $state;

            $rootScope.isInitFinished = false;

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

            $rootScope.typeOf = function(val) { return typeof(val); };
            $rootScope.toInt = function(val) {
                return parseInt(val,10);
            };

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

                if(toState.name == 'home') {
                    //TODO: check current anchor / lexicon

                    //lexicon is set
                    //get achors & go

                    //wait for lexicon list?

                    //homecontroller redirects?

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

                    /*workingLexiconService.init(function (success) {
                        $rootScope.lexicons = workingLexiconService.getLexicons();

                        $rootScope.workingLexicon = workingLexiconService.getWorkingLexicon();

                        if(!$rootScope.workingLexicon) {
                            $rootScope.openLexiconSelectModal();
                        }
                    });*/

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

            authService.init(function () {
                $rootScope.isInitFinished = true;

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
    }]);

    return angularAMD.bootstrap(app);
});