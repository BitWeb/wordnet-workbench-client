/**
 * Created by ivar on 21.11.15.
 */

define([
    'config/stateConfig',
    'config/global',
    'angular-ui-router',
    'angular-messages',
    'angular-sanitize',
    'ui-bootstrap',
    'angular-storage',
    'angular-animate',
    'angular-scroll',
    'angular-scroll-glue',
    'angular-ui-select',
    'angular-vertilize'
], function (stateConfig, globalConf/*etTranslations, $ocLazyLoad*/) {

    var app = angular.module('myApp', [
        'ui.router',
        'ui.bootstrap',
        'ui.select',
        'ngCookies',
        'ngResource',
        'ngStorage',
        'ngAnimate',
        'ngSanitize',
        'ngMessages',
        'duScroll',
        'angular.vertilize',
        'luegg.directives'
    ]);

    app.constant('config', globalConf);

    app.config(function($animateProvider) {
        $animateProvider.classNameFilter(/angular-animate/);
    });

    app.config(function(uiSelectConfig) {
        uiSelectConfig.theme = 'bootstrap';
    });

    var defaultResponseTransformer = function (data, headersGetter) {
        return JSON.parse(data).results;
    };

    app.factory('wnwbApi', ['config', '$resource', function(config, $resource) {
        return {
            Version: $resource(config.API_URL+'version/', {}, {}, {stripTrailingSlashes: false}),
            sensereltype: $resource(config.API_URL+'sensereltype/:id/', {}, {}, {stripTrailingSlashes: false}),
            Authorization: $resource(config.API_AUTH_URL, {}, {
                auth: {
                    method: 'POST',
                    params: {

                    }
                }
            }, {stripTrailingSlashes: false}),
            Lexicon: $resource(config.API_URL+'lexicon/:id/', {}, {
                get: {
                    method: 'GET',
                    isArray: false
                },
                query: {
                    method: 'GET',
                    transformResponse: [defaultResponseTransformer],
                    isArray: true
                }
            }, {stripTrailingSlashes: false}),
            Sense: $resource(config.API_URL+'sense/:id/', {}, {
                update: {
                    method: 'PUT'
                },
                query: {
                    method: 'GET',
                    transformResponse: [defaultResponseTransformer],
                    isArray: true
                }
            }, {stripTrailingSlashes: false}),
            SynSet: $resource(config.API_URL+'synset/:id/', {}, {
                update: {
                    method: 'PUT'
                },
                query: {
                    method: 'GET',
                    transformResponse: [defaultResponseTransformer],
                    isArray: true
                }
            }, {stripTrailingSlashes: false}),
            HyperonymRelTree: $resource(config.API_URL+'hypers/', {}, {
                get: {
                    method: 'GET',
                    isArray: true
                }
            }, {stripTrailingSlashes: false}),
            HyponymRelTree: $resource(config.API_URL+'hypos/', {}, {
                get: {
                    method: 'GET',
                    isArray: true
                }
            }, {stripTrailingSlashes: false}),
            SiblingRelTree: $resource(config.API_URL+'sibs/', {}, {
                get: {
                    method: 'GET',
                    isArray: true
                }
            }, {stripTrailingSlashes: false}),
            OtherRelTree: $resource(config.API_URL+'rels/', {}, {
                get: {
                    method: 'GET',
                    isArray: true
                }
            }, {stripTrailingSlashes: false}),
            Domain: $resource(config.API_URL+'domain/:id/', {}, {
                update: {
                    method: 'PUT'
                },
                query: {
                    method: 'GET',
                    transformResponse: [defaultResponseTransformer],
                    isArray: true
                }/*,
                delete: { method: 'DELETE', params: { id: 0 } }*/
            }, {stripTrailingSlashes: false}),
            SenseRel: $resource(config.API_URL+'senserel/:id/', {}, {}, {stripTrailingSlashes: false}),
            SynSetRel: $resource(config.API_URL+'synsetrel/:id/', {}, {}, {stripTrailingSlashes: false}),
            SenseRelType: $resource(config.API_URL+'sensereltype/:id/', {}, {
                update: {
                    method: 'PUT'
                },
                query: {
                    method: 'GET',
                    transformResponse: [defaultResponseTransformer],
                    isArray: true
                }
            }, {stripTrailingSlashes: false}),
            SynSetRelType: $resource(config.API_URL+'synsetreltype/:id/', {}, {
                update: {
                    method: 'PUT'
                },
                query: {
                    method: 'GET',
                    transformResponse: [defaultResponseTransformer],
                    isArray: true
                }
            }, {stripTrailingSlashes: false}),
            ExtRelType: $resource(config.API_URL+'extreltype/:id/', {}, {
                update: {
                    method: 'PUT'
                },
                query: {
                    method: 'GET',
                    transformResponse: [defaultResponseTransformer],
                    isArray: true
                }
            }, {stripTrailingSlashes: false}),
            ExtSystem: $resource(config.API_URL+'extsystem/:id/', {}, {
                update: {
                    method: 'PUT'
                },
                query: {
                    method: 'GET',
                    transformResponse: [defaultResponseTransformer],
                    isArray: true
                }
            }, {stripTrailingSlashes: false}),
            LexicalEntry: $resource(config.API_URL+'lexentry/', {}, {
                query: {
                    method: 'GET',
                    transformResponse: [defaultResponseTransformer],
                    isArray: true
                }
            }, {stripTrailingSlashes: false})
        };
    }]);

    return app;
});