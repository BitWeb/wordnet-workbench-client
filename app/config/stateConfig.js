define([
	'angularAMD',
	'controller/sense/DefinitionCtrl',
	'controller/common/AnchorCtrl',
	'controller/OrphanSenseCtrl',
    'controller/LexiconCtrl',
], function(angularAMD) {
	return {
		setStates : function($stateProvider, $urlRouterProvider, $ocLazyLoad, $document) {

			$urlRouterProvider.otherwise("/err404");

			$urlRouterProvider.when('', '/auth');
			$urlRouterProvider.when('/', '/auth');
            $urlRouterProvider.when('home', 'lexicon.stat');

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
					url : "/home/{lexId:[0-9]*}",
                    params : {
						lexId : {
							squash : true,
							value : null
						},
						currentLexiconId : {
							squash : true,
							value : null
						}
					},
					templateUrl : "view/home/newhome.html?2",
					controller : 'NewHomeCtrl',
					breadcrumb : {
						hide : true,
						title : 'Home'
					}
				}));

          
            
			$stateProvider.state(
				'auth', angularAMD.route({
					url : "/auth",
					views : {
						"authview" : {
							templateUrl : "view/auth/auth.html?1",
							controller : 'AuthCtrl'
						}
					},
					breadcrumb : {
						title : 'Login'
					},
					data : {
						specialClass : 'gray-bg'
					},
					role : 'all'
				}));
            
            ///////////////////////
            // SearchResultState
            //////////////////////
              $stateProvider.state(
				'extsearch', angularAMD.route({
					url : "/extsearch",
                    templateUrl : "view/extsearch/extendedSearchResult.html?1",
                    controller: 'ExtendedSearchResultCtrl',
				}));
            
            /////////////////
            //Lexicon state
            /////////////////
            $stateProvider.state(
				'lexicon', angularAMD.route({
					url : "/lex/{lexId:[0-9]*}",
					params : {
						lexId : {
							squash : true,
							value : null
						},
						currentLexiconId : {
							squash : true,
							value : null
						}
					},
					views : {
	   
						'' : {
							templateUrl : 'view/lexicon/lexicon.html?1',
							controller : 'LexiconCtrl'
						},
                        'anchor' : {
							templateUrl : 'view/common/anchor.html?2',
							controller : 'common/AnchorCtrl'
						}
					},
					resolve : {
                        lexicons : [ 'service/LexiconService', function(LexiconService) {
							return LexiconService.getLexicons();
						} ],
						
					}
				}));

            
            $stateProvider.state(
				'lexicon.stat', angularAMD.route({
                    parent: 'lexicon',
					url : "/stat",
					templateUrl : "view/home/home.html?2",
					controller : 'HomeCtrl',
					breadcrumb : {
						hide : true,
						title : 'Home'
					},
					resolve : {
						stats : [ 'service/StatsService', function(statsService) {
							return statsService.getList();
						} ]
					}
				}));
 
			///////////////////////
				// Synset states
				///////////////////////

			$stateProvider.state(
				'lexicon.synset', angularAMD.route({
                    parent : 'lexicon',
					url : "/synset/{id:[0-9]*}",
					params : {
						id : {
							squash : true,
							value : null
						},
						currentSynSetId : {
							squash : true,
							value : null
						}
					},
					views : {
						'anchor' : {
							templateUrl : 'view/common/anchor.html?2',
							controller : 'common/AnchorCtrl'
						},
						'' : {
							templateUrl : 'view/synSet/synSet.html?3',
							controller : 'SynSetCtrl'
						}
					},
					resolve : {
						relTypes : [ 'service/SynSetRelTypeService', function(relTypeService) {
							return relTypeService.getList();
						} ],
						extRelTypes : [ 'service/ExtRelTypeService', function(extRelTypeService) {
							return extRelTypeService.getList();
						} ],
						extSystems : [ 'service/ExtSystemService', function(extSystemService) {
							return extSystemService.getList();
						} ]
					}
				}));

			$stateProvider.state(
				'lexicon.synset_edit', angularAMD.route({
                    parent : 'lexicon',
					url : "/synset_e/{id:[0-9]*}",
					params : {
						id : {
							squash : true,
							value : null
						},
						currentSynSetId : {
							squash : true,
							value : null
						}
					},
					views : {
						'anchor' : {
							templateUrl : 'view/common/anchor.html?2',
							controller : 'common/AnchorCtrl'
						},
						'' : {
							templateUrl : 'view/synSet/synSet.html?3',
							controller : 'SynSetCtrl'
						}
					},
					resolve : {
						relTypes : [ 'service/SynSetRelTypeService', function(relTypeService) {
							return relTypeService.getList();
						} ],
						extRelTypes : [ 'service/ExtRelTypeService', function(extRelTypeService) {
							return extRelTypeService.getList();
						} ],
						extSystems : [ 'service/ExtSystemService', function(extSystemService) {
							return extSystemService.getList();
						} ]
					}
				}));

			$stateProvider.state(
				'lexicon.synset.def', angularAMD.route({
					parent : 'lexicon.synset',
					url : "/def/{defId:[0-9]*}",
					params : {
						defId : {
							squash : true,
							value : null
						}
					},
					templateUrl : "view/sense/senseDefinition.html?1",
					controller : 'controller/sense/DefinitionCtrl',
					resolve : {

					}
				}));

			$stateProvider.state(
				'lexicon.synset_edit.def_edit', angularAMD.route({
					parent : 'lexicon.synset_edit',
					url : "/def_e/{defId:[0-9]*}",
					params : {
						defId : {
							squash : true,
							value : null
						}
					},
					templateUrl : "view/sense/senseDefinitionEdit.html?1",
					controller : 'controller/sense/DefinitionCtrl',
					resolve : {

					}
				}));

			$stateProvider.state(
				'lexicon.synset.sense', angularAMD.route({
					parent : 'lexicon.synset',
					url : "/sense/{senseId:[0-9]*}",
					params : {
						senseId : {
							squash : true,
							value : null
						},
						senseObj : {
							squash : true,
							value : null
						}
					},
					templateUrl : "view/sense/sense.html?1",
					controller : 'SenseCtrl',
					resolve : {
						sense : function($stateParams, wnwbApi) {
							var senseObj = null;
							if ($stateParams.senseObj) {
								senseObj = $stateParams.senseObj;
							} else if ($stateParams.senseId) {
								senseObj = wnwbApi.Sense.get({
									id : $stateParams.senseId
                                    , ss_pk : $stateParams.id
                                    , lexid : $stateParams.lexId
								}).$promise;
							}
							return senseObj;
						},
						relTypes : [ 'service/SenseRelTypeService', function(relTypeService) {
							return relTypeService.getList();
						} ],
						senseStyles : [ 'service/SenseStyleService', function(senseStyleService) {
							return senseStyleService.getList();
						} ],
						extRelTypes : [ 'service/ExtRelTypeService', function(extRelTypeService) {
							return extRelTypeService.getList();
						} ],
						extSystems : [ 'service/ExtSystemService', function(extSystemService) {
							return extSystemService.getList();
						} ]
					}
				}));

			$stateProvider.state(
				'lexicon.synset_edit.sense_edit', angularAMD.route({
					parent : 'lexicon.synset_edit',
					url : "/sense_e/{senseId:[0-9]*}",
					params : {
						senseId : {
							squash : true,
							value : null
						},
						senseObj : {
							squash : true,
							value : null
						}
					},
					templateUrl : "view/sense/sense.html?1",
					controller : 'SenseCtrl',
					resolve : {
						sense : function($stateParams) {
							var senseObj = null;
							if ($stateParams.senseObj) {
								senseObj = $stateParams.senseObj;
							}
							return senseObj;
						},
						relTypes : [ 'service/SenseRelTypeService', function(relTypeService) {
							return relTypeService.getList();
						} ],
						senseStyles : [ 'service/SenseStyleService', function(senseStyleService) {
							return senseStyleService.getList();
						} ],
						extRelTypes : [ 'service/ExtRelTypeService', function(extRelTypeService) {
							return extRelTypeService.getList();
						} ],
						extSystems : [ 'service/ExtSystemService', function(extSystemService) {
							return extSystemService.getList();
						} ]
					}
				}));

			$stateProvider.state(
				'lexicon.synset.sense.def', angularAMD.route({
					//parent: 'lexicon.synset.sense',
                    
					url : "/def/{defId:[0-9]*}",
					params : {
						defId : {
							squash : true,
							value : null
						}
					},
					templateUrl : "view/sense/senseDefinition.html?1",
					controller : 'controller/sense/DefinitionCtrl'
				}));

			$stateProvider.state(
				'lexicon.synset_edit.sense_edit.def_edit', angularAMD.route({
					parent: 'lexicon.synset_edit.sense_edit',
					url : "/def_e/{defId:[0-9]*}",
					params : {
						defId : {
							squash : true,
							value : null
						}
					},
					templateUrl : "view/sense/senseDefinitionEdit.html?1",
					controller : 'controller/sense/DefinitionCtrl'
				}));

			$stateProvider.state(
				'lexicon.synset.sense.rel', angularAMD.route({
					parent : 'lexicon.synset.sense',
					url : "/rel/{relId:[0-9]*}",
					params : {
						relId : {
							squash : true,
							value : null
						},
						relTypeId : {
							squash : true,
							value : null
						},
						relDir : {
							squash : true,
							value : null
						}
					},
					templateUrl : "view/sense/senseRelation.html?1",
					controller : 'sense/RelCtrl',
					controllerUrl : 'controller/sense/RelCtrl'
				}));

			$stateProvider.state(
				'lexicon.synset_edit.sense_edit.rel_edit', angularAMD.route({
					parent : 'lexicon.synset_edit.sense_edit',
					url : "/rel_e/{relId:[0-9]*}",
					params : {
						relId : {
							squash : true,
							value : null
						},
						relTypeId : {
							squash : true,
							value : null
						},
						relDir : {
							squash : true,
							value : null
						}
					},
					templateUrl : "view/sense/senseRelationEdit.html?1",
					controller : 'sense/RelCtrl',
					controllerUrl : 'controller/sense/RelCtrl'
				}));

			$stateProvider.state(
				'lexicon.synset.rel', angularAMD.route({
					parent : 'lexicon.synset',
					url : "/rel/{relId:[0-9]*}",
					params : {
						relId : {
							squash : true,
							value : null
						},
						relTypeId : {
							squash : true,
							value : null
						},
						relDir : {
							squash : true,
							value : null
						}
					},
					templateUrl : "view/synSet/synSetRelation.html?1",
					controller : 'SynSetRelCtrl',
				    controllerUrl: 'controller/synset/SynSetRelCtrl'
				}));

			$stateProvider.state(
				'lexicon.synset_edit.rel_edit', angularAMD.route({
					parent : 'lexicon.synset_edit',
					url : "/rel_e/{relId:[0-9]*}",
					params : {
						relId : {
							squash : true,
							value : null
						},
						relTypeId : {
							squash : true,
							value : null
						},
						relDir : {
							squash : true,
							value : null
						}
					},
					templateUrl : "view/synSet/synSetRelationEdit.html?1",
					controller : 'SynSetRelCtrl',
				    controllerUrl: 'controller/synset/SynSetRelCtrl'
				}));


			///////////////////////
				// Orphan sense states
				///////////////////////

			$stateProvider.state(
				'lexicon.sense', angularAMD.route({
                    paren : 'lexicon',
					url : "/sense/{senseId:[0-9]*}",
					params : {
						senseId : {
							squash : true,
							value : null
						}
					},
					views : {
						'anchor' : {
							templateUrl : 'view/common/anchor.html?1',
							controller : 'common/AnchorCtrl'
						},
						'' : {
							controller : 'SenseCtrl',
							templateUrl : 'view/sense/sense.html?1',
							resolve : {
								relTypes : [ 'service/SenseRelTypeService', function(relTypeService) {
									return relTypeService.getList();
								} ],
								senseStyles : [ 'service/SenseStyleService', function(senseStyleService) {
									return senseStyleService.getList();
								} ],
								extRelTypes : [ 'service/ExtRelTypeService', function(extRelTypeService) {
									return extRelTypeService.getList();
								} ],
								extSystems : [ 'service/ExtSystemService', function(extSystemService) {
									return extSystemService.getList();
								} ]
							}
						}
					}
				}));
            


			$stateProvider.state(
				'lexicon.sense.rel', angularAMD.route({
					parent : 'lexicon.sense',
					url : '/rel',
					templateUrl : "view/sense/senseRelation.html?1",
					controllerUrl : 'controller/sense/RelCtrl',
					controller : 'sense/RelCtrl'
				}));

			$stateProvider.state(
				'lexicon.sense.def', angularAMD.route({
					parent : 'lexicon.sense',
					url : "/def/{defId:[0-9]*}",
					params : {
						defId : {
							squash : true,
							value : null
						}
					},
					templateUrl : "view/sense/senseDefinition.html?1",
					controller : 'controller/sense/DefinitionCtrl'
				}));



			/////////////////
				// Admin states
				/////////////////

			$stateProvider.state(
				'admin', angularAMD.route({
					abstract : true,
					url : '/admin',
					templateUrl : 'view/admin/admin.html?2',
					controller : 'AdminCtrl'
				})
			);

			$stateProvider.state(
				'admin.sensereltype', angularAMD.route({
					url : '',
					templateUrl : 'view/admin/senseRelTypes.html?2',
					controller : 'admin/SenseRelTypeCtrl',
					controllerUrl : 'controller/admin/SenseRelTypeCtrl'
				})
			);

			$stateProvider.state(
				'admin.synsetreltype', angularAMD.route({
					url : '/synsetreltype',
					templateUrl : 'view/admin/synSetRelTypes.html?2',
					controller : 'admin/SynSetRelTypeCtrl',
					controllerUrl : 'controller/admin/SynSetRelTypeCtrl'
				})
			);

			$stateProvider.state(
				'admin.extreftype', angularAMD.route({
					url : '/extreftype',
					templateUrl : 'view/admin/extRefTypes.html?2',
					controller : 'admin/ExtRefTypeCtrl',
					controllerUrl : 'controller/admin/ExtRefTypeCtrl'
				})
			);

			$stateProvider.state(
				'admin.sensestyle', angularAMD.route({
					url : '/sensestyle',
					templateUrl : 'view/admin/senseStyles.html?2',
					controller : 'admin/SenseStyleCtrl',
					controllerUrl : 'controller/admin/SenseStyleCtrl'
				})
			);

			$stateProvider.state(
				'admin.user', angularAMD.route({
					url : '/user',
					templateUrl : 'view/admin/users.html?2',
					controller : 'admin/UserCtrl',
					controllerUrl : 'controller/admin/UserCtrl'
				})
			);
		}
	};
});