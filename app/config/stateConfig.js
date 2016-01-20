define([
    'angularAMD',
    'controller/sense/DefinitionCtrl',
    'controller/common/AnchorCtrl',
    'controller/OrphanSenseCtrl'
], function (angularAMD) {
    return {
        setStates: function ($stateProvider, $urlRouterProvider, $ocLazyLoad, $document) {

            $urlRouterProvider.otherwise("/err404");

            $urlRouterProvider.when('', '/auth');
            $urlRouterProvider.when('/', '/auth');

            /*$stateProvider.state(
                'err404', angularAMD.route({
                    url: "/err404",
                    templateUrl: "views/page404.html",
                    controller: 'NotFoundController',
                    breadcrumb: {
                        title: 'Lehekülge ei leitud'
                    },
                    data: {
                        specialClass: 'gray-bg'
                    },
                    role: 'all'
                }));*/

            $stateProvider.state(
                'home', angularAMD.route({
                    url: "/home",
                    templateUrl: "view/home/home.html?2",
                    controller: 'HomeCtrl',
                    breadcrumb: {
                        hide: true,
                        title: 'Home'
                    }
                }));

            $stateProvider.state(
                'auth', angularAMD.route({
                    url: "/auth",
                    views: {
                        "authview": {
                            templateUrl: "view/auth/auth.html?1",
                            controller: 'AuthCtrl'
                        }
                    },
                    breadcrumb: {
                        title: 'Sisselogimine'
                    },
                    data: {
                        specialClass: 'gray-bg'
                    },
                    role: 'all'
                }));



            ///////////////////////
            // Synset states
            ///////////////////////

            $stateProvider.state(
                'synset', angularAMD.route({
                    url: "/synset/{id:[0-9]*}",
                    params: {
                        id: { squash: true, value: null }
                    },
                    views: {
                        'anchor': {
                            templateUrl: 'view/common/anchor.html?1',
                            controller: 'common/AnchorCtrl'
                        },
                        '': {
                            templateUrl: 'view/synSet/synSet.html?2',
                            controller: 'SynSetCtrl'
                        }
                    }
                }));

            $stateProvider.state(
                'synset.def', angularAMD.route({
                    parent: 'synset',
                    url: "/def/{defId:[0-9]*}",
                    templateUrl: "view/sense/senseDefinition.html?1",
                    controller: 'controller/sense/DefinitionCtrl',
                    resolve: {

                    }
                }));

            $stateProvider.state(
                'synset.sense', angularAMD.route({
                    parent: 'synset',
                    url: "/sense/{senseId:[0-9]*}",
                    params: {
                        senseId: { squash: true, value: null }
                    },
                    templateUrl: "view/sense/sense.html?1",
                    controller: 'SenseCtrl',
                    resolve: {
                        sense: function ($stateParams, wnwbApi) {
                            var senseId = 0;
                            if($stateParams.senseId) {
                                senseId = $stateParams.senseId;
                            }

                            if(senseId) {
                                var sense = wnwbApi.Sense.get({id: senseId}).$promise;
                                return sense;
                            } else {
                                var sense = new wnwbApi.Sense();
                                /*sense.lexical_entry = {lexicon: $scope.$storage.currentLexicon.id, part_of_speech: 'n', lemma: ''};
                                sense.status = 'D';
                                sense.nr = 1;
                                sense.sense_definitions = [];
                                sense.examples = [];
                                sense.relations = [];
                                sense.sense_externals = [];*/

                                return sense;
                            }
                        }
                    }
                }));
            $stateProvider.state(
                'synset.sense.def', angularAMD.route({
                    //parent: 'synset.sense',
                    url: "/def/{defId:[0-9]*}",
                    templateUrl: "view/sense/senseDefinition.html?1",
                    controller: 'controller/sense/DefinitionCtrl'
                }));
            $stateProvider.state(
                'synset.sense.rel', angularAMD.route({
                    parent: 'synset.sense',
                    url: "/def/{relId:[0-9]*}",
                    templateUrl: "view/sense/senseDefinition.html?1",
                    controller: 'controller/sense/DefinitionCtrl'
                }));

            $stateProvider.state(
                'synset.rel', angularAMD.route({
                    parent: 'synset',
                    url: "/rel/{relId:[0-9]*}",
                    templateUrl: "view/synSet/synSetRelation.html?1",
                    controller: 'controller/synset/RelCtrl'
                }));



            ///////////////////////
            // Orphan sense states
            ///////////////////////

            $stateProvider.state(
                'sense', angularAMD.route({
                    url: "/sense/{senseId:[0-9]*}",
                    params: {
                        senseId: { squash: true, value: null }
                    },
                    views: {
                        'anchor': {
                            templateUrl: 'view/common/anchor.html?1',
                            controller: 'common/AnchorCtrl'
                        },
                        '': {
                            controller: 'OrphanSenseCtrl',
                            templateUrl: 'view/sense/orphansense.html?1'
                        }
                    }
                }));

            $stateProvider.state(
                'sense.rel', angularAMD.route({
                    parent: 'sense',
                    url: '/rel'/*,
                     views : {
                     '@sense.def': {
                     templateUrl: "view/sense/senseDefinitionTab.html?1"
                     },
                     'tabCtrl': {
                     controller: 'controller/sense/DefinitionTabCtrl'
                     }
                     }*/
                }));

            $stateProvider.state(
                'sense.def', angularAMD.route({
                    parent: 'sense',
                    url: "/def/{defId:[0-9]*}",
                    params: {
                        defId: { squash: true, value: null }
                    },
                    templateUrl: "view/sense/senseDefinition.html?1",
                    controller: 'controller/sense/DefinitionCtrl'
                }));



            /////////////////
            // Admin states
            /////////////////

            $stateProvider.state(
                'admin', angularAMD.route({
                    abstract: true,
                    url: '/admin',
                    templateUrl: 'view/admin/admin.html?2',
                    controller: 'AdminCtrl'
                })
            );

            $stateProvider.state(
                'admin.sensereltype', angularAMD.route({
                    url: '',
                    templateUrl: 'view/admin/senseRelTypes.html?2',
                    controller: 'admin/SenseRelTypeCtrl',
                    controllerUrl: 'controller/admin/SenseRelTypeCtrl'
                })
            );

            $stateProvider.state(
                'admin.synsetreltype', angularAMD.route({
                    url: '/synsetreltype',
                    templateUrl: 'view/admin/synSetRelTypes.html?2',
                    controller: 'admin/SynSetRelTypeCtrl',
                    controllerUrl: 'controller/admin/SynSetRelTypeCtrl'
                })
            );

            $stateProvider.state(
                'admin.extreftype', angularAMD.route({
                    url: '/extreftype',
                    templateUrl: 'view/admin/extRefTypes.html?2',
                    controller: 'admin/ExtRefTypeCtrl',
                    controllerUrl: 'controller/admin/ExtRefTypeCtrl'
                })
            );

            $stateProvider.state(
                'admin.domain', angularAMD.route({
                    url: '/domain',
                    templateUrl: 'view/admin/domains.html?2',
                    controller: 'admin/DomainCtrl',
                    controllerUrl: 'controller/admin/DomainCtrl'
                })
            );

            $stateProvider.state(
                'admin.sensestyle', angularAMD.route({
                    url: '/sensestyle',
                    templateUrl: 'view/admin/senseStyles.html?2',
                    controller: 'admin/SenseStyleCtrl',
                    controllerUrl: 'controller/admin/SenseStyleCtrl'
                })
            );

            $stateProvider.state(
                'admin.user', angularAMD.route({
                    url: '/user',
                    templateUrl: 'view/admin/users.html?2',
                    controller: 'admin/UserCtrl',
                    controllerUrl: 'controller/admin/UserCtrl'
                })
            );
        }
    };
});