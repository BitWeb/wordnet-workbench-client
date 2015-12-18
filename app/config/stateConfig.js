define(['angularAMD'], function (angularAMD) {
    return {
        setStates: function ($stateProvider, $urlRouterProvider, $ocLazyLoad, $document) {

            //$urlRouterProvider.otherwise("/err404");

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

            /* Synset */
            $stateProvider.state(
                'synset', angularAMD.route({
                    url: "/synset/{id:[0-9]*}",
                    templateUrl: "view/synSet/synSet.html?2",
                    controller: 'SynSetCtrl',
                    breadcrumb: {
                        hide: true,
                        title: 'SynSet'
                    }
                }));
            $stateProvider.state(
                'synset.def', angularAMD.route({
                    parent: 'synset',
                    url: "/def/{defId:[0-9]*}",
                    templateUrl: "view/def.html?1",
                    controller: 'controller/DefCtrl',
                    resolve: {

                    }
                }));
            $stateProvider.state(
                'synset.sense', angularAMD.route({
                    parent: 'synset',
                    url: "/sense/{senseId:[0-9]*}",
                    templateUrl: "view/sense/senseCommon.html?1",
                    controller: 'controller/common/SenseCtrl',
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
                                sense.lexical_entry = {lexicon: $scope.$storage.currentLexicon.id, part_of_speech: 'n', lemma: ''};
                                sense.status = 'D';
                                sense.nr = 1;
                                sense.sense_definitions = [];
                                sense.examples = [];
                                sense.relations = [];
                                sense.sense_externals = [];

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

            /* Sense */
            $stateProvider.state(
                'sense', angularAMD.route({
                    url: "/sense/{id:[0-9]*}",
                    templateUrl: "view/sense/sense.html?1",
                    controller: 'SenseCtrl',
                    breadcrumb: {
                        hide: true,
                        title: 'Avaleht'
                    }
                }));

            $stateProvider.state(
                'sense.def', angularAMD.route({
                    parent: 'sense',
                    url: "/def/{defId:[0-9]*}",
                    templateUrl: "view/sense/senseDefinition.html?1",
                    controller: 'controller/sense/DefinitionCtrl'
                }));
            $stateProvider.state(
                'sense.rel', angularAMD.route({
                    parent: 'sense',
                    url: "/rel",
                    templateUrl: "view/sense/senseRelation.html?1"
                }));

            $stateProvider.state(
                'admin', angularAMD.route({
                    url: "/admin",
                    templateUrl: "view/admin/admin.html?2",
                    controller: 'AdminCtrl',
                    breadcrumb: {
                        hide: true,
                        title: 'Avaleht'
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

            $stateProvider.state('projectState', {
                url: "/project",
                abstract: true,
                template: '<ui-view/>',
                onEnter: function(){}
            });

            /*$stateProvider.state('projects',
                angularAMD.route({
                    parent: 'projectState',
                    url: "/list",
                    templateUrl: "views/project/list_view.html",
                    controller: 'ProjectListController',
                    resolve: {
                        loadPlugin: function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    insertBefore: '#loadBefore',
                                    name: 'localytics.directives',
                                    files: ['assets/css/plugins/chosen/chosen.css']
                                }
                            ]);
                        }
                    },
                    breadcrumb: {
                        parent: 'home',
                        title: 'Projektid'
                    }
                })
            );*/

            $stateProvider.state('projectItemState', {
                parent: 'projectState',
                url: "/{projectId:[0-9]{1,8}}",
                abstract: true,
                template: '<ui-view/>'
            });

            /*$stateProvider.state('project-item',
                angularAMD.route({
                    parent: 'projectItemState',
                    url: "", //
                    templateUrl: "views/project/view.html",
                    controller: 'ProjectViewController',
                    resolve: {
                        loadPlugin: function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    insertBefore: '#loadBefore',
                                    name: 'localytics.directives',
                                    files: ['assets/css/plugins/chosen/chosen.css']
                                }
                            ]);
                        }
                    },
                    breadcrumb: {
                        parent: 'projects',
                        title: '{{projectId}}',
                        attributes: '{projectId: projectId}'
                    }
                })
            );*/

            /*$stateProvider.state('project-resource-upload',
                angularAMD.route({
                    parent: 'projectItemState',
                    url: "/resource-upload", //
                    templateUrl: "views/project/resource_upload.html",
                    controller: 'ProjectResourceUploadController',
                    resolve: {
                        loadPlugin: function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    files: ['assets/css/plugins/dropzone/basic.css', 'assets/css/plugins/dropzone/dropzone.css']
                                }
                            ]);
                        }
                    },
                    breadcrumb: {
                        parent: 'project-item',
                        title: 'Ressursside haldus',
                        attributes: '{projectId: projectId}'
                    }
                })
            );*/

            $stateProvider.state('workflowItemState', {
                parent: 'projectItemState',
                url: "/workflow/{workflowId:[0-9]{1,8}}",
                abstract: true,
                template: '<ui-view/>'
            });

            /*$stateProvider.state('workflow-definition-edit',
                angularAMD.route({
                    parent: 'workflowItemState',
                    url: "/definition", //
                    templateUrl: "views/workflow/definition_edit.html",
                    controller: 'WorkflowDefinitionEditController',
                    resolve: {
                        loadPlugin: function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    insertBefore: '#loadBefore',
                                    name: 'localytics.directives',
                                    files: ['assets/css/plugins/chosen/chosen.css']
                                }
                            ]);
                        }
                    },
                    breadcrumb: {
                        parent: 'project-item',
                        title: 'Töövoo {{workflowId}} definitsioon',
                        attributes: '{workflowId: workflowId}'
                    }
                })
            );*/

            /*$stateProvider.state( 'workflow-view',
                angularAMD.route({
                    parent: 'workflowItemState',
                    url: "", //
                    templateUrl: "views/workflow/view.html",
                    controller: 'WorkflowViewController',
                    resolve: {
                        loadPlugin: function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    insertBefore: '#loadBefore',
                                    name: 'localytics.directives',
                                    files: ['assets/css/plugins/chosen/chosen.css']
                                }
                            ]);
                        }
                    },
                    breadcrumb: {
                        parent: 'project-item',
                        title: "{{workflowId}}",
                        attributes: '{workflowId: workflowId}'
                    }
                })
            );*/

            /*$stateProvider.state(
                'workflow-resource-upload', angularAMD.route({
                    parent: 'workflowItemState',
                    url: "/resource-upload", //
                    templateUrl: "views/workflow/resource_upload.html",
                    controller: 'WorkflowResourceUploadController',
                    resolve: {
                        loadPlugin: function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    files: ['assets/css/plugins/dropzone/basic.css', 'assets/css/plugins/dropzone/dropzone.css',]
                                }
                            ]);
                        }
                    },
                    breadcrumb: {
                        parent: 'workflow-definition-edit',
                        title: "Ressursside lisamine",
                        attributes: '{workflowId: workflowId}'
                    }
                })
            );*/


            $stateProvider.state('workflowManagementState', {
                    url: "/workflow-management",
                    abstract: true,
                    template: '<ui-view/>'
                }
            );

            /*$stateProvider.state('workflow-management-list',
                angularAMD.route({
                    parent: 'workflowManagementState',
                    url: "/list", //
                    templateUrl: "views/workflow/management_list.html",
                    controller: 'WorkflowManagementListController',
                    resolve: {
                        loadPlugin: function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    insertBefore: '#loadBefore',
                                    name: 'localytics.directives',
                                    files: ['assets/css/plugins/chosen/chosen.css']
                                }
                            ]);
                        }
                    },
                    breadcrumb: {
                        parent: 'home',
                        title: 'Töövoogude haldus'
                    }
                })
            );*/

            /*$stateProvider.state( 'workflow-management-item',
                angularAMD.route({
                    parent: 'workflowManagementState',
                    url: "/workflow/{workflowId:[0-9]{1,8}}",
                    templateUrl: "views/workflow/view.html",
                    controller: 'WorkflowViewController',
                    resolve: {
                        loadPlugin: function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    insertBefore: '#loadBefore',
                                    name: 'localytics.directives',
                                    files: ['assets/css/plugins/chosen/chosen.css']
                                }
                            ]);
                        }
                    },
                    breadcrumb: {
                        parent: 'workflow-management-list',
                        title: "{{workflowId}}",
                        attributes: '{workflowId: workflowId}'
                    }
                })
            );*/
            ///


            /*$stateProvider.state('serviceState', {
                    abstract: true,
                    url: '/service',
                    template: '<ui-view/>'
                }
            ).state('services', angularAMD.route({
                    parent: 'serviceState',
                    url: '',
                    templateUrl: 'views/service/list.html',
                    controller: 'ServiceListController',
                    breadcrumb: {
                        parent: 'home',
                        title: "Teenuste haldus"
                    }
                })
            ).state('service-edit', angularAMD.route({
                    parent: 'serviceState',
                    url: '/{serviceId:[0-9]{1,8}}',
                    templateUrl: 'views/service/edit.html',
                    controller: 'ServiceEditController',
                    resolve: {
                        loadPlugin: function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    files: ['assets/css/plugins/iCheck/custom.css']
                                },
                                {
                                    insertBefore: '#loadBefore',
                                    name: 'localytics.directives',
                                    files: ['assets/css/plugins/chosen/chosen.css']
                                }
                            ]);
                        }
                    },
                    breadcrumb: {
                        parent: 'services',
                        title: "{{serviceId}}",
                        attributes: '{serviceId: serviceId}'
                    }
                })
            ).state('service-insert', angularAMD.route({
                    parent: 'serviceState',
                    url: '/insert',
                    templateUrl: 'views/service/edit.html',
                    controller: 'ServiceEditController',
                    resolve: {
                        loadPlugin: function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    files: ['assets/css/plugins/iCheck/custom.css']
                                },
                                {
                                    insertBefore: '#loadBefore',
                                    name: 'localytics.directives',
                                    files: ['assets/css/plugins/chosen/chosen.css']
                                }
                            ]);
                        }
                    },
                    breadcrumb: {
                        parent: 'services',
                        title: "Teenuse lisamine"
                    }
                })
            ).state('service-statistics', angularAMD.route({
                    parent: 'serviceState',
                    url: '/{serviceId:[0-9]{1,8}}/statistics',
                    templateUrl: 'views/service/statistics.html',
                    controller: 'ServiceStatisticsController',
                    breadcrumb: {
                        parent: 'services',
                        title: "{{serviceId}} statistika",
                        attributes: '{serviceId: serviceId}'
                    }
                })
            );*/

            $stateProvider.state('resourceTypeState', {
                    abstract: true,
                    url: '/resource-type',
                    template: '<ui-view/>'
                }
            ).state('resource-types', angularAMD.route({
                    parent: 'resourceTypeState',
                    url: '',
                    templateUrl: 'views/resource_type/list.html',
                    controller: 'ResourceTypeListController',
                    breadcrumb: {
                        parent: 'home',
                        title: "Ressursi tüüpide haldus"
                    }
                })
            ).state('resource-type-insert', angularAMD.route({
                    parent: 'resourceTypeState',
                    url: '/insert',
                    templateUrl: 'views/resource_type/edit.html',
                    controller: 'ResourceTypeEditController',
                    breadcrumb: {
                        parent: 'resource-types',
                        title: "Ressursi tüübi lisamine"
                    }
                })
            ).state('resource-type-edit', angularAMD.route({
                    parent: 'resourceTypeState',
                    url: '/{resourceTypeId:[0-9]{1,8}}',
                    templateUrl: 'views/resource_type/edit.html',
                    controller: 'ResourceTypeEditController',
                    breadcrumb: {
                        parent: 'resource-types',
                        title: '{{resourceTypeId}}',
                        attributes: '{resourceTypeId: resourceTypeId}'
                    }
                }));


            $stateProvider.state('notification', angularAMD.route({
                    url: '/notification',
                    templateUrl: 'views/notification/list.html',
                    controller: 'NotificationListController',
                    breadcrumb: {
                        parent: 'home',
                        title: "Teavitused"
                    }
                })
            );
            $stateProvider.state('notification-read', angularAMD.route({
                    url: '/notification/{notificationId:[0-9]{1,8}}/read',
                    //templateUrl: 'views/notification/list.html',
                    controller: 'NotificationReadController',
                    breadcrumb: {
                        parent: 'home',
                        title: "Teavitused"
                    }
                })
            );

            $stateProvider.state('usersState',
                {
                    url: '/user',
                    abstract: true,
                    template: '<ui-view/>'
                }
            ).state('users', angularAMD.route({
                    parent: 'usersState',
                    url: '',
                    templateUrl: 'views/user/list.html',
                    controller: 'UserListController',
                    breadcrumb: {
                        parent: 'home',
                        title: 'Kasutajate haldus'
                    }
                })
            ).state('user-edit', angularAMD.route({
                    parent: 'usersState',
                    url: '/{userId:[0-9]{1,8}}',
                    templateUrl: 'views/user/edit.html',
                    controller: 'UserEditController',
                    breadcrumb: {
                        parent: 'users',
                        title: "{{userId}}",
                        attributes: '{userId: userId}'
                    }
                })
            );

            $stateProvider.state('statisticsState',
                {
                    url: '/statistics',
                    abstract: true,
                    template: '<ui-view/>'
                }
            ).state('statistics', angularAMD.route({
                    parent: 'statisticsState',
                    url: '',
                    templateUrl: 'views/statistics/index.html',
                    controller: 'StatisticsIndexController',
                    breadcrumb: {
                        parent: 'home',
                        title: 'Statistika'
                    }
                })
            );

        }
    };
});