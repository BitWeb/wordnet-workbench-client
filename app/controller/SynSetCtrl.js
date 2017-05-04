define([
	'angularAMD',
	'underscore',
	'TreeViewCtrl',
	'controller/synset/RelationTrees',
	'service/AnchorService',
	'service/LexiconService',
	'service/SynSetRelTypeService',
	'service/SynSetService',
	'service/ExtRelTypeService',
	'service/ExtSystemService'
    
], function(angularAMD) {

	angularAMD.controller('SynSetCtrl', [
		'$scope',
		'$rootScope',
		'$state',
		'$stateParams',
		'$uibModal',
		'$log',
		'$q',
		'wnwbApi',
		'service/DirtyStateService',
		'service/ConfirmModalService',
		'service/AnchorService',
		'service/LexiconService',
		'service/SynSetRelTypeService',
		'service/SynSetService',
		'service/ExtRelTypeService',
		'service/ExtSystemService',
		'spinnerService',
		'relTypes',
		'extRelTypes',
		'extSystems',


		function(
			$scope,
			$rootScope,
			$state,
			$stateParams,
			$uibModal,
			$log,
			$q,
			wnwbApi,
			dirtyStateService,
			confirmModalService,
			anchorService,
			lexiconService,
			relTypeService,
			synSetService,
			extRelTypeService,
			extSystemService,
			spinnerService,
			relTypes,
			extRelTypes,
			extSystems
		) {
                
			if (!$scope.baseState) {
				$scope.baseState = $scope.state;
			}
            
			$scope.language = $rootScope.languageCodeMap[$rootScope.language];

            //for lex-usage directive    
            $scope.searchLemma = '';
            $scope.setSearchLemma = function(lemma) {
                if ($scope.searchLemma == lemma) {
                    lemma = lemma + ' ';
                }
                $scope.searchLemma = lemma;
            };
    
			var dirtyStateHandlerUnbind = dirtyStateService.bindHandler($scope.baseState.name, function() {
				var dirtyDeferred = $q.defer();
				var dirtyPromise = dirtyDeferred.promise;
				if (angular.equals($scope.originalSynSet, $scope.currentSynSet)) {
					dirtyDeferred.resolve(true);
				} else if ($scope.state.name !== 'lexicon.synset_edit') {
					dirtyDeferred.resolve(true);
				} else {
					confirmModalService.open({
						ok : 'Confirm',
						text : 'Current synset contains unsaved changes. Are you sure you want to dismiss these changes?'
					}).then(function(result) {
						if (result) {
							dirtyDeferred.resolve(true);
						} else {
							dirtyDeferred.resolve(false);
						}
					});
				}
				return dirtyPromise;
			});

			$scope.$on('$destroy', function(event) {
				if (dirtyStateHandlerUnbind) {
					dirtyStateHandlerUnbind();
				}
			});

			$scope.relTypeList = null;
			$scope.relTypes = relTypes;

			$scope.extRelTypes = extRelTypes;
			$scope.extSystems = extSystems;


			relTypeListPromise = relTypeService.getList();

			var synSetDeferred = $q.defer();
			var synSetPromise = synSetDeferred.promise;
			$scope.anchorSynSetPromise = null;

			var synSetId = 0;
			if ($stateParams.id) {
				synSetId = $stateParams.id;
			}
			var currentSynSetId = 0;
			if ($stateParams.currentSynSetId) {
				currentSynSetId = $stateParams.currentSynSetId;
			}

			$scope.currentSynSet = null;
			$scope.senseList = null;

			$scope.currentDefinition = null;

			$scope.selectedRel = null;

			$scope.relTree = [];

			$scope.setCurrentSynSet = function(synSet) {
				$scope.originalSynSet = angular.copy(synSet);
				$scope.currentSynSet = synSet;
			// $scope.senseList = angular.copy(synSet.senses);
			};

			$scope.selectSynsetById = function(synSetId) {
				//TODO: navigate to synset
				synSetPromise = wnwbApi.SynSet.get({
					id : synSetId
				}).$promise;
				$scope.synSetPromise = synSetPromise;
				synSetPromise.then(function(synSet) {
					$scope.setCurrentSynSet(synSet);
				});
			};
                
			$scope.selectTab = function(tabName, index) {
                $scope.selectedTabIndex = index;
				if (tabName === 'senseVariants') {
					var nr = $scope.currentSynSet.senses[0].nr;
					var snr = '_';
					if (nr > 0) {
						snr = nr.toString();
					}
					$scope.currentSynSet.senses[0].label = $scope.currentSynSet.senses[0].lexical_entry.lemma + '_' + snr + '(' + $scope.currentSynSet.senses[0].lexical_entry.part_of_speech + ')';
				}
			};



			//////////////////////
			// Definition methods
			//////////////////////

			$scope.selectedDefinition = null;
			$scope.tempDef = {};

			$scope.selectSynsetDefinitionForView = function(def) {
				$scope.selectedDefinition = def;
				if ($scope.selectedDefinition) {
					$state.go('lexicon.synset').then(function() {
						$state.go('lexicon.synset.def', {
							defId : $scope.selectedDefinition.id
						}).then(function() {});
					});
				}
			};

			$scope.selectSynsetDefinitionForEdit = function(def) {
				$scope.selectedDefinition = def;
				if ($scope.selectedDefinition) {
					$state.go('lexicon.synset_edit').then(function() {
						$state.go('lexicon.synset_edit.def_edit', {
							defId : $scope.selectedDefinition.id
						}).then(function() {});
					});
				}
			};

			$scope.getDefinition = function(definitionId) {
				$log.log('controller/SynsetCtrl.getDefinition');
				var deferred = $q.defer();

				if (definitionId) {
					synSetPromise.then(function(synSet) {
						$log.log('get synset definition');
						var definition = synSetService.getDefinitionById(synSet, definitionId);

						if (definition) {
							deferred.resolve(definition);
							return $scope.selectedDefinition = definition;
						} else {
							deferred.reject('not found');
						}
					});
				} else {
					if ($scope.selectedDefinition) {
						deferred.resolve($scope.selectedDefinition);
					} else {
						deferred.resolve(null);
					}
				}

				return deferred.promise;
			};

			$scope.addSynsetDefinition = function() {
				$log.log('SynSetCtrl.addSynsetDefinition');
				$scope.selectedDefinition = null;
				$state.go('lexicon.synset_edit.def_edit').then(function() {
					$log.log('SynSetCtrl.addSynsetDefinition.go edit');
				});
			};

			$scope.deleteSynsetDefinition = function(definition) {
				synSetService.removeDefinition($scope.currentSynSet, definition);
			};

			$scope.saveDefinition = function(definition) {
				//TODO: validate language
				$log.log('SynSetCtrl.saveDefinition');
				if ($scope.selectedDefinition) {
					synSetService.setDefinition($scope.currentSynSet, $scope.selectedDefinition, definition);
				} else {
					synSetService.addDefinition($scope.currentSynSet, definition);
				}
			};

			$scope.discardSynsetDefinition = function() {
				$log.log('SynSetCtrl.discardSynsetDefinition');
				$state.go('lexicon.synset_edit');
			};

			$scope.closeSynsetDefinition = function() {
				$log.log('SynSetCtrl.closeSynsetDefinition');
				$state.go('lexicon.synset');
			};

			$scope.setPrimarySynsetDefinition = function(value) {
				synSetService.setPrimaryDefinition($scope.currentSynSet, value);
			};



			//////////////////////////
			// Sense variants methods
			//////////////////////////

			$scope.selectSenseForView = function(sense) {
				$state.go('lexicon.synset.sense', {
                    lexId: $scope.currentSynSet.lexicon,
                    id: $scope.currentSynSet.id,
                    senseId: sense.id,
					senseObj : sense
				});
				$scope.currentDefinition = null;
			};

			$scope.selectSenseForEdit = function(sense) {
				$state.go('lexicon.synset_edit.sense_edit', {
                    lexId: $scope.currentSynSet.lexicon,
                    id: $scope.currentSynSet.id,
                    senseId: sense.id,
					senseObj : sense
				});
				$scope.currentDefinition = null;
			};

			$scope.removeSense = function(sense) {
				for (k in $scope.currentSynSet.senses) {
					if ($scope.currentSynSet.senses[k].id == sense.id) {
						$scope.currentSynSet.senses.splice(k, 1);
					}
				}
			};

			$scope.createSense = function() {
				$state.go('lexicon.synset_edit.sense_edit', {
					senseId : null
				});
			};

			$scope.addSense = function() {
				return $uibModal.open({
					templateUrl : 'view/main/literalSerachModal.html',
					scope : $scope,
					controller : 'main/literalSearchCtrl',
					resolve : {
						searchType : function() {
							return 'sense';
						},
						lexiconMode : function() {
							return null;
						}
                        , searchMode : function() {return 'select';}
					}
				}).result.then(function(sense) {
					$state.go('lexicon.synset_edit.sense_edit', {
						senseId : sense.id
					});
				},
					function(result) {});
			};

			$scope.saveSense = function(sense) {
				$log.log('save sense');
				var fFound = false;
				for (var i = 0; i < $scope.currentSynSet.senses.length; i++) {
					if ($scope.currentSynSet.senses[i].id == sense.id ||
						(!$scope.currentSynSet.senses[i].id && $scope.currentSynSet.senses[i].lexical_entry.lemma === sense.lexical_entry.lemma)) {
						fFound = true;
						$scope.currentSynSet.senses[i] = sense;
						break;
					}
				}
				$log.log('saveSense');
				$log.log(fFound);
				if (!fFound) {
					$scope.currentSynSet.senses.push(sense);
				}
			};

			$scope.testSenseSelect = function(sense) {
				var fAdd = true;
				for (k in $scope.currentSynSet.senses) {
					if ($scope.currentSynSet.senses[k].id == sense.id) {
						fAdd = false;
						break;
					}
				}
				if (fAdd) {
					$scope.currentSynSet.senses.push(sense);
				}
			};



			////////////////////
			// Relation methods
			////////////////////

			// Populates relation tree view
			$scope.$watchCollection('currentSynSet.relations', function(newValue, oldValue) {
				if (newValue) {

					$scope.relTree = [
						{
							name : 'Directional (outgoing)',
							type : 'do',
							nodes : []
						},
						{
							name : 'Directional (incoming)',
							type : 'di',
							nodes : []
						},
						{
							name : 'Bidirectional',
							type : 'bd',
							nodes : []
						},
						{
							name : 'Non-directional',
							type : 'nd',
							nodes : []
						}
					];

					var relationsGrouped = _.groupBy($scope.currentSynSet.relations, function(item) {
						return item.rel_type;
					});

					for (k in relationsGrouped) {
						var relType = relTypeService.getById(k);
						var nodes_out = [];
						var nodes_in = [];
						for (k2 in relationsGrouped[k]) {
							var obj = {
								rel : relationsGrouped[k][k2],
								name : relationsGrouped[k][k2].a_label,
								type : 'rel',
								nodes : []
							};
							if (relationsGrouped[k][k2].a_synset == $scope.currentSynSet.id) {
								obj.name = relationsGrouped[k][k2].b_label;
								nodes_out.push(obj);
							}
							if (relationsGrouped[k][k2].b_synset == $scope.currentSynSet.id) {
								nodes_in.push(obj);
								obj.name = relationsGrouped[k][k2].a_label;
							}
						}
						if (relType.direction == 'd') {
							if (nodes_out.length) {
								$scope.relTree[0].nodes.push({
									name : relType.name,
									type : 'rel_type',
									relType : relType,
									relDir : 'ab',
									nodes : nodes_out
								});
							}
							if (nodes_in.length) {
								$scope.relTree[1].nodes.push({
									name : relType.name,
									type : 'rel_type',
									relType : relType,
									relDir : 'ba',
									nodes : nodes_in
								});
							}
						}
						if (relType.direction == 'b') {
							$scope.relTree[2].nodes.push({
								name : relType.name,
								type : 'rel_type',
								relType : relType,
								relDir : 'ab',
								nodes : _.union(nodes_in, nodes_out)
							});
						}
						if (relType.direction == 'n') {
							$scope.relTree[3].nodes.push({
								name : relType.name,
								type : 'rel_type',
								relType : relType,
								relDir : 'ab',
								nodes : _.union(nodes_in, nodes_out)
							});
						}
					}
				}
			});

			$scope.selectRelForView = function(relation) {
				$scope.selectedRel = relation;
				if ($scope.selectedRel) {
					if ($scope.selectedRel.id) {
						$state.go('lexicon.synset.rel', {
							relId : relation.id
						});
					} else {
						$state.go('lexicon.synset').then(function() {
							$state.go('lexicon.synset.rel', {
								relId : null
							}).then(function() {});
						});
					}
				}
			};

			$scope.selectRelForEdit = function(relation) {
				$scope.selectedRel = relation;
				if ($scope.selectedRel) {
					if ($scope.selectedRel.id) {
						$state.go('lexicon.synset_edit.rel_edit', {
							relId : relation.id
						});
					} else {
						$state.go('lexicon.synset_edit.rel_edit', {
							relId : null
						}).then(function() {});
					}
				}
			};

			$scope.getRelation = function(relId) {
				var deferred = $q.defer();

				if (relId) {
					synSetPromise.then(function(synSet) {
						var fFound = false;
						for (k in synSet.relations) {
							if (synSet.relations[k].id == relId) {
								$scope.selectedRel = synSet.relations[k];
								deferred.resolve(synSet.relations[k]);
								fFound = true;
								break;
							}
						}
						if (!fFound) {
							deferred.reject('not found');
						}

					//deferred.resolve(null);
					});
				} else {
					if ($scope.selectedRel) {
						deferred.resolve($scope.selectedRel);
					} else {
						deferred.resolve(null);
					}
				}

				return deferred.promise;
			};

			$scope.getRelationList = function() {
				var deferred = $q.defer();

				$log.log('Get relation list');

				synSetPromise.then(function(synSet) {
					$log.log('relation list resolve');
					deferred.resolve($scope.currentSynSet.relations);
				});

				return deferred.promise;
			};

			// Used by RelCtrl to remove existing relations
			$scope.clearRel = function(relId) {
				synSetService.clearRelation($scope.currentSynSet, relId);
			};

			// Used by RelCtrl to create relations
			$scope.setRel = function(source, target, relTypeId) {
				synSetService.setRelation($scope.currentSynSet, source, target, relTypeId);
			};

			$scope.addRel = function(relType, relDir) {
				$scope.selectedRel = null;
				if (relType) {
					$log.log('set rel type id ' + relType.id);
					$state.go('lexicon.synset_edit.rel_edit', {
						relId : null,
						relTypeId : relType.id,
						relDir : relDir
					});
				} else {
					$log.log('new rel');
					$state.go('lexicon.synset_edit.rel_edit', {
						relId : null
					});
				}
			};

			$scope.discardRel = function() {
				$state.go('^');
			};

			$scope.saveRel = function(rel, selectedRelType, counterRelType, targetSynSet) {
				$state.go('^');
			};

			$scope.deleteRel = function(relation) {
				if (relation) {
					synSetService.clearRelation($scope.currentSynSet, relation.id);
				}
			};



			////////////////////////
			// External ref methods
			////////////////////////

			$scope.addExtRef = function() {
				var newExtRef = {
					system : '',
					sys_id : {},
					reference : '',
					type_ref_code : '',
					rel_type : {}
				};
				$scope.currentSynSet.synset_externals.push(newExtRef);
				$scope.selectedExtRef = newExtRef;
				$scope.tempExtRef = angular.copy(newExtRef);
			};

			$scope.tempExtRef = {};
			$scope.selectedExtRef = null;

			$scope.editExtRef = function(extRef) {
				if ($scope.selectedExtRef) {
					$scope.saveExtRef();
				}
				$scope.tempExtRef = angular.copy(extRef);
				$scope.selectedExtRef = extRef;
			};

			$scope.saveExtRef = function() {
				if ($scope.selectedExtRef) {
					angular.copy($scope.tempExtRef, $scope.selectedExtRef);
					$scope.cancelExtRef();
				}
			};

			$scope.cancelExtRef = function() {
				$scope.selectedExtRef = null;
			};

			$scope.deleteExtRef = function(extRef) {
				var index = $scope.currentSynSet.synset_externals.indexOf(extRef);
				if (index > -1) {
					$scope.currentSynSet.synset_externals.splice(index, 1);
				}
			};

			$scope.setExtRefKey = function(extRef) {
				return $uibModal.open({
					templateUrl : 'view/main/literalSerachModal.html',
					scope : $scope,
					controller : 'main/literalSearchCtrl',
					resolve : {
						searchType : function() {
							return 'synset';
						},
						lexiconMode : function() {
							if ($scope.tempExtRef.sys_id.local_lexicon === null) return 'any'; else return $scope.tempExtRef.sys_id.local_lexicon;
						}
                        , searchMode : function() {return 'select';}
					}
				}).result.then(function(synSet) {
					if (synSet) {
						$scope.tempExtRef.reference = synSet.label;
						$scope.tempExtRef.definition = synSet.primary_definition;
						$scope.tempExtRef.variants_str = synSet.variants_str;
					}
				},
					function(result) {});
			};

			$scope.selectedExtSystemChanged = function() {
				$scope.tempExtRef.system = $scope.tempExtRef.sys_id.name;
			};

			$scope.selectedExtRelTypeChanged = function() {
				$scope.tempExtRef.type_ref_code = $scope.tempExtRef.rel_type.name;
			};

			//////////////////
			// Synset methods
			//////////////////

			$scope.saveSynSet = function() {
				$scope.saveExtRef();

				var savePromise = synSetService.saveSynSet($scope.currentSynSet);

				savePromise.then(function(result) {
					if (result) {
						$scope.originalSynSet = angular.copy($scope.currentSynSet);
					}
				});
	
				return savePromise;
			};

			$scope.saveSynSetPromise = function() {
				var d = $q.defer();
				var p = d.promise;

				$scope.saveSynSet().then(function(synSetResult) {
					d.resolve(synSetResult);
				});

				return p;
			};

			$scope.saveSynSetAction = function() {
				spinnerService.show('searchSynsetSpinner');
				$scope.saveSynSetPromise().then(function(synSetResult) {
					console.log(synSetResult);
					if (synSetResult  && !synSetResult.errorResponse) {
						if ($scope.currentSynSet.id) {
							$scope.setCurrentSynSet($scope.currentSynSet);
							anchorService.pushSynSet($scope.currentSynSet);
							$scope.baseState = $state.get('lexicon.synset');
							$state.go('lexicon.synset', {
								id : $scope.currentSynSet.id
							});
						} else if  (synSetResult.id) {
							$scope.baseState = $state.get('lexicon.synset');
							$state.go('lexicon.synset', {
								id : synSetResult.id
							});
						}
					}
					
				}).then(function() {
					spinnerService.hide('searchSynsetSpinner');
				});
			};

			$scope.editSynSetAction = function() {
                
				if ($scope.currentSynSet.id) {
                    console.debug('start to edit $scope', $scope);
					spinnerService.show('searchSynsetSpinner');
					synSetPromise = wnwbApi.SynSet.get({
						id : $scope.currentSynSet.id,
						mode : 'edit'
					}).$promise;
					$scope.synSetPromise = synSetPromise;
					synSetPromise.then(function(synSet) {
						$scope.setCurrentSynSet(synSet);
						// anchorService.pushSynSet(synSet);
						if (synSet.locked_by == $rootScope.principal.username) {
							$scope.warning = null;
							$scope.baseState = $state.get('lexicon.synset_edit');
                            $rootScope.lastSynset = {id:  synSet.id, selectedTabIndex:$scope.selectedTabIndex};
							$state.go('lexicon.synset_edit', {
								id : synSet.id
							});
						} else {
							$scope.warning = 'This synset is locked by ' + synSet.locked_by + ' since ' + synSet.date_locked;
							$state.go('lexicon.synset', {
								id : synSet.id
							});
						}
					}).then(function() {
						spinnerService.hide('searchSynsetSpinner');
					});
				}
			};

			$scope.discardSynSetChanges = function() {
				//new synset -- reload
				//editing -- reload??? anchor
				//not editing anchor? -- change current synset

				//always reload anchor (relations change)

				console.log('discardSynSetChanges', $scope.anchorSynSet, $scope.currentSynSet);
				if ($scope.anchorSynSet && $scope.currentSynSet) {
					console.log('xxxxxxxxxxx', $scope.currentSynSet.id);
					$scope.baseState = $state.get('lexicon.synset');
					$state.go('lexicon.synset', {
						id : $scope.anchorSynSet.id,
						currentSynSetId : $scope.currentSynSet.id
					}, {
						reload : $scope.baseState
					});
				} else {
					$state.go('home', null, {
						reload : $scope.baseState
					});
				}
			};

			$scope.deleteSynSet = function() {
				console.log('delete', $scope.anchorSynSet, $scope.currentSynSet);
				if ($scope.currentSynSet.id) {
					wnwbApi.SynSet.remove({
						id : $scope.currentSynSet.id
					});
					anchorService.popSynSet($scope.currentSynSet);
					$scope.synSetPromise = null;
					$scope.currentSynSet = null;
					$scope.originalSynSet = null;
				}
				$state.go('home');
			};

			////////
			// Init
			////////

			$scope.init = function() {
				var anchorDeferred = $q.defer();
				$scope.anchorSynSetPromise = anchorDeferred.promise;
				spinnerService.show('searchSynsetSpinner');

				if (synSetId) {
					wnwbApi.SynSet.get({
						id : synSetId
					}).$promise.then(function(synSet) {
						console.log('......................currentSynSetId', currentSynSetId);
						if (currentSynSetId) {
							wnwbApi.SynSet.get({
								id : currentSynSetId
							}).$promise.then(function(currentSynSet) {
								$rootScope.currentSynSetId = currentSynSetId;
								synSetDeferred.resolve(currentSynSet);
								$scope.setCurrentSynSet(currentSynSet);
							});
						} else {
							$rootScope.currentSynSetId = synSet.id;
							var currentSynSet = synSet;
							synSetDeferred.resolve(currentSynSet);
							$scope.setCurrentSynSet(currentSynSet);
						}
                        
                        if ($rootScope.lastSynset){
                            if ($rootScope.lastSynset.id === $rootScope.currentSynSetId) {
                                $scope.selectedTabIndex = $rootScope.lastSynset.selectedTabIndex;                              
                            } else {
                                delete $rootScope.lastSynset;
                            }
                        }
                        
						$scope.anchorSynSet = synSet;
						anchorService.pushSynSet(synSet);
                        lexiconService.setWorkingLexiconIdStayStill(synSet.lexicon);
						anchorDeferred.resolve(synSet);
						spinnerService.hide('searchSynsetSpinner');
					});
				} else {
                    if ($state.includes('lexicon.synset')) {
                        console.debug('[SynSetCtrl.js] synset.id is not set, go to edit mode');
                        $state.go('lexicon.synset_edit');
                    }
					var synSet = new wnwbApi.SynSet();
					synSet.label = null;
					synSet.lexicon = lexiconService.getWorkingLexicon().id;
					synSet.synset_type = 'C';
					synSet.status = 'D';
					synSet.synset_definitions = [];
					synSet.relations = [];
					synSet.synset_externals = [];
					synSet.domain = null;
					synSet.senses = [ {
						lexical_entry : {
							lemma : null,
							part_of_speech : 'n',
							lexicon : synSet.lexicon
						},
						nr : 0,
						status : 'D',
						sense_definitions : [],
						examples : [],
						relations : [],
						sense_externals : []
					} ]

					$scope.anchorSynSet = synSet;

					$scope.setCurrentSynSet(synSet);

					synSetDeferred.resolve(synSet);
					spinnerService.hide('searchSynsetSpinner');
				}
			};

			$q.all([ lexiconService.getWorkingLexiconPromise(), relTypeListPromise ]).then(function(qAllResults) {
				$scope.init();
			});
            
		}
	]);
});