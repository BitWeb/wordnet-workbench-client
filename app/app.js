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
}

define([
    'angularAMD',
    'appModule',
    'config/global',
    'config/stateConfig',
    'config/version',
    'angular-cookies',
    'angular-resource',
    'angular-storage',
    'angular-vertilize',
    'angular-scroll-glue',
    'angular-spinners',
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
    'service/ErrorInterceptorService',
    'service/AnchorService',
    'service/LexiconService',
    'service/ConfirmModalService',
    'bootstrap',
    'ui-bootstrap',
    'directives'
], function (angularAMD, app, globalConf, stateConfig, version) {

    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$provide', function ($stateProvider, $urlRouterProvider, $httpProvider, $provide) {

        stateConfig.setStates( $stateProvider, $urlRouterProvider);

        $provide.decorator('$uiViewScroll', function ($delegate) {
            return function (uiViewElement) {
                $('html,body').animate({
                    scrollTop: uiViewElement.offset().top
                }, 500);
            };
        });
        
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

        //$httpProvider.interceptors.push('ErrorInterceptorService');
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
        'service/DirtyStateService',
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
            dirtyStateService
        ) {

            $rootScope.$state = $state;
            $rootScope.state = $state;

            $rootScope.fInitFinished = false;

            $rootScope.authService = authService;
            
            $rootScope.language = '';
            
            $rootScope.principal = null;

            $http.get('config/language-codes.json').success(function (data) {
                $rootScope.languageCodes = data;
                $rootScope.languageCodeMap = {};
                angular.forEach($rootScope.languageCodes, function (value, key) {
                    $rootScope.languageCodeMap[value.code] = value;
                });
            });

            $rootScope.openLexiconSelectModal = function () {
                return $uibModal.open({
                    templateUrl: 'view/main/selectLexicon.html',
                    scope: $rootScope,
                    controller: 'main/selectLexiconCtrl',
                    backdrop: 'static',
                    size: 'lg'
                });
            };

            $rootScope.goToTop = function () {
                var lexicon = lexiconService.getWorkingLexicon();
                if(lexicon) {
                    $rootScope.language = lexicon.language;
                    var anchorList = anchorService.getAnchorList(lexicon.id);
                    if (anchorList && anchorList.length) {
                        var topEl = anchorList[0];
                        if (topEl.type == 'sense') {
                            $state.go('sense', {senseId: topEl.id});
                            return true;
                        }
                        if (topEl.type == 'synSet') {
                            $state.go('synset', {id: topEl.id});
                            return true;
                        }
                    }
                }
                return false;
            };

            utilsService.init();
            dirtyStateService.init();

            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                if(!authService.isAuthenticated() && toState.name != 'auth') {
                    $log.log('Not auth event. Go auth');
                    event.preventDefault();
                    $state.go('auth');
                }

                if(toState.name == 'home') {
                    if($rootScope.goToTop()) {
                        event.preventDefault();
                    }
                }
            });

            $rootScope.$on('$stateNotFound',
                function(event, unfoundState, fromState, fromParams){
                    $log.error('State not found: ', unfoundState.to);
                });

            $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
                $log.error('State change error. '+fromState.name+'->'+toState.name, error); // "lazy.state"
            });

            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                $log.debug('State change success loading state: ', event.defaultPrevented, toState, toParams, fromState, fromParams);
                if(authService.isAuthenticated()) {
                    authService.setLandingPath($location.path());
                }
                $rootScope.state = toState;
            });

            $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams){
                console.log('$stateChangeError - fired when an error occurs during transition.'+fromState.name+'->'+toState.name);
            });

            $rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
                console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
            });

            $rootScope.$on('notAuthenticated', function(event, fromState) {
                $log.log('Not auth event. Go auth');
                $state.go('auth');
                event.preventDefault();
            });

            $rootScope.$on('authenticationFinished', function(event, fromState) {
                $state.go('home');
                event.preventDefault();
            });

            $rootScope.$on('authenticated', function(event, fromState) {
                lexiconService.init( function () {
                    //console.log('[app.js] lexiconService init done');
                });

                anchorService.init(function () {
                    //console.log('[app.js] anchorService init done');
                });
            });

            $rootScope.$on('noWorkingLexicon', function(event) {
                $rootScope.openLexiconSelectModal();
            });

            $rootScope.$on('workingLexiconChanged', function (event) {
                $log.log('Working lexicon changed (passive)');
            });

            $rootScope.$on('workingLexiconChangedByUser', function (event, lexicon) {
                $log.log('Working lexicon changed (active)');
                if($state.includes('home') || $state.includes('sense') || $state.includes('synset')) {
                    if (!$rootScope.goToTop()) {
                        $state.go('home');
                    }
                }
            });

            var initApp = function () {
            	globalConf.version = version;
                $rootScope.clientVersion = globalConf.version;

                var authDeferred = $q.defer();
                var authPromise = authDeferred.promise;
                var versionPromise = wnwbApi.Version.get().$promise;

                authService.init(function () {
                    authDeferred.resolve(1);
                });

                $q.all([authPromise, versionPromise]).then(function (results) {
                    $rootScope.apiVersion = results[1].version;
                });
            };

            initApp();
    }]);

    return angularAMD.bootstrap(app);
});