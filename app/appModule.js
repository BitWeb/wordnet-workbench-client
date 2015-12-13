/**
 * Created by ivar on 21.11.15.
 */

define([
    'config/stateConfig', 'config/global', 'angular-ui-router', 'ui-bootstrap', 'angular-storage', 'angular-animate', 'angular-scroll'/*, 'etTranslations', 'ocLazyLoad',*/
], function (stateConfig, globalConf/*etTranslations, $ocLazyLoad*/) {

    var app = angular.module('myApp', [
        'ui.router',
        'ui.bootstrap',
        'ngCookies',
        'ngResource',
        'ngStorage',
        'ngAnimate',
        'duScroll'
        /*'ngRoute',
        'myApp.version'*/
    ]);

    app.constant('config', globalConf);

    app.factory('wnwbApi', ['config', '$resource', function(config, $resource) {
        return {
            sensereltype: $resource(config.API_URL+'sensereltype/:id/', {}, {}, {stripTrailingSlashes: false}),
            Authorization: $resource(config.API_AUTH_URL, {}, {
                auth: {
                    method: 'POST',
                    params: {

                    },
                    headers: {'Authorization':'Basic dGVzdDp0ZXN0dGVzdA=='}
                }
            }, {stripTrailingSlashes: false}),
            Lexicon: $resource(config.API_URL+'lexicon/:id/', {}, {}, {stripTrailingSlashes: false}),
            Sense: $resource(config.API_URL+'sense/:id/', {}, {}, {stripTrailingSlashes: false}),
            SynSet: $resource(config.API_URL+'synset/:id/', {}, {}, {stripTrailingSlashes: false}),
            Domain: $resource(config.API_URL+'domain/:id/', {}, {
                update: {
                    method: 'PUT'
                }/*,
                delete: { method: 'DELETE', params: { id: 0 } }*/
            }, {stripTrailingSlashes: false}),
            SenseRel: $resource(config.API_URL+'senserel/:id/', {}, {}, {stripTrailingSlashes: false}),
            SynSetRel: $resource(config.API_URL+'synsetrel/:id/', {}, {}, {stripTrailingSlashes: false}),
            SenseRelType: $resource(config.API_URL+'sensereltype/:id/', {}, {}, {stripTrailingSlashes: false}),
            SynSetRelType: $resource(config.API_URL+'synsetreltype/:id/', {}, {}, {stripTrailingSlashes: false}),
            TestRes: $resource('https://www.googleapis.com/plus/v1/activities?query=Google%2B&orderBy=best', {}, {}, {stripTrailingSlashes: false})
        };
    }]);

    return app;
});